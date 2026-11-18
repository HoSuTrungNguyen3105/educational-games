import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, CircleCheck, CircleX, RotateCcw, Trophy } from "lucide-react";
import { ErrorState, Loader, PrimaryButton } from "../../components/ui";
import { IconBack } from "../../components/ui/index.js";
import { questionBankService } from "../../services/api.js";
import { QuestionItem, AnswerArea } from "../../components/quiz/QuestionCard.jsx";
import { subjKey, subjLabel } from "../../lib/questionBankMeta.js";
import { navigate } from "../../lib/router.js";

// Làm CẢ BỘ ĐỀ (tự luyện) — route /question-sets/:setId.
// Câu hỏi lấy từ GET /question-banks/sets/:id (server đã strip correctAnswer
// với học sinh). Mỗi câu: chọn đáp án → bấm "Kiểm tra" → server chấm qua
// POST /sets/:id/check rồi mới trả đúng/sai + đáp án đúng + giải thích.
// Đây là TỰ LUYỆN: không nộp bài, không ghi điểm/xu/thành tích lên hệ thống
// — cuối bộ chỉ tổng kết ngay trên máy cho học sinh tự xem.
export default function QuestionSetPracticePage({ setId, userAuth }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});   // questionId -> đáp án đã chọn
  const [results, setResults] = useState({});   // questionId -> { isCorrect, correctAnswer, explanation }
  const [checking, setChecking] = useState(false);
  const [checkErr, setCheckErr] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!userAuth?.user || !setId) return undefined;
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetail(null);
    setError("");
    setIdx(0); setAnswers({}); setResults({}); setFinished(false);
    (async () => {
      try {
        const res = await questionBankService.getSet(setId);
        if (!alive) return;
        setDetail(res);
      } catch (e) {
        if (alive) setError(e?.message || "Không tải được bộ đề");
      }
    })();
    return () => { alive = false; };
  }, [userAuth, setId, reloadKey]);

  const questions = useMemo(() => detail?.questions || [], [detail]);
  const current = questions[idx];
  const currentResult = current ? results[current.id] : null;
  const correctCount = useMemo(
    () => Object.values(results).filter((r) => r.isCorrect).length,
    [results]
  );

  const backToList = () => navigate("/question-sets");

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để luyện tập bộ đề</p>
          <PrimaryButton onClick={backToList}>← Danh sách bộ đề</PrimaryButton>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <ErrorState title="Không tải được bộ đề" subtitle={error} onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    );
  }

  if (!detail) {
    return <div className="flex-1 py-16 flex justify-center"><Loader label="Đang tải bộ đề..." /></div>;
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop max-w-sm">
          <h2 className="font-display text-xl text-ink mb-2">{detail.name}</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bộ đề này đang trống — chưa có câu hỏi nào. Em chọn bộ khác nhé!</p>
          <PrimaryButton onClick={backToList}>← Danh sách bộ đề</PrimaryButton>
        </div>
      </div>
    );
  }

  // ── Màn tổng kết cuối bộ ──────────────────────────────────────────────
  if (finished) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-4">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800">Hoàn thành bộ đề!</h2>
            <p className="text-sm text-gray-500">{detail.name}</p>
            <p className="text-5xl font-display font-bold text-amber-500">
              {correctCount}/{questions.length}
            </p>
            <p className="text-sm text-gray-500">câu đúng — đây là luyện tập tự do, kết quả không tính điểm nhé.</p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button onClick={() => { setIdx(0); setAnswers({}); setResults({}); setFinished(false); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition">
                <RotateCcw className="w-4 h-4" /> Làm lại bộ này
              </button>
              <button onClick={backToList}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                ← Danh sách bộ đề
              </button>
            </div>
          </div>

          {/* Xem lại từng câu */}
          <div className="space-y-2">
            {questions.map((q, i) => {
              const r = results[q.id];
              return (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-sm font-medium text-gray-800 flex items-start gap-2">
                    {r?.isCorrect
                      ? <CircleCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      : <CircleX className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    <span>Câu {i + 1}. {q.content}</span>
                  </p>
                  {r && (
                    <p className="text-xs text-gray-500 mt-1.5 ml-6">
                      Đáp án đúng: <strong className="text-gray-700">{(q.options || []).find((o) => (o.id || o.key || o) === r.correctAnswer)?.content || r.correctAnswer}</strong>
                      {r.explanation ? <> — {r.explanation}</> : null}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Màn làm bài ────────────────────────────────────────────────────────
  const doCheck = async () => {
    if (!current || answers[current.id] == null || answers[current.id] === "") return;
    setChecking(true); setCheckErr("");
    try {
      const r = await questionBankService.checkSetAnswer(setId, current.id, answers[current.id]);
      setResults((prev) => ({ ...prev, [current.id]: r }));
    } catch (e) {
      setCheckErr(e?.message || "Không kiểm tra được đáp án, thử lại nhé");
    } finally { setChecking(false); }
  };

  const isLast = idx === questions.length - 1;

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={backToList} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-gray-700" aria-label="Về danh sách bộ đề">
            <IconBack className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-sm lg:text-base font-bold text-gray-800 truncate">{detail.name}</h1>
            <p className="text-xs text-gray-400">
              {subjLabel(subjKey(detail))}{detail.grade ? ` · Lớp ${detail.grade}` : ""} · Đã kiểm tra {Object.keys(results).length}/{questions.length} câu
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold shrink-0">
          Đúng {correctCount} câu
        </span>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
          <QuestionItem question={current} index={idx} total={questions.length} />
          <AnswerArea
            question={current}
            value={answers[current.id]}
            onChange={(v) => { if (!currentResult) setAnswers((prev) => ({ ...prev, [current.id]: v })); }}
          />

          {currentResult && (
            <div className={`mt-6 rounded-2xl border-2 p-4 ${currentResult.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <p className={`font-bold text-sm flex items-center gap-1.5 ${currentResult.isCorrect ? "text-green-700" : "text-red-600"}`}>
                {currentResult.isCorrect
                  ? <><CircleCheck className="w-4 h-4" /> Đúng rồi! Giỏi lắm!</>
                  : <><CircleX className="w-4 h-4" /> Chưa đúng — đáp án đúng là: {(current.options || []).find((o) => (o.id || o.key || o) === currentResult.correctAnswer)?.content || currentResult.correctAnswer}</>}
              </p>
              {currentResult.explanation && (
                <p className="text-sm text-gray-600 mt-1.5">💡 {currentResult.explanation}</p>
              )}
            </div>
          )}
          {checkErr && <p className="mt-4 text-sm text-red-600">{checkErr}</p>}

          <div className="flex items-center justify-between gap-2 mt-7">
            <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40">
              ← Câu trước
            </button>
            {!currentResult ? (
              <button onClick={doCheck} disabled={checking || answers[current.id] == null || answers[current.id] === ""}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition disabled:opacity-40">
                <Check className="w-4 h-4" /> {checking ? "Đang kiểm tra..." : "Kiểm tra"}
              </button>
            ) : isLast ? (
              <button onClick={() => setFinished(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition">
                Xem tổng kết <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setIdx((i) => i + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition">
                Câu tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Điều hướng nhanh theo số câu */}
        <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
          {questions.map((q, i) => {
            const r = results[q.id];
            return (
              <button key={q.id} onClick={() => setIdx(i)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                  i === idx ? "bg-amber-500 text-white shadow ring-2 ring-amber-300"
                    : r ? (r.isCorrect ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-500 border border-red-200")
                      : "bg-white text-gray-400 border border-gray-200 hover:border-gray-300"
                }`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
