/**
 * offlineGameSync.js — đồng bộ file save của các game offline (src/games/offline/)
 * lên API tiến trình người chơi, để đăng nhập máy khác vẫn chơi tiếp được dở dang.
 *
 * Cơ chế:
 *   · Mở game  → GET /api/users/me/games/offline:<id> (trò chơi `gameState`),
 *     merge các key localStorage của game vào máy hiện tại TRƯỚC khi iframe chạy.
 *   · Trong game → mọi write localStorage của game được ghi nhận (patch
 *     Storage.prototype — iframe cùng origin dùng chung prototype với host),
 *     rồi đẩy snapshot lên API theo debounce + khi rời trang + khi có mạng lại.
 *   · Mất mạng → snapshot giữ trong hàng đợi localStorage, tự gửi lại sau.
 *
 * Merge mỗi key (không có mốc thời gian đáng tin thì THà giữ local cũ để
 * không xoá tiến độ chơi trước ngày có tính năng sync):
 *   · local trống            → nhận bản server (máy mới).
 *   · local mới hơn server   → giữ local, sẽ tự đẩy lên server.
 *   · local không có mốc     → giữ local (dữ liệu legacy chưa từng sync).
 */
import { gameProgressService, loadAuth } from "../services/api.js";

const PENDING_KEY = "edu_offgames_pending_v1";
const STAMP_KEY = "edu_offgame_stamps_v1";
// Danh sách key localStorage của từng game — phải sống dai hơn 1 session,
// vì snapshot mới THAY THẾ bản trên server; mất key khỏi danh sách = mất save.
const KEYS_INDEX = "edu_offgame_keys_v1";
const API_PREFIX = "offline:";
const VALUE_MAX = 256 * 1024;
const GET_TIMEOUT_MS = 2500;
const PUSH_DEBOUNCE_MS = 2500;
const AUTO_FLUSH_MS = 15000;
// Key của app (auth, ví xu, cache, prompt…), không thuộc game nào — bỏ khi capture.
const HOST_KEY_PREFIXES = ["edu_", "gq_", "pwa-"];

let session = null; // { gameId, name, keys:Set<string>, restoring:boolean }
let patchInstalled = false;
let flushing = false;
let pushTimer = null;
let autoStarted = false;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    if (value) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  } catch {
    /* localStorage bị chặn — hàng đợi sẽ tự thử lại lần sau */
  }
}

function apiId(gameId) {
  return `${API_PREFIX}${gameId}`;
}

function rememberKey(gameId, key) {
  session?.keys.add(key);
  const index = readJson(KEYS_INDEX, {});
  const list = index[gameId] || (index[gameId] = []);
  if (!list.includes(key)) {
    list.push(key);
    writeJson(KEYS_INDEX, index);
  }
}

function gameKeys(gameId) {
  return readJson(KEYS_INDEX, {})[gameId] || [];
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

function installCapture() {
  if (patchInstalled) return;
  patchInstalled = true;
  const origSet = Storage.prototype.setItem;
  const origDel = Storage.prototype.removeItem;
  // Game chạy trong iframe cùng origin nên patch prototype bắt được mọi write.
  Storage.prototype.setItem = function (k, v) {
    origSet.call(this, k, v);
    noteWrite(String(k));
  };
  Storage.prototype.removeItem = function (k) {
    origDel.call(this, k);
    noteWrite(String(k));
  };
}

function noteWrite(key) {
  if (!session || session.restoring) return;
  if (HOST_KEY_PREFIXES.some((p) => key.startsWith(p))) return;
  rememberKey(session.gameId, key);
  const stamps = readJson(STAMP_KEY, {});
  const g = stamps[session.gameId] || (stamps[session.gameId] = {});
  g[key] = Date.now();
  writeJson(STAMP_KEY, stamps);
  schedulePush();
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    queueSnapshot();
    flushPending();
  }, PUSH_DEBOUNCE_MS);
}

function buildSnapshot() {
  if (!session) return null;
  const stamps = readJson(STAMP_KEY, {})[session.gameId] || {};
  const allKeys = new Set([...gameKeys(session.gameId), ...session.keys]);
  const entries = {};
  let bytes = 0;
  for (const k of allKeys) {
    const val = localStorage.getItem(k);
    if (val === null) continue; // game đã xoá key → bản sau không còn key này
    if (val.length > VALUE_MAX || bytes + val.length > 2 * 1024 * 1024) {
      console.warn(`[offlineGameSync] Bỏ qua key quá lớn: ${k}`);
      continue;
    }
    bytes += val.length;
    entries[k] = { at: stamps[k] || Date.now(), val };
  }
  return Object.keys(entries).length ? { v: 1, entries } : null;
}

function queueSnapshot() {
  if (!session) return;
  const snap = buildSnapshot();
  if (!snap) return;
  const pending = readJson(PENDING_KEY, {});
  pending[session.gameId] = { gameState: snap, gameName: session.name, queuedAt: Date.now() };
  writeJson(PENDING_KEY, pending);
}

/** Gửi hết hàng đợi chờ lên API. Không ném lỗi ra ngoài — offline là bình thường. */
export async function flushPending() {
  if (flushing) return;
  if (!loadAuth()?.token) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;

  const pending = readJson(PENDING_KEY, {});
  const ids = Object.keys(pending);
  if (!ids.length) return;

  flushing = true;
  try {
    for (const gameId of ids) {
      const body = pending[gameId];
      try {
        await gameProgressService.upsertGame(apiId(gameId), {
          gameName: body.gameName || gameId,
          gameState: body.gameState,
        });
        const current = readJson(PENDING_KEY, {});
        // Trong lúc gửi, game vừa tạo bản mới hơn → giữ lại cho lần sau.
        if (!current[gameId] || current[gameId].queuedAt === body.queuedAt) delete current[gameId];
        writeJson(PENDING_KEY, current);
      } catch {
        /* giữ hàng đợi, thử lại khi có mạng */
      }
    }
  } finally {
    flushing = false;
  }
}

/**
 * Gọi TRƯỚC khi render iframe game: tải bản save của user và merge vào
 * localStorage. Await xong mới cho game chạy để game đọc đúng tiến độ.
 */
export async function startGameSync(gameId, gameName) {
  endGameSync();
  installCapture();
  ensureAutoSync();
  session = { gameId, name: gameName || gameId, keys: new Set(), restoring: true };

  let entries = null;
  if (loadAuth()?.token && navigator.onLine !== false) {
    try {
      const progress = await withTimeout(gameProgressService.getGame(apiId(gameId)), GET_TIMEOUT_MS);
      entries = progress?.gameState?.entries || null;
    } catch {
      /* API lỗi/timeout — chơi bằng save local, sẽ sync lại sau */
    }
  }

  if (session && session.gameId === gameId && entries) {
    const allStamps = readJson(STAMP_KEY, {});
    const stamps = allStamps[gameId] || (allStamps[gameId] = {});
    for (const [k, e] of Object.entries(entries)) {
      if (typeof e?.val !== "string" || e.val.length > VALUE_MAX) continue;
      rememberKey(gameId, k);
      const local = localStorage.getItem(k);
      if (local === e.val) {
        if (stamps[k] === undefined) stamps[k] = e.at || Date.now();
        continue;
      }
      const localAt = stamps[k];
      if (local !== null && (localAt === undefined || localAt >= (e.at || 0))) {
        // Local thắng (mới hơn hoặc dữ liệu legacy chưa từng sync) — đóng mốc
        // để bản đẩy lên server sau đó ghi nhận đúng ai viết cuối.
        stamps[k] = Date.now();
      } else {
        localStorage.setItem(k, e.val);
        stamps[k] = e.at || Date.now();
      }
    }
    writeJson(STAMP_KEY, allStamps);
  }

  if (session && session.gameId === gameId) session.restoring = false;
  flushPending();
}

/** Gọi khi rời trang game: xếp bản mới nhất (nếu có) vào hàng đợi và gửi. */
export function endGameSync() {
  if (!session) return;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  // restoring = chưa kịp chơi, đừng xếp hàng trạng thái nửa vời.
  if (!session.restoring) queueSnapshot();
  session = null;
  flushPending();
}

function ensureAutoSync() {
  if (autoStarted || typeof window === "undefined") return;
  autoStarted = true;
  window.addEventListener("online", flushPending);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) flushPending();
  });
  window.addEventListener("pagehide", () => {
    if (session && !session.restoring) queueSnapshot();
  });
  setInterval(() => flushPending(), AUTO_FLUSH_MS);
}
