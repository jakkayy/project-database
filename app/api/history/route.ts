import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectMongo } from "@/lib/mongodb";
import Product from "@/app/models/Product";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectMongo();

    // get token from cookie
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userAuth = requireAuth(token);

    // get user's orders with items
    const orders = await prisma.order.findMany({
      where: { user_id: userAuth.user_id },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json([]);
    }

    // get all product IDs from order items
    const productIds = orders.flatMap(order => 
      order.items.map(item => item.product_id)
    );

    // fetch products from MongoDB
    const products = await Product.find({
      _id: { $in: productIds },
    });

    // format order items with product details
    const orderHistory = orders.flatMap(order => 
      order.items.map(item => {
        const product = products.find(
          (p) => p._id.toString() === item.product_id
        );

        return {
          product_name: product ? product.name : 'Unknown Product',
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unit_price: Number(item.price),
          date_bought: order.createdAt,
          order_id: order.order_id,
          product_id: item.product_id,
          order_status: order.status
        };
      })
    );

    return NextResponse.json(orderHistory);

  } catch (error) {
    console.error('Error fetching order history:', error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}
