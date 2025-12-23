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

    <!-- תצוגת הפרס - כולם (למעט כפתור פתיחה שמוצג רק בזמן הנכון) -->
    <v-row v-if="!currentPrize.isUnlocked" class="mb-6">
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="prize-card" rounded="xl" elevation="8">
          <v-card-text class="pa-8">
            <div class="prize-container">
              <!-- Locked State -->
              <div v-if="!currentPrize.isUnlocked" class="locked-state">
                <div class="gift-box" :class="{ 'shake': daysCompleted > 0 }">
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
                  {{ isUnlockable ? '🎉 המתנה מוכנה!' : targetReached ? '🎯 הגעת ליעד!' : '🔒 המתנה נעולה' }}
                </h3>

                <p class="text-h6 mb-6">
                  {{ isUnlockable
                    ? 'כל הכבוד! הגעת ליעד השבועי!'
                    : targetReached
                      ? 'הגעת ליעד! פתיחת המתנה תהיה זמינה במוצאי שבת'
                      : `הכנסה: ₪${currentPrize.weeklyActual.toLocaleString()} (שולם: ₪${weeklyPaidAmount.toLocaleString()}) מתוך ₪${currentPrize.weeklyTarget.toLocaleString()}`
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
                    <strong>{{ currentPrize.weeklyTarget > 0 ? Math.round(progress) : 0 }}%</strong>
                  </template>
                </v-progress-linear>

                <!-- Days Tracking -->
                <div class="days-tracking mb-6">
                  <v-row>
                    <v-col
                      v-for="day in weekDays"
                      :key="day.index"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-card
                        :class="[
                          'day-card',
                          {
                            'day-success': day.metTarget && !day.isFuture,
                            'day-warning': !day.metTarget && !day.isFuture && day.targetAmount > 0,
                            'day-future': day.isFuture,
                            'day-today': day.isToday
                          }
                        ]"
                        rounded="lg"
                        elevation="2"
                      >
                        <v-card-text class="pa-3">
                          <div class="day-header-small">
                            <v-icon
                              :icon="day.isFuture ? 'mdi-circle-outline' : (day.metTarget ? 'mdi-check-circle' : 'mdi-alert-circle-outline')"
                              :color="day.isFuture ? 'grey-lighten-1' : (day.metTarget ? 'success' : 'warning')"
                              size="small"
                            />
                            <span class="day-name-small">{{ day.name }}</span>
                          </div>

                          <div v-if="!day.isFuture" class="day-amounts">
                            <div class="day-revenue">
                              <span class="amount-label">הכנסה:</span>
                              <span class="amount-value">₪{{ day.revenueAmount.toLocaleString() }}</span>
                            </div>
                            <div class="day-paid">
                              <span class="amount-label">שולם:</span>
                              <span class="amount-value">₪{{ day.paidAmount.toLocaleString() }}</span>
                            </div>
                            <div v-if="day.targetAmount > 0" class="day-target">
                              <span class="amount-label">יעד:</span>
                              <span class="amount-value">₪{{ day.targetAmount.toLocaleString() }}</span>
                            </div>

                            <v-chip
                              v-if="day.metTarget"
                              size="x-small"
                              color="success"
                              variant="flat"
                              class="mt-2"
                            >
                              ✓ עמד ביעד!
                            </v-chip>
                            <v-chip
                              v-else-if="day.targetAmount > 0"
                              size="x-small"
                              color="warning"
                              variant="flat"
                              class="mt-2"
                            >
                              חסר ₪{{ (day.targetAmount - day.revenueAmount).toLocaleString() }}
                            </v-chip>
                          </div>

                          <div v-else class="day-future-state">
                            <v-icon icon="mdi-clock-outline" size="small" color="grey-lighten-1" />
                            <span class="text-caption text-grey-lighten-1">בקרוב</span>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Weekly Summary -->
                <v-card class="mb-6 financial-summary" rounded="lg" elevation="0">
                  <v-card-text>
                    <v-row align="center" justify="center">
                      <v-col cols="12" md="4" class="text-center">
                        <div class="financial-label">יעד שבועי</div>
                        <div class="financial-value target-value">
                          ₪{{ currentPrize.weeklyTarget.toLocaleString() }}
                        </div>
                      </v-col>
                      <v-col cols="12" md="4" class="text-center">
                        <div class="financial-label">הכנסה בפועל</div>
                        <div class="financial-value actual-value" :class="{ 'target-reached': targetReached }">
                          ₪{{ currentPrize.weeklyActual.toLocaleString() }}
                        </div>
                      </v-col>
                      <v-col cols="12" md="4" class="text-center">
                        <div class="financial-label">שולם מזה</div>
                        <div class="financial-value" style="color: #4CAF50;">
                          ₪{{ weeklyPaidAmount.toLocaleString() }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- Unlock Button - רק במוצאי שבת + עמד ביעד -->
                <v-btn
                  v-if="isUnlockable"
                  color="white"
                  size="x-large"
                  rounded="xl"
                  elevation="8"
                  class="unlock-button"
                  :loading="unlocking"
                  @click="unlockPrize"
                >
                  <v-icon icon="mdi-gift-open" size="large" />
                  פתח את המתנה!
                </v-btn>

                <!-- הודעה למשתמש רגיל -->
                <p v-else-if="!isAdmin" class="text-body-1 text-medium-emphasis">
                  {{ targetReached
                    ? '🎯 מעולה! הגעת ליעד! פתיחת המתנה תהיה זמינה במוצאי שבת (שבת אחרי 20:00 או ביום ראשון) 🎁'
                    : '💪 המשך לעדכן תשלומים כדי להגיע ליעד השבועי!'
                  }}
                </p>

                <!-- הודעה למנהל -->
                <p v-else class="text-body-1 text-medium-emphasis">
                  {{ targetReached
                    ? 'פתיחת המתנה תהיה זמינה במוצאי שבת (שבת אחרי 20:00 או ביום ראשון) 🎁'
                    : 'המשך לעדכן תשלומים כדי להגיע ליעד השבועי! 💪'
                  }}
                </p>
              </div>

              <!-- Unlocked State -->
              <div v-else class="unlocked-state">
                <!-- Confetti Background -->
                <div class="confetti-container">
                  <div class="confetti" v-for="i in 50" :key="i" :style="getConfettiStyle(i)"></div>
                </div>

                <!-- Gift Box Opening Animation -->
                <div class="gift-opening-container">
                  <div class="gift-box-bottom">
                    <v-icon
                      icon="mdi-gift"
                      size="80"
                      color="success"
                    />
                  </div>
                  <div class="gift-box-lid">
                    <v-icon
                      icon="mdi-gift"
                      size="40"
                      color="success"
                    />
                  </div>

                  <!-- Prize popping out -->
                  <div class="prize-popup">
                    <v-icon
                      icon="mdi-star-circle"
                      size="100"
                      color="warning"
                      class="prize-star"
                    />
                  </div>
                </div>

                <h3 class="text-h3 mb-4 mt-8 celebration-text">🎉 מזל טוב!</h3>

                <p class="text-h6 mb-6 achievement-text">
                  עמדת ביעד השבועי! הכנסת השבוע ₪{{ currentPrize.weeklyActual.toLocaleString() }} (שולם: ₪{{ weeklyPaidAmount.toLocaleString() }})
                </p>

                <v-card class="prize-reveal" rounded="xl" elevation="8">
                  <v-card-text class="pa-8">
                    <p class="text-h5 mb-3 text-success">הפרס שלך:</p>
                    <p class="text-h4 font-weight-bold text-primary">
                      {{ currentPrize.prizeText }}
                    </p>
                  </v-card-text>
                </v-card>

                <p class="text-body-1 mt-6 text-medium-emphasis">
                  נפתח ב: {{ formatDateTime(currentPrize.unlockedAt!) }}
                </p>

                <v-btn
                  v-if="isAdmin"
                  color="primary"
                  size="large"
                  rounded="xl"
                  class="mt-6"
                  @click="startNewWeek"
                >
                  <v-icon icon="mdi-restart" />
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
            <v-icon icon="mdi-cog" />
            הגדרות פרס (מנהל בלבד)
          </v-card-title>

          <v-card-text class="pa-6">
            <p class="text-subtitle-2 mb-4 text-medium-emphasis">
              היעד השבועי נקבע בתחילת השבוע לפי הפגישות ביומן. היעד לא משתנה אוטומטית - זה מאפשר גמישות בזמני הפגישות. הפרס יהיה זמין לפתיחה במוצאי שבת אם הושג היעד.
            </p>

            <v-text-field
              v-model="prizeSettings.text"
              label="תיאור הפרס"
              variant="outlined"
              rounded="lg"
              placeholder="לדוגמה: ערב קולנוע, מסאז', ארוחה במסעדה..."
              class="mb-4"
            />

            <v-alert
              v-if="currentPrize.weeklyTarget > 0"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              <div class="text-body-2">
                <strong>יעד שבועי נוכחי:</strong> ₪{{ currentPrize.weeklyTarget.toLocaleString() }}<br>
                <strong>הכנסה בפועל:</strong> ₪{{ currentPrize.weeklyActual.toLocaleString() }}<br>
                <strong>שולם מזה:</strong> ₪{{ weeklyPaidAmount.toLocaleString() }}
              </div>
            </v-alert>

            <v-row>
              <v-col cols="12" md="6">
                <v-btn
                  color="primary"
                  rounded="xl"
                  block
                  :loading="savingSettings"
                  @click="savePrizeSettings"
                >
                  <v-icon icon="mdi-content-save" />
                  שמור תיאור פרס
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  color="warning"
                  rounded="xl"
                  block
                  :loading="updatingTarget"
                  @click="updateWeeklyTargetFromCalendar"
                >
                  <v-icon icon="mdi-calculator" />
                  עדכן יעד מהיומן
                </v-btn>
              </v-col>
            </v-row>

            <v-alert
              type="warning"
              variant="tonal"
              class="mt-4"
              density="compact"
            >
              <div class="text-caption">
                💡 היעד השבועי נקבע בתחילת השבוע ולא משתנה אוטומטית. לחץ על "עדכן יעד מהיומן" רק במקרים חריגים.
              </div>
            </v-alert>
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
  weeklyTarget: 0,
  weeklyActual: 0,
  isUnlocked: false
})

const prizeSettings = ref({
  text: 'הפתעה מיוחדת! 🎁'
})

const unlocking = ref(false)
const savingSettings = ref(false)
const updatingTarget = ref(false)
const dailyRevenue = ref<Record<string, number>>({}) // הכנסה יומית (attended appointments)
const dailyPayments = ref<Record<string, number>>({}) // סכום תשלומים לכל יום
const dailyTargets = ref<Record<string, number>>({}) // יעד קבוע לכל יום
const weeklyPaidAmount = ref(0) // סכום שולם בפועל השבוע

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Constants
const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

// Check if user is admin (gift@gift.co.il)
const isAdmin = computed(() => {
  return auth.currentUser?.email === 'gift@gift.co.il'
})

// Computed
const progress = computed(() => {
  if (currentPrize.value.weeklyTarget === 0) return 0
  return Math.min((currentPrize.value.weeklyActual / currentPrize.value.weeklyTarget) * 100, 100)
})

const targetReached = computed(() => {
  return currentPrize.value.weeklyActual >= currentPrize.value.weeklyTarget && currentPrize.value.weeklyTarget > 0
})

const isSaturdayEvening = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()

  // Saturday (6) after 20:00 or Sunday (0)
  return (day === 6 && hour >= 20) || day === 0
})

const isUnlockable = computed(() => {
  return targetReached.value && isSaturdayEvening.value && !currentPrize.value.isUnlocked
})

// יעד יומי - מחולק על 5 ימי עבודה (ראשון-חמישי)
const dailyTarget = computed(() => {
  if (currentPrize.value.weeklyTarget === 0) return 0
  return Math.round(currentPrize.value.weeklyTarget / 5)
})

// ימי השבוע עם סטטוס
const weekDays = computed(() => {
  const days = []
  const weekStart = getWeekStart(new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    const revenueAmount = dailyRevenue.value[dateStr] || 0 // הכנסה (attended)
    const paidAmount = dailyPayments.value[dateStr] || 0 // שולם בפועל
    const targetForDay = dailyTargets.value[dateStr] || 0 // יעד קבוע
    const isPast = date < today
    const isToday = date.getTime() === today.getTime()

    const metTarget = revenueAmount >= targetForDay && targetForDay > 0

    days.push({
      index: i,
      name: hebrewDays[i],
      date: date,
      dateStr: dateStr,
      revenueAmount: revenueAmount, // הכנסה
      paidAmount: paidAmount, // תשלומים
      targetAmount: targetForDay,
      isPast: isPast,
      isToday: isToday,
      isFuture: date > today,
      metTarget: metTarget,
      status: date > today ? 'future' : (metTarget ? 'success' : 'warning')
    })
  }
  return days
})

// כמה ימים עמדו ביעד
const daysCompleted = computed(() => {
  return weekDays.value.filter(d => d.metTarget && (d.isPast || d.isToday)).length
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

function getConfettiStyle(index: number) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']
  const randomColor = colors[index % colors.length]
  const randomLeft = Math.random() * 100
  const randomDelay = Math.random() * 2
  const randomDuration = 2 + Math.random() * 2

  return {
    left: `${randomLeft}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

// Methods
const calculateInitialWeeklyTarget = async (): Promise<number> => {
  try {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // Get all appointments this week
    const appointmentsRef = collection(db, 'appointments')
    const q = query(
      appointmentsRef,
      where('date', '>=', weekStart),
      where('date', '<', weekEnd)
    )

    const snapshot = await getDocs(q)
    let totalTarget = 0

    snapshot.forEach((docSnapshot) => {
      const appointment = docSnapshot.data()
      totalTarget += appointment.price || 0
    })

    console.log('🎯 Initial Weekly Target calculated:', totalTarget)
    return totalTarget
  } catch (error) {
    console.error('Error calculating initial target:', error)
    return 0
  }
}

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
        text: currentPrize.value.prizeText
      }

      // Calculate actual payments this week
      await calculateWeeklyActual()
    }
  } catch (error) {
    console.error('Error loading prize:', error)
  }
}

const createNewPrize = async () => {
  try {
    const weekStart = getWeekStart(new Date())

    // Calculate initial weekly target from current appointments
    const initialTarget = await calculateInitialWeeklyTarget()

    const prizeData = {
      weekStart: weekStart,
      prizeText: prizeSettings.value.text,
      weeklyTarget: initialTarget,
      weeklyActual: 0,
      isUnlocked: false
    }

    const docRef = await addDoc(collection(db, 'weekly_prizes'), prizeData)

    currentPrize.value = {
      id: docRef.id,
      ...prizeData
    }

    await calculateWeeklyActual()
  } catch (error) {
    console.error('Error creating prize:', error)
  }
}

const calculateWeeklyActual = async () => {
  try {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // Get all appointments this week
    const appointmentsRef = collection(db, 'appointments')
    const q = query(
      appointmentsRef,
      where('date', '>=', weekStart),
      where('date', '<', weekEnd)
    )

    const snapshot = await getDocs(q)
    let totalRevenue = 0 // הכנסה לפי פגישות שהלקוח הגיע אליהן
    let totalPaid = 0 // תשלומים בפועל
    const dailyRevenueTotals: Record<string, number> = {} // הכנסה יומית
    const dailyPaymentTotals: Record<string, number> = {} // תשלומים יומיים

    snapshot.forEach((docSnapshot) => {
      const appointment = docSnapshot.data()
      const appointmentDate = appointment.date?.toDate ? appointment.date.toDate() : new Date(appointment.date)
      const dateStr = appointmentDate.toISOString().split('T')[0]
      const price = appointment.price || 0

      // אם הלקוח הגיע לפגישה - מוסיפים את המחיר להכנסה
      if (appointment.attended) {
        totalRevenue += price
        dailyRevenueTotals[dateStr] = (dailyRevenueTotals[dateStr] || 0) + price
      }

      // Sum all payments for this appointment
      if (appointment.payments && Array.isArray(appointment.payments)) {
        appointment.payments.forEach((payment: any) => {
          const amount = payment.amount || 0
          totalPaid += amount
          dailyPaymentTotals[dateStr] = (dailyPaymentTotals[dateStr] || 0) + amount
        })
      }
    })

    // Update daily revenue and payments refs
    dailyRevenue.value = dailyRevenueTotals
    dailyPayments.value = dailyPaymentTotals
    weeklyPaidAmount.value = totalPaid

    // Calculate daily targets based on fixed weekly target (divide by 5 work days)
    const dailyTargetAmount = currentPrize.value.weeklyTarget > 0
      ? Math.round(currentPrize.value.weeklyTarget / 5)
      : 0

    // Set same target for each work day (Sun-Thu)
    const targets: Record<string, number> = {}
    for (let i = 0; i < 5; i++) { // Only work days (0-4 = Sun-Thu)
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      targets[dateStr] = dailyTargetAmount
    }
    dailyTargets.value = targets

    console.log('📊 WeeklyPrize - Daily Targets (fixed):', targets)
    console.log('📊 WeeklyPrize - Daily Revenue (attended):', dailyRevenueTotals)
    console.log('📊 WeeklyPrize - Daily Payments:', dailyPaymentTotals)
    console.log('📊 WeeklyPrize - Total Revenue (attended):', totalRevenue)
    console.log('📊 WeeklyPrize - Total Paid:', totalPaid)

    // Update prize with actual revenue amount (but NOT the target)
    if (currentPrize.value.id) {
      await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
        weeklyActual: totalRevenue
      })
      currentPrize.value.weeklyActual = totalRevenue
    }
  } catch (error) {
    console.error('Error calculating weekly actual:', error)
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

const updateWeeklyTargetFromCalendar = async () => {
  updatingTarget.value = true
  try {
    const newTarget = await calculateInitialWeeklyTarget()

    if (currentPrize.value.id) {
      await updateDoc(doc(db, 'weekly_prizes', currentPrize.value.id), {
        weeklyTarget: newTarget
      })

      currentPrize.value.weeklyTarget = newTarget

      // Recalculate actual and daily targets
      await calculateWeeklyActual()

      showSnackbar(`יעד שבועי עודכן ל-₪${newTarget.toLocaleString()}`, 'success')
    }
  } catch (error) {
    console.error('Error updating weekly target:', error)
    showSnackbar('שגיאה בעדכון היעד השבועי', 'error')
  } finally {
    updatingTarget.value = false
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

.financial-summary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.financial-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 8px;
}

.financial-value {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.target-value {
  color: #FFC107;
}

.actual-value {
  color: #E3F2FD;
}

.actual-value.target-reached {
  color: #4CAF50;
  text-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

/* Days Tracking Styles */
.days-tracking {
  width: 100%;
}

.day-card {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 2px solid transparent;
}

.day-card.day-success {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.3);
}

.day-card.day-warning {
  background: rgba(255, 152, 0, 0.15);
  border-color: rgba(255, 152, 0, 0.3);
}

.day-card.day-future {
  opacity: 0.5;
}

.day-card.day-today {
  border-color: rgba(255, 193, 7, 0.6);
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
}

.day-header-small {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.day-name-small {
  font-weight: 600;
  font-size: 0.95rem;
}

.day-amounts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-revenue,
.day-paid,
.day-target {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.amount-label {
  opacity: 0.8;
}

.amount-value {
  font-weight: 600;
}

.day-future-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
}

/* Button Animation */
.unlock-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Confetti Animation */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.confetti {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  opacity: 0.8;
  animation: confetti-fall 4s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Gift Opening Animation */
.gift-opening-container {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.gift-box-bottom {
  position: absolute;
  z-index: 2;
  animation: box-shake 0.5s ease-in-out;
}

.gift-box-lid {
  position: absolute;
  z-index: 3;
  animation: lid-open 1s ease-out forwards;
}

.prize-popup {
  position: absolute;
  z-index: 1;
  animation: prize-pop 1.5s ease-out 0.5s forwards;
  opacity: 0;
}

@keyframes box-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes lid-open {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) rotate(-20deg);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-150px) rotate(-30deg);
    opacity: 0;
  }
}

@keyframes prize-pop {
  0% {
    transform: translateY(50px) scale(0);
    opacity: 0;
  }
  60% {
    transform: translateY(-30px) scale(1.2);
    opacity: 1;
  }
  80% {
    transform: translateY(-10px) scale(0.9);
  }
  100% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
}

.prize-star {
  animation: star-rotate 3s linear infinite;
  filter: drop-shadow(0 0 30px rgba(255, 193, 7, 0.8));
}

@keyframes star-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.celebration-text {
  animation: celebration-bounce 1s ease-out;
  position: relative;
  z-index: 2;
}

@keyframes celebration-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.achievement-text {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: fade-in-up 1s ease-out 0.5s both;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.prize-reveal {
  animation: reveal 1s ease-out 1.5s both;
  position: relative;
  z-index: 2;
}

@keyframes reveal {
  0% {
    transform: scale(0) rotate(-10deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
</style>

