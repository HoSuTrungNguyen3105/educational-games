import { setupService } from '../../services/setupService.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui.jsx'
import { useCrudList } from '../../hooks/useCrudList.js'

const FIELDS = [{ name: "name", label: "Tên môn học", placeholder: "VD: Toán, Văn, Anh..." }];

export default function SubjectManagement({ showToast }) {
  const {
    items: subjects, error, load,
    form, setField, editingId, saving, modalOpen,
    openCreate, openEdit, closeModal, submit,
    confirmProps, askRemove,
  } = useCrudList({
    fetchList: () => setupService.listSubjects(),
    onSave: (form, editingId) => editingId
      ? setupService.updateSubject(editingId, form.name.trim())
      : setupService.addSubject(form.name.trim()),
    onRemove: (item) => setupService.removeSubject(item.name),
    emptyForm: { name: "" },
    toForm: (item) => ({ name: item.name }),
    idOf: (item) => item.name,
    validate: (form) => form.name.trim() ? null : "Vui lòng nhập tên môn học",
    describe: (item) => `môn học "${item.name}"`,
    removeTitle: "Xóa môn học",
    messages: { created: "Đã thêm môn học", updated: "Đã cập nhật môn học", removed: "Đã xóa môn học" },
    showToast,
  });

  return (
    <div>
      <ManagementHeader subtitle="Quản lý môn học" title="Môn học" />

      <ManagementTable
        data={subjects}
        error={error && !subjects ? error : null}
        onRetry={load}
        emptyLabel="Chưa có môn học nào."
        onCreate={openCreate}
        headers={["STT", "Tên môn học", ""]}
        renderRow={(item, idx) => (
          <tr key={item._id || idx} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-[#8A7C63]">{idx + 1}</td>
            <td className="px-5 py-3 font-body text-ink">{item.name}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(item)}>
                  ✏️
                </IconButton>
                <IconButton title="Xóa" onClick={() => askRemove(item)}>
                  🗑️
                </IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Môn học" fields={FIELDS} values={form} onChange={setField}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} editId={editingId} />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
