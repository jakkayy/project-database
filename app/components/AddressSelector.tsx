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
  refreshAddresses: () => void;
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  refreshAddresses,
}: AddressSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", addressLine: "", apartment: "",
    city: "", province: "", postalCode: "", country: "Thailand", phone: "", isDefault: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowModal(false);
      refreshAddresses();
      setFormData({ 
        firstname: "", lastname: "", addressLine: "", apartment: "",
        city: "", province: "", postalCode: "", country: "Thailand", phone: "", isDefault: false 
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, addressId: number) => {
    e.stopPropagation(); 
    if (confirm("Are you sure you want to remove this address?")) {
      const res = await fetch(`/api/address?addressId=${addressId}`, { method: "DELETE" });
      if (res.ok) refreshAddresses(); 
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Delivery Address</h2>
      <div className="grid gap-3">
        {addresses.map((addr) => (
          <div
            key={addr.address_id}
            onClick={() => onAddressSelect(addr.address_id)}
            className={`relative cursor-pointer rounded-xl border p-4 transition-all ${selectedAddressId === addr.address_id ? "border-green-500 bg-white shadow-sm" : "border-gray-200 bg-white hover:border-gray-400"}`}
          >
            {/* ปุ่มลบ */}
            <button
              onClick={(e) => handleDelete(e, addr.address_id)}
              className="absolute top-4 right-4 flex items-center gap-1 text-xs uppercase tracking-wider text-gray-400 transition-colors hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              REMOVE
            </button>
            <p className="text-sm font-bold text-gray-900 pr-8">{addr.firstname} {addr.lastname}</p>
            <p className="text-xs text-gray-500 mt-1">{addr.addressLine}, {addr.city}, {addr.province} {addr.postalCode}</p>
          </div>
        ))}
        <button onClick={() => setShowModal(true)} className="w-full border border-dashed border-gray-300 rounded-xl p-4 text-xs text-gray-400 hover:text-green-600 hover:border-green-500 transition-colors">+ Add new address</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
            <h2 className="text-gray-900 font-black uppercase mb-6 tracking-widest">Add New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name*" required className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
                <input name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name*" required className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
              </div>
              <input name="addressLine" value={formData.addressLine} onChange={handleChange} placeholder="Address*" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={formData.city} onChange={handleChange} placeholder="City*" required className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
                <input name="province" value={formData.province} onChange={handleChange} placeholder="Province*" required className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code*" required className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
                <input name="country" value={formData.country} onChange={handleChange} placeholder="Country*" required className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
              </div>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone*" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:border-green-500 outline-none" />
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 text-xs uppercase hover:text-gray-900">Cancel</button>
                <button type="submit" className="bg-green-500 rounded-lg px-8 py-2.5 text-xs font-black text-white uppercase hover:opacity-90">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}