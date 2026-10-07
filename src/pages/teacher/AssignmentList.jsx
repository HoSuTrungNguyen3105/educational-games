import { useState, useEffect } from 'react';
import { assignmentService, gameService, classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Plus, Clock, Users, CheckCircle, XCircle, Eye, Link2 } from 'lucide-react';
import { ManagementHeader, PrimaryButton, Loader, EmptyState, ConfirmModal } from '../../components/ui.jsx';
import { useConfirm } from '../../hooks/useConfirm.js';
import { useCopy } from '../../hooks/useCopy.js';

export default function AssignmentList() {
  const [assignments, setAssignments] = useState(null);
  const [games, setGames] = useState({});
  const [classes, setClasses] = useState({});
  const [error, setError] = useState(null);
  const { askConfirm, confirmProps } = useConfirm();
  const [copiedKey, copy] = useCopy();

  useEffect(() => { load(); }, []);

  async function load() {
    setAssignments(null);
    setError(null);
    try {
      const [all, allGames, allClasses] = await Promise.all([
        assignmentService.list(),
        gameService.list(),
        classService.list(),
      ]);
      setAssignments(all);
      const gMap = {}; allGames.forEach(g => { gMap[g._id] = g.name; });
      const cMap = {}; allClasses.forEach(c => { cMap[c.id] = c.name; });
      setGames(gMap);
      setClasses(cMap);
    } catch (e) {
      setError(e.message || 'Lỗi tải danh sách bài tập');
    }
  }

  function handleClose(a) {
    askConfirm({
      title: 'Đóng bài tập',
      message: `Đóng bài "${a.title}"? Học sinh sẽ không thể nộp thêm.`,
      confirmLabel: 'Đóng',
      danger: false,
      onConfirm: async () => {
        await assignmentService.close(a.id);
        load();
      },
    });
  }

  function copyLink(assignment) {
    const url = `${window.location.origin}/#/assignment/${assignment.code || assignment.id}`;
    copy(url, assignment.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ManagementHeader subtitle="Quản lý bài tập" title="Bài tập đã giao" />
        <PrimaryButton onClick={() => navigate('/admin/assignments/new')} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo bài tập
        </PrimaryButton>
      </div>

      {error && !assignments && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body flex items-center justify-between">
          <span>{error}</span>
          <button onClick={load} className="font-semibold hover:underline">Thử lại</button>
        </div>
      )}
      {!error && !assignments && <Loader label="Đang tải bài tập..." />}
      {!error && assignments && assignments.length === 0 && (
        <EmptyState icon="📝" title="Chưa có bài tập nào"
          subtitle="Tạo bài tập đầu tiên để giao cho học sinh."
          action={<PrimaryButton onClick={() => navigate('/admin/assignments/new')} className="!bg-gold hover:!bg-gold/80 !px-4 !py-2 !text-sm">+ Tạo bài tập</PrimaryButton>} />
      )}
      {!error && assignments && assignments.length > 0 && (
        <div className="space-y-3">
          {assignments.map(a => (
            <div key={a.id} className="note-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm text-ink truncate">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${a.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {a.status === 'ACTIVE' ? 'Đang mở' : 'Đã đóng'}
                  </span>
                  {a.isExam && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-blue-100 text-blue-600">
                      Bài thi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs font-body text-ink/40">
                  <span>{classes[a.classId] || a.classId}</span>
                  <span>•</span>
                  <span>{games[a.gameId] || a.gameId}</span>
                  <span>•</span>
                  <span className="font-mono text-gold">{a.code}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => copyLink(a)}
                  className={`p-2 rounded-lg hover:bg-ink/5 transition ${copiedKey === a.id ? 'text-green-500' : 'text-ink/40 hover:text-gold'}`}
                  title="Copy link bài tập">
                  {copiedKey === a.id ? <CheckCircle className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
                <button onClick={() => navigate(`/admin/assignments/${a.id}`)}
                  className="p-2 rounded-lg hover:bg-ink/5 transition text-ink/40 hover:text-gold">
                  <Eye className="w-4 h-4" />
                </button>
                {a.status === 'ACTIVE' && (
                  <button onClick={() => handleClose(a)}
                    className="p-2 rounded-lg hover:bg-red-50 transition text-ink/30 hover:text-red-500"
                    title="Đóng bài tập">
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
