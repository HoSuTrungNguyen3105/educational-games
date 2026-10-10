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
 * Kiểm tra AI có sẵn sàng không (dùng cho trạng thái nút).
 * Endpoint này không cần token và không bao giờ trả về API key.
 */
export async function ping({ timeoutMs = 2500 } = {}) {
  try {
    const data = await aiFetch("/api/ai/health", {
      method: "GET",
      timeoutMs,
    });
    return { online: true, ...data };
  } catch {
    return { online: false, status: false, detail: "Không kết nối được dịch vụ AI." };
  }
}