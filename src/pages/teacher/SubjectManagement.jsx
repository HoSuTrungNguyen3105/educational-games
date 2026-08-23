import { useCallback, useEffect, useState } from 'react'
import { setupService } from '../../services/setupService.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui.jsx'

const FIELDS = [{ name: "name", label: "Tên môn học", placeholder: "VD: Toán, Văn, Anh..." }];

export default function SubjectManagement({ showToast }) {
  const [subjects, setSubjects] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [editingIdx, setEditingIdx] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const load = useCallback(() => {
    setSubjects(null); setError(null);
    setupService.listSubjects().then(setSubjects).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ name: "" }); setEditingIdx(-1); setError(null); setModalOpen(true); };
  const openEdit = (idx) => { setForm({ name: subjects[idx] }); setEditingIdx(idx); setError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setError(null); };

  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const submit = async () => {
    if (!form.name.trim()) { setError("Vui lòng nhập tên môn học"); return; }
    setSaving(true); setError(null);
    try {
      if (editingIdx >= 0) {
        await setupService.updateSubject(subjects[editingIdx], form.name.trim());
        showToast("Đã cập nhật môn học");
      } else {
        await setupService.addSubject(form.name.trim());
        showToast("Đã thêm môn học");
      }
      closeModal(); load();
    } catch (err) {
      setError(err.message || "Lỗi lưu môn học");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (name) => setConfirm({ open: true, item: { name } });
  const doRemove = async () => {
    try {
      await setupService.removeSubject(confirm.item.name);
      showToast("Đã xóa môn học");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  return (
    <div>
      <ManagementHeader subtitle="Quản lý môn học" title="Môn học" />

      <ManagementTable
        title="Danh sách môn học"
        data={subjects}
        error={error && !subjects ? error : null}
        onRetry={load}
        emptyLabel="Chưa có môn học nào."
        onCreate={openCreate}
        headers={["STT", "Tên môn học", ""]}
        renderRow={(name, idx) => (
          <tr key={name} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-[#8A7C63]">{idx + 1}</td>
            <td className="px-5 py-3 font-body text-ink">{name}</td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-2">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(idx)}>
                  ✏️
                </IconButton>

                <IconButton title="Xóa" onClick={() => confirmRemove(name)}>
                  🗑️
                </IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Môn học" fields={FIELDS} values={form} onChange={onChange}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} editId={editingIdx >= 0 ? "edit" : null} />

      <ConfirmModal open={confirm.open} title="Xóa môn học"
        message={confirm.item ? `Xóa môn học "${confirm.item.name}"?` : ""}
        onConfirm={doRemove} onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}
