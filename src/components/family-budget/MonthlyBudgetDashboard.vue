<template>
  <v-container>
    <v-row class="mb-3">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-1">
          <v-icon icon="mdi-calendar-month" size="24" color="primary" />
          סיכום חודשי מפורט
        </h2>
        <p class="text-body-2 text-medium-emphasis">
          צפה בסיכומים חודשיים עם השוואות
        </p>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <!-- Monthly Summaries -->
    <v-row>
      <v-col
        v-for="summary in monthlySummaries"
        :key="summary.month"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card rounded="xl" elevation="3" class="monthly-card">
          <v-card-title class="pa-4 bg-blue-lighten-5">
            <div class="w-100 d-flex justify-space-between align-center">
              <span class="text-subtitle-1 font-weight-bold">{{ summary.monthName }}</span>
              <v-chip
                :color="summary.balance >= 0 ? 'success' : 'error'"
                variant="flat"
                size="small"
              >
                {{ summary.balance >= 0 ? '+' : '' }}₪{{ summary.balance.toLocaleString() }}
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text class="pa-3">
            <!-- Income -->
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-icon icon="mdi-cash-plus" color="success" size="20" class="ml-2" />
                <span class="text-body-2 font-weight-bold">הכנסות:</span>
              </div>
              <v-chip color="success" variant="tonal" size="small">
                ₪{{ summary.totalIncome.toLocaleString() }}
              </v-chip>
            </div>

            <!-- Expenses -->
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-icon icon="mdi-cash-minus" color="error" size="20" class="ml-2" />
                <span class="text-body-2 font-weight-bold">הוצאות:</span>
              </div>
              <v-chip color="error" variant="tonal" size="small">
                ₪{{ summary.totalExpenses.toLocaleString() }}
              </v-chip>
            </div>

            <v-divider class="my-2" />

            <!-- Top 3 Expense Categories -->
            <div class="text-caption font-weight-bold mb-2">קטגוריות עיקריות:</div>
            <div
              v-for="(amount, category) in getTopCategories(summary.expensesByCategory)"
              :key="category"
              class="d-flex justify-space-between align-center mb-1 text-caption"
            >
              <span>{{ EXPENSE_CATEGORY_LABELS[category] }}</span>
              <span class="text-medium-emphasis">₪{{ amount.toLocaleString() }}</span>
            </div>

            <v-btn
              block
              variant="tonal"
              color="primary"
              size="small"
              rounded="lg"
              class="mt-3"
              @click="viewDetails(summary.month)"
            >
              צפה בפירוט
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="!loading && monthlySummaries.length === 0" rounded="xl" elevation="2">
      <v-card-text class="pa-6 text-center">
        <v-icon icon="mdi-information-outline" size="48" color="grey" />
        <p class="text-subtitle-1 font-weight-bold mt-3">אין נתונים חודשיים</p>
        <p class="text-body-2 text-medium-emphasis">
          התחל להוסיף הוצאות והכנסות כדי לראות סיכומים
        </p>
      </v-card-text>
    </v-card>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800">
      <v-card v-if="selectedMonthDetails" rounded="xl">
        <v-card-title class="pa-5 bg-blue-lighten-5">
          <v-icon icon="mdi-calendar-month" size="24" class="ml-2" />
          <span class="text-h6">פירוט {{ selectedMonthDetails.monthName }}</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Summary -->
          <v-row class="mb-4">
            <v-col cols="4">
              <v-card color="green-lighten-5" elevation="0">
                <v-card-text class="text-center pa-4">
                  <div class="text-h6 font-weight-bold text-success">
                    ₪{{ selectedMonthDetails.totalIncome.toLocaleString() }}
                  </div>
                  <div class="text-caption">הכנסות</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card color="red-lighten-5" elevation="0">
                <v-card-text class="text-center pa-4">
                  <div class="text-h6 font-weight-bold text-error">
                    ₪{{ selectedMonthDetails.totalExpenses.toLocaleString() }}
                  </div>
                  <div class="text-caption">הוצאות</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card
                :color="selectedMonthDetails.balance >= 0 ? 'blue-lighten-5' : 'orange-lighten-5'"
                elevation="0"
              >
                <v-card-text class="text-center pa-4">
                  <div
                    class="text-h6 font-weight-bold"
                    :class="selectedMonthDetails.balance >= 0 ? 'text-primary' : 'text-warning'"
                  >
                    {{ selectedMonthDetails.balance >= 0 ? '+' : '' }}₪{{
                      selectedMonthDetails.balance.toLocaleString()
                    }}
                  </div>
                  <div class="text-caption">יתרה</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Expenses by Category -->
          <div class="mb-4">
            <h3 class="text-h6 mb-3">פירוט הוצאות לפי קטגוריה</h3>
            <v-list density="compact">
              <v-list-item
                v-for="(amount, category) in selectedMonthDetails.expensesByCategory"
                :key="category"
              >
                <template #prepend>
                  <v-icon icon="mdi-circle" size="small" color="primary" />
                </template>
                <v-list-item-title>
                  {{ EXPENSE_CATEGORY_LABELS[category] }}
                </v-list-item-title>
                <template #append>
                  <v-chip size="small" color="error" variant="tonal">
                    ₪{{ amount.toLocaleString() }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <!-- Expenses by Payment Method -->
          <div>
            <h3 class="text-h6 mb-3">פירוט הוצאות לפי אמצעי תשלום</h3>
            <v-list density="compact">
              <v-list-item
                v-for="(amount, paymentMethod) in selectedMonthDetails.expensesByPaymentMethod"
                :key="paymentMethod"
              >
                <template #prepend>
                  <v-icon icon="mdi-circle" size="small" color="success" />
                </template>
                <v-list-item-title>
                  {{ PAYMENT_METHOD_LABELS[paymentMethod] }}
                </v-list-item-title>
                <template #append>
                  <v-chip size="small" color="error" variant="tonal">
                    ₪{{ amount.toLocaleString() }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="detailsDialog = false">סגור</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type {
  BudgetExpense,
  BudgetIncome,
  MonthlyBudgetSummary,
  ExpenseCategory,
} from '@/types/family-budget'
import { EXPENSE_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '@/types/family-budget'

const loading = ref(false)
const monthlySummaries = ref<MonthlyBudgetSummary[]>([])
const detailsDialog = ref(false)
const selectedMonthDetails = ref<MonthlyBudgetSummary | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    // Load all expenses
    const expensesSnapshot = await getDocs(collection(db, 'familyBudgetExpenses'))
    const expenses = expensesSnapshot.docs.map((doc) => {
      const data = doc.data()
      // Handle backward compatibility: convert old 'type' to 'paymentMethod'
      let paymentMethod = data.paymentMethod
      if (!paymentMethod && data.type) {
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
      } as BudgetExpense
    })

    // Load all income
    const incomeSnapshot = await getDocs(collection(db, 'familyBudgetIncome'))
    const incomeData = incomeSnapshot.docs.map((doc) => ({
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

    // Group by month
    const monthsMap = new Map<string, { expenses: BudgetExpense[]; income: BudgetIncome[] }>()

    expenses.forEach((e) => {
      if (!monthsMap.has(e.month)) {
        monthsMap.set(e.month, { expenses: [], income: [] })
      }
      monthsMap.get(e.month)!.expenses.push(e)
    })

    incomeData.forEach((i) => {
      if (!monthsMap.has(i.month)) {
        monthsMap.set(i.month, { expenses: [], income: [] })
      }
      monthsMap.get(i.month)!.income.push(i)
    })

    // Create summaries
    const summaries: MonthlyBudgetSummary[] = []

    // Calculate total fixed expenses per month
    const fixedExpensesTotal = fixedExpenses.reduce((sum: number, e: any) => sum + e.amount, 0)

    monthsMap.forEach((data, month) => {
      const totalIncome = data.income.reduce((sum, i) => sum + i.amount, 0)
      const actualExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0)
      const totalExpenses = actualExpenses + fixedExpensesTotal

      const expensesByCategory: Record<ExpenseCategory, number> = {} as any

      // Add actual expenses
      data.expenses.forEach((e) => {
        if (!expensesByCategory[e.category]) {
          expensesByCategory[e.category] = 0
        }
        expensesByCategory[e.category] += e.amount
      })

      // Add fixed expenses
      fixedExpenses.forEach((e: any) => {
        if (!expensesByCategory[e.category]) {
          expensesByCategory[e.category] = 0
        }
        expensesByCategory[e.category] += e.amount
      })

      const expensesByPaymentMethod: any = {}
      data.expenses.forEach((e) => {
        if (!expensesByPaymentMethod[e.paymentMethod]) {
          expensesByPaymentMethod[e.paymentMethod] = 0
        }
        expensesByPaymentMethod[e.paymentMethod] += e.amount
      })

      // Add fixed expenses to standing-order
      if (fixedExpensesTotal > 0) {
        if (!expensesByPaymentMethod['standing-order']) {
          expensesByPaymentMethod['standing-order'] = 0
        }
        expensesByPaymentMethod['standing-order'] += fixedExpensesTotal
      }

      const incomeByCategory: any = {}
      data.income.forEach((i) => {
        if (!incomeByCategory[i.category]) {
          incomeByCategory[i.category] = 0
        }
        incomeByCategory[i.category] += i.amount
      })

      const [year, monthNum] = month.split('-')
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString(
        'he-IL',
        { month: 'long', year: 'numeric' },
      )

      summaries.push({
        month,
        monthName,
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        expensesByCategory,
        expensesByPaymentMethod,
        incomeByCategory,
      })
    })

    // Sort by month descending
    summaries.sort((a, b) => b.month.localeCompare(a.month))

    monthlySummaries.value = summaries
  } catch (error) {
    console.error('Error loading monthly data:', error)
  } finally {
    loading.value = false
  }
}

const getTopCategories = (expensesByCategory: Record<ExpenseCategory, number>) => {
  const sorted = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])
  return Object.fromEntries(sorted.slice(0, 3))
}

const viewDetails = (month: string) => {
  const summary = monthlySummaries.value.find((s) => s.month === month)
  if (summary) {
    selectedMonthDetails.value = summary
    detailsDialog.value = true
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}

.monthly-card {
  transition: transform 0.2s;
}

.monthly-card:hover {
  transform: translateY(-4px);
}
</style>

