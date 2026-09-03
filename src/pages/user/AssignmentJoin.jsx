import { useState } from 'react';
import { assignmentService } from '../../services/api.js';
import { navigate } from '../../lib/router.js';
import { AlertCircle, LogIn, ChevronLeft } from 'lucide-react';

export default function AssignmentJoin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      navigate(`/assignment/${assignment.id}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F4E8D1 0%, #E8D5B7 100%)' }}>
      <div className="w-full max-w-sm">
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
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
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
      </div>
    </div>
  );
}
