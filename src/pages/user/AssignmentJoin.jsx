import { useEffect, useState } from 'react';
import { assignmentService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { CircleAlert, LogIn, ChevronLeft, ClipboardList, CheckCircle2 } from 'lucide-react';

function formatDeadline(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AssignmentJoin({ userAuth }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Bài tập được giao cho lớp của học sinh đang đăng nhập (null = đang tải).
  const [assigned, setAssigned] = useState(null);
  const [completedIds, setCompletedIds] = useState(() => new Set());

  useEffect(() => {
    if (!userAuth?.user) { setAssigned(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const [list, completed] = await Promise.all([
          assignmentService.list(),
          assignmentService.getMyCompleted().catch(() => []),
        ]);
        if (cancelled) return;
        setAssigned(Array.isArray(list) ? list : []);
        setCompletedIds(new Set((completed || []).map((c) => c.id ?? c.assignmentId).filter(Boolean)));
      } catch {
        if (!cancelled) setAssigned([]);
      }
    })();
    return () => { cancelled = true; };
  }, [userAuth?.user]);

  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await assignmentService.join(code.trim());
      const assignment = res?.data || res;
      if (!assignment?.id) {
        setError('Không tìm thấy bài tập');
        setLoading(false);
        return;
      }
      navigate(`educational-games/#/assignment/${assignment.code || assignment.id}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 py-10" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="group text-sm text-stone-500 hover:text-ink transition inline-flex items-center gap-2 mb-4 hover:bg-white/60 rounded-full px-3 py-1.5 -ml-3"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Về trang chủ
        </button>

        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-ink">Vào bài tập</h1>
          <p className="text-sm font-body text-ink/50 mt-1">Nhập mã bài tập do giáo viên cung cấp</p>
        </div>

        <div className="note-card p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <CircleAlert className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-body text-ink/60 mb-1">Mã bài tập (6 chữ số)</label>
              <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center text-3xl font-mono tracking-[0.3em] px-4 py-3 rounded-xl border border-ink/10 bg-paper2 text-ink focus:outline-none focus:ring-2 focus:ring-gold/40"
                placeholder="000000" maxLength={6} autoFocus />
            </div>

            <button type="submit" disabled={loading || code.length < 6}
              className="w-full py-3 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              {loading ? 'Đang kiểm tra...' : 'Vào bài'}
            </button>
          </form>
        </div>

        {/* ─── Bài tập được giao cho lớp của học sinh ─── */}
        {userAuth?.user ? (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg text-ink">
              <ClipboardList className="w-5 h-5 text-gold" /> Bài tập được giao
            </h2>
            <p className="text-xs font-body text-ink/50 mt-1 mb-3">Bài tập thầy cô giao cho lớp của bạn — bấm vào để làm bài, không cần nhập mã.</p>

            {assigned === null ? (
              <p className="text-sm text-ink/40 py-2">Đang tải bài tập...</p>
            ) : assigned.length === 0 ? (
              <div className="note-card p-4 text-sm text-ink/60">
                Chưa có bài tập nào được giao. Nếu thầy cô đưa mã bài tập, nhập mã ở trên để vào bài nhé!
              </div>
            ) : (
              <div className="space-y-2">
                {assigned.map((a) => {
                  const done = completedIds.has(a.id);
                  const overdue = a.deadline && new Date(a.deadline) < new Date();
                  const questionCount = a.questionIds?.length ?? a.questionCount ?? 0;
                  return (
                    <div key={a.id} className="note-card p-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-ink truncate">{a.title || 'Bài tập'}</p>
                        <p className="text-xs text-ink/50 mt-0.5">
                          Mã {a.code} · {questionCount} câu hỏi
                          {a.deadline ? ` · Hạn nộp: ${formatDeadline(a.deadline)}` : ''}
                          {a.isExam ? ' · Bài kiểm tra' : ''}
                        </p>
                      </div>
                      {done ? (
                        <span className="inline-flex items-center gap-1 shrink-0 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                        </span>
                      ) : overdue ? (
                        <span className="shrink-0 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-full">
                          Đã hết hạn
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(`/assignment/${a.code || a.id}`)}
                          className="shrink-0 px-4 py-2 bg-gold text-white text-sm rounded-xl font-body font-semibold hover:bg-gold/80 transition"
                        >
                          Làm bài
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-5 text-center text-xs text-ink/40">
            Đăng nhập để xem danh sách bài tập được giao cho lớp của bạn.
          </p>
        )}
      </div>
    </div>
  );
}
