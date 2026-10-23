/* =====================================================
   main.js · khởi động game, chọn màn & vòng lặp chính
   ===================================================== */

/** Chuẩn bị số liệu và bắt đầu chơi một cánh đồng */
function startMap(lv) {
  // Thông số theo độ khó (dễ → siêu khó), nhân thêm theo màn
  D = {
    lives: Math.round(GC.by(30, 20, 12, 6) * (lv.livesMul || 1)),
    money: Math.round(GC.by(350, 220, 160, 110) * (lv.moneyMul || 1)),
    hp: GC.by(0.75, 1, 1.3, 1.7) * (lv.hpMul || 1),
    spd: GC.by(0.92, 1, 1.08, 1.16) * (lv.spdMul || 1),
    rw: GC.by(1.25, 1, 0.9, 0.8),
    bonus: GC.by(1.3, 1, 0.85, 0.7)
  };

  TOTAL = lv.waves;
  started = true;

  $('chipSlot').innerHTML = GC.chip();

  applyLevel(lv);   // phải trước makeBg: nền vẽ địa hình của màn
  buildBar();
  makeBg();
  reset();
  fit();
  runLoop();
}

/** Vòng lặp cập nhật + vẽ — chỉ chạy MỘT lần, đổi màn không nhân đôi tốc độ */
function runLoop() {
  if (runLoop.on) return;
  runLoop.on = true;

  let last = performance.now();
  let tick = 0;

  function loop(now) {
    const real = Math.min(0.1, (now - last) / 1000);
    last = now;

    if (started) {
      // Chia nhỏ bước cập nhật để va chạm ổn định khi tăng tốc x2, x3
      let dt = real * speed;
      while (dt > 0) {
        const step = Math.min(dt, 0.025);
        update(step);
        dt -= step;
      }

      // Cập nhật hồi chiêu kỹ năng ~10 lần/giây
      if (Math.floor(now / 100) !== tick) {
        tick = Math.floor(now / 100);
        updSkills();
      }

      draw(paused || over ? 0 : real);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ---------- Nền tạm trong lúc chọn độ khó / chọn màn ---------- */
D = { lives: 20, money: 200, hp: 1, spd: 1, rw: 1, bonus: 1 };
buildSettings();
applyLevel(LEVELS[0]);
buildBar();
makeBg();
fit();
ctx.drawImage(bg, 0, 0);
ctx.drawImage(lightLayer, 0, 0);

/* ---------- Màn chọn độ khó → màn chọn cánh đồng ---------- */
GC.start({
  id: 'fieldrunner',
  name: 'Phòng thủ cánh đồng',
  icon: '🌾',
  desc: '8 cánh đồng, 12 loại vũ khí, 25+ loại lính (có tinh anh từ đợt ' + HARD_WAVE +
        ') và 2 kỹ năng hỗ trợ. Thắng màn này để mở cánh đồng tiếp theo.',
  levels: [
    '30 mạng · tiền dư · địch yếu & chậm',
    '20 mạng · 220💰 · cân bằng',
    '12 mạng · địch trâu & nhanh, thưởng ít',
    '6 mạng · địch cực trâu, thưởng rất ít'
  ],
  onStart: () => {
    const auto = takeAutoMap();
    if (auto) startMap(auto);
    else showMapSelect({ onPick: startMap, onDiff: changeDifficulty });
  }
});
