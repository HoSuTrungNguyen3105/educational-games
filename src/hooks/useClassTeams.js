import { useCallback } from "react";
import { uid } from "./useClassRoster.js";
import { TEAM_COLORS, TEAM_COLOR_BY_ID } from "../pages/teacher/class-tools/shared.js";

/**
 * useClassTeams — hook companion của useClassRoster cho sub-tab
 * "Điểm các Đội" của tab Bảng điểm. Ghi field `teams` vào object lớp
 * đang chọn qua `roster.patchClass` (cùng object localStorage
 * `eduplay_class_tools_v1`, tương thích ngược như useClassGroups).
 *
 * Shape: teams: [{ id, name, colorId, points }]
 *
 * Lớp CHƯA từng có field `teams` (undefined) → hiện 4 đội mặc định theo
 * đúng 4 màu đầu của ảnh mẫu (Xanh Ngọc, Xanh Lá, Vàng Kem, Cam San Hô,
 * điểm 0). Đây là cấu trúc mặc định của công cụ, không phải dữ liệu học
 * sinh giả. Lớp đã có field (kể cả mảng rỗng do giáo viên xoá hết) thì
 * tôn trọng nguyên trạng, không tự tạo lại.
 */

function makeDefaultTeams(classId) {
  // Id xác định theo lớp + màu (không random) để danh sách mặc định ổn
  // định giữa các lần render và không trùng id giữa các lớp.
  return TEAM_COLORS.slice(0, 4).map((c) => ({
    id: `team-${classId}-${c.id}`,
    name: `Đội ${c.label}`,
    colorId: c.id,
    points: 0,
  }));
}

function normalizeTeams(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t) => t && typeof t === "object")
    .map((t) => ({
      id: t.id || uid(),
      name: String(t.name ?? "").trim() || "Đội chưa đặt tên",
      colorId: TEAM_COLOR_BY_ID[t.colorId] ? t.colorId : TEAM_COLORS[0].id,
      points: Number.isFinite(Number(t.points)) ? Number(t.points) : 0,
    }));
}

export function useClassTeams(roster) {
  const { activeClass } = roster;
  const classId = activeClass?.id;
  const rawTeams = activeClass?.teams;

  // Lớp chưa có field teams → 4 đội mặc định (sinh xác định theo classId
  // nên ổn định giữa các lần render); lần ghi đầu tiên sẽ lưu nguyên
  // danh sách này xuống. Đã có field thì chuẩn hoá từ dữ liệu thật.
  const teams = rawTeams === undefined ? makeDefaultTeams(classId) : normalizeTeams(rawTeams);

  const write = useCallback(
    (next) => {
      if (!classId) return;
      roster.patchClass(classId, (c) => ({ ...c, teams: normalizeTeams(next) }));
    },
    [classId, roster],
  );

  const addTeam = useCallback(() => {
    const usedColors = new Set(teams.map((t) => t.colorId));
    const color = TEAM_COLORS.find((c) => !usedColors.has(c.id)) ?? TEAM_COLORS[teams.length % TEAM_COLORS.length];
    const sameColorCount = teams.filter((t) => t.colorId === color.id).length;
    const team = {
      id: uid(),
      name: sameColorCount ? `Đội ${color.label} ${sameColorCount + 1}` : `Đội ${color.label}`,
      colorId: color.id,
      points: 0,
    };
    write([...teams, team]);
    return team;
  }, [teams, write]);

  const removeTeam = useCallback(
    (teamId) => write(teams.filter((t) => t.id !== teamId)),
    [teams, write],
  );

  const renameTeam = useCallback(
    (teamId, name) => {
      const trimmed = String(name ?? "").trim();
      if (!trimmed) return;
      write(teams.map((t) => (t.id === teamId ? { ...t, name: trimmed } : t)));
    },
    [teams, write],
  );

  const adjustTeamPoints = useCallback(
    (teamId, delta) => write(teams.map((t) => (t.id === teamId ? { ...t, points: t.points + delta } : t))),
    [teams, write],
  );

  const resetTeamPoints = useCallback(
    () => write(teams.map((t) => ({ ...t, points: 0 }))),
    [teams, write],
  );

  return { teams, addTeam, removeTeam, renameTeam, adjustTeamPoints, resetTeamPoints };
}
