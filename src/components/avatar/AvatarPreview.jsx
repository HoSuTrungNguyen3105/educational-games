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
  const resolved = Object.entries(loadout)
    .map(([category, itemId]) => {
      if (!itemId) return null;
      const item = items.find(i => i.id === itemId);
      if (!item) return null;
      return { ...item, _category: category };
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

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} />;
}
