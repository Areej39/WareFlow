"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@/components/providers/AuthProvider";
import { logoutUser } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        role={profile?.role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          user={user}
          profile={profile}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {loggingOut && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/30">
            <div className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-lg dark:bg-slate-900 dark:text-white">
              Logging out...
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}