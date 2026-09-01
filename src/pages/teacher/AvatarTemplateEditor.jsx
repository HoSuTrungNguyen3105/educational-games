import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader } from '../../components/ui.jsx';
import { Save, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { renderAvatarFull, CATEGORY_LIST } from '../../lib/avatarRenderer.js';

const DEFAULT_LAYER_ORDER = ['skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];

function getAuthToken() {
  try { return JSON.parse(localStorage.getItem('edu_games_auth') || '{}')?.token || ''; } catch { return ''; }
}

export default function AvatarTemplateEditor({ showToast }) {
  const [items, setItems] = useState([]);
  const [layerOrder, setLayerOrder] = useState(DEFAULT_LAYER_ORDER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE}/avatar/items`)
      .then(r => r.json())
      .then(json => {
        if (json.status) {
          setItems(json.data.items);
          if (json.data.layerOrder) setLayerOrder(json.data.layerOrder);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build preview state with default items
  function buildPreviewState() {
    const state = {};
    for (const cat of layerOrder) {
      const defaultItem = items.find(i => i.category === cat && i.default);
      if (!defaultItem) continue;
      if (cat === 'skin') state.skin = defaultItem.params?.hex || '#FFDFC4';
      else if (cat === 'face') state.face = defaultItem.params?.style || 'gentle';
      else state[cat] = { style: defaultItem.params?.style || 'none', color: defaultItem.params?.color || '#000' };
    }
    return state;
  }

  function moveLayer(index, dir) {
    const newOrder = [...layerOrder];
    const target = index + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setLayerOrder(newOrder);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/avatar/template`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ categories: {}, layerOrder }),
      });
      const json = await res.json();
      if (json.status) showToast('Đã lưu template');
      else showToast(json.msg || 'Lỗi lưu', 'error');
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  }

  function handleReset() {
    setLayerOrder(DEFAULT_LAYER_ORDER);
    showToast('Đã reset về mặc định');
  }

  if (loading) {
    return (
      <div>
        <ManagementHeader subtitle="Thứ tự layer của Avatar" title="Avatar Template" />
        <div className="text-center py-10 text-ink/40 text-sm animate-pulse">Đang tải...</div>
      </div>
    );
  }

  const previewState = buildPreviewState();
  const svgContent = renderAvatarFull(previewState);

  return (
    <div>
      <ManagementHeader subtitle="Thứ tự layer của Avatar" title="Avatar Template" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Avatar Preview */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">Preview Avatar</div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <svg viewBox="0 0 300 440" width="300" height="440" xmlns="http://www.w3.org/2000/svg"
              dangerouslySetInnerHTML={{ __html: svgContent }} />
          </div>
        </div>

        {/* Right: Layer Order */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-ink/8 p-4">
            <div className="text-xs font-mono uppercase text-ink/50 mb-3">Thứ tự layer (trên → dưới)</div>
            <div className="space-y-1.5">
              {layerOrder.map((catId, index) => {
                const cat = CATEGORY_LIST.find(c => c.key === catId);
                const itemCount = items.filter(i => i.category === catId).length;
                return (
                  <div key={catId} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink/[0.03] border border-ink/5">
                    <span className="text-[10px] font-mono text-ink/30 w-5 text-right">{index + 1}</span>
                    <span className="flex-1 text-sm font-body text-ink">{cat?.label || catId}</span>
                    <span className="text-[10px] font-mono text-ink/30">{itemCount} items</span>
                    <div className="flex gap-0.5">
                      <button onClick={() => moveLayer(index, -1)} disabled={index === 0}
                        className="p-1 rounded hover:bg-ink/10 transition disabled:opacity-20">
                        <ArrowUp className="w-3 h-3 text-ink/50" />
                      </button>
                      <button onClick={() => moveLayer(index, 1)} disabled={index === layerOrder.length - 1}
                        className="p-1 rounded hover:bg-ink/10 transition disabled:opacity-20">
                        <ArrowDown className="w-3 h-3 text-ink/50" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleReset}
              className="flex-1 px-4 py-2.5 bg-ink/5 text-ink/60 rounded-xl text-sm font-semibold hover:bg-ink/10 transition flex items-center justify-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 px-4 py-2.5 bg-pink text-white rounded-xl text-sm font-semibold hover:bg-pink/80 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
