import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

const adminAllowedRoutes = [
    "/admin/dashboard",
    "/admin/product",
    "/admin/order",
];

export function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded: any = verifyToken(token);

        if (decoded.role === "ADMIN" && pathname === "/") {
            return NextResponse.redirect(
                new URL("/admin/dashboard", req.url)
            );
        }

        if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
        }

        if (decoded.role === "ADMIN" && pathname.startsWith("/admin") && !adminAllowedRoutes.includes(pathname)) {
            return NextResponse.redirect(
                new URL("/admin/dashboard", req.url)
            );
        }

        return NextResponse.next();

    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/"],
};