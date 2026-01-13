// Family Budget Types

// קטגוריות הוצאות
export type ExpenseCategory =
  | 'food' // מזון ומשקאות
  | 'fuel' // דלק ותחבורה
  | 'entertainment' // בילויים ופנאי
  | 'clothing' // ביגוד והנעלה
  | 'health' // בריאות ותרופות
  | 'education' // חינוך וספרים
  | 'shopping' // קניות ושונות
  | 'mortgage' // משכנתא
  | 'property-tax' // ארנונה
  | 'electricity' // חשמל
  | 'water' // מים
  | 'insurance' // ביטוח
  | 'phone' // טלפון ואינטרנט
  | 'subscriptions' // מנויים
  | 'donations' // תרומות
  | 'other' // אחר

// סוגי הוצאות
export type ExpenseType =
  | 'cash' // מזומן
  | 'fixed' // קבועה (בנק/אשראי)
  | 'variable' // משתנה (בנק/אשראי)

// קטגוריות הכנסות
export type IncomeCategory =
  | 'salary-payslip' // משכורת תלוש
  | 'business-transfer' // העברה מעסק
  | 'client-payment' // תשלום מלקוח
  | 'child-allowance' // קיצבת ילדים
  | 'family-transfer' // העברה ממשפחה
  | 'other' // אחר

// הוצאה
export interface BudgetExpense {
  id: string
  amount: number
  category: ExpenseCategory
  type: ExpenseType
  description: string
  date: Date
  month: string // YYYY-MM
  notes?: string
  createdAt: Date
}

// הכנסה
export interface BudgetIncome {
  id: string
  amount: number
  category: IncomeCategory
  description: string
  date: Date
  month: string // YYYY-MM
  notes?: string
  createdAt: Date
}

// הוצאה קבועה (תבנית)
export interface FixedExpenseTemplate {
  id: string
  name: string
  amount: number
  category: ExpenseCategory
  description: string
  isActive: boolean
  notes?: string
  createdAt: Date
}

// סיכום חודשי
export interface MonthlyBudgetSummary {
  month: string // YYYY-MM
  monthName: string // שם החודש בעברית
  totalIncome: number
  totalExpenses: number
  balance: number // הפרש (הכנסות - הוצאות)
  expensesByCategory: Record<ExpenseCategory, number>
  expensesByType: Record<ExpenseType, number>
  incomeByCategory: Record<IncomeCategory, number>
}

// סיכום שנתי
export interface YearlyBudgetSummary {
  year: number
  totalIncome: number
  totalExpenses: number
  balance: number
  monthlyData: MonthlyBudgetSummary[]
  avgMonthlyIncome: number
  avgMonthlyExpenses: number
  highestExpenseMonth: string
  lowestExpenseMonth: string
}

// תוויות קטגוריות (לתצוגה)
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'מזון ומשקאות',
  fuel: 'דלק ותחבורה',
  entertainment: 'בילויים ופנאי',
  clothing: 'ביגוד והנעלה',
  health: 'בריאות ותרופות',
  education: 'חינוך וספרים',
  shopping: 'קניות ושונות',
  mortgage: 'משכנתא',
  'property-tax': 'ארנונה',
  electricity: 'חשמל',
  water: 'מים',
  insurance: 'ביטוח',
  phone: 'טלפון ואינטרנט',
  subscriptions: 'מנויים',
  donations: 'תרומות',
  other: 'אחר',
}

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  cash: 'מזומן',
  fixed: 'קבועה',
  variable: 'משתנה',
}

export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  'salary-payslip': 'משכורת תלוש',
  'business-transfer': 'העברה מעסק',
  'client-payment': 'תשלום מלקוח',
  'child-allowance': 'קיצבת ילדים',
  'family-transfer': 'העברה ממשפחה',
  other: 'אחר',
}

// צבעים לגרפים
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#FF6384',
  fuel: '#36A2EB',
  entertainment: '#FFCE56',
  clothing: '#4BC0C0',
  health: '#9966FF',
  education: '#FF9F40',
  shopping: '#FF6384',
  mortgage: '#C9CBCF',
  'property-tax': '#4BC0C0',
  electricity: '#FFCE56',
  water: '#36A2EB',
  insurance: '#9966FF',
  phone: '#FF6384',
  subscriptions: '#4BC0C0',
  donations: '#E91E63',
  other: '#C9CBCF',
}

