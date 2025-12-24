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

    <!-- Admin Tools - Recalculate Balances -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" variant="tonal" color="warning">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <strong>🔧 כלי תיקון:</strong> חישוב מחדש של חובות כל הלקוחות על בסיס פגישות בפועל
            </div>
            <v-btn
              color="warning"
              rounded="xl"
              variant="elevated"
              @click="recalculateAllClientBalances"
            >
              <v-icon icon="mdi-calculator" />
              חשב מחדש חובות
            </v-btn>
            <v-btn
              color="error"
              rounded="xl"
              variant="elevated"
              @click="fixZeroPriceAppointments"
            >
              <v-icon icon="mdi-wrench" />
              תקן מחירים 0
            </v-btn>
          </v-card-text>
        </v-card>
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
                    'paid': getAppointment(day.date, time)?.paid,
                    'group-session': getAppointment(day.date, time)?.isGroup
                  }"
                >
                  <!-- Group Session Display -->
                  <div v-if="getAppointment(day.date, time)?.isGroup" class="group-appointment">
                    <div class="appointment-name d-flex align-center">
                      <v-icon icon="mdi-account-group" size="small" color="primary" class="ml-1" />
                      קבוצה טיפולית
                    </div>
                    <div class="appointment-session-number">
                      {{ getAppointment(day.date, time)?.groupParticipants?.length || 0 }} משתתפים
                    </div>
                    <div class="appointment-details">
                      <v-chip
                        size="x-small"
                        color="primary"
                        variant="tonal"
                      >
                        ₪{{ getAppointment(day.date, time)?.groupPrice }} למשתתף
                      </v-chip>
                    </div>
                  </div>

                  <!-- Regular Appointment Display -->
                  <div v-else>
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
                <div class="d-flex gap-3 mb-3">
                  <v-btn
                    color="primary"
                    size="small"
                    rounded="lg"
                    variant="flat"
                    @click="addTemplateSlot(day.index)"
                    class="ml-2"
                  >
                    <v-icon icon="mdi-plus" size="small" />
                    הוסף שעה
                  </v-btn>
                  <v-btn
                    color="secondary"
                    size="small"
                    rounded="lg"
                    variant="outlined"
                    @click="sortTemplateSlots"
                  >
                    <v-icon icon="mdi-sort-clock-ascending" size="small" />
                    מיין לפי שעה
                  </v-btn>
                </div>

                <v-row
                  v-for="(slot, idx) in getTemplateSlotsForDay(day.index)"
                  :key="slot.id"
                  class="mb-2 template-slot-row"
                  align="center"
                >
                  <!-- שעה -->
                  <v-col cols="2">
                    <v-text-field
                      v-model="slot.time"
                      label="שעה"
                      type="time"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>

                  <!-- קבוצה טיפולית -->
                  <template v-if="slot.isGroup">
                    <v-col cols="2">
                      <v-switch
                        v-model="slot.isGroup"
                        label="קבוצה"
                        color="primary"
                        density="compact"
                        hide-details
                        :true-icon="'mdi-account-group'"
                      />
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        v-model.number="slot.groupPrice"
                        label="מחיר"
                        type="number"
                        variant="outlined"
                        density="compact"
                        hide-details
                        prefix="₪"
                      />
                    </v-col>
                    <v-col cols="5">
                      <v-autocomplete
                        v-model="slot.groupParticipantIds"
                        label="משתתפים"
                        :items="clientOptions"
                        item-title="name"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        multiple
                        chips
                        clearable
                        hide-details
                        placeholder="בחר משתתפים..."
                      >
                        <template #prepend-inner>
                          <v-icon icon="mdi-account-group" color="primary" size="small" />
                        </template>
                        <template #chip="{ props, item }">
                          <v-chip
                            v-bind="props"
                            size="small"
                            closable
                            color="primary"
                            variant="tonal"
                          >
                            {{ item.title }}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </template>

                  <!-- פגישה רגילה -->
                  <template v-else>
                    <v-col cols="9">
                      <v-row align="center" no-gutters>
                        <v-col cols="3">
                          <v-switch
                            v-model="slot.isGroup"
                            label="קבוצה"
                            color="primary"
                            density="compact"
                            hide-details
                          />
                        </v-col>
                        <v-col cols="9">
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
                            placeholder="בחר לקוחות..."
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
                      </v-row>
                    </v-col>
                  </template>

                  <!-- כפתור מחיקה -->
                  <v-col cols="1" class="d-flex justify-center">
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

              <!-- Toggle for Group Session -->
              <v-switch
                v-model="appointmentForm.isGroup"
                color="primary"
                density="compact"
                class="mb-4"
                hide-details
                :disabled="!!selectedAppointment"
              >
                <template #label>
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-account-group" size="small" class="ml-2" />
                    <span class="font-weight-medium">קבוצה טיפולית</span>
                  </div>
                </template>
              </v-switch>

              <!-- Regular Appointment Fields -->
              <v-select
                v-if="!appointmentForm.isGroup"
                v-model="appointmentForm.clientId"
                label="בחר לקוח *"
                :items="clientOptions"
                item-title="name"
                item-value="id"
                variant="outlined"
                rounded="lg"
                :rules="appointmentForm.isGroup ? [] : [rules.required]"
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

              <!-- Group Appointment Fields -->
              <div v-if="appointmentForm.isGroup">
                <v-text-field
                  v-model.number="appointmentForm.groupPrice"
                  label="מחיר למשתתף *"
                  type="number"
                  variant="outlined"
                  rounded="lg"
                  prefix="₪"
                  class="mb-4"
                  hide-details
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-cash" color="primary" />
                  </template>
                </v-text-field>

                <v-autocomplete
                  v-model="appointmentForm.groupParticipantIds"
                  label="בחר משתתפים *"
                  :items="clientOptions"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  rounded="lg"
                  multiple
                  chips
                  closable-chips
                  class="mb-4"
                  hide-details
                >
                  <template #prepend-inner>
                    <v-icon icon="mdi-account-multiple" color="primary" />
                  </template>
                </v-autocomplete>
              </div>

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
                v-if="!appointmentForm.isGroup"
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

    <!-- Group Session Dialog -->
    <v-dialog
      v-model="showGroupDialog"
      max-width="800"
      @click:outside="closeGroupDialog"
    >
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-account-group" size="24" color="primary" style="opacity: 0.8;" />
          <span class="text-h6">ניהול קבוצה טיפולית</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-alert type="info" variant="tonal" class="mb-4">
            <div class="text-body-2">
              <strong>{{ groupForm.date }} | {{ groupForm.time }}</strong>
            </div>
            <div class="text-body-2 mt-1">
              מחיר למשתתף: <strong>₪{{ groupForm.groupPrice }}</strong>
            </div>
          </v-alert>

          <!-- Add one-time participant -->
          <v-card variant="outlined" class="mb-4" rounded="lg">
            <v-card-text>
              <h4 class="text-subtitle-2 font-weight-bold mb-3">
                <v-icon icon="mdi-account-plus" size="small" />
                הוסף משתתף חד-פעמי
              </h4>
              <v-row>
                <v-col cols="10">
                  <v-autocomplete
                    v-model="oneTimeParticipant"
                    label="בחר לקוח"
                    :items="availableClientsForGroup"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    clearable
                    placeholder="הקלד לחיפוש..."
                  />
                </v-col>
                <v-col cols="2" class="d-flex align-center">
                  <v-btn
                    color="primary"
                    icon="mdi-plus"
                    :disabled="!oneTimeParticipant"
                    @click="addOneTimeParticipant"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Participants List -->
          <h4 class="text-subtitle-1 font-weight-bold mb-3">
            משתתפים ({{ groupParticipants.length }})
          </h4>

          <div>
            <v-card
              v-for="(participant, idx) in groupParticipants"
              :key="participant.clientId"
              class="mb-3 pa-4"
              rounded="lg"
              variant="outlined"
              :style="{
                border: '2px solid #e0e0e0',
                background: participant.attended ? 'rgba(76, 175, 80, 0.05)' : 'white'
              }"
            >
              <!-- Header -->
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center gap-3">
                  <v-avatar :color="participant.isRegular ? 'primary' : 'grey'" size="40">
                    <v-icon :icon="participant.isRegular ? 'mdi-account-star' : 'mdi-account'" />
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-h6">
                      {{ participant.clientName }}
                      <v-chip
                        v-if="participant.isRegular"
                        size="x-small"
                        color="primary"
                        variant="tonal"
                        class="mr-2"
                      >
                        קבוע
                      </v-chip>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-column gap-2">
                  <v-btn
                    v-if="participant.attended"
                    size="small"
                    color="primary"
                    variant="tonal"
                    @click="openParticipantPayment(idx)"
                  >
                    <v-icon icon="mdi-cash-plus" size="small" />
                    הוסף תשלום
                  </v-btn>
                  <v-btn
                    v-if="!participant.isRegular"
                    size="small"
                    color="error"
                    variant="text"
                    icon="mdi-delete"
                    @click="removeParticipant(idx)"
                  />
                </div>
              </div>

              <!-- Status Chips -->
              <div class="d-flex gap-2 mb-3">
                <v-chip
                  size="small"
                  :color="participant.attended ? 'success' : 'grey'"
                  @click="toggleParticipantAttendance(idx)"
                  style="cursor: pointer;"
                >
                  <v-icon :icon="participant.attended ? 'mdi-check-circle' : 'mdi-circle-outline'" size="small" start />
                  {{ participant.attended ? 'הגיע' : 'לא הגיע' }}
                </v-chip>

                <v-chip
                  v-if="participant.attended"
                  size="small"
                  :color="getParticipantPaymentColor(participant)"
                >
                  {{ getParticipantPaymentText(participant) }}
                </v-chip>
              </div>

              <!-- Payments List -->
              <div v-if="participant.attended && participant.payments && participant.payments.length > 0" class="mt-3" style="background: #f9f9f9; padding: 12px; border-radius: 8px;">
                <div class="text-caption font-weight-bold mb-2" style="color: #2E7D32;">
                  תשלומים:
                </div>
                <v-card
                    v-for="(payment, payIdx) in participant.payments"
                    :key="payment.id"
                    variant="outlined"
                    class="mb-2 pa-3"
                    rounded="lg"
                    style="border: 2px solid #4CAF50;"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center gap-2">
                        <v-icon :icon="getPaymentMethodIcon(payment.method)" color="success" size="small" />
                        <div>
                          <div class="font-weight-bold text-success">₪{{ payment.amount }}</div>
                          <div class="text-caption text-medium-emphasis">{{ getPaymentMethodLabel(payment.method) }}</div>
                        </div>
                      </div>
                      <div class="d-flex gap-1">
                        <v-btn
                          size="x-small"
                          color="primary"
                          variant="text"
                          icon="mdi-pencil"
                          @click="editParticipantPayment(idx, payIdx)"
                        />
                        <v-btn
                          size="x-small"
                          color="error"
                          variant="text"
                          icon="mdi-delete"
                          @click="removeParticipantPayment(idx, payIdx)"
                        />
                      </div>
                    </div>
                    <div v-if="payment.notes" class="text-caption text-medium-emphasis mt-1">
                      {{ payment.notes }}
                    </div>
                  </v-card>
              </div>
            </v-card>
          </div>

          <!-- Summary -->
          <v-card variant="tonal" color="primary" class="mt-4" rounded="lg">
            <v-card-text>
              <div class="text-body-1">
                <strong>סיכום:</strong>
              </div>
              <div class="text-body-2 mt-2">
                משתתפים שהגיעו: <strong>{{ attendedCount }}</strong> / {{ groupParticipants.length }}
              </div>
              <div class="text-body-2">
                הכנסה צפויה: <strong>₪{{ (attendedCount * groupForm.groupPrice).toLocaleString() }}</strong>
              </div>
              <div class="text-body-2">
                שולם בפועל: <strong>₪{{ totalGroupPaid.toLocaleString() }}</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="error"
            variant="outlined"
            rounded="xl"
            @click="confirmDeleteGroupSession"
          >
            <v-icon icon="mdi-delete" />
            מחק קבוצה
          </v-btn>
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            @click="closeGroupDialog"
          >
            ביטול
          </v-btn>
          <v-btn
            color="primary"
            rounded="xl"
            variant="elevated"
            :loading="savingAppointment"
            @click="saveGroupSession"
          >
            <v-icon icon="mdi-content-save" />
            שמור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Participant Payment Dialog -->
    <v-dialog v-model="showParticipantPaymentDialog" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right">
          <v-icon icon="mdi-cash-plus" />
          תשלום - {{ selectedParticipant?.clientName }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-text-field
            v-model.number="participantPaymentForm.amount"
            label="סכום"
            type="number"
            variant="outlined"
            rounded="lg"
            prefix="₪"
            class="mb-4"
          />
          <v-select
            v-model="participantPaymentForm.method"
            label="אמצעי תשלום"
            :items="paymentMethods"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          />
          <v-textarea
            v-model="participantPaymentForm.notes"
            label="הערות"
            variant="outlined"
            rounded="lg"
            rows="2"
          />
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="outlined" rounded="xl" @click="closeParticipantPaymentDialog">
            ביטול
          </v-btn>
          <v-btn color="primary" rounded="xl" @click="addParticipantPayment">
            <v-icon icon="mdi-check" />
            הוסף
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
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy as firestoreOrderBy } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import type { Client, Appointment, ScheduleSlot } from '@/types/manage'

// State
const clients = ref<Client[]>([])
const appointments = ref<Appointment[]>([])
const templateSlots = ref<ScheduleSlot[]>([])
const currentWeekStart = ref(getWeekStart(new Date()))
const currentUser = computed(() => auth.currentUser)
const showTemplateDialog = ref(false)
const showAppointmentDetailsDialog = ref(false)
const showAddAppointmentDialog = ref(false)
const showAddClientQuick = ref(false)
const showAddPaymentForm = ref(false)
const showGroupDialog = ref(false)
const showParticipantPaymentDialog = ref(false)
const showAdminTools = ref(false) // הושבת לצמיתות - גרם לאיבוד נתונים
const selectedAppointment = ref<Appointment | null>(null)
const savingTemplate = ref(false)
const savingAppointment = ref(false)
const appointmentFormRef = ref()
const oneTimeParticipant = ref('')
const selectedParticipantIndex = ref<number | null>(null)

const appointmentForm = ref({
  clientId: '',
  date: '',
  time: '',
  price: 400,
  attended: false,
  paid: false,
  notes: '',
  isGroup: false,
  groupPrice: 250,
  groupParticipantIds: [] as string[]
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

const groupForm = ref({
  date: '',
  time: '',
  groupPrice: 250
})

const groupParticipants = ref<Array<{
  clientId: string
  clientName: string
  attended: boolean
  payments: Array<{
    id: string
    amount: number
    method: 'cash' | 'transfer' | 'credit' | 'check'
    date: Date
    notes: string
  }>
  isRegular: boolean
}>>([])

const participantPaymentForm = ref({
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

// Group session computed properties
const availableClientsForGroup = computed(() => {
  const participantIds = groupParticipants.value.map(p => p.clientId)
  return clientOptions.value.filter(c => !participantIds.includes(c.id))
})

const attendedCount = computed(() => {
  return groupParticipants.value.filter(p => p.attended).length
})

const totalGroupPaid = computed(() => {
  return groupParticipants.value.reduce((sum, p) => {
    const participantTotal = p.payments.reduce((pSum, payment) => pSum + payment.amount, 0)
    return sum + participantTotal
  }, 0)
})

const selectedParticipant = computed(() => {
  if (selectedParticipantIndex.value === null) return null
  return groupParticipants.value[selectedParticipantIndex.value]
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
        paymentMethod: data.paymentMethod,
        // Session summary fields
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        durationCategory: data.durationCategory,
        sessionSummaryNotes: data.sessionSummaryNotes,
        // Group session fields
        isGroup: data.isGroup || false,
        groupPrice: data.groupPrice,
        groupParticipants: data.groupParticipants || []
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

      // Check if it's a group session
      if (data.isGroup) {
        return {
          id: doc.id,
          dayOfWeek: data.dayOfWeek,
          time: data.time,
          isGroup: true,
          groupPrice: data.groupPrice || 250,
          groupParticipantIds: data.groupParticipantIds || [],
          groupParticipantNames: data.groupParticipantNames || [],
          defaultClientIds: [],
          defaultClientNames: []
        } as ScheduleSlot
      }

      // Support both old (single client) and new (multiple clients) format
      if (data.defaultClientIds && Array.isArray(data.defaultClientIds)) {
        // New format
        return {
          id: doc.id,
          dayOfWeek: data.dayOfWeek,
          time: data.time,
          isGroup: false,
          defaultClientIds: data.defaultClientIds,
          defaultClientNames: data.defaultClientNames || [],
          groupParticipantIds: [],
          groupParticipantNames: []
        } as ScheduleSlot
      } else {
        // Old format - convert to new
        return {
          id: doc.id,
          dayOfWeek: data.dayOfWeek,
          time: data.time,
          isGroup: false,
          defaultClientIds: data.defaultClientId ? [data.defaultClientId] : [],
          defaultClientNames: data.defaultClientName ? [data.defaultClientName] : [],
          groupParticipantIds: [],
          groupParticipantNames: []
        } as ScheduleSlot
      }
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

// חישוב מספר פגישה דינמי לפי כל הפגישות שנקבעו עד תאריך זה
const getDisplaySessionNumber = (appointment: Appointment | undefined): number => {
  if (!appointment || !appointment.clientId) return 1

  // Count ALL appointments for this client BEFORE OR AT this date/time
  const appointmentsBefore = appointments.value.filter(apt => {
    // Skip if not the same client
    if (apt.clientId !== appointment.clientId) return false

    // Skip if it's the exact same appointment
    if (apt.id === appointment.id) return false

    const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date)
    const currentDate = appointment.date instanceof Date ? appointment.date : new Date(appointment.date)

    // Include appointments before this date
    if (aptDate < currentDate) return true

    // For same date, include only earlier times
    if (isSameDay(aptDate, currentDate) && apt.time < appointment.time) return true

    return false
  }).length

  return appointmentsBefore + 1
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
    defaultClientNames: [],
    isGroup: false,
    groupPrice: 250,
    groupParticipantIds: [],
    groupParticipantNames: []
  }
  templateSlots.value.push(newSlot)
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
        if (slot.isGroup) {
          // Group session - save participant names
          const participantNames = (slot.groupParticipantIds || []).map(clientId => {
            const client = clients.value.find(c => c.id === clientId)
            return client ? client.name : ''
          }).filter(name => name !== '')

          await addDoc(collection(db, 'schedule_template'), {
            dayOfWeek: slot.dayOfWeek,
            time: slot.time,
            isGroup: true,
            groupPrice: slot.groupPrice || 250,
            groupParticipantIds: slot.groupParticipantIds || [],
            groupParticipantNames: participantNames,
            // Keep empty for backward compatibility
            defaultClientIds: [],
            defaultClientNames: []
          })
        } else {
          // Regular appointment - save client names
          const clientNames = (slot.defaultClientIds || []).map(clientId => {
            const client = clients.value.find(c => c.id === clientId)
            return client ? client.name : ''
          }).filter(name => name !== '')

          await addDoc(collection(db, 'schedule_template'), {
            dayOfWeek: slot.dayOfWeek,
            time: slot.time,
            isGroup: false,
            defaultClientIds: slot.defaultClientIds || [],
            defaultClientNames: clientNames
          })
        }
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

// כלי מנהל: מצא ומחק פגישות כפולות
const findAndRemoveDuplicates = async () => {
  try {
    const appointmentsQuery = query(collection(db, 'appointments'))
    const snapshot = await getDocs(appointmentsQuery)

    const allAppointments: any[] = []
    snapshot.forEach(doc => {
      allAppointments.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log(`📊 Total appointments in DB: ${allAppointments.length}`)

    // Map: "clientId-date-time" -> array of appointment IDs
    const duplicateMap = new Map<string, any[]>()

    allAppointments.forEach(apt => {
      // Skip group appointments from duplicate check
      if (apt.isGroup) return

      const dateStr = apt.date instanceof Date
        ? apt.date.toISOString().split('T')[0]
        : new Date(apt.date.seconds * 1000).toISOString().split('T')[0]

      const key = `${apt.clientId}-${dateStr}-${apt.time}`

      if (!duplicateMap.has(key)) {
        duplicateMap.set(key, [])
      }
      duplicateMap.get(key)!.push(apt)
    })

    // Find duplicates (keys with more than 1 appointment)
    const duplicates: any[] = []
    duplicateMap.forEach((apts, key) => {
      if (apts.length > 1) {
        duplicates.push({ key, appointments: apts })
      }
    })

    if (duplicates.length === 0) {
      showSnackbar('✅ לא נמצאו פגישות כפולות!', 'success')
      console.log('✅ No duplicates found')
      return
    }

    console.log(`⚠️ Found ${duplicates.length} sets of duplicates:`)

    let deletedCount = 0

    // For each set of duplicates, keep the first one and delete the rest
    for (const dup of duplicates) {
      console.log(`Duplicate set for ${dup.key}:`, dup.appointments.map((a: any) => a.id))

      // Sort by creation time if available, otherwise keep first
      const sorted = dup.appointments.sort((a: any, b: any) => {
        if (a.createdAt && b.createdAt) {
          const aTime = a.createdAt.seconds || 0
          const bTime = b.createdAt.seconds || 0
          return aTime - bTime
        }
        return 0
      })

      // Keep first, delete rest
      for (let i = 1; i < sorted.length; i++) {
        await deleteDoc(doc(db, 'appointments', sorted[i].id))
        deletedCount++
        console.log(`  🗑️ Deleted duplicate: ${sorted[i].id}`)
      }
    }

    showSnackbar(`✅ נמחקו ${deletedCount} פגישות כפולות!`, 'success')
    console.log(`✅ Deleted ${deletedCount} duplicate appointments`)

    // Reload data
    await loadData()
  } catch (error) {
    console.error('❌ Error removing duplicates:', error)
    showSnackbar('שגיאה במחיקת כפילויות', 'error')
  }
}

// כלי מנהל: מחק פגישות עתידיות (מ-28/12/2024 והלאה)
const deleteFutureAppointments = async () => {
  const confirmed = confirm('⚠️ האם את בטוחה שאת רוצה למחוק את כל הפגישות מ-28/12/2024 והלאה?\n\nזה ימחק את כל הפגישות העתידיות, אבל לא יגע בפגישות של השבוע הנוכחי.')

  if (!confirmed) return

  try {
    // Set cutoff date to 28/12/2024 at 00:00:00
    const cutoffDate = new Date(2024, 11, 28) // Month is 0-indexed (11 = December)
    cutoffDate.setHours(0, 0, 0, 0)

    console.log(`🗑️ Deleting appointments from ${cutoffDate.toLocaleDateString('he-IL')} onwards...`)
    console.log('Cutoff timestamp:', cutoffDate.getTime())

    // Get all appointments
    const appointmentsQuery = query(collection(db, 'appointments'))
    const snapshot = await getDocs(appointmentsQuery)

    let deletedCount = 0
    const toDelete: Array<{ id: string; name: string; date: string; time: string }> = []

    snapshot.forEach(docSnap => {
      try {
        const apt = docSnap.data()

        // Convert Firebase timestamp to Date
        let aptDate: Date
        if (apt.date instanceof Date) {
          aptDate = apt.date
        } else if (apt.date?.seconds) {
          aptDate = new Date(apt.date.seconds * 1000)
        } else if (typeof apt.date === 'string') {
          aptDate = new Date(apt.date)
        } else {
          console.warn('Unknown date format:', apt.date)
          return
        }

        aptDate.setHours(0, 0, 0, 0) // Normalize to midnight for comparison

        console.log(`Checking: ${apt.clientName || 'קבוצה'} - ${aptDate.toLocaleDateString('he-IL')} (${aptDate.getTime()})`)

        // Delete if date is >= cutoff date
        if (aptDate >= cutoffDate) {
          toDelete.push({
            id: docSnap.id,
            name: apt.clientName || 'קבוצה טיפולית',
            date: aptDate.toLocaleDateString('he-IL'),
            time: apt.time || ''
          })
        }
      } catch (err) {
        console.error('Error processing appointment:', docSnap.id, err)
      }
    })

    console.log(`⚠️ Found ${toDelete.length} appointments to delete:`)
    toDelete.forEach(apt => {
      console.log(`  📌 ${apt.name} - ${apt.date} ${apt.time}`)
    })

    if (toDelete.length === 0) {
      showSnackbar('לא נמצאו פגישות עתידיות למחיקה', 'info')
      return
    }

    // Delete appointments
    for (const apt of toDelete) {
      await deleteDoc(doc(db, 'appointments', apt.id))
      deletedCount++
      console.log(`  🗑️ Deleted: ${apt.name} - ${apt.date} ${apt.time}`)
    }

    showSnackbar(`✅ נמחקו ${deletedCount} פגישות עתידיות!`, 'success')
    console.log(`✅ Deleted ${deletedCount} future appointments`)

    // Reload data
    await loadData()
  } catch (error) {
    console.error('❌ Error deleting future appointments:', error)
    showSnackbar(`שגיאה במחיקת פגישות עתידיות: ${error}`, 'error')
  }
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
        // Check if this is a group session
        if (slot.isGroup) {
          // Check if a group appointment already exists at this time
          const dayStart = new Date(day.date)
          dayStart.setHours(0, 0, 0, 0)
          const dayEnd = new Date(day.date)
          dayEnd.setHours(23, 59, 59, 999)

          const existingGroupQuery = query(
            collection(db, 'appointments'),
            where('date', '>=', dayStart),
            where('date', '<=', dayEnd),
            where('time', '==', slot.time),
            where('isGroup', '==', true)
          )
          const existingGroupSnapshot = await getDocs(existingGroupQuery)

          if (!existingGroupSnapshot.empty) {
            console.log(`⏭️ Skip group session - already exists at ${slot.time}`)
            continue
          }

          // Create group appointment with regular participants
          const appointmentDate = new Date(day.date)
          appointmentDate.setHours(0, 0, 0, 0)

          const groupParticipants: any[] = (slot.groupParticipantIds || []).map(participantId => {
            const client = clients.value.find(c => c.id === participantId)
            return client ? {
              clientId: client.id,
              clientName: client.name,
              attended: false,
              payments: [],
              isRegular: true
            } : null
          }).filter(p => p !== null)

          const groupAppointmentData = {
            clientId: 'group', // Special marker for group sessions
            clientName: 'קבוצה טיפולית',
            date: appointmentDate,
            time: slot.time,
            price: (slot.groupPrice || 250) * groupParticipants.length, // Total expected income
            attended: false,
            paid: false,
            payments: [],
            sessionNumber: 1,
            notes: '',
            isGroup: true,
            groupPrice: slot.groupPrice || 250,
            groupParticipants: groupParticipants
          }

          await addDoc(collection(db, 'appointments'), groupAppointmentData)
          addedCount++
          console.log(`✅ Added group session at ${slot.time} with ${groupParticipants.length} participants`)
        } else {
          // Regular appointment logic (existing code)
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

const recalculateAllClientBalances = async () => {
  if (!confirm('🔄 לחשב מחדש את כל החובות?\n\nזה יחשב מחדש את החוב של כל לקוח על בסיס הפגישות בפועל.\n\nהאם להמשיך?')) {
    return
  }

  try {
    console.log('🔄 מתחיל חישוב מחדש של חובות...')

    // Get all appointments
    const allAppointmentsQuery = query(collection(db, 'appointments'))
    const allAppointmentsSnap = await getDocs(allAppointmentsQuery)

    // Calculate balance for each client
    const clientBalances: Record<string, { balance: number, sessions: number }> = {}

    allAppointmentsSnap.forEach(docSnap => {
      const apt = docSnap.data()

      // Regular appointment
      if (apt.clientId && apt.clientId !== 'group' && apt.attended) {
        if (!clientBalances[apt.clientId]) {
          clientBalances[apt.clientId] = { balance: 0, sessions: 0 }
        }

        const paid = apt.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
        const price = apt.price || 0
        clientBalances[apt.clientId].balance += (paid - price)
        clientBalances[apt.clientId].sessions += 1
      }

      // Group appointment participants
      if (apt.isGroup && apt.groupParticipants && Array.isArray(apt.groupParticipants)) {
        apt.groupParticipants.forEach((p: any) => {
          if (p.attended) {
            if (!clientBalances[p.clientId]) {
              clientBalances[p.clientId] = { balance: 0, sessions: 0 }
            }

            const paid = p.payments?.reduce((sum: number, pay: any) => sum + (pay.amount || 0), 0) || 0
            const price = apt.groupPrice || 0
            clientBalances[p.clientId].balance += (paid - price)
            clientBalances[p.clientId].sessions += 1
          }
        })
      }
    })

    // Update all clients
    const updatePromises = Object.entries(clientBalances).map(([clientId, data]) => {
      console.log(`  ✅ ${clientId}: balance=${data.balance}, sessions=${data.sessions}`)
      return updateDoc(doc(db, 'clients', clientId), {
        balance: data.balance,
        totalSessions: data.sessions
      })
    })

    // Also reset clients with no appointments to 0
    const clientsWithNoAppointments = clients.value.filter(c => !clientBalances[c.id])
    clientsWithNoAppointments.forEach(c => {
      if (c.balance !== 0 || c.totalSessions !== 0) {
        console.log(`  🔄 ${c.name}: resetting to 0`)
        updatePromises.push(updateDoc(doc(db, 'clients', c.id), {
          balance: 0,
          totalSessions: 0
        }))
      }
    })

    await Promise.all(updatePromises)
    await loadClients()

    showSnackbar(`✅ חושב מחדש! עודכנו ${Object.keys(clientBalances).length} לקוחות`, 'success')
    console.log('✅ חישוב מחדש הושלם!')
  } catch (error) {
    console.error('❌ שגיאה בחישוב מחדש:', error)
    showSnackbar('שגיאה בחישוב מחדש', 'error')
  }
}

const fixZeroPriceAppointments = async () => {
  if (!confirm('🔧 לתקן פגישות עם מחיר 0?\n\nזה יעדכן את כל הפגישות עם מחיר 0 למחיר ברירת המחדל של הלקוח (או 400 ₪).\n\nהאם להמשיך?')) {
    return
  }

  try {
    console.log('🔧 מתחיל תיקון פגישות עם מחיר 0...')

    // Get all appointments with price = 0
    const allAppointmentsQuery = query(
      collection(db, 'appointments'),
      where('price', '==', 0)
    )
    const allAppointmentsSnap = await getDocs(allAppointmentsQuery)

    console.log(`📋 נמצאו ${allAppointmentsSnap.size} פגישות עם מחיר 0`)

    let fixedCount = 0
    const updatePromises: Promise<any>[] = []

    allAppointmentsSnap.forEach(docSnap => {
      const apt = docSnap.data()
      const client = clients.value.find(c => c.id === apt.clientId)
      const correctPrice = client?.defaultPrice || 400

      console.log(`  🔧 ${apt.clientName}: 0 → ${correctPrice}`)

      updatePromises.push(
        updateDoc(doc(db, 'appointments', docSnap.id), {
          price: correctPrice
        })
      )
      fixedCount++
    })

    await Promise.all(updatePromises)
    await loadAppointments()

    showSnackbar(`✅ תוקנו ${fixedCount} פגישות!`, 'success')
    console.log('✅ תיקון הושלם!')
  } catch (error) {
    console.error('❌ שגיאה בתיקון:', error)
    showSnackbar('שגיאה בתיקון פגישות', 'error')
  }
}

const openAppointmentDialog = (date: Date, time: string) => {
  const existing = getAppointment(date, time)

  // Check if this is a group session
  if (existing?.isGroup) {
    openGroupDialog(existing)
    return
  }

  if (existing) {
    selectedAppointment.value = existing
    const aptDate = existing.date instanceof Date ? existing.date : new Date(existing.date)

    // Get client to use defaultPrice if price is missing
    const client = clients.value.find(c => c.id === existing.clientId)
    const priceToUse = existing.price || client?.defaultPrice || 400

    appointmentForm.value = {
      clientId: existing.clientId,
      date: dateToInputString(aptDate),
      time: existing.time,
      price: priceToUse,
      attended: existing.attended,
      paid: existing.paid,
      notes: existing.notes || '',
      isGroup: false,
      groupPrice: 250,
      groupParticipantIds: []
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
      notes: '',
      isGroup: false,
      groupPrice: 250,
      groupParticipantIds: []
    }
    payments.value = []
    sessionSummary.value = {
      startTime: '',
      endTime: '',
      duration: null,
      category: null,
      notes: ''
    }
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

// Group session functions
const openGroupDialog = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  const aptDate = appointment.date instanceof Date ? appointment.date : new Date(appointment.date)

  groupForm.value = {
    date: formatDate(aptDate),
    time: appointment.time,
    groupPrice: appointment.groupPrice || 250
  }

  groupParticipants.value = (appointment.groupParticipants || []).map(p => ({
    clientId: p.clientId,
    clientName: p.clientName,
    attended: p.attended,
    payments: (p.payments || []).map(payment => {
      let paymentDate: Date
      if (payment.date instanceof Date) {
        paymentDate = payment.date
      } else if (payment.date?.toDate && typeof payment.date.toDate === 'function') {
        // Firebase Timestamp
        paymentDate = payment.date.toDate()
      } else if (payment.date) {
        // Try to parse as string
        const parsed = new Date(payment.date)
        paymentDate = isNaN(parsed.getTime()) ? new Date() : parsed
      } else {
        // Fallback to current date
        paymentDate = new Date()
      }

      return {
        id: payment.id || `payment_${Date.now()}_${Math.random()}`,
        amount: payment.amount || 0,
        method: payment.method || 'cash',
        date: paymentDate,
        notes: payment.notes || ''
      }
    }),
    isRegular: p.isRegular
  }))

  showGroupDialog.value = true
}

const closeGroupDialog = () => {
  showGroupDialog.value = false
  selectedAppointment.value = null
  groupParticipants.value = []
  oneTimeParticipant.value = ''
}

const addOneTimeParticipant = () => {
  if (!oneTimeParticipant.value) return

  const client = clients.value.find(c => c.id === oneTimeParticipant.value)
  if (!client) return

  groupParticipants.value.push({
    clientId: client.id,
    clientName: client.name,
    attended: false,
    payments: [],
    isRegular: false
  })

  oneTimeParticipant.value = ''
}

const removeParticipant = (index: number) => {
  groupParticipants.value.splice(index, 1)
}

const toggleParticipantAttendance = (index: number) => {
  groupParticipants.value[index].attended = !groupParticipants.value[index].attended

  // Clear payments if marking as not attended
  if (!groupParticipants.value[index].attended) {
    groupParticipants.value[index].payments = []
  }
}

const getParticipantPaymentColor = (participant: any): string => {
  const totalPaid = participant.payments.reduce((sum: number, p: any) => sum + p.amount, 0)
  const expected = groupForm.value.groupPrice

  if (totalPaid >= expected) return 'success'
  if (totalPaid > 0) return 'warning'
  return 'error'
}

const getParticipantPaymentText = (participant: any): string => {
  const totalPaid = participant.payments.reduce((sum: number, p: any) => sum + p.amount, 0)
  const expected = groupForm.value.groupPrice
  const debt = expected - totalPaid

  if (totalPaid >= expected) return 'שולם במלואו'
  if (totalPaid > 0) return `חוב: ₪${debt}`
  return `לא שולם (₪${expected})`
}

const openParticipantPayment = (index: number) => {
  selectedParticipantIndex.value = index
  const participant = groupParticipants.value[index]
  const totalPaid = participant.payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = groupForm.value.groupPrice - totalPaid

  participantPaymentForm.value = {
    amount: remaining > 0 ? remaining : groupForm.value.groupPrice,
    method: 'cash',
    notes: ''
  }

  showParticipantPaymentDialog.value = true
}

const closeParticipantPaymentDialog = () => {
  showParticipantPaymentDialog.value = false
  selectedParticipantIndex.value = null
  participantPaymentForm.value = {
    amount: 0,
    method: 'cash',
    notes: ''
  }
}

const addParticipantPayment = () => {
  if (selectedParticipantIndex.value === null) return

  const payment = {
    id: `payment_${Date.now()}`,
    amount: participantPaymentForm.value.amount,
    method: participantPaymentForm.value.method,
    date: new Date(),
    notes: participantPaymentForm.value.notes
  }

  groupParticipants.value[selectedParticipantIndex.value].payments.push(payment)
  closeParticipantPaymentDialog()
}

const editParticipantPayment = (participantIndex: number, paymentIndex: number) => {
  const payment = groupParticipants.value[participantIndex].payments[paymentIndex]

  selectedParticipantIndex.value = participantIndex
  participantPaymentForm.value = {
    amount: payment.amount,
    method: payment.method,
    notes: payment.notes || ''
  }

  // Remove the old payment - we'll add the edited one when saving
  groupParticipants.value[participantIndex].payments.splice(paymentIndex, 1)

  showParticipantPaymentDialog.value = true
}

const removeParticipantPayment = (participantIndex: number, paymentIndex: number) => {
  const payment = groupParticipants.value[participantIndex].payments[paymentIndex]
  if (!confirm(`האם למחוק תשלום של ₪${payment.amount}?`)) return

  groupParticipants.value[participantIndex].payments.splice(paymentIndex, 1)
  showSnackbar('התשלום נמחק - לחץ "שמור" כדי לשמור את השינויים', 'warning')
}

const getPaymentMethodIcon = (method: string): string => {
  const icons: Record<string, string> = {
    cash: 'mdi-cash',
    transfer: 'mdi-bank-transfer',
    credit: 'mdi-credit-card',
    check: 'mdi-checkbook'
  }
  return icons[method] || 'mdi-cash'
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

const saveGroupSession = async () => {
  if (!selectedAppointment.value) return

  savingAppointment.value = true
  try {
    const appointmentRef = doc(db, 'appointments', selectedAppointment.value.id)

    // Get old appointment data to compare
    const oldAppointmentSnap = await getDoc(appointmentRef)
    const oldAppointment = oldAppointmentSnap.data()
    const oldParticipants = oldAppointment?.groupParticipants || []

    // Calculate total expected income (only from attended participants)
    const attendedParticipants = groupParticipants.value.filter(p => p.attended)
    const totalExpectedIncome = attendedParticipants.length * groupForm.value.groupPrice

    // Update appointment - ensure all dates are valid
    await updateDoc(appointmentRef, {
      groupParticipants: groupParticipants.value.map(p => ({
        clientId: p.clientId,
        clientName: p.clientName,
        attended: p.attended,
        payments: p.payments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          method: payment.method,
          date: payment.date instanceof Date && !isNaN(payment.date.getTime())
            ? payment.date
            : new Date(),
          notes: payment.notes || ''
        })),
        isRegular: p.isRegular
      })),
      price: totalExpectedIncome,
      attended: attendedParticipants.length > 0
    })

    // Update client balances - track changes in attendance
    for (const participant of groupParticipants.value) {
      const client = clients.value.find(c => c.id === participant.clientId)
      if (!client) continue

      const oldParticipant = oldParticipants.find((p: any) => p.clientId === participant.clientId)
      const wasAttended = oldParticipant?.attended || false
      const isNowAttended = participant.attended

      const clientRef = doc(db, 'clients', participant.clientId)

      // Case 1: Participant just marked as attended
      if (!wasAttended && isNowAttended) {
        const totalPaid = participant.payments.reduce((sum, p) => sum + p.amount, 0)
        const balanceChange = totalPaid - groupForm.value.groupPrice

        await updateDoc(clientRef, {
          balance: (client.balance || 0) + balanceChange,
          totalSessions: (client.totalSessions || 0) + 1
        })
      }
      // Case 2: Participant was attended but now unmarked
      else if (wasAttended && !isNowAttended) {
        const oldTotalPaid = oldParticipant.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0
        const oldBalanceChange = oldTotalPaid - groupForm.value.groupPrice

        await updateDoc(clientRef, {
          balance: (client.balance || 0) - oldBalanceChange,
          totalSessions: Math.max(0, (client.totalSessions || 0) - 1)
        })
      }
      // Case 3: Still attended - only update if payments changed
      else if (wasAttended && isNowAttended) {
        const oldTotalPaid = oldParticipant.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0
        const newTotalPaid = participant.payments.reduce((sum, p) => sum + p.amount, 0)
        const paymentDifference = newTotalPaid - oldTotalPaid

        if (paymentDifference !== 0) {
          await updateDoc(clientRef, {
            balance: (client.balance || 0) + paymentDifference
          })
        }
      }
    }

    showSnackbar('הקבוצה עודכנה בהצלחה', 'success')
    closeGroupDialog()
    await loadAppointments()
    await loadClients()
    await updateWeeklyTargetFromAppointments()
  } catch (error) {
    console.error('Error saving group session:', error)
    showSnackbar('שגיאה בשמירת הקבוצה', 'error')
  } finally {
    savingAppointment.value = false
  }
}

const confirmDeleteGroupSession = async () => {
  if (!selectedAppointment.value) return
  if (!confirm('האם אתה בטוח שברצונך למחוק את הקבוצה?')) return

  try {
    await deleteDoc(doc(db, 'appointments', selectedAppointment.value.id))
    showSnackbar('הקבוצה נמחקה בהצלחה', 'success')
    closeGroupDialog()
    await loadAppointments()
    await updateWeeklyTargetFromAppointments()
  } catch (error) {
    console.error('Error deleting group session:', error)
    showSnackbar('שגיאה במחיקת הקבוצה', 'error')
  }
}

const cancelAddPayment = () => {
  showAddPaymentForm.value = false
  newPayment.value = {
    amount: 0,
    method: 'cash',
    notes: ''
  }
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
  // If this is a group appointment, validate differently
  if (appointmentForm.value.isGroup) {
    if (!appointmentForm.value.date || !appointmentForm.value.time) {
      showSnackbar('יש למלא תאריך ושעה', 'warning')
      return
    }
    if (!appointmentForm.value.groupParticipantIds || appointmentForm.value.groupParticipantIds.length === 0) {
      showSnackbar('יש לבחור לפחות משתתף אחד', 'warning')
      return
    }
    savingAppointment.value = true
    await saveGroupAppointmentManual()
    return
  }

  // Regular appointment validation
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

    // Update client balance and session count
    const updateData: any = {}

    const wasAttended = selectedAppointment.value?.attended || false
    const isNowAttended = appointmentForm.value.attended

    // Calculate old and new balance changes
    const oldPaid = selectedAppointment.value?.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const oldPrice = selectedAppointment.value?.price || 0
    const oldBalanceChange = wasAttended ? (oldPaid - oldPrice) : 0

    const newPaid = totalPaid.value
    const newPrice = appointmentForm.value.price
    const newBalanceChange = isNowAttended ? (newPaid - newPrice) : 0

    console.log('💰 Balance Update Debug:', {
      clientName: client.name,
      currentBalance: client.balance,
      wasAttended,
      isNowAttended,
      oldPaid,
      oldPrice,
      oldBalanceChange,
      newPaid,
      newPrice,
      newBalanceChange
    })

    // Case 1: Just marked as attended (first time)
    if (!wasAttended && isNowAttended) {
      updateData.balance = client.balance + newBalanceChange
      updateData.totalSessions = client.totalSessions + 1
      console.log('✅ Case 1: New attendance → balance =', updateData.balance)
    }
    // Case 2: Was attended but now unmarked
    else if (wasAttended && !isNowAttended) {
      updateData.balance = client.balance - oldBalanceChange
      updateData.totalSessions = Math.max(0, client.totalSessions - 1)
      console.log('✅ Case 2: Unmarked → balance =', updateData.balance)
    }
    // Case 3: Still attended - update balance if payment or price changed
    else if (wasAttended && isNowAttended) {
      const balanceDifference = newBalanceChange - oldBalanceChange
      console.log('🔄 Case 3: Still attended → difference =', balanceDifference)
      if (balanceDifference !== 0) {
        updateData.balance = client.balance + balanceDifference
        console.log('✅ Case 3: Updating balance to', updateData.balance)
      } else {
        console.log('⏭️ Case 3: No change needed')
      }
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

// שמירת קבוצה טיפולית ידנית (לא מתבנית)
const saveGroupAppointmentManual = async () => {
  try {
    // יצירת תאריך מקומי נכון
    const appointmentDate = createLocalDate(appointmentForm.value.date)

    // בניית רשימת משתתפים
    const groupParticipants: any[] = appointmentForm.value.groupParticipantIds.map(participantId => {
      const client = clients.value.find(c => c.id === participantId)
      return client ? {
        clientId: client.id,
        clientName: client.name,
        attended: false,
        payments: [],
        isRegular: true
      } : null
    }).filter(p => p !== null)

    if (groupParticipants.length === 0) {
      showSnackbar('יש לבחור לפחות משתתף אחד', 'warning')
      return
    }

    const groupAppointmentData = {
      clientId: 'group',
      clientName: 'קבוצה טיפולית',
      date: appointmentDate,
      time: appointmentForm.value.time,
      price: appointmentForm.value.groupPrice * groupParticipants.length,
      attended: false,
      paid: false,
      payments: [],
      sessionNumber: 1,
      notes: appointmentForm.value.notes || '',
      isGroup: true,
      groupPrice: appointmentForm.value.groupPrice,
      groupParticipants: groupParticipants
    }

    await addDoc(collection(db, 'appointments'), groupAppointmentData)
    showSnackbar('✅ קבוצה טיפולית נוספה בהצלחה!', 'success')

    closeAppointmentDialog()
    await loadData()
  } catch (error) {
    console.error('❌ Error saving group appointment:', error)
    showSnackbar('שגיאה בשמירת הקבוצה', 'error')
  } finally {
    savingAppointment.value = false
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

.appointment-card.group-session {
  border-color: #9C27B0;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.08), rgba(156, 39, 176, 0.12));
}

.appointment-card.group-session:hover {
  border-color: #7B1FA2;
  box-shadow: 0 6px 16px rgba(156, 39, 176, 0.3);
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

