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
          <v-icon icon="mdi-plus" size="20" class="ms-2" />
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
                  <v-icon icon="mdi-account-circle" size="small" class="ms-1" color="primary" />
                  {{ client.name }}
                </h3>
                <p class="text-body-2" style="color: #546e7a;">
                  <v-icon icon="mdi-phone" size="small" class="ms-1" color="primary" />
                  {{ client.phone }}
                </p>
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
                  <v-list-item @click="confirmDelete(client)" class="hover-item">
                    <template #prepend>
                      <v-icon icon="mdi-delete" size="small" color="error" />
                    </template>
                    <v-list-item-title class="text-error">מחיקה</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <v-divider class="my-4" />

            <div class="client-details">
              <div class="detail-row">
                <v-icon icon="mdi-cash-multiple" size="small" color="primary" class="ms-1" />
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
                <v-icon icon="mdi-calendar-check" size="small" color="primary" class="ms-1" />
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
                  class="ms-1"
                />
                <span class="detail-label">יתרה:</span>
                <v-chip
                  :color="client.balance < 0 ? 'error' : 'success'"
                  size="small"
                  variant="elevated"
                  class="font-weight-bold"
                >
                  {{ client.balance < 0 ? 'חוב' : 'זכות' }}: ₪{{ Math.abs(client.balance) }}
                </v-chip>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="text-caption text-right" style="color: #78909c;">
              <v-icon icon="mdi-calendar-plus" size="small" class="ms-1" color="primary" />
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
          <v-icon icon="mdi-plus" class="ms-2" />
          הוסף לקוח ראשון
        </v-btn>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600" @click:outside="closeDialog">
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right section-header-clean">
          <v-icon icon="mdi-account-plus-outline" size="24" class="ms-2" style="opacity: 0.8;" />
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
              label="טלפון *"
              prepend-inner-icon="mdi-phone-outline"
              variant="outlined"
              rounded="lg"
              :rules="[rules.required, rules.phone]"
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

        <v-card-actions class="pa-6 pt-0 d-flex justify-start">
          <v-btn
            color="blue-grey-darken-2"
            rounded="xl"
            variant="flat"
            size="large"
            :loading="saving"
            @click="saveClient"
            class="px-6"
          >
            <v-icon icon="mdi-content-save-outline" size="18" class="ms-2" />
            שמירה
          </v-btn>
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeDialog"
            class="px-6"
          >
            ביטול
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="pa-6 text-right">
          אישור מחיקה
          <v-icon icon="mdi-alert" color="error" class="me-2" />
        </v-card-title>
        <v-card-text class="pa-6 pt-0 text-right">
          <p>האם אתה בטוח שברצונך למחוק את <strong>{{ clientToDelete?.name }}</strong>?</p>
          <p class="text-caption text-error mt-2">פעולה זו אינה ניתנת לביטול</p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-btn color="error" rounded="xl" :loading="deleting" @click="deleteClient">מחיקה</v-btn>
          <v-btn variant="text" @click="showDeleteDialog = false">ביטול</v-btn>
          <v-spacer />
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
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Client } from '@/types/manage'

// State
const clients = ref<Client[]>([])
const search = ref('')
const priceFilter = ref<number | null>(null)
const sortBy = ref('name')
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const clientToDelete = ref<Client | null>(null)
const formRef = ref()

const formData = ref({
  name: '',
  phone: '',
  pricePerSession: 400,
  notes: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
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

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'שדה חובה',
  phone: (value: string) => {
    const pattern = /^0\d{1,2}-?\d{7}$/
    return pattern.test(value) || 'מספר טלפון לא תקין'
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
      c.phone.includes(searchLower)
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
    pricePerSession: 400,
    notes: ''
  }
  showDialog.value = true
}

const openEditDialog = (client: Client) => {
  editMode.value = true
  formData.value = {
    name: client.name,
    phone: client.phone,
    pricePerSession: client.pricePerSession,
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
      await updateDoc(doc(db, 'clients', clientToDelete.value.id), {
        name: formData.value.name,
        phone: formData.value.phone,
        pricePerSession: formData.value.pricePerSession,
        notes: formData.value.notes
      })
      showSnackbar('הלקוח עודכן בהצלחה', 'success')
    } else {
      // Add new client
      await addDoc(collection(db, 'clients'), {
        name: formData.value.name,
        phone: formData.value.phone,
        pricePerSession: formData.value.pricePerSession,
        notes: formData.value.notes,
        totalSessions: 0,
        balance: 0,
        createdAt: new Date()
      })
      showSnackbar('הלקוח נוסף בהצלחה', 'success')
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

const confirmDelete = (client: Client) => {
  clientToDelete.value = client
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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
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

.client-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(25, 118, 210, 0.03);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.detail-row:hover {
  background: rgba(25, 118, 210, 0.08);
  transform: translateX(-2px);
}

.detail-label {
  font-weight: 600;
  color: #546e7a;
  font-size: 0.875rem;
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
</style>

