import { Router } from "express";
import { db, ordersTable, productsTable, cartItemsTable, couponsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import type { OrderItem, ShippingAddress, GstDetails } from "@workspace/db";
import { calculateGst } from "../lib/gst.js";

const router = Router();

// Generate order number: CNS-YYYYMMDD-XXXXX
async function generateOrderNumber(): Promise<string> {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `CNS-${date}-${suffix}`;
}

// POST /api/orders  — place order
router.post("/", async (req, res) => {
  try {
    const { shippingAddress, couponCode, gstin, companyName, notes, guestEmail } = req.body as {
      shippingAddress: ShippingAddress;
      couponCode?: string;
      gstin?: string;
      companyName?: string;
      notes?: string;
      guestEmail?: string;
    };

    const userId = req.session?.userId ?? null;
    if (!userId && !guestEmail) {
      return res.status(400).json({ error: "Guest email is required for guest checkout." });
    }
    if (!shippingAddress?.name || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.pincode) {
      return res.status(400).json({ error: "Incomplete shipping address." });
    }

    // Load cart
    const sessionId = req.session.id;
    const cartItems = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // Build order items from current product prices
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const ci of cartItems) {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, ci.productId)).limit(1);
      if (!product || !product.active) {
        return res.status(400).json({ error: `Product ${ci.productId} is unavailable.` });
      }
      if (product.stock < ci.quantity) {
        return res.status(400).json({ error: `Only ${product.stock} units of "${product.name}" available.` });
      }
      const lineTotal = parseFloat(product.price) * ci.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: ci.quantity,
        gstRate: product.gstRate,
        image: (product.images as string[])[0] ?? undefined,
      });
    }

    // Apply coupon
    let discountAmount = 0;
    let appliedCoupon: string | undefined;
    if (couponCode) {
      const [coupon] = await db.select().from(couponsTable)
        .where(and(eq(couponsTable.code, couponCode.toUpperCase()), eq(couponsTable.active, true)))
        .limit(1);

      if (!coupon) return res.status(400).json({ error: "Invalid or expired coupon." });
      if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ error: "Coupon has expired." });
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: "Coupon usage limit reached." });
      if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
        return res.status(400).json({ error: `Minimum order ₹${coupon.minOrderAmount} required for this coupon.` });
      }

      discountAmount = coupon.type === "percent"
        ? (subtotal * parseFloat(coupon.value)) / 100
        : Math.min(parseFloat(coupon.value), subtotal);
      appliedCoupon = coupon.code;
    }

    const discountedSubtotal = subtotal - discountAmount;
    const shippingAmount = discountedSubtotal >= 499 ? 0 : 49; // Free shipping above ₹499

    // GST
    const gstCalc = calculateGst(orderItems, shippingAddress.state);
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(10000 + Math.random() * 90000)}`;
    const gstDetails: GstDetails = {
      gstin: gstin?.trim(),
      companyName: companyName?.trim(),
      invoiceNumber,
      ...gstCalc,
    };

    const total = (discountedSubtotal + shippingAmount).toFixed(2);
    const orderNumber = await generateOrderNumber();

    const [order] = await db.insert(ordersTable).values({
      orderNumber,
      userId,
      guestEmail: userId ? undefined : guestEmail,
      items: orderItems,
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      couponCode: appliedCoupon,
      taxAmount: gstCalc.totalTax,
      shippingAmount: shippingAmount.toFixed(2),
      total,
      shippingAddress,
      gstDetails,
      status: "pending",
      paymentStatus: "unpaid",
      notes,
    }).returning();

    // Deduct stock
    for (const item of orderItems) {
      const [p] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
      if (p) {
        await db.update(productsTable).set({ stock: p.stock - item.quantity, updatedAt: new Date() }).where(eq(productsTable.id, p.id));
      }
    }

    // Increment coupon usage
    if (appliedCoupon) {
      const [c] = await db.select().from(couponsTable).where(eq(couponsTable.code, appliedCoupon)).limit(1);
      if (c) await db.update(couponsTable).set({ usedCount: c.usedCount + 1, updatedAt: new Date() }).where(eq(couponsTable.id, c.id));
    }

    // Clear cart
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

    return res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not place order." });
  }
});

// GET /api/orders  — customer's own orders (requires login)
router.get("/", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Login required to view orders." });
    }
    const orders = await db.select().from(ordersTable)
      .where(eq(ordersTable.userId, req.session.userId))
      .orderBy(desc(ordersTable.createdAt));
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch orders." });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, Number(req.params.id))).limit(1);
    if (!order) return res.status(404).json({ error: "Order not found." });

    // Only let owner or staff see any order; customers only see their own
    if (!req.session?.staffId) {
      if (!req.session?.userId || order.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied." });
      }
    }
    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch order." });
  }
});

export default router;
