<template>
  <v-container class="d-flex justify-center">
    <div style="max-width: 700px; width: 100%;">
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-2">
            <v-icon icon="mdi-lightning-bolt" size="32" color="primary" />
            הזנה מהירה
          </h2>
          <p class="text-subtitle-1 text-medium-emphasis">
            הוסף הוצאות והכנסות בקלות ובמהירות
          </p>
        </v-col>
      </v-row>

    <!-- Toggle between Expense and Income -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn-toggle
          v-model="activeType"
          color="primary"
          variant="outlined"
          divided
          mandatory
          class="w-100"
        >
          <v-btn value="expense" size="large" class="flex-grow-1">
            <v-icon icon="mdi-cash-minus" start />
            הוצאה
          </v-btn>
          <v-btn value="income" size="large" class="flex-grow-1">
            <v-icon icon="mdi-cash-plus" start />
            הכנסה
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Quick Add Expense Form -->
    <v-card v-if="activeType === 'expense'" rounded="xl" elevation="3" class="mb-6">
      <v-card-title class="pa-5 bg-red-lighten-5">
        <v-icon icon="mdi-cash-minus" size="24" color="error" class="ml-2" />
        <span class="text-h6">הוצאה חדשה</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="expenseForm" @submit.prevent="addExpense">
          <v-row>
            <!-- Amount -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="expense.amount"
                label="סכום *"
                type="number"
                variant="outlined"
                rounded="lg"
                prefix="₪"
                :rules="[required, positiveNumber]"
                autofocus
              />
            </v-col>

            <!-- Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="expense.date"
                label="תאריך *"
                type="date"
                variant="outlined"
                rounded="lg"
                :rules="[required]"
              />
            </v-col>

            <!-- Payment Method -->
            <v-col cols="12" md="6">
              <v-select
                v-model="expense.paymentMethod"
                label="אמצעי תשלום *"
                :items="paymentMethods"
                item-title="label"
                item-value="value"
                variant="outlined"
                rounded="lg"
                :rules="[required]"
              />
            </v-col>

            <!-- Category -->
            <v-col cols="12" md="6">
              <v-select
                v-model="expense.category"
                label="קטגוריה *"
                :items="expenseCategories"
                item-title="label"
                item-value="value"
                variant="outlined"
                rounded="lg"
                :rules="[required]"
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-text-field
                v-model="expense.description"
                label="תיאור"
                variant="outlined"
                rounded="lg"
                placeholder="לדוגמא: קניות בסופר, תדלוק, ביגוד וכו'"
              />
            </v-col>

            <!-- Notes -->
            <v-col cols="12">
              <v-textarea
                v-model="expense.notes"
                label="הערות"
                variant="outlined"
                rounded="lg"
                rows="2"
                placeholder="הערות נוספות (אופציונלי)"
              />
            </v-col>

            <!-- Submit Button -->
            <v-col cols="12">
              <v-btn
                type="submit"
                color="error"
                size="large"
                block
                rounded="lg"
                :loading="loading"
              >
                <v-icon icon="mdi-content-save" start />
                שמירה
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Quick Add Income Form -->
    <v-card v-if="activeType === 'income'" rounded="xl" elevation="3" class="mb-6">
      <v-card-title class="pa-5 bg-green-lighten-5">
        <v-icon icon="mdi-cash-plus" size="24" color="success" class="ml-2" />
        <span class="text-h6">הכנסה חדשה</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="incomeForm" @submit.prevent="addIncome">
          <v-row>
            <!-- Amount -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="income.amount"
                label="סכום *"
                type="number"
                variant="outlined"
                rounded="lg"
                prefix="₪"
                :rules="[required, positiveNumber]"
                autofocus
              />
            </v-col>

            <!-- Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="income.date"
                label="תאריך *"
                type="date"
                variant="outlined"
                rounded="lg"
                :rules="[required]"
              />
            </v-col>

            <!-- Category -->
            <v-col cols="12">
              <v-select
                v-model="income.category"
                label="קטגוריה *"
                :items="incomeCategories"
                item-title="label"
                item-value="value"
                variant="outlined"
                rounded="lg"
                :rules="[required]"
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-text-field
                v-model="income.description"
                label="תיאור"
                variant="outlined"
                rounded="lg"
                placeholder="לדוגמא: משכורת פברואר, העברה מעסק וכו'"
              />
            </v-col>

            <!-- Notes -->
            <v-col cols="12">
              <v-textarea
                v-model="income.notes"
                label="הערות"
                variant="outlined"
                rounded="lg"
                rows="2"
                placeholder="הערות נוספות (אופציונלי)"
              />
            </v-col>

            <!-- Submit Button -->
            <v-col cols="12">
              <v-btn
                type="submit"
                color="success"
                size="large"
                block
                rounded="lg"
                :loading="loading"
              >
                <v-icon icon="mdi-content-save" start />
                שמירה
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import type {
  BudgetExpense,
  BudgetIncome,
  PaymentMethod,
  ExpenseCategory,
  IncomeCategory,
} from '@/types/family-budget'
import {
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  INCOME_CATEGORY_LABELS,
} from '@/types/family-budget'

const activeType = ref<'expense' | 'income'>('expense')
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Forms refs
const expenseForm = ref<any>(null)
const incomeForm = ref<any>(null)

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Expense form data
const expense = ref({
  amount: 0,
  paymentMethod: 'credit' as PaymentMethod,
  category: 'food' as ExpenseCategory,
  description: '',
  date: getTodayDate(),
  notes: '',
})

// Income form data
const income = ref({
  amount: 0,
  category: 'salary-payslip' as IncomeCategory,
  description: '',
  date: getTodayDate(),
  notes: '',
})

// Validation rules
const required = (v: any) => !!v || 'שדה חובה'
const positiveNumber = (v: number) => v > 0 || 'הסכום חייב להיות חיובי'

// Payment methods for select
const paymentMethods = computed(() =>
  Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
)

// Expense categories for select
const expenseCategories = computed(() =>
  Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
)

// Income categories for select
const incomeCategories = computed(() =>
  Object.entries(INCOME_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
)

// Add expense
const addExpense = async () => {
  const { valid } = await expenseForm.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const date = new Date(expense.value.date)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    const expenseData: any = {
      amount: expense.value.amount,
      paymentMethod: expense.value.paymentMethod,
      category: expense.value.category,
      date: Timestamp.fromDate(date),
      month,
      createdAt: Timestamp.fromDate(new Date()),
    }

    // Add description only if it exists
    if (expense.value.description && expense.value.description.trim()) {
      expenseData.description = expense.value.description
    }

    // Add notes only if it exists
    if (expense.value.notes && expense.value.notes.trim()) {
      expenseData.notes = expense.value.notes
    }

    await addDoc(collection(db, 'familyBudgetExpenses'), expenseData)

    snackbarText.value = 'הוצאה נוספה בהצלחה! ✓'
    snackbarColor.value = 'success'
    snackbar.value = true

    // Reset form
    expense.value = {
      amount: 0,
      paymentMethod: 'credit',
      category: 'food',
      description: '',
      date: getTodayDate(),
      notes: '',
    }
    expenseForm.value.reset()
  } catch (error) {
    console.error('Error adding expense:', error)
    snackbarText.value = 'שגיאה בהוספת הוצאה'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

// Add income
const addIncome = async () => {
  const { valid } = await incomeForm.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const date = new Date(income.value.date)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    const incomeData: any = {
      amount: income.value.amount,
      category: income.value.category,
      date: Timestamp.fromDate(date),
      month,
      createdAt: Timestamp.fromDate(new Date()),
    }

    // Add description only if it exists
    if (income.value.description && income.value.description.trim()) {
      incomeData.description = income.value.description
    }

    // Add notes only if it exists
    if (income.value.notes && income.value.notes.trim()) {
      incomeData.notes = income.value.notes
    }

    await addDoc(collection(db, 'familyBudgetIncome'), incomeData)

    snackbarText.value = 'הכנסה נוספה בהצלחה! ✓'
    snackbarColor.value = 'success'
    snackbar.value = true

    // Reset form
    income.value = {
      amount: 0,
      category: 'salary-payslip',
      description: '',
      date: getTodayDate(),
      notes: '',
    }
    incomeForm.value.reset()
  } catch (error) {
    console.error('Error adding income:', error)
    snackbarText.value = 'שגיאה בהוספת הכנסה'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.ml-2 {
  margin-left: 8px;
}
</style>

