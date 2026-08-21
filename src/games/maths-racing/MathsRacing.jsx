import { useEffect, useRef, useState, useCallback } from 'react'

const LANE_COUNT = 3
const LANE_LABELS = ['top', 'mid', 'bot']
const GROUND_Y = [18, 48, 78]
const CHAR_X = 15
const SPAWN_X = 105
const DESPAWN_X = -10
const BASE_SPEED = 0.12
const SPEED_PER_LEVEL = 0.015
const JUMP_HEIGHT = 22
const JUMP_DURATION = 600
const COIN_INTERVAL = 2800
const OBSTACLE_INTERVAL = 2200
const MATH_INTERVAL = 12000
const POWERUP_INTERVAL = 15000
const LEVEL_DISTANCE = 500
const MATH_TIME_LIMIT = 10

function generateMathQuestion() {
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a, b, answer
  if (op === '+') {
    a = Math.floor(Math.random() * 30) + 2
    b = Math.floor(Math.random() * 20) + 1
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 30) + 10
    b = Math.floor(Math.random() * a) + 1
    answer = a - b
  } else {
    a = Math.floor(Math.random() * 10) + 2
    b = Math.floor(Math.random() * 10) + 1
    answer = a * b
  }
  const options = new Set([answer])
  while (options.size < 3) {
    const offset = Math.floor(Math.random() * 10) - 5
    const wrong = answer + (offset === 0 ? 1 : offset)
    if (wrong >= 0) options.add(wrong)
  }
  const shuffled = [...options].sort(() => Math.random() - 0.5)
  return { text: `${a} ${op} ${b}`, answer, options: shuffled }
}

function makeId() { return Math.random().toString(36).slice(2, 9) }

const OBSTACLE_SHAPES = [
  { emoji: '📦', w: 5, h: 8 },
  { emoji: '🧱', w: 6, h: 6 },
  { emoji: '🚧', w: 7, h: 9 },
  { emoji: '🪨', w: 5, h: 7 },
  { emoji: '⚠️', w: 4, h: 6 },
]
const POWERUP_TYPES = [
  { type: 'speed', emoji: '⚡', label: 'Tăng tốc' },
  { type: 'shield', emoji: '🛡️', label: 'Khiên' },
  { type: 'x2', emoji: '×2', label: 'Nhân điểm' },
]

export default function MathsRacingPlayScreen({ game, onFinish, onQuit }) {
  const [gameState, setGameState] = useState('ready')
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [hp, setHp] = useState(3)
  const [distance, setDistance] = useState(0)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)
  const [charLane, setCharLane] = useState(1)
  const [isJumping, setIsJumping] = useState(false)
  const [obstacles, setObstacles] = useState([])
  const [coinEntities, setCoinEntities] = useState([])
  const [powerups, setPowerups] = useState([])
  const [activePowerup, setActivePowerup] = useState(null)
  const [powerupTimer, setPowerupTimer] = useState(0)
  const [shieldActive, setShieldActive] = useState(false)
  const [speedBoostActive, setSpeedBoostActive] = useState(false)
  const [x2Active, setX2Active] = useState(false)
  const [mathChallenge, setMathChallenge] = useState(null)
  const [mathTimeLeft, setMathTimeLeft] = useState(MATH_TIME_LIMIT)
  const [mathSelected, setMathSelected] = useState(null)
  const [mathRevealed, setMathRevealed] = useState(false)
  const [flash, setFlash] = useState(null)
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem('maths-racing-best') || '0') } catch { return 0 }
  })
  const [showTouchControls, setShowTouchControls] = useState(false)
  const [bgOffset, setBgOffset] = useState(0)
  const [groundOffset, setGroundOffset] = useState(0)
  const [floatingTexts, setFloatingTexts] = useState([])

  const gameRef = useRef(null)
  const animRef = useRef(null)
  const lastTimeRef = useRef(0)
  const distanceRef = useRef(0)
  const levelRef = useRef(1)
  const speedRef = useRef(BASE_SPEED)
  const obstaclesRef = useRef([])
  const coinsRef = useRef([])
  const powerupsRef = useRef([])
  const charLaneRef = useRef(1)
  const isJumpingRef = useRef(false)
  const jumpStartRef = useRef(0)
  const hpRef = useRef(3)
  const scoreRef = useRef(0)
  const coinCountRef = useRef(0)
  const comboRef = useRef(0)
  const mathChallengeRef = useRef(null)
  const mathTimeLeftRef = useRef(MATH_TIME_LIMIT)
  const mathRevealedRef = useRef(false)
  const mathSelectedRef = useRef(null)
  const shieldActiveRef = useRef(false)
  const speedBoostActiveRef = useRef(false)
  const x2ActiveRef = useRef(false)
  const powerupTypeRef = useRef(null)
  const powerupTimerRef = useRef(0)
  const obstacleTimerRef = useRef(0)
  const coinTimerRef = useRef(0)
  const mathTimerRef = useRef(0)
  const powerupSpawnTimerRef = useRef(0)
  const gameStateRef = useRef('ready')
  const frameCountRef = useRef(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const check = () => setShowTouchControls(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const addFloatingText = useCallback((text, x, y, color) => {
    const id = makeId()
    setFloatingTexts(prev => [...prev, { id, text, x, y, color, created: Date.now() }])
    setTimeout(() => setFloatingTexts(prev => prev.filter(f => f.id !== id)), 1200)
  }, [])

  const handleGameOver = useCallback(() => {
    gameStateRef.current = 'gameover'
    setGameState('gameover')
    const finalScore = scoreRef.current
    if (finalScore > bestScore) {
      setBestScore(finalScore)
      try { localStorage.setItem('maths-racing-best', String(finalScore)) } catch {}
    }
    const timeUsed = Math.round((Date.now() - startRef.current) / 1000)
    onFinish({ score: finalScore, correct: comboRef.current, timeUsed })
  }, [bestScore, onFinish])

  const spawnObstacle = useCallback(() => {
    const lane = Math.floor(Math.random() * LANE_COUNT)
    const shape = OBSTACLE_SHAPES[Math.floor(Math.random() * OBSTACLE_SHAPES.length)]
    const obs = {
      id: makeId(), lane, x: SPAWN_X, emoji: shape.emoji,
      w: shape.w, h: shape.h, hit: false,
    }
    obstaclesRef.current = [...obstaclesRef.current, obs]
    setObstacles([...obstaclesRef.current])
  }, [])

  const spawnCoin = useCallback(() => {
    const lane = Math.floor(Math.random() * LANE_COUNT)
    const coin = { id: makeId(), lane, x: SPAWN_X, collected: false }
    coinsRef.current = [...coinsRef.current, coin]
    setCoinEntities([...coinsRef.current])
  }, [])

  const spawnPowerup = useCallback(() => {
    const lane = Math.floor(Math.random() * LANE_COUNT)
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
    const pu = { id: makeId(), lane, x: SPAWN_X, ...type, collected: false }
    powerupsRef.current = [...powerupsRef.current, pu]
    setPowerups([...powerupsRef.current])
  }, [])

  const startMathChallenge = useCallback(() => {
    if (mathChallengeRef.current) return
    const q = generateMathQuestion()
    mathChallengeRef.current = q
    mathTimeLeftRef.current = MATH_TIME_LIMIT
    mathRevealedRef.current = false
    mathSelectedRef.current = null
    setMathChallenge(q)
    setMathTimeLeft(MATH_TIME_LIMIT)
    setMathSelected(null)
    setMathRevealed(false)
  }, [])

  const answerMath = useCallback((option) => {
    if (mathRevealedRef.current || !mathChallengeRef.current) return
    const correct = option === mathChallengeRef.current.answer
    mathSelectedRef.current = option
    mathRevealedRef.current = true
    setMathSelected(option)
    setMathRevealed(true)
    if (correct) {
      const bonus = 100 + comboRef.current * 25
      scoreRef.current += bonus
      comboRef.current += 1
      speedBoostActiveRef.current = true
      powerupTimerRef.current = 3000
      setScore(scoreRef.current)
      setCombo(comboRef.current)
      setSpeedBoostActive(true)
      addFloatingText(`+${bonus}`, 50, 30, '#1B998B')
      addFloatingText('Combo ×' + comboRef.current, 50, 45, '#F4B942')
    } else {
      comboRef.current = 0
      setCombo(0)
      speedBoostActiveRef.current = false
      setSpeedBoostActive(false)
      addFloatingText('Sai rồi!', 50, 30, '#E4572E')
    }
    setTimeout(() => {
      mathChallengeRef.current = null
      mathRevealedRef.current = false
      mathSelectedRef.current = null
      setMathChallenge(null)
      setMathRevealed(false)
      setMathSelected(null)
    }, 1500)
  }, [addFloatingText])

  const gameLoop = useCallback((timestamp) => {
    if (gameStateRef.current !== 'playing') return
    const dt = lastTimeRef.current ? Math.min(timestamp - lastTimeRef.current, 50) : 16
    lastTimeRef.current = timestamp

    const speedMult = speedBoostActiveRef.current ? 1.8 : 1
    const currentSpeed = speedRef.current * speedMult
    const dist = currentSpeed * dt * 0.06
    distanceRef.current += dist
    setDistance(Math.floor(distanceRef.current))

    const newLevel = Math.floor(distanceRef.current / LEVEL_DISTANCE) + 1
    if (newLevel !== levelRef.current) {
      levelRef.current = newLevel
      speedRef.current = BASE_SPEED + (newLevel - 1) * SPEED_PER_LEVEL
      setLevel(newLevel)
      addFloatingText(`Level ${newLevel}!`, 50, 25, '#F4B942')
    }

    setBgOffset(prev => (prev + currentSpeed * dt * 0.3) % 100)
    setGroundOffset(prev => (prev + currentSpeed * dt * 0.5) % 40)

    if (isJumpingRef.current) {
      const elapsed = Date.now() - jumpStartRef.current
      if (elapsed >= JUMP_DURATION) {
        isJumpingRef.current = false
        setIsJumping(false)
      }
    }

    obstacleTimerRef.current += dt
    const obsInterval = Math.max(1000, OBSTACLE_INTERVAL - levelRef.current * 120)
    if (obstacleTimerRef.current >= obsInterval) {
      obstacleTimerRef.current = 0
      spawnObstacle()
      if (levelRef.current > 3 && Math.random() < 0.3) spawnObstacle()
    }

    coinTimerRef.current += dt
    if (coinTimerRef.current >= COIN_INTERVAL) {
      coinTimerRef.current = 0
      spawnCoin()
    }

    powerupSpawnTimerRef.current += dt
    if (powerupSpawnTimerRef.current >= POWERUP_INTERVAL) {
      powerupSpawnTimerRef.current = 0
      spawnPowerup()
    }

    if (powerupTimerRef.current > 0) {
      powerupTimerRef.current -= dt
      setPowerupTimer(Math.ceil(powerupTimerRef.current))
      if (powerupTimerRef.current <= 0) {
        speedBoostActiveRef.current = false
        x2ActiveRef.current = false
        shieldActiveRef.current = false
        setSpeedBoostActive(false)
        setX2Active(false)
        setShieldActive(false)
        setActivePowerup(null)
      }
    }

    if (!mathChallengeRef.current) {
      mathTimerRef.current += dt
      if (mathTimerRef.current >= MATH_INTERVAL) {
        mathTimerRef.current = 0
        startMathChallenge()
      }
    } else if (!mathRevealedRef.current) {
      mathTimeLeftRef.current -= dt / 1000
      setMathTimeLeft(Math.max(0, mathTimeLeftRef.current))
      if (mathTimeLeftRef.current <= 0) {
        answerMath(null)
      }
    }

    const charY = GROUND_Y[charLaneRef.current]
    const jumpOffset = isJumpingRef.current
      ? -JUMP_HEIGHT * Math.sin(((Date.now() - jumpStartRef.current) / JUMP_DURATION) * Math.PI)
      : 0

    const updatedObs = obstaclesRef.current
      .map(o => ({ ...o, x: o.x - currentSpeed * dt * 0.06 }))
      .filter(o => o.x > DESPAWN_X)
    obstaclesRef.current = updatedObs
    setObstacles([...updatedObs])

    for (const o of updatedObs) {
      if (o.hit) continue
      if (o.lane === charLaneRef.current) {
        const oLeft = o.x
        const oRight = o.x + o.w
        const cLeft = CHAR_X
        const cRight = CHAR_X + 6
        if (cRight > oLeft && cLeft < oRight) {
          if (!isJumpingRef.current || jumpOffset > -5) {
            o.hit = true
            if (shieldActiveRef.current) {
              shieldActiveRef.current = false
              setShieldActive(false)
              setActivePowerup(null)
              addFloatingText('Khiên đỡ!', 50, 40, '#4C8DFF')
              setFlash('shield')
            } else {
              hpRef.current -= 1
              setHp(hpRef.current)
              comboRef.current = 0
              setCombo(0)
              setFlash('hit')
              addFloatingText('-1 ❤️', 50, 40, '#E4572E')
              if (hpRef.current <= 0) {
                handleGameOver()
                return
              }
            }
            setTimeout(() => setFlash(null), 400)
          }
        }
      }
    }

    const updatedCoins = coinsRef.current
      .map(c => ({ ...c, x: c.x - currentSpeed * dt * 0.06 }))
      .filter(c => c.x > DESPAWN_X)
    coinsRef.current = updatedCoins
    setCoinEntities([...updatedCoins])

    for (const c of updatedCoins) {
      if (c.collected) continue
      if (c.lane === charLaneRef.current) {
        const cLeft = c.x
        const cRight = c.x + 4
        const pLeft = CHAR_X
        const pRight = CHAR_X + 6
        if (pRight > cLeft && pLeft < cRight) {
          c.collected = true
          const pts = x2ActiveRef.current ? 20 : 10
          scoreRef.current += pts
          coinCountRef.current += 1
          setScore(scoreRef.current)
          setCoins(coinCountRef.current)
          addFloatingText(`+${pts}`, c.x, GROUND_Y[c.lane] - 5, '#F4B942')
        }
      }
    }

    const updatedPUs = powerupsRef.current
      .map(p => ({ ...p, x: p.x - currentSpeed * dt * 0.06 }))
      .filter(p => p.x > DESPAWN_X)
    powerupsRef.current = updatedPUs
    setPowerups([...updatedPUs])

    for (const p of updatedPUs) {
      if (p.collected) continue
      if (p.lane === charLaneRef.current) {
        const pLeft = p.x
        const pRight = p.x + 5
        const cLeft = CHAR_X
        const cRight = CHAR_X + 6
        if (cRight > pLeft && cLeft < pRight) {
          p.collected = true
          if (p.type === 'speed') {
            speedBoostActiveRef.current = true
            powerupTimerRef.current = 5000
            setActivePowerup('speed')
            setSpeedBoostActive(true)
            addFloatingText('⚡ Tăng tốc!', 50, 35, '#F4B942')
          } else if (p.type === 'shield') {
            shieldActiveRef.current = true
            powerupTimerRef.current = 8000
            setActivePowerup('shield')
            setShieldActive(true)
            addFloatingText('🛡️ Khiên!', 50, 35, '#4C8DFF')
          } else if (p.type === 'x2') {
            x2ActiveRef.current = true
            powerupTimerRef.current = 6000
            setActivePowerup('x2')
            setX2Active(true)
            addFloatingText('×2 Điểm!', 50, 35, '#8B6FF1')
          }
        }
      }
    }

    frameCountRef.current++
    animRef.current = requestAnimationFrame(gameLoop)
  }, [spawnObstacle, spawnCoin, spawnPowerup, startMathChallenge, answerMath, handleGameOver, addFloatingText])

  const startGame = useCallback(() => {
    distanceRef.current = 0
    levelRef.current = 1
    speedRef.current = BASE_SPEED
    obstaclesRef.current = []
    coinsRef.current = []
    powerupsRef.current = []
    charLaneRef.current = 1
    isJumpingRef.current = false
    hpRef.current = 3
    scoreRef.current = 0
    coinCountRef.current = 0
    comboRef.current = 0
    mathChallengeRef.current = null
    mathRevealedRef.current = false
    mathSelectedRef.current = null
    shieldActiveRef.current = false
    speedBoostActiveRef.current = false
    x2ActiveRef.current = false
    powerupTypeRef.current = null
    powerupTimerRef.current = 0
    obstacleTimerRef.current = 0
    coinTimerRef.current = 0
    mathTimerRef.current = 5000
    powerupSpawnTimerRef.current = 0
    frameCountRef.current = 0
    lastTimeRef.current = 0
    startRef.current = Date.now()

    setDistance(0)
    setLevel(1)
    setHp(3)
    setScore(0)
    setCoins(0)
    setCombo(0)
    setCharLane(1)
    setIsJumping(false)
    setObstacles([])
    setCoinEntities([])
    setPowerups([])
    setActivePowerup(null)
    setPowerupTimer(0)
    setSpeedBoostActive(false)
    setShieldActive(false)
    setX2Active(false)
    setMathChallenge(null)
    setMathTimeLeft(MATH_TIME_LIMIT)
    setMathSelected(null)
    setMathRevealed(false)
    setBgOffset(0)
    setGroundOffset(0)
    setFloatingTexts([])
    setFlash(null)

    gameStateRef.current = 'playing'
    setGameState('playing')
    animRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop])

  const moveUp = useCallback(() => {
    if (gameStateRef.current !== 'playing') return
    if (charLaneRef.current > 0) {
      charLaneRef.current -= 1
      setCharLane(charLaneRef.current)
    }
  }, [])

  const moveDown = useCallback(() => {
    if (gameStateRef.current !== 'playing') return
    if (charLaneRef.current < LANE_COUNT - 1) {
      charLaneRef.current += 1
      setCharLane(charLaneRef.current)
    }
  }, [])

  const jump = useCallback(() => {
    if (gameStateRef.current !== 'playing') return
    if (!isJumpingRef.current) {
      isJumpingRef.current = true
      jumpStartRef.current = Date.now()
      setIsJumping(true)
    }
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (gameStateRef.current === 'ready') {
        if (e.key === ' ' || e.key === 'Enter') { startGame(); return }
      }
      if (gameStateRef.current === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter') { startGame(); return }
      }
      if (gameStateRef.current !== 'playing') return
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); moveUp(); break
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); moveDown(); break
        case ' ': case 'ArrowRight': case 'ArrowLeft': e.preventDefault(); jump(); break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [startGame, moveUp, moveDown, jump])

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const charY = GROUND_Y[charLane] + (isJumping
    ? -JUMP_HEIGHT * Math.sin(((Date.now() - (jumpStartRef.current || 0)) / JUMP_DURATION) * Math.PI)
    : 0)

  return (
    <div className="flex-1 flex flex-col bg-[#0B1330] overflow-hidden select-none" style={{ touchAction: 'none' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-2 bg-[#16233A] border-b border-white/10 flex-wrap z-20 relative">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏎️</span>
          <h1 className="font-display text-base sm:text-lg">
            <span className="text-[#F4B942]">MATHS</span>{' '}
            <span className="text-[#E4572E]">RACING</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/70 font-body flex-wrap">
          <span className={speedBoostActive ? 'text-[#F4B942] font-bold' : ''}>
            ⚡ Lv.{level}
          </span>
          <span>📏 {distance}m</span>
          <span className="text-[#F4B942] font-mono font-bold">⭐ {score}</span>
          <span>🪙 {coins}</span>
          <span className={combo > 0 ? 'text-[#1B998B] font-bold' : ''}>🔥 {combo}</span>
          <span>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < hp ? '' : 'opacity-20'}>❤️</span>
            ))}
          </span>
        </div>
        <button onClick={onQuit}
          className="font-display text-xs text-[#E4572E] border border-[#E4572E]/40 rounded-xl px-3 py-1.5 hover:bg-[#E4572E]/10 transition">
          Thoát
        </button>
      </div>

      {/* Game Area */}
      <div ref={gameRef} className="flex-1 relative overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, #0B1330 0%, #1B2A5E 40%, #2A4770 70%, #3D6894 100%)`
        }} />

        {/* Stars */}
        {Array.from({ length: 30 }, (_, i) => (
          <div key={`star-${i}`} className="absolute rounded-full bg-white" style={{
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 13 + 3) % 45}%`,
            width: (i % 3) + 1,
            height: (i % 3) + 1,
            opacity: 0.3 + (i % 5) * 0.12,
          }} />
        ))}

        {/* Scrolling ground */}
        <div className="absolute bottom-0 left-0 right-0 h-[42%]" style={{
          background: 'linear-gradient(180deg, #2D5A27 0%, #1E3D1A 100%)'
        }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.06) 38px, rgba(255,255,255,0.06) 40px)`,
            transform: `translateX(-${groundOffset}px)`
          }} />
          {/* Road lanes */}
          {GROUND_Y.map((y, i) => (
            <div key={i} className="absolute left-0 right-0 h-1" style={{
              top: `${y + 55}%`,
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.15) 18px, rgba(255,255,255,0.15) 24px)`,
              transform: `translateX(-${groundOffset}px)`
            }} />
          ))}
          {/* Trees scrolling */}
          {Array.from({ length: 8 }, (_, i) => (
            <div key={`tree-${i}`} className="absolute text-2xl" style={{
              left: `${((i * 14 - bgOffset * 0.3) % 120 + 120) % 120 - 10}%`,
              bottom: `${35 + (i % 3) * 5}%`,
              opacity: 0.5,
            }}>🌲</div>
          ))}
        </div>

        {/* Obstacles */}
        {obstacles.map(o => (
          <div key={o.id} className="absolute transition-none" style={{
            left: `${o.x}%`,
            top: `${GROUND_Y[o.lane] + 53}%`,
            fontSize: '1.8rem',
            filter: o.hit ? 'brightness(2)' : 'none',
            zIndex: 5,
          }}>
            {o.emoji}
          </div>
        ))}

        {/* Coins */}
        {coinEntities.filter(c => !c.collected).map(c => (
          <div key={c.id} className="absolute anim-pop" style={{
            left: `${c.x}%`,
            top: `${GROUND_Y[c.lane] + 55}%`,
            fontSize: '1.2rem',
            zIndex: 4,
            animation: 'float-slow 2s ease-in-out infinite',
          }}>🪙</div>
        ))}

        {/* Powerups */}
        {powerups.filter(p => !p.collected).map(p => (
          <div key={p.id} className="absolute anim-pop" style={{
            left: `${p.x}%`,
            top: `${GROUND_Y[p.lane] + 52}%`,
            fontSize: '1.6rem',
            zIndex: 6,
            animation: 'bob-hero 1s ease-in-out infinite',
          }}>{p.emoji}</div>
        ))}

        {/* Character */}
        {gameState !== 'ready' && (
          <div className="absolute" style={{
            left: `${CHAR_X}%`,
            top: `${charY + 50}%`,
            fontSize: '2.2rem',
            zIndex: 10,
            transition: isJumping ? 'none' : 'top 0.12s ease-out',
            filter: flash === 'hit' ? 'brightness(2) hue-rotate(180deg)' : 'none',
          }}>
            <div className={`relative ${!isJumping ? 'run-cycle' : ''}`}>
              <span>🏃</span>
              {shieldActive && (
                <div className="absolute -inset-2 rounded-full border-2 border-[#4C8DFF] animate-pulse opacity-70" />
              )}
              {speedBoostActive && (
                <div className="absolute -right-3 top-1 text-sm">⚡</div>
              )}
              {x2Active && (
                <div className="absolute -right-4 -top-1 text-xs font-bold text-[#8B6FF1] bg-white rounded px-0.5">×2</div>
              )}
            </div>
          </div>
        )}

        {/* Floating texts */}
        {floatingTexts.map(ft => (
          <div key={ft.id} className="absolute font-display font-bold text-sm pointer-events-none" style={{
            left: `${ft.x}%`,
            top: `${ft.y}%`,
            color: ft.color,
            zIndex: 20,
            animation: 'float-slow 1.2s ease-out forwards',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}>{ft.text}</div>
        ))}

        {/* Powerup active indicator */}
        {activePowerup && powerupTimer > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 z-20">
            <span className="text-lg">
              {activePowerup === 'speed' ? '⚡' : activePowerup === 'shield' ? '🛡️' : '×2'}
            </span>
            <span className="text-white text-xs font-mono">{Math.ceil(powerupTimer / 1000)}s</span>
          </div>
        )}

        {/* Math Challenge Overlay */}
        {mathChallenge && (
          <div className="absolute inset-0 flex items-center justify-center z-30" style={{ background: 'rgba(0,0,0,0.65)' }}>
            <div className="note-card p-5 sm:p-6 max-w-sm w-[90%] anim-pop">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#8A7C63] uppercase">Thử thách toán học</span>
                <span className={`font-mono text-sm font-bold ${mathTimeLeft <= 3 ? 'text-[#E4572E]' : 'text-[#1B998B]'}`}>
                  ⏱ {Math.ceil(mathTimeLeft)}s
                </span>
              </div>
              <div className="text-center mb-5">
                <p className="font-display text-2xl sm:text-3xl text-[#20283A] font-bold">{mathChallenge.text} = ?</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mathChallenge.options.map((opt, i) => {
                  let cls = 'border-2 border-[#E7D9BE] hover:border-[#1B998B] hover:bg-[#1B998B]/10'
                  if (mathRevealed) {
                    if (opt === mathChallenge.answer) cls = 'border-2 border-[#1B998B] bg-[#1B998B]/20'
                    else if (opt === mathSelected) cls = 'border-2 border-[#E4572E] bg-[#E4572E]/20'
                    else cls = 'border-2 border-[#E7D9BE] opacity-40'
                  }
                  return (
                    <button key={i} disabled={mathRevealed} onClick={() => answerMath(opt)}
                      className={`rounded-2xl py-4 font-display text-xl font-bold text-[#20283A] transition ${cls}`}>
                      {opt}
                    </button>
                  )
                })}
              </div>
              {mathRevealed && (
                <p className={`text-center mt-4 font-display text-sm ${mathSelected === mathChallenge.answer ? 'text-[#1B998B]' : 'text-[#E4572E]'}`}>
                  {mathSelected === mathChallenge.answer
                    ? `Đúng rồi! +${100 + (combo - 1) * 25} điểm`
                    : 'Sai rồi! Combo bị reset'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Touch Controls */}
        {showTouchControls && gameState === 'playing' && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-between px-4 z-20 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
              <button onTouchStart={(e) => { e.preventDefault(); moveUp() }}
                className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl active:bg-white/30 transition">
                ▲
              </button>
              <button onTouchStart={(e) => { e.preventDefault(); moveDown() }}
                className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl active:bg-white/30 transition">
                ▼
              </button>
            </div>
            <button onTouchStart={(e) => { e.preventDefault(); jump() }}
              className="w-20 h-20 rounded-full bg-[#F4B942]/30 backdrop-blur-sm border-2 border-[#F4B942]/50 flex items-center justify-center text-3xl active:bg-[#F4B942]/50 transition pointer-events-auto">
              🦘
            </button>
          </div>
        )}
      </div>

      {/* Ready Screen */}
      {gameState === 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center z-40" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="note-card p-8 max-w-md w-[90%] text-center anim-pop">
            <div className="text-5xl mb-4">🏎️</div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#20283A] mb-2">
              MATHS <span className="text-[#E4572E]">RACING</span>
            </h2>
            <p className="text-[#8A7C63] font-body text-sm mb-6">
              Chạy, thu thập xu, trả lời toán đúng!
            </p>
            <div className="note-card p-4 mb-6 text-left text-sm text-[#8A7C63] font-body space-y-1">
              <p><span className="text-[#20283A] font-semibold">⌨️ WASD / Phím mũi tên:</span> Di chuyển & Nhảy</p>
              <p><span className="text-[#20283A] font-semibold">📱 Touch:</span> Nút ▲▼ và 🦘</p>
              <p><span className="text-[#20283A] font-semibold">🪙 Xu:</span> +10 điểm</p>
              <p><span className="text-[#20283A] font-semibold">📐 Toán:</span> Trả lời đúng +100, sai reset combo</p>
            </div>
            <button onClick={startGame}
              className="bg-[#1B998B] hover:bg-[#178a7e] text-white font-display text-lg px-8 py-3 rounded-2xl transition shadow-lg shadow-[#1B998B]/30">
              Bắt đầu 🏁
            </button>
            <p className="text-[#8A7C63] text-xs mt-3 font-body">Nhấn Space hoặc Enter để bắt đầu</p>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center z-40" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="note-card p-8 max-w-md w-[90%] text-center anim-pop">
            <div className="text-5xl mb-3">🏁</div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#20283A] mb-1">GAME OVER</h2>
            <p className="text-[#8A7C63] font-body text-sm mb-5">Bạn đã về đích!</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="note-card p-3">
                <div className="text-xs text-[#8A7C63] font-body">Điểm</div>
                <div className="font-display text-2xl text-[#F4B942] font-bold">{score}</div>
              </div>
              <div className="note-card p-3">
                <div className="text-xs text-[#8A7C63] font-body">Xu</div>
                <div className="font-display text-2xl text-[#20283A] font-bold">🪙 {coins}</div>
              </div>
              <div className="note-card p-3">
                <div className="text-xs text-[#8A7C63] font-body">Khoảng cách</div>
                <div className="font-display text-xl text-[#20283A] font-bold">{distance}m</div>
              </div>
              <div className="note-card p-3">
                <div className="text-xs text-[#8A7C63] font-body">Level</div>
                <div className="font-display text-xl text-[#1B998B] font-bold">{level}</div>
              </div>
            </div>

            {score >= bestScore && score > 0 && (
              <div className="bg-[#F4B942]/20 border border-[#F4B942]/40 rounded-xl px-4 py-2 mb-4">
                <span className="font-display text-sm text-[#8a6a10]">🏆 Kỷ lục mới!</span>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={startGame}
                className="bg-[#1B998B] hover:bg-[#178a7e] text-white font-display px-6 py-3 rounded-2xl transition shadow-lg shadow-[#1B998B]/30">
                Chơi lại 🔄
              </button>
              <button onClick={onQuit}
                className="border-2 border-[#E4572E] text-[#E4572E] hover:bg-[#E4572E]/10 font-display px-6 py-3 rounded-2xl transition">
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
