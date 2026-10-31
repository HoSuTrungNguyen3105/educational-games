/* =====================================================
   towers.js · tower stats, targeting, projectiles, explosions
   ===================================================== */

/** Current tower stats by level and radar buff */
function stat(t) {
  const T = TYPES[t.type];
  const l = t.lvl - 1;

  return {
    range: (T.range + 0.2 * l) * CS * (1 + (t.bR || 0)),
    dmg: T.dmg * (1 + 0.8 * l) * (1 + (t.bD || 0)),
    rate: T.rate * Math.pow(0.92, l)
  };
}

/** Pick a target for the tower based on its targeting mode */
function pickTarget(t, T, S) {
  let tg = null;
  let sc = 0;

  for (const e of enemies) {
    if (e.dead || e.x < 0) continue;
    if (e.def.air ? !T.air : !T.ground) continue;

    const dd = Math.hypot(e.x - t.x, e.y - t.y);
    if (dd > S.range) continue;
    if (T.minR && dd < T.minR * CS) continue;
    if (e.def.stealth && dd > 2.5 * CS && !t.det) continue;

    let s;
    if (t.mode === 1) s = e.hp + (e.shield || 0);   // strongest
    else if (t.mode === 2) s = -dd;                 // closest
    else s = -e.rem;                                // first

    if (!tg || s > sc) {
      tg = e;
      sc = s;
    }
  }
  return tg;
}

/** Update radar buffs, then let each tower fire */
function updateTowers(dt) {
  /* ----- Radar buff ----- */
  for (const t of towers) {
    t.bD = 0;
    t.bR = 0;
    t.det = false;
  }

  for (const r of towers) {
    if (r.type !== 'radar') continue;

    const rng = (TYPES.radar.range + 0.25 * (r.lvl - 1)) * CS;
    const bd = 0.22 + 0.08 * (r.lvl - 1);
    const br = 0.1 + 0.04 * (r.lvl - 1);
    r.rangeNow = rng;

    for (const t of towers) {
      if (t === r || t.type === 'radar') continue;

      if (Math.hypot(t.x - r.x, t.y - r.y) <= rng) {
        t.bD = Math.max(t.bD, bd);
        t.bR = Math.max(t.bR, br);
        t.det = true;
      }
    }
  }

  /* ----- Fire ----- */
  for (const t of towers) {
    const T = TYPES[t.type];
    if (T.support) continue;

    const S = stat(t);

    t.cd -= dt;
    t.rec = Math.max(0, (t.rec || 0) - dt * 6);

    const tg = pickTarget(t, T, S);

    if (!tg) {
      t.ramp = 0;
      t.lock = null;
      t.firing = false;
      continue;
    }

    t.ang = Math.atan2(tg.y - t.y, tg.x - t.x);

    /* Laser: fires continuously and ramps up */
    if (T.laser) {
      fireLaser(t, T, S, tg, dt);
      continue;
    }

    if (t.cd > 0) continue;

    t.cd = S.rate;
    t.rec = 1;

    if (T.rail) fireRail(t, T, S);
    else if (T.chain) fireChain(t, T, S, tg);
    else if (T.hit) fireSniper(t, T, S, tg);
    else if (T.mortar) fireMortar(t, T, S, tg);
    else fireProjectile(t, T, S, tg);
  }
}

/* ---------- Fire types ---------- */

function fireLaser(t, T, S, tg, dt) {
  if (t.lock !== tg.id) {
    t.lock = tg.id;
    t.ramp = 0;
  }

  t.ramp = Math.min(3.4, (t.ramp || 0) + dt * 0.9);
  t.firing = true;

  applyDamage(tg, S.dmg * (1 + t.ramp) * dt, { pierce: true, dot: true });

  fx.push({
    k: 'laser',
    x1: t.x + Math.cos(t.ang) * 16,
    y1: t.y + Math.sin(t.ang) * 16,
    x2: tg.x,
    y2: tg.y,
    life: 0.06,
    c: T.color,
    w: 2 + t.ramp
  });

  if (Math.random() < 0.5) particles(tg.x, tg.y, 1, '#ffd0da', 60, 0.3, 2);
}

function fireRail(t, T, S) {
  const ex = t.x + Math.cos(t.ang) * S.range;
  const ey = t.y + Math.sin(t.ang) * S.range;
  const sx = t.x + Math.cos(t.ang) * 16;
  const sy = t.y + Math.sin(t.ang) * 16;

  for (const e of enemies) {
    if (e.dead || e.x < 0) continue;
    if (e.def.air ? !T.air : !T.ground) continue;

    if (distSeg(e.x, e.y, sx, sy, ex, ey) <= e.def.r + 8) {
      applyDamage(e, S.dmg, { pierce: true });
      particles(e.x, e.y, 5, '#bff4ff', 130, 0.35, 2.6);
    }
  }

  fx.push({ k: 'rail', x1: sx, y1: sy, x2: ex, y2: ey, life: 0.4, c: T.color });
  fx.push({ k: 'muzzle', x: sx, y: sy, life: 0.18, c: '#bff4ff', r: 20 });
  particles(sx, sy, 10, '#bff4ff', 160, 0.3, 2.5);
}

function fireChain(t, T, S, tg) {
  let cur = tg;
  const hits = [tg];
  const chain = T.chain + Math.floor(t.lvl / 2);

  applyDamage(tg, S.dmg, { pierce: T.pierce });
  fx.push({ k: 'bolt', x1: t.x, y1: t.y - 6, x2: tg.x, y2: tg.y, life: 0.2, c: T.color });

  for (let i = 1; i < chain; i++) {
    let next = null;
    let nd = 100;

    for (const e of enemies) {
      if (e.dead || hits.includes(e)) continue;
      if (e.def.air ? !T.air : !T.ground) continue;

      const d2 = Math.hypot(e.x - cur.x, e.y - cur.y);
      if (d2 < nd) {
        nd = d2;
        next = e;
      }
    }

    if (!next) break;

    applyDamage(next, S.dmg * 0.7, { pierce: T.pierce });
    fx.push({ k: 'bolt', x1: cur.x, y1: cur.y, x2: next.x, y2: next.y, life: 0.2, c: T.color });

    hits.push(next);
    cur = next;
  }
}

function fireSniper(t, T, S, tg) {
  applyDamage(tg, S.dmg, { pierce: T.pierce });

  fx.push({
    k: 'rail',
    x1: t.x + Math.cos(t.ang) * 20,
    y1: t.y + Math.sin(t.ang) * 20,
    x2: tg.x,
    y2: tg.y,
    life: 0.18,
    c: '#e8c8ff',
    thin: 1
  });

  particles(tg.x, tg.y, 5, '#e8c8ff', 90, 0.3, 2.2);
}

function fireMortar(t, T, S, tg) {
  const sp = 230;
  const dd = Math.hypot(tg.x - t.x, tg.y - t.y);
  const tt = dd / sp;

  projs.push({
    x: t.x, y: t.y,
    sx: t.x, sy: t.y,
    tx: tg.x + tg.vx * tt,
    ty: tg.y + tg.vy * tt,
    mortar: true,
    sp,
    dmg: S.dmg,
    splash: T.splash * (1 + 0.06 * (t.lvl - 1)),
    c: T.color,
    r: 6,
    pierce: T.pierce,
    t: 0,
    dur: Math.max(0.35, tt)
  });

  const mx = t.x + Math.cos(t.ang) * 16;
  const my = t.y + Math.sin(t.ang) * 16;
  fx.push({ k: 'muzzle', x: mx, y: my, life: 0.15, c: '#ffe9a0', r: 16 });
  particles(mx, my, 5, '#d0d0d0', 60, 0.4, 3);
}

function fireProjectile(t, T, S, tg) {
  const shots = (t.type === 'gun' && t.lvl >= 3) ? 2 : 1;
  const lv = t.lvl - 1;

  for (let i = 0; i < shots; i++) {
    projs.push({
      x: t.x + Math.cos(t.ang) * 14,
      y: t.y + Math.sin(t.ang) * 14,
      tg,
      sp: T.splash ? 260 : (T.slow || T.poisonDps ? 380 : 500),
      dmg: S.dmg,
      splash: T.splash ? T.splash * (1 + 0.06 * lv) : 0,
      slow: T.slow ? Math.max(0.18, T.slow - 0.07 * lv) : 0,
      burn: T.burnDps ? T.burnDps * (1 + 0.6 * lv) : 0,
      poison: T.poisonDps ? T.poisonDps * (1 + 0.6 * lv) : 0,
      c: T.color,
      r: T.splash ? 6 : 3,
      pierce: T.pierce,
      kind: t.type,
      off: i ? 6 : 0
    });
  }

  const mx = t.x + Math.cos(t.ang) * 20;
  const my = t.y + Math.sin(t.ang) * 20;

  if (t.type === 'flame') {
    particles(mx, my, 3, '#ffa040', 80, 0.3, 3.5);
  } else if (t.type !== 'frost' && t.type !== 'poison') {
    fx.push({ k: 'muzzle', x: mx, y: my, life: 0.1, c: '#fff1b0', r: t.type === 'cannon' ? 15 : 9 });
  }
}

/* ---------- Splash damage ---------- */
function explode(x, y, R, dmg, pierce, opts = {}) {
  fx.push({ k: 'boom', x, y, r: R, life: 0.35 });
  particles(x, y, 12, '#ffb44a', 150, 0.5, 3.5);
  particles(x, y, 6, '#555', 70, 0.7, 5);

  if (R >= 70) shake = Math.max(shake, 3);

  for (const e of enemies) {
    if (e.dead || e.def.air) continue;
    if (Math.hypot(e.x - x, e.y - y) > R + e.def.r * 0.5) continue;

    applyDamage(e, dmg, { pierce });

    if (opts.burn) applyDot(e, 'burn', opts.burn, 2.5);
    if (opts.poison) applyDot(e, 'poison', opts.poison, 4);
    if (opts.slow && !e.dead) {
      e.slowT = 1.6;
      e.slowF = opts.slow;
    }
  }
}

/* ---------- Flying projectiles ---------- */
function updateProjs(dt) {
  for (const p of projs) {

    /* Mortar shell: arcs toward the landing spot */
    if (p.mortar) {
      p.t += dt;
      const u = Math.min(1, p.t / p.dur);

      p.x = p.sx + (p.tx - p.sx) * u;
      p.y = p.sy + (p.ty - p.sy) * u;
      p.z = Math.sin(u * Math.PI) * 46;

      if (u >= 1) {
        p.dead = true;
        explode(p.tx, p.ty, p.splash, p.dmg, p.pierce);
      }
      continue;
    }

    const tg = p.tg;
    if (tg.dead) {
      p.dead = true;
      continue;
    }

    const dx = tg.x - p.x;
    const dy = tg.y - p.y;
    const d = Math.hypot(dx, dy);
    const m = p.sp * dt;

    p.ang = Math.atan2(dy, dx);

    /* Smoke / fire trail behind the projectile */
    if (p.kind === 'missile' && Math.random() < 0.9) {
      parts.push({
        x: p.x, y: p.y,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 0.35, max: 0.35, s: 3, c: '#c8c8d0'
      });
    }
    if (p.kind === 'flame') {
      parts.push({ x: p.x, y: p.y, vx: 0, vy: -12, life: 0.25, max: 0.25, s: 4, c: '#ff9a3c' });
    }
    if (p.kind === 'cannon' && Math.random() < 0.6) {
      parts.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.3, max: 0.3, s: 3, c: 'rgba(90,90,90,.7)' });
    }
    if (p.kind === 'frost' && Math.random() < 0.5) {
      parts.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.3, max: 0.3, s: 2.4, c: '#cfeeff' });
    }

    /* Hit the target */
    if (d <= m + tg.def.r * 0.6) {
      p.dead = true;

      if (p.splash) {
        explode(tg.x, tg.y, p.splash, p.dmg, p.pierce, {
          burn: p.burn, poison: p.poison, slow: p.slow
        });
      } else {
        applyDamage(tg, p.dmg, { pierce: p.pierce });

        if (p.burn) applyDot(tg, 'burn', p.burn, 2.5);
        if (p.poison) applyDot(tg, 'poison', p.poison, 4);
        if (p.slow && !tg.dead) {
          tg.slowT = 1.6;
          tg.slowF = p.slow;
        }
        if (p.kind === 'frost') {
          fx.push({ k: 'ring', x: tg.x, y: tg.y, life: 0.3, c: '#9eeaff', r: 20 });
        }

        particles(tg.x, tg.y, 3, p.c, 60, 0.25, 2);
      }
    } else {
      p.x += dx / d * m;
      p.y += dy / d * m;
    }
  }
}
