import { useCallback, useEffect, useState } from 'react'
import { userService } from '../../services/api.js'
import { IconButton, PasswordInput, ManagementHeader, ManagementForm, ManagementTable, Field } from '../../components/ui.jsx'

export default function UserManagement({ user, showToast }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "student" });
  const [saving, setSaving] = useState(false);
  const isAdmin = user && user.role === "admin";

  const load = useCallback(() => {
    setUsers(null); setError(null);
    userService.list().then(setUsers).catch(e => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password || !form.name.trim()) {
      setError("Vui lòng điền đầy đủ tên đăng nhập, mật khẩu và họ tên");
      return;
    }
    setSaving(true); setError(null);
    try {
      await userService.create(form);
      showToast("Đã tạo tài khoản mới ✅");
      setForm({ username: "", password: "", name: "", role: "student" });
      load();
    } catch (err) {
      setError(err.message || "Không thể tạo tài khoản");
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (u) => {
    if (!confirm(`Xóa tài khoản "${u.name}" (${u.username})?`)) return;
    try {
      await userService.remove(u.id);
      showToast("Đã xóa tài khoản 🗑️");
      load();
    } catch (err) {
      setError(err.message || "Không thể xóa tài khoản");
    }
  };

  return (
    <div className="space-y-8">
      <ManagementHeader subtitle="Quản lý tài khoản" title="Người dùng" />

      <ManagementForm
        title="Tài khoản mới"
        onSubmit={submit}
        error={error}
        saving={saving}
        savingLabel="Đang tạo..."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tên đăng nhập">
            <input value={form.username} onChange={e => { setForm({ ...form, username: e.target.value }); setError(null); }}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </Field>
          <Field label="Mật khẩu (≥ 6 ký tự)">
            <PasswordInput value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setError(null); }} autoComplete="new-password" />
          </Field>
          <Field label="Họ tên">
            <input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setError(null); }}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket" autoComplete="off" />
          </Field>
          <Field label="Vai trò">
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full note-card px-4 py-2.5 mt-1 border-ink/10 focus:border-ticket bg-paper2">
              <option value="student">Học sinh</option>
              <option value="teacher">Giáo viên</option>
              {isAdmin && <option value="admin">Quản trị</option>}
            </select>
          </Field>
        </div>
      </ManagementForm>

      <ManagementTable
        title="Danh sách tài khoản"
        data={users}
        loading={!error && !users}
        error={error && !users ? error : null}
        onRetry={load}
        emptyLabel="Chưa có tài khoản nào."
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
                <IconButton title="Xóa tài khoản" onClick={() => removeUser(u)}>🗑️</IconButton>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
}
