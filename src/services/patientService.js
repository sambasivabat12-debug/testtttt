// services/patientService.js
// Handles: Patient profile, medical history, X-rays, treatment history

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";

const PATIENTS = "patients";

// ─── GET PATIENT PROFILE ─────────────────────────────────────────────────────
export async function getPatientProfile(patientId) {
  const snap = await getDoc(doc(db, PATIENTS, patientId));
  if (!snap.exists()) throw new Error("Patient not found");
  return { id: snap.id, ...snap.data() };
}

// ─── UPDATE PATIENT PROFILE ───────────────────────────────────────────────────
export async function updatePatientProfile(patientId, updates) {
  await updateDoc(doc(db, PATIENTS, patientId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ─── ADD MEDICAL HISTORY ENTRY ────────────────────────────────────────────────
// Each entry: { condition, notes, diagnosedAt }
export async function addMedicalHistory(patientId, entry) {
  await updateDoc(doc(db, PATIENTS, patientId), {
    medicalHistory: arrayUnion({
      ...entry,
      addedAt: new Date().toISOString(),
    }),
  });
}

// ─── ADD ALLERGY ──────────────────────────────────────────────────────────────
export async function addAllergy(patientId, allergy) {
  await updateDoc(doc(db, PATIENTS, patientId), {
    allergies: arrayUnion(allergy),
  });
}

// ─── ADD TREATMENT RECORD ─────────────────────────────────────────────────────
// treatments sub-collection for full history
export async function addTreatmentRecord(patientId, {
  treatmentType,
  description,
  doctorId,
  date,
  cost,
  notes = "",
}) {
  const ref = collection(db, PATIENTS, patientId, "treatments");
  const { addDoc } = await import("firebase/firestore");
  await addDoc(ref, {
    treatmentType,
    description,
    doctorId,
    date,
    cost,
    notes,
    createdAt: serverTimestamp(),
  });
}

// ─── GET TREATMENT HISTORY ───────────────────────────────────────────────────
export async function getTreatmentHistory(patientId) {
  const ref = collection(db, PATIENTS, patientId, "treatments");
  const q = query(ref, orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── GET ALL PATIENTS (ADMIN) ─────────────────────────────────────────────────
export async function getAllPatients() {
  const snap = await getDocs(collection(db, PATIENTS));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
