import { prisma } from "lib/prisma";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userAuth = requireAuth(token);

    const user = await prisma.user.findUnique({
      where: { user_id: userAuth.user_id },
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
