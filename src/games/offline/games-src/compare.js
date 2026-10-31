// src/games/offline/games-src/compare.js — Rock Paper Scissors
// Play 10 rounds against the computer. The CPU remembers your previous moves:
// the harder the level, the better it guesses and counters.

const RPS_MOVES = ['✊', '✋', '✌️'];
const RPS_NAMES = ['Rock', 'Paper', 'Scissors'];
const RPS_BEATS = [2, 0, 1]; // rock beats scissors, paper beats rock, scissors beats paper
const RPS_ROUNDS = 10;

function compareValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Number.isInteger(s.round) && s.round >= 0 && s.round < RPS_ROUNDS &&
        Number.isInteger(s.wins) && s.wins >= 0 && Number.isInteger(s.ties) && s.ties >= 0 &&
        Number.isInteger(s.losses) && s.losses >= 0 &&
        Number.isInteger(s.score) && s.score >= 0 &&
        Array.isArray(s.history) && s.history.length === s.round &&
        s.history.every((i) => Number.isInteger(i) && i >= 0 && i < RPS_MOVES.length) &&
        Number.isInteger(s.cpu) && s.cpu >= 0 && s.cpu < RPS_MOVES.length &&
        ['ready', 'reveal'].includes(s.phase) &&
        (s.phase === 'ready' || (Number.isInteger(s.player) && s.player >= 0 && s.player < RPS_MOVES.length));
}

function startCompare(root, mode, modeIndex, resume) {
    const id = 'compare';
    let round = resume ? resume.round : 0;
    let wins = resume ? resume.wins : 0;
    let ties = resume ? resume.ties : 0;
    let losses = resume ? resume.losses : 0;
    let score = resume ? resume.score : 0;
    let history = resume ? resume.history.slice() : [];
    let cpu = resume ? resume.cpu : rnd(0, 2);
    let player = resume ? resume.player : null;
    let phase = resume ? resume.phase : 'ready';
    let message = phase === 'reveal' ? 'Last round result' : 'Pick your move!';
    let ended = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, round, wins, ties, losses, score, history, cpu, player, phase });
    }

    function pickCpu() {
        if (!history.length) return rnd(0, 2);
        const last = history[history.length - 1];
        if (mode.k === 'easy') return rnd(0, 2);
        if (mode.k === 'mid') return Math.random() < .3 ? RPS_BEATS[last] : rnd(0, 2);
        if (Math.random() < .55) return RPS_BEATS[last];
        const counts = [0, 0, 0];
        history.forEach((m) => { counts[m]++; });
        const most = counts.indexOf(Math.max(...counts));
        if (Math.random() < .2) return RPS_BEATS[most];
        return rnd(0, 2);
    }

    function paint() {
        const revealed = phase === 'reveal';
        root.innerHTML = `<div class="hud">
                <span>🥊 Round <b>${Math.min(round + 1, RPS_ROUNDS)}/${RPS_ROUNDS}</b></span>
                <span>⭐ <b>${score}</b></span>
                <span>🏆 <b>${wins}</b></span>
            </div>
            <div class="qbox" style="font-size:15px;font-weight:600;padding:16px 12px">
                <div style="font-size:13px;opacity:.7">CPU PLAYS</div>
                <div style="font-size:54px;line-height:1.15;margin:4px 0">${revealed ? RPS_MOVES[cpu] : '🫧'}</div>
                <div style="font-family:var(--body);font-size:14px;font-weight:600">${message}</div>
            </div>
            <div class="opts" style="grid-template-columns:repeat(3,1fr)">
                ${RPS_MOVES.map((m, i) => `<button class="opt" data-move="${i}" style="min-height:84px;font-size:36px" ${revealed ? 'disabled' : ''}>${m}<small style="display:block;font-size:11px;font-family:var(--body)">${RPS_NAMES[i]}</small></button>`).join('')}
            </div>
            <p class="hint">Wins ${wins} · Ties ${ties} · Losses ${losses} · On hard mode the CPU predicts your moves.</p>`;
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        const title = wins > losses ? 'You win the match!' : wins === losses ? 'The match is a tie!' : 'The CPU wins this match';
        if (wins >= 6) S.flags.rps = true;
        finish({
            id, score: gqScore(mode, score), xp: wins * 4 + ties * 2,
            lines: [`${title}`, `Wins ${wins} · Ties ${ties} · Losses ${losses}`],
            replay: compareGame, details: { wins, ties, losses },
        });
    }

    function nextRound() {
        if (ended) return;
        cpu = pickCpu();
        player = null;
        phase = 'ready';
        message = 'Pick your move!';
        save();
        paint();
    }

    function resolve(chosen) {
        player = chosen;
        history.push(chosen);
        phase = 'reveal';
        if (chosen === cpu) {
            ties++;
            score += 3;
            message = `Tie! You both played ${RPS_NAMES[chosen]}.`;
            sfx.tick();
        } else if (RPS_BEATS[chosen] === cpu) {
            wins++;
            score += 10;
            message = `You win! ${RPS_NAMES[chosen]} beats ${RPS_NAMES[cpu]}.`;
            sfx.ok();
        } else {
            losses++;
            message = `CPU wins! ${RPS_NAMES[cpu]} beats ${RPS_NAMES[chosen]}.`;
            sfx.bad();
        }
        round++;
        save();
        paint();
        if (round >= RPS_ROUNDS) { T.set(end, 1100); return; }
        T.set(nextRound, 1100);
    }

    root.onclick = (e) => {
        if (ended || phase !== 'ready') return;
        const b = e.target.closest('[data-move]');
        if (b) resolve(Number(b.dataset.move));
    };

    paint();
    save();
    if (phase === 'reveal') T.set(nextRound, 1200);
}

function compareGame(root) {
    const saved = loadOfflineRun('compare');
    if (compareValid(saved)) {
        startCompare(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('compare');

    gqIntro(root, {
        id: 'compare', icon: '✊', name: 'Rock Paper Scissors',
        desc: 'Play 10 rounds of rock paper scissors against the CPU — the harder the mode, the better it predicts your moves.',
        steps: [
            'Each round, pick Rock, Paper or Scissors before the CPU reveals its move.',
            'Rock beats Scissors, Scissors beats Paper, Paper beats Rock.',
            'On Hard mode the CPU counters based on your previous moves.',
        ],
    }, (mode, index) => startCompare(root, mode, index));
}

startSingleGame({
    id: 'compare',
    name: 'Rock Paper Scissors',
    icon: '✊',
    storageKey: 'offline_compare',
    mount: compareGame,
    badges: [
        { id: 'rps', n: 'Win 6 rounds', i: '🥊', ok: () => !!S.flags.rps },
    ],
});
