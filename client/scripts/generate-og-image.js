// Generates public/og-image.png (1200x630), the social share image referenced
// by the og:image / twitter:image tags in index.html. Renders a small HTML
// card with the site's own fonts and colors in the system's installed Chrome,
// then crops to exactly 1200x630.
//
// Run manually when the branding or tagline changes: `npm run og-image`.
const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const { execFileSync } = require('child_process')
const sharp = require('sharp')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find((p) => fs.existsSync(p))

const ROOT = path.resolve(__dirname, '..')
const TMP_DIR = path.join(ROOT, '.og-tmp')
const OUT = path.join(ROOT, 'public', 'og-image.png')
const font = (pkg, file) => pathToFileURL(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file)).href
const rocket = fs.readFileSync(path.join(ROOT, 'public', 'favicon.svg'), 'utf8')

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Fraunces'; font-weight: 600; src: url('${font('fraunces', 'fraunces-latin-600-normal.woff2')}'); }
  @font-face { font-family: 'Fraunces'; font-weight: 400; font-style: italic; src: url('${font('fraunces', 'fraunces-latin-400-italic.woff2')}'); }
  @font-face { font-family: 'Space Grotesk'; font-weight: 500; src: url('${font('space-grotesk', 'space-grotesk-latin-500-normal.woff2')}'); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; background: #f4f0e6; overflow: hidden; }
  .card { position: relative; width: 1200px; height: 630px; padding: 72px 88px; color: #1e2b3c; }
  .grid { position: absolute; inset: 0; opacity: 0.5;
    background-image: linear-gradient(rgba(62,124,166,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(62,124,166,0.16) 1px, transparent 1px);
    background-size: 48px 48px; }
  .rocket { position: absolute; right: 64px; top: 205px; width: 300px; height: 300px; }
  .rocket svg { width: 100%; height: 100%; }
  .pill { position: relative; display: inline-block; font: 500 22px 'Space Grotesk'; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 8px 20px; background: #ef9f27; border: 2px solid #1e2b3c; border-radius: 999px; transform: rotate(-2deg); }
  h1 { position: relative; font: 600 104px/1.02 'Fraunces', serif; letter-spacing: -0.02em; margin-top: 40px; }
  h1 span { color: #d85a30; }
  .tag { position: relative; font: italic 400 44px 'Fraunces', serif; margin-top: 28px; opacity: 0.85; }
  .foot { position: absolute; left: 88px; right: 88px; bottom: 64px; font: 500 28px 'Space Grotesk'; opacity: 0.7; display: flex; justify-content: space-between; }
</style></head><body>
  <div class="card">
    <div class="grid"></div>
    <div class="rocket">${rocket}</div>
    <span class="pill">Houston</span>
    <h1>launchit<span>.</span>studio</h1>
    <p class="tag">Build things.</p>
    <div class="foot"><span>Websites and apps for small businesses</span><span>Notes · Sessions</span></div>
  </div>
</body></html>`

fs.mkdirSync(TMP_DIR, { recursive: true })
const htmlPath = path.join(TMP_DIR, 'og.html')
const rawPath = path.join(TMP_DIR, 'og-raw.png')
fs.writeFileSync(htmlPath, html)

// --window-size includes the browser chrome (~140px), so ask for a taller
// window and crop to the exact 1200x630 afterwards.
execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
  '--window-size=1200,900', '--virtual-time-budget=4000',
  `--screenshot=${rawPath}`, pathToFileURL(htmlPath).href
], { stdio: 'ignore' })

sharp(rawPath)
  .extract({ left: 0, top: 0, width: 1200, height: 630 })
  .png({ compressionLevel: 9 })
  .toFile(OUT)
  .then(() => {
    fs.rmSync(TMP_DIR, { recursive: true, force: true })
    console.log(`wrote ${path.relative(process.cwd(), OUT)}`)
  })
