import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await connectMongo();
    const stocks = await prisma.productStock.findMany();
    const mongoProducts = await Product.find({});

    const groupedInventory = mongoProducts.map((details: any) => {
      const productIdStr = details._id.toString();
      const itemVariants = stocks.filter((s: any) => s.product_id === productIdStr);
      
      return {
        mongodb_id: productIdStr,
        name: details.name || "Unknown Product",
        image: details.images?.[0] || "",
        // สำคัญ: ปรับ Category ให้เป็นตัวเล็กเพื่อไปเทียบใน Frontend ได้ง่าย
        category: details.category?.toLowerCase() || "footwear", 
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}