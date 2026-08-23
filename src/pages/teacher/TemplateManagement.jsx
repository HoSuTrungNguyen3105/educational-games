import { useCallback, useEffect, useRef, useState } from 'react'
import { templateService } from '../../services/api.js'
import { injectApiBridge, detectApiMarkers } from '../../lib/apiBridge.js'
import { IconButton, ManagementHeader, ManagementForm, ManagementTable, Field } from '../../components/ui.jsx'

const CATEGORY_OPTIONS = [
  { value: "quiz", label: "Trắc nghiệm" },
  { value: "reflex", label: "Phản xạ" },
  { value: "science", label: "Khoa học" },
  { value: "language", label: "Ngôn ngữ" },
  { value: "math", label: "Toán học" },
  { value: "geography", label: "Địa lý" },
  { value: "history", label: "Lịch sử" },
  { value: "puzzle", label: "Puzzle" },
  { value: "strategy", label: "Chiến thuật" },
  { value: "arcade", label: "Arcade" },
  { value: "group", label: "Theo nhóm" },
  { value: "seasonal", label: "Lễ hội" },
  { value: "memory", label: "Trí nhớ" },
  { value: "logic", label: "Tư duy" },
  { value: "adventure", label: "Phiêu lưu" },
];

const EMPTY_FORM = { name: "", description: "", type: "play-to-learn", category: "quiz", icon: "🎲", ring: "#1D2E4A", htmlTemplate: "", thumbnail: "", status: "draft" };

export default function TemplateManagement({ showToast }) {
  const [templates, setTemplates] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState(null);
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const load = useCallback(() => {
    setTemplates(null); setError(null);
    templateService.list().then(setTemplates).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Tên template không được để trống");
      return;
    }
    setSaving(true); setError(null);
    try {
      const markers = detectApiMarkers(form.htmlTemplate);
      const payload = {
        ...form,
        htmlTemplate: injectApiBridge(form.htmlTemplate),
      };
      if (editId) {
        await templateService.update(editId, payload);
        showToast(markers.length > 0
          ? `Đã cập nhật template (auto-inject: ${markers.join(", ")})`
          : "Đã cập nhật template");
      } else {
        await templateService.create(payload);
        showToast(markers.length > 0
          ? `Đã tạo template mới (auto-inject: ${markers.join(", ")})`
          : "Đã tạo template mới");
      }
      setForm({ ...EMPTY_FORM });
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message || "Không thể lưu template");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t) => {
    setForm({
      name: t.name || "",
      description: t.description || "",
      type: t.type || "play-to-learn",
      category: t.category || "quiz",
      icon: t.icon || "🎲",
      ring: t.ring || "#1D2E4A",
      htmlTemplate: t.htmlTemplate || "",
      thumbnail: t.thumbnail || "",
      status: t.status || "draft",
    });
    setEditId(t._id);
    setError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setError(null);
  };

  const removeTemplate = async (t) => {
    if (!confirm(`Xóa template "${t.name}"?`)) return;
    try {
      const result = await templateService.remove(t._id);
      if (result?.deactivated) {
        showToast(`Template đang được ${result.gamesCount} game sử dụng, đã chuyển sang inactive`);
      } else {
        showToast("Đã xóa template");
      }
      if (editId === t._id) cancelEdit();
      load();
    } catch (err) {
      setError(err.message || "Không thể xóa template");
    }
  };

  return (
    <div className="space-y-8">
      <ManagementHeader subtitle="Quản lý template trò chơi" title="Templates" />

      <ManagementForm
        title="Template"
        onSubmit={submit}
        error={error}
        saving={saving}
        editId={editId}
        onCancel={cancelEdit}
        formRef={formRef}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tên template">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </Field>
          <Field label="Loại">
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              <option value="play-to-learn">Play-to-Learn</option>
              <option value="play-to-win">Play-to-Win</option>
            </select>
          </Field>
          <Field label="Thể loại">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Trạng thái">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
              <option value="inactive">Vô hiệu</option>
            </select>
          </Field>
          <Field label="Icon">
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </Field>
          <Field label="Màu viền">
            <div className="flex items-center gap-2 mt-1">
              <input type="color" value={form.ring} onChange={e => setForm({ ...form, ring: e.target.value })}
                className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer" />
              <input value={form.ring} onChange={e => setForm({ ...form, ring: e.target.value })}
                className="w-full note-card px-4 py-2.5 border-ink/10 focus:border-ticket" autoComplete="off" />
            </div>
          </Field>
          <Field label="Mô tả" className="sm:col-span-2">
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </Field>
          <Field label="Ảnh thumbnail" className="sm:col-span-2">
            <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" placeholder="/uploads/templates/example.png" />
          </Field>
          <div className="sm:col-span-2">
            <button type="button" onClick={() => setShowHtmlEditor(!showHtmlEditor)}
              className="text-sm text-ticket font-semibold hover:underline">
              {showHtmlEditor ? "Ẩn HTML Editor" : "✏️ Chỉnh sửa HTML Template"}
            </button>
            {showHtmlEditor && (
              <textarea value={form.htmlTemplate} onChange={e => setForm({ ...form, htmlTemplate: e.target.value })}
                placeholder="Dán HTML template vào đây..."
                className="w-full h-64 note-card px-4 py-3 text-sm font-mono resize-none placeholder:text-[#B7A987] mt-2" />
            )}
          </div>
        </div>
      </ManagementForm>

      <ManagementTable
        title="Danh sách template"
        count={templates ? templates.length : 0}
        data={templates}
        loading={!error && !templates}
        error={error && !templates ? error : null}
        onRetry={load}
        emptyLabel="Chưa có template nào."
        headers={["Icon", "Tên", "Loại", "Thể loại", "Trạng thái", "Màu", ""]}
        renderRow={(t) => (
          <tr key={t._id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 text-xl">{t.icon}</td>
            <td className="px-5 py-3 font-body text-ink">{t.name}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                t.type === "play-to-win" ? "bg-teal/15 text-teal border-teal/30" : "bg-ticket/15 text-ticket border-ticket/30"
              }`}>
                {t.type === "play-to-win" ? "Win" : "Learn"}
              </span>
            </td>
            <td className="px-5 py-3">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border"
                style={{ color: t.ring, borderColor: t.ring + "40", backgroundColor: t.ring + "15" }}>
                {t.category}
              </span>
            </td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                t.status === "published" ? "bg-teal/15 text-teal border-teal/30"
                : t.status === "inactive" ? "bg-ink/10 text-ink/50 border-ink/20"
                : "bg-gold/15 text-gold border-gold/30"
              }`}>
                {t.status}
              </span>
            </td>
            <td className="px-5 py-3">
              <span className="inline-block w-6 h-6 rounded-full border border-ink/10" style={{ backgroundColor: t.ring }}></span>
            </td>
            <td className="px-5 py-3 text-right flex gap-1 justify-end">
              <IconButton title="Sửa" onClick={() => startEdit(t)}>✏️</IconButton>
              <IconButton title="Xóa" onClick={() => removeTemplate(t)}>🗑️</IconButton>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
