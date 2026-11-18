"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const warehousesRef = collection(db, "warehouses");

// Get all warehouses
export const getWarehouses = async () => {
  const snapshot = await getDocs(warehousesRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

// Check whether a warehouse code is already in use
const isWarehouseCodeTaken = async (code, excludeId = null) => {
  const normalizedCode = code.trim().toUpperCase();

  const warehouseQuery = query(
    warehousesRef,
    where("code", "==", normalizedCode)
  );

  const snapshot = await getDocs(warehouseQuery);

  return snapshot.docs.some((item) => item.id !== excludeId);
};

// Create warehouse
export const createWarehouse = async (data) => {
  const name = data.name.trim();
  const code = data.code.trim().toUpperCase();
  const location = data.location.trim();

  if (!name || !code || !location) {
    throw new Error("All warehouse fields are required.");
  }

  if (await isWarehouseCodeTaken(code)) {
    throw new Error("A warehouse with this code already exists.");
  }

  return addDoc(warehousesRef, {
    name,
    code,
    location,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Update warehouse
export const updateWarehouse = async (id, data) => {
  const name = data.name.trim();
  const code = data.code.trim().toUpperCase();
  const location = data.location.trim();

  if (!name || !code || !location) {
    throw new Error("All warehouse fields are required.");
  }

  if (await isWarehouseCodeTaken(code, id)) {
    throw new Error("A warehouse with this code already exists.");
  }

  return updateDoc(doc(db, "warehouses", id), {
    name,
    code,
    location,
    updatedAt: serverTimestamp(),
  });
};

// Deactivate warehouse instead of permanently deleting it
export const deleteWarehouse = async (id) => {
  return updateDoc(doc(db, "warehouses", id), {
    status: "inactive",
    updatedAt: serverTimestamp(),
  });
};