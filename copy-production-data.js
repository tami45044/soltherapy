#!/usr/bin/env node

/**
 * Copy ALL data from Production to Test
 *
 * This script copies everything in one go!
 * Just run: npm run copy-data
 */

import { readFileSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const COLLECTIONS = ['clients', 'appointments', 'schedule_template', 'weekly_prizes']

// Load service account keys
let prodServiceAccount, testServiceAccount

try {
  prodServiceAccount = JSON.parse(readFileSync('./soltherapy-manage-firebase-adminsdk-fbsvc-37bb126f12.json', 'utf8'))
  testServiceAccount = JSON.parse(readFileSync('./soltherapy-test-firebase-adminsdk-fbsvc-74bfdfceb9.json', 'utf8'))
  console.log('✅ טענתי את מפתחות Firebase בהצלחה!')
} catch (error) {
  console.error('\n❌ לא מצאתי את קבצי המפתחות!')
  console.error('\nשגיאה:', error.message)
  console.error('\nוודאי שהקבצים קיימים בתיקיית הפרויקט\n')
  process.exit(1)
}

/**
 * Fix data types (convert string numbers to actual numbers)
 */
function fixDataTypes(data, collectionName) {
  // Fields that should be numbers
  const numberFields = ['price', 'pricePerSession', 'balance', 'totalSessions',
                        'sessionNumber', 'paymentAmount', 'amount', 'groupPrice',
                        'weeklyTarget', 'targetAmount']

  // Convert string numbers to numbers
  for (const field of numberFields) {
    if (data[field] !== undefined && data[field] !== null) {
      const val = data[field]
      if (typeof val === 'string' && !isNaN(val) && val.trim() !== '') {
        data[field] = Number(val)
      }
    }
  }

  // Fix nested arrays (like payments, groupParticipants)
  if (data.payments && Array.isArray(data.payments)) {
    data.payments = data.payments.map(p => {
      if (p.amount) p.amount = Number(p.amount)
      return p
    })
  }

  if (data.groupParticipants && Array.isArray(data.groupParticipants)) {
    data.groupParticipants = data.groupParticipants.map(p => {
      if (p.payments && Array.isArray(p.payments)) {
        p.payments = p.payments.map(payment => {
          if (payment.amount) payment.amount = Number(payment.amount)
          return payment
        })
      }
      return p
    })
  }

  return data
}

async function copyData() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 מעתיק נתונים מ-Production ל-Test')
  console.log('='.repeat(60))
  console.log('📤 מקור: soltherapy-manage (נתונים אמיתיים)')
  console.log('📥 יעד: soltherapy-test (סביבת בדיקה)')
  console.log('='.repeat(60) + '\n')

  try {
    // Initialize both Firebase Admin apps
    const prodApp = initializeApp({
      credential: cert(prodServiceAccount),
      projectId: 'soltherapy-manage'
    }, 'production')

    const testApp = initializeApp({
      credential: cert(testServiceAccount),
      projectId: 'soltherapy-test'
    }, 'test')

    const prodDb = getFirestore(prodApp)
    const testDb = getFirestore(testApp)

    const results = []

    for (const collectionName of COLLECTIONS) {
      console.log(`\n📦 מעבד: ${collectionName}`)
      console.log('-'.repeat(40))

      try {
        // Step 1: Read from production
        console.log('   📖 קורא מ-production...')
        const prodSnapshot = await prodDb.collection(collectionName).get()
        const dataToInsert = []

        prodSnapshot.forEach(doc => {
          dataToInsert.push({
            id: doc.id,
            data: doc.data()
          })
        })

        console.log(`   ✓ נמצאו ${dataToInsert.length} מסמכים`)

        // Step 2: Clear test collection
        console.log('   🗑️  מוחק נתונים ישנים ב-test...')
        const testSnapshot = await testDb.collection(collectionName).get()

        const deletePromises = []
        testSnapshot.forEach(doc => {
          deletePromises.push(testDb.collection(collectionName).doc(doc.id).delete())
        })
        await Promise.all(deletePromises)

        console.log(`   ✓ נמחקו ${testSnapshot.size} מסמכים ישנים`)

        // Step 3: Write to test (with data type fixes)
        console.log('   💾 מעתיק ל-test...')
        let copied = 0

        for (const item of dataToInsert) {
          // Fix data types before saving
          const fixedData = fixDataTypes(item.data, collectionName)
          await testDb.collection(collectionName).doc(item.id).set(fixedData)
          copied++

          // Progress indicator every 10 docs
          if (copied % 10 === 0) {
            process.stdout.write(`   📝 הועתקו ${copied}/${dataToInsert.length}...\r`)
          }
        }

        console.log(`   ✅ הועתקו ${copied} מסמכים!                    `)

        results.push({
          collection: collectionName,
          count: copied,
          success: true
        })

      } catch (error) {
        console.error(`   ❌ שגיאה: ${error.message}`)
        results.push({
          collection: collectionName,
          error: error.message,
          success: false
        })
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ ההעתקה הושלמה!')
    console.log('='.repeat(60))
    console.log('📊 סיכום:\n')

    let totalCopied = 0
    results.forEach(r => {
      if (r.success) {
        console.log(`   ✅ ${r.collection.padEnd(20)} ${r.count} מסמכים`)
        totalCopied += r.count
      } else {
        console.log(`   ❌ ${r.collection.padEnd(20)} שגיאה: ${r.error}`)
      }
    })

    console.log('\n' + '-'.repeat(60))
    console.log(`   📦 סה"כ ${totalCopied} מסמכים הועתקו!`)
    console.log('='.repeat(60))
    console.log('\n💡 עכשיו תוכלי להריץ npm run dev ולעבוד על')
    console.log('   עותק של הנתונים האמיתיים בסביבת הבדיקה!\n')

    process.exit(0)

  } catch (error) {
    console.error('\n❌ שגיאה כללית:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Run!
console.log('\n⏳ מתחיל...\n')
copyData()

