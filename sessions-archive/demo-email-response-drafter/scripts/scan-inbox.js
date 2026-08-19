// Exploration tool, separate from the drafter's keyword-matching flow: pulls
// the last N inbox messages (sender + subject only, no bodies — enough to
// spot patterns without pulling full email content) and writes a raw list
// plus a by-sender-domain frequency count, so a real use case can be found
// by looking at what actually shows up, not guessed at.
//
// Usage: node scripts/scan-inbox.js [count]   (default 150)

const fs = require('fs').promises
const path = require('path')
const { google } = require('googleapis')

const TOKEN_PATH = path.join(__dirname, '..', 'token.json')
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'inbox-scan.json')

async function loadClient () {
  const content = await fs.readFile(TOKEN_PATH)
  const credentials = JSON.parse(content)
  return google.auth.fromJSON(credentials)
}

function getHeader (headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase())
  return header ? header.value : ''
}

function parseSenderDomain (from) {
  const match = from.match(/@([\w.-]+)/)
  return match ? match[1].toLowerCase() : from.toLowerCase()
}

async function main () {
  const N = Number(process.argv[2]) || 150

  const auth = await loadClient()
  const gmail = google.gmail({ version: 'v1', auth })

  console.log(`Scanning last ${N} inbox messages (sender + subject only)...`)
  const list = await gmail.users.messages.list({ userId: 'me', maxResults: N, labelIds: ['INBOX'] })
  const ids = (list.data.messages || []).map(m => m.id)

  const entries = []
  for (const id of ids) {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'metadata',
      metadataHeaders: ['From', 'Subject', 'Date', 'List-Unsubscribe']
    })
    const headers = res.data.payload.headers
    const from = getHeader(headers, 'From')
    entries.push({
      from,
      domain: parseSenderDomain(from),
      subject: getHeader(headers, 'Subject'),
      date: getHeader(headers, 'Date'),
      bulk: Boolean(getHeader(headers, 'List-Unsubscribe'))
    })
  }

  const byDomain = {}
  for (const e of entries) {
    byDomain[e.domain] = (byDomain[e.domain] || 0) + 1
  }
  const domainCounts = Object.entries(byDomain).sort((a, b) => b[1] - a[1])

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify({ entries, domainCounts }, null, 2))

  console.log(`\nScanned ${entries.length} messages. Top senders by domain:`)
  for (const [domain, count] of domainCounts.slice(0, 20)) {
    console.log(`  ${String(count).padStart(3)}  ${domain}`)
  }
  console.log(`\nFull list (sender + subject, no bodies) saved to data/inbox-scan.json`)
}

main().catch(err => {
  console.error('Scan failed:', err.message)
  process.exit(1)
})
