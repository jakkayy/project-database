import jwt from "jsonwebtoken";

type JwtPayload = {
    user_id: number,
    role: "USER" | "ADMIN";
}

export function requireAuth(token: any, requiredRole?: JwtPayload['role']): JwtPayload {
    if (!token) throw new Error("Unauthorized");

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (requiredRole && payload.role !== requiredRole) {
        throw new Error("Forbidden")
    }

    return payload;
}