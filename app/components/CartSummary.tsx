"use client";

interface CartSummaryProps {
  total: string;
  items?: any[];
  selectedCount?: number;
  onCheckout?: () => void;
}

export default function CartSummary({ total, items, selectedCount = 0, onCheckout }: CartSummaryProps) {
  return (
    <div className="sticky top-24 rounded-none bg-neutral-900 p-6">
      <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-white">
        ORDER SUMMARY
      </h2>

      <div className="my-5 border-t border-neutral-800" />

      <div className="space-y-3">
        {/* Product Details */}
        {items && items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <p className="text-xs uppercase tracking-wider text-neutral-400">
                  {item.product?.name || item.name}{" "}
                  <span className="normal-case font-normal text-[#C9A84C] ml-1">x{item.quantity}</span>
                </p>

                <p className="text-[#C9A84C]">
                  {Number((item.product?.basePrice || item.price) * item.quantity).toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400">SHIPPING</span>
          <span className="text-xs text-[#C9A84C]">FREE</span>
        </div>
      </div>

      {/* Total */}
      <div className="my-5 border-t border-neutral-800" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-white">TOTAL</span>
        <span className="text-xl font-black text-[#C9A84C]">{total}</span>
      </div>

      {/* Checkout button */}
      <button
        onClick={onCheckout}
        disabled={selectedCount === 0}
        className={`mt-6 flex w-full items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-opacity ${
          selectedCount > 0
            ? "bg-[#C9A84C] text-black hover:opacity-90"
            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
        }`}
      >
        {selectedCount === 0 ? "เลือกสินค้าก่อน" : `CHECKOUT (${selectedCount})`}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      
    </div>
  );
}
