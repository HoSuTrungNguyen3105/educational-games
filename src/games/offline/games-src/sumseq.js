// src/games/offline/games-src/sumseq.js — Number Patterns
// Guess the missing number in a sequence: steady add, steady subtract, doubling,
// alternating, even/odd, tens, squares and growing (Fibonacci-like) sequences.

const SUMSEQ_ROUNDS = 10;

function makeSequence(level) {
    const kinds = level < 3
        ? ['step', 'down', 'evens']
        : level < 6
            ? ['step', 'down', 'double', 'evens', 'odds', 'tens']
            : level < 9
                ? ['double', 'alt', 'tens', 'square']
                : ['alt', 'square', 'fib', 'double'];
    const kind = kinds[rnd(0, kinds.length - 1)];
    const seq = [];
    let ans = 0;

    if (kind === 'step' || kind === 'down') {
        const step = rnd(2, kind === 'down' ? 5 : 6);
        const start = kind === 'down' ? rnd(step * 5, step * 5 + 12) : rnd(1, 9);
        const dir = kind === 'down' ? -1 : 1;
        for (let k = 0; k < 4; k++) seq.push(start + dir * step * k);
        ans = start + dir * step * 4;
    } else if (kind === 'double') {
        const start = rnd(1, 4);
        const ratio = rnd(2, level >= 6 ? 3 : 2);
        for (let k = 0; k < 4; k++) seq.push(start * Math.pow(ratio, k));
        ans = start * Math.pow(ratio, 4);
    } else if (kind === 'alt') {
        const start = rnd(2, 8);
        const up = rnd(2, 5);
        const down = rnd(1, 3);
        let v = start;
        for (let k = 0; k < 4; k++) {
            seq.push(v);
            v += k % 2 === 0 ? up : -down;
        }
        ans = v;
    } else if (kind === 'evens' || kind === 'odds') {
        const step = rnd(2, 4) * 2;
        const start = kind === 'evens' ? rnd(1, 4) * 2 : rnd(0, 3) * 2 + 1;
        for (let k = 0; k < 4; k++) seq.push(start + step * k);
        ans = start + step * 4;
    } else if (kind === 'tens') {
        const step = rnd(2, 6) * 10;
        const start = rnd(1, 4) * 10;
        for (let k = 0; k < 4; k++) seq.push(start + step * k);
        ans = start + step * 4;
    } else if (kind === 'square') {
        const start = rnd(1, level >= 9 ? 6 : 4);
        for (let k = 0; k < 4; k++) seq.push(Math.pow(start + k, 2));
        ans = Math.pow(start + 4, 2);
    } else {
        let a = 1;
        let b = rnd(1, 3);
        for (let k = 0; k < 4; k++) {
            seq.push(a);
            const c = a + b;
            a = b;
            b = c;
        }
        ans = a;
    }

    return { seq, ans, kind };
}

function sumseqValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < SUMSEQ_ROUNDS &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        Number.isInteger(s.correct) && s.correct >= 0 && s.correct <= SUMSEQ_ROUNDS &&
        Number.isInteger(s.streak) && s.streak >= 0 &&
        s.cur && Array.isArray(s.cur.seq) && s.cur.seq.length === 4 &&
        s.cur.seq.every((n) => Number.isFinite(n)) &&
        Number.isFinite(s.cur.ans) &&
        Array.isArray(s.cur.opts) && s.cur.opts.length === 4 &&
        s.cur.opts.every((n) => Number.isFinite(n)) &&
        s.cur.opts.some((n) => n === s.cur.ans);
}

function startSumseq(root, mode, modeIndex, resume) {
    const id = 'sumseq';
    let round = resume ? resume.round : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let correct = resume ? resume.correct : 0;
    let streak = resume ? resume.streak : 0;
    let cur = resume ? resume.cur : null;
    let timeLeft = 0;
    let answered = false;
    let ended = false;
    const secsBase = 10;

    function checkpoint() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives, correct, streak, cur });
    }

    function paint() {
        root.innerHTML = `${gqHud(score, lives, `Round <b>${round + 1}/${SUMSEQ_ROUNDS}</b>`)}
            <div class="tbar"><i id="tb" style="width:100%"></i></div>
            <div class="qbox" style="font-size:15px;font-weight:600;padding:14px 12px">
                <div style="opacity:.7;margin-bottom:6px">Which number is missing?</div>
                <div class="pattern-row">${cur.seq.map((n) => `<span class="pcell">${n}</span>`).join('')}
                    <span class="pcell missing">?</span></div>
            </div>
            <div class="opts" id="o">
                ${cur.opts.map((n, k) => `<button class="opt" data-k="${k}">${n}</button>`).join('')}
            </div>
            <p class="hint">Spot how the sequence goes up or down, then pick the missing number.</p>`;
    }

    function showQuestion() {
        answered = false;
        timeLeft = gqSecs(secsBase, mode);
        if (!cur) {
            const q = makeSequence(round);
            cur = { seq: q.seq, ans: q.ans, opts: makeOpts(q.ans, 4) };
        }
        paint();
        checkpoint();
    }

    function markAnswer(k) {
        if (answered || ended) return;
        answered = true;
        const ansIndex = cur.opts.findIndex((n) => n === cur.ans);
        const buttons = [...root.querySelectorAll('.opt')];
        if (buttons[ansIndex]) buttons[ansIndex].classList.add('ok');
        if (k === ansIndex) {
            correct++;
            streak++;
            score += 10 + Math.ceil(Math.max(0, timeLeft)) * 2 + (streak >= 3 ? 5 : 0);
            sfx.ok();
        } else {
            lives--;
            streak = 0;
            sfx.bad();
            if (k >= 0 && buttons[k]) buttons[k].classList.add('bad');
        }
        checkpoint();
        if (lives <= 0) { T.set(end, 800); return; }
        T.set(nextRound, 850);
    }

    function nextRound() {
        if (ended) return;
        round++;
        if (round >= SUMSEQ_ROUNDS) { end(); return; }
        cur = null;
        showQuestion();
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (correct >= 8) S.flags.seq = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 6) + correct,
            lines: [`Correct ${correct}/${SUMSEQ_ROUNDS} sequences`, `Longest streak: ${streak}`],
            replay: sumseqGame, details: { correct, score },
        });
    }

    root.onclick = (e) => {
        if (ended) return;
        const b = e.target.closest('[data-k]');
        if (b) markAnswer(Number(b.dataset.k));
    };

    T.int(() => {
        if (answered || ended) return;
        timeLeft -= .1;
        const bar = root.querySelector('#tb');
        if (bar) bar.style.width = Math.max(0, (timeLeft / gqSecs(secsBase, mode)) * 100) + '%';
        if (timeLeft <= 0) markAnswer(-1);
    }, 100);

    if (resume) {
        timeLeft = gqSecs(secsBase, mode);
        answered = false;
        paint();
        checkpoint();
    } else {
        showQuestion();
    }
}

function sumseqGame(root) {
    const saved = loadOfflineRun('sumseq');
    if (sumseqValid(saved)) {
        startSumseq(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('sumseq');

    gqIntro(root, {
        id: 'sumseq', icon: '🔢', name: 'Number Patterns',
        desc: 'Find the missing number in a sequence that follows a hidden rule.',
        steps: [
            'Each question shows four numbers with a question mark at the end.',
            'Find the rule: steady add, steady subtract, doubling, alternating, or squares.',
            'The faster you answer, the more points you get; running out of time or a wrong pick costs one life.',
        ],
    }, (mode, index) => startSumseq(root, mode, index));
}

startSingleGame({
    id: 'sumseq',
    name: 'Number Patterns',
    icon: '🔢',
    storageKey: 'offline_sumseq',
    mount: sumseqGame,
    badges: [
        { id: 'seq', n: 'Get 8 sequences right', i: '🔢', ok: () => !!S.flags.seq },
    ],
});
