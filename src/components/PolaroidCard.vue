<template>
  <div 
    ref="cardRef"
    class="polaroid-card" 
    :class="{ 
      'is-visible': isVisible,
      'tilt-left': isEven, 
      'tilt-right': !isEven 
    }"
  >
    <!-- Washi Tape Scrapbook Accent -->
    <div class="washi-tape"></div>

    <!-- Polaroid Photo Frame -->
    <div class="photo-wrapper">
      <img 
        :src="imageUrl" 
        :alt="'Memory photo ' + (index !== undefined ? index + 1 : '')" 
        class="photo-img"
        loading="lazy"
        draggable="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import VanillaTilt from 'vanilla-tilt'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

// Elements & State
const cardRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  // Intersection Observer for scroll reveal
  if (typeof IntersectionObserver !== 'undefined' && cardRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (observer && cardRef.value) {
              observer.unobserve(cardRef.value)
            }
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    )
    observer.observe(cardRef.value)
  } else {
    isVisible.value = true
  }

  // Initialize Vanilla Tilt 3D effect (only on hover-capable devices)
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
  if (cardRef.value && !isTouchDevice) {
    VanillaTilt.init(cardRef.value, {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      scale: 1.04,
      perspective: 1000
    })
  }
})

onUnmounted(() => {
  if (observer && cardRef.value) {
    observer.disconnect()
  }
  if (cardRef.value && cardRef.value.vanillaTilt) {
    cardRef.value.vanillaTilt.destroy()
  }
})

// Calculate rotation based on index
const isEven = computed(() => {
  return props.index % 2 === 0
})
</script>

<style scoped>
.polaroid-card {
  position: relative;
  background-color: var(--polaroid-bg, #ffffff);
  /* Classic authentic Polaroid padding: equal top & sides, thicker bottom */
  padding: 10px 10px 36px 10px;
  border-radius: 6px;
  box-shadow: var(--polaroid-shadow, 0 12px 28px rgba(74, 64, 54, 0.12), 0 4px 10px rgba(74, 64, 54, 0.06));
  width: 100%;
  max-width: 290px;
  box-sizing: border-box;
  margin: 0 auto;
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(220, 207, 189, 0.35);
  z-index: 1;
  transform-style: preserve-3d;

  /* Scroll Reveal Initial State */
  opacity: 0;
  transform: translateY(60px) scale(0.96);
  transition: 
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s ease,
    z-index 0.35s ease;
  will-change: transform, opacity;
}

@media (min-width: 640px) {
  .polaroid-card {
    max-width: 340px;
    padding: 14px 14px 46px 14px;
  }
}

/* Scroll Reveal Visible State (Resting Tilt) */
.polaroid-card.is-visible.tilt-left {
  opacity: 1;
  transform: translateY(0) rotate(-2deg) scale(1);
}

.polaroid-card.is-visible.tilt-right {
  opacity: 1;
  transform: translateY(0) rotate(1.5deg) scale(1);
}

/* Hover Effect (Lifting & Straightening) */
.polaroid-card.is-visible:hover {
  transform: scale(1.05) rotate(0deg) translateY(-8px) !important;
  box-shadow: 0 22px 40px rgba(74, 64, 54, 0.18), 0 8px 16px rgba(74, 64, 54, 0.08);
  z-index: 10;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
}

/* Washi Tape Scrapbook Accent */
.washi-tape {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(-1deg) translateZ(10px);
  width: 80px;
  height: 22px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.75));
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  opacity: 0.85;
  pointer-events: none;
  z-index: 2;
}

/* Photo Wrapper */
.photo-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: var(--bg-secondary, #F3EAE3);
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  transform: translateZ(5px);
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.polaroid-card:hover .photo-img {
  transform: scale(1.03);
}
</style>
