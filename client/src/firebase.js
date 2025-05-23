// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rens-estate-project.firebaseapp.com",
  projectId: "rens-estate-project",
  storageBucket: "rens-estate-project.firebasestorage.app",
  messagingSenderId: "11379579465",
  appId: "1:11379579465:web:23e51e0b8bafdcdaf73d98"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);