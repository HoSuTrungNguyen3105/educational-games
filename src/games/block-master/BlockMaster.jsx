import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 10;
const BEST_KEY = 'block-master-best';

const COLORS = {
  ink: '#20283A',
  paper: '#FFF6E7',
  muted: '#8A7C63',
  teal: '#1B998B',
  ticket: '#E4572E',
  gold: '#F4B942',
  blockFill: '#20283A',
  blockStroke: '#162030',
  cellEmpty: '#EDE6D6',
  cellHighlight: '#1B998B44',
  cellInvalid: '#E4572E44',
  lineFlash: '#F4B942',
};

const BLOCK_PALETTES = [
  '#1B998B', '#E4572E', '#F4B942', '#6C63FF', '#FF6F91', '#4CAF7D', '#8B6FF1',
];

const SHAPES = [
  { id: 'single', cells: [[0, 0]], color: 0 },
  { id: 'pair-h', cells: [[0, 0], [1, 0]], color: 1 },
  { id: 'pair-v', cells: [[0, 0], [0, 1]], color: 1 },
  { id: 'triple-h', cells: [[0, 0], [1, 0], [2, 0]], color: 2 },
  { id: 'triple-v', cells: [[0, 0], [0, 1], [0, 2]], color: 2 },
  { id: 'square', cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 3 },
  { id: 'l-down', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: 4 },
  { id: 'l-down-r', cells: [[1, 0], [1, 1], [1, 2], [0, 2]], color: 4 },
  { id: 'l-up', cells: [[0, 0], [0, 1], [0, 2], [1, 0]], color: 5 },
  { id: 'l-up-r', cells: [[1, 0], [1, 1], [1, 2], [0, 0]], color: 5 },
  { id: 't-down', cells: [[0, 0], [1, 0], [2, 0], [1, 1]], color: 6 },
  { id: 't-up', cells: [[1, 0], [0, 1], [1, 1], [2, 1]], color: 6 },
  { id: 't-left', cells: [[1, 0], [0, 1], [1, 1], [1, 2]], color: 3 },
  { id: 't-right', cells: [[0, 0], [0, 1], [1, 1], [0, 2]], color: 3 },
  { id: 'line-4h', cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: 2 },
  { id: 'line-4v', cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: 2 },
  { id: 's-h', cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: 5 },
  { id: 'z-h', cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: 4 },
  { id: 'line-5h', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], color: 6 },
  { id: 'line-5v', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], color: 6 },
  { id: 'dot-2x2', cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 1 },
  { id: 'corner-3', cells: [[0, 0], [1, 0], [0, 1]], color: 0 },
  { id: 'corner-3r', cells: [[0, 0], [1, 0], [1, 1]], color: 0 },
  { id: 'plus', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], color: 3 },
  { id: 'zigzag-6', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], color: 4 },
];

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function randomBlock() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const paletteColor = BLOCK_PALETTES[shape.color % BLOCK_PALETTES.length];
  return {
    ...shape,
    uid: Math.random().toString(36).slice(2, 9),
    color: paletteColor,
  };
}

function generateThreeBlocks() {
  return [randomBlock(), randomBlock(), randomBlock()];
}

function canPlace(grid, block, row, col) {
  for (const [dx, dy] of block.cells) {
    const r = row + dy;
    const c = col + dx;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (grid[r][c] !== 0) return false;
  }
  return true;
}

function placeBlock(grid, block, row, col) {
  const next = grid.map(r => [...r]);
  for (const [dx, dy] of block.cells) {
    next[row + dy][col + dx] = block.uid;
  }
  return next;
}

function findClearLines(grid) {
  const fullRows = [];
  const fullCols = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every(c => c !== 0)) fullRows.push(r);
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid.every(r => r[c] !== 0)) fullCols.push(c);
  }
  return { fullRows, fullCols };
}

function clearLines(grid, fullRows, fullCols) {
  const next = grid.map(r => [...r]);
  for (const r of fullRows) {
    for (let c = 0; c < GRID_SIZE; c++) next[r][c] = 0;
  }
  for (const c of fullCols) {
    for (let r = 0; r < GRID_SIZE; r++) next[r][c] = 0;
  }
  return next;
}

function hasAnyPlacement(grid, blocks) {
  for (const block of blocks) {
    if (!block) continue;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlace(grid, block, r, c)) return true;
      }
    }
  }
  return false;
}

function BlockPreview({ block, size = 18, selected = false, disabled = false }) {
  if (!block) return null;
  const maxX = Math.max(...block.cells.map(c => c[0])) + 1;
  const maxY = Math.max(...block.cells.map(c => c[1])) + 1;
  const svgSize = Math.max(maxX, maxY) * size + 4;
  const set = new Set(block.cells.map(([x, y]) => `${x},${y}`));

  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
      {Array.from({ length: maxY }, (_, y) =>
        Array.from({ length: maxX }, (_, x) => {
          if (!set.has(`${x},${y}`)) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * size + 2}
              y={y * size + 2}
              width={size - 1}
              height={size - 1}
              rx={3}
              fill={block.color}
              opacity={disabled ? 0.35 : 1}
              stroke={selected ? COLORS.gold : 'transparent'}
              strokeWidth={selected ? 2 : 0}
            />
          );
        })
      )}
    </svg>
  );
}

export default function BlockMasterPlayScreen({ game, onFinish, onQuit }) {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [blocks, setBlocks] = useState(() => generateThreeBlocks());
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
  });
  const [flashRows, setFlashRows] = useState([]);
  const [flashCols, setFlashCols] = useState([]);
  const [totalLines, setTotalLines] = useState(0);
  const [hoverCell, setHoverCell] = useState(null);
  const startRef = useRef(Date.now());

  const selectedBlock = selectedIdx !== null ? blocks[selectedIdx] : null;

  const clearBestScore = useCallback((s) => {
    setBestScore(prev => {
      if (s > prev) {
        try { localStorage.setItem(BEST_KEY, String(s)); } catch {}
        return s;
      }
      return prev;
    });
  }, []);

  const endGame = useCallback((finalScore) => {
    setGameOver(true);
    clearBestScore(finalScore);
    const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
    setTimeout(() => {
      onFinish({ score: finalScore, correct: 0, timeUsed });
    }, 2000);
  }, [onFinish, clearBestScore]);

  const placeAndClear = useCallback((row, col) => {
    if (!selectedBlock || gameOver || paused) return;

    const newGrid = placeBlock(grid, selectedBlock, row, col);
    const { fullRows, fullCols } = findClearLines(newGrid);
    const linesCleared = fullRows.length + fullCols.length;

    let earned = 0;
    let newCombo = 0;
    let clearedGrid = newGrid;

    if (linesCleared > 0) {
      newCombo = combo + 1;
      earned = linesCleared * 100 * newCombo;
      if (linesCleared >= 2) earned += linesCleared * 50;
      clearedGrid = clearLines(newGrid, fullRows, fullCols);
      setFlashRows(fullRows);
      setFlashCols(fullCols);
      setTimeout(() => { setFlashRows([]); setFlashCols([]); }, 500);
      setTotalLines(t => t + linesCleared);
    } else {
      newCombo = 0;
    }

    const newScore = score + earned;
    setGrid(clearedGrid);
    setCombo(newCombo);
    setScore(newScore);

    const newBlocks = [...blocks];
    newBlocks[selectedIdx] = null;
    const allUsed = newBlocks.every(b => b === null);

    if (allUsed) {
      const fresh = generateThreeBlocks();
      setBlocks(fresh);
      setSelectedIdx(null);
      if (!hasAnyPlacement(clearedGrid, fresh)) {
        endGame(newScore);
      }
    } else {
      setBlocks(newBlocks);
      setSelectedIdx(null);
      if (!hasAnyPlacement(clearedGrid, newBlocks.filter(Boolean))) {
        endGame(newScore);
      }
    }
  }, [grid, selectedBlock, selectedIdx, blocks, combo, score, gameOver, paused, endGame]);

  const handleCellClick = useCallback((row, col) => {
    if (gameOver || paused) return;
    if (selectedBlock) {
      if (canPlace(grid, selectedBlock, row, col)) {
        placeAndClear(row, col);
      }
    }
  }, [grid, selectedBlock, gameOver, paused, placeAndClear]);

  const handleBlockSelect = useCallback((idx) => {
    if (gameOver || paused) return;
    if (blocks[idx] === null) return;
    setSelectedIdx(prev => prev === idx ? null : idx);
  }, [blocks, gameOver, paused]);

  useEffect(() => {
    setSelectedIdx(null);
  }, [blocks]);

  if (gameOver) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6" style={{ background: COLORS.paper }}>
        <div className="note-card p-8 max-w-md w-full text-center anim-pop">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="font-display text-2xl mb-2" style={{ color: COLORS.ink }}>Game Over!</h2>
          <p className="font-body text-lg mb-4" style={{ color: COLORS.muted }}>Không còn ô nào để đặt block</p>
          <div className="flex justify-center gap-6 mb-6">
            <div>
              <div className="font-mono text-3xl font-bold" style={{ color: COLORS.teal }}>{score}</div>
              <div className="font-body text-xs" style={{ color: COLORS.muted }}>Điểm</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-bold" style={{ color: COLORS.gold }}>{totalLines}</div>
              <div className="font-body text-xs" style={{ color: COLORS.muted }}>Lines</div>
            </div>
          </div>
          {score >= bestScore && score > 0 && (
            <p className="font-display text-sm mb-4" style={{ color: COLORS.gold }}>✨ Kỷ lục mới!</p>
          )}
          <button
            onClick={() => onFinish({ score, correct: 0, timeUsed: Math.round((Date.now() - startRef.current) / 1000) })}
            className="font-display text-sm px-6 py-3 rounded-2xl border-2 transition hover:opacity-80"
            style={{ color: COLORS.teal, borderColor: COLORS.teal }}
          >
            Xem kết quả
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: COLORS.paper }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 border-b" style={{ borderColor: '#E7D9BE', background: '#FFFBF2' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧩</span>
          <h1 className="font-display text-xl" style={{ color: COLORS.ink }}>Block Master</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-body flex-wrap" style={{ color: COLORS.muted }}>
          <span className="font-mono text-lg font-bold" style={{ color: COLORS.teal }}>{score} pts</span>
          {combo > 1 && (
            <span className="font-mono text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: COLORS.gold + '33', color: COLORS.gold }}>
              x{combo}
            </span>
          )}
          {bestScore > 0 && (
            <span className="font-mono text-xs" style={{ color: COLORS.muted }}>Best: {bestScore}</span>
          )}
          <button
            onClick={() => setPaused(p => !p)}
            className="w-8 h-8 flex items-center justify-center rounded-full border transition hover:opacity-80"
            style={{ borderColor: COLORS.muted + '44', color: COLORS.muted }}
          >
            {paused ? '▶' : '⏸'}
          </button>
          <button
            onClick={onQuit}
            className="font-display text-sm border px-3 py-1.5 rounded-2xl hover:opacity-80 transition"
            style={{ color: COLORS.ticket, borderColor: COLORS.ticket + '66' }}
          >
            Thoát
          </button>
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(32,40,58,0.7)' }}>
          <div className="note-card p-8 text-center anim-pop">
            <div className="text-4xl mb-3">⏸️</div>
            <h2 className="font-display text-xl mb-4" style={{ color: COLORS.ink }}>Tạm dừng</h2>
            <button
              onClick={() => setPaused(false)}
              className="font-display text-sm px-6 py-3 rounded-2xl border-2 transition hover:opacity-80"
              style={{ color: COLORS.teal, borderColor: COLORS.teal }}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6">
        <div
          className="relative select-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '2px',
            width: 'min(92vw, 420px)',
            height: 'min(92vw, 420px)',
            background: '#D6CCBA',
            borderRadius: '10px',
            padding: '3px',
            boxShadow: '0 2px 12px rgba(32,40,58,0.1)',
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isFlash = flashRows.includes(r) || flashCols.includes(c);
              const isHover = hoverCell && hoverCell[0] === r && hoverCell[1] === c;
              const isPreview = selectedBlock && hoverCell && canPlace(grid, selectedBlock, hoverCell[0], hoverCell[1]) &&
                selectedBlock.cells.some(([dx, dy]) => hoverCell[0] + dy === r && hoverCell[1] + dx === c);

              let bg = cell === 0 ? COLORS.cellEmpty : COLORS.blockFill;
              if (isFlash) bg = COLORS.lineFlash;
              if (isPreview && cell === 0) bg = COLORS.cellHighlight;
              if (isHover && selectedBlock && cell === 0 && !canPlace(grid, selectedBlock, hoverCell[0], hoverCell[1])) {
                bg = COLORS.cellInvalid;
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => setHoverCell([r, c])}
                  onMouseLeave={() => setHoverCell(null)}
                  onTouchEnd={(e) => { e.preventDefault(); handleCellClick(r, c); }}
                  style={{
                    background: bg,
                    borderRadius: '3px',
                    cursor: selectedBlock ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                />
              );
            })
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 mt-3 font-mono text-xs" style={{ color: COLORS.muted }}>
          <span>Lines: {totalLines}</span>
          <span>Best: {bestScore}</span>
        </div>
      </div>

      {/* Block tray */}
      <div className="px-4 md:px-8 pb-4 pt-2" style={{ background: '#FFFBF2', borderTop: '1px solid #E7D9BE' }}>
        <div className="flex items-center justify-center gap-3 md:gap-5">
          {blocks.map((block, idx) => (
            <button
              key={block ? block.uid : `empty-${idx}`}
              onClick={() => handleBlockSelect(idx)}
              disabled={!block}
              className="flex items-center justify-center transition-all"
              style={{
                width: 'min(28vw, 120px)',
                height: 'min(20vw, 90px)',
                borderRadius: '14px',
                border: selectedIdx === idx ? `3px solid ${COLORS.gold}` : '2px solid #E7D9BE',
                background: selectedIdx === idx ? COLORS.gold + '22' : block ? '#FFFBF2' : '#F0EBE0',
                opacity: block ? 1 : 0.3,
                boxShadow: selectedIdx === idx ? `0 0 12px ${COLORS.gold}44` : 'none',
              }}
            >
              {block ? <BlockPreview block={block} size={selectedIdx === idx ? 20 : 16} selected={selectedIdx === idx} /> : <span style={{ color: COLORS.muted }}>✓</span>}
            </button>
          ))}
        </div>
        <p className="text-center font-body text-xs mt-2" style={{ color: COLORS.muted }}>
          {selectedBlock ? 'Chạm ô trên lưới để đặt block' : 'Chọn block rồi chạm ô trên lưới'}
        </p>
      </div>
    </div>
  );
}
