"use client";

import Image from "next/image";
import AdminNav from "../../components/AdminNav";

const statCards = [
  {
    title: "TODAY'S SALES",
    value: "$2.4M",
    subtitle: "↑ 12% from yesterday",
    subtitleColor: "text-emerald-400",
    borderColor: "border-l-emerald-500",
  },
  {
    title: "PENDING ORDERS",
    value: "1,240",
    subtitle: "Needs fulfillment",
    subtitleColor: "text-gray-500",
    borderColor: "border-l-amber-500",
  },
  {
    title: "ACTIVE MEMBERS",
    value: "45k",
    subtitle: "↑ 300 new today",
    subtitleColor: "text-emerald-400",
    borderColor: "border-l-blue-500",
  },
  {
    title: "LIVE SNKRS DROP",
    value: "250k",
    subtitle: "● Entries open",
    subtitleColor: "text-amber-400",
    borderColor: "border-l-orange-500",
  },
];

const recentOrders = [
  {
    initials: "AS",
    avatarColor: "bg-purple-900/60 text-purple-400",
    name: "Amy Smith",
    order: "Order #20001",
    status: "Shipped",
    statusStyle: "text-emerald-400 border-emerald-800/50 bg-emerald-900/30",
  },
  {
    initials: "KO",
    avatarColor: "bg-blue-900/60 text-blue-400",
    name: "Ken Oren",
    order: "Order #20002",
    status: "Processing",
    statusStyle: "text-amber-400 border-amber-800/50 bg-amber-900/30",
  },
  {
    initials: "MJ",
    avatarColor: "bg-red-900/60 text-red-400",
    name: "Michael Jordan",
    order: "Order #20003",
    status: "Delivered",
    statusStyle: "text-gray-400 border-gray-700 bg-gray-800/60",
  },
  {
    initials: "SW",
    avatarColor: "bg-green-900/60 text-green-400",
    name: "Serena Williams",
    order: "Order #20004",
    status: "Cancelled",
    statusStyle: "text-red-400 border-red-800/50 bg-red-900/30",
  },
];

const chartBars = [
  { day: "Mon", height: 55, value: "$1.2M" },
  { day: "Tue", height: 75, value: "$1.8M" },
  { day: "Wed", height: 60, value: "$1.4M" },
  { day: "Thu", height: 90, value: "$2.1M" },
  { day: "Fri", height: 100, value: "$2.4M" },
  { day: "Sat", height: 70, value: "$1.6M" },
  { day: "Sun", height: 45, value: "$1.0M" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <AdminNav />

      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
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

        {/* Quick stats row */}
        <div className="mt-6 grid grid-cols-3 gap-5">
          {/* Top Products */}
          <div className="col-span-2 rounded-xl border border-gray-800 bg-[#161920] p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Top Selling Products
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { name: "Apex Carbon Runner", sku: "SKU-88291", sold: 312, pct: 85 },
                { name: "Velocity Aero-Socks", sku: "SKU-99481", sold: 210, pct: 57 },
                { name: "Stealth Comp Tech-Tee", sku: "SKU-77302", sold: 148, pct: 40 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-800">
                    <Image
                      src={`/products/shoe${i + 1}.svg`}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">
                        {item.name}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        {item.sold} sold
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-800">
                      <div
                        className="h-1.5 rounded-full bg-amber-400"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="rounded-xl border border-gray-800 bg-[#161920] p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Inventory Alerts
            </h2>
            <div className="mt-4 space-y-3">
              {[
                {
                  name: "Stealth Comp Tech-Tee",
                  stock: 12,
                  badge: "LOW STOCK",
                  badgeStyle: "text-amber-400 bg-amber-900/30 border-amber-800/50",
                },
                {
                  name: "Titanium Chronos v2",
                  stock: 0,
                  badge: "OUT OF STOCK",
                  badgeStyle: "text-red-400 bg-red-900/30 border-red-800/50",
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/40 p-3"
                >
                  <div>
                    <p className="text-xs font-medium text-white">
                      {alert.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Stock: {alert.stock}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${alert.badgeStyle}`}
                  >
                    {alert.badge}
                  </span>
                </div>
              ))}
              <button className="w-full rounded-lg border border-gray-700 py-2 text-xs font-medium text-gray-400 transition-colors hover:border-gray-600 hover:text-white">
                View Inventory →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
