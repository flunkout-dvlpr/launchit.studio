<template>
  <q-page class="sessions-home">
    <section class="hero grid-texture">
      <template v-if="SHOW_COLLAGE">
        <CollageClipping
          :src="beSomeone"
          alt="The Be Someone mural over I-45 downtown Houston"
          :rotation="-4"
          cutout
          width="220px"
          accent="tape"
          class="hero__collage hero__collage--left"
        />
        <CollageClipping
          :src="astronaut"
          alt="Astronaut statue at Space Center Houston"
          :rotation="5"
          cutout
          width="190px"
          accent="pin"
          class="hero__collage hero__collage--right"
        />
        <CollageClipping
          :src="weLoveHouston"
          alt="We Love Houston sign at Sesquicentennial Park"
          :rotation="-3"
          cutout
          width="200px"
          accent="tape"
          class="hero__collage hero__collage--bottom"
        />
      </template>

      <div class="hero__inner">
        <span class="pill-tag pill-tag--gold tilt-right">IMPACT HUB · HOUSTON</span>
        <h1 ref="headline" class="font-display hero__title">
          Real Houston ideas.<br />Built live with Claude.
        </h1>
        <p class="font-label hero__hook">
          Launchit Sessions is a recurring build series: each cycle, a Houston
          entrepreneur, business owner, nonprofit, or creator brings a real
          problem, it gets built into a working demo, and it's presented live —
          in the open.
        </p>
        <div class="hero__ctas">
          <q-btn to="/sessions/about" unelevated no-caps label="Why this exists" class="hero__cta-primary font-label" />
          <q-btn to="/sessions/framework" outline no-caps label="See the framework" class="hero__cta-secondary font-label" />
        </div>
      </div>
    </section>

    <section ref="cycleSection" class="current-cycle">
      <div class="current-cycle__inner">
        <span class="font-label current-cycle__eyebrow">
          {{ currentCycle ? 'CURRENT CYCLE' : 'SUBMISSIONS' }}
        </span>

        <div v-if="currentCycle" class="current-cycle__card">
          <span class="pill-tag pill-tag--coral tilt-left">Cycle {{ currentCycle.meta.cycle }}</span>
          <h2 class="font-display current-cycle__title">{{ currentCycle.meta.title }}</h2>
          <p class="font-label current-cycle__business">{{ currentCycle.meta.business }}</p>
          <q-btn
            :to="`/sessions/prep/${currentCycle.meta.slug}`"
            unelevated
            no-caps
            label="Read the prep guide"
            icon-right="arrow_forward"
            class="hero__cta-primary font-label"
          />
        </div>
        <div v-else class="current-cycle__card">
          <h2 class="font-display current-cycle__title">Submissions are open.</h2>
          <p class="font-label current-cycle__business">
            Use cases come in via Impact Hub Houston's LinkedIn or straight from
            you, see the Framework page for how selection works.
          </p>
          <q-btn
            to="/sessions/submit"
            unelevated
            no-caps
            label="Submit a use case"
            icon-right="arrow_forward"
            class="hero__cta-primary font-label"
          />
        </div>
      </div>
    </section>

    <section ref="stepsSection" class="how-it-works">
      <div class="how-it-works__inner">
        <h2 class="font-display">From submission to stage, in three moves.</h2>
        <div class="how-it-works__steps">
          <div v-for="step in steps" :key="step.label" class="step">
            <span class="pill-tag pill-tag--outline">{{ step.label }}</span>
            <p class="font-label step__text">{{ step.text }}</p>
          </div>
        </div>
        <q-btn to="/sessions/framework" flat no-caps label="Full framework →" class="font-label how-it-works__link" />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap, ScrollTrigger, SplitText } from 'boot/gsap'
import { getCurrentCycle } from 'src/utils/prepArtifacts'
import CollageClipping from 'components/CollageClipping.vue'
import beSomeone from 'assets/collage/cutouts/be-someone-mural-cutout.webp'
import astronaut from 'assets/collage/cutouts/space-center-astronaut-cutout.webp'
import weLoveHouston from 'assets/collage/cutouts/we-love-houston-cutout.webp'

// Toggle back on when we revisit the hero collage treatment.
const SHOW_COLLAGE = false

const currentCycle = getCurrentCycle()

const steps = [
  {
    label: 'Source & select',
    text: 'Community ideas come in, get checked against three things, and go to a vote — the community decides what gets built.'
  },
  {
    label: 'Scope & build',
    text: "A call or two fills in any gaps, then it's built into a working demo — or at least a solid concept — inside the cycle window."
  },
  {
    label: 'Present & recap',
    text: "A prep guide goes out, it's presented live at Impact Hub Houston, then a recap closes the loop — and opens the next cycle."
  }
]

const headline = ref(null)
const cycleSection = ref(null)
const stepsSection = ref(null)

onMounted(() => {
  const split = new SplitText(headline.value, { type: 'words' })
  gsap.from(split.words, {
    y: 24,
    autoAlpha: 0,
    rotate: 2,
    duration: 0.7,
    stagger: 0.05,
    ease: 'power3.out'
  })

  gsap.from(cycleSection.value.querySelector('.current-cycle__card'), {
    scrollTrigger: { trigger: cycleSection.value, start: 'top 80%', once: true },
    y: 30,
    autoAlpha: 0,
    duration: 0.7,
    ease: 'power2.out'
  })

  gsap.from(stepsSection.value.querySelectorAll('.step'), {
    scrollTrigger: { trigger: stepsSection.value, start: 'top 75%', once: true },
    y: 24,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out'
  })
})
</script>

<style lang="scss" scoped>
.sessions-home {
  background: var(--paper);
}

.hero {
  position: relative;
  padding: 5rem 1.5rem 4rem;
  overflow: hidden;
}

.hero__collage {
  position: absolute;
  top: 14%;
  z-index: 1;
  pointer-events: none;

  &--left { left: 4%; }
  &--right { right: 4%; top: 22%; }
  &--bottom { top: auto; bottom: 2%; left: 10%; }

  @media (max-width: 1150px) {
    display: none;
  }
}

.hero__inner {
  position: relative;
  z-index: 2;
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
}

.hero__title {
  font-size: clamp(2rem, 5.5vw, 3.5rem);
  font-weight: 600;
  line-height: 1.1;
  margin: 1.25rem 0 1.25rem;

  :deep(.word) {
    display: inline-block;
  }
}

.hero__hook {
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 560px;
  margin: 0 auto 2rem;
  opacity: 0.85;
}

.hero__ctas {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__cta-primary {
  background: var(--navy);
  color: var(--paper);
  padding: 0.7rem 1.4rem;
  border-radius: 4px;
}

.hero__cta-secondary {
  color: var(--navy);
  border: 1.5px solid var(--navy);
  padding: 0.7rem 1.4rem;
  border-radius: 4px;
}

.current-cycle {
  padding: 3rem 1.5rem;
  border-top: 1px solid rgba(62, 124, 166, 0.3);
  border-bottom: 1px solid rgba(62, 124, 166, 0.3);
}

.current-cycle__inner {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.current-cycle__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.current-cycle__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.75rem 0 0.4rem;
}

.current-cycle__business {
  opacity: 0.75;
  margin-bottom: 1.25rem;
}

.how-it-works {
  padding: 4rem 1.5rem 5rem;
}

.how-it-works__inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;

  h2 {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 600;
    margin-bottom: 2.5rem;
  }
}

.how-it-works__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: left;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.step__text {
  margin-top: 0.75rem;
  line-height: 1.55;
  opacity: 0.8;
}

.how-it-works__link {
  color: var(--coral);
  margin-top: 2.5rem;
}
</style>
