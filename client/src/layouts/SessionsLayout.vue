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
          <LogoMark
            ref="logoMarkEl"
            :size="75"
            class="sessions-wordmark__mark"
          />
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
        </p>
        <p class="sessions-footer__text sessions-footer__text--muted">
          Anything built during a session may be shared publicly — demo,
          writeup, and eventually source. See the
          <router-link to="/sessions/framework">Framework</router-link> page for
          details.
        </p>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "boot/gsap";
import { usePrefersReducedMotion } from "src/composables/usePrefersReducedMotion";
import LogoMark from "components/LogoMark.vue";

const router = useRouter();
const mobileMenuOpen = ref(false);
const mobileMenuNav = ref(null);
const wordmarkEl = ref(null);
const navEl = ref(null);
const logoMarkEl = ref(null);
const prefersReducedMotion = usePrefersReducedMotion();

onMounted(() => {
  if (prefersReducedMotion.value) return;

  // router-link is a component, not a plain element — .$el is the actual
  // rendered <a> tag GSAP needs to animate.
  const wordmark = wordmarkEl.value?.$el;
  if (wordmark) {
    gsap.from(wordmark, {
      x: -40,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }

  if (navEl.value) {
    const links = navEl.value.querySelectorAll(".sessions-nav__link");
    gsap.from(links, {
      x: 40,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
    });
  }

  // Auto-play the flight once on a real landing on the Sessions home page
  // itself (not sub-pages, and not on internal nav between them, since this
  // layout stays mounted across those, onMounted only fires on a fresh
  // entry into the /sessions section). Delayed to start after the wordmark's
  // own entrance tween above finishes settling, firing at the same time
  // would both clash visually and read rocketEl's position mid-transform.
  if (router.currentRoute.value.path === "/sessions") {
    gsap.delayedCall(0.9, () => flyRocket());
  }
});

const navLinks = [
  { to: "/sessions/about", label: "About" },
  { to: "/sessions/framework", label: "Framework" },
  { to: "/sessions/restaurant", label: "The Restaurant" },
  { to: "/sessions/setup", label: "Our Set Up" },
  { to: "/sessions/prep", label: "Prep Artifacts" },
];

function underline(e) {
  const el = e.currentTarget.querySelector(".sessions-nav__underline");
  gsap.to(el, { scaleX: 1, duration: 0.25, ease: "power2.out" });
}
function unUnderline(e) {
  const el = e.currentTarget.querySelector(".sessions-nav__underline");
  gsap.to(el, { scaleX: 0, duration: 0.2, ease: "power2.in" });
}

// Full-screen takeover, not a side drawer, so scrolling the page behind it
// while it's open would be a jarring mismatch (menu stays fixed, content
// silently scrolls underneath the blur). Locked for as long as it's open.
watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

function onMenuEnter(el, done) {
  const links = mobileMenuNav.value.querySelectorAll(".mobile-menu__link");
  if (prefersReducedMotion.value) {
    gsap.set(el, { autoAlpha: 1 });
    gsap.set(links, { autoAlpha: 1, y: 0 });
    done();
    return;
  }
  gsap.set(links, { autoAlpha: 0, y: 14 });
  gsap
    .timeline({ onComplete: done })
    .fromTo(
      el,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, ease: "power1.out" }
    )
    .to(
      links,
      { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      "-=0.1"
    );
}

function onMenuLeave(el, done) {
  if (prefersReducedMotion.value) {
    gsap.set(el, { autoAlpha: 0 });
    done();
    return;
  }
  gsap.to(el, {
    autoAlpha: 0,
    duration: 0.2,
    ease: "power1.in",
    onComplete: done,
  });
}

// The grid stays put, the rocket flies around the viewport and lands back
// in its exact starting spot before actually navigating (or, for the
// auto-play-on-landing case, before just settling back into place with
// nowhere to navigate to). The rocket lives inside a small, tightly-cropped
// SVG in the header, too small to animate within directly (it'd just clip
// at the SVG's own edges). Instead: clone the rocket's <svg>, pin the clone
// at the original's exact screen position (position: fixed, so the swap is
// invisible), hide the real one, fly the clone around, then land it back at
// an x/y offset of exactly 0,0 (its own starting position) before cleaning
// up and, if given one, calling onComplete.
function flyRocket(onComplete) {
  const rocketEl = logoMarkEl.value?.rocketSvgEl;
  if (!rocketEl) {
    onComplete?.();
    return;
  }

  const rect = rocketEl.getBoundingClientRect();
  const clone = rocketEl.cloneNode(true);
  Object.assign(clone.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    zIndex: 4000,
    pointerEvents: "none",
  });
  document.body.appendChild(clone);
  rocketEl.style.visibility = "hidden";

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Points as viewport percentages, converted into an x/y offset from the
  // clone's own fixed starting position (it's pinned via position:fixed,
  // so a GSAP translate on top of that is what moves it around the
  // screen). The previous version visited all four quadrants and closed
  // back on itself, which smooths into a loop/circle. A true S reads as
  // an alternating left-right-left sweep down the page instead, no
  // quadrant gets revisited, so it can't round off into a closed shape.
  const path = [
    { x: vw * 0.82 - rect.left, y: vh * 0.18 - rect.top }, // upper right
    { x: vw * 0.1 - rect.left, y: vh * 0.5 - rect.top }, // middle left
    { x: vw * 0.82 - rect.left, y: vh * 0.82 - rect.top }, // lower right
    { x: 0, y: 0 }, // back to its own exact starting position
  ];

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.removeChild(clone);
      rocketEl.style.visibility = "";
      onComplete?.();
    },
  });

  tl.to(
    clone,
    {
      // autoRotate's default (true === 0) assumes the artwork's "forward"
      // points along the local +x axis. This rocket's nose is drawn
      // pointing toward local -y (path starts at "M 0,-13", the tip), then
      // the inner <g> in LogoMark.vue applies a further fixed rotate(30).
      // Net baked-in facing direction is -90deg + 30deg = -60deg off of
      // +x, so that's the offset autoRotate needs to actually align the
      // nose (not just the raw element box) with the path tangent.
      motionPath: { path, curviness: 1.5, autoRotate: 60 },
      duration: 5.6,
      ease: "sine.inOut",
    },
    0
  );
  // Gentle scale pulse in parallel with the flight, independent of the
  // position/rotation curve above, GSAP composes transforms from
  // separate tweens on the same element fine.
  tl.to(
    clone,
    {
      scale: 1.3,
      duration: 1.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    },
    0
  );
  // autoRotate's final angle is whatever the path's tangent happens to be
  // at the last point, not necessarily 0, but the static header rocket
  // it swaps back to has no extra rotation. Quick settle to match.
  tl.to(clone, { rotation: 0, duration: 0.25, ease: "power2.out" });
}

function onLogoClick(e) {
  e.preventDefault();

  function goHome() {
    if (router.currentRoute.value.path !== "/sessions")
      router.push("/sessions");
  }

  if (prefersReducedMotion.value) {
    goHome();
    return;
  }

  flyRocket(goHome);
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
