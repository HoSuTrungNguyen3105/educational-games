import { useState } from "react";
import { PasswordInput, PrimaryButton } from "../../components/ui.jsx";

export default function UserLoginScreen({ onBack, onLogin, onGoRegister, showToast }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Vui lòng nhập tên đăng nhập/email và mật khẩu");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onLogin(identifier.trim(), password);
      showToast(`Đăng nhập thành công!`);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md anim-pop">
        <div className="note-card p-8 formbg bg-paper2">
          <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1">
            ← Về trang chủ
          </button>
          <div className="text-center mt-4">
            <h1 className="font-display text-2xl text-ink">Đăng nhập</h1>
            <p className="text-sm text-[#8A7C63] mt-1">Đăng nhập để nâng cao trải nghiệm</p>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Tên đăng nhập hoặc Email</label>
              <input
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
                className="w-full note-card px-4 py-3 mt-1 border-ink/10 focus:border-ticket"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Mật khẩu</label>
              <PasswordInput
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-ticket text-sm">{error}</p>}
            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
            </PrimaryButton>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-[#8A7C63]">
              Chưa có tài khoản?{" "}
              <button onClick={onGoRegister} className="text-teal font-semibold hover:underline">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
