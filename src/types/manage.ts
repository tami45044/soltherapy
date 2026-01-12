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

// תשלום חוב עצמאי (לא קשור לפגישה)
export interface DebtPayment {
  id: string
  clientId: string
  clientName: string
  amount: number
  method: PaymentMethod
  date: Date
  notes?: string
  createdAt: Date
}

// הוספת חוב ידנית
export interface DebtAddition {
  id: string
  clientId: string
  clientName: string
  amount: number
  date: Date
  notes?: string
  createdAt: Date
}

// Appointment Types
export type DurationCategory = 'on-time' | 'partial' | 'overtime'

// Group Session Participant
export interface GroupParticipant {
  clientId: string
  clientName: string
  attended: boolean
  payments: PaymentRecord[] // תשלומים של המשתתף בפגישה זו
  isRegular: boolean // האם משתתף קבוע או חד-פעמי
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: Date
  time: string // HH:mm format (scheduled time)
  price: number
  attended: boolean
  paid: boolean
  payments: PaymentRecord[] // מערך תשלומים
  sessionNumber: number // מספר הפגישה של הלקוח
  notes?: string
  // Old format (for backward compatibility)
  paymentAmount?: number
  paymentMethod?: PaymentMethod
  // Session summary (only when attended)
  startTime?: string // HH:mm - שעת התחלה בפועל
  endTime?: string // HH:mm - שעת סיום בפועל
  duration?: number // משך הפגישה בדקות
  durationCategory?: DurationCategory // קטגוריית משך הפגישה
  sessionSummaryNotes?: string // סיכום הפגישה בטקסט חופשי
  // Group session fields
  isGroup?: boolean // האם זו פגישת קבוצה
  groupPrice?: number // מחיר לכל משתתף (ניתן לעריכה)
  groupParticipants?: GroupParticipant[] // רשימת משתתפים
}

// Weekly Schedule Template
export interface ScheduleSlot {
  id: string
  dayOfWeek: number // 0=Sunday, 6=Saturday
  time: string // HH:mm format
  defaultClientIds: string[] // מספר לקוחות אפשריים
  defaultClientNames: string[] // שמות הלקוחות
  // Group session fields
  isGroup?: boolean // האם זו קבוצה טיפולית
  groupPrice?: number // מחיר לכל משתתף בקבוצה
  groupParticipantIds?: string[] // משתתפים קבועים בקבוצה
  groupParticipantNames?: string[] // שמות המשתתפים הקבועים
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
  availableToUnlock?: boolean // האם שוחרר ידנית על ידי המנהל (גם ללא עמידה ביעד)
}

