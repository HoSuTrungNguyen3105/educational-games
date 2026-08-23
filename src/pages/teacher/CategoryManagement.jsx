import { useCallback, useEffect, useState } from 'react'
import { setupService } from '../../services/setupService.js'
import { IconButton, ManagementHeader, ManagementForm, ManagementTable, Field } from '../../components/ui.jsx'

export default function CategoryManagement({ showToast }) {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ id: "", label: "" });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setCategories(null); setError(null);
    setupService.listCategories().then(setCategories).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.label.trim()) {
      setError("Vui lòng nhập đầy đủ ID và tên category");
      return;
    }
    setSaving(true); setError(null);
    try {
      if (editingId) {
        await setupService.updateCategory(editingId, { label: form.label });
        showToast("Đã cập nhật category");
      } else {
        await setupService.createCategory({ id: form.id.trim(), label: form.label });
        showToast("Đã tạo category mới");
      }
      setForm({ id: "", label: "" });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message || "Lỗi lưu category");
    } finally {
      setSaving(false);
    }
  };

  const edit = (cat) => {
    setForm({ id: cat.id, label: cat.label });
    setEditingId(cat.id);
  };

  const cancelEdit = () => {
    setForm({ id: "", label: "" });
    setEditingId(null);
  };

  const remove = async (cat) => {
    if (!confirm(`Xóa category "${cat.label}" (${cat.id})?`)) return;
    try {
      await setupService.removeCategory(cat.id);
      showToast("Đã xóa category");
      load();
    } catch (err) {
      setError(err.message || "Lỗi xóa category");
    }
  };

  const removeAll = async () => {
    if (!confirm("Xóa TẤT CẢ category?")) return;
    try {
      const result = await setupService.removeAllCategories();
      showToast(`Đã xóa ${result.deleted} category`);
      load();
    } catch (err) {
      setError(err.message || "Lỗi xóa category");
    }
  };

  return (
    <div className="space-y-8">
      <ManagementHeader subtitle="Quản lý danh mục" title="Categories" />

      <ManagementForm
        title="Category"
        onSubmit={submit}
        error={error}
        saving={saving}
        editId={editingId}
        onCancel={cancelEdit}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="ID (không dấu, không khoảng trắng)">
            <input value={form.id} onChange={e => { setForm({ ...form, id: e.target.value }); setError(null); }}
              disabled={!!editingId}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket disabled:opacity-50" placeholder="VD: quiz, puzzle, adventure" autoComplete="off" />
          </Field>
          <Field label="Tên hiển thị">
            <input value={form.label} onChange={e => { setForm({ ...form, label: e.target.value }); setError(null); }}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" placeholder="VD: Trắc nghiệm, Pseudo code" autoComplete="off" />
          </Field>
        </div>
      </ManagementForm>

      <ManagementTable
        title="Danh sách category"
        data={categories}
        loading={!error && !categories}
        error={error && !categories ? error : null}
        onRetry={load}
        emptyLabel="Chưa có category nào."
        onRemoveAll={categories && categories.length > 0 ? removeAll : null}
        headers={["ID", "Tên hiển thị", ""]}
        renderRow={(cat) => (
          <tr key={cat.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-ink">{cat.id}</td>
            <td className="px-5 py-3 font-body text-ink">{cat.label}</td>
            <td className="px-5 py-3 text-right space-x-2">
              <IconButton title="Chỉnh sửa" onClick={() => edit(cat)}>✏️</IconButton>
              <IconButton title="Xóa" onClick={() => remove(cat)}>🗑️</IconButton>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
