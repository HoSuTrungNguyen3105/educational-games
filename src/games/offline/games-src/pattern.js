// src/games/offline/games-src/pattern.js — Find the Pattern
// Look at the shape sequence and pick the missing shape. The rules get harder
// over time: pairs, triples, mirror and growing patterns.

const PATTERN_ICONS = ['⭐', '🌙', '🍓', '🍋', '🍇', '🍀', '🔺', '🔵', '🟡', '🟩', '🎈', '🚀', '🐱', '🐼'];
const PATTERN_ROUNDS = 10;

function patternSymbols(n) {
    return shuffle(PATTERN_ICONS).slice(0, n);
}

function makePattern(level) {
    const kinds = level < 3 ? ['abab', 'abba']
        : level < 6 ? ['abab', 'abba', 'aabb', 'abc']
        : level < 9 ? ['abc', 'aabb', 'mirror']
        : ['growth', 'abc', 'mirror'];
    const kind = kinds[rnd(0, kinds.length - 1)];
    const [a, b, c] = patternSymbols(3);

    if (kind === 'abab') {
        return { seq: [a, b, a, b, '?'], ans: a, kind };
    }
    if (kind === 'abba') {
        return { seq: [a, b, b, a, '?'], ans: b, kind };
    }
    if (kind === 'aabb') {
        return { seq: [a, a, b, b, '?'], ans: a, kind };
    }
    if (kind === 'abc') {
        return { seq: [a, b, c, a, b, '?'], ans: c, kind };
    }
    if (kind === 'mirror') {
        return { seq: [a, b, c, c, b, '?'], ans: a, kind };
    }
    return { seq: [a, a + a, a + a + a, '?'], ans: a + a + a + a, kind: 'growth' };
}

function makePatternOptions(q) {
    if (q.kind === 'growth') {
        const base = q.ans.slice(0, 1);
        const pool = [base, base + base, base + base + base, base + base + base + base, base + base + base + base + base];
        return shuffle([q.ans, ...shuffle(pool.filter((x) => x !== q.ans)).slice(0, 3)]);
    }
    const pool = PATTERN_ICONS.filter((x) => x !== q.ans);
    return shuffle([q.ans, ...shuffle(pool).slice(0, 3)]);
}

function patternValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < PATTERN_ROUNDS &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        Number.isInteger(s.correct) && s.correct >= 0 && s.correct <= PATTERN_ROUNDS &&
        Number.isInteger(s.streak) && s.streak >= 0 &&
        s.cur && Array.isArray(s.cur.seq) && s.cur.seq.length >= 4 &&
        s.cur.seq.every((x) => typeof x === 'string') &&
        typeof s.cur.ans === 'string' &&
        Array.isArray(s.cur.opts) && s.cur.opts.length === 4 &&
        s.cur.opts.every((x) => typeof x === 'string') && s.cur.opts.includes(s.cur.ans);
}

function startPattern(root, mode, modeIndex, resume) {
    const id = 'pattern';
    let round = resume ? resume.round : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let correct = resume ? resume.correct : 0;
    let streak = resume ? resume.streak : 0;
    let cur = resume ? resume.cur : null;
    let timeLeft = 0;
    let answered = false;
    let ended = false;

    function checkpoint() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, score, lives, correct, streak, cur });
    }

    function paint() {
        root.innerHTML = `${gqHud(score, lives, `Question <b>${round + 1}/${PATTERN_ROUNDS}</b>`)}
            <div class="tbar"><i id="tb" style="width:100%"></i></div>
            <div class="qbox" style="font-size:15px;font-weight:600;padding:14px 12px">
                <div style="opacity:.7;margin-bottom:6px">Which shape is missing?</div>
                <div class="pattern-row">${cur.seq.map((x) => `<span class="pcell ${x === '?' ? 'missing' : ''}">${x}</span>`).join('')}</div>
            </div>
            <div class="opts" id="o">
                ${cur.opts.map((x, k) => `<button class="opt" data-k="${k}" style="font-size:34px;min-height:72px">${x}</button>`).join('')}
            </div>
            <p class="hint">Find the repeating rule in the sequence, then choose the right tile for the question mark.</p>`;
    }

    function showQuestion() {
        answered = false;
        timeLeft = gqSecs(9, mode);
        if (!cur) {
            const q = makePattern(round);
            cur = { seq: q.seq, ans: q.ans, opts: makePatternOptions(q) };
        }
        paint();
        checkpoint();
    }

    function markAnswer(k) {
        if (answered || ended) return;
        answered = true;
        const ansIndex = cur.opts.indexOf(cur.ans);
        const buttons = [...root.querySelectorAll('.opt')];
        if (buttons[ansIndex]) buttons[ansIndex].classList.add('ok');
        if (k === ansIndex) {
            correct++;
            streak++;
            score += 10 + Math.ceil(Math.max(0, timeLeft)) + (streak >= 3 ? 5 : 0);
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
        if (round >= PATTERN_ROUNDS) { end(); return; }
        cur = null;
        showQuestion();
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        if (correct >= 8) S.flags.pat = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 6) + correct,
            lines: [`Correct ${correct}/${PATTERN_ROUNDS}`, `Missed ${lives < mode.lives ? mode.lives - lives : 0} times`],
            replay: patternGame, details: { correct, score },
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
        if (bar) bar.style.width = Math.max(0, (timeLeft / gqSecs(9, mode)) * 100) + '%';
        if (timeLeft <= 0) markAnswer(-1);
    }, 100);

    if (resume) {
        timeLeft = gqSecs(9, mode);
        answered = false;
        paint();
        checkpoint();
    } else {
        showQuestion();
    }
}

function patternGame(root) {
    const saved = loadOfflineRun('pattern');
    if (patternValid(saved)) {
        startPattern(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('pattern');

    gqIntro(root, {
        id: 'pattern', icon: '⭐', name: 'Find the Pattern',
        desc: 'Look at the shape sequence and work out the missing shape from the repeating rule.',
        steps: [
            'Each question shows a sequence of shapes, with the last tile replaced by a question mark.',
            'Pick one of the four answers to keep all your lives.',
            'The rules get harder: pairs, triples, mirror and growing patterns.',
        ],
    }, (mode, index) => startPattern(root, mode, index));
}

startSingleGame({
    id: 'pattern',
    name: 'Find the Pattern',
    icon: '⭐',
    storageKey: 'offline_pattern',
    mount: patternGame,
    badges: [
        { id: 'pat', n: 'Solve 8 patterns', i: '🔮', ok: () => !!S.flags.pat },
    ],
});
