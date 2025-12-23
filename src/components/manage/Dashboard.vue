<template>
  <v-container class="dashboard-container">
    <!-- Header -->
    <v-row class="mb-8">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div class="text-right">
          <h2 class="text-h4 font-weight-bold mb-2">
            <v-icon icon="mdi-view-dashboard" size="32" color="primary" />
            דשבורד
          </h2>
          <p class="text-subtitle-1 text-medium-emphasis">
            {{ formatDate(new Date()) }}
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card-modern" rounded="xl" elevation="0" hover>
          <div class="stat-gradient primary-gradient"></div>
          <v-card-text class="pa-5 position-relative">
            <div class="d-flex justify-space-between align-center">
              <div class="text-right">
                <div class="text-h3 font-weight-bold primary--text mb-1">{{ stats.todayAppointments }}</div>
                <div class="text-body-2 text-medium-emphasis">פגישות היום</div>
              </div>
              <v-avatar size="56" color="primary" variant="tonal">
                <v-icon icon="mdi-calendar-today" size="28" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card-modern" rounded="xl" elevation="0" hover>
          <div class="stat-gradient success-gradient"></div>
          <v-card-text class="pa-5 position-relative">
            <div class="d-flex justify-space-between align-center">
              <div class="text-right">
                <div class="text-h3 font-weight-bold success--text mb-1">{{ stats.weekAppointments }}</div>
                <div class="text-body-2 text-medium-emphasis">פגישות השבוע</div>
              </div>
              <v-avatar size="56" color="success" variant="tonal">
                <v-icon icon="mdi-calendar-week" size="28" />
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card-modern stat-card-fixed-height" rounded="xl" elevation="0" hover>
          <div class="stat-gradient info-gradient"></div>
          <v-card-text class="pa-5 position-relative">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-right flex-grow-1">
                <div class="text-h5 font-weight-bold" style="color: #0288D1;">
                  ₪{{ stats.weekActual.toLocaleString() }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  מתוך ₪{{ stats.weekExpected.toLocaleString() }}
                </div>
                <div class="text-caption text-success font-weight-medium mt-1">
                  שולם: ₪{{ stats.weekPaid.toLocaleString() }}
                </div>
              </div>
              <v-avatar size="56" color="info" variant="tonal">
                <v-icon icon="mdi-calendar-week" size="28" />
              </v-avatar>
            </div>
            <div class="text-caption font-weight-bold mb-1" style="color: #546e7a;">השבוע</div>
            <v-progress-linear
              :model-value="stats.weekPercentage"
              :color="stats.weekPercentage >= 80 ? 'success' : stats.weekPercentage >= 50 ? 'warning' : 'error'"
              height="6"
              rounded
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card-modern stat-card-fixed-height" rounded="xl" elevation="0" hover>
          <div class="stat-gradient purple-gradient"></div>
          <v-card-text class="pa-5 position-relative">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-right flex-grow-1">
                <div class="text-h5 font-weight-bold" style="color: #512DA8;">
                  ₪{{ stats.monthActual.toLocaleString() }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  מתוך ₪{{ stats.monthExpected.toLocaleString() }}
                </div>
                <div class="text-caption text-success font-weight-medium mt-1">
                  שולם: ₪{{ stats.monthPaid.toLocaleString() }}
                </div>
              </div>
              <v-avatar size="56" color="deep-purple" variant="tonal">
                <v-icon icon="mdi-calendar-month" size="28" />
              </v-avatar>
            </div>
            <div class="text-caption font-weight-bold mb-1" style="color: #546e7a;">החודש</div>
            <v-progress-linear
              :model-value="stats.monthPercentage"
              :color="stats.monthPercentage >= 80 ? 'success' : stats.monthPercentage >= 50 ? 'warning' : 'error'"
              height="6"
              rounded
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Today's Appointments -->
    <v-row class="mb-6">
      <v-col cols="12" lg="7">
        <v-card rounded="xl" elevation="2" class="section-card-clean">
          <v-card-title class="pa-5 text-right section-header-clean">
            <v-icon icon="mdi-calendar-today" size="24" style="opacity: 0.8;" />
            <span class="text-h6">פגישות היום</span>
          </v-card-title>

          <v-card-text class="pa-0">
            <v-list v-if="todayAppointments.length > 0">
              <v-list-item
                v-for="appointment in todayAppointments"
                :key="appointment.id"
                class="appointment-item"
              >
                <template #prepend>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    @click="editAppointment(appointment)"
                  />
                </template>

                <v-list-item-title class="text-h6 text-right">
                  {{ appointment.clientName }} - {{ appointment.time }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-right">
                  <v-chip v-if="appointment.attended" size="small" color="primary">
                    הגיע
                  </v-chip>
                  <v-chip v-if="appointment.paid" size="small" color="success">
                    שולם
                  </v-chip>
                  ₪{{ appointment.price }}
                </v-list-item-subtitle>

                <template #append>
                  <v-avatar :color="appointment.attended ? 'success' : 'grey-lighten-2'">
                    <v-icon
                      :icon="appointment.attended ? 'mdi-check' : 'mdi-clock-outline'"
                      color="white"
                    />
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>

            <div v-else class="pa-8 text-center">
              <v-icon icon="mdi-calendar-blank" size="64" color="grey-lighten-2" class="mb-4" />
              <p class="text-h6 text-medium-emphasis">אין פגישות מתוכננות להיום</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Debts Summary -->
      <v-col cols="12" lg="5">
        <v-card rounded="xl" elevation="2" class="section-card-clean">
          <v-card-title class="pa-5 text-right section-header-clean">
            <v-icon icon="mdi-alert-circle-outline" size="24" style="opacity: 0.8;" />
            <span class="text-h6">חובות ללקוחות</span>
          </v-card-title>

          <v-card-text class="pa-0">
            <v-list v-if="clientsWithDebts.length > 0">
              <v-list-item
                v-for="client in clientsWithDebts"
                :key="client.id"
                class="px-4 py-2 clickable-debt-item"
                @click="showBalanceDetails(client)"
              >
                <v-list-item-title class="text-right font-weight-medium mb-2">
                  {{ client.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  <v-chip size="default" color="error" variant="flat" class="font-weight-bold">
                    חוב: ₪{{ Math.abs(client.balance) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <div v-else class="pa-6 text-center">
              <v-icon icon="mdi-check-circle" size="48" color="success" class="mb-2" />
              <p class="text-body-1 text-success">אין חובות!</p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Quick Actions -->
        <v-card rounded="xl" elevation="2" class="mt-4 section-card-clean">
          <v-card-title class="pa-5 text-right section-header-clean">
            <v-icon icon="mdi-lightning-bolt-outline" size="24" style="opacity: 0.8;" />
            <span class="text-h6">פעולות מהירות</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-btn
              color="primary"
              block
              rounded="lg"
              size="default"
              class="mb-2"
              @click="navigateTo('clients')"
            >
              <v-icon icon="mdi-account-plus" class="me-2" />
              הוסף לקוח חדש
            </v-btn>

            <v-btn
              color="info"
              block
              rounded="lg"
              size="default"
              class="mb-2"
              @click="navigateTo('schedule')"
            >
              <v-icon icon="mdi-calendar-plus" class="me-2" />
              הוסף פגישה
            </v-btn>

            <v-btn
              color="success"
              block
              rounded="lg"
              size="default"
              @click="navigateTo('prize')"
            >
              <v-icon icon="mdi-gift" class="me-2" />
              צפה בפרס השבועי
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Monthly Overview -->
    <v-row>
      <v-col cols="12">
        <v-card rounded="xl" elevation="2" class="section-card-clean">
          <v-card-title class="pa-5 text-right section-header-clean">
            <v-icon icon="mdi-chart-line" size="24" style="opacity: 0.8;" />
            <span class="text-h6">סיכום חודשי</span>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="4">
                <div class="stat-box-modern">
                  <v-icon icon="mdi-calendar-check" size="40" color="primary" class="mb-3" />
                  <div class="stat-label-modern">פגישות החודש</div>
                  <div class="stat-value-modern">{{ stats.monthAppointments }}</div>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="stat-box-modern">
                  <v-icon icon="mdi-cash-check" size="40" color="success" class="mb-3" />
                  <div class="stat-label-modern">הכנסות החודש</div>
                  <div class="stat-value-modern" style="color: #4CAF50;">₪{{ stats.monthActual.toLocaleString() }}</div>
                  <div class="stat-sublabel-modern">מתוך ₪{{ stats.monthExpected.toLocaleString() }} צפוי</div>
                  <div class="stat-sublabel-modern" style="color: #2E7D32; font-weight: 600; margin-top: 4px;">
                    שולם בפועל: ₪{{ stats.monthPaid.toLocaleString() }}
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="stat-box-modern">
                  <v-icon icon="mdi-account-check" size="40" color="info" class="mb-3" />
                  <div class="stat-label-modern">אחוז נוכחות</div>
                  <div class="stat-value-modern" style="color: #0288D1;">{{ stats.attendanceRate }}%</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Balance Details Dialog -->
    <v-dialog v-model="showBalanceDialog" max-width="700" @click:outside="closeBalanceDialog">
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-receipt-text-outline" size="24" style="opacity: 0.8;" />
          <span class="text-h6">פירוט חוב - {{ selectedClientForBalance?.name }}</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-alert
            v-if="loadingBalanceDetails"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            טוען נתונים...
          </v-alert>

          <div v-else>
            <!-- Summary -->
            <v-card class="mb-4" rounded="lg" color="blue-grey-lighten-5" elevation="0">
              <v-card-text class="pa-4">
                <v-row align="center">
                  <v-col cols="4" class="text-center">
                    <div class="text-caption text-medium-emphasis">סה"כ לתשלום</div>
                    <div class="text-h6 font-weight-bold text-error">
                      ₪{{ balanceDetails.totalOwed.toLocaleString() }}
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="text-caption text-medium-emphasis">סה"כ שולם</div>
                    <div class="text-h6 font-weight-bold text-success">
                      ₪{{ balanceDetails.totalPaid.toLocaleString() }}
                    </div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="text-caption text-medium-emphasis">יתרה</div>
                    <div class="text-h6 font-weight-bold" :class="balanceDetails.balance < 0 ? 'text-error' : 'text-success'">
                      {{ balanceDetails.balance < 0 ? 'חוב' : 'זכות' }}: ₪{{ Math.abs(balanceDetails.balance).toLocaleString() }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Appointments List -->
            <div v-if="balanceDetails.appointments.length > 0">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">היסטוריית פגישות</h4>
              <v-list density="compact" class="appointments-list">
                <v-list-item
                  v-for="(apt, idx) in balanceDetails.appointments"
                  :key="idx"
                  class="appointment-item rounded-lg mb-2"
                  :class="{ 'attended': apt.attended }"
                >
                  <template #prepend>
                    <v-icon
                      :icon="apt.attended ? 'mdi-check-circle' : 'mdi-circle-outline'"
                      :color="apt.attended ? 'success' : 'grey'"
                    />
                  </template>

                  <v-list-item-title>
                    <div class="d-flex align-center gap-2">
                      <span class="font-weight-bold">{{ new Intl.DateTimeFormat('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(apt.date) }}</span>
                      <v-chip size="x-small" color="primary" variant="flat">{{ apt.time }}</v-chip>
                      <v-chip size="x-small" v-if="!apt.attended" color="grey" variant="flat">לא הגיע</v-chip>
                    </div>
                  </v-list-item-title>

                  <v-list-item-subtitle v-if="apt.attended" class="mt-1">
                    <div class="d-flex justify-space-between align-center">
                      <span>מחיר: ₪{{ apt.price }}</span>
                      <span>שולם: ₪{{ apt.paid }}</span>
                      <span :class="apt.balance < 0 ? 'text-error font-weight-bold' : 'text-success'">
                        יתרה: ₪{{ apt.balance }}
                      </span>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>

            <v-alert
              v-else
              type="info"
              variant="tonal"
              class="mt-4"
            >
              אין עדיין פגישות עבור לקוח זה
            </v-alert>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeBalanceDialog"
            class="px-6"
          >
            סגור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Client, Appointment, PaymentRecord } from '@/types/manage'

// Emit
const emit = defineEmits(['navigate'])

// State
const clients = ref<Client[]>([])
const appointments = ref<Appointment[]>([])
const loading = ref(true)
const showBalanceDialog = ref(false)
const loadingBalanceDetails = ref(false)
const selectedClientForBalance = ref<Client | null>(null)

const balanceDetails = ref({
  totalOwed: 0,
  totalPaid: 0,
  balance: 0,
  appointments: [] as Array<{
    date: Date
    time: string
    price: number
    paid: number
    balance: number
    attended: boolean
  }>
})

// Computed
const stats = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = getWeekStart(now)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const todayAppts = appointments.value.filter(a => isSameDay(a.date, today))
  const weekAppts = appointments.value.filter(a => a.date >= weekStart)
  const monthAppts = appointments.value.filter(a => a.date >= monthStart)

  // פונקציה לחישוב תשלומים בפועל
  const calculateActualPayments = (appts: Appointment[]) => {
    return appts.reduce((sum, a) => {
      if (a.payments && Array.isArray(a.payments)) {
        return sum + a.payments.reduce((pSum, p) => pSum + p.amount, 0)
      } else if (a.paymentAmount) {
        return sum + a.paymentAmount
      }
      return sum
    }, 0)
  }

  // חישובים שבועיים
  // סכום מצופה = כל הפגישות המתוכננות
  // הכנסה בפועל = פגישות שהלקוח הגיע אליהן (לפי מחיר הפגישה)
  // שולם בפועל = תשלומים שהתקבלו בפועל
  const weekExpected = weekAppts.reduce((sum, a) => sum + a.price, 0)
  const weekActual = weekAppts.filter(a => a.attended).reduce((sum, a) => sum + a.price, 0)
  const weekPaid = calculateActualPayments(weekAppts)
  const weekPercentage = weekExpected > 0 ? Math.round((weekActual / weekExpected) * 100) : 0

  console.log('📊 Dashboard Weekly Stats:', {
    weekAppts: weekAppts.length,
    weekExpected,
    weekActual,
    weekPaid,
    weekPercentage
  })

  // חישובים חודשיים
  // סכום מצופה = כל הפגישות המתוכננות
  // הכנסה בפועל = פגישות שהלקוח הגיע אליהן (לפי מחיר הפגישה)
  // שולם בפועל = תשלומים שהתקבלו בפועל
  const monthExpected = monthAppts.reduce((sum, a) => sum + a.price, 0)
  const monthActual = monthAppts.filter(a => a.attended).reduce((sum, a) => sum + a.price, 0)
  const monthPaid = calculateActualPayments(monthAppts)
  const monthPercentage = monthExpected > 0 ? Math.round((monthActual / monthExpected) * 100) : 0

  console.log('📊 Dashboard Monthly Stats:', {
    monthAppts: monthAppts.length,
    monthExpected,
    monthActual,
    monthPaid,
    monthPercentage
  })

  const attendedCount = monthAppts.filter(a => a.attended).length
  const attendanceRate = monthAppts.length > 0
    ? Math.round((attendedCount / monthAppts.length) * 100)
    : 0

    return {
    todayAppointments: todayAppts.length,
    weekAppointments: weekAppts.length,
    monthAppointments: monthAppts.length,
    weekExpected,
    weekActual,
    weekPaid,
    weekPercentage,
    monthExpected,
    monthActual,
    monthPaid,
    monthPercentage,
    totalClients: clients.value.length,
    attendanceRate
  }
})

const todayAppointments = computed(() => {
  const today = new Date()
  return appointments.value
    .filter(a => isSameDay(a.date, today))
    .sort((a, b) => a.time.localeCompare(b.time))
})

const clientsWithDebts = computed(() => {
  return clients.value
    .filter(c => c.balance < 0)
    .sort((a, b) => a.balance - b.balance)
    .slice(0, 5)
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

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Methods
const loadData = async () => {
  loading.value = true
  try {
    // Load clients
    const clientsSnapshot = await getDocs(collection(db, 'clients'))
    clients.value = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Client[]

    // Load appointments from week start (to include all current week appointments)
    const now = new Date()
    const weekStart = getWeekStart(now)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Use the earlier date (either week start or month start)
    const loadFrom = weekStart < monthStart ? weekStart : monthStart

    console.log('📅 Dashboard loading appointments from:', loadFrom, {
      weekStart,
      monthStart,
      loadFrom
    })

    const q = query(
      collection(db, 'appointments'),
      where('date', '>=', loadFrom),
      orderBy('date', 'desc')
    )

    const appointmentsSnapshot = await getDocs(q)
    appointments.value = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data()

      // Support both old and new payment format
      let paymentsArray: PaymentRecord[] = []
      if (data.payments && Array.isArray(data.payments)) {
        paymentsArray = data.payments.map((p: any) => ({
          id: p.id,
          amount: p.amount,
          method: p.method,
          date: p.date?.toDate ? p.date.toDate() : new Date(p.date),
          notes: p.notes || ''
        }))
      } else if (data.paymentAmount && data.paymentAmount > 0) {
        // Old format - create single payment
        paymentsArray = [{
          id: `payment_${Date.now()}`,
          amount: data.paymentAmount,
          method: data.paymentMethod || 'cash',
          date: data.date?.toDate() || new Date(),
          notes: ''
        }]
      }

      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        payments: paymentsArray,
        // Keep old fields for backward compatibility
        paymentAmount: data.paymentAmount,
        paymentMethod: data.paymentMethod
      } as Appointment
    })
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const editAppointment = (appointment: Appointment) => {
  emit('navigate', 'schedule')
}

const navigateTo = (tab: string) => {
  emit('navigate', tab)
}

const showBalanceDetails = async (client: Client) => {
  selectedClientForBalance.value = client
  showBalanceDialog.value = true
  loadingBalanceDetails.value = true

  try {
    // Get all appointments for this client
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('clientId', '==', client.id)
    )
    const appointmentsSnapshot = await getDocs(appointmentsQuery)

    let totalOwed = 0
    let totalPaid = 0
    const appointmentsList: any[] = []

    appointmentsSnapshot.forEach(docSnap => {
      const apt = docSnap.data()
      const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)

      if (apt.attended) {
        const paidForApt = apt.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
        totalOwed += apt.price || 0
        totalPaid += paidForApt

        appointmentsList.push({
          date: aptDate,
          time: apt.time,
          price: apt.price || 0,
          paid: paidForApt,
          balance: paidForApt - apt.price,
          attended: true
        })
      } else {
        // Show non-attended appointments too
        appointmentsList.push({
          date: aptDate,
          time: apt.time,
          price: apt.price || 0,
          paid: 0,
          balance: 0,
          attended: false
        })
      }
    })

    // Sort by date descending
    appointmentsList.sort((a, b) => b.date.getTime() - a.date.getTime())

    balanceDetails.value = {
      totalOwed,
      totalPaid,
      balance: totalPaid - totalOwed,
      appointments: appointmentsList
    }
  } catch (error) {
    console.error('Error loading balance details:', error)
    alert('שגיאה בטעינת פירוט החוב')
  } finally {
    loadingBalanceDetails.value = false
  }
}

const closeBalanceDialog = () => {
  showBalanceDialog.value = false
  selectedClientForBalance.value = null
  balanceDetails.value = {
    totalOwed: 0,
    totalPaid: 0,
    balance: 0,
    appointments: []
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  color: #1e3a5f;
  font-family: 'Open Sans', 'Heebo', sans-serif;
}

.dashboard-container h2,
.dashboard-container h3,
.dashboard-container h4,
.dashboard-container h5,
.dashboard-container h6 {
  color: #1e3a5f;
  font-family: 'Open Sans', 'Heebo', sans-serif;
}

.dashboard-container .text-h3,
.dashboard-container .text-h4,
.dashboard-container .text-h5,
.dashboard-container .text-h6 {
  color: #1976D2 !important;
}

.stat-card-modern {
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid rgba(25, 118, 210, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.stat-card-fixed-height {
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.stat-card-fixed-height .v-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card-modern:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 32px rgba(25, 118, 210, 0.2) !important;
  border-color: rgba(25, 118, 210, 0.3);
}

.stat-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.primary-gradient {
  background: #B0BEC5;
}

.success-gradient {
  background: #B0BEC5;
}

.info-gradient {
  background: #B0BEC5;
}

.purple-gradient {
  background: #B0BEC5;
}

.appointment-item {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.appointment-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.appointment-item:last-child {
  border-bottom: none;
}

.stat-box {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
}

/* Monthly Summary Modern */
.monthly-summary-card {
  border: 2px solid rgba(25, 118, 210, 0.2);
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.12) !important;
}

.stat-box-modern {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 16px;
  border: 1px solid rgba(25, 118, 210, 0.15);
  transition: all 0.3s ease;
}

.stat-box-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(25, 118, 210, 0.15);
  border-color: rgba(25, 118, 210, 0.3);
}

.stat-label-modern {
  font-size: 0.875rem;
  color: #546e7a;
  margin-bottom: 8px;
  font-weight: 600;
  font-family: 'Open Sans', 'Heebo', sans-serif;
}

.stat-value-modern {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e3a5f;
  font-family: 'Open Sans', 'Heebo', sans-serif;
}

.stat-sublabel-modern {
  font-size: 0.75rem;
  color: #78909c;
  margin-top: 4px;
  font-weight: 500;
}

/* Clean Section Headers */
.section-card-clean {
  background: #ffffff;
  border: 1px solid #E0E0E0;
}

.section-header-clean {
  color: #455A64;
  background: linear-gradient(to bottom, #F5F7FA 0%, #FFFFFF 100%);
  border-bottom: 1px solid #E0E0E0;
  font-weight: 600;
}

.clickable-debt-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-debt-item:hover {
  background: rgba(25, 118, 210, 0.08);
  box-shadow: inset 3px 0 0 0 rgba(25, 118, 210, 0.5);
}

.appointments-list .appointment-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 8px;
  background: #fafafa;
}

.appointments-list .appointment-item.attended {
  background: rgba(76, 175, 80, 0.03);
  border-color: rgba(76, 175, 80, 0.2);
}

.gap-2 {
  gap: 8px;
}
</style>

