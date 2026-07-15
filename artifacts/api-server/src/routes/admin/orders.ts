import { Router } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq, desc, ilike, or } from "drizzle-orm";
import { requireStaff } from "../../middlewares/auth.js";

const router = Router();
router.use(requireStaff);

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

// GET /api/admin/orders  ?status=pending  &q=search  &page=1  &limit=20
router.get("/", async (req, res) => {
  try {
    const { status, q } = req.query as Record<string, string>;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;

    let baseQuery = db.select().from(ordersTable);
    if (status && VALID_STATUSES.includes(status)) {
      baseQuery = baseQuery.where(eq(ordersTable.status, status)) as typeof baseQuery;
    }

    const orders = await db.select().from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit)
      .offset(offset);

    return res.json({ orders, page, limit });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch orders." });
  }
});

// GET /api/admin/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, Number(req.params.id))).limit(1);
    if (!order) return res.status(404).json({ error: "Order not found." });
    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch order." });
  }
});

// PUT /api/admin/orders/:id/status
router.put("/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` });
    }
    const updates: Record<string, unknown> = { status, updatedAt: new Date() };
    if (notes !== undefined) updates.notes = notes;

    const [order] = await db.update(ordersTable).set(updates).where(eq(ordersTable.id, Number(req.params.id))).returning();
    if (!order) return res.status(404).json({ error: "Order not found." });
    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ error: "Could not update order." });
  }
});

// PUT /api/admin/orders/:id/payment
router.put("/:id/payment", async (req, res) => {
  try {
    const { paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (razorpayOrderId) updates.razorpayOrderId = razorpayOrderId;
    if (razorpayPaymentId) updates.razorpayPaymentId = razorpayPaymentId;

    const [order] = await db.update(ordersTable).set(updates).where(eq(ordersTable.id, Number(req.params.id))).returning();
    if (!order) return res.status(404).json({ error: "Order not found." });
    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ error: "Could not update payment." });
  }
});

export default router;
