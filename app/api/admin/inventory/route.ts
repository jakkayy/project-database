import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const payload = requireAuth(token, "ADMIN");

    const shop = await prisma.shop.findUnique({ where: { user_id: payload.user_id } });
    if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    await connectMongo();
    const stocks = await prisma.productStock.findMany({ where: { shop_id: shop.shop_id } });
    const productIds = [...new Set(stocks.map((s) => s.product_id))];
    const mongoProducts = await Product.find({ _id: { $in: productIds } }).lean();

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