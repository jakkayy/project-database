"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    image: "/products/shoe1.svg",
    name: 'Book 2 "Spiridon" EP',
    category: "รองเท้าบาสเก็ตบอล",
    price: "฿5,400",
  },
  {
    image: "/products/shoe2.svg",
    name: 'Air Jordan 9 Retro "Flint Grey and French Blue"',
    category: "รองเท้าผู้ชาย",
    price: "฿7,500",
  },
  {
    image: "/products/shoe3.svg",
    name: "Nike ACG Ultrafly Trail",
    category: "รองเท้าวิ่งเทรล",
    price: "฿8,700",
  },
  {
    image: "/products/shoe4.svg",
    name: "Nike Air Max Dn",
    category: "รองเท้าผู้ชาย",
    price: "฿6,300",
  },
  {
    image: "/products/shoe5.svg",
    name: "Nike Dunk Low Retro",
    category: "รองเท้าผู้ชาย",
    price: "฿3,800",
  },
];

export default function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-10 py-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-medium text-black">สินค้ามาใหม่</h2>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-black hover:underline">
            ดูทั้งหมด
          </button>
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable product list */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
}
