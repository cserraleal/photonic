
/**
 * @file db-config.js
 * @description Initializes Firebase and Firestore database.
 *              Exports the Firestore database globally using window.db.
 */

// Import Firebase SDK modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
// (Optional) Import Analytics if needed
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

// Firebase configuration (replace with your actual Firebase config!)
const firebaseConfig = {
  apiKey: "AIzaSyAipsztEOiFzx3FZcNN5T5JIvaoGFliw7E",
  authDomain: "photonic-17851.firebaseapp.com",
  projectId: "photonic-17851",
  storageBucket: "photonic-17851.firebasestorage.app",
  messagingSenderId: "893571764387",
  appId: "1:893571764387:web:f0b4b7862c4a3b3cd06f16",
  measurementId: "G-X565571PB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// (Optional) Initialize Analytics if needed
// const analytics = getAnalytics(app);

// Export Firestore globally
window.db = db;
