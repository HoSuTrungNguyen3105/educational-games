import { useCallback, useEffect, useState } from 'react'
import { userService } from '../../services/api.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal } from '../../components/ui.jsx'

export default function UserManagement({ user, showToast }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "student" });
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const isAdmin = user && user.role === "admin";

  const FIELDS = [
    { name: "username", label: "Tên đăng nhập" },
    { name: "password", label: "Mật khẩu (≥ 6 ký tự)", type: "password" },
    { name: "name", label: "Họ tên" },
    { name: "role", label: "Vai trò", type: "select", options: [
      { value: "student", label: "Học sinh" },
      { value: "teacher", label: "Giáo viên" },
      ...(isAdmin ? [{ value: "admin", label: "Quản trị" }] : []),
    ]},
  ];

  const load = useCallback(() => {
    setUsers(null); setError(null);
    userService.list().then(setUsers).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ username: "", password: "", name: "", role: "student" }); setError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setError(null); };
  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const submit = async () => {
    if (!form.username.trim() || !form.password || !form.name.trim()) {
      setError("Vui lòng điền đầy đủ tên đăng nhập, mật khẩu và họ tên");
      return;
    }
    setSaving(true); setError(null);
    try {
      await userService.create(form);
      showToast("Đã tạo tài khoản mới");
      closeModal(); load();
    } catch (err) {
      setError(err.message || "Không thể tạo tài khoản");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (u) => setConfirm({ open: true, item: u });
  const doRemove = async () => {
    try {
      await userService.remove(confirm.item.id);
      showToast("Đã xóa tài khoản");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Không thể xóa", "error"); }
  };

  return (
    <div className="space-y-8">
      <ManagementHeader subtitle="Quản lý tài khoản" title="Người dùng" />

      <ManagementTable
        title="Danh sách tài khoản"
        data={users}
        error={error && !users ? error : null}
        onRetry={load}
        emptyLabel="Chưa có tài khoản nào."
        onCreate={openCreate}
        headers={["Họ tên", "Tên đăng nhập", "Vai trò", ""]}
        renderRow={(u) => (
          <tr key={u.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-body text-ink">{u.name}</td>
            <td className="px-5 py-3 font-mono text-[#8A7C63]">{u.username}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                u.role === "admin" ? "bg-pink/15 text-pink border-pink/30"
                : u.role === "teacher" ? "bg-ticket/15 text-ticket border-ticket/30"
                : "bg-teal/15 text-teal border-teal/30"
              }`}>
                {u.role === "admin" ? "Quản trị" : u.role === "teacher" ? "Giáo viên" : "Học sinh"}
              </span>
            </td>
            <td className="px-5 py-3 text-right">
              {(isAdmin || u.role !== "admin") && u.username !== (user && user.username) && (
                <IconButton title="Xóa tài khoản" onClick={() => confirmRemove(u)}>🗑️</IconButton>
              )}
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Tài khoản mới" fields={FIELDS} values={form} onChange={onChange}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} savingLabel="Đang tạo..." />

      <ConfirmModal open={confirm.open} title="Xóa tài khoản"
        message={confirm.item ? `Xóa "${confirm.item.name}" (${confirm.item.username})?` : ""}
        onConfirm={doRemove} onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}
