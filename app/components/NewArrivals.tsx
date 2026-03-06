"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProduct, getFav } from "lib/apiServices/user.service";

const CATEGORIES = ["ALL", "RUNNING", "TRAINING", "LIFESTYLE"];

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [favMap, setFavMap] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      const [data, favItems] = await Promise.all([getAllProduct(), getFav()]);
      const mapped = data.map((p: any) => ({
        ...p,
        image: p.images?.[0] || "",
      }));
      setProducts(mapped);
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

  return (
    <section className="bg-gray-50 px-10 py-12">
      {/* Big heading */}
      <div className="mb-2">
        <h2 className="text-5xl font-extrabold leading-none tracking-tight text-gray-900">
          The Collection
        </h2>
        <p className="mt-2 text-sm text-gray-500">New Arrivals — Sustainable Fashion</p>
      </div>

      {/* Filter pills */}
      <div className="mb-8 mt-6 flex items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              activeCategory === cat
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-4 gap-5">
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            {...product}
            initialIsFav={product._id in favMap}
            initialFavItemId={favMap[product._id] ?? null}
          />
        ))}
      </div>
    </section>
  );
}
