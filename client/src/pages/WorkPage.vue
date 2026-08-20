<template>
  <q-page class="work-page">
    <section class="work-hero">
      <div class="work-hero__inner">
        <span class="font-label work-hero__eyebrow">LAUNCHIT STUDIO</span>
        <h1 class="font-display work-hero__title">Selected work.</h1>
      </div>
    </section>

    <section ref="gridSection" class="work-grid-section">
      <div class="work-grid">
        <component
          :is="item.link ? 'a' : 'div'"
          v-for="item in work"
          :key="item.title"
          :href="item.link || undefined"
          :target="item.link ? '_blank' : undefined"
          :rel="item.link ? 'noopener' : undefined"
          class="work-card"
          @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
        >
          <span
            class="pill-tag work-card__type"
            :class="[
              item.type === 'webapp' ? 'pill-tag--teal' : 'pill-tag--gold',
              { 'work-card__type--hidden': !item.type }
            ]"
          >{{ item.type === 'webapp' ? 'Web App' : item.type === 'website' ? 'Website' : ' ' }}</span>
          <h2 class="font-display work-card__title">
            <span v-if="item.icon" class="work-card__icon" aria-hidden="true">{{ item.icon }}</span>
            {{ item.title }}
          </h2>
          <p class="font-label work-card__description">{{ item.description }}</p>
          <span v-if="item.link" class="pill-tag pill-tag--coral tilt-right work-card__cta">Visit ↗</span>
        </component>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import work from 'src/data/work.js'

const gridSection = ref(null)
const prefersReducedMotion = usePrefersReducedMotion()

onMounted(() => {
  if (prefersReducedMotion.value) return
  // Smaller y-offset and tighter stagger than before — row 1 is the only
  // row actually visible at page load, so it's the only row anyone can
  // catch mid-animation, and a wide stagger there reads as "these cards
  // aren't aligned" rather than "this is an intentional reveal." Settled
  // state was already correct either way (grid's own align-items: stretch
  // plus the fixed card heights), this only affects how it looks in
  // motion, not where things land.
  gsap.from(gridSection.value.querySelectorAll('.work-card'), {
    y: 10,
    autoAlpha: 0,
    duration: 0.5,
    stagger: 0.03,
    ease: 'power2.out'
  })
})
</script>

<style lang="scss" scoped>
.work-page {
  background: var(--paper);
}

.work-hero {
  padding: 4rem 1.5rem 2.5rem;
}

.work-hero__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.work-hero__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.work-hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  margin: 0.5rem 0 0;
}

.work-grid-section {
  padding: 0 1.5rem 5rem;
}

.work-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.work-card {
  position: relative;
  display: flex;
  flex-direction: column;
  // Deliberately no align-items override here — default stretch is what
  // lets the title/description span the card's full width and wrap
  // normally. The two pill-tag badges opt out of that individually below
  // (align-self), since stretching a small pill to the card's full width
  // would make it look broken, not centered content-wise.
  padding: 1.5rem;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 6px;
  text-decoration: none;
  color: var(--navy);
  background: var(--paper);
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--coral);
    transform: translateY(-3px);
  }
}

.work-card__type {
  align-self: flex-start;
  margin-bottom: 0.75rem;
}

// Always rendered (never v-if'd away) so its height + margin is reserved
// on every card, even ones with no type (Project Switcher) — visibility
// hidden rather than removed from the DOM, so the space stays, only the
// pill itself disappears. Without this, that one card ends up shorter
// than its row-mates despite title/description both being fixed-height.
.work-card__type--hidden {
  visibility: hidden;
}

// min-height reserves 2 lines regardless of actual title length — same
// reasoning as the description below: a card with a title that wraps to 2
// lines ("Digital Bulletin Board") vs. one that fits on 1 ("Clika")
// otherwise throws total card height off across rows even with the
// description itself now fixed, since only one of the two variable-height
// pieces was actually being controlled.
.work-card__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: calc(1.3em * 2);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.5rem;
}

// Emoji render as their own full-color glyphs regardless of CSS color, so
// only sizing/spacing apply here — that's also the whole reason for
// switching to emoji over the Material Icons version, more color/pop for
// free. Sized relative to the title's own font-size (this rule lives
// inside .work-card__title's font context), not the description's.
.work-card__icon {
  flex: none;
  font-size: 1.8em;
  line-height: 1;
}

// Fixed at 5 lines' worth of height (line-height x 5), sized generously
// off the longest current description (142 characters, Ideal Instruction)
// at this column's width — reserving the same space regardless of actual
// text length is what makes every card the same size (grid's own
// align-items: stretch only equalizes heights within a single row, not
// across the whole grid) and what gives the CTA below a truly fixed
// position, not just "usually fixed." Keep future descriptions at or
// under 142 characters (see work.js) or this may need to grow.
.work-card__description {
  min-height: calc(1.55em * 5);
  font-size: 0.9rem;
  line-height: 1.55;
  opacity: 0.8;
  margin: 0;
}

// margin-top: auto pins this to the bottom of the card regardless of how
// much title/description text comes before it — without it, a card with a
// shorter description has its CTA riding higher than its row-mates', which
// reads as "this card sits lower" even though the card boxes themselves
// (grid's default align-items: stretch) are already the same height.
.work-card__cta {
  align-self: flex-start;
  // margin-top, not padding-top — padding-top would add onto the pill's
  // own internal top padding (already set at 0.3rem by the base .pill-tag
  // class) instead of adding space above the pill, which is what made it
  // look lopsided/broken.
  margin-top: auto;
}
</style>
