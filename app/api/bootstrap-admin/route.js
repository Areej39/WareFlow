import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";


export async function POST(request) {
  try {
    const { secret } = await request.json();

    if (
      !process.env.BOOTSTRAP_ADMIN_SECRET ||
      secret !== process.env.BOOTSTRAP_ADMIN_SECRET
    ) {
      return NextResponse.json(
        { message: "Invalid setup secret." },
        { status: 403 }
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);
    const decodedToken = await adminAuth.verifyIdToken(token);

    const userRecord = await adminAuth.getUser(decodedToken.uid);

    const configRef = adminDb.collection("system").doc("roles");
    const userRef = adminDb.collection("users").doc(decodedToken.uid);

    await adminDb.runTransaction(async (transaction) => {
      const configSnapshot = await transaction.get(configRef);
      const userSnapshot = await transaction.get(userRef);

      if (configSnapshot.exists && configSnapshot.data().bootstrapComplete) {
        throw new Error("BOOTSTRAP_ALREADY_COMPLETED");
      }

      if (userSnapshot.exists) {
        throw new Error("USER_PROFILE_ALREADY_EXISTS");
      }

      transaction.set(userRef, {
        uid: decodedToken.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || "Administrator",
        role: "admin",
        status: "active",
        createdAt: new Date(),
        createdBy: "initial-setup",
      });

      transaction.set(configRef, {
        bootstrapComplete: true,
        adminUid: decodedToken.uid,
        completedAt: new Date(),
      });
    });

    return NextResponse.json({
      message: "Initial Admin account created successfully.",
    });
  } catch (error) {
    console.error("Admin bootstrap error:", error);

    if (error.message === "BOOTSTRAP_ALREADY_COMPLETED") {
      return NextResponse.json(
        { message: "Initial Admin setup has already been completed." },
        { status: 409 }
      );
    }

    if (error.message === "USER_PROFILE_ALREADY_EXISTS") {
      return NextResponse.json(
        { message: "This user already has a profile." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Unable to complete Admin setup." },
      { status: 500 }
    );
  }
}