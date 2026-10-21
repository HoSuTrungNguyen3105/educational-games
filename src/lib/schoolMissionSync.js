/**
 * schoolMissionSync.js — hàng đợi lưu tiến độ "Trường Vui Vẻ" lên API.
 *
 * Game chạy trong iframe gửi state lên trang cha. Trang cha ghi state vào
 * localStorage trước, rồi mới gọi API:
 *   · Có mạng  → gửi ngay.
 *   · Mất mạng → giữ lại bản mới nhất; khi có sự kiện `online` (hoặc lần mở
 *     game sau) sẽ tự gửi lại.
 *
 * Chỉ cần bản ghi mới nhất vì state trong game là ảnh chụp luỹ kế (coins,
 * XP, cấp, nhiệm vụ, kết quả bài thi…), không phải danh sách sự kiện.
 */

import { gameProgressService, loadAuth } from "../services/api.js";

const GAME_ID = "school-mission";
const PENDING_KEY = "edu_school_mission_pending_v1";
const AUTO_FLUSH_MS = 15000;

let flushing = false;
let autoStarted = false;

function readPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function writePending(value) {
  try {
    if (value) localStorage.setItem(PENDING_KEY, JSON.stringify(value));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    /* localStorage bị chặn — bỏ qua, lần chơi sau sẽ gửi lại nếu còn */
  }
}

function buildBody(pending) {
  const body = {};
  if (pending.level != null) body.level = pending.level;
  if (pending.experience != null) body.experience = pending.experience;
  if (pending.progress != null) body.progress = pending.progress;
  if (pending.gamesPlayed != null) body.gamesPlayed = pending.gamesPlayed;
  if (pending.gameState !== undefined) body.gameState = pending.gameState;
  body.gameName = pending.gameName || "Trường Vui Vẻ";
  return body;
}

/**
 * Gửi bản đang chờ (nếu có). Trả về true khi đã ghi được lên API.
 * Không ném lỗi ra ngoài: mất mạng là trạng thái bình thường của game.
 */
export async function flushSchoolMissionSave() {
  if (flushing) return false;
  if (!loadAuth()?.token) return false;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;

  const pending = readPending();
  if (!pending || pending.gameState === undefined) return false;

  const sentAt = pending.queuedAt || 0;
  flushing = true;
  try {
    await gameProgressService.upsertGame(GAME_ID, buildBody(pending));

    // Trong lúc đang gửi, game có thể đã tạo bản mới hơn → giữ bản mới.
    const current = readPending();
    if (!current || (current.queuedAt || 0) <= sentAt) {
      writePending(null);
      return true;
    }
    // Có bản mới hơn trong lúc gửi — để lần flush sau xử lý (tránh đệ quy
    // khi cờ `flushing` vẫn còn bật).
    setTimeout(() => flushSchoolMissionSave(), 0);
    return true;
  } catch (error) {
    // Giữ lại để thử lại khi có mạng. Không log ồn ào mỗi 15 giây.
    if (navigator.onLine !== false) {
      console.warn("[schoolMissionSync] Chưa gửi được, sẽ thử lại:", error?.message || error);
    }
    return false;
  } finally {
    flushing = false;
  }
}

/** Ghi state mới vào hàng đợi rồi thử gửi ngay. */
export function queueSchoolMissionSave(payload) {
  if (!payload || typeof payload !== "object" || payload.gameState === undefined) {
    return Promise.resolve(false);
  }

  const previous = readPending() || {};
  writePending({
    ...previous,
    ...payload,
    gameName: payload.gameName || "Trường Vui Vẻ",
    queuedAt: Date.now(),
  });

  return flushSchoolMissionSave();
}

/**
 * Gắn listener toàn app (một lần). Nhờ vậy người chơi rời trang game khi đang
 * offline rồi có wifi trở lại ở trang khác thì bản chờ vẫn được gửi lên.
 */
function ensureAutoSync() {
  if (autoStarted || typeof window === "undefined") return;
  autoStarted = true;

  window.addEventListener("online", () => flushSchoolMissionSave());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) flushSchoolMissionSave();
  });
  setInterval(() => flushSchoolMissionSave(), AUTO_FLUSH_MS);
}

/** Gọi khi mở trang game: gửi bản còn chờ + tự thử lại khi mạng trở lại. */
export function startSchoolMissionSync() {
  ensureAutoSync();
  flushSchoolMissionSave();
}

ensureAutoSync();
