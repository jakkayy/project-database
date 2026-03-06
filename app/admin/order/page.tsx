"use client";

import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";
import { getAdminOrders } from "lib/apiServices/admin.service";

const statCardConfigs = [
  {
    title: "TOTAL ORDERS",
    key: "total" as const,
    subtitle: "All orders",
    subtitleColor: "text-neutral-500",
    borderColor: "border-l-blue-500",
  },
  {
    title: "PROCESSING",
    key: "pending" as const,
    subtitle: "Needs fulfillment",
    subtitleColor: "text-neutral-500",
    borderColor: "border-l-amber-500",
  },
  {
    title: "COMPLETED",
    key: "completed" as const,
    subtitle: "Successfully fulfilled",
    subtitleColor: "text-neutral-500",
    borderColor: "border-l-emerald-500",
  },
];

const avatarColors = [
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-blue-100 text-blue-600",
  "bg-yellow-100 text-yellow-700",
  "bg-rose-100 text-rose-600",
  "bg-cyan-100 text-cyan-600",
];

const statusStyleMap: Record<string, string> = {
  PENDING: "text-yellow-700 border-yellow-200 bg-yellow-50",
  COMPLETED: "text-green-700 border-green-200 bg-green-50",
  FAILED: "text-red-600 border-red-200 bg-red-50",
};

const statusLabelMap: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

type Order = {
  order_id: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: string;
};

export default function AdminOrderPage() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("Last 7 Days");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrders()
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "All Status" && statusLabelMap[order.status] !== statusFilter)
      return false;
    return true;
  });

  const statCounts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Title */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-gray-900">
              Orders Management
            </h1>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-5">
          {statCardConfigs.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl border border-gray-200 border-l-4 ${card.borderColor} bg-white shadow-sm p-5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.title}
              </p>
              <p className="mt-3 text-3xl font-black text-gray-900">
                {statCounts[card.key]}
              </p>
              <p className={`mt-1.5 text-xs font-medium ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => {
                  const initials = order.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const avatarColor = avatarColors[i % avatarColors.length];
                  const date = new Date(order.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.order_id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      {/* Order ID & Date */}
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          #{String(order.order_id).padStart(6, "0")}
                        </p>
                        <p className="text-xs text-gray-400">{date}</p>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ฿{order.total.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${statusStyleMap[order.status] ?? "text-gray-500 border-gray-200 bg-gray-50"}`}
                        >
                          {statusLabelMap[order.status] ?? order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">{filteredOrders.length}</span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">{orders.length}</span> results
            </p>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-xs font-bold text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
