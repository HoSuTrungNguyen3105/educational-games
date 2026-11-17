// Helper phân trang from/to dùng chung cho các trang quản lí (dashboard).
//
// Hợp đồng với server (server/src/utils/rangeList.js, PR #111): mọi API lấy
// DANH SÁCH ở khu quản trị chỉ nhận hai tham số phân trang `from`/`to`
// (số thứ tự bản ghi, tính từ 1) — KHÔNG dùng page/perPage/limit/offset nữa.
// Có from/to thì server trả envelope { data: [đoạn đã cắt], total, from, to,
// pagination }; các service trong src/services/api.js chuẩn hoá kết quả có
// range về dạng { items, total, pagination }.
//
// Trang có UI phân trang thật: dùng rangeForPage(page, pageSize) và lấy tổng
// số bản ghi từ field `total` của kết quả để vẽ phân trang.
// Trang mà hành vi hiện tại cần TOÀN BỘ danh sách ở client (lọc/tìm kiếm/
// chọn tất cả/tổng hợp chạy trên toàn bộ dữ liệu, server chưa có params lọc
// tương ứng): dùng rangeAll() để xin một khoảng đủ rộng — hành vi hiển thị
// giữ nguyên, chỉ đổi cách truyền tham số phân trang.

/** Trần khoảng "lấy tất cả" — đủ lớn cho mọi danh sách quản trị hiện tại. */
export const FULL_LIST_TO = 10;

/** { from, to } cho trang `page` (tính từ 1) với `pageSize` bản ghi/trang. */
export function rangeForPage(page, pageSize = 10) {
  const p = Math.max(1, Math.floor(Number(page)) || 1);
  const size = Math.max(1, Math.floor(Number(pageSize)) || 10);
  return { from: (p - 1) * size + 1, to: p * size };
}

/** Khoảng "lấy tất cả" cho các trang cần toàn bộ danh sách ở client. */
export function rangeAll() {
  return { from: 1, to: FULL_LIST_TO };
}

/**
 * Tổng số bản ghi từ kết quả đã chuẩn hoá của service ({ items, total,
 * pagination }) hoặc từ envelope thô ({ data, total, pagination }).
 */
export function rangeTotal(result, fallback = 0) {
  if (!result) return fallback;
  if (typeof result.total === "number") return result.total;
  if (typeof result.pagination?.total === "number") return result.pagination.total;
  if (Array.isArray(result.items)) return result.items.length;
  if (Array.isArray(result.data)) return result.data.length;
  if (Array.isArray(result)) return result.length;
  return fallback;
}
