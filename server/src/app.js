import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { isReady } from "./db.js";
import { sendSuccess, sendError } from "./utils/response.js";

import gamesRouter from "./routes/games.js";
import questionsRouter from "./routes/questions.js";
import resultsRouter from "./routes/results.js";
import setupRouter from "./routes/setup.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import usersSearchRouter from "./routes/usersSearch.js";
import statsRouter from "./routes/stats.js";
import chatRouter from "./routes/chat.js";
import conversationsRouter from "./routes/conversations.js";
import seedRouter from "./routes/seed.js";
import gameProgressRouter, { adminRouter } from "./routes/gameProgress.js";
import dailyTasksRouter from "./routes/dailyTasks.js";
import tasksRouter from "./routes/tasks.js";
import gameEventsRouter from "./routes/gameEvents.js";
import notificationsRouter from "./routes/notifications.js";
import classesRouter from "./routes/classes.js";
import assignmentsRouter from "./routes/assignments.js";
import avatarRouter from "./routes/avatar.js";
import { verifyToken } from "./services/authService.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  sendSuccess(res, { ok: true, ts: new Date().toISOString() });
});

// Trong lúc DB đang khởi động (cold start) → trả 503 để client retry nhanh
app.use("/api", (_req, res, next) => {
  if (isReady()) return next();
  sendError(res, "Server đang khởi động, vui lòng thử lại", 503);
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", usersSearchRouter);
app.use("/api/users", gameProgressRouter);
app.use("/api/users", adminRouter);

// GET /api/users/me — current user profile
app.get("/api/users/me", (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, "Unauthorized", 401);
    }
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    sendSuccess(res, { id: payload.sub, username: payload.username, name: payload.name, role: payload.role });
  } catch {
    sendError(res, "Token không hợp lệ hoặc đã hết hạn", 401);
  }
});
app.use("/api/games", gamesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/daily-tasks", dailyTasksRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/game-events", gameEventsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/classes", classesRouter);
app.use("/api/assignments", assignmentsRouter);
app.use("/api/avatar", avatarRouter);
app.use("/api/stats", statsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api", setupRouter);
app.use("/api", seedRouter);

app.use((req, res) => {
  sendError(res, `Không tìm thấy endpoint: ${req.method} ${req.path}`, 404);
});

app.use((err, _req, res, _next) => {
  console.error("[error]", err.message || err);
  if (err.http_code) console.error("[error] Cloudinary http_code:", err.http_code);
  if (err.name) console.error("[error] name:", err.name);
  sendError(res, err.message || "Lỗi máy chủ", 500);
});

export default app;