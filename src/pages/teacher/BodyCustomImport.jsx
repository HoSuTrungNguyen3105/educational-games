import { useCallback, useState } from 'react';
import { ManagementHeader, GhostButton, PrimaryButton } from '../../components/ui.jsx';
import { AVATAR_BODIES } from '../../data/avatarBodies.js';

/** Một thẻ body. Tách riêng vì `useMemo` không được gọi trong vòng `.map()`. */
function BodyCard({ body, onCopy, copied }) {
  const svg = body.render?.('#FFDFC4') || '';
  return (
    <div className="note-card p-3 flex gap-3">
      <div className="w-20 shrink-0 rounded-lg bg-ink/[0.04] overflow-hidden">
        <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="font-semibold text-sm text-ink truncate">{body.name}</div>
          <div className="text-[10px] font-mono text-ink/40 mt-0.5">{body.code}</div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {body.gender && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-600">
                {body.gender === 'girl' ? 'Bé gái' : 'Bé trai'}
              </span>
            )}
            {body.overlays === false && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-600">
                Không nhận phụ kiện
              </span>
            )}
            {body.default && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal/15 text-teal">Mặc định</span>
            )}
          </div>
        </div>
        <button onClick={() => onCopy(body.code)}
          className="mt-2 self-start text-[11px] font-semibold text-ticket hover:underline">
          {copied === body.code ? 'Đã copy' : 'Copy mã'}
        </button>
      </div>
    </div>
  );
}

/**
 * XEM THÂN AVATAR (body gốc).
 *
 * Trước đây trang này nhập SVG body từ JSON rồi POST lên /avatar/admin/body.
 * Nay thân avatar là MÃ FRONTEND (src/data/avatarBodies.js) — server không lưu,
 * không render body. Trang chỉ còn vai trò xem toàn bộ body sẵn có và chỉ ra
 * file cần sửa để thêm body mới.
 */
export default function BodyCustomImport({ showToast }) {
  const [copied, setCopied] = useState(null);

  const copy = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      showToast(`Đã copy mã "${code}"`, 'success');
      setTimeout(() => setCopied(null), 1500);
    } catch {
      showToast('Trình duyệt chặn copy — hãy copy tay', 'error');
    }
  }, [showToast]);

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Thân avatar nằm trong mã frontend" title="🧍 Thân Avatar" />

      <div className="note-card p-4 text-xs text-ink/70 leading-relaxed">
        <p>
          Thân avatar <strong>không còn lưu trong database</strong>. Nó là phần nền tĩnh dùng chung cho mọi người chơi,
          nên nằm trong mã frontend: <code className="font-mono text-[11px] bg-ink/5 px-1 rounded">src/data/avatarBodies.js</code>.
        </p>
        <p className="mt-2">
          Thêm body mới = thêm 1 mục vào mảng <code className="font-mono text-[11px] bg-ink/5 px-1 rounded">AVATAR_BODIES</code> rồi build lại.
          Còn phụ kiện (tóc, áo, mũ…) vẫn quản lý trên server tại trang <a className="text-ticket underline" href="#/admin/avatar-items">Avatar Items</a>.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AVATAR_BODIES.map((body) => (
          <BodyCard key={body.code} body={body} onCopy={copy} copied={copied} />
        ))}
      </div>

      <div className="note-card p-4">
        <h3 className="font-display text-sm text-ink mb-2">Cách thêm body mới</h3>
        <ol className="list-decimal list-inside space-y-1 text-xs text-ink/60">
          <li>Vẽ SVG ở hệ toạ độ <code className="font-mono">512 × 700</code>.</li>
          <li>Thêm hàm render vào <code className="font-mono">src/data/avatarBodies.js</code>.</li>
          <li>Thêm 1 phần tử vào mảng <code className="font-mono">AVATAR_BODIES</code> với <code className="font-mono">code</code> duy nhất.</li>
          <li>Đặt <code className="font-mono">overlays: false</code> nếu body đã khắc sẵn mặt/chi tiết và không nhận phụ kiện.</li>
          <li>Build lại frontend — <strong>không</strong> cần đụng tới server.</li>
        </ol>
      </div>

      <div className="flex gap-2">
        <GhostButton onClick={() => window.location.hash = '#/admin/avatar-items'}>
          Mở trang Avatar Items
        </GhostButton>
        <PrimaryButton onClick={() => copy('src/data/avatarBodies.js')}>
          Copy đường dẫn file
        </PrimaryButton>
      </div>
    </div>
  );
}
