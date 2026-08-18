<template>
  <div class="about-page">
    <div class="container about-content">
      <div class="badge">
        <span>📖</span>
        <span>Dokumentasi Project</span>
      </div>

      <h1 class="page-title">Tentang <span class="gradient-text">Project Vue</span> Ini</h1>
      
      <p class="page-desc">
        Project ini di-setup menggunakan standar modern ekosistem Vue 3 dengan fokus pada performa, fleksibilitas styling Vanilla CSS, serta skalabilitas struktur folder.
      </p>

      <div class="glass-card info-card">
        <h3>📂 Struktur Direktori</h3>
        <div class="tree-view">
          <pre><code>src/
├── assets/         # Asset statis (gambar, icon, dll)
├── components/     # Komponen UI modular & reusable (Navbar, Footer, dll)
├── router/         # Konfigurasi Vue Router (rute SPA)
├── stores/         # Pinia global state stores
├── views/          # Halaman utama aplikasi (HomeView, AboutView)
├── App.vue         # Shell utama aplikasi
├── main.js         # Entry point aplikasi (Inisialisasi Vue, Pinia, Router)
└── style.css       # Design system Vanilla CSS (variables, themes, utilities)</code></pre>
        </div>
      </div>

      <div class="glass-card info-card">
        <h3>🚀 Cara Menjalankan Project</h3>
        <div class="command-list">
          <div class="command-item">
            <span class="cmd-label">Menjalankan Development Server:</span>
            <code>npm run dev</code>
          </div>
          <div class="command-item">
            <span class="cmd-label">Membangun Bundle Production:</span>
            <code>npm run build</code>
          </div>
          <div class="command-item">
            <span class="cmd-label">Meninjau Hasil Build Secara Lokal:</span>
            <code>npm run preview</code>
          </div>
        </div>
      </div>

      <div class="actions">
        <router-link to="/" class="btn btn-primary">
          ⬅ Kembali ke Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 60px 0 80px;
}

.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
}

.page-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  text-align: center;
}

.page-desc {
  font-size: 1.05rem;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.6;
}

.info-card {
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card h3 {
  font-size: 1.2rem;
}

.tree-view {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 16px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.tree-view pre {
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.command-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.command-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (min-width: 640px) {
  .command-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.cmd-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.command-item code {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 600;
}

.actions {
  margin-top: 10px;
}
</style>
