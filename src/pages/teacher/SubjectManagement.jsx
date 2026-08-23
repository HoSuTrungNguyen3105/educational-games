import { useCallback, useEffect, useState } from 'react'
import { setupService } from '../../services/setupService.js'
import { PrimaryButton, IconButton, ManagementHeader, ManagementForm, ManagementTable } from '../../components/ui.jsx'

export default function SubjectManagement({ showToast }) {
  const [subjects, setSubjects] = useState(null);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setSubjects(null); setError(null);
    setupService.listSubjects().then(setSubjects).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!newName.trim()) { setError("Vui lòng nhập tên môn học"); return; }
    setSaving(true); setError(null);
    try {
      await setupService.addSubject(newName.trim());
      showToast("Đã thêm môn học");
      setNewName("");
      load();
    } catch (err) {
      setError(err.message || "Lỗi thêm môn học");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditName(subjects[idx]);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    setSaving(true); setError(null);
    try {
      await setupService.updateSubject(subjects[editingIdx], editName.trim());
      showToast("Đã cập nhật môn học");
      setEditingIdx(-1);
      load();
    } catch (err) {
      setError(err.message || "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (name) => {
    if (!confirm(`Xóa môn học "${name}"?`)) return;
    try {
      await setupService.removeSubject(name);
      showToast("Đã xóa môn học");
      load();
    } catch (err) {
      setError(err.message || "Lỗi xóa môn học");
    }
  };

  return (
    <div className="space-y-8">
      <ManagementHeader subtitle="Quản lý môn học" title="Môn học" />

      <ManagementForm
        title="Môn học"
        onSubmit={add}
        error={error}
        saving={saving}
        savingLabel="Đang thêm..."
      >
        <div className="flex gap-3">
          <input value={newName} onChange={e => { setNewName(e.target.value); setError(null); }}
            className="flex-1 note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" placeholder="VD: Toán, Văn, Anh..." autoComplete="off" />
        </div>
      </ManagementForm>

      <ManagementTable
        title="Danh sách môn học"
        data={subjects}
        loading={!error && !subjects}
        error={error && !subjects ? error : null}
        onRetry={load}
        emptyLabel="Chưa có môn học nào."
        headers={["STT", "Tên môn học", ""]}
        renderRow={(name, idx) => (
          <tr key={name} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-mono text-[#8A7C63]">{idx + 1}</td>
            <td className="px-5 py-3 font-body text-ink">
              {editingIdx === idx ? (
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full note-card px-3 py-1.5 border-ink/10 focus:border-ticket text-sm" autoFocus
                  onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingIdx(-1); }} />
              ) : name}
            </td>
            <td className="px-5 py-3 text-right space-x-2">
              {editingIdx === idx ? (
                <>
                  <PrimaryButton onClick={saveEdit} disabled={saving} className="text-xs px-3 py-1">Lưu</PrimaryButton>
                  <button onClick={() => setEditingIdx(-1)} className="text-xs text-[#8A7C63] hover:text-ink ml-2">Hủy</button>
                </>
              ) : (
                <>
                  <IconButton title="Chỉnh sửa" onClick={() => startEdit(idx)}>✏️</IconButton>
                  <IconButton title="Xóa" onClick={() => remove(name)}>🗑️</IconButton>
                </>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
}
