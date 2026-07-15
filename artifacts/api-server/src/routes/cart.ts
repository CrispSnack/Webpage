import { Router } from "express";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

function getSessionId(req: any): string {
  return req.session.id;
}

// GET /api/cart  — returns cart items with product details
router.get("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

    const enriched = await Promise.all(
      items.map(async (item) => {
        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
        return { ...item, product: product ?? null };
      })
    );

    return res.json({ items: enriched.filter((i) => i.product) });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch cart." });
  }
});

// POST /api/cart  — add or increment
router.post("/", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required." });

    const sessionId = getSessionId(req);

    // Check product exists and is active
    const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, productId), eq(productsTable.active, true))).limit(1);
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: `Only ${product.stock} units available.` });
    }

    // Upsert cart item
    const [existing] = await db.select().from(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)))
      .limit(1);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ error: `Only ${product.stock} units available.` });
      }
      const [updated] = await db.update(cartItemsTable)
        .set({ quantity: newQty, updatedAt: new Date() })
        .where(eq(cartItemsTable.id, existing.id))
        .returning();
      return res.json({ item: { ...updated, product } });
    }

    const [item] = await db.insert(cartItemsTable).values({ sessionId, productId, quantity }).returning();
    return res.status(201).json({ item: { ...item, product } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not add to cart." });
  }
});

// PUT /api/cart/:id  — update quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: "quantity must be ≥ 1." });

    const sessionId = getSessionId(req);
    const [item] = await db.select().from(cartItemsTable)
      .where(and(eq(cartItemsTable.id, Number(req.params.id)), eq(cartItemsTable.sessionId, sessionId)))
      .limit(1);
    if (!item) return res.status(404).json({ error: "Cart item not found." });

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
    if (product && quantity > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} units available.` });
    }

    const [updated] = await db.update(cartItemsTable)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItemsTable.id, item.id))
      .returning();
    return res.json({ item: { ...updated, product } });
  } catch (err) {
    return res.status(500).json({ error: "Could not update cart item." });
  }
});

// DELETE /api/cart/:id
router.delete("/:id", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    await db.delete(cartItemsTable)
      .where(and(eq(cartItemsTable.id, Number(req.params.id)), eq(cartItemsTable.sessionId, sessionId)));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Could not remove cart item." });
  }
});

// DELETE /api/cart  — clear entire cart
router.delete("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Could not clear cart." });
  }
});

export default router;
