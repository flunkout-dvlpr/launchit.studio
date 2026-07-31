<template>
  <q-layout view="hHh lpr fFf" class="sessions-layout">
    <q-header class="sessions-header">
      <q-toolbar class="sessions-toolbar">
        <router-link to="/sessions" class="sessions-wordmark font-label">
          <LogoMark :variant="logoVariant" :size="75" class="sessions-wordmark__mark" />
          LAUNCHIT <span class="text-weight-bold">SESSIONS</span>
        </router-link>

        <q-space />

        <nav class="sessions-nav gt-xs">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="sessions-nav__link font-label"
            @mouseenter="underline"
            @mouseleave="unUnderline"
          >
            {{ link.label }}
            <span class="sessions-nav__underline" />
          </router-link>
        </nav>

        <q-btn
          class="lt-sm"
          flat
          dense
          round
          :icon="mobileMenuOpen ? 'close' : 'menu'"
          aria-label="Menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </q-toolbar>
    </q-header>

    <Transition :css="false" @enter="onMenuEnter" @leave="onMenuLeave">
      <div v-if="mobileMenuOpen" class="mobile-menu lt-sm">
        <nav ref="mobileMenuNav" class="mobile-menu__nav">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-menu__link font-display"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>
    </Transition>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="sessions-footer font-label">
      <div class="sessions-footer__inner">
        <div>
          <span class="pill-tag pill-tag--outline tilt-left">HOUSTON</span>
        </div>
        <p class="sessions-footer__text">
          Presented by Launchit Studio, in partnership with Impact Hub Houston.
          Independent from the official Claude Community Events series.
        </p>
        <p class="sessions-footer__text sessions-footer__text--muted">
          Anything built during a session may be shared publicly — demo, writeup,
          and eventually source. See the <router-link to="/sessions/framework">Framework</router-link> page for details.
        </p>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import LogoMark from 'components/LogoMark.vue'

const mobileMenuOpen = ref(false)
const mobileMenuNav = ref(null)
const prefersReducedMotion = usePrefersReducedMotion()

// Informal A/B: picked once per full page load (this layout persists across
// client-side route changes within /sessions, so it won't flicker between
// the two while navigating, only a hard refresh re-rolls it).
const logoVariant = Math.random() < 0.5 ? 'L' : 'rocket'

const navLinks = [
  { to: '/sessions/about', label: 'About' },
  { to: '/sessions/framework', label: 'Framework' },
  { to: '/sessions/setup', label: 'Our Set Up' },
  { to: '/sessions/prep', label: 'Prep Artifacts' }
]

function underline (e) {
  const el = e.currentTarget.querySelector('.sessions-nav__underline')
  gsap.to(el, { scaleX: 1, duration: 0.25, ease: 'power2.out' })
}
function unUnderline (e) {
  const el = e.currentTarget.querySelector('.sessions-nav__underline')
  gsap.to(el, { scaleX: 0, duration: 0.2, ease: 'power2.in' })
}

// Full-screen takeover, not a side drawer, so scrolling the page behind it
// while it's open would be a jarring mismatch (menu stays fixed, content
// silently scrolls underneath the blur). Locked for as long as it's open.
watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => { document.body.style.overflow = '' })

function onMenuEnter (el, done) {
  const links = mobileMenuNav.value.querySelectorAll('.mobile-menu__link')
  if (prefersReducedMotion.value) {
    gsap.set(el, { autoAlpha: 1 })
    gsap.set(links, { autoAlpha: 1, y: 0 })
    done()
    return
  }
  gsap.set(links, { autoAlpha: 0, y: 14 })
  gsap.timeline({ onComplete: done })
    .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' })
    .to(links, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, '-=0.1')
}

function onMenuLeave (el, done) {
  if (prefersReducedMotion.value) {
    gsap.set(el, { autoAlpha: 0 })
    done()
    return
  }
  gsap.to(el, { autoAlpha: 0, duration: 0.2, ease: 'power1.in', onComplete: done })
}
</script>

<style lang="scss" scoped>
.sessions-layout {
  background: var(--paper);
  color: var(--navy);
}

.sessions-header {
  background: var(--paper);
  color: var(--navy);
  box-shadow: none;
  border-bottom: 1px solid rgba(62, 124, 166, 0.35);
}

.sessions-toolbar {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 0.75rem 1.5rem;
}

.sessions-wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  color: var(--navy);
  text-decoration: none;
}

.sessions-wordmark__mark {
  flex: none;
}

.sessions-nav {
  display: flex;
  gap: 2rem;
}

.sessions-nav__link {
  position: relative;
  color: var(--navy);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  padding-bottom: 4px;
}

.sessions-nav__underline {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--coral);
  transform: scaleX(0);
  transform-origin: left;
}

.mobile-menu {
  position: fixed;
  // Quasar's q-header sits at z-index: 2000. This has to stay below that,
  // not above it, otherwise it covers the header entirely, including the
  // close button the menu toggle turns into, no way to dismiss it.
  inset: 0;
  z-index: 1900;
  background: rgba(30, 43, 60, 0.88);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.mobile-menu__link {
  color: var(--paper);
  text-decoration: none;
  font-size: clamp(1.5rem, 7vw, 2rem);
  letter-spacing: 0.01em;

  &:active {
    color: var(--coral);
  }
}

.sessions-footer {
  border-top: 1px solid rgba(62, 124, 166, 0.35);
  padding: 2.5rem 1.5rem 3rem;
}

.sessions-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.sessions-footer__text {
  font-size: 0.8rem;
  line-height: 1.6;
  max-width: 640px;
  margin: 0.5rem 0 0;
  opacity: 0.8;

  a {
    color: var(--navy);
  }

  &--muted {
    opacity: 0.6;
  }
}
</style>
