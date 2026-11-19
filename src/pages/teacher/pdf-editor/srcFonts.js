/**
 * srcFonts.js — đọc và TÁI DÙNG font nhúng sẵn trong PDF gốc.
 *
 * Khi "Sửa chữ", chữ thay thế phải giữ đúng định dạng dòng cũ (nét chữ, độ đậm,
 * nghiêng). Cách chắc chắn nhất là dùng lại CHÍNH font đã nhúng trong file:
 *   • pdf.js (fontExtraProperties: true) giữ lại bytes font trong commonObjs;
 *   • fontkit đọc tên thật (postscriptName) → nhận diện đậm/nghiêng/họ font và
 *     kiểm tra bộ ký tự (font nhúng dạng subset có thể thiếu chữ mới gõ);
 *   • FontFace đăng ký bytes đó cho màn hình — nét chữ giống hệt trang gốc;
 *   • xuất file: pdf-lib nhúng lại đúng bytes này (xem exportPdf.js).
 *
 * Font gốc không dùng được (không nhúng / thiếu ký tự / người dùng đổi font,
 * đổi kiểu chữ) → resolveTextFace trả bộ DejaVu gần nhất thay thế.
 */
import fontkit from "@pdf-lib/fontkit";
import { familyById } from "./fonts.js";

let faceSeq = 0;

function detectStyle(name) {
  const bold = /bold|black|heavy|semibold|demibold/i.test(name);
  const italic = /italic|oblique/i.test(name);
  const family = /mono|courier|consolas/i.test(name)
    ? "mono"
    : /serif|times|georgia|garamond|cambria|book antiqua/i.test(name) && !/sans/i.test(name)
      ? "serif"
      : "sans";
  return { bold, italic, family };
}

/** Font con (subset) thường có tiền tố "ABCDEF+" — bỏ đi khi hiển thị tên. */
function cleanName(name) {
  return String(name || "").replace(/^[A-Z]{6}\+/, "");
}

/**
 * Đọc các font của trang → object { [fontName]: entry }.
 * `existing` (tuỳ chọn): registry đã có của tài liệu — tên nào đã đọc rồi thì
 * giữ nguyên, không đăng ký lại FontFace lần nữa.
 *
 * entry: { key, label, bold, italic, family, bytes, fk, cssFamily, ready }
 *   • bytes/fk/cssFamily = null/"" khi font không nhúng hoặc không nạp được —
 *     lúc đó chỉ dùng bold/italic/family để chọn font DejaVu thay thế cho đúng.
 */
export async function collectSrcFonts(pdfPage, existing = null) {
  // getOperatorList nạp font vào commonObjs (render cũng dùng lại danh sách này).
  await pdfPage.getOperatorList();
  const content = await pdfPage.getTextContent();
  const names = new Set(Object.keys(content.styles || {}));
  for (const it of content.items || []) if (it.fontName) names.add(it.fontName);

  const out = {};
  const pending = [];
  for (const key of names) {
    if (existing && existing[key]) {
      out[key] = existing[key];
      continue;
    }
    let f = null;
    try { f = pdfPage.commonObjs.get(key); } catch { /* font chưa nạp được */ }
    if (!f) continue;

    const realName = f.loadedName && !/^g_d\d+_f\d+$/.test(f.loadedName) ? f.loadedName : "";
    const guess = detectStyle(realName);
    const entry = {
      key,
      label: cleanName(realName) || "Font PDF",
      bold: guess.bold,
      italic: guess.italic,
      family: guess.family,
      bytes: null,
      fk: null,
      cssFamily: "",
      ready: Promise.resolve(),
    };

    if (f.data && f.data.length) {
      try {
        // f.data là view vào buffer chung của pdf.js — phải COPY trước khi giữ.
        const bytes = new Uint8Array(f.data);
        const fk = fontkit.create(bytes);
        const ps = fk.postscriptName || realName || key;
        const style = detectStyle(ps);
        entry.label = cleanName(ps);
        entry.bold = style.bold;
        entry.italic = style.italic;
        entry.family = style.family;
        entry.bytes = bytes;
        entry.fk = fk;

        faceSeq += 1;
        const cssFamily = `EduPdfSrc${faceSeq}`;
        // ÉP metric dòng về đúng bộ hằng số của model.js (FONT_ASCENT/DESCENT)
        // để baseline chữ trên màn hình trùng baseline lúc xuất pdf-lib.
        const descriptors = {
          weight: "400",
          style: "normal",
          ascentOverride: "92.8%",
          descentOverride: "23.6%",
          lineGapOverride: "0%",
        };
        let face;
        try {
          face = new FontFace(cssFamily, bytes.buffer, descriptors);
        } catch {
          face = new FontFace(cssFamily, bytes.buffer);
        }
        entry.ready = face
          .load()
          .then((loaded) => {
            document.fonts.add(loaded);
            entry.cssFamily = cssFamily;
          })
          .catch(() => {
            // Trình duyệt từ chối font (OTS…) → vẫn giữ nhận diện đậm/nghiêng,
            // chữ thay thế sẽ dùng DejaVu tương ứng.
            entry.bytes = null;
            entry.fk = null;
            entry.cssFamily = "";
          });
        pending.push(entry.ready);
      } catch {
        /* không parse được → giữ nhận diện theo tên, dùng font thay thế */
      }
    }
    out[key] = entry;
  }
  await Promise.all(pending);
  return out;
}

/** Font gốc (subset) có đủ glyph cho nội dung mới không? */
export function srcFontCovers(entry, text) {
  if (!entry?.fk) return false;
  for (const ch of String(text ?? "")) {
    if (/\s/.test(ch)) continue;
    if (!entry.fk.hasGlyphForCodePoint(ch.codePointAt(0))) return false;
  }
  return true;
}

/**
 * Chọn mặt font THẬT SỰ dùng cho một đối tượng văn bản (màn hình + xuất file):
 *   • font gốc nhúng — khi đối tượng còn giữ srcFontKey, chưa bị đổi font/kiểu
 *     chữ và font gốc đủ ký tự cho nội dung hiện tại;
 *   • DejaVu thay thế — các trường hợp còn lại (đúng họ font + đậm/nghiêng).
 *
 * Trả về { embedded, cssFamily, bold, italic, weight, style, familyId } —
 * bold/italic ở đây là cờ đưa vào canvas/font CSS (font gốc đã đậm sẵn nên
 * không xin trình duyệt tô đậm giả nữa).
 */
export function resolveTextFace(obj, srcFonts) {
  const entry =
    obj?.srcFontKey && obj.useSrcFont !== false ? srcFonts?.[obj.srcFontKey] : null;
  if (
    entry &&
    entry.bytes &&
    entry.cssFamily &&
    Boolean(obj.bold) === entry.bold &&
    Boolean(obj.italic) === entry.italic &&
    srcFontCovers(entry, obj.text)
  ) {
    return {
      embedded: entry,
      cssFamily: entry.cssFamily,
      bold: false,
      italic: false,
      weight: 400,
      style: "normal",
      familyId: obj.fontFamily || entry.family,
    };
  }
  const family = familyById(obj?.fontFamily);
  return {
    embedded: null,
    cssFamily: family.cssFamily,
    bold: Boolean(obj?.bold),
    italic: Boolean(obj?.italic),
    weight: obj?.bold ? 700 : 400,
    style: obj?.italic ? "italic" : "normal",
    familyId: family.id,
  };
}

/** Đối tượng đang MUỐN dùng font gốc (kể cả khi tạm rơi về font thay thế). */
export function wantsSrcFont(obj, srcFonts) {
  return Boolean(
    obj?.srcFontKey && obj.useSrcFont !== false && srcFonts?.[obj.srcFontKey]?.bytes,
  );
}