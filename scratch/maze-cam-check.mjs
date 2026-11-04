// Harness camera sau lưng cho 2 file mê cung parkour (me-cung-thi.html, mecung-moi.html).
// Trích đúng camStep + heroBack trong file game, chạy trên mê cung 1 Ô RỘNG thật
// (genMaze kiểu DFS: cell tại toạ độ lẻ, hành lang rộng 1 ô, bán kính va chạm .22)
// và kiểm: mắt không chui vào tường, nhân vật luôn trước mắt + giữa màn hình,
// không có khung hình nhân vật biến mất khi vẫn còn nhìn thấy.
import fs from 'node:fs';

const file = process.argv[2] || 'src/games/parkour/me-cung-thi.html';
// mecung-moi bỏ qua alpha của sprite thường => nhân vật chỉ được vẽ khi còn khoảng lùi
const MODE = process.argv[3] === 'gate' ? 'gate' : 'fade';
const html = fs.readFileSync(file, 'utf8');
const script = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n;\n');
const lines = script.replace(/\r/g, '').split('\n');
const from = (start, end) => { const a = lines.findIndex(start); if (a < 0) return null; const b = lines.findIndex((l, i) => i > a && end(l)); if (b < 0) return null; return lines.slice(a, b + 1).join('\n'); };
const camTxt = from(l => /^const CAMD\s*=/.test(l.trim()), l => l.trim() === '}');
// heroBack + heroUp: cắt tới dòng "function heroSpr" (heroUp có thể dài nhiều dòng)
const i1 = lines.findIndex(l => /^function heroBack\s*\(/.test(l.trim()));
const i2 = lines.findIndex((l, i) => i > i1 && /^function heroSpr\s*\(/.test(l.trim()));
const heroTxt = i1 < 0 || i2 < 0 ? null : lines.slice(i1, i2).join('\n');
if (!camTxt || !heroTxt) throw new Error('không trích được camStep/heroBack từ ' + file);
const TY = /if\(ty<\.25\)return/.test(script) ? .25 : .2;   // ngưỡng bỏ vẽ sprite của chính file game
const HSC = +(script.match(/c:heroSpr\(\),sz:([\d.]+)\*camD\*camSc\/CAMD/) || [0, 0])[1];   // hệ số cao nhân vật
const GATE = +(script.match(/if\(camD\*camSc>=(\.?\d+)\)L\.push/) || [0, .35])[1];           // ngưỡng push (mecung-moi)
const FP = +(script.match(/const fp=camD\*camSc<(\.?\d+)/) || [0, .35])[1];                  // ngưỡng qu về góc 1 người
console.log(`file: ${file} · CAMD=${(camTxt.match(/const CAMD\s*=\s*([\d.]+)/) || [])[1]} · spr(): ty<${TY} · sz=${HSC} · gate=${GATE} · fp<${FP} · nhân vật:${MODE === 'gate' ? ' ẩn/hiện theo khoảng lùi' : ' mờ dần'}`);

const M = Math, TAU = M.PI * 2;
// ---- mê cung DFS 1 ô rộng, đúng kiểu genMaze của game ----
function maze(W) {
  const N = 2 * W + 1, map = new Uint8Array(N * N).fill(1), C = W * W;
  const adj = Array.from({ length: C }, () => []), vis = new Uint8Array(C), st = [0]; vis[0] = 1;
  let seed = 12345; const R = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  while (st.length) {
    const c = st[st.length - 1], cx = c % W, cy = (c / W) | 0, nb = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < W && !vis[ny * W + nx]) nb.push(ny * W + nx) }
    if (!nb.length) { st.pop(); continue }
    const d = nb[(R() * nb.length) | 0]; vis[d] = 1; adj[c].push(d); adj[d].push(c); st.push(d);
  }
  const tile = c => [2 * (c % W) + 1, 2 * ((c / W) | 0) + 1];
  for (let c = 0; c < C; c++) { const [x, y] = tile(c); map[y * N + x] = 0; for (const d of adj[c]) if (d > c) { const [x2, y2] = tile(d); map[((y + y2) / 2) * N + (x + x2) / 2] = 0 } }
  return { N, map, adj, W, tile };
}
const { N, map, adj, W, tile } = maze(12);                 // 25x25, giống cỡ mê cung nhỏ của game
const solid = (x, y) => x < 0 || y < 0 || x >= N || y >= N || map[(y | 0) * N + (x | 0)] > 0;
const aD = a => M.atan2(M.sin(a), M.cos(a));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const mv = (e, dx, dy, r) => { if (!hb(e.x + dx, e.y, r)) e.x += dx; if (!hb(e.x, e.y + dy, r)) e.y += dy };  // nguyên văn mv/hb của cả 2 file game
const hb = (x, y, r) => solid(x - r, y - r) || solid(x + r, y - r) || solid(x - r, y + r) || solid(x + r, y + r);
// ---- người chơi giả: đi theo một chuỗi ô của mê cung, quay mặt dần về ô kế tiếp ----
function walkPath(cells) {
  const pts = cells.map(c => ({ x: c[0] + .5, y: c[1] + .5 }));
  return (P, i) => {
    const t = pts[M.min(pts.length - 1, (i / 55) | 0)];
    const d = M.hypot(t.x - P.x, t.y - P.y);
    if (d > .12) { P.a += aD(M.atan2(t.y - P.y, t.x - P.x) - P.a) * .18; mv(P, M.cos(P.a) * .045, M.sin(P.a) * .045, .22); P.bt += .15 }
    else if ((i % 90) < 45) P.a += .05;                             // quay tại chỗ ở ngã ba
  };
}
const pathCells = (from, to) => {                                   // BFS trên đồ thị cell
  const q = [from], par = new Map([[from, -1]]);
  while (q.length) { const c = q.shift(); if (c === to) break; for (const d of adj[c]) if (!par.has(d)) { par.set(d, c); q.push(d) } }
  const out = []; for (let c = to; c !== -1; c = par.get(c)) out.push(tile(c));
  return out.reverse();
};
const mk = new Function('M', 'aD', 'solid', 'clamp', 'P', 'TAU',
  camTxt + '\nreturn {camStep, get camA(){return camA}, get camD(){return camD}, get camSc(){return camSc}, get camX(){return camX}, get camY(){return camY}, CAMD};');
const PL = .72;
// khung hình điện thoại 390x844, tính đúng theo rs() của từng file game
const cl2 = (v, a, b) => v < a ? a : v > b ? b : v, VW = 390, VH = 844;
const r1 = script.match(/RW=clamp\(M\.min\((\d+),W\),(\d+),(\d+)\);RH=clamp\(M\.round\(RW\*H\/W\),(\d+),(\d+)\)/);
const r2 = script.match(/RW=M\.min\((\d+),innerWidth\);RH=M\.round\(RW\*innerHeight\/innerWidth\)/);
let RW, RH;
if (r1) { RW = cl2(Math.min(+r1[1], VW), +r1[2], +r1[3]); RH = cl2(Math.round(RW * VH / VW), +r1[4], +r1[5]) }
else if (r2) { RW = Math.min(+r2[1], VW); RH = Math.round(RW * VH / VW) }
else { RW = 256; RH = 554 }
const f = (RW / 2) / PL;
console.log(`  cỡ khung render: ${RW}x${RH}`);

function run(label, move) {
  const start = tile(0);
  const P = { x: start[0] + .5, y: start[1] + .5, a: 0, bt: 0 };
  const c = mk(M, aD, solid, clamp, P, TAU);
  let badWall = 0, front = 0, maxLag = 0, minD = 9, maxD = 0, hero = [], skipAl = 0, hidden = 0, sc = {}, fp = 0;
  for (let i = 0; i < 1400; i++) {
    move(P, i);
    c.camStep(1 / 60);
    const ex = c.camX, ey = c.camY;
    if (solid(ex, ey)) badWall++;
    sc[c.camSc] = (sc[c.camSc] || 0) + 1;
    const bx = P.x - ex, by = P.y - ey, d = M.hypot(bx, by);
    if (bx * M.cos(P.a) + by * M.sin(P.a) < -.05) front++;          // camera vượt lên trước lưng
    minD = M.min(minD, d); maxD = M.max(maxD, d);
    maxLag = M.max(maxLag, M.abs(aD(P.a - c.camA)));
    const dx = M.cos(P.a), dy = M.sin(P.a), plx = -dy * PL, ply = dx * PL;
    const CAM = { x: ex, y: ey, dx, dy, px: plx, py: ply, inv: -1 / PL, f, hor: RH / 2 };
    const sx = P.x - CAM.x, sy = P.y - CAM.y;
    const tx = CAM.inv * (CAM.dy * sx - CAM.dx * sy), ty = CAM.inv * (-CAM.py * sx + CAM.px * sy);
    const near = c.camD * c.camSc;                                   // = ty thật của sprite nhân vật
    const al = MODE === 'gate' ? 1 : clamp((near - .18) / .4, 0, 1);
    const pushed = MODE === 'gate' ? near >= GATE : al > .02;         // game có push sprite không?
    if (near < FP) fp++;                                             // về góc nhìn thứ nhất (vẽ tay/đèn)
    if (pushed && ty < TY) hidden++;                                 // push rồi mà spr() bỏ vẽ => nhân vật nhảy biến
    if (pushed && ty >= TY && al > .25 && i % 100 === 0) {
      const sh = CAM.f / ty * (HSC * near / c.CAMD), scr = RW / 2 * (1 + tx / ty);
      const bot = CAM.hor + .5 * CAM.f / ty, top = bot - sh;
      hero.push({ h: +sh.toFixed(0), cx: +scr.toFixed(0), top: +top.toFixed(0), bot: +bot.toFixed(0), al: +al.toFixed(2) });
    }
  }
  const cx = hero.map(o => o.cx), hh = hero.map(o => o.h), tp = hero.map(o => o.top), bt = hero.map(o => o.bot);
  const off = hero.length ? M.max(...cx.map(v => M.abs(v - RW / 2))) : 0;
  const rng = a => a.length ? `${M.min(...a)}..${M.max(...a)}` : '—';
  const dist = Object.entries(sc).map(([k, v]) => `${(+k * 100) | 0}%:${(v / 14) | 0}%`).join(' ');
  console.log(`${label.padEnd(24)} tường:${badWall}  trước-lưng:${front}  MẤT NGƯỜI:${hidden}  lệch:${off.toFixed(0)}px  lag:${maxLag.toFixed(2)}rad  lùi:${minD.toFixed(2)}..${maxD.toFixed(2)}`);
  console.log(`  ${''.padEnd(24)} nhân vật: cao ${rng(hh)}px · cx ${rng(cx)} · dọc ${rng(tp)}→${rng(bt)}/${RH} · mờ ${rng(hero.map(o => o.al))}`);
  console.log(`  ${''.padEnd(24)} khoảng lùi còn dùng (camSc): ${dist} · về góc 1 người:${(fp / 14) | 0}%`);
  return badWall + front + hidden + (hero.length && off > RW * .18 ? 1 : 0);
}

let err = 0;
const p1 = pathCells(0, W * W - 1), p2 = pathCells(0, ((W / 2) | 0) * W + ((W / 2) | 0));
err += run('dọc mê cung (BFS)', walkPath(p1));
err += run('ra giữa mê cung', walkPath(p2));
err += run('quay tại chỗ', (P, i) => { P.a += .04 });
err += run('chạy vòng lùi lại', (P, i) => { if (i === 300) P.a += M.PI; mv(P, M.cos(P.a) * .05, M.sin(P.a) * .05, .22); P.bt += .15 });
err += run('lê sát tường', (P, i) => { P.a = .02 + M.sin(i * .01) * .9; mv(P, M.cos(P.a) * .05, M.sin(P.a) * .05, .22); P.bt += .15 });
err += run('đứng ở ngã tư', (P) => { const c0 = tile(W * W >> 1); P.x = c0[0] + .5; P.y = c0[1] + .5; P.a += .03 });

// ---- sprite hero: chạy heroBack thật bằng ctx giả ----
let ops = 0, nan = 0;
const xs = [], ys = [];
const chk = v => { if (!Number.isFinite(v)) nan++ };
const pt = (x, y) => { if (Number.isFinite(x) && Number.isFinite(y)) { xs.push(x); ys.push(y) } };
const rec = new Proxy({}, {
  get: (t, k) => {
    if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() { } });
    if (['fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'globalAlpha', 'font'].includes(k)) return '';
    return (...a) => {
      ops++; a.forEach(chk);
      if (k === 'moveTo' || k === 'lineTo') pt(a[0], a[1]);
      else if (k === 'ellipse') { pt(a[0] - a[2], a[1] - a[3]); pt(a[0] + a[2], a[1] + a[3]) }
      else if (k === 'arc') { pt(a[0] - a[2], a[1] - a[2]); pt(a[0] + a[2], a[1] + a[2]) }
      else if (k === 'fillRect' || k === 'strokeRect') { pt(a[0], a[1]); pt(a[0] + a[2], a[1] + a[3]) }
      else if (k === 'quadraticCurveTo') { pt(a[0], a[1]); pt(a[2], a[3]) }
    };
  },
  set: () => true,
});
const ell = (x, cx, cy, rx, ry, f2) => { chk(cx); chk(cy); chk(rx); chk(ry); x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, TAU); x.fill() };
const shd = x => ell(x, 64, 122, 36, 6, 'rgba(0,0,0,.28)');
const poly = (x, p, f2) => { x.fillStyle = f2; x.beginPath(); p.forEach((q, i) => { chk(q[0]); chk(q[1]); i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]) }); x.closePath(); x.fill() };
try {
  const heroBack = new Function('M', 'TAU', 'ell', 'shd', 'poly', heroTxt + '\nreturn heroBack;')(M, TAU, ell, shd, poly);
  // heroBack của mecung-moi nhận (x,ph,sl,fur,ear) -> quét hết các kiểu tai; file thi/me-cung-thi nhận (...,atk)
  const ears = /function heroBack\(x,ph,sl,fur,ear\)/.test(heroTxt);
  const calls = ears ? [0, 1, 2, 3, 4, 5, 6].map(e => [null, '#e08a3c', e]) : [0, 1];
  for (let i = 0; i < 8; i++) for (const c2 of calls) heroBack(rec, i / 8 * TAU, '#2f6fb3', ...(ears ? c2 : [c2[1], c2[2] || 0]));
  heroBack(rec, 0, '#2f6fb3', ...(ears ? [null, 0] : [1]));
  console.log(`heroBack: OK · ${(ops / (8 * calls.length + 1)) | 0} lệnh vẽ/khung · NaN=${nan}`);
  if (nan) err++;
  // nghệ thuật phải nằm trọn trong khung sprite (64x64 với bảng điểm ảnh, 128 với canvas thường)
  const SIZE = +(script.match(/const sp=\(fn,w=(\d+)/) || [0, 64])[1];   // sp() 128 (canvas thường) hoặc 64 (bảng điểm ảnh)
  const bb = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  const out = bb.x0 < -1 || bb.y0 < -1 || bb.x1 > SIZE + 1 || bb.y1 > SIZE + 1;
  console.log(`  khung nghệ thuật: x ${bb.x0.toFixed(1)}..${bb.x1.toFixed(1)} · y ${bb.y0.toFixed(1)}..${bb.y1.toFixed(1)} (sprite ${SIZE}x${SIZE})${out ? '  ==> TRÀN KHUNG' : '  vừa khung'}`);
  if (out) err++;
} catch (e) { console.log('heroBack LỖI:', e.message); err++ }
console.log(err === 0 ? '==> ĐẠT: không va tường, không sai phía, không mất nhân vật' : `==> CÓ ${err} lỗi`);
process.exit(err ? 1 : 0);
