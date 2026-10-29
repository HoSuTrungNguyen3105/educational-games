import { useCallback, useEffect, useState } from 'react'
import { authService } from '../../services/api.js'
import { getRoleLabel } from '../../config/roles.js'
import { gameCache } from '../../lib/gameCache.js'
import { ManagementHeader, PrimaryButton, GhostButton, PasswordInput } from '../../components/ui'

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-3 py-2 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'

function fmtB(n) {
  const v = Number(n) || 0
  if (v < 1024) return `${v} B`
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`
  return `${(v / 1024 / 1024).toFixed(2)} MB`
}

function Card({ title, hint, children }) {
  return (
    <section className="note-card p-4">
      <h2 className="font-display text-base text-ink">{title}</h2>
      {hint && <p className="text-[11px] text-[#8A7C63] mt-0.5 mb-3 leading-snug">{hint}</p>}
      {children}
    </section>
  )
}

/**
 * Trang Cài đặt của khu quản trị.
 *
 * Trang này thay mục "Mã PIN" của tool admin cũ (_tools/admin.html) bằng ĐỔI
 * MẬT KHẨU THẬT: tool cũ chỉ lưu hash SHA-256 trong localStorage một trình
 * duyệt — xóa cache là mất khóa, không áp dụng cho các máy khác. Ở đây mật khẩu
 * đi qua /api/auth/change-password (bcrypt trong MongoDB), server thu hồi mọi
 * phiên khác rồi cấp lại cookie cho phiên đang dùng.
 */
export default function AdminSettings({ user, showToast }) {
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [msg, setMsg] = useState(null)   // { type: 'ok' | 'er', text }
  const [busy, setBusy] = useState(false)
  const [local, setLocal] = useState(null)

  const readLocal = useCallback(async () => {
    let bytes = 0, keys = 0
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (!k) continue
        keys++
        bytes += (k.length + (window.localStorage.getItem(k) || '').length) * 2
      }
    } catch { keys = null }
    let cache = null
    try {
      const list = await gameCache.list()
      cache = { count: list.length, size: list.reduce((a, r) => a + (r.size || 0), 0) }
    } catch { /* IndexedDB bị chặn (chế độ ẩn danh) — bỏ qua, vẫn hiện localStorage */ }
    setLocal({ keys, bytes, cache })
  }, [])

  useEffect(() => { readLocal() }, [readLocal])

  const submit = async () => {
    setMsg(null)
    if (!cur) { setMsg({ type: 'er', text: 'Hãy nhập mật khẩu hiện tại.' }); return }
    if (next.length < 6) { setMsg({ type: 'er', text: 'Mật khẩu mới cần ít nhất 6 ký tự.' }); return }
    if (next !== again) { setMsg({ type: 'er', text: 'Mật khẩu nhập lại chưa khớp.' }); return }
    if (next === cur) { setMsg({ type: 'er', text: 'Mật khẩu mới cần khác mật khẩu hiện tại.' }); return }
    setBusy(true)
    try {
      await authService.changePassword(cur, next)
      setCur(''); setNext(''); setAgain('')
      setMsg({ type: 'ok', text: 'Đã đổi mật khẩu. Các máy khác phải đăng nhập lại; máy này vẫn dùng bình thường.' })
      showToast?.('Đã đổi mật khẩu')
    } catch (e) {
      setMsg({ type: 'er', text: e.message || 'Không đổi được mật khẩu.' })
    } finally { setBusy(false) }
  }

  const clearCache = async () => {
    try {
      await gameCache.clear()
      await readLocal()
      showToast?.('Đã xóa bộ nhớ đệm game đã tải')
    } catch (e) { showToast?.(e.message || 'Không xóa được cache', 'error') }
  }

  return (
    <div className="space-y-4">
      <ManagementHeader
        title="Cài đặt"
        subtitle="Mật khẩu quản trị, tài khoản đang dùng và dữ liệu game trên máy này."
      />

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <Card title="🔐 Đổi mật khẩu"
          hint="Đổi xong, mọi thiết bị đang đăng nhập bằng tài khoản này bị xuất trừ máy hiện tại (server thu hồi token cũ).">
          <div className="space-y-3">
            <label>
              <span className={label}>Mật khẩu hiện tại</span>
              <PasswordInput value={cur} onChange={(e) => setCur(e.target.value)} fieldClass={box} autoComplete="current-password" />
            </label>
            <label>
              <span className={label}>Mật khẩu mới (ít nhất 6 ký tự)</span>
              <PasswordInput value={next} onChange={(e) => setNext(e.target.value)} fieldClass={box} autoComplete="new-password" />
            </label>
            <label>
              <span className={label}>Nhập lại mật khẩu mới</span>
              <PasswordInput value={again} onChange={(e) => setAgain(e.target.value)} fieldClass={box} autoComplete="new-password" />
            </label>
            {msg && (
              <p className={`text-sm ${msg.type === 'ok' ? 'text-teal' : 'text-ticket'}`}>{msg.text}</p>
            )}
            <div className="flex gap-2">
              <PrimaryButton onClick={submit} disabled={busy} className="!px-4 !py-2 text-sm rounded-lg">
                {busy ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </PrimaryButton>
              <GhostButton onClick={() => { setCur(''); setNext(''); setAgain(''); setMsg(null) }}
                className="!px-4 !py-2 text-sm rounded-lg">Xóa form</GhostButton>
            </div>
          </div>
        </Card>

        <Card title="🪪 Tài khoản quản trị">
          <dl className="text-sm divide-y divide-ink/10">
            {[
              ['Họ tên', user?.name],
              ['Tên đăng nhập', user?.username],
              ['Email', user?.email || '—'],
              ['Quyền', user?.role ? getRoleLabel(user.role) : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 py-1.5">
                <dt className="text-[#8A7C63]">{k}</dt>
                <dd className="text-ink font-medium text-right break-all">{v || '—'}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[11px] text-[#B7A987] mt-3 leading-snug">
            Hồ sơ cá nhân (avatar, sở thích) sửa ở mục <b>Hồ sơ</b>; phân quyền thành viên ở <b>Phân quyền</b>.
          </p>
        </Card>

        <Card title="💾 Dữ liệu game trên máy này"
          hint="Tiến độ chơi và cache game đã tải nằm trong trình duyệt. Xóa cache không ảnh hưởng tiến độ đã đồng bộ lên máy chủ.">
          {!local ? (
            <p className="text-sm text-[#8A7C63]">Đang đo dung lượng…</p>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[#8A7C63]">localStorage ({local.keys === null ? 'không đọc được' : `${local.keys} khóa`})</span>
                <span className="font-mono text-ink">{local.keys === null ? '—' : fmtB(local.bytes)} / ~5 MB</span>
              </div>
              {local.keys !== null && (
                <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full bg-teal/60" style={{ width: `${Math.min(100, (local.bytes / 5242880) * 100).toFixed(1)}%` }} />
                </div>
              )}
              <div className="flex items-baseline justify-between gap-3 pt-1">
                <span className="text-[#8A7C63]">Cache game đã tải ({local.cache ? `${local.cache.count} bản` : '—'})</span>
                <span className="font-mono text-ink">{local.cache ? fmtB(local.cache.size) : '—'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <GhostButton onClick={readLocal} className="!px-4 !py-2 text-sm rounded-lg">Đo lại</GhostButton>
                <button onClick={clearCache} disabled={!local.cache?.count}
                  className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-display font-semibold hover:bg-red-50 disabled:opacity-40 transition">
                  Xóa bộ nhớ đệm game
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
