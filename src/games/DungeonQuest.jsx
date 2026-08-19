import { useEffect, useRef, useState } from 'react'
import { PlayHeader, AnswerExplain, timerColor } from './shared.jsx'
import OptionButton from '../components/OptionButton.jsx'

const DUNGEON_MONSTERS = ["🐉", "👹", "🧟", "🦂", "🦇", "🐍", "👻", "🕷️"];

export default function DungeonQuestPlayScreen({ game, questions, onFinish, onQuit }) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  const [timeLeft, setTimeLeft] = useState(q.timeLimit);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [heroHp, setHeroHp] = useState(100);
  const [monsterHp, setMonsterHp] = useState(100);
  const [flash, setFlash] = useState(null); // "hero" | "monster" | null
  const startRef = useRef(Date.now());
  const monster = DUNGEON_MONSTERS[idx % DUNGEON_MONSTERS.length];

  useEffect(() => { setTimeLeft(q.timeLimit); setSelected(null); setRevealed(false); setMonsterHp(100); }, [idx]);

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
    if (isCorrect) { setMonsterHp(0); setFlash("monster"); }
    else { setHeroHp(h => Math.max(0, h - 20)); setFlash("hero"); }
    setTimeout(() => setFlash(null), 400);

    const nextScore = score + earned;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setCorrectCount(nextCorrect);

    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(i => i + 1); }
      else {
        const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
        onFinish({ score: nextScore, correct: nextCorrect, timeUsed });
      }
    }, 1400);
  }

  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);

  return (
    <div className="flex-1 flex flex-col" style={{ background: "radial-gradient(120% 140% at 50% 0%, #2E1F4A 0%, #170F28 60%)" }}>
      <PlayHeader icon="🗡️" title="HẦM NGỤC BÍ ẨN" accent="#B58AFF" code={game.code}
        progressLabel={`Chặng: ${idx + 1}/${questions.length}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center p-5 md:p-8 gap-6">
        <div className={`w-full max-w-2xl flex items-center justify-between gap-4 ${flash === "hero" ? "shake-hit" : ""}`}>
          <div className="flex-1 note-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛡️</span>
              <span className="font-display text-sm text-ink">Anh hùng</span>
            </div>
            <div className="w-full h-3 bg-ink/10 rounded-full overflow-hidden">
              <div className="h-full bg-teal transition-all duration-500" style={{ width: `${heroHp}%` }}></div>
            </div>
          </div>
          <span className="text-3xl text-white/60">⚔️</span>
          <div className={`flex-1 note-card p-4 ${flash === "monster" ? "shake-hit" : ""}`}>
            <div className="flex items-center gap-2 mb-2 justify-end">
              <span className="font-display text-sm text-ink">Quái vật</span>
              <span className="text-2xl">{monster}</span>
            </div>
            <div className="w-full h-3 bg-ink/10 rounded-full overflow-hidden">
              <div className="h-full bg-ticket transition-all duration-500 ml-auto" style={{ width: `${monsterHp}%` }}></div>
            </div>
          </div>
        </div>

        <div className="text-7xl anim-pop" key={idx}>{monster}</div>

        <div className="note-card p-6 max-w-lg w-full">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Trả lời đúng để tung đòn chí mạng</span>
          <p className="font-display text-lg sm:text-xl text-ink mt-2 mb-6">{q.content}</p>
          <div className="grid gap-3">
            {q.options.map((o, i) => (
              <OptionButton key={o.id} o={o} i={i} revealed={revealed} selected={selected} correctId={q.correctAnswer}
                onSelect={handleAnswer} hover="border-ink/12 hover:border-[#8B6FF1]/50" correctMark="⚔️" />
            ))}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Hạ gục quái vật! 🎉" : "Quái vật phản đòn, mất máu rồi!"}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}