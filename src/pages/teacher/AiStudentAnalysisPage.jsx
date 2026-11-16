// pages/teacher/AiStudentAnalysisPage.jsx
//
// Trang phân tích kết quả học tập cho GIÁO VIÊN.
//
// Giáo viên tìm và chọn học sinh rồi xem báo cáo. Backend tự kiểm tra quyền: học sinh gửi
// studentId của người khác sẽ bị từ chối 403, không phải kiểm tra ở frontend.
//
// Mobile: tìm kiếm full-width, danh sách cuộn trong khung giới hạn chiều cao, nút bấm ≥ 44px.

import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Gamepad2, Star, Users } from "lucide-react";
import AiChatWidget from "../../components/ai/AiChatWidget.jsx";
import AiLearningAnalysisPanel from "../../components/ai/AiLearningAnalysisPanel.jsx";
import { GhostButton, Loader, PrimaryButton, StatGrid } from "../../components/ui";
import { getClassOverview } from "../../services/aiApi.js";
import { userService } from "../../services/api.js";

export default function AiStudentAnalysisPage() {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Tổng quan lớp — hiện khi CHƯA chọn học sinh. Số liệu hệ thống tính từ
  // lượt chơi thật qua GET /api/ai/class-overview (không phải AI diễn giải).
  const [overview, setOverview] = useState(null);
  const [overviewError, setOverviewError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getClassOverview()
      .then((d) => { if (!cancelled) setOverview(d); })
      .catch((e) => { if (!cancelled) setOverviewError(e?.message || "Không đọc được tổng quan lớp."); });
    return () => { cancelled = true; };
  }, []);

  async function search(e) {
    e?.preventDefault();
    const q = String(query || "").trim();
    if (q.length < 2) {
      setError("Nhập ít nhất 2 ký tự để tìm học sinh.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      setCandidates((await userService.search(q)) || []);
    } catch (e2) {
      setError(e2?.message || "Không tìm được danh sách học sinh.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
          <Bot className="w-6 h-6 text-teal" />
          Phân tích AI
        </h1>
        <p className="text-sm text-[#8A7C63] mt-1">
          Số liệu do hệ thống tính từ lượt chơi thật, phần nhận xét do AI diễn giải.
        </p>
      </div>

      <div className="note-card p-4 sm:p-5 lg:p-6">
        <form onSubmit={search} className="flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="flex-1 min-w-0 block">
            <span className="block text-[11px] font-mono uppercase text-[#8A7C63] mb-1">
              Tìm học sinh
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tên hoặc tên đăng nhập…"
              enterKeyHint="search"
              className="w-full note-card px-4 py-2.5 text-base sm:text-sm border-ink/10 focus:border-ticket"
            />
          </label>
          <div className="flex gap-3 shrink-0">
            <PrimaryButton onClick={search} disabled={busy} className="flex-1 sm:flex-none">
              {busy ? "Đang tìm…" : "Tìm"}
            </PrimaryButton>
            {selected && (
              <GhostButton
                onClick={() => {
                  setSelected(null);
                  setCandidates(null);
                }}
                className="flex-1 sm:flex-none"
              >
                Bỏ chọn
              </GhostButton>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-3 rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2">
            <p className="text-xs text-ticket break-words">{error}</p>
          </div>
        )}

        {candidates && candidates.length === 0 && (
          <p className="mt-4 text-sm text-[#8A7C63]">Không tìm thấy học sinh nào.</p>
        )}

        {candidates && candidates.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-64 sm:max-h-72 overflow-y-auto overscroll-contain">
            {candidates.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => setSelected(u)}
                  className={`w-full text-left note-card px-4 py-3 min-h-[44px] transition hover:border-gold/60 ${
                    selected?.id === u.id ? "border-gold ring-2 ring-gold/25" : "border-ink/10"
                  }`}
                >
                  <span className="font-semibold text-ink text-sm break-words">
                    {u.name || u.username}
                  </span>
                  <span className="text-[11px] text-[#8A7C63] font-mono ml-2 break-all">
                    {u.username} · {u.role}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!selected && (
        <div className="note-card p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="font-display text-lg sm:text-xl text-ink">Tổng quan lớp</h2>
            <span className="text-[10px] font-mono uppercase text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1 shrink-0">
              Do hệ thống tính
            </span>
          </div>

          {overviewError && (
            <p className="text-sm text-[#8A7C63]">Chưa đọc được tổng quan lớp: {overviewError}</p>
          )}
          {!overview && !overviewError && (
            <div className="flex justify-center py-6">
              <Loader label="Đang tổng hợp số liệu lớp..." />
            </div>
          )}
          {overview && overview.totalPlays === 0 && (
            <p className="text-sm text-[#8A7C63]">
              Chưa có lượt chơi nào được ghi nhận — khi học sinh bắt đầu chơi, tổng quan lớp sẽ hiện ở đây.
            </p>
          )}
          {overview && overview.totalPlays > 0 && (
            <>
              <StatGrid
                stats={[
                  { icon: <Users />, value: `${overview.studentsWithData}/${overview.totalStudents}`, label: "học sinh có dữ liệu" },
                  { icon: <Gamepad2 />, value: overview.totalPlays, label: "lượt chơi" },
                  { icon: <CheckCircle2 />, value: `${overview.accuracy}%`, label: "tỷ lệ đúng" },
                  { icon: <Star />, value: Math.round(overview.averageScore), label: "điểm TB" },
                ]}
              />

              {overview.weakTopics?.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-display text-base text-ink mb-3">Chủ đề yếu chung của lớp</h3>
                  <ul className="space-y-3">
                    {overview.weakTopics.map((t, i) => (
                      <li key={`${t.label}-${i}`} className="min-w-0">
                        <div className="flex items-end justify-between gap-3 mb-1">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink truncate">{t.label}</p>
                            <p className="text-[11px] text-[#8A7C63] font-mono truncate">
                              {t.subject || "—"} · {t.plays} lượt · đúng {t.correctAnswers}/{t.questionsOffered}
                            </p>
                          </div>
                          <span className="shrink-0 text-[11px] font-mono text-[#8A7C63]">{t.accuracy}%</span>
                        </div>
                        <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              t.accuracy >= 80 ? "bg-teal" : t.accuracy >= 60 ? "bg-gold" : "bg-ticket"
                            }`}
                            style={{ width: `${Math.max(2, Math.min(100, t.accuracy))}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-[#8A7C63] mt-3">
                    Chỉ gồm các chủ đề đã có từ 5 câu hỏi trở lên. Chọn một học sinh ở trên để xem phân tích chi tiết.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selected && (
        <AiLearningAnalysisPanel
          studentId={selected.id}
          studentLabel={selected.name || selected.username}
        />
      )}

      <AiChatWidget title="Trợ lý AI — hỗ trợ soạn câu hỏi" />
    </div>
  );
}