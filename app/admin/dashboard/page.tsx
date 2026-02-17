"use client";

import Image from "next/image";
import AdminSidebar from "../../components/AdminSidebar";

const statCards = [
  {
    title: "Today's Sales",
    value: "$2.4M",
    subtitle: "↑ 12% from yesterday",
    subtitleColor: "text-green-500",
    bg: "bg-white",
    textColor: "text-black",
  },
  {
    title: "Pending Orders",
    value: "1,240",
    subtitle: "Needs fulfillment",
    subtitleColor: "text-gray-400",
    bg: "bg-white",
    textColor: "text-black",
  },
  {
    title: "Active Members",
    value: "45k",
    subtitle: "↑ 300 new today",
    subtitleColor: "text-green-500",
    bg: "bg-white",
    textColor: "text-black",
  },
  {
    title: "Live SNKRS Drop",
    value: "250k",
    subtitle: "● Entries",
    subtitleColor: "text-orange-400",
    bg: "bg-gradient-to-br from-gray-900 to-orange-900",
    textColor: "text-white",
  },
];

const recentOrders = [
  {
    name: "Amy Smith",
    order: "Order #20001",
    status: "Shipped",
    statusColor: "text-green-500 bg-green-50 border-green-200",
  },
  {
    name: "Ken Oren",
    order: "Order #20002",
    status: "Processing",
    statusColor: "text-orange-500 bg-orange-50 border-orange-200",
  },
];

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 px-8 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black">DASHBOARD OVERVIEW</h1>
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
                placeholder="Search orders, SKU..."
                className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-40"
              />
            </div>
            {/* Avatar */}
            <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300">
              <Image
                src="/nike.svg"
                alt="Admin"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-8 grid grid-cols-4 gap-5">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl ${card.bg} p-5 ${
                card.bg === "bg-white" ? "border border-gray-100" : ""
              }`}
            >
              <p
                className={`text-xs ${
                  card.textColor === "text-white"
                    ? "text-orange-300"
                    : "text-gray-400"
                }`}
              >
                {card.title}
              </p>
              <p className={`mt-2 text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
              <p className={`mt-1 text-xs ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-8 grid grid-cols-5 gap-5">
          {/* Weekly Sales Trend */}
          <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black">
                Weekly Sales Trend
              </h2>
              <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
                Last 7 Days
              </span>
            </div>
            {/* Chart placeholder */}
            <div className="mt-6 flex h-48 items-center justify-center">
              <p className="text-sm text-gray-300">
                {"{"}Chart Graphic Area - Add SVG here in Figma{"}"}
              </p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">Recent Orders</h2>
            <div className="mt-4 space-y-4">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div>
                      <p className="text-sm font-medium text-black">
                        {order.name}
                      </p>
                      <p className="text-xs text-gray-400">{order.order}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-0.5 text-xs font-medium ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
