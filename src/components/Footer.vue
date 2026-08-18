<template>
  <footer class="footer">
    <div class="container footer-content">
      <p class="footer-text">
        Dibuat dengan <span class="heart">❤️</span> menggunakan <strong>Vue 3</strong> & <strong>Vite</strong>.
      </p>
      <div class="footer-links">
        <a href="https://vuejs.org" target="_blank" rel="noreferrer" class="footer-link">Vue Docs</a>
        <a href="https://vite.dev" target="_blank" rel="noreferrer" class="footer-link">Vite Docs</a>
        <a href="https://pinia.vuejs.org" target="_blank" rel="noreferrer" class="footer-link">Pinia</a>
        <a href="https://router.vuejs.org" target="_blank" rel="noreferrer" class="footer-link">Vue Router</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  padding: 32px 0;
  transition: var(--transition);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@media (min-width: 640px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.heart {
  color: #ef4444;
}

.footer-links {
  display: flex;
  gap: 16px;
}

.footer-link {
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: var(--transition);
}

.footer-link:hover {
  color: var(--primary);
}
</style>
