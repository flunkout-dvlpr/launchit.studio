<template>
  <q-page class="notes-index grid-texture">
    <div class="notes-index__inner">
      <header class="notes-index__header">
        <span class="pill-tag pill-tag--gold tilt-right">NOTES</span>
        <h1 class="font-display notes-index__title">Field notes.</h1>
        <p class="font-label notes-index__lede">
          Frameworks and lessons pulled from working across different startups and
          teams — not project writeups, just the patterns worth writing down.
        </p>
      </header>

      <router-link
        v-for="note in notes"
        :key="note.to"
        :to="note.to"
        class="notes-index__entry"
        @click="trackEvent('notes_entry_click', { label: note.title })"
      >
        <div>
          <h2 class="font-display notes-index__entry-title">{{ note.title }}</h2>
          <p class="font-label notes-index__entry-text">{{ note.description }}</p>
        </div>
        <span class="notes-index__entry-arrow" aria-hidden="true">→</span>
      </router-link>
    </div>
  </q-page>
</template>

<script setup>
import { trackEvent } from 'boot/analytics'

const notes = [
  {
    to: '/notes/validation-ladder',
    title: 'The Validation Ladder',
    description: 'Telling real market validation apart from conviction — and why that, not building, is the actual obstacle.'
  }
]
</script>

<style lang="scss" scoped>
.notes-index {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.notes-index__inner {
  max-width: 680px;
  margin: 0 auto;
}

.notes-index__header {
  margin-bottom: 3rem;
}

.notes-index__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.notes-index__lede {
  line-height: 1.65;
  opacity: 0.8;
  max-width: 54ch;
  margin: 0;
}

.notes-index__entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  text-decoration: none;
  color: var(--navy);
  padding: 1.5rem 0;
  border-top: 1px solid rgba(62, 124, 166, 0.35);
  transition: gap 0.2s ease;

  &:last-child {
    border-bottom: 1px solid rgba(62, 124, 166, 0.35);
  }

  &:hover {
    gap: 2rem;

    .notes-index__entry-arrow {
      color: var(--coral);
    }
  }
}

.notes-index__entry-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.4rem;
}

.notes-index__entry-text {
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.75;
  margin: 0;
  max-width: 48ch;
}

.notes-index__entry-arrow {
  flex: none;
  font-size: 1.3rem;
  color: var(--navy);
  transition: color 0.2s ease;
}
</style>
