/**
 * Firestore Backup Utility (Browser-based)
 *
 * This runs in the browser and uses your existing authentication
 * to export all data to JSON files.
 */

import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const COLLECTIONS = ['clients', 'appointments', 'schedule_template', 'weekly_prizes']

/**
 * Convert Firestore Timestamp to ISO string
 */
function convertTimestamp(obj: any): any {
  if (!obj) return obj

  if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
    return new Date(obj.seconds * 1000).toISOString()
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const converted: any = {}
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertTimestamp(value)
    }
    return converted
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestamp(item))
  }

  return obj
}

/**
 * Backup a single collection
 */
async function backupCollection(collectionName: string) {
  console.log(`📦 מגבה: ${collectionName}...`)

  try {
    const snapshot = await getDocs(collection(db, collectionName))
    const data: any[] = []

    snapshot.forEach(doc => {
      const docData = doc.data()
      data.push({
        id: doc.id,
        ...convertTimestamp(docData)
      })
    })

    console.log(`   ✅ ${data.length} מסמכים גובו`)
    return { collection: collectionName, count: data.length, data, error: null }
  } catch (error: any) {
    console.error(`   ❌ שגיאה בגיבוי ${collectionName}:`, error.message)
    return { collection: collectionName, error: error.message, count: 0, data: [] }
  }
}

/**
 * Download data as JSON file
 */
function downloadJSON(filename: string, data: any) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Main backup function
 */
export async function backupFirestore() {
  console.log('🚀 מתחיל גיבוי Firestore...\n')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const results: any[] = []

  // Backup all collections
  for (const collectionName of COLLECTIONS) {
    const result = await backupCollection(collectionName)
    results.push(result)
  }

  // Create summary
  const summary = {
    timestamp: new Date().toISOString(),
    projectId: 'soltherapy-manage',
    collections: results.map(r => ({
      name: r.collection,
      count: r.count || 0,
      error: r.error || null
    }))
  }

  // Download all files
  console.log('\n' + '='.repeat(50))
  console.log('💾 מוריד קבצי גיבוי...')
  console.log('='.repeat(50))

  // Download individual collections
  for (const result of results) {
    if (!result.error && result.data.length > 0) {
      downloadJSON(`${timestamp}_${result.collection}.json`, result.data)
      console.log(`✅ הורד: ${result.collection}.json`)
    }
  }

  // Download summary
  downloadJSON(`${timestamp}_summary.json`, summary)
  console.log(`✅ הורד: summary.json`)

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('✅ הגיבוי הושלם!')
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

  return summary
}




