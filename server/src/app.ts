import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { attachUser } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
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
