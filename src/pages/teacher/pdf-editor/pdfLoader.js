/**
 * pdfLoader.js — cầu nối với PDF.js: mở file, render trang, đọc lớp chữ gốc.
 *
 * Tách riêng khỏi UI để phần render/đọc PDF có thể thay thế mà không đụng
 * giao diện (yêu cầu §4 "tách riêng phần render PDF, lớp chỉnh sửa, xuất file").
 *
 * Lưu ý kỹ thuật:
 *   • pdf.js có thể transfer buffer sang worker (detach) → luôn truyền BẢN SAO,
 *     giữ bản gốc (Uint8Array) cho bước xuất bằng pdf-lib.
 *   • Xử lý file hoàn toàn phía client — không gửi tài liệu lên server.
 */
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/** Giới hạn dung lượng file tải lên (30 MB). */
export const MAX_PDF_BYTES = 30 * 1024 * 1024;

export function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Kiểm tra loại + dung lượng trước khi đọc file. Trả về thông báo lỗi hoặc null. */
export function validatePdfFile(file) {
  const isPdf = file?.type === "application/pdf" || /\.pdf$/i.test(file?.name || "");
  if (!isPdf) return "File không hợp lệ — chỉ chấp nhận tài liệu PDF (.pdf).";
  if (file.size > MAX_PDF_BYTES) {
    return `File quá lớn (${formatSize(file.size)}). Giới hạn của công cụ là ${formatSize(MAX_PDF_BYTES)}.`;
  }
  return null;
}

/** Dịch lỗi của PDF.js sang thông báo dễ hiểu cho giáo viên. */
export function pdfOpenError(err) {
  const name = err?.name || "";
  const code = err?.code;
  if (name === "PasswordException" || code === 1 || code === 2) {
    return "File PDF có mật khẩu bảo vệ. Vui lòng bỏ mật khẩu (hoặc xuất bản không mật khẩu) rồi thử lại.";
  }
  if (name === "InvalidPDFException") {
    return "Không đọc được file này — file có thể bị hỏng hoặc không phải PDF hợp lệ.";
  }
  if (name === "MissingPDFException") return "Không tìm thấy nội dung của file PDF.";
  if (name === "UnexpectedResponseException") return "Không tải được tài liệu. Vui lòng thử lại.";
  const msg = err?.message || "";
  if (/password/i.test(msg)) return "File PDF có mật khẩu bảo vệ — công cụ chưa hỗ trợ mở file khoá.";
  return msg ? `Không mở được file PDF (${msg}).` : "Không mở được file PDF. Vui lòng thử file khác.";
}

/**
 * Mở bytes PDF → { pdfDoc, pages }.
 * `pages[i]`: { index, width, height, rotate } — width/height theo trang KHÔNG
 * xoay (đơn vị pt), rotate là góc xoay cố định sẵn có của trang (/Rotate).
 */
export async function openPdf(bytes) {
  const task = pdfjsLib.getDocument({
    data: bytes.slice(),
    isEvalSupported: false,
    disableAutoFetch: true,
    // Giữ lại bytes font nhúng + tên font thật trong commonObjs để "Sửa chữ"
    // tái dùng đúng font gốc (xem srcFonts.js).
    fontExtraProperties: true,
  });
  const pdfDoc = await task.promise;
  const pages = [];
  for (let i = 0; i < pdfDoc.numPages; i += 1) {
    const page = await pdfDoc.getPage(i + 1);
    const vp = page.getViewport({ scale: 1, rotation: 0 });
    pages.push({
      index: i,
      width: vp.width,
      height: vp.height,
      rotate: page.rotate || 0,
    });
  }
  return { pdfDoc, pages };
}

/**
 * Render một trang vào <canvas> theo `scale` và góc `rotation` (tổng góc xoay).
 * Trả về RenderTask — caller await task.promise và có thể task.cancel().
 */
export function renderPageToCanvas(pdfPage, canvas, { scale, rotation, dpr = 1 }) {
  const cssViewport = pdfPage.getViewport({ scale, rotation });
  const pxViewport = dpr === 1 ? cssViewport : pdfPage.getViewport({ scale: scale * dpr, rotation });
  canvas.width = Math.max(1, Math.round(pxViewport.width));
  canvas.height = Math.max(1, Math.round(pxViewport.height));
  canvas.style.width = `${cssViewport.width}px`;
  canvas.style.height = `${cssViewport.height}px`;
  const ctx = canvas.getContext("2d", { alpha: false });
  return pdfPage.render({
    canvas,
    canvasContext: ctx,
    viewport: pxViewport,
    background: "#ffffff",
  });
}

/**
 * Dựng LỚP CHỮ THẬT của PDF.js (TextLayer) phủ lên canvas: các span chữ trong
 * suốt đặt đúng vị trí từng dòng chữ gốc → hover ra cursor text, kéo bôi đen /
 * Ctrl+C sao chép như mọi trình xem PDF (chữ là chữ thật của file, không phải
 * chữ mô phỏng). Container phải có class "textLayer" (xem pdfEditor.css).
 * Trả về TextLayer để caller cancel() khi đổi trang / zoom.
 */
export async function renderTextLayer(pdfPage, container, { scale, rotation }) {
  const viewport = pdfPage.getViewport({ scale, rotation });
  // TextLayer tính cỡ chữ / bề rộng span qua các biến CSS này (theo pdf_viewer).
  container.style.setProperty("--scale-factor", String(scale));
  container.style.setProperty("--user-unit", "1");
  container.style.setProperty("--total-scale-factor", "calc(var(--scale-factor) * var(--user-unit))");
  container.style.setProperty("--scale-round-x", "1px");
  container.style.setProperty("--scale-round-y", "1px");
  const content = await pdfPage.getTextContent();
  const layer = new pdfjsLib.TextLayer({ textContentSource: content, container, viewport });
  await layer.render();
  return layer;
}

/**
 * Đọc lớp chữ gốc của trang → mảng hộp chữ (đơn vị pt, KHÔNG gọt xoay,
 * hệ toạ độ PDF gốc: gốc dưới-trái, y tăng dần).
 *
 * Trang scan/ảnh không có item nào → trả []. Đây là dữ liệu phục vụ tính năng
 * "Vùng che chữ gốc" (xem PdfEditorPage — nhóm thao tác với chữ gốc).
 */
export async function extractTextItems(pdfPage) {
  const content = await pdfPage.getTextContent();
  const raw = [];
  for (const item of content.items || []) {
    if (!item || typeof item.str !== "string" || !item.str.trim()) continue;
    const t = item.transform || [1, 0, 0, 1, 0, 0];
    const [a, b, c, d, e, f] = t;
    const w = item.width || 0;
    const h = item.height || Math.abs(d) || 0;
    // width/height đã là pt — nhân vector đơn vị trục chữ, không nhân cỡ chữ
    // lần nữa (transform đã chứa cỡ chữ).
    const ux = a / (Math.hypot(a, b) || 1);
    const uy = b / (Math.hypot(a, b) || 1);
    const vx = c / (Math.hypot(c, d) || 1);
    const vy = d / (Math.hypot(c, d) || 1);
    // Bốn góc của run chữ theo ma trận chữ (e,f) là gốc.
    const corners = [
      [e, f],
      [e + ux * w, f + uy * w],
      [e + vx * h, f + vy * h],
      [e + ux * w + vx * h, f + uy * w + vy * h],
    ];
    const xs = corners.map((p) => p[0]);
    const ys = corners.map((p) => p[1]);
    raw.push({
      str: item.str,
      x0: Math.min(...xs),
      y0: Math.min(...ys),
      x1: Math.max(...xs),
      y1: Math.max(...ys),
      horizontal: Math.abs(b) < 0.02 && Math.abs(c) < 0.02,
      baseline: f,
    });
  }

  // Gộp các từ cùng dòng (cùng baseline) thành một hộp để che cho gọn.
  const lines = [];
  const byBaseline = new Map();
  for (const it of raw) {
    if (!it.horizontal) {
      lines.push({ x0: it.x0, y0: it.y0, x1: it.x1, y1: it.y1, text: it.str });
      continue;
    }
    const key = Math.round(it.baseline * 2) / 2; // làm tròn 0.5pt
    const bucket = byBaseline.get(key);
    if (bucket) {
      bucket.x0 = Math.min(bucket.x0, it.x0);
      bucket.y0 = Math.min(bucket.y0, it.y0);
      bucket.x1 = Math.max(bucket.x1, it.x1);
      bucket.y1 = Math.max(bucket.y1, it.y1);
      bucket.text += ` ${it.str}`;
    } else {
      const line = { x0: it.x0, y0: it.y0, x1: it.x1, y1: it.y1, text: it.str };
      byBaseline.set(key, line);
      lines.push(line);
    }
  }
  return lines;
}

/**
 * Đọc lớp chữ gốc theo DÒNG để sửa tại chỗ (khác extractTextItems ở chỗ giữ
 * thêm cỡ chữ / kiểu chữ / họ font / baseline của từng dòng).
 *
 * Chỉ gộp các run CẠNH NHAU trên cùng baseline (không gộp cả trang như bản
 * che hàng loạt) để nhấp dòng nào sửa đúng dòng đó, kể cả trang nhiều cột.
 * Toạ độ trả về theo hệ PDF gốc (gốc dưới-trái, y tăng dần, chưa gọt xoay).
 *
 * `srcFonts` (tuỳ chọn, từ collectSrcFonts): nhận diện đậm/nghiêng/họ font theo
 * TÊN THẬT của font nhúng — tên nội bộ kiểu "g_d0_f3" không nói lên kiểu chữ.
 */
export async function extractEditableText(pdfPage, srcFonts = null) {
  const content = await pdfPage.getTextContent();
  const styles = content.styles || {};
  const runs = [];
  const items = content.items || [];
  for (let idx = 0; idx < items.length; idx += 1) {
    const item = items[idx];
    if (!item || typeof item.str !== "string" || !item.str.trim()) continue;
    const [a, b, c, d, e, f] = item.transform || [1, 0, 0, 1, 0, 0];
    const fontSize = Math.hypot(a, b) || Math.abs(d) || item.height || 12;
    const w = item.width || 0;
    const h = item.height || fontSize;
    // width/height của pdf.js ĐÃ là pt (cỡ chữ nằm sẵn trong transform) —
    // chỉ nhân với VECTOR ĐƠN VỊ của trục chữ, không nhân lại cỡ chữ.
    const ux = a / (Math.hypot(a, b) || 1);
    const uy = b / (Math.hypot(a, b) || 1);
    const vx = c / (Math.hypot(c, d) || 1);
    const vy = d / (Math.hypot(c, d) || 1);
    const corners = [
      [e, f],
      [e + ux * w, f + uy * w],
      [e + vx * h, f + vy * h],
      [e + ux * w + vx * h, f + uy * w + vy * h],
    ];
    const xs = corners.map((p) => p[0]);
    const ys = corners.map((p) => p[1]);
    const st = styles[item.fontName] || {};
    const entry = srcFonts ? srcFonts[item.fontName] : null;
    const hay = `${item.fontName || ""} ${st.fontFamily || ""}`;
    const cssFamily = String(st.fontFamily || "");
    const horizontal = Math.abs(b) < 0.02 && Math.abs(c) < 0.02;
    runs.push({
      str: item.str,
      // Chỉ số item trong getTextContent — trùng chỉ số span của TextLayer,
      // nhờ đó ánh xạ được vùng bôi đen về đúng dòng chữ này.
      srcIndex: idx,
      x0: Math.min(...xs),
      // Chừa chỗ cho phần chữ thòng xuống dưới baseline (g, y, ỵ…) và dấu
      // tiếng Việt xếp chồng phía trên — hộp chữ của pdf.js chỉ cao 1 cỡ chữ.
      y0: horizontal ? Math.min(Math.min(...ys), f - fontSize * 0.3) : Math.min(...ys),
      x1: Math.max(...xs),
      y1: horizontal ? Math.max(Math.max(...ys), f + fontSize * 1.06) : Math.max(...ys),
      horizontal,
      baseline: f,
      startX: e,
      fontSize,
      fontKey: item.fontName || null,
      bold: entry ? entry.bold : /bold|black|heavy|semibold|demibold/i.test(hay),
      italic: entry ? entry.italic : /italic|oblique/i.test(hay),
      family: entry
        ? entry.family
        : /mono/i.test(hay)
          ? "mono"
          : /serif/i.test(cssFamily) && !/sans/i.test(cssFamily)
            ? "serif"
            : "sans",
    });
  }

  const lines = [];
  const byBaseline = new Map();
  const sorted = [...runs].sort((p, q) => p.baseline - q.baseline || p.x0 - q.x0);
  for (const it of sorted) {
    if (!it.horizontal) {
      lines.push({ ...it, text: it.str, parts: [{ i: it.srcIndex, start: 0, end: it.str.length }] });
      continue;
    }
    const key = Math.round(it.baseline * 2) / 2;
    const bucket = byBaseline.get(key);
    const gap = bucket ? it.x0 - bucket.x1 : Infinity;
    const sameStyle =
      bucket &&
      bucket.fontKey === it.fontKey &&
      bucket.bold === it.bold &&
      bucket.italic === it.italic &&
      bucket.family === it.family &&
      Math.abs(bucket.fontSize - it.fontSize) <= Math.max(1, it.fontSize * 0.15);
    // Khoảng cách <= ~1 cỡ chữ = cùng một dòng (kể cả khoảng trắng giữa từ);
    // xa hơn là cột / ô khác → tách dòng riêng.
    if (sameStyle && gap <= it.fontSize * 1.1 && gap >= -it.fontSize * 0.3) {
      const joiner = gap > it.fontSize * 0.12 ? " " : "";
      const start = bucket.text.length + joiner.length;
      bucket.text += joiner + it.str;
      // parts: khoảng ký tự của từng span gốc trong dòng đã gộp — dùng để
      // đặt vùng chọn sẵn trong ô sửa chữ khi người dùng bôi đen một phần dòng.
      bucket.parts.push({ i: it.srcIndex, start, end: start + it.str.length });
      bucket.x0 = Math.min(bucket.x0, it.x0);
      bucket.y0 = Math.min(bucket.y0, it.y0);
      bucket.x1 = Math.max(bucket.x1, it.x1);
      bucket.y1 = Math.max(bucket.y1, it.y1);
      bucket.fontSize = Math.max(bucket.fontSize, it.fontSize);
    } else {
      const line = { ...it, text: it.str, parts: [{ i: it.srcIndex, start: 0, end: it.str.length }] };
      byBaseline.set(key, line);
      lines.push(line);
    }
  }
  return lines;
}

/**
 * Lấy màu NỀN + màu CHỮ của một hộp chữ (toạ độ màn hình, pt) bằng cách đọc
 * pixel canvas đã render — để vùng che tiệp nền và chữ mới đúng màu chữ cũ.
 * `pageW/pageH` là kích thước trang hiển thị THEO PT (cùng hệ với box) để suy
 * ra tỉ lệ pixel đúng cả khi zoom lẫn khi dpr > 1.
 * Không đọc được (canvas chưa render, lỗi bảo mật…) → trả trắng/đen an toàn.
 */
export function sampleTextColors(canvas, box, pageW, pageH) {
  const fallback = { bg: "#ffffff", fg: "#1d2327" };
  if (!canvas || !pageW || !pageH || !box) return fallback;
  try {
    const kx = canvas.width / pageW;
    const ky = canvas.height / pageH;
    const x = Math.max(0, Math.floor((box.x + 1) * kx));
    const y = Math.max(0, Math.floor((box.y + 1) * ky));
    const w = Math.min(canvas.width - x, Math.ceil((box.w - 2) * kx));
    const h = Math.min(canvas.height - y, Math.ceil((box.h - 2) * ky));
    if (w < 2 || h < 2) return fallback;
    const data = canvas.getContext("2d").getImageData(x, y, w, h).data;
    const stride = Math.max(1, Math.floor(Math.sqrt((w * h) / 4000)));
    const hist = new Map();
    const pixels = [];
    for (let yy = 0; yy < h; yy += stride) {
      for (let xx = 0; xx < w; xx += stride) {
        const i = (yy * w + xx) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        pixels.push([r, g, b]);
        const qkey = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
        const e = hist.get(qkey);
        if (e) { e.n += 1; e.r += r; e.g += g; e.b += b; }
        else hist.set(qkey, { n: 1, r, g, b });
      }
    }
    if (!pixels.length) return fallback;
    // Nền = cụm màu chiếm đa số trong hộp (chữ thường phủ < 50% diện tích).
    let best = null;
    for (const e of hist.values()) if (!best || e.n > best.n) best = e;
    const bg = [best.r / best.n, best.g / best.n, best.b / best.n];
    // Chữ = lõi nét chữ: chỉ lấy pixel gần mức khác nền NHẤT (bỏ pixel rìa
    // chống răng cưa đã pha màu nền, tránh ra màu xám/nhạt hơn chữ thật).
    const ranked = pixels
      .map(([r, g, b]) => ({
        d: Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]),
        r, g, b,
      }))
      .sort((p, q) => q.d - p.d);
    const maxD = ranked[0]?.d || 0;
    let strong = ranked.filter((p) => p.d >= Math.max(120, maxD * 0.75));
    if (strong.length < 3) {
      strong = ranked.slice(0, Math.max(3, Math.floor(ranked.length / 4))).filter((p) => p.d > 120);
    }
    const toHex = (arr) =>
      `#${arr.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("")}`;
    let bgHex = toHex(bg);
    if (bg.every((v) => v > 245)) bgHex = "#ffffff";
    if (strong.length < 3) return { bg: bgHex, fg: fallback.fg };
    const fg = [0, 1, 2].map((ch) =>
      strong.reduce((s, p) => s + (ch === 0 ? p.r : ch === 1 ? p.g : p.b), 0) / strong.length,
    );
    return { bg: bgHex, fg: toHex(fg) };
  } catch {
    return fallback;
  }
}

/** Đóng tài liệu + giải phóng worker/canvas khi rời trang hoặc đổi file. */
export function destroyPdf(pdfDoc) {
  if (!pdfDoc) return;
  try {
    const p = pdfDoc.destroy();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch {
    /* đã đóng rồi */
  }
}
