// ListeningPage.jsx — luyện nghe B1 (spec §6).
// Dữ liệu chưa có file audio gốc (audioStatus "missing") → AudioPlayer hiện
// đúng trạng thái "Nội dung âm thanh chưa được cung cấp" và đọc transcript
// bằng giọng đọc máy (TTS) — không bịa đường dẫn audio (README §0.3, §4.4).
//
// Practice Mode (spec §6.4): nghe lại không giới hạn, không tính giờ,
// xem transcript khi chủ động mở, kiểm tra đáp án sau khi làm xong.
// Exam Mode: đồng hồ = 2× thời lượng bài, tối đa 2 lượt nghe, không hiện
// transcript/đáp án cho tới khi nộp bài (hết giờ tự nộp).
import { useRef, useState } from "react";
import {
  ArrowLeft, BookOpen, Eye, FileText, Headphones, RotateCcw, Send, Timer,
} from "lucide-react";
import {
  EnglishB1Shell, QuestionCard, AudioPlayer, ExamTimer,
} from "../components/index.js";
import { PrimaryButton, GhostButton } from "../../components/ui";
import { LISTENING_LESSONS } from "../data/index.js";
import { useEnglishB1Progress, recordLessonResult } from "../services/progressService.js";
import { gradeAnswer, gradeItems } from "../utils/scoringUtils.js";
import { useCountdown, formatClock } from "../utils/examTimerUtils.js";
import { getHashParam, useStudySeconds } from "./pageUtils.js";

const CATEGORY_LABELS = {
  daily_conversations: "Hội thoại hằng ngày",
  school_education: "Trường học & Giáo dục",
  travel_transportation: "Du lịch & Giao thông",
  shopping: "Mua sắm",
  health: "Sức khỏe",
  work_career: "Công việc & Nghề nghiệp",
  announcements: "Thông báo",
  interviews: "Phỏng vấn",
  short_talks: "Bài nói ngắn",
};

const DIFFICULTY_LABELS = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };
const EXAM_PLAY_LIMIT = 2;

export default function ListeningPage({ userAuth, showToast }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();
  const [lessonId, setLessonId] = useState(() => getHashParam("item") || null);
  const [mode, setMode] = useState("practice");
  const lesson = LISTENING_LESSONS.find((l) => l.id === lessonId) || null;

  const categories = [...new Set(LISTENING_LESSONS.map((l) => l.category))];

  return (
    <EnglishB1Shell
      active="listening"
      title="Listening — Luyện nghe"
      subtitle="10 bài nghe B1 · audio gốc chưa được cung cấp, nghe bằng giọng đọc máy"
      userAuth={userAuth}
    >
      {!lesson && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ làm bài">
            {[
              { key: "practice", label: "Practice — luyện tập" },
              { key: "exam", label: "Exam — tính giờ, 2 lượt nghe" },
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

          {categories.map((cat) => (
            <section key={cat} aria-label={CATEGORY_LABELS[cat] || cat}>
              <h2 className="font-display text-base font-semibold text-ink mb-2.5 inline-flex items-center gap-2">
                <Headphones className="w-4 h-4 text-teal" /> {CATEGORY_LABELS[cat] || cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LISTENING_LESSONS.filter((l) => l.category === cat).map((l) => {
                  const saved = progress.listening?.[l.id];
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLessonId(l.id)}
                      className="text-left rounded-2xl border border-ink/10 bg-paper2 p-4 transition hover:border-teal/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                          {l.level} · {DIFFICULTY_LABELS[l.difficulty] || l.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] font-mono uppercase text-ink/70">
                          ~{formatClock(l.durationSec)}
                        </span>
                        {saved?.done && (
                          <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] font-mono uppercase text-ink">
                            Tốt nhất {saved.best}%
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-display font-semibold text-ink">{l.title}</p>
                      <p className="mt-0.5 text-xs font-body text-[#8A7C63]">
                        {l.questions.length} câu hỏi · audio gốc chưa có — nghe bằng giọng đọc máy (TTS)
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {lesson && (
        <ListeningSession
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

/** Một phiên luyện nghe — remount theo lesson+mode. */
function ListeningSession({ lesson, mode, showToast, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [plays, setPlays] = useState(0);
  const [playingNow, setPlayingNow] = useState(false);
  const recordedRef = useRef(false);

  const isExam = mode === "exam";
  const examSeconds = (lesson.durationSec || 180) * 2;
  const graded = gradeItems(lesson.questions, answers);
  const answeredCount = lesson.questions.filter((q) => {
    const g = answers[String(q.id)];
    return g !== undefined && g !== null && g !== "" && !(Array.isArray(g) && g.length === 0);
  }).length;
  const playsExhausted = isExam && plays >= EXAM_PLAY_LIMIT && !playingNow;

  const submit = (auto = false) => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const result = gradeItems(lesson.questions, answers);
    recordLessonResult("listening", lesson.id, {
      correct: result.correct,
      total: lesson.questions.length,
      label: lesson.title,
    });
    setSubmitted(true);
    showToast(
      auto
        ? `Hết giờ — đã tự nộp bài nghe. Đúng ${result.correct}/${lesson.questions.length} câu.`
        : `Đã nộp bài: đúng ${result.correct}/${lesson.questions.length} câu.`,
      "success"
    );
  };

  const secondsLeft = useCountdown(isExam ? examSeconds : 0, {
    paused: submitted || !isExam,
    onExpire: () => { if (isExam) submit(true); },
  });

  const transcriptText = (lesson.transcript || []).join("\n");

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <GhostButton onClick={onBack}>
          <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách bài</span>
        </GhostButton>
        <h2 className="font-display text-lg font-semibold text-ink">{lesson.title}</h2>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
          isExam ? "bg-ticket/10 border-ticket/30 text-ticket" : "bg-teal/10 border-teal/30 text-teal"
        }`}>
          {isExam ? `Exam mode · ${formatClock(examSeconds)} · tối đa ${EXAM_PLAY_LIMIT} lượt nghe` : "Practice mode · nghe lại tự do"}
        </span>
      </div>

      {isExam && (
        <ExamTimer secondsLeft={secondsLeft} totalSeconds={examSeconds} paused={submitted} />
      )}

      <div className="space-y-1.5">
        <AudioPlayer
          text={transcriptText}
          audioUrl={lesson.audioUrl || null}
          audioStatus={lesson.audioStatus || "missing"}
          label={`Bài nghe: ${lesson.title}`}
          onPlay={() => { setPlays((p) => p + 1); setPlayingNow(true); }}
          onEnded={() => setPlayingNow(false)}
          playDisabled={playsExhausted || submitted}
        />
        {isExam && (
          <p className="text-[11px] font-body text-[#8A7C63]" aria-live="polite">
            {submitted
              ? "Đã nộp bài — bạn có thể xem transcript và đáp án bên dưới."
              : playsExhausted
                ? `Đã dùng hết ${EXAM_PLAY_LIMIT} lượt nghe (chế độ thi).`
                : `Lượt nghe đã dùng: ${plays}/${EXAM_PLAY_LIMIT} (chế độ thi).`}
          </p>
        )}
      </div>

      {/* Transcript: Practice mở khi chủ động bấm; Exam chỉ sau khi nộp */}
      {(!isExam || submitted) && (
        <div className="rounded-2xl border border-ink/10 bg-paper2">
          <button
            type="button"
            onClick={() => setShowTranscript((s) => !s)}
            aria-expanded={showTranscript}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
          >
            <span className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <FileText className="w-4 h-4 text-teal" /> Transcript & bản dịch
            </span>
            <span className="text-xs font-body text-[#8A7C63]">{showTranscript ? "Ẩn" : "Hiện"}</span>
          </button>
          {showTranscript && (
            <div className="border-t border-ink/10 px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                {(lesson.transcript || []).map((line, i) => (
                  <p key={i} className="text-sm font-body text-ink leading-relaxed">{line}</p>
                ))}
              </div>
              <div className="space-y-1.5">
                {(lesson.transcriptVi || []).map((line, i) => (
                  <p key={i} className="text-sm font-body text-[#8A7C63] leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {isExam && !submitted && (
        <p className="text-xs font-body text-[#8A7C63] inline-flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Transcript và đáp án chỉ hiện sau khi nộp bài (chế độ thi).
        </p>
      )}

      <div className="space-y-3">
        {lesson.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            item={q}
            index={i}
            total={lesson.questions.length}
            given={answers[String(q.id)]}
            onChange={(given) => setAnswers((a) => ({ ...a, [String(q.id)]: given }))}
            revealed={submitted}
            correct={submitted ? gradeAnswer(q, answers[String(q.id)]) : undefined}
            disabled={submitted}
          />
        ))}
      </div>

      {!submitted ? (
        <PrimaryButton onClick={() => submit(false)} disabled={answeredCount === 0}>
          <span className="inline-flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Nộp bài ({answeredCount}/{lesson.questions.length})
          </span>
        </PrimaryButton>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-2">
          <p className="font-display font-semibold text-ink">
            Kết quả: đúng {graded.correct}/{lesson.questions.length} câu
            {graded.skipped > 0 ? ` · bỏ trống ${graded.skipped}` : ""}
          </p>
          <p className="text-sm font-body text-ink/75">
            Đáp án và giải thích đã hiện ở từng câu; transcript cũng đã mở để bạn đối chiếu.
          </p>
          <GhostButton onClick={onBack}>
            <span className="inline-flex items-center gap-1"><RotateCcw className="w-4 h-4" /> Chọn bài khác</span>
          </GhostButton>
        </div>
      )}
    </div>
  );
}
