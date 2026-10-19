import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../services/api.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import {
  ManagementHeader, ManagementTable, Modal, ConfirmModal,
  PrimaryButton, GhostButton, Field, Loader, ErrorState, StatGrid,
} from '../../components/ui';
import { Plus, Search, Save, X, ListChecks, Check, RotateCcw } from 'lucide-react';
import { composeAvatar, partsOf } from '../../lib/avatarRenderer.js';
import { AVATAR_BODIES, DEFAULT_BODY_CODE } from '../../data/avatarBodies.js';

/**
 * Quản lý PHỤ KIỆN avatar.
 *
 * Thân avatar không có ở đây: nó nằm trong mã frontend (src/data/avatarBodies.js)
 * vì là phần nền tĩnh. Trang này chỉ sửa `avatarItems` trên server.
 *
 * Markup SVG do SERVER sinh (`renderItemHtml`). Trang admin gọi
 * POST /avatar/admin/preview để xem trước khi lưu, nhờ vậy không cần chép bộ
 * sinh markup sang frontend — trước đây chính vì thế mà có 2 bản renderer lệch nhau.
 */

const CATEGORIES = [
  { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const STYLE_OPTIONS = {
  skin: [],
  face: ['gentle', 'happy', 'wink', 'laughing', 'fierce'],
  hair: ['spiky', 'messy', 'side', 'wild', 'long', 'twin', 'wavy', 'braid'],
  shirt: ['tee', 'hoodie', 'jacket', 'polo', 'sweater', 'cardigan', 'sailor'],
  pants: ['shorts', 'jeans', 'cargo', 'joggers', 'skirt'],
  shoes: ['sneaker', 'boots'],
  hat: ['none', 'cap', 'beanie', 'bucket', 'tophat', 'sunhat'],
  glasses: ['none', 'round', 'sun', 'heart', 'cat', 'star'],
  accessory: ['none', 'headphones', 'scarf', 'mask', 'backpack', 'ears', 'wings'],
};

const GENDER_CATEGORIES = ['hair', 'shirt', 'pants', 'shoes'];

const EMPTY_FORM = { category: "hair", name: "", price: 0, default: false, gender: "boy", params: { style: "spiky", color: "#6B4226" } };

const inputCls = "w-full note-card px-3 py-2 mt-0.5 border-ink/10 focus:border-ticket text-sm";

/**
 * Ô xem trước nhỏ: dựng avatar từ các item mặc định, thay `category` bằng
 * `html` đang sửa. `skin` không có markup nên chỉ đổi màu thân.
 */
function ItemPreview({ items, form, parts }) {
  const svg = useMemo(() => {
    const layers = {};
    let skin = '#FFDFC4';
    const bodyCode = DEFAULT_BODY_CODE;

    for (const it of items || []) {
      if (it.category === 'skin') { if (form.category === 'skin') skin = it.params?.hex || skin; continue; }
      if (form.category === it.category) continue;
      if (!it.default) continue;
      if (it.gender && it.gender !== form.gender) continue;
      layers[it.category] = it;
    }

    if (form.category === 'skin') {
      skin = form.params?.hex || skin;
    } else if (parts) {
      // Món đang sửa chưa lưu → chỉ có 2 mảnh markup server vừa trả về.
      layers[form.category] = parts;
    }

    return composeAvatar({ bodyCode, skin, layers });
  }, [items, form, parts]);

  return (
    <div className="w-14 h-[76px] shrink-0 overflow-hidden rounded-lg bg-ink/[0.04]">
      <svg viewBox="0 0 512 700" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}

export default function AvatarItemManagement({ showToast }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [gender, setGender] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewBack, setPreviewBack] = useState('');
  const [previewFront, setPreviewFront] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [batchMode, setBatchMode] = useState(false);
  const [batchData, setBatchData] = useState({});
  const [batchSaving, setBatchSaving] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();

  const load = useCallback(async () => {
    setItems(null);
    setError(null);
    try {
      const qs = query ? `?query=${encodeURIComponent(query)}` : '';
      const data = await apiFetch(`/avatar/items${qs}`);
      setItems(data.items || []);
    } catch (e) { setError(e.message); }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  /** Gọi server sinh markup từ `params` — không lưu, chỉ xem trước. */
  const refreshPreview = useCallback(async (category, params) => {
    try {
      const data = await apiFetch('/avatar/admin/preview', { method: 'POST', body: { category, params } });
      setPreviewHtml(data.html || '');
      setPreviewBack(data.back || '');
      setPreviewFront(data.front || '');
    } catch {
      setPreviewHtml(''); setPreviewBack(''); setPreviewFront('');
    }
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setFormError(null);
    setModalOpen(true);
    refreshPreview(EMPTY_FORM.category, EMPTY_FORM.params);
  };

  const openEdit = (item) => {
    setForm({
      category: item.category,
      name: item.name,
      price: item.price,
      default: !!item.default,
      gender: item.gender || 'boy',
      params: { ...(item.params || {}) },
    });
    setEditingId(item.code);
    setFormError(null);
    setModalOpen(true);
    setPreviewHtml(item.html || '');
    const parts = partsOf(item);
    setPreviewBack(parts.back); setPreviewFront(parts.front);
  };

  const closeModal = () => { setModalOpen(false); setFormError(null); };

  const setF = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'category') {
        next.params = val === 'skin'
          ? { hex: '#FFDFC4' }
          : { style: STYLE_OPTIONS[val]?.[0] || 'none', color: '#000000' };
      }
      return next;
    });
    setFormError(null);
  };

  const setParam = (key, val) => {
    const params = { ...form.params, [key]: val };
    setForm(f => ({ ...f, params }));
    setFormError(null);
    refreshPreview(form.category, params);
  };

  const submit = async () => {
    if (!form.name.trim()) { setFormError('Vui lòng nhập tên item'); return; }
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        category: form.category,
        name: form.name.trim(),
        price: Number(form.price) || 0,
        default: !!form.default,
        params: form.params,
        ...(GENDER_CATEGORIES.includes(form.category) && form.gender ? { gender: form.gender } : {}),
      };
      if (editingId) {
        await apiFetch(`/avatar/admin/items/${editingId}`, { method: 'PUT', body });
        showToast('Đã cập nhật item', 'success');
      } else {
        await apiFetch('/avatar/admin/items', { method: 'POST', body });
        showToast('Đã tạo item mới', 'success');
      }
      closeModal();
      load();
    } catch (e) { setFormError(e.message || 'Lỗi lưu item'); }
    finally { setSaving(false); }
  };

  const handleDelete = (item) => {
    askConfirm({
      title: 'Xóa item?',
      message: `Xóa "${item.name}" (${item.code})? Item sẽ bị gỡ khỏi túi đồ và bộ đồ của người chơi đang mặc.`,
      confirmLabel: 'Xóa',
      onConfirm: async () => {
        try {
          await apiFetch(`/avatar/admin/items/${item.code}`, { method: 'DELETE' });
          showToast('Đã xóa item', 'success');
          load();
        } catch (e) { showToast(e.message || 'Lỗi xóa', 'error'); }
      },
    });
  };

  const handleReset = () => {
    askConfirm({
      title: 'Khôi phục danh mục mặc định?',
      message: 'Toàn bộ item sẽ bị xóa và seed lại từ danh mục mặc định của server. Mọi chỉnh sửa giá/tên sẽ mất.',
      confirmLabel: 'Khôi phục',
      onConfirm: async () => {
        try {
          await apiFetch('/avatar/admin/reset-items', { method: 'POST', body: {} });
          showToast('Đã khôi phục danh mục', 'success');
          load();
        } catch (e) { showToast(e.message || 'Lỗi khôi phục', 'error'); }
      },
    });
  };

  const toggleBatchMode = () => {
    if (!batchMode) {
      const init = {};
      (items || []).forEach(it => { init[it.code] = { name: it.name, price: it.price, default: it.default }; });
      setBatchData(init);
    }
    setBatchMode(m => !m);
  };

  const submitBatch = async () => {
    const changed = (items || []).filter(it => {
      const b = batchData[it.code];
      if (!b) return false;
      return b.name !== it.name || Number(b.price) !== it.price || b.default !== it.default;
    });
    if (changed.length === 0) { showToast('Không có thay đổi nào'); return; }

    setBatchSaving(true);
    let failed = 0;
    for (const it of changed) {
      const b = batchData[it.code];
      try {
        await apiFetch(`/avatar/admin/items/${it.code}`, {
          method: 'PUT',
          body: {
            name: b.name,
            price: Number(b.price) || 0,
            default: !!b.default,
            // Không gửi `html` → server sinh lại từ `params` hiện có.
            params: it.params,
            ...(it.gender ? { gender: it.gender } : {}),
          },
        });
      } catch { failed++; }
    }
    setBatchSaving(false);
    setBatchMode(false);
    setBatchData({});
    if (failed > 0) showToast(`Đã lưu ${changed.length - failed}/${changed.length} item`, 'error');
    else showToast(`Đã cập nhật ${changed.length} item`, 'success');
    load();
  };

  const filtered = (items || []).filter(it =>
    (filter === 'all' || it.category === filter) &&
    (gender === 'all' || !it.gender || it.gender === gender));

  const stats = [
    { icon: '👕', value: (items || []).length, label: 'Tổng items' },
    { icon: '🎁', value: (items || []).filter(i => i.default).length, label: 'Mặc định' },
    { icon: '💰', value: (items || []).filter(i => i.price > 0).length, label: 'Có giá' },
    { icon: '🧍', value: AVATAR_BODIES.length, label: 'Body (mã FE)' },
  ];

  const headers = ['Xem trước', 'Tên', 'Mã', 'Category', 'Giá', 'Giới tính', 'Mặc định', ''];

  const renderRow = (item) => (
    <tr key={item.code} className="border-b border-ink/5 last:border-0 align-middle">
      <td className="px-4 py-2">
        <ItemPreview items={items} form={{ category: item.category, gender: item.gender || 'boy' }} />
      </td>
      <td className="px-4 py-2">
        {batchMode ? (
          <input
            value={batchData[item.code]?.name ?? item.name}
            onChange={e => setBatchData(p => ({ ...p, [item.code]: { ...p[item.code], name: e.target.value } }))}
            className={inputCls}
          />
        ) : (
          <span className="font-semibold text-sm text-ink">{item.name}</span>
        )}
      </td>
      <td className="px-4 py-2 font-mono text-[11px] text-ink/50">{item.code}</td>
      <td className="px-4 py-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-ink/5 text-ink/60">
          {CATEGORIES.find(c => c.id === item.category)?.label || item.category}
        </span>
      </td>
      <td className="px-4 py-2">
        {batchMode ? (
          <input
            type="number"
            value={batchData[item.code]?.price ?? item.price}
            onChange={e => setBatchData(p => ({ ...p, [item.code]: { ...p[item.code], price: e.target.value } }))}
            className={`${inputCls} w-24`}
          />
        ) : (
          <span className={`font-mono text-sm ${item.price > 0 ? 'text-gold font-bold' : 'text-ink/40'}`}>
            {item.price > 0 ? `${item.price} coin` : 'Miễn phí'}
          </span>
        )}
      </td>
      <td className="px-4 py-2 text-xs text-ink/60">{item.gender === 'girl' ? 'Bé gái' : item.gender === 'boy' ? 'Bé trai' : '—'}</td>
      <td className="px-4 py-2 text-center">
        {batchMode ? (
          <input
            type="checkbox"
            checked={batchData[item.code]?.default ?? item.default}
            onChange={e => setBatchData(p => ({ ...p, [item.code]: { ...p[item.code], default: e.target.checked } }))}
            className="w-4 h-4 rounded border-ink/20 text-pink focus:ring-pink/30"
          />
        ) : item.default ? (
          <Check className="w-4 h-4 text-teal mx-auto" />
        ) : (
          <span className="text-ink/20">—</span>
        )}
      </td>
      <td className="px-4 py-2">
        {!batchMode && (
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => openEdit(item)} className="text-xs font-semibold text-ticket hover:underline">Sửa</button>
            {!item.default && (
              <button onClick={() => handleDelete(item)} className="text-xs font-semibold text-red-400 hover:underline">Xóa</button>
            )}
          </div>
        )}
      </td>
    </tr>
  );

  const styleOptions = STYLE_OPTIONS[form.category] || [];
  const showGender = GENDER_CATEGORIES.includes(form.category);

  return (
    <div className="space-y-4">
      <ManagementHeader subtitle="Phụ kiện lưu trên server" title="👕 Avatar Items" />

      <StatGrid stats={stats} />

      <div className="note-card p-3 text-xs text-ink/60 flex items-start gap-2">
        <span className="text-base leading-none">ℹ️</span>
        <span>
          Trang này quản lý <strong>phụ kiện</strong> (da, mặt, tóc, áo, quần, giày, mũ, kính, phụ kiện) — sửa ở đây có hiệu lực ngay, không cần deploy.
          <strong> Thân avatar</strong> nằm trong mã frontend (<code className="font-mono text-[11px]">src/data/avatarBodies.js</code>), hiện có {AVATAR_BODIES.length} body.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm tên, mã, category..."
            className="w-full pl-9 pr-3 py-2 note-card border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-pink/30"
          />
        </div>
        <select value={gender} onChange={e => setGender(e.target.value)} className={`${inputCls} bg-paper2 sm:w-40`}>
          <option value="all">Tất cả giới tính</option>
          <option value="boy">Bé trai</option>
          <option value="girl">Bé gái</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === 'all' ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'}`}>
          Tất cả ({items?.length || 0})
        </button>
        {CATEGORIES.map(c => {
          const count = items?.filter(i => i.category === c.id).length || 0;
          return (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === c.id ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'}`}>
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={toggleBatchMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${batchMode ? 'bg-pink text-white' : 'bg-ink/5 text-ink/50 hover:bg-ink/10'}`}>
          <ListChecks className="w-3.5 h-3.5" />
          {batchMode ? 'Đang sửa hàng loạt' : 'Sửa tên / giá / mặc định'}
        </button>
        <div className="flex items-center gap-3">
          {batchMode && (
            <>
              <button onClick={() => { setBatchMode(false); setBatchData({}); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-ink/5 text-ink/50 hover:bg-ink/10">Hủy</button>
              <button onClick={submitBatch} disabled={batchSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink text-white hover:bg-pink/80 disabled:opacity-50">
                <Check className="w-3.5 h-3.5" />
                {batchSaving ? 'Đang lưu...' : 'Lưu tất cả'}
              </button>
            </>
          )}
          <button onClick={handleReset} title="Xóa toàn bộ và seed lại danh mục mặc định"
            className="flex items-center gap-1.5 text-xs font-semibold text-ink/40 hover:text-ticket">
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi phục mặc định
          </button>
        </div>
      </div>

      {error && !items && <ErrorState subtitle={error} onRetry={load} />}
      {!error && !items && <Loader label="Đang tải items..." />}

      {items && (
        <ManagementTable
          title="Danh sách phụ kiện"
          count={filtered.length}
          data={filtered}
          emptyLabel="Không có item nào khớp bộ lọc."
          onCreate={openCreate}
          createLabel="+ Thêm phụ kiện"
          headers={headers}
          renderRow={renderRow}
        />
      )}

      {modalOpen && (
        <Modal onClose={closeModal} wide>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg text-ink">{editingId ? '✏️ Sửa phụ kiện' : '➕ Thêm phụ kiện'}</h3>
            <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-ink/5"><X className="w-5 h-5 text-ink/50" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
            <Field label="Category *">
              <select value={form.category} onChange={e => setF('category', e.target.value)} className={`${inputCls} bg-paper2`}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Tên hiển thị *">
              <input value={form.name} onChange={e => setF('name', e.target.value)} className={inputCls} placeholder="VD: Tóc xoăn" />
            </Field>
            <Field label="Giá (coin)" hint="0 = ai cũng mặc được">
              <input type="number" min={0} value={form.price} onChange={e => setF('price', e.target.value)} className={inputCls} />
            </Field>
            {showGender && (
              <Field label="Giới tính" hint="Giới tính của người mặc">
                <select value={form.gender} onChange={e => setF('gender', e.target.value)} className={`${inputCls} bg-paper2`}>
                  <option value="boy">Bé trai</option>
                  <option value="girl">Bé gái</option>
                </select>
              </Field>
            )}
            {form.category === 'skin' ? (
              <Field label="Màu da (hex)">
                <div className="flex gap-2 mt-0.5">
                  <input value={form.params?.hex || '#FFDFC4'} onChange={e => setParam('hex', e.target.value)} className={`${inputCls} font-mono`} />
                  <input type="color" value={form.params?.hex || '#FFDFC4'} onChange={e => setParam('hex', e.target.value)} className="w-10 h-10 rounded-xl border border-ink/10 cursor-pointer shrink-0" />
                </div>
              </Field>
            ) : (
              <>
                {styleOptions.length > 0 && (
                  <Field label="Kiểu dáng">
                    <select value={form.params?.style || ''} onChange={e => setParam('style', e.target.value)} className={`${inputCls} bg-paper2`}>
                      {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                )}
                {form.params?.style !== 'none' && (
                  <Field label="Màu">
                    <div className="flex gap-2 mt-0.5">
                      <input value={form.params?.color || '#000000'} onChange={e => setParam('color', e.target.value)} className={`${inputCls} font-mono`} />
                      <input type="color" value={form.params?.color || '#000000'} onChange={e => setParam('color', e.target.value)} className="w-10 h-10 rounded-xl border border-ink/10 cursor-pointer shrink-0" />
                    </div>
                  </Field>
                )}
              </>
            )}
          </div>

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" checked={form.default} onChange={e => setF('default', e.target.checked)} className="w-4 h-4 rounded border-ink/20 text-pink focus:ring-pink/30" />
            <span className="text-sm font-body text-ink">Mặc định (miễn phí, mới tạo tài khoản sẽ mặc)</span>
          </label>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-ink/40 mb-2">Xem trước</div>
              <div className="flex justify-center p-3 rounded-xl bg-ink/[0.03] min-h-[180px] items-center">
                <ItemPreview items={items} form={form}
                  parts={form.category === 'skin' ? null : { back: previewBack, front: previewFront }} />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-[10px] font-mono uppercase text-ink/40 mb-1">Markup sinh từ server</div>
                <pre className="p-2 rounded-xl bg-ink/[0.03] text-[10px] font-mono text-ink/60 h-24 overflow-auto whitespace-pre-wrap break-all">
                  {previewHtml || '(rỗng)'}
                </pre>
              </div>
              <div className="flex gap-2 text-[10px] font-mono">
                <span className="px-2 py-1 rounded bg-ink/5 text-ink/60">back: {previewBack ? previewBack.length : 0} ký tự</span>
                <span className="px-2 py-1 rounded bg-ink/5 text-ink/60">front: {previewFront ? previewFront.length : 0} ký tự</span>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-ink/40 mb-1">Params</div>
                <pre className="p-2 rounded-xl bg-ink/[0.03] text-[10px] font-mono text-ink/60 overflow-auto">
                  {JSON.stringify(form.params, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {formError && <p className="text-ticket text-sm mt-3">{formError}</p>}

          <div className="mt-4 flex items-center gap-2 justify-end">
            <GhostButton onClick={closeModal}>Hủy</GhostButton>
            <PrimaryButton onClick={submit} disabled={saving}>
              <span className="flex items-center gap-1.5"><Save className="w-4 h-4" />{saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}</span>
            </PrimaryButton>
          </div>
        </Modal>
      )}

      <button onClick={openCreate}
        className="fixed bottom-24 sm:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-pink text-white shadow-lg hover:shadow-xl hover:bg-pink/80 transition flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
