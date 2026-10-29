import { useCallback, useEffect, useMemo, useState } from 'react'
import { gameConfigStore } from '../../services/api.js'
import {
  ManagementHeader, PrimaryButton, GhostButton, IconButton, ConfirmModal, Loader,
} from '../../components/ui'
import {
  VTH_CONFIG_KEY, defaultVth, resolveCfg, validateVth, canonLevel, vthOut,
  prettyJ, blankLevel, blankSpawn, levelStats, THEMES, KIND_LABEL,
} from '../../lib/vthConfig.js'

/* Màu chấm theo thứ tự quái — giống bảng MCOL trong trang admin cũ. */
const MCOL = ['#ff758c', '#7ed957', '#ffb347', '#8e9bff', '#ffd43b', '#4cd6b3', '#f783ac', '#74c0fc'];
const clone = (v) => JSON.parse(JSON.stringify(v));

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-2.5 py-1.5 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'
const chipCls = (on) => `px-3 py-1.5 rounded-full border text-sm transition ${on ? 'bg-ink text-paper border-ink' : 'bg-white text-ink/70 border-ink/15 hover:border-ink/35'}`
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d }

/** Ô nhập có nhãn, dùng cho biểu chỉnh màn chơi (đảm bảo cùng một kiểu). */
function F({ label: t, children, hint }) {
  return (
    <label className="min-w-0">
      <span className={label}>{t}</span>
      {children}
      {hint && <span className="block text-[10px] text-[#B7A987] mt-0.5">{hint}</span>}
    </label>
  )
}

/** Biểu đồ thời điểm quái ra — vẽ bằng SVG để in được cả khi Thu nhỏ. */
function SpawnChart({ level, cfg, monsters }) {
  const c = resolveCfg(cfg)
  const pts = []
  let maxT = 30
  level.timeline.forEach((e) => e.spawn.forEach((s) => {
    for (let k = 0; k < (s.count || 1); k++) {
      const t = e.t + (s.delay || 0) + k * (s.gap || 0)
      pts.push({ t, m: s.monster, all: s.row === 'all' })
      maxT = Math.max(maxT, t)
    }
  }))
  maxT = Math.ceil((maxT + 5) / 10) * 10
  const used = [...new Set(pts.map((p) => p.m))]
  const lw = 92, rh = 28, W = 760
  const H = Math.max(used.length * rh + 34, 80)
  const sx = (t) => lw + (t / maxT) * (W - lw - 14)
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Biểu đồ thời điểm quái xuất hiện">
        {Array.from({ length: maxT / 10 + 1 }, (_, i) => i * 10).map((t) => (
          <g key={`g${t}`}>
            <line x1={sx(t)} y1={8} x2={sx(t)} y2={H - 22} stroke="rgba(29,46,74,0.12)" />
            <text x={sx(t)} y={H - 6} fill="#8A7C63" fontSize={11} textAnchor="middle">{t}s</text>
          </g>
        ))}
        {level.timeline.filter((e) => e.flag).map((e, i) => (
          <g key={`f${i}`}>
            <line x1={sx(e.t)} y1={8} x2={sx(e.t)} y2={H - 22} stroke="#C4442E" strokeDasharray="4 3" />
            <text x={sx(e.t)} y={12} fontSize={12} textAnchor="middle">🚩</text>
          </g>
        ))}
        {used.map((m, i) => {
          const y = 22 + i * rh
          const col = MCOL[monsters.indexOf(m) % MCOL.length]
          const em = (c.monsters[m] || {}).icon || '?'
          return (
            <g key={m}>
              <text x={6} y={y + 5} fill="#1D2E4A" fontSize={13}>{em} {m}</text>
              {pts.filter((p) => p.m === m).map((p, k) => (
                <circle key={`${m}-${k}`} cx={sx(p.t)} cy={y} r={p.all ? 8 : 5.5} fill={col}
                  stroke={p.all ? '#fff' : 'none'} strokeWidth={1.5}>
                  <title>{`${m} · ${p.t.toFixed(1)}s${p.all ? ' · tất cả hàng' : ''}`}</title>
                </circle>
              ))}
            </g>
          )
        })}
      </svg>
      <p className="text-[11px] text-[#8A7C63] mt-1">
        Chấm to viền trắng = quái ra ở tất cả các hàng. Đường đỏ nét đứt = đợt có cờ.
      </p>
    </div>
  )
}

export default function VthConfigManagement({ showToast }) {
  const [cfg, setCfg] = useState(null)
  const [baseline, setBaseline] = useState('')      // JSON đang lưu trên máy chủ
  const [updatedAt, setUpdatedAt] = useState(null)
  const [fromStore, setFromStore] = useState(false) // đã có bản lưu chưa
  const [tab, setTab] = useState('visual')
  const [lvl, setLvl] = useState(0)
  const [jsonDraft, setJsonDraft] = useState(null)  // bản gõ tay ở tab JSON (null = theo cấu hình)
  const [jsonErr, setJsonErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [askDelLvl, setAskDelLvl] = useState(false)
  const [askReset, setAskReset] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await gameConfigStore.get(VTH_CONFIG_KEY)
      const values = r?.config?.values
      const ok = values && !validateVth(values).length
      const next = ok ? { ...values, levels: (values.levels || []).map(canonLevel) } : defaultVth()
      setCfg(next)
      setFromStore(!!ok)
      setBaseline(ok ? JSON.stringify(vthOut(next)) : '')
      setUpdatedAt(ok ? (r.config.updatedAt || null) : null)
      setJsonDraft(null)
      setLvl((i) => Math.min(i, next.levels.length - 1))
    } catch (e) {
      setCfg(defaultVth()); setFromStore(false); setBaseline(''); setJsonDraft(null)
      showToast?.(e.message || 'Không đọc được cấu hình từ máy chủ', 'error')
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const outJson = useMemo(() => (cfg ? prettyJ(vthOut(cfg)) : ''), [cfg])
  /* Tab JSON hiện bản đang sửa; nếu gõ tay thì dùng bản gõ (jsonDraft) cho tới
     khi "Cập nhật từ JSON" hoặc chỉnh ở tab Trực quan (draft bị xóa). */
  const jsonView = jsonDraft ?? outJson

  const errors = useMemo(() => (cfg ? validateVth(vthOut(cfg)) : []), [cfg])
  const dirty = !!cfg && JSON.stringify(vthOut(cfg)) !== baseline
  const c = useMemo(() => (cfg ? resolveCfg(cfg) : null), [cfg])
  const monsters = useMemo(() => (c ? Object.keys(c.monsters) : []), [c])
  const L = cfg?.levels?.[lvl]
  const stat = L && c ? levelStats(L, c) : null

  /* ── biến đổi cấu hình ── */
  const patchLevels = (fn) => { setJsonDraft(null); setCfg((v) => { const levels = [...v.levels]; fn(levels); return { ...v, levels } }) }
  const patchLevel = (fn) => patchLevels((levels) => { const n = clone(levels[lvl]); fn(n); levels[lvl] = n })
  const setField = (k, v) => patchLevel((n) => { n[k] = v })
  const setSky = (k, v) => patchLevel((n) => { n.skySun = { ...(n.skySun || {}), [k]: num(v) } })
  const togglePlant = (p) => patchLevel((n) => {
    const s = new Set(n.plants || [])
    s.has(p) ? s.delete(p) : s.add(p)
    n.plants = Object.keys(c.plants).filter((x) => s.has(x))
  })
  const patchEvents = (fn) => patchLevel((n) => { const tl = [...n.timeline]; fn(tl); n.timeline = tl })
  const setEvent = (i, k, v) => patchEvents((tl) => {
    const e = { ...tl[i] }
    if (k === 't') { e.t = Math.max(0, num(v)); } else if (k === 'flag') { if (v) e.flag = true; else delete e.flag } else { if (v) e.banner = v; else delete e.banner }
    tl[i] = e
    if (k === 't') tl.sort((a, b) => a.t - b.t)
  })
  const setSpawn = (i, j, k, v) => patchEvents((tl) => {
    const e = { ...tl[i] }, sp = [...e.spawn], s = { ...sp[j] }
    if (k === 'monster') s.monster = v
    else if (k === 'row') s.row = /^\d+$/.test(v) ? Number(v) : v
    else if (k === 'count') s.count = Math.max(1, Math.round(num(v, 1)))
    else s[k] = Math.max(0, num(v))
    sp[j] = s; e.spawn = sp; tl[i] = e
  })
  const addEvent = () => patchLevel((n) => {
    const lastT = n.timeline.length ? n.timeline[n.timeline.length - 1].t : 10
    n.timeline = [...n.timeline, { t: lastT + 15, spawn: [blankSpawn(cfg)] }].sort((a, b) => a.t - b.t)
  })
  const addSpawn = (i) => patchEvents((tl) => { tl[i] = { ...tl[i], spawn: [...tl[i].spawn, blankSpawn(cfg)] } })

  /* ── lưu / hoàn tác ── */
  const save = async () => {
    if (errors.length) { showToast?.('Còn lỗi, chưa lưu được', 'error'); return }
    setSaving(true)
    try {
      const out = vthOut(cfg)
      const r = await gameConfigStore.set(VTH_CONFIG_KEY, out)
      setBaseline(JSON.stringify(out))
      setUpdatedAt(r?.config?.updatedAt || null)
      setFromStore(true)
      showToast?.('Đã lưu cấu hình. Game sẽ nạp bản mới khi mở lại.')
    } catch (e) { showToast?.(e.message || 'Không lưu được', 'error') } finally { setSaving(false) }
  }
  const revert = () => {
    setJsonDraft(null)
    if (!baseline) { setCfg(defaultVth()); setLvl(0); showToast?.('Chưa có bản lưu, đã nạp cấu hình mặc định'); return }
    const saved = JSON.parse(baseline)
    setCfg({ ...saved, levels: (saved.levels || []).map(canonLevel) })
    setLvl((i) => Math.min(i, (saved.levels || []).length - 1))
    showToast?.('Đã bỏ thay đổi')
  }
  const useDefault = () => { setJsonDraft(null); setCfg(defaultVth()); setLvl(0); setAskReset(false) }

  const applyJson = () => {
    let v
    try { v = JSON.parse(jsonView) } catch (e) { setJsonErr('JSON sai cú pháp: ' + e.message); return }
    const er = validateVth(v)
    if (er.length) { setJsonErr(er.slice(0, 6).join('\n') + (er.length > 6 ? `\n… và ${er.length - 6} lỗi nữa` : '')); return }
    setJsonErr('')
    setJsonDraft(null)
    setCfg({ ...v, levels: (v.levels || []).map(canonLevel) })
    setLvl((i) => Math.min(i, Math.max(0, (v.levels || []).length - 1)))
    setTab('visual')
    showToast?.('Đã cập nhật từ JSON')
  }
  const copyJson = async () => {
    try { await navigator.clipboard.writeText(jsonView); showToast?.('Đã sao chép JSON') }
    catch { showToast?.('Trình duyệt chặn sao chép, hãy chọn và copy thủ công', 'error') }
  }
  const downloadJson = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([jsonView], { type: 'application/json' }))
    a.download = 'vuon-thu-ho.json'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(a.href)
  }
  const pickJson = () => {
    const i = document.createElement('input')
    i.type = 'file'; i.accept = '.json,application/json'
    i.onchange = () => {
      const f = i.files?.[0]; if (!f) return
      const r = new FileReader()
      r.onload = () => { setJsonDraft(String(r.result)); setJsonErr(''); setTab('json'); showToast?.('Đã nạp file. Bấm "Cập nhật từ JSON".') }
      r.readAsText(f)
    }
    i.click()
  }

  if (!cfg || !c) {
    return (
      <div>
        <ManagementHeader title="Cấu hình Vườn Thủ Hộ" subtitle="Quái, cây, nắng và thứ tự ra quái của từng màn" />
        <div className="py-16 flex justify-center"><Loader label="Đang đọc cấu hình..." /></div>
      </div>
    )
  }

  const topActions = (
    <div className="flex flex-wrap gap-2">
      <GhostButton onClick={revert} className="!px-4 !py-2 text-sm rounded-lg" disabled={!dirty}>Hoàn tác</GhostButton>
      <GhostButton onClick={() => setAskReset(true)} className="!px-4 !py-2 text-sm rounded-lg">Mặc định</GhostButton>
      <PrimaryButton onClick={save} disabled={!!errors.length || (!dirty && fromStore)} className="!px-4 !py-2 text-sm rounded-lg">
        {saving ? 'Đang lưu...' : '🚀 Lưu vào game'}
      </PrimaryButton>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ManagementHeader
          title="Cấu hình Vườn Thủ Hộ"
          subtitle="Chỉnh thứ tự quái ra, cây khả dụng và nắng của từng màn. Lưu xong, game đọc cấu hình mới ngay khi mở."
        />
        {topActions}
      </div>

      {dirty && <p className="note-card p-2.5 bg-amber-50 border-amber-200 text-sm text-amber-800">Có thay đổi chưa lưu vào game.</p>}
      {!fromStore && !dirty && (
        <p className="note-card p-2.5 text-sm text-[#8A7C63]">Máy chủ chưa có bản lưu nào — đây là cấu hình mặc định nhúng trong game. Bấm “Lưu vào game” để mọi thiết bị dùng chung.</p>
      )}
      {updatedAt && <p className="text-[11px] font-mono text-[#8A7C63]">Bản đang lưu: {new Date(updatedAt).toLocaleString('vi-VN')}</p>}
      {!!errors.length && (
        <div className="note-card p-3 bg-red-50 border-red-200 text-sm text-red-700">
          <b>{errors.length} lỗi — chưa lưu được:</b>
          <ul className="mt-1 space-y-0.5 list-disc pl-4">{errors.slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
            {errors.length > 6 && <li>… và {errors.length - 6} lỗi nữa</li>}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => setTab('visual')} className={chipCls(tab === 'visual')}>🎛 Trực quan</button>
        <button onClick={() => setTab('json')} className={chipCls(tab === 'json')}>{'{ } JSON'}</button>
      </div>

      {tab === 'json' ? (
        <div className="space-y-2">
          <textarea
            value={jsonView}
            onChange={(e) => { setJsonDraft(e.target.value); setJsonErr('') }}
            spellCheck={false}
            className="w-full min-h-[52vh] rounded-lg border border-ink/15 bg-white p-3 font-mono text-xs leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <div className="flex flex-wrap gap-2">
            <PrimaryButton onClick={applyJson} className="!px-4 !py-2 text-sm rounded-lg">Cập nhật từ JSON</PrimaryButton>
            <GhostButton onClick={copyJson} className="!px-4 !py-2 text-sm rounded-lg">📋 Sao chép</GhostButton>
            <GhostButton onClick={downloadJson} className="!px-4 !py-2 text-sm rounded-lg">⬇ Tải xuống</GhostButton>
            <GhostButton onClick={pickJson} className="!px-4 !py-2 text-sm rounded-lg">📂 Nạp file</GhostButton>
          </div>
          {jsonErr && <pre className="note-card p-3 bg-red-50 border-red-200 text-xs text-red-700 whitespace-pre-wrap">{jsonErr}</pre>}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {cfg.levels.map((l, i) => (
              <button key={i} onClick={() => setLvl(i)} className={chipCls(i === lvl)}>Màn {i + 1}</button>
            ))}
            <button onClick={() => { patchLevels((ls) => ls.push(blankLevel())); setLvl(cfg.levels.length) }}
              className={chipCls(false)}>+ Thêm</button>
          </div>

          {!L ? (
            <div className="note-card p-6 text-center text-sm text-[#8A7C63]">Chưa có màn nào. Bấm “+ Thêm” để tạo màn đầu tiên.</div>
          ) : (
            <>
              <div className="note-card p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base text-ink">Màn {lvl + 1}</h3>
                  <div className="flex gap-1.5">
                    <button onClick={() => { patchLevels((ls) => { const n = clone(ls[lvl]); n.name = (n.name || 'Màn') + ' (bản sao)'; ls.splice(lvl + 1, 0, n) }); setLvl(lvl + 1) }}
                      className="px-2.5 py-1 rounded-md border border-ink/15 text-xs hover:bg-ink/5">Nhân bản</button>
                    <button onClick={() => setAskDelLvl(true)} disabled={cfg.levels.length < 2}
                      className="px-2.5 py-1 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40">Xóa màn</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  <F label="Tên màn"><input className={box} value={L.name || ''} onChange={(e) => setField('name', e.target.value)} /></F>
                  <F label="Bối cảnh">
                    <select className={box} value={L.theme || 'day'} onChange={(e) => setField('theme', e.target.value)}>
                      {Object.keys(THEMES).map((k) => <option key={k} value={k}>{THEMES[k]}</option>)}
                    </select>
                  </F>
                  <F label="Số hàng cỏ (3–6)">
                    <input type="number" min={3} max={6} className={box} value={L.rows ?? 5}
                      onChange={(e) => setField('rows', Math.min(6, Math.max(3, Math.round(num(e.target.value, 5)))))} />
                  </F>
                  <F label="Nắng ban đầu"><input type="number" min={0} className={box} value={L.startSun ?? 150} onChange={(e) => setField('startSun', Math.round(num(e.target.value, 150)))} /></F>
                  <F label="Nắng rơi: lần đầu (s)"><input type="number" min={0} className={box} value={L.skySun?.first ?? 6} onChange={(e) => setSky('first', e.target.value)} /></F>
                  <F label="Nắng rơi: mỗi (s)" hint="0 = không có nắng rơi"><input type="number" min={0} className={box} value={L.skySun?.every ?? 9} onChange={(e) => setSky('every', e.target.value)} /></F>
                  <F label="Nắng mỗi lần"><input type="number" min={1} className={box} value={L.skySun?.amount ?? 25} onChange={(e) => setSky('amount', e.target.value)} /></F>
                </div>

                <div>
                  <p className={label}>Cây được dùng trong màn này</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(c.plants).map(([p, info]) => {
                      const on = (L.plants || []).includes(p)
                      return (
                        <button key={p} onClick={() => togglePlant(p)}
                          className={`px-2.5 py-1 rounded-full border text-xs transition ${on ? 'bg-teal/15 border-teal/40 text-ink' : 'bg-white border-ink/15 text-ink/55 hover:border-ink/30'}`}>
                          {info.icon} {info.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { v: stat.cnt, l: 'Tổng số quái' },
                  { v: stat.hp.toLocaleString('vi-VN'), l: 'Tổng máu quái' },
                  { v: `${Math.round(stat.last)}s`, l: 'Quái cuối ra lúc' },
                  { v: stat.boss ? 'Có' : 'Không', l: 'Có boss' },
                ].map((s) => (
                  <div key={s.l} className="note-card p-3">
                    <p className="font-display text-lg text-ink">{s.v}</p>
                    <p className="text-[11px] text-[#8A7C63]">{s.l}</p>
                  </div>
                ))}
              </div>

              <div className="note-card p-3.5">
                <h3 className="font-display text-sm text-ink mb-2">Biểu đồ thứ tự quái ra</h3>
                <SpawnChart level={L} cfg={cfg} monsters={monsters} />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink">Danh sách sự kiện ({L.timeline.length})</h3>
                <button onClick={addEvent} className="px-3 py-1.5 rounded-lg bg-ink text-paper text-xs font-semibold">+ Thêm sự kiện</button>
              </div>

              <div className="space-y-2.5">
                {L.timeline.map((e, i) => (
                  <div key={i} className="note-card p-3 space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-[88px_1fr_auto_auto] gap-2 items-end">
                      <F label="Giây"><input type="number" min={0} step={0.5} className={box} value={e.t} onChange={(ev) => setEvent(i, 't', ev.target.value)} /></F>
                      <F label="Thông báo giữa màn hình (tuỳ chọn)">
                        <input className={box} value={e.banner || ''} placeholder="Ví dụ: Đợt quái lớn!" onChange={(ev) => setEvent(i, 'banner', ev.target.value)} />
                      </F>
                      <label className="flex items-center gap-1.5 pb-2 text-sm text-ink whitespace-nowrap">
                        <input type="checkbox" checked={!!e.flag} onChange={(ev) => setEvent(i, 'flag', ev.target.checked)} className="accent-teal" /> 🚩 Cờ
                      </label>
                      <button onClick={() => patchEvents((tl) => tl.splice(i, 1))}
                        className="mb-1 px-2.5 py-1 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50">Xóa</button>
                    </div>

                    {e.spawn.map((s, j) => (
                      <div key={j} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_70px_80px_80px_32px] gap-2 items-end pt-2 mt-1 border-t border-ink/10">
                        <F label="Quái">
                          <select className={box} value={s.monster} onChange={(ev) => setSpawn(i, j, 'monster', ev.target.value)}>
                            {monsters.map((m) => <option key={m} value={m}>{c.monsters[m].icon} {c.monsters[m].name} ({m})</option>)}
                          </select>
                        </F>
                        <F label="Hàng">
                          <select className={box} value={String(s.row)} onChange={(ev) => setSpawn(i, j, 'row', ev.target.value)}>
                            <option value="random">Ngẫu nhiên</option>
                            <option value="all">Tất cả hàng</option>
                            {Array.from({ length: L.rows || 5 }, (_, r) => <option key={r} value={String(r + 1)}>Hàng {r + 1}</option>)}
                          </select>
                        </F>
                        <F label="Số con"><input type="number" min={1} className={box} value={s.count} onChange={(ev) => setSpawn(i, j, 'count', ev.target.value)} /></F>
                        <F label="Cách nhau (s)"><input type="number" min={0} step={0.5} className={box} value={s.gap} onChange={(ev) => setSpawn(i, j, 'gap', ev.target.value)} /></F>
                        <F label="Chờ thêm (s)"><input type="number" min={0} step={0.5} className={box} value={s.delay} onChange={(ev) => setSpawn(i, j, 'delay', ev.target.value)} /></F>
                        <IconButton title="Xóa dòng quái" className="!w-8 !h-8 mb-1 text-red-500"
                          onClick={() => patchEvents((tl) => { const ev2 = { ...tl[i] }; ev2.spawn = ev2.spawn.filter((_, k) => k !== j); tl[i] = ev2 })}>
                          <span className="text-sm">{e.spawn.length < 2 ? '·' : '✕'}</span>
                        </IconButton>
                      </div>
                    ))}
                    <button onClick={() => addSpawn(i)} className="text-xs text-teal hover:underline">+ Thêm loại quái vào đợt này</button>
                  </div>
                ))}
              </div>

              <div className="note-card p-3.5">
                <h3 className="font-display text-sm text-ink mb-1">Quái và cây hiện có</h3>
                <p className="text-[11px] text-[#8A7C63] mb-2">Muốn đổi số liệu hay thêm id mới, sửa trong tab <b>JSON</b>. Icon do game tự tra theo id.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className={label}>Quái</p>
                    {monsters.map((m) => {
                      const x = c.monsters[m]
                      return <p key={m} className="text-xs text-ink/80 flex flex-wrap gap-x-2">{x.icon} <b>{x.name}</b> <span className="font-mono text-[#B7A987]">{m}</span> · máu {x.hp} · tốc độ {x.speed} · dmg {x.dps}</p>
                    })}
                  </div>
                  <div className="space-y-1">
                    <p className={label}>Cây</p>
                    {Object.entries(c.plants).map(([p, x]) => (
                      <p key={p} className="text-xs text-ink/80 flex flex-wrap gap-x-2">{x.icon} <b>{x.name}</b> <span className="font-mono text-[#B7A987]">{p}</span> · {KIND_LABEL[x.kind] || x.kind} · giá {x.cost} · máu {x.hp}</p>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <ConfirmModal open={askReset} title="Dùng cấu hình mặc định?"
        message="Nạp lại bản mặc định nhúng trong game. Chưa lưu vào máy chủ cho tới khi bấm “Lưu vào game”."
        confirmLabel="Dùng mặc định" danger={false} onConfirm={useDefault} onClose={() => setAskReset(false)} />
      <ConfirmModal open={askDelLvl} title={`Xóa màn ${lvl + 1}?`} message="Màn chơi và toàn bộ sự kiện của nó sẽ bị xóa khỏi bản đang sửa."
        onConfirm={() => { patchLevels((ls) => ls.splice(lvl, 1)); setLvl((i) => Math.max(0, i - 1)); setAskDelLvl(false) }}
        onClose={() => setAskDelLvl(false)} />
    </div>
  )
}
