import { useEffect, useState, useMemo } from "react";
import { authService } from "../../services/api.js";
import { getRoleLabel } from "../../config/roles.js";
import { getLevelProgress } from "../../lib/utils.js";

const TYPE_LABELS = { "play-to-learn": "Học mà chơi", "play-to-win": "Chơi để thắng" };
const STATUS_LABELS = { published: "Đã xuất bản", draft: "Bản nháp" };

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

function StatCard({ icon, value, label, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 text-center" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${color}, transparent)` }} />
      <div className="relative">
        <div className="text-2xl sm:text-3xl mb-1">{icon}</div>
        <div className="font-display text-xl sm:text-2xl" style={{ color }}>{value}</div>
        <div className="text-[10px] sm:text-xs font-mono mt-1" style={{ color: "var(--muted)" }}>{label}</div>
      </div>
    </div>
  );
}

function GameCard({ game, index }) {
  const [expanded, setExpanded] = useState(false);
  const lv = getLevelProgress(game.experience || 0);
  const progressPct = Math.min(100, game.progress || 0);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Color bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))` }} />

      <div className="p-4 sm:p-5">
        {/* Top row: name + level */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base sm:text-lg text-ink truncate">{game.name}</h3>
            {game.description && (
              <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted)" }}>{game.description}</p>
            )}
          </div>
          <div className="shrink-0 text-center px-3 py-1.5 rounded-xl" style={{ background: "var(--bg)" }}>
            <div className="text-lg leading-none">{lv.level}</div>
            <div className="text-[9px] font-mono uppercase" style={{ color: "var(--muted)" }}>Lv</div>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {game.subject && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent, #2563eb)" }}>
              📚 {game.subject}
            </span>
          )}
          {game.topic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              🏷️ {game.topic}
            </span>
          )}
          {game.type && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#fef3c7", color: "#d97706" }}>
              🎯 {TYPE_LABELS[game.type] || game.type}
            </span>
          )}
          {game.language && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#f3e8ff", color: "#9333ea" }}>
              🌐 {game.language.toUpperCase()}
            </span>
          )}
        </div>

        {/* XP progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Kinh nghiệm</span>
            <span className="text-[10px] font-mono font-semibold" style={{ color: "var(--accent)" }}>{lv.current}/{lv.next} XP</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: lv.percent + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Tiến độ</span>
            <span className="text-[10px] font-mono font-semibold" style={{ color: progressPct >= 100 ? "#16a34a" : "var(--accent)" }}>{progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: progressPct + "%",
                background: progressPct >= 100
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))",
              }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center py-2 rounded-xl" style={{ background: "var(--bg)" }}>
            <div className="text-sm font-bold text-ink">{game.gamesPlayed || 0}</div>
            <div className="text-[9px] font-mono" style={{ color: "var(--muted)" }}>Lượt chơi</div>
          </div>
          <div className="text-center py-2 rounded-xl" style={{ background: "var(--bg)" }}>
            <div className="text-sm font-bold text-ink">{game.experience || 0}</div>
            <div className="text-[9px] font-mono" style={{ color: "var(--muted)" }}>XP</div>
          </div>
          <div className="text-center py-2 rounded-xl" style={{ background: "var(--bg)" }}>
            <div className="text-sm font-bold text-ink">{game.questsCompleted || 0}</div>
            <div className="text-[9px] font-mono" style={{ color: "var(--muted)" }}>Nhiệm vụ</div>
          </div>
        </div>

        {/* Expand details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-[11px] font-semibold py-1.5 rounded-xl transition"
          style={{ color: "var(--accent)", background: expanded ? "var(--accent-bg, #dbeafe)" : "transparent" }}
        >
          {expanded ? "▲ Ẩn bớt" : "▼ Chi tiết game"}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 space-y-2" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <InfoRow label="Mã game" value={game.code} />
              <InfoRow label="Trạng thái" value={STATUS_LABELS[game.status] || game.status} />
              <InfoRow label="Số câu hỏi" value={game.questionsCount} />
              <InfoRow label="Người chơi" value={game.playersCount} />
              <InfoRow label="Lần chơi cuối" value={timeAgo(game.lastPlayedAt)} />
              <InfoRow label="Ngày tạo" value={game.createdAt ? new Date(game.createdAt).toLocaleDateString("vi-VN") : null} />
            </div>
            {game.inventory && game.inventory.length > 0 && (
              <div>
                <div className="text-[10px] font-semibold mb-1" style={{ color: "var(--muted)" }}>Vật phẩm:</div>
                <div className="flex flex-wrap gap-1">
                  {game.inventory.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "var(--bg)", color: "var(--ink)" }}>
                      {item.name || item.itemId} {item.quantity > 1 ? `x${item.quantity}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {game.loadout && (
              <div>
                <div className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Trang bị hiện tại:</div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {game.loadout.equippedWeapon && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--bg)" }}>
                      <span>⚔️</span>
                      <span className="font-semibold text-ink">{game.loadout.equippedWeapon}</span>
                    </div>
                  )}
                  {game.loadout.equippedOutfit && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--bg)" }}>
                      <span>🧥</span>
                      <span className="font-semibold text-ink">{game.loadout.equippedOutfit}</span>
                    </div>
                  )}
                  {game.loadout.equippedHair && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--bg)" }}>
                      <span>💇</span>
                      <span className="font-semibold text-ink">{game.loadout.equippedHair}</span>
                    </div>
                  )}
                </div>
                {game.loadout.potions && Object.keys(game.loadout.potions).length > 0 && (
                  <div className="mt-1.5">
                    <div className="text-[9px] font-mono mb-1" style={{ color: "var(--muted)" }}>Thuốc:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(game.loadout.potions).map(([k, v]) => v > 0 && (
                        <span key={k} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "#fef3c7", color: "#92400e" }}>
                          {k === "heal_small" ? "🧪 Nhỏ" : k === "heal_medium" ? "🧪 Vừa" : k === "heal_large" ? "🧪 Lớn" : k} ×{v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(game.loadout.ownedWeapons?.length > 0 || game.loadout.ownedOutfits?.length > 0 || game.loadout.ownedHairs?.length > 0) && (
                  <div className="mt-1.5">
                    <div className="text-[9px] font-mono mb-1" style={{ color: "var(--muted)" }}>Đã sở hữu:</div>
                    <div className="flex flex-wrap gap-1">
                      {game.loadout.ownedWeapons?.map((id, i) => (
                        <span key={`w${i}`} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#dbeafe", color: "#1e40af" }}>⚔️ {id}</span>
                      ))}
                      {game.loadout.ownedOutfits?.map((id, i) => (
                        <span key={`o${i}`} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#fce7f3", color: "#9d174d" }}>🧥 {id}</span>
                      ))}
                      {game.loadout.ownedHairs?.map((id, i) => (
                        <span key={`h${i}`} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#f3e8ff", color: "#6b21a8" }}>💇 {id}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 px-2 rounded-lg" style={{ background: "var(--bg)" }}>
      <span className="font-mono" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="font-semibold text-ink truncate ml-2">{value || "—"}</span>
    </div>
  );
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
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto w-full">
      <button
        onClick={onBack}
        className="text-sm transition inline-flex items-center gap-1 mb-6 font-semibold"
        style={{ color: "var(--muted)" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
      >
        ← Về trang chủ
      </button>

      {/* ═══════ HERO HEADER ═══════ */}
      <div className="relative rounded-3xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(135deg, var(--accent), var(--purple, #8b5cf6), var(--accent))" }} />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl sm:text-5xl text-white font-display shadow-xl"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--purple, #8b5cf6))" }}
            >
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg" style={{ background: "var(--card)", border: "2px solid var(--line)" }}>
              {lv.level >= 10 ? "👑" : lv.level >= 5 ? "⭐" : "🌱"}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-2xl sm:text-3xl text-ink mb-0.5">{user.name}</h1>
            <p className="text-sm font-mono mb-2" style={{ color: "var(--muted)" }}>@{user.username}</p>
            {user.email && (
              <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>📧 {user.email}</p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
                {getRoleLabel(user.role)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#fef3c7", color: "#d97706" }}>
                Level {lv.level}
              </span>
              {user.createdAt && (
                <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                  Tham gia {timeAgo(user.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ LEVEL + CURRENCY ═══════ */}
      <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <div className="text-center shrink-0">
            <div className="text-4xl sm:text-5xl mb-1">{lv.level >= 10 ? "👑" : lv.level >= 5 ? "⭐" : "🌱"}</div>
            <div className="font-display text-2xl sm:text-3xl text-ink">{lv.level}</div>
            <div className="text-[10px] font-mono font-bold uppercase" style={{ color: "var(--accent)" }}>Level {lv.level}</div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{lv.current} / {lv.next} XP</span>
              <span className="text-xs font-mono font-semibold" style={{ color: "var(--accent)" }}>{lv.percent}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: lv.percent + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }}
              />
            </div>
            {/* Currency */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "var(--bg)" }}>
                <span className="text-base">💰</span>
                <span className="font-display text-sm font-bold text-ink">{(user.coins || 0).toLocaleString()}</span>
                <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Xu</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "var(--bg)" }}>
                <span className="text-base">⭐</span>
                <span className="font-display text-sm font-bold" style={{ color: "#d97706" }}>{(user.stars || 0).toLocaleString()}</span>
                <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Sao</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ STATS ═══════ */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard icon="🎮" value={stats.totalPlays} label="Lượt chơi" color="var(--accent)" />
        <StatCard icon="📚" value={stats.gamesPlayed} label="Game đã chơi" color="var(--purple, #8b5cf6)" />
        <StatCard icon="✨" value={stats.totalXP} label="Tổng XP" color="#d97706" />
      </div>

      {/* ═══════ GAMES LIST ═══════ */}
      <div className="mb-6">
        <h2 className="font-display text-lg sm:text-xl text-ink mb-4">
          🎮 Trò chơi ({games.length})
        </h2>
        {games.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {games.map((g, i) => (
              <GameCard key={g.gameId} game={g} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="font-display text-base text-ink mb-1">Chưa có game nào</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Hãy bắt đầu chơi để tích lũy kinh nghiệm!</p>
          </div>
        )}
      </div>

      {/* ═══════ ACTIONS ═══════ */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 rounded-2xl font-semibold text-sm transition"
          style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          ← Quay lại
        </button>
        <button
          onClick={onLogout}
          className="flex-1 px-4 py-3 rounded-2xl font-semibold text-sm transition hover:bg-red-100"
          style={{ border: "2px solid #fca5a5", color: "#ef4444" }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}
