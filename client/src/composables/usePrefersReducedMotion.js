import { ref, onBeforeUnmount } from 'vue'

// Framework page animations check this and skip straight to each
// animation's end-state via gsap.set instead of playing it, and suppress
// continuous loops (Event's pulse, Loop's auto-advance).
export function usePrefersReducedMotion () {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  const prefersReducedMotion = ref(query.matches)

  const onChange = (e) => {
    prefersReducedMotion.value = e.matches
  }
  query.addEventListener('change', onChange)
  onBeforeUnmount(() => query.removeEventListener('change', onChange))

  return prefersReducedMotion
}
