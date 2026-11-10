// services/aiBackendService.js
//
// Tầng kết nối AI của Backend chính — điểm vào DUY NHẤT mà routes/ai.js dùng.
// Có BA nhà cung cấp, chọn theo cấu hình (xem aiProviderKind bên dưới):
//
//   0. "groq" (Groq trực tiếp, chuẩn OpenAI) — khi AI_PROVIDER=groq (ép chọn
//      tường minh, ưu tiên cao nhất): Backend gọi thẳng api.groq.com qua
//      aiDirectService/aiGroqGateway. Free tier thường trực, chạy 24/7 trên
//      máy chủ Groq, KHÔNG phụ thuộc credits Ollama hay máy Windows. Nghiệp
//      vụ + ngữ cảnh AI Bạn Học dùng chung aiDirectService với đường Ollama.
//   1. "ollama-cloud" (Ollama trực tiếp) — khi OLLAMA_KEY khác rỗng VÀ
//      OLLAMA_BASE_URL đã đặt và KHÔNG phải localhost/127.0.0.1: Backend gọi
//      thẳng endpoint Ollama (production: https://ollama.com) qua
//      aiDirectService/aiOllamaGateway — port trung thực hành vi của AI Service
//      Java, hợp đồng response giữ nguyên. AI chạy 24/7, không cần máy
//      Windows/tunnel.
//   2. "ai-service" (mặc định, đường quay lui) — AI Service Java riêng (:8081):
//
// Kiến trúc đường 2:  Frontend → Backend chính (:5000) → AI Service (:8081)
//
// Nguyên tắc (cả hai đường):
//  - URL, service token, API key và timeout đến từ biến môi trường, KHÔNG hard-code.
//  - Service token đi qua header X-Ai-Internal-Token và TUYỆT ĐỐI không được log
//    (tương tự OLLAMA_KEY ở đường trực tiếp).
//  - Danh tính người dùng đã được Backend chính xác thực, chuyển tiếp qua header
//    X-Ai-User-* ở đường AI Service. AI Service chỉ tin các header này khi service
//    token khớp. Ở đường trực tiếp, danh tính lấy thẳng từ req đã xác thực.
//  - KHÔNG tự retry: mỗi lượt gọi AI đều tốn chi phí. Lỗi được ném ra để route
//    xử lý và trả về frontend theo quy ước chung.
//  - Lỗi trả về cho frontend luôn là thông báo tiếng Việt đã lọc, không kèm stack
//    trace, URL nội bộ, service token/key hay nội dung prompt.

import { config } from "../config.js";
import { AiBackendError } from "./aiBackendError.js";
import { callAiDirect } from "./aiDirectService.js";
import { ollamaHealth } from "./aiOllamaGateway.js";
import { groqHealth } from "./aiGroqGateway.js";
import { getAiInferenceStatus } from "./aiInferenceStatus.js";

export { AiBackendError };
export { getAiInferenceStatus };

const INTERNAL_HEADERS = {
  token: "X-Ai-Internal-Token",
  userId: "X-Ai-User-Id",
  userName: "X-Ai-User-Name",
  userRole: "X-Ai-User-Role",
  clientIp: "X-Ai-Client-Ip",
};

// ───────────────────── Chọn nhà cung cấp ─────────────────────

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/** true nếu URL trỏ tới máy local (localhost/127.0.0.1/::1) hoặc không parse được. */
export function isLocalOllamaUrl(url) {
  if (!url || !String(url).trim()) return true;
  try {
    return LOCAL_HOSTS.has(new URL(String(url)).hostname.toLowerCase());
  } catch {
    return true; // URL hỏng → chưa sẵn sàng đi cloud, giữ đường quay lui.
  }
}

/**
 * Chọn nhà cung cấp từ cấu hình cho trước (hàm thuần để test):
 *  - "groq" khi `provider` ép chọn đúng chuỗi "groq" (env AI_PROVIDER) — ưu
 *    tiên CAO NHẤT và TƯỜNG MINH: bật/tắt đường Groq không phụ thuộc việc
 *    xoá/đặt lại bộ biến của nhà cung cấp khác (bài học sự cố Ollama
 *    2026-11-10: chuyển đường bằng cách xoá key rất dễ nhầm lẫn).
 *  - "ollama-cloud" khi có key + base URL đặt từ xa; ngược lại "ai-service".
 * Key + endpoint local (dev tự host Ollama trên máy) KHÔNG kích hoạt đường
 * cloud — trường hợp đó vẫn đi qua AI Service như trước.
 */
export function aiProviderKindFrom(ollama = {}) {
  if (String(ollama.provider ?? "").trim().toLowerCase() === "groq") return "groq";
  const key = ollama.apiKey == null ? "" : String(ollama.apiKey).trim();
  const url = ollama.baseUrl == null ? "" : String(ollama.baseUrl).trim();
  if (key !== "" && url !== "" && !isLocalOllamaUrl(url)) return "ollama-cloud";
  return "ai-service";
}

/** Nhà cung cấp đang hiệu lực theo config hiện tại: "groq" | "ollama-cloud" | "ai-service". */
export function aiProviderKind() {
  return aiProviderKindFrom(config.ollama);
}

/** configured = cấu hình của ĐƯỜNG ĐANG CHỌN đã đủ chưa (groq: KEY+MODEL; cloud: URL+KEY+MODEL; AI Service: token). */
export function aiProviderConfigured() {
  const kind = aiProviderKind();
  if (kind === "groq") {
    return !!(config.groq.apiKey && config.groq.model);
  }
  if (kind === "ollama-cloud") {
    return !!(config.ollama.baseUrl && config.ollama.apiKey && config.ollama.model);
  }
  return !!config.aiBackend.token;
}

/**
 * Giá trị header an toàn trên wire.
 *
 * HTTP header chỉ chở byte ASCII: tên tiếng Việt ("Hồ") ném
 * `Cannot convert argument to a ByteString ... greater than 255` ngay tại tầng fetch,
 * khiến mọi request AI của người dùng có tên Việt Nam chết với 503 "không kết nối được
 * AI Service". Vì vậy percent-encode ở đây; AI Service giải mã trước khi cắt 120 ký tự
 * (xem CurrentUserArgumentResolver#decodeHeader).
 */
function headerValue(value, max = 120) {
  const raw = String(value ?? "");
  if (!raw) return "";
  return encodeURIComponent(raw).replace(/\+/g, "%2B").slice(0, max);
}

/** Header xác thực + danh tính, chuẩn hoá về chuỗi và bỏ ký tự lạ. */
function internalHeaders(req) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const token = config.aiBackend.token;
  if (token) headers[INTERNAL_HEADERS.token] = token;

  const user = req?.user;
  if (user?.sub) headers[INTERNAL_HEADERS.userId] = headerValue(user.sub);
  if (user?.name) headers[INTERNAL_HEADERS.userName] = headerValue(user.name);
  if (user?.role) headers[INTERNAL_HEADERS.userRole] = headerValue(user.role);

  // IP thật để AI Service tính rate limit đúng người dùng (đã lọc qua X-Forwarded-For).
  const ip = clientIp(req);
  if (ip) headers[INTERNAL_HEADERS.clientIp] = ip.slice(0, 64);

  return headers;
}

function clientIp(req) {
  const fwd = req?.headers?.["x-forwarded-for"];
  const raw = (typeof fwd === "string" && fwd) ? fwd.split(",")[0].trim() : req?.ip || req?.socket?.remoteAddress;
  return raw ? String(raw).slice(0, 64) : "";
}

/** Bóc envelope {status, code, msg, data} của AI Service. */
function unwrap(raw, path) {
  if (raw == null || raw === "") {
    throw new AiBackendError("AI Service trả về phản hồi rỗng.", { httpCode: 502, kind: "badResponse" });
  }
  let root;
  try {
    root = JSON.parse(raw);
  } catch {
    throw new AiBackendError("AI Service trả về dữ liệu không đọc được.", { httpCode: 502, kind: "badResponse" });
  }
  if (root && typeof root === "object" && root.status === false) {
    // Thông điệp của AI Service đã là tiếng Việt dành cho người dùng → trả thẳng.
    const msg = root.msg || "AI Service không xử lý được yêu cầu.";
    const code = Number(root.code);
    throw new AiBackendError(msg, {
      httpCode: code >= 400 && code <= 599 ? code : 502,
      kind: "upstream",
    });
  }
  if (path && !root) {
    throw new AiBackendError("AI Service trả về phản hồi không hợp lệ.", { httpCode: 502, kind: "badResponse" });
  }
  return root && typeof root === "object" && "data" in root ? root.data : root;
}

/**
 * Gọi một endpoint của AI Service.
 *
 * @param {string} path  ví dụ "/api/ai/chat"
 * @param {object} body  payload gửi đi
 * @param {object} req   request của Express (dùng để lấy danh tính đã xác thực)
 * @returns {Promise<any>} phần `data` đã bóc khỏi envelope
 */
export async function callAiBackend(path, body, req) {
  if (!config.aiBackend.enabled) {
    throw new AiBackendError("Tính năng AI đang tắt trên hệ thống.", { httpCode: 503, kind: "config" });
  }
  const kind = aiProviderKind();
  if (kind === "ollama-cloud" || kind === "groq") {
    // Các đường TRỰC TIẾP (Ollama Cloud / Groq dùng chung aiDirectService):
    // không cần AI_BACKEND_TOKEN; timeout dùng chung AI_BACKEND_TIMEOUT_MS
    // như đường AI Service.
    return callAiDirect(path, body, req);
  }
  if (!config.aiBackend.token) {
    console.error("[ai] Thiếu AI_BACKEND_TOKEN — Backend chính không thể xác thực với AI Service.");
    throw new AiBackendError("AI Service chưa được cấu hình đầy đủ.", { httpCode: 503, kind: "config" });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), config.aiBackend.timeoutMs);
  const started = Date.now();

  let res;
  try {
    res = await fetch(`${config.aiBackend.url}${path}`, {
      method: "POST",
      headers: internalHeaders(req),
      body: JSON.stringify(body ?? {}),
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e?.name === "AbortError") {
      console.warn(`[ai] Timeout ${config.aiBackend.timeoutMs}ms tại ${path}`);
      throw new AiBackendError("AI đang phản hồi chậm. Vui lòng thử lại sau.", { httpCode: 504, kind: "timeout" });
    }
    // KHÔNG log URL/token; chỉ log tên endpoint để debug.
    console.warn(`[ai] Không kết nối được AI Service tại ${path}: ${e?.message || e}`);
    throw new AiBackendError("Dịch vụ AI đang không khả dụng. Hãy thử lại sau.", { httpCode: 503, kind: "offline" });
  }
  clearTimeout(timer);

  const raw = await res.text().catch(() => "");
  if (!res.ok) {
    console.warn(`[ai] AI Service trả HTTP ${res.status} tại ${path} sau ${Date.now() - started}ms`);
    // Thử đọc msg trong body trước khi quy về thông báo chung.
    if (raw) {
      try {
        return unwrap(raw, path);
      } catch (e) {
        if (e instanceof AiBackendError && e.kind === "upstream") throw e;
      }
    }
    if (res.status === 401 || res.status === 403) {
      throw new AiBackendError("AI Service từ chối yêu cầu nội bộ. Kiểm tra lại cấu hình service token.",
        { httpCode: 502, kind: "config" });
    }
    throw new AiBackendError("Dịch vụ AI đang không khả dụng. Hãy thử lại sau.", { httpCode: 502, kind: "upstream" });
  }

  return unwrap(raw, path);
}

/**
 * Kiểm tra AI Service còn sống không (không ném lỗi — dùng để báo trạng thái).
 * Trả về đúng shape mà `AiStatusController` của AI Service trả về.
 */
export async function aiBackendHealth(req) {
  if (aiProviderKind() === "groq") {
    // Cùng shape với đường Ollama trực tiếp (frontend/admin không đổi), chỉ
    // khác provider/model và probe: Groq probe bằng GET /models (không tốn
    // token suy luận). inference vẫn là tín hiệu lượt gọi model THẬT.
    const base = {
      status: false,
      model: config.groq.model || null,
      provider: "groq",
      detail: "Không gọi được endpoint Groq.",
      enabled: config.aiBackend.enabled,
      configured: aiProviderConfigured(),
      baseUrlConfigured: !!config.groq.baseUrl,
      hasApiKey: !!config.groq.apiKey,
      inference: getAiInferenceStatus(),
    };
    if (!config.aiBackend.enabled) {
      return { ...base, detail: "Tính năng AI đang tắt trên hệ thống." };
    }
    const h = await groqHealth();
    return { ...base, ...h, enabled: config.aiBackend.enabled, configured: aiProviderConfigured() };
  }

  if (aiProviderKind() === "ollama-cloud") {
    // Shape GIỮ NGUYÊN như đường AI Service, cộng thêm 2 cờ chẩn đoán không chứa
    // bí mật (baseUrlConfigured/hasApiKey) để admin nhìn là biết thiếu biến nào.
    const base = {
      status: false,
      model: config.ollama.model || null,
      provider: "ollama-cloud",
      detail: "Không gọi được endpoint Ollama.",
      enabled: config.aiBackend.enabled,
      configured: aiProviderConfigured(),
      baseUrlConfigured: !!config.ollama.baseUrl,
      hasApiKey: !!config.ollama.apiKey,
      // Sức khoẻ SUY LUẬN thật, suy ra từ các lượt gọi model gateway đã phục vụ
      // (không probe thêm, không tốn quota) — `status` phía trên chỉ phản ánh
      // probe /api/tags nên key hết quota vẫn xanh giả (sự cố 2026-11-10).
      inference: getAiInferenceStatus(),
    };
    if (!config.aiBackend.enabled) {
      return { ...base, detail: "Tính năng AI đang tắt trên hệ thống." };
    }
    const h = await ollamaHealth();
    return { ...base, ...h, enabled: config.aiBackend.enabled, configured: aiProviderConfigured() };
  }

  const base = {
    status: false,
    model: null,
    provider: null,
    detail: "Không kết nối được AI Service.",
    enabled: config.aiBackend.enabled,
    configured: !!config.aiBackend.token,
    // Đường AI Service Java không qua gateway trực tiếp nên không có tín hiệu
    // lượt gọi model trong bộ nhớ này → luôn "unknown" ở đường này.
    inference: getAiInferenceStatus(),
  };
  if (!config.aiBackend.enabled || !config.aiBackend.token) return base;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const headers = { Accept: "application/json" };
    if (config.aiBackend.token) headers[INTERNAL_HEADERS.token] = config.aiBackend.token;
    const res = await fetch(`${config.aiBackend.url}/api/ai/health`, { headers, signal: ctrl.signal });
    if (!res.ok) return { ...base, detail: `AI Service trả HTTP ${res.status}.` };
    const data = unwrap(await res.text(), "/api/ai/health");
    return { ...base, ...(data || {}) };
  } catch {
    return base;
  } finally {
    clearTimeout(timer);
    void req;
  }
}