// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-bfb34.firebaseapp.com",
  projectId: "estate-bfb34",
  storageBucket: "estate-bfb34.firebasestorage.app",
  messagingSenderId: "101965108395",
  appId: "1:101965108395:web:9bd0fb810d7e95391d13ee",
  measurementId: "G-SB4HJ9JSSW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
