// ---------------------------------------------------------
// player.js — grid-based movement & drawing of the farmer
// ---------------------------------------------------------

const Player = {
  x: 6, y: 6,          // current tile
  fromX: 6, fromY: 6,  // tile moving from
  toX: 6, toY: 6,      // tile moving to
  recenter() {
    this.x = this.fromX = this.toX = PLAYER_START.x;
    this.y = this.fromY = this.toY = PLAYER_START.y;
    this.moving = false;
  },
  moving: false,
  moveStart: 0,
  moveDuration: 140,   // ms per tile
  dir: "down",         // down|up|left|right (for facing / prompt placement)
  emoji: "🧑‍🌾",

  tryMove(dx, dy) {
    if (this.moving) return;
    if (dx === 1) this.dir = "right";
    else if (dx === -1) this.dir = "left";
    else if (dy === 1) this.dir = "down";
    else if (dy === -1) this.dir = "up";

    const nx = this.x + dx;
    const ny = this.y + dy;
    if (!isWalkable(nx, ny)) return;

    this.fromX = this.x;
    this.fromY = this.y;
    this.toX = nx;
    this.toY = ny;
    this.moving = true;
    this.moveStart = performance.now();
  },

  update(now) {
    if (!this.moving) return;
    const t = Math.min(1, (now - this.moveStart) / this.moveDuration);
    if (t >= 1) {
      this.x = this.toX;
      this.y = this.toY;
      this.moving = false;
    }
  },

  // interpolated pixel position (tile-space, not yet * TILE_SIZE)
  getRenderPos(now) {
    if (!this.moving) return { x: this.x, y: this.y };
    const t = Math.min(1, (now - this.moveStart) / this.moveDuration);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    return {
      x: this.fromX + (this.toX - this.fromX) * ease,
      y: this.fromY + (this.toY - this.fromY) * ease,
    };
  },

  facingTile() {
    let dx = 0, dy = 0;
    if (this.dir === "down") dy = 1;
    else if (this.dir === "up") dy = -1;
    else if (this.dir === "left") dx = -1;
    else if (this.dir === "right") dx = 1;
    return { x: this.x + dx, y: this.y + dy };
  },

  draw(ctx, now) {
    const pos = this.getRenderPos(now);
    const px = pos.x * TILE_SIZE + TILE_SIZE / 2;
    const py = pos.y * TILE_SIZE + TILE_SIZE / 2;

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // bobbing while moving
    const bob = this.moving ? Math.sin(((now - this.moveStart) / this.moveDuration) * Math.PI) * 3 : 0;

    ctx.font = "32px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, px, py - bob);
  },
};
