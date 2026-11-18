export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  const styles = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    inactive:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    cancelled:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[normalizedStatus] ||
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}