import { useCallback, useState } from 'react';
import { ManagementHeader, GhostButton, PrimaryButton } from '../../components/ui';
import { kidBodies, kidPreset, renderKid } from '../../lib/dressUpCatalog.js';

const DATA_FILE = 'src/games/_shared/lib/dressUpAvatarData.js';

function BodyCard({ preview, onCopy, copied }) {
  const svg = renderKid(preview.state);
  return (
    <div className="note-card p-3 flex gap-3">
      <div className="w-20 shrink-0 rounded-lg bg-ink/[0.04] overflow-hidden">
        <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="font-semibold text-sm text-ink truncate">{preview.name}</div>
          <div className="text-[10px] font-mono text-ink/40 mt-0.5">{preview.code}</div>
          <p className="text-[11px] text-ink/50 mt-1 leading-snug">{preview.note}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal/15 text-teal">
              {preview.badge}
            </span>
            {preview.overlays === false && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-600">
                Không nhận phụ kiện
              </span>
            )}
          </div>
        </div>
        <button onClick={() => onCopy(preview.copyValue)}
          className="mt-2 self-start text-[11px] font-semibold text-ticket hover:underline">
          {copied === preview.copyValue ? 'Đã copy' : 'Copy mã'}
        </button>
      </div>
    </div>
  );
}

export default function BodyCustomImport({ showToast }) {
  const [copied, setCopied] = useState(null);
  const bodies = kidBodies();
  const previews = [
    {
      name: 'Bé trai',
      code: 'body_01',
      note: 'Thân người + tóc ngắn, áo trắng, quần jean, giày trắng.',
      badge: 'Mẫu bé trai',
      state: kidPreset('boy'),
      copyValue: 'body_01',
      overlays: bodies.body_01?.overlays,
    },
    {
      name: bodies.body_girl_01?.n || 'Bé gái',
      code: 'body_girl_01',
      note: 'Eo gọn + chân trần, tóc dài, váy hồng, giày hồng. Bỏ được áo/quần/giày.',
      badge: 'Mẫu bé gái',
      state: kidPreset('girl'),
      copyValue: 'body_girl_01',
      overlays: bodies.body_girl_01?.overlays,
    },
    {
      name: bodies.body_dragon_01?.n || 'Rồng xanh',
      code: 'body_dragon_01',
      note: 'Body khắc sẵn mặt và chi tiết, không nhận phụ kiện.',
      badge: 'Dùng chung',
      state: kidPreset('dragon'),
      copyValue: 'body_dragon_01',
      overlays: bodies.body_dragon_01?.overlays,
    },
  ];

  const copy = useCallback(async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      showToast(`Đã copy "${value}"`, 'success');
      setTimeout(() => setCopied(null), 1500);
    } catch {
      showToast('Trình duyệt chặn copy - hãy copy tay', 'error');
    }
  }, [showToast]);

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Thân và các lớp phụ kiện của avatar" title="Thân Avatar" />

      <div className="note-card p-4 text-xs text-ink/70 leading-relaxed">
        <p>
          Avatar dùng chung dữ liệu với modal <strong>Tùy chỉnh Avatar</strong> ở trang hồ sơ:
          thân, mặt, tóc, màu tóc, da, áo, váy, quần, giày, kính, mũ và phụ kiện đều là các lớp riêng.
          Mắt, mũi, miệng nằm trong lớp <strong>Mặt</strong> tại <code className="font-mono text-[11px] bg-ink/5 px-1 rounded">FACES</code>.
        </p>
        <p className="mt-2">
          Dữ liệu nằm trong mã frontend: <code className="font-mono text-[11px] bg-ink/5 px-1 rounded">{DATA_FILE}</code>.
          Không lưu trong database và không cần gọi server.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {previews.map((preview) => (
          <BodyCard key={preview.name} preview={preview} onCopy={copy} copied={copied} />
        ))}
      </div>

      <div className="note-card p-4">
        <h3 className="font-display text-sm text-ink mb-2">Vị trí các lớp trên body</h3>
        <ol className="list-decimal list-inside space-y-1 text-xs text-ink/60">
          <li>Phụ kiện sau thân (áo choàng, túi) → Tóc sau → Thân (tay, cổ, đầu).</li>
          <li>Mặt: mắt ở <code className="font-mono">x=224/288, y=210</code>, mũi ở <code className="font-mono">x=256, y=218–241</code>, miệng ở <code className="font-mono">y≈258–280</code>.</li>
          <li>Tóc trước → Áo/Váy → Quần → Giày → Phụ kiện trước → Kính → Mũ.</li>
          <li>Mặc váy sẽ tự ẩn lớp quần; body rồng bỏ qua toàn bộ lớp phụ kiện.</li>
        </ol>
      </div>

      <div className="note-card p-4">
        <h3 className="font-display text-sm text-ink mb-2">Thêm hoặc sửa avatar</h3>
        <ol className="list-decimal list-inside space-y-1 text-xs text-ink/60">
          <li>Mở <code className="font-mono">{DATA_FILE}</code>.</li>
          <li>Thêm body vào <code className="font-mono">BODIES</code>, mặt vào <code className="font-mono">FACES</code>, tóc vào <code className="font-mono">HAIRS</code>.</li>
          <li>Thêm áo/váy/quần/giày/kính/mũ/phụ kiện vào đúng registry tương ứng.</li>
          <li>Thêm tab vào <code className="font-mono">KID_TABS</code> và cấu hình preview trong <code className="font-mono">tabCfg</code>.</li>
          <li>Build lại frontend; trang hồ sơ và 2 game dress-up sẽ dùng chung thay đổi.</li>
        </ol>
      </div>

      <div className="flex gap-2">
        <GhostButton onClick={() => window.location.hash = '#/admin/avatar-items'}>
          Xem Avatar Items
        </GhostButton>
        <PrimaryButton onClick={() => copy(DATA_FILE)}>
          Copy đường dẫn file
        </PrimaryButton>
      </div>
    </div>
  );
}
