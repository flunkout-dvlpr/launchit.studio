// Captures a landing-page screenshot of every linked portfolio project (for
// Gallery mode) and writes an optimized webp into src/assets/gallery/.
// Uses the system's installed Chrome directly in headless mode (its
// `--screenshot` flag) rather than adding Playwright/Puppeteer as a
// dependency just for this — one extra binary path constant instead of a
// few hundred MB of new node_modules.
//
// Run manually whenever work.js's links change: `npm run gallery-shots`.
// Pass titles to only re-capture specific ones: `npm run gallery-shots -- "Circles" "Blast to the Past"`.
const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const { execFileSync } = require('child_process')
const sharp = require('sharp')

const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
]
const CHROME = CHROME_PATHS.find((p) => fs.existsSync(p))

const OUT_DIR = path.resolve(__dirname, '../src/assets/gallery')
const TMP_DIR = path.resolve(__dirname, '../.gallery-tmp')
const CAPTURE_SIZE = '1280,900'
const OUTPUT_WIDTH = 900

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function captureOne(item) {
  const slug = slugify(item.title)
  const tmpPath = path.join(TMP_DIR, `${slug}.png`)
  const outPath = path.join(OUT_DIR, `${slug}.webp`)

  console.log(`capturing ${item.title} -> ${item.link}`)
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    `--screenshot=${tmpPath}`,
    `--window-size=${CAPTURE_SIZE}`,
    '--virtual-time-budget=4000', // gives client-side-rendered/hash-routed pages a moment to paint
    item.link
  ], { stdio: 'inherit' })

  await sharp(tmpPath)
    .resize({ width: OUTPUT_WIDTH })
    .webp({ quality: 82 })
    .toFile(outPath)

  console.log(`  -> ${path.relative(process.cwd(), outPath)}`)
}

async function main() {
  if (!CHROME) {
    console.error('No Chrome/Edge install found at the expected paths — edit CHROME_PATHS in this script.')
    process.exit(1)
  }

  // work.js is an ES module (export default), this script is plain
  // CommonJS — dynamic import() is the one thing that can load it from
  // here without a build step, and keeps this script reading the same
  // data the site itself does instead of a separately-maintained list.
  const workModule = await import(pathToFileURL(path.resolve(__dirname, '../src/data/work.js')).href)
  const work = workModule.default

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(TMP_DIR, { recursive: true })

  const only = process.argv.slice(2)
  const items = work.filter((item) => item.link && (only.length === 0 || only.includes(item.title)))

  for (const item of items) {
    try {
      await captureOne(item)
    } catch (err) {
      console.error(`FAILED on ${item.title}:`, err.message)
    }
  }

  fs.rmSync(TMP_DIR, { recursive: true, force: true })
  console.log(`\nDone — ${items.length} screenshot(s) in ${OUT_DIR}`)
}

main()
