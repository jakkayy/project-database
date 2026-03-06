import { signToken } from "lib/jwt";
import { prisma } from "lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    const contentType = req.headers.get("content-type") ?? "";

    let firstname = "", lastname = "", email = "", password = "", role = "";
    let shopName = "", description = "";
    let imageFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
        const form = await req.formData();
        firstname = form.get("firstname") as string ?? "";
        lastname = form.get("lastname") as string ?? "";
        shopName = form.get("shopName") as string ?? "";
        description = form.get("description") as string ?? "";
        email = form.get("email") as string ?? "";
        password = form.get("password") as string ?? "";
        role = form.get("role") as string ?? "";
        const img = form.get("image");
        if (img instanceof File && img.size > 0) imageFile = img;
    } else {
        const body = await req.json();
        firstname = body.firstname;
        lastname = body.lastname;
        email = body.email;
        password = body.password;
        role = body.role ?? "";
    }

    const checkEmail = await prisma.user.findUnique({
        where: { email },
    });

    if (checkEmail) {
        return NextResponse.json(
            { error: "email has been used" },
            { status: 400 }
        );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const assignedRole: Role = role === "ADMIN" ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
        data: {
            firstname,
            lastname,
            email,
            password: hashPassword,
            role: assignedRole,
        },
        select: {
            user_id: true,
            role: true,
        }
    });

    if (assignedRole === Role.ADMIN) {
        let imagePath: string | null = null;

        if (imageFile) {
            const ext = imageFile.name.split(".").pop() ?? "jpg";
            const dir = path.join(process.cwd(), "public", "shops");
            await mkdir(dir, { recursive: true });
            const filename = `${user.user_id}.${ext}`;
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            await writeFile(path.join(dir, filename), buffer);
            imagePath = `/shops/${filename}`;
        }

        await prisma.shop.create({
            data: {
                user_id: user.user_id,
                name: shopName,
                description: description || null,
                image: imagePath,
            },
        });
    }

    const token = signToken({
        user_id: user.user_id,
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