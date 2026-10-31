/* =====================================================
   render-towers.js · draws towers (base, barrel, level stars)
   Used both on the field and for icons in the tower picker.
   ===================================================== */

/** Draw a tower's stone base */
function drawTowerBase(t, x, y, lvl, time, icon) {
  const T = TYPES[t.type];

  // Soft drop shadow
  if (!icon) {
    ctx.fillStyle = rg(x + 3, y + 9, 4, 24, [
      [0, 'rgba(0,0,0,.38)'],
      [1, 'rgba(0,0,0,0)']
    ]);
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 9, 24, 14, 0, 0, 7);
    ctx.fill();
  }

  // Level 5 halo
  if (lvl >= 5 && !icon) {
    const a = 0.35 + 0.25 * Math.sin(time * 5);
    ctx.fillStyle = rg(x, y, 6, 30, [
      [0, 'rgba(255,217,59,' + a + ')'],
      [1, 'rgba(255,217,59,0)']
    ]);
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 7);
    ctx.fill();
  }

  // Stone base
  ctx.fillStyle = lg(x, y - 17, x, y + 17, [[0, '#b9c1ca'], [1, '#5a626c']]);
  rr(x - 17, y - 17, 34, 34, 8);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Bright top edge
  ctx.fillStyle = 'rgba(255,255,255,.32)';
  rr(x - 14, y - 14, 28, 6, 3);
  ctx.fill();

  // Rivets
  ctx.fillStyle = '#3d434a';
  for (const [bx, by] of [[-12, -12], [12, -12], [-12, 12], [12, 12]]) {
    ctx.beginPath();
    ctx.arc(x + bx, y + by, 1.7, 0, 7);
    ctx.fill();
  }

  // Level-colored metal rim
  if (lvl >= 3) {
    ctx.strokeStyle = lvl >= 5 ? '#ffd93b' : '#e8c24a';
    ctx.lineWidth = 2;
    rr(x - 14.5, y - 14.5, 29, 29, 6);
    ctx.stroke();
  }

  // Color ring per tower type
  ctx.fillStyle = lg(x - 11, y - 11, x + 11, y + 11, [
    [0, lighten(T.color, 0.4)],
    [1, darken(T.color, 0.1)]
  ]);
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, 7);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glossy highlight
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  ctx.beginPath();
  ctx.ellipse(x - 4, y - 5, 4, 2.2, -0.6, 0, 7);
  ctx.fill();
}

/** Draw the barrel/weapon body rotated toward the aim direction */
function drawTowerWeapon(t, lvl, time, icon) {
  const metal = lg(0, -6, 0, 6, [[0, '#7a828e'], [0.5, '#3a4048'], [1, '#252a30']]);

  ctx.lineWidth = 1.8;
  ctx.strokeStyle = INK;

  const rec = icon ? 0 : (t.rec || 0) * 3;
  const ang = t.ang || 0;

  switch (t.type) {

    case 'gun': {
      ctx.fillStyle = metal;
      const ys = lvl >= 3 ? [-7, -1.5, 4] : [-5, 1];

      ys.forEach(yy => {
        ctx.fillRect(3, yy, 17 + Math.min(lvl, 4), 3.4);
        ctx.strokeRect(3, yy, 17 + Math.min(lvl, 4), 3.4);
      });

      ctx.fillStyle = '#ffe27a';
      if (rec > 1.2) ys.forEach(yy => ctx.fillRect(21 + lvl, yy, 5, 3.4));
      break;
    }

    case 'cannon': {
      ctx.fillStyle = metal;
      rr(0, -6, 19, 12, 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e8923a';
      ctx.fillRect(5, -6, 3, 12);
      ctx.fillRect(12, -6, 3, 12);

      ctx.fillStyle = '#111';
      rr(17, -7.5, 6, 15, 2);
      ctx.fill();
      break;
    }

    case 'frost': {
      for (let k = 0; k < 3; k++) {
        ctx.save();
        ctx.rotate(k * 1.047);
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(16, 0);
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = '#8ad8f0';
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(8, -7);
      ctx.lineTo(2, 0);
      ctx.lineTo(8, 7);
      ctx.closePath();
      ctx.fillStyle = lg(2, 0, 22, 0, [[0, '#bff4ff'], [1, '#ffffff']]);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      break;
    }

    case 'sniper': {
      ctx.fillStyle = metal;
      ctx.fillRect(0, -2.3, 27, 4.6);
      ctx.strokeRect(0, -2.3, 27, 4.6);

      ctx.fillStyle = '#e8d0ff';
      ctx.fillRect(10, -6, 8, 3.5);
      ctx.strokeRect(10, -6, 8, 3.5);

      ctx.fillStyle = '#a45bd6';
      ctx.fillRect(25, -3.4, 4, 6.8);
      break;
    }

    case 'flame': {
      ctx.fillStyle = '#8a3020';
      rr(-3, -8, 14, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffb36b';
      ctx.fillRect(1, -5, 6, 3);

      ctx.fillStyle = metal;
      ctx.fillRect(10, -3, 12, 6);
      ctx.strokeRect(10, -3, 12, 6);

      const f = 6 + Math.sin(time * 30) * 2;

      ctx.fillStyle = '#ff9a3c';
      ctx.beginPath();
      ctx.moveTo(22, -3);
      ctx.lineTo(22 + f, 0);
      ctx.lineTo(22, 3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffe27a';
      ctx.beginPath();
      ctx.moveTo(22, -1.6);
      ctx.lineTo(22 + f * 0.6, 0);
      ctx.lineTo(22, 1.6);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'tesla': {
      ctx.rotate(-ang);   // lightning coil doesn't rotate toward the target

      ctx.fillStyle = '#555d66';
      ctx.fillRect(-3, -3, 6, 12);
      ctx.strokeRect(-3, -3, 6, 12);

      ctx.fillStyle = rg(0, -8, 1, 9, [[0, '#fff'], [0.4, '#f2e14c'], [1, '#c9a800']]);
      ctx.beginPath();
      ctx.arc(0, -8, 8, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#fff9c0';
      ctx.lineWidth = 1.4;
      for (let k = 0; k < 3; k++) {
        const a = time * 6 + k * 2.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 8, -8 + Math.sin(a) * 8);
        ctx.lineTo(Math.cos(a + 0.3) * 13, -8 + Math.sin(a + 0.3) * 13);
        ctx.stroke();
      }
      break;
    }

    case 'poison': {
      ctx.fillStyle = metal;
      ctx.fillRect(6, -3, 14, 6);
      ctx.strokeRect(6, -3, 14, 6);

      ctx.fillStyle = rg(-1, 0, 1, 9, [[0, '#c9ff9a'], [1, '#4a9a2a']]);
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, 7);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.beginPath();
      ctx.arc(-2 + Math.sin(time * 4) * 1.5, -2, 1.5, 0, 7);
      ctx.arc(2, 1 + Math.cos(time * 5) * 1, 1.1, 0, 7);
      ctx.fill();

      ctx.fillStyle = '#2a5a12';
      ctx.fillRect(19, -4, 3, 8);
      break;
    }

    case 'missile': {
      ctx.fillStyle = '#6a2a4a';
      rr(-3, -9, 22, 18, 3);
      ctx.fill();
      ctx.stroke();

      [-5.5, 0, 5.5].forEach(yy => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(2, yy - 1.6, 14, 3.2);

        ctx.fillStyle = '#ff5fa2';
        ctx.beginPath();
        ctx.moveTo(16, yy - 1.8);
        ctx.lineTo(21, yy);
        ctx.lineTo(16, yy + 1.8);
        ctx.fill();
      });
      break;
    }

    case 'laser': {
      ctx.fillStyle = metal;
      rr(-2, -8, 14, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#2b2f36';
      ctx.fillRect(10, -3.2, 12, 6.4);
      ctx.strokeRect(10, -3.2, 12, 6.4);

      const gl = 0.6 + 0.4 * Math.sin(time * 9);
      ctx.fillStyle = rg(24, 0, 1, 8, [
        [0, '#fff'],
        [0.4, 'rgba(255,59,107,' + gl + ')'],
        [1, 'rgba(255,59,107,0)']
      ]);
      ctx.beginPath();
      ctx.arc(24, 0, 8, 0, 7);
      ctx.fill();

      ctx.fillStyle = '#ff3b6b';
      ctx.beginPath();
      ctx.arc(4, 0, 3, 0, 7);
      ctx.fill();
      break;
    }

    case 'rail': {
      ctx.fillStyle = metal;
      rr(-4, -8, 12, 16, 3);
      ctx.fill();
      ctx.stroke();

      [-4, 1.6].forEach(yy => {
        ctx.fillStyle = '#38404a';
        ctx.fillRect(4, yy, 26, 2.6);
        ctx.strokeRect(4, yy, 26, 2.6);
      });

      const gl = icon ? 0.7 : Math.max(0, 1 - (t.cd / (stat(t).rate || 1))) * 0.9 + 0.1;
      ctx.strokeStyle = 'rgba(70,224,255,' + gl + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(28, 0);
      ctx.stroke();

      ctx.fillStyle = '#46e0ff';
      ctx.fillRect(-1, -2, 4, 4);
      break;
    }

    case 'mortar': {
      ctx.fillStyle = '#6b7448';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = metal;
      ctx.beginPath();
      ctx.moveTo(2, -7);
      ctx.lineTo(18, -5.5);
      ctx.lineTo(18, 5.5);
      ctx.lineTo(2, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.ellipse(18, 0, 2.5, 5.5, 0, 0, 7);
      ctx.fill();

      ctx.fillStyle = '#d6c95a';
      ctx.fillRect(7, -6, 3, 12);
      break;
    }

    case 'radar': {
      ctx.fillStyle = '#e8fff6';
      ctx.beginPath();
      ctx.ellipse(2, 0, 5, 12, 0, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#35d0a0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();

      ctx.fillStyle = '#ff5a5a';
      ctx.beginPath();
      ctx.arc(10, 0, 2, 0, 7);
      ctx.fill();
      break;
    }
  }
}

/** Draw a tower at (x,y). icon=true when drawing the small picker icon. */
function drawTower(t, x, y, time, icon) {
  const lvl = t.lvl || 1;
  const ang = icon ? -0.5 : (t.ang || 0);

  ctx.save();

  drawTowerBase(t, x, y, lvl, time, icon);

  // Move the origin to the tower center, then rotate toward the aim direction
  ctx.translate(x, y);
  ctx.rotate(t.type === 'radar' ? time * 1.6 : ang);

  const rec = icon ? 0 : (t.rec || 0) * 3;
  ctx.translate(-rec, 0);

  drawTowerWeapon({ type: t.type, lvl: lvl, cd: t.cd, rec: t.rec, ang: ang }, lvl, time, icon);

  ctx.restore();

  // Level stars
  ctx.fillStyle = '#ffd93b';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1;

  for (let i = 0; i < lvl; i++) {
    ctx.beginPath();
    ctx.arc(x - (lvl - 1) * 4 + i * 8, y + 15, 2.9, 0, 7);
    ctx.fill();
    ctx.stroke();
  }
}
