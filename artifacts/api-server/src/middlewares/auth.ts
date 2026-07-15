import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    staffId?: number;
    staffRole?: string;
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorised. Please log in." });
  }
  next();
}

export function requireStaff(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.staffId) {
    return res.status(401).json({ error: "Admin access required." });
  }
  next();
}

export function requireManager(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.staffId) {
    return res.status(401).json({ error: "Admin access required." });
  }
  if (!["owner", "manager"].includes(req.session.staffRole ?? "")) {
    return res.status(403).json({ error: "Manager or Owner access required." });
  }
  next();
}

export function requireOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.staffId) {
    return res.status(401).json({ error: "Admin access required." });
  }
  if (req.session.staffRole !== "owner") {
    return res.status(403).json({ error: "Owner access required." });
  }
  next();
}
