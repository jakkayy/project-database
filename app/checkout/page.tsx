"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CheckoutOrderSummary from "@/app/components/CheckoutOrderSummary";
import AddressSelector from "@/app/components/AddressSelector";
import { set } from "mongoose";

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

const mockAddresses = [
  {
    address_id: 1,
    firstname: "สมชาย",
    lastname: "ใจดี",
    addressLine: "123 ถนนสุขุมวิท",
    apartment: "อาคาร ABC ห้อง 501",
    city: "กรุงเทพมหานคร",
    province: "คลองเตย",
    postalCode: "10110",
    country: "Thailand",
    phone: "0812345678",
    isDefault: true,
  },
  {
    address_id: 2,
    firstname: "สมชาย",
    lastname: "ใจดี",
    addressLine: "456 ถนนพหลโยธิน",
    apartment: "",
    city: "กรุงเทพมหานคร",
    province: "พญาไท",
    postalCode: "10400",
    country: "Thailand",
    phone: "0812345678",
    isDefault: false,
  },
  {
    address_id: 3,
    firstname: "สมหญิง",
    lastname: "รักดี",
    addressLine: "789 ถนนรัชดาภิเษก",
    apartment: "คอนโด D ชั้น 12",
    city: "กรุงเทพมหานคร",
    province: "ดินแดง",
    postalCode: "10400",
    country: "Thailand",
    phone: "0898765432",
    isDefault: false,
  },
  {
    address_id: 4,
    firstname: "สมรัก",
    lastname: "รักดี",
    addressLine: "789 ถนนรัชดาภิเษก",
    apartment: "คอนโด D ชั้น 12",
    city: "กรุงเทพมหานคร",
    province: "ดินแดง",
    postalCode: "10400",
    country: "Thailand",
    phone: "0898765432",
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">(
    "ship"
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number>(
    mockAddresses.find(addr => addr.isDefault)?.address_id || mockAddresses[0]?.address_id
  );

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    // TODO: Open modal or navigate to add address page
    console.log("Add new address");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-neutral-800 px-10 py-4">
        <Link href="/">
          <Image src="/nike.svg" alt="Nike" width={60} height={24} className="invert" />
        </Link>
        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <span>001-800-65-6453</span>
          {/* Chat icon */}
          <button className="p-1 transition-colors hover:text-[#C9A84C]">
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
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </button>
          {/* Cart icon */}
          <Link href="/cart" className="p-1 transition-colors hover:text-[#C9A84C]">
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
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">CHECKOUT</p>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">การส่งมอบ</h1>

            {/* Address selection */}
            {deliveryMethod === "ship" && (
              <div className="mt-8">
                <AddressSelector
                  addresses={mockAddresses}
                  selectedAddressId={selectedAddressId}
                  onAddressSelect={handleAddressSelect}
                />
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="w-85 shrink-0">
            <div className="bg-neutral-900 p-6">
              <CheckoutOrderSummary
                subtotal="20,300.00"
                total="20,300.00"
                items={orderItems}
              />

              {/* Pay button */}
              <button className="mt-6 flex w-full items-center justify-center gap-2 bg-[#C9A84C] py-4 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90">
                ชำระเงิน
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Secure badge */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 text-neutral-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-600">SECURE SSL ENCRYPTED CHECKOUT SYSTEM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
