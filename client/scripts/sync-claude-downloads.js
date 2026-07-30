// Copies the canonical CLAUDE.md from each sessions-archive project into
// client/public/downloads/ so the site can offer it as a static download.
// sessions-archive/ is the copy of record — never hand-edit the output here.

const fs = require('fs')
const path = require('path')

const ARCHIVE_DIR = path.resolve(__dirname, '../../sessions-archive')
const OUTPUT_DIR = path.resolve(__dirname, '../public/downloads')

function outputSlug (folderName) {
  return folderName.startsWith('demo-') ? folderName.slice('demo-'.length) : folderName
}

function sync () {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.warn(`sync-claude-downloads: no sessions-archive folder found at ${ARCHIVE_DIR}, skipping`)
    return
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const projectDirs = fs.readdirSync(ARCHIVE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())

  let synced = 0

  for (const dir of projectDirs) {
    const sourcePath = path.join(ARCHIVE_DIR, dir.name, 'CLAUDE.md')
    if (!fs.existsSync(sourcePath)) continue

    const outputPath = path.join(OUTPUT_DIR, `${outputSlug(dir.name)}-CLAUDE.md`)
    fs.copyFileSync(sourcePath, outputPath)
    console.log(`sync-claude-downloads: ${dir.name}/CLAUDE.md -> public/downloads/${path.basename(outputPath)}`)
    synced++
  }

  console.log(`sync-claude-downloads: synced ${synced} file(s)`)
}

sync()
