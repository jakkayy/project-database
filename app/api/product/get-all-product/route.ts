import { NextResponse } from "next/server";
import { connectMongo } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";

export async function GET() {
  try {
    await connectMongo();

    const products = await Product.find();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
