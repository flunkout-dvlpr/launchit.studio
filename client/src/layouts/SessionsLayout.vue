<template>
  <q-layout view="hHh lpr fFf" class="sessions-layout">
    <q-header class="sessions-header">
      <q-toolbar class="sessions-toolbar">
        <router-link to="/sessions" class="sessions-wordmark font-label">
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
          icon="menu"
          aria-label="Menu"
          @click="drawerOpen = !drawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" side="right" overlay class="lt-sm">
      <q-list>
        <q-item
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          clickable
          @click="drawerOpen = false"
        >
          <q-item-section class="font-label">{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
import { ref } from 'vue'
import { gsap } from 'boot/gsap'

const drawerOpen = ref(false)

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
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  color: var(--navy);
  text-decoration: none;
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
