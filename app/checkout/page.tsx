"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CheckoutOrderSummary from "@/app/components/CheckoutOrderSummary";
import AddressSelector from "@/app/components/AddressSelector";

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

            {/* Address selection */}
            {deliveryMethod === "ship" && (
              <div className="mt-8">
                <AddressSelector
                  addresses={mockAddresses}
                  selectedAddressId={selectedAddressId}
                  onAddressSelect={handleAddressSelect}
                  onAddNewAddress={handleAddNewAddress}
                />
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="w-85 shrink-0">
            <CheckoutOrderSummary
              subtotal="20,300.00"
              total="20,300.00"
              items={orderItems}
            />
            
            {/* Pay button */}
            <button className="mt-6 w-full rounded-lg bg-black px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
