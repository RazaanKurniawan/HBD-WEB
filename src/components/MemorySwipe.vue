<template>
  <div class="memory-swipe-section">
    <div class="swipe-header">
      <div class="swipe-badge">
        <span>✨</span>
        <span>Date Planner Interaktif</span>
      </div>
      <h2 class="swipe-title">kamu mau apa cantiikk?</h2>
      <p class="swipe-subtitle">
        geser kartu ke <strong>kanan (💖 Mau!)</strong> atau ke <strong>kiri (❌ Skip)</strong> yaa!
      </p>
    </div>

    <!-- Active Swiping Stack View -->
    <div v-if="!isFinished" class="swipe-stage">
      <div class="cards-stack">
        <div
          v-for="(item, index) in dateCards"
          :key="item.id"
          v-show="index >= currentIndex && index <= currentIndex + 2"
          class="swipe-card"
          :class="{
            'top-card': index === currentIndex,
            'flying-right': flyingIndex === index && flyDirection === 'right',
            'flying-left': flyingIndex === index && flyDirection === 'left'
          }"
          :style="getCardStyle(index)"
          @mousedown="onDragStart($event, index)"
          @touchstart="onDragStart($event, index)"
        >
          <!-- Washi Tape Scrapbook Accent -->
          <div class="washi-tape"></div>

          <!-- Like / Nope Stamp Indicators -->
          <div 
            v-if="index === currentIndex && dragOffset.x > 30" 
            class="swipe-stamp stamp-like"
            :style="{ opacity: Math.min(1, (dragOffset.x - 30) / 70) }"
          >
            MAU! 💖
          </div>
          <div 
            v-if="index === currentIndex && dragOffset.x < -30" 
            class="swipe-stamp stamp-nope"
            :style="{ opacity: Math.min(1, (-dragOffset.x - 30) / 70) }"
          >
            SKIP ❌
          </div>

          <!-- Card Photo -->
          <div class="card-image-wrap">
            <img :src="item.image" :alt="item.title" class="card-image" draggable="false" />
            <span class="card-category">{{ item.tag }}</span>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <div class="card-icon">{{ item.icon }}</div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Action Floating Buttons -->
      <div class="swipe-controls">
        <button 
          class="control-btn btn-nope" 
          @click="swipeCard('left')" 
          title="Lewati (Swipe Kiri)"
        >
          <span class="btn-symbol">❌</span>
          <span class="btn-label">Skip</span>
        </button>

        <button 
          class="control-btn btn-like" 
          @click="swipeCard('right')" 
          title="Mau! (Swipe Kanan)"
        >
          <span class="btn-symbol">💖</span>
          <span class="btn-label">Mau!</span>
        </button>
      </div>
    </div>

    <!-- 4. End State: Summary Reveal UI -->
    <transition name="summary-fade">
      <div v-if="isFinished" class="summary-wrapper">
        <div class="glass-card summary-card">
          <div class="washi-tape-summary"></div>
          <div class="summary-icon">🎉</div>
          <h3 class="summary-title">yeayyy! rencana kita siap!</h3>
          
          <div v-if="selectedDates.length > 0" class="selected-list-box">
            <p class="summary-instruction">catet yaa, hari ini kita bakal beli:</p>
            <ul class="selected-list">
              <li v-for="(choice, idx) in selectedDates" :key="idx" class="selected-item">
                <span class="item-emoji">{{ choice.icon }}</span>
                <span class="item-text">{{ choice.title }}</span>
                <span class="check-mark">✔️</span>
              </li>
            </ul>
          </div>

          <div v-else class="empty-selection-box">
            <p class="empty-text">
              wahh semuanya kamu skip nihh? gapapa, nanti aku yang pilihin yang paling enak yaa! 🥰
            </p>
          </div>

          <div class="closing-note">
            <p class="romantic-quote">
              "siap-siap ya cantikk, nanti kita kulineran bareng! ❤️"
            </p>
            <span class="signature">— dari supir pribadi & kesayanganmu</span>
          </div>

          <button class="btn-reset" @click="resetCards">
            <span>Pilih Ulang Rencana 🔄</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import confetti from 'canvas-confetti'
import { selectedDates } from '../data/datePlannerState.js'

// Initial Date Ideas Data
const initialData = [
  {
    id: 1,
    title: 'Sushi',
    description: 'makan sushi lezat bareng kamu sambil cerita-cerita seru.',
    tag: 'Kuliner Jepang',
    icon: '🍣',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Dimsum',
    description: 'nge-dimsum hangat sambil celup chili oil favorit!',
    tag: 'Makan Enak',
    icon: '🥟',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Chikuro',
    description: 'jajan Chikuro renyah dengan keju molor yang lumer di mulut!',
    tag: 'Camilan Gurih',
    icon: '🧀',
    image: 'https://images.unsplash.com/photo-1627042633706-0498b3c10a45?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Steak',
    description: 'makan steak lezat hotplate gurih bareng kesayangan.',
    tag: 'Hotplate Lezat',
    icon: '🥩',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Roti O',
    description: 'roti kopi hangat yang wangi menteganya selalu menggoda!',
    tag: 'Aroma Wangi',
    icon: '🍞',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Pilih Makanan di AEON Street Food (Terserah Kamu)',
    description: 'keliling AEON Street Food dan pilih semua makanan yang kamu pengen!',
    tag: 'Custom AEON',
    icon: '🛍️',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  }
]

const dateCards = ref([...initialData])
const currentIndex = ref(0)
const isFinished = ref(false)

// Drag physics state
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })
const dragOffset = reactive({ x: 0, y: 0 })

// Fly off animation state
const flyingIndex = ref(-1)
const flyDirection = ref('')

const getCardStyle = (index) => {
  const stackPosition = index - currentIndex.value
  
  if (stackPosition === 0) {
    if (isDragging.value) {
      const rot = dragOffset.x * 0.08
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot}deg)`,
        transition: 'none',
        zIndex: 10
      }
    }
    return {
      transform: 'translate(0px, 0px) rotate(0deg)',
      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      zIndex: 10
    }
  }

  // Cards behind in stack
  const scale = 1 - stackPosition * 0.05
  const translateY = stackPosition * 12
  const rot = stackPosition % 2 === 0 ? 1.5 : -1.5

  return {
    transform: `translateY(${translateY}px) scale(${scale}) rotate(${rot}deg)`,
    transition: 'transform 0.4s ease',
    zIndex: 10 - stackPosition
  }
}

// Drag Handlers
const onDragStart = (e, index) => {
  if (index !== currentIndex.value) return

  isDragging.value = true
  const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0

  dragStart.x = clientX
  dragStart.y = clientY
  dragOffset.x = 0
  dragOffset.y = 0

  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}

const onDragMove = (e) => {
  if (!isDragging.value) return
  if (e.cancelable && e.type === 'touchmove') {
    e.preventDefault()
  }

  const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0

  dragOffset.x = clientX - dragStart.x
  dragOffset.y = clientY - dragStart.y
}

const onDragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)

  const threshold = 95
  if (dragOffset.x > threshold) {
    commitSwipe('right')
  } else if (dragOffset.x < -threshold) {
    commitSwipe('left')
  } else {
    // Snap back
    dragOffset.x = 0
    dragOffset.y = 0
  }
}

// Programmatic / Button Swipe
const swipeCard = (direction) => {
  if (currentIndex.value >= dateCards.value.length || flyingIndex.value !== -1) return
  commitSwipe(direction)
}

const commitSwipe = (direction) => {
  const currentCard = dateCards.value[currentIndex.value]
  if (!currentCard) return

  flyingIndex.value = currentIndex.value
  flyDirection.value = direction

  if (direction === 'right') {
    selectedDates.value.push(currentCard)
    // Mini heart confetti burst on like
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#E07A5F', '#D4A373', '#FFB703']
    })
  }

  setTimeout(() => {
    currentIndex.value++
    flyingIndex.value = -1
    flyDirection.value = ''
    dragOffset.x = 0
    dragOffset.y = 0

    if (currentIndex.value >= dateCards.value.length) {
      finishSwiping()
    }
  }, 350)
}

const finishSwiping = () => {
  isFinished.value = true

  // Big grand celebration confetti on finish
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#D4A373', '#E07A5F', '#F4A261', '#E76F51', '#FFB703', '#FFFFFF']
  })
}

const resetCards = () => {
  currentIndex.value = 0
  selectedDates.value = []
  isFinished.value = false
  dragOffset.x = 0
  dragOffset.y = 0
}
</script>

<style scoped>
.memory-swipe-section {
  width: 100%;
  max-width: 580px;
  margin: 40px auto 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  padding: 0 16px;
}

.swipe-header {
  text-align: center;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.swipe-badge {
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

.swipe-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.1;
}

.swipe-subtitle {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.95rem;
  color: var(--text-muted, #8A7E72);
}

/* ================= Cards Stack Stage ================= */
.swipe-stage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.cards-stack {
  position: relative;
  width: 320px;
  height: 440px;
}

@media (min-width: 480px) {
  .cards-stack {
    width: 340px;
    height: 460px;
  }
}

.swipe-card {
  position: absolute;
  inset: 0;
  background: var(--polaroid-bg, #ffffff);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.35));
  border-radius: 16px;
  padding: 14px 14px 20px 14px;
  box-shadow: 0 14px 35px rgba(74, 64, 54, 0.12), 0 4px 10px rgba(74, 64, 54, 0.05);
  display: flex;
  flex-direction: column;
  cursor: grab;
  touch-action: none;
}

.swipe-card.top-card:active {
  cursor: grabbing;
}

/* Washi Tape */
.washi-tape {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(-0.8deg);
  width: 80px;
  height: 20px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.75));
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 5;
}

/* Like / Nope Stamps */
.swipe-stamp {
  position: absolute;
  top: 36px;
  padding: 6px 16px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 1.4rem;
  font-weight: 900;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 20;
  pointer-events: none;
}

.stamp-like {
  right: 20px;
  transform: rotate(15deg);
  color: #2a9d8f;
  border: 3px solid #2a9d8f;
  background: rgba(255, 255, 255, 0.85);
}

.stamp-nope {
  left: 20px;
  transform: rotate(-15deg);
  color: #e76f51;
  border: 3px solid #e76f51;
  background: rgba(255, 255, 255, 0.85);
}

/* Card Image */
.card-image-wrap {
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-secondary, #F3EAE3);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.card-category {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

/* Card Content */
.card-content {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.card-icon {
  font-size: 1.6rem;
  line-height: 1;
}

.card-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.15;
}

.card-desc {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  color: var(--text-muted, #8A7E72);
  line-height: 1.4;
}

/* Fly Off Keyframe Transitions */
.swipe-card.flying-right {
  transform: translate(140vw, 40px) rotate(35deg) !important;
  opacity: 0;
  transition: transform 0.4s ease-out, opacity 0.3s ease-out !important;
}

.swipe-card.flying-left {
  transform: translate(-140vw, 40px) rotate(-35deg) !important;
  opacity: 0;
  transition: transform 0.4s ease-out, opacity 0.3s ease-out !important;
}

/* ================= Control Buttons ================= */
.swipe-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  background: var(--polaroid-bg, #ffffff);
  box-shadow: 0 8px 20px rgba(74, 64, 54, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.control-btn:hover {
  transform: translateY(-3px) scale(1.06);
}

.btn-nope {
  color: #e76f51;
}
.btn-nope:hover {
  box-shadow: 0 12px 24px rgba(231, 111, 81, 0.25);
  border-color: #e76f51;
}

.btn-like {
  color: #2a9d8f;
}
.btn-like:hover {
  box-shadow: 0 12px 24px rgba(42, 157, 143, 0.25);
  border-color: #2a9d8f;
}

.btn-symbol {
  font-size: 1.25rem;
}

.btn-label {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.95rem;
  font-weight: 700;
}

/* ================= End State Summary Card ================= */
.summary-wrapper {
  width: 100%;
}

.summary-card {
  position: relative;
  background: var(--polaroid-bg, #ffffff);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  border-radius: 16px;
  padding: 36px 28px;
  text-align: center;
  box-shadow: 0 16px 40px rgba(74, 64, 54, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.washi-tape-summary {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(0.6deg);
  width: 90px;
  height: 22px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.8));
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
}

.summary-icon {
  font-size: 2.4rem;
}

.summary-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.15;
}

.selected-list-box {
  width: 100%;
  background: var(--bg-secondary, #F3EAE3);
  border-radius: 12px;
  padding: 18px 20px;
  border: 1px solid rgba(212, 163, 115, 0.3);
}

.summary-instruction {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.4rem;
  color: var(--accent-color, #D4A373);
  font-weight: 700;
  margin-bottom: 12px;
}

.selected-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(212, 163, 115, 0.2);
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-main, #4A4036);
}

.item-emoji {
  font-size: 1.25rem;
}

.check-mark {
  margin-left: auto;
  font-size: 0.85rem;
  color: #2a9d8f;
}

.empty-selection-box {
  background: var(--bg-secondary, #F3EAE3);
  border-radius: 12px;
  padding: 18px;
}

.empty-text {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.4rem;
  color: var(--text-main, #4A4036);
}

.closing-note {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.romantic-quote {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.7rem;
  color: var(--accent-color, #D4A373);
  font-weight: 700;
}

.signature {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.25rem;
  color: var(--text-muted, #8A7E72);
}

.btn-reset {
  margin-top: 10px;
  padding: 12px 24px;
  background: var(--bg-secondary, #F3EAE3);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.5));
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 64, 54, 0.08);
}

.summary-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.summary-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
</style>
