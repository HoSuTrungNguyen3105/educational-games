// services/aiDirectService.js
//
// Các thao tác AI chạy THẲNG tới Ollama (bỏ qua AI Service Java), dùng khi nhà
// cung cấp được chọn là Ollama trực tiếp (production/Ollama Cloud). Đây là port
// của các service Java tương ứng — prompt lấy từ aiPromptFactory (port của
// AiPromptFactory.java), tính số liệu từ aiLearningMetrics (port của
// LearningMetricsCalculator.java):
//
//   /api/ai/chat               ← AiChatService
//   /api/ai/quizzes/generate   ← AiQuizGenerationService
//   /api/ai/generate-question  ← AiQuestionService (bọc pipeline quiz, shape cũ)
//   /api/ai/explain            ← AiExplainService (ngữ cảnh inline do route chấm sẵn)
//   /api/ai/learning-analysis  ← AiLearningAnalysisService
//
// Hợp đồng trả về GIỐNG HỆT phần `data` mà đường AI Service trả hôm nay (kể cả
// việc BỎ QUA field có giá trị null như Jackson non_null phía Java), để
// routes/ai.js và frontend không phải thay đổi gì. Lỗi ném ra đều là
// AiBackendError với thông điệp tiếng Việt đã lọc; tuyệt đối không có dữ liệu giả.

import { randomInt } from "node:crypto";
import { AiBackendError } from "./aiBackendError.js";
import { ollamaComplete, ollamaCompleteJson, extractJsonPayload } from "./aiOllamaGateway.js";
import { groqComplete, groqCompleteJson } from "./aiGroqGateway.js";
import {
  chatSystem, chatMessages, quizSystem, quizUser, explainSystem, explainUser,
  followUpMessage, analysisSystem, analysisUser, enforceLimit, cleanText,
  studentSystemPrompt, adminSystemPrompt,
} from "./aiPromptFactory.js";
import {
  computeLearningMetrics, fallbackNarrative, withinPeriod, validatePeriod,
  ANALYSIS_DISCLAIMER,
} from "./aiLearningMetrics.js";
import { buildChatContext } from "./aiChatContext.js";
import { recordChatLog } from "./aiChatLogService.js";
import { getEffectiveGroqModel } from "./aiModelConfig.js";
import { config } from "../config.js";

// ─────────────────── Chọn gateway suy luận ───────────────────
// Hai gateway CÙNG giao diện (complete/completeJson): Ollama (đường trực tiếp
// cũ) và Groq (chuẩn OpenAI, thêm 2026-11-10). Chọn theo AI_PROVIDER do
// aiBackendService đã quyết ở tầng điều phối: hàm này CHỈ được gọi khi nhà
// cung cấp hiệu lực là một đường trực tiếp, nên ở đây chỉ cần phân biệt
// "groq" với phần còn lại (ollama-cloud). Mọi nghiệp vụ phía dưới (prompt,
// ngữ cảnh, validate, rate limit) dùng chung — đổi nhà cung cấp không đổi
// hành vi nghiệp vụ.
const llmComplete = (system, messages) =>
  config.ollama.provider === "groq" ? groqComplete(system, messages) : ollamaComplete(system, messages);
const llmCompleteJson = (system, messages) =>
  config.ollama.provider === "groq" ? groqCompleteJson(system, messages) : ollamaCompleteJson(system, messages);

// ─────────────────────── Rate limit (port AiRateLimiter) ───────────────────────
// Cửa sổ trượt 60 giây trong bộ nhớ, theo người dùng (hoặc IP nếu chưa rõ danh
// tính). Chỉ lưu thời điểm — không lưu nội dung yêu cầu.
const RATE_LIMITS = { chat: 20, explain: 30, quiz: 10, analysis: 10 };
const RATE_WINDOW_MS = 60_000;
const rateWindows = new Map();

function clientIpOf(req) {
  const fwd = req?.headers?.["x-forwarded-for"];
  const raw = (typeof fwd === "string" && fwd) ? fwd.split(",")[0].trim() : req?.ip || req?.socket?.remoteAddress;
  return raw ? String(raw).slice(0, 64) : "";
}

function checkRateLimit(req, bucket) {
  const limit = RATE_LIMITS[bucket];
  if (!limit) return;
  const key = bucket + ":" + (req?.user?.sub ? `user:${req.user.sub}` : `ip:${clientIpOf(req)}`);
  const now = Date.now();
  let stamps = rateWindows.get(key);
  if (!stamps) {
    stamps = [];
    rateWindows.set(key, stamps);
  }
  while (stamps.length && stamps[0] <= now - RATE_WINDOW_MS) stamps.shift();
  if (stamps.length >= limit) {
    throw new AiBackendError(
      "Bạn hỏi AI quá nhiều trong thời gian ngắn. Vui lòng đợi một lát rồi thử lại.",
      { httpCode: 429, kind: "upstream" });
  }
  stamps.push(now);
  if (rateWindows.size > 50_000) rateWindows.delete(rateWindows.keys().next().value);
}

// ─────────────────────── Tiện ích dùng chung ───────────────────────

/** Bỏ field null/undefined — khớp Jackson default-property-inclusion: non_null phía Java. */
function omitNulls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

/** Id theo đúng convention của backend: "question-"/"answer-" + 7 ký tự base36 (Ids.java). */
const ID_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
function idSuffix() {
  let s = "";
  for (let i = 0; i < 7; i++) s += ID_ALPHABET[randomInt(ID_ALPHABET.length)];
  return s;
}
const newQuestionId = () => "question-" + idSuffix();
const newAnswerId = () => "answer-" + idSuffix();

/** JsonPayloads.asText: chỉ nhận node giá trị (chuỗi/số/boolean); chuỗi rỗng → null. */
function asText(value) {
  if (value == null) return null;
  if (typeof value === "string") return value.trim() === "" ? null : value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function jsonText(node, field) {
  if (node == null || typeof node !== "object") return null;
  return asText(node[field]);
}

/** JsonPayloads.integer: chấp nhận cả số JSON lẫn chuỗi số. */
function jsonInteger(node, field) {
  const v = node?.[field];
  if (v == null) return null;
  if (typeof v === "number") return Math.trunc(v);
  if (typeof v === "string") {
    const n = Number.parseInt(v.trim(), 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function clampNum(value, min, max, fallback) {
  if (value == null) return fallback;
  return Math.max(min, Math.min(max, value));
}

function stripLeadingQuotes(text) {
  if (text.length >= 2
    && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("“") && text.endsWith("”")))) {
    return text.substring(1, text.length - 1);
  }
  return text;
}

// ─────────────────────────── Chat ───────────────────────────

const CHAT_MAX_ANSWER_LENGTH = 6000;

function normalizeChatMessage(raw) {
  const message = raw == null ? "" : String(raw).trim().replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "");
  if (message === "") {
    throw new AiBackendError("Vui lòng nhập câu hỏi.", { httpCode: 400, kind: "upstream" });
  }
  if (message.length > 2000) {
    throw new AiBackendError("Câu hỏi quá dài (tối đa 2000 ký tự).", { httpCode: 400, kind: "upstream" });
  }
  return message;
}

function normalizeChatHistory(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (raw.length > 30) {
    throw new AiBackendError("Lịch sử hội thoại quá dài.", { httpCode: 400, kind: "upstream" });
  }
  const out = [];
  for (const turn of raw) {
    if (!turn || turn.content == null || String(turn.content).trim() === "") continue;
    const role = String(turn.role ?? "").trim().toLowerCase();
    if (role !== "user" && role !== "assistant") continue;
    let content = String(turn.content).trim();
    if (content.length > 1000) content = content.substring(0, 1000);
    out.push({ role, content });
  }
  return out.length <= 10 ? out : out.slice(out.length - 10);
}

async function directChat(body, req) {
  const message = normalizeChatMessage(body.message);
  const history = normalizeChatHistory(body.history);
  const displayName = (req?.user?.name && String(req.user.name).trim())
    || (req?.user?.username && String(req.user.username).trim()) || null;

  // Ngữ cảnh Backend dựng cho lượt này (ngày giờ VN, tóm tắt học tập của
  // chính user, đoạn bài học liên quan) — buildChatContext không bao giờ ném
  // lỗi: thiếu phần nào thì system prompt thiếu phần đó, chat vẫn chạy.
  const context = await buildChatContext(req, message);
  // Tách prompt theo VAI TRÒ (update_features.md §5.2): vai trò + khối lớp
  // lấy từ ngữ cảnh Backend dựng (hồ sơ DB), không tin client. CHỈ admin
  // dùng adminSystemPrompt (kèm kết quả tra cứu thật nếu câu hỏi là câu
  // tra cứu — tra cứu cũng chỉ chạy cho admin). Giáo viên dùng prompt
  // chat thường chatSystem: không dữ liệu quản trị, không khối lớp, đóng
  // vai trò người dùng thường. Học sinh — và trường hợp chưa rõ vai trò —
  // dùng studentSystemPrompt (chatSystem cũ + khối lớp + cổng dữ liệu cá
  // nhân).
  const identityRole = context.identity?.role || req?.user?.role || null;
  const promptCtx = {
    dateTimeText: context.dateTimeText,
    // Tên model + nhà cung cấp khai trong prompt = của ĐƯỜNG ĐANG CHẠY (Groq
    // khác Ollama) để AI Bạn Học tự giới thiệu đúng sự thật như quyết định
    // đợt #66 — thiếu modelProvider thì prompt mặc định nói "qua Ollama" kể
    // cả khi đang chạy Groq (lỗi phát hiện khi kiểm chứng production #69).
    // Đường Groq lấy model HIỆU LỰC (admin có thể vừa đổi ở Cài đặt) để lời
    // giới thiệu khớp model thật sự trả lời lượt này.
    modelName: (config.ollama.provider === "groq" ? await getEffectiveGroqModel() : config.ollama.model) || null,
    modelProvider: config.ollama.provider === "groq" ? "Groq" : "Ollama",
    learning: context.learning,
    materials: context.materials,
    grade: context.identity?.grade ?? null,
    // Cờ vượt lớp do Backend nhận diện cho lượt này (aiChatContext) —
    // studentSystemPrompt dùng để chèn chỉ thị bắt buộc; prompt admin
    // không đọc trường này và staff không bao giờ bị gắn cờ.
    aboveGrade: context.aboveGrade ?? null,
    identityRole,
    adminData: context.adminData,
  };
  const system = identityRole === "admin"
    ? adminSystemPrompt(displayName, body.subject, body.topic, promptCtx)
    : identityRole === "teacher"
      ? chatSystem(displayName, body.subject, body.topic, promptCtx)
      : studentSystemPrompt(displayName, body.subject, body.topic, promptCtx);
  const messages = chatMessages(history, message);
  const answer = await llmComplete(system, messages);

  let cleaned = stripLeadingQuotes(String(answer).trim());
  let truncated = false;
  if (cleaned.length > CHAT_MAX_ANSWER_LENGTH) {
    cleaned = cleaned.substring(0, CHAT_MAX_ANSWER_LENGTH) + "\n\n(AI Service đã cắt nội dung vì quá dài.)";
    truncated = true;
  }
  const conversationId = body.conversationId == null || String(body.conversationId).trim() === ""
    ? null : String(body.conversationId).trim();
  // Lịch sử hỏi AI (trang quản trị "Lịch sử hỏi AI"): ghi NGẦM một bản ghi
  // cho lượt chat THÀNH CÔNG này rồi mới trả response. recordChatLog tự
  // nuốt lỗi và bản thân lời gọi được bọc .catch + try/catch nên việc ghi
  // không bao giờ làm hỏng/chậm response chat; danh tính lấy từ ngữ cảnh
  // Backend đã dựng (hồ sơ DB), không tin client. Lượt có chạy tra cứu
  // quản trị (context.adminData) ghi kind="admin_query" + queryType.
  // GIỚI HẠN PHẠM VI: điểm ghi nằm ở đường TRỰC TIẾP (Groq/Ollama Cloud) —
  // production đang chạy Groq nên phủ mọi lượt thật; đường AI Service Java
  // (khi config chọn "ai-service") không qua hàm này nên chưa được ghi.
  try {
    void recordChatLog({
      userId: context.identity?.userId || req?.user?.sub,
      username: req?.user?.username ?? null,
      role: context.identity?.role || req?.user?.role || null,
      grade: context.identity?.grade ?? null,
      classId: context.identity?.classId ?? null,
      question: message,
      answer: cleaned,
      sources: context.materials,
      conversationId,
      kind: context.adminData ? "admin_query" : "chat",
      queryType: context.adminData?.type ?? null,
    }).catch(() => {});
  } catch { /* ghi log không bao giờ được làm hỏng chat */ }
  return omitNulls({
    answer: cleaned,
    conversationId,
    truncated,
    // Nguồn bài học đã đưa vào ngữ cảnh (§5.5: hiển thị tham chiếu ở UI).
    // omitNulls bỏ field khi undefined — response cũ không đổi khi không có nguồn.
    sources: context.materials.length > 0
      ? context.materials.map((m) => omitNulls({ title: m.title, subject: m.subject, grade: m.grade }))
      : undefined,
  });
}

// ─────────────────────── Sinh câu hỏi ───────────────────────

const QUIZ_LIMITS = {
  maxQuestionContentLength: 500,
  maxOptionContentLength: 200,
  minOptionsPerQuestion: 4,
  maxOptionsPerQuestion: 6,
  maxQuestionsPerRequest: 20,
  jsonRetryAttempts: 1,
};

function questionsNode(root) {
  if (root == null) return null;
  if (Array.isArray(root)) return root;
  const nested = root.questions;
  return Array.isArray(nested) ? nested : null;
}

function squeeze(value) {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

/** Tìm option đúng theo nội dung (khớp chính xác → hoa thường → bỏ khoảng trắng thừa). */
function resolveCorrectOption(node, options) {
  const raw = jsonText(node, "correctAnswer");
  if (raw == null) return null;
  const want = raw.trim();
  for (const o of options) if (o.content === want) return o.id;
  const lower = want.toLowerCase();
  for (const o of options) if (o.content.toLowerCase() === lower) return o.id;
  const squeezed = squeeze(want);
  for (const o of options) if (squeeze(o.content) === squeezed) return o.id;
  return null;
}

/** @returns câu hỏi đã validate, hoặc null nếu hỏng cấu trúc và phải loại. */
function validateGeneratedQuestion(node) {
  if (node == null || typeof node !== "object" || Array.isArray(node)) return null;

  const content = cleanText(jsonText(node, "content"), QUIZ_LIMITS.maxQuestionContentLength);
  if (content === "") return null;

  const rawOptions = node.options;
  if (!Array.isArray(rawOptions)) return null;

  const options = [];
  const seen = new Set();
  for (const o of rawOptions) {
    const text = cleanText(asText(o), QUIZ_LIMITS.maxOptionContentLength);
    if (text === "") continue;
    // Trùng lặp vô nghĩa (chỉ khác khoảng trắng/hoa thường) → loại cả câu.
    if (!seen.add(squeeze(text))) return null;
    options.push(text);
    if (options.length > QUIZ_LIMITS.maxOptionsPerQuestion) break;
  }
  if (options.length < QUIZ_LIMITS.minOptionsPerQuestion) return null;

  // ID option do backend sinh, KHÔNG tin ID do LLM bịa ra.
  const typedOptions = options.map((text) => ({ id: newAnswerId(), content: text }));
  const correctId = resolveCorrectOption(node, typedOptions);
  const points = clampNum(jsonInteger(node, "points"), 1, 1000, 100);
  const timeLimit = clampNum(jsonInteger(node, "timeLimit"), 5, 300, 20);
  const explanation = cleanText(jsonText(node, "explanation"), 300);

  return {
    id: newQuestionId(),
    content,
    inputMode: "choice",
    options: typedOptions,
    ...(correctId ? { correctAnswer: correctId } : {}),
    timeLimit,
    points,
    explanation,
  };
}

/**
 * Pipeline sinh câu hỏi dùng chung cho cả endpoint mới và cũ.
 * `validateRequest` = kiểm tra bean-validation như controller Java của endpoint mới
 * (endpoint cũ dựng request trong service nên không qua lớp kiểm tra đó).
 */
async function generateQuizPipeline(body, { validateRequest }) {
  if (validateRequest) {
    if (body.subject == null || String(body.subject).trim() === "") {
      throw new AiBackendError("subject không được để trống", { httpCode: 400, kind: "upstream" });
    }
    if (body.topic == null || String(body.topic).trim() === "") {
      throw new AiBackendError("topic không được để trống", { httpCode: 400, kind: "upstream" });
    }
    if (body.grade != null && body.grade < 1) {
      throw new AiBackendError("grade phải từ 1 trở lên", { httpCode: 400, kind: "upstream" });
    }
    if (body.grade != null && body.grade > 12) {
      throw new AiBackendError("grade không được vượt quá 12", { httpCode: 400, kind: "upstream" });
    }
  }

  const count = body.count == null ? 5 : body.count;
  if (count < 1) {
    throw new AiBackendError("Số câu phải từ 1 trở lên.", { httpCode: 400, kind: "upstream" });
  }
  if (count > QUIZ_LIMITS.maxQuestionsPerRequest) {
    throw new AiBackendError("Mỗi lần chỉ sinh tối đa " + QUIZ_LIMITS.maxQuestionsPerRequest + " câu.",
      { httpCode: 400, kind: "upstream" });
  }

  const userPrompt = enforceLimit(quizUser(body, count));

  let qn = null;
  for (let attempt = 0; attempt <= QUIZ_LIMITS.jsonRetryAttempts; attempt++) {
    const raw = await llmCompleteJson(quizSystem(), [{ role: "user", content: userPrompt }]);
    const root = extractJsonPayload(raw);
    qn = questionsNode(root);
    if (qn != null) break;
    console.warn(`[ai] AI trả về JSON không đúng cấu trúc (lần ${attempt + 1}/${QUIZ_LIMITS.jsonRetryAttempts + 1})`);
  }

  if (qn == null || qn.length === 0) {
    throw new AiBackendError(
      "AI không sinh được câu hỏi nào đúng cấu trúc. Hãy thử đổi chủ đề hoặc giảm số câu.",
      { httpCode: 502, kind: "badResponse" });
  }

  const valid = [];
  const warnings = [];
  let skipped = 0;
  let needsManualAnswer = 0;
  for (const node of qn) {
    if (valid.length >= count) break;
    const q = validateGeneratedQuestion(node);
    if (q == null) {
      skipped++;
      continue;
    }
    if (!("correctAnswer" in q)) needsManualAnswer++;
    valid.push(q);
  }

  if (valid.length === 0) {
    throw new AiBackendError(
      "AI không sinh được câu hỏi nào đúng cấu trúc. Hãy thử đổi chủ đề hoặc giảm số câu.",
      { httpCode: 502, kind: "badResponse" });
  }
  if (needsManualAnswer > 0) {
    warnings.push(needsManualAnswer + " câu AI không nêu rõ đáp án đúng, cần giáo viên chọn tay.");
  }
  if (skipped > 0) {
    warnings.push(skipped + " câu bị loại vì thiếu nội dung hoặc phương án không hợp lệ.");
  }
  if (valid.length < count) {
    warnings.push("Chỉ sinh được " + valid.length + "/" + count + " câu hợp lệ.");
  }
  warnings.push("Đây là bản nháp — hãy xem lại và chỉnh sửa trước khi lưu vào trò chơi.");

  return {
    questions: valid,
    requested: count,
    generated: valid.length,
    skipped,
    needsManualAnswer,
    warnings,
  };
}

async function directGenerateQuiz(body) {
  return generateQuizPipeline(body, { validateRequest: true });
}

/** Endpoint cũ: cùng pipeline, chuyển kết quả về shape {content, options[], correctAnswer(text), points}. */
async function directGenerateQuestionLegacy(body) {
  const generated = await generateQuizPipeline({
    subject: body.subject,
    grade: body.grade,
    topic: body.topic,
    difficulty: body.difficulty,
    count: body.quantity,
    language: null,
    sourceContent: null,
  }, { validateRequest: false });

  const questions = generated.questions.map((q) => {
    const options = [];
    let correctText = null;
    for (const o of q.options) {
      options.push(o.content);
      if (o.id === q.correctAnswer) correctText = o.content;
    }
    return omitNulls({ content: q.content, options, correctAnswer: correctText, points: q.points });
  });
  return { questions };
}

// ─────────────────────── Giải thích câu sai ───────────────────────

const EXPLAIN_MAX_ANSWER_LENGTH = 4000;

function normalizeFollowUp(raw) {
  if (raw == null || String(raw).trim() === "") return null;
  const value = String(raw).trim().replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "");
  if (value === "") return null;
  return value.length > 500 ? value.substring(0, 500) : value;
}

async function directExplain(body) {
  const questionId = body.questionId == null ? "" : String(body.questionId).trim();
  if (questionId === "") {
    throw new AiBackendError("Thiếu mã câu hỏi cần giải thích.", { httpCode: 400, kind: "upstream" });
  }
  const ctx = body.context;
  if (ctx == null || ctx.content == null || String(ctx.content).trim() === "") {
    throw new AiBackendError("Không đọc được nội dung câu hỏi này.", { httpCode: 400, kind: "upstream" });
  }

  const reveal = body.reveal === true;
  const followUp = normalizeFollowUp(body.followUp);
  const messages = followUp == null
    ? [{ role: "user", content: explainUser(ctx, reveal) }]
    : [
        { role: "user", content: explainUser(ctx, reveal) },
        { role: "assistant", content: "(Đã giải thích theo yêu cầu của học sinh.)" },
        { role: "user", content: followUpMessage(followUp) },
      ];

  const answer = await llmComplete(explainSystem(), messages);
  let cleaned = answer == null ? "" : String(answer).trim();
  if (cleaned === "") {
    throw new AiBackendError("AI không trả lời được. Vui lòng thử lại.", { httpCode: 502, kind: "badResponse" });
  }
  let truncated = false;
  if (cleaned.length > EXPLAIN_MAX_ANSWER_LENGTH) {
    cleaned = cleaned.substring(0, EXPLAIN_MAX_ANSWER_LENGTH) + "\n\n(AI Service đã cắt nội dung vì quá dài.)";
    truncated = true;
  }

  const hasCorrectAnswer = ctx.correctAnswerText != null && String(ctx.correctAnswerText).trim() !== "";
  return omitNulls({
    answer: cleaned,
    questionId: ctx.questionId,
    isCorrect: ctx.isCorrect ?? null,
    answered: ctx.answered ?? null,
    revealed: reveal && hasCorrectAnswer,
    subject: ctx.subject ?? null,
    truncated,
  });
}

// ─────────────────────── Phân tích học tập ───────────────────────

const ANALYSIS_MAX_ITEM_LENGTH = 400;
const ANALYSIS_MAX_ITEMS = 5;

function clipAnalysisText(value, max) {
  if (value == null) return null;
  const v = String(value).trim().replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "");
  return v === "" ? null : (v.length <= max ? v : v.substring(0, max));
}

function analysisStrings(root, field) {
  const arr = root?.[field];
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const n of arr) {
    const v = clipAnalysisText(asText(n), ANALYSIS_MAX_ITEM_LENGTH);
    if (v != null) out.push(v);
    if (out.length >= ANALYSIS_MAX_ITEMS) break;
  }
  return out;
}

/** Đọc và GIỚI HẠN mọi trường do LLM trả về trước khi đưa ra ngoài (fromModel phía Java). */
function narrativeFromModel(root, metrics, sufficient) {
  const summary = clipAnalysisText(asText(root?.summary), ANALYSIS_MAX_ITEM_LENGTH * 2);
  if (summary == null) return null;
  let strengths = analysisStrings(root, "strengths");
  let areas = analysisStrings(root, "areasToImprove");
  let recommendations = analysisStrings(root, "recommendations");
  const encouragement = clipAnalysisText(asText(root?.encouragement), ANALYSIS_MAX_ITEM_LENGTH);

  const base = fallbackNarrative(metrics, sufficient);
  if (strengths.length === 0) strengths = base.strengths;
  if (areas.length === 0) areas = base.areasToImprove;
  if (recommendations.length === 0) recommendations = base.recommendations;
  return {
    summary,
    strengths,
    areasToImprove: areas,
    recommendations,
    encouragement: encouragement == null ? base.encouragement : encouragement,
  };
}

/** Nhờ LLM diễn giải; lỗi hạ tầng thì lùi về bản tổng hợp bằng quy tắc (như phía Java). */
async function narrateAnalysis(metrics, sufficient) {
  if (metrics.totalPlays === 0) return fallbackNarrative(metrics, false);
  const userPrompt = enforceLimit(analysisUser(metrics, sufficient));

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const raw = await llmCompleteJson(analysisSystem(), [{ role: "user", content: userPrompt }]);
      const root = extractJsonPayload(raw);
      if (root != null && typeof root === "object" && !Array.isArray(root)) {
        const n = narrativeFromModel(root, metrics, sufficient);
        if (n != null) return n;
      }
      console.warn(`[ai] AI trả về JSON phân tích không đúng cấu trúc (lần ${attempt + 1}/2)`);
    } catch (e) {
      if (e instanceof AiBackendError && ["offline", "timeout", "config", "upstream"].includes(e.kind)) {
        console.warn(`[ai] Không lấy được diễn giải từ AI: ${e.message}`);
        return fallbackNarrative(metrics, sufficient);
      }
      throw e;
    }
  }
  return fallbackNarrative(metrics, sufficient);
}

async function directLearningAnalysis(body, req) {
  const targetUserId = req?.user?.sub;
  if (!targetUserId) {
    throw new AiBackendError("Bạn cần đăng nhập để xem phân tích học tập.", { httpCode: 401, kind: "upstream" });
  }
  const from = body.from ?? null;
  const to = body.to ?? null;
  validatePeriod(from, to);

  // Route đã lọc theo người dùng đích; ở đây lọc LẠI theo người gọi + game + kỳ
  // như AI Service vẫn làm — không tin dữ liệu truyền xuống cho việc suy ra phạm vi.
  const source = Array.isArray(body.results) ? body.results : [];
  const scoped = [];
  for (const r of source) {
    if (r == null || r.verified !== true || r.userId == null || String(r.userId).trim() === "") continue;
    if (String(r.userId) !== String(targetUserId)) continue;
    if (body.gameId != null && String(body.gameId).trim() !== "" && String(body.gameId) !== String(r.gameId)) continue;
    if (!withinPeriod(r, from, to)) continue;
    scoped.push(r);
  }

  const gameIndex = new Map();
  for (const g of Array.isArray(body.games) ? body.games : []) {
    if (g == null) continue;
    const game = { name: g.name ?? null, subject: g.subject ?? null, topic: g.topic ?? null };
    for (const key of [g._id, g.id, g.code]) {
      if (key != null && String(key).trim() !== "") gameIndex.set(String(key), game);
    }
  }

  const computed = computeLearningMetrics(scoped, gameIndex, from, to);
  const narrative = await narrateAnalysis(computed.metrics, computed.dataSufficient);

  const metrics = computed.metrics;
  return {
    metrics: omitNulls({
      ...metrics,
      topics: metrics.topics.map((t) => omitNulls(t)),
      trend: omitNulls(metrics.trend),
    }),
    summary: narrative.summary,
    strengths: narrative.strengths,
    areasToImprove: narrative.areasToImprove,
    recommendations: narrative.recommendations,
    encouragement: narrative.encouragement,
    dataSufficient: computed.dataSufficient,
    disclaimer: computed.note == null ? ANALYSIS_DISCLAIMER : computed.note + " " + ANALYSIS_DISCLAIMER,
  };
}

// ─────────────────────────── Điều phối ───────────────────────────

const DIRECT_OPS = {
  "/api/ai/chat": { bucket: "chat", run: directChat },
  "/api/ai/explain": { bucket: "explain", run: directExplain },
  "/api/ai/quizzes/generate": { bucket: "quiz", run: directGenerateQuiz },
  "/api/ai/generate-question": { bucket: "quiz", run: directGenerateQuestionLegacy },
  "/api/ai/learning-analysis": { bucket: "analysis", run: directLearningAnalysis },
};

/**
 * Điểm vào DUY NHẤT của các đường TRỰC TIẾP (Ollama Cloud và Groq dùng chung
 * nghiệp vụ ở file này, chỉ khác gateway) — cùng chữ ký và cùng kiểu lỗi với
 * callAiBackend phía AI Service để aiBackendService hoán đổi trong suốt.
 */
export async function callAiDirect(path, body, req) {
  const op = DIRECT_OPS[path];
  if (!op) {
    throw new AiBackendError("Thao tác AI này chưa được hỗ trợ ở đường AI trực tiếp.",
      { httpCode: 503, kind: "config" });
  }
  checkRateLimit(req, op.bucket);
  return op.run(body ?? {}, req);
}
