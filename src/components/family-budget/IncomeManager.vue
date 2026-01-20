<template>
  <v-container>
    <v-row class="mb-3">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-1">
          <v-icon icon="mdi-cash-plus" size="24" color="success" />
          ניהול הכנסות
        </h2>
        <p class="text-body-2 text-medium-emphasis">
          צפייה ועריכת כל ההכנסות
        </p>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card rounded="xl" elevation="2" class="mb-4">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.month"
              label="חודש"
              type="month"
              variant="outlined"
              rounded="lg"
              clearable
              @update:model-value="loadIncome"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.category"
              label="קטגוריה"
              :items="incomeCategoryOptions"
              variant="outlined"
              rounded="lg"
              clearable
              @update:model-value="loadIncome"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="חיפוש"
              variant="outlined"
              rounded="lg"
              clearable
              prepend-inner-icon="mdi-magnify"
              placeholder="חפש לפי תיאור..."
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Income Table -->
    <v-card rounded="xl" elevation="2">
      <v-card-title class="pa-5 bg-green-lighten-5 d-flex justify-space-between align-center">
        <div>
          <v-icon icon="mdi-format-list-bulleted" size="24" class="ml-2" />
          <span class="text-h6">רשימת הכנסות</span>
        </div>
        <v-chip color="success" variant="flat" size="large">
          סה"כ: ₪{{ totalIncome.toLocaleString() }}
        </v-chip>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="filteredIncome"
          :loading="loading"
          :items-per-page="20"
          class="elevation-0"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.amount="{ item }">
            <v-chip color="success" variant="tonal" size="small">
              ₪{{ item.amount.toLocaleString() }}
            </v-chip>
          </template>

          <template #item.category="{ item }">
            <v-chip size="small" variant="tonal" color="primary">
              {{ INCOME_CATEGORY_LABELS[item.category] }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editIncome(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteIncome(item)"
            />
          </template>

          <template #no-data>
            <div class="pa-8 text-center">
              <v-icon icon="mdi-information-outline" size="48" color="grey" />
              <p class="text-h6 mt-4">אין הכנסות להצגה</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title class="pa-5 bg-green-lighten-5">
          <v-icon icon="mdi-pencil" size="24" class="ml-2" />
          <span class="text-h6">עריכת הכנסה</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="editForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedIncome.amount"
                  label="סכום"
                  type="number"
                  variant="outlined"
                  rounded="lg"
                  prefix="₪"
                  :rules="[required, positiveNumber]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedIncome.dateString"
                  label="תאריך"
                  type="date"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedIncome.category"
                  label="קטגוריה"
                  :items="incomeCategoryOptions"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedIncome.description"
                  label="תיאור"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedIncome.notes"
                  label="הערות"
                  variant="outlined"
                  rounded="lg"
                  rows="2"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">ביטול</v-btn>
          <v-btn color="primary" variant="flat" @click="saveIncome" :loading="saving">
            שמור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import type { BudgetIncome } from '@/types/family-budget'
import { INCOME_CATEGORY_LABELS } from '@/types/family-budget'

const loading = ref(false)
const saving = ref(false)
const income = ref<BudgetIncome[]>([])
const editDialog = ref(false)
const editedIncome = ref<any>({})
const editForm = ref<any>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const filters = ref({
  month: '',
  category: null,
  search: '',
})

const headers = [
  { title: 'תאריך', key: 'date', sortable: true },
  { title: 'סכום', key: 'amount', sortable: true },
  { title: 'קטגוריה', key: 'category', sortable: true },
  { title: 'תיאור', key: 'description', sortable: false },
  { title: 'הערות', key: 'notes', sortable: false },
  { title: 'פעולות', key: 'actions', sortable: false, align: 'center' },
]

const required = (v: any) => !!v || 'שדה חובה'
const positiveNumber = (v: number) => v > 0 || 'הסכום חייב להיות חיובי'

const incomeCategoryOptions = computed(() =>
  Object.entries(INCOME_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    title: label,
  })),
)

const filteredIncome = computed(() => {
  let result = [...income.value]

  if (filters.value.month) {
    result = result.filter((i) => i.month === filters.value.month)
  }

  if (filters.value.category) {
    result = result.filter((i) => i.category === filters.value.category)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter((i) =>
      i.description.toLowerCase().includes(search) ||
      (i.notes && i.notes.toLowerCase().includes(search))
    )
  }

  return result
})

const totalIncome = computed(() => {
  return filteredIncome.value.reduce((sum, i) => sum + i.amount, 0)
})

const loadIncome = async () => {
  loading.value = true
  try {
    const snapshot = await getDocs(collection(db, 'familyBudgetIncome'))
    income.value = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
      } as BudgetIncome
    })
  } catch (error) {
    console.error('Error loading income:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const editIncome = (incomeItem: BudgetIncome) => {
  editedIncome.value = {
    ...incomeItem,
    dateString: new Date(incomeItem.date).toISOString().split('T')[0],
  }
  editDialog.value = true
}

const saveIncome = async () => {
  const { valid } = await editForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const date = new Date(editedIncome.value.dateString)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    const updateData: any = {
      amount: editedIncome.value.amount,
      category: editedIncome.value.category,
      description: editedIncome.value.description,
      date: Timestamp.fromDate(date),
      month,
    }

    // Add notes only if it exists, otherwise remove it
    if (editedIncome.value.notes && editedIncome.value.notes.trim()) {
      updateData.notes = editedIncome.value.notes
    } else {
      updateData.notes = null
    }

    await updateDoc(doc(db, 'familyBudgetIncome', editedIncome.value.id), updateData)

    snackbarText.value = 'הכנסה עודכנה בהצלחה! ✓'
    snackbarColor.value = 'success'
    snackbar.value = true
    editDialog.value = false
    await loadIncome()
  } catch (error) {
    console.error('Error updating income:', error)
    snackbarText.value = 'שגיאה בעדכון הכנסה'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    saving.value = false
  }
}

const deleteIncome = async (incomeItem: BudgetIncome) => {
  if (!confirm(`האם למחוק את ההכנסה "${incomeItem.description}"?`)) return

  try {
    await deleteDoc(doc(db, 'familyBudgetIncome', incomeItem.id))
    snackbarText.value = 'הכנסה נמחקה בהצלחה! ✓'
    snackbarColor.value = 'success'
    snackbar.value = true
    await loadIncome()
  } catch (error) {
    console.error('Error deleting income:', error)
    snackbarText.value = 'שגיאה במחיקת הכנסה'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

onMounted(() => {
  loadIncome()
})
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
</style>

