import { useEffect, useState } from "react";
import { authService } from "../../services/api.js";
import { PrimaryButton, GhostButton, Loader } from "../../components/ui.jsx";

export default function ProfileScreen({ userAuth, onLogout, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userAuth?.user) return;
    setLoading(true);
    authService.me()
      .then((data) => { setProfile(data); setError(null); })
      .catch((e) => setError(e.message || "Lỗi tải profile"))
      .finally(() => setLoading(false));
  }, [userAuth]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem profile</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <Loader label="Đang tải profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="text-5xl mb-4">😵</div>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const user = profile || {};

  return (
    <div className="flex-1 px-6 py-10">
      <div className="max-w-md mx-auto anim-pop">
        <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
          ← Về trang chủ
        </button>

        <div className="note-card p-6 bg-paper2 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl text-white mx-auto mb-4 shadow-lg">
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <h1 className="font-display text-2xl text-ink mb-1">{user.name}</h1>
          <p className="text-sm text-[#8A7C63] font-mono mb-6">@{user.username}</p>

          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between py-2 border-b border-ink/10">
              <span className="text-sm text-[#8A7C63]">Họ tên</span>
              <span className="text-sm text-ink font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-ink/10">
              <span className="text-sm text-[#8A7C63]">Tên đăng nhập</span>
              <span className="text-sm text-ink font-mono">{user.username}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-ink/10">
              <span className="text-sm text-[#8A7C63]">💰 Coin</span>
              <span className="text-sm text-amber-600 font-bold">{(user.coins || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[#8A7C63]">Vai trò</span>
              <span className="text-sm text-ink font-semibold capitalize">{user.role === "student" ? "Học sinh" : user.role}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <GhostButton onClick={onBack} className="flex-1">← Quay lại</GhostButton>
            <button
              onClick={onLogout}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 transition"
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
