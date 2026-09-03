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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function buildPreviewState() {
    const state = {};
    let bodyHtml = null;
    for (const cat of layerOrder) {
      const defaultItem = items.find(i => i.category === cat && i.default);
      if (!defaultItem) continue;
      if (cat === 'body') {
        bodyHtml = defaultItem.html || null;
      } else if (cat === 'skin') {
        state.skin = defaultItem.params?.hex || '#FFDFC4';
      } else if (cat === 'face') {
        state.face = defaultItem.params?.style || 'gentle';
      } else {
        state[cat] = { style: defaultItem.params?.style || 'none', color: defaultItem.params?.color || '#000' };
      }
    }
    return { state, bodyHtml };
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

  const { state: previewState, bodyHtml } = buildPreviewState();
  const svgContent = renderAvatarFull(previewState, bodyHtml);

  return (
    <div>
      <ManagementHeader subtitle="Thứ tự layer của Avatar" title="Avatar Template" />

      <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto mt-6">
        {/* Left: Avatar Preview - chiếm phần lớn không gian */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-ink/5 p-6 flex flex-col items-center">
            <div className="text-[10px] font-mono uppercase text-ink/40 tracking-wider mb-3">Preview Avatar</div>
            <div className="w-full aspect-[512/700] max-h-[440px] flex items-center justify-center bg-gradient-to-br from-ink/[0.02] to-ink/[0.06] rounded-xl p-2">
              <svg
                viewBox="0 0 512 700"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Right: Layer Order - chiều rộng cố định, nhỏ hơn avatar */}
        <div className="w-[280px] shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-ink/5 shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-ink/50 tracking-wider">Thứ tự layer</span>
              <span className="text-[10px] font-mono text-ink/30">trên → dưới</span>
            </div>
            <div className="space-y-2">
              {layerOrder.map((catId, index) => {
                const cat = CATEGORY_LIST.find(c => c.key === catId);
                const itemCount = items.filter(i => i.category === catId).length;
                return (
                  <div
                    key={catId}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink/[0.03] border border-ink/5 hover:border-ink/10 transition"
                  >
                    <span className="text-[10px] font-mono text-ink/30 w-5 text-right font-semibold">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-ink/80 truncate">{cat?.label || catId}</span>
                    <span className="text-[10px] font-mono text-ink/30 bg-ink/5 px-2 py-0.5 rounded-full shrink-0">
                      {itemCount}
                    </span>
                    <div className="flex gap-0.5 shrink-0">
                      <button
                        onClick={() => moveLayer(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded-lg hover:bg-ink/10 transition disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-ink/50" />
                      </button>
                      <button
                        onClick={() => moveLayer(index, 1)}
                        disabled={index === layerOrder.length - 1}
                        className="p-1 rounded-lg hover:bg-ink/10 transition disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-ink/50" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2.5 bg-ink/5 hover:bg-ink/10 text-ink/70 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-3 py-2.5 bg-gradient-to-r from-pink to-pink/80 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink/20 transition disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}