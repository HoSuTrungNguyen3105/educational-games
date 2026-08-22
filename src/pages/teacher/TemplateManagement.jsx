import { useCallback, useEffect, useState } from 'react'
import { templateService } from '../../services/api.js'
import { PrimaryButton, IconButton, Loader, ErrorState } from '../../components/ui.jsx'

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

export default function TemplateManagement({ user, showToast }) {
  const [templates, setTemplates] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState(null);
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);

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
    setError(null);
    try {
      if (editId) {
        await templateService.update(editId, form);
        showToast("Đã cập nhật template");
      } else {
        await templateService.create(form);
        showToast("Đã tạo template mới");
      }
      setForm({ ...EMPTY_FORM });
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message || "Không thể lưu template");
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
      <div>
        <p className="text-[#8A7C63] text-sm font-mono">Quản lý template trò chơi</p>
        <h1 className="font-display text-3xl text-ink">Templates</h1>
      </div>

      <form onSubmit={submit} className="note-card p-6 bg-paper2">
        <h2 className="font-display text-lg text-ink mb-4">{editId ? "✏️ Sửa template" : "➕ Tạo template mới"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Tên template</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Loại</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              <option value="play-to-learn">Play-to-Learn</option>
              <option value="play-to-win">Play-to-Win</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Thể loại</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Trạng thái</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
              <option value="inactive">Vô hiệu</option>
            </select>
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
          <div className="sm:col-span-2">
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Mô tả</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-mono uppercase text-[#8A7C63]">Ảnh thumbnail</label>
            <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" placeholder="/uploads/templates/example.png" />
          </div>
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
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
                  <th className="px-5 py-3">Icon</th><th className="px-5 py-3">Tên</th>
                  <th className="px-5 py-3">Loại</th><th className="px-5 py-3">Thể loại</th>
                  <th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Màu</th><th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {templates.map(t => (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
