<template>
  <div
    v-if="src"
    ref="root"
    class="collage-clipping"
    :style="{ '--rotate': rotation + 'deg', width: width }"
  >
    <img
      :src="src"
      :alt="alt"
      class="collage-clipping__img"
      :class="cutout ? '' : `collage-clipping__img--v${variant}`"
    />
    <div v-if="accent === 'tape'" class="collage-clipping__tape" />
    <div v-if="accent === 'pin'" class="collage-clipping__pin" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from 'boot/gsap'

// Houston collage-clipping motif — brand-identity.md "Houston iconography" section.
// Torn-edge photo, slight rotation, physical-media accent (tape/pin).
// Renders nothing when no src is supplied — ready to receive real event
// photography without further dev work.
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  rotation: { type: Number, default: () => Math.round((Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1)) },
  accent: { type: String, default: 'tape' }, // 'tape' | 'pin' | 'none'
  width: { type: String, default: '260px' },
  // 3 distinct torn-paper silhouettes so multiple clippings on one page
  // don't share an identical edge — that reads as stamped, not hand-torn.
  variant: { type: Number, default: () => Math.ceil(Math.random() * 3) },
  // True when `src` is already a pre-cut PNG/WebP with a real irregular alpha
  // edge (cut in an image editor) — skips the CSS clip-path entirely so the
  // drop-shadow and rotation wrap the actual cutout shape, not a generic box.
  cutout: { type: Boolean, default: false }
})

const root = ref(null)
let trigger

onMounted(() => {
  if (!props.src || !root.value) return
  gsap.set(root.value, { autoAlpha: 0, scale: 0.85, rotate: 0, transformOrigin: '50% 50%' })
  trigger = ScrollTrigger.create({
    trigger: root.value,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(root.value, {
        autoAlpha: 1,
        scale: 1,
        rotate: props.rotation,
        duration: 0.9,
        ease: 'back.out(1.6)'
      })
    }
  })
})

onBeforeUnmount(() => {
  trigger && trigger.kill()
})
</script>

<style lang="scss" scoped>
.collage-clipping {
  position: relative;
  display: inline-block;
  max-width: 100%;
  transform: rotate(var(--rotate, 3deg));
  filter: drop-shadow(0 6px 10px rgba(30, 43, 60, 0.28));
}

.collage-clipping__img {
  display: block;
  width: 100%;
  height: auto;

  // Three distinct torn-paper silhouettes, picked per-instance.
  // Skipped entirely when `cutout` is set — the image's own alpha edge
  // is the shape, and the drop-shadow on .collage-clipping wraps it.
  &--v1 {
    clip-path: polygon(
      2% 4%, 12% 0%, 27% 3%, 41% 0%, 58% 2%, 74% 0%, 89% 3%, 100% 1%,
      98% 14%, 100% 29%, 97% 44%, 100% 61%, 98% 77%, 100% 92%,
      88% 100%, 73% 97%, 59% 100%, 44% 98%, 30% 100%, 15% 97%, 3% 100%,
      0% 86%, 3% 70%, 0% 55%, 2% 40%, 0% 24%, 3% 10%
    );
  }

  &--v2 {
    clip-path: polygon(
      0% 8%, 8% 2%, 20% 6%, 33% 0%, 47% 4%, 61% 1%, 76% 5%, 90% 0%, 100% 6%,
      100% 22%, 95% 35%, 100% 48%, 96% 63%, 100% 78%, 97% 90%, 100% 100%,
      85% 96%, 70% 100%, 55% 95%, 40% 100%, 25% 97%, 10% 100%, 0% 93%,
      4% 80%, 0% 66%, 5% 52%, 0% 38%, 6% 24%
    );
  }

  &--v3 {
    clip-path: polygon(
      4% 0%, 18% 5%, 30% 1%, 44% 6%, 55% 2%, 68% 7%, 82% 3%, 96% 8%, 100% 18%,
      94% 30%, 100% 42%, 93% 55%, 100% 68%, 95% 80%, 100% 94%, 88% 100%,
      76% 94%, 62% 100%, 50% 96%, 36% 100%, 22% 93%, 8% 100%, 0% 88%,
      3% 74%, 0% 60%, 4% 46%, 0% 32%, 3% 16%
    );
  }
}

.collage-clipping__tape {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 64px;
  height: 22px;
  transform: translateX(-50%) rotate(-4deg);
  background: rgba(244, 240, 230, 0.55);
  border: 1px solid rgba(30, 43, 60, 0.12);
  box-shadow: 0 2px 4px rgba(30, 43, 60, 0.15);
}

.collage-clipping__pin {
  position: absolute;
  top: 6px;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: var(--coral);
  box-shadow: 0 2px 3px rgba(30, 43, 60, 0.4);
}
</style>
