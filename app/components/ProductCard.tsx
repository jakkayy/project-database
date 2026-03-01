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
}

export default function ProductCard({
  _id,
  image,
  name,
  category,
  basePrice,
  slug,
  badge,
}: ProductCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [favItemId, setFavItemId] = useState<number | null>(null);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!_id) return;

    try {
      if (isFav && favItemId !== null) {
        // กดซ้ำ → ลบออกจากรายการโปรด
        await deleteFav(favItemId);
        setIsFav(false);
        setFavItemId(null);
        toast("ลบออกจากรายการโปรดแล้ว", { description: name });
      } else {
        // กดครั้งแรก → เพิ่มในรายการโปรด
        const res = await addFav({ product_id: _id });
        setIsFav(true);
        setFavItemId(res?.data?.favItem_id ?? null);
        toast.success("เพิ่มในรายการโปรดแล้ว", { description: name, icon: "♡" });
      }
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error("กรุณา Login ก่อน", {
          description: "เข้าสู่ระบบเพื่อบันทึกรายการโปรด",
        });
        return;
      }
      toast.error("เกิดข้อผิดพลาด", {
        description: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const content = (
    <div className="cursor-pointer group w-full">
      <div className="relative mb-4 aspect-square w-full overflow-hidden bg-neutral-900">
        {badge && (
          <span className="absolute left-3 top-3 z-10 bg-[#C9A84C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            {badge}
          </span>
        )}
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
              ? "bg-white text-black"
              : "bg-black/60 text-white hover:bg-black/80"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-white">{name}</h3>
      <p className="mt-1 text-sm text-neutral-400">{basePrice} ฿</p>
    </div>
  );

  if (slug) {
    return <Link href={`/product/${slug}`}>{content}</Link>;
  }

  return content;
}
