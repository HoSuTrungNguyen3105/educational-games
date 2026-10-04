// src/games/src/shapecount.js — Đếm Nhanh (Tập trung)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

MC_MAKERS.shapecount = function shapecount(level) {
        const shape = pickOne(['🔺', '🔵', '🟨', '🟩', '🟥', '⬛', '🔶']);
        const total = rnd(5, 8 + level * 2);
        const oddAt = rnd(total);
        const noise = sample(['⭐', '❤️', '🌙', '⚡', '🎈', '🍀'].filter(s => s !== shape), 1)[0];
        const cells = shuffle(Array.from({ length: total }, (_, i) => (i === oddAt ? shape : noise)));
        const right = cells.filter(c => c === shape).length;
        const opts = shuffle([String(right), ...distractors([String(right + 1), String(right - 1), String(right + 2), String(right + 3), 1, 0].map(String), String(right)).slice(0, 3)]);
        return {
          html: `<div style="font-size:11px;opacity:.7">ĐẾM NHANH</div>
                 <div style="font-size:12px;opacity:.7;margin-top:6px">Có bao nhiêu biểu tượng
                   <b style="font-size:20px">${shape}</b>?</div>
                 <div style="font-size:26px;letter-spacing:6px;line-height:1.7;margin-top:10px">${cells.join(' ')}</div>`,
          opts, ans: String(right),
          exp: `Có <b>${right}</b> biểu tượng ${shape}.`,
        };
      },
startMcGame('shapecount', {
  name: 'Đếm Nhanh',
  icon: '🔷',
  badges: [

  ],
});
