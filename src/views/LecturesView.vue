<template>
  <div>
    <!-- Header Section -->
    <v-container fluid class="lectures-header">
      <div class="hero-background">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="decorative-shape shape-1"></div>
        <div class="decorative-shape shape-2"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <v-row align="center" justify="center" class="py-12">
          <v-col cols="12" class="text-center">
            <div class="hero-icon-wrapper mb-6">
              <div class="icon-bg-circle"></div>
              <v-icon icon="mdi-video-outline" size="64" class="hero-icon" />
            </div>
            <h1 class="page-title">הרצאות וסרטונים</h1>
            <p class="page-subtitle mt-4">
              תכנים להעמקה בנושאי סקרנות, למידה וצמיחה אישית
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Featured Video -->
    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <v-card elevation="4" rounded="xl">
            <v-card-text class="pa-0">
              <div class="featured-badge pa-4 text-center">
                <v-icon icon="mdi-star" size="small" class="me-2" />
                <span class="featured-text">סרטון מומלץ</span>
              </div>
              <div class="video-wrapper">
                <iframe
                  :src="`https://www.youtube.com/embed/${featuredVideo.videoId}`"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <div class="pa-6 video-content">
                <h2 class="video-title mb-3">{{ featuredVideo.title }}</h2>
                <p class="video-description">{{ featuredVideo.description }}</p>
                <div class="mt-4 tags-wrapper">
                  <v-chip
                    v-for="tag in featuredVideo.tags"
                    :key="tag"
                    size="small"
                    color="secondary"
                    class="ms-2 mb-2"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Video Categories -->
    <v-container class="py-8">
      <div class="text-center mb-8">
        <v-chip-group v-model="selectedCategory" selected-class="text-primary" color="primary">
          <v-chip v-for="category in categories" :key="category" :value="category" size="large">
            {{ category }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-container>

    <!-- Videos Grid -->
    <v-container class="pb-16">
      <v-row>
        <v-col v-for="video in filteredVideos" :key="video.videoId" cols="12" md="6" lg="4">
          <v-card class="video-card" elevation="3" rounded="lg" height="100%">
            <div class="video-thumbnail" @click="openVideo(video.videoId)">
              <img :src="video.thumbnail" :alt="video.title" />
              <div class="play-overlay">
                <v-icon icon="mdi-play-circle" size="72" color="white" />
              </div>
              <div class="duration-badge">{{ video.duration }}</div>
            </div>
            <v-card-text class="pa-4 video-card-content">
              <h3 class="video-card-title mb-2">{{ video.title }}</h3>
              <p class="video-card-description mb-3">{{ video.description }}</p>
              <div class="tags-wrapper">
                <v-chip v-for="tag in video.tags" :key="tag" size="x-small" color="secondary" class="ms-1 mb-1">
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Video Dialog -->
    <v-dialog v-model="videoDialog" max-width="1200" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>צפייה בסרטון</span>
          <v-btn icon variant="text" @click="videoDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <div class="video-wrapper">
            <iframe
              v-if="currentVideoId"
              :src="`https://www.youtube.com/embed/${currentVideoId}`"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Newsletter Section -->
    <v-container fluid class="newsletter-section py-16">
      <div class="newsletter-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
      <v-container style="position: relative; z-index: 1;">
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <div class="newsletter-icon-wrapper mb-6">
              <v-icon icon="mdi-bell-ring" size="64" color="white" class="newsletter-icon" />
            </div>
            <h2 class="newsletter-title mb-4">רוצים לקבל עדכונים?</h2>
            <p class="newsletter-text mb-8">
              הירשמו לרשימת התפוצה שלנו כדי לקבל עדכונים על סרטונים חדשים, הרצאות ותכנים מקצועיים
            </p>
            <v-form class="newsletter-form">
              <v-row justify="center" class="align-center">
                <v-col cols="12" sm="7" md="6">
                  <v-text-field
                    label="כתובת אימייל"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    rounded="xl"
                    bg-color="white"
                    class="newsletter-input"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-btn color="primary" size="x-large" rounded="xl" class="newsletter-btn" elevation="0">
                    <v-icon icon="mdi-send" start />
                    הרשמה
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const videoDialog = ref(false)
const currentVideoId = ref('')
const selectedCategory = ref('הכל')

// Featured video
const featuredVideo = {
  videoId: 'dQw4w9WgXcQ',
  title: 'כיצד להתמודד עם חרדות ביומיום',
  description:
    'בהרצאה זו נלמד טכניקות מעשיות להתמודדות עם חרדות ופחדים בחיי היומיום. נדבר על זיהוי הגורמים, שיטות הרגעה וכלים מוכחים לשיפור איכות החיים.',
  thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  duration: '42:15',
  tags: ['חרדות', 'כלי התמודדות', 'בריאות נפש'],
}

const categories = ['הכל', 'חרדות', 'דיכאון', 'זוגיות', 'הורות', 'צמיחה אישית']

// Video list (replace with real YouTube video IDs)
const videos = [
  {
    videoId: '3JZ_D3ELwOQ',
    title: 'הבנת דיכאון ודרכי טיפול',
    description: 'מהו דיכאון? איך מזהים אותו ומה אפשר לעשות כדי להתמודד איתו בצורה יעילה.',
    thumbnail: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg',
    duration: '35:20',
    tags: ['דיכאון', 'טיפול'],
    category: 'דיכאון',
  },
  {
    videoId: 'ZbZSe6N_BXs',
    title: 'תקשורת זוגית בריאה',
    description: 'עקרונות יסוד לתקשורת זוגית מוצלחת וכיצד להתמודד עם קונפליקטים.',
    thumbnail: 'https://img.youtube.com/vi/ZbZSe6N_BXs/maxresdefault.jpg',
    duration: '28:45',
    tags: ['זוגיות', 'תקשורת'],
    category: 'זוגיות',
  },
  {
    videoId: 'kfVsfOSbJY0',
    title: 'הורות מודעת',
    description: 'כיצד להיות הורה טוב יותר תוך שמירה על הבריאות הנפשית שלכם ושל הילדים.',
    thumbnail: 'https://img.youtube.com/vi/kfVsfOSbJY0/maxresdefault.jpg',
    duration: '45:30',
    tags: ['הורות', 'חינוך'],
    category: 'הורות',
  },
  {
    videoId: 'ixkoVwKQaJg',
    title: 'בניית ביטחון עצמי',
    description: 'דרכים מעשיות לשיפור הביטחון העצמי והדימוי העצמי.',
    thumbnail: 'https://img.youtube.com/vi/ixkoVwKQaJg/maxresdefault.jpg',
    duration: '32:15',
    tags: ['ביטחון עצמי', 'צמיחה'],
    category: 'צמיחה אישית',
  },
  {
    videoId: 'y6Sxv-sUYtM',
    title: 'התמודדות עם לחץ',
    description: 'טכניקות להפחתת לחץ וחרדה במצבי עומס.',
    thumbnail: 'https://img.youtube.com/vi/y6Sxv-sUYtM/maxresdefault.jpg',
    duration: '25:50',
    tags: ['לחץ', 'הרגעה'],
    category: 'חרדות',
  },
  {
    videoId: '9bZkp7q19f0',
    title: 'קשיבות ומיינדפולנס',
    description: 'מהי קשיבות וכיצד היא יכולה לשפר את איכות החיים שלנו.',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    duration: '38:20',
    tags: ['מיינדפולנס', 'קשיבות'],
    category: 'צמיחה אישית',
  },
]

const filteredVideos = computed(() => {
  if (selectedCategory.value === 'הכל') {
    return videos
  }
  return videos.filter((video) => video.category === selectedCategory.value)
})

function openVideo(videoId: string) {
  currentVideoId.value = videoId
  videoDialog.value = true
}
</script>

<style scoped>
.lectures-header {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
  color: #0D47A1;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  animation: float 20s infinite ease-in-out;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
}

.cloud-1 {
  width: 105px;
  height: 36px;
  top: 14%;
  left: 14%;
  animation-delay: 0s;
}

.cloud-1::before {
  width: 46px;
  height: 46px;
  top: -23px;
  left: 11px;
}

.cloud-1::after {
  width: 50px;
  height: 25px;
  top: -12px;
  right: 11px;
}

.cloud-2 {
  width: 125px;
  height: 41px;
  top: 62%;
  right: 16%;
  animation-delay: -7s;
}

.cloud-2::before {
  width: 53px;
  height: 53px;
  top: -26px;
  left: 16px;
}

.cloud-2::after {
  width: 63px;
  height: 31px;
  top: -15px;
  right: 16px;
}

.cloud-3 {
  width: 92px;
  height: 32px;
  top: 36%;
  right: 26%;
  animation-delay: -14s;
}

.cloud-3::before {
  width: 41px;
  height: 41px;
  top: -18px;
  left: 11px;
}

.cloud-3::after {
  width: 47px;
  height: 23px;
  top: -10px;
  right: 11px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-15px) translateX(5px);
  }
}

.decorative-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.shape-1 {
  width: 255px;
  height: 255px;
  background: #1565C0;
  top: -82px;
  right: -82px;
  animation: pulse 8s infinite ease-in-out;
}

.shape-2 {
  width: 185px;
  height: 185px;
  background: #0D47A1;
  bottom: -42px;
  left: -42px;
  animation: pulse 6s infinite ease-in-out reverse;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.15;
  }
}

.hero-icon-wrapper {
  position: relative;
  display: inline-block;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.icon-bg-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  box-shadow: 0 10px 40px rgba(21, 101, 192, 0.3);
}

.hero-icon {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 8px rgba(21, 101, 192, 0.3));
  color: #1565C0 !important;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
}

.page-subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem);
  opacity: 0.95;
}

.featured-badge {
  background: #0D47A1;
  color: white;
  font-weight: 600;
}

.featured-text {
  font-size: 0.875rem;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.video-description {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.75);
}

.video-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.video-thumbnail {
  position: relative;
  overflow: hidden;
  padding-bottom: 56.25%;
  background-color: #f5f5f5;
  cursor: pointer;
}

.video-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
}

.video-thumbnail:hover .play-overlay {
  opacity: 1;
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.video-content {
}

.video-card-content {
}

.tags-wrapper {
}

.video-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-card-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.7);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.newsletter-section {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
  position: relative;
  overflow: hidden;
}

.newsletter-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgba(21, 101, 192, 0.3);
  border-radius: 50%;
  animation: particleFloat 10s infinite ease-in-out;
}

.particle:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.particle:nth-child(2) {
  top: 60%;
  left: 25%;
  animation-delay: -2s;
  animation-duration: 14s;
}

.particle:nth-child(3) {
  top: 40%;
  right: 15%;
  animation-delay: -4s;
  animation-duration: 11s;
}

.particle:nth-child(4) {
  top: 75%;
  right: 30%;
  animation-delay: -6s;
  animation-duration: 13s;
}

.particle:nth-child(5) {
  top: 30%;
  left: 50%;
  animation-delay: -3s;
  animation-duration: 15s;
}

.particle:nth-child(6) {
  top: 80%;
  left: 70%;
  animation-delay: -5s;
  animation-duration: 10s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-40px) scale(1.5);
    opacity: 1;
  }
}

.newsletter-icon-wrapper {
  display: inline-block;
  background: linear-gradient(135deg, #1565C0, #0D47A1);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 12px 40px rgba(21, 101, 192, 0.3);
}

.newsletter-icon {
  animation: ring 2s ease-in-out infinite;
  color: white !important;
}

@keyframes ring {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30% {
    transform: rotate(15deg);
  }
  20%, 40% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(0deg);
  }
}

.newsletter-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #0D47A1;
}

.newsletter-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  color: #424242;
}

.newsletter-form {
  max-width: 100%;
}

.newsletter-input :deep(.v-field) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.newsletter-input :deep(.v-field:hover) {
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.newsletter-btn {
  font-weight: 600;
  padding: 0 40px !important;
  background: linear-gradient(135deg, #1565C0, #0D47A1) !important;
  color: white !important;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(21, 101, 192, 0.4) !important;
}

.newsletter-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.5) !important;
}
</style>

