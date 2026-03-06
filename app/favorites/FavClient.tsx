"use client";
import { useState } from "react";
import ProductCard from "@/app/components/ProductCard";

const CATEGORIES = ["ALL", "RUNNING", "TRAINING", "LIFESTYLE"];

export default function FavClient({ initialItems }: { initialItems: any[] }) {
  const [items] = useState(initialItems);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filtered = activeCategory === "ALL"
    ? items.filter((item) => item.product?.name && item.product?.basePrice)
    : items.filter((item) => item.product?.name && item.product?.basePrice && item.product?.category?.toUpperCase() === activeCategory);

  return (
    <div>
      {/* Filter Pills */}
      <div className="flex gap-3 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#C9A84C] text-black"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-600 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xs uppercase tracking-wider text-neutral-500">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((item) => (
            <ProductCard
              key={item.favItem_id}
              _id={item.product?._id}
              image={item.product?.images?.[0] || ""}
              name={item.product?.name || "Unknown"}
              category={item.product?.category || ""}
              basePrice={item.product?.basePrice}
              slug={item.product?.slug || ""}
              initialIsFav={true}
              initialFavItemId={item.favItem_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
