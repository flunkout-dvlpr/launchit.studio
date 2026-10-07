<template>
  <q-page class="vt-page grid-texture">
    <div ref="root" class="vt-page__inner">
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
          <table class="vt-table">
            <thead>
              <tr><th>Block</th><th>Prompt</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in canvas" :key="row.block">
                <td class="vt-table__block">{{ row.block }}</td>
                <td>{{ row.prompt }}</td>
                <td class="vt-table__status"></td>
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
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td></tr>
            </tbody>
          </table>
        </div>
      </section>

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
          <li><b>Running Lean</b> — Ash Maurya. The Lean Canvas itself, plus the problem interview and solution interview scripts it's built around.</li>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { trackEvent } from 'boot/analytics'

const root = ref(null)

const canvas = [
  { block: 'Problem', prompt: "What's the top 1-3 problems worth solving?" },
  { block: 'Customer segments', prompt: 'Who has this problem badly enough to act?' },
  { block: 'Unique value proposition', prompt: 'Why would they choose this over doing nothing, or over the workaround they already use?' },
  { block: 'Solution', prompt: "What's the smallest version that addresses the problem?" },
  { block: 'Channels', prompt: 'How would the right people actually find out this exists?' },
  { block: 'Revenue streams', prompt: 'Who pays, how much, and why would they keep paying?' },
  { block: 'Cost structure', prompt: 'What does it cost to deliver this, including the ongoing human labor, not just the build?' },
  { block: 'Key metrics', prompt: 'What number would actually prove this is working, and is anything measuring it yet?' },
  { block: 'Unfair advantage', prompt: "What's genuinely hard for someone else to copy?" }
]

onMounted(() => {
  window.scrollTo(0, 0)
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

.vt-table__status {
  min-width: 90px;
}

.vt-table__example td {
  opacity: 0.6;
  font-style: italic;
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
</style>
