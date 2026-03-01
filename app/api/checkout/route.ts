// app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";

export async function GET() {
  await connectMongo();

  const cart = await prisma.cart.findFirst({
    where: { user_id: 1 }, // replace with session user
    include: {
      items: true,
    },
  });

  if (!cart) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const productIds = cart.items.map((item) => item.product_id);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const itemsWithProduct = cart.items.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item.product_id
    );

    return {
      cartItem_id: item.cartItem_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
      size: item.size,
      product: product
        ? {
            name: product.name,
            images: product.images,
            category: product.category,
            basePrice: product.basePrice,
          }
        : null,
    };
  });

  const total = itemsWithProduct.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return NextResponse.json({
    items: itemsWithProduct,
    total,
  });
}