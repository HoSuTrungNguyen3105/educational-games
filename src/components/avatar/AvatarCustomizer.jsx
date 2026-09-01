import { useState, useEffect } from 'react';
import AvatarPreview from './AvatarPreview.jsx';
import { API_BASE } from '../../services/api.js';
import { X, Check, ShoppingBag } from 'lucide-react';

function ItemThumbnail({ item, selected, onClick, owned }) {
  if (!item) return null;

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
    return null;
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition shrink-0 flex items-center justify-center ${
        selected ? 'border-pink shadow-md' : 'border-ink/10 hover:border-ink/20'
      }`}
      style={getSwatchStyle()}
    >
      {getContent()}
      {owned ? (
        <div className="absolute bottom-0 inset-x-0 bg-green-500/80 text-white text-[8px] font-mono text-center py-0.5">
          Sở hữu
        </div>
      ) : item.price > 0 ? (
        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono text-center py-0.5">
          {item.price}
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
      }
    } catch {}
    setBuying(null);
  }

  const tabItems = items.filter(i => i.category === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
          <h2 className="font-display text-lg text-ink">Tùy chỉnh Avatar</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
            <X className="w-5 h-5 text-ink/50" />
          </button>
        </div>

        <div className="flex justify-center py-6 shrink-0" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
          <AvatarPreview loadout={draft} items={items} size={200} />
        </div>

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto shrink-0">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
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
              return (
                <div key={item.id} className="flex flex-col items-center gap-1">
                  <ItemThumbnail
                    item={item}
                    selected={draft[activeTab] === item.id}
                    owned={owned}
                    onClick={() => owned ? selectItem(activeTab, item.id) : handleBuy(item)}
                  />
                  {!owned && item.price > 0 && (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={buying === item.id || localCoins < item.price}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-pink/10 text-pink text-[9px] font-mono font-bold hover:bg-pink/20 transition disabled:opacity-40"
                    >
                      <ShoppingBag className="w-2.5 h-2.5" />
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
