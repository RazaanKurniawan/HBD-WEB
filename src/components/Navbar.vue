<template>
  <header class="navbar-wrapper">
    <nav class="container navbar">
      <router-link to="/" class="logo">
        <div class="logo-icon">⚡</div>
        <span class="logo-text">Vue<span class="logo-highlight">Hub</span></span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">Home</router-link>
        <router-link to="/about" class="nav-link" active-class="active">About</router-link>
      </div>

      <div class="nav-actions">
        <button @click="appStore.toggleTheme" class="theme-toggle" :title="appStore.isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'">
          <span v-if="appStore.isDarkMode">☀️ Light</span>
          <span v-else>🌙 Dark</span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
</script>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.25rem;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--accent-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 1.1rem;
}

.logo-highlight {
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-weight: 500;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--primary-light);
}

.nav-link.active {
  color: var(--primary);
  background-color: var(--primary-light);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: var(--transition);
}

.theme-toggle:hover {
  transform: scale(1.05);
  border-color: var(--primary);
}
</style>
