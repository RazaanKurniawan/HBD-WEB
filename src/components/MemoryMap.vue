<template>
  <div class="memory-map-section">
    <!-- Header Section -->
    <div class="map-header">
      <div class="map-badge">
        <span>🗺️</span>
        <span>Jejak Cerita Kita</span>
      </div>
      <h2 class="map-main-title">peta jejak langkah & kenangan kita</h2>
      <p class="map-main-subtitle">
        setiap sudut kota punya cerita manis tentang kita berdua. Klik pin di peta untuk membuka memorinya! ✨
      </p>
    </div>

    <!-- Main Map Wrapper Card -->
    <div class="map-card-container">
      <div class="washi-tape-map"></div>

      <!-- Top Toolbar: Place Switcher & Mode -->
      <div class="map-toolbar">
        <div class="places-nav-pills">
          <button
            v-for="(place, index) in places"
            :key="place.id"
            class="place-pill-btn"
            :class="{ 'active': activePlaceIndex === index }"
            @click="selectPlace(index)"
          >
            <span class="pill-index">#{{ index + 1 }}</span>
            <span class="pill-name">{{ place.name }}</span>
            <span class="pill-icon">{{ place.icon || '📍' }}</span>
          </button>
        </div>

        <div class="map-status-info">
          <span class="status-badge">
            <span class="status-dot"></span>
            {{ places.length }} Lokasi Terkunci di Hati
          </span>
        </div>
      </div>

      <!-- Interactive Leaflet Map Box -->
      <div class="leaflet-map-wrapper">
        <div ref="mapContainerRef" class="map-canvas"></div>

        <!-- Floating Map Overlay Controls -->
        <div class="map-floating-overlay">
          <button class="btn-overlay-action" @click="recenterMap" title="Pusatkan ke lokasi aktif">
            <span>🎯 Fokus Lokasi</span>
          </button>
          <a 
            :href="`https://www.google.com/maps/search/?api=1&query=${activePlace.lat},${activePlace.lng}`" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn-overlay-maps"
            title="Buka di Google Maps"
          >
            <span>🌐 Buka Google Maps</span>
          </a>
        </div>
      </div>

      <!-- Active Place Spotlight / Polaroid Card -->
      <div class="place-spotlight-card">
        <div class="spotlight-grid">
          <!-- Left: Photo Carousel / Gallery -->
          <div class="gallery-col">
            <div class="polaroid-frame">
              <div class="polaroid-washi"></div>
              
              <!-- Main Active Photo -->
              <div class="photo-viewport" @click="openFullscreenPhoto">
                <img 
                  :src="activePlace.photos[activePhotoIndex]" 
                  :alt="`${activePlace.name} foto ${activePhotoIndex + 1}`" 
                  class="spotlight-img"
                  loading="lazy"
                />
                <div class="zoom-hint">
                  <span>🔍 Klik untuk Perbesar</span>
                </div>
                <!-- Photo Counter Pill -->
                <div class="photo-counter-badge">
                  📷 {{ activePhotoIndex + 1 }} / {{ activePlace.photos.length }}
                </div>
              </div>

              <!-- Carousel Controls (if > 1 photo) -->
              <div v-if="activePlace.photos.length > 1" class="carousel-nav-row">
                <button class="nav-arrow-btn" @click.stop="prevPhoto" :disabled="activePhotoIndex === 0">
                  ‹
                </button>
                
                <!-- Thumbnails Strip -->
                <div class="thumbnail-strip">
                  <button
                    v-for="(img, pIdx) in activePlace.photos"
                    :key="pIdx"
                    class="thumb-btn"
                    :class="{ 'thumb-active': pIdx === activePhotoIndex }"
                    @click.stop="activePhotoIndex = pIdx"
                  >
                    <img :src="img" :alt="`thumb ${pIdx + 1}`" />
                  </button>
                </div>

                <button class="nav-arrow-btn" @click.stop="nextPhoto" :disabled="activePhotoIndex === activePlace.photos.length - 1">
                  ›
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Place Details & Romantic Caption -->
          <div class="details-col">
            <div class="details-header">
              <div class="category-chip">
                <span>{{ activePlace.category }}</span>
              </div>
              <div class="date-chip">
                <span>🗓️ {{ activePlace.date }}</span>
              </div>
            </div>

            <h3 class="place-title">{{ activePlace.name }}</h3>

            <div class="coords-info-bar">
              <span class="coords-pin">📍</span>
              <span class="coords-text">{{ activePlace.lat.toFixed(6) }}, {{ activePlace.lng.toFixed(6) }}</span>
            </div>

            <!-- Love Reaction Button -->
            <div class="spotlight-footer">
              <button class="btn-love-spot" @click="sendLove">
                <span class="btn-heart-emoji">💖</span>
                <span>Kirim Cinta ke Tempat Ini ({{ loveCount }})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Photo Modal with Next / Prev Navigation -->
    <transition name="fade">
      <div v-if="isFullscreen" class="photo-lightbox-modal" @click="isFullscreen = false">
        <button class="btn-close-lightbox" @click="isFullscreen = false" title="Tutup (Esc)">✕</button>

        <!-- Previous Button in Fullscreen -->
        <button 
          class="btn-lightbox-nav btn-lightbox-prev" 
          :disabled="activePhotoIndex === 0" 
          @click.stop="prevPhoto"
          title="Foto Sebelumnya (←)"
        >
          ‹
        </button>

        <div class="lightbox-content" @click.stop>
          <img :src="activePlace.photos[activePhotoIndex]" alt="Fullscreen memory" class="lightbox-img" />
          <div class="lightbox-caption">
            <span>{{ activePlace.name }} • Foto {{ activePhotoIndex + 1 }} dari {{ activePlace.photos.length }}</span>
          </div>
        </div>

        <!-- Next Button in Fullscreen -->
        <button 
          class="btn-lightbox-nav btn-lightbox-next" 
          :disabled="activePhotoIndex === activePlace.photos.length - 1" 
          @click.stop="nextPhoto"
          title="Foto Selanjutnya (→)"
        >
          ›
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import confetti from 'canvas-confetti'

// ================= Load Images Dynamically with Vite =================
// 1. Steak Pa'Raden Photos
const steakModules = import.meta.glob('../assets/images/Map/SteakPa\'raden/*.{jpg,jpeg,png,JPG,PNG,NIGHT.jpg}', {
  eager: true,
  import: 'default'
})
const steakPhotoList = Object.values(steakModules)

// 2. Kopi Kenangan Photos
const kopiModules = import.meta.glob('../assets/images/Map/KopiKenangan/*.{jpg,jpeg,png,JPG,PNG,NIGHT.jpg}', {
  eager: true,
  import: 'default'
})
const kopiPhotoList = Object.values(kopiModules)

// 3. Mall Metland Photos
const metlandModules = import.meta.glob('../assets/images/Map/MallMetland/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const metlandPhotoList = Object.values(metlandModules)

// 4. Waterpark Photos
const waterparkModules = import.meta.glob('../assets/images/Map/Waterpark/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const waterparkPhotoList = Object.values(waterparkModules)

// 5. Kedai BFC Dimsum Photos
const bfcModules = import.meta.glob('../assets/images/Map/BFC/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const bfcPhotoList = Object.values(bfcModules)

// 6. WoodLand Park & Culinary Photos
const woodlandModules = import.meta.glob('../assets/images/Map/Woodland/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const woodlandPhotoList = Object.values(woodlandModules)

// 7. Oja Shabu & Grill Photos
const shabuModules = import.meta.glob('../assets/images/Map/Shabu/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const shabuPhotoList = Object.values(shabuModules)

// 8. Mall Metland XXI & Ichiban Sushi Photos
const xxichibanModules = import.meta.glob('../assets/images/Map/XXIchiban/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const xxichibanPhotoList = Object.values(xxichibanModules)

// 9. Living World (AEON) Photos
const aeonModules = import.meta.glob('../assets/images/Map/AEON/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
})
const aeonPhotoList = Object.values(aeonModules)

// ================= Places Data =================
const places = ref([
  {
    id: 1,
    name: "Steak Pa'Raden",
    category: "Kuliner Spesial 🥩",
    icon: "🥩",
    lat: -6.4613796913838755,
    lng: 107.04236458435939,
    date: "1 Januari 2026",
    photos: steakPhotoList.length > 0 ? steakPhotoList : []
  },
  {
    id: 2,
    name: "Kopi Kenangan",
    category: "Nongkrong Santai ☕",
    icon: "☕",
    lat: -6.435756825566496,
    lng: 107.05157402670329,
    date: "21 Juni 2026",
    photos: kopiPhotoList.length > 0 ? kopiPhotoList : []
  },
  {
    id: 3,
    name: "Mall Metland (Richeese)",
    category: "Jalan-Jalan & Kuliner 🍗",
    icon: "🍗",
    lat: -6.399266964170719,
    lng: 106.9760678774651,
    date: "19 Januari 2025",
    photos: metlandPhotoList.length > 0 ? metlandPhotoList : []
  },
  {
    id: 4,
    name: "Waterpark",
    category: "Main Air & Seru-Seruan 🏊‍♂️",
    icon: "🏊‍♂️",
    lat: -6.4467068041684525,
    lng: 107.03491695995464,
    date: "17 September 2025",
    photos: waterparkPhotoList.length > 0 ? waterparkPhotoList : []
  },
  {
    id: 5,
    name: "Kedai BFC Dimsum",
    category: "Dimsum & Kuliner Enak 🥟",
    icon: "🥟",
    lat: -6.463455761104053,
    lng: 107.03555999923282,
    date: "29 November 2025",
    photos: bfcPhotoList.length > 0 ? bfcPhotoList : []
  },
  {
    id: 6,
    name: "WoodLand Park & Culinary",
    category: "Romantic Dinner & Park 🌲✨",
    icon: "🌲",
    lat: -6.40774225467883,
    lng: 107.00582276325245,
    date: "14 Februari 2026",
    photos: woodlandPhotoList.length > 0 ? woodlandPhotoList : []
  },
  {
    id: 7,
    name: "Oja Shabu & Grill (Bukber)",
    category: "Bukber & All You Can Eat 🍲🥩",
    icon: "🍲",
    lat: -6.397643055240665,
    lng: 106.97760437456736,
    date: "8 Maret 2026",
    photos: shabuPhotoList.length > 0 ? shabuPhotoList : []
  },
  {
    id: 8,
    name: "Mall Metland (Cinema XXI)",
    category: "Nonton Bioskop Berdua 🎬🍿",
    icon: "🎬",
    lat: -6.399376374035517,
    lng: 106.97641246559752,
    date: "29 Maret 2026",
    photos: xxichibanPhotoList.length > 0 ? xxichibanPhotoList : []
  },
  {
    id: 9,
    name: "Mall Metland (Ichiban Sushi)",
    category: "Kuliner Ichiban Sushi 🍣🥢",
    icon: "🍣",
    lat: -6.399394149426077,
    lng: 106.97602309386559,
    date: "29 Maret 2026",
    photos: xxichibanPhotoList.length > 0 ? xxichibanPhotoList : []
  },
  {
    id: 10,
    name: "Living World (AEON)",
    category: "Jalan-Jalan & Belanja 🛍️✨",
    icon: "🛍️",
    lat: -6.367914564999478,
    lng: 106.95944403905303,
    date: "9 Agustus 2026",
    photos: aeonPhotoList.length > 0 ? aeonPhotoList : []
  }
])

// ================= Reactive State =================
const activePlaceIndex = ref(0)
const activePhotoIndex = ref(0)
const loveCount = ref(1)
const isFullscreen = ref(false)
const mapContainerRef = ref(null)

let map = null
let markers = []
let polyline = null

const activePlace = computed(() => places.value[activePlaceIndex.value])

// ================= Photo Carousel Handlers =================
const nextPhoto = () => {
  if (activePhotoIndex.value < activePlace.value.photos.length - 1) {
    activePhotoIndex.value++
  }
}

const prevPhoto = () => {
  if (activePhotoIndex.value > 0) {
    activePhotoIndex.value--
  }
}

const openFullscreenPhoto = () => {
  isFullscreen.value = true
}

const sendLove = () => {
  loveCount.value++
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#ff4d79', '#ff9a9e', '#fecfef', '#ffd166']
  })
}

// ================= Leaflet Map Setup =================
const customHeartIcon = (index, isActive = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="heart-marker-wrap ${isActive ? 'marker-active' : ''}">
        <div class="marker-pulse-ring"></div>
        <div class="marker-pin-body">
          <span class="marker-heart-icon">💖</span>
          <span class="marker-number">${index + 1}</span>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  })
}

const initMap = () => {
  if (!mapContainerRef.value || map) return

  const initialPlace = places.value[0]

  // Initialize Map
  map = L.map(mapContainerRef.value, {
    center: [initialPlace.lat, initialPlace.lng],
    zoom: 16,
    zoomControl: true,
    scrollWheelZoom: false // prevents accidental scroll while reading page
  })

  // CartoDB Positron / OSM romantic clean tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  renderMarkers()
}

const renderMarkers = () => {
  if (!map) return

  // Clear existing markers
  markers.forEach(m => map.removeLayer(m))
  markers = []
  if (polyline) map.removeLayer(polyline)

  const latLngs = []

  places.value.forEach((place, index) => {
    const isCurActive = index === activePlaceIndex.value
    const marker = L.marker([place.lat, place.lng], {
      icon: customHeartIcon(index, isCurActive)
    }).addTo(map)

    marker.on('click', () => {
      selectPlace(index)
    })

    // Custom Popup
    marker.bindPopup(`
      <div style="text-align: center; padding: 4px;">
        <strong style="color: #e11d48; font-size: 14px;">${place.name}</strong>
        <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">${place.category}</p>
      </div>
    `)

    markers.push(marker)
    latLngs.push([place.lat, place.lng])
  })

  // Draw romantic dashed route line if more than 1 spot
  if (latLngs.length > 1) {
    polyline = L.polyline(latLngs, {
      color: '#ff4d79',
      weight: 3,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(map)
  }
}

const selectPlace = (index) => {
  activePlaceIndex.value = index
  activePhotoIndex.value = 0

  const place = places.value[index]
  if (map) {
    map.flyTo([place.lat, place.lng], 16, {
      duration: 1.2,
      easeLinearity: 0.25
    })
  }

  // Update marker icons to highlight active
  markers.forEach((m, idx) => {
    m.setIcon(customHeartIcon(idx, idx === index))
    if (idx === index) {
      m.openPopup()
    }
  })
}

const recenterMap = () => {
  const place = activePlace.value
  if (map) {
    map.flyTo([place.lat, place.lng], 16, { duration: 0.8 })
  }
}

const handleLightboxKeydown = (e) => {
  if (!isFullscreen.value) return
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    nextPhoto()
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    prevPhoto()
  } else if (e.key === 'Escape') {
    isFullscreen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleLightboxKeydown)
  nextTick(() => {
    initMap()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleLightboxKeydown)
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/* ================= Leaflet Global Styles Override ================= */
.custom-leaflet-marker {
  background: transparent;
  border: none;
}

.heart-marker-wrap {
  width: 44px;
  height: 44px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.marker-pin-body {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #ff4d79 0%, #ff758c 100%);
  border: 2.5px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(255, 77, 121, 0.45);
  position: relative;
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.marker-heart-icon {
  font-size: 16px;
  line-height: 1;
}

.marker-number {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #1e293b;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #ffffff;
}

.marker-pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #ff4d79;
  opacity: 0;
  pointer-events: none;
}

.marker-active .marker-pin-body {
  transform: scale(1.18);
  background: linear-gradient(135deg, #e11d48 0%, #ff4d79 100%);
  box-shadow: 0 0 20px rgba(225, 29, 72, 0.6);
}

.marker-active .marker-pulse-ring {
  animation: pulse-ring 1.8s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
</style>

<style scoped>
/* ================= Section Base ================= */
.memory-map-section {
  width: 100%;
  max-width: 1000px;
  margin: 60px auto;
  padding: 0 16px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

/* Header */
.map-header {
  text-align: center;
  margin-bottom: 28px;
}

.map-badge {
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
  margin-bottom: 10px;
}

.map-main-title {
  font-family: 'Caveat', cursive;
  font-size: clamp(2.2rem, 5.5vw, 3.4rem);
  font-weight: 700;
  color: #4A4036 !important;
  margin-bottom: 6px;
  line-height: 1.15;
  text-shadow: 1px 1px 2px rgba(74, 64, 54, 0.06);
}

.map-main-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(0.92rem, 2vw, 1.05rem);
  color: #8A7E72 !important;
  max-width: 600px;
  margin: 0 auto;
}

/* Main Card Container */
.map-card-container {
  background: #ffffff;
  border: 1px solid rgba(212, 163, 115, 0.4);
  border-radius: 24px;
  padding: 24px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 16px 40px rgba(74, 64, 54, 0.1);
  overflow: hidden;
}

@media (max-width: 640px) {
  .map-card-container {
    padding: 16px 12px;
    border-radius: 18px;
  }
}

/* Washi Tape Accent */
.washi-tape-map {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%) rotate(1deg);
  width: 140px;
  height: 28px;
  background: rgba(255, 182, 193, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-left: 4px dashed rgba(255, 255, 255, 0.6);
  border-right: 4px dashed rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 10;
}

/* Toolbar & Place Pills */
.map-toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
  width: 100%;
  min-width: 0;
}

@media (min-width: 768px) {
  .map-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.places-nav-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
}

.place-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.place-pill-btn:hover {
  border-color: #ff758c;
  background: #fff5f7;
  color: #e11d48;
}

.place-pill-btn.active {
  background: linear-gradient(135deg, #ff4d79 0%, #ff758c 100%);
  border-color: #ff4d79;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(255, 77, 121, 0.35);
}

.pill-index {
  background: rgba(0, 0, 0, 0.12);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.72rem;
}

.place-pill-btn.active .pill-index {
  background: rgba(255, 255, 255, 0.25);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid #a7f3d0;
  align-self: flex-start;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ================= Leaflet Canvas Wrapper ================= */
.leaflet-map-wrapper {
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1.5px solid rgba(255, 182, 193, 0.6);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .leaflet-map-wrapper {
    height: 360px;
    border-radius: 20px;
  }
}

.map-canvas {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Floating Overlay Buttons */
.map-floating-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 400;
}

.btn-overlay-action,
.btn-overlay-maps {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.btn-overlay-action:hover,
.btn-overlay-maps:hover {
  background: #ffffff;
  color: #e11d48;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* ================= Spotlight / Polaroid Card ================= */
.place-spotlight-card {
  background: #fffdf9;
  border: 1px solid #fed7aa;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(251, 146, 60, 0.06);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

@media (min-width: 768px) {
  .place-spotlight-card {
    padding: 24px;
    border-radius: 22px;
  }
}

.spotlight-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .spotlight-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
    align-items: center;
  }
}

/* Polaroid Photo Frame */
.polaroid-frame {
  background: #ffffff;
  padding: 10px 10px 14px;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
}

@media (min-width: 768px) {
  .polaroid-frame {
    padding: 14px 14px 18px;
    transform: rotate(-1deg);
    transition: transform 0.3s ease;
  }
  .polaroid-frame:hover {
    transform: rotate(0deg) scale(1.01);
  }
}

.polaroid-washi {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 18px;
  background: rgba(255, 218, 185, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-left: 3px dashed rgba(255, 255, 255, 0.6);
  border-right: 3px dashed rgba(255, 255, 255, 0.6);
  z-index: 2;
}

.photo-viewport {
  width: 100%;
  height: 240px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: #18181b;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .photo-viewport {
    height: 280px;
  }
}

.spotlight-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.3s ease;
}

.photo-viewport:hover .spotlight-img {
  transform: scale(1.03);
}

.zoom-hint {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-viewport:hover .zoom-hint {
  opacity: 1;
}

.photo-counter-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 9999px;
}

/* Thumbnail Row */
.carousel-nav-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.nav-arrow-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  color: #1e293b;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.nav-arrow-btn:hover:not(:disabled) {
  background: #ff4d79;
  color: #ffffff;
  border-color: #ff4d79;
}

.nav-arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumbnail-strip {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  flex: 1 1 0%;
  min-width: 0;
  padding: 2px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.thumbnail-strip::-webkit-scrollbar {
  display: none;
}

.thumb-btn {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  background: #27272a;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-btn.thumb-active {
  border-color: #ff4d79;
  opacity: 1;
  transform: scale(1.05);
}

/* Details Column */
.details-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.details-header {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-chip {
  background: #ffedd5;
  color: #c2410c;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid #fed7aa;
}

.date-chip {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
}

.place-title {
  font-size: clamp(1.25rem, 2.5vw, 1.7rem);
  font-weight: 800;
  color: #1e293b;
  line-height: 1.25;
}

.coords-info-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #64748b;
  font-family: monospace;
}

/* Footer & Send Love */
.spotlight-footer {
  margin-top: 4px;
}

.btn-love-spot {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff4d79 0%, #ff758c 100%);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(255, 77, 121, 0.35);
  transition: all 0.25s ease;
}

.btn-love-spot:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 20px rgba(255, 77, 121, 0.45);
}

.btn-love-spot:active {
  transform: translateY(0);
}

/* ================= Fullscreen Lightbox Modal ================= */
.photo-lightbox-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.94);
  backdrop-filter: blur(12px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.lightbox-content {
  position: relative;
  max-width: 92vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  user-select: none;
}

.btn-lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.18);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
  font-size: 2.4rem;
  line-height: 1;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 100000;
  backdrop-filter: blur(8px);
  user-select: none;
}

.btn-lightbox-nav:hover:not(:disabled) {
  background: rgba(255, 77, 121, 0.9);
  border-color: #ff4d79;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0 20px rgba(255, 77, 121, 0.6);
}

.btn-lightbox-nav:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.btn-lightbox-prev {
  left: 12px;
}

.btn-lightbox-next {
  right: 12px;
}

.btn-close-lightbox {
  position: fixed;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  color: #ffffff;
  font-size: 1.3rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 100000;
  backdrop-filter: blur(8px);
}

.btn-close-lightbox:hover {
  background: rgba(239, 68, 68, 0.85);
  border-color: #ef4444;
  transform: scale(1.1);
}

.lightbox-caption {
  color: #e2e8f0;
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
