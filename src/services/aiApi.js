// services/aiApi.js
//
// Client cho Java AI Service (edu-game-ai-service).
// Theo EDU_GAME_AI_INTEGRATION.md: React gọi thẳng AI Service, không đi qua
// backend Node — vì AI Service chỉ sở hữu "sinh nội dung AI", còn
// User/Game/Question vẫn thuộc backend Node.
//
//   React ──> Java AI Service (8081) ──> Ollama / LLM
//   React ──> Backend Node (Render)  ──> MongoDB   (lưu câu hỏi đã sinh)
//
// BA NGYÊN TẮC của file này:
//  1. Gửi kèm Bearer token — AI Service xác thực bằng cách hỏi lại backend Node.
//  2. Bóc envelope {status, code, msg, data} giống api.js, lỗi lấy từ `msg`.
//  3. OLLAMA_KEY chỉ nằm trong backend. Frontend không bao giờ biết, không cần biết.

import { loadAuth, uid } from "./api.js";

/**
 * Gốc của AI Service.
 * - window.AI_BASE_URL : override lúc runtime (không cần build lại)
 * - VITE_AI_BASE       : đặt trong .env
 * Mặc định khớp `server.port` trong edu-game-ai-service/src/main/resources/application.yml
 */
export const AI_BASE =
  (typeof window !== "undefined" && window.AI_BASE_URL) ||
  import.meta.env?.VITE_AI_BASE ||
  "http://localhost:8081";

const TIMEOUT_MS = Number(import.meta.env?.VITE_AI_TIMEOUT_MS) || 120_000;

/** Độ khó mà Java service nhận. */
export const DIFFICULTIES = [
  { id: "easy", label: "Dễ" },
  { id: "medium", label: "Trung bình" },
  { id: "hard", label: "Khó" },
];

export class AiServiceError extends Error {
  constructor(message, { kind = "unknown", status = 0 } = {}) {
    super(message);
    this.name = "AiServiceError";
    this.kind = kind;          // offline | timeout | auth | forbidden | rateLimit | badRequest | server | badResponse
    this.status = status;
  }
}

/** Map mã HTTP sang thông điệp tiếng Việt để UI hiện đúng nguyên nhân. */
function messageForStatus(status, payload) {
  const fromServer = payload?.msg || payload?.message;
  switch (status) {
    case 400: return fromServer || "AI Service không nhận yêu cầu này.";
    case 401: return "Bạn cần đăng nhập lại để dùng chức năng AI.";
    case 403: return fromServer || "Bạn không có quyền dùng chức năng AI này.";
    case 404: return "Không tìm thấy endpoint AI. Kiểm tra VITE_AI_BASE.";
    case 429: return fromServer || "Bạn hỏi AI hơi nhiều. Vui lòng đợi một lát rồi thử lại.";
    case 502: return fromServer || "AI trả về dữ liệu không hợp lệ. Hãy thử lại.";
    case 503: return fromServer || "Dịch vụ AI đang không khả dụng. Hãy kiểm tra Ollama.";
    default: return fromServer || `AI Service lỗi (HTTP ${status}).`;
  }
}

function kindForStatus(status) {
  if (status === 400) return "badRequest";
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 429) return "rateLimit";
  if (status === 502) return "badResponse";
  if (status === 503) return "server";
  return "server";
}

/**
 * fetch có timeout + Bearer token + bóc envelope.
 * Trả về `data` (đã bóc khỏi envelope) để caller dùng thẳng, giống `apiFetch`.
 */
async function aiFetch(path, { body, timeoutMs = TIMEOUT_MS, signal, method } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  // Cho phép huỷ từ bên ngoài (người dùng bấm "Huỷ")
  if (signal) signal.addEventListener("abort", () => ctrl.abort(), { once: true });

  const auth = loadAuth();
  const verb = method || (body ? "POST" : "GET");

  let res;
  try {
    res = await fetch(`${AI_BASE}${path}`, {
      method: verb,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw new AiServiceError("AI Service quá thời gian chờ. Thử giảm số câu hoặc thử lại.", { kind: "timeout" });
    }
    throw new AiServiceError(
      `Không kết nối được AI Service (${AI_BASE}). Hãy khởi động edu-game-ai-service hoặc kiểm tra VITE_AI_BASE.`,
      { kind: "offline" }
    );
  } finally {
    clearTimeout(timer);
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    if (!res.ok) {
      throw new AiServiceError(messageForStatus(res.status, null), {
        kind: kindForStatus(res.status),
        status: res.status,
      });
    }
    throw new AiServiceError("AI Service trả về dữ liệu không đọc được.", { kind: "badResponse" });
  }

  if (!res.ok || payload?.status === false) {
    throw new AiServiceError(messageForStatus(res.status, payload), {
      kind: kindForStatus(res.status),
      status: res.status,
    });
  }

  // Bóc envelope {status, code, msg, data}. Chấp nhận cả response thô (không envelope)
  // để tương thích nếu AI Service được cấu hình cũ.
  return payload && typeof payload === "object" && "data" in payload ? payload.data : payload;
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
 * Kiểm tra AI Service còn sống không (dùng cho trạng thái nút).
 * Endpoint này không cần token và không bao giờ trả về API key.
 */
export async function ping({ timeoutMs = 2500 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const json = await aiFetch("/api/ai/health", {
      method: "GET",
      timeoutMs,
      signal: ctrl.signal,
    });
    return { online: true, ...json };
  } catch {
    return { online: false, status: false, detail: "Không kết nối được AI Service." };
  } finally {
    clearTimeout(timer);
  }
}