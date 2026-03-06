import { apiFetch } from "./client";

// --- Orders ---

export function getAdminOrders() {
  return apiFetch("/api/admin/order/get-order");
}

// --- Inventory & Products ---

export function getAdminInventory() {
  return apiFetch("/api/admin/inventory");
}

export function addProduct(data: {
  name: string;
  category: string;
  basePrice: string;
  image: string;
  tags: string;
  color: string;
  size: string;
  stock: string;
}) {
  return apiFetch("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStock(data: { variantId: number; newStock: number }) {
  return apiFetch("/api/admin/products", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
