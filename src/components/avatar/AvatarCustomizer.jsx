import { IconCheck, IconClose } from '../ui/index.js';
import { useState, useEffect, useMemo } from 'react';
import AvatarPreview from './AvatarPreview.jsx';
import { composeAvatar, buildLayersFromLoadout } from '../../lib/avatarRenderer.js';
import { AVATAR_BODIES } from '../../data/avatarBodies.js';
import { API_BASE } from '../../services/api.js';
import { Modal } from '../ui';
import { ShoppingBag } from 'lucide-react';

function ItemThumbnail({ item, selected, preview, onClick, owned, loadout, items }) {
  // Hook phải gọi vô điều kiện → tách thành component con và return sớm ở
  // component cha. Trước đây `if (!item) return null` nằm TRƯỚC useMemo khiến
  // số hook gọi mỗi lần render là khác nhau.
  const fullAvatarSvg = useMemo(() => {
    if (!item) return null;
    if (item.category === 'skin') return null;

    // Ghép bộ đồ đang chọn, thay đúng layer này bằng item đang xem.
    const draft = { ...loadout, [item.category]: item.code };
    return composeAvatar(buildLayersFromLoadout(draft, items));
  }, [item, loadout, items]);

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
    if (fullAvatarSvg) {
      return (
        <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: fullAvatarSvg }} />
      );
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition shrink-0 flex items-center justify-center ${selected ? 'border-pink shadow-md' : preview ? 'border-sky shadow-sm' : 'border-ink/10 hover:border-ink/20'
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
          <IconCheck className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </button>
  );
}

/** Body gốc nằm trong mã frontend nên không đến từ API. */
function BodyThumbnail({ body, selected, onClick }) {
  const svg = useMemo(() => body.render?.('#FFDFC4') || '', [body]);
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition shrink-0 flex items-center justify-center
        ${selected ? 'border-pink shadow-md' : 'border-ink/10 hover:border-ink/20'}`}
    >
      <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svg }} />
      {selected && (
        <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-pink flex items-center justify-center">
          <IconCheck className="w-2.5 h-2.5 text-white" />
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
          const fetchedItems = json.data.items || [];
          setItems(fetchedItems);
          setCategories(json.data.categories);
          setDraft(prev => ({ ...prev, body: prev.body || 'body_boy_01' }));
        }
      })
      .catch(() => { });
  }, []);

  function selectItem(category, itemCode) {
    const item = items.find(i => i.code === itemCode);
    if (!item) return;
    if (item.price > 0 && !localInventory.includes(itemCode)) return;
    setDraft(prev => ({ ...prev, [category]: itemCode }));
    setPreviewItem(null);
  }

  function previewItemClick(item) {
    if (isOwned(item.code)) {
      selectItem(item.category, item.code);
    } else {
      setPreviewItem(item);
    }
  }

  function isOwned(itemCode) {
    const item = items.find(i => i.code === itemCode);
    if (!item) return false;
    if (item.price === 0 || item.default) return true;
    return localInventory.includes(itemCode);
  }

  async function handleBuy(item) {
    if (!token || buying) return;
    setBuying(item.code);
    try {
      const res = await fetch(`${API_BASE}/avatar/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemCode: item.code }),
      });
      const json = await res.json();
      if (json.status) {
        setLocalInventory(json.data.inventory);
        setLocalCoins(json.data.coins);
        setDraft(prev => ({ ...prev, [item.category]: item.code }));
        setPreviewItem(null);
      }
    } catch {
      // Mua hỏng (mất mạng / hết coin): giữ nguyên bộ đồ đang chọn, người
      // chơi thử lại được. Không set state trong nhánh lỗi để tránh kẹt busy.
    }
    setBuying(null);
  }

  const tabItems = items.filter(i => i.category === activeTab);

  const previewLoadout = useMemo(() => {
    if (previewItem) {
      const p = { ...draft };
      p[previewItem.category] = previewItem.code;
      return p;
    }
    return draft;
  }, [draft, previewItem]);

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg text-ink">Tùy chỉnh Avatar</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition">
          <IconClose className="w-5 h-5 text-ink/50" />
        </button>
      </div>

      {/* Preview area with buy button overlay */}
      <div className="relative flex justify-center py-4 mb-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
        <AvatarPreview loadout={previewLoadout} items={items} size={200} />

        {previewItem && !isOwned(previewItem.code) && previewItem.price > 0 && (
          <button
            onClick={() => handleBuy(previewItem)}
            disabled={buying === previewItem.code || localCoins < previewItem.price}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink text-white text-sm font-bold shadow-lg hover:bg-pink/80 transition disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {buying === previewItem.code ? 'Đang mua...' : `Mua ${previewItem.price} coin`}
          </button>
        )}

        {previewItem && isOwned(previewItem.code) && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-green-500 text-white text-xs font-bold shadow-lg">
            <IconCheck className="w-3.5 h-3.5" /> Đã sở hữu
          </div>
        )}
      </div>

      {previewItem && (
        <div className="flex items-center justify-center gap-3 px-3 py-2 mb-3 rounded-lg bg-sky/5 border border-sky/10">
          <span className="text-xs font-body text-sky font-semibold">Đang xem: {previewItem.name}</span>
          <button onClick={() => setPreviewItem(null)} className="text-[10px] font-mono text-sky/60 hover:text-sky">đóng</button>
        </div>
      )}

      <div className="flex gap-1 mb-3 overflow-x-auto">
        <button onClick={() => { setActiveTab('__body'); setPreviewItem(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold whitespace-nowrap transition ${activeTab === '__body' ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'}`}>
          Thân
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => { setActiveTab(cat.id); setPreviewItem(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold whitespace-nowrap transition ${activeTab === cat.id ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
              }`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="max-h-60 overflow-y-auto mb-3">
        {/* Thân: chọn trong mã frontend, miễn phí, không cần sở hữu. */}
        {activeTab === '__body' ? (
          <div className="flex flex-wrap gap-2">
            {AVATAR_BODIES.map(b => (
              <BodyThumbnail
                key={b.code}
                body={b}
                selected={draft.body === b.code}
                onClick={() => setDraft(prev => ({ ...prev, body: b.code }))}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {tabItems.map(item => {
                const owned = isOwned(item.code);
                const isPreviewing = previewItem?.code === item.code;
                const isSelected = draft[activeTab] === item.code;
                return (
                  <div key={item.code} className="flex flex-col items-center gap-1">
                    <ItemThumbnail
                      item={item}
                      selected={isSelected}
                      preview={isPreviewing && !isSelected}
                      owned={owned}
                      loadout={draft}
                      items={items}
                      onClick={() => previewItemClick(item)}
                    />
                    {!owned && item.price > 0 && (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={buying === item.code || localCoins < item.price}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink/10 text-pink text-xs font-mono font-bold hover:bg-pink/20 transition disabled:opacity-40"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        {buying === item.code ? '...' : `${item.price}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {tabItems.length === 0 && (
              <p className="text-sm text-ink/40 text-center py-8">Chưa có item nào</p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-ink/10">
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
    </Modal>
  );
}
