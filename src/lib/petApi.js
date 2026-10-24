// lib/petApi.js
//
// Thú cưng: đồng bộ với API, fallback về localStorage khi chưa đăng nhập / mất mạng.
//
//   server : GET/PUT /api/pet, POST /api/pet/exp|mood|reset  (cấp / EXP / tâm tính)
//   client : localStorage `edu_pet_v2` — cache để mở app tức thì, và chỗ lưu
//            khi offline / khách chưa đăng nhập.
//
// HAI NGUỒN DỮ LIỆU, MỘT NGUỒN HIỂN THỊ.
//   `species` / `color` / `outfits` là phần "nurture" cũ trong `userPets`, vẫn
//   về từ API cho trang quản lý danh mục. Cái mà app VẼ là `look` — bộ đồ
//   DressUp (animal + shirt/glasses/hat/neck) mà trang Profile và game
//   "Tiệm thay đồ thú cưng" lưu vào hồ sơ. Trước đây hai bên không biết nhau nên
//   sửa pet trong Profile xong ra home vẫn thấy con chó mặc định.
//
//   • GET /api/pet trả kèm `look` (đọc từ `users.pet`) → lưu vào `lookRemote`.
//   • `look` = bản chọn ra từ `lookRemote` và cache máy `eg-outfit-pet-v1`, theo
//     đúng `resolveOutfit()` của trang Profile → hai nơi không thể hiện khác nhau.
//   • Đổi diện mạo: saveLook() → PUT /api/auth/me { pet } + cache máy.
//   • Đổi tên / loài legacy: updateLook() → PUT /api/pet.

import { useSyncExternalStore } from "react";
import { API_BASE, userService } from "../services/api.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import { resolveOutfit, sanitizeFor, writeLocalOutfit } from "./dressUpAvatar.js";

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
  // `lookRemote`: hồ sơ server trả về; `look`: bản đang hiển thị (null = chưa
  // chọn gì, chỗ vẽ tự rơi về bộ mặc định của EG_DRESSUP).
  lookRemote: null,
  look: null,
};

/** Catalog dự phòng khi API chưa trả về (chặn mạng, server lỗi). */
export const CATALOG_FALLBACK = {
  species: [
    { id: "dog", name: "Chó", emoji: "🐶", art: "svg", minLevel: 1, trait: "Nhanh nhẹn · Trung thành", desc: "Bạn đồng hành trung thành." },
    { id: "cat", name: "Mèo", emoji: "🐱", art: null, minLevel: 1, trait: "Nhanh nhẹn · Độc lập", desc: "Kiêu ngạo nhưng mê ngủ." },
    { id: "bird", name: "Chim", emoji: "🐦", art: null, minLevel: 4, trait: "Giọng hát · Sức bật", desc: "Hót hay, thích được khen." },
    { id: "fish", name: "Cá", emoji: "🐟", art: null, minLevel: 6, trait: "Bình tĩnh · Kiên nhẫn", desc: "Luôn bình tĩnh." },
    { id: "monkey", name: "Khỉ", emoji: "🐵", art: null, minLevel: 8, trait: "Nghịch ngợm · Tò mò", desc: "Tò mò, thích bắt chước." },
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
  // Danh mục trang phục dự phòng — khớp id trong data/petAssets.js.
  // Chỉ gồm món có SVG thật; `minLevel` vẫn áp dụng để khách không "mở khoá" hết.
  outfits: [
    { id: "hat-cap",            slot: "hat",      name: "Mũ lưỡi trai",      minLevel: 1 },
    { id: "backpack_adventure_01", slot: "backpack", name: "Ba lô phiêu lưu", minLevel: 3 },
    { id: "bow_pink_01",         slot: "bow",      name: "Nơ hồng",           minLevel: 4 },
    { id: "scarf_red_01",        slot: "scarf",    name: "Khăn quàng đỏ",    minLevel: 5 },
    { id: "glasses_round_01",    slot: "glasses",  name: "Kính tròn",         minLevel: 6 },
    { id: "shirt_student_01",    slot: "shirt",    name: "Áo học sinh",       minLevel: 7 },
    { id: "hat_crown_01",        slot: "hat",      name: "Vương miện",        minLevel: 8 },
    { id: "hat_wizard_01",       slot: "hat",      name: "Mũ phù thủy",       minLevel: 10 },
    { id: "cape_hero_01",        slot: "cape",     name: "Áo choàng anh hùng", minLevel: 11 },
  ],
  slots: OUTFIT_SLOTS,
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

/**
 * Chọn bản diện mạo để hiển thị: hồ sơ server hay cache máy — bản mới hơn thắng.
 * Dùng luôn `resolveOutfit()` của trang Profile nên hai màn hình không thể hiện
 * hai con thú khác nhau được nữa.
 */
function resolveLook(remote) {
  try {
    return resolveOutfit(null, remote).pet.value;
  } catch {
    // Chưa nạp được data SVG → để null, chỗ vẽ tự về bộ mặc định.
    return null;
  }
}

/**
 * @param {object} p      payload mới (response API hoặc state đang có)
 * @param {object} [prev] state trước — `look` không đổi ở các response không có
 *                        trường này (PUT tên, exp, mood) nên phải giữ bản cũ.
 */
function normalize(p, prev) {
  const raw = p || {};
  const hasRemote = Object.prototype.hasOwnProperty.call(raw, "lookRemote");
  const hasLook = Object.prototype.hasOwnProperty.call(raw, "look");
  const lookRemote =
    hasRemote ? raw.lookRemote : hasLook ? raw.look : (prev?.lookRemote ?? null) || null;
  return {
    ...PET_DEFAULT,
    ...raw,
    outfits: { ...emptyOutfits(), ...(raw.outfits || {}) },
    level: Number(raw.level) || 1,
    exp: Number(raw.exp) || 0,
    expNeeded: Number(raw.expNeeded) || PET_DEFAULT.expNeeded,
    lookRemote,
    look: resolveLook(lookRemote),
  };
}

let state = typeof localStorage !== "undefined" ? readCache() : { ...PET_DEFAULT };
// Danh mục nằm sẵn trong file này — không gọi API.
const listeners = new Set();

function emit() { for (const fn of listeners) fn(state); }

function cache() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function setState(next) {
  state = normalize(next, state);
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
export function getCatalog() { return CATALOG_FALLBACK; }
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
 * Nạp pet từ server.
 *
 * Danh mục (loài / màu / trang phục) KHÔNG gọi API nữa — luôn dùng
 * `CATALOG_FALLBACK` ngay trong file này. Chỉ còn `GET /api/pet/` cho phần
 * "diện mạo của bé" lưu trên server.
 */
export async function loadPet() {
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
 * Đổi tên / loài legacy / màu / trang phục legacy — phần `userPets` trên server.
 * Gọi server trước; nếu server từ chối (chưa mở khoá / sai dữ liệu) thì trả về
 * lỗi và KHÔNG đổi state, để UI không hiển thị sai.
 *
 * Muốn đổi thứ mà app thực sự vẽ thì dùng saveLook().
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
        const sp = CATALOG_FALLBACK.species.find((s) => s.id === (patch.species ?? state.species));
        const col = CATALOG_FALLBACK.colors.find((c) => c.id === (patch.color ?? state.color));
        if (!sp || !col) return { ok: false, error: "Loài hoặc màu không hợp lệ" };
      }
      setState({ ...state, ...patch, outfits: { ...state.outfits, ...(patch.outfits || {}) } });
      return { ok: true, pet: state, local: true };
    }
    return { ok: false, error: e.message };
  }
}

/**
 * Đổi DIỆN MẠO hiển thị = ghi bộ đồ DressUp vào hồ sơ.
 *
 * Đi đúng đường trang Profile và game "Tiệm thay đồ thú cưng" vẫn dùng
 * (`PUT /api/auth/me { pet }`) rồi mới cập nhật state — thêm `userPets` làm nơi
 * lưu thứ hai là lại có hai con pet khác nhau như trước.
 *
 * Offline / chưa đăng nhập: vẫn ghi cache máy `eg-outfit-pet-v1` để lần mở sau
 * hiện đúng bộ đã chọn (quy tắc "bản mới hơn thắng" sẽ ưu tiên nó).
 *
 * @param {object} value { animal, shirt, glasses, hat, neck }
 */
export async function saveLook(value) {
  const clean = sanitizeFor("pet", value);
  if (!clean) return { ok: false, error: "Bộ đồ không hợp lệ" };
  const at = new Date().toISOString();
  writeLocalOutfit("pet", clean, at);

  const remote = async () => {
    const updated = await userService.updateProfile({ pet: clean });
    return { ...clean, ...(updated?.pet || {}), updatedAt: updated?.pet?.updatedAt || at };
  };

  if (!useUserAuthStore.getState?.()?.token) {
    setState({ ...state, lookRemote: { ...clean, updatedAt: at } });
    return { ok: true, pet: state, local: true };
  }
  try {
    setState({ ...state, lookRemote: await remote() });
    return { ok: true, pet: state };
  } catch (e) {
    setState({ ...state, lookRemote: { ...clean, updatedAt: at } });
    return { ok: false, error: e.message, pet: state, local: true };
  }
}

/** Bộ đồ DressUp đang hiển thị (null = chưa chọn, chỗ vẽ dùng mặc định). */
export function petLook() {
  return state.look;
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

/**
 * Danh sách loài / trang phục đã mở khoá theo cấp hiện tại.
 *
 * Server mới trả kèm `catalog.unlocked`; catalog cũ thì `outfits` đã là phần
 * đã lọc sẵn. Xử lý cả hai để không phụ thuộc vào version server đang chạy.
 */
export function unlockedFor(pet = state) {
  const lv = Math.max(1, pet.level || 1);
  const openSpecies = CATALOG_FALLBACK.unlocked?.species;
  const openOutfits = CATALOG_FALLBACK.unlocked?.outfits;
  return {
    species: openSpecies || (CATALOG_FALLBACK.species || []).filter((s) => s.minLevel <= lv),
    colors: CATALOG_FALLBACK.colors || [],
    outfits: openOutfits || (CATALOG_FALLBACK.outfits || []).filter((o) => o.minLevel <= lv),
  };
}

/**
 * Catalog server giờ trả kèm `unlocked` (đã lọc theo cấp) bên cạnh danh mục
 * đầy đủ. Hàm này chuẩn hoá về một shape để PetPage không phải biết chi tiết
 * server trả gì — catalog cũ (chỉ có phần đã lọc) vẫn chạy được.
 */
export function catalogView() {
  const full = CATALOG_FALLBACK.outfits || [];
  const open = CATALOG_FALLBACK.unlocked?.outfits || full;
  return {
    species: CATALOG_FALLBACK.species || [],
    colors: CATALOG_FALLBACK.colors || [],
    outfits: full,
    moods: CATALOG_FALLBACK.moods,
    slots: CATALOG_FALLBACK.slots || OUTFIT_SLOTS,
    openSpeciesIds: new Set((CATALOG_FALLBACK.unlocked?.species || CATALOG_FALLBACK.species || []).map((s) => s.id)),
    openOutfitIds: new Set(open.map((o) => o.id)),
  };
}

export { emptyOutfits, OUTFIT_SLOTS };
