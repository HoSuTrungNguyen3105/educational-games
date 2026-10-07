import { useState, useEffect } from 'react';
import { classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Plus, Copy, Users, Trash2, X, Check } from 'lucide-react';
import { Modal, ConfirmModal, PrimaryButton, Loader, EmptyState } from '../../components/ui.jsx';
import { useConfirm } from '../../hooks/useConfirm.js';
import { useCopy } from '../../hooks/useCopy.js';

export default function ClassManagement() {
  const [classes, setClasses] = useState(null);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', schoolYear: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();
  const [copiedKey, copy] = useCopy();

  useEffect(() => { loadClasses(); }, []);

  async function loadClasses() {
    setClasses(null);
    setError(null);
    try { setClasses(await classService.list()); }
    catch (e) { setError(e.message || 'Lỗi tải danh sách lớp'); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const cls = await classService.create(form);
      setClasses(prev => [cls, ...(prev || [])]);
      setForm({ name: '', code: '', schoolYear: '' });
      setShowCreate(false);
    } catch (err) { setFormError(err.message); }
    finally { setSaving(false); }
  }

  function handleDelete(cls) {
    askConfirm({
      title: 'Xóa lớp học',
      message: `Xóa lớp "${cls.name}"? Học sinh trong lớp sẽ không bị xóa.`,
      onConfirm: async () => {
        try {
          await classService.delete_(cls.id);
          setClasses(prev => (prev || []).filter(c => c.id !== cls.id));
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
          <Plus className="w-4 h-4" /> Tạo lớp
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
            <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-ink/40" /></button>
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
      {!error && classes && classes.length === 0 && (
        <EmptyState icon="🏫" title="Chưa có lớp nào"
          subtitle="Tạo lớp đầu tiên để bắt đầu quản lý học sinh."
          action={<PrimaryButton onClick={() => setShowCreate(true)} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm">+ Tạo lớp</PrimaryButton>} />
      )}
      {!error && classes && classes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="note-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-ink">{cls.name}</h3>
                  {cls.schoolYear && <p className="text-xs font-body text-ink/40 mt-0.5">{cls.schoolYear}</p>}
                </div>
                <button onClick={() => handleDelete(cls)} className="text-ink/30 hover:text-red-500 transition" title="Xóa lớp">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-ink/50">Mã:</span>
                <button onClick={() => copy(cls.code, cls.code)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gold/10 text-gold text-sm font-mono hover:bg-gold/20 transition">
                  {cls.code}
                  {copiedKey === cls.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {copiedKey === cls.code && <span className="text-xs text-green-600">Đã sao chép</span>}
              </div>
              <button onClick={() => navigate(`/admin/classes/${cls.id}/students`)}
                className="flex items-center gap-1.5 text-xs font-body text-ink/50 hover:text-gold transition">
                <Users className="w-4 h-4" /> Xem học sinh
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
