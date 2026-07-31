// Pulls the last N emails from the inbox and saves the ones matching
// keywords.md (checked against subject + body, case-insensitive) to
// data/matches.json. Run scripts/auth.js first.

const fs = require('fs').promises
const path = require('path')
const { google } = require('googleapis')

const TOKEN_PATH = path.join(__dirname, '..', 'token.json')
const KEYWORDS_PATH = path.join(__dirname, '..', 'keywords.md')
const SETTINGS_PATH = path.join(__dirname, '..', 'settings.md')
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'matches.json')

const SETTINGS_DEFAULTS = { emails_to_check: 25, skip_bulk_mail: true }

async function loadClient () {
  const content = await fs.readFile(TOKEN_PATH)
  const credentials = JSON.parse(content)
  return google.auth.fromJSON(credentials)
}

async function loadKeywords () {
  const raw = await fs.readFile(KEYWORDS_PATH, 'utf8')
  return raw
    .split('\n')
    .map(line => line.replace(/^[-*]\s*/, '').trim().toLowerCase())
    .filter(Boolean)
}

// settings.md holds simple "key: value" lines (a "- " bullet is optional).
// Missing file or unrecognized lines just fall back to SETTINGS_DEFAULTS,
// this is meant to be hand-edited by someone with no coding background, so
// it shouldn't be able to crash the script.
async function loadSettings () {
  const settings = { ...SETTINGS_DEFAULTS }
  let raw
  try {
    raw = await fs.readFile(SETTINGS_PATH, 'utf8')
  } catch (err) {
    return settings
  }
  for (const line of raw.split('\n')) {
    const match = line.match(/^[-*]?\s*(\w+)\s*:\s*(.+?)\s*$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (!(key in SETTINGS_DEFAULTS)) continue
    if (rawValue === 'true' || rawValue === 'false') {
      settings[key] = rawValue === 'true'
    } else if (!Number.isNaN(Number(rawValue))) {
      settings[key] = Number(rawValue)
    }
  }
  return settings
}

function getHeader (headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase())
  return header ? header.value : ''
}

const MAX_BODY_LENGTH = 3000

function decodeBase64Url (data) {
  return Buffer.from(data, 'base64url').toString('utf8')
}

function stripHtml (html) {
  // <style>/<script> tags need their whole contents removed, not just the
  // tags themselves, otherwise raw CSS/JS is left behind as "plain text".
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Gmail messages come in wildly different shapes: a plain-text email has
// body.data directly on the payload, an HTML-only email also has body.data
// directly on the payload (but needs tag-stripping, easy to miss), and a
// multipart email nests the real content under .parts. Every branch here
// needs to check payload.mimeType, not just where the data lives, or HTML
// markup slips through raw, one single marketing email can otherwise
// balloon into tens of thousands of characters of table/style markup.
function extractBody (payload) {
  if (payload.body && payload.body.data) {
    const decoded = decodeBase64Url(payload.body.data)
    return payload.mimeType === 'text/html' ? stripHtml(decoded) : decoded
  }
  if (!payload.parts) return ''

  const plainPart = payload.parts.find(p => p.mimeType === 'text/plain')
  if (plainPart && plainPart.body && plainPart.body.data) {
    return decodeBase64Url(plainPart.body.data)
  }

  const htmlPart = payload.parts.find(p => p.mimeType === 'text/html')
  if (htmlPart && htmlPart.body && htmlPart.body.data) {
    return stripHtml(decodeBase64Url(htmlPart.body.data))
  }

  // Multipart/mixed or nested multipart, recurse into the first part with content.
  for (const part of payload.parts) {
    const body = extractBody(part)
    if (body) return body
  }
  return ''
}

function truncateBody (body) {
  if (body.length <= MAX_BODY_LENGTH) return body
  return body.slice(0, MAX_BODY_LENGTH) + ' [truncated]'
}

function matchesKeywords (subject, body, keywords) {
  const haystack = `${subject}\n${body}`.toLowerCase()
  return keywords.filter(keyword => haystack.includes(keyword))
}

// Newsletters and marketing platforms are required (CAN-SPAM) to include
// this header on bulk mail; real one-to-one customer emails never have it.
// Without this, a generic keyword like "tracking" matches an unrelated
// marketing email about a product feature just as easily as a real
// customer asking where their order is. Controlled by settings.md's
// skip_bulk_mail, on by default.
function isBulkMail (headers) {
  return Boolean(getHeader(headers, 'List-Unsubscribe'))
}

async function main () {
  const settings = await loadSettings()
  // A number typed after the command (e.g. `node scripts/fetch-emails.js 100`)
  // overrides settings.md for that one run only, without changing the file.
  const N = Number(process.argv[2]) || settings.emails_to_check

  const auth = await loadClient()
  const gmail = google.gmail({ version: 'v1', auth })
  const keywords = await loadKeywords()

  console.log(`Fetching last ${N} messages (bulk-mail filter: ${settings.skip_bulk_mail ? 'on' : 'off'})...`)
  // Without labelIds restricting to INBOX, this pulls from the whole
  // account, including mail the user sent themselves. A "reply to this"
  // tool has no business drafting a reply to something the user wrote.
  const list = await gmail.users.messages.list({ userId: 'me', maxResults: N, labelIds: ['INBOX'] })
  const ids = (list.data.messages || []).map(m => m.id)

  const matches = []
  let skippedBulk = 0
  for (const id of ids) {
    const res = await gmail.users.messages.get({ userId: 'me', id, format: 'full' })
    const headers = res.data.payload.headers
    const subject = getHeader(headers, 'Subject')
    const from = getHeader(headers, 'From')
    const date = getHeader(headers, 'Date')

    if (settings.skip_bulk_mail && isBulkMail(headers)) {
      skippedBulk++
      continue
    }

    const body = extractBody(res.data.payload)
    const matchedKeywords = matchesKeywords(subject, body, keywords)
    if (matchedKeywords.length > 0) {
      matches.push({ id, from, subject, date, body: truncateBody(body.trim()), matchedKeywords })
      console.log(`Match: "${subject}" (${matchedKeywords.join(', ')})`)
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(matches, null, 2))
  console.log(`\n${matches.length} of ${ids.length} messages matched (${skippedBulk} bulk/newsletter messages skipped). Saved to data/matches.json`)
}

main().catch(err => {
  console.error('Fetch failed:', err.message)
  process.exit(1)
})
