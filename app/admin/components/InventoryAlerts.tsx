"use client";

import { useState } from "react";

interface AlertItem {
  name: string;
  color: string;
  size: string;
  stock: number;
  badge: string;
  badgeStyle: string;
}

const PREVIEW_COUNT = 3;

export default function InventoryAlerts({ alerts }: { alerts: AlertItem[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? alerts : alerts.slice(0, PREVIEW_COUNT);
  const hasMore = alerts.length > PREVIEW_COUNT;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-white">
        Inventory Alerts
      </h2>

      <div className="mt-4 space-y-3">
        {alerts.length === 0 ? (
          <p className="text-xs text-neutral-500">ไม่มีสินค้าที่ต้องแจ้งเตือน</p>
        ) : (
          displayed.map((alert, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">
                  {alert.name}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {alert.color} / {alert.size} — Stock: {alert.stock}
                </p>
              </div>
              <span
                className={`ml-2 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${alert.badgeStyle}`}
              >
                {alert.badge}
              </span>
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 border border-neutral-700 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
        >
          {showAll ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
              ซ่อนรายการทั้งหมด
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              ดูทั้งหมด ({alerts.length} รายการ)
            </>
          )}
        </button>
      )}
    </div>
  );
}
