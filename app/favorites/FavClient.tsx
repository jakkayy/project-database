"use client";
import { useState } from "react";
import { toast } from "sonner";
import FavoritesItem from "@/app/components/FavoritesItem";

export default function FavClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);

  const handleDelete = async (favItem_id: number) => {
    const res = await fetch("/api/favorite/delete-fav", {
      method: "DELETE",
      body: JSON.stringify({ favItem_id }),
    });

    if (res.ok) {
      setItems(prev => prev.filter(item => item.favItem_id !== favItem_id));
    }
  };

  const handleAddToCart = async (product_id: string, basePrice: number, name: string) => {
    try {
      const res = await fetch("/api/cart/add-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id,
          quantity: 1,
          basePrice,
          size: "N/A",
          color: "N/A",
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("เพิ่มในตะกร้าแล้ว", { description: name });
    } catch {
      toast.error("เกิดข้อผิดพลาด", { description: "กรุณาลองใหม่อีกครั้ง" });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <FavoritesItem
          key={item.favItem_id}
          image={item.product?.images?.[0] || ""}
          name={item.product?.name || "Unknown"}
          category={item.product?.category || "Category"}
          price={item.product?.basePrice ? `฿${item.product.basePrice.toLocaleString()}` : "N/A"}
          onDelete={() => handleDelete(item.favItem_id)}
          onAddToCart={() => handleAddToCart(item.product_id, item.product?.basePrice ?? 0, item.product?.name || "")}
        />
      ))}
    </div>
  );
}
