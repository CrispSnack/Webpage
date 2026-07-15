import { Router } from "express";
import { db, couponsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireStaff, requireManager } from "../../middlewares/auth.js";

const router = Router();
router.use(requireStaff);

// GET /api/admin/coupons
router.get("/", async (_req, res) => {
  try {
    const coupons = await db.select().from(couponsTable).orderBy(desc(couponsTable.createdAt));
    return res.json({ coupons });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch coupons." });
  }
});

// POST /api/admin/coupons
router.post("/", requireManager, async (req, res) => {
  try {
    const { code, type, value, minOrderAmount, maxUses, description, active, expiresAt } = req.body;
    if (!code || !type || value === undefined) {
      return res.status(400).json({ error: "code, type, value are required." });
    }
    if (!["percent", "fixed"].includes(type)) {
      return res.status(400).json({ error: "type must be 'percent' or 'fixed'." });
    }
    const [coupon] = await db.insert(couponsTable).values({
      code: code.toUpperCase().trim(),
      type, value: String(value),
      minOrderAmount: minOrderAmount ? String(minOrderAmount) : "0",
      maxUses: maxUses ?? null,
      description: description ?? "",
      active: active ?? true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();
    return res.status(201).json({ coupon });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Coupon code already exists." });
    return res.status(500).json({ error: "Could not create coupon." });
  }
});

// PUT /api/admin/coupons/:id
router.put("/:id", requireManager, async (req, res) => {
  try {
    const allowed = ["code", "type", "value", "minOrderAmount", "maxUses", "description", "active", "expiresAt"];
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        if (field === "expiresAt") updates[field] = req.body[field] ? new Date(req.body[field]) : null;
        else if (field === "code") updates[field] = String(req.body[field]).toUpperCase().trim();
        else updates[field] = req.body[field];
      }
    }
    const [coupon] = await db.update(couponsTable).set(updates).where(eq(couponsTable.id, Number(req.params.id))).returning();
    if (!coupon) return res.status(404).json({ error: "Coupon not found." });
    return res.json({ coupon });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Coupon code already exists." });
    return res.status(500).json({ error: "Could not update coupon." });
  }
});

// DELETE /api/admin/coupons/:id
router.delete("/:id", requireManager, async (req, res) => {
  try {
    await db.delete(couponsTable).where(eq(couponsTable.id, Number(req.params.id)));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Could not delete coupon." });
  }
});

export default router;
