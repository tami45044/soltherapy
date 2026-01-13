<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-cash-minus" size="32" color="error" />
          ניהול הוצאות
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          צפייה ועריכת כל ההוצאות
        </p>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card rounded="xl" elevation="2" class="mb-4">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.month"
              label="חודש"
              type="month"
              variant="outlined"
              rounded="lg"
              clearable
              @update:model-value="loadExpenses"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.paymentMethod"
              label="אמצעי תשלום"
              :items="paymentMethodOptions"
              variant="outlined"
              rounded="lg"
              clearable
              @update:model-value="loadExpenses"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.category"
              label="קטגוריה"
              :items="expenseCategoryOptions"
              variant="outlined"
              rounded="lg"
              clearable
              @update:model-value="loadExpenses"
            />
          </v-col>
          <v-col cols="12" md="3">
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

    <!-- Expenses Table -->
    <v-card rounded="xl" elevation="2">
      <v-card-title class="pa-5 bg-red-lighten-5 d-flex justify-space-between align-center">
        <div>
          <v-icon icon="mdi-format-list-bulleted" size="24" class="ml-2" />
          <span class="text-h6">רשימת הוצאות</span>
        </div>
        <v-chip color="error" variant="flat" size="large">
          סה"כ: ₪{{ totalExpenses.toLocaleString() }}
        </v-chip>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="filteredExpenses"
          :loading="loading"
          :items-per-page="20"
          class="elevation-0"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.amount="{ item }">
            <v-chip color="error" variant="tonal" size="small">
              ₪{{ item.amount.toLocaleString() }}
            </v-chip>
          </template>

          <template #item.paymentMethod="{ item }">
            <v-chip size="small" variant="tonal">
              {{ PAYMENT_METHOD_LABELS[item.paymentMethod] }}
            </v-chip>
          </template>

          <template #item.category="{ item }">
            <v-chip size="small" variant="tonal" color="primary">
              {{ EXPENSE_CATEGORY_LABELS[item.category] }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editExpense(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteExpense(item)"
            />
          </template>

          <template #no-data>
            <div class="pa-8 text-center">
              <v-icon icon="mdi-information-outline" size="48" color="grey" />
              <p class="text-h6 mt-4">אין הוצאות להצגה</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title class="pa-5 bg-red-lighten-5">
          <v-icon icon="mdi-pencil" size="24" class="ml-2" />
          <span class="text-h6">עריכת הוצאה</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="editForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedExpense.amount"
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
                  v-model="editedExpense.dateString"
                  label="תאריך"
                  type="date"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editedExpense.paymentMethod"
                  label="אמצעי תשלום"
                  :items="paymentMethodOptions"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editedExpense.category"
                  label="קטגוריה"
                  :items="expenseCategoryOptions"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedExpense.description"
                  label="תיאור"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedExpense.notes"
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
          <v-btn color="primary" variant="flat" @click="saveExpense" :loading="saving">
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
import type { BudgetExpense } from '@/types/family-budget'
import { EXPENSE_CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from '@/types/family-budget'

const loading = ref(false)
const saving = ref(false)
const expenses = ref<BudgetExpense[]>([])
const editDialog = ref(false)
const editedExpense = ref<any>({})
const editForm = ref<any>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const filters = ref({
  month: '',
  paymentMethod: null,
  category: null,
  search: '',
})

const headers = [
  { title: 'תאריך', key: 'date', sortable: true },
  { title: 'סכום', key: 'amount', sortable: true },
  { title: 'אמצעי תשלום', key: 'paymentMethod', sortable: true },
  { title: 'קטגוריה', key: 'category', sortable: true },
  { title: 'תיאור', key: 'description', sortable: false },
  { title: 'הערות', key: 'notes', sortable: false },
  { title: 'פעולות', key: 'actions', sortable: false, align: 'center' },
]

const required = (v: any) => !!v || 'שדה חובה'
const positiveNumber = (v: number) => v > 0 || 'הסכום חייב להיות חיובי'

const paymentMethodOptions = computed(() =>
  Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
    value,
    title: label,
  })),
)

const expenseCategoryOptions = computed(() =>
  Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    title: label,
  })),
)

const filteredExpenses = computed(() => {
  let result = [...expenses.value]

  if (filters.value.month) {
    result = result.filter((e) => e.month === filters.value.month)
  }

  if (filters.value.paymentMethod) {
    result = result.filter((e) => e.paymentMethod === filters.value.paymentMethod)
  }

  if (filters.value.category) {
    result = result.filter((e) => e.category === filters.value.category)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter((e) =>
      e.description.toLowerCase().includes(search) ||
      (e.notes && e.notes.toLowerCase().includes(search))
    )
  }

  return result
})

const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce((sum, e) => sum + e.amount, 0)
})

const loadExpenses = async () => {
  loading.value = true
  try {
    const snapshot = await getDocs(collection(db, 'familyBudgetExpenses'))
    expenses.value = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
      } as BudgetExpense
    })
  } catch (error) {
    console.error('Error loading expenses:', error)
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

const editExpense = (expense: BudgetExpense) => {
  editedExpense.value = {
    ...expense,
    dateString: new Date(expense.date).toISOString().split('T')[0],
  }
  editDialog.value = true
}

const saveExpense = async () => {
  const { valid } = await editForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const date = new Date(editedExpense.value.dateString)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    const updateData: any = {
      amount: editedExpense.value.amount,
      paymentMethod: editedExpense.value.paymentMethod,
      category: editedExpense.value.category,
      date: Timestamp.fromDate(date),
      month,
    }

    // Add notes only if it exists, otherwise remove it
    if (editedExpense.value.notes && editedExpense.value.notes.trim()) {
      updateData.notes = editedExpense.value.notes
    } else {
      updateData.notes = null
    }

    await updateDoc(doc(db, 'familyBudgetExpenses', editedExpense.value.id), updateData)

    snackbarText.value = 'הוצאה עודכנה בהצלחה! ✓'
    snackbarColor.value = 'success'
    snackbar.value = true
    editDialog.value = false
    await loadExpenses()
  } catch (error) {
    console.error('Error updating expense:', error)
    snackbarText.value = 'שגיאה בעדכון הוצאה'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    saving.value = false
  }
}

const deleteExpense = async (expense: BudgetExpense) => {
  if (!confirm(`האם למחוק את ההוצאה "${expense.description}"?`)) return

  try {
    await deleteDoc(doc(db, 'familyBudgetExpenses', expense.id))
    snackbarText.value = 'הוצאה נמחקה בהצלחה! ✓'
    snackbarColor.value = 'success'
    snackbar.value = true
    await loadExpenses()
  } catch (error) {
    console.error('Error deleting expense:', error)
    snackbarText.value = 'שגיאה במחיקת הוצאה'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

onMounted(() => {
  loadExpenses()
})
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
</style>

