/**
 * dressUpAvatar.js — cầu nối giữa React và data SVG dùng chung của 2 game
 * tạo avatar ("Tiệm thời trang cho Bé" và "Tiệm thay đồ thú cưng").
 *
 * Data SVG nằm ở `src/games/_shared/lib/dressUpAvatarData.js`, vốn là script thuần để
 * `injectDressUpAvatar.js` nạp bằng `?raw` rồi tiêm vào HTML game. Ở đây ta
 * nạp đúng file đó và chạy một lần trong một scope riêng → không nhân bản SVG,
 * không phải deploy lại app khi thêm item mới, và profile hiện đúng bộ đồ mà
 * người chơi đang mặc trong game.
 *
 * API:
 *   getDressUp()                     → EG_DRESSUP (renderPet / renderKid / …)
 *   renderDressUpSvg(kind, state)    → chuỗi <svg>
 *   describeOutfit(kind, state)      → ["Tóc", "Váy", "Mũ"] (phần đang mặc)
 *   resolveOutfit(serverAvatar, serverPet) → { avatar, pet } đã chọn nguồn
 *   outfitKey(scope)                 → key localStorage (khớp EG_OUTFIT)
 *   currentOwner()                   → id đang đăng nhập ("" = khách); bộ đồ cache
 *                                      của tài khoản khác bị bỏ qua khi vẽ.
 */

import dragonSource from "../games/_shared/lib/dressUpDragon.js?raw";
import rawSource from "../games/_shared/lib/dressUpAvatarData.js?raw";
import { useUserAuthStore } from "../stores/userAuth.store.js";

const SCOPE_AVATAR = "avatar";
const SCOPE_PET = "pet";

let _api = null;

/** Chạy script data một lần rồi trả về API của nó. */
export function getDressUp() {
  if (_api) return _api;
  if (typeof window !== "undefined" && window.EG_DRESSUP) {
    _api = window.EG_DRESSUP;
    return _api;
  }
  // Script tự gán vào `window` (nếu có) else `globalThis` — truyền cả hai vào
  // scope mới để không đụng global thật của trang.
  const scope = {};
  const run = new Function(
    "window",
    "globalThis",
    `${dragonSource}\n${rawSource}\n;return (typeof window !== "undefined" && window.EG_DRESSUP) || globalThis.EG_DRESSUP;`
  );
  _api = run(scope, scope);
  return _api;
}

/* ── localStorage: cùng key với EG_OUTFIT trong game ───────────────────── */

export function outfitKey(scope) {
  return `eg-outfit-${scope}-v1`;
}

/**
 * Chủ nhân của bộ đồ đang cache trên máy.
 *
 * Cache này vốn KHÔNG phân biệt tài khoản: đăng xuất rồi đăng nhập bằng hồ sơ
 * khác thì `pickScope()` vẫn thấy bản cache "mới hơn" hồ sơ trên server (hoặc
 * hồ sơ mới chưa có gì) → vẽ đúng avatar của người dùng trước. Gắn `owner` là
 * id người đang đăng nhập ("": khách chưa đăng nhập) để bộ đồ của A không bao
 * giờ hiển thị ở tài khoản B.
 */
export function currentOwner() {
  try {
    const id = useUserAuthStore.getState?.()?.user?.id;
    return id == null ? "" : String(id);
  } catch {
    return "";
  }
}

export function sanitizeFor(scope, value) {
  const api = getDressUp();
  try {
    return scope === SCOPE_PET ? api.sanitizePet(value) : api.sanitizeKid(value);
  } catch {
    return null;
  }
}

function defaultsFor(scope) {
  const api = getDressUp();
  return scope === SCOPE_PET ? api.pet.defaults : api.kid.defaults;
}

export function readLocalOutfit(scope, uid = currentOwner()) {
  try {
    const box = JSON.parse(localStorage.getItem(outfitKey(scope)) || "null");
    const value = sanitizeFor(scope, box?.value);
    if (!value) return null;
    const owner = box.owner == null ? "" : String(box.owner);
    if (owner && owner !== uid) return null;
    return { value, updatedAt: box.updatedAt || null, owner };
  } catch {
    return null;
  }
}

export function writeLocalOutfit(scope, value, updatedAt, uid = currentOwner()) {
  const clean = sanitizeFor(scope, value);
  if (!clean) return null;
  try {
    localStorage.setItem(
      outfitKey(scope),
      JSON.stringify({ v: 1, value: clean, updatedAt: updatedAt || null, owner: uid || "" })
    );
  } catch { /* localStorage bị chặn — bỏ qua */ }
  return clean;
}

/** Nhận bộ đồdo khách để lại trên máy làm của mình (không ai khác dùng được nữa). */
function claimLocalOutfit(scope, uid) {
  try {
    const box = JSON.parse(localStorage.getItem(outfitKey(scope)) || "null");
    if (!box || (box.owner == null ? "" : String(box.owner)) !== "") return;
    localStorage.setItem(outfitKey(scope), JSON.stringify({ ...box, owner: uid }));
  } catch { /* ignore */ }
}

/* ── render ────────────────────────────────────────────────────────────── */

const STYLE_ID = "eg-dressup-svg-css";

/** SVG từ EG_DRESSUP không có width/height → cần CSS cho nó phủ đúng khung
 *  (`.eg-du`) ở cả avatar nhỏ lẫn sân khấu full-screen của modal tuỳ chỉnh. */
export function ensureDressUpCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = ".eg-du svg{width:100%;height:100%;display:block}";
  document.head.appendChild(style);
}

export const KID_VIEW_ASPECT = 700 / 512;
export const PET_VIEW_ASPECT = 200 / 200;

/** @param {"avatar"|"pet"} kind */
export function renderDressUpSvg(kind, state) {
  const api = getDressUp();
  const clean = sanitizeFor(kind, state) ?? sanitizeFor(kind, defaultsFor(kind));
  if (!clean) return "";
  // renderPet nhận (animalKey, state) — truyền nhầm object vào animalKey sẽ
  // khiến nó luôn rơi về loài mặc định.
  return kind === SCOPE_PET ? api.renderPet(clean.animal, clean) : api.renderKid(clean);
}

export function outfitAspect(kind) {
  return kind === SCOPE_PET ? PET_VIEW_ASPECT : KID_VIEW_ASPECT;
}

/** Nhãn tiếng Việt của item, tra trong registry `EG_DRESSUP.kid`. */
const KID_LABELS = {
  body: "bodies", face: "faces", hair: "hairs", hat: "hats",
  glasses: "glasses", acc: "accs", pants: "pants", shoes: "shoes",
  shirt: "shirtColors", dress: "dressColors", hairColor: "hairColors", skin: "skinTones",
};

export function itemLabel(kind, field, id) {
  if (!id) return "Không dùng";
  const api = getDressUp();
  if (kind === SCOPE_PET) {
    const animals = api.pet.animals;
    if (field === "animal") return animals[id]?.n || id;
    return id.charAt(0).toUpperCase() + id.slice(1);
  }
  const map = api.kid[KID_LABELS[field]];
  const item = map?.[id];
  if (!item) return id;
  if (typeof item === "string") return item.charAt(0).toUpperCase() + item.slice(1);
  return item.n || id;
}

/** Tên hiển thị: "Bé gái" / "Cáo con". */
export function outfitName(kind, state) {
  const api = getDressUp();
  const clean = sanitizeFor(kind, state);
  if (!clean) return "";
  if (kind === SCOPE_PET) return api.pet.animals[clean.animal]?.n || "";
  return api.kid.bodies[clean.body]?.n || "";
}

/** Các món đang mặc, dùng làm dòng mô tả nhỏ dưới tên. */
export function describeOutfit(kind, state) {
  const clean = sanitizeFor(kind, state);
  if (!clean) return [];
  if (kind === SCOPE_PET) {
    return [
      clean.shirt && "Áo",
      clean.glasses && "Kính",
      clean.hat && "Mũ",
      clean.neck && "Khăn",
    ].filter(Boolean);
  }
  const human = api_overlays(clean);
  if (!human) return [];
  return [
    clean.face && itemLabel(kind, "face", clean.face),
    clean.hair && itemLabel(kind, "hair", clean.hair),
    clean.dress ? "Váy" : clean.shirt && itemLabel(kind, "shirt", clean.shirt),
    !clean.dress && clean.pants && itemLabel(kind, "pants", clean.pants),
    clean.shoes && itemLabel(kind, "shoes", clean.shoes),
    clean.glasses && itemLabel(kind, "glasses", clean.glasses),
    clean.hat && itemLabel(kind, "hat", clean.hat),
    clean.acc && itemLabel(kind, "acc", clean.acc),
  ].filter(Boolean);
}

function api_overlays(clean) {
  const api = getDressUp();
  return api.kid.bodies[clean.body]?.overlays !== false;
}

/**
 * Chọn bộ đồ nào để hiển thị: ưu tiên bản mới hơn giữa hồ sơ server và cache
 * trên máy. Quy tắc này giống hệt EG_OUTFIT trong game nên profile và game
 * luôn khớp nhau.
 *
 * @returns {{ avatar: { value: object, updatedAt: string|null }, pet: { value: object, updatedAt: string|null } }}
 */
export function resolveOutfit(serverAvatar, serverPet) {
  return {
    avatar: pickScope(SCOPE_AVATAR, serverAvatar),
    pet: pickScope(SCOPE_PET, serverPet),
  };
}

function pickScope(scope, server) {
  const uid = currentOwner();
  const fallback = { value: sanitizeFor(scope, defaultsFor(scope)), updatedAt: null };
  const local = readLocalOutfit(scope, uid);
  const serverValue = server && typeof server === "object" ? sanitizeFor(scope, server) : null;
  const remote = serverValue ? { value: serverValue, updatedAt: server.updatedAt || null } : null;

  if (!local) return remote || fallback;
  // Khách tự chọn bộ đồ trên máy rồi mới đăng nhập: bộ đó thành của tài khoản
  // này, các tài khoản khác đăng nhập sau không dùng chung được nữa.
  if (!local.owner && uid) claimLocalOutfit(scope, uid);
  if (!remote) return local;
  const localTs = Date.parse(local.updatedAt || "") || 0;
  const remoteTs = Date.parse(remote.updatedAt || "") || 0;
  return remoteTs >= localTs ? remote : local;
}