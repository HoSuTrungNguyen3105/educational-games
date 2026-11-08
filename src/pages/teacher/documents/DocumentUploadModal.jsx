import { useRef, useState } from "react";
import {
  Check, CircleAlert, FileText, FileUp, Loader2, Presentation, UploadCloud, X,
} from "lucide-react";
import { Modal } from "../../../components/ui";
import { parseUploadedFile } from "../../../lib/documents/importers.js";
import "./templateLibrary.css";

// DocumentUploadModal — nhận file giáo viên tải lên và phân tích thành mã
// nguồn JSON hoặc HTML/CSS để tiếp tục soạn trong Document Studio.
// Hỗ trợ .docx, .pptx, .html, .json, .txt/.md; không chạy script trong file.
const ACCEPT = ".docx,.pptx,.html,.htm,.json,.txt,.md,.markdown";

const TYPE_LABEL = { word: "Word", powerpoint: "PowerPoint" };
const extOf = (name) => String(name || "").toLowerCase().split(".").pop() || "";

export default function DocumentUploadModal({
  open, onClose, onImported, initialMode = "json", initialDocType = "auto",
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState(initialMode);
  const [docType, setDocType] = useState(initialDocType);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState(null);
  const [importName, setImportName] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  const resetResult = () => {
    setResult(null);
    setError("");
  };

  const pickFile = (f) => {
    setFile(f || null);
    setImportName(f ? String(f.name || "").replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") : "");
    resetResult();
  };

  const parse = async () => {
    if (!file) { setError("Vui lòng chọn file cần nhập."); return; }
    setParsing(true);
    setError("");
    resetResult();
    try {
      const parsed = await parseUploadedFile(file, {
        docType: docType === "auto" ? undefined : docType,
        outputMode: mode,
      });
      setResult(parsed);
      setImportName(parsed.name || importName);
    } catch (e) {
      setError(e?.message || "Không phân tích được file.");
    } finally {
      setParsing(false);
    }
  };

  const create = () => {
    if (!result) return;
    onImported?.({
      ...result,
      name: importName.trim() || result.name,
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) pickFile(f);
  };

  const fileExt = extOf(file?.name);
  const isPptx = fileExt === "pptx";
  const isDocx = fileExt === "docx";

  return (
    <Modal onClose={onClose} wide contentClassName="max-w-3xl p-0 overflow-hidden">
      <div className="doc-upload">
        <div className="doc-upload-head">
          <div>
            <span className="doc-upload-eyebrow">Nhập tài liệu</span>
            <h2>Tải file lên để chuyển thành JSON hoặc HTML</h2>
            <p>Hỗ trợ .docx, .pptx, .html, .json, .txt/.md · tối đa 25 MB</p>
          </div>
          <button type="button" className="doc-upload-close" onClick={onClose} aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="doc-upload-body">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`doc-upload-drop ${dragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="doc-upload-file">
                <span className="doc-upload-file-icon">
                  {isPptx ? <Presentation className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </span>
                <div className="min-w-0">
                  <strong className="block truncate">{file.name}</strong>
                  <span>{(file.size / 1024).toFixed(1)} KB · bấm để chọn file khác</span>
                </div>
                <Check className="w-5 h-5 ml-auto shrink-0" />
              </div>
            ) : (
              <div className="doc-upload-empty">
                <UploadCloud className="w-10 h-10" />
                <strong>Kéo thả file vào đây</strong>
                <span>hoặc bấm để chọn từ máy tính</span>
                <small>Word · PowerPoint · HTML · JSON · văn bản</small>
              </div>
            )}
          </div>

          <div className="doc-upload-options">
            <div>
              <label className="doc-upload-label">Định dạng đầu ra</label>
              <div className="doc-upload-segment">
                <button type="button" className={mode === "json" ? "is-active" : ""} onClick={() => { setMode("json"); resetResult(); }}>
                  JSON
                  <small>Cấu trúc dễ chỉnh</small>
                </button>
                <button type="button" className={mode === "html" ? "is-active" : ""} onClick={() => { setMode("html"); resetResult(); }}>
                  HTML/CSS
                  <small>Giữ bố cục, tự do thiết kế</small>
                </button>
              </div>
            </div>
            <div>
              <label className="doc-upload-label" htmlFor="upload-doctype">Loại tài liệu</label>
              <select
                id="upload-doctype"
                className="doc-upload-select"
                value={docType}
                onChange={(e) => { setDocType(e.target.value); resetResult(); }}
              >
                <option value="auto">Tự động nhận diện</option>
                <option value="word">Word — trang A4</option>
                <option value="powerpoint">PowerPoint — slide</option>
              </select>
              <p className="doc-upload-hint">
                {isDocx ? "File .docx luôn được nhập thành tài liệu Word." : isPptx ? "File .pptx luôn được nhập thành bài PowerPoint." : "Chọn loại tài liệu phù hợp với nội dung file."}
              </p>
            </div>
          </div>

          {error && (
            <div className="doc-upload-error" role="alert">
              <CircleAlert className="w-5 h-5 shrink-0" />
              <span className="whitespace-pre-line">{error}</span>
            </div>
          )}

          {result && (
            <div className="doc-upload-result">
              <div className="doc-upload-result-head">
                <span className="doc-upload-result-icon"><Check className="w-4 h-4" /></span>
                <div>
                  <strong>Phân tích thành công</strong>
                  <span>
                    {TYPE_LABEL[result.docType]} · {result.mode === "json" ? "JSON" : "HTML/CSS"} ·{" "}
                    {result.itemCount} {result.docType === "powerpoint" ? "slide" : "khối nội dung"}
                  </span>
                </div>
              </div>
              <label className="doc-upload-label" htmlFor="upload-name">Tên tài liệu mới</label>
              <input
                id="upload-name"
                className="doc-upload-name"
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
                placeholder="Tên tài liệu"
              />
              {result.warnings?.length > 0 && (
                <details className="doc-upload-warnings">
                  <summary>{result.warnings.length} cảnh báo chuyển đổi (không chặn nhập)</summary>
                  <ul>
                    {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </details>
              )}
              <details className="doc-upload-preview">
                <summary>Xem trước mã nguồn</summary>
                <pre>{result.source.slice(0, 1400)}{result.source.length > 1400 ? "\n…" : ""}</pre>
              </details>
            </div>
          )}
        </div>

        <div className="doc-upload-foot">
          <span className="doc-upload-foot-note">
            <FileUp className="w-4 h-4" /> Nội dung được phân tích ngay trên trình duyệt.
          </span>
          <div className="flex items-center gap-2">
            <button type="button" className="doc-upload-btn ghost" onClick={onClose}>Hủy</button>
            {!result ? (
              <button type="button" className="doc-upload-btn primary" onClick={parse} disabled={!file || parsing}>
                {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {parsing ? "Đang phân tích…" : "Phân tích file"}
              </button>
            ) : (
              <button type="button" className="doc-upload-btn primary" onClick={create} disabled={!importName.trim()}>
                <Check className="w-4 h-4" /> Tạo tài liệu
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
