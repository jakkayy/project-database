import { apiFetch } from "./client";

export function getAccount() {
    return apiFetch("/api/profile/get-account");
}

export function getAllProduct() {
    return apiFetch("/api/product/get-all-product");
}

export function addCart(data: { 
    product_id: string, 
    quantity: number,
    basePrice: number,
    size: string,
}) {
    return apiFetch("/api/cart/add-cart", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getCart() {
    return apiFetch("/api/cart/get-cart");
}

export function deleteCart(cartItem_id: number) {
    return apiFetch(`/api/cart/delete-cart?cartItem_id=${cartItem_id}`, {
        method: "DELETE",
    });
}

export function increaseCart(cartItem_id: number) {
    return apiFetch(`/api/cart/${cartItem_id}?action=increase`, {
        method: "PATCH",
    });
}

export function decreaseCart(cartItem_id: number) {
    return apiFetch(`/api/cart/${cartItem_id}?action=decrease`, {
        method: "PATCH",
    });
}

export function updateCartItem(
    cartItem_id: number,
    action: "increase" | "decrease"
) {
    return apiFetch(`/api/cart/${cartItem_id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
    });
}

export function addFav(data: {
    product_id: string,
}) {
    return apiFetch("/api/favorite/add-fav", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getStock(data: {
    product_id: string,
    color: string,
    size: string,
}) {
    return apiFetch("/api/product/get-stock", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

