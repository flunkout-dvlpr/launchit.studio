<template>
  <q-page class="placeholder-page flex flex-center">
    <div ref="root" class="placeholder-page__content text-center q-pa-lg">
      <div class="font-label text-caption text-weight-medium" style="letter-spacing:0.08em; opacity:0.6;">
        LAUNCHIT STUDIO
      </div>
      <h1 class="font-display placeholder-page__title q-my-md">
        Rebuilding, in the open.
      </h1>
      <p class="font-label placeholder-page__body q-mb-lg">
        The main site is being rebuilt. In the meantime, Launchit Sessions, our
        live build series with Houston builders and entrepreneurs, is up and
        running.
      </p>
      <q-btn
        to="/sessions"
        unelevated
        no-caps
        class="font-label placeholder-page__cta"
        label="Go to Launchit Sessions"
        icon-right="arrow_forward"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'boot/gsap'

const root = ref(null)

onMounted(() => {
  gsap.from(root.value.children, {
    y: 16,
    autoAlpha: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out'
  })
})
</script>

<style lang="scss" scoped>
.placeholder-page {
  min-height: 100vh;
  background: var(--paper);
  color: var(--navy);
}

.placeholder-page__content {
  max-width: 520px;
}

.placeholder-page__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.15;
}

.placeholder-page__body {
  opacity: 0.85;
  line-height: 1.6;
}

.placeholder-page__cta {
  background: var(--navy);
  color: var(--paper);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
}
</style>
