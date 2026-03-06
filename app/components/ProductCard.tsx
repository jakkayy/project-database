"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { addFav, deleteFav } from "lib/apiServices/user.service";

interface ProductCardProps {
  _id?: string;
  image: string;
  name: string;
  category: string;
  basePrice: string;
  slug?: string;
  badge?: string;
  initialIsFav?: boolean;
  initialFavItemId?: number | null;
}

export default function ProductCard({
  _id,
  image,
  name,
  category,
  basePrice,
  slug,
  badge,
  initialIsFav = false,
  initialFavItemId = null,
}: ProductCardProps) {
  const [isFav, setIsFav] = useState(initialIsFav);
  const [favItemId, setFavItemId] = useState<number | null>(initialFavItemId);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!_id) return;

    try {
      if (isFav && favItemId !== null) {
        await deleteFav(favItemId);
        setIsFav(false);
        setFavItemId(null);
        toast("Removed from wishlist", { description: name });
      } else {
        const res = await addFav({ product_id: _id });
        setIsFav(true);
        setFavItemId(res?.data?.favItem_id ?? null);
        toast.success("Added to wishlist", { description: name, icon: "♡" });
      }
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error("Please sign in first", {
          description: "Sign in to save your wishlist",
        });
        return;
      }
      toast.error("An error occurred", {
        description: "Please try again",
      });
    }
  };

  const content = (
    <div className="cursor-pointer group w-full rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all">
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Heart button */}
        <button
          onClick={handleFav}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
            isFav
              ? "bg-green-500 text-white"
              : "bg-white/90 text-gray-500 hover:bg-white hover:text-green-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
        {/* Badge */}
        {badge && (
          <span className="absolute bottom-3 left-3 z-10 bg-green-500 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Info area */}
      <div className="p-4">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-gray-900">{name}</h3>
            <p className="mt-0.5 truncate text-[11px] uppercase tracking-wider text-gray-400">{category}</p>
            <p className="mt-2 text-base font-bold text-gray-900">฿{Number(basePrice).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (slug) {
    return <Link href={`/product/${slug}`}>{content}</Link>;
  }

  return content;
}
