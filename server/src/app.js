import express from "express";
import cors from "cors";

import gamesRouter from "./routes/games.js";
import questionsRouter from "./routes/questions.js";
import resultsRouter from "./routes/results.js";
import setupRouter from "./routes/setup.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/games", gamesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/results", resultsRouter);
app.use("/api", setupRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Không tìm thấy endpoint: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  res.status(500).json({ message: err.message || "Lỗi máy chủ" });
});

export default app;