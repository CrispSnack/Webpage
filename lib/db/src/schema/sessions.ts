import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// connect-pg-simple expects this exact shape
export const sessionsTable = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { withTimezone: false }).notNull(),
});
