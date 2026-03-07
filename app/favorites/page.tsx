import ClientNavbar from "@/app/components/ClientNavbar";
import FavoritesItem from "@/app/components/FavoritesItem";
import FavClient from "./FavClient";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product"; // โมเดล MongoDB ของคุณ
import Link from "next/link";

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
      <div className="flex min-h-screen flex-col bg-gray-50">
        <ClientNavbar />

        {/* Sub Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Wishlist</h1>
          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="/profile" className="transition-colors hover:text-gray-900">
              Profile
            </Link>
            <Link href="/history" className="transition-colors hover:text-gray-900">
              Orders
            </Link>
            <Link
              href="/favorites"
              className="border-b-2 border-green-500 pb-3 -mb-4 font-semibold text-gray-900"
            >
              Wishlist
            </Link>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">Your wishlist is empty</div>
        </div>
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <ClientNavbar />

      {/* Sub Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Wishlist</h1>
        <div className="flex gap-8 text-sm text-gray-400">
          <Link href="/profile" className="transition-colors hover:text-gray-900">
            Profile
          </Link>
          <Link href="/history" className="transition-colors hover:text-gray-900">
            Orders
          </Link>
          <Link
            href="/favorites"
            className="border-b-2 border-green-500 pb-3 -mb-4 font-semibold text-gray-900"
          >
            Wishlist
          </Link>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="flex-1 px-10 py-8">
        <div className="mx-auto max-w-7xl">
          <FavClient initialItems={itemsWithProduct} />
        </div>
      </div>
    </div>
  );
}