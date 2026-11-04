// Harness kiểm tra HÌNH HỌC nhân vật vector của game parkour (không browser, không GPU).
// 1) Chạy đúng code rig trong file game bằng ctx giả có ma trận biến hình -> bbox, tiếp đất, NaN.
// 2) Dựng bbox của bản <svg> static trong menu bằng cùng hệ toạ độ -> đối chiếu hai bản vẽ.
import fs from 'node:fs';

const html = fs.readFileSync('src/games/parkour/parkour-tri-thuc/ParkourTriThuc.html', 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n;\n');
fs.writeFileSync('scratch/parkour-script-check.js', script);
const src = script.split('\n');
const from = src.findIndex(l => l.startsWith('const HERO_C={'));
const to = src.findIndex(l => l.startsWith('function drawParts(){'));
if (from < 0 || to < 0) throw new Error('không tìm thấy đoạn rig');
const rig = src.slice(from, to).join('\n');

// ---------- ctx giả: ma trận biến hình + ghi điểm đã biến hình ----------
function makeCtx() {
  const pts = [];
  let m = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  const stack = [];
  const mul = (n) => {
    m = {
      a: n.a * m.a + n.b * m.c, b: n.a * m.b + n.b * m.d,
      c: n.c * m.a + n.d * m.c, d: n.c * m.b + n.d * m.d,
      e: n.e * m.a + n.f * m.c + m.e, f: n.e * m.b + n.f * m.d + m.f,
    };
  };
  const put = (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) pts.push([NaN, NaN]);
    else pts.push([m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  };
  return {
    pts,
    ctx: {
      save() { stack.push({ ...m }); }, restore() { if (stack.length) m = stack.pop(); },
      translate(x, y) { mul({ a: 1, b: 0, c: 0, d: 1, e: x, f: y }); },
      scale(x, y) { mul({ a: x, b: 0, c: 0, d: y, e: 0, f: 0 }); },
      rotate(r) { const s = Math.sin(r), c = Math.cos(r); mul({ a: c, b: s, c: -s, d: c, e: 0, f: 0 }); },
      beginPath() {}, closePath() {}, moveTo: put, lineTo: put,
      quadraticCurveTo: (a1, b1, x, y) => { put(a1, b1); put(x, y); },
      bezierCurveTo: (...a) => { put(a[0], a[1]); put(a[2], a[3]); put(a[4], a[5]); },
      arcTo: (x1, y1, x2, y2) => { put(x1, y1); put(x2, y2); },
      arc(x, y, r) { put(x - r, y); put(x + r, y); put(x, y - r); put(x, y + r); },
      ellipse(x, y, rx, ry) { put(x - rx, y); put(x + rx, y); put(x, y - ry); put(x, y + ry); },
      rect(x, y, w, h) { put(x, y); put(x + w, y); put(x, y + h); put(x + w, y + h); },
      fill() {}, stroke() {}, fillText(t, x, y) { put(x, y); },
      lineCap: '', strokeStyle: '', fillStyle: '', lineWidth: 0, font: '', globalAlpha: 1,
    },
  };
}
class Path2DStub {
  constructor(d) {
    const n = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
    this.pts = [];
    for (let i = 0; i + 1 < n.length; i += 2) this.pts.push([n[i], n[i + 1]]);
  }
}
function rr(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const U = 1;
const G = { T: 0, cam: 0, hero: null, level: { segs: [], plats: [] }, parts: [] };
const HW = 22, HH = 44, GY = 500;
const $ = () => null;
let ctx;
const load = () => new Function(
  'ctx', 'rr', 'clamp', 'U', 'G', 'HW', 'HH', 'GY', '$', 'Path2D',
  rig + '\nreturn {drawHero, drawHeroRig};'
)(ctx, rr, clamp, U, G, HW, HH, GY, $, Path2DStub);

const box = (pts) => {
  const ok = pts.filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  const xs = ok.map(p => p[0]), ys = ok.map(p => p[1]);
  return { bad: pts.length - ok.length, n: ok.length, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
const fmt = (b, k = 2) => ['x0', 'x1', 'y0', 'y1'].map(p => +b[p].toFixed(k)).join(' / ');

// ---------- 1) các tư thế trong game ----------
const base = { x: 200, y: GY, vx: 0, vy: 0, grounded: true, jumps: 0, coyote: 0,
  anim: 0, face: 1, faceS: 1, sq: 0, dashT: 0, dashCD: 0, invuln: 0 };
const poses = [
  ['idle ph0       ', { ...base }],
  ['idle ph2       ', { ...base, anim: 2 }],
  ['chay ph0       ', { ...base, vx: 260 }],
  ['chay ph pi/2   ', { ...base, vx: 260, anim: Math.PI / 2 }],
  ['chay ph pi     ', { ...base, vx: 260, anim: Math.PI }],
  ['chay ph 3pi/2  ', { ...base, vx: 260, anim: 4.71 }],
  ['chay max       ', { ...base, vx: 300, anim: 1.2 }],
  ['dash vx720     ', { ...base, vx: 720, anim: 1.2, dashT: .2 }],
  ['bay len        ', { ...base, grounded: false, vy: -500, y: 420, vx: 200, anim: 1 }],
  ['roi            ', { ...base, grounded: false, vy: 900, y: 300, vx: -150, face: -1, faceS: -1 }],
  ['lat 0.1        ', { ...base, face: -1, faceS: .1, vx: 100 }],
  ['lat -0.05      ', { ...base, face: 1, faceS: -.05, vx: -100 }],
  ['squash .3      ', { ...base, sq: .3 }],
];
const rows = [];
for (const [label, h] of poses) {
  const c = makeCtx(); ctx = c.ctx; G.hero = h;
  load().drawHero();                                  // có shadow + lật + co giãn
  const dev = box(c.pts.filter(p => p[0] < h.x - 30 * 1 || true));
  const c2 = makeCtx(); ctx = c2.ctx; load().drawHeroRig(h);   // local: gốc = bàn chân
  const loc = box(c2.pts);
  // point thấp nhất của thân hình (không tính ellipse shadow vẽ ở GY)
  const body = c.pts.filter(p => Number.isFinite(p[1]) && p[1] <= h.y + 0.5);
  rows.push({
    pose: label, NaN: dev.bad,
    'rig rộng (đv)': +(loc.x1 - loc.x0).toFixed(1),
    'rig cao (đv)': +(loc.y1 - loc.y0).toFixed(1),
    'đế giày so sàn': +(loc.y1).toFixed(2),
    'đầu so sàn': +(loc.y0).toFixed(1),
    'trên màn hình': `${(dev.y0 - h.y).toFixed(1)}..${(Math.max(...body.map(p => p[1])) - h.y).toFixed(1)}`,
  });
}
console.table(rows);

// ---------- 2) bbox của bản SVG static, cùng hệ toạ độ bàn chân ----------
const svgM = html.match(/<svg viewBox="[^"]+"[\s\S]*?<\/svg>/);
const viewBox = svgM[0].match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const tf = (s) => {
  let m = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  for (const fn of s.matchAll(/(translate|rotate|scale)\(([^)]*)\)/g)) {
    const v = fn[2].split(/[\s,]+/).map(Number);
    let n;
    if (fn[1] === 'translate') n = { a: 1, b: 0, c: 0, d: 1, e: v[0] || 0, f: v[1] || 0 };
    else if (fn[1] === 'scale') n = { a: v[0], b: 0, c: 0, d: v[1] ?? v[0], e: 0, f: 0 };
    else {
      const a = v[0] * Math.PI / 180, s2 = Math.sin(a), c2 = Math.cos(a);
      n = { a: c2, b: s2, c: -s2, d: c2, e: 0, f: 0 };
      if (v.length === 3) n = { a: c2, b: s2, c: -s2, d: c2, e: v[1] - c2 * v[1] + s2 * v[2], f: v[2] - s2 * v[1] - c2 * v[2] };
    }
    m = { a: n.a * m.a + n.b * m.c, b: n.a * m.b + n.b * m.d, c: n.c * m.a + n.d * m.c,
      d: n.c * m.b + n.d * m.d, e: n.e * m.a + n.f * m.c + m.e, f: n.e * m.b + n.f * m.d + m.f };
  }
  return m;
};
const apply = (m, x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
function mulm(p, n) {
  return { a: n.a * p.a + n.b * p.c, b: n.a * p.b + n.b * p.d, c: n.c * p.a + n.d * p.c,
    d: n.c * p.b + n.d * p.d, e: n.e * p.a + n.f * p.c + p.e, f: n.e * p.b + n.f * p.d + p.f };
}
// Cung ellipse -> tâm + góc (đúng công thức chuyển endpoint-parameterisation của SVG),
// rồi lấy mẫu để bbox không tính thừa/thiếu đỉnh cung (mũ casquette là một cung).
function arcPts(p0, rx, ry, rotDeg, laf, sf, p1, out) {
  const phi = rotDeg * Math.PI / 180, co = Math.cos(phi), si = Math.sin(phi);
  const dx = (p0[0] - p1[0]) / 2, dy = (p0[1] - p1[1]) / 2;
  const x1p = co * dx + si * dy, y1p = -si * dx + co * dy;
  let r1 = Math.abs(rx), r2 = Math.abs(ry);
  const lam = (x1p * x1p) / (r1 * r1) + (y1p * y1p) / (r2 * r2);
  if (lam > 1) { const s = Math.sqrt(lam); r1 *= s; r2 *= s; }
  const num = r1 * r1 * r2 * r2 - r1 * r1 * y1p * y1p - r2 * r2 * x1p * x1p;
  const den = r1 * r1 * y1p * y1p + r2 * r2 * x1p * x1p;
  const cc = (laf !== sf ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = cc * (r1 * y1p) / r2, cyp = cc * -(r2 * x1p) / r1;
  const cx = co * cxp - si * cyp + (p0[0] + p1[0]) / 2;
  const cy = si * cxp + co * cyp + (p0[1] + p1[1]) / 2;
  const ang = (x, y) => Math.atan2((y - cy) / r2, (x - cx) / r1);
  const a0 = ang(p0[0], p0[1]); let a1 = ang(p1[0], p1[1]);
  let d = a1 - a0;
  if (sf === 1 && d < 0) d += 2 * Math.PI;
  if (sf === 0 && d > 0) d -= 2 * Math.PI;
  for (let i = 0; i <= 24; i++) {
    const a = a0 + (d * i) / 24;
    out.push([cx + r1 * Math.cos(a) * co - r2 * Math.sin(a) * si,
      cy + r1 * Math.cos(a) * si + r2 * Math.cos(a) * co]);
  }
}
const svgPts = [];
const stack = [{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }];
let cursor = null;                                  // to độ hiện tại trong path (cho cung)
for (const tag of svgM[0].matchAll(/<g\b([^>]*)>|<\/g>|<(path|rect|circle|ellipse)\b([^>]*?)>/g)) {
  if (tag[0] === '</g>') { stack.pop(); continue; }
  if (tag[1] !== undefined) {
    const t = tag[1].match(/transform="([^"]+)"/);
    stack.push(t ? mulm(stack.at(-1), tf(t[1])) : stack.at(-1));
    continue;
  }
  const name = tag[2], attrs = tag[3];
  const t = attrs.match(/transform="([^"]+)"/);
  const m = t ? mulm(stack.at(-1), tf(t[1])) : stack.at(-1);
  const num = (k) => { const v = attrs.match(new RegExp('(?:^|\\s)' + k + '="([^"]+)"')); return v ? +v[1] : 0; };
  if (name === 'rect') {
    const x = num('x'), y = num('y'), w = num('width'), h = num('height');
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([a, b]) => svgPts.push(apply(m, a, b)));
  } else if (name === 'circle') {
    const cx = num('cx'), cy = num('cy'), r = num('r');
    svgPts.push(apply(m, cx - r, cy), apply(m, cx + r, cy), apply(m, cx, cy - r), apply(m, cx, cy + r));
  } else if (name === 'ellipse') {
    const cx = num('cx'), cy = num('cy'), rx = num('rx'), ry = num('ry');
    for (let i = 0; i < 32; i++) { const a = i / 32 * 6.2832; svgPts.push(apply(m, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry)); }
  } else {
    const toks = attrs.match(/d="([^"]+)"/)[1].match(/[A-Za-z]|-?\d*\.?\d+/g);
    let i = 0, cmd = 'M';
    cursor = [0, 0];
    while (i < toks.length) {
      if (/[A-Za-z]/.test(toks[i])) cmd = toks[i++].toUpperCase();
      if (cmd === 'Z') continue;
      const take = { M: 2, L: 2, C: 6, Q: 4, A: 7 }[cmd];
      const v = toks.slice(i, i + take).map(Number); i += take;
      if (cmd === 'A') {
        const seg = [];
        arcPts(cursor, v[0], v[1], v[2], v[3], v[4], [v[5], v[6]], seg);
        seg.forEach(p => svgPts.push(apply(m, p[0], p[1])));
        cursor = [v[5], v[6]];
      } else {
        for (let k = 0; k < v.length; k += 2) svgPts.push(apply(m, v[k], v[k + 1]));
        cursor = [v[v.length - 2], v[v.length - 1]];
      }
      if (cmd === 'M') cmd = 'L';
    }
  }
}
const sb = box(svgPts);
console.log('stack svg còn lại (phải = 1):', stack.length);
const upper = box(svgPts.filter(p => p[1] <= -28 - 4.2 + 4));   // thân + đầu + tay (gốc đã trừ FOOT_LIFT)
console.log('SVG  bbox toàn bộ :', fmt(sb), ' điểm:', sb.n);
console.log('SVG  viewBox      :', viewBox.join(' '));
const inView = sb.x0 >= viewBox[0] - .1 && sb.x1 <= viewBox[0] + viewBox[2] + .1
  && sb.y0 >= viewBox[1] - .1 && sb.y1 <= viewBox[1] + viewBox[3] + .1;
console.log('SVG  vừa viewBox  :', inView ? 'OK' : 'TRÙNG — nới viewBox');
// so với canvas: cùng đo phần thân (y <= -24 local) của tư thế idle
const c3 = makeCtx(); ctx = c3.ctx; load().drawHeroRig({ ...base, anim: 0 });
const cu = box(c3.pts.filter(p => p[1] <= -24));
console.log('Canvas phần thân  :', fmt(cu));
console.log('SVG  phần thân    :', fmt(box(svgPts.filter(p => p[1] <= -24))));
