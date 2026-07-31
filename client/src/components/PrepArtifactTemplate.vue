<template>
  <article ref="root" class="prep-template">
    <header class="prep-template__header">
      <div class="prep-template__badges">
        <template v-if="artifact.meta.type === 'demo'">
          <span class="pill-tag pill-tag--gold tilt-left">Demo</span>
          <span v-if="artifact.meta.part" class="pill-tag pill-tag--outline tilt-right">Part {{ artifact.meta.part }} of {{ artifact.meta.totalParts }}</span>
        </template>
        <template v-else>
          <span class="pill-tag pill-tag--coral tilt-left">Cycle {{ artifact.meta.cycle }}</span>
          <span class="pill-tag pill-tag--outline tilt-right">{{ statusLabel }}</span>
        </template>
      </div>
      <h1 class="font-display prep-template__title">{{ artifact.meta.title }}</h1>
      <p v-if="artifact.meta.type === 'demo'" class="font-label prep-template__meta">
        {{ artifact.meta.series }}
      </p>
      <p v-else class="font-label prep-template__meta">
        {{ artifact.meta.business }} · {{ artifact.meta.venue }}
      </p>
      <p class="font-label prep-template__meta prep-template__meta--muted">
        {{ artifact.meta.date }} · {{ artifact.meta.readTime }} read
      </p>
    </header>

    <div class="dimension-line" />

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prep-template__body font-label" v-html="artifact.html" />
  </article>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { gsap } from 'boot/gsap'

const props = defineProps({
  artifact: { type: Object, required: true }
})

const statusLabel = computed(() => {
  const map = { current: 'This cycle', upcoming: 'Upcoming', past: 'Past session' }
  return map[props.artifact.meta.status] || props.artifact.meta.status
})

const root = ref(null)

onMounted(() => {
  gsap.from(root.value.children, {
    y: 20,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  })
})
</script>

<style lang="scss" scoped>
.prep-template {
  max-width: 680px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.prep-template__badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.prep-template__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 0.75rem;
}

.prep-template__meta {
  font-size: 0.85rem;
  margin: 0.15rem 0;
  opacity: 0.75;

  &--muted {
    opacity: 0.55;
  }
}

.prep-template__body {
  line-height: 1.75;
  font-size: 1rem;

  :deep(h2) {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 600;
    margin: 2.25rem 0 0.75rem;
  }

  :deep(h3) {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
  }

  :deep(p) {
    margin: 0 0 1rem;
  }

  :deep(ul), :deep(ol) {
    margin: 0 0 1rem;
    padding-left: 1.25rem;
  }

  :deep(li) {
    margin-bottom: 0.4rem;
  }

  :deep(a) {
    color: var(--coral);
  }

  :deep(code) {
    background: rgba(62, 124, 166, 0.12);
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: var(--navy);
    color: var(--paper);
    padding: 1rem 1.1rem;
    border-radius: 6px;
    overflow-y: auto;
    max-height: 480px;
    margin: 0 0 1.25rem;
    white-space: pre-wrap;
    word-break: break-word;

    code {
      background: none;
      padding: 0;
    }
  }
}
</style>
