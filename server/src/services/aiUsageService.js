// services/aiUsageService.js
//
// BỘ ĐẾM DÙNG AI THEO NGÀY UTC (đường Groq) + trạng thái "credit còn lại"
// cho khung chat AI Bạn Học (Nguyên yêu cầu 2026-11-10: hiện trong phần
// nhắn tin còn khoảng bao nhiêu token nữa là hết hạn mức ngày).
//
// Vì sao đếm nội bộ mà không hỏi thẳng Groq?
//  - Groq KHÔNG có API công khai truy vấn hạn mức còn lại của tài khoản.
//  - Header của mỗi response (tài liệu Groq console.groq.com/docs/rate-limits,
//    kiểm chứng 2026-11-10) chỉ cho: x-ratelimit-remaining-requests = số
//    REQUEST còn lại trong NGÀY (RPD) và x-ratelimit-remaining-tokens =
//    token còn lại trong PHÚT (TPM) — KHÔNG có token còn lại theo ngày.
//  - Trường `usage` trong thân response /chat/completions (chuẩn OpenAI:
//    prompt_tokens/completion_tokens/total_tokens, tính GỘP vào + ra) là
//    nguồn token/ngày đáng tin nhất mà backend tự có được.
// → Bộ đếm này cộng dồn usage của MỌI lượt gọi model THÀNH CÔNG qua
//   aiGroqGateway (chat, chọn công cụ, sinh câu hỏi, giải thích...) theo
//   TỪNG MODEL và TỪNG NGÀY UTC — đúng nhịp reset của Groq. Số "còn lại"
//   là ƯỚC TÍNH (estimate: true): lượt gọi ngoài backend này (nếu có) và
//   lượt gọi lỗi/không có usage sẽ không nằm trong bộ đếm. Riêng số request
//   còn lại: khi có ảnh chụp header mới trong ngày, ƯU TIÊN số của Groq
//   (cấp tổ chức — gồm cả lượt ngoài backend) và ghi rõ nguồn.
//
// Ghi đếm là FIRE-AND-FORGET (mẫu aiChatLogService.recordChatLog): nuốt
// mọi lỗi, KHÔNG bao giờ làm chậm hay làm sập lượt chat.

import { getCollection } from "../db.js";
import { config } from "../config.js";
import { getEffectiveGroqModel, getGroqDailyLimits } from "./aiModelConfig.js";

const COLLECTION = "ai_usage_daily";

/** Khoá ngày UTC "YYYY-MM-DD" — Groq reset hạn mức ngày theo UTC. */
export function utcDayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/** Mốc reset kế tiếp: 00:00 UTC ngày mai, dạng ISO. */
export function nextUtcMidnightIso(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)).toISOString();
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/**
 * Nhà cung cấp hiệu lực — mirror đúng luật của
 * aiBackendService.aiProviderKindFrom nhưng chỉ đọc `config` (không import
 * aiBackendService để tránh vòng import gateway → usage → backend).
 */
export function currentProviderKind() {
  if (String(config.ollama?.provider ?? "").trim().toLowerCase() === "groq") return "groq";
  const key = String(config.ollama?.apiKey ?? "").trim();
  const url = String(config.ollama?.baseUrl ?? "").trim();
  let local = true;
  if (url) {
    try { local = LOCAL_HOSTS.has(new URL(url).hostname.toLowerCase()); } catch { local = true; }
  }
  return key !== "" && url !== "" && !local ? "ollama-cloud" : "ai-service";
}

/**
 * Ghi nhận MỘT lượt gọi model Groq thành công. Gọi từ aiGroqGateway sau
 * khi có response 2xx. `totalTokens` = usage.total_tokens của response
 * (null khi provider không trả usage — vẫn đếm 1 request, token cộng 0 và
 * tăng bộ đếm callsMissingUsage để trạng thái công khai độ tin cậy).
 * `rateLimit` = ảnh chụp header x-ratelimit-* của chính response đó.
 * Hàm này KHÔNG BAO GIỜ ném lỗi.
 */
export async function recordAiUsage({ model, totalTokens = null, rateLimit = null } = {}) {
  try {
    const m = String(model || "").trim();
    if (!m) return;
    const day = utcDayKey();
    const now = new Date().toISOString();
    // tokens LUÔN nằm trong $inc (0 khi thiếu usage) để document tạo mới
    // luôn đủ trường bắt buộc của validator $jsonSchema.
    const inc = { requests: 1, tokens: 0 };
    if (Number.isFinite(totalTokens) && totalTokens > 0) inc.tokens = Math.round(totalTokens);
    else inc.callsMissingUsage = 1;
    const set = { model: m, day, updatedAt: now };
    if (rateLimit && (rateLimit.remainingRequests != null || rateLimit.limitRequests != null)) {
      set.providerLimitRequests = rateLimit.limitRequests ?? null;
      set.providerRemainingRequests = rateLimit.remainingRequests ?? null;
      set.providerLimitTokensMinute = rateLimit.limitTokensMinute ?? null;
      set.providerRemainingTokensMinute = rateLimit.remainingTokensMinute ?? null;
      set.providerSnapshotAt = now;
    }
    await getCollection(COLLECTION).updateOne(
      { model: m, day },
      { $inc: inc, $set: set, $setOnInsert: { id: `${m}__${day}`, createdAt: now } },
      { upsert: true },
    );
  } catch (e) {
    // Đếm là phụ trợ hiển thị — lỗi DB ở đây tuyệt đối không được lan ra chat.
    console.warn(`[ai-usage] Không ghi được bộ đếm dùng AI: ${e?.message || e}`);
  }
}

/**
 * Trạng thái credit AI cho khung chat (mọi user đã đăng nhập xem được —
 * KHÔNG chứa key/URL/hạ tầng, chỉ số liệu hạn mức của model hiệu lực).
 * `supported: false` khi nhà cung cấp không phải Groq (bộ đếm chỉ áp dụng
 * đường Groq) → frontend ẩn lặng lẽ.
 */
export async function getAiCreditStatus() {
  const provider = currentProviderKind();
  const day = utcDayKey();
  const base = {
    provider,
    supported: provider === "groq",
    model: null,
    dayUtc: day,
    limitTokensPerDay: null,
    usedTokensToday: 0,
    remainingTokensToday: null,
    limitRequestsPerDay: null,
    usedRequestsToday: 0,
    remainingRequestsToday: null,
    requestsRemainingSource: "counter",
    callsMissingUsageToday: 0,
    resetsAtUtc: nextUtcMidnightIso(),
    estimate: true,
  };
  if (provider !== "groq") return base;

  const model = await getEffectiveGroqModel();
  if (!model) return { ...base, supported: false };
  const limits = await getGroqDailyLimits();

  let doc = null;
  try {
    doc = await getCollection(COLLECTION).findOne({ model, day });
  } catch (e) {
    console.warn(`[ai-usage] Không đọc được bộ đếm dùng AI: ${e?.message || e}`);
  }
  const usedRequests = Number(doc?.requests) || 0;
  const usedTokens = Number(doc?.tokens) || 0;

  let remainingRequests = Math.max(0, limits.requestsPerDay - usedRequests);
  let requestsSource = "counter";
  // Ảnh chụp header của Groq (nếu còn trong NGÀY UTC hiện tại) là số cấp
  // TỔ CHỨC — đã gồm mọi lượt gọi bằng key này, kể cả ngoài backend — nên
  // khi tươi thì ưu tiên hơn bộ đếm nội bộ cho riêng request.
  if (
    doc && doc.providerRemainingRequests != null &&
    typeof doc.providerSnapshotAt === "string" && doc.providerSnapshotAt.slice(0, 10) === day
  ) {
    remainingRequests = Math.max(0, Number(doc.providerRemainingRequests) || 0);
    requestsSource = "provider";
  }

  return {
    ...base,
    supported: true,
    model,
    limitTokensPerDay: limits.tokensPerDay,
    usedTokensToday: usedTokens,
    remainingTokensToday: Math.max(0, limits.tokensPerDay - usedTokens),
    limitRequestsPerDay: limits.requestsPerDay,
    usedRequestsToday: usedRequests,
    remainingRequestsToday: remainingRequests,
    requestsRemainingSource: requestsSource,
    callsMissingUsageToday: Number(doc?.callsMissingUsage) || 0,
  };
}
