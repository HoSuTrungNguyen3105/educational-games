import { Fragment, useMemo, useEffect, useState } from 'react'
import { gameService, questionService, uid } from '../../services/api.js'
import { THEMES } from '../../lib/setupConstants.js'
import { useTemplates, useSubjects, useCategories } from '../../lib/hooks.js'
import { emptyQuestion } from '../../lib/utils.js'
import { PrimaryButton, GhostButton, IconButton, Loader } from '../../components/ui.jsx'
import Field, { StampToken } from './fields.jsx'
import QuestionImportModal from './QuestionImportModal.jsx'

const ALL_STEPS = [
  { id: "template", label: "Chọn mẫu" },
  { id: "info", label: "Nhập thông tin" },
  { id: "questions", label: "Câu hỏi" },
  { id: "customize", label: "Tùy chỉnh" },
  { id: "preview", label: "Xem trước" },
];

export default function CreateGameFlow({ gameId, onDone, onCancel, showToast }) {
  const [loading, setLoading] = useState(!!gameId);
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState({ name: "", description: "", subject: "", topic: "", templateId: null, theme: "gold", status: "draft" });
  const [questions, setQuestions] = useState([]);
  const [savingStatus, setSavingStatus] = useState(null);
  const templates = useTemplates();
  const subjects = useSubjects();
  const categories = useCategories();

  const selectedTemplate = useMemo(() => templates.find(t => t._id === form.templateId), [templates, form.templateId]);
  const isPlayToWin = selectedTemplate?.type === "play-to-win";
  const playMode = selectedTemplate?.playMode || "solo";

  const steps = useMemo(() => {
    if (isPlayToWin) return ALL_STEPS.filter(s => s.id !== "questions");
    return ALL_STEPS;
  }, [isPlayToWin]);

  useEffect(() => {
    if (!gameId) return;
    (async () => {
      const g = await gameService.get(gameId);
      if (g) {
        const tid = g.templateId ? (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid || g.templateId) : null;
        setForm({ name: g.name || g.title || "", description: g.description, subject: g.subject, topic: g.topic, templateId: tid, theme: g.theme || "gold", status: g.status || "draft" });
        setStepIdx(1);
      }
      const qs = await questionService.listByGame(gameId);
      setQuestions(qs.length ? qs : [emptyQuestion()]);
      setLoading(false);
    })();
  }, [gameId]);

  useEffect(() => { if (!gameId && questions.length === 0) setQuestions([emptyQuestion()]); }, []);

  useEffect(() => {
    if (isPlayToWin && stepIdx >= 2) setStepIdx(1);
  }, [isPlayToWin]);

  const step = steps[stepIdx];
  const canNext = useMemo(() => {
    if (step.id === "template") return !!form.templateId;
    if (step.id === "info") return form.name.trim().length > 2 && form.topic.trim().length > 1;
    if (step.id === "questions") return questions.length > 0 && questions.every(q => q.content.trim() && q.correctAnswer && q.options.every(o => o.content.trim()));
    return true;
  }, [step, form, questions]);

  const persist = async (statusOverride) => {
    const status = statusOverride || form.status || "draft";
    setSavingStatus(status);
    let id = gameId;
    const payload = {
      ...form,
      subject: form.subject || (subjects[0] || ""),
      status,
      type: isPlayToWin ? "play-to-win" : "play-to-learn",
      playMode,
      questionsCount: isPlayToWin ? 0 : questions.length,
    };
    if (id) await gameService.update(id, payload);
    else { const created = await gameService.create(payload); id = created._id?.toString() || created.id; }
    if (!isPlayToWin) await questionService.save(id, questions);
    setSavingStatus(null);
    showToast(status === "published" ? "Đã xuất bản trò chơi" : "Đã lưu bản nháp", "success");
    onDone();
  };

  if (loading) return <Loader label="Đang tải trò chơi..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">{gameId ? "Chỉnh sửa trò chơi" : "Tạo trò chơi mới"}</h1>
        <button onClick={onCancel} className="text-sm text-[#8A7C63] hover:text-ink">Hủy ✕</button>
      </div>

      <Stepper steps={steps} activeIdx={stepIdx} onJump={(i) => i < stepIdx && setStepIdx(i)} />

      <div className="note-card p-6 md:p-8 min-h-[380px]">
        {step.id === "template" && <StepTemplate form={form} setForm={setForm} templates={templates} categories={categories} />}
        {step.id === "info" && <StepInfo form={form} setForm={setForm} subjects={subjects} templates={templates} />}
        {step.id === "questions" && <StepQuestions questions={questions} setQuestions={setQuestions} />}
        {step.id === "customize" && <StepCustomize form={form} setForm={setForm} />}
        {step.id === "preview" && <StepPreview form={form} questions={questions} templates={templates} isPlayToWin={isPlayToWin} />}
      </div>

      <div className="flex items-center justify-between">
        <GhostButton onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx === 0}>← Quay lại</GhostButton>
        <div className="flex gap-3">
          {step.id === "preview" ? (
            <>
              <GhostButton onClick={() => persist("draft")} disabled={savingStatus !== null}>{savingStatus === "draft" ? "Đang lưu..." : "Lưu bản nháp"}</GhostButton>
              <PrimaryButton onClick={() => persist("published")} disabled={savingStatus !== null}>{savingStatus === "published" ? "Đang xuất bản..." : "Xuất bản"}</PrimaryButton>
            </>
          ) : (
            <PrimaryButton onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} disabled={!canNext}>Tiếp tục →</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ steps, activeIdx, onJump }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <Fragment key={s.id}>
          <button onClick={() => onJump(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap font-body transition
              ${i === activeIdx ? "bg-ink text-paper font-semibold" : i < activeIdx ? "bg-teal/15 text-teal" : "bg-ink/5 text-[#8A7C63]"}`}>
            <span className="font-mono">{i + 1}</span>{s.label}
          </button>
          {i < steps.length - 1 && <div className="w-4 sm:w-8 h-px dash-rule flex-shrink-0"></div>}
        </Fragment>
      ))}
    </div>
  );
}

function StepTemplate({ form, setForm, templates, categories }) {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? templates : templates.filter(t => t.category === filter);
  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-1">Chọn mẫu trò chơi</h2>
      <p className="text-sm text-[#8A7C63] mb-4">Mỗi mẫu mang một cách chơi khác nhau — chọn mẫu phù hợp với nội dung ôn tập của bạn.</p>
      {templates.length === 0 ? (
        <div className="py-10 text-center text-sm text-[#8A7C63]">Đang tải mẫu trò chơi...</div>
      ) : (
        <>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-body border transition ${filter === c.id ? "bg-ink text-paper border-ink" : "border-ink/15 text-ink/70 hover:border-ink/35"}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map(t => (
          <button key={t._id} onClick={() => setForm(f => ({ ...f, templateId: t._id }))}
            className={`text-left p-5 rounded-2xl border-2 transition flex gap-4 items-start
              ${form.templateId === t._id ? "border-ticket bg-ticket/5" : "border-ink/10 hover:border-ink/25"}`}>
            <StampToken icon={t.icon} ring={t.ring} size={48} fontSize={22} />
            <div>
              <h3 className="font-display text-base text-ink">{t.name}</h3>
              <p className="text-sm text-[#8A7C63] mt-1">{t.description}</p>
              <span className="inline-block mt-2 text-[10px] font-mono uppercase text-[#B7A987]">{t.category}</span>
            </div>
          </button>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

const inputCls = "w-full note-card px-4 py-2.5 text-sm border-ink/10 focus:border-ticket";

function StepInfo({ form, setForm, subjects, templates }) {
  const currentTpl = templates.find(t => t._id === form.templateId);
  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-6">Nhập thông tin trò chơi</h2>

      {templates.length > 0 && (
        <div className="mb-6">
          <Field label="Mẫu trò chơi" hint="Đổi mẫu sẽ thay đổi cách chơi — HTML template sẽ được tải từ API theo templateId">
            <select
              className={inputCls}
              value={form.templateId || ""}
              onChange={e => setForm(f => ({ ...f, templateId: e.target.value || null }))}
            >
              <option value="">— Chọn mẫu —</option>
              {templates.map(t => (
                <option key={t._id} value={t._id}>
                  {t.icon} {t.name} ({t.type === "play-to-win" ? "chơi để thắng" : "học qua chơi"})
                </option>
              ))}
            </select>
          </Field>
          {currentTpl?.htmlTemplate && (
            <p className="text-xs text-teal mt-1.5">✓ Mẫu này có HTML template riêng (v{currentTpl.version || 1})</p>
          )}
          {currentTpl?.playMode === "classroom" && (
            <p className="text-xs text-ticket mt-1.5 font-semibold">🎓 Chế độ lớp học — giáo viên điều khiển, học sinh lên chơi</p>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-x-6">
        <Field label="Tên trò chơi">
          <input className={inputCls} value={form.name} maxLength={80} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ví dụ: Ôn tập Toán lớp 3" />
        </Field>
        <Field label="Môn học">
          <select className={inputCls} value={form.subject || (subjects[0] || "")} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Chủ đề" hint="Chủ đề cụ thể của bài ôn tập">
          <input className={inputCls} value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="Ví dụ: Phép cộng và phép trừ" />
        </Field>
        <Field label="Ngôn ngữ">
          <select className={inputCls} value={form.language || "vi"} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
            <option value="vi">Tiếng Việt</option>
            <option value="en">Tiếng Anh</option>
          </select>
        </Field>
        <Field label="Trạng thái">
          <select className={inputCls} value={form.status || "draft"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="draft">Nháp</option>
            <option value="published">Xuất bản</option>
          </select>
        </Field>
      </div>
      <Field label="Mô tả">
        <textarea className={inputCls + " min-h-[90px]"} value={form.description} maxLength={200} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả ngắn gọn nội dung trò chơi..." />
      </Field>
    </div>
  );
}

function StepQuestions({ questions, setQuestions }) {
  const [openIdx, setOpenIdx] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const update = (idx, patch) => setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, ...patch } : q));
  const updateOption = (idx, optId, content) => setQuestions(qs => qs.map((q, i) => i !== idx ? q : { ...q, options: q.options.map(o => o.id === optId ? { ...o, content } : o) }));
  const addOption = (idx) => setQuestions(qs => qs.map((q, i) => i !== idx ? q : (q.options.length >= 4 ? q : { ...q, options: [...q.options, { id: uid("answer"), content: "" }] })));
  const removeOption = (idx, optId) => setQuestions(qs => qs.map((q, i) => {
    if (i !== idx || q.options.length <= 2) return q;
    const opts = q.options.filter(o => o.id !== optId);
    return { ...q, options: opts, correctAnswer: q.correctAnswer === optId ? null : q.correctAnswer };
  }));
  const addQuestion = () => { setQuestions(qs => [...qs, emptyQuestion()]); setOpenIdx(questions.length); };
  const removeQuestion = (idx) => { setQuestions(qs => qs.filter((_, i) => i !== idx)); setOpenIdx(0); };
  const move = (idx, dir) => setQuestions(qs => {
    const next = [...qs]; const target = idx + dir;
    if (target < 0 || target >= next.length) return qs;
    [next[idx], next[target]] = [next[target], next[idx]];
    return next;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-ink">Quản lý câu hỏi</h2>
        <span className="text-xs font-mono text-[#8A7C63]">{questions.length} câu hỏi</span>
      </div>
      <div className="flex gap-3 mb-4">
        <GhostButton onClick={addQuestion} className="flex-1">+ Thêm câu hỏi</GhostButton>
        <PrimaryButton onClick={() => setShowImportModal(true)} className="flex-1">Import câu hỏi</PrimaryButton>
      </div>
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id} className="border border-ink/10 rounded-2xl overflow-hidden">
            <button onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)} className="w-full flex items-center justify-between px-4 py-3 bg-ink/[0.03] text-left">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-full bg-ink text-paper text-xs flex items-center justify-center font-mono flex-shrink-0">{idx + 1}</span>
                <span className="font-body text-sm text-ink truncate">{q.content || "Câu hỏi mới — nhấn để chỉnh sửa"}</span>
              </span>
              <span className="text-[#8A7C63] text-xs flex-shrink-0 ml-2">{openIdx === idx ? "▲" : "▼"}</span>
            </button>
            {openIdx === idx && (
              <div className="p-4 sm:p-5 border-t border-ink/10 space-y-4">
                <Field label="Nội dung câu hỏi">
                  <textarea className={inputCls} value={q.content} onChange={e => update(idx, { content: e.target.value })} placeholder="Nhập câu hỏi..." />
                </Field>
                <div>
                  <span className="block text-sm font-semibold text-ink mb-2">Phương án trả lời (chọn ô tròn cho đáp án đúng)</span>
                  <div className="space-y-2">
                    {q.options.map(o => (
                      <div key={o.id} className="flex items-center gap-2">
                        <button onClick={() => update(idx, { correctAnswer: o.id })}
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${q.correctAnswer === o.id ? "bg-teal border-teal text-white" : "border-ink/25"}`}>
                          {q.correctAnswer === o.id && "✓"}
                        </button>
                        <input className={inputCls} value={o.content} onChange={e => updateOption(idx, o.id, e.target.value)} placeholder="Nội dung đáp án" />
                        {q.options.length > 2 && <button onClick={() => removeOption(idx, o.id)} className="text-[#B7A987] hover:text-ticket px-1">✕</button>}
                      </div>
                    ))}
                  </div>
                  {q.options.length < 4 && <button onClick={() => addOption(idx)} className="text-sm text-ticket font-semibold mt-2 hover:underline">+ Thêm đáp án</button>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Thời gian trả lời (giây)">
                    <input type="number" min={5} max={120} className={inputCls} value={q.timeLimit} onChange={e => update(idx, { timeLimit: Number(e.target.value) || 5 })} />
                  </Field>
                  <Field label="Điểm số">
                    <input type="number" min={10} step={10} className={inputCls} value={q.points} onChange={e => update(idx, { points: Number(e.target.value) || 10 })} />
                  </Field>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    <IconButton title="Di chuyển lên" onClick={() => move(idx, -1)}>↑</IconButton>
                    <IconButton title="Di chuyển xuống" onClick={() => move(idx, 1)}>↓</IconButton>
                  </div>
                  {questions.length > 1 && <button onClick={() => removeQuestion(idx)} className="text-sm text-ticket font-semibold hover:underline">Xóa câu hỏi</button>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {showImportModal && (
        <QuestionImportModal 
          onClose={() => setShowImportModal(false)} 
          onImport={(imported) => {
            const mapped = imported.filter(q => q.status === 'valid').map(q => {
              const opts = q.answers.map(a => ({ id: uid("answer"), content: a.content, _key: a.key }));
              const correctOpt = opts.find(o => o._key === q.correctAnswer);
              return {
                id: uid("question"),
                content: q.question,
                options: opts.map(({ id, content }) => ({ id, content })),
                correctAnswer: correctOpt ? correctOpt.id : null,
                timeLimit: q.time || 20,
                points: q.score || 100
              };
            });
            if (questions.length === 1 && questions[0].content === "") {
              setQuestions(mapped);
            } else {
              setQuestions(prev => [...prev, ...mapped]);
            }
          }} 
        />
      )}
    </div>
  );
}

function StepCustomize({ form, setForm }) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-1">Tùy chỉnh giao diện</h2>
      <p className="text-sm text-[#8A7C63] mb-6">Chọn tông màu vé sẽ hiển thị cho học sinh khi chơi.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {THEMES.map(t => (
          <button key={t.id} onClick={() => setForm(f => ({ ...f, theme: t.id }))}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${form.theme === t.id ? "border-ink" : "border-ink/10 hover:border-ink/25"}`}>
            <div className="w-12 h-12 rounded-full stamp-token" style={{ "--ring": t.color, background: t.color + "22" }}></div>
            <span className="text-sm font-body">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepPreview({ form, questions, templates, isPlayToWin }) {
  const tpl = templates.find(t => t._id === form.templateId);
  const themeColor = (THEMES.find(t => t.id === form.theme) || THEMES[0]).color;
  const hasHtml = tpl?.htmlTemplate && tpl.htmlTemplate.trim() !== "";

  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-6">Xem trước</h2>
      <div className="rounded-3xl p-6 sm:p-8" style={{ background: `${themeColor}14` }}>
        <div className="flex items-center gap-4 mb-6">
          <StampToken icon={tpl ? tpl.icon : "🎲"} ring={themeColor} size={56} fontSize={26} />
          <div>
            <h3 className="font-display text-2xl text-ink">{form.name || "Tên trò chơi"}</h3>
            <p className="text-sm text-[#8A7C63]">{form.subject} · {form.topic || "Chủ đề"}</p>
          </div>
        </div>
        <p className="text-sm text-[#8A7C63] mb-4">{form.description || "Chưa có mô tả."}</p>
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${form.status === "published" ? "bg-teal/15 text-teal" : "bg-ink/10 text-ink/60"}`}>
            {form.status === "published" ? "✓ Xuất bản" : "Nháp"}
          </span>
        </div>

        {hasHtml && (
          <div className="mb-6">
            <span className="text-xs font-mono text-[#8A7C63] uppercase mb-2 block">HTML Preview</span>
            <div className="rounded-2xl overflow-hidden border-2 border-ink/10" style={{ height: 420 }}>
              <iframe srcDoc={tpl.htmlTemplate} className="w-full h-full border-0" title="HTML Preview" sandbox="allow-scripts" />
            </div>
          </div>
        )}

        {!hasHtml && (
          <div className="mb-6 p-4 rounded-2xl bg-ink/5 text-sm text-[#8A7C63]">
            Template này chưa có HTML. Hãy cập nhật HTML trong trang quản lý template.
          </div>
        )}

        {!isPlayToWin && questions.length > 0 && (
          <div>
            <span className="text-xs font-mono text-[#8A7C63] uppercase mb-3 block">Danh sách câu hỏi ({questions.length})</span>
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="note-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="w-6 h-6 rounded-full bg-ink text-paper text-xs flex items-center justify-center font-mono flex-shrink-0">{idx + 1}</span>
                    <span className="text-xs font-mono text-[#8A7C63]">⏱ {q.timeLimit}s · ⭐ {q.points}</span>
                  </div>
                  <p className="font-body text-sm text-ink mb-2">{q.content || "—"}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((o, i) => (
                      <div key={o.id} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: o.id === q.correctAnswer ? "#1B998B" : "#E7D9BE", background: o.id === q.correctAnswer ? "#1B998B15" : "transparent" }}>
                        {String.fromCharCode(65 + i)}. {o.content || "—"}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isPlayToWin && questions.length === 0 && (
          <div className="p-4 rounded-2xl bg-ink/5 text-sm text-[#8A7C63]">
            Chưa có câu hỏi nào. Hãy quay lại bước "Câu hỏi" để thêm.
          </div>
        )}
      </div>
    </div>
  );
}
