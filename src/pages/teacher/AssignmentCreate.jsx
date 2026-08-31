import { useState, useEffect, useMemo } from 'react';
import { classService, assignmentService, questionService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { AlertCircle, Clock, FileText, CheckSquare, Square, Search } from 'lucide-react';

const TIME_OPTIONS = [
  { value: 30, label: '30 phút' },
  { value: 45, label: '45 phút' },
  { value: 60, label: '60 phút' },
];

export default function AssignmentCreate() {
  const [classes, setClasses] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    classId: '',
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
    loadQuestions();
  }, []);

  async function loadClasses() {
    try { setClasses((await classService.list()) || []); } catch { setClasses([]); }
  }

  async function loadQuestions() {
    try {
      const qs = await questionService.listAll();
      setAllQuestions(qs || []);
    } catch { setAllQuestions([]); }
  }

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const text = (q.content || q.question || '').toLowerCase();
      return !searchQuery || text.includes(searchQuery.toLowerCase());
    });
  }, [allQuestions, searchQuery]);

  const questionsByGame = useMemo(() => {
    const groups = {};
    for (const q of filteredQuestions) {
      const gid = q.gameId || 'unknown';
      if (!groups[gid]) groups[gid] = [];
      groups[gid].push(q);
    }
    return groups;
  }, [filteredQuestions]);

  function toggleQuestion(qId) {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  }

  function toggleAll() {
    if (selectedQuestions.size === filteredQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.classId || !form.title) {
      setError('Vui lòng chọn lớp và nhập tiêu đề');
      return;
    }
    if (selectedQuestions.size === 0) {
      setError('Vui lòng chọn ít nhất 1 câu hỏi');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = {
        ...form,
        questionIds: Array.from(selectedQuestions),
      };
      if (!data.deadline) delete data.deadline;
      const assignment = await assignmentService.create(data);
      navigate(`/admin/assignments/${assignment.id}`);
    } catch (err) { setError(err.message); }
    setSubmitting(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink">Tạo bài thi mới</h1>
          <p className="text-sm font-body text-ink/40">Chọn câu hỏi từ Question Bank</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Tiêu đề bài thi *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
            placeholder="VD: Bài kiểm tra Toán chương 1" required />
        </div>

        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Mô tả</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
            rows={2} placeholder="Mô tả bài thi (không bắt buộc)" />
        </div>

        <div>
          <label className="block text-sm font-body text-ink/60 mb-1">Lớp *</label>
          <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-paper2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40">
            <option value="">Chọn lớp</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="p-4 bg-paper2 rounded-xl border border-ink/8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-gold" />
              <span className="font-display text-sm text-ink">Chọn câu hỏi</span>
            </div>
            <span className="text-xs font-mono text-ink/40">
              {selectedQuestions.size}/{filteredQuestions.length} câu đã chọn
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm câu hỏi..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30" />
          </div>

          <button type="button" onClick={toggleAll}
            className="flex items-center gap-2 text-xs font-body text-gold hover:text-gold/80 transition">
            {selectedQuestions.size === filteredQuestions.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {selectedQuestions.size === filteredQuestions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredQuestions.length === 0 ? (
              <p className="text-sm text-ink/40 text-center py-4">Không có câu hỏi nào</p>
            ) : (
              filteredQuestions.map(q => (
                <button key={q.id} type="button" onClick={() => toggleQuestion(q.id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedQuestions.has(q.id)
                      ? 'border-gold bg-gold/5'
                      : 'border-ink/8 bg-white hover:border-ink/20'
                  }`}>
                  <div className="flex items-start gap-2">
                    {selectedQuestions.has(q.id) ? (
                      <CheckSquare className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-ink/30 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-ink truncate">{q.content || q.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {q.points != null && (
                          <span className="text-[10px] font-mono text-ink/30">{q.points} điểm</span>
                        )}
                        <span className="text-[10px] font-mono text-ink/30">{q.options?.length || 0} đáp án</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-4 bg-paper2 rounded-xl border border-ink/8 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span className="font-display text-sm text-ink">Cài đặt bài thi</span>
          </div>

          <div>
            <label className="block text-sm font-body text-ink/60 mb-2">Thời gian làm bài *</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_OPTIONS.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm({ ...form, examDuration: opt.value })}
                  className={`py-2.5 rounded-xl text-sm font-body font-semibold transition ${
                    form.examDuration === opt.value
                      ? 'bg-gold text-white shadow-sm'
                      : 'bg-white border border-ink/10 text-ink hover:border-gold/40'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-ink/60 mb-1">Hạn nộp (tùy chọn)</label>
            <input type="datetime-local" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-ink/10 bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
        </div>

        {selectedQuestions.size > 0 && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
            <p className="text-sm font-body text-green-700">
              <span className="font-semibold">Tóm tắt:</span> {form.title || '(chưa nhập tiêu đề)'} — {selectedQuestions.size} câu hỏi, {form.examDuration} phút
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting || !form.classId || !form.title || selectedQuestions.size === 0}
            className="px-6 py-2.5 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Đang tạo...' : 'Tạo bài thi'}
          </button>
          <button type="button" onClick={() => navigate('/admin/assignments')}
            className="px-6 py-2.5 bg-ink/5 text-ink/60 rounded-xl font-body font-semibold hover:bg-ink/10 transition">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
