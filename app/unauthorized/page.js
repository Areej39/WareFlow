import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          You do not have permission to access this page.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}