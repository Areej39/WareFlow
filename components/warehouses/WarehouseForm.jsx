"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";

import FormField from "@/components/ui/FormField";

const emptyForm = {
  name: "",
  code: "",
  location: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

export default function WarehouseForm({
  editingWarehouse,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingWarehouse) {
      setForm({
        name: editingWarehouse.name || "",
        code: editingWarehouse.code || "",
        location: editingWarehouse.location || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingWarehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter the warehouse information below.
          </p>
        </div>

        {editingWarehouse && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel editing"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          <FormField label="Warehouse Name" htmlFor="warehouse-name">
            <input
              id="warehouse-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Main Warehouse"
              required
              className={inputClass}
            />
          </FormField>

          <FormField label="Warehouse Code" htmlFor="warehouse-code">
            <input
              id="warehouse-code"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. WH-001"
              required
              className={`${inputClass} uppercase`}
            />
          </FormField>

          <FormField label="Location" htmlFor="warehouse-location">
            <input
              id="warehouse-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lahore"
              required
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}

            {saving
              ? "Saving..."
              : editingWarehouse
                ? "Update Warehouse"
                : "Add Warehouse"}
          </button>

          {editingWarehouse && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}