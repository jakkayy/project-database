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

interface OrderItem {
  image: string;
  name: string;
  description: string;
  qty: number;
  size: string;
  price: string;
}

interface CheckoutOrderSummaryProps {
  subtotal: string;
  total: string;
  items: OrderItem[];
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
          <span className="text-white">฿{subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">SHIPPING</span>
          <span className="font-semibold text-[#C9A84C]">FREE</span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-wider text-[#C9A84C]">คุณได้สิทธิ์จัดส่งสินค้าฟรี</p>
        <div className="mt-1 h-0.5 w-full bg-neutral-700">
          <div className="h-full w-full bg-[#C9A84C]" />
        </div>
      </div>

      <div className="my-4 border-t border-neutral-800" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-white">TOTAL</span>
        <span className="text-xl font-black text-[#C9A84C]">฿{total}</span>
      </div>

      <div className="mt-4 border-t border-neutral-800 pt-4">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          มาถึง ศุกร์ 20 ก.พ. — พฤหัส 26 ก.พ.
        </p>
      </div>

      <div className="mt-4 space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden bg-neutral-800">
              <Image src={item.image} alt={item.name} width={100} height={100} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold uppercase tracking-wide text-white leading-tight">{item.name}</p>
              <p className="mt-0.5 uppercase tracking-wider text-neutral-500">{item.description}</p>
              <p className="mt-1 text-neutral-500">จำนวน {item.qty}</p>
              <p className="text-neutral-500">ไซส์ US {item.size}</p>
              <p className="mt-1 font-bold text-[#C9A84C]">฿{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}