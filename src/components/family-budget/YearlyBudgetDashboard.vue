<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-calendar-range" size="32" color="primary" />
          סיכום שנתי
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          צפה בנתונים שנתיים וגרפים מפורטים
        </p>
      </v-col>
    </v-row>

    <!-- Year Selector -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedYear"
          label="שנה"
          :items="availableYears"
          variant="outlined"
          rounded="lg"
          @update:model-value="loadData"
        />
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <!-- Summary Cards -->
    <v-row v-if="!loading && yearlySummary">
      <v-col cols="12" md="3">
        <v-card rounded="xl" elevation="3" color="green-lighten-5">
          <v-card-text class="pa-5">
            <v-icon icon="mdi-cash-plus" size="40" color="success" class="mb-2" />
            <div class="text-h5 font-weight-bold">
              ₪{{ yearlySummary.totalIncome.toLocaleString() }}
            </div>
            <div class="text-body-2 text-medium-emphasis">סה"כ הכנסות {{ selectedYear }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" elevation="3" color="red-lighten-5">
          <v-card-text class="pa-5">
            <v-icon icon="mdi-cash-minus" size="40" color="error" class="mb-2" />
            <div class="text-h5 font-weight-bold">
              ₪{{ yearlySummary.totalExpenses.toLocaleString() }}
            </div>
            <div class="text-body-2 text-medium-emphasis">סה"כ הוצאות {{ selectedYear }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card
          rounded="xl"
          elevation="3"
          :color="yearlySummary.balance >= 0 ? 'blue-lighten-5' : 'orange-lighten-5'"
        >
          <v-card-text class="pa-5">
            <v-icon
              :icon="yearlySummary.balance >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
              size="40"
              :color="yearlySummary.balance >= 0 ? 'primary' : 'warning'"
              class="mb-2"
            />
            <div class="text-h5 font-weight-bold">
              ₪{{ Math.abs(yearlySummary.balance).toLocaleString() }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ yearlySummary.balance >= 0 ? 'עודף' : 'גירעון' }} שנתי
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" elevation="3" color="purple-lighten-5">
          <v-card-text class="pa-5">
            <v-icon icon="mdi-chart-bar" size="40" color="purple" class="mb-2" />
            <div class="text-h5 font-weight-bold">
              ₪{{ yearlySummary.avgMonthlyExpenses.toLocaleString() }}
            </div>
            <div class="text-body-2 text-medium-emphasis">ממוצע הוצאות חודשי</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row v-if="!loading && yearlySummary" class="mt-4">
      <!-- Monthly Trend -->
      <v-col cols="12">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-5">
            <v-icon icon="mdi-chart-line" size="24" class="ml-2" />
            <span class="text-h6">מגמה חודשית</span>
          </v-card-title>
          <v-card-text class="pa-4" style="min-height: 400px;">
            <canvas ref="monthlyTrendChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Income vs Expenses Comparison -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-5">
            <v-icon icon="mdi-chart-bar" size="24" class="ml-2" />
            <span class="text-h6">השוואת הכנסות והוצאות</span>
          </v-card-title>
          <v-card-text class="pa-4" style="min-height: 300px;">
            <canvas ref="comparisonChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Monthly Balance -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="pa-5">
            <v-icon icon="mdi-scale-balance" size="24" class="ml-2" />
            <span class="text-h6">יתרה חודשית</span>
          </v-card-title>
          <v-card-text class="pa-4" style="min-height: 300px;">
            <canvas ref="balanceChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="!loading && !yearlySummary" rounded="xl" elevation="2">
      <v-card-text class="pa-8 text-center">
        <v-icon icon="mdi-information-outline" size="64" color="grey" />
        <p class="text-h6 mt-4">אין נתונים לשנה {{ selectedYear }}</p>
        <p class="text-body-2 text-medium-emphasis">
          התחל להוסיף הוצאות והכנסות כדי לראות סיכום שנתי
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type {
  BudgetExpense,
  BudgetIncome,
  YearlyBudgetSummary,
  MonthlyBudgetSummary,
} from '@/types/family-budget'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const loading = ref(false)
const selectedYear = ref(new Date().getFullYear())
const yearlySummary = ref<YearlyBudgetSummary | null>(null)
const monthlyTrendChart = ref<HTMLCanvasElement | null>(null)
const comparisonChart = ref<HTMLCanvasElement | null>(null)
const balanceChart = ref<HTMLCanvasElement | null>(null)

let trendChartInstance: Chart | null = null
let comparisonChartInstance: Chart | null = null
let balanceChartInstance: Chart | null = null

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - i)
})

const loadData = async () => {
  loading.value = true
  try {
    // Load all expenses
    const expensesSnapshot = await getDocs(collection(db, 'familyBudgetExpenses'))
    const allExpenses = expensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as BudgetExpense[]

    // Load all income
    const incomeSnapshot = await getDocs(collection(db, 'familyBudgetIncome'))
    const allIncome = incomeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as BudgetIncome[]

    // Load fixed expenses (active ones)
    const fixedExpensesSnapshot = await getDocs(collection(db, 'familyBudgetFixedExpenses'))
    const fixedExpenses = fixedExpensesSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((e: any) => e.isActive)

    // Filter by year
    const yearPrefix = `${selectedYear.value}-`
    const expenses = allExpenses.filter((e) => e.month.startsWith(yearPrefix))
    const income = allIncome.filter((i) => i.month.startsWith(yearPrefix))

    if (expenses.length === 0 && income.length === 0) {
      yearlySummary.value = null
      return
    }

    // Group by month
    const monthsMap = new Map<string, { expenses: BudgetExpense[]; income: BudgetIncome[] }>()

    for (let m = 1; m <= 12; m++) {
      const month = `${selectedYear.value}-${String(m).padStart(2, '0')}`
      monthsMap.set(month, { expenses: [], income: [] })
    }

    expenses.forEach((e) => {
      if (monthsMap.has(e.month)) {
        monthsMap.get(e.month)!.expenses.push(e)
      }
    })

    income.forEach((i) => {
      if (monthsMap.has(i.month)) {
        monthsMap.get(i.month)!.income.push(i)
      }
    })

    // Calculate total fixed expenses per month
    const fixedExpensesTotal = fixedExpenses.reduce((sum: number, e: any) => sum + e.amount, 0)

    // Create monthly summaries
    const monthlyData: MonthlyBudgetSummary[] = []
    monthsMap.forEach((data, month) => {
      const totalIncome = data.income.reduce((sum, i) => sum + i.amount, 0)
      const actualExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0)
      const totalExpenses = actualExpenses + fixedExpensesTotal

      const [year, monthNum] = month.split('-')
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString(
        'he-IL',
        { month: 'short' },
      )

      monthlyData.push({
        month,
        monthName,
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        expensesByCategory: {} as any,
        expensesByType: {} as any,
        incomeByCategory: {} as any,
      })
    })

    // Calculate yearly summary
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
    const actualExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    // Add fixed expenses for all 12 months
    const totalExpenses = actualExpenses + (fixedExpensesTotal * 12)

    const monthsWithData = monthlyData.filter((m) => m.totalIncome > 0 || m.totalExpenses > 0)
    const avgMonthlyIncome = monthsWithData.length > 0 ? totalIncome / monthsWithData.length : 0
    const avgMonthlyExpenses =
      monthsWithData.length > 0 ? totalExpenses / monthsWithData.length : 0

    const sortedByExpenses = [...monthlyData].sort(
      (a, b) => b.totalExpenses - a.totalExpenses,
    )

    yearlySummary.value = {
      year: selectedYear.value,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      monthlyData,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      highestExpenseMonth: sortedByExpenses[0]?.monthName || '',
      lowestExpenseMonth: sortedByExpenses[sortedByExpenses.length - 1]?.monthName || '',
    }

    await nextTick()
    renderCharts()
  } catch (error) {
    console.error('Error loading yearly data:', error)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  if (!yearlySummary.value) return

  const labels = yearlySummary.value.monthlyData.map((m) => m.monthName)
  const incomeData = yearlySummary.value.monthlyData.map((m) => m.totalIncome)
  const expensesData = yearlySummary.value.monthlyData.map((m) => m.totalExpenses)
  const balanceData = yearlySummary.value.monthlyData.map((m) => m.balance)

  // Monthly Trend Chart
  if (monthlyTrendChart.value) {
    if (trendChartInstance) trendChartInstance.destroy()

    trendChartInstance = new Chart(monthlyTrendChart.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'הכנסות',
            data: incomeData,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
          },
          {
            label: 'הוצאות',
            data: expensesData,
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    })
  }

  // Comparison Chart
  if (comparisonChart.value) {
    if (comparisonChartInstance) comparisonChartInstance.destroy()

    comparisonChartInstance = new Chart(comparisonChart.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'הכנסות',
            data: incomeData,
            backgroundColor: '#4CAF50',
          },
          {
            label: 'הוצאות',
            data: expensesData,
            backgroundColor: '#F44336',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    })
  }

  // Balance Chart
  if (balanceChart.value) {
    if (balanceChartInstance) balanceChartInstance.destroy()

    balanceChartInstance = new Chart(balanceChart.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'יתרה',
            data: balanceData,
            backgroundColor: balanceData.map((v) => (v >= 0 ? '#2196F3' : '#FF9800')),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    })
  }
}

watch(selectedYear, () => {
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

