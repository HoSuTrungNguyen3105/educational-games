import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, Database, HardDrive, History, RefreshCw, Search, ShieldCheck,
  SlidersHorizontal, Trash2, TriangleAlert, Loader2, CheckCircle2, XCircle, MinusCircle,
  Sparkles,
} from 'lucide-react'
import { authService, systemService } from '../../services/api.js'
import { loadSiteConfig } from '../../lib/siteConfig.js'
import { invalidateAiAvailability } from '../../hooks/useAiAvailability.js'
import { getRoleLabel, hasUserPermission } from '../../config/roles.js'
import { gameCache } from '../../lib/gameCache.js'
import {
  ManagementHeader, PrimaryButton, GhostButton, PasswordInput, ConfirmModal,
  ToggleSwitch, Input, Select, EmptyState,
} from '../../components/ui'

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-3 py-2 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'

function fmtB(n) {
  const v = Number(n) || 0
  if (v < 1024) return `${v} B`
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`
  return `${(v / 1024 / 1024).toFixed(2)} MB`
}

/** "2026-11-01T09:12:00.000Z" → "09:12 01/11" (giờ máy người xem). */
function fmtTime(iso, withDate = true) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  if (!withDate) return `${hh}:${mm}`
  return `${hh}:${mm} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** User-Agent → nhãn thiết bị ngắn cho danh sách phiên. */
function deviceName(ua) {
  const s = String(ua || '')
  if (!s) return 'Không rõ thiết bị'
  const ios = /iPhone|iPad|iPod/i.test(s)
  const android = /Android/i.test(s)
  const win = /Windows/i.test(s)
  const mac = /Macintosh|Mac OS X/i.test(s)
  const linux = /Linux/i.test(s)
  const os = ios ? 'iPhone/iPad' : android ? 'Android' : win ? 'Windows' : mac ? 'macOS' : linux ? 'Linux' : 'Khác'
  const br = /Edg\//.test(s) ? 'Edge' : /OPR\//.test(s) ? 'Opera' : /Chrome\//.test(s) ? 'Chrome'
    : /Firefox\//.test(s) ? 'Firefox' : /Safari\//.test(s) ? 'Safari' : 'Trình duyệt'
  return `${br} trên ${os}`
}

/* ── khối trình bày dùng chung trong trang ─────────────────────────────── */

function Card({ id, title, hint, icon: Icon, actions, children, className = '' }) {
  return (
    <section id={id} className={`note-card p-4 scroll-mt-24 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="font-display text-base text-ink flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#8A7C63]" aria-hidden="true" />}
          {title}
        </h2>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
      {hint && <p className="text-[11px] text-[#8A7C63] mb-3 leading-snug">{hint}</p>}
      {children}
    </section>
  )
}

/** Trạng thái có màu + biểu tượng: ok / warn / error / loading / idle. */
function Pill({ state = 'idle', children }) {
  const map = {
    ok: { cls: 'bg-teal/15 text-teal border-teal/30', Ico: CheckCircle2 },
    warn: { cls: 'bg-gold/20 text-[#8a6a10] border-gold/40', Ico: TriangleAlert },
    error: { cls: 'bg-ticket/12 text-ticket border-ticket/30', Ico: XCircle },
    loading: { cls: 'bg-ink/8 text-[#8A7C63] border-ink/15', Ico: Loader2 },
    idle: { cls: 'bg-ink/6 text-[#8A7C63] border-ink/15', Ico: MinusCircle },
  }
  const s = map[state] || map.idle
  const Ico = s.Ico
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md border ${s.cls} ${state === 'loading' ? 'animate-pulse' : ''}`}>
      <Ico className={`w-3.5 h-3.5 ${state === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true" />
      {children}
    </span>
  )
}

function Row({ k, v, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-[#8A7C63]">{k}</span>
      <span className={`text-ink font-medium text-right break-all ${mono ? 'font-mono text-[13px]' : ''}`}>{v ?? '—'}</span>
    </div>
  )
}

/** Ô số liệu nhỏ (không dùng StatCard để tránh thêm StampToken trang trí). */
function Metric({ value, label: l, hint }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/60 px-3 py-2.5">
      <div className="font-display text-lg text-ink leading-none">{value}</div>
      <div className="text-[11px] text-[#8A7C63] mt-1 leading-tight">{l}</div>
      {hint && <div className="text-[10px] text-[#B7A987] mt-0.5">{hint}</div>}
    </div>
  )
}

/** Nhãn tiếng Việt cho hành động trong nhật ký. */
const ACTION_LABELS = {
  'auth.login': 'Đăng nhập',
  'auth.login_fail': 'Đăng nhập thất bại',
  'auth.logout': 'Đăng xuất',
  'auth.register': 'Tạo tài khoản (đăng ký)',
  'auth.password_change': 'Đổi mật khẩu',
  'auth.sessions_revoke': 'Thu hồi phiên đăng nhập',
  'template.create': 'Tạo game',
  'template.update': 'Sửa game',
  'template.delete': 'Xóa game',
  'template.delete_all': 'Xóa toàn bộ game',
  'game.create': 'Tạo trò chơi',
  'game.update': 'Sửa trò chơi',
  'game.delete': 'Xóa trò chơi',
  'user.create': 'Tạo người dùng',
  'user.update': 'Sửa người dùng',
  'user.role': 'Đổi vai trò người dùng',
  'user.delete': 'Xóa người dùng',
  'user.reset_password': 'Đặt lại mật khẩu người dùng',
  'role.create': 'Tạo vai trò',
  'role.update': 'Sửa vai trò / quyền',
  'role.delete': 'Xóa vai trò',
  'role.all_permissions': 'Đồng bộ quyền toàn truy cập',
  'config.update': 'Đổi cấu hình hệ thống',
  'data.seed': 'Chạy seed dữ liệu',
  'game_config.write': 'Lưu cấu hình game',
  'game_config.delete': 'Xóa cấu hình game',
  'support.update': 'Cập phiếu hỗ trợ',
  'system.scan': 'Quét dữ liệu game',
}
const actionLabel = (a) => ACTION_LABELS[a] || a

const GROUPS = [
  { id: 'sec-account', label: 'Tài khoản' },
  { id: 'sec-security', label: 'Bảo mật' },
  { id: 'sec-system', label: 'Hệ thống' },
  { id: 'sec-ai', label: 'Trợ lý AI' },
  { id: 'sec-storage', label: 'Lưu trữ' },
  { id: 'sec-scan', label: 'Kiểm tra game' },
  { id: 'sec-notify', label: 'Thông báo' },
  { id: 'sec-config', label: 'Cấu hình chung' },
  { id: 'sec-local', label: 'Dữ liệu cục bộ' },
  { id: 'sec-logs', label: 'Nhật ký' },
]

/**
 * Trang Cài đặt của khu quản trị.
 *
 * Giữ nguyên các chức năng nền tảng của bản trước (đổi mật khẩu thật qua
 * /api/auth/change-password, thông tin tài khoản, đo LocalStorage + cache game)
 * và bổ sung các khu theo update_admin_page.md: tình trạng hệ thống, thống kê
 * lưu trữ, quét URL HTML/thumbnail, phiên đăng nhập, cấu hình chung, thông báo
 * và nhật ký thao tác.
 *
 * Mọi số liệu đều lấy từ API thật (/api/system/*) — không có số liệu mẫu. Khu
 * quản trị chỉ hiện với tài khoản có quyền settings.view / settings.edit; server
 * cũng kiểm tra lại quyền đó ở từng endpoint (middleware/permission.js).
 */
export default function AdminSettings({ user, showToast }) {
  const canView = hasUserPermission(user, 'settings.view')
  const canEdit = hasUserPermission(user, 'settings.edit')

  /* ── 1. Đổi mật khẩu (giữ nguyên) ─────────────────────────────────────── */
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  /* ── 8. Dữ liệu cục bộ (giữ nguyên) ───────────────────────────────────── */
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
      loadSessions()
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

  /* ── 3. Tình trạng hệ thống ───────────────────────────────────────────── */
  const [status, setStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [statusError, setStatusError] = useState(null)

  const loadStatus = useCallback(async (refresh = false) => {
    setStatusLoading(true); setStatusError(null)
    try {
      setStatus(await systemService.status(refresh))
      if (refresh) showToast?.('Đã kiểm tra tình trạng hệ thống')
    } catch (e) {
      setStatusError(e.message || 'Không kiểm tra được')
      if (refresh) showToast?.(e.message || 'Kiểm tra thất bại', 'error')
    } finally { setStatusLoading(false) }
  }, [showToast])

  /* ── 4. Lưu trữ game ──────────────────────────────────────────────────── */
  const [storage, setStorage] = useState(null)
  const [storageLoading, setStorageLoading] = useState(false)
  const [storageError, setStorageError] = useState(null)

  const loadStorage = useCallback(async () => {
    setStorageLoading(true); setStorageError(null)
    try {
      setStorage(await systemService.storage())
    } catch (e) {
      setStorageError(e.message || 'Không đọc được số liệu lưu trữ')
    } finally { setStorageLoading(false) }
  }, [])

  useEffect(() => {
    if (!canView) return
    loadStatus(false)
    loadStorage()
  }, [canView, loadStatus, loadStorage])

  /* ── 2. Phiên đăng nhập ───────────────────────────────────────────────── */
  const [sessions, setSessions] = useState(null)
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [confirmLogoutAll, setConfirmLogoutAll] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true)
    try {
      setSessions(await authService.sessions())
    } catch (e) {
      // 403/401 cũng bình thường ở đây — khu này chỉ là thông tin bổ trợ.
      setSessions({ items: [], total: 0, error: e.message })
    } finally { setSessionsLoading(false) }
  }, [])

  useEffect(() => { loadSessions() }, [loadSessions])

  const revokeOthers = async () => {
    setRevoking(true)
    try {
      const r = await authService.revokeSessions(true)
      showToast?.(`Đã đăng xuất ${r?.revoked ?? 0} thiết bị khác`)
      await loadSessions()
      await loadLogs(logPage)
    } catch (e) {
      showToast?.(e.message || 'Không thu hồi được phiên', 'error')
    } finally {
      setRevoking(false)
      setConfirmLogoutAll(false)
    }
  }

  /* ── 5. Quét URL game ─────────────────────────────────────────────────── */
  const [scan, setScan] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState(null)

  const runScan = useCallback(async (page = 1, force = false) => {
    setScanning(true); setScanError(null)
    try {
      const r = await systemService.scan({ page, perPage: 20, force })
      setScan(r)
      if (r?.cached) showToast?.('Còn chờ giữa 2 lần quét — đang hiện kết quả gần nhất')
    } catch (e) {
      setScanError(e.message || 'Quét thất bại')
      showToast?.(e.message || 'Quét thất bại', 'error')
    } finally { setScanning(false) }
  }, [showToast])

  /* ── 6/7. Cấu hình + thông báo ────────────────────────────────────────── */
  const [cfg, setCfg] = useState(null)
  const [cfgLoading, setCfgLoading] = useState(false)
  const [cfgSaving, setCfgSaving] = useState(false)
  const [cfgError, setCfgError] = useState(null)
  const logoFileRef = useRef(null)
  const faviconFileRef = useRef(null)

  const loadConfig = useCallback(async () => {
    setCfgLoading(true); setCfgError(null)
    try {
      setCfg(await systemService.getConfig())
    } catch (e) {
      setCfgError(e.message || 'Không đọc được cấu hình')
    } finally { setCfgLoading(false) }
  }, [])

  useEffect(() => { if (canView) loadConfig() }, [canView, loadConfig])

  const patchCfg = (fn) => setCfg((c) => (c ? fn(structuredClone(c)) : c))

  const saveConfig = async (patch) => {
    setCfgSaving(true)
    try {
      const r = await systemService.saveConfig(patch)
      setCfg(r.config)
      showToast?.(r.changed?.length ? 'Đã lưu cấu hình' : 'Không có thay đổi để lưu')
      // Tên trang / logo / favicon / banner bảo trì có hiệu lực ngay trên toàn app.
      await loadSiteConfig({ force: true })
      await loadLogs(logPage)
      return true
    } catch (e) {
      showToast?.(e.message || 'Không lưu được cấu hình', 'error')
      return false
    } finally { setCfgSaving(false) }
  }

  /**
   * Bật/tắt Trợ lý AI. Server giữ cờ này ở system_config (ai.enabled) nên mọi thiết bị
   * dùng chung; TẮT là mọi tính năng AI báo "đang được cấu hình, chưa sử dụng được".
   */
  const saveAi = async () => {
    // Chỉ gửi đúng khoá đã whitelist — server bỏ qua field lạ, ở đây chốt kiểu boolean.
    const ok = await saveConfig({ ai: { enabled: Boolean(cfg?.ai?.enabled) } })
    if (ok) {
      // Widget AI cache 30 giây — xoá cache để trang đổi trạng thái ngay sau khi bật.
      invalidateAiAvailability()
      loadStatus(true)
    }
    return ok
  }

  /** Chọn ảnh từ máy → data-URL; server đổi thành link Supabase khi lưu. */
  const pickImage = (file, apply) => {
    if (!file) return
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/i.test(file.type)) {
      showToast?.('Chỉ nhận ảnh PNG/JPG/WebP/GIF', 'error'); return
    }
    if (file.size > 1024 * 1024) {
      showToast?.('Ảnh quá lớn, tối đa 1 MB', 'error'); return
    }
    const fr = new FileReader()
    fr.onload = () => apply(String(fr.result))
    fr.onerror = () => showToast?.('Không đọc được ảnh', 'error')
    fr.readAsDataURL(file)
  }

  /* ── 9. Nhật ký hoạt động ─────────────────────────────────────────────── */
  const [logs, setLogs] = useState(null)
  const [logLoading, setLogLoading] = useState(false)
  const [logPage, setLogPage] = useState(1)
  const [logKeyword, setLogKeyword] = useState('')
  const [logAction, setLogAction] = useState('all')
  const [logFrom, setLogFrom] = useState('')
  const [logTo, setLogTo] = useState('')

  const loadLogs = useCallback(async (page = 1, filters = null) => {
    setLogLoading(true)
    try {
      const f = filters || { keyword: logKeyword, action: logAction, from: logFrom, to: logTo }
      const r = await systemService.logs({ page, perPage: 15, ...f })
      setLogs(r)
      setLogPage(page)
    } catch (e) {
      showToast?.(e.message || 'Không đọc được nhật ký', 'error')
    } finally { setLogLoading(false) }
  }, [logKeyword, logAction, logFrom, logTo, showToast])

  useEffect(() => { if (canView) loadLogs(1) }, [canView]) // eslint-disable-line react-hooks/exhaustive-deps

  const logActionOptions = useMemo(
    () => [{ value: 'all', label: 'Mọi hành động' }, ...Object.entries(ACTION_LABELS).map(([v, l]) => ({ value: v, label: l }))],
    [],
  )

  /* ── điều hướng nhanh ─────────────────────────────────────────────────── */
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const visibleGroups = GROUPS.filter((g) => {
    if (canView) return true
    return ['sec-account', 'sec-security', 'sec-local'].includes(g.id)
  })

  const st = status?.services || {}
  const stateOf = (s) => (s === 'ok' ? 'ok' : s === 'warn' ? 'warn' : s === 'error' ? 'error' : 'idle')

  return (
    <div className="space-y-4">
      <ManagementHeader
        title="Cài đặt"
        subtitle="Mật khẩu và phiên quản trị, tình trạng hệ thống, lưu trữ game, cấu hình chung và nhật ký thao tác."
      />

      <div className="flex flex-wrap gap-1.5 sticky top-0 z-10 bg-paper/90 backdrop-blur py-2 -my-1">
        {visibleGroups.map((g) => (
          <button key={g.id} onClick={() => jump(g.id)}
            className="px-2.5 py-1 rounded-md border border-ink/12 bg-white text-[11px] text-[#6B5F4B] hover:border-gold/60 hover:text-ink transition">
            {g.label}
          </button>
        ))}
      </div>

      {/* ── 1. TÀI KHOẢN ──────────────────────────────────────────────── */}
      <div id="sec-account" className="grid lg:grid-cols-2 gap-4 items-start scroll-mt-24">
        <Card title="Đổi mật khẩu" icon={ShieldCheck}
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
            <p className="text-[11px] text-[#8A7C63] bg-gold/10 border border-gold/25 rounded-md px-2.5 py-2 leading-snug">
              Cảnh báo: thao tác này đăng xuất mọi thiết bị khác đang dùng tài khoản này và được ghi vào nhật ký hoạt động.
            </p>
            {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-teal' : 'text-ticket'}`}>{msg.text}</p>}
            <div className="flex gap-2">
              <PrimaryButton onClick={submit} disabled={busy} className="!px-4 !py-2 text-sm rounded-lg">
                {busy ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </PrimaryButton>
              <GhostButton onClick={() => { setCur(''); setNext(''); setAgain(''); setMsg(null) }}
                className="!px-4 !py-2 text-sm rounded-lg">Xóa form</GhostButton>
            </div>
          </div>
        </Card>

        <Card title="Tài khoản quản trị" icon={SlidersHorizontal}>
          <dl className="text-sm divide-y divide-ink/10">
            {[
              ['Họ tên', user?.name],
              ['Tên đăng nhập', user?.username],
              ['Email', user?.email || '—'],
              ['Quyền', user?.role ? getRoleLabel(user.role) : '—'],
              ['Quyền cài đặt', canEdit ? 'Xem + sửa cấu hình' : canView ? 'Chỉ xem' : 'Không có'],
            ].map(([k, v]) => <Row key={k} k={k} v={v} />)}
          </dl>
          <p className="text-[11px] text-[#B7A987] mt-3 leading-snug">
            Hồ sơ cá nhân (avatar, sở thích) sửa ở mục <b>Hồ sơ</b>; phân quyền thành viên ở <b>Phân quyền</b>.
          </p>
        </Card>
      </div>

      {/* ── 2. BẢO MẬT / PHIÊN ĐĂNG NHẬP ──────────────────────────────── */}
      <Card id="sec-security" className="scroll-mt-24" title="Bảo mật tài khoản" icon={ShieldCheck}
        hint="Phiên đăng nhập lấy từ bảng refresh token thật của hệ thống (cookie HttpOnly + hash trong DB), không phải danh sách tự đặt."
        actions={
          <>
            <GhostButton onClick={loadSessions} className="!px-3 !py-1.5 text-xs rounded-lg">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${sessionsLoading ? 'animate-spin' : ''}`} />Làm mới
            </GhostButton>
            <button onClick={() => setConfirmLogoutAll(true)} disabled={revoking || !(sessions?.total > 1)}
              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-display font-semibold hover:bg-red-50 disabled:opacity-40 transition">
              Đăng xuất thiết bị khác
            </button>
          </>
        }>
        {sessions?.error && <p className="text-sm text-ticket mb-2">{sessions.error}</p>}
        {!sessions && !sessionsLoading ? (
          <p className="text-sm text-[#8A7C63]">Chưa đọc được danh sách phiên.</p>
        ) : (
          <div className="space-y-2">
            <Row k="Số phiên đang hoạt động" v={sessions ? `${sessions.total}` : '—'} />
            {sessions?.current && (
              <div className="rounded-lg border border-teal/30 bg-teal/10 px-3 py-2 text-xs">
                <div className="font-semibold text-teal mb-0.5">Máy bạn đang dùng</div>
                <div className="text-ink">{deviceName(sessions.current.userAgent)}
                  {sessions.current.ip ? ` · IP ${sessions.current.ip}` : ''}</div>
                <div className="text-[#8A7C63]">Bắt đầu {fmtTime(sessions.current.createdAt)} · hết hạn {fmtTime(sessions.current.expiresAt)}</div>
              </div>
            )}
            {(sessions?.items || []).filter((s) => !s.current).length > 0 && (
              <ul className="divide-y divide-ink/10 border border-ink/10 rounded-lg overflow-hidden">
                {sessions.items.filter((s) => !s.current).map((s) => (
                  <li key={s.id} className="px-3 py-2 text-xs flex items-center justify-between gap-3 bg-white/70">
                    <span className="text-ink">{deviceName(s.userAgent)}{s.ip ? ` · IP ${s.ip}` : ''}</span>
                    <span className="text-[#8A7C63] shrink-0">từ {fmtTime(s.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
            {sessions && sessions.total <= 1 && (
              <p className="text-[11px] text-[#B7A987]">Chỉ có một thiết bị đang đăng nhập bằng tài khoản này.</p>
            )}
          </div>
        )}
      </Card>

      {/* ── 3. TÌNH TRẠNG HỆ THỐNG ─────────────────────────────────────── */}
      {canView && (
        <Card id="sec-system" className="scroll-mt-24" title="Tình trạng hệ thống" icon={Activity}
          hint="Kiểm tra qua Backend API. Secret key và chuỗi kết nối không bao giờ được gửi sang trình duyệt."
          actions={
            <GhostButton onClick={() => loadStatus(true)} className="!px-3 !py-1.5 text-xs rounded-lg">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${statusLoading ? 'animate-spin' : ''}`} />Kiểm tra ngay
            </GhostButton>
          }>
          {statusError && (
            <p className="text-sm text-ticket mb-3 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />{statusError}
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { k: 'Backend API', s: st.api, extra: st.api ? `uptime ${Math.round((st.api.uptimeSec || 0) / 60)} phút · node ${st.api.nodeVersion}` : '' },
              { k: 'MongoDB', s: st.mongo, extra: st.mongo ? `${st.mongo.dbName} · ${st.mongo.collections} collection` : '' },
              { k: 'Supabase Storage', s: st.storage, extra: st.storage ? `${st.storage.bucket} · ${st.storage.objects ?? 0} file HTML` : '' },
              { k: 'Tải file HTML game', s: st.html, extra: st.html?.checked ? `${st.html.checked} file thử tải · ${st.html.latencyMs}ms` : '' },
              { k: 'Trợ lý AI', s: st.ai, extra: st.ai ? `${st.ai.model || 'chưa rõ model'} · ${st.ai.provider || 'không rõ nguồn'}${st.ai.enabled ? '' : ' · công tắc đang tắt'}` : '' },
            ].map((row) => (
              <div key={row.k} className="rounded-lg border border-ink/10 bg-white/60 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-ink">{row.k}</span>
                  <Pill state={statusLoading && !st.api ? 'loading' : stateOf(row.s?.state)}>
                    {statusLoading && !st.api ? 'Đang kiểm tra' : row.s?.label || 'Chưa kiểm tra'}
                  </Pill>
                </div>
                <div className="text-[11px] text-[#8A7C63] mt-1 leading-snug">
                  {row.s?.error ? <span className="text-ticket">{row.s.error}</span> : row.extra || ''}
                  {row.s?.latencyMs ? ` · ${row.s.latencyMs}ms` : ''}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#B7A987] mt-2.5">
            Lần kiểm tra gần nhất: {status ? fmtTime(status.checkedAt) : '—'}
            {status ? ` (tổng ${status.totalMs}ms)` : ''}. Kết quả giữ trong 10 giây để không dồn tải cho server.
          </p>
        </Card>
      )}

      {/* ── 3b. TRỢ LÝ AI ─────────────────────────────────────────────── */}
      {canView && (
        <Card id="sec-ai" className="scroll-mt-24" title="Trợ lý AI" icon={Sparkles}
          hint="Máy chủ AI (Ollama + model tiếng Việt) chạy ở dịch vụ riêng và chỉ Backend API gọi tới. Trình duyệt không biết địa chỉ của nó. Bật công tắc bên dưới thì các tính năng AI mới hoạt động."
          actions={
            canEdit && (
              <PrimaryButton disabled={cfgSaving || !cfg} onClick={saveAi} className="!px-4 !py-2 text-sm rounded-lg">
                {cfgSaving ? 'Đang lưu…' : 'Lưu cấu hình AI'}
              </PrimaryButton>
            )
          }>
          <div className="flex items-start justify-between gap-4 pb-2.5 border-b border-ink/10">
            <div className="min-w-0">
              <div className="text-sm text-ink font-medium">Cho phép dùng tính năng AI</div>
              <div className="text-[11px] text-[#8A7C63] leading-snug max-w-xl">
                Đang tắt = học sinh và giáo viên thấy thông báo “Trợ lý AI đang được cấu hình, chưa sử dụng được”
                ở mọi tính năng, và Backend không gửi yêu cầu nào sang máy chủ AI. Tắt không ảnh hưởng việc học,
                chơi game hay chấm điểm.
              </div>
            </div>
            <ToggleSwitch checked={Boolean(cfg?.ai?.enabled)} disabled={!canEdit || cfgSaving || !cfg}
              onChange={(v) => patchCfg((c) => { c.ai = { ...(c.ai || {}), enabled: v }; return c })} />
          </div>
          {!cfg && (
            <p className="text-sm text-[#8A7C63] mt-2">{cfgLoading ? 'Đang tải cấu hình…' : cfgError || 'Chưa đọc được cấu hình.'}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            <div className="rounded-lg border border-ink/10 bg-white/60 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-ink">Máy chủ AI</span>
                <Pill state={statusLoading && !st.ai ? 'loading' : stateOf(st.ai?.state)}>
                  {statusLoading && !st.ai ? 'Đang kiểm tra' : st.ai?.label || 'Chưa kiểm tra'}
                </Pill>
              </div>
              <div className="text-[11px] text-[#8A7C63] mt-1 leading-snug">
                {st.ai?.error ? <span className="text-ticket">{st.ai.error}</span> : st.ai?.detail || '—'}
                {st.ai?.latencyMs ? ` · ${st.ai.latencyMs}ms` : ''}
              </div>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white/60 px-3 py-2.5">
              <div className="text-sm text-ink">Model đang cấu hình</div>
              <div className="text-[11px] text-[#8A7C63] mt-1 leading-snug font-mono">
                {st.ai?.model || '—'}{st.ai?.provider ? ` · ${st.ai.provider}` : ''}
              </div>
              <div className="text-[10px] text-[#B7A987] mt-1 leading-snug">
                Tên model do biến môi trường của máy chủ AI quy định, không nhập ở đây.
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-ink/10 bg-white/60 px-3 py-2.5">
            <div className="text-[11px] font-mono text-[#8A7C63] mb-1.5">Bốn tính năng dùng chung công tắc này</div>
            <ul className="text-[12px] text-ink leading-snug space-y-1">
              <li>· Trợ lý giải thích câu hỏi trong game (AI Bạn Học)</li>
              <li>· Chat trợ lý học tập ở trang chủ và trang học</li>
              <li>· Sinh câu hỏi bằng AI khi tạo game (chỉ giáo viên/admin)</li>
              <li>· Phân tích kết quả học tập (học sinh xem của mình, giáo viên xem của lớp)</li>
            </ul>
          </div>

          <p className="text-[11px] text-[#8A7C63] mt-2.5 leading-snug bg-gold/10 border border-gold/25 rounded-md px-2.5 py-2">
            Điểm, tỉ lệ đúng và xếp hạng luôn do hệ thống tính — AI chỉ diễn giải, không quyết định kết quả.
            Máy chủ AI hiện chạy trên máy nội bộ: khi deploy ra Render (hoặc nền tảng khác) mà không có AI Service
            ở đó, các tính năng vẫn báo “đang được cấu hình” cho tới khi có máy chủ AI thật.
          </p>
        </Card>
      )}

      {/* ── 4. LƯU TRỮ GAME ───────────────────────────────────────────── */}
      {canView && (
        <Card id="sec-storage" className="scroll-mt-24" title="Lưu trữ game" icon={HardDrive}
          hint="Số liệu đếm trực tiếp từ MongoDB; dung lượng đọc từ metadata của Supabase Storage. Không có số liệu ước lượng."
          actions={
            <GhostButton onClick={loadStorage} className="!px-3 !py-1.5 text-xs rounded-lg">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${storageLoading ? 'animate-spin' : ''}`} />Kiểm tra lại
            </GhostButton>
          }>
          {storageError && <p className="text-sm text-ticket mb-3">{storageError}</p>}
          {!storage && !storageLoading ? (
            <p className="text-sm text-[#8A7C63]">Chưa đọc được số liệu.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Metric value={storage?.templates?.total ?? '—'} label="Mẫu game (template)" />
                <Metric value={storage?.templates?.withHtml ?? '—'} label="Có file HTML"
                  hint={storage?.templates?.missingHtml ? `${storage.templates.missingHtml} thiếu HTML` : 'đủ'} />
                <Metric value={storage?.templates?.withThumbnail ?? '—'} label="Có thumbnail"
                  hint={storage?.templates?.missingThumbnail ? `${storage.templates.missingThumbnail} chưa có ảnh` : 'đủ'} />
                <Metric value={storage?.storage?.size != null ? fmtB(storage.storage.size) : '—'} label="Dung lượng Supabase"
                  hint={storage?.storage?.fileCount != null ? `${storage.storage.fileCount} file` : 'không đọc được'} />
              </div>
              <dl className="text-sm divide-y divide-ink/10 mt-3">
                <Row k="Trò chơi trong kho" v={storage?.games} />
                <Row k="Tài khoản" v={storage?.users} />
                <Row k="HTML lưu ở" v={storage ? `${storage.templates.htmlOn.supabase} Supabase · ${storage.templates.htmlOn.disk} đĩa · ${storage.templates.htmlOn.other} khác` : '—'} />
                <Row k="Nhà cung cấp lưu trữ" v={storage?.providerLabel} />
                <Row k="Trạng thái kết nối" v={
                  <Pill state={storage?.connected ? 'ok' : 'error'}>{storage?.connected ? 'Đang kết nối' : 'Chưa cấu hình / lỗi'}</Pill>
                } />
              </dl>
              {storage?.storage?.error && (
                <p className="text-[11px] text-ticket mt-2">Không đọc được dung lượng: {storage.storage.error}</p>
              )}
              {storage && storage.storage?.source !== 'supabase' && (
                <p className="text-[11px] text-[#B7A987] mt-2">
                  Dung lượng hiển thị "—" vì không lấy được số liệu thật từ Supabase — trang không tự ước lượng.
                </p>
              )}
            </>
          )}
        </Card>
      )}

      {/* ── 5. KIỂM TRA DỮ LIỆU GAME ──────────────────────────────────── */}
      {canView && (
        <Card id="sec-scan" className="scroll-mt-24" title="Kiểm tra dữ liệu game" icon={Database}
          hint="Quét 20 template mỗi lần: kiểm link HTML và thumbnail có truy cập được không. Chỉ đọc — không xóa file, không sửa dữ liệu."
          actions={
            <PrimaryButton onClick={() => runScan(1, true)} disabled={scanning} className="!px-4 !py-2 text-sm rounded-lg">
              {scanning ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Đang quét…</> : 'Quét toàn bộ game'}
            </PrimaryButton>
          }>
          {scanError && <p className="text-sm text-ticket mb-3">{scanError}</p>}
          {!scan ? (
            <p className="text-sm text-[#8A7C63]">Chưa chạy lượt quét nào. Bấm "Quét toàn bộ game" để kiểm tra liên kết HTML/thumbnail trên Supabase.</p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Metric value={`${scan.checked}/${scan.total}`} label="Đã kiểm tra (trang này)" hint={fmtTime(scan.scannedAt)} />
                <Metric value={scan.summary?.ok ?? 0} label="HTML OK" />
                <Metric value={(scan.summary?.missing ?? 0) + (scan.summary?.not_found ?? 0) + (scan.summary?.http_error ?? 0) + (scan.summary?.unreachable ?? 0)} label="HTML có lỗi" />
                <Metric value={scan.summary?.noThumb ?? 0} label="Chưa có thumbnail" />
              </div>

              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm border-collapse min-w-[620px]">
                  <thead>
                    <tr className="text-left text-[11px] font-mono text-[#8A7C63] border-b border-ink/10">
                      <th className="py-2 pr-3 font-normal">Tên game</th>
                      <th className="py-2 pr-3 font-normal">HTML</th>
                      <th className="py-2 pr-3 font-normal">Thumbnail</th>
                      <th className="py-2 font-normal">Nguyên nhân</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(scan.items || []).map((it) => {
                      const bad = it.html.state !== 'ok'
                      const reason = it.html.reason || (it.thumb.state !== 'ok' && it.thumb.state !== 'none' ? it.thumb.reason : '')
                      return (
                        <tr key={it.id} className={`border-b border-ink/8 ${bad ? 'bg-ticket/5' : ''}`}>
                          <td className="py-2 pr-3 text-ink">{it.name}</td>
                          <td className="py-2 pr-3"><Pill state={stateOf(it.html.state === 'none' ? 'idle' : it.html.state)}>{it.html.label}</Pill></td>
                          <td className="py-2 pr-3"><Pill state={it.thumb.state === 'ok' ? 'ok' : it.thumb.state === 'none' ? 'idle' : stateOf(it.thumb.state)}>{it.thumb.label}</Pill></td>
                          <td className="py-2 text-[11px] text-[#8A7C63] max-w-[260px] truncate" title={reason}>{reason || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {scan.totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[#8A7C63]">Trang {scan.page}/{scan.totalPages}</span>
                  <div className="flex gap-2">
                    <GhostButton disabled={scan.page <= 1 || scanning} onClick={() => runScan(scan.page - 1)}
                      className="!px-3 !py-1.5 text-xs rounded-lg">Trước</GhostButton>
                    <GhostButton disabled={scan.page >= scan.totalPages || scanning} onClick={() => runScan(scan.page + 1)}
                      className="!px-3 !py-1.5 text-xs rounded-lg">Sau</GhostButton>
                  </div>
                </div>
              )}
              {scan.cached && <p className="text-[11px] text-[#B7A987]">Đang hiển thị kết quả của lượt quét trước (chống quét dồn).</p>}
            </div>
          )}
        </Card>
      )}

      {/* ── 6. THÔNG BÁO HỆ THỐNG ─────────────────────────────────────── */}
      {canView && (
        <Card id="sec-notify" className="scroll-mt-24" title="Thông báo hệ thống" icon={SlidersHorizontal}
          hint="Mỗi công tắc bên dưới đang thật sự chặn một luồng thông báo trong server. Tắt là thông báo đó không được tạo và không đẩy đi."
          actions={
            canEdit && (
              <PrimaryButton disabled={cfgSaving || !cfg} onClick={() => saveConfig({ notifications: cfg.notifications })}
                className="!px-4 !py-2 text-sm rounded-lg">
                {cfgSaving ? 'Đang lưu…' : 'Lưu thông báo'}
              </PrimaryButton>
            )
          }>
          {!cfg ? (
            cfgLoading ? <p className="text-sm text-[#8A7C63]">Đang tải cấu hình…</p>
              : <p className="text-sm text-ticket">{cfgError || 'Không đọc được cấu hình thông báo.'}</p>
          ) : (
            <div className="divide-y divide-ink/10">
              {[
                ['push', 'Đẩy thông báo về điện thoại (Firebase)', 'Tắt thì vẫn xem được trong app, chỉ ngừng gửi push.'],
                ['realtime', 'Thông báo thời gian thực (socket)', 'Tắt thì danh sách chuông không tự cập nhật, phải tải lại trang.'],
                ['assignments', 'Bài tập mới gửi cho học sinh', 'Tắt thì giáo viên giao bài sẽ không tạo thông báo cho lớp.'],
                ['deadlineReminders', 'Nhắc bài tập sắp hết hạn', 'Tắt thì bộ đếm hạn nộp (chạy mỗi giờ) không gửi nhắc.'],
              ].map(([key, t, d]) => (
                <div key={key} className="flex items-start justify-between gap-4 py-2.5">
                  <div>
                    <div className="text-sm text-ink">{t}</div>
                    <div className="text-[11px] text-[#8A7C63] leading-snug">{d}</div>
                  </div>
                  <ToggleSwitch checked={Boolean(cfg.notifications?.[key])} disabled={!canEdit || cfgSaving}
                    onChange={(v) => patchCfg((c) => { c.notifications[key] = v; return c })} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── 7. CẤU HÌNH CHUNG ─────────────────────────────────────────── */}
      {canView && (
        <Card id="sec-config" className="scroll-mt-24" title="Cấu hình chung" icon={SlidersHorizontal}
          hint="Lưu ở MongoDB (collection system_config) nên mọi thiết bị dùng chung — không nằm trong localStorage."
          actions={
            canEdit && (
              <PrimaryButton disabled={cfgSaving || !cfg}
                onClick={() => saveConfig({ site: cfg.site, maintenance: cfg.maintenance })}
                className="!px-4 !py-2 text-sm rounded-lg">
                {cfgSaving ? 'Đang lưu…' : 'Lưu cấu hình'}
              </PrimaryButton>
            )
          }>
          {!cfg ? (
            <p className="text-sm text-[#8A7C63]">{cfgLoading ? 'Đang tải cấu hình…' : 'Chưa có dữ liệu cấu hình.'}</p>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label>
                  <span className={label}>Tên hệ thống</span>
                  <Input value={cfg.site.name} disabled={!canEdit} onChange={(v) => patchCfg((c) => { c.site.name = v; return c })} maxLength={120} />
                </label>
                <label>
                  <span className={label}>Liên hệ hỗ trợ</span>
                  <Input value={cfg.site.supportContact} disabled={!canEdit} placeholder="email hoặc số điện thoại"
                    onChange={(v) => patchCfg((c) => { c.site.supportContact = v; return c })} maxLength={120} />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  ['logoUrl', 'Logo', logoFileRef],
                  ['faviconUrl', 'Favicon', faviconFileRef],
                ].map(([key, t, ref]) => (
                  <div key={key}>
                    <span className={label}>{t}</span>
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-lg border border-ink/12 bg-white grid place-items-center overflow-hidden shrink-0">
                        {cfg.site[key]
                          ? <img src={cfg.site[key]} alt={t} className="w-full h-full object-contain" />
                          : <span className="text-[10px] text-[#B7A987]">trống</span>}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <GhostButton onClick={() => ref.current?.click()} disabled={!canEdit} className="!px-3 !py-1.5 text-xs rounded-lg">
                          Chọn ảnh
                        </GhostButton>
                        {cfg.site[key] && (
                          <button onClick={() => patchCfg((c) => { c.site[key] = ''; return c })} disabled={!canEdit}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-display font-semibold hover:bg-red-50 transition">
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />Bỏ ảnh
                          </button>
                        )}
                      </div>
                      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; pickImage(f, (dataUrl) => patchCfg((c) => { c.site[key] = dataUrl; return c })); e.target.value = '' }} />
                    </div>
                    <p className="text-[10px] text-[#B7A987] mt-1">Ảnh nhỏ hơn 1 MB. Khi lưu, server đẩy lên Supabase và chỉ giữ link.</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-ink/10 pt-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-ink font-medium">Chế độ bảo trì</div>
                    <div className="text-[11px] text-[#8A7C63] leading-snug max-w-md">
                      Bật thì mọi người dùng thấy băng thông báo ở đầu trang (kể cả học sinh). Khu quản trị vẫn vào được bình thường.
                    </div>
                  </div>
                  <ToggleSwitch checked={Boolean(cfg.maintenance.enabled)} disabled={!canEdit || cfgSaving}
                    onChange={(v) => patchCfg((c) => { c.maintenance.enabled = v; return c })} />
                </div>
                {cfg.maintenance.enabled && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <label>
                      <span className={label}>Nội dung thông báo</span>
                      <Input value={cfg.maintenance.message} disabled={!canEdit} placeholder="Hệ thống đang bảo trì định kỳ…"
                        onChange={(v) => patchCfg((c) => { c.maintenance.message = v; return c })} maxLength={300} />
                    </label>
                    <label>
                      <span className={label}>Dự kiến xong lúc</span>
                      <Input value={cfg.maintenance.until} disabled={!canEdit} placeholder="vd: 19:00 hôm nay"
                        onChange={(v) => patchCfg((c) => { c.maintenance.until = v; return c })} maxLength={60} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── 8. DỮ LIỆU CỤC BỘ (giữ nguyên) ────────────────────────────── */}
      <Card id="sec-local" className="scroll-mt-24" title="Dữ liệu game trên máy này" icon={HardDrive}
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

      {/* ── 9. NHẬT KÝ HOẠT ĐỘNG ──────────────────────────────────────── */}
      {canView && (
        <Card id="sec-logs" className="scroll-mt-24" title="Nhật ký hoạt động" icon={History}
          hint="Các thao tác: đăng nhập/đăng xuất, tạo–sửa–xóa game, người dùng, vai trò, quyền, cấu hình. Không ghi mật khẩu hay token."
          actions={
            <GhostButton onClick={() => loadLogs(1)} className="!px-3 !py-1.5 text-xs rounded-lg">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${logLoading ? 'animate-spin' : ''}`} />Làm mới
            </GhostButton>
          }>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
            <Input value={logKeyword} placeholder="Tìm tên, đối tượng…" onChange={(v) => setLogKeyword(v)} />
            <Select value={logAction} onChange={setLogAction} options={logActionOptions} />
            <Input type="date" value={logFrom} onChange={(v) => setLogFrom(v)} />
            <Input type="date" value={logTo} onChange={(v) => setLogTo(v)} />
            <PrimaryButton onClick={() => loadLogs(1)} disabled={logLoading} className="!px-4 !py-2 text-sm rounded-lg">
              <Search className="w-4 h-4 mr-1.5" />Tìm
            </PrimaryButton>
          </div>

          {logLoading && !logs ? (
            <p className="text-sm text-[#8A7C63] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Đang đọc nhật ký…</p>
          ) : !logs?.data?.items?.length ? (
            <EmptyState icon={<History />} title="Chưa có nhật ký phù hợp"
              subtitle="Thao tác của quản trị sẽ xuất hiện ở đây ngay sau khi thực hiện. Đổi bộ lọc hoặc bấm Làm mới." />
          ) : (
            <>
              <ul className="divide-y divide-ink/10">
                {logs.data.items.map((r) => (
                  <li key={r.id} className="py-2 flex items-start gap-3">
                    <span className="mt-0.5 shrink-0"><Pill state={r.result === 'fail' ? 'error' : 'ok'}>{r.result === 'fail' ? 'Thất bại' : 'Thành công'}</Pill></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-ink">{actionLabel(r.action)}
                        {r.target && <span className="text-[#8A7C63]"> · {r.target}</span>}
                      </div>
                      <div className="text-[11px] text-[#8A7C63] truncate">
                        {r.actorName}{r.actorRole ? ` (${getRoleLabel(r.actorRole)})` : ''}{r.message ? ` — ${r.message}` : ''}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#B7A987] shrink-0 font-mono">{fmtTime(r.at)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-3 mt-3 text-xs">
                <span className="text-[#8A7C63]">
                  {logs.pagination?.total ?? logs.data.total} bản ghi · trang {logs.data.page}/{logs.data.totalPages}
                </span>
                <div className="flex gap-2">
                  <GhostButton disabled={logPage <= 1 || logLoading} onClick={() => loadLogs(logPage - 1)}
                    className="!px-3 !py-1.5 text-xs rounded-lg">Trước</GhostButton>
                  <GhostButton disabled={logPage >= (logs.data.totalPages || 1) || logLoading} onClick={() => loadLogs(logPage + 1)}
                    className="!px-3 !py-1.5 text-xs rounded-lg">Sau</GhostButton>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      <ConfirmModal open={confirmLogoutAll} title="Đăng xuất mọi thiết bị khác?"
        message={`${sessions?.total ? sessions.total - 1 : 0} phiên còn lại sẽ bị thu hồi ngay. Máy bạn đang dùng vẫn giữ được phiên. thao tác này được ghi vào nhật ký.`}
        confirmLabel="Đăng xuất các máy khác" danger
        onConfirm={revokeOthers} onClose={() => setConfirmLogoutAll(false)} />
    </div>
  )
}
