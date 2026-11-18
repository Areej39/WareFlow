
import "server-only";

import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function getAuthenticatedAdmin(request) {
  const authorization = request.headers.get("authorization");

  // Check whether the Authorization header exists
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  // Extract Firebase ID token
  const token = authorization.slice(7);

  let decodedToken;

  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    throw new Error("UNAUTHORIZED");
  }

  // Find the Admin profile in Firestore
  const userSnapshot = await adminDb
    .collection("users")
    .doc(decodedToken.uid)
    .get();

  if (!userSnapshot.exists) {
    throw new Error("FORBIDDEN");
  }

  const userData = userSnapshot.data();

  // Verify Admin role and account status
  if (
    userData.role !== "admin" ||
    userData.status !== "active"
  ) {
    throw new Error("FORBIDDEN");
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
  };
}
