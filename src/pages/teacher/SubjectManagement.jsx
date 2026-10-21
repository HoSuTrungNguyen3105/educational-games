import { setupService } from '../../services/setupService.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui'
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
        viewKey="subjects"
        data={subjects}
        error={error && !subjects ? error : null}
        onRetry={load}
        emptyLabel="Chưa có môn học nào."
        onCreate={openCreate}
        headers={["STT", "Tên môn học", ""]}
        renderCard={(item, idx) => (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#8A7C63] w-6 shrink-0 text-right">{idx + 1}</span>
            <div className="w-9 h-9 rounded-full bg-teal/15 text-ink flex items-center justify-center font-display text-sm shrink-0">
              {item.name?.[0]?.toUpperCase() || "?"}
            </div>
            <p className="min-w-0 flex-1 font-body text-sm text-ink truncate">{item.name}</p>
            <div className="flex items-center gap-1 shrink-0">
              <IconButton title="Chỉnh sửa" onClick={() => openEdit(item)}>✏️</IconButton>
              <IconButton title="Xóa" onClick={() => askRemove(item)}>🗑️</IconButton>
            </div>
          </div>
        )}
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
