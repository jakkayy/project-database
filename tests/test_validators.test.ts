import { describe, it, expect } from "vitest";

// ── Validators (pure functions matching API route checks) ──────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidDepositAmount(amount: unknown): boolean {
  return typeof amount === "number" && amount > 0;
}

type AddressInput = {
  firstname?: string;
  lastname?: string;
  addressLine?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
};

function isValidAddress(addr: AddressInput): boolean {
  const required: (keyof AddressInput)[] = [
    "firstname",
    "lastname",
    "addressLine",
    "city",
    "province",
    "postalCode",
    "phone",
  ];
  return required.every((key) => Boolean(addr[key]?.trim()));
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("rejects email missing @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects email missing domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidDepositAmount", () => {
  it("accepts positive number", () => {
    expect(isValidDepositAmount(500)).toBe(true);
  });

  it("rejects 0", () => {
    expect(isValidDepositAmount(0)).toBe(false);
  });

  it("rejects negative number", () => {
    expect(isValidDepositAmount(-100)).toBe(false);
  });

  it("rejects non-number type", () => {
    expect(isValidDepositAmount("500")).toBe(false);
    expect(isValidDepositAmount(null)).toBe(false);
  });
});

describe("isValidAddress", () => {
  const valid: AddressInput = {
    firstname: "John",
    lastname: "Doe",
    addressLine: "123 Main St",
    city: "Bangkok",
    province: "Bangkok",
    postalCode: "10110",
    phone: "0812345678",
  };

  it("accepts a complete address", () => {
    expect(isValidAddress(valid)).toBe(true);
  });

  it("rejects when a required field is missing", () => {
    const { phone, ...noPhone } = valid;
    expect(isValidAddress(noPhone)).toBe(false);
  });

  it("rejects when a field is an empty string", () => {
    expect(isValidAddress({ ...valid, city: "" })).toBe(false);
  });
});
