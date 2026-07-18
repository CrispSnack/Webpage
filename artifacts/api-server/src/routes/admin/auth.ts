import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, staffTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireStaff } from "../../middlewares/auth.js";

const router = Router();

// POST /api/admin/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required." });
    }
    const [staff] = await db.select().from(staffTable).where(eq(staffTable.email, email.toLowerCase())).limit(1);
    if (!staff || !staff.active) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const valid = await bcrypt.compare(password, staff.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    req.session.staffId = staff.id;
    req.session.staffRole = staff.role;
    req.session.save((err) => {
      if (err) return res.status(500).json({ error: "Session save failed." });
      const { passwordHash: _, ...safeStaff } = staff;
      return res.json({ staff: safeStaff });
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed." });
  }
});

// POST /api/admin/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// GET /api/admin/auth/me
router.get("/me", requireStaff, async (req, res) => {
  try {
    const [staff] = await db.select().from(staffTable).where(eq(staffTable.id, req.session.staffId!)).limit(1);
    if (!staff) return res.status(404).json({ error: "Staff not found." });
    const { passwordHash: _, ...safeStaff } = staff;
    return res.json({ staff: safeStaff });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch staff." });
  }
});

export default router;
