import { useRef, useEffect } from 'react';
import { API_BASE } from '../../services/api.js';

function buildLayerStyle(item, spriteWidth, spriteHeight, containerSize) {
  if (!item || !item.width || !item.height) return { display: 'none' };
  const scaleX = containerSize / item.width;
  const scaleY = containerSize / item.height;
  const bgWidth = spriteWidth * scaleX;
  const bgHeight = spriteHeight * scaleY;
  const bgX = -(item.x * scaleX);
  const bgY = -(item.y * scaleY);
  return {
    backgroundImage: `url(${API_BASE.replace('/api', '')}/avatar/avatar-sprite.png)`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `${bgX}px ${bgY}px`,
    backgroundSize: `${bgWidth}px ${bgHeight}px`,
  };
}

export default function AvatarPreview({ loadout = {}, items = [], size = 512, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const layers = containerRef.current.querySelectorAll('.avatar-layer');
    layers.forEach(layer => {
      const layerName = layer.dataset.layer;
      const itemId = loadout[layerName];
      if (!itemId) {
        layer.style.cssText = 'position:absolute;inset:0;display:none;';
        return;
      }
      const item = items.find(i => i.id === itemId);
      if (!item) {
        layer.style.cssText = 'position:absolute;inset:0;display:none;';
        return;
      }
      const style = buildLayerStyle(item, 1536, 1024, size);
      layer.style.cssText = `position:absolute;inset:0;${Object.entries(style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';')};`;
    });
  }, [loadout, items, size]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="avatar-layer" data-layer="body" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="skin" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="face" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="hair" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="shirt" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="pants" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="shoes" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="hat" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="glasses" style={{ position: 'absolute', inset: 0 }} />
      <div className="avatar-layer" data-layer="accessory" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} />;
}
