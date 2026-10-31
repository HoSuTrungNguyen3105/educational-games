// src/games/offline/games-src/riddle.js — Phản Xạ Đèn Xanh
// Chờ đèn xanh rồi chạm thật nhanh. Chạm khi đèn đỏ là phạm luật.

const RIDDLE_ROUNDS = 10;

function riddleValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < RIDDLE_ROUNDS &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        Array.isArray(s.reactions) && s.reactions.every((n) => Number.isFinite(n) && n >= 0);
}

function startRiddle(root, mode, modeIndex, resume) {
    const id = 'riddle';
    let round = resume ? resume.round : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let reactions = resume ? resume.reactions.slice() : [];
    let phase = 'wait';
    let goAt = 0;
    let lastNote = 'Chờ đèn xanh nhé…';
    let ended = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives, reactions });
    }

    function paint() {
        const go = phase === 'go';
        const wait = phase === 'wait';
        const label = go ? 'ĐÈN XANH — CHẠY!' : wait ? 'ĐÈN ĐỎ — CHỜ' : 'KẾT QUẢ';
        const icon = go ? '🟢' : wait ? '🔴' : '🏁';
        root.innerHTML = `${gqHud(score, lives, `Lượt <b>${round + 1}/${RIDDLE_ROUNDS}</b>`)}
            <div class="big-signal ${go ? 'go' : wait ? 'stop' : ''}">
                <div style="font-size:56px;line-height:1">${icon}</div>
                <div style="margin-top:8px">${label}</div>
            </div>
            <div class="stat-line"><span>${lastNote}</span>${reactions.length ? `<span>Gần nhất: ${Math.round(reactions[reactions.length - 1])} ms</span>` : ''}</div>
            <button class="btn" data-go="1" style="width:100%;min-height:72px;font-size:20px">🏃 CHẠY!</button>
            <p class="hint">Chỉ chạm khi đèn xanh. Chạm sớm sẽ mất một mạng; phản xạ càng nhanh điểm càng cao.</p>`;
    }

    function beginWait() {
        if (ended) return;
        phase = 'wait';
        lastNote = round === 0 ? 'Chờ đèn xanh nhé…' : 'Lượt mới — chờ đèn xanh…';
        paint();
        T.set(() => {
            if (ended || phase !== 'wait') return;
            phase = 'go';
            goAt = Date.now();
            lastNote = 'Chạm ngay!';
            sfx.tick();
            paint();
            T.set(() => {
                if (ended || phase !== 'go') return;
                lives--;
                sfx.bad();
                lastNote = 'Hết giờ! Đèn đã chuyển đỏ.';
                phase = 'done';
                if (lives <= 0) { end(); return; }
                round++;
                if (round >= RIDDLE_ROUNDS) { T.set(end, 700); return; }
                paint();
                save();
                T.set(beginWait, 1000);
            }, gqMs(1900, mode));
        }, gqMs(rnd(900, 2600), mode));
    }

    function record(reaction) {
        reactions.push(reaction);
        const pts = reaction < 250 ? 50 : reaction < 400 ? 35 : reaction < 650 ? 20 : 10;
        score += pts;
        phase = 'done';
        lastNote = reaction < 250 ? `Siêu nhanh! +${pts}` : `Tốt lắm! +${pts}`;
        sfx.ok();
        round++;
        paint();
        save();
        if (round >= RIDDLE_ROUNDS) { T.set(end, 900); return; }
        T.set(beginWait, 1000);
    }

    function early() {
        phase = 'done';
        lives--;
        lastNote = 'Chạm sớm quá! Chờ đèn xanh đã.';
        sfx.bad();
        if (lives <= 0) { end(); return; }
        round++;
        paint();
        save();
        if (round >= RIDDLE_ROUNDS) { T.set(end, 900); return; }
        T.set(beginWait, 1200);
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        const avg = reactions.length ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length) : 0;
        if (avg && avg < 350) S.flags.riddle = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 4) + round,
            lines: [avg ? `Phản xạ trung bình ${avg} ms` : 'Chưa có lượt phản xạ nào', `Hoàn thành ${round}/${RIDDLE_ROUNDS} lượt`],
            replay: riddleGame, details: { avg, reactions, round },
        });
    }

    root.onclick = (e) => {
        if (ended) return;
        if (!e.target.closest('[data-go]')) return;
        if (phase === 'wait') { T.clear(); early(); return; }
        if (phase === 'go') {
            T.clear();
            record(Math.max(0, Date.now() - goAt));
        }
    };

    beginWait();
}

function riddleGame(root) {
    const saved = loadOfflineRun('riddle');
    if (riddleValid(saved)) {
        startRiddle(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('riddle');

    gqIntro(root, {
        id: 'riddle', icon: '🚦', name: 'Phản Xạ Đèn Xanh',
        desc: 'Đèn đỏ thì chờ, đèn xanh thì chạm thật nhanh — trò chơi của những đôi tay nhanh nhất.',
        steps: [
            'Mỗi lượt đèn đỏ sáng lên trong một khoảng thời gian ngẫu nhiên.',
            'Khi đèn chuyển xanh, chạm ngay để ghi điểm theo tốc độ phản xạ.',
            'Chạm khi đèn đỏ hoặc để đèn xanh hết thời gian sẽ mất một mạng.',
        ],
    }, (mode, index) => startRiddle(root, mode, index));
}

startSingleGame({
    id: 'riddle',
    name: 'Phản Xạ Đèn Xanh',
    icon: '🚦',
    storageKey: 'offline_riddle',
    mount: riddleGame,
    badges: [
        { id: 'riddle', n: 'Phản xạ dưới 350ms', i: '⚡', ok: () => !!S.flags.riddle },
    ],
});
