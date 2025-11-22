// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPoCE-pG0wVtCybpQStQGQkI16irsPeGQ",
  authDomain: "pylab-arena.firebaseapp.com",
  projectId: "pylab-arena",
  storageBucket: "pylab-arena.firebasestorage.app",
  messagingSenderId: "368150717348",
  appId: "1:368150717348:web:468ebf7279359eee211731",
  measurementId: "G-TL9L1BX286",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environments — guard for SSR/envs without window
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // getAnalytics can fail in non-browser environments or if analytics isn't supported.
  // We silently ignore here; features depending on analytics should handle a null value.
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
