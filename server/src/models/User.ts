import mongoose, { Schema, type Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * User Module data layer (FR-U1..FR-U4).
 * Mongoose model + a `users` service object that the auth routes call,
 * so route handlers stay independent of the storage implementation.
 */

export interface AvatarProfile {
  id: string;
  name: string;
  gender: "male" | "female";
  morphs: Record<string, number>;
  face?: Record<string, number>;
  equipped?: { slot: string; productId: string }[];
}

export interface SavedOutfit {
  id: string;
  name: string;
  items: { slot: string; productId: string }[];
}

interface UserDoc extends Document {
  name: string;
  email: string; // normalized lowercase
  passwordHash: string;
  avatarProfiles: AvatarProfile[];
  savedOutfits: SavedOutfit[];
  orders: string[];
  resetTokenHash?: string | null;
  resetTokenExpiry?: number | null;
  createdAt: string;
}

const userSchema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  avatarProfiles: { type: [Schema.Types.Mixed], default: [] } as any,
  savedOutfits: { type: [Schema.Types.Mixed], default: [] } as any,
  orders: { type: [String], default: [] },
  resetTokenHash: { type: String, default: null },
  resetTokenExpiry: { type: Number, default: null },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const UserModel = mongoose.model<UserDoc>("User", userSchema);

class UserService {
  async create({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserDoc> {
    const normalized = email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: normalized });
    if (existing) throw new Error("EMAIL_TAKEN");
    const passwordHash = await bcrypt.hash(password, 10);
    return UserModel.create({ name, email: normalized, passwordHash });
  }

  async findByEmail(email: string): Promise<UserDoc | null> {
    return UserModel.findOne({ email: email.trim().toLowerCase() });
  }

  async findById(id: string): Promise<UserDoc | null> {
    return UserModel.findById(id);
  }

  async verifyPassword(user: UserDoc, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async setResetToken(
    user: UserDoc,
    token: string,
    expiresInMs: number
  ): Promise<void> {
    user.resetTokenHash = await bcrypt.hash(token, 10);
    user.resetTokenExpiry = Date.now() + expiresInMs;
    await user.save();
  }

  async consumeResetToken(user: UserDoc, token: string): Promise<boolean> {
    if (!user.resetTokenHash || !user.resetTokenExpiry) return false;
    if (Date.now() > user.resetTokenExpiry) return false;
    const ok = await bcrypt.compare(token, user.resetTokenHash);
    if (ok) {
      user.resetTokenHash = null;
      user.resetTokenExpiry = null;
      await user.save();
    }
    return ok;
  }

  async setPassword(user: UserDoc, password: string): Promise<void> {
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetTokenHash = null;
    user.resetTokenExpiry = null;
    await user.save();
  }

  /** Find the user that owns a valid (unexpired, matching) reset token. */
  async findByValidResetToken(
    token: string
  ): Promise<UserDoc | null> {
    const candidates = await UserModel.find({
      resetTokenHash: { $exists: true, $ne: null },
    });
    for (const user of candidates) {
      if (await this.consumeResetToken(user, token)) return user;
    }
    return null;
  }

  toPublic(user: UserDoc) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarProfiles: user.avatarProfiles,
      savedOutfits: user.savedOutfits,
      orders: user.orders,
      createdAt: user.createdAt,
    };
  }
}

export const users = new UserService();
export type { UserDoc };
