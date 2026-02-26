"use client";

import Image from "next/image";
import { useState } from "react";
import { deleteCart, updateCartItem } from "lib/apiServices/user.service";

interface CartItemProps {
  cartItem_id: number;
  image: string;
  name: string;
  description: string;
  color: string;
  size: string;
  price: string;
  initialQty?: number;
  onRemove: (id: number) => void;
  onQuantityChange?: (id: number, newQty: number) => void;
}

export default function CartItem({
  cartItem_id,
  image,
  name,
  description,
  color,
  size,
  price,
  initialQty = 1,
  onRemove,
  onQuantityChange
}: CartItemProps) {
  const [qty, setQty] = useState(initialQty);

  return (
    <div className="border-b border-neutral-800 py-6">
      <div className="flex gap-5">
        {/* Product image */}
        <div className="h-32 w-32 shrink-0 overflow-hidden bg-neutral-900">
          <Image
            src={image}
            alt={name}
            width={150}
            height={150}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product details */}
        <div className="flex flex-1 justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">{name}</h3>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {description}{color ? ` / ${color}` : ""}{size ? ` / SIZE ${size}` : ""}
            </p>

            {/* Qty controls */}
            <div className="mt-3 flex items-center gap-2">
              {/* Minus */}
              <button
                onClick={async () => {
                  try {
                    if (qty === 1) {
                      await deleteCart(cartItem_id);
                      onRemove(cartItem_id);
                      return;
                    }
                    await updateCartItem(cartItem_id, "decrease");
                    const newQty = qty - 1;
                    setQty(newQty);
                    onQuantityChange?.(cartItem_id, newQty);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="flex h-7 w-7 items-center justify-center border border-neutral-700 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </button>

              <span className="min-w-6 text-center text-sm font-medium text-white">{qty}</span>

              {/* Plus */}
              <button
                onClick={async () => {
                  try {
                    await updateCartItem(cartItem_id, "increase");
                    const newQty = qty + 1;
                    setQty(newQty);
                    onQuantityChange?.(cartItem_id, newQty);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="flex h-7 w-7 items-center justify-center border border-neutral-700 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: price + remove */}
          <div className="flex flex-col items-end justify-between">
            <p className="text-base font-bold text-[#C9A84C]">{price}</p>
            <button
              onClick={async () => {
                try {
                  await deleteCart(cartItem_id);
                  onRemove(cartItem_id);
                } catch (err) {
                  console.error("Failed to remove item", err);
                }
              }}
              className="flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}