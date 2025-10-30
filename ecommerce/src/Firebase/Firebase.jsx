import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBGMSosVd1ykA9FjKSiD1pUcIBovZuRpBQ",
  authDomain: "ecommerce-a5b03.firebaseapp.com",
  projectId: "ecommerce-a5b03",
  storageBucket: "ecommerce-a5b03.firebasestorage.app",
  messagingSenderId: "557162549829",
  appId: "1:557162549829:web:5495a78554b2e1ac73892c",
  measurementId: "G-4TQ1S9WJC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const fireDB = getFirestore(app);
const auth = getAuth(app)
export {fireDB,auth } ;
