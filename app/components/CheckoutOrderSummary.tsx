import Image from "next/image";

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
}

export default function CheckoutOrderSummary({
  subtotal,
  total,
  items,
}: CheckoutOrderSummaryProps) {
  return (
    <div>
      <h2 className="text-xl font-medium text-black">สรุปคำสั่งซื้อ</h2>

      {/* Subtotal & Shipping */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            ยอดรวมย่อย{" "}
            <span className="inline-block h-4 w-4 rounded-full border border-gray-400 text-center text-xs leading-4 text-gray-400">
              ?
            </span>
          </span>
          <span className="text-black">฿{subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">การจัดส่ง/การส่งมอบ</span>
          <span className="text-black">ฟรี</span>
        </div>
      </div>

      {/* Free shipping bar */}
      <div className="mt-3">
        <p className="text-xs text-green-700">คุณได้สิทธิ์จัดส่งสินค้าฟรี</p>
        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
          <div className="h-1.5 w-full rounded-full bg-green-600" />
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-black">ยอดรวม</span>
          <span className="text-black">฿{total}</span>
        </div>
      </div>

      {/* Estimated delivery */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          มาถึง ศุกร์ 20 ก.พ. - พฤหัส 26 ก.พ.
        </p>
      </div>

      {/* Order items */}
      <div className="mt-4 space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-25 w-25 shrink-0 overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-medium text-black leading-tight">
                {item.description}
              </p>
              <p className="mt-0.5 font-medium text-black">{item.name}</p>
              <p className="mt-1 text-gray-500">จำนวน {item.qty}</p>
              <p className="text-gray-500">
                ไซส์ US {item.size}
              </p>
              <p className="mt-1 font-medium text-black">฿{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
