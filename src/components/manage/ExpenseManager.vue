<template>
  <v-container class="expense-container">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-calculator" size="32" color="primary" />
          ניהול הוצאות
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          הוצאות קבועות ומשתנות לעסק
        </p>
      </v-col>
    </v-row>

    <!-- Fixed Expenses Section -->
    <v-card rounded="xl" elevation="2" class="mb-6">
      <v-card-title class="pa-5 text-right section-header-clean d-flex justify-space-between align-center">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-calendar-sync" size="24" style="opacity: 0.8;" />
          <span class="text-h6">הוצאות קבועות (חודשי)</span>
        </div>
        <v-btn
          color="primary"
          variant="elevated"
          rounded="lg"
          @click="openFixedExpenseDialog()"
        >
          <v-icon icon="mdi-plus" start />
          הוצאה קבועה
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-row>
          <v-col
            v-for="expense in fixedExpenses"
            :key="expense.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card rounded="lg" variant="tonal" color="blue-grey">
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-h6 font-weight-bold">{{ expense.name }}</div>
                  <v-menu location="start">
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        variant="text"
                        v-bind="props"
                      />
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="openFixedExpenseDialog(expense)">
                        <template #prepend>
                          <v-icon icon="mdi-pencil" size="small" />
                        </template>
                        <v-list-item-title>עריכה</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteFixedExpense(expense)">
                        <template #prepend>
                          <v-icon icon="mdi-delete" size="small" color="error" />
                        </template>
                        <v-list-item-title>מחיקה</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <v-chip color="error" variant="flat" size="large" class="font-weight-bold">
                  ₪{{ expense.amount.toLocaleString() }}
                </v-chip>
                <div v-if="expense.notes" class="text-caption text-medium-emphasis mt-2">
                  {{ expense.notes }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-alert v-if="fixedExpenses.length === 0" type="info" variant="tonal" class="mt-4">
          אין עדיין הוצאות קבועות. לחץ על "הוצאה קבועה" להוספה.
        </v-alert>

        <div v-if="fixedExpenses.length > 0" class="mt-4 pa-4 bg-blue-grey-lighten-5 rounded-lg">
          <strong>סה"כ הוצאות קבועות חודשי:</strong>
          <v-chip color="error" variant="flat" class="mr-2 font-weight-bold">
            ₪{{ totalFixedExpenses.toLocaleString() }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Variable Expenses Section -->
    <v-card rounded="xl" elevation="2">
      <v-card-title class="pa-5 text-right section-header-clean d-flex justify-space-between align-center">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-cash-multiple" size="24" style="opacity: 0.8;" />
          <span class="text-h6">הוצאות משתנות</span>
        </div>
        <v-btn
          color="primary"
          variant="elevated"
          rounded="lg"
          @click="openVariableExpenseDialog()"
        >
          <v-icon icon="mdi-plus" start />
          הוצאה משתנה
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-table>
          <thead>
            <tr>
              <th class="text-right">תאריך</th>
              <th class="text-right">תיאור</th>
              <th class="text-right">סכום</th>
              <th class="text-right">הערות</th>
              <th class="text-right">פעולות</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in variableExpenses" :key="expense.id">
              <td class="text-right">{{ formatDate(expense.date) }}</td>
              <td class="text-right font-weight-bold">{{ expense.name }}</td>
              <td class="text-right">
                <v-chip color="error" variant="tonal" size="small">
                  ₪{{ expense.amount.toLocaleString() }}
                </v-chip>
              </td>
              <td class="text-right text-caption">{{ expense.notes || '-' }}</td>
              <td class="text-right">
                <v-btn
                  icon="mdi-pencil"
                  size="x-small"
                  variant="text"
                  @click="openVariableExpenseDialog(expense)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="x-small"
                  variant="text"
                  color="error"
                  @click="deleteVariableExpense(expense)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-alert v-if="variableExpenses.length === 0" type="info" variant="tonal" class="mt-4">
          אין עדיין הוצאות משתנות. לחץ על "הוצאה משתנה" להוספה.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Fixed Expense Dialog -->
    <v-dialog v-model="showFixedDialog" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right">
          {{ editingFixed ? 'עריכת הוצאה קבועה' : 'הוצאה קבועה חדשה' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="fixedForm.name"
            label="שם ההוצאה *"
            prepend-inner-icon="mdi-tag"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          />

          <v-text-field
            v-model.number="fixedForm.amount"
            label="סכום חודשי *"
            prepend-inner-icon="mdi-cash"
            variant="outlined"
            rounded="lg"
            type="number"
            class="mb-4"
          >
            <template #append-inner>
              <span class="text-body-2">₪</span>
            </template>
          </v-text-field>

          <v-textarea
            v-model="fixedForm.notes"
            label="הערות"
            prepend-inner-icon="mdi-note-text-outline"
            variant="outlined"
            rounded="lg"
            rows="2"
          />
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="primary"
            rounded="xl"
            size="large"
            variant="elevated"
            @click="saveFixedExpense"
            :loading="saving"
            class="flex-grow-1"
          >
            <v-icon icon="mdi-check" start />
            שמור
          </v-btn>
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeFixedDialog"
            :disabled="saving"
          >
            ביטול
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Variable Expense Dialog -->
    <v-dialog v-model="showVariableDialog" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5 text-right">
          {{ editingVariable ? 'עריכת הוצאה משתנה' : 'הוצאה משתנה חדשה' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="variableForm.name"
            label="תיאור ההוצאה *"
            prepend-inner-icon="mdi-tag"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          />

          <v-text-field
            v-model.number="variableForm.amount"
            label="סכום *"
            prepend-inner-icon="mdi-cash"
            variant="outlined"
            rounded="lg"
            type="number"
            class="mb-4"
          >
            <template #append-inner>
              <span class="text-body-2">₪</span>
            </template>
          </v-text-field>

          <v-text-field
            v-model="variableForm.date"
            label="תאריך *"
            prepend-inner-icon="mdi-calendar"
            variant="outlined"
            rounded="lg"
            type="date"
            class="mb-4"
          />

          <v-textarea
            v-model="variableForm.notes"
            label="הערות"
            prepend-inner-icon="mdi-note-text-outline"
            variant="outlined"
            rounded="lg"
            rows="2"
          />
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="primary"
            rounded="xl"
            size="large"
            variant="elevated"
            @click="saveVariableExpense"
            :loading="saving"
            class="flex-grow-1"
          >
            <v-icon icon="mdi-check" start />
            שמור
          </v-btn>
          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            @click="closeVariableDialog"
            :disabled="saving"
          >
            ביטול
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'

interface FixedExpense {
  id: string
  name: string
  amount: number
  notes?: string
  createdAt: Date
}

interface VariableExpense {
  id: string
  name: string
  amount: number
  date: Date
  notes?: string
  createdAt: Date
}

// State
const fixedExpenses = ref<FixedExpense[]>([])
const variableExpenses = ref<VariableExpense[]>([])
const showFixedDialog = ref(false)
const showVariableDialog = ref(false)
const saving = ref(false)
const editingFixed = ref<FixedExpense | null>(null)
const editingVariable = ref<VariableExpense | null>(null)

const fixedForm = ref({
  name: '',
  amount: 0,
  notes: ''
})

const variableForm = ref({
  name: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

// Computed
const totalFixedExpenses = computed(() => {
  return fixedExpenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

// Load data
const loadExpenses = async () => {
  try {
    // Load fixed expenses
    const fixedSnapshot = await getDocs(collection(db, 'fixed_expenses'))
    fixedExpenses.value = fixedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as FixedExpense[]

    // Load variable expenses
    const variableSnapshot = await getDocs(collection(db, 'variable_expenses'))
    variableExpenses.value = variableSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as VariableExpense[]

    // Sort by date descending
    variableExpenses.value.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error) {
    console.error('Error loading expenses:', error)
    alert('שגיאה בטעינת ההוצאות')
  }
}

// Fixed expense functions
const openFixedExpenseDialog = (expense?: FixedExpense) => {
  if (expense) {
    editingFixed.value = expense
    fixedForm.value = {
      name: expense.name,
      amount: expense.amount,
      notes: expense.notes || ''
    }
  } else {
    editingFixed.value = null
    fixedForm.value = {
      name: '',
      amount: 0,
      notes: ''
    }
  }
  showFixedDialog.value = true
}

const saveFixedExpense = async () => {
  if (!fixedForm.value.name || fixedForm.value.amount <= 0) {
    alert('אנא מלא את כל השדות הנדרשים')
    return
  }

  saving.value = true
  try {
    if (editingFixed.value) {
      // Update
      await updateDoc(doc(db, 'fixed_expenses', editingFixed.value.id), {
        name: fixedForm.value.name,
        amount: fixedForm.value.amount,
        notes: fixedForm.value.notes || ''
      })
    } else {
      // Create
      await addDoc(collection(db, 'fixed_expenses'), {
        name: fixedForm.value.name,
        amount: fixedForm.value.amount,
        notes: fixedForm.value.notes || '',
        createdAt: Timestamp.fromDate(new Date())
      })
    }

    closeFixedDialog()
    await loadExpenses()
  } catch (error) {
    console.error('Error saving fixed expense:', error)
    alert('שגיאה בשמירת ההוצאה')
  } finally {
    saving.value = false
  }
}

const deleteFixedExpense = async (expense: FixedExpense) => {
  if (!confirm(`האם למחוק את "${expense.name}"?`)) return

  try {
    await deleteDoc(doc(db, 'fixed_expenses', expense.id))
    await loadExpenses()
  } catch (error) {
    console.error('Error deleting fixed expense:', error)
    alert('שגיאה במחיקת ההוצאה')
  }
}

const closeFixedDialog = () => {
  showFixedDialog.value = false
  editingFixed.value = null
}

// Variable expense functions
const openVariableExpenseDialog = (expense?: VariableExpense) => {
  if (expense) {
    editingVariable.value = expense
    variableForm.value = {
      name: expense.name,
      amount: expense.amount,
      date: expense.date.toISOString().split('T')[0],
      notes: expense.notes || ''
    }
  } else {
    editingVariable.value = null
    variableForm.value = {
      name: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  }
  showVariableDialog.value = true
}

const saveVariableExpense = async () => {
  if (!variableForm.value.name || variableForm.value.amount <= 0) {
    alert('אנא מלא את כל השדות הנדרשים')
    return
  }

  saving.value = true
  try {
    const expenseData = {
      name: variableForm.value.name,
      amount: variableForm.value.amount,
      date: Timestamp.fromDate(new Date(variableForm.value.date)),
      notes: variableForm.value.notes || ''
    }

    if (editingVariable.value) {
      // Update
      await updateDoc(doc(db, 'variable_expenses', editingVariable.value.id), expenseData)
    } else {
      // Create
      await addDoc(collection(db, 'variable_expenses'), {
        ...expenseData,
        createdAt: Timestamp.fromDate(new Date())
      })
    }

    closeVariableDialog()
    await loadExpenses()
  } catch (error) {
    console.error('Error saving variable expense:', error)
    alert('שגיאה בשמירת ההוצאה')
  } finally {
    saving.value = false
  }
}

const deleteVariableExpense = async (expense: VariableExpense) => {
  if (!confirm(`האם למחוק את "${expense.name}"?`)) return

  try {
    await deleteDoc(doc(db, 'variable_expenses', expense.id))
    await loadExpenses()
  } catch (error) {
    console.error('Error deleting variable expense:', error)
    alert('שגיאה במחיקת ההוצאה')
  }
}

const closeVariableDialog = () => {
  showVariableDialog.value = false
  editingVariable.value = null
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

// Lifecycle
onMounted(() => {
  loadExpenses()
})
</script>

<style scoped>
.expense-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header-clean {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>

