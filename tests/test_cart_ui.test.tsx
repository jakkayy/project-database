import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CartSummary from "../app/components/CartSummary";

const mockItems = [
  { product: { name: "Nike Shoe", basePrice: 2500 }, quantity: 1 },
  { product: { name: "Adidas Shirt", basePrice: 800 }, quantity: 2 },
];

describe("CartSummary — total display", () => {
  it("renders the total passed as prop", () => {
    render(
      <CartSummary total="฿3,100.00" items={mockItems} selectedCount={2} />
    );
    expect(screen.getByText("฿3,100.00")).toBeInTheDocument();
  });

  it("renders product names in the summary", () => {
    render(
      <CartSummary total="฿3,100.00" items={mockItems} selectedCount={2} />
    );
    expect(screen.getByText(/Nike Shoe/)).toBeInTheDocument();
    expect(screen.getByText(/Adidas Shirt/)).toBeInTheDocument();
  });
});

describe("CartSummary — checkout button state", () => {
  it("disables checkout button when selectedCount is 0", () => {
    render(<CartSummary total="฿0.00" selectedCount={0} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("Select items first");
  });

  it("enables checkout button when selectedCount > 0", () => {
    render(<CartSummary total="฿3,100.00" selectedCount={2} />);
    const btn = screen.getByRole("button");
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveTextContent("Checkout (2)");
  });
});
