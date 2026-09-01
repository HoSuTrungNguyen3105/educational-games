import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader, ConfirmModal } from '../../components/ui.jsx';
import { Plus, Pencil, Trash2, X, Save, List, Code, Eye } from 'lucide-react';

function getAuthToken() {
  try { return JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch { return ''; }
}

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const EMPTY_FORM = { category: "hair", name: "", html: "", price: 0, default: false };

const EXAMPLE_HTML = {
  hair: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 90 Q50 20 122 15 Q195 20 195 90 Q195 60 170 45 Q145 30 122 28 Q100 30 75 45 Q50 60 50 90Z" fill="#8B4513"/>
</svg>`,
  shirt: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 145 L80 135 L122 140 L165 135 L205 145 L210 230 L35 230Z" fill="#E74C3C"/>
</svg>`,
  hat: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="122" cy="20" rx="80" ry="15" fill="#2C3E50"/>
  <rect x="62" y="5" width="120" height="20" rx="10" fill="#2C3E50"/>
</svg>`,
};

function HtmlPreview({ html, className = '' }) {
  if (!html) return <div className={`bg-ink/5 flex items-center justify-center ${className}`}><span className="text-[8px] text-ink/30">trống</span></div>;
  return (
    <div className={`bg-ink/5 flex items-center justify-center overflow-hidden ${className}`}>
      <div className="w-full h-full p-1" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
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

  const load = useCallback(() => {
    setItems(null); setError(null);
    fetch(`${API_BASE}/avatar/items`).then(r => r.json()).then(json => {
      if (json.status) setItems(json.data.items);
      else setError(json.message || "Lỗi tải items");
    }).catch(e => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null); setError(null); setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      category: item.category, name: item.name, html: item.html || "",
      price: item.price, default: item.default,
    });
    setEditingId(item.id); setError(null); setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setError(null); };

  const onChange = (name, val) => {
    setForm(f => ({ ...f, [name]: val }));
    setError(null);
  };

  const insertExample = () => {
    const ex = EXAMPLE_HTML[form.category];
    if (ex) onChange("html", ex);
  };

  const submit = async () => {
    if (!form.name.trim()) { setError("Vui lòng nhập tên item"); return; }
    setSaving(true); setError(null);
    try {
      const token = localStorage.getItem("edu_games_auth");
      const parsed = token ? JSON.parse(token) : null;
      const headers = { "Content-Type": "application/json" };
      if (parsed?.token) headers.Authorization = `Bearer ${parsed.token}`;

      const body = { category: form.category, name: form.name, html: form.html, price: form.price, default: form.default };

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

  return (
    <div>
      <ManagementHeader subtitle="Quản lý vật phẩm Avatar (HTML/SVG/CSS)" title="Avatar Items" />

      <div className="flex gap-1 mb-4 bg-ink/5 rounded-xl p-1">
        <button onClick={() => setTab("list")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${tab === "list" ? "bg-white text-ink shadow-sm" : "text-ink/40 hover:text-ink/60"}`}>
          <List className="w-4 h-4" />
          Danh sách ({items?.length || 0})
        </button>
        <button onClick={() => setTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${tab === "preview" ? "bg-white text-ink shadow-sm" : "text-ink/40 hover:text-ink/60"}`}>
          <Eye className="w-4 h-4" />
          Preview tất cả
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

      {error && !items && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}
      {items === null && !error && <div className="text-center py-10 text-ink/40 text-sm animate-pulse">Đang tải...</div>}
      {items !== null && filtered.length === 0 && <div className="text-center py-10 text-ink/40 text-sm">Chưa có item nào</div>}

      {filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-ink/8 hover:shadow-sm transition">
              <HtmlPreview html={item.html} className="w-12 h-12 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold text-sm text-ink truncate">{item.name}</span>
                  {item.default && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-600">Mặc định</span>}
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
        className="fixed bottom-24 sm:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gold text-white shadow-lg hover:shadow-xl hover:bg-gold/80 transition flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
      </>)}

      {tab === "preview" && (
        <div className="bg-white rounded-xl border border-ink/8 p-4">
          <div className="text-xs font-mono uppercase text-ink/40 mb-3">Preview tất cả items</div>
          {CATEGORIES.map(cat => {
            const catItems = items?.filter(i => i.category === cat.id) || [];
            if (catItems.length === 0) return null;
            return (
              <div key={cat.id} className="mb-4">
                <div className="text-xs font-semibold text-ink/60 mb-2">{cat.label}</div>
                <div className="flex flex-wrap gap-2">
                  {catItems.map(item => (
                    <div key={item.id} className="flex flex-col items-center gap-1">
                      <HtmlPreview html={item.html} className="w-16 h-16 rounded-lg" />
                      <span className="text-[9px] font-mono text-ink/40">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
              <h3 className="font-display text-lg text-ink">{editingId ? "Sửa Item" : "Thêm Item mới"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-ink/5 transition"><X className="w-5 h-5 text-ink/50" /></button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
              {/* Left: Form */}
              <div className="lg:w-[340px] p-4 space-y-4 border-b lg:border-b-0 lg:border-r border-ink/10 shrink-0">
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

                <div>
                  <label className="text-xs font-mono uppercase text-ink/50">Giá (Coin)</label>
                  <input type="number" value={form.price} onChange={e => onChange("price", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-ink/10 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-gold/30" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.default} onChange={e => onChange("default", e.target.checked)}
                    className="w-4 h-4 rounded border-ink/20 text-gold focus:ring-gold/30" />
                  <span className="text-sm font-body text-ink">Mặc định (miễn phí)</span>
                </label>

                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              {/* Right: HTML Editor + Preview */}
              <div className="flex-1 p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-ink/50 flex items-center gap-1">
                    <Code className="w-3 h-3" /> HTML / SVG / CSS
                  </label>
                  <div className="flex gap-1">
                    <button onClick={insertExample}
                      className="px-2 py-1 rounded-lg bg-ink/5 text-[10px] font-mono text-ink/50 hover:bg-ink/10 transition">
                      Chèn ví dụ
                    </button>
                    <button onClick={() => onChange("html", "")}
                      className="px-2 py-1 rounded-lg bg-red-50 text-[10px] font-mono text-red-400 hover:bg-red-100 transition">
                      Xóa HTML
                    </button>
                  </div>
                </div>
                <textarea
                  value={form.html}
                  onChange={e => onChange("html", e.target.value)}
                  className="w-full h-48 px-3 py-2 rounded-xl border border-ink/10 text-xs font-mono text-ink bg-ink/[0.02] focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                  placeholder={`<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">\n  ...\n</svg>`}
                  spellCheck={false}
                />

                <div>
                  <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">Preview</div>
                  <div className="flex justify-center p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
                    <div className="relative" style={{ width: 200, height: 200 * (275 / 245) }}>
                      {form.html ? (
                        <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: form.html }} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-ink/20 text-xs">
                          Nhập HTML để xem preview
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
