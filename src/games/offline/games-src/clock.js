// src/games/offline/games-src/clock.js — Chạm Đúng Nhịp
// Một thanh chạy qua lại trên đường đua; chạm khi thanh nằm trong vùng xanh.
// Càng gần tâm vùng xanh, điểm càng cao.

const CLOCK_ROUNDS = 10;

function clockValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < CLOCK_ROUNDS &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5;
}

function startClock(root, mode, modeIndex, resume) {
    const id = 'clock';
    let round = resume ? resume.round : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let pos = 0;
    let dir = 1;
    let speed = 0;
    let elapsed = 0;
    let tapped = false;
    let ended = false;

    const zonePct = mode.k === 'easy' ? 26 : mode.k === 'mid' ? 20 : 15;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives });
    }

    function paint(message) {
        root.innerHTML = `${gqHud(score, lives, `Nhịp <b>${round + 1}/${CLOCK_ROUNDS}</b>`)}
            <div class="prompt" id="st">${message || 'Chạm khi thanh vào vùng xanh'}
                <small>${tapped ? 'Đang tính điểm…' : 'Càng gần tâm càng nhiều điểm'}</small></div>
            <div class="rhythm" id="track" style="--zw:${zonePct}%">
                <div class="zone"></div><div class="center"></div><div class="marker" id="mk"></div>
            </div>
            <button class="btn" data-hit="1" style="width:100%;min-height:76px;font-size:20px;background:${tapped ? 'var(--card)' : 'var(--sun)'}">${tapped ? '…' : 'CHẠM!'}</button>
            <p class="hint">Thanh chạy nhanh dần qua từng nhịp. Canh đúng vùng xanh để ghi điểm.</p>`;
        placeMarker();
    }

    function placeMarker() {
        const track = root.querySelector('#track');
        const mk = root.querySelector('#mk');
        if (!track || !mk) return;
        const w = track.clientWidth || 300;
        mk.style.transform = `translateX(${(pos / 100) * Math.max(0, w - 8)}px)`;
    }

    function startRound() {
        if (ended) return;
        pos = rnd(0, 30);
        dir = Math.random() < .5 ? 1 : -1;
        speed = (mode.k === 'easy' ? 42 : mode.k === 'mid' ? 60 : 80) + round * (mode.k === 'hard' ? 6 : 4);
        elapsed = 0;
        tapped = false;
        paint();
        save();
        T.loop((dt) => {
            if (ended || tapped) return;
            elapsed += dt;
            pos += dir * speed * dt;
            if (pos >= 100) { pos = 100; dir = -1; }
            if (pos <= 0) { pos = 0; dir = 1; }
            placeMarker();
            if (elapsed > 8 / mode.pace) {
                miss('Hết giờ nhịp này!');
            }
        });
    }

    function miss(message) {
        if (tapped || ended) return;
        tapped = true;
        lives--;
        sfx.bad();
        T.clear();
        if (lives <= 0) { end(); return; }
        paint(message);
        save();
        T.set(nextRound, 900);
    }

    function hit() {
        if (tapped || ended) return;
        tapped = true;
        const dist = Math.abs(pos - 50);
        const half = zonePct / 2;
        T.clear();
        if (dist <= half) {
            const accuracy = Math.max(0, 1 - dist / half);
            const gain = 10 + Math.round(accuracy * 20) + (dist <= 1.5 ? 10 : 0);
            score += gain;
            sfx.ok();
            paint(dist <= 1.5 ? `Hoàn hảo! +${gain} điểm` : `Chuẩn nhịp! +${gain} điểm`);
            save();
            T.set(nextRound, 650);
        } else {
            lives--;
            sfx.bad();
            if (lives <= 0) { end(); return; }
            paint(`Trượt vùng xanh! Lệch ${Math.round(dist)}%`);
            save();
            T.set(nextRound, 850);
        }
    }

    function nextRound() {
        round++;
        if (round >= CLOCK_ROUNDS) { end(); return; }
        startRound();
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (round >= CLOCK_ROUNDS) S.flags.clock = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 5) + round,
            lines: [`Hoàn thành ${round}/${CLOCK_ROUNDS} nhịp`, `Còn ${lives} mạng`],
            replay: clockGame, details: { round, score },
        });
    }

    root.onclick = (e) => {
        if (e.target.closest('[data-hit]')) hit();
    };

    startRound();
}

function clockGame(root) {
    const saved = loadOfflineRun('clock');
    if (clockValid(saved)) {
        startClock(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('clock');

    gqIntro(root, {
        id: 'clock', icon: '🏁', name: 'Chạm Đúng Nhịp',
        desc: 'Canh đúng lúc thanh chạy vào vùng xanh để giữ nhịp thật chuẩn.',
        steps: [
            'Thanh chạy qua lại trên đường đua, vùng xanh nằm ở giữa.',
            'Chạm khi thanh nằm trong vùng xanh — càng gần tâm điểm càng cao.',
            'Chạm ngoài vùng xanh hoặc để hết giờ sẽ mất một mạng.',
        ],
    }, (mode, index) => startClock(root, mode, index));
}

startSingleGame({
    id: 'clock',
    name: 'Chạm Đúng Nhịp',
    icon: '🏁',
    storageKey: 'offline_clock',
    mount: clockGame,
    badges: [
        { id: 'clock', n: 'Hoàn thành 10 nhịp', i: '⚡', ok: () => !!S.flags.clock },
    ],
});
