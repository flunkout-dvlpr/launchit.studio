<template>
  <svg
    ref="root"
    class="fw-marker"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Same silhouettes as FrameworkStepIcon, always shown resolved/at-rest
         — this is the nav marker, not a second metaphor. Only a single
         small accent element (where one exists) gets a very light idle
         breathing loop; everything else is static. -->
    <g v-if="type === 'source'">
      <circle class="idle" cx="50" cy="44" r="18" fill="var(--gold)" opacity="0.3" />
      <path d="M50,25 C61,25 70,34 70,45 C70,53 65,58 61,62 L39,62 C35,58 30,53 30,45 C30,34 39,25 50,25 Z"
        stroke="var(--navy)" stroke-width="2.5" fill="var(--gold)" />
      <path d="M44,42 L48,50 L52,42 L56,50" stroke="var(--navy)" stroke-width="1.5" fill="none" />
      <rect x="42" y="62" width="16" height="9" rx="1.5" fill="var(--navy)" />
    </g>

    <g v-else-if="type === 'vet'">
      <line x1="35" y1="4" x2="35" y2="96" stroke="var(--gridline)" stroke-width="1" opacity="0.15" />
      <line x1="65" y1="4" x2="65" y2="96" stroke="var(--gridline)" stroke-width="1" opacity="0.15" />
      <line x1="6" y1="28" x2="40" y2="28" stroke="var(--navy)" stroke-width="2.5" />
      <line x1="60" y1="28" x2="94" y2="28" stroke="var(--navy)" stroke-width="2.5" />
      <line x1="6" y1="50" x2="40" y2="50" stroke="var(--navy)" stroke-width="2.5" />
      <line x1="60" y1="50" x2="94" y2="50" stroke="var(--navy)" stroke-width="2.5" />
      <line x1="6" y1="72" x2="40" y2="72" stroke="var(--navy)" stroke-width="2.5" />
      <line x1="60" y1="72" x2="94" y2="72" stroke="var(--navy)" stroke-width="2.5" />
      <circle class="idle" cx="50" cy="88" r="4" fill="var(--coral)" />
    </g>

    <g v-else-if="type === 'select'">
      <circle class="idle" cx="40" cy="50" r="7" fill="var(--coral)" />
      <circle cx="55" cy="50" r="2" fill="var(--coral)" />
      <circle cx="62" cy="50" r="2" fill="var(--coral)" />
      <circle cx="69" cy="50" r="2" fill="var(--coral)" />
    </g>

    <g v-else-if="type === 'scope'">
      <g transform="translate(50,50)">
        <circle r="48" fill="var(--navy)" />
        <line x1="45.11" y1="16.42" x2="10" y2="0" stroke="var(--gridline)" stroke-width="1.5" />
        <line x1="15.29" y1="45.50" x2="6.24" y2="7.82" stroke="var(--gridline)" stroke-width="1.5" />
        <line x1="-26.04" y1="40.32" x2="-2.23" y2="9.75" stroke="var(--gridline)" stroke-width="1.5" />
        <line x1="-47.76" y1="4.78" x2="-9.01" y2="4.34" stroke="var(--gridline)" stroke-width="1.5" />
        <line x1="-33.51" y1="-34.36" x2="-9.01" y2="-4.34" stroke="var(--gridline)" stroke-width="1.5" />
        <line x1="5.97" y1="-47.63" x2="-2.23" y2="-9.75" stroke="var(--gridline)" stroke-width="1.5" />
        <line x1="40.96" y1="-25.03" x2="6.24" y2="-7.82" stroke="var(--gridline)" stroke-width="1.5" />
        <polygon points="10,0 6.24,7.82 -2.23,9.75 -9.01,4.34 -9.01,-4.34 -2.23,-9.75 6.24,-7.82" fill="var(--paper)" />
        <circle r="48" fill="none" stroke="var(--navy)" stroke-width="1.5" />
      </g>
    </g>

    <g v-else-if="type === 'build'">
      <rect x="20" y="62" width="20" height="18" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="40" y="62" width="20" height="18" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="60" y="62" width="20" height="18" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="20" y="43" width="10" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="30" y="43" width="20" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="50" y="43" width="20" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="70" y="43" width="10" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="20" y="24" width="20" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="40" y="24" width="20" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
      <rect x="60" y="24" width="20" height="19" fill="var(--coral)" stroke="var(--navy)" stroke-width="2" />
    </g>

    <g v-else-if="type === 'prep'">
      <rect x="25" y="10" width="50" height="70" rx="2" stroke="var(--navy)" stroke-width="2.5" fill="none" />
      <line x1="33" y1="24" x2="67" y2="24" stroke="var(--navy)" stroke-width="2" />
      <line x1="33" y1="34" x2="67" y2="34" stroke="var(--navy)" stroke-width="2" />
      <line x1="33" y1="44" x2="58" y2="44" stroke="var(--navy)" stroke-width="2" />
      <rect x="41" y="60" width="8" height="8" stroke="var(--navy)" stroke-width="1.5" fill="none" />
      <path d="M42.5,64 L45,66.5 L48.5,60.5" stroke="var(--coral)" stroke-width="1.5" fill="none" />
    </g>

    <g v-else-if="type === 'event'">
      <rect x="32" y="14" width="36" height="24" rx="1" stroke="var(--navy)" stroke-width="2.5" fill="var(--gold)" />
      <line x1="50" y1="38" x2="50" y2="48" stroke="var(--navy)" stroke-width="2" />
      <line x1="42" y1="48" x2="58" y2="48" stroke="var(--navy)" stroke-width="2" />
      <circle class="idle" cx="38" cy="70" r="4" fill="var(--navy)" />
      <circle cx="50" cy="72" r="4" fill="var(--navy)" />
      <circle cx="62" cy="70" r="4" fill="var(--navy)" />
    </g>

    <g v-else-if="type === 'recap'">
      <rect x="24" y="8" width="52" height="15" rx="1" stroke="var(--navy)" stroke-width="2" fill="none" />
      <rect x="42" y="14" width="16" height="3" rx="1.5" fill="var(--navy)" />
      <rect x="24" y="25" width="52" height="15" rx="1" stroke="var(--navy)" stroke-width="2" fill="none" />
      <rect x="42" y="31" width="16" height="3" rx="1.5" fill="var(--navy)" />
      <rect x="20" y="44" width="60" height="20" stroke="var(--navy)" stroke-width="2" fill="var(--gridline)" opacity="0.15" />
      <path d="M36,47 L46,47 L49,50 L72,50 L72,62 L36,62 Z" stroke="var(--navy)" stroke-width="2" fill="var(--coral)" />
      <rect x="16" y="66" width="68" height="12" rx="1" stroke="var(--navy)" stroke-width="2" fill="none" />
      <rect x="42" y="70" width="16" height="3" rx="1.5" fill="var(--navy)" />
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'

defineProps({
  type: { type: String, required: true },
  size: { type: [Number, String], default: 40 }
})

const prefersReducedMotion = usePrefersReducedMotion()
const root = ref(null)

let idleLoop

onMounted(() => {
  if (prefersReducedMotion.value) return
  const el = root.value.querySelector('.idle')
  if (!el) return
  gsap.set(el, { transformOrigin: '50% 50%' })
  idleLoop = gsap.to(el, {
    scale: 1.15,
    opacity: 0.75,
    duration: 1.6,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })
})

onBeforeUnmount(() => {
  idleLoop && idleLoop.kill()
})
</script>

<style lang="scss" scoped>
.fw-marker {
  overflow: visible;
  display: block;
}
</style>
