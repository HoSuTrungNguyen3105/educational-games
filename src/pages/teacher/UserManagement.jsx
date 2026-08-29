import { useCallback, useEffect, useState } from 'react'
import { userService } from '../../services/api.js'
import { hasPermission, getRoleLabel, ROLES } from '../../config/roles.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, FormModal, Modal } from '../../components/ui.jsx'

const RANDOM_FIRST_NAMES = ["An", "Bình", "Cúc", "Dũng", "Em", "Giang", "Hà", "Hiếu", "Iris", "Khanh", "Lan", "Minh", "Nga", "Oanh", "Phúc", "Quân", "Rạng", "Sơn", "Tâm", "Uyên", "Vân", "Xuân", "Yên", "Zoe"];
const RANDOM_LAST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const RANDOM_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "student.edu.vn"];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomName() { return randomItem(RANDOM_LAST_NAMES) + " " + randomItem(RANDOM_FIRST_NAMES) + " " + randomItem(RANDOM_FIRST_NAMES); }
function randomEmail(name) {
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const num = Math.floor(1000 + Math.random() * 9000);
  return slug + num + "@" + randomItem(RANDOM_DOMAINS);
}

export default function UserManagement({ user, showToast }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", name: "", email: "", role: "student" });
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [resetError, setResetError] = useState("");
  const [roleTarget, setRoleTarget] = useState(null);
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const isAdmin = hasPermission(user?.role, "users.manage");

  const ROLE_OPTIONS = Object.entries(ROLES).map(([value, r]) => ({ value, label: r.label }));

  const FIELDS = [
    { name: "username", label: "Tên đăng nhập" },
    { name: "password", label: "Mật khẩu (≥ 6 ký tự)", type: "password" },
    { name: "name", label: "Họ tên" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "role", label: "Vai trò", type: "select", options: [
        ...ROLE_OPTIONS,
      ]
    },
  ];

  const load = useCallback(() => {
    setUsers(null); setError(null);
    userService.list().then(setUsers).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ username: "", password: "", name: "", email: "", role: "student" }); setError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setError(null); };
  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const handleRandomFill = () => {
    const name = randomName();
    const email = randomEmail(name);
    const username = email.split("@")[0];
    setForm(f => ({ ...f, name, email, username }));
  };

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

  const openRoleChange = (u) => { setRoleTarget({ ...u, newRole: u.role }); setRoleError(""); };
  const closeRoleChange = () => { setRoleTarget(null); setRoleError(""); };
  const doRoleChange = async () => {
    if (!roleTarget || roleTarget.newRole === roleTarget.role) { closeRoleChange(); return; }
    setRoleSaving(true); setRoleError("");
    try {
      await userService.updateRole(roleTarget.id, roleTarget.newRole);
      showToast(`Đã đổi vai trò thành ${getRoleLabel(roleTarget.newRole)}`);
      closeRoleChange(); load();
    } catch (err) {
      setRoleError(err.message || "Không thể đổi vai trò");
    } finally {
      setRoleSaving(false);
    }
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setEditForm({ name: u.name || "", email: u.email || "" });
    setEditError("");
  };
  const closeEdit = () => { setEditTarget(null); setEditError(""); };
  const doEdit = async () => {
    if (!editForm.name.trim()) { setEditError("Họ tên không được để trống"); return; }
    setEditSaving(true); setEditError("");
    try {
      await userService.update(editTarget.id, { name: editForm.name, email: editForm.email });
      showToast("Đã cập nhật thông tin");
      closeEdit(); load();
    } catch (err) {
      setEditError(err.message || "Không thể cập nhật");
    } finally {
      setEditSaving(false);
    }
  };

  const handleRandomEdit = () => {
    const name = randomName();
    const email = randomEmail(name);
    setEditForm({ name, email });
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
        headers={["Họ tên", "Tên đăng nhập", "Email", "Vai trò", "Ngày tạo", ""]}
        renderRow={(u) => (
          <tr key={u.id} className="border-b border-ink/5 last:border-0">
            <td className="px-5 py-3 font-body text-ink">{u.name}</td>
            <td className="px-5 py-3 font-mono text-[#8A7C63]">{u.username}</td>
            <td className="px-5 py-3 font-mono text-[#8A7C63] text-sm">{u.email || "—"}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border ${u.role === "admin" ? "bg-pink/15 text-pink border-pink/30"
                : u.role === "teacher" ? "bg-ticket/15 text-ticket border-ticket/30"
                  : "bg-teal/15 text-teal border-teal/30"
                }`}>
                {getRoleLabel(u.role)}
              </span>
            </td>
            <td className="px-5 py-3 font-mono text-[#8A7C63] text-xs">
              {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
            </td>
            <td className="px-5 py-3 text-right">
              {u.username !== (user && user.username) && (
                <div className="flex items-center justify-end gap-1">
                  {isAdmin && u.id !== "user-001" && (
                    <IconButton title="Chỉnh sửa" onClick={() => openEdit(u)}>✏️</IconButton>
                  )}
                  {isAdmin && u.id !== "user-001" && (
                    <IconButton title="Đổi vai trò" onClick={() => openRoleChange(u)}>🔄</IconButton>
                  )}
                  <IconButton title="Đổi mật khẩu" onClick={() => openReset(u)}>🔑</IconButton>
                  {(isAdmin || u.role !== "admin") && (
                    <IconButton title="Xóa tài khoản" onClick={() => confirmRemove(u)}>🗑️</IconButton>
                  )}
                </div>
              )}
            </td>
          </tr>
        )}
      />

      <FormModal open={modalOpen} title="Tài khoản mới" fields={FIELDS} values={form} onChange={onChange}
        onSubmit={submit} onClose={closeModal} error={error} saving={saving} savingLabel="Đang tạo..."
        extraButtons={
          <button type="button" onClick={handleRandomFill}
            className="px-3 py-1.5 rounded-xl border border-ink/10 text-xs font-mono text-[#8A7C63] hover:bg-ink/5 transition mr-2">
            🎲 Random
          </button>
        } />

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

      {roleTarget && (
        <Modal onClose={closeRoleChange}>
          <div className="note-card max-w-sm mx-auto anim-pop bg-paper2" style={{ border: "none" }}>
            <h3 className="font-display text-lg text-ink mb-1">Đổi vai trò</h3>
            <p className="text-sm text-[#8A7C63] mb-4">
              Thay đổi vai trò cho <span className="font-semibold text-ink">{roleTarget.name}</span> ({roleTarget.username})
            </p>
            <label className="block text-sm font-semibold text-ink mb-1">Vai trò mới</label>
            <select
              value={roleTarget.newRole}
              onChange={(e) => { setRoleTarget(r => ({ ...r, newRole: e.target.value })); setRoleError(""); }}
              className="w-full note-card px-4 py-2.5 border-ink/10 focus:border-ticket rounded-2xl text-sm font-mono outline-none"
            >
              {ROLE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {roleError && <p className="text-xs text-red-500 mt-2">{roleError}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={closeRoleChange}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-ink/10 text-sm text-[#8A7C63] hover:bg-ink/5 transition">
                Hủy
              </button>
              <button onClick={doRoleChange} disabled={roleSaving || roleTarget.newRole === roleTarget.role}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold shadow hover:shadow-md transition disabled:opacity-50">
                {roleSaving ? "Đang lưu..." : "Lưu vai trò"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editTarget && (
        <Modal onClose={closeEdit}>
          <div className="note-card p-6 w-full max-w-sm mx-auto anim-pop bg-paper2">
            <h3 className="font-display text-lg text-ink mb-1">Chỉnh sửa thông tin</h3>
            <p className="text-sm text-[#8A7C63] mb-4">
              Cập nhật cho <span className="font-semibold text-ink">{editTarget.username}</span>
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Họ tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => { setEditForm(f => ({ ...f, name: e.target.value })); setEditError(""); }}
                  className="w-full note-card px-4 py-2.5 border-ink/10 focus:border-ticket rounded-2xl text-sm font-mono outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => { setEditForm(f => ({ ...f, email: e.target.value })); setEditError(""); }}
                  className="w-full note-card px-4 py-2.5 border-ink/10 focus:border-ticket rounded-2xl text-sm font-mono outline-none"
                />
              </div>
            </div>
            {editError && <p className="text-xs text-red-500 mt-2">{editError}</p>}
            <div className="flex gap-3 mt-5">
              <button type="button" onClick={handleRandomEdit}
                className="px-4 py-2.5 rounded-2xl border border-ink/10 text-sm text-[#8A7C63] hover:bg-ink/5 transition">
                🎲 Random
              </button>
              <div className="flex-1" />
              <button onClick={closeEdit}
                className="px-4 py-2.5 rounded-2xl border border-ink/10 text-sm text-[#8A7C63] hover:bg-ink/5 transition">
                Hủy
              </button>
              <button onClick={doEdit} disabled={editSaving}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold shadow hover:shadow-md transition disabled:opacity-50">
                {editSaving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
