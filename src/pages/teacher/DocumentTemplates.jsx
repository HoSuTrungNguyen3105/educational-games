import { useMemo, useState } from "react";
import {
  ArrowLeft, CircleAlert, Eye, FileText, Plus, Presentation, Search, Sparkles, Upload,
} from "lucide-react";
import { navigate } from "../../lib/router.js";
import { documentService } from "../../services/documentService.js";
import { matchesQuery } from "../../lib/searchText.js";
import { applySource } from "../../lib/documents/convert.js";
import { renderModelBodyHtml, themeCssForModel } from "../../lib/documents/modelRender.js";
import {
  GRADE_FILTERS,
  POWERPOINT_TEMPLATES,
  PPT_CATEGORY_FILTERS,
  WORD_CATEGORY_FILTERS,
  WORD_TEMPLATES,
} from "../../lib/documents/templates.js";
import { Modal } from "../../components/ui";
import WordPreview from "./documents/WordPreview.jsx";
import PowerPointPreview from "./documents/PowerPointPreview.jsx";
import TemplateThumbnail from "./documents/TemplateThumbnail.jsx";
import DocumentUploadModal from "./documents/DocumentUploadModal.jsx";
import "./documents/templateLibrary.css";

const TYPE_META = {
  word: { label: "Word", badge: "word", icon: FileText },
  powerpoint: { label: "PowerPoint", badge: "ppt", icon: Presentation },
};

function countBy(list, key) {
  return list.filter((t) => t.category === key).length;
}

export default function DocumentTemplates({ showToast }) {
  const [docType, setDocType] = useState("word");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [grade, setGrade] = useState("all");
  const [preview, setPreview] = useState(null);
  const [creatingId, setCreatingId] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createError, setCreateError] = useState("");

  const catalog = docType === "word" ? WORD_TEMPLATES : POWERPOINT_TEMPLATES;
  const categories = docType === "word" ? WORD_CATEGORY_FILTERS : PPT_CATEGORY_FILTERS;

  const filtered = useMemo(() => catalog.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (grade !== "all") {
      const matchesGrade = grade === "unlimited"
        ? t.levelKeys?.includes("unlimited") || t.levels?.includes("Không giới hạn")
        : t.levelKeys?.includes(grade);
      if (!matchesGrade) return false;
    }
    return matchesQuery(query, [t.name, t.englishName, t.description, t.subjects, ...(t.tags || [])].join(" "));
  }), [catalog, category, grade, query]);

  const previewData = useMemo(() => {
    if (!preview) return null;
    const mode = preview.defaultMode;
    const applied = applySource(preview.sourceFor(mode), mode, preview.kind);
    if (!applied.ok) return { error: (applied.errors || []).map((e) => e.message).join("\n") };
    if (preview.kind === "powerpoint") return { model: applied.model };
    return {
      bodyHtml: applied.bodyHtml || renderModelBodyHtml(applied.model),
      cssText: applied.cssText || themeCssForModel(applied.model),
    };
  }, [preview]);

  const changeType = (type) => {
    setDocType(type);
    setCategory("all");
    setGrade("all");
    setQuery("");
    setCreateError("");
  };

  const createFromTemplate = async (template) => {
    setCreatingId(template.id);
    setCreateError("");
    try {
      const doc = await documentService.create({
        name: template.name,
        docType: template.kind,
        mode: template.defaultMode,
        source: template.sourceFor(template.defaultMode),
      });
      showToast?.("Đã tạo tài liệu từ mẫu", "success");
      navigate(`/dashboard/documents/${doc.id}`);
    } catch (e) {
      const message = e?.message || "Tạo tài liệu từ mẫu thất bại";
      setCreateError(message);
      showToast?.(message, "error");
    } finally {
      setCreatingId(null);
    }
  };

  const createFromUpload = async (result) => {
    try {
      const doc = await documentService.create({
        name: result.name,
        docType: result.docType,
        mode: result.mode,
        source: result.source,
      });
      setUploadOpen(false);
      showToast?.("Đã nhập tài liệu từ file", "success");
      navigate(`/dashboard/documents/${doc.id}`);
    } catch (e) {
      showToast?.(e?.message || "Tạo tài liệu từ file thất bại", "error");
    }
  };

  return (
    <div className="tpl-library">
      <section className="tpl-library-hero">
        <h1>Thư viện 20 mẫu tài liệu giảng dạy</h1>
        <p>
          10 mẫu Word và 10 mẫu PowerPoint được thiết kế riêng cho giáo viên Việt Nam.
          Mỗi mẫu có nội dung minh họa thực tế, xem trước trực tiếp và mở ra chỉnh sửa
          ngay ở cả chế độ HTML/CSS lẫn JSON.
        </p>
        <div className="tpl-library-hero-actions">
          <button type="button" className="tpl-library-btn ghost" onClick={() => navigate("/dashboard/documents")}>
            <ArrowLeft className="w-4 h-4" /> Về danh sách tài liệu
          </button>
          <button type="button" className="tpl-library-btn primary" onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4" /> Tải file lên
          </button>
        </div>
      </section>

      <div className="tpl-library-tabs" role="tablist" aria-label="Loại mẫu tài liệu">
        <button
          type="button"
          role="tab"
          aria-selected={docType === "word"}
          className={`tpl-library-tab ${docType === "word" ? "is-active" : ""}`}
          onClick={() => changeType("word")}
        >
          <FileText className="w-4 h-4" /> Mẫu Word <span className="count">{WORD_TEMPLATES.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={docType === "powerpoint"}
          className={`tpl-library-tab ${docType === "powerpoint" ? "is-active" : ""}`}
          onClick={() => changeType("powerpoint")}
        >
          <Presentation className="w-4 h-4" /> Mẫu PowerPoint <span className="count">{POWERPOINT_TEMPLATES.length}</span>
        </button>
      </div>

      <div className="tpl-library-tools">
        <label className="tpl-library-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Tìm ${docType === "word" ? "mẫu Word" : "mẫu PowerPoint"} theo tên, môn, chủ đề…`}
            aria-label="Tìm kiếm mẫu"
          />
        </label>
        <div className="tpl-library-filters">
          <div className="tpl-chip-row">
            <span>Danh mục</span>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`tpl-chip ${category === c.id ? "is-active" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
                {c.id !== "all" && <span className="tpl-chip-count">{countBy(catalog, c.id)}</span>}
              </button>
            ))}
          </div>
          <div className="tpl-chip-row">
            <span>Cấp học</span>
            {GRADE_FILTERS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`tpl-chip ${grade === g.id ? "is-active" : ""}`}
                onClick={() => setGrade(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tpl-library-summary">
        <span>
          Hiển thị <strong>{filtered.length}</strong> / {catalog.length} mẫu
          {query ? ` cho “${query}”` : ""}
        </span>
        <span>Chọn “Xem trước” để kiểm tra nội dung, “Dùng mẫu” để tạo tài liệu mới.</span>
      </div>

      {createError && (
        <div className="doc-upload-error" role="alert">
          <CircleAlert className="w-5 h-5 shrink-0" /> <span className="whitespace-pre-line">{createError}</span>
        </div>
      )}

      <div className="tpl-library-grid">
        {filtered.map((t) => {
          const meta = TYPE_META[t.kind];
          return (
            <article className="tpl-card" key={t.id}>
              <div className="tpl-card-preview">
                <TemplateThumbnail template={t} />
              </div>
              <div className="tpl-card-body">
                <div className="tpl-card-badges">
                  <span className={`tpl-badge ${meta.badge}`}>{meta.label}</span>
                  <span className="tpl-badge soft">{t.categoryLabel}</span>
                  <span className="tpl-badge green">{t.gradeRange}</span>
                </div>
                <h3>{t.name}</h3>
                <p className="tpl-card-desc">{t.description}</p>
                <div className="tpl-card-meta">
                  <span>{t.subjects}</span>
                  <span>{t.kind === "word" ? `${t.pageCount} trang mẫu` : `${t.slideCount} slide · 16:9/4:3`}</span>
                </div>
                <div className="tpl-card-actions">
                  <button type="button" className="tpl-card-btn" onClick={() => setPreview(t)}>
                    <Eye className="w-4 h-4" /> Xem trước
                  </button>
                  <button type="button" className="tpl-card-btn primary" onClick={() => createFromTemplate(t)} disabled={creatingId === t.id}>
                    {creatingId === t.id ? "Đang tạo…" : <><Sparkles className="w-4 h-4" /> Dùng mẫu</>}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {!filtered.length && (
          <div className="tpl-library-empty">
            <strong>Không tìm thấy mẫu phù hợp</strong>
            Thử xóa từ khóa hoặc chọn danh mục/cấp học khác.
          </div>
        )}
      </div>

      {preview && (
        <Modal onClose={() => setPreview(null)} wide contentClassName="max-w-[1040px] p-0 overflow-hidden">
          <div className="tpl-preview-head">
            <div>
              <div className="tpl-card-badges">
                <span className={`tpl-badge ${TYPE_META[preview.kind].badge}`}>{TYPE_META[preview.kind].label}</span>
                <span className="tpl-badge soft">{preview.categoryLabel}</span>
                <span className="tpl-badge green">{preview.gradeRange}</span>
              </div>
              <h3>{preview.name}</h3>
              <p>{preview.subjects} · {preview.kind === "word" ? `${preview.pageCount} trang mẫu` : `${preview.slideCount} slide`}</p>
            </div>
            <button type="button" className="tpl-preview-close" onClick={() => setPreview(null)} aria-label="Đóng">
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
          <div className="tpl-preview-body">
            {previewData?.error ? (
              <div className="doc-upload-error" role="alert">
                <CircleAlert className="w-5 h-5 shrink-0" />
                <span className="whitespace-pre-line">{previewData.error}</span>
              </div>
            ) : previewData?.model ? (
              <PowerPointPreview model={previewData.model} ratio="16:9" />
            ) : previewData ? (
              <WordPreview bodyHtml={previewData.bodyHtml} cssText={previewData.cssText} />
            ) : null}
          </div>
          <div className="tpl-preview-foot">
            <button type="button" className="tpl-library-btn ghost" onClick={() => setPreview(null)}>Đóng</button>
            <button
              type="button"
              className="tpl-library-btn primary"
              onClick={() => { const t = preview; setPreview(null); createFromTemplate(t); }}
              disabled={creatingId === preview.id}
            >
              <Sparkles className="w-4 h-4" /> {creatingId === preview.id ? "Đang tạo…" : "Dùng mẫu này"}
            </button>
          </div>
        </Modal>
      )}

      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onImported={createFromUpload}
        initialMode="json"
      />
    </div>
  );
}
