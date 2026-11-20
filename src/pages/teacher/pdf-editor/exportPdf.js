/**
 * exportPdf.js — dựng file PDF mới bằng pdf-lib rồi cho tải về.
 *
 * Nguyên tắc (yêu cầu §3.4, §5):
 *   • KHÔNG đụng file gốc — luôn tạo một PDF mới từ `originalBytes`;
 *   • giữ đúng kích thước trang, thứ tự trang, góc xoay và chất lượng ảnh;
 *   • kiểm tra lại file xuất (mở lại được + đúng số trang) trước khi báo thành công;
 *   • mọi lỗi đều nêu rõ nguyên nhân và KHÔNG xoá phiên chỉnh sửa hiện tại.
 *
 * Giới hạn trung thực: pdf-lib không sửa được chữ gốc đã có trong PDF — công
 * cụ chỉ thêm lớp nội dung mới lên trên (xem hướng dẫn trong trang).
 * Thư viện pdf-lib và @pdf-lib/fontkit được tải động (lazy) chỉ khi cần xuất file.
 */

import { ensureFontLoaded, getFontBytes } from "./fonts.js";
import { resolveTextFace } from "./srcFonts.js";
import {
  DEFAULT_LINE_HEIGHT,
  baselineAt,
  displayToPdf,
  hexToRgb,
  textMeasure,
  wrapText,
} from "./model.js";

/** pdf-lib chỉ nhận màu tạo bằng rgb() — object {r,g,b} trần bị từ chối. */
function pdfColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgb(r, g, b);
}

/** Tên file xuất: thêm hậu tố -edited, không ghi đè file gốc. */
export function exportNameFor(fileName) {
  const base = String(fileName || "tai-lieu").replace(/\.pdf$/i, "");
  return `${base}-edited.pdf`;
}

let pdfLibModule = null;
let fontkitModule = null;

/** Tải pdf-lib và fontkit một lần (lazy). */
async function loadPdfLib() {
  if (pdfLibModule && fontkitModule) return { pdfLibModule, fontkitModule };
  const [{ default: PDFDocument, StandardFonts, degrees, rgb }, { default: fontkit }] = await Promise.all([
    import("pdf-lib"),
    import("@pdf-lib/fontkit"),
  ]);
  pdfLibModule = { PDFDocument, StandardFonts, degrees, rgb };
  fontkitModule = fontkit;
  return { pdfLibModule, fontkitModule };
}

async function embedFace(out, cache, familyId, bold, italic) {
  const key = `${familyId}|${bold ? 1 : 0}|${italic ? 1 : 0}`;
  if (cache.has(key)) return cache.get(key);
  await ensureFontLoaded(familyId, bold, italic);
  const bytes = await getFontBytes(familyId, bold, italic);
  let font;
  try {
    font = await out.embedFont(bytes, { subset: true });
  } catch {
    try {
      font = await out.embedFont(bytes);
    } catch {
      font = await out.embedFont(pdfLibModule.StandardFonts.Helvetica);
    }
  }
  cache.set(key, font);
  return font;
}

/**
 * Nhúng lại ĐÚNG font gốc đã trích từ PDF (giữ nguyên nét chữ + độ đậm).
 * Không nhúng được → trả null để caller rơi về font DejaVu thay thế.
 */
async function embedSrcFace(out, cache, entry) {
  const key = `src:${entry.key}`;
  if (cache.has(key)) return cache.get(key);
  let font = null;
  try {
    font = await out.embedFont(entry.bytes, { subset: true });
  } catch {
    try {
      font = await out.embedFont(entry.bytes);
    } catch {
      /* caller rơi về font DejaVu thay thế */
    }
  }
  if (font) cache.set(key, font);
  return font;
}

function decodeDataUrl(dataUrl) {
  const comma = String(dataUrl).indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

async function embedImage(out, cache, src) {
  if (cache.has(src)) return cache.get(src);
  const bytes = decodeDataUrl(src);
  const img = await out.embedPng(bytes);
  cache.set(src, img);
  return img;
}

async function drawObject(out, page, obj, geo, caches, srcFonts) {
  const { rot, W, H } = geo;
  const ctx = { rot, W, H };

  if (obj.type === "text") {
    let face = resolveTextFace(obj, srcFonts);
    let font = face.embedded ? await embedSrcFace(out, caches.fonts, face.embedded) : null;
    if (!font) {
      if (face.embedded) face = resolveTextFace({ ...obj, useSrcFont: false }, srcFonts);
      font = await embedFace(out, caches.fonts, face.familyId, face.bold, face.italic);
    }
    const measure = textMeasure(face.cssFamily, obj.fontSize, face.bold, face.italic);
    const lines = wrapText(obj.text, obj.w, measure);
    const lh = obj.fontSize * (obj.lineHeight || DEFAULT_LINE_HEIGHT);
    const color = pdfColor(obj.color);
    const opacity = obj.opacity ?? 1;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line) continue;
      const lineWidth = measure(line);
      let lx = obj.x;
      if (obj.align === "center") lx = obj.x + (obj.w - lineWidth) / 2;
      else if (obj.align === "right") lx = obj.x + obj.w - lineWidth;
      const p = displayToPdf(lx, baselineAt(obj, i, lh), ctx);
      page.drawText(line, {
        x: p.x,
        y: p.y,
        size: obj.fontSize,
        font,
        color,
        rotate: pdfLibModule.degrees(rot),
        opacity,
      });
    }
    return;
  }

  if (obj.type === "image") {
    const img = await embedImage(out, caches.images, obj.src);
    const p = displayToPdf(obj.x, obj.y + obj.h, ctx);
    page.drawImage(img, {
      x: p.x,
      y: p.y,
      width: obj.w,
      height: obj.h,
      rotate: pdfLibModule.degrees(rot),
      opacity: obj.opacity ?? 1,
    });
    return;
  }

  if (obj.type === "rect" || obj.type === "redact") {
    const hasStroke = obj.type === "rect" && Boolean(obj.stroke) && (obj.strokeWidth || 0) > 0;
    const bw = hasStroke ? obj.strokeWidth : 0;
    const x = obj.x + bw / 2;
    const y = obj.y + bw / 2;
    const w = obj.w - bw;
    const h = obj.h - bw;
    if (w <= 0 || h <= 0) return;
    const p1 = displayToPdf(x, y, ctx);
    const p2 = displayToPdf(x + w, y + h, ctx);
    const rx = Math.min(p1.x, p2.x);
    const ry = Math.min(p1.y, p2.y);
    const rw = Math.abs(p2.x - p1.x);
    const rh = Math.abs(p2.y - p1.y);
    const fill = obj.fill ? pdfColor(obj.fill) : undefined;
    const border = hasStroke ? pdfColor(obj.stroke) : undefined;
    page.drawRectangle({
      x: rx,
      y: ry,
      width: rw,
      height: rh,
      color: fill,
      opacity: fill ? (obj.fillOpacity ?? 1) : undefined,
      borderColor: border,
      borderWidth: bw,
      borderOpacity: border ? 1 : undefined,
    });
    return;
  }

  if (obj.type === "line") {
    const start = displayToPdf(obj.x, obj.y, ctx);
    const end = displayToPdf(obj.x2, obj.y2, ctx);
    page.drawLine({
      start,
      end,
      thickness: obj.strokeWidth || 1,
      color: pdfColor(obj.stroke),
      opacity: obj.opacity ?? 1,
    });
  }
}

/**
 * Dựng PDF đã chỉnh sửa.
 * @param {{doc: object, originalBytes: Uint8Array, srcFonts?: object}} input
 *   srcFonts: registry font gốc nhúng (collectSrcFonts) — chữ sửa giữ đúng font PDF.
 * @returns {Promise<Uint8Array>}
 */
export async function buildPdf({ doc, originalBytes, srcFonts = null }) {
  const { pdfLibModule } = await loadPdfLib();
  if (!doc || !originalBytes) throw new Error("Chưa có tài liệu để xuất.");
  if (!doc.order.length) throw new Error("Tài liệu không còn trang nào để xuất.");

  const src = await pdfLibModule.PDFDocument.load(originalBytes, { ignoreEncryption: true });
  const out = await pdfLibModule.PDFDocument.create();
  out.registerFontkit(fontkitModule);
  try {
    out.setTitle(`${String(doc.fileName || "tai-lieu").replace(/\.pdf$/i, "")} (đã chỉnh sửa)`);
    out.setProducer("EduPlay — Chỉnh sửa PDF");
    out.setCreationDate(new Date());
  } catch {
    /* metadata là tuỳ chọn — không chặn xuất file */
  }

  const copied = await out.copyPages(src, doc.order);
  const caches = { fonts: new Map(), images: new Map() };

  for (let i = 0; i < doc.order.length; i += 1) {
    const pageIndex = doc.order[i];
    const meta = doc.pages[pageIndex];
    const page = out.addPage(copied[i]);
    const rot = (((meta.rotate + (doc.deltas[pageIndex] || 0)) % 360) + 360) % 360;
    page.setRotation(pdfLibModule.degrees(rot));

    const objects = doc.objects.filter((o) => o.page === pageIndex);
    for (const obj of objects) {
      await drawObject(out, page, obj, { rot, W: meta.width, H: meta.height }, caches, srcFonts);
    }
  }

  return out.save({ useObjectStreams: true });
}

/** Mở lại file vừa xuất để chắc chắn không hỏng + đúng số trang. */
export async function verifyExport(bytes, expectedPages) {
  const { pdfLibModule } = await loadPdfLib();
  const check = await pdfLibModule.PDFDocument.load(bytes, { ignoreEncryption: true });
  const count = check.getPageCount();
  if (count !== expectedPages) {
    throw new Error(`File xuất ra có ${count} trang (mong đợi ${expectedPages} trang).`);
  }
  return count;
}

/** Tải file về máy người dùng (không đụng file gốc trên thiết bị). */
export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 20000);
}