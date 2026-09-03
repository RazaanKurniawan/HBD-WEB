<template>
  <div class="funny-reveal-section">
    <div class="reveal-header">
      <div class="reveal-badge">
        <span>🙈</span>
        <span>Secret Memory Alert</span>
      </div>
      <h2 class="reveal-title">ada satu memori rahasia ni xixixi</h2>
      <p class="reveal-prompt">
        berani buka? <strong class="highlight-action">(tahan layarnya yaa) 👇</strong>
      </p>
    </div>

    <!-- Polaroid Card Container with Hold-to-Reveal -->
    <div 
      class="polaroid-reveal-card"
      :class="{ 'is-revealed': isHolding }"
      @mousedown="startReveal"
      @mouseup="stopReveal"
      @mouseleave="stopReveal"
      @touchstart.passive="startReveal"
      @touchend="stopReveal"
      @touchcancel="stopReveal"
    >
      <!-- Washi Tape Scrapbook Accent -->
      <div class="washi-tape"></div>

      <!-- Photo Frame with Blur Filter Overlay -->
      <div class="photo-frame">
        <img 
          :src="photoUrl" 
          alt="Foto Bocil Rahasia" 
          class="funny-img"
          :class="{ 'unblurred': isHolding }"
          draggable="false"
        />

        <!-- Frosted Glass Holding Prompt Overlay -->
        <div class="frost-overlay" :class="{ 'hidden-overlay': isHolding }">
          <div class="lock-pulse-icon">🔒</div>
          <span class="frost-text">Tahan di sini buat ngintip 🙈</span>
          <span class="frost-subtext">Lepas untuk menyembunyikan lagi</span>
        </div>
      </div>

      <!-- Handwritten Romantic/Playful Caption -->
      <div class="caption-area">
        <p class="caption-text">
          gemes bgt sihh muka kamu pas bocil wkwk, tetep sayang kokk ❤️
        </p>
        <span class="caption-date">bocil era 👶</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import aibImage from '../assets/images/AIB.jpg'

const isHolding = ref(false)
const photoUrl = ref(aibImage)

const startReveal = () => {
  isHolding.value = true
}

const stopReveal = () => {
  isHolding.value = false
}
</script>

<style scoped>
.funny-reveal-section {
  width: 100%;
  max-width: 580px;
  margin: 50px auto 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  padding: 0 16px;
}

.reveal-header {
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.reveal-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--bg-secondary, #F3EAE3);
  border: 1px dashed var(--accent-color, #D4A373);
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-color, #D4A373);
  text-transform: uppercase;
}

.reveal-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.15;
}

.reveal-prompt {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.95rem;
  color: var(--text-muted, #8A7E72);
}

.highlight-action {
  color: var(--accent-color, #D4A373);
}

/* ================= Polaroid Card ================= */
.polaroid-reveal-card {
  position: relative;
  width: 100%;
  max-width: 350px;
  background-color: var(--polaroid-bg, #ffffff);
  padding: 14px 14px 28px 14px;
  border-radius: 6px;
  box-shadow: 0 16px 36px rgba(74, 64, 54, 0.14), 0 4px 10px rgba(74, 64, 54, 0.06);
  border: 1px solid rgba(220, 207, 189, 0.4);
  cursor: pointer;
  transform: rotate(-1.5deg);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  touch-action: none;
}

.polaroid-reveal-card:hover {
  transform: rotate(0deg) scale(1.03) translateY(-4px);
  box-shadow: 0 20px 42px rgba(74, 64, 54, 0.18);
}

.polaroid-reveal-card.is-revealed {
  transform: rotate(0deg) scale(1.05) translateY(-6px);
  box-shadow: 0 24px 48px rgba(74, 64, 54, 0.22);
}

/* Washi Tape Scrapbook Accent */
.washi-tape {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(0.8deg);
  width: 84px;
  height: 22px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.75));
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  pointer-events: none;
  z-index: 5;
}

/* Photo Frame & Blur */
.photo-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--bg-secondary, #F3EAE3);
}

.funny-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: blur(24px) grayscale(40%);
  transform: scale(1.1);
  transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s ease;
}

.funny-img.unblurred {
  filter: blur(0px) grayscale(0%);
  transform: scale(1.02);
}

/* Frosted Overlay */
.frost-overlay {
  position: absolute;
  inset: 0;
  background: rgba(250, 246, 240, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  text-align: center;
  transition: opacity 0.35s ease, visibility 0.35s ease;
  pointer-events: none;
}

.frost-overlay.hidden-overlay {
  opacity: 0;
  visibility: hidden;
}

.lock-pulse-icon {
  font-size: 2rem;
  animation: bounceLock 1.8s infinite ease-in-out;
}

.frost-text {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.2;
}

.frost-subtext {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.75rem;
  color: var(--text-muted, #8A7E72);
}

/* Caption Area */
.caption-area {
  margin-top: 14px;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.caption-text {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.4rem;
  line-height: 1.3;
  color: var(--text-main, #4A4036);
  font-weight: 600;
  text-align: center;
}

.caption-date {
  align-self: flex-end;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted, #8A7E72);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@keyframes bounceLock {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.15) translateY(-4px); }
}
</style>
