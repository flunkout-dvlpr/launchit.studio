<template>
  <div v-if="$q.screen.width < 900" class="framework-loop__fallback">
    <FrameworkVertical :steps="steps" />
  </div>

  <div v-else ref="pinSection" class="framework-loop">
    <div class="framework-loop__scroll-hint font-label">
      {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(count).padStart(2, '0') }} — scroll to progress
    </div>
    <div class="framework-loop__ring">
      <svg class="framework-loop__track" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" stroke="rgba(62,124,166,0.25)" stroke-width="1" fill="none" />
        <circle
          ref="progressRing"
          class="framework-loop__progress"
          cx="50" cy="50" r="38"
          stroke="var(--coral)" stroke-width="1.25" fill="none"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <button
        v-for="(step, i) in steps"
        :key="step.title"
        type="button"
        class="framework-loop__node"
        :class="{ 'is-active': i === activeIndex }"
        :style="nodeStyle(i)"
        @click="select(i)"
      >
        <FrameworkStepMarker :type="step.type" :size="34" />
        <span class="framework-loop__node-label font-label">{{ String(i + 1).padStart(2, '0') }}</span>
      </button>
    </div>

    <div class="framework-loop__detail">
      <transition name="fw-fade" mode="out-in">
        <div :key="activeIndex" class="framework-loop__detail-inner">
          <FrameworkStepIcon ref="detailIconRef" :type="steps[activeIndex].type" :size="140" />
          <div>
            <span class="pill-tag pill-tag--coral tilt-left">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
            <h2 class="font-display framework-loop__title">{{ steps[activeIndex].title }}</h2>
            <p class="font-label framework-loop__body">{{ steps[activeIndex].body }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import FrameworkStepIcon from './FrameworkStepIcon.vue'
import FrameworkStepMarker from './FrameworkStepMarker.vue'
import FrameworkVertical from './FrameworkVertical.vue'

const props = defineProps({
  steps: { type: Array, required: true }
})

const $q = useQuasar()
const prefersReducedMotion = usePrefersReducedMotion()
const activeIndex = ref(0)
const progressRing = ref(null)
const detailIconRef = ref(null)
const pinSection = ref(null)
let scrollTrigger = null

const count = computed(() => props.steps.length)

function angleFor (i) {
  return (i / count.value) * 360 - 90
}

function nodeStyle (i) {
  const rad = (angleFor(i) * Math.PI) / 180
  const x = 50 + 38 * Math.cos(rad)
  const y = 50 + 38 * Math.sin(rad)
  return { left: `${x}%`, top: `${y}%` }
}

function select (i) {
  activeIndex.value = i
  // A manual pick should win over wherever the pinned scroll happens to
  // currently sit — otherwise the next scroll tick would just snap it
  // back to the scroll-implied step.
  if (scrollTrigger) {
    scrollTrigger.scroll(scrollTrigger.start + (i / count.value) * (scrollTrigger.end - scrollTrigger.start))
  }
}

watch(activeIndex, async (i) => {
  gsap.to(progressRing.value, {
    drawSVG: `0% ${((i + 1) / count.value) * 100}%`,
    duration: prefersReducedMotion.value ? 0 : 0.6,
    ease: 'power2.inOut'
  })
  // The detail icon remounts on step change (transition mode="out-in"),
  // so wait for the new instance before triggering its entrance.
  await nextTick()
  detailIconRef.value && detailIconRef.value.play()
})

onMounted(() => {
  gsap.set(progressRing.value, { drawSVG: '0% 0%' })
  if ($q.screen.width < 900) return

  detailIconRef.value && detailIconRef.value.play()

  // Pin this section and let scroll position — not a timer — drive which
  // step is active, so it can be compared directly against Vertical's
  // per-item scroll-reveal.
  scrollTrigger = ScrollTrigger.create({
    trigger: pinSection.value,
    start: 'top 80',
    end: () => '+=' + count.value * 550,
    pin: true,
    onUpdate: (self) => {
      const idx = Math.min(count.value - 1, Math.floor(self.progress * count.value))
      if (idx !== activeIndex.value) activeIndex.value = idx
    }
  })
})

onBeforeUnmount(() => {
  scrollTrigger && scrollTrigger.kill()
})
</script>

<style lang="scss" scoped>
.framework-loop {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
}

.framework-loop__scroll-hint {
  position: absolute;
  top: -2.25rem;
  left: 0;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  opacity: 0.5;
}

.framework-loop__ring {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
}

.framework-loop__track {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.framework-loop__node {
  position: absolute;
  width: 64px;
  height: 64px;
  margin-left: -32px;
  margin-top: -32px;
  border-radius: 50%;
  background: var(--paper);
  border: 1.5px solid rgba(62, 124, 166, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
  padding: 0;

  &:hover {
    transform: scale(1.06);
  }

  &.is-active {
    border-color: var(--coral);
    box-shadow: 0 0 0 3px rgba(216, 90, 48, 0.15);
  }
}

.framework-loop__node-label {
  font-size: 0.55rem;
  opacity: 0.5;
  margin-top: 1px;
}

.framework-loop__detail-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.framework-loop__title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0.75rem 0 0.6rem;
}

.framework-loop__body {
  line-height: 1.7;
  opacity: 0.8;
  margin: 0;
}

.fw-fade-enter-active, .fw-fade-leave-active {
  transition: opacity 0.25s ease;
}
.fw-fade-enter-from, .fw-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1150px) {
  .framework-loop {
    grid-template-columns: 1fr;
  }
}
</style>
