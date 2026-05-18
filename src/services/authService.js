// services/authService.js
// Handles: Patient & Admin login, registration, logout, password reset

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// ─── REGISTER PATIENT ────────────────────────────────────────────────────────
export async function registerPatient({ name, email, password, phone, dob }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    email,
    phone,
    dob,
    role: "patient",           // "patient" | "admin"
    createdAt: serverTimestamp(),
  });

  // Create empty patient record
  await setDoc(doc(db, "patients", uid), {
    uid,
    name,
    email,
    phone,
    dob,
    medicalHistory: [],
    allergies: [],
    createdAt: serverTimestamp(),
  });

  return userCredential.user;
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Fetch role from Firestore
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("User record not found.");

  return { user: userCredential.user, role: userDoc.data().role };
}

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth);
}

// ─── PASSWORD RESET ──────────────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ─── AUTH STATE LISTENER ─────────────────────────────────────────────────────
// Use this in your App.jsx to detect login/logout
// onAuthChange((user) => { if (user) ... else ... })
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── GET CURRENT USER ROLE ───────────────────────────────────────────────────
export async function getCurrentUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
}
