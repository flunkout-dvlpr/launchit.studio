<template>
  <!-- Below 900px, or reduced motion: a plain native-scroll strip, no
       pinning/JS at all. Scroll-jacking on a touch device fights the
       browser's own scroll gesture rather than working with it, same
       reasoning FrameworkLoop falls back to FrameworkVertical below 900px. -->
  <div v-if="$q.screen.width < 900 || prefersReducedMotion" class="work-filmstrip__fallback">
    <component
      :is="item.link ? 'a' : 'div'"
      v-for="item in work"
      :key="item.title"
      :href="item.link || undefined"
      :target="item.link ? '_blank' : undefined"
      :rel="item.link ? 'noopener' : undefined"
      class="work-filmstrip__card"
      @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
    >
      <WorkCard :item="item" />
    </component>
  </div>

  <div v-else ref="pinSection" class="work-filmstrip">
    <div class="work-filmstrip__group">
      <div class="work-filmstrip__hint font-label">Scroll to browse — it loops →</div>
      <div ref="viewportEl" class="work-filmstrip__viewport">
        <!-- Rendered twice back-to-back so the strip can wrap seamlessly:
             shifting exactly one set's width to the left looks identical
             to not having shifted at all, which is what makes the loop
             invisible instead of an obvious jump-cut back to card 1. -->
        <div ref="stripEl" class="work-filmstrip__strip">
          <component
            :is="item.link ? 'a' : 'div'"
            v-for="(item, i) in loopedWork"
            :key="i"
            :href="item.link || undefined"
            :target="item.link ? '_blank' : undefined"
            :rel="item.link ? 'noopener' : undefined"
            class="work-filmstrip__card"
            @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
          >
            <WorkCard :item="item" />
          </component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import WorkCard from 'components/WorkCard.vue'
import work from 'src/data/work.js'

const $q = useQuasar()
const prefersReducedMotion = usePrefersReducedMotion()
const pinSection = ref(null)
const viewportEl = ref(null)
const stripEl = ref(null)
let scrollTrigger = null

// Two copies of the deck rendered in a row (see template) — the loop wraps
// across their seam.
const loopedWork = [...work, ...work]

// How far a card can grow/fall off from its resting scale as it moves away
// from the viewport's horizontal center — read together with FOCUS_RADIUS
// below, this is the whole "centered card comes into focus" effect.
const FOCUS_SCALE = 0.12
const FOCUS_OPACITY = 0.4
const FOCUS_RADIUS = 320 // px from center before a card is fully unfocused

// How many full passes through the deck the pin holds scroll for before
// releasing back to normal page scroll — "loops" without trapping the user
// on this section forever.
const LOOP_COUNT = 3

onMounted(async () => {
  if ($q.screen.width < 900 || prefersReducedMotion.value) return

  // Wait a tick so the strip's real rendered width (both copies laid out)
  // is available before measuring — doing this on the same tick the
  // component mounts can catch it mid-layout.
  await nextTick()

  const cards = Array.from(stripEl.value.children)
  // Width of exactly one full set (cards.length is 2x work.length): the
  // offset between a card and its duplicate one set later, which is the
  // exact distance a seamless wrap needs.
  const singleSetWidth = cards[work.length].offsetLeft - cards[0].offsetLeft
  if (!singleSetWidth) return

  const wrapX = gsap.utils.wrap(-singleSetWidth, 0)

  function applyFocus(x) {
    const viewportCenter = viewportEl.value.clientWidth / 2
    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2 + x
      const dist = Math.abs(cardCenter - viewportCenter)
      const focus = gsap.utils.clamp(0, 1, 1 - dist / FOCUS_RADIUS)
      gsap.set(card, {
        scale: 1 + focus * FOCUS_SCALE,
        opacity: 1 - (1 - focus) * FOCUS_OPACITY
      })
    })
  }

  const totalScroll = singleSetWidth * LOOP_COUNT

  scrollTrigger = ScrollTrigger.create({
    trigger: pinSection.value,
    start: 'top top',
    end: () => '+=' + totalScroll,
    pin: true,
    scrub: true,
    onUpdate: (self) => {
      const x = wrapX(-totalScroll * self.progress)
      gsap.set(stripEl.value, { x })
      applyFocus(x)
    }
  })

  applyFocus(0) // settle the resting/first card's focus state before any scroll
})

onBeforeUnmount(() => {
  scrollTrigger && scrollTrigger.kill()
})
</script>

<style lang="scss" scoped>
.work-filmstrip__fallback {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 0 1.5rem 1rem;
  scroll-snap-type: x proximity;

  .work-filmstrip__card {
    flex: none;
    width: 260px;
    scroll-snap-align: start;
  }
}

.work-filmstrip {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

// Hint sits directly above the strip as one centered group, rather than
// pinned alone at the top of the viewport — divorced from the strip like
// that, it read as an abandoned leftover label instead of an instruction
// for what's below it.
.work-filmstrip__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.work-filmstrip__hint {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  opacity: 0.5;
}

.work-filmstrip__viewport {
  overflow: hidden;
  width: 100%;
  // Vertical padding gives the focus-scale/hover growth room to breathe
  // without its top/bottom edge getting cut off by this container's own
  // overflow:hidden (needed to hide the horizontal overflow).
  padding: 2rem 1.5rem;
}

.work-filmstrip__strip {
  display: flex;
  gap: 2rem;
  width: max-content;
}

// Sized up from the grid/fallback card — the pinned strip has a full
// viewport height to work with, so both the card box and its content
// (via the :deep() overrides below) scale up to use that space instead of
// sitting at the same small size the cramped grid needs.
.work-filmstrip__card {
  display: block;
  flex: none;
  width: 420px;
  padding: 2.25rem;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 10px;
  text-decoration: none;
  color: var(--navy);
  background: var(--paper);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--coral);
  }
}

.work-filmstrip__viewport {
  // min-height/min-width formulas on WorkCard's title & description are
  // written in em, so bumping these two font-sizes scales the card's
  // reserved space proportionally along with the visible text — no need
  // to separately override the min-height calcs.
  :deep(.work-card-content__title) {
    font-size: 1.5rem;
  }
  :deep(.work-card-content__description) {
    font-size: 1.05rem;
  }
  :deep(.pill-tag) {
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
  }
}
</style>
