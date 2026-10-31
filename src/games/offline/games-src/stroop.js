// src/games/offline/games-src/stroop.js — Sắc Màu Tốc Độ
// Trò Stroop kinh điển: chữ ghi tên một màu nhưng mực lại là màu khác.
// Nhiệm vụ là chọn đúng MÀU MỰC, không phải nghĩa của chữ.

const STROOP_COLORS = [
    { n: 'ĐỎ', c: '#e23b3b' },
    { n: 'XANH DƯƠNG', c: '#2f6bff' },
    { n: 'VÀNG', c: '#c98a00' },
    { n: 'XANH LÁ', c: '#1f9d55' },
    { n: 'TÍM', c: '#8b5cf6' },
];

function stroopValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isFinite(s.timeLeft) && s.timeLeft > 0 && s.timeLeft <= 60 &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        Number.isInteger(s.streak) && s.streak >= 0 &&
        Number.isInteger(s.word) && s.word >= 0 && s.word < STROOP_COLORS.length &&
        Number.isInteger(s.ink) && s.ink >= 0 && s.ink < STROOP_COLORS.length &&
        Array.isArray(s.opts) && s.opts.length === 4 &&
        s.opts.every((i) => Number.isInteger(i) && i >= 0 && i < STROOP_COLORS.length) &&
        s.opts.includes(s.ink);
}

function startStroop(root, mode, modeIndex, resume) {
    const id = 'stroop';
    const total = gqSecs(45, mode);
    let timeLeft = resume ? resume.timeLeft : total;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let streak = resume ? resume.streak : 0;
    let word = resume ? resume.word : 0;
    let ink = resume ? resume.ink : 0;
    let opts = resume ? resume.opts.slice() : [];
    let ended = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, timeLeft, score, lives, streak, word, ink, opts });
    }

    function newRound() {
        ink = rnd(0, STROOP_COLORS.length - 1);
        word = Math.random() < .75
            ? shuffle(STROOP_COLORS.map((_, i) => i).filter((i) => i !== ink))[0]
            : ink;
        opts = shuffle([ink, ...shuffle(STROOP_COLORS.map((_, i) => i).filter((i) => i !== ink)).slice(0, 3)]);
    }

    function paint() {
        root.innerHTML = `<div class="hud">
                <span>⭐ <b id="sc">${score}</b></span>
                <span class="hearts">${'❤️'.repeat(lives)}</span>
                <span>⏱ <b id="tm">${Math.ceil(timeLeft)}</b>s</span>
            </div>
            <div class="tbar"><i id="tb" style="width:${(timeLeft / total) * 100}%"></i></div>
            <div class="qbox" style="background:var(--card);color:var(--ink);border:3px solid var(--ink);box-shadow:var(--shadow)">
                <div style="font-size:13px;font-weight:600;opacity:.65;font-family:var(--body)">Màu mực của chữ này là gì?</div>
                <div style="color:${STROOP_COLORS[ink].c};margin-top:6px">${STROOP_COLORS[word].n}</div>
            </div>
            <div class="opts">
                ${opts.map((i, k) => `<button class="opt" data-k="${k}" style="font-size:15px">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:50%;border:2px solid var(--ink);background:${STROOP_COLORS[i].c};margin-right:6px;vertical-align:-2px"></span>${STROOP_COLORS[i].n}
                </button>`).join('')}
            </div>
            <p class="hint">Đọc màu mực, đừng đọc nghĩa của chữ. Trả lời nhanh để nhân chuỗi điểm!</p>`;
    }

    function updateClock() {
        const t = root.querySelector('#tm');
        const bar = root.querySelector('#tb');
        if (t) t.textContent = Math.ceil(Math.max(0, timeLeft));
        if (bar) bar.style.width = Math.max(0, (timeLeft / total) * 100) + '%';
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (score >= 120) S.flags.stroop = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 5),
            lines: [`Chuỗi đúng dài nhất: ${streak}`, `Còn ${lives} mạng`],
            replay: stroopGame, details: { score, streak },
        });
    }

    function wrong() {
        lives--;
        streak = 0;
        sfx.bad();
        if (lives <= 0) { end(); return; }
        save();
    }

    root.onclick = (e) => {
        if (ended) return;
        const b = e.target.closest('[data-k]');
        if (!b) return;
        const chosen = opts[Number(b.dataset.k)];
        if (chosen === ink) {
            streak++;
            score += 10 + Math.min(streak - 1, 10) * 2;
            sfx.tick();
        } else {
            wrong();
            if (ended) return;
        }
        newRound();
        paint();
        save();
    };

    T.int(() => {
        if (ended) return;
        timeLeft = Math.max(0, timeLeft - .1);
        updateClock();
        if (timeLeft <= 0) { end(); return; }
        if (Math.round(timeLeft * 10) % 10 === 0) save();
    }, 100);

    if (!resume) newRound();
    paint();
    save();
}

function stroopGame(root) {
    const saved = loadOfflineRun('stroop');
    if (stroopValid(saved)) {
        startStroop(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('stroop');

    gqIntro(root, {
        id: 'stroop', icon: '🎨', name: 'Sắc Màu Tốc Độ',
        desc: 'Chữ ghi một màu, nhưng mực lại là màu khác — chọn đúng màu mực thật nhanh.',
        steps: [
            'Mỗi lượt hiện một từ chỉ màu, được viết bằng một màu mực khác.',
            'Chọn màu của nước mực, đừng chọn theo nghĩa của từ.',
            'Trả lời liên tiếp để tăng chuỗi điểm; chọn sai mất một mạng.',
        ],
    }, (mode, index) => startStroop(root, mode, index));
}

startSingleGame({
    id: 'stroop',
    name: 'Sắc Màu Tốc Độ',
    icon: '🎨',
    storageKey: 'offline_stroop',
    mount: stroopGame,
    badges: [
        { id: 'stroop', n: 'Đạt 120 điểm màu', i: '🎨', ok: () => !!S.flags.stroop },
    ],
});
