import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { attachUser } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

// Allow the frontend (separate Railway service) to call this API with
// credentials (the httpOnly auth cookie). `*` is rejected for credentialed
// requests, so we set the explicit origin + credentials:true.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(attachUser); // populate req.userId from cookie/Bearer on every request

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Module 1: User (FR-U1..FR-U4)
app.use("/api/auth", authRoutes);

export default app;
