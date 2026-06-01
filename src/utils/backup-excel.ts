/**
 * Excel Backup Utility (Browser-based)
 *
 * Generates a formatted .xlsx file with all client data,
 * session history, and payment history.
 */

import * as XLSX from 'xlsx'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Client, Appointment, DebtPayment, DebtAddition } from '@/types/manage'

function convertTimestamp(obj: unknown): unknown {
  if (!obj) return obj

  const o = obj as Record<string, unknown>

  if (typeof o === 'object' && !Array.isArray(o) && o.seconds !== undefined && o.nanoseconds !== undefined) {
    return new Date((o.seconds as number) * 1000)
  }

  if (obj instanceof Date) return obj

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const converted: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(o)) {
      converted[key] = convertTimestamp(value)
    }
    return converted
  }

  if (Array.isArray(obj)) {
    return (obj as unknown[]).map(convertTimestamp)
  }

  return obj
}

function formatDate(d: unknown): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d as string)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    cash: 'מזומן',
    transfer: 'העברה',
    credit: 'כרטיס אשראי',
    check: "צ'ק",
  }
  return map[method] || method
}

function formatFrequency(freq: string): string {
  const map: Record<string, string> = {
    weekly: 'שבועי',
    biweekly: 'דו-שבועי',
    monthly: 'חודשי',
  }
  return map[freq] || freq
}

function formatBalance(balance: number): string {
  if (balance === 0) return 'מאוזן'
  if (balance > 0) return `זכות: ${balance}₪`
  return `חוב: ${Math.abs(balance)}₪`
}

function setColumnWidths(sheet: XLSX.WorkSheet, widths: number[]) {
  sheet['!cols'] = widths.map(w => ({ wch: w }))
}

export async function backupToExcel(): Promise<void> {
  const [clientsSnap, appointmentsSnap, debtPaymentsSnap, debtAdditionsSnap] = await Promise.all([
    getDocs(collection(db, 'clients')),
    getDocs(collection(db, 'appointments')),
    getDocs(collection(db, 'debt_payments')),
    getDocs(collection(db, 'debt_additions')),
  ])

  const clients = clientsSnap.docs
    .map(d => convertTimestamp({ id: d.id, ...d.data() }) as Client)
    .sort((a, b) => a.name.localeCompare(b.name, 'he'))

  const appointments = appointmentsSnap.docs.map(
    d => convertTimestamp({ id: d.id, ...d.data() }) as Appointment
  )

  const debtPayments = debtPaymentsSnap.docs.map(
    d => convertTimestamp({ id: d.id, ...d.data() }) as DebtPayment
  )

  const debtAdditions = debtAdditionsSnap.docs.map(
    d => convertTimestamp({ id: d.id, ...d.data() }) as DebtAddition
  )

  const wb = XLSX.utils.book_new()
  const now = new Date()
  const dateStr = now.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const timeStr = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })

  // ─── Sheet 1: Cover ───────────────────────────────────────────────────────
  const coverData = [
    ['גיבוי נתונים מהמערכת'],
    [],
    ['תאריך:', dateStr],
    ['שעה:', timeStr],
    [],
    ['סיכום:'],
    ['מספר לקוחות פעילים:', clients.length],
    ['מספר פגישות כולל:', appointments.filter(a => !a.isGroup).length],
    ['לקוחות עם חוב:', clients.filter(c => c.balance < 0).length],
    ['לקוחות עם זכות:', clients.filter(c => c.balance > 0).length],
  ]
  const coverSheet = XLSX.utils.aoa_to_sheet(coverData)
  setColumnWidths(coverSheet, [30, 20])
  XLSX.utils.book_append_sheet(wb, coverSheet, 'סיכום')

  // ─── Sheet 2: Clients ─────────────────────────────────────────────────────
  const clientHeaders = ['שם', 'טלפון', 'מייל', 'יתרה / חוב', 'מחיר לפגישה', 'תדירות', 'סה"כ פגישות', 'הערות']
  const clientRows = clients.map(c => [
    c.name,
    c.phone || '',
    c.email || '',
    formatBalance(c.balance),
    `${c.pricePerSession}₪`,
    formatFrequency(c.frequency),
    c.totalSessions,
    c.notes || '',
  ])
  const clientsSheet = XLSX.utils.aoa_to_sheet([clientHeaders, ...clientRows])
  setColumnWidths(clientsSheet, [20, 15, 25, 18, 14, 12, 12, 35])
  XLSX.utils.book_append_sheet(wb, clientsSheet, 'לקוחות')

  // ─── Sheet 3: Appointments history ────────────────────────────────────────
  const apptHeaders = [
    'שם לקוח',
    'תאריך',
    'שעה',
    "פגישה מס'",
    'הגיע/ה',
    'שולם',
    'סכום ששולם',
    'אמצעי תשלום',
    'הערות',
  ]
  const apptRows: unknown[][] = []

  for (const client of clients) {
    const individualAppts = appointments
      .filter(a => a.clientId === client.id && !a.isGroup)
      .sort((a, b) => {
        const da = a.date instanceof Date ? a.date : new Date(a.date as unknown as string)
        const db2 = b.date instanceof Date ? b.date : new Date(b.date as unknown as string)
        return da.getTime() - db2.getTime()
      })

    const groupAppts = appointments
      .filter(a => a.isGroup && a.groupParticipants?.some(p => p.clientId === client.id))
      .sort((a, b) => {
        const da = a.date instanceof Date ? a.date : new Date(a.date as unknown as string)
        const db2 = b.date instanceof Date ? b.date : new Date(b.date as unknown as string)
        return da.getTime() - db2.getTime()
      })

    if (individualAppts.length === 0 && groupAppts.length === 0) continue

    apptRows.push([`── ${client.name} ──`, '', '', '', '', '', '', '', ''])

    for (const appt of individualAppts) {
      const paidAmount = (appt.payments || []).reduce((sum, p) => sum + p.amount, 0)
      const payMethods = [
        ...new Set((appt.payments || []).map(p => formatPaymentMethod(p.method))),
      ].join(', ')
      apptRows.push([
        client.name,
        formatDate(appt.date),
        appt.time || '',
        appt.sessionNumber || '',
        appt.attended ? 'כן' : 'לא',
        appt.paid ? 'כן' : paidAmount > 0 ? 'חלקי' : 'לא',
        paidAmount > 0 ? `${paidAmount}₪` : '',
        payMethods,
        appt.notes || '',
      ])
    }

    for (const appt of groupAppts) {
      const participant = appt.groupParticipants?.find(p => p.clientId === client.id)
      if (!participant) continue
      const paidAmount = (participant.payments || []).reduce((sum, p) => sum + p.amount, 0)
      const payMethods = [
        ...new Set((participant.payments || []).map(p => formatPaymentMethod(p.method))),
      ].join(', ')
      apptRows.push([
        `${client.name} (קבוצה)`,
        formatDate(appt.date),
        appt.time || '',
        '',
        participant.attended ? 'כן' : 'לא',
        paidAmount > 0 ? 'כן' : 'לא',
        paidAmount > 0 ? `${paidAmount}₪` : '',
        payMethods,
        appt.notes || '',
      ])
    }

    apptRows.push([])
  }

  const apptSheet = XLSX.utils.aoa_to_sheet([apptHeaders, ...apptRows])
  setColumnWidths(apptSheet, [22, 12, 8, 10, 8, 8, 14, 18, 30])
  XLSX.utils.book_append_sheet(wb, apptSheet, 'היסטוריית פגישות')

  // ─── Sheet 4: Debt payments & additions ───────────────────────────────────
  const paymentHeaders = ['שם לקוח', 'תאריך', 'סכום', 'אמצעי תשלום', 'הערות', 'סוג']
  const paymentRows: unknown[][] = []

  const sortedDebtPayments = [...debtPayments].sort((a, b) => {
    const da = a.date instanceof Date ? a.date : new Date(a.date as unknown as string)
    const db2 = b.date instanceof Date ? b.date : new Date(b.date as unknown as string)
    return db2.getTime() - da.getTime()
  })

  const sortedDebtAdditions = [...debtAdditions].sort((a, b) => {
    const da = a.date instanceof Date ? a.date : new Date(a.date as unknown as string)
    const db2 = b.date instanceof Date ? b.date : new Date(b.date as unknown as string)
    return db2.getTime() - da.getTime()
  })

  for (const dp of sortedDebtPayments) {
    paymentRows.push([
      dp.clientName,
      formatDate(dp.date),
      `${dp.amount}₪`,
      formatPaymentMethod(dp.method),
      dp.notes || '',
      'תשלום חוב',
    ])
  }

  for (const da of sortedDebtAdditions) {
    paymentRows.push([
      da.clientName,
      formatDate(da.date),
      `${da.amount}₪`,
      '',
      da.notes || '',
      'הוספת חוב',
    ])
  }

  if (paymentRows.length > 0) {
    const paymentsSheet = XLSX.utils.aoa_to_sheet([paymentHeaders, ...paymentRows])
    setColumnWidths(paymentsSheet, [20, 12, 12, 16, 30, 14])
    XLSX.utils.book_append_sheet(wb, paymentsSheet, 'תשלומים וחובות')
  }

  // ─── Download ─────────────────────────────────────────────────────────────
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = now.toISOString().slice(0, 10)
  link.href = url
  link.download = `גיבוי-נתונים-${timestamp}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
