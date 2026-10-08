<template>
  <q-page class="bb-page grid-texture">
    <div ref="root" class="bb-page__inner">
      <header class="bb-header reveal">
        <span class="pill-tag pill-tag--gold tilt-right">NOTES</span>
        <h1 class="font-display bb-header__title">Do the work nobody asked for.</h1>
        <p class="font-label bb-header__lede">
          Every freelance and agency rule says the same thing: never build
          without a signed commitment. It was correct advice, for a long time,
          because the thing being given away for free used to be expensive. I
          keep breaking that rule anyway. It isn't a strategy. AI collapsed the
          cost of what the rule was protecting against, and that's the only
          reason breaking it stopped being reckless.
        </p>
      </header>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">The rule, and why it used to be right</h2>
        <p class="font-label bb-body">
          Design and dev communities have spent close to two decades
          campaigning against spec work: building something for a prospective
          client before there's any commitment, on the chance it leads
          somewhere. The argument is a good one. It undervalues the work, it
          normalizes clients expecting something for nothing, and it asks the
          person with the least leverage in the relationship to absorb all the
          risk. For most of that time, the argument was also just correct,
          because what was being given away for free was genuinely expensive:
          real weeks of a real person's time, with no guarantee any of it gets
          paid for.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">What actually changed</h2>
        <p class="font-label bb-body">
          I've broken that rule more than once, and it's paid off more than
          once. The rule itself wasn't wrong. The cost it was protecting
          against just collapsed. With AI doing most of the heavy lifting, and
          a tech stack I've reused project after project (the same Quasar/Vue
          scaffolding, the same AWS deploy pattern, the same Lambda
          conventions), building 70% of a real rebuild doesn't take weeks
          anymore. It takes an evening or two, sometimes a full day. At that
          price, refusing to build before being asked isn't protecting your
          time anymore. It's just an old rule nobody re-checked after the
          thing it was pricing got cheap.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label bb-label">Where this actually started</h2>
        <p class="font-label bb-body">
          None of this started as a strategy. I went through a real stretch, a
          drought, where building had quietly dropped out of my life. Most
          days were just the 9-to-5 at Left Field Labs, with whatever spark
          usually got me building something on the side gone missing. Impact
          Hub Houston's accelerator program is what snapped me out of it,
          though not in the way it was supposed to. I came out of it loving
          the startup community, and open to finding the right thing to build
          around someday. But the real realization was simpler than that:
          what I actually love is building, full stop. It doesn't have to be
          a company. It doesn't have to make money. Most of the time I'm
          offering to help for free, the same way the Ideal Instruction
          conversation started. Not a pitch. Just an offer. The paid
          work that's come out of that has been a byproduct of it, never the
          reason I was doing it.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <span class="pill-tag pill-tag--teal tilt-left bb-case__status">Two that said yes</span>
        <h2 class="font-display bb-case__title">
          <a href="https://www.ideal-instruction.com" target="_blank" rel="noopener noreferrer" @click="trackEvent('outbound_click', { label: 'Ideal Instruction', url: 'https://www.ideal-instruction.com' })">Ideal Instruction</a>
          &amp;
          <a href="https://www.homefinancingcenter.com" target="_blank" rel="noopener noreferrer" @click="trackEvent('outbound_click', { label: 'Home Financing Center', url: 'https://www.homefinancingcenter.com' })">Home Financing Center</a>
        </h2>
        <p class="font-label bb-body">
          Both started the same way: a real audit of the existing site, then
          most of the actual rebuild, before either client had committed to
          anything. A WordPress-to-Quasar migration for Ideal Instruction,
          including its video showroom; a WordPress-to-Vue rebuild for Home
          Financing Center, including its mortgage calculator and quiz
          dialogs. Each one took maybe one or two evenings, sometimes a full
          day. Both converted into real, paid engagements. I don't think
          either one happened because I pitched well. There was almost
          nothing left to imagine by the time we talked. The thing mostly
          already existed, and saying yes just meant keeping it.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <span class="pill-tag pill-tag--coral tilt-right bb-case__status">Still an open one</span>
        <h2 class="font-display bb-case__title">
          <a href="https://d2o6sntgwqzr70.cloudfront.net" target="_blank" rel="noopener noreferrer" @click="trackEvent('outbound_click', { label: 'Steelmill Gym', url: 'https://d2o6sntgwqzr70.cloudfront.net' })">Steelmill Gym</a>
        </h2>
        <p class="font-label bb-body">
          Same approach, same effort, and it hasn't converted. The work was
          good. The coaches who actually run the gym day to day were into it.
          The owner, who isn't really present in the day-to-day, wasn't. The
          honest version of his position is something close to "we're already
          making money, why bother." That's the real lesson here, not a
          disappointing footnote: the cost of building the thing dropping to
          almost nothing doesn't manufacture urgency in someone who was never
          going to feel the pain. That's the exact gap the
          <router-link to="/notes/validation-ladder" @click="trackEvent('notes_cross_link_click', { from: 'free-work', to: 'validation-ladder' })">Validation Ladder's</router-link>
          segment table is built to catch. Loving the product and being the
          person who feels enough pain to say yes are two different people,
          and no amount of free, well-built work closes that gap by itself.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal bb-closing">
        <p class="font-display bb-closing__statement">Build it before they ask. The downside stopped being expensive.</p>
        <p class="font-label bb-closing__note">
          This isn't a growth hack, and it won't manufacture urgency nobody
          already felt. Steelmill is proof of that. But when building stopped
          being the expensive part, refusing to do it first stopped being the
          safe choice too.
        </p>
        <div class="bb-closing__ctas">
          <router-link
            to="/notes/validation-ladder"
            class="pill-tag pill-tag--outline tilt-left"
            @click="trackEvent('notes_cross_link_click', { from: 'free-work-footer', to: 'validation-ladder' })"
          >Read the Validation Ladder →</router-link>
          <a
            href="mailto:hello@launchit.studio?subject=Let%27s%20build%20something"
            class="bb-closing__email font-label"
            @click="trackEvent('contact_click', { location: 'notes-free-work' })"
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

  a {
    color: var(--coral);
    text-decoration: underline;
    text-decoration-color: rgba(216, 90, 48, 0.35);
    text-underline-offset: 2px;

    &:hover {
      text-decoration-color: var(--coral);
    }
  }
}

.bb-case__status {
  margin-bottom: 1rem;
}

.bb-case__title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem;

  a {
    color: var(--navy);
    text-decoration: underline;
    text-decoration-color: rgba(30, 43, 60, 0.3);
    text-underline-offset: 3px;

    &:hover {
      color: var(--coral);
      text-decoration-color: var(--coral);
    }
  }
}

.bb-closing {
  text-align: center;
}

.bb-closing__statement {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 500;
  max-width: 26ch;
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
