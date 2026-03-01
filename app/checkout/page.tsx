"use client";
import { useState, useEffect } from "react";
import AddressSelector from "@/app/components/AddressSelector";
import CheckoutOrderSummary from "@/app/components/CheckoutOrderSummary";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const fetchAddresses = async () => {
    const res = await fetch("/api/address");
    const data = await res.json();
    setAddresses(data);
  };

  useEffect(() => { fetchAddresses(); }, []);

  const selectedAddress = addresses.find((a: any) => a.address_id === selectedId);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <AddressSelector 
            addresses={addresses} 
            selectedAddressId={selectedId}
            onAddressSelect={(id) => setSelectedId(id)}
            refreshAddresses={fetchAddresses}
          />
        </div>
        <div className="lg:col-span-5">
          <CheckoutOrderSummary 
            subtotal="20,300" total="20,300" items={[]} 
            selectedAddress={selectedAddress}
          />
          <button 
            disabled={!selectedId}
            className={`w-full py-4 mt-6 font-black uppercase text-xs tracking-widest transition-all ${selectedId ? "bg-[#C9A84C] text-black hover:opacity-90" : "bg-neutral-800 text-neutral-500 cursor-not-allowed"}`}
          >
            {selectedId ? "ชำระเงิน" : "กรุณาเลือกที่อยู่จัดส่ง"}
          </button>
        </div>
      </div>
    </div>
  );
}