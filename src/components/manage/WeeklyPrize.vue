<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12" class="text-right">
        <h2 class="text-h4 mb-2">🎁 הפרס השבועי</h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          עדכן את המערכת כל יום השבוע וזכה לפתוח את קופסת ההפתעה!
        </p>
      </v-col>
    </v-row>

    <!-- Prize Box -->
    <v-row class="mb-6">
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="prize-card" rounded="xl" elevation="8">
          <v-card-text class="pa-8">
            <div class="prize-container">
              <!-- Locked State -->
              <div v-if="!currentPrize.isUnlocked" class="locked-state">
                <div class="gift-box" :class="{ 'shake': daysCompleted.length > 0 }">
                  <v-icon
                    icon="mdi-gift"
                    :size="isUnlockable ? 150 : 120"
                    :color="isUnlockable ? 'primary' : 'grey'"
                    class="gift-icon"
                  />
                  <div v-if="!isUnlockable" class="lock-overlay">
                    <v-icon icon="mdi-lock" size="60" color="white" />
                  </div>
                </div>

                <h3 class="text-h4 mt-6 mb-4">
                  {{ isUnlockable ? '🎉 המתנה מוכנה!' : '🔒 המתנה נעולה' }}
                </h3>

                <p class="text-h6 mb-6">
                  {{ isUnlockable
                    ? 'כל הכבוד! עדכנת את המערכת כל יום השבוע!'
                    : `עדכנת ${daysCompleted.length} מתוך ${requiredDays} ימים`
                  }}
                </p>

                <!-- Progress -->
                <v-progress-linear
                  :model-value="progress"
                  height="20"
                  rounded
                  color="primary"
                  class="mb-6"
                >
                  <template #default>
                    <strong>{{ Math.round(progress) }}%</strong>
                  </template>
                </v-progress-linear>

                <!-- Days Checklist -->
                <div class="days-checklist mb-6">
                  <v-chip
                    v-for="day in weekDays"
                    :key="day.index"
                    :color="isDayCompleted(day.date) ? 'success' : 'grey'"
                    size="large"
                    class="mx-1 mb-2"
                  >
                    <v-icon
                      :icon="isDayCompleted(day.date) ? 'mdi-check-circle' : 'mdi-circle-outline'"
                      start
                    />
                    {{ day.name }}
                  </v-chip>
                </div>

                <!-- Unlock Button -->
                <v-btn
                  v-if="isUnlockable"
                  color="primary"
                  size="x-large"
                  rounded="xl"
                  elevation="8"
                  class="unlock-button"
                  :loading="unlocking"
                  @click="unlockPrize"
                >
                  <v-icon icon="mdi-gift-open" class="ms-2" size="large" />
                  פתח את המתנה!
                </v-btn>

                <p v-else class="text-body-1 text-medium-emphasis">
                  המשך לעדכן את המערכת מדי יום כדי לזכות בפרס! 💪
                </p>
              </div>

              <!-- Unlocked State -->
              <div v-else class="unlocked-state">
                <div class="confetti-animation">
                  🎊🎉🎊
                </div>

                <v-icon
                  icon="mdi-gift-open"
                  size="150"
                  color="success"
                  class="mb-6 celebration-icon"
                />

                <h3 class="text-h3 mb-4">🎉 מזל טוב!</h3>

                <v-card class="prize-reveal" rounded="xl" elevation="4" color="success-lighten-5">
                  <v-card-text class="pa-8">
                    <p class="text-h5 mb-2">הפרס שלך:</p>
                    <p class="text-h4 font-weight-bold primary--text">
                      {{ currentPrize.prizeText }}
                    </p>
                  </v-card-text>
                </v-card>

                <p class="text-body-1 mt-6 text-medium-emphasis">
                  נפתח ב: {{ formatDateTime(currentPrize.unlockedAt!) }}
                </p>

                <v-btn
                  color="primary"
                  size="large"
                  rounded="xl"
                  class="mt-6"
                  @click="startNewWeek"
                >
                  <v-icon icon="mdi-restart" class="ms-2" />
                  התחל שבוע חדש
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
            הגדרות פרס (מנהל בלבד)
            <v-icon icon="mdi-cog" class="me-2" />
          </v-card-title>

          <v-card-text class="pa-6">
            <v-text-field
              v-model="prizeSettings.text"
              label="תיאור הפרס"
              variant="outlined"
              rounded="lg"
              placeholder="לדוגמה: ערב קולנוע, מסאז', ארוחה במסעדה..."
              class="mb-4"
            />

            <v-slider
              v-model="prizeSettings.requiredDays"
              label="כמה ימים נדרשים?"
              :min="3"
              :max="7"
              :step="1"
              show-ticks="always"
              tick-size="4"
              thumb-label
              class="mb-4"
            >
              <template #append>
                <v-icon icon="mdi-calendar-range" />
              </template>
            </v-slider>

            <v-btn
              color="primary"
              rounded="xl"
              block
              :loading="savingSettings"
              @click="savePrizeSettings"
            >
              <v-icon icon="mdi-content-save" class="ms-2" />
              שמור הגדרות
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
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import type { WeeklyPrize } from '@/types/manage'

// State
const currentPrize = ref<WeeklyPrize>({
  id: '',
  weekStart: getWeekStart(new Date()),
  prizeText: 'הפתעה מיוחדת! 🎁',
  requiredDays: 5,
  daysCompleted: [],
  isUnlocked: false
})

const prizeSettings = ref({
  text: 'הפתעה מיוחדת! 🎁',
  requiredDays: 5
})

const unlocking = ref(false)
const savingSettings = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Check if user is admin (gift@gift.co.il)
const isAdmin = computed(() => {
  return auth.currentUser?.email === 'gift@gift.co.il'
})

// Constants
const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

// Computed
const daysCompleted = computed(() => currentPrize.value.daysCompleted)
const requiredDays = computed(() => currentPrize.value.requiredDays)

const progress = computed(() => {
  return (daysCompleted.value.length / requiredDays.value) * 100
})

const isUnlockable = computed(() => {
  return daysCompleted.value.length >= requiredDays.value && !currentPrize.value.isUnlocked
})

const weekDays = computed(() => {
  const days = []
  const weekStart = getWeekStart(new Date())

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    days.push({
      index: i,
      name: hebrewDays[i],
      date: date.toISOString().split('T')[0]
    })
  }
  return days
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

function isDayCompleted(dateStr: string): boolean {
  return daysCompleted.value.includes(dateStr)
}

// Methods
const loadPrize = async () => {
  try {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const q = query(
      collection(db, 'weekly_prizes'),
      where('weekStart', '>=', weekStart),
      where('weekStart', '<', weekEnd)
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Create new prize for this week
      await createNewPrize()
    } else {
      const doc = snapshot.docs[0]
      currentPrize.value = {
        id: doc.id,
        ...doc.data(),
        weekStart: doc.data().weekStart?.toDate() || weekStart,
        unlockedAt: doc.data().unlockedAt?.toDate()
      } as WeeklyPrize

      // Update prize settings
      prizeSettings.value = {
        text: currentPrize.value.prizeText,
        requiredDays: currentPrize.value.requiredDays
      }

      // Check if we need to mark today as completed
      await checkTodayUpdate()
    }
  } catch (error) {
    console.error('Error loading prize:', error)
  }
}

const createNewPrize = async () => {
  try {
    const weekStart = getWeekStart(new Date())

    const prizeData = {
      weekStart: weekStart,
      prizeText: prizeSettings.value.text,
      requiredDays: prizeSettings.value.requiredDays,
      daysCompleted: [],
      isUnlocked: false
    }

    const docRef = await addDoc(collection(db, 'weekly_prizes'), prizeData)

    currentPrize.value = {
      id: docRef.id,
      ...prizeData
    }

    await checkTodayUpdate()
  } catch (error) {
    console.error('Error creating prize:', error)
  }
}

const checkTodayUpdate = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Check if there were any updates today in appointments
    const appointmentsRef = collection(db, 'appointments')
    const todayDate = new Date(today)
    const tomorrowDate = new Date(today)
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)

    const q = query(
      appointmentsRef,
      where('date', '>=', todayDate),
      where('date', '<', tomorrowDate)
    )

    const snapshot = await getDocs(q)

    // If there are appointments today and today is not already completed
    if (snapshot.size > 0 && !isDayCompleted(today)) {
      // Mark today as completed
      const updatedDays = [...daysCompleted.value, today]
      await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
        daysCompleted: updatedDays
      })
      currentPrize.value.daysCompleted = updatedDays
    }
  } catch (error) {
    console.error('Error checking today update:', error)
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
  } catch (error) {
    console.error('Error unlocking prize:', error)
    showSnackbar('שגיאה בפתיחת הפרס', 'error')
  } finally {
    unlocking.value = false
  }
}

const savePrizeSettings = async () => {
  savingSettings.value = true
  try {
    if (currentPrize.value.id) {
      await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
        prizeText: prizeSettings.value.text,
        requiredDays: prizeSettings.value.requiredDays
      })

      currentPrize.value.prizeText = prizeSettings.value.text
      currentPrize.value.requiredDays = prizeSettings.value.requiredDays
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

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
}

// Lifecycle
onMounted(() => {
  loadPrize()
})
</script>

<style scoped>
.prize-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.prize-container {
  text-align: center;
}

.gift-box {
  position: relative;
  display: inline-block;
  transition: transform 0.3s;
}

.gift-box.shake {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.gift-icon {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.days-checklist {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.unlock-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.confetti-animation {
  font-size: 3rem;
  animation: confetti 1s ease-out;
}

@keyframes confetti {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.celebration-icon {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.prize-reveal {
  animation: reveal 0.5s ease-out;
}

@keyframes reveal {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

