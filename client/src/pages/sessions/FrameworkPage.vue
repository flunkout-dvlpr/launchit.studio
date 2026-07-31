<template>
  <q-page class="framework-page grid-texture">
    <header class="framework-page__header">
      <span class="pill-tag pill-tag--gold tilt-right">FRAMEWORK</span>
      <h1 class="font-display framework-page__title">
        How a submission becomes a session.
      </h1>
      <p class="font-label framework-page__intro">
        Written for a prospective submitter, not an internal audience — this is
        the actual pipeline, in order, with nothing smoothed over.
      </p>
    </header>

    <FrameworkVertical :steps="steps" />

    <div class="dimension-line" />

    <p class="font-label framework-page__disclosure">
      A note before you submit: anything built during a session — the demo, the
      writeup, and eventually the source — may be shared publicly. If that's a
      dealbreaker for your use case, this format isn't the right fit yet.
    </p>
  </q-page>
</template>

<script setup>
import FrameworkVertical from 'components/framework/FrameworkVertical.vue'

const steps = [
  {
    type: 'source',
    title: 'Source',
    body: "Every cycle starts with a shortlist of real ideas — usually submitted through Impact Hub's channels, occasionally sourced by us when submissions are thin or we want to spotlight something specific. Either way, the community decides what gets built."
  },
  {
    type: 'vet',
    title: 'Vet',
    body: "Every idea on the shortlist is checked against three things: buildable within the cycle window, broadly useful to other Houston builders, and either detailed enough to build from or the submitter's open to a quick call. Presenting alongside us is encouraged, never required."
  },
  {
    type: 'select',
    title: 'Select',
    body: "Whatever clears vetting goes to a community vote through Impact Hub's channels — the community decides which idea gets built this cycle."
  },
  {
    type: 'scope',
    title: 'Scope',
    body: "If the submission needs more detail, one to two calls with the submitter fill in the gaps — otherwise, we build straight from what's submitted."
  },
  {
    type: 'build',
    title: 'Build',
    body: "A working demo, or at minimum a rough concept, built within the cycle window — with business specifics generalized if you'd rather keep them private."
  },
  {
    type: 'prep',
    title: 'Prep artifact',
    body: 'A short guide shared before the event so attendees can follow along and try it themselves.'
  },
  {
    type: 'event',
    title: 'Event',
    body: "Presented live at Impact Hub Houston / The Ion. Submitters are encouraged to join and share their story — but it's never a requirement to get built."
  },
  {
    type: 'recap',
    title: 'Recap',
    body: "A session writeup, shared back through Impact Hub's channels — doubling as the call for the next cycle's submissions. It's also archived here, so it stays a resource anyone can come back to."
  }
]

</script>

<style lang="scss" scoped>
.framework-page {
  background: var(--paper);
  padding: 4rem 0 5rem;

  @media (max-width: 720px) {
    padding: 2.75rem 0 3.5rem;
  }
}

.framework-page__header {
  max-width: 680px;
  margin: 0 auto 3.5rem;
  padding: 0 1.5rem;

  @media (max-width: 720px) {
    padding: 0 1.25rem;
  }
}

.framework-page__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.framework-page__intro {
  opacity: 0.75;
  line-height: 1.6;
}

.framework-page__disclosure {
  max-width: 680px;
  margin: 3rem auto 0;
  padding: 0 1.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.7;
}
</style>
