import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { isReady } from "./db.js";
import { permissionFilter } from "./middleware/permission.js";
import { sendSuccess, sendError } from "./utils/response.js";

import gamesRouter from "./routes/games.js";
import gameConfigsRouter from "./routes/gameConfigs.js";
import questionsRouter from "./routes/questions.js";
import questionBanksRouter from "./routes/questionBanks.js";
import resultsRouter from "./routes/results.js";
import gameAttemptsRouter from "./routes/gameAttempts.js";
import setupRouter from "./routes/setup.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import usersSearchRouter from "./routes/usersSearch.js";
import statsRouter from "./routes/stats.js";
import chatRouter from "./routes/chat.js";
import conversationsRouter from "./routes/conversations.js";
import seedRouter from "./routes/seed.js";
import petRouter from "./routes/pet.js";
import gameProgressRouter, { adminRouter } from "./routes/gameProgress.js";
import examResultsRouter, { adminRouter as examResultsAdminRouter } from "./routes/examResults.js";
import gamePlaysRouter from "./routes/gamePlays.js";
import dailyTasksRouter from "./routes/dailyTasks.js";
import tasksRouter from "./routes/tasks.js";
import gameEventsRouter from "./routes/gameEvents.js";
import notificationsRouter from "./routes/notifications.js";
import classesRouter from "./routes/classes.js";
import assignmentsRouter from "./routes/assignments.js";
import avatarRouter from "./routes/avatar.js";
import gardenRouter from "./routes/garden.js";
import plantTypesRouter from "./routes/plantTypes.js";
import imagesRouter from "./routes/images.js";
import gameSessionsRouter from "./routes/gameSessions.js";
import gameInvitesRouter from "./routes/gameInvites.js";
import remindersRouter from "./routes/reminders.js";
import attendanceRouter from "./routes/attendance.js";
import permissionsRouter from "./routes/permissions.js";
import miniGamesRouter from "./routes/miniGames.js";
import aiRouter from "./routes/ai.js";
import * as reminderService from "./services/reminderService.js";
import { verifyToken } from "./services/authService.js";
import { isAllowedOrigin } from "./services/refreshTokenService.js";

const app = express();

// `Access-Control-Allow-Credentials` phải được đặt TRƯỚC cors() vì cors kết thúc
// ngay request preflight (OPTIONS). Chỉ origin trong REFRESH_ALLOWED_ORIGINS mới
// được gửi cookie — mở credentials cho mọi origin nghĩa là bất kỳ website nào
// cũng đổi được access token từ cookie của người dùng.
app.use((req, res, next) => {
  if (isAllowedOrigin(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});
// `origin` là function ⇒ cors luôn phản chiếu ĐÚNG origin thay vì gửi "*".
// Bắt buộc: trình duyệt từ chối response có `Allow-Origin: *` đi kèm credentials,
// mà thiếu nó thì login/refresh từ frontend khác host (github.io ↔ API) chết đứng.
app.use(cors({ origin: (origin, cb) => cb(null, origin || true) }));
app.use(cookieParser());
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

// Bước lọc thứ hai: vai trò của token phải mang quyền tương ứng với đường dẫn
// (đúng mảng `permissions` trong GET /api/auth/me) — xem middleware/permission.js.
app.use("/api", permissionFilter);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", gameProgressRouter);
// Router học sinh phải mounts TRƯỚC các adminRouter — adminRouter dùng
// router.use(requireRoles) nên chặn mọi request student đi sau nó.
app.use("/api/users", examResultsRouter);
app.use("/api/users", adminRouter);
app.use("/api/users", examResultsAdminRouter);
// usersSearchRouter có GET "/:id" — phải mount SAU các route admin có path
// tĩnh (/game-progress…), nếu không "game-progress" bị nuốt thành userId → 404.
app.use("/api/users", usersSearchRouter);

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
app.use("/api/game-configs", gameConfigsRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/question-banks", questionBanksRouter);
app.use("/api/results", resultsRouter);
app.use("/api/game-attempts", gameAttemptsRouter);
app.use("/api/game-plays", gamePlaysRouter);
app.use("/api/daily-tasks", dailyTasksRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/game-events", gameEventsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/classes", classesRouter);
app.use("/api/assignments", assignmentsRouter);
app.use("/api/avatar", avatarRouter);
app.use("/api/garden", gardenRouter);
app.use("/api/plant-types", plantTypesRouter);
app.use("/api/images", imagesRouter);
app.use("/api/game-sessions", gameSessionsRouter);
app.use("/api/game-invites", gameInvitesRouter);
app.use("/api/reminders", remindersRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/permissions", permissionsRouter);
app.use("/api/pet", petRouter);
app.use("/api/mini", miniGamesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/conversations", conversationsRouter);
// API trung gian cho AI — Frontend chỉ gọi vào đây, Backend chính mới gọi AI Service :8081.
app.use("/api/ai", aiRouter);
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

// ── Background scheduler: check due reminders every 10s ──
setInterval(() => {
  reminderService.processDueReminders().catch((e) => {
    console.error("[ReminderScheduler] Error:", e.message);
  });
}, 10000);
console.log("[ReminderScheduler] Started — checking every 10s");
