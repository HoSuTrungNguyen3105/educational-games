const AVATAR_W = 245;
const AVATAR_H = 275;

function ItemLayer({ item, category, template }) {
  if (!item || !item.html) return null;
  const pos = template?.[category];
  if (!pos) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${(pos.x / AVATAR_W) * 100}%`,
        top: `${(pos.y / AVATAR_H) * 100}%`,
        width: `${(pos.width / AVATAR_W) * 100}%`,
        height: `${(pos.height / AVATAR_H) * 100}%`,
        zIndex: pos.zIndex || 0,
      }}
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  );
}

export default function AvatarPreview({ loadout = {}, items = [], template = {}, size = 512, className = '' }) {
  const LAYER_ORDER = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];

  const resolved = LAYER_ORDER
    .map(category => {
      const itemId = loadout[category];
      if (!itemId) return null;
      const item = items.find(i => i.id === itemId);
      if (!item) return null;
      return { item, category };
    })
    .filter(Boolean);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size * (AVATAR_H / AVATAR_W) }}
    >
      {resolved.map(({ item, category }) => (
        <ItemLayer
          key={category}
          item={item}
          category={category}
          template={template}
        />
      ))}
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], template = {}, size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} template={template} size={size} className={`rounded-full ${className}`} />;
}
