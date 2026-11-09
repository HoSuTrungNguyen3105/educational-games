import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowLeftRight, BookOpen, Check, Download, Expand, Eye,
  FileText, FileWarning, FolderOpen, Image as ImageIcon, LayoutGrid, LayoutTemplate,
  List, Play, Quote, Save, Search, Settings, Sparkles, Table2, Upload, UserRound,
  Wand2, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { navigate } from "../../lib/router.js";
import { documentService } from "../../services/documentService.js";
import { matchesQuery } from "../../lib/searchText.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import { ConfirmModal, Modal } from "../../components/ui";
import CodeEditor from "./documents/CodeEditor.jsx";
import WordPreview from "./documents/WordPreview.jsx";
import PowerPointPreview from "./documents/PowerPointPreview.jsx";
import DocumentUploadModal from "./documents/DocumentUploadModal.jsx";
import { applySource, convertSource } from "../../lib/documents/convert.js";
import { renderModelBodyHtml } from "../../lib/documents/modelRender.js";
import { jsonItemIndexAt, htmlAnchorAt } from "../../lib/documents/sourceMap.js";
import { templatesFor } from "../../lib/documents/templates.js";
import { exportWordDocx } from "../../lib/documents/wordExporter.js";
import { exportPresentationPptx } from "../../lib/documents/pptxExporter.js";
import { validateDocumentJson } from "../../lib/documents/schemas.js";
import { presentationJsonToModel } from "../../lib/documents/model.js";
import { duplicateSlide, insertSlideAfter, moveSlide, removeSlide } from "../../lib/documents/slideOps.js";
import "./documents/docstudio.css";

// DocumentStudioEditor — trang soạn tài liệu của Teacher Document Studio
// (/dashboard/documents/:documentId). Trang chạy TOÀN MÀN HÌNH, không có
// sidebar quản trị (TeacherApp render ngoài TeacherLayout).
//
// Giao diện bám thiết kế "Word Studio / PowerPoint Studio":
//   • Thanh trên cùng: logo EduPlay + tên tài liệu + trạng thái lưu + Trợ lý AI.
//   • Banner màu theo loại tài liệu (xanh dương cho Word, cam cho PowerPoint)
//     với nút Mẫu có sẵn / Xem trước / Xuất file thật.
//   • Workspace 3 cột: rail công cụ (Nội dung, Hình ảnh, Bảng biểu, Danh sách,
//     Trích dẫn, Cài đặt) · khung mã nguồn · khung xem trước kéo chia được.
//
// Hai chế độ soạn (HTML/CSS ⇄ JSON) dùng chung MỘT mô hình trung gian
// (src/lib/documents):
//   • "Áp dụng" (Apply) mới đưa mã nguồn vào preview — mã lỗi thì preview
//     giữ bản hợp lệ gần nhất, nội dung đang sửa không bao giờ bị mất.
//   • Mỗi chế độ có bản nháp riêng trong state; chuyển tab không ghi đè
//     nhau. Chế độ đích đang trống → tự chuyển đổi từ chế độ hiện tại;
//     muốn đồng bộ lại khi đích đã có nháp → nút "Chuyển đổi từ …" (có
//     xác nhận ghi đè).
//   • Server chỉ lưu MỘT mã nguồn (theo chế độ đang chọn khi Lưu) — bản
//     nháp của chế độ còn lại chỉ sống trong phiên soạn này.
//   • Xuất .docx / .pptx thật, thao tác slide bằng nút ở chế độ JSON.

const snapshotOf = ({ name, docType, mode, source }) => JSON.stringify({ name, docType, mode, source });

const THEMES = {
  word: {
    label: "Word Studio",
    blurb: "Soạn giáo án, tài liệu học tập",
    exportLabel: "Xuất DOCX",
    templateLabel: "Mẫu có sẵn",
    icon: "W",
    accent: "#2563eb",
    accentDark: "#1d4ed8",
    accentSoft: "#eff6ff",
    accentLine: "#bfdbfe",
    banner: "linear-gradient(115deg, #1e3a8a 0%, #1d4ed8 45%, #3b82f6 100%)",
  },
  powerpoint: {
    label: "PowerPoint Studio",
    blurb: "Tạo slide bài giảng sinh động",
    exportLabel: "Xuất PPTX",
    templateLabel: "Mẫu slide",
    icon: "P",
    accent: "#ea580c",
    accentDark: "#c2410c",
    accentSoft: "#fff7ed",
    accentLine: "#fed7aa",
    banner: "linear-gradient(115deg, #9a3412 0%, #ea580c 50%, #fb923c 100%)",
  },
};

const RAIL_ITEMS = [
  { id: "content", label: "Nội dung", icon: FileText },
  { id: "image", label: "Hình ảnh", icon: ImageIcon },
  { id: "table", label: "Bảng biểu", icon: Table2 },
  { id: "list", label: "Danh sách", icon: List },
  { id: "quote", label: "Trích dẫn", icon: Quote },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

const MAX_PREVIEW_ZOOM = 2;

const escAttr = (value) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildApplied(mode, docType, res) {
  if (mode === "html") {
    return { mode, docType, model: res.model, warnings: res.warnings || [], bodyHtml: res.bodyHtml, cssText: res.cssText, source: "" };
  }
  return { mode, docType, model: res.model, warnings: [], bodyHtml: renderModelBodyHtml(res.model), cssText: "", source: "" };
}

export default function DocumentStudioEditor({ documentId, showToast }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [docType, setDocType] = useState("word");
  const [mode, setMode] = useState("html");
  const [drafts, setDrafts] = useState({ html: "", json: "" });
  const [applied, setApplied] = useState(null);
  const [appliedSource, setAppliedSource] = useState(null); // mã nguồn đã sinh ra `applied`
  const [applyErrors, setApplyErrors] = useState([]);
  const [notice, setNotice] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportReport, setExportReport] = useState(null);
  const [split, setSplit] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [ratio, setRatio] = useState("16:9");
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(null); // null | "tools" — bảng công cụ dưới mobile
  const [reveal, setReveal] = useState(null); // đích cuộn/bôi xanh trong preview
  const revealToken = useRef(0);
  const cursorTimer = useRef(null);
  const [tool, setTool] = useState("content");
  const [templateQuery, setTemplateQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [toolForm, setToolForm] = useState({
    src: "", alt: "", title: "", text: "Mục 1\nMục 2", ordered: false,
  });
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const splitRef = useRef(null);
  const { askConfirm, confirmProps } = useConfirm();

  const draft = drafts[mode];
  const isDirty = useMemo(
    () => savedSnapshot !== "" && snapshotOf({ name: name.trim(), docType, mode, source: draft }) !== savedSnapshot,
    [savedSnapshot, name, docType, mode, draft]);
  const validApplied = applied && applied.docType === docType ? applied : null;
  const appliedStale = validApplied ? appliedSource !== draft || validApplied.mode !== mode : false;
  const theme = THEMES[docType] || THEMES.word;
  const themeStyle = {
    "--doc-accent": theme.accent,
    "--doc-accent-dark": theme.accentDark,
    "--doc-accent-soft": theme.accentSoft,
    "--doc-accent-line": theme.accentLine,
    "--doc-banner": theme.banner,
  };

  const goList = () => navigate("/dashboard/documents");

  // ── Nạp tài liệu ──────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const doc = await documentService.get(documentId);
        if (!alive) return;
        setName(doc.name || "");
        setDocType(doc.docType);
        setMode(doc.mode);
        setDrafts({ html: doc.mode === "html" ? doc.source || "" : "", json: doc.mode === "json" ? doc.source || "" : "" });
        const res = applySource(doc.source || "", doc.mode, doc.docType);
        if (res.ok) {
          setApplied(buildApplied(doc.mode, doc.docType, res));
          setAppliedSource(doc.source || "");
        } else {
          setApplyErrors(res.errors);
        }
        setSavedSnapshot(snapshotOf({ name: (doc.name || "").trim(), docType: doc.docType, mode: doc.mode, source: doc.source || "" }));
      } catch (e) {
        if (alive) setLoadError(e?.message || "Không tải được tài liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [documentId]);

  // ── Áp dụng mã nguồn hiện tại vào preview ─────────────────────────────
  const doApply = useCallback((src, md, dt) => {
    const res = applySource(src, md, dt);
    if (res.ok) {
      setApplied(buildApplied(md, dt, res));
      setAppliedSource(src);
      setApplyErrors([]);
      setSlideIndex(0); // nội dung mới áp dụng → preview về slide đầu (như đợt 1)
      return true;
    }
    setApplyErrors(res.errors);
    return false;
  }, []);

  const handleApply = () => {
    if (doApply(draft, mode, docType)) showToast?.("Đã áp dụng — preview đã cập nhật", "success");
    else showToast?.("Mã nguồn đang có lỗi — preview giữ bản hợp lệ gần nhất", "error");
  };

  // ── Click editor → preview cuộn tới + bôi xanh đoạn tương ứng ─────────
  // Con trỏ đặt vào dòng nào thì ánh xạ sang khối/slide (JSON) hoặc thẻ
  // (HTML) chứa dòng đó, rồi báo preview cuộn tới và nháy xanh. Debounce
  // nhẹ để không cuộn giật cục khi giữ phím mũi tên.
  const handleCursor = ({ offset }) => {
    clearTimeout(cursorTimer.current);
    cursorTimer.current = setTimeout(() => {
      let target = null;
      if (mode === "json") {
        const key = docType === "powerpoint" ? "slides" : "blocks";
        const idx = jsonItemIndexAt(draft, key, offset);
        if (idx != null) {
          target = docType === "powerpoint" ? { kind: "slide", index: idx } : { kind: "block", index: idx };
        }
      } else {
        const anchor = htmlAnchorAt(draft, offset);
        if (anchor) target = { kind: "tag", tag: anchor.tag, index: anchor.index };
      }
      if (target) setReveal({ ...target, token: ++revealToken.current });
    }, 130);
  };
  useEffect(() => () => clearTimeout(cursorTimer.current), []);

  // ── Chuyển chế độ soạn ────────────────────────────────────────────────
  const switchMode = (target) => {
    if (target === mode) return;
    let nextDrafts = drafts;
    if (!drafts[target]) {
      const conv = convertSource(drafts[mode], mode, docType);
      if (!conv.ok) {
        setApplyErrors(conv.errors);
        showToast?.("Chưa chuyển đổi được — mã nguồn hiện tại đang có lỗi, sửa xong hãy chuyển chế độ.", "error");
        return;
      }
      nextDrafts = { ...drafts, [target]: conv.source };
      setDrafts(nextDrafts);
      setNotice(`Đã tự chuyển đổi nội dung từ ${mode === "html" ? "HTML/CSS" : "JSON"} sang ${target === "html" ? "HTML/CSS" : "JSON"}. Bản nháp ở chế độ trước vẫn được giữ nguyên.`);
    } else {
      setNotice(`Mỗi chế độ giữ bản nháp riêng — nội dung ${target === "html" ? "HTML/CSS" : "JSON"} trước đây vẫn còn. Muốn đồng bộ từ chế độ kia, dùng nút "Chuyển đổi" ở thanh công cụ của khung soạn.`);
    }
    setMode(target);
    doApply(nextDrafts[target], target, docType);
  };

  const convertIntoCurrent = () => {
    const other = mode === "html" ? "json" : "html";
    const run = () => {
      const conv = convertSource(drafts[other], other, docType);
      if (!conv.ok) {
        setApplyErrors(conv.errors);
        showToast?.("Chuyển đổi thất bại — mã nguồn ở chế độ kia đang có lỗi.", "error");
        return;
      }
      setDrafts((d) => ({ ...d, [mode]: conv.source }));
      doApply(conv.source, mode, docType);
      setNotice(`Đã chuyển đổi nội dung từ ${other === "html" ? "HTML/CSS" : "JSON"} sang chế độ hiện tại.`);
    };
    if (draft.trim()) {
      askConfirm({
        title: "Chuyển đổi nội dung",
        message: `Chuyển đổi từ ${other === "html" ? "HTML/CSS" : "JSON"} sẽ GHI ĐÈ bản nháp ${mode === "html" ? "HTML/CSS" : "JSON"} hiện tại. Tiếp tục?`,
        confirmLabel: "Chuyển đổi",
        danger: false,
        onConfirm: run,
      });
    } else run();
  };

  const changeDocType = (next) => {
    if (next === docType) return;
    setDocType(next);
    doApply(draft, mode, next);
    setTool("content");
    showToast?.(`Đã chuyển sang ${next === "word" ? "Word" : "PowerPoint"}`, "success");
  };

  // ── Mẫu thư viện ──────────────────────────────────────────────────────
  const loadCatalogTemplate = (template) => {
    if (!template) return;
    const run = () => {
      const src = template.sourceFor(template.defaultMode);
      setDocType(template.kind);
      setMode(template.defaultMode);
      setDrafts({
        html: template.defaultMode === "html" ? src : "",
        json: template.defaultMode === "json" ? src : "",
      });
      doApply(src, template.defaultMode, template.kind);
      setTool("content");
      setNotice(`Đã nạp mẫu “${template.name}” — sửa nội dung theo bài dạy rồi bấm Lưu.`);
    };
    if (draft.trim() || isDirty) {
      askConfirm({
        title: "Nạp mẫu tài liệu",
        message: `Nạp mẫu “${template.name}” sẽ thay thế nội dung đang soạn. Thay đổi chưa lưu sẽ mất. Tiếp tục?`,
        confirmLabel: "Nạp mẫu",
        danger: false,
        onConfirm: run,
      });
    } else run();
  };

  const importUploaded = (result) => {
    const run = () => {
      setDocType(result.docType);
      setMode(result.mode);
      setDrafts({
        html: result.mode === "html" ? result.source : "",
        json: result.mode === "json" ? result.source : "",
      });
      if (!name.trim()) setName(result.name);
      doApply(result.source, result.mode, result.docType);
      setTool("content");
      setUploadOpen(false);
      setNotice(`Đã nhập “${result.name}” từ file — kiểm tra nội dung rồi bấm Lưu.`);
      showToast?.("Đã nhập file vào tài liệu đang soạn", "success");
    };
    if (draft.trim() || isDirty) {
      askConfirm({
        title: "Nhập file vào tài liệu",
        message: "Nội dung file sẽ thay thế bản nháp hiện tại. Thay đổi chưa lưu sẽ mất. Tiếp tục?",
        confirmLabel: "Nhập file",
        danger: false,
        onConfirm: run,
      });
    } else run();
  };

  // ── Lưu ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await documentService.update(documentId, {
        name: name.trim() || "Tài liệu chưa đặt tên",
        docType, mode, source: draft,
      });
      setName(updated.name || "");
      setSavedSnapshot(snapshotOf({
        name: (updated.name || "").trim(), docType: updated.docType,
        mode: updated.mode, source: updated.source || "",
      }));
      showToast?.("Đã lưu tài liệu", "success");
    } catch (e) {
      showToast?.(e?.message || "Lưu thất bại", "error");
    } finally { setSaving(false); }
  };

  // ── Xuất file thật (.docx / .pptx) ────────────────────────────────────
  // Cả hai nút xuất dùng chung bước "đảm bảo preview đang phản ánh đúng
  // bản nháp hiện tại": chưa áp dụng (hoặc đã sửa sau lần áp dụng gần
  // nhất) thì áp dụng lại ngay; mã lỗi → báo lỗi và KHÔNG xuất.
  const ensureApplied = (label) => {
    let current = validApplied;
    if (!current || appliedStale) {
      const res = applySource(draft, mode, docType);
      if (!res.ok) {
        setApplyErrors(res.errors);
        showToast?.(`Mã nguồn đang có lỗi — sửa xong mới xuất được file ${label}.`, "error");
        return null;
      }
      current = buildApplied(mode, docType, res);
      setApplied(current);
      setAppliedSource(draft);
      setApplyErrors([]);
    }
    return current;
  };

  const handleExportWord = async () => {
    const current = ensureApplied("Word");
    if (!current) return;
    setExporting(true);
    try {
      const out = await exportWordDocx(current.model, name);
      setExportReport({
        ok: true,
        message: `Đã xuất file ${out.fileName} — mở và sửa tiếp được trong Microsoft Word.`,
        warnings: [...(current.warnings || []), ...out.warnings],
      });
    } catch (e) {
      setExportReport({ ok: false, message: `Xuất Word thất bại: ${e?.message || "lỗi không rõ"} — nội dung đang soạn vẫn nguyên vẹn.`, warnings: [] });
    } finally { setExporting(false); }
  };

  // ── Xuất PowerPoint (.pptx thật, đợt 2) ───────────────────────────────
  // Tỷ lệ slide lấy theo tỷ lệ đang chọn trong preview (16:9 / 4:3).
  // Cảnh báo gồm cả cảnh báo parse HTML (chế độ HTML) + cảnh báo xuất.
  const handleExportPptx = async () => {
    const current = ensureApplied("PowerPoint");
    if (!current) return;
    setExporting(true);
    try {
      const out = await exportPresentationPptx(current.model, { docName: name, ratio });
      setExportReport({
        ok: true,
        message: `Đã xuất file ${out.fileName} — mỗi slide là một slide PowerPoint thật (chữ sửa được), mở và sửa tiếp được trong Microsoft PowerPoint.`,
        warnings: [...(current.warnings || []), ...out.warnings],
      });
    } catch (e) {
      setExportReport({ ok: false, message: `Xuất PowerPoint thất bại: ${e?.message || "lỗi không rõ"} — nội dung đang soạn vẫn nguyên vẹn.`, warnings: [] });
    } finally { setExporting(false); }
  };

  const handleExport = docType === "word" ? handleExportWord : handleExportPptx;

  // ── Thao tác slide bằng nút (chế độ JSON, PowerPoint) ─────────────────
  // Cơ chế đồng bộ: parse + validate BẢN NHÁP JSON hiện tại (mã lỗi thì
  // từ chối thao tác, không đụng gì) → slideOps sửa đối tượng → serialize
  // JSON.stringify(…, null, 2) ghi lại vào bản nháp → dựng lại preview.
  // Sau thao tác, trạng thái "Chưa lưu" bật đúng vì bản nháp đã đổi.
  const handleSlideOp = (op, arg) => {
    if (mode !== "json" || docType !== "powerpoint") return;
    let obj;
    try {
      obj = JSON.parse(draft);
    } catch {
      showToast?.("Mã JSON đang sai cú pháp — sửa xong mới thao tác slide bằng nút được.", "error");
      return;
    }
    const schemaErrors = validateDocumentJson(obj, "powerpoint");
    if (schemaErrors.length) {
      setApplyErrors(schemaErrors.map((e) => ({
        message: e.path ? `${e.path}: ${e.message}` : e.message, path: e.path,
      })));
      showToast?.("Mã JSON đang có lỗi — sửa xong mới thao tác slide bằng nút được.", "error");
      return;
    }
    const commit = (result, message) => {
      if (!result) return;
      const src = JSON.stringify(result.json, null, 2);
      setDrafts((d) => ({ ...d, json: src }));
      // Preview dựng từ model chuyển TRỰC TIẾP (không qua validate) để
      // slide khung sườn "image" chưa có src vẫn hiện khung nhắc trong
      // preview; bấm Áp dụng sau đó sẽ báo đúng trường src cần điền.
      setApplied(buildApplied("json", "powerpoint", { model: presentationJsonToModel(result.json) }));
      setAppliedSource(src);
      setApplyErrors([]);
      setSlideIndex(result.index);
      setNotice(message);
    };
    if (op === "add") {
      commit(insertSlideAfter(obj, slideIndex, arg),
        `Đã thêm slide mới sau slide ${slideIndex + 1} — hãy sửa nội dung của nó trong mã JSON rồi bấm Lưu.`);
    } else if (op === "duplicate") {
      commit(duplicateSlide(obj, slideIndex), "Đã nhân bản slide hiện tại — bản sao nằm ngay sau bản gốc.");
    } else if (op === "move") {
      commit(moveSlide(obj, slideIndex, arg), arg < 0 ? "Đã di chuyển slide lên trước." : "Đã di chuyển slide xuống sau.");
    } else if (op === "delete") {
      const target = (obj.slides || [])[slideIndex];
      askConfirm({
        title: "Xoá slide",
        message: `Xoá slide ${slideIndex + 1}${target?.title ? ` "${target.title}"` : ""} khỏi bản nháp? Mã JSON sẽ được sửa ngay — bấm Lưu mới ghi lên máy chủ.`,
        confirmLabel: "Xoá slide",
        danger: true,
        onConfirm: () => commit(removeSlide(obj, slideIndex), "Đã xoá slide khỏi bản nháp."),
      });
    }
  };

  const handleFormat = () => {
    const res = editorRef.current?.format();
    if (res && !res.ok && res.error) {
      setApplyErrors([{
        message: `JSON sai cú pháp${res.error.line ? ` ở dòng ${res.error.line}, cột ${res.error.column}` : ""}: ${res.error.message}`,
        line: res.error.line,
      }]);
    }
  };

  // ── Công cụ chèn nhanh ở rail trái ────────────────────────────────────
  const insertSnippet = (snippet) => {
    const ok = editorRef.current?.insert(`\n${snippet}\n`);
    if (!ok) {
      showToast?.("Chưa chèn được — bấm vào khung mã nguồn rồi thử lại.", "error");
      return false;
    }
    setTool("content");
    showToast?.("Đã chèn vào mã nguồn — bấm Áp dụng thay đổi để xem trước.", "success");
    return true;
  };

  const appendJsonItem = (mutate, label) => {
    let obj;
    try {
      obj = JSON.parse(draft);
    } catch {
      showToast?.("Mã JSON đang sai cú pháp — sửa trước khi chèn nội dung.", "error");
      return;
    }
    mutate(obj);
    const src = JSON.stringify(obj, null, 2);
    setDrafts((d) => ({ ...d, json: src }));
    doApply(src, "json", docType);
    if (docType === "powerpoint" && Array.isArray(obj.slides)) setSlideIndex(obj.slides.length - 1);
    setTool("content");
    showToast?.(`Đã thêm ${label} — bấm Lưu để ghi lại.`, "success");
  };

  const parseTableText = (text) => String(text || "")
    .split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .map((line) => line.split("|").map((cell) => cell.trim()));

  const handleInsertImage = () => {
    const src = toolForm.src.trim();
    if (!src) { showToast?.("Nhập URL/đường dẫn ảnh trước.", "error"); return; }
    const alt = toolForm.alt.trim();
    if (mode === "html") {
      insertSnippet(`<img src="${escAttr(src)}" alt="${escAttr(alt)}" style="max-width:100%;height:auto">`);
      return;
    }
    if (docType === "word") {
      appendJsonItem((o) => { o.blocks = [...(o.blocks || []), { type: "image", src, alt }]; }, "khối hình ảnh");
    } else {
      appendJsonItem((o) => {
        o.slides = [...(o.slides || []), { type: "image", title: toolForm.title.trim() || "Hình ảnh", src, alt }];
      }, "slide hình ảnh");
    }
  };

  const handleInsertTable = () => {
    const rows = parseTableText(toolForm.text);
    if (!rows.length || rows.some((row) => row.length === 0)) {
      showToast?.("Nhập bảng dạng mỗi dòng một hàng, các ô cách nhau bằng dấu |", "error");
      return;
    }
    if (mode === "html") {
      const html = [
        '<table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%">',
        ...rows.map((row, ri) => `  <tr>${row.map((cell) => (
          ri === 0 ? `<th>${escHtml(cell)}</th>` : `<td>${escHtml(cell)}</td>`
        )).join("")}</tr>`),
        "</table>",
      ].join("\n");
      insertSnippet(html);
      return;
    }
    if (docType === "word") {
      appendJsonItem((o) => { o.blocks = [...(o.blocks || []), { type: "table", rows }]; }, "bảng");
    } else {
      appendJsonItem((o) => {
        o.slides = [...(o.slides || []), { type: "table", title: toolForm.title.trim() || "Bảng", rows }];
      }, "slide bảng");
    }
  };

  const handleInsertList = () => {
    const items = toolForm.text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (!items.length) { showToast?.("Nhập ít nhất một mục danh sách.", "error"); return; }
    if (mode === "html") {
      const tag = toolForm.ordered ? "ol" : "ul";
      insertSnippet(`<${tag}>\n${items.map((item) => `  <li>${escHtml(item)}</li>`).join("\n")}\n</${tag}>`);
      return;
    }
    if (docType === "word") {
      appendJsonItem((o) => {
        o.blocks = [...(o.blocks || []), { type: "list", ordered: toolForm.ordered, items }];
      }, "danh sách");
    } else {
      appendJsonItem((o) => {
        o.slides = [...(o.slides || []), {
          type: "content", title: toolForm.title.trim() || "Danh sách", content: items,
        }];
      }, "slide danh sách");
    }
  };

  const handleInsertQuote = () => {
    const text = toolForm.text.trim();
    if (!text) { showToast?.("Nhập nội dung trích dẫn trước.", "error"); return; }
    if (mode === "html") {
      insertSnippet(`<blockquote style="margin:16px 0;padding:8px 16px;border-left:4px solid #cbd5e1;color:#475569;font-style:italic">${escHtml(text).replace(/\n/g, "<br>")}</blockquote>`);
      return;
    }
    if (docType === "word") {
      appendJsonItem((o) => { o.blocks = [...(o.blocks || []), { type: "paragraph", text: `“${text}”` }]; }, "trích dẫn");
    } else {
      appendJsonItem((o) => {
        o.slides = [...(o.slides || []), { type: "content", title: "Trích dẫn", content: [`“${text}”`] }];
      }, "slide trích dẫn");
    }
  };

  // ── Kéo thanh phân chia ───────────────────────────────────────────────
  const startDrag = (e) => {
    e.preventDefault();
    const container = splitRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const move = (ev) => {
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.min(75, Math.max(25, pct)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const toggleFullscreen = () => {
    const el = previewRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  if (loading) {
    return <div className="docstudio-screen" style={themeStyle}><div className="p-10 font-body text-ink/60">Đang tải tài liệu…</div></div>;
  }
  if (loadError) {
    return (
      <div className="docstudio-screen" style={themeStyle}>
        <div className="p-10">
          <p className="font-body text-ink mb-4">{loadError}</p>
          <button type="button" onClick={goList} className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper">Về danh sách</button>
        </div>
      </div>
    );
  }

  const warnings = validApplied?.warnings || [];
  const toolMeta = RAIL_ITEMS.find((item) => item.id === tool);

  const renderToolPanel = () => {
    if (tool === "templates") {
      const list = templatesFor(docType);
      const matching = list.filter((tpl) => matchesQuery(
        templateQuery,
        [tpl.name, tpl.categoryLabel, tpl.subjects, ...(tpl.tags || [])].join(" "),
      ));
      return (
        <aside className="docstudio-flyout">
          <h3>Mẫu {docType === "word" ? "Word" : "PowerPoint"} có sẵn</h3>
          <p className="docstudio-flyout-hint">
            {list.length} mẫu thiết kế riêng. Nạp mẫu sẽ thay thế nội dung đang soạn sau khi bạn xác nhận.
          </p>
          <label className="docstudio-template-search">
            <Search className="w-3.5 h-3.5" />
            <input value={templateQuery} onChange={(e) => setTemplateQuery(e.target.value)}
              placeholder="Tìm mẫu theo tên, môn…" aria-label="Tìm mẫu" />
          </label>
          <div className="docstudio-template-list">
            {matching.map((tpl) => (
              <button key={tpl.id} type="button"
                className="docstudio-template"
                onClick={() => loadCatalogTemplate(tpl)}>
                <span className="docstudio-template-swatch" style={{
                  "--sw-a": tpl.theme.accent,
                  "--sw-b": tpl.theme.accent2,
                  "--sw-soft": tpl.theme.soft,
                }} aria-hidden="true">
                  <i /><i /><i />
                </span>
                <span className="min-w-0 text-left">
                  <b>{tpl.name}</b>
                  <small>{tpl.categoryLabel} · {tpl.defaultMode === "json" ? "JSON" : "HTML"} · {tpl.gradeRange}</small>
                </span>
              </button>
            ))}
            {!matching.length && (
              <p className="docstudio-template-empty">Không có mẫu phù hợp từ khóa.</p>
            )}
          </div>
          <button type="button" className="docstudio-btn-primary" onClick={() => navigate("/dashboard/documents/templates")}>
            <LayoutTemplate className="w-4 h-4" /> Mở thư viện đầy đủ
          </button>
          <button type="button" className="docstudio-btn-ghost" onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4" /> Tải file lên (DOCX/PPTX/HTML/JSON)
          </button>
        </aside>
      );
    }

    if (tool === "settings") {
      return (
        <aside className="docstudio-flyout">
          <h3>Cài đặt tài liệu</h3>
          <label className="docstudio-label" htmlFor="docstudio-name">Tên tài liệu</label>
          <input id="docstudio-name" className="docstudio-input" value={name}
            onChange={(e) => setName(e.target.value)} placeholder="Tên tài liệu…" />

          <span className="docstudio-label">Loại tài liệu</span>
          <div className="docstudio-seg">
            <button type="button" className={docType === "word" ? "is-active" : ""} onClick={() => changeDocType("word")}>Word</button>
            <button type="button" className={docType === "powerpoint" ? "is-active" : ""} onClick={() => changeDocType("powerpoint")}>PowerPoint</button>
          </div>

          <span className="docstudio-label">Chế độ soạn</span>
          <div className="docstudio-seg">
            <button type="button" className={mode === "html" ? "is-active" : ""} onClick={() => switchMode("html")}>HTML/CSS</button>
            <button type="button" className={mode === "json" ? "is-active" : ""} onClick={() => switchMode("json")}>JSON</button>
          </div>

          {docType === "powerpoint" && (
            <>
              <label className="docstudio-label" htmlFor="docstudio-ratio">Tỷ lệ slide</label>
              <select id="docstudio-ratio" className="docstudio-select" value={ratio}
                onChange={(e) => setRatio(e.target.value)}>
                <option value="16:9">16:9 (mặc định)</option>
                <option value="4:3">4:3</option>
              </select>
            </>
          )}

          <button type="button" className="docstudio-btn-primary" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Đang lưu…" : "Lưu tài liệu"}
          </button>
          <button type="button" className="docstudio-btn-ghost" onClick={convertIntoCurrent}>
            <ArrowLeftRight className="w-4 h-4" /> Chuyển đổi từ {mode === "html" ? "JSON" : "HTML/CSS"}
          </button>
          <button type="button" className="docstudio-btn-ghost" onClick={goList}>
            <ArrowLeft className="w-4 h-4" /> Về danh sách tài liệu
          </button>
        </aside>
      );
    }

    if (tool === "image") {
      return (
        <aside className="docstudio-flyout">
          <h3>Chèn hình ảnh</h3>
          <p className="docstudio-flyout-hint">
            {mode === "html" ? "Chèn thẻ <img> tại vị trí con trỏ." : docType === "word" ? "Thêm một khối hình ảnh vào cuối tài liệu." : "Thêm một slide hình ảnh vào cuối bài."}
          </p>
          <label className="docstudio-label" htmlFor="docstudio-img-src">Đường dẫn ảnh</label>
          <input id="docstudio-img-src" className="docstudio-input" value={toolForm.src}
            onChange={(e) => setToolForm((f) => ({ ...f, src: e.target.value }))}
            placeholder="https://… hoặc /images/…" />
          {docType === "powerpoint" && mode === "json" && (
            <>
              <label className="docstudio-label" htmlFor="docstudio-img-title">Tiêu đề slide</label>
              <input id="docstudio-img-title" className="docstudio-input" value={toolForm.title}
                onChange={(e) => setToolForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="VD: Hình minh hoạ" />
            </>
          )}
          <label className="docstudio-label" htmlFor="docstudio-img-alt">Mô tả ảnh (alt)</label>
          <input id="docstudio-img-alt" className="docstudio-input" value={toolForm.alt}
            onChange={(e) => setToolForm((f) => ({ ...f, alt: e.target.value }))}
            placeholder="Mô tả ngắn cho ảnh" />
          <button type="button" className="docstudio-btn-primary" onClick={handleInsertImage}>
            <ImageIcon className="w-4 h-4" /> Chèn hình ảnh
          </button>
        </aside>
      );
    }

    const isTable = tool === "table";
    return (
      <aside className="docstudio-flyout">
        <h3>{toolMeta?.label || "Chèn nội dung"}</h3>
        <p className="docstudio-flyout-hint">
          {isTable
            ? "Mỗi dòng là một hàng, các ô cách nhau bằng dấu |. Hàng đầu tiên là hàng tiêu đề."
            : "Mỗi dòng là một mục. Nội dung sẽ được chèn vào bản nháp hiện tại."}
        </p>
        {(docType === "powerpoint" && mode === "json") && (
          <>
            <label className="docstudio-label" htmlFor="docstudio-tool-title">Tiêu đề slide</label>
            <input id="docstudio-tool-title" className="docstudio-input" value={toolForm.title}
              onChange={(e) => setToolForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={isTable ? "VD: Bảng so sánh" : "VD: Mục tiêu bài học"} />
          </>
        )}
        <label className="docstudio-label" htmlFor="docstudio-tool-text">
          {isTable ? "Nội dung bảng" : tool === "quote" ? "Nội dung trích dẫn" : "Các mục"}
        </label>
        <textarea id="docstudio-tool-text" className="docstudio-textarea" value={toolForm.text}
          onChange={(e) => setToolForm((f) => ({ ...f, text: e.target.value }))}
          placeholder={isTable ? "Cột 1 | Cột 2\nÔ 1 | Ô 2" : "Mục 1\nMục 2"} />
        {tool === "list" && (
          <label className="docstudio-check">
            <input type="checkbox" checked={toolForm.ordered}
              onChange={(e) => setToolForm((f) => ({ ...f, ordered: e.target.checked }))} />
            Danh sách có thứ tự (1, 2, 3…)
          </label>
        )}
        <button type="button" className="docstudio-btn-primary" onClick={
          isTable ? handleInsertTable : tool === "list" ? handleInsertList : handleInsertQuote
        }>
          <Play className="w-4 h-4" /> Chèn vào tài liệu
        </button>
      </aside>
    );
  };

  return (
    <div className={`docstudio-screen ${docType === "powerpoint" ? "is-powerpoint" : "is-word"}`} style={themeStyle}>
      {/* ── Thanh trên cùng ─────────────────────────────────────────── */}
      <header className="docstudio-topbar">
        <button type="button" onClick={goList} className="docstudio-ghost-btn" title="Quay lại danh sách tài liệu">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Quay lại</span>
        </button>
        <button type="button" onClick={goList} className="docstudio-logo" title="Về danh sách tài liệu">
          <BookOpen className="w-5 h-5" />
        </button>
        <span className="docstudio-topbar-sep hidden sm:block" />
        <div className="min-w-0">
          <h1 className="docstudio-topbar-title">Teacher Document Studio</h1>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="docstudio-name-input" placeholder="Tên tài liệu…" aria-label="Tên tài liệu" />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span className={`docstudio-save-state ${isDirty ? "is-dirty" : "is-saved"}`}>
            {saving ? "Đang lưu…" : isDirty ? "● Chưa lưu" : "✓ Đã lưu"}
          </span>
          <button type="button" className="docstudio-ai-btn" onClick={() => setAiOpen(true)}>
            <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Trợ lý AI</span>
          </button>
          <button type="button" className="docstudio-ghost-btn" onClick={goList}>
            <FolderOpen className="w-4 h-4" /> <span className="hidden md:inline">Tài liệu của tôi</span>
          </button>
          <span className="docstudio-avatar" title="Giáo viên"><UserRound className="w-4 h-4" /></span>
          <button type="button" className="docstudio-export-btn hidden lg:inline-flex" onClick={handleExport} disabled={exporting}
            title={`Xuất file ${docType === "word" ? ".docx" : ".pptx"} thật`}>
            <Download className="w-4 h-4" /> {exporting ? "Đang xuất…" : theme.exportLabel}
          </button>
          <button type="button" className="docstudio-save-btn" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Lưu</span>
          </button>
        </div>
      </header>

      <div className="docstudio-body">      
        {/* ── Workspace: rail | công cụ | soạn thảo | xem trước ──────── */}
        <div className="docstudio-workspace">
          <aside className="docstudio-rail" aria-label="Công cụ soạn thảo">
            {RAIL_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = tool === item.id;
              return (
                <button key={item.id} type="button"
                  className={`docstudio-rail-btn ${active ? "is-active" : ""}`}
                  onClick={() => {
                    setTool(item.id);
                    if (item.id === "content") editorRef.current?.focus();
                  }}>
                  <Icon /> <span>{item.label}</span>
                </button>
              );
            })}
          </aside>

          {tool !== "content" && renderToolPanel()}

          <div ref={splitRef} className="docstudio-split">
            <section
              className={`docstudio-editor docstudio-split-editor ${showPreviewMobile ? "hidden lg:flex" : "flex"}`}
              style={{ "--split-pct": `${split}%` }}>
              <div className="docstudio-editor-head">
                <div className="docstudio-tabs" role="tablist" aria-label="Chế độ soạn">
                  {[["json", "{ } JSON"], ["html", "<> HTML/CSS"]].map(([m, label]) => (
                    <button key={m} type="button" role="tab" aria-selected={mode === m}
                      className={`docstudio-tab ${mode === m ? "is-active" : ""}`}
                      onClick={() => switchMode(m)}>
                      {label}
                    </button>
                  ))}
                </div>
                <span className="flex-1" />
                <button type="button" className="docstudio-tool-btn" onClick={handleFormat} title="Định dạng mã nguồn">
                  <Wand2 className="w-3.5 h-3.5" /> Format
                </button>
              </div>

              <div className="docstudio-editor-code">
                <CodeEditor ref={editorRef} value={draft} language={mode === "json" ? "json" : "html"}
                  onChange={(text) => setDrafts((d) => (d[mode] === text ? d : { ...d, [mode]: text }))}
                  onCursor={handleCursor} />
              </div>

              <div className="docstudio-editor-foot">
                <span className={`docstudio-valid ${applyErrors.length ? "is-error" : ""}`}>
                  {applyErrors.length ? <FileWarning className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {applyErrors.length ? "Mã nguồn có lỗi" : "Mã nguồn hợp lệ"}
                </span>
                {appliedStale && !applyErrors.length && <span className="docstudio-stale">• Chưa áp dụng</span>}
                <span className="flex-1" />
                <button type="button" className="docstudio-convert-btn" onClick={convertIntoCurrent}
                  title={`Chuyển đổi nội dung từ ${mode === "html" ? "JSON" : "HTML/CSS"} sang chế độ hiện tại`}>
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Chuyển đổi</span>
                </button>
                <button type="button" className="docstudio-apply" onClick={handleApply}>
                  <Play className="w-4 h-4" /> Áp dụng thay đổi
                </button>
              </div>
            </section>

            <div role="separator" aria-orientation="vertical" onPointerDown={startDrag}
              className="hidden lg:block docstudio-divider" />

            <section ref={previewRef}
              className={`docstudio-preview ${showPreviewMobile ? "flex" : "hidden lg:flex"}`}>
              <div className="docstudio-preview-head">
                <span className="docstudio-preview-title">
                  Xem trước {docType === "word" ? "— trang A4" : "— slide"}
                </span>
                {appliedStale && <span className="docstudio-stale">(chưa áp dụng thay đổi mới nhất)</span>}
                <span className="flex-1" />
                <button type="button" className="docstudio-zoom-btn lg:hidden"
                  onClick={() => setShowPreviewMobile(false)} title="Về khung soạn thảo">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="docstudio-preview-body">
                {docType === "word" ? (
                  <WordPreview
                    bodyHtml={validApplied ? validApplied.bodyHtml : ""}
                    cssText={validApplied?.mode === "html" ? validApplied.cssText : ""}
                    zoom={zoom} reveal={reveal} />
                ) : (
                  <PowerPointPreview
                    model={validApplied?.mode === "json" ? validApplied.model : null}
                    bodyHtml={validApplied?.mode === "html" ? validApplied.bodyHtml : ""}
                    cssText={validApplied?.mode === "html" ? validApplied.cssText : ""}
                    zoom={zoom} ratio={ratio} onRatioChange={setRatio}
                    index={slideIndex} onIndexChange={setSlideIndex}
                    editable={mode === "json"} onSlideOp={handleSlideOp} reveal={reveal} />
                )}
              </div>
              <div className="docstudio-preview-foot">
                <button type="button" className="docstudio-zoom-btn" aria-label="Thu nhỏ"
                  onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}>
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="docstudio-zoom-val">{Math.round(zoom * 100)}%</span>
                <button type="button" className="docstudio-zoom-btn" aria-label="Phóng to"
                  onClick={() => setZoom((z) => Math.min(MAX_PREVIEW_ZOOM, +(z + 0.1).toFixed(2)))}>
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button type="button" className="docstudio-zoom-btn" aria-label="Toàn màn hình" onClick={toggleFullscreen}>
                  <Expand className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ── Điều hướng mobile: Soạn / Xem / Công cụ / Lưu / Xuất ─────── */}
      <nav className="docstudio-mobile-nav" aria-label="Thao tác soạn tài liệu">
        <button type="button" className={!showPreviewMobile && !mobileSheet ? "is-active" : ""}
          onClick={() => { setShowPreviewMobile(false); setMobileSheet(null); setTool("content"); editorRef.current?.focus(); }}>
          <FileText /> <span>Soạn</span>
        </button>
        <button type="button" className={showPreviewMobile ? "is-active" : ""}
          onClick={() => { setShowPreviewMobile(true); setMobileSheet(null); }}>
          <Eye /> <span>Xem</span>
        </button>
        <button type="button" className={mobileSheet === "tools" ? "is-active" : ""}
          onClick={() => setMobileSheet("tools")}>
          <Settings /> <span>Công cụ</span>
        </button>
        <button type="button" onClick={handleSave} disabled={saving}>
          <Save /> <span>{saving ? "Đang lưu" : "Lưu"}</span>
        </button>
        <button type="button" onClick={handleExport} disabled={exporting}>
          <Download /> <span>{exporting ? "Đang xuất" : "Xuất"}</span>
        </button>
      </nav>

      {mobileSheet === "tools" && (
        <div className="docstudio-mobile-sheet-wrap">
          <button type="button" className="docstudio-mobile-sheet-backdrop"
            onClick={() => setMobileSheet(null)} aria-label="Đóng bảng công cụ" />
          <section className="docstudio-mobile-sheet" role="dialog" aria-modal="true" aria-label="Công cụ soạn thảo">
            <header className="docstudio-mobile-sheet-head">
              <strong>Công cụ soạn thảo</strong>
              <button type="button" onClick={() => setMobileSheet(null)} aria-label="Đóng"><X /></button>
            </header>
            <div className="docstudio-mobile-sheet-tools">
              {[...RAIL_ITEMS, { id: "templates", label: "Mẫu", icon: LayoutTemplate }].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button"
                    className={`docstudio-rail-btn ${tool === item.id ? "is-active" : ""}`}
                    onClick={() => setTool(item.id)}>
                    <Icon /> <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="docstudio-mobile-sheet-body">
              {renderToolPanel()}
              <button type="button" className="docstudio-btn-ghost" onClick={() => { setMobileSheet(null); setUploadOpen(true); }}>
                <Upload className="w-4 h-4" /> Tải file lên (DOCX/PPTX/HTML/JSON)
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ── Kết quả xuất file (.docx / .pptx thật) ─────────────────────── */}
      {exportReport && (
        <Modal onClose={() => setExportReport(null)}>
          <h3 className="font-display text-xl text-ink mb-1">
            {exportReport.ok ? "Xuất file thành công" : "Xuất file thất bại"}
          </h3>
          <p className="text-sm font-body text-ink/70 mb-3">{exportReport.message}</p>
          {exportReport.warnings?.length > 0 && (
            <details className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
              <summary className="cursor-pointer text-[13px] font-semibold text-amber-800">
                {exportReport.warnings.length} cảnh báo chuyển đổi
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[12.5px] text-amber-900/90">
                {exportReport.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </details>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={() => setExportReport(null)}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper">Đóng</button>
          </div>
        </Modal>
      )}

      {/* ── Trợ lý AI: mở nhanh mẫu có sẵn (tính năng AI tự soạn đang phát triển) ── */}
      {aiOpen && (
        <Modal onClose={() => setAiOpen(false)}>
          <h3 className="font-display text-xl text-ink mb-1">Trợ lý AI</h3>
          <p className="text-sm font-body text-ink/60 mb-4">
            Trợ lý AI tự soạn nội dung đang được phát triển. Trong lúc chờ, bạn có thể bắt đầu từ một mẫu thiết kế sẵn:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {templatesFor(docType).slice(0, 4).map((tpl) => (
              <button key={tpl.id} type="button"
                className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-paper2 px-3 py-2.5 text-left hover:border-ink/25"
                onClick={() => { setAiOpen(false); loadCatalogTemplate(tpl); }}>
                <span className="docstudio-template-swatch" style={{
                  "--sw-a": tpl.theme.accent,
                  "--sw-b": tpl.theme.accent2,
                  "--sw-soft": tpl.theme.soft,
                }} aria-hidden="true"><i /><i /><i /></span>
                <span className="min-w-0">
                  <b className="block text-[13.5px] text-ink">{tpl.name}</b>
                  <small className="block text-[12px] text-ink/55">{tpl.categoryLabel} · {tpl.gradeRange}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => { setAiOpen(false); navigate("/dashboard/documents/templates"); }}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-ink/15 bg-white text-ink">
              Mở thư viện mẫu
            </button>
            <button type="button" onClick={() => setAiOpen(false)}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper">Đóng</button>
          </div>
        </Modal>
      )}

      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onImported={importUploaded}
        initialMode={mode}
        initialDocType={docType}
      />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
