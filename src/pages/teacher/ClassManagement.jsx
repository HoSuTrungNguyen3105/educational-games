import { useState, useEffect } from 'react';
import { classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Copy, School } from 'lucide-react';
import { ConfirmModal, EmptyState, FormModal, GridCard, GridToolbar, IconAdd, IconCheck, IconClose, IconEdit, IconTrash, IconUsers, Loader, Modal, PrimaryButton, useViewMode } from '../../components/ui';
import { useConfirm } from '../../hooks/useConfirm.js';
import { useCopy } from '../../hooks/useCopy.js';
import { rangeForPage } from '../../lib/rangePagination.js';
import { useRangePager } from '../../hooks/useRangePager.js';

// Phân trang PHÍA SERVER theo mẫu trang /dashboard/permissions: danh
// sách nạp theo ?from=&to= kèm ?q= (server lọc trước khi cắt — xem
// routes/classes.js), cụm RangePagination dùng chung hiện qua prop
// rangePager của GridToolbar. Các caller khác của classService.list()
// (không truyền range/bộ lọc) giữ nguyên hành vi.
const PER_PAGE = 10;

// Form sửa lớp: KHÔNG cho sửa `code` — mã lớp là khoá để học sinh tham gia
// lớp (route /join tra lớp theo code), sửa mã sẽ làm mã cũ đang phát cho học
// sinh mất hiệu lực. Field code chỉ hiện read-only để đối chiếu; payload gửi
// lên cũng không kèm code. (Form TẠO lớp vẫn nhập code như cũ — đó là lúc
// đặt mã lần đầu, khác với sửa.)
const EDIT_FIELDS = [
  { name: 'name', label: 'Tên lớp', placeholder: 'VD: 10A1' },
  { name: 'code', label: 'Mã lớp (không sửa được)', disabled: true },
  { name: 'schoolYear', label: 'Năm học', placeholder: 'VD: 2025-2026' },
  {
    name: 'status', label: 'Trạng thái', type: 'select',
    options: [
      { value: 'ACTIVE', label: 'Đang hoạt động' },
      { value: 'INACTIVE', label: 'Đã đóng' },
    ],
  },
];

export default function ClassManagement({ showToast } = {}) {
  const [classes, setClasses] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', schoolYear: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingCls, setEditingCls] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', code: '', schoolYear: '', status: 'ACTIVE' });
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();
  const [copiedKey, copy] = useCopy();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mode, setMode] = useViewMode('classes');
  const pager = useRangePager(total, PER_PAGE);

  useEffect(() => { loadClasses(); }, [pager.page, debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Gõ tìm kiếm: chờ 350ms rồi về trang 1 với từ khoá mới (mẫu Permissions).
  useEffect(() => {
    const t = setTimeout(() => {
      pager.setPage(1);
      setDebouncedQuery(query.trim());
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Xoá làm tổng co lại: trang vượt quá trang cuối thì lùi về.
  useEffect(() => {
    if (total > 0 && pager.page > pager.totalPages) pager.setPage(pager.totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  async function loadClasses(pageOverride) {
    setError(null);
    try {
      const range = pageOverride ? rangeForPage(pageOverride, PER_PAGE) : pager.range;
      const res = await classService.list(range, { q: debouncedQuery });
      setClasses(res.items);
      setTotal(res.total);
    } catch (e) { setError(e.message || 'Lỗi tải danh sách lớp'); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await classService.create(form);
      setForm({ name: '', code: '', schoolYear: '' });
      setShowCreate(false);
      // Lớp mới nằm ở đầu danh sách: về trang 1 và nạp lại đoạn đầu.
      pager.setPage(1);
      await loadClasses(1);
    } catch (err) { setFormError(err.message); }
    finally { setSaving(false); }
  }

  function openEdit(cls) {
    setEditingCls(cls);
    setEditForm({
      name: cls.name || '',
      code: cls.code || '',
      schoolYear: cls.schoolYear || '',
      status: cls.status || 'ACTIVE',
    });
    setEditError('');
  }

  const setEditField = (name, value) => setEditForm(prev => ({ ...prev, [name]: value }));

  async function handleEditSubmit() {
    if (!editingCls) return;
    if (!editForm.name.trim()) { setEditError('Vui lòng nhập tên lớp'); return; }
    setEditError('');
    setEditSaving(true);
    try {
      // Chỉ gửi field được sửa — tuyệt đối không gửi code (xem EDIT_FIELDS).
      await classService.update(editingCls.id, {
        name: editForm.name.trim(),
        schoolYear: editForm.schoolYear.trim(),
        status: editForm.status,
      });
      setEditingCls(null);
      showToast?.('Đã cập nhật lớp học!', 'success');
      await loadClasses();
    } catch (err) { setEditError(err.message || 'Lỗi cập nhật lớp'); }
    finally { setEditSaving(false); }
  }

  function handleDelete(cls) {
    askConfirm({
      title: 'Xóa lớp học',
      message: `Xóa lớp "${cls.name}"? Học sinh trong lớp sẽ không bị xóa.`,
      onConfirm: async () => {
        try {
          await classService.delete_(cls.id);
          await loadClasses();
        } catch { /* ignore */ }
      },
    });
  }

  const inputCls = "w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#8A7C63] text-sm font-mono">Quản lý lớp học</p>
          <h1 className="font-display text-3xl text-ink">Lớp học</h1>
        </div>
        <PrimaryButton onClick={() => setShowCreate(true)} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm flex items-center gap-2">
          <IconAdd className="w-4 h-4" /> Tạo lớp
        </PrimaryButton>
      </div>

      {showCreate && (
        <Modal
          onClose={() => setShowCreate(false)}
          unstyled
          overlayClassName="bg-black/40 p-4"
          contentClassName="bg-paper rounded-2xl shadow-xl w-full max-w-md p-6 anim-pop"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-ink">Tạo lớp mới</h2>
            <button onClick={() => setShowCreate(false)}><IconClose className="w-5 h-5 text-ink/40" /></button>
          </div>
          {formError && <p className="text-sm text-red-500 mb-3">{formError}</p>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-body text-ink/60 mb-1">Tên lớp</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className={inputCls} placeholder="VD: 10A1" required />
            </div>
            <div>
              <label className="block text-sm font-body text-ink/60 mb-1">Mã lớp (6 chữ số)</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                className={inputCls} placeholder="VD: 123456" required />
            </div>
            <div>
              <label className="block text-sm font-body text-ink/60 mb-1">Năm học</label>
              <input value={form.schoolYear} onChange={e => setForm({ ...form, schoolYear: e.target.value })}
                className={inputCls} placeholder="VD: 2025-2026" />
            </div>
            <PrimaryButton type="submit" disabled={saving} className="!bg-gold hover:!bg-gold/80 w-full !py-2.5 !text-sm">
              {saving ? 'Đang tạo...' : 'Tạo lớp'}
            </PrimaryButton>
          </form>
        </Modal>
      )}

      {error && !classes && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadClasses} className="font-semibold hover:underline">Thử lại</button>
        </div>
      )}
      {!error && !classes && <Loader label="Đang tải danh sách lớp..." />}
      {!error && classes && total === 0 && !debouncedQuery && (
        <EmptyState icon={<School />} title="Chưa có lớp nào"
          subtitle="Tạo lớp đầu tiên để bắt đầu quản lý học sinh."
          action={<PrimaryButton onClick={() => setShowCreate(true)} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm">+ Tạo lớp</PrimaryButton>} />
      )}
      {!error && classes && (total > 0 || debouncedQuery) && (
        <div className="space-y-4">
          <GridToolbar
            search={{ value: query, onChange: setQuery, placeholder: "Tìm kiếm" }}
            mode={mode}
            onModeChange={setMode}
            rangePager={pager.props}
          />
          {classes.length === 0 ? (
            <div className="note-card edu-empty">Không tìm thấy lớp nào khớp tìm kiếm.</div>
          ) : mode === "grid" ? (
            <div className="edu-grid">
              {classes.map(cls => (
                <GridCard
                  key={cls.id}
                  title={cls.name}
                  mono={cls.code}
                  meta={[
                    cls.schoolYear ? `Năm học: ${cls.schoolYear}` : null,
                    cls.studentCount != null ? `Sĩ số: ${cls.studentCount}` : null,
                    cls.teacherName ? `GV: ${cls.teacherName}` : null,
                    cls.status === 'INACTIVE' ? 'Đã đóng' : null,
                  ].filter(Boolean).join(' · ') || undefined}
                  extra={(
                    <button onClick={() => copy(cls.code, cls.code)}
                      className="self-start flex items-center gap-1 px-2 py-1 rounded-lg bg-gold/10 text-gold text-xs font-mono hover:bg-gold/20 transition">
                      {copiedKey === cls.code ? <IconCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === cls.code ? "Đã sao chép mã" : "Sao chép mã"}
                    </button>
                  )}
                  footerActions={[
                    { label: "Sửa", icon: <IconEdit />, onClick: () => openEdit(cls), tone: "muted" },
                    { label: "Xem học sinh", icon: <IconUsers />, onClick: () => navigate(`/dashboard/classes/${cls.id}/students`), tone: "blue" },
                    { label: "Xoá", icon: <IconTrash />, onClick: () => handleDelete(cls), tone: "red" },
                  ]}
                />
              ))}
            </div>
          ) : (
            <div className="edu-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tên lớp</th>
                    <th>Mã lớp</th>
                    <th>Năm học</th>
                    <th>Sĩ số</th>
                    <th>GV phụ trách</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => (
                    <tr key={cls.id}>
                      <td className="font-semibold">{cls.name}</td>
                      <td>
                        <button onClick={() => copy(cls.code, cls.code)}
                          className="inline-flex items-center gap-1 font-mono text-[#8A7C63] hover:text-gold transition">
                          {cls.code}
                          {copiedKey === cls.code ? <IconCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td>{cls.schoolYear || "—"}</td>
                      <td>{cls.studentCount != null ? cls.studentCount : "—"}</td>
                      <td>{cls.teacherName || "—"}</td>
                      <td>{cls.status === 'INACTIVE' ? 'Đã đóng' : 'Đang hoạt động'}</td>
                      <td>
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => openEdit(cls)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:underline">
                            <IconEdit className="w-4 h-4" /> Sửa
                          </button>
                          <button onClick={() => navigate(`/dashboard/classes/${cls.id}/students`)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2271b1] hover:underline">
                            <IconUsers className="w-4 h-4" /> Xem học sinh
                          </button>
                          <button onClick={() => handleDelete(cls)} className="text-ink/30 hover:text-red-500 transition" title="Xóa lớp">
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <FormModal
        open={!!editingCls}
        title="lớp"
        fields={EDIT_FIELDS}
        values={editForm}
        onChange={setEditField}
        onSubmit={handleEditSubmit}
        onClose={() => setEditingCls(null)}
        error={editError}
        saving={editSaving}
        editId={editingCls?.id}
      />

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
