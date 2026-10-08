<template>
  <section ref="root" class="work-gallery">
    <component
      :is="item.link ? 'a' : 'div'"
      v-for="item in work"
      :key="item.title"
      :href="item.link || undefined"
      :target="item.link ? '_blank' : undefined"
      :rel="item.link ? 'noopener' : undefined"
      class="work-gallery__card"
      @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
    >
      <img
        v-if="screenshots[item.title]"
        :src="screenshots[item.title]"
        :alt="`${item.title} landing page`"
        class="work-gallery__img"
        loading="lazy"
      />
      <!-- No live link (Project Switcher) or no captured screenshot yet —
           same icon-on-a-field treatment instead of a broken image. -->
      <div v-else class="work-gallery__img work-gallery__img--fallback" aria-hidden="true">
        <span class="work-gallery__fallback-icon">{{ item.icon }}</span>
      </div>

      <div class="work-gallery__scrim" />

      <div class="work-gallery__info">
        <span v-if="item.icon" class="work-gallery__icon" aria-hidden="true">{{ item.icon }}</span>
        <h2 class="font-display work-gallery__title">{{ item.title }}</h2>
        <p class="font-label work-gallery__desc">{{ item.description }}</p>
      </div>
    </component>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import work from 'src/data/work.js'

const prefersReducedMotion = usePrefersReducedMotion()
const root = ref(null)

// Same slug rule scripts/generate-gallery-screenshots.js uses to name its
// output files, so a title here always resolves to the file that script
// produced for it without a separately-maintained filename list.
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// { import: 'default' } isn't available on this project's Vite version
// (2.9) — eager glob results come back as full module namespace objects
// here, unwrapped by hand instead.
const screenshotFiles = import.meta.glob('../assets/gallery/*.webp', { eager: true })
const screenshots = {}
for (const item of work) {
  const match = screenshotFiles[`../assets/gallery/${slugify(item.title)}.webp`]
  if (match) screenshots[item.title] = match.default
}

onMounted(() => {
  if (prefersReducedMotion.value) return
  gsap.from(root.value.querySelectorAll('.work-gallery__card'), {
    y: 16,
    autoAlpha: 0,
    duration: 0.5,
    stagger: 0.04,
    ease: 'power2.out'
  })
})
</script>

<style lang="scss" scoped>
.work-gallery {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 5rem;
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

.work-gallery__card {
  position: relative;
  display: block;
  aspect-ratio: 900 / 633;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(62, 124, 166, 0.35);
  background: var(--navy);
  text-decoration: none;
  color: var(--paper);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--coral);
  }
}

.work-gallery__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.5s ease;
}

.work-gallery__img--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, var(--navy), #10192633);
}

.work-gallery__fallback-icon {
  font-size: 3rem;
}

// Smoked/shadow scrim, strongest at the bottom where the caption lives.
.work-gallery__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(14, 18, 24, 0.92) 0%,
    rgba(14, 18, 24, 0.55) 42%,
    rgba(14, 18, 24, 0) 75%
  );
  opacity: 0.85;
  transition: opacity 0.35s ease;
}

.work-gallery__info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.1rem 1.25rem;
  transform: translateY(0);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.work-gallery__icon {
  font-size: 1.3em;
  line-height: 1;
  margin-right: 0.4rem;
}

.work-gallery__title {
  display: inline;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.work-gallery__desc {
  font-size: 0.85rem;
  line-height: 1.5;
  opacity: 0.85;
  margin: 0.4rem 0 0;
}

// Touch/coarse pointers have no hover — caption and scrim stay visible by
// default (set above) instead of requiring an interaction that can't
// happen. Devices that actually support hover get the reveal-on-hover
// version instead, scrim and caption tucked away until the pointer's
// actually there.
@media (hover: hover) and (pointer: fine) {
  .work-gallery__scrim {
    opacity: 0;
  }
  .work-gallery__info {
    transform: translateY(100%);
  }
  .work-gallery__card:hover .work-gallery__scrim {
    opacity: 1;
  }
  .work-gallery__card:hover .work-gallery__info {
    transform: translateY(0);
  }
  .work-gallery__card:hover .work-gallery__img {
    transform: scale(1.04);
  }
}
</style>
