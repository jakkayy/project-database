import { describe, it, expect } from "vitest";

// ── Types ──────────────────────────────────────────────────────────────────

type Product = {
  _id: string;
  name: string;
  category: string;
};

// ── Pure filter functions (mirrors NewArrivals and search route logic) ──────

function filterByCategory(products: Product[], category: string): Product[] {
  if (category === "ALL") return products;
  return products.filter(
    (p) => p.category?.toUpperCase() === category.toUpperCase()
  );
}

function filterInStock(
  products: Product[],
  inStockIds: Set<string>
): Product[] {
  return products.filter((p) => inStockIds.has(p._id));
}

// ── Test data ──────────────────────────────────────────────────────────────

const products: Product[] = [
  { _id: "1", name: "Nike Shoe", category: "SHOES" },
  { _id: "2", name: "Adidas Shirt", category: "CLOTHES" },
  { _id: "3", name: "Cap", category: "ACCESSORIES" },
  { _id: "4", name: "Jordan Shoe", category: "SHOES" },
];

// ── Tests ──────────────────────────────────────────────────────────────────

describe("filterByCategory", () => {
  it("returns all products when category is ALL", () => {
    const result = filterByCategory(products, "ALL");
    expect(result).toHaveLength(4);
  });

  it("filters to only SHOES", () => {
    const result = filterByCategory(products, "SHOES");
    expect(result).toHaveLength(2);
    result.forEach((p) => expect(p.category).toBe("SHOES"));
  });

  it("filters to only CLOTHES", () => {
    const result = filterByCategory(products, "CLOTHES");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Adidas Shirt");
  });

  it("returns empty array when no product matches category", () => {
    const result = filterByCategory(products, "OTHER");
    expect(result).toHaveLength(0);
  });
});

describe("filterInStock (search route logic)", () => {
  it("excludes products with no in-stock variants", () => {
    const inStockIds = new Set(["1", "3"]); // only Shoe and Cap have stock
    const result = filterInStock(products, inStockIds);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p._id)).toEqual(["1", "3"]);
  });

  it("returns empty array when nothing is in stock", () => {
    const result = filterInStock(products, new Set());
    expect(result).toHaveLength(0);
  });

  it("returns all products when all are in stock", () => {
    const allIds = new Set(products.map((p) => p._id));
    const result = filterInStock(products, allIds);
    expect(result).toHaveLength(4);
  });
});
