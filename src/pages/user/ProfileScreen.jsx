import { useEffect, useState, useMemo } from "react";
import { authService } from "../../services/api.js";
import { getLevelProgress } from "../../lib/utils.js";
import HeroHeader from "./profile/HeroHeader.jsx";
import LevelBar from "./profile/LevelBar.jsx";
import StatsGrid from "./profile/StatsGrid.jsx";
import GameList from "./profile/GameList.jsx";

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

  const lv = useMemo(() => getLevelProgress(profile?.coins || 0), [profile?.coins]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Bạn cần đăng nhập để xem profile</p>
          <button onClick={onBack} className="btn-primary px-6 py-2.5 rounded-2xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">⏳</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Đang tải profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="text-5xl mb-4">😵</div>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button onClick={onBack} className="btn-primary px-6 py-2.5 rounded-2xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  const user = profile || {};
  const games = user.games || [];
  const stats = user.stats || { totalPlays: 0, totalXP: 0, gamesPlayed: 0 };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-6xl mx-auto w-full">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm transition inline-flex items-center gap-1 mb-6 font-semibold"
        style={{ color: "var(--muted)" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
      >
        ← Về trang chủ
      </button>

      <div className="space-y-6">
        {/* Hero */}
        <HeroHeader user={user} level={lv.level} />

        {/* Level + Currency */}
        <LevelBar level={lv.level} lv={lv} coins={user.coins} stars={user.stars} />

        {/* Stats */}
        <StatsGrid stats={stats} />

        {/* Games */}
        <GameList games={games} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 rounded-2xl font-semibold text-sm transition hover:opacity-80"
          style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          ← Quay lại
        </button>
        <button
          onClick={onLogout}
          className="flex-1 px-4 py-3 rounded-2xl font-semibold text-sm transition hover:bg-red-50"
          style={{ border: "2px solid #fca5a5", color: "#ef4444" }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}
