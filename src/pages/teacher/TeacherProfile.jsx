import { useCallback, useEffect, useState } from 'react'
import { authService, statsService, userService, walletService } from '../../services/api.js'
import {
  ErrorState, GhostButton, IconCalendar, IconChart, IconCheckCircle, IconEdit,
  IconLogout, IconUser, Loader, ManagementHeader, PasswordInput, PrimaryButton,
} from '../../components/ui'
import { navigate } from '../../lib/router.js'
import { getRoleLabel } from '../../config/roles.js'
import { AtSign, Coins, Gamepad2, KeyRound, Save, Shield, Target, TrendingUp, Trophy } from 'lucide-react'

const labelCls = 'text-[11px] leading-tight block mb-1 text-[#8A7C63]'
const boxCls = 'w-full rounded-lg border border-ink/15 px-3 py-2 bg-white text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'
const mutedStyle = { color: '#8A7C63' }

function initialsOf(name) {
  const parts = String(name || '?').trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?'
}

function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN')
}

/** Nhãn 7 ngày trong tuần cho biểu đồ hoạt động (CN → T7). */
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

/**
 * Hồ sơ quản trị — trang tài khoản của người đang đăng nhập.
 *
 * Gồm 4 phần đúng mục đích "profile":
 *   1. Danh tính: avatar chữ cái, tên, vai trò, email, tên đăng nhập, ngày tham gia
 *   2. Thông tin tài khoản (sửa tên/email)
 *   3. Bảo mật (đổi mật khẩu thật qua /auth/change-password)
 *   4. Hoạt động cá nhân: số liệu, biểu đồ 7 ngày, học sinh nổi bật
 */
export default function TeacherProfile({ user, onLogout, showToast }) {
  const [me, setMe] = useState(user || {})
  const [stats, setStats] = useState(null)
  const [coinData, setCoinData] = useState(null)
  const [error, setError] = useState(null)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })

  const [pw, setPw] = useState({ current: '', next: '', again: '' })
  const [pwBusy, setPwBusy] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const load = useCallback(() => {
    setStats(null); setCoinData(null); setError(null)
    Promise.all([statsService.get(), walletService.get()])
      .then(([s, c]) => { setStats(s); setCoinData(c) })
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => { load() }, [load])

  /* Header chỉ truyền user một lần; vẫn đồng bộ khi App đăng nhập lại / đổi hồ sơ. */
  useEffect(() => { if (user) setMe(prev => ({ ...prev, ...user })) }, [user])

  const startEdit = () => {
    setForm({ name: me?.name || '', email: me?.email || '' })
    setEditing(true)
  }

  const saveInfo = async () => {
    setSaving(true)
    try {
      const payload = {}
      if (form.name && form.name !== me?.name) payload.name = form.name
      if (form.email !== (me?.email || '')) payload.email = form.email
      if (Object.keys(payload).length === 0) { setEditing(false); return }
      const updated = await userService.updateProfile(payload)
      setMe(prev => ({ ...prev, ...updated }))
      const auth = JSON.parse(localStorage.getItem('edu_games_auth') || '{}')
      if (auth?.user) {
        auth.user = { ...auth.user, ...updated }
        localStorage.setItem('edu_games_auth', JSON.stringify(auth))
      }
      showToast('Đã cập nhật hồ sơ', 'success')
      setEditing(false)
    } catch (e) {
      showToast(e.message || 'Lỗi cập nhật hồ sơ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async () => {
    setPwMsg(null)
    if (!pw.current) { setPwMsg({ type: 'er', text: 'Hãy nhập mật khẩu hiện tại.' }); return }
    if (pw.next.length < 6) { setPwMsg({ type: 'er', text: 'Mật khẩu mới cần ít nhất 6 ký tự.' }); return }
    if (pw.next !== pw.again) { setPwMsg({ type: 'er', text: 'Mật khẩu nhập lại chưa khớp.' }); return }
    if (pw.next === pw.current) { setPwMsg({ type: 'er', text: 'Mật khẩu mới cần khác mật khẩu hiện tại.' }); return }
    setPwBusy(true)
    try {
      await authService.changePassword(pw.current, pw.next)
      setPw({ current: '', next: '', again: '' })
      setPwMsg({ type: 'ok', text: 'Đã đổi mật khẩu. Các thiết bị khác phải đăng nhập lại.' })
      showToast('Đã đổi mật khẩu')
    } catch (e) {
      setPwMsg({ type: 'er', text: e.message || 'Không đổi được mật khẩu.' })
    } finally {
      setPwBusy(false)
    }
  }

  const t = stats?.totals || {}
  const coins = coinData?.coins ?? 0
  const activity = stats?.activity || []
  const maxActivity = Math.max(1, ...activity.map(d => d.count))
  const topPlayers = stats?.topPlayers || []

  const statItems = [
    { label: 'Trò chơi', value: t.games ?? 0, Icon: Gamepad2 },
    { label: 'Đã xuất bản', value: t.published ?? 0, Icon: IconCheckCircle },
    { label: 'Bản nháp', value: t.drafts ?? 0, Icon: IconEdit },
    { label: 'Lượt chơi', value: t.plays ?? 0, Icon: TrendingUp },
    { label: 'Học sinh', value: t.players ?? 0, Icon: IconUser },
    { label: 'Điểm TB', value: t.avgScore ?? 0, Icon: Target },
    { label: 'Chính xác TB', value: `${t.avgAccuracy ?? 0}%`, Icon: IconChart },
    { label: 'Xu', value: coins, Icon: Coins },
  ]

  const infoRows = [
    ['Họ tên', me?.name],
    ['Email', me?.email],
    ['Tên đăng nhập', me?.username ? `@${me.username}` : ''],
    ['Vai trò', me?.role ? getRoleLabel(me.role) : ''],
    ['Ngày tham gia', me?.createdAt ? fmtDate(me.createdAt) : ''],
  ]

  return (
    <div className="space-y-4">
      <ManagementHeader
        title="Hồ sơ"
        subtitle="Tài khoản quản trị đang đăng nhập, bảo mật và hoạt động của bạn."
      >
        <GhostButton onClick={() => navigate('/admin')}>Về dashboard</GhostButton>
      </ManagementHeader>

      {error && <ErrorState subtitle="Không thể tải dữ liệu" onRetry={load} />}
      {!error && !stats && <Loader label="Đang tải..." />}

      {!error && stats && (
        <>
          {/* ── 1. Danh tính ─────────────────────────────────────── */}
          <section className="note-card p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full grid place-items-center shrink-0 text-white text-2xl font-semibold"
                style={{ background: 'var(--edu-blue, #2271b1)' }}
              >
                {initialsOf(me?.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h2 className="m-0 text-lg sm:text-xl font-semibold" style={{ color: 'var(--edu-text)' }}>
                    {me?.name || 'Quản trị viên'}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{ background: '#f0f6fc', color: '#135e96' }}
                  >
                    <Shield className="w-3 h-3" /> {me?.role ? getRoleLabel(me.role) : '—'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: '#00a32a' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00a32a' }} />
                    Đang hoạt động
                  </span>
                </div>

                <p className="mt-1 text-[13px] break-all" style={mutedStyle}>
                  {me?.email || 'Chưa có email'}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: '#8c8f94' }}>
                  {me?.username && (
                    <span className="inline-flex items-center gap-1"><AtSign className="w-3 h-3" /> {me.username}</span>
                  )}
                  {me?.createdAt && (
                    <span className="inline-flex items-center gap-1">
                      <IconCalendar className="w-3 h-3" /> Tham gia {fmtDate(me.createdAt)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1"><Coins className="w-3 h-3" /> {coins} xu</span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <PrimaryButton onClick={startEdit} className="flex-1 sm:flex-none">
                  <IconEdit className="w-3.5 h-3.5 inline mr-1" /> Chỉnh sửa
                </PrimaryButton>
                <GhostButton onClick={onLogout} className="flex-1 sm:flex-none !border-red-300 !text-red-600 hover:!bg-red-50">
                  <IconLogout className="w-3.5 h-3.5 inline mr-1" /> Đăng xuất
                </GhostButton>
              </div>
            </div>
          </section>

          {/* ── 2 + 3. Tài khoản & Bảo mật ───────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <section className="note-card p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h2 className="m-0 text-[15px] font-semibold" style={{ color: 'var(--edu-text)' }}>Thông tin tài khoản</h2>
                {!editing && (
                  <button onClick={startEdit} className="text-[13px] hover:underline" style={{ color: 'var(--edu-blue)' }}>
                    Sửa
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-3 mt-3">
                  <label className="block">
                    <span className={labelCls}>Họ tên</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className={boxCls}
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className={boxCls}
                    />
                  </label>
                  <div className="flex gap-2 pt-1">
                    <PrimaryButton onClick={saveInfo} disabled={saving}>
                      {saving ? 'Đang lưu...' : <><Save className="w-3.5 h-3.5 inline mr-1" /> Lưu thay đổi</>}
                    </PrimaryButton>
                    <GhostButton onClick={() => setEditing(false)} disabled={saving}>Hủy</GhostButton>
                  </div>
                </div>
              ) : (
                <dl className="text-[13px] mt-1">
                  {infoRows.map(([k, v], i) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-3 py-2"
                      style={i ? { borderTop: '1px solid var(--edu-line)' } : undefined}
                    >
                      <dt style={mutedStyle}>{k}</dt>
                      <dd className="text-right font-medium break-all" style={{ color: 'var(--edu-text)' }}>
                        {v || '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>

            <section className="note-card p-4">
              <h2 className="m-0 text-[15px] font-semibold" style={{ color: 'var(--edu-text)' }}>Bảo mật</h2>
              <p className="text-[11px] leading-snug mt-0.5 mb-3" style={mutedStyle}>
                Đổi mật khẩu đăng nhập. Các thiết bị khác sẽ phải đăng nhập lại, máy này giữ nguyên phiên.
              </p>

              <div className="space-y-3">
                <label className="block">
                  <span className={labelCls}>Mật khẩu hiện tại</span>
                  <PasswordInput
                    value={pw.current}
                    onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                    fieldClass={boxCls}
                    autoComplete="current-password"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Mật khẩu mới (ít nhất 6 ký tự)</span>
                  <PasswordInput
                    value={pw.next}
                    onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                    fieldClass={boxCls}
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Nhập lại mật khẩu mới</span>
                  <PasswordInput
                    value={pw.again}
                    onChange={e => setPw(p => ({ ...p, again: e.target.value }))}
                    fieldClass={boxCls}
                    autoComplete="new-password"
                  />
                </label>
              </div>

              {pwMsg && (
                <p className="text-[13px] mt-2" style={{ color: pwMsg.type === 'ok' ? '#00a32a' : '#d63638' }}>
                  {pwMsg.text}
                </p>
              )}

              <div className="flex gap-2 pt-3">
                <PrimaryButton onClick={savePassword} disabled={pwBusy}>
                  {pwBusy ? 'Đang đổi...' : <><KeyRound className="w-3.5 h-3.5 inline mr-1" /> Đổi mật khẩu</>}
                </PrimaryButton>
                <GhostButton
                  onClick={() => { setPw({ current: '', next: '', again: '' }); setPwMsg(null) }}
                  disabled={pwBusy}
                >
                  Xóa form
                </GhostButton>
              </div>
            </section>
          </div>

          {/* ── 4. Hoạt động cá nhân ─────────────────────────────── */}
          <section className="note-card p-4">
            <h2 className="m-0 text-[15px] font-semibold" style={{ color: 'var(--edu-text)' }}>Hoạt động của bạn</h2>
            <p className="text-[11px] leading-snug mt-0.5 mb-3" style={mutedStyle}>
              Tổng hợp từ các trò chơi và lớp học bạn đang quản lý.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
              {statItems.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-8 h-8 rounded-md grid place-items-center shrink-0"
                    style={{ background: '#f0f6fc', color: '#2271b1' }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold leading-tight" style={{ color: 'var(--edu-text)' }}>
                      {value}
                    </div>
                    <div className="text-[11px] leading-tight truncate" style={mutedStyle}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <section className="note-card p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="m-0 text-[15px] font-semibold" style={{ color: 'var(--edu-text)' }}>Hoạt động 7 ngày</h2>
                <span className="text-[11px]" style={mutedStyle}>Lượt chơi theo ngày</span>
              </div>

              {activity.some(d => d.count > 0) ? (
                <div className="flex items-end justify-between gap-1 h-28">
                  {activity.map(d => {
                    const h = d.count ? Math.max(6, Math.round((d.count / maxActivity) * 100)) : 3
                    const date = new Date(`${d.date}T00:00:00`)
                    return (
                      <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <span className="text-[9px] font-mono" style={mutedStyle}>{d.count || ''}</span>
                        <div
                          className="w-full max-w-8 rounded-t-sm"
                          style={{ height: `${h}px`, background: d.count ? '#2271b1' : '#dcdcde' }}
                          title={`${d.count} lượt`}
                        />
                        <span className="text-[9px] font-mono" style={mutedStyle}>{WEEKDAYS[date.getDay()]}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="edu-empty">Chưa có lượt chơi nào trong 7 ngày qua.</p>
              )}
            </section>

            <section className="note-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4" style={{ color: '#dba617' }} />
                <h2 className="m-0 text-[15px] font-semibold" style={{ color: 'var(--edu-text)' }}>Học sinh nổi bật</h2>
              </div>

              {topPlayers.length ? (
                <div>
                  {topPlayers.slice(0, 5).map((p, i) => (
                    <div
                      key={`${p.name}-${i}`}
                      className="flex items-center gap-3 py-2"
                      style={i ? { borderTop: '1px solid var(--edu-line)' } : undefined}
                    >
                      <span className="w-5 text-center shrink-0 text-[12px] font-mono" style={mutedStyle}>{i + 1}</span>
                      <span className="flex-1 min-w-0 text-[13px] truncate" style={{ color: 'var(--edu-text)' }}>{p.name}</span>
                      <span className="text-[10px] font-mono whitespace-nowrap" style={mutedStyle}>
                        {p.games} trận · {p.accuracy}%
                      </span>
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--edu-text)' }}>{p.score}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="edu-empty">Chưa có học sinh nào chơi game của bạn.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}
