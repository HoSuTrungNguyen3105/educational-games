// src/games/offline/games-src/scramble.js — Treasure Hunt
// Each chest is a riddle: arrange the scrambled letters into the keyword to open it.

const TREASURE_WORDS = [
    { w: 'CAT', c: 'Small pet that says "meow"' },
    { w: 'DOG', c: 'Loyal pet that says "woof"' },
    { w: 'BEE', c: 'Striped insect that makes honey' },
    { w: 'SUN', c: 'Bright ball of light in the sky' },
    { w: 'SKY', c: 'The big blue space above us' },
    { w: 'SEA', c: 'Huge body of salty water' },
    { w: 'TEA', c: 'Warm drink made from leaves' },
    { w: 'CUP', c: 'You drink from it' },
    { w: 'BED', c: 'Furniture you sleep on' },
    { w: 'BUS', c: 'Big vehicle that carries many people' },
    { w: 'CAR', c: 'Vehicle with four wheels' },
    { w: 'HAT', c: 'You wear it on your head' },
    { w: 'KEY', c: 'It opens a lock' },
    { w: 'OWL', c: 'Night bird with big round eyes' },
    { w: 'FOX', c: 'Clever animal with a bushy tail' },
    { w: 'ANT', c: 'Tiny insect that lives in a colony' },
    { w: 'ICE', c: 'Frozen water, cold and hard' },
    { w: 'JAM', c: 'Sweet fruit spread for bread' },
    { w: 'PIE', c: 'Baked dessert with a crust' },
    { w: 'MAP', c: 'Drawing that shows where places are' },
    { w: 'PEN', c: 'Tool you write with' },
    { w: 'BAG', c: 'You carry books in it' },
    { w: 'EGG', c: 'Round food that comes from a hen' },
    { w: 'CAKE', c: 'Sweet baked treat for birthdays' },
    { w: 'MOON', c: 'It glows in the night sky' },
    { w: 'STAR', c: 'Tiny light twinkling at night' },
    { w: 'FISH', c: 'Animal that swims and has fins' },
    { w: 'TREE', c: 'Tall plant with a trunk and leaves' },
    { w: 'BOAT', c: 'Vehicle that floats on water' },
    { w: 'ROAD', c: 'Path for cars and buses' },
    { w: 'BIRD', c: 'Animal with wings that can fly' },
    { w: 'DRUM', c: 'Musical instrument you hit' },
    { w: 'FLAG', c: 'Cloth that stands for a country' },
    { w: 'LAMP', c: 'Turn it on to get light' },
    { w: 'MILK', c: 'White drink from a cow' },
    { w: 'NEST', c: 'Home a bird builds for its eggs' },
    { w: 'RING', c: 'Jewelry you wear on your finger' },
    { w: 'RIVER', c: 'Long stream of water flowing to the sea' },
    { w: 'TRAIN', c: 'Runs on rails and carries passengers' },
    { w: 'APPLE', c: 'Round red or green fruit' },
    { w: 'HOUSE', c: 'Building where a family lives' },
    { w: 'MUSIC', c: 'You listen to it with your ears' },
    { w: 'CLOUD', c: 'Fluffy white shape in the sky' },
    { w: 'SNAKE', c: 'Long animal with no legs' },
    { w: 'DRAGON', c: 'Flying beast from old stories' },
];

/** Each mode picks words by length so difficulty comes from the riddles themselves. */
function treasureWordsFor(mode) {
    const len = (x) => [...x.w].length;
    const want = (x) =>
        mode.k === 'easy' ? len(x) <= 3 :
        mode.k === 'mid' ? len(x) === 4 :
        len(x) >= 5;
    const picked = shuffle(TREASURE_WORDS.filter(want)).slice(0, 8);
    let rest = shuffle(TREASURE_WORDS.filter((x) => !picked.includes(x)));
    while (picked.length < 8 && rest.length) picked.push(rest.pop());
    return picked;
}

function scrambleValid(s) {
    return !!s && s.v === 2 &&
        Number.isInteger(s.mode) && s.mode >= 0 && s.mode < GQ_MODES.length &&
        Array.isArray(s.words) && s.words.length === 8 &&
        s.words.every((x) => x && typeof x.w === 'string' && typeof x.c === 'string' && x.w.length > 1) &&
        Number.isInteger(s.i) && s.i >= 0 && s.i < s.words.length &&
        Number.isInteger(s.opened) && s.opened >= 0 && s.opened <= s.words.length &&
        Number.isFinite(s.score) && s.score >= 0 &&
        Number.isInteger(s.lives) && s.lives > 0 && s.lives <= 5 &&
        Number.isFinite(s.secs) && s.secs > 0 && s.secs <= 600 &&
        Number.isInteger(s.hints) && s.hints >= 0 &&
        Array.isArray(s.tiles) && s.tiles.length > 1 &&
        s.tiles.every((t) => t && typeof t.ch === 'string' && typeof t.used === 'boolean') &&
        Array.isArray(s.ans) && s.ans.every((k) => Number.isInteger(k) && k >= 0 && k < s.tiles.length);
}

function startTreasure(root, mode, modeIndex, resume) {
    const id = 'scramble';
    let words = resume ? resume.words : treasureWordsFor(mode);
    let i = resume ? resume.i : 0;
    let opened = resume ? resume.opened : 0;
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let secs = resume ? resume.secs : gqSecs(100, mode);
    let hints = resume ? resume.hints : 0;
    let tiles = resume ? resume.tiles : [];
    let ans = resume ? resume.ans : [];
    let busy = false;
    let ended = false;

    function layoutLetters(word) {
        const letters = [...word.toLocaleUpperCase('vi')];
        let t;
        do { t = shuffle(letters); } while (letters.length > 1 && t.join('') === letters.join(''));
        return t;
    }

    function newRound() {
        tiles = layoutLetters(words[i].w).map((ch) => ({ ch, used: false }));
        ans = [];
        hints = 0;
        busy = false;
        render();
        checkpoint();
    }

    function checkpoint() {
        if (ended) return;
        saveOfflineRun(id, {
            v: 2, mode: modeIndex, words, i, opened, score, lives, secs, hints, tiles, ans,
        });
    }

    function render() {
        const item = words[i];
        const letters = [...item.w.toLocaleUpperCase('vi')];
        root.innerHTML = `${gqHud(score, lives, `<span id="tsec">⏱ <b>${Math.ceil(secs)}</b>s</span>`)}
            <div class="tbar"><i id="tbar" style="width:${Math.max(0, (secs / gqSecs(100, mode)) * 100)}%"></i></div>
            <div class="chests">${words.map((_, k) => `<span class="${k < opened ? 'open' : ''}">${k < opened ? '🎁' : '📦'}</span>`).join('')}</div>
            <div class="clue">💡 ${item.c}</div>
            <div class="slots" id="slots">${letters.map((_, k) => {
                const ch = ans[k] !== undefined ? tiles[ans[k]].ch : '';
                return `<button class="slot ${ch ? 'fill' : ''}" data-s="${k}">${ch}</button>`;
            }).join('')}</div>
            <div class="tiles">${tiles.map((t, k) => `<button class="tl" data-t="${k}" ${t.used ? 'disabled' : ''}>${t.ch}</button>`).join('')}</div>
            <div class="row">
                <button class="btn alt" data-a="hint">💡 Hint (−15 points)</button>
                <button class="btn alt" data-a="skip">⏭ Skip (−1 life)</button>
            </div>
            <p class="hint">Fill in all the letters to open the chest. A wrong whole word costs 1 life; a hint fills the next correct letter.</p>`;
    }

    function updateClock() {
        const sec = $('#tsec');
        if (sec) sec.innerHTML = `⏱ <b>${Math.ceil(Math.max(0, secs))}</b>s`;
        const bar = $('#tbar');
        if (bar) bar.style.width = Math.max(0, (secs / gqSecs(100, mode)) * 100) + '%';
    }

    function add(k) {
        if (busy || ended || !tiles[k] || tiles[k].used || ans.length >= [...words[i].w].length) return;
        tiles[k].used = true;
        ans.push(k);
        sfx.tick();
        render();
        if (ans.length === [...words[i].w].length) check();
        else checkpoint();
    }

    function check() {
        const guess = ans.map((k) => tiles[k].ch).join('').toLocaleLowerCase('vi');
        busy = true;
        if (guess === words[i].w.toLocaleLowerCase('vi')) {
            opened++;
            score += Math.max(40, 100 - hints * 15);
            sfx.ok();
            const slots = $('#slots');
            if (slots) slots.classList.add('win');
            if (i + 1 < words.length) {
                T.set(() => {
                    i++;
                    newRound();
                }, 700);
            } else {
                T.set(end, 700);
            }
        } else {
            lives--;
            sfx.bad();
            const slots = $('#slots');
            if (slots) slots.classList.add('err');
            checkpoint();
            T.set(() => {
                if (ended) return;
                if (lives <= 0) { end(); return; }
                tiles.forEach((t) => { t.used = false; });
                ans = [];
                busy = false;
                render();
                checkpoint();
            }, 500);
        }
    }

    function hint() {
        if (busy || ended) return;
        const target = [...words[i].w.toLocaleUpperCase('vi')];
        const prefixOk = ans.every((k, n) => tiles[k].ch === target[n]);
        if (!prefixOk) {
            tiles.forEach((t) => { t.used = false; });
            ans = [];
        }
        const need = target[ans.length];
        const k = tiles.findIndex((t) => !t.used && t.ch === need);
        if (k < 0) return;
        hints++;
        score = Math.max(0, score - 15);
        add(k);
    }

    function skip() {
        if (busy || ended) return;
        lives--;
        sfx.bad();
        if (lives <= 0) { end(); return; }
        if (i + 1 < words.length) { i++; newRound(); }
        else end();
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        if (opened >= words.length) S.flags.w10 = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 4) + opened,
            lines: [`Opened ${opened}/${words.length} chests`, `${score} bonus points`],
            replay: scrambleGame, details: { opened, hints },
        });
    }

    function tick() {
        if (ended || busy) return;
        secs = Math.max(0, secs - 1);
        updateClock();
        checkpoint();
        if (secs <= 0) end();
    }

    root.onclick = (e) => {
        const t = e.target.closest('[data-t]');
        const s = e.target.closest('[data-s]');
        const a = e.target.closest('[data-a]');
        if (t) add(+t.dataset.t);
        else if (s && !busy && !ended) {
            const k = +s.dataset.s;
            if (ans[k] !== undefined) {
                const idx = ans.splice(k, 1)[0];
                tiles[idx].used = false;
                checkpoint();
                render();
            }
        } else if (a && !busy && !ended) {
            if (a.dataset.a === 'hint') hint();
            else skip();
        }
    };

    onKey = (e) => {
        if (busy || ended) return;
        if (e.key === 'Backspace' && ans.length) {
            const idx = ans.pop();
            tiles[idx].used = false;
            checkpoint();
            render();
            return;
        }
        if ([...e.key].length === 1) {
            const key = e.key.toLocaleUpperCase('vi');
            const k = tiles.findIndex((t) => !t.used && t.ch === key);
            if (k >= 0) add(k);
        }
    };

    if (!resume) newRound();
    else render();
    T.int(tick, 1000);
}

function scrambleGame(root) {
    const saved = loadOfflineRun('scramble');
    if (scrambleValid(saved)) {
        startTreasure(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('scramble');
    gqIntro(root, {
        id: 'scramble', icon: '🗺️', name: 'Treasure Hunt',
        desc: 'Open each chest by arranging the scrambled letters into the right keyword.',
        steps: [
            'Each chest has a clue — find the missing keyword.',
            'Tap the letter tiles in order to spell the word.',
            'A wrong word or a skip costs 1 life; when time runs out, the trip ends.',
        ],
    }, (mode, index) => startTreasure(root, mode, index));
}

startSingleGame({
    id: 'scramble',
    name: 'Treasure Hunt',
    icon: '🗺️',
    storageKey: 'offline_scramble',
    mount: scrambleGame,
    badges: [
        { id: 'word10', n: 'Open 8 Chests', i: '🧩', ok: () => !!S.flags.w10 },
    ],
});
