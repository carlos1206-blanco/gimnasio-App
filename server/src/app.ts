import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import routineRoutes from "./routes/routineRoutes";
import routineAssignmentRoutes from "./routes/routineAssignmentRoutes";
import progressRoutes from "./routes/progressRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: process.env.CLIENT_URL ?? true }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/routine-assignments", routineAssignmentRoutes);
app.use("/api/progress-logs", progressRoutes);
app.use("/api/achievements", achievementRoutes);

app.use("/api", notFoundHandler);
app.use(errorHandler);

export default app;
