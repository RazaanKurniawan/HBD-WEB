<template>
  <!-- ================= 1. Date-based Lock Screen (Gatekeeper) ================= -->
  <transition name="lock-fade">
    <div v-if="!isUnlocked" class="lock-screen-overlay">
      <div class="lock-card" :class="{ 'shake-anim': isWrongPassword }">
        <div class="lock-icon-wrap">
          <div class="lock-icon">🔒</div>
        </div>
        <h2 class="lock-title">pintu rahasia kita 💌</h2>
        <p class="lock-subtitle">masukin tanggal spesial kita dong (DDMMYYYY):</p>
        
        <form @submit.prevent="checkPassword" class="lock-form">
          <div class="input-wrapper">
            <input 
              v-model="inputDate"
              type="text" 
              inputmode="numeric"
              maxlength="8"
              placeholder="e.g. 21082022"
              class="lock-input"
              :class="{ 'input-error': isWrongPassword }"
              autofocus
            />
          </div>

          <p v-if="errorMessage" class="error-msg">
            {{ errorMessage }}
          </p>

          <button type="submit" class="btn-unlock">
            <span>Buka Kenangan 🗝️</span>
          </button>
        </form>

        <div class="lock-hint">
          <span>psst: coba tanggal jadian kita yaa sayangg ✨</span>
        </div>
      </div>
    </div>
  </transition>

  <!-- ================= 2. Main Scrapbook Application (Unlocked) ================= -->
  <div v-if="isUnlocked" class="timeline-container">
    <!-- Hidden Background Audio Element -->
    <audio 
      ref="audioRef" 
      :src="audioSrc" 
      loop 
      preload="auto"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></audio>

    <!-- Interactive Vintage Vinyl Player (Floating Bottom-Right) -->
    <div 
      class="vinyl-player-widget"
      :class="{ 'playing': isPlaying }"
      @click="toggleMusic"
      :title="isPlaying ? 'Klik untuk Pause Musik' : 'Klik untuk Putar Musik'"
    >
      <div class="turntable-base">
        <!-- Spinning Vinyl Disc -->
        <div class="vinyl-disc" :class="{ 'spin-active': isPlaying }">
          <div class="groove-ring ring-1"></div>
          <div class="groove-ring ring-2"></div>
          <div class="groove-ring ring-3"></div>
          <div class="vinyl-center-label">
            <span class="label-dot"></span>
            <span class="label-text">Bazzi</span>
          </div>
        </div>

        <!-- Mechanical Tonearm / Needle -->
        <div class="tonearm-wrapper" :class="{ 'arm-on-record': isPlaying }">
          <div class="tonearm-pivot"></div>
          <div class="tonearm-bar"></div>
          <div class="tonearm-head"></div>
        </div>
      </div>

      <div class="vinyl-status-info">
        <span class="music-title">Beautiful ✨</span>
        <span class="music-action">{{ isPlaying ? 'Memutar Musik...' : 'Klik Putar 🎵' }}</span>
      </div>
    </div>

    <!-- Secret Keyboard Easter Egg: Floating Glowing Hearts Overlay -->
    <div v-if="easterEggActive" class="hearts-overlay" aria-hidden="true">
      <div 
        v-for="heart in heartsList" 
        :key="heart.id" 
        class="floating-heart"
        :style="{
          left: heart.left + '%',
          fontSize: heart.size + 'px',
          animationDuration: heart.duration + 's',
          animationDelay: heart.delay + 's',
          opacity: heart.opacity
        }"
      >
        {{ heart.symbol }}
      </div>
    </div>

    <!-- Secret Easter Egg Toast Notification -->
    <transition name="toast-fade">
      <div v-if="easterEggToast" class="easter-egg-toast">
        <div class="toast-heart">💖</div>
        <div class="toast-content">
          <p class="toast-title">secret unlocked! ✨</p>
          <p class="toast-desc">kamu ngetik "nada" yaa? aku sayang kamu banyak-banyakkk!</p>
        </div>
      </div>
    </transition>

    <!-- Sticky Heartbeat Sync Banner (Top) -->
    <div class="heartbeat-sticky-bar">
      <div class="heartbeat-content">
        <span class="beating-heart-icon">🫀</span>
        <p class="heartbeat-text">
          Sejak <span class="highlight-date">21 Agustus 2022</span>, jantungku sudah berdetak sekitar
          <strong class="heartbeat-number">{{ formattedHeartbeats }}</strong> kali, dan semuanya untuk kamu.
        </p>
        <span class="pulse-indicator">
          <span class="pulse-ring"></span>
          <span class="pulse-dot"></span>
        </span>
      </div>
    </div>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <div class="hero-sub-badge">our little journey 💌</div>
        <h1 class="hero-title">selamat ulang tahun, Nada Nazmi Nurlaila.</h1>
        <p class="hero-subtitle">setiap momen bareng kamu selalu jadi hal terindah ✨</p>
        
        <!-- Big Heartbeat Sync Card -->
        <div class="heartbeat-hero-card">
          <div class="heart-pulse-header">
            <span class="heart-pulse-icon">❤️</span>
            <span class="heart-pulse-title">The Heartbeat Sync</span>
          </div>
          <div class="heartbeat-big-display">
            <span class="big-number">{{ formattedHeartbeats }}</span>
            <span class="big-label">detak jantung untuk nada</span>
          </div>
          <p class="heartbeat-footnote">
            dihitung dari detak jantung rata-rata (~80 bpm) sejak hari pertama kita bersama.
          </p>
        </div>

        <button class="btn-start" @click="scrollToTimeline">
          <span class="btn-icon">📸</span>
          <span class="btn-text">Jelajahi Cerita Kita</span>
          <span class="btn-sparkle">✨</span>
        </button>

        <div class="scroll-indicator" @click="scrollToTimeline">
          <span class="scroll-text">scroll ke bawah</span>
          <div class="scroll-arrow">↓</div>
        </div>
      </div>
    </header>

    <!-- Virtual Birthday Cake & Make A Wish Section -->
    <section class="cake-event-section">
      <BirthdayCake />
    </section>

    <!-- Timeline Section -->
    <main id="timeline" class="timeline-section">
      <div class="timeline-wrapper">
        <!-- Central Line -->
        <div class="timeline-line"></div>

        <!-- Timeline Items (Alternating Left & Right) -->
        <div 
          v-for="(memory, index) in memories" 
          :key="memory.id"
          class="timeline-item"
          :class="{ 'item-left': index % 2 === 0, 'item-right': index % 2 !== 0 }"
        >
          <!-- Center Node / Dot -->
          <div class="timeline-node">
            <span class="node-dot"></span>
          </div>

          <!-- Connector Line to Polaroid -->
          <div class="timeline-connector"></div>

          <!-- Polaroid Card Component with 3D Tilt & Scroll Reveal -->
          <div class="timeline-card-wrapper">
            <PolaroidCard :image-url="memory.imageUrl" :index="index" />
          </div>
        </div>
      </div>
    </main>

    <!-- Interactive Couple Quiz Section -->
    <section class="couple-quiz-section">
      <CoupleQuiz />
    </section>

    <!-- Interactive Memory Map Section (Peta Jejak Cerita Kita) -->
    <section class="memory-map-section-wrap">
      <MemoryMap />
    </section>

    <!-- Interactive Tinder-style Date Planner Swiping Section -->
    <section class="date-planner-section">
      <MemorySwipe />
    </section>

    <!-- Funny Childhood Photo Reveal Section -->
    <section class="funny-section">
      <FunnyReveal />
    </section>

    <!-- Interactive 3D Gift Unboxing Section -->
    <section class="gift-unboxing-section">
      <GiftUnboxing />
    </section>

    <!-- 3. Grand Finale: Interactive Love Letter Envelope Section -->
    <section class="love-letter-section">
      <div class="footer-container">
        <div class="surprise-badge">
          <span>💌</span>
          <span>kejutan terakhir buat kamu</span>
        </div>
        <h2 class="surprise-heading">ada surat kecil buat nada...</h2>
        
        <!-- Interactive CSS Envelope Component -->
        <LoveLetter />
      </div>
    </section>

    <!-- 4. Developer Signature Footer -->
    <footer class="timeline-footer">
      <p class="signature-text">
        Made with <span class="footer-heart">❤️</span> by Razaan Kurniawan Putra | 2026
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'
import PolaroidCard from './components/PolaroidCard.vue'
import LoveLetter from './components/LoveLetter.vue'
import MemorySwipe from './components/MemorySwipe.vue'
import FunnyReveal from './components/FunnyReveal.vue'
import BirthdayCake from './components/BirthdayCake.vue'
import CoupleQuiz from './components/CoupleQuiz.vue'
import MemoryMap from './components/MemoryMap.vue'
import GiftUnboxing from './components/GiftUnboxing.vue'

// Audio import
import bgmFile from './assets/audio/Bazzi - Beautiful feat. Camila [Official Audio].mp3'

// ================= 1. Lock Screen Logic =================
const isUnlocked = ref(false)
const inputDate = ref('')
const isWrongPassword = ref(false)
const errorMessage = ref('')
const correctPassword = '21082022' // DDMMYYYY (21 Agustus 2022)

const checkPassword = () => {
  const cleanInput = inputDate.value.trim().replace(/[^0-9]/g, '')
  
  if (
    cleanInput === correctPassword || 
    cleanInput === '21082022' || 
    cleanInput === '12052024'
  ) {
    isUnlocked.value = true
    isWrongPassword.value = false
    errorMessage.value = ''
    
    // Auto-play music upon successful unlock
    setTimeout(() => {
      playMusic()
    }, 400)

    // Trigger celebration confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4A373', '#E07A5F', '#F4A261', '#E76F51', '#FFB703', '#FFFFFF']
    })
  } else {
    isWrongPassword.value = true
    errorMessage.value = 'hayo masa lupa sihh... coba inget-inget lagii sayangg 🥺'
    
    setTimeout(() => {
      isWrongPassword.value = false
    }, 600)
  }
}

// ================= 2. Heartbeat Sync Logic =================
// Anniversary Date: August 21, 2022
const anniversaryDate = new Date('2022-08-21T00:00:00')
const heartbeatsCounter = ref(0)
let heartbeatInterval = null

const calculateHeartbeats = () => {
  const now = new Date()
  const elapsedMs = Math.max(0, now.getTime() - anniversaryDate.getTime())
  const elapsedMinutes = elapsedMs / (1000 * 60)
  // 80 heartbeats per minute
  heartbeatsCounter.value = Math.floor(elapsedMinutes * 80)
}

const formattedHeartbeats = computed(() => {
  return new Intl.NumberFormat('id-ID').format(heartbeatsCounter.value)
})

// Helper to resolve dynamic assets with Vite
const getImageUrl = (filename) => {
  return new URL(`./assets/images/${filename}`, import.meta.url).href
}

// 12 Timeline Memories: Sorted sequentially from 1.jpg (oldest/first) to 12.jpg (newest/last)
const memories = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    imageUrl: getImageUrl(`${i + 1}.jpg`)
  }))
)

// ================= 3. Audio & Vinyl Player Logic =================
const audioRef = ref(null)
const isPlaying = ref(false)
const audioSrc = ref(bgmFile)

const playMusic = () => {
  if (audioRef.value) {
    audioRef.value.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((err) => {
        console.warn('Audio autoplay prevented:', err)
      })
  }
}

const toggleMusic = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((err) => {
        console.warn('Audio play error:', err)
      })
  }
}

// ================= 4. Secret Keyboard Easter Egg ("nada") =================
const easterEggActive = ref(false)
const easterEggToast = ref(false)
const heartsList = ref([])
let keySequence = ''
let easterEggTimer = null
let toastTimer = null

const handleKeyDown = (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

  keySequence += e.key.toLowerCase()
  if (keySequence.length > 10) {
    keySequence = keySequence.slice(-10)
  }

  if (keySequence.endsWith('nada')) {
    triggerEasterEgg()
    keySequence = ''
  }
}

const triggerEasterEgg = () => {
  const heartSymbols = ['💖', '💕', '✨', '🌸', '❤️', '💗', '🤍', '🍰']
  const generated = []
  for (let i = 0; i < 36; i++) {
    generated.push({
      id: i + '-' + Date.now(),
      symbol: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
      left: Math.random() * 92 + 4,
      size: Math.floor(Math.random() * 26) + 18,
      duration: (Math.random() * 2.5 + 3.5).toFixed(2),
      delay: (Math.random() * 1.5).toFixed(2),
      opacity: (Math.random() * 0.4 + 0.6).toFixed(2)
    })
  }

  heartsList.value = generated
  easterEggActive.value = true
  easterEggToast.value = true

  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.8 },
    colors: ['#E07A5F', '#D4A373', '#F4A261', '#E76F51']
  })

  if (easterEggTimer) clearTimeout(easterEggTimer)
  if (toastTimer) clearTimeout(toastTimer)

  easterEggTimer = setTimeout(() => {
    easterEggActive.value = false
  }, 6500)

  toastTimer = setTimeout(() => {
    easterEggToast.value = false
  }, 5000)
}

const scrollToTimeline = () => {
  const element = document.getElementById('timeline')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  calculateHeartbeats()
  heartbeatInterval = setInterval(calculateHeartbeats, 1000)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (heartbeatInterval) clearInterval(heartbeatInterval)
  window.removeEventListener('keydown', handleKeyDown)
  if (easterEggTimer) clearTimeout(easterEggTimer)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
/* ================= Lock Screen Styles ================= */
.lock-screen-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--bg-primary, #FAF6F0);
  background-image: radial-gradient(circle at center, rgba(243, 234, 227, 0.9) 0%, #FAF6F0 75%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 99999;
}

.lock-card {
  width: 100%;
  max-width: 440px;
  background: var(--polaroid-bg, #ffffff);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.35));
  border-radius: var(--radius-lg, 20px);
  padding: 44px 32px;
  text-align: center;
  box-shadow: 0 20px 45px rgba(74, 64, 54, 0.14), 0 4px 12px rgba(74, 64, 54, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.lock-icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-secondary, #F3EAE3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--accent-color, #D4A373);
}

.lock-icon { font-size: 1.8rem; }
.lock-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1;
}

.lock-subtitle {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.95rem;
  color: var(--text-muted, #8A7E72);
  line-height: 1.5;
}

.lock-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.input-wrapper { width: 100%; }

.lock-input {
  width: 100%;
  padding: 14px 20px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-align: center;
  color: var(--text-main, #4A4036);
  background: var(--bg-secondary, #F3EAE3);
  border: 2px solid var(--border-light, rgba(212, 163, 115, 0.4));
  border-radius: var(--radius-md, 12px);
  outline: none;
  transition: all 0.3s ease;
}

.lock-input:focus {
  border-color: var(--accent-color, #D4A373);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(212, 163, 115, 0.25);
}

.lock-input.input-error {
  border-color: #E07A5F;
  background: #FFF5F2;
}

.error-msg {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.25rem;
  color: #E07A5F;
  font-weight: 700;
}

.btn-unlock {
  width: 100%;
  padding: 14px 24px;
  background: var(--accent-color, #D4A373);
  color: #ffffff;
  border-radius: var(--radius-md, 12px);
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  box-shadow: 0 8px 20px rgba(212, 163, 115, 0.4);
  transition: all 0.3s ease;
}

.btn-unlock:hover {
  background: var(--accent-hover, #C58F5E);
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(212, 163, 115, 0.5);
}

.lock-hint {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.15rem;
  color: var(--text-muted, #8A7E72);
}

.shake-anim {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

.lock-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.lock-fade-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

/* ================= Sticky Heartbeat Sync Bar ================= */
.heartbeat-sticky-bar {
  position: sticky;
  top: 0;
  z-index: 900;
  background: rgba(250, 246, 240, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light, rgba(212, 163, 115, 0.3));
  padding: 10px 20px;
  box-shadow: 0 4px 12px rgba(74, 64, 54, 0.05);
}

.heartbeat-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.beating-heart-icon {
  font-size: 1.3rem;
  animation: heartbeatPulse 1.2s infinite ease-in-out;
}

.heartbeat-text {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.88rem;
  color: var(--text-main, #4A4036);
  line-height: 1.4;
}

.highlight-date {
  font-weight: 700;
  color: var(--accent-color, #D4A373);
}

.heartbeat-number {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-weight: 800;
  color: #E07A5F;
  letter-spacing: 0.02em;
  font-size: 0.95rem;
}

.pulse-indicator {
  position: relative;
  width: 12px;
  height: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #E07A5F;
  border-radius: 50%;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(224, 122, 95, 0.6);
  animation: pulseRipple 1.6s infinite ease-out;
}

/* ================= Interactive Vinyl Music Player ================= */
.vinyl-player-widget {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--polaroid-bg, #ffffff);
  padding: 10px 18px 10px 10px;
  border-radius: 999px;
  box-shadow: 0 12px 32px rgba(74, 64, 54, 0.16), 0 2px 8px rgba(74, 64, 54, 0.08);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  user-select: none;
}

.vinyl-player-widget:hover {
  transform: scale(1.05) translateY(-3px);
  box-shadow: 0 16px 36px rgba(74, 64, 54, 0.22);
}

.turntable-base {
  position: relative;
  width: 58px;
  height: 58px;
  background: #2a221b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Vinyl Disc */
.vinyl-disc {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle, #25201c 0%, #151210 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.5s ease;
}

.vinyl-disc.spin-active {
  animation: vinylSpin 3s linear infinite;
}

/* Grooves */
.groove-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.ring-1 { width: 44px; height: 44px; }
.ring-2 { width: 36px; height: 36px; }
.ring-3 { width: 28px; height: 28px; }

.vinyl-center-label {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #E07A5F 0%, #D4A373 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
}

.label-dot {
  width: 5px;
  height: 5px;
  background: #ffffff;
  border-radius: 50%;
}

.label-text { display: none; }

/* Tonearm */
.tonearm-wrapper {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 38px;
  transform-origin: top right;
  transform: rotate(-18deg);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 10;
}

.tonearm-wrapper.arm-on-record {
  transform: rotate(26deg);
}

.tonearm-pivot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #C49F7B;
  border: 1px solid #7D5E3F;
  border-radius: 50%;
}

.tonearm-bar {
  position: absolute;
  top: 4px;
  right: 3px;
  width: 2px;
  height: 28px;
  background: linear-gradient(to bottom, #d5b89a, #a6815e);
  transform-origin: top center;
  transform: rotate(10deg);
}

.tonearm-head {
  position: absolute;
  bottom: 0;
  left: 2px;
  width: 6px;
  height: 8px;
  background: #2b2520;
  border-radius: 1px;
}

.vinyl-status-info {
  display: flex;
  flex-direction: column;
}

.music-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.1;
}

.music-action {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.72rem;
  color: var(--accent-color, #D4A373);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ================= Hero Section & Big Heartbeat Card ================= */
.hero-section {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 20px 40px;
  position: relative;
  background: radial-gradient(circle at center, rgba(243, 234, 227, 0.8) 0%, var(--bg-primary, #FAF6F0) 70%);
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  max-width: 760px;
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-sub-badge {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted, #8A7E72);
  background: var(--bg-secondary, #F3EAE3);
  padding: 6px 18px;
  border-radius: 999px;
  border: 1px dashed var(--border-light, rgba(212, 163, 115, 0.4));
}

.hero-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(3.2rem, 8vw, 5.8rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-main, #4A4036);
  margin: 4px 0;
  text-shadow: 2px 2px 4px rgba(74, 64, 54, 0.05);
}

.hero-subtitle {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 1.05rem;
  color: var(--text-muted, #8A7E72);
  font-weight: 400;
}

/* Big Heartbeat Display Card */
.heartbeat-hero-card {
  background: var(--polaroid-bg, #ffffff);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.35));
  border-radius: var(--radius-md, 12px);
  padding: 24px 32px;
  box-shadow: 0 12px 30px rgba(74, 64, 54, 0.08);
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
}

.heart-pulse-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.heart-pulse-icon {
  font-size: 1.4rem;
  animation: heartbeatPulse 1.2s infinite ease-in-out;
}

.heart-pulse-title {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-color, #D4A373);
}

.heartbeat-big-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.big-number {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #E07A5F;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.big-label {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.35rem;
  color: var(--text-muted, #8A7E72);
  margin-top: 2px;
}

.heartbeat-footnote {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.8rem;
  color: var(--text-muted, #8A7E72);
  line-height: 1.4;
}

/* Start Button */
.btn-start {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--accent-color, #D4A373);
  color: #ffffff;
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(212, 163, 115, 0.4);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  border: none;
}

.btn-start:hover {
  background: var(--accent-hover, #C58F5E);
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 14px 30px rgba(212, 163, 115, 0.5);
}

.scroll-indicator {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
  transform: translateY(4px);
}

.scroll-text {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted, #8A7E72);
}

.scroll-arrow {
  font-size: 1.2rem;
  animation: bounce 2s infinite ease-in-out;
  color: var(--accent-color, #D4A373);
}

/* ================= Timeline Section ================= */
.timeline-section {
  padding: 40px 20px 80px;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}

.timeline-wrapper {
  position: relative;
  width: 100%;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: repeating-linear-gradient(
    to bottom,
    var(--accent-color, #D4A373) 0,
    var(--accent-color, #D4A373) 8px,
    transparent 8px,
    transparent 16px
  );
  opacity: 0.6;
  z-index: 1;
}

.timeline-item {
  position: relative;
  width: 100%;
  margin-bottom: 90px;
  display: flex;
  align-items: center;
}

.timeline-item:last-child {
  margin-bottom: 30px;
}

.timeline-item.item-left {
  justify-content: flex-start;
}

.timeline-item.item-right {
  justify-content: flex-end;
}

.timeline-card-wrapper {
  width: 44%;
  position: relative;
  z-index: 2;
  display: flex;
}

.timeline-item.item-left .timeline-card-wrapper {
  justify-content: flex-end;
}

.timeline-item.item-right .timeline-card-wrapper {
  justify-content: flex-start;
}

.timeline-node {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: var(--bg-primary, #FAF6F0);
  border: 2px solid var(--accent-color, #D4A373);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow: 0 0 0 4px var(--bg-primary, #FAF6F0);
}

.node-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent-color, #D4A373);
  border-radius: 50%;
}

.timeline-connector {
  position: absolute;
  top: 50%;
  height: 2px;
  background: var(--border-light, rgba(212, 163, 115, 0.4));
  border-top: 1px dashed var(--accent-color, #D4A373);
  z-index: 1;
}

.timeline-item.item-left .timeline-connector {
  left: 44%;
  width: 6%;
}

.timeline-item.item-right .timeline-connector {
  left: 50%;
  width: 6%;
}

/* ================= Love Letter & Surprise Section ================= */
.love-letter-section {
  padding: 60px 20px 80px;
  display: flex;
  justify-content: center;
  background: linear-gradient(to top, var(--bg-secondary, #F3EAE3) 0%, transparent 100%);
}

/* ================= Developer Signature Footer ================= */
.timeline-footer {
  width: 100%;
  padding: 2rem 0;
  margin-top: 3rem;
  text-align: center;
  background: transparent;
  border-top: 1px solid var(--border-light, rgba(212, 163, 115, 0.25));
  position: relative;
  z-index: 10;
}

.signature-text {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted, #8A7E72);
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.footer-heart {
  color: #e07a5f;
  display: inline-block;
  animation: heartBeat 1.8s infinite ease-in-out;
}

.footer-container {
  max-width: 760px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.surprise-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  background: var(--bg-secondary, #F3EAE3);
  border: 1px dashed var(--accent-color, #D4A373);
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-color, #D4A373);
  margin-bottom: 12px;
}

.surprise-heading {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 700;
  color: var(--text-main, #4A4036);
  text-align: center;
  margin-bottom: 10px;
}

/* ================= Secret Easter Egg (Floating Hearts) ================= */
.hearts-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10000;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: -50px;
  animation-name: floatUpHeart;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  filter: drop-shadow(0 4px 10px rgba(224, 122, 95, 0.35));
}

@keyframes floatUpHeart {
  0% { transform: translateY(0) scale(0.6) rotate(0deg); opacity: 0; }
  15% { opacity: 1; }
  50% { transform: translateY(-50vh) scale(1.1) rotate(15deg); }
  75% { transform: translateY(-75vh) scale(0.95) rotate(-10deg); }
  100% { transform: translateY(-110vh) scale(1.2) rotate(20deg); opacity: 0; }
}

.easter-egg-toast {
  position: fixed;
  top: 54px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  background: var(--polaroid-bg, #ffffff);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.5));
  border-radius: 999px;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 12px 32px rgba(74, 64, 54, 0.18), 0 2px 6px rgba(74, 64, 54, 0.08);
}

.toast-heart { font-size: 1.4rem; animation: heartBeat 1.2s infinite; }
.toast-content { display: flex; flex-direction: column; }
.toast-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color, #D4A373);
  line-height: 1;
}
.toast-desc {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.82rem;
  color: var(--text-main, #4A4036);
  font-weight: 600;
}

/* ================= Keyframe Animations ================= */
@keyframes vinylSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes heartbeatPulse {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.25); }
  30% { transform: scale(1.05); }
  45% { transform: scale(1.2); }
}

@keyframes pulseRipple {
  0% { transform: scale(0.8); opacity: 0.9; }
  100% { transform: scale(2.4); opacity: 0; }
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } 60% { transform: translateY(-4px); } }
@keyframes heartBeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.2); } 28% { transform: scale(1); } 42% { transform: scale(1.15); } 70% { transform: scale(1); } }

/* ================= Responsive (Mobile <= 768px) ================= */
@media (max-width: 768px) {
  .vinyl-player-widget {
    bottom: 18px;
    right: 18px;
    padding: 8px 14px 8px 8px;
  }

  .turntable-base {
    width: 48px;
    height: 48px;
  }

  .vinyl-disc {
    width: 44px;
    height: 44px;
  }

  .ring-1 { width: 38px; height: 38px; }
  .ring-2 { width: 30px; height: 30px; }
  .ring-3 { width: 22px; height: 22px; }

  .heartbeat-sticky-bar {
    padding: 8px 14px;
  }

  .heartbeat-text {
    font-size: 0.78rem;
  }

  .timeline-section {
    padding: 20px 12px 60px 12px;
    overflow-x: hidden;
  }

  .timeline-line {
    left: 18px;
    transform: none;
  }

  .timeline-item {
    margin-bottom: 50px;
    justify-content: flex-start !important;
    padding-left: 38px;
    box-sizing: border-box;
    width: 100%;
  }

  .timeline-card-wrapper {
    width: 100%;
    max-width: 100%;
    justify-content: flex-start !important;
  }

  .timeline-node {
    left: 18px;
    transform: translate(-50%, -50%);
  }

  .timeline-connector {
    left: 18px !important;
    width: 20px !important;
  }
}
</style>
