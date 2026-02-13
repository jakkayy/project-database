"use client";

import Image from "next/image";
import { useState } from "react";

interface CartItemProps {
  image: string;
  name: string;
  description: string;
  color: string;
  size: string;
  price: string;
  initialQty?: number;
}

export default function CartItem({
  image,
  name,
  description,
  color,
  size,
  price,
  initialQty = 1,
}: CartItemProps) {
  const [qty, setQty] = useState(initialQty);

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex gap-4">
        {/* Product image */}
        <div className="h-36 w-36 shrink-0 overflow-hidden bg-gray-100">
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
          <div>
            <h3 className="text-base font-medium text-black">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            <p className="text-sm text-gray-500">{color}</p>
            <p className="mt-1 text-sm font-medium text-black">
              ไซส์ {size}
            </p>
          </div>
          <p className="text-base text-black">{price}</p>
        </div>
      </div>

      {/* Actions: delete, qty, add, wishlist */}
      <div className="mt-4 flex items-center gap-3 pl-40">
        {/* Delete */}
        <button className="text-gray-400 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>

        {/* Minus */}
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>

        {/* Qty */}
        <span className="min-w-5 text-center text-sm">{qty}</span>

        {/* Plus */}
        <button
          onClick={() => setQty((q) => q + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>

        {/* Wishlist */}
        <button className="text-gray-400 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
