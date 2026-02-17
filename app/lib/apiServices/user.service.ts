import { apiFetch } from "./client";

export function getAccount() {
    return apiFetch("/api/profile/get-account");
}

export function getAllProduct() {
    return apiFetch("/api/product/get-all-product");
}