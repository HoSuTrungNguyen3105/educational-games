// stats.js — Thống kê nhanh của tài liệu đang soạn (số từ / số khối /
// số slide) tính từ MÔ HÌNH TRUNG GIAN đã áp dụng — nguồn sự thật duy
// nhất của preview, nên số liệu không bao giờ lệch với những gì giáo
// viên đang nhìn thấy. Hàm thuần, không chạm DOM.

const countWords = (value) => String(value ?? "").trim().split(/\s+/).filter(Boolean).length;

function sumWords(values) {
  return (values || []).reduce((acc, v) => acc + countWords(v), 0);
}

/**
 * Trả { kind: "word", count, words } (count = số khối) hoặc
 * { kind: "presentation", count, words } (count = số slide).
 * Model null/không hợp lệ → null (UI ẩn dòng thống kê).
 */
export function documentStats(model) {
  if (!model || typeof model !== "object") return null;
  if (model.kind === "presentation") {
    const slides = Array.isArray(model.slides) ? model.slides : [];
    let words = 0;
    for (const s of slides) {
      words += countWords(s.title) + countWords(s.subtitle) + countWords(s.caption);
      words += sumWords(s.content) + sumWords(s.left) + sumWords(s.right);
      for (const row of s.rows || []) words += sumWords(row);
    }
    return { kind: "presentation", count: slides.length, words };
  }
  if (model.kind === "word") {
    const blocks = Array.isArray(model.blocks) ? model.blocks : [];
    let words = countWords(model.title);
    for (const b of blocks) {
      words += countWords(b.text);
      words += sumWords(b.items);
      for (const row of b.rows || []) words += sumWords(row);
    }
    return { kind: "word", count: blocks.length, words };
  }
  return null;
}
