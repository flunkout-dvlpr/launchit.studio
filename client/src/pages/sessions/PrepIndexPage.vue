<template>
  <q-page class="prep-index">
    <header class="prep-index__header">
      <span class="pill-tag pill-tag--gold tilt-right">PREP ARTIFACTS</span>
      <h1 class="font-display prep-index__title">What to read before you show up.</h1>
      <p class="font-label prep-index__intro">
        One guide per cycle — the business case, what we'll walk through live,
        and a mini exercise to try beforehand. Plus a worked-example demo
        series showing how a real project gets built end to end.
      </p>
    </header>

    <ul ref="listEl" class="prep-index__list">
      <li v-for="artifact in artifacts" :key="artifact.meta.slug" class="prep-card">
        <router-link :to="`/sessions/prep/${artifact.meta.slug}`" class="prep-card__link">
          <template v-if="artifact.meta.type === 'demo'">
            <span class="pill-tag pill-tag--gold tilt-left">Demo</span>
            <span v-if="artifact.meta.part" class="pill-tag pill-tag--outline">Part {{ artifact.meta.part }} of {{ artifact.meta.totalParts }}</span>
          </template>
          <template v-else>
            <span class="pill-tag pill-tag--coral tilt-left">Cycle {{ artifact.meta.cycle }}</span>
            <span class="pill-tag pill-tag--outline">{{ statusLabel(artifact.meta.status) }}</span>
          </template>
          <h2 class="font-display prep-card__title">{{ artifact.meta.title }}</h2>
          <p class="font-label prep-card__business">{{ artifact.meta.type === 'demo' ? artifact.meta.series : artifact.meta.business }}</p>
          <span class="font-label prep-card__cta">Read the guide →</span>
        </router-link>
        <!-- Sibling, not nested inside the router-link above — an <a> can't
             contain another interactive element, and this needs its own
             click target separate from "read the guide." -->
        <a
          v-if="artifact.meta.liveUrl"
          :href="artifact.meta.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="prep-card__live-link font-label"
          @click="trackEvent('outbound_click', { label: artifact.meta.title, url: artifact.meta.liveUrl })"
        >
          Visit the live site ↗
        </a>
      </li>
    </ul>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { getAllPrepArtifacts } from 'src/utils/prepArtifacts'
import { trackEvent } from 'boot/analytics'

const artifacts = getAllPrepArtifacts()
const listEl = ref(null)

function statusLabel (status) {
  const map = { current: 'This cycle', upcoming: 'Upcoming', past: 'Past session' }
  return map[status] || status
}

onMounted(() => {
  gsap.from(listEl.value.querySelectorAll('.prep-card'), {
    y: 20,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: listEl.value, start: 'top 85%', once: true }
  })
})
</script>

<style lang="scss" scoped>
.prep-index {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.prep-index__header {
  max-width: 680px;
  margin: 0 auto 3rem;
}

.prep-index__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.prep-index__intro {
  opacity: 0.75;
  line-height: 1.6;
}

.prep-index__list {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

// The visual "card" box moved here (off .prep-card__link) once a second,
// sibling link was added below it — an <a> can't contain another <a>, so
// the router-link and the live-site link both needed to sit inside a
// plain container instead of one of them owning the whole card's chrome.
.prep-card {
  background: rgba(244, 240, 230, 0.5);
  border: 1px solid rgba(62, 124, 166, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--coral);
    transform: translateY(-2px);
  }
}

.prep-card__link {
  display: block;
  text-decoration: none;
  color: var(--navy);
}

.prep-card__live-link {
  display: inline-block;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(62, 124, 166, 0.25);
  font-size: 0.85rem;
  color: var(--coral);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.prep-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.85rem 0 0.35rem;
}

.prep-card__business {
  opacity: 0.7;
  margin: 0 0 0.75rem;
}

.prep-card__cta {
  font-size: 0.85rem;
  color: var(--coral);
}
</style>
