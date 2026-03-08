"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AddressSelector from "@/app/components/AddressSelector";
import CheckoutOrderSummary from "@/app/components/CheckoutOrderSummary";
import ClientNavbar from "@/app/components/ClientNavbar";
import { toast } from "sonner";


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
  const searchParams = useSearchParams();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const fetchCheckout = async () => {
    try {
      const itemsParam = searchParams.get("items");
      const url = itemsParam ? `/api/checkout?items=${itemsParam}` : "/api/checkout";
      const res = await fetch(url);
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

      if (!res.ok) {
        if (data.code === "INSUFFICIENT_BALANCE") {
          toast.error("Insufficient balance", {
            description: "Please top up your balance before checking out",
          });
          return;
        }

        if (data.code === "INSUFFICIENT_STOCK") {
          toast.error("Out of stock", {
            description: (
              <>
                {data.product_name} / Size {data.size} / {data.color}
                <div>— only {data.in_stock} left</div>
              </>
            ),
          });
          return;
        }

        toast.error("Payment failed", {
          description: data.message || "Please try again",
        });
        return;
      }

      toast.success("Payment successful!", {
        description: "Your order has been placed",
      });
      setTimeout(() => {
        window.location.href = "/history";
      }, 800);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const afterBalance = currentBalance - total;
  const isReady = selectedId !== undefined && total !== 0 && afterBalance >= 0;

  return (
    <div className="min-h-screen bg-gray-50">

  <ClientNavbar />

  <div className="p-10">
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
          disabled={!isReady}
          className={`w-full py-4 mt-6 font-black uppercase text-xs tracking-widest rounded-xl transition-all ${
            isReady
              ? "bg-green-500 text-white hover:opacity-90"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {total === 0
            ? "No items in cart"
            : afterBalance < 0
            ? "Insufficient balance"
            : !selectedId
            ? "Select a delivery address"
            : "Confirm Payment"}
        </button>
      </div>
    </div>
  </div>

</div>
  );
}