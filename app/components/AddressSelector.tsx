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
      refreshAddresses(); // อัปเดตรายการจาก DB ทันที
      setFormData({ 
        firstname: "", lastname: "", addressLine: "", apartment: "",
        city: "", province: "", postalCode: "", country: "Thailand", phone: "", isDefault: false 
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, addressId: number) => {
    e.stopPropagation(); // กันไม่ให้ไปคลิกเลือกกล่องที่อยู่ตอนกดลบ
    if (confirm("ยืนยันการลบที่อยู่นี้?")) {
      const res = await fetch(`/api/address?addressId=${addressId}`, { method: "DELETE" });
      if (res.ok) refreshAddresses(); // อัปเดตรายการหลังลบสำเร็จ
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">เลือกที่อยู่</h2>
      <div className="grid gap-3">
        {addresses.map((addr) => (
          <div 
            key={addr.address_id}
            onClick={() => onAddressSelect(addr.address_id)}
            className={`relative cursor-pointer border p-4 transition-all ${selectedAddressId === addr.address_id ? "border-[#C9A84C] bg-neutral-800" : "border-neutral-700 hover:border-neutral-500"}`}
          >
            {/* ปุ่มลบ */}
            <button onClick={(e) => handleDelete(e, addr.address_id)} className="absolute right-4 top-4 text-neutral-500 hover:text-red-500 transition-colors z-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path d="m14.74 9-.34 6.613m-6.308 0L8.26 9m4.46-4.81h-4.453a1.125 1.125 0 0 0-1.125 1.125V6.75h7.5V6.265a1.125 1.125 0 0 0-1.125-1.125Z" /></svg>
            </button>
            <p className="text-sm font-bold text-white pr-8">{addr.firstname} {addr.lastname}</p>
            <p className="text-xs text-neutral-400 mt-1">{addr.addressLine}, {addr.city}, {addr.province} {addr.postalCode}</p>
          </div>
        ))}
        <button onClick={() => setShowModal(true)} className="w-full border border-dashed border-neutral-700 p-4 text-xs text-neutral-500 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">+ เพิ่มที่อยู่ใหม่</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-xl bg-neutral-900 p-8 border border-neutral-800">
            <h2 className="text-white font-black uppercase mb-6 tracking-widest">เพิ่มที่อยู่ใหม่</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="firstname" value={formData.firstname} onChange={handleChange} placeholder="ชื่อ*" required className="bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
                <input name="lastname" value={formData.lastname} onChange={handleChange} placeholder="นามสกุล*" required className="bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
              </div>
              <input name="addressLine" value={formData.addressLine} onChange={handleChange} placeholder="ที่อยู่*" required className="w-full bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={formData.city} onChange={handleChange} placeholder="เมือง*" required className="bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
                <input name="province" value={formData.province} onChange={handleChange} placeholder="จังหวัด*" required className="bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="รหัสไปรษณีย์*" required className="bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
                <input name="country" value={formData.country} onChange={handleChange} placeholder="ประเทศ*" required className="bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
              </div>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="เบอร์โทรศัพท์*" required className="w-full bg-neutral-800 border border-neutral-700 p-3 text-sm text-white focus:border-[#C9A84C] outline-none" />
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-neutral-500 text-xs uppercase hover:text-white">ยกเลิก</button>
                <button type="submit" className="bg-[#C9A84C] px-8 py-2.5 text-xs font-black text-black uppercase hover:opacity-90">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}