<template>
  <v-container fluid class="manage-container pa-0">
    <!-- Login Screen -->
    <v-dialog v-model="showLogin" persistent max-width="500">
      <v-card class="login-card" rounded="xl" elevation="8">
        <v-card-title class="text-center pa-8">
          <div class="w-100">
            <v-icon icon="mdi-shield-lock" size="64" color="primary" class="mb-4" />
            <h2 class="text-h4 mb-2">מערכת ניהול</h2>
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
              dir="ltr"
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
              dir="rtl"
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

    <!-- Main Management Interface -->
    <div v-if="isAuthenticated" class="manage-main">
      <!-- Top App Bar -->
      <v-app-bar color="primary" elevation="4" height="80" dir="rtl">
        <v-container class="d-flex align-center">
          <v-btn icon="mdi-logout" @click="handleLogout" class="ms-2" />
          <v-spacer />
          <div class="text-right">
            <h1 class="text-h5">מערכת ניהול סולתרפיה</h1>
            <p class="text-caption">ברוך הבא, משה יצחק</p>
          </div>
          <v-icon icon="mdi-clipboard-text" size="40" class="me-4" />
        </v-container>
      </v-app-bar>

      <!-- Tabs -->
      <v-tabs v-model="activeTab" bg-color="surface" color="primary" align-tabs="center" class="mt-2" dir="rtl" direction="horizontal">
        <v-tab value="dashboard">
          <v-icon icon="mdi-view-dashboard" class="ms-2" />
          דשבורד
        </v-tab>
        <v-tab value="clients">
          <v-icon icon="mdi-account-group" class="ms-2" />
          לקוחות
        </v-tab>
        <v-tab value="schedule">
          <v-icon icon="mdi-calendar-week" class="ms-2" />
          יומן שבועי
        </v-tab>
        <v-tab value="prize">
          <v-icon icon="mdi-gift" class="ms-2" />
          הפרס השבועי
        </v-tab>
      </v-tabs>

      <!-- Tab Content -->
      <v-window v-model="activeTab" class="mt-4">
        <!-- Dashboard Tab -->
        <v-window-item value="dashboard">
          <Dashboard @navigate="activeTab = $event" />
        </v-window-item>

        <!-- Clients Tab -->
        <v-window-item value="clients">
          <ClientsManager />
        </v-window-item>

        <!-- Schedule Tab -->
        <v-window-item value="schedule">
          <WeeklySchedule />
        </v-window-item>

        <!-- Prize Tab -->
        <v-window-item value="prize">
          <WeeklyPrize />
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import Dashboard from '@/components/manage/Dashboard.vue'
import ClientsManager from '@/components/manage/ClientsManager.vue'
import WeeklySchedule from '@/components/manage/WeeklySchedule.vue'
import WeeklyPrize from '@/components/manage/WeeklyPrize.vue'

// State
const showLogin = ref(true)
const isAuthenticated = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')
const loading = ref(false)
const activeTab = ref('dashboard')

// Authentication
const handleLogin = async () => {
  loading.value = true
  loginError.value = ''

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    showLogin.value = false
    isAuthenticated.value = true
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.code === 'auth/user-not-found') {
      loginError.value = 'משתמש לא קיים'
    } else if (error.code === 'auth/wrong-password') {
      loginError.value = 'סיסמא שגויה'
    } else if (error.code === 'auth/invalid-credential') {
      loginError.value = 'אימייל או סיסמא שגויים'
    } else if (error.code === 'auth/invalid-email') {
      loginError.value = 'כתובת אימייל לא תקינה'
    } else {
      loginError.value = 'שגיאה בהתחברות. נסה שוב.'
    }
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    showLogin.value = true
    isAuthenticated.value = false
    email.value = ''
    password.value = ''
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Check authentication state on mount
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
.manage-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
}

.manage-main {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>

