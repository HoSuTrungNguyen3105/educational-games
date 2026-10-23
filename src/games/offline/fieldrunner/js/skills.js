/* =====================================================
   skills.js · kỹ năng hỗ trợ: Không kích & Đóng băng
   ===================================================== */

/** Gọi không kích tại (x,y): 6 quả bom rơi xuống khu vực */
function castStrike(x, y) {
  if (skill.strike.cd > 0 || over) return;

  skill.strike.cd = skill.strike.max;
  aim = null;
  $('skStrike').classList.remove('aim');

  for (let i = 0; i < 6; i++) {
    strikes.push({
      t: 0.5 + i * 0.16,
      x: x + (Math.random() - 0.5) * 130,
      y: y + (Math.random() - 0.5) * 90
    });
  }

  fx.push({ k: 'target', x, y, life: 1.4, r: 90 });
  showMsg('🚀 Không kích đang tới!');
}

/** Đóng băng toàn bộ kẻ địch trong vài giây */
function castFreeze() {
  if (skill.freeze.cd > 0 || over) return;

  skill.freeze.cd = skill.freeze.max;

  for (const e of enemies) {
    if (!e.dead) {
      e.slowT = Math.max(e.slowT, 3.5);
      e.slowF = 0.12;
    }
  }

  fx.push({ k: 'frostwave', life: 0.9 });
  showMsg('❄️ Cả bầy bị đóng băng!');
}

/** Cập nhật bom không kích đang rơi */
function updateStrikes(dt) {
  for (const s of strikes) {
    s.t -= dt;

    if (s.t <= 0 && !s.done) {
      s.done = true;

      explode(s.x, s.y, 75, 260, true);

      for (const e of enemies) {
        if (!e.dead && e.def.air && Math.hypot(e.x - s.x, e.y - s.y) < 55) {
          applyDamage(e, 260, { pierce: true });
        }
      }

      shake = Math.max(shake, 5);
      fx.push({ k: 'ring', x: s.x, y: s.y, life: 0.4, c: '#ffd27a', r: 75 });
    }
  }

  strikes = strikes.filter(s => !s.done);
}

/** Bật / tắt chế độ ngắm không kích */
function toggleStrike() {
  if (skill.strike.cd > 0) {
    showMsg('Không kích đang hồi chiêu');
    return;
  }

  aim = aim ? null : true;
  build = null;
  sel = null;

  $('skStrike').classList.toggle('aim', !!aim);
  document.querySelectorAll('.tw').forEach(b => b.classList.remove('sel'));
  showInfo();
}
