// src/games/offline/games-src/compare.js — Oẳn Tù Tì
// Đấu 10 lượt với máy. Máy nhớ nước đi trước của bạn: càng chọn mức khó,
// nó càng giỏi đoán và phản đòn.

const RPS_MOVES = ['✊', '✋', '✌️'];
const RPS_NAMES = ['Búa', 'Bao', 'Kéo'];
const RPS_BEATS = [2, 0, 1]; // búa thắng kéo, bao thắng búa, kéo thắng bao
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
    let message = phase === 'reveal' ? 'Kết quả lượt trước' : 'Chọn đòn của bạn!';
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
                <span>🥊 Trận <b>${Math.min(round + 1, RPS_ROUNDS)}/${RPS_ROUNDS}</b></span>
                <span>⭐ <b>${score}</b></span>
                <span>🏆 <b>${wins}</b></span>
            </div>
            <div class="qbox" style="font-size:15px;font-weight:600;padding:16px 12px">
                <div style="font-size:13px;opacity:.7">MÁY RA</div>
                <div style="font-size:54px;line-height:1.15;margin:4px 0">${revealed ? RPS_MOVES[cpu] : '🫧'}</div>
                <div style="font-family:var(--body);font-size:14px;font-weight:600">${message}</div>
            </div>
            <div class="opts" style="grid-template-columns:repeat(3,1fr)">
                ${RPS_MOVES.map((m, i) => `<button class="opt" data-move="${i}" style="min-height:84px;font-size:36px" ${revealed ? 'disabled' : ''}>${m}<small style="display:block;font-size:11px;font-family:var(--body)">${RPS_NAMES[i]}</small></button>`).join('')}
            </div>
            <p class="hint">Thắng ${wins} · Hòa ${ties} · Thua ${losses} · Máy sẽ đoán nước đi của bạn ở mức khó.</p>`;
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        const title = wins > losses ? 'Bạn thắng cả trận!' : wins === losses ? 'Hòa cả trận!' : 'Máy thắng trận này';
        if (wins >= 6) S.flags.rps = true;
        finish({
            id, score: gqScore(mode, score), xp: wins * 4 + ties * 2,
            lines: [`${title}`, `Thắng ${wins} · Hòa ${ties} · Thua ${losses}`],
            replay: compareGame, details: { wins, ties, losses },
        });
    }

    function nextRound() {
        if (ended) return;
        cpu = pickCpu();
        player = null;
        phase = 'ready';
        message = 'Chọn đòn của bạn!';
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
            message = `Hòa! Cả hai ra ${RPS_NAMES[chosen]}.`;
            sfx.tick();
        } else if (RPS_BEATS[chosen] === cpu) {
            wins++;
            score += 10;
            message = `Bạn thắng! ${RPS_NAMES[chosen]} đánh bại ${RPS_NAMES[cpu]}.`;
            sfx.ok();
        } else {
            losses++;
            message = `Máy thắng! ${RPS_NAMES[cpu]} đánh bại ${RPS_NAMES[chosen]}.`;
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
        id: 'compare', icon: '✊', name: 'Oẳn Tù Tì',
        desc: 'Đấu oẳn tù tì 10 lượt với máy — máy càng khó càng biết đoán nước đi của bạn.',
        steps: [
            'Mỗi lượt chọn Búa, Bao hoặc Kéo trước khi máy lật bài.',
            'Búa thắng Kéo, Kéo thắng Bao, Bao thắng Búa.',
            'Mức Thử thách cho máy phản đòn theo nước đi trước của bạn.',
        ],
    }, (mode, index) => startCompare(root, mode, index));
}

startSingleGame({
    id: 'compare',
    name: 'Oẳn Tù Tì',
    icon: '✊',
    storageKey: 'offline_compare',
    mount: compareGame,
    badges: [
        { id: 'rps', n: 'Thắng 6 lượt', i: '🥊', ok: () => !!S.flags.rps },
    ],
});
