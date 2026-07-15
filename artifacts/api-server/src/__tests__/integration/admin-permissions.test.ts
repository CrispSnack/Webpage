/**
 * Integration tests — admin role-based access control.
 *
 * Permission matrix:
 *   Endpoint                      | Unauth | staff | manager | owner
 *   GET  /admin/products          | 401    | 200   | 200     | 200
 *   POST /admin/products          | 401    | 403   | 201     | 201
 *   PUT  /admin/products/:id      | 401    | 403   | 200     | 200
 *   DELETE /admin/products/:id    | 401    | 403   | 200     | 200
 *   GET  /admin/orders            | 401    | 200   | 200     | 200
 *   PATCH/PUT /admin/orders/:id/status | 401 | 200  | 200    | 200
 *   GET  /admin/coupons           | 401    | 200   | 200     | 200
 *   POST /admin/coupons           | 401    | 403   | 201     | 201
 *   GET  /admin/staff             | 401    | 403   | 403     | 200
 *   POST /admin/staff             | 401    | 403   | 403     | 201
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { mockDb, whenSelect, whenInsert, whenUpdate, resetDb, makeChain } from "../helpers/db-mock.js";
import {
  fakeStaffOwner, fakeStaffManager, fakeStaffOnly,
  fakeProduct, fakeOrder, fakeCoupon, TEST_PASSWORD,
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

// ── Session factories ─────────────────────────────────────────────────────

async function loginAs(
  agent: ReturnType<typeof request.agent>,
  staff: typeof fakeStaffOwner,
) {
  whenSelect([staff]);
  await agent
    .post("/api/admin/auth/login")
    .send({ email: staff.email, password: TEST_PASSWORD });
}

// ── Helpers ───────────────────────────────────────────────────────────────

const NEW_PRODUCT_BODY = {
  name: "Test Product",
  slug: "test-product",
  price: "199.00",
  category: "tea",
};

describe("Admin auth", () => {
  beforeEach(() => resetDb());

  it("401 — no session", async () => {
    const res = await request(app).get("/api/admin/auth/me");
    expect(res.status).toBe(401);
  });

  it("200 — valid staff login sets session", async () => {
    whenSelect([fakeStaffOwner]);
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: fakeStaffOwner.email, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.staff.role).toBe("owner");
    expect(res.body.staff).not.toHaveProperty("passwordHash");
  });

  it("401 — wrong password", async () => {
    whenSelect([fakeStaffOwner]);
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: fakeStaffOwner.email, password: "BadPass" });
    expect(res.status).toBe(401);
  });

  it("401 — inactive staff account", async () => {
    whenSelect([{ ...fakeStaffOwner, active: false }]);
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: fakeStaffOwner.email, password: TEST_PASSWORD });
    expect(res.status).toBe(401);
  });
});

// ── Product CRUD ──────────────────────────────────────────────────────────

describe("GET /api/admin/products — any staff", () => {
  beforeEach(() => resetDb());

  it("401 — unauthenticated", async () => {
    const res = await request(app).get("/api/admin/products");
    expect(res.status).toBe(401);
  });

  it("200 — staff role can read products", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOnly);
    whenSelect([fakeProduct]);

    const res = await agent.get("/api/admin/products");
    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
  });
});

describe("POST /api/admin/products — manager+ only", () => {
  beforeEach(() => resetDb());

  it("403 — staff role cannot create product", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOnly);
    const res = await agent.post("/api/admin/products").send(NEW_PRODUCT_BODY);
    expect(res.status).toBe(403);
  });

  it("201 — manager can create product", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    whenInsert([fakeProduct]);
    const res = await agent.post("/api/admin/products").send(NEW_PRODUCT_BODY);
    expect(res.status).toBe(201);
  });

  it("201 — owner can create product", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOwner);
    whenInsert([fakeProduct]);
    const res = await agent.post("/api/admin/products").send(NEW_PRODUCT_BODY);
    expect(res.status).toBe(201);
  });

  it("400 — missing required fields (manager)", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    const res = await agent.post("/api/admin/products").send({ name: "Only Name" });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/admin/products/:id — manager+ only", () => {
  beforeEach(() => resetDb());

  it("403 — staff role cannot update", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOnly);
    const res = await agent.put("/api/admin/products/1").send({ price: "250.00" });
    expect(res.status).toBe(403);
  });

  it("200 — manager can update product", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    whenUpdate([{ ...fakeProduct, price: "250.00" }]);
    const res = await agent.put("/api/admin/products/1").send({ price: "250.00" });
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/admin/products/:id — manager+ only (soft delete)", () => {
  beforeEach(() => resetDb());

  it("403 — staff cannot delete", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOnly);
    const res = await agent.delete("/api/admin/products/1");
    expect(res.status).toBe(403);
  });

  it("200 — manager can soft-delete (active=false)", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    whenUpdate([{ ...fakeProduct, active: false }]);
    const res = await agent.delete("/api/admin/products/1");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.product.active).toBe(false);
  });
});

// ── Staff management — owner only ─────────────────────────────────────────

describe("GET /api/admin/staff — owner only", () => {
  beforeEach(() => resetDb());

  it("403 — staff role", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOnly);
    const res = await agent.get("/api/admin/staff");
    expect(res.status).toBe(403);
  });

  it("403 — manager role", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    const res = await agent.get("/api/admin/staff");
    expect(res.status).toBe(403);
  });

  it("200 — owner can list staff", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOwner);
    whenSelect([fakeStaffOwner, fakeStaffManager]);
    const res = await agent.get("/api/admin/staff");
    expect(res.status).toBe(200);
  });
});

describe("POST /api/admin/staff — owner only", () => {
  beforeEach(() => resetDb());

  it("403 — manager cannot create staff", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    const res = await agent
      .post("/api/admin/staff")
      .send({ name: "New", email: "n@n.com", password: TEST_PASSWORD, role: "staff" });
    expect(res.status).toBe(403);
  });

  it("201 — owner can create staff", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOwner);
    whenInsert([fakeStaffOnly]);
    const res = await agent
      .post("/api/admin/staff")
      .send({ name: "New", email: "n@n.com", password: TEST_PASSWORD, role: "staff" });
    expect(res.status).toBe(201);
    expect(res.body.staff).not.toHaveProperty("passwordHash");
  });
});

// ── Coupon management ─────────────────────────────────────────────────────

describe("POST /api/admin/coupons — manager+ only", () => {
  beforeEach(() => resetDb());

  it("403 — staff role", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffOnly);
    const res = await agent.post("/api/admin/coupons").send({
      code: "TEST20", type: "percent", value: 20,
    });
    expect(res.status).toBe(403);
  });

  it("201 — manager can create coupon", async () => {
    const agent = request.agent(app);
    await loginAs(agent, fakeStaffManager);
    whenInsert([fakeCoupon]);
    const res = await agent.post("/api/admin/coupons").send({
      code: "WELCOME10", type: "percent", value: 10,
    });
    expect(res.status).toBe(201);
  });
});
