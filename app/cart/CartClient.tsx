"use client";

import { useState } from "react";
import CartItem from "@/app/components/CartItem";
import CartSummary from "@/app/components/CartSummary";

interface Props {
  items: any[];
  total: number;
}

export default function CartClient({ items, total }: Props) {
  console.log("เช็คข้อมูลที่ได้รับจาก API:", items);
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
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase text-white">ตะกร้าสินค้า</h1>
        <p className="mt-1 text-sm text-neutral-400">ตรวจสอบรายการสินค้าที่คุณเลือกไว้</p>
      </div>

      <div className="flex gap-10">
        <div className="flex-1">
          {cartItems.map((item) => (
            <CartItem
              key={item.cartItem_id}
              cartItem_id={item.cartItem_id}
              image={item.product?.images?.[0]}
              name={item.product?.name}
              description={item.product?.category}
              color={item.product?.color}
              size={item.size}
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
          />
        </div>
      </div>
    </div>
  );
}