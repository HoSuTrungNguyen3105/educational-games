import { composeAvatar, buildLayersFromLoadout, AVATAR_VIEW_BOX, AVATAR_ASPECT } from '../../lib/avatarRenderer.js';

export default function AvatarPreview({ loadout = {}, items = [], size = 512, className = '' }) {
  const { bodyCode, skin, layers } = buildLayersFromLoadout(loadout, items);
  const svgContent = composeAvatar({ bodyCode, skin, layers });

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: size, height: size * AVATAR_ASPECT }}>
      <svg viewBox={AVATAR_VIEW_BOX} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} />;
}
