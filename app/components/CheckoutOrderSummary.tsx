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
  subtotal: string;
  total: string;
  items: any[];
  selectedAddress?: Address; 
}

export default function CheckoutOrderSummary({
  subtotal,
  total,
  items,
  selectedAddress,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-white">ORDER SUMMARY</h2>

      {/* สรุปที่อยู่ (Optional - ถ้าอยากแสดง) */}
      {selectedAddress && (
        <div className="p-3 border border-neutral-800 bg-neutral-950 rounded text-[11px] text-neutral-400">
          <p className="font-bold text-[#C9A84C] mb-1">จัดส่งไปที่:</p>
          <p>{selectedAddress.firstname} {selectedAddress.lastname}</p>
          <p className="line-clamp-1">{selectedAddress.addressLine}</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">SUBTOTAL</span>
          <span className="text-white">{subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">SHIPPING</span>
          <span className="font-semibold text-[#C9A84C]">FREE</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="mt-1 h-0.5 w-full bg-neutral-700">
          <div className="h-full w-full bg-[#C9A84C]" />
        </div>
      </div>

      <div className="my-4 border-t border-neutral-800" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-white">TOTAL</span>
        <span className="text-xl font-black text-[#C9A84C]">{total}</span>
      </div>

      <div className="mt-4 border-t border-neutral-800 pt-4"/>

      <div className="mt-4 space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 shrink-0 overflow-hidden bg-neutral-800">
              <Image src={item.product?.images?.[0]} alt={item.product?.name} width={100} height={100} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-bold uppercase tracking-wide text-white leading-tight">{item.product?.name}</p>
              <p className="mt-0.5 uppercase tracking-wider text-neutral-500">{item.product?.description}</p>
              <p className="text-neutral-500 uppercase">{item.product?.category}{item.color ? ` / ${item.color}` : ""}{item.size ? ` / SIZE ${item.size}` : ""}</p>
              <p className="text-neutral-500">จำนวน: {item.quantity}</p>
              <p className="mt-3 font-bold text-[#C9A84C]">{Number(item.price * item.quantity).toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}