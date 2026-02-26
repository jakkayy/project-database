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
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
}: AddressSelectorProps) {
  const [showAll, setShowAll] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const displayAddresses = showAll ? addresses : addresses.slice(0, 3);

  const formatAddress = (address: Address) => {
    const parts = [`${address.firstname} ${address.lastname}`, address.addressLine];
    if (address.apartment) parts.push(address.apartment);
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
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">เลือกที่อยู่</h2>
        {addresses.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-[#C9A84C]"
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
            className={`relative cursor-pointer border p-4 transition-all ${
              selectedAddressId === address.address_id
                ? "border-[#C9A84C] bg-neutral-800"
                : "border-neutral-700 hover:border-neutral-500"
            }`}
          >
            {/* Radio button */}
            <div className="absolute left-4 top-4">
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  selectedAddressId === address.address_id
                    ? "border-[#C9A84C]"
                    : "border-neutral-600"
                }`}
              >
                {selectedAddressId === address.address_id && (
                  <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-[#C9A84C]" />
                )}
              </div>
            </div>

            {/* Address content */}
            <div className="ml-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase tracking-wide text-white">
                    {address.firstname} {address.lastname}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatAddress(address)}
                  </p>
                </div>
                {address.isDefault && (
                  <span className="ml-4 bg-[#C9A84C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    ค่าเริ่มต้น
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add new address button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 border border-dashed border-neutral-700 p-4 text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          เพิ่มที่อยู่ใหม่
        </button>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-xl bg-neutral-900 p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-neutral-500 transition-colors hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-white">เพิ่มที่อยู่</h2>

            <form className="space-y-4">
              {/* Row 1: ชื่อ + นามสกุล */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ชื่อ*"
                  className="border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
                />
                <input
                  type="text"
                  placeholder="นามสกุล*"
                  className="border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
                />
              </div>

              {/* Row 2: ที่อยู่ */}
              <input
                type="text"
                placeholder="ที่อยู่*"
                className="w-full border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
              />

              {/* Row 3: อพาร์ทเมนต์ */}
              <input
                type="text"
                placeholder="อพาร์ทเมนต์, ห้องชุด, อาคาร"
                className="w-full border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
              />

              {/* Row 4: เมือง + รหัสไปรษณีย์ */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="เมือง*"
                  className="border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
                />
                <input
                  type="text"
                  placeholder="รหัสไปรษณีย์*"
                  className="border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
                />
              </div>

              {/* Row 5: จังหวัด + ประเทศ */}
              <div className="grid grid-cols-2 gap-4">
                <select className="border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-neutral-400 outline-none transition-colors focus:border-[#C9A84C]">
                  <option value="">จังหวัด*</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="ชลบุรี">ชลบุรี</option>
                  <option value="นนทบุรี">นนทบุรี</option>
                  <option value="ปทุมธานี">ปทุมธานี</option>
                  <option value="สมุทรปราการ">สมุทรปราการ</option>
                  <option value="ภูเก็ต">ภูเก็ต</option>
                  <option value="เชียงราย">เชียงราย</option>
                  <option value="ขอนแก่น">ขอนแก่น</option>
                  <option value="นครราชสีมา">นครราชสีมา</option>
                </select>
                <select
                  defaultValue="ไทย"
                  className="border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#C9A84C]"
                >
                  <option value="">ประเทศ/ภูมิภาค*</option>
                  <option value="ไทย">ไทย</option>
                </select>
              </div>

              {/* Row 6: หมายเลขโทรศัพท์ */}
              <input
                type="tel"
                placeholder="หมายเลขโทรศัพท์*"
                className="w-full border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#C9A84C]"
              />

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm text-neutral-400">
                <input type="checkbox" className="h-4 w-4 border-neutral-600 bg-neutral-800 accent-[#C9A84C]" />
                ตั้งเป็นที่อยู่จัดส่งหลัก
              </label>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-[#C9A84C] px-8 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
