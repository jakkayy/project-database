import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";

export async function GET() {
  try {
    await connectMongo();

    const products = await Product.find();

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
