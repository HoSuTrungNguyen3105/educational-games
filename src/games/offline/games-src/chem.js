// src/games/offline/games-src/chem.js — Tiệc Ánh Sáng
// Các ô đèn sáng lên một lát rồi tắt. Ghi nhớ vị trí và chạm lại đủ các ô
// vừa sáng; chạm nhầm hoặc quên sẽ mất mạng.

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
        root.innerHTML = `${gqHud(score, lives, `Vòng <b>${round + 1}/${CHEM_ROUNDS}</b>`)}
            <div class="prompt" id="st">${isShow ? 'Ghi nhớ những ô đang sáng…' : message || `Chạm lại ${lights.length} ô vừa sáng`}
                <small>${isShow ? 'Đèn sẽ tắt sau ít giây' : 'Không chạm vào ô khác'}</small></div>
            <div class="board" style="--n:3">
                ${Array.from({ length: 9 }, (_, i) => {
                    const lit = isShow && lights.includes(i);
                    const ok = !isShow && found.includes(i);
                    return `<button class="cell ${lit ? 'lit' : ''} ${ok ? 'ok' : ''}" data-cell="${i}"><span class="ic">${ok ? '✅' : lit ? '💡' : '·'}</span></button>`;
                }).join('')}
            </div>
            <p class="hint">Nhìn các ô sáng lên, rồi chạm lại đúng những ô đó. Chạm nhầm sẽ mất một mạng.</p>`;
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
                roundMissed('Hết giờ! Đèn đã tắt hẳn.');
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
        render('Sáng rực! +điểm');
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
            lines: [`Hoàn thành ${round}/${CHEM_ROUNDS} vòng`, `Còn ${lives} mạng`],
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
        id: 'chem', icon: '✨', name: 'Tiệc Ánh Sáng',
        desc: 'Đèn sáng lên một lát rồi tắt — hãy nhớ và chạm lại đủ các ô vừa sáng.',
        steps: [
            'Mỗi vòng có vài ô đèn bật sáng trong chốc lát.',
            'Khi đèn tắt, chạm lại đúng những ô vừa sáng để ghi điểm.',
            'Chạm nhầm hoặc để hết giờ sẽ mất một mạng; càng về sau càng nhiều đèn.',
        ],
    }, (mode, index) => startChem(root, mode, index));
}

startSingleGame({
    id: 'chem',
    name: 'Tiệc Ánh Sáng',
    icon: '✨',
    storageKey: 'offline_chem',
    mount: chemGame,
    badges: [
        { id: 'chem', n: 'Hoàn thành 8 vòng', i: '✨', ok: () => !!S.flags.chem },
    ],
});
