export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "lib/prisma";
import { requireAuth } from "lib/auth";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");

    const cart = await prisma.cart.findUnique({
      where: { user_id: user.user_id }, 
      include: {
        items: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({
        items: [],
        total: 0,
      });
    }

    // Filter out items where stock = 0 for the specific color+size
    const stockRows = await prisma.productStock.findMany({
      where: {
        product_id: { in: cart.items.map((i) => i.product_id) },
        stock: { gt: 0 },
      },
      select: { product_id: true, color: true, size: true },
    });
    const inStockSet = new Set(stockRows.map((s) => `${s.product_id}|${s.color}|${s.size}`));
    const inStockItems = cart.items.filter((item) =>
      inStockSet.has(`${item.product_id}|${item.color}|${item.size}`)
    );

    await connectMongo();

    const itemsWithProduct = await Promise.all(
      inStockItems.map(async (item) => {
        const product = await Product.findById(item.product_id);

        console.log(`DEBUG: Cart API color handling - item.color: ${item.color}, product.color: ${product?.color}`);

        return {
          cartItem_id: item.cartItem_id,
          product_id: item.product_id,
          size: item.size,
          color: item.color || "Default",
          price: item.price,
          quantity: item.quantity,
          product: product
            ? {
                name: product.name,
                images: product.images,
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

    console.log("DEBUG: Final API response:", {
      items: itemsWithProduct,
      total,
    });

    return NextResponse.json({
      items: itemsWithProduct,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}