import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBrDibcRlHPtuXEgp85LIjJZ-_ta8",
  authDomain: "sri-sai-speciality-dental-care.firebaseapp.com",
  projectId: "sri-sai-speciality-dental-care",
  storageBucket: "sri-sai-speciality-dental-care.firebasestorage.app",
  messagingSenderId: "244185236699",
  appId: "1:244185236699:web:926ad6938ffca06f83b8fe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

