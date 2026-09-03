<template>
  <div class="birthday-cake-section">
    <div class="cake-header">
      <div class="cake-badge">
        <span>🎂</span>
        <span>Virtual Birthday Cake</span>
      </div>
      <h2 class="cake-title">make a wish & tiup lilinnya yaa!</h2>
      <p class="cake-subtitle">
        {{ isBlown 
          ? 'semoga semua doa dan harapanmu terkabul yaa cantikk ✨' 
          : 'pejamkan mata, ucapkan doa dalam hati, lalu tiup lilinnya 👇' 
        }}
      </p>
    </div>

    <!-- The 3D/Layered CSS Birthday Cake Stage -->
    <div class="cake-stage" :class="{ 'cake-blown': isBlown }">
      <!-- Ambient Glow Behind Cake -->
      <div class="cake-glow" :class="{ 'glow-off': isBlown }"></div>

      <div class="cake-container">
        <!-- The Candle on Top -->
        <div class="candle">
          <!-- Candle Flame -->
          <div 
            v-if="!isBlown" 
            class="flame-wrap"
            :class="{ 'flame-fluttering': blowPowerPercent > 25 }"
            :style="{ transform: `scale(${Math.max(0.4, 1 - (blowPowerPercent / 120))})` }"
          >
            <div class="flame-glow"></div>
            <div class="flame-core"></div>
          </div>

          <!-- Smoke Wisps when blown -->
          <div v-else class="smoke-wrap">
            <span class="smoke smoke-1"></span>
            <span class="smoke smoke-2"></span>
            <span class="smoke smoke-3"></span>
          </div>

          <!-- Candle Stick -->
          <div class="candle-stick">
            <div class="stripe stripe-1"></div>
            <div class="stripe stripe-2"></div>
            <div class="stripe stripe-3"></div>
          </div>
        </div>

        <!-- Cake Plate / Stand -->
        <div class="cake-body">
          <!-- Top Tier -->
          <div class="cake-tier tier-top">
            <div class="frosting-top">
              <span class="berry berry-1">🍓</span>
              <span class="berry berry-2">🍒</span>
              <span class="berry berry-3">🍓</span>
            </div>
            <div class="drip-row">
              <span class="drip d1"></span>
              <span class="drip d2"></span>
              <span class="drip d3"></span>
              <span class="drip d4"></span>
              <span class="drip d5"></span>
            </div>
          </div>

          <!-- Bottom Tier -->
          <div class="cake-tier tier-bottom">
            <div class="cream-border"></div>
            <div class="sprinkles">
              <span class="sp s1"></span>
              <span class="sp s2"></span>
              <span class="sp s3"></span>
              <span class="sp s4"></span>
              <span class="sp s5"></span>
            </div>
          </div>

          <!-- Cake Stand Plate -->
          <div class="cake-plate"></div>
        </div>
      </div>
    </div>

    <!-- Interactive Blow Controls -->
    <div class="cake-controls">
      <div v-if="!isBlown" class="blow-actions">
        <!-- Tap to blow button -->
        <button class="btn-blow" @click="blowCandle">
          <span class="btn-icon">🌬️</span>
          <span class="btn-text">Tiup Lilin Sekarang</span>
          <span class="btn-sparkle">✨</span>
        </button>

        <!-- Mic Blow Option Button -->
        <button 
          class="btn-mic" 
          :class="{ 'mic-listening': isMicListening }"
          @click="toggleMicBlow"
        >
          <span>{{ isMicListening ? '🔴 Sedang Mendeteksi... (Tiup Kencang!)' : '🎙️ Tiup Pakai Suara Asli (Mic)' }}</span>
        </button>

        <!-- Live Blow Power Meter (Hanya muncul saat mic aktif) -->
        <div v-if="isMicListening" class="blow-meter-wrap">
          <div class="meter-info">
            <span class="meter-label">Kekuatan Tiupan:</span>
            <span class="meter-val">{{ Math.round(blowPowerPercent) }}%</span>
          </div>
          <div class="meter-bar-track">
            <!-- Target line at threshold -->
            <div class="meter-target-line" :style="{ left: `${BLOW_THRESHOLD_PERCENT}%` }">
              <span class="target-flag">Target Tiup 🔥</span>
            </div>
            <div 
              class="meter-bar-fill" 
              :style="{ width: `${Math.min(100, blowPowerPercent)}%` }"
              :class="{ 'target-reached': blowPowerPercent >= BLOW_THRESHOLD_PERCENT }"
            ></div>
          </div>
          <span class="meter-hint">
            {{ blowPowerPercent >= BLOW_THRESHOLD_PERCENT 
              ? 'Tahan tiupan sedikit lagiii! 💨' 
              : 'Dekatkan ke mic & tiup kencang (suara pelan tidak akan mematikan api yaa) 🌬️' 
            }}
          </span>
        </div>
      </div>

      <!-- After Blown: Wish Message Box & Relight Button -->
      <transition name="wish-fade">
        <div v-if="isBlown" class="wish-reveal-box">
          <div class="wish-card">
            <div class="washi-tape-wish"></div>
            <span class="wish-heart">🤍</span>
            <h3 class="wish-heading">Doa Terbaik untuk Nada:</h3>
            <p class="wish-text">
              "Semoga di usia yang baru ini, setiap langkah kamu dipenuhi keberkahan, 
              diberikan kesehatan, kebahagiaan yang melimpah, dan semua impian besar kamu tercapai satu per satu. 
              Aamiin ya rabbal 'aalamiin ✨"
            </p>
            <span class="wish-signature">— dari yang selalu mendoakanmu di setiap sujud</span>
            
            <button class="btn-relight" @click="relightCandle">
              <span>Nyalain Lilin Lagi 🔥</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'

const isBlown = ref(false)
const isMicListening = ref(false)
const blowPowerPercent = ref(0)

// ================= PENGATURAN KEKUATAN TIUPAN (THRESHOLD SANGAT KETAT) =================
// Rentang: 0 - 100%. 
// 88%: Butuh tiupan kencang dan dekat ke lubang mic. Suara obrolan / bising TIDAK akan mempan.
const BLOW_THRESHOLD_PERCENT = 88

// Butuh tiupan kencang konsisten selama minimal 16 frame (~300ms tiupan berkelanjutan)
let consecutiveStrongBlowCount = 0
const REQUIRED_CONSECUTIVE_FRAMES = 16

// Web Audio API
let audioContext = null
let analyser = null
let microphoneStream = null
let animationFrameId = null

const blowCandle = () => {
  if (isBlown.value) return
  isBlown.value = true
  blowPowerPercent.value = 0
  stopMicDetection()

  // Trigger grand celebration confetti
  triggerConfettiExplosion()
}

const relightCandle = () => {
  isBlown.value = false
  blowPowerPercent.value = 0
  consecutiveStrongBlowCount = 0
}

// Confetti burst for birthday cake
const triggerConfettiExplosion = () => {
  const duration = 2.5 * 1000
  const end = Date.now() + duration

  const colors = ['#E07A5F', '#D4A373', '#F4A261', '#E76F51', '#FFB703', '#FFFFFF']

  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

// Microphone Real Blow Detection Logic
const toggleMicBlow = async () => {
  if (isMicListening.value) {
    stopMicDetection()
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }, 
      video: false 
    })
    microphoneStream = stream
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.2

    const microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(analyser)

    isMicListening.value = true
    consecutiveStrongBlowCount = 0

    const timeData = new Uint8Array(analyser.fftSize)

    const processAudio = () => {
      if (!isMicListening.value || isBlown.value) return

      // Gunakan deviasi gelombang fisik Time-Domain (tekanan angin langsung pada diafragma mic)
      analyser.getByteTimeDomainData(timeData)

      let totalDeviation = 0
      for (let i = 0; i < timeData.length; i++) {
        totalDeviation += Math.abs(timeData[i] - 128)
      }
      const avgDeviation = totalDeviation / timeData.length // Rata-rata 0 - 128

      // Filter noise: Abaikan suara bising ruangan (deviasi di bawah 16 diabaikan)
      const filteredDeviation = Math.max(0, avgDeviation - 16)

      // Skala persentase (Butuh deviasi di atas 52 untuk mencapai 100%)
      const power = Math.min(100, Math.round((filteredDeviation / 46) * 100))
      blowPowerPercent.value = power

      // Cek apakah kekuatan tiupan sudah melampaui batas target dan konsisten
      if (power >= BLOW_THRESHOLD_PERCENT) {
        consecutiveStrongBlowCount++
        if (consecutiveStrongBlowCount >= REQUIRED_CONSECUTIVE_FRAMES) {
          blowCandle()
          return
        }
      } else {
        consecutiveStrongBlowCount = Math.max(0, consecutiveStrongBlowCount - 2)
      }

      animationFrameId = requestAnimationFrame(processAudio)
    }

    processAudio()
  } catch (err) {
    console.warn('Microphone permission denied or not supported:', err)
    alert('Izin mikrofon tidak diaktifkan. Kamu bisa menekan tombol "Tiup Lilin Sekarang" yaa!')
    stopMicDetection()
  }
}

const stopMicDetection = () => {
  isMicListening.value = false
  blowPowerPercent.value = 0
  consecutiveStrongBlowCount = 0

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (microphoneStream) {
    microphoneStream.getTracks().forEach((track) => track.stop())
    microphoneStream = null
  }
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close()
    audioContext = null
  }
}

onUnmounted(() => {
  stopMicDetection()
})
</script>

<style scoped>
.birthday-cake-section {
  width: 100%;
  max-width: 640px;
  margin: 50px auto 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  padding: 0 16px;
  position: relative;
}

.cake-header {
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.cake-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: var(--bg-secondary, #F3EAE3);
  border: 1px dashed var(--accent-color, #D4A373);
  border-radius: 999px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-color, #D4A373);
  text-transform: uppercase;
}

.cake-title {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: clamp(2.4rem, 6vw, 3.4rem);
  font-weight: 700;
  color: var(--text-main, #4A4036);
  line-height: 1.15;
}

.cake-subtitle {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.95rem;
  color: var(--text-muted, #8A7E72);
  max-width: 480px;
}

/* ================= The 3D Cake Stage ================= */
.cake-stage {
  position: relative;
  width: 300px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 30px;
}

.cake-glow {
  position: absolute;
  top: 20px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 183, 3, 0.35) 0%, rgba(224, 122, 95, 0.15) 50%, transparent 70%);
  filter: blur(16px);
  transition: opacity 0.8s ease;
  pointer-events: none;
}

.cake-glow.glow-off {
  opacity: 0;
}

.cake-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ================= Candle & Flame ================= */
.candle {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: -4px;
  z-index: 10;
}

.flame-wrap {
  position: relative;
  width: 16px;
  height: 28px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: flicker 1.8s infinite ease-in-out;
  transition: transform 0.15s ease-out;
}

.flame-fluttering {
  animation: flutterFast 0.2s infinite ease-in-out !important;
}

.flame-core {
  width: 14px;
  height: 26px;
  background: radial-gradient(ellipse at bottom, #FFD166 0%, #FF9F1C 40%, #E76F51 75%, transparent 100%);
  border-radius: 50% 50% 35% 35% / 60% 60% 40% 40%;
  box-shadow: 0 0 14px rgba(255, 183, 3, 0.8), 0 0 24px rgba(231, 111, 81, 0.6);
}

.flame-glow {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 209, 102, 0.5) 0%, transparent 70%);
  animation: pulseGlow 1.2s infinite ease-in-out;
}

/* Smoke when candle is blown */
.smoke-wrap {
  position: relative;
  width: 20px;
  height: 30px;
  margin-bottom: 2px;
}

.smoke {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 6px;
  height: 14px;
  background: rgba(140, 130, 122, 0.5);
  border-radius: 50%;
  filter: blur(2px);
  animation: smokeRise 1.8s forwards ease-out;
}

.smoke-1 { transform: translateX(-50%); animation-delay: 0s; }
.smoke-2 { transform: translateX(-30%); animation-delay: 0.2s; }
.smoke-3 { transform: translateX(-70%); animation-delay: 0.4s; }

.candle-stick {
  width: 10px;
  height: 38px;
  background: #FFF9F2;
  border-radius: 4px;
  border: 1px solid rgba(212, 163, 115, 0.5);
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.stripe {
  position: absolute;
  left: -4px;
  width: 18px;
  height: 4px;
  background: #E07A5F;
  transform: rotate(-35deg);
}
.stripe-1 { top: 6px; }
.stripe-2 { top: 16px; }
.stripe-3 { top: 26px; }

/* ================= Cake Body ================= */
.cake-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Top Tier */
.tier-top {
  position: relative;
  width: 150px;
  height: 60px;
  background: linear-gradient(to bottom, #FFF3E6 0%, #F5DEC9 100%);
  border-radius: 12px 12px 6px 6px;
  border: 1px solid rgba(212, 163, 115, 0.4);
  box-shadow: 0 4px 10px rgba(74, 64, 54, 0.08);
  z-index: 5;
}

.frosting-top {
  position: absolute;
  top: -14px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 10px;
  font-size: 1.15rem;
}

.drip-row {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.drip {
  width: 14px;
  height: 18px;
  background: #E07A5F;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(224, 122, 95, 0.2);
}
.d1 { height: 16px; }
.d2 { height: 22px; }
.d3 { height: 14px; }
.d4 { height: 20px; }
.d5 { height: 15px; }

/* Bottom Tier */
.tier-bottom {
  position: relative;
  width: 220px;
  height: 80px;
  background: linear-gradient(to bottom, #F9EDE1 0%, #EBD4BE 100%);
  border-radius: 14px 14px 8px 8px;
  border: 1px solid rgba(212, 163, 115, 0.45);
  margin-top: -6px;
  box-shadow: 0 6px 16px rgba(74, 64, 54, 0.1);
  z-index: 4;
}

.cream-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: repeating-linear-gradient(
    90deg,
    #ffffff 0,
    #ffffff 12px,
    #E07A5F 12px,
    #E07A5F 16px
  );
  border-radius: 4px;
  opacity: 0.8;
}

.sprinkles {
  position: absolute;
  inset: 0;
}

.sp {
  position: absolute;
  width: 6px;
  height: 3px;
  border-radius: 2px;
}
.s1 { top: 25px; left: 30px; background: #E07A5F; transform: rotate(20deg); }
.s2 { top: 45px; left: 70px; background: #2A9D8F; transform: rotate(-35deg); }
.s3 { top: 30px; right: 40px; background: #E76F51; transform: rotate(45deg); }
.s4 { top: 55px; right: 80px; background: #D4A373; transform: rotate(15deg); }
.s5 { top: 40px; left: 110px; background: #E07A5F; transform: rotate(-20deg); }

/* Plate */
.cake-plate {
  width: 260px;
  height: 16px;
  background: #FFFFFF;
  border-radius: 50%;
  border: 2px solid rgba(212, 163, 115, 0.5);
  box-shadow: 0 8px 20px rgba(74, 64, 54, 0.12);
  margin-top: -8px;
  z-index: 3;
}

/* ================= Controls ================= */
.cake-controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.blow-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 440px;
}

.btn-blow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #E07A5F 0%, #D4A373 100%);
  color: #ffffff;
  border-radius: 999px;
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 28px rgba(224, 122, 95, 0.4);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  border: none;
  animation: pulseBlow 2s infinite;
}

.btn-blow:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 14px 34px rgba(224, 122, 95, 0.55);
}

.btn-mic {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted, #8A7E72);
  background: var(--bg-secondary, #F3EAE3);
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px dashed var(--border-light, rgba(212, 163, 115, 0.5));
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-mic:hover {
  color: var(--text-main, #4A4036);
  border-color: var(--accent-color, #D4A373);
}

.btn-mic.mic-listening {
  color: #e07a5f;
  border-color: #e07a5f;
  background: #FFF2EE;
  animation: pulseMic 1.4s infinite;
}

/* ================= Live Blow Meter ================= */
.blow-meter-wrap {
  width: 100%;
  background: var(--bg-secondary, #F3EAE3);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease;
}

.meter-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main, #4A4036);
}

.meter-val {
  color: #e07a5f;
  font-size: 0.95rem;
}

.meter-bar-track {
  position: relative;
  width: 100%;
  height: 14px;
  background: rgba(212, 163, 115, 0.25);
  border-radius: 999px;
  overflow: visible;
}

.meter-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #F4A261 0%, #E07A5F 100%);
  transition: width 0.08s ease-out;
}

.meter-bar-fill.target-reached {
  background: linear-gradient(90deg, #E07A5F 0%, #2A9D8F 100%);
  box-shadow: 0 0 10px rgba(42, 157, 143, 0.6);
}

.meter-target-line {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 2px;
  background: #2A9D8F;
  z-index: 5;
}

.target-flag {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.68rem;
  font-weight: 800;
  color: #2A9D8F;
  white-space: nowrap;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
}

.meter-hint {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.76rem;
  color: var(--text-muted, #8A7E72);
  text-align: center;
  line-height: 1.3;
}

/* ================= Wish Reveal Box ================= */
.wish-reveal-box {
  width: 100%;
  margin-top: 10px;
}

.wish-card {
  position: relative;
  background: var(--polaroid-bg, #ffffff);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  border-radius: 16px;
  padding: 36px 26px;
  text-align: center;
  box-shadow: 0 16px 40px rgba(74, 64, 54, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.washi-tape-wish {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(-0.6deg);
  width: 86px;
  height: 22px;
  background-color: var(--tape-color, rgba(220, 207, 189, 0.8));
  border-left: 2px dashed rgba(255, 255, 255, 0.5);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
}

.wish-heart {
  font-size: 2rem;
}

.wish-heading {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-color, #D4A373);
}

.wish-text {
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.95rem;
  color: var(--text-main, #4A4036);
  line-height: 1.7;
}

.wish-signature {
  font-family: var(--font-handwriting, 'Caveat', cursive);
  font-size: 1.3rem;
  color: var(--text-muted, #8A7E72);
}

.btn-relight {
  margin-top: 8px;
  padding: 8px 20px;
  font-family: var(--font-ui, 'Plus Jakarta Sans', sans-serif);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted, #8A7E72);
  background: var(--bg-secondary, #F3EAE3);
  border: 1px solid var(--border-light, rgba(212, 163, 115, 0.4));
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-relight:hover {
  color: #e07a5f;
  border-color: #e07a5f;
  background: #ffffff;
}

/* ================= Keyframe Animations ================= */
@keyframes flicker {
  0%, 100% { transform: scale(1) rotate(-1deg); }
  25% { transform: scale(1.08, 0.95) rotate(2deg); }
  50% { transform: scale(0.92, 1.05) rotate(-2deg); }
  75% { transform: scale(1.05, 0.98) rotate(1deg); }
}

@keyframes flutterFast {
  0%, 100% { transform: scale(0.7, 0.6) rotate(-8deg) translateY(2px); }
  50% { transform: scale(0.5, 0.4) rotate(10deg) translateY(4px); }
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 0.8; }
}

@keyframes pulseBlow {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 28px rgba(224, 122, 95, 0.4); }
  50% { transform: scale(1.04); box-shadow: 0 14px 34px rgba(224, 122, 95, 0.6); }
}

@keyframes pulseMic {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes smokeRise {
  0% { transform: translate(-50%, 0) scale(0.6); opacity: 0.8; }
  50% { transform: translate(-40%, -20px) scale(1.2); opacity: 0.5; }
  100% { transform: translate(-60%, -45px) scale(2); opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.wish-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.wish-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
</style>
