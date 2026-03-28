import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "preppilot-ai-57ab9.firebaseapp.com",
  projectId: "preppilot-ai-57ab9",
  storageBucket: "preppilot-ai-57ab9.firebasestorage.app",
  messagingSenderId: "753727451205",
  appId: "1:753727451205:web:88291317f6abef9829732c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider= new GoogleAuthProvider();
export {auth, provider}