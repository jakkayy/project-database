import { signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { firstname, lastname, email, password} = await req.json();

    const checkEmail = await prisma.user.findUnique({
        where: { email: email },
    })

    if (checkEmail) {
        return NextResponse.json(
            { error: "email has been used"},
            { status: 400 }
        );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPassword,
        },
        select: {
            user_id: true,
            role: true,
        }
    });

    const token = signToken({
        id: user.user_id,
        role: user.role,
    });
    
    (await cookies()).set("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    })

    return NextResponse.json({
        user: { user_id: user.user_id, role: user.role }
    });
}