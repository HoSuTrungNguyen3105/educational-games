// pages/teacher/AiStudentAnalysisPage.jsx
//
// Trang phân tích kết quả học tập cho GIÁO VIÊN.
//
// Giáo viên chọn học sinh rồi xem báo cáo. Backend tự kiểm tra quyền: học sinh gửi
// studentId của người khác sẽ bị từ chối 403, không phải kiểm tra ở frontend.

import { useState } from "react";
import AiChatWidget from "../../components/ai/AiChatWidget.jsx";
import AiLearningAnalysisPanel from "../../components/ai/AiLearningAnalysisPanel.jsx";
import { GhostButton, PrimaryButton } from "../../components/ui.jsx";
import { userService } from "../../services/api.js";

export default function AiStudentAnalysisPage() {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

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
      const list = (await userService.search(q)) || [];
      setCandidates(list);
    } catch (e2) {
      setError(e2?.message || "Không tìm được danh sách học sinh.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="font-display text-3xl text-ink">🤖 Phân tích AI</h1>
        <p className="text-sm text-[#8A7C63] mt-1">
          Số liệu do hệ thống tính từ lượt chơi thật, phần nhận xét do AI diễn giải.
        </p>
      </div>

      <div className="note-card p-5 sm:p-6">
        <form onSubmit={search} className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[200px] block">
            <span className="block text-[11px] font-mono uppercase text-[#8A7C63] mb-1">
              Tìm học sinh
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tên hoặc tên đăng nhập…"
              className="w-full note-card px-4 py-2.5 text-sm border-ink/10 focus:border-ticket"
            />
          </label>
          <PrimaryButton onClick={search} disabled={busy} className="!py-2.5">
            {busy ? "Đang tìm…" : "Tìm"}
          </PrimaryButton>
          {selected && (
            <GhostButton
              onClick={() => {
                setSelected(null);
                setCandidates(null);
              }}
              className="!py-2.5"
            >
              Bỏ chọn
            </GhostButton>
          )}
        </form>

        {error && (
          <div className="mt-3 rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2">
            <p className="text-xs text-ticket">{error}</p>
          </div>
        )}

        {candidates && candidates.length === 0 && (
          <p className="mt-4 text-sm text-[#8A7C63]">Không tìm thấy học sinh nào.</p>
        )}

        {candidates && candidates.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {candidates.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => setSelected(u)}
                  className={`w-full text-left note-card px-4 py-3 transition hover:border-gold/60 ${
                    selected?.id === u.id ? "border-gold ring-2 ring-gold/25" : "border-ink/10"
                  }`}
                >
                  <span className="font-semibold text-ink text-sm">
                    {u.name || u.username}
                  </span>
                  <span className="text-[11px] text-[#8A7C63] font-mono ml-2">
                    {u.username} · {u.role}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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