<template>
  <q-page class="work-page">
    <section class="work-hero" :class="{ 'work-hero--centered': mode === 'filmstrip' }">
      <div class="work-hero__inner">
        <span class="font-label work-hero__eyebrow">LAUNCHIT STUDIO</span>
        <h1 class="font-display work-hero__title">Selected work.</h1>

        <div class="work-hero__modes">
          <button
            v-for="option in modes"
            :key="option.value"
            class="pill-tag work-hero__mode"
            :class="mode === option.value ? 'pill-tag--coral' : 'pill-tag--outline'"
            @click="setMode(option.value)"
          >{{ option.label }}</button>
        </div>
      </div>
    </section>

    <section class="work-bio">
      <div class="work-bio__inner">
        <span class="font-label work-bio__eyebrow">ABOUT</span>
        <h2 class="font-display work-bio__title">Who's building this.</h2>
        <p class="font-label work-bio__text">
          I'm a software developer who learned to build by doing. My path hasn't been
          traditional: I began my studies at Texas A&amp;M University, but adjusting to
          a new environment and keeping up with the skills expected to succeed proved
          challenging, which led me to pursue a self-taught path.
        </p>
        <div ref="bioExpandEl" class="work-bio__expand">
          <p class="font-label work-bio__text">
            My first real role was at
            <a href="https://www.cmgl.ca/cmg-news/cmg-announces-the-acquisition-of-early-stage-ai-based-data-analytics-technology-for-maximizing-asset-valuation-and-production-performance-of-shale-reservoirs/" target="_blank" rel="noopener noreferrer">USI (Unconventional Subsurface Integration)</a>,
            an O&amp;G startup, where I had no experience but had to adapt fast. I
            learned to move quickly, experiment, and grow under pressure. I later tried
            freelancing with friends, building projects but realizing the challenges of
            scale and collaboration.
          </p>
          <p class="font-label work-bio__text">
            A key turning point came when I joined Moneta Tech, a Miami FinTech startup
            aiming to digitize spare change. We got into
            <a href="https://www.forbes.com/sites/yolandabaruch/2023/05/16/bank-of-americas-launches-program-for-underrepresented-entrepreneurs/" target="_blank" rel="noopener noreferrer">Bank of America's Breakthrough Lab</a>,
            received a
            <a href="https://www.flchamber.com/googles-latino-founders-fund-congratulating-miami-winners-largest-in-the-us/" target="_blank" rel="noopener noreferrer">$100k Google Latino Founders Fund scholarship</a>,
            and worked with mentors from the
            <a href="https://www.thevmt.org/" target="_blank" rel="noopener noreferrer">VMT Group</a>.
            We pushed our product to MVP, but ultimately faced the reality of market
            fit — either too big or too small for the clients we could reach.
          </p>
          <p class="font-label work-bio__text">
            After that, I joined
            <a href="https://www.leftfieldlabs.com/" target="_blank" rel="noopener noreferrer">Left Field Labs</a>,
            a web agency that works on Google projects like
            <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase</a>,
            <a href="https://quantumai.google/" target="_blank" rel="noopener noreferrer">Quantum AI</a>,
            <a href="https://developers.googleblog.com/" target="_blank" rel="noopener noreferrer">Developers Blog</a>,
            <a href="https://summerofcode.withgoogle.com/" target="_blank" rel="noopener noreferrer">GSOC</a>,
            and
            <a href="https://labs.google/" target="_blank" rel="noopener noreferrer">Labs</a>.
            As a Google XWF (External Workforce), I get to work on unique,
            cutting-edge ideas while learning from high standards and scalable design
            practices.
          </p>
          <p class="font-label work-bio__text">
            Now, I'm focused on seeing ideas through from start to finish. I want to
            build things that actually get used and have real impact. Money isn't the
            goal — completing something meaningful is. I'm here to reignite the
            excitement for building — just for the sake of building.
          </p>
        </div>
        <button class="work-bio__toggle font-label" @click="toggleBio">
          {{ bioExpanded ? 'Read less' : 'Read more' }}
          <span class="work-bio__toggle-icon" :class="{ 'work-bio__toggle-icon--open': bioExpanded }">↓</span>
        </button>
      </div>
    </section>

    <section v-if="mode === 'grid'" ref="gridSection" class="work-grid-section">
      <div class="work-grid">
        <component
          :is="item.link ? 'a' : 'div'"
          v-for="item in work"
          :key="item.title"
          :href="item.link || undefined"
          :target="item.link ? '_blank' : undefined"
          :rel="item.link ? 'noopener' : undefined"
          class="work-grid__card"
          @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
        >
          <WorkCard :item="item" />
        </component>
      </div>
    </section>

    <section v-else class="work-mode-section">
      <WorkFilmStrip />
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import WorkCard from 'components/WorkCard.vue'
import WorkFilmStrip from 'components/WorkFilmStrip.vue'
import work from 'src/data/work.js'

const gridSection = ref(null)
const bioExpandEl = ref(null)
const bioExpanded = ref(false)
const prefersReducedMotion = usePrefersReducedMotion()
const modes = [
  { value: 'grid', label: 'Grid' },
  { value: 'filmstrip', label: 'Film Strip' }
]
const mode = ref('filmstrip')

function toggleBio() {
  bioExpanded.value = !bioExpanded.value
  trackEvent('bio_toggle', { expanded: bioExpanded.value })

  if (prefersReducedMotion.value) {
    gsap.set(bioExpandEl.value, { height: bioExpanded.value ? 'auto' : 0 })
    return
  }
  // GSAP measures 'auto' itself — no manual scrollHeight math needed.
  gsap.to(bioExpandEl.value, { height: bioExpanded.value ? 'auto' : 0, duration: 0.5, ease: 'power2.inOut' })
}

function setMode(value) {
  mode.value = value
  trackEvent('work_mode_change', { mode: value })
}

function playGridEntrance() {
  if (prefersReducedMotion.value || !gridSection.value) return
  gsap.from(gridSection.value.querySelectorAll('.work-grid__card'), {
    y: 10,
    autoAlpha: 0,
    duration: 0.5,
    stagger: 0.03,
    ease: 'power2.out'
  })
}

onMounted(() => {
  if (mode.value === 'grid') nextTick(playGridEntrance)
})
</script>

<style lang="scss" scoped>
.work-page {
  background: var(--paper);
}

.work-hero {
  padding: 4rem 1.5rem 2.5rem;
}

.work-hero__inner {
  max-width: 1100px;
  margin: 0 auto;
}

// Film strip mode only — the strip below is centered on-screen (both the
// hint and the cards themselves), so a left-aligned hero above it read as
// stranded off to one side instead of belonging to the same composition.
.work-hero--centered .work-hero__inner {
  text-align: center;
}

.work-hero--centered .work-hero__modes {
  justify-content: center;
}

.work-hero__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.work-hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  margin: 0.5rem 0 0;
}

.work-hero__modes {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.work-hero__mode {
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.work-bio {
  padding: 0 1.5rem 3rem;
}

.work-bio__inner {
  max-width: 700px;
  margin: 0 auto;
}

.work-bio__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.work-bio__title {
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  font-weight: 600;
  margin: 0.5rem 0 1rem;
}

.work-bio__text {
  font-size: 0.95rem;
  line-height: 1.65;
  opacity: 0.85;
  margin: 0 0 1rem;

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

// Collapsed by default via plain CSS (not just the GSAP set() on mount) so
// there's no flash of the full bio before JS has a chance to run.
.work-bio__expand {
  height: 0;
  overflow: hidden;
}

.work-bio__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  color: var(--coral);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.work-bio__toggle:hover {
  text-decoration: underline;
}

.work-bio__toggle-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.work-bio__toggle-icon--open {
  transform: rotate(180deg);
}

.work-mode-section {
  padding-bottom: 5rem;
}

.work-grid-section {
  padding: 0 1.5rem 5rem;
}

.work-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.work-grid__card {
  display: block;
  text-decoration: none;
  color: var(--navy);
  background: var(--paper);
  padding: 1.5rem;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 6px;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--coral);
    transform: translateY(-3px);
  }
}
</style>
