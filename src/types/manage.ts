// Client Types
export type ClientFrequency = 'weekly' | 'biweekly' | 'monthly'

export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  pricePerSession: number // 350, 400, or 500
  totalSessions: number
  balance: number // חוב או זכות (שלילי = חוב, חיובי = זכות)
  frequency: ClientFrequency // תדירות הגעה
  lastAppointmentDate?: Date // תאריך הפגישה האחרונה
  createdAt: Date
  notes?: string
}

// Payment Types
export type PaymentMethod = 'cash' | 'transfer' | 'credit' | 'check'

export interface PaymentRecord {
  id: string
  amount: number
  method: PaymentMethod
  date: Date
  notes?: string
}

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
  payments: PaymentRecord[] // מערך תשלומים
  sessionNumber: number // מספר הפגישה של הלקוח
  notes?: string
}

// Weekly Schedule Template
export interface ScheduleSlot {
  id: string
  dayOfWeek: number // 0=Sunday, 6=Saturday
  time: string // HH:mm format
  defaultClientIds: string[] // מספר לקוחות אפשריים
  defaultClientNames: string[] // שמות הלקוחות
}

// Weekly Prize Settings
export interface WeeklyPrize {
  id: string
  weekStart: Date // תאריך תחילת השבוע
  prizeText: string
  weeklyTarget: number // יעד הכנסה שבועי (מחושב מהתבנית)
  weeklyActual: number // סכום בפועל ששולם השבוע
  isUnlocked: boolean
  unlockedAt?: Date
}

