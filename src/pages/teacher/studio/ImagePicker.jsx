import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Link2, Search, Upload } from "lucide-react";
import { imageService } from "../../../services/api.js";
import { Loader, Modal } from "../../../components/ui";

// ImagePicker — chọn ảnh từ Thư viện ảnh hiện có (images API, cùng nguồn
// với trang /dashboard/images): xem lưới, tìm kiếm, tải ảnh mới lên, hoặc
// dán URL trực tiếp. Dùng cho phần tử hình ảnh trong AI Studio — cả ở
// dạng modal (ImagePickerModal) lẫn nhúng trong tab Thư viện của editor
// (ImageLibraryGrid).
export function ImageLibraryGrid({ onPick }) {
  const [images, setImages] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef(null);

  const load = useCallback(async (q = "") => {
    try {
      const data = q.trim()
        ? await imageService.search(q.trim())
        : await imageService.list({ folder: "edu-game", perPage: 60 });
      setImages(data?.images || []);
      setError("");
    } catch (e) {
      setImages([]);
      setError(e?.message || "Không tải được thư viện ảnh");
    }
  }, []);

  // Như ImageLibrary: nạp danh sách khi mở — tắt rule cho pattern nạp
  // dữ liệu chuẩn này (xem ghi chú ở StudioLessons.jsx).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await imageService.upload(file, "edu-game");
      if (data?.url) { onPick(data.url); return; }
      await load();
    } catch (e) {
      setError(e?.message || "Tải ảnh lên thất bại");
    } finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7C63]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") load(query); }}
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

      <div className="mt-3">
        {images === null ? (
          <div className="py-8 flex justify-center"><Loader label="Đang tải thư viện ảnh..." /></div>
        ) : images.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-[#8A7C63]">
            Chưa có ảnh nào. Tải ảnh lên hoặc dán URL bên dưới.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-[46vh] overflow-auto pr-0.5">
            {images.map((img) => (
              <button key={img.publicId} type="button" onClick={() => onPick(img.url)}
                className="relative aspect-square rounded-lg overflow-hidden border border-[#E7D9BE] hover:ring-2 hover:ring-[#2F6FED] transition"
                title={img.publicId}>
                <img src={img.url} alt={img.publicId} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Link2 className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7C63]" />
          <input value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="Hoặc dán URL ảnh…" className="studio-field" style={{ paddingLeft: 32 }} />
        </div>
        <button type="button" disabled={!url.trim()} onClick={() => onPick(url.trim())}
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
      <h3 className="font-display text-lg text-ink mb-3">Chọn ảnh từ thư viện</h3>
      <ImageLibraryGrid onPick={(url) => { onPick(url); onClose(); }} />
    </Modal>
  );
}
