<template>
  <q-page v-if="artifact" class="prep-artifact-page">
    <PrepArtifactTemplate :artifact="artifact" />
  </q-page>
  <q-page v-else class="prep-artifact-page prep-artifact-page--missing flex flex-center">
    <div class="text-center">
      <p class="font-label">No prep artifact found for "{{ slug }}".</p>
      <q-btn to="/sessions/prep" flat no-caps label="Back to prep artifacts" class="font-label" />
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import PrepArtifactTemplate from 'components/PrepArtifactTemplate.vue'
import { getPrepArtifactBySlug } from 'src/utils/prepArtifacts'

const props = defineProps({
  slug: { type: String, required: true }
})

const artifact = computed(() => getPrepArtifactBySlug(props.slug))
</script>

<style lang="scss" scoped>
.prep-artifact-page {
  background: var(--paper);
}
</style>
