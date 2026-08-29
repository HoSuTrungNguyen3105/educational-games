import { useCallback, useEffect, useState } from 'react'
import { statsService, userService, coinService } from '../../services/api.js'
import { StampToken, Loader, ErrorState, PrimaryButton, GhostButton } from '../../components/ui.jsx'
import { navigate } from '../../lib/router.js'
import { getRoleLabel } from '../../config/roles.js'
import {
  User,
  Save,
  LogOut,
  Shield,
  Gamepad2,
  Trophy,
  Target,
  BarChart3,
  Coins,
  Calendar,
  Pencil,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export default function TeacherProfile({ user, onLogout, showToast }) {
  const [stats, setStats] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", currentPassword: "" });

  const load = useCallback(() => {
    setStats(null); setCoinData(null); setError(null);
    Promise.all([statsService.get(), coinService.get()])
      .then(([s, c]) => { setStats(s); setCoinData(c); })
      .catch(e => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = () => {
    setForm({ name: user?.name || "", email: user?.email || "", password: "", currentPassword: "" });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (form.name && form.name !== user?.name) payload.name = form.name;
      if (form.email !== undefined && form.email !== (user?.email || "")) payload.email = form.email;
      if (form.password) {
        payload.password = form.password;
        payload.currentPassword = form.currentPassword;
      }
      if (Object.keys(payload).length === 0) { setEditing(false); return; }
      const updated = await userService.updateProfile(payload);
      const auth = JSON.parse(localStorage.getItem("edu_games_auth") || "{}");
      if (auth?.user) { auth.user = { ...auth.user, ...updated }; localStorage.setItem("edu_games_auth", JSON.stringify(auth)); }
      showToast("Đã cập nhật hồ sơ", "success");
      setEditing(false);
    } catch (e) {
      showToast(e.message || "Lỗi cập nhật hồ sơ", "error");
    } finally {
      setSaving(false);
    }
  };

  const t = stats?.totals || {};
  const totalGames = t.games ?? 0;
  const totalPlays = t.plays ?? 0;
  const totalPlayers = t.players ?? 0;
  const avgScore = t.avgScore ?? 0;
  const avgAccuracy = t.avgAccuracy ?? 0;
  const publishedCount = t.published ?? 0;
  const draftCount = t.drafts ?? 0;
  const coins = coinData?.coins ?? 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Hồ sơ</h1>
          <p className="text-sm text-ink/40 font-mono">Quản lý tài khoản và xem thống kê cá nhân</p>
        </div>
        <GhostButton onClick={() => navigate("/admin")}>← Quay lại</GhostButton>
      </div>

      {error && <ErrorState subtitle="Không thể tải dữ liệu" onRetry={load} />}
      {!error && !stats && <Loader label="Đang tải..." />}

      {!error && stats && (
        <>
          {/* Profile Card */}
          <div className="note-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-ticket/15 text-ticket flex items-center justify-center text-3xl font-display font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl text-ink">{user?.name || "Người dùng"}</h2>
              <p className="text-sm text-ink/40 font-mono mt-0.5">{user?.email || "Chưa có email"}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-2.5 py-1 rounded-full border border-ink/10 text-ink/60">
                  <Shield className="w-3 h-3" /> {getRoleLabel(user?.role)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border border-gold/30 text-gold bg-gold/5">
                  <Coins className="w-3 h-3" /> {coins} xu
                </span>
                {user?.createdAt && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink/40">
                    <Calendar className="w-3 h-3" /> Tham gia {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {!editing ? (
                <PrimaryButton onClick={startEdit}><Pencil className="w-4 h-4 inline mr-1" /> Chỉnh sửa</PrimaryButton>
              ) : (
                <GhostButton onClick={() => setEditing(false)}>Hủy</GhostButton>
              )}
              <button onClick={onLogout}
                className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                <LogOut className="w-4 h-4 inline mr-1" /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="note-card p-6 space-y-4">
              <h3 className="font-display text-lg text-ink"><Pencil className="w-5 h-5 inline mr-2 text-ticket" /> Chỉnh sửa hồ sơ</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-ink/40 uppercase block mb-1">Họ tên</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
                </div>
                <div>
                  <label className="text-xs font-mono text-ink/40 uppercase block mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
                </div>
                <div>
                  <label className="text-xs font-mono text-ink/40 uppercase block mb-1">Mật khẩu mới (để trống nếu không đổi)</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
                </div>
                {form.password && (
                  <div>
                    <label className="text-xs font-mono text-ink/40 uppercase block mb-1">Mật khẩu hiện tại (bắt buộc)</label>
                    <input type="password" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-paper text-ink text-sm font-body focus:outline-none focus:border-ticket" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <GhostButton onClick={() => setEditing(false)} disabled={saving}>Hủy</GhostButton>
                <PrimaryButton onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : <><Save className="w-4 h-4 inline mr-1" /> Lưu thay đổi</>}
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Tổng trò chơi", value: totalGames, icon: <Gamepad2 className="w-5 h-5" />, ring: "#1D2E4A" },
              { label: "Đã xuất bản", value: publishedCount, icon: <CheckCircle2 className="w-5 h-5" />, ring: "#1B998B" },
              { label: "Bản nháp", value: draftCount, icon: <Pencil className="w-5 h-5" />, ring: "#F4B942" },
              { label: "Lượt chơi", value: totalPlays, icon: <TrendingUp className="w-5 h-5" />, ring: "#FF6F91" },
              { label: "Học sinh tham gia", value: totalPlayers, icon: <User className="w-5 h-5" />, ring: "#7C6FF1" },
              { label: "Điểm trung bình", value: avgScore, icon: <Target className="w-5 h-5" />, ring: "#F4B942" },
              { label: "Độ chính xác TB", value: `${avgAccuracy}%`, icon: <BarChart3 className="w-5 h-5" />, ring: "#10B981" },
              { label: "Xu", value: coins, icon: <Coins className="w-5 h-5" />, ring: "#FFD700" },
            ].map(s => (
              <div key={s.label} className="note-card p-4 sm:p-5">
                <StampToken icon={s.icon} ring={s.ring} size={36} fontSize={16} />
                <div className="font-display text-xl sm:text-2xl text-ink mt-2 sm:mt-3">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-ink/40 font-mono uppercase mt-0.5 sm:mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Top Players */}
          {stats.topPlayers && stats.topPlayers.length > 0 && (
            <div className="note-card p-5">
              <h3 className="font-display text-lg text-ink mb-4"><Trophy className="w-5 h-5 inline mr-2 text-amber-500" /> Học sinh xuất sắc</h3>
              <div className="space-y-2">
                {stats.topPlayers.slice(0, 5).map((p, i) => (
                  <div key={`${p.name}-${i}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink/5 transition">
                    <span className="text-lg w-6 text-center shrink-0 font-mono text-ink/40">{i + 1}</span>
                    <span className="flex-1 min-w-0 text-sm font-body text-ink truncate">{p.name}</span>
                    <span className="text-[10px] text-ink/40 font-mono whitespace-nowrap">{p.games} trận · {p.accuracy}%</span>
                    <span className="font-display text-ink font-bold text-sm">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          {stats.activity && stats.activity.some(d => d.count > 0) && (
            <div className="note-card p-5">
              <h3 className="font-display text-lg text-ink mb-4"><TrendingUp className="w-5 h-5 inline mr-2 text-ticket" /> Hoạt động 7 ngày</h3>
              <div className="flex items-end justify-between gap-1 h-28">
                {stats.activity.map(d => {
                  const max = Math.max(1, ...stats.activity.map(x => x.count));
                  const h = d.count ? Math.max(6, Math.round((d.count / max) * 100)) : 3;
                  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
                  const date = new Date(`${d.date}T00:00:00`);
                  return (
                    <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-ink/40">{d.count || ""}</span>
                      <div className="w-full max-w-8 bg-gradient-to-t from-ticket to-orange-300 rounded-t-md transition-all duration-500"
                        style={{ height: `${h}px` }}></div>
                      <span className="text-[9px] font-mono text-ink/40">{days[date.getDay()]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
