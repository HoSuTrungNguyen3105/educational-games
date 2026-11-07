import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { lessonService, publishErrorsOf } from "../services/lessonService.js";
import { uid } from "../services/api.js";

// ── Hằng số canvas — KHỚP ĐÚNG validate phía server (lessonService.js):
// canvas logic cố định 1280×720, mọi phần tử phải nằm trọn trong biên.
export const CANVAS_W = 1280;
export const CANVAS_H = 720;
const MAX_PAGES = 50;
const MAX_ELEMENTS_PER_PAGE = 100;
const HISTORY_LIMIT = 50;      // bám mẫu history.store.js của EditorPage thiệp
const AUTOSAVE_DELAY_MS = 5000;

const clone = (v) => JSON.parse(JSON.stringify(v));
const sigOf = (doc) => JSON.stringify(doc);

/** Kẹp hình học vào biên canvas theo đúng luật server: x+w ≤ 1280, y+h ≤ 720. */
export function clampGeo(geo, el) {
  const w = Math.min(Math.max(20, Number(geo.w ?? el?.w) || 20), CANVAS_W);
  const h = Math.min(Math.max(20, Number(geo.h ?? el?.h) || 20), CANVAS_H);
  const x = Math.min(Math.max(0, Number(geo.x ?? el?.x) || 0), CANVAS_W - w);
  const y = Math.min(Math.max(0, Number(geo.y ?? el?.y) || 0), CANVAS_H - h);
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

// Hình học + props mặc định khi thêm phần tử mới theo từng loại.
const ELEMENT_DEFAULTS = {
  title: { geo: { x: 140, y: 56, w: 1000, h: 110 }, props: { text: "Tiêu đề mới", fontSize: 48, align: "center" } },
  text: { geo: { x: 140, y: 200, w: 1000, h: 170 }, props: { text: "Nhập nội dung…", fontSize: 24 } },
  note: { geo: { x: 140, y: 200, w: 620, h: 160 }, props: { text: "Ghi chú…", fontSize: 20 } },
  image: { geo: { x: 340, y: 130, w: 600, h: 460 }, props: { imageUrl: "", alt: "" } },
  question: { geo: { x: 190, y: 130, w: 900, h: 460 }, props: { prompt: "", qtype: "single", options: [], correctAnswer: "", points: 10 } },
  game: { geo: { x: 290, y: 100, w: 700, h: 520 }, props: { gameId: "" } },
};

const docOf = (lesson) => ({
  title: lesson?.title || "",
  subject: lesson?.subject || "",
  grade: lesson?.grade ?? null,
  description: lesson?.description || "",
  objectives: lesson?.objectives || "",
  pages: Array.isArray(lesson?.pages) && lesson.pages.length > 0
    ? clone(lesson.pages)
    : [{ id: uid("page"), title: "Trang 1", elements: [] }],
});

/**
 * useLessonEditor — toàn bộ trạng thái soạn bài học của AI Studio.
 *
 * Mô hình bám mẫu EditorPage (thiệp): thao tác phần tử trên mảng + history
 * dạng SNAPSHOT — mỗi thay đổi đã "chốt" (commit) đẩy bản sao tài liệu
 * TRƯỚC thay đổi vào ngăn undo (tối đa 50 mốc). Kéo thả/gõ chữ dùng phiên
 * transient: `beginTransient()` ghi lại điểm neo, các `mutateTransient()`
 * sửa liên tục không đẩy history, `endTransient()` mới chốt một mốc —
 * nhờ vậy một lần kéo chuột = đúng một bước undo.
 *
 * Trạng thái lưu là THẬT: chỉ về "saved" sau khi PUT /api/lessons/:id
 * thành công; autosave chạy sau 5 giây ngừng sửa; bản chưa lưu còn được
 * giữ ở sessionStorage để rời trang nhầm cũng không mất bài.
 */
export function useLessonEditor(lessonId) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [doc, setDoc] = useState(null);
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [histState, setHistState] = useState({ canUndo: false, canRedo: false });

  const docRef = useRef(null);
  const savedSigRef = useRef("");
  const savingRef = useRef(false);
  const undoRef = useRef([]);
  const redoRef = useRef([]);
  const transientBaseRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const draftKey = `edu-studio-draft-${lessonId}`;

  const setDocBoth = useCallback((next) => {
    docRef.current = next;
    setDoc(next);
    // dirty là state (không đọc ref lúc render): cập nhật tại mọi điểm
    // tài liệu hoặc mốc đã-lưu thay đổi.
    setDirty(sigOf(next) !== savedSigRef.current);
  }, []);

  const syncHist = useCallback(() => {
    setHistState({ canUndo: undoRef.current.length > 0, canRedo: redoRef.current.length > 0 });
  }, []);

  // ── Nạp bài ──────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    lessonService.get(lessonId)
      .then((lesson) => {
        if (!alive) return;
        if (!lesson) { setLoadError("Không tìm thấy bài học"); setLoading(false); return; }
        const serverDoc = docOf(lesson);
        savedSigRef.current = sigOf(serverDoc);
        let initial = serverDoc;
        // Bản nháp chưa lưu trong sessionStorage (rời trang nhầm/lỗi lưu)
        // được khôi phục đè lên bản server và vẫn tính là "chưa lưu".
        try {
          const raw = sessionStorage.getItem(draftKey);
          if (raw) {
            const draft = JSON.parse(raw);
            if (draft && Array.isArray(draft.pages) && sigOf(draft) !== savedSigRef.current) {
              initial = draft;
              setRestoredDraft(true);
            }
          }
        } catch { /* sessionStorage không khả dụng — bỏ qua */ }
        undoRef.current = []; redoRef.current = []; transientBaseRef.current = null;
        setDocBoth(initial);
        setStatus(lesson.status || "draft");
        setPublishedAt(lesson.publishedAt ?? null);
        setPageId(initial.pages[0]?.id || null);
        setSelectedId(null);
        setSaveError("");
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setLoadError(e?.message || "Không tải được bài học");
        setLoading(false);
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Giữ bản chưa lưu ở sessionStorage; đã khớp bản server thì xoá.
  useEffect(() => {
    if (!doc) return;
    try {
      if (dirty) sessionStorage.setItem(draftKey, JSON.stringify(doc));
      else sessionStorage.removeItem(draftKey);
    } catch { /* bỏ qua */ }
  }, [doc, dirty, draftKey]);

  // ── History (snapshot) ───────────────────────────────────────────────
  const pushHistory = useCallback((snapshot) => {
    undoRef.current.push(snapshot);
    if (undoRef.current.length > HISTORY_LIMIT) undoRef.current.shift();
    redoRef.current = [];
    syncHist();
  }, [syncHist]);

  /** Thay đổi đã chốt: đẩy snapshot hiện tại vào undo rồi mới sửa. */
  const mutate = useCallback((fn) => {
    const cur = docRef.current;
    if (!cur) return;
    // Phiên transient đang mở thì chốt nó trước để không gộp hai mốc.
    if (transientBaseRef.current) {
      if (sigOf(transientBaseRef.current) !== sigOf(cur)) pushHistory(clone(transientBaseRef.current));
      transientBaseRef.current = null;
    }
    pushHistory(clone(cur));
    setDocBoth(fn(clone(cur)));
  }, [pushHistory, setDocBoth]);

  const beginTransient = useCallback(() => {
    if (!transientBaseRef.current && docRef.current) {
      transientBaseRef.current = clone(docRef.current);
    }
  }, []);

  const mutateTransient = useCallback((fn) => {
    const cur = docRef.current;
    if (!cur) return;
    beginTransient();
    setDocBoth(fn(clone(cur)));
  }, [beginTransient, setDocBoth]);

  const endTransient = useCallback(() => {
    const base = transientBaseRef.current;
    transientBaseRef.current = null;
    if (base && docRef.current && sigOf(base) !== sigOf(docRef.current)) {
      pushHistory(base);
    }
  }, [pushHistory]);

  const undo = useCallback(() => {
    const cur = docRef.current;
    if (!cur || undoRef.current.length === 0) return;
    transientBaseRef.current = null;
    const prev = undoRef.current.pop();
    redoRef.current.push(clone(cur));
    setDocBoth(prev);
    syncHist();
  }, [setDocBoth, syncHist]);

  const redo = useCallback(() => {
    const cur = docRef.current;
    if (!cur || redoRef.current.length === 0) return;
    transientBaseRef.current = null;
    const next = redoRef.current.pop();
    undoRef.current.push(clone(cur));
    setDocBoth(next);
    syncHist();
  }, [setDocBoth, syncHist]);

  // ── Lưu (autosave + thủ công) ────────────────────────────────────────
  const save = useCallback(async () => {
    const cur = docRef.current;
    if (!cur || savingRef.current) return false;
    if (sigOf(cur) === savedSigRef.current) return true;
    savingRef.current = true;
    setSaving(true);
    try {
      const { pages, ...meta } = cur;
      await lessonService.update(lessonId, { ...meta, pages });
      savedSigRef.current = sigOf(cur);
      // Trong lúc chờ API, người dùng có thể đã sửa tiếp → tính lại dirty.
      setDirty(docRef.current ? sigOf(docRef.current) !== savedSigRef.current : false);
      setSaveError("");
      setLastSavedAt(new Date());
      return true;
    } catch (e) {
      setSaveError(e?.message || "Lưu thất bại — kiểm tra kết nối rồi thử lại");
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [lessonId]);

  // Autosave: đặt lại đồng hồ sau mỗi thay đổi, bắn khi ngừng sửa 5 giây.
  useEffect(() => {
    if (!doc || !dirty || saving) return;
    autosaveTimerRef.current = setTimeout(() => { save(); }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(autosaveTimerRef.current);
  }, [doc, dirty, saving, save]);

  // ── Publish / unpublish ──────────────────────────────────────────────
  const adoptServerLesson = useCallback((lesson) => {
    const next = docOf(lesson);
    savedSigRef.current = sigOf(next);
    undoRef.current = []; redoRef.current = []; transientBaseRef.current = null;
    syncHist();
    setDocBoth(next);
    setStatus(lesson.status || "draft");
    setPublishedAt(lesson.publishedAt ?? null);
    setSaveError("");
    if (!next.pages.some((p) => p.id === pageId)) setPageId(next.pages[0]?.id || null);
    setSelectedId(null);
  }, [pageId, setDocBoth, syncHist]);

  const publish = useCallback(async () => {
    if (dirty && !(await save())) return { ok: false, errors: null, message: "Chưa lưu được bản mới nhất nên chưa xuất bản" };
    try {
      const lesson = await lessonService.publish(lessonId);
      adoptServerLesson(lesson);
      return { ok: true };
    } catch (e) {
      return { ok: false, errors: publishErrorsOf(e), message: e?.message || "Xuất bản thất bại" };
    }
  }, [dirty, save, lessonId, adoptServerLesson]);

  const unpublish = useCallback(async () => {
    try {
      const lesson = await lessonService.unpublish(lessonId);
      adoptServerLesson(lesson);
      return { ok: true };
    } catch (e) {
      return { ok: false, errors: null, message: e?.message || "Gỡ xuất bản thất bại" };
    }
  }, [lessonId, adoptServerLesson]);

  // ── Trang ────────────────────────────────────────────────────────────
  const currentPage = useMemo(
    () => doc?.pages.find((p) => p.id === pageId) || doc?.pages[0] || null,
    [doc, pageId]
  );

  const selectPage = useCallback((id) => {
    endTransient();
    setPageId(id);
    setSelectedId(null);
  }, [endTransient]);

  const addPage = useCallback(() => {
    if (!docRef.current || docRef.current.pages.length >= MAX_PAGES) return;
    const page = { id: uid("page"), title: `Trang ${docRef.current.pages.length + 1}`, elements: [] };
    mutate((d) => ({ ...d, pages: [...d.pages, page] }));
    setPageId(page.id);
    setSelectedId(null);
  }, [mutate]);

  const duplicatePage = useCallback((id) => {
    const cur = docRef.current;
    if (!cur || cur.pages.length >= MAX_PAGES) return;
    const src = cur.pages.find((p) => p.id === id);
    if (!src) return;
    const page = {
      id: uid("page"),
      title: `${src.title} (bản sao)`.slice(0, 200),
      // id phần tử phải duy nhất TOÀN BÀI (server validate) → sinh lại hết.
      elements: src.elements.map((el) => ({ ...clone(el), id: uid("el") })),
    };
    mutate((d) => {
      const idx = d.pages.findIndex((p) => p.id === id);
      const pages = [...d.pages];
      pages.splice(idx + 1, 0, page);
      return { ...d, pages };
    });
    setPageId(page.id);
    setSelectedId(null);
  }, [mutate]);

  const removePage = useCallback((id) => {
    const cur = docRef.current;
    if (!cur || cur.pages.length <= 1) return;
    mutate((d) => ({ ...d, pages: d.pages.filter((p) => p.id !== id) }));
    if (pageId === id) {
      const idx = cur.pages.findIndex((p) => p.id === id);
      const fallback = cur.pages[idx + 1] || cur.pages[idx - 1];
      setPageId(fallback?.id || null);
    }
    setSelectedId(null);
  }, [mutate, pageId]);

  const renamePage = useCallback((id, title) => {
    mutate((d) => ({
      ...d,
      pages: d.pages.map((p) => (p.id === id ? { ...p, title: String(title || "").slice(0, 200) } : p)),
    }));
  }, [mutate]);

  const movePage = useCallback((id, dir) => {
    mutate((d) => {
      const idx = d.pages.findIndex((p) => p.id === id);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= d.pages.length) return d;
      const pages = [...d.pages];
      [pages[idx], pages[j]] = [pages[j], pages[idx]];
      return { ...d, pages };
    });
  }, [mutate]);

  // ── Phần tử ──────────────────────────────────────────────────────────
  const addElement = useCallback((type, propsOverride = {}) => {
    const cur = docRef.current;
    const page = cur?.pages.find((p) => p.id === (pageId || cur.pages[0]?.id));
    if (!page || page.elements.length >= MAX_ELEMENTS_PER_PAGE) return null;
    const def = ELEMENT_DEFAULTS[type];
    if (!def) return null;
    const maxZ = page.elements.reduce((m, el, i) => Math.max(m, el.z ?? i), -1);
    const el = {
      id: uid("el"), type,
      ...def.geo,
      z: maxZ + 1,
      props: { ...clone(def.props), ...propsOverride },
    };
    mutate((d) => ({
      ...d,
      pages: d.pages.map((p) => (p.id === page.id ? { ...p, elements: [...p.elements, el] } : p)),
    }));
    setSelectedId(el.id);
    return el.id;
  }, [mutate, pageId]);

  const patchElement = useCallback((elId, patch, transient = false) => {
    const applyFn = (d) => ({
      ...d,
      pages: d.pages.map((p) => ({
        ...p,
        elements: p.elements.map((el) => (el.id === elId ? { ...el, ...patch } : el)),
      })),
    });
    if (transient) mutateTransient(applyFn); else mutate(applyFn);
  }, [mutate, mutateTransient]);

  const patchElementProps = useCallback((elId, propsPatch, transient = false) => {
    const applyFn = (d) => ({
      ...d,
      pages: d.pages.map((p) => ({
        ...p,
        elements: p.elements.map((el) => (el.id === elId ? { ...el, props: { ...el.props, ...propsPatch } } : el)),
      })),
    });
    if (transient) mutateTransient(applyFn); else mutate(applyFn);
  }, [mutate, mutateTransient]);

  const removeElement = useCallback((elId) => {
    mutate((d) => ({
      ...d,
      pages: d.pages.map((p) => ({ ...p, elements: p.elements.filter((el) => el.id !== elId) })),
    }));
    if (selectedId === elId) setSelectedId(null);
  }, [mutate, selectedId]);

  const duplicateElement = useCallback((elId) => {
    const cur = docRef.current;
    const page = cur?.pages.find((p) => p.elements.some((el) => el.id === elId));
    if (!page || page.elements.length >= MAX_ELEMENTS_PER_PAGE) return;
    const src = page.elements.find((el) => el.id === elId);
    const geo = clampGeo({ x: src.x + 24, y: src.y + 24, w: src.w, h: src.h }, src);
    const copy = { ...clone(src), id: uid("el"), ...geo };
    mutate((d) => ({
      ...d,
      pages: d.pages.map((p) => (p.id === page.id ? { ...p, elements: [...p.elements, copy] } : p)),
    }));
    setSelectedId(copy.id);
  }, [mutate]);

  /** Đổi lớp: chuẩn hoá z của cả trang về 0..n-1 rồi hoán đổi với phần tử kề. */
  const moveElementLayer = useCallback((elId, dir) => {
    mutate((d) => ({
      ...d,
      pages: d.pages.map((p) => {
        if (!p.elements.some((el) => el.id === elId)) return p;
        const sorted = p.elements
          .map((el, i) => ({ el, z: el.z ?? i }))
          .sort((a, b) => a.z - b.z);
        const idx = sorted.findIndex((s) => s.el.id === elId);
        const j = idx + dir;
        if (idx < 0 || j < 0 || j >= sorted.length) return p;
        [sorted[idx], sorted[j]] = [sorted[j], sorted[idx]];
        const zById = new Map(sorted.map((s, i) => [s.el.id, i]));
        return { ...p, elements: p.elements.map((el) => ({ ...el, z: zById.get(el.id) })) };
      }),
    }));
  }, [mutate]);

  const setMeta = useCallback((patch, transient = false) => {
    const applyFn = (d) => ({ ...d, ...patch });
    if (transient) mutateTransient(applyFn); else mutate(applyFn);
  }, [mutate, mutateTransient]);

  const selectedElement = useMemo(() => {
    if (!currentPage || !selectedId) return null;
    return currentPage.elements.find((el) => el.id === selectedId) || null;
  }, [currentPage, selectedId]);

  // Chỉ báo "saved" khi API đã xác nhận (sig khớp) và không có lỗi lưu.
  const saveState = loading ? "loading" : saving ? "saving" : saveError ? "error" : dirty ? "dirty" : "saved";

  return {
    loading, loadError, lessonId,
    doc, meta: doc, pages: doc?.pages || [],
    status, publishedAt, restoredDraft,
    currentPage, pageId, selectPage,
    selectedId, selectElement: setSelectedId, selectedElement,
    dirty, saving, saveError, saveState, lastSavedAt, save,
    canUndo: histState.canUndo, canRedo: histState.canRedo,
    undo, redo,
    beginTransient, endTransient,
    setMeta,
    addPage, duplicatePage, removePage, renamePage, movePage,
    addElement, patchElement, patchElementProps, removeElement, duplicateElement, moveElementLayer,
    publish, unpublish,
  };
}
