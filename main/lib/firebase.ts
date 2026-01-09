import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBssnq74-MqEXIZmZo4-3ZqKudWmDSp61c",
  authDomain: "li-au-ap.firebaseapp.com",
  projectId: "li-au-ap",
  storageBucket: "li-au-ap.firebasestorage.app",
  messagingSenderId: "972275251739",
  appId: "1:972275251739:web:c104030a177a7173c356be",
  measurementId: "G-81MNT19XLD"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Messaging is only available in the browser
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;