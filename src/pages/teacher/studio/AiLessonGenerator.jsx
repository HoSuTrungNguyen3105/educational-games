import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, FileText, FlaskConical, RotateCcw, Save, Sparkles } from "lucide-react";
import { navigate } from "../../../lib/router.js";
import { generateLesson } from "../../../services/aiApi.js";
import { lessonService } from "../../../services/lessonService.js";
import { setupService } from "../../../services/setupService.js";
import { isLessonAnswerCorrect } from "../../../components/studio/lessonAnswer.js";
import { LessonPageView } from "../../../components/studio/LessonPlayer.jsx";
import { ConfirmModal, GhostButton, PrimaryButton, Select } from "../../../components/ui";
import { useConfirm } from "../../../hooks/useConfirm.js";
import "./studio.css";

// AiLessonGenerator — màn hình "✨ Tạo bài học với AI" tại
// /dashboard/ai-lesson-creator/generate (đặc tả AI_LESSON_CREATOR.md).
//
// Luồng: giáo viên chọn Môn học (danh mục subjects thật) + Lớp 1–5 + Độ
// dài, nhập prompt → POST /api/ai/generate-lesson → Backend trả BẢN NHÁP
// đã đúng schema `lessons` THẬT (chưa lưu DB). Bố cục khi có bản nháp:
//   • TRÁI (sticky ở màn hình rộng): trình sửa CẤU TRÚC của bản nháp
//     (tiêu đề/mô tả/mục tiêu, từng section gồm câu dẫn nhập, các trang
//     mô phỏng, trang tổng kết, từng câu quiz) — mọi sửa đổi ghi thẳng
//     vào draft.pages theo id phần tử nên preview cập nhật ngay, không
//     có logic layout thứ hai ở client.
//   • PHẢI: bản xem trước DỌC — MỌI trang của bản nháp xếp chồng trong
//     một cột cuộn, render bằng đúng LessonPageView của LessonPlayer
//     (không phân trang, không tab ẩn ở bất kỳ kích thước màn hình nào).
//     Bấm vào BẤT KỲ phần tử nào trong bản dọc → phần tử đó được chọn +
//     viền nhấn, và panel trái nhảy tới đúng ô sửa của nó (ánh xạ qua id).
// Lưu: lessonService.create (API lessons hiện hữu) với status draft do
// server gán → quay về danh sách, mở sửa tiếp bằng StudioEditor như bài
// thường. Không có endpoint lưu riêng cho luồng AI này.

const LENGTH_OPTIONS = [
  { id: "short", label: "Ngắn gọn", hint: "3 phần · 3 câu hỏi" },
  { id: "standard", label: "Tiêu chuẩn", hint: "4 phần · 5 câu hỏi" },
  { id: "deep", label: "Chuyên sâu", hint: "6 phần · 6 câu hỏi" },
];

const PROMPT_SUGGESTIONS = [
  "Soạn bài giảng về … kèm nhiều ví dụ thực tế gần gũi với học sinh.",
  "Soạn bài về … theo phong cách trò chơi hoá: mở đầu bằng một tình huống vui, mỗi phần có một thử thách nhỏ.",
  "Soạn bài ôn tập về …: nhắc lại kiến thức cốt lõi trước, rồi vận dụng từ dễ đến khó.",
  "Soạn bài về … dẫn dắt bằng một câu chuyện ngắn, lồng ghép kiến thức vào câu chuyện.",
];

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const TEXT_TYPES = new Set(["title", "text", "note"]);
// Màu chữ Backend gán cho phần tử câu dẫn nhập (hook) — khớp hằng số
// LESSON_HOOK_COLOR phía server (aiDirectService). Nhận diện hook bằng
// màu này để không nhầm với khối nội dung (cùng cỡ chữ, không có màu).
const HOOK_COLOR = "#B45309";

/**
 * Dựng bảng ánh xạ cấu trúc từ draft.pages: section nào gồm những phần tử
 * nào (theo đúng thứ tự Backend sinh ra: title → text(hook, có màu riêng)
 * → text(content) → text(example) → note(key_takeaway), decor emoji bỏ
 * qua), các trang mô phỏng, trang tổng kết, các câu quiz. Panel sửa và
 * cơ chế click-để-chọn đều đi qua bảng này (theo id phần tử).
 */
function buildBindings(draft) {
  const sections = [];
  const quiz = [];
  const simulations = [];
  let summary = null;
  for (const page of draft?.pages || []) {
    const elements = page.elements || [];
    const simEl = elements.find((e) => e.type === "simulation");
    if (simEl) {
      simulations.push({ pageId: page.id, elId: simEl.id });
      continue;
    }
    const questionEls = elements.filter((e) => e.type === "question");
    if (questionEls.length > 0) {
      for (const el of questionEls) quiz.push({ pageId: page.id, elId: el.id });
      continue;
    }
    const textEls = elements.filter((e) => e.type === "text");
    // Trang tổng kết do Backend sinh có đúng 2 phần tử (tiêu đề + 1 khối chữ).
    if (page.title === "Tổng kết bài học" && elements.length === 2) {
      summary = { pageId: page.id, textElId: textEls[0]?.id || null };
      continue;
    }
    // Phần tử chữ đầu tiên mang màu hook → câu dẫn nhập; các khối còn lại
    // giữ thứ tự content → example như trước.
    let hookElId = null;
    let restTextEls = textEls;
    if (textEls.length > 0 && textEls[0].props?.color === HOOK_COLOR) {
      hookElId = textEls[0].id;
      restTextEls = textEls.slice(1);
    }
    sections.push({
      pageId: page.id,
      headingElId: elements.find((e) => e.type === "title")?.id || null,
      hookElId,
      contentElId: restTextEls[0]?.id || null,
      exampleElId: restTextEls[1]?.id || null,
      takeawayElId: elements.find((e) => e.type === "note")?.id || null,
    });
  }
  return { sections, summary, quiz, simulations };
}

function findElement(draft, elId) {
  for (const page of draft?.pages || []) {
    const el = (page.elements || []).find((e) => e.id === elId);
    if (el) return el;
  }
  return null;
}

/** Kiểm tra bản nháp trước khi lưu — mirror điều kiện xuất bản phía server
 *  để bài lưu vào không bao giờ ở trạng thái "không xuất bản nổi". */
function validateDraftForSave(draft) {
  if (!String(draft.title || "").trim()) return "Bài học chưa có tiêu đề.";
  if (!Array.isArray(draft.pages) || draft.pages.length === 0) return "Bài học chưa có trang nội dung nào.";
  for (const page of draft.pages) {
    for (const el of page.elements || []) {
      if (el.type === "simulation") {
        // Mirror validate phía server (lessonService): mô phỏng bắt buộc
        // có tiêu đề + 2–5 bước có nội dung, chặn sớm để khỏi lưu lỗi 400.
        const p = el.props || {};
        if (!String(p.title || "").trim()) return "Có mô phỏng đang trống tiêu đề — hãy đặt tiêu đề cho mô phỏng trước khi lưu.";
        const steps = (Array.isArray(p.steps) ? p.steps : []).filter((s) => String(s || "").trim());
        if (steps.length < 2 || steps.length > 5) return "Mỗi mô phỏng cần từ 2 đến 5 bước có nội dung — hãy kiểm tra lại các bước của mô phỏng.";
        continue;
      }
      if (el.type !== "question") continue;
      const p = el.props || {};
      if (!String(p.prompt || "").trim()) return "Có câu hỏi kiểm tra đang trống nội dung — hãy bổ sung nội dung câu hỏi trước khi lưu.";
      const options = (p.options || []).filter((o) => String(o.content || "").trim());
      if (options.length < 2) return "Có câu hỏi kiểm tra chưa đủ 2 phương án trả lời.";
      if (!options.some((o) => o.id === p.correctAnswer)) return "Có câu hỏi kiểm tra chưa chọn đáp án đúng.";
    }
  }
  return null;
}

/** Payload lưu: bỏ phần tử hook/example/ghi nhớ/tổng kết bị giáo viên xoá
 *  trắng (chúng là phần tuỳ chọn), giữ nguyên phần còn lại đúng như bản nháp. */
function buildSavePayload(draft, bindings) {
  const payload = JSON.parse(JSON.stringify(draft));
  const optionalIds = new Set();
  for (const s of bindings.sections) {
    if (s.hookElId) optionalIds.add(s.hookElId);
    if (s.exampleElId) optionalIds.add(s.exampleElId);
    if (s.takeawayElId) optionalIds.add(s.takeawayElId);
  }
  if (bindings.summary?.textElId) optionalIds.add(bindings.summary.textElId);
  payload.pages = (payload.pages || [])
    .map((page) => ({
      ...page,
      elements: (page.elements || []).filter(
        (el) => !(optionalIds.has(el.id) && TEXT_TYPES.has(el.type) && !String(el.props?.text || "").trim()),
      ),
    }))
    .filter((page) => (page.elements || []).length > 0);
  return {
    title: payload.title,
    subject: payload.subject,
    grade: payload.grade,
    description: payload.description || "",
    objectives: payload.objectives || "",
    coverImage: payload.coverImage || "",
    pages: payload.pages,
  };
}

/**
 * Bản xem trước DỌC: render MỌI trang của bản nháp xếp chồng trong một
 * cột — mỗi trang là đúng LessonPageView mà LessonPlayer dùng (nền
 * trang, phần tử, câu hỏi bấm trả lời thử được, mô phỏng bấm từng bước
 * được), kèm dải tiêu đề "Trang N · tên trang". Không phân trang, không
 * tab: trang nào cũng có mặt trong DOM ngay khi bản nháp hiện ra, ở mọi
 * kích thước màn hình. Trạng thái trả lời thử giữ nội bộ ở đây (remount
 * theo key draftVersion khi tạo bài mới nên tự sạch).
 */
export function VerticalPreview({ draft, selectedElId, onElementClick }) {
  const [answers, setAnswers] = useState({});
  const onAnswerChange = (elId, next) => setAnswers((prev) => ({ ...prev, [elId]: next }));
  const pages = draft?.pages || [];
  if (pages.length === 0) {
    return <p className="text-center text-sm text-ink/55 py-10">Bản nháp chưa có trang nào.</p>;
  }
  return (
    <div className="space-y-5">
      {pages.map((page, i) => {
        const hasSim = (page.elements || []).some((e) => e.type === "simulation");
        return (
          <div key={page.id} className="rounded-2xl border border-ink/10 bg-white/70 p-3 shadow-sm">
            <div className="flex items-center gap-2 px-1 pb-2">
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-paper">Trang {i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{page.title || `Trang ${i + 1}`}</span>
              {hasSim && (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                  style={{ background: "linear-gradient(90deg,#0E7490,#1B998B)" }}>
                  <FlaskConical className="w-3 h-3" /> Có mô phỏng
                </span>
              )}
            </div>
            <LessonPageView
              page={page}
              answers={answers}
              onAnswerChange={onAnswerChange}
              checkAnswer={(el, value) => isLessonAnswerCorrect(el, value)}
              onElementClick={onElementClick}
              highlightId={selectedElId}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function AiLessonGenerator({ showToast }) {
  const { askConfirm, confirmProps } = useConfirm();
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subject: "", grade: 3, length: "standard", prompt: "" });
  const [draft, setDraft] = useState(null);
  const [meta, setMeta] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [draftVersion, setDraftVersion] = useState(0);
  const [focusElId, setFocusElId] = useState(null);
  const [selectedElId, setSelectedElId] = useState(null);
  const fieldRefs = useRef(new Map());
  const cardRefs = useRef(new Map());
  const focusTimer = useRef(null);

  useEffect(() => {
    let alive = true;
    setupService.listSubjects()
      .then((list) => {
        if (!alive) return;
        const names = (Array.isArray(list) ? list : [])
          .map((s) => s?.name || s?.label || s?.id)
          .filter(Boolean);
        setSubjects(names);
        if (names.length > 0) {
          setForm((f) => (f.subject ? f : { ...f, subject: names[0] }));
        }
      })
      .catch(() => { /* danh mục lỗi → giáo viên tự nhập môn ở ô text */ });
    return () => { alive = false; };
  }, []);

  const bindings = useMemo(() => buildBindings(draft), [draft]);

  const refFor = (elId) => (node) => {
    if (!elId) return;
    if (node) fieldRefs.current.set(elId, node);
    else fieldRefs.current.delete(elId);
  };

  const refForCard = (elId) => (node) => {
    if (!elId) return;
    if (node) cardRefs.current.set(elId, node);
    else cardRefs.current.delete(elId);
  };

  /** Bấm vào phần tử chữ trong preview → focus + cuộn tới ô sửa của nó. */
  const focusFieldForElement = (el) => {
    if (!el || !TEXT_TYPES.has(el.type)) return;
    const node = fieldRefs.current.get(el.id);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    node.focus({ preventScroll: true });
    setFocusElId(el.id);
    if (focusTimer.current) clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => setFocusElId(null), 1800);
  };

  /**
   * Bấm vào BẤT KỲ phần tử nào trong bản xem trước dọc → chọn phần tử đó
   * (viền nhấn trong bản dọc + khoanh thẻ sửa tương ứng ở panel trái):
   * phần tử chữ thì focus thẳng vào ô nhập như trước; câu hỏi/mô phỏng
   * thì cuộn tới thẻ sửa của chúng.
   */
  const handlePreviewElementClick = (el) => {
    if (!el) return;
    setSelectedElId(el.id);
    if (TEXT_TYPES.has(el.type)) {
      focusFieldForElement(el);
      return;
    }
    const card = cardRefs.current.get(el.id);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const patchDraft = (mutate) => {
    setDraft((current) => {
      if (!current) return current;
      const next = JSON.parse(JSON.stringify(current));
      mutate(next);
      return next;
    });
    setDirty(true);
  };

  const setMetaField = (field, value) => patchDraft((d) => { d[field] = value; });
  const setElementText = (elId, text) => patchDraft((d) => {
    const el = findElement(d, elId);
    if (el) el.props = { ...(el.props || {}), text };
  });
  const setQuestionProps = (elId, patch) => patchDraft((d) => {
    const el = findElement(d, elId);
    if (el) el.props = { ...(el.props || {}), ...patch };
  });
  // Cùng cơ chế patch props cho phần tử mô phỏng.
  const setSimulationProps = setQuestionProps;
  const setOptionContent = (elId, optId, content) => patchDraft((d) => {
    const el = findElement(d, elId);
    if (el) {
      el.props = {
        ...(el.props || {}),
        options: (el.props?.options || []).map((o) => (o.id === optId ? { ...o, content } : o)),
      };
    }
  });

  const doGenerate = async () => {
    if (generating) return;
    if (!form.subject) { setError("Hãy chọn môn học cho bài học."); return; }
    if (!form.prompt.trim()) { setError("Hãy nhập yêu cầu soạn bài cho AI."); return; }
    setError("");
    setGenerating(true);
    try {
      const { lesson, meta: m } = await generateLesson({
        prompt: form.prompt, subject: form.subject, gradeLevel: form.grade, length: form.length,
      });
      setDraft(lesson);
      setMeta(m);
      setDirty(false);
      setSelectedElId(null);
      setDraftVersion((v) => v + 1);
      showToast?.("AI đã soạn xong bản nháp — hãy xem lại nội dung trước khi lưu.", "success");
    } catch (e) {
      setError(e?.message || "Không tạo được bài học. Hãy thử lại.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (dirty) {
      askConfirm({
        title: "Tạo lại bài học?",
        message: "AI sẽ soạn lại từ đầu theo yêu cầu ban đầu — các chỉnh sửa bạn vừa làm trên bản nháp sẽ mất. Tiếp tục?",
        confirmLabel: "Tạo lại",
        danger: true,
        onConfirm: doGenerate,
      });
      return;
    }
    doGenerate();
  };

  const handleBackToForm = () => {
    const reset = () => { setDraft(null); setMeta(null); setError(""); setDirty(false); setSelectedElId(null); };
    if (dirty) {
      askConfirm({
        title: "Bỏ bản nháp hiện tại?",
        message: "Bản nháp chưa lưu và các chỉnh sửa sẽ mất. Quay lại form soạn yêu cầu mới?",
        confirmLabel: "Bỏ bản nháp",
        danger: true,
        onConfirm: reset,
      });
      return;
    }
    reset();
  };

  const handleSave = async () => {
    if (!draft || saving) return;
    const problem = validateDraftForSave(draft);
    if (problem) {
      setError(problem);
      showToast?.(problem, "error");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await lessonService.create(buildSavePayload(draft, bindings));
      showToast?.("Đã lưu bài học vào danh sách — mở bài để soạn tiếp hoặc xuất bản.", "success");
      navigate("/dashboard/ai-lesson-creator");
    } catch (e) {
      setError(e?.message || "Không lưu được bài học. Hãy thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const fieldWrapClass = (elId) =>
    `rounded-xl p-1.5 -m-1.5 transition ${focusElId === elId ? "ring-2 ring-[#2F6FED] bg-[#2F6FED]/5" : ""}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <GhostButton onClick={() => navigate("/dashboard/ai-lesson-creator")} className="inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Danh sách bài học
        </GhostButton>
        <div className="min-w-0 flex-1">
          <h1 className="font-display font-bold text-xl text-ink flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" /> Tạo bài học với AI
          </h1>
          <p className="text-sm text-ink/60">
            AI soạn bản nháp hoàn chỉnh kèm mô phỏng tương tác — bản xem trước hiện toàn bộ các trang xếp dọc như học sinh sẽ học, bấm vào phần tử bất kỳ trong bản xem trước để sửa, rồi lưu vào danh sách bài học.
          </p>
        </div>
        {draft && (
          <div className="flex gap-2">
            <GhostButton onClick={handleRegenerate} disabled={generating} className="inline-flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" /> Tạo lại
            </GhostButton>
            <PrimaryButton onClick={handleSave} disabled={saving || generating} className="inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> {saving ? "Đang lưu…" : "Lưu vào danh sách bài học"}
            </PrimaryButton>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-[#D64545]/40 bg-[#FDECEC] px-4 py-3 text-sm text-[#7A1F1F]">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(400px,5fr)_7fr] items-start">
        {/* ── Panel trái: form nhập / trình sửa cấu trúc (sticky ở màn hình rộng) ── */}
        <section className="note-card p-4 sm:p-5 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
          {!draft ? (
            <div>
              <span className="studio-field-label">Môn học</span>
              {subjects.length > 0 ? (
                <Select
                  value={form.subject}
                  onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                  options={subjects.map((name) => ({ value: name, label: name }))}
                />
              ) : (
                <input className="studio-field" value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="VD: Toán" />
              )}

              <span className="studio-field-label">Cấp học</span>
              <Select
                value={String(form.grade)}
                onChange={(v) => setForm((f) => ({ ...f, grade: Number(v) || 3 }))}
                options={[1, 2, 3, 4, 5].map((g) => ({ value: String(g), label: `Lớp ${g}` }))}
              />

              <span className="studio-field-label">Độ dài bài học</span>
              <div className="grid grid-cols-3 gap-2">
                {LENGTH_OPTIONS.map((opt) => (
                  <button key={opt.id} type="button"
                    onClick={() => setForm((f) => ({ ...f, length: opt.id }))}
                    className={`rounded-xl border px-2 py-2 text-left transition ${
                      form.length === opt.id
                        ? "border-[#2F6FED] bg-[#2F6FED]/10"
                        : "border-ink/15 bg-paper2 hover:border-ink/30"
                    }`}>
                    <span className="block text-sm font-semibold text-ink">{opt.label}</span>
                    <span className="block text-xs text-ink/55">{opt.hint}</span>
                  </button>
                ))}
              </div>

              <span className="studio-field-label">Bạn muốn AI soạn bài gì?</span>
              <textarea className="studio-field" rows={6} value={form.prompt}
                onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
                placeholder="VD: Soạn bài về phép nhân với số có một chữ số, nhiều ví dụ gần gũi, câu hỏi kiểm tra ở mức vừa…" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.map((s) => (
                  <button key={s} type="button"
                    onClick={() => setForm((f) => ({ ...f, prompt: s }))}
                    className="rounded-full border border-ink/15 bg-paper2 px-3 py-1.5 text-xs text-ink/75 hover:border-[#8B5CF6] hover:text-ink transition text-left">
                    {s}
                  </button>
                ))}
              </div>

              <PrimaryButton onClick={doGenerate} disabled={generating}
                className="mt-5 w-full inline-flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> {generating ? "AI đang soạn bài…" : "✨ Tạo bài học với AI"}
              </PrimaryButton>
              <p className="mt-2 text-xs text-ink/55">
                Bài AI soạn chỉ là bản nháp — bạn xem trước, chỉnh sửa rồi mới lưu. Nội dung chưa kiểm chứng, hãy đọc lại trước khi xuất bản cho học sinh.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-bold text-ink flex-1">Chỉnh sửa bản nháp</h2>
                <GhostButton onClick={handleBackToForm} className="inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Soạn yêu cầu mới
                </GhostButton>
              </div>
              <p className="text-xs text-ink/55 mb-3">
                Mẹo: bấm vào bất kỳ phần tử nào trong bản xem trước bên phải để nhảy tới đúng chỗ sửa của phần tử đó.
              </p>

              <span className="studio-field-label">Tiêu đề bài học</span>
              <input className="studio-field" value={draft.title}
                onChange={(e) => setMetaField("title", e.target.value)} maxLength={200} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="studio-field-label">Môn học</span>
                  <input className="studio-field" value={draft.subject || ""}
                    onChange={(e) => setMetaField("subject", e.target.value)} maxLength={100} />
                </div>
                <div>
                  <span className="studio-field-label">Lớp</span>
                  <select className="studio-field" value={draft.grade ?? ""}
                    onChange={(e) => setMetaField("grade", e.target.value === "" ? null : Number(e.target.value))}>
                    <option value="">Chưa phân lớp</option>
                    {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
                  </select>
                </div>
              </div>

              <span className="studio-field-label">Mô tả</span>
              <input className="studio-field" value={draft.description || ""}
                onChange={(e) => setMetaField("description", e.target.value)} maxLength={2000} />

              <span className="studio-field-label">Mục tiêu học tập (mỗi mục tiêu một dòng)</span>
              <textarea className="studio-field" rows={3} value={draft.objectives || ""}
                onChange={(e) => setMetaField("objectives", e.target.value)} />

              {bindings.sections.map((s, i) => {
                const headingEl = s.headingElId ? findElement(draft, s.headingElId) : null;
                const hookEl = s.hookElId ? findElement(draft, s.hookElId) : null;
                const contentEl = s.contentElId ? findElement(draft, s.contentElId) : null;
                const exampleEl = s.exampleElId ? findElement(draft, s.exampleElId) : null;
                const takeawayEl = s.takeawayElId ? findElement(draft, s.takeawayElId) : null;
                return (
                  <div key={s.pageId} className="mt-4 rounded-2xl border border-ink/10 bg-paper2/60 p-3">
                    <p className="font-display font-semibold text-sm text-ink mb-2">Phần {i + 1}</p>
                    {headingEl && (
                      <div className={fieldWrapClass(s.headingElId)}>
                        <span className="studio-field-label">Tiêu đề phần</span>
                        <input className="studio-field" ref={refFor(s.headingElId)} value={headingEl.props?.text || ""}
                          onChange={(e) => setElementText(s.headingElId, e.target.value)} maxLength={200} />
                      </div>
                    )}
                    {hookEl && (
                      <div className={fieldWrapClass(s.hookElId)}>
                        <span className="studio-field-label">Câu dẫn nhập (xoá trắng nếu không cần)</span>
                        <textarea className="studio-field" ref={refFor(s.hookElId)} rows={2} value={hookEl.props?.text || ""}
                          onChange={(e) => setElementText(s.hookElId, e.target.value)} />
                      </div>
                    )}
                    {contentEl && (
                      <div className={fieldWrapClass(s.contentElId)}>
                        <span className="studio-field-label">Nội dung</span>
                        <textarea className="studio-field" ref={refFor(s.contentElId)} rows={6} value={contentEl.props?.text || ""}
                          onChange={(e) => setElementText(s.contentElId, e.target.value)} />
                      </div>
                    )}
                    {exampleEl && (
                      <div className={fieldWrapClass(s.exampleElId)}>
                        <span className="studio-field-label">Ví dụ minh hoạ (xoá trắng nếu không cần)</span>
                        <textarea className="studio-field" ref={refFor(s.exampleElId)} rows={3} value={exampleEl.props?.text || ""}
                          onChange={(e) => setElementText(s.exampleElId, e.target.value)} />
                      </div>
                    )}
                    {takeawayEl && (
                      <div className={fieldWrapClass(s.takeawayElId)}>
                        <span className="studio-field-label">Điểm cần ghi nhớ (xoá trắng nếu không cần)</span>
                        <textarea className="studio-field" ref={refFor(s.takeawayElId)} rows={2} value={takeawayEl.props?.text || ""}
                          onChange={(e) => setElementText(s.takeawayElId, e.target.value)} />
                      </div>
                    )}
                  </div>
                );
              })}

              {bindings.simulations.map((sim, i) => {
                const el = findElement(draft, sim.elId);
                if (!el) return null;
                const p = el.props || {};
                return (
                  <div key={sim.elId} ref={refForCard(sim.elId)}
                    className={`mt-4 rounded-2xl border bg-paper2/60 p-3 transition ${
                      selectedElId === sim.elId ? "border-[#0E7490] ring-2 ring-[#0E7490]/40" : "border-ink/10"
                    }`}>
                    <p className="font-display font-semibold text-sm text-ink mb-2 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-[#0E7490]" /> Mô phỏng {bindings.simulations.length > 1 ? i + 1 : ""}
                      <span className="text-xs font-normal text-ink/55">— nằm ở trang riêng ngay sau phần của nó, bấm từng bước ngay trong bản xem trước</span>
                    </p>
                    <span className="studio-field-label">Tiêu đề mô phỏng</span>
                    <input className="studio-field" value={p.title || ""}
                      onChange={(e) => setSimulationProps(sim.elId, { title: e.target.value })} maxLength={120} />
                    <span className="studio-field-label">Giới thiệu (có thể để trống)</span>
                    <input className="studio-field" value={p.intro || ""}
                      onChange={(e) => setSimulationProps(sim.elId, { intro: e.target.value })} maxLength={300} />
                    <span className="studio-field-label">Các bước mô phỏng (mỗi dòng một bước, từ 2 đến 5 bước)</span>
                    <textarea className="studio-field" rows={5}
                      value={(Array.isArray(p.steps) ? p.steps : []).join("\n")}
                      onChange={(e) => setSimulationProps(sim.elId, { steps: e.target.value.split("\n") })} />
                    {p.visual && (
                      <p className="mt-1 text-xs text-ink/55">
                        Hình minh hoạ: {p.visual.kind === "fraction"
                          ? `thanh phân số ${p.visual.numerator}/${p.visual.denominator}`
                          : p.visual.kind === "numberline"
                            ? `trục số từ ${p.visual.from} đến ${p.visual.to}, đích ${p.visual.highlight}`
                            : `${p.visual.groups} nhóm × ${p.visual.perGroup} vật`}
                        {" "}(AI tạo sẵn theo nội dung bài — sửa số liệu trong Studio sau khi lưu nếu cần).
                      </p>
                    )}
                  </div>
                );
              })}

              {bindings.summary?.textElId && (() => {
                const summaryEl = findElement(draft, bindings.summary.textElId);
                return summaryEl ? (
                  <div className={`mt-4 rounded-2xl border border-ink/10 bg-paper2/60 p-3 ${fieldWrapClass(bindings.summary.textElId)}`}>
                    <span className="studio-field-label">Tổng kết bài học (trang cuối phần nội dung)</span>
                    <textarea className="studio-field" ref={refFor(bindings.summary.textElId)} rows={4}
                      value={summaryEl.props?.text || ""}
                      onChange={(e) => setElementText(bindings.summary.textElId, e.target.value)} />
                  </div>
                ) : null;
              })()}

              {bindings.quiz.length > 0 && (
                <div className="mt-4">
                  <p className="font-display font-semibold text-sm text-ink mb-2">
                    Câu hỏi kiểm tra ({bindings.quiz.length} câu)
                  </p>
                  {bindings.quiz.map((q, qi) => {
                    const el = findElement(draft, q.elId);
                    if (!el) return null;
                    const p = el.props || {};
                    return (
                      <div key={q.elId} ref={refForCard(q.elId)}
                        className={`mb-3 rounded-2xl border bg-paper2/60 p-3 transition ${
                          selectedElId === q.elId ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40" : "border-ink/10"
                        }`}>
                        <span className="studio-field-label">Câu {qi + 1}</span>
                        <textarea className="studio-field" rows={2} value={p.prompt || ""}
                          onChange={(e) => setQuestionProps(q.elId, { prompt: e.target.value })} />
                        <div className="mt-2 space-y-1.5">
                          {(p.options || []).map((opt, oi) => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name={`correct-${q.elId}`} checked={p.correctAnswer === opt.id}
                                onChange={() => setQuestionProps(q.elId, { correctAnswer: opt.id })}
                                className="accent-[#1B998B]" />
                              <span className="text-xs font-bold text-ink/50 w-4">{LETTERS[oi]}</span>
                              <input className="studio-field flex-1" value={opt.content}
                                onChange={(e) => setOptionContent(q.elId, opt.id, e.target.value)} maxLength={500} />
                            </label>
                          ))}
                        </div>
                        <span className="studio-field-label">Giải thích đáp án</span>
                        <input className="studio-field" value={p.explanation || ""}
                          onChange={(e) => setQuestionProps(q.elId, { explanation: e.target.value })} maxLength={1000} />
                      </div>
                    );
                  })}
                  <p className="text-xs text-ink/55">Chọn nút tròn bên trái phương án để đặt đáp án đúng.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Panel phải: bản xem trước DỌC — mọi trang hiện cùng lúc ── */}
        <section>
          {meta?.warnings?.length > 0 && draft && (
            <div className="mb-3 rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-ink/80">
              <ul className="list-disc pl-5 space-y-0.5">
                {meta.warnings.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
          )}
          {generating ? (
            <div className="rounded-2xl border border-ink/10 shadow-sm bg-[#FFFBF2] p-6 animate-pulse min-h-[560px]" aria-label="AI đang soạn bài">
              <div className="h-8 w-2/3 rounded-lg bg-ink/10 mb-6" />
              <div className="space-y-3">
                <div className="h-4 rounded bg-ink/10" />
                <div className="h-4 rounded bg-ink/10 w-11/12" />
                <div className="h-4 rounded bg-ink/10 w-4/5" />
                <div className="h-4 rounded bg-ink/10 w-3/5" />
              </div>
              <div className="mt-8 h-40 rounded-2xl bg-ink/10" />
              <div className="mt-6 space-y-3">
                <div className="h-4 rounded bg-ink/10 w-2/3" />
                <div className="h-4 rounded bg-ink/10 w-1/2" />
              </div>
              <p className="mt-8 text-center text-sm text-ink/50 font-medium">AI đang soạn bài, thường mất vài chục giây…</p>
            </div>
          ) : draft ? (
            <>
              <VerticalPreview
                key={draftVersion}
                draft={draft}
                selectedElId={selectedElId}
                onElementClick={handlePreviewElementClick}
              />
              {meta && (
                <p className="mt-3 text-xs text-ink/55">
                  Bản nháp: {meta.sections ?? bindings.sections.length} phần nội dung
                  {(meta.simulations ?? bindings.simulations.length) > 0
                    ? ` · ${meta.simulations ?? bindings.simulations.length} mô phỏng tương tác`
                    : ""}
                  {" "}· {meta.generatedQuestions ?? bindings.quiz.length} câu kiểm tra
                  {meta.droppedQuestions > 0 ? ` · ${meta.droppedQuestions} câu bị AI trả sai định dạng đã được loại` : ""}
                  {meta.droppedSimulations > 0 ? ` · ${meta.droppedSimulations} mô phỏng bị AI trả sai cấu trúc đã được loại` : ""}.
                  Toàn bộ {draft.pages?.length || 0} trang đang hiện ở trên — cuộn xuống để xem hết, bấm vào phần tử bất kỳ để sửa nhanh.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-ink/10 shadow-sm bg-[#FFFBF2] min-h-[420px] flex flex-col items-center justify-center gap-3 p-8 text-center">
              <Sparkles className="w-10 h-10 text-[#8B5CF6]/60" />
              <p className="font-display font-semibold text-ink">Bản xem trước sẽ hiện ở đây</p>
              <p className="text-sm text-ink/60 max-w-sm">
                Chọn môn học, lớp và mô tả bài bạn muốn soạn ở panel bên trái, rồi bấm
                “✨ Tạo bài học với AI”. Bản nháp hiện ra đầy đủ mọi trang xếp dọc, đúng như học sinh sẽ học.
              </p>
            </div>
          )}
        </section>
      </div>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
