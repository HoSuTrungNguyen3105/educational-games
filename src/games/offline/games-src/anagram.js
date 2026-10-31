// src/games/offline/games-src/anagram.js — Letter Maze
// Find the hidden English words in the letter grid: tap the first tile, then the last tile of a word.

const ANAGRAM_WORDS = [
    'CAT', 'DOG', 'SUN', 'BEE', 'CUP', 'HAT', 'BED', 'KEY', 'MAP', 'PEN',
    'BUS', 'CAR', 'COW', 'OWL', 'FOX', 'ANT', 'ICE', 'JAM', 'TOY', 'BAG',
    'FROG', 'MOON', 'STAR', 'TREE', 'BIRD', 'FISH', 'DUCK', 'GOAT', 'LION', 'RAIN',
    'HOUSE', 'MOUSE', 'HORSE', 'SNAKE', 'TIGER', 'ZEBRA', 'APPLE', 'MANGO', 'TRAIN', 'MUSIC',
];
const ANAGRAM_FILL = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const ANAGRAM_BOARDS = 4;

function anagramDirs(mode) {
    if (mode.k === 'easy') return [[0, 1], [1, 0]];
    if (mode.k === 'mid') return [[0, 1], [1, 0], [1, 1], [1, -1]];
    return [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];
}

function anagramSize(mode) {
    return mode.k === 'easy' ? 5 : mode.k === 'mid' ? 6 : 7;
}

/** Place 3 words on the grid without overwriting other letters. */
function makeWordBoard(size, mode) {
    const dirs = anagramDirs(mode);
    const pool = shuffle(ANAGRAM_WORDS.filter((w) => [...w].length >= 3 && [...w].length <= size));
    for (let attempt = 0; attempt < 30; attempt++) {
        const grid = Array(size * size).fill('');
        const targets = [];
        const picked = pool.slice(0, 14);
        while (targets.length < 3 && picked.length) {
            const w = picked.shift();
            const letters = [...w];
            let placed = false;
            for (let tryWord = 0; tryWord < 120 && !placed; tryWord++) {
                const [dr, dc] = dirs[rnd(0, dirs.length - 1)];
                const r0 = rnd(0, size - 1);
                const c0 = rnd(0, size - 1);
                const r1 = r0 + dr * (letters.length - 1);
                const c1 = c0 + dc * (letters.length - 1);
                if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue;
                let fits = true;
                for (let k = 0; k < letters.length; k++) {
                    const idx = (r0 + dr * k) * size + (c0 + dc * k);
                    if (grid[idx] && grid[idx] !== letters[k]) { fits = false; break; }
                }
                if (!fits) continue;
                for (let k = 0; k < letters.length; k++) {
                    grid[(r0 + dr * k) * size + (c0 + dc * k)] = letters[k];
                }
                targets.push({ w, r: r0, c: c0, dr, dc, found: false });
                placed = true;
            }
            if (!placed) continue;
        }
        if (targets.length < 3) continue;
        for (let i = 0; i < grid.length; i++) {
            if (!grid[i]) grid[i] = ANAGRAM_FILL[rnd(0, ANAGRAM_FILL.length - 1)];
        }
        return { grid, targets };
    }
    // Fallback: place 3 words on separate rows so the board always has answers.
    const grid = Array(size * size).fill('').map(() => ANAGRAM_FILL[rnd(0, ANAGRAM_FILL.length - 1)]);
    const targets = [];
    shuffle(ANAGRAM_WORDS.filter((w) => [...w].length <= size)).slice(0, 3).forEach((w, row) => {
        const letters = [...w];
        letters.forEach((ch, k) => { grid[row * size + k] = ch; });
        targets.push({ w, r: row, c: 0, dr: 0, dc: 1, found: false });
    });
    return { grid, targets };
}

function anagramValid(s) {
    if (!s || s.v !== 2) return false;
    if (!Number.isInteger(s.mode) || s.mode < 0 || s.mode >= GQ_MODES.length) return false;
    if (!Number.isInteger(s.board) || s.board < 0 || s.board >= ANAGRAM_BOARDS) return false;
    if (!Number.isInteger(s.size) || s.size < 5 || s.size > 7) return false;
    if (!Array.isArray(s.grid) || s.grid.length !== s.size * s.size) return false;
    if (!s.grid.every((ch) => typeof ch === 'string' && ch.length > 0)) return false;
    if (!Array.isArray(s.targets) || s.targets.length !== 3) return false;
    if (!s.targets.every((t) => t && typeof t.w === 'string' && t.w.length > 1 &&
        Number.isInteger(t.r) && Number.isInteger(t.c) &&
        Number.isInteger(t.dr) && Number.isInteger(t.dc) && typeof t.found === 'boolean')) return false;
    if (!Number.isFinite(s.score) || s.score < 0) return false;
    if (!Number.isInteger(s.lives) || s.lives <= 0 || s.lives > 5) return false;
    return true;
}

function startWordMaze(root, mode, modeIndex, resume) {
    const id = 'anagram';
    const size = resume ? resume.size : anagramSize(mode);
    let board = resume ? resume.board : 0;
    let grid = resume ? resume.grid : [];
    let targets = resume ? resume.targets : [];
    let score = resume ? resume.score : 0;
    let lives = resume ? resume.lives : mode.lives;
    let sel = -1;
    let ended = false;
    let locked = false;

    function save() {
        if (ended) return;
        saveOfflineRun(id, { v: 2, mode: modeIndex, board, size, grid, targets, score, lives });
    }

    function cellsOf(t) {
        const letters = [...t.w];
        return letters.map((_, k) => (t.r + t.dr * k) * size + (t.c + t.dc * k));
    }

    function foundCells() {
        const set = new Set();
        targets.forEach((t) => { if (t.found) cellsOf(t).forEach((i) => set.add(i)); });
        return set;
    }

    function render(extra = '') {
        const found = foundCells();
        root.innerHTML = `${gqHud(score, lives, `Board <b>${board + 1}/${ANAGRAM_BOARDS}</b>`)}
            <div class="chips">${targets.map((t) => `<span class="chip ${t.found ? 'done' : ''}">${t.w}</span>`).join('')}</div>
            <div class="wordgrid" style="grid-template-columns:repeat(${size},1fr)">${grid.map((ch, i) =>
                `<button class="wl ${found.has(i) ? 'found' : ''} ${i === sel ? 'sel' : ''}" data-cell="${i}">${ch}</button>`).join('')}</div>
            <div class="row" style="margin-top:12px">
                <button class="btn alt" data-hint="1">💡 Hint (−10 points)</button>
            </div>
            <p class="hint">${extra || 'Tap the first letter tile, then the last letter tile of a word. Words can run across, down or diagonally.'}</p>`;
        save();
    }

    function newBoard() {
        const made = makeWordBoard(size, mode);
        grid = made.grid;
        targets = made.targets;
        sel = -1;
        locked = false;
        render();
        save();
    }

    function completeBoard() {
        score += 30;
        board++;
        sfx.ok();
        if (board >= ANAGRAM_BOARDS) {
            T.set(end, 800);
            return;
        }
        T.set(newBoard, 800);
    }

    function lineBetween(a, b) {
        const r0 = Math.floor(a / size);
        const c0 = a % size;
        const r1 = Math.floor(b / size);
        const c1 = b % size;
        const dr = Math.sign(r1 - r0);
        const dc = Math.sign(c1 - c0);
        const len = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0));
        if (len === 0) return null;
        if (!(r0 === r1 || c0 === c1 || Math.abs(r1 - r0) === Math.abs(c1 - c0))) return null;
        const cells = [];
        for (let k = 0; k <= len; k++) cells.push((r0 + dr * k) * size + (c0 + dc * k));
        return cells;
    }

    function pickCell(index) {
        if (ended || locked) return;
        if (sel < 0) {
            sel = index;
            render();
            return;
        }
        if (sel === index) {
            sel = -1;
            render();
            return;
        }
        const cells = lineBetween(sel, index);
        const start = sel;
        sel = -1;
        if (!cells) {
            sfx.bad();
            render('The two tiles must be on the same row, column or diagonal.');
            return;
        }
        const text = cells.map((i) => grid[i]).join('');
        const rev = [...text].reverse().join('');
        const target = targets.find((t) => !t.found && (t.w === text || t.w === rev));
        if (target) {
            target.found = true;
            score += 10 + [...target.w].length * 5;
            sfx.ok();
            const allDone = targets.every((t) => t.found);
            render(allDone ? 'You found all three words! Opening a new board…' : `Found ${target.w}!`);
            save();
            if (allDone) {
                locked = true;
                completeBoard();
            }
        } else {
            lives--;
            sfx.bad();
            const bad = new Set(cells);
            const nodes = [...root.querySelectorAll('.wl')];
            nodes.forEach((n) => { if (bad.has(Number(n.dataset.cell))) n.classList.add('bad'); });
            if (nodes[start]) nodes[start].classList.add('bad');
            save();
            if (lives <= 0) { locked = true; T.set(end, 700); return; }
            T.set(() => render('That is not one of the words — try again!'), 500);
        }
    }

    function hint() {
        if (ended || locked) return;
        const target = targets.find((t) => !t.found);
        if (!target) return;
        score = Math.max(0, score - 10);
        const nodes = [...root.querySelectorAll('.wl')];
        cellsOf(target).forEach((i) => { if (nodes[i]) nodes[i].classList.add('sel'); });
        sfx.tick();
        save();
        T.set(() => render(), 700);
    }

    function end() {
        if (ended) return;
        ended = true;
        T.clear();
        clearOfflineRun(id);
        const found = targets.filter((t) => t.found).length;
        if (board >= ANAGRAM_BOARDS) S.flags.maze = true;
        finish({
            id, score: gqScore(mode, score), xp: Math.round(score / 5) + board * 5,
            lines: [`Completed ${board}/${ANAGRAM_BOARDS} boards`, `Found ${board * 3 + found} words`],
            replay: anagramGame, details: { boards: board, found },
        });
    }

    root.onclick = (e) => {
        if (ended) return;
        const cell = e.target.closest('[data-cell]');
        if (cell) { pickCell(Number(cell.dataset.cell)); return; }
        if (e.target.closest('[data-hint]')) hint();
    };

    if (!resume) newBoard();
    else if (targets.every((t) => t.found)) newBoard();
    else render();
}

function anagramGame(root) {
    const saved = loadOfflineRun('anagram');
    if (anagramValid(saved)) {
        startWordMaze(root, GQ_MODES[saved.mode], saved.mode, saved);
        return;
    }
    if (saved) clearOfflineRun('anagram');

    gqIntro(root, {
        id: 'anagram', icon: '🧩', name: 'Letter Maze',
        desc: 'Find the English words hiding in the letter grid.',
        steps: [
            'Each board has three words to find, shown in the chips at the top.',
            'Tap the first tile, then the last tile of a word — it can run across, down or diagonally.',
            'A wrong pick costs a life; a hint lights up a whole word but takes 10 points.',
        ],
    }, (mode, index) => startWordMaze(root, mode, index));
}

startSingleGame({
    id: 'anagram',
    name: 'Letter Maze',
    icon: '🧩',
    storageKey: 'offline_anagram',
    mount: anagramGame,
    badges: [
        { id: 'maze', n: 'Clear 4 mazes', i: '🧩', ok: () => !!S.flags.maze },
    ],
});
