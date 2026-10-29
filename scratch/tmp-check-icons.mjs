/**
 * Kiểm tra offline bộ icon nhiệm vụ (node scratch/tmp-check-icons.mjs):
 *  1. render thật bằng react-dom/server → mọi icon phải ra <svg viewBox 0 0 24 24>
 *  2. parse từng `d` theo bút vẽ (M/L/H/V/A + dạng tương đối) → bbox phải nằm
 *     trong khung, đủ lớn và gần tâm (bắt lỗi vẽ lệch/quên nét/chệch scale)
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { TaskIcon, taskIconName } from "./tmp-taskicon.mjs";

const REAL = [
  ["PLAY_23", "GAME_WON"], ["PLAY_1", "GAME_PLAYED"], ["PLAY_3", "GAME_PLAYED"],
  ["PLAY_10", "GAME_PLAYED"], ["WIN_1", "GAME_WON"], ["WIN_5", "GAME_WON"],
  ["ANSWER_5", "QUESTION_ANSWERED"], ["ANSWER_10", "QUESTION_ANSWERED"],
  ["CORRECT_5", "ANSWER_CORRECT"], ["CORRECT_10", "ANSWER_CORRECT"],
  ["XP_100", "XP_EARNED"], ["XP_500", "XP_EARNED"], ["LOGIN_1", "LOGIN"],
  ["PLAY_100_TOTAL", "GAME_PLAYED"], ["SPIN_WHEEL", "MINI_GAME"], ["", ""],
];

/** Trả về danh sách điểm bút đi qua; cung (A/a) được chia nhỏ 24 đoạn để bbox đúng. */
function arcPoints(x0, y0, rx, ry, rot, large, sweep, x1, y1) {
  if (x0 === x1 && y0 === y1) return [[x1, y1]];
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = (rot * Math.PI) / 180;
  const cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x0 - x1) / 2, dy = (y0 - y1) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  let lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const sign = large === sweep ? -1 : 1;
  const co = sign * Math.sqrt(Math.max(0, (rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p) / (rx * rx * y1p * y1p + ry * ry * x1p * x1p || 1)));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x0 + x1) / 2;
  const cy = sin * cxp + cos * cyp + (y0 + y1) / 2;
  const ang = (ux, uy, vx, vy) => {
    const d = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
    const c = Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (d || 1)));
    return (Math.acos(c) * (ux * vy - uy * vx < 0 ? -1 : 1));
  };
  const th0 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (sweep === 0 && dth > 0) dth -= 2 * Math.PI;
  if (sweep === 1 && dth < 0) dth += 2 * Math.PI;
  const out = [];
  for (let k = 1; k <= 24; k++) {
    const t = th0 + (dth * k) / 24;
    const px = cos * rx * Math.cos(t) - sin * ry * Math.sin(t) + cx;
    const py = sin * rx * Math.cos(t) + cos * ry * Math.sin(t) + cy;
    out.push([px, py]);
  }
  return out;
}

function penPoints(d) {
  const tk = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
  const N = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  let i = 0, x = 0, y = 0, start = [0, 0];
  const pts = [];
  const num = () => Number(tk[i++]);
  const step = (cmd, abs, args) => {
    if (cmd === "z") return [[(x = start[0]), (y = start[1])]];
    if (cmd === "h") return [[(x = abs ? args[0] : x + args[0]), y]];
    if (cmd === "v") return [[x, (y = abs ? args[0] : y + args[0])]];
    if (cmd === "a") {
      const [rx, ry, rot, large, sweep] = args;
      const nx = abs ? args[5] : x + args[5];
      const ny = abs ? args[6] : y + args[6];
      const seg = arcPoints(x, y, rx, ry, rot, large, sweep, nx, ny);
      x = nx; y = ny;
      return seg;
    }
    const nx = abs ? args[args.length - 2] : x + args[args.length - 2];
    const ny = abs ? args[args.length - 1] : y + args[args.length - 1];
    if (cmd === "m") start = [nx, ny];
    x = nx; y = ny;
    return [[nx, ny]];
  };
  while (i < tk.length) {
    const t = tk[i];
    if (!/[a-zA-Z]/.test(t)) throw new Error(`thiếu lệnh trước "${t}" trong: ${d}`);
    const abs = t === t.toUpperCase();
    const cmd = t.toLowerCase();
    i++;
    const n = N[cmd];
    if (n == null) throw new Error(`lệnh lạ "${t}"`);
    if (cmd === "z") { pts.push(...step(cmd, abs, [])); continue; }
    const args = [];
    for (let k = 0; k < n; k++) args.push(num());
    pts.push(...step(cmd, abs, args));
    // lặp tham số không ghi lại chữ cái (M/L/H/V/A)
    while (i < tk.length && !/[a-zA-Z]/.test(tk[i]) && "mlha".includes(cmd)) {
      const rep = [];
      for (let k = 0; k < n; k++) rep.push(num());
      pts.push(...step(cmd, abs, rep));
    }
  }
  return pts;
}

function bbox(ds) {
  const pts = ds.flatMap((d) => d === "STAR_FIX" ? [] : penPoints(d));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

let bad = 0;
for (const [code, type] of REAL) {
  const html = renderToStaticMarkup(createElement(TaskIcon, { code, type, className: "w-4 h-4" }));
  const name = taskIconName(code, type);
  const ds = [...html.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
  let note = "";
  const frame = html.startsWith('<svg viewBox="0 0 24 24"') && html.includes('stroke="currentColor"') && ds.length >= 1;
  let b = null;
  try { b = bbox(ds); } catch (e) { note = "❌ " + e.message; }
  if (!frame) note += " ❌ khung SVG";
  if (b) {
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    const off = Math.max(Math.abs(cx - 12), Math.abs(cy - 12));
    if (w < 7 || h < 7) note += ` ❌ quá nhỏ (${w.toFixed(1)}×${h.toFixed(1)})`;
    if (off > 3) note += ` ❌ lệch tâm (${off.toFixed(1)})`;
    if (b.x0 < -0.5 || b.y0 < -0.5 || b.x1 > 24.5 || b.y1 > 24.5) note += " ❌ tràn viewBox";
  }
  if (note) bad++;
  console.log(
    `${String(code || "(trống)").padEnd(15)}${name.padEnd(10)} paths=${ds.length}`,
    b ? `bbox ${(b.x0).toFixed(1)},${b.y0.toFixed(1)} → ${b.x1.toFixed(1)},${b.y1.toFixed(1)}` : "bbox —",
    note,
  );
}
console.log(bad ? `\n${bad} icon cần sửa` : "\nOK: 16/16 icon hợp lệ (khung + path + bbox trong viewBox, đủ lớn, gần tâm)");
