// pages/teacher/KnowledgeHeatmapPage.jsx
//
// Bản đồ nhiệt điểm mù (Knowledge Heatmap) — giáo viên nhìn nhanh lỗ hổng
// kiến thức của lớp: ma trận học sinh × chủ đề tô màu theo mức thành thạo,
// thẻ cảnh báo tổng hợp ở đầu trang, thống kê sai theo từng câu hỏi.
//
// Mọi số liệu do server tổng hợp từ dữ liệu làm bài THẬT (bài nộp + ván
// game đã được server chấm) qua GET /api/heatmap/class/:classId — trang
// này không tự tính, không có số mẫu. Ô/câu chưa có dữ liệu thời gian thì
// hiện "—" kèm chú thích, không suy diễn.
//
// Điểm nối Đợt 2 (Gói can thiệp 1 chạm): giáo viên tick chọn học sinh
// (theo hàng hoặc chọn nhanh cả nhóm đỏ/vàng của một chủ đề) — danh sách
// chọn giữ ở state `selectedIds` để đợt sau gắn thao tác tạo gói ôn tập.
// Đợt này CHƯA có nút tạo gói (không đặt nút chết).

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Flame, Info } from "lucide-react";
import { Loader } from "../../components/ui";
import { classService, heatmapService } from "../../services/api.js";

const LEVEL_META = {
  green: { label: "Thành thạo", cell: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200", dot: "bg-emerald-500" },
  yellow: { label: "Cần lưu ý", cell: "bg-amber-100 text-amber-900 hover:bg-amber-200", dot: "bg-amber-500" },
  red: { label: "Điểm mù", cell: "bg-rose-100 text-rose-900 hover:bg-rose-200", dot: "bg-rose-500" },
  insufficient: { label: "Chưa đủ dữ liệu", cell: "bg-slate-100 text-slate-500 hover:bg-slate-200", dot: "bg-slate-400" },
  none: { label: "Chưa làm", cell: "text-slate-300", dot: "bg-slate-300" },
};

const fmtSec = (v) => (v == null ? "—" : `${v} giây`);

export default function KnowledgeHeatmapPage({ showToast }) {
  const [classes, setClasses] = useState(null);
  const [classId, setClassId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [errorClassId, setErrorClassId] = useState("");
  const [detail, setDetail] = useState(null); // { student, topic, cell }
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  // Đang tải = đã chọn lớp nhưng dữ liệu trả về chưa phải của lớp đó và
  // lớp đó chưa báo lỗi (trạng thái suy ra, không setState đồng bộ trong effect).
  const loading = !!classId && errorClassId !== classId && data?.class?.id !== classId;

  // Danh sách lớp của giáo viên (server tự lọc theo vai trò/phạm vi).
  useEffect(() => {
    let cancelled = false;
    classService
      .list()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setClasses(arr);
        if (arr.length) setClassId((prev) => prev || arr[0].id);
      })
      .catch(() => { if (!cancelled) setClasses([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!classId) return;
    let cancelled = false;
    heatmapService
      .getClassHeatmap(classId)
      .then((d) => { if (!cancelled) { setData(d); setError(""); setErrorClassId(""); } })
      .catch((e) => {
        if (cancelled) return;
        setData(null);
        setError(e?.message || "Không tải được bản đồ nhiệt.");
        setErrorClassId(classId);
        showToast?.(e?.message || "Không tải được bản đồ nhiệt", "error");
      });
    return () => { cancelled = true; };
  }, [classId, showToast]);

  const changeClass = (nextId) => {
    setClassId(nextId);
    setDetail(null);
    setSelectedIds(new Set());
    setError("");
    setErrorClassId("");
  };

  const cellMap = useMemo(() => {
    const m = new Map();
    for (const c of data?.cells || []) m.set(`${c.studentId}|${c.topicKey}`, c);
    return m;
  }, [data]);

  const cellOf = (studentId, topicKey) =>
    cellMap.get(`${studentId}|${topicKey}`) || { studentId, topicKey, answered: 0, correct: 0, accuracy: 0, sessions: 0, avgResponseSec: null, level: "none" };

  const toggleStudent = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  // Chọn nhanh mọi học sinh đang ở một mức (đỏ/vàng) của một chủ đề —
  // cấu trúc chọn nhóm sẵn cho Đợt 2.
  const selectByTopicLevel = (topicKey, levels) => {
    const ids = (data?.cells || [])
      .filter((c) => c.topicKey === topicKey && levels.includes(c.level))
      .map((c) => c.studentId);
    setSelectedIds((prev) => new Set([...prev, ...ids]));
    showToast?.(`Đã chọn ${ids.length} học sinh`, "success");
  };

  const topicQuestions = useMemo(() => {
    if (!detail) return [];
    return (data?.questionStats || []).filter((q) => q.topicKey === detail.topic.key);
  }, [data, detail]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="font-display font-bold text-2xl text-ink flex items-center gap-2.5">
          <span className="w-10 h-10 grid place-items-center rounded-2xl bg-rose-600 text-white">
            <Flame className="w-5 h-5" />
          </span>
          Bản đồ nhiệt điểm mù
        </h1>
        <label className="ml-auto flex items-center gap-2 text-sm text-ink-soft">
          Lớp:
          <select
            className="rounded-xl border border-line bg-panel px-3 py-2 text-ink"
            value={classId}
            onChange={(e) => changeClass(e.target.value)}
            disabled={!classes?.length}
          >
            {(classes || []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
      </header>

      {classes !== null && classes.length === 0 && (
        <p className="rounded-2xl border border-line bg-panel p-4 text-ink-soft">
          Bạn chưa được phân phụ trách lớp nào nên chưa có dữ liệu để hiển thị.
        </p>
      )}

      {loading && <Loader />}

      {!loading && error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</p>
      )}

      {!loading && !error && data && !data.hasData && (
        <p className="rounded-2xl border border-line bg-panel p-4 text-ink-soft">
          Chưa có dữ liệu — học sinh cần làm bài tập được giao hoặc chơi game trước thì bản đồ nhiệt mới có số liệu.
        </p>
      )}

      {!loading && !error && data && data.hasData && (
        <>
          {/* ── Thẻ cảnh báo tổng hợp ─────────────────────────────── */}
          {data.alerts.length > 0 && (
            <section className="flex flex-col gap-2" aria-label="Cảnh báo điểm mù">
              {data.alerts.map((a) => (
                <div
                  key={a.topicKey}
                  className={`flex items-start gap-2.5 rounded-2xl border p-3.5 ${
                    a.type === "red"
                      ? "border-rose-200 bg-rose-50 text-rose-900"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="font-medium">{a.text}</p>
                </div>
              ))}
            </section>
          )}

          {/* ── Chú giải mức màu ──────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
            {["green", "yellow", "red", "insufficient", "none"].map((lv) => (
              <span key={lv} className="inline-flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded ${LEVEL_META[lv].dot}`} />
                {LEVEL_META[lv].label}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Số trong ô = tỷ lệ trả lời đúng. Ô có dưới 3 câu đã làm được tính là chưa đủ dữ liệu.
            </span>
          </div>

          {/* ── Thanh chọn học sinh (điểm nối Đợt 2) ─────────────── */}
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-panel px-4 py-2.5 text-sm">
              <span className="font-medium text-ink">Đã chọn {selectedIds.size} học sinh:</span>
              <span className="text-ink-soft">
                {data.students.filter((s) => selectedIds.has(s.id)).map((s) => s.name).join(", ")}
              </span>
              <button type="button" className="ml-auto text-rose-600 hover:underline" onClick={() => setSelectedIds(new Set())}>
                Bỏ chọn tất cả
              </button>
            </div>
          )}

          {/* ── Ma trận nhiệt ─────────────────────────────────────── */}
          <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-panel px-3 py-2.5 text-left font-semibold text-ink border-b border-line min-w-44">
                    Học sinh
                  </th>
                  {data.topics.map((t) => (
                    <th key={t.key} className="px-2 py-2.5 text-center font-semibold text-ink border-b border-line min-w-24">
                      {t.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.id} className="border-b border-line/60 last:border-0">
                    <th className="sticky left-0 z-10 bg-panel px-3 py-2 text-left font-medium text-ink">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-rose-600"
                          checked={selectedIds.has(s.id)}
                          onChange={() => toggleStudent(s.id)}
                          aria-label={`Chọn ${s.name}`}
                        />
                        {s.name}
                      </label>
                    </th>
                    {data.topics.map((t) => {
                      const cell = cellOf(s.id, t.key);
                      const meta = LEVEL_META[cell.level];
                      return (
                        <td key={t.key} className="p-1">
                          <button
                            type="button"
                            className={`w-full rounded-lg px-2 py-2 text-center font-semibold transition ${meta.cell}`}
                            onClick={() => setDetail({ student: s, topic: t, cell })}
                            title={`${s.name} — ${t.label}: ${meta.label}`}
                          >
                            {cell.level === "none" ? "—" : `${cell.accuracy}%`}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-ink-soft">
            Thời gian phản hồi trung bình chỉ tính từ các lượt làm có ghi thời gian từng câu (bài nộp và các ván
            game gần đây); ô hiện "—" nghĩa là chưa có dữ liệu thời gian cho ô đó.
          </p>

          {/* ── Chi tiết ô / chủ đề ───────────────────────────────── */}
          {detail && (
            <section className="rounded-2xl border border-line bg-panel p-4 flex flex-col gap-3" aria-label="Chi tiết ô">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display font-bold text-lg text-ink">
                  {detail.student.name} — {detail.topic.label}
                </h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_META[detail.cell.level].cell}`}>
                  {LEVEL_META[detail.cell.level].label}
                </span>
                <button type="button" className="ml-auto text-sm text-ink-soft hover:underline" onClick={() => setDetail(null)}>
                  Đóng
                </button>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><dt className="text-ink-soft">Số câu đã làm</dt><dd className="font-semibold text-ink">{detail.cell.answered}</dd></div>
                <div><dt className="text-ink-soft">Trả lời đúng</dt><dd className="font-semibold text-ink">{detail.cell.correct} ({detail.cell.accuracy}%)</dd></div>
                <div><dt className="text-ink-soft">Số lượt làm</dt><dd className="font-semibold text-ink">{detail.cell.sessions}</dd></div>
                <div><dt className="text-ink-soft">Thời gian TB / câu</dt><dd className="font-semibold text-ink">{fmtSec(detail.cell.avgResponseSec)}</dd></div>
              </dl>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-100"
                  onClick={() => selectByTopicLevel(detail.topic.key, ["red"])}
                >
                  Chọn học sinh vùng đỏ của chủ đề này
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
                  onClick={() => selectByTopicLevel(detail.topic.key, ["yellow"])}
                >
                  Chọn học sinh vùng vàng của chủ đề này
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-ink mb-2">Câu hỏi thuộc chủ đề này (cả lớp)</h3>
                {topicQuestions.length === 0 ? (
                  <p className="text-sm text-ink-soft">
                    Chưa có thống kê theo từng câu cho chủ đề này — thống kê từng câu có từ bài tập được giao
                    và các ván game gần đây; các ván game cũ chỉ lưu số tổng hợp theo ván.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-ink-soft">
                          <th className="py-1.5 pr-3 font-medium">Câu hỏi</th>
                          <th className="py-1.5 pr-3 font-medium">Số lượt trả lời</th>
                          <th className="py-1.5 pr-3 font-medium">Tỷ lệ làm sai</th>
                          <th className="py-1.5 font-medium">Thời gian TB</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topicQuestions.map((q) => (
                          <tr key={q.questionId} className="border-t border-line/60">
                            <td className="py-1.5 pr-3 text-ink">{q.content || "(không còn nội dung câu hỏi)"}</td>
                            <td className="py-1.5 pr-3 text-ink">{q.attempts}</td>
                            <td className="py-1.5 pr-3 text-ink">{q.wrongRate}% ({q.wrongCount} câu sai)</td>
                            <td className="py-1.5 text-ink">{fmtSec(q.avgTimeSec)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
