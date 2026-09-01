import { useState, useEffect, useMemo } from 'react';
import AvatarPreview from './AvatarPreview.jsx';
import { renderAvatarFull } from '../../lib/avatarRenderer.js';
import { API_BASE } from '../../services/api.js';
import { X, Check, ShoppingBag } from 'lucide-react';

function ItemThumbnail({ item, selected, preview, onClick, owned, allItems }) {
  if (!item) return null;

  const fullAvatarSvg = useMemo(() => {
    if (!item.html) return null;
    if (item.category === 'skin') return null;
    const defaultItems = {};
    for (const it of allItems) {
      if (it.default && !defaultItems[it.category]) {
        defaultItems[it.category] = it;
      }
    }
    const state = {};
    for (const [cat, it] of Object.entries(defaultItems)) {
      if (cat === 'skin') state.skin = it.params?.hex || '#FFDFC4';
      else if (cat === 'face') state.face = it.params?.style || 'gentle';
      else state[cat] = { style: it.params?.style || 'none', color: it.params?.color || '#000' };
    }
    if (item.category === 'skin') state.skin = item.params?.hex || '#FFDFC4';
    else if (item.category === 'face') state.face = item.params?.style || 'gentle';
    else state[item.category] = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    return renderAvatarFull(state);
  }, [item, allItems]);

  const getSwatchStyle = () => {
    if (item.category === 'skin') return { background: item.params?.hex || '#ddd' };
    if (item.category === 'face') return { background: '#FFF1E4' };
    if (item.params?.style === 'none') return { background: 'repeating-linear-gradient(45deg,#EDEBF8,#EDEBF8 4px,#E1DEF4 4px,#E1DEF4 8px)' };
    if (item.params?.color) return { background: item.params.color };
    return { background: '#ddd' };
  };

  const getContent = () => {
    if (item.category === 'face') return <span>{item.params?.emoji || '🙂'}</span>;
    if (item.params?.style === 'none') return <span className="text-lg font-bold text-ink/20">–</span>;
    if (fullAvatarSvg) {
      return (
        <svg viewBox="0 0 300 440" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: fullAvatarSvg }} />
      );
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition shrink-0 flex items-center justify-center ${
        selected ? 'border-pink shadow-md' : preview ? 'border-sky shadow-sm' : 'border-ink/10 hover:border-ink/20'
      }`}
      style={fullAvatarSvg ? {} : getSwatchStyle()}
    >
      {getContent()}
      {owned ? (
        <div className="absolute bottom-0 inset-x-0 bg-green-500/80 text-white text-[8px] font-mono text-center py-0.5">
          Sở hữu
        </div>
      ) : null}
      {selected && (
        <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-pink flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </button>
  );
}

export default function AvatarCustomizer({ loadout, inventory = [], coins = 0, onSave, onClose, token }) {
  const [draft, setDraft] = useState({ ...loadout });
  const [activeTab, setActiveTab] = useState('hair');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [buying, setBuying] = useState(null);
  const [localCoins, setLocalCoins] = useState(coins);
  const [localInventory, setLocalInventory] = useState(inventory);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/avatar/items`)
      .then(r => r.json())
      .then(json => {
        if (json.status) {
          setItems(json.data.items);
          setCategories(json.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  function selectItem(category, itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (item.price > 0 && !localInventory.includes(itemId)) return;
    setDraft(prev => ({ ...prev, [category]: itemId }));
    setPreviewItem(null);
  }

  function previewItemClick(item) {
    if (isOwned(item.id)) {
      selectItem(item.category, item.id);
    } else {
      setPreviewItem(item);
    }
  }

  function isOwned(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    if (item.price === 0 || item.default) return true;
    return localInventory.includes(itemId);
  }

  async function handleBuy(item) {
    if (!token || buying) return;
    setBuying(item.id);
    try {
      const res = await fetch(`${API_BASE}/avatar/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemId: item.id }),
      });
      const json = await res.json();
      if (json.status) {
        setLocalInventory(json.data.inventory);
        setLocalCoins(json.data.coins);
        setDraft(prev => ({ ...prev, [item.category]: item.id }));
        setPreviewItem(null);
      }
    } catch {}
    setBuying(null);
  }

  const tabItems = items.filter(i => i.category === activeTab);

  const previewLoadout = useMemo(() => {
    if (previewItem) {
      const p = { ...draft };
      p[previewItem.category] = previewItem.id;
      return p;
    }
    return draft;
  }, [draft, previewItem]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
          <h2 className="font-display text-lg text-ink">Tùy chỉnh Avatar</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
            <X className="w-5 h-5 text-ink/50" />
          </button>
        </div>

        {/* Preview area with buy button overlay */}
        <div className="relative flex justify-center py-6 shrink-0" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
          <AvatarPreview loadout={previewLoadout} items={items} size={200} />

          {/* Buy button on preview - bottom right */}
          {previewItem && !isOwned(previewItem.id) && previewItem.price > 0 && (
            <button
              onClick={() => handleBuy(previewItem)}
              disabled={buying === previewItem.id || localCoins < previewItem.price}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink text-white text-sm font-bold shadow-lg hover:bg-pink/80 transition disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              {buying === previewItem.id ? 'Đang mua...' : `Mua ${previewItem.price} coin`}
            </button>
          )}

          {/* Selected badge */}
          {previewItem && isOwned(previewItem.id) && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-green-500 text-white text-xs font-bold shadow-lg">
              <Check className="w-3.5 h-3.5" /> Đã sở hữu
            </div>
          )}
        </div>

        {previewItem && (
          <div className="flex items-center justify-center gap-3 px-4 py-2 bg-sky/5 border-b border-sky/10 shrink-0">
            <span className="text-xs font-body text-sky font-semibold">Đang xem: {previewItem.name}</span>
            <button onClick={() => setPreviewItem(null)} className="text-[10px] font-mono text-sky/60 hover:text-sky">đóng</button>
          </div>
        )}

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto shrink-0">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => { setActiveTab(cat.id); setPreviewItem(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold whitespace-nowrap transition ${
                activeTab === cat.id ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {tabItems.map(item => {
              const owned = isOwned(item.id);
              const isPreviewing = previewItem?.id === item.id;
              const isSelected = draft[activeTab] === item.id;
              return (
                <div key={item.id} className="flex flex-col items-center gap-1">
                  <ItemThumbnail
                    item={item}
                    selected={isSelected}
                    preview={isPreviewing && !isSelected}
                    owned={owned}
                    allItems={items}
                    onClick={() => previewItemClick(item)}
                  />
                  {!owned && item.price > 0 && (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={buying === item.id || localCoins < item.price}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink/10 text-pink text-xs font-mono font-bold hover:bg-pink/20 transition disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      {buying === item.id ? '...' : `${item.price}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {tabItems.length === 0 && (
            <p className="text-sm text-ink/40 text-center py-8">Chưa có item nào</p>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-ink/10 shrink-0">
          <span className="text-xs font-mono text-ink/40">{localCoins.toLocaleString()} Coin</span>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 bg-ink/5 text-ink/60 rounded-xl text-sm font-body font-semibold hover:bg-ink/10 transition">
              Hủy
            </button>
            <button onClick={() => onSave(draft)}
              className="px-5 py-2 bg-pink text-white rounded-xl text-sm font-body font-semibold hover:bg-pink/80 transition">
              Lưu Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
