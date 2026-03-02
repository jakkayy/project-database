import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// 1. GET: ดึงรายการที่อยู่ทั้งหมดจากฐานข้อมูล
export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");

    const addresses = await prisma.address.findMany({
      where: { user_id: user.user_id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("GET address error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// 2. POST: บันทึกที่อยู่ใหม่ที่กรอกจากฟอร์มลงฐานข้อมูล
export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");

    const body = await request.json();

    const newAddress = await prisma.address.create({
      data: {
        user_id: user.user_id,
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
    console.error("POST address error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// 3. DELETE: ลบที่อยู่ออกตาม ID ที่ส่งมา (ส่วนที่เพิ่มใหม่)
export async function DELETE(request: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    await prisma.address.deleteMany({
      where: {
        address_id: parseInt(addressId),
        user_id: user.user_id,
      },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("DELETE address error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}