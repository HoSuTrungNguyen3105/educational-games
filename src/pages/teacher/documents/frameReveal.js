// frameReveal.js — Cuộn khung xem trước tới phần tử tương ứng với vị trí
// con trỏ trong editor và "bôi xanh" nổi bật phần tử đó trong giây lát.
//
// Preview Word / PowerPoint(HTML) nằm trong iframe sandbox (allow-same-origin,
// không script) nhưng TRANG CHA vẫn truy cập được contentDocument để đo và
// cuộn (SandboxFrame đã dùng cách này để tự co giãn chiều cao). Khung cuộn
// thực tế là div overflow-auto bên ngoài iframe (iframe cao bằng toàn bộ nội
// dung, zoom bằng transform) — nên ta cuộn div ngoài theo tọa độ màn hình
// của phần tử, không cuộn bên trong iframe.
import { useEffect } from "react";

const HIGHLIGHT_STYLE_ID = "ds-reveal-style";
const HIGHLIGHT_CSS = `
  @keyframes dsRevealPulse {
    0% { background-color: rgba(37, 99, 235, 0.28); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.55); }
    60% { background-color: rgba(16, 185, 129, 0.20); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.45); }
    100% { background-color: transparent; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
  .ds-reveal-highlight {
    animation: dsRevealPulse 1.7s ease-out forwards;
    border-radius: 4px;
    outline: 2px solid rgba(37, 99, 235, 0.7);
    outline-offset: 2px;
    scroll-margin: 40px;
  }
`;

function ensureStyle(doc) {
  if (!doc || doc.getElementById(HIGHLIGHT_STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = HIGHLIGHT_STYLE_ID;
  style.textContent = HIGHLIGHT_CSS;
  (doc.head || doc.documentElement).appendChild(style);
}

/** Tìm phần tử đích trong document của iframe theo mô tả target. */
export function findRevealElement(doc, target) {
  if (!doc || !target) return null;
  if (target.kind === "block") {
    const page = doc.querySelector(".doc-page") || doc.body;
    const kids = page ? Array.from(page.children) : [];
    if (!kids.length) return null;
    return kids[Math.max(0, Math.min(target.index, kids.length - 1))];
  }
  if (target.kind === "tag" && target.tag) {
    const list = doc.querySelectorAll(target.tag);
    if (!list.length) return null;
    return list[Math.max(0, Math.min(target.index, list.length - 1))];
  }
  return null;
}

/**
 * Cuộn `scrollEl` để đưa phần tử đích trong `iframeEl` vào giữa khung và
 * bôi xanh nó. Trả true nếu tìm thấy + cuộn, false nếu chưa sẵn sàng.
 */
export function revealInFrame(scrollEl, iframeEl, target) {
  const doc = iframeEl?.contentDocument;
  const el = findRevealElement(doc, target);
  if (!el || !scrollEl) return false;

  ensureStyle(doc);
  // Khởi động lại animation nếu bôi xanh lần nữa cùng phần tử.
  el.classList.remove("ds-reveal-highlight");
  // buộc reflow để animation chạy lại
  void el.offsetWidth;
  el.classList.add("ds-reveal-highlight");
  window.setTimeout(() => el.classList.remove("ds-reveal-highlight"), 1800);

  const scrollRect = scrollEl.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const elOffsetInContent = (elRect.top - scrollRect.top) + scrollEl.scrollTop;
  const top = Math.max(0, elOffsetInContent - scrollEl.clientHeight / 2 + elRect.height / 2);
  // Cuộn tức thì (không smooth): iframe xem trước tự co giãn chiều cao
  // (SandboxFrame fit) ngay sau khi nội dung nạp/đổi, và cuộn mượt sẽ bị
  // huỷ/reflow giữa chừng khiến khung không dịch chuyển. Cuộn thẳng tới
  // đích là ổn định cho thao tác "bấm dòng mã → nhảy tới đoạn".
  scrollEl.scrollTop = top;
  return true;
}

/**
 * Hook cho component preview: mỗi khi `reveal.token` đổi thì cuộn + bôi
 * xanh. Thử lại vài lần vì iframe có thể chưa nạp xong nội dung mới.
 */
export function useFrameReveal(scrollRef, frameRef, reveal) {
  const token = reveal?.token;
  useEffect(() => {
    if (!token || !reveal) return undefined;
    let tries = 0;
    let timer;
    const attempt = () => {
      const ok = revealInFrame(scrollRef.current, frameRef.current, reveal);
      if (!ok && tries < 8) { tries++; timer = setTimeout(attempt, 90); }
    };
    timer = setTimeout(attempt, 40);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}