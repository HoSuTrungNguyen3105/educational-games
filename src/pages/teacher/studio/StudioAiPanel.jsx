import { useEffect, useRef, useState } from "react";
import { Sparkles, TriangleAlert, X } from "lucide-react";
import { DIFFICULTIES, generateQuestions } from "../../../services/aiApi.js";
import { markAiFailed, markAiReady, useAiAvailability } from "../../../hooks/useAiAvailability.js";
import { AiNotReadyNotice } from "../../../components/ai/AiNotReadyNotice.jsx";
import { aiErrorText } from "../../../components/ai/aiErrorText.js";

// StudioAiPanel — tab AI trong editor AI Studio (đợt nâng cấp, mục (a)
// của phân tích khoảng thiếu; đặc tả §6/§8). Gắn vào endpoint AI THẬT
// POST /api/ai/quizzes/generate qua services/aiApi dùng chung — cùng
// đường với AiQuestionPanel ở khu vực game, không dựng client riêng.
//
// Trung thực về trạng thái (quyết định Nguyên đã duyệt từ giai đoạn 0):
// AI phía server đang bị chặn bởi cờ system_config.ai.enabled + hạ tầng
// AI Service; khi chưa sẵn sàng, panel hiện đúng thông báo dùng chung
// AiNotReadyNotice và KHÔNG sinh câu hỏi giả. Khi hạ tầng bật, luồng đầy
// đủ đã sẵn: sinh → giáo viên duyệt từng câu → chèn vào BẢN NHÁP (mỗi
// câu một trang mới, hoặc dồn vào trang hiện tại) → sửa tiếp trong
// editor như câu hỏi soạn tay. Không bao giờ tự xuất bản.
//
// Sinh TOÀN BỘ cấu trúc bài học (§6 đầy đủ) chưa làm: server hiện chỉ có
// endpoint sinh câu hỏi, chưa có endpoint sinh trang/phần tử của bài.

/** Map một câu hỏi AI (shape aiApi) sang props phần tử question của bài học. */
function toLessonProps(q) {
  return {
    prompt: q.content,
    qtype: "single",
    options: (q.options || []).map((o) => ({ id: o.id, content: o.content })),
    correctAnswer: q.correctAnswer || "",
    ...(q.explanation ? { explanation: q.explanation } : {}),
    points: 10, // thang điểm của bài học (mặc định 10) — khác thang 100 của game
  };
}

export default function StudioAiPanel({ ed, showToast }) {
  const ai = useAiAvailability();
  const [subject, setSubject] = useState(() => ed.doc.subject || "");
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState(() => ed.doc.grade ?? 3);
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { questions, skipped, needsManualAnswer }
  const [picked, setPicked] = useState({});
  const [job, setJob] = useState(null); // { queue, fromPageId, inserted, skipped }
  const abortRef = useRef(null);
  const edRef = useRef(ed);
  useEffect(() => { edRef.current = ed; });

  const total = result?.questions?.length || 0;
  const chosen = (result?.questions || []).filter((q) => picked[q.id]);

  async function run() {
    if (ai.showNotice || busy) return;
    setError("");
    setBusy(true);
    setResult(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await generateQuestions({
        subject: subject || ed.doc.subject,
        grade,
        topic,
        difficulty,
        count,
        signal: ctrl.signal,
      });
      setResult(res);
      markAiReady();
      const init = {};
      for (const q of res.questions) init[q.id] = !!q.correctAnswer;
      setPicked(init);
      if (!res.questions.length) {
        setError("AI không sinh được câu hỏi nào đúng cấu trúc. Thử đổi chủ đề hoặc độ khó.");
      }
    } catch (e) {
      markAiFailed(e);
      // 503 "đang được cấu hình" đã có thẻ AiNotReadyNotice nói thay —
      // không lặp lại cùng một câu trong hộp lỗi đỏ bên dưới.
      const configuring = e?.status === 503 && /đang được cấu hình/i.test(e?.message || "");
      if (!ctrl.signal.aborted && !configuring) setError(aiErrorText(e));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function finishInsert(inserted, skipped) {
    setJob(null);
    setResult(null);
    setPicked({});
    if (inserted > 0) {
      showToast?.(
        `Đã chèn ${inserted} câu hỏi AI vào bản nháp${skipped ? ` (${skipped} câu không chèn được)` : ""} — nhớ kiểm tra lại trước khi xuất bản`,
        "success",
      );
    } else {
      setError("Không chèn được câu nào (trang đã đầy hoặc bài đã đủ 50 trang).");
    }
  }

  /** Chèn các câu đã chọn vào trang hiện tại (chồng lệch nhẹ để dễ kéo tách). */
  function insertIntoCurrentPage() {
    let inserted = 0;
    let skipped = 0;
    chosen.forEach((q, i) => {
      const id = ed.addElement("question", toLessonProps(q));
      if (!id) { skipped++; return; }
      const off = (i % 3) * 28;
      if (off) ed.patchElement(id, { x: 190 + off, y: 130 + off });
      inserted++;
    });
    finishInsert(inserted, skipped);
  }

  /** Chèn mỗi câu vào một trang mới: khởi động job, effect dưới đây lái tiếp. */
  function insertAsNewPages() {
    if (!chosen.length || job) return;
    const fromPageId = ed.currentPage?.id || null;
    ed.addPage();
    setJob({ queue: chosen, fromPageId, inserted: 0, skipped: 0 });
  }

  // Lái job chèn-trang-mới: mỗi khi trang hiện tại đổi sang trang mới vừa
  // tạo (addPage chọn trang mới), chèn đúng 1 câu rồi tạo trang kế tiếp.
  const currentPageId = ed.currentPage?.id || null;
  useEffect(() => {
    if (!job) return undefined;
    if (currentPageId !== job.fromPageId) {
      const [q, ...rest] = job.queue;
      const id = edRef.current.addElement("question", toLessonProps(q));
      const inserted = job.inserted + (id ? 1 : 0);
      const skipped = job.skipped + (id ? 0 : 1);
      if (rest.length === 0) {
        finishInsert(inserted, skipped);
      } else {
        edRef.current.addPage();
        setJob({ queue: rest, fromPageId: currentPageId, inserted, skipped });
      }
      return undefined;
    }
    // Trang không đổi sau một lúc → addPage bị chặn (đủ 50 trang).
    const t = setTimeout(() => {
      setError("Không tạo thêm được trang mới (tối đa 50 trang/bài). Hãy chèn vào trang hiện tại.");
      setJob(null);
    }, 1500);
    return () => clearTimeout(t);
    // finishInsert/showToast là hàm cục bộ ổn định theo render hiện tại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job, currentPageId]);

  return (
    <div>
      <p className="text-[12.5px] leading-relaxed text-[#8A7C63]">
        Sinh câu hỏi trắc nghiệm bằng AI rồi chèn vào bài học. Bạn luôn duyệt từng câu trước khi chèn — AI không tự sửa hay xuất bản bài.
      </p>

      <span className="studio-field-label">Môn học</span>
      <input className="studio-field" value={subject}
        onChange={(e) => setSubject(e.target.value)} placeholder={ed.doc.subject || "VD: Toán"} />
      <span className="studio-field-label">Chủ đề</span>
      <input className="studio-field" value={topic}
        onChange={(e) => setTopic(e.target.value)} placeholder="VD: Bảng nhân 4" />
      <div className="grid grid-cols-3 gap-2">
        <label className="block min-w-0">
          <span className="studio-field-label" style={{ margin: "0 0 3px" }}>Lớp</span>
          <select className="studio-field" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="studio-field-label" style={{ margin: "0 0 3px" }}>Độ khó</span>
          <select className="studio-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="studio-field-label" style={{ margin: "0 0 3px" }}>Số câu</span>
          <input type="number" min={1} max={20} className="studio-field" value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
        </label>
      </div>

      {ai.showNotice && (
        <div className="mt-3">
          <AiNotReadyNotice state={ai.state} notice={ai.notice} hint={ai.hint} onRetry={ai.refresh} />
        </div>
      )}

      <div className="mt-3">
        {busy ? (
          <button type="button" onClick={() => abortRef.current?.abort()}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[10px] border border-[#E7D9BE] bg-white text-[13px] font-semibold text-ink">
            <X className="w-4 h-4" /> Huỷ đang sinh…
          </button>
        ) : (
          <button type="button" onClick={run} disabled={ai.showNotice || !!job}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[10px] text-[13px] font-semibold text-white disabled:opacity-40"
            style={{ background: "#8B5CF6" }}>
            <Sparkles className="w-4 h-4" /> Sinh câu hỏi
          </button>
        )}
      </div>
      {busy && <p className="mt-2 text-[12px] text-[#8A7C63]">Đang chờ AI (có thể mất 10–60 giây tuỳ model).</p>}
      {job && (
        <p className="mt-2 text-[12px] font-medium text-[#5B4A12]">
          Đang chèn câu hỏi vào trang mới… ({job.inserted + job.skipped}/{job.inserted + job.skipped + job.queue.length})
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-[10px] bg-[#FDECEC] border border-[#F2C1C1] px-3 py-2">
          <p className="text-[12.5px] text-[#7A1F1F] leading-relaxed">{error}</p>
        </div>
      )}

      {result && total > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12.5px] font-semibold text-ink">
              AI sinh {total} câu
              {result.skipped > 0 && <span className="text-[#D64545]"> · {result.skipped} câu lỗi đã bỏ</span>}
            </p>
            <button type="button" className="text-[12px] font-semibold text-[#2F6FED] hover:underline"
              onClick={() => {
                if (chosen.length === total) setPicked({});
                else { const all = {}; for (const q of result.questions) all[q.id] = true; setPicked(all); }
              }}>
              {chosen.length === total ? "Bỏ chọn hết" : "Chọn tất cả"}
            </button>
          </div>

          {result.needsManualAnswer > 0 && (
            <p className="mt-2 flex items-start gap-1.5 text-[12px] text-[#B45309] bg-[#FFF7E6] border border-[#F2D8A0] rounded-[10px] px-2.5 py-2 leading-relaxed">
              <TriangleAlert className="mt-0.5 w-3.5 h-3.5 shrink-0" />
              <span>{result.needsManualAnswer} câu AI không nêu rõ đáp án đúng — nếu chèn, bạn phải chọn đáp án đúng trong panel thuộc tính trước khi xuất bản.</span>
            </p>
          )}

          <div className="mt-2 space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
            {result.questions.map((q) => (
              <label key={q.id}
                className="flex gap-2 rounded-[10px] border px-2.5 py-2.5 cursor-pointer transition"
                style={{
                  borderColor: picked[q.id] ? "#8B5CF6" : "#E7D9BE",
                  background: picked[q.id] ? "#F6F2FF" : "#fff",
                }}>
                <input type="checkbox" className="mt-0.5 w-4 h-4 shrink-0 accent-[#8B5CF6]"
                  checked={!!picked[q.id]}
                  onChange={(e) => setPicked((s) => ({ ...s, [q.id]: e.target.checked }))} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-ink leading-snug">{q.content}</span>
                  <span className="mt-1.5 flex flex-wrap gap-1">
                    {q.options.map((o) => (
                      <span key={o.id} className="text-[11px] px-1.5 py-0.5 rounded"
                        style={o.id === q.correctAnswer
                          ? { background: "#DBF1EE", color: "#0C5B52", fontWeight: 600 }
                          : { background: "#F1EAD8", color: "#5B4A12" }}>
                        {o.content}
                      </span>
                    ))}
                  </span>
                  {!q.correctAnswer && (
                    <span className="mt-1 block text-[11.5px] font-semibold text-[#B45309]">Chưa có đáp án đúng</span>
                  )}
                  {q.explanation && (
                    <span className="mt-1 block text-[11.5px] text-[#8A7C63] leading-snug">Giải thích: {q.explanation}</span>
                  )}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-2.5 space-y-1.5">
            <button type="button" onClick={insertAsNewPages} disabled={!chosen.length || !!job}
              className="w-full px-3 py-2.5 rounded-[10px] text-[13px] font-semibold text-white disabled:opacity-40"
              style={{ background: "#1B998B" }}>
              Chèn {chosen.length || ""} câu — mỗi câu một trang mới
            </button>
            <button type="button" onClick={insertIntoCurrentPage} disabled={!chosen.length || !!job}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E7D9BE] bg-white text-[13px] font-semibold text-ink disabled:opacity-40">
              Chèn vào trang hiện tại
            </button>
            <button type="button" onClick={() => { setResult(null); setPicked({}); }}
              className="w-full px-3 py-1.5 text-[12.5px] font-semibold text-[#8A7C63] hover:underline">
              Bỏ qua kết quả này
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
