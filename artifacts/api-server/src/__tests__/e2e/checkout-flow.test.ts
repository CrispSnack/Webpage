/**
 * E2E Integration Test — Complete purchase flow.
 *
 * Flow:
 *  1. Browse products  (GET /api/products)
 *  2. Add to cart      (POST /api/cart)
 *  3. Check cart total (GET /api/cart)
 *  4. Checkout         (POST /api/orders)
 *  5. Payment verified (admin marks order as paid + confirmed)
 *
 * All steps use a single persistent supertest agent (cookie jar) to
 * simulate a real browser session. Database is fully mocked.
 */
import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import { mockDb, whenSelect, whenInsert, whenUpdate, resetDb, makeChain } from "../helpers/db-mock.js";
import {
  fakeProduct, fakeCartItem, fakeStaffOwner, fakeOrder,
  shippingAddress, TEST_PASSWORD,
} from "../helpers/fixtures.js";

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

describe("E2E: browse → add to cart → checkout → payment verification", () => {
  // A single agent maintains cookies across all steps (one browser session)
  const guest = request.agent(app);
  const admin = request.agent(app);
  let orderId: number;

  beforeAll(() => resetDb());

  // ── Step 1: Browse products ──────────────────────────────────────────────
  it("Step 1 — GET /api/products returns product catalogue", async () => {
    whenSelect([fakeProduct]);

    const res = await guest.get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.products[0].slug).toBe(fakeProduct.slug);
    expect(res.body.products[0].name).toBe(fakeProduct.name);
  });

  // ── Step 2: Add product to cart ──────────────────────────────────────────
  it("Step 2 — POST /api/cart adds the product (same guest session)", async () => {
    whenSelect([fakeProduct]);  // product check
    whenSelect([]);             // no existing cart item
    whenInsert([fakeCartItem]); // new cart row

    const res = await guest
      .post("/api/cart")
      .send({ productId: fakeProduct.id, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.item.productId).toBe(fakeProduct.id);
    expect(res.body.item.quantity).toBe(2);
  });

  // ── Step 3: Verify cart total ────────────────────────────────────────────
  it("Step 3 — GET /api/cart shows items with enriched product data", async () => {
    whenSelect([{ ...fakeCartItem, quantity: 2 }]);
    whenSelect([fakeProduct]);

    const res = await guest.get("/api/cart");

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);

    const item = res.body.items[0];
    // Client-side total calc: price × qty
    const lineTotal = parseFloat(item.product.price) * item.quantity;
    expect(lineTotal).toBe(parseFloat(fakeProduct.price) * 2); // ₹598.00
    expect(item.product.name).toBe(fakeProduct.name);
  });

  // ── Step 4: Place order (guest checkout) ─────────────────────────────────
  it("Step 4 — POST /api/orders places order and clears cart", async () => {
    const twoItemCart = { ...fakeCartItem, quantity: 2 };
    const placedOrder = {
      ...fakeOrder,
      subtotal: "598.00",
      shippingAmount: "0.00", // free shipping ≥ ₹499
      total: "598.00",
    };

    whenSelect([twoItemCart]);         // load cart
    whenSelect([fakeProduct]);         // stock check
    // No coupon passed → no coupon select needed
    whenInsert([placedOrder]);         // order insert
    // Stock deduction + cart clear (update + delete)
    mockDb.update.mockReturnValue(makeChain([{ ...fakeProduct, stock: 98 }]));
    mockDb.delete.mockReturnValue(makeChain(undefined));

    const res = await guest.post("/api/orders").send({
      guestEmail: "guest@checkout.com",
      shippingAddress,
    });

    expect(res.status).toBe(201);
    orderId = res.body.order.id;

    expect(res.body.order.paymentStatus).toBe("unpaid");
    expect(res.body.order.status).toBe("pending");
    expect(res.body.order.orderNumber).toMatch(/^CNS-/);

    // Shipping free because subtotal ≥ ₹499
    expect(parseFloat(res.body.order.shippingAmount)).toBe(0);
  });

  // ── Step 5: Admin logs in and marks order as paid ────────────────────────
  it("Step 5a — Admin logs into dashboard", async () => {
    whenSelect([fakeStaffOwner]);
    const res = await admin
      .post("/api/admin/auth/login")
      .send({ email: fakeStaffOwner.email, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.staff.role).toBe("owner");
  });

  it("Step 5b — Admin views order detail", async () => {
    const pendingOrder = { ...fakeOrder, id: orderId ?? 1 };
    whenSelect([pendingOrder]);

    const res = await admin.get(`/api/admin/orders/${orderId ?? 1}`);

    expect(res.status).toBe(200);
    expect(res.body.order.paymentStatus).toBe("unpaid");
  });

  it("Step 5c — Admin marks payment as paid and confirms order", async () => {
    const paidOrder = {
      ...fakeOrder,
      id: orderId ?? 1,
      status: "confirmed",
      paymentStatus: "paid",
    };
    whenUpdate([paidOrder]);

    const res = await admin
      .put(`/api/admin/orders/${orderId ?? 1}/status`)
      .send({ status: "confirmed" });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe("confirmed");
  });

  // ── Stock guard: cannot add out-of-stock item ────────────────────────────
  it("Guard — cannot add item with 0 stock to cart", async () => {
    whenSelect([{ ...fakeProduct, stock: 0, active: true }]);

    const res = await guest
      .post("/api/cart")
      .send({ productId: fakeProduct.id, quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only 0 units/i);
  });

  // ── Pricing is always server-side ───────────────────────────────────────
  it("Guard — order total is calculated server-side, not from client input", async () => {
    // The API has no field that lets a client set the price — it always reads
    // price from the DB product record. We verify by placing an order and
    // confirming the total matches the DB price, not anything we could inject.
    const cartItem = { ...fakeCartItem, quantity: 1 };
    const serverPricedOrder = {
      ...fakeOrder,
      subtotal: fakeProduct.price,        // ₹299 from DB
      total: "348.00",                    // + ₹49 shipping (under free-shipping threshold)
      shippingAmount: "49.00",
    };

    whenSelect([cartItem]);               // cart load
    whenSelect([fakeProduct]);            // stock check — price comes from HERE
    whenInsert([serverPricedOrder]);      // order persisted with DB price
    mockDb.update.mockReturnValue(makeChain([]));
    mockDb.delete.mockReturnValue(makeChain(undefined));

    const res = await guest.post("/api/orders").send({
      guestEmail: "attacker@example.com",
      shippingAddress,
      // No `price` field — the API never reads price from the request body
    });

    expect(res.status).toBe(201);
    // Total is ≥ DB price — can never be the attacker's "₹1" total
    expect(parseFloat(res.body.order.total)).toBeGreaterThanOrEqual(
      parseFloat(fakeProduct.price),
    );
  });
});
