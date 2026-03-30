import { describe, it, expect } from "vitest";

// ── Pure utility functions extracted from finance/page.tsx ─────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

function getTransactionTypeLabel(type: string): string {
  switch (type) {
    case "DEPOSIT":
      return "Deposit";
    case "TRANSFER_OUT":
      return "Transfer Out";
    case "TRANSFER_IN":
      return "Transfer In";
    default:
      return type;
  }
}

function getTransactionColor(type: string): string {
  switch (type) {
    case "DEPOSIT":
    case "TRANSFER_IN":
      return "text-green-600";
    case "TRANSFER_OUT":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

/** Mirror the client-side validation in handleDeposit */
function validateDepositInput(depositAmount: string): string | null {
  if (!depositAmount || Number(depositAmount) <= 0) {
    return "Please enter a valid amount";
  }
  return null;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats positive amount in THB", () => {
    const result = formatCurrency(1500);
    expect(result).toContain("1,500");
  });

  it("formats zero as THB 0", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });
});

describe("getTransactionTypeLabel", () => {
  it("returns 'Deposit' for DEPOSIT", () => {
    expect(getTransactionTypeLabel("DEPOSIT")).toBe("Deposit");
  });

  it("returns 'Transfer Out' for TRANSFER_OUT", () => {
    expect(getTransactionTypeLabel("TRANSFER_OUT")).toBe("Transfer Out");
  });

  it("returns 'Transfer In' for TRANSFER_IN", () => {
    expect(getTransactionTypeLabel("TRANSFER_IN")).toBe("Transfer In");
  });

  it("returns the raw type for unknown values", () => {
    expect(getTransactionTypeLabel("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("getTransactionColor", () => {
  it("returns green for DEPOSIT", () => {
    expect(getTransactionColor("DEPOSIT")).toBe("text-green-600");
  });

  it("returns green for TRANSFER_IN", () => {
    expect(getTransactionColor("TRANSFER_IN")).toBe("text-green-600");
  });

  it("returns red for TRANSFER_OUT", () => {
    expect(getTransactionColor("TRANSFER_OUT")).toBe("text-red-600");
  });
});

describe("validateDepositInput", () => {
  it("returns error message when input is empty", () => {
    expect(validateDepositInput("")).toBe("Please enter a valid amount");
  });

  it("returns error message when amount is 0", () => {
    expect(validateDepositInput("0")).toBe("Please enter a valid amount");
  });

  it("returns error message when amount is negative", () => {
    expect(validateDepositInput("-500")).toBe("Please enter a valid amount");
  });

  it("returns null when amount is valid", () => {
    expect(validateDepositInput("500")).toBeNull();
    expect(validateDepositInput("0.01")).toBeNull();
  });
});
