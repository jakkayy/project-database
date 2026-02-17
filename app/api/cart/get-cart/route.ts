import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { connectMongo } from "@/app/lib/mongodb";
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
          ...item,
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
