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
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
              activeCategory === cat
                ? "bg-green-500 text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-green-400 hover:text-green-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xs uppercase tracking-wider text-gray-400">No items in this category</p>
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
