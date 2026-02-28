import Navbar from "@/app/components/Navbar";
import FavoritesItem from "@/app/components/FavoritesItem";
import FavClient from "./FavClient";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product"; // โมเดล MongoDB ของคุณ

export default async function FavoritesPage() {
  const token = (await cookies()).get("access_token")?.value;
  const user = requireAuth(token, "USER");

  // 1. ดึงรายการ Fav จาก MySQL
  const fav = await prisma.fav.findUnique({
    where: { user_id: Number(user.user_id) },
    include: { items: true },
  });

  if (!fav || fav.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-10 text-center text-gray-500">ยังไม่มีรายการโปรด</div>
      </div>
    );
  }

  // 2. เชื่อมต่อ MongoDB
  await connectMongo();

  // 3. ดึงข้อมูลสินค้าจาก MongoDB มาผสม
  const itemsWithProduct = await Promise.all(
    fav.items.map(async (item) => {
      const product = await Product.findById(item.product_id);

      return {
        favItem_id: item.favItem_id,
        product_id: item.product_id,
        product: product
          ? {
              name: product.name,
              images: product.images,
              category: product.category,
              price: product.price,
            }
          : null,
      };
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-10 py-10">
        <h1 className="mb-8 text-2xl font-medium text-black">รายการโปรด</h1>
        <FavClient initialItems={itemsWithProduct} />
      </div>
    </div>
  );
}