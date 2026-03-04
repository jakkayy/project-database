import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";

const prisma = new PrismaClient();

// ฟังก์ชันสำหรับดึงข้อมูล (ที่คุณมีอยู่แล้ว)
export async function GET() {
  try {
    await connectMongo();
    const stocks = await prisma.productStock.findMany();
    const mongoProducts = await Product.find({}).lean();

    const groupedInventory = mongoProducts.map((details: any) => {
      const productIdStr = details._id.toString();
      const itemVariants = stocks.filter((s: any) => s.product_id === productIdStr);
      return {
        mongodb_id: productIdStr,
        name: details.name || "Untitled",
        image: details.images?.[0] || "",
        category: details.category || "Footwear",
        basePrice: details.basePrice || 0,
        variants: itemVariants.map((v: any) => ({
          id: v.id, color: v.color, size: v.size, stock: v.stock
        }))
      };
    });
    return NextResponse.json(groupedInventory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// *** เพิ่มส่วนนี้เข้าไปเพื่อให้บันทึกข้อมูลได้จริง ***
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, basePrice, image, color, size, stock } = body;

    await connectMongo();

    // 1. บันทึกข้อมูลลง MongoDB
    const mongoProduct = await Product.create({
      name,
      category,
      basePrice: parseFloat(basePrice),
      images: [image],
      slug: name.toLowerCase().replace(/ /g, "-"),
    });

    // 2. บันทึกข้อมูลสต็อกลง MySQL (Prisma)
    const mysqlStock = await prisma.productStock.create({
      data: {
        product_id: mongoProduct._id.toString(),
        color: color,
        size: size,
        stock: parseInt(stock),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}