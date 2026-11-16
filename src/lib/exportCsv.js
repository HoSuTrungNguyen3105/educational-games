// exportCsv.js — xuất CSV dùng chung cho các trang quản lý.
//
// Giữ đúng ngữ nghĩa bản gốc từng nằm riêng trong PermissionManagement và
// RoleListManagement: BOM \uFEFF (Excel đọc đúng tiếng Việt), mọi ô đều
// bọc ngoặc kép và gấp đôi ngoặc kép bên trong, các dòng nối bằng \r\n,
// tải xuống qua Blob text/csv + thẻ <a download>.
//
// @param {string} filename  tên file tải xuống, vd "permissions.csv"
// @param {string[]} headers  tiêu đề cột
// @param {Array<Array<*>>} rows  các dòng dữ liệu thô (util tự escape)
export function exportCsv(filename, headers, rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = (rows || []).map((r) => r.map(esc).join(","));
  const blob = new Blob(["\uFEFF" + [headers.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
