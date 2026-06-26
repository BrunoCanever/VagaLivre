// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuoj9PnWzAUe6elGAaplmqdWo2auyj-tQ",
  authDomain: "vagalivre-db759.firebaseapp.com",
  projectId: "vagalivre-db759",
  storageBucket: "vagalivre-db759.firebasestorage.app",
  messagingSenderId: "387063979800",
  appId: "1:387063979800:web:3f67bf17b790993f71c86d",
  measurementId: "G-BQLJXNE99Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);