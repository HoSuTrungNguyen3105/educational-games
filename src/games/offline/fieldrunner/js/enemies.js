/* =====================================================
   enemies.js · tạo kẻ địch, di chuyển, nhận sát thương
   ===================================================== */

/** Tạo một kẻ địch */
function mkEnemy(type, hp, x, y) {
  const def = EDEF[type];

  const e = {
    def, type,
    hp, max: hp,
    x, y,
    slowT: 0, slowF: 1,
    rem: 1e9,
    id: Math.random(),
    dots: [],
    anim: Math.random() * 6,
    vx: 0, vy: 0,
    haste: 1
  };

  if (def.air && y == null) e.y = 40 + Math.random() * (CH - 80);

  if (def.shield) {
    e.shield = def.shield * D.hp;
    e.shieldMax = e.shield;
    e.shieldT = 0;
  }

  if (def.heal) e.healCd = 1;
  if (def.summon) e.sumCd = 3;
  if (def.warlock) e.curseCd = 2.5;

  return e;
}

/** Nâng một kẻ địch lên hạng tinh anh */
function makeElite(e, n) {
  e.elite = true;
  e.max *= ELITE.hpMul;
  e.hp = e.max;

  e.armorBonus = ELITE.baseArmor + Math.floor((n - HARD_WAVE) / ELITE.armorEvery);
  e.spdMul = ELITE.spdMul;
  e.rwMul = ELITE.rwMul;

  // Từ đợt aegisWave: có thêm khiên năng lượng
  if (n >= ELITE.aegisWave) {
    const sh = e.max * ELITE.aegisPct;
    e.shieldMax = Math.max(e.shieldMax || 0, sh);
    e.shield = e.shieldMax;
    e.shieldT = 0;
  }
}

/** Sinh kẻ địch từ hàng đợi của đợt */
function spawn(s) {
  const def = EDEF[s.t];
  const e = mkEnemy(s.t, def.hp * s.hpM, -20, SR * CS + CS / 2);

  if (def.air) e.y = 40 + Math.random() * (CH - 80);
  if (s.elite) makeElite(e, s.wave);

  enemies.push(e);
}

/** Chọn ô kế tiếp trên đường đi */
function pickNext(e) {
  if (e.x < 0) {
    e.tx = CS / 2;
    e.ty = SR * CS + CS / 2;
    return;
  }

  const [c, r] = cellOf(e.x, e.y);
  const here = dist[c + r * COLS];

  if (here === 0) {
    e.tx = CW + 30;
    e.ty = e.y;
    e.exiting = true;
    return;
  }

  let best = null;
  let bd = here;

  for (const [dc, dr] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) {
    const nc = c + dc;
    const nr = r + dr;

    if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;

    const d = dist[nc + nr * COLS];
    if (d < bd) {
      bd = d;
      best = [nc, nr];
    }
  }

  if (best) {
    e.tx = best[0] * CS + CS / 2;
    e.ty = best[1] * CS + CS / 2;
  }
}

/** Kẻ địch lọt vào cánh đồng */
function leak(e) {
  e.dead = true;
  waveDone++;
  lives -= (e.def.dmg || 1);

  fx.push({ k: 'flash', life: 0.35 });
  if ((e.def.dmg || 1) >= 3) shake = Math.max(shake, 10);
  pulse('stLives');

  if (lives <= 0) {
    lives = 0;
    endGame(false);
  }
  updUI();
}

/** Cập nhật một kẻ địch trong khoảng dt giây */
function stepEnemy(e, dt) {
  if (e.slowT > 0) e.slowT -= dt;

  /* ----- Khiên tự hồi ----- */
  if (e.shieldMax) {
    if (e.shieldT > 0) {
      e.shieldT -= dt;
    } else if (e.shield < e.shieldMax) {
      e.shield = Math.min(e.shieldMax, e.shield + e.shieldMax * 0.1 * dt);
    }
  }

  /* ----- Y tá: hồi máu đồng đội ----- */
  if (e.def.heal) {
    e.healCd -= dt;
    if (e.healCd <= 0) {
      e.healCd = 1.5;
      for (const o of enemies) {
        if (o === e || o.dead) continue;
        if (Math.hypot(o.x - e.x, o.y - e.y) < 110 && o.hp < o.max) {
          o.hp = Math.min(o.max, o.hp + o.max * 0.08);
          fx.push({ k: 'heal', x: o.x, y: o.y, life: 0.4 });
        }
      }
    }
  }

  /* ----- Phù thủy đen: ban khiên cho đồng đội ----- */
  if (e.def.warlock) {
    e.curseCd -= dt;
    if (e.curseCd <= 0 && e.x > 0) {
      e.curseCd = 4;
      let n = 0;
      for (const o of enemies) {
        if (o === e || o.dead || o.def.warlock) continue;
        if (Math.hypot(o.x - e.x, o.y - e.y) > 140) continue;
        if (n >= 5) break;

        const sh = o.max * 0.2;
        o.shieldMax = Math.max(o.shieldMax || 0, sh);
        o.shield = Math.max(o.shield || 0, sh);
        o.shieldT = 0;
        fx.push({ k: 'ring', x: o.x, y: o.y, life: 0.5, c: '#8a6bff', r: 22 });
        n++;
      }
      if (n) fx.push({ k: 'ring', x: e.x, y: e.y, life: 0.6, c: '#5b3bd0', r: 56 });
    }
  }

  /* ----- Triệu hồi: gọi quân con ----- */
  if (e.def.summon) {
    e.sumCd -= dt;
    if (e.sumCd <= 0 && e.x > 20) {
      e.sumCd = 4.5;

      if (enemies.length + pendingSpawns.length < 140) {
        for (let i = 0; i < 2; i++) {
          const hp = Math.max(EDEF.mini.hp, e.max * 0.12);
          const m = mkEnemy('mini', hp, e.x + (i ? 10 : -10), e.y);
          m.rem = e.rem;
          pendingSpawns.push(m);
        }
        fx.push({ k: 'ring', x: e.x, y: e.y, life: 0.5, c: '#c34aa8', r: 34 });
      }
    }
  }

  /* ----- Tốc độ ----- */
  let spd = e.def.sp * D.spd * e.haste * (e.spdMul || 1);
  if (e.def.berserk) spd *= (1 + (1 - clamp(e.hp / e.max, 0, 1)) * 1.2);

  e.anim += dt * spd / 50;

  const ox = e.x;
  const oy = e.y;
  let mv = spd * (e.slowT > 0 ? e.slowF : 1) * dt;

  /* ----- Kẻ địch bay: đi thẳng ----- */
  if (e.def.air) {
    e.x += mv;
    e.rem = CW + 20 - e.x;
    if (e.x > CW + 20) leak(e);

    e.vx = (e.x - ox) / dt;
    e.vy = 0;
    return;
  }

  /* ----- Kẻ địch mặt đất: đi theo đường BFS ----- */
  let guard = 0;
  while (mv > 0 && guard++ < 6) {
    if (e.tx === undefined) pickNext(e);
    if (e.tx === undefined) break;

    const dx = e.tx - e.x;
    const dy = e.ty - e.y;
    const d = Math.hypot(dx, dy);

    if (d <= mv) {
      e.x = e.tx;
      e.y = e.ty;
      mv -= d;
      e.tx = undefined;

      if (e.exiting) {
        leak(e);
        return;
      }
    } else {
      e.x += dx / d * mv;
      e.y += dy / d * mv;
      mv = 0;
    }
  }

  e.vx = (e.x - ox) / dt;
  e.vy = (e.y - oy) / dt;

  if (e.x >= 0) {
    const [c, r] = cellOf(e.x, e.y);
    e.rem = dist[c + r * COLS] * CS;
  } else {
    e.rem = 1e8;
  }
}

/** Tạo hạt bụi / tia lửa */
function particles(x, y, n, c, sp, life, size) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283;
    const v = sp * (0.3 + Math.random());

    parts.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: life * (0.6 + Math.random() * 0.6),
      max: life,
      s: size * (0.6 + Math.random() * 0.8),
      c
    });
  }
}

/** Kẻ địch chết (hoặc hồi sinh nếu là phượng hoàng) */
function killEnemy(e) {
  if (e.dead) return;

  /* Phượng hoàng: hồi sinh một lần với 50% máu */
  if (e.def.revive && !e.revived) {
    e.revived = true;
    e.hp = e.max * 0.5;
    e.dots = [];
    e.slowT = 0;
    e.hurt = 0.2;

    fx.push({ k: 'ring', x: e.x, y: e.y, life: 0.7, c: '#ffb347', r: 70 });
    fx.push({ k: 'txt', x: e.x, y: e.y - 18, life: 0.9, t: 'Tái sinh!', c: '#ffb347' });
    particles(e.x, e.y, 22, '#ff9a3c', 170, 0.7, 3.6);
    return;
  }

  e.dead = true;
  kills++;
  waveDone++;

  const rw = Math.round(e.def.rw * D.rw * (e.rwMul || 1));
  earn(rw);

  fx.push({ k: 'txt', x: e.x, y: e.y - 10, life: 0.8, t: '+' + rw });
  particles(e.x, e.y, e.def.r >= 14 ? 16 : 9, e.def.col, e.def.r >= 14 ? 140 : 90, 0.55, 3.2);

  if (e.def.r >= 19) {
    fx.push({ k: 'ring', x: e.x, y: e.y, life: 0.5, c: '#fff', r: 60 });
    shake = Math.max(shake, 6);
  }

  if (e.elite) {
    fx.push({ k: 'ring', x: e.x, y: e.y, life: 0.5, c: '#ffd93b', r: 44 });
    particles(e.x, e.y, 8, '#ffd93b', 120, 0.6, 3);
  }

  /* Phân thân: tách thành 2 con */
  if (e.def.split) {
    const cdef = EDEF[e.def.split];
    const chp = Math.max(cdef.hp, e.max * 0.35);

    for (let i = 0; i < 2; i++) {
      const m = mkEnemy(e.def.split, chp, e.x + (i ? 12 : -12), e.y);
      m.rem = e.rem;
      pendingSpawns.push(m);
    }
  }
}

/** Gây sát thương lên kẻ địch. Trả về lượng sát thương thực tế. */
function applyDamage(e, d, opts = {}) {
  if (e.dead || d <= 0) return 0;

  /* Né đòn (ninja, tử thần) */
  if (e.def.evade && !opts.dot && Math.random() < e.def.evade) {
    fx.push({ k: 'txt', x: e.x, y: e.y - 14, life: 0.5, t: 'né!', c: '#bfe8ff' });
    return 0;
  }

  /* Giáp (giáp gốc + giáp tinh anh) */
  const armor = (e.def.armor || 0) + (e.armorBonus || 0);
  if (armor && !opts.pierce) d = Math.max(1, d - armor);

  /* Khiên hấp thụ trước */
  if (e.shield > 0) {
    const ab = Math.min(e.shield, d);
    e.shield -= ab;
    d -= ab;
    e.shieldT = 3;
    if (e.shield < 0.5) e.shield = 0;
  }

  e.hp -= d;
  e.hurt = 0.08;

  if (e.hp <= 0) killEnemy(e);
  return d;
}

/** Thêm hiệu ứng sát thương theo thời gian (cháy, độc) */
function applyDot(e, type, dps, t) {
  if (e.dead) return;

  const d = e.dots.find(x => x.type === type);

  if (d) {
    d.t = Math.max(d.t, t);
    d.dps = Math.max(d.dps, dps);
  } else {
    e.dots.push({
      type, dps, t,
      color: type === 'burn' ? '#ff8844' : '#7ad04a'
    });
  }
}
