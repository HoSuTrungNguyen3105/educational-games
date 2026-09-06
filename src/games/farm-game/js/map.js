// ---------------------------------------------------------
// map.js — draws the farm world onto the canvas
// ---------------------------------------------------------

function isCropPlot(x, y) {
  return CROP_PLOTS.find(p => p.x === x && p.y === y) || null;
}

function isPath(x, y) {
  return PATH_TILES.has(`${x},${y}`);
}

function isInsideBuilding(x, y, b) {
  return x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;
}

function isWalkable(x, y) {
  if (x < 0 || y < 0 || x >= MAP_COLS || y >= MAP_ROWS) return false;
  if (isInsideBuilding(x, y, BARN)) return false;
  if (isInsideBuilding(x, y, COOP)) return false;
  if (isInsideBuilding(x, y, POND)) return false;
  if (TREES.find(t => t.x === x && t.y === y)) return false;
  if (BUSHES.find(t => t.x === x && t.y === y)) return false;
  if (ROCKS.find(t => t.x === x && t.y === y)) return false;
  if (WELL.x === x && WELL.y === y) return false;
  if (SCARECROW.x === x && SCARECROW.y === y) return false;
  return true;
}

function drawGround(ctx) {
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const plot = isCropPlot(x, y);

      if (plot) {
        ctx.fillStyle = "#6d4c33";
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "#4a3220";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      } else if (isPath(x, y)) {
        ctx.fillStyle = "#d8b384";
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        if ((x + y) % 3 === 0) {
          ctx.fillStyle = "rgba(120,86,50,0.25)";
          ctx.beginPath();
          ctx.ellipse(px + TILE_SIZE * 0.5, py + TILE_SIZE * 0.55, 7, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = tileVariant(x, y) ? "#83c04a" : "#8fc94e";
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // little grass tufts + sparkle dots scattered across plain grass tiles
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      if (isCropPlot(x, y) || isPath(x, y)) continue;
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const seed = (x * 31 + y * 17) % 9;
      if (seed === 0) {
        ctx.strokeStyle = "rgba(48,90,30,0.45)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const bx = px + 10 + i * 8;
          ctx.beginPath();
          ctx.moveTo(bx, py + TILE_SIZE - 6);
          ctx.quadraticCurveTo(bx + 2, py + TILE_SIZE - 16, bx + (i - 1) * 3, py + TILE_SIZE - 22);
          ctx.stroke();
        }
      } else if (seed === 4) {
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE * 0.7, py + TILE_SIZE * 0.3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawCrops(ctx, progress, subject, now) {
  CROP_PLOTS.forEach(plot => {
    const px = plot.x * TILE_SIZE + TILE_SIZE / 2;
    const py = plot.y * TILE_SIZE + TILE_SIZE / 2;
    const key = `${subject}:${plot.vocabId}`;
    const known = progress && progress[key] && progress[key].known;

    if (known) {
      // fully grown crop with little leaf clusters + sparkle
      ctx.fillStyle = "#4c8c3a";
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(px + i * 12, py + 8, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = "26px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(plot.emoji, px, py - 6);

      const twinkle = 0.6 + 0.4 * Math.sin(now / 320 + plot.x + plot.y);
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.font = "14px serif";
      ctx.fillText("✨", px + 16, py - 20);
      ctx.restore();
    } else {
      // empty tilled soil waiting to be planted — small pulsing sprout
      ctx.strokeStyle = "rgba(74,50,32,0.6)";
      ctx.lineWidth = 1.5;
      for (let r = -1; r <= 1; r++) {
        ctx.beginPath();
        ctx.moveTo(px - 16, py + r * 6);
        ctx.lineTo(px + 16, py + r * 6);
        ctx.stroke();
      }
      const bob = Math.sin(now / 260 + plot.x * 1.3) * 2;
      ctx.font = "18px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillText("🌱", px, py - 4 + bob);
      ctx.restore();
    }
  });
}

function drawBuilding(ctx, b, roofColor, wallColor) {
  const px = b.x * TILE_SIZE;
  const py = b.y * TILE_SIZE;
  const w = b.w * TILE_SIZE;
  const h = b.h * TILE_SIZE;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px + w / 2, py + h + 4, w * 0.45, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = wallColor;
  ctx.fillRect(px, py + h * 0.4, w, h * 0.6);
  ctx.strokeStyle = "#40301d";
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py + h * 0.4, w, h * 0.6);

  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(px - 6, py + h * 0.45);
  ctx.lineTo(px + w / 2, py - h * 0.35);
  ctx.lineTo(px + w + 6, py + h * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fff6e2";
  const doorW = TILE_SIZE * 0.5;
  ctx.fillRect(px + w / 2 - doorW / 2, py + h - doorW * 0.9, doorW, doorW * 0.9);
  ctx.strokeRect(px + w / 2 - doorW / 2, py + h - doorW * 0.9, doorW, doorW * 0.9);
}

function drawTree(ctx, x, y) {
  const px = x * TILE_SIZE + TILE_SIZE / 2;
  const py = y * TILE_SIZE + TILE_SIZE / 2;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px, py + 16, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#7a5230";
  ctx.fillRect(px - 4, py, 8, 16);

  ctx.fillStyle = "#4c8c3a";
  ctx.beginPath();
  ctx.arc(px, py - 10, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5fa347";
  ctx.beginPath();
  ctx.arc(px - 8, py - 4, 12, 0, Math.PI * 2);
  ctx.arc(px + 8, py - 4, 12, 0, Math.PI * 2);
  ctx.fill();
}

function drawBush(ctx, x, y) {
  const px = x * TILE_SIZE + TILE_SIZE / 2;
  const py = y * TILE_SIZE + TILE_SIZE / 2 + 10;

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(px, py + 9, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4f8e3c";
  ctx.beginPath();
  ctx.arc(px - 9, py, 10, 0, Math.PI * 2);
  ctx.arc(px + 9, py, 10, 0, Math.PI * 2);
  ctx.arc(px, py - 7, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#69a851";
  ctx.beginPath();
  ctx.arc(px - 3, py - 10, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawRock(ctx, x, y) {
  const px = x * TILE_SIZE + TILE_SIZE / 2;
  const py = y * TILE_SIZE + TILE_SIZE / 2 + 8;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px, py + 9, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#9a9a92";
  ctx.beginPath();
  ctx.moveTo(px - 13, py + 6);
  ctx.lineTo(px - 8, py - 9);
  ctx.lineTo(px + 4, py - 12);
  ctx.lineTo(px + 13, py + 2);
  ctx.lineTo(px + 8, py + 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#77776e";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(px - 6, py - 6);
  ctx.lineTo(px, py - 9);
  ctx.lineTo(px - 2, py - 2);
  ctx.closePath();
  ctx.fill();
}

function drawFlower(ctx, x, y, emoji) {
  const px = x * TILE_SIZE + TILE_SIZE / 2;
  const py = y * TILE_SIZE + TILE_SIZE / 2;
  ctx.font = "20px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji || "🌼", px, py + 4);
}

function drawPond(ctx, p, now) {
  const px = p.x * TILE_SIZE;
  const py = p.y * TILE_SIZE;
  const w = p.w * TILE_SIZE;
  const h = p.h * TILE_SIZE;

  ctx.fillStyle = "#c9a877";
  ctx.beginPath();
  ctx.ellipse(px + w / 2, py + h / 2, w / 2 + 8, h / 2 + 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5aa7c9";
  ctx.beginPath();
  ctx.ellipse(px + w / 2, py + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3f83a3";
  ctx.lineWidth = 2;
  ctx.stroke();

  // shimmering highlight band that drifts over time
  const shimmerX = px + ((now / 900) % 1) * w;
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(shimmerX, py + h / 2, 10, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🪷", px + w * 0.28, py + h * 0.6);
  ctx.fillText("🐟", px + w * 0.68, py + h * 0.4 + Math.sin(now / 500) * 2);
}

function drawWell(ctx, w) {
  const px = w.x * TILE_SIZE + TILE_SIZE / 2;
  const py = w.y * TILE_SIZE + TILE_SIZE / 2;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px, py + 14, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8a5a34";
  ctx.fillRect(px - 12, py - 2, 4, 16);
  ctx.fillRect(px + 8, py - 2, 4, 16);
  ctx.fillStyle = "#6b4426";
  ctx.beginPath();
  ctx.moveTo(px - 16, py - 2);
  ctx.lineTo(px, py - 14);
  ctx.lineTo(px + 16, py - 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#a9a9a0";
  ctx.beginPath();
  ctx.ellipse(px, py + 6, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4f7c94";
  ctx.beginPath();
  ctx.ellipse(px, py + 5, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawScarecrow(ctx, s) {
  const px = s.x * TILE_SIZE + TILE_SIZE / 2;
  const py = s.y * TILE_SIZE + TILE_SIZE / 2;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px, py + 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#7a5230";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px - 14, py - 2);
  ctx.lineTo(px + 14, py - 2);
  ctx.moveTo(px, py + 16);
  ctx.lineTo(px, py - 16);
  ctx.stroke();

  ctx.font = "30px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🧥", px, py - 2);
  ctx.font = "20px serif";
  ctx.fillText("🎃", px, py - 18);
}

function drawAnimal(ctx, a, now) {
  const px = a.x * TILE_SIZE + TILE_SIZE / 2;
  const bob = Math.sin(now / 480 + a.x * 2 + a.y) * 2;
  const py = a.y * TILE_SIZE + TILE_SIZE / 2 + bob;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(a.x * TILE_SIZE + TILE_SIZE / 2, a.y * TILE_SIZE + TILE_SIZE / 2 + 12, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "22px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(a.emoji, px, py);
}

function drawFence(ctx) {
  ctx.strokeStyle = "#8a5a34";
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, MAP_COLS * TILE_SIZE - 4, MAP_ROWS * TILE_SIZE - 4);
  ctx.fillStyle = "#8a5a34";
  for (let x = 0; x < MAP_COLS * TILE_SIZE; x += TILE_SIZE) {
    ctx.fillRect(x, 0, 4, 8);
    ctx.fillRect(x, MAP_ROWS * TILE_SIZE - 8, 4, 8);
  }
}

// clouds drift slowly across the whole map, independent of the blueprint
function drawClouds(ctx, now) {
  const worldW = MAP_COLS * TILE_SIZE;
  const t = now / 1000;
  const clouds = [
    { baseY: 26, speed: 6, scale: 1.0, offset: 0 },
    { baseY: 62, speed: 4, scale: 0.75, offset: 0.4 },
    { baseY: 14, speed: 8, scale: 0.6, offset: 0.75 },
  ];
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#ffffff";
  clouds.forEach(c => {
    const cx = ((t * c.speed + c.offset * worldW) % (worldW + 160)) - 80;
    const cy = c.baseY;
    const s = c.scale;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 22 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 18 * s, cy - 6 * s, 16 * s, 10 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - 18 * s, cy - 4 * s, 15 * s, 9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawMap(ctx, progress, subject, now) {
  now = now || performance.now();
  drawGround(ctx);
  FLOWERS.forEach(f => drawFlower(ctx, f.x, f.y, f.emoji));
  drawCrops(ctx, progress, subject, now);
  drawPond(ctx, POND, now);
  drawWell(ctx, WELL);
  drawScarecrow(ctx, SCARECROW);
  drawBuilding(ctx, BARN, "#c1443a", "#e8dcc0");
  drawBuilding(ctx, COOP, "#9c332a", "#f5efe0");
  ROCKS.forEach(r => drawRock(ctx, r.x, r.y));
  BUSHES.forEach(b => drawBush(ctx, b.x, b.y));
  TREES.forEach(t => drawTree(ctx, t.x, t.y));
  ANIMALS.forEach(a => drawAnimal(ctx, a, now));
  drawFence(ctx);
  drawClouds(ctx, now);
}
