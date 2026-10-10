// components/ai/AiLearningAnalysisPanel.jsx
//
// Hiển thị báo cáo phân tích học tập từ AI Service.
//
// Ranh giới trách nhiệm (rất quan trọng khi đọc file này):
//   metrics        → do BACKEND tính từ dữ liệu thật, đây là phần đáng tin.
//   summary/…      → do AI diễn giải, có thể sai. Vì vậy UI luôn hiện `disclaimer`
//                    và gắn nhãn rõ cho từng khối, không trộn hai nguồn với nhau.
//
// Mobile: bố cục 1 cột, touch target ≥ 44px, input dùng text-base để iOS không zoom,
// mọi khối bọc `break-words` để chuỗi dài không làm vỡ layout.

import { useState } from "react";
import { analyzeLearning } from "../../services/aiApi.js";
import { aiErrorHint, aiErrorText } from "./aiErrorText.js";
import { GhostButton, Loader, PrimaryButton, StatGrid } from "../ui.jsx";

const TREND_LABEL = {
  improving: { text: "Đang tiến bộ", cls: "bg-teal/10 text-teal border-teal/20" },
  declining: { text: "Cần chú ý", cls: "bg-ticket/10 text-ticket border-ticket/20" },
  stable: { text: "Ổn định", cls: "bg-gold/15 text-[#8a6a10] border-gold/40" },
  unknown: { text: "Chưa đủ dữ liệu", cls: "bg-ink/5 text-[#8A7C63] border-ink/10" },
};

/** text-base trên mobile để iOS không tự zoom khi focus vào input. */
const inputCls =
  "w-full note-card px-3 py-2 text-base sm:text-sm border-ink/10 focus:border-ticket";

/**
 * @param {object} p
 * @param {string} [p.studentId]  để trống = chính mình. Chỉ giáo viên/admin xem được người khác.
 * @param {string} [p.studentLabel] nhãn hiển thị cho giáo viên
 */
export default function AiLearningAnalysisPanel({ studentId, studentLabel }) {
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function load() {
    setError(null);
    setHint(null);
    setBusy(true);
    try {
      const res = await analyzeLearning({ studentId: studentId || undefined, from, to });
      setReport(res);
    } catch (e) {
      setError(aiErrorText(e));
      setHint(aiErrorHint(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Bộ lọc ─────────────────────────────────────────────────── */}
      <div className="note-card p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg sm:text-xl text-ink break-words">
              📊 Phân tích kết quả học tập
            </h2>
            <p className="text-xs sm:text-sm text-[#8A7C63] mt-0.5 break-words">
              {studentLabel
                ? `Dữ liệu của ${studentLabel}`
                : "Số liệu lấy từ lượt chơi đã được hệ thống chấm điểm."}
            </p>
          </div>
          <PrimaryButton onClick={load} disabled={busy} className="w-full sm:w-auto shrink-0">
            {busy ? "Đang phân tích…" : report ? "Phân tích lại" : "Phân tích"}
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="block min-w-0">
            <span className="block text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Từ ngày</span>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block min-w-0">
            <span className="block text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Đến ngày</span>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
              className={inputCls}
            />
          </label>
          {(from || to) && (
            <GhostButton
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="w-full sm:w-auto"
            >
              Bỏ lọc
            </GhostButton>
          )}
        </div>
      </div>

      {error && (
        <div className="note-card p-6 text-center">
          <p className="font-display text-base sm:text-lg text-ticket break-words">{error}</p>
          {hint && <p className="text-xs sm:text-sm text-[#8A7C63] mt-1 break-words">{hint}</p>}
          <div className="mt-4 flex justify-center">
            <PrimaryButton onClick={load} disabled={busy}>
              Thử lại
            </PrimaryButton>
          </div>
        </div>
      )}

      {busy && !report && (
        <div className="flex justify-center py-10">
          <Loader label="AI đang đọc số liệu và diễn giải…" />
        </div>
      )}

      {report && !report.metrics.totalPlays && (
        <div className="note-card p-8 text-center">
          <div className="text-4xl mb-2 float-slow">📚</div>
          <p className="font-display text-lg text-ink">Chưa có lượt chơi nào</p>
          <p className="text-sm text-[#8A7C63] mt-1">
            Hãy chơi vài ván rồi quay lại — hệ thống cần dữ liệu thật để phân tích.
          </p>
        </div>
      )}

      {report && report.metrics.totalPlays > 0 && (
        <>
          {/* ── Số liệu: nguồn sự thật do backend tính ─────────────────── */}
          <div className="note-card p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-display text-base sm:text-lg text-ink">Số liệu</h3>
              <span className="text-[10px] font-mono uppercase text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1 shrink-0">
                Do hệ thống tính
              </span>
            </div>

            <StatGrid
              stats={[
                { icon: "🎮", value: report.metrics.totalPlays, label: "lượt chơi" },
                { icon: "✅", value: `${report.metrics.accuracy}%`, label: "tỷ lệ đúng" },
                { icon: "📚", value: report.metrics.totalQuestionsOffered, label: "câu đưa ra" },
                { icon: "⭐", value: Math.round(report.metrics.totalXp), label: "XP" },
              ]}
            />

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8A7C63] font-mono">
              <span>Điểm TB {Math.round(report.metrics.averageScore)}</span>
              <span aria-hidden>·</span>
              <span>Thời gian TB {Math.round(report.metrics.averageCompletionTimeSeconds)}s</span>
              {report.metrics.periodFrom && (
                <>
                  <span aria-hidden>·</span>
                  <span className="break-all">
                    {report.metrics.periodFrom} → {report.metrics.periodTo}
                  </span>
                </>
              )}
            </div>

            {report.metrics.trend?.accuracyDelta != null && (
              <div className="mt-3">
                {(() => {
                  const t = TREND_LABEL[report.metrics.trend.direction] || TREND_LABEL.unknown;
                  const delta = report.metrics.trend.accuracyDelta;
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold border rounded-full px-2.5 py-1.5 ${t.cls}`}
                    >
                      {t.text}
                      <span className="font-mono">
                        ({delta > 0 ? "+" : ""}
                        {delta} điểm)
                      </span>
                    </span>
                  );
                })()}
              </div>
            )}
          </div>

          {/* ── Theo chủ đề ──────────────────────────────────────────── */}
          {report.metrics.topics?.length > 0 && (
            <div className="note-card p-4 sm:p-5 lg:p-6">
              <h3 className="font-display text-base sm:text-lg text-ink mb-3">Theo chủ đề</h3>
              <ul className="space-y-3">
                {report.metrics.topics.map((t, i) => (
                  <li key={`${t.gameId || "x"}-${i}`} className="min-w-0">
                    <div className="flex items-end justify-between gap-3 mb-1">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {t.topic || t.gameName || "Chủ đề chưa xác định"}
                        </p>
                        <p className="text-[11px] text-[#8A7C63] font-mono truncate">
                          {t.subject || "—"} · {t.plays} lượt · đúng {t.correctAnswers}/
                          {t.questionsOffered}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] font-mono text-[#8A7C63]">
                        {t.accuracy}%
                      </span>
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
            </div>
          )}

          {/* ── Nhận xét của AI ──────────────────────────────────────── */}
          <div className="note-card p-4 sm:p-5 lg:p-6 border-l-4 border-l-violet-500">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-base sm:text-lg text-ink">Nhận xét của AI</h3>
              <span className="text-[10px] font-mono uppercase text-violet-700 bg-violet-100 border border-violet-200 rounded-full px-2.5 py-1 shrink-0">
                AI diễn giải
              </span>
            </div>

            {report.summary && (
              <p className="text-sm text-ink leading-relaxed mb-4 break-words">{report.summary}</p>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InsightList title="Điểm mạnh" items={report.strengths} tone="teal" icon="✅" />
              <InsightList title="Cần cải thiện" items={report.areasToImprove} tone="ticket" icon="⚠️" />
              <InsightList title="Gợi ý ôn tập" items={report.recommendations} tone="gold" icon="🎯" />
            </div>

            {report.encouragement && (
              <p className="mt-4 text-sm font-semibold text-teal bg-teal/10 border border-teal/20 rounded-xl px-3 py-2.5 break-words">
                {report.encouragement}
              </p>
            )}

            {!report.dataSufficient && (
              <p className="mt-3 text-[11px] text-[#8a6a10] bg-gold/15 border border-gold/40 rounded-lg px-2.5 py-2 leading-relaxed">
                ⚠ Dữ liệu còn ít — chưa nên kết luận học sinh mạnh hay yếu ở một chủ đề.
              </p>
            )}

            {report.disclaimer && (
              <p className="mt-3 text-[11px] text-[#8A7C63] leading-relaxed break-words">
                {report.disclaimer}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const TONES = {
  teal: "bg-teal/5 border-teal/15 text-teal",
  ticket: "bg-ticket/5 border-ticket/15 text-ticket",
  gold: "bg-gold/10 border-gold/30 text-[#8a6a10]",
};

function InsightList({ title, items, tone, icon }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  return (
    <div className={`rounded-2xl border p-3 ${TONES[tone]}`}>
      <p className="text-[11px] font-mono uppercase font-bold mb-2">
        {icon} {title}
      </p>
      {list.length === 0 ? (
        <p className="text-[11px] opacity-70">Chưa có nội dung</p>
      ) : (
        <ul className="space-y-1.5">
          {list.map((item, i) => (
            <li key={i} className="text-[12px] text-ink leading-relaxed break-words">
                • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}