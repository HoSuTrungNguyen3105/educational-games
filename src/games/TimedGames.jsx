import { useMemo, useState, useEffect, useRef, Fragment } from 'react'
import { useTimedQuestion, usePlayerNames } from '../lib/hooks.js'
import { PlayHeader, AnswerExplain, timerColor } from './shared.jsx'
import OptionButton from '../components/OptionButton.jsx'

/* ---------------------- WHACK-A-MOLE ---------------------- */

export function WhackAMolePlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const moleHoles = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const answerHoles = useMemo(() => {
    const holes = [...moleHoles].sort(() => Math.random() - 0.5).slice(0, q.options.length);
    return q.options.map((o, i) => ({ ...o, hole: holes[i] }));
  }, [q.id]);

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <PlayHeader icon="🔨" title="ĐẬP CHUỘT NHANH TAY" accent="#F4B942" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8">
        <div className="note-card p-5 max-w-xl w-full mb-6 text-center">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Đập vào con chuột có đáp án đúng!</span>
          <h2 className="font-display text-xl sm:text-2xl text-ink mt-2">{q.content}</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl w-full">
          {moleHoles.map(hole => {
            const opt = answerHoles.find(a => a.hole === hole);
            let stateCls = "";
            if (revealed && opt) {
              stateCls = opt.id === q.correctAnswer ? "ring-4 ring-teal scale-105" : opt.id === selected ? "ring-4 ring-ticket opacity-60" : "opacity-40";
            } else if (opt && opt.id === selected) stateCls = "ring-4 ring-ticket";
            return (
              <button key={hole} disabled={!opt || revealed} onClick={() => opt && handleAnswer(opt.id)}
                className={`relative aspect-square rounded-[40%] bg-gradient-to-b from-[#8B6339] to-[#5C4023] flex items-center justify-center overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.25)] transition ${stateCls}`}>
                <div className="absolute inset-x-2 bottom-0 h-3 bg-black/30 rounded-t-full"></div>
                {opt ? (
                  <div className={`relative z-10 flex flex-col items-center justify-center px-2 py-3 anim-pop`}>
                    <span className="text-3xl mb-1">🐹</span>
                    <span className="font-body text-[11px] sm:text-xs text-white text-center bg-black/40 rounded-lg px-2 py-1 leading-tight">{opt.content}</span>
                    {revealed && opt.id === q.correctAnswer && <span className="absolute -top-2 -right-2 text-lg">✅</span>}
                    {revealed && opt.id === selected && opt.id !== q.correctAnswer && <span className="absolute -top-2 -right-2 text-lg">❌</span>}
                  </div>
                ) : <span className="text-2xl opacity-30">🕳️</span>}
              </button>
            );
          })}
        </div>
        {revealed && (
          <>
          <p className={`text-center mt-6 font-display text-lg ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
            {selected === q.correctAnswer ? "Đập trúng rồi! 🎉" : selected === null ? "Hết giờ! ⏰" : "Trật rồi 😅"}
          </p>
          <AnswerExplain q={q} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- SPACE SHIP ---------------------- */

export function SpaceShipPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const progress = ((idx + (revealed ? 1 : 0)) / total) * 88;
  const stars = useMemo(() => Array.from({ length: 40 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 0.5, o: Math.random() * 0.6 + 0.3 })), []);

  return (
    <div className="flex-1 flex flex-col bg-[#0B1330]">
      <PlayHeader icon="🚀" title="PHI THUYỀN VŨ TRỤ" accent="#7CE0FF" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 grid lg:grid-cols-[1.3fr_1fr] gap-5 p-5 md:p-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10" style={{ background: "radial-gradient(120% 160% at 20% 0%, #1B2A5E 0%, #0B1330 60%)" }}>
          {stars.map((s, i) => <div key={i} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}></div>)}
          <div className="absolute right-6 top-6 text-4xl">🪐</div>
          <div className="absolute left-8 bottom-10 text-2xl opacity-70">🌕</div>
          <div className="absolute bottom-10 transition-all duration-700 ease-out" style={{ left: `calc(6% + ${progress}%)` }}>
            <div className="text-5xl -rotate-45 float-slow">🚀</div>
          </div>
          <div className="absolute left-6 right-6 bottom-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7CE0FF] to-[#F4B942] transition-all duration-700" style={{ width: `${progress + 6}%` }}></div>
          </div>
          <div className="absolute top-6 left-6 text-white/70 font-mono text-xs">Hành trình: {Math.round(progress)}%</div>
        </div>

        <div className="note-card p-6 flex flex-col">
          <span className="inline-flex items-center gap-2 self-start bg-[#7CE0FF]/20 text-[#0B1330] font-display text-xs font-semibold uppercase px-4 py-2 rounded-full mb-4">
            🛰️ Nhiệm vụ khoa học
          </span>
          <p className="font-display text-lg sm:text-xl text-ink mb-6">{q.content}</p>
          <div className="space-y-3 mt-auto">
            {q.options.map((o, i) => {
              let stateCls = "border-ink/12 hover:border-[#1B2A5E]/40";
              if (revealed) {
                if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10";
                else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
                else stateCls = "border-ink/10 opacity-50";
              } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
              return (
                <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                  className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
                  <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{o.content}</span>
                  {revealed && o.id === q.correctAnswer && <span>🌟</span>}
                </button>
              );
            })}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Đẩy phi thuyền bay xa hơn! 🚀" : "Phi thuyền khựng lại một chút..."}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- BALLOON POP ---------------------- */

export function BalloonPopPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const colors = ["#FF6F91", "#7CC6FF", "#F4B942", "#4CAF7D", "#B58AFF"];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#DDF3FF] to-paper">
      <PlayHeader icon="🎈" title="BÓNG BAY TRI THỨC" accent="#1B998B" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8">
        <div className="note-card p-5 max-w-xl w-full mb-8 text-center">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Chọn bóng bay có đáp án đúng để thổi bay lên trời</span>
          <h2 className="font-display text-xl sm:text-2xl text-ink mt-2">{q.content}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 max-w-2xl">
          {q.options.map((o, i) => {
            let ring = colors[i % colors.length];
            let extraCls = "";
            if (revealed) {
              if (o.id === q.correctAnswer) extraCls = "translate-y-[-40px] opacity-0";
              else if (o.id === selected) extraCls = "scale-75 opacity-30";
              else extraCls = "opacity-40";
            }
            return (
              <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                className={`flex flex-col items-center transition-all duration-700 ${extraCls}`}>
                <div className="relative float-slow" style={{ animationDelay: `${i * 0.3}s` }}>
                  <svg width="88" height="106" viewBox="0 0 88 106">
                    <ellipse cx="44" cy="44" rx="40" ry="44" fill={ring} opacity="0.9" />
                    <ellipse cx="30" cy="28" rx="10" ry="14" fill="white" opacity="0.35" />
                    <polygon points="40,86 48,86 44,98" fill={ring} />
                    <line x1="44" y1="98" x2="44" y2="106" stroke="#8A7C63" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-body text-white text-xs sm:text-sm font-semibold text-center px-4 leading-tight">{o.content}</span>
                </div>
                {revealed && o.id === q.correctAnswer && <span className="mt-2 text-xl">✅</span>}
                {revealed && o.id === selected && o.id !== q.correctAnswer && <span className="mt-2 text-xl">❌</span>}
              </button>
            );
          })}
        </div>
        {revealed && (
          <>
          <p className={`text-center mt-6 font-display text-lg ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
            {selected === q.correctAnswer ? "Bóng bay lên trời rồi! 🎈" : selected === null ? "Hết giờ! ⏰" : "Chưa đúng, thử câu sau nhé!"}
          </p>
          <AnswerExplain q={q} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- DART THROW ---------------------- */

export function DartThrowPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <PlayHeader icon="🎯" title="NÉM PHI TIÊU TRÚNG ĐÍCH" accent="#E4572E" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 grid lg:grid-cols-[1fr_1.2fr] gap-5 p-5 md:p-8 items-center">
        <div className="flex items-center justify-center">
          <svg width="260" height="260" viewBox="0 0 260 260" className="drop-shadow-[0_6px_0_rgba(0,0,0,0.08)]">
            <circle cx="130" cy="130" r="126" fill="#E4572E" />
            <circle cx="130" cy="130" r="98" fill="#FFFBF2" />
            <circle cx="130" cy="130" r="70" fill="#E4572E" />
            <circle cx="130" cy="130" r="42" fill="#FFFBF2" />
            <circle cx="130" cy="130" r="16" fill="#F4B942" />
            {revealed && (
              <text x="130" y="140" textAnchor="middle" fontSize="30">{selected === q.correctAnswer ? "🎯" : "💨"}</text>
            )}
          </svg>
        </div>
        <div className="note-card p-6">
          <p className="font-display text-lg sm:text-xl text-ink mb-6 text-center">{q.content}</p>
          <div className="grid gap-3">
            {q.options.map((o, i) => {
              let stateCls = "border-ink/12 hover:border-ticket/40";
              if (revealed) {
                if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10";
                else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
                else stateCls = "border-ink/10 opacity-50";
              } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
              return (
                <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                  className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
                  <span className="text-lg">🎯</span>
                  <span className="flex-1">{o.content}</span>
                  {revealed && o.id === q.correctAnswer && <span>✓</span>}
                </button>
              );
            })}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Trúng hồng tâm! 🎯" : "Lệch mục tiêu rồi!"}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- SAILING BOAT (team-style progress) ---------------------- */

export function SailingBoatPlayScreen({ game, questions, playerName, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const progress = ((idx + (revealed ? 1 : 0)) / total) * 85;
  const opponentNames = usePlayerNames().slice(0, 3).map(p => (p.split(" ").slice(-1)[0] || "Bạn"));

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#CFEFFA] to-[#8FD3EE]">
      <PlayHeader icon="⛵" title="THUYỀN BUỒM RA KHƠI" accent="#0E5C73" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col gap-5 p-5 md:p-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/40 h-40 sm:h-48" style={{ background: "linear-gradient(180deg, #BEE7F5 0%, #4FA6C4 100%)" }}>
          <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 2px, transparent 2px 26px)" }}></div>
          <div className="absolute bottom-4 text-5xl transition-all duration-700" style={{ left: `calc(4% + ${progress}%)` }}>⛵</div>
          <div className="absolute right-6 bottom-4 text-3xl">🏝️</div>
          <div className="absolute top-4 left-6 text-white font-mono text-xs bg-black/20 rounded-full px-3 py-1">Đã đi: {Math.round(progress)}%</div>
        </div>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-5 flex-1">
          <div className="note-card p-6">
            <p className="font-display text-lg sm:text-xl text-ink mb-6">{q.content}</p>
            <div className="grid gap-3">
              {q.options.map((o, i) => {
                let stateCls = "border-ink/12 hover:border-[#0E5C73]/40";
                if (revealed) {
                  if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10";
                  else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
                  else stateCls = "border-ink/10 opacity-50";
                } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
                return (
                  <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                    className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
                    <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{o.content}</span>
                    {revealed && o.id === q.correctAnswer && <span>⛵</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="note-card p-6 flex flex-col">
            <span className="text-xs font-mono text-[#8A7C63] uppercase mb-3">Cả đội đang chèo</span>
            <div className="space-y-3">
              {[playerName || "Bạn", ...opponentNames].map((n, i) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="text-lg">⛵</span>
                  <span className="text-sm font-body text-ink flex-1">{n}{i === 0 && <span className="text-[#0E5C73] font-semibold"> (bạn)</span>}</span>
                  <div className="w-24 h-2 bg-ink/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0E5C73] transition-all duration-700" style={{ width: `${i === 0 ? progress : Math.min(90, progress * (0.5 + Math.random() * 0.7))}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            {revealed && (
              <>
              <p className={`text-center mt-auto pt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
                {selected === q.correctAnswer ? "Thuyền lướt nhanh về phía trước! ⛵" : "Sóng cản một chút, cố lên!"}
              </p>
              <AnswerExplain q={q} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- MOON LANTERN (seasonal) ---------------------- */

export function MoonLanternPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const litCount = Math.min(total, questions.filter((qq, i) => i < idx || (i === idx && revealed && selected === q.correctAnswer)).length);

  return (
    <div className="flex-1 flex flex-col" style={{ background: "radial-gradient(120% 140% at 50% 0%, #2A2359 0%, #150F33 60%)" }}>
      <PlayHeader icon="🏮" title="RƯỚC ĐÈN TRUNG THU" accent="#F4B942" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center p-5 md:p-8">
        <div className="text-5xl mb-1">🌕</div>
        <div className="flex gap-3 mb-8">
          {questions.map((qq, i) => (
            <span key={qq.id} className={`text-2xl transition-opacity ${i < litCount ? "opacity-100" : "opacity-25"}`}>🏮</span>
          ))}
        </div>
        <div className="note-card p-6 max-w-lg w-full">
          <p className="font-display text-lg sm:text-xl text-ink mb-6 text-center">{q.content}</p>
          <div className="grid gap-3">
            {q.options.map((o, i) => {
              let stateCls = "border-ink/12 hover:border-gold/60";
              if (revealed) {
                if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10";
                else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
                else stateCls = "border-ink/10 opacity-50";
              } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
              return (
                <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                  className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
                  <span className="text-lg">🏮</span>
                  <span className="flex-1">{o.content}</span>
                  {revealed && o.id === q.correctAnswer && <span>✓</span>}
                </button>
              );
            })}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Thắp sáng thêm một chiếc đèn! 🏮" : "Đèn chưa sáng, cố lên nào!"}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- TREASURE MAP ---------------------- */

export function TreasureMapPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const stopIcons = ["🏕️", "🌴", "⛰️", "🏜️", "🗿", "💎"];

  return (
    <div className="flex-1 flex flex-col bg-[#F3E4C1]">
      <PlayHeader icon="🗺️" title="BẢN ĐỒ KHO BÁU" accent="#8a6a10" code={game.code}
        progressLabel={`Chặng: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center p-5 md:p-8">
        <div className="flex items-center gap-2 sm:gap-4 mb-8 overflow-x-auto max-w-full px-2">
          {questions.map((qq, i) => (
            <Fragment key={qq.id}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl border-2 flex-shrink-0
                ${i < idx || (i === idx && revealed && selected === q.correctAnswer) ? "bg-gold border-gold" : i === idx ? "bg-white border-ticket" : "bg-white/60 border-[#c8b183]"}`}>
                {i === total - 1 ? "💎" : stopIcons[i % stopIcons.length]}
              </div>
              {i < questions.length - 1 && <div className="w-6 sm:w-10 h-1 rounded-full bg-[#c8b183] flex-shrink-0"></div>}
            </Fragment>
          ))}
        </div>
        <div className="note-card p-6 max-w-lg w-full border-2 border-dashed border-[#c8b183]">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Giải đố để mở khóa chặng tiếp theo</span>
          <p className="font-display text-lg sm:text-xl text-ink mt-2 mb-6">{q.content}</p>
          <div className="grid gap-3">
            {q.options.map((o, i) => {
              let stateCls = "border-ink/12 hover:border-[#8a6a10]/40";
              if (revealed) {
                if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10";
                else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
                else stateCls = "border-ink/10 opacity-50";
              } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
              return (
                <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                  className={`w-full text-left flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition font-body ${stateCls}`}>
                  <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{o.content}</span>
                  {revealed && o.id === q.correctAnswer && <span>🔓</span>}
                </button>
              );
            })}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Mở khóa chặng tiếp theo! 🗝️" : "Ổ khóa chưa mở, thử chặng sau nhé!"}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- SORTING GAME ---------------------- */

export function SortingGamePlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const binColors = ["#4CAF7D", "#F4B942", "#7CC6FF", "#B58AFF"];

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <PlayHeader icon="🗂️" title="PHÂN LOẠI ĐÚNG CHỖ" accent="#1B998B" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center p-5 md:p-8">
        <div className="note-card p-5 max-w-xl w-full mb-8 text-center">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Đưa thẻ vào đúng ngăn phân loại</span>
          <h2 className="font-display text-xl sm:text-2xl text-ink mt-2">{q.content}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-3xl w-full">
          {q.options.map((o, i) => {
            let stateCls = "border-ink/12 hover:-translate-y-1";
            if (revealed) {
              if (o.id === q.correctAnswer) stateCls = "border-teal bg-teal/10 -translate-y-1";
              else if (o.id === selected) stateCls = "border-ticket bg-ticket/10";
              else stateCls = "border-ink/10 opacity-40";
            } else if (o.id === selected) stateCls = "border-ticket bg-ticket/5";
            const c = binColors[i % binColors.length];
            return (
              <button key={o.id} disabled={revealed} onClick={() => handleAnswer(o.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 bg-white transition ${stateCls}`}>
                <div className="w-14 h-12 rounded-b-xl rounded-t-sm flex items-center justify-center text-2xl" style={{ background: c + "33", border: `2px solid ${c}` }}>🗃️</div>
                <span className="font-body text-sm text-center text-ink">{o.content}</span>
                {revealed && o.id === q.correctAnswer && <span>✅</span>}
                {revealed && o.id === selected && o.id !== q.correctAnswer && <span>❌</span>}
              </button>
            );
          })}
        </div>
        {revealed && (
          <>
          <p className={`text-center mt-6 font-display text-lg ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
            {selected === q.correctAnswer ? "Đúng ngăn rồi! 🗂️" : selected === null ? "Hết giờ! ⏰" : "Chưa đúng ngăn, thử lại ở câu sau!"}
          </p>
          <AnswerExplain q={q} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- WORD SCRAMBLE ---------------------- */

export function WordScramblePlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const correctOption = q.options.find(o => o.id === q.correctAnswer);
  const scrambledLetters = useMemo(() => {
    const letters = (correctOption ? correctOption.content : "").replace(/\s/g, "").split("");
    return letters.map((ch, i) => ({ ch, id: i })).sort(() => Math.random() - 0.5);
  }, [q.id]);

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <PlayHeader icon="🔤" title="XẾP CHỮ KỲ DIỆU" accent="#FF6F91" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8">
        <div className="note-card p-6 max-w-xl w-full text-center mb-6">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Gợi ý</span>
          <h2 className="font-display text-lg sm:text-xl text-ink mt-2 mb-5">{q.content}</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {scrambledLetters.map(l => (
              <span key={l.id} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-pink/15 border-2 border-pink/40 flex items-center justify-center font-display text-lg text-ink uppercase">{l.ch}</span>
            ))}
          </div>
          <p className="text-xs text-[#B7A987] mt-2 font-mono">Sắp xếp những chữ cái trên thành đáp án đúng bên dưới</p>
        </div>
        <div className="grid gap-3 max-w-xl w-full">
          {q.options.map((o, i) => (
            <OptionButton key={o.id} o={o} i={i} revealed={revealed} selected={selected} correctId={q.correctAnswer}
              onSelect={handleAnswer} hover="border-ink/12 hover:border-pink/50" correctMark="✓" contentCls="uppercase tracking-wide" />
          ))}
        </div>
        {revealed && (
          <>
          <p className={`text-center mt-6 font-display text-lg ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
            {selected === q.correctAnswer ? "Xếp đúng chữ rồi! 🔤" : "Chưa đúng thứ tự, thử câu sau nhé!"}
          </p>
          <AnswerExplain q={q} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- MEMORY MATCH ---------------------- */

export function MemoryMatchPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const [flipped, setFlipped] = useState({});
  useEffect(() => { setFlipped({}); }, [q.id]);

  const flip = (optId) => {
    if (revealed) return;
    setFlipped(f => ({ ...f, [optId]: true }));
    setTimeout(() => handleAnswer(optId), 350);
  };

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <PlayHeader icon="🃏" title="LẬT THẺ TRÍ NHỚ" accent="#FF6F91" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8">
        <div className="note-card p-5 max-w-xl w-full mb-8 text-center">
          <span className="text-xs font-mono text-[#8A7C63] uppercase">Lật thẻ có đáp án đúng</span>
          <h2 className="font-display text-xl sm:text-2xl text-ink mt-2">{q.content}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xl w-full" style={{ perspective: 800 }}>
          {q.options.map((o) => {
            const isFlipped = !!flipped[o.id] || revealed;
            let borderCls = "border-ink/15";
            if (revealed) {
              if (o.id === q.correctAnswer) borderCls = "border-teal";
              else if (o.id === selected) borderCls = "border-ticket";
            }
            return (
              <button key={o.id} disabled={revealed} onClick={() => flip(o.id)}
                className="relative h-28 sm:h-32" style={{ transformStyle: "preserve-3d", transition: "transform .5s", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                <div className={`absolute inset-0 rounded-2xl border-2 flex items-center justify-center bg-gradient-to-br from-pink/20 to-gold/20 ${borderCls}`} style={{ backfaceVisibility: "hidden" }}>
                  <span className="text-4xl">❓</span>
                </div>
                <div className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 bg-white px-2 ${borderCls}`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <span className="font-body text-sm text-ink text-center leading-tight">{o.content}</span>
                  {revealed && o.id === q.correctAnswer && <span>✅</span>}
                  {revealed && o.id === selected && o.id !== q.correctAnswer && <span>❌</span>}
                </div>
              </button>
            );
          })}
        </div>
        {revealed && (
          <>
          <p className={`text-center mt-6 font-display text-lg ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
            {selected === q.correctAnswer ? "Lật đúng thẻ rồi! 🃏" : selected === null ? "Hết giờ! ⏰" : "Chưa đúng, thử câu sau nhé!"}
          </p>
          <AnswerExplain q={q} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- HERO ADVENTURE (platformer-style) ---------------------- */

export function HeroAdventurePlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const [coins, setCoins] = useState(0);
  const [stumble, setStumble] = useState(false);
  const prevRevealed = useRef(false);

  useEffect(() => {
    if (revealed && !prevRevealed.current) {
      if (selected === q.correctAnswer) setCoins(c => c + 1);
      else { setStumble(true); setTimeout(() => setStumble(false), 400); }
    }
    prevRevealed.current = revealed;
  }, [revealed]);

  const progress = ((idx + (revealed ? 1 : 0)) / total) * 88;
  const platforms = useMemo(() => Array.from({ length: 6 }, (_, i) => 10 + i * 16), []);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#9FD8F5] to-[#EAF6FF]">
      <PlayHeader icon="🦸" title="ANH HÙNG PHIÊU LƯU" accent="#E4572E" code={game.code}
        progressLabel={`Chặng: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit}
        extra={<span>🪙 {coins}</span>} />
      <div className="flex-1 grid lg:grid-cols-[1.3fr_1fr] gap-5 p-5 md:p-8">
        <div className={`relative rounded-3xl overflow-hidden border border-white/40 h-56 sm:h-64 ${stumble ? "shake-hit" : ""}`}
          style={{ background: "linear-gradient(180deg, #BFE8FF 0%, #EAF6FF 70%, #C9E9A6 100%)" }}>
          <div className="absolute top-4 left-6 text-3xl opacity-70">☁️</div>
          <div className="absolute top-10 right-10 text-2xl opacity-60">☁️</div>
          <div className="absolute right-6 bottom-8 text-4xl">🏁</div>
          {platforms.map((p, i) => (
            <div key={i} className="absolute bottom-4 w-10 h-3 rounded-full bg-[#8B6339]/50" style={{ left: `${p}%` }}></div>
          ))}
          <div className="absolute bottom-6 transition-all duration-700 ease-out" style={{ left: `calc(4% + ${progress}%)` }}>
            <span className={`text-5xl inline-block ${revealed && selected === q.correctAnswer ? "run-cycle" : ""} ${revealed && selected !== q.correctAnswer && selected !== undefined ? "" : "bob-hero"}`}>🦸</span>
          </div>
          <div className="absolute left-6 right-6 bottom-2 h-1.5 rounded-full bg-white/40 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-gold to-ticket transition-all duration-700" style={{ width: `${progress + 6}%` }}></div>
          </div>
          <div className="absolute top-4 right-6 text-ink/70 font-mono text-xs bg-white/60 rounded-full px-3 py-1">Hành trình: {Math.round(progress)}%</div>
        </div>

        <div className="note-card p-6 flex flex-col">
          <span className="inline-flex items-center gap-2 self-start bg-ticket/15 text-ticket font-display text-xs font-semibold uppercase px-4 py-2 rounded-full mb-4">
            🚧 Thử thách vượt chướng ngại vật
          </span>
          <p className="font-display text-lg sm:text-xl text-ink mb-6">{q.content}</p>
          <div className="space-y-3 mt-auto">
            {q.options.map((o, i) => (
              <OptionButton key={o.id} o={o} i={i} revealed={revealed} selected={selected} correctId={q.correctAnswer}
                onSelect={handleAnswer} hover="border-ink/12 hover:border-ticket/40" correctMark="🪙" />
            ))}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Nhảy qua chướng ngại vật, +1 xu! 🪙" : "Vấp phải chướng ngại vật, cố lên nào!"}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- NINJA DASH (endless-runner-style) ---------------------- */

export function NinjaDashPlayScreen({ game, questions, onFinish, onQuit }) {
  const { idx, q, timeLeft, selected, revealed, score, handleAnswer, total } = useTimedQuestion(questions, onFinish);
  const pct = (timeLeft / q.timeLimit) * 100;
  const timeColor = timerColor(pct);
  const [jumping, setJumping] = useState(false);
  const prevRevealed = useRef(false);

  useEffect(() => {
    if (revealed && !prevRevealed.current && selected === q.correctAnswer) {
      setJumping(true);
      setTimeout(() => setJumping(false), 500);
    }
    prevRevealed.current = revealed;
  }, [revealed]);

  const obstacleIcons = ["🌵", "🪨", "🔥", "🧱"];

  return (
    <div className="flex-1 flex flex-col" style={{ background: "linear-gradient(180deg, #1D2E4A 0%, #16233A 60%, #0F172A 100%)" }}>
      <PlayHeader icon="🥷" title="NINJA VƯỢT CHƯỚNG NGẠI" accent="#F4B942" code={game.code}
        progressLabel={`Câu hỏi: ${idx + 1}/${total}`} timeLeft={timeLeft} timeColor={timeColor} score={score} onQuit={onQuit} />
      <div className="flex-1 flex flex-col items-center p-5 md:p-8 gap-6">
        <div className="relative w-full max-w-2xl h-32 rounded-3xl overflow-hidden border border-white/10" style={{ background: "linear-gradient(180deg, #223154 0%, #16233A 100%)" }}>
          <div className="absolute inset-x-0 bottom-0 h-6" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(244,185,66,0.35) 0 18px, transparent 18px 36px)" }}></div>
          <div className="absolute bottom-6 left-10">
            <span className={`text-5xl inline-block transition-transform duration-500 ${jumping ? "-translate-y-8" : ""}`}>🥷</span>
          </div>
          {obstacleIcons.map((ic, i) => (
            <span key={i} className="absolute bottom-6 text-2xl opacity-70" style={{ right: `${10 + i * 22}%` }}>{ic}</span>
          ))}
          <div className="absolute top-3 left-4 text-white/60 font-mono text-xs">Câu {idx + 1}/{total}</div>
        </div>

        <div className="note-card p-6 max-w-xl w-full">
          <p className="font-display text-lg sm:text-xl text-ink mb-6 text-center">{q.content}</p>
          <div className="grid gap-3">
            {q.options.map((o, i) => (
              <OptionButton key={o.id} o={o} i={i} revealed={revealed} selected={selected} correctId={q.correctAnswer}
                onSelect={handleAnswer} hover="border-ink/12 hover:border-gold/60" correctMark="🥷" />
            ))}
          </div>
          {revealed && (
            <>
            <p className={`text-center mt-4 font-display ${selected === q.correctAnswer ? "text-teal" : "text-ticket"}`}>
              {selected === q.correctAnswer ? "Bật nhảy qua chướng ngại vật! 🥷" : selected === null ? "Hết giờ, va phải chướng ngại vật! ⏰" : "Va phải chướng ngại vật rồi!"}
            </p>
            <AnswerExplain q={q} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}