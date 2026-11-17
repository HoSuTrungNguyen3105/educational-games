import { useCallback, useMemo, useState } from "react";
import { buildSeatIds } from "../pages/teacher/class-tools/seatingUtils.js";

/**
 * useClassSeating — hook companion của useClassRoster cho tab Chỗ ngồi,
 * theo đúng pattern useClassGroups/useClassTeams: chỉ GHI thêm field
 * `seating` vào object lớp đang chọn qua `roster.patchClass` — cùng một
 * state + một localStorage key `eduplay_class_tools_v1`, dữ liệu các đợt
 * trước (không có field này) vẫn đọc bình thường (mặc định cấu hình mẫu).
 *
 * Shape lưu trong object lớp:
 *   seating: {
 *     config: {
 *       cols: 3, rows: 6, perDesk: 3,        // số dãy / bàn mỗi dãy / chỗ mỗi bàn
 *       numberFrom: "back" | "front",        // đánh số bàn từ cuối lớp ↑ / đầu lớp ↓
 *       showDate: true,                      // hiện ngày trên sơ đồ
 *       teacher: "", note: "",               // GVCN/giáo viên, ghi chú
 *       colorMode: "multi" | "mono" | "bw",  // mẫu màu sơ đồ
 *       swapSeconds: 5,                      // hiệu ứng hoán đổi khi xếp ngẫu nhiên (0 = ngay)
 *     },
 *     seats:  { seatId: studentId },         // ai đang ngồi ở đâu
 *     locked: [seatId],                      // ô khoá — không ai ngồi
 *     pinned: { studentId: seatId },         // ghim: học sinh giữ đúng chỗ này
 *   }
 *
 * Bất biến ép khi ĐỌC (normalizeSeating): học sinh đã rời roster thì rời
 * sơ đồ; ô khoá không có người; ghim chỉ tồn tại khi học sinh đang ngồi
 * đúng chỗ ghim và chỗ không khoá; một học sinh ngồi tối đa một chỗ.
 *
 * Hoàn tác: ngăn xếp tối đa 30 snapshot (config + seats + locked +
 * pinned) giữ trong state của hook (không lưu bền), reset khi đổi lớp.
 * Mọi thao tác đổi/khoá/ghim/xếp/áp cấu hình đều đẩy 1 bước.
 */

export const SEATING_LIMITS = { cols: [1, 6], rows: [1, 8], perDesk: [1, 4] };
export const SWAP_SECONDS_OPTIONS = [0, 3, 5, 10, 30];
const COLOR_MODES = new Set(["multi", "mono", "bw"]);
const HISTORY_MAX = 30;

export const DEFAULT_SEATING_CONFIG = {
  cols: 3,
  rows: 6,
  perDesk: 3,
  numberFrom: "back",
  showDate: true,
  teacher: "",
  note: "",
  colorMode: "multi",
  swapSeconds: 5,
};

const clampInt = (value, [min, max], fallback) => {
  const v = Math.floor(Number(value));
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
};

export function normalizeSeatingConfig(raw) {
  const c = raw && typeof raw === "object" ? raw : {};
  return {
    cols: clampInt(c.cols, SEATING_LIMITS.cols, DEFAULT_SEATING_CONFIG.cols),
    rows: clampInt(c.rows, SEATING_LIMITS.rows, DEFAULT_SEATING_CONFIG.rows),
    perDesk: clampInt(c.perDesk, SEATING_LIMITS.perDesk, DEFAULT_SEATING_CONFIG.perDesk),
    numberFrom: c.numberFrom === "front" ? "front" : "back",
    showDate: c.showDate !== false,
    teacher: String(c.teacher ?? ""),
    note: String(c.note ?? ""),
    colorMode: COLOR_MODES.has(c.colorMode) ? c.colorMode : "multi",
    swapSeconds: SWAP_SECONDS_OPTIONS.includes(Number(c.swapSeconds)) ? Number(c.swapSeconds) : 5,
  };
}

export function normalizeSeating(raw, students) {
  const config = normalizeSeatingConfig(raw?.config);
  const validSeats = new Set(buildSeatIds(config));
  const studentIds = new Set((students ?? []).map((s) => s.id));

  const locked = [];
  for (const id of Array.isArray(raw?.locked) ? raw.locked : []) {
    if (validSeats.has(id) && !locked.includes(id)) locked.push(id);
  }
  const lockedSet = new Set(locked);

  // Ghế → học sinh: chỉ giữ cặp hợp lệ (ghế tồn tại, không khoá, học
  // sinh còn trong roster, mỗi học sinh tối đa một ghế).
  const seats = {};
  const placedStudents = new Set();
  for (const [seat, studentId] of Object.entries(raw?.seats ?? {})) {
    if (!validSeats.has(seat) || lockedSet.has(seat)) continue;
    if (!studentIds.has(studentId) || placedStudents.has(studentId)) continue;
    seats[seat] = studentId;
    placedStudents.add(studentId);
  }

  // Ghim chỉ sống khi học sinh đang ngồi ĐÚNG chỗ ghim (mọi thao tác ghi
  // đều giữ bất biến này; dữ liệu lệch từ ngoài vào bị ép lại tại đây).
  const pinned = {};
  for (const [studentId, seat] of Object.entries(raw?.pinned ?? {})) {
    if (studentIds.has(studentId) && seats[seat] === studentId) pinned[studentId] = seat;
  }

  return { config, seats, locked, pinned };
}

export function useClassSeating(roster) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);
  const classId = activeClass?.id;

  const seating = useMemo(
    () => normalizeSeating(activeClass?.seating, students),
    [activeClass?.seating, students],
  );
  const { config, seats, locked, pinned } = seating;

  // Lịch sử hoàn tác theo lớp: đổi lớp thì làm mới ngăn xếp.
  const [history, setHistory] = useState({ classId, stack: [] });
  const undoStack = useMemo(
    () => (history.classId === classId ? history.stack : []),
    [history, classId],
  );

  const write = useCallback(
    (next, { record = true } = {}) => {
      if (!classId) return;
      if (record) {
        setHistory((h) => {
          const stack = h.classId === classId ? h.stack : [];
          return { classId, stack: [...stack.slice(-(HISTORY_MAX - 1)), seating] };
        });
      }
      roster.patchClass(classId, (c) => ({ ...c, seating: normalizeSeating(next, c.students) }));
    },
    [classId, roster, seating],
  );

  const undo = useCallback(() => {
    if (!classId || !undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setHistory({ classId, stack: undoStack.slice(0, -1) });
    roster.patchClass(classId, (c) => ({ ...c, seating: normalizeSeating(prev, c.students) }));
  }, [classId, roster, undoStack]);

  /** Sửa field cấu hình không đổi lưới (giáo viên, ghi chú, ngày, màu, hiệu ứng). */
  const updateConfig = useCallback(
    (patch) => write({ ...seating, config: { ...config, ...patch } }, { record: false }),
    [seating, config, write],
  );

  /**
   * Áp cấu hình lưới mới (số dãy / bàn / chỗ / chiều đánh số): dựng lại
   * lưới — học sinh ở chỗ còn tồn tại và không khoá thì giữ nguyên, chỗ
   * biến mất thì học sinh về danh sách chưa xếp (qua normalizeSeating).
   */
  const applyGridConfig = useCallback(
    (gridPatch) => write({ ...seating, config: { ...config, ...gridPatch } }),
    [seating, config, write],
  );

  /** Chốt kết quả xếp ngẫu nhiên (đã tính bằng assignSeatsRandomly). */
  const applyAssignment = useCallback(
    (nextSeats) => write({ ...seating, seats: nextSeats }),
    [seating, write],
  );

  /**
   * Đổi chỗ hai ô (ô trống cũng đổi được). Ghim của hai học sinh liên
   * quan bị huỷ — chỗ mới là do giáo viên chọn tay, không còn là chỗ ghim.
   */
  const swapSeats = useCallback(
    (seatA, seatB) => {
      if (!seatA || !seatB || seatA === seatB) return;
      if (locked.includes(seatA) || locked.includes(seatB)) return;
      const nextSeats = { ...seats };
      const a = seats[seatA];
      const b = seats[seatB];
      if (b) nextSeats[seatA] = b; else delete nextSeats[seatA];
      if (a) nextSeats[seatB] = a; else delete nextSeats[seatB];
      const nextPinned = { ...pinned };
      if (a) delete nextPinned[a];
      if (b) delete nextPinned[b];
      write({ ...seating, seats: nextSeats, pinned: nextPinned });
    },
    [seating, seats, locked, pinned, write],
  );

  /** Khoá/mở khoá một ô. Khoá ô đang có người → người đó về chưa xếp, mất ghim. */
  const toggleLock = useCallback(
    (seat) => {
      if (locked.includes(seat)) {
        write({ ...seating, locked: locked.filter((id) => id !== seat) });
        return;
      }
      const nextSeats = { ...seats };
      const nextPinned = { ...pinned };
      const occupant = seats[seat];
      if (occupant) {
        delete nextSeats[seat];
        delete nextPinned[occupant];
      }
      write({ ...seating, seats: nextSeats, pinned: nextPinned, locked: [...locked, seat] });
    },
    [seating, seats, locked, pinned, write],
  );

  /** Ghim/huỷ ghim học sinh đang ngồi ở ô này, tại đúng ô này. */
  const togglePinAtSeat = useCallback(
    (seat) => {
      const occupant = seats[seat];
      if (!occupant) return;
      const nextPinned = { ...pinned };
      if (nextPinned[occupant] === seat) delete nextPinned[occupant];
      else nextPinned[occupant] = seat;
      write({ ...seating, pinned: nextPinned });
    },
    [seating, seats, pinned, write],
  );

  /** Xếp một học sinh chưa có chỗ vào ô trống (không khoá) và ghim luôn. */
  const placeStudent = useCallback(
    (studentId, seat) => {
      if (!studentId || seats[seat] || locked.includes(seat)) return;
      if (Object.values(seats).includes(studentId)) return; // đã có chỗ
      write({
        ...seating,
        seats: { ...seats, [seat]: studentId },
        pinned: { ...pinned, [studentId]: seat },
      });
    },
    [seating, seats, locked, pinned, write],
  );

  return {
    seating,
    config,
    seats,
    locked,
    pinned,
    canUndo: undoStack.length > 0,
    undo,
    updateConfig,
    applyGridConfig,
    applyAssignment,
    swapSeats,
    toggleLock,
    togglePinAtSeat,
    placeStudent,
  };
}
