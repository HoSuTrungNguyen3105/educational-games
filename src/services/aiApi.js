// services/aiApi.js
//
// Client cho Java AI Service (edu-game-ai-service).
// Theo EDU_GAME_AI_INTEGRATION.md: React gọi thẳng AI Service, không đi qua
// backend Node hiện tại — vì AI Service chỉ sở hữu "sinh nội dung AI", còn
// User/Game/Question vẫn thuộc backend Node.
//
//   React ──> Java AI Service (8081) ──> Ollama / LLM
//   React ──> Backend Node (Render)  ──> MongoDB   (lưu câu hỏi đã sinh)
//
// AI Service TRẢ CẤU TRÚC RIÊNG. Hàm mapQuestion() chuyển về đúng shape mà
// hệ thống hiện tại đang dùng, để không phải sửa Question API.

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
    this.kind = kind;          // offline | timeout | badRequest | server | badResponse
    this.status = status;
  }
}

/** fetch có timeout + phân loại lỗi để UI hiện thông báo đúng. */
async function aiFetch(path, { body, timeoutMs = TIMEOUT_MS, signal } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  // Cho phép huỷ từ bên ngoài (người dùng bấm "Huỷ")
  if (signal) signal.addEventListener("abort", () => ctrl.abort(), { once: true });

  let res;
  try {
    res = await fetch(`${AI_BASE}${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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

  if (res.status === 400 || res.status === 422) {
    let msg = "AI Service từ chối yêu cầu.";
    try { msg = (await res.json())?.message || msg; } catch { /* không phải JSON */ }
    throw new AiServiceError(msg, { kind: "badRequest", status: res.status });
  }
  if (!res.ok) {
    throw new AiServiceError(`AI Service lỗi (HTTP ${res.status}).`, { kind: "server", status: res.status });
  }

  try {
    return await res.json();
  } catch {
    throw new AiServiceError("AI Service trả về dữ liệu không đọc được.", { kind: "badResponse" });
  }
}

/**
 * Map 1 câu của AI → shape câu hỏi hệ thống hiện tại.
 *
 * AI trả:  { content, options: string[], correctAnswer: string, points }
 * Hệ thống cần: { id, content, inputMode, options: [{id, content}], correctAnswer: <optionId>, timeLimit, points }
 *
 * `correctAnswer` của AI là NỘI DUNG đáp án, còn hệ thống cần ID của option →
 * phải tìm option có nội dung khớp. Không tìm thấy thì trả null để giáo viên
 * tự chọn, chứ không đoán bừa.
 */
export function mapQuestion(dto, { makeId } = {}) {
  if (!dto || typeof dto !== "object") return null;
  const content = String(dto.content || "").trim();
  const rawOptions = Array.isArray(dto.options) ? dto.options : [];
  const options = rawOptions
    .map((o) => (typeof o === "string" ? o : o?.content))
    .filter((t) => String(t || "").trim())
    .map((t) => ({ id: (makeId || defaultId)("answer"), content: String(t).trim() }));

  // Cần tối thiểu 2 đáp án thì mới chơi được
  if (!content || options.length < 2) return null;

  const want = String(dto.correctAnswer ?? "").trim();
  const hit =
    options.find((o) => o.content === want) ||
    options.find((o) => o.content.toLowerCase() === want.toLowerCase()) ||
    null;

  return {
    id: (makeId || defaultId)("question"),
    content,
    inputMode: "choice",
    options,
    correctAnswer: hit ? hit.id : null,   // null → giáo viên phải chọn tay
    timeLimit: 15,
    points: Number(dto.points) > 0 ? Number(dto.points) : 100,
  };
}

let seq = 0;
function defaultId(prefix) {
  seq += 1;
  return `${prefix}-ai${Date.now().toString(36)}${seq}`;
}

/**
 * Sinh câu hỏi bằng AI.
 * @param {object}  p
 * @param {string}  p.subject
 * @param {number}  p.grade
 * @param {string}  p.topic
 * @param {string}  p.difficulty  easy | medium | hard
 * @param {number}  p.quantity    1..20
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<{ questions: object[], skipped: number, needsManualAnswer: number }>}
 */
export async function generateQuestions({ subject, grade, topic, difficulty, quantity, signal } = {}) {
  if (!String(subject || "").trim()) {
    throw new AiServiceError("Thiếu môn học.", { kind: "badRequest" });
  }
  if (!String(topic || "").trim()) {
    throw new AiServiceError("Thiếu chủ đề.", { kind: "badRequest" });
  }

  const qty = Math.max(1, Math.min(20, Number(quantity) || 5));
  const payload = {
    subject: String(subject).trim(),
    grade: Number(grade) || 5,
    topic: String(topic).trim(),
    difficulty: DIFFICULTIES.some((d) => d.id === difficulty) ? difficulty : "medium",
    quantity: qty,
  };

  const json = await aiFetch("/api/ai/generate-question", { body: payload, signal });

  const rawList = Array.isArray(json) ? json : json?.questions;
  if (!Array.isArray(rawList)) {
    throw new AiServiceError("AI Service không trả về danh sách câu hỏi.", { kind: "badResponse" });
  }

  const questions = rawList.map((d) => mapQuestion(d)).filter(Boolean);
  const needChoice = questions.filter((q) => q.correctAnswer).length;

  return {
    questions,
    skipped: rawList.length - questions.length,
    // Cảnh báo để UI hiển thị: có câu thiếu đáp án đúng → giáo viên phải chọn tay
    needsManualAnswer: questions.length - needChoice,
  };
}

/** Kiểm tra AI Service còn sống không (dùng cho trạng thái nút). */
export async function ping({ timeoutMs = 2500 } = {}) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    await fetch(`${AI_BASE}/actuator/health`, { signal: ctrl.signal }).catch(() => {});
    clearTimeout(timer);
    return true;
  } catch {
    return false;
  }
}

/** Endpoint khác chưa có trong Java service — gom ở đây để sau này bật nhanh. */
export async function explainAnswer(payload, { signal } = {}) {
  return aiFetch("/api/ai/explain-answer", { body: payload, signal });
}
export async function analyzeResult(payload, { signal } = {}) {
  return aiFetch("/api/ai/analyze-result", { body: payload, signal });
}