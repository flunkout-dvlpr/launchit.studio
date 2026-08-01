<template>
  <div class="logo-mark" :style="{ width: width + 'px', height: size + 'px' }">
    <svg :width="width" :height="size" viewBox="15 26 90 68" xmlns="http://www.w3.org/2000/svg" class="logo-mark__layer">
      <g stroke="var(--gridline)" stroke-width="1.5" opacity="0.55">
        <line x1="20" y1="40" x2="20" y2="80" /><line x1="40" y1="40" x2="40" y2="80" />
        <line x1="60" y1="40" x2="60" y2="80" /><line x1="80" y1="40" x2="80" y2="80" />
        <line x1="100" y1="40" x2="100" y2="80" />
        <line x1="20" y1="40" x2="100" y2="40" /><line x1="20" y1="60" x2="100" y2="60" />
        <line x1="20" y1="80" x2="100" y2="80" />
      </g>
      <rect x="60" y="40" width="20" height="20" fill="var(--navy)" opacity="0.06" />
    </svg>

    <svg
      ref="rocketSvgEl"
      :width="width"
      :height="size"
      viewBox="15 26 90 68"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-mark__layer"
    >
      <g ref="rocketGroupEl" transform="translate(63,57) rotate(30) scale(2.1)">
        <path d="M 0,-13 L 4,-2 L 4,8 L 9,13 L 3,9 L 0,12 L -3,9 L -9,13 L -4,8 L -4,-2 Z" fill="var(--navy)" opacity="0.18" transform="translate(1.19,1.67)" />
        <path d="M 0,-13 L 4,-2 L 4,8 L 9,13 L 3,9 L 0,12 L -3,9 L -9,13 L -4,8 L -4,-2 Z" fill="var(--coral)" stroke="var(--navy)" stroke-width="0.71" stroke-linejoin="round" />
        <circle cx="0" cy="-1" r="2.2" fill="var(--paper)" stroke="var(--navy)" stroke-width="0.71" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  // Controls rendered height. Width is derived from the shared viewBox's
  // actual aspect ratio (90x68, wider than tall) rather than forced
  // square, which would just reintroduce empty top/bottom padding.
  size: {
    type: [Number, String],
    default: 32
  }
})

const width = computed(() => (Number(props.size) * 90) / 68)

// Exposed so a parent can grab the rocket's real DOM node/bounding box to
// drive the fly-around-and-land-back click animation, the grid layer is
// purely static and never needs to be reached from outside.
const rocketSvgEl = ref(null)
const rocketGroupEl = ref(null)
defineExpose({ rocketSvgEl, rocketGroupEl })
</script>

<style scoped>
.logo-mark {
  position: relative;
}

.logo-mark__layer {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>
