<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-content">
        <div class="badge">
          <span>✨</span>
          <span>Vue 3 + Vite + Pinia + Vue Router</span>
        </div>
        
        <h1 class="hero-title">
          Bangun Aplikasi Web Cepat & <span class="gradient-text">Modern</span>
        </h1>
        
        <p class="hero-subtitle">
          Setup siap pakai dengan arsitektur bersih, state management terintegrasi, client-side routing, dan styling Vanilla CSS modern.
        </p>

        <div class="hero-buttons">
          <router-link to="/about" class="btn btn-primary">
            Pelajari Lebih Lanjut 🚀
          </router-link>
          <a href="https://vuejs.org/guide/introduction.html" target="_blank" rel="noreferrer" class="btn btn-secondary">
            Dokumentasi Vue ↗
          </a>
        </div>
      </div>
    </section>

    <!-- Interactive Pinia Store Demo -->
    <section class="demo-section">
      <div class="container">
        <div class="glass-card demo-card">
          <div class="demo-header">
            <h3>⚡ Demo Interaktif Pinia Store</h3>
            <p>State ini dikelola secara global menggunakan Pinia</p>
          </div>

          <div class="counter-display">
            <div class="count-number">{{ appStore.count }}</div>
            <div class="count-label">Global Counter</div>
          </div>

          <div class="counter-controls">
            <button @click="appStore.decrement" class="btn btn-secondary">➖ Kurang</button>
            <button @click="appStore.resetCount" class="btn btn-secondary">🔄 Reset</button>
            <button @click="appStore.increment" class="btn btn-primary">➕ Tambah</button>
          </div>

          <div class="message-box">
            <label for="msg-input">Pesan Global Reaktif:</label>
            <input 
              id="msg-input"
              v-model="appStore.message" 
              type="text" 
              class="form-input" 
              placeholder="Ketik pesan disini..."
            />
            <p class="live-preview">Preview: <span>{{ appStore.message }}</span></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Grid -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Fitur & Arsitektur Utama</h2>
        
        <div class="features-grid">
          <div class="glass-card feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Vite Bundler</h3>
            <p>Hot Module Replacement (HMR) super kilat dan performa build yang dioptimalkan untuk produksi.</p>
          </div>

          <div class="glass-card feature-card">
            <div class="feature-icon">🧩</div>
            <h3>Vue 3 Composition API</h3>
            <p>Menggunakan sintaks modern <code>&lt;script setup&gt;</code> untuk reaktivitas yang lebih efisien dan modular.</p>
          </div>

          <div class="glass-card feature-card">
            <div class="feature-icon">🍍</div>
            <h3>Pinia State Management</h3>
            <p>Penyimpanan state global yang intuitif, modular, ringan, dan mendukung type-safety & devtools.</p>
          </div>

          <div class="glass-card feature-card">
            <div class="feature-icon">🧭</div>
            <h3>Vue Router 4</h3>
            <p>Manajemen navigasi SPA yang mulus dengan meta title, scroll behavior, dan dynamic routes.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
</script>

<style scoped>
.home-page {
  padding-bottom: 60px;
}

.hero-section {
  padding: 80px 0 40px;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
}

/* Demo Card */
.demo-section {
  margin: 40px 0;
}

.demo-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  text-align: center;
}

.demo-header h3 {
  font-size: 1.3rem;
  margin-bottom: 6px;
}

.demo-header p {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.counter-display {
  margin: 24px 0 16px;
}

.count-number {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.count-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.message-box {
  text-align: left;
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.message-box label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.live-preview {
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.live-preview span {
  font-weight: 600;
  color: var(--text-primary);
}

/* Features */
.features-section {
  padding: 40px 0;
}

.section-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card h3 {
  font-size: 1.15rem;
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.feature-card code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>
