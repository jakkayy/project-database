import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: ดึงรายการที่อยู่ทั้งหมดจาก DB
export async function GET() {
  try {
    const addresses = await prisma.address.findMany({
      where: { user_id: 1 }, // สมมติ user_id เป็น 1 ไปก่อน
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST: บันทึกที่อยู่ใหม่จากฟอร์มลง DB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newAddress = await prisma.address.create({
      data: {
        user_id: 1, // เชื่อมกับ User ID 1
        firstname: body.firstname,
        lastname: body.lastname,
        addressLine: body.addressLine,
        apartment: body.apartment,
        city: body.city,
        province: body.province, // ค่าที่พิมพ์เองจากฟอร์ม
        postalCode: body.postalCode,
        country: body.country || "Thailand",
        phone: body.phone,
        isDefault: body.isDefault || false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}