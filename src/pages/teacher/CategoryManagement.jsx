import { useMemo, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { setupService } from '../../services/setupService.js'
import { GridCard, IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui'
import { useCrudList } from '../../hooks/useCrudList.js'
import { matchesQuery } from '../../lib/searchText.js'

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

  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => (categories ?? []).filter((cat) => matchesQuery(query, cat.label, cat.id)),
    [categories, query]
  );

  return (
    <div>
      <ManagementHeader subtitle="Quản lý danh mục" title="Categories" />

      <ManagementTable
        viewKey="categories"
        data={categories ? filtered : categories}
        error={error && !categories ? error : null}
        onRetry={load}
        emptyLabel={query ? "Không tìm thấy category nào khớp tìm kiếm." : "Chưa có category nào."}
        onCreate={openCreate}
        search={{ value: query, onChange: setQuery, placeholder: "Tìm kiếm" }}
        onRemoveAll={categories && categories.length > 0 ? () => askRemoveAll("TẤT CẢ category") : null}
        headers={["ID", "Tên hiển thị", ""]}
        renderGridCard={(cat, idx) => (
          <GridCard
            key={cat.id}
            title={cat.label}
            badge={{ label: "Hoạt động", tone: "mint" }}
            mono={cat.id}
            meta={`Thứ tự: ${idx}`}
            onEdit={() => openEdit(cat)}
            onRemove={() => askRemove(cat)}
          />
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
