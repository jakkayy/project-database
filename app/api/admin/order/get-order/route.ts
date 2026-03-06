import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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

    // Get this shop's product IDs
    const shopStocks = await prisma.productStock.findMany({
      where: { shop_id: shop.shop_id },
      select: { product_id: true },
    });
    const shopProductIds = [...new Set(shopStocks.map((s) => s.product_id))];

    if (shopProductIds.length === 0) return NextResponse.json([]);

    // Orders that contain at least one item from this shop
    const orders = await prisma.order.findMany({
      where: { items: { some: { product_id: { in: shopProductIds } } } },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstname: true, lastname: true, email: true } },
        items: { select: { quantity: true } },
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
