/**
 * Import Data from Backup JSON Files
 *
 * This allows importing backup files back into Firebase
 */

import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

/**
 * Import data from JSON files
 */
export async function importBackupFiles() {
  console.log('📥 מתחיל ייבוא נתונים מגיבוי...\n')

  try {
    // Create file inputs for each collection
    const collections = ['clients', 'appointments', 'schedule_template', 'weekly_prizes']
    const results: any[] = []

    for (const collectionName of collections) {
      console.log(`\n📦 ייבוא: ${collectionName}...`)

      // Create file input
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.json'

      // Wait for user to select file
      const file = await new Promise<File | null>((resolve) => {
        fileInput.onchange = (e: any) => {
          const file = e.target.files[0]
          resolve(file || null)
        }
        fileInput.click()
      })

      if (!file) {
        console.log(`   ⏭️ דילוג על ${collectionName}`)
        results.push({ collection: collectionName, count: 0, error: 'No file selected' })
        continue
      }

      // Read file
      const text = await file.text()
      const data = JSON.parse(text)

      if (!Array.isArray(data)) {
        throw new Error(`${collectionName}: Expected array, got ${typeof data}`)
      }

      console.log(`   📖 נמצאו ${data.length} מסמכים בקובץ`)

      // Clear existing collection
      const existingDocs = await getDocs(collection(db, collectionName))
      console.log(`   🗑️ מוחק ${existingDocs.size} מסמכים קיימים...`)

      for (const existingDoc of existingDocs.docs) {
        await deleteDoc(doc(db, collectionName, existingDoc.id))
      }

      // Import documents
      let importedCount = 0
      for (const item of data) {
        const { id, ...docData } = item

        // Convert ISO date strings back to Date objects
        const convertedData = convertDates(docData)

        await setDoc(doc(db, collectionName, id), convertedData)
        importedCount++
      }

      console.log(`   ✅ יובאו ${importedCount} מסמכים`)
      results.push({ collection: collectionName, count: importedCount, error: null })
    }

    // Print summary
    console.log('\n' + '='.repeat(50))
    console.log('✅ הייבוא הושלם!')
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

    return results
  } catch (error: any) {
    console.error('❌ שגיאה כללית:', error)
    throw error
  }
}

/**
 * Convert ISO date strings back to Date objects
 */
function convertDates(obj: any): any {
  if (!obj) return obj

  // Check if it's an ISO date string
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
    return new Date(obj)
  }

  // Recursively convert objects
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const converted: any = {}
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertDates(value)
    }
    return converted
  }

  // Recursively convert arrays
  if (Array.isArray(obj)) {
    return obj.map(item => convertDates(item))
  }

  return obj
}




