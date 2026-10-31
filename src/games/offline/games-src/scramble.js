// src/games/offline/games-src/scramble.js — Săn Kho Báu
// Mỗi rương là một câu đố: xếp các chữ cái xáo trộn thành từ khóa để mở rương.

const TREASURE_WORDS = [
    { w: 'MÈO', c: 'Con vật nhỏ, kêu "meo meo"' },
    { w: 'KEM', c: 'Món ngọt lạnh, ăn mùa hè' },
    { w: 'HOA', c: 'Nở đẹp và thường có mùi thơm' },
    { w: 'VỊT', c: 'Con vật bơi giỏi, kêu "cạp cạp"' },
    { w: 'MƯA', c: 'Nước rơi từ trời, ra đường cần ô' },
    { w: 'MÂY', c: 'Trắng xốp, trôi trên bầu trời' },
    { w: 'TRÀ', c: 'Đồ uống ấm từ lá, hay dùng tiếp khách' },
    { w: 'ĐÈN', c: 'Bật lên để soi sáng' },
    { w: 'GHẾ', c: 'Đồ nội thất để ngồi' },
    { w: 'CÁO', c: 'Con vật ranh mãnh, có đuôi to' },
    { w: 'VOI', c: 'Con vật to nhất trên cạn, có vòi dài' },
    { w: 'KHỈ', c: 'Con vật leo cây giỏi, thích ăn chuối' },
    { w: 'THỎ', c: 'Con vật tai dài, thích cà rốt' },
    { w: 'ONG', c: 'Côn trùng nhỏ, hút mật hoa' },
    { w: 'BÚT', c: 'Đồ dùng để viết chữ' },
    { w: 'CẶP', c: 'Đồ dùng đựng sách đến trường' },
    { w: 'BÀN', c: 'Đồ nội thất để đặt sách vở' },
    { w: 'CỬA', c: 'Chỗ ra vào của ngôi nhà' },
    { w: 'NÚI', c: 'Cao lớn, có đỉnh và sườn' },
    { w: 'CẦU', c: 'Bắc qua sông để đi lại' },
    { w: 'TÀU', c: 'Chạy trên đường ray hoặc trên biển' },
    { w: 'SÁCH', c: 'Mở ra để đọc, có nhiều trang' },
    { w: 'BÁNH', c: 'Món ăn làm từ bột, thường tròn' },
    { w: 'CƯỜI', c: 'Biểu cảm khi thấy vui' },
    { w: 'SÓNG', c: 'Nước biển dâng lên rồi hạ xuống' },
    { w: 'NẮNG', c: 'Ánh sáng mạnh, ra đường cần đội mũ' },
    { w: 'BIỂN', c: 'Vùng nước mặn rộng lớn' },
    { w: 'NGỰA', c: 'Con vật chạy nhanh, có bờm' },
    { w: 'RỒNG', c: 'Con vật trong truyện cổ, biết bay' },
    { w: 'BƯỚM', c: 'Côn trùng có cánh nhiều màu' },
    { w: 'KIẾN', c: 'Côn trùng nhỏ, đi thành đàn' },
    { w: 'VƯỜN', c: 'Nơi trồng cây và hoa' },
    { w: 'SÔNG', c: 'Dòng nước chảy dài ra biển' },
    { w: 'SUỐI', c: 'Nước chảy nhỏ giữa núi rừng' },
    { w: 'THÁC', c: 'Nước đổ từ trên cao xuống' },
    { w: 'ĐÀN', c: 'Nhạc cụ có dây, gảy bằng tay' },
    { w: 'SÁO', c: 'Nhạc cụ thổi bằng hơi' },
    { w: 'PHIM', c: 'Xem ở rạp hoặc trên tivi' },
    { w: 'NHẠC', c: 'Nghe bằng tai, có giai điệu' },
    { w: 'TRƯỜNG', c: 'Nơi học sinh đến học mỗi ngày' },
    { w: 'TRỐNG', c: 'Nhạc cụ gõ, báo giờ vào lớp' },
    { w: 'ĐƯỜNG', c: 'Lối đi dành cho xe cộ' },
    { w: 'THUYỀN', c: 'Phương tiện đi trên mặt nước' },
    { w: 'PHƯỢNG', c: 'Cây nở hoa đỏ báo hè về' },
    { w: 'TUYẾT', c: 'Nước đóng băng rơi thành hạt trắng' },
];

/** Mỗi mức chọn từ theo độ dài để độ khó đến từ chính câu đố. */
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
                <button class="btn alt" data-a="hint">💡 Gợi ý (−15 điểm)</button>
                <button class="btn alt" data-a="skip">⏭ Bỏ qua (−1 mạng)</button>
            </div>
            <p class="hint">Xếp đủ chữ cái để mở rương. Sai cả từ sẽ mất 1 mạng; gợi ý mở đúng một ô tiếp theo.</p>`;
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
            lines: [`Mở được ${opened}/${words.length} rương`, `${score} điểm thưởng`],
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
        id: 'scramble', icon: '🗺️', name: 'Săn Kho Báu',
        desc: 'Mở từng rương bằng cách xếp các chữ cái xáo trộn thành từ khóa đúng.',
        steps: [
            'Mỗi rương có một câu gợi ý — tìm từ khóa còn thiếu.',
            'Chạm các ô chữ theo đúng thứ tự để xếp thành từ.',
            'Sai cả từ hoặc bỏ qua sẽ mất 1 mạng; hết giờ là kết thúc chuyến đi.',
        ],
    }, (mode, index) => startTreasure(root, mode, index));
}

startSingleGame({
    id: 'scramble',
    name: 'Săn Kho Báu',
    icon: '🗺️',
    storageKey: 'offline_scramble',
    mount: scrambleGame,
    badges: [
        { id: 'word10', n: 'Mở 8 rương', i: '🧩', ok: () => !!S.flags.w10 },
    ],
});
