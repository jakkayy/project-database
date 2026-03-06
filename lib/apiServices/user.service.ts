import { apiFetch } from "./client";

// --- Profile ---

export function getProfile() {
  return apiFetch("/api/auth/profile");
}

export function getAccount() {
  return apiFetch("/api/profile/get-account");
}

export function getCurrentUser() {
  return apiFetch("/api/user/me");
}

// --- Products ---

export function getAllProduct() {
  return apiFetch("/api/product/get-all-product");
}

export function getProductBySlug(slug: string) {
  return apiFetch(`/api/product/get-by-slug?slug=${encodeURIComponent(slug)}`);
}

export function searchProducts(query: string) {
  return apiFetch(`/api/product/search?q=${encodeURIComponent(query)}`);
}

export function getStock(data: {
  product_id: string;
  color: string;
  size: string;
}) {
  return apiFetch("/api/product/get-stock", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function addReview(data: {
  productId: string;
  rating: number;
  comment: string;
}) {
  return apiFetch("/api/product/add-review", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteReview(data: {
  productId: string;
  reviewId: string;
}) {
  return apiFetch("/api/product/delete-review", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
}

// --- Cart ---

export function getCart() {
  return apiFetch("/api/cart/get-cart");
}

export function addCart(data: {
  product_id: string;
  quantity: number;
  basePrice: number;
  size: string;
  color: string;
}) {
  return apiFetch("/api/cart/add-cart", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteCart(cartItem_id: number) {
  return apiFetch(`/api/cart/delete-cart?cartItem_id=${cartItem_id}`, {
    method: "DELETE",
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

// --- Favorites ---

export function getFav() {
  return apiFetch("/api/favorite");
}

export function addFav(data: { product_id: string }) {
  return apiFetch("/api/favorite/add-fav", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteFav(favItem_id: number) {
  return apiFetch("/api/favorite/delete-fav", {
    method: "DELETE",
    body: JSON.stringify({ favItem_id }),
  });
}
