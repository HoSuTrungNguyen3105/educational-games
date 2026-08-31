import { useState, useEffect } from 'react';
import { assignmentService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Copy, Users, BarChart3, Pencil } from 'lucide-react';

export default function AssignmentDetail({ assignmentId }) {
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } catch {}
    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(assignment?.code || '').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleClose() {
    if (!confirm('Đóng bài giao? Học sinh sẽ không thể nộp thêm.')) return;
    await assignmentService.close(assignmentId);
    load();
  }

  async function handleDelete() {
    if (!confirm('Xóa bài giao?')) return;
    await assignmentService.delete_(assignmentId);
    navigate('/admin');
  }

  if (loading) return <div className="text-center py-12 text-ink/40 font-body">Đang tải...</div>;
  if (!assignment) return <div className="text-center py-12 text-ink/40 font-body">Không tìm thấy bài giao</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">{assignment.title}</h1>
          {assignment.description && <p className="text-sm font-body text-ink/50 mt-1">{assignment.description}</p>}
        </div>
        <div className="flex gap-2">
          {assignment.status === 'ACTIVE' && (
            <>
              <button onClick={() => navigate(`/admin/assignments/${assignmentId}/edit`)}
                className="px-3 py-1.5 bg-gold/10 text-gold rounded-xl text-sm font-body hover:bg-gold/20 transition flex items-center gap-1.5">
                <Pencil className="w-3.5 h-3.5" /> Sửa
              </button>
              <button onClick={handleClose} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl text-sm font-body hover:bg-red-200 transition">
                Đóng bài
              </button>
            </>
          )}
          <button onClick={handleDelete} className="px-3 py-1.5 bg-ink/5 text-ink/40 rounded-xl text-sm font-body hover:bg-red-100 hover:text-red-500 transition">
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="note-card p-3 text-center">
          <p className="text-xs font-body text-ink/40">Mã bài giao</p>
          <button onClick={copyCode} className="mt-1 px-3 py-1.5 bg-gold/10 text-gold rounded-lg font-mono text-lg font-bold hover:bg-gold/20 transition flex items-center gap-1.5 mx-auto">
            {assignment.code}
            <Copy className="w-3.5 h-3.5" />
          </button>
          {copied && <p className="text-[10px] text-green-600 mt-0.5">Đã sao chép</p>}
        </div>
        <div className="note-card p-3 text-center">
          <p className="text-xs font-body text-ink/40">Trạng thái</p>
          <p className={`mt-1 text-sm font-body font-semibold ${assignment.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
            {assignment.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng'}
          </p>
        </div>
        <div className="note-card p-3 text-center">
          <p className="text-xs font-body text-ink/40">Câu hỏi</p>
          <p className="mt-1 text-sm font-body font-semibold text-ink">
            {assignment.questionIds?.length || 0} câu
          </p>
        </div>
        <div className="note-card p-3 text-center">
          <p className="text-xs font-body text-ink/40">Loại</p>
          <p className="mt-1 text-sm font-body font-semibold text-ink">
            {assignment.isExam ? `Bài thi (${assignment.examDuration} phút)` : 'Bài tập'}
          </p>
        </div>
      </div>

      {stats && stats.total > 0 && (
        <div className="note-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gold" />
            <h3 className="font-display text-sm text-ink">Thống kê</h3>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div><p className="text-2xl font-display text-ink">{stats.total}</p><p className="text-xs font-body text-ink/40">Đã nộp</p></div>
            <div><p className="text-2xl font-display text-ink">{stats.avgScore}%</p><p className="text-xs font-body text-ink/40">Điểm TB</p></div>
            <div><p className="text-2xl font-display text-green-600">{stats.maxScore}%</p><p className="text-xs font-body text-ink/40">Cao nhất</p></div>
            <div><p className="text-2xl font-display text-ink">{stats.minScore}%</p><p className="text-xs font-body text-ink/40">Thấp nhất</p></div>
          </div>
        </div>
      )}

      <div className="note-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gold" />
          <h3 className="font-display text-sm text-ink">Danh sách nộp bài ({submissions.length})</h3>
        </div>
        {submissions.length === 0 ? (
          <p className="text-sm font-body text-ink/40">Chưa có ai nộp bài</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-ink/40 text-xs">
                  <th className="pb-2">Học sinh</th>
                  <th className="pb-2">Lần</th>
                  <th className="pb-2">Điểm</th>
                  <th className="pb-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id} className="border-t border-ink/5">
                    <td className="py-2">{s.studentId}</td>
                    <td className="py-2">{s.attemptNumber || 1}</td>
                    <td className="py-2 font-semibold text-gold">{s.score ?? '-'}</td>
                    <td className="py-2 text-ink/40 text-xs">
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
