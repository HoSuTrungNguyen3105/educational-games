import { useState } from 'react';
import { ManagementHeader, GhostButton } from '../../components/ui';
import { KID_LAYERS, kidPreset, renderKid } from '../../lib/dressUpCatalog.js';

const PRESETS = [
  { kind: 'boy', label: 'Bé trai' },
  { kind: 'girl', label: 'Bé gái' },
  { kind: 'dragon', label: 'Rồng xanh' },
];

export default function AvatarTemplateEditor() {
  const [kind, setKind] = useState('boy');
  const svg = renderKid(kidPreset(kind));

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Thứ tự lớp cố định của hệ DressUp" title="Avatar Template" />

      <div className="note-card p-3 text-xs text-ink/60">
        Thứ tự lớp được render cố định trong <code className="font-mono text-[11px]">renderKid</code>.
        Mắt, mũi, miệng nằm trong lớp <strong>Mặt</strong>; kính và mũ luôn vẽ trên cùng.
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] items-start">
        <div className="note-card p-4 space-y-3">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--stage, #f7f1e7)' }}>
            <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
              dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.kind}
                onClick={() => setKind(preset.kind)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                  kind === preset.kind ? 'bg-pink text-white' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="note-card p-4">
          <h3 className="font-display text-sm text-ink mb-3">Thứ tự vẽ</h3>
          <div className="space-y-2">
            {KID_LAYERS.map((layer, index) => (
              <div key={layer.key} className="flex items-start gap-3 px-3 py-2 rounded-xl bg-ink/[0.03]">
                <span className="w-5 text-right font-mono text-[11px] text-ink/30 font-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink/80">{layer.name}</div>
                  <div className="text-[11px] text-ink/40">{layer.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="note-card p-4 text-xs text-ink/60 leading-relaxed">
        <p><strong>Mắt:</strong> <code className="font-mono">x=224 / 288, y=210</code> · <strong>Mũi:</strong> <code className="font-mono">x=256, y=218–241</code> · <strong>Miệng:</strong> <code className="font-mono">y≈258–280</code>.</p>
        <p className="mt-1">Body rồng bỏ qua toàn bộ lớp phụ kiện. Mặc váy sẽ tự ẩn lớp quần.</p>
      </div>

      <GhostButton onClick={() => window.location.hash = '#/admin/avatar-items'}>
        Mở Avatar Items
      </GhostButton>
    </div>
  );
}
