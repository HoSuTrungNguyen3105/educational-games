// services/aiTutorConfigService.js
//
// Cấu hình hành vi Gia sư AI theo (cấp học × môn học) — Tab "Cấu hình
// Gia sư AI" của trang AI Studio (REFACTOR_AI_STUDIO.md Bước 2, Tab 1).
//
// Lưu trữ: khoá `ai.tutorConfigs` trong system_config (systemConfigService
// whitelist + ép kiểu) — MAP khoá "level|subject" → một bản cấu hình:
//   level   "default" (mặc định toàn hệ thống) hoặc mã cấp của Tab 1:
//           "tieu-hoc" | "thcs" | "thpt" | "dai-hoc"
//   subject tên môn học đúng danh mục hệ thống, "" = mọi môn
//   value   { systemPrompt, temperature, scopeOnly, requireCitation,
//             refuseOffTopic, updatedAt }
//
// Áp dụng: đường chat THẬT (aiDirectService.directChat) tra cấu hình hiệu
// lực cho học sinh bằng resolveEffectiveTutorConfig — playground KHÔNG
// dùng service này (nó thử cấu hình NHÁP trên màn hình). Chưa có cấu hình
// nào được lưu → resolve trả null → chat giữ nguyên hành vi cũ 100%.

import { get, updateConfig } from "./systemConfigService.js";
import { AiBackendError } from "./aiBackendError.js";

/** Mã cấp của Tab 1 ↔ nhãn hiển thị (khớp LEVEL_OPTIONS ở AiStudioPage). */
export const TUTOR_LEVEL_LABELS = {
  "tieu-hoc": "Tiểu học",
  thcs: "THCS",
  thpt: "THPT",
  "dai-hoc": "Đại học",
};

export const TUTOR_LEVEL_KEYS = ["default", ...Object.keys(TUTOR_LEVEL_LABELS)];

/** Trần độ dài systemPrompt của một cấu hình — khớp cleanText của playground. */
export const TUTOR_PROMPT_MAX = 4000;

/** Trần temperature — khớp thanh trượt Tab 1 (0.0–0.5). */
export const TUTOR_TEMPERATURE_MAX = 0.5;

/**
 * Cấp học của học sinh suy từ KHỐI LỚP (Backend suy từ ageCode, xem
 * aiChatContext.loadChatIdentity): EduPlay là tiểu học nên lớp 1–5 đều
 * thuộc cấp "tieu-hoc" của Tab 1. grade null/lạ → null (chỉ áp mặc định).
 */
export function levelKeyForGrade(grade) {
  const g = Number(grade);
  return Number.isFinite(g) && g >= 1 && g <= 5 ? "tieu-hoc" : null;
}

/** Nhãn cấp từ mã cấp (để thay biến {cap_hoc}); "default"/lạ → null. */
export function levelLabelForKey(levelKey) {
  return TUTOR_LEVEL_LABELS[levelKey] || null;
}

/** Mã cấp từ nhãn hiển thị (playground gửi nhãn) — không khớp → null. */
export function levelKeyForLabel(label) {
  if (typeof label !== "string") return null;
  const hit = Object.entries(TUTOR_LEVEL_LABELS).find(([, v]) => v === label.trim());
  return hit ? hit[0] : null;
}

/** Khoá map của một cặp (level, subject). */
export function tutorConfigKey(level, subject) {
  return `${level}|${subject || ""}`;
}

function badRequest(message) {
  return new AiBackendError(message, { httpCode: 400, kind: "upstream" });
}

/**
 * Chuẩn hoá + validate đầu vào PUT /api/ai/tutor-config. Ném
 * AiBackendError 400 khi level không thuộc danh mục Tab 1. Trả về
 * { level, subject, entry } đã sạch (entry chưa có updatedAt — nơi lưu
 * tự đóng dấu thời gian).
 */
export function normalizeTutorConfigInput(body = {}) {
  const level = typeof body.level === "string" && body.level.trim() !== ""
    ? body.level.trim() : "default";
  if (!TUTOR_LEVEL_KEYS.includes(level)) {
    throw badRequest("Cấp học không hợp lệ.");
  }
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 80) : "";
  const systemPrompt = body.systemPrompt == null ? "" : String(body.systemPrompt).slice(0, TUTOR_PROMPT_MAX);
  let temperature = 0.2;
  if (body.temperature != null && body.temperature !== "") {
    const t = Number(body.temperature);
    if (!Number.isFinite(t)) throw badRequest("Temperature phải là một số.");
    temperature = Math.min(TUTOR_TEMPERATURE_MAX, Math.max(0, t));
  }
  return {
    level,
    subject,
    entry: {
      systemPrompt,
      temperature,
      scopeOnly: body.scopeOnly === true,
      requireCitation: body.requireCitation === true,
      refuseOffTopic: body.refuseOffTopic === true,
    },
  };
}

/** Toàn bộ MAP đã lưu (đã qua ép kiểu của systemConfigService). */
export async function getAllTutorConfigs() {
  const map = await get("ai.tutorConfigs");
  return map && typeof map === "object" && !Array.isArray(map) ? map : {};
}

/** Cấu hình đã lưu ĐÚNG một khoá (level, subject) — null khi chưa có. */
export async function getSavedTutorConfig(level, subject) {
  const lvl = TUTOR_LEVEL_KEYS.includes(level) ? level : "default";
  const sub = typeof subject === "string" ? subject.trim().slice(0, 80) : "";
  const map = await getAllTutorConfigs();
  return map[tutorConfigKey(lvl, sub)] || null;
}

/** Lưu (tạo mới hoặc ghi đè) cấu hình của một khoá. Trả bản đã lưu. */
export async function saveTutorConfig(level, subject, entry, actor = null) {
  const map = await getAllTutorConfigs();
  const saved = { ...entry, updatedAt: new Date().toISOString() };
  map[tutorConfigKey(level, subject)] = saved;
  await updateConfig({ ai: { tutorConfigs: map } }, actor);
  return saved;
}

/**
 * Tra cấu hình HIỆU LỰC cho một lượt chat theo thứ tự ưu tiên:
 *   1. (cấp của học sinh | môn đang học)
 *   2. (cấp của học sinh | mọi môn)
 *   3. (default | môn đang học)
 *   4. (default | mọi môn)
 * `grade` là khối lớp Backend suy từ ageCode (null → bỏ qua hai khoá cấp,
 * chỉ còn mặc định). Trả { config, level, subject } của khoá THẮNG, hoặc
 * null khi chưa có cấu hình nào — caller giữ nguyên hành vi chat cũ.
 * Mọi lỗi đọc cấu hình bị nuốt thành null: cấu hình phụ không được làm
 * hỏng tính năng chat chính.
 */
export async function resolveEffectiveTutorConfig({ grade = null, subject = null } = {}) {
  try {
    const map = await getAllTutorConfigs();
    if (Object.keys(map).length === 0) return null;
    const levelKey = levelKeyForGrade(grade);
    const sub = typeof subject === "string" ? subject.trim().slice(0, 80) : "";
    const candidates = [];
    if (levelKey) {
      if (sub) candidates.push([levelKey, sub]);
      candidates.push([levelKey, ""]);
    }
    if (sub) candidates.push(["default", sub]);
    candidates.push(["default", ""]);
    for (const [level, s] of candidates) {
      const config = map[tutorConfigKey(level, s)];
      if (config) return { config, level, subject: s };
    }
    return null;
  } catch (e) {
    console.warn(`[ai] Không tra được cấu hình Gia sư đã lưu: ${e?.message || e}`);
    return null;
  }
}
