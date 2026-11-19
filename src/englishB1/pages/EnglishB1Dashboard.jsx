// EnglishB1Dashboard.jsx — trang Tổng quan của phân hệ English B1 (spec §3.1).
// Mọi con số lấy từ englishB1Service.getDashboard(progress) — tính từ tiến độ
// thật trong localStorage, không bịa số khi chưa học.
import {
  BookOpen, SpellCheck, Headphones, Mic, Newspaper, PenLine,
  ClipboardCheck, Timer, Flame, Clock, Target, TrendingUp,
  TrendingDown, PlayCircle, Lightbulb, History, GraduationCap,
} from "lucide-react";
import { EnglishB1Shell, ProgressChart } from "../components/index.js";
import { PrimaryButton } from "../../components/ui";
import { navigate } from "../../lib/router.js";
import { useEnglishB1Progress } from "../services/progressService.js";
import { getDashboard, getRecentActivity } from "../services/englishB1Service.js";
import { useStudySeconds } from "./pageUtils.js";

const MODULE_CARDS = [
  { key: "vocabulary", label: "Học từ vựng", desc: "15 chủ đề · flashcard & ôn theo SRS", icon: BookOpen, path: "/english-b1/vocabulary" },
  { key: "grammar", label: "Học ngữ pháp", desc: "20 chuyên đề kèm bài tập có giải thích", icon: SpellCheck, path: "/english-b1/grammar" },
  { key: "listening", label: "Luyện Listening", desc: "10 bài nghe · Practice & Exam mode", icon: Headphones, path: "/english-b1/listening" },
  { key: "speaking", label: "Luyện Speaking", desc: "23 chủ đề 3 phần thi · ghi âm tự luyện", icon: Mic, path: "/english-b1/speaking" },
  { key: "reading", label: "Luyện Reading", desc: "10 bài đọc hiểu có vị trí đáp án", icon: Newspaper, path: "/english-b1/reading" },
  { key: "writing", label: "Luyện Writing", desc: "16 đề viết · chấm theo bộ quy tắc", icon: PenLine, path: "/english-b1/writing" },
  { key: "exams", label: "Luyện đề B1", desc: "5 đề tổng hợp đủ 4 kỹ năng", icon: ClipboardCheck, path: "/english-b1/exams" },
  { key: "mock", label: "Thi thử B1", desc: "Đề thi thử có đồng hồ như thi thật", icon: Timer, path: "/english-b1/exams?type=mock" },
];

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-[#8A7C63]">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs font-body text-[#8A7C63]">{sub}</p>}
    </div>
  );
}

export default function EnglishB1Dashboard({ userAuth }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();
  const d = getDashboard(progress);
  const recent = getRecentActivity(progress, 8);
  const started = d.lessonsStudied > 0 || d.questionsPracticed > 0;
  const chartPoints = d.history.filter((h) => !h.empty).map((h) => ({ label: h.label, value: h.score }));

  return (
    <EnglishB1Shell
      active="dashboard"
      title="Tổng quan"
      subtitle="Học tiếng Anh và luyện thi chứng chỉ B1"
      userAuth={userAuth}
      streak={d.streakDays}
    >
      <div className="space-y-6">
        {/* Trạng thái bắt đầu khi chưa có dữ liệu */}
        {!started && (
          <div className="rounded-2xl border border-teal/30 bg-teal/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <GraduationCap className="w-8 h-8 text-teal shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink">Chào mừng bạn đến với English B1!</p>
              <p className="text-sm font-body text-ink/75">
                Bạn chưa học bài nào. Hãy bắt đầu bằng một chủ đề từ vựng hoặc một chuyên đề ngữ pháp —
                tiến độ được lưu ngay trên máy này và không mất khi tải lại trang.
              </p>
            </div>
            <PrimaryButton onClick={() => navigate("/english-b1/vocabulary")}>
              Bắt đầu học
            </PrimaryButton>
          </div>
        )}

        {/* Chỉ số chính (spec §3.1) */}
        <section aria-label="Chỉ số học tập">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Cấp độ hiện tại" value={d.level} sub="Chuẩn CEFR" />
            <StatCard label="Bài đã học" value={d.lessonsStudied} sub={`/${d.totals.grammar + d.totals.listening + d.totals.reading + d.totals.writing + d.totals.speaking} bài toàn khóa`} />
            <StatCard label="Câu đã luyện" value={d.questionsPracticed} sub={started ? `Đúng ${d.correctAnswers} câu (${d.accuracyPercent}%)` : "Chưa luyện câu nào"} />
            <StatCard label="Điểm trung bình" value={started ? `${d.avgScore}%` : "—"} sub={started ? "Các kỹ năng có điểm" : "Chưa có điểm"} />
            <StatCard
              label="Ngày học liên tục"
              value={d.streakDays}
              sub={d.activeToday ? "Hôm nay đã học" : "Hôm nay chưa học"}
            />
            <StatCard label="Thời gian học" value={`${d.studyMinutes} phút`} sub={`Đã làm ${d.examsDone} đề thi`} />
          </div>

          {/* Tiến độ khóa học */}
          <div className="mt-3 rounded-2xl border border-ink/10 bg-paper2 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-sm font-body font-semibold text-ink">
                <Target className="w-4 h-4 text-teal" /> Tiến độ hoàn thành khóa học
              </p>
              <span className="font-mono text-sm font-bold text-ink">{d.coursePercent}%</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
              <div className="h-full bg-teal transition-all" style={{ width: `${d.coursePercent}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-ink/[0.03] border border-ink/10 px-3 py-2.5 flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-teal shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Kỹ năng mạnh nhất</p>
                  <p className="text-sm font-body font-semibold text-ink truncate">
                    {d.strongestSkill ? `${d.strongestSkill.label} · ${d.strongestSkill.percent}%` : "Chưa đủ dữ liệu"}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-ink/[0.03] border border-ink/10 px-3 py-2.5 flex items-center gap-2.5">
                <TrendingDown className="w-5 h-5 text-ticket shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Kỹ năng cần cải thiện</p>
                  <p className="text-sm font-body font-semibold text-ink truncate">
                    {d.weakestSkill ? `${d.weakestSkill.label} · ${d.weakestSkill.percent}%` : "Chưa đủ dữ liệu"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tiếp tục + mục tiêu ngày */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3" aria-label="Tiếp tục học và mục tiêu">
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <PlayCircle className="w-5 h-5 text-teal" /> Tiếp tục bài học gần nhất
            </p>
            {d.continueLesson ? (
              <div className="mt-2">
                <p className="text-sm font-body text-ink">
                  <span className="text-[#8A7C63]">{d.continueLesson.kindLabel}:</span> {d.continueLesson.title}
                </p>
                <PrimaryButton className="mt-3" onClick={() => navigate(d.continueLesson.href)}>
                  Học tiếp
                </PrimaryButton>
              </div>
            ) : (
              <p className="mt-2 text-sm font-body text-[#8A7C63]">
                Chưa có bài học nào. Chọn một thẻ chức năng bên dưới để bắt đầu.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <Flame className="w-5 h-5 text-ticket" /> Mục tiêu học tập hôm nay
            </p>
            <p className="mt-2 text-sm font-body text-ink">
              Đã luyện <b>{d.dailyGoal.done}</b>/{d.dailyGoal.target} câu
              {d.dailyGoal.finished ? " — đã đạt mục tiêu, tuyệt vời!" : " — cố lên một chút nữa!"}
            </p>
            <div className="mt-2 h-2.5 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
              <div className="h-full bg-gold transition-all" style={{ width: `${d.dailyGoal.percent}%` }} />
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-body text-[#8A7C63]">
              <Clock className="w-3.5 h-3.5" /> Hôm nay đã làm đúng {d.dailyGoal.correct} câu.
            </p>
          </div>
        </section>

        {/* 8 thẻ chức năng */}
        <section aria-label="Chức năng học tập">
          <h2 className="font-display text-base font-semibold text-ink mb-3">Học & luyện thi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MODULE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="text-left rounded-2xl border border-ink/10 bg-paper2 p-4 transition hover:border-teal/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal/10 text-teal">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="block mt-2.5 font-display font-semibold text-ink">{card.label}</span>
                  <span className="block mt-0.5 text-xs font-body text-[#8A7C63]">{card.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Đề xuất + lịch sử */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3" aria-label="Đề xuất và lịch sử">
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <Lightbulb className="w-5 h-5 text-gold" /> Bài học được đề xuất
            </p>
            {d.suggestions.length ? (
              <ul className="mt-3 space-y-2">
                {d.suggestions.map((s) => (
                  <li key={s.href}>
                    <button
                      type="button"
                      onClick={() => navigate(s.href)}
                      className="w-full text-left rounded-xl border border-ink/10 bg-paper px-3 py-2.5 transition hover:border-teal/50"
                    >
                      <span className="block text-sm font-body font-semibold text-ink">{s.title}</span>
                      <span className="block text-xs font-body text-[#8A7C63]">{s.reasonVi}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm font-body text-[#8A7C63]">Chưa có đề xuất — hãy học bài đầu tiên.</p>
            )}
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <History className="w-5 h-5 text-teal" /> Lịch sử luyện tập
            </p>
            <div className="mt-3">
              <ProgressChart
                points={chartPoints}
                type="line"
                height={140}
                ariaLabel="Điểm trung bình theo ngày trong 14 ngày gần nhất"
                emptyLabel="Chưa có dữ liệu điểm theo ngày"
              />
            </div>
            {recent.length ? (
              <ul className="mt-3 space-y-1.5">
                {recent.slice(0, 5).map((a, i) => (
                  <li key={`${a.at}-${i}`} className="flex items-center gap-2 text-sm font-body">
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-ink/5 text-[10px] font-mono uppercase text-[#8A7C63]">
                      {a.kindLabel}
                    </span>
                    <span className="flex-1 min-w-0 truncate text-ink">{a.label}</span>
                    {a.grade && <span className="shrink-0 text-xs font-mono text-teal">{a.score}%</span>}
                    <span className="shrink-0 text-[11px] font-mono text-[#8A7C63]">{a.dateLabel}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm font-body text-[#8A7C63]">Chưa có hoạt động nào được ghi lại.</p>
            )}
          </div>
        </section>
      </div>
    </EnglishB1Shell>
  );
}
