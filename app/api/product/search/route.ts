import { NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";
import { prisma } from "lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json([]);

  try {
    await connectMongo();

    const products = await Product.find(
      { name: { $regex: q, $options: "i" } },
      { name: 1, slug: 1, images: 1, basePrice: 1, category: 1 }
    ).limit(20);

    // Filter only products that have at least one variant with stock > 0
    const productIds = products.map((p) => p._id.toString());
    const inStockRows = await prisma.productStock.findMany({
      where: {
        product_id: { in: productIds },
        stock: { gt: 0 },
      },
      select: { product_id: true },
      distinct: ["product_id"],
    });
    const inStockIds = new Set(inStockRows.map((r) => r.product_id));

    const filtered = products.filter((p) => inStockIds.has(p._id.toString())).slice(0, 8);

    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
