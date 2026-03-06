import { NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";
import { prisma } from "lib/prisma";

export async function GET() {
  try {
    // Get product IDs that have at least one variant with stock > 0
    const inStockRows = await prisma.productStock.findMany({
      where: { stock: { gt: 0 } },
      select: { product_id: true },
      distinct: ["product_id"],
    });
    const inStockIds = inStockRows.map((r) => r.product_id);

    await connectMongo();

    const products = await Product.find({ _id: { $in: inStockIds } });

    const formattedProducts = products.map((product) => {
      const p = product.toObject();

      return {
        ...p,
        image:
          p.image && p.image.trim() !== ""
            ? p.image
            : "/placeholder.png",
      };
    });

    return NextResponse.json(formattedProducts);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
