import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstname: true, lastname: true, email: true },
        },
        items: {
          select: { quantity: true },
        },
      },
    });

    const result = orders.map((order) => ({
      order_id: order.order_id,
      createdAt: order.createdAt,
      customerName: `${order.user.firstname} ${order.user.lastname}`,
      customerEmail: order.user.email,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total: Number(order.total),
      status: order.status,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/admin/order/get-order error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
