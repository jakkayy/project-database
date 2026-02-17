import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ cartItem_id: string }> }
) {
  const { cartItem_id } = await context.params; 

  const id = Number(cartItem_id);
  const { action } = await req.json();

  const existing = await prisma.cartItem.findUnique({
    where: { cartItem_id: id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Cart item not found" },
      { status: 404 }
    );
  }

  const unitPrice = Number(existing.price) / existing.quantity;

  if (action === "increase") {
    const updated = await prisma.cartItem.update({
      where: { cartItem_id: id },
      data: {
        quantity: { increment: 1 },
        price: { increment: unitPrice },
      },
    });

    return NextResponse.json(updated);
  }

  if (action === "decrease") {
    if (existing.quantity === 1) {
      await prisma.cartItem.delete({
        where: { cartItem_id: id },
      });

      return NextResponse.json({ removed: true });
    }

    const updated = await prisma.cartItem.update({
      where: { cartItem_id: id },
      data: {
        quantity: { decrement: 1 },
        price: { decrement: unitPrice },
      },
    });

    return NextResponse.json(updated);
  }

  return NextResponse.json(
    { error: "Invalid action" },
    { status: 400 }
  );
}
