// src/games/offline/games-src/shapecount.js — Bắt Vật Thể
// Mỗi màn có nhiều bản sao của một vật thể lẫn giữa các vật khác.
// Chạm hết đúng số lượng trước khi hết giờ.

const CATCH_ICONS = ['🐱', '🐶', '🐸', '🐼', '🦊', '🐵', '🐰', '🐻', '🍓', '🍋', '🍇', '🍉', '🚀', '🎈', '🎸', '🎧', '🐢', '🦉', '🍍', '🥕'];
const CATCH_ROUNDS = 6;

function catchValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < CATCH_ROUNDS &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5;
}

function catchPlan(round, mode) {
    if (mode.k === 'easy') return { size: 4, copies: Math.min(5, 2 + Math.floor(round / 2)) };
    if (mode.k === 'mid') return { size: round < 3 ? 4 : 5, copies: Math.min(6, 3 + Math.floor(round / 2)) };
    return { size: 5, copies: Math.min(7, 3 + Math.floor(round / 2)) };
}

function startCatch(root, mode, modeIndex, resume) {
    const id = 'shapecount';
    let round = resume ? resume.round : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let target = '';
    let cells = [];
    let found = 0;
    let secs = 0;
    let phase = 'play';
    let ended = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives });
    }

    function startRound() {
        if (ended) return;
        const plan = catchPlan(round, mode);
        const pool = shuffle(CATCH_ICONS);
        target = pool[0];
        const others = pool.slice(1);
        const total = plan.size * plan.size;
        cells = shuffle([
            ...Array.from({ length: plan.copies }, () => target),
            ...Array.from({ length: total - plan.copies }, (_, i) => others[i % others.length]),
        ]);
        found = 0;
        secs = gqSecs(15, mode);
        phase = 'play';
        paint();
        save();
    }

    function paint(message) {
        const plan = catchPlan(round, mode);
        root.innerHTML = `${gqHud(score, lives, `Màn <b>${round + 1}/${CATCH_ROUNDS}</b>`)}
            <div class="tbar"><i id="tb" style="width:100%"></i></div>
            <div class="prompt">${message || `Tìm đủ ${plan.copies} ${target}`}
                <small id="cnt">Đã bắt 0/${plan.copies} · còn ${Math.ceil(secs)}s</small></div>
            <div class="board" id="bd" style="--n:${plan.size}">
                ${cells.map((emoji, i) => `<button class="cell" data-cell="${i}"><span class="ic">${emoji}</span></button>`).join('')}
            </div>
            <p class="hint">Chạm đúng vật thể mục tiêu, tránh chạm nhầm. Bắt đủ trước khi hết giờ!</p>`;
    }

    function nextRound() {
        round++;
        if (round >= CATCH_ROUNDS) { end(); return; }
        startRound();
    }

    function completeRound() {
        if (phase !== 'play') return;
        phase = 'done';
        score += found * 5 + Math.ceil(secs);
        sfx.ok();
        const plan = catchPlan(round, mode);
        const cnt = root.querySelector('#cnt');
        if (cnt) cnt.textContent = `Đủ ${plan.copies} rồi! +thời gian còn lại`;
        save();
        T.set(nextRound, 850);
    }

    function timeOut() {
        if (phase !== 'play') return;
        phase = 'done';
        lives--;
        sfx.bad();
        if (lives <= 0) { end(); return; }
        save();
        const cnt = root.querySelector('#cnt');
        if (cnt) cnt.textContent = 'Hết giờ màn này!';
        T.set(nextRound, 900);
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (round >= CATCH_ROUNDS) S.flags.catch = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 4) + round,
            lines: [`Hoàn thành ${round}/${CATCH_ROUNDS} màn`, `Còn ${lives} mạng`],
            replay: shapeCountGame, details: { round, score },
        });
    }

    root.onclick = (e) => {
        if (ended || phase !== 'play') return;
        const cell = e.target.closest('[data-cell]');
        if (!cell || cell.classList.contains('ok') || cell.classList.contains('bad')) return;
        const i = Number(cell.dataset.cell);
        const plan = catchPlan(round, mode);
        if (cells[i] === target) {
            found++;
            cell.classList.add('ok');
            cell.innerHTML = '<span class="ic">✅</span>';
            sfx.tick();
            const cnt = root.querySelector('#cnt');
            if (cnt) cnt.textContent = `Đã bắt ${found}/${plan.copies} · còn ${Math.ceil(secs)}s`;
            if (found >= plan.copies) completeRound();
        } else {
            lives--;
            sfx.bad();
            cell.classList.add('bad');
            if (lives <= 0) { end(); return; }
            save();
        }
    };

    T.int(() => {
        if (ended || phase !== 'play') return;
        secs = Math.max(0, secs - 1);
        const bar = root.querySelector('#tb');
        if (bar) bar.style.width = Math.max(0, (secs / gqSecs(15, mode)) * 100) + '%';
        const cnt = root.querySelector('#cnt');
        if (cnt) cnt.textContent = `Đã bắt ${found}/${catchPlan(round, mode).copies} · còn ${Math.ceil(secs)}s`;
        if (secs <= 0) timeOut();
    }, 1000);

    startRound();
}

function shapeCountGame(root) {
    const saved = loadOfflineRun('shapecount');
    if (catchValid(saved)) {
        startCatch(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('shapecount');

    gqIntro(root, {
        id: 'shapecount', icon: '🎯', name: 'Bắt Vật Thể',
        desc: 'Tìm đủ số lượng một vật thể đang trốn giữa rất nhiều vật khác.',
        steps: [
            'Mỗi màn chọn một vật thể mục tiêu và số lượng cần bắt.',
            'Chạm đúng các bản sao của nó, tránh chạm nhầm vật khác.',
            'Bắt đủ trước khi hết giờ; chạm nhầm hoặc hết giờ sẽ mất một mạng.',
        ],
    }, (mode, index) => startCatch(root, mode, index));
}

startSingleGame({
    id: 'shapecount',
    name: 'Bắt Vật Thể',
    icon: '🎯',
    storageKey: 'offline_shapecount',
    mount: shapeCountGame,
    badges: [
        { id: 'catch', n: 'Hoàn thành 6 màn', i: '🎯', ok: () => !!S.flags.catch },
    ],
});
