import { useCallback, useEffect, useState } from 'react'
import { templateService } from '../../services/api.js'
import { PrimaryButton, IconButton, Loader, ErrorState } from '../../components/ui.jsx'

export default function TemplateManagement({ user, showToast }) {
  const [templates, setTemplates] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ id: "", slug: "", name: "", description: "", category: "quiz", categoryLabel: "", icon: "🎲", ring: "#1D2E4A" });
  const [editId, setEditId] = useState(null);

  const load = useCallback(() => {
    setTemplates(null); setError(null);
    templateService.list().then(setTemplates).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) {
      setError("id và tên không được để trống");
      return;
    }
    setError(null);
    try {
      if (editId) {
        await templateService.update(editId, form);
        showToast("Đã cập nhật template ✅");
      } else {
        await templateService.create(form);
        showToast("Đã tạo template mới ✅");
      }
      setForm({ id: "", slug: "", name: "", description: "", category: "quiz", categoryLabel: "", icon: "🎲", ring: "#1D2E4A" });
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message || "Không thể lưu template");
    }
  };

  const startEdit = (t) => {
    setForm({ id: t.id, slug: t.slug || t.id, name: t.name, description: t.description || "", category: t.category || "quiz", categoryLabel: t.categoryLabel || "", icon: t.icon || "🎲", ring: t.ring || "#1D2E4A" });
    setEditId(t.id);
    setError(null);
  };

  const cancelEdit = () => {
    setForm({ id: "", slug: "", name: "", description: "", category: "quiz", categoryLabel: "", icon: "🎲", ring: "#1D2E4A" });
    setEditId(null);
    setError(null);
  };

  const removeTemplate = async (t) => {
    if (!confirm(`Xóa template "${t.name}" (${t.id})?`)) return;
    try {
      await templateService.remove(t.id);
      showToast("Đã xóa template 🗑️");
      if (editId === t.id) cancelEdit();
      load();
    } catch (err) {
      setError(err.message || "Không thể xóa template");
    }
  };

  const categoryOptions = [
    { value: "quiz", label: "Trắc nghiệm" },
    { value: "reflex", label: "Phản xạ" },
    { value: "science", label: "Khoa học" },
    { value: "language", label: "Ngôn ngữ" },
    { value: "math", label: "Toán học" },
    { value: "geography", label: "Địa lý" },
    { value: "history", label: "Lịch sử" },
    { value: "multiplayer", label: "Đa người chơi" },
    { value: "arcade", label: "Arcade" },
    { value: "role", label: "Vai trò" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#8A7C63] text-sm font-mono">Quản lý template trò chơi</p>
        <h1 className="font-display text-3xl text-ink">Templates</h1>
      </div>

      <form onSubmit={submit} className="note-card p-6 bg-paper2">
        <h2 className="font-display text-lg text-ink mb-4">{editId ? "✏️ Sửa template" : "➕ Tạo template mới"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">ID (không dấu, không khoảng trắng)</label>
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} disabled={!!editId}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket disabled:opacity-50" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Slug</label>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Tên template</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Mô tả</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Thể loại</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Label thể loại</label>
            <input value={form.categoryLabel} onChange={e => setForm({ ...form, categoryLabel: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Icon</label>
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Màu viền</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="color" value={form.ring} onChange={e => setForm({ ...form, ring: e.target.value })}
                className="w-10 h-10 rounded-lg border border-ink/10 cursor-pointer" />
              <input value={form.ring} onChange={e => setForm({ ...form, ring: e.target.value })}
                className="w-full note-card px-4 py-2.5 border-ink/10 focus:border-ticket" autoComplete="off" />
            </div>
          </div>
        </div>
        {error && <p className="text-ticket text-sm mt-3">{error}</p>}
        <div className="mt-4 flex items-center gap-3">
          <PrimaryButton type="submit">{editId ? "Cập nhật" : "Tạo template"}</PrimaryButton>
          {editId && <button type="button" onClick={cancelEdit} className="text-sm text-[#8A7C63] hover:text-ink underline cursor-pointer">Hủy</button>}
        </div>
      </form>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">Danh sách template ({templates ? templates.length : 0})</h2>
        {error && <ErrorState subtitle={error} onRetry={load} />}
        {!error && !templates && <Loader label="Đang tải templates..." />}
        {!error && templates && (
          <div className="note-card overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
                  <th className="px-5 py-3">Icon</th><th className="px-5 py-3">Tên</th>
                  <th className="px-5 py-3">ID</th><th className="px-5 py-3">Thể loại</th>
                  <th className="px-5 py-3">Màu</th><th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {templates.map(t => (
                  <tr key={t.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-5 py-3 text-xl">{t.icon}</td>
                    <td className="px-5 py-3 font-body text-ink">{t.name}</td>
                    <td className="px-5 py-3 font-mono text-[#8A7C63] text-sm">{t.id}</td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border"
                        style={{ color: t.ring, borderColor: t.ring + "40", backgroundColor: t.ring + "15" }}>
                        {t.categoryLabel || t.category}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
