// ExamResultPage.jsx — kết quả bài thi B1 (spec §10, README §6.10).
// Đọc attempt mới nhất (getLatestAttempt) và TÍNH LẠI gradeExam từ đáp án
// đã lưu để có chi tiết từng câu (attempt không lưu details).
// Writing/Speaking hiển thị đúng "Chưa được đánh giá" theo gradeExam —
// KHÔNG tự bịa điểm (README §0.3).
import { useMemo } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Headphones, Mic,
  PenLine, RotateCcw, SkipForward, Trophy, XCircle,
} from "lucide-react";
import { EnglishB1Shell, QuestionCard } from "../components/index.js";
import { GhostButton } from "../../components/ui";
import { navigate } from "../../lib/router.js";
import { getExam, getLatestAttempt, gradeExam, qkey } from "../services/examService.js";
import { getProgress } from "../services/progressService.js";
import { getSuggestions, hrefFor } from "../services/englishB1Service.js";
import { formatDuration } from "../utils/examTimerUtils.js";

const SKILL_ICONS = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

const SKILL_LABELS = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

export default function ExamResultPage({ userAuth, examId }) {
  const exam = getExam(examId);
  const attempt = exam ? getLatestAttempt(examId) : null;

  const graded = useMemo(
    () => (exam && attempt ? gradeExam(exam, attempt.answers || {}) : null),
    [exam, attempt]
  );

  if (!exam || !attempt || !graded) {
    return (
      <EnglishB1Shell active="exams" title="Chưa có kết quả" userAuth={userAuth}>
        <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2 p-6 text-center space-y-3">
          <p className="font-body text-sm text-[#8A7C63]">
            Chưa có lượt làm bài nào cho đề này trên máy của bạn. Hãy vào làm bài trước,
            kết quả sẽ hiện ở đây ngay sau khi nộp.
          </p>
          <GhostButton onClick={() => navigate("/english-b1/exams")}>
            <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách đề thi</span>
          </GhostButton>
        </div>
      </EnglishB1Shell>
    );
  }

  const answers = attempt.answers || {};
  const suggestions = getSuggestions(getProgress(), 4);
  const detailByKey = new Map(graded.details.map((d) => [d.key, d]));

  return (
    <EnglishB1Shell
      active="exams"
      title={`Kết quả — ${exam.code}`}
      subtitle={exam.name}
      userAuth={userAuth}
    >
      <div className="space-y-5">
        {/* Tổng quan */}
        <div className="rounded-2xl border border-ink/10 bg-paper2 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gold/15 border border-gold/40">
                <Trophy className="w-6 h-6 text-gold" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase text-[#8A7C63]">Điểm phần trắc nghiệm</p>
                <p className="font-display text-3xl font-bold text-ink leading-none">
                  {graded.score}%
                  <span className="ml-2 text-base font-semibold text-[#8A7C63]">≈ {graded.scale}/10</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-body text-ink/85 ml-auto">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal" /> Đúng {graded.correct}</span>
              <span className="inline-flex items-center gap-1.5"><XCircle className="w-4 h-4 text-ticket" /> Sai {graded.wrong}</span>
              <span className="inline-flex items-center gap-1.5"><SkipForward className="w-4 h-4 text-[#8A7C63]" /> Bỏ trống {graded.skipped}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-teal" /> {formatDuration(attempt.durationSec || 0)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs font-body text-[#8A7C63]">
            Nộp lúc {new Date(attempt.at).toLocaleString("vi-VN")} · Điểm chỉ tính trên phần Listening và Reading.
            Writing và Speaking chưa được đánh giá tự động nên không tính vào điểm này.
          </p>
        </div>

        {/* Điểm từng kỹ năng — gradeExam trả sections là object theo sectionId */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {exam.sections.map((section) => {
            const s = graded.sections[section.id] || {};
            const Icon = SKILL_ICONS[section.skill] || BookOpen;
            return (
              <div key={section.id} className="rounded-2xl border border-ink/10 bg-paper2 p-4">
                <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
                  <Icon className="w-4 h-4 text-teal" /> {SKILL_LABELS[section.skill] || section.title}
                </p>
                {s.graded ? (
                  <>
                    <p className="mt-2 font-display text-2xl font-bold text-ink">
                      {s.score}% <span className="text-sm font-semibold text-[#8A7C63]">({s.correct}/{s.total} câu)</span>
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
                      <div className="h-full bg-teal transition-all" style={{ width: `${s.score}%` }} />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2 font-display text-lg font-bold text-gold">Chưa được đánh giá</p>
                    <p className="mt-1 text-xs font-body text-[#8A7C63]">{s.reasonVi}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Xem lại từng phần */}
        {exam.sections.map((section) => {
          const Icon = SKILL_ICONS[section.skill] || BookOpen;
          const secResult = graded.sections[section.id];
          return (
            <section key={section.id} className="space-y-3" aria-label={section.title}>
              <h2 className="font-display text-lg font-semibold text-ink inline-flex items-center gap-2">
                <Icon className="w-5 h-5 text-teal" /> {section.title}
                {secResult?.graded && (
                  <span className="font-mono text-xs font-normal text-[#8A7C63]">
                    đúng {secResult.correct}/{secResult.total}
                  </span>
                )}
              </h2>

              {(section.skill === "listening" || section.skill === "reading") && (
                <div className="space-y-3 max-w-3xl">
                  {(section.questions || []).map((q, i) => {
                    const key = qkey(section.id, q.id);
                    const detail = detailByKey.get(key);
                    return (
                      <QuestionCard
                        key={key}
                        item={q}
                        index={i}
                        total={section.questions.length}
                        given={answers[key]}
                        revealed
                        correct={detail ? detail.ok : undefined}
                        disabled
                      />
                    );
                  })}
                </div>
              )}

              {section.skill === "writing" && (
                <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-3 max-w-3xl">
                  <p className="font-body text-sm text-gold font-semibold">Chưa được đánh giá — {secResult?.reasonVi}</p>
                  <div>
                    <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Đề bài</p>
                    <p className="text-sm font-body text-ink leading-relaxed">{section.promptVi}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Bài viết của bạn</p>
                    {answers["writing:essay"] ? (
                      <p className="text-sm font-body text-ink leading-relaxed whitespace-pre-line rounded-xl border border-ink/10 bg-paper p-3">
                        {answers["writing:essay"]}
                      </p>
                    ) : (
                      <p className="text-sm font-body text-[#8A7C63]">Bạn chưa viết bài cho phần này.</p>
                    )}
                  </div>
                  {section.sampleAnswer && (
                    <div>
                      <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Bài mẫu tham khảo</p>
                      <p className="text-sm font-body text-ink/85 leading-relaxed whitespace-pre-line">{section.sampleAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              {section.skill === "speaking" && (
                <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-2 max-w-3xl">
                  <p className="font-body text-sm text-gold font-semibold">Chưa được đánh giá — {secResult?.reasonVi}</p>
                  <p className="text-sm font-body text-ink leading-relaxed">{section.promptVi}</p>
                  <p className="text-sm font-body text-ink/85">
                    Trạng thái: {answers["speaking:attempted"] ? "Bạn đã ghi âm phần trình bày trong lúc thi." : "Bạn chưa trình bày phần này."}
                  </p>
                  {section.sampleAnswer && (
                    <div>
                      <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Đáp án gợi ý</p>
                      <p className="text-sm font-body text-ink/85 leading-relaxed whitespace-pre-line">{section.sampleAnswer}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}

        {/* Đề xuất ôn tập */}
        {suggestions.length > 0 && (
          <div className="rounded-2xl border border-teal/25 bg-paper2 p-4">
            <p className="font-display font-semibold text-ink mb-2">Đề xuất ôn tập tiếp theo</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
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

        <div className="flex flex-wrap gap-2">
          <GhostButton onClick={() => navigate("/english-b1/exams")}>
            <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách đề thi</span>
          </GhostButton>
          <GhostButton onClick={() => navigate(hrefFor("exam", exam.id))}>
            <span className="inline-flex items-center gap-1"><RotateCcw className="w-4 h-4" /> Làm lại đề này</span>
          </GhostButton>
          <GhostButton onClick={() => navigate("/english-b1/progress")}>
            Xem tiến độ tổng thể
          </GhostButton>
        </div>
      </div>
    </EnglishB1Shell>
  );
}
