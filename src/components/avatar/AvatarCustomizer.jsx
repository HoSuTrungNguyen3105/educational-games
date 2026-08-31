import { useState, useEffect } from 'react';
import AvatarPreview from './AvatarPreview.jsx';
import { API_BASE } from '../../services/api.js';
import { X, Check, ShoppingBag, ImageIcon } from 'lucide-react';

function ItemThumbnail({ item, selected, onClick, owned }) {
  if (!item) return null;

  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition shrink-0 ${
        selected ? 'border-gold shadow-md' : 'border-ink/10 hover:border-ink/20'
      }`}
    >
      {item.image ? (
        <img src={item.image} alt={item.name} draggable={false} className="w-full h-full object-contain bg-ink/5" />
      ) : (
        <div className="w-full h-full bg-ink/5 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-ink/20" />
        </div>
      )}
      {owned ? (
        <div className="absolute bottom-0 inset-x-0 bg-green-500/80 text-white text-[8px] font-mono text-center py-0.5">
          Trang bị
        </div>
      ) : item.price > 0 ? (
        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono text-center py-0.5">
          💰 {item.price}
        </div>
      ) : null}
      {selected && (
        <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
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
          <AvatarPreview loadout={draft} items={items} size={256} />
        </div>

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto shrink-0">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold whitespace-nowrap transition ${
                activeTab === cat.id ? 'bg-gold text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
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
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-gold/10 text-gold text-[9px] font-mono font-bold hover:bg-gold/20 transition disabled:opacity-40"
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
          <span className="text-xs font-mono text-ink/40">💰 {localCoins.toLocaleString()} Coin</span>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 bg-ink/5 text-ink/60 rounded-xl text-sm font-body font-semibold hover:bg-ink/10 transition">
              Hủy
            </button>
            <button onClick={() => onSave(draft)}
              className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-body font-semibold hover:bg-gold/80 transition">
              Lưu Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
