import { useState, useEffect } from 'react';
import { assignmentService, gameService, classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { Plus, Clock, Users, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [games, setGames] = useState({});
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
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
    } catch {}
    setLoading(false);
  }

  async function handleClose(id) {
    if (!confirm('Đóng bài giao này?')) return;
    await assignmentService.close(id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Bài tập đã giao</h1>
        <button onClick={() => navigate('/admin/assignments/new')}
          className="px-4 py-2 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo bài tập
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink/40 font-body">Đang tải...</div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 text-ink/40 font-body">Chưa có bài tập nào</div>
      ) : (
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
                <button onClick={() => navigate(`/admin/assignments/${a.id}`)}
                  className="p-2 rounded-lg hover:bg-ink/5 transition text-ink/40 hover:text-gold">
                  <Eye className="w-4 h-4" />
                </button>
                {a.status === 'ACTIVE' && (
                  <button onClick={() => handleClose(a.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition text-ink/30 hover:text-red-500">
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
