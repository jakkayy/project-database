export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "lib/prisma";
import { requireAuth } from "lib/auth";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    requireAuth(token, "USER");

    const body = await req.json();
    console.log("BODY:", body); 

    const { product_id, color, size } = body;

    if (!product_id || !color || !size) {
      return NextResponse.json(
        { error: "product_id, color and size are required" },
        { status: 400 }
      );
    }

    const productStock = await prisma.productStock.findUnique({
      where: {
        product_id_color_size: {
          product_id,
          color,
          size,
        },
      },
    });

    return NextResponse.json({
      stock: productStock?.stock ?? 0,
      size: productStock?.size,
      color: productStock?.color,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}