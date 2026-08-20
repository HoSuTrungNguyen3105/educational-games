import { useEffect, useMemo, useRef, useState } from 'react'
import { usePlayerNames } from '../lib/hooks.js'
import { AnswerExplain, timerColor } from './shared.jsx'
import { shortName } from '../lib/utils.js'
import { IconButton } from '../components/ui.jsx'

const SNAIL_LANE_COLORS = ["#FF6F91", "#4C8DFF", "#F4B942", "#4CAF7D", "#8B6FF1"];

export function SnailIcon({ color = "#FF6F91", size = 46 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="44" rx="22" ry="4" fill="rgba(29,46,74,0.10)" />
      <path d="M10 36 Q5 28 14 24 Q9 17 16 13 Q23 7 30 13 Q34 7 41 12" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="21" r="15" fill={color} />
      <circle cx="22" cy="21" r="10" fill="rgba(255,255,255,0.32)" />
      <circle cx="22" cy="21" r="5" fill="rgba(255,255,255,0.45)" />
      <line x1="41" y1="12" x2="46" y2="2" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="14" x2="37" y2="5" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="2" r="3.2" fill="white" stroke={color} strokeWidth="1.5" />
      <circle cx="37" cy="5" r="3.2" fill="white" stroke={color} strokeWidth="1.5" />
      <circle cx="47" cy="1.4" r="1.1" fill={color} />
      <circle cx="38" cy="4.4" r="1.1" fill={color} />
    </svg>
  );
}

export default function SnailRacePlayScreen({ game, questions, playerName, onFinish, onQuit }) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  const [timeLeft, setTimeLeft] = useState(q.timeLimit);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [muted, setMuted] = useState(false);
  const startRef = useRef(Date.now());

  const opponentNames = usePlayerNames().slice(0, 4).map(shortName);
  const racers = useMemo(() => ["Bạn", ...opponentNames].map((name, i) => ({ name, color: SNAIL_LANE_COLORS[i] })), [opponentNames]);
  const [scores, setScores] = useState(() => racers.map(() => 0));
  const [myScore, setMyScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const totalPoints = useMemo(() => questions.reduce((s, qq) => s + qq.points, 0), [questions]);

  useEffect(() => { setTimeLeft(q.timeLimit); setSelected(null); setRevealed(false); }, [idx]);

  useEffect(() => {
    if (revealed) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed]);

  function handleAnswer(optionId) {
    if (revealed) return;
    const isCorrect = optionId === q.correctAnswer;
    const earned = isCorrect ? q.points + Math.round((timeLeft / q.timeLimit) * 40) : 0;
    setSelected(optionId);
    setRevealed(true);

    const nextScores = scores.map((s, i) => {
      if (i === 0) return s + earned;
      return Math.random() > 0.35 ? s + Math.round(q.points * (0.5 + Math.random() * 0.6)) : s;
    });
    setScores(nextScores);
    const nextMyScore = myScore + earned;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    setMyScore(nextMyScore);
    setCorrectCount(nextCorrect);

    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(i => i + 1); }
      else {
        const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
        onFinish({ score: nextMyScore, correct: nextCorrect, timeUsed });
      }
    }, 1300);
  }

  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 bg-white border-b border-ink/10 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐌</span>
          <h1 className="font-display text-xl">
            <span className="text-teal">ĐƯỜNG ĐUA</span> <span className="text-ticket">ỐC SÊN</span>
          </h1>
        </div>
        <div className="flex items-center gap-5 text-sm text-ink/70 font-body flex-wrap">
          <span>Phòng: <b className="text-ink font-mono">{game.code}</b></span>
          <span className="hidden sm:inline">·</span>
          <span>📋 Câu hỏi: {idx + 1}/{questions.length}</span>
          <span className="hidden sm:inline">·</span>
          <span style={{ color: timeColor }}>⏱ Thời gian: {timeLeft}s</span>
          <span className="hidden sm:inline">·</span>
          <span>⭐ Điểm: {myScore}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconButton title={muted ? "Bật âm thanh" : "Tắt âm thanh"} onClick={() => setMuted(m => !m)}>{muted ? "🔇" : "🔊"}</IconButton>
          <IconButton title="Toàn màn hình">⛶</IconButton>
          <button onClick={onQuit} className="font-display text-sm text-ticket border border-ticket/40 rounded-2xl px-4 py-2 hover:bg-ticket/5 transition">Thoát</button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1.6fr_1fr] gap-5 p-5 md:p-8">
        {/* TRACK */}
        <div className="rounded-3xl overflow-hidden border border-ink/10 bg-gradient-to-b from-[#EAF6E4] to-[#D9EECC] flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 bg-teal text-white">
            <span className="font-display font-semibold flex items-center gap-2">🏆 ĐƯỜNG ĐUA</span>
            <span className="font-display font-semibold flex items-center gap-2">🏁 ĐÍCH ĐẾN</span>
          </div>
          <div className="flex-1 relative">
            <div className="absolute right-0 top-0 bottom-0 w-5 sm:w-7" style={{ backgroundImage: "repeating-conic-gradient(#1D2E4A 0% 25%, #FFFBF2 0% 50%)", backgroundSize: "10px 10px" }}></div>
            <div className="divide-y divide-dashed divide-white/70 pr-5 sm:pr-7">
              {racers.map((r, i) => {
                const progress = Math.min(92, (scores[i] / Math.max(totalPoints, 1)) * 92);
                const isMe = i === 0;
                return (
                  <div key={r.name} className={`relative h-16 sm:h-[68px] flex items-center px-4 ${isMe ? "bg-white/20" : ""}`}>
                    {isMe && <div className="absolute inset-y-1 left-[2px] w-1 rounded-full bg-ticket"></div>}
                    <div className="absolute transition-all duration-700 ease-out" style={{ left: `calc(${progress}% )` }}>
                      <div className="relative">
                        <SnailIcon color={r.color} size={44} />
                        {isMe && (
                          <span className="absolute -top-2 -right-2 text-[9px] font-bold bg-ticket text-white rounded-full px-1.5 py-0.5 shadow-md leading-none">BẠN</span>
                        )}
                      </div>
                    </div>
                    <span className={`absolute bottom-1 left-4 text-[10px] font-mono uppercase tracking-wide ${isMe ? "text-ticket font-bold" : "text-ink/45"}`}>
                      {isMe ? "🐌 Bạn (Tôi)" : `Ốc sên ${i + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-6 bg-[#BFE3A3] flex items-center justify-around text-[10px] opacity-70">
            {["🌼","🌿","🌸","🌿","🌼","🌿","🌸"].map((e, i) => <span key={i}>{e}</span>)}
          </div>
        </div>

        {/* QUESTION PANEL */}
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 self-start bg-gold text-ink font-display text-xs font-semibold uppercase px-4 py-2 rounded-full shadow-[0_2px_0_rgba(0,0,0,0.1)]">
            ⭐ Câu hỏi thử thách
          </span>
          <div className="note-card p-6 flex-1">
            <p className="font-display text-lg sm:text-xl text-ink leading-snug mb-6">{q.content}</p>
            <div className="space-y-3">
              {q.options.map((o, i) => {
                let stateCls = "border-ink/12 hover:border-ticket/40";
                let badgeCls = "border-ink/25 text-ink/70";
                if (revealed) {
                  if (o.id === q.correctAnswer) { stateCls = "border-teal bg-teal/10"; badgeCls = "bg-teal border-teal text-white"; }
                  else if (o.id === selected) { stateCls = "border-ticket bg-ticket/10"; badgeCls = "bg-ticket border-ticket text-white"; }
                  else { stateCls = "border-ink/10 opacity-50"; }
                } else if (o.id === selected) { stateCls = "border-ticket bg-ticket/5"; badgeCls = "bg-ticket border-ticket text-white"; }
                return (
                  <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                    className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition font-body text-base ${stateCls}`}>
                    <span className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-mono font-semibold flex-shrink-0 transition ${badgeCls}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{o.content}</span>
                    {revealed && o.id === q.correctAnswer && <span className="text-teal text-lg">✓</span>}
                  </button>
                );
              })}
            </div>
            <AnswerExplain q={q} />
          </div>
          <div className="flex items-center gap-3 bg-gold/15 border border-gold/40 rounded-2xl px-5 py-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-ink/80">Trả lời nhanh và chính xác để ốc sên về đích nhé!</p>
          </div>
        </div>
      </div>

      {/* PLAYERS BAR */}
      <div className="px-5 md:px-8 pb-6">
        <div className="note-card p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5 flex-wrap">
            {racers.map((r, i) => (
              <div key={r.name} className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: r.color }}>
                  {i === 0 ? "🙂" : "👤"}
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-ink">{r.name}{i === 0 && <span className="text-ticket"> (bạn)</span>}</div>
                  <div className="text-xs text-[#8A7C63] font-mono">{scores[i]} điểm</div>
                </div>
              </div>
            ))}
          </div>
          <span className="inline-flex items-center gap-2 text-ticket border border-ticket/40 rounded-2xl px-4 py-2 font-display text-sm">
            🏆 Bảng xếp hạng
          </span>
        </div>
      </div>
    </div>
  );
}