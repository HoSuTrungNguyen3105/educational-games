import { useEffect, useRef, useState } from 'react'
import { Cake, ExternalLink, Eye, FileUp, Link2, PencilLine, RefreshCw, Save } from 'lucide-react'
import { ManagementHeader, PrimaryButton, GhostButton, Loader } from '../../components/ui'
import { navigate } from '../../lib/router.js'
import { loadTemplateHtml } from '../../lib/hooks.js'
import { API_BASE } from '../../services/api.js'
import { pageService } from '../../services/pageService.js'

// Trang quản trị nội dung trang sinh nhật (#/sinh-nhat) — route
// /dashboard/birthday, mục "Trang sinh nhật" ở sidebar (nhóm Nội dung).
// Nội dung trang KHÔNG nằm trong Mongo: PUT /api/pages/:slug nhận HTML thô,
// server upload thành file lên storage (templateStorageService) và chỉ lưu
// htmlUrl — đúng cơ chế template, trang này chỉ là giao diện quản trị cho
// thao tác đó: xem trạng thái hiện tại, TẢI FILE .html lên, hoặc dán HTML.
// Quyền: menu chỉ hiện với quyền templates.edit (sidebar lọc) và server còn
// chặn PUT bằng templates.edit + requireRoles("teacher", "admin").
const PAGE_SLUG = 'chuc-mung-sinh-nhat'
// Khớp giới hạn phía server: validateHtml trong htmlFileStorageService
// (config.htmlMaxMb, mặc định HTML_MAX_MB = 4MB) — chặn sớm phía client để
// báo lỗi ngay, server vẫn là nơi chốt cuối cùng.
const HTML_MAX_MB = 4

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-3 py-2 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'

/** "2026-11-06T07:08:10.001Z" → "14:08 06/11/2026" (giờ máy người xem). */
function fmtDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

function fmtBytes(n) {
  const v = Number(n) || 0
  if (v < 1024) return `${v} B`
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`
  return `${(v / 1024 / 1024).toFixed(2)} MB`
}

/** Kiểm tra nhanh giống phía server (validateHtml): phải trông như HTML. */
function looksLikeHtml(text) {
  const t = String(text || '').trim()
  return t.startsWith('<') && t.includes('>')
}

export default function BirthdayPageManagement({ showToast }) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Upload file .html
  const fileRef = useRef(null)
  const [picked, setPicked] = useState(null) // { name, size, html }
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  // Dán HTML thô
  const [draft, setDraft] = useState('')
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)
  const [pasteError, setPasteError] = useState('')
  const [savingPaste, setSavingPaste] = useState(false)

  const [previewKey, setPreviewKey] = useState(0)

  const [reloadKey, setReloadKey] = useState(0)
  useEffect(() => {
    let active = true
    pageService.getPage(PAGE_SLUG)
      .then((data) => { if (active) { setPage(data || null); setLoadError('') } })
      .catch((e) => { if (active) setLoadError(e?.message || 'Không tải được thông tin trang sinh nhật.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const load = () => { setLoading(true); setReloadKey((k) => k + 1) }

  const htmlUrl = String(page?.htmlUrl || '').trim()
  const rawUrl = `${API_BASE}/pages/${PAGE_SLUG}/raw`

  // Xem trước: FETCH nội dung HTML bằng helper dùng chung với template
  // (loadTemplateHtml) rồi render qua srcDoc — KHÔNG trỏ iframe thẳng vào
  // URL file storage: storage có thể phục vụ file .html với Content-Type
  // không phải text/html (vd text/plain) → iframe chỉ hiện mã nguồn.
  // State chỉ ghi trong callback bất đồng bộ, kèm `key` = htmlUrl đã nạp.
  const [preview, setPreview] = useState({ key: '', html: '' })
  useEffect(() => {
    if (!htmlUrl) return
    let active = true
    loadTemplateHtml(page).then((text) => {
      if (active) setPreview({ key: htmlUrl, html: text || '' })
    })
    return () => { active = false }
  }, [page, previewKey, htmlUrl])
  const previewHtml = preview.key === htmlUrl ? preview.html : ''
  const previewLoading = Boolean(htmlUrl) && preview.key !== htmlUrl

  const applyUpdated = (updated, successMsg) => {
    setPage(updated || page)
    setPreviewKey((k) => k + 1) // nạp lại iframe xem trước với nội dung mới
    setDraftLoaded(false)
    setDraft('')
    showToast?.(successMsg)
  }

  const onPickFile = (file) => {
    setUploadError('')
    setPicked(null)
    if (!file) return
    if (!/\.html?$/i.test(file.name)) {
      setUploadError('Hãy chọn file có đuôi .html')
      return
    }
    if (file.size > HTML_MAX_MB * 1024 * 1024) {
      setUploadError(`File quá lớn (${fmtBytes(file.size)}) — tối đa ${HTML_MAX_MB}MB như giới hạn của server`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const html = String(reader.result || '')
      if (!looksLikeHtml(html)) {
        setUploadError('Nội dung file không giống HTML (phải bắt đầu bằng "<")')
        return
      }
      setPicked({ name: file.name, size: file.size, html })
    }
    reader.onerror = () => setUploadError('Không đọc được file, thử lại nhé')
    reader.readAsText(file)
  }

  const uploadPicked = async () => {
    if (!picked) return
    setUploading(true)
    setUploadError('')
    try {
      const updated = await pageService.updatePage(PAGE_SLUG, { html: picked.html })
      setPicked(null)
      if (fileRef.current) fileRef.current.value = ''
      applyUpdated(updated, `Đã tải lên file ${picked.name} — trang sinh nhật đã dùng nội dung mới`)
    } catch (e) {
      setUploadError(e?.message || 'Tải lên thất bại, thử lại sau nhé')
    } finally {
      setUploading(false)
    }
  }

  const loadCurrentIntoDraft = async () => {
    setDraftLoading(true)
    setPasteError('')
    try {
      // Nạp HTML thô hiện tại từ htmlUrl — đúng cách trang #/sinh-nhat và
      // TemplateFormPage vẫn làm khi mở sửa nội dung.
      setDraft((await loadTemplateHtml(page)) || '')
      setDraftLoaded(true)
    } catch {
      setDraft('')
      setPasteError('Không nạp được nội dung hiện tại, vẫn có thể dán HTML mới vào ô dưới')
      setDraftLoaded(true)
    } finally {
      setDraftLoading(false)
    }
  }

  const savePaste = async () => {
    if (!looksLikeHtml(draft)) {
      setPasteError('Nội dung không giống HTML (phải bắt đầu bằng "<")')
      return
    }
    if (new Blob([draft]).size > HTML_MAX_MB * 1024 * 1024) {
      setPasteError(`HTML quá lớn — tối đa ${HTML_MAX_MB}MB như giới hạn của server`)
      return
    }
    setSavingPaste(true)
    setPasteError('')
    try {
      const updated = await pageService.updatePage(PAGE_SLUG, { html: draft })
      applyUpdated(updated, 'Đã lưu nội dung trang sinh nhật')
    } catch (e) {
      setPasteError(e?.message || 'Lưu thất bại, thử lại sau nhé')
    } finally {
      setSavingPaste(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ManagementHeader
        title="Trang sinh nhật"
        subtitle="Nội dung trang chúc mừng sinh nhật ở #/sinh-nhat — tải file HTML lên là trang dùng ngay nội dung mới, không cần sửa code hay deploy lại."
      >
        <GhostButton onClick={() => navigate('/sinh-nhat')}>
          <Eye /> Xem trang
        </GhostButton>
        <GhostButton onClick={load}>
          <RefreshCw /> Tải lại
        </GhostButton>
      </ManagementHeader>

      {loading && (
        <div className="py-16 flex justify-center"><Loader label="Đang tải thông tin trang..." /></div>
      )}

      {!loading && loadError && (
        <section className="note-card p-4">
          <p className="text-sm text-[#B3261E] font-semibold mb-1">Không tải được thông tin trang</p>
          <p className="text-sm text-ink/70 mb-3">{loadError}</p>
          <PrimaryButton onClick={load}>Thử lại</PrimaryButton>
        </section>
      )}

      {!loading && !loadError && (
        <div className="space-y-4">
          {/* ── Trạng thái hiện tại ─────────────────────────────────── */}
          <section className="note-card p-4">
            <h2 className="font-display text-base text-ink flex items-center gap-2 mb-3">
              <Cake className="w-4 h-4 text-[#8A7C63]" aria-hidden="true" /> Nội dung đang dùng
            </h2>
            {htmlUrl ? (
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="min-w-0">
                  <dt className={label}>File HTML trên kho lưu trữ (htmlUrl)</dt>
                  <dd className="break-all">
                    {/* Bấm vào mở qua /raw (server phát lại text/html) — mở thẳng
                        link storage có thể chỉ thấy mã nguồn, xem route /raw. */}
                    <a href={rawUrl} target="_blank" rel="noreferrer" className="text-[#9A3412] underline underline-offset-2">
                      {htmlUrl}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={label}>Tên file</dt>
                  <dd>{page?.fileName || '—'}</dd>
                </div>
                <div>
                  <dt className={label}>Cập nhật gần nhất</dt>
                  <dd>{fmtDateTime(page?.updatedAt)}</dd>
                </div>
                <div>
                  <dt className={label}>Trạng thái</dt>
                  <dd>{page?.status === 'published' || !page?.status ? 'Đang hiển thị' : page.status}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-ink/70">
                Trang chưa có nội dung — hãy tải file HTML lên ở mục dưới, trang sẽ hiển thị ngay.
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <GhostButton onClick={() => navigate('/sinh-nhat')}>
                <Eye /> Mở trang #/sinh-nhat
              </GhostButton>
              <a
                href={rawUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink px-3 py-2"
              >
                <Link2 className="w-4 h-4" /> Mở file HTML trực tiếp <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs text-ink/50 mt-2">
              Lưu ý: nội dung sống ở kho lưu trữ sau khi đã nạp — sửa file trong thư mục public/ của repo rồi đẩy code lại sẽ không tự đổi trang.
            </p>
          </section>

          {/* ── Tải file .html lên ──────────────────────────────────── */}
          <section className="note-card p-4">
            <h2 className="font-display text-base text-ink flex items-center gap-2 mb-1">
              <FileUp className="w-4 h-4 text-[#8A7C63]" aria-hidden="true" /> Tải file HTML lên
            </h2>
            <p className="text-sm text-ink/60 mb-3">
              Chọn file .html hoàn chỉnh từ máy (tối đa {HTML_MAX_MB}MB). File được gửi lên server, lưu thành file trên kho lưu trữ và thay nội dung trang ngay.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".html,.htm,text/html"
              onChange={(e) => onPickFile(e.target.files?.[0])}
              className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-ink file:text-paper file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:opacity-90"
            />
            {picked && (
              <p className="text-sm text-ink/80 mt-3">
                Đã chọn <strong>{picked.name}</strong> ({fmtBytes(picked.size)}) — bấm nút dưới để thay nội dung trang.
              </p>
            )}
            {uploadError && <p className="text-sm text-[#B3261E] mt-3">{uploadError}</p>}
            <div className="mt-3">
              <PrimaryButton onClick={uploadPicked} disabled={!picked || uploading}>
                <FileUp /> {uploading ? 'Đang tải lên...' : 'Tải lên & thay nội dung'}
              </PrimaryButton>
            </div>
          </section>

          {/* ── Dán HTML thô ────────────────────────────────────────── */}
          <section className="note-card p-4">
            <h2 className="font-display text-base text-ink flex items-center gap-2 mb-1">
              <PencilLine className="w-4 h-4 text-[#8A7C63]" aria-hidden="true" /> Hoặc dán HTML trực tiếp
            </h2>
            <p className="text-sm text-ink/60 mb-3">
              Cách thứ hai, giống ô sửa nội dung tại trang #/sinh-nhat: dán toàn bộ mã HTML rồi lưu.
            </p>
            {!draftLoaded ? (
              <GhostButton onClick={loadCurrentIntoDraft} disabled={draftLoading}>
                <PencilLine /> {draftLoading ? 'Đang nạp...' : 'Nạp nội dung hiện tại để sửa'}
              </GhostButton>
            ) : (
              <>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={savingPaste}
                  placeholder="Dán toàn bộ mã HTML của trang vào đây…"
                  className={`${box} font-mono text-xs leading-relaxed min-h-[40vh] resize-y`}
                />
                {pasteError && <p className="text-sm text-[#B3261E] mt-2">{pasteError}</p>}
                <div className="mt-3">
                  <PrimaryButton onClick={savePaste} disabled={savingPaste || !draft.trim()}>
                    <Save /> {savingPaste ? 'Đang lưu...' : 'Lưu nội dung đã dán'}
                  </PrimaryButton>
                </div>
              </>
            )}
            {pasteError && !draftLoaded && <p className="text-sm text-[#B3261E] mt-2">{pasteError}</p>}
          </section>

          {/* ── Xem trước ───────────────────────────────────────────── */}
          {htmlUrl && (
            <section className="note-card p-4">
              <h2 className="font-display text-base text-ink flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-[#8A7C63]" aria-hidden="true" /> Xem trước
              </h2>
              <div className="rounded-xl overflow-hidden border border-ink/10 bg-[#07030f]">
                {previewHtml ? (
                  <iframe
                    key={previewKey}
                    srcDoc={previewHtml}
                    /* Cùng bộ sandbox với trang hiển thị #/sinh-nhat (BirthdayPage)
                       — nội dung do giáo viên/admin soạn, cùng mức tin cậy template. */
                    sandbox="allow-scripts allow-same-origin allow-modals"
                    className="w-full h-[480px] border-0 block"
                    title="Xem trước trang sinh nhật"
                  />
                ) : (
                  <p className="text-sm text-white/70 px-4 py-6">
                    {previewLoading ? 'Đang tải nội dung xem trước…' : 'Không tải được nội dung xem trước từ nơi lưu trữ — thử tải lại trang.'}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
