// --- FIREBASE CONFIGURATION ---
// For Local Development: Replace the strings below with your keys.
// For Vercel Deployment: Use Environment Variables (Settings -> Environment Variables)

// Safely attempt to access environment variables. 
// We use a fallback empty object to prevent crashes if import.meta.env is not defined.
const env = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "REPLACE_WITH_YOUR_API_KEY",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || "https://REPLACE_WITH_YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: env.VITE_FIREBASE_APP_ID || "1:1234567890:web:12345abcde"
};