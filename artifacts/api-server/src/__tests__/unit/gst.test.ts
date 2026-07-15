/**
 * Unit tests for GST calculation logic.
 * Pure function — no DB, no HTTP, no mocking needed.
 */
import { describe, it, expect } from "vitest";
import { calculateGst } from "../../lib/gst.js";
import type { OrderItem } from "@workspace/db";

// Helper: build a minimal OrderItem
function item(price: string, qty: number, gstRate: string): OrderItem {
  return { productId: 1, name: "Test", price, quantity: qty, gstRate };
}

describe("calculateGst", () => {
  describe("intra-state (Tamil Nadu) — CGST + SGST", () => {
    it("splits tax 50/50 into CGST and SGST", () => {
      // ₹105 incl. 5% GST → taxable = 100, tax = 5
      const result = calculateGst([item("105.00", 1, "5.00")], "Tamil Nadu");
      expect(result.igst).toBe("0.00");
      expect(result.cgst).toBe(result.sgst);
      expect(result.totalTax).toBe(result.cgst === "0.00" ? "0.00" :
        (parseFloat(result.cgst) * 2).toFixed(2));
    });

    it("correctly backs out 5% GST from inclusive price", () => {
      // ₹105 / 1.05 = ₹100 taxable; tax = ₹5
      const result = calculateGst([item("105.00", 1, "5.00")], "Tamil Nadu");
      expect(result.taxableAmount).toBe("100.00");
      expect(result.totalTax).toBe("5.00");
      expect(result.cgst).toBe("2.50");
      expect(result.sgst).toBe("2.50");
      expect(result.igst).toBe("0.00");
    });

    it("correctly backs out 12% GST from inclusive price", () => {
      // ₹112 / 1.12 = ₹100 taxable; tax = ₹12
      const result = calculateGst([item("112.00", 1, "12.00")], "Tamil Nadu");
      expect(result.taxableAmount).toBe("100.00");
      expect(result.totalTax).toBe("12.00");
      expect(result.cgst).toBe("6.00");
      expect(result.sgst).toBe("6.00");
    });

    it("handles multiple items with different GST rates", () => {
      // Tea 5%: ₹105 → tax ₹5  |  Snacks 12%: ₹112 → tax ₹12  |  total tax ₹17
      const result = calculateGst(
        [item("105.00", 1, "5.00"), item("112.00", 1, "12.00")],
        "Tamil Nadu",
      );
      expect(parseFloat(result.totalTax)).toBeCloseTo(17, 1);
      expect(result.igst).toBe("0.00");
    });

    it("multiplies price by quantity before calculating tax", () => {
      // 3 × ₹105 = ₹315 incl. 5% → taxable ₹300, tax ₹15
      const result = calculateGst([item("105.00", 3, "5.00")], "Tamil Nadu");
      expect(result.taxableAmount).toBe("300.00");
      expect(result.totalTax).toBe("15.00");
    });

    it("defaults to Tamil Nadu when state is omitted", () => {
      const result = calculateGst([item("105.00", 1, "5.00")]);
      expect(result.cgst).not.toBe("0.00");
      expect(result.igst).toBe("0.00");
    });

    it("is case-insensitive for state name", () => {
      const result = calculateGst([item("105.00", 1, "5.00")], "TAMIL NADU");
      expect(result.igst).toBe("0.00");
    });
  });

  describe("inter-state — IGST only", () => {
    it("puts all tax into IGST for non-TN state", () => {
      const result = calculateGst([item("105.00", 1, "5.00")], "Karnataka");
      expect(result.cgst).toBe("0.00");
      expect(result.sgst).toBe("0.00");
      expect(result.igst).toBe("5.00");
      expect(result.totalTax).toBe("5.00");
    });

    it("handles inter-state with 12% rate", () => {
      const result = calculateGst([item("112.00", 1, "12.00")], "Maharashtra");
      expect(result.igst).toBe("12.00");
      expect(result.cgst).toBe("0.00");
    });
  });

  describe("edge cases", () => {
    it("returns all zeros for empty items array", () => {
      const result = calculateGst([], "Tamil Nadu");
      expect(result.taxableAmount).toBe("0.00");
      expect(result.totalTax).toBe("0.00");
      expect(result.cgst).toBe("0.00");
      expect(result.sgst).toBe("0.00");
      expect(result.igst).toBe("0.00");
    });

    it("handles zero GST rate (exempt items)", () => {
      const result = calculateGst([item("100.00", 1, "0.00")], "Tamil Nadu");
      expect(result.totalTax).toBe("0.00");
      expect(result.taxableAmount).toBe("100.00");
    });
  });
});
