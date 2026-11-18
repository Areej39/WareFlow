
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const {
    user,
    profile,
    loading,
    profileLoading,
    profileError,
    refreshProfile,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading || profileLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profile || profileError) return;

    if (
      profile.status !== "active" ||
      (allowedRoles.length > 0 &&
        !allowedRoles.includes(profile.role))
    ) {
      router.replace("/unauthorized");
    }
  }, [
    user,
    profile,
    loading,
    profileLoading,
    profileError,
    allowedRoles,
    router,
  ]);

  // Initial authentication/profile loading
  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <RefreshCw
            size={26}
            className="mx-auto animate-spin text-cyan-600"
          />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  // No authenticated user
  if (!user) {
    return null;
  }

  // Profile missing or could not be loaded
  if (profileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle size={27} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Unable to load your account
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {profileError?.message ||
              "Your account profile is not available. Please try again."}
          </p>

          <button
            type="button"
            onClick={refreshProfile}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Account is inactive
  if (profile.status !== "active") {
    return null;
  }

  // User does not have permission for this route
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(profile.role)
  ) {
    return null;
  }

  return children;
}
