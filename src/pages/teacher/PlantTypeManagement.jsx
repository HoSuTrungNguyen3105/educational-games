import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../services/api.js";
import { useConfirm } from "../../hooks/useConfirm.js";
import {
  ManagementHeader, ManagementTable, Modal, ConfirmModal,
  PrimaryButton, GhostButton, Field, Loader, ErrorState,
} from "../../components/ui.jsx";

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

export default function PlantTypeManagement({ showToast }) {
  const [types, setTypes] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    setTypes(null);
    setError(null);
    try {
      const data = await apiFetch("/plant-types");
      setTypes(data.types || []);
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm, palette: { ...DEFAULT_PALETTE } }); setShowForm(true); };

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
        await apiFetch(`/plant-types/${editId}`, { method: "PUT", body: form });
        showToast("Đã cập nhật!", "success");
      } else {
        await apiFetch("/plant-types", { method: "POST", body: form });
        showToast("Đã tạo mới!", "success");
      }
      setShowForm(false);
      load();
    } catch (e) { showToast(e.message || "Lỗi lưu", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = (t) => {
    askConfirm({
      title: "Xóa loại cây",
      message: `Xóa "${t.name}" (${t.id})?`,
      onConfirm: async () => {
        try {
          await apiFetch(`/plant-types/${t.id}`, { method: "DELETE" });
          showToast("Đã xóa!", "success");
          load();
        } catch (e) { showToast(e.message || "Lỗi xóa", "error"); }
      },
    });
  };

  const setPalette = (key, val) => setForm(f => ({ ...f, palette: { ...f.palette, [key]: val } }));
  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const inputCls = "w-full note-card px-3 py-2 mt-0.5 border-ink/10 focus:border-ticket text-sm disabled:opacity-50";

  const headers = ["ID", "Tên", "Loại", "Giai đoạn", "Thời gian", "Giá hạt", "Thu hoạch", "Độ hiếm", ""];

  const renderRow = (t) => {
    const rc = RARITY_COLORS[t.rarity] || RARITY_COLORS.common;
    return (
      <tr key={t.id} className="border-b border-ink/5 last:border-0">
        <td className="px-5 py-3 font-mono text-xs text-ink/50">{t.id}</td>
        <td className="px-5 py-3 font-semibold text-ink text-sm">{t.name}</td>
        <td className="px-5 py-3 text-ink/60 text-sm">{t.kind || "bloom"}</td>
        <td className="px-5 py-3 text-center text-sm">{t.stages}</td>
        <td className="px-5 py-3 text-ink/60 text-sm">{formatMs(t.growthTime)}</td>
        <td className="px-5 py-3 text-gold font-bold text-sm">{t.seedPrice}</td>
        <td className="px-5 py-3 text-green-600 font-bold text-sm">+{t.harvestCoin}</td>
        <td className="px-5 py-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: rc.bg, color: rc.text }}>
            {RARITY_OPTIONS.find(r => r.value === t.rarity)?.label || t.rarity}
          </span>
        </td>
        <td className="px-5 py-3">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => openEdit(t)} className="text-xs font-semibold text-ticket hover:underline">Sửa</button>
            <button onClick={() => handleDelete(t)} className="text-xs font-semibold text-red-400 hover:underline">Xóa</button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Khu vườn" title="🌱 Loại cây" />

      {error && !types && <ErrorState subtitle={error} onRetry={load} />}
      {!error && !types && <Loader label="Đang tải loại cây..." />}
      {!error && types && (
        <ManagementTable
          title="Danh sách loại cây"
          count={types.length}
          data={types}
          emptyLabel="Chưa có loại cây nào."
          onCreate={openCreate}
          createLabel="+ Thêm loại cây"
          headers={headers}
          renderRow={renderRow}
        />
      )}

      {showForm && (
        <Modal onClose={() => setShowForm(false)} wide>
          <h3 className="font-display text-lg text-ink mb-3">{editId ? "✏️ Sửa loại cây" : "➕ Thêm loại cây"}</h3>
          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
            <Field label="ID (không dấu, không khoảng trắng)">
              <input value={form.id} onChange={e => setF("id", e.target.value)} disabled={!!editId}
                className={inputCls} placeholder="sunflower" />
            </Field>
            <Field label="Tên hiển thị">
              <input value={form.name} onChange={e => setF("name", e.target.value)}
                className={inputCls} placeholder="Hoa hướng dương" />
            </Field>
            <Field label="Biểu tượng">
              <input value={form.icon} onChange={e => setF("icon", e.target.value)}
                className={inputCls} placeholder="sunflower" />
            </Field>
            <Field label="Loại cây">
              <select value={form.kind} onChange={e => setF("kind", e.target.value)} className={`${inputCls} bg-paper2`}>
                {PLANT_KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </Field>
            <Field label="Số giai đoạn">
              <input type="number" min={2} max={6} value={form.stages} onChange={e => setF("stages", +e.target.value)} className={inputCls} />
            </Field>
            <Field label="Độ hiếm">
              <select value={form.rarity} onChange={e => setF("rarity", e.target.value)} className={`${inputCls} bg-paper2`}>
                {RARITY_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </Field>
            <Field label="Thời gian mọc (ms)" hint={`≈ ${formatMs(form.growthTime)}`}>
              <input type="number" value={form.growthTime} onChange={e => setF("growthTime", +e.target.value)} className={inputCls} />
            </Field>
            <Field label="Giá hạt giống">
              <input type="number" value={form.seedPrice} onChange={e => setF("seedPrice", +e.target.value)} className={inputCls} />
            </Field>
            <Field label="Xu thu hoạch">
              <input type="number" value={form.harvestCoin} onChange={e => setF("harvestCoin", +e.target.value)} className={inputCls} />
            </Field>
            <Field label="Bảng màu SVG" className="sm:col-span-2">
              <div className="grid grid-cols-3 gap-2 mt-0.5">
                {Object.keys(DEFAULT_PALETTE).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <input type="color" value={form.palette[key] || "#000000"} onChange={e => setPalette(key, e.target.value)}
                      className="w-7 h-7 rounded border border-ink/10 cursor-pointer" />
                    <span className="text-[10px] text-ink/40 font-mono">{key}</span>
                  </div>
                ))}
              </div>
            </Field>
          </div>
          <div className="mt-4 flex items-center gap-2 justify-end">
            <GhostButton onClick={() => setShowForm(false)}>Hủy</GhostButton>
            <PrimaryButton onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : editId ? "Cập nhật" : "Tạo mới"}
            </PrimaryButton>
          </div>
        </Modal>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
