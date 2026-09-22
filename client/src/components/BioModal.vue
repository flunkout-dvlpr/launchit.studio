<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div v-if="modelValue" class="bio-modal">
      <div class="bio-modal__backdrop" @click="close" />
      <div class="bio-modal__panel">
        <button class="bio-modal__close" aria-label="Close" @click="close">×</button>

        <span class="font-label bio-modal__eyebrow">ABOUT</span>
        <h2 class="font-display bio-modal__title">Who's building this.</h2>

        <p class="font-label bio-modal__text">
          I'm a software developer who learned to build by doing. My path hasn't been
          traditional: I began my studies at Texas A&amp;M University, but adjusting to
          a new environment and keeping up with the skills expected to succeed proved
          challenging, which led me to pursue a self-taught path.
        </p>
        <p class="font-label bio-modal__text">
          My first real role was at
          <a href="https://www.cmgl.ca/cmg-news/cmg-announces-the-acquisition-of-early-stage-ai-based-data-analytics-technology-for-maximizing-asset-valuation-and-production-performance-of-shale-reservoirs/" target="_blank" rel="noopener noreferrer">USI (Unconventional Subsurface Integration)</a>,
          an O&amp;G startup, where I had no experience but had to adapt fast. I
          learned to move quickly, experiment, and grow under pressure. I later tried
          freelancing with friends, building projects but realizing the challenges of
          scale and collaboration.
        </p>
        <p class="font-label bio-modal__text">
          A key turning point came when I joined Moneta Tech, a Miami FinTech startup
          aiming to digitize spare change. We got into
          <a href="https://www.forbes.com/sites/yolandabaruch/2023/05/16/bank-of-americas-launches-program-for-underrepresented-entrepreneurs/" target="_blank" rel="noopener noreferrer">Bank of America's Breakthrough Lab</a>,
          received a
          <a href="https://www.flchamber.com/googles-latino-founders-fund-congratulating-miami-winners-largest-in-the-us/" target="_blank" rel="noopener noreferrer">$100k Google Latino Founders Fund scholarship</a>,
          and worked with mentors from the
          <a href="https://www.thevmt.org/" target="_blank" rel="noopener noreferrer">VMT Group</a>.
          We pushed our product to MVP, but ultimately faced the reality of market
          fit — either too big or too small for the clients we could reach.
        </p>
        <p class="font-label bio-modal__text">
          After that, I joined
          <a href="https://www.leftfieldlabs.com/" target="_blank" rel="noopener noreferrer">Left Field Labs</a>,
          a web agency that works on Google projects like
          <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase</a>,
          <a href="https://quantumai.google/" target="_blank" rel="noopener noreferrer">Quantum AI</a>,
          <a href="https://developers.googleblog.com/" target="_blank" rel="noopener noreferrer">Developers Blog</a>,
          <a href="https://summerofcode.withgoogle.com/" target="_blank" rel="noopener noreferrer">GSOC</a>,
          and
          <a href="https://labs.google/" target="_blank" rel="noopener noreferrer">Labs</a>.
          As a Google XWF (External Workforce), I get to work on unique, cutting-edge
          ideas while learning from high standards and scalable design practices.
        </p>
        <p class="font-label bio-modal__text">
          Now, I'm focused on seeing ideas through from start to finish. I want to
          build things that actually get used and have real impact. Money isn't the
          goal — completing something meaningful is. I'm here to reignite the
          excitement for building — just for the sake of building.
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { gsap } from 'boot/gsap'
import { usePrefersReducedMotion } from 'src/composables/usePrefersReducedMotion'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
const prefersReducedMotion = usePrefersReducedMotion()

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

// Locked for as long as the modal is open, same reasoning as
// SessionsLayout's mobile-menu takeover: a fixed overlay with the page
// silently scrolling underneath it would be a jarring mismatch.
watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  }
)
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

function onEnter(el, done) {
  const backdrop = el.querySelector('.bio-modal__backdrop')
  const panel = el.querySelector('.bio-modal__panel')
  if (prefersReducedMotion.value) {
    gsap.set([backdrop, panel], { autoAlpha: 1 })
    gsap.set(panel, { y: 0, scale: 1 })
    done()
    return
  }
  gsap.set(backdrop, { autoAlpha: 0 })
  gsap.set(panel, { autoAlpha: 0, y: 16, scale: 0.97 })
  gsap
    .timeline({ onComplete: done })
    .to(backdrop, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0)
    .to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, 0.05)
}

function onLeave(el, done) {
  const backdrop = el.querySelector('.bio-modal__backdrop')
  const panel = el.querySelector('.bio-modal__panel')
  if (prefersReducedMotion.value) {
    gsap.set([backdrop, panel], { autoAlpha: 0 })
    done()
    return
  }
  gsap
    .timeline({ onComplete: done })
    .to(panel, { autoAlpha: 0, y: 10, scale: 0.98, duration: 0.2, ease: 'power1.in' }, 0)
    .to(backdrop, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, 0)
}
</script>

<style lang="scss" scoped>
.bio-modal {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.bio-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(30, 43, 60, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.bio-modal__panel {
  position: relative;
  max-width: 620px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--paper);
  border-radius: 10px;
  padding: 2.5rem;
  box-shadow: 0 24px 70px rgba(20, 30, 45, 0.4);
}

.bio-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(62, 124, 166, 0.12);
  color: var(--navy);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: var(--coral);
    color: var(--paper);
  }
}

.bio-modal__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.bio-modal__title {
  font-size: clamp(1.4rem, 4vw, 1.8rem);
  font-weight: 600;
  margin: 0.5rem 0 1.25rem;
}

.bio-modal__text {
  font-size: 0.95rem;
  line-height: 1.65;
  opacity: 0.85;
  margin: 0 0 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: var(--coral);
    text-decoration: underline;
    text-decoration-color: rgba(216, 90, 48, 0.35);
    text-underline-offset: 2px;

    &:hover {
      text-decoration-color: var(--coral);
    }
  }
}

@media (max-width: 599px) {
  .bio-modal__panel {
    padding: 2rem 1.5rem;
  }
}
</style>
