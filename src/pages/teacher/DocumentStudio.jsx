import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, FileText, LayoutTemplate, Pencil, Presentation, Trash2, Upload } from "lucide-react";
import { navigate } from "../../lib/router.js";
import { documentService } from "../../services/documentService.js";
import { templateSourceFor } from "../../lib/documents/templates.js";
import { matchesQuery } from "../../lib/searchText.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import {
  ConfirmModal, FormModal, GridCard, IconButton, ManagementHeader, ManagementTable,
} from "../../components/ui";
import DocumentUploadModal from "./documents/DocumentUploadModal.jsx";

// DocumentStudio — danh sách tài liệu của Teacher Document Studio tại
// /dashboard/documents, dùng đúng kit lưới dùng chung (ManagementTable +
// GridCard) như các trang quản lý khác. Tạo mới: chọn loại Word /
// PowerPoint và chế độ soạn (HTML/CSS hoặc JSON), tài liệu được nạp sẵn
// MẪU tương ứng để giáo viên sửa ngay. Nhân bản = GET bản đầy đủ + POST.

const CREATE_FIELDS = [
  { name: "name", label: "Tên tài liệu", placeholder: "VD: Phiếu bài tập Toán — Tuần 5" },
  {
    name: "docType", label: "Loại tài liệu", type: "select",
    options: [
      { value: "word", label: "Word (trang A4, xuất .docx)" },
      { value: "powerpoint", label: "PowerPoint (slide)" },
    ],
  },
  {
    name: "mode", label: "Chế độ soạn", type: "select",
    options: [
      { value: "html", label: "HTML/CSS (trình soạn mã)" },
      { value: "json", label: "JSON (dữ liệu cấu trúc)" },
    ],
  },
];

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function fmtSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

const typeLabel = (t) => (t === "powerpoint" ? "PowerPoint" : "Word");
const modeLabel = (m) => (m === "json" ? "JSON" : "HTML/CSS");

export default function DocumentStudio({ showToast }) {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", docType: "word", mode: "html" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    try {
      const res = await documentService.listMine({ perPage: 100 });
      setDocs(res?.data || []);
      setError("");
    } catch (e) {
      setError(e?.message || "Không tải được danh sách tài liệu");
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!docs) return docs;
    return docs.filter((d) =>
      (typeFilter === "all" || d.docType === typeFilter) &&
      matchesQuery(query, d.name));
  }, [docs, query, typeFilter]);

  const submitCreate = async () => {
    if (!form.name.trim()) { setCreateError("Vui lòng nhập tên tài liệu"); return; }
    setCreating(true);
    setCreateError("");
    try {
      const doc = await documentService.create({
        name: form.name.trim(),
        docType: form.docType,
        mode: form.mode,
        source: templateSourceFor(form.docType, form.mode),
      });
      setCreateOpen(false);
      setForm({ name: "", docType: "word", mode: "html" });
      showToast?.("Đã tạo tài liệu", "success");
      navigate(`/dashboard/documents/${doc.id}`);
    } catch (e) {
      setCreateError(e?.message || "Tạo tài liệu thất bại");
    } finally { setCreating(false); }
  };

  const createFromUpload = async (result) => {
    try {
      const doc = await documentService.create({
        name: result.name,
        docType: result.docType,
        mode: result.mode,
        source: result.source,
      });
      // File .pptx mang theo tỷ lệ slide gốc — tài liệu không có trường
      // tỷ lệ riêng nên chuyển qua sessionStorage cho editor đọc một
      // lần khi mở (đúng mẫu nháp phiên của AI Studio).
      if (result.ratio) {
        try { sessionStorage.setItem(`docstudio.ratio.${doc.id}`, result.ratio); } catch { /* bỏ qua */ }
      }
      setUploadOpen(false);
      showToast?.("Đã nhập tài liệu từ file", "success");
      navigate(`/dashboard/documents/${doc.id}`);
    } catch (e) {
      showToast?.(e?.message || "Tạo tài liệu từ file thất bại", "error");
    }
  };

  const duplicate = async (item) => {
    setBusyId(item.id);
    try {
      const full = await documentService.get(item.id);
      await documentService.create({
        name: `${full.name || "Tài liệu"} (bản sao)`.slice(0, 200),
        docType: full.docType,
        mode: full.mode,
        source: full.source || "",
      });
      showToast?.("Đã nhân bản tài liệu", "success");
      await load();
    } catch (e) {
      showToast?.(e?.message || "Nhân bản thất bại", "error");
    } finally { setBusyId(null); }
  };

  const askRemove = (item) => {
    askConfirm({
      title: "Xoá tài liệu",
      message: `Xoá tài liệu "${item.name || "(chưa có tên)"}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await documentService.remove(item.id);
          showToast?.("Đã xoá tài liệu", "success");
          load();
        } catch (e) {
          showToast?.(e?.message || "Xoá thất bại", "error");
        }
      },
    });
  };

  return (
    <div>
      <ManagementHeader title="Soạn tài liệu" subtitle="Soạn tài liệu Word (trang A4, xuất .docx thật) và PowerPoint bằng mã HTML/CSS hoặc JSON — xem trước trực tiếp khi soạn">
        <button type="button" onClick={() => navigate("/dashboard/documents/templates")}
          className="note-card inline-flex items-center gap-1.5 px-3 py-2 text-sm font-body font-semibold border-ink/10 bg-white hover:bg-paper2 transition">
          <LayoutTemplate className="w-4 h-4" /> Thư viện mẫu
        </button>
        <button type="button" onClick={() => setUploadOpen(true)}
          className="note-card inline-flex items-center gap-1.5 px-3 py-2 text-sm font-body font-semibold border-ink/10 bg-white hover:bg-paper2 transition">
          <Upload className="w-4 h-4" /> Tải file lên
        </button>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="note-card px-3 py-2 text-sm border-ink/10 bg-paper2">
          <option value="all">Tất cả loại</option>
          <option value="word">Word</option>
          <option value="powerpoint">PowerPoint</option>
        </select>
      </ManagementHeader>

      <ManagementTable
        viewKey="teacher-documents"
        data={docs ? filtered : docs}
        error={error && !docs ? error : null}
        onRetry={load}
        emptyLabel={query || typeFilter !== "all"
          ? "Không có tài liệu nào khớp bộ lọc."
          : "Chưa có tài liệu nào — bấm “Tài liệu mới” để soạn tài liệu đầu tiên."}
        onCreate={() => { setCreateError(""); setCreateOpen(true); }}
        addLabel="Tài liệu mới"
        search={{ value: query, onChange: setQuery, placeholder: "Tìm tài liệu…" }}
        headers={["Tên tài liệu", "Loại", "Chế độ", "Kích thước", "Cập nhật", ""]}
        renderGridCard={(doc) => (
          <GridCard
            key={doc.id}
            title={doc.name || "(Chưa có tên)"}
            badge={doc.docType === "powerpoint"
              ? { label: "PowerPoint", tone: "gold" }
              : { label: "Word", tone: "blue" }}
            mono={modeLabel(doc.mode)}
            meta={`${fmtSize(doc.sourceBytes)} · Cập nhật ${fmtDate(doc.updatedAt)}`}
            footerActions={[
              { label: "Soạn thảo", icon: <Pencil />, onClick: () => navigate(`/dashboard/documents/${doc.id}`), tone: "blue" },
              { label: busyId === doc.id ? "Đang sao…" : "Nhân bản", icon: <Copy />, onClick: () => duplicate(doc), tone: "muted" },
              { label: "Xoá", icon: <Trash2 />, onClick: () => askRemove(doc), tone: "red" },
            ]}
          />
        )}
        renderRow={(doc) => (
          <tr key={doc.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-body font-semibold text-ink">
              <span className="inline-flex items-center gap-2">
                {doc.docType === "powerpoint" ? <Presentation className="w-4 h-4 text-ink/50" /> : <FileText className="w-4 h-4 text-ink/50" />}
                {doc.name || "(Chưa có tên)"}
              </span>
            </td>
            <td className="px-5 py-3 font-body text-ink">{typeLabel(doc.docType)}</td>
            <td className="px-5 py-3 font-body text-ink">{modeLabel(doc.mode)}</td>
            <td className="px-5 py-3 font-body text-ink">{fmtSize(doc.sourceBytes)}</td>
            <td className="px-5 py-3 font-body text-ink">{fmtDate(doc.updatedAt)}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Soạn thảo" onClick={() => navigate(`/dashboard/documents/${doc.id}`)}><Pencil /></IconButton>
                <IconButton title="Nhân bản" onClick={() => duplicate(doc)}><Copy /></IconButton>
                <IconButton title="Xoá" tone="danger" onClick={() => askRemove(doc)}><Trash2 /></IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal
        open={createOpen}
        title="tài liệu"
        fields={CREATE_FIELDS}
        values={form}
        onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))}
        onSubmit={submitCreate}
        onClose={() => setCreateOpen(false)}
        error={createError}
        saving={creating}
      />

      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onImported={createFromUpload}
      />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
