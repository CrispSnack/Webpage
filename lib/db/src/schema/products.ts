import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(), // 'tea' | 'snacks'
  images: jsonb("images").$type<string[]>().notNull().default([]),
  badge: text("badge"),                 // 'Bestseller' | 'New' | 'Sale' | 'Gift Pick' etc
  stock: integer("stock").notNull().default(100),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("5.00"), // 5% or 12% for snacks/tea
  weight: text("weight").default(""),   // e.g. "250g"
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectProductSchema = createSelectSchema(productsTable);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
