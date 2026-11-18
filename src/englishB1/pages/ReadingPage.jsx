// ReadingPage.jsx — đọc hiểu B1 (spec §7): đoạn văn trái / câu hỏi phải,
// nộp bài xong hiện đáp án + giải thích + vị trí thông tin trong đoạn văn.
// Practice: không giới hạn thời gian · Exam: đồng hồ 15 phút, tự nộp khi hết giờ.
import { useRef, useState } from "react";
import { ArrowLeft, BookOpen, MapPin, RotateCcw, Send, Timer, Eye } from "lucide-react";
import {
  EnglishB1Shell, ReadingPassage, QuestionCard, ExamTimer,
} from "../components/index.js";
import { PrimaryButton, GhostButton } from "../../components/ui";
import { READING_LESSONS } from "../data/index.js";
import { useEnglishB1Progress, recordLessonResult } from "../services/progressService.js";
import { gradeAnswer, gradeItems } from "../utils/scoringUtils.js";
import { useCountdown } from "../utils/examTimerUtils.js";
import { getHashParam, useStudySeconds } from "./pageUtils.js";

const EXAM_SECONDS = 15 * 60;

const TOPIC_LABELS = {
  education: "Giáo dục", environment: "Môi trường", technology: "Công nghệ",
  health: "Sức khỏe", travel: "Du lịch", culture: "Văn hóa",
  society: "Xã hội", work: "Công việc", daily_life: "Đời sống",
};

const DIFFICULTY_LABELS = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };

export default function ReadingPage({ userAuth, showToast }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();
  const [lessonId, setLessonId] = useState(() => getHashParam("item") || null);
  const [mode, setMode] = useState("practice");
  const lesson = READING_LESSONS.find((l) => l.id === lessonId) || null;

  return (
    <EnglishB1Shell
      active="reading"
      title="Reading — Đọc hiểu"
      subtitle="10 bài đọc B1 · đáp án kèm vị trí thông tin trong bài"
      userAuth={userAuth}
    >
      {!lesson && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ làm bài">
            {[
              { key: "practice", label: "Practice — luyện tập" },
              { key: "exam", label: "Exam — tính giờ 15 phút" },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                aria-pressed={mode === m.key}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body border transition ${
                  mode === m.key ? "bg-ink text-paper border-ink font-semibold" : "border-ink/15 text-ink hover:border-ink/40"
                }`}
              >
                {m.key === "exam" ? <Timer className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {READING_LESSONS.map((l) => {
              const saved = progress.reading?.[l.id];
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLessonId(l.id)}
                  className="text-left rounded-2xl border border-ink/10 bg-paper2 p-4 transition hover:border-teal/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] font-mono uppercase text-ink/70">
                      {TOPIC_LABELS[l.topic] || l.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                      {l.level} · {DIFFICULTY_LABELS[l.difficulty] || l.difficulty}
                    </span>
                    {saved?.done && (
                      <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] font-mono uppercase text-ink">
                        Tốt nhất {saved.best}%
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-display font-semibold text-ink">{l.title}</p>
                  <p className="mt-0.5 text-xs font-body text-[#8A7C63]">
                    {l.paragraphs.length} đoạn · ~{l.wordCount} từ · {l.questions.length} câu hỏi
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {lesson && (
        <ReadingSession
          key={`${lesson.id}-${mode}`}
          lesson={lesson}
          mode={mode}
          showToast={showToast}
          onBack={() => setLessonId(null)}
        />
      )}
    </EnglishB1Shell>
  );
}

/** Một phiên làm bài đọc — remount theo lesson+mode để đồng hồ/đáp án luôn mới. */
function ReadingSession({ lesson, mode, showToast, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activePara, setActivePara] = useState(-1);
  const recordedRef = useRef(false);

  const isExam = mode === "exam";
  const graded = gradeItems(lesson.questions, answers);
  const answeredCount = lesson.questions.filter((q) => {
    const g = answers[String(q.id)];
    return g !== undefined && g !== null && g !== "" && !(Array.isArray(g) && g.length === 0);
  }).length;

  const submit = (auto = false) => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const result = gradeItems(lesson.questions, answers);
    recordLessonResult("reading", lesson.id, {
      correct: result.correct,
      total: lesson.questions.length,
      label: lesson.title,
    });
    setSubmitted(true);
    showToast(
      auto
        ? `Hết giờ — đã tự nộp bài. Đúng ${result.correct}/${lesson.questions.length} câu.`
        : `Đã nộp bài: đúng ${result.correct}/${lesson.questions.length} câu.`,
      "success"
    );
  };

  const secondsLeft = useCountdown(isExam ? EXAM_SECONDS : 0, {
    paused: submitted || !isExam,
    onExpire: () => { if (isExam) submit(true); },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <GhostButton onClick={onBack}>
          <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách bài</span>
        </GhostButton>
        <h2 className="font-display text-lg font-semibold text-ink">{lesson.title}</h2>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
          isExam ? "bg-ticket/10 border-ticket/30 text-ticket" : "bg-teal/10 border-teal/30 text-teal"
        }`}>
          {isExam ? "Exam mode · 15 phút" : "Practice mode"}
        </span>
        <span className="ml-auto font-mono text-xs text-[#8A7C63]">
          Đã trả lời {answeredCount}/{lesson.questions.length} câu
        </span>
      </div>

      {isExam && (
        <ExamTimer secondsLeft={secondsLeft} totalSeconds={EXAM_SECONDS} paused={submitted} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="lg:sticky lg:top-36">
          <ReadingPassage
            paragraphs={lesson.paragraphs}
            title={lesson.title}
            activeIndex={activePara}
            onPick={(i) => setActivePara(i)}
          />
          <p className="mt-2 text-[11px] font-body text-[#8A7C63]">
            Bấm vào một đoạn để đánh dấu. Sau khi nộp bài, mỗi câu hỏi có nút chỉ đúng đoạn chứa đáp án.
          </p>
        </div>

        <div className="space-y-3">
          {lesson.questions.map((q, i) => (
            <div key={q.id} className="space-y-1.5">
              <QuestionCard
                item={q}
                index={i}
                total={lesson.questions.length}
                given={answers[String(q.id)]}
                onChange={(given) => setAnswers((a) => ({ ...a, [String(q.id)]: given }))}
                revealed={submitted}
                correct={submitted ? gradeAnswer(q, answers[String(q.id)]) : undefined}
                disabled={submitted}
              />
              {submitted && typeof q.paragraphRef === "number" && (
                <button
                  type="button"
                  onClick={() => setActivePara(q.paragraphRef)}
                  className="inline-flex items-center gap-1.5 text-xs font-body text-teal hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" /> Xem đoạn {q.paragraphRef + 1} — nơi chứa đáp án
                </button>
              )}
            </div>
          ))}

          {!submitted ? (
            <PrimaryButton onClick={() => submit(false)} disabled={answeredCount === 0}>
              <span className="inline-flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Nộp bài ({answeredCount}/{lesson.questions.length})
              </span>
            </PrimaryButton>
          ) : (
            <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-2">
              <p className="font-display font-semibold text-ink inline-flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal" />
                Kết quả: đúng {graded.correct}/{lesson.questions.length} câu
                {graded.skipped > 0 ? ` · bỏ trống ${graded.skipped}` : ""}
              </p>
              <p className="text-sm font-body text-ink/75">
                Đáp án, giải thích và vị trí thông tin đã hiện ở từng câu. Bấm “Xem đoạn…” để đối chiếu với bài đọc.
              </p>
              <div className="flex gap-2">
                <GhostButton onClick={onBack}>
                  <span className="inline-flex items-center gap-1"><RotateCcw className="w-4 h-4" /> Chọn bài khác</span>
                </GhostButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
