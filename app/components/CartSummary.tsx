"use client";

interface CartSummaryProps {
  total: string;
  items?: any[];
  selectedCount?: number;
  onCheckout?: () => void;
}

export default function CartSummary({ total, items, selectedCount = 0, onCheckout }: CartSummaryProps) {
  return (
    <div className="sticky top-24 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-700">
        Order Summary
      </h2>

      <div className="my-5 border-t border-gray-100" />

      <div className="space-y-3">
        {/* Product Details */}
        {items && items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <p className="text-xs text-gray-500">
                  {item.product?.name || item.name}{" "}
                  <span className="font-medium text-green-600 ml-1">x{item.quantity}</span>
                </p>
                <p className="font-medium text-gray-700">
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
          <span className="text-xs text-gray-500">Shipping</span>
          <span className="text-xs font-medium text-green-600">FREE</span>
        </div>
      </div>

      {/* Total */}
      <div className="my-5 border-t border-gray-100" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Total</span>
        <span className="text-xl font-bold text-green-600">{total}</span>
      </div>

      {/* Checkout button */}
      <button
        onClick={onCheckout}
        disabled={selectedCount === 0}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors ${
          selectedCount > 0
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {selectedCount === 0 ? "Select items first" : `Checkout (${selectedCount})`}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
