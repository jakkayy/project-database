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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
        Inventory Alerts
      </h2>

      <div className="mt-4 space-y-3">
        {alerts.length === 0 ? (
          <p className="text-xs text-gray-400">No inventory alerts</p>
        ) : (
          displayed.map((alert, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-900">
                  {alert.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
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
          className="mt-4 flex w-full items-center justify-center gap-1.5 border border-gray-200 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:border-green-500 hover:text-green-600"
        >
          {showAll ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
              Hide All
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              View All ({alerts.length} items)
            </>
          )}
        </button>
      )}
    </div>
  );
}
