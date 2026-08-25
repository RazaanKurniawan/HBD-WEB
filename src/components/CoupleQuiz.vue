<template>
  <div class="couple-quiz-section">
    <!-- Header Section -->
    <div class="quiz-header">
      <div class="quiz-badge">
        <span>🧩</span>
        <span>Couple Trivia Challenge</span>
      </div>
      <h2 class="quiz-main-title">seberapa kenal kamu sama cerita kita?</h2>
      <p class="quiz-main-subtitle">
        ayo buktikan seberapa tajam ingatanmu tentang momen-momen manis kita, Nada! 😜✨
      </p>
    </div>

    <!-- Container Card (Scrapbook Glassmorphism Style) -->
    <div class="quiz-card-container">
      <div class="washi-tape-quiz"></div>

      <!-- ================= 1. START SCREEN ================= -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="gameState === 'start'" key="start" class="screen-start">
          <div class="start-icon-wrap">
            <span class="animated-heart-icon">💖</span>
          </div>
          <h3 class="start-title">Ujian Kelulusan Pacar Tersayang 📜</h3>
          <p class="start-desc">
            Ada <strong>6 Pertanyaan tentang perjalanan kita berdua</strong>. Harus bener semua yah, kalo ada yang salah brrti kamu tida sayang aku! 😜❤️
          </p>

          <div class="rules-chips">
            <div class="chip">✨ 6 Soal Manis</div>
            <div class="chip">⚡ Harus Bener Semua!</div>
            <div class="chip">🏆 Hadiah Sertifikat Cinta</div>
          </div>

          <button class="btn-quiz-primary" @click="startQuiz">
            <span>Mulai Kuis Cinta</span>
            <span class="btn-arrow">🚀</span>
          </button>
        </div>

        <!-- ================= 2. QUESTION SCREEN ================= -->
        <div v-else-if="gameState === 'playing'" key="playing" class="screen-playing">
          <!-- Progress Header -->
          <div class="quiz-progress-bar-wrap">
            <div class="progress-info">
              <span class="progress-step">Pertanyaan {{ currentQuestionIndex + 1 }} dari {{ questions.length }}</span>
              <span class="progress-score-preview">Skor: {{ Math.round((score / questions.length) * 100) }}%</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Question Content -->
          <div class="question-box" :class="{ 'shake-question': isCurrentWrong }">
            <div class="question-category-tag">
              <span>{{ currentQuestion.tag }}</span>
            </div>
            <h3 class="question-text">{{ currentQuestion.question }}</h3>
          </div>

          <!-- Answer Options Grid -->
          <div class="options-grid">
            <button
              v-for="(option, optIdx) in currentQuestion.options"
              :key="optIdx"
              class="quiz-option-btn"
              :class="{
                'selected-correct': answered && isOptionCorrect(optIdx),
                'selected-wrong': answered && selectedAnswer === optIdx && !isOptionCorrect(optIdx),
                'dimmed': answered && selectedAnswer !== optIdx && !isOptionCorrect(optIdx)
              }"
              :disabled="answered"
              @click="handleSelectOption(optIdx)"
            >
              <div class="option-letter">{{ ['A', 'B', 'C', 'D'][optIdx] }}</div>
              <span class="option-label">{{ option }}</span>
              <span v-if="answered && isOptionCorrect(optIdx)" class="option-status-icon">✅</span>
              <span v-else-if="answered && selectedAnswer === optIdx && !isOptionCorrect(optIdx)" class="option-status-icon">❌</span>
            </button>
          </div>

          <!-- Feedback Reveal Banner -->
          <transition name="pop-feedback">
            <div v-if="answered" class="feedback-banner" :class="isCorrect ? 'feedback-success' : 'feedback-fail'">
              <div class="feedback-icon">{{ isCorrect ? '🎉' : '😜' }}</div>
              <div class="feedback-body">
                <p class="feedback-verdict">
                  {{ isCorrect ? 'Tepat Banget Sayangku! 💖' : 'Yahh Salah! Kamu Gak Sayang Aku Ya? 🙈' }}
                </p>
                <p class="feedback-desc">{{ currentQuestion.explanation }}</p>
              </div>
            </div>
          </transition>

          <!-- Next Button -->
          <div v-if="answered" class="next-action-wrap">
            <button class="btn-quiz-next" @click="handleNextQuestion">
              <span>{{ currentQuestionIndex < questions.length - 1 ? 'Lanjut Pertanyaan Berikutnya' : 'Lihat Hasil Akhir 🎉' }}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- ================= 3. RESULT & CERTIFICATE SCREEN ================= -->
        <div v-else-if="gameState === 'result'" key="result" class="screen-result">
          <!-- Trophy Badge -->
          <div class="result-badge-wrap">
            <span class="trophy-emoji">{{ scoreGrade.icon }}</span>
          </div>

          <h3 class="result-title">{{ scoreGrade.title }}</h3>
          <p class="result-subtitle">{{ scoreGrade.message }}</p>

          <!-- Score Card -->
          <div class="score-pills-row">
            <div class="score-pill">
              <span class="pill-label">Jawaban Benar</span>
              <strong class="pill-value text-accent">{{ score }} / {{ questions.length }}</strong>
            </div>
            <div class="score-pill">
              <span class="pill-label">Tingkat Cinta</span>
              <strong class="pill-value text-pink">1000% Sayang</strong>
            </div>
          </div>

          <!-- THE CERTIFICATE OF LOVE -->
          <div id="love-certificate" class="certificate-frame">
            <div class="cert-outer-border">
              <div class="cert-inner-border">
                <!-- Corner Ornaments -->
                <div class="cert-corner top-left">❦</div>
                <div class="cert-corner top-right">❦</div>
                <div class="cert-corner bottom-left">❦</div>
                <div class="cert-corner bottom-right">❦</div>

                <!-- Cert Header -->
                <div class="cert-header">
                  <span class="cert-tagline">OFFICIAL CERTIFICATE OF LOVE & SWEET MEMORIES</span>
                  <h4 class="cert-main-heading">SERTIFIKAT KELULUSAN CINTA</h4>
                  <div class="cert-divider-line"></div>
                </div>

                <!-- Cert Body -->
                <div class="cert-body">
                  <p class="cert-presented">Sertifikat ini dengan penuh rasa sayang dipersembahkan kepada:</p>
                  <h2 class="cert-recipient-name">Nada Nazmi Nurlaila</h2>
                  <p class="cert-achievement">
                    Telah berhasil menyelesaikan <em>Couple Trivia Challenge</em> dengan predikat:
                  </p>
                  <div class="cert-rank-badge">
                    <span>👑 {{ scoreGrade.certBadge }}</span>
                  </div>
                  <p class="cert-legal-text">
                    Berhak mendapatkan limpahan kasih sayang tanpa batas, pelukan hangat tanpa syarat, 
                    dan traktiran bahagia dari pacar paling beruntung di dunia.
                  </p>
                </div>

                <!-- Cert Footer Signatures & Seal -->
                <div class="cert-footer">
                  <div class="cert-sign-col">
                    <span class="cert-date-text">{{ formattedToday }}</span>
                    <div class="cert-sign-line"></div>
                    <span class="cert-sign-title">Tanggal Penerbitan</span>
                  </div>

                  <div class="cert-seal">
                    <div class="wax-seal">
                      <span class="seal-icon">💌</span>
                      <span class="seal-text">VERIFIED LOVE</span>
                    </div>
                  </div>

                  <div class="cert-sign-col">
                    <span class="cert-signature-name">Razaan Kurniawan P.</span>
                    <div class="cert-sign-line"></div>
                    <span class="cert-sign-title">Pacar & Pengagum Utamamu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="result-actions">
            <button class="btn-download-cert" :disabled="isDownloading" @click="downloadCertificate">
              <span>{{ isDownloading ? 'Menyiapkan Gambar...' : '📥 Download Sertifikat (PNG)' }}</span>
            </button>
            <button class="btn-celebrate" @click="triggerCelebrationConfetti">
              <span>🎉 Hujan Konfeti Lagi!</span>
            </button>
            <button class="btn-quiz-secondary" @click="restartQuiz">
              <span>🔄 Main Ulang Kuis</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'

// ================= State Management =================
const gameState = ref('start') // 'start' | 'playing' | 'result'
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const answered = ref(false)
const score = ref(0)
const isCurrentWrong = ref(false)
const isDownloading = ref(false)

// ================= 6 Questions Data (Revisi Lengkap) =================
const questions = ref([
  {
    id: 1,
    tag: '📅 Momen Bersejarah',
    question: 'Kapan tanggal jadian kita?',
    options: [
      '21 Juli 2021',
      '21 Agustus 2021',
      '17 Agustus 2021',
      '21 September 2021'
    ],
    correctIndex: 1,
    explanation: '21 Agustus 2021! Hari paling spesial di mana kita resmi jadian dan duniaku jadi penuh warna bareng kamu ✨💖'
  },
  {
    id: 2,
    tag: '🎵 Soundtrack Cinta',
    question: 'Apa Judul lagu Favorite kamu yang aku buat jadi Soundtrack Website?',
    options: [
      'Beautiful - Bazzi',
      'Until I Found You - Stephen Sanchez',
      'Perfect - Ed Sheeran',
      'Komang - Raim Laode'
    ],
    correctIndex: 0,
    explanation: "'Beautiful' by Bazzi! Karena lagu ini persis ngegambarin kamu yang selalu cantik setiap hari di mataku! 🎶"
  },
  {
    id: 3,
    tag: '💻 Kebiasaan Cowokmu',
    question: 'Kalo aku lagi sibuk main laptop berjam-jam, biasanya aku ngapain?',
    options: [
      'Gawe/Main Game',
      'Maraton nonton drama korea',
      'Scroll medsos seharian',
      'Tidur siang pura-pura sibuk'
    ],
    correctIndex: 0,
    explanation: 'Hehe gawe atau main game, tapi tenang aja pikiran & hatiku tetep nyangkut di kamu terus kok! 💻🎮❤️'
  },
  {
    id: 4,
    tag: '🎮 Momen Lucu Game',
    question: 'Reaksi kamu setelah kalah main Mobile Legends sama aku biasanya apa?',
    options: [
      'Merasa Bersalah (GAJE)',
      'Marah-marah ke Razaan',
      'Banting HP ke kasur',
      'Langsung uninstall aplikasi game'
    ],
    correctIndex: 0,
    explanation: 'Gaje bgt padahal jago tapi ngomong "ayangg maaf yaa jadi kalah gara-gara aku" GAJE bgt iw 😜'
  },
  {
    id: 5,
    tag: '🍜 Kencan Pertama',
    question: 'Tempat First Date kita dimana?',
    options: [
      'Mie Ayam Metland yang udah Tutup',
      'Steak Pa\'Raden',
      'Kopi Kenangan',
      'Oja Shabu & Grill'
    ],
    correctIndex: 0,
    explanation: 'Mie Ayam Metland yang legendaris walau sekarang udah tutup, tapi kenangan first date kita tetep abadi di hati! 🍜✨'
  },
  {
    id: 6,
    tag: '💖 Pertanyaan Paling Penting',
    question: 'Siapa orang di dunia ini yang paling sayang, paling cinta, dan paling bersyukur punya Nada?',
    options: [
      'Razaan Kurniawan Putra dong! 💖',
      'Razaan (versi ganteng)',
      'Razaan (versi pacar terbaik)',
      'SEMUA BENAR (Jelas Razaan!)'
    ],
    correctIndex: -1, // All options are correct
    explanation: 'Jelas Razaan dong! Gak ada yang bisa ngalahin rasa sayang dan cinta Razaan buat Nada! ❤️'
  }
])

// ================= Computed Properties =================
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const isOptionCorrect = (optIdx) => {
  if (currentQuestion.value.correctIndex === -1) return true
  return optIdx === currentQuestion.value.correctIndex
}

const isCorrect = computed(() => {
  if (selectedAnswer.value === null) return false
  return isOptionCorrect(selectedAnswer.value)
})

const scoreGrade = computed(() => {
  const finalScore = score.value
  if (finalScore === questions.value.length) {
    return {
      icon: '🏆',
      title: 'Skor Sempurna 100%! Luar Biasa!',
      message: 'Kamu inget semua detail perjalanan kita! Memang beneran jodoh terbaikku sedunia! 🥰✨',
      certBadge: 'Pacar Ter-Peka & Tersayang Kelas Platinum 🌟'
    }
  } else if (finalScore >= 4) {
    return {
      icon: '🌟',
      title: 'Hampir Sempurna! Hebat Banget!',
      message: 'Daya ingatmu tentang kita juara banget, makin cinta deh sama kamu! 💖',
      certBadge: 'Pacar Idaman Pengertian Kelas Emas 🥇'
    }
  } else {
    return {
      icon: '🥰',
      title: 'Tetap Lulus Karena Terlalu Cantik!',
      message: 'Walau ada yang salah dikit, dimaafin karena kamu tetep pacar tercantikku! Denda peluk yaa! 😜',
      certBadge: 'Juara 1 Kesayangan Razaan Selamanya 💖'
    }
  }
})

const formattedToday = computed(() => {
  const now = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return now.toLocaleDateString('id-ID', options)
})

// ================= Web Audio API Synthesizer =================
const playTone = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.08))
        gain.gain.setValueAtTime(0.12, ctx.currentTime + (i * 0.08))
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * 0.08) + 0.28)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + (i * 0.08))
        osc.stop(ctx.currentTime + (i * 0.08) + 0.3)
      })
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.25)
    } else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.12))
        gain.gain.setValueAtTime(0.15, ctx.currentTime + (i * 0.12))
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * 0.12) + 0.45)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + (i * 0.12))
        osc.stop(ctx.currentTime + (i * 0.12) + 0.5)
      })
    }
  } catch (e) {}
}

// ================= Game Handlers =================
const startQuiz = () => {
  gameState.value = 'playing'
  currentQuestionIndex.value = 0
  score.value = 0
  selectedAnswer.value = null
  answered.value = false
  isCurrentWrong.value = false
}

const handleSelectOption = (idx) => {
  if (answered.value) return
  selectedAnswer.value = idx
  answered.value = true

  if (isOptionCorrect(idx)) {
    score.value++
    playTone('correct')
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#ff6b8b', '#ff8e53', '#6ee7b7', '#fbcfe8']
    })
  } else {
    isCurrentWrong.value = true
    playTone('wrong')
  }
}

const handleNextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    answered.value = false
    isCurrentWrong.value = false
  } else {
    gameState.value = 'result'
    playTone('fanfare')
    triggerCelebrationConfetti()
  }
}

const restartQuiz = () => {
  startQuiz()
}

const triggerCelebrationConfetti = () => {
  const duration = 2.5 * 1000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ff4d79', '#ff9a9e', '#fecfef', '#a1c4fd', '#ffd166']
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ff4d79', '#ff9a9e', '#fecfef', '#a1c4fd', '#ffd166']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
}

// ================= HTML5 Canvas Certificate Generator =================
const downloadCertificate = () => {
  isDownloading.value = true

  const canvas = document.createElement('canvas')
  const width = 1200
  const height = 850
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 1. Background Cream Paper Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#fffdf9')
  bgGrad.addColorStop(0.5, '#fef6ee')
  bgGrad.addColorStop(1, '#fff5f5')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Outer Ornamental Border
  ctx.strokeStyle = '#d4af37' // Rich Gold
  ctx.lineWidth = 14
  ctx.strokeRect(30, 30, width - 60, height - 60)

  // Thin inner gold border
  ctx.strokeStyle = '#e2c974'
  ctx.lineWidth = 3
  ctx.strokeRect(45, 45, width - 90, height - 90)

  // Delicate inner dashed pink/gold line
  ctx.setLineDash([8, 6])
  ctx.strokeStyle = 'rgba(255, 107, 139, 0.4)'
  ctx.lineWidth = 2
  ctx.strokeRect(55, 55, width - 110, height - 110)
  ctx.setLineDash([])

  // 3. Corner Decorations
  ctx.font = '32px serif'
  ctx.fillStyle = '#d4af37'
  ctx.textAlign = 'center'
  ctx.fillText('❦', 75, 85)
  ctx.fillText('❦', width - 75, 85)
  ctx.fillText('❦', 75, height - 70)
  ctx.fillText('❦', width - 75, height - 70)

  // 4. Header Tagline
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#9b7e23'
  ctx.fillText('OFFICIAL CERTIFICATE OF LOVE & SWEET MEMORIES', width / 2, 115)

  // 5. Main Title
  ctx.font = 'bold 42px "Plus Jakarta Sans", Georgia, serif'
  ctx.fillStyle = '#2b1b17'
  ctx.fillText('SERTIFIKAT KELULUSAN CINTA', width / 2, 175)

  // Decorative Ribbon Divider
  const divGrad = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0)
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)')
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 1)')
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)')
  ctx.fillStyle = divGrad
  ctx.fillRect(width / 2 - 180, 195, 360, 4)

  // 6. Presentation Text
  ctx.font = 'italic 20px "Plus Jakarta Sans", serif'
  ctx.fillStyle = '#6b5e59'
  ctx.fillText('Sertifikat ini dengan penuh rasa sayang dipersembahkan kepada:', width / 2, 250)

  // 7. Recipient Name
  ctx.font = 'bold 52px "Plus Jakarta Sans", Georgia, serif'
  ctx.fillStyle = '#e11d48'
  ctx.fillText('Nada Nazmi Nurlaila', width / 2, 325)

  // 8. Achievement Line
  ctx.font = '18px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#4a3e3d'
  ctx.fillText('Telah berhasil menyelesaikan Couple Trivia Challenge dengan predikat:', width / 2, 385)

  // 9. Badge Box
  const badgeWidth = 540
  const badgeHeight = 52
  const badgeX = (width - badgeWidth) / 2
  const badgeY = 415

  ctx.fillStyle = 'rgba(255, 237, 213, 0.9)'
  ctx.strokeStyle = '#f97316'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 26)
  ctx.fill()
  ctx.stroke()

  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#c2410c'
  ctx.fillText(`👑 ${scoreGrade.value.certBadge}`, width / 2, badgeY + 34)

  // 10. Legal & Romantic text
  ctx.font = '17px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#574846'
  ctx.fillText('Berhak mendapatkan limpahan kasih sayang tanpa batas, pelukan hangat tanpa syarat,', width / 2, 510)
  ctx.fillText('dan traktiran bahagia dari pacar paling beruntung di dunia.', width / 2, 540)

  // 11. Footer
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#2b1b17'
  ctx.fillText(formattedToday.value, 230, 680)

  ctx.strokeStyle = '#8c7b75'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(130, 695)
  ctx.lineTo(330, 695)
  ctx.stroke()

  ctx.font = '14px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#8c7b75'
  ctx.fillText('Tanggal Penerbitan', 230, 720)

  // Center: Wax Seal
  ctx.beginPath()
  ctx.arc(width / 2, 685, 45, 0, Math.PI * 2)
  ctx.fillStyle = '#e11d48'
  ctx.fill()
  ctx.strokeStyle = '#be123c'
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.font = '26px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('💌', width / 2, 680)
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('VERIFIED LOVE', width / 2, 705)

  // Right: Signature
  ctx.font = 'italic bold 22px Georgia, serif'
  ctx.fillStyle = '#1e3a8a'
  ctx.fillText('Razaan Kurniawan P.', width - 230, 680)

  ctx.strokeStyle = '#8c7b75'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(width - 330, 695)
  ctx.lineTo(width - 130, 695)
  ctx.stroke()

  ctx.font = '14px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#8c7b75'
  ctx.fillText('Pacar & Pengagum Utamamu', width - 230, 720)

  // 12. Download
  setTimeout(() => {
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Sertifikat-Cinta-Nada-Nazmi-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      isDownloading.value = false
    }
  }, 250)
}
</script>

<style scoped>
/* ================= Root Section Styles ================= */
.couple-quiz-section {
  width: 100%;
  max-width: 900px;
  margin: 70px auto;
  padding: 0 20px;
  position: relative;
}

/* Header */
.quiz-header {
  text-align: center;
  margin-bottom: 32px;
}

.quiz-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(224, 122, 95, 0.12);
  color: #E07A5F;
  border: 1px dashed rgba(224, 122, 95, 0.4);
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.quiz-main-title {
  font-family: 'Caveat', cursive;
  font-size: clamp(2.4rem, 5.5vw, 3.6rem);
  font-weight: 700;
  color: #4A4036 !important;
  margin-bottom: 6px;
  line-height: 1.15;
  text-shadow: 1px 1px 2px rgba(74, 64, 54, 0.06);
}

.quiz-main-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: #8A7E72 !important;
  max-width: 580px;
  margin: 0 auto;
}

/* ================= Main Container Card ================= */
.quiz-card-container {
  background: #ffffff !important;
  border: 1px solid rgba(212, 163, 115, 0.4) !important;
  border-radius: 28px;
  padding: 40px 32px;
  box-shadow: 0 16px 40px rgba(74, 64, 54, 0.1) !important;
  position: relative;
  transition: all 0.3s ease;
}

/* Cute Washi Tape Decor on Top of Card */
.washi-tape-quiz {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%) rotate(-1deg);
  width: 140px;
  height: 28px;
  background: rgba(255, 182, 193, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-left: 4px dashed rgba(255, 255, 255, 0.6);
  border-right: 4px dashed rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 10;
}

/* ================= 1. START SCREEN ================= */
.screen-start {
  text-align: center;
  padding: 20px 10px;
}

.start-icon-wrap {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 25px rgba(255, 107, 139, 0.3);
}

.animated-heart-icon {
  font-size: 2.2rem;
  animation: pulse-heart 1.5s infinite ease-in-out;
}

@keyframes pulse-heart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.start-title {
  font-family: 'Caveat', cursive;
  font-size: 2.2rem;
  font-weight: 700;
  color: #4A4036 !important;
  margin-bottom: 12px;
}

.start-desc {
  font-size: 1.05rem;
  color: #6b5e59 !important;
  max-width: 540px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.rules-chips {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.chip {
  background: rgba(224, 122, 95, 0.1);
  border: 1px solid rgba(224, 122, 95, 0.3);
  color: #c2410c;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
}

/* Primary Button */
.btn-quiz-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ff4d79 0%, #ff758c 100%);
  color: #ffffff;
  border: none;
  padding: 14px 36px;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(255, 77, 121, 0.4);
  transition: all 0.25s ease;
}

.btn-quiz-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px -5px rgba(255, 77, 121, 0.5);
}

.btn-quiz-primary:active {
  transform: translateY(0);
}

/* ================= 2. PLAYING SCREEN ================= */
.screen-playing {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-progress-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
}

.progress-track {
  width: 100%;
  height: 9px;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9a9e 0%, #ff4d79 100%);
  border-radius: 9999px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-box {
  background: #fff5f5;
  border: 1px solid rgba(255, 182, 193, 0.8);
  border-radius: 20px;
  padding: 24px 28px;
  text-align: center;
  transition: transform 0.2s ease;
}

.question-category-tag {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #e11d48;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.question-text {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 800;
  color: #1e293b;
  line-height: 1.4;
}

.shake-question {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 640px) {
  .options-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.quiz-option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  padding: 16px 20px;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.quiz-option-btn:not(:disabled):hover {
  transform: translateY(-2px);
  border-color: #ff758c;
  background: #fff5f7;
  box-shadow: 0 6px 16px rgba(255, 117, 140, 0.15);
}

.option-letter {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.option-label {
  font-size: 0.98rem;
  font-weight: 600;
  color: #334155;
  flex: 1;
  line-height: 1.35;
}

.option-status-icon {
  font-size: 1.1rem;
}

.quiz-option-btn.selected-correct {
  border-color: #10b981 !important;
  background: #ecfdf5 !important;
  box-shadow: 0 0 0 1px #10b981, 0 6px 20px rgba(16, 185, 129, 0.2);
}

.quiz-option-btn.selected-correct .option-letter {
  background: #10b981;
  color: #ffffff;
}

.quiz-option-btn.selected-wrong {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
  animation: shake 0.35s ease-in-out;
}

.quiz-option-btn.selected-wrong .option-letter {
  background: #ef4444;
  color: #ffffff;
}

.quiz-option-btn.dimmed {
  opacity: 0.45;
  cursor: default;
}

.feedback-banner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  margin-top: 4px;
}

.feedback-success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

.feedback-fail {
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #9f1239;
}

.feedback-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.feedback-verdict {
  font-weight: 700;
  font-size: 0.98rem;
  margin-bottom: 4px;
}

.feedback-desc {
  font-size: 0.92rem;
  line-height: 1.45;
  opacity: 0.95;
}

.next-action-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-quiz-next {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  transition: all 0.25s ease;
}

.btn-quiz-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(79, 70, 229, 0.4);
}

/* ================= 3. RESULT & CERTIFICATE SCREEN ================= */
.screen-result {
  text-align: center;
  padding: 10px 0;
}

.result-badge-wrap {
  width: 76px;
  height: 76px;
  margin: 0 auto 16px;
  background: #fef3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.25);
}

.trophy-emoji {
  font-size: 2.2rem;
  animation: bounce-trophy 1.2s infinite ease-in-out alternate;
}

@keyframes bounce-trophy {
  from { transform: translateY(-3px); }
  to { transform: translateY(3px); }
}

.result-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.result-subtitle {
  font-size: 1rem;
  color: #64748b;
  max-width: 500px;
  margin: 0 auto 24px;
  line-height: 1.5;
}

.score-pills-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.score-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 10px 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.pill-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.pill-value {
  font-size: 1.25rem;
  font-weight: 800;
}

.text-accent { color: #4f46e5; }
.text-pink { color: #e11d48; }

/* Certificate Frame */
.certificate-frame {
  background: linear-gradient(135deg, #fffdfa 0%, #fff7ed 50%, #fff1f2 100%);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 
    0 15px 35px -5px rgba(212, 175, 55, 0.25),
    0 0 0 1px rgba(212, 175, 55, 0.3);
  margin: 0 auto 32px;
  max-width: 720px;
  color: #2b1b17;
  position: relative;
  text-align: center;
}

.cert-outer-border {
  border: 4px solid #d4af37;
  border-radius: 14px;
  padding: 10px;
}

.cert-inner-border {
  border: 1.5px dashed rgba(212, 175, 55, 0.6);
  border-radius: 10px;
  padding: 24px 20px;
  position: relative;
}

.cert-corner {
  position: absolute;
  font-size: 1.4rem;
  color: #d4af37;
  line-height: 1;
}

.cert-corner.top-left { top: 6px; left: 8px; }
.cert-corner.top-right { top: 6px; right: 8px; }
.cert-corner.bottom-left { bottom: 6px; left: 8px; }
.cert-corner.bottom-right { bottom: 6px; right: 8px; }

.cert-tagline {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #9b7e23;
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
}

.cert-main-heading {
  font-family: Georgia, serif;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 800;
  color: #2b1b17;
  letter-spacing: 0.5px;
}

.cert-divider-line {
  width: 140px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  margin: 8px auto 16px;
}

.cert-presented {
  font-style: italic;
  font-size: 0.88rem;
  color: #6b5e59;
  margin-bottom: 6px;
}

.cert-recipient-name {
  font-family: Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #e11d48;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(225, 29, 72, 0.15);
}

.cert-achievement {
  font-size: 0.88rem;
  color: #4a3e3d;
  margin-bottom: 8px;
}

.cert-rank-badge {
  display: inline-block;
  background: rgba(254, 215, 170, 0.7);
  border: 1px solid #f97316;
  color: #c2410c;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 4px 16px;
  border-radius: 9999px;
  margin-bottom: 12px;
}

.cert-legal-text {
  font-size: 0.82rem;
  color: #574846;
  line-height: 1.45;
  max-width: 500px;
  margin: 0 auto 20px;
}

.cert-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
  padding-top: 10px;
}

.cert-sign-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
}

.cert-date-text {
  font-size: 0.82rem;
  font-weight: 700;
  color: #2b1b17;
}

.cert-signature-name {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e3a8a;
}

.cert-sign-line {
  width: 100%;
  height: 1px;
  background: #8c7b75;
  margin: 4px 0 3px;
}

.cert-sign-title {
  font-size: 0.68rem;
  color: #8c7b75;
}

.cert-seal {
  display: flex;
  justify-content: center;
}

.wax-seal {
  width: 54px;
  height: 54px;
  background: #e11d48;
  border: 2px solid #be123c;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(225, 29, 72, 0.4);
}

.seal-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.seal-text {
  font-size: 0.45rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-download-cert {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35);
  transition: all 0.25s ease;
}

.btn-download-cert:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(245, 158, 11, 0.45);
}

.btn-download-cert:disabled {
  opacity: 0.6;
  cursor: wait;
}

.btn-celebrate {
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  color: #ffffff;
  border: none;
  padding: 12px 22px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.35);
  transition: all 0.25s ease;
}

.btn-celebrate:hover {
  transform: translateY(-2px);
}

.btn-quiz-secondary {
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 12px 22px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-quiz-secondary:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.pop-feedback-enter-active {
  animation: pop-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-up {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
