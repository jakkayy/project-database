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
      <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">PAYMENT SUMMARY</h2>

      {selectedAddress && (
        <div className="p-3 border border-gray-200 bg-gray-50 rounded-xl text-[11px] text-gray-500">
          <p className="font-bold text-green-600 mb-1">Ship to:</p>
          <p>{selectedAddress.firstname} {selectedAddress.lastname}</p>
          <p className="line-clamp-1">{selectedAddress.addressLine}</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-gray-500">
            CURRENT BALANCE
          </span>
          <span className="text-gray-900 font-bold text-sm">{Number(currentBalance).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-gray-500">
            TOTAL COST
          </span>
          <span className="text-red-400 font-bold text-sm">- {Number(total).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="mt-1 h-0.5 w-full bg-gray-200">
          <div className="h-full w-full bg-green-500" />
        </div>
      </div>

      <div className="my-4 border-t border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-gray-900">
          NEW BALANCE
        </span>
        <span
          className={`text-xl font-black ${
            afterBalance >= 0 ? "text-green-600" : "text-red-400"
          }`}
        >
          {Number(afterBalance).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4"/>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-colors">
            {/* Image */}
            <div className="h-28 w-28 shrink-0 overflow-hidden bg-gray-100">
              <Image src={item.product?.images?.[0]} alt={item.product?.name} width={112} height={112} className="h-full w-full object-cover" />
            </div>
            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-gray-900 leading-tight">{item.product?.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {item.product?.category}{item.color ? ` · ${item.color}` : ""}{item.size ? ` · SIZE ${item.size}` : ""}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="mt-2 text-sm font-black text-green-600">
                {Number(item.price * item.quantity).toLocaleString("th-TH", { style: "currency", currency: "THB" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}