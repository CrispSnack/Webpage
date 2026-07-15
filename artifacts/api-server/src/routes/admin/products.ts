import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireStaff, requireManager } from "../../middlewares/auth.js";

const router = Router();
router.use(requireStaff);

// GET /api/admin/products — all products including inactive
router.get("/", async (_req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch products." });
  }
});

// GET /api/admin/products/:id
router.get("/:id", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(req.params.id))).limit(1);
    if (!product) return res.status(404).json({ error: "Product not found." });
    return res.json({ product });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch product." });
  }
});

// POST /api/admin/products
router.post("/", requireManager, async (req, res) => {
  try {
    const { name, slug, description, shortDescription, price, comparePrice, category, images, badge, stock, gstRate, weight, active, featured } = req.body;
    if (!name || !slug || !price || !category) {
      return res.status(400).json({ error: "name, slug, price, category are required." });
    }
    const [product] = await db.insert(productsTable).values({
      name, slug, description: description ?? "", shortDescription: shortDescription ?? "",
      price, comparePrice: comparePrice ?? null, category, images: images ?? [],
      badge: badge ?? null, stock: stock ?? 100, gstRate: gstRate ?? "5.00",
      weight: weight ?? "", active: active ?? true, featured: featured ?? false,
    }).returning();
    return res.status(201).json({ product });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "A product with this slug already exists." });
    return res.status(500).json({ error: "Could not create product." });
  }
});

// PUT /api/admin/products/:id
router.put("/:id", requireManager, async (req, res) => {
  try {
    const allowedFields = ["name", "slug", "description", "shortDescription", "price", "comparePrice",
      "category", "images", "badge", "stock", "gstRate", "weight", "active", "featured"];
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, Number(req.params.id))).returning();
    if (!product) return res.status(404).json({ error: "Product not found." });
    return res.json({ product });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Slug already in use." });
    return res.status(500).json({ error: "Could not update product." });
  }
});

// DELETE /api/admin/products/:id — soft-delete (set active=false)
router.delete("/:id", requireManager, async (req, res) => {
  try {
    const [product] = await db.update(productsTable)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(productsTable.id, Number(req.params.id)))
      .returning();
    if (!product) return res.status(404).json({ error: "Product not found." });
    return res.json({ ok: true, product });
  } catch (err) {
    return res.status(500).json({ error: "Could not delete product." });
  }
});

export default router;
