// format.js — Nút "Format Code" của trình soạn: JSON thì parse +
// stringify; HTML thì sắp xếp thụt lề theo cây thẻ bằng bộ formatter tự
// viết (không thêm thư viện). Formatter là best-effort về THỤT LỀ: không
// đổi nội dung chữ, giữ nguyên khoảng trắng có nghĩa quanh thẻ inline.

/** Vị trí lỗi JSON từ message của V8: "... at position N" → { line, column }. */
export function jsonErrorPosition(text, err) {
  const msg = String(err?.message || "JSON không hợp lệ");
  const m = /position (\d+)/i.exec(msg);
  if (m) {
    const pos = Number(m[1]);
    const upTo = String(text || "").slice(0, pos);
    const line = upTo.split("\n").length;
    const column = pos - upTo.lastIndexOf("\n");
    return { message: msg, line, column };
  }
  const lm = /line (\d+) column (\d+)/i.exec(msg);
  if (lm) return { message: msg, line: Number(lm[1]), column: Number(lm[2]) };
  return { message: msg, line: null, column: null };
}

export function formatJsonText(text) {
  try {
    const obj = JSON.parse(text);
    return { ok: true, text: JSON.stringify(obj, null, 2) };
  } catch (e) {
    return { ok: false, error: jsonErrorPosition(text, e) };
  }
}

// ── HTML formatter (best-effort) ────────────────────────────────────────
const BLOCK_TAGS = new Set([
  "html", "head", "body", "section", "div", "article", "main", "header", "footer",
  "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th", "figure",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote", "style", "title",
]);
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

export function formatHtmlText(source) {
  const src = String(source || "");
  const tokens = src.split(/(<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?[a-zA-Z][^>]*>)/gi).filter((t) => t !== "");
  const lines = [];
  let depth = 0;
  const pad = (d = depth) => "  ".repeat(Math.max(0, d));
  let pending = ""; // dòng đang dở (nội dung inline của một phần tử khối)
  const flush = () => {
    const t = pending.trim();
    if (t) lines.push(pad() + t);
    pending = "";
  };

  for (const tok of tokens) {
    if (/^<!--|^<!doctype/i.test(tok)) { flush(); lines.push(pad() + tok.trim()); continue; }
    const tagMatch = /^<(\/?)([a-zA-Z][\w-]*)/.exec(tok);
    if (!tagMatch) {
      // Khối chữ: nhiều dòng (CSS trong <style>, đoạn văn ngắt dòng) → mỗi
      // dòng một hàng; một dòng → nối vào dòng đang dở, giữ khoảng trắng.
      const meaningful = tok.split("\n").map((l) => l.trim()).filter(Boolean);
      if (meaningful.length > 1) {
        flush();
        for (const l of meaningful) lines.push(pad() + l.replace(/\s+/g, " "));
      } else if (meaningful.length === 1) {
        let piece = tok.replace(/\s+/g, " ");
        if (!pending) piece = piece.trimStart();
        pending += piece;
      }
      continue;
    }
    const closing = tagMatch[1] === "/";
    const tag = tagMatch[2].toLowerCase();
    const selfClosing = /\/>$/.test(tok) || VOID_TAGS.has(tag);
    if (VOID_TAGS.has(tag) && !closing) {
      // Thẻ void: đứng một mình khi đang ở đầu dòng (meta/link trong head),
      // còn lại coi như inline (img/br trong đoạn văn).
      if (!pending.trim()) { flush(); lines.push(pad() + tok); }
      else pending += tok;
      continue;
    }
    if (!BLOCK_TAGS.has(tag)) { pending += tok; continue; }
    if (closing) {
      if (pending.trim()) { lines.push(pad(depth - 1) + pending.trim() + tok); pending = ""; }
      else lines.push(pad(depth - 1) + tok);
      depth = Math.max(0, depth - 1);
      continue;
    }
    flush();
    lines.push(pad() + tok);
    if (!selfClosing) depth++;
  }
  flush();
  return lines.join("\n") + "\n";
}
