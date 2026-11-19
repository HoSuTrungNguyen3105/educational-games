// VocabularyPage.jsx — học từ vựng B1 theo chủ đề (spec §4).
// Chế độ: lật thẻ ghi nhớ (flashcard), chọn nghĩa, điền từ, ghép từ,
// nghe & chọn từ — bộ câu do vocabularyService.buildPracticeItems dựng,
// trạng thái SRS + từ khó ghi qua progressService (không ghi localStorage thô).
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Bookmark, CheckCircle2, ChevronLeft, ChevronRight,
  ListChecks, PenLine, Link2, Headphones, Layers, Volume2, X,
} from "lucide-react";
import {
  EnglishB1Shell, Flashcard, VocabularyCard, QuestionCard, AudioPlayer,
} from "../components/index.js";
import { PrimaryButton, GhostButton } from "../../components/ui";
import { VOCAB_TOPICS, ALL_VOCAB_WORDS } from "../data/index.js";
import {
  useEnglishB1Progress, recordVocabularyReview, setVocabularyHard,
} from "../services/progressService.js";
import {
  getWordStatus, getDueWords, getTopicProgress, buildPracticeItems, VOCAB_MODES,
} from "../services/vocabularyService.js";
import { gradeAnswer, gradeItems } from "../utils/scoringUtils.js";
import { useStudySeconds } from "./pageUtils.js";

const MODE_ICONS = { ListChecks, PenLine, Link2, Headphones, Layers };

const STATUS_LABELS = { new: "Mới", learning: "Đang học", learned: "Đã nhớ", review: "Cần ôn" };

export default function VocabularyPage({ userAuth, showToast }) {
  useStudySeconds();
  const progress = useEnglishB1Progress();

  const [pool, setPool] = useState(null); // { title, words } — phiên học đang mở
  const [mode, setMode] = useState(null); // key trong VOCAB_MODES
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flashDone, setFlashDone] = useState(false);
  const [detailWord, setDetailWord] = useState(null);
  const recordedRef = useRef(false);

  const dueWords = useMemo(() => getDueWords(progress, ALL_VOCAB_WORDS), [progress]);
  const learnedCount = useMemo(
    () => ALL_VOCAB_WORDS.filter((w) => getWordStatus(progress, w.id) === "learned").length,
    [progress]
  );

  const resetSession = () => {
    setItems([]);
    setAnswers({});
    setRevealed(false);
    setCardIndex(0);
    setFlipped(false);
    setFlashDone(false);
    recordedRef.current = false;
  };

  const openPool = (nextPool) => {
    setPool(nextPool);
    setMode(null);
    setDetailWord(null);
    resetSession();
  };

  const closePool = () => {
    setPool(null);
    setMode(null);
    setDetailWord(null);
    resetSession();
  };

  const startMode = (modeKey) => {
    if (!pool) return;
    const built = buildPracticeItems(pool.words, modeKey, { count: 10 });
    setMode(modeKey);
    setItems(built);
    setAnswers({});
    setRevealed(false);
    setCardIndex(0);
    setFlipped(false);
    setFlashDone(false);
    recordedRef.current = false;
  };

  /** Chấm + ghi SRS cho phiên quiz (chỉ chạy một lần khi bấm "Kiểm tra"). */
  const checkQuiz = () => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const graded = gradeItems(items, answers);
    for (const item of items) {
      if (item.wordId) {
        recordVocabularyReview(item.wordId, gradeAnswer(item, answers[String(item.id)]));
      }
      if (Array.isArray(item.wordIds)) {
        const given = Array.isArray(answers[String(item.id)]) ? answers[String(item.id)] : [];
        item.wordIds.forEach((wordId, i) => {
          recordVocabularyReview(wordId, Number(given[i]) === Number(item.answer[i]));
        });
      }
    }
    setRevealed(true);
    showToast(`Đúng ${graded.correct}/${graded.correct + graded.wrong + graded.skipped} câu — đã cập nhật lịch ôn tập.`, "success");
  };

  const quizResult = revealed ? gradeItems(items, answers) : null;
  const answeredCount = items.filter((it) => {
    const g = answers[String(it.id)];
    return g !== undefined && g !== null && g !== "" && !(Array.isArray(g) && g.length === 0);
  }).length;

  /** Đánh giá 1 thẻ flashcard rồi chuyển thẻ kế. */
  const judgeFlashcard = (word, correct) => {
    recordVocabularyReview(word.id, correct);
    if (cardIndex >= items.length - 1) {
      setFlashDone(true);
    } else {
      setCardIndex(cardIndex + 1);
      setFlipped(false);
    }
  };

  const currentFlashWord = mode === "flashcard" ? items[cardIndex] : null;

  return (
    <EnglishB1Shell
      active="vocabulary"
      title="Từ vựng B1"
      subtitle="15 chủ đề · ôn tập theo phương pháp lặp lại ngắt quãng (SRS)"
      userAuth={userAuth}
    >
      {/* ── Màn chọn chủ đề ── */}
      {!pool && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
              <p className="font-mono text-[11px] uppercase text-[#8A7C63]">Tổng số từ</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{ALL_VOCAB_WORDS.length}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-paper2 p-4">
              <p className="font-mono text-[11px] uppercase text-[#8A7C63]">Đã nhớ</p>
              <p className="mt-1 font-display text-2xl font-bold text-teal">{learnedCount}</p>
            </div>
            <button
              type="button"
              disabled={!dueWords.length}
              onClick={() => openPool({ title: "Ôn từ đến hạn", words: dueWords })}
              className="text-left rounded-2xl border border-gold/40 bg-gold/10 p-4 transition enabled:hover:shadow-md disabled:opacity-60"
            >
              <p className="font-mono text-[11px] uppercase text-[#8A7C63]">Từ đến hạn ôn lại</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{dueWords.length} từ</p>
              <p className="text-xs font-body text-[#8A7C63]">
                {dueWords.length ? "Bấm để ôn ngay theo lịch SRS" : "Chưa có từ nào đến hạn"}
              </p>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {VOCAB_TOPICS.map((topic) => {
              const tp = getTopicProgress(progress, topic.words);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => openPool({ title: topic.titleVi, words: topic.words })}
                  className="text-left rounded-2xl border border-ink/10 bg-paper2 p-4 transition hover:border-teal/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl" aria-hidden="true">{topic.icon}</span>
                    <span className="font-mono text-xs text-[#8A7C63]">{topic.words.length} từ</span>
                  </div>
                  <p className="mt-2 font-display font-semibold text-ink">{topic.titleVi}</p>
                  <p className="text-xs font-body text-[#8A7C63]">{topic.title}</p>
                  <div className="mt-3 h-2 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
                    <div className="h-full bg-teal transition-all" style={{ width: `${tp.percent}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] font-body text-[#8A7C63]">
                    Đã nhớ {tp.learned} · Đang học {tp.learning} · Cần ôn {tp.review} · Mới {tp.new}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Màn học theo chủ đề / ôn đến hạn ── */}
      {pool && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <GhostButton onClick={closePool}>
              <span className="inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Chủ đề</span>
            </GhostButton>
            <h2 className="font-display text-lg font-semibold text-ink">{pool.title}</h2>
            <span className="font-mono text-xs text-[#8A7C63]">{pool.words.length} từ</span>
          </div>

          {/* Chọn chế độ học */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ học">
            {VOCAB_MODES.map((m) => {
              const Icon = MODE_ICONS[m.icon] || ListChecks;
              const isActive = mode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => startMode(m.key)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body border transition ${
                    isActive
                      ? "bg-ink text-paper border-ink font-semibold"
                      : "border-ink/15 text-ink hover:border-ink/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {!mode && (
            <p className="text-sm font-body text-[#8A7C63]">
              Chọn một chế độ học ở trên, hoặc xem từng từ trong danh sách bên dưới và bấm “Xem chi tiết” để học sâu.
            </p>
          )}

          {/* ── Phiên flashcard ── */}
          {mode === "flashcard" && items.length > 0 && !flashDone && currentFlashWord && (
            <div className="max-w-xl mx-auto space-y-3">
              <p className="text-center font-mono text-xs text-[#8A7C63]">
                Thẻ {cardIndex + 1}/{items.length} · {STATUS_LABELS[getWordStatus(progress, currentFlashWord.id)]}
              </p>
              <Flashcard
                key={currentFlashWord.id}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                front={(
                  <span className="space-y-2">
                    <span className="block font-display text-3xl font-bold text-ink">{currentFlashWord.word}</span>
                    <span className="block font-mono text-sm text-[#8A7C63]">{currentFlashWord.ipa}</span>
                    <span className="block text-xs font-body text-[#8A7C63]">{currentFlashWord.pos} · Bấm thẻ để xem nghĩa</span>
                  </span>
                )}
                back={(
                  <span className="space-y-2">
                    <span className="block font-display text-xl font-semibold text-teal">{currentFlashWord.meaningVi}</span>
                    <span className="block text-sm italic font-body text-ink">{currentFlashWord.example}</span>
                    <span className="block text-xs font-body text-[#8A7C63]">{currentFlashWord.exampleVi}</span>
                  </span>
                )}
              />
              <div className="flex items-center justify-between gap-2">
                <GhostButton onClick={() => { setCardIndex(Math.max(0, cardIndex - 1)); setFlipped(false); }} disabled={cardIndex <= 0}>
                  <span className="inline-flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Trước</span>
                </GhostButton>
                <div className="flex gap-2">
                  <GhostButton onClick={() => judgeFlashcard(currentFlashWord, false)}>Chưa nhớ</GhostButton>
                  <PrimaryButton onClick={() => judgeFlashcard(currentFlashWord, true)}>
                    <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Đã nhớ</span>
                  </PrimaryButton>
                </div>
                <GhostButton
                  onClick={() => { if (cardIndex >= items.length - 1) setFlashDone(true); else { setCardIndex(cardIndex + 1); setFlipped(false); } }}
                >
                  <span className="inline-flex items-center gap-1">Sau <ChevronRight className="w-4 h-4" /></span>
                </GhostButton>
              </div>
            </div>
          )}

          {mode === "flashcard" && flashDone && (
            <div className="max-w-xl mx-auto rounded-2xl border border-teal/30 bg-teal/10 p-5 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-teal mx-auto" />
              <p className="font-display font-semibold text-ink">Đã xem hết {items.length} thẻ!</p>
              <p className="text-sm font-body text-ink/75">
                Kết quả tự đánh giá đã được ghi vào lịch ôn SRS — từ “chưa nhớ” sẽ quay lại sớm hơn.
              </p>
              <div className="flex justify-center gap-2">
                <GhostButton onClick={() => startMode("flashcard")}>Học lại</GhostButton>
                <PrimaryButton onClick={closePool}>Về danh sách chủ đề</PrimaryButton>
              </div>
            </div>
          )}

          {/* ── Phiên quiz (meaning / fill_blank / matching / listening) ── */}
          {mode && mode !== "flashcard" && items.length > 0 && (
            <div className="space-y-3 max-w-3xl">
              {items.map((item, i) => (
                <QuestionCard
                  key={item.id}
                  item={item}
                  index={i}
                  total={items.length}
                  given={answers[String(item.id)]}
                  onChange={(given) => setAnswers((a) => ({ ...a, [String(item.id)]: given }))}
                  revealed={revealed}
                  correct={revealed ? gradeAnswer(item, answers[String(item.id)]) : undefined}
                />
              ))}
              {!revealed ? (
                <div className="flex items-center gap-3">
                  <PrimaryButton onClick={checkQuiz} disabled={answeredCount === 0}>
                    Kiểm tra đáp án ({answeredCount}/{items.length})
                  </PrimaryButton>
                  <span className="text-xs font-body text-[#8A7C63]">Kết quả sẽ được ghi vào lịch ôn SRS.</span>
                </div>
              ) : (
                <div className="rounded-2xl border border-ink/10 bg-paper2 p-4 flex flex-wrap items-center gap-3">
                  <p className="font-display font-semibold text-ink">
                    Kết quả: đúng {quizResult.correct}/{items.length} câu
                    {quizResult.skipped > 0 ? ` · bỏ trống ${quizResult.skipped}` : ""}
                  </p>
                  <div className="flex gap-2 ml-auto">
                    <GhostButton onClick={() => startMode(mode)}>Làm bộ mới</GhostButton>
                    <PrimaryButton onClick={closePool}>Về danh sách chủ đề</PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Chi tiết một từ ── */}
          {detailWord && (
            <div className="rounded-2xl border border-teal/40 bg-paper2 p-4 sm:p-5 space-y-3 max-w-3xl">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-bold text-ink break-words">
                    {detailWord.word}
                    <span className="ml-2 font-mono text-sm font-normal text-[#8A7C63]">{detailWord.ipa}</span>
                  </p>
                  <p className="mt-1 text-sm font-body">
                    <span className="px-2 py-0.5 rounded-full bg-ink/5 border border-ink/15 text-[10px] uppercase text-ink/70">{detailWord.pos}</span>
                    <span className="ml-2 font-semibold text-teal">{detailWord.meaningVi}</span>
                    <span className="ml-2 text-xs text-[#8A7C63]">{STATUS_LABELS[getWordStatus(progress, detailWord.id)]}</span>
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <GhostButton
                    onClick={() => setVocabularyHard(detailWord.id, !progress.vocabulary?.[detailWord.id]?.hard)}
                  >
                    <span className={`inline-flex items-center gap-1 ${progress.vocabulary?.[detailWord.id]?.hard ? "text-ticket" : ""}`}>
                      <Bookmark className="w-4 h-4" />
                      {progress.vocabulary?.[detailWord.id]?.hard ? "Bỏ cờ từ khó" : "Đánh dấu từ khó"}
                    </span>
                  </GhostButton>
                  <GhostButton onClick={() => setDetailWord(null)}>
                    <X className="w-4 h-4" />
                  </GhostButton>
                </div>
              </div>

              <div className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2.5">
                <p className="text-sm italic font-body text-ink">{detailWord.example}</p>
                <p className="text-xs font-body text-[#8A7C63] mt-0.5">{detailWord.exampleVi}</p>
              </div>

              {(detailWord.synonyms?.length > 0 || detailWord.antonyms?.length > 0) && (
                <p className="text-xs font-body text-[#8A7C63]">
                  {detailWord.synonyms?.length > 0 && <>Đồng nghĩa: <span className="text-ink">{detailWord.synonyms.join(", ")}</span>. </>}
                  {detailWord.antonyms?.length > 0 && <>Trái nghĩa: <span className="text-ink">{detailWord.antonyms.join(", ")}</span>.</>}
                </p>
              )}

              <AudioPlayer
                text={`${detailWord.word}. ${detailWord.example}`}
                audioUrl={detailWord.audioUrl || null}
                audioStatus={detailWord.audioUrl ? "ready" : "missing"}
                label="Phát âm từ + câu ví dụ (giọng đọc máy)"
              />

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-body text-[#8A7C63]">
                  <Volume2 className="w-3.5 h-3.5" /> Tự đánh giá mức nhớ:
                </span>
                <GhostButton onClick={() => { recordVocabularyReview(detailWord.id, false); showToast("Đã ghi: chưa nhớ — từ sẽ quay lại sớm.", "info"); }}>
                  Chưa nhớ
                </GhostButton>
                <PrimaryButton onClick={() => { recordVocabularyReview(detailWord.id, true); showToast("Đã ghi: đã nhớ từ này.", "success"); }}>
                  Đã nhớ
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ── Danh sách từ của phiên ── */}
          <div>
            <h3 className="font-display text-base font-semibold text-ink mb-3">Danh sách từ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pool.words.map((w) => (
                <VocabularyCard
                  key={w.id}
                  word={w}
                  status={getWordStatus(progress, w.id)}
                  hard={!!progress.vocabulary?.[w.id]?.hard}
                  onOpen={() => setDetailWord(w)}
                  onToggleHard={() => setVocabularyHard(w.id, !progress.vocabulary?.[w.id]?.hard)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </EnglishB1Shell>
  );
}
