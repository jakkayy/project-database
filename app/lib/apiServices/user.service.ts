import { apiFetch } from "./client";

export function getAccount() {
    return apiFetch("/api/profile/get-account");
}