import { useState, useEffect } from 'react';
import { classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Plus, Copy, Users, Trash2, X } from 'lucide-react';
import { Modal } from '../../components/ui.jsx';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', schoolYear: '' });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => { loadClasses(); }, []);

  async function loadClasses() {
    setLoading(true);
    try { setClasses(await classService.list()); } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      const cls = await classService.create(form);
      setClasses(prev => [cls, ...prev]);
      setForm({ name: '', code: '', schoolYear: '' });
      setShowCreate(false);
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Xóa lớp này?')) return;
    try { await classService.delete_(id); setClasses(prev => prev.filter(c => c.id !== id)); } catch {}
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Quản lý lớp</h1>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo lớp
        </button>
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
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-body text-ink/60 mb-1">Tên lớp</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="VD: 10A1" required />
              </div>
              <div>
                <label className="block text-sm font-body text-ink/60 mb-1">Mã lớp (6 chữ số)</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="VD: 123456" required />
              </div>
              <div>
                <label className="block text-sm font-body text-ink/60 mb-1">Năm học</label>
                <input value={form.schoolYear} onChange={e => setForm({ ...form, schoolYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="VD: 2025-2026" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition">
                Tạo lớp
              </button>
            </form>
        </Modal>
      )}

      {loading ? (
        <div className="text-center py-12 text-ink/40 font-body">Đang tải...</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12 text-ink/40 font-body">Chưa có lớp nào</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="note-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-ink">{cls.name}</h3>
                  {cls.schoolYear && <p className="text-xs font-body text-ink/40 mt-0.5">{cls.schoolYear}</p>}
                </div>
                <button onClick={() => handleDelete(cls.id)} className="text-ink/30 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-ink/50">Mã:</span>
                <button onClick={() => copyCode(cls.code)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gold/10 text-gold text-sm font-mono hover:bg-gold/20 transition">
                  {cls.code}
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copied === cls.code && <span className="text-xs text-green-600">Đã sao chép</span>}
              </div>
              <button onClick={() => navigate(`/admin/classes/${cls.id}/students`)}
                className="flex items-center gap-1.5 text-xs font-body text-ink/50 hover:text-gold transition">
                <Users className="w-4 h-4" /> Xem học sinh
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
