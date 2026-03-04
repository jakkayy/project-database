"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProduct, getFav } from "lib/apiServices/user.service";

const PAGE_SIZE = 3;

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [favMap, setFavMap] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [data, favItems] = await Promise.all([getAllProduct(), getFav()]);
      const mapped = data.map((p: any) => ({
        ...p,
        image: p.images?.[0] || "",
      }));
      setProducts(mapped);
      // favMap: { [product_id]: favItem_id }
      const map: Record<string, number> = {};
      for (const item of favItems ?? []) {
        map[item.product_id] = item.favItem_id;
      }
      setFavMap(map);
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(products.length / PAGE_SIZE) || 1;
  const visibleProducts = products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

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

          {/* Page indicator */}
          <span className="text-xs tabular-nums text-neutral-600">
            {page + 1} / {totalPages}
          </span>

          {/* Left arrow */}
          <button
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              canPrev
                ? "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                : "cursor-not-allowed border-neutral-800 bg-neutral-900/40 text-neutral-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              canNext
                ? "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                : "cursor-not-allowed border-neutral-800 bg-neutral-900/40 text-neutral-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product grid — 3 per page */}
      <div className="grid grid-cols-3 gap-5">
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={page * PAGE_SIZE + index}
            {...product}
            initialIsFav={product._id in favMap}
            initialFavItemId={favMap[product._id] ?? null}
          />
        ))}
      </div>
    </section>
  );
}
