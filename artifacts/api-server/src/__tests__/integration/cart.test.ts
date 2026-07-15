/**
 * Integration tests — cart operations.
 * Routes: GET/POST/PUT/DELETE /api/cart
 *
 * Covers: add to cart, stock enforcement, quantity update,
 *         item removal, full cart clear, and enriched response shape.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { mockDb, whenSelect, whenInsert, whenUpdate, resetDb } from "../helpers/db-mock.js";
import { fakeProduct, fakeCartItem } from "../helpers/fixtures.js";

vi.mock("@workspace/db", () => ({
  db: mockDb,
  usersTable: {},
  staffTable: {},
  productsTable: {},
  cartItemsTable: {},
  ordersTable: {},
  couponsTable: {},
  pool: { query: vi.fn(), end: vi.fn() },
}));
vi.mock("connect-pg-simple", () => ({ default: () => class FakeStore {} }));

const { createTestApp } = await import("../helpers/createTestApp.js");
const app = createTestApp();

describe("GET /api/cart", () => {
  beforeEach(() => resetDb());

  it("200 — returns empty cart for new session", async () => {
    whenSelect([]); // no cart items
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  it("200 — returns enriched items with product data", async () => {
    whenSelect([fakeCartItem]);           // cart items
    whenSelect([fakeProduct]);            // product lookup for item
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].product.id).toBe(fakeProduct.id);
    expect(res.body.items[0].quantity).toBe(fakeCartItem.quantity);
  });
});

describe("POST /api/cart", () => {
  beforeEach(() => resetDb());

  it("400 — missing productId", async () => {
    const res = await request(app).post("/api/cart").send({ quantity: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/productId/i);
  });

  it("404 — inactive or non-existent product", async () => {
    whenSelect([]); // product not found / inactive
    const res = await request(app)
      .post("/api/cart")
      .send({ productId: 999, quantity: 1 });
    expect(res.status).toBe(404);
  });

  it("400 — exceeds available stock", async () => {
    const lowStock = { ...fakeProduct, stock: 2 };
    whenSelect([lowStock]); // product with only 2 in stock

    const res = await request(app)
      .post("/api/cart")
      .send({ productId: fakeProduct.id, quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only 2 units/i);
  });

  it("201 — adds new item to cart", async () => {
    whenSelect([fakeProduct]);  // product check
    whenSelect([]);             // existing cart item (none)
    whenInsert([fakeCartItem]); // insert new item

    const res = await request(app)
      .post("/api/cart")
      .send({ productId: fakeProduct.id, quantity: 1 });

    expect(res.status).toBe(201);
    expect(res.body.item.productId).toBe(fakeProduct.id);
    expect(res.body.item.product.id).toBe(fakeProduct.id);
  });

  it("200 — increments quantity when item already in cart", async () => {
    const existing = { ...fakeCartItem, quantity: 1 };
    const updated = { ...fakeCartItem, quantity: 2 };

    whenSelect([fakeProduct]); // product check
    whenSelect([existing]);    // existing cart item
    whenUpdate([updated]);     // quantity update

    const res = await request(app)
      .post("/api/cart")
      .send({ productId: fakeProduct.id, quantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body.item.quantity).toBe(2);
  });

  it("400 — combined quantity exceeds stock", async () => {
    const existing = { ...fakeCartItem, quantity: 98 };
    whenSelect([{ ...fakeProduct, stock: 100 }]); // stock = 100
    whenSelect([existing]);                        // already 98 in cart

    const res = await request(app)
      .post("/api/cart")
      .send({ productId: fakeProduct.id, quantity: 5 }); // 98+5 > 100

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only 100 units/i);
  });
});

describe("PUT /api/cart/:id", () => {
  beforeEach(() => resetDb());

  it("400 — quantity less than 1", async () => {
    const res = await request(app)
      .put("/api/cart/1")
      .send({ quantity: 0 });
    expect(res.status).toBe(400);
  });

  it("404 — item not found in session", async () => {
    whenSelect([]); // no item for this session
    const res = await request(app)
      .put("/api/cart/99")
      .send({ quantity: 2 });
    expect(res.status).toBe(404);
  });

  it("400 — new quantity exceeds stock", async () => {
    whenSelect([fakeCartItem]);                     // item found
    whenSelect([{ ...fakeProduct, stock: 3 }]);     // only 3 in stock

    const res = await request(app)
      .put("/api/cart/1")
      .send({ quantity: 10 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only 3 units/i);
  });

  it("200 — updates quantity", async () => {
    const updated = { ...fakeCartItem, quantity: 3 };
    whenSelect([fakeCartItem]);   // item found
    whenSelect([fakeProduct]);    // product for stock check
    whenUpdate([updated]);        // update

    const res = await request(app)
      .put("/api/cart/1")
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.item.quantity).toBe(3);
  });
});

describe("DELETE /api/cart/:id", () => {
  beforeEach(() => resetDb());

  it("200 — removes specific item", async () => {
    const res = await request(app).delete("/api/cart/1");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe("DELETE /api/cart (clear all)", () => {
  it("200 — clears entire cart", async () => {
    const res = await request(app).delete("/api/cart");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
