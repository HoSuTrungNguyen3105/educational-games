/* =====================================================
   utils.js · shared utility helpers
   ===================================================== */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = id => document.getElementById(id);

/** Distance from point (px,py) to the segment (x1,y1)-(x2,y2) */
function distSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;

  let u = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
  u = clamp(u, 0, 1);

  return Math.hypot(px - (x1 + u * dx), py - (y1 + u * dy));
}

/** Tile coordinates from pixel coordinates */
function cellOf(x, y) {
  return [
    clamp(Math.floor(x / CS), 0, COLS - 1),
    clamp(Math.floor(y / CS), 0, ROWS - 1)
  ];
}

/** Lighten a hex color, returns an rgb() string */
function lighten(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = v => Math.round(v + (255 - v) * a);
  return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
}

/** Darken a hex color, returns an rgb() string */
function darken(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = v => Math.round(v * (1 - a));
  return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
}

/** Seeded random numbers (so the background always looks the same) */
function seededRandom(seed) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}
