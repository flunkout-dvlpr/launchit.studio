<template>
  <q-page class="setup-page grid-texture">
    <div ref="root" class="setup-page__inner">
      <header class="setup-page__header reveal">
        <span class="pill-tag pill-tag--gold tilt-right">OUR SET UP</span>
        <h1 class="font-display setup-page__title">
          The tools we actually build with.
        </h1>
        <p class="font-label setup-page__intro">
          This comes up before pretty much every session, so it gets its own
          page: what we're actually running when we sit down to build.
        </p>
      </header>

      <section class="reveal">
        <h2 class="font-label setup-page__label">Claude Code + VS Code</h2>
        <p class="font-label setup-page__body">
          For most of what happens during a session, our day-to-day setup is
          genuinely simple: Claude Code running inside VS Code. If you want to
          follow along, or try building something of your own afterward, this
          is the fastest way to get going &mdash; no deeper toolchain required
          to start.
        </p>
        <div class="setup-page__links">
          <a class="setup-page__link font-label" href="https://code.visualstudio.com" target="_blank" rel="noopener">
            VS Code ↗
          </a>
          <a class="setup-page__link font-label" href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener">
            Claude Code extension ↗
          </a>
          <a class="setup-page__link font-label" href="https://docs.claude.com" target="_blank" rel="noopener">
            Claude Code docs ↗
          </a>
        </div>
      </section>

      <div class="dimension-line" />

      <section class="reveal">
        <h2 class="font-label setup-page__label">What's a CLAUDE.md file?</h2>
        <p class="font-label setup-page__body">
          CLAUDE.md is a plain text file that sits in a project's folder. It's
          how you give Claude Code standing context about that project: what
          it does, how it's put together, conventions to follow, things to
          avoid. Claude Code reads it automatically, so you're not
          re-explaining the same background every time you start a new chat.
          It's the closest thing our setup has to a "settings file" for how
          Claude should treat a given project.
        </p>
      </section>

      <div class="dimension-line" />

      <section class="reveal setup-page__advanced">
        <span class="pill-tag pill-tag--coral tilt-left">ADVANCED</span>
        <p class="font-label setup-page__advanced-note">
          None of this is required to attend or submit an idea &mdash; it's
          here for anyone curious what's actually running underneath a build.
        </p>
        <h2 class="font-label setup-page__label">What we deploy with</h2>
        <p class="font-label setup-page__body">
          For projects that need to actually run somewhere, not just live in a
          chat, we lean toward a specific stack: Vue.js and Quasar for the
          frontend, and AWS SAM (Serverless Application Model) for deployment,
          run mostly through the AWS CLI with a configured set of credentials.
        </p>
        <span class="pill-tag pill-tag--outline setup-page__cost-badge">UNDER $5/MONTH PER PROJECT</span>
        <div class="setup-page__links">
          <a class="setup-page__link font-label" href="https://vuejs.org" target="_blank" rel="noopener">
            Vue.js ↗
          </a>
          <a class="setup-page__link font-label" href="https://quasar.dev" target="_blank" rel="noopener">
            Quasar ↗
          </a>
          <a class="setup-page__link font-label" href="https://aws.amazon.com/serverless/sam/" target="_blank" rel="noopener">
            AWS SAM ↗
          </a>
        </div>
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
.setup-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.setup-page__inner {
  max-width: 680px;
  margin: 0 auto;
}

.setup-page__header {
  margin-bottom: 2.5rem;
}

.setup-page__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.setup-page__intro {
  opacity: 0.75;
  line-height: 1.6;
}

.setup-page__label {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
  margin: 0 0 0.75rem;
}

.setup-page__body {
  line-height: 1.7;
  margin: 0 0 1rem;
}

.setup-page__links {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.setup-page__link {
  font-size: 0.85rem;
  color: var(--coral);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.setup-page__advanced {
  border: 1px dashed rgba(62, 124, 166, 0.4);
  border-radius: 6px;
  padding: 1.5rem;
}

.setup-page__advanced-note {
  font-size: 0.85rem;
  opacity: 0.65;
  line-height: 1.6;
  margin: 0.75rem 0 1.25rem;
}

.setup-page__cost-badge {
  display: inline-block;
  margin: 0 0 1.25rem;
}
</style>
