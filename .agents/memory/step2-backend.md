---
name: Step 2 Backend — Crispy N Snacky
description: Key decisions and credentials for the Step 2 backend build (DB schema, API, admin dashboard)
---

## Stack
- DB: Drizzle ORM + Postgres (lib/db), tables: products, users, staff, orders, cart_items, coupons, session
- API: Express in artifacts/api-server, sessions via connect-pg-simple
- Admin UI: React+Vite at artifacts/admin, served at /admin/

## Default owner account
- Email: admin@crispynsnacky.in
- Default password: ChangeMe@123 (bcrypt hash in DB)
- Role: owner

## Welcome coupon seeded
- Code: WELCOME10, 10% off, min order ₹299

## Role hierarchy
owner > manager > staff
- owner: full access including staff management
- manager: product/order/coupon CRUD
- staff: read-only on orders/products

## Session config
- Sessions stored in `session` table (connect-pg-simple, createTableIfMissing: true)
- 7-day cookie, httpOnly, sameSite=lax in dev / none+secure in prod
- SESSION_SECRET env var used (falls back to dev-secret in dev)

**Why:** Guest cart works via session even without login — session is always initialized (saveUninitialized: true)

## GST logic
- Always CGST+SGST for Tamil Nadu (intra-state). IGST for all other states.
- Rates: 5% for tea, 12% for snacks (matches Indian food GST slabs)
- Invoice number format: INV-YYYYMMDD-XXXXX

## Order number format
CNS-YYYYMMDD-XXXXX

## Coupon increment bug
The orders.ts route fetches the coupon and manually increments usedCount — db.$count() does NOT work for this.
