// sourceMap.js — Ánh xạ vị trí con trỏ trong mã nguồn sang phần tử tương
// ứng trong preview, phục vụ tính năng "click editor → preview cuộn tới +
// bôi xanh đoạn đang trỏ".
//
// Hai chế độ soạn đi hai đường khác nhau:
//   • JSON: tài liệu là mảng `blocks` (Word) hoặc `slides` (PowerPoint).
//     Tìm phần tử mảng chứa offset của con trỏ → chỉ số khối/slide.
//   • HTML: preview render đúng thân HTML của giáo viên. Quét mã nguồn để
//     tìm thẻ khối bao quanh con trỏ + thứ tự của nó trong số các thẻ cùng
//     tên → khớp phần tử trong iframe preview (cùng cây DOM).
//
// Không chạy mã nguồn, không DOMParser ở đây — chỉ quét chuỗi thuần để lấy
// vị trí, an toàn và chạy được cả khi mã đang gõ dở.

// ── JSON: chỉ số phần tử mảng chứa offset ──────────────────────────────
/**
 * Tìm chỉ số phần tử (object) của mảng `key` ("blocks"/"slides") đang chứa
 * `offset` (vị ký tự của con trỏ). Trả null khi không có mảng đó. Khi con
 * trỏ nằm ngoài mọi phần tử (khoảng trắng, dòng khóa "blocks": [ …) thì
 * kẹp về phần tử gần nhất để preview vẫn cuộn tới vùng hợp lý.
 */
export function jsonItemIndexAt(source, key, offset) {
  const src = String(source || "");
  const keyRe = new RegExp(`"${key}"\\s*:\\s*\\[`);
  const m = keyRe.exec(src);
  if (!m) return null;
  const arrayOpen = m.index + m[0].length - 1; // vị trí '['
  if (offset < m.index) return 0; // con trỏ trước khóa → khối đầu

  let depth = 1; // đang ở trong mảng '['
  let inStr = false;
  let esc = false;
  let elemStart = -1;
  let firstStart = -1;
  let lastEnd = -1;
  let index = 0;
  let hit = null;

  for (let i = arrayOpen + 1; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === "{" || c === "[") {
      if (depth === 1 && c === "{") { elemStart = i; if (firstStart < 0) firstStart = i; }
      depth++;
    } else if (c === "}" || c === "]") {
      depth--;
      if (depth === 1 && c === "}") {
        lastEnd = i;
        if (elemStart >= 0 && offset >= elemStart && offset <= i) hit = index;
        index++;
        elemStart = -1;
      }
      if (depth === 0) break; // đóng mảng
    }
  }

  if (hit != null) return hit;
  if (index === 0) return null; // mảng rỗng
  if (firstStart >= 0 && offset < firstStart) return 0;
  if (lastEnd >= 0 && offset > lastEnd) return index - 1;
  // Giữa hai phần tử (khoảng trắng/dấu phẩy) → phần tử trước đó.
  return Math.max(0, Math.min(index - 1, index - 1));
}

// ── HTML: thẻ khối bao quanh con trỏ + thứ tự cùng tên ─────────────────
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
// Thẻ khối dùng làm "điểm neo" cuộn preview.
const ANCHOR_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "ul", "ol", "table",
  "img", "blockquote", "section", "figure", "pre", "hr",
]);

/**
 * Quét HTML tìm thẻ khối bao quanh `offset`. Trả { tag, index } với `index`
 * là thứ tự (0-based) của thẻ đó trong số các thẻ CÙNG TÊN xuất hiện trong
 * thân tài liệu — đúng thứ tự querySelectorAll(tag) trong iframe preview.
 * Trả null khi không tìm thấy điểm neo.
 */
export function htmlAnchorAt(source, offset) {
  const src = String(source || "");
  if (!src.trim()) return null;

  // Bỏ qua comment / style / script bằng cách quét tới đâu nhảy tới đó.
  const tagRe = /<!--[\s\S]*?-->|<(style|script)\b[\s\S]*?<\/\1\s*>|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/gi;

  const tagCount = Object.create(null); // đếm thẻ mở cùng tên trong body
  const stack = []; // { tag, anchor }
  const anchors = []; // { tag, index, start, end }
  let inBody = false;
  let sawBodyTag = false;
  let m;

  while ((m = tagRe.exec(src)) !== null) {
    const full = m[0];
    // Comment hoặc style/script: không phải thẻ nội dung.
    if (full.startsWith("<!--") || m[1]) continue;
    const rawTag = m[2];
    if (!rawTag) continue;
    const tag = rawTag.toLowerCase();
    const isClose = full.startsWith("</");
    const selfClose = /\/\s*>$/.test(full) || VOID_TAGS.has(tag);

    if (tag === "body") {
      sawBodyTag = true;
      inBody = !isClose;
      continue;
    }
    // Tài liệu đầy đủ: chỉ tính nội dung trong <body>. Fragment (không có
    // thẻ body): tính toàn bộ, nhưng bỏ qua thẻ thuộc head.
    const regionOk = sawBodyTag ? inBody : !["head", "html", "title", "meta", "link", "style", "script"].includes(tag);
    if (!regionOk && !isClose) {
      // vẫn cần đẩy stack để cân bằng, nhưng không tạo anchor
      if (!selfClose) stack.push({ tag, anchor: null });
      continue;
    }

    if (isClose) {
      // pop tới thẻ mở gần nhất cùng tên
      for (let s = stack.length - 1; s >= 0; s--) {
        if (stack[s].tag === tag) {
          const opened = stack[s];
          if (opened.anchor) opened.anchor.end = m.index;
          stack.length = s;
          break;
        }
      }
      continue;
    }

    // thẻ mở
    let anchor = null;
    if (regionOk && ANCHOR_TAGS.has(tag)) {
      const idx = tagCount[tag] || 0;
      tagCount[tag] = idx + 1;
      anchor = { tag, index: idx, start: m.index, end: selfClose ? m.index + full.length : Infinity };
      anchors.push(anchor);
    } else if (regionOk) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
    if (!selfClose) stack.push({ tag, anchor });
  }

  if (!anchors.length) return null;
  // Chọn anchor bao quanh offset, ưu tiên anchor trong cùng (start lớn nhất).
  let best = null;
  for (const a of anchors) {
    if (offset >= a.start && offset <= a.end) {
      if (!best || a.start > best.start) best = a;
    }
  }
  // Con trỏ trước anchor đầu tiên (phần <head>/tiêu đề) → anchor đầu.
  if (!best) {
    if (offset < anchors[0].start) best = anchors[0];
    else {
      // sau anchor cuối → anchor cuối cùng đã đóng gần nhất
      let lastClosed = null;
      for (const a of anchors) if (a.end !== Infinity && a.end <= offset) lastClosed = a;
      best = lastClosed || anchors[anchors.length - 1];
    }
  }
  return { tag: best.tag, index: best.index };
}