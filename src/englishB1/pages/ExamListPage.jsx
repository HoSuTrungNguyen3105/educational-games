// ExamListPage.jsx — danh sách đề thi B1 (spec §10): mã, tên, cấp độ, phân
// loại, độ khó, số câu, thời gian, trạng thái làm bài + điểm cao nhất.
import { useState } from "react";
import { ArrowRight, Clock, FileQuestion, Filter, Trophy } from "lucide-react";
import { EnglishB1Shell } from "../components/index.js";
import { navigate } from "../../lib/router.js";
import {
  listExams, EXAM_TYPES, DIFFICULTY_LABELS, examTypeLabel,
} from "../services/examService.js";
import { useEnglishB1Progress } from "../services/progressService.js";
import { hrefFor } from "../services/englishB1Service.js";
import { getHashParam, useStudySeconds } from "./pageUtils.js";

export default function ExamListPage({ userAuth }) {
  useStudySeconds();
  useEnglishB1Progress(); // re-render khi có attempt mới
  const [filter, setFilter] = useState(() => getHashParam("type") || "all");
  const exams = listExams();
  const visible = filter === "all" ? exams : exams.filter((e) => e.type === filter);

  return (
    <EnglishB1Shell
      active="exams"
      title="Đề thi & Thi thử"
      subtitle="5 đề B1 đầy đủ 4 kỹ năng · Writing/Speaking hiển thị “chưa được đánh giá”"
      userAuth={userAuth}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo phân loại đề">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body border transition ${
              filter === "all" ? "bg-ink text-paper border-ink font-semibold" : "border-ink/15 text-ink hover:border-ink/40"
            }`}
          >
            <Filter className="w-4 h-4" /> Tất cả ({exams.length})
          </button>
          {EXAM_TYPES.map((t) => {
            const count = exams.filter((e) => e.type === t.key).length;
            if (!count) return null;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                aria-pressed={filter === t.key}
                className={`px-3 py-2 rounded-xl text-sm font-body border transition ${
                  filter === t.key ? "bg-ink text-paper border-ink font-semibold" : "border-ink/15 text-ink hover:border-ink/40"
                }`}
              >
                {t.labelVi} ({count})
              </button>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink/20 bg-paper2 p-6 text-center text-sm font-body text-[#8A7C63]">
            Chưa có đề nào thuộc phân loại này.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visible.map((exam) => (
            <article key={exam.id} className="rounded-2xl border border-ink/10 bg-paper2 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-ink text-paper text-[10px] font-mono uppercase">
                  {exam.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                  {examTypeLabel(exam.type)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] font-mono uppercase text-ink/70">
                  {DIFFICULTY_LABELS[exam.difficulty] || exam.difficulty}
                </span>
                {exam.done ? (
                  <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] font-mono uppercase text-ink inline-flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Cao nhất {exam.best}%
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] font-mono uppercase text-[#8A7C63]">
                    Chưa làm
                  </span>
                )}
              </div>

              <div>
                <h2 className="font-display font-semibold text-ink">{exam.name}</h2>
                <p className="mt-0.5 text-xs font-body text-[#8A7C63] line-clamp-2">{exam.description}</p>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-body text-ink/75">
                <span className="inline-flex items-center gap-1"><FileQuestion className="w-3.5 h-3.5 text-teal" /> {exam.questionCount} câu trắc nghiệm</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal" /> {exam.durationMin} phút</span>
                <span>{exam.sections.map((s) => s.title).join(" · ")}</span>
              </div>
              {exam.attempts > 0 && (
                <p className="text-xs font-body text-[#8A7C63]">
                  Đã làm {exam.attempts} lần · lần gần nhất {new Date(exam.lastAt).toLocaleDateString("vi-VN")}
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate(hrefFor("exam", exam.id))}
                className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink text-paper px-4 py-2.5 text-sm font-body font-semibold transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
              >
                {exam.done ? "Làm lại đề" : "Vào làm bài"} <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>

        <p className="text-xs font-body text-[#8A7C63]">
          Mỗi đề gồm Listening, Reading (chấm tự động), Writing và Speaking (chưa được đánh giá tự động —
          xem bài mẫu và đáp án gợi ý ở trang kết quả).
        </p>
      </div>
    </EnglishB1Shell>
  );
}
