import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");
    const { product_id } = await req.json();

    // 1. หา Fav (หัวตะกร้า) ของ User คนนี้ก่อน
    let userFav = await prisma.fav.findUnique({
      where: { user_id: Number(user.user_id) }
    });

    // 2. ถ้ายังไม่มี Fav ให้สร้างใหม่
    if (!userFav) {
      userFav = await prisma.fav.create({
        data: { user_id: Number(user.user_id) }
      });
    }

    // 3. เพิ่มสินค้าลงใน FavItem (ใช้ upsert เพื่อกัน error ถ้าซ้ำ หรือจะใช้ create ปกติก็ได้เพราะมี @@unique กันไว้)
    const favoriteItem = await prisma.favItem.create({
      data: {
        fav_id: userFav.fav_id,
        product_id: product_id,
      },
    });

    return NextResponse.json({ message: "เพิ่มในรายการโปรดแล้ว", data: favoriteItem });
  } catch (error: any) {
    // ถ้า error เพราะมีสินค้าชิ้นนี้อยู่แล้ว (P2002 คือ Unique constraint failed ของ Prisma)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "สินค้านี้อยู่ในรายการโปรดอยู่แล้ว" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}