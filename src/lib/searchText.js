/**
 * searchText — so khớp tìm kiếm không phân biệt hoa thường và dấu tiếng Việt,
 * dùng chung cho các ô tìm kiếm ở trang quản lý.
 *
 * matchesQuery("thiep cuoi", item.label, item.id) → true với "Thiệp cưới".
 */
export function foldText(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export function matchesQuery(query, ...texts) {
  const q = foldText(query).trim();
  if (!q) return true;
  return texts.some((t) => foldText(t).includes(q));
}
