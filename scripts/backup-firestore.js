#!/usr/bin/env node

/**
 * Firestore Backup Script
 *
 * Usage:
 *   node scripts/backup-firestore.js
 *
 * This script exports all Firestore collections to JSON files
 * in the /backups directory with timestamps.
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Firebase config for PRODUCTION (the real data)
const firebaseConfig = {
  apiKey: "AIzaSyBKOPNyi4TJ9mVMQFPmLakF-3WcLYzFzEc",
  authDomain: "soltherapy-manage.firebaseapp.com",
  projectId: "soltherapy-manage",
  storageBucket: "soltherapy-manage.firebasestorage.app",
  messagingSenderId: "710375340022",
  appId: "1:710375340022:web:cc8c104a29ba3170e279d7"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Collections to backup
const COLLECTIONS = ['clients', 'appointments', 'schedule_template', 'weekly_prizes']

/**
 * Convert Firestore Timestamp to ISO string
 */
function convertTimestamp(obj) {
  if (!obj) return obj

  if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
    return new Date(obj.seconds * 1000).toISOString()
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const converted = {}
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
async function backupCollection(collectionName) {
  console.log(`📦 Backing up: ${collectionName}...`)

  try {
    const snapshot = await getDocs(collection(db, collectionName))
    const data = []

    snapshot.forEach(doc => {
      const docData = doc.data()
      data.push({
        id: doc.id,
        ...convertTimestamp(docData)
      })
    })

    console.log(`   ✅ ${data.length} documents backed up`)
    return { collection: collectionName, count: data.length, data }
  } catch (error) {
    console.error(`   ❌ Error backing up ${collectionName}:`, error.message)
    return { collection: collectionName, error: error.message }
  }
}

/**
 * Main backup function
 */
async function backup() {
  console.log('🚀 Starting Firestore backup...\n')

  // Create backups directory if it doesn't exist
  const backupsDir = join(process.cwd(), 'backups')
  if (!existsSync(backupsDir)) {
    mkdirSync(backupsDir, { recursive: true })
  }

  // Create timestamp for this backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const backupDir = join(backupsDir, timestamp)
  mkdirSync(backupDir, { recursive: true })

  // Backup all collections
  const results = []
  for (const collectionName of COLLECTIONS) {
    const result = await backupCollection(collectionName)
    results.push(result)

    // Save individual collection backup
    if (!result.error) {
      const filename = join(backupDir, `${collectionName}.json`)
      writeFileSync(filename, JSON.stringify(result.data, null, 2), 'utf-8')
    }
  }

  // Create summary file
  const summary = {
    timestamp: new Date().toISOString(),
    projectId: firebaseConfig.projectId,
    collections: results.map(r => ({
      name: r.collection,
      count: r.count || 0,
      error: r.error || null
    }))
  }

  const summaryFile = join(backupDir, '_summary.json')
  writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf-8')

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('✅ Backup completed!')
  console.log('='.repeat(50))
  console.log(`📁 Location: ${backupDir}`)
  console.log(`📊 Summary:`)
  results.forEach(r => {
    if (r.error) {
      console.log(`   ❌ ${r.collection}: ERROR - ${r.error}`)
    } else {
      console.log(`   ✅ ${r.collection}: ${r.count} documents`)
    }
  })
  console.log('='.repeat(50))

  process.exit(0)
}

// Run backup
backup().catch(error => {
  console.error('❌ Backup failed:', error)
  process.exit(1)
})




