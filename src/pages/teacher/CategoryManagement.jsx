import { Pencil, Trash2 } from 'lucide-react'
import { setupService } from '../../services/setupService.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui'
import { useCrudList } from '../../hooks/useCrudList.js'

const FIELDS = [
  { name: "id", label: "ID (không dấu, không khoảng trắng)", placeholder: "VD: quiz, puzzle, adventure" },
  { name: "label", label: "Tên hiển thị", placeholder: "VD: Trắc nghiệm, Pseudo code" },
];

const EMPTY = { id: "", label: "" };

export default function CategoryManagement({ showToast }) {
  const {
    items: categories, error, load,
    form, setField, editingId, saving, modalOpen,
    openCreate, openEdit, closeModal, submit,
    confirmProps, askRemove, askRemoveAll,
  } = useCrudList({
    fetchList: () => setupService.listCategories(),
    onSave: (form, editingId) => editingId
      ? setupService.updateCategory(editingId, { label: form.label })
      : setupService.createCategory({ id: form.id.trim(), label: form.label }),
    onRemove: (cat) => setupService.removeCategory(cat.id),
    onRemoveAll: () => setupService.removeAllCategories(),
    emptyForm: EMPTY,
    toForm: (cat) => ({ id: cat.id, label: cat.label }),
    validate: (form) => (!form.id.trim() || !form.label.trim()) ? "Vui lòng nhập đầy đủ ID và tên" : null,
    describe: (cat) => `${cat.label} (${cat.id})`,
    removeTitle: "Xóa category",
    messages: { created: "Đã tạo category mới", updated: "Đã cập nhật category", removed: "Đã xóa category" },
    showToast,
  });

  return (
    <div>
      <ManagementHeader subtitle="Quản lý danh mục" title="Categories" />

      <ManagementTable
        viewKey="categories"
        data={categories}
        error={error && !categories ? error : null}
        onRetry={load}
        emptyLabel="Chưa có category nào."
        onCreate={openCreate}
        onRemoveAll={categories && categories.length > 0 ? () => askRemoveAll("TẤT CẢ category") : null}
        headers={["ID", "Tên hiển thị", ""]}
        renderCard={(cat) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/20 text-ink flex items-center justify-center font-display text-sm shrink-0">
              {cat.label?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm text-ink truncate">{cat.label}</p>
              <p className="font-mono text-[11px] text-[#8A7C63] truncate">{cat.id}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <IconButton title="Chỉnh sửa" onClick={() => openEdit(cat)}><Pencil /></IconButton>
              <IconButton title="Xóa" tone="danger" onClick={() => askRemove(cat)}><Trash2 /></IconButton>
            </div>
          </div>
        )}
        renderRow={(cat) => (
          <tr key={cat.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-ink">{cat.id}</td>
            <td className="px-5 py-3 font-body text-ink">{cat.label}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(cat)}><Pencil /></IconButton>
                <IconButton title="Xóa" tone="danger" onClick={() => askRemove(cat)}><Trash2 /></IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Category" fields={FIELDS} values={form} onChange={setField}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} editId={editingId} />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
