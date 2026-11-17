import { useCallback, useMemo } from "react";
import { ROLE_ORDER, assignRolesRandomly, distributeGroups } from "../pages/teacher/class-tools/groupUtils.js";
import { ROLES } from "../pages/teacher/class-tools/shared.js";

/**
 * useClassGroups — hook companion của useClassRoster cho tab Chia nhóm.
 *
 * Vì sao không mở rộng thẳng useClassRoster: hook roster đợt 1 sở hữu
 * toàn bộ state lớp + vòng lặp lưu localStorage; đợt 2 chỉ cần GHI thêm
 * field `groups` vào object lớp đang chọn qua `roster.patchClass` —
 * không thêm state/key lưu trữ thứ hai, dữ liệu đợt 1 không có field này
 * vẫn đọc bình thường (mặc định rỗng).
 *
 * Shape lưu trong object lớp (key `eduplay_class_tools_v1`):
 *   groups: {
 *     groupCount: 4,                          // 2–10
 *     assignments: { studentId: groupIndex }, // nhóm hiện tại
 *     roles:       { studentId: roleId },     // vai trò đang giữ
 *     pinned:      { studentId: groupIndex }, // ghim cứng khi chia ngẫu nhiên
 *     excluded:    { studentId: true },       // không tham gia chia nhóm
 *   }
 *
 * Mọi lần ĐỌC đều chuẩn hoá theo danh sách học sinh HIỆN TẠI: học sinh đã
 * bị xoá khỏi roster thì assignment/role/pin tự biến mất; ràng buộc "mỗi
 * nhóm ≤1 người/vai trò, mỗi học sinh ≤1 vai trò, chỉ học sinh có nhóm
 * mới có vai trò" cũng được ép tại đây nên dữ liệu cũ/lệch không lọt ra UI.
 */

export const MIN_GROUPS = 2;
export const MAX_GROUPS = 10;
const ROLE_IDS = new Set(ROLES.map((r) => r.id));

const clampGroupCount = (n) => {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) ? Math.min(MAX_GROUPS, Math.max(MIN_GROUPS, v)) : 4;
};

const isGroupIndex = (v, count) => Number.isInteger(v) && v >= 0 && v < count;

export function normalizeGroups(raw, students) {
  const groupCount = clampGroupCount(raw?.groupCount ?? 4);
  const ids = new Set((students ?? []).map((s) => s.id));
  const pickMap = (obj, valid) => {
    const out = {};
    for (const [id, v] of Object.entries(obj ?? {})) {
      if (ids.has(id) && valid(v)) out[id] = v;
    }
    return out;
  };

  const assignments = pickMap(raw?.assignments, (v) => isGroupIndex(v, groupCount));
  const pinned = pickMap(raw?.pinned, (v) => isGroupIndex(v, groupCount));
  const excluded = pickMap(raw?.excluded, (v) => v === true);

  // Học sinh không tham gia thì không có nhóm/vai trò/ghim.
  for (const id of Object.keys(excluded)) {
    delete assignments[id];
    delete pinned[id];
  }

  // Vai trò: chỉ giữ cho học sinh CÓ nhóm; duyệt theo thứ tự roster để
  // khi hai em cùng nhóm trùng vai trò thì em đứng trước giữ, em sau mất.
  const roles = {};
  const usedGroupRole = new Set();
  for (const s of students ?? []) {
    const roleId = raw?.roles?.[s.id];
    const gi = assignments[s.id];
    if (!ROLE_IDS.has(roleId) || gi === undefined) continue;
    const key = `${gi}|${roleId}`;
    if (usedGroupRole.has(key)) continue;
    usedGroupRole.add(key);
    roles[s.id] = roleId;
  }

  return { groupCount, assignments, roles, pinned, excluded };
}

export function useClassGroups(roster) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);
  const classId = activeClass?.id;

  const groups = useMemo(
    () => normalizeGroups(activeClass?.groups, students),
    [activeClass?.groups, students],
  );

  const write = useCallback(
    (next) => {
      if (!classId) return;
      roster.patchClass(classId, (c) => ({ ...c, groups: normalizeGroups(next, c.students) }));
    },
    [classId, roster],
  );

  const setGroupCount = useCallback(
    (n) => {
      const count = clampGroupCount(n);
      // Cắt assignment/pin vượt quá số nhóm mới ngay khi ghi (đọc lại cũng
      // bị lọc, nhưng cắt sớm để giảm số nhóm rồi tăng lại không "hồi sinh"
      // vị trí cũ một cách bất ngờ).
      const prune = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v < count));
      write({ ...groups, groupCount: count, assignments: prune(groups.assignments), pinned: prune(groups.pinned) });
    },
    [groups, write],
  );

  const randomizeGroups = useCallback(() => {
    const assignments = distributeGroups({
      students,
      groupCount: groups.groupCount,
      pinned: groups.pinned,
      excludedIds: Object.keys(groups.excluded),
    });
    write({ ...groups, assignments });
  }, [groups, students, write]);

  /** Bấm vòng tròn vai trò: gán / chuyển / bỏ vai trò cho 1 học sinh. */
  const toggleRole = useCallback(
    (studentId, roleId) => {
      const gi = groups.assignments[studentId];
      if (gi === undefined) return; // chưa có nhóm thì không giữ vai trò
      const roles = { ...groups.roles };
      if (roles[studentId] === roleId) {
        delete roles[studentId]; // bấm lại vào vai trò đang giữ → bỏ
      } else {
        // Nhóm đã có người giữ vai trò này → người cũ mất vai trò đó
        // (mỗi nhóm tối đa 1 người cho mỗi vai trò).
        for (const [id, r] of Object.entries(roles)) {
          if (r === roleId && groups.assignments[id] === gi) delete roles[id];
        }
        roles[studentId] = roleId; // gán mới đồng thời rời vai trò cũ của em
      }
      write({ ...groups, roles });
    },
    [groups, write],
  );

  const assignRoles = useCallback(() => {
    const membersByGroup = Array.from({ length: groups.groupCount }, () => []);
    for (const s of students) {
      const gi = groups.assignments[s.id];
      if (gi !== undefined) membersByGroup[gi].push(s.id);
    }
    const roles = assignRolesRandomly({ membersByGroup, currentRoles: groups.roles, roleOrder: ROLE_ORDER });
    write({ ...groups, roles });
  }, [groups, students, write]);

  const clearRoles = useCallback(() => write({ ...groups, roles: {} }), [groups, write]);

  /** Đổi nhóm tay từ select: groupIndex = null → rời nhóm. */
  const moveStudent = useCallback(
    (studentId, groupIndex) => {
      const assignments = { ...groups.assignments };
      const pinned = { ...groups.pinned };
      const roles = { ...groups.roles };
      if (groupIndex === null || groupIndex === undefined) {
        delete assignments[studentId];
        delete roles[studentId];
        delete pinned[studentId];
      } else {
        assignments[studentId] = groupIndex;
        // Ghim trỏ sang nhóm khác thì bỏ ghim — thao tác tay thắng ghim cũ.
        if (pinned[studentId] !== undefined && pinned[studentId] !== groupIndex) delete pinned[studentId];
        // Nhóm mới đã có người giữ vai trò của em → em mất vai trò.
        const myRole = roles[studentId];
        if (myRole) {
          const conflict = Object.entries(roles).some(
            ([id, r]) => id !== studentId && r === myRole && assignments[id] === groupIndex,
          );
          if (conflict) delete roles[studentId];
        }
      }
      write({ ...groups, assignments, pinned, roles });
    },
    [groups, write],
  );

  /** Ghim vào nhóm N: assignment cũng về nhóm đó. Ghim = null: bỏ ghim. */
  const setPinned = useCallback(
    (studentId, groupIndex) => {
      const pinned = { ...groups.pinned };
      const assignments = { ...groups.assignments };
      if (groupIndex === null || groupIndex === undefined) {
        delete pinned[studentId];
      } else {
        pinned[studentId] = groupIndex;
        assignments[studentId] = groupIndex;
      }
      write({ ...groups, pinned, assignments });
    },
    [groups, write],
  );

  /** Bật/tắt tham gia: tắt → rời mọi nhóm, mất vai trò và ghim. */
  const setExcluded = useCallback(
    (studentId, excludedFlag) => {
      const excluded = { ...groups.excluded };
      const assignments = { ...groups.assignments };
      const roles = { ...groups.roles };
      const pinned = { ...groups.pinned };
      if (excludedFlag) {
        excluded[studentId] = true;
        delete assignments[studentId];
        delete roles[studentId];
        delete pinned[studentId];
      } else {
        delete excluded[studentId];
      }
      write({ ...groups, excluded, assignments, roles, pinned });
    },
    [groups, write],
  );

  return {
    groups,
    setGroupCount,
    randomizeGroups,
    toggleRole,
    assignRoles,
    clearRoles,
    moveStudent,
    setPinned,
    setExcluded,
  };
}
