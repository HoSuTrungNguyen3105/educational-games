import { useState, useEffect, useRef, useCallback } from 'react';
import { assignmentService, gameProgressService } from '../../services/api.js';
import { useUserAuthStore } from '../../stores/userAuth.store.js';
import { navigate } from '../../lib/router.js';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TIMER_WARN = 60;

export default function AssignmentTake({ assignmentId }) {
  const user = useUserAuthStore(s => s.user);
  const [assignment, setAssignment] = useState(null);
  const [game, setGame] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!assignmentId) return;
    init();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [assignmentId]);

  async function init() {
    setLoading(true);
    try {
      const a = await assignmentService.get(assignmentId);
      if (!a) { setError('Không tìm thấy bài giao'); setLoading(false); return; }
      setAssignment(a);

      // Check if already submitted
      const existing = await assignmentService.getResult(assignmentId).catch(() => null);
      if (existing) {
        setResult(existing);
        setSubmitted(true);
        setLoading(false);
        return;
      }

      // Start submission
      const sub = await assignmentService.start(assignmentId);
      setSubmission(sub);

      // Load game for questions
      const allGames = await gameProgressService.listAll();
      const g = allGames.find(x => x.id === a.gameId);
      setGame(g);

      // Start timer if exam
      if (a.isExam && a.examDuration) {
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
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  const doSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      // Ask iframe for answers via postMessage
      const answers = await new Promise((resolve) => {
        const handler = (e) => {
          try {
            const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (msg.type === 'assignment-answers') {
              window.removeEventListener('message', handler);
              resolve(msg.answers || []);
            }
          } catch {}
        };
        window.addEventListener('message', handler);
        iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ type: 'get-assignment-answers' }), '*');
        setTimeout(() => { window.removeEventListener('message', handler); resolve([]); }, 3000);
      });

      const res = await assignmentService.submit(assignmentId, submission.id, answers);
      const full = await assignmentService.getResult(assignmentId);
      setResult(full);
    } catch (err) { setError(err.message); }
  }, [assignmentId, submission, submitted]);

  // Listen for game-answers message (alternative path from game)
  useEffect(() => {
    function onMsg(e) {
      try {
        const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (msg.type === 'game-answers' && msg.answers) {
          doSubmit();
        }
      } catch {}
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [doSubmit]);

  // Auto-submit on deadline
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

  const gameUrl = game ? `/games/${game.code}.html` : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
      {/* Header */}
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

      {/* Game iframe */}
      <div className="flex-1 relative">
        {gameUrl ? (
          <iframe
            ref={iframeRef}
            src={gameUrl}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <div className="flex items-center justify-center h-full font-body text-ink/40">Đang tải game...</div>
        )}
      </div>

      {/* Footer submit button (for non-exam or always visible) */}
      {!submitted && (
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
