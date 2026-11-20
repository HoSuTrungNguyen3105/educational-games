// wordFindReplace.js — Tìm kiếm & thay thế trên NỘI DUNG tài liệu Word
// ở chế độ Normal (Giai đoạn 1 §4). Thao tác trên đối tượng JSON đã
// parse, chỉ chạm vào PHẦN CHỮ của các khối:
//   • heading / paragraph: `text` (và `runs` khi khối có định dạng inline)
//   • list: từng mục trong `items`
//   • table: từng ô trong `rows`
// KHÔNG đụng tên trường/cú pháp JSON — giáo viên tìm chữ trong bài, không
// tìm trong mã. So khớp phân biệt hoa/thường, khớp nguyên chuỗi con.
//
// Mọi hàm đều THUẦN: nhận đối tượng JSON, trả đối tượng MỚI (đầu vào
// không đổi) để editor ghi lại bản nháp qua đúng đường dispatch của
// CodeEditor — lịch sử Hoàn tác/Làm lại vẫn giữ nguyên.

const clone = (o) => JSON.parse(JSON.stringify(o));

/** Các vị trí chứa chữ của một khối, theo thứ tự đọc. */
function textLocations(block) {
  if (!block || typeof block !== "object") return [];
  if (block.type === "heading" || block.type === "paragraph") {
    return [{ kind: "text" }];
  }
  if (block.type === "list") {
    return (block.items || []).map((_, index) => ({ kind: "item", index }));
  }
  if (block.type === "table") {
    const out = [];
    (block.rows || []).forEach((row, r) => (row || []).forEach((_, c) => out.push({ kind: "cell", row: r, col: c })));
    return out;
  }
  return [];
}

function locationText(block, loc) {
  if (loc.kind === "text") return typeof block.text === "string" ? block.text : "";
  if (loc.kind === "item") return String(block.items?.[loc.index] ?? "");
  return String(block.rows?.[loc.row]?.[loc.col] ?? "");
}

/**
 * Liệt kê mọi vị trí khớp `query` trong tài liệu:
 * [{ blockIndex, loc, start, length }] theo thứ tự xuất hiện.
 */
export function findWordMatches(json, query) {
  const q = String(query || "");
  if (!q || !json || !Array.isArray(json.blocks)) return [];
  const matches = [];
  json.blocks.forEach((block, blockIndex) => {
    for (const loc of textLocations(block)) {
      const text = locationText(block, loc);
      let from = 0;
      for (;;) {
        const start = text.indexOf(q, from);
        if (start < 0) break;
        matches.push({ blockIndex, loc, start, length: q.length });
        from = start + Math.max(1, q.length);
      }
    }
  });
  return matches;
}

export function countWordMatches(json, query) {
  return findWordMatches(json, query).length;
}

// ── Thay thế trong một khối chữ có runs ───────────────────────────────
// Runs là các đoạn chữ liên tiếp; một chỗ khớp có thể nằm gọn trong
// một run hoặc bắc qua nhiều run. Nằm gọn → thay ngay trong run đó.
// Bắc qua nhiều run → gộp các run bị chạm thành MỘT run mang định dạng
// của run đầu tiên bị chạm (định dạng của phần chữ bị thay lấy theo
// đoạn bắt đầu chỗ khớp — hành vi gần với Word nhất có thể ở model này).
function replaceInRuns(block, query, replacement, limit) {
  let replaced = 0;
  let runs = (block.runs || []).map((r) => ({ ...r, text: String(r.text ?? "") }));
  const fullText = () => runs.map((r) => r.text).join("");
  while (replaced < limit) {
    const text = fullText();
    const start = text.indexOf(query);
    if (start < 0) break;
    const end = start + query.length;
    // Ánh xạ vị trí ký tự → run.
    let pos = 0;
    const spans = runs.map((r, i) => {
      const s = { i, from: pos, to: pos + r.text.length };
      pos = s.to;
      return s;
    });
    const first = spans.find((s) => start >= s.from && start < s.to)
      || spans[spans.length - 1];
    const last = spans.find((s) => end > s.from && end <= s.to) || first;
    if (first.i === last.i) {
      const r = runs[first.i];
      const off = start - first.from;
      r.text = r.text.slice(0, off) + replacement + r.text.slice(off + query.length);
    } else {
      const head = runs[first.i].text.slice(0, start - first.from);
      const tail = runs[last.i].text.slice(end - last.from);
      const merged = { ...runs[first.i], text: head + replacement + tail };
      runs = [...runs.slice(0, first.i), merged, ...runs.slice(last.i + 1)];
    }
    replaced += 1;
  }
  if (!replaced) return 0;
  // Dọn runs rỗng (trừ khi run mang định dạng — finishBlock ở
  // textFormat.js cũng giữ run rỗng có định dạng) và đồng bộ `text`.
  const hasFormat = (r) => r.bold || r.italic || r.underline || r.strike || r.color || r.highlight;
  const clean = runs.filter((r) => r.text !== "" || hasFormat(r));
  block.text = clean.map((r) => r.text).join("");
  if (clean.length && clean.some(hasFormat)) block.runs = clean;
  else delete block.runs;
  return replaced;
}

function replaceInPlainText(holder, key, query, replacement, limit) {
  let text = String(holder[key] ?? "");
  let replaced = 0;
  while (replaced < limit) {
    const start = text.indexOf(query);
    if (start < 0) break;
    text = text.slice(0, start) + replacement + text.slice(start + query.length);
    replaced += 1;
  }
  if (replaced) holder[key] = text;
  return replaced;
}

/**
 * Thay thế trong toàn tài liệu. `all: false` → chỉ thay chỗ khớp ĐẦU
 * TIÊN (theo thứ tự đọc). Trả { json, count } — json là bản sao mới,
 * count = số chỗ đã thay (0 = không có chỗ khớp, json giữ nguyên nội dung).
 */
export function replaceWordMatches(json, query, replacement, { all = true } = {}) {
  const q = String(query || "");
  const out = clone(json || {});
  if (!q || !Array.isArray(out.blocks)) return { json: out, count: 0 };
  const rep = String(replacement ?? "");
  let budget = all ? Infinity : 1;
  let count = 0;
  for (const block of out.blocks) {
    if (budget <= 0) break;
    if (!block || typeof block !== "object") continue;
    if (block.type === "heading" || block.type === "paragraph") {
      if (Array.isArray(block.runs) && block.runs.length) {
        const n = replaceInRuns(block, q, rep, budget);
        count += n; budget -= n;
      } else {
        const n = replaceInPlainText(block, "text", q, rep, budget);
        count += n; budget -= n;
      }
    } else if (block.type === "list") {
      block.items = (block.items || []).map((item) => {
        if (budget <= 0) return item;
        const holder = { v: String(item ?? "") };
        const n = replaceInPlainText(holder, "v", q, rep, budget);
        count += n; budget -= n;
        return holder.v;
      });
    } else if (block.type === "table") {
      block.rows = (block.rows || []).map((row) => (row || []).map((cell) => {
        if (budget <= 0) return cell;
        const holder = { v: String(cell ?? "") };
        const n = replaceInPlainText(holder, "v", q, rep, budget);
        count += n; budget -= n;
        return holder.v;
      }));
    }
  }
  return { json: out, count };
}
