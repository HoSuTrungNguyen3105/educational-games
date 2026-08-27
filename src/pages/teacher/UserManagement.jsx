import { useCallback, useEffect, useState } from 'react'
import { userService } from '../../services/api.js'
import { hasPermission, getRoleLabel } from '../../config/roles.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal, Modal } from '../../components/ui.jsx'

export default function UserManagement({ user, showToast }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "student" });
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [resetError, setResetError] = useState("");
  const isAdmin = hasPermission(user?.role, "users.manage");

  const FIELDS = [
    { name: "username", label: "Tên đăng nhập" },
    { name: "password", label: "Mật khẩu (≥ 6 ký tự)", type: "password" },
    { name: "name", label: "Họ tên" },
    {
      name: "role", label: "Vai trò", type: "select", options: [
        { value: "student", label: "Học sinh" },
        { value: "teacher", label: "Giáo viên" },
        ...(isAdmin ? [{ value: "admin", label: "Quản trị" }] : []),
      ]
    },
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

  const openReset = (u) => { setResetTarget(u); setResetPwd(""); setResetError(""); };
  const closeReset = () => { setResetTarget(null); setResetPwd(""); setResetError(""); };
  const doReset = async () => {
    if (!resetPwd.trim()) { setResetError("Vui lòng nhập mật khẩu mới"); return; }
    if (resetPwd.length < 6) { setResetError("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    setResetSaving(true); setResetError("");
    try {
      await userService.resetPassword(resetTarget.id, resetPwd);
      showToast("Đã đổi mật khẩu thành công");
      closeReset();
    } catch (err) {
      setResetError(err.message || "Không thể đổi mật khẩu");
    } finally {
      setResetSaving(false);
    }
  };

  return (
    <div>
      <ManagementHeader subtitle="Quản lý tài khoản" title="Người dùng" />

      <ManagementTable
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
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${u.role === "admin" ? "bg-pink/15 text-pink border-pink/30"
                : u.role === "teacher" ? "bg-ticket/15 text-ticket border-ticket/30"
                  : "bg-teal/15 text-teal border-teal/30"
                }`}>
                {getRoleLabel(u.role)}
              </span>
            </td>
            <td className="px-5 py-3 text-right">
              {(isAdmin || u.role !== "admin") && u.username !== (user && user.username) && (
                <div className="flex items-center justify-end gap-1">
                  <IconButton title="Đổi mật khẩu" onClick={() => openReset(u)}>🔑</IconButton>
                  <IconButton title="Xóa tài khoản" onClick={() => confirmRemove(u)}>🗑️</IconButton>
                </div>
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

      {resetTarget && (
        <Modal onClose={closeReset}>
          <div className="note-card p-6 w-full max-w-sm mx-auto anim-pop bg-paper2">
            <h3 className="font-display text-lg text-ink mb-1">Đổi mật khẩu</h3>
            <p className="text-sm text-[#8A7C63] mb-4">
              Đặt lại mật khẩu cho <span className="font-semibold text-ink">{resetTarget.name}</span> ({resetTarget.username})
            </p>
            <label className="block text-sm font-semibold text-ink mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={resetPwd}
              onChange={(e) => { setResetPwd(e.target.value); setResetError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") doReset(); }}
              placeholder="Nhập mật khẩu mới (≥ 6 ký tự)"
              className="w-full note-card px-4 py-2.5 border-ink/10 focus:border-ticket rounded-2xl text-sm font-mono outline-none"
              autoFocus
            />
            {resetError && <p className="text-xs text-red-500 mt-2">{resetError}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={closeReset}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-ink/10 text-sm text-[#8A7C63] hover:bg-ink/5 transition">
                Hủy
              </button>
              <button onClick={doReset} disabled={resetSaving}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold shadow hover:shadow-md transition disabled:opacity-50">
                {resetSaving ? "Đang lưu..." : "Đổi mật khẩu"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
