import { useState, useEffect, useMemo } from 'react';
import { assignmentService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import {
  ArrowLeft, Copy, Check, Users, BarChart3, Pencil,
  Search, Trophy, Clock, FileQuestion, Lock,
} from 'lucide-react';

export default function AssignmentDetail({ assignmentId }) {
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;
    load();
  }, [assignmentId]);

  async function load() {
    setLoading(true);
    try {
      const [a, subs, st] = await Promise.all([
        assignmentService.get(assignmentId),
        assignmentService.getSubmissions(assignmentId),
        assignmentService.getStats(assignmentId),
      ]);
      setAssignment(a);
      setSubmissions(subs);
      setStats(st);
    } catch { }
    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(assignment?.code || '').catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function handleClose() {
    if (!confirm('Đóng bài giao? Học sinh sẽ không thể nộp thêm.')) return;
    await assignmentService.close(assignmentId);
    load();
  }

  async function handleDelete() {
    if (!confirm('Xóa bài giao? Hành động này không thể hoàn tác.')) return;
    await assignmentService.delete_(assignmentId);
    navigate('/admin');
  }

  const filteredSubmissions = useMemo(() => {
    let list = submissions;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) => String(s.studentId).toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const av = a.score ?? -1, bv = b.score ?? -1;
      return sortDesc ? bv - av : av - bv;
    });
  }, [submissions, query, sortDesc]);

  const topScore = stats?.maxScore;

  if (loading) return <DetailSkeleton />;
  if (!assignment) return <EmptyState text="Không tìm thấy bài giao" />;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/admin')}
            aria-label="Quay lại"
            className="mt-1 w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-ink/40 hover:text-ink hover:bg-ink/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl text-ink">{assignment.title}</h1>
              <StatusPill active={assignment.status === 'ACTIVE'} />
            </div>
            {assignment.description && (
              <p className="text-sm font-body text-ink/50 mt-1.5 max-w-2xl">{assignment.description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {assignment.status === 'ACTIVE' && (
            <>
              <button
                onClick={() => navigate(`/admin/assignments/${assignmentId}/edit`)}
                className="px-3.5 py-2 bg-ink/5 text-ink/70 rounded-xl text-sm font-body hover:bg-ink/10 transition flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa
              </button>
              <button
                onClick={handleClose}
                className="px-3.5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-body hover:bg-red-100 transition flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Đóng bài
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 text-ink/30 rounded-xl text-sm font-body hover:bg-red-50 hover:text-red-500 transition"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Key facts strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <InfoCard label="Mã bài giao" accent>
          <button
            onClick={copyCode}
            className="font-mono text-lg font-bold text-gold flex items-center gap-1.5 hover:opacity-70 transition"
          >
            {assignment.code}
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </InfoCard>
        <InfoCard label="Câu hỏi">
          <span className="text-lg font-display text-ink">{assignment.questionIds?.length || 0}</span>
        </InfoCard>
        <InfoCard label="Loại bài">
          <span className="text-sm font-body font-semibold text-ink flex items-center justify-center gap-1.5">
            {assignment.isExam ? <Clock className="w-3.5 h-3.5 text-gold" /> : <FileQuestion className="w-3.5 h-3.5 text-gold" />}
            {assignment.isExam ? `${assignment.examDuration} phút` : 'Bài tập'}
          </span>
        </InfoCard>
        <InfoCard label="Đã nộp">
          <span className="text-lg font-display text-ink">{stats?.total ?? 0}</span>
        </InfoCard>
        <InfoCard label="Điểm TB">
          <span className="text-lg font-display text-ink">{stats ? `${stats.avgScore}%` : '–'}</span>
        </InfoCard>
        <InfoCard label="Cao nhất / thấp nhất">
          <span className="text-sm font-body font-semibold">
            <span className="text-green-600">{stats ? `${stats.maxScore}%` : '–'}</span>
            <span className="text-ink/30 mx-1">/</span>
            <span className="text-ink">{stats ? `${stats.minScore}%` : '–'}</span>
          </span>
        </InfoCard>
      </div>

      {/* Score spread */}
      {stats && stats.total > 0 && (
        <div className="note-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gold" />
            <h3 className="font-display text-sm text-ink">Phân bố điểm</h3>
          </div>
          <ScoreSpread min={stats.minScore} avg={stats.avgScore} max={stats.maxScore} />
        </div>
      )}

      {/* Submissions */}
      <div className="note-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gold" />
            <h3 className="font-display text-sm text-ink">Danh sách nộp bài ({submissions.length})</h3>
          </div>
          {submissions.length > 0 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm học sinh..."
                className="pl-8 pr-3 py-1.5 text-sm font-body bg-ink/5 rounded-lg outline-none focus:ring-2 focus:ring-gold/30 w-48"
              />
            </div>
          )}
        </div>

        {submissions.length === 0 ? (
          <EmptyState text="Chưa có ai nộp bài" hint="Chia sẻ mã bài giao để học sinh bắt đầu làm bài." />
        ) : filteredSubmissions.length === 0 ? (
          <EmptyState text={`Không tìm thấy học sinh khớp với "${query}"`} />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-ink/40 text-xs border-b border-ink/10">
                  <th className="pb-2.5 pl-5 font-medium w-9" />
                  <th className="pb-2.5 font-medium">Học sinh</th>
                  <th className="pb-2.5 font-medium">Lần</th>
                  <th className="pb-2.5 font-medium">
                    <button
                      onClick={() => setSortDesc((v) => !v)}
                      className="inline-flex items-center gap-1 hover:text-ink transition"
                    >
                      Điểm {sortDesc ? '↓' : '↑'}
                    </button>
                  </th>
                  <th className="pb-2.5 pr-5 font-medium">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="border-t border-ink/5 hover:bg-ink/[0.03] transition">
                    <td className="py-2.5 pl-5">
                      {s.score != null && s.score === topScore && (
                        <Trophy className="w-3.5 h-3.5 text-gold" />
                      )}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs font-semibold flex items-center justify-center shrink-0">
                          {String(s.studentId).slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-ink">{s.studentId}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-ink/50">{s.attemptNumber || 1}</td>
                    <td className="py-2.5">
                      <ScoreBadge score={s.score} />
                    </td>
                    <td className="py-2.5 pr-5 text-ink/40 text-xs">
                      {s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, children, accent }) {
  return (
    <div className={`note-card p-3.5 text-center ${accent ? 'ring-1 ring-gold/20' : ''}`}>
      <p className="text-[11px] font-body text-ink/40 mb-1">{label}</p>
      {children}
    </div>
  );
}

function StatusPill({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-ink/10 text-ink/50'
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-ink/30'}`} />
      {active ? 'Đang mở' : 'Đã đóng'}
    </span>
  );
}

function ScoreBadge({ score }) {
  if (score == null) return <span className="text-ink/30">–</span>;
  const tone =
    score >= 80 ? 'bg-green-100 text-green-700'
      : score >= 50 ? 'bg-gold/15 text-gold'
        : 'bg-red-100 text-red-600';
  return <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${tone}`}>{score}%</span>;
}

function ScoreSpread({ min, avg, max }) {
  const range = Math.max(max - min, 1);
  const avgPos = ((avg - min) / range) * 100;
  return (
    <div>
      <div className="relative h-2 rounded-full bg-ink/5 overflow-hidden">
        <div className="absolute inset-0 bg-gold/25" />
        <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${avgPos}%` }} />
      </div>
      <div className="flex justify-between text-xs font-body text-ink/40 mt-2">
        <span>Thấp nhất: <span className="text-ink font-semibold">{min}%</span></span>
        <span>Trung bình: <span className="text-ink font-semibold">{avg}%</span></span>
        <span>Cao nhất: <span className="text-ink font-semibold">{max}%</span></span>
      </div>
    </div>
  );
}

function EmptyState({ text, hint }) {
  return (
    <div className="text-center py-10">
      <p className="text-sm font-body text-ink/40">{text}</p>
      {hint && <p className="text-xs font-body text-ink/30 mt-1">{hint}</p>}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-ink/10 rounded-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-ink/5 rounded-2xl" />
        ))}
      </div>
      <div className="h-24 bg-ink/5 rounded-2xl" />
      <div className="h-64 bg-ink/5 rounded-2xl" />
    </div>
  );
}