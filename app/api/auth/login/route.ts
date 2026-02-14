import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signToken } from "@/app/lib/jwt";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password} = await req.json();

    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return Response.json(
            { error: "user not found" }, 
            { status: 400 }
        );
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return Response.json(
            { error: "invalid password" }, 
            { status: 400 }
        );
    }

    const token = signToken({
        id: user.id,
        role: user.role,
    });

    (await cookies()).set("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
    });

    return NextResponse.json({
        user: { user_id: user.id, role: user.role }
    });
}