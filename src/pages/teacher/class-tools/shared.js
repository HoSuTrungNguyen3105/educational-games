/**
 * shared.js — hằng số + hàm thuần DÙNG CHUNG cho mọi tab của bộ Công cụ
 * lớp học: nhãn/badge giới tính, palette nhóm & đội, 6 vai trò, mốc
 * Level bảng vàng. Phần component nằm ở shared.jsx (tách file vì rule
 * react-refresh/only-export-components của repo).
 */

// ── Giới tính ──────────────────────────────────────────────────────────
export const GENDER_LABEL = { male: "Nam", female: "Nữ" };
export const GENDER_BADGE = {
  male: "bg-sky-100 text-sky-700 border-sky-200",
  female: "bg-pink-100 text-pink-700 border-pink-200",
};

// ── Avatar chữ cái đầu ─────────────────────────────────────────────────
export const AVATAR_COLORS = [
  { bg: "#FDE8E0", text: "#9A3412" },
  { bg: "#E0F2FE", text: "#075985" },
  { bg: "#DCFCE7", text: "#166534" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#CCFBF1", text: "#115E59" },
  { bg: "#FFEDD5", text: "#9A3412" },
];

/** Tên rút gọn cho ô hẹp (lát vòng quay, ô chỗ ngồi): quá 16 ký tự thì lấy 2 từ cuối. */
export function shortNameOf(name) {
  const text = String(name ?? "");
  if (text.length <= 16) return text;
  return text.split(/\s+/).slice(-2).join(" ");
}

/** Hai chữ cái đầu của hai từ cuối trong họ tên (vd "Nguyễn Văn An" → "VA"). */
export function initialsOf(name) {
  const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[words.length - 2].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// ── Vai trò trong nhóm (đúng 6 vai trò của ảnh mẫu 3) ──────────────────
export const ROLES = [
  { id: "leader", label: "Trưởng nhóm", color: "#EA8C2A", badge: "bg-orange-100 text-orange-700 border-orange-300" },
  { id: "secretary", label: "Thư ký", color: "#2D9CDB", badge: "bg-sky-100 text-sky-700 border-sky-300" },
  { id: "reporter", label: "Báo cáo viên", color: "#E85D8A", badge: "bg-pink-100 text-pink-700 border-pink-300" },
  { id: "timer", label: "Giữ thời gian", color: "#7C6BD9", badge: "bg-violet-100 text-violet-700 border-violet-300" },
  { id: "logistics", label: "Hậu cần", color: "#5BA832", badge: "bg-lime-100 text-lime-700 border-lime-300" },
  { id: "critic", label: "Phản biện", color: "#0E9594", badge: "bg-teal-100 text-teal-700 border-teal-300" },
];
export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]));

// ── Palette thẻ nhóm (10 màu pastel luân phiên) ────────────────────────
export const GROUP_COLORS = [
  { bg: "#E8F7EE", border: "#34A853", deep: "#14532D" },
  { bg: "#FEF3E2", border: "#E8930C", deep: "#7C4A03" },
  { bg: "#E3F0FD", border: "#3B82C4", deep: "#1E3A5F" },
  { bg: "#FDE7F1", border: "#D6336C", deep: "#831843" },
  { bg: "#EFEBFD", border: "#7C6BD9", deep: "#3B2E7A" },
  { bg: "#E0F7F4", border: "#0E9594", deep: "#134E4A" },
  { bg: "#FFF7CC", border: "#D9A404", deep: "#713F12" },
  { bg: "#FDE8E0", border: "#E4572E", deep: "#7C2D12" },
  { bg: "#EAF3DC", border: "#74B72E", deep: "#365314" },
  { bg: "#E8EEF7", border: "#64748B", deep: "#1E293B" },
];
export const groupColor = (i) => GROUP_COLORS[i % GROUP_COLORS.length];

// ── Palette đội thi đua (8 màu pastel cố định, theo tông ảnh mẫu 5) ────
export const TEAM_COLORS = [
  { id: "xanh-ngoc", label: "Xanh Ngọc", bg: "#D9F2E6", border: "#3BA272", deep: "#14532D" },
  { id: "xanh-la", label: "Xanh Lá", bg: "#E4F5DC", border: "#74B72E", deep: "#365314" },
  { id: "vang-kem", label: "Vàng Kem", bg: "#FBF3D5", border: "#D9A404", deep: "#713F12" },
  { id: "cam-san-ho", label: "Cam San Hô", bg: "#FDE3DC", border: "#E8836B", deep: "#7C2D12" },
  { id: "hong-dao", label: "Hồng Đào", bg: "#FDE8EC", border: "#EC7FA5", deep: "#831843" },
  { id: "tim-nhat", label: "Tím Nhạt", bg: "#ECE7FB", border: "#9B8CF2", deep: "#3B2E7A" },
  { id: "xanh-duong", label: "Xanh Dương", bg: "#E0F0FD", border: "#5BA8E8", deep: "#1E3A5F" },
  { id: "xam-ngoc", label: "Xám Ngọc", bg: "#E6EDEA", border: "#8FAE9F", deep: "#274435" },
];
export const TEAM_COLOR_BY_ID = Object.fromEntries(TEAM_COLORS.map((c) => [c.id, c]));

// ── Level bảng vàng cá nhân (mốc điểm công khai) ───────────────────────
export const LEVELS = [
  { lv: 1, min: 0, label: "Lv.1", range: "0–9", badge: "bg-slate-100 text-slate-600 border-slate-300" },
  { lv: 2, min: 10, label: "Lv.2", range: "10–24", badge: "bg-sky-100 text-sky-700 border-sky-300" },
  { lv: 3, min: 25, label: "Lv.3", range: "25–49", badge: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { lv: 4, min: 50, label: "Lv.4", range: "50–99", badge: "bg-amber-100 text-amber-700 border-amber-300" },
  { lv: 5, min: 100, label: "Lv.5", range: "100+", badge: "bg-violet-100 text-violet-700 border-violet-300" },
];
export function levelForPoints(points) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (Number(points) >= l.min) current = l;
  return current;
}
