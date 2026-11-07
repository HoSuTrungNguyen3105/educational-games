import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Gamepad2, RotateCcw, X } from "lucide-react";
import LessonCanvas from "./LessonCanvas.jsx";
import LessonElementView from "./LessonElementView.jsx";

// LessonPlayer — khung HỌC một bài học (trang/phần tử JSON), dùng chung:
//   • Đợt 2: chế độ "Xem trước như học sinh" trong Studio (giáo viên).
//   • Đợt 3: trang học thật phía học sinh — chỉ cần truyền lesson từ API
//     /lessons/published/:id (DTO đã lọc correctAnswer) + một
//     `checkAnswer` chấm phía server khi endpoint nộp bài sẵn sàng.
//
// Quy tắc đáp án (§14/§20 đặc tả): đáp án đúng TUYỆT ĐỐI không được đánh
// dấu trước khi học sinh trả lời. Player chỉ chấm qua callback
// `checkAnswer(el, value)` do nơi dùng cấp (xem trước: chấm tại chỗ bằng
// dữ liệu giáo viên đang soạn qua isLessonAnswerCorrect; học sinh thật:
// KHÔNG tự chấm ở client vì DTO không còn correctAnswer). Feedback +
// giải thích chỉ hiện SAU khi đã kiểm tra; trả lời sai thì được thử lại
// và đáp án đúng vẫn chưa lộ. Player không ghi kết quả thật nào.

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function QuestionPlay({ el, state, onChange, checkAnswer }) {
  const p = el.props || {};
  const { value, result } = state;
  const answered = result !== null && result !== undefined;
  const canCheck = typeof checkAnswer === "function";

  const doCheck = () => {
    if (!canCheck || value === undefined || value === null || value === "") return;
    onChange(el.id, { value, result: Boolean(checkAnswer(el, value)) });
  };
  const retry = () => onChange(el.id, { value, result: null });

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden"
      style={{ background: "#FFFFFF", border: "2px solid #E3D9C6", boxShadow: "0 4px 14px rgba(29,46,74,0.08)" }}>
      <div className="px-4 pt-3.5 pb-1 font-semibold" style={{ fontSize: 23, color: "#1D2E4A", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {p.prompt || ""}
      </div>

      <div className="px-4 py-2 flex-1 overflow-auto">
        {p.qtype === "single" ? (
          <div className="grid gap-2" style={{ gridTemplateColumns: (p.options || []).length > 2 ? "1fr 1fr" : "1fr" }}>
            {(p.options || []).map((opt, i) => {
              const chosen = value === opt.id;
              const isRightChoice = answered && result === true && chosen;
              const isWrongChoice = answered && result === false && chosen;
              return (
                <button key={opt.id} type="button"
                  onClick={() => { if (!(answered && result === true)) onChange(el.id, { value: opt.id, result: null }); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition"
                  style={{
                    border: `2px solid ${isRightChoice ? "#1B998B" : isWrongChoice ? "#D64545" : chosen ? "#2F6FED" : "#E7D9BE"}`,
                    background: isRightChoice ? "#DBF1EE" : isWrongChoice ? "#FDECEC" : chosen ? "#EAF1FE" : "#FFFBF2",
                    fontSize: 19, color: "#243B53",
                  }}>
                  <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center font-bold text-[15px]"
                    style={{
                      background: isRightChoice ? "#1B998B" : isWrongChoice ? "#D64545" : chosen ? "#2F6FED" : "#EFE6D2",
                      color: chosen || isRightChoice || isWrongChoice ? "#fff" : "#8A7C63",
                    }}>
                    {LETTERS[i] || i + 1}
                  </span>
                  <span className="min-w-0 flex-1" style={{ wordBreak: "break-word" }}>{opt.content}</span>
                  {isRightChoice && <Check className="w-5 h-5 shrink-0" style={{ color: "#1B998B" }} />}
                </button>
              );
            })}
          </div>
        ) : (
          <input
            value={value || ""}
            onChange={(e) => { if (!(answered && result === true)) onChange(el.id, { value: e.target.value, result: null }); }}
            placeholder="Nhập đáp án của em…"
            className="w-full rounded-xl px-3 py-3 outline-none"
            style={{
              border: `2px solid ${answered ? (result ? "#1B998B" : "#D64545") : "#C9BBA0"}`,
              background: answered ? (result ? "#DBF1EE" : "#FDECEC") : "#FFFBF2",
              fontSize: 19, color: "#243B53",
            }}
          />
        )}
      </div>

      <div className="px-4 pb-3.5">
        {!answered && canCheck && (
          <button type="button" onClick={doCheck}
            disabled={value === undefined || value === null || value === ""}
            className="px-4 py-2 rounded-full font-semibold text-white text-[15px] disabled:opacity-40"
            style={{ background: "#2F6FED" }}>
            Kiểm tra
          </button>
        )}
        {!answered && !canCheck && (
          <p className="text-[13px] text-[#8A7C63] italic">Câu hỏi sẽ được chấm khi nộp bài.</p>
        )}
        {answered && result === true && (
          <div className="rounded-xl px-3 py-2.5" style={{ background: "#DBF1EE", fontSize: 16, color: "#0C5B52" }}>
            <b>Đúng rồi!</b>{p.feedbackCorrect ? ` ${p.feedbackCorrect}` : ""}
            {p.explanation && <div className="mt-1" style={{ color: "#24514B" }}>{p.explanation}</div>}
          </div>
        )}
        {answered && result === false && (
          <div className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: "#FDECEC", fontSize: 16, color: "#7A1F1F" }}>
            <span className="flex-1"><b>Chưa đúng.</b>{p.feedbackWrong ? ` ${p.feedbackWrong}` : " Em thử lại nhé!"}</span>
            <button type="button" onClick={retry}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-white text-[14px]"
              style={{ background: "#D64545" }}>
              <RotateCcw className="w-3.5 h-3.5" /> Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LessonPlayer({ lesson, gameById = {}, preview = false, checkAnswer, onPlayGame, onExit }) {
  const pages = useMemo(() => (Array.isArray(lesson?.pages) ? lesson.pages : []), [lesson]);
  const [pageIdx, setPageIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const safeIdx = Math.min(pageIdx, Math.max(0, pages.length - 1));
  const page = pages[safeIdx] || null;

  const onAnswerChange = (elId, next) => setAnswers((prev) => ({ ...prev, [elId]: next }));

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") setPageIdx((i) => Math.min(pages.length - 1, i + 1));
      if (e.key === "ArrowLeft") setPageIdx((i) => Math.max(0, i - 1));
      if (e.key === "Escape") onExit?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length, onExit]);

  const renderElement = (el) => {
    if (el.type === "question") {
      return (
        <QuestionPlay
          el={el}
          state={answers[el.id] || { value: el.props?.qtype === "fill" ? "" : null, result: null }}
          onChange={onAnswerChange}
          checkAnswer={checkAnswer}
        />
      );
    }
    if (el.type === "game" && el.props?.gameId) {
      const game = gameById[el.props.gameId] || null;
      return (
        <div className="relative w-full h-full">
          <LessonElementView el={el} game={game} />
          <button type="button"
            onClick={() => {
              if (onPlayGame) onPlayGame(el.props.gameId);
              else window.open(`#/play/${el.props.gameId}`, "_blank");
            }}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-white text-[14px] shadow"
            style={{ background: "#1B998B" }}>
            <Gamepad2 className="w-4 h-4" /> Mở game
          </button>
        </div>
      );
    }
    return <LessonElementView el={el} game={gameById[el.props?.gameId] || null} />;
  };

  return (
    <div className="fixed inset-0 z-[95] flex flex-col" style={{ background: "linear-gradient(180deg,#FFF6E7,#FFFBF2)" }}>
      <header className="shrink-0 flex items-center gap-3 px-4 h-14 border-b border-[#E7D9BE] bg-white/70 backdrop-blur">
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-ink truncate">{lesson?.title || "Bài học"}</p>
        </div>
        {preview && (
          <span className="hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "#8B5CF6" }}>
            Xem trước như học sinh
          </span>
        )}
        {onExit && (
          <button type="button" onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-ink text-paper text-sm font-semibold hover:bg-ink2">
            <X className="w-4 h-4" /> {preview ? "Quay lại soạn bài" : "Đóng"}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-auto flex flex-col items-center px-3 py-4">
        <div className="w-full" style={{ maxWidth: 1024 }}>
          {page
            ? <LessonCanvas page={page} gameById={gameById} mode="play" renderElement={renderElement} />
            : <p className="text-center text-[#8A7C63] py-16">Bài học chưa có trang nào.</p>}
        </div>

        {pages.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {pages.map((p, i) => (
              <button key={p.id} type="button" onClick={() => setPageIdx(i)}
                className="px-3 py-1.5 rounded-full text-[13px] font-semibold transition"
                style={{
                  background: i === safeIdx ? "#1D2E4A" : "#EFE6D2",
                  color: i === safeIdx ? "#fff" : "#5B4A12",
                }}>
                {i + 1}. {p.title || `Trang ${i + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="shrink-0 flex items-center gap-3 px-4 h-14 border-t border-[#E7D9BE] bg-white/70 backdrop-blur">
        <button type="button" disabled={safeIdx <= 0} onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm bg-[#EFE6D2] text-ink disabled:opacity-40">
          <ArrowLeft className="w-4 h-4" /> Trang trước
        </button>
        <p className="flex-1 text-center text-sm text-[#8A7C63] font-medium">
          Trang {pages.length ? safeIdx + 1 : 0} / {pages.length}
        </p>
        <button type="button" disabled={safeIdx >= pages.length - 1} onClick={() => setPageIdx((i) => Math.min(pages.length - 1, i + 1))}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm text-white disabled:opacity-40"
          style={{ background: "#1B998B" }}>
          Trang sau <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
