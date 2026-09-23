<template>
  <!-- Reduced motion only: a plain stacked list, no panning at all. Real
       devices (including touch) get the interactive version below now —
       drag/swipe drives it there instead of wheel. -->
  <div v-if="prefersReducedMotion" class="work-zoom__fallback">
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

  <section
    v-else
    ref="sectionEl"
    class="work-zoom"
    @wheel="onWheel"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="work-zoom__hint font-label">Drag or scroll to explore — {{ focusedIndex + 1 }} / {{ work.length }}</div>

    <div ref="viewportEl" class="work-zoom__viewport">
      <div
        ref="stageEl"
        class="work-zoom__stage"
        :style="{ gridTemplateColumns: `repeat(${COLS}, ${cellSize.w}px)`, gap: `${cellSize.gap}px` }"
      >
        <component
          :is="item.link ? 'a' : 'div'"
          v-for="(item, i) in work"
          :key="item.title"
          :href="item.link || undefined"
          :target="item.link ? '_blank' : undefined"
          :rel="item.link ? 'noopener' : undefined"
          class="work-zoom__cell"
          :class="{ 'work-zoom__cell--focused': i === focusedIndex }"
          :style="{ width: `${cellSize.w}px`, height: `${cellSize.h}px` }"
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
const LOCK_MS = 500
const SWIPE_THRESHOLD = 50
const EDGE_RESISTANCE = 0.35

// Logical grid shape (COLS) stays fixed across devices so neighbor
// relationships never reshuffle — only the pixel size of each cell scales
// down for narrower viewports, via $q.screen (already reactive).
const cellSize = computed(() => {
  const vw = $q.screen.width
  if (vw < 480) return { w: Math.min(vw - 64, 300), h: 360, gap: 16 }
  if (vw < 900) return { w: 340, h: 400, gap: 22 }
  return { w: 400, h: 440, gap: 32 }
})

const focusedRow = ref(0)
// Starts on the center column of the first row (COLS is 3, so index 1)
// rather than the top-left corner — reads as "here's the middle of the
// row, pan either way" instead of implying the grid only goes rightward.
const focusedCol = ref(Math.min(1, maxColInRow(0)))
const focusedIndex = computed(() => focusedRow.value * COLS + focusedCol.value)

let inputLocked = false

function maxColInRow(row) {
  return Math.min(COLS - 1, work.length - 1 - row * COLS)
}

function isAtRowEdge(dir) {
  return (dir === 1 && focusedRow.value >= ROWS - 1) || (dir === -1 && focusedRow.value <= 0)
}

function isAtColEdge(dir) {
  return (dir === 1 && focusedCol.value >= maxColInRow(focusedRow.value)) || (dir === -1 && focusedCol.value <= 0)
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
  const { w, h, gap } = cellSize.value
  const x = viewportEl.value.clientWidth / 2 - (focusedCol.value * (w + gap) + w / 2)
  const y = viewportEl.value.clientHeight / 2 - (focusedRow.value * (h + gap) + h / 2)
  gsap.to(stageEl.value, { x, y, duration: 0.55, ease: 'power2.inOut' })
}

function lockInput() {
  inputLocked = true
  gsap.delayedCall(LOCK_MS / 1000, () => { inputLocked = false })
}

function onWheel(e) {
  const absX = Math.abs(e.deltaX)
  const absY = Math.abs(e.deltaY)

  if (absX > absY) {
    // Horizontal input (trackpad shift-scroll) never conflicts with the
    // page's own vertical scroll, so it's always safe to capture.
    e.preventDefault()
    if (inputLocked) return
    if (moveFocus(0, e.deltaX > 0 ? 1 : -1)) lockInput()
    return
  }

  const dir = e.deltaY > 0 ? 1 : -1
  // At the top/bottom row already: don't capture the scroll at all, so it
  // falls through to normal page scroll past this section instead of
  // trapping the user here — matches "continue until the edge."
  if (isAtRowEdge(dir)) return

  e.preventDefault()
  if (inputLocked) return
  if (moveFocus(dir, 0)) lockInput()
}

function onKeydown(e) {
  const keys = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
  const delta = keys[e.key]
  if (!delta || inputLocked) return
  e.preventDefault()
  if (moveFocus(...delta)) lockInput()
}

// Touch: same edge-release idea as wheel, but decided per-gesture instead
// of per-event, since preventDefault only reliably blocks native scroll
// when called from the first touchmove of a gesture, not partway through
// one the browser has already committed to. Horizontal drag is always
// captured (never conflicts with page scroll) and live-follows the
// finger 1:1; vertical drag does the same but only once we've confirmed
// it isn't at a row edge, otherwise the gesture is left alone entirely so
// native page scroll handles it.
let dragAxis = null // 'x' | 'y' | null
let dragBlocked = false
let dragStartX = 0
let dragStartY = 0
let dragBaseX = 0
let dragBaseY = 0

function onTouchStart(e) {
  const t = e.touches[0]
  dragStartX = t.clientX
  dragStartY = t.clientY
  dragAxis = null
  dragBlocked = false
  gsap.killTweensOf(stageEl.value)
  dragBaseX = gsap.getProperty(stageEl.value, 'x')
  dragBaseY = gsap.getProperty(stageEl.value, 'y')
}

function onTouchMove(e) {
  const t = e.touches[0]
  const dx = t.clientX - dragStartX
  const dy = t.clientY - dragStartY

  if (!dragAxis) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    dragAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    if (dragAxis === 'y') dragBlocked = isAtRowEdge(dy < 0 ? 1 : -1)
  }
  if (dragAxis === 'y' && dragBlocked) return // let native scroll handle it

  e.preventDefault()
  if (dragAxis === 'x') {
    const dir = dx < 0 ? 1 : -1
    const effectiveDx = isAtColEdge(dir) ? dx * EDGE_RESISTANCE : dx
    gsap.set(stageEl.value, { x: dragBaseX + effectiveDx })
  } else {
    gsap.set(stageEl.value, { y: dragBaseY + dy })
  }
}

function onTouchEnd(e) {
  if (!dragAxis || (dragAxis === 'y' && dragBlocked)) return
  const t = e.changedTouches[0]
  const delta = dragAxis === 'x' ? t.clientX - dragStartX : t.clientY - dragStartY

  if (Math.abs(delta) > SWIPE_THRESHOLD) {
    // Dragging up/left reveals what's below/to the right, same convention
    // as wheel's deltaY/deltaX sign.
    const dir = delta < 0 ? 1 : -1
    const moved = dragAxis === 'x' ? moveFocus(0, dir) : moveFocus(dir, 0)
    if (moved) { lockInput(); return }
  }
  animateToFocus() // snap back — either an edge or too small a drag to count
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
  if (prefersReducedMotion.value) return
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
  // Deliberately NOT touch-action: none/pan-y — either would force the
  // browser to decide (block or always-scroll) before JS ever runs. The
  // default lets our non-passive @touchmove call preventDefault() (or
  // not) per-gesture instead, which is what makes the vertical
  // capture-except-at-an-edge behavior possible at all.
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
  text-align: center;
  padding: 0 1rem;
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

@media (max-width: 480px) {
  .work-zoom__cell {
    padding: 1.25rem;

    :deep(.work-card-content__title) {
      font-size: 1.1rem;
    }
    :deep(.work-card-content__description) {
      font-size: 0.9rem;
    }
  }
}
</style>
