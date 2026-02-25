import jwt from "jsonwebtoken";

export type JwtPayload = {
    user_id: number;
    role: "USER" | "ADMIN";
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}