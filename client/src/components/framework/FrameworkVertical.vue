<template>
  <div ref="timelineEl" class="framework-timeline">
    <div class="framework-timeline__track">
      <div ref="progressEl" class="framework-timeline__progress" />
    </div>

    <ol class="framework-timeline__list">
      <li v-for="(step, i) in steps" :key="step.title" class="framework-step">
        <span class="framework-step__node">
          <FrameworkStepIcon :ref="(el) => setIconRef(el, i)" :type="step.type" :size="88" />
        </span>
        <div class="framework-step__content">
          <h2 class="font-display framework-step__title">{{ step.title }}</h2>
          <p class="font-label framework-step__body">{{ step.body }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'
import FrameworkStepIcon from './FrameworkStepIcon.vue'

defineProps({
  steps: { type: Array, required: true }
})

const timelineEl = ref(null)
const progressEl = ref(null)
const iconRefs = []

function setIconRef (el, i) {
  if (el) iconRefs[i] = el
}

onMounted(() => {
  // Position the track to run exactly from the first node's center to the
  // last node's center — the container itself is taller than that (the
  // last item's title/body trail below its node), so anchoring to the
  // container's top/bottom edges left the line dangling past the final
  // bubble.
  const nodes = timelineEl.value.querySelectorAll('.framework-step__node')
  const trackEl = timelineEl.value.querySelector('.framework-timeline__track')
  const containerTop = timelineEl.value.getBoundingClientRect().top
  const firstNode = nodes[0]
  const lastNode = nodes[nodes.length - 1]
  const firstCenter = firstNode.getBoundingClientRect().top - containerTop + firstNode.offsetHeight / 2
  const lastCenter = lastNode.getBoundingClientRect().top - containerTop + lastNode.offsetHeight / 2
  trackEl.style.top = `${firstCenter}px`
  trackEl.style.bottom = 'auto'
  trackEl.style.height = `${lastCenter - firstCenter}px`

  gsap.set(progressEl.value, { scaleY: 0, transformOrigin: 'top' })
  gsap.to(progressEl.value, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: timelineEl.value,
      start: 'top 60%',
      end: 'bottom 70%',
      scrub: 0.5
    }
  })

  timelineEl.value.querySelectorAll('.framework-step').forEach((el, i) => {
    gsap.from(el, {
      x: -16,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => iconRefs[i] && iconRefs[i].play()
      }
    })
  })
})
</script>

<style lang="scss" scoped>
.framework-timeline {
  position: relative;
  max-width: 680px;
  margin: 0 auto;
}

.framework-timeline__track {
  position: absolute;
  left: 47px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: rgba(62, 124, 166, 0.25);
}

.framework-timeline__progress {
  width: 100%;
  height: 100%;
  background: var(--coral);
}

.framework-timeline__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.framework-step {
  position: relative;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.framework-step__node {
  flex: none;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--paper);
  border: 1.5px solid rgba(62, 124, 166, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.framework-step__title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0.1rem 0 0.4rem;
}

.framework-step__body {
  line-height: 1.65;
  opacity: 0.8;
  margin: 0;
}
</style>
