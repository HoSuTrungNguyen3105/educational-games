import { useEffect, useMemo, useRef, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import { injectAnswerBridge } from "../_shared/injectAnswerBridge.js";
import { getExamTemplate } from "./templates.js";

/**
 * ExamPlayer — frame cha cho MẪU ĐỀ THI HTML (src/games/examination).
 *
 * Mẫu đề thi không tự gọi API (xem thithap.html, thithap-3d.html): câu hỏi do
 * component này đẩy xuống, đáp án đi ngược lên và được server chấm. Nhờ vậy
 * điểm hiển thị trong game đúng bằng điểm giáo viên thấy.
 *
 * Giao thức postMessage:
 *   iframe → cha : ready | answer-recorded | answers | game-over | exam-done
 *   cha → iframe : init { questions, playerName, title }
 *                  graded { score, max }   (server chấm xong)
 *                  time-up                 (hết thời gian làm bài)
 *
 * `onFinish(payload)` trả về Promise<{ score, max }>: trang làm bài gọi API nộp
 * bài, kết quả gửi ngược cho iframe để animation boss chạy tiếp. Animation xong,
 * iframe báo `exam-done` → app mới đổi sang ResultView (có fallback đồng hồ
 * phòng khi iframe không kịp báo).
 */
const EXAM_DONE_FALLBACK_MS = 25000;
const WATCHDOG_MS = 5000;

function ExamPlayer({ templateId, questions, playerName, title, onFinish, onExamDone }, ref) {
  const iframeRef = useRef(null);
  const answersRef = useRef([]);
  const playIdRef = useRef(null);
  const gradingRef = useRef(false);
  const doneRef = useRef(false);
  const watchdogRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [grading, setGrading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const template = getExamTemplate(templateId);

  const injectedHtml = useMemo(
    () => (template ? injectAnswerBridge(template.html) : ""),
    [template]
  );

  // Listener chỉ gắn một lần lúc mount, nên callback phải đọc qua ref để không
  // gọi lại bản prop cũ. Gắn ở effect vì ghi ref ngay trong render là sai.
  const cbRef = useRef({ onFinish, onExamDone, questions, playerName, title });
  useEffect(() => {
    cbRef.current = { onFinish, onExamDone, questions, playerName, title };
  });

  const post = useCallback((msg) => {
    const w = iframeRef.current?.contentWindow;
    if (w) w.postMessage(msg, "*");
  }, []);

  const recordAnswer = useCallback((questionId, value, timeSpent) => {
    if (questionId == null) return;
    const id = String(questionId);
    const list = answersRef.current;
    const entry = { questionId: id, value: value ?? null, timeSpent: typeof timeSpent === "number" ? timeSpent : undefined };
    const idx = list.findIndex(a => a.questionId === id);
    if (idx >= 0) list[idx] = entry;
    else list.push(entry);
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    clearTimeout(watchdogRef.current);
    setDone(true);
    cbRef.current.onExamDone?.();
  }, []);

  /** Nộp đáp án lên server, trả {score, max} cho iframe chạy animation. */
  const grade = useCallback(async (list, meta) => {
    if (gradingRef.current || doneRef.current) return;
    const answers = (list && list.length ? list : answersRef.current) || [];
    if (!answers.length) {
      setError("Chưa nhận được câu trả lời nào từ đề thi. Thử nộp lại nhé.");
      return;
    }
    gradingRef.current = true;
    setGrading(true);
    setError("");
    try {
      const graded = (await cbRef.current.onFinish?.({ answers, playId: playIdRef.current, ...meta })) || {};
      post({ type: "graded", data: { score: graded.score ?? 0, max: graded.max ?? 0 } });
      // Fallback: tab bị ẩn hoặc animation kẹt → vẫn phải thấy kết quả chi tiết.
      clearTimeout(watchdogRef.current);
      watchdogRef.current = setTimeout(finish, EXAM_DONE_FALLBACK_MS);
    } catch (e) {
      setError(e?.message || "Nộp bài thất bại.");
      gradingRef.current = false;
    } finally {
      setGrading(false);
    }
  }, [post, finish]);

  /** Hết giờ: bảo iframe nộp; nếu nó không phản hồi thì tự lấy đáp án từ bridge. */
  const forceSubmit = useCallback(() => {
    if (gradingRef.current || doneRef.current) return;
    post({ type: "time-up", data: {} });
    clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      if (gradingRef.current || doneRef.current) return;
      let fromBridge = [];
      try {
        // srcDoc + allow-same-origin → đọc thẳng EG_ANSWER của iframe.
        fromBridge = iframeRef.current?.contentWindow?.EG_ANSWER?.getAnswers?.() || [];
      } catch { /* iframe không cùng origin — đã có answersRef */ }
      grade(fromBridge.length ? fromBridge : null, { timedOut: true });
    }, WATCHDOG_MS);
  }, [post, grade]);

  useImperativeHandle(ref, () => ({ forceSubmit }), [forceSubmit]);

  useEffect(() => {
    const onMessage = (e) => {
      // Chỉ tin message từ đúng iframe đề thi này.
      if (e.source !== iframeRef.current?.contentWindow) return;
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "ready" || msg.type === "bridge-ready") {
        playIdRef.current = "exam-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        answersRef.current = [];
        setReady(true);
        post({
          type: "init",
          data: {
            questions: cbRef.current.questions || [],
            playerName: cbRef.current.playerName || "Học sinh",
            title: cbRef.current.title || "",
          },
        });
      } else if (msg.type === "answer" || msg.type === "answer-recorded") {
        const d = msg.data || {};
        recordAnswer(d.questionId ?? d.id, d.value ?? d.answer, d.timeSpent);
      } else if (msg.type === "answers") {
        for (const a of (Array.isArray(msg.data?.answers) ? msg.data.answers : [])) {
          recordAnswer(a?.questionId, a?.value, a?.timeSpent);
        }
      } else if (msg.type === "game-over") {
        const d = msg.data || {};
        grade(Array.isArray(d.answers) && d.answers.length ? d.answers : null, {
          timeUsed: d.timeUsed || null,
        });
      } else if (msg.type === "exam-done") {
        finish();
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(watchdogRef.current);
    };
  }, [post, recordAnswer, grade, finish]);

  // Đổi đề thi (làm lại / đổi template) → trang làm bài mount lại component này
  // với `key` mới, nên không cần reset trạng thái thủ công ở đây.

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-sm text-gray-500">
        Không tìm thấy mẫu đề thi này trong ứng dụng.
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0 bg-black">
      <iframe
        ref={iframeRef}
        srcDoc={injectedHtml}
        /* allow-same-origin: srcDoc đến từ chính bundle của app nên cùng nguồn với
           trang cha; đề thi cần localStorage/pointer-lock bên trong. */
        sandbox="allow-scripts allow-same-origin allow-modals allow-pointer-lock"
        className="w-full h-full block border-0"
        title={template.name}
      />

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
          Đang chuẩn bị đề thi…
        </div>
      )}
      {(grading || error) && !done && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
          <div className={`mx-auto max-w-md rounded-xl px-4 py-3 text-sm shadow-lg ${error ? "bg-red-50 text-red-600 border border-red-200" : "bg-white/95 text-gray-600"}`}>
            {error ? (
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0">{error}</span>
                <button
                  onClick={() => { setError(""); gradingRef.current = false; grade(null, {}); }}
                  className="shrink-0 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Nộp lại
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
                <span>Đang chấm bài…</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default forwardRef(ExamPlayer);
