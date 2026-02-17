"use client";

import Image from "next/image";
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const statCards = [
  {
    title: "TOTAL ORDERS (TODAY)",
    value: "1,240",
    subtitle: "↑ 8.5% vs yesterday",
    subtitleColor: "text-green-500",
    borderColor: "border-l-blue-500",
  },
  {
    title: "PROCESSING",
    value: "342",
    subtitle: "Needs fulfillment",
    subtitleColor: "text-gray-400",
    borderColor: "border-l-orange-500",
  },
  {
    title: "SHIPPED",
    value: "856",
    subtitle: "Handed to carrier",
    subtitleColor: "text-gray-400",
    borderColor: "border-l-green-500",
  },
  {
    title: "RETURNS",
    value: "42",
    subtitle: "Requires attention",
    subtitleColor: "text-red-500",
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
    customerColor: "bg-purple-100 text-purple-600",
    items: ["/products/shoe1.svg"],
    extraItems: 1,
    total: "$240.00",
    status: "Processing",
    statusStyle: "text-orange-500 border-orange-200 bg-orange-50",
    statusIcon: "★",
  },
  {
    id: "#ORD-992816",
    date: "Oct 24, 09:30 AM",
    customerName: "Serena Williams",
    customerEmail: "sw@court.com",
    customerInitials: "SW",
    customerColor: "bg-green-100 text-green-600",
    items: ["/products/shoe2.svg"],
    extraItems: 0,
    total: "$85.00",
    status: "Shipped",
    statusStyle: "text-green-600 border-green-200 bg-green-50",
    statusIcon: "✓",
  },
  {
    id: "#ORD-992815",
    date: "Oct 23, 11:20 PM",
    customerName: "LeBron James",
    customerEmail: "king@la.com",
    customerInitials: "LJ",
    customerColor: "bg-blue-100 text-blue-600",
    items: ["/products/shoe3.svg"],
    extraItems: 0,
    total: "$115.00",
    status: "Delivered",
    statusStyle: "text-white border-gray-700 bg-gray-800",
    statusIcon: "",
  },
  {
    id: "#ORD-992814",
    date: "Oct 23, 08:15 PM",
    customerName: "Tiger Woods",
    customerEmail: "tiger@golf.com",
    customerInitials: "TW",
    customerColor: "bg-gray-100 text-gray-600",
    items: ["/products/shoe1.svg"],
    extraItems: 0,
    total: "$45.00",
    status: "Cancelled",
    statusStyle: "text-red-500 border-red-200 bg-red-50",
    statusIcon: "✕",
  },
];

export default function AdminOrderPage() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("Last 7 Days");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 px-8 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-black uppercase">
              Orders Management
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage and track customer fulfillment
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search Order ID, Name..."
                className="w-44 bg-transparent text-sm text-black placeholder-gray-400 outline-none"
              />
            </div>
            {/* Notification bell */}
            <button className="relative p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500" />
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl border border-gray-100 border-l-4 ${card.borderColor} bg-white p-5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {card.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-black">{card.value}</p>
              <p className={`mt-1 text-xs ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Filters + Export */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black outline-none"
            >
              <option>All Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            {/* Date filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black outline-none"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          {/* Export CSV */}
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50">
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
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Orders table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Order ID & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50"
                >
                  {/* Order ID & Date */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-black">
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-400">{order.date}</p>
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
                        <p className="text-sm font-medium text-black">
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
                    <div className="flex items-center gap-1">
                      {order.items.map((img, j) => (
                        <div
                          key={j}
                          className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100"
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
                        <span className="ml-1 text-xs text-gray-400">
                          +{order.extraItems}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 text-sm font-medium text-black">
                    {order.total}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-medium ${order.statusStyle}`}
                    >
                      {order.statusIcon && (
                        <span>{order.statusIcon}</span>
                      )}
                      {order.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <button className="text-sm text-gray-500 hover:text-black">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-400">
              Showing <span className="text-black">1</span> to{" "}
              <span className="text-black">4</span> of{" "}
              <span className="text-black">1,240</span> results
            </p>
            <div className="flex items-center gap-1">
              <button className="rounded-lg px-3 py-1 text-xs text-gray-400 hover:bg-gray-100">
                Prev
              </button>
              <button className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                1
              </button>
              <button className="rounded-lg px-3 py-1 text-xs text-gray-500 hover:bg-gray-100">
                2
              </button>
              <button className="rounded-lg px-3 py-1 text-xs text-gray-500 hover:bg-gray-100">
                3
              </button>
              <span className="px-1 text-xs text-gray-400">...</span>
              <button className="rounded-lg px-3 py-1 text-xs text-gray-500 hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
