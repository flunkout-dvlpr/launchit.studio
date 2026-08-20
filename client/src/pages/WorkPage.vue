<template>
  <q-page class="work-page">
    <section class="work-hero">
      <div class="work-hero__inner">
        <span class="font-label work-hero__eyebrow">LAUNCHIT STUDIO</span>
        <h1 class="font-display work-hero__title">Selected work.</h1>
      </div>
    </section>

    <section ref="gridSection" class="work-grid-section">
      <div class="work-grid">
        <component
          :is="item.link ? 'a' : 'div'"
          v-for="item in work"
          :key="item.title"
          :href="item.link || undefined"
          :target="item.link ? '_blank' : undefined"
          :rel="item.link ? 'noopener' : undefined"
          class="work-card"
          @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
        >
          <h2 class="font-display work-card__title">{{ item.title }}</h2>
          <p class="font-label work-card__description">{{ item.description }}</p>
          <span v-if="item.link" class="pill-tag pill-tag--coral tilt-right work-card__cta">Visit ↗</span>
        </component>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import work from 'src/data/work.js'

const gridSection = ref(null)
const prefersReducedMotion = usePrefersReducedMotion()

onMounted(() => {
  if (prefersReducedMotion.value) return
  gsap.from(gridSection.value.querySelectorAll('.work-card'), {
    y: 20,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: 'power2.out'
  })
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

.work-card {
  position: relative;
  display: block;
  padding: 1.5rem;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 6px;
  text-decoration: none;
  color: var(--navy);
  background: var(--paper);
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--coral);
    transform: translateY(-3px);
  }
}

.work-card__title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.work-card__description {
  font-size: 0.9rem;
  line-height: 1.55;
  opacity: 0.8;
  margin: 0;
}

.work-card__cta {
  margin-top: 1rem;
}
</style>
