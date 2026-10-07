<template>
  <q-page class="vt-page grid-texture">
    <div ref="root" class="vt-page__inner vt-screen-only">
      <header class="vt-header reveal">
        <router-link to="/notes/validation-ladder" class="vt-back font-label" @click="trackEvent('notes_back_click', { from: 'toolkit' })">← The Validation Ladder</router-link>
        <span class="pill-tag pill-tag--gold tilt-right">NOTES · PART 2</span>
        <h1 class="font-display vt-header__title">The validation toolkit.</h1>
        <p class="font-label vt-header__lede">
          A canvas and a segment list don't prove anything by themselves. They just
          make it obvious which boxes are filled with real evidence and which are
          filled with a good guess. For most ideas at the start, almost every block
          below starts in the second category — that's fine, as long as it's
          labeled honestly instead of treated like proof.
        </p>
      </header>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vt-label">A canvas to fill in</h2>
        <p class="font-label vt-body">
          For each block, write the current answer, then mark it
          <b>Validated</b> (from a real tier 1-3 test), <b>Assumed</b> (a good
          guess, not yet tested), or <b>Unknown</b> (not addressed yet).
        </p>
        <div class="vt-table-wrap">
          <table class="vt-table vt-table--canvas">
            <thead>
              <tr><th>Block</th><th>Prompt</th><th>Your answer</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in canvas" :key="row.block">
                <td class="vt-table__block">{{ row.block }}</td>
                <td class="vt-table__prompt">{{ row.prompt }}</td>
                <td>
                  <textarea
                    v-model="row.answer"
                    class="vt-input"
                    rows="2"
                    placeholder="Write it in…"
                    :aria-label="`Your answer for ${row.block}`"
                  />
                </td>
                <td class="vt-table__status">
                  <div class="vt-status">
                    <button
                      v-for="option in STATUS_OPTIONS"
                      :key="option"
                      type="button"
                      class="vt-status__btn"
                      :class="[`vt-status__btn--${option.toLowerCase()}`, { 'vt-status__btn--active': row.status === option }]"
                      @click="row.status = option"
                    >{{ option }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vt-label">A segment table to fill in</h2>
        <p class="font-label vt-body">Add a row per segment the idea is aimed at. The "status" column is the one people skip, and it's the one that matters.</p>
        <div class="vt-table-wrap">
          <table class="vt-table">
            <thead>
              <tr><th>Segment</th><th>Assumed need</th><th>Status</th><th>How to validate</th></tr>
            </thead>
            <tbody>
              <tr class="vt-table__example">
                <td>Busy working parents</td>
                <td>Wants more time back in the week</td>
                <td>Assumed, from the founder's own experience</td>
                <td>Interview 8-10 people matching this profile who aren't already in the founder's network</td>
              </tr>
              <tr v-for="(row, i) in segments" :key="i">
                <td><textarea v-model="row.segment" class="vt-input" rows="1" aria-label="Segment" /></td>
                <td><textarea v-model="row.need" class="vt-input" rows="1" aria-label="Assumed need" /></td>
                <td><textarea v-model="row.status" class="vt-input" rows="1" aria-label="Status" /></td>
                <td class="vt-table__row-with-remove">
                  <textarea v-model="row.howToValidate" class="vt-input" rows="1" aria-label="How to validate" />
                  <button type="button" class="vt-remove" aria-label="Remove this segment row" @click="removeSegment(i)">×</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="vt-add-row font-label" @click="addSegment">+ Add a segment</button>
      </section>

      <p class="vt-persist-note font-label">
        <span>Saved automatically in your browser as you type — nothing is sent anywhere.</span>
        <span class="vt-persist-note__actions">
          <button type="button" class="vt-export" @click="exportPdf">Export as PDF ↓</button>
          <button type="button" class="vt-export" @click="exportMarkdown">Export as Markdown ↓</button>
          <button type="button" class="vt-clear" @click="onClearAll">Clear everything</button>
        </span>
      </p>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vt-label">Interview questions: good versus bad</h2>
        <p class="font-label vt-body">
          The whole discipline is <i>The Mom Test</i> in one sentence: ask about
          specific things that already happened in the past, never about
          hypothetical future behavior, and never mention the idea until the second
          half of the conversation.
        </p>

        <div class="vt-qa">
          <div class="vt-qa__col vt-qa__col--good">
            <h3 class="font-label vt-qa__heading">Produce real evidence</h3>
            <ul class="vt-qa__list">
              <li>"Tell me about the last time you ran into this. Walk me through what happened, starting from the first moment you noticed it."</li>
              <li>"What was the very first thing you did about it?"</li>
              <li>"How did you find the people or tools you ended up using?"</li>
              <li>"What did you end up paying, roughly, across everything?"</li>
              <li>"What was the hardest or most frustrating part of the whole thing?"</li>
              <li>"Did you look for any kind of solution anywhere? What did you find, if anything?"</li>
              <li><b>"Do you know anyone else dealing with this right now? Could you introduce me?"</b> — the strongest closing question. A real referral costs them something, so it's a real signal, where a compliment costs nothing.</li>
            </ul>
          </div>
          <div class="vt-qa__col vt-qa__col--bad">
            <h3 class="font-label vt-qa__heading">Feel like validation, aren't</h3>
            <ul class="vt-qa__list">
              <li>"Do you think something like this would be helpful?" — hypothetical, invites politeness.</li>
              <li>"Would you use a product that did X?" — leading, pitches the solution before you've heard the problem.</li>
              <li>"Is this a problem you have?" — yes or no, easy to agree to just to be agreeable.</li>
              <li>"How much would you pay for this?" — people are bad at pricing a hypothetical. Ask what they actually paid last time instead.</li>
            </ul>
          </div>
        </div>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vt-label">A survey, if you want to go wider than interviews can reach</h2>
        <p class="font-label vt-body">
          Surveys are weaker than interviews for this kind of question, because
          self-reported future intent is unreliable. They're still useful for
          checking how common and how severe a problem is across more people than
          you can sit down with, as long as every question asks about something
          that already happened, not something hypothetical.
        </p>
        <ol class="vt-steps">
          <li><b>Screener:</b> confirm the respondent actually matches the target segment, and exclude anyone who doesn't.</li>
          <li><b>Behavior, as a checklist, not a hypothetical:</b> "Which of these have you personally done or paid for?" with real options, not "would you."</li>
          <li><b>Channel, open text:</b> "How did you find the people or tools you used?"</li>
          <li><b>Pain ranking:</b> which part was most frustrating, as a ranked list of real sub-problems.</li>
          <li><b>Real spend, as a range:</b> "Roughly how much did you spend in total?"</li>
          <li><b>A real ask, not a hypothetical one:</b> "Would you be willing to do a 15-minute call about your experience?" with a contact field. The percentage who say yes and actually show up is itself a validation signal, stronger than anything else in the survey.</li>
        </ol>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label vt-label">Further reading</h2>
        <ul class="vt-reading">
          <li><b>The Mom Test</b> — Rob Fitzpatrick. Short, and built entirely around this exact problem.</li>
          <li><b>Testing Business Ideas</b> — David Bland and Alexander Osterwalder. A catalog of experiments ranked by cost and evidence strength — basically the ladder expanded into a full book.</li>
          <li><b>Business Model Generation</b> — Alexander Osterwalder and Yves Pigneur. The original business model canvas, and the book that's actually behind the fill-in canvas above.</li>
          <li><b>Running Lean</b> — Ash Maurya. The Lean Canvas, a startup-specific adaptation of the same canvas, plus the problem interview and solution interview scripts it's built around.</li>
          <li><b>Talking to Humans</b> — Giff Constable. Short and practical, a good next read once the first few interviews are booked.</li>
        </ul>
      </section>

      <div class="dimension-line" />

      <section class="reveal vt-closing">
        <p class="font-display vt-closing__statement">Fill it in honestly. That's the whole trick.</p>
        <div class="vt-closing__ctas">
          <router-link
            to="/notes/validation-ladder"
            class="pill-tag pill-tag--outline tilt-left"
            @click="trackEvent('notes_back_click', { from: 'toolkit-footer' })"
          >← Back to the ladder</router-link>
          <a
            href="mailto:hello@launchit.studio?subject=Validation%20sanity%20check"
            class="vt-closing__email font-label"
            @click="trackEvent('contact_click', { location: 'notes-validation-toolkit' })"
          >Or walk through yours with me — hello@launchit.studio</a>
        </div>
      </section>
    </div>

    <!-- Print-only view — plain text/tables, not the interactive
         textareas/toggle buttons above. A <textarea> prints clipped to its
         on-screen box height, not its full content, so a real answer of
         any length would get cut off in the printed version; this
         duplicates the same data as plain flowing text instead, which
         wraps and paginates normally. Hidden on screen, shown only via
         the @media print rule below. -->
    <div class="vt-print" aria-hidden="true">
      <h1 class="vt-print__title">Validation Toolkit</h1>
      <p class="vt-print__date">Filled in {{ printDate }} — launchit.studio/notes/validation-ladder/toolkit</p>

      <h2 class="vt-print__section-title">Lean Canvas</h2>
      <div v-for="row in canvas" :key="`print-${row.block}`" class="vt-print__block">
        <div class="vt-print__block-head">
          <h3>{{ row.block }}</h3>
          <span class="vt-print__status" :class="`vt-print__status--${row.status.toLowerCase()}`">{{ row.status }}</span>
        </div>
        <p class="vt-print__prompt">{{ row.prompt }}</p>
        <p class="vt-print__answer">{{ row.answer.trim() || 'Not filled in yet.' }}</p>
      </div>

      <h2 class="vt-print__section-title">Segments</h2>
      <table class="vt-print__table">
        <thead>
          <tr><th>Segment</th><th>Assumed need</th><th>Status</th><th>How to validate</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Busy working parents</td>
            <td>Wants more time back in the week</td>
            <td>Assumed, from the founder's own experience</td>
            <td>Interview 8-10 people matching this profile who aren't already in the founder's network</td>
          </tr>
          <tr v-for="(row, i) in filledSegments" :key="i">
            <td>{{ row.segment }}</td>
            <td>{{ row.need }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.howToValidate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { trackEvent } from 'boot/analytics'

const root = ref(null)
const STORAGE_KEY = 'launchit-validation-toolkit-v1'
const STATUS_OPTIONS = ['Unknown', 'Assumed', 'Validated']

// reactive(), not ref() — canvas rows are edited in place (row.answer,
// row.status) from the template, and a plain array of reactive objects
// needs no .value indirection for that.
const canvas = reactive([
  { block: 'Problem', prompt: "What's the top 1-3 problems worth solving?", answer: '', status: 'Unknown' },
  { block: 'Customer segments', prompt: 'Who has this problem badly enough to act?', answer: '', status: 'Unknown' },
  { block: 'Unique value proposition', prompt: 'Why would they choose this over doing nothing, or over the workaround they already use?', answer: '', status: 'Unknown' },
  { block: 'Solution', prompt: "What's the smallest version that addresses the problem?", answer: '', status: 'Unknown' },
  { block: 'Channels', prompt: 'How would the right people actually find out this exists?', answer: '', status: 'Unknown' },
  { block: 'Revenue streams', prompt: 'Who pays, how much, and why would they keep paying?', answer: '', status: 'Unknown' },
  { block: 'Cost structure', prompt: 'What does it cost to deliver this, including the ongoing human labor, not just the build?', answer: '', status: 'Unknown' },
  { block: 'Key metrics', prompt: 'What number would actually prove this is working, and is anything measuring it yet?', answer: '', status: 'Unknown' },
  { block: 'Unfair advantage', prompt: "What's genuinely hard for someone else to copy?", answer: '', status: 'Unknown' }
])

// User-added rows only — the one example row in the template is static
// reference content, not part of this editable/persisted list.
const segments = ref([])

// Print view skips genuinely blank rows (someone clicked "+ Add a segment"
// and left it empty) rather than rendering empty table rows.
const filledSegments = computed(() => segments.value.filter(
  (row) => row.segment || row.need || row.status || row.howToValidate
))

const printDate = computed(() => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))

function addSegment () {
  segments.value.push({ segment: '', need: '', status: '', howToValidate: '' })
  trackEvent('toolkit_segment_add', {})
}

function removeSegment (i) {
  segments.value.splice(i, 1)
}

function loadSaved () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    // Matched by array index, not a stored key — canvas's block order is
    // fixed in code, so this is safe and avoids needing a lookup.
    if (Array.isArray(saved.canvas)) {
      saved.canvas.forEach((s, i) => {
        if (!canvas[i]) return
        canvas[i].answer = s.answer || ''
        canvas[i].status = s.status || 'Unknown'
      })
    }
    if (Array.isArray(saved.segments)) segments.value = saved.segments
  } catch (err) {
    // Corrupt/old localStorage data shouldn't break the page — just start fresh.
  }
}

function persist () {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      canvas: canvas.map(({ answer, status }) => ({ answer, status })),
      segments: segments.value
    }))
  } catch (err) {
    // Storage can be unavailable (private browsing, quota) — fill-in state
    // just won't persist across a refresh, the page itself still works.
  }
}

// A single Markdown file covering both fill-in sections — easier to
// actually use in a conversation (paste into an email/doc, or just read)
// than a raw JSON dump, and needs no PDF library/new dependency.
function exportMarkdown () {
  const cell = (v) => (v || '').trim().replace(/\|/g, '\\|').replace(/\n/g, ' ')
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  let md = `# Validation Toolkit\n\nFilled in ${date}.\n\n## Lean Canvas\n\n`

  canvas.forEach((row) => {
    md += `### ${row.block}\n\n`
    md += `**Prompt:** ${row.prompt}\n\n`
    md += `**Status:** ${row.status}\n\n`
    md += `${row.answer.trim() || '_Not filled in yet._'}\n\n`
  })

  md += `## Segments\n\n`
  if (segments.value.length === 0) {
    md += '_No segments added yet._\n\n'
  } else {
    md += '| Segment | Assumed need | Status | How to validate |\n'
    md += '|---|---|---|---|\n'
    segments.value.forEach((row) => {
      md += `| ${cell(row.segment)} | ${cell(row.need)} | ${cell(row.status)} | ${cell(row.howToValidate)} |\n`
    })
    md += '\n'
  }

  md += `---\n\nFrom ${window.location.origin}/notes/validation-ladder/toolkit\n`

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'validation-toolkit.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  trackEvent('toolkit_export', { format: 'markdown' })
}

// Browser print-to-PDF, not a PDF library — the .vt-print block below is a
// plain-text/table duplicate of the same data, shown only under
// @media print, so "export" here is just "print, then choose Save as PDF
// as the destination" in the browser's own dialog.
function exportPdf () {
  trackEvent('toolkit_export', { format: 'pdf' })
  window.print()
}

function onClearAll () {
  if (!window.confirm("Clear everything you've filled in on this page? This can't be undone.")) return
  canvas.forEach(row => { row.answer = ''; row.status = 'Unknown' })
  segments.value = []
  try { localStorage.removeItem(STORAGE_KEY) } catch (err) { /* see persist() */ }
  trackEvent('toolkit_clear_all', {})
}

onMounted(() => {
  window.scrollTo(0, 0)
  loadSaved()
  watch([canvas, segments], persist, { deep: true })

  root.value.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      delay: i === 0 ? 0.1 : 0,
      ease: 'power2.out'
    })
  })
})
</script>

<style lang="scss" scoped>
.vt-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.vt-page__inner {
  max-width: 760px;
  margin: 0 auto;
}

.vt-back {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--navy);
  opacity: 0.6;
  text-decoration: none;
  margin-bottom: 1.5rem;

  &:hover {
    opacity: 1;
    color: var(--coral);
  }
}

.vt-header__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 1rem;
}

.vt-header__lede {
  line-height: 1.65;
  opacity: 0.8;
  max-width: 60ch;
  margin: 0;
}

.vt-label {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}

.vt-body {
  line-height: 1.7;
  opacity: 0.85;
  margin: 0 0 1rem;

  b {
    color: var(--navy);
    opacity: 1;
    font-weight: 600;
  }
}

// --- Tables -----------------------------------------------------------
.vt-table-wrap {
  overflow-x: auto;
}

.vt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  th,
  td {
    text-align: left;
    vertical-align: top;
    padding: 0.7rem 0.9rem;
    border: 1px solid rgba(62, 124, 166, 0.3);
    min-width: 140px;
  }

  th {
    font-family: var(--font-label);
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.6;
    background: rgba(62, 124, 166, 0.08);
  }

  td {
    line-height: 1.5;
  }
}

.vt-table__block {
  font-weight: 600;
  white-space: nowrap;
}

.vt-table__prompt {
  opacity: 0.75;
}

.vt-table__status {
  min-width: 120px;
}

.vt-table__example td {
  opacity: 0.6;
  font-style: italic;
}

.vt-table__row-with-remove {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;

  .vt-input {
    flex: 1;
  }
}

// --- Fill-in controls -----------------------------------------------------------
.vt-input {
  width: 100%;
  min-width: 140px;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.5);
  font-family: var(--font-label);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--navy);
  padding: 0.4rem 0.55rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--coral);
    background: var(--paper);
  }

  &::placeholder {
    color: var(--navy);
    opacity: 0.35;
  }
}

.vt-status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}

.vt-status__btn {
  font-family: var(--font-label);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: 1.5px solid rgba(62, 124, 166, 0.4);
  background: transparent;
  color: var(--navy);
  opacity: 0.5;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
}

.vt-status__btn--active {
  opacity: 1;
  border-color: transparent;

  &.vt-status__btn--validated {
    background: var(--teal);
    color: var(--paper);
  }
  &.vt-status__btn--assumed {
    background: var(--gold);
    color: var(--navy);
  }
  &.vt-status__btn--unknown {
    background: rgba(62, 124, 166, 0.3);
    color: var(--navy);
  }
}

.vt-add-row {
  display: inline-flex;
  align-items: center;
  margin-top: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--coral);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.vt-remove {
  flex: none;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  border: none;
  border-radius: 50%;
  background: rgba(62, 124, 166, 0.15);
  color: var(--navy);
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: var(--coral);
    color: var(--paper);
  }
}

.vt-persist-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  font-size: 0.78rem;
  opacity: 0.55;
  margin: 0.5rem 0 0;
}

.vt-persist-note__actions {
  display: flex;
  flex: none;
  gap: 1.25rem;
}

.vt-clear,
.vt-export {
  flex: none;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.78rem;
  font-family: var(--font-label);
  text-decoration: underline;
  cursor: pointer;
}

.vt-clear {
  color: var(--navy);
  opacity: 0.8;

  &:hover {
    color: var(--coral);
    opacity: 1;
  }
}

.vt-export {
  color: var(--coral);
  opacity: 0.85;
  font-weight: 600;

  &:hover {
    opacity: 1;
  }
}

// --- Interview Q&A -----------------------------------------------------------
.vt-qa {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.25rem;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
}

.vt-qa__col {
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid rgba(62, 124, 166, 0.3);
}

.vt-qa__col--good {
  border-left: 3px solid var(--teal);
}

.vt-qa__col--bad {
  border-left: 3px solid var(--coral);
}

.vt-qa__heading {
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 0.9rem;
  opacity: 0.7;
}

.vt-qa__list {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.75rem;
  font-size: 0.88rem;
  line-height: 1.55;
  opacity: 0.85;

  b {
    opacity: 1;
  }
}

// --- Steps / reading -----------------------------------------------------------
.vt-steps,
.vt-reading {
  margin: 0;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.75rem;
  line-height: 1.6;
  opacity: 0.85;

  b {
    color: var(--navy);
    opacity: 1;
    font-weight: 600;
  }
}

// --- Closing -----------------------------------------------------------
.vt-closing {
  text-align: center;
}

.vt-closing__statement {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 500;
  max-width: 24ch;
  margin: 0 auto;
}

.vt-closing__ctas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.75rem;
}

.vt-closing__email {
  font-size: 0.85rem;
  color: var(--navy);
  opacity: 0.75;
  text-decoration: underline;
  text-decoration-color: rgba(30, 43, 60, 0.3);

  &:hover {
    opacity: 1;
    color: var(--coral);
  }
}

// --- Print-only view -----------------------------------------------------------
// Physical units (cm/pt) throughout this section, not rem — more reliable
// across print engines than viewport-relative units, and this content is
// never shown on screen so rem's usual job (matching the page's own scale)
// doesn't apply here.
.vt-print {
  display: none;
}

@media print {
  .vt-screen-only {
    display: none !important;
  }

  .vt-print {
    display: block;
    font-family: var(--font-label);
    color: var(--navy);
  }
}

.vt-print__title {
  font-family: var(--font-display);
  font-size: 22pt;
  font-weight: 600;
  margin: 0 0 0.3cm;
}

.vt-print__date {
  font-size: 9pt;
  opacity: 0.6;
  margin: 0 0 1cm;
}

.vt-print__section-title {
  font-family: var(--font-display);
  font-size: 14pt;
  font-weight: 600;
  margin: 1cm 0 0.5cm;
  break-after: avoid;
  page-break-after: avoid;
}

.vt-print__block {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 0.6cm;
  padding-bottom: 0.5cm;
  border-bottom: 0.5pt solid rgba(62, 124, 166, 0.4);

  &:last-of-type {
    border-bottom: none;
  }
}

.vt-print__block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.4cm;

  h3 {
    font-family: var(--font-display);
    font-size: 12.5pt;
    font-weight: 600;
    margin: 0;
  }
}

.vt-print__status {
  flex: none;
  font-size: 8pt;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 0.1cm 0.3cm;
  border-radius: 999px;
  background: rgba(62, 124, 166, 0.25);
  color: var(--navy);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;

  &--validated {
    background: var(--teal);
    color: var(--paper);
  }
  &--assumed {
    background: var(--gold);
    color: var(--navy);
  }
}

.vt-print__prompt {
  font-size: 9.5pt;
  font-style: italic;
  opacity: 0.65;
  margin: 0.2cm 0;
}

.vt-print__answer {
  font-size: 10.5pt;
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
}

.vt-print__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;

  th,
  td {
    text-align: left;
    vertical-align: top;
    padding: 0.25cm 0.3cm;
    border: 0.5pt solid rgba(62, 124, 166, 0.4);
  }

  th {
    font-weight: 700;
    font-size: 8pt;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background: rgba(62, 124, 166, 0.12);
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>

<style>
/* Unscoped — needs to reach StudioLayout's header/footer, which live
   outside this component. Print should show only the .vt-print content
   above, not site chrome. */
@media print {
  .studio-header,
  .studio-footer {
    display: none !important;
  }

  @page {
    margin: 1.8cm;
  }
}
</style>
