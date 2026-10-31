// src/games/offline/games-src/quiz.js — Chọn Một Vui
// Mười lượt "chọn bên này hay bên kia" để đo gu của người chơi và trả về
// một danh hiệu vui ở cuối. Không có đáp án đúng/sai, không có đồng hồ.

const QUIZ_PAIRS = [
    ['Đi biển cả ngày', 'Ở nhà thư giãn cả ngày'],
    ['Thử món lạ chưa từng ăn', 'Gọi món quen mỗi lần đi ăn'],
    ['Nuôi một chú rồng con', 'Nuôi một chú mèo con'],
    ['Nhảy theo nhạc giữa sân', 'Nghe nhạc với tai nghe một mình'],
    ['Du lịch bằng khinh khí cầu', 'Du lịch bằng tàu hỏa'],
    ['Mưa kẹo dẻo', 'Mưa bong bóng xà phòng'],
    ['Có cửa bí mật trong phòng', 'Có cửa sổ nhìn ra vườn'],
    ['Tóc đổi màu theo tâm trạng', 'Áo luôn vừa vặn hoàn hảo'],
    ['Một tuần chỉ ăn món mình thích', 'Một tuần ngủ đủ giấc mỗi ngày'],
    ['Có cầu trượt ngay ngoài cửa', 'Có xích đu trong vườn'],
    ['Làm bạn với người ngoài hành tinh', 'Làm bạn với gấu bông biết nói'],
    ['Đi học bằng ván trượt bay', 'Đi học bằng xe đạp'],
    ['Học được phép tàng hình', 'Học được cách bay lượn'],
    ['Thú cưng biết nói tiếng người', 'Cây cảnh biết hát mỗi sáng'],
];

const QUIZ_ROUNDS = 10;

function quizTitle(bold) {
    if (bold >= 9) return 'Nhà thám hiểm tí hon';
    if (bold >= 7) return 'Bạn của gió';
    if (bold >= 5) return 'Vừa phiêu lưu vừa an yên';
    if (bold >= 3) return 'Người thích sự ấm áp';
    return 'Chuyên gia thư giãn';
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
        root.innerHTML = `${gqHud(game.round * 10, 0, `Lượt <b>${game.round + 1}/${QUIZ_ROUNDS}</b>`)}
            ${gqDots(QUIZ_ROUNDS, game.round)}
            <div class="qbox txt">Bạn chọn gì?</div>
            <div class="opts one">
                ${pair.map((choice, i) => `<button class="opt" data-choice="${i}" style="min-height:88px">${choice}</button>`).join('')}
            </div>
            <p class="hint">Chọn theo gu của bạn — không có đáp án đúng hay sai.</p>`;
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
            lines: [`${title}`, `Chọn ${bold} lượt phiêu lưu · ${game.picks.length - bold} lượt an yên`],
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
        <h2>Chọn Một Vui</h2>
        <p>Mười lượt chọn nhanh giữa hai lựa chọn — cuối cùng bạn sẽ nhận một danh hiệu theo gu của mình.</p>
        <ul class="intro-steps">
            <li>Mỗi lượt có hai lựa chọn, chỉ cần chọn bên bạn thích hơn.</li>
            <li>Không có đáp án đúng sai và không có đồng hồ.</li>
            <li>Hoàn thành đủ 10 lượt để xem danh hiệu của bạn.</li>
        </ul>
        <p class="intro-best">${best ? `🏆 Lần trước: <b>${best}</b> điểm` : 'Sẵn sàng chưa?'}</p>
        <button class="btn" data-start="1" style="width:100%;margin-top:14px">Bắt đầu 10 lượt chọn</button>
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
    name: 'Chọn Một Vui',
    icon: '🎉',
    storageKey: 'offline_quiz',
    mount: quizGame,
    badges: [
        { id: 'perfect', n: 'Hoàn thành 10 lượt', i: '🎉', ok: () => !!S.flags.perfect },
    ],
});
