"use client";

import { useRouter } from "next/navigation";
import CartItem from "@/app/components/CartItem";
import CartSummary from "@/app/components/CartSummary";

interface Props {
  items: any[];
  total: number;
}

export default function CartClient({ items }: Props) {
  const router = useRouter();

  const newTotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-10 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase text-white">
          ตะกร้าสินค้า
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          ตรวจสอบรายการสินค้าที่คุณเลือกไว้
        </p>
      </div>

      <div className="flex gap-10">
        <div className="flex-1">
          {items.map((item) => (
            <CartItem
              key={item.cartItem_id}
              cartItem_id={item.cartItem_id}
              image={item.product?.images}
              name={item.product?.name}
              description={item.product?.category}
              color={item.product?.color}
              size={item.size}
              price={item.price.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
              initialQty={item.quantity}
              onRemove={() => router.refresh()}
              onQuantityChange={() => router.refresh()}
            />
          ))}
        </div>

        <div className="w-96 shrink-0">
          <CartSummary
            subtotal={newTotal.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
            })}
            total={newTotal.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
            })}
            items={items}
          />
        </div>
      </div>
    </div>
  );
}