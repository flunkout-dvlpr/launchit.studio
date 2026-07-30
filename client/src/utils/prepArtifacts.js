import { load as parseYaml } from 'js-yaml'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

const rawFiles = import.meta.glob('/src/content/prep/*.md', { as: 'raw', eager: true })

function parse (raw) {
  const match = FRONTMATTER_RE.exec(raw)
  if (!match) {
    throw new Error('Prep artifact markdown is missing frontmatter')
  }
  const meta = parseYaml(match[1])
  const html = md.render(match[2])
  return { meta, html }
}

// `order` is a flat numeric sort key shared by every artifact regardless of
// type (demo series or real cycle) — simpler than trying to interleave
// `part` and `cycle` numbering schemes.
const artifacts = Object.values(rawFiles)
  .map(parse)
  .sort((a, b) => a.meta.order - b.meta.order)

export function getAllPrepArtifacts () {
  return artifacts
}

export function getPrepArtifactBySlug (slug) {
  return artifacts.find(a => a.meta.slug === slug)
}

// Demo-series entries are worked examples, not real submitted cycles — never
// eligible to show as the site's "current cycle."
export function getCurrentCycle () {
  const cycles = artifacts.filter(a => a.meta.type !== 'demo')
  return cycles.find(a => a.meta.status === 'current') || cycles[cycles.length - 1]
}
