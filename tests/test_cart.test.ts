import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";

// ── Pure cart logic (mirrors add-cart route behaviour) ─────────────────────

type CartItem = {
  cartItem_id: number;
  cart_id: number;
  product_id: string;
  quantity: number;
  price: Prisma.Decimal;
  size: string;
  color: string;
};

/** Simulate "add to cart" — returns updated cart items list */
function addToCart(
  items: CartItem[],
  newItem: Omit<CartItem, "cartItem_id" | "cart_id">,
  nextId = 99
): CartItem[] {
  const existing = items.find(
    (i) =>
      i.product_id === newItem.product_id &&
      i.size === newItem.size &&
      i.color === newItem.color
  );

  if (existing) {
    return items.map((i) =>
      i.cartItem_id === existing.cartItem_id
        ? { ...i, quantity: i.quantity + newItem.quantity }
        : i
    );
  }

  return [...items, { ...newItem, cartItem_id: nextId, cart_id: 1 }];
}

/** Compute total from cart items */
function cartTotal(items: Pick<CartItem, "price" | "quantity">[]): number {
  return items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────

const base: CartItem = {
  cartItem_id: 1,
  cart_id: 1,
  product_id: "product_abc",
  quantity: 2,
  price: new Prisma.Decimal(500),
  size: "M",
  color: "Black",
};

describe("addToCart — duplicate item", () => {
  it("increments quantity instead of creating a new row", () => {
    const result = addToCart([base], {
      product_id: "product_abc",
      quantity: 3,
      price: new Prisma.Decimal(500),
      size: "M",
      color: "Black",
    });

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5); // 2 + 3
  });

  it("creates a new row when color differs", () => {
    const result = addToCart([base], {
      product_id: "product_abc",
      quantity: 1,
      price: new Prisma.Decimal(500),
      size: "M",
      color: "White", // different color
    });

    expect(result).toHaveLength(2);
  });

  it("creates a new row when size differs", () => {
    const result = addToCart([base], {
      product_id: "product_abc",
      quantity: 1,
      price: new Prisma.Decimal(500),
      size: "L", // different size
      color: "Black",
    });

    expect(result).toHaveLength(2);
  });
});

describe("cartTotal", () => {
  it("calculates total correctly for multiple items", () => {
    const items = [
      { price: new Prisma.Decimal(500), quantity: 2 }, // 1000
      { price: new Prisma.Decimal(300), quantity: 1 }, // 300
    ];
    expect(cartTotal(items)).toBe(1300);
  });

  it("returns 0 for empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });
});
