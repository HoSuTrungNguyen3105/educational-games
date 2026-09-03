import { useState, useEffect } from 'react';
import { renderAvatarFull } from '../../lib/avatarRenderer.js';
import { API_BASE } from '../../services/api.js';

function buildAvatarState(loadout, items) {
  const state = {};
  let bodyHtml = null;
  for (const [category, itemId] of Object.entries(loadout)) {
    if (!itemId) continue;
    const item = items.find(i => i.id === itemId);
    if (!item) continue;
    if (category === 'body') bodyHtml = item.html || null;
    else if (category === 'skin') state.skin = item.params?.hex || '#FFDFC4';
    else if (category === 'face') state.face = item.params?.style || 'gentle';
    else if (category === 'hair') state.hair = { style: item.params?.style || 'spiky', color: item.params?.color || '#6B4226' };
    else if (category === 'shirt') state.shirt = { style: item.params?.style || 'tee', color: item.params?.color || '#F5F5F5' };
    else if (category === 'pants') state.pants = { style: item.params?.style || 'shorts', color: item.params?.color || '#241F1C' };
    else if (category === 'shoes') state.shoes = { style: item.params?.style || 'sneaker', color: item.params?.color || '#3B5EA6' };
    else if (category === 'hat') state.hat = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    else if (category === 'glasses') state.glasses = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    else if (category === 'accessory') state.accessory = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
  }
  return { state, bodyHtml };
}

export function useAvatarData(userAuth) {
  const [loadout, setLoadout] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!userAuth?.token) return;
    Promise.all([
      fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
      fetch(`${API_BASE}/avatar/loadout`, {
        headers: { Authorization: `Bearer ${userAuth.token}` },
      }).then(r => r.json()),
    ]).then(([itemsRes, loadoutRes]) => {
      if (itemsRes.status) setItems(itemsRes.data.items || []);
      if (loadoutRes.status) {
        const raw = loadoutRes.data.loadout || {};
        const VALID_LAYERS = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];
        const defaults = { body: null, skin: 'skin_01', face: 'face_01', hair: 'hair_boy_01', shirt: 'shirt_boy_01', pants: 'pants_boy_01', shoes: 'shoes_boy_01', hat: null, glasses: null, accessory: null };
        const cleaned = {};
        const allItems = itemsRes.data.items || [];
        const itemIds = new Set(allItems.map(i => i.id));
        for (const k of VALID_LAYERS) {
          const v = raw[k];
          if (v && itemIds.has(v)) cleaned[k] = v;
          else cleaned[k] = defaults[k] ?? null;
        }
        setLoadout(cleaned);
      }
    }).catch(() => {});
  }, [userAuth?.token]);

  return { loadout, items };
}

export default function GardenerAvatar({ userAuth, size = 120, watering = false, wateringSlotIndex = null, gardenRef, className = '' }) {
  const { loadout, items } = useAvatarData(userAuth);
  const { state, bodyHtml } = buildAvatarState(loadout, items);
  const svgContent = renderAvatarFull(state, bodyHtml);
  const isFullSvg = svgContent && (svgContent.includes('<svg') || (svgContent.includes('id="head"') && svgContent.includes('id="body"')));
  const viewBox = isFullSvg ? '0 0 512 700' : '0 0 300 440';
  const aspectRatio = isFullSvg ? (700 / 512) : (440 / 300);

  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!watering || wateringSlotIndex === null || !gardenRef?.current) {
      setPos({ x: 0, y: 0 });
      return;
    }
    const grid = gardenRef.current;
    const slots = grid.querySelectorAll('[data-slot-index]');
    const targetSlot = Array.from(slots).find(s => s.dataset.slotIndex === String(wateringSlotIndex));
    if (!targetSlot) return;
    const gridRect = grid.getBoundingClientRect();
    const slotRect = targetSlot.getBoundingClientRect();
    const targetX = slotRect.left - gridRect.left + slotRect.width / 2 - size / 2;
    const targetY = slotRect.top - gridRect.top - size * 0.15;
    setPos({ x: targetX, y: targetY });
  }, [watering, wateringSlotIndex, gardenRef, size]);

  if (!userAuth?.user) return null;

  const isAtTarget = watering && (pos.x !== 0 || pos.y !== 0);

  return (
    <div
      className={`absolute z-20 pointer-events-none transition-all ${className}`}
      style={{
        width: size,
        height: size * aspectRatio,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transitionDuration: isAtTarget ? '600ms' : '500ms',
        transitionTimingFunction: isAtTarget ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-in-out',
      }}
    >
      <div className={`relative ${watering ? 'gd-gardener-water' : 'gd-gardener-idle'}`}
        style={{ width: '100%', height: '100%' }}>
        <svg viewBox={viewBox} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: svgContent }} />

        {watering && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                className="gd-droplet"
                style={{
                  position: 'absolute',
                  left: `${-12 + i * 6}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
