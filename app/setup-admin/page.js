"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword,  signOut, } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SetupAdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/bootstrap-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ secret }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Setup failed.");
      }

      setMessage(data.message);

      await signOut(auth);

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to complete setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <form
        onSubmit={handleSetup}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Initial Admin Setup
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Use the account you created in Firebase Console.
          </p>
        </div>

        <input
          type="email"
          required
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-transparent p-3 text-sm dark:border-slate-700 dark:text-white"
        />

        <input
          type="password"
          required
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-transparent p-3 text-sm dark:border-slate-700 dark:text-white"
        />

        <input
          type="password"
          required
          placeholder="Bootstrap secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-transparent p-3 text-sm dark:border-slate-700 dark:text-white"
        />

        {message && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Setting up..." : "Create Admin Profile"}
        </button>
      </form>
    </main>
  );
}