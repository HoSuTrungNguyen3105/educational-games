import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../services/api.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import { ConfirmModal, ErrorState, Field, GhostButton, IconClose, Loader, ManagementHeader, ManagementTable, Modal, PrimaryButton, StatGrid } from '../../components/ui';
import PetRenderer, { OutfitPreview } from '../../components/pet/PetRenderer.jsx';
import { getOutfitAsset } from '../../data/petAssets.js';
import { AlertTriangle, Gift, Info, Palette, PawPrint, RotateCcw, Save, Shirt } from 'lucide-react';

/**
 * Quản lý DANH MỤC PET (loài / màu / trang phục).
 *
 * Dữ liệu nằm trong collection `petCatalog` trên server — sửa ở đây có hiệu
 * lực ngay với mọi người chơi, không cần build lại frontend.
 *
 * Hình vẽ (SVG) KHÔNG nằm ở đây: frontend giữ art trong `src/data/petAssets.js`
 * và tra bằng `id`. Thêm món có hình mới vẫn phải vẽ SVG + đăng ký registry.
 * Trang này cảnh báo khi admin tạo id chưa có hình để tránh tạo món vô hình.
 */

/**
 * `kind` là giá trị gửi lên server và lưu trong DB (`/pet/admin/<kind>`).
 * `key` là tên trường server TRẢ VỆ — số nhiều, khác `kind`. Tra nhầm hai thứ
 * này làm bảng rỗng im lặng.
 */
const TABS = [
  { kind: 'species', key: 'species', label: 'Loài', icon: <PawPrint className="w-4 h-4" /> },
  { kind: 'color', key: 'colors', label: 'Màu thân', icon: <Palette className="w-4 h-4" /> },
  { kind: 'outfit', key: 'outfits', label: 'Trang phục', icon: <Shirt className="w-4 h-4" /> },
];

/** `kind` (số ít, gửi lên server) → key trong response (số nhiều). */
const LIST_KEY = { species: 'species', color: 'colors', outfit: 'outfits' };

const EMPTY_SPECIES = {
  id: '', name: '', emoji: '🐾', shape: '', art: '', desc: '', trait: '',
  likes: '', minLevel: 1, defaultColor: '',
};
const EMPTY_COLOR = { id: '', name: '', body: '#F4AF66', accent: '#FFF7EE', minLevel: 1 };
const EMPTY_OUTFIT = { id: '', name: '', slot: 'hat', colors: '#FACC15', minLevel: 1 };

const emptyFor = (kind) =>
  kind === 'species' ? { ...EMPTY_SPECIES } : kind === 'color' ? { ...EMPTY_COLOR } : { ...EMPTY_OUTFIT };

const inputCls = "w-full note-card px-3 py-2 mt-0.5 border-ink/10 focus:border-ticket text-sm";

/** Màu ô xem trước: chọn màu đầu tiên của món, hoặc màu thân cho bảng màu. */
function firstColor(entry) {
  if (Array.isArray(entry.colors) && entry.colors.length) return entry.colors[0];
  if (typeof entry.colors === 'string') return entry.colors.split(/[,\s]+/)[0] || '#FACC15';
  return entry.body || '#F4AF66';
}

/**
 * Cảnh báo: id có trong catalog server nhưng chưa có SVG trong registry
 * frontend → người chơi chọn món đó sẽ không thấy gì.
 */
function MissingArtNote({ kind, id }) {
  if (kind !== 'outfit') return null;
  if (!id || getOutfitAsset(id)) return null;
  return (
    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 flex items-start gap-1.5">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>Chưa có hình vẽ cho id <code className="font-mono">{id}</code>. Thêm mục vào
      <code className="font-mono"> src/data/petAssets.js </code>rồi vẽ SVG trong
      <code className="font-mono"> src/assets/pets/outfits/</code>, nếu không người chơi sẽ không thấy món này.</span>
    </p>
  );
}

export default function PetCatalogManagement({ showToast }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('species');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyFor('species'));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    setData(null);
    setError(null);
    try {
      const res = await apiFetch('/pet/admin/catalog');
      setData(res);
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => {
    if (!data) return [];
    return data[LIST_KEY[tab]] || [];
  }, [data, tab]);

  const usageOf = (entry) => data?.usage?.[`${tab}:${entry.id}`] ?? 0;
  const setF = (key, val) => { setForm(f => ({ ...f, [key]: val })); setFormError(null); };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyFor(tab));
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      ...emptyFor(tab),
      ...entry,
      // Ô nhập dùng chuỗi, DB lưu mảng.
      colors: Array.isArray(entry.colors) ? entry.colors.join(', ') : (entry.colors || ''),
      likes: Array.isArray(entry.likes) ? entry.likes.join(', ') : (entry.likes || ''),
      defaultColor: entry.defaultColor || '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setFormError(null); };

  const handleSave = async () => {
    if (!form.id?.trim() || !form.name?.trim()) {
      setFormError('Thiếu id hoặc tên');
      return;
    }
    setSaving(true);
    setFormError(null);

    // Chuyển đúng kiểu dữ liệu trước khi gửi — server nhận `colors`/`likes`
    // dạng mảng, không tự tách chuỗi cho dễ kiểm tra.
    const body = { ...form, minLevel: Number(form.minLevel) || 1 };
    if (tab === 'species') {
      body.likes = String(form.likes || '').split(',').map(s => s.trim()).filter(Boolean);
      body.defaultColor = form.defaultColor || null;
    }
    if (tab === 'outfit') body.colors = String(form.colors || '').split(/[,\s]+/).map(s => s.trim()).filter(Boolean);

    try {
      if (editingId) {
        delete body.id;   // id là khoá, không cho đổi
        await apiFetch(`/pet/admin/${tab}/${editingId}`, { method: 'PUT', body });
        showToast(`Đã cập nhật "${form.name}"`, 'success');
      } else {
        await apiFetch(`/pet/admin/${tab}`, { method: 'POST', body });
        showToast(`Đã thêm "${form.name}"`, 'success');
      }
      closeModal();
      load();
    } catch (e) { setFormError(e.message || 'Lỗi lưu'); }
    finally { setSaving(false); }
  };

  const handleDelete = (entry) => {
    const used = usageOf(entry);
    askConfirm({
      title: `Xóa "${entry.name}"?`,
      message: used > 0
        ? `Có ${used} thú cưng đang dùng mục này. Xóa sẽ tự đặt chúng về giá trị mặc định.`
        : 'Mục này chưa có thú cưng nào dùng.',
      confirmLabel: 'Xóa',
      onConfirm: async () => {
        try {
          const res = await apiFetch(`/pet/admin/${tab}/${entry.id}`, { method: 'DELETE' });
          showToast(res.affectedPets > 0 ? `Đã xóa, cập nhật ${res.affectedPets} pet` : 'Đã xóa', 'success');
          load();
        } catch (e) { showToast(e.message || 'Lỗi xóa', 'error'); }
      },
    });
  };

  const handleReset = () => {
    askConfirm({
      title: 'Khôi phục danh mục mặc định?',
      message: 'Toàn bộ loài / màu / trang phục sẽ bị xóa và nạp lại từ danh mục mặc định trên server. Mọi chỉnh sửa sẽ mất.',
      confirmLabel: 'Khôi phục',
      onConfirm: async () => {
        try {
          await apiFetch('/pet/admin/reset-catalog', { method: 'POST', body: {} });
          showToast('Đã khôi phục danh mục pet', 'success');
          load();
        } catch (e) { showToast(e.message || 'Lỗi khôi phục', 'error'); }
      },
    });
  };

  const stats = data ? [
    { icon: <PawPrint />, value: data.species.length, label: 'Loài' },
    { icon: <Palette />, value: data.colors.length, label: 'Màu thân' },
    { icon: <Shirt />, value: data.outfits.length, label: 'Trang phục' },
    { icon: <Gift />, value: rows.filter(r => (r.minLevel || 1) === 1).length, label: 'Mở khoá cấp 1' },
  ] : [];

  const headers = ['Xem trước', 'Tên', 'ID', ...(tab === 'outfit' ? ['Ô'] : []), 'Mở khoá', 'Đang dùng', ''];

  const renderRow = (entry) => {
    const used = usageOf(entry);
    const noArt = tab === 'outfit' && !getOutfitAsset(entry.id);
    return (
      <tr key={entry.id} className="border-b border-ink/5 last:border-0 align-middle">
        <td className="px-4 py-2">
          {tab === 'outfit' ? (
            // Chỉ món đồ, KHÔNG vẽ con pet — mặt pet giữa lúc chỉnh sửa gây rối
            // và lớp SVG của nó có thể lấn lên hộp thoại đang mở.
            <OutfitPreview id={entry.id} color={firstColor(entry)} size={44} />
          ) : tab === 'color' ? (
            <span className="block w-9 h-9 rounded-lg border border-ink/10" style={{ background: entry.body }} />
          ) : (
            <span className="text-2xl">{entry.emoji || '🐾'}</span>
          )}
        </td>
        <td className="px-4 py-2">
          <span className="font-semibold text-sm text-ink">{entry.name}</span>
          {noArt && <span className="ml-2 text-[10px] font-bold text-amber-700">chưa có hình</span>}
          {tab === 'species' && entry.trait && (
            <div className="text-[11px] text-ink/45 mt-0.5">{entry.trait}</div>
          )}
        </td>
        <td className="px-4 py-2 font-mono text-[11px] text-ink/50">{entry.id}</td>
        {tab === 'outfit' && (
          <td className="px-4 py-2 text-xs text-ink/60">{data.slotLabels?.[entry.slot] || entry.slot}</td>
        )}
        <td className="px-4 py-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${(entry.minLevel || 1) === 1 ? 'bg-teal/15 text-teal' : 'bg-gold/20 text-[#8a6a10]'}`}>
            Cấp {entry.minLevel || 1}
          </span>
        </td>
        <td className="px-4 py-2">
          <span className={`text-xs font-mono ${used > 0 ? 'text-ink/70' : 'text-ink/25'}`}>{used}</span>
        </td>
        <td className="px-4 py-2">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => openEdit(entry)} className="text-xs font-semibold text-ticket hover:underline">Sửa</button>
            <button onClick={() => handleDelete(entry)} className="text-xs font-semibold text-red-400 hover:underline">Xóa</button>
          </div>
        </td>
      </tr>
    );
  };

  const slotOptions = Object.entries(data?.slotLabels || {});

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Thú cưng" title="Danh mục Pet" />

      <StatGrid stats={stats} />

      <div className="note-card p-3 text-xs text-ink/60 flex items-start gap-2">
        <span className="text-base leading-none"><Info className="w-3.5 h-3.5 text-ink/40" /></span>
        <span>
          Danh mục lưu trong collection <code className="font-mono text-[11px]">petCatalog</code> trên server.
          Thêm / sửa / xoá ở đây áp dụng cho <strong>toàn bộ</strong> người chơi ngay lập tức.
          Hình vẽ SVG vẫn nằm ở frontend (<code className="font-mono text-[11px]">src/data/petAssets.js</code>) — mục không có hình sẽ bị đánh dấu.
        </span>
      </div>

      {error && !data && <ErrorState subtitle={error} onRetry={load} />}
      {!error && !data && <Loader label="Đang tải danh mục pet..." />}

      {data && (
        <>
          <div className="flex gap-2">
            {TABS.map(t => (
              <button key={t.kind} onClick={() => setTab(t.kind)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition
                  ${tab === t.kind ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'}`}>
                {t.icon}
                {t.label}
                <span className="text-[10px] font-mono opacity-70">({data[t.key]?.length ?? 0})</span>
              </button>
            ))}
            <button onClick={handleReset} title="Xóa toàn bộ và nạp lại danh mục mặc định"
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-ink/40 hover:text-ticket">
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục mặc định
            </button>
          </div>

          <ManagementTable
            title={`Danh sách ${TABS.find(t => t.kind === tab).label.toLowerCase()}`}
            count={rows.length}
            data={rows}
            emptyLabel="Chưa có mục nào."
            onCreate={openCreate}
            createLabel={`+ Thêm ${TABS.find(t => t.kind === tab).label.toLowerCase()}`}
            headers={headers}
            renderRow={renderRow}
            renderCard={(entry) => {
              const used = usageOf(entry);
              const noArt = tab === 'outfit' && !getOutfitAsset(entry.id);
              return (
                <div className="flex items-center gap-3">
                  {tab === 'outfit' ? (
                    <OutfitPreview id={entry.id} color={firstColor(entry)} size={40} />
                  ) : tab === 'color' ? (
                    <span className="block w-9 h-9 rounded-lg border border-ink/10 shrink-0" style={{ background: entry.body }} />
                  ) : (
                    <span className="text-2xl shrink-0">{entry.emoji || '🐾'}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-ink truncate">{entry.name}</span>
                      {noArt && <span className="text-[10px] font-bold text-amber-700 shrink-0">chưa có hình</span>}
                    </div>
                    <p className="font-mono text-[11px] text-ink/50 truncate">
                      {entry.id}
                      {tab === 'outfit' ? ` · ${data.slotLabels?.[entry.slot] || entry.slot}` : ''}
                      {tab === 'species' && entry.trait ? ` · ${entry.trait}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(entry.minLevel || 1) === 1 ? 'bg-teal/15 text-teal' : 'bg-gold/20 text-[#8a6a10]'}`}>
                      Cấp {entry.minLevel || 1}
                    </span>
                    <p className={`text-[11px] font-mono mt-0.5 ${used > 0 ? 'text-ink/70' : 'text-ink/25'}`}>{used} dùng</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(entry)} className="text-xs font-semibold text-ticket hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(entry)} className="text-xs font-semibold text-red-400 hover:underline">Xóa</button>
                  </div>
                </div>
              );
            }}
          />
        </>
      )}

      {modalOpen && (
        <Modal onClose={closeModal} wide>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg text-ink">
              {editingId ? 'Sửa' : 'Thêm'} {TABS.find(t => t.kind === tab).label.toLowerCase()}
            </h3>
            <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-ink/5"><IconClose className="w-5 h-5 text-ink/50" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
            <Field label="ID *" hint={editingId ? 'ID không thể đổi sau khi phát hành' : 'chữ thường / số / gạch dưới'}>
              <input value={form.id} onChange={e => setF('id', e.target.value)} disabled={!!editingId}
                className={`${inputCls} font-mono`} placeholder="hat_wizard_01" />
            </Field>
            <Field label="Tên hiển thị *">
              <input value={form.name} onChange={e => setF('name', e.target.value)} className={inputCls} placeholder="Mũ phù thủy" />
            </Field>

            {tab === 'species' && (
              <>
                <Field label="Emoji">
                  <input value={form.emoji} onChange={e => setF('emoji', e.target.value)} className={`${inputCls} text-lg`} placeholder="🐶" />
                </Field>
                <Field label="Mã hình vẽ" hint="Khớp loại trong src/data/petAssets.js (dog, cat, …)">
                  <input value={form.shape || ''} onChange={e => setF('shape', e.target.value)} className={`${inputCls} font-mono`} placeholder="dog" />
                </Field>
                <Field label="Có hình SVG?" hint="Bỏ trống = chỉ hiện emoji">
                  <select value={form.art || ''} onChange={e => setF('art', e.target.value)} className={`${inputCls} bg-paper2`}>
                    <option value="">Không (chỉ emoji)</option>
                    <option value="svg">Có (vẽ bằng SVG)</option>
                  </select>
                </Field>
                <Field label="Màu mặc định" hint={data?.colors?.map(c => c.id).join(', ')}>
                  <select value={form.defaultColor || ''} onChange={e => setF('defaultColor', e.target.value)} className={`${inputCls} bg-paper2`}>
                    <option value="">— Mặc định —</option>
                    {(data?.colors || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Đặc điểm" className="sm:col-span-2">
                  <input value={form.trait || ''} onChange={e => setF('trait', e.target.value)} className={inputCls} placeholder="Nhanh nhẹn · Trung thành" />
                </Field>
                <Field label="Mô tả" className="sm:col-span-2">
                  <textarea value={form.desc || ''} onChange={e => setF('desc', e.target.value)} rows={2} className={`${inputCls} min-h-[60px]`} />
                </Field>
                <Field label="Sở thích" hint="ngăn cách bằng dấu phẩy" className="sm:col-span-2">
                  <input value={form.likes || ''} onChange={e => setF('likes', e.target.value)} className={inputCls} placeholder="bone, ball, walk" />
                </Field>
              </>
            )}

            {tab === 'color' && (
              <>
                <Field label="Màu thân">
                  <div className="flex gap-2 mt-0.5">
                    <input type="color" value={form.body} onChange={e => setF('body', e.target.value)} className="w-10 h-10 rounded-xl border border-ink/10 cursor-pointer shrink-0" />
                    <input value={form.body} onChange={e => setF('body', e.target.value)} className={`${inputCls} font-mono`} />
                  </div>
                </Field>
                <Field label="Màu nhấn">
                  <div className="flex gap-2 mt-0.5">
                    <input type="color" value={form.accent} onChange={e => setF('accent', e.target.value)} className="w-10 h-10 rounded-xl border border-ink/10 cursor-pointer shrink-0" />
                    <input value={form.accent} onChange={e => setF('accent', e.target.value)} className={`${inputCls} font-mono`} />
                  </div>
                </Field>
              </>
            )}

            {tab === 'outfit' && (
              <>
                <Field label="Ô trang phục *" hint="Ô này phải khớp OUTFIT_SLOTS ở frontend, nếu không sẽ không hiện">
                  <select value={form.slot} onChange={e => setF('slot', e.target.value)} className={`${inputCls} bg-paper2`}>
                    {slotOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                  </select>
                </Field>
                <Field label="Cấp mở khoá">
                  <input type="number" min={1} value={form.minLevel} onChange={e => setF('minLevel', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Bảng màu *" hint="ngăn cách bằng dấu phẩy — phải khớp token trong SVG" className="sm:col-span-2">
                  <input value={form.colors} onChange={e => setF('colors', e.target.value)} className={`${inputCls} font-mono`} placeholder="#FACC15, #FFD75E" />
                </Field>
              </>
            )}

            {tab !== 'outfit' && (
              <Field label="Cấp mở khoá">
                <input type="number" min={1} value={form.minLevel} onChange={e => setF('minLevel', e.target.value)} className={inputCls} />
              </Field>
            )}
          </div>

          {tab === 'outfit' && <div className="mt-3"><MissingArtNote kind={tab} id={form.id} /></div>}

          <div className="mt-4 flex justify-center py-3 rounded-xl bg-ink/[0.03]">
            {tab === 'outfit' ? (
              <PetRenderer
                species="dog" color="cream" size={96}
                outfits={{ [form.slot]: { id: editingId || form.id, color: firstColor({ colors: form.colors }) } }}
                showEmojiFallback={false}
              />
            ) : tab === 'color' ? (
              <PetRenderer species="dog" color={editingId || form.id} size={96} />
            ) : (
              <span className="text-6xl">{form.emoji || '🐾'}</span>
            )}
          </div>

          {formError && <p className="text-ticket text-sm mt-2">{formError}</p>}

          <div className="mt-4 flex items-center gap-2 justify-end">
            <GhostButton onClick={closeModal}>Hủy</GhostButton>
            <PrimaryButton onClick={handleSave} disabled={saving}>
              <span className="flex items-center gap-1.5"><Save className="w-4 h-4" />{saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm mới'}</span>
            </PrimaryButton>
          </div>
        </Modal>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
