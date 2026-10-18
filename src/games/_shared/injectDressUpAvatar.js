/**
 * injectDressUpAvatar.js — tiêm data SVG + lớp lưu trữ vào 2 game tạo avatar.
 *
 *   • "Tiệm thời trang cho Bé"  → dùng EG_DRESSUP.renderKid()
 *   • "Tiệm thay đồ thú cưng"   → dùng EG_DRESSUP.renderPet()
 *
 * Hai file đó KHÔNG chứa SVG nữa. Chúng chỉ giữ UI + logic chọn đồ, còn toàn bộ
 * SVG và các helper render nằm ở `lib/dressUpAvatarData.js`. File data nạp bằng
 * `?raw` rồi chèn nguyên văn vào <head> → không bị bundler đổi tên biến, không
 * cần `eval`, không cần deploy lại mỗi lần thêm item mới.
 *
 * Chỉ những HTML có chứa marker `EG_DRESSUP_HOST` mới được tiêm — các game khác
 * trong `src/games/` không bị ảnh hưởng.
 *
 * Dùng trong game HTML (sau khi đã tiêm):
 *   const D   = window.EG_DRESSUP;
 *   const out = window.EG_OUTFIT;
 *   stage.innerHTML = D.renderPet(out.get('pet')?.value || D.pet.defaults);
 */

import dragonSrc from "./lib/dressUpDragon.js?raw";
import avatarDataSrc from "./lib/dressUpAvatarData.js?raw";
import outfitBridgeSrc from "./lib/dressUpBridge.js?raw";

/** Marker đặt trong <head> của 2 game muốn dùng avatar dùng chung. */
export const DRESSUP_HOST_MARKER = "EG_DRESSUP_HOST";

export const DRESSUP_START = "<!-- EG_DRESSUP_START -->";
export const DRESSUP_END = "<!-- EG_DRESSUP_END -->";

function buildBlock() {
  return [
    DRESSUP_START,
    "<script>",
    "/* --- thân rồng (từ src/games/_shared/lib/dressUpDragon.js) --- */",
    dragonSrc.trim(),
    "/* --- dữ liệu SVG dùng chung (inject từ src/games/_shared/lib/dressUpAvatarData.js) --- */",
    avatarDataSrc.trim(),
    "/* --- lớp lưu trữ client + đồng bộ hồ sơ (inject từ src/games/_shared/lib/dressUpBridge.js) --- */",
    outfitBridgeSrc.trim(),
    "</" + "script>",
    DRESSUP_END,
  ].join("\n");
}

/** Gỡ block đã tiêm (dùng khi muốn xuất lại HTML gốc để soạn thảo). */
export function stripDressUpAvatar(html) {
  if (!html || typeof html !== "string") return html;
  const start = html.indexOf(DRESSUP_START);
  const end = html.indexOf(DRESSUP_END);
  if (start === -1 || end === -1 || end < start) return html;
  return html.slice(0, start) + html.slice(end + DRESSUP_END.length);
}

/**
 * Tiêm data avatar + bridge vào HTML game.
 * @param {string} html
 * @returns {string}
 */
export function injectDressUpAvatar(html) {
  if (!html || typeof html !== "string") return html;
  if (!html.includes(DRESSUP_HOST_MARKER)) return html;

  const base = stripDressUpAvatar(html);
  const block = buildBlock();

  const headMatch = base.match(/<head[^>]*>/i);
  if (headMatch) {
    const at = headMatch.index + headMatch[0].length;
    return base.slice(0, at) + "\n" + block + "\n" + base.slice(at);
  }
  return block + "\n" + base;
}