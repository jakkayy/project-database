export const dynamic = "force-dynamic";
import Navbar from "@/app/components/Navbar";
import CartClient from "./CartClient";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";
import { prisma } from "lib/prisma";
import { connectMongo } from "lib/mongodb";
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-10 py-20 text-center">
          <p className="text-gray-400">Your cart is empty</p>
        </div>
      </div>
    );
  }

  await connectMongo();

  const itemsWithProduct = await Promise.all(
    cart.items.map(async (item) => {
      // const product = await Product.findById(item.product_id);

      console.log("MySQL product_id:", item.product_id);
      const product = await Product.findById(item.product_id);
      console.log("Mongo product found:", product);

      return {
        cartItem_id: item.cartItem_id,
        cart_id: item.cart_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.price), 
        size: item.size,
        color: item.color,
        createdAt: item.createdAt,
        product: product
          ? {
              name: product.name,
              images: product.images?.[0],
              category: product.category,
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartClient items={itemsWithProduct} total={total} />
    </div>
  );
}
