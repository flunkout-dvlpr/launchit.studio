<template>
  <q-page class="submit-page grid-texture">
    <div ref="root" class="submit-page__inner">
      <header class="submit-page__header reveal">
        <span class="pill-tag pill-tag--gold tilt-right">SUBMIT A USE CASE</span>
        <h1 class="font-display submit-page__title">
          Got a real problem worth building?
        </h1>
        <p class="font-label submit-page__intro">
          Tell us what it is. No pitch deck, no polish needed, just the actual
          thing you wish you didn't have to do by hand. See the
          <router-link to="/sessions/framework" class="submit-page__inline-link">Framework page</router-link>
          for how submissions get vetted and selected.
        </p>
      </header>

      <form v-if="!submitted" class="submit-page__form reveal" @submit.prevent="handleSubmit">
        <div class="submit-field">
          <label class="font-label submit-field__label" for="name">Your name *</label>
          <input id="name" v-model="form.name" class="submit-field__input font-label" type="text" required />
        </div>

        <div class="submit-field">
          <label class="font-label submit-field__label" for="business">Business, organization, or project name</label>
          <input id="business" v-model="form.business" class="submit-field__input font-label" type="text" />
        </div>

        <div class="submit-field submit-field--split">
          <div class="submit-field">
            <label class="font-label submit-field__label" for="email">Email *</label>
            <input id="email" v-model="form.email" class="submit-field__input font-label" type="email" required />
          </div>
          <div class="submit-field">
            <label class="font-label submit-field__label" for="phone">Phone (optional)</label>
            <input id="phone" v-model="phoneDisplay" class="submit-field__input font-label" type="tel" placeholder="(000) - 000 - 0000" />
          </div>
        </div>

        <div class="submit-field">
          <label class="font-label submit-field__label" for="problem">What's the problem or task you'd want built? *</label>
          <p class="submit-field__hint font-label">Plain language is fine, this doesn't need to sound technical.</p>
          <textarea id="problem" v-model="form.problem" class="submit-field__textarea font-label" rows="3" required />
        </div>

        <div class="submit-field">
          <label class="font-label submit-field__label" for="why">Why does this matter right now?</label>
          <p class="submit-field__hint font-label">How much time, money, or stress does this actually cost you today?</p>
          <textarea id="why" v-model="form.why" class="submit-field__textarea font-label" rows="3" />
        </div>

        <div class="submit-field">
          <label class="font-label submit-field__label" for="tools">What tools or accounts would this need to connect to, if any?</label>
          <p class="submit-field__hint font-label">E.g. Gmail, Square, Shopify, a spreadsheet, or "none, it's a standalone site." Helps us scope setup time before the session.</p>
          <input id="tools" v-model="form.tools" class="submit-field__input font-label" type="text" />
        </div>

        <div class="submit-field">
          <label class="font-label submit-field__label" for="sensitive">Anything sensitive we should know upfront?</label>
          <p class="submit-field__hint font-label">Real customer data, financials, anything not okay to build with in the open. What gets built is usually shared publicly, see the Framework page's disclosure.</p>
          <textarea id="sensitive" v-model="form.sensitive" class="submit-field__textarea font-label" rows="2" />
        </div>

        <label class="submit-field__checkbox font-label">
          <input v-model="form.canCommit" type="checkbox" required />
          I can commit to two ~1-hour scoping calls and presenting live at the event. *
        </label>

        <button class="submit-page__submit font-label" type="submit" :disabled="!isValid">
          Send this in →
        </button>

        <p class="submit-page__note font-label">
          This opens your email app with everything above filled in, nothing is
          stored on our end until you actually hit send.
        </p>
      </form>

      <div v-else class="submit-page__done reveal">
        <h2 class="font-display submit-page__done-title">Your email app should be open.</h2>
        <p class="font-label submit-page__done-body">
          Everything you filled in is already in the message, just hit send.
          If nothing opened, email us directly at
          <a href="mailto:hello@launchit.studio" class="submit-page__inline-link">hello@launchit.studio</a>.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'

const root = ref(null)
const submitted = ref(false)

const form = reactive({
  name: '',
  business: '',
  email: '',
  phone: '',
  problem: '',
  why: '',
  tools: '',
  sensitive: '',
  canCommit: false
})

const isValid = computed(() => {
  return Boolean(form.name && form.email && form.problem && form.canCommit)
})

function formatPhone (raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits.length ? `(${digits}` : ''
  if (digits.length < 7) return `(${digits.slice(0, 3)}) - ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) - ${digits.slice(3, 6)} - ${digits.slice(6)}`
}

const phoneDisplay = computed({
  get: () => form.phone,
  set: (value) => { form.phone = formatPhone(value) }
})

function handleSubmit () {
  if (!isValid.value) return

  const subject = `Session idea: ${form.name}`
  const bodyLines = [
    `Name: ${form.name}`,
    `Business/organization: ${form.business || '(not provided)'}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone || '(not provided)'}`,
    '',
    "What problem or task would you want built?",
    form.problem,
    '',
    'Why does this matter right now?',
    form.why || '(not provided)',
    '',
    'Tools/accounts this would need to connect to:',
    form.tools || '(not provided)',
    '',
    'Anything sensitive we should know upfront?',
    form.sensitive || '(not provided)',
    '',
    'Can commit to two scoping calls and presenting live: Yes'
  ]

  const mailto = `mailto:hello@launchit.studio?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
  window.location.href = mailto
  submitted.value = true
}

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
.submit-page {
  background: var(--paper);
  padding: 4rem 1.5rem 5rem;
}

.submit-page__inner {
  max-width: 620px;
  margin: 0 auto;
}

.submit-page__header {
  margin-bottom: 2.5rem;
}

.submit-page__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.submit-page__intro {
  opacity: 0.75;
  line-height: 1.6;
}

.submit-page__inline-link {
  color: var(--coral);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.submit-page__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.submit-field--split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 0;
  border: none;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.submit-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.submit-field__label {
  font-size: 0.85rem;
  font-weight: 600;
}

.submit-field__hint {
  font-size: 0.8rem;
  opacity: 0.6;
  line-height: 1.5;
  margin: -0.15rem 0 0.15rem;
}

.submit-field__input,
.submit-field__textarea {
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--navy);
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(30, 43, 60, 0.25);
  padding: 0.5rem 0.1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-bottom-color: var(--coral);
  }
}

.submit-field__checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.9rem;
  line-height: 1.5;
  cursor: pointer;

  input {
    margin-top: 0.2rem;
  }
}

.submit-page__submit {
  align-self: flex-start;
  background: var(--coral);
  color: var(--paper);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.85;
  }
}

.submit-page__note {
  font-size: 0.8rem;
  opacity: 0.55;
  line-height: 1.5;
}

.submit-page__done-title {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.submit-page__done-body {
  line-height: 1.6;
  opacity: 0.8;
}
</style>
