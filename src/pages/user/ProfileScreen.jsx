import { useEffect, useState, useMemo } from "react";
import { authService, classService, API_BASE } from "../../services/api.js";
import { getLevelProgress } from "../../lib/utils.js";
import { getRoleLabel } from "../../config/roles.js";
import { navigate } from "../../lib/router.js";
import { ArrowLeft, LogOut, GraduationCap, ChevronDown, ChevronUp, Copy, Check, Palette } from "lucide-react";
import AvatarPreview from "../../components/avatar/AvatarPreview.jsx";
import AvatarCustomizer from "../../components/avatar/AvatarCustomizer.jsx";

export default function ProfileScreen({ userAuth, onLogout, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGames, setShowGames] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [avatarLoadout, setAvatarLoadout] = useState({});
  const [avatarItems, setAvatarItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [template, setTemplate] = useState({});

  useEffect(() => {
    if (!userAuth?.user) return;
    setLoading(true);
    Promise.all([
      authService.me(),
      fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
      fetch(`${API_BASE}/avatar/loadout`, {
        headers: { Authorization: `Bearer ${userAuth.token}` },
      }).then(r => r.json()),
      fetch(`${API_BASE}/avatar/inventory`, {
        headers: { Authorization: `Bearer ${userAuth.token}` },
      }).then(r => r.json()),
    ])
      .then(([userData, itemsRes, loadoutRes, invRes]) => {
        setProfile(userData);
        setError(null);
        let items = [];
        if (itemsRes.status) {
          items = itemsRes.data.items || [];
          setAvatarItems(items);
          if (itemsRes.data.template) setTemplate(itemsRes.data.template);
        }
        if (loadoutRes.status) {
          const raw = loadoutRes.data.loadout || {};
          const VALID_LAYERS = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];
          const itemIds = new Set(items.map(i => i.id));
          const defaults = { body: null, skin: 'skin_01', face: 'face_01', hair: 'hair_boy_01', shirt: 'shirt_boy_01', pants: 'pants_boy_01', shoes: 'shoes_boy_01', hat: null, glasses: null, accessory: null };
          const cleaned = {};
          for (const k of VALID_LAYERS) {
            const v = raw[k];
            if (v && itemIds.has(v)) cleaned[k] = v;
            else cleaned[k] = defaults[k] ?? null;
          }
          setAvatarLoadout(cleaned);
        }
        if (invRes.status) setInventory(invRes.data.inventory);
      })
      .catch((e) => setError(e.message || "Lỗi tải profile"))
      .finally(() => setLoading(false));
  }, [userAuth]);

  const lv = useMemo(() => getLevelProgress(profile?.coins || 0), [profile?.coins]);

  async function handleJoinClass(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError("");
    try {
      const res = await classService.join(joinCode.trim());
      // Some API helpers resolve (don't throw) even when { status: false, msg }
      if (res && res.status === false) {
        setJoinError(res.msg || "Mã lớp không hợp lệ");
        setJoining(false);
        return;
      }
      const updated = await authService.me();
      setProfile(updated);
      setJoinCode("");
    } catch (err) {
      // Cover the different shapes classService.join might throw:
      // - a plain Error(msg)
      // - a fetch-style error carrying the parsed API body
      const apiMsg =
        err?.data?.msg ||
        err?.response?.data?.msg ||
        err?.msg ||
        err?.message;
      setJoinError(apiMsg || "Có lỗi xảy ra, vui lòng thử lại");
    }
    setJoining(false);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-3">👤</div>
          <h2 className="font-display text-lg text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-ink/50 mb-4">Bạn cần đăng nhập để xem profile</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-sm text-ink/40 animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  const user = profile || {};
  const games = user.games || [];
  const stats = user.stats || { totalPlays: 0, totalXP: 0, gamesPlayed: 0 };
  const className = user.className || null;

  return (
    <div className="flex-1 px-4 py-4 max-w-6xl mx-auto w-full space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition">
          <ArrowLeft className="w-4 h-4" /> Trang chủ
        </button>
        <button onClick={onLogout} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition">
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      {/* Profile header spans full width */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="h-1.5" style={{ background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />
        <div className="p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            {avatarItems.length > 0 ? (
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-white">
                <AvatarPreview loadout={avatarLoadout} items={avatarItems} template={template} size={64} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white font-display shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--purple, #8b5cf6))" }}>
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm shadow ring-2 ring-white"
              style={{ background: "var(--card)" }}>
              {lv.level >= 10 ? "👑" : lv.level >= 5 ? "⭐" : "🌱"}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="font-display text-lg text-ink truncate">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
                {getRoleLabel(user.role)}
              </span>
            </div>
            <p className="text-xs font-mono text-ink/40 mb-2">@{user.username}</p>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>Lv{lv.level}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                <div className="h-full rounded-full" style={{ width: lv.percent + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />
              </div>
              <span className="text-[10px] font-mono text-ink/40">{lv.current}/{lv.next}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "var(--bg)" }}>
                💰 {(user.coins || 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "var(--bg)", color: "#d97706" }}>
                ⭐ {(user.stars || 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "var(--bg)" }}>
                🎮 {stats.totalPlays} lượt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout on lg+ screens: avatar on the left, class + games on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-gold" />
            <span className="font-display text-sm text-ink">Avatar của tôi</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <AvatarPreview loadout={avatarLoadout} items={avatarItems} template={template} size={160} />
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setShowCustomizer(true); }}
              className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-body font-semibold hover:bg-gold/80 transition">
              Tùy chỉnh Avatar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span className="font-display text-sm text-ink">Lớp học</span>
            </div>

            {className ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-100">
                <span className="text-lg">🏫</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700">{className}</p>
                  {user.classCode && (
                    <button onClick={() => copyCode(user.classCode)}
                      className="flex items-center gap-1 text-xs text-green-600 font-mono hover:text-green-700">
                      Mã: {user.classCode}
                      {copied === user.classCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleJoinClass} className="flex gap-2">
                <input value={joinCode} onChange={e => setJoinCode(e.target.value)}
                  placeholder="Nhập mã lớp..."
                  className="flex-1 px-3 py-2 rounded-xl bg-ink/5 border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30" />
                <button type="submit" disabled={joining || !joinCode.trim()}
                  className="px-4 py-2 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50">
                  {joining ? "..." : "Vào lớp"}
                </button>
              </form>
            )}
            {joinError && <p className="text-xs text-red-500 mt-1.5">{joinError}</p>}
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
            <button onClick={() => setShowGames(!showGames)}
              className="w-full flex items-center justify-between p-4 hover:bg-ink/3 transition">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎮</span>
                <span className="font-display text-sm text-ink">Trò chơi</span>
                <span className="text-xs font-mono text-ink/40">({games.length})</span>
              </div>
              {showGames ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
            </button>

            {showGames && (
              <div className="px-4 pb-4 space-y-2 max-h-80 overflow-y-auto">
                {games.length === 0 ? (
                  <p className="text-sm text-ink/40 text-center py-4">Chưa có game nào</p>
                ) : (
                  games.map(g => <GameRow key={g.gameId} game={g} />)
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCustomizer && (
        <AvatarCustomizer
          loadout={avatarLoadout}
          inventory={inventory}
          coins={user.coins || 0}
          token={userAuth.token}
          onSave={async (newLoadout) => {
            // Validate against available items before save
            const itemIds = new Set(avatarItems.map(i => i.id));
            const VALID_LAYERS = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];
            const defaults = { body: null, skin: 'skin_01', face: 'face_01', hair: 'hair_boy_01', shirt: 'shirt_boy_01', pants: 'pants_boy_01', shoes: 'shoes_boy_01', hat: null, glasses: null, accessory: null };
            const cleaned = {};
            for (const k of VALID_LAYERS) {
              const v = newLoadout[k];
              if (v && itemIds.has(v)) cleaned[k] = v;
              else cleaned[k] = defaults[k] ?? null;
            }
            setAvatarLoadout(cleaned);
            setShowCustomizer(false);
            try {
              await fetch(`${API_BASE}/avatar/save`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userAuth.token}`,
                },
                body: JSON.stringify({ loadout: cleaned }),
              });
            } catch { }
          }}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}

function GameRow({ game }) {
  const lv = getLevelProgress(game.experience || 0);
  const progress = Math.min(100, game.progress || 0);

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink/3 transition">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: "var(--bg)" }}>
        🎯
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-ink truncate">{game.name}</h3>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
            Lv{lv.level}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div className="h-full rounded-full" style={{ width: progress + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />
          </div>
          <span className="text-[10px] font-mono text-ink/40">{progress}%</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs font-bold text-ink">{game.gamesPlayed || 0}</div>
        <div className="text-[9px] text-ink/40">lượt</div>
      </div>
    </div>
  );
}