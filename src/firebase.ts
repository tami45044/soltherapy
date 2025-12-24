import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Use environment variables for Firebase config
// In development: uses .env.development
// In production: uses .env.production (or Vercel environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBKOPNyi4TJ9mVMQFPmLakF-3WcLYzFzEc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "soltherapy-manage.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "soltherapy-manage",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "soltherapy-manage.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "710375340022",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:710375340022:web:cc8c104a29ba3170e279d7"
}

console.log(`🔥 Firebase Environment: ${import.meta.env.MODE}`)
console.log(`🔥 Firebase Project: ${firebaseConfig.projectId}`)

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

