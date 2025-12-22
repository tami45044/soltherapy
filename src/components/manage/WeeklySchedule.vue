<template>
  <v-container fluid class="schedule-container">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12" md="8" class="text-right">
        <h2 class="text-h4 mb-2">יומן שבועי</h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          שבוע {{ currentWeekDisplay }}
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-left">
        <v-btn-group rounded="xl" elevation="2">
          <v-btn @click="previousWeek" color="primary" variant="flat">
            <v-icon icon="mdi-chevron-right" />
            שבוע קודם
          </v-btn>
          <v-btn @click="currentWeek" color="primary" variant="outlined" min-width="100">
            היום
          </v-btn>
          <v-btn @click="nextWeek" color="primary" variant="flat">
            שבוע הבא
            <v-icon icon="mdi-chevron-left" />
          </v-btn>
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
          <v-icon icon="mdi-calendar-clock" />
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
          <v-icon icon="mdi-auto-fix" size="20" />
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
          <v-icon icon="mdi-calendar-plus" />
          הוסף פגישה
        </v-btn>
      </v-col>
    </v-row>

    <!-- Weekly Calendar -->
    <v-card rounded="xl" elevation="4">
      <v-card-text class="pa-0">
        <v-table class="weekly-table">
          <thead>
            <tr>
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
            <tr v-for="time in timeSlots" :key="time">
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
                  <div class="appointment-session-number">
                    פגישה מס' {{ getDisplaySessionNumber(getAppointment(day.date, time)) }}
                  </div>
                  <div class="appointment-details">
                    <!-- סטטוס נוכחות -->
                    <v-chip
                      v-if="getAppointment(day.date, time)?.attended"
                      size="x-small"
                      color="success"
                    >
                      הגיע
                    </v-chip>
                    <v-chip
                      v-if="!getAppointment(day.date, time)?.attended && isAppointmentPast(day.date, time)"
                      size="x-small"
                      color="error"
                    >
                      לא הגיע
                    </v-chip>

                    <!-- סטטוס תשלום -->
                    <v-chip
                      v-if="getAppointment(day.date, time)?.attended"
                      size="x-small"
                      :color="getPaymentStatusColor(getAppointment(day.date, time))"
                    >
                      {{ getPaymentStatusText(getAppointment(day.date, time)) }}
                    </v-chip>

                    <!-- תגית משך פגישה -->
                    <v-chip
                      v-if="getAppointment(day.date, time)?.durationCategory"
                      size="x-small"
                      :color="getDurationColorForAppointment(getAppointment(day.date, time))"
                    >
                      <v-icon :icon="getDurationIconForAppointment(getAppointment(day.date, time))" size="x-small" start />
                      {{ getDurationLabelForAppointment(getAppointment(day.date, time)) }}
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
    <v-dialog v-model="showTemplateDialog" max-width="900" @click:outside="showTemplateDialog = false">
      <v-card rounded="xl">
        <v-card-title class="pa-6 bg-primary text-white text-right">
          <h3 class="text-h5">
            <v-icon icon="mdi-calendar-clock" />
            הגדרת תבנית שבועית
          </h3>
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-subtitle-1 mb-4">
            הגדר את הפגישות הקבועות שלך לכל יום בשבוע. המערכת תמלא אוטומטית כל שבוע חדש.
          </p>

          <v-alert
            v-if="expectedWeeklyTarget > 0"
            type="success"
            variant="tonal"
            class="mb-6"
          >
            <div class="text-body-1">
              <strong>יעד שבועי צפוי מתבנית זו:</strong> ₪{{ expectedWeeklyTarget.toLocaleString() }}
            </div>
            <div class="text-body-2 mt-1 text-medium-emphasis">
              יעד זה יחושב אוטומטית כאשר תמלא את השבוע מהתבנית
            </div>
          </v-alert>

          <v-expansion-panels>
            <v-expansion-panel v-for="day in hebrewDays" :key="day.index" class="template-panel">
              <v-expansion-panel-title class="day-panel-title">
                <div class="d-flex align-center flex-grow-1">
                  <v-icon :icon="day.icon" color="primary" />
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
                  <v-icon icon="mdi-plus" size="small" />
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
                      hide-details
                      @change="sortTemplateSlots"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      v-model="slot.defaultClientIds"
                      label="לקוחות (לפי תדירות)"
                      :items="clientOptions"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      density="compact"
                      multiple
                      chips
                      clearable
                      hide-details
                      auto-select-first
                      placeholder="הקלד לחיפוש..."
                    >
                      <template #chip="{ props, item }">
                        <v-chip
                          v-bind="props"
                          size="small"
                          closable
                          @click:close="removeClientFromSlot(slot, item.value)"
                        >
                          {{ item.title }}
                        </v-chip>
                      </template>
                    </v-autocomplete>
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
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="showTemplateDialog = false"
            class="px-6"
          >
            ביטול
          </v-btn>
          <v-btn
            color="primary"
            rounded="xl"
            variant="elevated"
            size="large"
            elevation="2"
            :loading="savingTemplate"
            @click="saveTemplate"
            class="px-8"
          >
            <v-icon icon="mdi-check" />
            שמור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add/Edit Appointment Dialog -->
    <v-dialog
      v-model="showAppointmentDetailsDialog"
      max-width="650"
      @click:outside="closeAppointmentDialog"
    >
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-calendar-edit-outline" size="24" style="opacity: 0.8;" />
          <span class="text-h6">{{ selectedAppointment ? 'עריכת פגישה' : 'פגישה חדשה' }}</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="appointmentFormRef">
            <!-- שלב 1: יצירת פגישה -->
            <div class="form-section">
              <h4 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1976D2;">
                <v-icon icon="mdi-information" size="small" />
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
                rows="2"
                hide-details
                class=""
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
                <v-icon icon="mdi-clipboard-check" size="small" />
                סטטוס פגישה
              </h4>

              <v-switch
                v-model="appointmentForm.attended"
                label="הלקוח הגיע"
                color="success"
                hide-details
                class="mb-4"
              >
                <template #prepend>
                  <v-icon icon="mdi-account-check" color="success" />
                </template>
              </v-switch>

              <!-- סיכום פגישה (רק אם הגיע) -->
              <div v-if="appointmentForm.attended" class="mt-6">
                <v-divider class="mb-4" />

                <h4 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1976D2;">
                  <v-icon icon="mdi-clock-check-outline" size="small" />
                  סיכום פגישה
                </h4>

                <v-textarea
                  v-model="sessionSummary.notes"
                  label="סיכום הפגישה בטקסט חופשי"
                  variant="outlined"
                  rounded="lg"
                  rows="3"
                  prepend-inner-icon="mdi-text"
                  hint="מה היה בפגישה? נושאים שדובר בהם, התקדמות, וכו'"
                  persistent-hint
                  class="mb-4"
                />

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="sessionSummary.startTime"
                      label="שעת התחלה"
                      type="time"
                      variant="outlined"
                      rounded="lg"
                      density="compact"
                      prepend-inner-icon="mdi-clock-start"
                      @change="calculateDuration"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="sessionSummary.endTime"
                      label="שעת סיום"
                      type="time"
                      variant="outlined"
                      rounded="lg"
                      density="compact"
                      prepend-inner-icon="mdi-clock-end"
                      @change="calculateDuration"
                    />
                  </v-col>
                </v-row>

                <!-- תוצאת משך הפגישה -->
                <v-card
                  v-if="sessionSummary.duration !== null"
                  rounded="lg"
                  variant="tonal"
                  :color="getDurationColor()"
                  class="mt-3 mb-3"
                >
                  <v-card-text class="pa-4 text-center">
                    <div class="text-body-2 font-weight-medium mb-2">משך הפגישה</div>
                    <div class="text-h5 font-weight-bold mb-2">
                      {{ Math.floor(sessionSummary.duration / 60) }}:{{ String(sessionSummary.duration % 60).padStart(2, '0') }} שעות
                    </div>
                    <v-chip
                      :color="getDurationColor()"
                      variant="elevated"
                      size="large"
                      class="font-weight-bold"
                    >
                      <v-icon :icon="getDurationIcon()" start size="small" />
                      {{ getDurationLabel() }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </div>

              <v-divider class="my-4" />

              <h4 class="text-subtitle-1 font-weight-bold mb-4" style="color: #1976D2;">
                <v-icon icon="mdi-cash-check" size="small" />
                תשלומים
              </h4>

              <!-- סיכום תשלומים -->
              <v-card rounded="lg" class="mb-4" variant="tonal" :color="isPaidInFull ? 'success' : remainingDebt < 0 ? 'info' : 'warning'">
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2 font-weight-medium">מחיר פגישה:</span>
                    <span class="text-h6 font-weight-bold">₪{{ appointmentForm.price }}</span>
                  </div>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2 font-weight-medium">שולם עד כה:</span>
                    <span class="text-h6 font-weight-bold">₪{{ totalPaid }}</span>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-body-1 font-weight-bold">
                      {{ remainingDebt > 0 ? 'נותר לתשלום:' : remainingDebt < 0 ? 'שילם יותר (זכות):' : 'שולם במלואו!' }}
                    </span>
                    <span class="text-h5 font-weight-bold">
                      {{ remainingDebt !== 0 ? `₪${Math.abs(remainingDebt)}` : '✓' }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>

              <!-- רשימת תשלומים קיימים -->
              <div v-if="payments.length > 0" class="mb-4">
                <h5 class="text-subtitle-2 font-weight-bold mb-3" style="color: #546e7a;">
                  <v-icon icon="mdi-history" size="20" />
                  תשלומים שבוצעו:
                </h5>
                <v-card
                  v-for="payment in payments"
                  :key="payment.id"
                  rounded="lg"
                  class="mb-2 payment-card-clean"
                  elevation="0"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-right">
                        <div class="d-flex align-center gap-3 mb-2">
                          <span class="text-h6 font-weight-bold" style="color: #455A64;">₪{{ payment.amount }}</span>
                          <v-chip
                            size="small"
                            :color="getPaymentMethodColorPastel(payment.method)"
                            variant="flat"
                            class="payment-chip-pastel"
                          >
                            {{ getPaymentMethodLabel(payment.method) }}
                          </v-chip>
                        </div>
                        <div class="text-caption" style="color: #78909C;">
                          {{ formatPaymentDateWithYear(payment.date) }}
                          {{ payment.notes ? ` • ${payment.notes}` : '' }}
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete-outline"
                        size="small"
                        variant="text"
                        style="color: #CFD8DC;"
                        @click="removePayment(payment.id)"
                      />
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <!-- הוספת תשלום חדש -->
              <div v-if="!showAddPaymentForm">
                <v-btn
                  color="blue-grey-lighten-4"
                  block
                  rounded="xl"
                  size="large"
                  variant="flat"
                  @click="showAddPaymentForm = true"
                  class="add-payment-btn"
                >
                  <v-icon icon="mdi-plus-circle-outline" size="20" />
                  הוסף תשלום
                </v-btn>
              </div>

              <v-expand-transition>
                <v-card v-if="showAddPaymentForm" rounded="lg" class="new-payment-card-clean" elevation="0">
                  <v-card-text class="pa-4">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="newPayment.amount"
                          label="סכום *"
                          type="number"
                          variant="outlined"
                          rounded="lg"
                          prefix="₪"
                          hide-details
                          class=""
                        >
                          <template #prepend-inner>
                            <v-icon icon="mdi-cash" size="20" style="opacity: 0.6;" />
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          v-model="newPayment.method"
                          label="אמצעי תשלום *"
                          :items="paymentMethods"
                          item-title="title"
                          item-value="value"
                          variant="outlined"
                          rounded="lg"
                          hide-details
                          class=""
                        >
                          <template #prepend-inner>
                            <v-icon icon="mdi-credit-card-outline" size="20" style="opacity: 0.6;" />
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-text-field
                      v-model="newPayment.notes"
                      label="הערות (אופציונלי)"
                      variant="outlined"
                      rounded="lg"
                      class="mt-3"
                      hide-details
                    >
                      <template #prepend-inner>
                        <v-icon icon="mdi-note-text-outline" size="20" style="opacity: 0.6;" />
                      </template>
                    </v-text-field>
                    <div class="d-flex gap-2 mt-4">
                      <v-btn
                        color="blue-grey-darken-2"
                        rounded="xl"
                        size="default"
                        variant="flat"
                        @click="addPayment"
                        :disabled="!newPayment.amount || newPayment.amount <= 0"
                      >
                        <v-icon icon="mdi-check" size="18" />
                        הוסף
                      </v-btn>
                      <v-btn
                        variant="outlined"
                        rounded="xl"
                        size="default"
                        @click="cancelAddPayment"
                      >
                        ביטול
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-expand-transition>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 d-flex">
          <v-btn
            v-if="selectedAppointment"
            color="error"
            rounded="xl"
            variant="outlined"
            size="large"
            @click="confirmDeleteAppointment"
            class="px-6"
          >
            <v-icon icon="mdi-delete" />
            מחק
          </v-btn>
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeAppointmentDialog"
            class="px-6"
          >
            ביטול
          </v-btn>
          <v-btn
            color="primary"
            rounded="xl"
            variant="elevated"
            size="large"
            elevation="2"
            :loading="savingAppointment"
            @click="saveAppointment"
            class="px-8"
          >
            <v-icon icon="mdi-check" />
            שמור
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
const showAddPaymentForm = ref(false)
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
  notes: ''
})

const payments = ref<Array<{
  id: string
  amount: number
  method: 'cash' | 'transfer' | 'credit' | 'check'
  date: Date
  notes: string
}>>([])

const sessionSummary = ref({
  startTime: '',
  endTime: '',
  duration: null as number | null,
  category: null as 'on-time' | 'partial' | 'overtime' | null,
  notes: ''
})

const newPayment = ref({
  amount: 0,
  method: 'cash' as 'cash' | 'transfer' | 'credit' | 'check',
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

// Dynamic time slots based on appointments and template ONLY (no default empty slots)
const timeSlots = computed(() => {
  const slots = new Set<string>()

  // Add times from current week's appointments
  appointments.value.forEach(apt => {
    if (apt.time) slots.add(apt.time)
  })

  // Add times from template (for current week)
  templateSlots.value.forEach(slot => {
    if (slot.time) {
      // Only show if slot has clients defined
      const hasClients = (slot.defaultClientIds && slot.defaultClientIds.length > 0)
        || (slot as any).defaultClientId
      if (hasClients) {
        slots.add(slot.time)
      }
    }
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
const clientOptions = computed(() => {
  return [...clients.value].sort((a, b) => a.name.localeCompare(b.name, 'he'))
})

const hasTemplate = computed(() => templateSlots.value.length > 0)

const expectedWeeklyTarget = computed(() => {
  let total = 0
  templateSlots.value.forEach(slot => {
    // Support both old and new format
    const clientIds = slot.defaultClientIds && slot.defaultClientIds.length > 0
      ? slot.defaultClientIds
      : ((slot as any).defaultClientId ? [(slot as any).defaultClientId] : [])

    // Add price of first client only (as estimate, since not all clients come every week)
    if (clientIds.length > 0) {
      const client = clients.value.find(c => c.id === clientIds[0])
      if (client) {
        total += client.pricePerSession
      }
    }
  })
  return total
})

const isWeekFilledFromTemplate = computed(() => {
  if (!hasTemplate.value) return false

  // Check if all template slots already have appointments in current week
  let allSlotsFilled = true
  for (const slot of templateSlots.value) {
    const dayDate = daysOfWeek.value[slot.dayOfWeek]?.date
    if (dayDate) {
      const existing = getAppointment(dayDate, slot.time)

      // Support both old and new format
      const hasClients = (slot.defaultClientIds && slot.defaultClientIds.length > 0)
        || (slot as any).defaultClientId

      if (!existing && hasClients) {
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

const totalPaid = computed(() => {
  return payments.value.reduce((sum, payment) => sum + payment.amount, 0)
})

const remainingDebt = computed(() => {
  return appointmentForm.value.price - totalPaid.value
})

const isPaidInFull = computed(() => {
  return totalPaid.value >= appointmentForm.value.price
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

  // פורמט: DD/MM/YYYY
  const formatDateWithYear = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // מתחילה לסוף (14/12/2025-20/12/2025)
  return `${formatDateWithYear(start)}-${formatDateWithYear(end)}`
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

function formatPaymentDateWithYear(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function isSameDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)

  return d1.getTime() === d2.getTime()
}

// פונקציה ליצירת תאריך מקומי מ-date input string (YYYY-MM-DD)
function createLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  // month-1 כי חודשים מתחילים מ-0
  const date = new Date(year, month - 1, day)
  date.setHours(0, 0, 0, 0)
  return date
}

// פונקציה להמרת תאריך ל-string בפורמט YYYY-MM-DD (timezone מקומי!)
function dateToInputString(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// פונקציה לבדיקה אם פגישה עברה
function isAppointmentPast(date: Date, time: string): boolean {
  const now = new Date()
  const aptDate = new Date(date)

  // פירוק השעה
  const [hours, minutes] = time.split(':').map(Number)
  aptDate.setHours(hours, minutes, 0, 0)

  return aptDate < now
}

function getTotalPaid(appointment: Appointment | null | undefined): number {
  if (!appointment) return 0

  let total = 0
  if (appointment.payments && Array.isArray(appointment.payments)) {
    appointment.payments.forEach(payment => {
      total += payment.amount || 0
    })
  }
  return total
}

function getPaymentStatusText(appointment: Appointment | null | undefined): string {
  if (!appointment) return ''

  const totalPaid = getTotalPaid(appointment)
  const price = appointment.price || 0

  if (totalPaid === 0) {
    return 'לא שילם'
  } else if (totalPaid >= price) {
    return 'שולם'
  } else {
    return `שולם חלקית (₪${totalPaid})`
  }
}

function getPaymentStatusColor(appointment: Appointment | null | undefined): string {
  if (!appointment) return 'grey'

  const totalPaid = getTotalPaid(appointment)
  const price = appointment.price || 0

  if (totalPaid === 0) {
    return 'error'
  } else if (totalPaid >= price) {
    return 'success'
  } else {
    return 'warning'
  }
}

// Session duration functions
const calculateDuration = () => {
  if (!sessionSummary.value.startTime || !sessionSummary.value.endTime) {
    sessionSummary.value.duration = null
    sessionSummary.value.category = null
    return
  }

  const [startHour, startMin] = sessionSummary.value.startTime.split(':').map(Number)
  const [endHour, endMin] = sessionSummary.value.endTime.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  const duration = endMinutes - startMinutes
  sessionSummary.value.duration = duration > 0 ? duration : null

  // Determine category
  if (duration > 0) {
    if (duration < 50) {
      sessionSummary.value.category = 'partial'
    } else if (duration <= 65) {
      sessionSummary.value.category = 'on-time'
    } else {
      sessionSummary.value.category = 'overtime'
    }
  } else {
    sessionSummary.value.category = null
  }
}

const getDurationColor = (): string => {
  if (!sessionSummary.value.category) return 'grey'

  switch (sessionSummary.value.category) {
    case 'on-time':
      return 'success'
    case 'partial':
      return 'warning'
    case 'overtime':
      return 'info'
    default:
      return 'grey'
  }
}

const getDurationLabel = (): string => {
  if (!sessionSummary.value.category) return ''

  switch (sessionSummary.value.category) {
    case 'on-time':
      return 'פגישה בזמן'
    case 'partial':
      return 'פגישה חלקית'
    case 'overtime':
      return 'פגישה חורגת מהזמן'
    default:
      return ''
  }
}

const getDurationIcon = (): string => {
  if (!sessionSummary.value.category) return 'mdi-clock-outline'

  switch (sessionSummary.value.category) {
    case 'on-time':
      return 'mdi-check-circle'
    case 'partial':
      return 'mdi-alert-circle'
    case 'overtime':
      return 'mdi-clock-alert'
    default:
      return 'mdi-clock-outline'
  }
}

// Duration functions for appointment cards
const getDurationColorForAppointment = (appointment: Appointment | null | undefined): string => {
  if (!appointment?.durationCategory) return 'grey'

  switch (appointment.durationCategory) {
    case 'on-time':
      return 'success'
    case 'partial':
      return 'warning'
    case 'overtime':
      return 'info'
    default:
      return 'grey'
  }
}

const getDurationLabelForAppointment = (appointment: Appointment | null | undefined): string => {
  if (!appointment?.durationCategory) return ''

  switch (appointment.durationCategory) {
    case 'on-time':
      return 'בזמן'
    case 'partial':
      return 'חלקית'
    case 'overtime':
      return 'חריגה'
    default:
      return ''
  }
}

const getDurationIconForAppointment = (appointment: Appointment | null | undefined): string => {
  if (!appointment?.durationCategory) return 'mdi-clock-outline'

  switch (appointment.durationCategory) {
    case 'on-time':
      return 'mdi-check-circle'
    case 'partial':
      return 'mdi-alert-circle'
    case 'overtime':
      return 'mdi-clock-alert'
    default:
      return 'mdi-clock-outline'
  }
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

      // Support both old and new payment format
      let paymentsArray: any[] = []
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
          date: aptDate,
          notes: ''
        }]
      }

      return {
        id: doc.id,
        clientId: data.clientId,
        clientName: data.clientName,
        date: aptDate,
        time: data.time,
        price: data.price,
        attended: data.attended || false,
        paid: data.paid || false,
        payments: paymentsArray,
        sessionNumber: data.sessionNumber || 1,
        notes: data.notes || '',
        // Keep old fields for backward compatibility
        paymentAmount: data.paymentAmount,
        paymentMethod: data.paymentMethod
      } as Appointment
    })

    console.log('✅ Loaded', appointments.value.length, 'appointments for week:', weekStart.toDateString())

    // Auto-update weekly target when appointments are loaded
    await updateWeeklyTargetFromAppointments()
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

      // Support both old (single client) and new (multiple clients) format
      if (data.defaultClientIds && Array.isArray(data.defaultClientIds)) {
        // New format
        return {
          id: doc.id,
          dayOfWeek: data.dayOfWeek,
          time: data.time,
          defaultClientIds: data.defaultClientIds,
          defaultClientNames: data.defaultClientNames || []
        } as ScheduleSlot
      } else {
        // Old format - convert to new
        return {
          id: doc.id,
          dayOfWeek: data.dayOfWeek,
          time: data.time,
          defaultClientIds: data.defaultClientId ? [data.defaultClientId] : [],
          defaultClientNames: data.defaultClientName ? [data.defaultClientName] : []
        } as ScheduleSlot
      }
    })

    // Sort template slots after loading
    sortTemplateSlots()
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

// חישוב מספר פגישה דינמי לפי כמה פגישות הלקוח הגיע עד תאריך זה
const getDisplaySessionNumber = (appointment: Appointment | undefined): number => {
  if (!appointment) return 1

  // Count how many appointments this client attended BEFORE this date
  const attendedBefore = appointments.value.filter(apt => {
    if (apt.clientId !== appointment.clientId) return false
    if (!apt.attended) return false

    const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date)
    const currentDate = appointment.date instanceof Date ? appointment.date : new Date(appointment.date)

    // Include appointments before this one, or same date but earlier time
    if (aptDate < currentDate) return true
    if (isSameDay(aptDate, currentDate) && apt.time < appointment.time) return true
    if (isSameDay(aptDate, currentDate) && apt.time === appointment.time && apt.id === appointment.id) return true

    return false
  }).length

  return attendedBefore > 0 ? attendedBefore : 1
}

const getTemplateSlotsForDay = (dayIndex: number): ScheduleSlot[] => {
  return templateSlots.value.filter(slot => slot.dayOfWeek === dayIndex)
}

const addTemplateSlot = (dayIndex: number) => {
  const newSlot: ScheduleSlot = {
    id: `temp_${Date.now()}`,
    dayOfWeek: dayIndex,
    time: '09:00',
    defaultClientIds: [],
    defaultClientNames: []
  }
  templateSlots.value.push(newSlot)

  // Sort template slots by day and time after adding
  sortTemplateSlots()
}

const sortTemplateSlots = () => {
  templateSlots.value.sort((a, b) => {
    // First sort by day of week
    if (a.dayOfWeek !== b.dayOfWeek) {
      return a.dayOfWeek - b.dayOfWeek
    }
    // Then sort by time
    return a.time.localeCompare(b.time)
  })
}

const removeTemplateSlot = (dayIndex: number, slotIndex: number) => {
  const slots = getTemplateSlotsForDay(dayIndex)
  const slotToRemove = slots[slotIndex]
  const index = templateSlots.value.findIndex(s => s.id === slotToRemove.id)
  if (index > -1) {
    templateSlots.value.splice(index, 1)
  }
}

const removeClientFromSlot = (slot: ScheduleSlot, clientId: string) => {
  const index = slot.defaultClientIds.indexOf(clientId)
  if (index > -1) {
    slot.defaultClientIds.splice(index, 1)
    if (slot.defaultClientNames && slot.defaultClientNames.length > index) {
      slot.defaultClientNames.splice(index, 1)
    }
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
        // Update client names based on selected IDs
        const clientNames = (slot.defaultClientIds || []).map(clientId => {
          const client = clients.value.find(c => c.id === clientId)
          return client ? client.name : ''
        }).filter(name => name !== '')

        await addDoc(collection(db, 'schedule_template'), {
          dayOfWeek: slot.dayOfWeek,
          time: slot.time,
          defaultClientIds: slot.defaultClientIds || [],
          defaultClientNames: clientNames
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

// Helper: Check if client should be added this week based on frequency
const shouldAddClientThisWeek = async (clientId: string, frequency: string) => {
  if (frequency === 'weekly') return true

  // Get all appointments for this client (without orderBy to avoid index requirement)
  const clientAppointmentsQuery = query(
    collection(db, 'appointments'),
    where('clientId', '==', clientId)
  )
  const clientAppointmentsSnapshot = await getDocs(clientAppointmentsQuery)

  if (clientAppointmentsSnapshot.empty) return true // First appointment

  // Sort appointments by date in memory
  const appointments = clientAppointmentsSnapshot.docs
    .map(doc => doc.data())
    .sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      return dateB.getTime() - dateA.getTime() // desc order
    })

  const lastAppointment = appointments[0]
  const lastDate = lastAppointment.date?.toDate() || new Date(lastAppointment.date)
  const currentWeekStart = getWeekStart(new Date())

  const daysSinceLastAppointment = Math.floor(
    (currentWeekStart.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (frequency === 'biweekly') {
    return daysSinceLastAppointment >= 14
  }

  if (frequency === 'monthly') {
    return daysSinceLastAppointment >= 28
  }

  return true
}

const fillWeekFromTemplate = async () => {
  if (!hasTemplate.value) {
    showSnackbar('אין תבנית שבועית מוגדרת', 'warning')
    return
  }

  try {
    let addedCount = 0

    // Pre-calculate session numbers for each client
    const clientSessionCounts: Record<string, number> = {}

    for (const day of daysOfWeek.value) {
      const daySlots = templateSlots.value.filter(s => s.dayOfWeek === day.index)

      for (const slot of daySlots) {
        // Support old format (single client) and new format (multiple clients)
        const clientIds = slot.defaultClientIds && slot.defaultClientIds.length > 0
          ? slot.defaultClientIds
          : ((slot as any).defaultClientId ? [(slot as any).defaultClientId] : [])

        // Loop through all clients for this slot
        for (const clientId of clientIds) {
          const client = clients.value.find(c => c.id === clientId)
          if (!client) continue

          // Check if THIS CLIENT already has an appointment at this time (check in Firebase directly)
          const dayStart = new Date(day.date)
          dayStart.setHours(0, 0, 0, 0)
          const dayEnd = new Date(day.date)
          dayEnd.setHours(23, 59, 59, 999)

          const existingAppointmentQuery = query(
            collection(db, 'appointments'),
            where('clientId', '==', client.id),
            where('date', '>=', dayStart),
            where('date', '<=', dayEnd),
            where('time', '==', slot.time)
          )
          const existingAppointmentSnapshot = await getDocs(existingAppointmentQuery)

          if (!existingAppointmentSnapshot.empty) {
            console.log(`⏭️ Skip ${client.name} - already has appointment at ${slot.time}`)
            continue
          }

          // Check if client should be added this week based on frequency
          const shouldAdd = await shouldAddClientThisWeek(client.id, client.frequency || 'weekly')

          if (!shouldAdd) {
            console.log(`⏭️ Skip ${client.name} - not due this week (${client.frequency})`)
            continue
          }

          // Calculate session number for this client (count only attended appointments)
          if (!clientSessionCounts[client.id]) {
            // First time seeing this client - count existing ATTENDED appointments
            const clientAppointmentsQuery = query(
              collection(db, 'appointments'),
              where('clientId', '==', client.id)
            )
            const clientAppointmentsSnapshot = await getDocs(clientAppointmentsQuery)
            // Count only appointments where the client attended
            const attendedCount = clientAppointmentsSnapshot.docs.filter(
              doc => doc.data().attended === true
            ).length
            clientSessionCounts[client.id] = attendedCount
          }

          // Don't increment here - session number will be assigned when they attend
          // For now, assign the next potential session number
          const sessionNumber = clientSessionCounts[client.id] + 1

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
            payments: [],
            sessionNumber: sessionNumber,
            notes: ''
          }

          await addDoc(collection(db, 'appointments'), appointmentData)
          addedCount++
          break // Only add ONE client per slot per week
        }
      }
    }

    // Reload appointments to get updated list
    await loadAppointments()

    // Calculate target from ALL appointments this week (not just template)
    let totalWeeklyTarget = 0
    appointments.value.forEach(appointment => {
      totalWeeklyTarget += appointment.price || 0
    })

    // Update or create WeeklyPrize with target
    await updateWeeklyTarget(totalWeeklyTarget)

    // Show message with target
    if (addedCount > 0) {
      showSnackbar(`נוספו ${addedCount} פגישות בהצלחה. יעד שבועי: ₪${totalWeeklyTarget.toLocaleString()}`, 'success')
    } else {
      showSnackbar(`כל הפגישות כבר קיימות. יעד שבועי: ₪${totalWeeklyTarget.toLocaleString()}`, 'info')
    }
  } catch (error) {
    console.error('Error filling week:', error)
    showSnackbar('שגיאה במילוי השבוע: ' + error, 'error')
  }
}

const updateWeeklyTarget = async (target: number) => {
  try {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // Check if prize exists for this week
    const q = query(
      collection(db, 'weekly_prizes'),
      where('weekStart', '>=', weekStart),
      where('weekStart', '<', weekEnd)
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Create new prize with target
      await addDoc(collection(db, 'weekly_prizes'), {
        weekStart: weekStart,
        prizeText: 'הפתעה מיוחדת! 🎁',
        weeklyTarget: target,
        weeklyActual: 0,
        isUnlocked: false
      })
    } else {
      // Update existing prize
      const docRef = doc(db, 'weekly_prizes', snapshot.docs[0].id)
      await updateDoc(docRef, {
        weeklyTarget: target
      })
    }
  } catch (error) {
    console.error('Error updating weekly target:', error)
  }
}

const updateWeeklyTargetFromAppointments = async () => {
  try {
    // Calculate target from ALL appointments in current week
    let totalWeeklyTarget = 0
    appointments.value.forEach(appointment => {
      totalWeeklyTarget += appointment.price || 0
    })

    // Always update, even if target is 0 (no appointments)
    await updateWeeklyTarget(totalWeeklyTarget)
    console.log('✅ Updated weekly target:', totalWeeklyTarget)
  } catch (error) {
    console.error('Error updating weekly target from appointments:', error)
  }
}

const openAppointmentDialog = (date: Date, time: string) => {
  const existing = getAppointment(date, time)

  if (existing) {
    selectedAppointment.value = existing
    const aptDate = existing.date instanceof Date ? existing.date : new Date(existing.date)
    appointmentForm.value = {
      clientId: existing.clientId,
      date: dateToInputString(aptDate),
      time: existing.time,
      price: existing.price,
      attended: existing.attended,
      paid: existing.paid,
      notes: existing.notes || ''
    }

    // Load payments (support old format with single payment)
    if (existing.payments && existing.payments.length > 0) {
      payments.value = existing.payments.map(p => ({
        id: p.id,
        amount: p.amount,
        method: p.method,
        date: p.date instanceof Date ? p.date : new Date(p.date),
        notes: p.notes || ''
      }))
    } else if ((existing as any).paymentAmount && (existing as any).paymentAmount > 0) {
      // Old format - convert to new format (backward compatibility)
      payments.value = [{
        id: `payment_${Date.now()}`,
        amount: (existing as any).paymentAmount,
        method: (existing as any).paymentMethod || 'cash',
        date: aptDate,
        notes: ''
      }]
    } else {
      payments.value = []
    }

    // Load session summary
    sessionSummary.value = {
      startTime: existing.startTime || '',
      endTime: existing.endTime || '',
      duration: existing.duration || null,
      category: existing.durationCategory || null,
      notes: existing.sessionSummaryNotes || ''
    }

    // Recalculate duration to ensure UI is in sync
    if (existing.startTime && existing.endTime) {
      calculateDuration()
    }

    console.log('📋 Loaded session summary:', sessionSummary.value)
  } else {
    selectedAppointment.value = null
    appointmentForm.value = {
      clientId: '',
      date: dateToInputString(date),
      time: time,
      price: 400,
      attended: false,
      paid: false,
      notes: ''
    }
    payments.value = []
  }

  showAppointmentDetailsDialog.value = true
}

const closeAppointmentDialog = () => {
  showAppointmentDetailsDialog.value = false
  selectedAppointment.value = null
  payments.value = []
  sessionSummary.value = {
    startTime: '',
    endTime: '',
    duration: null,
    category: null,
    notes: ''
  }
  showAddPaymentForm.value = false
  newPayment.value = {
    amount: 0,
    method: 'cash',
    notes: ''
  }
  appointmentFormRef.value?.reset()
}

const cancelAddPayment = () => {
  showAddPaymentForm.value = false
  newPayment.value = {
    amount: 0,
    method: 'cash',
    notes: ''
  }
}

const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    cash: 'מזומן',
    transfer: 'העברה',
    credit: 'אשראי',
    check: 'צ\'ק'
  }
  return labels[method] || method
}

const getPaymentMethodColorPastel = (method: string): string => {
  const colors: Record<string, string> = {
    cash: 'teal-lighten-4',
    transfer: 'blue-lighten-4',
    credit: 'purple-lighten-4',
    check: 'orange-lighten-4'
  }
  return colors[method] || 'grey-lighten-3'
}

const updateClientPrice = () => {
  const client = clients.value.find(c => c.id === appointmentForm.value.clientId)
  if (client) {
    appointmentForm.value.price = client.pricePerSession
  }
}

const addPayment = () => {
  if (newPayment.value.amount <= 0) {
    showSnackbar('סכום התשלום חייב להיות גדול מ-0', 'warning')
    return
  }

  payments.value.push({
    id: `payment_${Date.now()}`,
    amount: newPayment.value.amount,
    method: newPayment.value.method,
    date: new Date(),
    notes: newPayment.value.notes
  })

  // Reset form
  newPayment.value = {
    amount: 0,
    method: 'cash',
    notes: ''
  }

  // Update paid status
  appointmentForm.value.paid = isPaidInFull.value
}

const removePayment = (paymentId: string) => {
  const index = payments.value.findIndex(p => p.id === paymentId)
  if (index > -1) {
    payments.value.splice(index, 1)
  }
  // Update paid status
  appointmentForm.value.paid = isPaidInFull.value
}

const saveAppointment = async () => {
  const { valid } = await appointmentFormRef.value.validate()
  if (!valid) return

  savingAppointment.value = true
  try {
    const client = clients.value.find(c => c.id === appointmentForm.value.clientId)
    if (!client) return

    // יצירת תאריך מקומי נכון (לא UTC!)
    const appointmentDate = createLocalDate(appointmentForm.value.date)

    // Update paid status based on total payments
    appointmentForm.value.paid = isPaidInFull.value

    // Calculate correct session number (count only attended appointments)
    let sessionNumber = selectedAppointment.value?.sessionNumber
    if (!selectedAppointment.value) {
      // For new appointments, count only ATTENDED appointments for this client
      const clientAppointmentsQuery = query(
        collection(db, 'appointments'),
        where('clientId', '==', appointmentForm.value.clientId)
      )
      const clientAppointmentsSnapshot = await getDocs(clientAppointmentsQuery)
      // Count only attended appointments
      const attendedCount = clientAppointmentsSnapshot.docs.filter(
        doc => doc.data().attended === true
      ).length
      sessionNumber = attendedCount + 1
    }

    const appointmentData: any = {
      clientId: appointmentForm.value.clientId,
      clientName: client.name,
      date: appointmentDate,
      time: appointmentForm.value.time,
      price: appointmentForm.value.price,
      attended: appointmentForm.value.attended,
      paid: appointmentForm.value.paid,
      payments: payments.value.map(p => ({
        id: p.id,
        amount: p.amount,
        method: p.method,
        date: p.date,
        notes: p.notes
      })),
      sessionNumber: sessionNumber,
      notes: appointmentForm.value.notes || ''
    }

    // Add session summary if attended
    if (appointmentForm.value.attended) {
      appointmentData.startTime = sessionSummary.value.startTime || null
      appointmentData.endTime = sessionSummary.value.endTime || null
      appointmentData.duration = sessionSummary.value.duration || null
      appointmentData.durationCategory = sessionSummary.value.category || null
      appointmentData.sessionSummaryNotes = sessionSummary.value.notes || null

      console.log('💾 Saving session summary:', {
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        duration: appointmentData.duration,
        category: appointmentData.durationCategory,
        notes: appointmentData.sessionSummaryNotes
      })
    } else {
      // Clear session summary if not attended
      appointmentData.startTime = null
      appointmentData.endTime = null
      appointmentData.duration = null
      appointmentData.durationCategory = null
      appointmentData.sessionSummaryNotes = null
    }

    if (selectedAppointment.value) {
      await updateDoc(doc(db, 'appointments', selectedAppointment.value.id), appointmentData)
      showSnackbar('הפגישה עודכנה בהצלחה', 'success')
    } else {
      await addDoc(collection(db, 'appointments'), appointmentData)
      showSnackbar('הפגישה נוספה בהצלחה', 'success')
    }

    // Update client balance and session count (only if attended)
    const updateData: any = {}

    // Only update balance if client attended
    if (appointmentForm.value.attended) {
      const balanceChange = totalPaid.value - appointmentForm.value.price
      updateData.balance = client.balance + balanceChange
    } else if (selectedAppointment.value?.attended && !appointmentForm.value.attended) {
      // Client was marked as attended before but now not - reverse the balance
      const previousPaid = selectedAppointment.value.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const balanceChange = previousPaid - selectedAppointment.value.price
      updateData.balance = client.balance - balanceChange
    }

    // Update totalSessions only when marking as attended for the first time
    if (appointmentForm.value.attended && !selectedAppointment.value?.attended) {
      updateData.totalSessions = client.totalSessions + 1
    } else if (selectedAppointment.value?.attended && !appointmentForm.value.attended) {
      // Was attended before but now not - decrease session count
      updateData.totalSessions = Math.max(0, client.totalSessions - 1)
    }

    if (Object.keys(updateData).length > 0) {
      await updateDoc(doc(db, 'clients', client.id), updateData)
    }

    await loadAppointments()
    await loadClients() // Reload to see updated balance

    // Recalculate weekly target (in case price changed or appointment was added/removed)
    await updateWeeklyTargetFromAppointments()

    await updateWeeklyPrizeActual() // Update weekly prize actual amount
    closeAppointmentDialog()
  } catch (error) {
    console.error('Error saving appointment:', error)
    showSnackbar('שגיאה בשמירת הפגישה: ' + error, 'error')
  } finally {
    savingAppointment.value = false
  }
}

const updateWeeklyPrizeActual = async () => {
  try {
    const weekStart = getWeekStart(new Date())
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // Get current week's prize
    const prizeQuery = query(
      collection(db, 'weekly_prizes'),
      where('weekStart', '>=', weekStart),
      where('weekStart', '<', weekEnd)
    )
    const prizeSnapshot = await getDocs(prizeQuery)

    if (prizeSnapshot.empty) return

    // Calculate total paid this week
    let totalPaid = 0
    appointments.value.forEach(appointment => {
      if (appointment.payments && Array.isArray(appointment.payments)) {
        appointment.payments.forEach(payment => {
          totalPaid += payment.amount || 0
        })
      }
    })

    // Update prize with actual amount
    const prizeDoc = prizeSnapshot.docs[0]
    await updateDoc(doc(db, 'weekly_prizes', prizeDoc.id), {
      weeklyActual: totalPaid
    })
  } catch (error) {
    console.error('Error updating weekly prize actual:', error)
  }
}

// Helper: Recalculate client balance from all appointments
const recalculateClientBalance = async (clientId: string) => {
  try {
    const client = clients.value.find(c => c.id === clientId)
    if (!client) return

    // Get all appointments for this client where they attended
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('clientId', '==', clientId)
    )
    const appointmentsSnapshot = await getDocs(appointmentsQuery)

    let totalOwed = 0
    let totalPaid = 0
    let sessionsAttended = 0

    appointmentsSnapshot.forEach(docSnap => {
      const apt = docSnap.data()
      if (apt.attended) {
        totalOwed += apt.price || 0
        const paidForApt = apt.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
        totalPaid += paidForApt
        sessionsAttended++
      }
    })

    const balance = totalPaid - totalOwed

    await updateDoc(doc(db, 'clients', clientId), {
      balance: balance,
      totalSessions: sessionsAttended
    })

    console.log(`✅ Recalculated balance for ${client.name}: owed=${totalOwed}, paid=${totalPaid}, balance=${balance}`)
  } catch (error) {
    console.error('Error recalculating balance:', error)
  }
}

const confirmDeleteAppointment = async () => {
  if (!selectedAppointment.value) return

  try {
    const appointment = selectedAppointment.value

    // Update client balance if appointment was attended
    if (appointment.attended) {
      const client = clients.value.find(c => c.id === appointment.clientId)
      if (client) {
        const totalPaid = appointment.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
        const balanceChange = totalPaid - appointment.price

        await updateDoc(doc(db, 'clients', client.id), {
          balance: client.balance - balanceChange,
          totalSessions: Math.max(0, client.totalSessions - 1)
        })
      }
    }

    await deleteDoc(doc(db, 'appointments', appointment.id))
    showSnackbar('הפגישה נמחקה בהצלחה', 'success')
    closeAppointmentDialog()
    await loadAppointments()
    await loadClients() // Reload to see updated balance

    // Recalculate weekly target from remaining appointments
    await updateWeeklyTargetFromAppointments()

    await updateWeeklyPrizeActual() // Update weekly prize actual amount
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
}

.weekly-table thead tr,
.weekly-table tbody tr {
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
  margin-bottom: 4px;
  color: #1e3a5f;
}

.appointment-session-number {
  font-size: 0.75rem;
  color: #607D8B;
  margin-bottom: 8px;
  font-weight: 500;
  opacity: 0.85;
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

/* Payment Cards */
.payment-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.payment-card:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15) !important;
  border-color: rgba(25, 118, 210, 0.4);
}

.new-payment-card {
  border: 2px solid rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
}

.new-payment-card:hover {
  border-color: rgba(25, 118, 210, 0.5);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}

/* Clean Payment Styles */
.payment-card-clean {
  background: #FAFBFC;
  border: 1px solid #E0E0E0;
  transition: all 0.2s ease;
}

.payment-card-clean:hover {
  background: #F5F7FA;
  border-color: #B0BEC5;
}

.payment-chip-pastel {
  font-weight: 500;
  font-size: 0.75rem;
}

.new-payment-card-clean {
  background: #F5F7FA;
  border: 1px solid #CFD8DC;
  margin-top: 12px;
}

.add-payment-btn {
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}

.gap-3 {
  gap: 12px;
}

/* Section Header Clean */
.section-header-clean {
  color: #455A64;
  background: linear-gradient(to bottom, #F5F7FA 0%, #FFFFFF 100%);
  border-bottom: 1px solid #E0E0E0;
  font-weight: 600;
}
</style>

