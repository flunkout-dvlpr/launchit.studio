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

// Position the track to run exactly from the first node's center to the
// last node's center — the container itself is taller than that (the last
// item's title/body trail below its node), so anchoring to the container's
// top/bottom edges left the line dangling past the final bubble. Horizontal
// centering is computed the same way rather than hardcoded, node size and
// container padding both change on mobile, and a fixed px value would drift
// out of alignment the moment either one does. Pulled out as its own
// function so it can be re-run after web fonts finish loading, not just
// once on mount, the self-hosted fonts can swap in a beat after first
// paint and reflow the body text, which shifts every node below the one
// that rewrapped and left the track measured against stale positions,
// short of the last node.
function positionTrack () {
  const nodes = timelineEl.value.querySelectorAll('.framework-step__node')
  const trackEl = timelineEl.value.querySelector('.framework-timeline__track')
  const containerRect = timelineEl.value.getBoundingClientRect()
  const firstNode = nodes[0]
  const lastNode = nodes[nodes.length - 1]
  const firstNodeRect = firstNode.getBoundingClientRect()
  const firstCenter = firstNodeRect.top - containerRect.top + firstNode.offsetHeight / 2
  const lastCenter = lastNode.getBoundingClientRect().top - containerRect.top + lastNode.offsetHeight / 2
  const nodeCenterX = firstNodeRect.left - containerRect.left + firstNode.offsetWidth / 2
  trackEl.style.top = `${firstCenter}px`
  trackEl.style.bottom = 'auto'
  trackEl.style.height = `${lastCenter - firstCenter}px`
  trackEl.style.left = `${nodeCenterX - 1}px`
}

onMounted(() => {
  // The entrance-animation feel depends on node size, which shrinks on
  // mobile (see the media query below). Read once on mount rather than
  // reacting live to resize, orientation changes mid-scroll aren't worth
  // the complexity here.
  const isMobile = window.matchMedia('(max-width: 720px)').matches

  positionTrack()

  // Web fonts can finish loading after this first measurement and reflow
  // the body text, re-measure and tell ScrollTrigger to recalculate once
  // that settles so both the track and every scroll trigger's positions
  // stay accurate.
  if (document.fonts) {
    document.fonts.ready.then(() => {
      positionTrack()
      ScrollTrigger.refresh()
    })
  }

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

  // Trigger point is the vertical center of the viewport, a step reveals
  // once its top crosses the middle of the screen. Narrow enough that two
  // steps sharing it at once is rare (consecutive nodes are spaced well
  // over 150px apart), without pinning it up near the top edge, which
  // left the screen looking empty on load and mostly blank through most
  // of each scroll (a step only appearing once nearly at the top).
  // Center keeps the screen feeling full while scrolling and the first
  // step visible without a gap on load.
  const triggerStart = 'top center'

  timelineEl.value.querySelectorAll('.framework-step').forEach((el, i) => {
    gsap.from(el, {
      x: isMobile ? -10 : -16,
      autoAlpha: 0,
      duration: isMobile ? 0.4 : 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
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
  padding: 0 1.5rem;

  @media (max-width: 720px) {
    padding: 0 1.25rem;
  }
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

  @media (max-width: 720px) {
    gap: 1rem;
    margin-bottom: 2rem;
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

  @media (max-width: 720px) {
    width: 72px;
    height: 72px;

    // The icon's own :size prop stays fixed (it's tuned for the desktop
    // detail view), CSS just scales the rendered SVG down to fit the
    // smaller node — safe because every icon uses a fixed 100x100
    // viewBox, so this is a uniform visual scale, not a geometry change.
    :deep(svg) {
      width: 72px;
      height: 72px;
    }
  }
}

.framework-step__title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0.1rem 0 0.4rem;

  @media (max-width: 720px) {
    font-size: 1.05rem;
  }
}

.framework-step__body {
  line-height: 1.65;
  opacity: 0.8;
  margin: 0;
}
</style>
