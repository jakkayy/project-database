import Navbar from "@/app/components/Navbar";
import CartClient from "./CartClient";
import { cookies } from "next/headers";
<<<<<<< HEAD
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { connectMongo } from "@/lib/mongodb";
=======
import { requireAuth } from "lib/auth";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
>>>>>>> 09ee1ef (refactor: move lib)
import Product from "@/app/models/Product";

export default async function CartPage() {
  const token = (await cookies()).get("access_token")?.value;
  const user = requireAuth(token, "USER");

  const cart = await prisma.cart.findUnique({
    where: { user_id: user.user_id },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-10 text-center text-gray-500">
          ยังไม่มีสินค้าในตะกร้า
        </div>
      </div>
    );
  }

  await connectMongo();

  const itemsWithProduct = await Promise.all(
    cart.items.map(async (item) => {
      const product = await Product.findById(item.product_id);

      return {
        cartItem_id: item.cartItem_id,
        cart_id: item.cart_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.price), 
        size: item.size,
        createdAt: item.createdAt,
        product: product
          ? {
              name: product.name,
              images: product.images,
              category: product.category,
              color: product.color,
              basePrice: product.basePrice,
            }
          : null,
      };
    })
  );

  const total = itemsWithProduct.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartClient items={itemsWithProduct} total={total} />
    </div>
  );
}
