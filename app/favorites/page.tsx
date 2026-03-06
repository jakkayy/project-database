import Navbar from "@/app/components/Navbar";
import FavoritesItem from "@/app/components/FavoritesItem";
import ChatbotWidget from "@/app/components/ChatbotWidget";
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
        <div className="p-10 text-center text-gray-500">Your wishlist is empty</div>
      </div>
    );
  }

  // 2. เชื่อมต่อ MongoDB
  await connectMongo();

  // 3. หา product_ids ที่ยังมี stock > 0
  const inStockRows = await prisma.productStock.findMany({
    where: {
      product_id: { in: fav.items.map((i) => i.product_id) },
      stock: { gt: 0 },
    },
    select: { product_id: true },
    distinct: ["product_id"],
  });
  const inStockIds = new Set(inStockRows.map((r) => r.product_id));

  // 4. ดึงข้อมูลสินค้าจาก MongoDB มาผสม (เฉพาะที่มี stock)
  const itemsWithProduct = await Promise.all(
    fav.items
      .filter((item) => inStockIds.has(item.product_id))
      .map(async (item) => {
        const product = await Product.findById(item.product_id);

        return {
          favItem_id: item.favItem_id,
          product_id: item.product_id,
          product: product
            ? {
                name: product.name,
                slug: product.slug,
                images: product.images,
                category: product.category,
                basePrice: product.basePrice,
              }
            : null,
        };
      })
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-10 py-10">
          <h1 className="mb-8 text-3xl font-extrabold text-gray-900">Wishlist</h1>
          <FavClient initialItems={itemsWithProduct} />
        </div>
      </div>
      <ChatbotWidget />
    </>
  );
}