"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "DASHBOARD", href: "/admin/dashboard" },
  { label: "PRODUCTS", href: "/admin/product" },
  { label: "ORDERS", href: "/admin/order" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-800 bg-[#0d0f14]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-400">
              <svg width="16" height="16" viewBox="0 0 30 30" fill="none">
                <path
                  d="M5 25C8 18 14 8 25 5C20 10 12 16 5 25Z"
                  fill="#0d0f14"
                />
              </svg>
            </div>
            <span className="text-lg font-black tracking-widest text-white">
              NIKO
            </span>
          </div>

          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && item.href !== "#";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive
                      ? "text-amber-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-amber-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
