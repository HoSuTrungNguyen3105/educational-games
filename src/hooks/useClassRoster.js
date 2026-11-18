import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * useClassRoster — quản danh sách lớp DÙNG CHUNG cho toàn bộ trang
 * "Công cụ lớp học" (tab Gọi tên đợt 1; Chia nhóm / Bảng điểm / Chỗ ngồi /
 * Nề nếp ở các đợt sau dùng lại nguyên hook này, không viết lại).
 *
 * Dữ liệu lưu ở localStorage của máy giáo viên (công cụ dùng tại máy lớp /
 * máy chiếu, mở là dùng ngay, không cần mạng) theo key
 * `eduplay_class_tools_v1`:
 *
 *   {
 *     classes: [{
 *       id, name,
 *       students: [{ id, name, gender: "male"|"female"|null,
 *                    star: boolean, points: number }]
 *     }],
 *     activeClassId
 *   }
 *
 * Điểm ở đây là điểm thi đua ngay tại lớp, TÁCH BIỆT với coin của EduPlay.
 * Lần đầu mở (chưa có dữ liệu): tạo sẵn đúng 1 lớp trống (chưa đặt tên,
 * danh sách rỗng) — KHÔNG bịa danh sách mẫu; UI hướng dẫn giáo viên nạp.
 */

export const ROSTER_STORAGE_KEY = "eduplay_class_tools_v1";

let uidCounter = 0;
export function uid() {
  uidCounter += 1;
  return `${Date.now().toString(36)}${uidCounter.toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

const GENDER_WORDS = [
  { re: /^(nam|trai|male|m)$/i, value: "male" },
  { re: /^(nữ|nu|gái|gai|female|f)$/i, value: "female" },
];

export function genderFromWord(word) {
  if (!word) return null;
  const w = String(word).trim();
  for (const g of GENDER_WORDS) if (g.re.test(w)) return g.value;
  return null;
}

/**
 * Tách giới tính khỏi một dòng tên. Hỗ trợ các dạng giáo viên hay dán:
 *   "Nguyễn Văn An"              → { name, gender: null }
 *   "Nguyễn Văn An - Nam"        → male     ("- Nữ" → female)
 *   "Nguyễn Văn An (Nam)"        → male
 *   "Nguyễn Văn An, Nam"         → male     (cột phẩy)
 *   "Nguyễn Văn An<TAB>Nam"      → male     (cột tab khi dán từ Excel)
 *   "1<TAB>Nguyễn Văn An<TAB>Nam"→ male     (có cột STT ở đầu)
 *   "1. Nguyễn Văn An"           → bỏ tiền tố STT
 */
export function parseNameLine(raw) {
  let line = String(raw ?? "").replace(/\r/g, "").trim();
  if (!line) return null;

  // Dạng cột tab (dán từ Excel): [STT?] Tên [Giới tính?]
  if (line.includes("\t")) {
    const cells = line.split("\t").map((c) => c.trim()).filter((c) => c !== "");
    if (cells.length && /^\d+$/.test(cells[0])) cells.shift();
    if (!cells.length) return null;
    const gender = cells.length > 1 ? genderFromWord(cells[cells.length - 1]) : null;
    const name = gender && cells.length > 1 ? cells.slice(0, -1).join(" ") : cells.join(" ");
    return name ? { name, gender } : null;
  }

  let gender = null;

  // "Tên (Nam)" / "Tên (Nữ)"
  const paren = line.match(/\(\s*([A-Za-zÀ-ỹ]+)\s*\)\s*$/);
  if (paren) {
    const g = genderFromWord(paren[1]);
    if (g) {
      gender = g;
      line = line.slice(0, paren.index).trim();
    }
  }

  // "Tên - Nam" / "Tên, Nam" / "Tên; Nữ" / "Tên – Nam"
  if (!gender) {
    const suffix = line.match(/[-–—,;]\s*([A-Za-zÀ-ỹ]+)\s*$/);
    if (suffix) {
      const g = genderFromWord(suffix[1]);
      if (g) {
        gender = g;
        line = line.slice(0, suffix.index).trim();
      }
    }
  }

  // Bỏ tiền tố STT kiểu "1." / "1)"
  line = line.replace(/^\d+\s*[.)]\s*/, "").trim();
  if (!line) return null;
  return { name: line, gender };
}

/** Parse nhiều dòng text (mỗi dòng 1 học sinh) → [{ name, gender }]. */
export function parseRosterText(text) {
  return String(text ?? "")
    .split("\n")
    .map(parseNameLine)
    .filter(Boolean);
}

function emptyClass(name = "") {
  return { id: uid(), name, students: [] };
}

function normalizeStudent(s) {
  return {
    id: s?.id || uid(),
    name: String(s?.name ?? "").trim(),
    gender: s?.gender === "male" || s?.gender === "female" ? s.gender : null,
    star: Boolean(s?.star),
    points: Number.isFinite(Number(s?.points)) ? Number(s.points) : 0,
  };
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(ROSTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const classes = Array.isArray(parsed?.classes)
        ? parsed.classes
            .filter((c) => c && typeof c === "object")
            .map((c) => ({
              // Giữ nguyên các field phụ theo lớp của các đợt sau
              // (groups của Chia nhóm, teams của Bảng điểm…) — hook này chỉ
              // chuẩn hoá id/name/students, không xoá field lạ.
              ...c,
              id: c.id || uid(),
              name: String(c.name ?? ""),
              students: Array.isArray(c.students) ? c.students.map(normalizeStudent).filter((s) => s.name) : [],
            }))
        : [];
      if (classes.length) {
        const activeClassId = classes.some((c) => c.id === parsed.activeClassId)
          ? parsed.activeClassId
          : classes[0].id;
        return { classes, activeClassId };
      }
    }
  } catch {
    /* dữ liệu hỏng → khởi tạo mới ở dưới */
  }
  const first = emptyClass("");
  return { classes: [first], activeClassId: first.id };
}

export function useClassRoster() {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* localStorage đầy/bị chặn: bỏ qua, state trong phiên vẫn dùng được */
    }
  }, [state]);

  const { classes, activeClassId } = state;
  const activeClass = useMemo(
    () => classes.find((c) => c.id === activeClassId) || classes[0] || null,
    [classes, activeClassId],
  );

  const patchClass = useCallback((classId, patcher) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === classId ? patcher(c) : c)),
    }));
  }, []);

  const patchActive = useCallback(
    (patcher) => {
      if (activeClass) patchClass(activeClass.id, patcher);
    },
    [activeClass, patchClass],
  );

  const setActiveClass = useCallback((id) => {
    setState((prev) => (prev.classes.some((c) => c.id === id) ? { ...prev, activeClassId: id } : prev));
  }, []);

  const addClass = useCallback((name) => {
    const cls = emptyClass(String(name ?? "").trim());
    setState((prev) => ({ classes: [...prev.classes, cls], activeClassId: cls.id }));
    return cls;
  }, []);

  const removeClass = useCallback((id) => {
    setState((prev) => {
      const rest = prev.classes.filter((c) => c.id !== id);
      if (!rest.length) {
        const fresh = emptyClass("");
        return { classes: [fresh], activeClassId: fresh.id };
      }
      return {
        classes: rest,
        activeClassId: prev.activeClassId === id ? rest[0].id : prev.activeClassId,
      };
    });
  }, []);

  const renameClass = useCallback(
    (id, name) => patchClass(id, (c) => ({ ...c, name: String(name ?? "").trim() })),
    [patchClass],
  );

  /**
   * Thêm mới hoặc thay thế một lớp theo `entry.id` rồi chọn làm lớp
   * đang dùng. Dùng cho nạp lớp từ nguồn ngoài (vd "Lớp từ hệ thống" ở
   * RosterPanel): phía gọi tự dựng entry đã merge sẵn (giữ học sinh/
   * điểm/sơ đồ giáo viên đã chỉnh khi lớp đã tồn tại) — hook chỉ chuẩn
   * hoá học sinh và ghi vào state, không tự quyết nội dung.
   */
  const upsertClass = useCallback((entry) => {
    if (!entry || typeof entry !== "object" || !entry.id) return;
    const normalized = {
      ...entry,
      id: String(entry.id),
      name: String(entry.name ?? ""),
      students: (Array.isArray(entry.students) ? entry.students : [])
        .map(normalizeStudent)
        .filter((s) => s.name),
    };
    setState((prev) => {
      const exists = prev.classes.some((c) => c.id === normalized.id);
      const classes = exists
        ? prev.classes.map((c) => (c.id === normalized.id ? normalized : c))
        : [...prev.classes, normalized];
      return { classes, activeClassId: normalized.id };
    });
  }, []);

  /**
   * Thay toàn bộ danh sách của lớp đang chọn bằng `list`
   * ([{ name, gender }]). Học sinh trùng tên với danh sách cũ được GIỮ LẠI
   * id/điểm/sao — sửa danh sách không làm mất điểm đã cộng.
   */
  const setStudents = useCallback(
    (list) => {
      patchActive((c) => {
        const used = new Set();
        const students = (Array.isArray(list) ? list : [])
          .map((entry) => {
            const name = String(entry?.name ?? "").trim();
            if (!name) return null;
            const gender = entry?.gender === "male" || entry?.gender === "female" ? entry.gender : null;
            const prevStudent = c.students.find((s) => !used.has(s.id) && s.name === name);
            if (prevStudent) {
              used.add(prevStudent.id);
              return { ...prevStudent, gender: gender ?? prevStudent.gender };
            }
            return { id: uid(), name, gender, star: false, points: 0 };
          })
          .filter(Boolean);
        return { ...c, students };
      });
    },
    [patchActive],
  );

  const addStudent = useCallback(
    (name, gender = null) => {
      const trimmed = String(name ?? "").trim();
      if (!trimmed) return;
      patchActive((c) => ({
        ...c,
        students: [...c.students, { id: uid(), name: trimmed, gender, star: false, points: 0 }],
      }));
    },
    [patchActive],
  );

  const removeStudent = useCallback(
    (studentId) => {
      patchActive((c) => ({ ...c, students: c.students.filter((s) => s.id !== studentId) }));
    },
    [patchActive],
  );

  const updateStudent = useCallback(
    (studentId, patch) => {
      patchActive((c) => ({
        ...c,
        students: c.students.map((s) => (s.id === studentId ? normalizeStudent({ ...s, ...patch, id: s.id }) : s)),
      }));
    },
    [patchActive],
  );

  const adjustPoints = useCallback(
    (studentId, delta) => {
      patchActive((c) => ({
        ...c,
        students: c.students.map((s) => (s.id === studentId ? { ...s, points: s.points + delta } : s)),
      }));
    },
    [patchActive],
  );

  const resetPoints = useCallback(() => {
    patchActive((c) => ({ ...c, students: c.students.map((s) => ({ ...s, points: 0 })) }));
  }, [patchActive]);

  /**
   * Nạp học sinh từ nguồn ngoài: `entries` là mảng dòng text (dán tay)
   * hoặc mảng { name, gender } (đọc từ Excel).
   * - replace = true: thay toàn bộ danh sách (giữ điểm/sao theo tên khớp,
   *   qua setStudents).
   * - replace = false: nối thêm vào cuối danh sách hiện tại.
   * Trả về số học sinh đã nạp.
   */
  const importStudents = useCallback(
    (entries, { replace = false } = {}) => {
      const parsed = (Array.isArray(entries) ? entries : [])
        .map((e) => (typeof e === "string" ? parseNameLine(e) : e && e.name ? { name: String(e.name).trim(), gender: e.gender ?? null } : null))
        .filter((e) => e && e.name);
      if (!parsed.length) return 0;
      if (replace) {
        setStudents(parsed);
      } else {
        patchActive((c) => ({
          ...c,
          students: [
            ...c.students,
            ...parsed.map((p) => ({ id: uid(), name: p.name, gender: p.gender ?? null, star: false, points: 0 })),
          ],
        }));
      }
      return parsed.length;
    },
    [patchActive, setStudents],
  );

  return {
    classes,
    activeClass,
    activeClassId,
    // patchClass: lối ghi field phụ theo lớp cho các hook companion
    // (useClassGroups, useClassTeams) — dùng chung một state + một
    // localStorage key, không hook nào tự giữ bản sao dữ liệu lớp.
    patchClass,
    setActiveClass,
    addClass,
    removeClass,
    renameClass,
    upsertClass,
    setStudents,
    addStudent,
    removeStudent,
    updateStudent,
    adjustPoints,
    resetPoints,
    importStudents,
  };
}
