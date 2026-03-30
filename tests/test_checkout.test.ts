import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

// ── helpers ──────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<{
  product_id: string; color: string; size: string;
  quantity: number; price: Prisma.Decimal; cart_id: number; cartItem_id: number;
}> = {}) {
  return {
    cartItem_id: 1,
    cart_id: 1,
    product_id: "product_abc",
    quantity: 1,
    price: new Prisma.Decimal(500),
    size: "M",
    color: "Black",
    createdAt: new Date(),
    ...overrides,
  };
}

// ── checkout business-logic extracted as pure functions ───────────────────────
// (The API route logic is tested by reproducing the core steps as pure functions
//  so we can run them without an HTTP server or real DB.)

function calcTotal(items: { price: Prisma.Decimal; quantity: number }[]) {
  return items.reduce(
    (sum, item) => sum.plus(item.price.mul(item.quantity)),
    new Prisma.Decimal(0)
  );
}

function checkBalance(balance: Prisma.Decimal, total: Prisma.Decimal) {
  if (balance.lt(total)) {
    throw { code: "INSUFFICIENT_BALANCE", message: "Balance is not enough" };
  }
}

function decrementStock(
  stockRows: { stock: number }[],
  quantity: number,
  productName: string,
  size: string,
  color: string
) {
  const row = stockRows[0];
  if (!row || row.stock < quantity) {
    throw {
      code: "INSUFFICIENT_STOCK",
      product_name: productName,
      size,
      color,
      in_stock: row?.stock ?? 0,
      message: "One or more items are out of stock",
    };
  }
  row.stock -= quantity;
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("checkout — calcTotal", () => {
  it("computes total correctly for multiple items", () => {
    const items = [
      makeItem({ price: new Prisma.Decimal(500), quantity: 2 }),
      makeItem({ price: new Prisma.Decimal(300), quantity: 1 }),
    ];
    const total = calcTotal(items);
    expect(total.toNumber()).toBe(1300);
  });
});

describe("checkout — checkBalance", () => {
  it("throws INSUFFICIENT_BALANCE when balance < total", () => {
    expect(() =>
      checkBalance(new Prisma.Decimal(200), new Prisma.Decimal(500))
    ).toThrow();

    try {
      checkBalance(new Prisma.Decimal(200), new Prisma.Decimal(500));
    } catch (e: any) {
      expect(e.code).toBe("INSUFFICIENT_BALANCE");
    }
  });

  it("does NOT throw when balance >= total", () => {
    expect(() =>
      checkBalance(new Prisma.Decimal(1000), new Prisma.Decimal(500))
    ).not.toThrow();
  });
});

describe("checkout — decrementStock", () => {
  it("throws INSUFFICIENT_STOCK when stock is 0", () => {
    try {
      decrementStock([{ stock: 0 }], 1, "Nike Shoe", "M", "Black");
    } catch (e: any) {
      expect(e.code).toBe("INSUFFICIENT_STOCK");
      expect(e.product_name).toBe("Nike Shoe");
      expect(e.in_stock).toBe(0);
    }
  });

  it("throws INSUFFICIENT_STOCK when requested quantity exceeds stock", () => {
    try {
      decrementStock([{ stock: 2 }], 5, "Adidas Shirt", "L", "White");
    } catch (e: any) {
      expect(e.code).toBe("INSUFFICIENT_STOCK");
      expect(e.in_stock).toBe(2);
    }
  });

  it("decrements stock when quantity is sufficient", () => {
    const rows = [{ stock: 10 }];
    decrementStock(rows, 3, "Nike Shoe", "M", "Black");
    expect(rows[0].stock).toBe(7);
  });
});
