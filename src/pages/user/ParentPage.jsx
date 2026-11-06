/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Users, Coins, Star, Sparkles, Gamepad2, ClipboardList, KeyRound,
  ArrowLeft, Link2, BarChart3, ListChecks, History, ShieldCheck, Check, X,
  Target, Ban,
} from "lucide-react";
import { parentApi } from "../../services/parentApi.js";
import { Loader, EmptyState, ErrorState, PrimaryButton, ConfirmModal, Modal } from "../../components/ui";
import { useConfirm } from "../../hooks/useConfirm.js";
import { navigate } from "../../lib/router.js";

// Trang Phụ huynh (đợt 3):
// - Chưa đăng nhập → giới thiệu + form đăng ký tài khoản phụ huynh (role
//   `parent`), có thể nhập luôn mã liên kết của con.
// - Phụ huynh → danh sách con đã liên kết, nhập mã để gắn thêm con, bấm vào
//   từng con để xem BÁO CÁO HỌC TẬP (dữ liệu do backend kiểm tra liên kết).
// - Học sinh → tạo/xem MÃ LIÊN KẾT 6 số của mình + xem/gỡ phụ huynh đã liên
//   kết. Giáo viên/admin tạo mã hộ qua API (POST /api/parents/link-code).

const inputCls = "w-full px-4 py-3 rounded-2xl border border-[#E7D9BE] bg-white text-sm outline-none focus:border-[#1B998B] transition-colors";
const btnTeal = "flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1B998B] text-white text-sm font-bold rounded-full hover:bg-[#178a7d] transition-colors disabled:opacity-60";
const btnGhostSm = "flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E7D9BE] text-[#20283A] text-xs font-bold rounded-full hover:bg-[#FAF3E3] transition-colors shrink-0 disabled:opacity-60";
const btnTealSm = "flex items-center gap-1.5 px-3.5 py-2 bg-[#1B998B] text-white text-xs font-bold rounded-full hover:bg-[#178a7d] transition-colors shrink-0 disabled:opacity-60";

function fmtDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7D9BE] p-3.5">
      <div className="flex items-center gap-1.5 text-[#8A7C63] text-[11px] font-semibold uppercase tracking-wide">{icon}{label}</div>
      <p className="font-display text-lg text-ink mt-1">{value}</p>
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-base text-ink mt-6 mb-3">{icon} {children}</h2>
  );
}

// ── Chưa đăng nhập: đăng ký phụ huynh ─────────────────────────────────────
function ParentRegister({ onLogin, onUserLogin, showToast }) {
  const [form, setForm] = useState({ name: "", username: "", password: "", linkCode: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await parentApi.register({
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
        linkCode: form.linkCode.trim() || undefined,
      });
      if (showToast) showToast("Đăng ký phụ huynh thành công", "success");
      // Đăng nhập ngay bằng chính thông tin vừa đăng ký.
      if (onLogin) await onLogin(form.username.trim(), form.password);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-5 w-full">
      <div className="text-center mb-5">
        <div className="mb-3 flex justify-center text-purple-500"><Users className="w-12 h-12" /></div>
        <h1 className="font-display text-xl text-ink mb-1">Góc phụ huynh</h1>
        <p className="text-sm text-[#8A7C63]">
          Tạo tài khoản phụ huynh và nhập <b>mã liên kết</b> mà con đưa để xem báo cáo học tập của con.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-3 bg-white rounded-2xl border border-[#E7D9BE] p-4">
        <input value={form.name} onChange={set("name")} placeholder="Họ tên phụ huynh" className={inputCls} required />
        <input value={form.username} onChange={set("username")} placeholder="Tên đăng nhập" className={inputCls} required autoComplete="username" />
        <input value={form.password} onChange={set("password")} placeholder="Mật khẩu (ít nhất 6 ký tự)" type="password" className={inputCls} required autoComplete="new-password" />
        <input value={form.linkCode} onChange={set("linkCode")} placeholder="Mã liên kết của con (6 số, không bắt buộc)" inputMode="numeric" maxLength={6} className={inputCls} />
        {error && <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnTeal} w-full`}>
          {busy ? "Đang đăng ký..." : "Đăng ký tài khoản phụ huynh"}
        </button>
        <button type="button" onClick={onUserLogin} className="w-full text-center text-sm font-semibold text-[#1B998B]">
          Đã có tài khoản? Đăng nhập
        </button>
      </form>
    </div>
  );
}

// ── Báo cáo học tập của một người con ─────────────────────────────────────
function ChildReport({ report, onBack, showToast }) {
  const s = report.student;
  const o = report.overview;
  // Tiến độ XP trong cấp hiện tại (server đã trả trong báo cáo).
  const xpPct = s.xpPerLevel > 0
    ? Math.min(100, Math.round(((s.xpIntoLevel || 0) / s.xpPerLevel) * 100))
    : 0;
  const xpLeft = Math.max(0, (s.xpPerLevel || 0) - (s.xpIntoLevel || 0));
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  // Danh sách người con đã chặn (an toàn cho bé — chỉ đọc, backend kiểm
  // tra liên kết; lỗi tải hiện riêng, không giả vờ là "chưa chặn ai").
  const [blocked, setBlocked] = useState(null);
  const [blockedError, setBlockedError] = useState("");

  const loadBlocked = useCallback(async () => {
    setBlockedError("");
    try {
      setBlocked(await parentApi.childBlockedUsers(s.id));
    } catch (e) {
      setBlockedError(e.message || "Không tải được danh sách con đã chặn.");
    }
  }, [s.id]);

  useEffect(() => { loadBlocked(); }, [loadBlocked]);

  function openReset() {
    setPw("");
    setPw2("");
    setPwError("");
    setPwOpen(true);
  }

  async function submitReset(e) {
    e.preventDefault();
    if (pw.length < 6) { setPwError("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    if (pw !== pw2) { setPwError("Mật khẩu nhập lại chưa khớp."); return; }
    setPwBusy(true);
    setPwError("");
    try {
      await parentApi.resetChildPassword(s.id, pw);
      setPwOpen(false);
      if (showToast) showToast(`Đã đặt lại mật khẩu cho ${s.name}. Con dùng mật khẩu mới để đăng nhập nhé.`, "success");
    } catch (err) {
      setPwError(err.message || "Đặt lại mật khẩu thất bại, vui lòng thử lại.");
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-[#1B998B] mb-3">
        <ArrowLeft className="w-4 h-4" /> Danh sách con
      </button>
      <h1 className="font-display text-xl text-ink">{s.name}</h1>
      <p className="text-sm text-[#8A7C63] mb-3">
        @{s.username}{s.className ? ` · Lớp ${s.className}` : ""} · Cấp {s.level}
      </p>

      <button onClick={openReset} className={`${btnGhostSm} mb-4`}>
        <KeyRound className="w-3.5 h-3.5" /> Đặt lại mật khẩu cho con
      </button>

      {pwOpen && (
        <Modal onClose={() => !pwBusy && setPwOpen(false)}>
          <h2 className="font-display text-lg text-ink mb-1">Đặt lại mật khẩu</h2>
          <p className="text-sm text-[#8A7C63] mb-4">
            Đặt mật khẩu mới cho {s.name} (@{s.username}). Con sẽ phải đăng nhập lại bằng mật khẩu mới trên mọi thiết bị.
          </p>
          <form onSubmit={submitReset} className="space-y-3">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
              className={inputCls}
              autoComplete="new-password"
              autoFocus
            />
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className={inputCls}
              autoComplete="new-password"
            />
            {pwError && <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">{pwError}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => setPwOpen(false)} disabled={pwBusy} className={`${btnGhostSm} flex-1 justify-center`}>
                Huỷ
              </button>
              <button type="submit" disabled={pwBusy} className={`${btnTeal} flex-1`}>
                {pwBusy ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon={<Coins className="w-3.5 h-3.5" />} label="Xu" value={(s.coins || 0).toLocaleString()} />
        <StatCard icon={<Star className="w-3.5 h-3.5" />} label="Sao" value={(s.stars || 0).toLocaleString()} />
        <StatCard icon={<Sparkles className="w-3.5 h-3.5" />} label="XP" value={(s.xp || 0).toLocaleString()} />
        <StatCard icon={<Gamepad2 className="w-3.5 h-3.5" />} label="Lượt chơi" value={(o.totalPlays || 0).toLocaleString()} />
        <StatCard icon={<BarChart3 className="w-3.5 h-3.5" />} label="Game đã chơi" value={o.gamesPlayed || 0} />
        <StatCard icon={<ListChecks className="w-3.5 h-3.5" />} label="Nhiệm vụ xong" value={`${o.tasksCompleted || 0}/${o.tasksTotal || 0}`} />
        <StatCard icon={<Target className="w-3.5 h-3.5" />} label="Nhiệm vụ trong game" value={(o.questsCompleted || 0).toLocaleString()} />
      </div>

      {/* Tiến độ XP tới cấp tiếp theo */}
      <div className="bg-white rounded-2xl border border-[#E7D9BE] p-3.5 mt-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[#8A7C63] text-[11px] font-semibold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> Tiến độ cấp {s.level || 1}
          </span>
          <span className="text-xs font-semibold text-[#20283A]">
            {(s.xpIntoLevel || 0).toLocaleString()}/{(s.xpPerLevel || 0).toLocaleString()} XP
          </span>
        </div>
        <div className="h-2.5 bg-[#F1EAD8] rounded-full overflow-hidden mt-2">
          <div className="h-full bg-[#1B998B] rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
        <p className="text-xs text-[#8A7C63] mt-1.5">
          {xpLeft > 0
            ? `Còn ${xpLeft.toLocaleString()} XP nữa là lên cấp ${(s.level || 1) + 1}.`
            : "Sắp lên cấp rồi!"}
        </p>
      </div>

      {/* An toàn: người con đã chặn (chỉ xem — bỏ chặn là thao tác của con) */}
      <SectionTitle icon={<Ban className="w-5 h-5 text-[#1B998B]" />}>Người con đã chặn</SectionTitle>
      {blocked === null && !blockedError && (
        <p className="text-sm text-[#8A7C63]">Đang tải...</p>
      )}
      {blockedError && (
        <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-between gap-2">
          <span>{blockedError}</span>
          <button type="button" onClick={loadBlocked} className="underline shrink-0">Thử lại</button>
        </div>
      )}
      {blocked && blocked.length === 0 && (
        <p className="text-sm text-[#8A7C63]">Con chưa chặn ai.</p>
      )}
      {blocked && blocked.length > 0 && (
        <div className="space-y-2">
          {blocked.map((b) => (
            <div key={b.user.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
              <div className="w-9 h-9 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {(b.user.name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#20283A] truncate">{b.user.name}</p>
                <p className="text-xs text-[#8A7C63] truncate">@{b.user.username}</p>
              </div>
              {b.since && <span className="text-[11px] text-[#8A7C63] shrink-0">{fmtDate(b.since)}</span>}
            </div>
          ))}
        </div>
      )}

      {report.perGame?.length > 0 && (
        <>
          <SectionTitle icon={<Gamepad2 className="w-5 h-5 text-[#1B998B]" />}>Game chơi nhiều nhất</SectionTitle>
          <div className="space-y-2">
            {report.perGame.map((g) => (
              <div key={g.gameId} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#20283A] truncate">{g.gameName}</p>
                  <p className="text-xs text-[#8A7C63]">{g.gamesPlayed} lượt chơi · {g.experience} XP trong game</p>
                </div>
                {g.lastPlayedAt && <span className="text-[11px] text-[#8A7C63] shrink-0">{fmtDate(g.lastPlayedAt)}</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {report.recentResults?.length > 0 && (
        <>
          <SectionTitle icon={<History className="w-5 h-5 text-[#1B998B]" />}>Hoạt động gần đây</SectionTitle>
          <div className="space-y-2">
            {report.recentResults.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#20283A] truncate">{r.gameName || "Hoạt động học tập"}</p>
                  <p className="text-xs text-[#8A7C63]">
                    {r.totalQuestions ? `Đúng ${r.correctAnswers}/${r.totalQuestions} câu · ` : ""}
                    {r.accuracy != null ? `Chính xác ${r.accuracy}% · ` : ""}
                    +{r.xpGained} XP
                  </p>
                </div>
                <span className="text-[11px] text-[#8A7C63] shrink-0">{fmtDate(r.createdAt)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {report.recentSubmissions?.length > 0 && (
        <>
          <SectionTitle icon={<ClipboardList className="w-5 h-5 text-[#1B998B]" />}>Bài tập / bài kiểm tra gần đây</SectionTitle>
          <div className="space-y-2">
            {report.recentSubmissions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#20283A] truncate">{sub.assignmentTitle}</p>
                  <p className="text-xs text-[#8A7C63]">Đúng {sub.correctCount}/{sub.totalQuestions} câu · {fmtDate(sub.submittedAt)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${sub.score >= 50 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {sub.score} điểm
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {!report.perGame?.length && !report.recentResults?.length && !report.recentSubmissions?.length && (
        <EmptyState
          icon={<BarChart3 className="w-10 h-10 text-purple-400" />}
          title="Chưa có hoạt động nào"
          subtitle="Khi con chơi game hoặc làm bài, báo cáo sẽ hiện ở đây."
        />
      )}
    </div>
  );
}

// ── Góc phụ huynh đã đăng nhập ────────────────────────────────────────────
function ParentHome({ showToast }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  // Duyệt kết bạn: theo từng con — { [studentId]: { pending: [], busyToggle, busyReq } }
  const [friendCtl, setFriendCtl] = useState({});
  const { askConfirm, confirmProps } = useConfirm();

  const loadChildren = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const kids = await parentApi.children();
      setChildren(kids);
      // Lời mời đang chờ duyệt của từng con (lỗi 1 con không chặn các con khác).
      const entries = await Promise.all(
        kids.map(async (k) => [k.id, await parentApi.pendingFriendRequests(k.id).catch(() => [])])
      );
      setFriendCtl((prev) => {
        const next = { ...prev };
        for (const [id, pending] of entries) next[id] = { ...(next[id] || {}), pending };
        return next;
      });
    } catch (e) {
      setError(e.message || "Không tải được danh sách con.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChildren(); }, [loadChildren]);

  const setCtl = useCallback((studentId, patch) => {
    setFriendCtl((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] || {}), ...patch } }));
  }, []);

  async function reloadPending(studentId) {
    const pending = await parentApi.pendingFriendRequests(studentId).catch(() => null);
    if (pending) setCtl(studentId, { pending });
  }

  async function toggleApproval(child) {
    const next = !child.friendApprovalRequired;
    setCtl(child.id, { busyToggle: true });
    try {
      await parentApi.setFriendApproval(child.id, next);
      if (showToast) {
        showToast(
          next ? `Đã bật duyệt kết bạn cho ${child.name}` : `Đã tắt duyệt kết bạn cho ${child.name}`,
          "success"
        );
      }
      await loadChildren();
    } catch (e) {
      setError(e.message || "Đổi công tắc duyệt kết bạn thất bại.");
    } finally {
      setCtl(child.id, { busyToggle: false });
    }
  }

  async function decideRequest(child, req, approve) {
    setCtl(child.id, { busyReq: req.id });
    try {
      if (approve) await parentApi.approveFriendRequest(child.id, req.id);
      else await parentApi.rejectFriendRequest(child.id, req.id);
      if (showToast) showToast(approve ? "Đã duyệt lời mời kết bạn" : "Đã từ chối lời mời kết bạn", "success");
      await reloadPending(child.id);
    } catch (e) {
      setError(e.message || "Xử lý lời mời thất bại.");
    } finally {
      setCtl(child.id, { busyReq: null });
    }
  }

  async function handleLink(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setLinkBusy(true);
    setLinkError("");
    try {
      await parentApi.link(code.trim());
      setCode("");
      if (showToast) showToast("Đã liên kết với con", "success");
      await loadChildren();
    } catch (err) {
      setLinkError(err.message || "Liên kết thất bại.");
    } finally {
      setLinkBusy(false);
    }
  }

  async function openReport(child) {
    setReportLoading(true);
    setError("");
    try {
      setReport(await parentApi.report(child.id));
    } catch (e) {
      setError(e.message || "Không tải được báo cáo.");
    } finally {
      setReportLoading(false);
    }
  }

  function handleUnlink(child) {
    askConfirm({
      title: "Gỡ liên kết",
      message: `Bạn chắc chắn muốn gỡ liên kết với ${child.name}? Bạn sẽ không xem được báo cáo của con nữa.`,
      confirmText: "Gỡ liên kết",
      onConfirm: async () => {
        try {
          await parentApi.unlinkChild(child.id);
          if (report?.student?.id === child.id) setReport(null);
          await loadChildren();
        } catch (e) {
          setError(e.message || "Gỡ liên kết thất bại.");
        }
      },
    });
  }

  if (report) {
    return (
      <div className="max-w-lg mx-auto px-4 py-5 w-full">
        <ConfirmModal {...confirmProps} />
        <ChildReport report={report} onBack={() => setReport(null)} showToast={showToast} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-5 w-full">
      <ConfirmModal {...confirmProps} />
      <h1 className="font-display text-xl text-ink mb-1">Góc phụ huynh</h1>
      <p className="text-sm text-[#8A7C63] mb-4">Xem báo cáo học tập của con đã liên kết</p>

      <form onSubmit={handleLink} className="bg-white rounded-2xl border border-[#E7D9BE] p-4 mb-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#20283A] mb-2">
          <Link2 className="w-4 h-4 text-[#1B998B]" /> Liên kết với con bằng mã
        </label>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Mã 6 số con đưa"
            inputMode="numeric"
            className={inputCls}
          />
          <button type="submit" disabled={linkBusy || code.length !== 6} className={btnTeal}>
            {linkBusy ? "Đang gắn..." : "Liên kết"}
          </button>
        </div>
        <p className="text-xs text-[#8A7C63] mt-2">Con đăng nhập bằng tài khoản học sinh, mở trang Phụ huynh này → mục "Mã liên kết của em" để tạo mã, hoặc nhờ giáo viên tạo hộ.</p>
        {linkError && <p className="mt-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">{linkError}</p>}
      </form>

      {loading && <div className="flex justify-center py-8"><Loader label="Đang tải..." /></div>}
      {!loading && error && <ErrorState title="Có lỗi xảy ra" subtitle={error} onRetry={loadChildren} />}
      {reportLoading && <div className="flex justify-center py-4"><Loader label="Đang tải báo cáo..." /></div>}

      {!loading && !error && children.length === 0 && (
        <EmptyState
          icon={<Users className="w-10 h-10 text-purple-400" />}
          title="Chưa liên kết với con nào"
          subtitle="Nhập mã liên kết của con ở trên để bắt đầu xem báo cáo."
        />
      )}

      {!loading && children.length > 0 && (
        <>
          <SectionTitle icon={<Users className="w-5 h-5 text-[#1B998B]" />}>Con của bạn · {children.length}</SectionTitle>
          <div className="space-y-2">
            {children.map((child) => {
              const ctl = friendCtl[child.id] || {};
              const pending = ctl.pending || [];
              return (
                <div key={child.id} className="p-3 bg-white rounded-2xl border border-[#E7D9BE]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {(child.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <button onClick={() => openReport(child)} className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-sm text-[#20283A] truncate">{child.name}</p>
                      <p className="text-xs text-[#8A7C63] truncate">
                        @{child.username}{child.className ? ` · Lớp ${child.className}` : ""} — bấm để xem báo cáo
                      </p>
                    </button>
                    <button onClick={() => handleUnlink(child)} className={btnGhostSm}>Gỡ</button>
                  </div>

                  {/* Duyệt kết bạn: công tắc theo từng con, mặc định tắt */}
                  <div className="mt-3 pt-3 border-t border-[#F1EAD8]">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className={`w-5 h-5 shrink-0 ${child.friendApprovalRequired ? "text-[#1B998B]" : "text-[#8A7C63]"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#20283A]">Duyệt kết bạn</p>
                        <p className="text-xs text-[#8A7C63]">
                          {child.friendApprovalRequired
                            ? "Lời mời kết bạn của con (gửi đi và nhận về) phải chờ bạn duyệt."
                            : "Con tự kết bạn như bình thường."}
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!!child.friendApprovalRequired}
                        aria-label={`Duyệt kết bạn cho ${child.name}`}
                        onClick={() => toggleApproval(child)}
                        disabled={!!ctl.busyToggle}
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-60 ${child.friendApprovalRequired ? "bg-[#1B998B]" : "bg-[#E7D9BE]"}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${child.friendApprovalRequired ? "left-[22px]" : "left-0.5"}`} />
                      </button>
                    </div>

                    {pending.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-bold text-[#8A7C63] uppercase tracking-wide">
                          Lời mời đang chờ duyệt · {pending.length}
                        </p>
                        {pending.map((req) => (
                          <div key={req.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF3E3] border border-[#E7D9BE]">
                            <div className="w-9 h-9 rounded-full bg-purple-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {(req.user?.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[13px] text-[#20283A] truncate">{req.user?.name}</p>
                              <p className="text-[11px] text-[#8A7C63] truncate">
                                {req.direction === "outgoing"
                                  ? `Con muốn kết bạn với bạn này · @${req.user?.username}`
                                  : `Bạn này muốn kết bạn với con · @${req.user?.username}`}
                              </p>
                            </div>
                            <button
                              onClick={() => decideRequest(child, req, true)}
                              disabled={ctl.busyReq === req.id}
                              className={btnTealSm}
                            >
                              <Check className="w-3.5 h-3.5" /> Duyệt
                            </button>
                            <button
                              onClick={() => decideRequest(child, req, false)}
                              disabled={ctl.busyReq === req.id}
                              className={btnGhostSm}
                              aria-label="Từ chối lời mời"
                            >
                              <X className="w-3.5 h-3.5" /> Từ chối
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Góc học sinh: mã liên kết + phụ huynh đã gắn ─────────────────────────
function StudentLink() {
  const [code, setCode] = useState(null);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [codeRes, parentsRes] = await Promise.all([
        parentApi.myLinkCode().catch(() => ({ code: null })),
        parentApi.myParents().catch(() => []),
      ]);
      setCode(codeRes?.code || null);
      setParents(Array.isArray(parentsRes) ? parentsRes : []);
    } catch (e) {
      setError(e.message || "Không tải được thông tin liên kết.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const res = await parentApi.generateLinkCode();
      setCode(res?.code || null);
    } catch (e) {
      setError(e.message || "Tạo mã thất bại.");
    } finally {
      setBusy(false);
    }
  }

  function handleGenerateClick() {
    if (!code) return generate();
    askConfirm({
      title: "Tạo mã mới",
      message: "Mã cũ sẽ hết hiệu lực ngay. Phụ huynh đã liên kết rồi thì không bị ảnh hưởng. Tiếp tục?",
      confirmText: "Tạo mã mới",
      onConfirm: generate,
    });
  }

  function handleUnlinkParent(parent) {
    askConfirm({
      title: "Gỡ liên kết phụ huynh",
      message: `${parent.name} sẽ không xem được báo cáo học tập của em nữa. Tiếp tục?`,
      confirmText: "Gỡ liên kết",
      onConfirm: async () => {
        try {
          await parentApi.unlinkParent(parent.id);
          await load();
        } catch (e) {
          setError(e.message || "Gỡ liên kết thất bại.");
        }
      },
    });
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-5 w-full">
      <ConfirmModal {...confirmProps} />
      <h1 className="font-display text-xl text-ink mb-1">Phụ huynh của em</h1>
      <p className="text-sm text-[#8A7C63] mb-4">
        Đưa MÃ LIÊN KẾT này cho bố/mẹ để bố/mẹ xem được báo cáo học tập của em.
      </p>

      {loading && <div className="flex justify-center py-8"><Loader label="Đang tải..." /></div>}
      {!loading && error && <ErrorState title="Có lỗi xảy ra" subtitle={error} onRetry={load} />}

      {!loading && (
        <>
          <div className="bg-white rounded-2xl border border-[#E7D9BE] p-4 text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#20283A] mb-2">
              <KeyRound className="w-4 h-4 text-[#1B998B]" /> Mã liên kết của em
            </p>
            {code ? (
              <p className="font-display text-4xl tracking-[0.3em] text-ink py-2">{code}</p>
            ) : (
              <p className="text-sm text-[#8A7C63] py-2">Em chưa có mã liên kết.</p>
            )}
            <PrimaryButton onClick={handleGenerateClick} disabled={busy}>
              {busy ? "Đang tạo..." : code ? "Tạo mã mới" : "Tạo mã liên kết"}
            </PrimaryButton>
          </div>

          <SectionTitle icon={<Users className="w-5 h-5 text-[#1B998B]" />}>Phụ huynh đã liên kết · {parents.length}</SectionTitle>
          {parents.length === 0 ? (
            <EmptyState
              icon={<Users className="w-10 h-10 text-purple-400" />}
              title="Chưa có phụ huynh nào liên kết"
              subtitle="Khi bố/mẹ nhập mã của em, tên sẽ hiện ở đây."
            />
          ) : (
            <div className="space-y-2">
              {parents.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
                  <div className="w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {(p.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#20283A] truncate">{p.name}</p>
                    <p className="text-xs text-[#8A7C63] truncate">@{p.username}</p>
                  </div>
                  <button onClick={() => handleUnlinkParent(p)} className={btnGhostSm}>Gỡ</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ParentPage({ userAuth, onLogin, onUserLogin, showToast }) {
  const user = userAuth?.user || null;

  if (!user) {
    return <ParentRegister onLogin={onLogin} onUserLogin={onUserLogin} showToast={showToast} />;
  }
  if (user.role === "parent") {
    return <ParentHome showToast={showToast} />;
  }
  if (user.role === "student") {
    return <StudentLink />;
  }
  return (
    <div className="max-w-lg mx-auto px-4 py-10 w-full text-center">
      <div className="mb-4 flex justify-center text-purple-500"><Users className="w-14 h-14" /></div>
      <h2 className="font-display text-xl text-ink mb-2">Trang dành cho phụ huynh và học sinh</h2>
      <p className="text-sm text-[#8A7C63] mb-4">
        Giáo viên có thể tạo mã liên kết hộ học sinh trong lớp qua API khi cần. Phụ huynh đăng ký tài khoản riêng rồi nhập mã của con để xem báo cáo.
      </p>
      <PrimaryButton onClick={() => navigate("/")}>← Về trang chủ</PrimaryButton>
    </div>
  );
}
