/**
 * PdfEditorPage.jsx — trang "Chỉnh sửa PDF" của khu quản trị giáo viên.
 *
 * Luồng: tải file (client-only) → xem trước theo trang → thêm/sửa đối tượng
 * (Undo/Redo) → xuất file MỚI bằng pdf-lib. File gốc chỉ được đọc, không bao
 * giờ bị ghi đè (yêu cầu §3.3, §3.4).
 *
 * Kiến trúc tách 3 lớp theo §4:
 *   pdfLoader.js   — đọc/render PDF (PDF.js)
 *   PageStage.jsx  — lớp phủ thao tác (di chuyển, kéo cỡ, vẽ mới)
 *   exportPdf.js   — dựng + kiểm tra file xuất (pdf-lib)
 * Tệp này chỉ điều phối giao diện & trạng thái.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleQuestionMark,
  Eraser,
  FileDown,
  Files,
  Highlighter,
  Image as ImageIcon,
  Info,
  Italic,
  Maximize,
  Minus,
  MousePointer2,
  RefreshCw,
  RotateCw,
  ScanLine,
  Square,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  TextCursorInput,
  Trash2,
  TriangleAlert,
  Type,
  Undo2,
  Redo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { ConfirmModal, Loader, ManagementHeader, Modal } from "../../../components/ui";
import { useConfirm } from "../../../hooks/useConfirm.js";
import {
  destroyPdf,
  extractEditableText,
  formatSize,
  openPdf,
  pdfOpenError,
  validatePdfFile,
} from "./pdfLoader.js";
import { collectSrcFonts, resolveTextFace, wantsSrcFont } from "./srcFonts.js";
import { useEditorDoc } from "./useEditorDoc.js";
import {
  FONT_FAMILIES,
  ensureFontLoaded,
  familyById,
  hasFace,
} from "./fonts.js";
import {
  buildPdf,
  downloadBytes,
  exportNameFor,
  verifyExport,
} from "./exportPdf.js";
import {
  DEFAULT_LINE_HEIGHT,
  FONT_ASCENT,
  FONT_DESCENT,
  clamp,
  createImage,
  createRedact,
  createText,
  displaySize,
  nextId,
  objectBBox,
  pdfToDisplay,
  rotateObject,
  textBoxToDisplay,
  textMeasure,
  withTextMetrics,
} from "./model.js";
import PageStage from "./PageStage.jsx";
import "./pdfEditor.css";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const TOOLS = [
  { id: "select", label: "Chọn", Icon: MousePointer2, hint: "Chọn / kéo di chuyển đối tượng" },
  { id: "edit-text", label: "Chọn chữ", Icon: TextCursorInput, hint: "Kéo bôi đen chữ gốc trong PDF rồi bấm “Sửa chữ đã chọn” (Ctrl+C để sao chép)" },
  { id: "text", label: "Văn bản", Icon: Type, hint: "Nhấp lên trang để đặt chữ" },
  { id: "image", label: "Hình ảnh", Icon: ImageIcon, hint: "Chèn ảnh từ thiết bị" },
  { id: "rect", label: "Chữ nhật", Icon: Square, hint: "Kéo để vẽ khung" },
  { id: "line", label: "Đường kẻ", Icon: Minus, hint: "Kéo để vẽ đường" },
  { id: "highlight", label: "Highlight", Icon: Highlighter, hint: "Kéo để đánh dấu" },
  { id: "redact", label: "Vùng che", Icon: Eraser, hint: "Kéo để che nội dung cũ" },
];

const TEXT_ALIGN = [
  { id: "left", label: "Căn trái", Icon: TextAlignStart },
  { id: "center", label: "Căn giữa", Icon: TextAlignCenter },
  { id: "right", label: "Căn phải", Icon: TextAlignEnd },
];

function ToolButton({ active, disabled, title, onClick, Icon, label }) {
  return (
    <button
      type="button"
      className={`edu-pdf-tool ${active ? "is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

function PropRow({ label, children }) {
  return (
    <label className="edu-pdf-prop">
      <span className="edu-pdf-prop-label">{label}</span>
      <span className="edu-pdf-prop-control">{children}</span>
    </label>
  );
}

export default function PdfEditorPage({ showToast }) {
  const {
    doc, dirty, load, commit, live, snapshot, undo, redo, reset,
    markExported, canUndo, canRedo,
  } = useEditorDoc();
  const { askConfirm, confirmProps } = useConfirm();

  /* ── Trạng thái phiên làm việc ───────────────────────────────────────── */
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [docVersion, setDocVersion] = useState(0);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [pageCache, setPageCache] = useState({ key: null, page: null, error: false });
  const [zoom, setZoom] = useState({ mode: "fit-width", scale: 1 });
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });

  const [tool, setTool] = useState("select");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editSelection, setEditSelection] = useState(null);
  const [sideTab, setSideTab] = useState("object"); // object | pages | text
  const [analysis, setAnalysis] = useState(null);
  const [editTargets, setEditTargets] = useState(null);
  // Registry font nhúng gốc của tài liệu (collectSrcFonts) — chữ sửa giữ đúng
  // font PDF. Nằm NGOÀI doc snapshot để lịch sử undo không phình theo bytes font.
  const [srcFonts, setSrcFonts] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const pdfRef = useRef(null);
  const bytesRef = useRef(null);
  const stageRef = useRef(null);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const contRef = useRef(null);
  const ignoreHashRef = useRef(false);
  const stageApiRef = useRef(null);
  const srcFontsRef = useRef(null); // { version, map } — cache theo tài liệu

  // Trang render: id trang trong mảng gốc (giữ nguyên khi sắp xếp lại).
  const order = doc?.order || [];
  const safeIndex = clamp(pageIndex, 0, Math.max(0, order.length - 1));
  const pageId = order[safeIndex];
  const pageMeta = pageId === undefined ? null : doc.pages[pageId];
  const rotation = pageMeta
    ? (((pageMeta.rotate + (doc.deltas[pageId] || 0)) % 360) + 360) % 360
    : 0;
  const display = pageMeta ? displaySize(pageMeta, rotation) : { w: 1, h: 1 };
  const objects = useMemo(
    () => (pageId === undefined || !doc ? [] : doc.objects.filter((o) => o.page === pageId)),
    [doc, pageId],
  );
  const selected = selectedId ? objects.find((o) => o.id === selectedId) || null : null;

  /* Trang PDF.js đang hiển thị: khớp key thì dùng, sai key = còn đang tải.
   * Không setState đồng bộ trong effect (tránh cascade render) — chỉ ghi
   * kết quả trong callback async của getPage(). */
  const pageKey = `${docVersion}:${pageId}`;
  const currentPage = pageCache.key === pageKey ? pageCache.page : null;
  const pageLoadFailed = pageCache.key === pageKey && pageCache.error;

  const dpr = useMemo(
    () => (typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1),
    [],
  );

  /* ── Thanh công cụ: phóng to / vừa khung ─────────────────────────────── */
  const scale = useMemo(() => {
    if (zoom.mode === "custom") return zoom.scale;
    const availW = Math.max(80, stageSize.w - 8);
    const availH = Math.max(80, stageSize.h - 8);
    if (zoom.mode === "fit-page") {
      return clamp(Math.min(availW / display.w, availH / display.h), 0.05, 6);
    }
    return clamp(availW / display.w, 0.05, 6);
  }, [zoom, stageSize, display.w, display.h]);

  /* ── Đo chữ + mặt font: ưu tiên font gốc nhúng, cùng lựa chọn với xuất file ── */
  const measureFor = (obj) => {
    if (!obj || obj.type !== "text") return () => 0;
    const face = resolveTextFace(obj, srcFonts);
    return textMeasure(face.cssFamily, obj.fontSize, face.bold, face.italic);
  };
  const faceFor = (obj) => {
    if (!obj || obj.type !== "text") return null;
    const face = resolveTextFace(obj, srcFonts);
    return { cssFamily: face.cssFamily, weight: face.weight, style: face.style };
  };

  // Đọc font nhúng của trang (gộp vào registry chung của tài liệu, không đọc
  // lại tên đã có). Gọi trước khi trích dòng chữ / phân tích / xuất file.
  const loadSrcFonts = async (page) => {
    const cached = srcFontsRef.current?.version === docVersion ? srcFontsRef.current.map : {};
    const map = { ...cached, ...(await collectSrcFonts(page, cached)) };
    srcFontsRef.current = { version: docVersion, map };
    setSrcFonts(map);
    return map;
  };

  /* ── Mở / đóng tài liệu ──────────────────────────────────────────────── */
  const resetToIdle = () => {
    destroyPdf(pdfRef.current);
    pdfRef.current = null;
    bytesRef.current = null;
    setStatus("idle");
    setError("");
    setFileName("");
    setPageIndex(0);
    setSelectedId(null);
    setEditingId(null);
    setAnalysis(null);
    setEditTargets(null);
    setSrcFonts(null);
    srcFontsRef.current = null;
    setTool("select");
    load(null);
  };

  const openFile = async (file) => {
    if (!file) return;
    if (
      dirty &&
      !window.confirm("Bạn có thay đổi chưa xuất. Mở file khác sẽ bỏ các thao tác này. Tiếp tục?")
    ) {
      return;
    }
    const invalid = validatePdfFile(file);
    if (invalid) {
      setStatus("error");
      setError(invalid);
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { pdfDoc, pages } = await openPdf(bytes);
      destroyPdf(pdfRef.current);
      pdfRef.current = pdfDoc;
      bytesRef.current = bytes;
      setFileName(file.name);
      load({
        fileName: file.name,
        pages,
        order: pages.map((p) => p.index),
        deltas: {},
        objects: [],
      });
      setPageIndex(0);
      setPageInput("1");
      setSelectedId(null);
      setEditingId(null);
      setAnalysis(null);
      setEditTargets(null);
      setSrcFonts(null);
      srcFontsRef.current = null;
      setTool("select");
      setZoom({ mode: "fit-width", scale: 1 });
      setDocVersion((v) => v + 1);
      setStatus("ready");
    } catch (err) {
      console.warn("[pdf-editor] mở file lỗi:", err);
      bytesRef.current = null;
      setStatus("error");
      setError(pdfOpenError(err));
    }
  };

  const handlePdfInput = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) openFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) openFile(file);
  };

  // Đóng tài liệu khi rời trang (giải phóng worker + canvas).
  useEffect(() => () => destroyPdf(pdfRef.current), []);

  /* ── Nạp trang hiện tại từ PDF.js ───────────────────────────────────── */
  useEffect(() => {
    if (status !== "ready" || !pdfRef.current || pageId === undefined) return undefined;
    let cancelled = false;
    pdfRef.current
      .getPage(pageId + 1)
      .then((p) => { if (!cancelled) setPageCache({ key: pageKey, page: p, error: false }); })
      .catch((err) => {
        console.warn("[pdf-editor] không lấy được trang:", err);
        if (!cancelled) setPageCache({ key: pageKey, page: null, error: true });
      });
    return () => { cancelled = true; };
  }, [pageKey, pageId, status]);

  /* ── Chữ gốc theo dòng: dữ liệu cho vùng bôi đen → chữ sửa được ───────── */
  // Dòng chữ gốc (toạ độ PDF) → hộp màn hình + metadata để dựng chữ thay thế.
  const buildTextLines = (items) =>
    items.map((it, i) => {
      const geo = { rot: rotation, W: pageMeta.width, H: pageMeta.height };
      const box = textBoxToDisplay(it, geo);
      const bp = pdfToDisplay(it.startX ?? it.x0, it.baseline ?? it.y0, geo);
      return {
        key: `${pageId}:${i}`,
        text: it.text ?? it.str ?? "",
        fontSize: it.fontSize || 12,
        bold: Boolean(it.bold),
        italic: Boolean(it.italic),
        family: it.family || "sans",
        fontKey: it.fontKey || null,
        parts: it.parts || [],
        box,
        baselineY: bp.y,
      };
    });

  const targetsKey = `${docVersion}:${pageId}:${rotation}`;
  useEffect(() => {
    if (status !== "ready" || !pdfRef.current || pageId === undefined) {
      return undefined;
    }
    if (editTargets?.key === targetsKey) return undefined;
    let cancelled = false;
    // Không setState đồng bộ trong effect — "đang đọc" suy ra từ key chưa khớp
    // (cùng mẫu pageCache ở trên); chỉ ghi kết quả trong callback async.
    (async () => {
      try {
        const page = await pdfRef.current.getPage(pageId + 1);
        const map = await loadSrcFonts(page);
        const items = await extractEditableText(page, map);
        if (!cancelled) {
          setEditTargets({ key: targetsKey, loading: false, lines: buildTextLines(items) });
        }
      } catch (err) {
        console.warn("[pdf-editor] đọc chữ gốc lỗi:", err);
        if (!cancelled) setEditTargets({ key: targetsKey, loading: false, error: true, lines: [] });
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetsKey, status, pageId]);

  /* ── Đo khung làm việc (tính "vừa khung nhìn") ───────────────────────── */
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || status !== "ready") return undefined;
    const measureEl = () => {
      const cs = window.getComputedStyle(el);
      setStageSize({
        w: el.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0),
        h: el.clientHeight - parseFloat(cs.paddingTop || 0) - parseFloat(cs.paddingBottom || 0),
      });
    };
    measureEl();
    const ro = new ResizeObserver(measureEl);
    ro.observe(el);
    return () => ro.disconnect();
  }, [status]);

  // Đồng bộ ô nhập số trang khi đổi trang: điều chỉnh state ngay trong lúc
  // render (mẫu React khuyến nghị) thay vì setState trong effect.
  const [lastIndexShown, setLastIndexShown] = useState(safeIndex);
  if (lastIndexShown !== safeIndex) {
    setLastIndexShown(safeIndex);
    setPageInput(String(safeIndex + 1));
  }

  /* ── Cảnh báo khi rời trang còn thay đổi chưa xuất ───────────────────── */
  useEffect(() => {
    if (!dirty) return undefined;
    // Ghi nhớ URL hiện tại ngay khi effect chạy (không đọc/ghi ref khi render)
    // để khôi phục đúng chỗ nếu người dùng chọn “ở lại”.
    const lastHash = window.location.hash;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onHashChange = () => {
      if (ignoreHashRef.current) {
        ignoreHashRef.current = false;
        return;
      }
      const leave = window.confirm(
        "Bạn có thay đổi chưa xuất thành file. Rời trang bây giờ?",
      );
      if (leave) return;
      ignoreHashRef.current = true;
      window.location.hash = lastHash;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [dirty]);

  /* ── Thao tác với đối tượng ──────────────────────────────────────────── */
  const applyObject = (nextObj, history) => {
    const ready =
      nextObj.type === "text" ? withTextMetrics(nextObj, measureFor(nextObj)) : nextObj;
    const nextDoc = {
      ...doc,
      objects: doc.objects.map((o) => (o.id === ready.id ? ready : o)),
    };
    if (history) commit(nextDoc);
    else live(nextDoc);
  };

  const updateSelected = (patch, history = true) => {
    if (!selected) return;
    applyObject({ ...selected, ...patch }, history);
  };

  const handleCreate = async (obj) => {
    if (obj.type === "text") {
      try {
        await ensureFontLoaded(obj.fontFamily, obj.bold, obj.italic);
      } catch { /* vẫn hiển thị được bằng font dự phòng */ }
      obj = withTextMetrics(obj, measureFor(obj));
    }
    commit({ ...doc, objects: [...doc.objects, obj] });
    setSelectedId(obj.id);
    setSideTab("object");
    setTool("select");
    if (obj.type === "text") setEditingId(obj.id);
  };

  const handleTextInput = (id, text) => {
    const key = `text:${id}`;
    if (contRef.current !== key) {
      contRef.current = key;
      snapshot();
    }
    const obj = doc.objects.find((o) => o.id === id);
    if (!obj) return;
    applyObject({ ...obj, text }, false);
  };

  const endTextInput = () => { contRef.current = null; };

  const beginCont = (key) => {
    if (contRef.current !== key) {
      contRef.current = key;
      snapshot();
    }
  };
  const endCont = () => { contRef.current = null; };

  const deleteObject = (id) => {
    if (!id) return;
    const target = doc.objects.find((o) => o.id === id);
    const ids = new Set([id]);
    // Cặp "vùng che + chữ thay thế": xoá một nửa là xoá cả cặp → chữ gốc hiện lại.
    if (target?.pairId) {
      doc.objects.forEach((o) => { if (o.pairId === target.pairId) ids.add(o.id); });
    }
    commit({ ...doc, objects: doc.objects.filter((o) => !ids.has(o.id)) });
    if (ids.has(selectedId)) setSelectedId(null);
    if (ids.has(editingId)) setEditingId(null);
    if (target?.pairId) showToast("Đã bỏ chữ sửa — chữ gốc hiển thị lại.", "info");
  };

  /* ── Sửa chữ gốc: che dòng cũ + dựng chữ mới sửa được tại chỗ ─────────── */
  // selRange: khoảng ký tự được bôi đen trong dòng (chọn sẵn trong ô sửa chữ).
  // baseDoc: cho phép chuyển nhiều dòng liên tiếp trong một lượt bôi đen.
  const handleEditOriginal = async (line, selRange = null, opts = {}, baseDoc = doc) => {
    if (!baseDoc || !pageMeta || !line?.box) return baseDoc;
    const colors =
      (await stageApiRef.current?.sampleColors(line.box)) || { bg: "#ffffff", fg: "#1d2327" };
    // Font gốc nhúng của dòng chữ — dùng lại được thì giữ nguyên nét chữ/độ đậm.
    const entry = line.fontKey ? srcFonts?.[line.fontKey] : null;
    const useSrc = Boolean(entry?.bytes && entry.cssFamily);
    const family = familyById(line.family);
    let bold = line.bold;
    let italic = line.italic;
    if (!useSrc && !hasFace(family, bold, italic)) {
      if (hasFace(family, bold, false)) italic = false;
      else if (hasFace(family, false, italic)) bold = false;
      else { bold = false; italic = false; }
    }
    const fontSize = clamp(Math.round(line.fontSize * 10) / 10, 6, 200);
    // Đặt khung chữ sao cho BASELINE dòng mới trùng baseline dòng gốc.
    const lh = fontSize * DEFAULT_LINE_HEIGHT;
    const halfLeading = (lh - fontSize * (FONT_ASCENT + FONT_DESCENT)) / 2;
    const y = line.baselineY - halfLeading - fontSize * FONT_ASCENT;
    const pairId = nextId();
    try {
      if (useSrc) await entry.ready;
      // Font thay thế cũng nạp sẵn — gõ ký tự font gốc thiếu là đổi font tức thì.
      await ensureFontLoaded(family.id, bold, italic);
    } catch { /* font dự phòng vẫn sửa được */ }
    // Đo bằng ĐÚNG mặt font sẽ hiển thị (font gốc hoặc DejaVu): item.width của
    // pdf.js có thể hẹp hơn mực chữ thật — vùng che phải phủ đủ phần chữ mới.
    const measureOrig = textMeasure(
      useSrc ? entry.cssFamily : family.cssFamily,
      fontSize,
      useSrc ? false : bold,
      useSrc ? false : italic,
    );
    const naturalW = measureOrig(line.text);
    const coverW = Math.max(line.box.w, naturalW) + 3;
    const cover = createRedact(
      pageId,
      line.box.x - 0.75,
      line.box.y - 0.75,
      coverW,
      line.box.h + 1.5,
      { fill: colors.bg, pairId },
    );
    let textObj = createText(pageId, line.box.x + 1, y, {
      text: line.text,
      fontSize,
      fontFamily: family.id,
      bold,
      italic,
      color: colors.fg,
      // Khung đủ rộng để nguyên dòng gốc không bị xuống dòng.
      w: Math.max(60, line.box.w + 16, naturalW + 8),
      pairId,
      srcFontKey: useSrc ? line.fontKey : null,
      useSrcFont: true,
    });
    textObj = withTextMetrics(textObj, measureFor(textObj));
    const nextDoc = { ...baseDoc, objects: [...baseDoc.objects, cover, textObj] };
    commit(nextDoc);
    if (opts.edit !== false) {
      setSelectedId(textObj.id);
      setEditingId(textObj.id);
      setSideTab("object");
      setEditSelection(
        selRange ? { id: textObj.id, start: selRange.start, end: selRange.end } : null,
      );
    }
    return nextDoc;
  };

  /* ── Vùng bôi đen trên lớp chữ thật → chuyển thành chữ sửa được ───────── */
  const handleConvertSelection = async (spans) => {
    if (!spans?.length || !doc || pageId === undefined) return;
    let lines = editTargets?.key === targetsKey ? editTargets.lines : null;
    if (!lines) {
      try {
        const page = await pdfRef.current.getPage(pageId + 1);
        const map = await loadSrcFonts(page);
        const items = await extractEditableText(page, map);
        lines = buildTextLines(items);
        setEditTargets({ key: targetsKey, loading: false, lines });
      } catch (err) {
        console.warn("[pdf-editor] đọc chữ gốc lỗi:", err);
        showToast("Không đọc được lớp chữ của trang này.", "error");
        return;
      }
    }
    // Mỗi dòng chứa span bị bôi đen → một cặp "che + chữ sửa"; khoảng ký tự
    // bôi đen được chọn sẵn trong ô sửa của dòng đầu tiên.
    const picked = [];
    for (const line of lines) {
      const parts = (line.parts || []).filter((p) => spans.some((s) => s.index === p.i));
      if (!parts.length) continue;
      let start = Infinity;
      let end = -1;
      for (const p of parts) {
        const s = spans.find((x) => x.index === p.i);
        const spanLen = p.end - p.start;
        start = Math.min(start, p.start + Math.max(0, Math.min(s.start, spanLen)));
        end = Math.max(end, p.start + Math.max(0, Math.min(s.end, spanLen)));
      }
      picked.push({ line, start, end });
    }
    if (!picked.length) {
      showToast("Vùng bôi đen không nằm trong dòng chữ gốc nào của trang.", "info");
      return;
    }
    let acc = doc;
    for (let i = 0; i < picked.length; i += 1) {
      acc = await handleEditOriginal(
        picked[i].line,
        i === 0 ? { start: picked[i].start, end: picked[i].end } : null,
        { edit: i === 0 },
        acc,
      );
    }
    if (picked.length > 1) {
      showToast(`Đã chuyển ${picked.length} dòng chữ đã bôi đen thành chữ sửa được — giữ font gốc.`, "success");
    }
  };

  /* ── Phím tắt: Ctrl+Z / Ctrl+Y, Delete, Esc ──────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteObject(selectedId);
        return;
      }
      if (e.key === "Escape") {
        setEditingId(null);
        setSelectedId(null);
        setTool("select");
        window.getSelection()?.removeAllRanges();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, editingId, undo, redo, doc]);

  const handleSelect = (id, opts) => {
    setSelectedId(id);
    if (!id) {
      setEditingId(null);
      return;
    }
    if (opts?.edit) startTextEdit(id);
  };

  const startTextEdit = async (id) => {
    const obj = doc.objects.find((o) => o.id === id);
    if (!obj || obj.type !== "text") return;
    try {
      await ensureFontLoaded(obj.fontFamily, obj.bold, obj.italic);
    } catch { /* bỏ qua */ }
    setEditingId(id);
    setSideTab("object");
  };

  const changeFontProp = async (patch) => {
    if (!selected || selected.type !== "text") return;
    const merged = { ...selected, ...patch };
    try {
      await ensureFontLoaded(merged.fontFamily, merged.bold, merged.italic);
    } catch { /* bỏ qua */ }
    applyObject({ ...selected, ...patch }, true);
  };

  /* ── Công cụ ─────────────────────────────────────────────────────────── */
  const pickTool = async (id) => {
    if (id === "image") {
      imageInputRef.current?.click();
      return;
    }
    if (id === "text" || id === "edit-text") {
      // Nạp font trước để đo/ghi dòng chữ đúng ngay từ ký tự đầu tiên.
      try {
        await ensureFontLoaded("sans");
      } catch { /* bỏ qua */ }
    }
    setTool(id);
    setSelectedId(null);
    setEditingId(null);
  };

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Không đọc được tệp ảnh."));
      reader.readAsDataURL(file);
    });

  const loadImageEl = (src) =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Không decode được ảnh."));
      img.src = src;
    });

  const handleImageInput = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !pageMeta) return;
    if (file.size > MAX_IMAGE_BYTES) {
      showToast(`Ảnh quá lớn (${formatSize(file.size)}). Tối đa 8 MB.`, "error");
      return;
    }
    try {
      let src = await readAsDataUrl(file);
      let w = 0;
      let h = 0;
      if (/^data:image\/(png|jpe?g)$/i.test(src)) {
        const img = await loadImageEl(src);
        w = img.naturalWidth;
        h = img.naturalHeight;
      } else {
        // Ảnh webp/gif/bmp/svg → đổi sang PNG để pdf-lib nhúng được.
        const img = await loadImageEl(src);
        w = img.naturalWidth;
        h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0);
        src = canvas.toDataURL("image/png");
      }
      if (!w || !h) throw new Error("Ảnh không có kích thước.");

      // Chèn ở giữa trang, co vừa ~45% bề rộng trang.
      const maxW = display.w * 0.45;
      const maxH = display.h * 0.45;
      const k = Math.min(maxW / w, maxH / h, 3);
      const dw = Math.max(20, w * k);
      const dh = Math.max(20, h * k);
      const obj = createImage(
        pageId,
        (display.w - dw) / 2,
        (display.h - dh) / 2,
        src,
        dw,
        dh,
      );
      commit({ ...doc, objects: [...doc.objects, obj] });
      setSelectedId(obj.id);
      setSideTab("object");
      setTool("select");
      showToast("Đã thêm ảnh vào trang.", "success");
    } catch (err) {
      console.warn("[pdf-editor] chèn ảnh lỗi:", err);
      showToast(err?.message || "Không thêm được ảnh.", "error");
    }
  };

  /* ── Thao tác trang: xoay / xoá / sắp xếp ────────────────────────────── */
  // Nhận idx tường minh (không dùng pageIndex đang hiển thị) để các nút trong
  // danh sách trang thao tác đúng trang được bấm, kể cả khi chưa nhảy tới đó.
  const pageRotationAt = (idx) => {
    const pid = order[idx];
    if (pid === undefined || !doc.pages[pid]) return 0;
    return (((doc.pages[pid].rotate + (doc.deltas[pid] || 0)) % 360) + 360) % 360;
  };

  const rotatePageAt = (idx) => {
    const pid = order[idx];
    const meta = doc.pages[pid];
    if (!meta) return;
    const from = pageRotationAt(idx);
    const to = (from + 90) % 360;
    const rotated = doc.objects.map((o) =>
      o.page === pid ? rotateObject(o, from, to, meta.width, meta.height) : o,
    );
    commit({
      ...doc,
      deltas: { ...doc.deltas, [pid]: ((doc.deltas[pid] || 0) + 90) % 360 },
      objects: rotated,
    });
  };

  const rotateCurrentPage = () => rotatePageAt(safeIndex);

  const deletePageAt = (idx) => {
    if (order.length <= 1) {
      showToast("Tài liệu phải còn ít nhất một trang.", "error");
      return;
    }
    askConfirm({
      title: "Xoá trang",
      message: `Xoá trang ${idx + 1} khỏi file xuất? (vẫn hoàn tác được)`,
      confirmLabel: "Xoá trang",
      onConfirm: () => {
        const nextOrder = order.filter((_, i) => i !== idx);
        commit({ ...doc, order: nextOrder });
        setPageIndex(Math.min(idx, nextOrder.length - 1));
        showToast("Đã xoá trang.", "success");
      },
    });
  };

  const deleteCurrentPage = () => deletePageAt(safeIndex);

  const movePageAt = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const nextOrder = [...order];
    [nextOrder[idx], nextOrder[j]] = [nextOrder[j], nextOrder[idx]];
    commit({ ...doc, order: nextOrder });
    setPageIndex(j);
  };

  const moveCurrentPage = (dir) => movePageAt(safeIndex, dir);

  const restoreOriginal = () => {
    askConfirm({
      title: "Khôi phục file gốc",
      message:
        "Mọi thao tác chỉnh sửa trong phiên này sẽ bị bỏ, trả tài liệu về trạng thái vừa mở. File trên máy bạn không bị đụng tới.",
      confirmLabel: "Khôi phục",
      onConfirm: () => {
        reset();
        setPageIndex(0);
        setSelectedId(null);
        setEditingId(null);
        setAnalysis(null);
        setEditTargets(null);
        setTool("select");
        setZoom({ mode: "fit-width", scale: 1 });
        showToast("Đã khôi phục tài liệu gốc.", "success");
      },
    });
  };

  /* ── Phân tích chữ gốc + vùng che ────────────────────────────────────── */
  const runAnalysis = async () => {
    if (!pdfRef.current || !pageMeta) return;
    setAnalysis({ pageId, loading: true });
    try {
      const page = await pdfRef.current.getPage(pageId + 1);
      const map = await loadSrcFonts(page);
      const items = await extractEditableText(page, map);
      setAnalysis({ pageId, loading: false, boxes: buildTextLines(items), count: items.length });
    } catch (err) {
      console.warn("[pdf-editor] phân tích chữ lỗi:", err);
      setAnalysis({ pageId, loading: false, error: "Không đọc được lớp chữ của trang này." });
    }
  };

  const coverTextLines = () => {
    if (!analysis?.boxes?.length) return;
    const added = analysis.boxes.map((b) => createRedact(pageId, b.box.x, b.box.y, b.box.w, b.box.h));
    commit({ ...doc, objects: [...doc.objects, ...added] });
    setSideTab("object");
    showToast(`Đã thêm ${added.length} vùng che — giờ thêm chữ mới lên trên.`, "success");
  };

  /* ── Xuất file ───────────────────────────────────────────────────────── */
  const handleExport = async () => {
    if (exporting || !doc) return;
    if (!order.length) {
      showToast("Không có trang nào để xuất.", "error");
      return;
    }
    setExporting(true);
    try {
      const bytes = await buildPdf({ doc, originalBytes: bytesRef.current, srcFonts });
      await verifyExport(bytes, order.length);
      const name = exportNameFor(fileName);
      downloadBytes(bytes, name);
      markExported();
      showToast(`Đã xuất ${name}`, "success");
    } catch (err) {
      console.error("[pdf-editor] xuất file lỗi:", err);
      showToast(
        err?.message || "Xuất file PDF thất bại — phiên chỉnh sửa vẫn được giữ nguyên.",
        "error",
      );
    } finally {
      setExporting(false);
    }
  };

  /* ── Điều hướng trang / zoom ─────────────────────────────────────────── */
  const gotoPage = (n) => setPageIndex(clamp(n, 0, Math.max(0, order.length - 1)));
  const commitPageInput = () => {
    const n = Number.parseInt(pageInput, 10);
    if (Number.isNaN(n)) setPageInput(String(safeIndex + 1));
    else gotoPage(n - 1);
  };
  const zoomBy = (k) => setZoom({ mode: "custom", scale: clamp(scale * k, 0.1, 6) });

  /* ── Vẽ ──────────────────────────────────────────────────────────────── */
  // Input chọn file PDF — dùng chung cho 2 trạng thái (mới mở / đang chỉnh).
  const pdfInput = (
    <input
      ref={pdfInputRef}
      type="file"
      accept="application/pdf,.pdf"
      hidden
      onChange={handlePdfInput}
    />
  );

  const header = (
    <ManagementHeader
      title="Chỉnh sửa PDF"
      subtitle="Tải tài liệu lên, sửa chữ hoặc thêm đối tượng rồi xuất file PDF mới — file gốc không bị thay đổi."
    >
      <button type="button" className="edu-pdf-btn" onClick={() => setHelpOpen(true)}>
        <CircleQuestionMark />
        <span>Hướng dẫn</span>
      </button>
      {status === "ready" && (
        <button
          type="button"
          className="edu-pdf-btn edu-pdf-btn--primary"
          onClick={handleExport}
          disabled={exporting}
        >
          <FileDown />
          <span>{exporting ? "Đang xuất..." : "Xuất PDF"}</span>
        </button>
      )}
    </ManagementHeader>
  );

  if (status === "idle" || status === "error") {
    return (
      <>
        {header}
        {status === "error" && (
          <div className="edu-pdf-alert" role="alert">
            <TriangleAlert />
            <div className="min-w-0">
              <p className="edu-pdf-alert-title">Không mở được tài liệu</p>
              <p className="edu-pdf-alert-text">{error}</p>
            </div>
            <button type="button" className="edu-pdf-btn" onClick={resetToIdle}>
              Chọn file khác
            </button>
          </div>
        )}
        <div
          className={`edu-pdf-drop ${dragOver ? "is-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="edu-pdf-drop-icon" />
          <p className="edu-pdf-drop-title">Kéo thả file PDF vào đây</p>
          <p className="edu-pdf-drop-sub">
            hoặc nhấp để chọn file từ thiết bị · tối đa {formatSize(30 * 1024 * 1024)} · xử lý
            hoàn toàn trên máy bạn, không tải lên server
          </p>
          <button
            type="button"
            className="edu-pdf-btn edu-pdf-btn--primary"
            onClick={() => pdfInputRef.current?.click()}
          >
            Chọn file PDF
          </button>
          {pdfInput}
        </div>
        <div className="edu-pdf-quickhelp">
          <p>
            <Info /> Công cụ cho phép <b>bôi đen chữ gốc</b> ngay trên trang (như trình xem PDF
            thường) rồi bấm “Sửa chữ đã chọn” để thay nội dung — chữ mới giữ đúng font, cỡ chữ,
            màu và độ đậm của dòng gốc; thêm văn bản, hình ảnh, khung, đường kẻ, vùng che; xoay /
            xoá / sắp xếp trang; rồi xuất file PDF mới. File gốc trên máy bạn không bị thay đổi.
          </p>
        </div>
      </>
    );
  }

  if (status === "loading") {
    return (
      <>
        {header}
        <div className="edu-pdf-center">
          <Loader label="Đang mở tài liệu PDF..." />
        </div>
      </>
    );
  }

  const tabDefs = [
    { id: "object", label: "Đối tượng", Icon: MousePointer2 },
    { id: "pages", label: "Trang", Icon: Files },
    { id: "text", label: "Chữ gốc", Icon: ScanLine },
  ];

  return (
    <>
      {header}

      <div className="edu-pdf-editor">
        {/* ── Thanh công cụ ─────────────────────────────────────────────── */}
        <div className="edu-pdf-toolbar">
          <div className="edu-pdf-toolgroup">
            {TOOLS.map((t) => (
              <ToolButton
                key={t.id}
                Icon={t.Icon}
                label={t.label}
                title={t.hint}
                active={tool === t.id}
                onClick={() => pickTool(t.id)}
              />
            ))}
          </div>

          <div className="edu-pdf-toolgroup">
            <ToolButton
              Icon={Upload}
              label="Mở file khác"
              title="Chọn một file PDF khác (các thay đổi chưa xuất sẽ bị bỏ)"
              onClick={() => pdfInputRef.current?.click()}
            />
            <span className="edu-pdf-sep" />
            <ToolButton Icon={Undo2} label="Hoàn tác" title="Ctrl+Z" onClick={undo} disabled={!canUndo} />
            <ToolButton Icon={Redo2} label="Làm lại" title="Ctrl+Y" onClick={redo} disabled={!canRedo} />
            <span className="edu-pdf-sep" />
            <ToolButton Icon={RotateCw} label="Xoay trang" title="Xoay trang 90°" onClick={rotateCurrentPage} />
            <ToolButton
              Icon={Trash2}
              label="Xoá trang"
              onClick={deleteCurrentPage}
              disabled={order.length <= 1}
            />
            <ToolButton
              Icon={ChevronUp}
              label="Lên"
              title="Đưa trang lên trước"
              onClick={() => moveCurrentPage(-1)}
              disabled={safeIndex <= 0}
            />
            <ToolButton
              Icon={ChevronDown}
              label="Xuống"
              title="Đưa trang xuống sau"
              onClick={() => moveCurrentPage(1)}
              disabled={safeIndex >= order.length - 1}
            />
            <span className="edu-pdf-sep" />
            <ToolButton Icon={RefreshCw} label="Khôi phục gốc" onClick={restoreOriginal} />
          </div>
        </div>

        {/* ── Nội dung ──────────────────────────────────────────────────── */}
        <div className="edu-pdf-body">
          <div className="edu-pdf-main">
            <div className="edu-pdf-stage" ref={stageRef}>
              {currentPage ? (
                <PageStage
                  pdfPage={currentPage}
                  pageId={pageId}
                  pageMeta={pageMeta}
                  rotation={rotation}
                  scale={scale}
                  dpr={dpr}
                  objects={objects}
                  tool={tool}
                  selectedId={selectedId}
                  editingId={editingId}
                  editSelection={editSelection}
                  measureFor={measureFor}
                  faceFor={faceFor}
                  stageApiRef={stageApiRef}
                  onSelect={handleSelect}
                  onCreate={handleCreate}
                  onConvertSelection={handleConvertSelection}
                  onLiveObject={(obj) => applyObject(obj, false)}
                  onSnapshot={snapshot}
                  onTextInput={handleTextInput}
                  onTextEditEnd={() => { endTextInput(); setEditingId(null); setEditSelection(null); }}
                />
              ) : pageLoadFailed ? (
                <div className="edu-pdf-center">
                  <div className="edu-pdf-alert" role="alert">
                    <TriangleAlert />
                    <div className="min-w-0">
                      <p className="edu-pdf-alert-title">Không tải được trang {safeIndex + 1}</p>
                      <p className="edu-pdf-alert-text">
                        File có thể bị hỏng ở trang này. Bạn vẫn xem được các trang khác và xuất
                        file bình thường.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="edu-pdf-center">
                  <Loader label="Đang tải trang..." />
                </div>
              )}
              {tool === "edit-text" && currentPage && (
                <div className="edu-pdf-target-note" role="status">
                  {editTargets?.key !== targetsKey || editTargets?.loading
                    ? "Đang đọc lớp chữ của trang..."
                    : editTargets?.error
                      ? "Không đọc được lớp chữ của trang này (PDF scan/ảnh?). Dùng Vùng che + Văn bản để thay nội dung."
                      : "Kéo bôi đen chữ gốc trong trang rồi bấm “Sửa chữ đã chọn”. Ctrl+C để sao chép chữ."}
                </div>
              )}
            </div>

            <div className="edu-pdf-nav">
              <button
                type="button"
                className="edu-pdf-icon-btn"
                onClick={() => gotoPage(safeIndex - 1)}
                disabled={safeIndex <= 0}
                title="Trang trước"
              >
                <ChevronLeft />
              </button>
              <span className="edu-pdf-pageinput">
                Trang
                <input
                  value={pageInput}
                  inputMode="numeric"
                  onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ""))}
                  onBlur={commitPageInput}
                  onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                  aria-label="Số trang"
                />
                <b>/ {order.length}</b>
              </span>
              <button
                type="button"
                className="edu-pdf-icon-btn"
                onClick={() => gotoPage(safeIndex + 1)}
                disabled={safeIndex >= order.length - 1}
                title="Trang sau"
              >
                <ChevronRight />
              </button>

              <span className="edu-pdf-sep" />

              <button type="button" className="edu-pdf-icon-btn" onClick={() => zoomBy(1 / 1.25)} title="Thu nhỏ">
                <ZoomOut />
              </button>
              <span className="edu-pdf-zoom">{Math.round(scale * 100)}%</span>
              <button type="button" className="edu-pdf-icon-btn" onClick={() => zoomBy(1.25)} title="Phóng to">
                <ZoomIn />
              </button>
              <button
                type="button"
                className="edu-pdf-chip"
                onClick={() => setZoom({ mode: "fit-width", scale: 1 })}
              >
                Vừa ngang
              </button>
              <button
                type="button"
                className="edu-pdf-chip"
                onClick={() => setZoom({ mode: "fit-page", scale: 1 })}
              >
                <Maximize /> Vừa trang
              </button>

              <span className="edu-pdf-filename" title={fileName}>{fileName}</span>
              <span className={`edu-pdf-dirty ${dirty ? "is-on" : ""}`}>
                {dirty ? "Có thay đổi chưa xuất" : "Chưa có thay đổi"}
              </span>
            </div>
          </div>

          {/* ── Panel phải ──────────────────────────────────────────────── */}
          <aside className="edu-pdf-side">
            <div className="edu-pdf-tabs" role="tablist">
              {tabDefs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={sideTab === t.id}
                  className={`edu-pdf-tab ${sideTab === t.id ? "is-active" : ""}`}
                  onClick={() => setSideTab(t.id)}
                >
                  <t.Icon />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="edu-pdf-panel">
              {sideTab === "object" && renderObjectPanel()}
              {sideTab === "pages" && renderPagesPanel()}
              {sideTab === "text" && renderTextPanel()}
            </div>
          </aside>
        </div>

        {pdfInput}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/bmp,image/svg+xml"
          hidden
          onChange={handleImageInput}
        />
      </div>

      {helpOpen && (
        <Modal onClose={() => setHelpOpen(false)} wide>
          <h3 className="edu-pdf-help-title">Hướng dẫn dùng công cụ Chỉnh sửa PDF</h3>

          <h4 className="edu-pdf-help-h">Các thao tác chính</h4>
          <ul className="edu-pdf-help-list">
            <li><b>Tải lên:</b> kéo-thả file PDF vào khung hoặc bấm “Chọn file PDF” (tối đa 30 MB).</li>
            <li><b>Xem tài liệu:</b> điều hướng trang trước/sau, nhập số trang, phóng to/thu nhỏ, “Vừa ngang” / “Vừa trang”.</li>
            <li>
              <b>Sửa chữ gốc:</b> kéo <b>bôi đen chữ ngay trên trang</b> (lớp chữ thật của PDF —
              hover thấy cursor chữ, Ctrl+C sao chép được), rồi bấm <b>“Sửa chữ đã chọn”</b> hiện
              phía trên vùng chọn; hoặc bấm nút Sửa từng dòng trong tab <b>Chữ gốc</b>. Dòng chữ
              cũ được che tự động và thay bằng chữ mới đúng vị trí, cỡ chữ, màu chữ, font và độ
              đậm — phần bôi đen được chọn sẵn trong ô sửa để gõ đè lên. Xoá chữ sửa sẽ khôi
              phục dòng chữ gốc.
            </li>
            <li><b>Thêm đối tượng:</b> chọn công cụ rồi nhấp/kéo trên trang — Văn bản, Hình ảnh, Chữ nhật, Đường kẻ, Highlight, Vùng che.</li>
            <li><b>Sửa đối tượng:</b> nhấp để chọn, kéo để di chuyển, kéo tay nắm để đổi cỡ, nhấp đúp vào chữ để sửa tại chỗ, phím Delete để xoá.</li>
            <li><b>Trang:</b> xoay 90°, xoá trang, đưa trang lên/xuống (hoặc thao tác ngay trong tab “Trang”).</li>
            <li><b>Undo / Redo:</b> Ctrl+Z (hoàn tác), Ctrl+Y hoặc Ctrl+Shift+Z (làm lại).</li>
            <li><b>Xuất file:</b> bấm “Xuất PDF” — tải về file mới tên <i>-edited.pdf</i>, file gốc không đổi.</li>
          </ul>

          <h4 className="edu-pdf-help-h">Giới hạn (quan trọng)</h4>
          <ul className="edu-pdf-help-list">
            <li>
              <b>Cách thay chữ gốc:</b> PDF không cho sửa trực tiếp nội dung đã “cứng” trong file —
              công cụ che dòng chữ cũ rồi viết chữ mới lên đúng vị trí. Chữ mới ưu tiên dùng lại
              <b> chính font nhúng trong PDF</b> (giữ nguyên nét chữ, độ đậm, nghiêng); chỉ khi font
              gốc thiếu ký tự cho nội dung mới mới thay bằng font DejaVu gần nhất. Chữ cũ vẫn còn
              trong file dưới lớp che (không nên dùng để giấu thông tin nhạy cảm).
            </li>
            <li>
              <b>PDF scan / ảnh:</b> không có lớp chữ để đọc. Nhận diện chữ bằng OCR chưa được
              tích hợp trong phiên bản này — chỉ che và chèn chữ mới.
            </li>
            <li><b>File có mật khẩu:</b> không mở được — hãy bỏ mật khẩu rồi thử lại.</li>
            <li><b>File lớn / lỗi, định dạng khác PDF:</b> sẽ có thông báo rõ ràng, không làm mất phiên đang sửa.</li>
            <li>Text/ảnh/hình vẽ thêm vào là lớp nội dung MỚI — các phần còn lại của trang giữ nguyên.</li>
          </ul>

          <h4 className="edu-pdf-help-h">Mẹo</h4>
          <ul className="edu-pdf-help-list">
            <li>Mọi thao tác đều Undo được; bấm “Khôi phục gốc” để về trạng thái vừa mở file.</li>
            <li>Có thay đổi chưa xuất mà rời trang sẽ có hộp thoại nhắc bạn.</li>
            <li>Chữ sửa giữ font gốc của PDF; chữ thêm mới dùng font DejaVu nhúng kèm web — hiển thị trên mọi máy giống hệt file xuất ra.</li>
          </ul>

          <div className="edu-pdf-help-foot">
            <button type="button" className="edu-pdf-btn edu-pdf-btn--primary" onClick={() => setHelpOpen(false)}>
              Đã hiểu
            </button>
          </div>
        </Modal>
      )}

      <ConfirmModal {...confirmProps} />
    </>
  );

  /* ── Panel bên phải ──────────────────────────────────────────────────── */
  function renderObjectPanel() {
    if (!selected) {
      return (
        <div className="edu-pdf-hint">
          <MousePointer2 />
          <p>Chọn một đối tượng trên trang để chỉnh sửa nội dung, màu sắc, cỡ chữ…</p>
          <p className="edu-pdf-hint-sub">
            Mẹo: nhấp đúp vào văn bản để sửa ngay tại chỗ; chọn công cụ rồi kéo trên trang để
            vẽ khung / đường kẻ / vùng che.
          </p>
        </div>
      );
    }

    const box = objectBBox(selected);
    // Font gốc nhúng của dòng chữ (nếu đối tượng này thay cho chữ gốc trong PDF).
    const srcEntry =
      selected.type === "text" && selected.srcFontKey ? srcFonts?.[selected.srcFontKey] : null;
    const srcIntent = selected.type === "text" && wantsSrcFont(selected, srcFonts);
    const srcActive =
      selected.type === "text" && Boolean(resolveTextFace(selected, srcFonts).embedded);

    return (
      <div className="edu-pdf-props">
        <div className="edu-pdf-props-head">
          <span className="edu-pdf-badge">
            {selected.type === "text" && "Văn bản"}
            {selected.type === "image" && "Hình ảnh"}
            {selected.type === "rect" && "Hình chữ nhật"}
            {selected.type === "redact" && "Vùng che"}
            {selected.type === "line" && "Đường kẻ"}
          </span>
          <span className="edu-pdf-props-size">
            {Math.round(box.w)} × {Math.round(box.h)} pt
          </span>
        </div>

        {selected.pairId && (
          <div className="edu-pdf-note">
            {selected.type === "text"
              ? "Chữ này thay cho một dòng chữ gốc — font, cỡ chữ, màu và độ đậm được giữ theo dòng gốc; dòng cũ đã được che bên dưới. Xoá đối tượng sẽ bỏ luôn vùng che và khôi phục chữ gốc."
              : "Vùng che đi kèm chữ sửa của một dòng chữ gốc. Xoá vùng che sẽ xoá luôn chữ mới và khôi phục chữ gốc."}
          </div>
        )}

        {selected.type === "text" && (
          <>
            <label className="edu-pdf-prop edu-pdf-prop--block">
              <span className="edu-pdf-prop-label">Nội dung</span>
              <textarea
                rows={3}
                value={selected.text}
                placeholder="Nhập văn bản…"
                onFocus={() => beginCont(`text:${selected.id}`)}
                onChange={(e) => handleTextInput(selected.id, e.target.value)}
                onBlur={endTextInput}
              />
            </label>

            <PropRow label="Font chữ">
              <select
                value={srcIntent ? "__src" : selected.fontFamily}
                onChange={(e) =>
                  e.target.value === "__src"
                    ? changeFontProp({ useSrcFont: true })
                    : changeFontProp({ fontFamily: e.target.value, useSrcFont: false })
                }
              >
                {srcEntry?.bytes && (
                  <option value="__src">Font gốc PDF — {srcEntry.label}</option>
                )}
                {FONT_FAMILIES.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </PropRow>

            {srcIntent && (
              <div className="edu-pdf-note">
                {srcActive ? (
                  <>Đang dùng <b>chính font nhúng trong PDF</b> ({srcEntry.label}) — nét chữ,
                  độ đậm giữ nguyên như bản gốc.</>
                ) : (
                  <>Font gốc của PDF là bộ font con, <b>thiếu ký tự</b> trong nội dung mới
                  (hoặc kiểu chữ đã đổi) — đang tạm dùng font thay thế gần nhất. Sửa lại nội
                  dung trong bộ ký tự của font gốc sẽ tự trở về font gốc.</>
                )}
              </div>
            )}

            <div className="edu-pdf-prop-row">
              <PropRow label="Cỡ chữ">
                <input
                  type="number"
                  min={6}
                  max={200}
                  step={0.1}
                  value={Math.round(selected.fontSize * 10) / 10}
                  onFocus={() => beginCont(`fs:${selected.id}`)}
                  onChange={(e) =>
                    updateSelected(
                      { fontSize: clamp(Number(e.target.value) || 12, 6, 200) },
                      false,
                    )
                  }
                  onBlur={endCont}
                />
              </PropRow>
              <PropRow label="Màu chữ">
                <input
                  type="color"
                  value={selected.color || "#1d2327"}
                  onFocus={() => beginCont(`color:${selected.id}`)}
                  onInput={(e) => updateSelected({ color: e.target.value }, false)}
                  onBlur={endCont}
                />
              </PropRow>
            </div>

            <div className="edu-pdf-prop-row">
              <div className="edu-pdf-prop">
                <span className="edu-pdf-prop-label">Kiểu chữ</span>
                <span className="edu-pdf-prop-control edu-pdf-btnrow">
                  <button
                    type="button"
                    className={`edu-pdf-mini ${selected.bold ? "is-active" : ""}`}
                    disabled={!hasFace(familyById(selected.fontFamily), true, selected.italic)}
                    title="Đậm"
                    onClick={() => changeFontProp({ bold: !selected.bold })}
                  >
                    <Bold />
                  </button>
                  <button
                    type="button"
                    className={`edu-pdf-mini ${selected.italic ? "is-active" : ""}`}
                    disabled={!hasFace(familyById(selected.fontFamily), selected.bold, true)}
                    title="Nghiêng"
                    onClick={() => changeFontProp({ italic: !selected.italic })}
                  >
                    <Italic />
                  </button>
                </span>
              </div>
              <div className="edu-pdf-prop">
                <span className="edu-pdf-prop-label">Căn lề</span>
                <span className="edu-pdf-prop-control edu-pdf-btnrow">
                  {TEXT_ALIGN.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`edu-pdf-mini ${selected.align === a.id ? "is-active" : ""}`}
                      title={a.label}
                      onClick={() => updateSelected({ align: a.id })}
                    >
                      <a.Icon />
                    </button>
                  ))}
                </span>
              </div>
            </div>

            <PropRow label="Bề rộng khung (pt)">
              <input
                type="number"
                min={24}
                max={2000}
                value={Math.round(selected.w)}
                onFocus={() => beginCont(`w:${selected.id}`)}
                onChange={(e) => updateSelected({ w: clamp(Number(e.target.value) || 24, 24, 2000) }, false)}
                onBlur={endCont}
              />
            </PropRow>
          </>
        )}

        {selected.type === "image" && (
          <div className="edu-pdf-prop-row">
            <PropRow label="Rộng (pt)">
              <input
                type="number"
                min={8}
                max={4000}
                value={Math.round(selected.w)}
                onFocus={() => beginCont(`iw:${selected.id}`)}
                onChange={(e) => updateSelected({ w: clamp(Number(e.target.value) || 8, 8, 4000) }, false)}
                onBlur={endCont}
              />
            </PropRow>
            <PropRow label="Cao (pt)">
              <input
                type="number"
                min={8}
                max={4000}
                value={Math.round(selected.h)}
                onFocus={() => beginCont(`ih:${selected.id}`)}
                onChange={(e) => updateSelected({ h: clamp(Number(e.target.value) || 8, 8, 4000) }, false)}
                onBlur={endCont}
              />
            </PropRow>
          </div>
        )}

        {selected.type === "rect" && (
          <>
            <label className="edu-pdf-check">
              <input
                type="checkbox"
                checked={Boolean(selected.fill)}
                onChange={(e) =>
                  updateSelected(e.target.checked ? { fill: "#fde047" } : { fill: null })
                }
              />
              <span>Tô nền (Highlight)</span>
            </label>
            <div className="edu-pdf-prop-row">
              <PropRow label="Màu nền">
                <input
                  type="color"
                  value={selected.fill || "#fde047"}
                  disabled={!selected.fill}
                  onFocus={() => beginCont(`fill:${selected.id}`)}
                  onInput={(e) => updateSelected({ fill: e.target.value }, false)}
                  onBlur={endCont}
                />
              </PropRow>
              <PropRow label="Độ trong (%)">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={Math.round((selected.fillOpacity ?? 1) * 100)}
                  disabled={!selected.fill}
                  onFocus={() => beginCont(`fo:${selected.id}`)}
                  onChange={(e) =>
                    updateSelected(
                      { fillOpacity: clamp((Number(e.target.value) || 100) / 100, 0.05, 1) },
                      false,
                    )
                  }
                  onBlur={endCont}
                />
              </PropRow>
            </div>
            <div className="edu-pdf-prop-row">
              <PropRow label="Màu viền">
                <input
                  type="color"
                  value={selected.stroke || "#1d2327"}
                  disabled={!selected.stroke}
                  onFocus={() => beginCont(`stroke:${selected.id}`)}
                  onInput={(e) => updateSelected({ stroke: e.target.value }, false)}
                  onBlur={endCont}
                />
              </PropRow>
              <PropRow label="Độ dày viền">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={Math.round(selected.strokeWidth || 0)}
                  disabled={!selected.stroke}
                  onFocus={() => beginCont(`sw:${selected.id}`)}
                  onChange={(e) =>
                    updateSelected({ strokeWidth: clamp(Number(e.target.value) || 0, 0, 40) }, false)
                  }
                  onBlur={endCont}
                />
              </PropRow>
            </div>
            <label className="edu-pdf-check">
              <input
                type="checkbox"
                checked={!selected.stroke}
                onChange={(e) => updateSelected({ stroke: e.target.checked ? null : "#1d2327", strokeWidth: e.target.checked ? 0 : 2 })}
              />
              <span>Không viền (chỉ nền)</span>
            </label>
          </>
        )}

        {selected.type === "redact" && (
          <>
            <div className="edu-pdf-note">
              Vùng che nằm đè lên nội dung cũ khi xuất file — dùng để “xoá” chữ gốc mà không đụng
              tới các phần còn lại.
            </div>
            <PropRow label="Màu che">
              <input
                type="color"
                value={selected.fill || "#ffffff"}
                onFocus={() => beginCont(`rf:${selected.id}`)}
                onInput={(e) => updateSelected({ fill: e.target.value }, false)}
                onBlur={endCont}
              />
            </PropRow>
          </>
        )}

        {selected.type === "line" && (
          <div className="edu-pdf-prop-row">
            <PropRow label="Màu đường">
              <input
                type="color"
                value={selected.stroke || "#1d2327"}
                onFocus={() => beginCont(`lc:${selected.id}`)}
                onInput={(e) => updateSelected({ stroke: e.target.value }, false)}
                onBlur={endCont}
              />
            </PropRow>
            <PropRow label="Độ dày">
              <input
                type="number"
                min={1}
                max={40}
                value={Math.round(selected.strokeWidth || 1)}
                onFocus={() => beginCont(`lt:${selected.id}`)}
                onChange={(e) =>
                  updateSelected({ strokeWidth: clamp(Number(e.target.value) || 1, 1, 40) }, false)
                }
                onBlur={endCont}
              />
            </PropRow>
          </div>
        )}

        <div className="edu-pdf-props-foot">
          {selected.type === "text" && (
            <button type="button" className="edu-pdf-btn" onClick={() => startTextEdit(selected.id)}>
              Sửa chữ
            </button>
          )}
          <button
            type="button"
            className="edu-pdf-btn edu-pdf-btn--danger"
            onClick={() => deleteObject(selected.id)}
          >
            <Trash2 /> Xoá đối tượng
          </button>
        </div>
      </div>
    );
  }

  function renderPagesPanel() {
    return (
      <div className="edu-pdf-pagelist">
        <p className="edu-pdf-panel-note">
          Nhấp để nhảy tới trang. Dùng ↑ ↓ để sắp xếp lại thứ tự trang trong file xuất.
        </p>
        {order.map((p, i) => (
          <div key={`page-${p}-${i}`} className={`edu-pdf-pageitem ${i === safeIndex ? "is-active" : ""}`}>
            <button type="button" className="edu-pdf-pageitem-main" onClick={() => gotoPage(i)}>
              <span className="edu-pdf-pageitem-no">{i + 1}</span>
              <span className="edu-pdf-pageitem-meta">
                {Math.round(doc.pages[p].width)}×{Math.round(doc.pages[p].height)} pt
                {((doc.deltas[p] || 0) % 360) !== 0 && ` · xoay ${((doc.deltas[p] || 0) % 360)}°`}
              </span>
            </button>
            <div className="edu-pdf-pageitem-acts">
              <button type="button" title="Lên" disabled={i === 0} onClick={() => movePageAt(i, -1)}>
                <ChevronUp />
              </button>
              <button
                type="button"
                title="Xuống"
                disabled={i === order.length - 1}
                onClick={() => movePageAt(i, 1)}
              >
                <ChevronDown />
              </button>
              <button type="button" title="Xoay 90°" onClick={() => rotatePageAt(i)}>
                <RotateCw />
              </button>
              <button
                type="button"
                title="Xoá trang"
                disabled={order.length <= 1}
                onClick={() => deletePageAt(i)}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderTextPanel() {
    const samePage = analysis && analysis.pageId === pageId;
    return (
      <div className="edu-pdf-textpanel">
        <div className="edu-pdf-note">
          Muốn thay chữ cũ: <b>kéo bôi đen chữ ngay trên trang</b> rồi bấm “Sửa chữ đã chọn”,
          hoặc phân tích bên dưới rồi bấm <b>Sửa</b> từng dòng. Chữ cũ được che tự động, chữ mới
          giữ đúng font, cỡ chữ, màu và độ đậm của dòng gốc — các phần còn lại không bị ảnh hưởng.
        </div>

        <button
          type="button"
          className="edu-pdf-btn edu-pdf-btn--block"
          onClick={runAnalysis}
          disabled={analysis?.loading}
        >
          <ScanLine />
          {analysis?.loading ? "Đang phân tích..." : `Phân tích chữ trang ${safeIndex + 1}`}
        </button>

        {samePage && analysis.error && (
          <div className="edu-pdf-alert edu-pdf-alert--sm" role="alert">
            <TriangleAlert />
            <p className="edu-pdf-alert-text">{analysis.error}</p>
          </div>
        )}

        {samePage && analysis.boxes && !analysis.error && (
          <div className="edu-pdf-analysis">
            {analysis.boxes.length === 0 ? (
              <p>
                Không tìm thấy lớp chữ trên trang này — nhiều khả năng là <b>PDF scan / ảnh</b>.
                Nhận diện chữ (OCR) chưa được tích hợp; bạn vẫn có thể che vùng cần thay rồi chèn
                chữ mới.
              </p>
            ) : (
              <>
                <p>
                  Trang có <b>{analysis.boxes.length}</b> dòng chữ gốc. Bấm <b>Sửa</b> để thay nội
                  dung từng dòng, hoặc che tất cả rồi tự thêm chữ mới.
                </p>
                <div className="edu-pdf-linelist">
                  {analysis.boxes.map((b, i) => (
                    <div key={b.key || i} className="edu-pdf-lineitem">
                      <span className="edu-pdf-lineitem-text" title={b.text || ""}>
                        {b.text || "…"}
                      </span>
                      <button
                        type="button"
                        className="edu-pdf-mini edu-pdf-lineitem-edit"
                        title="Sửa dòng chữ này"
                        onClick={() => handleEditOriginal(b)}
                      >
                        <TextCursorInput />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="edu-pdf-btn edu-pdf-btn--block"
                  onClick={coverTextLines}
                >
                  <Eraser />
                  Thêm vùng che cho {analysis.boxes.length} dòng chữ
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}
