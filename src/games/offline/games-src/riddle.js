// src/games/offline/games-src/riddle.js — Green Light Reflex
// Wait for the green light, then tap as fast as you can. Tapping on red breaks the rules.

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
    let lastNote = 'Wait for the green light…';
    let ended = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives, reactions });
    }

    function paint() {
        const go = phase === 'go';
        const wait = phase === 'wait';
        const label = go ? 'GREEN LIGHT — GO!' : wait ? 'RED LIGHT — WAIT' : 'RESULT';
        const icon = go ? '🟢' : wait ? '🔴' : '🏁';
        root.innerHTML = `${gqHud(score, lives, `Round <b>${round + 1}/${RIDDLE_ROUNDS}</b>`)}
            <div class="big-signal ${go ? 'go' : wait ? 'stop' : ''}">
                <div style="font-size:56px;line-height:1">${icon}</div>
                <div style="margin-top:8px">${label}</div>
            </div>
            <div class="stat-line"><span>${lastNote}</span>${reactions.length ? `<span>Last: ${Math.round(reactions[reactions.length - 1])} ms</span>` : ''}</div>
            <button class="btn" data-go="1" style="width:100%;min-height:72px;font-size:20px">🏃 GO!</button>
            <p class="hint">Only tap on green. Tapping too early costs a life; the faster your reflex, the more points you score.</p>`;
    }

    function beginWait() {
        if (ended) return;
        phase = 'wait';
        lastNote = round === 0 ? 'Wait for the green light…' : 'New round — wait for green…';
        paint();
        T.set(() => {
            if (ended || phase !== 'wait') return;
            phase = 'go';
            goAt = Date.now();
            lastNote = 'Tap now!';
            sfx.tick();
            paint();
            T.set(() => {
                if (ended || phase !== 'go') return;
                lives--;
                sfx.bad();
                lastNote = 'Too slow! The light turned red.';
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
        lastNote = reaction < 250 ? `Super fast! +${pts}` : `Nice! +${pts}`;
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
        lastNote = 'Too early! Wait for the green light.';
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
            lines: [avg ? `Average reaction ${avg} ms` : 'No reaction rounds yet', `Finished ${round}/${RIDDLE_ROUNDS} rounds`],
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
        id: 'riddle', icon: '🚦', name: 'Green Light Reflex',
        desc: 'Wait on red, tap fast on green — the game for the quickest hands around.',
        steps: [
            'Each round the red light stays on for a random amount of time.',
            'When the light turns green, tap right away to score points for your speed.',
            'Tapping on red or missing the green window costs one life.',
        ],
    }, (mode, index) => startRiddle(root, mode, index));
}

startSingleGame({
    id: 'riddle',
    name: 'Green Light Reflex',
    icon: '🚦',
    storageKey: 'offline_riddle',
    mount: riddleGame,
    badges: [
        { id: 'riddle', n: 'Reflex under 350ms', i: '⚡', ok: () => !!S.flags.riddle },
    ],
});
