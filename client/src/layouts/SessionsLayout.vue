<template>
  <q-layout view="hHh lpr fFf" class="sessions-layout">
    <q-header class="sessions-header">
      <q-toolbar class="sessions-toolbar">
        <router-link
          ref="wordmarkEl"
          to="/sessions"
          class="sessions-wordmark font-label"
          @click="onLogoClick"
        >
          <LogoMark ref="logoMarkEl" :size="75" class="sessions-wordmark__mark" />
          LAUNCHIT <span class="text-weight-bold">SESSIONS</span>
        </router-link>

        <q-space />

        <nav ref="navEl" class="sessions-nav gt-xs">
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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'
import LogoMark from 'components/LogoMark.vue'

const router = useRouter()
const mobileMenuOpen = ref(false)
const mobileMenuNav = ref(null)
const wordmarkEl = ref(null)
const navEl = ref(null)
const logoMarkEl = ref(null)
const prefersReducedMotion = usePrefersReducedMotion()

onMounted(() => {
  if (prefersReducedMotion.value) return

  // router-link is a component, not a plain element — .$el is the actual
  // rendered <a> tag GSAP needs to animate.
  const wordmark = wordmarkEl.value?.$el
  if (wordmark) {
    gsap.from(wordmark, { x: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' })
  }

  if (navEl.value) {
    const links = navEl.value.querySelectorAll('.sessions-nav__link')
    gsap.from(links, { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
  }
})

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

// The grid stays put, the rocket flies around the viewport and lands back
// in its exact starting spot before actually navigating. The rocket lives
// inside a small, tightly-cropped SVG in the header, too small to animate
// within directly (it'd just clip at the SVG's own edges). Instead: clone
// the rocket's <svg>, pin the clone at the original's exact screen
// position (position: fixed, so the swap is invisible), hide the real one,
// fly the clone around, then land it back at an x/y offset of exactly 0,0
// (its own starting position) before cleaning up and navigating.
function onLogoClick (e) {
  const rocketEl = logoMarkEl.value?.rocketSvgEl
  if (!rocketEl) return // no rocket found, just let the link navigate normally

  e.preventDefault()

  function goHome () {
    if (router.currentRoute.value.path !== '/sessions') router.push('/sessions')
  }

  if (prefersReducedMotion.value) {
    goHome()
    return
  }

  const rect = rocketEl.getBoundingClientRect()
  const clone = rocketEl.cloneNode(true)
  Object.assign(clone.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    zIndex: 4000,
    pointerEvents: 'none'
  })
  document.body.appendChild(clone)
  rocketEl.style.visibility = 'hidden'

  const vw = window.innerWidth
  const vh = window.innerHeight
  // Waypoints as viewport percentages, converted below into an x/y offset
  // from the clone's own fixed starting position, since it's pinned via
  // position:fixed, a GSAP x/y translate on top of that is what actually
  // moves it around the screen.
  const waypoints = [
    { xPct: 0.18, yPct: 0.22, rotation: 120 },
    { xPct: 0.82, yPct: 0.16, rotation: 250 },
    { xPct: 0.78, yPct: 0.7, rotation: 20 },
    { xPct: 0.22, yPct: 0.72, rotation: -140 },
    { home: true, rotation: 0 }
  ]

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.removeChild(clone)
      rocketEl.style.visibility = ''
      goHome()
    }
  })

  waypoints.forEach((point) => {
    const targetX = point.home ? 0 : (vw * point.xPct) - rect.left
    const targetY = point.home ? 0 : (vh * point.yPct) - rect.top
    tl.to(clone, {
      x: targetX,
      y: targetY,
      rotation: point.rotation,
      scale: point.home ? 1 : 1.3,
      duration: point.home ? 0.5 : 0.45,
      ease: point.home ? 'back.out(1.7)' : 'power1.inOut'
    })
  })
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
  padding: 0 1.5rem;
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
