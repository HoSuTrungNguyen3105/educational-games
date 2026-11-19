// textFold.js — Gập dấu tiếng Việt + thường hoá phía server, dùng chung cho
// các bộ lọc tìm kiếm `q` của những endpoint danh sách quản trị đã chuyển
// phân trang xuống server (mẫu đầu tiên: routes/reminders.js, PR #149).
//
// Thuật toán PHẢI khớp từng bước với matchesQuery phía client
// (src/lib/searchText.js) để ô tìm kiếm ở trang quản lý cho kết quả giống
// hệt nhau dù lọc ở client (bản cũ) hay ở server (phân trang theo trang).

/** Gập dấu + thường hoá một chuỗi (null/undefined → ""). */
export function foldText(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

/**
 * True khi `query` (đã gập dấu, cắt trắng) xuất hiện trong ÍT NHẤT MỘT
 * trong các `texts` (cùng ngữ nghĩa matchesQuery phía client).
 * Query rỗng → true (không lọc).
 */
export function matchesFolded(query, ...texts) {
  const q = foldText(query).trim();
  if (!q) return true;
  return texts.some((t) => foldText(t).includes(q));
}
