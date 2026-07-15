import { pgTable, text, serial, integer, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type OrderItem = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  gstRate: string;
  image?: string;
};

export type ShippingAddress = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type GstDetails = {
  gstin?: string;       // customer GSTIN if business buyer
  companyName?: string;
  invoiceNumber: string;
  taxableAmount: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalTax: string;
};

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),  // e.g. CNS-2024-0001
  userId: integer("user_id"),           // null for guest checkout
  guestEmail: text("guest_email"),
  status: text("status").notNull().default("pending"),
  // pending | confirmed | processing | shipped | delivered | cancelled | refunded
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  couponCode: text("coupon_code"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").$type<ShippingAddress>().notNull(),
  gstDetails: jsonb("gst_details").$type<GstDetails>(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  paymentStatus: text("payment_status").notNull().default("unpaid"), // unpaid | paid | failed | refunded
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectOrderSchema = createSelectSchema(ordersTable);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
