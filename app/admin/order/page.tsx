"use client";

import Image from "next/image";
import { useState } from "react";
import AdminNav from "../../components/AdminNav";

const statCards = [
  {
    title: "TOTAL ORDERS (TODAY)",
    value: "1,240",
    subtitle: "↑ 8.5% vs yesterday",
    subtitleColor: "text-emerald-400",
    borderColor: "border-l-blue-500",
  },
  {
    title: "PROCESSING",
    value: "342",
    subtitle: "Needs fulfillment",
    subtitleColor: "text-gray-500",
    borderColor: "border-l-amber-500",
  },
  {
    title: "SHIPPED",
    value: "856",
    subtitle: "Handed to carrier",
    subtitleColor: "text-gray-500",
    borderColor: "border-l-emerald-500",
  },
  {
    title: "RETURNS",
    value: "42",
    subtitle: "Requires attention",
    subtitleColor: "text-red-400",
    borderColor: "border-l-red-500",
  },
];

const orders = [
  {
    id: "#ORD-992817",
    date: "Oct 24, 10:45 AM",
    customerName: "Michael Jordan",
    customerEmail: "mj@chicago.com",
    customerInitials: "MJ",
    customerColor: "bg-purple-900/60 text-purple-400",
    items: ["/products/shoe1.svg"],
    extraItems: 1,
    total: "$240.00",
    status: "Processing",
    statusStyle: "text-amber-400 border-amber-800/50 bg-amber-900/30",
  },
  {
    id: "#ORD-992816",
    date: "Oct 24, 09:30 AM",
    customerName: "Serena Williams",
    customerEmail: "sw@court.com",
    customerInitials: "SW",
    customerColor: "bg-emerald-900/60 text-emerald-400",
    items: ["/products/shoe2.svg"],
    extraItems: 0,
    total: "$85.00",
    status: "Shipped",
    statusStyle: "text-emerald-400 border-emerald-800/50 bg-emerald-900/30",
  },
  {
    id: "#ORD-992815",
    date: "Oct 23, 11:20 PM",
    customerName: "LeBron James",
    customerEmail: "king@la.com",
    customerInitials: "LJ",
    customerColor: "bg-blue-900/60 text-blue-400",
    items: ["/products/shoe3.svg"],
    extraItems: 0,
    total: "$115.00",
    status: "Delivered",
    statusStyle: "text-gray-400 border-gray-700 bg-gray-800/60",
  },
  {
    id: "#ORD-992814",
    date: "Oct 23, 08:15 PM",
    customerName: "Tiger Woods",
    customerEmail: "tiger@golf.com",
    customerInitials: "TW",
    customerColor: "bg-gray-700/60 text-gray-400",
    items: ["/products/shoe4.svg"],
    extraItems: 0,
    total: "$45.00",
    status: "Cancelled",
    statusStyle: "text-red-400 border-red-800/50 bg-red-900/30",
  },
];

export default function AdminOrderPage() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("Last 7 Days");

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Title */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-white">
              Orders Management
            </h1>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl border border-gray-800 border-l-4 ${card.borderColor} bg-[#161920] p-5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.title}
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {card.value}
              </p>
              <p className={`mt-1.5 text-xs font-medium ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-[#161920] px-3 py-2 text-sm text-gray-300 outline-none transition-colors hover:border-gray-600"
          >
            <option>All Status</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-[#161920] px-3 py-2 text-sm text-gray-300 outline-none transition-colors hover:border-gray-600"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>

        {/* Orders table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-800 bg-[#161920]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Order ID &amp; Date
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
              {orders.map((order, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-800/60 transition-colors hover:bg-white/[0.02]"
                >
                  {/* Order ID & Date */}
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm font-semibold text-white">
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${order.customerColor}`}
                      >
                        {order.customerInitials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {order.items.map((img, j) => (
                        <div
                          key={j}
                          className="h-10 w-10 overflow-hidden rounded-lg bg-gray-800"
                        >
                          <Image
                            src={img}
                            alt="item"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {order.extraItems > 0 && (
                        <span className="text-xs text-gray-500">
                          +{order.extraItems}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 text-sm font-semibold text-amber-400">
                    {order.total}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${order.statusStyle}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium text-white">1</span> to{" "}
              <span className="font-medium text-white">4</span> of{" "}
              <span className="font-medium text-white">1,240</span> results
            </p>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-500 transition-colors hover:border-gray-600 hover:text-white">
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
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-gray-900">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                3
              </button>
              <span className="px-1 text-xs text-gray-600">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-500 transition-colors hover:border-gray-600 hover:text-white">
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
