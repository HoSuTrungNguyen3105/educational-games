import { useState } from 'react'
import { authService, saveAuth } from '../services/api.js'
import { PrimaryButton } from '../components/ui.jsx'

export default function LoginScreen({ onBack, onLogin, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) { setError("Vui lòng nhập tên đăng nhập và mật khẩu"); return; }
    setLoading(true); setError(null);
    try {
      const { token, user } = await authService.login(username.trim(), password);
      if (user.role !== "teacher" && user.role !== "admin") {
        setError("Tài khoản này không có quyền vào dashboard giáo viên");
        setLoading(false);
        return;
      }
      saveAuth({ token, user });
      showToast(`Xin chào, ${user.name}! 👋`);
      onLogin(user);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md anim-pop">
        <div className="note-card p-8 formbg bg-paper2">
          <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1">← Về trang chủ</button>
          <div className="text-center">
            <div className="text-6xl mb-3 float-slow">🧑‍🏫</div>
            <h1 className="font-display text-2xl text-ink">Đăng nhập giáo viên</h1>
            <p className="text-sm text-[#8A7C63] mt-1">Vào dashboard quản lý trò chơi của bạn</p>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Tên đăng nhập</label>
              <input value={username} onChange={e => { setUsername(e.target.value); setError(null); }}
                className="w-full note-card px-4 py-3 mt-1 border-ink/10 focus:border-ticket" autoComplete="username" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Mật khẩu</label>
              {/* <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(null); }}
                className="w-full note-card px-4 py-3 mt-1 border-ink/10 focus:border-ticket" autoComplete="current-password" /> */}
              <PasswordInput value={password} onChange={e => { setPassword(e.target.value); setError(null); }} autoComplete="password" />

            </div>
            {error && <p className="text-ticket text-sm">{error}</p>}
            <PrimaryButton type="submit" className="w-full" disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập →"}</PrimaryButton>
            <p className="text-xs text-[#B7A987] text-center font-mono">Tài khoản mẫu: teacher / 123456 — admin / admin123</p>
          </form>
        </div>
      </div>
    </div>
  );
}