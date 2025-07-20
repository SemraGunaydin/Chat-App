// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBg1OYoOvdEWiGfbmm-pRz3OqWLFg12zac",
  authDomain: "login-page-5d026.firebaseapp.com",
  projectId: "login-page-5d026",
  storageBucket: "login-page-5d026.firebasestorage.app",
  messagingSenderId: "704051299511",
  appId: "1:704051299511:web:455cbf78336ac0655ff932"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google provider setup
export const provider = new GoogleAuthProvider();

// auth service setup
export const auth =getAuth(app);

// database service referance
export const db = getFirestore(app);