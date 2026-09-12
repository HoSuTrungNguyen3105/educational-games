import { useCallback, useEffect, useRef, useState } from "react";
import { imageService, API_BASE } from "../../services/api.js";
import { Loader, EmptyState, Modal } from "../../components/ui.jsx";
import { Image, Upload, Search, Trash2, Copy, X, FolderOpen, Grid, List } from "lucide-react";

function loadAuth() {
  try { return JSON.parse(localStorage.getItem("edu_games_auth") || "{}"); } catch { return {}; }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function formatDate(d) {
  try { return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  catch { return d; }
}

export default function ImageLibrary({ showToast }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState([]);
  const [preview, setPreview] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [folder, setFolder] = useState("edu-game");
  const fileInput = useRef(null);
  const multiInput = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await imageService.list({ folder, perPage: 100 });
      setImages(data.images || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [folder]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const result = files.length === 1
        ? await imageService.upload(files[0], folder)
        : await imageService.uploadMultiple(Array.from(files), folder);
      showToast(`Đã upload ${files.length} ảnh`, "success");
      load();
    } catch (e) { showToast(e.message || "Lỗi upload", "error"); }
    finally { setUploading(false); }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) { load(); return; }
    setSearching(true);
    try {
      const data = await imageService.search(searchQuery.trim());
      setImages(data.images || []);
    } catch (e) { showToast(e.message || "Lỗi tìm kiếm", "error"); }
    finally { setSearching(false); }
  };

  const handleDelete = async (img) => {
    if (!confirm(`Xóa ảnh "${img.publicId}"?`)) return;
    try {
      await imageService.remove(img.publicId);
      setImages(prev => prev.filter(i => i.publicId !== img.publicId));
      setSelected(prev => prev.filter(id => id !== img.publicId));
      showToast("Đã xóa", "success");
    } catch (e) { showToast(e.message || "Lỗi xóa", "error"); }
  };

  const handleDeleteSelected = async () => {
    if (!selected.length || !confirm(`Xóa ${selected.length} ảnh đã chọn?`)) return;
    try {
      await imageService.removeMany(selected);
      setImages(prev => prev.filter(i => !selected.includes(i.publicId)));
      setSelected([]);
      showToast(`Đã xóa ${selected.length} ảnh`, "success");
    } catch (e) { showToast(e.message || "Lỗi xóa", "error"); }
  };

  const toggleSelect = (publicId) => {
    setSelected(prev => prev.includes(publicId) ? prev.filter(id => id !== publicId) : [...prev, publicId]);
  };

  const toggleSelectAll = () => {
    if (selected.length === images.length) { setSelected([]); }
    else { setSelected(images.map(i => i.publicId)); }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => showToast("Đã copy URL", "success")).catch(() => {});
  };

  if (loading) return <Loader label="Đang tải thư viện ảnh..." />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Thư viện ảnh</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
            className="px-3 py-2 rounded-xl border border-ink/15 text-ink/60 hover:bg-ink/5 transition">
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button onClick={() => fileInput.current?.click()} disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? "Đang upload..." : "Upload ảnh"}
          </button>
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files)} />
          <input ref={multiInput} type="file" accept="image/*" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Tìm ảnh theo tag, folder..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 outline-none" />
        </div>
        <button onClick={handleSearch} disabled={searching}
          className="px-4 py-2.5 bg-ink/5 rounded-xl text-sm font-medium hover:bg-ink/10 transition disabled:opacity-50">
          {searching ? "Đang tìm..." : "Tìm kiếm"}
        </button>
        <div className="flex items-center gap-1 ml-2">
          <FolderOpen className="w-4 h-4 text-ink/40" />
          <input value={folder} onChange={e => setFolder(e.target.value)}
            className="px-3 py-2 rounded-xl border border-ink/15 text-sm w-36 focus:border-blue-400 outline-none" placeholder="edu-game" />
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
          <span className="text-sm text-blue-700 font-medium">Đã chọn {selected.length} ảnh</span>
          <button onClick={handleDeleteSelected}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Xóa
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-blue-500 hover:text-blue-700 transition">Bỏ chọn</button>
        </div>
      )}

      {images.length === 0 ? (
        <EmptyState icon="🖼️" title="Chưa có ảnh nào" subtitle="Upload ảnh để bắt đầu sử dụng thư viện" />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map(img => (
            <div key={img.publicId}
              className={`relative group rounded-xl border-2 overflow-hidden cursor-pointer transition
                ${selected.includes(img.publicId) ? "border-blue-500 ring-2 ring-blue-500/30" : "border-ink/10 hover:border-ink/25"}`}
              onClick={() => setPreview(img)}>
              <div className="aspect-square bg-ink/5 flex items-center justify-center overflow-hidden">
                <img src={img.url} alt={img.publicId} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute top-2 left-2">
                <input type="checkbox" checked={selected.includes(img.publicId)}
                  onChange={e => { e.stopPropagation(); toggleSelect(img.publicId); }}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/80 truncate max-w-[60%]">{img.format} · {formatBytes(img.bytes)}</span>
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); copyUrl(img.url); }}
                      className="w-6 h-6 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(img); }}
                      className="w-6 h-6 rounded bg-red-500/60 hover:bg-red-500/80 flex items-center justify-center text-white transition">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink/5 text-left text-ink/60 text-xs font-semibold">
                <th className="px-3 py-2 w-8">
                  <input type="checkbox" checked={selected.length === images.length && images.length > 0}
                    onChange={toggleSelectAll} className="accent-blue-500" />
                </th>
                <th className="px-3 py-2">Ảnh</th>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2">Kích thước</th>
                <th className="px-3 py-2">Public ID</th>
                <th className="px-3 py-2">Ngày tạo</th>
                <th className="px-3 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {images.map(img => (
                <tr key={img.publicId} className="border-t hover:bg-ink/[0.02] transition cursor-pointer"
                  onClick={() => setPreview(img)}>
                  <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(img.publicId)}
                      onChange={() => toggleSelect(img.publicId)} className="accent-blue-500" />
                  </td>
                  <td className="px-3 py-2">
                    <img src={img.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{img.format} · {formatBytes(img.bytes)}</td>
                  <td className="px-3 py-2 text-ink/60">{img.width}×{img.height}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-ink/50 max-w-[200px] truncate">{img.publicId}</td>
                  <td className="px-3 py-2 text-ink/50 text-xs">{formatDate(img.createdAt)}</td>
                  <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button onClick={() => copyUrl(img.url)} className="px-2 py-1 text-xs rounded bg-ink/5 hover:bg-ink/10 text-ink/60 transition">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(img)} className="px-2 py-1 text-xs rounded bg-red-50 hover:bg-red-100 text-red-500 transition">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && (
        <Modal onClose={() => setPreview(null)} wide>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center justify-center bg-ink/5 rounded-xl overflow-hidden min-h-[300px]">
              <img src={preview.url} alt={preview.publicId} className="max-w-full max-h-[70vh] object-contain" />
            </div>
            <div className="w-full md:w-64 space-y-3">
              <h3 className="font-display text-sm text-ink break-all">{preview.publicId}</h3>
              <div className="space-y-2 text-xs text-ink/60">
                <div className="flex justify-between"><span>Format</span><span className="font-mono">{preview.format}</span></div>
                <div className="flex justify-between"><span>Kích thước</span><span className="font-mono">{preview.width}×{preview.height}</span></div>
                <div className="flex justify-between"><span>Dung lượng</span><span className="font-mono">{formatBytes(preview.bytes)}</span></div>
                <div className="flex justify-between"><span>Ngày tạo</span><span className="font-mono">{formatDate(preview.createdAt)}</span></div>
              </div>
              <div className="pt-2 space-y-2">
                <button onClick={() => copyUrl(preview.url)}
                  className="w-full px-3 py-2 bg-ink/5 rounded-xl text-sm font-medium hover:bg-ink/10 transition flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" /> Copy URL
                </button>
                <button onClick={() => { handleDelete(preview); setPreview(null); }}
                  className="w-full px-3 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Xóa ảnh
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
