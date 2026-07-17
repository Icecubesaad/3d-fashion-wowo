import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/** Read a cookie value from the raw Cookie header (no cookie-parser dep). */
function cookieToken(req: Request): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === "token") return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/**
 * Attaches req.userId from either the httpOnly cookie (NFR-4) or the
 * Authorization: Bearer header. Does NOT reject — use requireAuth for that.
 */
export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const headerToken = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const token = cookieToken(req) || headerToken;
  if (token) {
    const payload = verifyToken(token);
    if (payload) req.userId = payload.sub;
  }
  next();
}

/** Rejects unauthenticated requests (401). */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
