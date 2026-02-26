import Navbar from "@/app/components/Navbar";
import FavoritesItem from "@/app/components/FavoritesItem";
import FavClient from "./FavClient";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";

export default async function FavoritesPage() {
  const token = (await cookies()).get("access_token")?.value;
  const user = requireAuth(token, "USER");

  const fav = await prisma.fav.findUnique({
    where: { user_id: Number(user.user_id) },
    include: { items: true },
  });

  if (!fav || fav.items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-xs uppercase tracking-widest text-neutral-500">รายการโปรดของคุณว่างเปล่า</p>
        </div>
      </div>
    );
  }

  await connectMongo();

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
  <div className="min-h-screen bg-black">
    <Navbar />
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-[#C9A84C]">คอลเลกชันของคุณ</div>
      <h1 className="mb-8 text-2xl font-black uppercase tracking-tight text-white">รายการโปรด</h1>
      <FavClient initialItems={itemsWithProduct} />
    </div>
  </div>
);
}