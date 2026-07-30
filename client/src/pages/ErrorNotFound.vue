<template>
  <div class="not-found fullscreen text-center q-pa-md flex flex-center">
    <div>
      <div class="font-display not-found__code">404</div>
      <div class="font-label not-found__text">Nothing here — wrong turn.</div>
      <q-btn
        class="q-mt-xl font-label not-found__cta"
        unelevated
        no-caps
        to="/sessions"
        label="Back to Sessions"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>

<style lang="scss" scoped>
.not-found {
  background: var(--paper);
  color: var(--navy);
}

.not-found__code {
  font-size: 22vh;
  font-weight: 600;
  line-height: 1;
}

.not-found__text {
  font-size: 1.1rem;
  opacity: 0.6;
}

.not-found__cta {
  background: var(--navy);
  color: var(--paper);
  padding: 0.7rem 1.4rem;
  border-radius: 4px;
}
</style>
