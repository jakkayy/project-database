import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. GET: ดึงรายการที่อยู่ทั้งหมดจากฐานข้อมูล
export async function GET() {
  try {
    const addresses = await prisma.address.findMany({
      where: { user_id: 1 }, // สมมติ user_id เป็น 1
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// 2. POST: บันทึกที่อยู่ใหม่ที่กรอกจากฟอร์มลงฐานข้อมูล
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAddress = await prisma.address.create({
      data: {
        user_id: 1,
        firstname: body.firstname,
        lastname: body.lastname,
        addressLine: body.addressLine,
        apartment: body.apartment,
        city: body.city,
        province: body.province,
        postalCode: body.postalCode,
        country: body.country || "Thailand",
        phone: body.phone,
        isDefault: body.isDefault || false,
      },
    });
    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}

// 3. DELETE: ลบที่อยู่ออกตาม ID ที่ส่งมา (ส่วนที่เพิ่มใหม่)
export async function DELETE(request: Request) {
  try {
    // ดึงค่า addressId จาก URL เช่น /api/address?addressId=123
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    await prisma.address.delete({
      where: {
        address_id: parseInt(addressId),
      },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}