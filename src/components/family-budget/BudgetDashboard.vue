<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-view-dashboard" size="32" color="primary" />
          דשבורד תקציב משפחתי
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          סקירה כללית של המצב הכלכלי שלך
        </p>
      </v-col>
    </v-row>

    <!-- Month Selector -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="selectedMonth"
          label="חודש"
          type="month"
          variant="outlined"
          rounded="lg"
          @update:model-value="loadData"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          color="primary"
          size="large"
          block
          rounded="lg"
          @click="loadData"
          :loading="loading"
        >
          <v-icon icon="mdi-refresh" start />
          רענן
        </v-btn>
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row>
      <!-- Total Income Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="3" color="green-lighten-5">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-4">
              <v-icon icon="mdi-cash-plus" size="48" color="success" />
              <v-chip color="success" variant="flat" size="large">
                ₪{{ totalIncome.toLocaleString() }}
              </v-chip>
            </div>
            <div class="text-h6 font-weight-bold">סה"כ הכנסות</div>
            <div class="text-body-2 text-medium-emphasis">{{ monthName }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Total Expenses Card -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="3" color="red-lighten-5">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-4">
              <v-icon icon="mdi-cash-minus" size="48" color="error" />
              <v-chip color="error" variant="flat" size="large">
                ₪{{ totalExpenses.toLocaleString() }}
              </v-chip>
            </div>
            <div class="text-h6 font-weight-bold">סה"כ הוצאות</div>
            <div class="text-body-2 text-medium-emphasis">{{ monthName }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Balance Card -->
      <v-col cols="12" md="4">
        <v-card
          rounded="xl"
          elevation="3"
          :color="balance >= 0 ? 'blue-lighten-5' : 'orange-lighten-5'"
        >
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-4">
              <v-icon
                :icon="balance >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                size="48"
                :color="balance >= 0 ? 'primary' : 'warning'"
              />
              <v-chip
                :color="balance >= 0 ? 'primary' : 'warning'"
                variant="flat"
                size="large"
              >
                ₪{{ Math.abs(balance).toLocaleString() }}
              </v-chip>
            </div>
            <div class="text-h6 font-weight-bold">
              {{ balance >= 0 ? 'עודף' : 'גירעון' }}
            </div>
            <div class="text-body-2 text-medium-emphasis">{{ monthName }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mt-4">
      <!-- Expenses by Category -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-5 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon icon="mdi-chart-pie" size="24" class="ml-2" />
              <span class="text-h6">הוצאות לפי קטגוריה</span>
            </div>
            <v-chip color="error" variant="flat" size="small">
              סה"כ: ₪{{ totalExpenses.toLocaleString() }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pa-4" style="min-height: 300px;">
            <canvas ref="expensesByCategoryChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Expenses by Payment Method -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-5">
            <v-icon icon="mdi-chart-donut" size="24" class="ml-2" />
            <span class="text-h6">הוצאות לפי אמצעי תשלום</span>
          </v-card-title>
          <v-card-text class="pa-4" style="min-height: 300px;">
            <canvas ref="expensesByPaymentMethodChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-5">
            <v-icon icon="mdi-lightning-bolt" size="24" class="ml-2" />
            <span class="text-h6">פעולות מהירות</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="success"
                  variant="tonal"
                  rounded="lg"
                  @click="$emit('navigate', 'quick-add')"
                >
                  <v-icon icon="mdi-plus-circle" start />
                  הזנה מהירה
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="error"
                  variant="tonal"
                  rounded="lg"
                  @click="$emit('navigate', 'expenses')"
                >
                  <v-icon icon="mdi-cash-minus" start />
                  הוצאות
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="success"
                  variant="tonal"
                  rounded="lg"
                  @click="$emit('navigate', 'income')"
                >
                  <v-icon icon="mdi-cash-plus" start />
                  הכנסות
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  block
                  size="large"
                  color="primary"
                  variant="tonal"
                  rounded="lg"
                  @click="$emit('navigate', 'monthly')"
                >
                  <v-icon icon="mdi-chart-line" start />
                  סיכום חודשי
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import type { BudgetExpense, BudgetIncome } from '@/types/family-budget'
import {
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  CATEGORY_COLORS,
} from '@/types/family-budget'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

defineEmits(['navigate'])

const selectedMonth = ref('')
const expenses = ref<BudgetExpense[]>([])
const income = ref<BudgetIncome[]>([])
const fixedExpenses = ref<any[]>([])
const loading = ref(false)
const expensesByCategoryChart = ref<HTMLCanvasElement | null>(null)
const expensesByPaymentMethodChart = ref<HTMLCanvasElement | null>(null)
let categoryChartInstance: Chart | null = null
let paymentMethodChartInstance: Chart | null = null

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

selectedMonth.value = getCurrentMonth()

const monthName = computed(() => {
  if (!selectedMonth.value) return ''
  const [year, month] = selectedMonth.value.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
})

const totalIncome = computed(() => {
  return income.value.reduce((sum, i) => sum + i.amount, 0)
})

const totalExpenses = computed(() => {
  const actualExpenses = expenses.value.reduce((sum, e) => sum + e.amount, 0)
  const fixedExpensesTotal = fixedExpenses.value
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0)
  return actualExpenses + fixedExpensesTotal
})

const balance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const expensesByCategory = computed(() => {
  const result: Record<string, number> = {}

  // Add actual expenses
  expenses.value.forEach((e) => {
    if (!result[e.category]) result[e.category] = 0
    result[e.category] += e.amount
  })

  // Add active fixed expenses
  fixedExpenses.value
    .filter((e) => e.isActive)
    .forEach((e) => {
      if (!result[e.category]) result[e.category] = 0
      result[e.category] += e.amount
    })

  return result
})

const expensesByPaymentMethod = computed(() => {
  const result: Record<string, number> = {}

  // Add actual expenses
  expenses.value.forEach((e) => {
    if (!result[e.paymentMethod]) result[e.paymentMethod] = 0
    result[e.paymentMethod] += e.amount
  })

  // Add active fixed expenses (they are usually standing-order)
  const fixedExpensesTotal = fixedExpenses.value
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0)

  if (fixedExpensesTotal > 0) {
    if (!result['standing-order']) result['standing-order'] = 0
    result['standing-order'] += fixedExpensesTotal
  }

  return result
})

const loadData = async () => {
  if (!selectedMonth.value) return

  loading.value = true
  try {
    // Load expenses
    const expensesQuery = query(
      collection(db, 'familyBudgetExpenses'),
      where('month', '==', selectedMonth.value),
    )
    const expensesSnapshot = await getDocs(expensesQuery)
    expenses.value = expensesSnapshot.docs.map((doc) => {
      const data = doc.data()
      // Handle backward compatibility: convert old 'type' to 'paymentMethod'
      let paymentMethod = data.paymentMethod
      if (!paymentMethod && data.type) {
        // Map old types to new payment methods
        const typeMap: Record<string, string> = {
          cash: 'cash',
          fixed: 'standing-order',
          variable: 'credit',
        }
        paymentMethod = typeMap[data.type] || 'credit'
      }
      return {
        id: doc.id,
        ...data,
        paymentMethod: paymentMethod || 'credit',
        date: data.date?.toDate() || new Date(),
      }
    }) as BudgetExpense[]

    // Load income
    const incomeQuery = query(
      collection(db, 'familyBudgetIncome'),
      where('month', '==', selectedMonth.value),
    )
    const incomeSnapshot = await getDocs(incomeQuery)
    income.value = incomeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as BudgetIncome[]

    // Load fixed expenses (active ones)
    const fixedExpensesSnapshot = await getDocs(collection(db, 'familyBudgetFixedExpenses'))
    fixedExpenses.value = fixedExpensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    await nextTick()
    renderCharts()
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  // Expenses by Category Chart
  if (expensesByCategoryChart.value) {
    if (categoryChartInstance) {
      categoryChartInstance.destroy()
    }

    const categoryData = expensesByCategory.value
    const labels = Object.keys(categoryData).map((k) => EXPENSE_CATEGORY_LABELS[k as any])
    const data = Object.values(categoryData)
    const colors = Object.keys(categoryData).map((k) => CATEGORY_COLORS[k as any])

    categoryChartInstance = new Chart(expensesByCategoryChart.value, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    })
  }

  // Expenses by Payment Method Chart
  if (expensesByPaymentMethodChart.value) {
    if (paymentMethodChartInstance) {
      paymentMethodChartInstance.destroy()
    }

    const paymentMethodData = expensesByPaymentMethod.value
    const labels = Object.keys(paymentMethodData).map((k) => PAYMENT_METHOD_LABELS[k as any])
    const data = Object.values(paymentMethodData)

    paymentMethodChartInstance = new Chart(expensesByPaymentMethodChart.value, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    })
  }
}

watch(selectedMonth, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
</style>

