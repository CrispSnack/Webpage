import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, staffTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireOwner, requireStaff } from "../../middlewares/auth.js";

const router = Router();
router.use(requireStaff);

// GET /api/admin/staff  — owner only
router.get("/", requireOwner, async (_req, res) => {
  try {
    const staff = await db.select({
      id: staffTable.id, email: staffTable.email, name: staffTable.name,
      role: staffTable.role, active: staffTable.active,
      createdAt: staffTable.createdAt, updatedAt: staffTable.updatedAt,
    }).from(staffTable).orderBy(desc(staffTable.createdAt));
    return res.json({ staff });
  } catch (err) {
    return res.status(500).json({ error: "Could not fetch staff." });
  }
});

// POST /api/admin/staff  — owner only
router.post("/", requireOwner, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "email, password, name are required." });
    }
    if (!["owner", "manager", "staff"].includes(role ?? "staff")) {
      return res.status(400).json({ error: "role must be owner, manager, or staff." });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const [member] = await db.insert(staffTable).values({
      email: email.toLowerCase().trim(), passwordHash, name: name.trim(), role: role ?? "staff",
    }).returning();
    const { passwordHash: _, ...safe } = member;
    return res.status(201).json({ staff: safe });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already in use." });
    return res.status(500).json({ error: "Could not create staff member." });
  }
});

// PUT /api/admin/staff/:id  — owner only
router.put("/:id", requireOwner, async (req, res) => {
  try {
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.role && ["owner", "manager", "staff"].includes(req.body.role)) updates.role = req.body.role;
    if (req.body.active !== undefined) updates.active = req.body.active;
    if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, 12);

    const [member] = await db.update(staffTable).set(updates).where(eq(staffTable.id, Number(req.params.id))).returning();
    if (!member) return res.status(404).json({ error: "Staff member not found." });
    const { passwordHash: _, ...safe } = member;
    return res.json({ staff: safe });
  } catch (err) {
    return res.status(500).json({ error: "Could not update staff member." });
  }
});

// DELETE /api/admin/staff/:id — soft-delete, owner only
router.delete("/:id", requireOwner, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (Number(req.params.id) === req.session.staffId) {
      return res.status(400).json({ error: "You cannot deactivate your own account." });
    }
    const [member] = await db.update(staffTable)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(staffTable.id, Number(req.params.id)))
      .returning();
    if (!member) return res.status(404).json({ error: "Staff member not found." });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Could not deactivate staff member." });
  }
});

export default router;
