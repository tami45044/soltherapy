#!/usr/bin/env node

/**
 * Weekly Email Backup Script
 *
 * Generates an Excel backup of all client data and sends it by email.
 *
 * Usage:
 *   node scripts/email-backup.js
 *
 * Required environment variables:
 *   RESEND_API_KEY - API key from resend.com
 *
 * Optional:
 *   BACKUP_EMAIL   - Recipient email (default: 88sol2026@gmail.com)
 */

import { readFileSync, existsSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as XLSX from 'xlsx'
import { Resend } from 'resend'

const RECIPIENT_EMAIL = process.env.BACKUP_EMAIL || '88sol2026@gmail.com'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function convertTimestamp(obj) {
  if (!obj) return obj
  if (typeof obj === 'object' && !Array.isArray(obj) && typeof obj.toDate === 'function') {
    return obj.toDate()
  }
  if (typeof obj === 'object' && !Array.isArray(obj) && obj.seconds !== undefined) {
    return new Date(obj.seconds * 1000)
  }
  if (obj instanceof Date) return obj
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const out = {}
    for (const [k, v] of Object.entries(obj)) out[k] = convertTimestamp(v)
    return out
  }
  if (Array.isArray(obj)) return obj.map(convertTimestamp)
  return obj
}

function formatDate(d) {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatPaymentMethod(method) {
  return { cash: 'מזומן', transfer: 'העברה', credit: 'כרטיס אשראי', check: "צ'ק" }[method] || method
}

function formatBalance(balance) {
  if (balance === 0) return 'מאוזן'
  if (balance > 0) return `זכות: ${balance}₪`
  return `חוב: ${Math.abs(balance)}₪`
}

function formatFrequency(freq) {
  return { weekly: 'שבועי', biweekly: 'דו-שבועי', monthly: 'חודשי' }[freq] || freq
}

function setColumnWidths(sheet, widths) {
  sheet['!cols'] = widths.map(w => ({ wch: w }))
}

// ─── Build Excel Workbook ────────────────────────────────────────────────────
function buildWorkbook(clients, appointments, debtPayments, debtAdditions, now) {
  const wb = XLSX.utils.book_new()
  const dateStr = now.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const timeStr = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })

  // Sheet 1: Cover
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

  // Sheet 2: Clients
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

  // Sheet 3: Appointments history
  const apptHeaders = [
    'שם לקוח', 'תאריך', 'שעה', "פגישה מס'", 'הגיע/ה', 'שולם', 'סכום ששולם', 'אמצעי תשלום', 'הערות',
  ]
  const apptRows = []

  for (const client of clients) {
    const individualAppts = appointments
      .filter(a => a.clientId === client.id && !a.isGroup)
      .sort((a, b) => {
        const da = a.date instanceof Date ? a.date : new Date(a.date)
        const db2 = b.date instanceof Date ? b.date : new Date(b.date)
        return da.getTime() - db2.getTime()
      })

    const groupAppts = appointments
      .filter(a => a.isGroup && Array.isArray(a.groupParticipants) && a.groupParticipants.some(p => p.clientId === client.id))
      .sort((a, b) => {
        const da = a.date instanceof Date ? a.date : new Date(a.date)
        const db2 = b.date instanceof Date ? b.date : new Date(b.date)
        return da.getTime() - db2.getTime()
      })

    if (individualAppts.length === 0 && groupAppts.length === 0) continue

    apptRows.push([`── ${client.name} ──`, '', '', '', '', '', '', '', ''])

    for (const appt of individualAppts) {
      const paidAmount = (appt.payments || []).reduce((sum, p) => sum + p.amount, 0)
      const payMethods = [...new Set((appt.payments || []).map(p => formatPaymentMethod(p.method)))].join(', ')
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
      const payMethods = [...new Set((participant.payments || []).map(p => formatPaymentMethod(p.method)))].join(', ')
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

  // Sheet 4: Debt payments & additions
  const paymentHeaders = ['שם לקוח', 'תאריך', 'סכום', 'אמצעי תשלום', 'הערות', 'סוג']
  const paymentRows = []

  const sortByDateDesc = (a, b) => {
    const da = a.date instanceof Date ? a.date : new Date(a.date)
    const db2 = b.date instanceof Date ? b.date : new Date(b.date)
    return db2.getTime() - da.getTime()
  }

  for (const dp of [...debtPayments].sort(sortByDateDesc)) {
    paymentRows.push([dp.clientName, formatDate(dp.date), `${dp.amount}₪`, formatPaymentMethod(dp.method), dp.notes || '', 'תשלום חוב'])
  }
  for (const da of [...debtAdditions].sort(sortByDateDesc)) {
    paymentRows.push([da.clientName, formatDate(da.date), `${da.amount}₪`, '', da.notes || '', 'הוספת חוב'])
  }

  if (paymentRows.length > 0) {
    const paymentsSheet = XLSX.utils.aoa_to_sheet([paymentHeaders, ...paymentRows])
    setColumnWidths(paymentsSheet, [20, 12, 12, 16, 30, 14])
    XLSX.utils.book_append_sheet(wb, paymentsSheet, 'תשלומים וחובות')
  }

  return wb
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable.')
    console.error('   Set it in GitHub Secrets (for Actions)')
    process.exit(1)
  }

  console.log('🚀 מתחיל גיבוי ושליחת מייל...\n')

  // Initialize Firebase Admin
  let serviceAccount
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  } else {
    const keyFile = './soltherapy-manage-firebase-adminsdk-fbsvc-37bb126f12.json'
    if (!existsSync(keyFile)) {
      console.error('❌ לא נמצא קובץ service account ולא הוגדר FIREBASE_SERVICE_ACCOUNT')
      process.exit(1)
    }
    serviceAccount = JSON.parse(readFileSync(keyFile, 'utf8'))
  }

  initializeApp({ credential: cert(serviceAccount) })
  const db = getFirestore()

  // Fetch data
  console.log('📦 מוריד נתונים מ-Firestore...')
  const [clientsSnap, appointmentsSnap, debtPaymentsSnap, debtAdditionsSnap] = await Promise.all([
    db.collection('clients').get(),
    db.collection('appointments').get(),
    db.collection('debt_payments').get(),
    db.collection('debt_additions').get(),
  ])

  const clients = clientsSnap.docs
    .map(d => convertTimestamp({ id: d.id, ...d.data() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'he'))

  const appointments = appointmentsSnap.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }))
  const debtPayments = debtPaymentsSnap.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }))
  const debtAdditions = debtAdditionsSnap.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }))

  console.log(`   ✅ ${clients.length} לקוחות`)
  console.log(`   ✅ ${appointments.length} פגישות`)
  console.log(`   ✅ ${debtPayments.length} תשלומי חוב`)
  console.log(`   ✅ ${debtAdditions.length} הוספות חוב\n`)

  // Build Excel
  console.log('📊 בונה קובץ אקסל...')
  const now = new Date()
  const wb = buildWorkbook(clients, appointments, debtPayments, debtAdditions, now)
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
  const timestamp = now.toISOString().slice(0, 10)
  const filename = `גיבוי-נתונים-${timestamp}.xlsx`
  console.log(`   ✅ נוצר: ${filename}\n`)

  // Send email
  console.log(`📧 שולח מייל ל-${RECIPIENT_EMAIL}...`)
  const resend = new Resend(resendApiKey)

  const dateStr = now.toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const timeStr = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })

  const { error } = await resend.emails.send({
    from: 'גיבוי נתונים <onboarding@resend.dev>',
    to: RECIPIENT_EMAIL,
    subject: `גיבוי נתונים מהמערכת - ${dateStr}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; font-size: 14px;">
        <h2>גיבוי נתונים מהמערכת</h2>
        <p><strong>תאריך:</strong> ${dateStr}</p>
        <p><strong>שעה:</strong> ${timeStr}</p>
        <hr/>
        <p><strong>סיכום:</strong></p>
        <ul>
          <li>מספר לקוחות: ${clients.length}</li>
          <li>פגישות כולל: ${appointments.filter(a => !a.isGroup).length}</li>
          <li>לקוחות עם חוב: ${clients.filter(c => c.balance < 0).length}</li>
        </ul>
        <p>הגיבוי המלא מצורף כקובץ אקסל.</p>
      </div>
    `,
    attachments: [
      {
        filename,
        content: excelBuffer.toString('base64'),
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  })

  if (error) {
    throw new Error(`שגיאה בשליחת מייל: ${error.message}`)
  }

  console.log('   ✅ המייל נשלח בהצלחה!\n')
  console.log('='.repeat(50))
  console.log('✅ הגיבוי הושלם!')
  console.log('='.repeat(50))

  process.exit(0)
}

main().catch(err => {
  console.error('❌ שגיאה:', err.message)
  process.exit(1)
})
