<template>
  <div class="love-letter-wrapper">
    <div class="letter-stage" :class="{ 'is-open': isOpen }">
      
      <!-- Click to open prompt -->
      <div v-if="!isOpen" class="click-hint" @click="toggleEnvelope">
        <span>klik amplop ini untuk buka surat cinta 💌</span>
      </div>
      <div v-else class="click-hint opened-hint" @click="toggleEnvelope">
        <span>klik amplop lagi jika ingin melipat kembali ✉️</span>
      </div>

      <!-- Main Envelope Container -->
      <div 
        class="envelope-container" 
        :class="{ 'is-open': isOpen }"
        @click="toggleEnvelope"
      >
        <!-- 1. Envelope Back Wall (z-index: 1) -->
        <div class="envelope-back"></div>

        <!-- 2. The Letter Paper (z-index: 2 tucked, z-index: 25 when raised upwards) -->
        <div class="letter-paper" @click.stop>
          <div class="washi-tape-letter"></div>
          
          <div class="letter-header">
            <span class="letter-badge">untukk nada tercantikk ✨</span>
            <span class="letter-heart">💖</span>
          </div>

          <h3 class="letter-title">selamat ulang tahun, sayangkuuu!</h3>
          
          <div class="letter-body">
            <p>
              makasii banyak yaa sudah selalu jadi alasan aku tersenyum setiap hari. 
              dari awal kita ketemu sampe detik ini, rasa sayang aku ke kamu ga pernah berkurang, 
              malah makin nambah setiap harinya.
            </p>
            <p class="letter-highlight">
              "semoga semua impian dan cita-citamu tercapai yaa cantikk. 
              aku bakal selalu ada di samping kamu buat dukung kamu dalam hal apapun."
            </p>
            <p>
              tetap jadi nada yang ceria, penyabar, dan lucu yaa. 
              i love you so much more than words can say! 🤍
            </p>
          </div>

          <div class="letter-footer">
            <span>— selamanya milikmu,</span>
            <span class="letter-sign">pacar kamu yang paling sayang kamu ❤️</span>
          </div>

          <!-- Direct Simple "Balas" Action inside Paper -->
          <div class="letter-reply-action">
            <button class="btn-wa-letter" @click.stop="openReplyModal">
              <span class="wa-btn-icon">💬</span>
              <span class="wa-btn-text">Balas</span>
            </button>
          </div>
        </div>

        <!-- 3. Envelope Side and Bottom Front Pocket Flaps (z-index: 3 & 4) -->
        <div class="pocket-left"></div>
        <div class="pocket-right"></div>
        <div class="pocket-bottom"></div>

        <!-- 4. Top Flap that Flips Upwards (z-index: 5 when closed, z-index: 1 when open) -->
        <div class="flap-top"></div>

        <!-- 5. Wax Seal (z-index: 6) -->
        <div class="wax-seal">
          <span>{{ isOpen ? '❤️' : '💌' }}</span>
        </div>
      </div>

    </div>

    <!-- WhatsApp Response Floating Modal -->
    <transition name="modal-pop">
      <div v-if="isReplyModalOpen" class="wa-modal-backdrop" @click="closeReplyModal">
        <div class="wa-modal-card" @click.stop>
          <div class="washi-tape-modal"></div>
          
          <div class="modal-header">
            <span class="modal-emoji">💌</span>
            <h3 class="modal-title">Kirim Balasan ke Razaan</h3>
            <p class="modal-desc">Ketik balasan manismu di bawah ini yaa:</p>
          </div>

          <!-- Message Textarea (Blank, no templates) -->
          <div class="input-wrap">
            <textarea 
              v-model="customMessage" 
              class="wa-textarea" 
              rows="4" 
              placeholder="ketik balasanmu buat razaan di sini..."
              autofocus
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="btn-cancel" @click="closeReplyModal">
              Batal
            </button>
            <button class="btn-send-wa" @click="sendToWhatsApp">
              <span>Kirim via WhatsApp 🚀</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import confetti from 'canvas-confetti'
import { selectedDates } from '../data/datePlannerState.js'

const isOpen = ref(false)
const isReplyModalOpen = ref(false)

// Custom message from Nada (no templates)
const customMessage = ref('')

// Razaan's WhatsApp Number
const targetPhoneNumber = ref('6281211846570')

const toggleEnvelope = () => {
  if (!isOpen.value) {
    isOpen.value = true
    
    // Trigger celebratory confetti burst when opened
    confetti({
      particleCount: 90,
      spread: 95,
      origin: { y: 0.7 },
      colors: ['#E07A5F', '#D4A373', '#F4A261', '#E76F51', '#FFB703', '#FFFFFF']
    })
  } else {
    isOpen.value = false
  }
}

const openReplyModal = () => {
  isReplyModalOpen.value = true
}

const closeReplyModal = () => {
  isReplyModalOpen.value = false
}

const sendToWhatsApp = () => {
  const userText = customMessage.value.trim()
  const lines = []

  // 1. Pesan personal dari Nada
  if (userText) {
    lines.push('💌 *Pesan dari Nada:*')
    lines.push(`_${userText}_`)
    lines.push('')
  }

  // 2. Daftar rencana kencan yang dipilih di MemorySwipe
  if (selectedDates.value && selectedDates.value.length > 0) {
    lines.push('✨ *Rencana Kencan Pilihan Nada:*')
    selectedDates.value.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.icon || '📍'} ${item.title}`)
    })
    lines.push('')
    lines.push('Siap-siap jemput yaa sayang! 🥰❤️')
  } else if (!userText) {
    lines.push('makasii banyak yaa sayangg buat web ulang tahunnya, aku suka dan terharu bangett! ❤️')
  }

  const fullMessage = lines.join('\n')
  const encodedText = encodeURIComponent(fullMessage)
  const cleanPhone = targetPhoneNumber.value.replace(/[^0-9]/g, '')
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`

  window.open(waUrl, '_blank')
  closeReplyModal()
}
</script>

<style scoped>
.love-letter-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 16px 120px;
  position: relative;
  overflow: visible;
}

.letter-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 540px;
  margin-top: 40px;
  transition: margin-top 0.6s ease;
}

.letter-stage.is-open {
  margin-top: 380px;
}

@media (max-width: 640px) {
  .letter-stage.is-open {
    margin-top: 340px;
  }
}

.click-hint {
  margin-bottom: 24px;
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.4rem;
  color: var(--accent-color, #D4A373);
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  animation: bounceHint 2s infinite ease-in-out;
  user-select: none;
}

.opened-hint {
  animation: none;
  font-size: 1.15rem;
  color: var(--text-muted, #8A7E72);
}

/* ================= Envelope Container ================= */
.envelope-container {
  position: relative;
  width: 320px;
  height: 200px;
  background: #E8D8C8;
  border-radius: 8px;
  box-shadow: 0 16px 38px rgba(74, 64, 54, 0.18), 0 4px 12px rgba(74, 64, 54, 0.08);
  cursor: pointer;
  perspective: 1200px;
  transform-style: preserve-3d;
  user-select: none;
  overflow: visible;
  transition: transform 0.3s ease;
}

@media (min-width: 640px) {
  .envelope-container {
    width: 440px;
    height: 260px;
  }
}

.envelope-container:hover {
  transform: scale(1.02);
}

/* 1. Envelope Back Wall */
.envelope-back {
  position: absolute;
  inset: 0;
  background: #DFCEBD;
  border-radius: 8px;
  z-index: 1;
}

/* ================= 2. Letter Paper ================= */
.letter-paper {
  position: absolute;
  top: 10px;
  left: 14px;
  right: 14px;
  background: #FFFFFF;
  border: 1px solid rgba(212, 163, 115, 0.35);
  border-radius: 8px;
  padding: 24px 20px 22px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
  transition: 
    transform 0.85s cubic-bezier(0.34, 1.4, 0.64, 1),
    opacity 0.4s ease,
    visibility 0.4s ease,
    box-shadow 0.6s ease;
  pointer-events: none;
}

@media (min-width: 640px) {
  .letter-paper {
    left: 20px;
    right: 20px;
    padding: 26px 24px 24px 24px;
  }
}

/* Active Open: Letter slides UP out of the envelope */
.envelope-container.is-open .letter-paper {
  opacity: 1;
  visibility: visible;
  transform: translateY(-90%) scale(1.02);
  z-index: 25;
  box-shadow: 0 24px 48px rgba(74, 64, 54, 0.22), 0 6px 16px rgba(74, 64, 54, 0.1);
  pointer-events: auto;
  transition-delay: 0.2s;
}

@media (max-width: 640px) {
  .envelope-container.is-open .letter-paper {
    transform: translateY(-92%) scale(1.01);
  }
}

.washi-tape-letter {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%) rotate(-0.5deg);
  width: 70px;
  height: 18px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.85));
  border-left: 2px dashed rgba(255, 255, 255, 0.6);
  border-right: 2px dashed rgba(255, 255, 255, 0.6);
}

.letter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--border-light, rgba(212, 163, 115, 0.4));
  padding-bottom: 8px;
}

.letter-badge {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-color, #D4A373);
}

.letter-heart {
  font-size: 1.1rem;
}

.letter-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(1.65rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.15;
}

.letter-body {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.9rem;
  color: var(--text-main, #4A4036);
  line-height: 1.65;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.letter-highlight {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--accent-color, #D4A373);
  line-height: 1.3;
}

.letter-footer {
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-light, rgba(212, 163, 115, 0.4));
  display: flex;
  flex-direction: column;
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.3rem;
  color: var(--text-muted, #8A7E72);
}

.letter-sign {
  font-weight: 700;
  color: var(--accent-color, #D4A373);
}

/* Simple "Balas" Button inside Letter */
.letter-reply-action {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

.btn-wa-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 28px;
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-wa-letter:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.45);
}

.wa-btn-icon {
  font-size: 1.1rem;
}

/* ================= 3. Front Flaps / Pockets ================= */
.pocket-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 100px 0 100px 160px;
  border-color: transparent transparent transparent #E4D2C0;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  z-index: 3;
  pointer-events: none;
}

.pocket-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 100px 160px 100px 0;
  border-color: transparent #E4D2C0 transparent transparent;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  z-index: 3;
  pointer-events: none;
}

.pocket-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 160px 120px 160px;
  border-color: transparent transparent #D9C5B2 transparent;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 4;
  pointer-events: none;
}

@media (min-width: 640px) {
  .pocket-left {
    border-width: 130px 0 130px 220px;
  }
  .pocket-right {
    border-width: 130px 220px 130px 0;
  }
  .pocket-bottom {
    border-width: 0 220px 150px 220px;
  }
}

/* ================= 4. Top Flap (Opens Upwards) ================= */
.flap-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 120px 160px 0 160px;
  border-color: #EBDCCF transparent transparent transparent;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transform-origin: top center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.2s ease;
  z-index: 5;
}

@media (min-width: 640px) {
  .flap-top {
    border-width: 150px 220px 0 220px;
  }
}

.envelope-container.is-open .flap-top {
  transform: rotateX(180deg);
  z-index: 1;
}

/* ================= 5. Wax Seal ================= */
.wax-seal {
  position: absolute;
  top: 95px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: radial-gradient(circle, #E07A5F 0%, #C85A3D 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(224, 122, 95, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.4);
  z-index: 6;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

@media (min-width: 640px) {
  .wax-seal {
    top: 120px;
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }
}

.envelope-container.is-open .wax-seal {
  transform: translate(-50%, -50%) scale(0.85);
  opacity: 0.9;
}

/* ================= WhatsApp Modal ================= */
.wa-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(74, 64, 54, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 16px;
}

.wa-modal-card {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: var(--polaroid-bg, #ffffff);
  border-radius: 16px;
  padding: 30px 22px 22px;
  box-shadow: 0 24px 60px rgba(74, 64, 54, 0.25);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.washi-tape-modal {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(0.8deg);
  width: 86px;
  height: 22px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.85));
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
}

.modal-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.modal-emoji {
  font-size: 2rem;
}

.modal-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.1;
}

.modal-desc {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  color: var(--text-muted, #8A7E72);
}

.input-wrap {
  width: 100%;
}

.wa-textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(212, 163, 115, 0.4);
  background: var(--bg-primary, #FAF6F0);
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.88rem;
  color: var(--text-main, #4A4036);
  resize: none;
  outline: none;
  box-sizing: border-box;
}

.wa-textarea:focus {
  border-color: #25D366;
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.2);
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 10px 18px;
  background: transparent;
  border: 1px solid rgba(212, 163, 115, 0.4);
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted, #8A7E72);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: var(--bg-secondary, #F3EAE3);
  color: var(--text-main, #4A4036);
}

.btn-send-wa {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
  transition: all 0.25s ease;
}

.btn-send-wa:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

/* Modal Transition */
.modal-pop-enter-active, .modal-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-pop-enter-from, .modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

@keyframes bounceHint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
