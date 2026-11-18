
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createStaffAccount } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  UserPlus,
  User,
  Mail,
  LockKeyhole,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

function StaffSignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await createStaffAccount({
        name,
        email,
        password,
      });

      setSuccess("Staff account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Staff signup error:", err);
      setError(err.message || "Unable to create staff account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            <UserPlus size={27} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Staff Account
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Add a new staff member to your WareFlow team.
          </p>
        </div>

        {/* Signup Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 dark:border-slate-700">
                <User size={18} className="text-slate-400" />

                <input
                  type="text"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter staff name"
                  className="w-full bg-transparent py-3 text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 dark:border-slate-700">
                <Mail size={18} className="text-slate-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@example.com"
                  className="w-full bg-transparent py-3 text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Temporary Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 dark:border-slate-700">
                <LockKeyhole size={18} className="text-slate-400" />

                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-transparent py-3 text-sm outline-none dark:text-white"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Share this temporary password securely with the staff member.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={18} />

              {loading ? "Creating Account..." : "Create Staff Account"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          New accounts are automatically assigned the Staff role.
        </p>
      </div>
    </main>
  );
}

export default function StaffSignupPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <StaffSignupForm />
    </ProtectedRoute>
  );
}
