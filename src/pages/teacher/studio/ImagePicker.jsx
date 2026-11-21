import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Link2, Search, Upload } from "lucide-react";
import { imageService } from "../../../services/api.js";
import { Loader, Modal } from "../../../components/ui";
import RangePagination from "../../../components/RangePagination.jsx";
import { rangeForPage } from "../../../lib/rangePagination.js";

// ImagePicker — hộp thoại chọn hình ảnh DÙNG CHUNG, ba nguồn trong một:
//   1) Thư viện ảnh hiện có (API /images — cùng nguồn với trang
//      /dashboard/images): lưới thumbnail + tên, phân trang from/to,
//      tìm kiếm. Server tự lọc theo chủ sở hữu (user chỉ thấy ảnh của
//      mình; ảnh chưa có chủ chỉ admin thấy) — component chỉ hiển thị
//      đúng những gì API trả về, không tự nới quyền.
//   2) Dán URL ảnh: có ảnh xem trước kiểm tra link — chỉ bấm "Dùng URL"
//      được khi ảnh tải thật thành công; link hỏng báo lỗi rõ ràng.
//   3) Tải ảnh mới lên: POST /images/upload (đúng endpoint trang thư
//      viện đang dùng) — ảnh vào thư viện với chủ là người tải, rồi
//      được chọn ngay.
// Người dùng hiện tại: AI Studio (phần tử hình ảnh + tab Thư viện),
// TemplateFormPage, Teacher Document Studio (panel Chèn hình ảnh của
// Word/PowerPoint và ô ảnh trong PowerPointEditor).

const PAGE_SIZE = 24;

/** Tên hiển thị của một ảnh thư viện: phần cuối publicId, bỏ đuôi file. */
function imageDisplayName(img) {
  const base = String(img?.publicId || "").split("/").pop() || "";
  return base.replace(/\.[^.]+$/, "") || "Ảnh";
}

export function ImageLibraryGrid({ onPick }) {
  const [images, setImages] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false); // đang xem kết quả tìm kiếm (API search không phân trang)
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [urlState, setUrlState] = useState("idle"); // idle | checking | ok | error
  const fileRef = useRef(null);

  const loadPage = useCallback(async (p) => {
    setImages(null);
    try {
      const data = await imageService.list({ folder: "edu-game", ...rangeForPage(p, PAGE_SIZE) });
      setImages(data?.images || []);
      setTotal(data?.total ?? data?.pagination?.total ?? 0);
      setError("");
    } catch (e) {
      setImages([]);
      setTotal(0);
      setError(e?.message || "Không tải được thư viện ảnh");
    }
  }, []);

  // Nạp trang đầu khi mở — pattern nạp dữ liệu chuẩn của dự án (xem ghi
  // chú tương tự ở StudioLessons.jsx).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadPage(1); }, [loadPage]);

  const goPage = useCallback((p) => {
    const next = Math.min(Math.max(1, p), Math.max(1, Math.ceil(total / PAGE_SIZE)));
    setPage(next);
    loadPage(next);
  }, [loadPage, total]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setSearching(false);
    setPage(1);
    loadPage(1);
  }, [loadPage]);

  const runSearch = async () => {
    const q = query.trim();
    if (!q) { clearSearch(); return; }
    setImages(null);
    try {
      const data = await imageService.search(q);
      setImages(data?.images || []);
      setSearching(true);
      setError("");
    } catch (e) {
      setImages([]);
      setError(e?.message || "Không tìm được ảnh");
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await imageService.upload(file, "edu-game");
      if (data?.url) {
        // Ảnh vừa tải đã thuộc thư viện (chủ = người tải): nạp lại trang
        // hiện tại để lưới thấy ảnh mới, rồi chọn ngay ảnh đó.
        if (!searching) await loadPage(page);
        onPick(data.url);
        return;
      }
      await loadPage(1);
    } catch (e) {
      setError(e?.message || "Tải ảnh lên thất bại");
    } finally { setUploading(false); }
  };

  const handleUrlChange = (value) => {
    setUrl(value);
    setUrlState(value.trim() ? "checking" : "idle");
  };

  const fromRecord = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const toRecord = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7C63]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
            placeholder="Tìm ảnh…"
            className="studio-field"
            style={{ paddingLeft: 32 }}
          />
        </div>
        <button type="button" disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: "#1B998B" }}>
          <Upload className="w-4 h-4" /> {uploading ? "Đang tải…" : "Tải lên"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { handleUpload(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {error && <p className="mt-2 text-[13px] text-[#D64545]">{error}</p>}
      {searching && (
        <p className="mt-2 text-[12px] text-[#8A7C63]">
          Đang xem kết quả tìm kiếm.{" "}
          <button type="button" onClick={clearSearch} className="font-semibold underline underline-offset-2">
            Xem toàn bộ thư viện
          </button>
        </p>
      )}

      <div className="mt-3">
        {images === null ? (
          <div className="py-8 flex justify-center"><Loader label="Đang tải thư viện ảnh..." /></div>
        ) : images.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-[#8A7C63]">
            {searching
              ? "Không tìm thấy ảnh nào khớp từ khoá."
              : "Chưa có ảnh nào trong thư viện của bạn. Tải ảnh lên hoặc dán URL bên dưới."}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-[46vh] overflow-auto pr-0.5">
            {images.map((img) => (
              <button key={img.publicId} type="button" onClick={() => onPick(img.url)}
                className="group min-w-0 text-left"
                title={img.publicId}>
                <span className="block relative aspect-square rounded-lg overflow-hidden border border-[#E7D9BE] group-hover:ring-2 group-hover:ring-[#2F6FED] transition">
                  <img src={img.url} alt={imageDisplayName(img)} loading="lazy" className="w-full h-full object-cover" />
                </span>
                <span className="mt-1 block truncate text-[11px] leading-tight text-[#8A7C63]">
                  {imageDisplayName(img)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!searching && total > 0 && (
        <RangePagination
          className="mt-2"
          fromRecord={fromRecord}
          toRecord={toRecord}
          totalItems={total}
          onRangeChange={(from) => goPage(Math.floor((from - 1) / PAGE_SIZE) + 1)}
          onPrevPage={() => goPage(page - 1)}
          onNextPage={() => goPage(page + 1)}
          disabled={images === null}
        />
      )}

      <div className="mt-3 flex items-start gap-2">
        <div className="relative flex-1">
          <Link2 className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7C63]" />
          <input value={url} onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Hoặc dán URL ảnh…" className="studio-field" style={{ paddingLeft: 32 }} />
          {urlState === "checking" && (
            <p className="mt-1 text-[12px] text-[#8A7C63]">Đang kiểm tra link ảnh…</p>
          )}
          {urlState === "error" && (
            <p className="mt-1 text-[12px] text-[#D64545]">
              Không tải được ảnh từ link này — kiểm tra lại đường dẫn rồi thử lại.
            </p>
          )}
          {urlState === "ok" && (
            <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1B998B]">
              <Check className="w-3.5 h-3.5" /> Link ảnh hợp lệ.
            </p>
          )}
        </div>
        {url.trim() && (
          <img key={url.trim()} src={url.trim()} alt="" aria-hidden="true"
            onLoad={() => setUrlState("ok")}
            onError={() => setUrlState("error")}
            className="w-11 h-11 rounded-lg object-cover border border-[#E7D9BE] shrink-0"
            style={urlState === "error" ? { display: "none" } : undefined} />
        )}
        <button type="button" disabled={urlState !== "ok"} onClick={() => onPick(url.trim())}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-semibold text-white disabled:opacity-40"
          style={{ background: "#2F6FED" }}>
          <ImagePlus className="w-4 h-4" /> Dùng URL
        </button>
      </div>
    </div>
  );
}

export default function ImagePickerModal({ open, onClose, onPick }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose} wide>
      <h3 className="font-display text-lg text-ink mb-3">Chọn hình ảnh</h3>
      <ImageLibraryGrid onPick={(url) => { onPick(url); onClose(); }} />
    </Modal>
  );
}
