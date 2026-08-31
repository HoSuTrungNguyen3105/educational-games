const SPRITE_W = 1536;
const SPRITE_H = 1024;

function ItemLayer({ item, size }) {
  if (!item) return null;

  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.name || ''}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    );
  }

  if (item.x !== undefined && item.y !== undefined && item.width && item.height && item.spriteSheet) {
    const scale = Math.min(size / SPRITE_W, size / SPRITE_H);
    const displayW = SPRITE_W * scale;
    const displayH = SPRITE_H * scale;
    const offsetX = (size - displayW) / 2;
    const offsetY = (size - displayH) / 2;
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          width: item.width * scale,
          height: item.height * scale,
          left: offsetX + item.x * scale,
          top: offsetY + item.y * scale,
          backgroundImage: `url(${item.spriteSheet})`,
          backgroundSize: `${displayW}px ${displayH}px`,
          backgroundPosition: `-${item.x * scale}px -${item.y * scale}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    );
  }

  return null;
}

export default function AvatarPreview({ loadout = {}, items = [], size = 512, className = '', spriteSheet = '' }) {
  const resolved = Object.entries(loadout)
    .map(([category, itemId]) => {
      if (!itemId) return null;
      const item = items.find(i => i.id === itemId);
      if (!item) return null;
      return { ...item, _category: category, spriteSheet: item.spriteSheet || spriteSheet };
    })
    .filter(Boolean)
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: size, height: size }}>
      {resolved.map(item => (
        <ItemLayer key={item._category} item={item} size={size} />
      ))}
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '', spriteSheet = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} spriteSheet={spriteSheet} />;
}
