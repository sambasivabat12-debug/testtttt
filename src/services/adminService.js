// services/adminService.js
// Handles: Dashboard stats, manage users/roles, available time slots

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const [
    totalPatients,
    todayAppointments,
    pendingAppointments,
    totalPrescriptions,
  ] = await Promise.all([
    getCountFromServer(collection(db, "patients")),
    getCountFromServer(
      query(collection(db, "appointments"), where("date", "==", today))
    ),
    getCountFromServer(
      query(collection(db, "appointments"), where("status", "==", "pending"))
    ),
    getCountFromServer(collection(db, "prescriptions")),
  ]);

  return {
    totalPatients: totalPatients.data().count,
    todayAppointments: todayAppointments.data().count,
    pendingAppointments: pendingAppointments.data().count,
    totalPrescriptions: totalPrescriptions.data().count,
  };
}

// ─── MANAGE USER ROLES ────────────────────────────────────────────────────────
// Promote a patient to admin or vice versa
export async function setUserRole(uid, role) {
  await updateDoc(doc(db, "users", uid), {
    role, // "patient" | "admin"
    updatedAt: serverTimestamp(),
  });
}

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── MANAGE TIME SLOTS ────────────────────────────────────────────────────────
// Slots stored in Firestore so admin can enable/disable them

// Set available slots for a date: slots = ["9:00 AM", "10:00 AM", ...]
export async function setAvailableSlots(date, slots) {
  await setDoc(doc(db, "availableSlots", date), {
    date,
    slots,
    updatedAt: serverTimestamp(),
  });
}

// Get available slots for a date
export async function getAvailableSlots(date) {
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "availableSlots", date));
  if (!snap.exists()) {
    // Return default slots if none set
    return [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
      "11:00 AM", "11:30 AM", "12:00 PM",
      "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
      "4:00 PM", "4:30 PM", "5:00 PM",
    ];
  }
  return snap.data().slots;
}

// ─── BLOCK A DATE (holiday/leave) ─────────────────────────────────────────────
export async function blockDate(date, reason = "Clinic Closed") {
  await setDoc(doc(db, "blockedDates", date), {
    date,
    reason,
    createdAt: serverTimestamp(),
  });
}

// ─── GET BLOCKED DATES ────────────────────────────────────────────────────────
export async function getBlockedDates() {
  const snap = await getDocs(collection(db, "blockedDates"));
  return snap.docs.map((d) => d.id); // returns array of date strings
}

// ─── UNBLOCK A DATE ───────────────────────────────────────────────────────────
export async function unblockDate(date) {
  await deleteDoc(doc(db, "blockedDates", date));
}
