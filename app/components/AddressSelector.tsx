"use client";

import { useState } from "react";

interface Address {
  address_id: number;
  firstname: string;
  lastname: string;
  addressLine: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId?: number;
  onAddressSelect: (addressId: number) => void;
  onAddNewAddress: () => void;
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
}: AddressSelectorProps) {
  const [showAll, setShowAll] = useState(true);

  const displayAddresses = showAll ? addresses : addresses.slice(0, 3);

  const formatAddress = (address: Address) => {
    const parts = [
      `${address.firstname} ${address.lastname}`,
      address.addressLine,
    ];
    
    if (address.apartment) {
      parts.push(address.apartment);
    }
    
    parts.push(
      `${address.city} ${address.province} ${address.postalCode}`,
      address.country,
      address.phone
    );
    
    return parts.filter(Boolean).join(", ");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-black">เลือกที่อยู่</h2>
        {addresses.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-gray-500 hover:text-black transition-colors"
          >
            {showAll ? "แสดงน้อยลง" : `แสดงทั้งหมด (${addresses.length})`}
          </button>
        )}
      </div>

      {/* Address list */}
      <div className="space-y-3">
        {displayAddresses.map((address) => (
          <div
            key={address.address_id}
            onClick={() => onAddressSelect(address.address_id)}
            className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
              selectedAddressId === address.address_id
                ? "border-black bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {/* Radio button */}
            <div className="absolute left-4 top-4">
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  selectedAddressId === address.address_id
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                {selectedAddressId === address.address_id && (
                  <div className="h-2 w-2 rounded-full bg-black mt-0.5 ml-0.5" />
                )}
              </div>
            </div>

            {/* Address content */}
            <div className="ml-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">
                    {address.firstname} {address.lastname}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatAddress(address)}
                  </p>
                </div>
                {address.isDefault && (
                  <span className="ml-4 px-2 py-1 text-xs bg-black text-white rounded">
                    ค่าเริ่มต้น
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add new address button */}
        <button
          onClick={onAddNewAddress}
          className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:border-black hover:text-black transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          เพิ่มที่อยู่ใหม่
        </button>
      </div>
    </div>
  );
}
