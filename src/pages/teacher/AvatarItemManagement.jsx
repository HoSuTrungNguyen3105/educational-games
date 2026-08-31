import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader, ConfirmModal } from '../../components/ui.jsx';
import { Plus, Pencil, Trash2, X, Save, Image } from 'lucide-react';

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const EMPTY_FORM = { category: "hair", name: "", x: 0, y: 0, width: 256, height: 256, price: 0, default: false };

const SPRITE_SHEET = '/avatar/avatar-sprite.png';
const SPRITE_W = 1536;
const SPRITE_H = 1024;

function ItemThumb({ item }) {
  if (!item || !item.width) return null;
  const s = 48 / item.width;
  const bgW = SPRITE_W * s;
  const bgH = SPRITE_H * s;
  return (
    <div className="w-12 h-12 rounded-lg overflow-hidden border border-ink/10 shrink-0"
      style={{
        backgroundImage: `url(${SPRITE_SHEET})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${-(item.x * s)}px ${-(item.y * s)}px`,
        backgroundSize: `${bgW}px ${bgH}px`,
      }} />
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

  const load = useCallback(() => {
    setItems(null); setError(null);
    fetch(`${API_BASE}/avatar/items`).then(r => r.json()).then(json => {
      if (json.status === "success") setItems(json.data.items);
      else setError(json.message || "Lỗi tải items");
    }).catch(e => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); setError(null); setModalOpen(true); };
  const openEdit = (item) => {
    setForm({ category: item.category, name: item.name, x: item.x, y: item.y, width: item.width, height: item.height, price: item.price, default: item.default });
    setEditingId(item.id); setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setError(null); };

  const onChange = (name, val) => { setForm(f => ({ ...f, [name]: val })); setError(null); };

  const submit = async () => {
    if (!form.name.trim()) { setError("Vui lòng nhập tên item"); return; }
    setSaving(true); setError(null);
    try {
      const token = localStorage.getItem("edu_games_user_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = { "Content-Type": "application/json" };
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      if (editingId) {
        const res = await fetch(`${API_BASE}/avatar/admin/items/${editingId}`, { method: "PUT", headers, body: JSON.stringify(form) });
        const json = await res.json();
        if (json.status !== "success") throw new Error(json.message || "Lỗi cập nhật");
        showToast("Đã cập nhật item");
      } else {
        const res = await fetch(`${API_BASE}/avatar/admin/items`, { method: "POST", headers, body: JSON.stringify(form) });
        const json = await res.json();
        if (json.status !== "success") throw new Error(json.message || "Lỗi tạo item");
        showToast("Đã tạo item mới");
      }
      closeModal(); load();
    } catch (err) { setError(err.message || "Lỗi lưu item"); }
    setSaving(false);
  };

  const doRemove = async () => {
    try {
      const token = localStorage.getItem("edu_games_user_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = {};
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      const res = await fetch(`${API_BASE}/avatar/admin/items/${confirm.item.id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.message || "Lỗi xóa");
      showToast("Đã xóa item");
      setConfirm({ open: false, item: null }); load();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  const filtered = items ? (filter === "all" ? items : items.filter(i => i.category === filter)) : [];

  return (
    <div>
      <ManagementHeader subtitle="Quản lý vật phẩm Avatar" title="Avatar Items" />

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
                  <span>{item.x},{item.y} {item.width}x{item.height}</span>
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

      {/* Floating create button */}
      <button onClick={openCreate}
        className="fixed bottom-24 sm:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gold text-white shadow-lg hover:shadow-xl hover:bg-gold/80 transition flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
              <h3 className="font-display text-lg text-ink">{editingId ? "Sửa Item" : "Thêm Item mới"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-ink/5 transition"><X className="w-5 h-5 text-ink/50" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Preview */}
              <div className="flex justify-center py-4 rounded-xl" style={{ background: "linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)" }}>
                {form.width > 0 && form.height > 0 ? (
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-ink/10"
                    style={{
                      backgroundImage: `url(${SPRITE_SHEET})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: `${-(form.x * (32 / form.width))}px ${-(form.y * (32 / form.height))}px`,
                      backgroundSize: `${SPRITE_W * (32 / form.width)}px ${SPRITE_H * (32 / form.height)}px`,
                    }} />
                ) : (
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-ink/20 flex items-center justify-center">
                    <Image className="w-8 h-8 text-ink/20" />
                  </div>
                )}
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
                  <label className="text-xs font-mono uppercase text-ink/50">X</label>
                  <input type="number" value={form.x} onChange={e => onChange("x", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Y</label>
                  <input type="number" value={form.y} onChange={e => onChange("y", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Width</label>
                  <input type="number" value={form.width} onChange={e => onChange("width", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Height</label>
                  <input type="number" value={form.height} onChange={e => onChange("height", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>
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
                    <span className="text-sm font-body text-ink">Item mặc định (miễn phí)</span>
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
