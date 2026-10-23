/* =====================================================
   main.js · khởi động game & vòng lặp chính
   ===================================================== */

/** Bắt đầu ván chơi sau khi bé chọn độ khó */
function init() {
  // Thông số theo độ khó (dễ → siêu khó)
  D = {
    lives: GC.by(30, 20, 12, 6),
    money: GC.by(350, 220, 160, 110),
    hp: GC.by(0.75, 1, 1.3, 1.7),
    spd: GC.by(0.92, 1, 1.08, 1.16),
    rw: GC.by(1.25, 1, 0.9, 0.8),
    bonus: GC.by(1.3, 1, 0.85, 0.7)
  };

  TOTAL = GC.by(20, 25, 30, 35);
  started = true;

  $('chipSlot').innerHTML = GC.chip();

  buildBar();
  makeBg();
  reset();
  fit();

  let last = performance.now();

  function loop(now) {
    const real = Math.min(0.1, (now - last) / 1000);
    last = now;

    // Chia nhỏ bước cập nhật để va chạm ổn định khi tăng tốc x2, x3
    let dt = real * speed;
    while (dt > 0) {
      const step = Math.min(dt, 0.025);
      update(step);
      dt -= step;
    }

    // Cập nhật hồi chiêu kỹ năng ~10 lần/giây
    if (Math.floor(now / 100) !== init.tick) {
      init.tick = Math.floor(now / 100);
      updSkills();
    }

    draw(paused || over ? 0 : real);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ---------- Nền tạm trong lúc chọn độ khó ---------- */
D = { lives: 20, money: 200, hp: 1, spd: 1, rw: 1, bonus: 1 };
makeBg();
buildBar();
fit();
ctx.drawImage(bg, 0, 0);
ctx.drawImage(lightLayer, 0, 0);

/* ---------- Màn chọn độ khó ---------- */
GC.start({
  id: 'fieldrunner',
  name: 'Phòng thủ cánh đồng',
  icon: '🌾',
  desc: 'Xây tháp, dựng mê cung và ngăn kẻ địch tràn vào cánh đồng. ' +
        '12 loại vũ khí, 25+ loại lính (có tinh anh từ đợt ' + HARD_WAVE + ') và 2 kỹ năng hỗ trợ.',
  levels: [
    '20 đợt · 30 mạng · 350💰 · địch yếu & chậm',
    '25 đợt · 20 mạng · 220💰 · cân bằng',
    '30 đợt · 12 mạng · 160💰 · địch trâu & nhanh',
    '35 đợt · 6 mạng · 110💰 · địch cực trâu, thưởng ít'
  ],
  onStart: init
});
