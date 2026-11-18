"use client";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {title}
        </p>

        {Icon && (
          <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
            <Icon size={20} />
          </div>
        )}
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}