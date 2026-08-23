import { useCallback, useEffect, useState } from 'react'
import { setupService } from '../../services/setupService.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui.jsx'

const FIELDS = [
  { name: "id", label: "ID (không dấu, không khoảng trắng)", placeholder: "VD: quiz, puzzle, adventure" },
  { name: "label", label: "Tên hiển thị", placeholder: "VD: Trắc nghiệm, Pseudo code" },
];

const EMPTY = { id: "", label: "" };

export default function CategoryManagement({ showToast }) {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const load = useCallback(() => {
    setCategories(null); setError(null);
    setupService.listCategories().then(setCategories).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...EMPTY }); setEditingId(null); setError(null); setModalOpen(true); };
  const openEdit = (cat) => { setForm({ id: cat.id, label: cat.label }); setEditingId(cat.id); setError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setError(null); };

  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const submit = async () => {
    if (!form.id.trim() || !form.label.trim()) { setError("Vui lòng nhập đầy đủ ID và tên"); return; }
    setSaving(true); setError(null);
    try {
      if (editingId) {
        await setupService.updateCategory(editingId, { label: form.label });
        showToast("Đã cập nhật category");
      } else {
        await setupService.createCategory({ id: form.id.trim(), label: form.label });
        showToast("Đã tạo category mới");
      }
      closeModal(); load();
    } catch (err) {
      setError(err.message || "Lỗi lưu category");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (cat) => setConfirm({ open: true, item: cat });
  const doRemove = async () => {
    try {
      await setupService.removeCategory(confirm.item.id);
      showToast("Đã xóa category");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  const confirmRemoveAll = () => setConfirm({ open: true, item: { _all: true, label: "TẤT CẢ category" } });
  const doRemoveAll = async () => {
    try {
      const result = await setupService.removeAllCategories();
      showToast(`Đã xóa ${result.deleted} category`);
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  return (
    <div>
      <ManagementHeader subtitle="Quản lý danh mục" title="Categories" />

      <ManagementTable
        title="Danh sách category"
        data={categories}
        error={error && !categories ? error : null}
        onRetry={load}
        emptyLabel="Chưa có category nào."
        onCreate={openCreate}
        onRemoveAll={categories && categories.length > 0 ? confirmRemoveAll : null}
        headers={["ID", "Tên hiển thị", ""]}
        renderRow={(cat) => (
          <tr key={cat.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-ink">{cat.id}</td>
            <td className="px-5 py-3 font-body text-ink">{cat.label}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(cat)}>✏️</IconButton>
                <IconButton title="Xóa" onClick={() => confirmRemove(cat)}>🗑️</IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Category" fields={FIELDS} values={form} onChange={onChange}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} editId={editingId} />

      <ConfirmModal open={confirm.open}
        title={confirm.item?._all ? "Xóa tất cả" : "Xóa category"}
        message={confirm.item ? `Xóa "${confirm.item.label}"${confirm.item._all ? "?" : ` (${confirm.item.id})?`}` : ""}
        onConfirm={confirm.item?._all ? doRemoveAll : doRemove}
        onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}
