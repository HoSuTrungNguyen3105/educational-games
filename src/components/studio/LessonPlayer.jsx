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
// chấm phía SERVER qua /lessons/published/:id/check vì DTO không còn
// correctAnswer). `checkAnswer` có thể trả boolean (đồng bộ, xem trước)
// hoặc Promise<boolean | { correct, points?, feedback?, explanation? }>
// (bất đồng bộ, học sinh thật — feedback/giải thích do server cấp, giải
// thích chỉ có khi đúng). Feedback + giải thích chỉ hiện SAU khi đã kiểm
// tra; trả lời sai thì được thử lại và đáp án đúng vẫn chưa lộ.
//
// Đợt 3 bổ sung (đều tuỳ chọn, xem trước không truyền nên không đổi):
//   • `initialAnswers` — seed trạng thái (khôi phục tiến độ: câu đã đúng
//     hiển thị đã hoàn thành và khoá sửa).
//   • `onAnswerChecked(el, state)` — báo mỗi lượt chấm xong (trang học
//     dùng để cập nhật điểm/tiến độ hiển thị).
//   • `onPageChange(idx, total)` — báo khi đổi trang (trang học ghi nhận
//     hoàn thành bài không có câu hỏi khi mở tới trang cuối).
//   • `playedGameIds` — Set id phần tử game đã chơi trong phiên (badge).
//   • `headerExtra` — nút/chip thêm ở header (điểm + trạng thái bài).

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

/** Kết quả chấm có thể là boolean (xem trước) hoặc object (server). */
const resultIsCorrect = (result) =>
  result === true || (result !== null && typeof result === "object" && result.correct === true);

function QuestionPlay({ el, state, onChange, checkAnswer }) {
  const p = el.props || {};
  const { value, result } = state;
  const answered = result !== null && result !== undefined;
  const isCorrect = answered && resultIsCorrect(result);
  const canCheck = typeof checkAnswer === "function";
  const [checking, setChecking] = useState(false);

  const doCheck = async () => {
    if (!canCheck || checking || value === undefined || value === null || value === "") return;
    setChecking(true);
    try {
      const r = await checkAnswer(el, value);
      const next = r !== null && typeof r === "object"
        ? { ...r, correct: Boolean(r.correct) }
        : Boolean(r);
      onChange(el.id, { value, result: next });
    } catch {
      // Lỗi mạng/server: giữ nguyên trạng thái "chưa trả lời" để học sinh
      // thử lại được (nơi dùng tự báo lỗi cho người dùng nếu cần).
    } finally {
      setChecking(false);
    }
  };
  const retry = () => onChange(el.id, { value, result: null });

  // Feedback/giải thích: ưu tiên dữ liệu server trả về qua kết quả chấm;
  // thiếu thì rơi về props (chế độ xem trước của giáo viên còn đủ props).
  const serverFeedback = result !== null && typeof result === "object" ? result.feedback : undefined;
  const feedbackText = serverFeedback !== undefined && serverFeedback !== ""
    ? serverFeedback
    : (isCorrect ? p.feedbackCorrect : p.feedbackWrong);
  const explanation = result !== null && typeof result === "object" && "explanation" in result
    ? result.explanation
    : p.explanation;

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
              const isRightChoice = answered && isCorrect && chosen;
              const isWrongChoice = answered && !isCorrect && chosen;
              return (
                <button key={opt.id} type="button"
                  onClick={() => { if (!isCorrect) onChange(el.id, { value: opt.id, result: null }); }}
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
            onChange={(e) => { if (!isCorrect) onChange(el.id, { value: e.target.value, result: null }); }}
            placeholder="Nhập đáp án của em…"
            className="w-full rounded-xl px-3 py-3 outline-none"
            style={{
              border: `2px solid ${answered ? (isCorrect ? "#1B998B" : "#D64545") : "#C9BBA0"}`,
              background: answered ? (isCorrect ? "#DBF1EE" : "#FDECEC") : "#FFFBF2",
              fontSize: 19, color: "#243B53",
            }}
          />
        )}
      </div>

      <div className="px-4 pb-3.5">
        {!answered && canCheck && (
          <button type="button" onClick={doCheck}
            disabled={checking || value === undefined || value === null || value === ""}
            className="px-4 py-2 rounded-full font-semibold text-white text-[15px] disabled:opacity-40"
            style={{ background: "#2F6FED" }}>
            {checking ? "Đang chấm…" : "Kiểm tra"}
          </button>
        )}
        {!answered && !canCheck && (
          <p className="text-[13px] text-[#8A7C63] italic">Câu hỏi sẽ được chấm khi nộp bài.</p>
        )}
        {answered && isCorrect && (
          <div className="rounded-xl px-3 py-2.5" style={{ background: "#DBF1EE", fontSize: 16, color: "#0C5B52" }}>
            <b>Đúng rồi!</b>{feedbackText ? ` ${feedbackText}` : ""}
            {explanation && <div className="mt-1" style={{ color: "#24514B" }}>{explanation}</div>}
          </div>
        )}
        {answered && !isCorrect && (
          <div className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: "#FDECEC", fontSize: 16, color: "#7A1F1F" }}>
            <span className="flex-1"><b>Chưa đúng.</b>{feedbackText ? ` ${feedbackText}` : " Em thử lại nhé!"}</span>
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

export default function LessonPlayer({
  lesson, gameById = {}, preview = false, checkAnswer, onPlayGame, onExit,
  initialAnswers = {}, onAnswerChecked, onPageChange, playedGameIds = null, headerExtra = null,
}) {
  const pages = useMemo(() => (Array.isArray(lesson?.pages) ? lesson.pages : []), [lesson]);
  const [pageIdx, setPageIdx] = useState(0);
  const [answers, setAnswers] = useState(() => initialAnswers || {});
  const safeIdx = Math.min(pageIdx, Math.max(0, pages.length - 1));
  const page = pages[safeIdx] || null;

  // Khôi phục tiến độ (đợt 3): hợp nhất các câu ĐÃ ĐÚNG từ initialAnswers
  // vào trạng thái hiện tại — chỉ nâng lên "đã đúng", không bao giờ ghi
  // đè một lượt làm bài đang diễn ra bằng dữ liệu cũ hơn. (Đồng bộ state
  // từ prop là chủ đích ở đây — tắt rule như các pattern nạp dữ liệu
  // chuẩn của codebase, xem StudioLessons.jsx.)
  useEffect(() => {
    if (!initialAnswers) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers((prev) => {
      let next = prev;
      let changed = false;
      for (const [elId, st] of Object.entries(initialAnswers)) {
        if (!resultIsCorrect(st?.result)) continue;
        if (resultIsCorrect(prev[elId]?.result)) continue;
        if (!changed) { next = { ...prev }; changed = true; }
        next[elId] = st;
      }
      return changed ? next : prev;
    });
  }, [initialAnswers]);

  useEffect(() => {
    if (pages.length > 0) onPageChange?.(safeIdx, pages.length);
  }, [safeIdx, pages.length, onPageChange]);

  const onAnswerChange = (elId, next) => {
    setAnswers((prev) => ({ ...prev, [elId]: next }));
    if (next && next.result !== null && next.result !== undefined && onAnswerChecked) {
      const el = pages.flatMap((p) => p.elements || []).find((e) => e.id === elId);
      if (el) onAnswerChecked(el, next);
    }
  };

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
      const played = Boolean(playedGameIds && typeof playedGameIds.has === "function" && playedGameIds.has(el.id));
      return (
        <div className="relative w-full h-full">
          <LessonElementView el={el} game={game} />
          {played && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-white text-[13px] shadow"
              style={{ background: "#1B998B" }}>
              <Check className="w-4 h-4" /> Đã chơi
            </span>
          )}
          <button type="button"
            onClick={() => {
              if (onPlayGame) onPlayGame(el.props.gameId, el);
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
        {headerExtra}
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
