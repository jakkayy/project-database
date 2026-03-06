"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProduct, getFav } from "lib/apiServices/user.service";

const PAGE_SIZE = 3;
const CATEGORIES = ["ALL", "RUNNING", "TRAINING", "LIFESTYLE"];

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [favMap, setFavMap] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);
  const [activeCategory, setActiveCategory] = useState("ALL");

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

  const filtered = activeCategory === "ALL"
    ? products
    : products.filter((p) => p.category?.toUpperCase() === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const visibleProducts = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(0);
  };

  return (
    <section className="bg-black px-10 py-12">
      {/* Big heading */}
      <div className="mb-2">
        <h2 className="text-6xl font-black uppercase leading-none tracking-tight">
          <span className="text-white">THE </span>
          <span className="text-[#C9A84C]">COLLECTION</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-400">New Arrivals</p>
      </div>

      {/* Filter pills + pagination */}
      <div className="mb-8 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeCategory === cat
                  ? "bg-[#C9A84C] text-black"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-neutral-600">{page + 1} / {totalPages}</span>
          <button
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              canPrev ? "border-neutral-700 text-neutral-300 hover:border-[#C9A84C] hover:text-[#C9A84C]" : "cursor-not-allowed border-neutral-800 text-neutral-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              canNext ? "border-neutral-700 text-neutral-300 hover:border-[#C9A84C] hover:text-[#C9A84C]" : "cursor-not-allowed border-neutral-800 text-neutral-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product grid */}
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
