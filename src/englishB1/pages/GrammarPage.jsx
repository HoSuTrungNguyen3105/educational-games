// GrammarPage.jsx — ngữ pháp B1 (spec §5): 20 chuyên đề, mỗi chuyên đề có
// lý thuyết (GrammarLesson) + bài tập đủ 6 dạng (GrammarExercise/QuestionCard).
// Nộp bài → chấm bằng scoringUtils và ghi recordLessonResult("grammar", …).
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, RotateCcw, Send } from "lucide-react";
import { EnglishB1Shell, GrammarLesson, GrammarExercise } from "../components/index.js";
import { PrimaryButton, GhostButton } from "../../components/ui";
import { GRAMMAR_LESSONS } from "../data/index.js";
import { useEnglishB1Progress, recordLessonResult } from "../services/progressService.js";
import { gradeAnswer, gradeItems } from "../utils/scoringUtils.js";
import { getHashParam, useStudySeconds } from "./pageUtils.js";

export default function GrammarPage({ userAuth, showToast }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();
  const [openId, setOpenId] = useState(() => getHashParam("item") || null);
  const [answers, setAnswers] = useState({}); // { [lessonId]: { [exerciseId]: given } }
  const [revealed, setRevealed] = useState({}); // { [lessonId]: bool }
  const sectionRefs = useRef({});

  // Deep-link từ Dashboard/đề xuất: mở sẵn chuyên đề và cuộn tới.
  useEffect(() => {
    if (!openId) return;
    const el = sectionRefs.current[openId];
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [openId]);

  const toggleLesson = (lessonId) => {
    setOpenId((cur) => (cur === lessonId ? null : lessonId));
  };

  const setAnswer = (lessonId, exerciseId, given) => {
    setAnswers((a) => ({
      ...a,
      [lessonId]: { ...(a[lessonId] || {}), [String(exerciseId)]: given },
    }));
  };

  const submitLesson = (lesson) => {
    const graded = gradeItems(lesson.exercises, answers[lesson.id] || {});
    recordLessonResult("grammar", lesson.id, {
      correct: graded.correct,
      total: lesson.exercises.length,
      label: lesson.title,
    });
    setRevealed((r) => ({ ...r, [lesson.id]: true }));
    showToast(`Đã chấm "${lesson.title}": đúng ${graded.correct}/${lesson.exercises.length} câu.`, "success");
  };

  const resetLesson = (lesson) => {
    setAnswers((a) => ({ ...a, [lesson.id]: {} }));
    setRevealed((r) => ({ ...r, [lesson.id]: false }));
  };

  const doneCount = GRAMMAR_LESSONS.filter((l) => progress.grammar?.[l.id]?.done).length;

  return (
    <EnglishB1Shell
      active="grammar"
      title="Ngữ pháp B1"
      subtitle={`${GRAMMAR_LESSONS.length} chuyên đề · đã học ${doneCount}`}
      userAuth={userAuth}
    >
      <div className="space-y-4">
        <p className="text-sm font-body text-[#8A7C63]">
          Mở một chuyên đề để xem lý thuyết (giải thích, công thức, ví dụ, lỗi thường gặp),
          sau đó làm bài tập ngay bên dưới — đáp án và giải thích chi tiết hiện ra sau khi nộp bài.
        </p>

        {GRAMMAR_LESSONS.map((lesson) => {
          const saved = progress.grammar?.[lesson.id];
          const isOpen = openId === lesson.id;
          const isRevealed = !!revealed[lesson.id];
          const lessonAnswers = answers[lesson.id] || {};
          const graded = isRevealed ? gradeItems(lesson.exercises, lessonAnswers) : null;
          const answeredCount = lesson.exercises.filter((ex) => {
            const g = lessonAnswers[String(ex.id)];
            return g !== undefined && g !== null && g !== "" && !(Array.isArray(g) && g.length === 0);
          }).length;

          return (
            <div key={lesson.id} ref={(el) => { sectionRefs.current[lesson.id] = el; }} className="scroll-mt-32">
              <div className="relative">
                <GrammarLesson
                  lesson={lesson}
                  expanded={isOpen}
                  onToggle={() => toggleLesson(lesson.id)}
                />
                {saved?.done && (
                  <span className="absolute top-3.5 right-12 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                    <CheckCircle2 className="w-3 h-3" /> Đã học · tốt nhất {saved.best}%
                  </span>
                )}
              </div>

              {isOpen && (
                <div className="mt-3 space-y-3 max-w-3xl">
                  <h3 className="font-display font-semibold text-ink">
                    Bài tập — {lesson.title}
                    <span className="ml-2 font-mono text-xs font-normal text-[#8A7C63]">
                      {lesson.exercises.length} câu · đã trả lời {answeredCount}
                    </span>
                  </h3>

                  {lesson.exercises.map((ex, i) => (
                    <GrammarExercise
                      key={ex.id}
                      item={ex}
                      index={i}
                      total={lesson.exercises.length}
                      given={lessonAnswers[String(ex.id)]}
                      onChange={(given) => setAnswer(lesson.id, ex.id, given)}
                      revealed={isRevealed}
                      correct={isRevealed ? gradeAnswer(ex, lessonAnswers[String(ex.id)]) : undefined}
                    />
                  ))}

                  {!isRevealed ? (
                    <PrimaryButton onClick={() => submitLesson(lesson)} disabled={answeredCount === 0}>
                      <span className="inline-flex items-center gap-1.5">
                        <Send className="w-4 h-4" /> Nộp bài & xem giải thích ({answeredCount}/{lesson.exercises.length})
                      </span>
                    </PrimaryButton>
                  ) : (
                    <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 flex flex-wrap items-center gap-3">
                      <p className="font-display font-semibold text-ink">
                        Kết quả: đúng {graded.correct}/{lesson.exercises.length} câu
                        {graded.skipped > 0 ? ` · bỏ trống ${graded.skipped}` : ""}
                        {saved?.done ? ` · điểm tốt nhất đã lưu: ${saved.best}%` : ""}
                      </p>
                      <GhostButton className="ml-auto" onClick={() => resetLesson(lesson)}>
                        <span className="inline-flex items-center gap-1"><RotateCcw className="w-4 h-4" /> Làm lại</span>
                      </GhostButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </EnglishB1Shell>
  );
}
