// src/games/offline/games-src/chem.js — Light Party
// Tiles light up for a moment, then go dark. Remember the positions and tap
// every tile that just lit up; a wrong tap or a miss costs a life.

const CHEM_ROUNDS = 8;

function chemValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < CHEM_ROUNDS &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5;
}

function startChem(root, mode, modeIndex, resume) {
    const id = 'chem';
    let round = resume ? resume.round : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let lights = [];
    let found = [];
    let phase = 'show';
    let ended = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives });
    }

    function lampCount() {
        return Math.min(7, 2 + Math.floor(round / 2) + (mode.k === 'hard' ? 1 : 0));
    }

    function render(message) {
        const isShow = phase === 'show';
        root.innerHTML = `${gqHud(score, lives, `Round <b>${round + 1}/${CHEM_ROUNDS}</b>`)}
            <div class="prompt" id="st">${isShow ? 'Remember the lit tiles…' : message || `Tap the ${lights.length} tiles that just lit up`}
                <small>${isShow ? 'The lights go out in a moment' : 'Do not tap the other tiles'}</small></div>
            <div class="board" style="--n:3">
                ${Array.from({ length: 9 }, (_, i) => {
                    const lit = isShow && lights.includes(i);
                    const ok = !isShow && found.includes(i);
                    return `<button class="cell ${lit ? 'lit' : ''} ${ok ? 'ok' : ''}" data-cell="${i}"><span class="ic">${ok ? '✅' : lit ? '💡' : '·'}</span></button>`;
                }).join('')}
            </div>
            <p class="hint">Watch the tiles light up, then tap those same tiles. A wrong tap costs a life.</p>`;
    }

    function startRound() {
        if (ended) return;
        lights = shuffle(Array.from({ length: 9 }, (_, i) => i)).slice(0, lampCount());
        found = [];
        phase = 'show';
        render();
        save();
        T.set(() => {
            if (ended) return;
            phase = 'input';
            render();
            T.set(() => {
                if (ended || phase !== 'input') return;
                roundMissed('Time is up! The lights went out.');
            }, gqSecs(8, mode) * 1000);
        }, gqMs(1000, mode));
    }

    function nextRound() {
        round++;
        if (round >= CHEM_ROUNDS) { end(); return; }
        startRound();
    }

    function roundMissed(message) {
        lives--;
        sfx.bad();
        if (lives <= 0) { end(); return; }
        T.clear();
        render(message);
        save();
        T.set(nextRound, 900);
    }

    function completeRound() {
        score += lights.length * 10 + Math.round(10 / mode.pace);
        sfx.ok();
        T.clear();
        render('Brilliant! +points');
        save();
        T.set(nextRound, 700);
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (round >= CHEM_ROUNDS) S.flags.chem = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 5) + round,
            lines: [`Completed ${round}/${CHEM_ROUNDS} rounds`, `${lives} lives left`],
            replay: chemGame, details: { round, score },
        });
    }

    root.onclick = (e) => {
        if (ended || phase !== 'input') return;
        const cell = e.target.closest('[data-cell]');
        if (!cell) return;
        const i = Number(cell.dataset.cell);
        if (found.includes(i)) return;
        if (lights.includes(i)) {
            found.push(i);
            sfx.tick();
            if (found.length === lights.length) { completeRound(); return; }
            render();
        } else {
            lives--;
            cell.classList.add('bad');
            sfx.bad();
            if (lives <= 0) { end(); return; }
            save();
            T.set(() => render(), 350);
        }
    };

    startRound();
}

function chemGame(root) {
    const saved = loadOfflineRun('chem');
    if (chemValid(saved)) {
        startChem(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('chem');

    gqIntro(root, {
        id: 'chem', icon: '✨', name: 'Light Party',
        desc: 'The lights flash for a moment, then go out — remember and tap every tile that just lit up.',
        steps: [
            'Each round, a few tiles light up for a short moment.',
            'When the lights go out, tap the tiles that were lit to score points.',
            'A wrong tap or running out of time costs a life; later rounds have more lights.',
        ],
    }, (mode, index) => startChem(root, mode, index));
}

startSingleGame({
    id: 'chem',
    name: 'Light Party',
    icon: '✨',
    storageKey: 'offline_chem',
    mount: chemGame,
    badges: [
        { id: 'chem', n: 'Complete 8 rounds', i: '✨', ok: () => !!S.flags.chem },
    ],
});
