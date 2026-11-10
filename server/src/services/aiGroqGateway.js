// services/aiGroqGateway.js
//
// Cổng gọi Groq TRỰC TIẾP từ Backend chính qua API tương thích OpenAI
// (POST {GROQ_BASE_URL}/chat/completions). Cùng giao diện với aiOllamaGateway
// (groqComplete/groqCompleteJson/groqHealth + extractJsonPayload dùng chung)
// để aiDirectService hoán đổi nhà cung cấp mà không đổi logic nghiệp vụ —
// ngữ cảnh AI Bạn Học (giờ VN, tóm tắt học tập, đoạn bài học, sources) do
// aiDirectService/aiChatContext dựng TRƯỚC khi gọi gateway nên được giữ
// nguyên ở đường này, khác hẳn đường AI Service Java.
//
// Khác biệt so với Ollama cần biết:
//  - KHÔNG có field `think`: gpt-oss trên Groq suy luận nội bộ; yêu cầu JSON
//    dùng response_format json_object, và Structured Outputs (json_schema
//    strict) của Groq BẢO ĐẢM schema phía provider — nhưng caller vẫn phải
//    validate như cũ, không tin tuyệt đối dữ liệu LLM.
//  - Free tier công khai theo model (gpt-oss-20b: 30 RPM, 1.000 req/ngày,
//    200K token/ngày — console.groq.com/docs/rate-limits). Hết hạn mức ngày
//    Groq trả 429 kèm header Retry-After → map về ĐÚNG mã AI_RATE_LIMITED
//    như sự cố Ollama 2026-11-10 để frontend hiển thị nhất quán.
//
// Quy tắc bảo mật như aiOllamaGateway:
//  - Key chỉ đọc từ config (env GROQ_API_KEY); KHÔNG BAO GIỜ log giá trị.
//  - Chỉ log mã HTTP, không log body lỗi của provider.
//  - Timeout dùng chung AI_BACKEND_TIMEOUT_MS (mặc định 120s).

import { config } from "../config.js";
import { AiBackendError } from "./aiBackendError.js";
import { recordAiInferenceSuccess, recordAiInferenceError } from "./aiInferenceStatus.js";
import { getEffectiveGroqModel } from "./aiModelConfig.js";

const PROVIDER_NAME = "groq";

function authHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const key = config.groq.apiKey;
  if (key && key.trim()) headers.Authorization = `Bearer ${key.trim()}`;
  return headers;
}

async function requireConfigured() {
  if (!config.groq.apiKey || !String(config.groq.apiKey).trim()) {
    throw new AiBackendError(
      "AI chưa cấu hình GROQ_API_KEY. Hãy đặt biến môi trường này rồi khởi động lại.",
      { httpCode: 503, kind: "config" });
  }
  const model = await getEffectiveGroqModel();
  if (!model) {
    throw new AiBackendError(
      "AI chưa cấu hình model Groq. Hãy chọn model ở trang Cài đặt quản trị hoặc đặt GROQ_MODEL rồi khởi động lại.",
      { httpCode: 503, kind: "config" });
  }
  return model;
}

/** Dựng payload /chat/completions: model, messages (system đầu tiên), temperature, response_format khi JSON. */
function buildBody(model, system, messages, jsonMode) {
  const body = {
    model,
    messages: [],
    temperature: config.groq.temperature,
  };
  if (system && String(system).trim()) {
    body.messages.push({ role: "system", content: String(system) });
  }
  for (const m of messages || []) {
    if (!m || m.content == null || String(m.content).trim() === "") continue;
    body.messages.push({ role: m.role, content: String(m.content) });
  }
  if (jsonMode) body.response_format = { type: "json_object" };
  return body;
}

/** Dịch lỗi HTTP của Groq thành lỗi nghiệp vụ rõ ràng (cùng quy ước với aiOllamaGateway). `model` = model hiệu lực của lượt gọi này (admin có thể vừa đổi ở Cài đặt). */
function translateHttp(status, retryAfterSeconds = null, model = "") {
  if (status === 401 || status === 403) {
    console.error(`[ai] Groq từ chối xác thực (HTTP ${status}). Kiểm tra GROQ_API_KEY.`);
    return new AiBackendError(
      "Dịch vụ AI từ chối xác thực. Hãy kiểm tra lại GROQ_API_KEY hoặc endpoint đang dùng.",
      { httpCode: 502, kind: "config", providerStatus: status });
  }
  if (status === 404) {
    console.error(`[ai] Groq trả 404 — endpoint hoặc model không tồn tại (model=${model}).`);
    return new AiBackendError(
      "Không tìm thấy model '" + model + "' trên Groq. "
      + "Hãy chọn model khác ở trang Cài đặt quản trị — Groq thay catalog model nhanh (ví dụ openai/gpt-oss-20b).",
      { httpCode: 502, kind: "config", providerStatus: status });
  }
  if (status === 429) {
    // Hết hạn mức free tier (lượt/phút hoặc token/ngày theo model). Thông điệp
    // RIÊNG + mã AI_RATE_LIMITED giống hệt đường Ollama (PR #68) để frontend
    // và học sinh nhận cùng một trải nghiệm; Retry-After được chuyển tiếp.
    console.warn("[ai] Groq trả HTTP 429 — hết hạn mức free tier hoặc bị giới hạn lượt gọi. Kiểm tra giới hạn model tại console.groq.com/docs/rate-limits.");
    return new AiBackendError(
      "AI Bạn Học đang hết lượt dùng thử, bạn quay lại sau ít phút nhé.",
      { httpCode: 429, kind: "rateLimited", code: "AI_RATE_LIMITED", providerStatus: status, retryAfterSeconds });
  }
  if (status === 400) {
    console.warn("[ai] Groq trả 400 — request không hợp lệ với model này.");
    return new AiBackendError("Yêu cầu không được model chấp nhận. Hãy thử lại với nội dung khác.",
      { httpCode: 400, kind: "upstream", providerStatus: status });
  }
  console.warn(`[ai] Groq trả HTTP ${status}.`);
  return new AiBackendError("Dịch vụ AI đang lỗi. Vui lòng thử lại sau.",
    { httpCode: 502, kind: "upstream", providerStatus: status });
}

/** Đọc header Retry-After (giây hoặc HTTP-date) → số giây chờ, tối thiểu 1; không có/không đọc được → null. */
function parseRetryAfter(raw) {
  if (!raw) return null;
  const secs = Number(raw);
  if (Number.isFinite(secs) && secs > 0) return Math.ceil(secs);
  const when = Date.parse(raw);
  if (!Number.isNaN(when)) {
    const delta = Math.ceil((when - Date.now()) / 1000);
    return delta > 0 ? delta : null;
  }
  return null;
}

/** Một lần POST /chat/completions. Trả {status, raw, retryAfterSeconds}. */
async function postChat(body, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${config.groq.baseUrl}/chat/completions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    return {
      status: res.status,
      raw: await res.text().catch(() => ""),
      retryAfterSeconds: parseRetryAfter(res.headers.get("retry-after")),
    };
  } catch (e) {
    if (e?.name === "AbortError") {
      console.warn(`[ai] Timeout ${timeoutMs}ms khi gọi Groq /chat/completions`);
      throw new AiBackendError("AI đang phản hồi chậm. Vui lòng thử lại sau.",
        { httpCode: 504, kind: "timeout", cause: e });
    }
    console.warn(`[ai] Không kết nối được endpoint Groq: ${e?.message || e}`);
    throw new AiBackendError("Không kết nối được dịch vụ AI. Hãy thử lại sau.",
      { httpCode: 503, kind: "offline", cause: e });
  } finally {
    clearTimeout(timer);
  }
}

/** Rút choices[0].message.content từ response chuẩn OpenAI. */
function extractContent(raw) {
  if (!raw || !String(raw).trim()) {
    throw new AiBackendError("Dịch vụ AI trả về nội dung rỗng.", { httpCode: 502, kind: "badResponse" });
  }
  let root;
  try {
    root = JSON.parse(raw);
  } catch {
    throw new AiBackendError("Dịch vụ AI trả về dữ liệu không đúng định dạng.", { httpCode: 502, kind: "badResponse" });
  }
  const text = root?.choices?.[0]?.message?.content;
  if (text == null || String(text).trim() === "") {
    throw new AiBackendError("Dịch vụ AI trả về nội dung rỗng.", { httpCode: 502, kind: "badResponse" });
  }
  return String(text);
}

async function call(system, messages, jsonMode) {
  const model = await requireConfigured();
  const body = buildBody(model, system, messages, jsonMode);
  const timeoutMs = config.aiBackend.timeoutMs;

  try {
    const res = await postChat(body, timeoutMs);
    if (res.status < 200 || res.status >= 300) throw translateHttp(res.status, res.retryAfterSeconds, model);
    const text = extractContent(res.raw);
    // Ghi nhận lượt gọi model THẬT cho health inference (xem aiInferenceStatus)
    // — dùng chung bộ nhớ với đường Ollama vì health chỉ có một mục inference.
    recordAiInferenceSuccess();
    return text;
  } catch (e) {
    recordAiInferenceError({ providerStatus: e?.providerStatus ?? null });
    throw e;
  }
}

/** Gửi hội thoại, nhận nội dung văn bản thuần. */
export function groqComplete(system, messages) {
  return call(system, messages, false);
}

/**
 * Lượt gọi CHỌN CÔNG CỤ (tool calling chuẩn OpenAI) cho đường A: gửi kèm
 * danh mục `tools` (định dạng {type:"function", function:{name, description,
 * parameters}}) và để model TỰ quyết định có gọi công cụ nào không
 * (tool_choice "auto"). Trả { content, toolCalls: [{id, name, arguments}] }
 * — arguments giữ NGUYÊN chuỗi JSON thô của model; việc parse + validate
 * thuộc tầng aiToolCatalog (không tin dữ liệu LLM ở gateway).
 *
 * Bằng chứng hỗ trợ: tài liệu Tool Use chính thức của Groq
 * (console.groq.com/docs/tool-use, đọc 2026-11-10) — bảng "Local & Remote
 * Tool Use" ghi openai/gpt-oss-20b và openai/gpt-oss-120b = Yes, model
 * mặc định + các model admin chọn được trong Cài đặt đều nằm trong bảng
 * này. gpt-oss KHÔNG hỗ trợ gọi công cụ song song → parallel_tool_calls
 * luôn false, tầng trên tự kẹp số công cụ thực thi mỗi lượt.
 * Mọi lỗi (gồm 400 tool_use_failed từng được cộng đồng báo với gpt-oss)
 * đều ném AiBackendError như call() thường — caller (aiToolUseService)
 * nuốt lỗi và lùi về đường từ khoá, không để hỏng chat.
 */
export async function groqCompleteWithTools(system, messages, tools) {
  const model = await requireConfigured();
  const body = buildBody(model, system, messages, false);
  body.tools = Array.isArray(tools) ? tools : [];
  body.tool_choice = "auto";
  body.parallel_tool_calls = false;
  const timeoutMs = config.aiBackend.timeoutMs;
  try {
    const res = await postChat(body, timeoutMs);
    if (res.status < 200 || res.status >= 300) throw translateHttp(res.status, res.retryAfterSeconds, model);
    let root;
    try {
      root = JSON.parse(res.raw);
    } catch {
      throw new AiBackendError("Dịch vụ AI trả về dữ liệu không đúng định dạng.", { httpCode: 502, kind: "badResponse" });
    }
    const msg = root?.choices?.[0]?.message;
    const toolCalls = (Array.isArray(msg?.tool_calls) ? msg.tool_calls : [])
      .filter((t) => t && t.type === "function" && t.function?.name)
      .map((t) => ({
        id: t.id != null ? String(t.id) : null,
        name: String(t.function.name),
        arguments: typeof t.function.arguments === "string"
          ? t.function.arguments
          : JSON.stringify(t.function.arguments ?? {}),
      }));
    recordAiInferenceSuccess();
    return { content: msg?.content != null ? String(msg.content) : "", toolCalls };
  } catch (e) {
    recordAiInferenceError({ providerStatus: e?.providerStatus ?? null });
    throw e;
  }
}

/** Gọi LLM với response_format=json_object; nội dung trả về vẫn là dữ liệu KHÔNG đáng tin — caller phải validate. */
export function groqCompleteJson(system, messages) {
  return call(system, messages, true);
}

/**
 * Kiểm tra cấu hình Groq có dùng được không: GET /models (KHÔNG tốn token
 * suy luận) rồi đối chiếu model đã cấu hình có trong danh sách không.
 * Không ném lỗi — trả {status, model, provider, detail, baseUrlConfigured, hasApiKey}.
 */
export async function groqHealth() {
  const { baseUrl, apiKey } = config.groq;
  // Model hiển thị/kiểm tra = model HIỆU LỰC (admin chọn trong Cài đặt,
  // chưa chọn thì GROQ_MODEL của env) để trang trạng thái không nói sai.
  const model = await getEffectiveGroqModel();
  const base = {
    status: false,
    model: model || null,
    provider: PROVIDER_NAME,
    detail: "Không gọi được endpoint Groq.",
    baseUrlConfigured: !!baseUrl,
    hasApiKey: !!apiKey,
  };
  if (!apiKey || !String(apiKey).trim()) {
    return { ...base, detail: "Chưa cấu hình GROQ_API_KEY." };
  }
  if (!model) {
    return { ...base, detail: "Chưa cấu hình model Groq (chọn ở Cài đặt quản trị hoặc đặt GROQ_MODEL)." };
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const headers = { Accept: "application/json", Authorization: `Bearer ${String(apiKey).trim()}` };
    const res = await fetch(`${baseUrl}/models`, { headers, signal: ctrl.signal });
    if (res.status === 401 || res.status === 403) {
      return { ...base, detail: `Groq từ chối xác thực (HTTP ${res.status}). Kiểm tra GROQ_API_KEY.` };
    }
    if (!res.ok) {
      return { ...base, detail: `Không gọi được endpoint Groq (HTTP ${res.status}).` };
    }
    const root = await res.json().catch(() => null);
    const names = Array.isArray(root?.data) ? root.data.map((m) => String(m?.id || "")) : [];
    if (!names.includes(model)) {
      return {
        ...base,
        detail: "Model '" + model + "' chưa có trên Groq. Hãy chọn model khác ở trang Cài đặt quản trị"
          + " — Groq thay catalog nhanh (ví dụ openai/gpt-oss-20b).",
      };
    }
    return { ...base, status: true, detail: "Groq sẵn sàng, model " + model };
  } catch {
    return base;
  } finally {
    clearTimeout(timer);
  }
}
