// services/appointmentService.js
// Handles: Book, cancel, reschedule, fetch appointments

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const APPOINTMENTS = "appointments";

// ─── BOOK APPOINTMENT ────────────────────────────────────────────────────────
// status: "pending" | "confirmed" | "completed" | "cancelled"
export async function bookAppointment({
  patientId,
  patientName,
  doctorId = "default",
  date,          // "YYYY-MM-DD"
  timeSlot,      // "10:00 AM"
  treatmentType, // "Cleaning" | "Root Canal" | "Braces" | etc.
  notes = "",
}) {
  const ref = await addDoc(collection(db, APPOINTMENTS), {
    patientId,
    patientName,
    doctorId,
    date,
    timeSlot,
    treatmentType,
    notes,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── GET APPOINTMENTS FOR A PATIENT ──────────────────────────────────────────
export async function getPatientAppointments(patientId) {
  const q = query(
    collection(db, APPOINTMENTS),
    where("patientId", "==", patientId),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── GET ALL APPOINTMENTS (ADMIN) ────────────────────────────────────────────
export async function getAllAppointments(dateFilter = null) {
  let q;
  if (dateFilter) {
    q = query(
      collection(db, APPOINTMENTS),
      where("date", "==", dateFilter),
      orderBy("timeSlot")
    );
  } else {
    q = query(collection(db, APPOINTMENTS), orderBy("date", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── UPDATE APPOINTMENT STATUS ────────────────────────────────────────────────
// newStatus: "confirmed" | "completed" | "cancelled"
export async function updateAppointmentStatus(appointmentId, newStatus) {
  await updateDoc(doc(db, APPOINTMENTS, appointmentId), {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

// ─── RESCHEDULE APPOINTMENT ───────────────────────────────────────────────────
export async function rescheduleAppointment(appointmentId, { date, timeSlot }) {
  await updateDoc(doc(db, APPOINTMENTS, appointmentId), {
    date,
    timeSlot,
    status: "pending",
    updatedAt: serverTimestamp(),
  });
}

// ─── CANCEL APPOINTMENT ───────────────────────────────────────────────────────
export async function cancelAppointment(appointmentId) {
  await updateAppointmentStatus(appointmentId, "cancelled");
}

// ─── GET BOOKED SLOTS FOR A DATE (to show unavailable times) ─────────────────
export async function getBookedSlots(date) {
  const q = query(
    collection(db, APPOINTMENTS),
    where("date", "==", date),
    where("status", "!=", "cancelled")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().timeSlot);
}
