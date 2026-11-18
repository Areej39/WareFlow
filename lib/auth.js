
"use client";

import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

// Login user
export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return credential.user;
};

// Logout user
export const logoutUser = async () => {
  await signOut(auth);
};

// Get currently logged-in user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get Firebase ID token
export const getCurrentUserToken = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  return user.getIdToken();
};

// Get user profile and role from Firestore
export const getUserProfile = async (uid) => {
  const userId = uid || auth.currentUser?.uid;

  if (!userId) {
    return null;
  }

  const userRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    return null;
  }

  return {
    uid: userId,
    ...userSnapshot.data(),
  };
};

// Admin creates staff account through secure API
export const createStaffAccount = async ({
  name,
  email,
  password,
}) => {
  const token = await getCurrentUserToken();

  const response = await fetch("/api/admin/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create staff account.");
  }

  return data;
};

// Send password reset email
export const resetUserPassword = async (email) => {
  await sendPasswordResetEmail(auth, email.trim());
};
