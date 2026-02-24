import { requireAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const token = (await cookies()).get("access_token")?.value;
    const user = requireAuth(token, "USER");

    const { product_id, quantity, basePrice, size } = await req.json();

    const cart = await prisma.cart.upsert({
        where: { user_id: user.user_id },
        update: {},
        create: { user_id: user.user_id },
    });

    const exiting = await prisma.cartItem.findFirst({
        where: {
            cart_id: cart.cart_id,
            product_id,
        },
    });

    if (exiting) {
        const updated = await prisma.cartItem.update({
            where: { cartItem_id: exiting.cartItem_id},
            data: {
                quantity: exiting.quantity + (quantity ?? 1),
            },
        });

        return NextResponse.json({
            message: "Update amount",
            item: updated,
        });
    }

    const item = await prisma.cartItem.create({
        data: {
            cart_id: cart.cart_id,
            product_id,
            quantity: quantity ?? 1,
            price: basePrice,
            size: size,
        },
    })

    return NextResponse.json({
        message: "Added new item",
        item,
    })
}