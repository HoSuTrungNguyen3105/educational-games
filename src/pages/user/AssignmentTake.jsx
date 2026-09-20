import { useState, useEffect, useCallback } from 'react';
import { assignmentService, questionService } from '../../services/api.js';
import { useUserAuthStore } from '../../stores/userAuth.store.js';
import { navigate } from '../../lib/router.js';
import { Clock, AlertTriangle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Send, User, ArrowLeft, ArrowRight } from 'lucide-react';

const TIMER_WARN = 60;
const GUEST_STORAGE_KEY = 'edu_assignment_guest';

function saveGuestName(name, assignmentId) {
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({ name, assignmentId }));
}
function clearGuestName() {
  localStorage.removeItem(GUEST_STORAGE_KEY);
}

function Header({ title, timeLeft, isExam, onBack, answeredCount, totalQuestions }) {
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-sm lg:text-base font-bold text-gray-800 truncate">{title}</h1>
          <p className="text-xs text-gray-400">{answeredCount}/{totalQuestions} câu đã trả lời</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isExam && timeLeft !== null && (
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-sm font-bold ${timeLeft <= TIMER_WARN ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </span>
        )}
      </div>
    </div>
  );
}

function QuestionNavigator({ questions, answers, currentIdx, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Câu hỏi</p>
      <div className="grid grid-cols-4 gap-2">
        {questions.map((q, idx) => {
          const answered = answers[q.id] != null && answers[q.id] !== '';
          const isCurrent = idx === currentIdx;
          return (
            <button key={q.id} onClick={() => onSelect(idx)}
              className={`aspect-square rounded-xl text-sm font-bold transition-all duration-150 ${
                isCurrent ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105' :
                answered ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100' :
                'bg-gray-50 text-gray-400 border-2 border-gray-100 hover:border-gray-300 hover:text-gray-600'
              }`}>
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionItem({ question, index, total }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-base font-bold text-amber-600">
          {index + 1}
        </span>
        <span className="text-sm text-gray-400 font-medium">Câu {index + 1} / {total}</span>
      </div>
      <p className="text-base lg:text-lg font-medium text-gray-800 leading-relaxed">{question.content || question.question}</p>
    </div>
  );
}

function AnswerArea({ question, value, onChange }) {
  const type = question.questionType || question.type || 'multiple_choice';
  const options = question.options || [];

  if (type === 'fill-in' || type === 'text') {
    return (
      <input value={value || ''} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-base text-gray-800 font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
        placeholder="Nhập đáp án của bạn..." />
    );
  }

  return (
    <div className="space-y-3">
      {options.map((opt, optIdx) => {
        const optKey = opt.id || opt.key || opt;
        const optText = opt.content || opt.text || opt.label || optKey;
        const selected = value === optKey;
        const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
        return (
          <button key={optKey} onClick={() => onChange(optKey)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
              selected
                ? 'border-amber-400 bg-amber-50 shadow-sm ring-2 ring-amber-200'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition ${
                selected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {labels[optIdx] || optIdx + 1}
              </span>
              <span className={`text-base font-medium ${selected ? 'text-amber-800' : 'text-gray-700'}`}>{optText}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ResultView({ result, onBack, onRedo, canRedo, attemptInfo }) {
  const allSubs = result.submissions || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = allSubs[selectedIdx] || { submission: result.submission, detail: result.detail };
  const sub = current.submission;
  const detail = current.detail || [];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-lg w-full space-y-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Nộp bài thành công!</h2>
          <div className="space-y-2">
            <p className="text-5xl font-display font-bold text-amber-500">{sub.score ?? 0}%</p>
            <p className="text-sm text-gray-500">
              {sub.correctCount}/{sub.totalQuestions} câu đúng
            </p>
            {attemptInfo && (
              <p className="text-xs text-gray-400">
                Lần {sub.attemptNumber || selectedIdx + 1}/{attemptInfo.maxAttempts === 0 ? '∞' : attemptInfo.maxAttempts}
              </p>
            )}
          </div>
        </div>

        {allSubs.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Lịch sử ({allSubs.length} lần)</p>
            <div className="flex flex-wrap gap-2">
              {allSubs.map((item, idx) => {
                const s = item.submission;
                const isActive = idx === selectedIdx;
                return (
                  <button key={s.id} onClick={() => setSelectedIdx(idx)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    Lần {s.attemptNumber || idx + 1}: {s.score ?? 0}%
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {detail.length > 0 && (
          <div className="space-y-3">
            {detail.map((d, idx) => (
              <div key={d.questionId || idx}
                className={`p-4 rounded-2xl border-2 ${d.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm font-medium text-gray-800 mb-2">
                  <span className="font-bold">{idx + 1}.</span> {d.question}
                </p>
                <div className="text-sm space-y-1">
                  <p className={d.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    Đáp án của bạn: <span className="font-semibold">{d.userAnswer || '(chưa trả lời)'}</span>
                    {d.isCorrect ? <CheckCircle2 className="inline w-4 h-4 ml-1" /> : <XCircle className="inline w-4 h-4 ml-1" />}
                  </p>
                  {!d.isCorrect && d.correctAnswer && (
                    <p className="text-green-600">
                      Đáp án đúng: <span className="font-semibold">{d.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {canRedo && (
            <button onClick={onRedo}
              className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition">
              Làm lại
            </button>
          )}
          <button onClick={onBack}
            className={`${canRedo ? 'flex-1' : 'w-full'} py-3.5 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition shadow-md`}>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestNameForm({ assignmentTitle, onSubmit, loading }) {
  const [name, setName] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate('/')}
          className="group text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Về trang chủ
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Nhập tên để bắt đầu</h1>
          {assignmentTitle && (
            <p className="text-sm text-gray-500 mt-2">{assignmentTitle}</p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Tên của bạn</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full text-center text-lg font-medium px-4 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                placeholder="Nguyễn Văn A" autoFocus />
            </div>

            <button type="submit" disabled={loading || !name.trim()}
              className="w-full py-4 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
              <Send className="w-5 h-5" />
              {loading ? 'Đang tải...' : 'Bắt đầu làm bài'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AssignmentTake({ code: codeOrId }) {
  const user = useUserAuthStore(s => s.user);
  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submission, setSubmission] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [timerRef, setTimerRef] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [guestName, setGuestName] = useState(null);

  const isGuest = !user && guestName;

  useEffect(() => {
    if (!codeOrId) return;
    resolveAssignment();
    return () => { if (timerRef) clearInterval(timerRef); };
  }, [codeOrId]);

  async function resolveAssignment() {
    setLoading(true);
    setError('');
    try {
      const a = await assignmentService.resolve(codeOrId);
      if (!a || !a.id) { setError('Không tìm thấy bài tập'); setLoading(false); return; }
      setAssignment(a);
      setResolved(true);
    } catch (err) { setError(err.message || 'Không tìm thấy bài tập'); }
    setLoading(false);
  }

  useEffect(() => {
    if (resolved && user && assignment) { clearGuestName(); initAssignment(assignment.id); }
  }, [resolved, user, assignment]);

  useEffect(() => {
    if (resolved && !user && guestName && assignment) { initAssignment(assignment.id); }
  }, [resolved, guestName, assignment]);

  async function handleGuestSubmit(name) {
    setGuestName(name);
    saveGuestName(name, assignment?.id);
  }

  async function initAssignment(assignmentId) {
    setLoading(true);
    setError('');
    try {
      const sub = await assignmentService.start(assignmentId, { guestName });
      if (sub && !sub.id && sub._id) sub.id = sub._id;
      setSubmission(sub);

      if (sub?.status === 'SUBMITTED') {
        const existing = await assignmentService.getResult(assignmentId, { guestName, showCorrectAnswer: true }).catch(() => null);
        if (existing) { setResult(existing); setSubmitted(true); setLoading(false); return; }
      }

      const qIds = assignment.questionIds || [];
      if (qIds.length) {
        try {
          const allQ = await questionService.listAll();
          if (Array.isArray(allQ)) setQuestions(allQ.filter(q => q && q.id && qIds.includes(q.id)));
        } catch { /* ignore */ }
      }

      if (assignment.isExam && assignment.examDuration && sub) {
        const remaining = sub.remainingTime ?? Math.max(0, assignment.examDuration * 60 - Math.floor((Date.now() - new Date(sub.startedAt).getTime()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) { doSubmitNow(); return; }
        const intervalId = setInterval(() => {
          setTimeLeft(prev => {
            const next = prev - 1;
            if (next <= 0) { clearInterval(intervalId); doSubmitNow(); return 0; }
            return next;
          });
        }, 1000);
        setTimerRef(intervalId);
      }
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  const doSubmitNow = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef) clearInterval(timerRef);
    try {
      const answerList = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
      const sub = submission;
      const submissionId = sub?.id || sub?._id;
      if (!submissionId) { setError('Không tìm thấy submission'); setSubmitted(false); return; }
      await assignmentService.submit(assignment.id, submissionId, answerList, { guestName });
      const full = await assignmentService.getResult(assignment.id, { guestName, showCorrectAnswer: true });
      setResult(full);
    } catch (err) { setError(err.message); }
  }, [assignment, submission, submitted, answers, timerRef, guestName]);

  function setAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  const answeredCount = Object.values(answers).filter(v => v != null && v !== '').length;

  if (loading && !resolved) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Đang tải...</p>
      </div>
    </div>
  );

  if (error && !assignment) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="font-medium text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition shadow-md">Về trang chủ</button>
      </div>
    </div>
  );

  if (resolved && !user && !guestName && assignment) {
    return <GuestNameForm assignmentTitle={assignment.title} onSubmit={handleGuestSubmit} loading={loading} />;
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Đang tải bài tập...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="font-medium text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition shadow-md">Về trang chủ</button>
      </div>
    </div>
  );

  if (submitted && result) {
    const maxAttempts = result.maxAttempts ?? assignment?.maxAttempts ?? 1;
    const submittedCount = result.submittedCount ?? 0;
    const canRedo = maxAttempts === 0 || submittedCount < maxAttempts;
    return (
      <ResultView
        result={result}
        onBack={() => { clearGuestName(); navigate('/'); }}
        onRedo={() => {
          setSubmitted(false);
          setResult(null);
          setSubmission(null);
          setAnswers({});
          setCurrentIdx(0);
          initAssignment(assignment.id);
        }}
        canRedo={canRedo}
        attemptInfo={{ attemptNumber: result.submission?.attemptNumber || 1, maxAttempts }}
      />
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50">
      <Header
        title={assignment?.title}
        timeLeft={timeLeft}
        isExam={assignment?.isExam}
        onBack={() => navigate('/')}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />

      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 shrink-0 p-4">
          <div className="sticky top-4 space-y-4">
            <QuestionNavigator questions={questions} answers={answers} currentIdx={currentIdx} onSelect={setCurrentIdx} />
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tiến độ</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }} />
              </div>
              <p className="text-sm font-semibold text-gray-700">{answeredCount}/{questions.length} câu</p>
              {isGuest && <p className="text-xs text-amber-500 mt-2">{guestName}</p>}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-4 lg:p-8">
            {currentQuestion ? (
              <div className="max-w-2xl mx-auto">
                <QuestionItem question={currentQuestion} index={currentIdx} total={questions.length} />
                <AnswerArea question={currentQuestion} value={answers[currentQuestion.id]} onChange={v => setAnswer(currentQuestion.id, v)} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Chưa có câu hỏi</div>
            )}
          </div>

          {/* Mobile question strip */}
          <div className="lg:hidden px-4 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
              {questions.map((q, idx) => {
                const answered = answers[q.id] != null && answers[q.id] !== '';
                return (
                  <button key={q.id} onClick={() => setCurrentIdx(idx)}
                    className={`w-11 h-11 rounded-xl text-sm font-bold shrink-0 transition-all duration-150 ${
                      idx === currentIdx ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105' :
                      answered ? 'bg-green-100 text-green-700 border-2 border-green-200' :
                      'bg-gray-100 text-gray-400 border-2 border-gray-200 hover:border-gray-300'
                    }`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white border-t border-gray-200 px-4 lg:px-6 py-3 shrink-0 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}
              className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition disabled:opacity-30 disabled:hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-gray-500 min-w-[60px] text-center">{currentIdx + 1} / {questions.length}</span>
            <button onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIdx === questions.length - 1}
              className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition disabled:opacity-30 disabled:hover:bg-gray-100">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {confirmSubmit ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Xác nhận nộp?</span>
              <button onClick={() => { setConfirmSubmit(false); doSubmitNow(); }}
                className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition shadow-sm">
                Nộp bài
              </button>
              <button onClick={() => setConfirmSubmit(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition">
                Hủy
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmSubmit(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition shadow-md">
              <Send className="w-4 h-4" />
              Nộp bài ({answeredCount}/{questions.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
