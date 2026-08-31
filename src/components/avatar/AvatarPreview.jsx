import { SPRITE_WIDTH, SPRITE_HEIGHT } from '../../data/avatarItems.js';

const SPRITE_SHEET = `${import.meta.env.BASE_URL}avatar/avatar-sprite.png`;

function SpriteLayer({ item, size }) {
  if (!item || !item.width || !item.height) return null;
  const scaleX = size / item.width;
  const scaleY = size / item.height;
  const bgWidth = SPRITE_WIDTH * scaleX;
  const bgHeight = SPRITE_HEIGHT * scaleY;
  const bgX = -(item.x * scaleX);
  const bgY = -(item.y * scaleY);
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${SPRITE_SHEET})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundSize: `${bgWidth}px ${bgHeight}px`,
      }}
    />
  );
}

export default function AvatarPreview({ loadout = {}, items = [], size = 512, className = '' }) {
  const LAYER_ORDER = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: size, height: size }}>
      {LAYER_ORDER.map(layerKey => {
        const itemId = loadout[layerKey];
        if (!itemId) return null;
        const item = items.find(i => i.id === itemId);
        if (!item) return null;
        return <SpriteLayer key={layerKey} item={item} size={size} />;
      })}
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} />;
}
