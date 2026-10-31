// src/games/offline/games-src/g2048.js — Fruit Garden
// A fruit version of 2048: swipe to merge two matching fruits; the goal is the 2048 melon.

const G2048_FRUITS = ['🍒', '🍓', '🍊', '🍋', '🥝', '🍇', '🍍', '🍑', '🥭', '🍎', '🍉'];
const G2048_COLORS = ['#ffe0e0', '#ffd6cf', '#ffe3b3', '#fff0a8', '#d8f3b0', '#c9e8ff', '#c7d9ff', '#e2ccff', '#ffcfe8', '#ffd7a1', '#b8f0d0'];
const G2048_TARGET = 2048;

function g2048Valid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Array.isArray(s.board) && s.board.length === 16 &&
        s.board.every((v) => Number.isSafeInteger(v) && v >= 0) &&
        Number.isSafeInteger(s.score) && s.score >= 0 &&
        Number.isInteger(s.undos) && s.undos >= 0 && s.undos <= 9 &&
        Array.isArray(s.hist) && s.hist.length <= 8 &&
        s.hist.every((h) => h && Array.isArray(h.board) && h.board.length === 16 &&
            h.board.every((v) => Number.isSafeInteger(v) && v >= 0) &&
            Number.isSafeInteger(h.score) && h.score >= 0) &&
        typeof s.over === 'boolean';
}

function start2048(root, mode, modeIndex, resume) {
    const id = 'g2048';
    let board = resume ? resume.board.slice() : Array(16).fill(0);
    let score = resume ? resume.score : 0;
    let undos = resume ? resume.undos : mode.lives;
    let hist = resume ? resume.hist.map((h) => ({ board: h.board.slice(), score: h.score })) : [];
    let over = resume ? resume.over : false;
    let newIdx = -1;
    let ended = false;

    function saveRun() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, board, score, undos, hist, over });
    }

    function add() {
        const empty = [];
        for (let i = 0; i < 16; i++) if (!board[i]) empty.push(i);
        if (!empty.length) return;
        const p = empty[rnd(0, empty.length - 1)];
        board[p] = Math.random() < (mode.k === 'hard' ? 0.18 : mode.k === 'easy' ? 0.05 : 0.1) ? 4 : 2;
        newIdx = p;
    }

    function slide(line) {
        const a = line.filter(Boolean);
        let gain = 0;
        for (let i = 0; i < a.length - 1; i++) {
            if (a[i] === a[i + 1]) {
                a[i] *= 2;
                gain += a[i];
                a.splice(i + 1, 1);
            }
        }
        while (a.length < 4) a.push(0);
        return { a, gain };
    }

    function canMove() {
        if (board.includes(0)) return true;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const v = board[r * 4 + c];
                if ((c < 3 && board[r * 4 + c + 1] === v) || (r < 3 && board[(r + 1) * 4 + c] === v)) return true;
            }
        }
        return false;
    }

    function layout() {
        root.innerHTML = `${gqHud(0, 0, '')}
            <div class="b48" id="bd"></div>
            <div class="row" style="margin-top:12px">
                <button class="btn alt" id="undo">↩ Undo (<span id="u">0</span>)</button>
                <button class="btn alt" id="stop">End game</button>
            </div>
            <p class="hint">Swipe or use the arrow keys to slide the whole garden. Two matching fruits that touch merge into a bigger fruit.</p>`;
        root.onclick = (e) => {
            if (ended) return;
            if (e.target.closest('#undo')) undo();
            else if (e.target.closest('#stop')) finishRun();
        };
    }

    function render() {
        const hud = root.querySelector('.hud');
        if (hud) {
            hud.innerHTML = `<span>⭐ <b id="sc">${score}</b></span>
                <span>🥇 <b>${G2048_FRUITS[Math.min(10, Math.max(0, Math.round(Math.log2(Math.max(...board, 2))) - 1))]}</b></span>
                <span>🎯 ${G2048_TARGET}</span>`;
        }
        const undoBtn = root.querySelector('#undo');
        const u = root.querySelector('#u');
        if (undoBtn) undoBtn.disabled = !undos || !hist.length;
        if (u) u.textContent = undos;
        const bd = root.querySelector('#bd');
        if (!bd) return;
        let html = '';
        for (let i = 0; i < 16; i++) {
            const v = board[i];
            if (!v) { html += '<div class="t48"></div>'; continue; }
            const k = Math.max(0, Math.round(Math.log2(v)) - 1);
            html += `<div class="t48 ${i === newIdx ? 'n' : ''}" style="background:${G2048_COLORS[Math.min(k, G2048_COLORS.length - 1)]}">${G2048_FRUITS[Math.min(k, G2048_FRUITS.length - 1)]}</div>`;
        }
        bd.innerHTML = html;
        newIdx = -1;
        if (Math.max(...board) >= G2048_TARGET) S.flags.f2048 = true;
    }

    function move(dir) {
        if (over || ended) return;
        let moved = false;
        let gain = 0;
        const nb = board.slice();
        for (let k = 0; k < 4; k++) {
            const idx = [0, 1, 2, 3].map((j) => (dir < 2 ? k * 4 + j : j * 4 + k));
            if (dir % 2 === 1) idx.reverse();
            const { a, gain: g } = slide(idx.map((i) => board[i]));
            idx.forEach((i, j) => { if (nb[i] !== a[j]) moved = true; nb[i] = a[j]; });
            gain += g;
        }
        if (!moved) return;
        hist.push({ board: board.slice(), score });
        if (hist.length > 8) hist.shift();
        board = nb;
        score += gain;
        add();
        sfx.tick();
        render();
        saveRun();
        if (!canMove()) {
            over = true;
            saveRun();
            T.set(finishRun, 850);
        }
    }

    function undo() {
        if (ended || over || !undos || !hist.length) return;
        const prev = hist.pop();
        board = prev.board.slice();
        score = prev.score;
        undos--;
        newIdx = -1;
        sfx.tick();
        render();
        saveRun();
    }

    function finishRun() {
        if (ended) return;
        ended = true;
        T.clear();
        const mx = Math.max(...board);
        const tier = G2048_FRUITS[Math.min(G2048_FRUITS.length - 1, Math.max(0, Math.round(Math.log2(mx)) - 1))];
        clearOfflineRun(id);
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 10),
            lines: [`Top fruit: ${tier}`, `${score} merge points`],
            replay: game2048, details: { top: mx },
        });
    }

    layout();
    if (!resume) { add(); add(); }
    render();
    saveRun();

    onKey = (e) => {
        const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key];
        if (m !== undefined) { e.preventDefault(); move(m); }
    };

    const bd = root.querySelector('#bd');
    let sx, sy;
    bd.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    bd.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);
    });
    let px, py;
    bd.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; } });
    bd.addEventListener('pointerup', (e) => {
        if (e.pointerType !== 'mouse' || px === undefined) return;
        const dx = e.clientX - px;
        const dy = e.clientY - py;
        px = undefined;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);
    });

    if (over) T.set(finishRun, 850);
}

function game2048(root) {
    const raw = loadOfflineRun('g2048');
    let saved = null;
    if (g2048Valid(raw)) saved = raw;
    else if (raw && Array.isArray(raw.board) && raw.board.length === 16 &&
        raw.board.every((v) => Number.isSafeInteger(v) && v >= 0)) {
        // Older saves only stored board/score — keep the game in progress.
        saved = {
            v: 2, mode: gqReadMode('g2048'), board: raw.board,
            score: Number.isSafeInteger(raw.score) && raw.score >= 0 ? raw.score : 0,
            over: !!raw.over, undos: 2, hist: [],
        };
    }

    if (saved && !saved.over) {
        start2048(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (raw) clearOfflineRun('g2048');

    gqIntro(root, {
        id: 'g2048', icon: '🍉', name: 'Fruit Garden',
        desc: 'Swipe to merge matching fruits, growing from cherries all the way to the 2048 watermelon.',
        steps: [
            'Every swipe slides the whole garden one way and a new fruit appears.',
            'Two matching fruits that touch merge into a bigger fruit.',
            'Harder modes give you fewer undos but a higher score multiplier.',
        ],
    }, (mode, index) => start2048(root, mode, index));
}

startSingleGame({
    id: 'g2048',
    name: 'Fruit Garden',
    icon: '🍉',
    storageKey: 'offline_g2048',
    mount: game2048,
    badges: [
        { id: 'vine', n: 'Reach the 2048 fruit', i: '🍉', ok: () => !!S.flags.f2048 },
    ],
});
