// ProgressPage.jsx — báo cáo tiến độ English B1 (spec §12): tổng quan học
// tập, biểu đồ hoạt động/điểm, phân tích kỹ năng mạnh–yếu, đề xuất bài tiếp
// theo. Mọi số liệu lấy từ englishB1Service.getProgressReport() — không tự
// tính lại ở trang.
import { useState } from "react";
import {
  ArrowRight, BarChart3, BookOpen, Clock, Eraser, Flame, LineChart,
  Sparkles, Target, TrendingDown, TrendingUp, Trophy,
} from "lucide-react";
import { EnglishB1Shell, ProgressChart } from "../components/index.js";
import { GhostButton, ConfirmModal } from "../../components/ui";
import { navigate } from "../../lib/router.js";
import {
  useEnglishB1Progress, resetProgress,
} from "../services/progressService.js";
import { getProgressReport, hrefFor } from "../services/englishB1Service.js";
import { formatDuration } from "../utils/examTimerUtils.js";

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
      <div className="flex items-center gap-2 text-[#8A7C63]">
        <Icon className="w-4 h-4 text-teal" />
        <span className="font-mono text-[11px] uppercase">{label}</span>
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="text-xs font-body text-[#8A7C63]">{hint}</p>}
    </div>
  );
}

export default function ProgressPage({ userAuth, showToast }) {
  useEnglishB1Progress(); // re-render khi progress đổi / sau reset
  const [confirmReset, setConfirmReset] = useState(false);
  const report = getProgressReport();
  const streak = report.streakDays;

  const activeDays = report.history.filter((d) => d.count > 0);
  const activityPoints = activeDays.map((d) => ({
    label: d.label,
    value: Math.round(d.minutes),
  }));
  const scorePoints = activeDays
    .filter((d) => d.accuracy !== null)
    .map((d) => ({ label: d.label, value: d.accuracy }));

  return (
    <EnglishB1Shell
      active="progress"
      title="Tiến độ học tập"
      subtitle="Tổng hợp toàn bộ quá trình học English B1 trên máy này"
      userAuth={userAuth}
      streak={streak}
    >
      <div className="space-y-5">
        {/* Thống kê tổng */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Clock} label="Thời gian học" value={formatDuration(report.studyMinutes * 60)} hint="Tổng từ khi bắt đầu" />
          <StatCard icon={BookOpen} label="Bài đã hoàn thành" value={report.lessonsDone} hint="Ngữ pháp · Nghe · Đọc" />
          <StatCard icon={Trophy} label="Đề thi" value={`${report.examsDone} đề`} hint={`${report.examAttempts} lượt làm · cao nhất ${report.examBest}%`} />
          <StatCard icon={Target} label="Độ chính xác" value={`${report.accuracyPercent}%`} hint={`${report.questionsTotal} câu đã làm`} />
          <StatCard icon={BarChart3} label="Điểm TB bài tập" value={`${report.avgScore}%`} hint="Trên các bài đã nộp" />
          <StatCard icon={Flame} label="Chuỗi ngày học" value={`${streak} ngày`} hint={streak > 0 ? "Giữ nhịp học đều nhé!" : "Học hôm nay để bắt đầu chuỗi"} />
          <StatCard icon={TrendingUp} label="Tiến độ khóa học" value={`${report.coursePercent}%`} hint="Theo toàn bộ nội dung B1" />
          <StatCard icon={BookOpen} label="Mục tiêu hôm nay" value={`${report.dailyGoal.done}/${report.dailyGoal.target}`} hint={report.dailyGoal.label} />
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink mb-3">
              <BarChart3 className="w-4 h-4 text-teal" /> Thời gian học 30 ngày gần đây (phút/ngày)
            </p>
            <ProgressChart
              points={activityPoints}
              type="bar"
              height={180}
              ariaLabel="Biểu đồ thời gian học theo ngày"
              emptyLabel="Chưa có dữ liệu — hãy học một bài để bắt đầu."
            />
          </div>
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink mb-3">
              <LineChart className="w-4 h-4 text-teal" /> Tỷ lệ trả lời đúng theo ngày (%)
            </p>
            <ProgressChart
              points={scorePoints}
              type="line"
              height={180}
              ariaLabel="Biểu đồ tỷ lệ trả lời đúng theo ngày"
              emptyLabel="Chưa có ngày nào có câu trả lời được ghi nhận."
            />
          </div>
        </div>

        {/* Tiến độ theo nội dung */}
        <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
          <p className="font-display font-semibold text-ink mb-3">Tiến độ theo nội dung</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {report.progressBars.map((bar) => (
              <div key={bar.key}>
                <div className="flex items-center justify-between gap-2 text-sm font-body">
                  <span className="text-ink">{bar.label}</span>
                  <span className="font-mono text-xs text-[#8A7C63]">{bar.done}/{bar.total} · {bar.percent}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-teal transition-all" style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phân tích kỹ năng */}
        <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-3">
          <p className="font-display font-semibold text-ink">Phân tích kỹ năng</p>
          {(report.strongest || report.weakest) && (
            <div className="flex flex-wrap gap-2 text-sm font-body">
              {report.strongest && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/30 text-teal">
                  <TrendingUp className="w-4 h-4" /> Mạnh nhất: {report.strongest.label} ({report.strongest.percent}%)
                </span>
              )}
              {report.weakest && report.weakest.key !== report.strongest?.key && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ticket/10 border border-ticket/30 text-ticket">
                  <TrendingDown className="w-4 h-4" /> Cần luyện thêm: {report.weakest.label} ({report.weakest.percent}%)
                </span>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {report.skills.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between gap-2 text-sm font-body">
                  <span className="text-ink">{s.label}</span>
                  <span className="font-mono text-xs text-[#8A7C63]">
                    {s.scored ? `${s.percent}%` : "Chưa có điểm"}
                  </span>
                </div>
                {s.scored ? (
                  <div className="mt-1 h-2 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
                    <div className="h-full bg-teal transition-all" style={{ width: `${s.percent}%` }} />
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs font-body text-[#8A7C63]">{s.detailVi} {s.hintVi}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Đề xuất */}
        {report.suggestions.length > 0 && (
          <div className="rounded-2xl border border-teal/25 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink mb-2">
              <Sparkles className="w-4 h-4 text-gold" /> Bài học đề xuất tiếp theo
            </p>
            <div className="flex flex-wrap gap-2">
              {report.suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigate(hrefFor(s.kind, s.refId))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-ink/15 text-sm font-body text-ink transition hover:border-teal/60 hover:bg-teal/5"
                >
                  {s.label} <ArrowRight className="w-3.5 h-3.5 text-teal" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Vùng nguy hiểm */}
        <div className="rounded-2xl border border-dashed border-ticket/40 bg-paper2 p-4 flex flex-wrap items-center gap-3">
          <div>
            <p className="font-display font-semibold text-ink">Xóa toàn bộ tiến độ</p>
            <p className="text-xs font-body text-[#8A7C63]">
              Xóa mọi dữ liệu học English B1 đã lưu trên máy này (từ vựng, bài làm, điểm thi…). Không thể khôi phục.
            </p>
          </div>
          <GhostButton className="ml-auto !border-ticket/50 !text-ticket" onClick={() => setConfirmReset(true)}>
            <span className="inline-flex items-center gap-1"><Eraser className="w-4 h-4" /> Xóa tiến độ</span>
          </GhostButton>
        </div>
      </div>

      <ConfirmModal
        open={confirmReset}
        title="Xóa toàn bộ tiến độ English B1?"
        message="Mọi dữ liệu học tập (từ vựng đã học, điểm bài tập, lịch sử thi, bản ghi nói, bài viết) trên máy này sẽ bị xóa vĩnh viễn."
        confirmLabel="Xóa hết"
        onConfirm={() => {
          resetProgress();
          setConfirmReset(false);
          showToast("Đã xóa toàn bộ tiến độ English B1.", "success");
        }}
        onClose={() => setConfirmReset(false)}
      />
    </EnglishB1Shell>
  );
}
