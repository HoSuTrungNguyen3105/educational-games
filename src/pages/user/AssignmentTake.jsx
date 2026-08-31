import { useState, useEffect, useRef, useCallback } from 'react';
import { assignmentService, questionService, templateService } from '../../services/api.js';
import { useUserAuthStore } from '../../stores/userAuth.store.js';
import { navigate } from '../../lib/router.js';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import HtmlGameLoader from '../../games/HtmlGameLoader.jsx';

const TIMER_WARN = 60;

export default function AssignmentTake({ assignmentId }) {
  const user = useUserAuthStore(s => s.user);
  const userAuth = useUserAuthStore(s => s);
  const [assignment, setAssignment] = useState(null);
  const [template, setTemplate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [submission, setSubmission] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const submissionRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!assignmentId) return;
    init();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [assignmentId]);

  async function init() {
    setLoading(true);
    try {
      const a = await assignmentService.get(assignmentId);
      if (!a || !a.id) { setError('Không tìm thấy bài giao'); setLoading(false); return; }
      setAssignment(a);

      const existing = await assignmentService.getResult(assignmentId).catch(() => null);
      if (existing) {
        setResult(existing);
        setSubmitted(true);
        setLoading(false);
        return;
      }

      const sub = await assignmentService.start(assignmentId);
      if (sub && !sub.id && sub._id) sub.id = sub._id;
      setSubmission(sub);
      submissionRef.current = sub;

      if (a.questionIds?.length) {
        try {
          const allQ = await questionService.listAll();
          if (Array.isArray(allQ)) {
            setQuestions(allQ.filter(q => q && q.id && a.questionIds.includes(q.id)));
          }
        } catch (e) { console.error('[AssignmentTake] questions load error:', e); }
      }

      if (a.templateId) {
        try {
          const tplRes = await templateService.get(a.templateId);
          const tpl = tplRes?.data || tplRes;
          console.log('[AssignmentTake] template loaded:', tpl?._id, tpl?.htmlTemplate?.substring(0, 50));
          if (tpl && tpl.htmlTemplate) {
            setTemplate(tpl);
          } else {
            console.warn('[AssignmentTake] template missing htmlTemplate:', tpl);
          }
        } catch (e) { console.error('[AssignmentTake] template load error:', e); }
      }

      if (a.isExam && a.examDuration && sub) {
        const elapsed = Math.floor((Date.now() - new Date(sub.startedAt).getTime()) / 1000);
        const remaining = Math.max(0, a.examDuration * 60 - elapsed);
        setTimeLeft(remaining);
        startTimeRef.current = Date.now() - (a.examDuration * 60 - remaining) * 1000;

        if (remaining <= 0) {
          await doSubmit();
          return;
        }

        timerRef.current = setInterval(() => {
          const newTimeLeft = Math.max(0, a.examDuration * 60 - Math.floor((Date.now() - startTimeRef.current) / 1000));
          setTimeLeft(newTimeLeft);
          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current);
            doSubmit();
          }
        }, 1000);
      }
    } catch (err) {
      console.error('[AssignmentTake] init error:', err);
      setError(err.message);
    }
    setLoading(false);
    readyRef.current = true;
  }

  const doSubmit = useCallback(async () => {
    if (!readyRef.current) return;
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      let answers = [];

      if (template?.htmlTemplate) {
        answers = await new Promise((resolve) => {
          const handler = (e) => {
            try {
              const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
              if (msg.type === 'assignment-answers') {
                window.removeEventListener('message', handler);
                resolve(msg.answers || []);
              }
            } catch { }
          };
          window.addEventListener('message', handler);
          const iframe = document.querySelector('iframe');
          iframe?.contentWindow?.postMessage(JSON.stringify({ type: 'get-assignment-answers' }), '*');
          setTimeout(() => { window.removeEventListener('message', handler); resolve([]); }, 3000);
        });
      } else {
        answers = Object.entries(questionAnswers).map(([questionId, value]) => ({ questionId, value }));
      }

      const sub = submissionRef.current || submission;
      const submissionId = sub?.id || sub?._id;
      if (!submissionId) {
        setError('Không tìm thấy submission để nộp bài. Vui lòng thử lại.');
        setSubmitted(false);
        return;
      }

      await assignmentService.submit(assignmentId, submissionId, answers);
      const full = await assignmentService.getResult(assignmentId);
      setResult(full);
    } catch (err) { setError(err.message); }
  }, [assignmentId, submission, submitted, template, questionAnswers]);

  useEffect(() => {
    function onMsg(e) {
      try {
        const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (msg?.type === 'game-answers' && msg.answers) {
          doSubmit();
        }
      } catch { }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [doSubmit]);

  useEffect(() => {
    if (!assignment?.deadline) return;
    const dl = new Date(assignment.deadline).getTime() - Date.now();
    if (dl <= 0) { doSubmit(); return; }
    const t = setTimeout(doSubmit, dl);
    return () => clearTimeout(t);
  }, [assignment, doSubmit]);

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  const hasHtmlGame = !!(template?.htmlTemplate && template.htmlTemplate.trim());

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

  if (submitted && result) {
    const sub = result.submission;
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
        <div className="note-card p-8 max-w-lg w-full text-center space-y-4 anim-pop">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="font-display text-2xl text-ink">Nộp bài thành công!</h2>
          <div className="space-y-2">
            <p className="text-4xl font-display text-gold">{sub.score ?? 0}%</p>
            <p className="text-sm font-body text-ink/50">
              {sub.correctCount}/{sub.totalQuestions} câu đúng
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={() => navigate('/')}
              className="px-5 py-2 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
      <div className="bg-ink/90 text-white px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-display text-sm truncate">{assignment?.title}</span>
          {assignment?.isExam && timeLeft !== null && (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm font-bold ${timeLeft <= TIMER_WARN ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
        <button onClick={() => navigate('/')} className="text-white/60 hover:text-white text-xs font-body">Thoát</button>
      </div>

      <div className="flex-1 relative overflow-auto">
        {hasHtmlGame ? (
          <HtmlGameLoader
            htmlContent={template.htmlTemplate}
            game={{ _id: template._id || 'assignment', id: template._id || 'assignment', name: assignment?.title || 'Bài tập', code: 'assignment' }}
            questions={questions}
            players={[]}
            playerName={user?.name || 'Học sinh'}
            playMode={template.playMode || 'solo'}
            onFinish={() => { }}
            onQuit={() => navigate('/')}
            userAuth={userAuth}
          />
        ) : questions.length > 0 ? (
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                <p className="text-sm font-body text-ink mb-3">
                  <span className="font-bold mr-1">{idx + 1}.</span> {q.question}
                </p>
                {q.type === 'fill-in' || q.questionType === 'fill-in' ? (
                  <input
                    value={questionAnswers[q.id] || ''}
                    onChange={e => setQuestionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-ink/10 bg-ink/5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/30"
                    placeholder="Nhập đáp án..."
                  />
                ) : (
                  <div className="space-y-2">
                    {(q.options || []).map((opt) => {
                      const optKey = typeof opt === 'string' ? opt : opt.key || opt.id;
                      const optText = typeof opt === 'string' ? opt : opt.text || opt.label || optKey;
                      return (
                        <label key={optKey} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${questionAnswers[q.id] === optKey ? 'border-gold bg-gold/5' : 'border-ink/10 bg-ink/5 hover:bg-ink/3'}`}>
                          <input type="radio" name={`q-${q.id}`} value={optKey}
                            checked={questionAnswers[q.id] === optKey}
                            onChange={() => setQuestionAnswers(prev => ({ ...prev, [q.id]: optKey }))}
                            className="accent-gold" />
                          <span className="text-sm text-ink">{optText}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full font-body text-ink/40">Đang tải...</div>
        )}
      </div>

      {!submitted && !hasHtmlGame && (
        <div className="bg-ink/90 px-4 py-3 flex justify-center shrink-0">
          <button onClick={doSubmit}
            className="px-8 py-2.5 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition">
            Nộp bài
          </button>
        </div>
      )}
    </div>
  );
}
