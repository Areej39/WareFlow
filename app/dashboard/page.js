
"use client";

import { useMemo } from "react";
import {
  Package,
  Warehouse,
  Tags,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Activity,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

import { useAuth } from "@/components/providers/AuthProvider";

const inventoryData = [
  { month: "Jan", stock: 420 },
  { month: "Feb", stock: 510 },
  { month: "Mar", stock: 470 },
  { month: "Apr", stock: 620 },
  { month: "May", stock: 580 },
  { month: "Jun", stock: 720 },
];

const recentActivity = [
  {
    id: 1,
    title: "New product added",
    description: "Wireless Keyboard was added to inventory.",
    time: "Today",
    status: "Completed",
  },
  {
    id: 2,
    title: "Stock updated",
    description: "Laptop inventory quantity was updated.",
    time: "Today",
    status: "Completed",
  },
  {
    id: 3,
    title: "Warehouse created",
    description: "Main Warehouse was added.",
    time: "Yesterday",
    status: "Completed",
  },
  {
    id: 4,
    title: "Low stock alert",
    description: "USB Cable has reached its minimum stock level.",
    time: "Yesterday",
    status: "Pending",
  },
];

const topProducts = [
  {
    id: 1,
    name: "Wireless Keyboard",
    sku: "PRD-001",
    category: "Electronics",
    quantity: 120,
  },
  {
    id: 2,
    name: "USB Cable",
    sku: "PRD-002",
    category: "Accessories",
    quantity: 18,
  },
  {
    id: 3,
    name: "Office Chair",
    sku: "PRD-003",
    category: "Furniture",
    quantity: 45,
  },
  {
    id: 4,
    name: "Laptop Stand",
    sku: "PRD-004",
    category: "Accessories",
    quantity: 8,
  },
];

export default function DashboardPage() {
  const { profile } = useAuth();

  const displayName =
    profile?.displayName ||
    profile?.name ||
    "there";

  const stockSummary = useMemo(() => {
    return topProducts.reduce(
      (summary, product) => {
        summary.total += product.quantity;

        if (product.quantity <= 20) {
          summary.lowStock += 1;
        }

        return summary;
      },
      { total: 0, lowStock: 0 }
    );
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <DashboardLayout>
        <div className="space-y-8">

          {/* Page Heading */}
          <PageHeader
            eyebrow="Overview"
            title={`Welcome back, ${displayName}`}
            description="Here's what's happening with your warehouse operations."
            action={
              <span className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                <Activity size={17} />
                System Overview
              </span>
            }
          />

          {/* Statistics */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Business Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                A quick summary of your inventory management system.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Products"
                value="248"
                icon={Package}
                description="Sample dashboard data"
              />

              <StatCard
                title="Total Warehouses"
                value="5"
                icon={Warehouse}
                description="Sample dashboard data"
              />

              <StatCard
                title="Categories"
                value="12"
                icon={Tags}
                description="Sample dashboard data"
              />

              <StatCard
                title="Staff Members"
                value="8"
                icon={Users}
                description="Sample dashboard data"
              />

            </div>
          </section>

          {/* Inventory Summary */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Inventory Summary
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Overview of current stock levels.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <StatCard
                title="Total Stock Units"
                value="1,840"
                icon={Boxes}
                description="Sample inventory data"
              />

              <StatCard
                title="Low Stock Products"
                value={stockSummary.lowStock}
                icon={AlertTriangle}
                description="Products at or below 20 units"
              />

              <StatCard
                title="Inventory Value"
                value="$24,850"
                icon={TrendingUp}
                description="Sample estimated value"
              />

            </div>
          </section>

          {/* Charts and Stock Summary */}
          <section className="grid gap-6 xl:grid-cols-3">

            {/* Inventory Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Inventory Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Sample monthly stock figures.
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  +12.5%
                </span>
              </div>

              <div className="flex h-64 items-end justify-between gap-3 border-b border-l border-slate-200 px-3 pb-2 dark:border-slate-700">
                {inventoryData.map((item) => {
                  const height = (item.stock / 800) * 100;

                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.stock}
                      </span>

                      <div
                        className="w-full max-w-12 rounded-t-lg bg-cyan-500 transition-all hover:bg-cyan-600"
                        style={{ height: `${height}%` }}
                        title={`${item.stock} units`}
                      />

                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Stock Status
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sample stock distribution.
              </p>

              <div className="mt-7 space-y-6">

                <StockProgress
                  label="In Stock"
                  percentage={70}
                  color="bg-emerald-500"
                  count="70%"
                />

                <StockProgress
                  label="Low Stock"
                  percentage={20}
                  color="bg-amber-500"
                  count="20%"
                />

                <StockProgress
                  label="Out of Stock"
                  percentage={10}
                  color="bg-red-500"
                  count="10%"
                />

              </div>

              <div className="mt-8 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 text-amber-600 dark:text-amber-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      Stock Attention
                    </p>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                      Review products with low stock levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Products and Activity */}
          <section className="grid gap-6 xl:grid-cols-2">

            {/* Products Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Products
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Sample inventory items.
                  </p>
                </div>

                <Package
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Stock</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {product.sku}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          {product.category}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`font-semibold ${
                              product.quantity <= 20
                                ? "text-red-600 dark:text-red-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Latest warehouse operations.
                  </p>
                </div>

                <ClipboardList
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400"
                />
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between gap-3 p-5"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 rounded-lg bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                        <Activity size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={
                        activity.status === "Completed"
                          ? "active"
                          : "pending"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function StockProgress({ label, percentage, color, count }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {count}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
