import { useEffect, useState } from "react";
import { authService } from "../../services/api.js";
import { getRoleLabel } from "../../config/roles.js";
import { getLevelProgress, getLevelEmoji, getLevelTitle } from "../../lib/utils.js";
import { PrimaryButton, GhostButton, Loader } from "../../components/ui.jsx";

const GAME_META = {
  "TOAN101": { name: "Ôn tập Toán lớp 3", icon: "\u{1F9EE}", color: "from-blue-400 to-indigo-500" },
  "VUTRU22": { name: "Khám phá vũ trụ", icon: "\u{1F30C}", color: "from-indigo-400 to-purple-600" },
  "TONGHOP9": { name: "Ôn tập kiến thức tổng hợp", icon: "\u{1F4DA}", color: "from-amber-400 to-orange-500" },
  "FAMILY07": { name: "Từ vựng tiếng Anh: Gia đình", icon: "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}", color: "from-pink-400 to-rose-500" },
  "TRUNGTHU5": { name: "Trung Thu Vui Vẻ", icon: "\u{1F391}", color: "from-yellow-400 to-amber-500" },
  "DIALY88": { name: "Địa lý Việt Nam", icon: "\u{1F30D}", color: "from-green-400 to-emerald-500" },
  "CHUCAI3": { name: "Bảng chữ cái tiếng Việt", icon: "\u{1F4DD}", color: "from-cyan-400 to-blue-500" },
  "QUAYSO4": { name: "Vòng quay kiến thức lớp 4", icon: "\u{1F3B0}", color: "from-red-400 to-pink-500" },
  "ATGT202": { name: "Luật giao thông an toàn", icon: "\u{1F6A6}", color: "from-teal-400 to-cyan-500" },
  "DONGVAT6": { name: "Động vật hoang dã", icon: "\u{1F43E}", color: "from-lime-400 to-green-500" },
  "LICHSU19": { name: "Đua thuyền: Lịch sử Việt Nam", icon: "\u{1F6F6}", color: "from-blue-400 to-sky-500" },
  "MOITRUONG4": { name: "Phân loại rác thải", icon: "\u{267B}\uFE0F", color: "from-emerald-400 to-green-500" },
  "PHIEUL9": { name: "Đại Phiêu Lưu Toán Học", icon: "\u{1F9EE}", color: "from-purple-400 to-violet-500" },
  "HAMNGUC3": { name: "Hầm Ngục Kiến Thức", icon: "\u{1F3F0}", color: "from-slate-500 to-gray-700" },
  "NINJA77": { name: "Ninja Vượt Ải Từ Vựng", icon: "\u{1F977}", color: "from-gray-500 to-zinc-700" },
};

function getMeta(gameId) {
  return GAME_META[gameId] || { name: gameId, icon: "\u{1F3AE}", color: "from-gray-400 to-gray-500" };
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hôm nay";
  if (days === 1) return "hôm qua";
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

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
  const games = user.games || [];
  const stats = user.stats || { totalPlays: 0, totalXP: 0, gamesPlayed: 0 };
  const lv = getLevelProgress(user.coins || 0);
  const totalPlays = stats.totalPlays;
  const totalXP = stats.totalXP;
  const gamesPlayed = stats.gamesPlayed;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      {/* Header */}
      <div className="note-card p-6 bg-paper2 text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl text-white mx-auto mb-4 shadow-lg">
          {user.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <h1 className="font-display text-2xl text-ink mb-1">{user.name}</h1>
        <p className="text-sm text-[#8A7C63] font-mono mb-1">@{user.username}</p>
        {user.email && (
          <p className="text-xs text-[#8A7C63] flex items-center justify-center gap-1">
            📧 {user.email}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-600 font-semibold capitalize">
            {getRoleLabel(user.role)}
          </span>
          {user.createdAt && (
            <span className="text-[#8A7C63] font-mono">
              Tham gia {timeAgo(user.createdAt)}
            </span>
          )}
        </div>
      </div>

      {/* Level */}
      <div className="note-card p-5 sm:p-6 mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-center shrink-0">
            <div className="text-5xl mb-1">{getLevelEmoji(lv.level)}</div>
            <div className="font-display text-3xl text-ink">{lv.level}</div>
            <div className="text-xs font-mono text-amber-600 font-bold uppercase">{getLevelTitle(lv.level)}</div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink">💰 {(user.coins || 0).toLocaleString()} Coin</span>
                <span className="text-sm font-semibold text-amber-600">🌟 {(user.stars || 0).toLocaleString()} Sao</span>
              </div>
              <span className="text-xs font-mono text-[#8A7C63]">
                {lv.percent}% → Level {lv.level + 1}
              </span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: lv.percent + "%" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-mono text-[#8A7C63]">{lv.current} coin</span>
              <span className="text-[10px] font-mono text-[#8A7C63]">{lv.next} coin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="note-card p-4 sm:p-5 text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-display text-2xl sm:text-3xl text-teal">{totalPlays}</div>
          <div className="text-[10px] sm:text-xs text-[#8A7C63] font-mono uppercase mt-1">Lượt chơi</div>
        </div>
        <div className="note-card p-4 sm:p-5 text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="font-display text-2xl sm:text-3xl text-ink">{gamesPlayed}</div>
          <div className="text-[10px] sm:text-xs text-[#8A7C63] font-mono uppercase mt-1">Game đã chơi</div>
        </div>
        <div className="note-card p-4 sm:p-5 text-center">
          <div className="text-3xl mb-2">✨</div>
          <div className="font-display text-2xl sm:text-3xl text-purple-500">{totalXP}</div>
          <div className="text-[10px] sm:text-xs text-[#8A7C63] font-mono uppercase mt-1">Tổng XP</div>
        </div>
      </div>

      {/* Games */}
      {games.length > 0 && (
        <div className="mb-6">
          <h2 className="font-display text-lg text-ink mb-3">🎮 Game đang chơi</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {games.map(g => {
              const meta = getMeta(g.gameId);
              return (
                <div key={g.gameId} className="note-card p-4 transition hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-xl text-white shadow-md shrink-0`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm text-ink truncate">{meta.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#8A7C63]">
                        <span>Lv.{g.level}</span>
                        <span>·</span>
                        <span>{g.experience} XP</span>
                        <span>·</span>
                        <span>{g.gamesPlayed} lượt</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-ink/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: Math.min(100, g.progress || 0) + "%" }} />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-[#8A7C63] font-mono">{g.progress}% hoàn thành</span>
                        {g.lastPlayedAt && (
                          <span className="text-[10px] text-[#8A7C63] font-mono">{timeAgo(g.lastPlayedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {games.length === 0 && (
        <div className="note-card p-6 text-center mb-6">
          <div className="text-4xl mb-2">🎲</div>
          <h3 className="font-display text-base text-ink mb-1">Chưa có game nào</h3>
          <p className="text-sm text-[#8A7C63]">Hãy bắt đầu chơi để tích lũy kinh nghiệm!</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <GhostButton onClick={onBack} className="flex-1">← Quay lại</GhostButton>
        <button
          onClick={onLogout}
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 transition"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}
