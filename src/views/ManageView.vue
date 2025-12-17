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

    <!-- Main Management Interface -->
    <div v-if="isAuthenticated" class="manage-main">
      <!-- Top App Bar -->
      <v-app-bar color="blue-grey-lighten-5" elevation="1" height="80">
        <v-container class="d-flex align-center">
          <v-icon icon="mdi-clipboard-text-outline" size="40" style="color: #78909C;" />
          <div>
            <h1 class="text-h5" style="color: #37474F; font-weight: 600;">מערכת ניהול סולתרפיה</h1>
            <p class="text-caption" style="color: #78909C;">ברוך הבא, משה יצחק</p>
          </div>
          <v-spacer />
          <v-btn icon="mdi-logout-variant" variant="text" @click="handleLogout" style="color: #546E7A;" />
        </v-container>
      </v-app-bar>

      <!-- Tabs -->
      <v-tabs
        v-model="activeTab"
        bg-color="white"
        color="blue-grey-darken-2"
        align-tabs="center"
        class="tabs-clean elevation-1"
        direction="horizontal"
        slider-color="blue-grey-darken-2"
      >
        <v-tab value="dashboard" class="tab-clean">
          <v-icon icon="mdi-view-dashboard-outline" size="20" />
          דשבורד
        </v-tab>
        <v-tab value="clients" class="tab-clean">
          <v-icon icon="mdi-account-group-outline" size="20" />
          לקוחות
        </v-tab>
        <v-tab value="schedule" class="tab-clean">
          <v-icon icon="mdi-calendar-month-outline" size="20" />
          יומן שבועי
        </v-tab>
        <v-tab value="prize" class="tab-clean">
          <v-icon icon="mdi-gift-outline" size="20" />
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
  background: linear-gradient(135deg, #B0BEC5 0%, #90A4AE 100%);
}

.login-card {
  background: white;
}

.manage-main {
  min-height: 100vh;
  background: #F5F7FA;
}

/* Clean Tabs */
.tabs-clean {
  border-bottom: 1px solid #E0E0E0;
}

.tab-clean {
  color: #546E7A !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.95rem;
}

.tab-clean:hover {
  background-color: #ECEFF1;
}
</style>

