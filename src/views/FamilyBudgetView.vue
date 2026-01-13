<template>
  <v-container fluid class="family-budget-container pa-0">
    <!-- Login Screen -->
    <v-dialog v-model="showLogin" persistent max-width="500">
      <v-card class="login-card" rounded="xl" elevation="8">
        <v-card-title class="text-center pa-8">
          <div class="w-100">
            <v-icon icon="mdi-home-analytics" size="64" color="primary" class="mb-4" />
            <h2 class="text-h4 mb-2">תקציב משפחתי</h2>
            <p class="text-subtitle-1 text-medium-emphasis">הכנס סיסמא לכניסה</p>
          </div>
        </v-card-title>

        <v-card-text class="px-8 pb-8">
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="אימייל"
              type="email"
              variant="outlined"
              rounded="lg"
              prepend-inner-icon="mdi-email"
              :error-messages="loginError"
              @input="loginError = ''"
              autofocus
              class="mb-4"
            />

            <v-text-field
              v-model="password"
              label="סיסמא"
              type="password"
              variant="outlined"
              rounded="lg"
              prepend-inner-icon="mdi-lock"
              :error-messages="loginError"
              @input="loginError = ''"
            />

            <v-btn
              type="submit"
              color="primary"
              size="large"
              rounded="xl"
              block
              elevation="4"
              :loading="loading"
              class="mt-4"
            >
              <v-icon icon="mdi-login" start />
              כניסה
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Main Family Budget Interface -->
    <div v-if="isAuthenticated" class="family-budget-main">
      <!-- Top App Bar -->
      <v-app-bar color="green-lighten-5" elevation="1" height="80">
        <v-container class="d-flex align-center">
          <v-icon icon="mdi-home-analytics" size="40" style="color: #66BB6A;" />
          <div>
            <h1 class="text-h5" style="color: #2E7D32; font-weight: 600;">תקציב משפחתי</h1>
            <p class="text-caption" style="color: #66BB6A;">ניהול הוצאות והכנסות של הבית</p>
          </div>
          <v-spacer />
          <v-btn icon="mdi-logout-variant" variant="text" @click="handleLogout" style="color: #43A047;" />
        </v-container>
      </v-app-bar>

      <!-- Tabs -->
      <v-tabs
        v-model="activeTab"
        bg-color="white"
        color="green-darken-2"
        align-tabs="center"
        class="tabs-clean elevation-1"
        direction="horizontal"
        slider-color="green-darken-2"
      >
        <v-tab value="dashboard" class="tab-clean">
          <v-icon icon="mdi-view-dashboard-outline" size="20" />
          דשבורד
        </v-tab>
        <v-tab value="quick-add" class="tab-clean">
          <v-icon icon="mdi-lightning-bolt" size="20" />
          הזנה מהירה
        </v-tab>
        <v-tab value="expenses" class="tab-clean">
          <v-icon icon="mdi-cash-minus" size="20" />
          הוצאות
        </v-tab>
        <v-tab value="income" class="tab-clean">
          <v-icon icon="mdi-cash-plus" size="20" />
          הכנסות
        </v-tab>
        <v-tab value="monthly" class="tab-clean">
          <v-icon icon="mdi-calendar-month" size="20" />
          סיכום חודשי
        </v-tab>
        <v-tab value="yearly" class="tab-clean">
          <v-icon icon="mdi-calendar-range" size="20" />
          סיכום שנתי
        </v-tab>
        <v-tab value="fixed-expenses" class="tab-clean">
          <v-icon icon="mdi-calendar-sync" size="20" />
          הוצאות קבועות
        </v-tab>
      </v-tabs>

      <!-- Tab Content -->
      <v-window v-model="activeTab" class="mt-4">
        <!-- Dashboard Tab -->
        <v-window-item value="dashboard">
          <BudgetDashboard @navigate="activeTab = $event" />
        </v-window-item>

        <!-- Quick Add Tab -->
        <v-window-item value="quick-add">
          <QuickAdd />
        </v-window-item>

        <!-- Expenses Tab -->
        <v-window-item value="expenses">
          <ExpensesManager />
        </v-window-item>

        <!-- Income Tab -->
        <v-window-item value="income">
          <IncomeManager />
        </v-window-item>

        <!-- Monthly Summary Tab -->
        <v-window-item value="monthly">
          <MonthlyBudgetDashboard />
        </v-window-item>

        <!-- Yearly Summary Tab -->
        <v-window-item value="yearly">
          <YearlyBudgetDashboard />
        </v-window-item>

        <!-- Fixed Expenses Tab -->
        <v-window-item value="fixed-expenses">
          <FixedExpensesManager />
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

// Components
import BudgetDashboard from '@/components/family-budget/BudgetDashboard.vue'
import QuickAdd from '@/components/family-budget/QuickAdd.vue'
import ExpensesManager from '@/components/family-budget/ExpensesManager.vue'
import IncomeManager from '@/components/family-budget/IncomeManager.vue'
import MonthlyBudgetDashboard from '@/components/family-budget/MonthlyBudgetDashboard.vue'
import YearlyBudgetDashboard from '@/components/family-budget/YearlyBudgetDashboard.vue'
import FixedExpensesManager from '@/components/family-budget/FixedExpensesManager.vue'

const router = useRouter()

// State
const isAuthenticated = ref(false)
const showLogin = ref(true)
const email = ref('')
const password = ref('')
const loginError = ref('')
const loading = ref(false)
const activeTab = ref('dashboard')

// Auth handlers
const handleLogin = async () => {
  if (!email.value || !password.value) {
    loginError.value = 'נא למלא את כל השדות'
    return
  }

  loading.value = true
  loginError.value = ''

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    isAuthenticated.value = true
    showLogin.value = false
  } catch (error: any) {
    console.error('Login error:', error)
    loginError.value = 'אימייל או סיסמא שגויים'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    isAuthenticated.value = false
    showLogin.value = true
    email.value = ''
    password.value = ''
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Check auth state on mount
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true
      showLogin.value = false
    } else {
      isAuthenticated.value = false
      showLogin.value = true
    }
  })
})
</script>

<style scoped>
.family-budget-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
}

.family-budget-main {
  min-height: 100vh;
}

.login-card {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
}

.tabs-clean {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.tab-clean {
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
  font-size: 0.95rem;
  gap: 8px;
}
</style>

