// src/games/offline/games-src/simon.js — Giai Điệu Sắc Màu
// Trò chơi ghi nhớ cổ điển: mỗi vòng thêm một nốt vào dãy màu và âm thanh.

const SIMON_PADS = [
    { color: 'var(--sky)', icon: '▲', tone: 392 },
    { color: 'var(--coral)', icon: '●', tone: 494 },
    { color: 'var(--amber)', icon: '■', tone: 587 },
    { color: 'var(--lime)', icon: '★', tone: 698 },
];

function simonValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Array.isArray(s.seq) && s.seq.length > 0 && s.seq.length < 40 &&
        s.seq.every((i) => Number.isInteger(i) && i >= 0 && i < SIMON_PADS.length) &&
        Number.isInteger(s.step) && s.step >= 0 && s.step <= s.seq.length &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        ['show', 'input'].includes(s.phase);
}

function startSimon(root, mode, modeIndex, resume) {
    const id = 'simon';
    let seq = resume ? resume.seq.slice() : [];
    let step = resume ? resume.step : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let phase = resume ? resume.phase : 'show';
    let ended = false;

    root.innerHTML = `${gqHud(score, lives, `<span id="rd">0</span>`)}
        <div class="prompt" id="st">Sẵn sàng…<small>Nhìn và nghe dãy tín hiệu</small></div>
        <div class="simon">${SIMON_PADS.map((p, i) =>
            `<button class="pd" data-pad="${i}" style="background:${p.color}" aria-label="Nốt ${i + 1}">${p.icon}</button>`).join('')}</div>
        <p class="hint">Nhìn và nghe dãy tín hiệu, rồi chạm lại đúng thứ tự. Mỗi vòng sẽ thêm một nốt mới.</p>`;

    const pads = [...root.querySelectorAll('.pd')];

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, seq, step, score, lives, phase });
    }

    function hud() {
        const el = root.querySelector('.hud');
        if (el) {
            el.innerHTML = `<span>⭐ <b>${score}</b></span>
                <span class="hearts">${'❤️'.repeat(lives)}</span>
                <span>🎵 Vòng <b>${seq.length}</b></span>`;
        }
    }

    function flash(index, ms) {
        const pad = pads[index];
        if (!pad) return;
        pad.classList.add('on');
        beep(SIMON_PADS[index].tone, ms / 1000, 'triangle', .09);
        T.set(() => pad.classList.remove('on'), ms);
    }

    function setStatus(main, sub) {
        const st = root.querySelector('#st');
        if (st) st.innerHTML = `${main}${sub ? `<small>${sub}</small>` : ''}`;
    }

    function showSequence(addStep) {
        if (ended) return;
        if (addStep) seq.push(rnd(0, SIMON_PADS.length - 1));
        step = 0;
        phase = 'show';
        hud();
        setStatus('Nhìn và nghe…', `Dãy có ${seq.length} nốt`);
        save();
        const gap = Math.max(gqMs(430, mode), gqMs(700, mode) - seq.length * 18);
        const on = Math.max(gqMs(170, mode), gap - 130);
        seq.forEach((p, k) => T.set(() => flash(p, on), 500 + k * gap));
        T.set(() => {
            if (ended) return;
            phase = 'input';
            step = 0;
            setStatus('Đến lượt bạn!', 'Chạm theo đúng thứ tự');
            save();
        }, 500 + seq.length * gap);
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (seq.length >= 8) S.flags.simon = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 5) + seq.length,
            lines: [`Nhớ được dãy ${Math.max(0, seq.length - 1)} nốt`, `Còn ${lives} mạng`],
            replay: simonGame, details: { rounds: seq.length - 1, score },
        });
    }

    root.onclick = (e) => {
        if (ended || phase !== 'input') return;
        const pad = e.target.closest('[data-pad]');
        if (!pad) return;
        const i = Number(pad.dataset.pad);
        flash(i, 180);
        if (i !== seq[step]) {
            lives--;
            sfx.bad();
            hud();
            if (lives <= 0) { end(); return; }
            phase = 'show';
            save();
            setStatus('Sai nốt rồi!', 'Xem lại dãy nhé…');
            T.set(() => showSequence(false), 900);
            return;
        }
        step++;
        sfx.ok();
        if (step === seq.length) {
            score += seq.length * 10;
            hud();
            phase = 'show';
            save();
            setStatus('Hay lắm!', 'Chuẩn bị thêm một nốt…');
            T.set(() => showSequence(true), 850);
        } else {
            save();
        }
    };

    hud();
    if (!resume || !seq.length) {
        seq = [rnd(0, SIMON_PADS.length - 1)];
        showSequence(false);
    } else if (phase === 'input' && step < seq.length) {
        setStatus('Đến lượt bạn!', 'Chạm theo đúng thứ tự đã nghe');
        save();
    } else {
        showSequence(false);
    }
}

function simonGame(root) {
    const saved = loadOfflineRun('simon');
    if (simonValid(saved)) {
        startSimon(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('simon');

    gqIntro(root, {
        id: 'simon', icon: '🎵', name: 'Giai Điệu Sắc Màu',
        desc: 'Ghi nhớ dãy màu và âm thanh đang dài dần qua từng vòng.',
        steps: [
            'Bốn ô màu lần lượt sáng lên theo một dãy.',
            'Chạm lại đúng dãy vừa nghe để qua vòng — dãy sẽ dài thêm một nốt.',
            'Sai một nốt sẽ mất một mạng; sai quá số mạng là kết thúc.',
        ],
    }, (mode, index) => startSimon(root, mode, index));
}

startSingleGame({
    id: 'simon',
    name: 'Giai Điệu Sắc Màu',
    icon: '🎵',
    storageKey: 'offline_simon',
    mount: simonGame,
    badges: [
        { id: 'simon', n: 'Nhớ dãy 8 nốt', i: '🎵', ok: () => !!S.flags.simon },
    ],
});
