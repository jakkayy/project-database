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
    <section className="bg-black px-10 py-12">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
            THE COLLECTION
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">
            สินค้ามาใหม่
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-neutral-300 transition-colors hover:text-[#C9A84C]">
            ดูทั้งหมด
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
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
        className="flex gap-5 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
}
