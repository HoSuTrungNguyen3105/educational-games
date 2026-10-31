// src/games/offline/games-src/snake.js — Rắn Săn Mồi
// Rắn ăn trái cây, dài dần và leo màn. Mỗi màn thêm chướng ngại vật,
// tốc độ nhanh hơn; có nút tạm dừng cho người chơi thở một chút.

const SNAKE_N = 15;

function snakeValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Array.isArray(s.snake) && s.snake.length > 0 && s.snake.length < SNAKE_N * SNAKE_N &&
        s.snake.every((p) => p && Number.isInteger(p.x) && Number.isInteger(p.y) &&
            p.x >= 0 && p.x < SNAKE_N && p.y >= 0 && p.y < SNAKE_N) &&
        s.dir && Number.isInteger(s.dir.x) && Number.isInteger(s.dir.y) &&
        Array.isArray(s.queue) && s.queue.every((d) => d && Number.isInteger(d.x) && Number.isInteger(d.y)) &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        Number.isFinite(s.speed) && s.speed >= 60 && s.speed <= 400 &&
        Number.isInteger(s.level) && s.level >= 1 && s.level <= 6 &&
        Array.isArray(s.obstacles) && s.obstacles.every((p) => p && Number.isInteger(p.x) && Number.isInteger(p.y) &&
            p.x >= 0 && p.x < SNAKE_N && p.y >= 0 && p.y < SNAKE_N) &&
        typeof s.paused === 'boolean' &&
        (s.food === null || (s.food && Number.isInteger(s.food.x) && Number.isInteger(s.food.y)));
}

function startSnake(root, mode, modeIndex, resume) {
    const N = SNAKE_N;
    const id = 'snake';
    let snake, dir, queue, started, food, score, lives, speed, level, obstacles, paused;
    let ended = false;
    let tickId = null;

    function schedule() {
        if (tickId) clearTimeout(tickId);
        tickId = T.set(tick, speed);
    }

    function freshSnake() {
        snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }];
        dir = { x: 1, y: 0 };
        queue = [];
        started = false;
    }

    function spawnFood() {
        const blocked = new Set([
            ...snake.map((p) => `${p.x},${p.y}`),
            ...obstacles.map((p) => `${p.x},${p.y}`),
        ]);
        const open = [];
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                if (!blocked.has(`${x},${y}`)) open.push({ x, y });
            }
        }
        return open.length ? open[rnd(0, open.length - 1)] : null;
    }

    function levelFor(value) {
        return Math.min(6, 1 + Math.floor(value / 60));
    }

    function addObstacles(count) {
        for (let k = 0; k < count; k++) {
            for (let attempt = 0; attempt < 80; attempt++) {
                const p = { x: rnd(0, N - 1), y: rnd(0, N - 1) };
                if (p.y === 7 && p.x < 7) continue;
                if (snake.some((s) => s.x === p.x && s.y === p.y)) continue;
                if (p.x === food?.x && p.y === food?.y) continue;
                if (obstacles.some((o) => o.x === p.x && o.y === p.y)) continue;
                obstacles.push(p);
                break;
            }
        }
    }

    if (resume) {
        ({ snake, dir, queue, started, food, score, lives, speed, level, obstacles, paused } = {
            ...resume,
            queue: resume.queue.map((d) => ({ ...d })),
            obstacles: resume.obstacles.map((p) => ({ ...p })),
        });
        if (!food || snake.some((s) => s.x === food.x && s.y === food.y) ||
            obstacles.some((o) => o.x === food.x && o.y === food.y)) food = spawnFood();
    } else {
        score = 0;
        lives = mode.lives;
        speed = mode.k === 'easy' ? 215 : mode.k === 'mid' ? 190 : 165;
        level = 1;
        obstacles = [];
        paused = false;
        freshSnake();
        food = spawnFood();
    }

    root.innerHTML = `<div class="hud">
            <span>⭐ <b id="sc">0</b></span>
            <span class="hearts" id="lv">❤️</span>
            <span>📏 <b id="ln">3</b> · Màn <b id="m">1</b></span>
        </div>
        <canvas id="cv"></canvas>
        <div class="dpad">
            <button class="u" data-d="u">▲</button><button class="l" data-d="l">◀</button>
            <button class="d" data-d="d">▼</button><button class="r" data-d="r">▶</button>
        </div>
        <div class="row" style="margin-top:8px">
            <button class="btn alt" id="pause">${paused ? '▶ Chơi tiếp' : '⏸ Tạm dừng'}</button>
        </div>
        <p class="hint">Ăn trái cây để dài thêm và lên màn. Mỗi màn có thêm chướng ngại vật. Vuốt, dùng phím mũi tên hoặc chạm nút.</p>`;

    const cv = root.querySelector('#cv');
    const width = Math.max(240, Math.min((root.clientWidth || 340) - 8, 450));
    const size = Math.floor(width / N) * N;
    const ctx = fitCanvas(cv, size, size);
    const cell = size / N;

    function hud() {
        const sc = root.querySelector('#sc');
        const lv = root.querySelector('#lv');
        const ln = root.querySelector('#ln');
        const m = root.querySelector('#m');
        if (sc) sc.textContent = score;
        if (lv) lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';
        if (ln) ln.textContent = snake.length;
        if (m) m.textContent = level;
    }

    function save() {
        if (ended) return;
        saveOfflineRun(id, {
            v: 2, mode: modeIndex, snake, dir, queue, started, food, score, lives, speed, level, obstacles, paused,
        });
    }

    function setDir(dx, dy) {
        if (ended || paused) return;
        const last = queue.length ? queue[queue.length - 1] : dir;
        if ((last.x === -dx && last.y === -dy) || (last.x === dx && last.y === dy)) return;
        if (queue.length < 2) queue.push({ x: dx, y: dy });
        started = true;
        save();
    }

    function draw() {
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                ctx.fillStyle = (x + y) % 2 ? '#fff6d9' : '#fffdf3';
                ctx.fillRect(x * cell, y * cell, cell, cell);
            }
        }
        obstacles.forEach((o) => {
            ctx.fillStyle = '#8a6a45';
            ctx.strokeStyle = '#1d2e4a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(o.x * cell + 1.5, o.y * cell + 1.5, cell - 3, cell - 3, cell * .2);
            else ctx.rect(o.x * cell + 1.5, o.y * cell + 1.5, cell - 3, cell - 3);
            ctx.fill();
            ctx.stroke();
        });
        if (food) {
            const cx = food.x * cell + cell / 2;
            const cy = food.y * cell + cell / 2;
            ctx.fillStyle = '#e4572e';
            ctx.strokeStyle = '#1d2e4a';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx, cy, cell * .38, 0, 7);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#56bd72';
            ctx.fillRect(cx - 2, cy - cell * .48, 4, cell * .18);
        }
        snake.forEach((s, k) => {
            const pad = k ? cell * .1 : cell * .04;
            ctx.fillStyle = k ? (k % 2 ? '#1b998b' : '#157f74') : '#1d2e4a';
            ctx.strokeStyle = '#1d2e4a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * .28);
            else ctx.rect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2);
            ctx.fill();
            if (k) ctx.stroke();
        });
        const h = snake[0];
        ctx.fillStyle = '#fff';
        [[.3, .35], [.7, .35]].forEach(([ex, ey]) => {
            ctx.beginPath();
            ctx.arc(h.x * cell + cell * ex, h.y * cell + cell * ey, cell * .12, 0, 7);
            ctx.fill();
        });
        if (paused || !started) {
            ctx.fillStyle = 'rgba(29,46,74,.78)';
            ctx.fillRect(0, size / 2 - 28, size, 56);
            ctx.fillStyle = '#fff';
            ctx.font = `700 ${Math.max(14, Math.round(size / 24))}px Be Vietnam Pro,system-ui,sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(paused ? 'Tạm dừng — chạm để chơi tiếp' : 'Vuốt hoặc bấm hướng để bắt đầu', size / 2, size / 2);
        }
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (level >= 3) S.flags.snake = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 3),
            lines: [`Rắn dài ${snake.length}`, `Lên được màn ${level}`],
            replay: snakeGame, details: { length: snake.length, level },
        });
    }

    function loseLife() {
        lives--;
        sfx.bad();
        if (lives <= 0) { end(); return false; }
        obstacles = obstacles.filter((o) => !(o.y === 7 && o.x < 7));
        freshSnake();
        food = spawnFood();
        paused = false;
        hud();
        save();
        return true;
    }

    function tick() {
        if (ended || paused) return;
        if (started) {
            if (queue.length) dir = queue.shift();
            const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
            const hitWall = obstacles.some((o) => o.x === h.x && o.y === h.y);
            if (hitWall || snake.some((s) => s.x === h.x && s.y === h.y)) {
                if (!loseLife()) return;
            } else {
                snake.unshift(h);
                if (food && h.x === food.x && h.y === food.y) {
                    score += 10;
                    sfx.ok();
                    speed = Math.max(80, speed - 3);
                    const nextLevel = levelFor(score);
                    if (nextLevel > level) {
                        level = nextLevel;
                        addObstacles(2);
                        sfx.win();
                    }
                    food = spawnFood();
                } else {
                    snake.pop();
                }
                hud();
                save();
            }
        }
        draw();
        schedule();
    }

    root.onclick = (e) => {
        const b = e.target.closest('[data-d]');
        if (b) {
            const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
            setDir(...DIRS[b.dataset.d]);
            return;
        }
        if (e.target.closest('#pause')) {
            paused = !paused;
            if (tickId) { clearTimeout(tickId); tickId = null; }
            const btn = root.querySelector('#pause');
            if (btn) btn.textContent = paused ? '▶ Chơi tiếp' : '⏸ Tạm dừng';
            draw();
            save();
            if (!paused) schedule();
        }
    };

    const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
    onKey = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            paused = !paused;
            if (tickId) { clearTimeout(tickId); tickId = null; }
            const btn = root.querySelector('#pause');
            if (btn) btn.textContent = paused ? '▶ Chơi tiếp' : '⏸ Tạm dừng';
            draw();
            save();
            if (!paused) schedule();
            return;
        }
        const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r' }[e.key];
        if (m) { e.preventDefault(); setDir(...DIRS[m]); }
    };

    let sx, sy;
    cv.ontouchstart = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    cv.ontouchend = (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
        if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);
    };

    hud();
    draw();
    save();
    schedule();
}

function snakeGame(root) {
    const saved = loadOfflineRun('snake');
    if (snakeValid(saved)) {
        startSnake(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('snake');

    gqIntro(root, {
        id: 'snake', icon: '🐍', name: 'Rắn Săn Mồi',
        desc: 'Điều khiển rắn ăn trái cây, dài thêm qua từng màn và né chướng ngại vật.',
        steps: [
            'Vuốt trên bàn chơi hoặc dùng nút mũi tên để đổi hướng.',
            'Ăn trái cây để được điểm, dài thêm và lên màn mới.',
            'Mỗi màn có thêm chướng ngại vật; đâm vào tường hay tự cắn sẽ mất mạng.',
        ],
    }, (mode, index) => startSnake(root, mode, index));
}

startSingleGame({
    id: 'snake',
    name: 'Rắn Săn Mồi',
    icon: '🐍',
    storageKey: 'offline_snake',
    mount: snakeGame,
    badges: [
        { id: 'snake', n: 'Lên màn 3', i: '🐍', ok: () => !!S.flags.snake },
    ],
});
