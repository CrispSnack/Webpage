import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, and, ilike, or } from "drizzle-orm";

const router = Router();

// GET /api/products  ?category=tea|snacks  &q=search  &badge=Bestseller  &featured=true
router.get("/", async (req, res) => {
  try {
    const { category, q, badge, featured } = req.query as Record<string, string>;

    const conditions = [eq(productsTable.active, true)];
    if (category) conditions.push(eq(productsTable.category, category));
    if (badge) conditions.push(eq(productsTable.badge, badge));
    if (featured === "true") conditions.push(eq(productsTable.featured, true));
    if (q) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${q}%`),
          ilike(productsTable.description, `%${q}%`)
        )!
      );
    }

    const products = await db.select().from(productsTable).where(and(...conditions));
    return res.json({ products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch products." });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable)
      .where(and(eq(productsTable.slug, req.params.slug), eq(productsTable.active, true)))
      .limit(1);
    if (!product) return res.status(404).json({ error: "Product not found." });
    return res.json({ product });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch product." });
  }
});

export default router;
