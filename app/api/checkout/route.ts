// app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const itemsParam = searchParams.get("items");
    const selectedIds = itemsParam
      ? itemsParam.split(",").map((id) => parseInt(id)).filter(Boolean)
      : null;

    // get token from cookie
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userAuth = requireAuth(token);

    // get user
    const user = await prisma.user.findUnique({
      where: { user_id: userAuth.user_id },
      select: {
        user_id: true,
        balance: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // get cart
    const cart = await prisma.cart.findFirst({
      where: { user_id: user.user_id },
      include: {
        items: true,
      },
    });
    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const cartItems = selectedIds
      ? cart.items.filter((item) => selectedIds.includes(item.cartItem_id))
      : cart.items;

    const productIds = cartItems.map((item) => item.product_id);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const itemsWithProduct = cartItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product_id
      );

      return {
        cartItem_id: item.cartItem_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        size: item.size,
        color: item.color,
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
      balance: user.balance,
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}