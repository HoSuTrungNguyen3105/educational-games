import { useCallback, useEffect, useRef, useState } from 'react'
import { timerColor } from '../shared.jsx'

const DIFFICULTY = {
  easy: { label: "Dễ", grid: 4, max: 50, icon: "🟢" },
  normal: { label: "Bình thường", grid: 5, max: 99, icon: "🟡" },
  hard: { label: "Khó", grid: 6, max: 199, icon: "🔴" },
}

const START_TIME = 30
const CORRECT_BONUS_TIME = 2
const WRONG_PENALTY_TIME = 2
const POINTS_PER_CORRECT = 100
const BEST_KEY = "find-number-best"

function generateRound(difficulty) {
  const { grid, max } = DIFFICULTY[difficulty]
  const total = grid * grid
  const nums = new Set()
  while (nums.size < total) nums.add(Math.floor(Math.random() * max) + 1)
  const arr = [...nums]
  const target = arr[Math.floor(Math.random() * arr.length)]
  return { grid: arr, target, rows: grid, cols: grid }
}

export default function FindNumberPlayScreen({ game, onFinish, onQuit }) {
  const [phase, setPhase] = useState("menu") // menu | playing | paused | gameover
  const [difficulty, setDifficulty] = useState("normal")
  const [round, setRound] = useState(null)
  const [timeLeft, setTimeLeft] = useState(START_TIME)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem(BEST_KEY) || "0", 10) } catch { return 0 }
  })
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState(null) // "correct" | "wrong" | null
  const [clickedCell, setClickedCell] = useState(null)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)
  const feedbackRef = useRef(null)
  const scoreRef = useRef(0)
  const correctRef = useRef(0)
  const bestRef = useRef(0)

  const newRound = useCallback((diff) => {
    const r = generateRound(diff || difficulty)
    setRound(r)
    setClickedCell(null)
    setFeedback(null)
  }, [difficulty])

  function startGame(diff) {
    setDifficulty(diff)
    setScore(0)
    setCombo(0)
    setCorrectCount(0)
    setTimeLeft(START_TIME)
    startTimeRef.current = Date.now()
    newRound(diff)
    setPhase("playing")
  }

  useEffect(() => {
    if (phase !== "playing") { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1
        if (next <= 0) { clearInterval(timerRef.current); setPhase("gameover"); return 0 }
        return next
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function handleCellClick(value, idx) {
    if (phase !== "playing" || feedback) return

    if (value === round.target) {
      const newCombo = combo + 1
      const earned = POINTS_PER_CORRECT + (newCombo - 1) * 25
      const newScore = score + earned
      const newTime = Math.min(timeLeft + CORRECT_BONUS_TIME, 60)
      setScore(newScore)
      setCombo(newCombo)
      setCorrectCount(c => c + 1)
      setTimeLeft(newTime)
      setFeedback("correct")
      setClickedCell(idx)

      clearTimeout(feedbackRef.current)
      feedbackRef.current = setTimeout(() => {
        newRound()
      }, 220)
    } else {
      setCombo(0)
      setTimeLeft(t => Math.max(0, t - WRONG_PENALTY_TIME))
      setFeedback("wrong")
      setClickedCell(idx)

      clearTimeout(feedbackRef.current)
      feedbackRef.current = setTimeout(() => {
        setFeedback(null)
        setClickedCell(null)
      }, 300)
    }
  }

  useEffect(() => {
    scoreRef.current = score
    correctRef.current = correctCount
    bestRef.current = bestScore
  }, [score, correctCount, bestScore])

  useEffect(() => {
    if (phase !== "gameover") return
    const finalScore = scoreRef.current
    const newBest = Math.max(bestRef.current, finalScore)
    setBestScore(newBest)
    try { localStorage.setItem(BEST_KEY, String(newBest)) } catch {}
    const timeUsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    onFinish({ score: finalScore, correct: correctRef.current, timeUsed })
  }, [phase])

  function togglePause() {
    if (phase === "playing") setPhase("paused")
    else if (phase === "paused") setPhase("playing")
  }

  function handleRestart() {
    setPhase("menu")
    setRound(null)
    setFeedback(null)
    setClickedCell(null)
  }

  const diff = DIFFICULTY[difficulty]
  const pct = (timeLeft / 60) * 100
  const timeCol = timerColor(pct)
  const cellSize = round && round.cols <= 4 ? "w-14 h-14 sm:w-16 sm:h-16 text-base sm:text-lg"
    : round && round.cols <= 5 ? "w-12 h-12 sm:w-14 sm:h-14 text-sm sm:text-base"
    : "w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm"

  if (phase === "menu") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8 bg-paper">
        <div className="note-card p-8 max-w-md w-full text-center anim-pop">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-display text-3xl text-ink mb-2">TÌM SỐ</h1>
          <p className="font-body text-sm text-ink/60 mb-8">Tìm con số cần tìm trong lưới số càng nhanh càng tốt!</p>

          <div className="space-y-3 mb-8">
            {Object.entries(DIFFICULTY).map(([key, d]) => (
              <button key={key} onClick={() => startGame(key)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-ink/12 hover:border-teal/60 transition font-body text-left group">
                <span className="text-2xl">{d.icon}</span>
                <div className="flex-1">
                  <div className="font-display text-base text-ink">{d.label}</div>
                  <div className="text-xs text-ink/50 font-mono">{d.grid}x{d.grid} · Số từ 1-{d.max}</div>
                </div>
                <span className="text-ink/30 group-hover:text-teal transition">▶</span>
              </button>
            ))}
          </div>

          {bestScore > 0 && (
            <div className="bg-gold/15 border border-gold/40 rounded-2xl px-5 py-3">
              <span className="font-display text-sm text-[#8a6a10]">🏆 Kỷ lục: {bestScore} điểm</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 bg-white border-b border-ink/10 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <h1 className="font-display text-xl text-ink">TÌM SỐ</h1>
        </div>
        <div className="flex items-center gap-5 text-sm text-ink/70 font-body flex-wrap">
          <span>Phòng: <b className="text-ink font-mono">{game.code}</b></span>
          <span className="hidden sm:inline">·</span>
          <span>⭐ {score}</span>
          <span className="hidden sm:inline">·</span>
          <span className={`font-mono font-semibold ${timeLeft <= 10 ? "text-ticket" : "text-ink/70"}`}>⏱ {timeLeft}s</span>
          <span className="hidden sm:inline">·</span>
          <span className="font-mono text-xs px-2 py-1 rounded-full" style={{
            background: combo > 0 ? "#1B998B22" : "transparent",
            color: combo > 0 ? "#1B998B" : "#8A7C63",
          }}>
            🔥 x{combo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePause}
            className="font-display text-sm border border-ink/20 rounded-2xl px-4 py-2 hover:bg-ink/5 transition text-ink/70">
            {phase === "paused" ? "▶ Tiếp tục" : "⏸ Tạm dừng"}
          </button>
          <button onClick={handleRestart}
            className="font-display text-sm border border-ticket/40 rounded-2xl px-4 py-2 hover:bg-ticket/5 transition text-ticket">
            🔄
          </button>
          <button onClick={onQuit}
            className="font-display text-sm border border-ticket/40 rounded-2xl px-4 py-2 hover:bg-ticket/5 transition text-ticket">
            Thoát
          </button>
        </div>
      </div>

      {phase === "paused" && (
        <div className="flex-1 flex flex-col items-center justify-center p-5">
          <div className="note-card p-8 text-center anim-pop">
            <div className="text-5xl mb-4">⏸</div>
            <h2 className="font-display text-2xl text-ink mb-2">Tạm dừng</h2>
            <p className="text-sm text-ink/60 mb-6">Nhấn tiếp tục để quay lại trò chơi</p>
            <button onClick={togglePause}
              className="font-display font-semibold px-8 py-3 rounded-full bg-gradient-to-b from-teal to-[#14806F] text-white shadow-[0_4px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.25)] transition">
              ▶ TIẾP TỤC
            </button>
          </div>
        </div>
      )}

      {phase === "playing" && round && (
        <div className="flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 gap-4">
          {/* Timer bar */}
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-ink/50 uppercase">{diff.label}</span>
              <span className="font-mono text-sm font-semibold" style={{ color: timeCol }}>{timeLeft}s</span>
            </div>
            <div className="w-full h-2.5 bg-ink/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width: `${pct}%`, background: timeCol }}></div>
            </div>
          </div>

          {/* Target display */}
          <div className={`note-card px-6 py-4 sm:px-8 sm:py-5 text-center anim-pop ${feedback === "correct" ? "ring-4 ring-teal bg-teal/10" : feedback === "wrong" ? "ring-4 ring-ticket bg-ticket/10 shake-hit" : ""}`}>
            <div className="text-xs font-mono text-ink/50 uppercase tracking-wider mb-1">Tìm số</div>
            <div className="font-display text-4xl sm:text-5xl text-ink font-bold" style={{ color: "#20283A" }}>
              {round.target}
            </div>
          </div>

          {/* Score + combo info */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono text-ink/60">⭐ {score}</span>
            {combo > 0 && (
              <span className="inline-flex items-center gap-1 bg-teal/15 text-teal font-mono text-xs px-3 py-1 rounded-full font-semibold">
                🔥 Combo x{combo} (+{(combo - 1) * 25} bonus)
              </span>
            )}
          </div>

          {/* Number grid */}
          <div className="grid gap-2 sm:gap-2.5" style={{
            gridTemplateColumns: `repeat(${round.cols}, minmax(0, 1fr))`,
          }}>
            {round.grid.map((num, i) => {
              const isTarget = num === round.target
              const isClicked = clickedCell === i
              let cellBg = "bg-white border-ink/12 hover:border-teal/50 hover:bg-teal/5"
              if (feedback === "correct" && isClicked) cellBg = "bg-teal border-teal text-white scale-110 shadow-lg"
              else if (feedback === "wrong" && isClicked) cellBg = "bg-ticket border-ticket text-white shake-hit"
              else if (feedback && isTarget && feedback === "correct") cellBg = "bg-teal/20 border-teal/40"
              else if (feedback && isTarget && feedback === "wrong") cellBg = "bg-gold/20 border-gold/40 animate-pulse"

              return (
                <button key={i} onClick={() => handleCellClick(num, i)}
                  disabled={!!feedback}
                  className={`${cellSize} ${cellBg} rounded-xl border-2 flex items-center justify-center font-mono font-semibold transition-all duration-150 active:scale-95 select-none`}>
                  {num}
                </button>
              )
            })}
          </div>

          <p className="text-xs text-ink/40 font-mono mt-1">Nhấn vào số <b className="text-ink/60">{round.target}</b> trong lưới</p>
        </div>
      )}

      {phase === "gameover" && (
        <div className="flex-1 flex flex-col items-center justify-center p-5">
          <div className="note-card p-8 max-w-md w-full text-center anim-pop">
            <div className="text-5xl mb-4">⏱️</div>
            <h2 className="font-display text-3xl text-ink mb-2">Hết giờ!</h2>
            <div className="space-y-2 my-6">
              <p className="font-display text-xl text-teal">⭐ {score} điểm</p>
              <p className="font-body text-sm text-ink/60">Tìm đúng: <b className="text-ink">{correctCount}</b> số</p>
              {score >= bestScore && score > 0 && (
                <p className="font-display text-sm text-gold">🏆 Kỷ lục mới!</p>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => startGame(difficulty)}
                className="font-display font-semibold px-6 py-3 rounded-full bg-gradient-to-b from-teal to-[#14806F] text-white shadow-[0_4px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.25)] transition">
                🔄 Chơi lại
              </button>
              <button onClick={() => setPhase("menu")}
                className="font-display font-semibold px-6 py-3 rounded-full border-2 border-ink/20 text-ink hover:bg-ink/5 transition">
                📋 Đổi cấp độ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
