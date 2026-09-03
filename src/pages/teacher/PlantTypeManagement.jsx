import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../../services/api.js";

const RARITY_OPTIONS = [
  { value: "common", label: "Thường" },
  { value: "rare", label: "Hiếm" },
  { value: "epic", label: "Sử thi" },
  { value: "legendary", label: "Huyền thoại" },
];

const PLANT_KINDS = [
  { value: "bloom", label: "Hoa (Bloom)" },
  { value: "fruitTree", label: "Cây trái (Fruit Tree)" },
  { value: "cactus", label: "Xương rồng (Cactus)" },
  { value: "bamboo", label: "Tre (Bamboo)" },
  { value: "vine", label: "Dây leo (Vine)" },
  { value: "aura", label: "Aura / Huyền thoại" },
];

const DEFAULT_PALETTE = { stem: "#5B8C3A", leaf: "#7CB342", leafDark: "#4C7A2A", accent: "#F4B93E", accentLight: "#FFE08A", accentDark: "#C97F17" };

const emptyForm = {
  id: "", name: "", icon: "sunflower", kind: "bloom", stages: 3,
  growthTime: 300000, harvestCoin: 20, seedPrice: 5, rarity: "common",
  palette: { ...DEFAULT_PALETTE },
};

function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m ${s % 60}s`;
}

const RARITY_COLORS = {
  common: { bg: "#EEF0EC", text: "#6B7264" },
  rare: { bg: "#E4EEFA", text: "#3D6FA8" },
  epic: { bg: "#F0E6FA", text: "#7A4EA8" },
  legendary: { bg: "#FCEFD6", text: "#B8791A" },
};

function loadAuth() {
  try { return JSON.parse(localStorage.getItem("edu_games_auth") || "{}"); } catch { return {}; }
}

async function apiAdmin(path, options = {}) {
  const auth = loadAuth();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.msg || `Lỗi ${res.status}`);
  return json.data ?? json;
}

export default function PlantTypeManagement({ showToast }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiAdmin("/plant-types");
      setTypes(data.types || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setShowForm(true); };

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({
      id: t.id, name: t.name, icon: t.icon || "sunflower", kind: t.kind || "bloom",
      stages: t.stages || 3, growthTime: t.growthTime || 300000,
      harvestCoin: t.harvestCoin || 10, seedPrice: t.seedPrice || 5,
      rarity: t.rarity || "common",
      palette: { ...DEFAULT_PALETTE, ...(t.palette || {}) },
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.id.trim() || !form.name.trim()) { showToast("Thiếu ID hoặc tên", "error"); return; }
    setSaving(true);
    try {
      if (editId) {
        await apiAdmin(`/plant-types/${editId}`, { method: "PUT", body: form });
        showToast("Đã cập nhật!", "success");
      } else {
        await apiAdmin("/plant-types", { method: "POST", body: form });
        showToast("Đã tạo mới!", "success");
      }
      setShowForm(false);
      load();
    } catch (e) { showToast(e.message || "Lỗi lưu", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (t) => {
    if (!confirm(`Xóa "${t.name}" (${t.id})?`)) return;
    try {
      await apiAdmin(`/plant-types/${t.id}`, { method: "DELETE" });
      showToast("Đã xóa!", "success");
      load();
    } catch (e) { showToast(e.message || "Lỗi xóa", "error"); }
  };

  const setPalette = (key, val) => setForm(f => ({ ...f, palette: { ...f.palette, [key]: val } }));

  if (loading) return <div className="p-8 text-center text-ink/40">Đang tải...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Quản lý loại cây</h2>
        <button onClick={openCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
          + Thêm loại cây
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink/5 text-left text-ink/60 text-xs font-semibold">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Loại</th>
              <th className="px-3 py-2">Giai đoạn</th>
              <th className="px-3 py-2">Thời gian</th>
              <th className="px-3 py-2">Giá hạt</th>
              <th className="px-3 py-2">Thu hoạch</th>
              <th className="px-3 py-2">Hiếm</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {types.map(t => {
              const rc = RARITY_COLORS[t.rarity] || RARITY_COLORS.common;
              return (
                <tr key={t.id} className="border-t hover:bg-ink/[0.02] transition">
                  <td className="px-3 py-2 font-mono text-xs text-ink/50">{t.id}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{t.name}</td>
                  <td className="px-3 py-2 text-ink/60">{t.kind || "bloom"}</td>
                  <td className="px-3 py-2 text-center">{t.stages}</td>
                  <td className="px-3 py-2 text-ink/60">{formatMs(t.growthTime)}</td>
                  <td className="px-3 py-2 text-gold font-bold">{t.seedPrice}</td>
                  <td className="px-3 py-2 text-green-600 font-bold">+{t.harvestCoin}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: rc.bg, color: rc.text }}>
                      {t.rarity}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)} className="px-2 py-1 text-xs rounded bg-ink/5 hover:bg-ink/10 text-ink/60 transition">Sửa</button>
                      <button onClick={() => handleDelete(t)} className="px-2 py-1 text-xs rounded bg-red-50 hover:bg-red-100 text-red-500 transition">Xóa</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {types.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-ink/30">Chưa có loại cây nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden anim-pop shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 shrink-0">
              <h3 className="font-display text-lg text-ink">{editId ? "Sửa loại cây" : "Thêm loại cây"}</h3>
              <button onClick={() => setShowForm(false)} className="text-ink/40 hover:text-ink text-xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">ID (không dấu, không khoảng trắng)</label>
                  <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editId}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm disabled:bg-ink/5" placeholder="sunflower" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Tên hiển thị</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm" placeholder="Hoa hướng dương" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Biểu tượng</label>
                  <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm" placeholder="sunflower" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Loại cây</label>
                  <select value={form.kind} onChange={e => setForm(f => ({ ...f, kind: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm">
                    {PLANT_KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Số giai đoạn</label>
                  <input type="number" min={2} max={6} value={form.stages} onChange={e => setForm(f => ({ ...f, stages: +e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Thời gian mọc (ms)</label>
                  <input type="number" value={form.growthTime} onChange={e => setForm(f => ({ ...f, growthTime: +e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm" />
                  <p className="text-[10px] text-ink/30 mt-0.5">{formatMs(form.growthTime)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Giá hạt giống</label>
                  <input type="number" value={form.seedPrice} onChange={e => setForm(f => ({ ...f, seedPrice: +e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/60 block mb-1">Xu thu hoạch</label>
                  <input type="number" value={form.harvestCoin} onChange={e => setForm(f => ({ ...f, harvestCoin: +e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink/60 block mb-1">Độ hiếm</label>
                <div className="flex gap-2">
                  {RARITY_OPTIONS.map(r => (
                    <button key={r.value} onClick={() => setForm(f => ({ ...f, rarity: r.value }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${form.rarity === r.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-ink/10 text-ink/50 hover:border-ink/20'}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink/60 block mb-1">Bảng màu SVG</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(DEFAULT_PALETTE).map(([key]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input type="color" value={form.palette[key] || "#000"} onChange={e => setPalette(key, e.target.value)}
                        className="w-7 h-7 rounded border border-ink/10 cursor-pointer" />
                      <span className="text-[10px] text-ink/40 font-mono">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-ink/10 shrink-0">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-ink/50 hover:text-ink transition">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {saving ? "Đang lưu..." : editId ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
