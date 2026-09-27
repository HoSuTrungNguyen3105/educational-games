import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Chạy song song: API (server/) + Vite (frontend) trong MỘT terminal.
//   npm run dev        → cả hai, frontend trỏ vào API local (không phải đợi Render cold-start)
//   npm run dev:web    → chỉ frontend (dùng API trong .env)
//   npm run dev:api    → chỉ API

function findProjectRoot(start) {
  let dir = start;
  for (;;) {
    if (existsSync(path.join(dir, "package.json")) && existsSync(path.join(dir, "server"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
}

const root = findProjectRoot(path.dirname(fileURLToPath(import.meta.url)));
const isWin = process.platform === "win32";

function readDotEnv(file) {
  try {
    const out = {};
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

const serverEnv = readDotEnv(path.join(root, "server", ".env"));
const apiPort = serverEnv.PORT || process.env.PORT || "5000";
const apiUrl = `http://localhost:${apiPort}/api`;

// Chỉ set nếu người dùng KHÔNG tự cấu hình sẵn trong shell.
// Lưu ý: `npm run dev` sẽ ghi đè VITE_* trong .env (file .env vẫn dùng khi build/deploy).
// Tắt bằng DEV_LOCAL_API=0 nếu muốn dev vẫn gọi API trên Render.
function setIfAbsent(key, value) {
  if (process.env[key]) return;
  process.env[key] = value;
}

const useLocalApi = process.env.DEV_LOCAL_API !== "0";
if (useLocalApi) {
  setIfAbsent("VITE_API_BASE", apiUrl);
  setIfAbsent("VITE_SOCKET_URL", `http://localhost:${apiPort}`);
}

const procs = [];
let shuttingDown = false;

function prefixStream(stream, label) {
  let buf = "";
  stream.on("data", (chunk) => {
    buf += chunk.toString();
    const lines = buf.split(/\r?\n/);
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) console.log(`[${label}] ${line}`);
    }
  });
  stream.on("end", () => {
    if (buf.trim()) console.log(`[${label}] ${buf}`);
  });
}

function killTree(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  try {
    if (isWin) {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      process.kill(-child.pid, "SIGTERM");
    }
  } catch {
    try { child.kill("SIGKILL"); } catch { /* already gone */ }
  }
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const p of procs) killTree(p.child);
  setTimeout(() => process.exit(code), 300);
}

function start(label, cmd, args, opts) {
  const child = spawn(cmd, args, { cwd: root, ...opts, stdio: ["ignore", "pipe", "pipe"], detached: !isWin });
  procs.push({ label, child });
  prefixStream(child.stdout, label);
  prefixStream(child.stderr, label);
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(`[${label}] Dừng (code=${code}, signal=${signal ?? "-"}) — tắt phiên dev.`);
    shutdown(code === 0 ? 0 : 1);
  });
  child.on("error", (err) => {
    console.error(`[${label}] Không khởi động được: ${err.message}`);
    shutdown(1);
  });
  return child;
}

const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
if (!existsSync(viteBin)) {
  console.error("Không tìm thấy Vite — hãy chạy `npm install` trước.");
  process.exit(1);
}
if (!existsSync(path.join(root, "server", "node_modules"))) {
  console.error("Không tìm thấy server/node_modules — hãy chạy `npm install` trong thư mục server/.");
  process.exit(1);
}

console.log(`API  → ${apiUrl}`);
console.log(`Web  → http://localhost:5173 (VITE_API_BASE=${process.env.VITE_API_BASE})`);
console.log("Nhấn Ctrl+C để dừng cả hai.\n");

// Chặn trước: nếu cổng API đã bị chiếm thì báo rõ PID thay vì để `node --watch`
// treo với "Failed running 'src/server.js'" (khó hiểu).
function isPortFree(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", (err) => resolve(err.code !== "EADDRINUSE"));
    probe.once("listening", () => probe.close(() => resolve(true)));
    probe.listen(port, "0.0.0.0");
  });
}

function findPortOwner(port) {
  if (!isWin) return null;
  try {
    const r = spawnSync(
      "powershell",
      ["-NoProfile", "-Command", `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1).OwningProcess`],
      { encoding: "utf8", windowsHide: true },
    );
    const pid = parseInt(String(r.stdout ?? "").trim(), 10);
    return Number.isFinite(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

if (!(await isPortFree(Number(apiPort)))) {
  const pid = findPortOwner(Number(apiPort));
  console.error(`[dev] Cổng ${apiPort} đang bị chiếm${pid ? ` (PID ${pid})` : ""}.`);
  if (pid) {
    const who = spawnSync("tasklist", ["/FI", `PID eq ${pid}`], { encoding: "utf8", windowsHide: true });
    const line = String(who.stdout ?? "").split(/\r?\n/).find((l) => l.includes("node") || l.includes(".exe"));
    console.error(`[dev]   → ${line ? line.trim() : ""}`);
    console.error(`[dev]   → Chạy: taskkill /PID ${pid} /T /F  rồi chạy lại \`npm run dev\``);
  }
  console.error("[dev]   → Thường là phiên `npm run dev` cũ chưa được tắt.");
  process.exit(1);
}

// API trước, Vite sau 500ms để log không bị đan xen
start("api", process.execPath, ["--watch", "src/server.js"], {
  cwd: path.join(root, "server"),
  env: { ...process.env },
});
setTimeout(() => {
  start("web", process.execPath, [viteBin], { env: { ...process.env } });
}, 500);

for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(sig, () => shutdown(0));
}

// Chốt chặn: không để mồ côi vite/node --watch nếu dev.mjs bị kill bất ngờ
process.on("exit", () => {
  for (const { child } of procs) {
    if (child.exitCode !== null || child.signalCode !== null) continue;
    try {
      if (isWin) {
        spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        child.kill("SIGTERM");
      }
    } catch { /* đã thoát */ }
  }
});
