// Captures a landing-page screenshot of every linked portfolio project (for
// Gallery mode) and writes an optimized webp into src/assets/gallery/.
// Drives the system's installed Chrome over the DevTools Protocol (one
// headless process, one tab reused per capture) instead of adding
// Playwright/Puppeteer as a dependency — Node's native WebSocket client
// (stable since Node 22) is all that's needed to talk CDP directly.
//
// Driving it over CDP (rather than Chrome's single-shot `--screenshot`
// flag) is what lets a capture do more than "wait, then shoot": dismiss an
// onboarding dialog, click into a specific in-app view, or just wait
// longer for a slow first paint — see CAPTURE_OPTIONS below.
//
// Run manually whenever work.js's links change: `npm run gallery-shots`.
// Pass titles to only re-capture specific ones: `npm run gallery-shots -- "Circles" "Blast to the Past"`.
const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const { spawn } = require('child_process')
const sharp = require('sharp')

const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
]
const CHROME = CHROME_PATHS.find((p) => fs.existsSync(p))

const OUT_DIR = path.resolve(__dirname, '../src/assets/gallery')
const TMP_DIR = path.resolve(__dirname, '../.gallery-tmp')
const CAPTURE_WIDTH = 1280
const CAPTURE_HEIGHT = 900
const OUTPUT_WIDTH = 900
const DEBUG_PORT = 9333

// Per-project overrides for projects whose default capture (wait ~4s, then
// shoot) didn't produce a usable screenshot.
//   waitMs       — how long to wait after navigation before interacting/shooting
//   pressEscape  — dismiss an onboarding/welcome dialog that opens on load
//   clickText    — click the first element whose text matches, to reach a
//                  specific in-app view (waits a bit more after clicking)
const CAPTURE_OPTIONS = {
  Circles: { waitMs: 9000 },
  'Daily Meditations': { waitMs: 9000 },
  Clika: { waitMs: 11000 },
  'Pump Log': { waitMs: 9000 },
  'My Fit Foods Meal Planner': { waitMs: 5000, pressEscape: true },
  'Home Financing Center': { waitMs: 5000, clickText: 'Skip' },
  RealCost: { waitMs: 5000, clickText: 'Skip' },
  // No reachable "deck" view without an actual multiplayer session (Create
  // requires a typed lobby name, then a second player to join) — the lobby
  // card itself is a real, reasonable "another view," and just needed a
  // real wall-clock wait instead of --virtual-time-budget to render at all.
  'La Lotería': { waitMs: 6000 }
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function waitForChromeTarget(port, retries = 60) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      if (res.ok) {
        const targets = await res.json()
        const page = targets.find((t) => t.type === 'page')
        if (page) return page
      }
    } catch {
      // Chrome's debugger endpoint isn't up yet — keep polling.
    }
    await new Promise((r) => setTimeout(r, 150))
  }
  throw new Error('Chrome DevTools endpoint never came up')
}

function cdpClient(ws) {
  let nextId = 1
  const pending = new Map()
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data)
    if (pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(msg.error.message))
      else resolve(msg.result)
    }
  })
  return function send(method, params = {}) {
    const id = nextId++
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })
  }
}

// Common close/dismiss button shapes across the sites being captured —
// tried only after Escape, as a fallback for dialogs that ignore it.
const CLOSE_BUTTON_SELECTORS_JS = `
  (function () {
    var sels = ['[aria-label="Close" i]', '.modal-close', '.close-button', '.close-btn', 'button.close', '[class*="close" i]', 'svg[class*="close" i]'];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el) { el.click(); return sels[i]; }
    }
    return null;
  })()
`

function clickByTextJs(text) {
  // Exact match after stripping trailing decoration (arrows/chevrons) and
  // requiring real visibility — a plain substring match risks hitting an
  // offscreen "Skip to content" accessibility link (first in DOM order on
  // most sites) instead of the actual visible dialog button, which is
  // usually labeled "Skip →" rather than bare "Skip".
  return `
    (function () {
      var target = ${JSON.stringify(text)};
      var els = Array.prototype.slice.call(document.querySelectorAll('button, a, [role="button"], li, div, span'));
      var match = els.find(function (el) {
        var t = (el.textContent || '').trim().replace(/[^\\p{L}\\p{N} ]+$/gu, '').trim();
        if (t !== target) return false;
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && el.offsetParent !== null;
      });
      if (match) { match.click(); return true; }
      return false;
    })()
  `
}

async function captureOne(item, port) {
  const opts = CAPTURE_OPTIONS[item.title] || {}
  const slug = slugify(item.title)
  const tmpPath = path.join(TMP_DIR, `${slug}.png`)
  const outPath = path.join(OUT_DIR, `${slug}.webp`)

  console.log(`capturing ${item.title} -> ${item.link}`)

  const target = await waitForChromeTarget(port)
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })
  const send = cdpClient(ws)

  try {
    await send('Page.enable')
    await send('Page.navigate', { url: item.link })
    await new Promise((r) => setTimeout(r, opts.waitMs || 4000))

    if (opts.pressEscape) {
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await new Promise((r) => setTimeout(r, 400))
      await send('Runtime.evaluate', { expression: CLOSE_BUTTON_SELECTORS_JS })
      await new Promise((r) => setTimeout(r, 400))
    }

    if (opts.clickText) {
      const { result } = await send('Runtime.evaluate', { expression: clickByTextJs(opts.clickText) })
      if (!result || !result.value) {
        console.warn(`  (no element matched clickText "${opts.clickText}" on ${item.title} — capturing default view)`)
      }
      await new Promise((r) => setTimeout(r, 1200))
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(tmpPath, Buffer.from(data, 'base64'))
  } finally {
    ws.close()
  }

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

  const chromeProc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--window-size=${CAPTURE_WIDTH},${CAPTURE_HEIGHT}`,
    'about:blank'
  ], { stdio: 'ignore' })

  try {
    for (const item of items) {
      try {
        await captureOne(item, DEBUG_PORT)
      } catch (err) {
        console.error(`FAILED on ${item.title}:`, err.message)
      }
    }
  } finally {
    chromeProc.kill()
  }

  fs.rmSync(TMP_DIR, { recursive: true, force: true })
  console.log(`\nDone — ${items.length} screenshot(s) in ${OUT_DIR}`)
}

main()
