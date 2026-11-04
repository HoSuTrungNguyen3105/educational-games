// reportService.js — báo cáo người dùng xấu từ trò chuyện (collection `reports`).
//
// Vì sao KHÔNG gộp vào ticket hỗ trợ (`support_tickets`): ticket là yêu cầu
// hỗ trợ tự do (tiêu đề + nội dung, tự động gán cho GV chủ nhiệm của NGƯỜI
// GỬI) — không có field cho NGƯỜI BỊ BÁO CÁO hay lý do chuẩn hoá, trộn báo
// cáo lạm dụng vào hàng hỗ trợ sẽ làm admin khó rà soát và GV có thể thấy
// báo cáo không thuộc phạm vi lớp mình. Collection riêng tối thiểu:
//   { id, reporterId, reportedId, reason, note, status, createdAt, updatedAt }
// kèm snapshot username/name của hai phía tại thời điểm báo cáo (giống cách
// support_tickets lưu username người gửi) để danh sách admin vẫn đọc được
// kể cả khi tài khoản bị đổi tên/xoá sau đó.
import { getCollection } from "../db.js";

const COLLECTION = "reports";

const uid = () => `rep-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Lý do cố định — client chỉ được chọn trong danh sách này. */
export const REPORT_REASONS = [
  { value: "harassment", label: "Quấy rối" },
  { value: "bad_language", label: "Ngôn từ xấu" },
  { value: "scam", label: "Lừa đảo" },
  { value: "other", label: "Khác" },
];

export const REPORT_STATUSES = ["open", "resolved"];

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

export async function createReport({ reporterId, reportedId, reason, note }) {
  if (!reportedId) throw httpError("Thiếu người bị báo cáo", 400);
  if (reporterId === reportedId) throw httpError("Không thể tự báo cáo chính mình", 400);
  if (!REPORT_REASONS.some((r) => r.value === reason)) {
    throw httpError("Lý do báo cáo không hợp lệ", 400);
  }
  const [reporter, reported] = await Promise.all([
    getCollection("users").findOne({ id: reporterId }),
    getCollection("users").findOne({ id: reportedId }),
  ]);
  if (!reported) throw httpError("Người dùng bị báo cáo không tồn tại", 404);

  const now = new Date().toISOString();
  const doc = {
    id: uid(),
    reporterId,
    reporterUsername: reporter?.username || "",
    reporterName: reporter?.name || "",
    reportedId,
    reportedUsername: reported.username || "",
    reportedName: reported.name || "",
    reason,
    note: String(note || "").trim().slice(0, 1000),
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

/** Toàn bộ báo cáo, mới nhất trước — cho trang quản trị hỗ trợ. */
export async function listReports() {
  return getCollection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

/** Admin đánh dấu đã xử lý / mở lại. */
export async function updateReportStatus(id, status) {
  if (!REPORT_STATUSES.includes(status)) {
    throw httpError(`status phải là một trong: ${REPORT_STATUSES.join(", ")}`, 400);
  }
  const col = getCollection(COLLECTION);
  const existing = await col.findOne({ id });
  if (!existing) throw httpError("Không tìm thấy báo cáo", 404);
  await col.updateOne({ id }, { $set: { status, updatedAt: new Date().toISOString() } });
  return col.findOne({ id });
}
