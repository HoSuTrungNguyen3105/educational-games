// SpeakingPage.jsx — luyện nói B1 (spec §9): 23 chủ đề theo Part 1/2/3,
// ghi âm bằng MediaRecorder (SpeakingRecorder dùng chung), phát lại, lưu
// bản ghi qua recordSpeakingAttempt.
//
// TRUNG THỰC (README §0.3): phần đánh giá phát âm ghi rõ "Chưa khả dụng" —
// hệ thống không giả lập chấm phát âm khi chưa có dịch vụ thật.
import { useState } from "react";
import {
  ArrowLeft, BookOpen, Clock, Eye, History, Mic, Sparkles,
} from "lucide-react";
import { EnglishB1Shell, SpeakingRecorder, ExamTimer } from "../components/index.js";
import { GhostButton } from "../../components/ui";
import { SPEAKING_TOPICS } from "../data/index.js";
import { useEnglishB1Progress, recordSpeakingAttempt } from "../services/progressService.js";
import { useCountdown, formatClock } from "../utils/examTimerUtils.js";
import { getHashParam, useStudySeconds } from "./pageUtils.js";

const PARTS = [1, 2, 3];
const PART_LABELS = {
  1: "Part 1 — Giới thiệu & phỏng vấn",
  2: "Part 2 — Nói theo chủ đề",
  3: "Part 3 — Thảo luận mở rộng",
};

export default function SpeakingPage({ userAuth, showToast }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();
  const [topicId, setTopicId] = useState(() => getHashParam("item") || null);
  const topic = SPEAKING_TOPICS.find((t) => t.id === topicId) || null;

  return (
    <EnglishB1Shell
      active="speaking"
      title="Speaking — Luyện nói"
      subtitle="23 chủ đề theo 3 phần thi · ghi âm và nghe lại ngay trên máy"
      userAuth={userAuth}
    >
      {!topic && (
        <div className="space-y-5">
          {PARTS.map((part) => (
            <section key={part} aria-label={PART_LABELS[part]}>
              <h2 className="font-display text-base font-semibold text-ink mb-2.5 inline-flex items-center gap-2">
                <Mic className="w-4 h-4 text-teal" /> {PART_LABELS[part]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SPEAKING_TOPICS.filter((t) => t.part === part).map((t) => {
                  const saved = progress.speaking?.[t.id];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopicId(t.id)}
                      className="text-left rounded-2xl border border-ink/10 bg-paper2 p-4 transition hover:border-teal/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                          Part {t.part} · {formatClock(t.timeLimitSec)}
                        </span>
                        {saved?.done && (
                          <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] font-mono uppercase text-ink">
                            Đã luyện · {saved.attempts} lần
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-display font-semibold text-ink">{t.title}</p>
                      <p className="mt-0.5 text-xs font-body text-[#8A7C63] line-clamp-2">{t.promptVi}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {topic && (
        <SpeakingTopic
          key={topic.id}
          topic={topic}
          saved={progress.speaking?.[topic.id]}
          showToast={showToast}
          onBack={() => setTopicId(null)}
        />
      )}
    </EnglishB1Shell>
  );
}

/** Chi tiết một chủ đề nói — remount theo topic. */
function SpeakingTopic({ topic, saved, showToast, onBack }) {
  const [showSample, setShowSample] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [saveNote, setSaveNote] = useState("");

  const secondsLeft = useCountdown(topic.timeLimitSec, {
    paused: !timerStarted || timerDone,
    onExpire: () => {
      setTimerDone(true);
      showToast("Hết thời gian nói của chủ đề này — hãy nghe lại bản ghi và tự đánh giá.", "info");
    },
  });

  const handleSave = (dataUrl, durationSec) => {
    const entry = recordSpeakingAttempt(topic.id, {
      recording: dataUrl,
      durationSec,
      label: topic.title,
    });
    setSaveNote(
      entry?.recording
        ? `Đã lưu bản ghi ${formatClock(durationSec)} vào lịch sử luyện nói.`
        : `Đã ghi nhận lượt luyện nói ${formatClock(durationSec)} (bản ghi quá dài nên chỉ lưu thông tin lượt, không lưu âm thanh).`
    );
    showToast("Đã lưu lượt luyện nói.", "success");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <GhostButton onClick={onBack}>
          <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách chủ đề</span>
        </GhostButton>
        <h2 className="font-display text-lg font-semibold text-ink">{topic.title}</h2>
        <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
          Part {topic.part}
        </span>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-3">
        <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
          <BookOpen className="w-4 h-4 text-teal" /> Đề bài
        </p>
        <p className="text-sm font-body text-ink leading-relaxed">{topic.promptVi}</p>
        {(topic.questionsVi || []).length > 0 && (
          <ul className="space-y-1">
            {topic.questionsVi.map((q, i) => (
              <li key={i} className="flex gap-2 text-sm font-body text-ink/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        )}
        {(topic.structureVi || []).length > 0 && (
          <div>
            <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Dàn ý gợi ý</p>
            <ol className="space-y-1 list-decimal list-inside text-sm font-body text-ink/85">
              {topic.structureVi.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}
        {(topic.vocabularyHints || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topic.vocabularyHints.map((h, i) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-ink/5 border border-ink/10 text-xs font-body text-ink" title={h.meaningVi}>
                {h.word} · <span className="text-[#8A7C63]">{h.meaningVi}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Đồng hồ bấm giờ nói */}
      <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-3">
        <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
          <Clock className="w-4 h-4 text-teal" /> Bấm giờ nói — giới hạn {formatClock(topic.timeLimitSec)}
        </p>
        <ExamTimer secondsLeft={secondsLeft} totalSeconds={topic.timeLimitSec} paused={!timerStarted || timerDone} />
        {!timerStarted ? (
          <GhostButton onClick={() => setTimerStarted(true)}>Bắt đầu bấm giờ</GhostButton>
        ) : timerDone ? (
          <p className="text-sm font-body text-[#8A7C63]">Đã hết giờ. Bấm “Làm lại chủ đề” ở danh sách hoặc chọn chủ đề khác để luyện tiếp.</p>
        ) : (
          <p className="text-sm font-body text-[#8A7C63]">Đồng hồ đang chạy — hãy nói liên tục cho tới khi hết giờ.</p>
        )}
      </div>

      <SpeakingRecorder
        savedRecording={saved?.recording || null}
        onSave={handleSave}
        saveLabel="Lưu bản ghi vào lịch sử"
      />
      {saveNote && <p className="text-xs font-body text-teal" aria-live="polite">{saveNote}</p>}

      {saved?.done && (
        <p className="inline-flex items-center gap-1.5 text-xs font-body text-[#8A7C63]">
          <History className="w-3.5 h-3.5" /> Đã luyện {saved.attempts} lần
          {saved.recording ? ` · bản ghi gần nhất dài ${formatClock(saved.recording.durationSec || 0)}` : ""}
        </p>
      )}

      {/* Câu trả lời mẫu */}
      <div className="rounded-2xl border border-ink/10 bg-paper2">
        <button
          type="button"
          onClick={() => setShowSample((s) => !s)}
          aria-expanded={showSample}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
        >
          <span className="inline-flex items-center gap-2 font-display font-semibold text-ink">
            <Eye className="w-4 h-4 text-teal" /> Câu trả lời mẫu
          </span>
          <span className="text-xs font-body text-[#8A7C63]">{showSample ? "Ẩn" : "Hiện"}</span>
        </button>
        {showSample && (
          <p className="border-t border-ink/10 px-4 py-3 text-sm font-body text-ink leading-relaxed whitespace-pre-line">
            {topic.sampleAnswer}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2 p-4">
        <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
          <Sparkles className="w-4 h-4 text-gold" /> Đánh giá phát âm
        </p>
        <p className="mt-1 text-sm font-body text-[#8A7C63]">
          Chưa khả dụng — hệ thống chưa tích hợp dịch vụ chấm phát âm. Hãy nghe lại bản ghi
          của bạn và đối chiếu với câu trả lời mẫu ở trên.
        </p>
      </div>
    </div>
  );
}
