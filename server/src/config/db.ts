import mongoose from "mongoose";

let connected = false;

export async function connectDB(): Promise<void> {
  if (connected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("[db] No MONGODB_URI set — auth routes will fail until a database is configured.");
    return;
  }
  await mongoose.connect(uri);
  connected = true;
  console.log("[db] Connected to MongoDB.");
}

export function isDbConnected(): boolean {
  return connected;
}
