/**
 * Copy Data from Production to Test Environment
 * 
 * This script copies all data from soltherapy-manage (production)
 * to soltherapy-test (development) for safe testing.
 * 
 * ⚠️ Run this ONLY when connected to production!
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'

const COLLECTIONS = ['clients', 'appointments', 'schedule_template', 'weekly_prizes']

// Production config (source)
const productionConfig = {
  apiKey: "AIzaSyBKOPNyi4TJ9mVMQFPmLakF-3WcLYzFzEc",
  authDomain: "soltherapy-manage.firebaseapp.com",
  projectId: "soltherapy-manage",
  storageBucket: "soltherapy-manage.firebasestorage.app",
  messagingSenderId: "710375340022",
  appId: "1:710375340022:web:cc8c104a29ba3170e279d7"
}

// Test config (destination)
const testConfig = {
  apiKey: "AIzaSyBVVcCYgtW6d3vLNxjAuP0rk9Ak8HoVwSw",
  authDomain: "soltherapy-test.firebaseapp.com",
  projectId: "soltherapy-test",
  storageBucket: "soltherapy-test.firebasestorage.app",
  messagingSenderId: "152598234726",
  appId: "1:152598234726:web:56b6baceb525c7f3ef4fa7"
}

/**
 * Copy data from production to test
 */
export async function copyProductionToTest() {
  console.log('🚀 מתחיל העתקת נתונים...\n')
  console.log('📤 מקור: soltherapy-manage (נתונים אמיתיים)')
  console.log('📥 יעד: soltherapy-test (סביבת בדיקה)')
  console.log('\n' + '='.repeat(50))
  
  try {
    // Initialize both Firebase apps
    const prodApp = initializeApp(productionConfig, 'production')
    const testApp = initializeApp(testConfig, 'test')
    
    const prodDb = getFirestore(prodApp)
    const testDb = getFirestore(testApp)
    
    const results: any[] = []
    
    // Copy each collection
    for (const collectionName of COLLECTIONS) {
      console.log(`\n📦 מעתיק: ${collectionName}...`)
      
      try {
        // Read from production
        const prodSnapshot = await getDocs(collection(prodDb, collectionName))
        const docs = prodSnapshot.docs
        
        console.log(`   📖 נמצאו ${docs.length} מסמכים בייצור`)
        
        // Clear test collection first
        const testSnapshot = await getDocs(collection(testDb, collectionName))
        console.log(`   🗑️ מוחק ${testSnapshot.size} מסמכים קיימים בבדיקה...`)
        
        for (const testDoc of testSnapshot.docs) {
          await deleteDoc(doc(testDb, collectionName, testDoc.id))
        }
        
        // Write to test
        let copiedCount = 0
        for (const prodDoc of docs) {
          const data = prodDoc.data()
          await setDoc(doc(testDb, collectionName, prodDoc.id), data)
          copiedCount++
        }
        
        console.log(`   ✅ הועתקו ${copiedCount} מסמכים`)
        results.push({
          collection: collectionName,
          count: copiedCount,
          error: null
        })
      } catch (error: any) {
        console.error(`   ❌ שגיאה בהעתקת ${collectionName}:`, error.message)
        results.push({
          collection: collectionName,
          count: 0,
          error: error.message
        })
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(50))
    console.log('✅ ההעתקה הושלמה!')
    console.log('='.repeat(50))
    console.log('📊 סיכום:')
    results.forEach(r => {
      if (r.error) {
        console.log(`   ❌ ${r.collection}: שגיאה - ${r.error}`)
      } else {
        console.log(`   ✅ ${r.collection}: ${r.count} מסמכים`)
      }
    })
    console.log('='.repeat(50))
    console.log('\n💡 עכשיו תוכלי לעבור לסביבת הבדיקה (soltherapy-test)')
    console.log('   ולעבוד על עותק של הנתונים האמיתיים!')
    
    return results
  } catch (error: any) {
    console.error('❌ שגיאה כללית:', error)
    throw error
  }
}

