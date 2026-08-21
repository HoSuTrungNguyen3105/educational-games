import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../stores/game.store.js'
import { socket } from '../socket/socket.js'
import { SOCKET_EVENTS } from '../socket/socket.events.js'
import TemplateRenderer from './TemplateRenderer.jsx'

/* eslint-disable react-hooks/set-state-in-effect */

// Student runtime cho game thiết kế bằng Game Builder (có game.design)
export default function CustomDesignPlayScreen({ game, questions, playerName, onFinish, onQuit }) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx] || questions[0];
  const [timeLeft, setTimeLeft] = useState(q?.timeLimit || 20);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startRef = useRef(Date.now());
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Scale canvas để nhìn toàn diện trong mọi khung (đặc biệt là iframe trên mobile)
  useEffect(() => {
    const node = stageRef.current;
    if (!node || !game.design) return;
    const compute = () => {
      const rect = node.getBoundingClientRect();
      const { width: cw, height: ch } = game.design.canvas;
      const pad = window.innerWidth < 768 ? 16 : 48; // padding dựa theo p-2 hay p-6
      const s = Math.min(2, (rect.width - pad) / cw, (rect.height - pad) / ch);
      setScale(Math.max(0.05, s));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(node);
    window.addEventListener("resize", compute);
    return () => { ro.disconnect(); window.removeEventListener("resize", compute); };
  }, [game.design]);

  const players = useGameStore(s => s.players);
  const leaderboard = useGameStore(s => s.leaderboard);
  const realtimeScore = useGameStore(s => s.score);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setTimeLeft(q?.timeLimit || 20); setSelected(null); setRevealed(false); }, [idx]);

  useEffect(() => {
    if (revealed || !q) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, revealed]);

  useEffect(() => {
    if (realtimeScore > score) setScore(realtimeScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeScore]);

  function handleAnswer(optionId) {
    if (revealed || !q) return;
    const isCorrect = optionId === q.correctAnswer;
    const earned = isCorrect ? q.points + Math.round((timeLeft / q.timeLimit) * 40) : 0;
    setSelected(optionId);
    setRevealed(true);

    const nextScore = score + earned;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setCorrectCount(nextCorrect);

    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.SUBMIT_ANSWER, {
        gameId: game.id,
        questionId: q.id,
        answerId: optionId,
      });
    }

    setTimeout(() => {
      if (idx + 1 < questions.length) setIdx(i => i + 1);
      else {
        const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
        onFinish({ score: nextScore, correct: nextCorrect, timeUsed });
      }
    }, 1400);
  }

  const onStageClick = (e) => {
    if (revealed) return;
    const chip = e.target.closest("[data-answer-id]");
    if (chip) handleAnswer(chip.dataset.answerId);
  };

  if (!game.design || !game.design.elements || game.design.elements.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-ink/60 text-sm">Trò chơi chưa có thiết kế riêng.</div>;
  }

  const context = {
    question: q, options: q?.options || [], timeLeft, selected, revealed,
    score: realtimeScore || score, players, leaderboard, playerName,
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] relative">
      <div className="flex items-center justify-between gap-2 px-3 md:px-8 py-2 bg-white border-b border-ink/10 shrink-0 z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-lg md:text-2xl">🎨</span>
          <h1 className="font-display text-sm md:text-xl text-ink truncate">{game.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-[11px] md:text-sm text-ink/70 font-body whitespace-nowrap shrink-0">
          <span className="hidden sm:inline">Phòng: <b className="text-ink font-mono">{game.code}</b></span>
          <span className="sm:hidden">📋 {idx + 1}/{questions.length}</span>
          <span className="hidden sm:inline">📋 Câu hỏi: {idx + 1}/{questions.length}</span>
          <span>⭐ {realtimeScore || score}</span>
        </div>
        <button onClick={onQuit} className="font-display text-xs md:text-sm text-ticket border border-ticket/40 rounded-2xl px-3 py-1.5 md:px-4 md:py-2 hover:bg-ticket/5 transition">Thoát</button>
      </div>

      <div ref={stageRef} className="flex-1 min-h-0 bg-paper p-2 md:p-6 flex items-center justify-center relative overflow-hidden">
        <div className="shadow-xl rounded-2xl overflow-hidden flex-none"
          style={{ width: Math.max(1, Math.round(game.design.canvas.width * scale)), height: Math.max(1, Math.round(game.design.canvas.height * scale)) }}>
          <div className="relative w-full h-full" onClick={onStageClick}
            style={{
              width: game.design.canvas.width,
              height: game.design.canvas.height,
              background: game.design.canvas.background || "#FFF6E7",
              overflow: "hidden",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}>
            <TemplateRenderer template={game.design} context={context} />
          </div>
        </div>
        
        {revealed && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 anim-pop">
            <div className={`px-6 py-3 rounded-2xl shadow-2xl text-center font-display text-base md:text-lg whitespace-nowrap ${selected === q.correctAnswer ? "bg-teal text-white" : "bg-ticket text-white"}`}>
              {selected === q.correctAnswer ? "Chính xác! 🎉" : selected === null ? "Hết giờ! ⏰" : "Chưa đúng rồi 😅"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}