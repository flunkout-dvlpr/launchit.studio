<template>
  <!-- Below 900px, or reduced motion: a plain stacked list, no wheel-
       jacking/2D panning at all — a touch device has no wheel events to
       drive this with, same reasoning the other two modes fall back to a
       plain layout at small sizes. -->
  <div v-if="$q.screen.width < 900 || prefersReducedMotion" class="work-zoom__fallback">
    <component
      :is="item.link ? 'a' : 'div'"
      v-for="item in work"
      :key="item.title"
      :href="item.link || undefined"
      :target="item.link ? '_blank' : undefined"
      :rel="item.link ? 'noopener' : undefined"
      class="work-zoom__fallback-card"
      @click="item.link && trackEvent('outbound_click', { label: item.title, url: item.link })"
    >
      <WorkCard :item="item" />
    </component>
  </div>

  <section v-else ref="sectionEl" class="work-zoom" @wheel="onWheel">
    <div class="work-zoom__hint font-label">Scroll any direction to explore — {{ focusedIndex + 1 }} / {{ work.length }}</div>

    <div ref="viewportEl" class="work-zoom__viewport">
      <div ref="stageEl" class="work-zoom__stage" :style="{ gridTemplateColumns: `repeat(${COLS}, ${CELL_W}px)`, gap: `${GAP}px` }">
        <component
          :is="item.link ? 'a' : 'div'"
          v-for="(item, i) in work"
          :key="item.title"
          :href="item.link || undefined"
          :target="item.link ? '_blank' : undefined"
          :rel="item.link ? 'noopener' : undefined"
          class="work-zoom__cell"
          :class="{ 'work-zoom__cell--focused': i === focusedIndex }"
          :style="{ width: `${CELL_W}px`, height: `${CELL_H}px` }"
          @click="onCardClick(item, i, $event)"
        >
          <WorkCard :item="item" />
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import WorkCard from 'components/WorkCard.vue'
import work from 'src/data/work.js'

const $q = useQuasar()
const prefersReducedMotion = usePrefersReducedMotion()
const sectionEl = ref(null)
const viewportEl = ref(null)
const stageEl = ref(null)

const COLS = 3
const ROWS = Math.ceil(work.length / COLS)
const CELL_W = 400
const CELL_H = 440
const GAP = 32
const WHEEL_LOCK_MS = 500

const focusedRow = ref(0)
const focusedCol = ref(0)
const focusedIndex = computed(() => focusedRow.value * COLS + focusedCol.value)

let wheelLocked = false

function maxColInRow(row) {
  return Math.min(COLS - 1, work.length - 1 - row * COLS)
}

// Moves focus by one cell in whichever direction, clamped to the grid's
// real bounds (including a possibly-partial last row) — returns whether
// focus actually changed, so the caller knows whether an edge was hit.
function moveFocus(dRow, dCol) {
  const newRow = gsap.utils.clamp(0, ROWS - 1, focusedRow.value + dRow)
  const newCol = Math.min(gsap.utils.clamp(0, COLS - 1, focusedCol.value + dCol), maxColInRow(newRow))
  if (newRow === focusedRow.value && newCol === focusedCol.value) return false
  focusedRow.value = newRow
  focusedCol.value = newCol
  animateToFocus()
  return true
}

function focusIndexDirect(i) {
  if (i === focusedIndex.value) return
  focusedRow.value = Math.floor(i / COLS)
  focusedCol.value = i % COLS
  animateToFocus()
}

function animateToFocus() {
  trackEvent('work_zoom_navigate', { index: focusedIndex.value })
  if (!viewportEl.value || !stageEl.value) return
  const x = viewportEl.value.clientWidth / 2 - (focusedCol.value * (CELL_W + GAP) + CELL_W / 2)
  const y = viewportEl.value.clientHeight / 2 - (focusedRow.value * (CELL_H + GAP) + CELL_H / 2)
  gsap.to(stageEl.value, { x, y, duration: 0.55, ease: 'power2.inOut' })
}

function lockWheel() {
  wheelLocked = true
  gsap.delayedCall(WHEEL_LOCK_MS / 1000, () => { wheelLocked = false })
}

function onWheel(e) {
  const absX = Math.abs(e.deltaX)
  const absY = Math.abs(e.deltaY)

  if (absX > absY) {
    // Horizontal input (trackpad shift-scroll / horizontal swipe) never
    // conflicts with the page's own vertical scroll, so it's always safe
    // to capture regardless of which column we're at.
    e.preventDefault()
    if (wheelLocked) return
    if (moveFocus(0, e.deltaX > 0 ? 1 : -1)) lockWheel()
    return
  }

  const dir = e.deltaY > 0 ? 1 : -1
  const atRowEdge = (dir === 1 && focusedRow.value >= ROWS - 1) || (dir === -1 && focusedRow.value <= 0)
  // At the top/bottom row already: don't capture the scroll at all, so it
  // falls through to normal page scroll past this section instead of
  // trapping the user here — matches "continue until the edge."
  if (atRowEdge) return

  e.preventDefault()
  if (wheelLocked) return
  if (moveFocus(dir, 0)) lockWheel()
}

function onKeydown(e) {
  const keys = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
  const delta = keys[e.key]
  if (!delta || wheelLocked) return
  e.preventDefault()
  if (moveFocus(...delta)) lockWheel()
}

function onCardClick(item, i, e) {
  // Clicking a peeking (non-focused) neighbor brings it into focus instead
  // of navigating — the click "arrives" at that card rather than leaving
  // the page, matching how clicking around a map recenters instead of
  // opening whatever's under the cursor.
  if (i !== focusedIndex.value) {
    e.preventDefault()
    focusIndexDirect(i)
    return
  }
  if (item.link) trackEvent('outbound_click', { label: item.title, url: item.link })
}

onMounted(() => {
  if ($q.screen.width < 900 || prefersReducedMotion.value) return
  window.addEventListener('keydown', onKeydown)
  // Settle the stage at cell (0,0) before any input, same centering math
  // as every subsequent move.
  animateToFocus()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
.work-zoom__fallback {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem 1rem;
}

.work-zoom__fallback-card {
  display: block;
  text-decoration: none;
  color: var(--navy);
  background: var(--paper);
  padding: 1.25rem;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 6px;
}

.work-zoom {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.work-zoom__hint {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  opacity: 0.5;
  z-index: 1;
  white-space: nowrap;
}

.work-zoom__viewport {
  position: absolute;
  inset: 0;
}

.work-zoom__stage {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
}

.work-zoom__cell {
  display: block;
  padding: 2rem;
  border: 1px solid rgba(62, 124, 166, 0.35);
  border-radius: 12px;
  text-decoration: none;
  color: var(--navy);
  background: var(--paper);
  cursor: pointer;
  opacity: 0.45;
  transform: scale(0.88);
  transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  // min-height/description font-size formulas are em-based (see
  // WorkCard.vue), so bumping title/description font-size here scales
  // both proportionally — same technique WorkFilmStrip uses to fill a
  // bigger card without hand-tuning every min-height separately.
  :deep(.work-card-content__title) {
    font-size: 1.4rem;
  }
  :deep(.work-card-content__description) {
    font-size: 1rem;
  }
}

.work-zoom__cell--focused {
  opacity: 1;
  transform: scale(1);
  border-color: var(--coral);
  cursor: default;
  box-shadow: 0 20px 50px rgba(20, 30, 45, 0.25);

  &:hover {
    opacity: 1;
  }
}
</style>
