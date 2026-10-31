/* =====================================================
   render.js · draws the whole scene each frame
   ===================================================== */

/** Draw the preview shown while placing a tower */
function drawPlacementGhost() {
  if (!build || !hover) return;

  const [hc, hr] = hover;
  const bad = canPlace(hc, hr);
  const T = TYPES[build];

  ctx.fillStyle = bad ? 'rgba(220,40,40,.4)' : 'rgba(255,255,255,.4)';
  rr(hc * CS + 2, hr * CS + 2, CS - 4, CS - 4, 6);
  ctx.fill();

  ctx.strokeStyle = bad ? 'rgba(220,40,40,.9)' : 'rgba(255,255,255,.95)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.arc(hc * CS + CS / 2, hr * CS + CS / 2, T.range * CS, 0, 7);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 0.6;
  drawTower({ type: build, lvl: 1, ang: 0 }, hc * CS + CS / 2, hr * CS + CS / 2, gtime, false);
  ctx.globalAlpha = 1;
}

/** Draw towers (sorted by y so towers behind are covered correctly) */
function drawTowers() {
  towers.slice().sort((a, b) => a.y - b.y).forEach(t => {
    drawTower(t, t.x, t.y, gtime, false);

    // Radar buff marker
    if (t.bD > 0) {
      ctx.strokeStyle = 'rgba(53,208,160,.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y - 24, 3.5, 0, 7);
      ctx.stroke();

      ctx.fillStyle = '#35d0a0';
      ctx.fillRect(t.x - 1, t.y - 28, 2, 8);
    }

    // Selected tower: gold outline + range
    if (t === sel) {
      ctx.strokeStyle = '#ffd93b';
      ctx.lineWidth = 3.5;
      rr(t.x - 20, t.y - 20, 40, 40, 9);
      ctx.stroke();

      const R = t.type === 'radar' ? (t.rangeNow || TYPES.radar.range * CS) : stat(t).range;

      ctx.fillStyle = 'rgba(255,255,255,.12)';
      ctx.beginPath();
      ctx.arc(t.x, t.y, R, 0, 7);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,.85)';
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
}

/** Draw flying projectiles */
function drawProjectiles() {
  for (const p of projs) {

    // Mortar shell
    if (p.mortar) {
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 5, 2.5, 0, 0, 7);
      ctx.fill();

      ctx.fillStyle = '#444';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.z, 6, 0, 7);
      ctx.fill();
      ctx.stroke();
      continue;
    }

    // Missile
    if (p.kind === 'missile') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ang || 0);

      // Flame trailing behind
      ctx.fillStyle = 'rgba(255,170,60,.85)';
      ctx.beginPath();
      ctx.moveTo(-6, -2);
      ctx.lineTo(-13 - Math.random() * 3, 0);
      ctx.lineTo(-6, 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      rr(-6, -2.5, 12, 5, 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(6, -2.5);
      ctx.lineTo(10, 0);
      ctx.lineTo(6, 2.5);
      ctx.fill();
      ctx.restore();
      continue;
    }

    // Cannon shell
    if (p.kind === 'cannon') {
      ctx.fillStyle = '#2a2a30';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffb36b';
      ctx.beginPath();
      ctx.arc(p.x - 1.5, p.y - 1.5, 2, 0, 7);
      ctx.fill();
      continue;
    }

    // Ice shard
    if (p.kind === 'frost') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ang || 0);

      ctx.fillStyle = '#d6f6ff';
      ctx.strokeStyle = '#58d3e8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-3, -3);
      ctx.lineTo(-3, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      continue;
    }

    // Machine gun bullet (bright streak)
    if (p.kind === 'gun') {
      const dx = Math.cos(p.ang || 0);
      const dy = Math.sin(p.ang || 0);

      ctx.strokeStyle = 'rgba(255,226,122,.35)';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - dx * 14, p.y - dy * 14);
      ctx.stroke();

      ctx.strokeStyle = '#fff3b0';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - dx * 9, p.y - dy * 9);
      ctx.stroke();
      continue;
    }

    // Regular projectile (poison, fire...)
    ctx.fillStyle = p.c;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 7);
    ctx.fill();
    ctx.stroke();
  }
}

/** Draw short-lived effects (beams, explosions, shockwaves, floating text...) */
function drawEffects() {
  for (const f of fx) {

    if (f.k === 'beam') {
      ctx.strokeStyle = f.c;
      ctx.globalAlpha = f.life / 0.15;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(f.x1, f.y1);
      ctx.lineTo(f.x2, f.y2);
      ctx.stroke();
      ctx.globalAlpha = 1;

    } else if (f.k === 'bolt') {
      ctx.shadowColor = f.c;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = clamp(f.life / 0.2, 0, 1);
      jag(f.x1, f.y1, f.x2, f.y2, 14);
      ctx.stroke();

      ctx.strokeStyle = f.c;
      ctx.lineWidth = 5;
      ctx.globalAlpha *= 0.45;
      jag(f.x1, f.y1, f.x2, f.y2, 14);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

    } else if (f.k === 'laser') {
      ctx.shadowColor = f.c;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = f.c;
      ctx.lineWidth = f.w * 1.6;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(f.x1, f.y1);
      ctx.lineTo(f.x2, f.y2);
      ctx.stroke();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = f.w * 0.6;
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

    } else if (f.k === 'rail') {
      const a = clamp(f.life / (f.thin ? 0.18 : 0.4), 0, 1);

      ctx.shadowColor = f.c;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = f.c;
      ctx.lineWidth = (f.thin ? 3 : 12) * a;
      ctx.globalAlpha = 0.6 * a;
      ctx.beginPath();
      ctx.moveTo(f.x1, f.y1);
      ctx.lineTo(f.x2, f.y2);
      ctx.stroke();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = (f.thin ? 1.5 : 4) * a;
      ctx.globalAlpha = a;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

    } else if (f.k === 'muzzle') {
      // Muzzle flash
      const u = clamp(f.life / 0.18, 0, 1);
      ctx.fillStyle = rg(f.x, f.y, 1, f.r, [
        [0, 'rgba(255,255,255,' + u + ')'],
        [0.4, f.c],
        [1, 'rgba(255,200,80,0)']
      ]);
      ctx.globalAlpha = u;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, 7);
      ctx.fill();
      ctx.globalAlpha = 1;

    } else if (f.k === 'boom') {
      const u = 1 - f.life / 0.35;
      ctx.fillStyle = rg(f.x, f.y, 2, f.r * (0.6 + u * 0.5), [
        [0, 'rgba(255,240,170,' + (1 - u) + ')'],
        [0.5, 'rgba(255,150,40,' + (0.7 * (1 - u)) + ')'],
        [1, 'rgba(255,80,20,0)']
      ]);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * (0.6 + u * 0.5), 0, 7);
      ctx.fill();

      // Shockwave ring
      ctx.strokeStyle = 'rgba(255,230,160,' + (0.8 * (1 - u)) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * (0.4 + u * 0.9), 0, 7);
      ctx.stroke();

    } else if (f.k === 'ring') {
      const u = 1 - f.life / 0.5;
      ctx.strokeStyle = f.c;
      ctx.globalAlpha = clamp(1 - u, 0, 1);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * (0.3 + u * 0.7), 0, 7);
      ctx.stroke();
      ctx.globalAlpha = 1;

    } else if (f.k === 'txt') {
      ctx.fillStyle = f.c || '#ffe55c';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3.5;
      ctx.font = '800 14px Baloo 2,Segoe UI,sans-serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = Math.min(1, f.life * 2);
      ctx.strokeText(f.t, f.x, f.y - (0.8 - f.life) * 30);
      ctx.fillText(f.t, f.x, f.y - (0.8 - f.life) * 30);
      ctx.globalAlpha = 1;

    } else if (f.k === 'flash') {
      ctx.fillStyle = 'rgba(255,0,0,' + (f.life / 0.35 * 0.28) + ')';
      ctx.fillRect(-20, -20, CW + 40, CH + 40);

    } else if (f.k === 'heal') {
      ctx.fillStyle = 'rgba(120,255,140,' + (f.life / 0.4 * 0.6) + ')';
      ctx.beginPath();
      ctx.arc(f.x, f.y, 14 + (0.4 - f.life) * 20, 0, 7);
      ctx.fill();

    } else if (f.k === 'target') {
      ctx.strokeStyle = 'rgba(255,70,50,' + (0.5 + 0.4 * Math.sin(f.life * 20)) + ')';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, 7);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(f.x - 14, f.y);
      ctx.lineTo(f.x + 14, f.y);
      ctx.moveTo(f.x, f.y - 14);
      ctx.lineTo(f.x, f.y + 14);
      ctx.stroke();

    } else if (f.k === 'frostwave') {
      const u = 1 - f.life / 0.9;
      ctx.fillStyle = 'rgba(150,230,255,' + (0.35 * (1 - u)) + ')';
      ctx.fillRect(-20, -20, CW + 40, CH + 40);

      ctx.strokeStyle = 'rgba(200,245,255,' + (1 - u) + ')';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(CW / 2, CH / 2, u * CW * 0.7, 0, 7);
      ctx.stroke();
    }
  }
}

/** Draw an airstrike missile falling from above */
function drawStrikes() {
  for (const s of strikes) {
    const u = clamp(1 - s.t / 0.5, 0, 1);
    if (u <= 0 || s.t < 0) continue;

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;

    ctx.save();
    ctx.translate(s.x, s.y - (1 - u) * 260);
    ctx.rotate(Math.PI / 2);

    // Fire trail
    ctx.fillStyle = 'rgba(255,160,50,.8)';
    ctx.beginPath();
    ctx.moveTo(-9, -3);
    ctx.lineTo(-20, 0);
    ctx.lineTo(-9, 3);
    ctx.fill();

    ctx.fillStyle = '#fff';
    rr(-9, -3.5, 18, 7, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff5a3a';
    ctx.beginPath();
    ctx.moveTo(9, -3.5);
    ctx.lineTo(15, 0);
    ctx.lineTo(9, 3.5);
    ctx.fill();
    ctx.restore();
  }
}

/** Airstrike targeting reticle that follows the mouse */
function drawAim() {
  if (!aim || !hover) return;

  const x = hover[0] * CS + CS / 2;
  const y = hover[1] * CS + CS / 2;

  ctx.strokeStyle = 'rgba(255,70,50,.9)';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(x, y, 90, 0, 7);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.lineTo(x + 12, y);
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y + 12);
  ctx.stroke();
}

/** Draw everything. dt is the frame's real elapsed time (0 while paused). */
function draw(dt) {
  ctx.save();

  // Screen shake on big explosions
  if (shake > 0.2) {
    ctx.translate(
      (Math.random() - 0.5) * shake,
      (Math.random() - 0.5) * shake
    );
  }

  ctx.drawImage(bg, 0, 0);
  if (gfx) drawClouds(dt);
  drawPath();
  drawGates();

  drawPlacementGhost();
  drawTowers();

  // Ground enemies → projectiles → flying enemies (so planes stay on top)
  for (const e of enemies) if (!e.def.air) drawEnemy(e);
  drawProjectiles();
  for (const e of enemies) if (e.def.air) drawEnemy(e);

  // Particles
  for (const p of parts) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s * (0.4 + 0.6 * p.life / p.max), 0, 7);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawEffects();
  drawStrikes();
  drawAim();
  if (gfx) drawAmbient(dt);

  ctx.restore();

  // Light/shadow overlay layer (not shaken with the screen)
  ctx.drawImage(lightLayer, 0, 0);
}
