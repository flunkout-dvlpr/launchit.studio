<template>
  <q-layout view="hHh lpr fFf" class="studio-layout">
    <q-header class="studio-header">
      <q-toolbar class="studio-toolbar">
        <router-link ref="wordmarkEl" to="/" class="studio-wordmark font-label" @click="onLogoClick">
          <LogoMark ref="logoMarkEl" :size="$q.screen.lt.sm ? 40 : 56" class="studio-wordmark__mark" />
          LAUNCHIT <span class="text-weight-bold">STUDIO</span>
        </router-link>

        <q-space />

        <button ref="bioLinkEl" class="studio-bio-trigger font-label" @click="openBio">
          <img :src="bioPhoto" alt="" class="studio-bio-trigger__img" width="36" height="36" />
          Bio
        </button>

        <!-- Sessions + Contact hidden for now — flip these back on when ready. -->
        <nav v-if="false" ref="navEl" class="studio-nav">
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

    <BioModal v-model="bioModalOpen" />

    <footer class="studio-footer font-label">
      <div class="studio-footer__inner">
        <div class="studio-footer__cities">
          <span class="pill-tag pill-tag--outline tilt-left">HOUSTON</span>
          <span class="pill-tag pill-tag--outline tilt-right">MIAMI</span>
          <span class="pill-tag pill-tag--outline tilt-left">NEW YORK</span>
        </div>
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
import BioModal from 'components/BioModal.vue'
import bioPhoto from 'assets/bio-photo.webp'

const $q = useQuasar()
const wordmarkEl = ref(null)
const navEl = ref(null)
const logoMarkEl = ref(null)
const bioLinkEl = ref(null)
const bioModalOpen = ref(false)
const prefersReducedMotion = usePrefersReducedMotion()

onMounted(() => {
  if (prefersReducedMotion.value) return

  const wordmark = wordmarkEl.value?.$el
  if (wordmark) {
    gsap.from(wordmark, { x: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' })
  }
  if (bioLinkEl.value) {
    gsap.from(bioLinkEl.value, { x: 40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' })
  }
  if (navEl.value) {
    gsap.from(navEl.value.children, { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
  }

  // Same auto-play-on-landing rocket flight as SessionsLayout — this layout
  // only ever renders on "/" (its one child route), so no path check needed
  // there, but delayed the same way, to start after the wordmark's own
  // entrance tween above finishes settling rather than clashing with it.
  gsap.delayedCall(0.9, () => flyRocket())
})

function openBio () {
  bioModalOpen.value = true
  trackEvent('bio_modal_open', { location: 'nav' })
}

function underline (e) {
  const el = e.currentTarget.querySelector('.studio-nav__underline')
  gsap.to(el, { scaleX: 1, duration: 0.25, ease: 'power2.out' })
}
function unUnderline (e) {
  const el = e.currentTarget.querySelector('.studio-nav__underline')
  gsap.to(el, { scaleX: 0, duration: 0.2, ease: 'power2.in' })
}

// Ported from SessionsLayout.vue's flyRocket — same clone-and-fly technique
// (see there for the full rationale): the rocket lives inside a small,
// tightly-cropped SVG that can't animate within itself without clipping, so
// a fixed-position clone flies around the viewport and lands back at an
// x/y offset of exactly 0,0 before cleanup.
function flyRocket (onComplete) {
  const rocketEl = logoMarkEl.value?.rocketSvgEl
  if (!rocketEl) {
    onComplete?.()
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
  const path = [
    { x: vw * 0.82 - rect.left, y: vh * 0.18 - rect.top }, // upper right
    { x: vw * 0.1 - rect.left, y: vh * 0.5 - rect.top }, // middle left
    { x: vw * 0.82 - rect.left, y: vh * 0.82 - rect.top }, // lower right
    { x: 0, y: 0 } // back to its own exact starting position
  ]

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.removeChild(clone)
      rocketEl.style.visibility = ''
      onComplete?.()
    }
  })

  tl.to(
    clone,
    {
      // Net baked-in facing direction is -90deg + 30deg = -60deg off +x —
      // see SessionsLayout.vue's flyRocket for the full explanation of
      // where that offset comes from.
      motionPath: { path, curviness: 1.5, autoRotate: 60 },
      duration: 5.6,
      ease: 'sine.inOut'
    },
    0
  )
  tl.to(
    clone,
    { scale: 1.3, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: 1 },
    0
  )
  tl.to(clone, { rotation: 0, duration: 0.25, ease: 'power2.out' })
}

function onLogoClick (e) {
  // Already home (this layout only ever renders "/"), so the click itself
  // doesn't need to navigate anywhere — just replay the flight, same as
  // clicking the Sessions logo while already on /sessions would.
  e.preventDefault()
  if (prefersReducedMotion.value) return
  flyRocket()
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

// Profile-picture-style trigger — opens the bio modal. Avatar + label
// side by side, rather than the underline-hover treatment the (currently
// hidden) text nav links use.
.studio-bio-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--navy);
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--coral);
  }

  &:hover .studio-bio-trigger__img {
    transform: scale(1.08);
  }
}

.studio-bio-trigger__img {
  display: block;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid var(--paper);
  box-shadow: 0 0 0 1.5px rgba(62, 124, 166, 0.5);
  transition: transform 0.2s ease;
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

  .studio-bio-trigger {
    gap: 0.4rem;
    font-size: 0.75rem;
  }

  .studio-bio-trigger__img {
    width: 30px;
    height: 30px;
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

.studio-footer__cities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 0.75rem;
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
