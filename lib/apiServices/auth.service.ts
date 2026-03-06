import { apiFetch } from "./client";

export function register(data: {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role?: string,
    shopName?: string,
    description?: string,
    shopImage?: string,
}) {
    return apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function login(data: {
    email: string,
    password: string
}) {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function logout() {
    return apiFetch("/api/auth/logout", {
        method: "POST",
    });
}