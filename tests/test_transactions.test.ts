import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";

// ── Types ──────────────────────────────────────────────────────────────────

type TransactionType = "DEPOSIT" | "TRANSFER_OUT" | "TRANSFER_IN";

interface Transaction {
  user_id: number;
  type: TransactionType;
  amount: Prisma.Decimal;
}

interface UserBalance {
  user_id: number;
  balance: Prisma.Decimal;
}

// ── Pure functions mirroring route logic ───────────────────────────────────

function applyDeposit(
  user: UserBalance,
  amount: number
): { user: UserBalance; tx: Transaction } {
  if (amount <= 0) throw new Error("Invalid amount");

  return {
    user: { ...user, balance: user.balance.plus(amount) },
    tx: { user_id: user.user_id, type: "DEPOSIT", amount: new Prisma.Decimal(amount) },
  };
}

function applyCheckoutTransactions(
  buyerId: number,
  sellerIds: { user_id: number; amount: Prisma.Decimal }[],
  total: Prisma.Decimal
): Transaction[] {
  const txs: Transaction[] = [
    { user_id: buyerId, type: "TRANSFER_OUT", amount: total },
  ];

  for (const seller of sellerIds) {
    txs.push({ user_id: seller.user_id, type: "TRANSFER_IN", amount: seller.amount });
  }

  return txs;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("applyDeposit", () => {
  it("creates a DEPOSIT transaction and increases balance", () => {
    const user: UserBalance = { user_id: 1, balance: new Prisma.Decimal(1000) };
    const { user: updated, tx } = applyDeposit(user, 500);

    expect(updated.balance.toNumber()).toBe(1500);
    expect(tx.type).toBe("DEPOSIT");
    expect(tx.amount.toNumber()).toBe(500);
  });

  it("throws when amount is 0 or negative", () => {
    const user: UserBalance = { user_id: 1, balance: new Prisma.Decimal(1000) };
    expect(() => applyDeposit(user, 0)).toThrow("Invalid amount");
    expect(() => applyDeposit(user, -100)).toThrow("Invalid amount");
  });
});

describe("applyCheckoutTransactions", () => {
  it("creates TRANSFER_OUT for buyer and TRANSFER_IN for each seller", () => {
    const total = new Prisma.Decimal(800);
    const sellers = [
      { user_id: 10, amount: new Prisma.Decimal(500) },
      { user_id: 11, amount: new Prisma.Decimal(300) },
    ];

    const txs = applyCheckoutTransactions(2, sellers, total);

    expect(txs).toHaveLength(3);
    expect(txs[0]).toMatchObject({ user_id: 2, type: "TRANSFER_OUT" });
    expect(txs[1]).toMatchObject({ user_id: 10, type: "TRANSFER_IN" });
    expect(txs[2]).toMatchObject({ user_id: 11, type: "TRANSFER_IN" });
  });

  it("seller TRANSFER_IN amounts sum up to buyer TRANSFER_OUT total", () => {
    const total = new Prisma.Decimal(1000);
    const sellers = [
      { user_id: 10, amount: new Prisma.Decimal(600) },
      { user_id: 11, amount: new Prisma.Decimal(400) },
    ];

    const txs = applyCheckoutTransactions(2, sellers, total);
    const sellerTotal = txs
      .filter((t) => t.type === "TRANSFER_IN")
      .reduce((sum, t) => sum.plus(t.amount), new Prisma.Decimal(0));

    expect(sellerTotal.toNumber()).toBe(total.toNumber());
  });
});
