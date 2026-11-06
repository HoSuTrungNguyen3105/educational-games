var e=`<!DOCTYPE html>\r
\r
<html lang="vi">\r
<head>\r
<meta charset="utf-8">\r
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\r
<title>Nông Trại Vui Vẻ</title>\r
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet">\r
<style>\r
:root{--purple:#8a2fb8;--purple-d:#4f1a75;--gold:#f4b942;--gold-d:#d99a16;--ink:#1d2e4a;--cream:#fffbf2;--safeb:env(safe-area-inset-bottom,0px);--safet:env(safe-area-inset-top,0px)}\r
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}\r
html,body{margin:0;height:100%;overflow:hidden;background:#8fd3f4;font-family:var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);touch-action:none;color:var(--ink)}\r
canvas{position:fixed;inset:0;width:100%;height:100%;display:block}\r
button{font-family:inherit;border:0;cursor:pointer;color:inherit}\r
\r
#hud{position:fixed;top:calc(var(–safet) + 12px);left:12px;right:12px;display:flex;align-items:center;gap:10px;pointer-events:none}\r
#lvl{position:relative;width:112px;height:34px;flex:none}\r
#lvl .star{position:absolute;left:-6px;top:-8px;font-size:44px;line-height:1;color:#ffc83a;-webkit-text-stroke:2px #c9780a;text-shadow:0 3px 0 #c9780a;z-index:2}\r
#lvl .bar{position:absolute;left:18px;right:0;top:3px;bottom:3px;background:var(--card,#fffbf2);border:3px solid var(--ink);border-radius:99px;overflow:hidden;display:flex;align-items:center;justify-content:center}\r
#lvl .bar i{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(#ffe27a,#f5a623);transition:width .3s}\r
#lvl .bar b{position:relative;color:var(--ink);font-weight:400;font-size:20px;text-shadow:none}\r
#cash{position:relative;flex:1;max-width:190px;height:36px;background:var(--card,#fffbf2);border:3px solid var(--ink);border-radius:99px;box-shadow:2px 2px 0 var(--ink);display:flex;align-items:center;justify-content:center;padding-left:26px}\r
#cash .bill{position:absolute;left:-8px;top:-8px;font-size:34px;line-height:1;filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}\r
#cash b{font-weight:400;font-size:22px;color:var(--tomato,#e4572e)}\r
.orb{pointer-events:auto;margin-left:auto;width:52px;height:52px;border-radius:50%;background:var(--lilac,#8b5cf6);border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);font-size:26px;color:#fff;line-height:1}\r
.side{position:fixed;left:10px;width:64px;height:68px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:30px;line-height:1}\r
.side em{font-style:normal;font-size:13px;letter-spacing:.2px}\r
#mapBtn{top:calc(var(–safet) + 128px);background:var(--lilac,#8b5cf6);border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);color:#fff}\r
#ffBtn{top:calc(var(–safet) + 128px);left:auto;right:10px;background:var(--sky,#4b9dff);border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);color:#fff}\r
#ffBtn.on{background:var(--sun,#f4b942);box-shadow:3px 3px 0 var(--ink)}\r
\r
#toast{position:fixed;left:50%;top:calc(var(–safet) + 74px);transform:translate(-50%,-14px);max-width:86vw;background:var(--ink);color:#fff;border:2px solid var(–gold);border-radius:14px;padding:9px 16px;font-size:17px;text-align:center;opacity:0;pointer-events:none;transition:.25s;z-index:30}\r
#toast.show{opacity:1;transform:translate(-50%,0)}\r
\r
#nav{position:fixed;left:0;right:0;bottom:0;height:calc(80px + var(–safeb));padding-bottom:var(–safeb);display:flex;background:var(--ink);border-top:4px solid var(--gold);z-index:20}\r
.tab{position:relative;flex:1;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-left:2px solid rgba(40,8,70,.35);color:#fff}\r
.tab:first-child{border-left:0}\r
.tab i{font-style:normal;width:46px;height:42px;border-radius:12px;background:var(--gold);border:3px solid var(--cream);display:flex;align-items:center;justify-content:center;font-size:25px;box-shadow:0 3px 0 rgba(0,0,0,.35);color:#000}\r
.tab em{font-style:normal;font-size:12px;text-shadow:0 2px 0 #3d0f5c}\r
.tab.active i{background:var(--ok,#22b573);box-shadow:0 3px 0 rgba(0,0,0,.35)}\r
.tab.big{flex:1.25}\r
.tab.big i{width:62px;height:58px;margin-top:-34px;font-size:38px;background:var(--lilac,#8b5cf6);border:4px solid var(--gold);box-shadow:0 4px 0 rgba(0,0,0,.35)}\r
.tab.big em{font-size:17px;color:var(--gold);text-shadow:0 2px 0 rgba(0,0,0,.45)}\r
.tab.big.active i{background:var(--ok,#22b573)}\r
.tab u{position:absolute;top:6px;right:calc(50% - 38px);min-width:22px;height:22px;border-radius:11px;background:var(--bad,#f0483e);border:2px solid var(--cream);color:#fff;font-size:13px;text-decoration:none;display:none;align-items:center;justify-content:center;padding:0 4px}\r
.tab u.show{display:flex}\r
\r
#sheet{position:fixed;left:8px;right:8px;bottom:calc(86px + var(–safeb));max-height:46vh;background:var(--cream);border:3px solid var(--ink);border-radius:22px;box-shadow:4px 4px 0 var(--ink);transform:translateY(130%);transition:transform .24s cubic-bezier(.2,.9,.3,1);display:flex;flex-direction:column;z-index:15;max-width:560px;margin:0 auto}\r
#sheet.open{transform:none}\r
#sheetHead{display:flex;align-items:center;justify-content:space-between;padding:10px 14px 6px;color:var(--ink)}\r
#sheetTitle{font-weight:400;font-size:22px;text-shadow:none}\r
#sheetClose{width:34px;height:34px;border-radius:50%;background:var(--tomato,#e4572e);color:#fff;font-size:17px;border:3px solid var(--ink);box-shadow:2px 2px 0 var(--ink)}\r
#sheetBody{overflow-y:auto;touch-action:pan-y;padding:4px 10px 12px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch}\r
.row{display:flex;align-items:center;gap:10px;background:var(–cream);border-radius:14px;padding:9px 10px;border-bottom:4px solid #d9bd86}\r
.row .ico{flex:none;width:46px;height:46px;border-radius:12px;background:#ffe3a0;display:flex;align-items:center;justify-content:center;font-size:28px}\r
.row .txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}\r
.row .txt b{font-weight:400;font-size:18px;line-height:1.15}\r
.row .txt span{font-size:13px;color:#5b6b8c;font-family:var(--body,"Be Vietnam Pro","Segoe UI",system-ui,sans-serif);font-weight:600;line-height:1.3}\r
.prog{height:9px;border-radius:5px;background:var(--line,#e6dcc4);overflow:hidden;margin-top:4px}\r
.prog i{display:block;height:100%;background:linear-gradient(#7cf06f,#2fb83a)}\r
.act{flex:none;min-width:92px;padding:7px 10px;border-radius:12px;background:var(--ok,#22b573);border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);color:#fff;font-size:17px;display:flex;flex-direction:column;align-items:center;line-height:1.1}\r
.act small{font-size:14px;color:#fff6b8}\r
.act.gold{background:var(--gold);color:var(--ink)}\r
.act.off{background:#e9e2d2;color:#5b6b8c;opacity:.9;box-shadow:none}\r
.act.off small{color:#5b6b8c}\r
.act.gold small{color:var(--ink)}\r
.map3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\r
.map3 button{aspect-ratio:1.15;border-radius:14px;background:var(–cream);border-bottom:4px solid #d9bd86;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:32px;gap:2px}\r
.map3 button span{font-size:13px;color:var(–ink)}\r
.map3 button.lock{opacity:.55}\r
.hint{color:#e8d6f5;font-size:14px;text-align:center;font-family:system-ui,sans-serif;font-weight:600;padding:2px 6px}\r
</style>\r
\r
</head>\r
<body>\r
<canvas id="cv"></canvas>\r
\r
<div id="hud">\r
  <div id="lvl"><span class="star">★</span><div class="bar"><i id="xp"></i><b id="lvnum">1</b></div></div>\r
  <div id="cash"><span class="bill">💵</span><b id="money">0</b></div>\r
  <button id="menuBtn" class="orb" aria-label="Menu">☰</button>\r
</div>\r
<button id="mapBtn" class="side"><span>🗺️</span><em>Bản đồ</em></button>\r
<button id="ffBtn" class="side"><span>⏩</span><em id="ffx">x1</em></button>\r
<div id="toast"></div>\r
\r
<div id="sheet">\r
  <div id="sheetHead"><b id="sheetTitle"></b><button id="sheetClose" aria-label="Đóng">✕</button></div>\r
  <div id="sheetBody"></div>\r
</div>\r
\r
<nav id="nav">\r
  <button class="tab" data-tab="shop"><i>🛒</i><em>Cửa hàng</em></button>\r
  <button class="tab big" data-tab="build"><i>🏠</i><em>Xây dựng</em></button>\r
  <button class="tab" data-tab="quest"><i>🎮</i><em>Nhiệm vụ</em><u id="bq"></u></button>\r
  <button class="tab" data-tab="stock"><i>📦</i><em>Kho hàng</em></button>\r
  <button class="tab" data-tab="team"><i>👥</i><em>Nông dân</em><u id="bt"></u></button>\r
</nav>\r
\r
<script>\r
'use strict';\r
/* ============================== Hằng số & tiện ích ============================== */\r
const TW = 100, TH = 50, GW = 16, GH = 18;\r
const LANE = [0.5, 5.5, 10.5, 15.5];\r
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));\r
const lerp = (a, b, t) => a + (b - a) * t;\r
const rnd = (a, b) => a + Math.random() * (b - a);\r
const fmt = n => { n = Math.floor(n); if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M'; return n.toLocaleString('en-US'); };\r
function P(x, y, z) { return [(x - y) * TW / 2, (x + y) * TH / 2 - (z || 0)]; }\r
\r
function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }\r
function mix(h1, h2, t) { const a = hex2rgb(h1), b = hex2rgb(h2); return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')'; }\r
function pal(h) { return { t: mix(h, '#ffffff', .12), l: mix(h, '#000000', .14), r: mix(h, '#000000', .3) }; }\r
\r
/* ============================== Dữ liệu ============================== */\r
const ZDEF = [\r
  { id: 'pond',    c: 0, r: 0, name: 'Ao cá',       icon: '🐟', item: '🐟', cost: 4500,  val: 40,  rate: .14, up: 2000, lz: 56 },\r
  { id: 'wheat',   c: 1, r: 0, name: 'Ruộng lúa mì', icon: '🌾', item: '🌾', cost: 0,     val: 5,   rate: .35, up: 60,   lz: 56 },\r
  { id: 'bee',     c: 2, r: 0, name: 'Vườn ong',    icon: '🍯', item: '🍯', cost: 30000, val: 130, rate: .08, up: 13000, lz: 56 },\r
  { id: 'coop',    c: 0, r: 1, name: 'Chuồng gà',   icon: '🐔', item: '🥚', cost: 0,     val: 9,   rate: .22, up: 140,  lz: 60 },\r
  { id: 'wh',      c: 1, r: 1, name: 'Nhà kho',     icon: '📦', kind: 'wh',     cost: 0, lz: 70 },\r
  { id: 'orchard', c: 2, r: 1, name: 'Vườn táo',    icon: '🍎', item: '🍎', cost: 400,   val: 14,  rate: .2,  up: 180,  lz: 104 },\r
  { id: 'pig',     c: 0, r: 2, name: 'Trại heo',    icon: '🐖', item: '🥓', cost: 12000, val: 70,  rate: .1,  up: 5400, lz: 56 },\r
  { id: 'cow',     c: 1, r: 2, name: 'Bãi bò sữa',  icon: '🐄', item: '🥛', cost: 1500,  val: 24,  rate: .16, up: 680,  lz: 56 },\r
  { id: 'market',  c: 2, r: 2, name: 'Chợ',         icon: '🏪', kind: 'market', cost: 0, lz: 76 },\r
];\r
const ZD = {}, ZGRID = [[], [], []];\r
ZDEF.forEach(d => { d.x0 = 1 + 5 * d.c; d.y0 = 1 + 5 * d.r; d.reserved = 0; ZD[d.id] = d; ZGRID[d.r][d.c] = d; });\r
const PRODUCERS = ZDEF.filter(d => !d.kind);\r
const MAXLV = 12;\r
\r
const SHIRTS = ['#e5483f', '#3b8be8', '#f2b632', '#43b86a', '#a15bd6', '#ee7aa8', '#2fb3b8', '#ef8a2e'];\r
const HATS = ['#d93a32', '#f3d36b', '#ffffff', '#3d6fd6', '#f3d36b', '#d93a32', '#ffffff', '#3d6fd6'];\r
\r
const QDEF = [\r
  { k: 'harv', t: 'Thu hoạch nông sản', unit: 'món', base: 20, mul: 2.4, rew: t => t * 4 },\r
  { k: 'sold', t: 'Bán hàng ở chợ',     unit: 'món', base: 15, mul: 2.5, rew: t => t * 8 },\r
  { k: 'earn', t: 'Kiếm tiền',          unit: '$',   base: 300, mul: 3,  rew: t => Math.round(t * .3) },\r
];\r
\r
/* ============================== Trạng thái ============================== */\r
const SAVE_KEY = 'nongtrai_v1';\r
function defaultState() {\r
  const zones = {};\r
  ZDEF.forEach(d => { zones[d.id] = { u: d.cost === 0, lv: 1, prog: 0, ready: 0 }; });\r
  return { money: 300, xp: 0, lv: 1, speed: 1, farmers: 2, upg: { speed: 1, carry: 1, wh: 1, market: 1 }, stock: {}, stats: { harv: 0, sold: 0, earn: 0 }, qt: { harv: 0, sold: 0, earn: 0 }, zones };\r
}\r
function loadState() {\r
  const s = defaultState();\r
  try {\r
    const raw = localStorage.getItem(SAVE_KEY);\r
    if (raw) {\r
      const j = JSON.parse(raw);\r
      ['money', 'xp', 'lv', 'speed', 'farmers'].forEach(k => { if (typeof j[k] === 'number') s[k] = j[k]; });\r
      Object.assign(s.upg, j.upg || {}); Object.assign(s.stats, j.stats || {}); Object.assign(s.qt, j.qt || {}); Object.assign(s.stock, j.stock || {});\r
      ZDEF.forEach(d => { if (j.zones && j.zones[d.id]) Object.assign(s.zones[d.id], j.zones[d.id]); });\r
    }\r
  } catch (e) {}\r
  return s;\r
}\r
let S = loadState();\r
function saveState() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }\r
\r
const capOf = z => 6 + 4 * z.lv;\r
const rateOf = (d, z) => d.rate * (1 + .4 * (z.lv - 1));\r
const upCost = (d, z) => Math.round(d.up * Math.pow(1.75, z.lv - 1));\r
const whCap = () => 40 + 30 * (S.upg.wh - 1);\r
const whCost = () => Math.round(80 * Math.pow(1.8, S.upg.wh - 1));\r
const mkMult = () => 1 + .12 * (S.upg.market - 1);\r
const mkCost = () => Math.round(120 * Math.pow(1.9, S.upg.market - 1));\r
const farmerSpeed = () => 2.0 + .3 * (S.upg.speed - 1);\r
const spdCost = () => Math.round(150 * Math.pow(2, S.upg.speed - 1));\r
const carryCap = () => 4 + 2 * S.upg.carry;\r
const carryCost = () => Math.round(100 * Math.pow(1.9, S.upg.carry - 1));\r
const hireCost = () => Math.round(120 * Math.pow(1.7, S.farmers - 2));\r
const totalStock = () => Object.values(S.stock).reduce((a, b) => a + b, 0);\r
const qTarget = q => Math.round(q.base * Math.pow(q.mul, S.qt[q.k]));\r
const xpNeed = () => Math.round(40 * Math.pow(S.lv, 1.7));\r
const claimable = () => QDEF.filter(q => S.stats[q.k] >= qTarget(q)).length;\r
\r
/* ============================== Canvas & camera ============================== */\r
const cv = document.getElementById('cv');\r
const ctx = cv.getContext('2d');\r
let W = 0, H = 0, DPR = 1;\r
function resize() {\r
  DPR = Math.min(window.devicePixelRatio || 1, 2.5);\r
  W = window.innerWidth; H = window.innerHeight;\r
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);\r
}\r
window.addEventListener('resize', resize); resize();\r
\r
const BOUNDS = { minX: -GH * TW / 2, maxX: GW * TW / 2, minY: 0, maxY: (GW + GH) * TH / 2 };\r
const cam = { x: 0, y: 380, z: window.innerWidth < 520 ? .62 : .85, tx: null, ty: null, tz: null };\r
function clampCam() {\r
  cam.z = clamp(cam.z, .38, 1.6);\r
  cam.x = clamp(cam.x, BOUNDS.minX + 260, BOUNDS.maxX - 260);\r
  cam.y = clamp(cam.y, 80, BOUNDS.maxY - 80);\r
}\r
const toScreen = (ix, iy) => [(ix - cam.x) * cam.z + W / 2, (iy - cam.y) * cam.z + H / 2];\r
function screenToTile(sx, sy) {\r
  const ix = (sx - W / 2) / cam.z + cam.x, iy = (sy - H / 2) / cam.z + cam.y;\r
  return [(ix / (TW / 2) + iy / (TH / 2)) / 2, (iy / (TH / 2) - ix / (TW / 2)) / 2];\r
}\r
function focusZone(id, zoom, sheetOpen) {\r
  const d = ZD[id]; const [ix, iy] = P(d.x0 + 2, d.y0 + 2, 20);\r
  cam.tz = zoom || Math.max(cam.z, .75);\r
  cam.tx = ix; cam.ty = iy + (sheetOpen ? (H * .17) / cam.tz : 0);\r
}\r
\r
/* ============================== Vẽ cơ bản ============================== */\r
function poly(pts, fill, stroke, lw) {\r
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);\r
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);\r
  ctx.closePath();\r
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }\r
  if (stroke) { ctx.lineWidth = lw || 1.5; ctx.strokeStyle = stroke; ctx.stroke(); }\r
}\r
function box(x, y, w, d, h, z, c) {\r
  z = z || 0;\r
  const a = P(x, y, z + h), b = P(x + w, y, z + h), cc = P(x + w, y + d, z + h), dd = P(x, y + d, z + h);\r
  const b0 = P(x + w, y, z), c0 = P(x + w, y + d, z), d0 = P(x, y + d, z);\r
  const o = 'rgba(35,12,55,.28)';\r
  poly([b, cc, c0, b0], c.r, o); poly([dd, cc, c0, d0], c.l, o); poly([a, b, cc, dd], c.t, o);\r
}\r
function ell(x, y, rx, ry, fill, stroke, lw) {\r
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);\r
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }\r
  if (stroke) { ctx.lineWidth = lw || 1.5; ctx.strokeStyle = stroke; ctx.stroke(); }\r
}\r
function rrect(x, y, w, h, r, fill, stroke, lw) {\r
  ctx.beginPath();\r
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);\r
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }\r
  if (stroke) { ctx.lineWidth = lw || 1.5; ctx.strokeStyle = stroke; ctx.stroke(); }\r
}\r
function line(x1, y1, x2, y2, col, w) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); }\r
const FONT = '"Lilita One","Arial Rounded MT Bold",system-ui,sans-serif';\r
\r
/* ============================== Nền đất ============================== */\r
function zoneAt(i, j) {\r
  if (i < 1 || j < 1 || i > 14 || j > 14) return null;\r
  if ((i - 1) % 5 > 3 || (j - 1) % 5 > 3) return null;\r
  return ZGRID[Math.floor((j - 1) / 5)][Math.floor((i - 1) / 5)];\r
}\r
function floorColor(d, i, j) {\r
  const k = (i + j) % 2;\r
  const lx = i - d.x0, ly = j - d.y0;\r
  switch (d.id) {\r
    case 'wh': return k ? '#8f8399' : '#988ca2';\r
    case 'wheat': return (j % 2) ? '#8b5b35' : '#7e512e';\r
    case 'coop': return k ? '#f0d17d' : '#e9c76c';\r
    case 'orchard': return k ? '#6cc050' : '#64b84a';\r
    case 'cow': return k ? '#90db67' : '#87d35e';\r
    case 'pig': return k ? '#b58257' : '#a9774c';\r
    case 'bee': return k ? '#a6e475' : '#9cdd6a';\r
    case 'pond': return (lx >= 1 && lx < 3 && ly >= 1 && ly < 3) ? null : (k ? '#f2dfa8' : '#ead79b');\r
    case 'market': return k ? '#ddb77d' : '#d3ad73';\r
  }\r
  return '#80d05a';\r
}\r
let TIME = 0;\r
function drawGround() {\r
  const t = 30;\r
  poly([P(GW, 0), P(GW, GH), P(GW, GH, -t), P(GW, 0, -t)], '#946239', 'rgba(35,12,55,.3)');\r
  poly([P(0, GH), P(GW, GH), P(GW, GH, -t), P(0, GH, -t)], '#b0794a', 'rgba(35,12,55,.3)');\r
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {\r
    const pts = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)];\r
    let col;\r
    if (j >= 16) col = '#4d4c58';\r
    else {\r
      const d = zoneAt(i, j);\r
      if (!d) col = (i + j) % 2 ? '#e7d6af' : '#dfcca4';\r
      else if (!S.zones[d.id].u) col = (i + j) % 2 ? '#b8e29c' : '#b0dc94';\r
      else {\r
        col = floorColor(d, i, j);\r
        if (col === null) { // nước ao\r
          const w = Math.sin(TIME * 1.6 + i * 1.3 + j * .9) * .5 + .5;\r
          col = mix('#43aee8', '#6cc9f5', w * .6);\r
          poly(pts, col, col, 1);\r
          const c = P(i + .5, j + .5);\r
          line(c[0] - 9 + w * 4, c[1], c[0] + 3 + w * 4, c[1], 'rgba(255,255,255,.55)', 2);\r
          continue;\r
        }\r
      }\r
    }\r
    poly(pts, col, col, 1);\r
    if (j >= 16 && i % 2 === 0 && j === 16) { // vạch kẻ đường\r
      line(...P(i + .2, 17), ...P(i + .8, 17), '#f5f2e8', 3);\r
    }\r
  }\r
  // viền đứt cho khu chưa mở\r
  ZDEF.forEach(d => {\r
    if (S.zones[d.id].u) return;\r
    ctx.setLineDash([12, 9]);\r
    poly([P(d.x0, d.y0), P(d.x0 + 4, d.y0), P(d.x0 + 4, d.y0 + 4), P(d.x0, d.y0 + 4)], null, 'rgba(255,255,255,.9)', 3);\r
    ctx.setLineDash([]);\r
  });\r
  // hoa ở vườn ong\r
  if (S.zones.bee.u) {\r
    const d = ZD.bee;\r
    for (let n = 0; n < 22; n++) {\r
      const fx = d.x0 + .3 + ((n * 37) % 100) / 100 * 3.4, fy = d.y0 + .3 + ((n * 61) % 100) / 100 * 3.4;\r
      const p = P(fx, fy); const cols = ['#ff6fa5', '#ffffff', '#ffd23f', '#c78bff'];\r
      ell(p[0], p[1], 3.2, 1.8, cols[n % 4]);\r
      ell(p[0], p[1] - 1.5, 1.4, 1.1, '#ffb400');\r
    }\r
  }\r
  // vòng tròn thuê nông dân trong kho (nhấn để thuê)\r
  if (S.zones.wh.u) {\r
    const d = ZD.wh;\r
    poly([P(d.x0 + .8, d.y0 + 1.5), P(d.x0 + 2.8, d.y0 + 1.5), P(d.x0 + 2.8, d.y0 + 3.3), P(d.x0 + .8, d.y0 + 3.3)], 'rgba(60,40,75,.55)');\r
    const c = P(d.x0 + 1.8, d.y0 + 2.4); const cx = c[0], cy = c[1];\r
    ell(cx, cy - 6, 15, 14, '#fff');\r
    ctx.beginPath(); ctx.arc(cx, cy - 9, 15, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();\r
    ctx.fillStyle = 'rgba(60,40,75,.55)'; ctx.fillRect(cx - 15, cy - 11, 30, 3);\r
    ell(cx - 17, cy - 5, 4, 5, '#fff'); ell(cx + 17, cy - 5, 4, 5, '#fff');\r
    const bob = Math.sin(TIME * 3) * 3;\r
    poly([[cx + 22, cy + 8 + bob], [cx + 34, cy + 8 + bob], [cx + 34, cy - 6 + bob], [cx + 40, cy - 6 + bob], [cx + 28, cy - 20 + bob], [cx + 16, cy - 6 + bob], [cx + 22, cy - 6 + bob]], '#fff');\r
  }\r
}\r
\r
/* ============================== Động vật ============================== */\r
const ANI = {\r
  coop: { kind: 'hen',  n: z => Math.min(7, 3 + z.lv),                  r: [.5, 1.9, 3.3, 3.4], sp: .6 },\r
  cow:  { kind: 'cow',  n: z => Math.min(5, 2 + Math.floor(z.lv / 3)),  r: [.6, 1.5, 3.3, 3.3], sp: .3 },\r
  pig:  { kind: 'pig',  n: z => Math.min(6, 3 + Math.floor(z.lv / 2)),  r: [.6, 1.6, 3.3, 3.2], sp: .45 },\r
  pond: { kind: 'fish', n: z => Math.min(6, 3 + Math.floor(z.lv / 2)),  r: [1.25, 1.25, 2.75, 2.75], sp: .6 },\r
  bee:  { kind: 'bee',  n: z => Math.min(10, 5 + z.lv),                 r: [.3, .3, 3.7, 3.7], sp: 1.6 },\r
};\r
const animals = {};\r
function pickTarget(a, d, r) { a.tx = d.x0 + rnd(r[0], r[2]); a.ty = d.y0 + rnd(r[1], r[3]); }\r
function syncAnimals() {\r
  for (const id in ANI) {\r
    const z = S.zones[id], d = ZD[id], cfg = ANI[id];\r
    const a = animals[id] || (animals[id] = []);\r
    if (!z.u) { a.length = 0; continue; }\r
    const want = cfg.n(z);\r
    while (a.length < want) { const o = { x: 0, y: 0, tx: 0, ty: 0, wait: rnd(0, 2), ph: rnd(0, 6), face: 1 }; pickTarget(o, d, cfg.r); o.x = o.tx; o.y = o.ty; a.push(o); }\r
    while (a.length > want) a.pop();\r
  }\r
}\r
function updateAnimals(dt) {\r
  for (const id in ANI) {\r
    const cfg = ANI[id], d = ZD[id], a = animals[id]; if (!a) continue;\r
    for (const o of a) {\r
      o.ph += dt * (cfg.kind === 'bee' ? 14 : 8);\r
      if (o.wait > 0) { o.wait -= dt; continue; }\r
      const dx = o.tx - o.x, dy = o.ty - o.y, dist = Math.hypot(dx, dy), st = cfg.sp * dt;\r
      if (dist <= st) { o.x = o.tx; o.y = o.ty; o.wait = rnd(.3, cfg.kind === 'bee' ? .6 : 3); pickTarget(o, d, cfg.r); }\r
      else { o.x += dx / dist * st; o.y += dy / dist * st; o.face = (dx - dy) >= 0 ? 1 : -1; }\r
    }\r
  }\r
}\r
function drawAnimal(kind, o) {\r
  const [sx, sy] = P(o.x, o.y); const f = o.face;\r
  const b = Math.abs(Math.sin(o.ph)) * 1.6;\r
  if (kind === 'hen') {\r
    ell(sx, sy, 7, 2.6, 'rgba(0,0,0,.2)');\r
    line(sx - 2, sy - 3, sx - 2, sy, '#f2a21c', 1.6); line(sx + 2, sy - 3, sx + 2, sy, '#f2a21c', 1.6);\r
    ell(sx - f * 7, sy - 11 - b, 3, 4, '#e9e9ef');\r
    ell(sx, sy - 8 - b, 7.5, 5.6, '#fff', 'rgba(35,12,55,.25)', 1);\r
    ell(sx + f * 5, sy - 14 - b, 3.6, 3.6, '#fff', 'rgba(35,12,55,.25)', 1);\r
    ell(sx + f * 5, sy - 18 - b, 1.7, 1.7, '#e63a30');\r
    poly([[sx + f * 8, sy - 15 - b], [sx + f * 11.5, sy - 14 - b], [sx + f * 8, sy - 13 - b]], '#f59a1b');\r
    ell(sx + f * 6, sy - 14.5 - b, .8, .8, '#222');\r
  } else if (kind === 'cow') {\r
    const w = Math.sin(o.ph) * 1.5;\r
    ell(sx, sy, 17, 5.5, 'rgba(0,0,0,.2)');\r
    [-10, -4, 5, 11].forEach((lx, i) => rrect(sx + lx - 1.6, sy - 10, 3.4, 10 + (i % 2 ? w : -w) * .4, 1, '#3a2a30'));\r
    rrect(sx - 15, sy - 24 - b * .3, 30, 15, 6, '#fff', 'rgba(35,12,55,.3)', 1);\r
    ell(sx - 5, sy - 19, 5.5, 4, '#2d2d35'); ell(sx + 8, sy - 15.5, 4, 3, '#2d2d35');\r
    line(sx - f * 15, sy - 21, sx - f * 19, sy - 14, '#2d2d35', 1.8);\r
    rrect(sx + f * 15 - 5.5, sy - 29, 11, 11, 4, '#fff', 'rgba(35,12,55,.3)', 1);\r
    ell(sx + f * 19.5, sy - 21.5, 4.6, 3.6, '#f7b6c4');\r
    ell(sx + f * 16, sy - 25, 1.1, 1.1, '#222');\r
    line(sx + f * 12, sy - 29, sx + f * 10, sy - 33, '#e8d9b0', 2);\r
    line(sx + f * 18, sy - 29, sx + f * 20, sy - 33, '#e8d9b0', 2);\r
  } else if (kind === 'pig') {\r
    ell(sx, sy, 13, 4.5, 'rgba(0,0,0,.2)');\r
    [-6, -2, 3, 7].forEach(lx => rrect(sx + lx - 1.5, sy - 6, 3, 6, 1, '#e58aa5'));\r
    ell(sx, sy - 10 - b * .5, 12, 8.5, '#ffb3c7', 'rgba(35,12,55,.25)', 1);\r
    ell(sx + f * 10.5, sy - 11 - b * .5, 6.5, 6.2, '#ffb3c7', 'rgba(35,12,55,.25)', 1);\r
    ell(sx + f * 16, sy - 10 - b * .5, 3.2, 2.8, '#ff8fab');\r
    poly([[sx + f * 8, sy - 16 - b * .5], [sx + f * 12, sy - 20 - b * .5], [sx + f * 12.5, sy - 15 - b * .5]], '#ff97b3');\r
    ell(sx + f * 11, sy - 13 - b * .5, .9, .9, '#222');\r
    ctx.beginPath(); ctx.arc(sx - f * 13, sy - 11, 2.6, 0, Math.PI * 1.6); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ff8fab'; ctx.stroke();\r
  } else if (kind === 'fish') {\r
    const w = Math.sin(o.ph) * 2;\r
    ell(sx, sy, 11 + Math.sin(TIME * 2 + o.ph) * 2, 4.5, null, 'rgba(255,255,255,.45)', 1.4);\r
    poly([[sx - f * 6, sy - 3], [sx - f * 12, sy - 7 + w], [sx - f * 12, sy + 1 + w]], '#ff8a2a');\r
    ell(sx, sy - 3, 7.5, 3.8, '#ff9d3c', 'rgba(35,12,55,.25)', 1);\r
    ell(sx + f * 4, sy - 4, 1, 1, '#222');\r
  } else if (kind === 'bee') {\r
    const hz = 18 + Math.sin(o.ph * .5) * 6;\r
    ell(sx, sy, 3, 1.3, 'rgba(0,0,0,.15)');\r
    const yy = sy - hz;\r
    ell(sx - 2, yy - 4, 3.5, 2, 'rgba(255,255,255,.8)'); ell(sx + 2, yy - 4, 3.5, 2, 'rgba(255,255,255,.8)');\r
    ell(sx, yy, 4.2, 3.2, '#ffd23f', 'rgba(35,12,55,.35)', 1);\r
    line(sx - 1, yy - 3, sx - 1, yy + 3, '#3a2a1a', 1.5); line(sx + 2, yy - 3, sx + 2, yy + 3, '#3a2a1a', 1.5);\r
  }\r
}\r
\r
/* ============================== Nông dân ============================== */\r
const farmers = [];\r
function insidePos(d) { return { x: d.x0 + 3.78, y: d.y0 + 3.78 }; }\r
function nodePos(d) { return { x: LANE[d.c + 1], y: LANE[d.r + 1] }; }\r
function newFarmer(i) {\r
  const w = ZD.wh;\r
  return { id: i, x: w.x0 + 3.2 + rnd(-.5, .2), y: w.y0 + 3.2 + rnd(-.5, .2), at: 'wh', state: 'idle', idle: rnd(0, .8), phases: [], path: [], cargo: null, work: 0,\r
    off: { x: rnd(-.2, .2), y: rnd(-.2, .2) }, ph: 0, face: 1, spd: rnd(.92, 1.08), shirt: SHIRTS[i % SHIRTS.length], hat: HATS[i % HATS.length], label: 'Đang nghỉ' };\r
}\r
function syncFarmers() { while (farmers.length < S.farmers) farmers.push(newFarmer(farmers.length)); farmers.length = S.farmers; }\r
function routePoints(f, to) {\r
  const A = ZD[f.at], B = ZD[to], pts = [];\r
  const o = f.off;\r
  if (f.at !== to) {\r
    const na = nodePos(A), nb = nodePos(B);\r
    pts.push({ x: na.x + o.x, y: na.y + o.y });\r
    if (Math.abs(nb.x - na.x) > .01) pts.push({ x: nb.x + o.x, y: na.y + o.y });\r
    if (Math.abs(nb.y - na.y) > .01) pts.push({ x: nb.x + o.x, y: nb.y + o.y });\r
  }\r
  const ip = insidePos(B);\r
  pts.push({ x: ip.x + o.x * .5, y: ip.y + o.y * .5 });\r
  return pts;\r
}\r
function startPhase(f) {\r
  const ph = f.phases[0];\r
  if (!ph) { f.state = 'idle'; f.idle = .25; f.label = 'Đang nghỉ'; return; }\r
  f.path = routePoints(f, ph.to); f.state = 'move'; f.label = ph.label;\r
}\r
let pendingIn = 0, reservedOut = 0;\r
const floaters = [];\r
function floater(ix, iy, text, col, big) { floaters.push({ ix, iy, text, col: col || '#fff', big: !!big, t: 0 }); }\r
function floatAt(zid, text, col, big) { const ip = insidePos(ZD[zid]); const p = P(ip.x, ip.y, 40); floater(p[0], p[1], text, col, big); }\r
function dist2zone(a, b) { const na = nodePos(ZD[a]), nb = nodePos(ZD[b]); return Math.abs(na.x - nb.x) + Math.abs(na.y - nb.y); }\r
\r
function chooseJob(f) {\r
  const cc = carryCap(), cap = whCap();\r
  const free = cap - totalStock() - pendingIn;\r
  const avail = totalStock() - reservedOut;\r
  const fill = totalStock() / cap;\r
  let best = null, bs = 0;\r
  for (const d of PRODUCERS) {\r
    const z = S.zones[d.id]; if (!z.u) continue;\r
    const a = Math.floor(z.ready) - d.reserved; if (a <= 0) continue;\r
    const sc = a * d.val / (1 + dist2zone(f.at, d.id) * .15);\r
    if (sc > bs) { bs = sc; best = d; }\r
  }\r
  const canH = best && free > 0, canS = avail > 0;\r
  if (canS && (fill > .65 || !canH)) return doSell(f, Math.min(cc, avail));\r
  if (canH) return doHarvest(f, best, Math.min(cc, Math.floor(S.zones[best.id].ready) - best.reserved, free));\r
  if (canS) return doSell(f, Math.min(cc, avail));\r
}\r
function doHarvest(f, d, n) {\r
  if (n <= 0) return;\r
  d.reserved += n; pendingIn += n;\r
  f.phases = [\r
    { to: d.id, label: 'Đi thu hoạch ' + d.item, act() {\r
        const z = S.zones[d.id]; const take = Math.min(n, Math.floor(z.ready));\r
        z.ready -= take; d.reserved -= n; f.cargo = { id: d.id, n: take };\r
        S.stats.harv += take; if (take > 0) floatAt(d.id, '+' + take + ' ' + d.item, '#fff6b8');\r
      } },\r
    { to: 'wh', label: 'Mang ' + d.item + ' về kho', act() {\r
        pendingIn -= n;\r
        if (f.cargo) { S.stock[f.cargo.id] = (S.stock[f.cargo.id] || 0) + f.cargo.n; f.cargo = null; }\r
      } },\r
  ];\r
  startPhase(f);\r
}\r
function doSell(f, n) {\r
  if (n <= 0) return;\r
  reservedOut += n;\r
  f.phases = [\r
    { to: 'wh', label: 'Lấy hàng trong kho', act() {\r
        reservedOut -= n; let need = n; const items = [];\r
        PRODUCERS.slice().sort((a, b) => b.val - a.val).forEach(d => {\r
          const have = S.stock[d.id] || 0, t = Math.min(need, have);\r
          if (t > 0) { S.stock[d.id] = have - t; items.push({ id: d.id, n: t }); need -= t; }\r
        });\r
        f.cargo = items.length ? { multi: items, id: items[0].id, n: n - need } : null;\r
      } },\r
    { to: 'market', label: 'Mang hàng ra chợ', act() {\r
        if (!f.cargo) return;\r
        let rev = 0, cnt = 0;\r
        f.cargo.multi.forEach(it => { rev += it.n * ZD[it.id].val; cnt += it.n; });\r
        const bonus = truck.state === 'park' ? 1.5 : 1;\r
        rev = Math.round(rev * mkMult() * bonus);\r
        S.money += rev; S.stats.sold += cnt; S.stats.earn += rev; addXp(cnt);\r
        floatAt('market', '+$' + fmt(rev), '#ffe45c', true);\r
        f.cargo = null;\r
      } },\r
  ];\r
  startPhase(f);\r
}\r
function updateFarmer(f, dt) {\r
  if (f.state === 'idle') {\r
    f.idle -= dt; f.ph *= .9;\r
    if (f.idle <= 0) { chooseJob(f); if (f.state === 'idle') f.idle = .4; }\r
  } else if (f.state === 'move') {\r
    const tg = f.path[0];\r
    const dx = tg.x - f.x, dy = tg.y - f.y, dist = Math.hypot(dx, dy), step = farmerSpeed() * f.spd * dt;\r
    f.ph += dt * 11;\r
    if (dist <= step) { f.x = tg.x; f.y = tg.y; f.path.shift(); if (!f.path.length) { f.state = 'work'; f.work = .45; } }\r
    else { f.x += dx / dist * step; f.y += dy / dist * step; f.face = (dx - dy) >= 0 ? 1 : -1; }\r
  } else if (f.state === 'work') {\r
    f.work -= dt; f.ph *= .9;\r
    if (f.work <= 0) { const ph = f.phases.shift(); f.at = ph.to; ph.act(); startPhase(f); }\r
  }\r
}\r
function drawFarmer(f) {\r
  const [sx, sy] = P(f.x, f.y); const fc = f.face;\r
  const moving = f.state === 'move';\r
  const bob = moving ? Math.abs(Math.sin(f.ph)) * 2.5 : 0;\r
  const sw = moving ? Math.sin(f.ph) * 3.5 : 0;\r
  ell(sx, sy, 10, 4.2, 'rgba(0,0,0,.24)');\r
  rrect(sx - 6 + sw, sy - 11, 5, 11, 2, '#3a4f8c'); rrect(sx + 1 - sw, sy - 11, 5, 11, 2, '#3a4f8c');\r
  rrect(sx - 8.5, sy - 26 - bob, 17, 17, 6, f.shirt, 'rgba(35,12,55,.3)', 1.2);\r
  rrect(sx - 3, sy - 22 - bob, 6, 12, 2, 'rgba(255,255,255,.35)');\r
  ell(sx - 9.5, sy - 18 - bob + sw * .3, 2.8, 4, '#f6cba0'); ell(sx + 9.5, sy - 18 - bob - sw * .3, 2.8, 4, '#f6cba0');\r
  ell(sx, sy - 34 - bob, 8.5, 8.5, '#f6cba0', 'rgba(35,12,55,.3)', 1.2);\r
  ctx.beginPath(); ctx.arc(sx, sy - 36 - bob, 9, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fillStyle = f.hat; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(35,12,55,.35)'; ctx.stroke();\r
  rrect(sx + (fc > 0 ? 2 : -12), sy - 38 - bob, 10, 3.2, 1.6, f.hat, 'rgba(35,12,55,.35)', 1);\r
  ell(sx + fc * 3.2, sy - 33 - bob, 1.1, 1.5, '#2a1a2e'); ell(sx - fc * 1.5, sy - 33 - bob, 1.1, 1.5, '#2a1a2e');\r
  if (f.cargo) {\r
    rrect(sx - 9, sy - 50 - bob, 18, 12, 2.5, '#c58b4a', 'rgba(35,12,55,.4)', 1.2);\r
    ctx.font = '13px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000';\r
    ctx.fillText(ZD[f.cargo.id].item, sx, sy - 44 - bob);\r
  }\r
}\r
\r
/* ============================== Xe tải ============================== */\r
const truck = { x: -4, state: 'away', t: 8 };\r
const PARK_X = 12.2;\r
function updateTruck(dt) {\r
  if (truck.state === 'away') { truck.t -= dt; if (truck.t <= 0) { truck.state = 'in'; truck.x = -2.6; } }\r
  else if (truck.state === 'in') { truck.x += 4.2 * dt; if (truck.x >= PARK_X) { truck.x = PARK_X; truck.state = 'park'; truck.t = 10; toast('🚚 Xe tải đến chợ! Giá bán x1.5 trong 10 giây'); } }\r
  else if (truck.state === 'park') { truck.t -= dt; if (truck.t <= 0) truck.state = 'out'; }\r
  else if (truck.state === 'out') { truck.x += 4.2 * dt; if (truck.x > 18.5) { truck.state = 'away'; truck.t = rnd(20, 30); } }\r
}\r
function drawTruck() {\r
  if (truck.state === 'away') return;\r
  const x = truck.x, y = 16.5;\r
  const al = clamp((x + .6) / 2.2, 0, 1) * clamp((16.4 - x) / 2.2, 0, 1);\r
  if (al <= 0) return;\r
  ctx.save(); ctx.globalAlpha = al;\r
  box(x, y, 1.6, .85, 24, 6, pal('#f1f1f6'));\r
  box(x + 1.6, y + .06, .75, .73, 15, 6, pal('#3d8ff0'));\r
  const wx = x + 2.35;\r
  poly([P(wx, y + .12, 17), P(wx, y + .73, 17), P(wx, y + .73, 11), P(wx, y + .12, 11)], '#bfe8ff', 'rgba(35,12,55,.3)', 1);\r
  const fyy = y + .85;\r
  poly([P(x + .1, fyy, 28), P(x + 1.5, fyy, 28), P(x + 1.5, fyy, 24), P(x + .1, fyy, 24)], '#e5483f');\r
  [.35, 1.25, 2.0].forEach(w => { const p = P(x + w, fyy - .02, 7); ell(p[0], p[1], 7.5, 7.5, '#2b2630'); ell(p[0], p[1], 3.2, 3.2, '#b9b4c4'); });\r
  ctx.restore();\r
}\r
\r
/* ============================== Vẽ khu vực ============================== */\r
const WOOD = pal('#b98046');\r
function addFence(objs, d) {\r
  const wh = d.id === 'wh', Hh = wh ? 36 : 13, T = wh ? .22 : .12;\r
  const c = wh ? { t: '#6ef0f7', l: '#22b4bf', r: '#17939e' } : { t: '#7be8ee', l: '#2bb8c2', r: '#1e98a3' };\r
  for (let k = 0; k < 4; k++) {\r
    objs.push({ d: d.x0 + T / 2 + d.y0 + k + .5, f: () => box(d.x0, d.y0 + k, T, 1, Hh, 0, c) });\r
    if (k === 0) objs.push({ d: d.x0 + d.y0 + .6, f: () => box(d.x0 + T, d.y0, 1 - T, T, Hh, 0, c) });\r
    else objs.push({ d: d.x0 + k + .5 + d.y0 + T / 2, f: () => box(d.x0 + k, d.y0, 1, T, Hh, 0, c) });\r
  }\r
}\r
function addCrate(objs, d, z) {\r
  objs.push({ d: d.x0 + d.y0 + 6.7, f: () => {\r
    box(d.x0 + 3.05, d.y0 + 3.05, .5, .5, 12, 0, WOOD);\r
    const p = P(d.x0 + 3.3, d.y0 + 3.3, 12);\r
    if (z.ready >= 1) {\r
      ctx.font = '17px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000';\r
      ctx.fillText(d.item, p[0], p[1] - 8 - Math.sin(TIME * 4) * 1.5);\r
      ell(p[0] + 12, p[1] - 18, 9, 9, '#fff', '#3a1750', 1.6);\r
      ctx.font = '12px ' + FONT; ctx.fillStyle = '#3a1750'; ctx.fillText(Math.floor(z.ready), p[0] + 12, p[1] - 17.5);\r
    }\r
  } });\r
}\r
function buildWorld() {\r
  const objs = [];\r
  ZDEF.forEach(d => {\r
    const z = S.zones[d.id]; if (!z.u) return;\r
    addFence(objs, d);\r
    const x0 = d.x0, y0 = d.y0;\r
    if (d.id === 'wh') {\r
      for (let s = 0; s < 2; s++) {\r
        const sx = x0 + .5 + s * 1.3, sy = y0 + .35;\r
        objs.push({ d: sx + y0 + .6 + 0.5, f: () => {\r
          const slots = 18, filled = Math.round(slots * totalStock() / whCap());\r
          const post = pal('#3b5a9d');\r
          box(sx, sy, .06, .06, 50, 0, post); box(sx + 1.0, sy, .06, .06, 50, 0, post);\r
          for (let L = 0; L < 3; L++) {\r
            const zz = 4 + L * 15;\r
            box(sx, sy, 1.06, .5, 2, zz - 2, pal('#9aa4b8'));\r
            for (let k = 0; k < 3; k++) {\r
              const idx = s * 9 + L * 3 + k;\r
              if (idx < filled) {\r
                box(sx + .08 + k * .32, sy + .08, .27, .36, 10, zz, pal('#f5c63c'));\r
                const a = P(sx + .08 + k * .32, sy + .08, zz + 10), b = P(sx + .35 + k * .32, sy + .08, zz + 10);\r
                line(a[0], a[1], b[0], b[1], '#c98e10', 1.5);\r
              }\r
            }\r
          }\r
          box(sx, sy + .5, .06, .06, 50, 0, post); box(sx + 1.0, sy + .5, .06, .06, 50, 0, post);\r
        } });\r
      }\r
    }\r
    if (d.id === 'wheat') {\r
      const n = (z.ready + z.prog) / capOf(z) * 15; let k = 0;\r
      for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {\r
        if (i === 3 && j === 3) continue;\r
        const g = clamp(n - k, 0, 1); k++;\r
        objs.push({ d: x0 + i + y0 + j + 1, f: () => {\r
          const c = P(x0 + i + .5, y0 + j + .5);\r
          const col = mix('#58b836', '#f4c430', g), hh = 5 + g * 17;\r
          for (let s = 0; s < 5; s++) {\r
            const dx = (s - 2) * 7, dy = ((s % 2) ? 4 : -3);\r
            line(c[0] + dx, c[1] + dy, c[0] + dx, c[1] + dy - hh, col, 2.4);\r
            if (g > .55) ell(c[0] + dx, c[1] + dy - hh - 2, 2.2, 4, '#f7d44a');\r
          }\r
        } });\r
      }\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'coop') {\r
      objs.push({ d: x0 + y0 + 2.4, f: () => {\r
        box(x0 + .4, y0 + .35, 1.7, 1.2, 22, 0, pal('#e5483f'));\r
        const yF = y0 + 1.55;\r
        poly([P(x0 + .9, yF, 0), P(x0 + 1.4, yF, 0), P(x0 + 1.4, yF, 14), P(x0 + .9, yF, 14)], '#4b2a1e');\r
        box(x0 + .3, y0 + .25, 1.9, 1.4, 7, 22, pal('#8a3b2a'));\r
      } });\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'orchard') {\r
      const T = [[.9, .9], [2.5, .9], [.9, 2.5], [2.4, 2.4]];\r
      const apples = Math.round(32 * z.ready / capOf(z));\r
      const AP = [[-18, -2], [-8, -12], [8, -14], [18, -4], [-4, 4], [10, 6], [-14, 8], [2, -4]];\r
      T.forEach((t, ti) => {\r
        objs.push({ d: x0 + t[0] + y0 + t[1] + .2, f: () => {\r
          box(x0 + t[0] - .1, y0 + t[1] - .1, .2, .2, 24, 0, pal('#8a5a34'));\r
          const c = P(x0 + t[0], y0 + t[1], 44);\r
          ell(c[0] + 3, c[1] + 6, 31, 22, '#3f9a3d'); ell(c[0] - 3, c[1], 29, 22, '#58b848', 'rgba(35,12,55,.25)', 1.2); ell(c[0] - 8, c[1] - 6, 14, 9, '#73cc5e');\r
          const nA = clamp(apples - ti * 8, 0, 8);\r
          for (let a = 0; a < nA; a++) { ell(c[0] + AP[a][0], c[1] + AP[a][1], 4.4, 4.4, '#e8332e', 'rgba(90,10,10,.5)', 1); ell(c[0] + AP[a][0] - 1.3, c[1] + AP[a][1] - 1.4, 1.2, 1.2, '#ff9a96'); }\r
        } });\r
      });\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'cow') {\r
      objs.push({ d: x0 + y0 + 2.2, f: () => {\r
        box(x0 + .4, y0 + .3, 1.5, 1.0, 20, 0, pal('#f2efe6'));\r
        box(x0 + .3, y0 + .2, 1.7, 1.2, 7, 20, pal('#c9423a'));\r
        const yF = y0 + 1.3; poly([P(x0 + .9, yF, 0), P(x0 + 1.4, yF, 0), P(x0 + 1.4, yF, 13), P(x0 + .9, yF, 13)], '#6a3a2a');\r
      } });\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'pig') {\r
      objs.push({ d: x0 + y0 + 2, f: () => {\r
        box(x0 + .4, y0 + .4, 1.3, 1.0, 16, 0, pal('#e0906c'));\r
        box(x0 + .3, y0 + .3, 1.5, 1.2, 6, 16, pal('#8b4a3a'));\r
        const yF = y0 + 1.4; poly([P(x0 + .8, yF, 0), P(x0 + 1.2, yF, 0), P(x0 + 1.2, yF, 11), P(x0 + .8, yF, 11)], '#4a2a20');\r
      } });\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'bee') {\r
      [[.6, .6], [1.9, .8], [1.0, 2.0]].forEach((h, hi) => {\r
        objs.push({ d: x0 + h[0] + y0 + h[1] + .6, f: () => {\r
          box(x0 + h[0], y0 + h[1], .6, .6, 8, 0, pal('#ffd23f')); box(x0 + h[0] + .03, y0 + h[1] + .03, .54, .54, 8, 8, pal('#f5b81a')); box(x0 + h[0] - .04, y0 + h[1] - .04, .68, .68, 3, 16, pal('#fff3b0'));\r
        } });\r
      });\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'pond') {\r
      objs.push({ d: x0 + y0 + 4, f: () => { box(x0 + 2.6, y0 + 1.2, .95, .5, 4, 2, pal('#b98046')); box(x0 + 3.4, y0 + 1.1, .12, .12, 16, 0, WOOD); } });\r
      addCrate(objs, d, z);\r
    }\r
    if (d.id === 'market') {\r
      objs.push({ d: x0 + y0 + 3.6, f: () => {\r
        const cx = x0 + .8, cy = y0 + 1.5;\r
        box(cx, cy - .1, .08, .08, 36, 0, WOOD); box(cx + 2.35, cy - .1, .08, .08, 36, 0, WOOD);\r
        box(cx, cy, 2.43, .8, 14, 0, pal('#9b6a3a'));\r
        const GC = ['#e8332e', '#f5c63c', '#7bd85a', '#ff8a2a', '#c78bff', '#ffffff'];\r
        GC.forEach((g, i) => box(cx + .15 + i * .38, cy + .2, .26, .4, 8, 14, pal(g)));\r
        box(cx, cy + .88, .08, .08, 36, 0, WOOD); box(cx + 2.35, cy + .88, .08, .08, 36, 0, WOOD);\r
        for (let s = 0; s < 8; s++) box(cx - .1 + s * .33, cy - .2, .33, 1.3, 5, 36, pal(s % 2 ? '#ffffff' : '#e8453c'));\r
      } });\r
    }\r
    if (d.id !== 'wh' && d.id !== 'market' && d.id !== 'wheat' && d.id !== 'orchard') { /* crate đã thêm ở trên */ }\r
  });\r
  // động vật\r
  for (const id in ANI) {\r
    const a = animals[id]; if (!a) continue;\r
    a.forEach(o => objs.push({ d: o.x + o.y + (ANI[id].kind === 'fish' ? -50 : (ANI[id].kind === 'bee' ? 2 : 0)), f: () => drawAnimal(ANI[id].kind, o) }));\r
  }\r
  farmers.forEach(f => objs.push({ d: f.x + f.y + .05, f: () => drawFarmer(f) }));\r
  if (truck.state !== 'away') objs.push({ d: truck.x + 1.2 + 16.9, f: drawTruck });\r
  objs.sort((a, b) => a.d - b.d);\r
  return objs;\r
}\r
\r
/* ============================== Nhãn, hiệu ứng ============================== */\r
const labelHits = [];\r
function drawLabels() {\r
  labelHits.length = 0;\r
  const sc = clamp(cam.z * 1.15, .78, 1.15);\r
  ZDEF.forEach(d => {\r
    const z = S.zones[d.id];\r
    const [ix, iy] = P(d.x0 + 2, d.y0 + 2, d.lz);\r
    const [sx, sy] = toScreen(ix, iy);\r
    if (sx < -100 || sx > W + 100 || sy < -60 || sy > H + 60) return;\r
    ctx.save(); ctx.translate(sx, sy); ctx.scale(sc, sc);\r
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
    if (!z.u) {\r
      const can = S.money >= d.cost;\r
      rrect(-56, -22, 112, 44, 14, 'rgba(58,23,80,.93)', can ? '#7dff3a' : '#c9b2dc', 3);\r
      ctx.font = '14px ' + FONT; ctx.fillStyle = '#fff'; ctx.fillText('🔒 ' + d.name, 0, -8);\r
      ctx.font = '17px ' + FONT; ctx.fillStyle = can ? '#7dff3a' : '#ffd24d'; ctx.fillText('$' + fmt(d.cost), 0, 10);\r
    } else {\r
      ctx.font = '22px ' + FONT; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1b4d1b'; ctx.fillStyle = '#7dff3a';\r
      const txt = 'LV.' + (d.id === 'wh' ? S.upg.wh : d.id === 'market' ? S.upg.market : z.lv);\r
      ctx.strokeText(txt, 10, -4); ctx.fillText(txt, 10, -4);\r
      ctx.font = '20px serif'; ctx.fillStyle = '#000'; ctx.fillText(d.icon, -36, -4);\r
      let fr = 0, show = true;\r
      if (d.id === 'wh') fr = totalStock() / whCap(); else if (d.kind === 'market') show = false; else fr = z.ready / capOf(z);\r
      if (show) {\r
        rrect(-36, 8, 72, 9, 4.5, 'rgba(60,40,75,.85)');\r
        if (fr > 0) rrect(-36, 8, Math.max(9, 72 * clamp(fr, 0, 1)), 9, 4.5, fr >= 1 ? '#ff7b3a' : '#7dff3a');\r
      }\r
      if (d.id === 'market' && truck.state === 'park') {\r
        rrect(-52, 8, 104, 24, 12, '#ffd24d', '#a45f00', 2.5);\r
        ctx.font = '15px ' + FONT; ctx.fillStyle = '#5a2a00'; ctx.fillText('🚚 x1.5 · ' + Math.ceil(truck.t) + 's', 0, 20.5);\r
      }\r
    }\r
    ctx.restore();\r
    labelHits.push({ id: d.id, x: sx - 56 * sc, y: sy - 24 * sc, w: 112 * sc, h: 50 * sc });\r
  });\r
}\r
function drawFloaters() {\r
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';\r
  floaters.forEach(f => {\r
    const [sx, sy] = toScreen(f.ix, f.iy);\r
    const p = f.t / 1.4;\r
    ctx.globalAlpha = clamp(2 - p * 2, 0, 1);\r
    const sc = clamp(cam.z * 1.2, .85, 1.2);\r
    ctx.font = (f.big ? 26 : 20) * sc + 'px ' + FONT;\r
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(58,23,80,.9)';\r
    ctx.strokeText(f.text, sx, sy - p * 46 * sc); ctx.fillStyle = f.col; ctx.fillText(f.text, sx, sy - p * 46 * sc);\r
  });\r
  ctx.globalAlpha = 1;\r
}\r
const clouds = [{ x: .1, y: .12, s: 1 }, { x: .6, y: .3, s: .8 }, { x: .35, y: .58, s: 1.2 }, { x: .85, y: .75, s: .9 }];\r
function drawSky(dt) {\r
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#79c9f0'); g.addColorStop(1, '#d9f3ff');\r
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);\r
  clouds.forEach(c => {\r
    c.x += dt * .006 * c.s; if (c.x > 1.2) c.x = -.25;\r
    const x = c.x * W, y = c.y * H, r = 34 * c.s;\r
    ctx.fillStyle = 'rgba(255,255,255,.85)';\r
    ell(x, y, r * 1.6, r * .6, 'rgba(255,255,255,.85)'); ell(x - r * .6, y - r * .35, r * .8, r * .55, 'rgba(255,255,255,.85)'); ell(x + r * .5, y - r * .3, r * .9, r * .6, 'rgba(255,255,255,.85)');\r
  });\r
}\r
function render(dt) {\r
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);\r
  ctx.lineJoin = 'round';\r
  drawSky(dt);\r
  ctx.save();\r
  ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);\r
  drawGround();\r
  const objs = buildWorld();\r
  for (let i = 0; i < objs.length; i++) objs[i].f();\r
  ctx.restore();\r
  drawLabels(); drawFloaters();\r
}\r
\r
/* ============================== Logic game ============================== */\r
function addXp(n) {\r
  S.xp += n;\r
  while (S.xp >= xpNeed()) { S.xp -= xpNeed(); S.lv++; const b = 100 * S.lv; S.money += b; toast('⭐ Lên cấp ' + S.lv + '! Thưởng $' + fmt(b)); }\r
}\r
function update(dt) {\r
  PRODUCERS.forEach(d => {\r
    const z = S.zones[d.id]; if (!z.u) return;\r
    const cp = capOf(z);\r
    if (z.ready < cp) {\r
      z.prog += rateOf(d, z) * dt;\r
      if (z.prog >= 1) { const k = Math.floor(z.prog), add = Math.min(k, cp - z.ready); z.ready += add; z.prog -= k; if (z.ready >= cp) z.prog = 0; }\r
    } else z.prog = 0;\r
  });\r
  syncFarmers(); syncAnimals();\r
  farmers.forEach(f => updateFarmer(f, dt));\r
  updateTruck(dt); updateAnimals(dt);\r
  for (let i = floaters.length - 1; i >= 0; i--) { floaters[i].t += dt; if (floaters[i].t > 1.4) floaters.splice(i, 1); }\r
}\r
\r
/* ============================== Giao diện ============================== */\r
const $ = id => document.getElementById(id);\r
const sheet = $('sheet'), sheetBody = $('sheetBody');\r
let ui = null, lastHTML = '', toastT = 0, resetArm = 0;\r
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }\r
\r
function btn(act, arg, label, cost, ok, cls) {\r
  return '<button class="act ' + (ok ? '' : 'off') + ' ' + (cls || '') + '" data-act="' + act + '" data-arg="' + (arg || '') + '">' + label + (cost != null ? '<small>$' + fmt(cost) + '</small>' : '') + '</button>';\r
}\r
function row(icon, title, desc, right, extra) {\r
  return '<div class="row"><div class="ico">' + icon + '</div><div class="txt"><b>' + title + '</b><span>' + desc + '</span>' + (extra || '') + '</div>' + (right || '') + '</div>';\r
}\r
const prog = f => '<div class="prog"><i style="width:' + Math.round(clamp(f, 0, 1) * 100) + '%"></i></div>';\r
\r
function zoneRows(d) {\r
  const z = S.zones[d.id];\r
  if (!z.u) return row('🔒', d.name, 'Mở khoá để trồng trọt, chăn nuôi và bán ' + d.item + ' (giá $' + d.val + '/món).', btn('unlock', d.id, 'Mở khoá', d.cost, S.money >= d.cost, 'gold'));\r
  if (d.id === 'wh') return row('📦', 'Nhà kho · Cấp ' + S.upg.wh, 'Đang chứa ' + totalStock() + '/' + whCap() + ' món. Nâng cấp để chứa thêm 30 món.', S.upg.wh >= 10 ? '' : btn('upwh', '', 'Nâng cấp', whCost(), S.money >= whCost()), prog(totalStock() / whCap()))\r
    + '<div class="hint">Chạm vào biểu tượng nông dân trên sàn kho để thuê thêm người.</div>';\r
  if (d.id === 'market') return row('🏪', 'Chợ · Cấp ' + S.upg.market, 'Giá bán x' + mkMult().toFixed(2) + '. Xe tải ghé mỗi ~25 giây: bán x1.5 trong 10 giây.', S.upg.market >= 10 ? '' : btn('upmarket', '', 'Nâng cấp', mkCost(), S.money >= mkCost()));\r
  const max = z.lv >= MAXLV;\r
  return row(d.icon, d.name + ' · Cấp ' + z.lv, d.item + ' $' + d.val + '/món · ' + (rateOf(d, z) * 60).toFixed(1) + ' món/phút · chứa ' + Math.floor(z.ready) + '/' + capOf(z),\r
    max ? '' : btn('upz', d.id, 'Nâng cấp', upCost(d, z), S.money >= upCost(d, z)), prog(z.ready / capOf(z)))\r
    + '<div class="hint">Mỗi cấp tăng 40% sản lượng và +4 sức chứa.</div>';\r
}\r
function farmerStatus() {\r
  return farmers.map((f, i) => row('🧑‍🌾', 'Nông dân ' + (i + 1), f.state === 'idle' ? 'Đang nghỉ' : f.label, '', f.cargo ? '<span>Đang mang ' + f.cargo.n + ' ' + ZD[f.cargo.id].item + '</span>' : '')).join('');\r
}\r
function panelHTML() {\r
  if (!ui) return ['', ''];\r
  switch (ui.kind) {\r
    case 'zone': return [ZD[ui.arg].icon + ' ' + ZD[ui.arg].name, zoneRows(ZD[ui.arg])];\r
    case 'build': return ['Xây dựng & nâng cấp', ZDEF.map(d => {\r
      const z = S.zones[d.id];\r
      if (!z.u) return row('🔒', d.name, 'Chưa mở khoá · $' + d.val + '/món', btn('unlock', d.id, 'Mở khoá', d.cost, S.money >= d.cost, 'gold'));\r
      if (d.id === 'wh') return row('📦', d.name + ' · Cấp ' + S.upg.wh, 'Chứa ' + whCap() + ' món', S.upg.wh >= 10 ? '' : btn('upwh', '', 'Nâng cấp', whCost(), S.money >= whCost()));\r
      if (d.id === 'market') return row('🏪', d.name + ' · Cấp ' + S.upg.market, 'Giá bán x' + mkMult().toFixed(2), S.upg.market >= 10 ? '' : btn('upmarket', '', 'Nâng cấp', mkCost(), S.money >= mkCost()));\r
      return row(d.icon, d.name + ' · Cấp ' + z.lv, (rateOf(d, z) * 60).toFixed(1) + ' ' + d.item + '/phút', z.lv >= MAXLV ? '' : btn('upz', d.id, 'Nâng cấp', upCost(d, z), S.money >= upCost(d, z)));\r
    }).join('')];\r
    case 'shop': return ['Cửa hàng', [\r
      row('👟', 'Giày chạy nhanh · Cấp ' + S.upg.speed, 'Nông dân đi nhanh hơn (' + farmerSpeed().toFixed(1) + ' ô/giây).', S.upg.speed >= 8 ? '' : btn('upspeed', '', 'Mua', spdCost(), S.money >= spdCost())),\r
      row('🧺', 'Giỏ lớn · Cấp ' + S.upg.carry, 'Mỗi chuyến mang được ' + carryCap() + ' món.', S.upg.carry >= 10 ? '' : btn('upcarry', '', 'Mua', carryCost(), S.money >= carryCost())),\r
      row('📦', 'Kho lớn · Cấp ' + S.upg.wh, 'Sức chứa ' + whCap() + ' món.', S.upg.wh >= 10 ? '' : btn('upwh', '', 'Mua', whCost(), S.money >= whCost())),\r
      row('🏪', 'Quầy chợ · Cấp ' + S.upg.market, 'Giá bán x' + mkMult().toFixed(2) + '.', S.upg.market >= 10 ? '' : btn('upmarket', '', 'Mua', mkCost(), S.money >= mkCost())),\r
      row('🧑‍🌾', 'Thuê nông dân (' + S.farmers + '/10)', 'Thêm một người vận chuyển.', S.farmers >= 10 ? '' : btn('hire', '', 'Thuê', hireCost(), S.money >= hireCost(), 'gold')),\r
    ].join('')];\r
    case 'quest': return ['Nhiệm vụ', QDEF.map(q => {\r
      const t = qTarget(q), cur = Math.min(S.stats[q.k], t), ok = S.stats[q.k] >= t;\r
      return row(q.k === 'harv' ? '🌾' : q.k === 'sold' ? '🛍️' : '💰', q.t, fmt(cur) + '/' + fmt(t) + ' ' + q.unit + ' · thưởng $' + fmt(q.rew(t)), btn('claim', q.k, ok ? 'Nhận' : 'Chưa xong', null, ok, 'gold'), prog(cur / t));\r
    }).join('')];\r
    case 'stock': {\r
      const items = PRODUCERS.filter(d => S.zones[d.id].u);\r
      let val = 0; items.forEach(d => val += (S.stock[d.id] || 0) * d.val);\r
      return ['Kho hàng · ' + totalStock() + '/' + whCap(), items.map(d => row(d.item, d.name, (S.stock[d.id] || 0) + ' món · $' + d.val + '/món', '')).join('')\r
        + row('💸', 'Bán nhanh toàn bộ', 'Nhận 70% giá trị: $' + fmt(val * .7), btn('sellall', '', 'Bán', null, val > 0, 'gold'))];\r
    }\r
    case 'team': return ['Nông dân (' + S.farmers + '/10)',\r
      row('➕', 'Thuê nông dân mới', 'Nhiều người hơn, vận chuyển nhanh hơn.', S.farmers >= 10 ? '' : btn('hire', '', 'Thuê', hireCost(), S.money >= hireCost(), 'gold')) + farmerStatus()];\r
    case 'map': return ['Bản đồ trang trại', '<div class="map3">' + ZGRID.map(r => r.map(d => '<button class="' + (S.zones[d.id].u ? '' : 'lock') + '" data-act="focus" data-arg="' + d.id + '">' + (S.zones[d.id].u ? d.icon : '🔒') + '<span>' + d.name + '</span></button>').join('')).join('') + '</div>'];\r
    case 'menu': return ['Cài đặt', row('📖', 'Cách chơi', 'Kéo để di chuyển, chụm hai ngón để thu phóng. Chạm vào khu vực để nâng cấp. Nông dân tự thu hoạch, cất vào kho rồi bán ở chợ.', '')\r
      + row('🔄', 'Chơi lại từ đầu', resetArm ? 'Bấm lần nữa để xoá toàn bộ tiến trình.' : 'Xoá tiến trình đã lưu.', btn('reset', '', resetArm ? 'Chắc chắn?' : 'Xoá', null, true))];\r
  }\r
  return ['', ''];\r
}\r
function renderSheet(force) {\r
  if (!ui) return;\r
  const p = panelHTML(); const key = p[0] + '|' + p[1];\r
  if (!force && key === lastHTML) return;\r
  lastHTML = key; $('sheetTitle').textContent = p[0]; sheetBody.innerHTML = p[1];\r
}\r
function openSheet(kind, arg) {\r
  ui = { kind, arg }; lastHTML = ''; renderSheet(true); sheet.classList.add('open');\r
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === kind));\r
}\r
function closeSheet() { ui = null; sheet.classList.remove('open'); document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); }\r
function buy(cost) { if (S.money < cost) { toast('Chưa đủ tiền, cần $' + fmt(cost)); return false; } S.money -= cost; return true; }\r
function doAct(a, arg) {\r
  switch (a) {\r
    case 'unlock': { const d = ZD[arg]; if (buy(d.cost)) { S.zones[arg].u = true; toast('Đã mở khoá ' + d.name + '!'); focusZone(arg, .8, true); } break; }\r
    case 'upz': { const d = ZD[arg], z = S.zones[arg]; if (z.lv < MAXLV && buy(upCost(d, z))) { z.lv++; toast(d.name + ' lên cấp ' + z.lv); } break; }\r
    case 'upwh': if (buy(whCost())) { S.upg.wh++; toast('Kho chứa được ' + whCap() + ' món'); } break;\r
    case 'upmarket': if (buy(mkCost())) { S.upg.market++; toast('Giá bán tăng x' + mkMult().toFixed(2)); } break;\r
    case 'upspeed': if (buy(spdCost())) { S.upg.speed++; toast('Nông dân đi nhanh hơn!'); } break;\r
    case 'upcarry': if (buy(carryCost())) { S.upg.carry++; toast('Mỗi chuyến mang ' + carryCap() + ' món'); } break;\r
    case 'hire': if (S.farmers < 10 && buy(hireCost())) { S.farmers++; toast('Đã thuê nông dân mới!'); } break;\r
    case 'claim': { const q = QDEF.find(x => x.k === arg), t = qTarget(q); if (S.stats[arg] >= t) { const r = q.rew(t); S.money += r; S.qt[arg]++; toast('Nhận thưởng $' + fmt(r)); } break; }\r
    case 'sellall': { let v = 0; PRODUCERS.forEach(d => { v += (S.stock[d.id] || 0) * d.val; S.stock[d.id] = 0; }); v = Math.round(v * .7); S.money += v; S.stats.earn += v; toast('Đã bán nhanh được $' + fmt(v)); break; }\r
    case 'focus': closeSheet(); focusZone(arg, .85, false); break;\r
    case 'reset': if (!resetArm) { resetArm = 1; setTimeout(() => { resetArm = 0; }, 3000); } else { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} S = defaultState(); farmers.length = 0; pendingIn = 0; reservedOut = 0; ZDEF.forEach(d => d.reserved = 0); resetArm = 0; closeSheet(); toast('Đã bắt đầu lại!'); } break;\r
  }\r
  renderSheet(true); updateHud();\r
}\r
sheetBody.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) doAct(b.dataset.act, b.dataset.arg); });\r
$('sheetClose').addEventListener('click', closeSheet);\r
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { if (ui && ui.kind === t.dataset.tab) closeSheet(); else openSheet(t.dataset.tab); }));\r
$('menuBtn').addEventListener('click', () => { if (ui && ui.kind === 'menu') closeSheet(); else openSheet('menu'); });\r
$('mapBtn').addEventListener('click', () => { if (ui && ui.kind === 'map') closeSheet(); else openSheet('map'); });\r
$('ffBtn').addEventListener('click', () => { S.speed = S.speed % 3 + 1; updateHud(); toast('Tốc độ game x' + S.speed); });\r
\r
function updateHud() {\r
  $('money').textContent = fmt(S.money);\r
  $('lvnum').textContent = S.lv;\r
  $('xp').style.width = Math.round(S.xp / xpNeed() * 100) + '%';\r
  $('ffx').textContent = 'x' + S.speed; $('ffBtn').classList.toggle('on', S.speed > 1);\r
  const c = claimable(); const bq = $('bq'); bq.textContent = c; bq.classList.toggle('show', c > 0);\r
  const bt = $('bt'); bt.textContent = '1'; bt.classList.toggle('show', S.farmers < 10 && S.money >= hireCost());\r
}\r
\r
/* ============================== Điều khiển: kéo, chụm, chạm ============================== */\r
const ptrs = new Map(); let downInfo = null, pinch = null;\r
cv.addEventListener('pointerdown', e => {\r
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}\r
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });\r
  cam.tx = cam.ty = cam.tz = null;\r
  if (ptrs.size === 1) downInfo = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };\r
  else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: cam.z }; if (downInfo) downInfo.moved = true; }\r
});\r
cv.addEventListener('pointermove', e => {\r
  const p = ptrs.get(e.pointerId); if (!p) return;\r
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;\r
  if (ptrs.size === 1) {\r
    if (downInfo && Math.hypot(e.clientX - downInfo.x, e.clientY - downInfo.y) > 8) downInfo.moved = true;\r
    if (downInfo && downInfo.moved) { cam.x -= dx / cam.z; cam.y -= dy / cam.z; clampCam(); }\r
  } else if (ptrs.size === 2 && pinch) {\r
    const [a, b] = [...ptrs.values()]; cam.z = pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d; clampCam();\r
  }\r
});\r
function endPtr(e) {\r
  if (!ptrs.has(e.pointerId)) return;\r
  ptrs.delete(e.pointerId);\r
  if (ptrs.size < 2) pinch = null;\r
  if (downInfo && !downInfo.moved && e.type === 'pointerup' && performance.now() - downInfo.t < 600) onTap(e.clientX, e.clientY);\r
  if (ptrs.size === 0) downInfo = null;\r
}\r
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);\r
cv.addEventListener('wheel', e => { e.preventDefault(); cam.tx = cam.ty = cam.tz = null; cam.z *= Math.exp(-e.deltaY * .001); clampCam(); }, { passive: false });\r
function onTap(x, y) {\r
  for (const h of labelHits) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return tapZone(h.id, x, y);\r
  const [gx, gy] = screenToTile(x, y);\r
  const d = zoneAt(Math.floor(gx), Math.floor(gy));\r
  if (d) tapZone(d.id, x, y, gx, gy); else closeSheet();\r
}\r
function tapZone(id, x, y, gx, gy) {\r
  const d = ZD[id];\r
  if (id === 'wh' && gx !== undefined && S.zones.wh.u) {\r
    const lx = gx - d.x0, ly = gy - d.y0;\r
    if (lx > .8 && lx < 2.8 && ly > 1.5 && ly < 3.3) { openSheet('team'); return; }\r
  }\r
  openSheet('zone', id); focusZone(id, Math.max(cam.z, .7), true);\r
}\r
\r
/* ============================== Vòng lặp ============================== */\r
let last = performance.now(), hudT = 0, saveT = 0;\r
function frame(now) {\r
  const rdt = Math.min(.05, (now - last) / 1000); last = now;\r
  const dt = rdt * S.speed; TIME += rdt;\r
  update(dt);\r
  if (cam.tx !== null) {\r
    const k = 1 - Math.pow(.0008, rdt);\r
    cam.x = lerp(cam.x, cam.tx, k); cam.y = lerp(cam.y, cam.ty, k); cam.z = lerp(cam.z, cam.tz, k);\r
    if (Math.abs(cam.x - cam.tx) < .5 && Math.abs(cam.y - cam.ty) < .5 && Math.abs(cam.z - cam.tz) < .004) cam.tx = cam.ty = cam.tz = null;\r
  }\r
  clampCam();\r
  render(rdt);\r
  hudT += rdt; if (hudT > .25) { hudT = 0; updateHud(); renderSheet(false); }\r
  saveT += rdt; if (saveT > 5) { saveT = 0; saveState(); }\r
  requestAnimationFrame(frame);\r
}\r
document.addEventListener('visibilitychange', () => { if (document.hidden) saveState(); });\r
window.addEventListener('pagehide', saveState);\r
if (document.fonts && document.fonts.load) document.fonts.load('20px "Lilita One"').catch(() => {});\r
syncFarmers(); syncAnimals(); updateHud();\r
setTimeout(() => toast('Kéo để di chuyển · Chụm để thu phóng · Chạm khu vực để nâng cấp'), 600);\r
requestAnimationFrame(frame);\r
<\/script>\r
\r
\r
<!-- GAME_TASK_BRIDGE_START -->\r
<!-- GAME_TASK_BRIDGE_VERSION: 1.0.0 -->\r
<script>\r
(function() {\r
  if (window.GameTaskBridge && window.GameTaskBridge.version === "1.0.0") return;\r
  window.GameTaskBridge = {\r
    version: "1.0.0",\r
    emit: function(type, data) {\r
      try {\r
        window.parent.postMessage({\r
          source: "game",\r
          type: type,\r
          data: data || {}\r
        }, "*");\r
      } catch(e) { /* ignore */ }\r
    }\r
  };\r
})();\r
<\/script>\r
<!-- GAME_TASK_BRIDGE_END -->\r
\r
<!-- Nút "Về trang chủ" — thêm bởi scripts/add-offline-back-button.mjs -->\r
<style>\r
  #homeBackBtn {\r
    position: fixed;\r
    z-index: 2147483000;\r
    top: calc(env(safe-area-inset-top, 0px) + 10px);\r
    left: calc(env(safe-area-inset-left, 0px) + 10px);\r
    width: 42px; height: 42px;\r
    border-radius: 14px;\r
    display: grid; place-items: center;\r
    cursor: pointer;\r
    font-family: inherit;\r
    font-size: 20px; font-weight: 800; line-height: 1;\r
    color: #1d2e4a;\r
    background: #fffbf2;\r
    border: 3px solid #1d2e4a;\r
    box-shadow: 0 4px 0 #1d2e4a, 0 8px 14px rgba(0, 0, 0, .22);\r
    transition: transform .12s, box-shadow .12s;\r
    -webkit-tap-highlight-color: transparent;\r
    user-select: none; -webkit-user-select: none;\r
  }\r
  #homeBackBtn:hover { filter: brightness(1.06); }\r
  #homeBackBtn:active {\r
    transform: translateY(3px);\r
    box-shadow: 0 1px 0 #1d2e4a, 0 3px 6px rgba(0, 0, 0, .22);\r
  }\r
  #homeBackBtn:focus-visible { outline: 3px solid var(--sky,#4b9dff); outline-offset: 2px; }\r
  @media (prefers-reduced-motion: reduce) { #homeBackBtn { transition: none; } }\r
</style>\r
<button id="homeBackBtn" type="button" aria-label="Về trang chủ" title="Về trang chủ">\r
  <span aria-hidden="true">&#8592;</span>\r
</button>\r
<script>\r
  // Nút dùng chung cho mọi game offline: báo ngược lên React (OfflineGamePage)\r
  // để quay về trang chủ. Mở file .html trực tiếp thì tự điều hướng.\r
  (function () {\r
    var btn = document.getElementById("homeBackBtn");\r
    if (!btn) return;\r
    btn.addEventListener("click", function () {\r
      try {\r
        if (window.parent && window.parent !== window) {\r
          window.parent.postMessage({ type: "quit", data: {} }, "*");\r
          return;\r
        }\r
      } catch (e) { /* rơi xuống cách tự điều hướng */ }\r
      try { window.location.href = "/"; } catch (e) { /* ignore */ }\r
    });\r
  })();\r
<\/script>\r
</body>\r
</html>`;export{e as default};