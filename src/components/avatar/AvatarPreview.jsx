function ItemLayer({ item, size }) {
  if (!item || !item.image) return null;
  return (
    <img
      src={item.image}
      alt={item.name || ''}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      draggable={false}
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
        return <ItemLayer key={layerKey} item={item} size={size} />;
      })}
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} />;
}
