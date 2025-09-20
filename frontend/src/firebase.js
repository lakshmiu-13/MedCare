// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Use your Firebase project config (from console)
const firebaseConfig = {
  apiKey: "AIzaSyAcKENsRS-xHNB1B63yqce8QizQSa9FtGM",
  authDomain: "medcare-app-118ac.firebaseapp.com",
  projectId: "medcare-app-118ac",
  storageBucket: "medcare-app-118ac.appspot.com",
  messagingSenderId: "538461976793",
  appId: "1:538461976793:web:7e9298daf0bba97a3f66c8"
};

// ✅ Initialize Firebase only once here
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
