import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

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

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

