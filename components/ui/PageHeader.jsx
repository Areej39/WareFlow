export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}