import type { OrderItem } from "@workspace/db";

export type GstBreakdown = {
  taxableAmount: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalTax: string;
};

/**
 * Calculate GST breakdown for a set of order items.
 * - Intra-state (Tamil Nadu): split equally into CGST + SGST.
 * - Inter-state: single IGST line.
 *
 * Prices in `items` are GST-inclusive; we back-calculate taxable amount.
 */
export function calculateGst(items: OrderItem[], buyerState = "Tamil Nadu"): GstBreakdown {
  let totalTaxableAmount = 0;
  let totalTax = 0;

  for (const item of items) {
    const price = parseFloat(item.price);
    const gstRate = parseFloat(item.gstRate) / 100;
    const taxableAmount = (price * item.quantity) / (1 + gstRate);
    const tax = price * item.quantity - taxableAmount;
    totalTaxableAmount += taxableAmount;
    totalTax += tax;
  }

  const isInterState = buyerState.trim().toLowerCase() !== "tamil nadu";
  return {
    taxableAmount: totalTaxableAmount.toFixed(2),
    cgst: isInterState ? "0.00" : (totalTax / 2).toFixed(2),
    sgst: isInterState ? "0.00" : (totalTax / 2).toFixed(2),
    igst: isInterState ? totalTax.toFixed(2) : "0.00",
    totalTax: totalTax.toFixed(2),
  };
}
