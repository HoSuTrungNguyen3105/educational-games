import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { setupService } from '../services/setupService.js';
import { API_BASE } from '../services/api.js';

// Gốc API (bỏ hậu tố /api) — dùng để ghép URL file HTML do server lưu trên đĩa.
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
// Bản production: ưu tiên VITE_SOCKET_URL (đúng quy ước socket.js — biến này
// trỏ tới server API đã deploy). Bản dev (API trỏ localhost): file /uploads
// nằm trên máy dev nên phải theo API_BASE, không theo VITE_SOCKET_URL.
const SOCKET_ORIGIN = (import.meta.env.VITE_SOCKET_URL || "").replace(/\/+$/, "");
const FILE_ORIGIN = /localhost|127\.0\.0\.1/.test(API_ORIGIN)
  ? API_ORIGIN
  : SOCKET_ORIGIN || API_ORIGIN;

const FALLBACK_TEMPLATE = { ring: "#F4B942", thumbnail: "", htmlUrl: "" };

export function useSubjects(refreshKey) {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    let active = true;
    setupService.listSubjects().then((list) => {
      if (!active) return;
      const names = Array.isArray(list) ? list.map(s => typeof s === "string" ? s : s.name) : [];
      setSubjects(names);
    });
    return () => { active = false; };
  }, [refreshKey]);
  return subjects;
}

export function useCategories(refreshKey) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let active = true;
    setupService.listCategories().then((list) => { if (active) setCategories(list); });
    return () => { active = false; };
  }, [refreshKey]);
  return categories;
}

export function useTemplates(refreshKey) {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    let active = true;
    setupService.listTemplates().then((list) => { if (active) setTemplates(list); });
    return () => { active = false; };
  }, [refreshKey]);
  return templates;
}

export function useTemplate(game, refreshKey) {
  const templates = useTemplates(refreshKey);
  if (!game) return FALLBACK_TEMPLATE;
  if (game.templateId) {
    const tid = typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || game.templateId;
    return templates.find((t) => t._id === tid) || FALLBACK_TEMPLATE;
  }
  return templates.find((t) => t.slug === game.template || t.id === game.template) || FALLBACK_TEMPLATE;
}

/* ── HTML game: file trên Supabase Storage (link) hoặc HTML thô (dữ liệu cũ) ──
   `templates.htmlUrl` có 3 dạng:
     • URL tuyệt đối          → https://… (Supabase/R2/Firebase)
     • /uploads/html/x.html   → file dự phòng trên đĩa backend (gốc = API)
     • HTML thô               → bản ghi cũ chưa migration — dùng luôn
   Hàm này chuẩn hoá về HTML thô để mọi nơi chỉ cần 1 kiểu dữ liệu.          */

const htmlCache = new Map();   // url|key -> Promise<string>

/**
 * `htmlUrl` có 3 dạng:
 *   1. HTML thô            → "<!DOCTYPE html>..."  (template cũ chưa migration)
 *   2. URL tuyệt đối       → "https://…supabase.co/storage/v1/object/public/…"
 *   3. Đường dẫn cùng-origin → "/games/hocmachoi-bridge.html" (file tĩnh do
 *                             chính Vite/Render phục vụ — không cần Supabase)
 * Dạng 3 chỉ nhận đường dẫn bắt đầu bằng "/" và kết thúc bằng .html/.htm
 * nên không bao giờ nhầm với HTML thô.
 */
export function isHtmlUrl(value) {
  const v = String(value || "").trim();
  if (/^https?:\/\//i.test(v)) return true;
  return /^\/[\w\-./%]*\.html?$/i.test(v);
}

/** Ghép URL tuyệt đối: file /uploads/… nằm ở gốc API, còn lại giữ nguyên. */
export function resolveHtmlUrl(raw) {
  const v = String(raw || "").trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("/uploads/")) return `${FILE_ORIGIN}${v}`;
  return v; // đường dẫn tĩnh cùng-origin kiểu cũ (/games/…html)
}

/** Lấy HTML thô của 1 template. Trả "" nếu không có. */
export async function loadTemplateHtml(tpl, cacheKey) {
  const raw = String(tpl?.htmlUrl || "").trim();
  if (!raw) return "";
  if (!isHtmlUrl(raw)) return raw;               // HTML thô (template cũ)

  const url = resolveHtmlUrl(raw);
  const key = cacheKey || url;
  if (htmlCache.has(key)) return htmlCache.get(key);
  const p = fetch(url, { headers: { Accept: "text/html" } })
    .then((res) => (res.ok ? res.text() : ""))
    .catch(() => "");
  htmlCache.set(key, p);
  return p;
}

export function clearTemplateHtmlCache(key) {
  if (key) htmlCache.delete(key);
  else htmlCache.clear();
}

/**
 * Hook lấy HTML thô của template.
 * @returns {{ html: string, loading: boolean, error: boolean }}
 */
export function useTemplateHtml(tpl) {
  const raw = String(tpl?.htmlUrl || "").trim();
  const [html, setHtml] = useState(() => (raw && !isHtmlUrl(raw) ? raw : ""));
  const [loading, setLoading] = useState(() => Boolean(raw) && isHtmlUrl(raw));
  const [error, setError] = useState(false);

  useEffect(() => {
    const value = String(tpl?.htmlUrl || "").trim();
    if (!value) { setHtml(""); setLoading(false); setError(false); return; }
    if (!isHtmlUrl(value)) { setHtml(value); setLoading(false); setError(false); return; }

    let active = true;
    setLoading(true); setError(false);
    loadTemplateHtml(tpl).then((text) => {
      if (!active) return;
      setHtml(text || "");
      setError(!text);
      setLoading(false);
    });
    return () => { active = false; };
  }, [raw, tpl?._id]);

  return { html, loading, error };
}

export function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * useBulkSelection — chọn nhiều mục để xoá hàng loạt, DÙNG CHUNG cho các
 * trang quản lý dashboard (Người dùng, Trò chơi, Template, Câu hỏi, Nhiệm vụ,
 * Ticket, Bài tập…). Id là chuỗi bất kỳ (trang Câu hỏi dùng khoá ghép
 * "gameId::questionId").
 *
 * const sel = useBulkSelection();
 *   sel.isSelected(id) / sel.toggle(id) / sel.toggleAll(idsCủaTrang)
 *   sel.selected (mảng id) / sel.count / sel.clear() / sel.allSelected(ids)
 */
export function useBulkSelection() {
  const [selectedSet, setSelectedSet] = useState(() => new Set());
  const toggle = useCallback((id) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  const toggleAll = useCallback((ids) => {
    const list = [...(ids || [])];
    if (list.length === 0) return;
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (list.every((id) => prev.has(id))) list.forEach((id) => next.delete(id));
      else list.forEach((id) => next.add(id));
      return next;
    });
  }, []);
  const clear = useCallback(() => setSelectedSet(new Set()), []);
  const isSelected = useCallback((id) => selectedSet.has(id), [selectedSet]);
  const allSelected = useCallback(
    (ids) => (ids || []).length > 0 && ids.every((id) => selectedSet.has(id)),
    [selectedSet]
  );
  return {
    selected: useMemo(() => [...selectedSet], [selectedSet]),
    count: selectedSet.size,
    toggle, toggleAll, clear, isSelected, allSelected,
  };
}

/**
 * bulkInChunks — gọi hàm xoá bulk (API giới hạn 200 id/lần) cho TOÀN BỘ
 * danh sách id, chia lô tuần tự và gộp kết quả { deleted, deactivated,
 * failed } của mọi lô. Dùng cho nút "Xoá tất cả" ở các trang không có
 * endpoint removeAll riêng (Nhiệm vụ, Ticket, Bài tập).
 */
export async function bulkInChunks(ids, bulkFn, chunkSize = 200) {
  const merged = { deleted: [], deactivated: [], failed: [] };
  const list = [...(ids || [])];
  for (let i = 0; i < list.length; i += chunkSize) {
    const r = await bulkFn(list.slice(i, i + chunkSize));
    if (Array.isArray(r?.deleted)) merged.deleted.push(...r.deleted);
    if (Array.isArray(r?.deactivated)) merged.deactivated.push(...r.deactivated);
    if (Array.isArray(r?.failed)) merged.failed.push(...r.failed);
  }
  return merged;
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = "info") => {
    setToast({ message, type });
    window.clearTimeout(show._t);
    show._t = window.setTimeout(() => setToast(null), 2600);
  }, []);
  return [toast, show];
}

export function useTimedQuestion(questions, onFinish) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  const [timeLeft, setTimeLeft] = useState(q.timeLimit);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => { setTimeLeft(q.timeLimit); setSelected(null); setRevealed(false); }, [idx]);

  useEffect(() => {
    if (revealed) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [timeLeft, revealed]);

  function handleAnswer(optionId) {
    if (revealed) return;
    const isCorrect = optionId === q.correctAnswer;
    const earned = isCorrect ? q.points + Math.round((timeLeft / q.timeLimit) * 40) : 0;
    setSelected(optionId);
    setRevealed(true);
    const nextScore = score + earned;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    setScore(nextScore);
    setCorrectCount(nextCorrect);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(i => i + 1); }
      else {
        const timeUsed = Math.round((Date.now() - startRef.current) / 1000);
        onFinish({ score: nextScore, correct: nextCorrect, timeUsed });
      }
    }, 1300);
    return isCorrect;
  }

  return { idx, q, timeLeft, selected, revealed, score, handleAnswer, total: questions.length };
}