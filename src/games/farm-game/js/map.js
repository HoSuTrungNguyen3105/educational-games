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
  if (TREES.find(t => t.x === x && t.y === y)) return false;
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
      } else {
        ctx.fillStyle = tileVariant(x, y) ? "#83c04a" : "#8fc94e";
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      if (isCropPlot(x, y) || isPath(x, y)) continue;
      if ((x + y) % 4 === 0) {
        ctx.beginPath();
        ctx.arc(x * TILE_SIZE + TILE_SIZE * 0.7, y * TILE_SIZE + TILE_SIZE * 0.3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawCrops(ctx, progress, subject) {
  CROP_PLOTS.forEach(plot => {
    const px = plot.x * TILE_SIZE + TILE_SIZE / 2;
    const py = plot.y * TILE_SIZE + TILE_SIZE / 2;
    const key = `${subject}:${plot.vocabId}`;
    const known = progress && progress[key] && progress[key].known;

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

    if (known) {
      ctx.font = "14px serif";
      ctx.fillText("✨", px + 16, py - 20);
    }
  });
}

function drawBuilding(ctx, b, roofColor, wallColor) {
  const px = b.x * TILE_SIZE;
  const py = b.y * TILE_SIZE;
  const w = b.w * TILE_SIZE;
  const h = b.h * TILE_SIZE;

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

function drawAnimal(ctx, a) {
  const px = a.x * TILE_SIZE + TILE_SIZE / 2;
  const py = a.y * TILE_SIZE + TILE_SIZE / 2;
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

function drawMap(ctx, progress, subject) {
  drawGround(ctx);
  drawCrops(ctx, progress, subject);
  drawBuilding(ctx, BARN, "#c1443a", "#e8dcc0");
  drawBuilding(ctx, COOP, "#9c332a", "#f5efe0");
  TREES.forEach(t => drawTree(ctx, t.x, t.y));
  ANIMALS.forEach(a => drawAnimal(ctx, a));
  drawFence(ctx);
}
