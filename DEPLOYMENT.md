# Crispy N Snacky — Deployment Guide

## Table of Contents
1. [Local Development Setup](#1-local-development-setup)
2. [Running Tests](#2-running-tests)
3. [Database Migrations & Seed](#3-database-migrations--seed)
4. [Build Commands](#4-build-commands)
5. [Vercel Deployment](#5-vercel-deployment)
6. [Required Environment Variables](#6-required-environment-variables)
7. [Launch Checklist](#7-launch-checklist)

---

## 1. Local Development Setup

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- PostgreSQL ≥ 15 (local Docker or a free Neon/Supabase instance)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/your-org/crispynsnacky.git
cd crispynsnacky
pnpm install

# 2. Copy and fill env vars
cp .env.example .env
#    Edit .env: set DATABASE_URL and SESSION_SECRET at minimum

# 3. Push database schema (creates all 7 tables)
pnpm --filter @workspace/db run db:push

# 4. Seed database (products + default owner + WELCOME10 coupon)
pnpm --filter @workspace/db run db:seed

# 5. Start all services in parallel
pnpm dev
```

`pnpm dev` starts:
| Service            | URL                        | Command |
|--------------------|----------------------------|---------|
| API Server         | http://localhost:8080/api  | `pnpm --filter @workspace/api-server run dev` |
| Storefront         | http://localhost:24765/    | `pnpm --filter @workspace/hillbay run dev` |
| Admin Dashboard    | http://localhost:PORT/admin| `pnpm --filter @workspace/admin run dev` |

**Default admin credentials (change immediately after first login):**
```
Email:    admin@crispynsnacky.in
Password: ChangeMe@123
```

---

## 2. Running Tests

```bash
# All tests (unit + integration + E2E)
pnpm --filter @workspace/api-server run test

# Watch mode (re-runs on save)
pnpm --filter @workspace/api-server run test:watch

# Coverage report (outputs to artifacts/api-server/coverage/)
pnpm --filter @workspace/api-server run test:coverage

# Run only unit tests
pnpm --filter @workspace/api-server run test -- src/__tests__/unit

# Run only integration tests
pnpm --filter @workspace/api-server run test -- src/__tests__/integration

# Run E2E checkout flow
pnpm --filter @workspace/api-server run test -- src/__tests__/e2e
```

Tests are fully isolated — they mock `@workspace/db` and use an in-memory session store. No real database required.

---

## 3. Database Migrations & Seed

### Schema management (Drizzle Kit)

```bash
# Check pending schema changes
pnpm --filter @workspace/db run db:diff

# Apply schema changes to your database (dev)
pnpm --filter @workspace/db run db:push

# Generate a SQL migration file (recommended for production)
pnpm --filter @workspace/db run db:generate

# Apply migrations in production (safer than push)
pnpm --filter @workspace/db run db:migrate
```

### Seed data

```bash
# Seeds: 10 products, WELCOME10 coupon, default owner account
pnpm --filter @workspace/db run db:seed
```

### Applying dev schema to production database

```bash
# Point to the production DATABASE_URL temporarily
DATABASE_URL=postgresql://prod_user:pass@prod_host/prod_db \
  pnpm --filter @workspace/db run db:migrate
```

> **Never run `db:push` (force push) against production.** Use `db:generate` + `db:migrate` instead.

---

## 4. Build Commands

```bash
# Build everything
pnpm build

# Build individual packages
pnpm --filter @workspace/api-server run build   # → artifacts/api-server/dist/
pnpm --filter @workspace/hillbay run build       # → artifacts/hillbay/dist/
pnpm --filter @workspace/admin run build         # → artifacts/admin/dist/

# Type-check all packages
pnpm typecheck
```

---

## 5. Vercel Deployment

The project has **three deployable units**:
| Unit             | Type      | Root Directory            | Output Dir |
|------------------|-----------|---------------------------|------------|
| API Server       | Node.js   | `artifacts/api-server`    | —          |
| Storefront       | Static    | `artifacts/hillbay`       | `dist`     |
| Admin Dashboard  | Static    | `artifacts/admin`         | `dist`     |

### Option A — Vercel CLI (recommended for first deploy)

```bash
npm i -g vercel

# Deploy API Server
cd artifacts/api-server
vercel --prod

# Deploy Storefront
cd ../hillbay
vercel --prod

# Deploy Admin Dashboard
cd ../admin
vercel --prod
```

### Option B — GitHub + Vercel Dashboard

1. Push to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository**.
3. For each of the three units, create a **separate Vercel project**:

**API Server project settings:**
```
Root Directory:   artifacts/api-server
Framework:        Other
Build Command:    pnpm run build
Output Directory: dist
Install Command:  pnpm install
```

**Storefront project settings:**
```
Root Directory:   artifacts/hillbay
Framework:        Vite
Build Command:    pnpm run build
Output Directory: dist/public
Install Command:  pnpm install
```

**Admin project settings:**
```
Root Directory:   artifacts/admin
Framework:        Vite
Build Command:    pnpm run build
Output Directory: dist
Install Command:  pnpm install
```

### Database provisioning (Neon — recommended)

```bash
# 1. Create a free Neon database at https://neon.tech
# 2. Copy the connection string from the dashboard
# 3. Add to Vercel: Project → Settings → Environment Variables
#    DATABASE_URL = postgresql://...@....neon.tech/crispynsnacky?sslmode=require

# 4. Run migrations against Neon
DATABASE_URL=<neon_connection_string> pnpm --filter @workspace/db run db:migrate

# 5. Seed production data
DATABASE_URL=<neon_connection_string> pnpm --filter @workspace/db run db:seed
```

### Environment variables (Vercel dashboard)

For the **API Server** Vercel project, set:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://...@....neon.tech/crispynsnacky?sslmode=require` |
| `SESSION_SECRET` | 64-char random hex string |
| `NODE_ENV` | `production` |
| `RAZORPAY_KEY_ID` | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | `...` |

For the **Storefront** Vercel project, set:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://api.crispynsnacky.in` (your API Server URL) |

For the **Admin** Vercel project, set:

| Variable | Value |
|---|---|
| `VITE_ADMIN_API_BASE_URL` | `https://api.crispynsnacky.in` |

### Custom domain

```
Storefront:  crispynsnacky.in  (or www.crispynsnacky.in)
Admin:       admin.crispynsnacky.in
API:         api.crispynsnacky.in
```

Configure in Vercel: Project → Settings → Domains → Add.
Then point your DNS: add a CNAME record for each subdomain to `cname.vercel-dns.com`.

---

## 6. Required Environment Variables

| Variable | Required | Where | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | API Server | Postgres connection string |
| `SESSION_SECRET` | ✅ | API Server | Min 64 chars, random |
| `NODE_ENV` | ✅ | API Server | `production` in prod |
| `RAZORPAY_KEY_ID` | ✅ | API + Storefront | Public Razorpay key |
| `RAZORPAY_KEY_SECRET` | ✅ | API Server only | Secret — never client-side |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | API Server | Webhook signature verification |
| `VITE_API_BASE_URL` | ✅ | Storefront | Full URL to API server |
| `VITE_ADMIN_API_BASE_URL` | ✅ | Admin | Full URL to API server |
| `SMTP_*` | Optional | API Server | For order confirmation emails |
| `BUSINESS_GSTIN` | Optional | API Server | Printed on GST invoices |

---

## 7. Launch Checklist

### Security
- [ ] `SESSION_SECRET` is ≥ 64 random characters in production
- [ ] `NODE_ENV=production` is set (enables secure, sameSite=none cookies)
- [ ] `RAZORPAY_KEY_SECRET` is set only on the API Server — never in frontend env vars
- [ ] Admin route (`admin.crispynsnacky.in`) is behind a separate domain/subdomain
- [ ] Default owner password changed from `ChangeMe@123`
- [ ] Webhook endpoint `/api/webhooks/razorpay` verifies HMAC signature before processing
- [ ] All API errors return generic messages (no stack traces in production)
- [ ] `DATABASE_URL` uses SSL (`?sslmode=require` for Neon)
- [ ] HTTP → HTTPS redirect enabled (Vercel does this by default)

### SEO
- [ ] `<title>` and `<meta name="description">` set on every page in `artifacts/hillbay/index.html`
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`
- [ ] `sitemap.xml` generated and submitted to Google Search Console
- [ ] `robots.txt` present at root
- [ ] Canonical URLs set for product pages
- [ ] Structured data (JSON-LD `Product` schema) on product detail pages

### Performance
- [ ] Images converted to WebP; `loading="lazy"` on below-fold images
- [ ] Vite build produces minified, chunked JS (verify `dist/` size < 500 KB gzipped)
- [ ] API responses include `Cache-Control` headers for public product endpoints
- [ ] Lighthouse score ≥ 85 on mobile (run: `npx lighthouse https://crispynsnacky.in --view`)

### Analytics
- [ ] Google Analytics 4 or Plausible snippet added to `artifacts/hillbay/index.html`
- [ ] Conversion events tracked: `add_to_cart`, `begin_checkout`, `purchase`
- [ ] Meta Pixel added (if running Facebook/Instagram ads)

### Legal & Policy Pages
- [ ] `/privacy` — Privacy Policy (required under Indian IT Act + DPDP Bill)
- [ ] `/terms` — Terms & Conditions
- [ ] `/refund` — Refund & Returns Policy (mandatory for ecommerce under Consumer Protection Act)
- [ ] `/shipping` — Shipping Policy (delivery times, carriers, tracking)
- [ ] Cookie consent banner (if using GA/Meta Pixel)
- [ ] GSTIN displayed on checkout and invoices

### Payments
- [ ] Razorpay account verified (KYC completed)
- [ ] Live keys (`rzp_live_*`) configured in production env vars
- [ ] Test a full payment flow on staging with Razorpay test cards
- [ ] Webhook registered in Razorpay Dashboard → Webhooks → `https://api.crispynsnacky.in/api/webhooks/razorpay`
- [ ] Webhook events selected: `payment.captured`, `payment.failed`, `order.paid`
- [ ] Refund flow tested via Razorpay dashboard

### Operations
- [ ] Error monitoring set up (Sentry free tier: `pnpm add @sentry/node` in api-server)
- [ ] Uptime monitoring (UptimeRobot free tier — monitor `/api/health`)
- [ ] Database backups enabled (Neon: automatic; otherwise `pg_dump` cron)
- [ ] Staff accounts created with correct roles (no sharing of owner credentials)
- [ ] Product images hosted on a CDN (Cloudinary free tier or Vercel Blob)
