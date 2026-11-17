// services/aiApi.js
//
// Client cho chức năng AI của EduPlay.
//
//   React ──> Backend chính (API_BASE) ──> AI Service (Java) ──> LLM
//
// Frontend KHÔNG biết và KHÔNG cần biết AI Service nằm ở đâu, chạy cổng nào, dùng
// API key nào. Mọi request đi qua Backend chính, nơi xác thực + phân quyền + dựng dữ liệu,
// rồi mới gọi AI Service.
//
// BA NGUYÊN TẮC của file này:
//  1. Dùng CHUNG `API_BASE` và `apiFetch` của services/api.js — không tự dựng fetch,
//     không hard-code địa chỉ của AI Service.
//  2. `AiServiceError` với `kind` giữ nguyên để UI hiện đúng thông báo tiếng Việt.
//  3. Ollama key / service token chỉ nằm ở backend, frontend không bao giờ thấy.

import { API_BASE, apiFetch, uid } from "./api.js";

/** Model local sinh nội dung chậm nên timeout rộng hơn API thường. */
const TIMEOUT_MS = Number(import.meta.env?.VITE_AI_TIMEOUT_MS) || 120_000;

/** Độ khó mà AI Service nhận. */
export const DIFFICULTIES = [
  { id: "easy", label: "Dễ" },
  { id: "medium", label: "Trung bình" },
  { id: "hard", label: "Khó" },
];

export class AiServiceError extends Error {
  constructor(message, { kind = "unknown", status = 0 } = {}) {
    super(message);
    this.name = "AiServiceError";
    this.kind = kind;          // offline|timeout|auth|forbidden|rateLimit|badRequest|server|badResponse
    this.status = status;
  }
}

/** Map mã HTTP sang thông báo tiếng Việt để UI hiện đúng nguyên nhân. */
function messageForStatus(status, payload) {
  const fromServer = payload?.msg || payload?.message;
  switch (status) {
    case 400: return fromServer || "Không nhận được yêu cầu AI này.";
    case 401: return "Bạn cần đăng nhập lại để dùng chức năng AI.";
    case 403: return fromServer || "Bạn không có quyền dùng chức năng AI này.";
    case 404: return fromServer || "Không tìm thấy chức năng AI. Vui lòng thử lại sau.";
    case 429: return fromServer || "Bạn hỏi AI hơi nhiều. Vui lòng đợi một lát rồi thử lại.";
    case 502: return fromServer || "AI trả về dữ liệu không hợp lệ. Hãy thử lại.";
    case 503: return fromServer || "Dịch vụ AI đang không khả dụng. Hãy thử lại sau.";
    case 504: return fromServer || "AI đang phản hồi chậm. Vui lòng thử lại sau.";
    default: return fromServer || `Lỗi AI (HTTP ${status}).`;
  }
}

function kindForStatus(status) {
  if (status === 400) return "badRequest";
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 429) return "rateLimit";
  if (status === 502) return "badResponse";
  if (status === 503 || status === 504) return "server";
  return "server";
}

/**
 * `API_BASE` đã chứa hậu tố `/api` (…/api), nên path phải bỏ tiền tố `/api` để không
 * dựng thành `/api/api/ai/…`. Hàm này chuẩn hoá một lần, mọi path viết "/api/ai/…"
 * như tài liệu vẫn dùng được.
 */
function aiPath(path) {
  return path.replace(/^\/api(?=\/)/, "");
}

/**
 * Gọi API AI qua Backend chính.
 * Bọc `apiFetch` để: (1) dùng chung token/envelope, (2) giữ `AiServiceError` cho UI.
 *
 * `_retries: 0` — 503 ở đây nghĩa là AI Service chưa sẵn sàng, retry chỉ làm người dùng
 * chờ thêm (mỗi lượt gọi AI đều tốn chi phí).
 */
async function aiFetch(path, { body, timeoutMs = TIMEOUT_MS, signal, method } = {}) {
  try {
    return await apiFetch(aiPath(path), {
      method: method || "POST",
      body,
      signal,
      timeoutMs,
      _retries: 0,
    });
  } catch (e) {
    if (e?.name === "AbortError" || signal?.aborted) {
      throw new AiServiceError("AI phản hồi quá lâu. Vui lòng thử lại.", { kind: "timeout" });
    }
    // apiFetch đã gắn .status và .data cho lỗi HTTP; lỗi mạng thì không có .status.
    if (e?.status) {
      throw new AiServiceError(messageForStatus(e.status, e.data), {
        kind: kindForStatus(e.status),
        status: e.status,
      });
    }
    // Chỉ coi là mất kết nối khi `fetch` thực sự ném ra (TypeError/NetworkError).
    // Lỗi kiểu khác là lỗi code — báo "không kết nối" sẽ khiến debug sai hướng.
    const isNetwork = e instanceof TypeError || e?.name === "TypeError" || e?.name === "NetworkError";
    if (!isNetwork) {
      console.error("[ai] Lỗi ngoài dự kiến:", e);
      throw new AiServiceError(e?.message || "Có lỗi xảy ra khi gọi chức năng AI.", {
        kind: "badResponse",
      });
    }
    throw new AiServiceError(
      `Không kết nối được máy chủ (${API_BASE}). Vui lòng kiểm tra kết nối rồi thử lại.`,
      { kind: "offline" }
    );
  }
}

/**
 * Chuẩn hoá 1 câu hỏi về đúng shape của hệ thống.
 *
 * Endpoint MỚI (/api/ai/quizzes/generate) đã trả sẵn shape cuối cùng:
 *   { id, content, inputMode, options: [{id, content}], timeLimit, points, correctAnswer, explanation }
 * nên hàm này gần như pass-through — chỉ sinh id khi thiếu và bỏ câu hỏi hỏng.
 *
 * Endpoint CŨ (/api/ai/generate-question) trả options dạng chuỗi và correctAnswer là
 * NỘI DUNG đáp án, nên vẫn cần map sang id cho khớp `gradeAnswer.js`.
 */
export function mapQuestion(dto, { makeId = uid } = {}) {
  if (!dto || typeof dto !== "object") return null;
  const content = String(dto.content || "").trim();
  const rawOptions = Array.isArray(dto.options) ? dto.options : [];

  const alreadyTyped = rawOptions.every((o) => o && typeof o === "object" && o.id);
  const options = rawOptions
    .map((o) => {
      if (typeof o === "string") {
        const text = o.trim();
        return text ? { id: makeId("answer"), content: text } : null;
      }
      const text = String(o?.content || "").trim();
      if (!text) return null;
      // Giữ nguyên id do Java sinh nếu có; không có thì tự sinh.
      return { id: o.id ? String(o.id) : makeId("answer"), content: text };
    })
    .filter(Boolean);

  // Cần tối thiểu 2 đáp án thì mới chơi được
  if (!content || options.length < 2) return null;

  const correctAnswer = normalizeCorrectAnswer(dto, options, { alreadyTyped });

  return {
    id: dto.id ? String(dto.id) : makeId("question"),
    content,
    inputMode: dto.inputMode || "choice",
    options,
    correctAnswer,
    timeLimit: Number(dto.timeLimit) > 0 ? Number(dto.timeLimit) : 15,
    points: Number(dto.points) > 0 ? Number(dto.points) : 100,
    ...(dto.explanation ? { explanation: String(dto.explanation) } : {}),
  };
}

/**
 * Chuẩn hoá đáp án đúng về ID của option.
 * Trả null khi không xác định được — để giáo viên chọn tay, KHÔNG đoán bừa.
 */
function normalizeCorrectAnswer(dto, options, { alreadyTyped }) {
  const want = String(dto.correctAnswer ?? "").trim();
  if (!want) return null;

  // Trường hợp đã đúng ID của option (endpoint mới, hoặc response đã map sẵn)
  if (options.some((o) => o.id === want)) return want;

  // Trường hợp là NỘI DUNG đáp án (endpoint cũ): tìm theo nội dung
  const byContent = options.find((o) => o.content === want)
    || options.find((o) => o.content.toLowerCase() === want.toLowerCase())
    || null;

  if (byContent) return byContent.id;
  // Không tìm được thì null. `alreadyTyped` chỉ để giữ intent rõ ràng khi đọc lại.
  void alreadyTyped;
  return null;
}

/**
 * Sinh câu hỏi bằng AI (endpoint mới — trả đúng schema của hệ thống).
 * @param {object}  p
 * @param {string}  p.subject
 * @param {number}  p.grade
 * @param {string}  p.topic
 * @param {string}  p.difficulty  easy | medium | hard
 * @param {number}  p.count       1..20
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{questions: object[], warnings: string[], requested, generated, skipped, needsManualAnswer}>}
 */
export async function generateQuestions({ subject, grade, topic, difficulty, count, signal } = {}) {
  if (!String(subject || "").trim()) {
    throw new AiServiceError("Thiếu môn học.", { kind: "badRequest" });
  }
  if (!String(topic || "").trim()) {
    throw new AiServiceError("Thiếu chủ đề.", { kind: "badRequest" });
  }

  const payload = {
    subject: String(subject).trim(),
    grade: Number(grade) || 5,
    topic: String(topic).trim(),
    difficulty: DIFFICULTIES.some((d) => d.id === difficulty) ? difficulty : "medium",
    count: Math.max(1, Math.min(20, Number(count) || 5)),
  };

  const json = await aiFetch("/api/ai/quizzes/generate", { body: payload, signal });

  const rawList = Array.isArray(json) ? json : json?.questions;
  if (!Array.isArray(rawList)) {
    throw new AiServiceError("AI Service không trả về danh sách câu hỏi.", { kind: "badResponse" });
  }

  const questions = rawList.map((d) => mapQuestion(d)).filter(Boolean);

  return {
    questions,
    warnings: Array.isArray(json?.warnings) ? json.warnings : [],
    requested: json?.requested ?? payload.count,
    generated: json?.generated ?? questions.length,
    skipped: json?.skipped ?? (rawList.length - questions.length),
    // Cảnh báo để UI hiển thị: có câu thiếu đáp án đúng → giáo viên phải chọn tay
    needsManualAnswer: json?.needsManualAnswer ?? questions.filter((q) => !q.correctAnswer).length,
  };
}

/**
 * Hỏi chatbot AI hỗ trợ học tập.
 *
 * Lịch sử do CLIENT quản lý và gửi kèm — AI Service không lưu hội thoại, cũng không
 * dùng `conversationId` để cấp quyền đọc bất kỳ dữ liệu nào.
 *
 * @param {object}  p
 * @param {string}  p.message
 * @param {string} [p.subject]
 * @param {string} [p.topic]
 * @param {string} [p.conversationId]
 * @param {Array<{role:"user"|"assistant", content:string}>} [p.history]
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{answer: string, conversationId: string|null, truncated: boolean}>}
 */
export async function chat({ message, subject, topic, conversationId, history = [], signal } = {}) {
  const text = String(message || "").trim();
  if (!text) {
    throw new AiServiceError("Bạn chưa nhập câu hỏi.", { kind: "badRequest" });
  }
  if (text.length > 2000) {
    throw new AiServiceError("Câu hỏi quá dài (tối đa 2000 ký tự).", { kind: "badRequest" });
  }

  // Chỉ gửi lượt gần nhất và cắt bớt để prompt không phình to.
  const trimmed = history.slice(-10).map((h) => ({
    role: h.role === "assistant" ? "assistant" : "user",
    content: String(h.content || "").slice(0, 1000),
  }));

  const json = await aiFetch("/api/ai/chat", {
    body: {
      message: text,
      subject: subject || undefined,
      topic: topic || undefined,
      conversationId: conversationId || undefined,
      history: trimmed,
    },
    signal,
  });

  if (!json || typeof json.answer !== "string" || !json.answer.trim()) {
    throw new AiServiceError("AI không trả lời được. Hãy thử lại.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Kiểm thử Gia sư AI ở trang AI Studio (Tab "Kiểm thử RAG") — CHỈ giáo
 * viên/admin. Gửi kèm `config` là BẢN NHÁP của Tab Cấu hình (chưa lưu ở
 * đâu) để backend thử đúng cấu hình đó trên pipeline chat thật: truy
 * xuất bài học đã xuất bản theo từ khoá + model hiện hành.
 *
 * @param {object}  p
 * @param {string}  p.message
 * @param {Array<{role:"user"|"assistant", content:string}>} [p.history]
 * @param {object} [p.config] { systemPrompt?, temperature?, strictScope?,
 *   requireCitation?, refuseOffTopic?, level?, subject? }
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{answer: string, refused: boolean, refusalReason?: string,
 *   truncated?: boolean, sources: Array<{title: string, subject: string|null,
 *   grade: number|null, score: number, matchedKeywords?: string[],
 *   matchedPhrases?: string[], excerpts: Array<{text: string, score: number|null}>}>}>}
 *   `score` là điểm khớp TỪ KHOÁ của cơ chế truy xuất (cụm 2 từ = 2 điểm,
 *   từ đơn = 1 điểm) — không phải độ tương đồng vector.
 */
export async function playgroundChat({ message, history = [], config, signal } = {}) {
  const text = String(message || "").trim();
  if (!text) {
    throw new AiServiceError("Bạn chưa nhập câu hỏi.", { kind: "badRequest" });
  }
  if (text.length > 2000) {
    throw new AiServiceError("Câu hỏi quá dài (tối đa 2000 ký tự).", { kind: "badRequest" });
  }

  const trimmed = history.slice(-10).map((h) => ({
    role: h.role === "assistant" ? "assistant" : "user",
    content: String(h.content || "").slice(0, 1000),
  }));

  const json = await aiFetch("/api/ai/playground/chat", {
    body: { message: text, history: trimmed, config: config || undefined },
    signal,
  });

  if (!json || typeof json.answer !== "string" || !json.answer.trim()) {
    throw new AiServiceError("AI không trả lời được. Hãy thử lại.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Cấu hình Gia sư AI ĐÃ LƯU (AI Studio Tab 1) — chỉ giáo viên/admin.
 * Lưu ở system_config phía backend theo khoá (cấp × môn) và áp vào chat
 * THẬT của học sinh; khác với `config` nháp gửi kèm playgroundChat.
 *
 * @param {string} level   "default" | "tieu-hoc" | "thcs" | "thpt" | "dai-hoc"
 * @param {string} subject tên môn, "" = mọi môn
 * @returns {Promise<{level: string, subject: string, config: null | {
 *   systemPrompt: string, temperature: number, scopeOnly: boolean,
 *   requireCitation: boolean, refuseOffTopic: boolean, updatedAt: string|null}}>}
 *   `config: null` = khoá đó chưa có cấu hình riêng.
 */
export async function getTutorConfig(level, subject) {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (subject) params.set("subject", subject);
  const qs = params.toString();
  const json = await aiFetch(`/api/ai/tutor-config${qs ? `?${qs}` : ""}`, { method: "GET" });
  if (!json || typeof json !== "object") {
    throw new AiServiceError("Không đọc được cấu hình Gia sư AI.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Lưu cấu hình Gia sư AI cho một khoá (cấp × môn).
 * @param {object} p { level, subject, systemPrompt, temperature,
 *   scopeOnly, requireCitation, refuseOffTopic }
 * @returns {Promise<{level: string, subject: string, config: object}>}
 */
export async function saveTutorConfig(p = {}) {
  const json = await aiFetch("/api/ai/tutor-config", {
    method: "PUT",
    body: {
      level: p.level || "default",
      subject: p.subject || "",
      systemPrompt: p.systemPrompt || "",
      temperature: typeof p.temperature === "number" ? p.temperature : 0.2,
      scopeOnly: p.scopeOnly === true,
      requireCitation: p.requireCitation === true,
      refuseOffTopic: p.refuseOffTopic === true,
    },
  });
  if (!json || !json.config) {
    throw new AiServiceError("Không lưu được cấu hình Gia sư AI.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Đính chính kiến thức (AI Studio Tab 2) — chỉ giáo viên/admin. Bản ghi
 * được Gia sư AI truy xuất theo TỪ KHOÁ với ưu tiên cao nhất khi học
 * sinh hỏi đúng chủ đề (hệ thống không có embedding/vector).
 *
 * @returns {Promise<{items: Array<{id: string, subject: string, level: string,
 *   topic: string, content: string, active: boolean, createdAt: string,
 *   updatedAt: string}>}>}
 */
export async function listCorrections() {
  const json = await aiFetch("/api/ai/corrections", { method: "GET" });
  if (!json || !Array.isArray(json.items)) {
    throw new AiServiceError("Không đọc được danh sách đính chính kiến thức.", { kind: "badResponse" });
  }
  return json;
}

/** Tạo bản ghi đính chính mới. `subject`/`level` để "" = áp dụng mọi môn/mọi cấp. */
export async function createCorrection(p = {}) {
  const json = await aiFetch("/api/ai/corrections", {
    body: {
      subject: p.subject || "",
      level: p.level || "",
      topic: String(p.topic || ""),
      content: String(p.content || ""),
    },
  });
  if (!json || !json.id) {
    throw new AiServiceError("Không lưu được đính chính kiến thức.", { kind: "badResponse" });
  }
  return json;
}

/** Sửa bản ghi đính chính (gửi field nào đổi field đó; `active` để bật/tắt). */
export async function updateCorrection(id, p = {}) {
  const body = {};
  for (const key of ["subject", "level", "topic", "content"]) {
    if (p[key] !== undefined) body[key] = String(p[key]);
  }
  if (p.active !== undefined) body.active = p.active === true;
  const json = await aiFetch(`/api/ai/corrections/${encodeURIComponent(id)}`, { method: "PUT", body });
  if (!json || !json.id) {
    throw new AiServiceError("Không cập nhật được đính chính kiến thức.", { kind: "badResponse" });
  }
  return json;
}

/** Xoá bản ghi đính chính. */
export async function deleteCorrection(id) {
  const json = await aiFetch(`/api/ai/corrections/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!json || !json.id) {
    throw new AiServiceError("Không xoá được đính chính kiến thức.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Phân tích kết quả học tập.
 *
 * `studentId` là TUỲ CHỌN và KHÔNG ĐƯỢC TIN: học sinh chỉ xem được chính mình, giáo viên
 * mới xem được người khác — backend tự kiểm tra quyền.
 *
 * @param {object} p
 * @param {string} [p.studentId]
 * @param {string} [p.from]  yyyy-MM-dd
 * @param {string} [p.to]    yyyy-MM-dd
 * @param {string} [p.gameId]
 * @param {AbortSignal} [p.signal]
 */
export async function analyzeLearning({ studentId, from, to, gameId, signal } = {}) {
  const body = {};
  if (studentId) body.studentId = String(studentId);
  if (from) body.from = String(from);
  if (to) body.to = String(to);
  if (gameId) body.gameId = String(gameId);

  const json = await aiFetch("/api/ai/learning-analysis", { body, signal });

  if (!json || !json.metrics) {
    throw new AiServiceError("AI Service không trả về báo cáo phân tích.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Tổng quan lớp cho trang Phân tích AI (chỉ giáo viên/admin): điểm TB, tỉ lệ
 * đúng chung, chủ đề yếu chung, số học sinh đã có dữ liệu phân tích.
 * Số liệu do BACKEND tính từ lượt chơi thật (không qua AI diễn giải) nên đọc
 * được cả khi AI đang tắt.
 *
 * @param {object} [p]
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{studentsWithData: number, totalStudents: number, totalPlays: number,
 *   totalQuestionsOffered: number, accuracy: number, averageScore: number,
 *   weakTopics: Array<{label: string, subject: string|null, plays: number,
 *   questionsOffered: number, correctAnswers: number, accuracy: number}>}>}
 */
export async function getClassOverview({ signal } = {}) {
  const json = await aiFetch("/api/ai/class-overview", { method: "GET", signal });
  if (!json || typeof json.totalPlays !== "number" || !Array.isArray(json.weakTopics)) {
    throw new AiServiceError("Không đọc được tổng quan lớp.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Nhờ AI Bạn Học giải thích câu hỏi vừa trả lời (giai đoạn 1 — MVP).
 *
 * Client KHÔNG gửi `isCorrect` cũng không gửi đáp án đúng, và cũng không tự biết câu nào
 * sai: AI Service chuyển tiếp token xuống backend Node, nơi chấm lại bằng đúng hàm
 * `isAnswerCorrect` dùng cho việc chấm điểm game. Đáp án đúng chỉ nằm trong prompt
 * của LLM và KHÔNG BAO GIỜ được trả về cho trình duyệt — UI chỉ biết cờ `revealed`.
 *
 * @param {object} p
 * @param {string}  p.questionId   bắt buộc
 * @param {string} [p.gameId]
 * @param {string|null} [p.answer]  giá trị đã chọn; null = hết giờ / không trả lời
 * @param {boolean} [p.reveal]      true = học sinh yêu cầu lời giải đầy đủ
 * @param {string} [p.followUp]     câu hỏi bổ sung (tối đa 500 ký tự)
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{answer: string, questionId: string, isCorrect: boolean, answered: boolean,
 *                    revealed: boolean, subject: string|null, truncated: boolean}>}
 */
export async function explain({ questionId, gameId, answer, reveal = false, followUp, signal } = {}) {
  const qid = String(questionId || "").trim();
  if (!qid) {
    throw new AiServiceError("Thiếu mã câu hỏi cần giải thích.", { kind: "badRequest" });
  }

  const body = {
    questionId: qid.slice(0, 80),
    reveal: !!reveal,
  };
  if (gameId) body.gameId = String(gameId).slice(0, 64);
  if (answer != null && answer !== "") body.answer = String(answer).slice(0, 200);
  if (followUp) body.followUp = String(followUp).trim().slice(0, 500);

  const json = await aiFetch("/api/ai/explain", { body, signal });

  if (!json || typeof json.answer !== "string" || !json.answer.trim()) {
    throw new AiServiceError("AI không giải thích được. Hãy thử lại.", { kind: "badResponse" });
  }
  return {
    answer: json.answer,
    questionId: json.questionId || qid,
    isCorrect: json.isCorrect === true,
    answered: json.answered === true,
    revealed: json.revealed === true,
    subject: json.subject || null,
    truncated: json.truncated === true,
  };
}

/**
 * Lịch sử hỏi AI — trang quản trị "Lịch sử hỏi AI" (CHỈ admin).
 *
 * Backend ghi ngầm mỗi lượt chat thành công; trang này đọc qua
 * GET /api/ai/chat-logs (phân trang + lọc) và dọn qua
 * DELETE /api/ai/chat-logs (bắt buộc có điều kiện from/to/userId).
 *
 * @param {object} [p]
 * @param {number} [p.page]     trang (từ 1)
 * @param {number} [p.limit]    số dòng/trang (server kẹp tối đa 100)
 * @param {string} [p.userId]   lọc đúng một người hỏi
 * @param {string} [p.username] lọc gần đúng theo username
 * @param {string} [p.role]     student | teacher | admin
 * @param {string} [p.kind]     chat | admin_query
 * @param {string} [p.from]     yyyy-MM-dd
 * @param {string} [p.to]       yyyy-MM-dd
 * @param {string} [p.q]        từ khoá trong câu hỏi
 * @returns {Promise<{items: Array, total: number, page: number, limit: number, totalPages: number}>}
 */
export async function listChatLogs(p = {}) {
  const params = new URLSearchParams();
  for (const key of ["page", "limit", "userId", "username", "role", "kind", "from", "to", "q"]) {
    const v = p[key];
    if (v !== "" && v != null) params.set(key, v);
  }
  const qs = params.toString();
  const json = await aiFetch(`/api/ai/chat-logs${qs ? `?${qs}` : ""}`, { method: "GET" });
  if (!json || !Array.isArray(json.items)) {
    throw new AiServiceError("Không đọc được lịch sử hỏi AI.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Xóa lịch sử hỏi AI theo điều kiện — server TỪ CHỐI (400) khi không có
 * bất kỳ điều kiện nào trong { from, to, userId }.
 *
 * @param {object} p  cùng bộ lọc như listChatLogs (trừ page/limit)
 * @returns {Promise<{deleted: number}>}
 */
export async function deleteChatLogs(p = {}) {
  const body = {};
  for (const key of ["userId", "username", "role", "kind", "from", "to", "q"]) {
    const v = p[key];
    if (v !== "" && v != null) body[key] = v;
  }
  const json = await aiFetch("/api/ai/chat-logs", { method: "DELETE", body });
  if (!json || typeof json.deleted !== "number") {
    throw new AiServiceError("Không xóa được lịch sử hỏi AI.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Trạng thái "credit AI còn lại hôm nay" cho khung chat AI Bạn Học
 * (GET /api/ai/credit-status — cần đăng nhập). Server tính từ bộ đếm
 * nội bộ theo ngày UTC + hạn mức cấu hình của model hiệu lực; số là
 * ƯỚC TÍNH (estimate: true). `supported: false` = nhà cung cấp hiện tại
 * không có khái niệm credit kiểu này → caller ẩn hiển thị.
 *
 * @returns {Promise<{supported: boolean, model: string|null,
 *   limitTokensPerDay: number|null, usedTokensToday: number,
 *   remainingTokensToday: number|null, limitRequestsPerDay: number|null,
 *   usedRequestsToday: number, remainingRequestsToday: number|null,
 *   resetsAtUtc: string, estimate: boolean}>}
 */
export async function getCreditStatus() {
  const json = await aiFetch("/api/ai/credit-status", { method: "GET" });
  if (!json || typeof json !== "object" || typeof json.supported !== "boolean") {
    throw new AiServiceError("Không đọc được trạng thái credit AI.", { kind: "badResponse" });
  }
  return json;
}

/**
 * Soạn bài học bằng AI (AI_LESSON_CREATOR.md) — chỉ giáo viên/admin.
 * Backend gọi model ở JSON mode, validate + chuyển về đúng schema
 * `lessons` THẬT rồi trả BẢN NHÁP CHƯA LƯU; trang Tạo bài học AI cho
 * giáo viên xem trước/sửa rồi mới lưu qua lessonService.create.
 *
 * @param {object} p
 * @param {string} p.prompt    Yêu cầu soạn bài tự do của giáo viên.
 * @param {string} p.subject   Môn học (đúng giá trị danh mục subjects).
 * @param {number} p.gradeLevel Lớp 1–5.
 * @param {"short"|"standard"|"deep"} [p.length] Độ dài bài học.
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{lesson: object, meta: {length: string, sections: number,
 *   generatedQuestions: number, droppedQuestions: number,
 *   quizReturned: number, warnings: string[]}}>}
 */
export async function generateLesson({ prompt, subject, gradeLevel, length, signal } = {}) {
  if (!String(prompt || "").trim()) {
    throw new AiServiceError("Bạn chưa nhập yêu cầu soạn bài.", { kind: "badRequest" });
  }
  if (!String(subject || "").trim()) {
    throw new AiServiceError("Bạn chưa chọn môn học.", { kind: "badRequest" });
  }
  const grade = Number(gradeLevel);
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
    throw new AiServiceError("Cấp học phải là lớp 1–5.", { kind: "badRequest" });
  }
  const json = await aiFetch("/api/ai/generate-lesson", {
    body: {
      prompt: String(prompt).trim().slice(0, 2000),
      subject: String(subject).trim().slice(0, 100),
      gradeLevel: grade,
      length: ["short", "standard", "deep"].includes(length) ? length : "standard",
    },
    signal,
  });
  if (!json || typeof json !== "object" || !json.lesson || !Array.isArray(json.lesson.pages)) {
    throw new AiServiceError("AI không trả về được bản nháp bài học. Hãy thử lại.", { kind: "badResponse" });
  }
  return { lesson: json.lesson, meta: json.meta || {} };
}

/**
 * Kiểm tra AI có sẵn sàng không (dùng cho trạng thái nút).
 * Endpoint này không cần token và không bao giờ trả về API key.
 */
export async function ping({ timeoutMs = 2500 } = {}) {
  try {
    const data = await aiFetch("/api/ai/health", { method: "GET", timeoutMs });
    // apiFetch trả `null` cho GET 404 (quy ước của services/api.js) — coi như offline.
    if (!data || typeof data !== "object") {
      return { online: false, status: false, detail: "Không tìm thấy dịch vụ AI." };
    }
    return { online: true, ...data };
  } catch {
    return { online: false, status: false, detail: "Không kết nối được dịch vụ AI." };
  }
}