// src/games/offline/games-src/quiz.js — Pick a Side
// Ten "this or that" rounds to measure the player's taste and return
// a fun title at the end. No right or wrong answers, no timer.

const QUIZ_PAIRS = [
    ['A whole day at the beach', 'A cozy day at home'],
    ['Try a food you have never eaten', 'Order your usual favorite'],
    ['Raise a baby dragon', 'Raise a little kitten'],
    ['Dance to music in the yard', 'Listen to music alone with headphones'],
    ['Travel by hot-air balloon', 'Travel by train'],
    ['A rain of gummy candy', 'A rain of soap bubbles'],
    ['A secret door in your room', 'A window looking out at a garden'],
    ['Hair that changes color with your mood', 'Clothes that always fit perfectly'],
    ['Eat only your favorite food for a week', 'Get enough sleep every day for a week'],
    ['A slide right outside your door', 'A swing in the garden'],
    ['Befriend an alien', 'Befriend a teddy bear that can talk'],
    ['Go to school on a flying skateboard', 'Go to school by bike'],
    ['Learn how to turn invisible', 'Learn how to fly'],
    ['A pet that can speak like a person', 'A plant that sings every morning'],
];

const QUIZ_ROUNDS = 10;

function quizTitle(bold) {
    if (bold >= 9) return 'Little Explorer';
    if (bold >= 7) return 'Friend of the Wind';
    if (bold >= 5) return 'Adventure and Calm';
    if (bold >= 3) return 'Warm at Heart';
    return 'Relaxation Expert';
}

function quizValid(s) {
    return !!s && s.v === 3 &&
        Array.isArray(s.deck) && s.deck.length === QUIZ_ROUNDS &&
        new Set(s.deck).size === QUIZ_ROUNDS &&
        s.deck.every((k) => Number.isInteger(k) && k >= 0 && k < QUIZ_PAIRS.length) &&
        Number.isInteger(s.round) && s.round >= 0 && s.round <= QUIZ_ROUNDS &&
        Array.isArray(s.picks) && s.picks.length === s.round &&
        s.picks.every((p) => p === 0 || p === 1);
}

function startQuiz(root, game) {
    const id = 'quiz';
    let closed = false;

    function save() {
        if (!closed) saveOfflineRun(id, game);
    }

    function paint() {
        if (closed) return;
        if (game.round >= QUIZ_ROUNDS) { end(); return; }
        const pair = QUIZ_PAIRS[game.deck[game.round]];
        root.innerHTML = `${gqHud(game.round * 10, 0, `Round <b>${game.round + 1}/${QUIZ_ROUNDS}</b>`)}
            ${gqDots(QUIZ_ROUNDS, game.round)}
            <div class="qbox txt">What do you choose?</div>
            <div class="opts one">
                ${pair.map((choice, i) => `<button class="opt" data-choice="${i}" style="min-height:88px">${choice}</button>`).join('')}
            </div>
            <p class="hint">Pick what you like — there are no right or wrong answers.</p>`;
        save();
    }

    function end() {
        if (closed) return;
        closed = true;
        T.clear();
        clearOfflineRun(id);
        const bold = game.picks.filter((p) => p === 0).length;
        const title = quizTitle(bold);
        S.flags.perfect = true;
        finish({
            id, score: game.picks.length * 10, xp: 20,
            lines: [`${title}`, `Picked ${bold} adventures · ${game.picks.length - bold} cozy choices`],
            replay: quizGame, details: { picks: game.picks, title },
        });
    }

    root.onclick = (e) => {
        if (closed) return;
        const b = e.target.closest('[data-choice]');
        if (!b) return;
        const choice = Number(b.dataset.choice);
        if (choice !== 0 && choice !== 1) return;
        game.picks.push(choice);
        game.round++;
        sfx.tick();
        paint();
    };

    paint();
}

function quizGame(root) {
    const saved = loadOfflineRun('quiz');
    if (quizValid(saved) && saved.round < QUIZ_ROUNDS) {
        startQuiz(root, saved);
        return;
    }
    if (saved) clearOfflineRun('quiz');

    const best = S.best.quiz || 0;
    root.innerHTML = `<div class="panel intro">
        <div class="intro-ic">🎉</div>
        <h2>Pick a Side</h2>
        <p>Ten quick choices between two options — at the end you get a fun title that matches your taste.</p>
        <ul class="intro-steps">
            <li>Each round has two choices; just pick the one you like more.</li>
            <li>There are no right or wrong answers, and no timer.</li>
            <li>Finish all 10 rounds to see your title.</li>
        </ul>
        <p class="intro-best">${best ? `🏆 Last time: <b>${best}</b> points` : 'Ready to play?'}</p>
        <button class="btn" data-start="1" style="width:100%;margin-top:14px">Start 10 Choices</button>
    </div>`;

    root.onclick = (e) => {
        if (!e.target.closest('[data-start]')) return;
        sfx.ok();
        startQuiz(root, {
            v: 3,
            deck: shuffle(QUIZ_PAIRS.map((_, i) => i)).slice(0, QUIZ_ROUNDS),
            round: 0,
            picks: [],
        });
    };
}

startSingleGame({
    id: 'quiz',
    name: 'Pick a Side',
    icon: '🎉',
    storageKey: 'offline_quiz',
    mount: quizGame,
    badges: [
        { id: 'perfect', n: 'Finish 10 Rounds', i: '🎉', ok: () => !!S.flags.perfect },
    ],
});
