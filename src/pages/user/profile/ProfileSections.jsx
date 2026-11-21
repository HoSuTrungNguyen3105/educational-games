// Các khối nội dung của trang Hồ sơ — DÙNG CHUNG cho trang Bé
// (KidDashboard, có sidebar trái trên desktop): nội dung/handler lấy từ một
// nguồn duy nhất là `vm` do hook useProfileVm dựng lên.
// LƯU Ý attendance: các import IconCalendar (ui), UserCheck (lucide),
// hasUserPermission (roles) và navigate (router) đã gỡ khỏi file này vì
// chỉ khối "Chấm công" ở ClassSection dùng — khối đó đang comment-out
// (xem ghi chú ở ClassSection), bật lại attendance thì khôi phục cả 4.
import { useState } from "react";
import { IconCheck, IconChevronDown, IconDownload, IconBell, IconCheckCircle, IconTrash } from '../../../components/ui/index.js';
import { GraduationCap, ChevronUp, Copy, Palette, Smartphone, Monitor, Apple, BellRing, BellOff, TriangleAlert, Send, RefreshCw, Info, Share2, SquarePlus, EllipsisVertical, Gamepad2, Settings, Pencil, Shirt, PawPrint, Crown, Star, Sprout, Target, School, User, Save, Loader2
} from "lucide-react";
import DressUpAvatar, { DressUpAvatarSmall } from "../../../components/avatar/DressUpAvatar.jsx";
import KidSettingsCard from "../../../components/profile/KidSettingsCard.jsx";
import { getRoleLabel } from "../../../config/roles.js";
import { getLevelProgress } from "../../../lib/utils.js";
import { AGE_CODES, gradeForAgeCode } from "../../../lib/ageCodes.js";
import { gradeLabel, ageForGrade } from "../../../lib/kidSettings.js";
import { getPushSupportStatus } from "../../../firebase/messaging.js";
import { outfitName, describeOutfit } from "../../../lib/dressUpAvatar.js";

/** Huy hiệu cấp độ cạnh avatar (mầm / sao / vương miện theo Lv). */
export function LevelBadge({ lv }) {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 leading-none">
      {lv.level >= 10 ? <Crown className="w-4 h-4 text-amber-500" /> : lv.level >= 5 ? <Star className="w-4 h-4 text-amber-400" fill="currentColor" /> : <Sprout className="w-4 h-4 text-emerald-500" />}
    </span>
  );
}

/** Avatar tròn viền accent + huy hiệu cấp — sidebar desktop và header mobile dùng chung. */
export function AvatarWithBadge({ vm, size = 56 }) {
  const { outfit, lv } = vm;
  return (
    <div className="relative shrink-0">
      <div className="rounded-full" style={{ border: "2px solid var(--accent)", padding: 2 }}>
        <DressUpAvatarSmall
          kind="avatar"
          state={outfit.avatar.value}
          size={size}
          label={`Avatar ${outfitName("avatar", outfit.avatar.value)}`}
        />
      </div>
      <LevelBadge lv={lv} />
    </div>
  );
}

/** Tóm tắt danh tính (avatar + tên + @username + chip vai trò) — sidebar desktop. */
export function IdentitySummary({ vm }) {
  const { user } = vm;
  return (
    <div className="flex items-center gap-3">
      <AvatarWithBadge vm={vm} size={56} />
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-base text-ink truncate">{user.name}</h1>
        <p className="text-[11px] font-mono text-ink/40 truncate">@{user.username}</p>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
          {getRoleLabel(user.role)}
        </span>
      </div>
    </div>
  );
}

/** Thanh tiến độ cấp độ (Lv + thanh xu tích lũy). */
export function LevelBar({ lv }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold shrink-0" style={{ color: "var(--accent)" }}>Lv{lv.level}</span>
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: lv.percent + "%", background: "var(--accent)" }} />
        </div>
      </div>
      {/* Ngưỡng cấp của getLevelProgress tính theo XU (số xu tích lũy),
          không phải XP — trước đây ghi "XP" khiến người dùng tưởng mâu
          thuẫn với "Điểm kinh nghiệm" (stats.totalXP) ở dưới. */}
      <p className="text-[10px] font-mono text-ink/40 mt-1">{lv.current}/{lv.next} xu</p>
    </div>
  );
}

/** Chỉ số ví — rows kẻ lông mày, không lồng thẻ trong thẻ (sidebar desktop). */
export function WalletRows({ wallet }) {
  return (
    <dl className="text-xs">
      {wallet.map((w, i) => (
        <div key={w.label} className="flex items-center justify-between gap-2 py-2"
          style={i ? { borderTop: "1px solid var(--line)" } : undefined}>
          <dt className="text-ink/55 inline-flex items-center gap-2">
            <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
              {w.icon}
            </span>
            {w.label}
          </dt>
          <dd className="font-bold font-mono text-sm text-ink">{w.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Bản nháp form hồ sơ từ user hiện tại (null ở server ↔ "" trong form). */
function profileDraftFrom(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    ageCode: user?.ageCode || "",
    gender: user?.gender || "",
  };
}

const PROFILE_FIELD_CLS = "w-full px-3 py-2 rounded-lg bg-ink/5 border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30";
const PROFILE_LABEL_CLS = "block text-[11px] font-bold text-ink/50 mb-1";

/**
 * Thẻ "Thông tin cá nhân" — dùng chung desktop (tab Tổng quan) và mobile:
 * tóm tắt danh tính + thanh cấp độ + FORM sửa tên hiển thị / email / lớp /
 * giới tính, lưu qua `vm.handleUpdateProfile` (PUT /auth/me ở container).
 * Email để trống nghĩa là giữ nguyên email hiện tại (đúng ngữ nghĩa của
 * server: field email rỗng thì không cập nhật) — chỉ gửi khi có nhập.
 */
export function PersonalInfoCard({ vm }) {
  const { user, lv, handleUpdateProfile, apiErrorMessage } = vm;
  const [draft, setDraft] = useState(() => profileDraftFrom(user));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Đổi sang tài khoản khác (id khác) thì nạp lại bản nháp từ hồ sơ mới —
  // reset ngay trong render (mẫu React khuyến nghị) thay vì effect. Cùng
  // một tài khoản thì KHÔNG nạp lại: hồ sơ được làm mới ở nơi khác (vd
  // lưu bộ đồ) không được ghi đè bản nháp đang sửa dở.
  const [draftForId, setDraftForId] = useState(user.id);
  if (draftForId !== user.id) {
    setDraftForId(user.id);
    setDraft(profileDraftFrom(user));
    setFormError("");
  }

  const dirty =
    draft.name !== (user.name || "") ||
    draft.email !== (user.email || "") ||
    draft.ageCode !== (user.ageCode || "") ||
    draft.gender !== (user.gender || "");

  const setField = (field) => (e) => {
    setDraft((d) => ({ ...d, [field]: e.target.value }));
    setFormError("");
  };

  async function handleSave(e) {
    e.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setFormError("Tên hiển thị không được để trống");
      return;
    }
    const email = draft.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setFormError("Email không đúng định dạng");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name,
        ageCode: draft.ageCode || null,
        gender: draft.gender || null,
      };
      if (email) payload.email = email;
      const updated = await handleUpdateProfile(payload);
      setDraft(profileDraftFrom(updated));
    } catch (err) {
      // Form giữ nguyên nội dung đang sửa + hiện lỗi tại chỗ (toast lỗi
      // đã bắn ở container) — không đóng form, không mất bản nháp.
      setFormError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl p-4 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent-bg)" }}>
          <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
        </span>
        <span className="font-display text-sm text-ink">Thông tin cá nhân</span>
      </div>

      <IdentitySummary vm={vm} />
      <div className="mt-3">
        <LevelBar lv={lv} />
      </div>

      <form onSubmit={handleSave} className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={PROFILE_LABEL_CLS} htmlFor="pf-name">Tên hiển thị</label>
            <input id="pf-name" className={PROFILE_FIELD_CLS} value={draft.name}
              onChange={setField("name")} placeholder="Tên của bé" autoComplete="name" />
          </div>
          <div>
            <label className={PROFILE_LABEL_CLS} htmlFor="pf-email">Email</label>
            <input id="pf-email" type="email" className={PROFILE_FIELD_CLS} value={draft.email}
              onChange={setField("email")} placeholder="vidu@email.com" autoComplete="email" />
          </div>
          <div>
            <label className={PROFILE_LABEL_CLS} htmlFor="pf-grade">Lớp</label>
            <select id="pf-grade" className={PROFILE_FIELD_CLS} value={draft.ageCode} onChange={setField("ageCode")}>
              <option value="">Chưa chọn</option>
              {AGE_CODES.map((code) => {
                const g = gradeForAgeCode(code);
                return (
                  <option key={code} value={code}>
                    {gradeLabel(g)} · {ageForGrade(g)} tuổi
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className={PROFILE_LABEL_CLS} htmlFor="pf-gender">Giới tính</label>
            <select id="pf-gender" className={PROFILE_FIELD_CLS} value={draft.gender} onChange={setField("gender")}>
              <option value="">Chưa chọn</option>
              <option value="boy">Bạn trai</option>
              <option value="girl">Bạn gái</option>
            </select>
          </div>
        </div>

        {formError && <p className="text-xs text-red-500">{formError}</p>}

        <div className="flex items-center gap-2.5">
          <button type="submit" disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
            style={{ background: "var(--accent)" }}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          {dirty && !saving && <span className="text-[11px] text-ink/40">Có thay đổi chưa lưu</span>}
        </div>
      </form>
    </section>
  );
}

export function OutfitSection({ vm }) {
  const { outfit, setCustomizer } = vm;
  return (
    <>
    {/* Avatar & thú cưng */}
    <section id="sec-outfit" className="scroll-mt-4 rounded-2xl p-4 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <span className="font-display text-sm text-ink">Avatar &amp; thú cưng</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { kind: "avatar", icon: <Shirt className="w-3.5 h-3.5" />, title: "Nhân vật", btn: "Tùy chỉnh Avatar" },
          { kind: "pet", icon: <PawPrint className="w-3.5 h-3.5" />, title: "Thú cưng", btn: "Tùy chỉnh Pet" },
        ].map(({ kind, icon, title, btn }) => {
          const state = outfit[kind].value;
          const parts = describeOutfit(kind, state);
          return (
            <div key={kind} className="rounded-lg p-2.5 flex flex-col items-center gap-1.5" style={{ background: "var(--bg)" }}>
              <div className="w-full flex-1 grid place-items-center py-1">
                <DressUpAvatar kind={kind} state={state} size={132}
                  label={`${outfitName(kind, state)} — ${title}`} />
              </div>
              <p className="font-display text-sm text-ink text-center leading-tight inline-flex items-center gap-1">
                {icon} {outfitName(kind, state) || title}
              </p>
              <p className="text-[11px] text-ink/45 text-center leading-tight min-h-[28px] px-1">
                {parts.length ? parts.join(" · ") : "Chưa mặc gì"}
              </p>
              <button
                onClick={() => setCustomizer(kind)}
                className="mt-1 w-full rounded-lg text-white py-2 text-xs font-body font-semibold transition active:scale-[0.98] inline-flex items-center justify-center gap-1.5"
                style={{ background: "var(--accent)" }}
              >
                <Pencil className="w-3.5 h-3.5" /> {btn}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-ink/40 text-center mt-3 leading-snug">
        Bộ đồ lưu trong hồ sơ, dùng chung với game <b>Tiệm thời trang cho Bé</b> và <b>Tiệm thay đồ thú cưng</b>.
      </p>
    </section>
    </>
  );
}

export function ClassSection({ vm }) {
  const { user, className, copied, copyCode, joinCode, setJoinCode, joinError, joining, handleJoinClass } = vm;
  return (
    <>
    {/* Lớp học (khối Chấm công bên cạnh đã tạm tắt — xem ghi chú dưới) */}
    <section id="sec-class" className="scroll-mt-4 grid gap-3 items-start">
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-gold" />
          <span className="font-display text-sm text-ink">Lớp học</span>
        </div>

        {className ? (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50 border border-green-100">
            <School className="w-5 h-5 text-green-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-700">{className}</p>
              {user.classCode && (
                <button onClick={() => copyCode(user.classCode)}
                  className="flex items-center gap-1 text-xs text-green-600 font-mono hover:text-green-700">
                  Mã: {user.classCode}
                  {copied === user.classCode ? <IconCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleJoinClass} className="flex gap-2">
            <input value={joinCode} onChange={e => setJoinCode(e.target.value)}
              placeholder="Nhập mã lớp..."
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-ink/5 border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30" />
            <button type="submit" disabled={joining || !joinCode.trim()}
              className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50">
              {joining ? "..." : "Vào lớp"}
            </button>
          </form>
        )}
        {joinError && <p className="text-xs text-red-500 mt-1.5">{joinError}</p>}
      </div>

      {/* ── TẠM TẮT ATTENDANCE (chấm công) theo yêu cầu 2026-11-18 — hiện
          không dùng. Bật lại bằng cách bỏ comment khối dưới + khôi phục
          `sm:grid-cols-2` ở thẻ section bao ngoài + 4 import đã gỡ ở đầu
          file (IconCalendar, UserCheck, hasUserPermission, navigate).
          Trang AttendancePage/AttendanceCalendar và endpoint attendance
          phía server vẫn giữ nguyên, không xoá.
      {hasUserPermission(user, 'attendance.view') && (
        <button
          onClick={() => navigate('/attendance')}
          className="w-full rounded-xl p-3.5 flex items-center gap-3 hover:bg-ink/3 transition text-left"
          style={{ background: "var(--card)", border: "1px solid var(--line)" }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent-bg)" }}>
            <UserCheck className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm text-ink">Chấm công</span>
              {hasUserPermission(user, 'attendance.checkin') && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                  Có quyền
                </span>
              )}
            </div>
            <p className="text-xs text-ink/40">Xem lịch sử và chấm công đi học</p>
          </div>
          <IconCalendar className="w-5 h-5 text-ink/40 shrink-0" />
        </button>
      )}
      */}
    </section>
    </>
  );
}

export function GamesSection({ vm }) {
  const { games, showGames, setShowGames } = vm;
  return (
    <>
    {/* Trò chơi */}
    <section id="sec-games" className="scroll-mt-4 rounded-2xl overflow-hidden shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      <button onClick={() => setShowGames(!showGames)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-ink/3 transition">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <span className="font-display text-sm text-ink">Trò chơi</span>
          <span className="text-xs font-mono text-ink/40">({games.length})</span>
        </div>
        {showGames ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <IconChevronDown className="w-4 h-4 text-ink/40" />}
      </button>

      {showGames && (
        <div className="px-2 pb-2 space-y-1 max-h-80 lg:max-h-[360px] overflow-y-auto"
          style={{ borderTop: "1px solid var(--line)" }}>
          {games.length === 0 ? (
            <p className="text-sm text-ink/40 text-center py-4">Chưa có game nào</p>
          ) : (
            games.map(g => <GameRow key={g.gameId} game={g} />)
          )}
        </div>
      )}
    </section>
    </>
  );
}

export function KidSettingsSection({ vm }) {
  const { user, userAuth } = vm;
  return (
    <>
    {/* Cài đặt của bé */}
    <section id="sec-settings" className="scroll-mt-4">
      <div className="flex items-center gap-3 mb-3">
        <Settings className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <h2 className="font-display text-base font-extrabold text-ink leading-tight shrink-0">Cài đặt</h2>
        <span className="text-xs text-ink/45 shrink-0">Dành cho phụ huynh</span>
        <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
      </div>

      <KidSettingsCard accountName={user.name || userAuth?.user?.name} />
    </section>
    </>
  );
}

export function AppSection({ vm }) {
  const { isInstalled, platformTab, setPlatformTab, deferredPrompt, handleInstallClick, isIOS, pushSupport, setPushSupport, pushMessage, pushLoading, testingPush, handleEnablePush, handleTestPush, handleResetDevices } = vm;
  return (
    <>
    {/* Ứng dụng + thông báo */}
    <section id="sec-app" className="scroll-mt-4 grid gap-3 xl:grid-cols-2 items-start">
      {/* PWA Install Card */}
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-bg)" }}>
            <IconDownload className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm text-ink">Cài đặt ứng dụng</h3>
            <p className="text-[11px] text-ink/40">Truy cập nhanh như app native</p>
          </div>
          {isInstalled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
              <IconCheckCircle className="w-3.5 h-3.5" /> Đã cài
            </span>
          )}
        </div>

        {!isInstalled ? (
          <>
            <p className="text-xs text-ink/60 mb-3">Cài EduPlay về màn hình chính để mở nhanh, dùng offline và nhận thông báo đẩy.</p>

            {/* Platform Tabs — giữ nguyên ý tưởng hiweb */}
            <div className="flex gap-1.5 p-1 rounded-lg mb-3" style={{ background: "var(--bg)" }}>
              <button
                onClick={() => setPlatformTab("android")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${platformTab === "android" ? "bg-white shadow text-ink border border-ink/10" : "text-ink/50 hover:text-ink"}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Android
              </button>
              <button
                onClick={() => setPlatformTab("ios")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${platformTab === "ios" ? "bg-white shadow text-ink border border-ink/10" : "text-ink/50 hover:text-ink"}`}
              >
                <Apple className="w-3.5 h-3.5" /> iOS
              </button>
              <button
                onClick={() => setPlatformTab("desktop")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${platformTab === "desktop" ? "bg-white shadow text-ink border border-ink/10" : "text-ink/50 hover:text-ink"}`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
            </div>

            {/* Steps */}
            <div className="rounded-lg p-3 mb-3" style={{ background: "var(--bg)" }}>
              {platformTab === "android" && (
                <ol className="space-y-2 text-xs text-ink/70">
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>Nhấn menu <EllipsisVertical className="w-3 h-3 inline mx-0.5" /> góc trên phải trình duyệt</span></li>
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>Chọn “Thêm vào Màn hình chính” / “Cài đặt ứng dụng”</span></li>
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>Nhấn “Cài đặt” để xác nhận</span></li>
                </ol>
              )}
              {platformTab === "ios" && (
                <ol className="space-y-2 text-xs text-ink/70">
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>Nhấn nút Chia sẻ <Share2 className="w-3 h-3 inline mx-0.5 text-violet-600" /> ở thanh Safari</span></li>
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>Cuộn xuống → “Thêm vào Màn hình chính”</span></li>
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>Nhấn “Thêm” ở góc trên phải</span></li>
                </ol>
              )}
              {platformTab === "desktop" && (
                <ol className="space-y-2 text-xs text-ink/70">
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>Tìm biểu tượng cài đặt <SquarePlus className="w-3 h-3 inline mx-0.5" /> trên thanh địa chỉ</span></li>
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>Nhấn “Cài đặt” trong popup</span></li>
                  <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>Hoặc: Menu ⋮ → “Cài đặt EduPlay…”</span></li>
                </ol>
              )}
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white hover:opacity-90 transition active:scale-[0.98]"
              style={{ background: "var(--accent)" }}
            >
              <IconDownload className="w-4 h-4" /> Cài đặt ứng dụng
            </button>
            {!deferredPrompt && platformTab !== "ios" && (
              <p className="text-[11px] text-ink/30 text-center mt-2">Mẹo: mở bằng Chrome/Edge để hiện nút cài đặt tự động</p>
            )}
          </>
        ) : (
          <div className="rounded-lg p-3 flex items-center gap-3 bg-green-50 border border-green-200">
            <IconCheckCircle className="w-8 h-8 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-700">Ứng dụng đã được cài đặt</p>
              <p className="text-xs text-green-600/80">Mở từ màn hình chính để có trải nghiệm tốt nhất.</p>
            </div>
          </div>
        )}
      </div>

      {/* Push Notification Card */}
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FDF0D5" }}>
            <IconBell className="w-4 h-4 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm text-ink">Thông báo đẩy</h3>
            <p className="text-[11px] text-ink/40">Nhận tin tức, bài tập &amp; lời mời</p>
          </div>
          {pushSupport.permission === "granted" ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
              <BellRing className="w-3 h-3" /> Đã bật
            </span>
          ) : pushSupport.permission === "denied" ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
              <BellOff className="w-3 h-3" /> Bị chặn
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
              <TriangleAlert className="w-3 h-3" /> Chưa bật
            </span>
          )}
        </div>

        {/* Trạng thái chi tiết */}
        <div className="rounded-lg p-3 mb-3 text-xs" style={{ background: "var(--bg)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Info className="w-3.5 h-3.5 text-ink/40" />
            <span className="font-semibold text-ink">Trạng thái</span>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${pushSupport.supported ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {pushSupport.supported ? "Hỗ trợ" : "Không hỗ trợ"}
            </span>
          </div>
          {!pushSupport.supported ? (
            <p className="text-ink/60">{pushSupport.message}</p>
          ) : (
            <p className="text-ink/60">
              Quyền hiện tại: <b>{pushSupport.permission === "granted" ? "Đã cấp" : pushSupport.permission === "denied" ? "Bị từ chối" : "Chưa hỏi"}</b>
              {isIOS && !isInstalled && <span className="block mt-1 text-amber-600">iOS cần cài PWA vào Màn hình chính trước mới nhận được push.</span>}
            </p>
          )}
          {typeof Notification !== "undefined" && Notification.permission === "denied" && (
            <p className="mt-1.5 text-red-500 font-medium">Bạn đã chặn thông báo. Mở Cài đặt trình duyệt → Quyền → Thông báo → Cho phép.</p>
          )}
        </div>

        {/* Message box */}
        {pushMessage && (
          <div className="rounded-lg px-3 py-2 mb-3 text-xs font-medium border bg-amber-50 border-amber-200 text-amber-800">
            {pushMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleEnablePush}
            disabled={pushLoading || pushSupport.permission === "denied"}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold text-white disabled:opacity-50 transition active:scale-[0.98]"
            style={{ background: pushSupport.permission === "granted" ? "#10b981" : "var(--accent)" }}
          >
            {pushLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BellRing className="w-3.5 h-3.5" />}
            {pushSupport.permission === "granted" ? "Đã bật" : "Bật thông báo"}
          </button>
          <button
            onClick={handleTestPush}
            disabled={testingPush || pushSupport.permission !== "granted"}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border bg-white hover:bg-ink/5 transition disabled:opacity-40 active:scale-[0.98]"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            {testingPush ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Gửi thử
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleResetDevices}
            disabled={pushLoading}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-semibold text-ink/60 hover:text-ink hover:bg-ink/5 transition disabled:opacity-40"
          >
            <IconTrash className="w-3 h-3" /> Reset thiết bị
          </button>
          <button
            onClick={() => setPushSupport(getPushSupportStatus())}
            className="px-3 py-2 rounded-lg text-[11px] font-semibold text-ink/60 hover:text-ink hover:bg-ink/5 transition"
          >
            <RefreshCw className="w-3 h-3 inline mr-1" /> Làm mới
          </button>
        </div>
        <p className="text-[11px] text-ink/30 text-center mt-2">Thông báo chạy qua Firebase Cloud Messaging. Hoạt động cả khi app đóng (SW).</p>
      </div>
    </section>
    </>
  );
}

export function GameRow({ game }) {
  const lv = getLevelProgress(game.experience || 0);
  const progress = Math.min(100, game.progress || 0);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink/3 transition">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ background: "var(--bg)" }}>
        <Target className="w-5 h-5 text-ink/45" />
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
            <div className="h-full rounded-full" style={{ width: progress + "%", background: "var(--accent)" }} />
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
