<template>
  <v-container fluid>
    <!-- Header with animated gradient -->
    <v-row class="mb-6">
      <v-col cols="12" class="text-center">
        <h2 class="text-h3 mb-2 animated-title">
          <span class="sparkle">✨</span>
          🎁 הפרס השבועי
          <span class="sparkle">✨</span>
        </h2>
        <p class="text-h6 text-medium-emphasis">
          עמוד ב-18 פגישות והכנסה של 7,200 ₪ לפחות - וזכה בפרס!
        </p>
      </v-col>
    </v-row>

    <!-- Main Prize Card -->
    <v-row class="mb-6">
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <v-card
          class="prize-card mega-card"
          rounded="xl"
          elevation="24"
          :class="{ 'victory-mode': canUnlock }"
        >
          <!-- Animated background particles -->
          <div class="particles-container">
            <div v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)"></div>
          </div>

          <v-card-text class="pa-8 position-relative">
            <!-- Main Content -->
            <div v-if="!currentPrize.isUnlocked" class="prize-container">

              <!-- Gift Box with animations -->
              <div class="gift-box-wrapper">
                <div class="gift-box" :class="{
                  'gift-bounce': appointmentsCount > 0,
                  'gift-glow': canUnlock,
                  'gift-shake': appointmentsCount >= 10 && appointmentsCount < 18
                }">
                  <!-- Floating stars around gift -->
                  <div v-if="appointmentsCount > 0" class="stars-container">
                    <div v-for="i in 8" :key="i" class="floating-star" :style="getStarStyle(i)">⭐</div>
                  </div>

                  <v-icon
                    icon="mdi-gift"
                    :size="canUnlock ? 180 : 140"
                    :color="canUnlock ? 'warning' : appointmentsCount >= 10 ? 'primary' : 'grey'"
                    class="gift-icon"
                  />

                  <!-- Lock overlay -->
                  <div v-if="!canUnlock" class="lock-overlay">
                    <v-icon icon="mdi-lock" size="70" color="white" class="lock-icon" />
                  </div>
                </div>

                <!-- Animated rings around gift when close to target -->
                <div v-if="appointmentsCount >= 15 && !canUnlock" class="energy-rings">
                  <div class="ring ring-1"></div>
                  <div class="ring ring-2"></div>
                  <div class="ring ring-3"></div>
                </div>
              </div>

              <!-- Status Title -->
              <h3 class="text-h3 mt-8 mb-4 status-title" :class="canUnlock ? 'victory-text' : ''">
                <template v-if="canUnlock">
                  🎉 המתנה מוכנה! 🎉
                </template>
                <template v-else-if="appointmentsCount >= 18 && weeklyRevenue < minRevenue">
                  💰 עוד קצת הכנסה!
                </template>
                <template v-else-if="weeklyRevenue >= minRevenue && appointmentsCount < 18">
                  📅 עוד {{ 18 - appointmentsCount }} פגישות!
                </template>
                <template v-else>
                  🔒 המתנה נעולה
                </template>
              </h3>

              <!-- Main Stats Display -->
              <div class="mb-6">
                <!-- Appointments Counter -->
                <v-card class="stat-card appointments-card mb-4" rounded="lg" elevation="8">
                  <v-card-text class="text-center pa-4">
                    <div class="d-flex align-center justify-center gap-3 flex-wrap">
                      <div class="stat-icon">📅</div>
                      <div class="stat-label">פגישות השבוע:</div>
                      <div class="stat-value mega-number" :class="{ 'goal-reached': appointmentsCount >= 18 }">
                        <span class="counter-number">{{ appointmentsCount }}</span>
                        <span class="stat-divider">/</span>
                        <span class="stat-target">18</span>
                      </div>
                      <v-chip
                        v-if="appointmentsCount >= 18"
                        color="success"
                        variant="flat"
                        prepend-icon="mdi-check-circle"
                      >
                        ✓ יעד הפגישות הושג!
                      </v-chip>
                    </div>
                    <v-progress-linear
                      :model-value="appointmentsProgress"
                      height="12"
                      rounded
                      :color="appointmentsCount >= 18 ? 'success' : 'primary'"
                      class="mt-3"
                    >
                      <template #default>
                        <strong class="text-white text-caption">{{ Math.round(appointmentsProgress) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </v-card-text>
                </v-card>

                <!-- Revenue Counter -->
                <v-card class="stat-card revenue-card" rounded="lg" elevation="8">
                  <v-card-text class="text-center pa-4">
                    <div class="d-flex align-center justify-center gap-3 flex-wrap">
                      <div class="stat-icon">💰</div>
                      <div class="stat-label">הכנסה השבוע:</div>
                      <div class="stat-value mega-number" :class="{ 'goal-reached': weeklyRevenue >= minRevenue }">
                        <span class="currency">₪</span>
                        <span class="counter-number">{{ weeklyRevenue.toLocaleString() }}</span>
                      </div>
                      <div class="stat-subtext">(יעד: ₪7,200)</div>
                      <v-chip
                        v-if="weeklyRevenue >= minRevenue"
                        color="success"
                        variant="flat"
                        prepend-icon="mdi-check-circle"
                      >
                        ✓ יעד ההכנסה הושג!
                      </v-chip>
                    </div>
                    <v-progress-linear
                      :model-value="revenueProgress"
                      height="12"
                      rounded
                      :color="weeklyRevenue >= minRevenue ? 'success' : 'warning'"
                      class="mt-3"
                    >
                      <template #default>
                        <strong class="text-white text-caption">{{ Math.round(revenueProgress) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Additional Info -->
              <v-card class="info-card mb-6" rounded="lg" variant="flat" color="success" elevation="4">
                <v-card-text class="text-center pa-6">
                  <div class="text-h5 mb-3 font-weight-bold text-white">
                    💵 שולם בפועל: ₪{{ weeklyPaidAmount.toLocaleString() }}
                  </div>
                  <div class="text-body-2 text-white" style="opacity: 0.9;">
                    (סכום זה לא משפיע על היעד - רק ההכנסה הכוללת וכמות הפגישות)
                  </div>
                </v-card-text>
              </v-card>

              <!-- Unlock Button -->
              <v-btn
                v-if="canUnlock"
                color="warning"
                size="x-large"
                rounded="xl"
                elevation="12"
                class="mega-unlock-button"
                :loading="unlocking"
                @click="unlockPrize"
              >
                <v-icon icon="mdi-gift-open" size="40" class="mr-2" />
                <span class="button-text">פתח את המתנה!</span>
                <v-icon icon="mdi-gift-open" size="40" class="ml-2" />
              </v-btn>

              <!-- Admin Demo Button (only for testing) -->
              <v-btn
                v-if="isAdmin && !canUnlock"
                color="deep-purple"
                size="large"
                rounded="xl"
                elevation="8"
                class="mt-4"
                :loading="unlocking"
                @click="unlockPrize"
              >
                <v-icon icon="mdi-test-tube" class="mr-2" />
                🎬 דמה פתיחת מתנה (בדיקה)
              </v-btn>

              <!-- Status Message -->
              <p v-else-if="!isAdmin" class="text-h6 text-center mt-6 status-message">
                <template v-if="appointmentsCount >= 18 && weeklyRevenue >= minRevenue">
                  🎯 מעולה! הגעת ליעד!<br>
                  פתיחת המתנה תהיה זמינה במוצאי שבת (אחרי 20:00) או ביום ראשון 🎁
                </template>
                <template v-else>
                  💪 המשך לעבוד - אתה בדרך לפרס!
                </template>
              </p>

              <!-- Admin Status Message -->
              <v-alert
                v-else-if="isAdmin && !canUnlock"
                type="info"
                variant="tonal"
                class="mt-4"
              >
                <div class="text-body-1">
                  <strong>מצב נוכחי:</strong><br>
                  📅 פגישות: {{ appointmentsCount }}/18 {{ appointmentsCount >= 18 ? '✓' : '✗' }}<br>
                  💰 הכנסה: ₪{{ weeklyRevenue.toLocaleString() }}/₪7,200 {{ weeklyRevenue >= minRevenue ? '✓' : '✗' }}<br>
                  🕐 זמן: {{ isSaturdayEvening ? 'מוצ"ש/ראשון ✓' : 'לא מוצ"ש ✗' }}<br><br>
                  <strong>לחץ על "דמה פתיחת מתנה" כדי לראות את האנימציות!</strong>
                </div>
              </v-alert>

            </div>

            <!-- Unlocked State with MEGA celebration -->
            <div v-else class="unlocked-state">
              <!-- Massive Confetti -->
              <div class="mega-confetti-container">
                <div class="confetti" v-for="i in 100" :key="i" :style="getConfettiStyle(i)"></div>
              </div>

              <!-- Fireworks -->
              <div class="fireworks-container">
                <div v-for="i in 5" :key="i" class="firework" :style="getFireworkStyle(i)"></div>
              </div>

              <!-- Balloons -->
              <div class="balloons-container">
                <div v-for="i in 10" :key="i" class="balloon" :style="getBalloonStyle(i)">🎈</div>
              </div>

              <!-- Gift Opening Animation -->
              <div class="mega-gift-opening">
                <div class="gift-explosion">💥</div>
                <div class="prize-star-burst">
                  <v-icon
                    icon="mdi-trophy-award"
                    size="150"
                    color="warning"
                    class="trophy-icon"
                  />
                </div>
              </div>

              <h3 class="text-h2 mb-6 mt-8 mega-celebration-text">
                🎊 כל הכבוד! 🎊
              </h3>

              <p class="text-h5 mb-6 achievement-text">
                השלמת {{ appointmentsCount }} פגישות והכנסת ₪{{ weeklyRevenue.toLocaleString() }}!
              </p>

              <!-- Prize Reveal with animation -->
              <v-card class="prize-reveal-card" rounded="xl" elevation="16">
                <v-card-text class="pa-10">
                  <p class="text-h4 mb-4 text-success">🏆 הפרס שלך:</p>
                  <p class="text-h3 font-weight-bold prize-text">
                    {{ currentPrize.prizeText }}
                  </p>
                </v-card-text>
              </v-card>

              <p class="text-body-1 mt-6 text-medium-emphasis">
                נפתח ב: {{ formatDateTime(currentPrize.unlockedAt!) }}
              </p>

              <div class="d-flex gap-3 mt-6">
                <v-btn
                  color="success"
                  size="large"
                  rounded="xl"
                  @click="closeCurrentPrize"
                >
                  <v-icon icon="mdi-check-circle" start />
                  סגור ועבור לשבוע הבא
                </v-btn>

                <v-btn
                  color="warning"
                  size="large"
                  rounded="xl"
                  @click="hideUnlockedPrize"
                >
                  <v-icon icon="mdi-eye-off" start />
                  הסתר פרס זה
                </v-btn>
              </div>
            </div>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Admin Settings -->
    <v-row v-if="isAdmin">
      <v-col cols="12" md="8" class="mx-auto">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-6 bg-grey-lighten-3 text-right">
            <v-icon icon="mdi-cog" />
            הגדרות פרס (מנהל בלבד)
          </v-card-title>

          <v-card-text class="pa-6">
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="text-body-2">
                <strong>יעד שבועי:</strong> 18 פגישות + ₪7,200 הכנסה מינימום<br>
                <strong>סטטוס נוכחי:</strong><br>
                - פגישות: {{ appointmentsCount }} / 18<br>
                - הכנסה: ₪{{ weeklyRevenue.toLocaleString() }} / ₪7,200<br>
                - שולם: ₪{{ weeklyPaidAmount.toLocaleString() }}
              </div>
            </v-alert>

            <v-text-field
              v-model="prizeSettings.text"
              label="תיאור הפרס"
              variant="outlined"
              rounded="lg"
              placeholder="לדוגמה: ערב קולנוע, מסאז', ארוחה במסעדה..."
              class="mb-4"
            />

            <v-btn
              color="primary"
              rounded="xl"
              block
              size="large"
              :loading="savingSettings"
              @click="savePrizeSettings"
            >
              <v-icon icon="mdi-content-save" />
              שמור תיאור פרס
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Available Prizes to Unlock -->
    <v-row v-if="availablePrizes.length > 0" class="mt-6">
      <v-col cols="12">
        <h3 class="text-h4 mb-4 text-center">
          <v-icon icon="mdi-gift-open-outline" size="32" color="success" />
          🎁 פרסים זמינים לפתיחה! 🎁
        </h3>
        <p class="text-subtitle-1 text-center text-medium-emphasis mb-6">
          עמדת ביעד בשבועות הבאים! לחץ על כל פרס כדי לפתוח אותו
        </p>
      </v-col>

      <v-col
        v-for="(prize, index) in availablePrizes"
        :key="prize.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="available-prize-card"
          rounded="xl"
          elevation="8"
          hover
        >
          <v-card-text class="pa-6 text-center">
            <!-- Gift Icon with Glow -->
            <div class="mb-4">
              <v-icon
                icon="mdi-gift"
                size="80"
                color="warning"
                class="gift-icon-small"
              />
            </div>

            <!-- Week Info -->
            <h4 class="text-h5 mb-2">
              שבוע {{ formatDateTime(prize.weekStart).split(' ')[0] }}
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ formatDateTime(prize.weekStart) }}
            </p>

            <!-- Prize Text - Hidden until unlocked -->
            <v-alert type="warning" variant="tonal" class="mb-4">
              <div class="text-center">
                <v-icon icon="mdi-gift-outline" size="48" color="warning" class="mb-2" />
                <p class="text-h6 font-weight-bold mb-1">
                  🎁 פרס מיוחד ממתין לך!
                </p>
                <p class="text-body-2 text-medium-emphasis">
                  פתח את הפרס כדי לראות מה בפנים...
                </p>
              </div>
            </v-alert>

            <!-- Status Chip -->
            <div class="mb-4 text-center">
              <v-chip color="success" size="large" variant="elevated">
                <v-icon icon="mdi-star" start />
                זכית בפרס!
              </v-chip>
            </div>

            <!-- Unlock Button -->
            <v-btn
              color="success"
              variant="elevated"
              rounded="xl"
              block
              size="large"
              @click="unlockSpecificPrize(prize)"
              class="unlock-prize-btn"
            >
              <v-icon icon="mdi-gift-open" start />
              פתח פרס!
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import type { WeeklyPrize } from '@/types/manage'

// State
const currentPrize = ref<WeeklyPrize>({
  id: '',
  weekStart: getWeekStart(new Date()),
  prizeText: 'הפתעה מיוחדת! 🎁',
  weeklyTarget: 7200, // Fixed target
  weeklyActual: 0,
  isUnlocked: false
})

const prizeSettings = ref({
  text: 'הפתעה מיוחדת! 🎁'
})

const availablePrizes = ref<WeeklyPrize[]>([]) // כל הפרסים הזמינים לפתיחה
const unlocking = ref(false)
const savingSettings = ref(false)
const appointmentsCount = ref(0) // מספר פגישות בשבוע
const weeklyRevenue = ref(0) // הכנסה כוללת
const weeklyPaidAmount = ref(0) // סכום שולם בפועל
const minRevenue = 7200 // הכנסה מינימלית נדרשת

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Check if user is admin
const isAdmin = computed(() => {
  return auth.currentUser?.email === 'gift@gift.co.il'
})

// Progress calculations
const appointmentsProgress = computed(() => {
  return Math.min((appointmentsCount.value / 18) * 100, 100)
})

const revenueProgress = computed(() => {
  return Math.min((weeklyRevenue.value / minRevenue) * 100, 100)
})

// Can unlock if: 18+ appointments AND 7200+ revenue AND saturday evening/sunday
const isSaturdayEvening = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  return (day === 6 && hour >= 20) || day === 0
})

const canUnlock = computed(() => {
  return appointmentsCount.value >= 18 &&
         weeklyRevenue.value >= minRevenue &&
         isSaturdayEvening.value &&
         !currentPrize.value.isUnlocked
})

// Helper Functions
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  const weekStart = new Date(d.setDate(diff))
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Animation styles
function getParticleStyle(index: number) {
  const size = 3 + Math.random() * 5
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 3 + Math.random() * 4

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

function getStarStyle(index: number) {
  const angle = (index / 8) * 360
  const radius = 100
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius
  const delay = index * 0.1

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${delay}s`
  }
}

function getConfettiStyle(index: number) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#FF69B4']
  const randomColor = colors[index % colors.length]
  const randomLeft = Math.random() * 100
  const randomDelay = Math.random() * 3
  const randomDuration = 2 + Math.random() * 3

  return {
    left: `${randomLeft}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

function getFireworkStyle(index: number) {
  const x = 20 + (index * 15)
  const delay = index * 0.3

  return {
    left: `${x}%`,
    animationDelay: `${delay}s`
  }
}

function getBalloonStyle(index: number) {
  const x = 10 + (index * 8)
  const delay = index * 0.2
  const duration = 4 + Math.random() * 2

  return {
    left: `${x}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// Methods
const loadPrize = async () => {
  try {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    console.log('📅 Loading prize for current week:', weekStart.toISOString().split('T')[0])
    console.log('📅 Week end:', weekEnd.toISOString().split('T')[0])

    const q = query(
      collection(db, 'weekly_prizes'),
      where('weekStart', '>=', weekStart),
      where('weekStart', '<', weekEnd)
    )

    const snapshot = await getDocs(q)

    console.log('📦 Prizes found for current week:', snapshot.docs.length)

    if (snapshot.empty) {
      console.log('⚠️ No prize for current week, creating new one...')
      await createNewPrize()
    } else {
      const doc = snapshot.docs[0]
      const prizeData = doc.data()

      console.log('✅ Loaded prize:', {
        weekStart: prizeData.weekStart?.toDate().toISOString().split('T')[0],
        isUnlocked: prizeData.isUnlocked,
        prizeText: prizeData.prizeText
      })

      currentPrize.value = {
        id: doc.id,
        ...prizeData,
        weekStart: prizeData.weekStart?.toDate() || weekStart,
        unlockedAt: prizeData.unlockedAt?.toDate()
      } as WeeklyPrize

      prizeSettings.value = {
        text: currentPrize.value.prizeText
      }

      await calculateWeeklyStats()
    }

    // טען גם פרסים זמינים מהעבר
    await loadAvailablePrizes()
  } catch (error) {
    console.error('Error loading prize:', error)
  }
}

// Load all available prizes (unlocked by admin, not yet opened by user)
const loadAvailablePrizes = async () => {
  try {
    const now = new Date()

    console.log('🔍 Loading available prizes...')
    console.log('Current date:', now)

    // Get all prizes that are not unlocked yet
    const q = query(
      collection(db, 'weekly_prizes'),
      where('isUnlocked', '==', false)
    )

    const snapshot = await getDocs(q)

    console.log('📦 Total prizes with isUnlocked=false:', snapshot.docs.length)

    const allPrizes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      weekStart: doc.data().weekStart?.toDate() || new Date(),
      unlockedAt: doc.data().unlockedAt?.toDate()
    }))

    console.log('📋 All prizes:', allPrizes.map(p => ({
      weekStart: p.weekStart.toISOString().split('T')[0],
      actual: p.weeklyActual,
      isUnlocked: p.isUnlocked
    })))

    availablePrizes.value = allPrizes
      .filter(prize => {
        const isPast = prize.weekStart < now
        const metTarget = prize.weeklyActual >= minRevenue
        const isNotCurrentWeek = getWeekStart(prize.weekStart).getTime() !== getWeekStart(now).getTime()
        const manuallyAvailable = prize.availableToUnlock === true

        console.log(`Week ${prize.weekStart.toISOString().split('T')[0]}:`, {
          isPast,
          metTarget,
          manuallyAvailable,
          isNotCurrentWeek,
          actual: prize.weeklyActual,
          target: minRevenue
        })

        // Show if: past week + not current week + (met target OR manually marked as available)
        return isPast && isNotCurrentWeek && (metTarget || manuallyAvailable)
      })
      .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime()) as WeeklyPrize[]

    console.log('🎁 Available prizes to unlock:', availablePrizes.value.length)
    console.log('🎉 Prizes:', availablePrizes.value.map(p => ({
      weekStart: p.weekStart.toISOString().split('T')[0],
      prizeText: p.prizeText,
      availableToUnlock: p.availableToUnlock,
      isUnlocked: p.isUnlocked
    })))
  } catch (error) {
    console.error('Error loading available prizes:', error)
  }
}

const createNewPrize = async () => {
  try {
    const weekStart = getWeekStart(new Date())

    const prizeData = {
      weekStart: weekStart,
      prizeText: prizeSettings.value.text,
      weeklyTarget: minRevenue,
      weeklyActual: 0,
      isUnlocked: false
    }

    const docRef = await addDoc(collection(db, 'weekly_prizes'), prizeData)

    currentPrize.value = {
      id: docRef.id,
      ...prizeData
    }

    await calculateWeeklyStats()
  } catch (error) {
    console.error('Error creating prize:', error)
  }
}

const calculateWeeklyStats = async () => {
  try {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const appointmentsRef = collection(db, 'appointments')
    const q = query(
      appointmentsRef,
      where('date', '>=', weekStart),
      where('date', '<', weekEnd)
    )

    const snapshot = await getDocs(q)
    let totalAppointments = 0
    let totalRevenue = 0
    let totalPaid = 0

    snapshot.forEach((docSnapshot) => {
      const appointment = docSnapshot.data()

      // Count attended appointments (regular)
      if (appointment.attended && !appointment.isGroup) {
        totalAppointments++
        totalRevenue += appointment.price || 0

        // Sum payments
        if (appointment.payments && Array.isArray(appointment.payments)) {
          appointment.payments.forEach((payment: any) => {
            totalPaid += payment.amount || 0
          })
        }
      }

      // Count group appointments - ONE appointment per group (not per participant!)
      if (appointment.isGroup && appointment.groupParticipants && Array.isArray(appointment.groupParticipants)) {
        // Count as ONE appointment for the group
        totalAppointments++

        // But count revenue and payments per attended participant
        appointment.groupParticipants.forEach((p: any) => {
          if (p.attended) {
            totalRevenue += appointment.groupPrice || 0

            // Sum participant payments
            if (p.payments && Array.isArray(p.payments)) {
              p.payments.forEach((payment: any) => {
                totalPaid += payment.amount || 0
              })
            }
          }
        })
      }
    })

    appointmentsCount.value = totalAppointments
    weeklyRevenue.value = totalRevenue
    weeklyPaidAmount.value = totalPaid

    console.log('📊 Weekly Stats:')
    console.log('  Appointments:', totalAppointments)
    console.log('  Revenue:', totalRevenue)
    console.log('  Paid:', totalPaid)

    // Update prize
    if (currentPrize.value.id) {
      await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
        weeklyActual: totalRevenue
      })
      currentPrize.value.weeklyActual = totalRevenue
    }
  } catch (error) {
    console.error('Error calculating weekly stats:', error)
  }
}

const unlockPrize = async () => {
  unlocking.value = true
  try {
    await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
      isUnlocked: true,
      unlockedAt: new Date()
    })

    currentPrize.value.isUnlocked = true
    currentPrize.value.unlockedAt = new Date()

    showSnackbar('🎉 מזל טוב! הפרס נפתח!', 'success')

    // Reload available prizes
    await loadAvailablePrizes()
  } catch (error) {
    console.error('Error unlocking prize:', error)
    showSnackbar('שגיאה בפתיחת הפרס', 'error')
  } finally {
    unlocking.value = false
  }
}

const unlockSpecificPrize = async (prize: WeeklyPrize) => {
  if (!confirm(`🎁 לפתוח את הפרס המיוחד?\n\nאתה עומד לגלות מה זכית!`)) return

  try {
    await updateDoc(doc(db, 'weekly_prizes', prize.id), {
      isUnlocked: true,
      unlockedAt: new Date()
    })

    // Load this prize as the current one to show the celebration
    currentPrize.value = {
      ...prize,
      isUnlocked: true,
      unlockedAt: new Date()
    }

    showSnackbar('🎉 מזל טוב! הפרס נפתח!', 'success')

    // Reload available prizes after a delay to show celebration
    setTimeout(async () => {
      await loadAvailablePrizes()
    }, 3000)
  } catch (error) {
    console.error('Error unlocking prize:', error)
    showSnackbar('שגיאה בפתיחת הפרס', 'error')
  }
}

const savePrizeSettings = async () => {
  savingSettings.value = true
  try {
    if (currentPrize.value.id) {
      await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
        prizeText: prizeSettings.value.text
      })

      currentPrize.value.prizeText = prizeSettings.value.text
    }

    showSnackbar('ההגדרות נשמרו בהצלחה', 'success')
  } catch (error) {
    console.error('Error saving settings:', error)
    showSnackbar('שגיאה בשמירת ההגדרות', 'error')
  } finally {
    savingSettings.value = false
  }
}

const startNewWeek = async () => {
  try {
    await createNewPrize()
    showSnackbar('שבוע חדש התחיל! בהצלחה!', 'success')
  } catch (error) {
    console.error('Error starting new week:', error)
    showSnackbar('שגיאה ביצירת שבוע חדש', 'error')
  }
}

const closeCurrentPrize = async () => {
  try {
    console.log('🔄 Closing current prize and moving to next week...')

    // Check if current prize's week has ended
    const now = new Date()
    const currentWeekStart = getWeekStart(now)
    const prizeWeekStart = getWeekStart(currentPrize.value.weekStart)

    console.log('Current week start:', currentWeekStart.toISOString().split('T')[0])
    console.log('Prize week start:', prizeWeekStart.toISOString().split('T')[0])

    // If we're in a new week, create a new prize
    if (currentWeekStart.getTime() !== prizeWeekStart.getTime()) {
      console.log('✅ New week detected, creating new prize...')
      await createNewPrize()
      await loadAvailablePrizes()
      showSnackbar('✅ עברנו לשבוע החדש!', 'success')
    } else {
      // Same week, just reload
      console.log('⚠️ Same week, just reloading...')
      await loadPrize()
      showSnackbar('🔄 רענון...', 'info')
    }
  } catch (error) {
    console.error('Error closing prize:', error)
    showSnackbar('שגיאה', 'error')
  }
}

const hideUnlockedPrize = async () => {
  try {
    console.log('🙈 Hiding unlocked prize and showing current week...')

    // Force reset to current week
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    console.log('Looking for prize in week:', weekStart.toISOString().split('T')[0])

    // Look for ALL prizes in current week (simpler query, no index needed)
    const q = query(
      collection(db, 'weekly_prizes'),
      where('weekStart', '>=', weekStart),
      where('weekStart', '<', weekEnd)
    )

    const snapshot = await getDocs(q)

    console.log('📦 Found prizes in current week:', snapshot.docs.length)

    // Find first unlocked prize, or any prize
    let selectedDoc = null

    for (const doc of snapshot.docs) {
      const data = doc.data()
      console.log('Prize:', {
        weekStart: data.weekStart?.toDate().toISOString().split('T')[0],
        isUnlocked: data.isUnlocked
      })

      // Prefer unlocked prizes
      if (!data.isUnlocked) {
        selectedDoc = doc
        break
      }
    }

    // If no unlocked prize found, use first one or create new
    if (!selectedDoc && snapshot.docs.length > 0) {
      selectedDoc = snapshot.docs[0]
    }

    if (!selectedDoc) {
      console.log('No prize for current week, creating...')
      await createNewPrize()
    } else {
      const data = selectedDoc.data()
      currentPrize.value = {
        id: selectedDoc.id,
        ...data,
        weekStart: data.weekStart?.toDate() || weekStart,
        unlockedAt: data.unlockedAt?.toDate()
      } as WeeklyPrize

      prizeSettings.value = {
        text: currentPrize.value.prizeText
      }

      await calculateWeeklyStats()
    }

    await loadAvailablePrizes()
    showSnackbar('✅ מציג את השבוע הנוכחי', 'success')
  } catch (error) {
    console.error('Error hiding prize:', error)
    showSnackbar('שגיאה', 'error')
  }
}

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
}

// Lifecycle
onMounted(() => {
  loadPrize()
})
</script>

<style scoped>
/* Animated Title */
.animated-title {
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #667eea);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.sparkle {
  display: inline-block;
  animation: sparkle-rotate 2s linear infinite;
}

/* Prize Container */
.prize-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@keyframes sparkle-rotate {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
}

/* Main Prize Card */
.prize-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradient-flow 8s ease infinite;
  color: white;
  position: relative;
  overflow: hidden;
}

.prize-card.victory-mode {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd700 100%);
  background-size: 200% 200%;
  animation: victory-gradient 3s ease infinite, card-pulse 2s ease infinite;
}

@keyframes gradient-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes victory-gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes card-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 50px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.02); box-shadow: 0 0 80px rgba(255, 215, 0, 0.8); }
}

/* Particles */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation: particle-float 6s ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  50% { transform: translateY(-30px) translateX(30px); opacity: 0.7; }
}

/* Gift Box */
.gift-box-wrapper {
  position: relative;
  display: inline-block;
  margin: 40px 0;
}

.gift-box {
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.gift-box.gift-bounce {
  animation: gentle-bounce 2s ease-in-out infinite;
}

.gift-box.gift-shake {
  animation: excited-shake 0.5s ease-in-out infinite;
}

.gift-box.gift-glow {
  animation: mega-glow 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8));
}

@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes excited-shake {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-10deg) scale(1.05); }
  75% { transform: rotate(10deg) scale(1.05); }
}

@keyframes mega-glow {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8));
  }
  50% {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 60px rgba(255, 215, 0, 1));
  }
}

.gift-icon {
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4));
}

.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: lock-pulse 2s ease-in-out infinite;
}

@keyframes lock-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

.lock-icon {
  animation: lock-shake 3s ease-in-out infinite;
}

@keyframes lock-shake {
  0%, 90%, 100% { transform: rotate(0deg); }
  92%, 96% { transform: rotate(-5deg); }
  94%, 98% { transform: rotate(5deg); }
}

/* Floating Stars */
.stars-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.floating-star {
  position: absolute;
  font-size: 24px;
  animation: star-float 3s ease-in-out infinite;
}

@keyframes star-float {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 1;
  }
}

/* Energy Rings */
.energy-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(255, 215, 0, 0.6);
  border-radius: 50%;
  animation: ring-expand 2s ease-out infinite;
}

.ring-1 { animation-delay: 0s; }
.ring-2 { animation-delay: 0.7s; }
.ring-3 { animation-delay: 1.4s; }

@keyframes ring-expand {
  0% {
    width: 50px;
    height: 50px;
    opacity: 1;
  }
  100% {
    width: 250px;
    height: 250px;
    opacity: 0;
  }
}

/* Status Title */
.status-title {
  animation: title-pulse 2s ease-in-out infinite;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
}

.victory-text {
  animation: rainbow-text 2s linear infinite, bounce-text 1s ease-in-out infinite;
  font-size: 3rem !important;
}

@keyframes title-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes rainbow-text {
  0% { text-shadow: 0 0 20px #ff0000; }
  20% { text-shadow: 0 0 20px #ff7700; }
  40% { text-shadow: 0 0 20px #ffff00; }
  60% { text-shadow: 0 0 20px #00ff00; }
  80% { text-shadow: 0 0 20px #0000ff; }
  100% { text-shadow: 0 0 20px #ff0000; }
}

@keyframes bounce-text {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Stat Cards */
.stat-card {
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.1); }
}

.stat-label {
  font-size: 1.3rem;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.mega-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
  transition: all 0.5s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.mega-number.goal-reached {
  color: #4CAF50;
  animation: number-celebrate 1s ease-in-out infinite;
}

@keyframes number-celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.counter-number {
  animation: counter-glow 2s ease-in-out infinite;
}

@keyframes counter-glow {
  0%, 100% { text-shadow: 0 0 10px rgba(102, 126, 234, 0.3); }
  50% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
}

.stat-divider {
  margin: 0 10px;
  opacity: 0.5;
}

.stat-target {
  opacity: 0.7;
}

.currency {
  font-size: 2rem;
  margin-right: 8px;
}

.stat-subtext {
  font-size: 1rem;
  color: #999;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Mega Unlock Button */
.mega-unlock-button {
  animation: mega-button-pulse 1.5s ease-in-out infinite, rainbow-border 3s linear infinite;
  font-size: 1.5rem !important;
  padding: 32px 48px !important;
  min-height: 80px !important;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) !important;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), 0 10px 30px rgba(0, 0, 0, 0.3) !important;
}

@keyframes mega-button-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@keyframes rainbow-border {
  0%, 100% { box-shadow: 0 0 40px #ff0000, 0 10px 30px rgba(0, 0, 0, 0.3); }
  33% { box-shadow: 0 0 40px #00ff00, 0 10px 30px rgba(0, 0, 0, 0.3); }
  66% { box-shadow: 0 0 40px #0000ff, 0 10px 30px rgba(0, 0, 0, 0.3); }
}

.button-text {
  font-weight: bold;
  font-size: 1.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Unlocked State - MEGA Celebration */
.mega-confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 100;
}

.confetti {
  position: absolute;
  top: -10px;
  width: 15px;
  height: 15px;
  opacity: 0.9;
  animation: confetti-fall 5s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(1080deg);
    opacity: 0;
  }
}

.fireworks-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99;
}

.firework {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffd700;
  animation: firework-explode 2s ease-out infinite;
}

@keyframes firework-explode {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 #ffd700, 0 0 0 0 #ff6b6b, 0 0 0 0 #4ecdc4;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) scale(0);
    opacity: 0;
    box-shadow:
      0 -50px 60px 30px #ffd700,
      50px 0 60px 30px #ff6b6b,
      -50px 0 60px 30px #4ecdc4,
      0 50px 60px 30px #f093fb;
  }
}

.balloons-container {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 98;
}

.balloon {
  position: absolute;
  bottom: -50px;
  font-size: 40px;
  animation: balloon-float 6s ease-in infinite;
}

@keyframes balloon-float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-120vh) rotate(180deg);
    opacity: 0;
  }
}

.mega-gift-opening {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.gift-explosion {
  position: absolute;
  font-size: 150px;
  animation: explosion 1s ease-out;
  z-index: 101;
}

@keyframes explosion {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.prize-star-burst {
  animation: prize-burst 2s ease-out forwards;
}

@keyframes prize-burst {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.trophy-icon {
  animation: trophy-spin 4s linear infinite;
  filter: drop-shadow(0 0 50px rgba(255, 215, 0, 1));
}

@keyframes trophy-spin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

.mega-celebration-text {
  animation: mega-celebration 2s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 102;
}

@keyframes mega-celebration {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
  }
  50% {
    transform: scale(1.1) rotate(2deg);
    text-shadow: 0 0 50px rgba(255, 215, 0, 1);
  }
}

.achievement-text {
  position: relative;
  z-index: 102;
  animation: fade-in-up 1.5s ease-out;
  text-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.prize-reveal-card {
  animation: card-reveal 2s ease-out 1s both;
  position: relative;
  z-index: 102;
  background: rgba(255, 255, 255, 0.98);
}

@keyframes card-reveal {
  0% {
    transform: rotateX(-90deg) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: rotateX(10deg) scale(1.05);
  }
  100% {
    transform: rotateX(0deg) scale(1);
    opacity: 1;
  }
}

.prize-text {
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: prize-shimmer 3s ease-in-out infinite;
}

@keyframes prize-shimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
}

/* Responsive */
@media (max-width: 600px) {
  .mega-number {
    font-size: 2.5rem;
  }

  .button-text {
    font-size: 1.2rem;
  }

  .mega-unlock-button {
    padding: 24px 32px !important;
    min-height: 60px !important;
  }
}

/* Available Prizes Cards */
.available-prize-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  transition: all 0.3s ease;
  cursor: pointer;
}

.available-prize-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

.gift-icon-small {
  animation: gentle-bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 5px 15px rgba(255, 193, 7, 0.4));
}

.unlock-prize-btn {
  animation: button-glow 2s ease-in-out infinite;
}

@keyframes button-glow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(76, 175, 80, 0.8);
  }
}
</style>
