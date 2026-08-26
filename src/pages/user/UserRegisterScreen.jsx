import { useState } from "react";
import { PasswordInput, PrimaryButton } from "../../components/ui.jsx";

export default function UserRegisterScreen({ onBack, onRegistered, onGoLogin, showToast }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setError(null); };

  const submit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, name } = form;
    if (!username.trim() || !password || !name.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập, mật khẩu và họ tên");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${window.API_BASE_URL || "https://educational-games-lp4z.onrender.com/api"}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim() || undefined, password, name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
      const USER_AUTH_KEY = "edu_games_user_auth";
      localStorage.setItem(USER_AUTH_KEY, JSON.stringify({ token: data.token, user: data.user }));
      showToast(`Đăng ký thành công! Xin chào, ${data.user.name}!`);
      onRegistered(data.user, data.token);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-2 py-1">
      <div className="w-full max-w-md anim-pop">
        <div className="note-card p-5 formbg bg-paper2">
          <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1">
            ← Về trang chủ
          </button>
          <div className="text-center mt-2">
            <h1 className="font-display text-2xl text-ink">Đăng ký tài khoản</h1>
            <p className="text-sm text-[#8A7C63] mt-1">Tạo tài khoản để sử dụng tính năng chat</p>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Họ tên *</label>
              <input
                value={form.name}
                onChange={update("name")}
                className="w-full note-card px-4 py-3 mt-1 border-ink/10 focus:border-ticket"
                placeholder="Nguyễn Văn A"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Tên đăng nhập *</label>
              <input
                value={form.username}
                onChange={update("username")}
                className="w-full note-card px-4 py-3 mt-1 border-ink/10 focus:border-ticket"
                placeholder="nguyenvana"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Email (tùy chọn)</label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                className="w-full note-card px-4 py-3 mt-1 border-ink/10 focus:border-ticket"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Mật khẩu *</label>
              <PasswordInput
                value={form.password}
                onChange={update("password")}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Xác nhận mật khẩu *</label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-ticket text-sm">{error}</p>}
            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký →"}
            </PrimaryButton>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-[#8A7C63]">
              Đã có tài khoản?{" "}
              <button onClick={onGoLogin} className="text-teal font-semibold hover:underline">
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
