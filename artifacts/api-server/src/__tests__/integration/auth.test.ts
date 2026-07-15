/**
 * Integration tests — customer authentication flows.
 * Routes: POST /api/auth/register, /login, /logout, GET /me, PUT /me
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { mockDb, whenSelect, whenInsert, whenUpdate, resetDb } from "../helpers/db-mock.js";
import { fakeUser, TEST_PASSWORD } from "../helpers/fixtures.js";

// ── Mock @workspace/db BEFORE importing anything that uses it ──────────────
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

// ── Also mock connect-pg-simple to avoid real DB session store ─────────────
vi.mock("connect-pg-simple", () => ({
  default: () => class FakeStore {},
}));

// ── Import app AFTER mocks are set up ─────────────────────────────────────
const { createTestApp } = await import("../helpers/createTestApp.js");
const app = createTestApp();

// ── Also mock drizzle-orm operators (used in routes) ─────────────────────
vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>();
  return { ...actual };
});

describe("POST /api/auth/register", () => {
  beforeEach(() => resetDb());

  it("201 — creates user and sets session", async () => {
    // First select: check existing user (returns nothing)
    whenSelect([]);
    // Insert: returns new user
    whenInsert([fakeUser]);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "new@example.com", password: TEST_PASSWORD, name: "New User" });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ email: fakeUser.email });
    expect(res.body.user).not.toHaveProperty("passwordHash");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("400 — missing required fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@x.com" }); // no password or name

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it("400 — password too short", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@x.com", password: "short", name: "X" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/8 characters/i);
  });

  it("409 — duplicate email", async () => {
    whenSelect([fakeUser]); // existing user found

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: fakeUser.email, password: TEST_PASSWORD, name: "Dupe" });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(() => resetDb());

  it("200 — returns user without passwordHash on valid credentials", async () => {
    whenSelect([fakeUser]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(fakeUser.email);
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("401 — wrong password", async () => {
    whenSelect([fakeUser]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: fakeUser.email, password: "WrongPassword!" });

    expect(res.status).toBe(401);
  });

  it("401 — unknown email", async () => {
    whenSelect([]); // no user found

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: TEST_PASSWORD });

    expect(res.status).toBe(401);
  });

  it("401 — inactive account", async () => {
    whenSelect([{ ...fakeUser, active: false }]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    expect(res.status).toBe(401);
  });

  it("400 — missing body fields", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/me", () => {
  beforeEach(() => resetDb());

  it("401 — unauthenticated", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("200 — returns current user after login", async () => {
    const agent = request.agent(app);

    // Login
    whenSelect([fakeUser]);
    await agent
      .post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    // GET /me
    whenSelect([fakeUser]);
    const res = await agent.get("/api/auth/me");

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(fakeUser.id);
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });
});

describe("POST /api/auth/logout", () => {
  it("200 — destroys session", async () => {
    const agent = request.agent(app);
    whenSelect([fakeUser]);
    await agent.post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    const res = await agent.post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    // /me should now 401
    const meRes = await agent.get("/api/auth/me");
    expect(meRes.status).toBe(401);
  });
});

describe("PUT /api/auth/me", () => {
  beforeEach(() => resetDb());

  it("401 — unauthenticated", async () => {
    const res = await request(app).put("/api/auth/me").send({ name: "New" });
    expect(res.status).toBe(401);
  });

  it("200 — updates profile fields", async () => {
    const agent = request.agent(app);
    whenSelect([fakeUser]);
    await agent.post("/api/auth/login")
      .send({ email: fakeUser.email, password: TEST_PASSWORD });

    const updated = { ...fakeUser, name: "Updated Name" };
    whenUpdate([updated]);
    const res = await agent.put("/api/auth/me").send({ name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Updated Name");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });
});
