<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-calendar-sync" size="32" color="primary" />
          הוצאות קבועות
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis">
          הגדר הוצאות חוזרות חודשיות (משכנתא, ארנונה, חשמל וכו')
        </p>
      </v-col>
    </v-row>

    <!-- Add Button -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          color="primary"
          size="large"
          rounded="lg"
          @click="openDialog()"
        >
          <v-icon icon="mdi-plus" start />
          הוצאה קבועה חדשה
        </v-btn>
      </v-col>
    </v-row>

    <!-- Fixed Expenses Grid -->
    <v-row class="d-flex justify-start">
      <v-col
        v-for="expense in sortedFixedExpenses"
        :key="expense.id"
        cols="12"
        sm="6"
        md="4"
        lg="2.4"
      >
        <v-card
          rounded="xl"
          elevation="0"
          class="fixed-expense-card"
          :class="{ 'opacity-50': !expense.isActive }"
          :style="{
            backgroundColor: getCategoryColor(expense.category),
            border: `2px solid ${getCategoryBorderColor(expense.category)}`,
          }"
        >
          <v-card-text class="pa-3">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-body-2 font-weight-bold">{{ expense.name }}</div>
              <v-menu location="start">
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="x-small"
                    variant="text"
                    v-bind="props"
                  />
                </template>
                <v-list density="compact">
                  <v-list-item @click="openDialog(expense)">
                    <template #prepend>
                      <v-icon icon="mdi-pencil" size="small" />
                    </template>
                    <v-list-item-title>עריכה</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="toggleActive(expense)">
                    <template #prepend>
                      <v-icon
                        :icon="expense.isActive ? 'mdi-pause' : 'mdi-play'"
                        size="small"
                      />
                    </template>
                    <v-list-item-title>
                      {{ expense.isActive ? 'השהה' : 'הפעל' }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteExpense(expense)">
                    <template #prepend>
                      <v-icon icon="mdi-delete" size="small" color="error" />
                    </template>
                    <v-list-item-title>מחיקה</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <div class="text-subtitle-1 font-weight-bold mb-2" style="color: #d32f2f;">
              ₪{{ expense.amount.toLocaleString() }}
            </div>

            <v-chip
              size="small"
              variant="flat"
              class="mb-2 font-weight-bold"
              :style="{
                backgroundColor: getCategoryChipColor(expense.category),
                color: 'white',
                fontSize: '0.75rem',
              }"
            >
              {{ EXPENSE_CATEGORY_LABELS[expense.category] }}
            </v-chip>

            <div v-if="expense.description" class="text-caption text-medium-emphasis mt-2">
              {{ expense.description }}
            </div>

            <div v-if="expense.notes" class="text-caption text-medium-emphasis mt-1" style="font-size: 0.7rem;">
              {{ expense.notes }}
            </div>

            <v-chip
              v-if="!expense.isActive"
              size="x-small"
              color="warning"
              variant="flat"
              class="mt-2"
            >
              מושהה
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="fixedExpenses.length === 0" rounded="xl" elevation="2" class="mt-4">
      <v-card-text class="pa-8 text-center">
        <v-icon icon="mdi-information-outline" size="64" color="grey" />
        <p class="text-h6 mt-4">אין הוצאות קבועות</p>
        <p class="text-body-2 text-medium-emphasis">
          לחץ על "הוצאה קבועה חדשה" כדי להתחיל
        </p>
      </v-card-text>
    </v-card>

    <!-- Total -->
    <v-card v-if="fixedExpenses.length > 0" rounded="xl" elevation="2" class="mt-6">
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center">
          <span class="text-h6">סה"כ הוצאות קבועות חודשיות (פעילות):</span>
          <v-chip color="error" variant="flat" size="large" class="font-weight-bold">
            ₪{{ totalActiveFixedExpenses.toLocaleString() }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card rounded="xl">
        <v-card-title class="pa-5 bg-primary-lighten-5">
          <v-icon icon="mdi-calendar-sync" size="24" class="ml-2" />
          <span class="text-h6">{{ editMode ? 'עריכת' : 'הוספת' }} הוצאה קבועה</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="שם ההוצאה *"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                  placeholder="למשל: משכנתא, ארנונה, חשמל"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.amount"
                  label="סכום חודשי *"
                  type="number"
                  variant="outlined"
                  rounded="lg"
                  prefix="₪"
                  :rules="[required, positiveNumber]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.category"
                  label="קטגוריה *"
                  :items="expenseCategoryOptions"
                  variant="outlined"
                  rounded="lg"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.description"
                  label="תיאור"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.notes"
                  label="הערות"
                  variant="outlined"
                  rounded="lg"
                  rows="2"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="formData.isActive"
                  label="פעיל"
                  color="primary"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">ביטול</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveExpense"
            :loading="saving"
          >
            {{ editMode ? 'עדכן' : 'הוסף' }}
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
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import type { FixedExpenseTemplate, ExpenseCategory } from '@/types/family-budget'
import { EXPENSE_CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/family-budget'

const fixedExpenses = ref<FixedExpenseTemplate[]>([])
const dialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const form = ref<any>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const formData = ref({
  id: '',
  name: '',
  amount: 0,
  category: 'mortgage' as ExpenseCategory,
  description: '',
  notes: '',
  isActive: true,
})

const required = (v: any) => !!v || 'שדה חובה'
const positiveNumber = (v: number) => v > 0 || 'הסכום חייב להיות חיובי'

const expenseCategoryOptions = computed(() =>
  Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    title: label,
  })),
)

const totalActiveFixedExpenses = computed(() => {
  return fixedExpenses.value
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0)
})

const sortedFixedExpenses = computed(() => {
  return [...fixedExpenses.value].sort((a, b) => {
    // Sort by category, then by name
    if (a.category === b.category) {
      return a.name.localeCompare(b.name, 'he')
    }
    return EXPENSE_CATEGORY_LABELS[a.category].localeCompare(
      EXPENSE_CATEGORY_LABELS[b.category],
      'he',
    )
  })
})

const getCategoryColor = (category: ExpenseCategory) => {
  const color = CATEGORY_COLORS[category]
  // Convert hex to rgba with low opacity for soft colors
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.15)`
}

const getCategoryBorderColor = (category: ExpenseCategory) => {
  const color = CATEGORY_COLORS[category]
  // Convert hex to rgba with medium opacity for border
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.5)`
}

const getCategoryChipColor = (category: ExpenseCategory) => {
  const color = CATEGORY_COLORS[category]
  // Convert hex to rgba with higher opacity for chip
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.85)`
}

const loadExpenses = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'familyBudgetFixedExpenses'))
    fixedExpenses.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FixedExpenseTemplate[]
  } catch (error) {
    console.error('Error loading fixed expenses:', error)
  }
}

const openDialog = (expense?: FixedExpenseTemplate) => {
  if (expense) {
    editMode.value = true
    formData.value = { ...expense }
  } else {
    editMode.value = false
    formData.value = {
      id: '',
      name: '',
      amount: 0,
      category: 'mortgage',
      description: '',
      notes: '',
      isActive: true,
    }
  }
  dialog.value = true
}

const saveExpense = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editMode.value) {
      const updateData: any = {
        name: formData.value.name,
        amount: formData.value.amount,
        category: formData.value.category,
        isActive: formData.value.isActive,
      }

      // Add description only if it exists, otherwise remove it
      if (formData.value.description && formData.value.description.trim()) {
        updateData.description = formData.value.description
      } else {
        updateData.description = null
      }

      // Add notes only if it exists, otherwise remove it
      if (formData.value.notes && formData.value.notes.trim()) {
        updateData.notes = formData.value.notes
      } else {
        updateData.notes = null
      }

      await updateDoc(doc(db, 'familyBudgetFixedExpenses', formData.value.id), updateData)
      snackbarText.value = 'הוצאה קבועה עודכנה בהצלחה! ✓'
    } else {
      const newData: any = {
        name: formData.value.name,
        amount: formData.value.amount,
        category: formData.value.category,
        isActive: formData.value.isActive,
        createdAt: Timestamp.fromDate(new Date()),
      }

      // Add description only if it exists
      if (formData.value.description && formData.value.description.trim()) {
        newData.description = formData.value.description
      }

      // Add notes only if it exists
      if (formData.value.notes && formData.value.notes.trim()) {
        newData.notes = formData.value.notes
      }

      await addDoc(collection(db, 'familyBudgetFixedExpenses'), newData)
      snackbarText.value = 'הוצאה קבועה נוספה בהצלחה! ✓'
    }

    snackbarColor.value = 'success'
    snackbar.value = true
    dialog.value = false
    await loadExpenses()
  } catch (error) {
    console.error('Error saving fixed expense:', error)
    snackbarText.value = 'שגיאה בשמירת הוצאה קבועה'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    saving.value = false
  }
}

const toggleActive = async (expense: FixedExpenseTemplate) => {
  try {
    await updateDoc(doc(db, 'familyBudgetFixedExpenses', expense.id), {
      isActive: !expense.isActive,
    })
    snackbarText.value = `הוצאה ${!expense.isActive ? 'הופעלה' : 'הושהתה'} בהצלחה! ✓`
    snackbarColor.value = 'success'
    snackbar.value = true
    await loadExpenses()
  } catch (error) {
    console.error('Error toggling expense:', error)
    snackbarText.value = 'שגיאה בעדכון הוצאה'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

const deleteExpense = async (expense: FixedExpenseTemplate) => {
  if (!confirm(`האם למחוק את ההוצאה הקבועה "${expense.name}"?`)) return

  try {
    await deleteDoc(doc(db, 'familyBudgetFixedExpenses', expense.id))
    snackbarText.value = 'הוצאה קבועה נמחקה בהצלחה! ✓'
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

.opacity-50 {
  opacity: 0.6;
}

.fixed-expense-card {
  transition: all 0.3s ease;
  height: 100%;
}

.fixed-expense-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}
</style>

