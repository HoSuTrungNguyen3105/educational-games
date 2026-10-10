// routes/ai.js
//
// API TRUNG GIAN cho các chức năng AI.
//
// Kiến trúc:  Frontend → Backend chính (:5000, file này) → AI Service (:8081)
//
// Frontend KHÔNG BAO GIỜ gọi thẳng AI Service. Mọi request đi qua đây để Backend chính
// kiểm soát: xác thực, phân quyền, lấy dữ liệu nghiệp vụ cần thiết, rồi mới gọi AI Service.
//
// Nguyên tắc:
//  - Xác thực bằng `authenticate` + `requireRoles` sẵn có của dự án.
//  - Người dùng không bao giờ tự khai `studentId`/`role` — quyền lấy từ token.
//  - Chỉ truyền xuống AI Service ĐÚNG phần dữ liệu cần thiết cho tác vụ AI.
//  - Lỗi từ AI Service được chuẩn hoá rồi trả về theo envelope `sendError` của dự án;
//    không lộ stack trace, service token hay URL nội bộ.
//  - `POST /api/questions/explain-context` đã có sẵn trong `routes/questions.js` — dùng lại,
//    không tạo API trùng.

import { Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as questionService from "../services/questionService.js";
import { callAiBackend, aiBackendHealth, AiBackendError } from "../services/aiBackendService.js";

const router = Router();

const isStaff = (user) => user?.role === "teacher" || user?.role === "admin";

/** Đưa mọi lỗi từ AI Service về một kiểu lỗi chuẩn của Backend chính. */
function forwardError(res, e, endpoint) {
  if (e instanceof AiBackendError) {
    return sendError(res, e.message, e.http_code);
  }
  console.error(`[ai] Lỗi không lường trước tại ${endpoint}:`, e?.message || e);
  return sendError(res, "Dịch vụ AI đang không khả dụng. Hãy thử lại sau.", 502);
}

// ───────────────────────────── Health ─────────────────────────────

/** GET /api/ai/health — trạng thái AI Service, KHÔNG yêu cầu đăng nhập. */
router.get("/health", async (_req, res) => {
  sendSuccess(res, await aiBackendHealth());
});

// ───────────────────────────── Chat ──────────────────────────────

/** POST /api/ai/chat — chatbot AI hỗ trợ học tập. */
router.post("/chat", authenticate, async (req, res) => {
  try {
    const { message, subject, topic, conversationId, history } = req.body || {};
    const data = await callAiBackend("/api/ai/chat", {
      message: typeof message === "string" ? message.slice(0, 2000) : message,
      subject: typeof subject === "string" ? subject.slice(0, 80) : subject,
      topic: typeof topic === "string" ? topic.slice(0, 120) : topic,
      conversationId: typeof conversationId === "string" ? conversationId.slice(0, 64) : conversationId,
      history: Array.isArray(history)
        ? history.slice(-10).map((h) => ({
            role: h?.role === "assistant" ? "assistant" : "user",
            content: String(h?.content || "").slice(0, 1000),
          }))
        : undefined,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/chat");
  }
});

// ──────────────────────── Giải thích câu sai ──────────────────────

/**
 * POST /api/ai/explain — AI Bạn Học giải thích câu học sinh vừa trả lời.
 *
 * Backend chính là nơi CHẤM (dùng chung `isAnswerCorrect` với `gradeAnswers`) và dựng
 * ngữ cảnh, rồi truyền xuống AI Service. AI Service không tự chấm và không cần gọi
 * ngược lại endpoint `explain-context`.
 */
router.post("/explain", authenticate, async (req, res) => {
  try {
    const { questionId, gameId, answer, reveal, followUp } = req.body || {};
    const qid = String(questionId || "").trim();
    if (!qid) return sendError(res, "questionId là bắt buộc", 400);

    const ctx = await questionService.buildExplainContext({
      gameId: gameId ? String(gameId) : undefined,
      questionId: qid,
      answer: answer == null ? null : String(answer).slice(0, 200),
    });
    if (!ctx) return sendError(res, "Không tìm thấy câu hỏi", 404);

    const data = await callAiBackend("/api/ai/explain", {
      questionId: qid,
      answer: answer == null ? null : String(answer).slice(0, 200),
      reveal: reveal === true,
      followUp: typeof followUp === "string" ? followUp.trim().slice(0, 500) || undefined : undefined,
      context: ctx,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/explain");
  }
});

// ─────────────────────── Sinh câu hỏi (giáo viên) ─────────────────

/** POST /api/ai/quizzes/generate — chỉ giáo viên/admin. */
router.post("/quizzes/generate", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const { subject, grade, topic, difficulty, count, language, sourceContent } = req.body || {};
    const data = await callAiBackend("/api/ai/quizzes/generate", {
      subject: String(subject || "").slice(0, 80),
      grade: Number(grade) || 5,
      topic: String(topic || "").slice(0, 120),
      difficulty: typeof difficulty === "string" ? difficulty.slice(0, 16) : undefined,
      count: Math.max(1, Math.min(20, Number(count) || 5)),
      language: typeof language === "string" ? language.slice(0, 32) : undefined,
      sourceContent: typeof sourceContent === "string" ? sourceContent.slice(0, 2000) : undefined,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/quizzes/generate");
  }
});

/** POST /api/ai/generate-question — endpoint cũ, giữ nguyên hợp đồng cho client cũ. */
router.post("/generate-question", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const { subject, grade, topic, difficulty, quantity, count, content } = req.body || {};
    const data = await callAiBackend("/api/ai/generate-question", {
      subject: String(subject || "").slice(0, 80),
      grade: Number(grade) || 5,
      topic: String(topic || "").slice(0, 120),
      difficulty: typeof difficulty === "string" ? difficulty.slice(0, 16) : undefined,
      quantity: Math.max(1, Math.min(20, Number(quantity || count) || 5)),
      content: typeof content === "string" ? content.slice(0, 2000) : undefined,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/generate-question");
  }
});

// ─────────────────────── Phân tích học tập ────────────────────────

/**
 * Chốt id người dùng cần phân tích.
 * Học sinh CHỈ xem được chính mình; giáo viên/admin được xem người khác (mặc định chính mình).
 */
function resolveTargetUser(req, requestedId) {
  const me = req.user?.sub;
  const requested = String(requestedId || "").trim();
  if (!requested || requested === me) return me;
  if (!isStaff(req.user)) return null;
  return requested;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function parseDay(value, field) {
  const v = String(value || "").trim();
  if (!v) return null;
  if (!DATE_RE.test(v)) throw new AiBackendError(`${field} phải có định dạng yyyy-MM-dd.`, { httpCode: 400 });
  const d = new Date(`${v}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new AiBackendError(`${field} không hợp lệ.`, { httpCode: 400 });
  }
  return d;
}

/**
 * Lấy đúng phần dữ liệu lượt chơi AI cần: đã chấm ở server, của đúng người, trong khoảng
 * ngày và game yêu cầu. AI Service vẫn lọc lại theo danh tính nhận được — không tin dữ liệu
 * do bên ngoài gửi.
 */
async function loadScopedResults({ userId, gameId, from, to }) {
  const query = { userId, verified: true };
  if (gameId) query.gameId = String(gameId);

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = from.toISOString();
    if (to) {
      const end = new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1);
      query.createdAt.$lte = end.toISOString();
    }
  }

  return getCollection("results")
    .find(query, {
      projection: {
        _id: 0, id: 1, userId: 1, gameId: 1, score: 1, correctAnswers: 1,
        totalQuestions: 1, accuracy: 1, completionTime: 1, xpGained: 1,
        verified: 1, createdAt: 1,
      },
    })
    .sort({ createdAt: -1 })
    .limit(2000)
    .toArray();
}

/** Danh sách game liên quan, chỉ 4 trường AI cần để đổi gameId thành tên/môn/chủ đề. */
async function loadGamesFor(gameIds) {
  const ids = [...new Set(gameIds.filter(Boolean).map(String))];
  if (ids.length === 0) return [];

  const or = [{ id: { $in: ids } }, { code: { $in: ids } }];
  for (const id of ids) {
    if (/^[a-f\d]{24}$/i.test(id)) {
      try { or.push({ _id: new ObjectId(id) }); } catch { /* bỏ qua id không hợp lệ */ }
    }
  }

  return getCollection("games")
    .find({ $or: or }, { projection: { _id: 1, id: 1, code: 1, name: 1, subject: 1, topic: 1 } })
    .limit(2000)
    .toArray();
}

/**
 * POST /api/ai/learning-analysis — AI diễn giải kết quả học tập.
 * GET  /api/ai/learning-analysis — alias tiện cho kiểm tra nhanh (bộ lọc lấy ở query).
 */
async function handleLearningAnalysis(req, res) {
  try {
    const src = req.method === "GET" ? req.query || {} : req.body || {};
    const { studentId, from, to, gameId } = src;

    const targetUserId = resolveTargetUser(req, studentId);
    if (!targetUserId) {
      return sendError(res, "Bạn không có quyền xem phân tích của học sinh khác.", 403);
    }

    const fromDate = parseDay(from, "from");
    const toDate = parseDay(to, "to");
    if (fromDate && toDate && toDate < fromDate) {
      return sendError(res, "Khoảng thời gian không hợp lệ: 'to' phải sau 'from'.", 400);
    }

    const results = await loadScopedResults({
      userId: targetUserId,
      gameId: gameId ? String(gameId).slice(0, 64) : null,
      from: fromDate,
      to: toDate,
    });
    const games = await loadGamesFor(results.map((r) => r.gameId));

    const data = await callAiBackend("/api/ai/learning-analysis", {
      from: fromDate ? String(from).trim() : undefined,
      to: toDate ? String(to).trim() : undefined,
      gameId: gameId ? String(gameId).slice(0, 64) : undefined,
      results,
      games,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/learning-analysis");
  }
}

router.post("/learning-analysis", authenticate, handleLearningAnalysis);
router.get("/learning-analysis", authenticate, handleLearningAnalysis);

export default router;