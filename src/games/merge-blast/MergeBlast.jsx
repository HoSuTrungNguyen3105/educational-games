import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

const ROWS = 6
const COLS = 6
const TILE_VALUES = [2, 4, 8, 16, 32]
const BEST_SCORE_KEY = 'merge-blast-best'
const POWERUP_THRESHOLD = 500

const POWERUP_TYPES = [
  { id: 'bomb', icon: '💣', name: 'Bom', desc: 'Phá hủy vùng 3x3' },
  { id: 'row', icon: '↔', name: 'Hàng', desc: 'Xóa toàn bộ hàng' },
  { id: 'col', icon: '↕', name: 'Cột', desc: 'Xóa toàn bộ cột' },
  { id: 'shuffle', icon: '🔀', name: 'Xáo trộn', desc: 'Xáo trộn tất cả ô' },
]

function createBoard() {
  const board = []
  for (let r = 0; r < ROWS; r++) {
    board[r] = []
    for (let c = 0; c < COLS; c++) {
      board[r][c] = { value: TILE_VALUES[Math.floor(Math.random() * TILE_VALUES.length)], id: `${r}-${c}-${Date.now()}-${Math.random()}` }
    }
  }
  return board
}

function cloneBoard(board) {
  return board.map(row => row.map(cell => ({ ...cell })))
}

function findGroup(board, startR, startC) {
  const target = board[startR][startC]
  if (!target || target.value === 0) return []
  const visited = new Set()
  const group = []
  const stack = [[startR, startC]]
  while (stack.length > 0) {
    const [r, c] = stack.pop()
    const key = `${r},${c}`
    if (visited.has(key)) continue
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
    if (!board[r][c] || board[r][c].value !== target.value) continue
    visited.add(key)
    group.push([r, c])
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }
  return group
}

function hasValidMoves(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c] || board[r][c].value === 0) continue
      const group = findGroup(board, r, c)
      if (group.length >= 2) return true
    }
  }
  return false
}

function blastGroup(board, group, mergedValue) {
  const newBoard = cloneBoard(board)
  const positions = group.map(([r, c]) => ({ r, c }))
  const centerR = Math.round(positions.reduce((s, p) => s + p.r, 0) / positions.length)
  const centerC = Math.round(positions.reduce((s, p) => s + p.c, 0) / positions.length)
  for (const [r, c] of group) {
    newBoard[r][c] = { value: 0, id: '' }
  }
  if (mergedValue <= 1024) {
    newBoard[centerR][centerC] = { value: mergedValue, id: `merged-${Date.now()}-${Math.random()}` }
  }
  for (let c = 0; c < COLS; c++) {
    const column = []
    for (let r = 0; r < ROWS; r++) {
      if (newBoard[r][c].value !== 0) column.push(newBoard[r][c])
    }
    while (column.length < ROWS) column.unshift({ value: 0, id: '' })
    for (let r = 0; r < ROWS; r++) {
      newBoard[r][c] = column[r]
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newBoard[r][c].value === 0) {
        newBoard[r][c] = { value: TILE_VALUES[Math.floor(Math.random() * TILE_VALUES.length)], id: `new-${Date.now()}-${r}-${c}-${Math.random()}` }
      }
    }
  }
  return newBoard
}

function blastArea(board, cells) {
  const newBoard = cloneBoard(board)
  for (const [r, c] of cells) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      newBoard[r][c] = { value: 0, id: '' }
    }
  }
  for (let c = 0; c < COLS; c++) {
    const column = []
    for (let r = 0; r < ROWS; r++) {
      if (newBoard[r][c].value !== 0) column.push(newBoard[r][c])
    }
    while (column.length < ROWS) column.unshift({ value: 0, id: '' })
    for (let r = 0; r < ROWS; r++) {
      newBoard[r][c] = column[r]
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newBoard[r][c].value === 0) {
        newBoard[r][c] = { value: TILE_VALUES[Math.floor(Math.random() * TILE_VALUES.length)], id: `new-${Date.now()}-${r}-${c}-${Math.random()}` }
      }
    }
  }
  return newBoard
}

function shuffleBoard(board) {
  const values = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      values.push(board[r][c].value)
    }
  }
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]]
  }
  const newBoard = []
  let idx = 0
  for (let r = 0; r < ROWS; r++) {
    newBoard[r] = []
    for (let c = 0; c < COLS; c++) {
      newBoard[r][c] = { value: values[idx++], id: `shuf-${Date.now()}-${r}-${c}-${Math.random()}` }
    }
  }
  return newBoard
}

function getTileColor(value) {
  switch (value) {
    case 2: return { bg: '#E8F5F3', border: '#1B998B', text: '#1B998B' }
    case 4: return { bg: '#FFF8E1', border: '#F4B942', text: '#C49000' }
    case 8: return { bg: '#FFE8D6', border: '#E4572E', text: '#E4572E' }
    case 16: return { bg: '#E8DAEF', border: '#8E44AD', text: '#8E44AD' }
    case 32: return { bg: '#FADBD8', border: '#E74C3C', text: '#C0392B' }
    case 64: return { bg: '#D5F5E3', border: '#27AE60', text: '#1E8449' }
    case 128: return { bg: '#D6EAF8', border: '#2E86C1', text: '#2471A3' }
    case 256: return { bg: '#FDEBD0', border: '#E67E22', text: '#CA6F1E' }
    case 512: return { bg: '#F5EEF8', border: '#AF7AC5', text: '#8E44AD' }
    case 1024: return { bg: '#D1F2EB', border: '#1ABC9C', text: '#16A085' }
    default: return { bg: '#F0F0F0', border: '#999', text: '#666' }
  }
}

function Particles({ particles }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `particle-fly ${p.duration}s ease-out forwards`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
    </div>
  )
}

export default function MergeBlastPlayScreen({ game, onFinish, onQuit }) {
  const [board, setBoard] = useState(() => createBoard())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10) } catch { return 0 }
  })
  const [combo, setCombo] = useState(0)
  const [hoverGroup, setHoverGroup] = useState([])
  const [blasting, setBlasting] = useState(false)
  const [particles, setParticles] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [powerups, setPowerups] = useState({ bomb: 0, row: 0, col: 0, shuffle: 0 })
  const [activePowerup, setActivePowerup] = useState(null)
  const [selectedTile, setSelectedTile] = useState(null)
  const [lastBlastScore, setLastBlastScore] = useState(null)
  const [shakeBoard, setShakeBoard] = useState(false)
  const boardRef = useRef(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const saved = parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10)
    if (score > saved) {
      localStorage.setItem(BEST_SCORE_KEY, score.toString())
      setBestScore(score)
    }
  }, [score, bestScore])

  const spawnParticles = useCallback((cells) => {
    if (!boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    const newParticles = cells.map(([r, c]) => {
      const tileEl = boardRef.current.querySelector(`[data-cell="${r}-${c}"]`)
      if (!tileEl) return null
      const tileRect = tileEl.getBoundingClientRect()
      const cx = ((tileRect.left + tileRect.width / 2 - rect.left) / rect.width) * 100
      const cy = ((tileRect.top + tileRect.height / 2 - rect.top) / rect.height) * 100
      return Array.from({ length: 4 }, () => ({
        id: `${r}-${c}-${Math.random()}`,
        x: cx,
        y: cy,
        dx: (Math.random() - 0.5) * 120,
        dy: -Math.random() * 80 - 20,
        size: Math.random() * 8 + 4,
        color: ['#F4B942', '#1B998B', '#E4572E', '#8E44AD'][Math.floor(Math.random() * 4)],
        duration: Math.random() * 0.5 + 0.4,
      }))
    }).filter(Boolean).flat()
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)))
    }, 1000)
  }, [])

  const handleTileClick = useCallback((r, c) => {
    if (blasting || paused || gameOver) return

    if (activePowerup) {
      let cells = []
      let newBoard = cloneBoard(board)

      if (activePowerup === 'bomb') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) cells.push([nr, nc])
          }
        }
        const points = cells.reduce((sum, [rr, cc]) => sum + (board[rr][cc]?.value || 0), 0)
        newBoard = blastArea(board, cells)
        setScore(s => s + points * Math.max(1, combo))
        spawnParticles(cells)
      } else if (activePowerup === 'row') {
        for (let cc = 0; cc < COLS; cc++) cells.push([r, cc])
        const points = cells.reduce((sum, [rr, cc]) => sum + (board[rr][cc]?.value || 0), 0)
        newBoard = blastArea(board, cells)
        setScore(s => s + points * Math.max(1, combo))
        spawnParticles(cells)
      } else if (activePowerup === 'col') {
        for (let rr = 0; rr < ROWS; rr++) cells.push([rr, c])
        const points = cells.reduce((sum, [rr, cc]) => sum + (board[rr][cc]?.value || 0), 0)
        newBoard = blastArea(board, cells)
        setScore(s => s + points * Math.max(1, combo))
        spawnParticles(cells)
      } else if (activePowerup === 'shuffle') {
        newBoard = shuffleBoard(board)
        setCombo(0)
      }

      setPowerups(p => ({ ...p, [activePowerup]: p[activePowerup] - 1 }))
      setActivePowerup(null)
      setBoard(newBoard)
      setShakeBoard(true)
      setTimeout(() => setShakeBoard(false), 300)

      setTimeout(() => {
        if (!hasValidMoves(newBoard)) setGameOver(true)
      }, 100)
      return
    }

    const group = findGroup(board, r, c)
    if (group.length < 2) {
      setSelectedTile(null)
      return
    }

    setSelectedTile([r, c])
    setBlasting(true)
    const newCombo = combo + 1
    setCombo(newCombo)

    const tileSum = group.reduce((sum, [rr, cc]) => sum + board[rr][cc].value, 0)
    const mergedValue = board[r][c].value * 2
    const earned = tileSum * newCombo

    setLastBlastScore({ value: earned, x: r, y: c })
    setTimeout(() => setLastBlastScore(null), 800)

    spawnParticles(group)

    setTimeout(() => {
      const newBoard = blastGroup(board, group, mergedValue)
      setBoard(newBoard)
      setScore(s => s + earned)
      setSelectedTile(null)
      setShakeBoard(true)
      setTimeout(() => setShakeBoard(false), 300)

      const totalEarned = score + earned
      const powerupCount = Math.floor(totalEarned / POWERUP_THRESHOLD)
      const prevPowerupCount = Math.floor(score / POWERUP_THRESHOLD)
      if (powerupCount > prevPowerupCount) {
        const types = ['bomb', 'row', 'col', 'shuffle']
        const earnedType = types[Math.floor(Math.random() * types.length)]
        setPowerups(p => ({ ...p, [earnedType]: p[earnedType] + 1 }))
      }

      setTimeout(() => {
        setBlasting(false)
        if (!hasValidMoves(newBoard)) setGameOver(true)
      }, 100)
    }, 250)
  }, [board, blasting, paused, gameOver, combo, score, activePowerup, spawnParticles])

  const handleTileHover = useCallback((r, c) => {
    if (blasting || paused || gameOver || activePowerup) {
      setHoverGroup([])
      return
    }
    const group = findGroup(board, r, c)
    if (group.length >= 2) {
      setHoverGroup(group)
    } else {
      setHoverGroup([])
    }
  }, [board, blasting, paused, gameOver, activePowerup])

  const handleMouseLeave = useCallback(() => {
    setHoverGroup([])
  }, [])

  const handleRestart = useCallback(() => {
    setBoard(createBoard())
    setScore(0)
    setCombo(0)
    setHoverGroup([])
    setBlasting(false)
    setParticles([])
    setGameOver(false)
    setPaused(false)
    setPowerups({ bomb: 0, row: 0, col: 0, shuffle: 0 })
    setActivePowerup(null)
    setSelectedTile(null)
    setLastBlastScore(null)
    startRef.current = Date.now()
  }, [])

  const handleFinish = useCallback(() => {
    const timeUsed = Math.round((Date.now() - startRef.current) / 1000)
    onFinish({ score, correct: 0, timeUsed })
  }, [score, onFinish])

  const togglePause = useCallback(() => {
    setPaused(p => !p)
  }, [])

  const isHovered = useCallback((r, c) => {
    return hoverGroup.some(([hr, hc]) => hr === r && hc === c)
  }, [hoverGroup])

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #20283A 0%, #1a2235 100%)' }}>
      <style>{`
        @keyframes particle-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes tile-blast {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes tile-appear {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes score-float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        @keyframes board-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        @keyframes combo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .tile-blast { animation: tile-blast 0.25s ease-out forwards; }
        .tile-appear { animation: tile-appear 0.3s cubic-bezier(.2,.9,.3,1.3) both; }
        .score-float { animation: score-float 0.8s ease-out forwards; }
        .board-shake { animation: board-shake 0.3s ease-in-out; }
        .combo-pulse { animation: combo-pulse 0.5s ease-in-out; }
        .powerup-active { outline: 3px solid #F4B942; outline-offset: 2px; }
      `}</style>

      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-white/5 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💥</span>
          <h1 className="font-display text-lg text-[#F4B942]">NỔ & GHÉP</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-body flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[#8A7C63]">Điểm:</span>
            <span className="font-display text-[#F4B942] text-lg">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8A7C63]">Kỷ lục:</span>
            <span className="font-mono text-white/70">{bestScore}</span>
          </div>
          {combo > 1 && (
            <span className="combo-pulse bg-[#E4572E] text-white font-display text-xs px-2 py-1 rounded-full">
              x{combo} COMBO!
            </span>
          )}
          <button onClick={togglePause}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 transition text-sm">
            {paused ? '▶' : '⏸'}
          </button>
          <button onClick={handleRestart}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 transition text-sm">
            ↻
          </button>
          <button onClick={handleFinish}
            className="font-display text-sm border rounded-2xl px-4 py-2 hover:opacity-80 transition text-[#F4B942] border-[#F4B942]/40">
            Thoát
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {POWERUP_TYPES.map(pu => {
            const count = powerups[pu.id]
            const isActive = activePowerup === pu.id
            return (
              <button key={pu.id}
                onClick={() => {
                  if (count <= 0) return
                  setActivePowerup(isActive ? null : pu.id)
                }}
                disabled={count <= 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition font-body text-sm
                  ${isActive ? 'border-[#F4B942] bg-[#F4B942]/20 text-[#F4B942] powerup-active' :
                    count > 0 ? 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10' :
                    'border-white/5 bg-white/2 text-white/30 cursor-not-allowed'}`}>
                <span className="text-lg">{pu.icon}</span>
                <span className="font-mono">{count}</span>
              </button>
            )
          })}
        </div>

        {activePowerup && (
          <div className="bg-[#F4B942]/15 border border-[#F4B942]/40 rounded-xl px-4 py-2 text-sm text-[#F4B942] font-body">
            Đang dùng: {POWERUP_TYPES.find(p => p.id === activePowerup)?.icon} {POWERUP_TYPES.find(p => p.id === activePowerup)?.name}
            — {POWERUP_TYPES.find(p => p.id === activePowerup)?.desc}
          </div>
        )}

        <div ref={boardRef} className={`relative ${shakeBoard ? 'board-shake' : ''}`}
          onMouseLeave={handleMouseLeave}>
          <Particles particles={particles} />

          <div className="note-card p-3 sm:p-4 rounded-2xl"
            style={{ background: 'rgba(32, 40, 58, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const color = getTileColor(cell.value)
                  const hovered = isHovered(r, c)
                  const isBlasting = blasting && selectedTile && selectedTile[0] === r && selectedTile[1] === c

                  return (
                    <button key={cell.id}
                      data-cell={`${r}-${c}`}
                      onClick={() => handleTileClick(r, c)}
                      onMouseEnter={() => handleTileHover(r, c)}
                      disabled={blasting || paused || gameOver}
                      className={`relative aspect-square rounded-lg sm:rounded-xl flex items-center justify-center
                        font-display text-base sm:text-xl transition-all duration-150
                        ${hovered ? 'scale-110 z-10 ring-2 ring-[#F4B942]/60' : ''}
                        ${isBlasting ? 'tile-blast' : 'tile-appear'}
                        ${activePowerup ? 'cursor-crosshair' : ''}
                        ${cell.value >= 64 ? 'text-white shadow-lg' : ''}
                      `}
                      style={{
                        background: hovered
                          ? `linear-gradient(135deg, ${color.border}dd, ${color.border})`
                          : color.bg,
                        color: hovered ? '#fff' : color.text,
                        border: `2px solid ${hovered ? color.border : color.border + '44'}`,
                        boxShadow: hovered ? `0 0 16px ${color.border}44` : 'none',
                        fontSize: cell.value >= 128 ? '0.75rem' : cell.value >= 64 ? '0.85rem' : undefined,
                      }}>
                      {cell.value}
                      {lastBlastScore && lastBlastScore.x === r && lastBlastScore.y === c && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 score-float font-display text-[#F4B942] text-sm font-bold whitespace-nowrap">
                          +{lastBlastScore.value}
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-white/40 font-body">
          Click nhóm 2+ ô cùng giá trị để nổ và ghép đôi
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="note-card p-8 text-center max-w-sm mx-4 anim-pop">
              <h2 className="font-display text-2xl text-[#E4572E] mb-2">Hết nước đi!</h2>
              <p className="text-[#8A7C63] font-body mb-4">Không còn nhóm ô nào để nổ</p>
              <div className="font-display text-3xl text-[#F4B942] mb-6">{score} điểm</div>
              <div className="flex gap-3 justify-center">
                <button onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-[#1B998B] text-white font-display text-sm hover:opacity-80 transition">
                  Chơi lại
                </button>
                <button onClick={handleFinish}
                  className="px-5 py-2.5 rounded-xl border border-[#E4572E] text-[#E4572E] font-display text-sm hover:bg-[#E4572E]/10 transition">
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        )}

        {paused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="note-card p-8 text-center anim-pop">
              <h2 className="font-display text-2xl text-ink mb-4">Tạm dừng</h2>
              <button onClick={togglePause}
                className="px-6 py-2.5 rounded-xl bg-[#1B998B] text-white font-display hover:opacity-80 transition">
                Tiếp tục
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}