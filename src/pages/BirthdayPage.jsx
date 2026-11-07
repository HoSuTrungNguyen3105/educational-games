import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, X } from "lucide-react";
import { navigate } from "../lib/router.js";
import { loadTemplateHtml, clearTemplateHtmlCache } from "../lib/hooks.js";
import { pageService } from "../services/pageService.js";

// Trang sinh nhật RIÊNG, toàn màn hình — route #/sinh-nhat.
// Nội dung KHÔNG nằm trong bundle: trang đọc doc `pages` slug
// "chuc-mung-sinh-nhat" từ API (Mongo chỉ giữ htmlUrl, bám cơ chế template),
// rồi FETCH nội dung HTML bằng helper dùng chung với template
// (`loadTemplateHtml`) và render qua `srcDoc` trong iframe tràn màn hình.
// KHÔNG trỏ iframe thẳng vào URL file storage (src=): storage có thể phục
// vụ file .html với Content-Type không phải text/html (vd text/plain) →
// trình duyệt hiện MÃ NGUỒN thay vì render. Template game tránh được vì
// cũng fetch text rồi mới srcDoc — trang này bám đúng cơ chế đó.
// Giáo viên/admin có nút "Sửa nội dung" ngay tại trang (server chặn quyền
// PUT bằng requireRoles teacher/admin, như sửa template).
const PAGE_SLUG = "chuc-mung-sinh-nhat";

export default function BirthdayPage({ userAuth, showToast }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const canEdit = ["teacher", "admin"].includes(userAuth?.user?.role || "");

  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let active = true;
    pageService.getPage(PAGE_SLUG)
      .then((data) => { if (active) { setPage(data || null); setError(""); } })
      .catch((e) => { if (active) setError(e?.message || "Không tải được trang. Kiểm tra kết nối rồi thử lại nhé."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const load = () => {
    // Xoá cache HTML đã fetch (helper dùng chung có cache theo URL) để lần
    // thử lại lấy nội dung mới thật, không dính bản lỗi đã lưu trong phiên.
    clearTemplateHtmlCache();
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  // Nội dung HTML thật của trang (fetch từ htmlUrl — xem ghi chú đầu file).
  // State chỉ ghi trong callback bất đồng bộ, kèm `key` = htmlUrl đã nạp để
  // suy ra trạng thái đang tải/lỗi theo URL hiện tại (không setState đồng bộ
  // trong effect).
  const [content, setContent] = useState({ key: "", html: "", error: false });
  useEffect(() => {
    const raw = String(page?.htmlUrl || "").trim();
    if (!raw) return;
    let active = true;
    loadTemplateHtml(page).then((text) => {
      if (!active) return;
      setContent({ key: raw, html: text || "", error: !text });
    });
    return () => { active = false; };
  }, [page]);

  const openEditor = async () => {
    setEditing(true);
    setDraftLoading(true);
    try {
      // Nạp HTML thô hiện tại từ htmlUrl (đúng cách TemplateFormPage mở sửa template).
      setDraft((await loadTemplateHtml(page)) || "");
    } catch {
      setDraft("");
    } finally {
      setDraftLoading(false);
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const updated = await pageService.updatePage(PAGE_SLUG, { html: draft });
      setPage(updated || page);
      setFrameKey((k) => k + 1); // nạp lại iframe với nội dung mới
      setEditing(false);
      showToast?.("Đã lưu nội dung trang sinh nhật");
    } catch (e) {
      showToast?.(e?.message || "Lưu thất bại, thử lại sau nhé");
    } finally {
      setSaving(false);
    }
  };

  const htmlUrl = String(page?.htmlUrl || "").trim();
  const html = content.key === htmlUrl ? content.html : "";
  const htmlError = Boolean(htmlUrl) && content.key === htmlUrl && content.error;
  const busy = loading || (Boolean(htmlUrl) && content.key !== htmlUrl);
  const loadError = error || (htmlError
    ? "Không tải được nội dung trang từ nơi lưu trữ. Kiểm tra kết nối rồi thử lại nhé."
    : "");

  return (
    <div className="fixed inset-0 bg-[#07030f]">
      {!busy && !loadError && html && (
        <iframe
          key={frameKey}
          srcDoc={html}
          /* Nội dung do giáo viên/admin soạn (cùng mức tin cậy với template game
             trong HtmlGameLoader) nên dùng cùng bộ sandbox ở đó. */
          sandbox="allow-scripts allow-same-origin allow-modals"
          className="absolute inset-0 w-full h-full border-0"
          title={page?.title || "Chúc mừng sinh nhật"}
        />
      )}

      {busy && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-white/80">Đang tải trang sinh nhật…</p>
        </div>
      )}

      {!loading && loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-4xl mb-3">🎂</p>
          <p className="text-white font-semibold mb-1">Chưa mở được trang sinh nhật</p>
          <p className="text-sm text-white/70 max-w-sm mb-5">{loadError}</p>
          <button
            onClick={load}
            className="px-5 py-2.5 rounded-full bg-white text-[#4a1d33] font-semibold text-sm"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && !htmlUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-4xl mb-3">🎂</p>
          <p className="text-white font-semibold mb-1">Trang sinh nhật chưa có nội dung</p>
          <p className="text-sm text-white/70 max-w-sm">
            {canEdit
              ? "Bấm “Sửa nội dung” ở góc phải để dán HTML cho trang nhé."
              : "Quay lại sau nhé — trang đang được chuẩn bị."}
          </p>
        </div>
      )}

      {/* Nút quay lại — nổi mờ để không phá không khí trang trình diễn */}
      <button
        onClick={() => navigate("/")}
        className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/35 hover:bg-black/55 text-white text-xs font-semibold px-3.5 py-2 backdrop-blur-sm transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
      </button>

      {canEdit && !loading && (
        <button
          onClick={openEditor}
          className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/35 hover:bg-black/55 text-white text-xs font-semibold px-3.5 py-2 backdrop-blur-sm transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Sửa nội dung
        </button>
      )}

      {editing && (
        <div className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-semibold text-ink text-sm">Sửa nội dung trang sinh nhật (HTML)</p>
              <button onClick={() => setEditing(false)} className="p-1.5 rounded-full hover:bg-black/5" aria-label="Đóng">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={draftLoading || saving}
              placeholder={draftLoading ? "Đang tải nội dung hiện tại…" : "Dán toàn bộ mã HTML của trang vào đây…"}
              className="flex-1 min-h-[45vh] m-4 mb-0 rounded-xl border p-3 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <div className="flex items-center justify-end gap-2 px-4 py-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-[#8A7C63] hover:bg-black/5"
              >
                Huỷ
              </button>
              <button
                onClick={saveDraft}
                disabled={saving || draftLoading || !draft.trim()}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#ff6fa5] to-[#ffb27a] disabled:opacity-50"
              >
                {saving ? "Đang lưu…" : "Lưu nội dung"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
