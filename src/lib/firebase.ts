// src/hooks/useAuth.tsx

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrhwWyowrqxXpOCS2_30pmVh1gZ72ypBQ",
  authDomain: "healthmate-mspro1.firebaseapp.com",
  projectId: "healthmate-mspro1",
  storageBucket: "healthmate-mspro1.appspot.com", // likely what you meant
  messagingSenderId: "189955277195",
  appId: "1:189955277195:web:901486c544636083f3af8e",
  measurementId: "G-L45H7PLWXH",
};

// Initialize Firebase app (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Export for use in your app
export { app, auth, googleProvider };