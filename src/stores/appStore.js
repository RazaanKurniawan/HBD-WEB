import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isDarkMode = ref(true)
  const count = ref(0)
  const message = ref('Selamat datang di Project Vue 3!')

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  }

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function resetCount() {
    count.value = 0
  }

  return {
    isDarkMode,
    count,
    message,
    toggleTheme,
    increment,
    decrement,
    resetCount
  }
})
