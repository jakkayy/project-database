import Image from "next/image";

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

interface CheckoutOrderSummaryProps {
  subtotal: number;
  total: number;
  items: any[];
  selectedAddress?: Address; 
  currentBalance: number;
}

export default function CheckoutOrderSummary({
  subtotal,
  total,
  items,
  selectedAddress,
  currentBalance,
}: CheckoutOrderSummaryProps) {
  const afterBalance = currentBalance - total
  
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-white text-xl">PAYMENT SUMMARY</h2>

      {selectedAddress && (
        <div className="p-3 border border-neutral-800 bg-neutral-950 rounded text-[11px] text-neutral-400">
          <p className="font-bold text-[#C9A84C] mb-1">จัดส่งไปที่:</p>
          <p>{selectedAddress.firstname} {selectedAddress.lastname}</p>
          <p className="line-clamp-1">{selectedAddress.addressLine}</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">
            CURRENT BALANCE
          </span>
          <span className="text-white font-bold text-sm">{Number(currentBalance).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">
            TOTAL COST
          </span>
          <span className="text-red-400 font-bold text-sm">- {Number(total).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="mt-1 h-0.5 w-full bg-neutral-700">
          <div className="h-full w-full bg-[#C9A84C]" />
        </div>
      </div>

      <div className="my-4 border-t border-neutral-800" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-white">
          NEW BALANCE
        </span>
        <span
          className={`text-xl font-black ${
            afterBalance >= 0 ? "text-[#C9A84C]" : "text-red-400"
          }`}
        >
          {Number(afterBalance).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      </div>

      <div className="mt-4 border-t border-neutral-800 pt-4"/>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 hover:border-neutral-600 transition-colors">
            {/* Image — white bg like ProductCard */}
            <div className="h-28 w-28 shrink-0 overflow-hidden bg-white">
              <Image src={item.product?.images?.[0]} alt={item.product?.name} width={112} height={112} className="h-full w-full object-cover" />
            </div>
            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white leading-tight">{item.product?.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                  {item.product?.category}{item.color ? ` · ${item.color}` : ""}{item.size ? ` · SIZE ${item.size}` : ""}
                </p>
                <p className="mt-1 text-[11px] text-neutral-600">จำนวน {item.quantity}</p>
              </div>
              <p className="mt-2 text-sm font-black text-[#C9A84C]">
                {Number(item.price * item.quantity).toLocaleString("th-TH", { style: "currency", currency: "THB" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}