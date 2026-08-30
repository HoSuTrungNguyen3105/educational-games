import { useState, useEffect } from 'react';
import { classService, assignmentService, gameProgressService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { X, Check, AlertCircle } from 'lucide-react';

export default function AssignmentCreate() {
  const [classes, setClasses] = useState([]);
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({
    classId: '',
    gameId: '',
    title: '',
    description: '',
    isExam: false,
    examDuration: 60,
    deadline: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClasses();
    loadGames();
  }, []);

  async function loadClasses() {
    try { setClasses(await classService.list()); } catch {}
  }

  async function loadGames() {
    try {
      const all = await gameProgressService.listAll();
      setGames(all);
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.classId || !form.gameId || !form.title) {
      setError('Vui lòng chọn lớp, game và nhập tiêu đề');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = { ...form };
      if (!data.deadline) delete data.deadline;
      const assignment = await assignmentService.create(data);
      navigate(`/admin/assignments/${assignment.id}`);
    } catch (err) { setError(err.message); }
    setSubmitting(false);
  }

  const selectedGame = games.find(g => g.id === form.gameId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-2xl text-ink">Tạo bài tập mới</h1>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Tiêu đề *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="VD: Bài kiểm tra Toán học chương 1" required />
        </div>

        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Mô tả</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
            rows={2} placeholder="Mô tả bài tập (không bắt buộc)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body text-ink/60 mb-1">Lớp *</label>
            <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40">
              <option value="">Chọn lớp</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-body text-ink/60 mb-1">Game *</label>
            <select value={form.gameId} onChange={e => setForm({ ...form, gameId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40">
              <option value="">Chọn game</option>
              {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        {selectedGame && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 font-body">
            Game: {selectedGame.name} — {selectedGame.questionsCount ?? '?'} câu hỏi
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.isExam} onChange={e => setForm({ ...form, isExam: e.target.checked })}
              className="sr-only peer" />
            <div className="w-9 h-5 bg-ink/10 peer-focus:ring-2 peer-focus:ring-gold/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
          </label>
          <span className="text-sm font-body text-ink/70">Bài thi (giới hạn thời gian)</span>
        </div>

        {form.isExam && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body text-ink/60 mb-1">Thời gian (phút)</label>
              <input type="number" min={5} max={180} value={form.examDuration}
                onChange={e => setForm({ ...form, examDuration: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="block text-sm font-body text-ink/60 mb-1">Hạn nộp (tùy chọn)</label>
              <input type="datetime-local" value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition disabled:opacity-50">
            {submitting ? 'Đang tạo...' : 'Tạo bài tập'}
          </button>
          <button type="button" onClick={() => navigate('/admin')}
            className="px-6 py-2.5 bg-ink/5 text-ink/60 rounded-xl font-body font-semibold hover:bg-ink/10 transition">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
