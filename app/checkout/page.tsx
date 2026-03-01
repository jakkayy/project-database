"use client";
import { useState, useEffect } from "react";
import AddressSelector from "@/app/components/AddressSelector";
import CheckoutOrderSummary from "@/app/components/CheckoutOrderSummary";

type CheckoutItem = {
  product_id: {
    _id: string;
    name: string;
  };
  size: string;
  color: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const fetchCheckout = async () => {
    try {
      const res = await fetch("/api/checkout");
      const data = await res.json();

      setItems(data.items);
      setTotal(data.total);
      setCurrentBalance(data.balance);
    } catch (error) {
      console.error("Failed to fetch checkout:", error);
    }
  };

  const fetchAddresses = async () => {
    const res = await fetch("/api/address");
    const data = await res.json();
    setAddresses(data);
  };

  useEffect(() => {
    fetchAddresses();
    fetchCheckout();
  }, []);

  const selectedAddress = addresses.find((a: any) => a.address_id === selectedId);

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address_id: selectedId,
        }),
      });

      const data = await res.json();

      const outOfStockProduct = items.find(
        (item: any) =>
          String(item.product_id?._id ?? item.product_id) === String(data.product_id)
      );

      if (!res.ok) {
        if (data.code === "INSUFFICIENT_BALANCE") {
          alert("ยอดเงินไม่เพียงพอ");
          return;
        }

        if (data.code === "INSUFFICIENT_STOCK") {
          alert(`สินค้า ID ${outOfStockProduct?.product_id?.name ?? "ไม่ทราบชื่อ"} ขนาด ${data.size} สี ${data.color} สินค้าไม่เพียงพอ`);
          return;
        }

        alert(data.message || "Payment failed");
        return;
      }

      alert("Payment successful!");
      fetchCheckout();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

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
            subtotal={total} 
            total={total}
            items={items} 
            selectedAddress={selectedAddress}
            currentBalance={currentBalance}
          />
          <button 
            onClick={handlePayment}
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