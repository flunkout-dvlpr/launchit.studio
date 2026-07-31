<template>
  <svg :width="size" :height="size" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="logo-mark">
    <g stroke="var(--gridline)" stroke-width="1.5" opacity="0.55">
      <line x1="20" y1="40" x2="20" y2="80" /><line x1="40" y1="40" x2="40" y2="80" />
      <line x1="60" y1="40" x2="60" y2="80" /><line x1="80" y1="40" x2="80" y2="80" />
      <line x1="100" y1="40" x2="100" y2="80" />
      <line x1="20" y1="40" x2="100" y2="40" /><line x1="20" y1="60" x2="100" y2="60" />
      <line x1="20" y1="80" x2="100" y2="80" />
    </g>
    <rect x="60" y="40" width="20" height="20" fill="var(--navy)" opacity="0.06" />

    <template v-if="variant === 'L'">
      <g transform="translate(70,50) rotate(6) scale(1.4)">
        <path d="M -8,-12 L -1,-11 L -2,4 L 7,5 L 9,12 L -9,11 Z" fill="var(--navy)" opacity="0.18" transform="translate(2,3)" />
      </g>
      <g transform="translate(70,50) rotate(6) scale(1.4)">
        <path d="M -8,-12 L -1,-11 L -2,4 L 7,5 L 9,12 L -9,11 Z" fill="var(--coral)" stroke="var(--navy)" stroke-width="1.07" stroke-linejoin="round" />
      </g>
    </template>
    <template v-else>
      <g transform="translate(63,57) rotate(30) scale(2.1)">
        <path d="M 0,-13 L 4,-2 L 4,8 L 9,13 L 3,9 L 0,12 L -3,9 L -9,13 L -4,8 L -4,-2 Z" fill="var(--navy)" opacity="0.18" transform="translate(1.19,1.67)" />
      </g>
      <g transform="translate(63,57) rotate(30) scale(2.1)">
        <path d="M 0,-13 L 4,-2 L 4,8 L 9,13 L 3,9 L 0,12 L -3,9 L -9,13 L -4,8 L -4,-2 Z" fill="var(--coral)" stroke="var(--navy)" stroke-width="0.71" stroke-linejoin="round" />
        <circle cx="0" cy="-1" r="2.2" fill="var(--paper)" stroke="var(--navy)" stroke-width="0.71" />
      </g>
    </template>
  </svg>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'L',
    validator: (v) => ['L', 'rocket'].includes(v)
  },
  size: {
    type: [Number, String],
    default: 32
  }
})
</script>

<style scoped>
.logo-mark {
  display: block;
}
</style>
