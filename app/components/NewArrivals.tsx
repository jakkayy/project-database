"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProduct } from "lib/apiServices/user.service";

export default function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProduct();

      const mapped = data.map((p: any) => ({
        ...p,
        image: p.images?.[0] || "",
      }));

      setProducts(mapped);
    };

    fetchProducts();
  }, []);

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
