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
          className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-red-50 shadow-sm"
        >
          ลบ
        </button>
      </div>
    ))}
  </div>
);
}