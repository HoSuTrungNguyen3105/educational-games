import { useState } from 'react';
import { ManagementHeader, GhostButton, PrimaryButton, StatGrid } from '../../components/ui';
import { Check, RotateCcw } from 'lucide-react';
import {
  KID_LAYERS, kidApplyBody, kidBodies, kidCatalogStats, kidDefaults, kidItemLabel,
  kidPreset, kidPresets, kidTabCfg, kidTabs, renderKid, sanitizeKid,
} from '../../lib/dressUpCatalog.js';

const DATA_FILE = 'src/games/_shared/lib/dressUpAvatarData.js';

function ItemThumb({ cfg, id, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      title={id === null ? 'Không dùng' : id}
      className={`aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition ${
        selected ? 'border-pink shadow-md' : 'border-ink/10 hover:border-pink/40'
      }`}
      style={{ background: 'var(--stage, #f7f1e7)' }}
    >
      {id === null ? (
        <span className="text-xl opacity-40">🚫</span>
      ) : cfg.kind === 'dot' ? (
        <span
          className="w-[58%] aspect-square rounded-full border border-black/10"
          style={{ background: cfg.dot(id) }}
        />
      ) : (
        <svg viewBox={cfg.vb} width="100%" height="100%">
          <g dangerouslySetInnerHTML={{ __html: cfg.pv(id) }} />
        </svg>
      )}
    </button>
  );
}

export default function AvatarItemManagement({ showToast }) {
  const [state, setState] = useState(() => kidDefaults());
  const [tab, setTab] = useState('body');

  const tabs = kidTabs(state);
  const activeTab = tabs.find((item) => item.k === tab) || tabs[0];
  const cfg = activeTab ? kidTabCfg(activeTab.k, state) : null;
  const stats = kidCatalogStats(state);
  const svg = renderKid(state);

  const pick = (id) => {
    const field = activeTab?.k;
    if (!field) return;
    /* Chọn thân = đổi luôn "diện" chuẩn (tóc, áo/váy, giày) giống modal ở
     * client, để admin nhìn đúng bộ đồ mà bé sẽ nhận. */
    if (field === 'body') {
      setState((current) => kidApplyBody(current, id));
      return;
    }
    setState((current) => sanitizeKid({ ...current, [field]: id }));
  };

  const applyPreset = (kind) => {
    setState(kidPreset(kind));
    setTab('body');
  };

  const reset = () => {
    setState(kidDefaults());
    setTab('body');
  };

  const copyDataPath = async () => {
    try {
      await navigator.clipboard.writeText(DATA_FILE);
      showToast(`Đã copy "${DATA_FILE}"`, 'success');
    } catch {
      showToast('Trình duyệt chặn copy - hãy copy tay', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Dùng chung với modal Tùy chỉnh Avatar ở #/profile" title="Avatar Items" />

      <div className="note-card p-3 text-xs text-ink/60 flex items-start gap-2">
        <span className="text-base leading-none">💡</span>
        <span>
          Đây là danh mục phụ kiện của hệ avatar mới. Mắt, mũi, miệng, lông mày, má nằm trong tab <strong>Mặt</strong>.
          Dữ liệu nằm trong mã frontend <code className="font-mono text-[11px]">{DATA_FILE}</code>, không lưu database.
          Hồ sơ người chơi chỉ lưu <strong>ID</strong> món đồ; client tự render bằng đúng bộ dữ liệu này nên
          admin và trang cá nhân luôn khớp nhau — không phụ thuộc markup từ backend.
        </span>
      </div>

      <StatGrid stats={[
        { icon: '🧩', value: stats.tabs.length, label: 'Nhóm phụ kiện' },
        { icon: '🎨', value: stats.itemCount, label: 'Lựa chọn' },
        { icon: '🧍', value: stats.bodyCount, label: 'Body' },
        { icon: '📚', value: KID_LAYERS.length, label: 'Lớp vẽ' },
      ]} />

      <div className="grid gap-4 lg:grid-cols-[300px_1fr] items-start">
        <div className="note-card p-4 space-y-3">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--stage, #f7f1e7)' }}>
            <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
              dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Một nút cho mỗi thân trong BODIES — thêm body mới là nút tự xuất hiện */}
            {kidPresets().map((preset) => (
              <button key={preset.kind} onClick={() => applyPreset(preset.kind)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold ${
                  preset.overlays
                    ? 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}>
                {preset.label}
              </button>
            ))}
            <button onClick={reset}
              className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-ink/5 text-ink/60 hover:bg-ink/10 flex items-center justify-center gap-1">
              <RotateCcw className="w-3 h-3" /> Mặc lại
            </button>
          </div>
          <p className="text-[11px] text-ink/45 text-center">
            Chọn item bên phải để xem thay đổi trực tiếp
          </p>
        </div>

        <div className="note-card p-4">
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {tabs.map((item) => (
              <button
                key={item.k}
                onClick={() => setTab(item.k)}
                className={`flex-none rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  item.k === activeTab?.k ? 'bg-pink text-white' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                }`}
              >
                {item.l}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 mt-3 mb-2">
            <div className="text-sm font-semibold text-ink">{activeTab?.l}</div>
            <div className="text-[11px] font-mono text-ink/40">
              {cfg?.ids?.length || 0} lựa chọn
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {cfg?.nullable && (
              <ItemThumb cfg={cfg} id={null} selected={!state[activeTab.k]} onClick={() => pick(null)} />
            )}
            {(cfg?.ids || []).map((id) => (
              <ItemThumb
                key={String(id)}
                cfg={cfg}
                id={id}
                selected={state[activeTab.k] === id}
                onClick={() => pick(id)}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-ink/50">
            <Check className="w-3.5 h-3.5 text-teal" />
            {activeTab ? kidItemLabel(activeTab.k, state[activeTab.k]) : ''}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 items-start">
        <div className="note-card p-4">
          <h3 className="font-display text-sm text-ink mb-3">Thứ tự lớp trên body</h3>
          <div className="space-y-1.5">
            {KID_LAYERS.map((layer, index) => (
              <div key={layer.key} className="flex items-start gap-2 text-xs">
                <span className="w-5 text-right font-mono text-ink/30">{index + 1}</span>
                <div>
                  <span className="font-semibold text-ink/75">{layer.name}</span>
                  <span className="text-ink/40"> — {layer.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="note-card p-4">
          <h3 className="font-display text-sm text-ink mb-3">Vị trí mặt trên body</h3>
          <div className="space-y-2 text-xs text-ink/60 leading-relaxed">
            <p><strong>Mắt:</strong> <code className="font-mono">x=224 / 288, y=210</code></p>
            <p><strong>Lông mày:</strong> <code className="font-mono">y≈186</code></p>
            <p><strong>Má:</strong> <code className="font-mono">x=205 / 307, y=244</code></p>
            <p><strong>Mũi:</strong> <code className="font-mono">x=256, y=218–241</code></p>
            <p><strong>Miệng:</strong> <code className="font-mono">y≈258–280</code></p>
            <p className="text-ink/40 pt-1">
              Các toạ độ này dùng chung viewBox <code className="font-mono">512 × 700</code> với body và phụ kiện.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <GhostButton onClick={() => window.location.hash = '#/admin/body-custom'}>
          Xem Thân Avatar
        </GhostButton>
        <PrimaryButton onClick={copyDataPath}>
          Copy đường dẫn dữ liệu
        </PrimaryButton>
      </div>

      <div className="text-[11px] text-ink/40">
        Có {Object.keys(kidBodies()).length} body trong hệ DressUp. Thay đổi item/giá trị tại file dữ liệu rồi build lại.
      </div>
    </div>
  );
}
