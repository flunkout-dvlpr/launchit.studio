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
  // The track's left offset and the entrance-animation feel both depend on
  // node size, which shrinks on mobile (see the media query below), so both
  // need to know which layout is active. Read once on mount rather than
  // reacting live to resize, orientation changes mid-scroll aren't worth
  // the complexity here.
  const isMobile = window.matchMedia('(max-width: 720px)').matches

  // Position the track to run exactly from the first node's center to the
  // last node's center — the container itself is taller than that (the
  // last item's title/body trail below its node), so anchoring to the
  // container's top/bottom edges left the line dangling past the final
  // bubble. Horizontal centering is computed the same way rather than
  // hardcoded, node size and container padding both change on mobile
  // (see the media query below), and a fixed px value would drift out of
  // alignment the moment either one does.
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

  // Mobile gets a slightly earlier trigger point and a snappier, shorter-
  // travel entrance. Touch scrolling tends to move in fast flicks rather
  // than the slower, steadier scroll a mouse wheel produces, so the
  // desktop timing (start: 'top 85%', longer travel) reads as sluggish,
  // still catching up after the item's already scrolled into view.
  const triggerStart = isMobile ? 'top 92%' : 'top 85%'
  const triggerFraction = isMobile ? 0.92 : 0.85

  // ScrollTrigger fires a trigger immediately on creation if it's already
  // past its start point, it doesn't wait for an actual scroll gesture.
  // Whenever the viewport's tall enough (or the trigger point loose enough)
  // that more than one step already satisfies that on load, they all fire
  // in the same frame, several icons play before the user's scrolled at
  // all, and by the time those steps are actually brought into focus
  // they're already sitting still. Steps already visible at load get a
  // manual stagger to fix that; steps below the fold don't need one,
  // scrolling to reach them already spaces them out naturally.
  let alreadyVisible = 0
  timelineEl.value.querySelectorAll('.framework-step').forEach((el, i) => {
    const isAlreadyVisible = el.getBoundingClientRect().top < window.innerHeight * triggerFraction
    const delay = isAlreadyVisible ? alreadyVisible * 0.18 : 0
    if (isAlreadyVisible) alreadyVisible++

    gsap.from(el, {
      x: isMobile ? -10 : -16,
      autoAlpha: 0,
      duration: isMobile ? 0.4 : 0.5,
      delay,
      ease: 'power2.out',
      // onStart (not ScrollTrigger's onEnter) so the icon plays in sync
      // with this tween's own delay above, onEnter fires the instant
      // ScrollTrigger detects entry, ignoring any delay on the tween.
      onStart: () => iconRefs[i] && iconRefs[i].play(),
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        once: true
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
