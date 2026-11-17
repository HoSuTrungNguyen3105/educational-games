// rangeList.js — Phân đoạn danh sách quản trị bằng ?from=&to= (chỉ số bản ghi
// 1-based, bao gồm cả hai đầu: from=1&to=10 = 10 bản ghi đầu tiên).
//
// Chỉ đạo: MỌI endpoint DANH SÁCH phục vụ trang quản trị ở dashboard đều hỗ
// trợ from/to theo cùng một hợp đồng, qua helper này — không lặp logic ở
// từng route:
//   • Không có from lẫn to → { present: false } — route giữ NGUYÊN hành vi
//     và shape response hiện tại (không trang nào được gãy).
//   • Có from và/hoặc to → response envelope chung { status, code, msg }
//     kèm { data: [...đoạn đã cắt...], total, from, to, pagination }.
//     from thiếu → 1; to thiếu → from + 9 (một "trang" 10 bản ghi).
//   • Giá trị không hợp lệ (không phải số nguyên, < 1, to < from) → 400 với
//     message rõ ràng.
//   • Cắt SAU khi endpoint đã sắp xếp/lọc như thường lệ (helper chỉ cắt
//     trên mảng cuối cùng route đã dựng), nên thứ tự bản ghi không đổi.
//
// NGOẠI LỆ có chủ đích (from/to đã có nghĩa khác từ trước, không đụng vào):
//   • GET /api/system/logs và GET /api/ai/chat-logs: from/to là bộ lọc
//     KHOẢNG NGÀY (from_date/to_date) mà trang Cài đặt / Lịch sử AI đang dùng.

import { buildPagination, sendError } from "./response.js";

const RANGE_PAGE_SIZE = 10;

function parsePositiveInt(raw) {
  const s = String(raw ?? "").trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return Number.isSafeInteger(n) && n >= 1 ? n : null;
}

/**
 * Đọc from/to từ query. Trả:
 *   { present: false }                        — không có cả hai tham số
 *   { present: true, error }                  — có nhưng không hợp lệ
 *   { present: true, from, to }               — hợp lệ (đã điền mặc định)
 */
export function parseRange(query = {}) {
  const hasFrom = query.from !== undefined;
  const hasTo = query.to !== undefined;
  if (!hasFrom && !hasTo) return { present: false };

  let from = 1;
  let to;
  if (hasFrom) {
    from = parsePositiveInt(query.from);
    if (from === null) {
      return { present: true, error: "Tham số from phải là số nguyên >= 1 (chỉ số bản ghi bắt đầu, tính từ 1)" };
    }
  }
  if (hasTo) {
    to = parsePositiveInt(query.to);
    if (to === null) {
      return { present: true, error: "Tham số to phải là số nguyên >= 1 (chỉ số bản ghi kết thúc, tính từ 1)" };
    }
  } else {
    to = from + RANGE_PAGE_SIZE - 1;
  }
  if (to < from) {
    return { present: true, error: "Tham số to phải lớn hơn hoặc bằng from" };
  }
  return { present: true, from, to };
}

/** Cắt đoạn [from, to] (1-based, gồm cả hai đầu) khỏi mảng đã sắp xếp. */
export function sliceRange(items, range) {
  return items.slice(range.from - 1, range.to);
}

/**
 * Gửi response theo hợp đồng from/to: envelope chung + data đã cắt +
 * total/from/to ở cấp đầu (và lặp lại trong pagination cho client cũ vốn
 * đọc pagination.total / pagination.from / pagination.to như /api/games).
 * `data` phải là đoạn ĐÃ cắt; `total` là tổng số bản ghi trước khi cắt.
 */
export function sendRangedList(res, data, range, total, msg = "success") {
  const size = Math.max(1, range.to - range.from + 1);
  const pagination = buildPagination({
    page: Math.floor((range.from - 1) / size) + 1,
    perPage: size,
    total,
  });
  pagination.from = range.from;
  pagination.to = range.to;
  return res.json({
    status: true,
    code: 200,
    msg,
    data,
    total,
    from: range.from,
    to: range.to,
    pagination,
  });
}

/**
 * Điểm nối dùng chung cho các route có sẵn TOÀN BỘ danh sách trong bộ nhớ:
 *   if (respondWithRange(req, res, items)) return;
 *   sendSuccess(res, items, ...); // hành vi cũ khi không có from/to
 * Trả true khi đã gửi response (đoạn from/to hoặc lỗi 400); false khi
 * request không có from/to và route nên đi tiếp như cũ.
 */
export function respondWithRange(req, res, items, msg = "success") {
  const range = parseRange(req.query);
  if (!range.present) return false;
  if (range.error) {
    sendError(res, range.error, 400);
    return true;
  }
  sendRangedList(res, sliceRange(items, range), range, items.length, msg);
  return true;
}

/**
 * Thu thập đủ bản ghi cho đoạn [from, to] từ một service phân trang kiểu
 * page/perPage (trần mỗi trang thường bị cap ở 100): gọi liên tiếp các
 * trang cho tới khi đủ `to` bản ghi hoặc hết dữ liệu. Trả { items, total }
 * với items chứa tối đa `to` phần tử đầu (chưa cắt from — dùng sliceRange).
 */
export async function collectPagedRange(fetchPage, range, { pageSize = 100, maxPages = 200 } = {}) {
  const items = [];
  let total = 0;
  for (let page = 1; page <= maxPages; page++) {
    const r = await fetchPage(page, pageSize);
    total = r.total;
    items.push(...r.items);
    if (items.length >= Math.min(range.to, total) || r.items.length === 0) break;
  }
  return { items, total };
}

/**
 * Điểm nối cho route dùng service phân trang page/perPage: khi có from/to
 * thì thu thập + cắt + trả theo hợp đồng; không có thì trả false để route
 * giữ nguyên đường page/perPage hiện tại.
 *   if (await respondWithPagedRange(req, res, (page, perPage) => svc.list({ page, perPage }))) return;
 */
export async function respondWithPagedRange(req, res, fetchPage, msg = "success") {
  const range = parseRange(req.query);
  if (!range.present) return false;
  if (range.error) {
    sendError(res, range.error, 400);
    return true;
  }
  const { items, total } = await collectPagedRange(fetchPage, range);
  sendRangedList(res, sliceRange(items, range), range, total, msg);
  return true;
}
