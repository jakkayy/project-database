import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth } from "lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = await requireAuth(token);

    return NextResponse.json({
      _id: decoded.user_id,
    });

  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}