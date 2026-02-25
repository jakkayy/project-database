import jwt from "jsonwebtoken";
import { HttpError } from "./error";

type JwtPayload = {
    user_id: number,
    role: "USER" | "ADMIN";
}

export function requireAuth(token: any, requiredRole?: JwtPayload['role']): JwtPayload {
    if (!token) {
        throw new HttpError("Unauthorized", 401);
    }

    let payload: any;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
        throw new HttpError("Invalid token", 401);
    }

    if (requiredRole && payload.role !== requiredRole) {
        throw new HttpError("Forbidden", 403);
    }

    return payload;
}