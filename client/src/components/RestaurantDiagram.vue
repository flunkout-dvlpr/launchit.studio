<template>
  <svg ref="svgRoot" viewBox="0 0 860 540" xmlns="http://www.w3.org/2000/svg" class="restaurant-diagram" role="img" aria-label="A restaurant floor plan: a request travels from the dining room (frontend), through the pass (API) where the waiter carries it, into the kitchen (backend), down to the pantry (database), and back out again.">
    <defs>
      <marker id="rd-arrow-request" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)" />
      </marker>
      <marker id="rd-arrow-response" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 Z" fill="var(--gridline)" />
      </marker>
    </defs>

    <!-- Hanging welcome sign, replaces a dry ruler annotation -->
    <g ref="signRef">
      <line x1="330" y1="0" x2="330" y2="14" stroke="var(--navy)" stroke-width="1.5" opacity="0.4" />
      <line x1="530" y1="0" x2="530" y2="14" stroke="var(--navy)" stroke-width="1.5" opacity="0.4" />
      <rect x="300" y="14" width="260" height="30" rx="6" fill="var(--gold)" />
      <text x="430" y="34" text-anchor="middle" class="rd-sign-text">HERE'S HOW WE COOK</text>
    </g>

    <!-- Dining Room -->
    <g ref="diningRef">
      <rect x="40" y="60" width="280" height="440" rx="16" fill="rgba(239,159,39,0.09)" stroke="var(--navy)" stroke-width="2.5" />
      <!-- floor plank texture -->
      <g stroke="var(--navy)" stroke-width="1" opacity="0.08">
        <line x1="40" y1="140" x2="320" y2="140" />
        <line x1="40" y1="220" x2="320" y2="220" />
        <line x1="40" y1="380" x2="320" y2="380" />
        <line x1="40" y1="460" x2="320" y2="460" />
      </g>
      <circle cx="66" cy="86" r="14" fill="var(--navy)" />
      <text x="66" y="91" text-anchor="middle" class="rd-room-number">1</text>
      <text x="90" y="83" class="rd-room-label">DINING ROOM</text>
      <text x="90" y="100" class="rd-room-sub">the frontend</text>

      <!-- potted plant, corner charm -->
      <g transform="translate(72,455)">
        <path d="M-10,10 L10,10 L7,-2 L-7,-2 Z" fill="var(--navy)" opacity="0.55" />
        <circle cx="0" cy="-8" r="6" fill="var(--teal)" />
        <circle cx="-7" cy="-3" r="5" fill="var(--teal)" opacity="0.85" />
        <circle cx="7" cy="-4" r="5" fill="var(--teal)" opacity="0.85" />
      </g>

      <!-- table with chairs -->
      <circle cx="185" cy="244" r="9" fill="var(--navy)" opacity="0.18" />
      <circle cx="185" cy="356" r="9" fill="var(--navy)" opacity="0.18" />
      <circle cx="141" cy="300" r="9" fill="var(--navy)" opacity="0.18" />
      <circle cx="229" cy="300" r="9" fill="var(--navy)" opacity="0.18" />
      <circle cx="185" cy="300" r="40" fill="none" stroke="var(--coral)" stroke-width="1" opacity="0.35" />
      <circle cx="185" cy="300" r="34" fill="var(--paper)" stroke="var(--coral)" stroke-width="2" />
      <text x="185" y="297" text-anchor="middle" class="rd-table-label">YOU</text>
      <text x="185" y="311" text-anchor="middle" class="rd-table-sub">the browser</text>

      <!-- Where the waiter actually sets the plate down — not attached to
           any character, it stays on the table after the waiter's own
           carried-plate prop hides, then fades away as part of the reset
           at the end of a cycle (see runServiceLoop). -->
      <g ref="tablePlateRef">
        <circle cx="160" cy="278" r="10" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
        <circle cx="160" cy="278" r="7.5" fill="none" stroke="var(--navy)" stroke-width="0.5" opacity="0.25" />
        <ellipse cx="158" cy="276" rx="4" ry="3" fill="var(--coral)" opacity="0.85" transform="rotate(-15 158 276)" />
        <circle cx="164" cy="276.5" r="1.6" fill="var(--teal)" opacity="0.85" />
        <circle cx="163" cy="280.5" r="1.3" fill="var(--teal)" opacity="0.75" />
        <circle cx="157" cy="281" r="1.4" fill="var(--gold)" opacity="0.85" />
      </g>
    </g>

    <!-- The Pass -->
    <g ref="passRef">
      <rect x="320" y="60" width="120" height="440" rx="16" fill="rgba(30,43,60,0.05)" stroke="var(--navy)" stroke-width="2.5" />
      <circle cx="346" cy="86" r="14" fill="var(--navy)" />
      <text x="346" y="91" text-anchor="middle" class="rd-room-number">2</text>
      <text x="380" y="123" text-anchor="middle" class="rd-room-label">THE PASS</text>
      <text x="380" y="140" text-anchor="middle" class="rd-room-sub">the API</text>

      <!-- order-ticket rail, a real pass detail -->
      <line x1="335" y1="170" x2="425" y2="170" stroke="var(--navy)" stroke-width="1.5" opacity="0.5" />
      <g transform="translate(352,170) rotate(-6)">
        <rect x="-9" y="0" width="18" height="24" rx="2" fill="var(--paper)" stroke="var(--coral)" stroke-width="1.5" />
      </g>
      <g transform="translate(380,170) rotate(4)">
        <rect x="-9" y="0" width="18" height="24" rx="2" fill="var(--paper)" stroke="var(--gold)" stroke-width="1.5" />
      </g>
      <g transform="translate(408,170) rotate(-3)">
        <rect x="-9" y="0" width="18" height="24" rx="2" fill="var(--paper)" stroke="var(--coral)" stroke-width="1.5" />
      </g>
    </g>

    <!-- Kitchen -->
    <g ref="kitchenRef">
      <rect x="440" y="60" width="340" height="260" rx="16" fill="rgba(216,90,48,0.07)" stroke="var(--navy)" stroke-width="2.5" />
      <circle cx="466" cy="86" r="14" fill="var(--navy)" />
      <text x="466" y="91" text-anchor="middle" class="rd-room-number">3</text>
      <text x="490" y="83" class="rd-room-label">THE KITCHEN</text>
      <text x="490" y="100" class="rd-room-sub">the backend</text>

      <!-- stove with pot + steam -->
      <rect x="640" y="200" width="110" height="60" rx="8" fill="var(--paper)" stroke="var(--navy)" stroke-width="2" />
      <circle cx="668" cy="216" r="9" fill="none" stroke="var(--navy)" stroke-width="1.5" opacity="0.5" />
      <circle cx="722" cy="216" r="9" fill="none" stroke="var(--navy)" stroke-width="1.5" opacity="0.5" />
      <circle cx="668" cy="244" r="9" fill="none" stroke="var(--navy)" stroke-width="1.5" opacity="0.5" />
      <ellipse cx="722" cy="244" rx="16" ry="10" fill="var(--navy)" opacity="0.85" />
      <rect x="736" y="240" width="10" height="4" rx="2" fill="var(--navy)" opacity="0.85" />
      <!-- Steam: only visible while something's actually cooking — shown
           when the ingredient drops in the pan, hidden once the finished
           plate is handed to the expo, see runServiceLoop. -->
      <g ref="steamRef">
        <path d="M716,229 C712,221 720,215 716,206" stroke="var(--navy)" stroke-width="1.5" opacity="0.35" fill="none" stroke-linecap="round" />
        <path d="M729,229 C725,221 733,215 729,206" stroke="var(--navy)" stroke-width="1.5" opacity="0.35" fill="none" stroke-linecap="round" />
      </g>

      <!-- Shows briefly inside the pot itself while the cook's ingredient
           is "cooking" — doesn't move (the pot doesn't move), just a
           visibility toggle in the script between the ingredient prop
           disappearing and the finished plate appearing on the cook. -->
      <g ref="panContentsRef">
        <circle cx="718" cy="240" r="2.2" fill="var(--coral)" opacity="0.85" />
        <circle cx="726" cy="248" r="1.8" fill="var(--teal)" opacity="0.85" />
        <circle cx="720" cy="248" r="1.5" fill="var(--gold)" opacity="0.85" />
      </g>

      <!-- prep counter -->
      <rect x="470" y="200" width="130" height="46" rx="6" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" opacity="0.6" />
      <line x1="490" y1="200" x2="490" y2="246" stroke="var(--navy)" stroke-width="1" opacity="0.3" />
      <line x1="540" y1="200" x2="540" y2="246" stroke="var(--navy)" stroke-width="1" opacity="0.3" />
    </g>

    <!-- Pantry -->
    <g ref="pantryRef">
      <rect x="440" y="340" width="340" height="160" rx="16" fill="rgba(29,158,117,0.08)" stroke="var(--navy)" stroke-width="2.5" />
      <circle cx="466" cy="366" r="14" fill="var(--navy)" />
      <text x="466" y="371" text-anchor="middle" class="rd-room-number">4</text>
      <text x="490" y="363" class="rd-room-label">THE PANTRY</text>
      <text x="490" y="380" class="rd-room-sub">the database</text>

      <!-- shelves stocked with jars/cans -->
      <g v-for="(shelfY, si) in [420, 448, 476]" :key="si">
        <line :x1="470" :y1="shelfY" :x2="750" :y2="shelfY" stroke="var(--navy)" stroke-width="1.5" opacity="0.35" />
        <g v-for="i in 7" :key="i">
          <rect
            :x="470 + i * 38 - 8"
            :y="shelfY - 20"
            width="16"
            height="20"
            rx="3"
            :fill="i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--coral)' : 'var(--teal)'"
            opacity="0.55"
          />
        </g>
      </g>

      <!-- swinging kitchen door between kitchen and pantry, CRUD at the door -->
      <path d="M580,340 A20,20 0 0 1 600,320" fill="none" stroke="var(--navy)" stroke-width="1.5" opacity="0.45" />
      <path d="M640,340 A20,20 0 0 0 620,320" fill="none" stroke="var(--navy)" stroke-width="1.5" opacity="0.45" />
      <line x1="610" y1="320" x2="610" y2="340" stroke="var(--navy)" stroke-width="2.5" />
      <text x="650" y="335" class="rd-crud">C &middot; R &middot; U &middot; D</text>
    </g>

    <!-- Static route guide: shows the shape of a round trip at a glance,
         even for anyone who never sees the animated version (reduced
         motion, or just didn't linger). -->
    <g ref="pathsRef">
      <path d="M219,280 Q300,240 335,240 T600,225" fill="none" stroke="var(--coral)" stroke-width="2.5" stroke-dasharray="7 6" marker-end="url(#rd-arrow-request)" />
      <path d="M600,245 Q440,320 400,320 T219,320" fill="none" stroke="var(--gridline)" stroke-width="2.5" stroke-dasharray="7 6" marker-end="url(#rd-arrow-response)" />

      <g class="rd-legend">
        <line x1="500" y1="522" x2="524" y2="522" stroke="var(--coral)" stroke-width="2.5" stroke-dasharray="7 6" />
        <text x="530" y="526" class="rd-legend-label">request</text>
        <line x1="622" y1="522" x2="646" y2="522" stroke="var(--gridline)" stroke-width="2.5" stroke-dasharray="7 6" />
        <text x="652" y="526" class="rd-legend-label">response</text>
      </g>
    </g>

    <!-- Cook, same "painted last" reasoning as the waiter below — it walks
         between the kitchen and pantry, both drawn earlier, so it needs to
         stay on top of both. Distinguished from the waiter by silhouette
         (chef hat) and color (navy coat vs. the waiter's gold vest), not
         just position, so they read as two different characters at a
         glance, not one figure in two places. -->
    <g ref="cookRef">
      <path d="M-8,-24 Q-9,-32 0,-33 Q9,-32 8,-24 Z" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
      <circle cx="0" cy="-16" r="8" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
      <path d="M-11,4 Q0,-8 11,4 L9,26 L-9,26 Z" fill="var(--navy)" />
      <line x1="-4" y1="10" x2="4" y2="10" stroke="var(--paper)" stroke-width="1.5" opacity="0.7" />
      <rect x="-20" y="34" width="40" height="17" rx="4" fill="var(--paper)" stroke="var(--navy)" stroke-width="1" opacity="0.9" />
      <text x="0" y="45" text-anchor="middle" class="rd-room-sub">cook</text>

      <!-- Ingredient (raw, off the shelf) and the finished plate — never
           both visible at once, the script swaps between them via the
           pan-contents cue above. Same side position as the other
           held-prop conventions. -->
      <!-- Matches the plate's own food cluster (same colors, same rough
           layout, just no rim yet) so it visibly reads as "this is what
           becomes that plate," not an unrelated single item. -->
      <g ref="cookIngredientRef">
        <ellipse cx="19" cy="7" rx="3.5" ry="2.5" fill="var(--coral)" opacity="0.85" transform="rotate(-15 19 7)" />
        <circle cx="23" cy="6" r="1.5" fill="var(--teal)" opacity="0.85" />
        <circle cx="22" cy="10" r="1.2" fill="var(--teal)" opacity="0.75" />
        <circle cx="17" cy="10" r="1.3" fill="var(--gold)" opacity="0.85" />
      </g>
      <g ref="cookPlateRef">
        <circle cx="20" cy="8" r="10" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
        <circle cx="20" cy="8" r="7.5" fill="none" stroke="var(--navy)" stroke-width="0.5" opacity="0.25" />
        <ellipse cx="18" cy="6" rx="4" ry="3" fill="var(--coral)" opacity="0.85" transform="rotate(-15 18 6)" />
        <circle cx="24" cy="6.5" r="1.6" fill="var(--teal)" opacity="0.85" />
        <circle cx="23" cy="10.5" r="1.3" fill="var(--teal)" opacity="0.75" />
        <circle cx="17" cy="11" r="1.4" fill="var(--gold)" opacity="0.85" />
      </g>
    </g>

    <!-- Waiter, painted last on purpose: SVG paints in document order, and
         this needs to stay visibly on top no matter which room it's
         currently walking through (kitchen/pantry are drawn after the
         pass, so a waiter drawn earlier would vanish behind them mid-trip).
         Starts hidden, revealed and animated after all 4 rooms are shown,
         see script. No static transform here deliberately — GSAP's x/y
         don't compose with a pre-existing transform attribute on an SVG
         element, they replace it outright, so position is set entirely
         from the script (gsap.set/motionPath), starting at HOME. -->
    <g ref="waiterRef">
      <path d="M-18,4 L-30,-2" stroke="var(--navy)" stroke-width="1.5" opacity="0.3" stroke-linecap="round" />
      <path d="M-15,14 L-28,12" stroke="var(--navy)" stroke-width="1.5" opacity="0.22" stroke-linecap="round" />
      <circle cx="0" cy="-16" r="8" fill="var(--gold)" />
      <path d="M-11,4 Q0,-8 11,4 L9,26 L-9,26 Z" fill="var(--gold)" />
      <rect x="-22" y="34" width="44" height="17" rx="4" fill="var(--paper)" stroke="var(--navy)" stroke-width="1" opacity="0.9" />
      <text x="0" y="45" text-anchor="middle" class="rd-room-sub">waiter</text>

      <!-- Held at the side (hand height), not above the head — shown/hidden
           by script rather than moved independently, as children of this
           group they automatically travel with the waiter with no
           separate position tracking. -->
      <g ref="waiterTicketRef">
        <rect x="13" y="-1" width="14" height="18" rx="2" fill="var(--paper)" stroke="var(--coral)" stroke-width="1.5" />
      </g>
      <g ref="waiterPlateRef">
        <circle cx="20" cy="8" r="10" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
        <circle cx="20" cy="8" r="7.5" fill="none" stroke="var(--navy)" stroke-width="0.5" opacity="0.25" />
        <ellipse cx="18" cy="6" rx="4" ry="3" fill="var(--coral)" opacity="0.85" transform="rotate(-15 18 6)" />
        <circle cx="24" cy="6.5" r="1.6" fill="var(--teal)" opacity="0.85" />
        <circle cx="23" cy="10.5" r="1.3" fill="var(--teal)" opacity="0.75" />
        <circle cx="17" cy="11" r="1.4" fill="var(--gold)" opacity="0.85" />
      </g>
    </g>

    <!-- The expo (short for "expediter") — a real position, the person who
         runs the pass: calls tickets back to the kitchen and hands
         finished plates to whoever's delivering them. Third distinct
         look (teal, no hat) so all three characters read apart at a
         glance. Painted last for the same reason as the cook/waiter. -->
    <g ref="expoRef">
      <circle cx="0" cy="-16" r="8" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
      <path d="M-11,4 Q0,-8 11,4 L9,26 L-9,26 Z" fill="var(--teal)" />
      <rect x="-20" y="34" width="40" height="17" rx="4" fill="var(--paper)" stroke="var(--navy)" stroke-width="1" opacity="0.9" />
      <text x="0" y="45" text-anchor="middle" class="rd-room-sub">expo</text>

      <g ref="expoTicketRef">
        <rect x="13" y="-1" width="14" height="18" rx="2" fill="var(--paper)" stroke="var(--coral)" stroke-width="1.5" />
      </g>
      <g ref="expoPlateRef">
        <circle cx="20" cy="8" r="10" fill="var(--paper)" stroke="var(--navy)" stroke-width="1.5" />
        <circle cx="20" cy="8" r="7.5" fill="none" stroke="var(--navy)" stroke-width="0.5" opacity="0.25" />
        <ellipse cx="18" cy="6" rx="4" ry="3" fill="var(--coral)" opacity="0.85" transform="rotate(-15 18 6)" />
        <circle cx="24" cy="6.5" r="1.6" fill="var(--teal)" opacity="0.85" />
        <circle cx="23" cy="10.5" r="1.3" fill="var(--teal)" opacity="0.75" />
        <circle cx="17" cy="11" r="1.4" fill="var(--gold)" opacity="0.85" />
      </g>
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'

const svgRoot = ref(null)
const signRef = ref(null)
const diningRef = ref(null)
const passRef = ref(null)
const kitchenRef = ref(null)
const pantryRef = ref(null)
const pathsRef = ref(null)
const waiterRef = ref(null)
const cookRef = ref(null)
const expoRef = ref(null)
const waiterTicketRef = ref(null)
const waiterPlateRef = ref(null)
const expoTicketRef = ref(null)
const expoPlateRef = ref(null)
const cookIngredientRef = ref(null)
const cookPlateRef = ref(null)
const panContentsRef = ref(null)
const tablePlateRef = ref(null)
const steamRef = ref(null)

const prefersReducedMotion = usePrefersReducedMotion()

// Absolute positions in the diagram's own coordinate space (the SVG's own
// viewBox units) — the waiter <g> has no static transform of its own (see
// template), GSAP's x/y become its entire position, so these are used
// directly as motionPath waypoints, not as offsets from anything.
const HOME = { x: 380, y: 300 } // waiter's resting spot
const TABLE = { x: 205, y: 296 }
// Through-points for crossing the pass, matched to each static guide
// line's actual curve there (not just a shared midpoint), so the waiter
// visibly hugs the coral line outbound and the blue line on the way back
// rather than splitting the difference between them. The waiter now stops
// AT the pass (PASS_REQUEST doubles as the waiter/expo meeting spot) —
// it no longer enters the kitchen itself, the expo carries things the
// rest of the way now.
const PASS_REQUEST = { x: 380, y: 240 } // tracks the coral "request" line; also where waiter waits
const PASS_RESPONSE = { x: 380, y: 320 } // tracks the blue "response" line
const EXPO_HOME = { x: 380, y: 195 } // expo's idle spot, by the ticket rail
// Cook's world stays entirely inside the kitchen/pantry.
const STOVE = { x: 695, y: 275 } // cook's idle spot, right in front of the stove
const PANTRY_COOK = { x: 600, y: 460 } // reaching for a shelf
const HANDOFF = { x: 650, y: 195 } // where cook and expo actually meet, in the kitchen

onMounted(() => {
  const rooms = [diningRef.value, passRef.value, kitchenRef.value, pantryRef.value]
  const characters = [waiterRef.value, cookRef.value, expoRef.value]
  const props = [
    waiterTicketRef.value, waiterPlateRef.value, expoTicketRef.value, expoPlateRef.value,
    cookIngredientRef.value, cookPlateRef.value, panContentsRef.value, tablePlateRef.value, steamRef.value
  ]

  gsap.set(waiterRef.value, { x: HOME.x, y: HOME.y })
  gsap.set(cookRef.value, { x: STOVE.x, y: STOVE.y })
  gsap.set(expoRef.value, { x: EXPO_HOME.x, y: EXPO_HOME.y })
  gsap.set(props, { autoAlpha: 0 })

  if (prefersReducedMotion.value) {
    gsap.set([signRef.value, ...rooms, pathsRef.value, ...characters], { autoAlpha: 1 })
    return
  }

  // Sign swings/slides in on its own (see playIntro), distinct from the
  // plain fade-up every room shares — it's drawn hanging from two strings,
  // so rotation pivots around its own center, not the SVG's corner.
  gsap.set(signRef.value, { transformOrigin: '430px 25px', x: -90, rotation: -10, autoAlpha: 0 })
  gsap.set([...rooms, pathsRef.value], { autoAlpha: 0, y: 10 })
  gsap.set(characters, { autoAlpha: 0 })

  ScrollTrigger.create({
    trigger: svgRoot.value,
    start: 'top 70%',
    once: true,
    onEnter: playIntro
  })
})

// Rooms revealed one at a time, sign first, then each stop in the order a
// request would actually visit them, only once all four are on screen does
// the waiter appear and start walking the route it just showed you.
function playIntro () {
  const tl = gsap.timeline()
  // Swoosh: slides + rotates in with an overshoot-then-settle ease, reads
  // as the sign swinging into place on its two strings — distinct from the
  // plain fade-up every room below shares, since it goes first and sets
  // the tone.
  tl.to(signRef.value, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' })
  tl.to(diningRef.value, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.15')
  tl.to(passRef.value, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.15')
  tl.to(kitchenRef.value, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.15')
  tl.to(pantryRef.value, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.15')
  tl.to(pathsRef.value, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.2')
  tl.call(() => runServiceLoop())
}

// Three characters now, and two props (ticket, plate) that visually travel
// WITH whoever's currently carrying them — each prop is a child of its
// carrier's own <g>, so it moves for free as that group's transform
// changes, no separate position-tracking needed, only show/hide swaps at
// the exact moments a handoff happens (tl.set, instant, not a tween).
//
// Full sequence: waiter takes the order (ticket appears) -> carries it to
// the pass and STOPS, doesn't enter the kitchen itself -> hands the ticket
// to the expo, who's the one that actually goes in -> expo carries it to
// the kitchen and waits -> cook does its stove/pantry/stove run exactly as
// before -> cook meets the expo (not the waiter) to exchange ticket for
// plate -> expo carries the plate back to the pass -> hands it to the
// still-waiting waiter -> waiter delivers it to the table. One strictly
// sequential timeline throughout, nothing overlaps unless explicitly given
// the same position label, so nothing can race ahead of a handoff it
// depends on.
function runServiceLoop () {
  gsap.set(waiterRef.value, { autoAlpha: 1, x: HOME.x, y: HOME.y })
  gsap.set(cookRef.value, { autoAlpha: 1, x: STOVE.x, y: STOVE.y })
  gsap.set(expoRef.value, { autoAlpha: 1, x: EXPO_HOME.x, y: EXPO_HOME.y })
  gsap.set([
    waiterTicketRef.value, waiterPlateRef.value, expoTicketRef.value, expoPlateRef.value,
    cookIngredientRef.value, cookPlateRef.value, panContentsRef.value, steamRef.value
  ], { autoAlpha: 0 })

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.5 })

  // Waiter takes the order
  tl.to(waiterRef.value, { motionPath: { path: [HOME, TABLE], curviness: 1.2 }, duration: 1.1, ease: 'sine.inOut' })
  tl.set(waiterTicketRef.value, { autoAlpha: 1 })
  tl.to(waiterRef.value, { duration: 0.4 }) // pause: taking the order

  // Waiter carries the ticket to the pass and stops — it goes no further
  tl.to(waiterRef.value, { motionPath: { path: [TABLE, PASS_REQUEST], curviness: 1.2 }, duration: 1.3, ease: 'sine.inOut' }, '+=0.1')
  tl.to(waiterRef.value, { duration: 0.2 })

  // Expo steps up, receives the ticket, waiter is now empty-handed and waits
  tl.to(expoRef.value, { motionPath: { path: [EXPO_HOME, PASS_REQUEST], curviness: 1 }, duration: 0.5, ease: 'sine.inOut' }, '+=0.1')
  tl.set(waiterTicketRef.value, { autoAlpha: 0 })
  tl.set(expoTicketRef.value, { autoAlpha: 1 })
  tl.to(expoRef.value, { duration: 0.3 }) // pause: ticket exchanged

  // Expo carries the ticket into the kitchen and waits by the stove
  tl.to(expoRef.value, { motionPath: { path: [PASS_REQUEST, HANDOFF], curviness: 1.2 }, duration: 1.1, ease: 'sine.inOut' }, '+=0.1')
  tl.to(expoRef.value, { duration: 0.3 })

  // Cook: stove -> pantry (get it, ingredient prop appears) -> stove
  tl.to(cookRef.value, { motionPath: { path: [STOVE, PANTRY_COOK], curviness: 1.2 }, duration: 0.9, ease: 'sine.inOut' }, '+=0.1')
  tl.set(cookIngredientRef.value, { autoAlpha: 1 })
  tl.to(cookRef.value, { duration: 0.4 }) // pause: grabbing it off the shelf
  tl.to(cookRef.value, { motionPath: { path: [PANTRY_COOK, STOVE], curviness: 1.2 }, duration: 0.9, ease: 'sine.inOut' }, '+=0.1')

  // Drops it in the pan — leaves the cook's hand, shows up in the pot
  // itself, steam starts now and stays until the food actually leaves the
  // kitchen (the exchange with the expo below), not just during this pause
  tl.set(cookIngredientRef.value, { autoAlpha: 0 })
  tl.set(panContentsRef.value, { autoAlpha: 1 })
  tl.set(steamRef.value, { autoAlpha: 1 })
  tl.to(cookRef.value, { duration: 0.5 }) // pause: cooking it

  // Plated — pan contents become the finished plate, cook carries it over
  tl.set(panContentsRef.value, { autoAlpha: 0 })
  tl.set(cookPlateRef.value, { autoAlpha: 1 })
  tl.to(cookRef.value, { motionPath: { path: [STOVE, HANDOFF], curviness: 1 }, duration: 0.6, ease: 'sine.inOut' }, '+=0.1')

  // Exchange: cook's plate becomes the expo's plate, cook heads back to the
  // stove, steam ends here — the food's actually left the kitchen now
  tl.set(cookPlateRef.value, { autoAlpha: 0 })
  tl.set(expoTicketRef.value, { autoAlpha: 0 })
  tl.set(expoPlateRef.value, { autoAlpha: 1 })
  tl.set(steamRef.value, { autoAlpha: 0 })
  tl.to(cookRef.value, { duration: 0.3 })
  tl.to(cookRef.value, { motionPath: { path: [HANDOFF, STOVE], curviness: 1 }, duration: 0.6, ease: 'sine.inOut' }, '+=0.1')

  // Expo carries the plate back to the pass, where the waiter's been
  // waiting this whole time
  tl.to(expoRef.value, { motionPath: { path: [HANDOFF, PASS_REQUEST], curviness: 1.2 }, duration: 1.1, ease: 'sine.inOut' }, '+=0.1')
  tl.to(expoRef.value, { duration: 0.2 })

  // Plate handed to the waiter; expo's done and heads back to idle while
  // the waiter delivers — two independent things now, so they run
  // together rather than waiting on each other.
  tl.set(expoPlateRef.value, { autoAlpha: 0 })
  tl.set(waiterPlateRef.value, { autoAlpha: 1 })
  tl.addLabel('handoffToWaiter')
  tl.to(expoRef.value, { motionPath: { path: [PASS_REQUEST, EXPO_HOME], curviness: 1 }, duration: 0.5, ease: 'sine.inOut' }, 'handoffToWaiter')
  tl.to(waiterRef.value, { motionPath: { path: [PASS_REQUEST, PASS_RESPONSE, TABLE], curviness: 1.3 }, duration: 1.8, ease: 'sine.inOut' }, 'handoffToWaiter')

  // Delivered — the plate leaves the waiter's hand and is actually set
  // down on the table, not just carried then discarded.
  tl.set(waiterPlateRef.value, { autoAlpha: 0 })
  tl.set(tablePlateRef.value, { autoAlpha: 1 })
  tl.to(waiterRef.value, { duration: 0.6 }) // pause: enjoy!

  // Reset, instead of the waiter walking back empty-handed (that path ran
  // right past PASS_RESPONSE again, reading as a second, meaningless
  // "response" trip with nothing actually being carried): the table
  // clears, and all three characters fade out and back in together at
  // their own stations. The fade itself is the "cycle's done, starting
  // over" signal.
  tl.to(tablePlateRef.value, { autoAlpha: 0, duration: 0.4 }, '+=0.3')
  tl.to([waiterRef.value, cookRef.value, expoRef.value], { autoAlpha: 0, duration: 0.4 }, '<')
  tl.call(() => {
    gsap.set(waiterRef.value, { x: HOME.x, y: HOME.y })
    gsap.set(cookRef.value, { x: STOVE.x, y: STOVE.y })
    gsap.set(expoRef.value, { x: EXPO_HOME.x, y: EXPO_HOME.y })
  })
  tl.to([waiterRef.value, cookRef.value, expoRef.value], { autoAlpha: 1, duration: 0.4 }, '+=0.2')
}
</script>

<style scoped>
.restaurant-diagram {
  display: block;
  width: 100%;
  height: auto;
}

.rd-sign-text {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  fill: var(--navy);
}

.rd-room-number {
  font-family: var(--font-label);
  font-size: 14px;
  font-weight: 600;
  fill: var(--paper);
}

.rd-room-label {
  font-family: var(--font-label);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.04em;
  fill: var(--navy);
}

.rd-room-sub {
  font-family: var(--font-label);
  font-size: 12px;
  fill: var(--navy);
  opacity: 0.55;
}

.rd-table-label {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: 600;
  fill: var(--coral);
}

.rd-table-sub {
  font-family: var(--font-label);
  font-size: 10px;
  fill: var(--navy);
  opacity: 0.6;
}

.rd-crud {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: 600;
  fill: var(--teal);
}

.rd-legend-label {
  font-family: var(--font-label);
  font-size: 12px;
  fill: var(--navy);
  opacity: 0.65;
}
</style>
