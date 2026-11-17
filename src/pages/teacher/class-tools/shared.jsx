import { Star } from "lucide-react";
import { Select } from "../../../components/ui";
import { AVATAR_COLORS, GENDER_BADGE, GENDER_LABEL, ROLE_BY_ID, initialsOf } from "./shared.js";

/**
 * shared.jsx — component nhỏ DÙNG CHUNG cho mọi tab của bộ Công cụ lớp
 * học (badge giới tính, avatar chữ cái đầu, badge vai trò, bộ chọn lớp).
 * Hằng số/palette nằm ở shared.js cùng thư mục.
 */

export function GenderBadge({ gender }) {
  if (!gender || !GENDER_BADGE[gender]) return null;
  return (
    <span className={`shrink-0 text-[10px] font-bold rounded-full border px-2 py-0.5 ${GENDER_BADGE[gender]}`}>
      {GENDER_LABEL[gender]}
    </span>
  );
}

export function InitialAvatar({ name, size = 32 }) {
  let hash = 0;
  const text = String(name ?? "");
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  return (
    <span
      className="shrink-0 grid place-items-center rounded-full font-display font-bold"
      style={{ width: size, height: size, background: color.bg, color: color.text, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
}

/** Tên kèm sao vàng nếu là học sinh "đặc biệt". */
export function StudentName({ student, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 min-w-0 ${className}`}>
      <span className="truncate">{student.name}</span>
      {student.star && <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-500" />}
    </span>
  );
}

export function RoleBadge({ roleId }) {
  const role = ROLE_BY_ID[roleId];
  if (!role) return null;
  return (
    <span className={`shrink-0 text-[10px] font-bold rounded-full border px-2 py-0.5 ${role.badge}`}>
      {role.label}
    </span>
  );
}

/** Bộ chọn lớp gọn cho các tab không có RosterPanel (Chia nhóm, Bảng điểm). */
export function ClassPicker({ roster, className = "" }) {
  const { classes, activeClass } = roster;
  if (!activeClass) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-semibold text-ink/60 shrink-0">Lớp:</span>
      <div className="min-w-52">
        <Select
          value={activeClass.id}
          onChange={(id) => roster.setActiveClass(id)}
          options={classes.map((c, i) => ({ value: c.id, label: c.name || `Lớp ${i + 1} (chưa đặt tên)` }))}
        />
      </div>
    </div>
  );
}
