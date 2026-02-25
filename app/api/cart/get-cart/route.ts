export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";
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

    await connectMongo();

    const itemsWithProduct = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.product_id);

        return {
          cartItem_id: item.cartItem_id, 
          test_size: item.size,
          price: item.price,
          quantity: item.quantity,
          product: product
            ? {
                name: product.name,
                images: product.images,
                category: product.category,
                basePrice: product.basePrice,
                color: product.color,
              }
            : null,
        };
      })
    );

    const total = itemsWithProduct.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

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