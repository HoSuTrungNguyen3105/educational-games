// lib/petApi.js
//
// Thú cưng: đồng bộ với API, fallback về localStorage khi chưa đăng nhập / mất mạng.
//
//   server : GET/PUT /api/pet, POST /api/pet/exp|mood|reset  (nguồn sự thật)
//   client : localStorage `edu_pet_v2` — cache để mở app tức thì, và chỗ lưu
//            khi offline / khách chưa đăng nhập.
//
// Mọi thay đổi diện mạo đều đi qua updateLook() → gọi API trước (nếu có token)
// rồi mới cập nhật state, nên server luôn là nơi quyết định.

import { useSyncExternalStore } from "react";
import { API_BASE } from "../services/api.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";

const KEY = "edu_pet_v2";
const OUTFIT_SLOTS = ["hat", "scarf", "glasses", "shirt", "bow", "cape", "backpack"];

const emptyOutfits = () => Object.fromEntries(OUTFIT_SLOTS.map((s) => [s, null]));

/** Giống hệt server/src/services/petService.js buildDefault() */
export const PET_DEFAULT = {
  species: "dog",
  name: "Bồng",
  color: "cream",
  outfits: emptyOutfits(),
  level: 1,
  exp: 0,
  expNeeded: 200,
  mood: "happy",
  bonded: 10,
  totalCorrect: 0,
  totalWrong: 0,
};

/** Catalog dự phòng khi API chưa trả về (chặn mạng, server lỗi). */
export const CATALOG_FALLBACK = {
  species: [
    { id: "dog", name: "Chó", emoji: "🐶", minLevel: 1, trait: "Nhanh nhẹn · Trung thành", desc: "Bạn đồng hành trung thành." },
    { id: "cat", name: "Mèo", emoji: "🐱", minLevel: 1, trait: "Nhanh nhẹn · Độc lập", desc: "Kiêu ngạo nhưng mê ngủ." },
    { id: "bird", name: "Chim", emoji: "🐦", minLevel: 4, trait: "Giọng hát · Sức bật", desc: "Hót hay, thích được khen." },
    { id: "fish", name: "Cá", emoji: "🐟", minLevel: 6, trait: "Bình tĩnh · Kiên nhẫn", desc: "Luôn bình tĩnh." },
    { id: "monkey", name: "Khỉ", emoji: "🐵", minLevel: 8, trait: "Nghịch ngợm · Tò mò", desc: "Tò mò, thích bắt chước." },
  ],
  colors: [
    { id: "cream", name: "Kem", body: "#F4AF66" }, { id: "brown", name: "Nâu", body: "#A9714B" },
    { id: "black", name: "Đen", body: "#4A4A55" }, { id: "white", name: "Trắng", body: "#F5F5F7" },
    { id: "orange", name: "Cam", body: "#F08A3C" }, { id: "gray", name: "Xám", body: "#9AA3B2" },
    { id: "pink", name: "Hồng", body: "#F49BC1" }, { id: "yellow", name: "Vàng", body: "#F7C948" },
    { id: "mint", name: "Xanh mint", body: "#6FCF97" }, { id: "sky", name: "Xanh", body: "#5AA9E6" },
  ],
  moods: {
    happy: { label: "Đang vui", emoji: "💛" }, excited: { label: "Rất hào hứng", emoji: "🎉" },
    hungry: { label: "Đói rồi", emoji: "🍽️" }, sleepy: { label: "Muốn ngủ", emoji: "😴" },
    sad: { label: "Buồn", emoji: "💙" },
  },
};

const MOOD_LABELS = {
  happy: "Đang vui", excited: "Rất hào hứng", hungry: "Đói rồi",
  sleepy: "Muốn ngủ", sad: "Buồn",
};
export const PET_MOODS = CATALOG_FALLBACK.moods;

const PET_TIPS = [
  "Cùng nhau khám phá thế giới tri thức nhé!",
  "Trả lời đúng đi, tôi hâm mộ bạn lắm!",
  "Mỗi câu đúng là một chiếc lá mới~",
  "Bạn học chăm quá đi!",
  "Nghỉ giải lao chút đi mà 🐾",
];

// ── State ───────────────────────────────────────────────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* ignore */ }
  return { ...PET_DEFAULT, outfits: emptyOutfits() };
}

function normalize(p) {
  return {
    ...PET_DEFAULT,
    ...p,
    outfits: { ...emptyOutfits(), ...(p?.outfits || {}) },
    level: Number(p?.level) || 1,
    exp: Number(p?.exp) || 0,
    expNeeded: Number(p?.expNeeded) || PET_DEFAULT.expNeeded,
  };
}

let state = typeof localStorage !== "undefined" ? readCache() : { ...PET_DEFAULT };
let catalog = CATALOG_FALLBACK;
const listeners = new Set();

function emit() { for (const fn of listeners) fn(state); }

function cache() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function setState(next) {
  state = normalize(next);
  cache();
  emit();
  return state;
}

// ── HTTP ────────────────────────────────────────────────────────────────────

function authHeader() {
  const { token } = useUserAuthStore.getState?.() || {};
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function call(path, options = {}) {
  // API_BASE đã chứa sẵn hậu tố /api (xem services/api.js)
  const res = await fetch(`${API_BASE}/pet${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.msg || json?.message || `HTTP ${res.status}`);
  return json?.data ?? json;
}

// ── API công khai ───────────────────────────────────────────────────────────

export function getPet() { return state; }
export function getCatalog() { return catalog; }
export function subscribePet(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** Hook đọc pet, tự re-render khi pet đổi. */
export function usePet() {
  return useSyncExternalStore(subscribePet, getPet, getPet);
}

/** Lời ngẫu nhiên của pet, đổi theo tâm tính. */
export function randomPetTip() {
  if (state.mood === "sad") return "Tội nghiệp tôi… trả lời đúng vài câu đi đó!";
  return PET_TIPS[Math.floor(Math.random() * PET_TIPS.length)];
}

export function moodLabel(mood = state.mood) {
  return CATALOG_FALLBACK.moods[mood]?.label || MOOD_LABELS[mood] || "Đang vui";
}

/**
 * Nạp pet + danh mục từ server.
 * - Có token  → gọi API; nếu lỗi thì giữ cache, không ném ra ngoài.
 * - Chưa đăng nhập → chỉ lấy catalog công khai.
 */
export async function loadPet() {
  try {
    catalog = { ...CATALOG_FALLBACK, ...(await call("/catalog")) };
  } catch { /* giữ catalog dự phòng */ }

  try {
    const remote = await call("/");
    if (remote) setState(remote);
  } catch {
    // Chưa đăng nhập hoặc offline → dùng cache. Chỉ báo khi có token
    // mà vẫn lỗi thì mới là sự cố thật.
    if (useUserAuthStore.getState?.()?.token) console.warn("[pet] không tải được pet từ API, dùng cache");
  }
  return state;
}

/**
 * Đổi diện mạo. Gọi server trước; nếu server từ chối (chưa mở khoá / sai dữ liệu)
 * thì trả về lỗi và KHÔNG đổi state, để UI không hiển thị sai.
 *
 * @param {object} patch { species?, color?, outfits?, name? }
 */
export async function updateLook(patch) {
  const isLookOnly = patch.species != null || patch.color != null || patch.outfits != null;

  try {
    const remote = await call("/", { method: "PUT", body: JSON.stringify(patch) });
    if (remote) setState(remote);
    return { ok: true, pet: state };
  } catch (e) {
    // Offline hoặc chưa đăng nhập: vẫn cho sửa trên máy, sẽ gửi lên sau
    if (!useUserAuthStore.getState?.()?.token) {
      if (isLookOnly) {
        const sp = catalog.species.find((s) => s.id === (patch.species ?? state.species));
        const col = catalog.colors.find((c) => c.id === (patch.color ?? state.color));
        if (!sp || !col) return { ok: false, error: "Loài hoặc màu không hợp lệ" };
      }
      setState({ ...state, ...patch, outfits: { ...state.outfits, ...(patch.outfits || {}) } });
      return { ok: true, pet: state, local: true };
    }
    return { ok: false, error: e.message };
  }
}

/** Cộng EXP sau mỗi câu trả lời đúng. */
export async function addPetExp(amount = 5, stats = {}) {
  try {
    const res = await call("/exp", { method: "POST", body: JSON.stringify({ amount, ...stats }) });
    if (res?.pet) setState(res.pet);
    return { levelUp: !!res?.levelUp, levelsGained: res?.levelsGained || [], pet: state };
  } catch {
    // Offline: tự tăng trên máy để không mất cảm giác tiến bộ
    const pet = bumpLocal(amount);
    return { levelUp: pet.__levelUp, pet: state };
  }
}

function bumpLocal(amount) {
  let { exp, level, expNeeded } = state;
  let gained = [];
  exp += Math.max(0, amount);
  while (exp >= expNeeded && level < 99) {
    exp -= expNeeded;
    level += 1;
    expNeeded = Math.round(200 * Math.pow(1.18, level - 1));
    gained.push(level);
  }
  setState({ ...state, exp, level, expNeeded, mood: gained.length ? "excited" : "happy" });
  return { __levelUp: gained.length > 0 };
}

export async function setPetMood(mood) {
  if (!CATALOG_FALLBACK.moods[mood]) return state;
  try {
    const remote = await call("/mood", { method: "POST", body: JSON.stringify({ mood }) });
    if (remote) setState(remote); else setState({ ...state, mood });
  } catch {
    setState({ ...state, mood });
  }
  return state;
}

export async function resetPet() {
  try {
    const remote = await call("/reset", { method: "POST" });
    if (remote) setState(remote);
  } catch {
    setState({ ...state, species: PET_DEFAULT.species, color: PET_DEFAULT.color, outfits: emptyOutfits() });
  }
  return state;
}

/** Danh sách loài / trang phục đã mở khoá theo cấp hiện tại. */
export function unlockedFor(pet = state) {
  const lv = Math.max(1, pet.level || 1);
  return {
    species: (catalog.species || []).filter((s) => s.minLevel <= lv),
    colors: catalog.colors || [],
    outfits: (catalog.outfits || []).filter((o) => o.minLevel <= lv),
  };
}

export { emptyOutfits, OUTFIT_SLOTS };
