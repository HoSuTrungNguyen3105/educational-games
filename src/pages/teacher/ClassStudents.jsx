import { useState, useEffect } from 'react';
import { classService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { ArrowLeft, Users, Search, UserCircle2, Mail, Hash } from 'lucide-react';

export default function ClassStudents({ classId }) {
  const [cls, setCls] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!classId) return;
    loadData();
  }, [classId]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [clsData, studentsData] = await Promise.all([
        classService.get(classId),
        classService.getStudents(classId),
      ]);
      setCls(clsData);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (e) {
      setError('Không thể tải dữ liệu lớp học.');
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.displayName || s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/classes')}
          className="flex items-center gap-1.5 text-sm font-body text-ink/50 hover:text-gold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-ink flex items-center gap-2">
            <Users className="w-6 h-6 text-gold" />
            {loading ? 'Đang tải...' : cls ? `Học sinh — ${cls.name}` : 'Lớp học'}
          </h1>
          {cls?.schoolYear && (
            <p className="text-xs font-body text-ink/40 mt-0.5">{cls.schoolYear}</p>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold/10 text-gold text-sm font-mono">
          <Hash className="w-3.5 h-3.5" />
          {cls?.code ?? '—'}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body">
          {error}
        </div>
      )}

      {/* Search */}
      {!loading && students.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm học sinh..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-ink/40 font-body">Đang tải...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Users className="w-12 h-12 text-ink/20 mx-auto" />
          <p className="font-body text-ink/40">Lớp chưa có học sinh nào.</p>
          <p className="text-sm font-body text-ink/30">
            Học sinh tham gia bằng mã lớp:{' '}
            <span className="font-mono text-gold">{cls?.code}</span>
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-ink/40 font-body">
          Không tìm thấy học sinh phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <div key={s.id || s.uid || i} className="note-card p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {s.photoURL ? (
                  <img
                    src={s.photoURL}
                    alt={s.displayName || s.name || 'Học sinh'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gold/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <UserCircle2 className="w-6 h-6 text-gold/60" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-ink truncate">
                  {s.displayName || s.name || 'Chưa có tên'}
                </p>
                {s.email && (
                  <p className="flex items-center gap-1 text-xs font-body text-ink/40 mt-0.5 truncate">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    {s.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count footer */}
      {!loading && students.length > 0 && (
        <p className="text-xs font-body text-ink/30 text-right">
          {filtered.length} / {students.length} học sinh
        </p>
      )}
    </div>
  );
}
