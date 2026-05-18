// services/prescriptionService.js
// Handles: Create, fetch, update prescriptions for patients

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const PRESCRIPTIONS = "prescriptions";

// ─── CREATE PRESCRIPTION (Doctor/Admin) ──────────────────────────────────────
// medicines: [{ name, dosage, frequency, duration, instructions }]
export async function createPrescription({
  patientId,
  patientName,
  doctorId,
  doctorName,
  appointmentId = null,
  diagnosis,
  medicines,
  notes = "",
  followUpDate = null,
}) {
  const ref = await addDoc(collection(db, PRESCRIPTIONS), {
    patientId,
    patientName,
    doctorId,
    doctorName,
    appointmentId,
    diagnosis,
    medicines,       // array of medicine objects
    notes,
    followUpDate,
    isActive: true,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── GET PRESCRIPTIONS FOR A PATIENT ─────────────────────────────────────────
export async function getPatientPrescriptions(patientId) {
  const q = query(
    collection(db, PRESCRIPTIONS),
    where("patientId", "==", patientId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── GET SINGLE PRESCRIPTION ──────────────────────────────────────────────────
export async function getPrescription(prescriptionId) {
  const snap = await getDoc(doc(db, PRESCRIPTIONS, prescriptionId));
  if (!snap.exists()) throw new Error("Prescription not found");
  return { id: snap.id, ...snap.data() };
}

// ─── GET ALL PRESCRIPTIONS (ADMIN) ────────────────────────────────────────────
export async function getAllPrescriptions() {
  const q = query(collection(db, PRESCRIPTIONS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── UPDATE PRESCRIPTION ──────────────────────────────────────────────────────
export async function updatePrescription(prescriptionId, updates) {
  await updateDoc(doc(db, PRESCRIPTIONS, prescriptionId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ─── DEACTIVATE PRESCRIPTION ─────────────────────────────────────────────────
export async function deactivatePrescription(prescriptionId) {
  await updateDoc(doc(db, PRESCRIPTIONS, prescriptionId), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

// ─── GET PRESCRIPTIONS BY APPOINTMENT ────────────────────────────────────────
export async function getPrescriptionsByAppointment(appointmentId) {
  const q = query(
    collection(db, PRESCRIPTIONS),
    where("appointmentId", "==", appointmentId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
