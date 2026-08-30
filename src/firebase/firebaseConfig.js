/**
 * Firebase configuration for Educational Games.
 *
 * To set up:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a project (or use existing)
 * 3. Go to Project Settings > General > Your apps > Add web app
 * 4. Copy the firebaseConfig object
 * 5. Replace the values below
 * 6. Go to Project Settings > Cloud Messaging > Web Push certificates
 * 7. Copy the VAPID key and set it below
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:000000000000",
};

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY";
