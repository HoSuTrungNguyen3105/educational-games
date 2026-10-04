// src/games/src/stroop.js — Đuổi Màu (Tập trung)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const COLORS = { 'Đỏ': '#ef4444', 'Xanh dương': '#3b82f6', 'Vàng': '#eab308', 'Xanh lá': '#22c55e', 'Tím': '#a855f7', 'Cam': '#f97316' };

MC_MAKERS.stroop = function stroop(level) {
        const names = Object.keys(COLORS);
        const say = pickOne(names);                              // chữ trong câu lệnh
        const wrong = names.filter(n => n !== say);
        const answerColor = pickOne(names);                      // màu cần tìm
        const grid = shuffle([answerColor, ...sample(wrong, 3)]);
        const idx = grid.indexOf(answerColor);
        return {
          html: `<div style="font-size:11px;opacity:.7">ĐUỔI MÀU</div>
                 <div style="font-size:22px;margin-top:8px">Chọn ô có màu
                   <b style="color:${COLORS[say]};text-shadow:0 0 6px ${COLORS[say]}">${say}</b></div>
                 <div style="font-size:12px;opacity:.6;margin-top:6px">Đọc CHỮ, đừng nhìn màu ô</div>`,
          opts: grid.map((_, i) => String(i + 1)),
          style: grid.map(g => `background:${COLORS[g]};color:#fff;border:0;font-size:20px;font-weight:900;height:74px`),
          ans: String(idx + 1),
          exp: `Ô <b>${idx + 1}</b> mới là màu <b>${answerColor}</b>.`,
        };
      },
startMcGame('stroop', {
  name: 'Đuổi Màu',
  icon: '🎨',
  badges: [

  ],
});
