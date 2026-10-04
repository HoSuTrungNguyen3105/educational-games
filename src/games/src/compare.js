// src/games/src/compare.js — Ai Nhiều Hơn? (So sánh)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const NAMES = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Huy', 'Lan', 'Mai', 'Nam', 'Phúc', 'Quân'];

MC_MAKERS.compare = function compare(level) {
        const a = rnd(10, 99 * level), b = rnd(10, 99 * level);
        const who = pickOne(NAMES);
        const wantBigger = rnd(2) === 0;
        const pool = [a, b];
        const target = wantBigger ? Math.max(a, b) : Math.min(a, b);
        const ans = String(target);
        const opts = shuffle([ans, ...distractors([String(Math.max(10, target + rnd(1, 9))), String(Math.max(1, target - rnd(1, 9))), String(target + 10), String(Math.max(1, target - 10))], ans).slice(0, 3)]);
        return {
          html: `<div style="font-size:11px;opacity:.7">AI NHIỀU HƠN?</div>
                 <div style="font-size:22px;margin-top:8px">Trong <b>${pool.join(' và ')}</b>, số nào
                   ${wantBigger ? '<b>LỚN</b>' : '<b>NHỎ</b>'} hơn?</div>
                 <div style="font-size:12px;opacity:.6;margin-top:6px">Người chơi tên: ${who}</div>`,
          opts, ans,
          exp: `${target} là số ${wantBigger ? 'lớn nhất' : 'nhỏ nhất'} trong ${pool.join(' và ')}.`,
        };
      },
startMcGame('compare', {
  name: 'Ai Nhiều Hơn?',
  icon: '⚖️',
  badges: [

  ],
});
