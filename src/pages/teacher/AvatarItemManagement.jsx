import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader, ConfirmModal } from '../../components/ui.jsx';
import AvatarItemExtractor from '../../components/avatar/AvatarItemExtractor.jsx';
import { Plus, Pencil, Trash2, X, Save, Upload, List, ImageIcon } from 'lucide-react';

function getAuthToken() {
  try { return JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch { return ''; }
}

async function uploadToServer(blob, filename) {
  const token = getAuthToken();
  const fd = new FormData();
  fd.append('file', blob, filename);
  const res = await fetch(`${API_BASE}/avatar/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const json = await res.json();
  if (json.status && json.data?.url) return json.data.url;
  throw new Error(json.msg || 'Upload failed');
}

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const EMPTY_FORM = { category: "hair", name: "", image: "", price: 0, default: false };

function ItemThumb({ item }) {
  if (!item?.image) {
    return (
      <div className="w-12 h-12 rounded-lg border border-ink/10 bg-ink/5 flex items-center justify-center shrink-0">
        <ImageIcon className="w-5 h-5 text-ink/20" />
      </div>
    );
  }
  return (
    <img src={item.image} alt={item.name} draggable={false}
      className="w-12 h-12 rounded-lg object-contain border border-ink/10 bg-ink/5 shrink-0" />
  );
}

export default function AvatarItemManagement({ showToast }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("list");
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(() => {
    setItems(null); setError(null);
    fetch(`${API_BASE}/avatar/items`).then(r => r.json()).then(json => {
      if (json.status) setItems(json.data.items);
      else setError(json.message || "Lỗi tải items");
    }).catch(e => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); setError(null); setModalOpen(true); };
  const openEdit = (item) => {
    setForm({ category: item.category, name: item.name, image: item.image || "", price: item.price, default: item.default });
    setEditingId(item.id); setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setError(null); };

  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const uploadImage = async (file) => {
    setUploadingImg(true);
    try {
      const url = await uploadToServer(file, file.name || 'avatar-item.png');
      onChange("image", url);
    } catch (err) { showToast(err.message, "error"); }
    setUploadingImg(false);
  };

  const submit = async () => {
    if (!form.name.trim()) { setError("Vui lòng nhập tên item"); return; }
    setSaving(true); setError(null);
    try {
      const token = localStorage.getItem("edu_games_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = { "Content-Type": "application/json" };
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      if (editingId) {
        const res = await fetch(`${API_BASE}/avatar/admin/items/${editingId}`, { method: "PUT", headers, body: JSON.stringify(form) });
        const json = await res.json();
        if (!json.status) throw new Error(json.msg || "Lỗi cập nhật");
        showToast("Đã cập nhật item");
      } else {
        const res = await fetch(`${API_BASE}/avatar/admin/items`, { method: "POST", headers, body: JSON.stringify(form) });
        const json = await res.json();
        if (!json.status) throw new Error(json.msg || "Lỗi tạo item");
        showToast("Đã tạo item mới");
      }
      closeModal(); load();
    } catch (err) { setError(err.message || "Lỗi lưu item"); }
    setSaving(false);
  };

  const doRemove = async () => {
    try {
      const token = localStorage.getItem("edu_games_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = {};
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      const res = await fetch(`${API_BASE}/avatar/admin/items/${confirm.item.id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!json.status) throw new Error(json.msg || "Lỗi xóa");
      showToast("Đã xóa item");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  const batchSave = async (batchItems) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("edu_games_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = { "Content-Type": "application/json" };
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      const res = await fetch(`${API_BASE}/avatar/admin/items/batch`, { method: "POST", headers, body: JSON.stringify({ items: batchItems }) });
      const json = await res.json();
      if (!json.status) throw new Error(json.msg || "Lỗi lưu");
      showToast(`Đã tạo ${json.data.count} item`);
      load();
    } catch (err) { showToast(err.message || "Lỗi lưu", "error"); }
    setSaving(false);
  };

  const filtered = items ? (filter === "all" ? items : items.filter(i => i.category === filter)) : [];

  return (
    <div>
      <ManagementHeader subtitle="Quản lý vật phẩm Avatar" title="Avatar Items" />

      <div className="flex gap-1 mb-4 bg-ink/5 rounded-xl p-1">
        <button onClick={() => setTab("list")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${tab === "list" ? "bg-white text-ink shadow-sm" : "text-ink/40 hover:text-ink/60"}`}>
          <List className="w-4 h-4" />
          Danh sách ({items?.length || 0})
        </button>
        <button onClick={() => setTab("extractor")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${tab === "extractor" ? "bg-white text-ink shadow-sm" : "text-ink/40 hover:text-ink/60"}`}>
          <Upload className="w-4 h-4" />
          Trích xuất từ ảnh
        </button>
      </div>

      {tab === "list" && (<>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === "all" ? "bg-gold text-white" : "bg-ink/5 text-ink/50 hover:bg-ink/10"}`}>
          Tất cả ({items?.length || 0})
        </button>
        {CATEGORIES.map(c => {
          const count = items?.filter(i => i.category === c.id).length || 0;
          return (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === c.id ? "bg-gold text-white" : "bg-ink/5 text-ink/50 hover:bg-ink/10"}`}>
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {error && !items && (
        <div className="text-center py-10 text-red-500 text-sm">{error}</div>
      )}

      {items === null && !error && (
        <div className="text-center py-10 text-ink/40 text-sm animate-pulse">Đang tải...</div>
      )}

      {items !== null && filtered.length === 0 && (
        <div className="text-center py-10 text-ink/40 text-sm">Chưa có item nào</div>
      )}

      {filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-ink/8 hover:shadow-sm transition">
              <ItemThumb item={item} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold text-sm text-ink truncate">{item.name}</span>
                  {item.default && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-600">Mặc định</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-ink/40">
                  <span>{item.id}</span>
                  <span>{item.category}</span>
                  <span>💰 {item.price}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-ink/5 transition text-ink/40 hover:text-ink">
                  <Pencil className="w-4 h-4" />
                </button>
                {!item.default && (
                  <button onClick={() => setConfirm({ open: true, item })} className="p-2 rounded-lg hover:bg-red-50 transition text-ink/40 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={openCreate}
        className="fixed bottom-24 sm:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gold text-white shadow-lg hover:shadow-xl hover:bg-gold/80 transition flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
      </>)}

      {tab === "extractor" && (
        <div className="bg-white rounded-xl border border-ink/8 p-4">
          <AvatarItemExtractor onBatchSave={batchSave} saving={saving} />
          {saving && <div className="mt-3 text-center text-sm text-gold animate-pulse">Đang lưu...</div>}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
              <h3 className="font-display text-lg text-ink">{editingId ? "Sửa Item" : "Thêm Item mới"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-ink/5 transition"><X className="w-5 h-5 text-ink/50" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Image upload */}
              <div>
                <label className="text-xs font-mono uppercase text-ink/50">Ảnh item</label>
                <div className="mt-2 flex items-center gap-3">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-20 h-20 rounded-xl object-contain border border-ink/10 bg-ink/5" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-ink/20 flex items-center justify-center bg-ink/5">
                      <ImageIcon className="w-6 h-6 text-ink/20" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploadingImg}
                      className="px-3 py-2 rounded-lg bg-ink/5 text-ink/60 text-xs font-semibold hover:bg-ink/10 transition flex items-center gap-1.5 disabled:opacity-50">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImg ? "Đang upload..." : "Chọn ảnh"}
                    </button>
                    {form.image && (
                      <button onClick={() => onChange("image", "")} className="mt-1.5 text-[11px] text-red-400 hover:text-red-600">
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-ink/50">Category *</label>
                <select value={form.category} onChange={e => onChange("category", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-gold/30">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-ink/50">Tên item *</label>
                <input value={form.name} onChange={e => onChange("name", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-gold/30"
                  placeholder="VD: Tóc xoăn" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Giá (Coin)</label>
                  <input type="number" value={form.price} onChange={e => onChange("price", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.default} onChange={e => onChange("default", e.target.checked)}
                      className="w-4 h-4 rounded border-ink/20 text-gold focus:ring-gold/30" />
                    <span className="text-sm font-body text-ink">Mặc định (miễn phí)</span>
                  </label>
                </div>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-ink/10 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 bg-ink/5 text-ink/60 rounded-xl text-sm font-semibold hover:bg-ink/10 transition">Hủy</button>
              <button onClick={submit} disabled={saving}
                className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50 flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Xóa item?"
        message={confirm.item ? `Bạn muốn xóa "${confirm.item.name}"?` : ""}
        onConfirm={doRemove}
        onCancel={() => setConfirm({ open: false, item: null })}
      />
    </div>
  );
}
