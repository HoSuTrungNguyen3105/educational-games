import { useState, useEffect, useCallback } from 'react';
import { assignmentService, questionService } from '../../services/api.js';
import { useUserAuthStore } from '../../stores/userAuth.store.js';
import { navigate } from '../../lib/router.js';
import { Clock, AlertTriangle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

const TIMER_WARN = 60;

function Header({ title, timeLeft, isExam, onBack }) {
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return (
    <div className="bg-ink/90 text-white px-4 py-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-display text-sm truncate">{title}</span>
        {isExam && timeLeft !== null && (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm font-bold ${timeLeft <= TIMER_WARN ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </span>
        )}
      </div>
      <button onClick={onBack} className="text-white/60 hover:text-white text-xs font-body">Thoát</button>
    </div>
  );
}

function QuestionNavigator({ questions, answers, currentIdx, onSelect }) {
  return (
    <div className="p-3 bg-white rounded-xl border border-ink/8">
      <p className="text-xs font-body text-ink/50 mb-2 font-semibold">Câu hỏi</p>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, idx) => {
          const answered = answers[q.id] != null && answers[q.id] !== '';
          const isCurrent = idx === currentIdx;
          return (
            <button key={q.id} onClick={() => onSelect(idx)}
              className={`w-full aspect-square rounded-lg text-xs font-mono font-bold transition ${isCurrent ? 'bg-gold text-white shadow-sm ring-2 ring-gold/30' :
                answered ? 'bg-green-100 text-green-700 border border-green-200' :
                  'bg-ink/5 text-ink/40 border border-ink/10 hover:border-ink/20'
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
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center text-xs font-mono font-bold text-gold">{index + 1}</span>
        <span className="text-xs font-body text-ink/40">Câu {index + 1}/{total}</span>
      </div>
      <p className="text-sm font-body text-ink leading-relaxed">{question.content || question.question}</p>
    </div>
  );
}

function AnswerArea({ question, value, onChange }) {
  const type = question.questionType || question.type || 'multiple_choice';
  const options = question.options || [];

  if (type === 'fill-in' || type === 'text') {
    return (
      <input value={value || ''} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white text-sm text-ink font-body focus:outline-none focus:ring-2 focus:ring-gold/30"
        placeholder="Nhập đáp án..." />
    );
  }

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const optKey = opt.id || opt.key || opt;
        const optText = opt.content || opt.text || opt.label || optKey;
        const selected = value === optKey;
        return (
          <button key={optKey} onClick={() => onChange(optKey)}
            className={`w-full text-left p-3.5 rounded-xl border transition ${selected ? 'border-gold bg-gold/5 ring-2 ring-gold/20' : 'border-ink/10 bg-white hover:border-ink/20'
              }`}>
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${selected ? 'border-gold bg-gold' : 'border-ink/20'
                }`}>
                {selected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              <span className="text-sm font-body text-ink">{optText}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ResultView({ result, onBack }) {
  const sub = result.submission;
  const detail = result.detail || [];
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
      <div className="max-w-lg w-full space-y-4">
        <div className="note-card p-8 text-center space-y-4 anim-pop">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="font-display text-2xl text-ink">Nộp bài thành công!</h2>
          <div className="space-y-2">
            <p className="text-4xl font-display text-gold">{sub.score ?? 0}%</p>
            <p className="text-sm font-body text-ink/50">
              {sub.correctCount}/{sub.totalQuestions} câu đúng
            </p>
          </div>
        </div>

        {detail.length > 0 && (
          <div className="space-y-3">
            {detail.map((d, idx) => (
              <div key={d.questionId || idx}
                className={`p-4 rounded-xl border ${d.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm font-body text-ink mb-2">
                  <span className="font-bold">{idx + 1}.</span> {d.question}
                </p>
                <div className="text-xs font-body space-y-1">
                  <p className={d.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    Đáp án của bạn: <span className="font-semibold">{d.userAnswer || '(chưa trả lời)'}</span>
                    {d.isCorrect ? <CheckCircle2 className="inline w-3 h-3 ml-1" /> : <XCircle className="inline w-3 h-3 ml-1" />}
                  </p>
                  {!d.isCorrect && (
                    <p className="text-green-600">
                      Đáp án đúng: <span className="font-semibold">{d.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={onBack}
          className="w-full py-3 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition">
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

export default function AssignmentTake({ assignmentId }) {
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

  useEffect(() => {
    if (!assignmentId) return;
    init();
    return () => { if (timerRef) clearInterval(timerRef); };
  }, [assignmentId]);

  async function init() {
    setLoading(true);
    try {
      const a = await assignmentService.get(assignmentId);
      if (!a || !a.id) { setError('Không tìm thấy bài giao'); setLoading(false); return; }
      setAssignment(a);

      const sub = await assignmentService.start(assignmentId);
      if (sub && !sub.id && sub._id) sub.id = sub._id;
      setSubmission(sub);

      if (sub?.status === 'SUBMITTED') {
        const existing = await assignmentService.getResult(assignmentId).catch(() => null);
        if (existing) { setResult(existing); setSubmitted(true); setLoading(false); return; }
      }

      if (a.questionIds?.length) {
        try {
          const allQ = await questionService.listAll();
          if (Array.isArray(allQ)) {
            setQuestions(allQ.filter(q => q && q.id && a.questionIds.includes(q.id)));
          }
        } catch { }
      }

      if (a.isExam && a.examDuration && sub) {
        const remaining = sub.remainingTime ?? Math.max(0, a.examDuration * 60 - Math.floor((Date.now() - new Date(sub.startedAt).getTime()) / 1000));
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
      await assignmentService.submit(assignmentId, submissionId, answerList);
      const full = await assignmentService.getResult(assignmentId);
      setResult(full);
    } catch (err) { setError(err.message); }
  }, [assignmentId, submission, submitted, answers, timerRef]);

  function setAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  const answeredCount = Object.values(answers).filter(v => v != null && v !== '').length;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-body text-ink/40">Đang tải...</div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <p className="font-body text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gold text-white rounded-xl text-sm font-body">Về trang chủ</button>
      </div>
    </div>
  );

  if (submitted && result) return <ResultView result={result} onBack={() => navigate('/')} />;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
      <Header title={assignment?.title} timeLeft={timeLeft} isExam={assignment?.isExam} onBack={() => navigate('/')} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Question Navigator */}
        <div className={`hidden sm:block w-48 shrink-0 p-3 ${questions.length > 100 ? 'max-h-[calc(100vh-4.5rem)] overflow-y-auto' : ''}`}>
          <QuestionNavigator questions={questions} answers={answers} currentIdx={currentIdx} onSelect={setCurrentIdx} />
          <div className="mt-3 p-3 bg-white rounded-xl border border-ink/8">
            <p className="text-xs font-body text-ink/50 mb-1">Tiến độ</p>
            <p className="text-sm font-body font-semibold text-ink">{answeredCount}/{questions.length} câu đã trả lời</p>
          </div>
        </div>

        {/* Main: Question */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          {currentQuestion ? (
            <div className="max-w-2xl mx-auto w-full">
              <QuestionItem question={currentQuestion} index={currentIdx} total={questions.length} />
              <AnswerArea question={currentQuestion} value={answers[currentQuestion.id]} onChange={v => setAnswer(currentQuestion.id, v)} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full font-body text-ink/40">Chưa có câu hỏi</div>
          )}
        </div>
      </div>

      {/* Mobile navigator */}
      <div className="sm:hidden px-3 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {questions.map((q, idx) => {
            const answered = answers[q.id] != null && answers[q.id] !== '';
            return (
              <button key={q.id} onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold shrink-0 transition ${idx === currentIdx ? 'bg-gold text-white' :
                  answered ? 'bg-green-100 text-green-700' :
                    'bg-ink/5 text-ink/40'
                  }`}>
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom nav + submit */}
      <div className="bg-white border-t border-ink/8 px-4 py-3 flex items-center justify-between shrink-0 sticky bottom-0 z-10 sm:-mt-[38px] sm:relative sm:shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}
            className="p-2 rounded-lg bg-ink/5 text-ink/60 hover:bg-ink/10 transition disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-ink/40">{currentIdx + 1}/{questions.length}</span>
          <button onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIdx === questions.length - 1}
            className="p-2 rounded-lg bg-ink/5 text-ink/60 hover:bg-ink/10 transition disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {confirmSubmit ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-body text-ink/50">Xác nhận nộp?</span>
            <button onClick={() => { setConfirmSubmit(false); doSubmitNow(); }}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-body font-semibold hover:bg-red-600 transition">
              Nộp bài
            </button>
            <button onClick={() => setConfirmSubmit(false)}
              className="px-3 py-2 bg-ink/5 text-ink/60 rounded-xl text-xs font-body hover:bg-ink/10 transition">
              Hủy
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmSubmit(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gold text-white rounded-xl text-sm font-body font-semibold hover:bg-gold/80 transition">
            <Send className="w-4 h-4" />
            Nộp bài ({answeredCount}/{questions.length})
          </button>
        )}
      </div>
    </div>
  );
}
