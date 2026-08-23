import express from "express";
import cors from "cors";
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

const app = express();

app.use(cors());
app.use(express.json());

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
app.use("/api/games", gamesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api", setupRouter);
app.use("/api", seedRouter);

app.use((req, res) => {
  sendError(res, `Không tìm thấy endpoint: ${req.method} ${req.path}`, 404);
});

app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  sendError(res, err.message || "Lỗi máy chủ", 500);
});

export default app;