import { useCallback, useEffect, useState } from 'react'
import { templateService } from '../../services/api.js'
import { injectApiBridge, detectApiMarkers } from '../../lib/apiBridge.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, Modal, PrimaryButton, GhostButton, Field } from '../../components/ui.jsx'

const CATEGORY_OPTIONS = [
  { value: "quiz", label: "Trắc nghiệm" }, { value: "reflex", label: "Phản xạ" },
  { value: "science", label: "Khoa học" }, { value: "language", label: "Ngôn ngữ" },
  { value: "math", label: "Toán học" }, { value: "geography", label: "Địa lý" },
  { value: "history", label: "Lịch sử" }, { value: "puzzle", label: "Puzzle" },
  { value: "strategy", label: "Chiến thuật" }, { value: "arcade", label: "Arcade" },
  { value: "group", label: "Theo nhóm" }, { value: "seasonal", label: "Lễ hội" },
  { value: "memory", label: "Trí nhớ" }, { value: "logic", label: "Tư duy" },
  { value: "adventure", label: "Phiêu lưu" },
];

const FIELDS = [
  { name: "name", label: "Tên template" },
  { name: "type", label: "Loại", type: "select", options: [
    { value: "play-to-learn", label: "Play-to-Learn" }, { value: "play-to-win", label: "Play-to-Win" },
  ]},
  { name: "category", label: "Thể loại", type: "select", options: CATEGORY_OPTIONS },
  { name: "status", label: "Trạng thái", type: "select", options: [
    { value: "draft", label: "Bản nháp" }, { value: "published", label: "Xuất bản" }, { value: "inactive", label: "Vô hiệu" },
  ]},
  { name: "icon", label: "Icon" },
  { name: "ring", label: "Màu viền", type: "color" },
  { name: "description", label: "Mô tả", type: "textarea", full: true },
  { name: "thumbnail", label: "Ảnh thumbnail", placeholder: "/uploads/templates/example.png", full: true },
];

const EMPTY = { name: "", description: "", type: "play-to-learn", category: "quiz", icon: "🎲", ring: "#1D2E4A", htmlTemplate: "", thumbnail: "", status: "draft" };

export default function TemplateManagement({ showToast }) {
  const [templates, setTemplates] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const load = useCallback(() => {
    setTemplates(null); setError(null);
    templateService.list().then(setTemplates).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...EMPTY }); setEditId(null); setError(null); setModalOpen(true); };
  const openEdit = (t) => {
    setForm({ name: t.name || "", description: t.description || "", type: t.type || "play-to-learn", category: t.category || "quiz", icon: t.icon || "🎲", ring: t.ring || "#1D2E4A", htmlTemplate: t.htmlTemplate || "", thumbnail: t.thumbnail || "", status: t.status || "draft" });
    setEditId(t._id); setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setError(null); };
  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const submit = async () => {
    if (!form.name.trim()) { setError("Tên template không được để trống"); return; }
    setSaving(true); setError(null);
    try {
      const markers = detectApiMarkers(form.htmlTemplate);
      const payload = { ...form, htmlTemplate: injectApiBridge(form.htmlTemplate) };
      if (editId) {
        await templateService.update(editId, payload);
        showToast(markers.length > 0 ? `Đã cập nhật (auto-inject: ${markers.join(", ")})` : "Đã cập nhật template");
      } else {
        await templateService.create(payload);
        showToast(markers.length > 0 ? `Đã tạo mới (auto-inject: ${markers.join(", ")})` : "Đã tạo template mới");
      }
      closeModal(); load();
    } catch (err) {
      setError(err.message || "Không thể lưu template");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (t) => setConfirm({ open: true, item: t });
  const doRemove = async () => {
    try {
      const result = await templateService.remove(confirm.item._id);
      showToast(result?.deactivated ? `Template đang được ${result.gamesCount} game dùng, đã chuyển inactive` : "Đã xóa template");
      if (editId === confirm.item._id) { setEditId(null); setForm({ ...EMPTY }); }
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Không thể xóa", "error"); }
  };

  return (
    <div className="space-y-8">
      <ManagementHeader subtitle="Quản lý template trò chơi" title="Templates" />

      <ManagementTable
        title="Danh sách template"
        count={templates ? templates.length : 0}
        data={templates}
        error={error && !templates ? error : null}
        onRetry={load}
        emptyLabel="Chưa có template nào."
        onCreate={openCreate}
        headers={["Icon", "Tên", "Loại", "Thể loại", "Trạng thái", "Màu", ""]}
        renderRow={(t) => (
          <tr key={t._id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 text-xl">{t.icon}</td>
            <td className="px-5 py-3 font-body text-ink">{t.name}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${t.type === "play-to-win" ? "bg-teal/15 text-teal border-teal/30" : "bg-ticket/15 text-ticket border-ticket/30"}`}>
                {t.type === "play-to-win" ? "Win" : "Learn"}
              </span>
            </td>
            <td className="px-5 py-3">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border"
                style={{ color: t.ring, borderColor: t.ring + "40", backgroundColor: t.ring + "15" }}>{t.category}</span>
            </td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                t.status === "published" ? "bg-teal/15 text-teal border-teal/30"
                : t.status === "inactive" ? "bg-ink/10 text-ink/50 border-ink/20" : "bg-gold/15 text-gold border-gold/30"
              }`}>{t.status}</span>
            </td>
            <td className="px-5 py-3"><span className="inline-block w-6 h-6 rounded-full border border-ink/10" style={{ backgroundColor: t.ring }}></span></td>
            <td className="px-5 py-3 text-right flex gap-1 justify-end">
              <IconButton title="Sửa" onClick={() => openEdit(t)}>✏️</IconButton>
              <IconButton title="Xóa" onClick={() => confirmRemove(t)}>🗑️</IconButton>
            </td>
          </tr>
        )}
      />

      {modalOpen && (
        <TemplateFormModal open={modalOpen} form={form} onChange={onChange} onClose={closeModal}
          onSubmit={submit} error={error} saving={saving} editId={editId} fields={FIELDS} />
      )}

      <ConfirmModal open={confirm.open} title="Xóa template"
        message={confirm.item ? `Xóa template "${confirm.item.name}"?` : ""}
        onConfirm={doRemove} onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}

function TemplateFormModal({ open, form, onChange, onClose, onSubmit, error, saving, editId, fields }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose} wide>
      <h3 className="font-display text-lg text-ink mb-2">{editId ? "✏️ Sửa Template" : "➕ Thêm Template"}</h3>
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-1.5">
          {fields.map(f => (
            <Field key={f.name} label={f.label} className={f.full ? "col-span-2" : ""}>
              {f.type === "select" ? (
                <select value={form[f.name] || ""} onChange={e => onChange(f.name, e.target.value)}
                  className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm">
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === "color" ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input type="color" value={form[f.name] || "#000000"} onChange={e => onChange(f.name, e.target.value)} className="w-7 h-7 rounded border border-ink/10 cursor-pointer flex-shrink-0" />
                  <input value={form[f.name] || ""} onChange={e => onChange(f.name, e.target.value)} className="w-full note-card px-2.5 py-1.5 border-ink/10 focus:border-ticket text-sm" autoComplete="off" />
                </div>
              ) : f.type === "textarea" ? (
                <textarea value={form[f.name] || ""} onChange={e => onChange(f.name, e.target.value)} placeholder={f.placeholder || ""}
                  className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket min-h-[70px] text-sm" />
              ) : (
                <input value={form[f.name] || ""} onChange={e => onChange(f.name, e.target.value)} placeholder={f.placeholder || ""}
                  className="w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm" autoComplete="off" />
              )}
            </Field>
          ))}
        </div>
        <div className="mt-2">
          <Field label="HTML Template">
            <textarea value={form.htmlTemplate || ""} onChange={e => onChange("htmlTemplate", e.target.value)}
              placeholder="Dán HTML template vào đây..."
              className="w-full h-64 note-card px-3 py-2 text-xs font-mono resize-y placeholder:text-[#B7A987] mt-0.5" />
          </Field>
        </div>
        {error && <p className="text-ticket text-sm mt-2">{error}</p>}
        <div className="mt-3 flex items-center gap-2 justify-end">
          <GhostButton onClick={onClose} type="button">Hủy</GhostButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Đang lưu..." : editId ? "Cập nhật" : "Thêm mới"}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
