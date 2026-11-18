import { useEffect, useRef, useState } from "react";
import { Check, ClipboardList, Download, Info, Loader2, Pencil, Plus, RotateCcw, School, Star, Trash2, Upload } from "lucide-react";
import { ConfirmModal, GhostButton, Input, Modal, Select } from "../../../components/ui";
import { useConfirm } from "../../../hooks/useConfirm.js";
import { genderFromWord, parseNameLine } from "../../../hooks/useClassRoster.js";
import { classService } from "../../../services/api.js";
import { apiLocalClassId, buildApiClassEntry } from "./apiRosterMock.js";
import { GENDER_BADGE, GENDER_LABEL } from "./shared.js";

/**
 * RosterPanel — panel "Danh sách lớp & Điểm" DÙNG CHUNG cho mọi tab của
 * trang Công cụ lớp học (Gọi tên đợt 1; Chia nhóm / Bảng điểm / Chỗ ngồi /
 * Nề nếp các đợt sau dùng lại nguyên panel này).
 *
 * Nhận toàn bộ hook useClassRoster qua props `roster` (trang cha giữ hook
 * và truyền xuống) để các tab chia sẻ CÙNG một danh sách lớp.
 *
 * Hai chế độ xem:
 *  - "Điểm & Điểm danh": STT, sao đặc biệt, tên, badge giới tính, điểm, +1/−1.
 *  - "Sửa danh sách": textarea mỗi dòng 1 tên → Áp dụng (giữ điểm/sao theo
 *    tên khớp qua roster.setStudents / importStudents replace).
 * Nhập/xuất Excel bằng thư viện `xlsx` đã có trong dự án (dynamic import
 * như src/services/question-import/excel.parser.js).
 *
 * Khu "Lớp từ hệ thống EduPlay": nạp danh sách lớp THẬT từ API /classes
 * (classService.list); chọn một lớp là tạo bản sao local kèm HỌC SINH MẪU
 * + sơ đồ chỗ ngồi mẫu (apiRosterMock.js) để xem trước — có banner ghi
 * rõ "Học sinh mẫu (demo)", không ghi gì lên server.
 */

function studentToLine(s) {
  return s.gender ? `${s.name} - ${GENDER_LABEL[s.gender]}` : s.name;
}

/** Đọc file Excel → [{ name, gender }] (cột tên đầu tiên có dữ liệu + cột giới tính nếu có). */
async function readRosterExcel(file) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const cellText = (v) => String(v ?? "").trim();

  // Tìm hàng tiêu đề (nếu có) để biết cột tên / cột giới tính.
  let headerIdx = -1;
  let nameCol = -1;
  let genderCol = -1;
  for (let r = 0; r < Math.min(rows.length, 5); r += 1) {
    const row = rows[r] || [];
    row.forEach((cell, c) => {
      const t = cellText(cell).toLowerCase();
      if (nameCol < 0 && /(họ.*tên|tên.*học sinh|^tên$|name)/i.test(t)) { nameCol = c; headerIdx = r; }
      if (genderCol < 0 && /(giới tính|gender)/i.test(t)) { genderCol = c; headerIdx = headerIdx < 0 ? r : headerIdx; }
    });
    if (nameCol >= 0) break;
  }
  if (nameCol < 0) {
    // Không có tiêu đề: cột tên = cột đầu tiên chứa chữ (không phải toàn số).
    const colCount = Math.max(0, ...rows.map((r) => (r || []).length));
    for (let c = 0; c < colCount && nameCol < 0; c += 1) {
      if (rows.some((r) => { const t = cellText((r || [])[c]); return t && !/^\d+$/.test(t); })) nameCol = c;
    }
    if (nameCol < 0) return [];
    if (genderCol < 0) genderCol = nameCol + 1;
  }

  const entries = [];
  for (let r = headerIdx + 1; r < rows.length; r += 1) {
    const row = rows[r] || [];
    let rawName = cellText(row[nameCol]);
    if (/^\d+$/.test(rawName) && cellText(row[nameCol + 1])) rawName = cellText(row[nameCol + 1]);
    if (!rawName) continue;
    const parsed = parseNameLine(rawName);
    if (!parsed) continue;
    const gender = (genderCol >= 0 ? genderFromWord(cellText(row[genderCol])) : null) ?? parsed.gender;
    entries.push({ name: parsed.name, gender });
  }
  return entries;
}

async function exportRosterExcel(activeClass) {
  const XLSX = await import("xlsx");
  const rows = activeClass.students.map((s) => ({
    "Họ tên": s.name,
    "Giới tính": s.gender ? GENDER_LABEL[s.gender] : "",
    "Điểm": s.points,
    "Đặc biệt": s.star ? "Có" : "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách lớp");
  const safeName = (activeClass.name || "lop-chua-dat-ten").replace(/[\\/:*?"<>|]/g, "-");
  XLSX.writeFile(wb, `Danh-sach-${safeName}.xlsx`);
}

export default function RosterPanel({ roster, showToast }) {
  const { classes, activeClass } = roster;
  const { askConfirm, confirmProps } = useConfirm();
  const [view, setView] = useState("points"); // "points" | "edit"
  const [editText, setEditText] = useState("");
  const [classModal, setClassModal] = useState(null); // { mode: "add"|"rename", name }
  const fileRef = useRef(null);

  // Danh sách lớp THẬT từ hệ thống (API /classes qua classService.list —
  // đúng đường gọi của trang quản lý lớp): null = đang tải; lỗi thì báo
  // rõ và panel vẫn dùng bình thường với các lớp lưu trên máy này.
  const [apiClasses, setApiClasses] = useState(null);
  const [apiError, setApiError] = useState("");
  useEffect(() => {
    let cancelled = false;
    classService
      .list()
      .then((list) => {
        if (!cancelled) setApiClasses(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) {
          setApiClasses([]);
          setApiError("Không tải được danh sách lớp từ hệ thống. Bạn vẫn dùng được các lớp đã lưu trên máy này.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!activeClass) return null;
  const students = activeClass.students;
  const starCount = students.filter((s) => s.star).length;

  const switchView = (next) => {
    if (next === "edit") setEditText(students.map(studentToLine).join("\n"));
    setView(next);
  };

  const applyEditText = () => {
    const count = roster.importStudents(editText.split("\n"), { replace: true });
    showToast?.(`Đã nạp danh sách ${count} học sinh`);
    setView("points");
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const entries = await readRosterExcel(file);
      if (!entries.length) {
        showToast?.("Không đọc được tên học sinh nào từ file Excel", "error");
        return;
      }
      const doImport = () => {
        roster.importStudents(entries, { replace: true });
        showToast?.(`Đã nạp ${entries.length} học sinh từ file Excel`);
        setView("points");
      };
      if (students.length) {
        askConfirm({
          title: "Nạp danh sách từ Excel",
          message: `Danh sách hiện tại có ${students.length} học sinh. Nạp file sẽ thay bằng ${entries.length} học sinh trong file (điểm và sao của học sinh trùng tên được giữ lại).`,
          confirmLabel: "Thay thế",
          danger: false,
          onConfirm: doImport,
        });
      } else doImport();
    } catch {
      showToast?.("Đọc file Excel thất bại — kiểm tra lại định dạng file", "error");
    }
  };

  const handleExport = async () => {
    if (!students.length) {
      showToast?.("Danh sách đang trống, chưa có gì để xuất", "error");
      return;
    }
    try {
      await exportRosterExcel(activeClass);
    } catch {
      showToast?.("Xuất Excel thất bại", "error");
    }
  };

  const submitClassModal = () => {
    const name = (classModal?.name ?? "").trim();
    if (classModal?.mode === "add") {
      roster.addClass(name);
      showToast?.(name ? `Đã thêm lớp "${name}"` : "Đã thêm lớp mới (chưa đặt tên)");
    } else if (classModal?.mode === "rename") {
      roster.renameClass(activeClass.id, name);
      showToast?.("Đã đổi tên lớp");
    }
    setClassModal(null);
  };

  /**
   * Nạp một lớp hệ thống vào roster local: tạo bản sao kèm học sinh MẪU
   * + sơ đồ chỗ ngồi mẫu (apiRosterMock, deterministic theo id lớp) để
   * xem trước; nạp lại chỉ đồng bộ tên/sĩ số và mở lại đúng bản sao đó —
   * không nhân đôi, không ghi đè điểm/sơ đồ giáo viên đã chỉnh, và
   * không ghi bất cứ thứ gì lên server.
   */
  const handleImportApiClass = (apiCls) => {
    const existing = classes.find((c) => c.id === apiLocalClassId(apiCls.id)) || null;
    roster.upsertClass(buildApiClassEntry(apiCls, existing));
    showToast?.(
      existing
        ? `Đã mở lớp "${apiCls.name}" — bản mẫu lưu trên máy này`
        : `Đã nạp lớp "${apiCls.name}" kèm học sinh mẫu để xem trước`,
    );
  };

  return (
    <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-display font-bold text-ink flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-600" />
          Danh sách lớp &amp; Điểm
        </h2>
        <span className="text-xs font-semibold text-ink/60 bg-paper2 border border-ink/10 rounded-full px-2.5 py-1">
          {students.length} học sinh • {starCount} đặc biệt
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <Select
            value={activeClass.id}
            onChange={(id) => roster.setActiveClass(id)}
            options={classes.map((c, i) => {
              const base = c.name || `Lớp ${i + 1} (chưa đặt tên)`;
              return { value: c.id, label: c.source === "api" ? `${base} — lớp hệ thống (mẫu)` : base };
            })}
          />
        </div>
        <button type="button" title="Đổi tên lớp" onClick={() => setClassModal({ mode: "rename", name: activeClass.name })}
          className="shrink-0 w-9 h-9 grid place-items-center rounded-xl border border-ink/15 text-ink/60 hover:bg-ink/5 transition">
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 px-3 py-2.5 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-display font-bold text-sky-900">
          <School className="w-4 h-4" />
          Lớp từ hệ thống EduPlay
          {apiClasses === null && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        </div>
        {apiError ? (
          <p className="text-[11px] leading-relaxed text-rose-600">{apiError}</p>
        ) : apiClasses === null ? (
          <p className="text-[11px] text-sky-900/60">Đang tải danh sách lớp…</p>
        ) : apiClasses.length === 0 ? (
          <p className="text-[11px] text-sky-900/60">Tài khoản của bạn chưa có lớp nào trên hệ thống.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {apiClasses.map((cls) => {
              const localId = apiLocalClassId(cls.id);
              const imported = classes.some((c) => c.id === localId);
              const isActive = activeClass.id === localId;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => handleImportApiClass(cls)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-2.5 py-1.5 border transition active:scale-[0.98] ${
                    isActive
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-sky-900 border-sky-200 hover:bg-sky-100"
                  }`}
                >
                  <span>{cls.name}</span>
                  {typeof cls.studentCount === "number" && (
                    <span className={isActive ? "text-sky-100" : "text-sky-700/70"}>· {cls.studentCount} HS</span>
                  )}
                  {isActive ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide">Đang dùng</span>
                  ) : imported ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                      <Check className="w-3 h-3" /> Đã nạp
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-sky-600">Nạp lớp</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <p className="text-[10px] leading-relaxed text-sky-900/55">
          Nạp lớp chỉ tạo bản sao trên máy này kèm học sinh mẫu để xem trước — không thay đổi dữ liệu trên hệ thống.
        </p>
      </div>

      {activeClass.source === "api" && (
        <div className="flex gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-amber-800">
            <b>Học sinh mẫu (demo):</b> danh sách học sinh của lớp này là dữ liệu giả sinh tự động để xem trước,
            không phải học sinh thật đã ghi danh
            {typeof activeClass.apiStudentCount === "number" && (
              <> (lớp thật hiện có {activeClass.apiStudentCount} học sinh trên hệ thống)</>
            )}
            . Điểm, nhóm và chỗ ngồi của lớp mẫu chỉ lưu trên máy này.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => setClassModal({ mode: "add", name: "" })}
          className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition">
          <Plus className="w-3.5 h-3.5" /> Lớp
        </button>
        <button type="button"
          onClick={() => askConfirm({
            title: "Xoá lớp",
            message: `Xoá lớp "${activeClass.name || "(chưa đặt tên)"}" cùng toàn bộ danh sách và điểm của lớp này?`,
            confirmLabel: "Xoá lớp",
            onConfirm: () => roster.removeClass(activeClass.id),
          })}
          className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 active:scale-[0.98] transition">
          <Trash2 className="w-3.5 h-3.5" /> Xoá
        </button>
        <button type="button" onClick={handleExport}
          className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 active:scale-[0.98] transition">
          <Download className="w-3.5 h-3.5" /> Xuất Excel
        </button>
        <button type="button" onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-ink/5 text-ink border border-ink/15 hover:bg-ink/10 active:scale-[0.98] transition">
          <Upload className="w-3.5 h-3.5" /> Nhập Excel
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-xl bg-ink/5 p-1">
          {[
            { key: "points", label: "Điểm & Điểm danh" },
            { key: "edit", label: "Sửa danh sách" },
          ].map((t) => (
            <button key={t.key} type="button" onClick={() => switchView(t.key)}
              className={`text-xs font-display font-semibold rounded-lg px-3 py-1.5 transition ${view === t.key ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <button type="button"
          onClick={() => askConfirm({
            title: "Đặt lại điểm",
            message: "Đưa điểm của toàn bộ học sinh trong lớp về 0?",
            confirmLabel: "Đặt lại",
            danger: false,
            onConfirm: () => { roster.resetPoints(); showToast?.("Đã đặt lại điểm của cả lớp về 0"); },
          })}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition">
          <RotateCcw className="w-3.5 h-3.5" /> Đặt lại điểm = 0
        </button>
      </div>

      {view === "points" ? (
        students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2/60 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-ink">Lớp chưa có học sinh nào</p>
            <p className="text-xs text-ink/55 mt-1 leading-relaxed">
              Chuyển sang thẻ <b>“Sửa danh sách”</b> để dán danh sách (mỗi dòng một tên,
              có thể ghi thêm “- Nam” / “- Nữ” ở cuối), hoặc bấm <b>Nhập Excel</b> để nạp từ file.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5 max-h-[540px] overflow-y-auto pr-1">
            {students.map((s, i) => (
              <li key={s.id} className={`flex items-center gap-2 rounded-2xl border px-2.5 py-2 ${s.star ? "border-amber-300 bg-amber-50/70" : "border-ink/10 bg-white"}`}>
                <span className="text-xs font-bold text-ink/40 w-5 text-right shrink-0">{i + 1}.</span>
                <button type="button" title={s.star ? "Bỏ đánh dấu đặc biệt" : "Đánh dấu đặc biệt (ưu tiên khi gọi tên)"}
                  onClick={() => roster.updateStudent(s.id, { star: !s.star })}
                  className="shrink-0 active:scale-90 transition">
                  <Star className={`w-[18px] h-[18px] ${s.star ? "fill-amber-400 text-amber-500" : "text-ink/25 hover:text-amber-400"}`} />
                </button>
                <span className="flex-1 min-w-0 truncate text-sm font-semibold text-ink">{s.name}</span>
                {s.gender && (
                  <span className={`shrink-0 text-[10px] font-bold rounded-full border px-2 py-0.5 ${GENDER_BADGE[s.gender]}`}>
                    {GENDER_LABEL[s.gender]}
                  </span>
                )}
                <span className="shrink-0 min-w-8 text-center text-sm font-bold text-ink bg-paper2 border border-ink/10 rounded-lg px-1.5 py-0.5">
                  {s.points}
                </span>
                <button type="button" onClick={() => roster.adjustPoints(s.id, 1)}
                  className="shrink-0 text-xs font-bold rounded-lg px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition">+1</button>
                <button type="button" onClick={() => roster.adjustPoints(s.id, -1)}
                  className="shrink-0 text-xs font-bold rounded-lg px-2 py-1 bg-white text-ink border border-ink/20 hover:bg-ink/5 active:scale-95 transition">−1</button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            type="textarea"
            rows={12}
            value={editText}
            onChange={setEditText}
            placeholder={"Mỗi dòng một học sinh, ví dụ:\nNguyễn Văn An - Nam\nTrần Thị Bình - Nữ\nLê Hoàng Cúc"}
          />
          <p className="text-[11px] text-ink/50 leading-relaxed">
            Dán thẳng từ Excel/Word cũng được (cột STT và cột giới tính tự nhận).
            Học sinh trùng tên với danh sách cũ được giữ nguyên điểm và dấu sao.
          </p>
          <div className="flex justify-end">
            <GhostButton onClick={applyEditText} className="px-4 py-2 text-sm rounded-xl">Áp dụng danh sách</GhostButton>
          </div>
        </div>
      )}

      {classModal && (
        <Modal onClose={() => setClassModal(null)}>
          <h3 className="font-display text-lg text-ink mb-3">
            {classModal.mode === "add" ? "Thêm lớp mới" : "Đổi tên lớp"}
          </h3>
          <Input
            label="Tên lớp"
            placeholder="Ví dụ: 3A, 4B…"
            value={classModal.name}
            onChange={(v) => setClassModal((m) => ({ ...m, name: v }))}
            maxLength={40}
          />
          <div className="flex justify-end gap-2 mt-4">
            <GhostButton onClick={() => setClassModal(null)}>Hủy</GhostButton>
            <button type="button" onClick={submitClassModal}
              className="font-display font-semibold rounded-2xl px-5 py-3 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition shadow-[0_3px_0_rgba(0,0,0,0.18)]">
              {classModal.mode === "add" ? "Thêm lớp" : "Lưu tên"}
            </button>
          </div>
        </Modal>
      )}

      <ConfirmModal {...confirmProps} />
    </section>
  );
}
