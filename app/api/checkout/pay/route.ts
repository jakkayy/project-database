import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // get token from cookie
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userAuth = requireAuth(token);

    const { address_id } = await req.json();

    // start transaction
    await prisma.$transaction(async (tx) => {
      // find buyer, cart, and admin
      const buyer = await tx.user.findUnique({
        where: { user_id: userAuth.user_id },
      });
      const cart = await tx.cart.findFirst({
        where: { user_id: userAuth.user_id },
        include: { items: true },
      });
      const admin = await tx.user.findFirst({
        where: { role: "ADMIN" },
      });

      // validate buyer, cart, and admin
      if (!buyer || !cart || !admin) {
        throw new Error("Cart or buyer or Seller not found");
      }
      else if (cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // find total cost
      const total = cart.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      // decrement productStock
      for (const item of cart.items) {
        const result = await tx.productStock.updateMany({
            where: {
            product_id: item.product_id,
            color: item.color,
            size: item.size,
            stock: { gte: item.quantity },
            },
            data: {
            stock: { decrement: item.quantity },
            },
      });
        if (result.count === 0) {
            throw {
                code: "INSUFFICIENT_STOCK",
                product_id: item.product_id,
                size: item.size,
                color: item.color,
                message: "One or more items are out of stock",
            };
        }
      }

      // update balances
      const buyerUpdateResult = await tx.user.updateMany({
        where: { 
          user_id: buyer.user_id,
          balance: { gte: total }
        },
        data: {
          balance: {
            decrement: total,
          },
        },
      });
      if (buyerUpdateResult.count === 0) {
        throw {
          code: "INSUFFICIENT_BALANCE",
          message: "Balance is not enough",
        };
      }
      await tx.user.update({
        where: { user_id: admin.user_id },
        data: {
            balance: { increment: total },
        },
      });
  
      // insert new transactions
      await tx.transaction.create({
        data: {
            user_id: buyer.user_id,
            amount: total,
            type: "TRANSFER_OUT",
        },
      });
      await tx.transaction.create({
        data: {
            user_id: admin.user_id,
            amount: total,
            type: "TRANSFER_IN",
        },
      });

      // insert new order
      const order = await tx.order.create({
        data: {
            user_id: buyer.user_id,
            address_id: address_id,
            total: total,
            status: "PENDING",
        },
      });

      // insert new orderItem
      await tx.orderItem.createMany({
        data: cart.items.map((item) => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
        })),
      });

      // clear products in cart
      await tx.cartItem.deleteMany({
        where: { cart_id: cart.cart_id },
      });

      return true;
    });
    return NextResponse.json({ success: true });

    } catch (error: any) {
        if (error.code === "INSUFFICIENT_BALANCE") {
            return NextResponse.json(
            {
                code: error.code,
                message: error.message,
            },
            { status: 400 }
            );
        }

        if (error.code === "INSUFFICIENT_STOCK") {
            return NextResponse.json(
            {
                code: error.code,
                product_id: error.product_id,
                size: error.size,
                color: error.color,
                message: error.message,
            },
            { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Payment failed" },
            { status: 400 }
        );
        }
}