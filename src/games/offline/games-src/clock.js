// src/games/offline/games-src/clock.js — Tap the Beat
// A bar slides back and forth along a track; tap while the bar is inside the green zone.
// The closer to the center of the green zone, the higher the score.

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
        root.innerHTML = `${gqHud(score, lives, `Beat <b>${round + 1}/${CLOCK_ROUNDS}</b>`)}
            <div class="prompt" id="st">${message || 'Tap when the bar enters the green zone'}
                <small>${tapped ? 'Scoring…' : 'The closer to the center, the more points'}</small></div>
            <div class="rhythm" id="track" style="--zw:${zonePct}%">
                <div class="zone"></div><div class="center"></div><div class="marker" id="mk"></div>
            </div>
            <button class="btn" data-hit="1" style="width:100%;min-height:76px;font-size:20px;background:${tapped ? 'var(--card)' : 'var(--sun)'}">${tapped ? '…' : 'TAP!'}</button>
            <p class="hint">The bar speeds up with every beat. Time the green zone to score points.</p>`;
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
                miss('Time is up for this beat!');
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
            paint(dist <= 1.5 ? `Perfect! +${gain} points` : `Right on the beat! +${gain} points`);
            save();
            T.set(nextRound, 650);
        } else {
            lives--;
            sfx.bad();
            if (lives <= 0) { end(); return; }
            paint(`Missed the green zone! Off by ${Math.round(dist)}%`);
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
            lines: [`Completed ${round}/${CLOCK_ROUNDS} beats`, `${lives} lives left`],
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
        id: 'clock', icon: '🏁', name: 'Tap the Beat',
        desc: 'Tap at exactly the right moment as the bar crosses the green zone to keep a perfect rhythm.',
        steps: [
            'The bar slides back and forth along the track, with the green zone in the middle.',
            'Tap while the bar is inside the green zone — the closer to the center, the higher the score.',
            'Tapping outside the green zone or running out of time costs a life.',
        ],
    }, (mode, index) => startClock(root, mode, index));
}

startSingleGame({
    id: 'clock',
    name: 'Tap the Beat',
    icon: '🏁',
    storageKey: 'offline_clock',
    mount: clockGame,
    badges: [
        { id: 'clock', n: 'Complete 10 beats', i: '⚡', ok: () => !!S.flags.clock },
    ],
});
