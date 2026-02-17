"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CheckoutOrderSummary from "@/app/components/CheckoutOrderSummary";

const orderItems = [
  {
    image: "/products/shoe1.svg",
    name: "Nike Mercurial Vapor 16 Academy",
    description: "รองเท้าฟุตบอลไม่มีข้อสำหรับสนามในร่ม/คอร์ท",
    qty: 1,
    size: "M 9 / W 10.5",
    price: "3,300",
  },
  {
    image: "/products/shoe2.svg",
    name: "Nike Tiempo Maestro Elite LE",
    description: "รองเท้าสตั๊ดฟุตบอลไม่มีข้อสำหรับพื้นสนามทั่วไป",
    qty: 1,
    size: "M 8 / W 9.5",
    price: "8,700",
  },
  {
    image: "/products/shoe3.svg",
    name: "Nike Tiempo Maestro Elite",
    description: "รองเท้าสตั๊ดฟุตบอลไม่มีข้อสำหรับพื้นสนามหญ้าเทียม",
    qty: 1,
    size: "M 7 / W 8.5",
    price: "8,300",
  },
];

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">(
    "ship"
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-gray-200 px-10 py-4">
        <Link href="/">
          <Image src="/nike.svg" alt="Nike" width={60} height={24} />
        </Link>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>001-800-65-6453</span>
          {/* Chat icon */}
          <button className="p-1">
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
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </button>
          {/* Cart icon */}
          <Link href="/cart" className="p-1">
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
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex gap-16">
          {/* Left: Shipping form */}
          <div className="flex-1 max-w-lg">
            <h1 className="text-2xl font-medium text-black">การส่งมอบ</h1>

            {/* Delivery method tabs */}
            <div className="mt-6 flex">
              <button
                onClick={() => setDeliveryMethod("ship")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-l-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  deliveryMethod === "ship"
                    ? "border-black bg-white text-black"
                    : "border-gray-300 bg-gray-50 text-gray-500"
                }`}
              >
                {/* Truck icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
                จัดส่งที่บ้าน
              </button>
              <button
                onClick={() => setDeliveryMethod("pickup")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-r-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  deliveryMethod === "pickup"
                    ? "border-black bg-white text-black"
                    : "border-gray-300 bg-gray-50 text-gray-500"
                }`}
              >
                {/* Location icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                รับที่ร้าน
              </button>
            </div>

            {/* Email */}
            <div className="mt-8">
              <label className="text-xs text-gray-500">อีเมล *</label>
              <div className="mt-1 flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3">
                <span className="text-sm text-black">
                  niti2042547@gmail.com
                </span>
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                เราจะส่งยืนยันคำสั่งซื้อเมื่อสั่งเสร็จแล้ว
              </p>
            </div>

            {/* Name & Address section */}
            <div className="mt-8">
              <h2 className="text-base font-medium text-black">
                ป้อนชื่อและที่อยู่:
              </h2>

              <div className="mt-4 space-y-4">
                {/* First name */}
                <div>
                  <input
                    type="text"
                    placeholder="ชื่อ *"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black"
                  />
                </div>

                {/* Last name */}
                <div>
                  <input
                    type="text"
                    placeholder="นามสกุล *"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black"
                  />
                </div>

                {/* Address search */}
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
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
                  </div>
                  <input
                    type="text"
                    placeholder="เริ่มพิมพ์ที่อยู่หรือรหัสไปรษณีย์ *"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-black placeholder-gray-400 outline-none focus:border-black"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  เราไม่ขอจัดส่งไปที่ตู้ ปณ. ฯลฯ.
                </p>
              </div>
            </div>

            {/* Manual address */}
            <div className="mt-6">
              <h2 className="text-base font-medium text-black">
                ป้อนที่อยู่ด้วยตัวเอง
              </h2>

              <div className="mt-4 space-y-4">
                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="หมายเลขโทรศัพท์ *"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  ผู้ให้บริการจัดส่งสินค้าจะการติดต่อคุณเมื่อถึงเวลาในการส่งมอบ
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="w-85 shrink-0">
            <CheckoutOrderSummary
              subtotal="20,300.00"
              total="20,300.00"
              items={orderItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
