import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    staffId?: number;
    staffRole?: string;
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorised. Please log in." });
    return;
  }
  next();
}

export function requireStaff(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.staffId) {
    res.status(401).json({ error: "Admin access required." });
    return;
  }
  next();
}

export function requireManager(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.staffId) {
    res.status(401).json({ error: "Admin access required." });
    return;
  }
  if (!["owner", "manager"].includes(req.session.staffRole ?? "")) {
    res.status(403).json({ error: "Manager or Owner access required." });
    return;
  }
  next();
}

export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.staffId) {
    res.status(401).json({ error: "Admin access required." });
    return;
  }
  if (req.session.staffRole !== "owner") {
    res.status(403).json({ error: "Owner access required." });
    return;
  }
  next();
}
