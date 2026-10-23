/**
 * palette.js — bảng màu biểu đồ, dùng chung cho CSS và legend.
 *
 * Màu lấy từ design tokens của trang (index.css + tailwind trong index.html) để
 * biểu đồ không tự chế màu riêng, nhìn lệch với phần còn lại của dashboard.
 */

/** Thứ tự khớp với --ct-series-a.. trong charts.css — đổi ở đây phải đổi ở đó. */
export const SERIES_COLORS = [
  "#E4572E", // ticket
  "#1B998B", // teal
  "#F4B942", // gold
  "#8B5CF6", // purple
  "#FF6F91", // pink
  "#1D2E4A", // ink
  "#38BDF8", // sky
  "#10B981", // green
];

export const seriesColor = (i) => SERIES_COLORS[i % SERIES_COLORS.length];

/** Màu nhãn trục/ph nền biểu đồ — cùng bộ màu trang đang dùng. */
export const CHART_COLORS = {
  label: "#8A7C63",
  grid: "rgba(29,46,74,0.12)",
  ink: "#1D2E4A",
};

/**
 * Nhãn rút gọn cho Chartist: trục X của biểu đồ ngày không được phép thành
 * "dãy đặc" khi xem 90 ngày — cứ 7 ngày hiện 1 nhãn, ngày cuối luôn hiện.
 */
export function sparseLabels(values, every = 7) {
  return values.map((v, i) => (i % every === 0 || i === values.length - 1 ? v : null));
}

/** Số làm gọn cho nhãn trục: 1200 → "1.2k" để các nhãn không chồng nhau. */
export function compactNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(Math.abs(n) >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(Math.round(n * 10) / 10);
}
