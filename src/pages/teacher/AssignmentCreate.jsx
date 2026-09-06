import { useState, useEffect, useMemo } from 'react';
import { classService, assignmentService, questionService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { AlertCircle, Clock, FileText, CheckSquare, Square, Search, ChevronDown } from 'lucide-react';

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
  const [rangeInput, setRangeInput] = useState('');
  const [rangeError, setRangeError] = useState('');
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

  // Xử lý chọn theo khoảng (1-index)
  function handleRangeSelect() {
    setRangeError('');
    if (!rangeInput.trim()) {
      setRangeError('Vui lòng nhập khoảng cần chọn');
      return;
    }
    const parts = rangeInput.split(',').map(s => s.trim());
    const indices = new Set();
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > filteredQuestions.length || start > end) {
          setRangeError(`Khoảng "${part}" không hợp lệ (1-${filteredQuestions.length})`);
          return;
        }
        for (let i = start; i <= end; i++) {
          indices.add(i - 1); // chuyển sang 0-index
        }
      } else {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 1 || num > filteredQuestions.length) {
          setRangeError(`Số "${part}" không hợp lệ (1-${filteredQuestions.length})`);
          return;
        }
        indices.add(num - 1);
      }
    }
    const idsToSelect = Array.from(indices).map(idx => filteredQuestions[idx].id);
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      for (const id of idsToSelect) {
        next.add(id);
      }
      return next;
    });
    setRangeInput('');
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
    <div className="w-full px-4 md:px-6 lg:px-8 space-y-6">
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

          {/* Phần chọn nhanh theo khoảng */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={rangeInput}
              onChange={e => setRangeInput(e.target.value)}
              placeholder="VD: 1-20, 30-56"
              className="flex-1 min-w-[180px] px-3 py-2 rounded-xl bg-white border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="button"
              onClick={handleRangeSelect}
              className="px-4 py-2 bg-gold/10 text-gold font-body text-sm font-semibold rounded-xl hover:bg-gold/20 transition"
            >
              Chọn khoảng
            </button>
            <button
              type="button"
              onClick={toggleAll}
              className="flex items-center gap-1 px-3 py-2 text-xs font-body text-ink/60 hover:text-ink/80 transition"
            >
              {selectedQuestions.size === filteredQuestions.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {selectedQuestions.size === filteredQuestions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>
          {rangeError && (
            <p className="text-xs text-red-500 mt-1">{rangeError}</p>
          )}
          <p className="text-[10px] text-ink/30 font-mono">
            * Nhập số thứ tự hiển thị (1-based), cách nhau bằng dấu phẩy. Ví dụ: 1-5, 10, 15-20
          </p>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredQuestions.length === 0 ? (
              <p className="text-sm text-ink/40 text-center py-4">Không có câu hỏi nào</p>
            ) : (
              filteredQuestions.map((q, index) => (
                <button key={q.id} type="button" onClick={() => toggleQuestion(q.id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${selectedQuestions.has(q.id)
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
                      <p className="text-sm font-body text-ink truncate">
                        <span className="text-ink/30 font-mono mr-1">#{index + 1}</span>
                        {q.content || q.question}
                      </p>
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
                  className={`py-2.5 rounded-xl text-sm font-body font-semibold transition ${form.examDuration === opt.value
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