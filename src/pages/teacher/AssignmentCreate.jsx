import { useState, useEffect } from 'react';
import { classService, assignmentService, gameService, questionService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { AlertCircle, Clock, FileText, Gamepad2, BookOpen, HelpCircle } from 'lucide-react';

const TIME_OPTIONS = [
  { value: 30, label: '30 phút' },
  { value: 45, label: '45 phút' },
  { value: 60, label: '60 phút' },
];

export default function AssignmentCreate() {
  const [classes, setClasses] = useState([]);
  const [games, setGames] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [form, setForm] = useState({
    classId: '',
    gameId: '',
    title: '',
    description: '',
    isExam: true,
    examDuration: 30,
    deadline: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClasses();
    loadGames();
  }, []);

  useEffect(() => {
    if (form.gameId) {
      loadQuestions(form.gameId);
    } else {
      setQuestions([]);
      setSelectedGame(null);
    }
  }, [form.gameId]);

  async function loadClasses() {
    try { setClasses(await classService.list()); } catch {}
  }

  async function loadGames() {
    try {
      const all = await gameService.list();
      setGames(all);
    } catch {}
  }

  async function loadQuestions(gameId) {
    try {
      const game = games.find(g => g._id === gameId);
      setSelectedGame(game || null);
      const qs = await questionService.listByGame(gameId);
      setQuestions(qs);
    } catch {
      setQuestions([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.classId || !form.gameId || !form.title) {
      setError('Vui lòng chọn lớp, game và nhập tiêu đề');
      return;
    }
    if (questions.length === 0) {
      setError('Game này chưa có câu hỏi. Vui lòng chọn game khác.');
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink">Tạo bài thi mới</h1>
          <p className="text-sm font-body text-ink/40">Tạo bài thi từ Question Bank có sẵn</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Tiêu đề bài thi *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="VD: Bài kiểm tra Toán chương 1" required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Mô tả</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
            rows={2} placeholder="Mô tả bài thi (không bắt buộc)" />
        </div>

        {/* Class + Game */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body text-ink/60 mb-1">Lớp *</label>
            <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40">
              <option value="">Chọn lớp</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-body text-ink/60 mb-1">Game (Question Bank) *</label>
            <select value={form.gameId} onChange={e => setForm({ ...form, gameId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40">
              <option value="">Chọn game</option>
              {games.map(g => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Game Info */}
        {selectedGame && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-4 h-4 text-blue-500" />
              <span className="font-display text-sm text-blue-700">{selectedGame.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-body text-blue-600">
              {selectedGame.subject && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {selectedGame.subject}
                </span>
              )}
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> {questions.length} câu hỏi
              </span>
            </div>
            {questions.length === 0 && (
              <p className="mt-2 text-xs text-red-500 font-body">⚠ Game này chưa có câu hỏi!</p>
            )}
          </div>
        )}

        {/* Exam Settings */}
        <div className="p-4 bg-paper2 rounded-xl border border-ink/8 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span className="font-display text-sm text-ink">Cài đặt bài thi</span>
          </div>

          {/* Time Options */}
          <div>
            <label className="block text-sm font-body text-ink/60 mb-2">Thời gian làm bài *</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, examDuration: opt.value })}
                  className={`py-2.5 rounded-xl text-sm font-body font-semibold transition ${
                    form.examDuration === opt.value
                      ? 'bg-gold text-white shadow-sm'
                      : 'bg-white border border-ink/10 text-ink hover:border-gold/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-body text-ink/60 mb-1">Hạn nộp (tùy chọn)</label>
            <input type="datetime-local" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
        </div>

        {/* Summary */}
        {selectedGame && questions.length > 0 && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
            <p className="text-sm font-body text-green-700">
              <span className="font-semibold">Tóm tắt:</span> {form.title || '(chưa nhập tiêu đề)'} — {questions.length} câu hỏi, {form.examDuration} phút
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting || !form.classId || !form.gameId || !form.title}
            className="px-6 py-2.5 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Đang tạo...' : 'Tạo bài thi'}
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
