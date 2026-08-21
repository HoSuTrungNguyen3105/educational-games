import { useState, useEffect, useCallback, useRef } from 'react'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  return null
}

function isDraw(board) {
  return board.every(c => c !== null)
}

function getEmpty(board) {
  return board.reduce((acc, c, i) => c === null ? [...acc, i] : acc, [])
}

// AI: Easy - random move
function aiEasy(board) {
  const empty = getEmpty(board)
  return empty[Math.floor(Math.random() * empty.length)]
}

// AI: Medium - prioritize win, block, center, corners
function aiMedium(board, aiSymbol) {
  const humanSymbol = aiSymbol === 'X' ? 'O' : 'X'
  const empty = getEmpty(board)

  // Check for immediate win
  for (const i of empty) {
    const test = [...board]
    test[i] = aiSymbol
    if (checkWinner(test)) return i
  }

  // Block opponent win
  for (const i of empty) {
    const test = [...board]
    test[i] = humanSymbol
    if (checkWinner(test)) return i
  }

  // Prefer center
  if (board[4] === null) return 4

  // Prefer corners
  const corners = [0, 2, 6, 8].filter(i => board[i] === null)
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)]

  // Any available
  return empty[Math.floor(Math.random() * empty.length)]
}

// AI: Hard - minimax (unbeatable)
function aiHard(board, aiSymbol) {
  const humanSymbol = aiSymbol === 'X' ? 'O' : 'X'

  function minimax(b, isMax, depth) {
    const result = checkWinner(b)
    if (result) return result.winner === aiSymbol ? 10 - depth : depth - 10
    if (isDraw(b)) return 0

    const empty = getEmpty(b)
    if (isMax) {
      let best = -Infinity
      for (const i of empty) {
        b[i] = aiSymbol
        best = Math.max(best, minimax(b, false, depth + 1))
        b[i] = null
      }
      return best
    } else {
      let best = Infinity
      for (const i of empty) {
        b[i] = humanSymbol
        best = Math.min(best, minimax(b, true, depth + 1))
        b[i] = null
      }
      return best
    }
  }

  const empty = getEmpty(board)
  let bestScore = -Infinity
  let bestMove = empty[0]

  for (const i of empty) {
    board[i] = aiSymbol
    const score = minimax(board, false, 0)
    board[i] = null
    if (score > bestScore) {
      bestScore = score
      bestMove = i
    }
  }
  return bestMove
}

function getAIMove(board, difficulty, aiSymbol) {
  switch (difficulty) {
    case 'easy': return aiEasy(board)
    case 'medium': return aiMedium(board, aiSymbol)
    case 'hard': return aiHard([...board], aiSymbol)
    default: return aiEasy(board)
  }
}

function loadStats() {
  try {
    const raw = localStorage.getItem('tic-tac-toe-stats')
    return raw ? JSON.parse(raw) : { wins: 0, losses: 0, draws: 0 }
  } catch { return { wins: 0, losses: 0, draws: 0 } }
}

function saveStats(stats) {
  try { localStorage.setItem('tic-tac-toe-stats', JSON.stringify(stats)) } catch {}
}

export default function TicTacToe({ game, onFinish, onQuit }) {
  const [screen, setScreen] = useState('menu') // menu | playing
  const [mode, setMode] = useState(null)       // 'ai' | 'pvp'
  const [difficulty, setDifficulty] = useState('medium')
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [result, setResult] = useState(null)   // { winner, line } | { draw: true }
  const [stats, setStats] = useState(loadStats)
  const [gameOver, setGameOver] = useState(false)
  const aiThinking = useRef(false)

  const aiSymbol = 'O'
  const humanSymbol = 'X'

  useEffect(() => { saveStats(stats) }, [stats])

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setResult(null)
    setGameOver(false)
    aiThinking.current = false
  }, [])

  const handleCellClick = useCallback((idx) => {
    if (board[idx] || gameOver || result) return

    const newBoard = [...board]
    const currentSymbol = isXNext ? 'X' : 'O'
    newBoard[idx] = currentSymbol

    const winResult = checkWinner(newBoard)
    if (winResult) {
      setBoard(newBoard)
      setResult(winResult)
      setGameOver(true)
      if (mode === 'ai') {
        const isAI = winResult.winner === aiSymbol
        setStats(s => ({
          wins: s.wins + (winResult.winner === humanSymbol ? 1 : 0),
          losses: s.losses + (isAI ? 1 : 0),
          draws: s.draws,
        }))
      }
      return
    }

    if (isDraw(newBoard)) {
      setBoard(newBoard)
      setResult({ draw: true })
      setGameOver(true)
      if (mode === 'ai') {
        setStats(s => ({ ...s, draws: s.draws + 1 }))
      }
      return
    }

    setBoard(newBoard)
    setIsXNext(!isXNext)
  }, [board, isXNext, gameOver, result, mode])

  // AI auto-play
  useEffect(() => {
    if (mode !== 'ai' || gameOver || result || isXNext) return
    if (aiThinking.current) return
    aiThinking.current = true

    const timer = setTimeout(() => {
      const move = getAIMove([...board], difficulty, aiSymbol)
      if (move !== undefined && move !== null) {
        handleCellClick(move)
      }
      aiThinking.current = false
    }, 400)

    return () => clearTimeout(timer)
  }, [isXNext, mode, gameOver, result, board, difficulty, handleCellClick])

  const handleFinish = useCallback(() => {
    if (!onFinish) return
    const wins = mode === 'ai' ? stats.wins : 0
    onFinish({ score: wins * 100, correct: wins, timeUsed: 0 })
  }, [onFinish, mode, stats.wins])

  // ── MENU ──
  if (screen === 'menu') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper px-4 py-8">
        <div className="anim-pop note-card p-8 sm:p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌⭕</div>
          <h1 className="font-display text-3xl text-ink mb-2">
            <span style={{ color: '#1B998B' }}>TIC</span>–
            <span style={{ color: '#E4572E' }}>TAC</span>–
            <span style={{ color: '#F4B942' }}>TOE</span>
          </h1>
          <p className="font-body text-ink/60 mb-8">Chọn chế độ chơi</p>

          <div className="space-y-3">
            <button
              onClick={() => { setMode('ai'); setScreen('difficulty'); }}
              className="w-full py-4 rounded-2xl font-display text-lg border-2 transition hover:shadow-lg"
              style={{ borderColor: '#1B998B', color: '#1B998B', background: '#1B998B10' }}
            >
              🤖 Chơi với Máy
            </button>
            <button
              onClick={() => { setMode('pvp'); setScreen('playing'); resetGame(); }}
              className="w-full py-4 rounded-2xl font-display text-lg border-2 transition hover:shadow-lg"
              style={{ borderColor: '#E4572E', color: '#E4572E', background: '#E4572E10' }}
            >
              👥 Hai Người Chơi
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 dash-rule pt-5">
            <p className="font-display text-sm text-ink/50 mb-3 uppercase tracking-wide">Thống kê (AI)</p>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold" style={{ color: '#1B998B' }}>{stats.wins}</div>
                <div className="font-body text-xs text-ink/50">Thắng</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold" style={{ color: '#E4572E' }}>{stats.losses}</div>
                <div className="font-body text-xs text-ink/50">Thua</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold" style={{ color: '#F4B942' }}>{stats.draws}</div>
                <div className="font-body text-xs text-ink/50">Hòa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── DIFFICULTY SELECT ──
  if (screen === 'difficulty') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper px-4 py-8">
        <div className="anim-pop note-card p-8 sm:p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="font-display text-2xl text-ink mb-2">Chọn độ khó</h2>
          <p className="font-body text-ink/60 mb-8">Bạn sẽ chơi quân X, máy chơi quân O</p>

          <div className="space-y-3">
            {[
              { key: 'easy', label: 'Dễ', desc: 'Máy đi ngẫu nhiên', icon: '😊', color: '#1B998B' },
              { key: 'medium', label: 'Trung bình', desc: 'Máy chặn & thắng thông minh', icon: '🤔', color: '#F4B942' },
              { key: 'hard', label: 'Khó', desc: 'Minimax — gần như bất bại', icon: '🧠', color: '#E4572E' },
            ].map(d => (
              <button
                key={d.key}
                onClick={() => { setDifficulty(d.key); setScreen('playing'); resetGame(); }}
                className="w-full flex items-center gap-4 py-4 px-5 rounded-2xl border-2 transition hover:shadow-lg text-left"
                style={{ borderColor: d.color + '44', background: d.color + '08' }}
              >
                <span className="text-3xl">{d.icon}</span>
                <div>
                  <div className="font-display text-lg" style={{ color: d.color }}>{d.label}</div>
                  <div className="font-body text-sm text-ink/60">{d.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setScreen('menu')}
            className="mt-6 font-display text-sm text-ink/50 hover:text-ink transition"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  // ── GAME BOARD ──
  const isAI = mode === 'ai'
  const isHumanTurn = !isXNext || !isAI
  const turnSymbol = isXNext ? 'X' : 'O'
  const winLine = result?.line || []

  let statusText = ''
  let statusColor = '#20283A'
  if (result?.draw) {
    statusText = 'Hòa!'
    statusColor = '#F4B942'
  } else if (result?.winner) {
    if (isAI) {
      statusText = result.winner === humanSymbol ? 'Bạn thắng!' : 'Máy thắng!'
      statusColor = result.winner === humanSymbol ? '#1B998B' : '#E4572E'
    } else {
      statusText = `Người chơi ${result.winner} thắng!`
      statusColor = result.winner === 'X' ? '#1B998B' : '#E4572E'
    }
  } else {
    if (isAI) {
      statusText = isHumanTurn ? 'Lượt của bạn' : 'Máy đang suy nghĩ...'
      statusColor = isHumanTurn ? '#1B998B' : '#E4572E'
    } else {
      statusText = `Lượt chơi: ${turnSymbol}`
      statusColor = turnSymbol === 'X' ? '#1B998B' : '#E4572E'
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-paper">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 bg-white border-b border-ink/10 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl">❌⭕</span>
          <h1 className="font-display text-xl" style={{ color: '#1B998B' }}>
            TIC–TAC–TOE
          </h1>
        </div>
        <div className="flex items-center gap-5 text-sm text-ink/70 font-body flex-wrap">
          <span className="font-mono">{isAI ? `Máy: ${difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'TB' : 'Khó'}` : '2 Người'}</span>
          {isAI && (
            <>
              <span className="hidden sm:inline">·</span>
              <span>⭐ {stats.wins * 100}</span>
            </>
          )}
        </div>
        <button
          onClick={onQuit}
          className="font-display text-sm text-ticket border border-ticket/40 rounded-2xl px-4 py-2 hover:bg-ticket/5 transition"
        >
          Thoát
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6">
        {/* Status */}
        <div
          className="font-display text-xl sm:text-2xl font-bold transition-colors anim-pop"
          style={{ color: statusColor }}
        >
          {statusText}
        </div>

        {/* Board */}
        <div
          className="note-card p-4 sm:p-6"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-3" style={{ width: 'min(80vw, 340px)', height: 'min(80vw, 340px)' }}>
            {board.map((cell, i) => {
              const isWinCell = winLine.includes(i)
              const isX = cell === 'X'
              const isO = cell === 'O'
              return (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={!!cell || gameOver || result || (isAI && !isHumanTurn)}
                  className="relative flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-200 font-display font-bold"
                  style={{
                    background: isWinCell
                      ? (result?.winner === 'X' ? '#1B998B22' : '#E4572E22')
                      : '#FFFBF2',
                    border: isWinCell
                      ? `2px solid ${result?.winner === 'X' ? '#1B998B' : '#E4572E'}`
                      : '2px solid #E7D9BE',
                    cursor: cell || gameOver ? 'default' : 'pointer',
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    color: isX ? '#1B998B' : isO ? '#E4572E' : '#E7D9BE',
                  }}
                >
                  {cell && (
                    <span className={`anim-pop ${isWinCell ? 'font-black' : ''}`}>
                      {cell}
                    </span>
                  )}
                  {!cell && !gameOver && (
                    <span className="opacity-20 text-3xl sm:text-4xl">·</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Win/Draw Animation Overlay */}
        {result && (
          <div className="anim-pop text-center">
            {result.draw ? (
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl" style={{ background: '#F4B94220', border: '2px solid #F4B942' }}>
                <span className="text-3xl">🤝</span>
                <span className="font-display text-lg" style={{ color: '#F4B942' }}>Hòa nhau!</span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
                style={{
                  background: (isAI && result.winner === humanSymbol) ? '#1B998B20' : '#E4572E20',
                  border: `2px solid ${(isAI && result.winner === humanSymbol) ? '#1B998B' : '#E4572E'}`,
                }}
              >
                <span className="text-3xl">{(isAI && result.winner === humanSymbol) ? '🎉' : '🏆'}</span>
                <span
                  className="font-display text-lg font-bold"
                  style={{ color: (isAI && result.winner === humanSymbol) ? '#1B998B' : '#E4572E' }}
                >
                  {isAI
                    ? (result.winner === humanSymbol ? 'Bạn thắng!' : 'Máy thắng!')
                    : `Người chơi ${result.winner} thắng!`
                  }
                </span>
              </div>
            )}
          </div>
        )}

        {/* Stats bar (AI mode only) */}
        {isAI && (
          <div className="flex items-center gap-5 font-mono text-sm">
            <span style={{ color: '#1B998B' }}>✓ {stats.wins}</span>
            <span style={{ color: '#E4572E' }}>✗ {stats.losses}</span>
            <span style={{ color: '#F4B942' }}>○ {stats.draws}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { resetGame(); }}
            className="px-6 py-3 rounded-2xl font-display text-sm border-2 transition hover:shadow-md"
            style={{ borderColor: '#1B998B', color: '#1B998B', background: '#1B998B08' }}
          >
            🔄 Trò chơi mới
          </button>
          {isAI && result && (
            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl font-display text-sm border-2 transition hover:shadow-md"
              style={{ borderColor: '#F4B942', color: '#F4B942', background: '#F4B94208' }}
            >
              ⭐ Xem điểm
            </button>
          )}
          {!isAI && (
            <button
              onClick={() => { setScreen('menu'); resetGame(); }}
              className="px-6 py-3 rounded-2xl font-display text-sm border-2 transition hover:shadow-md"
              style={{ borderColor: '#8A7C6344', color: '#8A7C63', background: '#8A7C6308' }}
            >
              🏠 Menu
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
