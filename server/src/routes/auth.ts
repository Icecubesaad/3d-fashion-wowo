import { Router } from "express";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import { users, type AvatarProfile, type SavedOutfit } from "../models/User.js";
import { signToken } from "../utils/token.js";
import { attachUser, requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(attachUser);

const COOKIE_NAME = "token";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res: import("express").Response, token: string) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
}

/* ---------------------------------------------------------------- */
/* FR-U1: register + login                                          */
/* ---------------------------------------------------------------- */

router.post(
  "/register",
  body("name").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const user = await users.create(req.body);
      const token = signToken(user.id);
      setAuthCookie(res, token);
      return res.status(201).json({ user: users.toPublic(user), token });
    } catch (e) {
      if ((e as Error).message === "EMAIL_TAKEN")
        return res.status(409).json({ error: "Email already registered" });
      return res.status(500).json({ error: "Registration failed" });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const user = await users.findByEmail(req.body.email);
    if (!user || !(await users.verifyPassword(user, req.body.password)))
      return res.status(401).json({ error: "Invalid email or password" });
    const token = signToken(user.id);
    setAuthCookie(res, token);
    return res.json({ user: users.toPublic(user), token });
  }
);

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ ok: true });
});

/* ---------------------------------------------------------------- */
/* FR-U1 (session): current user                                    */
/* ---------------------------------------------------------------- */

router.get("/me", requireAuth, async (req, res) => {
  const user = await users.findById(req.userId!);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ user: users.toPublic(user) });
});

/* ---------------------------------------------------------------- */
/* FR-U2: password reset (token issued; email send stubbed)         */
/* ---------------------------------------------------------------- */

router.post(
  "/forgot-password",
  body("email").isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const user = await users.findByEmail(req.body.email);
    // Always 200 to avoid account enumeration.
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      await users.setResetToken(user, token, 1000 * 60 * 30); // 30 min
      // Email delivery isn't wired up yet; log the token and return it in dev.
      console.log(`[dev] password reset token for ${user.email}: ${token}`);
      if (process.env.NODE_ENV !== "production") {
        return res.json({ message: "Reset token issued", devToken: token });
      }
    }
    return res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  }
);

router.post(
  "/reset-password",
  body("token").isString().notEmpty(),
  body("password").isString().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    // Find the user that owns a valid (unexpired, matching) reset token.
    const user = await users.findByValidResetToken(req.body.token);
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });
    await users.setPassword(user, req.body.password);
    return res.json({ message: "Password updated" });
  }
);

/* ---------------------------------------------------------------- */
/* FR-U3: save / list avatar profiles                                */
/* ---------------------------------------------------------------- */

router.get("/avatar-profiles", requireAuth, async (req, res) => {
  const user = await users.findById(req.userId!);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ avatarProfiles: user.avatarProfiles });
});

router.post("/avatar-profiles", requireAuth, async (req, res) => {
  const user = await users.findById(req.userId!);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { name, gender, morphs, face, equipped } = req.body;
  if (!name || !["male", "female"].includes(gender))
    return res.status(400).json({ error: "name and gender required" });
  const profile: AvatarProfile = {
    id: crypto.randomUUID(),
    name,
    gender,
    morphs: morphs ?? {},
    face: face ?? {},
    equipped: equipped ?? [],
  };
  user.avatarProfiles.push(profile);
  await user.save();
  return res.status(201).json({ avatarProfile: profile });
});

router.delete("/avatar-profiles/:id", requireAuth, async (req, res) => {
  const user = await users.findById(req.userId!);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  user.avatarProfiles = user.avatarProfiles.filter(
    (p) => p.id !== req.params.id
  );
  await user.save();
  return res.json({ ok: true });
});

/* ---------------------------------------------------------------- */
/* FR-U4: saved outfits + order history                              */
/* ---------------------------------------------------------------- */

router.get("/saved-outfits", requireAuth, async (req, res) => {
  const user = await users.findById(req.userId!);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  return res.json({ savedOutfits: user.savedOutfits, orders: user.orders });
});

router.post("/saved-outfits", requireAuth, async (req, res) => {
  const user = await users.findById(req.userId!);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { name, items } = req.body;
  if (!name || !Array.isArray(items))
    return res.status(400).json({ error: "name and items[] required" });
  const outfit: SavedOutfit = {
    id: crypto.randomUUID(),
    name,
    items,
  };
  user.savedOutfits.push(outfit);
  await user.save();
  return res.status(201).json({ savedOutfit: outfit });
});

export default router;
