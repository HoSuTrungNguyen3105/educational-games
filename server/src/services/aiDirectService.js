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
//   /api/ai/generate-lesson    ← soạn bài học AI (AI_LESSON_CREATOR.md, chỉ đường trực tiếp)
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
  studentSystemPrompt, adminSystemPrompt, lessonSystem, lessonUser,
} from "./aiPromptFactory.js";
import { uid } from "../utils/id.js";
import {
  computeLearningMetrics, fallbackNarrative, withinPeriod, validatePeriod,
  ANALYSIS_DISCLAIMER,
} from "./aiLearningMetrics.js";
import { buildChatContext, searchLessonMaterials, searchCorrections, vietnamNowText } from "./aiChatContext.js";
import {
  resolveEffectiveTutorConfig, levelKeyForGrade, levelLabelForKey, levelKeyForLabel,
} from "./aiTutorConfigService.js";
import { recordChatLog } from "./aiChatLogService.js";
import { getEffectiveGroqModel } from "./aiModelConfig.js";
import { config } from "../config.js";
import { clientIp as clientIpOf } from "../utils/clientIp.js";

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
/** Như llmComplete nhưng kèm options cho gateway (hiện chỉ temperature — Kiểm thử Gia sư AI dùng để thử cấu hình nháp). */
const llmCompleteWithOptions = (system, messages, options) =>
  config.ollama.provider === "groq" ? groqComplete(system, messages, options) : ollamaComplete(system, messages, options);
const llmCompleteJson = (system, messages) =>
  config.ollama.provider === "groq" ? groqCompleteJson(system, messages) : ollamaCompleteJson(system, messages);

// ─────────────────────── Rate limit (port AiRateLimiter) ───────────────────────
// Cửa sổ trượt 60 giây trong bộ nhớ, theo người dùng (hoặc IP nếu chưa rõ danh
// tính). Chỉ lưu thời điểm — không lưu nội dung yêu cầu.
const RATE_LIMITS = { chat: 20, explain: 30, quiz: 10, analysis: 10 };
const RATE_WINDOW_MS = 60_000;
const rateWindows = new Map();

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

  // Môn của ngữ cảnh lượt này: môn client đang học (nếu có) — không có
  // thì lấy môn của bài học truy xuất đầu tiên. Dùng cho CẢ truy xuất
  // đính chính lẫn tra cấu hình Gia sư đã lưu theo (cấp × môn).
  const chatSubject = (typeof body.subject === "string" && body.subject.trim() !== "")
    ? body.subject.trim().slice(0, 80)
    : (context.materials[0]?.subject || null);
  const studentLevelKey = levelKeyForGrade(context.identity?.grade ?? null);

  // Đính chính kiến thức (AI Studio Tab 2): truy xuất từ khoá ƯU TIÊN
  // CAO NHẤT, chèn vào prompt trước tài liệu bài học qua chatSystem.
  // Lỗi đọc phụ bị nuốt như mọi ngữ cảnh khác — thiếu đính chính thì
  // chat vẫn chạy bình thường.
  let corrections = [];
  try {
    corrections = await searchCorrections(message, { subject: chatSubject, levelKey: studentLevelKey });
  } catch (e) {
    console.warn(`[ai] Không truy xuất được đính chính kiến thức cho chat: ${e?.message || e}`);
  }

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
    corrections,
    grade: context.identity?.grade ?? null,
    // Cờ vượt lớp do Backend nhận diện cho lượt này (aiChatContext) —
    // studentSystemPrompt dùng để chèn chỉ thị bắt buộc; prompt admin
    // không đọc trường này và staff không bao giờ bị gắn cờ.
    aboveGrade: context.aboveGrade ?? null,
    identityRole,
    adminData: context.adminData,
  };
  let system = identityRole === "admin"
    ? adminSystemPrompt(displayName, body.subject, body.topic, promptCtx)
    : identityRole === "teacher"
      ? chatSystem(displayName, body.subject, body.topic, promptCtx)
      : studentSystemPrompt(displayName, body.subject, body.topic, promptCtx);
  const messages = chatMessages(history, message);

  // Cấu hình Gia sư ĐÃ LƯU (AI Studio Tab 1 → aiTutorConfigService): áp
  // cho học sinh/giáo viên (admin dùng prompt quản trị riêng, không áp).
  // resolve trả null khi CHƯA có cấu hình nào — khi đó lượt chat chạy
  // NGUYÊN VẸN như trước (cùng prompt, cùng lời gọi gateway mặc định).
  const tutorResolved = identityRole === "admin"
    ? null
    : await resolveEffectiveTutorConfig({ grade: context.identity?.grade ?? null, subject: chatSubject });
  const tutorEntry = tutorResolved?.config || null;

  // Guardrail phạm vi của cấu hình đã lưu, chốt ở TẦNG BACKEND như
  // playground: công tắc phạm vi bật mà lượt này KHÔNG truy xuất được
  // ngữ cảnh nào (cả bài học lẫn đính chính đều rỗng) → trả thông điệp
  // từ chối theo khuôn, KHÔNG gọi model.
  const tutorScopeRefusal = !!tutorEntry
    && (tutorEntry.scopeOnly || tutorEntry.refuseOffTopic)
    && context.materials.length === 0
    && corrections.length === 0;

  let answer;
  if (tutorScopeRefusal) {
    answer = TUTOR_SCOPE_REFUSAL;
  } else if (tutorEntry) {
    system += savedTutorConfigSection({
      systemPrompt: tutorEntry.systemPrompt || null,
      strictScope: tutorEntry.scopeOnly === true,
      requireCitation: tutorEntry.requireCitation === true,
      refuseOffTopic: tutorEntry.refuseOffTopic === true,
      level: levelLabelForKey(tutorResolved.level),
      subject: chatSubject || tutorResolved.subject || null,
    }, context.materials);
    answer = await llmCompleteWithOptions(system, messages, { temperature: tutorEntry.temperature });
  } else {
    answer = await llmComplete(system, messages);
  }

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

// ─────────────── Kiểm thử Gia sư AI (AI Studio — playground) ───────────────
//
// POST /api/ai/playground/chat — giáo viên/admin THỬ cấu hình nháp của Tab
// "Cấu hình Gia sư AI" (AI Studio). Bản nháp KHÔNG phải cấu hình đã lưu:
// cấu hình chính thức (Tab 1 lưu qua /api/ai/tutor-config) được áp vào
// chat THẬT ở directChat; playground luôn chạy theo bản nháp gửi kèm để
// giáo viên xem trước tác động trước khi lưu.
// Dùng lại ĐÚNG pipeline của chat thật: cùng module truy xuất bài học đã
// xuất bản theo từ khoá (aiChatContext.searchLessonMaterials — KHÔNG phải
// vector RAG/embedding, hệ thống chưa có hạ tầng đó), cùng prompt gia sư
// (chatSystem — gồm các ràng buộc an toàn cứng: an toàn học sinh, chống
// gian lận, không bịa dữ kiện/nguồn), cùng gateway/model/rate limit.
//
// Khác chat thật ở 3 điểm có chủ đích:
//  - Truy xuất chạy với `detailed: true` để response trả kèm điểm khớp từ
//    khoá THẬT (cụm 2 từ = 2 điểm, từ đơn = 1 điểm) + từ/cụm đã khớp + điểm
//    từng đoạn — cho admin đối chiếu vì sao đoạn đó được chọn. Đây không
//    phải độ tương đồng vector.
//  - `config` là BẢN NHÁP từ Tab 1 (chưa lưu ở đâu): systemPrompt nháp được
//    CHÈN THÊM vào cuối prompt hệ thống như "chỉ thị hành vi bổ sung" (đã
//    thay biến {ten_mon_hoc}/{cap_hoc}/{ten_bai_hoc}) và TUYỆT ĐỐI không
//    ghi đè các Nguyên tắc bắt buộc của chatSystem khi xung đột; temperature
//    nháp được truyền xuống gateway; các công tắc áp dụng như dưới đây.
//  - Công tắc phạm vi (strictScope) chốt ở TẦNG BACKEND: bật mà truy xuất
//    không có đoạn nào → trả thông điệp từ chối theo khuôn, KHÔNG gọi model
//    (không để model tự kỷ luật rồi bịa nội dung ngoài bài). requireCitation
//    và refuseOffTopic áp dụng ở tầng chỉ thị prompt.
// Lượt kiểm thử ghi vào ai_chat_logs với kind="playground" — tách bạch
// khỏi lịch sử hỏi thật của học sinh (kind="chat"/"admin_query").

/** Trần temperature của bản nháp — khớp thanh trượt Tab 1 của AI Studio (0.0–0.5). */
const PLAYGROUND_TEMPERATURE_MAX = 0.5;

/** Thông điệp từ chối theo khuôn khi strictScope bật mà không có ngữ cảnh bài học. */
const STRICT_SCOPE_REFUSAL =
  "Câu hỏi này nằm ngoài phạm vi các đoạn bài học đã xuất bản mà hệ thống truy xuất được, "
  + "và cấu hình đang bật chế độ “Chỉ trả lời trong phạm vi bài học hiện tại” nên Gia sư AI "
  + "không trả lời bằng kiến thức ngoài bài. Hãy thử câu hỏi thuộc nội dung bài học đã xuất "
  + "bản, hoặc tắt công tắc phạm vi ở Tab Cấu hình rồi kiểm thử lại.";

/**
 * Bản từ chối tương ứng cho CHAT THẬT khi cấu hình Gia sư ĐÃ LƯU bật công
 * tắc phạm vi mà lượt hỏi không truy xuất được ngữ cảnh nào — câu chữ
 * hướng tới học sinh, không nhắc tới trang cấu hình/kiểm thử.
 */
const TUTOR_SCOPE_REFUSAL =
  "Câu hỏi này nằm ngoài phạm vi các đoạn bài học đã xuất bản mà hệ thống truy xuất được, "
  + "và Gia sư AI đang được cấu hình chỉ trả lời trong phạm vi bài học hiện tại nên không "
  + "trả lời bằng kiến thức ngoài bài. Con hãy thử hỏi nội dung thuộc bài học đã xuất bản nhé.";

/** Chuẩn hoá cấu hình nháp từ client — mọi field đều tuỳ chọn, sai kiểu thì bỏ qua. */
function normalizePlaygroundConfig(raw) {
  const cfg = raw && typeof raw === "object" ? raw : {};
  const text = (v, max) => {
    if (typeof v !== "string") return null;
    const s = v.trim();
    return s === "" ? null : s.slice(0, max);
  };
  let temperature;
  if (typeof cfg.temperature === "number" && Number.isFinite(cfg.temperature)) {
    temperature = Math.max(0, Math.min(PLAYGROUND_TEMPERATURE_MAX, cfg.temperature));
  }
  return {
    systemPrompt: typeof cfg.systemPrompt === "string" && cfg.systemPrompt.trim() !== ""
      ? cleanText(cfg.systemPrompt, 4000) || null
      : null,
    temperature,
    strictScope: cfg.strictScope === true,
    requireCitation: cfg.requireCitation === true,
    refuseOffTopic: cfg.refuseOffTopic === true,
    level: text(cfg.level, 40),
    subject: text(cfg.subject, 80),
  };
}

/** Thay biến soạn sẵn của Tab 1 ({ten_mon_hoc}, {cap_hoc}, {ten_bai_hoc}) bằng giá trị thật của lượt thử. */
function applyPromptVariables(text, { subject, level, lessonTitle }) {
  return text
    .replaceAll("{ten_mon_hoc}", subject || "môn học")
    .replaceAll("{cap_hoc}", level || "cấp học hiện tại")
    .replaceAll("{ten_bai_hoc}", lessonTitle || "bài học hiện tại");
}

/**
 * Các dòng CHỈ THỊ dùng chung cho khối cấu hình Gia sư — DÙNG CHUNG cho
 * cả bản NHÁP ở playground (Tab 1 chưa lưu) lẫn bản ĐÃ LƯU áp vào chat
 * thật, để hai đường không lệch nhau: cùng cách thay biến trong
 * systemPrompt, cùng câu chữ của 3 công tắc. `cfg` ở đây đã chuẩn hoá về
 * shape của playground ({ systemPrompt, strictScope, requireCitation,
 * refuseOffTopic, level: NHÃN cấp, subject }); chỉ dòng giới thiệu khối
 * prompt và dòng phạm vi là khác nhau theo ngữ cảnh gọi.
 */
function tutorDirectiveLines(cfg, materials, { promptIntro, scopeLine }) {
  const lines = [];
  if (scopeLine) lines.push(scopeLine);
  if (cfg.systemPrompt) {
    lines.push(promptIntro);
    lines.push(applyPromptVariables(cfg.systemPrompt, {
      subject: cfg.subject,
      level: cfg.level,
      lessonTitle: materials[0]?.title ?? null,
    }));
  }
  if (cfg.strictScope) {
    lines.push("- Công tắc “Chỉ trả lời trong phạm vi bài học hiện tại” ĐANG BẬT: chỉ trả lời dựa trên "
      + "TÀI LIỆU BÀI HỌC LIÊN QUAN ở trên; phần nào tài liệu không có thì nói rõ tài liệu chưa có "
      + "phần đó, không dùng kiến thức ngoài bài.");
  }
  if (cfg.requireCitation) {
    lines.push("- Công tắc “Bắt buộc trích dẫn nguồn” ĐANG BẬT: mỗi ý trả lời dựa trên tài liệu phải "
      + "kèm nguồn theo mẫu (Nguồn: bài “<tên bài học>”) ngay sau ý đó. Bài học trong hệ thống không "
      + "đính số trang vào đoạn truy xuất — trích TÊN BÀI, không bịa số trang hay mốc thời gian.");
  }
  if (cfg.refuseOffTopic) {
    lines.push("- Công tắc “Từ chối câu hỏi ngoài lề” ĐANG BẬT: nếu câu hỏi không liên quan tới môn "
      + "học/bài học trong ngữ cảnh trên, hãy từ chối nhẹ nhàng và mời hỏi nội dung trong giáo trình.");
  }
  return lines;
}

function configScopeText(cfg) {
  return [
    cfg.level ? "cấp học " + cfg.level : null,
    cfg.subject ? "môn " + cfg.subject : null,
  ].filter(Boolean).join(", ");
}

/** Khối chỉ thị cấu hình nháp chèn CUỐI system prompt — bổ sung, không thay thế ràng buộc cứng. */
function playgroundConfigSection(cfg, materials) {
  const scope = configScopeText(cfg);
  const lines = ["\nCẤU HÌNH ĐANG KIỂM THỬ (AI Studio — bản nháp do giáo viên/quản trị viên soạn để THỬ, chưa phải cấu hình chính thức):"];
  lines.push(...tutorDirectiveLines(cfg, materials, {
    scopeLine: scope ? "- Phạm vi cấu hình đang thử: " + scope + "." : null,
    promptIntro: "- CHỈ THỊ HÀNH VI BỔ SUNG từ bản nháp (áp dụng cho lượt kiểm thử này; nếu xung đột "
      + "với các Nguyên tắc bắt buộc ở trên — đặc biệt an toàn với học sinh, chống gian lận, không "
      + "bịa dữ kiện/nguồn — thì Nguyên tắc bắt buộc thắng):",
  }));
  return lines.join("\n") + "\n";
}

/**
 * Khối chỉ thị cấu hình ĐÃ LƯU (AI Studio Tab 1 → aiTutorConfigService)
 * chèn CUỐI system prompt của chat THẬT — cùng cơ chế với bản nháp ở
 * playground (chỉ khác dòng giới thiệu: đây là cấu hình chính thức).
 * `cfg` là bản đã chuẩn hoá về shape playground (scopeOnly → strictScope,
 * level đã đổi sang NHÃN cấp để thay biến {cap_hoc}).
 */
function savedTutorConfigSection(cfg, materials) {
  const scope = configScopeText(cfg);
  const lines = ["\nCẤU HÌNH GIA SƯ AI ĐÃ LƯU (AI Studio — cấu hình chính thức do giáo viên/quản trị viên thiết lập, áp dụng cho lượt trả lời này):"];
  lines.push(...tutorDirectiveLines(cfg, materials, {
    scopeLine: scope ? "- Phạm vi cấu hình đang áp dụng: " + scope + "." : null,
    promptIntro: "- CHỈ THỊ HÀNH VI BỔ SUNG từ cấu hình đã lưu (áp dụng cho lượt trả lời này; nếu xung đột "
      + "với các Nguyên tắc bắt buộc ở trên — đặc biệt an toàn với học sinh, chống gian lận, không "
      + "bịa dữ kiện/nguồn — thì Nguyên tắc bắt buộc thắng):",
  }));
  return lines.join("\n") + "\n";
}

/** Ghi log lượt kiểm thử (kind="playground") — tự nuốt lỗi như directChat. */
function logPlaygroundTurn(req, { question, answer, materials }) {
  try {
    void recordChatLog({
      userId: req?.user?.sub,
      username: req?.user?.username ?? null,
      role: req?.user?.role || null,
      grade: null,
      classId: null,
      question,
      answer,
      sources: materials,
      conversationId: null,
      kind: "playground",
    }).catch(() => {});
  } catch { /* ghi log không bao giờ được làm hỏng lượt kiểm thử */ }
}

async function directPlaygroundChat(body, req) {
  const message = normalizeChatMessage(body.message);
  const history = normalizeChatHistory(body.history);
  const cfg = normalizePlaygroundConfig(body.config);
  const displayName = (req?.user?.name && String(req.user.name).trim())
    || (req?.user?.username && String(req.user.username).trim()) || null;

  // Truy xuất bằng ĐÚNG module chat thật dùng, trên bài học ĐÃ XUẤT BẢN.
  // Lỗi đọc dữ liệu phụ bị nuốt như buildChatContext: thiếu ngữ cảnh thì
  // vẫn xử lý tiếp (strictScope sẽ tự chốt ở bước sau).
  let materials = [];
  try {
    materials = await searchLessonMaterials(message, { detailed: true });
  } catch (e) {
    console.warn(`[ai] Không truy xuất được bài học cho playground: ${e?.message || e}`);
  }

  // Đính chính kiến thức (AI Studio Tab 2) — CÙNG truy xuất với chat
  // thật: khớp từ khoá, ưu tiên cao nhất, tôn trọng phạm vi môn/cấp của
  // cấu hình nháp đang thử.
  let corrections = [];
  try {
    corrections = await searchCorrections(message, {
      subject: cfg.subject,
      levelKey: levelKeyForLabel(cfg.level),
    });
  } catch (e) {
    console.warn(`[ai] Không truy xuất được đính chính kiến thức cho playground: ${e?.message || e}`);
  }

  // Nguồn trả về client: dữ liệu truy xuất THẬT kèm điểm khớp từ khoá.
  // Đính chính đứng TRƯỚC nguồn bài học và mang `type: "correction"` để
  // UI phân biệt nhãn "Đính chính kiến thức" với nguồn bài học thường.
  const correctionSources = corrections.map((c) => omitNulls({
    type: "correction",
    title: c.topic,
    subject: c.subject || undefined,
    score: c.score,
    matchedKeywords: c.matchedKeywords?.length ? c.matchedKeywords : undefined,
    matchedPhrases: c.matchedPhrases?.length ? c.matchedPhrases : undefined,
    excerpts: [{ text: c.content, score: c.score }],
  }));
  const sources = [
    ...correctionSources,
    ...materials.map((m) => omitNulls({
      type: "lesson",
      title: m.title,
      subject: m.subject,
      grade: m.grade,
      score: m.score,
      matchedKeywords: m.matchedKeywords?.length ? m.matchedKeywords : undefined,
      matchedPhrases: m.matchedPhrases?.length ? m.matchedPhrases : undefined,
      excerpts: (m.excerpts || []).map((text, i) => ({ text, score: m.excerptScores?.[i] ?? null })),
    })),
  ];

  // Guardrail phạm vi ở tầng Backend: bật strictScope mà không có ngữ
  // cảnh nào (cả đoạn bài học lẫn đính chính đều rỗng) → từ chối theo
  // khuôn, KHÔNG gọi model. Đính chính khớp được tính là ngữ cảnh hợp lệ
  // vì đó là kiến thức chuẩn giáo viên đã duyệt cho đúng chủ đề này.
  if (cfg.strictScope && materials.length === 0 && corrections.length === 0) {
    logPlaygroundTurn(req, { question: message, answer: STRICT_SCOPE_REFUSAL, materials: [] });
    return { answer: STRICT_SCOPE_REFUSAL, refused: true, refusalReason: "strict_scope_no_context", sources: [] };
  }

  const promptCtx = {
    dateTimeText: vietnamNowText(),
    modelName: (config.ollama.provider === "groq" ? await getEffectiveGroqModel() : config.ollama.model) || null,
    modelProvider: config.ollama.provider === "groq" ? "Groq" : "Ollama",
    materials,
    corrections,
  };
  const system = chatSystem(displayName, cfg.subject, null, promptCtx)
    + playgroundConfigSection(cfg, materials);
  const messages = chatMessages(history, message);
  const answer = await llmCompleteWithOptions(system, messages,
    cfg.temperature != null ? { temperature: cfg.temperature } : {});

  let cleaned = stripLeadingQuotes(String(answer).trim());
  let truncated = false;
  if (cleaned.length > CHAT_MAX_ANSWER_LENGTH) {
    cleaned = cleaned.substring(0, CHAT_MAX_ANSWER_LENGTH) + "\n\n(AI Service đã cắt nội dung vì quá dài.)";
    truncated = true;
  }
  logPlaygroundTurn(req, { question: message, answer: cleaned, materials });
  return { answer: cleaned, refused: false, truncated, sources };
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

// ─────────────────────── Soạn bài học (AI Lesson Creator) ───────────────────────
//
// Đặc tả AI_LESSON_CREATOR.md: giáo viên nhập prompt → model trả JSON theo
// schema ĐẦU RA CỦA ĐẶC TẢ (title/objectives[]/sections[]/quick_quiz[] với
// correct_answer là VĂN BẢN đáp án) → hàm này validate + chuyển về đúng
// schema `lessons` THẬT của dự án rồi trả BẢN NHÁP CHƯA LƯU cho client.
// Endpoint KHÔNG tự ghi DB: giáo viên xem/sửa xong, client mới gọi
// POST /api/lessons như bài thường. Không ghi ai_chat_logs — theo đúng
// tiền lệ sinh câu hỏi (quiz), chỉ chat/playground mới ghi log.
//
// Ánh xạ (chi tiết ở báo cáo của đợt này):
//   title → title; objectives[] → chuỗi nối "\n"; sections[] → pages[]
//   (heading=phần tử title, hook=text dẫn nhập màu riêng ngay dưới tiêu
//   đề, content=text, example=text, key_takeaway=note, emoji hợp lệ →
//   phần tử decor góc phải trang); simulation hợp lệ của một section →
//   TRANG RIÊNG "Mô phỏng: …" ngay sau trang section đó (tối đa 2/bài,
//   sai cấu trúc → loại + meta.droppedSimulations); summary → trang
//   "Tổng kết bài học" cuối phần nội dung; estimated_time → dòng đầu của
//   description; quick_quiz[] → phần tử question ở các trang "Kiểm tra
//   nhanh", correct_answer (văn bản) → id của option khớp. Mọi trang đều
//   được gán background màu pastel (trang tổng kết dùng tông riêng).

const LESSON_LENGTHS = {
  short: { id: "short", label: "Ngắn gọn", sections: 3, quiz: 3 },
  standard: { id: "standard", label: "Tiêu chuẩn", sections: 4, quiz: 5 },
  deep: { id: "deep", label: "Chuyên sâu", sections: 6, quiz: 6 },
};

function normalizeLessonLength(raw) {
  const v = String(raw ?? "").trim().toLowerCase();
  if (["short", "ngắn gọn", "ngan gon", "ngan"].includes(v)) return LESSON_LENGTHS.short;
  if (["deep", "chuyên sâu", "chuyen sau", "detailed", "long"].includes(v)) return LESSON_LENGTHS.deep;
  return LESSON_LENGTHS.standard;
}

const LESSON_LIMITS = {
  maxPromptLength: 2000,
  maxTitleLength: 200,
  maxObjectiveLength: 300,
  maxObjectives: 6,
  maxSectionHeadingLength: 200,
  maxTextLength: 5000, // khớp trần props.text phía lessonService
  maxSections: 8,
  maxQuizQuestions: 10,
  minQuizOptions: 2,
  maxQuizOptions: 10, // khớp MAX_OPTIONS_PER_QUESTION phía lessonService
  jsonRetryAttempts: 1,
};

// Khung canvas THẬT của Studio (LessonCanvas: 1280×720). Bố cục trang sinh
// ra phải nằm trọn trong canvas vì lessonService validate hình học khi lưu.
const LESSON_LAYOUT = { x: 80, w: 1120, contentTop: 140, bottom: 700, gap: 16 };

// Màu chữ của câu dẫn nhập (hook) — dấu hiệu để panel sửa ở client nhận ra
// phần tử hook trong trang section (props.color sống sót qua validate của
// lessonService, khác với mọi trường trang trí tự chế khác).
const LESSON_HOOK_COLOR = "#B45309";
// Nền pastel cho MỌI trang sinh ra, xoay vòng theo thứ tự trang; trang
// tổng kết dùng tông riêng để học sinh nhận ra phần chốt bài.
const LESSON_PAGE_BG_PALETTE = ["#FFF6E0", "#E8F4FF", "#EAF7EE", "#FDEEF4", "#F1EBFF", "#FFF0E6"];
const LESSON_SUMMARY_BG = "#EDE9FE";
// Trần mô phỏng mỗi bài (khớp yêu cầu trong prompt): phần vượt trần bị bỏ.
const LESSON_MAX_SIMULATIONS = 2;

/** Ước lượng chiều cao khối chữ theo độ dài nội dung (font tỉ lệ ~0,52em/ký tự). */
function estimateTextHeight(text, fontSize, width) {
  const charsPerLine = Math.max(12, Math.floor(width / (fontSize * 0.52)));
  const lines = String(text).split("\n").reduce(
    (n, line) => n + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
  return Math.ceil(lines * fontSize * 1.3) + 24;
}

function lessonTextElement(type, text, fontSize, x, y, w, h, z, align, extraProps) {
  const props = { text, fontSize };
  if (align) props.align = align;
  if (extraProps) Object.assign(props, extraProps);
  return { id: uid("el"), type, x, y, w, h, z, props };
}

/**
 * Emoji của một section: hợp lệ khi là chuỗi ≤ 8 ký tự (theo điểm mã)
 * sau trim và KHÔNG chứa chữ cái/số/khoảng trắng — tức thuần biểu tượng.
 * Không hợp lệ → "" (trang đó không có phần tử decor, không lỗi cả bài).
 */
function validLessonEmoji(raw) {
  if (typeof raw !== "string") return "";
  const s = raw.trim();
  if (!s || [...s].length > 8) return "";
  if (/[\p{L}\p{N}\s]/u.test(s)) return "";
  return s;
}

/** Một section → một trang: tiêu đề + hook/content/example/key_takeaway xếp dọc + decor góc phải. */
function buildSectionPage(section) {
  const elements = [
    lessonTextElement("title", section.heading, 40, LESSON_LAYOUT.x, 36, LESSON_LAYOUT.w, 88, 0, "left"),
  ];
  if (section.emoji) {
    elements.push({
      id: uid("el"), type: "decor",
      x: 1092, y: 20, w: 116, h: 116, z: 9,
      props: { emoji: section.emoji },
    });
  }
  const parts = [];
  if (section.hook) parts.push({ type: "text", text: section.hook, fontSize: 24, color: LESSON_HOOK_COLOR });
  if (section.content) parts.push({ type: "text", text: section.content, fontSize: 24 });
  if (section.example) parts.push({ type: "text", text: section.example, fontSize: 22 });
  if (section.keyTakeaway) parts.push({ type: "note", text: section.keyTakeaway, fontSize: 20 });
  const avail = LESSON_LAYOUT.bottom - LESSON_LAYOUT.contentTop
    - LESSON_LAYOUT.gap * Math.max(0, parts.length - 1);
  const heights = parts.map((p) => estimateTextHeight(p.text, p.fontSize, LESSON_LAYOUT.w));
  let total = heights.reduce((a, b) => a + b, 0);
  if (total > avail) {
    const scale = avail / total;
    for (let i = 0; i < heights.length; i += 1) {
      heights[i] = Math.max(56, Math.floor(heights[i] * scale));
    }
    // Sau khi kẹp tối thiểu 56px vẫn có thể tràn: gọt bớt phần tử cao nhất.
    total = heights.reduce((a, b) => a + b, 0);
    let guard = 0;
    while (total > avail && guard < 100) {
      guard += 1;
      let idx = -1;
      for (let i = 0; i < heights.length; i += 1) {
        if (heights[i] > 56 && (idx < 0 || heights[i] > heights[idx])) idx = i;
      }
      if (idx < 0) break;
      const cut = Math.min(total - avail, heights[idx] - 56);
      heights[idx] -= cut;
      total -= cut;
    }
  }
  let y = LESSON_LAYOUT.contentTop;
  parts.forEach((p, i) => {
    elements.push(lessonTextElement(p.type, p.text, p.fontSize,
      LESSON_LAYOUT.x, y, LESSON_LAYOUT.w, heights[i], elements.length,
      undefined, p.color ? { color: p.color } : undefined));
    y += heights[i] + LESSON_LAYOUT.gap;
  });
  return { id: uid("page"), title: section.heading.slice(0, 200), elements };
}

/**
 * visual của simulation do AI trả: validate đúng các khoảng phía
 * lessonService (fraction/numberline/groups). Sai → null: converter BỎ
 * visual nhưng vẫn giữ mô phỏng (visual là tuỳ chọn), không loại cả bước.
 */
function convertSimulationVisual(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const intIn = (v, min, max) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= min && n <= max ? n : null;
  };
  const kind = String(raw.kind || "");
  if (kind === "fraction") {
    const denominator = intIn(raw.denominator, 2, 12);
    const numerator = denominator === null ? null : intIn(raw.numerator, 0, denominator);
    return denominator !== null && numerator !== null ? { kind, numerator, denominator } : null;
  }
  if (kind === "numberline") {
    const from = intIn(raw.from, -100, 100);
    const to = intIn(raw.to, -100, 100);
    if (from === null || to === null || from >= to) return null;
    const highlight = intIn(raw.highlight, from, to);
    return highlight !== null ? { kind, from, to, highlight } : null;
  }
  if (kind === "groups") {
    const groups = intIn(raw.groups, 1, 6);
    const perGroup = intIn(raw.perGroup, 1, 10);
    return groups !== null && perGroup !== null ? { kind, groups, perGroup } : null;
  }
  return null;
}

/**
 * Một node simulation của AI → props phần tử "simulation" THẬT, hoặc null
 * khi không dùng được (thiếu tiêu đề / dưới 2 bước có nội dung) — caller
 * đếm vào meta.droppedSimulations.
 */
function convertSimulation(node) {
  if (node == null || typeof node !== "object" || Array.isArray(node)) return null;
  const title = cleanText(jsonText(node, "title"), 120);
  if (!title) return null;
  const steps = (Array.isArray(node.steps) ? node.steps : [])
    .map((s) => cleanText(s == null ? "" : String(s), 220))
    .filter(Boolean)
    .slice(0, 5);
  if (steps.length < 2) return null;
  const out = { title, steps };
  const intro = cleanText(jsonText(node, "intro"), 300);
  if (intro) out.intro = intro;
  if (node.visual !== undefined && node.visual !== null) {
    const visual = convertSimulationVisual(node.visual);
    if (visual) out.visual = visual;
  }
  return out;
}

/** Trang mô phỏng RIÊNG ngay sau trang section của nó: một phần tử lớn giữa trang. */
function buildSimulationPage(simProps) {
  return {
    id: uid("page"),
    title: `Mô phỏng: ${simProps.title}`.slice(0, 200),
    elements: [{
      id: uid("el"), type: "simulation",
      x: 140, y: 80, w: 1000, h: 560, z: 0,
      props: simProps,
    }],
  };
}

function buildSummaryPage(summary) {
  const h = Math.min(540, Math.max(140, estimateTextHeight(summary, 24, LESSON_LAYOUT.w)));
  return {
    id: uid("page"),
    title: "Tổng kết bài học",
    elements: [
      lessonTextElement("title", "Tổng kết bài học", 40, LESSON_LAYOUT.x, 36, LESSON_LAYOUT.w, 88, 0, "left"),
      lessonTextElement("text", summary, 24, LESSON_LAYOUT.x, LESSON_LAYOUT.contentTop, LESSON_LAYOUT.w, h, 1),
    ],
  };
}

/**
 * correct_answer của đặc tả là VĂN BẢN đáp án — khớp về id của option theo
 * đúng 3 tầng như pipeline quiz (nguyên văn → thường → squeeze). Không khớp
 * đúng một option → null (câu bị loại, đếm vào meta.droppedQuestions).
 */
function resolveLessonCorrectOption(node, options) {
  const answer = jsonText(node, "correct_answer");
  if (answer == null || answer.trim() === "") return null;
  let found = options.filter((o) => o.content === answer);
  if (found.length === 0) {
    const lower = answer.toLowerCase();
    found = options.filter((o) => o.content.toLowerCase() === lower);
  }
  if (found.length === 0) {
    const squeezed = squeeze(answer);
    found = options.filter((o) => squeeze(o.content) === squeezed);
  }
  return found.length === 1 ? found[0].id : null;
}

/** Một node quick_quiz → props của phần tử question THẬT, hoặc null nếu câu không dùng được. */
function convertQuizQuestion(node) {
  if (node == null || typeof node !== "object" || Array.isArray(node)) return null;
  const prompt = cleanText(jsonText(node, "question"), 1000);
  if (!prompt) return null;
  const rawOptions = Array.isArray(node.options) ? node.options : [];
  const texts = [];
  const seen = new Set();
  for (const raw of rawOptions) {
    const text = cleanText(raw == null ? "" : String(raw), 500);
    if (!text) continue;
    // Đáp án trùng nhau (sau squeeze) làm đáp án đúng mơ hồ — loại cả câu,
    // cùng quy tắc với validateGeneratedQuestion của pipeline quiz.
    if (!seen.add(squeeze(text))) return null;
    texts.push(text);
    if (texts.length > LESSON_LIMITS.maxQuizOptions) break;
  }
  if (texts.length < LESSON_LIMITS.minQuizOptions) return null;
  const options = texts.map((content) => ({ id: uid("opt"), content }));
  const correctAnswer = resolveLessonCorrectOption(node, options);
  if (correctAnswer == null) return null;
  const props = { prompt, qtype: "single", options, correctAnswer, points: 10 };
  const explanation = cleanText(jsonText(node, "explanation"), 1000);
  if (explanation) props.explanation = explanation;
  return props;
}

/** Các câu hỏi → trang "Kiểm tra nhanh", tối đa 2 câu/trang (canvas 720px). */
function buildQuizPages(questionPropsList) {
  const pages = [];
  for (let start = 0; start < questionPropsList.length; start += 2) {
    const chunk = questionPropsList.slice(start, start + 2);
    const title = pages.length === 0 ? "Kiểm tra nhanh" : "Kiểm tra nhanh (tiếp)";
    const elements = [
      lessonTextElement("title", title, 36, LESSON_LAYOUT.x, 32, LESSON_LAYOUT.w, 72, 0, "left"),
    ];
    chunk.forEach((props, i) => {
      elements.push({
        id: uid("el"),
        type: "question",
        x: 140, y: 120 + i * 292, w: 1000, h: 276, z: elements.length,
        props,
      });
    });
    pages.push({ id: uid("page"), title, elements });
  }
  return pages;
}

/**
 * Validate + chuẩn hoá JSON thô của model về cấu trúc trung gian. Trả null
 * khi thiếu trường bắt buộc cốt lõi (tiêu đề / không có section nào dùng
 * được) — caller ném lỗi thân thiện, tuyệt đối không trả dữ liệu rác.
 */
function normalizeAiLesson(root) {
  if (root == null || typeof root !== "object" || Array.isArray(root)) return null;
  const title = cleanText(jsonText(root, "title"), LESSON_LIMITS.maxTitleLength);
  if (!title) return null;

  const sections = [];
  let droppedSimulations = 0;
  let simulationCount = 0;
  const rawSections = Array.isArray(root.sections) ? root.sections : [];
  for (const node of rawSections) {
    if (sections.length >= LESSON_LIMITS.maxSections) break;
    if (node == null || typeof node !== "object" || Array.isArray(node)) continue;
    const heading = cleanText(jsonText(node, "heading"), LESSON_LIMITS.maxSectionHeadingLength);
    const content = cleanText(jsonText(node, "content"), LESSON_LIMITS.maxTextLength);
    if (!heading && !content) continue;
    const section = {
      heading: heading || `Phần ${sections.length + 1}`,
      hook: cleanText(jsonText(node, "hook"), 300),
      emoji: validLessonEmoji(node.emoji),
      content,
      example: cleanText(jsonText(node, "example"), LESSON_LIMITS.maxTextLength),
      keyTakeaway: cleanText(jsonText(node, "key_takeaway"), 1000),
      simulation: null,
    };
    // simulation: chỉ giữ tối đa LESSON_MAX_SIMULATIONS mô phỏng mỗi bài;
    // có mặt nhưng sai cấu trúc hoặc vượt trần → bỏ + đếm dropped.
    if (node.simulation !== undefined && node.simulation !== null) {
      const sim = convertSimulation(node.simulation);
      if (sim && simulationCount < LESSON_MAX_SIMULATIONS) {
        section.simulation = sim;
        simulationCount += 1;
      } else {
        droppedSimulations += 1;
      }
    }
    sections.push(section);
  }
  if (sections.length === 0) return null;

  let rawObjectives = root.objectives;
  if (typeof rawObjectives === "string") rawObjectives = [rawObjectives];
  const objectives = (Array.isArray(rawObjectives) ? rawObjectives : [])
    .map((o) => cleanText(o == null ? "" : String(o), LESSON_LIMITS.maxObjectiveLength))
    .filter(Boolean)
    .slice(0, LESSON_LIMITS.maxObjectives);

  const quizProps = [];
  let droppedQuestions = 0;
  const rawQuiz = Array.isArray(root.quick_quiz) ? root.quick_quiz : [];
  for (const node of rawQuiz) {
    if (quizProps.length >= LESSON_LIMITS.maxQuizQuestions) break;
    const props = convertQuizQuestion(node);
    if (props) quizProps.push(props);
    else droppedQuestions += 1;
  }

  return {
    title,
    objectives,
    estimatedTime: cleanText(jsonText(root, "estimated_time"), 100),
    summary: cleanText(jsonText(root, "summary"), LESSON_LIMITS.maxTextLength),
    sections,
    quizProps,
    droppedQuestions,
    droppedSimulations,
    simulationCount,
    quizReturned: rawQuiz.length,
  };
}

/** Lỗi hết quota/giới hạn lượt gọi của provider (HTTP 429) — nhận diện qua mọi dấu hiệu hai gateway dùng. */
function isProviderRateLimit(e) {
  return e instanceof AiBackendError
    && (e.kind === "rateLimited" || e.code === "AI_RATE_LIMITED"
      || e.providerStatus === 429 || e.http_code === 429);
}

/** Chỉ thị ép JSON cho lượt fallback completion thường (lượt này không có JSON mode đỡ lưng). */
const LESSON_JSON_ONLY_SUFFIX =
  "\n\nLƯU Ý BẮT BUỘC: Chỉ trả về ĐÚNG MỘT đối tượng JSON hợp lệ theo đúng cấu trúc đã mô tả ở trên. "
  + "Không thêm bất kỳ chữ nào ngoài JSON: không lời giải thích, không câu chào, không khối markdown.";

/**
 * Lấy object JSON gốc của bài học từ model — trả object, hoặc null khi mọi
 * lượt đều không parse được (caller ném thông điệp lỗi thân thiện như cũ).
 *
 * Đường chính: JSON mode (llmCompleteJson); nội dung trả về mà không parse
 * được object thì thử lại đúng 1 lượt như trước đây.
 *
 * FALLBACK (sửa lỗi production sau PR #132): prompt v2 — schema JSON lồng
 * nhau (sections + hook + simulation{steps, visual{…}} + quick_quiz) —
 * khiến Groq bác bỏ ở tầng JSON mode bằng HTTP 400 (failed generation):
 * gateway THROW AiBackendError TRƯỚC khi có nội dung nên vòng thử lại
 * parse ở trên không bao giờ cứu được, trong khi chat thường (không JSON
 * mode) và sinh câu hỏi (JSON đơn giản hơn) vẫn khỏe cùng lúc. Khi lượt
 * JSON mode throw lỗi gateway, chuyển sang completion THƯỜNG với cùng
 * prompt + chỉ thị ép JSON rồi trích JSON từ văn bản trả về bằng
 * extractJsonPayload (bỏ fence markdown, lấy object JSON đầu tiên parse
 * được) — đưa vào đúng pipeline validate/chuyển đổi phía sau.
 *
 * Ngân sách lượt gọi model — trần cứng 3 cho MỘT lần sinh bài: mỗi đường
 * (JSON mode / fallback thường) tối đa `1 + jsonRetryAttempts` lượt như
 * tinh thần thử lại 1 lần hiện có, và tổng cả hai đường không vượt trần.
 * Ngoại lệ duy nhất: 429 của provider — hết quota thì ném ra NGAY ở bất
 * kỳ đường nào, không thử lại, không fallback (thử thêm chỉ tốn lượt).
 * Lỗi gateway của CHÍNH fallback: mọi lượt fallback đều throw (hạ tầng
 * sập hẳn, không lượt nào trả nội dung) thì ném lại lỗi gateway cuối —
 * đúng bản chất sự cố hơn là báo "sai định dạng".
 */
async function fetchLessonRoot(userPrompt) {
  const system = lessonSystem();
  const attemptsPerPath = LESSON_LIMITS.jsonRetryAttempts + 1;
  const MAX_TOTAL_CALLS = 3;
  let calls = 0;
  const parseRoot = (raw) => {
    const parsed = extractJsonPayload(raw);
    return parsed != null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  };
  const describe = (e) => `${e?.kind || "error"}${e?.providerStatus ? `/HTTP ${e.providerStatus}` : ""}: ${e?.message || e}`;

  let gatewayError = null;
  for (let attempt = 0; attempt < attemptsPerPath && calls < MAX_TOTAL_CALLS; attempt += 1) {
    calls += 1;
    let raw;
    try {
      raw = await llmCompleteJson(system, [{ role: "user", content: userPrompt }]);
    } catch (e) {
      if (isProviderRateLimit(e)) throw e;
      gatewayError = e;
      console.warn(`[ai] generate-lesson: JSON mode lỗi gateway ở lượt ${attempt + 1} (${describe(e)}) `
        + "— chuyển sang completion thường (fallback trích JSON từ văn bản).");
      break;
    }
    const root = parseRoot(raw);
    if (root != null) return root;
    console.warn(`[ai] generate-lesson: JSON không hợp lệ ở lượt ${attempt + 1}, thử lại.`);
  }
  if (gatewayError == null) return null;

  let lastFallbackError = null;
  let fallbackSawContent = false;
  for (let attempt = 0; attempt < attemptsPerPath && calls < MAX_TOTAL_CALLS; attempt += 1) {
    calls += 1;
    let raw;
    try {
      raw = await llmComplete(system, [{ role: "user", content: userPrompt + LESSON_JSON_ONLY_SUFFIX }]);
    } catch (e) {
      if (isProviderRateLimit(e)) throw e;
      lastFallbackError = e;
      console.warn(`[ai] generate-lesson: fallback completion thường lỗi gateway ở lượt ${attempt + 1} (${describe(e)}).`);
      continue;
    }
    fallbackSawContent = true;
    const root = parseRoot(raw);
    if (root != null) return root;
    console.warn(`[ai] generate-lesson: fallback trả văn bản không trích được JSON ở lượt ${attempt + 1}, thử lại.`);
  }
  if (!fallbackSawContent && lastFallbackError != null) throw lastFallbackError;
  return null;
}

async function directGenerateLesson(body) {
  const input = body != null && typeof body === "object" ? body : {};
  const prompt = cleanText(typeof input.prompt === "string" ? input.prompt : "", LESSON_LIMITS.maxPromptLength);
  if (!prompt) {
    throw new AiBackendError("Vui lòng nhập yêu cầu soạn bài (prompt) cho AI.", { httpCode: 400, kind: "upstream" });
  }
  const subject = cleanText(typeof input.subject === "string" ? input.subject : "", 100);
  if (!subject) {
    throw new AiBackendError("Vui lòng chọn môn học cho bài học.", { httpCode: 400, kind: "upstream" });
  }
  const gradeMatch = String(input.gradeLevel ?? input.grade ?? "").match(/\d+/);
  const grade = gradeMatch ? Number.parseInt(gradeMatch[0], 10) : NaN;
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
    throw new AiBackendError("Cấp học phải là một lớp từ 1 đến 5.", { httpCode: 400, kind: "upstream" });
  }
  const length = normalizeLessonLength(input.length);

  const userPrompt = enforceLimit(lessonUser({
    prompt, subject, grade,
    lengthLabel: length.label, sections: length.sections, quizCount: length.quiz,
  }));

  // Lấy JSON gốc: JSON mode trước; gateway throw (vd Groq 400 với prompt
  // v2) → fallback completion thường + trích JSON — xem fetchLessonRoot.
  const root = await fetchLessonRoot(userPrompt);
  if (root == null) {
    throw new AiBackendError(
      "AI trả về dữ liệu không đúng định dạng bài học. Hãy thử lại, hoặc viết yêu cầu soạn bài cụ thể hơn.",
      { httpCode: 502, kind: "badResponse" });
  }

  const normalized = normalizeAiLesson(root);
  if (normalized == null) {
    throw new AiBackendError(
      "AI chưa soạn được bài học đúng cấu trúc (thiếu tiêu đề hoặc phần nội dung). Hãy thử lại với yêu cầu rõ ràng hơn.",
      { httpCode: 502, kind: "badResponse" });
  }

  // subject/grade lấy từ LỰA CHỌN của giáo viên (request) — không tin bản
  // echo của AI trong JSON trả về.
  const pages = [];
  for (const s of normalized.sections) {
    pages.push(buildSectionPage(s));
    // Trang mô phỏng nằm NGAY SAU trang section của nó.
    if (s.simulation) pages.push(buildSimulationPage(s.simulation));
  }
  if (normalized.summary) pages.push(buildSummaryPage(normalized.summary));
  pages.push(...buildQuizPages(normalized.quizProps));
  // Mọi trang đều có nền pastel: xoay vòng theo thứ tự trang, riêng trang
  // tổng kết dùng tông chốt bài. normalizeBackground phía lessonService
  // chấp nhận đúng dạng { type: "color", value: "#RRGGBB" } này.
  pages.forEach((page, i) => {
    page.background = {
      type: "color",
      value: page.title === "Tổng kết bài học"
        ? LESSON_SUMMARY_BG
        : LESSON_PAGE_BG_PALETTE[i % LESSON_PAGE_BG_PALETTE.length],
    };
  });

  const warnings = ["Đây là bản nháp do AI soạn — hãy đọc lại nội dung trước khi lưu và xuất bản cho học sinh."];
  if (normalized.droppedSimulations > 0) {
    warnings.push(`${normalized.droppedSimulations} mô phỏng đã bị loại vì AI trả sai cấu trúc (thiếu tiêu đề/bước) hoặc vượt quá tối đa ${LESSON_MAX_SIMULATIONS} mô phỏng mỗi bài.`);
  }
  if (normalized.droppedQuestions > 0) {
    warnings.push(`${normalized.droppedQuestions} câu trắc nghiệm đã bị loại vì đáp án đúng không khớp với các phương án AI đưa ra.`);
  }
  if (normalized.sections.length < length.sections) {
    warnings.push(`AI chỉ soạn được ${normalized.sections.length}/${length.sections} phần nội dung theo độ dài đã chọn.`);
  }
  if (normalized.quizProps.length === 0) {
    warnings.push("AI không tạo được câu hỏi kiểm tra hợp lệ cho bài này.");
  }

  return {
    lesson: {
      title: normalized.title,
      subject,
      grade,
      // Không có field thời lượng trong schema lessons: gộp vào description.
      description: normalized.estimatedTime ? `Thời lượng dự kiến: ${normalized.estimatedTime}` : "",
      // objectives của schema thật là MỘT chuỗi — nối mỗi mục tiêu một dòng
      // (đúng cách normObjectives phía lessonService chuẩn hoá khi lưu).
      objectives: normalized.objectives.join("\n"),
      coverImage: "",
      status: "draft",
      pages,
    },
    meta: {
      length: length.id,
      sections: normalized.sections.length,
      generatedQuestions: normalized.quizProps.length,
      droppedQuestions: normalized.droppedQuestions,
      simulations: normalized.simulationCount,
      droppedSimulations: normalized.droppedSimulations,
      quizReturned: normalized.quizReturned,
      warnings,
    },
  };
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
  "/api/ai/playground/chat": { bucket: "chat", run: directPlaygroundChat },
  "/api/ai/explain": { bucket: "explain", run: directExplain },
  "/api/ai/quizzes/generate": { bucket: "quiz", run: directGenerateQuiz },
  "/api/ai/generate-lesson": { bucket: "quiz", run: directGenerateLesson },
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
