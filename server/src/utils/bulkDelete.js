// utils/bulkDelete.js — hạ tầng XOÁ HÀNG LOẠT dùng chung cho các route quản trị.
//
// Mẫu thống nhất với DELETE /api/users/bulk (PR #77): body { ids: [...] },
// từng id độc lập (một id lỗi chỉ vào `failed`, không làm hỏng cả batch),
// giới hạn BULK_DELETE_MAX_IDS id/lần. Các route chỉ cần truyền hàm xoá đơn
// lẻ sẵn có của service tương ứng.

/** Số id tối đa cho một lần xoá hàng loạt (users/bulk cũ giữ 100 riêng). */
export const BULK_DELETE_MAX_IDS = 200;

/**
 * Kiểm tra body { ids } — trả { ids } đã trim, hoặc { error } để route
 * sendError(400).
 */
export function parseBulkIds(body) {
  const { ids } = body || {};
  if (!Array.isArray(ids) || ids.length === 0 || ids.some((x) => typeof x !== "string" || !x.trim())) {
    return { error: "ids phải là mảng chuỗi id không rỗng" };
  }
  if (ids.length > BULK_DELETE_MAX_IDS) {
    return { error: `Tối đa ${BULK_DELETE_MAX_IDS} id mỗi lần xóa` };
  }
  return { ids: ids.map((x) => x.trim()) };
}

/**
 * Chạy xoá lần lượt theo danh sách id.
 * removeFn(id) có thể:
 *   - resolve thường / trả object không có cờ đặc biệt → tính là đã xoá;
 *   - trả { deactivated: true, ... } (template đang được game dùng) →
 *     tính vào `deactivated`, KHÔNG tính đã xoá;
 *   - throw → vào `failed` kèm message.
 * Trả { deleted: [id], deactivated: [{ id, ...kết quả }], failed: [{ id, error }] }.
 */
export async function runBulkDelete(ids, removeFn) {
  const deleted = [];
  const deactivated = [];
  const failed = [];
  for (const id of ids) {
    try {
      const result = await removeFn(id);
      if (result && result.deactivated) deactivated.push({ id, ...result });
      else deleted.push(id);
    } catch (e) {
      failed.push({ id, error: e.message || "Không xóa được" });
    }
  }
  return { deleted, deactivated, failed };
}

/** Kiểm tra body { items } cho xoá câu hỏi (mỗi item cần gameId + questionId). */
export function parseBulkQuestionItems(body) {
  const { items } = body || {};
  const bad = (it) => !it || typeof it.gameId !== "string" || !it.gameId.trim()
    || typeof it.questionId !== "string" || !it.questionId.trim();
  if (!Array.isArray(items) || items.length === 0 || items.some(bad)) {
    return { error: "items phải là mảng { gameId, questionId } không rỗng" };
  }
  if (items.length > BULK_DELETE_MAX_IDS) {
    return { error: `Tối đa ${BULK_DELETE_MAX_IDS} câu hỏi mỗi lần xóa` };
  }
  return { items: items.map((it) => ({ gameId: it.gameId.trim(), questionId: it.questionId.trim() })) };
}

/**
 * Xoá câu hỏi theo items — removeOne(gameId, questionId) trả boolean,
 * false nghĩa là không tìm thấy → `failed`.
 */
export async function runBulkDeleteQuestions(items, removeOneFn) {
  const deleted = [];
  const failed = [];
  for (const { gameId, questionId } of items) {
    try {
      const ok = await removeOneFn(gameId, questionId);
      if (ok) deleted.push({ gameId, questionId });
      else failed.push({ gameId, questionId, error: "Không tìm thấy câu hỏi" });
    } catch (e) {
      failed.push({ gameId, questionId, error: e.message || "Không xóa được" });
    }
  }
  return { deleted, failed };
}

/** Gói kết quả bulk thành payload trả về thống nhất cho mọi route. */
export function bulkResultPayload({ deleted, deactivated = [], failed }) {
  const counts = { deleted: deleted.length, failed: failed.length };
  if (deactivated.length) counts.deactivated = deactivated.length;
  return {
    deleted,
    ...(deactivated.length ? { deactivated } : {}),
    failed,
    counts,
    deletedCount: deleted.length,
    failedCount: failed.length,
    ...(deactivated.length ? { deactivatedCount: deactivated.length } : {}),
  };
}
