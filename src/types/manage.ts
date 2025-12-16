// Client Types
export interface Client {
  id: string
  name: string
  phone: string
  pricePerSession: number // 350, 400, or 500
  totalSessions: number
  balance: number // חוב או זכות (שלילי = חוב, חיובי = זכות)
  createdAt: Date
  notes?: string
}

// Payment Types
export type PaymentMethod = 'cash' | 'transfer' | 'credit' | 'check'

export interface Payment {
  id: string
  clientId: string
  appointmentId: string
  amount: number
  method: PaymentMethod
  date: Date
  notes?: string
}

// Appointment Types
export interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: Date
  time: string // HH:mm format
  price: number
  attended: boolean
  paid: boolean
  paymentAmount?: number
  paymentMethod?: PaymentMethod
  sessionNumber: number // מספר הפגישה של הלקוח
  notes?: string
}

// Weekly Schedule Template
export interface ScheduleSlot {
  id: string
  dayOfWeek: number // 0=Sunday, 6=Saturday
  time: string // HH:mm format
  defaultClientId?: string
  defaultClientName?: string
}

// Weekly Prize Settings
export interface WeeklyPrize {
  id: string
  weekStart: Date // תאריך תחילת השבוע
  prizeText: string
  requiredDays: number // כמה ימים צריך לעדכן
  daysCompleted: string[] // תאריכים שעודכנו
  isUnlocked: boolean
  unlockedAt?: Date
}

