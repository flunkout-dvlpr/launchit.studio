<template>
  <svg
    ref="root"
    class="fw-icon"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 1. Source: community dots gather to form a lightbulb, which lights up -->
    <g v-if="type === 'source'">
      <circle class="glow glow-outer" cx="50" cy="44" r="21" fill="var(--gold)" opacity="0" />
      <circle class="glow glow-inner" cx="50" cy="44" r="18" fill="var(--gold)" opacity="0" />
      <path class="bulb-glass" d="M50,25 C61,25 70,34 70,45 C70,53 65,58 61,62 L39,62 C35,58 30,53 30,45 C30,34 39,25 50,25 Z"
        stroke="var(--navy)" stroke-width="2.5" fill="none" />
      <path class="filament" d="M44,42 L48,50 L52,42 L56,50" stroke="var(--navy)" stroke-width="1.5" fill="none" opacity="0" />
      <rect class="base" x="42" y="62" width="16" height="9" rx="1.5" stroke="var(--navy)" stroke-width="2.5" fill="none" />
      <circle class="src-dot" cx="10" cy="22" r="4" fill="var(--coral)" />
      <circle class="src-dot" cx="90" cy="16" r="4" fill="var(--gold)" />
      <circle class="src-dot" cx="88" cy="84" r="4" fill="var(--teal)" />
      <circle class="src-dot" cx="14" cy="80" r="4" fill="var(--coral)" />
      <circle class="src-dot" cx="50" cy="6" r="4" fill="var(--gold)" />
      <circle class="src-dot" cx="50" cy="94" r="4" fill="var(--teal)" />
    </g>

    <!-- 2. Vet: three filter levels, one per criterion — 5 ideas narrow to
         3, then to 1. Blocked dots stay resting in place (present, not gone). -->
    <g v-else-if="type === 'vet'">
      <line x1="35" y1="4" x2="35" y2="96" stroke="var(--gridline)" stroke-width="1" opacity="0.15" />
      <line x1="65" y1="4" x2="65" y2="96" stroke="var(--gridline)" stroke-width="1" opacity="0.15" />
      <line class="filter-line" x1="6" y1="28" x2="40" y2="28" stroke="var(--navy)" stroke-width="2.5" />
      <line class="filter-line" x1="60" y1="28" x2="94" y2="28" stroke="var(--navy)" stroke-width="2.5" />
      <line class="filter-line" x1="6" y1="50" x2="40" y2="50" stroke="var(--navy)" stroke-width="2.5" />
      <line class="filter-line" x1="60" y1="50" x2="94" y2="50" stroke="var(--navy)" stroke-width="2.5" />
      <line class="filter-line" x1="6" y1="72" x2="40" y2="72" stroke="var(--navy)" stroke-width="2.5" />
      <line class="filter-line" x1="60" y1="72" x2="94" y2="72" stroke="var(--navy)" stroke-width="2.5" />
      <circle class="vet-dot" cx="15" cy="6" r="4" fill="var(--gridline)" />
      <circle class="vet-dot" cx="32" cy="6" r="4" fill="var(--gridline)" />
      <circle class="vet-dot" cx="50" cy="6" r="4" fill="var(--gridline)" />
      <circle class="vet-dot" cx="68" cy="6" r="4" fill="var(--gridline)" />
      <circle class="vet-dot" cx="85" cy="6" r="4" fill="var(--gridline)" />
    </g>

    <!-- 3. Select: vetted candidates sit as a cluster; vote ticks accumulate
         on each, one pulling ahead and brightening -->
    <g v-else-if="type === 'select'">
      <circle class="sel-dot" cx="30" cy="52" r="6" fill="var(--gridline)" />
      <circle class="sel-dot" cx="50" cy="52" r="6" fill="var(--gridline)" />
      <circle class="sel-dot" cx="70" cy="52" r="6" fill="var(--gridline)" />

      <circle class="sel-tick" data-idx="0" data-slot="0" cx="30" cy="42" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="0" data-slot="1" cx="30" cy="35" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="0" data-slot="2" cx="30" cy="28" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="0" data-slot="3" cx="30" cy="21" r="2" fill="var(--coral)" />

      <circle class="sel-tick" data-idx="1" data-slot="0" cx="50" cy="42" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="1" data-slot="1" cx="50" cy="35" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="1" data-slot="2" cx="50" cy="28" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="1" data-slot="3" cx="50" cy="21" r="2" fill="var(--coral)" />

      <circle class="sel-tick" data-idx="2" data-slot="0" cx="70" cy="42" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="2" data-slot="1" cx="70" cy="35" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="2" data-slot="2" cx="70" cy="28" r="2" fill="var(--coral)" />
      <circle class="sel-tick" data-idx="2" data-slot="3" cx="70" cy="21" r="2" fill="var(--coral)" />
    </g>

    <!-- 4. Scope: a camera aperture — the opening scales down from nearly
         filling the ring (vague) to a small opening of the same shape
         (exact), never fully closing to a point -->
    <g v-else-if="type === 'scope'">
      <g transform="translate(50,50)">
        <circle r="48" fill="var(--navy)" />
        <!-- blade seams: fixed at the ring (angle-offset from the matching
             vertex so they slant like real iris vanes, not pizza-slice
             radials), inner end tracks the opening as it shrinks (updated
             per-frame alongside the scale tween) -->
        <line class="scope-blade" x1="45.11" y1="16.42" x2="40" y2="0" stroke="var(--gridline)" stroke-width="1.5" />
        <line class="scope-blade" x1="15.29" y1="45.50" x2="24.94" y2="31.27" stroke="var(--gridline)" stroke-width="1.5" />
        <line class="scope-blade" x1="-26.04" y1="40.32" x2="-8.9" y2="38.99" stroke="var(--gridline)" stroke-width="1.5" />
        <line class="scope-blade" x1="-47.76" y1="4.78" x2="-36.04" y2="17.36" stroke="var(--gridline)" stroke-width="1.5" />
        <line class="scope-blade" x1="-33.51" y1="-34.36" x2="-36.04" y2="-17.36" stroke="var(--gridline)" stroke-width="1.5" />
        <line class="scope-blade" x1="5.97" y1="-47.63" x2="-8.9" y2="-38.99" stroke="var(--gridline)" stroke-width="1.5" />
        <line class="scope-blade" x1="40.96" y1="-25.03" x2="24.94" y2="-31.27" stroke="var(--gridline)" stroke-width="1.5" />
        <polygon class="scope-iris" points="40,0 24.94,31.27 -8.9,38.99 -36.04,17.36 -36.04,-17.36 -8.9,-38.99 24.94,-31.27" fill="var(--paper)" />
        <circle r="48" fill="none" stroke="var(--navy)" stroke-width="1.5" />
      </g>
    </g>

    <!-- 5. Build: brick-coursed rows assemble bottom-to-top, each row offset
         from the one below (running-bond pattern), until a small solid
         structure stands -->
    <g v-else-if="type === 'build'">
      <rect class="build-brick" data-row="1" x="20" y="62" width="20" height="18" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick" data-row="1" x="40" y="62" width="20" height="18" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick" data-row="1" x="60" y="62" width="20" height="18" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick" data-row="2" x="20" y="43" width="10" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick" data-row="2" x="30" y="43" width="20" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick" data-row="2" x="50" y="43" width="20" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick" data-row="2" x="70" y="43" width="10" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick build-brick--top" data-row="3" x="20" y="24" width="20" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick build-brick--top" data-row="3" x="40" y="24" width="20" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
      <rect class="build-brick build-brick--top" data-row="3" x="60" y="24" width="20" height="19" stroke="var(--navy)" stroke-width="2" fill="transparent" />
    </g>

    <!-- 6. Prep artifact: a page fills with paragraph-line strokes, closing
         with two checkbox ticks ("try it yourself") -->
    <g v-else-if="type === 'prep'">
      <rect class="prep-page" x="25" y="10" width="50" height="70" rx="2" stroke="var(--navy)" stroke-width="2.5" fill="none" />
      <line class="prep-line" x1="33" y1="22" x2="67" y2="22" stroke="var(--navy)" stroke-width="2" />
      <line class="prep-line" x1="33" y1="30" x2="67" y2="30" stroke="var(--navy)" stroke-width="2" />
      <line class="prep-line" x1="33" y1="38" x2="58" y2="38" stroke="var(--navy)" stroke-width="2" />
      <line class="prep-line" x1="33" y1="48" x2="67" y2="48" stroke="var(--navy)" stroke-width="2" />
      <line class="prep-line" x1="33" y1="56" x2="62" y2="56" stroke="var(--navy)" stroke-width="2" />
      <rect class="prep-checkbox" x="35" y="64" width="7" height="7" stroke="var(--navy)" stroke-width="1.5" fill="none" />
      <rect class="prep-checkbox" x="48" y="64" width="7" height="7" stroke="var(--navy)" stroke-width="1.5" fill="none" />
      <path class="prep-check" d="M36,67.5 L38,69.5 L41,65.5" stroke="var(--coral)" stroke-width="1.5" fill="none" />
      <path class="prep-check" d="M49,67.5 L51,69.5 L54,65.5" stroke="var(--coral)" stroke-width="1.5" fill="none" />
    </g>

    <!-- 7. Event: the community dots from Source/Select reorient to face a
         raised screen, which lights up as they settle -->
    <g v-else-if="type === 'event'">
      <circle class="pulse pulse-1" cx="50" cy="26" r="22" stroke="var(--gold)" stroke-width="2" fill="none" />
      <circle class="pulse pulse-2" cx="50" cy="26" r="22" stroke="var(--gold)" stroke-width="2" fill="none" />
      <rect class="event-screen" x="32" y="14" width="36" height="24" rx="1" stroke="var(--navy)" stroke-width="2.5" fill="transparent" />
      <line x1="50" y1="38" x2="50" y2="48" stroke="var(--navy)" stroke-width="2" />
      <line x1="42" y1="48" x2="58" y2="48" stroke="var(--navy)" stroke-width="2" />
      <circle class="event-dot" cx="15" cy="60" r="4" fill="var(--navy)" />
      <circle class="event-dot" cx="30" cy="80" r="4" fill="var(--navy)" />
      <circle class="event-dot" cx="55" cy="85" r="4" fill="var(--navy)" />
      <circle class="event-dot" cx="75" cy="78" r="4" fill="var(--navy)" />
      <circle class="event-dot" cx="85" cy="55" r="4" fill="var(--navy)" />
    </g>

    <!-- 8. Recap: a folder drops into the pulled-out drawer of a real
         file cabinet — the event, archived. "Feeds next cycle" lives in
         the caption text, not this animation. -->
    <g v-else-if="type === 'recap'">
      <!-- cabinet body: two closed drawers stacked -->
      <rect class="recap-cabinet-drawer" x="24" y="8" width="52" height="15" rx="1" stroke="var(--navy)" stroke-width="2" fill="none" />
      <rect x="42" y="14" width="16" height="3" rx="1.5" fill="var(--navy)" />
      <rect class="recap-cabinet-drawer" x="24" y="25" width="52" height="15" rx="1" stroke="var(--navy)" stroke-width="2" fill="none" />
      <rect x="42" y="31" width="16" height="3" rx="1.5" fill="var(--navy)" />
      <!-- open drawer, pulled forward (wider), folder drops in -->
      <rect class="recap-opening" x="20" y="44" width="60" height="20" stroke="var(--navy)" stroke-width="2" fill="var(--gridline)" opacity="0.15" />
      <g class="recap-folder-group">
        <path class="recap-folder" d="M36,47 L46,47 L49,50 L72,50 L72,62 L36,62 Z" stroke="var(--navy)" stroke-width="2" fill="var(--coral)" />
      </g>
      <rect class="recap-front" x="16" y="66" width="68" height="12" rx="1" stroke="var(--navy)" stroke-width="2" fill="none" />
      <rect class="recap-front-handle" x="42" y="70" width="16" height="3" rx="1.5" fill="var(--navy)" />
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'

const props = defineProps({
  type: { type: String, required: true },
  size: { type: [Number, String], default: 72 }
})

const prefersReducedMotion = usePrefersReducedMotion()

const root = ref(null)

let tl
let pulseLoops = []

function q (sel) {
  return root.value.querySelector(sel)
}
function qa (sel) {
  return Array.from(root.value.querySelectorAll(sel))
}

function buildTimeline () {
  const t = gsap.timeline({ paused: true })

  if (props.type === 'source') {
    const dots = qa('.src-dot')
    const glass = q('.bulb-glass')
    const filament = q('.filament')
    const base = q('.base')
    const glows = qa('.glow')
    const stagger = 0.15
    const travelDuration = 0.5
    // Six points ringing the bulb glass — each dot travels to and merges
    // into one of them, so the dots visibly gather to form the bulb rather
    // than just converging on a plain dot.
    const targets = [
      [50, 24], [67.3, 34], [67.3, 54],
      [50, 64], [32.7, 54], [32.7, 34]
    ]

    gsap.set(dots, { scale: 1, opacity: 1, transformOrigin: '50% 50%' })
    gsap.set(glass, { opacity: 0.4, fill: 'transparent' })
    gsap.set(base, { opacity: 0.4, fill: 'transparent' })
    gsap.set(filament, { opacity: 0 })
    gsap.set(glows, { opacity: 0, scale: 1, transformOrigin: '50% 50%' })

    dots.forEach((dot, i) => {
      const [cx, cy] = targets[i]
      t.to(dot, {
        attr: { cx, cy },
        scale: 0.3,
        opacity: 0,
        duration: travelDuration,
        ease: 'power2.in'
      }, i * stagger)
    })

    const arrival = (dots.length - 1) * stagger + travelDuration
    t.to([glass, base], { opacity: 1, duration: 0.3, ease: 'power2.out' }, arrival - 0.1)
      .to(glass, { fill: 'var(--gold)', duration: 0.3 }, '<')
      .to(base, { fill: 'var(--navy)', duration: 0.3 }, '<')
      .to(glows, { opacity: 0.9, scale: 1.05, duration: 0.35, ease: 'power2.out' }, '<')
      .to(glows, { opacity: (i) => (i === 0 ? 0.15 : 0.3), scale: 1, duration: 0.4 }, '-=0.15')
      .to(filament, { opacity: 1, duration: 0.25 }, '-=0.2')
  } else if (props.type === 'vet') {
    const dots = qa('.vet-dot')
    const filterLines = qa('.filter-line')
    const levelY = [28, 50, 72]
    const startY = 6
    const finalY = 90
    const gapX = 50

    // Level each dot gets blocked at (1-indexed, matches levelY); 4 means it
    // clears all three and becomes the winner. Randomized fresh each play —
    // two dots stop at level 1, two more at level 2, one clears all three:
    // 5 -> 3 -> 1.
    const order = [0, 1, 2, 3, 4]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const stopLevel = []
    stopLevel[order[0]] = 4
    stopLevel[order[1]] = 1
    stopLevel[order[2]] = 1
    stopLevel[order[3]] = 2
    stopLevel[order[4]] = 2

    const startX = [15, 32, 50, 68, 85]
    const gapMin = 40
    const gapMax = 60
    // A dot can only rest where it lands if that x isn't inside the gap —
    // only the winner is meant to ever be at gapX. The one spawn position
    // that sits exactly on the gap center gets nudged onto solid ground
    // the moment it's blocked there (rare: only when it's not the winner).
    const safeRestX = (x) => (x > gapMin && x < gapMax ? (x <= gapX ? gapMin - 6 : gapMax + 6) : x)

    dots.forEach((dot, i) => {
      gsap.set(dot, { attr: { cx: startX[i], cy: startY }, scale: 1, fill: 'var(--gridline)', transformOrigin: '50% 50%' })
    })
    gsap.set(filterLines, { drawSVG: '0%' })

    t.to(filterLines, { drawSVG: '100%', duration: 0.4, ease: 'power1.inOut', stagger: 0.1 })

    let phaseStart = 0.5
    for (let level = 1; level <= 3; level++) {
      const lineY = levelY[level - 1]
      dots.forEach((dot, i) => {
        const dotStop = stopLevel[i]
        if (dotStop < level) return // already resting from an earlier level

        const isWinner = dotStop === 4
        const blocked = dotStop === level
        const targetY = blocked ? lineY - 4 : (level < 3 ? lineY + 12 : finalY)
        const delay = phaseStart + i * 0.05

        // Only the winner recenters into the gap, since it's the only one
        // that actually needs to visibly thread every level. Everyone else
        // either keeps falling at its own x, or — if blocked — snaps onto
        // solid ground rather than resting wherever it happened to drift.
        const targetX = isWinner ? gapX : (blocked ? safeRestX(startX[i]) : startX[i])

        t.to(dot, {
          attr: { cx: targetX, cy: targetY },
          duration: blocked ? 0.5 : 0.4,
          ease: blocked ? 'bounce.out' : 'power2.in'
        }, delay)

        if (isWinner && level === 3) {
          t.to(dot, { fill: 'var(--coral)', scale: 1.3, duration: 0.2 }, delay + 0.5)
            .to(dot, { scale: 1, duration: 0.15 })
        }
      })
      phaseStart += 0.65
    }
  } else if (props.type === 'select') {
    const mainDots = qa('.sel-dot')
    const allTicks = qa('.sel-tick')

    gsap.set(mainDots, { scale: 1, fill: 'var(--gridline)', transformOrigin: '50% 50%' })
    gsap.set(allTicks, { scale: 0, opacity: 0, transformOrigin: '50% 50%' })

    // Randomize vote counts each play — one winner (4 votes), the other
    // two split 1 and 2, so it isn't always the same candidate that wins.
    const counts = [1, 2, 4]
    for (let i = counts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[counts[i], counts[j]] = [counts[j], counts[i]]
    }
    const winnerIdx = counts.indexOf(4)

    // Interleave the vote-arrival order across the three candidates so it
    // reads as votes coming in over time, not each candidate tallied in turn.
    const events = []
    for (let round = 0; round < 4; round++) {
      for (let idx = 0; idx < 3; idx++) {
        if (round < counts[idx]) events.push(idx)
      }
    }

    const slotCounter = [0, 0, 0]
    events.forEach((idx, i) => {
      const slot = slotCounter[idx]++
      const tick = allTicks.find((el) => el.dataset.idx === String(idx) && el.dataset.slot === String(slot))
      const time = 0.3 + i * 0.18

      t.to(tick, { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2.5)' }, time)

      if (idx === winnerIdx) {
        t.to(mainDots[idx], { scale: 1 + slotCounter[idx] * 0.08, duration: 0.2 }, time)
      }
    })

    const totalTime = 0.3 + events.length * 0.18
    t.to(mainDots[winnerIdx], { fill: 'var(--coral)', scale: 1.5, duration: 0.3, ease: 'back.out(2.5)' }, totalTime)
      .to(mainDots[winnerIdx], { scale: 1.3, duration: 0.15 })
  } else if (props.type === 'scope') {
    // Camera aperture: one heptagon scaling down, never fully closing.
    const iris = q('.scope-iris')
    const blades = qa('.scope-blade')
    const vertices = [
      [40, 0], [24.94, 31.27], [-8.9, 38.99], [-36.04, 17.36],
      [-36.04, -17.36], [-8.9, -38.99], [24.94, -31.27]
    ]

    gsap.set(iris, { scale: 1, transformOrigin: 'center center' })
    blades.forEach((blade, i) => gsap.set(blade, { attr: { x2: vertices[i][0], y2: vertices[i][1] } }))

    const proxy = { scale: 1 }
    t.to(proxy, {
      scale: 0.25,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        blades.forEach((blade, i) => {
          blade.setAttribute('x2', vertices[i][0] * proxy.scale)
          blade.setAttribute('y2', vertices[i][1] * proxy.scale)
        })
      }
    }, 0.2)
      .to(iris, { scale: 0.25, duration: 2, ease: 'power2.inOut' }, '<')
  } else if (props.type === 'build') {
    const row1 = qa('.build-brick[data-row="1"]')
    const row2 = qa('.build-brick[data-row="2"]')
    const row3 = qa('.build-brick[data-row="3"]')
    const allBricks = [...row1, ...row2, ...row3]

    gsap.set(allBricks, { scale: 0, fill: 'transparent', transformOrigin: '50% 100%' })

    t.to(row1, { scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(2)' }, 0.2)
      .to(row2, { scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(2)' }, '+=0.1')
      .to(row3, { scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(2)' }, '+=0.1')
      // whole structure fills in together — one completion moment.
      .to(allBricks, { fill: 'var(--coral)', duration: 0.35, ease: 'power2.out' }, '+=0.05')
  } else if (props.type === 'prep') {
    const page = q('.prep-page')
    const lines = qa('.prep-line')
    const boxes = qa('.prep-checkbox')
    const checks = qa('.prep-check')

    gsap.set(page, { drawSVG: '0%' })
    gsap.set(lines, { drawSVG: '0%' })
    gsap.set(boxes, { drawSVG: '0%' })
    gsap.set(checks, { drawSVG: '0%' })

    t.to(page, { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' })
      .to(lines, { drawSVG: '100%', duration: 0.3, stagger: 0.12, ease: 'power1.out' })
      .to(boxes, { drawSVG: '100%', duration: 0.25, stagger: 0.1, ease: 'power1.out' })
      .to(checks, { drawSVG: '100%', duration: 0.2, stagger: 0.12, ease: 'power2.out' }, '-=0.05')
  } else if (props.type === 'event') {
    const screen = q('.event-screen')
    const dots = qa('.event-dot')
    const startPositions = [[15, 60], [30, 80], [55, 85], [75, 78], [85, 55]]
    const targetPositions = [[26, 68], [38, 72], [50, 74], [62, 72], [74, 68]]

    gsap.set(screen, { drawSVG: '0%', fill: 'transparent' })
    dots.forEach((dot, i) => gsap.set(dot, { attr: { cx: startPositions[i][0], cy: startPositions[i][1] } }))

    t.to(screen, { drawSVG: '100%', duration: 0.45, ease: 'power1.inOut' }, 0.1)

    dots.forEach((dot, i) => {
      t.to(dot, {
        attr: { cx: targetPositions[i][0], cy: targetPositions[i][1] },
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0.4 + i * 0.06)
    })

    t.to(screen, { fill: 'var(--gold)', duration: 0.35, ease: 'power2.out' }, '+=0.1')
  } else if (props.type === 'recap') {
    const cabinetDrawers = qa('.recap-cabinet-drawer')
    const opening = q('.recap-opening')
    const front = q('.recap-front')
    const frontHandle = q('.recap-front-handle')
    const folderGroup = q('.recap-folder-group')

    gsap.set(cabinetDrawers, { scale: 0, transformOrigin: '50% 50%' })
    gsap.set(opening, { opacity: 0 })
    gsap.set([front, frontHandle], { opacity: 0 })
    gsap.set(folderGroup, { y: -38 })

    // the cabinet exists first, then this drawer gets pulled open, then
    // the folder goes in.
    t.to(cabinetDrawers, { scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' }, 0.1)
      .to(opening, { opacity: 0.15, duration: 0.25, ease: 'power1.out' }, '+=0.05')
      .to([front, frontHandle], { opacity: 1, duration: 0.25, ease: 'power1.out' }, '<')
      .to(folderGroup, { y: 0, duration: 0.6, ease: 'power2.in' }, '+=0.1')
      .to(folderGroup, { y: -3, duration: 0.12, ease: 'power1.out' })
      .to(folderGroup, { y: 0, duration: 0.18, ease: 'power1.in' })
  }

  return t
}

function startPulseLoops () {
  if (props.type !== 'event') return
  const rings = qa('.pulse')

  // Reduced motion: a single static ring reads as "a signal" without
  // the continuous scale/fade loop.
  if (prefersReducedMotion.value) {
    gsap.set(rings, { transformOrigin: '50% 50%', scale: 1.6, opacity: 0.35 })
    return
  }

  rings.forEach((ring, i) => {
    gsap.set(ring, { transformOrigin: '50% 50%', scale: 1, opacity: 0.9 })
    pulseLoops.push(
      gsap.to(ring, {
        scale: 2.4,
        opacity: 0,
        duration: 1.6,
        ease: 'power1.out',
        repeat: -1,
        delay: i * 0.8
      })
    )
  })
}

onMounted(() => {
  tl = buildTimeline()
  if (prefersReducedMotion.value) {
    tl.progress(1)
  }
  startPulseLoops()
})

onBeforeUnmount(() => {
  tl && tl.kill()
  pulseLoops.forEach((p) => p.kill())
})

defineExpose({
  play: () => {
    if (prefersReducedMotion.value) return
    // Rebuilt rather than restarted so types with per-play randomness
    // (Vet's winner) actually vary on replay instead of repeating the
    // same outcome every time.
    tl && tl.kill()
    tl = buildTimeline()
    tl.play()
  }
})
</script>

<style lang="scss" scoped>
.fw-icon {
  overflow: visible;
  display: block;
}
</style>
