import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await connectMongo();
    
    // ดึงข้อมูลออกมาตรงๆ
    const stocks = await prisma.productStock.findMany();
    const mongoProducts = await Product.find({}).lean(); // ใช้ .lean() เพื่อให้ได้ Plain JS Object

    console.log("Found in Mongo:", mongoProducts.length);
    console.log("Found in MySQL:", stocks.length);

    const groupedInventory = mongoProducts.map((details: any) => {
      const productIdStr = details._id.toString();
      const itemVariants = stocks.filter((s: any) => s.product_id === productIdStr);
      
      return {
        mongodb_id: productIdStr,
        name: details.name || "Untitled",
        image: details.images?.[0] || "",
        category: details.category || "Footwear", // Default ไว้เผื่อลืมใส่
        basePrice: details.basePrice || 0,
        variants: itemVariants.map((v: any) => ({
          id: v.id,
          color: v.color,
          size: v.size,
          stock: v.stock
        }))
      };
    });

    return NextResponse.json(groupedInventory);
  } catch (error: any) {
    console.error("API ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}