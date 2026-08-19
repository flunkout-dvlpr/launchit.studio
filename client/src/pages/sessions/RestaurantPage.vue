<template>
  <q-page class="restaurant-page grid-texture">
    <div ref="root">
      <div class="restaurant-page__inner">
        <header class="restaurant-page__header reveal">
          <span class="pill-tag pill-tag--gold tilt-right">THE RESTAURANT</span>
          <h1 class="font-display restaurant-page__title">
            Picture it like a restaurant.
          </h1>
          <p class="font-label restaurant-page__intro">
            Almost everything we build at a Session is the same basic shape
            underneath, whatever it looks like on the surface. One analogy
            covers the whole thing, so we're using it end to end instead of
            switching metaphors mid-explanation.
          </p>
        </header>
      </div>

      <!-- Deliberately outside .restaurant-page__inner (680px text column) —
           nested inside it, its own max-width could never actually take
           effect, a child can't render wider than its parent. -->
      <section class="reveal restaurant-page__diagram-section">
        <RestaurantDiagram v-if="$q.screen.width >= 700" class="restaurant-page__diagram" />
        <ol v-else class="restaurant-page__diagram-fallback font-label">
          <li>
            <span class="restaurant-page__diagram-fallback-label">Dining Room</span>
            <span class="restaurant-page__diagram-fallback-sub">frontend &mdash; what you see</span>
          </li>
          <li>
            <span class="restaurant-page__diagram-fallback-label">The Pass</span>
            <span class="restaurant-page__diagram-fallback-sub">API &mdash; carries the request</span>
          </li>
          <li>
            <span class="restaurant-page__diagram-fallback-label">The Kitchen</span>
            <span class="restaurant-page__diagram-fallback-sub">backend &mdash; does the work</span>
          </li>
          <li>
            <span class="restaurant-page__diagram-fallback-label">The Pantry</span>
            <span class="restaurant-page__diagram-fallback-sub">database &mdash; remembers everything</span>
          </li>
        </ol>
        <p class="font-label restaurant-page__diagram-caption">
          A request's whole round trip: table &rarr; pass &rarr; kitchen &rarr; pantry &rarr; back out again &mdash; handed off at every stop, not carried by one person the whole way.
        </p>
      </section>

      <div class="restaurant-page__inner">
      <section class="reveal">
        <h2 class="font-label restaurant-page__label">The Dining Room &mdash; the frontend</h2>
        <p class="font-label restaurant-page__body">
          This is what you actually see and touch: the menu, the tables, the
          layout of the room. In a real app, it's every screen, button, and
          form, whatever's rendered in your browser. Nothing here does the
          real work, it's how you ask for things and how the answer gets
          shown back to you.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label restaurant-page__label">The Pass &mdash; the API</h2>
        <p class="font-label restaurant-page__body">
          The pass is the window between the dining room and the kitchen.
          The waiter never crosses it, they hand the ticket off to the expo
          right there and wait. An API is exactly this: a fixed set of
          things you're allowed to ask for ("one order of X"), handed off at
          a clear boundary between the part you see and the part that does
          the work, nothing more, nothing improvised.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label restaurant-page__label">The Kitchen &mdash; the backend</h2>
        <p class="font-label restaurant-page__body">
          Where the actual work happens. An order comes in through the pass,
          gets cooked, and goes back out. Nobody at the table can see this
          part, and they don't need to, they just need what they asked for
          to come back correctly. This is the code that runs on a server
          somewhere, doing whatever the request actually needs done.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label restaurant-page__label">The Pantry &mdash; the database</h2>
        <p class="font-label restaurant-page__body">
          Everything the kitchen needs to remember between orders lives
          here: what's in stock, what's already been made, what a past
          order actually was. The kitchen doesn't hold any of this in its
          head, it walks to the pantry every time. That's what a database
          is, storage the backend checks and updates, instead of forgetting
          everything the moment one order is done.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label restaurant-page__label">CRUD &mdash; the four things a waiter can do</h2>
        <p class="font-label restaurant-page__body">
          Almost every action in almost every app boils down to one of four
          things, the same four things a waiter can do with an order:
        </p>
        <ul class="font-label restaurant-page__crud-list">
          <li><strong>Create</strong> &mdash; place a new order.</li>
          <li><strong>Read</strong> &mdash; check on an order, or what's on the menu.</li>
          <li><strong>Update</strong> &mdash; send it back with changes.</li>
          <li><strong>Delete</strong> &mdash; cancel it.</li>
        </ul>
        <p class="font-label restaurant-page__body">
          If you can name which of these four an app is doing at any given
          moment, you already understand more about what's happening than
          the screen alone shows you.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal restaurant-page__closing">
        <h2 class="font-label restaurant-page__label">So where does Claude Code fit?</h2>
        <p class="font-label restaurant-page__body">
          Claude Code is what helps build the dining room, the pass, the
          kitchen, and the pantry, wiring all four pieces together during a
          session. Once it's built, the restaurant runs completely on its
          own. Nobody needs Claude standing in the kitchen for the doors to
          open the next day, it already knows how to cook.
        </p>
      </section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { gsap } from 'boot/gsap'
import RestaurantDiagram from 'components/RestaurantDiagram.vue'

const $q = useQuasar()
const root = ref(null)

onMounted(() => {
  root.value.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      delay: i === 0 ? 0.1 : 0,
      ease: 'power2.out'
    })
  })
})
</script>

<style lang="scss" scoped>
.restaurant-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.restaurant-page__inner {
  max-width: 680px;
  margin: 0 auto;
}

.restaurant-page__header {
  margin-bottom: 2.5rem;
}

.restaurant-page__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.restaurant-page__intro {
  opacity: 0.75;
  line-height: 1.6;
}

.restaurant-page__label {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}

.restaurant-page__body {
  line-height: 1.7;
  margin: 0 0 1rem;
}

.restaurant-page__crud-list {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  line-height: 1.9;

  strong {
    color: var(--coral);
  }
}

.restaurant-page__diagram-section {
  margin: 0 auto 3rem;
  max-width: 1300px;
  padding: 0 1.5rem;
}

.restaurant-page__diagram {
  width: 100%;
  height: auto;
}

.restaurant-page__diagram-caption {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.6;
  margin: 0.75rem 0 0;
}

// Below 700px the full diagram shrinks too far to stay legible — a plain
// stacked list carries the same four stops without forcing tiny text.
// Not a priority to make the full diagram itself mobile-friendly right
// now, a tap-to-zoom treatment on the real diagram is a reasonable later
// upgrade over this fallback.
.restaurant-page__diagram-fallback {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.85rem 1rem;
    border: 1px solid rgba(62, 124, 166, 0.3);
    border-radius: 6px;
    position: relative;

    &:not(:last-child)::after {
      content: '↓';
      position: absolute;
      left: 1rem;
      bottom: -1.15rem;
      color: var(--coral);
      font-size: 0.9rem;
    }
  }
}

.restaurant-page__diagram-fallback-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.restaurant-page__diagram-fallback-sub {
  font-size: 0.8rem;
  opacity: 0.65;
}

.restaurant-page__closing {
  padding: 1.5rem;
  border: 1px dashed rgba(62, 124, 166, 0.4);
  border-radius: 6px;
}
</style>
