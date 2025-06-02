/**
 * @file save-user-data.js
 * @description Saves user inputs and results to Firestore.
 */

// Import Firestore functions from the CDN
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

/**
 * @function saveUserData
 * @description Saves the form data and calculated results to Firestore.
 * @param {object} userData - An object containing the user inputs and calculated results.
 */
export async function saveUserData(userData) {
  try {
    // Access the Firestore instance from the global window object
    const db = window.db;

    // Reference to the 'solarCalculations' collection in Firestore
    const calcCollection = collection(db, "solarCalculations");

    // Save the data with a server timestamp
    const docRef = await addDoc(calcCollection, {
      ...userData,
      createdAt: serverTimestamp()
    });

    console.log("Data saved to Firestore with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
  }
}
