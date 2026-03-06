"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { searchProducts } from "lib/apiServices/user.service";

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: number;
  category: string;
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setQuery("");
    setOpen(false);
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={containerRef} className="relative w-80">
      {/* Input */}
      <div className={`flex items-center gap-3 rounded-full border px-4 py-2.5 transition-colors ${
        query ? "border-[#C9A84C] bg-neutral-900" : "border-neutral-700 bg-neutral-900 hover:border-neutral-500"
      }`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-4 w-4 shrink-0 transition-colors ${query ? "text-[#C9A84C]" : "text-neutral-500"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาสินค้า..."
          className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-neutral-600 hover:text-neutral-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 top-full mt-3 w-96 -translate-x-1/2 rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="border-b border-neutral-800 px-4 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              {loading ? "กำลังค้นหา..." : `ผลลัพธ์สำหรับ "${query}"`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-[#C9A84C]" />
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-neutral-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="text-sm text-neutral-600">ไม่พบสินค้าที่ตรงกัน</p>
            </div>
          ) : (
            <div className="py-1">
              {results.map((item) => {
                const img = item.images?.[0] || "/products/shoe1.svg";
                return (
                  <button
                    key={item._id}
                    onClick={() => handleSelect(item.slug)}
                    className="flex w-full items-center gap-4 px-4 py-3 hover:bg-neutral-900 transition-colors text-left group"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                      <Image
                        src={img}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        unoptimized={img.startsWith("http") ? false : true}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold uppercase tracking-wide text-white group-hover:text-[#C9A84C] transition-colors">{item.name}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{item.category}</p>
                    </div>
                    <p className="shrink-0 text-sm font-black text-[#C9A84C]">
                      ฿{item.basePrice?.toLocaleString()}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
