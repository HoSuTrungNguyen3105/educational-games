import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader, ConfirmModal } from '../../components/ui.jsx';
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { renderAvatarFull, renderAvatarFullWithOverrides, renderItemHtml } from '../../lib/avatarRenderer.js';

function renderItemHtmlLocal(category, params) {
  if (!params) return '';
  const result = renderItemHtml(category, params);
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object') return (result.back || '') + (result.front || '');
  return '';
}

function getAuthToken() {
  try { return JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch { return ''; }
}

const CATEGORIES = [
  { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const STYLE_OPTIONS = {
  skin: [],
  face: ['gentle', 'happy', 'wink', 'laughing', 'fierce'],
  hair: ['spiky', 'messy', 'side', 'wild', 'long', 'twin', 'wavy', 'braid'],
  shirt: ['tee', 'hoodie', 'jacket', 'polo', 'sweater', 'cardigan', 'sailor'],
  pants: ['shorts', 'jeans', 'cargo', 'joggers', 'skirt'],
  shoes: ['sneaker', 'boots'],
  hat: ['none', 'cap', 'beanie', 'bucket', 'tophat', 'sunhat'],
  glasses: ['none', 'round', 'sun', 'heart', 'cat', 'star'],
  accessory: ['none', 'headphones', 'scarf', 'mask', 'backpack', 'ears', 'wings'],
};

const EMPTY_FORM = { category: "hair", name: "", price: 0, default: false, gender: "boy", params: { style: "spiky", color: "#6B4226" } };

// Default full avatar state for thumbnails
const DEFAULT_STATE = {
  skin: '#FFDFC4',
  face: 'gentle',
  hair: { style: 'spiky', color: '#6B4226' },
  shirt: { style: 'tee', color: '#F5F5F5' },
  pants: { style: 'shorts', color: '#241F1C' },
  shoes: { style: 'sneaker', color: '#3B5EA6' },
  hat: { style: 'none' },
  glasses: { style: 'none' },
  accessory: { style: 'none' },
};

function ItemPreview({ item, allItems }) {
  if (!item) return null;
  const state = { ...DEFAULT_STATE };
  if (allItems) {
    const gender = item.gender || 'boy';
    for (const it of allItems) {
      if (it.default && it.category !== item.category) {
        if (it.gender && it.gender !== gender) continue;
        if (it.category === 'skin') state.skin = it.params?.hex || '#FFDFC4';
        else if (it.category === 'face') state.face = it.params?.style || 'gentle';
        else state[it.category] = { style: it.params?.style || 'none', color: it.params?.color || '#000' };
      }
    }
  }
  if (item.category === 'skin') state.skin = item.params?.hex || '#FFDFC4';
  else if (item.category === 'face') state.face = item.params?.style || 'gentle';
  else state[item.category] = { style: item.params?.style || 'none', color: item.params?.color || '#000' };

  const svg = item.html
    ? renderAvatarFullWithOverrides(state, { [item.category]: item.html })
    : renderAvatarFull(state);
  return (
    <svg viewBox="0 0 300 440" width="48" height="70" xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: svg }} />
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
  const [query, setQuery] = useState('');
  const [editedHtml, setEditedHtml] = useState('');

  const load = useCallback(() => {
    setItems(null); setError(null);
    const qs = query ? `?query=${encodeURIComponent(query)}` : '';
    fetch(`${API_BASE}/avatar/items${qs}`).then(r => r.json()).then(json => {
      if (json.status) setItems(json.data.items);
      else setError(json.message || "Lỗi tải items");
    }).catch(e => setError(e.message));
  }, [query]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null); setError(null); setModalOpen(true);
    setEditedHtml(renderItemHtmlLocal(EMPTY_FORM.category, EMPTY_FORM.params));
  };

  const openEdit = (item) => {
    setForm({
      category: item.category, name: item.name, price: item.price,
      default: item.default, gender: item.gender || 'boy',
      params: { ...(item.params || {}) },
    });
    setEditingId(item.id); setError(null); setModalOpen(true);
    setEditedHtml(item.html || renderItemHtmlLocal(item.category, item.params));
  };

  const closeModal = () => { setModalOpen(false); setError(null); };

  const onChange = (name, val) => {
    setForm(f => ({ ...f, [name]: val }));
    setError(null);
  };

  const onChangeParam = (key, val) => {
    setForm(f => ({ ...f, params: { ...f.params, [key]: val } }));
    setError(null);
  };

  const submit = async () => {
    if (!form.name.trim()) { setError("Vui lòng nhập tên item"); return; }
    setSaving(true); setError(null);
    try {
      const token = localStorage.getItem("edu_games_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = { "Content-Type": "application/json" };
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      const body = {
        category: form.category, name: form.name, price: form.price,
        default: form.default, params: form.params, html: editedHtml,
        ...(form.gender ? { gender: form.gender } : {}),
      };

      if (editingId) {
        const res = await fetch(`${API_BASE}/avatar/admin/items/${editingId}`, { method: "PUT", headers, body: JSON.stringify(body) });
        const json = await res.json();
        if (!json.status) throw new Error(json.msg || "Lỗi cập nhật");
        showToast("Đã cập nhật item");
      } else {
        const res = await fetch(`${API_BASE}/avatar/admin/items`, { method: "POST", headers, body: JSON.stringify(body) });
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

  const filtered = items ? (filter === "all" ? items : items.filter(i => i.category === filter)) : [];
  const showGender = ['hair', 'shirt', 'pants', 'shoes'].includes(form.category);
  const styleOptions = STYLE_OPTIONS[form.category] || [];

  return (
    <div>
      <ManagementHeader subtitle="Quản lý vật phẩm Avatar" title="Avatar Items" />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm tên, ID, category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-pink/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === "all" ? "bg-pink text-white" : "bg-ink/5 text-ink/50 hover:bg-ink/10"}`}>
          Tất cả ({items?.length || 0})
        </button>
        {CATEGORIES.map(c => {
          const count = items?.filter(i => i.category === c.id).length || 0;
          return (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === c.id ? "bg-pink text-white" : "bg-ink/5 text-ink/50 hover:bg-ink/10"}`}>
              {c.label} ({count})
            </button>
          );
        })}
        </div>
      </div>

      {error && !items && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}
      {items === null && !error && <div className="text-center py-10 text-ink/40 text-sm animate-pulse">Đang tải...</div>}
      {items !== null && filtered.length === 0 && <div className="text-center py-10 text-ink/40 text-sm">Chưa có item nào</div>}

      {filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-ink/8 hover:shadow-sm transition">
              <div className="w-12 h-17 flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-ink/5">
                <ItemPreview item={item} allItems={items} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold text-sm text-ink truncate">{item.name}</span>
                  {item.default && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-600">Mặc định</span>}
                  {item.gender && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-600">{item.gender}</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-ink/40">
                  <span>{item.id}</span>
                  <span>{item.category}</span>
                  <span>{item.price} coin</span>
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
        className="fixed bottom-24 sm:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-pink text-white shadow-lg hover:shadow-xl hover:bg-pink/80 transition flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
              <h3 className="font-display text-lg text-ink">{editingId ? "Sửa Item" : "Thêm Item mới"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-ink/5 transition"><X className="w-5 h-5 text-ink/50" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div>
                <label className="text-xs font-mono uppercase text-ink/50">Category *</label>
                <select value={form.category} onChange={e => onChange("category", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-pink/30">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-ink/50">Tên item *</label>
                <input value={form.name} onChange={e => onChange("name", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-pink/30"
                  placeholder="VD: Tóc xoăn" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Giá (Coin)</label>
                  <input type="number" value={form.price} onChange={e => onChange("price", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-pink/30" />
                </div>
                {showGender && (
                  <div>
                    <label className="text-xs font-mono uppercase text-ink/50">Giới tính</label>
                    <select value={form.gender} onChange={e => onChange("gender", e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-pink/30">
                      <option value="boy">Bé trai</option>
                      <option value="girl">Bé gái</option>
                    </select>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.default} onChange={e => onChange("default", e.target.checked)}
                  className="w-4 h-4 rounded border-ink/20 text-pink focus:ring-pink/30" />
                <span className="text-sm font-body text-ink">Mặc định (miễn phí)</span>
              </label>

              {/* Params */}
              {styleOptions.length > 0 && (
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Style</label>
                  <select value={form.params?.style || ''} onChange={e => onChangeParam("style", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-pink/30">
                    {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {form.category === 'skin' ? (
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Màu da (hex)</label>
                  <div className="flex gap-2 mt-1">
                    <input value={form.params?.hex || '#FFDFC4'} onChange={e => onChangeParam("hex", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-pink/30" />
                    <input type="color" value={form.params?.hex || '#FFDFC4'} onChange={e => onChangeParam("hex", e.target.value)}
                      className="w-10 h-10 rounded-xl border border-ink/10 cursor-pointer" />
                  </div>
                </div>
              ) : form.params?.style !== 'none' && (
                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Màu</label>
                  <div className="flex gap-2 mt-1">
                    <input value={form.params?.color || '#000000'} onChange={e => onChangeParam("color", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-pink/30" />
                    <input type="color" value={form.params?.color || '#000000'} onChange={e => onChangeParam("color", e.target.value)}
                      className="w-10 h-10 rounded-xl border border-ink/10 cursor-pointer" />
                  </div>
                </div>
              )}

              {/* Preview */}
              <div>
                <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">Preview</div>
              <div className="flex justify-center p-4 rounded-xl bg-ink/[0.03]">
                <svg viewBox="0 0 300 440" width="48" height="70" xmlns="http://www.w3.org/2000/svg"
                  dangerouslySetInnerHTML={{ __html: (() => {
                    const state = { ...DEFAULT_STATE };
                    if (items) {
                      const gender = form.gender || 'boy';
                      for (const it of items) {
                        if (it.default && it.category !== form.category) {
                          if (it.gender && it.gender !== gender) continue;
                          if (it.category === 'skin') state.skin = it.params?.hex || '#FFDFC4';
                          else if (it.category === 'face') state.face = it.params?.style || 'gentle';
                          else state[it.category] = { style: it.params?.style || 'none', color: it.params?.color || '#000' };
                        }
                      }
                    }
                    if (form.category === 'skin') {
                      state.skin = form.params?.hex || '#FFDFC4';
                      return renderAvatarFull(state);
                    }
                    return renderAvatarFullWithOverrides(state, { [form.category]: editedHtml });
                  })() }} />
              </div>
              </div>

              {/* Hiển thị params JSON */}
              <div>
                <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">Params (JSON)</div>
                <pre className="p-3 rounded-xl bg-ink/[0.03] text-[11px] font-mono text-ink/60 overflow-x-auto whitespace-pre-wrap break-all">
                  {JSON.stringify(form.params, null, 2)}
                </pre>
              </div>

              {/* HTML: raw editable + rendered side by side */}
              {(() => {
                if (!editedHtml) return null;
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">HTML (SVG raw) — sửa ở đây</div>
                      <textarea
                        value={editedHtml}
                        onChange={e => setEditedHtml(e.target.value)}
                        className="w-full h-40 sm:h-48 p-3 rounded-xl bg-ink/[0.03] text-[9px] font-mono text-ink/70 border border-ink/10 focus:outline-none focus:ring-2 focus:ring-pink/30 resize-none whitespace-pre-wrap break-all"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">Rendered SVG</div>
                      <div className="flex justify-center p-4 rounded-xl bg-ink/[0.03] border border-ink/5 min-h-[100px] sm:min-h-[120px]">
                        <svg viewBox="0 0 300 440" width="80" height="117" xmlns="http://www.w3.org/2000/svg"
                          dangerouslySetInnerHTML={{ __html: editedHtml }} />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-ink/10 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 bg-ink/5 text-ink/60 rounded-xl text-sm font-semibold hover:bg-ink/10 transition">Hủy</button>
              <button onClick={submit} disabled={saving}
                className="px-5 py-2 bg-pink text-white rounded-xl text-sm font-semibold hover:bg-pink/80 transition disabled:opacity-50 flex items-center gap-1.5">
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
