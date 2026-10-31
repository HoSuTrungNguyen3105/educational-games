/* =====================================================
   render-terrain.js · draw the level terrain onto the static background
   (trees, rocks, water, fences, barns, plowed fields, flower bushes)
   ===================================================== */

/** Is tile (c,r) exactly type k — outside the map counts as an empty tile */
function kAt(c, r) {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS || !kinds) return '.';
  return kinds[c][r];
}

const isK = (c, r, k) => kAt(c, r) === k;

/** Visit every tile of type k */
function eachKind(k, fn) {
  if (!kinds) return;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (kinds[c][r] === k) fn(c, r);
    }
  }
}

/** Per-tile seeded random number — the background looks the same every redraw */
function cellRand(c, r, i) {
  const rand = seededRandom(c * 73856093 ^ r * 19349663 ^ (i || 0) * 83492791);
  return rand();
}

/* =====================================================
   WATER (ponds, river) — tiles merge into one rounded block with no seams
   ===================================================== */
function waterCellPath(path, c, r) {
  const x = c * CS - 2, y = r * CS - 2, s = CS + 4;

  if (path.roundRect) path.roundRect(x, y, s, s, 16);
  else path.rect(x, y, s, s);
}

function drawWater(g) {
  const path = new Path2D();
  let any = false;

  eachKind('w', (c, r) => {
    waterCellPath(path, c, r);
    any = true;
  });

  if (!any) return;

  // Sandy/earthen bank around the water
  g.lineJoin = 'round';
  g.strokeStyle = '#b79b62';
  g.lineWidth = 11;
  g.stroke(path);

  // Water surface: filled once for the whole block, so there are no seams between cells
  const grad = g.createLinearGradient(0, 0, CW * 0.3, CH);
  grad.addColorStop(0, PAL.water[0]);
  grad.addColorStop(1, PAL.water[1]);

  g.save();
  g.fillStyle = grad;
  g.fill(path);
  g.clip(path);

  // Bottom gets darker toward the lower edge, plus a shadow along the rim
  const deep = g.createLinearGradient(0, 0, 0, CH);
  deep.addColorStop(0, 'rgba(255,255,255,.25)');
  deep.addColorStop(1, 'rgba(10,60,90,.28)');
  g.fillStyle = deep;
  g.fillRect(0, 0, CW, CH);

  g.strokeStyle = 'rgba(12,60,90,.4)';
  g.lineWidth = 7;
  g.stroke(path);

  // Ripples and lily pads
  eachKind('w', (c, r) => {
    const x = c * CS, y = r * CS;

    if (cellRand(c, r, 1) < 0.6) {
      g.strokeStyle = 'rgba(255,255,255,.5)';
      g.lineWidth = 1.8;
      const sy = y + 8 + cellRand(c, r, 2) * 20;
      g.beginPath();
      g.moveTo(x + 6, sy);
      g.quadraticCurveTo(x + CS / 2, sy - 4, x + CS - 6, sy);
      g.stroke();
    }

    if (cellRand(c, r, 3) < 0.25) {
      g.fillStyle = '#4fae4a';
      g.beginPath();
      g.ellipse(x + CS * 0.5, y + CS * 0.55, 8, 5, 0.4, 0, 7);
      g.fill();

      g.fillStyle = '#ff9fc0';
      g.beginPath();
      g.arc(x + CS * 0.5, y + CS * 0.5, 2.6, 0, 7);
      g.fill();
    }
  });

  g.restore();

  // Reeds growing on the bank above the water block
  eachKind('w', (c, r) => {
    if (isK(c, r - 1, 'w') || cellRand(c, r, 4) > 0.5) return;

    const x = c * CS + 6 + cellRand(c, r, 5) * (CS - 12);
    const y = r * CS - 4;

    g.strokeStyle = '#3f8a3a';
    g.lineWidth = 1.8;
    for (let i = -1; i <= 1; i++) {
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + i * 4, y - 9, x + i * 7, y - 16);
      g.stroke();
    }
  });
}

/* =====================================================
   WOODEN BRIDGE ('j' tile: enemies walk over it, can't build)
   ===================================================== */
function drawBridges(g) {
  eachKind('j', (c, r) => {
    const x = c * CS, y = r * CS;

    g.fillStyle = '#8a5a3a';
    g.fillRect(x, y, CS, CS);

    g.fillStyle = '#b1854f';
    for (let i = 0; i < 4; i++) {
      g.fillRect(x + 2, y + 2 + i * 10, CS - 4, 7);
    }

    g.strokeStyle = 'rgba(28,27,58,.75)';
    g.lineWidth = 2;
    g.strokeRect(x + 0.5, y + 0.5, CS - 1, CS - 1);

    g.fillStyle = '#6a4428';
    g.fillRect(x - 3, y + 3, 5, CS - 6);
    g.fillRect(x + CS - 2, y + 3, 5, CS - 6);
  });
}

/* =====================================================
   PLOWED FIELD ('o') & FLOWER BUSH ('x') — pretty tiles that can still be built on
   ===================================================== */
function drawFields(g) {
  eachKind('o', (c, r) => {
    const x = c * CS, y = r * CS;

    g.fillStyle = PAL.soil[2];
    g.fillRect(x, y, CS, CS);

    g.fillStyle = 'rgba(90,60,25,.35)';
    for (let i = 0; i < 4; i++) g.fillRect(x, y + 3 + i * 10, CS, 4);

    // raised soil ridges
    g.fillStyle = 'rgba(255,235,190,.25)';
    for (let i = 0; i < 4; i++) g.fillRect(x, y + 2 + i * 10, CS, 1.4);
  });

  const cols = ['#ffffff', '#ffd93b', '#ff8fb3', '#b9a3ff'];

  eachKind('x', (c, r) => {
    for (let i = 0; i < 7; i++) {
      const x = c * CS + 5 + cellRand(c, r, 10 + i) * (CS - 10);
      const y = r * CS + 6 + cellRand(c, r, 40 + i) * (CS - 12);

      g.fillStyle = cols[(cellRand(c, r, 70 + i) * 4) | 0];
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        g.arc(x + Math.cos(k * 1.256) * 2.6, y + Math.sin(k * 1.256) * 2.6, 1.8, 0, 7);
        g.fill();
      }

      g.fillStyle = '#ffb300';
      g.beginPath();
      g.arc(x, y, 1.4, 0, 7);
      g.fill();
    }
  });
}

/* =====================================================
   ROCKS ('r') — clusters of 2-3 stones
   ===================================================== */
function drawRocks(g) {
  eachKind('r', (c, r) => {
    const cx = c * CS + CS / 2;
    const cy = r * CS + CS / 2;

    g.fillStyle = 'rgba(0,0,0,.22)';
    g.beginPath();
    g.ellipse(cx + 2, cy + 10, 17, 6, 0, 0, 7);
    g.fill();

    const n = 2 + ((cellRand(c, r, 1) * 2) | 0);

    for (let i = 0; i < n; i++) {
      const ox = (cellRand(c, r, 100 + i) - 0.5) * 20;
      const oy = (cellRand(c, r, 200 + i) - 0.5) * 12;
      const rx = 8 + cellRand(c, r, 300 + i) * 7;

      const gr = g.createLinearGradient(cx + ox, cy + oy - rx, cx + ox, cy + oy + rx);
      gr.addColorStop(0, '#d3d8cf');
      gr.addColorStop(1, '#8d938c');
      g.fillStyle = gr;

      g.beginPath();
      g.ellipse(cx + ox, cy + oy, rx, rx * 0.72, cellRand(c, r, 400 + i) * 3, 0, 7);
      g.fill();

      g.strokeStyle = 'rgba(28,27,58,.5)';
      g.lineWidth = 1.6;
      g.stroke();

      g.fillStyle = 'rgba(255,255,255,.4)';
      g.beginPath();
      g.ellipse(cx + ox - rx * 0.3, cy + oy - rx * 0.35, rx * 0.35, rx * 0.16, -0.5, 0, 7);
      g.fill();
    }

    // Moss at the base of the rocks
    if (cellRand(c, r, 2) < 0.6) {
      g.fillStyle = 'rgba(60,150,70,.5)';
      g.beginPath();
      g.ellipse(cx - 6, cy + 11, 7, 2.5, 0, 0, 7);
      g.fill();
    }
  });
}

/* =====================================================
   FENCE ('f') — wooden rails joining along horizontal/vertical runs
   ===================================================== */
function drawFences(g) {
  eachKind('f', (c, r) => {
    const x = c * CS, y = r * CS;
    const horiz = isK(c - 1, r, 'f') || isK(c + 1, r, 'f');
    const vert = isK(c, r - 1, 'f') || isK(c, r + 1, 'f');

    g.save();
    g.translate(x + CS / 2, y + CS / 2);
    if (!horiz && vert) g.rotate(Math.PI / 2);

    // drop shadow
    g.fillStyle = 'rgba(0,0,0,.2)';
    g.fillRect(-CS / 2 + 3, 6, CS - 6, 4);

    const wood = g.createLinearGradient(0, -12, 0, 8);
    wood.addColorStop(0, '#c99a5f');
    wood.addColorStop(1, '#8a5f31');
    g.fillStyle = wood;
    g.strokeStyle = 'rgba(28,27,58,.8)';
    g.lineWidth = 1.6;

    // 2 horizontal rails
    for (const oy of [-8, 1]) {
      g.beginPath();
      g.rect(-CS / 2 + 1, oy, CS - 2, 5);
      g.fill();
      g.stroke();
    }

    // fence posts
    for (const ox of [-CS / 2 + 3, CS / 2 - 8]) {
      g.beginPath();
      g.rect(ox, -13, 5, 20);
      g.fill();
      g.stroke();
    }

    g.restore();
  });
}

/* =====================================================
   HAYSTACK ('h')
   ===================================================== */
function drawHay(g) {
  eachKind('h', (c, r) => {
    const cx = c * CS + CS / 2;
    const cy = r * CS + CS / 2 + 3;

    g.fillStyle = 'rgba(0,0,0,.22)';
    g.beginPath();
    g.ellipse(cx + 2, cy + 9, 15, 5, 0, 0, 7);
    g.fill();

    const gr = g.createLinearGradient(cx, cy - 14, cx, cy + 10);
    gr.addColorStop(0, '#f2d98a');
    gr.addColorStop(1, '#c2a24a');
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(cx, cy, 14, 12, 0, 0, 7);
    g.fill();
    g.strokeStyle = 'rgba(28,27,58,.7)';
    g.lineWidth = 2;
    g.stroke();

    // straw strands & binding rope
    g.strokeStyle = 'rgba(150,115,40,.7)';
    g.lineWidth = 1.2;
    for (let i = -1; i <= 1; i++) {
      g.beginPath();
      g.ellipse(cx, cy + i * 5, 13, 4, 0, 3.3, 6.1);
      g.stroke();
    }

    g.strokeStyle = '#6a4a20';
    g.lineWidth = 2;
    g.beginPath();
    g.ellipse(cx, cy, 14, 12, 0, 0, 7);
    g.moveTo(cx - 5, cy - 11);
    g.lineTo(cx - 5, cy + 11);
    g.moveTo(cx + 5, cy - 11);
    g.lineTo(cx + 5, cy + 11);
    g.stroke();
  });
}

/* =====================================================
   BARN / HOUSE / WELL ('b') — style picked automatically from the block size
   ===================================================== */
function drawBuildings(g) {
  if (!kinds) return;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (kinds[c][r] !== 'b') continue;
      if (isK(c - 1, r, 'b') || isK(c, r - 1, 'b')) continue;   // not the top-left corner

      let w = 1;
      while (isK(c + w, r, 'b')) w++;

      let h = 1;
      let grow = true;
      while (grow && r + h < ROWS) {
        grow = true;
        for (let i = 0; i < w; i++) if (!isK(c + i, r + h, 'b')) grow = false;
        if (grow) h++;
      }

      drawBuilding(g, c * CS, r * CS, w * CS, h * CS, w * h);
    }
  }
}

function drawBuilding(g, x, y, w, h, area) {
  const ink = 'rgba(28,27,58,.85)';

  g.fillStyle = 'rgba(0,0,0,.24)';
  g.beginPath();
  g.ellipse(x + w / 2 + 4, y + h - 2, w * 0.62, h * 0.2, 0, 0, 7);
  g.fill();

  /* ----- Silo / well: small block ----- */
  if (area <= 2) {
    const cx = x + w / 2;
    const rx = w * 0.34;

    const gr = g.createLinearGradient(cx - rx, 0, cx + rx, 0);
    gr.addColorStop(0, '#9aa4b0');
    gr.addColorStop(0.45, '#e6ecf2');
    gr.addColorStop(1, '#8c96a2');
    g.fillStyle = gr;
    g.beginPath();
    g.rect(cx - rx, y + 10, rx * 2, h - 14);
    g.fill();
    g.strokeStyle = ink;
    g.lineWidth = 2.4;
    g.stroke();

    g.fillStyle = '#c0392b';
    g.beginPath();
    g.moveTo(cx - rx - 3, y + 11);
    g.lineTo(cx, y - 6);
    g.lineTo(cx + rx + 3, y + 11);
    g.closePath();
    g.fill();
    g.stroke();

    g.strokeStyle = 'rgba(28,27,58,.35)';
    g.lineWidth = 1.4;
    for (let i = 1; i < 4; i++) {
      g.beginPath();
      g.moveTo(cx - rx, y + 12 + i * (h - 16) / 4);
      g.lineTo(cx + rx, y + 12 + i * (h - 16) / 4);
      g.stroke();
    }
    return;
  }

  const roofH = Math.min(18, h * 0.4);
  const bodyY = y + roofH;
  const bodyH = h - roofH;

  /* ----- House body ----- */
  const wall = g.createLinearGradient(x, bodyY, x, bodyY + bodyH);

  const barn = w >= 3 * CS;
  if (barn) {
    wall.addColorStop(0, '#e8625a');
    wall.addColorStop(1, '#a8382f');
  } else {
    wall.addColorStop(0, '#f4ead2');
    wall.addColorStop(1, '#d9c9a6');
  }

  g.fillStyle = wall;
  g.beginPath();
  g.rect(x + 2, bodyY, w - 4, bodyH - 3);
  g.fill();
  g.strokeStyle = ink;
  g.lineWidth = 2.6;
  g.stroke();

  /* ----- Roof ----- */
  const roof = g.createLinearGradient(x, y, x, bodyY);
  roof.addColorStop(0, barn ? '#8a2b26' : '#b7623f');
  roof.addColorStop(1, barn ? '#c0463c' : '#8a452b');
  g.fillStyle = roof;
  g.beginPath();

  if (barn) {
    // gambrel roof (barn)
    const my = y + roofH * 0.35;
    g.moveTo(x - 3, bodyY);
    g.lineTo(x + 3, my);
    g.lineTo(x + w * 0.5, y - 2);
    g.lineTo(x + w - 3, my);
    g.lineTo(x + w + 3, bodyY);
  } else {
    g.moveTo(x - 4, bodyY);
    g.lineTo(x + w / 2, y - 3);
    g.lineTo(x + w + 4, bodyY);
  }

  g.closePath();
  g.fill();
  g.stroke();

  /* ----- Doors, windows, wood siding ----- */
  if (barn) {
    g.fillStyle = '#f6efdc';
    g.beginPath();
    g.rect(x + w * 0.5 - 9, bodyY + bodyH - 22, 18, 22);
    g.fill();
    g.stroke();

    g.strokeStyle = 'rgba(28,27,58,.5)';
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(x + w * 0.5 - 9, bodyY + bodyH - 14);
    g.lineTo(x + w * 0.5 + 9, bodyY + bodyH - 6);
    g.moveTo(x + w * 0.5 + 9, bodyY + bodyH - 14);
    g.lineTo(x + w * 0.5 - 9, bodyY + bodyH - 6);
    g.stroke();
  } else {
    g.fillStyle = '#6a4428';
    g.beginPath();
    g.rect(x + w * 0.5 - 6, bodyY + bodyH - 18, 12, 18);
    g.fill();
    g.strokeStyle = ink;
    g.lineWidth = 2;
    g.stroke();

    g.fillStyle = '#bfe8ff';
    for (const wx of [x + w * 0.22, x + w * 0.66]) {
      g.beginPath();
      g.rect(wx, bodyY + 6, 11, 11);
      g.fill();
      g.stroke();
    }
  }

  // vertical wood siding on the barn walls
  if (barn) {
    g.strokeStyle = 'rgba(0,0,0,.18)';
    g.lineWidth = 1.4;
    for (let vx = x + 8; vx < x + w - 6; vx += 8) {
      g.beginPath();
      g.moveTo(vx, bodyY + 2);
      g.lineTo(vx, bodyY + bodyH - 4);
      g.stroke();
    }
  }

  // chimney
  if (!barn && h >= 2 * CS) {
    g.fillStyle = '#8a452b';
    g.strokeStyle = ink;
    g.lineWidth = 2;
    g.beginPath();
    g.rect(x + w * 0.72, y - 8, 8, 16);
    g.fill();
    g.stroke();
  }
}

/* =====================================================
   TREES ('t')
   ===================================================== */
function drawMapTrees(g) {
  eachKind('t', (c, r) => {
    const x = c * CS + CS / 2 + (cellRand(c, r, 1) - 0.5) * 10;
    const y = r * CS + CS / 2 + (cellRand(c, r, 2) - 0.5) * 8;
    const s = 0.85 + cellRand(c, r, 3) * 0.4;

    if (cellRand(c, r, 4) < 0.22) {
      drawBush(g, x, y + 4, 9 + cellRand(c, r, 5) * 4);
    } else {
      drawTree(g, x, y - 2, s);
    }

    // fruit tree: add a few red apples
    if (cellRand(c, r, 6) < 0.35) {
      g.fillStyle = '#e0453a';
      for (let i = 0; i < 3; i++) {
        const a = cellRand(c, r, 60 + i) * 6.283;
        g.beginPath();
        g.arc(x + Math.cos(a) * 9 * s, y - 10 * s + Math.sin(a) * 7 * s, 2.2, 0, 7);
        g.fill();
      }
    }
  });
}

/** Draw the whole terrain of the current level onto the background canvas */
function drawTerrain(g) {
  if (!kinds) return;

  drawFields(g);
  drawWater(g);
  drawBridges(g);
  drawFences(g);
  drawRocks(g);
  drawHay(g);
  drawMapTrees(g);
  drawBuildings(g);
}
