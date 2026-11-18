"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Warehouse,
  Package,
  Power,
  Pencil,
  MapPin,
  Loader2,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import WarehouseForm from "@/components/warehouses/WarehouseForm";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/lib/warehouse";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [warehouseToDeactivate, setWarehouseToDeactivate] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch warehouses
  const loadWarehouses = async () => {
    try {
      setLoading(true);

      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      setError(err.message || "Unable to load warehouses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  // Search
  const filteredWarehouses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return warehouses.filter((warehouse) =>
      [
        warehouse.name,
        warehouse.code,
        warehouse.location,
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }, [warehouses, search]);

  // Statistics
  const totalWarehouses = warehouses.length;

  const activeWarehouses = warehouses.filter(
    (item) => item.status === "active"
  ).length;

  const inactiveWarehouses =
    totalWarehouses - activeWarehouses;

  // Create or update warehouse
  const handleSubmit = async (formData) => {
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, formData);
        setSuccess("Warehouse updated successfully.");
      } else {
        await createWarehouse(formData);
        setSuccess("Warehouse created successfully.");
      }

      setEditingWarehouse(null);
      await loadWarehouses();
    } catch (err) {
      setError(err.message || "Unable to save warehouse.");
    } finally {
      setSaving(false);
    }
  };

  // Deactivate warehouse
  const handleDeactivate = async () => {
    if (!warehouseToDeactivate) return;

    setError("");
    setSuccess("");

    try {
      setDeactivating(true);

      await deleteWarehouse(warehouseToDeactivate.id);

      setSuccess("Warehouse deactivated successfully.");

      if (editingWarehouse?.id === warehouseToDeactivate.id) {
        setEditingWarehouse(null);
      }

      setWarehouseToDeactivate(null);
      await loadWarehouses();
    } catch (err) {
      setError(err.message || "Unable to deactivate warehouse.");
    } finally {
      setDeactivating(false);
    }
  };

  // Start editing
  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-8">

          {/* Page heading */}
          <PageHeader
            eyebrow="Inventory Management"
            title="Warehouses"
            description="Manage your warehouse locations and details."
          />

          {/* Alerts */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              {success}
            </div>
          )}

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Warehouses"
              value={totalWarehouses}
              icon={Warehouse}
            />

            <StatCard
              title="Active Warehouses"
              value={activeWarehouses}
              icon={Package}
            />

            <StatCard
              title="Inactive Warehouses"
              value={inactiveWarehouses}
              icon={Power}
            />
          </div>

          {/* Add / Edit form */}
          <WarehouseForm
            editingWarehouse={editingWarehouse}
            onSubmit={handleSubmit}
            onCancel={() => setEditingWarehouse(null)}
            saving={saving}
          />

          {/* Warehouse table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  All Warehouses
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  View and manage registered warehouse locations.
                </p>
              </div>

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search warehouses..."
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
                <Loader2 size={18} className="animate-spin" />
                Loading warehouses...
              </div>
            ) : filteredWarehouses.length === 0 ? (
              <div className="py-16 text-center">
                <Warehouse
                  size={35}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />

                <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
                  No warehouses found
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add a warehouse or try a different search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Warehouse</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredWarehouses.map((warehouse) => (
                      <tr
                        key={warehouse.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {warehouse.name}
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {warehouse.code}
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-2">
                            <MapPin
                              size={15}
                              className="text-slate-400"
                            />
                            {warehouse.location}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={warehouse.status} />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(warehouse)}
                              className="rounded-lg p-2 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950"
                              title="Edit warehouse"
                            >
                              <Pencil size={17} />
                            </button>

                            {warehouse.status === "active" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setWarehouseToDeactivate(warehouse)
                                }
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                title="Deactivate warehouse"
                              >
                                <Power size={17} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Confirmation dialog */}
          <ConfirmDialog
            open={Boolean(warehouseToDeactivate)}
            title="Deactivate Warehouse"
            message={`Are you sure you want to deactivate ${
              warehouseToDeactivate?.name || "this warehouse"
            }?`}
            confirmText="Deactivate"
            onConfirm={handleDeactivate}
            onCancel={() => setWarehouseToDeactivate(null)}
            loading={deactivating}
          />

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}