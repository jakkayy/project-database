import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "lib/auth";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");
    
    // รับ favItem_id จากการส่งมาใน body หรือ query string
    const { favItem_id } = await req.json();

    if (!favItem_id) {
      return NextResponse.json({ error: "ต้องระบุ ID ที่ต้องการลบ" }, { status: 400 });
    }

    // ลบข้อมูลใน MySQL
    await prisma.favItem.delete({
      where: {
        favItem_id: Number(favItem_id),
      },
    });

    return NextResponse.json({ message: "ลบออกจากรายการโปรดแล้ว" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "ไม่สามารถลบรายการได้" }, { status: 500 });
  }
}