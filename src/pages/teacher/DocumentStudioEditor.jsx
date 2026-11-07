import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowLeftRight, Check, Download, Expand, Eye, FileWarning,
  Play, Save, Wand2, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { navigate } from "../../lib/router.js";
import { documentService } from "../../services/documentService.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import { ConfirmModal } from "../../components/ui";
import CodeEditor from "./documents/CodeEditor.jsx";
import WordPreview from "./documents/WordPreview.jsx";
import PowerPointPreview from "./documents/PowerPointPreview.jsx";
import { applySource, convertSource } from "../../lib/documents/convert.js";
import { renderModelBodyHtml } from "../../lib/documents/modelRender.js";
import { templateSourceFor } from "../../lib/documents/templates.js";
import { exportWordDocx } from "../../lib/documents/wordExporter.js";
import "./documents/docstudio.css";

// DocumentStudioEditor — trang soạn tài liệu của Teacher Document Studio
// (/dashboard/documents/:documentId). Hai chế độ soạn (HTML/CSS ⇄ JSON)
// dùng chung MỘT mô hình trung gian (src/lib/documents):
//   • "Áp dụng" (Apply) mới đưa mã nguồn vào preview — mã lỗi thì preview
//     giữ bản hợp lệ gần nhất, nội dung đang sửa không bao giờ bị mất.
//   • Mỗi chế độ có bản nháp riêng trong state; chuyển tab không ghi đè
//     nhau. Chế độ đích đang trống → tự chuyển đổi từ chế độ hiện tại;
//     muốn đồng bộ lại khi đích đã có nháp → nút "Chuyển đổi từ …" (có
//     xác nhận ghi đè).
//   • Server chỉ lưu MỘT mã nguồn (theo chế độ đang chọn khi Lưu) — bản
//     nháp của chế độ còn lại chỉ sống trong phiên soạn này.

const snapshotOf = ({ name, docType, mode, source }) => JSON.stringify({ name, docType, mode, source });

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
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
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
      return true;
    }
    setApplyErrors(res.errors);
    return false;
  }, []);

  const handleApply = () => {
    if (doApply(draft, mode, docType)) showToast?.("Đã áp dụng — preview đã cập nhật", "success");
    else showToast?.("Mã nguồn đang có lỗi — preview giữ bản hợp lệ gần nhất", "error");
  };

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

  // ── Mẫu ───────────────────────────────────────────────────────────────
  const loadTemplate = (key) => {
    if (!key) return;
    const [tType, tMode] = key.split("-");
    const run = () => {
      const src = templateSourceFor(tType, tMode);
      setDocType(tType);
      setMode(tMode);
      setDrafts((d) => ({ ...d, [tMode]: src }));
      doApply(src, tMode, tType);
      setNotice("Đã nạp mẫu — hãy sửa nội dung theo bài dạy của bạn rồi bấm Lưu.");
    };
    if (draft.trim()) {
      askConfirm({
        title: "Nạp mẫu tài liệu",
        message: "Nạp mẫu sẽ thay thế bản nháp của chế độ đích. Nội dung chưa lưu ở chế độ đó sẽ mất. Tiếp tục?",
        confirmLabel: "Nạp mẫu",
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

  // ── Xuất Word (.docx thật) ────────────────────────────────────────────
  const handleExportWord = async () => {
    let current = validApplied;
    if (!current || appliedStale) {
      const res = applySource(draft, mode, docType);
      if (!res.ok) {
        setApplyErrors(res.errors);
        showToast?.("Mã nguồn đang có lỗi — sửa xong mới xuất được file Word.", "error");
        return;
      }
      current = buildApplied(mode, docType, res);
      setApplied(current);
      setAppliedSource(draft);
      setApplyErrors([]);
    }
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

  const handleFormat = () => {
    const res = editorRef.current?.format();
    if (res && !res.ok && res.error) {
      setApplyErrors([{
        message: `JSON sai cú pháp${res.error.line ? ` ở dòng ${res.error.line}, cột ${res.error.column}` : ""}: ${res.error.message}`,
        line: res.error.line,
      }]);
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

  if (loading) return <div className="p-10 font-body text-ink/60">Đang tải tài liệu…</div>;
  if (loadError) {
    return (
      <div className="p-10">
        <p className="font-body text-ink mb-4">{loadError}</p>
        <button type="button" onClick={() => navigate("/dashboard/documents")} className="px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper">Về danh sách</button>
      </div>
    );
  }

  const warnings = validApplied?.warnings || [];

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 118px)", minHeight: 520 }}>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 pb-3">
        <button type="button" onClick={() => navigate("/dashboard/documents")} title="Về danh sách tài liệu"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border border-ink/15 bg-white hover:bg-ink/5">
          <ArrowLeft className="w-4 h-4" /> Danh sách
        </button>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên tài liệu"
          className="note-card flex-1 min-w-[180px] px-3 py-2 text-sm font-semibold border-ink/10 bg-white" />
        <select value={docType} onChange={(e) => { setDocType(e.target.value); doApply(draft, mode, e.target.value); }}
          className="note-card px-3 py-2 text-sm border-ink/10 bg-white" aria-label="Loại tài liệu">
          <option value="word">Word</option>
          <option value="powerpoint">PowerPoint</option>
        </select>
        <div className="flex rounded-full border border-ink/15 overflow-hidden" role="tablist" aria-label="Chế độ soạn">
          {[["html", "HTML/CSS"], ["json", "JSON"]].map(([m, label]) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchMode(m)}
              className={`px-3.5 py-2 text-sm font-semibold ${mode === m ? "bg-ink text-paper" : "bg-white hover:bg-ink/5"}`}>
              {label}
            </button>
          ))}
        </div>
        <select value="" onChange={(e) => { loadTemplate(e.target.value); e.target.value = ""; }}
          className="note-card px-3 py-2 text-sm border-ink/10 bg-white" aria-label="Nạp mẫu">
          <option value="">Nạp mẫu…</option>
          <option value="word-html">Word — mẫu HTML/CSS</option>
          <option value="word-json">Word — mẫu JSON</option>
          <option value="powerpoint-html">PowerPoint — mẫu HTML/CSS</option>
          <option value="powerpoint-json">PowerPoint — mẫu JSON</option>
        </select>
        <span className={`text-xs font-body whitespace-nowrap ${isDirty ? "text-amber-600" : "text-ink/50"}`}>
          {saving ? "Đang lưu…" : isDirty ? "● Chưa lưu" : "✓ Đã lưu"}
        </span>
        <button type="button" onClick={() => setShowPreviewMobile((v) => !v)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border border-ink/15 bg-white">
          <Eye className="w-4 h-4" /> {showPreviewMobile ? "Soạn thảo" : "Xem trước"}
        </button>
        <button type="button" onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-ink text-paper disabled:opacity-40">
          <Save className="w-4 h-4" /> Lưu
        </button>
        {docType === "word" ? (
          <button type="button" onClick={handleExportWord} disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#2563eb] text-white disabled:opacity-40">
            <Download className="w-4 h-4" /> {exporting ? "Đang xuất…" : "Xuất Word (.docx)"}
          </button>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-ink/10 text-ink/50"
            title="Xuất .pptx thật sẽ có ở đợt 2 của Teacher Document Studio">
            <Download className="w-4 h-4" /> Xuất PowerPoint — sắp có (đợt 2)
          </span>
        )}
      </div>

      {/* ── Thông báo / lỗi / cảnh báo / kết quả xuất ─────────────────── */}
      {notice && (
        <div className="mb-2 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-sm font-body text-blue-900">
          <Check className="w-4 h-4 mt-0.5 shrink-0" /> <span className="flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Đóng thông báo"><X className="w-4 h-4" /></button>
        </div>
      )}
      {applyErrors.length > 0 && (
        <div className="mb-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm font-body text-red-900">
          <p className="flex items-center gap-2 font-semibold"><FileWarning className="w-4 h-4" />
            Mã nguồn chưa hợp lệ — preview đang giữ bản hợp lệ gần nhất:</p>
          <ul className="list-disc pl-6 mt-1">
            {applyErrors.map((e, i) => <li key={i}>{e.message}</li>)}
          </ul>
        </div>
      )}
      {warnings.length > 0 && applyErrors.length === 0 && (
        <div className="mb-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm font-body text-amber-900">
          <p className="font-semibold">Lưu ý khi chuyển đổi/xuất file:</p>
          <ul className="list-disc pl-6 mt-1">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
      {exportReport && (
        <div className={`mb-2 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm font-body ${exportReport.ok ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"}`}>
          <div className="flex-1">
            <p>{exportReport.message}</p>
            {exportReport.warnings?.length > 0 && (
              <ul className="list-disc pl-6 mt-1">
                {exportReport.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </div>
          <button type="button" onClick={() => setExportReport(null)} aria-label="Đóng"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Hai khung: soạn | xem trước ──────────────────────────────── */}
      <div ref={splitRef} className="flex flex-1 min-h-0">
        <div className={`${showPreviewMobile ? "hidden" : "flex"} lg:flex flex-col min-h-0 flex-1 docstudio-split-editor`}
          style={{ "--split-pct": `${split}%` }}>
          <div className="flex items-center gap-2 pb-2">
            <span className="font-body text-sm font-semibold text-ink/70">
              Mã nguồn — {mode === "html" ? "HTML/CSS" : "JSON"}
            </span>
            <span className="flex-1" />
            <button type="button" onClick={convertIntoCurrent} title="Chuyển đổi nội dung từ chế độ kia sang chế độ hiện tại"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Chuyển đổi từ {mode === "html" ? "JSON" : "HTML/CSS"}
            </button>
            <button type="button" onClick={handleFormat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5">
              <Wand2 className="w-3.5 h-3.5" /> Format Code
            </button>
            <button type="button" onClick={handleApply}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2563eb] text-white">
              <Play className="w-3.5 h-3.5" /> Apply Changes
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor ref={editorRef} value={draft} language={mode === "json" ? "json" : "html"}
              onChange={(text) => setDrafts((d) => (d[mode] === text ? d : { ...d, [mode]: text }))} />
          </div>
        </div>

        <div role="separator" aria-orientation="vertical" onPointerDown={startDrag}
          className="hidden lg:block w-2 shrink-0 cursor-col-resize rounded bg-ink/10 hover:bg-ink/25 mx-1 self-stretch" />

        <div ref={previewRef} className={`${showPreviewMobile ? "flex" : "hidden"} lg:flex flex-col min-h-0 bg-[#ece7db] rounded-xl border border-ink/10 overflow-hidden`}
          style={{ flex: 1 }}>
          <div className="flex items-center gap-2 px-3 py-2 bg-paper2 border-b border-ink/10">
            <span className="font-body text-sm font-semibold text-ink/70">
              Xem trước {docType === "word" ? "— trang A4" : "— slide"}
              {appliedStale && <span className="text-amber-600 font-normal"> (chưa áp dụng thay đổi mới nhất)</span>}
            </span>
            <span className="flex-1" />
            <button type="button" aria-label="Thu nhỏ" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
              className="p-1.5 rounded-full hover:bg-ink/5"><ZoomOut className="w-4 h-4" /></button>
            <span className="font-body text-xs text-ink/60 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Phóng to" onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
              className="p-1.5 rounded-full hover:bg-ink/5"><ZoomIn className="w-4 h-4" /></button>
            <button type="button" aria-label="Toàn màn hình" onClick={toggleFullscreen}
              className="p-1.5 rounded-full hover:bg-ink/5"><Expand className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 min-h-0">
            {docType === "word" ? (
              <WordPreview
                bodyHtml={validApplied ? validApplied.bodyHtml : ""}
                cssText={validApplied?.mode === "html" ? validApplied.cssText : ""}
                zoom={zoom} />
            ) : (
              <PowerPointPreview
                model={validApplied?.mode === "json" ? validApplied.model : null}
                bodyHtml={validApplied?.mode === "html" ? validApplied.bodyHtml : ""}
                cssText={validApplied?.mode === "html" ? validApplied.cssText : ""}
                zoom={zoom} ratio={ratio} onRatioChange={setRatio} />
            )}
          </div>
        </div>
      </div>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
