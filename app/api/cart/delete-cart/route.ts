import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const cartItem_id = Number(searchParams.get("cartItem_id"));

  if (!cartItem_id) {
    return NextResponse.json(
      { error: "cartItem_id is required" },
      { status: 400 }
    );
  }

  await prisma.cartItem.delete({
    where: { cartItem_id },
  });

  return NextResponse.json({ message: "Item removed" });
}

