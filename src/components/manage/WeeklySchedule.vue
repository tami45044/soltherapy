<template>
  <v-container fluid dir="rtl" class="schedule-container">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12" md="8" class="text-right">
        <h2 class="text-h4 mb-2">יומן שבועי</h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          שבוע {{ currentWeekDisplay }}
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-right">
        <v-btn-group rounded="xl" elevation="2">
          <v-btn @click="previousWeek" icon="mdi-chevron-left" />
          <v-btn @click="currentWeek" min-width="100">היום</v-btn>
          <v-btn @click="nextWeek" icon="mdi-chevron-right" />
        </v-btn-group>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-btn
          color="primary"
          block
          size="large"
          rounded="xl"
          @click="showTemplateDialog = true"
        >
          <v-icon icon="mdi-calendar-clock" class="ms-2" />
          הגדר תבנית שבועית
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          color="success"
          block
          size="large"
          rounded="xl"
          variant="flat"
          :disabled="!canFillWeek"
          @click="fillWeekFromTemplate"
        >
          <v-icon icon="mdi-auto-fix" size="20" class="ms-2" />
          מלא שבוע מתבנית
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          color="info"
          block
          size="large"
          rounded="xl"
          @click="openAppointmentDialog(new Date(), '09:00')"
        >
          <v-icon icon="mdi-calendar-plus" class="ms-2" />
          הוסף פגישה
        </v-btn>
      </v-col>
    </v-row>

    <!-- Weekly Calendar -->
    <v-card rounded="xl" elevation="4">
      <v-card-text class="pa-0">
        <v-table class="weekly-table">
          <thead>
            <tr dir="rtl">
              <th class="text-center time-header">שעה</th>
              <th v-for="day in daysOfWeek" :key="day.index" class="text-center day-column">
                <div class="day-header">
                  <div class="day-name">{{ day.name }}</div>
                  <div class="day-date">{{ formatDate(day.date) }}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="time in timeSlots" :key="time" dir="rtl">
              <td class="time-cell">{{ time }}</td>
              <td
                v-for="day in daysOfWeek"
                :key="`${day.index}-${time}`"
                class="appointment-cell"
                @click="openAppointmentDialog(day.date, time)"
              >
                <div
                  v-if="getAppointment(day.date, time)"
                  class="appointment-card"
                  :class="{
                    'attended': getAppointment(day.date, time)?.attended,
                    'paid': getAppointment(day.date, time)?.paid
                  }"
                >
                  <div class="appointment-name">
                    {{ getAppointment(day.date, time)?.clientName }}
                  </div>
                  <div class="appointment-details">
                    <v-chip
                      v-if="getAppointment(day.date, time)?.attended"
                      size="x-small"
                      color="success"
                      class="ms-1"
                    >
                      הגיע
                    </v-chip>
                    <v-chip
                      v-if="getAppointment(day.date, time)?.paid"
                      size="x-small"
                      color="primary"
                      class="ms-1"
                    >
                      שולם
                    </v-chip>
                  </div>
                </div>
                <div v-else class="empty-slot">
                  <v-icon icon="mdi-plus" size="small" color="grey-lighten-1" />
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Template Settings Dialog -->
    <v-dialog v-model="showTemplateDialog" max-width="900" persistent>
      <v-card rounded="xl" dir="rtl">
        <v-card-title class="pa-6 bg-primary text-white text-right">
          <h3 class="text-h5">
            הגדרת תבנית שבועית
            <v-icon icon="mdi-calendar-clock" class="me-2" />
          </h3>
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-subtitle-1 mb-6">
            הגדר את הפגישות הקבועות שלך לכל יום בשבוע. המערכת תמלא אוטומטית כל שבוע חדש.
          </p>

          <v-expansion-panels>
            <v-expansion-panel v-for="day in hebrewDays" :key="day.index" class="template-panel">
              <v-expansion-panel-title class="day-panel-title">
                <div class="d-flex align-center flex-grow-1">
                  <v-icon :icon="day.icon" class="ms-3" color="primary" />
                  <span class="day-name-template">{{ day.name }}</span>
                </div>
                <v-chip size="small" color="primary" variant="flat">
                  {{ getTemplateSlotsForDay(day.index).length }} פגישות
                </v-chip>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="template-panel-content">
                <v-btn
                  color="primary"
                  size="small"
                  rounded="lg"
                  class="mb-3"
                  variant="flat"
                  @click="addTemplateSlot(day.index)"
                >
                  <v-icon icon="mdi-plus" size="small" class="ms-2" />
                  הוסף שעה
                </v-btn>

                <v-row
                  v-for="(slot, idx) in getTemplateSlotsForDay(day.index)"
                  :key="slot.id"
                  class="mb-2 template-slot-row"
                  align="center"
                >
                  <v-col cols="4">
                    <v-text-field
                      v-model="slot.time"
                      label="שעה"
                      type="time"
                      variant="outlined"
                      density="compact"
                      dir="ltr"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="slot.defaultClientId"
                      label="לקוח קבוע"
                      :items="clientOptions"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      density="compact"
                      dir="rtl"
                      clearable
                      hide-details
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-center">
                    <v-btn
                      icon
                      color="error"
                      size="x-small"
                      variant="text"
                      @click="removeTemplateSlot(day.index, idx)"
                    >
                      <v-icon icon="mdi-delete" size="20" />
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="primary"
            rounded="xl"
            :loading="savingTemplate"
            @click="saveTemplate"
          >
            <v-icon icon="mdi-content-save" class="ms-2" />
            שמור תבנית
          </v-btn>
          <v-btn variant="text" @click="showTemplateDialog = false">סגור</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add/Edit Appointment Dialog -->
    <v-dialog 
      v-model="showAppointmentDetailsDialog" 
      max-width="650" 
      @click:outside="closeAppointmentDialog"
    >
      <v-card rounded="xl" dir="rtl">
        <v-card-title class="pa-6 bg-gradient-primary text-white text-right">
          <h3 class="text-h5 font-weight-bold">
            <v-icon icon="mdi-calendar-edit" size="28" class="ms-2" />
            {{ selectedAppointment ? 'עריכת פגישה' : 'פגישה חדשה' }}
          </h3>
        </v-card-title>

        <v-card-text class="pa-6" dir="rtl">
          <v-form ref="appointmentFormRef">
            <!-- שלב 1: יצירת פגישה -->
            <div class="form-section">
              <h4 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1976D2;">
                <v-icon icon="mdi-information" size="small" class="ms-1" />
                פרטי פגישה
              </h4>

              <v-select
                v-model="appointmentForm.clientId"
                label="בחר לקוח *"
                :items="clientOptions"
                item-title="name"
                item-value="id"
                variant="outlined"
                rounded="lg"
                dir="rtl"
                :rules="[rules.required]"
                class="mb-4"
                @update:model-value="updateClientPrice"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-account" color="primary" />
                </template>
                <template #append-inner>
                  <v-btn
                    icon="mdi-plus-circle"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="showAddClientQuick = true"
                  />
                </template>
              </v-select>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="appointmentForm.date"
                    label="תאריך *"
                    type="date"
                    variant="outlined"
                    rounded="lg"
                    dir="ltr"
                    :rules="[rules.required]"
                    hide-details
                  >
                    <template #prepend-inner>
                      <v-icon icon="mdi-calendar" color="primary" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="appointmentForm.time"
                    label="שעה *"
                    type="time"
                    variant="outlined"
                    rounded="lg"
                    dir="ltr"
                    :rules="[rules.required]"
                    hide-details
                  >
                    <template #prepend-inner>
                      <v-icon icon="mdi-clock" color="primary" />
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model.number="appointmentForm.price"
                label="תעריף"
                type="number"
                variant="outlined"
                rounded="lg"
                dir="rtl"
                prefix="₪"
                class="mb-4 mt-4"
                hide-details
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-cash" color="primary" />
                </template>
              </v-text-field>

              <v-textarea
                v-model="appointmentForm.notes"
                label="הערות"
                variant="outlined"
                rounded="lg"
                dir="rtl"
                rows="2"
                hide-details
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-note-text" color="primary" />
                </template>
              </v-textarea>
            </div>

            <!-- שלב 2: עדכון סטטוס (רק לפגישה קיימת) -->
            <div v-if="selectedAppointment" class="form-section mt-6">
              <v-divider class="mb-4" />

              <h4 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1976D2;">
                <v-icon icon="mdi-clipboard-check" size="small" class="ms-1" />
                סטטוס פגישה
              </h4>

              <v-switch
                v-model="appointmentForm.attended"
                label="הלקוח הגיע"
                color="success"
                hide-details
                class="mb-4"
                dir="rtl"
              >
                <template #prepend>
                  <v-icon icon="mdi-account-check" color="success" class="ms-2" />
                </template>
              </v-switch>

              <v-divider class="my-4" />

              <h4 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1976D2;">
                <v-icon icon="mdi-cash-check" size="small" class="ms-1" />
                פרטי תשלום
              </h4>

              <v-switch
                v-model="appointmentForm.paid"
                label="שולם"
                color="primary"
                hide-details
                class="mb-4"
                dir="rtl"
              >
                <template #prepend>
                  <v-icon icon="mdi-cash-multiple" color="primary" class="ms-2" />
                </template>
              </v-switch>

              <v-row v-if="appointmentForm.paid" class="mt-2">
                <v-col cols="6">
                  <v-select
                    v-model="appointmentForm.paymentMethod"
                    label="אמצעי תשלום *"
                    :items="paymentMethods"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    rounded="lg"
                    dir="rtl"
                    hide-details
                  >
                    <template #prepend-inner>
                      <v-icon icon="mdi-credit-card" color="primary" />
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="appointmentForm.paymentAmount"
                    label="סכום ששולם *"
                    type="number"
                    variant="outlined"
                    rounded="lg"
                    dir="rtl"
                    prefix="₪"
                    :hint="`מחיר מלא: ₪${appointmentForm.price}`"
                    persistent-hint
                  >
                    <template #prepend-inner>
                      <v-icon icon="mdi-currency-ils" color="primary" />
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-alert
                v-if="appointmentForm.paid && appointmentForm.paymentAmount < appointmentForm.price"
                type="warning"
                density="compact"
                class="mt-3"
                dir="rtl"
                variant="tonal"
              >
                <v-icon icon="mdi-alert" class="ms-2" />
                חוב: ₪{{ appointmentForm.price - appointmentForm.paymentAmount }}
              </v-alert>

              <v-alert
                v-if="appointmentForm.paid && appointmentForm.paymentAmount > appointmentForm.price"
                type="success"
                density="compact"
                class="mt-3"
                dir="rtl"
                variant="tonal"
              >
                <v-icon icon="mdi-check-circle" class="ms-2" />
                שילם יותר (זכות): ₪{{ appointmentForm.paymentAmount - appointmentForm.price }}
              </v-alert>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 d-flex justify-start" dir="rtl">
          <v-btn
            color="primary"
            rounded="xl"
            size="large"
            variant="flat"
            :loading="savingAppointment"
            @click="saveAppointment"
            class="px-8"
          >
            <v-icon icon="mdi-content-save" size="20" class="ms-2" />
            שמור
          </v-btn>
          <v-btn 
            variant="outlined" 
            rounded="xl" 
            size="large"
            @click="closeAppointmentDialog"
            class="px-6"
          >
            ביטול
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="selectedAppointment"
            color="error"
            variant="text"
            rounded="xl"
            @click="confirmDeleteAppointment"
          >
            <v-icon icon="mdi-delete" size="20" class="ms-2" />
            מחק
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy as firestoreOrderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Client, Appointment, ScheduleSlot } from '@/types/manage'

// State
const clients = ref<Client[]>([])
const appointments = ref<Appointment[]>([])
const templateSlots = ref<ScheduleSlot[]>([])
const currentWeekStart = ref(getWeekStart(new Date()))
const showTemplateDialog = ref(false)
const showAppointmentDetailsDialog = ref(false)
const showAddAppointmentDialog = ref(false)
const showAddClientQuick = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const savingTemplate = ref(false)
const savingAppointment = ref(false)
const appointmentFormRef = ref()

const appointmentForm = ref({
  clientId: '',
  date: '',
  time: '',
  price: 400,
  attended: false,
  paid: false,
  paymentMethod: 'cash' as const,
  paymentAmount: 0,
  notes: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Constants
const hebrewDays = [
  { index: 0, name: 'יום ראשון', icon: 'mdi-numeric-1-circle' },
  { index: 1, name: 'יום שני', icon: 'mdi-numeric-2-circle' },
  { index: 2, name: 'יום שלישי', icon: 'mdi-numeric-3-circle' },
  { index: 3, name: 'יום רביעי', icon: 'mdi-numeric-4-circle' },
  { index: 4, name: 'יום חמישי', icon: 'mdi-numeric-5-circle' },
  { index: 5, name: 'יום שישי', icon: 'mdi-numeric-6-circle' },
  { index: 6, name: 'יום שבת', icon: 'mdi-numeric-7-circle' }
]

const defaultTimeSlots = ['11:00', '12:00', '14:30', '17:00', '18:00']

// Dynamic time slots based on appointments and template
const timeSlots = computed(() => {
  const slots = new Set(defaultTimeSlots)

  // Add times from appointments
  appointments.value.forEach(apt => {
    if (apt.time) slots.add(apt.time)
  })

  // Add times from template
  templateSlots.value.forEach(slot => {
    if (slot.time) slots.add(slot.time)
  })

  // Sort times
  return Array.from(slots).sort()
})

const paymentMethods = [
  { title: 'מזומן', value: 'cash' },
  { title: 'העברה בנקאית', value: 'transfer' },
  { title: 'אשראי', value: 'credit' },
  { title: 'צ\'ק', value: 'check' }
]

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'שדה חובה'
}

// Computed
const clientOptions = computed(() => clients.value)

const hasTemplate = computed(() => templateSlots.value.length > 0)

const isWeekFilledFromTemplate = computed(() => {
  if (!hasTemplate.value) return false
  
  // Check if all template slots already have appointments in current week
  let allSlotsFilled = true
  for (const slot of templateSlots.value) {
    const dayDate = daysOfWeek.value[slot.dayOfWeek]?.date
    if (dayDate) {
      const existing = getAppointment(dayDate, slot.time)
      if (!existing && slot.defaultClientId) {
        allSlotsFilled = false
        break
      }
    }
  }
  return allSlotsFilled
})

const canFillWeek = computed(() => {
  return hasTemplate.value && !isWeekFilledFromTemplate.value
})

const daysOfWeek = computed(() => {
  const days = []
  const weekStart = new Date(currentWeekStart.value)
  weekStart.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    date.setHours(0, 0, 0, 0)

    days.push({
      index: i,
      name: hebrewDays[i].name,
      date: date
    })
  }

  return days
})

const currentWeekDisplay = computed(() => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(currentWeekStart.value)
  end.setDate(end.getDate() + 6)
  return `${formatDate(start)} - ${formatDate(end)}`
})

// Helper Functions
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit'
  }).format(date)
}

function isSameDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)

  return d1.getTime() === d2.getTime()
}

// Methods
const loadClients = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'clients'))
    clients.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Client[]
  } catch (error) {
    console.error('Error loading clients:', error)
  }
}

const loadAppointments = async () => {
  try {
    const weekStart = new Date(currentWeekStart.value)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const q = query(
      collection(db, 'appointments'),
      where('date', '>=', weekStart),
      where('date', '<', weekEnd)
    )
    const snapshot = await getDocs(q)
    appointments.value = snapshot.docs.map(doc => {
      const data = doc.data()
      const aptDate = data.date?.toDate() || new Date()
      aptDate.setHours(0, 0, 0, 0)

      return {
        id: doc.id,
        clientId: data.clientId,
        clientName: data.clientName,
        date: aptDate,
        time: data.time,
        price: data.price,
        attended: data.attended || false,
        paid: data.paid || false,
        paymentAmount: data.paymentAmount,
        paymentMethod: data.paymentMethod,
        sessionNumber: data.sessionNumber || 1,
        notes: data.notes || ''
      } as Appointment
    })

    console.log('✅ Loaded', appointments.value.length, 'appointments for week:', weekStart.toDateString())
  } catch (error) {
    console.error('Error loading appointments:', error)
    showSnackbar('שגיאה בטעינת פגישות', 'error')
  }
}

const loadTemplate = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'schedule_template'))
    templateSlots.value = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        dayOfWeek: data.dayOfWeek,
        time: data.time,
        defaultClientId: data.defaultClientId,
        defaultClientName: data.defaultClientName
      } as ScheduleSlot
    })
  } catch (error) {
    console.error('Error loading template:', error)
  }
}

const getAppointment = (date: Date, time: string): Appointment | undefined => {
  return appointments.value.find(apt => {
    const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date)
    return isSameDay(aptDate, date) && apt.time === time
  })
}

const getTemplateSlotsForDay = (dayIndex: number): ScheduleSlot[] => {
  return templateSlots.value.filter(slot => slot.dayOfWeek === dayIndex)
}

const addTemplateSlot = (dayIndex: number) => {
  const newSlot: ScheduleSlot = {
    id: `temp_${Date.now()}`,
    dayOfWeek: dayIndex,
    time: '09:00',
    defaultClientId: undefined,
    defaultClientName: undefined
  }
  templateSlots.value.push(newSlot)
}

const removeTemplateSlot = (dayIndex: number, slotIndex: number) => {
  const slots = getTemplateSlotsForDay(dayIndex)
  const slotToRemove = slots[slotIndex]
  const index = templateSlots.value.findIndex(s => s.id === slotToRemove.id)
  if (index > -1) {
    templateSlots.value.splice(index, 1)
  }
}

const saveTemplate = async () => {
  savingTemplate.value = true
  try {
    // Delete existing template
    const existingDocs = await getDocs(collection(db, 'schedule_template'))
    for (const docSnapshot of existingDocs.docs) {
      await deleteDoc(docSnapshot.ref)
    }

    // Save new template (only slots that are valid)
    for (const slot of templateSlots.value) {
      if (slot.time) {
        const clientName = slot.defaultClientId
          ? clients.value.find(c => c.id === slot.defaultClientId)?.name
          : null

        await addDoc(collection(db, 'schedule_template'), {
          dayOfWeek: slot.dayOfWeek,
          time: slot.time,
          defaultClientId: slot.defaultClientId || null,
          defaultClientName: clientName
        })
      }
    }

    showSnackbar('התבנית נשמרה בהצלחה', 'success')
    showTemplateDialog.value = false
    await loadTemplate()
  } catch (error) {
    console.error('Error saving template:', error)
    showSnackbar('שגיאה בשמירת התבנית', 'error')
  } finally {
    savingTemplate.value = false
  }
}

const fillWeekFromTemplate = async () => {
  if (!hasTemplate.value) {
    showSnackbar('אין תבנית שבועית מוגדרת', 'warning')
    return
  }

  try {
    let addedCount = 0

    for (const day of daysOfWeek.value) {
      const daySlots = templateSlots.value.filter(s => s.dayOfWeek === day.index)

      for (const slot of daySlots) {
        // Check if appointment already exists
        const existing = getAppointment(day.date, slot.time)
        if (existing) continue

        if (slot.defaultClientId) {
          const client = clients.value.find(c => c.id === slot.defaultClientId)
          if (client) {
            // Create date at midnight
            const appointmentDate = new Date(day.date)
            appointmentDate.setHours(0, 0, 0, 0)

            const appointmentData = {
              clientId: client.id,
              clientName: client.name,
              date: appointmentDate,
              time: slot.time,
              price: client.pricePerSession,
              attended: false,
              paid: false,
              paymentMethod: 'cash',
              paymentAmount: 0,
              sessionNumber: client.totalSessions + 1,
              notes: ''
            }

            await addDoc(collection(db, 'appointments'), appointmentData)
            addedCount++
          }
        }
      }
    }

    if (addedCount > 0) {
      showSnackbar(`נוספו ${addedCount} פגישות בהצלחה`, 'success')
    } else {
      showSnackbar('כל הפגישות כבר קיימות', 'info')
    }

    await loadAppointments()
  } catch (error) {
    console.error('Error filling week:', error)
    showSnackbar('שגיאה במילוי השבוע: ' + error, 'error')
  }
}

const openAppointmentDialog = (date: Date, time: string) => {
  const existing = getAppointment(date, time)

  if (existing) {
    selectedAppointment.value = existing
    appointmentForm.value = {
      clientId: existing.clientId,
      date: date.toISOString().split('T')[0],
      time: existing.time,
      price: existing.price,
      attended: existing.attended,
      paid: existing.paid,
      paymentMethod: existing.paymentMethod || 'cash',
      paymentAmount: existing.paymentAmount || existing.price,
      notes: existing.notes || ''
    }
  } else {
    selectedAppointment.value = null
    appointmentForm.value = {
      clientId: '',
      date: date.toISOString().split('T')[0],
      time: time,
      price: 400,
      attended: false,
      paid: false,
      paymentMethod: 'cash',
      paymentAmount: 400,
      notes: ''
    }
  }

  showAppointmentDetailsDialog.value = true
}

const closeAppointmentDialog = () => {
  showAppointmentDetailsDialog.value = false
  selectedAppointment.value = null
  appointmentFormRef.value?.reset()
}

const updateClientPrice = () => {
  const client = clients.value.find(c => c.id === appointmentForm.value.clientId)
  if (client) {
    appointmentForm.value.price = client.pricePerSession
    // Only update payment amount if it's 0 or if it was the old price
    if (appointmentForm.value.paymentAmount === 0 || appointmentForm.value.paymentAmount === appointmentForm.value.price) {
      appointmentForm.value.paymentAmount = client.pricePerSession
    }
  }
}

const saveAppointment = async () => {
  const { valid } = await appointmentFormRef.value.validate()
  if (!valid) return

  savingAppointment.value = true
  try {
    const client = clients.value.find(c => c.id === appointmentForm.value.clientId)
    if (!client) return

    const appointmentDate = new Date(appointmentForm.value.date)
    appointmentDate.setHours(0, 0, 0, 0)

    const appointmentData = {
      clientId: appointmentForm.value.clientId,
      clientName: client.name,
      date: appointmentDate,
      time: appointmentForm.value.time,
      price: appointmentForm.value.price,
      attended: appointmentForm.value.attended,
      paid: appointmentForm.value.paid,
      paymentMethod: appointmentForm.value.paymentMethod,
      paymentAmount: appointmentForm.value.paymentAmount || 0,
      sessionNumber: client.totalSessions + 1,
      notes: appointmentForm.value.notes || ''
    }

    if (selectedAppointment.value) {
      await updateDoc(doc(db, 'appointments', selectedAppointment.value.id), appointmentData)
      showSnackbar('הפגישה עודכנה בהצלחה', 'success')
    } else {
      await addDoc(collection(db, 'appointments'), appointmentData)
      showSnackbar('הפגישה נוספה בהצלחה', 'success')
    }

    // Update client balance and session count
    if (appointmentForm.value.paid) {
      const balanceChange = appointmentForm.value.paymentAmount - appointmentForm.value.price
      await updateDoc(doc(db, 'clients', client.id), {
        totalSessions: client.totalSessions + 1,
        balance: client.balance + balanceChange
      })
    }

    await loadAppointments()
    await loadClients() // Reload to see updated balance
    closeAppointmentDialog()
  } catch (error) {
    console.error('Error saving appointment:', error)
    showSnackbar('שגיאה בשמירת הפגישה: ' + error, 'error')
  } finally {
    savingAppointment.value = false
  }
}

const confirmDeleteAppointment = async () => {
  if (!selectedAppointment.value) return

  try {
    await deleteDoc(doc(db, 'appointments', selectedAppointment.value.id))
    showSnackbar('הפגישה נמחקה בהצלחה', 'success')
    closeAppointmentDialog()
    await loadAppointments()
  } catch (error) {
    console.error('Error deleting appointment:', error)
    showSnackbar('שגיאה במחיקת הפגישה', 'error')
  }
}

const previousWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  currentWeekStart.value = newStart
  loadAppointments()
}

const nextWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
  loadAppointments()
}

const currentWeek = () => {
  currentWeekStart.value = getWeekStart(new Date())
  loadAppointments()
}

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
}

// Lifecycle
onMounted(() => {
  loadClients()
  loadAppointments()
  loadTemplate()
})
</script>

<style scoped>
.schedule-container {
  max-width: 1600px;
  margin: 0 auto;
  color: #1e3a5f;
}

.schedule-container h2,
.schedule-container h3,
.schedule-container h4 {
  color: #1e3a5f;
}

.weekly-table {
  width: 100%;
  border-collapse: collapse;
  direction: rtl;
}

.weekly-table thead tr,
.weekly-table tbody tr {
  direction: rtl;
}

.weekly-table th {
  background: linear-gradient(135deg, #1976D2, #1565C0);
  color: white;
  padding: 16px 8px;
  font-weight: 600;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.weekly-table th:first-child {
  border-left: none;
}

.time-header {
  background: linear-gradient(135deg, #1565C0, #0D47A1) !important;
  position: sticky;
  right: 0;
  z-index: 10;
}

.day-column {
  min-width: 140px;
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-name {
  font-size: 1rem;
  font-weight: 700;
}

.day-date {
  font-size: 0.875rem;
  opacity: 0.95;
  font-weight: 500;
}

.time-cell {
  background: linear-gradient(135deg, #f5f7fa, #e8f0f8);
  font-weight: 700;
  text-align: center;
  padding: 16px 12px;
  width: 100px;
  border-left: 2px solid #1976D2;
  position: sticky;
  right: 0;
  z-index: 5;
  color: #1565C0;
}

.appointment-cell {
  border: 1px solid #e0e0e0;
  border-left: 2px solid #e0e0e0;
  padding: 8px;
  min-height: 90px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  vertical-align: top;
  position: relative;
}

.appointment-cell:hover {
  background-color: rgba(25, 118, 210, 0.08);
  border-color: #1976D2;
}

.appointment-card {
  background: linear-gradient(135deg, #ffffff, #f0f7ff);
  border: 2px solid #1976D2;
  border-radius: 16px;
  padding: 12px;
  min-height: 70px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.12);
}

.appointment-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.25);
}

.appointment-card.attended {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.15));
}

.appointment-card.paid {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.15));
}

.appointment-card.attended.paid {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(25, 118, 210, 0.12));
}

.appointment-name {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 8px;
  color: #1e3a5f;
}

.appointment-details {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  opacity: 0.3;
  transition: all 0.3s ease;
  background: radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, transparent 70%);
}

.empty-slot:hover {
  opacity: 0.8;
  transform: scale(1.2);
}

.empty-slot .v-icon {
  font-size: 32px !important;
  color: #1976D2 !important;
}

/* Template Panel Styles */
.template-panel {
  margin-bottom: 12px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.day-panel-title {
  background: linear-gradient(135deg, #f8fbff 0%, #e8f4ff 100%);
  transition: all 0.3s ease;
}

.day-panel-title:hover {
  background: linear-gradient(135deg, #e8f4ff 0%, #d1e9ff 100%);
}

.day-name-template {
  font-weight: 700;
  font-size: 1.05rem;
  color: #1565C0;
}

.template-panel-content {
  padding: 16px !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
}

.template-slot-row {
  margin-bottom: 8px !important;
  padding: 8px;
  border-radius: 8px;
  background: rgba(25, 118, 210, 0.03);
  transition: all 0.3s ease;
}

.template-slot-row:hover {
  background: rgba(25, 118, 210, 0.08);
  transform: translateX(-4px);
}

/* Form Section */
.form-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(25, 118, 210, 0.12);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%) !important;
}
</style>

