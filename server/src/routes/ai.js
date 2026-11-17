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
//  - CỜ TÍNH NĂNG: `system_config.ai.enabled` (trang Cài đặt quản trị). Mặc định TẮT →
//    mọi endpoint AI trả 503 kèm "đang được cấu hình, chưa sử dụng được" và KHÔNG gọi
//    sang AI Service. `GET /api/ai/health` trả `available`/`notice` để UI hiện đúng câu.
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
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import * as questionService from "../services/questionService.js";
import { isOn } from "../services/systemConfigService.js";
import {
  getSavedTutorConfig, saveTutorConfig, normalizeTutorConfigInput,
} from "../services/aiTutorConfigService.js";
import {
  listCorrections, createCorrection, updateCorrection, deleteCorrection,
} from "../services/aiCorrectionService.js";
import { callAiBackend, aiBackendHealth, AiBackendError, getAiInferenceStatus, aiProviderKind } from "../services/aiBackendService.js";
import { listChatLogs, deleteChatLogs } from "../services/aiChatLogService.js";
import { computeLearningMetrics, topicDisplayName, MIN_QUESTIONS_PER_TOPIC } from "../services/aiLearningMetrics.js";
import { getAiCreditStatus } from "../services/aiUsageService.js";
import { record as auditRecord, AUDIT } from "../services/auditService.js";

const router = Router();

const isStaff = (user) => user?.role === "teacher" || user?.role === "admin";

/**
 * Thông báo khi AI chưa được bật trong Cấu hình hệ thống (system_config: ai.enabled).
 * Một câu duy nhất cho MỌI tính năng AI — frontend hiển thị đúng chuỗi này, không tự
 * đặt câu khác, để học sinh/giáo viên thấy cùng một nội dung ở mọi nơi.
 */
export const AI_UNAVAILABLE_MESSAGE =
  "Trợ lý AI đang được cấu hình, chưa sử dụng được. Bạn vẫn học và chơi game bình thường.";

/** Cờ tính năng AI. Đọc lỗi (DB chưa kịp lên) thì coi như TẮT — an toàn hơn là bật nhầm. */
async function aiFeatureEnabled() {
  try {
    return await isOn("ai.enabled");
  } catch (e) {
    console.warn(`[ai] Không đọc được cờ ai.enabled: ${e.message}`);
    return false;
  }
}

/**
 * Chặn mọi tính năng AI khi quản trị chưa bật.
 * Đặt TRƯỚC handler để request không chạm tới AI Service — kể cả khi dịch vụ Java
 * đang chạy, model chưa được kiểm chứng thì vẫn không cho gọi.
 */
function requireAiEnabled(req, res, next) {
  aiFeatureEnabled()
    .then((on) => (on ? next() : sendError(res, AI_UNAVAILABLE_MESSAGE, 503)))
    .catch(() => sendError(res, AI_UNAVAILABLE_MESSAGE, 503));
}

/** Đưa mọi lỗi từ AI Service về một kiểu lỗi chuẩn của Backend chính. */
function forwardError(res, e, endpoint) {
  if (e instanceof AiBackendError) {
    // Lỗi có mã máy đọc được (vd AI_RATE_LIMITED khi provider hết quota) thì đưa
    // kèm `errorCode` vào envelope để frontend phân biệt với lỗi chung; gợi ý
    // thời gian chờ của provider đi cả ở body lẫn header Retry-After chuẩn.
    const extra = {};
    if (e.code) extra.errorCode = e.code;
    if (e.retryAfterSeconds) {
      extra.retryAfterSeconds = e.retryAfterSeconds;
      res.set("Retry-After", String(e.retryAfterSeconds));
    }
    return sendError(res, e.message, e.http_code, extra);
  }
  console.error(`[ai] Lỗi không lường trước tại ${endpoint}:`, e?.message || e);
  return sendError(res, "Dịch vụ AI đang không khả dụng. Hãy thử lại sau.", 502);
}

// ───────────────────────────── Health ─────────────────────────────

/**
 * GET /api/ai/health — trạng thái AI cho frontend và trang Quản trị.
 * KHÔNG yêu cầu đăng nhập, KHÔNG bao giờ trả API key hay URL nội bộ của AI Service.
 *
 * Shape (thêm 2 trường so với AI Service):
 *   featureEnabled  quản trị đã bật AI trong Cấu hình hệ thống chưa
 *   available       = featureEnabled && AI Service sẵn sàng → UI có dùng được không
 *   notice          thông báo hiển thị cho người dùng khi chưa dùng được
 */
router.get("/health", async (_req, res) => {
  const featureEnabled = await aiFeatureEnabled();
  if (!featureEnabled) {
    // Chưa bật thì không gọi sang AI Service: đỡ một lượt kết nối và không lộ gì.
    return sendSuccess(res, {
      status: false,
      available: false,
      featureEnabled: false,
      configured: false,
      model: null,
      provider: null,
      detail: "AI chưa được bật trong Cấu hình hệ thống.",
      notice: AI_UNAVAILABLE_MESSAGE,
      inference: getAiInferenceStatus(),
    });
  }
  const health = await aiBackendHealth();
  const available = health?.status === true;
  sendSuccess(res, {
    ...health,
    featureEnabled: true,
    available,
    // `notice` là câu hiển thị cho học sinh → luôn dùng câu chuẩn, KHÔNG đưa `detail`
    // (tên model, HTTP code, địa chỉ AI Service) vào đây. `detail` vẫn về ở field riêng
    // để trang Cài đặt quản trị dùng.
    notice: available ? null : AI_UNAVAILABLE_MESSAGE,
  });
});

/**
 * GET /api/ai/credit-status — "credit AI còn lại hôm nay" cho khung chat
 * AI Bạn Học: hạn mức ngày của MODEL hiệu lực (cấu hình ai.daily*Limit,
 * mặc định free tier Groq) trừ bộ đếm nội bộ theo ngày UTC
 * (aiUsageService). Mọi user ĐÃ ĐĂNG NHẬP xem được (permissionFilter có
 * rule /ai/ chung = quyền cơ bản); CHƯA đăng nhập → 401 ở `authenticate`.
 * Chỉ trả SỐ LIỆU hạn mức — không key, không URL, không hạ tầng.
 * Số là ƯỚC TÍNH (estimate: true): bộ đếm chỉ gồm các lượt gọi qua
 * backend này; thân trạng thái ghi rõ nguồn số request còn lại.
 * KHÔNG qua requireAiEnabled: AI tắt thì chip phía client tự ẩn theo
 * `supported`/số liệu null, endpoint này không gọi model nên không tốn gì.
 */
router.get("/credit-status", authenticate, async (_req, res) => {
  try {
    sendSuccess(res, await getAiCreditStatus());
  } catch (e) {
    console.error(`[ai] Lỗi đọc trạng thái credit AI: ${e?.message || e}`);
    sendError(res, "Không đọc được trạng thái credit AI.", 502);
  }
});

// ───────────────────────────── Chat ──────────────────────────────

/** POST /api/ai/chat — chatbot AI hỗ trợ học tập. */
router.post("/chat", authenticate, requireAiEnabled, async (req, res) => {
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

/**
 * POST /api/ai/playground/chat — Kiểm thử Gia sư AI ở trang AI Studio
 * (Tab "Kiểm thử RAG"). CHỈ giáo viên/admin: thử cấu hình NHÁP của Tab
 * Cấu hình (systemPrompt/temperature/công tắc) trên ĐÚNG pipeline chat
 * thật — truy xuất bài học đã xuất bản theo từ khoá (không phải vector
 * RAG), prompt gia sư + ràng buộc an toàn của chatSystem, model/rate
 * limit hiện hành. Response kèm `sources` chi tiết (điểm khớp từ khoá
 * thật) và cờ `refused` khi guardrail phạm vi chặn ở tầng Backend.
 * Chỉ hỗ trợ đường AI TRỰC TIẾP (Groq/Ollama Cloud): đường AI Service
 * Java không có thao tác này nên chặn tường minh bằng 503 trung thực
 * thay vì chuyển tiếp một path không tồn tại.
 */
router.post("/playground/chat", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    if (aiProviderKind() === "ai-service") {
      return sendError(res, "Kiểm thử Gia sư AI hiện chỉ hỗ trợ khi AI chạy ở đường trực tiếp (Groq/Ollama Cloud).", 503);
    }
    const { message, history, config } = req.body || {};
    const data = await callAiBackend("/api/ai/playground/chat", {
      message: typeof message === "string" ? message.slice(0, 2000) : message,
      history: Array.isArray(history)
        ? history.slice(-10).map((h) => ({
            role: h?.role === "assistant" ? "assistant" : "user",
            content: String(h?.content || "").slice(0, 1000),
          }))
        : undefined,
      // Cấu hình nháp được aiDirectService chuẩn hoá lại (kẹp độ dài/kiểu/
      // khoảng temperature) — route chỉ chuyển tiếp, không tin client.
      config: config && typeof config === "object" ? config : undefined,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/playground/chat");
  }
});

// ─────────────── Cấu hình Gia sư AI + Đính chính kiến thức (AI Studio) ───────────────
//
// Tab 1 + Tab 2 của trang AI Studio (REFACTOR_AI_STUDIO.md Bước 2). Đây
// là các endpoint DỮ LIỆU THUẦN (đọc/ghi system_config + collection
// ai_corrections), KHÔNG gọi model — xử lý thẳng ở route qua service như
// /class-overview và /chat-logs. CHỈ giáo viên/admin; kèm requireAiEnabled
// như mọi endpoint AI Studio khác (AI tắt thì trang cấu hình cũng đóng).

/**
 * GET /api/ai/tutor-config?level=&subject= — cấu hình Gia sư ĐÃ LƯU của
 * đúng một khoá (cấp × môn). `config: null` nghĩa là khoá đó CHƯA có cấu
 * hình riêng (Tab 1 hiển thị mặc định và nói rõ điều đó).
 */
router.get("/tutor-config", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    const level = typeof req.query.level === "string" && req.query.level.trim() !== ""
      ? req.query.level.trim() : "default";
    const subject = typeof req.query.subject === "string" ? req.query.subject.trim().slice(0, 80) : "";
    const config = await getSavedTutorConfig(level, subject);
    sendSuccess(res, { level, subject, config });
  } catch (e) {
    console.error("[ai] Lỗi đọc cấu hình Gia sư AI:", e?.message || e);
    sendError(res, "Không đọc được cấu hình Gia sư AI. Hãy thử lại sau.", 500);
  }
});

/**
 * PUT /api/ai/tutor-config — lưu (tạo/ghi đè) cấu hình Gia sư của một
 * khoá. Validate + kẹp temperature [0, 0.5] ở aiTutorConfigService;
 * cấu hình có hiệu lực cho CHAT THẬT ngay từ lượt hỏi tiếp theo
 * (aiDirectService.directChat tra theo cấp × môn của học sinh).
 */
router.put("/tutor-config", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    const { level, subject, entry } = normalizeTutorConfigInput(req.body || {});
    const config = await saveTutorConfig(level, subject, entry, req.user);
    sendSuccess(res, { level, subject, config }, "Đã lưu cấu hình Gia sư AI");
  } catch (e) {
    forwardError(res, e, "/api/ai/tutor-config");
  }
});

/** GET /api/ai/corrections — danh sách đính chính kiến thức, mới nhất trước. */
router.get("/corrections", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (_req, res) => {
  try {
    sendSuccess(res, { items: await listCorrections() });
  } catch (e) {
    console.error("[ai] Lỗi đọc danh sách đính chính:", e?.message || e);
    sendError(res, "Không đọc được danh sách đính chính. Hãy thử lại sau.", 500);
  }
});

/** POST /api/ai/corrections — tạo bản ghi đính chính (topic/content bắt buộc). */
router.post("/corrections", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    const item = await createCorrection(req.body || {}, req.user?.sub);
    sendCreated(res, item, "Đã lưu đính chính kiến thức");
  } catch (e) {
    forwardError(res, e, "/api/ai/corrections");
  }
});

/** PUT /api/ai/corrections/:id — sửa bản ghi (kể cả bật/tắt `active`). */
router.put("/corrections/:id", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    const item = await updateCorrection(req.params.id, req.body || {});
    sendSuccess(res, item, "Đã cập nhật đính chính kiến thức");
  } catch (e) {
    forwardError(res, e, "/api/ai/corrections/:id");
  }
});

/** DELETE /api/ai/corrections/:id — xoá bản ghi đính chính. */
router.delete("/corrections/:id", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    const data = await deleteCorrection(req.params.id);
    sendSuccess(res, data, "Đã xoá đính chính kiến thức");
  } catch (e) {
    forwardError(res, e, "/api/ai/corrections/:id");
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
router.post("/explain", authenticate, requireAiEnabled, async (req, res) => {
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

/**
 * POST /api/ai/generate-lesson — Tạo bài học AI (AI_LESSON_CREATOR.md).
 * CHỈ giáo viên/admin: nhận { prompt, subject, gradeLevel, length } →
 * AI soạn bài học hoàn chỉnh (JSON mode) → Backend validate + chuyển về
 * đúng schema `lessons` THẬT → trả BẢN NHÁP CHƯA LƯU kèm meta (số câu
 * quiz bị loại…). Endpoint này KHÔNG ghi DB: giáo viên xem trước/sửa ở
 * trang Tạo bài học AI rồi mới lưu qua POST /api/lessons như bài thường.
 * Chỉ hỗ trợ đường AI TRỰC TIẾP (Groq/Ollama Cloud) — chặn 503 tường minh
 * như playground khi nhà cung cấp là AI Service Java.
 */
router.post("/generate-lesson", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
  try {
    if (aiProviderKind() === "ai-service") {
      return sendError(res, "Tạo bài học bằng AI hiện chỉ hỗ trợ khi AI chạy ở đường trực tiếp (Groq/Ollama Cloud).", 503);
    }
    const { prompt, subject, gradeLevel, length } = req.body || {};
    const data = await callAiBackend("/api/ai/generate-lesson", {
      // Cắt độ dài ở route như mọi endpoint AI khác; chuẩn hoá enum/kiểu
      // và validate nghiệp vụ nằm ở aiDirectService (directGenerateLesson).
      prompt: typeof prompt === "string" ? prompt.slice(0, 2000) : prompt,
      subject: typeof subject === "string" ? subject.slice(0, 100) : subject,
      gradeLevel: gradeLevel ?? undefined,
      length: typeof length === "string" ? length.slice(0, 32) : length,
    }, req);
    sendSuccess(res, data);
  } catch (e) {
    forwardError(res, e, "/api/ai/generate-lesson");
  }
});

// ─────────────────────── Sinh câu hỏi (giáo viên) ─────────────────

/** POST /api/ai/quizzes/generate — chỉ giáo viên/admin. */
router.post("/quizzes/generate", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
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
router.post("/generate-question", authenticate, requireRoles("teacher", "admin"), requireAiEnabled, async (req, res) => {
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

router.post("/learning-analysis", authenticate, requireAiEnabled, handleLearningAnalysis);
router.get("/learning-analysis", authenticate, requireAiEnabled, handleLearningAnalysis);

// ───────────────────── Tổng quan lớp (số liệu hệ thống, KHÔNG gọi AI) ─────────────────────
//
// GET /api/ai/class-overview — bức tranh toàn lớp cho trang Phân tích AI khi
// giáo viên chưa chọn học sinh cụ thể: điểm TB, tỉ lệ đúng chung, chủ đề yếu
// chung, số học sinh đã có dữ liệu. Mọi con số do computeLearningMetrics tính
// từ `results` đã verified (cùng hàm với phân tích từng học sinh) — không qua
// AI Service nên KHÔNG gắn requireAiEnabled: tắt AI vẫn xem được số liệu.
router.get("/class-overview", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const results = await getCollection("results")
      .find({ verified: true }, {
        projection: {
          _id: 0, id: 1, userId: 1, gameId: 1, score: 1, correctAnswers: 1,
          totalQuestions: 1, accuracy: 1, completionTime: 1, xpGained: 1,
          verified: 1, createdAt: 1,
        },
      })
      .sort({ createdAt: -1 })
      .limit(5000)
      .toArray();

    const games = await loadGamesFor(results.map((r) => r.gameId));
    const gameIndex = new Map();
    for (const g of games) {
      const game = { name: g.name ?? null, subject: g.subject ?? null, topic: g.topic ?? null };
      for (const key of [g._id, g.id, g.code]) {
        if (key != null && String(key).trim() !== "") gameIndex.set(String(key), game);
      }
    }

    const { metrics } = computeLearningMetrics(results, gameIndex, null, null);
    const studentsWithData = new Set(
      results.map((r) => (r.userId == null ? "" : String(r.userId))).filter(Boolean)
    ).size;
    const totalStudents = await getCollection("users").countDocuments({ role: "student" });

    // Chủ đề yếu chung: chỉ xét chủ đề đủ câu hỏi để kết luận (cùng ngưỡng
    // MIN_QUESTIONS_PER_TOPIC của phân tích từng học sinh), đúng thấp nhất lên đầu.
    const weakTopics = metrics.topics
      .filter((t) => t.questionsOffered >= MIN_QUESTIONS_PER_TOPIC)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
      .map((t) => ({
        label: topicDisplayName(t),
        subject: t.subject,
        plays: t.plays,
        questionsOffered: t.questionsOffered,
        correctAnswers: t.correctAnswers,
        accuracy: t.accuracy,
      }));

    sendSuccess(res, {
      studentsWithData,
      totalStudents,
      totalPlays: metrics.totalPlays,
      totalQuestionsOffered: metrics.totalQuestionsOffered,
      accuracy: metrics.accuracy,
      averageScore: metrics.averageScore,
      weakTopics,
    });
  } catch (e) { next(e); }
});

// ───────────────────── Lịch sử hỏi AI (chỉ admin) ─────────────────────
//
// Bản ghi do aiChatLogService ghi ngầm sau mỗi lượt chat thành công ở
// đường trực tiếp. Hai endpoint này CHỈ dành cho admin: requireRoles chốt
// ở route + rule permissionFilter riêng (/ai/chat-logs → feature reports)
// ở tầng 2. KHÔNG phụ thuộc cờ ai.enabled — tắt AI vẫn xem/dọn được lịch
// sử cũ.

/**
 * Điều kiện lọc dùng chung cho xem/xóa, lấy từ query string.
 * `from`/`to` dạng yyyy-MM-dd (ngày lịch) hoặc ISO đầy đủ.
 */
function chatLogFiltersFrom(source = {}) {
  const pick = (v, max) => (typeof v === "string" && v.trim() !== "" ? v.trim().slice(0, max) : undefined);
  return {
    userId: pick(source.userId, 80),
    username: pick(source.username, 60),
    role: pick(source.role, 24),
    kind: pick(source.kind, 24),
    from: pick(source.from, 40),
    to: pick(source.to, 40),
    q: pick(source.q, 120),
  };
}

/** GET /api/ai/chat-logs — danh sách lượt hỏi AI (mới nhất trước, phân trang). */
router.get("/chat-logs", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const data = await listChatLogs({
      ...chatLogFiltersFrom(req.query),
      page: req.query.page,
      limit: req.query.limit,
    });
    sendSuccess(res, data);
  } catch (e) {
    console.error("[ai] Lỗi đọc lịch sử hỏi AI:", e?.message || e);
    sendError(res, "Không đọc được lịch sử hỏi AI. Hãy thử lại sau.", 500);
  }
});

/**
 * DELETE /api/ai/chat-logs — xóa lịch sử theo điều kiện (query hoặc body).
 * BẮT BUỘC có ít nhất một điều kiện trong { from, to, userId } — không có
 * thì 400, tránh xóa trắng toàn bộ lịch sử vì một request thiếu tham số.
 * Xóa xong ghi audit (meta chỉ gồm điều kiện + số đã xóa).
 */
router.delete("/chat-logs", authenticate, requireRoles("admin"), async (req, res) => {
  try {
    const src = { ...(req.body || {}), ...(req.query || {}) };
    const filters = chatLogFiltersFrom(src);
    if (!filters.from && !filters.to && !filters.userId) {
      return sendError(res, "Cần ít nhất một điều kiện xóa (from, to hoặc userId) để tránh xóa toàn bộ lịch sử.", 400);
    }
    const deleted = await deleteChatLogs(filters);
    // auditService.record tự nuốt lỗi — không để lỗi ghi nhật ký làm hỏng thao tác.
    await auditRecord({
      req,
      action: AUDIT.AI_CHAT_LOGS_DELETE,
      target: "ai:chat-logs",
      message: `Xóa lịch sử hỏi AI: ${deleted} bản ghi`,
      meta: {
        deleted,
        from: filters.from ?? null,
        to: filters.to ?? null,
        userId: filters.userId ?? null,
        username: filters.username ?? null,
        role: filters.role ?? null,
        kind: filters.kind ?? null,
        q: filters.q ?? null,
      },
    });
    sendSuccess(res, { deleted }, `Đã xóa ${deleted} bản ghi lịch sử hỏi AI`);
  } catch (e) {
    console.error("[ai] Lỗi xóa lịch sử hỏi AI:", e?.message || e);
    sendError(res, "Không xóa được lịch sử hỏi AI. Hãy thử lại sau.", 500);
  }
});

export default router;