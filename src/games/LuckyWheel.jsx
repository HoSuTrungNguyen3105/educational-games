import { useEffect, useMemo, useRef, useState } from 'react'
import { usePlayerNames } from '../lib/hooks.js'
import { PlayHeader, AnswerExplain } from './shared.jsx'
import { shortName } from '../lib/utils.js'

const WHEEL_COLORS = ["#E4572E", "#F4B942", "#1B998B", "#FF6F91", "#4C8DFF", "#8B6FF1", "#4CAF7D", "#FF9F5A", "#31B0C9", "#D96CD9"];

export default function LuckyWheelPlayScreen({ game, questions, playerName, onFinish, onQuit }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gamePhase, setGamePhase] = useState("wheel"); // wheel | question
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  const segmentCount = questions.length;
  const segmentAngle = 360 / segmentCount;

  const playerNames = usePlayerNames();

  const wheelNames = useMemo(() => {
    const pool = [...playerNames];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return Array.from({ length: segmentCount }, (_, i) => shortName(pool[i % pool.length]));
  }, [segmentCount, playerNames]);

  const segments = useMemo(
    () => questions.map((q, i) => ({ ...q, name: wheelNames[i % wheelNames.length], color: WHEEL_COLORS[i % WHEEL_COLORS.length] })),
    [questions, wheelNames]
  );

  const allDone = answeredIds.length >= segmentCount;

  const spinWheel = () => {
    if (spinning || allDone) return;
    setSpinning(true);

    const availableIdx = segments.map((_, i) => i).filter(i => !answeredIds.includes(segments[i].id));
    const winIdx = availableIdx[Math.floor(Math.random() * availableIdx.length)];

    // Segment i occupies [i*segmentAngle, (i+1)*segmentAngle) measured clockwise from the
    // top of the wheel (the pointer sits fixed at the top). Its center is winCenter.
    const winCenter = winIdx * segmentAngle + segmentAngle / 2;
    // After rotating the wheel by R degrees clockwise, the point that lands under the
    // fixed top pointer is the one whose original angle satisfies angle + R ≡ 0 (mod 360).
    // So we need R ≡ (360 - winCenter) (mod 360).
    const targetMod = (360 - winCenter + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    const extraSpins = 5 + Math.floor(Math.random() * 2); // 5-6 full laps for drama
    const newRotation = rotation + extraSpins * 360 + delta;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const winner = segments[winIdx];
      setCurrentQuestion(winner);
      setGamePhase("question");
      setTimeLeft(winner.timeLimit);
      setSelectedAnswer(null);
      setRevealed(false);
    }, 4200);
  };

  useEffect(() => {
    if (gamePhase !== "question" || !currentQuestion || revealed) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [timeLeft, gamePhase, currentQuestion, revealed]);

  function handleAnswer(optionId) {
    if (revealed || !currentQuestion) return;
    setSelectedAnswer(optionId);
    setRevealed(true);

    const isCorrect = optionId === currentQuestion.correctAnswer;
    const earned = isCorrect ? currentQuestion.points + Math.round((timeLeft / currentQuestion.timeLimit) * 40) : 0;
    const nextScore = score + earned;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextAnswered = [...answeredIds, currentQuestion.id];

    setScore(nextScore);
    setCorrectCount(nextCorrect);
    setAnsweredIds(nextAnswered);

    setTimeout(() => {
      if (nextAnswered.length >= segmentCount) {
        onFinish({ score: nextScore, correct: nextCorrect, timeUsed: Math.round((Date.now() - startTimeRef.current) / 1000) });
      } else {
        setGamePhase("wheel");
        setCurrentQuestion(null);
      }
    }, 1900);
  }

  /* ---- wheel rendering ---- */
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 8;

  function polar(angleDeg, r) {
    // angleDeg measured clockwise from the top (12 o'clock); convert to SVG coords.
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: "radial-gradient(120% 140% at 50% 0%, #2A1F52 0%, #17102F 55%, #120C24 100%)" }}>
      <PlayHeader icon="🎡" title="VÒNG QUAY MAY MẮN" accent="#F4B942" code={game.code}
        progressLabel={`Đã quay: ${answeredIds.length}/${segmentCount}`} score={score} onQuit={onQuit} />

      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8 gap-6">
        {gamePhase === "wheel" && (
          <div className="flex flex-col items-center anim-pop">
            <div className="relative" style={{ width: size, height: size + 26 }}>
              {/* marquee glow ring */}
              <div className="absolute inset-0 rounded-full" style={{
                boxShadow: "0 0 0 10px rgba(244,185,66,0.10), 0 0 60px rgba(244,185,66,0.25)",
              }}></div>

              {/* bulbs around the rim */}
              <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {Array.from({ length: 24 }, (_, i) => {
                  const p = polar((i * 360) / 24, radius + 8);
                  return <circle key={i} cx={p.x} cy={p.y} r={3.4} fill="#F4B942" opacity={spinning ? (i % 2 === 0 ? 1 : 0.35) : 0.75} />;
                })}
              </svg>

              {/* fixed pointer at the top, aligned with angle 0 */}
              <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -4 }}>
                <svg width="36" height="40" viewBox="0 0 36 40">
                  <polygon points="18,36 4,6 32,6" fill="#E4572E" stroke="#FFFBF2" strokeWidth="3" strokeLinejoin="round" />
                  <circle cx="18" cy="6" r="6" fill="#FFFBF2" stroke="#E4572E" strokeWidth="2" />
                </svg>
              </div>

              {/* rotating wheel */}
              <svg
                width={size} height={size} viewBox={`0 0 ${size} ${size}`}
                className="absolute left-0"
                style={{
                  top: 26,
                  transition: spinning ? "transform 4.2s cubic-bezier(0.12,0.67,0.1,1)" : "none",
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                <circle cx={center} cy={center} r={radius + 6} fill="#FFFBF2" stroke="#1D2E4A" strokeWidth="3" />
                {segments.map((segment, i) => {
                  const startAngle = i * segmentAngle;
                  const endAngle = (i + 1) * segmentAngle;
                  const p1 = polar(startAngle, radius);
                  const p2 = polar(endAngle, radius);
                  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
                  const labelPos = polar(startAngle + segmentAngle / 2, radius * 0.66);
                  const isDone = answeredIds.includes(segment.id);
                  return (
                    <g key={segment.id}>
                      <path
                        d={`M ${center} ${center} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`}
                        fill={segment.color}
                        stroke="#FFFBF2"
                        strokeWidth="3"
                        opacity={isDone ? 0.28 : 1}
                      />
                      <text
                        x={labelPos.x} y={labelPos.y}
                        fill="#fff" fontSize="20" fontWeight="700" fontFamily="Fredoka, sans-serif"
                        textAnchor="middle" dominantBaseline="middle"
                        transform={`rotate(${startAngle + segmentAngle / 2}, ${labelPos.x}, ${labelPos.y})`}
                        opacity={isDone ? 0.5 : 1}
                      >
                        {isDone ? "✓" : segment.name}
                      </text>
                    </g>
                  );
                })}
                <circle cx={center} cy={center} r={radius * 0.22} fill="#1D2E4A" stroke="#F4B942" strokeWidth="4" />
                <text x={center} y={center + 1} fill="#F4B942" fontSize="15" fontWeight="700" fontFamily="Fredoka, sans-serif" textAnchor="middle" dominantBaseline="middle">
                  QUAY
                </text>
              </svg>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning || allDone}
              className="mt-6 font-display font-semibold text-lg px-10 py-4 rounded-full bg-gradient-to-b from-gold to-[#E4572E] text-white shadow-[0_5px_0_rgba(0,0,0,0.35)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.35)] transition disabled:opacity-50 disabled:active:translate-y-0"
            >
              {spinning ? "ĐANG QUAY... 🎡" : allDone ? "HOÀN THÀNH! 🎉" : "QUAY NGAY! 🎯"}
            </button>
            <p className="mt-3 text-sm text-paper/70 font-mono">
              Đã trả lời {answeredIds.length}/{segmentCount} câu · ⭐ {score} điểm
            </p>
          </div>
        )}

        {gamePhase === "question" && currentQuestion && (
          <div className="w-full max-w-lg anim-pop">
            <div className="note-card p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-7xl opacity-10 rotate-12 select-none">🎡</div>
              <div className="flex justify-between items-center mb-4">
                <span className="inline-flex items-center gap-1.5 bg-gold/20 text-[#8a6a10] font-mono text-xs uppercase px-3 py-1 rounded-full">
                  🎟️ {currentQuestion.name}
                </span>
                <span className={`font-mono text-sm font-semibold ${timeLeft <= 5 ? "text-ticket" : "text-ink/70"}`}>⏱ {timeLeft}s</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-ink mb-6 leading-snug">{currentQuestion.content}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => {
                  let stateCls = "border-ink/12 hover:border-ticket/50";
                  if (revealed) {
                    if (option.id === currentQuestion.correctAnswer) stateCls = "border-teal bg-teal/10";
                    else if (option.id === selectedAnswer) stateCls = "border-ticket bg-ticket/10";
                    else stateCls = "border-ink/10 opacity-50";
                  } else if (option.id === selectedAnswer) stateCls = "border-ticket bg-ticket/10";
                  return (
                    <button key={option.id} disabled={revealed} onClick={() => handleAnswer(option.id)}
                      className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
                      <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-mono font-semibold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{option.content}</span>
                      {revealed && option.id === currentQuestion.correctAnswer && <span>✅</span>}
                      {revealed && option.id === selectedAnswer && option.id !== currentQuestion.correctAnswer && <span>❌</span>}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <>
                <p className={`text-center mt-5 font-display text-lg ${selectedAnswer === currentQuestion.correctAnswer ? "text-teal" : "text-ticket"}`}>
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? `Chính xác! +${currentQuestion.points + Math.round((timeLeft / currentQuestion.timeLimit) * 40)} điểm 🎉`
                    : selectedAnswer === null ? "Hết giờ rồi! ⏰" : "Chưa đúng, quay tiếp nhé!"}
                </p>
                <AnswerExplain q={currentQuestion} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}