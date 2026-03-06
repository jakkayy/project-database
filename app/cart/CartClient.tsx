"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CartItem from "@/app/components/CartItem";
import CartSummary from "@/app/components/CartSummary";

interface Props {
  items: any[];
  total: number;
}

export default function CartClient({ items }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedItems = items.filter((item) => selectedIds.has(item.cartItem_id));
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    const ids = Array.from(selectedIds).join(",");
    router.push(`/checkout?items=${ids}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-10 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase text-white">Shopping Cart</h1>
        <p className="mt-1 text-sm text-neutral-400">Select items to order</p>
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
              isSelected={selectedIds.has(item.cartItem_id)}
              onToggleSelect={() => toggleSelect(item.cartItem_id)}
              onRemove={() => router.refresh()}
              onQuantityChange={() => router.refresh()}
            />
          ))}
        </div>

        <div className="w-96 shrink-0">
          <CartSummary
            total={selectedTotal.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
            })}
            items={selectedItems}
            selectedCount={selectedIds.size}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}