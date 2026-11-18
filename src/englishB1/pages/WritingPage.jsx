// WritingPage.jsx — luyện viết B1 (spec §8): 16 chủ đề, soạn thảo + đếm từ,
// lưu nháp tự động, nộp bài chấm bằng scoringUtils.evaluateEssay.
//
// TRUNG THỰC (README §0.3): điểm là "Đánh giá theo bộ quy tắc cơ bản —
// chưa tích hợp AI", giao diện ghi rõ nhãn này ở mọi nơi hiện điểm.
import { useState } from "react";
import {
  ArrowLeft, BookOpen, CheckCircle2, Eye, ListChecks, PenLine, Save, Send,
} from "lucide-react";
import { EnglishB1Shell } from "../components/index.js";
import { PrimaryButton, GhostButton } from "../../components/ui";
import { WRITING_TOPICS } from "../data/index.js";
import {
  useEnglishB1Progress, saveWritingDraft, saveWritingSubmission,
} from "../services/progressService.js";
import { evaluateEssay, scoreBand } from "../utils/scoringUtils.js";
import { getHashParam, useStudySeconds, countWords } from "./pageUtils.js";

const TYPE_LABELS = {
  email: "Email",
  informal_letter: "Thư không chính thức",
  formal_letter: "Thư chính thức",
  opinion_paragraph: "Đoạn nghị luận",
  short_essay: "Bài văn ngắn",
  advice: "Đưa lời khuyên",
  experience: "Kể trải nghiệm",
};

export default function WritingPage({ userAuth, showToast }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();
  const [topicId, setTopicId] = useState(() => getHashParam("item") || null);
  const topic = WRITING_TOPICS.find((t) => t.id === topicId) || null;

  return (
    <EnglishB1Shell
      active="writing"
      title="Writing — Luyện viết"
      subtitle="16 chủ đề · chấm theo bộ quy tắc cơ bản, chưa tích hợp AI"
      userAuth={userAuth}
    >
      {!topic && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WRITING_TOPICS.map((t) => {
            const saved = progress.writing?.[t.id];
            const submissions = saved?.submissions || [];
            const latest = submissions[0];
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopicId(t.id)}
                className="text-left rounded-2xl border border-ink/10 bg-paper2 p-4 transition hover:border-teal/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] font-mono uppercase text-ink/70">
                    {TYPE_LABELS[t.type] || t.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                    {t.minWords}–{t.maxWords} từ
                  </span>
                  {saved?.draft && (
                    <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] font-mono uppercase text-ink">
                      Có nháp
                    </span>
                  )}
                  {latest && (
                    <span className="px-2 py-0.5 rounded-full bg-teal/10 border border-teal/30 text-[10px] font-mono uppercase text-teal">
                      Đã nộp · {latest.score}/100
                    </span>
                  )}
                </div>
                <p className="mt-2 font-display font-semibold text-ink">{t.title}</p>
                <p className="mt-0.5 text-xs font-body text-[#8A7C63] line-clamp-2">{t.promptVi}</p>
              </button>
            );
          })}
        </div>
      )}

      {topic && (
        <WritingEditor
          key={topic.id}
          topic={topic}
          saved={progress.writing?.[topic.id]}
          showToast={showToast}
          onBack={() => setTopicId(null)}
        />
      )}
    </EnglishB1Shell>
  );
}

/** Khu soạn thảo một chủ đề — remount theo topic để nháp/kết quả không lẫn nhau. */
function WritingEditor({ topic, saved, showToast, onBack }) {
  const [text, setText] = useState(() => saved?.draft || "");
  const [result, setResult] = useState(null);
  const [showSample, setShowSample] = useState(false);
  const words = countWords(text);
  const inRange = words >= topic.minWords && words <= topic.maxWords;
  const submissions = saved?.submissions || [];
  const shownResult = result || (submissions[0]
    ? { score: submissions[0].score, criteria: submissions[0].criteria, suggestionsVi: submissions[0].suggestionsVi, wordCount: submissions[0].wordCount, isStored: true }
    : null);

  const handleChange = (value) => {
    setText(value);
    saveWritingDraft(topic.id, value);
  };

  const submit = () => {
    if (!words) {
      showToast("Hãy viết bài trước khi nộp.", "error");
      return;
    }
    const graded = evaluateEssay(text, topic);
    saveWritingSubmission(topic.id, { ...graded, text, title: topic.title });
    setResult(graded);
    showToast(`Đã nộp bài — điểm theo bộ quy tắc: ${graded.score}/100.`, "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <GhostButton onClick={onBack}>
          <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Danh sách đề</span>
        </GhostButton>
        <h2 className="font-display text-lg font-semibold text-ink">{topic.title}</h2>
        <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] font-mono uppercase text-ink/70">
          {TYPE_LABELS[topic.type] || topic.type}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Cột đề bài */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 space-y-3">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <BookOpen className="w-4 h-4 text-teal" /> Đề bài
            </p>
            <p className="text-sm font-body text-ink leading-relaxed">{topic.promptVi}</p>
            <div>
              <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Yêu cầu</p>
              <ul className="space-y-1">
                {(topic.requirementsVi || []).map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm font-body text-ink/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            {(topic.structureVi || []).length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Dàn ý gợi ý</p>
                <ol className="space-y-1 list-decimal list-inside text-sm font-body text-ink/85">
                  {topic.structureVi.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            )}
            {(topic.vocabularyHints || []).length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1.5">Từ vựng gợi ý</p>
                <div className="flex flex-wrap gap-1.5">
                  {topic.vocabularyHints.map((h, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-ink/5 border border-ink/10 text-xs font-body text-ink" title={h.meaningVi}>
                      {h.word} · <span className="text-[#8A7C63]">{h.meaningVi}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checklist 5 tiêu chí */}
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
              <ListChecks className="w-4 h-4 text-teal" /> Tiêu chí đánh giá
            </p>
            <ul className="mt-2 space-y-2">
              {(topic.checklist || []).map((c) => (
                <li key={c.id} className="text-sm font-body">
                  <span className="font-semibold text-ink">{c.labelVi}</span>
                  <span className="block text-xs text-[#8A7C63]">{c.hintVi}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] font-body text-[#8A7C63]">
              Bài được chấm theo bộ quy tắc cơ bản (đếm từ, từ nối, đa dạng từ vựng, lỗi chính tả
              thường gặp…) — <b>chưa tích hợp AI</b>, điểm chỉ mang tính tham khảo để tự sửa bài.
            </p>
          </div>

          {/* Bài mẫu */}
          <div className="rounded-2xl border border-ink/10 bg-paper2">
            <button
              type="button"
              onClick={() => setShowSample((s) => !s)}
              aria-expanded={showSample}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
            >
              <span className="inline-flex items-center gap-2 font-display font-semibold text-ink">
                <Eye className="w-4 h-4 text-teal" /> Bài viết tham khảo
              </span>
              <span className="text-xs font-body text-[#8A7C63]">{showSample ? "Ẩn" : "Hiện"}</span>
            </button>
            {showSample && (
              <div className="border-t border-ink/10 px-4 py-3 space-y-3">
                <p className="text-sm font-body text-ink leading-relaxed whitespace-pre-line">{topic.sampleAnswer}</p>
                <ul className="space-y-1">
                  {(topic.sampleNotesVi || []).map((n, i) => (
                    <li key={i} className="flex gap-2 text-xs font-body text-[#8A7C63]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Cột soạn thảo + kết quả */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="inline-flex items-center gap-2 font-display font-semibold text-ink">
                <PenLine className="w-4 h-4 text-teal" /> Bài viết của bạn
              </p>
              <span className={`font-mono text-xs ${inRange ? "text-teal" : "text-[#8A7C63]"}`} aria-live="polite">
                {words} từ · yêu cầu {topic.minWords}–{topic.maxWords}
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              rows={14}
              placeholder="Viết bài bằng tiếng Anh tại đây… Nháp tự lưu khi bạn gõ."
              className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-3 text-[15px] font-body text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal/40 resize-y"
              aria-label="Nội dung bài viết"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-body text-[#8A7C63]">
                <Save className="w-3.5 h-3.5" /> Nháp tự lưu trên máy này
              </span>
              <PrimaryButton className="ml-auto" onClick={submit} disabled={!words}>
                <span className="inline-flex items-center gap-1.5"><Send className="w-4 h-4" /> Nộp bài & nhận đánh giá</span>
              </PrimaryButton>
            </div>
          </div>

          {shownResult && (
            <div className="rounded-2xl border border-teal/30 bg-paper2 p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display font-semibold text-ink">Kết quả đánh giá</p>
                <span className="font-display text-2xl font-bold text-teal">{shownResult.score}/100</span>
                <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[11px] font-body text-ink">
                  {scoreBand(shownResult.score).label}
                </span>
                <span className="ml-auto text-[11px] font-body text-[#8A7C63]">
                  Đánh giá theo bộ quy tắc cơ bản — chưa tích hợp AI
                  {shownResult.isStored ? " · bài nộp gần nhất" : ""}
                </span>
              </div>
              <div className="space-y-2">
                {(shownResult.criteria || []).map((c) => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between gap-2 text-sm font-body">
                      <span className="text-ink">{c.labelVi}</span>
                      <span className="font-mono text-xs text-[#8A7C63]">{c.score}/{c.max}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
                      <div className="h-full bg-teal transition-all" style={{ width: `${(c.score / c.max) * 100}%` }} />
                    </div>
                    <p className="mt-0.5 text-xs font-body text-[#8A7C63]">{c.noteVi}</p>
                  </div>
                ))}
              </div>
              {(result?.notesVi || []).length > 0 && (
                <ul className="space-y-1">
                  {result.notesVi.map((n, i) => (
                    <li key={i} className="text-sm font-body text-ink/85">• {n}</li>
                  ))}
                </ul>
              )}
              {(shownResult.suggestionsVi || []).length > 0 && (
                <div>
                  <p className="font-mono text-[11px] uppercase text-[#8A7C63] mb-1">Gợi ý sửa bài</p>
                  <ul className="space-y-1">
                    {shownResult.suggestionsVi.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm font-body text-ink/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {submissions.length > 1 && (
                <p className="text-xs font-body text-[#8A7C63]">
                  Đã nộp {submissions.length} lần cho chủ đề này. Điểm các lần trước:{" "}
                  {submissions.slice(1).map((s) => s.score).join(", ")}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
