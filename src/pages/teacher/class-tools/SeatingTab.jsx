import { useEffect, useMemo, useRef, useState } from "react";
import {
  Armchair, ArrowLeftRight, FastForward, FlipHorizontal2, Lock, Pin, Printer, Shuffle, Undo2,
} from "lucide-react";
import { Checkbox, Input, Select } from "../../../components/ui";
import { useClassSeating, SWAP_SECONDS_OPTIONS } from "../../../hooks/useClassSeating.js";
import { GROUP_COLORS, groupColor } from "./shared.js";
import { ClassPicker, StudentName } from "./shared.jsx";
import { shortNameOf } from "./shared.js";
import { shuffleWith } from "./groupUtils.js";
import { assignSeatsRandomly, buildSeatIds, deskNumber, seatId, totalSeats } from "./seatingUtils.js";
import PrintSheet from "./PrintSheet.jsx";

/**
 * SeatingTab — tab "Chỗ ngồi" của trang Công cụ lớp học (ảnh mẫu 2).
 *
 * Trái: cấu hình (thông tin lớp, cấu trúc dãy/bàn/chỗ, cách xếp, danh
 * sách học sinh chưa xếp). Phải: sơ đồ chỗ ngồi với 3 chế độ thao tác
 * (Đổi chỗ / Khoá chỗ / Ghim chỗ), hoàn tác, đảo góc nhìn 180°, in sơ đồ.
 *
 * Dữ liệu qua useClassSeating (lưu theo lớp, cùng localStorage của
 * roster). Danh sách học sinh KHÔNG nạp riêng ở tab này — dùng roster
 * dùng chung, sửa ở tab Gọi tên.
 *
 * Xếp ngẫu nhiên: tính kết quả thật TRƯỚC bằng assignSeatsRandomly, nếu
 * cấu hình có hiệu ứng hoán đổi (swapSeconds > 0) thì trong thời gian đó
 * các ô trống khả dụng nhấp nháy tên ngẫu nhiên rồi mới chốt kết quả;
 * "Xem kết quả ngay" chốt ngay lập tức.
 */

const BW_COLOR = { bg: "#F8FAFC", border: "#94A3B8", deep: "#1E293B" };
const LOCKED_STRIPES =
  "repeating-linear-gradient(45deg, rgba(100,116,139,0.16) 0 6px, rgba(100,116,139,0.05) 6px 12px)";

const MODE_HINTS = {
  swap: "Bấm chọn một ô, rồi bấm ô thứ hai để đổi chỗ hai học sinh (ô trống cũng đổi được). Đổi chỗ sẽ huỷ ghim của hai bạn liên quan (nếu có).",
  lock: "Bấm vào ô để khoá / mở khoá. Ô khoá không ai được ngồi; khoá ô đang có người sẽ đưa bạn đó về danh sách chưa xếp.",
  pin: "Bấm vào ô đang có học sinh để ghim / bỏ ghim bạn đó tại chỗ đó. Hoặc chọn một học sinh chưa xếp ở cột trái, rồi bấm vào ô trống để xếp và ghim luôn.",
};

const range = (n) => Array.from({ length: n }, (_, i) => i);
const numOptions = (from, to, suffix) =>
  range(to - from + 1).map((i) => ({ value: String(from + i), label: `${from + i} ${suffix}` }));

export default function SeatingTab({ roster, showToast }) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);
  const seatingApi = useClassSeating(roster);
  const { config, seats, locked, pinned } = seatingApi;

  const [mode, setMode] = useState("swap");
  const [firstSeat, setFirstSeat] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [preview, setPreview] = useState(null); // { seatId: studentId } khi đang chạy hiệu ứng
  const [printJob, setPrintJob] = useState(null);

  const animRef = useRef({ interval: null, timeout: null, pending: null });

  const classId = activeClass?.id;
  const gridSignature = `${classId}|${config.cols}|${config.rows}|${config.perDesk}|${config.numberFrom}`;
  const [draft, setDraft] = useState(() => ({
    cols: config.cols, rows: config.rows, perDesk: config.perDesk, numberFrom: config.numberFrom,
  }));
  const [draftFor, setDraftFor] = useState(gridSignature);
  if (draftFor !== gridSignature) {
    // Đổi lớp hoặc cấu hình lưới vừa được áp dụng/hoàn tác → đồng bộ bản nháp.
    setDraftFor(gridSignature);
    setDraft({ cols: config.cols, rows: config.rows, perDesk: config.perDesk, numberFrom: config.numberFrom });
    setFirstSeat(null);
    setSelectedStudentId(null);
    setPrintJob(null);
  }
  const [lastClassId, setLastClassId] = useState(classId);
  if (classId !== lastClassId) {
    setLastClassId(classId);
    setMode("swap");
    setFlipped(false);
    setPreview(null);
  }

  const clearAnimTimers = () => {
    if (animRef.current.interval) clearInterval(animRef.current.interval);
    if (animRef.current.timeout) clearTimeout(animRef.current.timeout);
    animRef.current.interval = null;
    animRef.current.timeout = null;
  };
  useEffect(() => clearAnimTimers, []);
  // Đổi lớp giữa chừng: huỷ hiệu ứng hoán đổi đang chạy của lớp cũ.
  useEffect(() => {
    clearAnimTimers();
    animRef.current.pending = null;
  }, [classId]);

  const studentById = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s])), [students]);
  const lockedSet = useMemo(() => new Set(locked), [locked]);
  const seatedIds = useMemo(() => new Set(Object.values(seats)), [seats]);
  const unseatedStudents = useMemo(() => students.filter((s) => !seatedIds.has(s.id)), [students, seatedIds]);
  const animating = preview !== null;

  const finishShuffle = () => {
    clearAnimTimers();
    if (animRef.current.pending) seatingApi.applyAssignment(animRef.current.pending);
    animRef.current.pending = null;
    setPreview(null);
    showToast?.("Đã xếp xong chỗ ngồi");
  };

  const startShuffle = () => {
    if (animating || students.length === 0) return;
    setFirstSeat(null);
    setSelectedStudentId(null);
    const result = assignSeatsRandomly({ students, config, locked, pinned });
    if (config.swapSeconds === 0) {
      seatingApi.applyAssignment(result.seats);
      showToast?.("Đã xếp xong chỗ ngồi");
      return;
    }
    animRef.current.pending = result.seats;
    const pinnedSeatSet = new Set(Object.values(pinned));
    const flashingSeats = buildSeatIds(config).filter((id) => !lockedSet.has(id) && !pinnedSeatSet.has(id));
    const tick = () => {
      const pool = shuffleWith(students);
      const map = {};
      flashingSeats.forEach((sid, i) => {
        if (pool.length) map[sid] = pool[i % pool.length].id;
      });
      for (const [studentId, sid] of Object.entries(pinned)) map[sid] = studentId;
      setPreview(map);
    };
    tick();
    animRef.current.interval = setInterval(tick, 120);
    animRef.current.timeout = setTimeout(finishShuffle, config.swapSeconds * 1000);
  };

  const changeMode = (next) => {
    setMode(next);
    setFirstSeat(null);
    setSelectedStudentId(null);
  };

  const handleSeatClick = (sid) => {
    if (animating) return;
    if (mode === "lock") {
      seatingApi.toggleLock(sid);
      return;
    }
    if (mode === "pin") {
      if (selectedStudentId) {
        if (!seats[sid] && !lockedSet.has(sid)) {
          seatingApi.placeStudent(selectedStudentId, sid);
          setSelectedStudentId(null);
        } else {
          showToast?.("Hãy bấm vào một ô trống (chưa khoá) để xếp chỗ cho học sinh đã chọn");
        }
        return;
      }
      if (seats[sid]) seatingApi.togglePinAtSeat(sid);
      return;
    }
    // Chế độ đổi chỗ
    if (lockedSet.has(sid)) {
      showToast?.("Ô này đang khoá — mở khoá ở chế độ “Khoá chỗ” trước khi đổi chỗ");
      return;
    }
    if (!firstSeat) {
      setFirstSeat(sid);
    } else if (firstSeat === sid) {
      setFirstSeat(null);
    } else {
      seatingApi.swapSeats(firstSeat, sid);
      setFirstSeat(null);
    }
  };

  const handleApplyGrid = () => {
    seatingApi.applyGridConfig(draft);
    showToast?.("Đã áp dụng cấu hình — chỗ còn tồn tại được giữ nguyên");
  };

  const colorOf = (col) =>
    config.colorMode === "bw" ? BW_COLOR : config.colorMode === "mono" ? GROUP_COLORS[0] : groupColor(col);

  const displayCols = flipped ? [...range(config.cols)].reverse() : range(config.cols);
  const displayRows = flipped ? [...range(config.rows)].reverse() : range(config.rows);
  const displaySlots = flipped ? [...range(config.perDesk)].reverse() : range(config.perDesk);

  const handlePrint = () => {
    const columns = displayCols.map((col) => {
      const color = colorOf(col);
      return {
        label: `Dãy ${col + 1}`,
        color: config.colorMode === "bw" ? null : { bg: color.bg, border: color.border },
        desks: displayRows.map((row) => ({
          deskNo: deskNumber(config, row),
          seats: displaySlots.map((slot) => {
            const sid = seatId(col, row, slot);
            const occupant = seats[sid] ? studentById[seats[sid]] : null;
            return {
              label: `Chỗ ${slot + 1}`,
              name: occupant?.name ?? null,
              locked: lockedSet.has(sid),
              pinned: occupant ? pinned[occupant.id] === sid : false,
            };
          }),
        })),
      };
    });
    setPrintJob({
      kind: "seating",
      showDate: config.showDate,
      teacher: config.teacher,
      note: config.note,
      columns,
    });
  };

  const now = new Date();
  const dateText = `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  const draftTotal = draft.cols * draft.rows * draft.perDesk;
  const selectedStudent = selectedStudentId ? studentById[selectedStudentId] : null;

  const renderSeat = (col, row, slot) => {
    const sid = seatId(col, row, slot);
    const isLocked = lockedSet.has(sid);
    const occupantId = preview ? preview[sid] : seats[sid];
    const occupant = occupantId ? studentById[occupantId] : null;
    const isPinned = occupant ? pinned[occupant.id] === sid : false;
    const isFirst = firstSeat === sid;
    return (
      <button
        key={sid}
        type="button"
        onClick={() => handleSeatClick(sid)}
        title={occupant ? occupant.name : isLocked ? "Ô đang khoá" : "Ô trống"}
        className={`relative flex-1 min-w-0 rounded-lg border px-1 py-1.5 text-center transition ${
          isFirst ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50" : "border-ink/15 bg-white/80 hover:border-ink/40"
        } ${animating ? "cursor-wait" : "cursor-pointer"}`}
        style={isLocked ? { backgroundImage: LOCKED_STRIPES } : undefined}
      >
        <span className="block text-[9px] font-semibold uppercase tracking-wide text-ink/40">Chỗ {slot + 1}</span>
        {isLocked ? (
          <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 py-0.5">
            <Lock className="w-3 h-3" /> Khoá
          </span>
        ) : occupant ? (
          <span className="block text-[11px] font-semibold leading-tight text-ink line-clamp-2 min-h-7">
            {shortNameOf(occupant.name)}
          </span>
        ) : (
          <span className="block text-[11px] text-ink/30 py-0.5">Trống</span>
        )}
        {isPinned && !isLocked && (
          <Pin className="absolute top-0.5 right-0.5 w-3 h-3 text-rose-500 fill-rose-200" />
        )}
      </button>
    );
  };

  const boardBar = (
    <div className="rounded-xl bg-emerald-800 text-emerald-50 text-center text-xs font-display font-bold tracking-[0.2em] py-2">
      BẢNG — PHÍA TRƯỚC LỚP
    </div>
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_1fr] items-start">
      {/* ── Cột cấu hình ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-ink">Thông tin lớp</h3>
          <ClassPicker roster={roster} />
          <Input
            label="GVCN / Giáo viên"
            placeholder="Ví dụ: Cô Trần Thị B…"
            value={config.teacher}
            onChange={(v) => seatingApi.updateConfig({ teacher: v })}
            maxLength={60}
          />
          <Input
            label="Ghi chú"
            placeholder="Ví dụ: Năm học 2026–2027, học kỳ I…"
            value={config.note}
            onChange={(v) => seatingApi.updateConfig({ note: v })}
            maxLength={120}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-ink/60">{dateText}</span>
            <Checkbox
              checked={config.showDate}
              onChange={(v) => seatingApi.updateConfig({ showDate: v })}
              label="Hiện ngày trên sơ đồ"
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-ink">Cấu hình lớp học</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block text-xs font-semibold text-ink/55 mb-1">Số dãy</span>
              <Select value={String(draft.cols)} onChange={(v) => setDraft((d) => ({ ...d, cols: Number(v) }))}
                options={numOptions(1, 6, "dãy")} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-ink/55 mb-1">Bàn / dãy</span>
              <Select value={String(draft.rows)} onChange={(v) => setDraft((d) => ({ ...d, rows: Number(v) }))}
                options={numOptions(1, 8, "bàn")} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-ink/55 mb-1">Chỗ / bàn</span>
              <Select value={String(draft.perDesk)} onChange={(v) => setDraft((d) => ({ ...d, perDesk: Number(v) }))}
                options={numOptions(1, 4, "chỗ")} />
            </div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-ink/55 mb-1">Đánh số bàn từ</span>
            <Select
              value={draft.numberFrom}
              onChange={(v) => setDraft((d) => ({ ...d, numberFrom: v }))}
              options={[
                { value: "back", label: "Cuối lớp ↑ — bàn cuối là Bàn 1" },
                { value: "front", label: "Đầu lớp ↓ — bàn đầu là Bàn 1" },
              ]}
            />
          </div>
          <p className="text-sm text-ink/60">
            Tổng chỗ ngồi khả dụng: <b className="text-ink">{draftTotal}</b>
          </p>
          <button type="button" onClick={handleApplyGrid}
            className="font-display font-semibold rounded-2xl px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition">
            Áp dụng cấu hình
          </button>
          <p className="text-xs text-ink/45">
            Khi áp dụng, học sinh ở chỗ còn tồn tại được giữ nguyên; chỗ biến mất thì bạn đó về danh sách chưa xếp.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-ink">Cách xếp chỗ</h3>
          <div>
            <span className="block text-xs font-semibold text-ink/55 mb-1">Thời gian hiệu ứng hoán đổi</span>
            <Select
              value={String(config.swapSeconds)}
              onChange={(v) => seatingApi.updateConfig({ swapSeconds: Number(v) })}
              options={SWAP_SECONDS_OPTIONS.map((s) => ({
                value: String(s),
                label: s === 0 ? "Ngay lập tức" : `${s} giây`,
              }))}
            />
          </div>
          <div>
            <span className="block text-xs font-semibold text-ink/55 mb-1">Mẫu màu sơ đồ</span>
            <Select
              value={config.colorMode}
              onChange={(v) => seatingApi.updateConfig({ colorMode: v })}
              options={[
                { value: "multi", label: "Đa màu — mỗi dãy một màu" },
                { value: "mono", label: "Đơn sắc" },
                { value: "bw", label: "Đen trắng" },
              ]}
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
          <h3 className="font-display font-bold text-ink">Danh sách học sinh</h3>
          <p className="text-sm text-ink/60">
            <b className="text-ink">{students.length}</b> học sinh •{" "}
            <b className="text-ink">{seatedIds.size}</b> đã xếp •{" "}
            <b className="text-ink">{unseatedStudents.length}</b> chưa xếp
          </p>
          {mode === "pin" && (
            <p className="text-xs text-ink/50">
              {selectedStudent
                ? <>Đang chọn <b className="text-ink">{selectedStudent.name}</b> — bấm vào một ô trống để xếp &amp; ghim bạn đó.</>
                : "Bấm vào tên một bạn chưa xếp để chọn, rồi bấm vào ô trống đích."}
            </p>
          )}
          {unseatedStudents.length === 0 ? (
            <p className="text-sm text-ink/45">
              {students.length === 0
                ? "Lớp chưa có học sinh nào. Nạp danh sách ở tab “Gọi tên”."
                : "Tất cả học sinh đã có chỗ ngồi."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {unseatedStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (mode !== "pin") changeMode("pin");
                    setSelectedStudentId((prev) => (prev === s.id ? null : s.id));
                  }}
                  className={`text-xs font-semibold rounded-full border px-2.5 py-1.5 transition ${
                    selectedStudentId === s.id
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-paper2/70 text-ink/70 border-ink/15 hover:border-ink/40"
                  }`}
                >
                  <StudentName student={s} />
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-ink/45">Thêm / sửa danh sách học sinh ở tab “Gọi tên” — mọi thay đổi tự áp dụng sang sơ đồ này.</p>
        </section>
      </div>

      {/* ── Sơ đồ ────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-4 min-w-0">
        <div className="flex items-start gap-3 flex-wrap">
          <div>
            <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
              <Armchair className="w-5 h-5 text-emerald-600" />
              Sơ đồ chỗ ngồi{activeClass?.name ? ` — ${activeClass.name}` : ""}
            </h2>
            <p className="text-sm text-ink/55 mt-0.5">
              {config.showDate && <>{dateText} • </>}
              {students.length} học sinh • {config.cols} dãy × {config.rows} bàn • {totalSeats(config)} chỗ
              {config.teacher && <> • GV: {config.teacher}</>}
            </p>
            {config.note && <p className="text-xs text-ink/45 mt-0.5">{config.note}</p>}
          </div>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <button type="button" onClick={seatingApi.undo} disabled={!seatingApi.canUndo || animating}
              className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-white text-ink border border-ink/20 hover:bg-ink/5 active:scale-[0.98] transition disabled:opacity-40">
              <Undo2 className="w-3.5 h-3.5" /> Hoàn tác
            </button>
            <button type="button" onClick={() => setFlipped((f) => !f)}
              className={`inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 border active:scale-[0.98] transition ${
                flipped ? "bg-ink text-paper border-ink" : "bg-white text-ink border-ink/20 hover:bg-ink/5"
              }`}>
              <FlipHorizontal2 className="w-3.5 h-3.5" /> Đảo góc nhìn
            </button>
            <button type="button" onClick={handlePrint} disabled={animating}
              className="inline-flex items-center gap-1 text-xs font-display font-semibold rounded-xl px-3 py-2 bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] transition disabled:opacity-40">
              <Printer className="w-3.5 h-3.5" /> Xuất / In
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-ink/5 p-1">
            {[
              { key: "swap", label: "Đổi chỗ", icon: ArrowLeftRight },
              { key: "lock", label: "Khoá chỗ", icon: Lock },
              { key: "pin", label: "Ghim chỗ", icon: Pin },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => changeMode(key)}
                className={`inline-flex items-center gap-1.5 text-sm font-display font-semibold rounded-lg px-3.5 py-2 transition ${
                  mode === key ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
          {animating ? (
            <button type="button" onClick={finishShuffle}
              className="inline-flex items-center gap-1.5 ml-auto font-display font-semibold rounded-xl px-4 py-2.5 bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] transition">
              <FastForward className="w-4 h-4" /> Xem kết quả ngay
            </button>
          ) : (
            <button type="button" onClick={startShuffle} disabled={students.length === 0}
              className="inline-flex items-center gap-1.5 ml-auto font-display font-semibold rounded-xl px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-40">
              <Shuffle className="w-4 h-4" /> Bắt đầu xếp ngẫu nhiên
            </button>
          )}
        </div>

        <p className="text-xs text-ink/50 -mt-1">
          {animating ? "Đang hoán đổi chỗ ngồi… bấm “Xem kết quả ngay” để chốt kết quả." : MODE_HINTS[mode]}
          {mode === "swap" && firstSeat && " Đã chọn ô đầu tiên — bấm ô thứ hai để đổi."}
        </p>

        {!flipped && boardBar}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {displayCols.map((col) => {
            const color = colorOf(col);
            return (
              <div key={col} className="flex-1 min-w-40 flex flex-col gap-2">
                <p className="text-center font-display font-extrabold text-sm tracking-wide" style={{ color: color.deep }}>
                  DÃY {col + 1}
                </p>
                {displayRows.map((row) => (
                  <div
                    key={row}
                    className="rounded-2xl border-2 p-2"
                    style={{ borderColor: color.border, background: color.bg }}
                  >
                    <p className="text-[11px] font-bold mb-1.5" style={{ color: color.deep }}>
                      Bàn {deskNumber(config, row)}
                      <span className="font-medium opacity-60"> • {config.perDesk} chỗ</span>
                    </p>
                    <div className="flex gap-1.5">
                      {displaySlots.map((slot) => renderSeat(col, row, slot))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {flipped && boardBar}

        <p className="text-xs text-ink/45">
          Ô có dấu <Pin className="inline w-3 h-3 text-rose-500" /> là chỗ đã ghim — xếp ngẫu nhiên luôn giữ bạn đó ở đúng chỗ.
          Ô sọc xám là chỗ đang khoá. {flipped && "Đang xem từ góc đối diện (đã đảo 180°) — dữ liệu chỗ ngồi không đổi."}
        </p>
      </section>

      <PrintSheet job={printJob} className={activeClass?.name} onDone={() => setPrintJob(null)} />
    </div>
  );
}
