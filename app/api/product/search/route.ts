import { NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json([]);

  try {
    await connectMongo();

    const products = await Product.find(
      { name: { $regex: q, $options: "i" } },
      { name: 1, slug: 1, images: 1, basePrice: 1, category: 1 }
    ).limit(8);

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
