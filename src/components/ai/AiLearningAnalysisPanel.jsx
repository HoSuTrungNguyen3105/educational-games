// components/ai/AiLearningAnalysisPanel.jsx
//
// Hiển thị báo cáo phân tích học tập từ AI Service.
//
// Ranh giới trách nhiệm (rất quan trọng khi đọc file này):
//   metrics        → do BACKEND tính từ dữ liệu thật, đây là phần đáng tin.
//   summary/…      → do AI diễn giải, có thể sai. Vì vậy UI luôn hiện `disclaimer`
//                    và gắn nhãn rõ cho từng khối, không trộn hai nguồn với nhau.

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

  const inputCls =
    "w-full note-card px-3 py-2 text-sm border-ink/10 focus:border-ticket";

  return (
    <div className="space-y-4">
      <div className="note-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-display text-xl text-ink">📊 Phân tích kết quả học tập</h2>
            <p className="text-sm text-[#8A7C63] mt-0.5">
              {studentLabel
                ? `Dữ liệu của ${studentLabel}`
                : "Số liệu lấy từ lượt chơi đã được hệ thống chấm điểm."}
            </p>
          </div>
          <PrimaryButton onClick={load} disabled={busy}>
            {busy ? "Đang phân tích…" : report ? "Phân tích lại" : "Phân tích"}
          </PrimaryButton>
        </div>

        <div className="flex items-end gap-3 flex-wrap">
          <label className="block">
            <span className="block text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Từ ngày</span>
            <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="block text-[11px] font-mono uppercase text-[#8A7C63] mb-1">Đến ngày</span>
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={inputCls} />
          </label>
          {(from || to) && (
            <GhostButton
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="!py-2 !px-4"
            >
              Bỏ lọc
            </GhostButton>
          )}
        </div>
      </div>

      {error && (
        <div className="note-card p-6 text-center">
          <p className="font-display text-lg text-ticket">{error}</p>
          {hint && <p className="text-sm text-[#8A7C63] mt-1">{hint}</p>}
          <div className="mt-4 flex justify-center">
            <PrimaryButton onClick={load} disabled={busy}>Thử lại</PrimaryButton>
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
          {/* ── Số liệu: nguồn sự thật do backend tính ───────────────────── */}
          <div className="note-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <h3 className="font-display text-lg text-ink">Số liệu</h3>
              <span className="text-[10px] font-mono uppercase text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1">
                Do hệ thống tính
              </span>
            </div>

            <StatGrid
              stats={[
                { icon: "🎮", value: report.metrics.totalPlays, label: "lượt chơi" },
                { icon: "✅", value: `${report.metrics.accuracy}%`, label: "tỷ lệ đúng" },
                { icon: "📚", value: report.metrics.totalQuestionsOffered, label: "câu đã đưa ra" },
                { icon: "⭐", value: Math.round(report.metrics.totalXp), label: "XP" },
              ]}
            />

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#8A7C63] font-mono">
              <span>Điểm TB {Math.round(report.metrics.averageScore)}</span>
              <span>·</span>
              <span>Thời gian TB {Math.round(report.metrics.averageCompletionTimeSeconds)}s</span>
              {report.metrics.periodFrom && (
                <>
                  <span>·</span>
                  <span>
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
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold border rounded-full px-2.5 py-1 ${t.cls}`}>
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

          {/* ── Theo chủ đề ────────────────────────────────────────────── */}
          {report.metrics.topics?.length > 0 && (
            <div className="note-card p-5 sm:p-6">
              <h3 className="font-display text-lg text-ink mb-3">Theo chủ đề</h3>
              <ul className="space-y-2">
                {report.metrics.topics.map((t, i) => (
                  <li key={`${t.gameId || "x"}-${i}`} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink truncate">
                        {t.topic || t.gameName || "Chủ đề chưa xác định"}
                      </p>
                      <p className="text-[11px] text-[#8A7C63] font-mono">
                        {t.subject || "—"} · {t.plays} lượt · đúng {t.correctAnswers}/{t.questionsOffered}
                      </p>
                    </div>
                    <div className="shrink-0 w-28 sm:w-36">
                      <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            t.accuracy >= 80 ? "bg-teal" : t.accuracy >= 60 ? "bg-gold" : "bg-ticket"
                          }`}
                          style={{ width: `${Math.max(2, Math.min(100, t.accuracy))}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-[#8A7C63] text-right mt-0.5">
                        {t.accuracy}%
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Nhận xét của AI ─────────────────────────────────────────── */}
          <div className="note-card p-5 sm:p-6 border-l-4 border-l-violet-500">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <h3 className="font-display text-lg text-ink">Nhận xét của AI</h3>
              <span className="text-[10px] font-mono uppercase text-violet-700 bg-violet-100 border border-violet-200 rounded-full px-2.5 py-1">
                AI diễn giải
              </span>
            </div>

            {report.summary && (
              <p className="text-sm text-ink leading-relaxed mb-4">{report.summary}</p>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <InsightList title="Điểm mạnh" items={report.strengths} tone="teal" icon="✅" />
              <InsightList title="Cần cải thiện" items={report.areasToImprove} tone="ticket" icon="⚠️" />
              <InsightList title="Gợi ý ôn tập" items={report.recommendations} tone="gold" icon="🎯" />
            </div>

            {report.encouragement && (
              <p className="mt-4 text-sm font-semibold text-teal bg-teal/10 border border-teal/20 rounded-xl px-3 py-2">
                {report.encouragement}
              </p>
            )}

            {!report.dataSufficient && (
              <p className="mt-3 text-[11px] text-[#8a6a10] bg-gold/15 border border-gold/40 rounded-lg px-2.5 py-1.5 leading-relaxed">
                ⚠ Dữ liệu còn ít — chưa nên kết luận học sinh mạnh hay yếu ở một chủ đề.
              </p>
            )}

            {report.disclaimer && (
              <p className="mt-3 text-[11px] text-[#8A7C63] leading-relaxed">{report.disclaimer}</p>
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
            <li key={i} className="text-[12px] text-ink leading-relaxed">
                • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}