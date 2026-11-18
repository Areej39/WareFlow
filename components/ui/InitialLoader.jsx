"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Boxes } from "lucide-react";

export default function InitialLoader({ children }) {
  const { loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20">
            <Boxes size={32} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            WareFlow
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Warehouse Management System
          </p>

          <div className="mt-7 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-600" />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  return children;
}