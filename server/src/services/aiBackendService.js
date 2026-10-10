// services/aiBackendService.js
//
// Cầu nối DUY NHẤT từ Backend chính sang AI Service (Java, :8081).
//
// Kiến trúc:  Frontend → Backend chính (:5000) → AI Service (:8081)
//
// Nguyên tắc:
//  - URL, service token và timeout đến từ biến môi trường, KHÔNG hard-code.
//  - Service token đi qua header X-Ai-Internal-Token và TUYỆT ĐỐI không được log.
//  - Danh tính người dùng đã được Backend chính xác thực, chuyển tiếp qua header
//    X-Ai-User-*. AI Service chỉ tin các header này khi service token khớp.
//  - KHÔNG tự retry: mỗi lượt gọi AI đều tốn chi phí. Lỗi được ném ra để route
//    xử lý và trả về frontend theo quy ước chung.
//  - Lỗi trả về cho frontend luôn là thông báo tiếng Việt đã lọc, không kèm stack
//    trace, URL nội bộ, service token hay nội dung prompt của AI Service.

import { config } from "../config.js";

const INTERNAL_HEADERS = {
  token: "X-Ai-Internal-Token",
  userId: "X-Ai-User-Id",
  userName: "X-Ai-User-Name",
  userRole: "X-Ai-User-Role",
  clientIp: "X-Ai-Client-Ip",
};

/**
 * Lỗi từ AI Service, đã chuẩn hoá để route trả về frontend.
 * `http_code` là mã sẽ gửi cho client (đã nằm trong khoảng an toàn 400–599).
 */
export class AiBackendError extends Error {
  constructor(message, { httpCode = 502, kind = "upstream", cause } = {}) {
    super(message);
    this.name = "AiBackendError";
    this.http_code = httpCode;
    this.kind = kind; // config | offline | timeout | upstream | badResponse
    if (cause) this.cause = cause;
  }
}

/** Header xác thực + danh tính, chuẩn hoá về chuỗi và bỏ ký tự lạ. */
function internalHeaders(req) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const token = config.aiBackend.token;
  if (token) headers[INTERNAL_HEADERS.token] = token;

  const user = req?.user;
  if (user?.sub) headers[INTERNAL_HEADERS.userId] = String(user.sub).slice(0, 120);
  if (user?.name) headers[INTERNAL_HEADERS.userName] = String(user.name).slice(0, 120);
  if (user?.role) headers[INTERNAL_HEADERS.userRole] = String(user.role).slice(0, 32);

  // IP thật để AI Service tính rate limit đúng người dùng (đã lọc qua X-Forwarded-For).
  const ip = clientIp(req);
  if (ip) headers[INTERNAL_HEADERS.clientIp] = ip;

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
  const base = {
    status: false,
    model: null,
    provider: null,
    detail: "Không kết nối được AI Service.",
    enabled: config.aiBackend.enabled,
    configured: !!config.aiBackend.token,
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