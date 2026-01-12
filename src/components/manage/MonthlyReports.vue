<template>
  <v-container class="reports-container">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-chart-line" size="32" color="primary" />
          דוחות חודשיים
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          סיכום הכנסות, הוצאות ורווח נטו לפי חודשים
        </p>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedMonth"
          :items="monthOptions"
          item-title="label"
          item-value="value"
          label="בחר חודש לפירוט"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-calendar-month"
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Monthly Reports Table -->
    <v-card rounded="xl" elevation="2" class="mb-6">
      <v-card-title class="pa-5 text-right section-header-clean">
        <v-icon icon="mdi-calendar-month" size="24" style="opacity: 0.8;" />
        <span class="text-h6">סיכום חודשי מפורט</span>
      </v-card-title>

      <v-card-text class="pa-0">
        <div style="overflow-x: auto;">
          <v-table>
            <thead>
              <tr>
                <th class="text-right font-weight-bold">חודש</th>
                <th class="text-right font-weight-bold">פגישות</th>
                <th class="text-right font-weight-bold">הכנסות (כולל חובות)</th>
                <th class="text-right font-weight-bold">שולם בפועל</th>
                <th class="text-right font-weight-bold">הוצאות</th>
                <th class="text-right font-weight-bold">רווח נטו</th>
                <th class="text-right font-weight-bold">חוב</th>
                <th class="text-right font-weight-bold">אחוז גבייה</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="report in monthlyReports"
                :key="report.month"
                class="report-row"
              >
                <td class="text-right font-weight-bold">{{ report.monthName }}</td>
                <td class="text-right">{{ report.totalAppointments }}</td>
                <td class="text-right">
                  <v-chip color="info" variant="flat" size="small" class="font-weight-bold">
                    ₪{{ report.expectedRevenue.toLocaleString() }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-chip color="success" variant="tonal" size="small">
                    ₪{{ report.actualPaid.toLocaleString() }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-chip color="error" variant="tonal" size="small">
                    ₪{{ report.totalExpenses.toLocaleString() }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-chip
                    :color="report.netProfit >= 0 ? 'primary' : 'error'"
                    variant="flat"
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ report.netProfit >= 0 ? '+' : '' }}₪{{ report.netProfit.toLocaleString() }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-chip
                    :color="report.debt > 0 ? 'warning' : 'success'"
                    variant="tonal"
                    size="small"
                  >
                    {{ report.debt > 0 ? '-' : '' }}₪{{ Math.abs(report.debt).toLocaleString() }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-chip
                    :color="getPercentageColor(report.collectionRate)"
                    variant="flat"
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ report.collectionRate }}%
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
    </v-card>

    <!-- Selected Month Details -->
    <v-card v-if="selectedMonth" rounded="xl" elevation="2" class="mb-6">
      <v-card-title class="pa-5 text-right section-header-clean">
        <v-icon icon="mdi-calendar-text" size="24" style="opacity: 0.8;" />
        <span class="text-h6">פירוט מפורט - {{ selectedMonthReport?.monthName }}</span>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-row v-if="selectedMonthReport">
          <!-- Summary Cards -->
          <v-col cols="12" md="3">
            <v-card color="primary" variant="tonal" rounded="lg">
              <v-card-text class="text-center pa-4">
                <v-icon icon="mdi-cash-multiple" size="40" color="primary" class="mb-2" />
                <div class="text-h5 font-weight-bold">₪{{ selectedMonthReport.expectedRevenue.toLocaleString() }}</div>
                <div class="text-caption">הכנסות כולל חובות</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="success" variant="tonal" rounded="lg">
              <v-card-text class="text-center pa-4">
                <v-icon icon="mdi-cash-check" size="40" color="success" class="mb-2" />
                <div class="text-h5 font-weight-bold">₪{{ selectedMonthReport.actualPaid.toLocaleString() }}</div>
                <div class="text-caption">שולם בפועל</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card color="error" variant="tonal" rounded="lg">
              <v-card-text class="text-center pa-4">
                <v-icon icon="mdi-credit-card-outline" size="40" color="error" class="mb-2" />
                <div class="text-h5 font-weight-bold">₪{{ selectedMonthReport.totalExpenses.toLocaleString() }}</div>
                <div class="text-caption">הוצאות</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card :color="selectedMonthReport.netProfit >= 0 ? 'blue' : 'error'" variant="tonal" rounded="lg">
              <v-card-text class="text-center pa-4">
                <v-icon icon="mdi-chart-line-variant" size="40" :color="selectedMonthReport.netProfit >= 0 ? 'blue' : 'error'" class="mb-2" />
                <div class="text-h5 font-weight-bold">₪{{ selectedMonthReport.netProfit.toLocaleString() }}</div>
                <div class="text-caption">רווח נטו</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Monthly Detailed Charts -->
        <v-row class="mt-4">
          <!-- Daily Revenue Chart -->
          <v-col cols="12" md="6">
            <v-card rounded="lg" elevation="1">
              <v-card-title class="text-subtitle-1 pa-4">
                <v-icon icon="mdi-calendar-today" size="20" class="ml-2" />
                הכנסות יומיות
              </v-card-title>
              <v-card-text>
                <Line
                  v-if="dailyRevenueChartData"
                  :data="dailyRevenueChartData"
                  :options="dailyChartOptions"
                  style="max-height: 250px;"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Payment Methods Chart -->
          <v-col cols="12" md="6">
            <v-card rounded="lg" elevation="1">
              <v-card-title class="text-subtitle-1 pa-4">
                <v-icon icon="mdi-wallet" size="20" class="ml-2" />
                אמצעי תשלום
              </v-card-title>
              <v-card-text>
                <Pie
                  v-if="paymentMethodsChartData"
                  :data="paymentMethodsChartData"
                  :options="pieChartOptions"
                  style="max-height: 250px;"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Appointment Types Chart -->
          <v-col cols="12" md="6">
            <v-card rounded="lg" elevation="1">
              <v-card-title class="text-subtitle-1 pa-4">
                <v-icon icon="mdi-account-group" size="20" class="ml-2" />
                סוגי פגישות
              </v-card-title>
              <v-card-text>
                <Pie
                  v-if="appointmentTypesChartData"
                  :data="appointmentTypesChartData"
                  :options="pieChartOptions"
                  style="max-height: 250px;"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Top Clients Chart -->
          <v-col cols="12" md="6">
            <v-card rounded="lg" elevation="1">
              <v-card-title class="text-subtitle-1 pa-4">
                <v-icon icon="mdi-star" size="20" class="ml-2" />
                לקוחות מובילים (תשלומים)
              </v-card-title>
              <v-card-text>
                <Bar
                  v-if="topClientsChartData"
                  :data="topClientsChartData"
                  :options="horizontalBarOptions"
                  style="max-height: 250px;"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Annual Charts Row -->
    <v-row>
      <!-- Revenue vs Expenses Chart -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2" class="chart-card">
          <v-card-title class="pa-5 text-right">
            <v-icon icon="mdi-chart-bar" size="24" color="primary" class="ml-2" />
            <span class="text-h6">סקירה כספית מלאה</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <Bar
              v-if="!loading && revenueExpensesChartData"
              :data="revenueExpensesChartData"
              :options="chartOptions"
              style="max-height: 300px;"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Net Profit Chart -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2" class="chart-card">
          <v-card-title class="pa-5 text-right">
            <v-icon icon="mdi-chart-line" size="24" color="primary" class="ml-2" />
            <span class="text-h6">רווח נטו</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <Line
              v-if="!loading && netProfitChartData"
              :data="netProfitChartData"
              :options="lineChartOptions"
              style="max-height: 300px;"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Collection Rate Chart -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2" class="chart-card">
          <v-card-title class="pa-5 text-right">
            <v-icon icon="mdi-percent" size="24" color="primary" class="ml-2" />
            <span class="text-h6">אחוז גבייה</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <Line
              v-if="!loading && collectionRateChartData"
              :data="collectionRateChartData"
              :options="percentageChartOptions"
              style="max-height: 300px;"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Expense Breakdown Pie -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="2" class="chart-card">
          <v-card-title class="pa-5 text-right">
            <v-icon icon="mdi-chart-pie" size="24" color="primary" class="ml-2" />
            <span class="text-h6">פילוח הוצאות חודשי ממוצע</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <Pie
              v-if="!loading && expenseBreakdownData"
              :data="expenseBreakdownData"
              :options="pieChartOptions"
              style="max-height: 300px;"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Appointment } from '@/types/manage'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface MonthlyReport {
  month: string
  monthName: string
  totalAppointments: number
  expectedRevenue: number
  actualPaid: number
  totalExpenses: number
  netProfit: number
  debt: number
  collectionRate: number
}

interface DebtPayment {
  date: Date
  amount: number
}

interface FixedExpense {
  name: string
  amount: number
}

interface VariableExpense {
  name: string
  amount: number
  date: Date
}

// State
const loading = ref(true)
const monthlyReports = ref<MonthlyReport[]>([])
const fixedExpenses = ref<FixedExpense[]>([])
const variableExpenses = ref<VariableExpense[]>([])
const selectedMonth = ref<string | null>(null)
const allAppointments = ref<Appointment[]>([])

// Month options for selector
const monthOptions = computed(() => {
  return monthlyReports.value.map(report => ({
    label: report.monthName,
    value: report.month
  }))
})

// Selected month report
const selectedMonthReport = computed(() => {
  if (!selectedMonth.value) return null
  return monthlyReports.value.find(r => r.month === selectedMonth.value)
})

// Selected month appointments
const selectedMonthAppointments = computed(() => {
  if (!selectedMonth.value) return []
  return allAppointments.value.filter(apt => {
    const monthKey = getMonthKey(apt.date)
    return monthKey === selectedMonth.value && apt.attended
  })
})

// Daily Revenue Chart for selected month
const dailyRevenueChartData = computed(() => {
  if (!selectedMonth.value || selectedMonthAppointments.value.length === 0) return null

  const dailyRevenue: Record<number, number> = {}

  selectedMonthAppointments.value.forEach(apt => {
    const day = apt.date.getDate()
    const revenue = getAppointmentPaid(apt)
    dailyRevenue[day] = (dailyRevenue[day] || 0) + revenue
  })

  const days = Object.keys(dailyRevenue).map(Number).sort((a, b) => a - b)
  const revenues = days.map(day => dailyRevenue[day])

  return {
    labels: days.map(d => d.toString()),
    datasets: [{
      label: 'הכנסות יומיות',
      data: revenues,
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderColor: 'rgb(76, 175, 80)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  }
})

// Payment Methods Chart for selected month
const paymentMethodsChartData = computed(() => {
  if (!selectedMonth.value || selectedMonthAppointments.value.length === 0) return null

  const methodTotals: Record<string, number> = {
    cash: 0,
    transfer: 0,
    credit: 0,
    check: 0
  }

  selectedMonthAppointments.value.forEach(apt => {
    if (apt.isGroup && apt.groupParticipants) {
      apt.groupParticipants.forEach(p => {
        if (p.attended && p.payments) {
          p.payments.forEach(payment => {
            methodTotals[payment.method] = (methodTotals[payment.method] || 0) + payment.amount
          })
        }
      })
    } else if (apt.payments) {
      apt.payments.forEach(payment => {
        methodTotals[payment.method] = (methodTotals[payment.method] || 0) + payment.amount
      })
    }
  })

  const labels = {
    cash: 'מזומן',
    transfer: 'העברה',
    credit: 'אשראי',
    check: 'צ\'ק'
  }

  const colors = {
    cash: 'rgba(76, 175, 80, 0.8)',
    transfer: 'rgba(33, 150, 243, 0.8)',
    credit: 'rgba(255, 152, 0, 0.8)',
    check: 'rgba(156, 39, 176, 0.8)'
  }

  const data = Object.entries(methodTotals)
    .filter(([_, amount]) => amount > 0)
    .map(([method, amount]) => ({ method, amount }))

  return {
    labels: data.map(d => labels[d.method as keyof typeof labels]),
    datasets: [{
      data: data.map(d => d.amount),
      backgroundColor: data.map(d => colors[d.method as keyof typeof colors]),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

// Appointment Types Chart
const appointmentTypesChartData = computed(() => {
  if (!selectedMonth.value || selectedMonthAppointments.value.length === 0) return null

  let regularCount = 0
  let groupCount = 0
  let regularRevenue = 0
  let groupRevenue = 0

  selectedMonthAppointments.value.forEach(apt => {
    if (apt.isGroup) {
      groupCount++
      groupRevenue += getAppointmentPaid(apt)
    } else {
      regularCount++
      regularRevenue += getAppointmentPaid(apt)
    }
  })

  return {
    labels: ['פגישות רגילות', 'פגישות קבוצה'],
    datasets: [{
      data: [regularRevenue, groupRevenue],
      backgroundColor: [
        'rgba(33, 150, 243, 0.8)',
        'rgba(156, 39, 176, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

// Top Clients Chart
const topClientsChartData = computed(() => {
  if (!selectedMonth.value || selectedMonthAppointments.value.length === 0) return null

  const clientPayments: Record<string, { name: string, total: number }> = {}

  selectedMonthAppointments.value.forEach(apt => {
    if (apt.isGroup && apt.groupParticipants) {
      apt.groupParticipants.forEach(p => {
        if (p.attended) {
          const paid = p.payments?.reduce((sum, pay) => sum + pay.amount, 0) || 0
          if (!clientPayments[p.clientId]) {
            clientPayments[p.clientId] = { name: p.clientName, total: 0 }
          }
          clientPayments[p.clientId].total += paid
        }
      })
    } else {
      const paid = getAppointmentPaid(apt)
      if (!clientPayments[apt.clientId]) {
        clientPayments[apt.clientId] = { name: apt.clientName, total: 0 }
      }
      clientPayments[apt.clientId].total += paid
    }
  })

  const topClients = Object.values(clientPayments)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  return {
    labels: topClients.map(c => c.name),
    datasets: [{
      label: 'תשלומים',
      data: topClients.map(c => c.total),
      backgroundColor: 'rgba(33, 150, 243, 0.7)',
      borderColor: 'rgb(33, 150, 243)',
      borderWidth: 2
    }]
  }
})

// Annual Chart data
const revenueExpensesChartData = computed(() => {
  if (monthlyReports.value.length === 0) return null

  const labels = monthlyReports.value.map(r => r.monthName).reverse()
  const expectedRevenues = monthlyReports.value.map(r => r.expectedRevenue).reverse()
  const actualRevenues = monthlyReports.value.map(r => r.actualPaid).reverse()
  const expenses = monthlyReports.value.map(r => r.totalExpenses).reverse()

  return {
    labels,
    datasets: [
      {
        label: 'הכנסות (כולל חובות)',
        data: expectedRevenues,
        backgroundColor: 'rgba(33, 150, 243, 0.7)',
        borderColor: 'rgb(33, 150, 243)',
        borderWidth: 2
      },
      {
        label: 'שולם בפועל',
        data: actualRevenues,
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgb(76, 175, 80)',
        borderWidth: 2
      },
      {
        label: 'הוצאות',
        data: expenses,
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: 'rgb(244, 67, 54)',
        borderWidth: 2
      }
    ]
  }
})

const netProfitChartData = computed(() => {
  if (monthlyReports.value.length === 0) return null

  const labels = monthlyReports.value.map(r => r.monthName).reverse()
  const profits = monthlyReports.value.map(r => r.netProfit).reverse()

  return {
    labels,
    datasets: [
      {
        label: 'רווח נטו',
        data: profits,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: 'rgb(33, 150, 243)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const collectionRateChartData = computed(() => {
  if (monthlyReports.value.length === 0) return null

  const labels = monthlyReports.value.map(r => r.monthName).reverse()
  const rates = monthlyReports.value.map(r => r.collectionRate).reverse()

  return {
    labels,
    datasets: [
      {
        label: 'אחוז גבייה',
        data: rates,
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        borderColor: 'rgb(156, 39, 176)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const expenseBreakdownData = computed(() => {
  if (fixedExpenses.value.length === 0 && variableExpenses.value.length === 0) return null

  // Calculate average variable expenses per month
  const monthlyVariableExpenses: Record<string, number> = {}
  variableExpenses.value.forEach(exp => {
    const monthKey = getMonthKey(exp.date)
    monthlyVariableExpenses[monthKey] = (monthlyVariableExpenses[monthKey] || 0) + exp.amount
  })

  const avgVariableExpenses = Object.values(monthlyVariableExpenses).length > 0
    ? Object.values(monthlyVariableExpenses).reduce((a, b) => a + b, 0) / Object.values(monthlyVariableExpenses).length
    : 0

  const totalFixed = fixedExpenses.value.reduce((sum, exp) => sum + exp.amount, 0)

  // Group fixed expenses by category
  const labels: string[] = []
  const data: number[] = []
  const colors: string[] = []

  fixedExpenses.value.forEach((exp, idx) => {
    labels.push(exp.name)
    data.push(exp.amount)
    colors.push(`hsl(${idx * 360 / fixedExpenses.value.length}, 70%, 60%)`)
  })

  if (avgVariableExpenses > 0) {
    labels.push('הוצאות משתנות (ממוצע)')
    data.push(Math.round(avgVariableExpenses))
    colors.push('hsl(0, 70%, 60%)')
  }

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      rtl: true,
      labels: {
        font: {
          family: 'Heebo, sans-serif',
          size: 12
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => '₪' + value.toLocaleString()
      }
    }
  }
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      rtl: true,
      labels: {
        font: {
          family: 'Heebo, sans-serif',
          size: 12
        }
      }
    },
    datalabels: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return context.dataset.label + ': ₪' + context.parsed.y.toLocaleString()
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (value: any) => '₪' + value.toLocaleString()
      }
    }
  },
  elements: {
    point: {
      radius: 5,
      hoverRadius: 7
    }
  }
}

const percentageChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      rtl: true,
      labels: {
        font: {
          family: 'Heebo, sans-serif',
          size: 12
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value: any) => value + '%'
      }
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'right' as const,
      rtl: true,
      labels: {
        font: {
          family: 'Heebo, sans-serif',
          size: 11
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return context.label + ': ₪' + context.parsed.toLocaleString()
        }
      }
    }
  }
}

const dailyChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => '₪' + value.toLocaleString()
      }
    },
    x: {
      title: {
        display: true,
        text: 'יום בחודש'
      }
    }
  }
}

const horizontalBarOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => '₪' + value.toLocaleString()
      }
    }
  }
}

// Load data and calculate reports
const loadReports = async () => {
  loading.value = true
  try {
    // Load appointments
    const appointmentsSnapshot = await getDocs(collection(db, 'appointments'))
    const appointments: Appointment[] = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date()
      } as Appointment
    })

    // Store all appointments for monthly details
    allAppointments.value = appointments

    // Load debt payments
    const debtPaymentsSnapshot = await getDocs(collection(db, 'debt_payments'))
    const debtPayments: DebtPayment[] = debtPaymentsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        date: data.date?.toDate() || new Date(),
        amount: data.amount || 0
      }
    })

    // Load fixed expenses
    const fixedExpensesSnapshot = await getDocs(collection(db, 'fixed_expenses'))
    fixedExpenses.value = fixedExpensesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        name: data.name,
        amount: data.amount || 0
      }
    }) as FixedExpense[]

    // Load variable expenses
    const variableExpensesSnapshot = await getDocs(collection(db, 'variable_expenses'))
    variableExpenses.value = variableExpensesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        name: data.name,
        amount: data.amount || 0,
        date: data.date?.toDate() || new Date()
      }
    }) as VariableExpense[]

    // Group appointments by month
    const monthlyData: Record<string, {
      appointments: Appointment[]
      expectedRevenue: number
      paidInMonth: number
      debt: number
      expenses: number
    }> = {}

    appointments.forEach(apt => {
      const monthKey = getMonthKey(apt.date)

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          appointments: [],
          expectedRevenue: 0,
          paidInMonth: 0,
          debt: 0,
          expenses: 0
        }
      }

      monthlyData[monthKey].appointments.push(apt)

      if (apt.attended) {
        const price = getAppointmentPrice(apt)
        monthlyData[monthKey].expectedRevenue += price

        const paid = getAppointmentPaid(apt)
        monthlyData[monthKey].paidInMonth += paid
        monthlyData[monthKey].debt += (price - paid)
      }
    })

    // Add fixed expenses to each month
    const totalFixedExpensesPerMonth = fixedExpenses.value.reduce((sum, exp) => sum + exp.amount, 0)
    Object.keys(monthlyData).forEach(monthKey => {
      monthlyData[monthKey].expenses += totalFixedExpensesPerMonth
    })

    // Add variable expenses
    variableExpenses.value.forEach(exp => {
      const monthKey = getMonthKey(exp.date)
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += exp.amount
      }
    })

    // Distribute debt payments (FIFO)
    distributeDebtPayments(monthlyData, debtPayments)

    // Create reports array
    const reports: MonthlyReport[] = []
    const sortedMonths = Object.keys(monthlyData).sort()

    sortedMonths.forEach(monthKey => {
      const data = monthlyData[monthKey]
      const collectionRate = data.expectedRevenue > 0
        ? Math.round((data.paidInMonth / data.expectedRevenue) * 100)
        : 0

      reports.push({
        month: monthKey,
        monthName: formatMonthName(monthKey),
        totalAppointments: data.appointments.filter((apt: Appointment) => apt.attended).length,
        expectedRevenue: data.expectedRevenue,
        actualPaid: data.paidInMonth,
        totalExpenses: data.expenses,
        netProfit: data.expectedRevenue - data.expenses, // רווח נטו לפי הכנסות אמיתיות (כולל חובות)
        debt: data.debt,
        collectionRate
      })
    })

    monthlyReports.value = reports.reverse()

    // Auto-select the most recent month
    if (monthlyReports.value.length > 0 && !selectedMonth.value) {
      selectedMonth.value = monthlyReports.value[0].month
    }
  } catch (error) {
    console.error('Error loading reports:', error)
    alert('שגיאה בטעינת הדוחות')
  } finally {
    loading.value = false
  }
}

// Distribute debt payments across months (FIFO)
const distributeDebtPayments = (
  monthlyData: Record<string, any>,
  debtPayments: DebtPayment[]
) => {
  const sortedMonths = Object.keys(monthlyData).sort()
  const sortedPayments = debtPayments.sort((a, b) => a.date.getTime() - b.date.getTime())

  sortedPayments.forEach(payment => {
    let remainingPayment = payment.amount

    for (const monthKey of sortedMonths) {
      if (remainingPayment <= 0) break

      const monthData = monthlyData[monthKey]
      if (monthData.debt > 0) {
        const paymentForMonth = Math.min(remainingPayment, monthData.debt)
        monthData.paidInMonth += paymentForMonth
        monthData.debt -= paymentForMonth
        remainingPayment -= paymentForMonth
      }
    }
  })
}

// Helper functions
const getMonthKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  return `${year}-${month}`
}

const formatMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split('-')
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ]
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

const getAppointmentPrice = (apt: Appointment): number => {
  if (apt.isGroup && apt.groupParticipants) {
    return apt.groupParticipants.filter(p => p.attended).length * (apt.groupPrice || 0)
  }
  return apt.price || 0
}

const getAppointmentPaid = (apt: Appointment): number => {
  if (apt.isGroup && apt.groupParticipants) {
    return apt.groupParticipants
      .filter(p => p.attended)
      .reduce((sum, p) => {
        return sum + (p.payments?.reduce((s, pay) => s + (pay.amount || 0), 0) || 0)
      }, 0)
  }
  return apt.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
}

const getPercentageColor = (percentage: number): string => {
  if (percentage >= 90) return 'success'
  if (percentage >= 70) return 'warning'
  return 'error'
}

// Lifecycle
onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.reports-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header-clean {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.report-row {
  transition: background-color 0.2s;
}

.report-row:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.chart-card {
  min-height: 400px;
}
</style>

