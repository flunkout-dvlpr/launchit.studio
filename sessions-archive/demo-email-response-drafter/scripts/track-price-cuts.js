// Pulls Zillow "price cut" alert emails from the inbox and extracts them
// into structured JSON (data/price-cuts.json) — address, price, cut amount,
// cut date, beds/baths/sqft, a clean listing link. Deliberately does NOT
// apply policy.md filtering or write any prose here — this script's only
// job is turning scattered emails into clean facts. Deciding which listings
// are worth surfacing and writing up the table is the drafting instruction
// in CLAUDE.md's job, same separation fetch-emails.js/matches.json already
// use for the reply-drafting flow.
//
// Usage: node scripts/track-price-cuts.js [count]   (default 150)

const fs = require('fs').promises
const path = require('path')
const { google } = require('googleapis')

const TOKEN_PATH = path.join(__dirname, '..', 'token.json')
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'price-cuts.json')

async function loadClient () {
  const content = await fs.readFile(TOKEN_PATH)
  const credentials = JSON.parse(content)
  return google.auth.fromJSON(credentials)
}

function getHeader (headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase())
  return header ? header.value : ''
}

function decodeBase64Url (data) {
  return Buffer.from(data, 'base64url').toString('utf8')
}

// Same shape-handling as fetch-emails.js's extractBody — Zillow's price-cut
// alerts are plain text in practice, but check payload.mimeType properly
// rather than assuming, same reasoning as documented there.
function extractBody (payload) {
  if (payload.body && payload.body.data) {
    return decodeBase64Url(payload.body.data)
  }
  if (!payload.parts) return ''
  const plainPart = payload.parts.find(p => p.mimeType === 'text/plain')
  if (plainPart && plainPart.body && plainPart.body.data) {
    return decodeBase64Url(plainPart.body.data)
  }
  for (const part of payload.parts) {
    const body = extractBody(part)
    if (body) return body
  }
  return ''
}

// Pulls the facts out of a price-cut alert body. Real example this was
// built against:
//   "$399,000 | Price cut: $10.5K (8/18)"
//   "3 bd | 3 ba | 1,830 sqft"
//   "303 Blueberry St #B, Houston, TX"
//   "...homedetails/339418825_zpid/..."
// Returns null (skip, don't guess) if the shape doesn't match — Zillow
// changes email templates over time, a silently-wrong parse is worse than
// a skipped listing.
function parseListing (body) {
  const priceMatch = body.match(/\$([\d,]+)\s*\|\s*Price cut:\s*\$?([\d.]+[KM]?)\s*\(([\d/]+)\)/i)
  if (!priceMatch) return null

  const bedBathMatch = body.match(/(\d+)\s*bd\s*\|\s*(\d+)\s*ba\s*\|\s*([\d,]+)\s*sqft/i)
  const addressMatch = body.match(/\n([^\n,]+,\s*[^\n,]+,\s*[A-Z]{2})\n/)
  const zpidMatch = body.match(/homedetails%2F(\d+)_zpid/)

  return {
    address: addressMatch ? addressMatch[1].trim() : null,
    price: Number(priceMatch[1].replace(/,/g, '')),
    priceCutRaw: priceMatch[2],
    priceCutDate: priceMatch[3],
    beds: bedBathMatch ? Number(bedBathMatch[1]) : null,
    baths: bedBathMatch ? Number(bedBathMatch[2]) : null,
    sqft: bedBathMatch ? Number(bedBathMatch[3].replace(/,/g, '')) : null,
    url: zpidMatch ? `https://www.zillow.com/homedetails/${zpidMatch[1]}_zpid/` : null
  }
}

async function main () {
  // How many MATCHING price-cut emails to pull, most recent first — not
  // how many inbox messages to scan. Searching Gmail directly for
  // `from:zillow subject:"price cut"` instead of paging through recent
  // inbox mail and filtering locally means every message fetched is
  // already a real match, no budget wasted on the other ~97% of mail
  // that was never going to match anyway.
  const N = Number(process.argv[2]) || 50

  const auth = await loadClient()
  const gmail = google.gmail({ version: 'v1', auth })

  console.log(`Searching for the ${N} most recent Zillow price-cut alerts...`)
  const list = await gmail.users.messages.list({
    userId: 'me',
    q: 'in:inbox from:zillow subject:"price cut"',
    maxResults: N
  })
  const ids = (list.data.messages || []).map(m => m.id)

  const listings = []
  let skippedUnparsed = 0

  for (const id of ids) {
    const full = await gmail.users.messages.get({ userId: 'me', id, format: 'full' })
    const headers = full.data.payload.headers
    const subject = getHeader(headers, 'Subject')
    const date = getHeader(headers, 'Date')

    const body = extractBody(full.data.payload)
    const parsed = parseListing(body)

    if (!parsed) {
      skippedUnparsed++
      console.log(`Could not parse: "${subject}" (id ${id}) — skipped, not guessed at`)
      continue
    }

    listings.push({ id, subject, date, ...parsed })
    console.log(`Found: ${parsed.address || subject} — $${parsed.price?.toLocaleString()} (cut ${parsed.priceCutRaw} on ${parsed.priceCutDate})`)
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(listings, null, 2))
  console.log(`\n${listings.length} price-cut listing(s) parsed (${skippedUnparsed} matched but couldn't be parsed). Saved to data/price-cuts.json`)
}

main().catch(err => {
  console.error('Track failed:', err.message)
  process.exit(1)
})
