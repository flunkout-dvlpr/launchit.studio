<template>
  <div class="work-card-content">
    <span
      class="pill-tag work-card-content__type"
      :class="[
        item.type === 'webapp' ? 'pill-tag--teal' : 'pill-tag--gold',
        { 'work-card-content__type--hidden': !item.type }
      ]"
    >{{ item.type === 'webapp' ? 'Web App' : item.type === 'website' ? 'Website' : ' ' }}</span>
    <h2 class="font-display work-card-content__title">
      <span v-if="item.icon" class="work-card-content__icon" aria-hidden="true">{{ item.icon }}</span>
      {{ item.title }}
    </h2>
    <p class="font-label work-card-content__description">{{ item.description }}</p>
    <span v-if="item.link" class="pill-tag pill-tag--coral tilt-right work-card-content__cta">Visit ↗</span>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<style lang="scss" scoped>
// Purely presentational — no navigation/click logic here on purpose. Each
// layout that uses this (plain grid, bento expand, film strip) wraps it
// differently (a real <a>, a clickable expand trigger, etc.), so click
// behavior belongs to whichever parent is arranging these, not to the
// card content itself.
.work-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  // Deliberately no align-items override here — default stretch is what
  // lets the title/description span the full width and wrap normally. The
  // two pill-tag badges opt out individually below (align-self), since
  // stretching a small pill to full width would look broken.
}

.work-card-content__type {
  align-self: flex-start;
  margin-bottom: 0.75rem;
}

// Always rendered (never v-if'd away) so its height + margin is reserved
// even when a card has no type (Project Switcher) — visibility hidden
// rather than removed from the DOM, so the space stays, only the pill
// itself disappears.
.work-card-content__type--hidden {
  visibility: hidden;
}

// min-height reserves 2 lines regardless of actual title length, so a
// title that wraps to 2 lines doesn't throw card height off against one
// that fits on 1.
.work-card-content__title {
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
// only sizing/spacing apply here.
.work-card-content__icon {
  flex: none;
  font-size: 1.8em;
  line-height: 1;
}

// Fixed at 5 lines' worth of height, sized off the longest current
// description (142 characters, Ideal Instruction) — see work.js. Keep
// future descriptions at or under that length or this may need to grow.
.work-card-content__description {
  min-height: calc(1.55em * 5);
  font-size: 0.9rem;
  line-height: 1.55;
  opacity: 0.8;
  margin: 0;
}

// margin-top: auto pins this to the bottom regardless of how much
// title/description content comes before it.
.work-card-content__cta {
  align-self: flex-start;
  margin-top: auto;
}
</style>
