import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { setupService } from '../services/setupService.js';

const FALLBACK_TEMPLATE = { icon: "🎲", ring: "#F4B942" };

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

/* ── HTML game: nhúng trong Mongo (cũ) hoặc là link Firebase (mới) ───────────
   `templates.htmlTemplate` có 2 dạng:
     • HTML thô   → dùng luôn
     • link https://…  → tải nội dung về rồi dùng
   Hàm này chuẩn hoá về HTML thô để mọi nơi chỉ cần 1 kiểu dữ liệu.            */

const htmlCache = new Map();   // url|key -> Promise<string>

export function isHtmlUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

/** Lấy HTML thô của 1 template. Trả "" nếu không có. */
export async function loadTemplateHtml(tpl, cacheKey) {
  const raw = String(tpl?.htmlTemplate || "").trim();
  if (!raw) return "";
  if (!isHtmlUrl(raw)) return raw;               // HTML thô (template cũ)

  const key = cacheKey || raw;
  if (htmlCache.has(key)) return htmlCache.get(key);
  const p = fetch(raw, { headers: { Accept: "text/html" } })
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
  const raw = String(tpl?.htmlTemplate || "").trim();
  const [html, setHtml] = useState(() => (raw && !isHtmlUrl(raw) ? raw : ""));
  const [loading, setLoading] = useState(() => Boolean(raw) && isHtmlUrl(raw));
  const [error, setError] = useState(false);

  useEffect(() => {
    const value = String(tpl?.htmlTemplate || "").trim();
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