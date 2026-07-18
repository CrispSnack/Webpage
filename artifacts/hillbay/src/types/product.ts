/**
 * Product shape returned by GET /api/products and GET /api/products/:slug.
 * Matches the DB schema (lib/db/src/schema/products.ts).
 * price is a numeric string from Postgres — use parseFloat() for arithmetic.
 */
export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string | null;
  category: string;
  images: string[];
  badge: string | null;
  stock: number;
  gstRate: string;
  weight: string | null;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};
