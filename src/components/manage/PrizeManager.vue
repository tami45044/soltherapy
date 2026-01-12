<template>
  <v-container class="prize-manager-container">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-gift-outline" size="32" color="primary" />
          ניהול פרסים שבועיים
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          עדכון והגדרת מתנות לשבועות
        </p>
      </v-col>
    </v-row>

    <v-alert v-if="!isGiftAccount" type="warning" variant="tonal" class="mb-6">
      <v-icon icon="mdi-lock" start />
      מערכת זו זמינה רק למשתמש המנהל (gift@gift.co.il)
    </v-alert>

    <div v-if="isGiftAccount">
      <!-- Weekly Prizes List -->
      <v-card rounded="xl" elevation="2" class="mb-6">
        <v-card-title class="pa-5 text-right section-header-clean d-flex justify-space-between align-center">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-calendar-star" size="24" style="opacity: 0.8;" />
            <span class="text-h6">פרסים שבועיים</span>
          </div>
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            @click="openPrizeDialog()"
          >
            <v-icon icon="mdi-plus" start />
            הוסף פרס לשבוע
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Duplicates Warning -->
          <v-alert v-if="duplicateWeeks.length > 0" type="warning" variant="tonal" class="mb-4">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="font-weight-bold mb-2">⚠️ שים לב! יש כפילויות:</div>
                <div v-for="week in duplicateWeeks" :key="week" class="text-body-2">
                  {{ week }} - יש {{ getDuplicateCount(week) }} פרסים לאותו שבוע
                </div>
              </div>
              <v-btn
                color="error"
                variant="elevated"
                rounded="lg"
                @click="cleanDuplicates"
                :loading="cleaning"
              >
                <v-icon icon="mdi-delete-sweep" start />
                נקה כפילויות
              </v-btn>
            </div>
          </v-alert>

          <v-table>
            <thead>
              <tr>
                <th class="text-right">שבוע</th>
                <th class="text-right">תאריך</th>
                <th class="text-right">נפתח?</th>
                <th class="text-right">מתנה</th>
                <th class="text-right">פעולות</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prize in weeklyPrizes" :key="prize.id">
                <td class="text-right font-weight-bold">
                  שבוע {{ formatWeekNumber(prize.weekStart) }}
                </td>
                <td class="text-right">{{ formatDate(prize.weekStart) }}</td>
                <td class="text-right">
                  <div class="d-flex flex-column gap-1">
                    <v-chip
                      :color="prize.isUnlocked ? 'success' : 'grey'"
                      size="small"
                      variant="flat"
                    >
                      {{ prize.isUnlocked ? 'נפתח ✓' : 'נעול 🔒' }}
                    </v-chip>
                    <v-chip
                      v-if="prize.availableToUnlock && !prize.isUnlocked"
                      color="info"
                      size="x-small"
                      variant="flat"
                    >
                      זמין למשתמש 🎁
                    </v-chip>
                  </div>
                </td>
                <td class="text-right" style="max-width: 400px;">
                  <div class="text-truncate">{{ prize.prizeText || 'לא הוגדר' }}</div>
                </td>
                <td class="text-right">
                  <v-btn
                    icon="mdi-pencil"
                    size="x-small"
                    variant="text"
                    color="primary"
                    @click="openPrizeDialog(prize)"
                    title="עריכה"
                  />
                  <v-btn
                    v-if="!prize.isUnlocked && !prize.availableToUnlock"
                    icon="mdi-gift"
                    size="x-small"
                    variant="text"
                    color="success"
                    @click="makeAvailable(prize)"
                    title="שחרר למשתמש (יוכל לפתוח)"
                  />
                  <v-btn
                    v-if="!prize.isUnlocked && prize.availableToUnlock"
                    icon="mdi-gift-off"
                    size="x-small"
                    variant="text"
                    color="grey"
                    @click="makeUnavailable(prize)"
                    title="הסר מזמינים"
                  />
                  <v-btn
                    v-if="prize.isUnlocked"
                    icon="mdi-lock"
                    size="x-small"
                    variant="text"
                    color="warning"
                    @click="lockPrize(prize)"
                    title="נעל מחדש (יחזיר למצב לא פתוח)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="deletePrize(prize)"
                    title="מחק"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-alert v-if="weeklyPrizes.length === 0" type="info" variant="tonal" class="mt-4">
            אין עדיין פרסים שבועיים. לחץ על "הוסף פרס לשבוע" להוספה.
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- Prize Ideas -->
      <v-card rounded="xl" elevation="2">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-lightbulb-outline" size="24" style="opacity: 0.8;" />
          <span class="text-h6">רעיונות למתנות</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col
              v-for="(idea, idx) in prizeIdeas"
              :key="idx"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card
                rounded="lg"
                variant="tonal"
                :color="idea.color"
                class="prize-idea-card"
                @click="useIdea(idea)"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-2">
                    <v-icon :icon="idea.icon" size="32" :color="idea.color" class="ml-2" />
                    <div class="text-h6 font-weight-bold">{{ idea.category }}</div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">{{ idea.text }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Prize Dialog -->
    <v-dialog v-model="showPrizeDialog" max-width="600" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right">
          {{ editingPrize ? 'עריכת פרס' : 'פרס חדש' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="prizeForm.weekStart"
            label="תאריך תחילת השבוע *"
            prepend-inner-icon="mdi-calendar"
            variant="outlined"
            rounded="lg"
            type="date"
            class="mb-4"
            hint="בחר את תאריך יום ראשון"
            persistent-hint
          />

          <v-textarea
            v-model="prizeForm.prizeText"
            label="תיאור המתנה *"
            prepend-inner-icon="mdi-gift"
            variant="outlined"
            rounded="lg"
            rows="4"
            class="mb-4"
            placeholder="לדוגמה: בוקר חופשי! יציאה מתי שרוצה, בלי לארגן ילדים ולהכין אוכל 🌅"
          />

          <v-checkbox
            v-model="prizeForm.isUnlocked"
            label="פתוח מיד (ללא תנאים)"
            hide-details
            class="mb-4"
          />

          <v-alert type="info" variant="tonal" rounded="lg">
            💡 אם לא תסמן "פתוח מיד", המתנה תיפתח רק כשהוא יעמוד ביעד השבועי
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="primary"
            rounded="xl"
            size="large"
            variant="elevated"
            @click="savePrize"
            :loading="saving"
            class="flex-grow-1"
          >
            <v-icon icon="mdi-check" start />
            שמור
          </v-btn>
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closePrizeDialog"
            :disabled="saving"
          >
            ביטול
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, Timestamp, orderBy } from 'firebase/firestore'
import { db, auth } from '@/firebase'

interface WeeklyPrize {
  id: string
  weekStart: Date
  prizeText: string
  weeklyTarget: number
  weeklyActual: number
  isUnlocked: boolean
  unlockedAt?: Date
}

interface PrizeIdea {
  category: string
  text: string
  icon: string
  color: string
}

// State
const weeklyPrizes = ref<WeeklyPrize[]>([])
const showPrizeDialog = ref(false)
const saving = ref(false)
const cleaning = ref(false)
const editingPrize = ref<WeeklyPrize | null>(null)

const prizeForm = ref({
  weekStart: '',
  prizeText: '',
  isUnlocked: false
})

// Check if current user is gift account
const isGiftAccount = computed(() => {
  return auth.currentUser?.email === 'gift@gift.co.il'
})

// Check for duplicate weeks (by week number, not just date)
const duplicateWeeks = computed(() => {
  const weekCounts: Record<string, { count: number; dates: Date[] }> = {}

  weeklyPrizes.value.forEach(prize => {
    const weekNum = formatWeekNumber(prize.weekStart)
    if (!weekCounts[weekNum]) {
      weekCounts[weekNum] = { count: 0, dates: [] }
    }
    weekCounts[weekNum].count++
    weekCounts[weekNum].dates.push(prize.weekStart)
  })

  return Object.entries(weekCounts)
    .filter(([_, data]) => data.count > 1)
    .map(([weekNum, data]) => `שבוע ${weekNum} (${data.count} פרסים)`)
})

const getDuplicateCount = (weekDisplay: string): number => {
  const weekNum = weekDisplay.match(/שבוע (\d+)/)?.[1]
  if (!weekNum) return 0

  return weeklyPrizes.value.filter(prize =>
    formatWeekNumber(prize.weekStart) === weekNum
  ).length
}

// Prize ideas
const prizeIdeas: PrizeIdea[] = [
  { category: 'בוקר חופשי', text: 'יציאה מתי שרוצה, בלי לארגן ילדים ולהכין אוכל 🌅', icon: 'mdi-weather-sunset-up', color: 'orange' },
  { category: 'ערב חופשי', text: 'אני מסדרת הכל, תצא לאן שתרצה 🌙', icon: 'mdi-weather-night', color: 'indigo' },
  { category: 'קופסת אוכל', text: 'קינואה + ירקות טריים לעבודה 🥗', icon: 'mdi-food', color: 'green' },
  { category: 'עוגה מיוחדת', text: 'עוגה אישית מהקונדיטוריה האהובה 🍰', icon: 'mdi-cake', color: 'pink' },
  { category: 'ארוחת בוקר', text: 'ביצים בנדיקט, שקשוקה וקפה מיוחד ☕', icon: 'mdi-coffee', color: 'brown' },
  { category: 'שעה אישית', text: 'שעה שלמה רק לך - לקרוא, לשחק, לנוח 📚', icon: 'mdi-book-open', color: 'teal' },
  { category: 'יום ללא עבודות', text: 'יום שלם ללא עבודות בית - אני עושה הכל 🧹', icon: 'mdi-home-heart', color: 'red' },
  { category: 'עיסוי', text: 'עיסוי מפנק 30 דקות 💆‍♂️', icon: 'mdi-spa', color: 'purple' },
  { category: 'ארוחת צהריים', text: 'סושי / פיצה / המבורגר איכותי 🍕', icon: 'mdi-food-variant', color: 'deep-orange' },
  { category: 'בחירה חופשית', text: 'תבחר במה תרצה עזרה היום 🎯', icon: 'mdi-hand-pointing-right', color: 'blue' },
  { category: 'ספר חדש', text: 'ספר בנושא שאתה אוהב 📖', icon: 'mdi-book', color: 'cyan' },
  { category: 'סלט פירות', text: 'סלט פירות טרי + עוגיות ביתיות 🍓', icon: 'mdi-fruit-watermelon', color: 'lime' }
]

// Load prizes
const loadPrizes = async () => {
  if (!isGiftAccount.value) return

  try {
    const q = query(collection(db, 'weekly_prizes'), orderBy('weekStart', 'desc'))
    const snapshot = await getDocs(q)
    weeklyPrizes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      weekStart: doc.data().weekStart?.toDate() || new Date(),
      unlockedAt: doc.data().unlockedAt?.toDate()
    })) as WeeklyPrize[]
  } catch (error) {
    console.error('Error loading prizes:', error)
    alert('שגיאה בטעינת הפרסים')
  }
}

// Open prize dialog
const openPrizeDialog = (prize?: WeeklyPrize) => {
  if (prize) {
    editingPrize.value = prize
    prizeForm.value = {
      weekStart: prize.weekStart.toISOString().split('T')[0],
      prizeText: prize.prizeText,
      isUnlocked: prize.isUnlocked
    }
  } else {
    editingPrize.value = null
    // Default to next Sunday
    const nextSunday = getNextSunday()
    prizeForm.value = {
      weekStart: nextSunday.toISOString().split('T')[0],
      prizeText: '',
      isUnlocked: false
    }
  }
  showPrizeDialog.value = true
}

// Save prize
const savePrize = async () => {
  if (!prizeForm.value.prizeText || !prizeForm.value.weekStart) {
    alert('אנא מלא את כל השדות')
    return
  }

  saving.value = true
  try {
    const prizeData = {
      weekStart: Timestamp.fromDate(new Date(prizeForm.value.weekStart)),
      prizeText: prizeForm.value.prizeText,
      weeklyTarget: 7200, // Default target
      weeklyActual: 0,
      isUnlocked: prizeForm.value.isUnlocked,
      unlockedAt: prizeForm.value.isUnlocked ? Timestamp.fromDate(new Date()) : null
    }

    if (editingPrize.value) {
      await updateDoc(doc(db, 'weekly_prizes', editingPrize.value.id), prizeData)
    } else {
      await addDoc(collection(db, 'weekly_prizes'), prizeData)
    }

    closePrizeDialog()
    await loadPrizes()
    alert('✅ הפרס נשמר בהצלחה!')
  } catch (error) {
    console.error('Error saving prize:', error)
    alert('שגיאה בשמירת הפרס')
  } finally {
    saving.value = false
  }
}

// Unlock prize manually
// Lock prize - reset to initial state
const lockPrize = async (prize: WeeklyPrize) => {
  if (!confirm(`🔒 לנעול מחדש את הפרס?\n\nהפרס יחזור למצב התחלתי (לא פתוח, לא זמין למשתמש).\n\nשבוע: ${formatWeekNumber(prize.weekStart)}`)) return

  try {
    await updateDoc(doc(db, 'weekly_prizes', prize.id), {
      isUnlocked: false,
      unlockedAt: null,
      availableToUnlock: false
    })
    await loadPrizes()
    alert('✅ הפרס ננעל והוסר מהרשימה הזמינה')
  } catch (error) {
    console.error('Error locking prize:', error)
    alert('שגיאה בנעילת הפרס')
  }
}

// Make prize available for user to unlock
const makeAvailable = async (prize: WeeklyPrize) => {
  if (!confirm(`🎁 לשחרר את הפרס למשתמש?\n\nהמשתמש יראה את הפרס הזה ברשימת "פרסים זמינים לפתיחה" ויוכל לפתוח אותו.\n\nשבוע: ${formatWeekNumber(prize.weekStart)}\n\nשים לב: המשתמש לא יראה את תוכן הפרס עד שהוא יפתח אותו בעצמו!`)) return

  try {
    await updateDoc(doc(db, 'weekly_prizes', prize.id), {
      availableToUnlock: true
    })
    await loadPrizes()
    alert('✅ הפרס שוחרר למשתמש!\n\nהמשתמש יכול כעת לפתוח את הפרס בעמוד "פרס שבועי".')
  } catch (error) {
    console.error('Error making prize available:', error)
    alert('שגיאה')
  }
}

// Remove prize from available list
const makeUnavailable = async (prize: WeeklyPrize) => {
  if (!confirm(`להסיר את הפרס מרשימת הזמינים?`)) return

  try {
    await updateDoc(doc(db, 'weekly_prizes', prize.id), {
      availableToUnlock: false
    })
    await loadPrizes()
    alert('✅ הפרס הוסר מרשימת הזמינים')
  } catch (error) {
    console.error('Error making prize unavailable:', error)
    alert('שגיאה')
  }
}

// Delete prize
const deletePrize = async (prize: WeeklyPrize) => {
  if (!confirm(`❌ האם למחוק את הפרס?\n\n${prize.prizeText}\n\nפעולה זו לא ניתנת לביטול!`)) return

  try {
    await deleteDoc(doc(db, 'weekly_prizes', prize.id))
    await loadPrizes()
    alert('✅ הפרס נמחק')
  } catch (error) {
    console.error('Error deleting prize:', error)
    alert('שגיאה במחיקת הפרס')
  }
}

// Clean duplicates - keep only the first prize for each week number
const cleanDuplicates = async () => {
  // Group by week number
  const weekMap = new Map<string, WeeklyPrize[]>()

  weeklyPrizes.value.forEach(prize => {
    const weekNum = formatWeekNumber(prize.weekStart)
    if (!weekMap.has(weekNum)) {
      weekMap.set(weekNum, [])
    }
    weekMap.get(weekNum)!.push(prize)
  })

  const totalDuplicates = weeklyPrizes.value.length - weekMap.size

  if (totalDuplicates === 0) {
    alert('✅ אין כפילויות למחוק!')
    return
  }

  if (!confirm(`🧹 ניקוי כפילויות\n\nימחק ${totalDuplicates} פרסים כפולים.\nישאר רק פרס אחד לכל שבוע.\n\nהאם להמשיך?`)) {
    return
  }

  cleaning.value = true
  try {
    let deletedCount = 0

    // For each week, keep the first and delete the rest
    for (const [weekNum, prizes] of weekMap.entries()) {
      if (prizes.length > 1) {
        console.log(`🧹 שבוע ${weekNum}: מוחק ${prizes.length - 1} כפילויות`)
        // Keep the first, delete the rest
        for (let i = 1; i < prizes.length; i++) {
          await deleteDoc(doc(db, 'weekly_prizes', prizes[i].id))
          deletedCount++
        }
      }
    }

    await loadPrizes()
    alert(`✅ נוקה בהצלחה!\n\nנמחקו ${deletedCount} פרסים כפולים.`)
  } catch (error) {
    console.error('Error cleaning duplicates:', error)
    alert('שגיאה בניקוי כפילויות')
  } finally {
    cleaning.value = false
  }
}

// Use idea
const useIdea = (idea: PrizeIdea) => {
  prizeForm.value.prizeText = idea.text
  if (!showPrizeDialog.value) {
    openPrizeDialog()
  }
}

const closePrizeDialog = () => {
  showPrizeDialog.value = false
  editingPrize.value = null
}

const getNextSunday = (): Date => {
  const today = new Date()
  const day = today.getDay()
  const daysUntilSunday = day === 0 ? 7 : 7 - day
  const nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + daysUntilSunday)
  return nextSunday
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const formatWeekNumber = (date: Date): string => {
  if (weeklyPrizes.value.length === 0) return '1'

  // Get unique weeks only (ignore duplicates)
  const uniqueWeeks = Array.from(
    new Set(
      weeklyPrizes.value.map(p => p.weekStart.toISOString().split('T')[0])
    )
  )
    .map(dateStr => new Date(dateStr).getTime())
    .sort((a, b) => a - b)

  const firstWeek = uniqueWeeks[0]
  const currentWeek = date.getTime()

  // Calculate weeks difference from first week
  const weeksDiff = Math.floor((currentWeek - firstWeek) / (1000 * 60 * 60 * 24 * 7))

  return (weeksDiff + 1).toString()
}

// Lifecycle
onMounted(() => {
  loadPrizes()
})
</script>

<style scoped>
.prize-manager-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header-clean {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.prize-idea-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.prize-idea-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>

