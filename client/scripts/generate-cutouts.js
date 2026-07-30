// Turns whatever's dropped in src/assets/collage/ into an optimized cutout
// in src/assets/collage/cutouts/. Run manually whenever new images are
// added: `npm run cutouts`.
//
// Two input types, handled automatically:
//   1. A plain rectangular photo -> gets a generated torn-paper treatment:
//      a white paper margin, then the whole thing (photo + margin) torn
//      along a random irregular edge baked into real alpha transparency.
//      Different every run — CollageClipping.vue's CSS clip-path fallback
//      only has a few fixed preset shapes, this is genuinely random.
//   2. An image you already hand-cut yourself (real alpha transparency,
//      e.g. exported from Canva/Photoshop with the background removed) ->
//      gets a white "sticker" border that follows your exact cut edge
//      (the alpha silhouette dilated outward, not a rectangle), downsized,
//      and recompressed to WebP so a multi-MB PNG doesn't ship at full size
//      for a 200px-wide decorative accent.
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const SRC_DIR = path.resolve(__dirname, '../src/assets/collage')
const OUT_DIR = path.join(SRC_DIR, 'cutouts')
const MAX_WIDTH = 900
const BORDER_RATIO = 0.045 // paper margin as a fraction of the shorter side
const BORDER_MIN = 16
const BORDER_MAX = 42
const BORDER_COLOR = { r: 255, g: 255, b: 255, alpha: 1 }

function randRange (min, max) {
  return min + Math.random() * (max - min)
}

// Walks the perimeter of a width x height rect and jitters each interior
// point inward (paper can only be torn away, never added back), with
// occasional deeper notches mixed into mostly-shallow waviness.
function buildTornPath (width, height, segmentsPerEdge = 16) {
  const minDim = Math.min(width, height)
  const baseJitter = minDim * 0.018
  const deepJitter = minDim * 0.06
  const jitter = () => (Math.random() < 0.18 ? randRange(baseJitter, deepJitter) : randRange(0, baseJitter))

  const pts = []
  for (let i = 0; i <= segmentsPerEdge; i++) {
    pts.push([(width * i) / segmentsPerEdge, i === 0 || i === segmentsPerEdge ? 0 : jitter()])
  }
  for (let i = 1; i <= segmentsPerEdge; i++) {
    pts.push([i === segmentsPerEdge ? width : width - jitter(), (height * i) / segmentsPerEdge])
  }
  for (let i = 1; i <= segmentsPerEdge; i++) {
    pts.push([width - (width * i) / segmentsPerEdge, i === segmentsPerEdge ? height : height - jitter()])
  }
  for (let i = 1; i <= segmentsPerEdge; i++) {
    pts.push([i === segmentsPerEdge ? 0 : jitter(), height - (height * i) / segmentsPerEdge])
  }

  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'
}

async function isAlreadyCutOut (inputPath) {
  const meta = await sharp(inputPath).metadata()
  if (!meta.hasAlpha) return false
  const stats = await sharp(inputPath).stats()
  const alpha = stats.channels[stats.channels.length - 1]
  // Real cutouts have genuinely transparent pixels (alpha reaching 0), not
  // just a uniform opaque alpha channel some exporters add by default.
  return alpha.min === 0
}

async function generateTorn (file) {
  const inputPath = path.join(SRC_DIR, file)
  const meta = await sharp(inputPath).rotate().metadata()

  const innerWidth = Math.min(meta.width, MAX_WIDTH)
  const innerHeight = Math.round(meta.height * (innerWidth / meta.width))

  const border = Math.round(Math.min(Math.max(innerWidth, innerHeight) * BORDER_RATIO, BORDER_MAX))
  const borderClamped = Math.max(border, BORDER_MIN)

  const paddedWidth = innerWidth + borderClamped * 2
  const paddedHeight = innerHeight + borderClamped * 2

  const photoBuffer = await sharp(inputPath).rotate().resize(innerWidth, innerHeight).toBuffer()

  const padded = await sharp({
    create: {
      width: paddedWidth,
      height: paddedHeight,
      channels: 4,
      background: BORDER_COLOR
    }
  })
    .composite([{ input: photoBuffer, left: borderClamped, top: borderClamped }])
    .png()
    .toBuffer()

  const pathD = buildTornPath(paddedWidth, paddedHeight)
  const svg = `<svg width="${paddedWidth}" height="${paddedHeight}" xmlns="http://www.w3.org/2000/svg"><path d="${pathD}" fill="#fff"/></svg>`
  const mask = await sharp(Buffer.from(svg)).blur(1.4).png().toBuffer()

  const outPath = path.join(OUT_DIR, file.replace(/\.[^.]+$/, '') + '.webp')

  await sharp(padded)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .webp({ quality: 88 })
    .toFile(outPath)

  console.log(`tear  ${file} -> cutouts/${path.basename(outPath)}  (${paddedWidth}x${paddedHeight}, border ${borderClamped}px)`)
}

// Wraps a white "sticker" border around an already-transparent cutout by
// dilating its own alpha silhouette outward (blur + threshold), not by
// placing it on a white rectangle — the border follows your exact cut edge.
async function addStickerBorder (file) {
  const inputPath = path.join(SRC_DIR, file)
  const trimmedMeta = await sharp(inputPath).trim().metadata()

  const shortSide = Math.min(trimmedMeta.width, trimmedMeta.height)
  const border = Math.max(BORDER_MIN, Math.min(Math.round(shortSide * BORDER_RATIO * 1.4), BORDER_MAX))
  const pad = border * 3 // room for the blur to dilate into without clipping

  const padded = await sharp(inputPath)
    .trim()
    .ensureAlpha()
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  const paddedMeta = await sharp(padded).metadata()

  // Dilate the alpha silhouette outward by ~`border` px: blur then threshold
  // back to a hard edge so the border has a clean (if slightly soft) rim.
  const dilatedAlpha = await sharp(padded)
    .extractChannel('alpha')
    .blur(Math.max(border * 0.5, 0.3))
    .threshold(18)
    .png()
    .toBuffer()

  const whiteLayer = await sharp({
    create: { width: paddedMeta.width, height: paddedMeta.height, channels: 3, background: { r: 255, g: 255, b: 255 } }
  })
    .joinChannel(dilatedAlpha)
    .png()
    .toBuffer()

  // NOTE: sharp applies trim/resize/extract in a fixed internal order
  // regardless of call order, so `.composite().trim()` in one chain would
  // trim the *base* before compositing (shrinking it), not the result —
  // causing the overlay to no longer fit. Materialize the composite first,
  // then trim as a genuinely separate pipeline stage.
  const compositedRaw = await sharp(whiteLayer)
    .composite([{ input: padded, left: 0, top: 0 }])
    .png()
    .toBuffer()

  const composited = await sharp(compositedRaw).trim().png().toBuffer()

  const outPath = path.join(OUT_DIR, file.replace(/\.[^.]+$/, '') + '.webp')
  const compositedMeta = await sharp(composited).metadata()
  let out = sharp(composited)
  if (compositedMeta.width > MAX_WIDTH) {
    out = out.resize({ width: MAX_WIDTH })
  }
  await out.webp({ quality: 90 }).toFile(outPath)

  console.log(`sticker ${file} -> cutouts/${path.basename(outPath)}  (white border ~${border}px)`)
}

async function main () {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const files = fs.readdirSync(SRC_DIR).filter(f =>
    /\.(jpe?g|png|webp)$/i.test(f) && fs.statSync(path.join(SRC_DIR, f)).isFile()
  )
  if (!files.length) {
    console.log('No source images found in', SRC_DIR)
    return
  }
  for (const file of files) {
    const inputPath = path.join(SRC_DIR, file)
    try {
      if (await isAlreadyCutOut(inputPath)) {
        await addStickerBorder(file)
      } else {
        await generateTorn(file)
      }
    } catch (err) {
      console.error(`FAILED on ${file}:`, err.message)
      throw err
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
