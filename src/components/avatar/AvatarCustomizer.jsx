import { useState } from 'react';
import AvatarPreview from './AvatarPreview.jsx';
import { CATEGORIES, LAYER_ORDER, getItemsByCategory, getItemById, SPRITE_SHEET } from '../../data/avatarItems.js';
import { X, Check } from 'lucide-react';

function ItemThumbnail({ item, selected, onClick, owned }) {
  if (!item || !item.width) return null;
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition shrink-0 ${
        selected ? 'border-gold shadow-md' : 'border-ink/10 hover:border-ink/20'
      }`}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${SPRITE_SHEET})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `-${item.x}px -${item.y}px`,
          backgroundSize: 'auto',
        }}
      />
      {!owned && item.price > 0 && (
        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono text-center py-0.5">
          💰 {item.price}
        </div>
      )}
      {selected && (
        <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </button>
  );
}

export default function AvatarCustomizer({ loadout, inventory = [], coins = 0, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...loadout });
  const [activeTab, setActiveTab] = useState('hair');

  function selectItem(category, itemId) {
    const item = getItemById(itemId);
    if (!item) return;
    if (item.price > 0 && !inventory.includes(itemId)) {
      return;
    }
    setDraft(prev => ({ ...prev, [category]: itemId }));
  }

  function isOwned(itemId) {
    const item = getItemById(itemId);
    if (!item) return false;
    if (item.price === 0 || item.default) return true;
    return inventory.includes(itemId);
  }

  const tabItems = getItemsByCategory(activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10 shrink-0">
          <h2 className="font-display text-lg text-ink">Tùy chỉnh Avatar</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
            <X className="w-5 h-5 text-ink/50" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center py-6 shrink-0" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
          <AvatarPreview loadout={draft} size={200} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 overflow-x-auto shrink-0">
          {CATEGORIES.filter(c => LAYER_ORDER.includes(c.id)).map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold whitespace-nowrap transition ${
                activeTab === cat.id
                  ? 'bg-gold text-white'
                  : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {tabItems.map(item => (
              <ItemThumbnail
                key={item.id}
                item={item}
                selected={draft[activeTab] === item.id}
                owned={isOwned(item.id)}
                onClick={() => selectItem(activeTab, item.id)}
              />
            ))}
          </div>
          {tabItems.length === 0 && (
            <p className="text-sm text-ink/40 text-center py-8">Chưa có item nào</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-ink/10 shrink-0">
          <span className="text-xs font-mono text-ink/40">💰 {coins.toLocaleString()} Coin</span>
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
