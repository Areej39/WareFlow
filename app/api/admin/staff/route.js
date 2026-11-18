import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedAdmin } from "@/lib/server-auth";

export async function POST(request) {
  let createdUid = null;

  try {
    const admin = await getAuthenticatedAdmin(request);

    const { name, email, password } = await request.json();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { message: "Please enter valid staff details." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create Firebase Authentication account
    const userRecord = await adminAuth.createUser({
      email: normalizedEmail,
      password,
      displayName: name.trim(),
      disabled: false,
    });

    createdUid = userRecord.uid;

    // Create corresponding Firestore profile
    await adminDb.collection("users").doc(createdUid).set({
      uid: createdUid,
      displayName: name.trim(),
      email: normalizedEmail,
      role: "staff",
      status: "active",
      createdAt: new Date(),
      createdBy: admin.uid,
    });

    return NextResponse.json(
      {
        message: "Staff account created successfully.",
        staff: {
          uid: createdUid,
          email: normalizedEmail,
          role: "staff",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Staff creation error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });

    if (createdUid) {
      try {
        await adminAuth.deleteUser(createdUid);
      } catch (rollbackError) {
        console.error("Staff rollback failed:", rollbackError);
      }
    }

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Please sign in again." },
        { status: 401 }
      );
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Only active Admins can create staff accounts." },
        { status: 403 }
      );
    }

    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Unable to create staff account.",
      },
      { status: 500 }
    );
  }
}
