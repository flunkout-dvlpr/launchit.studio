<template>
  <q-layout view="hHh lpr fFf" class="studio-layout">
    <q-header class="studio-header">
      <q-toolbar class="studio-toolbar">
        <router-link ref="wordmarkEl" to="/" class="studio-wordmark font-label">
          <LogoMark :size="$q.screen.lt.sm ? 40 : 56" class="studio-wordmark__mark" />
          LAUNCHIT <span class="text-weight-bold">STUDIO</span>
        </router-link>

        <q-space />

        <nav ref="navEl" class="studio-nav">
          <router-link to="/sessions" class="studio-nav__link font-label" @mouseenter="underline" @mouseleave="unUnderline">
            Sessions
            <span class="studio-nav__underline" />
          </router-link>
          <a href="mailto:hello@launchit.studio" class="studio-nav__link font-label" @mouseenter="underline" @mouseleave="unUnderline" @click="trackEvent('contact_click', { location: 'nav' })">
            Contact
            <span class="studio-nav__underline" />
          </a>
        </nav>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="studio-footer font-label">
      <div class="studio-footer__inner">
        <span class="pill-tag pill-tag--outline tilt-left">HOUSTON</span>
        <p class="studio-footer__text">
          Launchit Studio — design and development.
          <a href="mailto:hello@launchit.studio" @click="trackEvent('contact_click', { location: 'footer' })">hello@launchit.studio</a>
        </p>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import { trackEvent } from 'boot/analytics'
import LogoMark from 'components/LogoMark.vue'

const $q = useQuasar()
const wordmarkEl = ref(null)
const navEl = ref(null)
const prefersReducedMotion = usePrefersReducedMotion()

onMounted(() => {
  if (prefersReducedMotion.value) return

  const wordmark = wordmarkEl.value?.$el
  if (wordmark) {
    gsap.from(wordmark, { x: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' })
  }
  if (navEl.value) {
    gsap.from(navEl.value.children, { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
  }
})

function underline (e) {
  const el = e.currentTarget.querySelector('.studio-nav__underline')
  gsap.to(el, { scaleX: 1, duration: 0.25, ease: 'power2.out' })
}
function unUnderline (e) {
  const el = e.currentTarget.querySelector('.studio-nav__underline')
  gsap.to(el, { scaleX: 0, duration: 0.2, ease: 'power2.in' })
}
</script>

<style lang="scss" scoped>
.studio-layout {
  background: var(--paper);
  color: var(--navy);
}

.studio-header {
  background: var(--paper);
  color: var(--navy);
  box-shadow: none;
  border-bottom: 1px solid rgba(62, 124, 166, 0.35);
}

.studio-toolbar {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.5rem;
}

.studio-wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  color: var(--navy);
  text-decoration: none;
}

.studio-wordmark__mark {
  flex: none;
}

.studio-nav {
  display: flex;
  gap: 2rem;
}

.studio-nav__link {
  position: relative;
  color: var(--navy);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  padding-bottom: 4px;
}

.studio-nav__underline {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--coral);
  transform: scaleX(0);
  transform-origin: left;
}

// Below Quasar's "sm" breakpoint (<600px), the full wordmark plus both nav
// links no longer comfortably share one toolbar row — tighten everything
// down rather than let it wrap and overlap.
@media (max-width: 599px) {
  .studio-toolbar {
    padding: 0 1rem;
  }

  .studio-wordmark {
    font-size: 0.85rem;
    gap: 0.35rem;
  }

  .studio-nav {
    gap: 1rem;
  }

  .studio-nav__link {
    font-size: 0.75rem;
  }
}

.studio-footer {
  border-top: 1px solid rgba(62, 124, 166, 0.35);
  padding: 2.5rem 1.5rem 3rem;
}

.studio-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.studio-footer__text {
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0.75rem 0 0;
  opacity: 0.8;

  a {
    color: var(--navy);
  }
}
</style>
