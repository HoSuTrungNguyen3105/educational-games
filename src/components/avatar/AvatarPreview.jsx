import { renderAvatarFull } from '../../lib/avatarRenderer.js';

export default function AvatarPreview({ loadout = {}, items = [], size = 512, className = '' }) {
  const state = {};
  let bodyHtml = null;

  for (const [category, itemId] of Object.entries(loadout)) {
    if (!itemId) continue;
    const item = items.find(i => i.id === itemId);
    if (!item) continue;

    if (category === 'body') {
      bodyHtml = item.html || null;
    } else if (category === 'skin') {
      state.skin = item.params?.hex || '#FFDFC4';
    } else if (category === 'face') {
      state.face = item.params?.style || 'gentle';
    } else if (category === 'hair') {
      state.hair = { style: item.params?.style || 'spiky', color: item.params?.color || '#6B4226' };
    } else if (category === 'shirt') {
      state.shirt = { style: item.params?.style || 'tee', color: item.params?.color || '#F5F5F5' };
    } else if (category === 'pants') {
      state.pants = { style: item.params?.style || 'shorts', color: item.params?.color || '#241F1C' };
    } else if (category === 'shoes') {
      state.shoes = { style: item.params?.style || 'sneaker', color: item.params?.color || '#3B5EA6' };
    } else if (category === 'hat') {
      state.hat = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    } else if (category === 'glasses') {
      state.glasses = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    } else if (category === 'accessory') {
      state.accessory = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
    }
  }

  const svgContent = renderAvatarFull(state, bodyHtml);
  const isFullSvg = svgContent && (svgContent.includes('<svg') || (svgContent.includes('id="head"') && svgContent.includes('id="body"')));
  const viewBox = isFullSvg ? '0 0 512 700' : '0 0 300 440';
  const aspectRatio = isFullSvg ? (700 / 512) : (440 / 300);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: size, height: size * aspectRatio }}>
      <svg viewBox={viewBox} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

export function AvatarPreviewSmall({ loadout = {}, items = [], size = 64, className = '' }) {
  return <AvatarPreview loadout={loadout} items={items} size={size} className={`rounded-full ${className}`} />;
}
