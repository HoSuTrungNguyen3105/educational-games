import { SPRITE_SHEET, LAYER_ORDER, getItemById } from '../../data/avatarItems.js';

function SpriteLayer({ item, size }) {
  if (!item || !item.width || !item.height) return null;
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${SPRITE_SHEET})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${item.x}px -${item.y}px`,
        backgroundSize: 'auto',
        imageRendering: 'auto',
      }}
    />
  );
}

export default function AvatarPreview({ loadout = {}, size = 256, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {LAYER_ORDER.map(layerKey => {
        const itemId = loadout[layerKey];
        if (!itemId) return null;
        const item = getItemById(itemId);
        if (!item) return null;
        return <SpriteLayer key={layerKey} item={item} size={size} />;
      })}
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, size = 64, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {LAYER_ORDER.map(layerKey => {
        const itemId = loadout[layerKey];
        if (!itemId) return null;
        const item = getItemById(itemId);
        if (!item) return null;
        return <SpriteLayer key={layerKey} item={item} size={size} />;
      })}
    </div>
  );
}
