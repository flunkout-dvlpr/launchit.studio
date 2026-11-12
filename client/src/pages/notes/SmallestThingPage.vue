<template>
  <q-page class="bb-page grid-texture">
    <div ref="root" class="bb-page__inner">
      <header class="bb-header reveal">
        <span class="pill-tag pill-tag--gold tilt-right">NOTES</span>
        <h1 class="font-display bb-header__title">Build the smallest thing that works.</h1>
      </header>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">Small, clear, layered</h2>
        <ul class="bb-list font-label">
          <li>
            <strong>Small.</strong> Pick the one thing a person does in your
            app and build only that. For a class business, that's booking a
            spot.
          </li>
          <li>
            <strong>Clear.</strong> Tell the tool who it's for, what it does
            and what it looks like. Make one change at a time.
          </li>
          <li>
            <strong>Layered.</strong> Look first, then data, then login, then
            payments, then publish. Each layer works before the next one
            starts.
          </li>
        </ul>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">Good prompts and bad prompts</h2>
        <p class="font-label bb-body">
          A good prompt says who it's for, what should happen, and what done
          looks like. A bad one leaves the tool to guess. The examples below
          use a small studio that runs weekly classes.
        </p>

        <div v-for="ex in examples" :key="ex.title" class="bb-example">
          <h3 class="font-display bb-example__title">{{ ex.title }}</h3>
          <div class="bb-prompt bb-prompt--bad">
            <span class="bb-prompt__tag font-label">Bad</span>
            <p class="font-label">{{ ex.bad }}</p>
          </div>
          <div class="bb-prompt bb-prompt--good">
            <span class="bb-prompt__tag font-label">Good</span>
            <p class="font-label">{{ ex.good }}</p>
          </div>
        </div>

        <p class="font-label bb-body bb-body--spaced">
          The pattern across all five: one change per prompt, describe what
          you see next to what you wanted, and say what to leave alone.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <span class="pill-tag pill-tag--teal tilt-left bb-case__status">Copy these</span>
        <h2 class="font-label bb-label">Two templates</h2>
        <p class="font-label bb-body">
          One to start a project, one for every change after that. Replace
          everything in [brackets].
        </p>

        <div v-for="t in templates" :key="t.id" class="bb-template">
          <div class="bb-template__head">
            <h3 class="font-display bb-example__title">{{ t.title }}</h3>
            <button
              type="button"
              class="bb-copy font-label"
              @click="copy(t)"
            >{{ copiedId === t.id ? 'Copied' : 'Copy' }}</button>
          </div>
          <pre class="bb-code font-label">{{ t.text }}</pre>
        </div>

        <h3 class="font-display bb-example__title">Before you hit enter</h3>
        <ul class="bb-list font-label">
          <li>Am I asking for one thing?</li>
          <li>Did I say who it's for or where on the page?</li>
          <li>Did I describe what I see and what I want?</li>
          <li>If it's an error, did I paste the whole thing?</li>
        </ul>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">When it breaks</h2>
        <p class="font-label bb-body bb-body--list">
          You'll see red error text tonight. Everyone does, including people
          who've been building for years. It's the tool telling you where it
          got stuck.
        </p>
        <ol class="bb-list font-label">
          <li>
            <strong>Copy the whole error.</strong> The full red text, not a
            summary. A screenshot works too.
          </li>
          <li>
            <strong>Ask for an explanation first.</strong> Try "Explain what's
            wrong in plain language, then fix it." You learn something and you
            catch bad fixes.
          </li>
          <li>
            <strong>Three tries, then roll back.</strong> If three attempts
            don't fix it, go back to the last version that worked (Lovable
            keeps version history) and try a smaller step.
          </li>
          <li>
            <strong>Make the step smaller.</strong> Big changes break in big
            ways. Split it into two prompts.
          </li>
          <li>
            <strong>Raise your hand.</strong> If you've been stuck for 10
            minutes, that's what Karee and I are here for.
          </li>
        </ol>

        <h3 class="font-display bb-example__title bb-example__title--spaced">Build order</h3>
        <p class="font-label bb-body">
          Most errors come from adding a layer too early, so go in this order:
        </p>
        <ol class="bb-list font-label">
          <li>How it looks: pages, buttons, text</li>
          <li>Saving data: a database</li>
          <li>Login: accounts</li>
          <li>Payments: Stripe</li>
          <li>Publishing: a live link</li>
        </ol>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">Build of the Night</h2>
        <p class="font-label bb-body">
          Things to aim for:
        </p>
        <ul class="bb-list font-label">
          <li><strong>It works.</strong> The main action works live in the demo.</li>
          <li><strong>Progress.</strong> How far you got from where you started at 6:45.</li>
          <li><strong>Clarity.</strong> You can show it and explain it in 2 minutes.</li>
          <li><strong>Builder mindset.</strong> You started small, added layers, and pushed through an error.</li>
        </ul>
      </section>

      <div class="dimension-line" />

      <section class="reveal bb-closing">
        <p class="font-display bb-closing__statement">By 8:15, have one thing that works and that you can show in 2 minutes.</p>
        <p class="font-label bb-closing__note">
          One working screen is a great night.
        </p>
        <div class="bb-closing__ctas">
          <router-link
            to="/notes"
            class="pill-tag pill-tag--outline tilt-left"
            @click="trackEvent('notes_cross_link_click', { from: 'smallest-thing-footer', to: 'notes-index' })"
          >More notes →</router-link>
          <a
            href="mailto:hello@launchit.studio?subject=Build%20night"
            class="bb-closing__email font-label"
            @click="trackEvent('contact_click', { location: 'notes-smallest-thing' })"
          >Or just email me: hello@launchit.studio</a>
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
const copiedId = ref(null)

const examples = [
  {
    title: '1. Starting a project',
    bad: 'Build me an app for my classes.',
    good: 'Build a one-page site for a small studio that teaches weekly classes. Visitors should see the 4 upcoming classes with date, time, price and spots left, and tap a button to book a spot with their name and email. Calm, simple look with soft green and white. No login yet.'
  },
  {
    title: '2. Adding a feature',
    bad: 'Add booking, payments, reminders, member login and an admin dashboard.',
    good: "Save each booking so I can see it later. Just store it for now. I'll add the admin view after."
  },
  {
    title: '3. Connecting a database or login',
    bad: 'Add a database.',
    good: "Connect Supabase so bookings are saved. Each booking has a name, email, class and a status that starts as 'confirmed'. Show me where I can see the saved bookings."
  },
  {
    title: '4. Fixing something that looks wrong',
    bad: 'The page is broken, fix it.',
    good: "On mobile, the Book button is hidden behind the class photos. I expected it to sit below each class. Please fix only that and don't change anything else."
  },
  {
    title: '5. Fixing an error',
    bad: "It's not working.",
    good: "When I click 'Book a spot' I get this error: [paste the full error]. Explain what's causing it in plain language first, then fix it."
  }
]

const templates = [
  {
    id: 'start',
    title: 'Template 1: Start your project',
    text: `Build a [type of app: website, web app, tool] for [who it's for].

The main thing they do: [the one action, e.g. "book a class", "submit an order"].

The first screen should show: [what's on it, e.g. a list, a form, a button].

When they [do the action], [what should happen next].

Look and feel: [2-3 words, e.g. "clean, warm, playful"] with [colors, if you have them].

Keep it simple for now: no login, no payments yet.`
  },
  {
    id: 'change',
    title: 'Template 2: Every change after that',
    text: `Right now: [what happens or what you see].

I want: [what should happen or what it should look like instead].

Where: [which page, button or section].

Don't change: [anything that's working and should stay the same].`
  }
]

async function copy(t) {
  try {
    await navigator.clipboard.writeText(t.text)
    copiedId.value = t.id
    trackEvent('notes_copy_click', { label: t.id })
    setTimeout(() => { if (copiedId.value === t.id) copiedId.value = null }, 2000)
  } catch (e) {
    // Clipboard unavailable: the text is selectable in the block above.
  }
}

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
.bb-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.bb-page__inner {
  max-width: 680px;
  margin: 0 auto;
}

.bb-header {
  margin-bottom: 1rem;
}

.bb-header__title {
  font-size: clamp(1.9rem, 4.5vw, 2.75rem);
  font-weight: 600;
  line-height: 1.15;
  margin: 1rem 0 1rem;
}

.bb-header__lede {
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.85;
  margin: 0;
}

.bb-label {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}

.bb-body {
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0;
}

.bb-body--spaced {
  margin-top: 1rem;
}

.bb-body--list {
  margin-bottom: 1rem;
}

.bb-list {
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0;
  padding-left: 1.25rem;

  li + li {
    margin-top: 0.5rem;
  }
}

.bb-case__status {
  margin-bottom: 1rem;
}

.bb-example {
  margin-top: 1.75rem;
}

.bb-example__title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 0.6rem;
}

.bb-example__title--spaced {
  margin-top: 1.75rem;
}

.bb-prompt {
  display: flex;
  gap: 0.9rem;
  align-items: baseline;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--navy);
  background: rgba(255, 255, 255, 0.55);

  & + & {
    margin-top: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
  }
}

.bb-prompt--bad {
  border-left-color: rgba(30, 43, 60, 0.3);

  p {
    opacity: 0.75;
  }
}

.bb-prompt--good {
  border-left-color: var(--coral);
}

.bb-prompt__tag {
  flex: none;
  width: 2.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.bb-template {
  margin-top: 1.5rem;
}

.bb-template__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.6rem;

  .bb-example__title {
    margin: 0;
  }
}

.bb-copy {
  flex: none;
  cursor: pointer;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--navy);
  background: transparent;
  border: 1px solid rgba(30, 43, 60, 0.4);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;

  &:hover {
    color: var(--coral);
    border-color: var(--coral);
  }
}

.bb-code {
  margin: 0 0 1.75rem;
  padding: 1rem 1.1rem;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 4px;
}

.bb-closing {
  text-align: center;
}

.bb-closing__statement {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 500;
  max-width: 28ch;
  margin: 0 auto;
}

.bb-closing__note {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.7;
  max-width: 50ch;
  margin: 1rem auto 0;
}

.bb-closing__ctas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.75rem;
}

.bb-closing__email {
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
