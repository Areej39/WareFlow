"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";

import { Menu, LogOut, UserCircle } from "lucide-react";

export default function Header({
  user,
  profile,
  onMenuClick,
  onLogout,
}) {
  const displayName =
    profile?.displayName ||
    profile?.name ||
    user?.email ||
    "User";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Manage your warehouse operations.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <UserCircle
            size={32}
            className="text-slate-400"
          />

          <div className="max-w-40">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
              {displayName}
            </p>

            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {profile?.role || "User"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
        >
          <LogOut size={17} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}