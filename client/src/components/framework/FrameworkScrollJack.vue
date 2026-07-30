<template>
  <div v-if="$q.screen.width < 900" class="framework-scroll__fallback">
    <FrameworkVertical :steps="steps" />
  </div>

  <section v-else ref="pinEl" class="framework-scroll">
    <div class="framework-scroll__counter font-label">
      {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(steps.length).padStart(2, '0') }}
    </div>
    <div ref="trackEl" class="framework-scroll__track">
      <div v-for="(step, i) in steps" :key="step.title" class="framework-scroll__panel">
        <FrameworkStepIcon :ref="(el) => setIconRef(el, i)" :type="step.type" :size="96" />
        <h2 class="font-display framework-scroll__title">{{ step.title }}</h2>
        <p class="font-label framework-scroll__body">{{ step.body }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { gsap, ScrollTrigger } from 'boot/gsap'
import FrameworkStepIcon from './FrameworkStepIcon.vue'
import FrameworkVertical from './FrameworkVertical.vue'

const props = defineProps({
  steps: { type: Array, required: true }
})

const $q = useQuasar()
const pinEl = ref(null)
const trackEl = ref(null)
const activeIndex = ref(0)
const iconRefs = []

function setIconRef (el, i) {
  if (el) iconRefs[i] = el
}

let tween

onMounted(() => {
  if ($q.screen.width < 900) return

  const track = trackEl.value
  const getScrollAmount = () => Math.max(track.scrollWidth - window.innerWidth, 0)

  tween = gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: pinEl.value,
      start: 'top top',
      end: () => '+=' + getScrollAmount(),
      scrub: 0.4,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (props.steps.length - 1))
        if (idx !== activeIndex.value) {
          activeIndex.value = idx
          iconRefs[idx] && iconRefs[idx].play()
        }
      }
    }
  })

  iconRefs[0] && iconRefs[0].play()
})

onBeforeUnmount(() => {
  if (tween) {
    tween.scrollTrigger && tween.scrollTrigger.kill()
    tween.kill()
  }
})
</script>

<style lang="scss" scoped>
.framework-scroll {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.framework-scroll__counter {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 2;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  opacity: 0.6;
}

.framework-scroll__track {
  display: flex;
  height: 100%;
  align-items: center;
  will-change: transform;
}

.framework-scroll__panel {
  flex: 0 0 420px;
  padding: 0 3rem;
  box-sizing: border-box;
}

.framework-scroll__title {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 1.25rem 0 0.75rem;
}

.framework-scroll__body {
  line-height: 1.7;
  opacity: 0.8;
  max-width: 360px;
}
</style>
