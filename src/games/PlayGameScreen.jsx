import { useEffect, useRef, useState } from 'react'
import { useTemplate } from '../lib/hooks.js'
import { StampToken } from '../components/ui.jsx'
import AiExplainTrigger from '../components/ai/AiExplainTrigger.jsx'
import { AnswerExplain } from './shared.jsx'
import { uid } from '../services/api.js'

export default function PlayGameScreen({ game, questions, onFinish }) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  const [timeLeft, setTimeLeft] = useState(q.timeLimit);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startRef = useRef(Date.now());
  const playIdRef = useRef(null);
  const answersRef = useRef([]);
  // Được giữ lại khi panel AI mở để câu hỏi không bị cuộn qua trước khi học sinh đọc xong.
  const advanceTimerRef = useRef(null);
  const advanceRef = useRef(null);
  const tpl = useTemplate(game);
  const gameId = game?._id?.toString() || game?.id || null;

  if (playIdRef.current === null) playIdRef.current = uid('play');

  useEffect(() => { setTimeLeft(q.timeLimit); setSelected(null); setRevealed(false); setAiOpen(false); }, [idx]);

  useEffect(() => {
    if (revealed || aiOpen) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed, aiOpen]);

  useEffect(() => () => clearTimeout(advanceTimerRef.current), []);

  function runAdvance() {
    const go = advanceRef.current;
    advanceRef.current = null;
    go?.();
  }

  function scheduleAdvance(delayMs) {
    clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      runAdvance();
    }, delayMs);
  }

  function handleAnswer(optionId) {
    if (revealed) return;
    const isCorrect = optionId === q.correctAnswer;
    // Ghi lại đáp án để server chấm lại (không tin điểm phía client).
    answersRef.current.push({
      questionId: q.id,
      value: optionId,
      timeSpent: Math.max(0, (q.timeLimit || 0) - timeLeft),
    });
    setSelected(optionId);
    setRevealed(true);
    if (isCorrect) {
      const bonus = Math.round((timeLeft / q.timeLimit) * 40);
      setScore(s => s + q.points + bonus);
      setCorrectCount(c => c + 1);
    }

    // Chụp lại số điểm tại thời điểm trả lời: lượt chuyển câu có thể bị trì hoãn khi
    // học sinh đang đọc phần giải thích của AI, nên không đọc được state cập nhật.
    const finalScore = score + (isCorrect ? q.points + Math.round((timeLeft / q.timeLimit) * 40) : 0);
    const finalCorrect = correctCount + (isCorrect ? 1 : 0);

    advanceRef.current = () => {
      if (idx + 1 < questions.length) { setIdx(i => i + 1); }
      else {
        const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
        onFinish({
          score: finalScore,
          correct: finalCorrect,
          totalQuestions: questions.length,
          timeUsed,
          answers: answersRef.current,
          playId: playIdRef.current,
          questionIds: questions.map(x => x?.id).filter(Boolean),
        });
      }
    };
    scheduleAdvance(1300);
  }

  // Học sinh mở panel AI → tạm dừng chuyển câu; đóng panel → chuyển tiếp ngay.
  function handleAiOpenChange(next) {
    setAiOpen(next);
    if (next) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    } else if (advanceRef.current) {
      scheduleAdvance(0);
    }
  }

  const pct = (timeLeft / q.timeLimit) * 100;
  const progressColor = pct > 50 ? "#1B998B" : pct > 20 ? "#F4B942" : "#E4572E";

  return (
    <div className="flex-1 flex flex-col px-5 md:px-8 py-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-xs text-[#8A7C63]">Câu {idx + 1}/{questions.length}</span>
        <span className="flex items-center gap-2">
          <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#F4B942"} size={30} fontSize={14} />
          <span className="font-display text-ink">{score} điểm</span>
        </span>
      </div>

      <div className="w-full h-2 bg-ink/10 rounded-full mb-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width: `${pct}%`, background: progressColor }}></div>
      </div>
      <div className="text-right text-xs font-mono text-[#8A7C63] mb-6">⏱ {timeLeft}s</div>

      <div key={q.id} className="note-card p-6 sm:p-8 flex-1 flex flex-col anim-pop">
        <h2 className="font-display text-xl sm:text-2xl text-ink mb-8 text-center">{q.content}</h2>
        <div className="grid gap-3 mt-auto">
          {q.options.map((o, i) => {
            let stateCls = "border-ink/12 hover:border-ticket/50";
            if (revealed) {
              if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10";
              else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
              else stateCls = "border-ink/10 opacity-50";
            } else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
            return (
              <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                className={`text-left px-5 py-4 rounded-2xl border-2 transition font-body text-base flex items-center gap-3 ${stateCls}`}>
                <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{o.content}</span>
                {revealed && o.id === q.correctAnswer && <span>✅</span>}
                {revealed && o.id === selected && o.id !== q.correctAnswer && <span>❌</span>}
              </button>
            );
          })}
        </div>
        {revealed && (
          <>
          <p className={`text-center mt-5 font-display text-lg ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
            {selected === q.correctAnswer ? "Chính xác! 🎉" : selected === null ? "Hết giờ! ⏰" : "Chưa đúng rồi 😅"}
          </p>
          <AnswerExplain q={q} />
          <div className="mt-4 flex justify-center">
            <AiExplainTrigger
              open={aiOpen}
              onOpenChange={handleAiOpenChange}
              gameId={gameId}
              questionId={q.id}
              answer={selected}
              questionText={q.content}
            />
          </div>
          </>
        )}
      </div>
    </div>
  );
}