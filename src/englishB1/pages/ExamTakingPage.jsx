// ExamTakingPage.jsx — làm bài thi B1 (spec §10, README §6.9).
// - Section Listening/Reading: MỘT câu mỗi lần bằng QuestionCard +
//   ExamNavigation (nhảy câu, cắm cờ, tiến độ, nộp bài).
// - Section Writing: ô soạn thảo; Speaking: ghi âm/phần trình bày.
// - ExamTimer đếm ngược toàn đề; hết giờ tự nộp. Đáp án KHÔNG lộ khi đang làm.
// - Đáp án nháp chỉ nằm trong state của phiên (progressService không có API
//   lưu nháp đề thi — README §4.8), thoát giữa chừng có ConfirmModal cảnh báo.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, DoorOpen, Headphones, PenLine, Send,
} from "lucide-react";
import {
  EnglishB1Shell, QuestionCard, ExamNavigation, ExamTimer, AudioPlayer, SpeakingRecorder,
} from "../components/index.js";
import { PrimaryButton, GhostButton, ConfirmModal } from "../../components/ui";
import { navigate } from "../../lib/router.js";
import { getExam, gradeExam, saveAttempt, qkey } from "../services/examService.js";
import { useCountdown, formatClock } from "../utils/examTimerUtils.js";

const SKILL_LABELS = {
  listening: "Listening — Nghe",
  reading: "Reading — Đọc",
  writing: "Writing — Viết",
  speaking: "Speaking — Nói",
};

export default function ExamTakingPage({ userAuth, showToast, examId }) {
  const exam = getExam(examId);
  if (!exam) {
    return (
      <EnglishB1Shell active="exams" title="Không tìm thấy đề thi" userAuth={userAuth}>
        <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2 p-6 text-center space-y-3">
          <p className="font-body text-sm text-[#8A7C63]">
            Đề thi này không tồn tại hoặc đã bị gỡ. Hãy quay lại danh sách đề để chọn đề khác.
          </p>
          <GhostButton onClick={() => navigate("/english-b1/exams")}>
            <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách đề thi</span>
          </GhostButton>
        </div>
      </EnglishB1Shell>
    );
  }
  return (
    <ExamSession
      key={exam.id}
      exam={exam}
      userAuth={userAuth}
      showToast={showToast}
    />
  );
}

/** Một phiên làm bài — remount theo exam.id. */
function ExamSession({ exam, userAuth, showToast }) {
  const totalSeconds = (exam.durationMin || 60) * 60;
  const startedAtRef = useRef(0);
  const submittedRef = useRef(false);
  useEffect(() => { startedAtRef.current = Date.now(); }, []);

  const [sectionIdx, setSectionIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [speakNote, setSpeakNote] = useState("");

  const section = exam.sections[sectionIdx];
  const isObjective = section.skill === "listening" || section.skill === "reading";
  const questions = isObjective ? section.questions || [] : [];
  const currentQ = questions[qIdx] || null;

  const objectiveKeys = useMemo(() => {
    const keys = [];
    exam.sections.forEach((s) => {
      if (s.skill === "listening" || s.skill === "reading") {
        (s.questions || []).forEach((q) => keys.push(qkey(s.id, q.id)));
      }
    });
    return keys;
  }, [exam]);

  const answeredCount = objectiveKeys.filter((k) => {
    const v = answers[k];
    return v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
  }).length;

  const finish = (auto = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const graded = gradeExam(exam, answers);
    const elapsed = Math.min(
      totalSeconds,
      Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
    );
    saveAttempt(exam.id, { ...graded, durationSec: elapsed, answers, label: exam.name });
    setSubmitted(true);
    showToast(
      auto ? "Hết giờ — bài thi đã được tự động nộp." : "Đã nộp bài thi. Đang mở trang kết quả…",
      "success"
    );
    navigate(`/english-b1/exams/${exam.id}/result`);
  };

  const secondsLeft = useCountdown(totalSeconds, {
    paused: submitted || confirmExit || confirmSubmit,
    onExpire: () => finish(true),
  });

  // Cảnh báo khi đóng/refresh tab giữa chừng (router hash không có blocker).
  useEffect(() => {
    if (submitted) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitted]);

  const goSection = (idx) => {
    setSectionIdx(idx);
    setQIdx(0);
  };

  const sectionDone = (s) => {
    if (s.skill === "writing") {
      const t = (answers["writing:essay"] || "").trim();
      return t.split(/\s+/).filter(Boolean).length >= 10;
    }
    if (s.skill === "speaking") return answers["speaking:attempted"] === true;
    return (s.questions || []).some((q) => {
      const v = answers[qkey(s.id, q.id)];
      return v !== undefined && v !== null && v !== "";
    });
  };

  return (
    <EnglishB1Shell
      active="exams"
      title={`${exam.code} — ${exam.name}`}
      subtitle={`${exam.durationMin} phút · ${exam.sections.length} phần thi`}
      userAuth={userAuth}
    >
      <div className="space-y-4">
        <ExamTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} paused={submitted || confirmExit || confirmSubmit} />

        {/* Tab các phần thi */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Các phần thi">
          {exam.sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === sectionIdx}
              onClick={() => goSection(i)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body border transition ${
                i === sectionIdx ? "bg-ink text-paper border-ink font-semibold" : "border-ink/15 text-ink hover:border-ink/40"
              }`}
            >
              {SKILL_LABELS[s.skill] || s.title}
              {sectionDone(s) && <CheckCircle2 className="w-3.5 h-3.5 text-teal" aria-label="Đã có bài làm" />}
            </button>
          ))}
          <span className="ml-auto self-center font-mono text-xs text-[#8A7C63]">
            Đã trả lời {answeredCount}/{objectiveKeys.length} câu trắc nghiệm
          </span>
        </div>

        {/* ===== Section trắc nghiệm ===== */}
        {isObjective && currentQ && (
          <div className="space-y-3">
            {section.skill === "reading" && (section.passages || []).length > 0 && (
              <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-2 max-h-72 overflow-y-auto">
                <p className="font-display font-semibold text-ink">{section.title}</p>
                {(section.passages || []).map((p, i) => (
                  <p key={i} className="text-sm font-body text-ink leading-relaxed">{p}</p>
                ))}
              </div>
            )}
            {section.skill === "listening" && (
              <div className="space-y-1.5">
                <AudioPlayer
                  text={(section.transcript || []).join("\n")}
                  audioUrl={null}
                  audioStatus="missing"
                  label={`Phần nghe: ${section.title}`}
                />
                <p className="text-[11px] font-body text-[#8A7C63] inline-flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  Audio gốc chưa được cung cấp — phần nghe phát bằng giọng đọc máy (TTS). Transcript không hiển thị trong lúc thi.
                </p>
              </div>
            )}

            <QuestionCard
              item={currentQ}
              index={qIdx}
              total={questions.length}
              given={answers[qkey(section.id, currentQ.id)]}
              onChange={(given) => setAnswers((a) => ({ ...a, [qkey(section.id, currentQ.id)]: given }))}
            />

            <ExamNavigation
              index={qIdx}
              total={questions.length}
              keys={questions.map((q) => qkey(section.id, q.id))}
              answers={answers}
              flagged={flagged}
              onJump={(i) => setQIdx(i)}
              onPrev={() => setQIdx((i) => Math.max(0, i - 1))}
              onNext={() => setQIdx((i) => Math.min(questions.length - 1, i + 1))}
              onToggleFlag={(key) => setFlagged((f) => ({ ...f, [key]: !f[key] }))}
              onSubmit={() => setConfirmSubmit(true)}
              submitLabel="Nộp bài thi"
              canSubmit
            />
          </div>
        )}

        {/* ===== Section Writing ===== */}
        {section.skill === "writing" && (
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-3">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <PenLine className="w-4 h-4 text-teal" /> {section.title}
            </p>
            <p className="text-sm font-body text-ink leading-relaxed">{section.promptVi}</p>
            {(section.requirementsVi || []).length > 0 && (
              <ul className="space-y-1">
                {section.requirementsVi.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm font-body text-ink/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs font-body text-[#8A7C63]">
              Yêu cầu độ dài: {section.minWords}–{section.maxWords} từ. Phần Writing{" "}
              <b>chưa được đánh giá tự động</b> — sau khi nộp, hãy đối chiếu với bài mẫu ở trang kết quả.
            </p>
            <textarea
              value={answers["writing:essay"] || ""}
              onChange={(e) => setAnswers((a) => ({ ...a, "writing:essay": e.target.value }))}
              rows={12}
              placeholder="Write your answer in English here…"
              className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-3 text-[15px] font-body text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal/40 resize-y"
              aria-label="Bài viết phần Writing"
            />
            <p className="font-mono text-xs text-[#8A7C63]" aria-live="polite">
              {(answers["writing:essay"] || "").trim().split(/\s+/).filter(Boolean).length} từ
            </p>
          </div>
        )}

        {/* ===== Section Speaking ===== */}
        {section.skill === "speaking" && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-2">
              <p className="font-display font-semibold text-ink">{section.title}</p>
              <p className="text-sm font-body text-ink leading-relaxed">{section.promptVi}</p>
              {(section.questionsVi || []).length > 0 && (
                <ul className="space-y-1">
                  {section.questionsVi.map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm font-body text-ink/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs font-body text-[#8A7C63]">
                Hãy ghi âm phần trình bày của bạn bên dưới. Phần Speaking <b>chưa được đánh giá tự động</b> —
                bản ghi chỉ để bạn nghe lại và đối chiếu với đáp án gợi ý ở trang kết quả.
              </p>
            </div>
            <SpeakingRecorder
              saveLabel="Xác nhận đã trình bày phần Speaking"
              onSave={(_dataUrl, durationSec) => {
                setAnswers((a) => ({ ...a, "speaking:attempted": true }));
                setSpeakNote(`Đã ghi nhận phần trình bày dài ${formatClock(durationSec)} (bản ghi không đính kèm bài thi).`);
                showToast("Đã ghi nhận phần Speaking.", "success");
              }}
            />
            {speakNote && <p className="text-xs font-body text-teal" aria-live="polite">{speakNote}</p>}
            {answers["speaking:attempted"] === true && (
              <p className="inline-flex items-center gap-1.5 text-sm font-body text-teal">
                <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành phần trình bày.
              </p>
            )}
          </div>
        )}

        {/* Hàng hành động cuối */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <GhostButton onClick={() => setConfirmExit(true)}>
            <span className="inline-flex items-center gap-1"><DoorOpen className="w-4 h-4" /> Thoát (không nộp)</span>
          </GhostButton>
          {!isObjective && (
            <PrimaryButton className="ml-auto" onClick={() => setConfirmSubmit(true)}>
              <span className="inline-flex items-center gap-1.5"><Send className="w-4 h-4" /> Nộp bài thi</span>
            </PrimaryButton>
          )}
          {isObjective && (
            <p className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-xs font-body text-[#8A7C63]">
              <AlertTriangle className="w-3.5 h-3.5" /> Nút “Nộp bài thi” nằm ở thanh điều hướng câu hỏi phía trên.
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmExit}
        title="Thoát khỏi bài thi?"
        message="Bài làm hiện tại sẽ KHÔNG được nộp và không được lưu lại. Bạn có chắc muốn thoát?"
        confirmLabel="Thoát bài thi"
        onConfirm={() => {
          submittedRef.current = true; // tránh beforeunload/hết giờ chen vào
          setConfirmExit(false);
          navigate("/english-b1/exams");
        }}
        onClose={() => setConfirmExit(false)}
      />
      <ConfirmModal
        open={confirmSubmit}
        title="Nộp bài thi?"
        message={`Bạn đã trả lời ${answeredCount}/${objectiveKeys.length} câu trắc nghiệm${
          answers["writing:essay"] ? ", đã viết phần Writing" : ", CHƯA viết phần Writing"
        }${answers["speaking:attempted"] ? ", đã trình bày phần Speaking" : ""}. Sau khi nộp sẽ không sửa được nữa.`}
        confirmLabel="Nộp bài"
        danger={false}
        onConfirm={() => { setConfirmSubmit(false); finish(false); }}
        onClose={() => setConfirmSubmit(false)}
      />
    </EnglishB1Shell>
  );
}
