import { useState, useEffect, useRef } from 'react';
import { composeAvatar, buildLayersFromLoadout, AVATAR_VIEW_BOX, AVATAR_ASPECT } from '../../lib/avatarRenderer.js';
import { API_BASE } from '../../services/api.js';

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
        const defaults = { body: 'body_boy_01', skin: 'skin_01', face: 'face_01', hair: 'hair_boy_01', shirt: 'shirt_boy_01', pants: 'pants_boy_01', shoes: 'shoes_boy_01', hat: null, glasses: null, accessory: null };
        const cleaned = {};
        for (const k of VALID_LAYERS) {
          const v = raw[k];
          // Body là code frontend, không nằm trong `items` → lấy thẳng.
          if (k === 'body') { cleaned[k] = v || defaults[k]; continue; }
          if (v && typeof v === 'object' && v.code) cleaned[k] = v.code;
          else if (typeof v === 'string') cleaned[k] = v;
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
  const { bodyCode, skin, layers } = buildLayersFromLoadout(loadout, items);
  const svgContent = composeAvatar({ bodyCode, skin, layers });

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!watering || wateringSlotIndex === null || !gardenRef?.current) {
      setPos({ x: 0, y: 0 });
      return;
    }
    const grid = gardenRef.current;
    const slots = grid.querySelectorAll('[data-slot-index]');
    const targetSlot = Array.from(slots).find(s => s.dataset.slotIndex === String(wateringSlotIndex));
    if (!targetSlot) return;
    const avatarEl = avatarRef.current;
    if (!avatarEl) return;
    const avatarRect = avatarEl.getBoundingClientRect();
    const slotRect = targetSlot.getBoundingClientRect();
    const deltaX = slotRect.left + slotRect.width / 2 - (avatarRect.left + avatarRect.width / 2);
    const deltaY = slotRect.top - avatarRect.bottom + 10;
    setPos({ x: deltaX, y: deltaY });
  }, [watering, wateringSlotIndex, gardenRef, size]);

  if (!userAuth?.user) return null;

  const isAtTarget = watering && (pos.x !== 0 || pos.y !== 0);

  return (
    <div
      ref={avatarRef}
      className={`relative z-20 pointer-events-none transition-all ${className}`}
      style={{
        width: size,
        height: size * AVATAR_ASPECT,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transitionDuration: isAtTarget ? "600ms" : "500ms",
        transitionTimingFunction: isAtTarget ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease-in-out",
      }}
    >
      <div className={`relative ${watering ? "gd-gardener-water" : "gd-gardener-idle"}`}
        style={{ width: "100%", height: "100%" }}>
        <svg viewBox={AVATAR_VIEW_BOX} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
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
