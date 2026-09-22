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
const prefersReducedMotion = usePrefersReducedMotion()
const modes = [
  { value: 'grid', label: 'Grid' },
  { value: 'filmstrip', label: 'Film Strip' }
]
const mode = ref('filmstrip')

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
