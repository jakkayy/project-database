"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import FavoritesItem from "@/app/components/FavoritesItem";

export default function FavClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);

  const handleDelete = async (favItem_id: number) => {
    const res = await fetch("/api/favorite/delete-fav", {
      method: "DELETE",
      body: JSON.stringify({ favItem_id }),
    });

    if (res.ok) {
      // ลบออกจาก State ทันที ไม่ต้องรอ Refresh หน้า
      setItems(prev => prev.filter(item => item.favItem_id !== favItem_id));
    }
  };

return (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
    {items.map((item) => (
      <div key={item.favItem_id} className="relative group">
        <FavoritesItem 
          // ต้องส่ง item.product.images[0] ไปให้ตรงกับชื่อ prop 'image'
          image={item.product?.images?.[0] || ""} 
          name={item.product?.name || "Unknown"}
          category={item.product?.category || "Category"}
          price={item.product?.price ? `฿${item.product.price.toLocaleString()}` : "N/A"}
        />
        
        {/* ปุ่มลบ */}
        <button 
          onClick={() => handleDelete(item.favItem_id)}
          className="absolute top-2 right-2 border border-neutral-700 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:border-red-500 hover:text-red-500"
        >
          ลบ
        </button>
      </div>
    ))}
  </div>
);
}