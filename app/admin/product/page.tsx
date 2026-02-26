"use client";

import Image from "next/image";
import { useState } from "react";
import AdminNav from "../../components/AdminNav";

const categories = ["Footwear", "Apparel", "Accessories"];

const products = [
  {
    image: "/products/shoe1.svg",
    name: "Apex Carbon Runner",
    subtitle: "Midnight / Gold Edition",
    sku: "SKU-88291",
    category: "Footwear",
    stock: 124,
    price: 485.0,
    status: "IN STOCK",
  },
  {
    image: "/products/shoe2.svg",
    name: "Stealth Comp Tech-Tee",
    subtitle: "Seamless / Matte Black",
    sku: "SKU-77302",
    category: "Apparel",
    stock: 12,
    price: 120.0,
    status: "OUT OF STOCK",
  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "IN STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-900/40 px-3 py-1 text-xs font-semibold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        IN STOCK
      </span>
    );
  }
  if (status === "LOW STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/50 bg-amber-900/40 px-3 py-1 text-xs font-semibold text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        LOW STOCK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-800/50 bg-red-900/40 px-3 py-1 text-xs font-semibold text-red-400">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      OUT OF STOCK
    </span>
  );
}

export default function AdminProductPage() {
  const [activeCategory, setActiveCategory] = useState("Footwear");

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <AdminNav />

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Title + Add Product */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-white">
              Product Inventory
            </h1>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-amber-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            ADD PRODUCT
          </button>
        </div>

        {/* Filters bar */}
        <div className="mt-8 flex items-center justify-between">
          {/* Category tabs */}
          <div className="flex gap-1 rounded-lg bg-[#161920] p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Advanced */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#161920] px-4 py-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by SKU, Name..."
                className="w-52 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Product table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-800 bg-[#161920]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-800/60 transition-colors hover:bg-white/[0.02]"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">
                    {product.sku}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {product.category}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {product.stock}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-sm font-semibold text-amber-400">
                    ${product.price.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table footer */}
          <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium text-white">4</span> of{" "}
              <span className="font-medium text-white">128</span> products
            </p>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-500 transition-colors hover:border-gray-600 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-gray-900">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                3
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-500 transition-colors hover:border-gray-600 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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
        </div>
      </main>
    </div>
  );
}
