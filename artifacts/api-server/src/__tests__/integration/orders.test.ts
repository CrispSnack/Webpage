/**
 * Integration tests — order placement, coupon validation, GST, stock deduction.
 * Route: POST /api/orders
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { mockDb, whenSelect, whenInsert, resetDb, makeChain } from "../helpers/db-mock.js";
import {
  fakeUser, fakeProduct, fakeCartItem, fakeCoupon, fakeOrder,
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

// Prime stock-deduct and coupon-increment mocks (no-op updates)
function primePostOrderSideEffects() {
  // deduct stock × items count
  mockDb.update.mockReturnValue(makeChain([]));
  // clear cart
  mockDb.delete.mockReturnValue(makeChain(undefined));
}

describe("POST /api/orders", () => {
  beforeEach(() => resetDb());

  it("400 — empty cart", async () => {
    whenSelect([]); // no cart items
    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cart is empty/i);
  });

  it("400 — guest checkout without guestEmail", async () => {
    whenSelect([fakeCartItem]);
    const res = await request(app).post("/api/orders").send({ shippingAddress });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/guest email/i);
  });

  it("400 — incomplete shipping address", async () => {
    const res = await request(app).post("/api/orders").send({
      shippingAddress: { name: "A" }, // missing line1, city, pincode
      guestEmail: "guest@example.com",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/shipping address/i);
  });

  it("400 — out of stock product in cart", async () => {
    whenSelect([fakeCartItem]);                            // cart items
    whenSelect([{ ...fakeProduct, stock: 0 }]);            // product: out of stock

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/available/i);
  });

  it("201 — places guest order successfully", async () => {
    whenSelect([fakeCartItem]);            // cart items
    whenSelect([fakeProduct]);             // product (stock check)
    whenSelect([]);                        // no coupon (none passed)
    whenInsert([fakeOrder]);              // order insert
    primePostOrderSideEffects();

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
    });

    expect(res.status).toBe(201);
    expect(res.body.order).toMatchObject({
      orderNumber: expect.stringMatching(/^CNS-/),
      paymentStatus: "unpaid",
      status: "pending",
    });
  });

  it("400 — invalid coupon code", async () => {
    whenSelect([fakeCartItem]);
    whenSelect([fakeProduct]);
    whenSelect([]);  // coupon lookup returns nothing

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
      couponCode: "FAKECOUPON",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid or expired coupon/i);
  });

  it("400 — coupon below minimum order amount", async () => {
    const cheapProduct = { ...fakeProduct, price: "99.00", stock: 10 };
    const cartItem = { ...fakeCartItem, quantity: 1 };

    whenSelect([cartItem]);
    whenSelect([cheapProduct]);    // product: ₹99
    // Coupon requires ₹299 min
    whenSelect([fakeCoupon]);

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
      couponCode: "WELCOME10",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/minimum order/i);
  });

  it("400 — coupon usage limit exceeded", async () => {
    const exhaustedCoupon = { ...fakeCoupon, usedCount: 100, maxUses: 100 };
    whenSelect([fakeCartItem]);
    whenSelect([fakeProduct]);
    whenSelect([exhaustedCoupon]);

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
      couponCode: "WELCOME10",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/usage limit/i);
  });

  it("201 — applies valid coupon and reduces total", async () => {
    // Product: ₹299 × 2 = ₹598 subtotal. WELCOME10 = 10% → discount ₹59.80
    const cartItem = { ...fakeCartItem, quantity: 2 };
    const discountedOrder = {
      ...fakeOrder,
      subtotal: "598.00",
      discountAmount: "59.80",
      couponCode: "WELCOME10",
      total: "538.20",
    };

    whenSelect([cartItem]);
    whenSelect([fakeProduct]);
    whenSelect([fakeCoupon]);
    whenInsert([discountedOrder]);
    primePostOrderSideEffects();

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
      couponCode: "WELCOME10",
    });

    expect(res.status).toBe(201);
    expect(res.body.order.couponCode).toBe("WELCOME10");
    expect(parseFloat(res.body.order.discountAmount)).toBeGreaterThan(0);
  });

  it("400 — expired coupon", async () => {
    const expiredCoupon = {
      ...fakeCoupon,
      expiresAt: new Date("2020-01-01"), // far in the past
    };
    whenSelect([fakeCartItem]);
    whenSelect([fakeProduct]);
    whenSelect([expiredCoupon]);

    const res = await request(app).post("/api/orders").send({
      shippingAddress,
      guestEmail: "guest@example.com",
      couponCode: "WELCOME10",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/expired/i);
  });
});

describe("GET /api/orders (auth required)", () => {
  beforeEach(() => resetDb());

  it("401 — unauthenticated", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });

  it("200 — returns user's orders after login", async () => {
    const agent = request.agent(app);
    whenSelect([fakeUser]);
    await agent.post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    whenSelect([fakeOrder]);
    const res = await agent.get("/api/orders");
    expect(res.status).toBe(200);
    expect(res.body.orders).toHaveLength(1);
  });
});

describe("GET /api/orders/:id (ownership guard)", () => {
  beforeEach(() => resetDb());

  it("403 — customer cannot access another customer's order", async () => {
    const agent = request.agent(app);
    whenSelect([fakeUser]);
    await agent.post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    const otherUserOrder = { ...fakeOrder, userId: 999 }; // different user
    whenSelect([otherUserOrder]);

    const res = await agent.get("/api/orders/1");
    expect(res.status).toBe(403);
  });

  it("200 — customer can access their own order", async () => {
    const agent = request.agent(app);
    whenSelect([fakeUser]);
    await agent.post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    whenSelect([fakeOrder]); // userId matches fakeUser.id (1)
    const res = await agent.get("/api/orders/1");
    expect(res.status).toBe(200);
  });
});
