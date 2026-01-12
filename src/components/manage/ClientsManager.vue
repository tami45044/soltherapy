<template>
  <v-container fluid class="clients-container">
    <!-- Header -->
    <v-row class="mb-4 align-center">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div class="text-right">
          <h2 class="text-h4 mb-2" style="color: #1e3a5f;">ניהול לקוחות</h2>
          <p class="text-subtitle-1 text-medium-emphasis">סה"כ {{ clients.length }} לקוחות במערכת</p>
        </div>
        <v-btn
          color="primary"
          size="large"
          rounded="xl"
          elevation="4"
          @click="openAddDialog"
          class="flex-shrink-0"
        >
          <v-icon icon="mdi-plus" size="20" />
          לקוח חדש
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search & Filters -->
    <v-card class="mb-4 filters-card" rounded="xl" elevation="2">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="חיפוש לקוח"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              rounded="lg"
              clearable
              hide-details
              class=""
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="priceFilter"
              label="סינון לפי מחיר"
              :items="priceOptions"
              variant="outlined"
              rounded="lg"
              clearable
              hide-details
              class=""
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              label="מיון לפי"
              :items="sortOptions"
              variant="outlined"
              rounded="lg"
              hide-details
              class=""
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Clients List -->
    <v-row>
      <v-col
        v-for="client in filteredClients"
        :key="client.id"
        cols="12"
        md="6"
        lg="4"
        class="client-col"
      >
        <v-card class="client-card" rounded="xl" elevation="3" hover>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start mb-4">
              <div class="text-right flex-grow-1">
                <h3 class="text-h6 font-weight-bold mb-2" style="color: #1976D2;">
                  <v-icon icon="mdi-account-circle" size="small" color="primary" />
                  {{ client.name }}
                </h3>
                <div v-if="client.phone || client.email" class="contact-info">
                  <span v-if="client.phone" class="text-body-2" style="color: #546e7a;">
                    <v-icon icon="mdi-phone" size="small" color="primary" />
                    {{ client.phone }}
                  </span>
                  <span v-if="client.phone && client.email" class="contact-divider">•</span>
                  <span v-if="client.email" class="text-body-2" style="color: #546e7a;">
                    <v-icon icon="mdi-email" size="small" color="primary" />
                    {{ client.email }}
                  </span>
                </div>
              </div>
              <v-menu location="start">
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    v-bind="props"
                    color="primary"
                  />
                </template>
                <v-list density="compact" rounded="lg">
                  <v-list-item @click="openEditDialog(client)" class="hover-item">
                    <template #prepend>
                      <v-icon icon="mdi-pencil" size="small" color="primary" />
                    </template>
                    <v-list-item-title>עריכה</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="client.balance < 0"
                    @click="openDebtPaymentDialog(client)"
                    class="hover-item"
                  >
                    <template #prepend>
                      <v-icon icon="mdi-cash-plus" size="small" color="success" />
                    </template>
                    <v-list-item-title>רשום תשלום חוב</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <v-divider class="my-4" />

            <div class="client-details">
              <div class="detail-row">
                <v-icon icon="mdi-cash-multiple" size="small" color="primary" />
                <span class="detail-label">מחיר פגישה:</span>
                <v-chip
                  :color="getPriceColor(client.pricePerSession)"
                  size="small"
                  variant="flat"
                  class="font-weight-bold"
                >
                  ₪{{ client.pricePerSession }}
                </v-chip>
              </div>
              <div class="detail-row">
                <v-icon icon="mdi-calendar-refresh" size="small" color="primary" />
                <span class="detail-label">תדירות:</span>
                <span class="detail-value" style="color: #546e7a;">
                  {{ getFrequencyLabel(client.frequency) }}
                </span>
              </div>
              <div class="detail-row">
                <v-icon icon="mdi-calendar-check" size="small" color="primary" />
                <span class="detail-label">סה"כ פגישות:</span>
                <span class="detail-value font-weight-bold" style="color: #1976D2;">
                  {{ client.totalSessions }}
                </span>
              </div>
              <div class="detail-row">
                <v-icon
                  :icon="client.balance < 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"
                  size="small"
                  :color="client.balance < 0 ? 'error' : 'success'"
                />
                <span class="detail-label">יתרה:</span>
                <v-chip
                  :color="client.balance < 0 ? 'error' : 'success'"
                  size="small"
                  variant="elevated"
                  class="font-weight-bold clickable-chip"
                  @click="showBalanceDetails(client)"
                >
                  {{ client.balance < 0 ? 'חוב' : 'זכות' }}: ₪{{ Math.abs(client.balance) }}
                </v-chip>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="text-caption text-right" style="color: #78909c;">
              <v-icon icon="mdi-calendar-plus" size="small" color="primary" />
              נוסף: {{ formatDate(client.createdAt) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="filteredClients.length === 0" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-account-off" size="80" color="grey" class="mb-4" />
        <h3 class="text-h5 mb-2">אין לקוחות</h3>
        <p class="text-subtitle-1 text-medium-emphasis mb-4">
          {{ search ? 'לא נמצאו לקוחות התואמים לחיפוש' : 'התחל בהוספת לקוח ראשון' }}
        </p>
        <v-btn
          v-if="!search"
          color="primary"
          size="large"
          rounded="xl"
          @click="openAddDialog"
        >
          <v-icon icon="mdi-plus" />
          הוסף לקוח ראשון
        </v-btn>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600" @click:outside="closeDialog">
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-account-plus-outline" size="24" style="opacity: 0.8;" />
          <span class="text-h6">{{ editMode ? 'עריכת לקוח' : 'לקוח חדש' }}</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="saveClient">
            <v-text-field
              v-model="formData.name"
              label="שם מלא *"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-text-field
              v-model="formData.phone"
              label="טלפון"
              prepend-inner-icon="mdi-phone-outline"
              variant="outlined"
              rounded="lg"
              :rules="[rules.phone]"
              class="mb-4"
            />

            <v-text-field
              v-model="formData.email"
              label="אימייל"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              rounded="lg"
              :rules="[rules.email]"
              class="mb-4"
            />

            <v-select
              v-model="formData.pricePerSession"
              label="מחיר פגישה *"
              :items="[350, 400, 500]"
              prepend-inner-icon="mdi-cash"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-4"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #append>
                    <v-chip size="small" color="blue-grey-lighten-3">
                      ₪{{ item.value }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-select
              v-model="formData.frequency"
              label="תדירות הגעה *"
              :items="frequencyOptions"
              prepend-inner-icon="mdi-calendar-refresh"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-alert
              v-if="formData.previousDebt && formData.previousDebt > 0"
              type="error"
              variant="tonal"
              rounded="lg"
              class="mb-4 text-right"
              density="compact"
            >
              <strong>⚠️ יתווסף חוב של ₪{{ formData.previousDebt }}</strong>
            </v-alert>

            <v-text-field
              v-model.number="formData.previousDebt"
              label="הוספת חוב (אופציונלי)"
              prepend-inner-icon="mdi-alert-circle"
              variant="outlined"
              rounded="lg"
              type="number"
              :min="0"
              hint="💡 הזן סכום בלבד - למשל: 500 יוסיף חוב של ₪500"
              persistent-hint
              color="error"
              class="mb-4"
            >
              <template #prepend-inner>
                <v-icon icon="mdi-alert-circle" color="error" />
              </template>
              <template #append-inner>
                <span class="text-body-2 text-medium-emphasis">₪</span>
              </template>
            </v-text-field>

            <v-textarea
              v-model="formData.notes"
              label="הערות"
              prepend-inner-icon="mdi-note-text-outline"
              variant="outlined"
              rounded="lg"
              rows="3"
              class=""
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <!-- Delete button (only in edit mode) -->
          <v-btn
            v-if="editMode"
            color="error"
            variant="outlined"
            rounded="xl"
            size="large"
            @click="confirmDelete(clientToDelete)"
            class="px-6"
          >
            <v-icon icon="mdi-delete-outline" />
            מחק לקוח
          </v-btn>

          <v-spacer />

          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeDialog"
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
            :loading="saving"
            @click="saveClient"
            class="px-8"
          >
            <v-icon icon="mdi-check" />
            שמור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="pa-6 text-right">
          <v-icon icon="mdi-alert" color="error" />
          אישור מחיקה
        </v-card-title>
        <v-card-text class="pa-6 pt-0 text-right">
          <p>האם אתה בטוח שברצונך למחוק את <strong>{{ clientToDelete?.name }}</strong>?</p>
          <p class="text-caption text-error mt-2">פעולה זו אינה ניתנת לביטול</p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="showDeleteDialog = false"
            class="px-6"
          >
            ביטול
          </v-btn>
          <v-btn
            color="error"
            rounded="xl"
            variant="elevated"
            size="large"
            elevation="2"
            :loading="deleting"
            @click="deleteClient"
            class="px-6"
          >
            <v-icon icon="mdi-delete" />
            מחק
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                      <span class="font-weight-bold">{{ formatDate(addition.date) }}</span>
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
                      <span class="font-weight-bold">{{ formatDate(payment.date) }}</span>
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
                      <span class="font-weight-bold">{{ formatDate(apt.date) }}</span>
                      <v-chip size="x-small" color="primary" variant="flat">{{ apt.time }}</v-chip>
                      <v-chip size="x-small" v-if="!apt.attended" color="grey" variant="flat">לא הגיע</v-chip>
                      <v-chip size="x-small" v-if="apt.isGroup" color="purple" variant="tonal">קבוצה</v-chip>
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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Client, PaymentMethod } from '@/types/manage'

// State
const clients = ref<Client[]>([])
const search = ref('')
const priceFilter = ref<number | null>(null)
const sortBy = ref('name')
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const showBalanceDialog = ref(false)
const showDebtPaymentDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const loadingBalanceDetails = ref(false)
const savingDebtPayment = ref(false)
const clientToDelete = ref<Client | null>(null)
const selectedClientForBalance = ref<Client | null>(null)
const selectedClientForDebtPayment = ref<Client | null>(null)
const formRef = ref()

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

const formData = ref({
  name: '',
  phone: '',
  email: '',
  pricePerSession: 400,
  frequency: 'weekly' as 'weekly' | 'biweekly' | 'monthly',
  previousDebt: 0,
  notes: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const debtPaymentForm = ref({
  amount: 0,
  method: 'cash' as PaymentMethod,
  notes: ''
})

// Options
const priceOptions = [
  { title: '₪350', value: 350 },
  { title: '₪400', value: 400 },
  { title: '₪500', value: 500 }
]

const sortOptions = [
  { title: 'שם', value: 'name' },
  { title: 'תאריך הצטרפות', value: 'createdAt' },
  { title: 'מספר פגישות', value: 'totalSessions' },
  { title: 'יתרה', value: 'balance' }
]

const frequencyOptions = [
  { title: 'כל שבוע', value: 'weekly' },
  { title: 'פעם בשבועיים', value: 'biweekly' },
  { title: 'פעם בחודש', value: 'monthly' }
]

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'שדה חובה',
  phone: (value: string) => {
    if (!value) return true // Optional field
    const pattern = /^0\d{1,2}-?\d{7}$/
    return pattern.test(value) || 'מספר טלפון לא תקין'
  },
  email: (value: string) => {
    if (!value) return true // Optional field
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'כתובת אימייל לא תקינה'
  }
}

// Computed
const filteredClients = computed(() => {
  let result = [...clients.value]

  // Search
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      (c.phone && c.phone.includes(searchLower)) ||
      (c.email && c.email.toLowerCase().includes(searchLower))
    )
  }

  // Price Filter
  if (priceFilter.value) {
    result = result.filter(c => c.pricePerSession === priceFilter.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name, 'he')
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'totalSessions':
        return b.totalSessions - a.totalSessions
      case 'balance':
        return a.balance - b.balance
      default:
        return 0
    }
  })

  return result
})

// Methods
const loadClients = async () => {
  try {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    clients.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Client[]
  } catch (error) {
    console.error('Error loading clients:', error)
    showSnackbar('שגיאה בטעינת לקוחות', 'error')
  }
}

const openAddDialog = () => {
  editMode.value = false
  formData.value = {
    name: '',
    phone: '',
    email: '',
    pricePerSession: 400,
    frequency: 'weekly',
    previousDebt: 0,
    notes: ''
  }
  showDialog.value = true
}

const openEditDialog = (client: Client) => {
  editMode.value = true
  formData.value = {
    name: client.name,
    phone: client.phone || '',
    email: client.email || '',
    pricePerSession: client.pricePerSession,
    frequency: client.frequency || 'weekly',
    previousDebt: 0, // Reset to 0 - user can add adjustment
    notes: client.notes || ''
  }
  clientToDelete.value = client
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  formRef.value?.reset()
}

const saveClient = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editMode.value && clientToDelete.value) {
      // Update existing client
      const updateData: any = {
        name: formData.value.name,
        phone: formData.value.phone || null,
        email: formData.value.email || null,
        pricePerSession: formData.value.pricePerSession,
        frequency: formData.value.frequency,
        notes: formData.value.notes
      }

      // If user added debt, update balance (convert positive to negative = debt)
      let debtToAdd = formData.value.previousDebt || 0
      if (debtToAdd > 0) {
        // המשתמש הזין סכום חיובי - נהפוך לחוב (שלילי)
        debtToAdd = -Math.abs(debtToAdd)
      }

      if (debtToAdd !== 0) {
        const currentBalance = clientToDelete.value.balance || 0
        updateData.balance = currentBalance + debtToAdd

        // שמירת רשומת הוספת חוב להיסטוריה
        await addDoc(collection(db, 'debt_additions'), {
          clientId: clientToDelete.value.id,
          clientName: clientToDelete.value.name,
          amount: Math.abs(debtToAdd), // סכום חיובי להצגה
          date: Timestamp.fromDate(new Date()),
          notes: formData.value.notes || '',
          createdAt: Timestamp.fromDate(new Date())
        })
      }

      await updateDoc(doc(db, 'clients', clientToDelete.value.id), updateData)

      if (debtToAdd !== 0) {
        showSnackbar(`הלקוח עודכן בהצלחה (נוסף חוב: ₪${Math.abs(debtToAdd)})`, 'success')
      } else {
        showSnackbar('הלקוח עודכן בהצלחה', 'success')
      }
    } else {
      // Add new client
      // Convert positive debt input to negative (debt)
      let initialDebt = formData.value.previousDebt || 0
      if (initialDebt > 0) {
        // המשתמש הזין סכום חיובי - נהפוך לחוב (שלילי)
        initialDebt = -Math.abs(initialDebt)
      }

      const newClientRef = await addDoc(collection(db, 'clients'), {
        name: formData.value.name,
        phone: formData.value.phone || null,
        email: formData.value.email || null,
        pricePerSession: formData.value.pricePerSession,
        frequency: formData.value.frequency,
        notes: formData.value.notes,
        totalSessions: 0,
        balance: initialDebt, // חוב ראשוני
        createdAt: new Date()
      })

      // אם יש חוב ראשוני, שמור רשומה
      if (initialDebt !== 0) {
        await addDoc(collection(db, 'debt_additions'), {
          clientId: newClientRef.id,
          clientName: formData.value.name,
          amount: Math.abs(initialDebt), // סכום חיובי להצגה
          date: Timestamp.fromDate(new Date()),
          notes: 'חוב ראשוני',
          createdAt: Timestamp.fromDate(new Date())
        })

        showSnackbar(`הלקוח נוסף בהצלחה (חוב ראשוני: ₪${Math.abs(initialDebt)})`, 'success')
      } else {
        showSnackbar('הלקוח נוסף בהצלחה', 'success')
      }
    }
    closeDialog()
    await loadClients()
  } catch (error) {
    console.error('Error saving client:', error)
    showSnackbar('שגיאה בשמירת הלקוח', 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (client: Client | null) => {
  if (!client) return
  clientToDelete.value = client
  showDialog.value = false // Close edit dialog if open
  showDeleteDialog.value = true
}

const deleteClient = async () => {
  if (!clientToDelete.value) return

  deleting.value = true
  try {
    await deleteDoc(doc(db, 'clients', clientToDelete.value.id))
    showSnackbar('הלקוח נמחק בהצלחה', 'success')
    showDeleteDialog.value = false
    await loadClients()
  } catch (error) {
    console.error('Error deleting client:', error)
    showSnackbar('שגיאה במחיקת הלקוח', 'error')
  } finally {
    deleting.value = false
    clientToDelete.value = null
  }
}

const getPriceColor = (price: number) => {
  if (price === 350) return 'orange'
  if (price === 400) return 'primary'
  if (price === 500) return 'success'
  return 'grey'
}

const getFrequencyLabel = (frequency: string) => {
  if (frequency === 'weekly') return 'כל שבוע'
  if (frequency === 'biweekly') return 'פעם בשבועיים'
  if (frequency === 'monthly') return 'פעם בחודש'
  return 'כל שבוע'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
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
    showSnackbar('שגיאה בטעינת פירוט החוב', 'error')
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
    showSnackbar('אנא הזן סכום תקין', 'error')
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

    const balanceText = newBalance >= 0
      ? `₪${newBalance} (זכות)`
      : `₪${Math.abs(newBalance)} (חוב)`
    showSnackbar(`✅ התשלום נרשם! יתרה חדשה: ${balanceText}`, 'success')

    closeDebtPaymentDialog()
    await loadClients() // רענון הנתונים
  } catch (error) {
    console.error('Error saving debt payment:', error)
    showSnackbar('❌ שגיאה בשמירת התשלום', 'error')
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

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
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

// Lifecycle
onMounted(() => {
  loadClients()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');

.clients-container {
  max-width: 1400px;
  margin: 0 auto;
  color: #1e3a5f;
  font-family: 'Open Sans', 'Heebo', sans-serif;
}

.clients-container h2,
.clients-container h3,
.clients-container p {
  color: #1e3a5f;
  font-family: 'Open Sans', 'Heebo', sans-serif;
}

.client-card {
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  border: 1px solid #E0E0E0;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.client-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background: #B0BEC5;
}

.client-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: #B0BEC5;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.contact-divider {
  color: #B0BEC5;
  font-weight: 500;
  padding: 0 4px;
}

.client-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(25, 118, 210, 0.03);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.detail-row:hover {
  background: rgba(25, 118, 210, 0.08);
  transform: translateX(-2px);
}

.detail-row .v-icon {
  flex-shrink: 0;
  width: 24px;
}

.detail-label {
  font-weight: 600;
  color: #546e7a;
  font-size: 0.875rem;
  min-width: 110px;
  flex-shrink: 0;
}

.detail-value {
  font-weight: 700;
  font-size: 1rem;
}

.hover-item {
  transition: all 0.3s ease;
}

.hover-item:hover {
  background: rgba(25, 118, 210, 0.08);
}

.clickable-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

