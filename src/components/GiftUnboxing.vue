<template>
  <div class="gift-unboxing-container">
    <!-- Header Section -->
    <div class="gift-header">
      <div class="gift-badge">
        <span>🎁</span>
        <span>spesial buat nada</span>
      </div>
      <h2 class="gift-title">tebak & buka kado kamu...</h2>
      <p class="gift-subtitle">
        aku udah siapin 2 hadiah spesial buat kamu. tapi sebelum dibuka, coba tebak dulu isi kadonya dari petunjuk yang ada yaa! ✨
      </p>
    </div>

    <!-- 2 Gift Boxes Grid -->
    <div class="gifts-grid">
      
      <!-- ================= GIFT 1: TAS MOSSDOOM ================= -->
      <div class="gift-card-wrapper" :class="{ 'is-opened': gift1State === 'opened' }">
        <div class="gift-card-inner">
          
          <!-- State 1: Box Locked (Tap to Guess) -->
          <div v-if="gift1State === 'locked'" class="gift-closed-state" @click="startGuessing(1)">
            <div class="gift-box-3d">
              <div class="box-lid">
                <div class="box-ribbon-bow">🎀</div>
              </div>
              <div class="box-body">
                <div class="box-ribbon-vertical"></div>
                <div class="box-ribbon-horizontal"></div>
                <span class="box-tag">Kado #1 🎁</span>
              </div>
            </div>
            
            <div class="box-action-prompt">
              <span class="prompt-icon">🕵️‍♀️</span>
              <span class="prompt-text">Klik untuk tebak isinya!</span>
            </div>
          </div>

          <!-- State 2: Guessing / Riddle Panel -->
          <transition name="quiz-pop">
            <div v-if="gift1State === 'guessing'" class="gift-quiz-panel">
              <div class="quiz-header-badge">
                <span>🔍</span>
                <span>Tebak Kado #1</span>
              </div>
              <h4 class="quiz-clue-title">Kira-kira apa isi kado ini?</h4>
              <p class="quiz-clue-text">
                "Barang ini sering banget kamu bawa kalau lagi jalan, bisa muat dompet, hp, & lipstik, dan bikin kamu makin anggun pas kita nge-date... Hayo apa?"
              </p>

              <!-- Riddle Options -->
              <div class="quiz-options-list">
                <button 
                  v-for="(option, idx) in gift1Options" 
                  :key="idx"
                  class="quiz-opt-btn"
                  :class="{ 
                    'opt-correct': gift1SelectedOpt === idx && option.isCorrect,
                    'opt-wrong': gift1SelectedOpt === idx && !option.isCorrect,
                    'shake-anim': gift1SelectedOpt === idx && !option.isCorrect
                  }"
                  @click="handleGuess(1, idx, option)"
                >
                  <span class="opt-label">{{ option.text }}</span>
                  <span v-if="gift1SelectedOpt === idx && option.isCorrect" class="opt-result-icon">✨</span>
                  <span v-if="gift1SelectedOpt === idx && !option.isCorrect" class="opt-result-icon">❌</span>
                </button>
              </div>

              <!-- Wrong Answer Feedback Message -->
              <transition name="fade">
                <div v-if="gift1Feedback" class="quiz-feedback-box" :class="{ 'feedback-error': !gift1IsCorrect }">
                  <span>{{ gift1Feedback }}</span>
                </div>
              </transition>
            </div>
          </transition>

          <!-- State 3: Box Opened (Product Reveal) -->
          <transition name="gift-reveal">
            <div v-if="gift1State === 'opened'" class="gift-opened-state">
              <div class="gift-reveal-badge">
                <span>👜</span>
                <span>Kado #1 &bull; Stylish & Fashionable</span>
              </div>

              <!-- Product Image Frame -->
              <div class="gift-img-frame">
                <img :src="mossdomImg" alt="Tas Mossdoom" class="gift-photo" />
                <div class="photo-tape"></div>
                <div class="photo-sparkle-1">✨</div>
                <div class="photo-sparkle-2">💖</div>
              </div>

              <!-- Product Info & Love Note -->
              <div class="gift-content">
                <h3 class="gift-item-name">Tas Slingbag MOSSDOOM ✨</h3>
                <p class="gift-item-note">
                  "Biar kamu makin cantik dan modis setiap kali kita nge-date atau jalan bareng 🥰 Tas ini pas banget buat nemenin outfit manis kamu ke mana pun!"
                </p>
                <div class="gift-footer-bar">
                  <span class="gift-from-tag">Dari: Razaan ❤️</span>
                  <button class="btn-love-gift" @click="likeGift(1)">
                    <span>{{ gift1Liked ? 'Tersayang Banget! 💖' : 'Suka Banget! 🥰' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>

      <!-- ================= GIFT 2: TUMBLER KPOP CORTIS ================= -->
      <div class="gift-card-wrapper" :class="{ 'is-opened': gift2State === 'opened' }">
        <div class="gift-card-inner">
          
          <!-- State 1: Box Locked (Tap to Guess) -->
          <div v-if="gift2State === 'locked'" class="gift-closed-state" @click="startGuessing(2)">
            <div class="gift-box-3d box-theme-purple">
              <div class="box-lid">
                <div class="box-ribbon-bow">🎀</div>
              </div>
              <div class="box-body">
                <div class="box-ribbon-vertical"></div>
                <div class="box-ribbon-horizontal"></div>
                <span class="box-tag">Kado #2 🎁</span>
              </div>
            </div>
            
            <div class="box-action-prompt">
              <span class="prompt-icon">🕵️‍♀️</span>
              <span class="prompt-text">Klik untuk tebak isinya!</span>
            </div>
          </div>

          <!-- State 2: Guessing / Riddle Panel -->
          <transition name="quiz-pop">
            <div v-if="gift2State === 'guessing'" class="gift-quiz-panel">
              <div class="quiz-header-badge badge-purple">
                <span>🔍</span>
                <span>Tebak Kado #2</span>
              </div>
              <h4 class="quiz-clue-title">Kira-kira apa isi kado ini?</h4>
              <p class="quiz-clue-text">
                "Benda ini tahan dingin & panas, ada bau-bau idol K-Pop kesayangan kamu, dan fungsinya biar kamu nggak pernah lupa minum air putih... Apa tebakanmu?"
              </p>

              <!-- Riddle Options -->
              <div class="quiz-options-list">
                <button 
                  v-for="(option, idx) in gift2Options" 
                  :key="idx"
                  class="quiz-opt-btn"
                  :class="{ 
                    'opt-correct': gift2SelectedOpt === idx && option.isCorrect,
                    'opt-wrong': gift2SelectedOpt === idx && !option.isCorrect,
                    'shake-anim': gift2SelectedOpt === idx && !option.isCorrect
                  }"
                  @click="handleGuess(2, idx, option)"
                >
                  <span class="opt-label">{{ option.text }}</span>
                  <span v-if="gift2SelectedOpt === idx && option.isCorrect" class="opt-result-icon">✨</span>
                  <span v-if="gift2SelectedOpt === idx && !option.isCorrect" class="opt-result-icon">❌</span>
                </button>
              </div>

              <!-- Wrong Answer Feedback Message -->
              <transition name="fade">
                <div v-if="gift2Feedback" class="quiz-feedback-box" :class="{ 'feedback-error': !gift2IsCorrect }">
                  <span>{{ gift2Feedback }}</span>
                </div>
              </transition>
            </div>
          </transition>

          <!-- State 3: Box Opened (Product Reveal) -->
          <transition name="gift-reveal">
            <div v-if="gift2State === 'opened'" class="gift-opened-state">
              <div class="gift-reveal-badge badge-purple">
                <span>🧋</span>
                <span>Kado #2 &bull; Daily Essential & K-Pop Vibe</span>
              </div>

              <!-- Product Image Frame -->
              <div class="gift-img-frame">
                <img :src="tumblerImg" alt="Tumbler K-Pop Cortis" class="gift-photo" />
                <div class="photo-tape"></div>
                <div class="photo-sparkle-1">✨</div>
                <div class="photo-sparkle-2">💜</div>
              </div>

              <!-- Product Info & Love Note -->
              <div class="gift-content">
                <h3 class="gift-item-name">Tumbler K-Pop Cortis Edition 🥤</h3>
                <p class="gift-item-note">
                  "Biar kamu nggak pernah lupa minum air putih setiap hari! Praktis dibawa jalan atau kerja, dan yang paling penting: selalu bikin inget aku tiap kali kamu minum ✨"
                </p>
                <div class="gift-footer-bar">
                  <span class="gift-from-tag">Dari: Razaan ❤️</span>
                  <button class="btn-love-gift" @click="likeGift(2)">
                    <span>{{ gift2Liked ? 'Tersayang Banget! 💜' : 'Suka Banget! 🥰' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>

    </div>

    <!-- Celebration Banner when Both Gifts are Unlocked -->
    <transition name="fade">
      <div v-if="gift1State === 'opened' && gift2State === 'opened'" class="all-unlocked-banner">
        <span class="banner-emoji">🎉</span>
        <div class="banner-text">
          <strong>Yeay! Semua Kado Berhasil Kamu Tebak & Buka!</strong>
          <p>Semoga suka dengan hadiahnya yaa cantikk, jangan lupa dipakai dan dibawa terus! 🥰🎁</p>
        </div>
        <button class="btn-rebox" @click="resetGifts" title="Bungkus ulang kado">
          <span>🔄 Main Tebak Lagi</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import confetti from 'canvas-confetti'

// Import Gift Photos from Assets
import mossdomImg from '../assets/images/Kado/mossdom.jpg'
import tumblerImg from '../assets/images/Kado/tubmler.jpeg'

// Gift States: 'locked' -> 'guessing' -> 'opened'
const gift1State = ref('locked')
const gift2State = ref('locked')

const gift1SelectedOpt = ref(null)
const gift1Feedback = ref('')
const gift1IsCorrect = ref(false)

const gift2SelectedOpt = ref(null)
const gift2Feedback = ref('')
const gift2IsCorrect = ref(false)

const gift1Liked = ref(false)
const gift2Liked = ref(false)

// Options for Gift 1
const gift1Options = [
  { text: 'Baju 👗', isCorrect: false, feedback: 'Bukan baju sayangg, coba tebak lagi yaa! 😜' },
  { text: 'Dompet 👛', isCorrect: false, feedback: 'Hampir mirip tapi bukan dompet cantiikk! Coba lagi yuk! 🥰' },
  { text: 'Tas 👜', isCorrect: true, feedback: 'Beneran pinter banget pacar aku! Langsung kita buka yaa! 🎉' },
  { text: 'Sendal 👡', isCorrect: false, feedback: 'Bukan sendal sayangg, tebak lagi dong! 😋' }
]

// Options for Gift 2
const gift2Options = [
  { text: 'Sepatu 👟', isCorrect: false, feedback: 'Bukan sepatu sayangg, coba tebak lagi yaa! 😜' },
  { text: 'Tempat Makan 🍱', isCorrect: false, feedback: 'Bukan tempat makan cantiikk, tebak lagi yuk! 🥰' },
  { text: 'Tumbler 🥤', isCorrect: true, feedback: 'Tepat banget 100%! Yuk langsung kita unboxing! 🎉' },
  { text: 'Kipas Portable 💨', isCorrect: false, feedback: 'Bukan kipas portable sayangg, coba tebak lagi dong! 😋' }
]

const startGuessing = (giftNumber) => {
  if (giftNumber === 1) {
    gift1State.value = 'guessing'
  } else if (giftNumber === 2) {
    gift2State.value = 'guessing'
  }
}

const handleGuess = (giftNumber, optIndex, option) => {
  if (giftNumber === 1) {
    gift1SelectedOpt.value = optIndex
    gift1Feedback.value = option.feedback
    gift1IsCorrect.value = option.isCorrect

    if (option.isCorrect) {
      // Confetti on success
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#F472B6', '#FBBF24', '#A78BFA', '#34D399']
      })
      setTimeout(() => {
        gift1State.value = 'opened'
        checkBothUnlocked()
      }, 900)
    }
  } else if (giftNumber === 2) {
    gift2SelectedOpt.value = optIndex
    gift2Feedback.value = option.feedback
    gift2IsCorrect.value = option.isCorrect

    if (option.isCorrect) {
      // Confetti on success
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#C084FC', '#9333EA', '#F472B6', '#38BDF8', '#FBBF24']
      })
      setTimeout(() => {
        gift2State.value = 'opened'
        checkBothUnlocked()
      }, 900)
    }
  }
}

const checkBothUnlocked = () => {
  if (gift1State.value === 'opened' && gift2State.value === 'opened') {
    setTimeout(() => {
      confetti({
        particleCount: 130,
        spread: 110,
        origin: { y: 0.5 },
        colors: ['#FF6B8B', '#FF8E53', '#FFA07A', '#38BDF8', '#A78BFA']
      })
    }, 400)
  }
}

const likeGift = (giftNumber) => {
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.7 },
    shapes: ['circle'],
    colors: ['#E11D48', '#FB7185', '#FDA4AF']
  })

  if (giftNumber === 1) gift1Liked.value = true
  if (giftNumber === 2) gift2Liked.value = true
}

const resetGifts = () => {
  gift1State.value = 'locked'
  gift2State.value = 'locked'
  gift1SelectedOpt.value = null
  gift2SelectedOpt.value = null
  gift1Feedback.value = ''
  gift2Feedback.value = ''
  gift1Liked.value = false
  gift2Liked.value = false
}
</script>

<style scoped>
.gift-unboxing-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header */
.gift-header {
  text-align: center;
  margin-bottom: 32px;
}

.gift-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #2563EB;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
}

.gift-title {
  font-family: 'Caveat', cursive;
  font-size: 2.8rem;
  color: #1E293B;
  line-height: 1.15;
  margin-bottom: 8px;
}

.gift-subtitle {
  font-size: 1rem;
  color: #64748B;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Grid Layout */
.gifts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  width: 100%;
  margin-bottom: 24px;
}

.gift-card-wrapper {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1.5px solid #E2E8F0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
}

.gift-card-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
  border-color: #CBD5E1;
}

.gift-card-wrapper.is-opened {
  border-color: #BAE6FD;
  box-shadow: 0 12px 32px rgba(56, 189, 248, 0.12);
}

.gift-card-inner {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 460px;
  justify-content: center;
}

/* ================= 3D CLOSED GIFT BOX ================= */
.gift-closed-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  padding: 30px 10px;
  user-select: none;
}

.gift-box-3d {
  width: 130px;
  height: 130px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.12));
}

.gift-closed-state:hover .gift-box-3d {
  transform: scale(1.08) rotate(-2deg);
}

/* Box Body */
.box-body {
  width: 110px;
  height: 90px;
  background: linear-gradient(135deg, #38BDF8 0%, #0284C7 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-theme-purple .box-body {
  background: linear-gradient(135deg, #C084FC 0%, #9333EA 100%);
}

.box-ribbon-vertical {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  background: linear-gradient(180deg, #FDE047 0%, #EAB308 100%);
  box-shadow: 0 0 8px rgba(234, 179, 8, 0.4);
}

.box-ribbon-horizontal {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 22px;
  background: linear-gradient(90deg, #FDE047 0%, #EAB308 100%);
  box-shadow: 0 0 8px rgba(234, 179, 8, 0.4);
}

.box-tag {
  position: relative;
  z-index: 2;
  background: #FFFFFF;
  color: #0F172A;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Box Lid */
.box-lid {
  width: 124px;
  height: 28px;
  background: linear-gradient(135deg, #7DD3FC 0%, #38BDF8 100%);
  border-radius: 8px;
  position: absolute;
  top: 18px;
  z-index: 3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.box-theme-purple .box-lid {
  background: linear-gradient(135deg, #E9D5FF 0%, #C084FC 100%);
}

.gift-closed-state:hover .box-lid {
  transform: translateY(-6px);
}

.box-ribbon-bow {
  position: absolute;
  top: -16px;
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
  animation: bounceBow 2s infinite ease-in-out;
}

@keyframes bounceBow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.box-action-prompt {
  margin-top: 26px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: #F8FAFC;
  border: 1px dashed #CBD5E1;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  transition: all 0.2s ease;
}

.gift-closed-state:hover .box-action-prompt {
  background: #EFF6FF;
  border-color: #38BDF8;
  color: #0284C7;
  transform: scale(1.04);
}

/* ================= RIDDLE / GUESSING PANEL ================= */
.gift-quiz-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.quiz-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E0F2FE;
  color: #0284C7;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: 999px;
  margin-bottom: 8px;
}

.badge-purple {
  background: #F3E8FF;
  color: #7E22CE;
}

.quiz-clue-title {
  font-family: 'Caveat', cursive;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 6px;
}

.quiz-clue-text {
  font-size: 0.86rem;
  color: #475569;
  line-height: 1.45;
  background: #F8FAFC;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  margin-bottom: 14px;
  font-style: italic;
}

.quiz-options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 10px;
}

.quiz-opt-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
  text-align: left;
  transition: all 0.2s ease;
}

.quiz-opt-btn:hover {
  border-color: #38BDF8;
  background: #F0F9FF;
  transform: translateX(3px);
}

.quiz-opt-btn.opt-correct {
  border-color: #10B981 !important;
  background: #ECFDF5 !important;
  color: #047857 !important;
}

.quiz-opt-btn.opt-wrong {
  border-color: #EF4444 !important;
  background: #FEF2F2 !important;
  color: #B91C1C !important;
}

.quiz-feedback-box {
  font-size: 0.82rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  background: #ECFDF5;
  color: #059669;
  border: 1px solid #A7F3D0;
  width: 100%;
  margin-top: 4px;
}

.quiz-feedback-box.feedback-error {
  background: #FFF1F2;
  color: #E11D48;
  border-color: #FECDD3;
}

/* ================= REVEALED PRODUCT STATE ================= */
.gift-opened-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.gift-reveal-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E0F2FE;
  color: #0369A1;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
}

/* Image Frame */
.gift-img-frame {
  width: 220px;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gift-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gift-img-frame:hover .gift-photo {
  transform: scale(1.06);
}

.photo-tape {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  width: 70px;
  height: 16px;
  background: rgba(254, 240, 138, 0.85);
  border-left: 1px dashed rgba(0, 0, 0, 0.2);
  border-right: 1px dashed rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.photo-sparkle-1 {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.1rem;
}

.photo-sparkle-2 {
  position: absolute;
  bottom: 8px;
  left: 8px;
  font-size: 1.1rem;
}

/* Content Details */
.gift-content {
  text-align: center;
  width: 100%;
}

.gift-item-name {
  font-family: 'Caveat', cursive;
  font-size: 1.65rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 6px;
  line-height: 1.15;
}

.gift-item-note {
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 16px;
  padding: 0 6px;
  font-style: italic;
}

.gift-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed #E2E8F0;
  padding-top: 12px;
  width: 100%;
}

.gift-from-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0284C7;
}

.btn-love-gift {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #FFF1F2;
  color: #E11D48;
  border: 1px solid #FECDD3;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-love-gift:hover {
  background: #FFE4E6;
  transform: scale(1.05);
}

/* All Unlocked Banner */
.all-unlocked-banner {
  margin-top: 16px;
  background: linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 100%);
  border: 1.5px solid #C7D2FE;
  border-radius: 16px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.08);
}

.banner-emoji {
  font-size: 2rem;
}

.banner-text {
  flex: 1;
  font-size: 0.9rem;
  color: #334155;
}

.banner-text strong {
  color: #1E293B;
  font-size: 0.98rem;
  display: block;
  margin-bottom: 2px;
}

.btn-rebox {
  padding: 6px 14px;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-rebox:hover {
  background: #F1F5F9;
  color: #0F172A;
}

/* Animations */
.gift-reveal-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gift-reveal-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

.quiz-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.quiz-pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.shake-anim {
  animation: shakeOpt 0.4s ease-in-out;
}

@keyframes shakeOpt {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* Responsive */
@media (max-width: 640px) {
  .gifts-grid {
    grid-template-columns: 1fr;
  }
  
  .gift-title {
    font-size: 2.2rem;
  }
  
  .all-unlocked-banner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
