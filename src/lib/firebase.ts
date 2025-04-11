// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// IMPORTANT: Replace the following with your own Firebase configuration
// Go to Firebase Console (https://console.firebase.google.com/)
// Create a project, then add a web app to get these details
// See README for more instructions
const firebaseConfig = {

  apiKey: "AIzaSyDrhwWyowrqxXpOCS2_30pmVh1gZ72ypBQ",
  authDomain: "healthmate-mspro1.firebaseapp.com",
  projectId: "healthmate-mspro1",
  storageBucket: "healthmate-mspro1.firebasestorage.app",
  messagingSenderId: "189955277195",
  appId: "1:189955277195:web:901486c544636083f3af8e",
  measurementId: "G-L45H7PLWXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider }; 