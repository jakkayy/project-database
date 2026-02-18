"use client";

import { useState } from "react";
import CartItem from "@/app/components/CartItem";
import CartSummary from "@/app/components/CartSummary";

interface Props {
  items: any[];
  total: number;
}

export default function CartClient({ items, total }: Props) {
  const [cartItems, setCartItems] = useState(items);

  const handleRemove = (id: number) => {
    setCartItems(prev => prev.filter(item => item.cartItem_id !== id));
  };

  const handleQuantityChange = (id: number, newQty: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartItem_id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const newTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-10 py-10">
      <div className="flex gap-12">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-medium text-black">ตะกร้า</h1>

          {cartItems.map((item) => (
            <CartItem
              key={item.cartItem_id}
              cartItem_id={item.cartItem_id}
              image={item.product?.images?.[0]}
              name={item.product?.name}
              description={item.product?.category}
              color="-"
              size="-"
              price={item.price.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
              initialQty={item.quantity}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        <div className="w-80 shrink-0">
          <CartSummary
            subtotal={newTotal.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
            })}
            total={newTotal.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
            })}
          />
        </div>
      </div>
    </div>
  );
}
