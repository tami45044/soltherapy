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
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            @click="loadData"
            :loading="loading"
            size="large"
          >
            <v-icon icon="mdi-refresh" start />
            רענן נתונים
          </v-btn>
          <v-btn
            v-if="isTest"
            color="primary"
            variant="tonal"
            rounded="lg"
            @click="importData"
            :loading="importingData"
          >
            <v-icon icon="mdi-database-import" start />
            ייבוא גיבוי
          </v-btn>
          <v-btn
            v-if="isProduction"
            color="primary"
            variant="tonal"
            rounded="lg"
            @click="copyDataToTest"
            :loading="copyingData"
          >
            <v-icon icon="mdi-content-copy" start />
            העתק לבדיקה
          </v-btn>
          <v-btn
            color="success"
            variant="tonal"
            rounded="lg"
            @click="createBackup"
            :loading="backingUp"
          >
            <v-icon icon="mdi-database-export" start />
            גיבוי נתונים
          </v-btn>
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
        <v-card
          class="stat-card-modern stat-card-fixed-height clickable-stat-card"
          rounded="xl"
          elevation="0"
          hover
          @click="showPaymentsDetails('week')"
          style="cursor: pointer;"
        >
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
                  <v-icon icon="mdi-open-in-new" size="x-small" class="mr-1" />
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
          <v-card-title class="pa-5 text-right section-header-clean d-flex justify-space-between align-center">
            <div class="d-flex align-center gap-2">
              <v-icon icon="mdi-alert-circle-outline" size="24" style="opacity: 0.8;" />
              <span class="text-h6">חובות ללקוחות</span>
            </div>
            <v-chip
              v-if="clientsWithDebts.length > 0"
              color="error"
              variant="flat"
              size="large"
              class="font-weight-bold"
            >
              סה"כ: ₪{{ totalDebts.toLocaleString() }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row v-if="clientsWithDebts.length > 0">
              <v-col
                v-for="client in clientsWithDebts"
                :key="client.id"
                cols="12"
                sm="6"
              >
                <v-card
                  rounded="lg"
                  variant="tonal"
                  color="error"
                  class="clickable-debt-item pa-3"
                >
                  <div class="d-flex justify-space-between align-center">
                    <div class="text-right flex-grow-1" @click="showBalanceDetails(client)" style="cursor: pointer;">
                      <div class="font-weight-bold mb-1">
                        {{ client.name }}
                      </div>
                      <v-chip size="small" color="error" variant="flat" class="font-weight-bold">
                        חוב: ₪{{ Math.abs(client.balance) }}
                      </v-chip>
                    </div>
                    <v-btn
                      icon="mdi-cash-plus"
                      size="small"
                      color="success"
                      variant="flat"
                      @click.stop="openDebtPaymentDialog(client)"
                    />
                  </div>
                </v-card>
              </v-col>
            </v-row>

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
                <div
                  class="stat-box-modern clickable-stat-card"
                  @click="showMonthlyAppointments"
                  style="cursor: pointer;"
                >
                  <v-icon icon="mdi-calendar-check" size="40" color="primary" class="mb-3" />
                  <div class="stat-label-modern">פגישות החודש</div>
                  <div class="stat-value-modern">
                    {{ stats.monthAppointments }}
                    <v-icon icon="mdi-open-in-new" size="small" class="mr-1" />
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div
                  class="stat-box-modern clickable-stat-card"
                  @click="showPaymentsDetails('month')"
                  style="cursor: pointer;"
                >
                  <v-icon icon="mdi-cash-check" size="40" color="success" class="mb-3" />
                  <div class="stat-label-modern">הכנסות החודש</div>
                  <div class="stat-value-modern" style="color: #4CAF50;">₪{{ stats.monthActual.toLocaleString() }}</div>
                  <div class="stat-sublabel-modern">מתוך ₪{{ stats.monthExpected.toLocaleString() }} צפוי</div>
                  <div class="stat-sublabel-modern" style="color: #2E7D32; font-weight: 600; margin-top: 4px;">
                    שולם בפועל: ₪{{ stats.monthPaid.toLocaleString() }}
                    <v-icon icon="mdi-open-in-new" size="x-small" class="mr-1" />
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

            <!-- Debt Additions List (הוספות חוב ידניות) -->
            <div v-if="balanceDetails.debtAdditions && balanceDetails.debtAdditions.length > 0" class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon icon="mdi-alert-circle" size="small" color="error" class="ml-2" />
                הוספות חוב
              </h4>
              <v-list density="compact" class="debt-additions-list">
                <v-list-item
                  v-for="(addition, idx) in balanceDetails.debtAdditions"
                  :key="idx"
                  class="addition-item rounded-lg mb-2 bg-error-lighten-5"
                >
                  <template #prepend>
                    <v-icon icon="mdi-plus-circle" color="error" />
                  </template>

                  <v-list-item-title>
                    <div class="d-flex align-center gap-2">
                      <span class="font-weight-bold">{{ new Intl.DateTimeFormat('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(addition.date) }}</span>
                      <v-chip size="x-small" color="error" variant="tonal">
                        הוספת חוב
                      </v-chip>
                    </div>
                  </v-list-item-title>

                  <v-list-item-subtitle v-if="addition.notes" class="mt-1">
                    {{ addition.notes }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-chip color="error" variant="flat" class="font-weight-bold">
                      -₪{{ addition.amount.toLocaleString() }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <!-- Debt Payments List -->
            <div v-if="balanceDetails.debtPayments && balanceDetails.debtPayments.length > 0" class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon icon="mdi-cash-plus" size="small" color="success" class="ml-2" />
                תשלומי חוב
              </h4>
              <v-list density="compact" class="debt-payments-list">
                <v-list-item
                  v-for="(payment, idx) in balanceDetails.debtPayments"
                  :key="idx"
                  class="payment-item rounded-lg mb-2 bg-success-lighten-5"
                >
                  <template #prepend>
                    <v-icon
                      :icon="getPaymentMethodIcon(payment.method)"
                      :color="getPaymentMethodColor(payment.method)"
                    />
                  </template>

                  <v-list-item-title>
                    <div class="d-flex align-center gap-2">
                      <span class="font-weight-bold">{{ new Intl.DateTimeFormat('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(payment.date) }}</span>
                      <v-chip size="x-small" :color="getPaymentMethodColor(payment.method)" variant="flat">
                        {{ getPaymentMethodLabel(payment.method) }}
                      </v-chip>
                    </div>
                  </v-list-item-title>

                  <v-list-item-subtitle v-if="payment.notes" class="mt-1">
                    {{ payment.notes }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-chip color="success" variant="flat" class="font-weight-bold">
                      +₪{{ payment.amount.toLocaleString() }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <!-- Appointments List -->
            <div v-if="balanceDetails.appointments.length > 0">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon icon="mdi-calendar-check" size="small" color="primary" class="ml-2" />
                היסטוריית פגישות
              </h4>
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
              v-else-if="!balanceDetails.debtPayments || balanceDetails.debtPayments.length === 0"
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

    <!-- Payments Details Dialog -->
    <v-dialog v-model="showPaymentsDialog" max-width="900" @click:outside="closePaymentsDialog">
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-cash-multiple" size="24" style="opacity: 0.8;" />
          <span class="text-h6">פירוט תשלומים - {{ paymentsType === 'week' ? 'השבוע' : 'החודש' }}</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-progress-linear v-if="loadingPayments" indeterminate color="primary" class="mb-4" />

          <div v-else>
            <div v-if="paymentsList.length > 0" class="mb-4">
              <div class="d-flex justify-space-between mb-3 pa-3 bg-grey-lighten-4 rounded">
                <div>
                  <strong>סה"כ תשלומים:</strong> {{ paymentsList.length }}
                </div>
                <div>
                  <strong>סה"כ סכום:</strong> ₪{{ paymentsList.reduce((sum, p) => sum + p.amount, 0).toLocaleString() }}
                </div>
              </div>

              <v-list>
                <v-list-item
                  v-for="(payment, idx) in paymentsList"
                  :key="idx"
                  class="mb-2 pa-3 rounded payment-item"
                >
                  <template #prepend>
                    <v-avatar :color="payment.isGroup ? 'purple' : 'primary'" size="40">
                      <v-icon :icon="payment.isGroup ? 'mdi-account-group' : 'mdi-account'" />
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-bold mb-1">
                    {{ payment.clientName }}
                    <v-chip v-if="payment.isGroup" size="x-small" color="purple" variant="tonal" class="mr-2">
                      קבוצה
                    </v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle class="d-flex flex-wrap gap-2 mt-2">
                    <v-chip size="small" color="primary" variant="flat">
                      <v-icon icon="mdi-calendar" size="small" start />
                      {{ new Intl.DateTimeFormat('he-IL').format(payment.date) }}
                    </v-chip>
                    <v-chip size="small" color="secondary" variant="flat">
                      <v-icon icon="mdi-clock-outline" size="small" start />
                      {{ payment.time }}
                    </v-chip>
                    <v-chip size="small" :color="getPaymentMethodColor(payment.method)" variant="flat">
                      <v-icon :icon="getPaymentMethodIcon(payment.method)" size="small" start />
                      {{ getPaymentMethodLabel(payment.method) }}
                    </v-chip>
                    <v-chip v-if="payment.notes" size="small" color="grey" variant="tonal">
                      <v-icon icon="mdi-note-text" size="small" start />
                      {{ payment.notes }}
                    </v-chip>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-h6 font-weight-bold text-success">
                      ₪{{ payment.amount.toLocaleString() }}
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <v-alert
              v-else
              type="info"
              variant="tonal"
            >
              אין תשלומים {{ paymentsType === 'week' ? 'השבוע' : 'החודש' }}
            </v-alert>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closePaymentsDialog"
            class="px-6"
          >
            סגור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Monthly Appointments Dialog -->
    <v-dialog v-model="showMonthlyAppointmentsDialog" max-width="900" @click:outside="closeMonthlyAppointmentsDialog">
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-calendar-month" size="24" style="opacity: 0.8;" />
          <span class="text-h6">פגישות החודש</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <div v-if="monthlyAppointmentsList.length > 0">
            <div class="d-flex justify-space-between mb-3 pa-3 bg-grey-lighten-4 rounded">
              <div>
                <strong>סה"כ פגישות:</strong> {{ monthlyAppointmentsList.length }}
              </div>
              <div>
                <strong>הגיעו:</strong> {{ monthlyAppointmentsList.filter(a => a.attended || (a.isGroup && a.groupParticipants?.some(p => p.attended))).length }}
              </div>
            </div>

            <v-list>
              <v-list-item
                v-for="apt in monthlyAppointmentsList"
                :key="apt.id"
                class="mb-2 pa-3 rounded payment-item"
              >
                <template #prepend>
                  <v-avatar :color="apt.isGroup ? 'purple' : (apt.attended ? 'success' : 'grey')" size="40">
                    <v-icon :icon="apt.isGroup ? 'mdi-account-group' : 'mdi-account'" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold mb-1">
                  {{ apt.clientName }}
                  <v-chip v-if="apt.isGroup" size="x-small" color="purple" variant="tonal" class="mr-2">
                    קבוצה ({{ apt.groupParticipants?.length || 0 }})
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle class="d-flex flex-wrap gap-2 mt-2">
                  <v-chip size="small" color="primary" variant="flat">
                    <v-icon icon="mdi-calendar" size="small" start />
                    {{ new Intl.DateTimeFormat('he-IL').format(apt.date) }}
                  </v-chip>
                  <v-chip size="small" color="secondary" variant="flat">
                    <v-icon icon="mdi-clock-outline" size="small" start />
                    {{ apt.time }}
                  </v-chip>
                  <v-chip
                    v-if="apt.attended || (apt.isGroup && apt.groupParticipants?.some(p => p.attended))"
                    size="small"
                    color="success"
                    variant="flat"
                  >
                    <v-icon icon="mdi-check-circle" size="small" start />
                    הגיע
                  </v-chip>
                  <v-chip v-else size="small" color="grey" variant="flat">
                    <v-icon icon="mdi-clock-outline" size="small" start />
                    מתוכנן
                  </v-chip>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-h6 font-weight-bold" :class="apt.attended ? 'text-success' : 'text-grey'">
                    ₪{{ apt.price.toLocaleString() }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <v-alert
            v-else
            type="info"
            variant="tonal"
          >
            אין פגישות החודש
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeMonthlyAppointmentsDialog"
            class="px-6"
          >
            סגור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Debt Payment Dialog -->
    <v-dialog v-model="showDebtPaymentDialog" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-cash-plus" size="24" style="opacity: 0.8;" />
          <span class="text-h6">רישום תשלום חוב</span>
        </v-card-title>

        <v-card-text class="pa-6" v-if="selectedClientForDebtPayment">
          <div class="mb-4 pa-4 rounded" style="background-color: rgba(25, 118, 210, 0.08);">
            <div class="text-h6 font-weight-bold mb-2">{{ selectedClientForDebtPayment.name }}</div>
            <div class="text-body-1">
              חוב נוכחי: <span class="font-weight-bold error--text">₪{{ Math.abs(selectedClientForDebtPayment.balance).toLocaleString() }}</span>
            </div>
          </div>

          <v-text-field
            v-model.number="debtPaymentForm.amount"
            label="סכום התשלום *"
            prepend-inner-icon="mdi-cash"
            variant="outlined"
            rounded="lg"
            type="number"
            :min="0"
            class="mb-4"
            autofocus
          >
            <template #append-inner>
              <span class="text-body-2 text-medium-emphasis">₪</span>
            </template>
          </v-text-field>

          <v-select
            v-model="debtPaymentForm.method"
            label="אמצעי תשלום *"
            :items="[
              { value: 'cash', title: 'מזומן', icon: 'mdi-cash' },
              { value: 'transfer', title: 'העברה בנקאית', icon: 'mdi-bank-transfer' },
              { value: 'credit', title: 'כרטיס אשראי', icon: 'mdi-credit-card' },
              { value: 'check', title: 'צ\'ק', icon: 'mdi-checkbook' }
            ]"
            item-value="value"
            item-title="title"
            prepend-inner-icon="mdi-wallet"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon :icon="item.raw.icon" />
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-textarea
            v-model="debtPaymentForm.notes"
            label="הערות (אופציונלי)"
            prepend-inner-icon="mdi-note-text-outline"
            variant="outlined"
            rounded="lg"
            rows="2"
          />

          <v-alert
            v-if="debtPaymentForm.amount > 0"
            type="info"
            variant="tonal"
            rounded="lg"
            class="mt-4"
          >
            <div class="text-body-2">
              <strong>יתרה חדשה:</strong>
              ₪{{ (selectedClientForDebtPayment.balance + debtPaymentForm.amount).toLocaleString() }}
              <span v-if="selectedClientForDebtPayment.balance + debtPaymentForm.amount >= 0" class="success--text"> (סולק / זכות)</span>
              <span v-else class="error--text"> (עדיין חוב)</span>
            </div>
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="primary"
            rounded="xl"
            size="large"
            variant="elevated"
            @click="saveDebtPayment"
            :loading="savingDebtPayment"
            :disabled="debtPaymentForm.amount <= 0"
            class="flex-grow-1"
          >
            <v-icon icon="mdi-check" start />
            שמור תשלום
          </v-btn>
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeDebtPaymentDialog"
            :disabled="savingDebtPayment"
          >
            ביטול
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, onUnmounted } from 'vue'
import { collection, getDocs, query, where, orderBy, updateDoc, doc, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Client, Appointment, PaymentRecord, PaymentMethod } from '@/types/manage'
import { backupFirestore } from '@/utils/backup'
import { copyProductionToTest } from '@/utils/copy-data'
import { importBackupFiles } from '@/utils/import-data'

// Emit
const emit = defineEmits(['navigate'])

// State
const clients = ref<Client[]>([])
const appointments = ref<Appointment[]>([])
const loading = ref(true)
const showBalanceDialog = ref(false)
const loadingBalanceDetails = ref(false)
const selectedClientForBalance = ref<Client | null>(null)
const showPaymentsDialog = ref(false)
const loadingPayments = ref(false)
const paymentsType = ref<'week' | 'month'>('week')
const showMonthlyAppointmentsDialog = ref(false)
const monthlyAppointmentsList = ref<Appointment[]>([])
const backingUp = ref(false)
const copyingData = ref(false)
const importingData = ref(false)
const showDebtPaymentDialog = ref(false)
const selectedClientForDebtPayment = ref<Client | null>(null)
const savingDebtPayment = ref(false)
const debtPaymentForm = ref({
  amount: 0,
  method: 'cash' as PaymentMethod,
  notes: ''
})

// Check if we're in production environment
const isProduction = computed(() => {
  return import.meta.env.VITE_FIREBASE_PROJECT_ID === 'soltherapy-manage'
})

// Check if we're in test environment
const isTest = computed(() => {
  return import.meta.env.VITE_FIREBASE_PROJECT_ID === 'soltherapy-test'
})

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
  }>,
  debtPayments: [] as Array<{
    date: Date
    amount: number
    method: string
    notes: string
  }>,
  debtAdditions: [] as Array<{
    date: Date
    amount: number
    notes: string
  }>
})

const paymentsList = ref<Array<{
  clientName: string
  date: Date
  time: string
  amount: number
  method: string
  notes: string
  isGroup: boolean
}>>([])

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
      if (a.isGroup && a.groupParticipants) {
        // For group appointments - sum payments from all participants
        return sum + a.groupParticipants.reduce((gSum, p) => {
          if (p.payments && Array.isArray(p.payments)) {
            return gSum + p.payments.reduce((pSum, pay) => pSum + pay.amount, 0)
          }
          return gSum
        }, 0)
      } else if (a.payments && Array.isArray(a.payments)) {
        return sum + a.payments.reduce((pSum, p) => pSum + p.amount, 0)
      } else if (a.paymentAmount) {
        return sum + a.paymentAmount
      }
      return sum
    }, 0)
  }

  // פונקציה לחישוב מחיר פגישה (כולל קבוצה טיפולית)
  const getAppointmentPrice = (apt: Appointment) => {
    if (apt.isGroup && apt.groupParticipants) {
      // For group - count only attended participants
      const attendedCount = apt.groupParticipants.filter(p => p.attended).length
      return attendedCount * (apt.groupPrice || 0)
    }
    return apt.price || 0
  }

  // פונקציה לחישוב מחיר מתוכנן (כל המשתתפים בקבוצה)
  const getExpectedPrice = (apt: Appointment) => {
    if (apt.isGroup && apt.groupParticipants) {
      return apt.groupParticipants.length * (apt.groupPrice || 0)
    }
    return apt.price || 0
  }

  // חישובים שבועיים
  // סכום מצופה = כל הפגישות המתוכננות (כולל כל משתתפי קבוצה)
  // הכנסה בפועל = פגישות שהלקוח הגיע אליהן (כולל משתתפים שהגיעו לקבוצה)
  // שולם בפועל = תשלומים שהתקבלו בפועל
  const weekExpected = weekAppts.reduce((sum, a) => sum + getExpectedPrice(a), 0)
  const weekActual = weekAppts.filter(a => a.attended || (a.isGroup && a.groupParticipants?.some(p => p.attended)))
    .reduce((sum, a) => sum + getAppointmentPrice(a), 0)
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
  // סכום מצופה = כל הפגישות המתוכננות (כולל כל משתתפי קבוצה)
  // הכנסה בפועל = פגישות שהלקוח הגיע אליהן (כולל משתתפים שהגיעו לקבוצה)
  // שולם בפועל = תשלומים שהתקבלו בפועל
  const monthExpected = monthAppts.reduce((sum, a) => sum + getExpectedPrice(a), 0)
  const monthActual = monthAppts.filter(a => a.attended || (a.isGroup && a.groupParticipants?.some(p => p.attended)))
    .reduce((sum, a) => sum + getAppointmentPrice(a), 0)
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
    .sort((a, b) => a.balance - b.balance) // Sort by debt (largest first)
    // No slice - show all clients with debts
})

const totalDebts = computed(() => {
  return clientsWithDebts.value.reduce((sum, client) => sum + Math.abs(client.balance), 0)
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

const createBackup = async () => {
  if (!confirm('🔒 האם את רוצה ליצור גיבוי של כל הנתונים?\n\nהקבצים יורדו למחשב שלך.')) {
    return
  }

  backingUp.value = true
  try {
    await backupFirestore()
    alert('✅ הגיבוי הושלם בהצלחה!\n\nהקבצים ירדו לתיקיית Downloads שלך.')
  } catch (error) {
    console.error('❌ שגיאה בגיבוי:', error)
    alert('❌ שגיאה בגיבוי הנתונים')
  } finally {
    backingUp.value = false
  }
}

const copyDataToTest = async () => {
  if (!confirm('🔄 האם את רוצה להעתיק את כל הנתונים מהייצור (soltherapy-manage) לסביבת הבדיקה (soltherapy-test)?\n\n⚠️ זה ימחק את כל הנתונים הקיימים בסביבת הבדיקה!')) {
    return
  }

  copyingData.value = true
  try {
    await copyProductionToTest()
    alert('✅ ההעתקה הושלמה בהצלחה!\n\nכל הנתונים הועתקו לסביבת הבדיקה (soltherapy-test).\n\nעכשיו תוכלי לעבוד על עותק של הנתונים בלי לפגוע במקור!')
  } catch (error) {
    console.error('❌ שגיאה בהעתקה:', error)
    alert('❌ שגיאה בהעתקת הנתונים')
  } finally {
    copyingData.value = false
  }
}

const importData = async () => {
  if (!confirm('📥 ייבוא נתונים מגיבוי\n\nתתבקשי לבחור 4 קבצים (אחד אחרי השני):\n1. clients.json\n2. appointments.json\n3. schedule_template.json\n4. weekly_prizes.json\n\n⚠️ זה ימחק את כל הנתונים הקיימים!')) {
    return
  }

  importingData.value = true
  try {
    await importBackupFiles()
    alert('✅ הייבוא הושלם בהצלחה!\n\nכל הנתונים מהגיבוי יובאו לסביבת הבדיקה.\n\nרענני את הדף כדי לראות את הנתונים!')
    // Reload data
    await loadData()
  } catch (error) {
    console.error('❌ שגיאה בייבוא:', error)
    alert('❌ שגיאה בייבוא הנתונים')
  } finally {
    importingData.value = false
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
    // Get all appointments (we'll filter in memory for group appointments)
    const allAppointmentsQuery = query(collection(db, 'appointments'))
    const allAppointmentsSnapshot = await getDocs(allAppointmentsQuery)

    let totalOwed = 0
    let totalPaid = 0
    const appointmentsList: any[] = []

    allAppointmentsSnapshot.forEach(docSnap => {
      const apt = docSnap.data()
      const aptDate = apt.date?.toDate ? apt.date.toDate() : new Date(apt.date)

      // Check if this is a regular appointment for this client
      if (apt.clientId === client.id) {
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
            attended: true,
            isGroup: false
          })
        } else {
          // Show non-attended appointments too
          appointmentsList.push({
            date: aptDate,
            time: apt.time,
            price: apt.price || 0,
            paid: 0,
            balance: 0,
            attended: false,
            isGroup: false
          })
        }
      }
      // Check if this is a group appointment and client is a participant
      else if (apt.isGroup && apt.groupParticipants && Array.isArray(apt.groupParticipants)) {
        const participant = apt.groupParticipants.find((p: any) => p.clientId === client.id)
        if (participant) {
          if (participant.attended) {
            const paidForParticipant = participant.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
            const priceForParticipant = apt.groupPrice || 0
            totalOwed += priceForParticipant
            totalPaid += paidForParticipant

            appointmentsList.push({
              date: aptDate,
              time: apt.time,
              price: priceForParticipant,
              paid: paidForParticipant,
              balance: paidForParticipant - priceForParticipant,
              attended: true,
              isGroup: true
            })
          } else {
            // Show non-attended group appointments too
            appointmentsList.push({
              date: aptDate,
              time: apt.time,
              price: apt.groupPrice || 0,
              paid: 0,
              balance: 0,
              attended: false,
              isGroup: true
            })
          }
        }
      }
    })

    // Get debt payments for this client
    const debtPaymentsQuery = query(
      collection(db, 'debt_payments'),
      where('clientId', '==', client.id)
    )
    const debtPaymentsSnapshot = await getDocs(debtPaymentsQuery)
    const debtPaymentsList: any[] = []

    debtPaymentsSnapshot.forEach(docSnap => {
      const payment = docSnap.data()
      const paymentAmount = payment.amount || 0
      totalPaid += paymentAmount

      debtPaymentsList.push({
        date: payment.date?.toDate ? payment.date.toDate() : new Date(payment.date),
        amount: paymentAmount,
        method: payment.method || 'cash',
        notes: payment.notes || ''
      })
    })

    // Sort by date descending (client-side)
    debtPaymentsList.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Get debt additions for this client
    const debtAdditionsQuery = query(
      collection(db, 'debt_additions'),
      where('clientId', '==', client.id)
    )
    const debtAdditionsSnapshot = await getDocs(debtAdditionsQuery)
    const debtAdditionsList: any[] = []

    debtAdditionsSnapshot.forEach(docSnap => {
      const addition = docSnap.data()
      const additionAmount = addition.amount || 0
      totalOwed += additionAmount

      debtAdditionsList.push({
        date: addition.date?.toDate ? addition.date.toDate() : new Date(addition.date),
        amount: additionAmount,
        notes: addition.notes || ''
      })
    })

    // Sort by date descending (client-side)
    debtAdditionsList.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Sort by date descending
    appointmentsList.sort((a, b) => b.date.getTime() - a.date.getTime())

    balanceDetails.value = {
      totalOwed,
      totalPaid,
      balance: totalPaid - totalOwed,
      appointments: appointmentsList,
      debtPayments: debtPaymentsList,
      debtAdditions: debtAdditionsList
    }
  } catch (error) {
    console.error('Error loading balance details:', error)
    alert('שגיאה בטעינת פירוט החוב')
  } finally {
    loadingBalanceDetails.value = false
  }
}

const showPaymentsDetails = async (type: 'week' | 'month') => {
  paymentsType.value = type
  showPaymentsDialog.value = true
  loadingPayments.value = true

  try {
    const now = new Date()
    const weekStart = getWeekStart(now)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const filterDate = type === 'week' ? weekStart : monthStart

    const paymentsData: Array<{
      clientName: string
      date: Date
      time: string
      amount: number
      method: string
      notes: string
      isGroup: boolean
    }> = []

    // Get relevant appointments
    const relevantAppointments = appointments.value.filter(a => a.date >= filterDate)

    relevantAppointments.forEach(apt => {
      // Regular appointments
      if (!apt.isGroup && apt.payments && Array.isArray(apt.payments)) {
        apt.payments.forEach((payment: any) => {
          paymentsData.push({
            clientName: apt.clientName,
            date: apt.date,
            time: apt.time,
            amount: payment.amount || 0,
            method: payment.method || 'cash',
            notes: payment.notes || '',
            isGroup: false
          })
        })
      }

      // Group appointments
      if (apt.isGroup && apt.groupParticipants && Array.isArray(apt.groupParticipants)) {
        apt.groupParticipants.forEach((p: any) => {
          if (p.payments && Array.isArray(p.payments)) {
            p.payments.forEach((payment: any) => {
              paymentsData.push({
                clientName: p.clientName,
                date: apt.date,
                time: apt.time,
                amount: payment.amount || 0,
                method: payment.method || 'cash',
                notes: payment.notes || '',
                isGroup: true
              })
            })
          }
        })
      }
    })

    // Sort by date descending
    paymentsData.sort((a, b) => b.date.getTime() - a.date.getTime())

    paymentsList.value = paymentsData
  } catch (error) {
    console.error('Error loading payments:', error)
  } finally {
    loadingPayments.value = false
  }
}

const closePaymentsDialog = () => {
  showPaymentsDialog.value = false
  paymentsList.value = []
}

const showMonthlyAppointments = () => {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  monthlyAppointmentsList.value = appointments.value
    .filter(a => a.date >= monthStart)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  showMonthlyAppointmentsDialog.value = true
}

const closeMonthlyAppointmentsDialog = () => {
  showMonthlyAppointmentsDialog.value = false
  monthlyAppointmentsList.value = []
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

const getPaymentMethodIcon = (method: string): string => {
  const icons: Record<string, string> = {
    cash: 'mdi-cash',
    transfer: 'mdi-bank-transfer',
    credit: 'mdi-credit-card',
    check: 'mdi-checkbook'
  }
  return icons[method] || 'mdi-cash'
}

const getPaymentMethodColor = (method: string): string => {
  const colors: Record<string, string> = {
    cash: 'success',
    transfer: 'info',
    credit: 'warning',
    check: 'secondary'
  }
  return colors[method] || 'grey'
}

const closeBalanceDialog = () => {
  showBalanceDialog.value = false
  selectedClientForBalance.value = null
  balanceDetails.value = {
    totalOwed: 0,
    totalPaid: 0,
    balance: 0,
    appointments: [],
    debtPayments: [],
    debtAdditions: []
  }
}

// תשלום חוב
const openDebtPaymentDialog = (client: Client) => {
  selectedClientForDebtPayment.value = client
  debtPaymentForm.value = {
    amount: Math.abs(client.balance), // ברירת מחדל - החוב המלא
    method: 'cash',
    notes: ''
  }
  showDebtPaymentDialog.value = true
}

const saveDebtPayment = async () => {
  if (!selectedClientForDebtPayment.value || debtPaymentForm.value.amount <= 0) {
    alert('אנא הזן סכום תקין')
    return
  }

  savingDebtPayment.value = true
  try {
    const client = selectedClientForDebtPayment.value
    const paymentAmount = debtPaymentForm.value.amount

    // שמירת התשלום ב-collection debt_payments
    await addDoc(collection(db, 'debt_payments'), {
      clientId: client.id,
      clientName: client.name,
      amount: paymentAmount,
      method: debtPaymentForm.value.method,
      date: Timestamp.fromDate(new Date()),
      notes: debtPaymentForm.value.notes || '',
      createdAt: Timestamp.fromDate(new Date())
    })

    // עדכון יתרת הלקוח (הוספת התשלום)
    const newBalance = client.balance + paymentAmount
    await updateDoc(doc(db, 'clients', client.id), {
      balance: newBalance
    })

    alert(`✅ התשלום נרשם בהצלחה!\n\nסכום: ₪${paymentAmount}\nיתרה חדשה: ₪${newBalance >= 0 ? newBalance : Math.abs(newBalance)} ${newBalance >= 0 ? '(זכות)' : '(חוב)'}`)

    closeDebtPaymentDialog()
    await loadData() // רענון הנתונים
  } catch (error) {
    console.error('Error saving debt payment:', error)
    alert('❌ שגיאה בשמירת התשלום')
  } finally {
    savingDebtPayment.value = false
  }
}

const closeDebtPaymentDialog = () => {
  showDebtPaymentDialog.value = false
  selectedClientForDebtPayment.value = null
  debtPaymentForm.value = {
    amount: 0,
    method: 'cash',
    notes: ''
  }
}

// Lifecycle
onMounted(() => {
  loadData()

  // Start auto-refresh every 10 seconds
  if (refreshInterval) clearInterval(refreshInterval)
  refreshInterval = setInterval(() => {
    console.log('🔄 Auto-refreshing dashboard...')
    loadData()
  }, 10000) // 10 seconds
})

// Reload data when returning to Dashboard tab
// Auto-refresh interval
let refreshInterval: any = null

onActivated(() => {
  console.log('Dashboard activated, reloading data...')
  loadData()

  // Start auto-refresh every 10 seconds
  if (refreshInterval) clearInterval(refreshInterval)
  refreshInterval = setInterval(() => {
    console.log('🔄 Auto-refreshing dashboard...')
    loadData()
  }, 10000) // 10 seconds
})

onUnmounted(() => {
  // Clean up interval when component is unmounted
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.clickable-stat-card {
  transition: all 0.2s ease;
}

.clickable-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
}

.payment-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafafa;
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

