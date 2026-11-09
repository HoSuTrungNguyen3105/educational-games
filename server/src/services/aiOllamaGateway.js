// services/aiOllamaGateway.js
//
// Cổng gọi Ollama TRỰC TIẾP từ Backend chính — port từ OllamaChatGateway.java của
// AI Service (nơi đã giải quyết đúng các vấn đề: header Authorization cho endpoint
// từ xa, field `think`, format json, ánh xạ lỗi). Backend dùng cổng này khi nhà
// cung cấp được chọn là Ollama trực tiếp (xem aiBackendService.aiProviderKind).
//
// Quy tắc bảo mật giữ nguyên từ bản Java:
//  - Key chỉ đọc từ config (env OLLAMA_KEY); KHÔNG BAO GIỜ log giá trị.
//  - Key rỗng ⇒ không gắn header Authorization (Ollama local không cần xác thực).
//  - Chỉ log mã HTTP, không log body lỗi của provider.
//  - Timeout dùng chung AI_BACKEND_TIMEOUT_MS (mặc định 120s như đường AI Service).

import { config } from "../config.js";
import { AiBackendError } from "./aiBackendError.js";

const PROVIDER_NAME = "ollama-cloud";

/** sendThink phía Java: gửi field `think` trừ khi cấu hình là omit/auto/off/rỗng. */
function thinkConfig() {
  const v = String(config.ollama.think ?? "").trim().toLowerCase();
  const send = v !== "" && v !== "omit" && v !== "auto" && v !== "off";
  const enabled = v === "true" || v === "1" || v === "enable" || v === "enabled";
  return { send, enabled };
}

function authHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const key = config.ollama.apiKey;
  if (key && key.trim()) headers.Authorization = `Bearer ${key.trim()}`;
  return headers;
}

function requireConfigured() {
  if (!config.ollama.baseUrl) {
    throw new AiBackendError(
      "AI chưa cấu hình OLLAMA_BASE_URL. Hãy đặt biến môi trường này rồi khởi động lại.",
      { httpCode: 503, kind: "config" });
  }
  if (!config.ollama.model) {
    throw new AiBackendError(
      "AI chưa cấu hình OLLAMA_MODEL. Hãy đặt biến môi trường này rồi khởi động lại.",
      { httpCode: 503, kind: "config" });
  }
}

/** Dựng payload /api/chat: model, stream:false, messages, format, options, think. */
function buildBody(system, messages, jsonMode) {
  const body = { model: config.ollama.model, stream: false, messages: [] };
  if (system && String(system).trim()) {
    body.messages.push({ role: "system", content: String(system) });
  }
  for (const m of messages || []) {
    if (!m || m.content == null || String(m.content).trim() === "") continue;
    body.messages.push({ role: m.role, content: String(m.content) });
  }
  if (jsonMode) body.format = "json";
  body.options = { temperature: config.ollama.temperature };
  const think = thinkConfig();
  if (think.send) body.think = think.enabled;
  return body;
}

/** Dịch lỗi HTTP của provider thành lỗi nghiệp vụ rõ ràng (như translate() phía Java). */
function translateHttp(status) {
  if (status === 401 || status === 403) {
    console.error(`[ai] Ollama từ chối xác thực (HTTP ${status}). Kiểm tra OLLAMA_KEY.`);
    return new AiBackendError(
      "Dịch vụ AI từ chối xác thực. Hãy kiểm tra lại OLLAMA_KEY hoặc endpoint đang dùng.",
      { httpCode: 502, kind: "config" });
  }
  if (status === 404) {
    console.error(`[ai] Ollama trả 404 — endpoint hoặc model không tồn tại (model=${config.ollama.model}).`);
    return new AiBackendError(
      "Không tìm thấy model '" + config.ollama.model + "' trên endpoint này. "
      + "Kiểm tra OLLAMA_MODEL — với Ollama Cloud hãy chọn model có sẵn trên cloud (ví dụ gpt-oss:20b).",
      { httpCode: 502, kind: "config" });
  }
  if (status === 400) {
    console.warn("[ai] Ollama trả 400 — request không hợp lệ với model này.");
    return new AiBackendError("Yêu cầu không được model chấp nhận. Hãy thử lại với nội dung khác.",
      { httpCode: 400, kind: "upstream" });
  }
  console.warn(`[ai] Ollama trả HTTP ${status}.`);
  return new AiBackendError("Dịch vụ AI đang lỗi. Vui lòng thử lại sau.",
    { httpCode: 502, kind: "upstream" });
}

/** Một lần POST /api/chat. Trả {status, raw} để caller quyết định thử lại/dịch lỗi. */
async function postChat(body, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${config.ollama.baseUrl}/api/chat`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    return { status: res.status, raw: await res.text().catch(() => "") };
  } catch (e) {
    if (e?.name === "AbortError") {
      console.warn(`[ai] Timeout ${timeoutMs}ms khi gọi Ollama /api/chat`);
      throw new AiBackendError("AI đang phản hồi chậm. Vui lòng thử lại sau.",
        { httpCode: 504, kind: "timeout", cause: e });
    }
    console.warn(`[ai] Không kết nối được endpoint Ollama: ${e?.message || e}`);
    throw new AiBackendError("Không kết nối được dịch vụ AI. Hãy thử lại sau.",
      { httpCode: 503, kind: "offline", cause: e });
  } finally {
    clearTimeout(timer);
  }
}

/** Rút message.content từ response của Ollama (extractContent phía Java). */
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
  const text = root?.message?.content;
  if (text == null || String(text).trim() === "") {
    throw new AiBackendError("Dịch vụ AI trả về nội dung rỗng.", { httpCode: 502, kind: "badResponse" });
  }
  return String(text);
}

async function call(system, messages, jsonMode) {
  requireConfigured();
  const body = buildBody(system, messages, jsonMode);
  const thinkSent = "think" in body;
  const timeoutMs = config.aiBackend.timeoutMs;

  let res = await postChat(body, timeoutMs);
  if (res.status === 400 && thinkSent) {
    // Model/endpoint không nhận field "think" (chưa sinh token nào, không tốn chi
    // phí) → thử lại ĐÚNG MỘT LẦN không kèm field này, như gateway Java.
    console.warn('[ai] Ollama không chấp nhận field "think" (HTTP 400) — gọi lại không kèm field này. Đặt OLLAMA_THINK=omit để tắt hẳn.');
    delete body.think;
    res = await postChat(body, timeoutMs);
  }
  if (res.status < 200 || res.status >= 300) throw translateHttp(res.status);
  return extractContent(res.raw);
}

/** Gửi hội thoại, nhận nội dung văn bản thuần. */
export function ollamaComplete(system, messages) {
  return call(system, messages, false);
}

/** Gọi LLM với format=json; nội dung trả về vẫn là dữ liệu KHÔNG đáng tin — caller phải validate. */
export function ollamaCompleteJson(system, messages) {
  return call(system, messages, true);
}

/**
 * Kiểm tra endpoint/model có dùng được không (health() phía Java):
 * GET /api/tags rồi đối chiếu model đã cấu hình có trong danh sách không.
 * Không ném lỗi — trả {status, model, provider, detail, baseUrlConfigured, hasApiKey}.
 */
export async function ollamaHealth() {
  const { baseUrl, model, apiKey } = config.ollama;
  const base = {
    status: false,
    model: model || null,
    provider: PROVIDER_NAME,
    detail: "Không gọi được endpoint Ollama.",
    baseUrlConfigured: !!baseUrl,
    hasApiKey: !!apiKey,
  };
  if (!baseUrl || !model) {
    return { ...base, detail: "Chưa cấu hình OLLAMA_BASE_URL / OLLAMA_MODEL." };
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const headers = { Accept: "application/json" };
    if (apiKey && apiKey.trim()) headers.Authorization = `Bearer ${apiKey.trim()}`;
    const res = await fetch(`${baseUrl}/api/tags`, { headers, signal: ctrl.signal });
    if (res.status === 401 || res.status === 403) {
      return { ...base, detail: `Endpoint Ollama từ chối xác thực (HTTP ${res.status}). Kiểm tra OLLAMA_KEY.` };
    }
    if (!res.ok) {
      return { ...base, detail: `Không gọi được endpoint Ollama (HTTP ${res.status}).` };
    }
    const root = await res.json().catch(() => null);
    const names = Array.isArray(root?.models) ? root.models.map((m) => String(m?.name || "")) : [];
    const present = names.some((n) => n === model || n.startsWith(model + ":"));
    if (!present) {
      return {
        ...base,
        detail: "Model '" + model + "' chưa có trên endpoint này. Kiểm tra OLLAMA_MODEL"
          + " — với Ollama Cloud hãy chọn model có sẵn trên cloud (ví dụ gpt-oss:20b).",
      };
    }
    return { ...base, status: true, detail: "Ollama sẵn sàng, model " + model };
  } catch {
    return base;
  } finally {
    clearTimeout(timer);
  }
}

// ─────────────────── Bóc JSON khỏi câu trả lời LLM ───────────────────
// Port từ JsonPayloads.java: model hay bọc JSON trong markdown fence hoặc thêm
// lời dẫn — hàm này chỉ tìm phần JSON hợp lệ nhất; caller vẫn phải validate.

function stripFences(raw) {
  const text = String(raw).trim();
  if (!text.startsWith("```")) return text;
  const firstNewline = text.indexOf("\n");
  if (firstNewline < 0) return text;
  const withoutOpen = text.substring(firstNewline + 1);
  const lastFence = withoutOpen.lastIndexOf("```");
  return (lastFence >= 0 ? withoutOpen.substring(0, lastFence) : withoutOpen).trim();
}

function findMatching(text, start) {
  const open = text[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function tryParse(text) {
  try {
    const node = JSON.parse(text);
    return node == null ? null : node;
  } catch {
    return null;
  }
}

/** @returns giá trị JSON đã parse, hoặc null nếu không tìm thấy JSON hợp lệ. */
export function extractJsonPayload(raw) {
  if (raw == null || String(raw).trim() === "") return null;
  const text = stripFences(raw);
  const direct = tryParse(text);
  if (direct != null) return direct;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c !== "{" && c !== "[") continue;
    const end = findMatching(text, i);
    if (end > i) {
      const node = tryParse(text.substring(i, end + 1));
      if (node != null) return node;
    }
  }
  return null;
}
