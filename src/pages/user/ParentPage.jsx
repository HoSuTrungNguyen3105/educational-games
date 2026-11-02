/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Users, Coins, Star, Sparkles, Gamepad2, ClipboardList, KeyRound,
  ArrowLeft, Link2, BarChart3, ListChecks, History,
} from "lucide-react";
import { parentApi } from "../../services/parentApi.js";
import { Loader, EmptyState, ErrorState, PrimaryButton, ConfirmModal } from "../../components/ui";
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
function ChildReport({ report, onBack }) {
  const s = report.student;
  const o = report.overview;
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-[#1B998B] mb-3">
        <ArrowLeft className="w-4 h-4" /> Danh sách con
      </button>
      <h1 className="font-display text-xl text-ink">{s.name}</h1>
      <p className="text-sm text-[#8A7C63] mb-4">
        @{s.username}{s.className ? ` · Lớp ${s.className}` : ""} · Cấp {s.level}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon={<Coins className="w-3.5 h-3.5" />} label="Xu" value={(s.coins || 0).toLocaleString()} />
        <StatCard icon={<Star className="w-3.5 h-3.5" />} label="Sao" value={(s.stars || 0).toLocaleString()} />
        <StatCard icon={<Sparkles className="w-3.5 h-3.5" />} label="XP" value={(s.xp || 0).toLocaleString()} />
        <StatCard icon={<Gamepad2 className="w-3.5 h-3.5" />} label="Lượt chơi" value={(o.totalPlays || 0).toLocaleString()} />
        <StatCard icon={<BarChart3 className="w-3.5 h-3.5" />} label="Game đã chơi" value={o.gamesPlayed || 0} />
        <StatCard icon={<ListChecks className="w-3.5 h-3.5" />} label="Nhiệm vụ xong" value={`${o.tasksCompleted || 0}/${o.tasksTotal || 0}`} />
      </div>

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
  const { askConfirm, confirmProps } = useConfirm();

  const loadChildren = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setChildren(await parentApi.children());
    } catch (e) {
      setError(e.message || "Không tải được danh sách con.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChildren(); }, [loadChildren]);

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
        <ChildReport report={report} onBack={() => setReport(null)} />
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
            {children.map((child) => (
              <div key={child.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
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
            ))}
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
