<template>
  <q-page class="about-page grid-texture">
    <div ref="root" class="about-page__inner">
      <header class="about-page__header reveal">
        <span class="pill-tag pill-tag--gold tilt-right">ABOUT</span>
        <h1 class="font-display about-page__title">
          Built by a builder, for builders.
        </h1>
      </header>

      <section class="reveal">
        <h2 class="font-label about-page__label">What this is</h2>
        <p class="font-label about-page__body">
          Launchit Sessions is a recurring event: real Houston builders bring
          problems they want built with Claude, the community picks one each
          cycle through a vote or an open submission, and it gets built out
          with the person who submitted it into a working demo or a solid
          concept. It's presented live at an Impact Hub Houston event. This
          isn't a single event; it's an ongoing framework that repeats.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label about-page__label">Why it exists</h2>
        <p class="font-label about-page__body">
          I introduce myself as a builder. Most days that means code, but it's
          also furniture, woodworking, cooking a good meal, staying active, and
          building relationships with the people around me. Building is just
          how I engage with the world, and the best part has never been
          finishing something myself. It's watching someone else light up when
          a problem they've been stuck on, or an idea they've been sitting on
          for a while, finally becomes real. Launchit Sessions exists exactly
          for this: to make that moment happen for more people, especially the
          ones who've never thought of themselves as "technical."
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label about-page__label">How we build</h2>
        <p class="font-label about-page__body">
          We use Claude to build, but what comes out the other end doesn't
          need Claude to keep running. No chatbot bolted onto your site, no
          "agent" quietly racking up API calls every time someone uses what
          you built. Just a real, standalone tool, site, or script that's
          yours, works on its own, and keeps working exactly the same way a
          year from now.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label about-page__label">Who it's for</h2>
        <p class="font-label about-page__body">
          Small business owners, entrepreneurs, and everyday builders,
          especially non-technical ones. You don't need to know how to code or
          prompt. You need a real problem, an idea you've been sitting on, and
          a willingness to show your actual workflow, warts and all, to a room
          of your peers.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label about-page__label">Impact Hub Houston</h2>
        <p class="font-label about-page__body">
          Impact Hub Houston is a nonprofit and part of a global network of
          more than 130 Impact Hub communities worldwide, recognized by the
          United Nations as one of the largest communities supporting
          entrepreneurs working toward the UN's Sustainable Development Goals.
          They're based at The Ion, running programs, mentorship, and events
          for Houston's entrepreneurs and changemakers, with a particular
          focus on historically underserved communities. Sessions is co-run
          with them: they bring the audience and the room, Launchit Studio
          brings the content and the build.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label about-page__label">Cadence</h2>
        <p class="font-label about-page__body">
          Roughly every few weeks. The exact cadence is still settling as the
          format runs its first few cycles.
        </p>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'

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
.about-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.about-page__inner {
  max-width: 680px;
  margin: 0 auto;
}

.about-page__header {
  margin-bottom: 2.5rem;
}

.about-page__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0;
}

.about-page__label {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}

.about-page__body {
  line-height: 1.7;
  margin: 0 0 0.75rem;

  &--muted {
    opacity: 0.65;
    font-size: 0.9rem;
  }
}
</style>
