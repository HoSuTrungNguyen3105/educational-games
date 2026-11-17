import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlaskConical, Info, MessagesSquare, Pencil, Save, Send, SlidersHorizontal, Trash2, Wrench, X,
} from "lucide-react";
import {
  ConfirmModal, GhostButton, Input, ManagementHeader, PrimaryButton, Select, ToggleSwitch,
} from "../../components/ui";
import { setupService } from "../../services/setupService.js";
import {
  createCorrection, deleteCorrection, getTutorConfig, listCorrections,
  playgroundChat, saveTutorConfig, updateCorrection,
} from "../../services/aiApi.js";
import AiMarkdown from "../../components/ai/AiMarkdown.jsx";

/* AiStudioPage — trang AI Studio MỚI ở /dashboard/ai-studio (nhóm AI),
 * xây theo REFACTOR_AI_STUDIO.md Bước 2: trung tâm cấu hình hành vi Gia sư
 * AI (RAG) + quản lý tri thức ưu tiên, gồm 3 tab:
 *   • config     — Cấu hình Gia sư AI (prompt & guardrails)
 *   • override   — Đính chính kiến thức (Knowledge Override)
 *   • playground — Kiểm thử RAG
 * Trạng thái nối backend — CẢ 3 TAB ĐÃ NỐI BACKEND THẬT:
 *   • Tab Cấu hình: GET/PUT /api/ai/tutor-config — cấu hình lưu ở
 *     system_config theo khoá (cấp × môn) và được áp vào chat THẬT của
 *     học sinh ở backend (chỉ thị bổ sung + temperature + guardrail
 *     phạm vi chốt ở backend, cùng cơ chế với bản nháp ở Tab Kiểm thử).
 *   • Tab Đính chính: CRUD /api/ai/corrections — bản ghi được Gia sư AI
 *     truy xuất theo TỪ KHOÁ với ưu tiên cao nhất (hệ thống chưa có
 *     vector/embedding), chèn trước tài liệu bài học trong prompt.
 *   • Tab Kiểm thử: POST /api/ai/playground/chat — pipeline chat thật
 *     kèm cấu hình NHÁP của Tab 1 gửi theo từng lượt thử (không phải bản
 *     đã lưu). Nguồn hiển thị dưới câu trả lời là dữ liệu truy xuất thật;
 *     "điểm khớp" là điểm từ khoá, không phải độ tương đồng vector.
 * (Trang tạo bài học cũ đã tách sang /dashboard/ai-lesson-creator.)
 * Tab đồng bộ qua ?tab= trên hash như trang Avatar gộp. */

const TABS = [
  { key: "config", label: "Cấu hình Gia sư AI", icon: SlidersHorizontal },
  { key: "override", label: "Đính chính kiến thức", icon: Wrench },
  { key: "playground", label: "Kiểm thử RAG", icon: FlaskConical },
];
const TAB_KEYS = TABS.map((t) => t.key);
const BASE_HASH = "#/dashboard/ai-studio";

/* Router tự chế bỏ qua query khi match route nên trang tự đọc ?tab= từ hash. */
function tabFromHash() {
  const query = (window.location.hash || "").split("?")[1] || "";
  const tab = new URLSearchParams(query).get("tab");
  return TAB_KEYS.includes(tab) ? tab : null;
}

const LEVEL_OPTIONS = [
  { value: "default", label: "Mặc định toàn hệ thống" },
  { value: "tieu-hoc", label: "Tiểu học" },
  { value: "thcs", label: "THCS" },
  { value: "thpt", label: "THPT" },
  { value: "dai-hoc", label: "Đại học" },
];
const OVERRIDE_LEVEL_OPTIONS = [
  { value: "", label: "Tất cả cấp học" },
  ...LEVEL_OPTIONS.filter((o) => o.value !== "default"),
];

/* Dự phòng khi API môn học lỗi/trống — danh sách thật từ /api/subjects
 * (setupService.listSubjects) luôn được ưu tiên khi tải được. */
const FALLBACK_SUBJECTS = [
  "Toán", "Ngữ văn", "Tiếng Anh", "Khoa học tự nhiên", "Lịch sử", "Địa lí",
  "Tin học", "Vật lí", "Hoá học", "Sinh học", "Giáo dục công dân",
];

const PROMPT_VARIABLES = ["{ten_mon_hoc}", "{cap_hoc}", "{ten_bai_hoc}"];

const DEFAULT_PROMPT = [
  "Bạn là Gia sư AI của EduPlay, hỗ trợ học sinh môn {ten_mon_hoc} ({cap_hoc}) trong bài học “{ten_bai_hoc}”.",
  "Chỉ gợi ý phương pháp giải và đặt câu hỏi dẫn dắt, không đưa ra đáp án cuối cùng.",
  "Trả lời ngắn gọn, thân thiện, dùng ngôn ngữ phù hợp với lứa tuổi của học sinh.",
].join("\n");

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-ink/5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {desc && <p className="text-xs text-ink/55 mt-0.5">{desc}</p>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

export default function AiStudioPage({ showToast }) {
  const [tab, setTab] = useState(() => tabFromHash() || "config");


  /* Hash đổi từ bên ngoài (back/forward, bấm menu về route chuẩn không kèm
   * ?tab=) thì tab đi theo URL. */
  useEffect(() => {
    const sync = () => {
      const fromUrl = tabFromHash();
      if (fromUrl) setTab(fromUrl);
      else if ((window.location.hash || "").startsWith(BASE_HASH)) setTab("config");
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const switchTab = useCallback((key) => {
    setTab(key);
    /* replaceState: cập nhật ?tab= mà không bắn hashchange (tránh useRoute
     * cuộn lên đầu trang) và không thêm mục history cho mỗi lần đổi tab. */
    window.history.replaceState(null, "", `${BASE_HASH}?tab=${key}`);
  }, []);

  // ── Danh sách môn học thật từ hệ thống (dùng cho cả Tab 1 và Tab 2) ──
  const [subjectNames, setSubjectNames] = useState(FALLBACK_SUBJECTS);
  useEffect(() => {
    let alive = true;
    setupService.listSubjects()
      .then((list) => {
        if (!alive) return;
        const names = (Array.isArray(list) ? list : [])
          .map((s) => s?.name || s?.label || s?.id)
          .filter(Boolean);
        if (names.length) setSubjectNames(names);
      })
      .catch(() => { /* giữ danh sách dự phòng — môn học chỉ là lựa chọn khung */ });
    return () => { alive = false; };
  }, []);
  const subjectOptions = [
    { value: "", label: "Tất cả môn học" },
    ...subjectNames.map((name) => ({ value: name, label: name })),
  ];

  // ── Tab 1: Cấu hình Gia sư AI (LƯU THẬT ở backend theo khoá cấp × môn) ──
  const [cfgLevel, setCfgLevel] = useState("default");
  const [cfgSubject, setCfgSubject] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [temperature, setTemperature] = useState(0.2);
  const [guardrails, setGuardrails] = useState({
    scopeOnly: true,
    requireCitation: true,
    refuseOffTopic: false,
  });
  const promptRef = useRef(null);
  /* Trạng thái bản ĐÃ LƯU của khoá đang chọn: cfgHasSaved=false nghĩa là
   * khoá này chưa có cấu hình riêng — form đang hiển thị bộ mặc định. */
  const [cfgLoading, setCfgLoading] = useState(false);
  const [cfgSaving, setCfgSaving] = useState(false);
  const [cfgHasSaved, setCfgHasSaved] = useState(false);
  const [cfgSavedAt, setCfgSavedAt] = useState(null);

  const applyFormDefaults = useCallback(() => {
    setPrompt(DEFAULT_PROMPT);
    setTemperature(0.2);
    setGuardrails({ scopeOnly: true, requireCitation: true, refuseOffTopic: false });
    setCfgHasSaved(false);
    setCfgSavedAt(null);
  }, []);

  /* Đổi cấp/môn → nạp cấu hình ĐÃ LƯU của đúng khoá đó. Chưa có thì về
   * mặc định của form và ghi rõ chưa có cấu hình riêng. */
  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- bật cờ loading trước khi fetch bất đồng bộ, setState còn lại đều sau await
    setCfgLoading(true);
    getTutorConfig(cfgLevel, cfgSubject)
      .then((res) => {
        if (!alive) return;
        if (res?.config) {
          setPrompt(res.config.systemPrompt || "");
          setTemperature(typeof res.config.temperature === "number" ? res.config.temperature : 0.2);
          setGuardrails({
            scopeOnly: res.config.scopeOnly === true,
            requireCitation: res.config.requireCitation === true,
            refuseOffTopic: res.config.refuseOffTopic === true,
          });
          setCfgHasSaved(true);
          setCfgSavedAt(res.config.updatedAt || null);
        } else {
          applyFormDefaults();
        }
      })
      .catch((e) => {
        if (!alive) return;
        applyFormDefaults();
        showToast?.(e?.message || "Không đọc được cấu hình Gia sư AI đã lưu", "error");
      })
      .finally(() => { if (alive) setCfgLoading(false); });
    return () => { alive = false; };
  }, [cfgLevel, cfgSubject, applyFormDefaults, showToast]);

  const saveConfig = async () => {
    if (cfgSaving || cfgLoading) return;
    setCfgSaving(true);
    try {
      const res = await saveTutorConfig({
        level: cfgLevel,
        subject: cfgSubject,
        systemPrompt: prompt,
        temperature,
        scopeOnly: guardrails.scopeOnly,
        requireCitation: guardrails.requireCitation,
        refuseOffTopic: guardrails.refuseOffTopic,
      });
      setCfgHasSaved(true);
      setCfgSavedAt(res?.config?.updatedAt || null);
      showToast?.("Đã lưu cấu hình Gia sư AI — áp dụng cho chat thật từ lượt hỏi tiếp theo", "success");
    } catch (e) {
      showToast?.(e?.message || "Không lưu được cấu hình Gia sư AI", "error");
    } finally {
      setCfgSaving(false);
    }
  };

  const insertVariable = (token) => {
    const el = promptRef.current;
    if (!el) { setPrompt((p) => p + token); return; }
    const start = el.selectionStart ?? prompt.length;
    const end = el.selectionEnd ?? prompt.length;
    setPrompt(prompt.slice(0, start) + token + prompt.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  // ── Tab 2: Đính chính kiến thức (CRUD THẬT qua /api/ai/corrections) ──
  const [ovSubject, setOvSubject] = useState("");
  const [ovLevel, setOvLevel] = useState("");
  const [ovTopic, setOvTopic] = useState("");
  const [ovContent, setOvContent] = useState("");
  const [overrideRecords, setOverrideRecords] = useState([]);
  const [ovLoading, setOvLoading] = useState(false);
  const [ovSaving, setOvSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [ovConfirmDelete, setOvConfirmDelete] = useState(null);
  const [ovDeleting, setOvDeleting] = useState(false);
  /* Ghi chú tham chiếu từ nút "Dạy lại AI" ở Lịch sử hỏi AI: câu trả lời
   * AI đã đưa (có thể sai) — CHỈ để giáo viên đối chiếu khi viết đính
   * chính, không tự điền vào ô nội dung chuẩn. */
  const [reteachNote, setReteachNote] = useState(null);

  const loadCorrections = useCallback(async () => {
    setOvLoading(true);
    try {
      const res = await listCorrections();
      setOverrideRecords(Array.isArray(res?.items) ? res.items : []);
    } catch (e) {
      showToast?.(e?.message || "Không đọc được danh sách đính chính kiến thức", "error");
    } finally {
      setOvLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loadCorrections tự setState bất đồng bộ sau await
    loadCorrections();
  }, [loadCorrections]);

  /* Prefill từ "Dạy lại AI" (Lịch sử hỏi AI): URL dạng
   * #/dashboard/ai-studio?tab=override&topic=...&answer=... — topic đổ
   * vào ô chủ đề, câu trả lời AI cũ chỉ hiện ở ghi chú tham chiếu. */
  useEffect(() => {
    const query = (window.location.hash || "").split("?")[1] || "";
    const params = new URLSearchParams(query);
    const topic = params.get("topic");
    if (!topic) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill một lần khi mở trang từ nút "Dạy lại AI", không phải vòng render lặp
    setOvTopic(topic.slice(0, 300));
    const answer = params.get("answer");
    if (answer) setReteachNote({ answer: answer.slice(0, 400) });
    setTab("override");
  }, []);

  const resetOvForm = () => {
    setOvSubject("");
    setOvLevel("");
    setOvTopic("");
    setOvContent("");
    setEditingId(null);
  };

  const submitCorrection = async () => {
    if (ovSaving) return;
    if (!ovTopic.trim()) { showToast?.("Hãy nhập Câu hỏi / Chủ đề cần đính chính", "error"); return; }
    if (!ovContent.trim()) { showToast?.("Hãy nhập Nội dung kiến thức chuẩn xác", "error"); return; }
    setOvSaving(true);
    try {
      if (editingId) {
        await updateCorrection(editingId, {
          subject: ovSubject, level: ovLevel, topic: ovTopic.trim(), content: ovContent.trim(),
        });
        showToast?.("Đã cập nhật đính chính kiến thức", "success");
      } else {
        await createCorrection({
          subject: ovSubject, level: ovLevel, topic: ovTopic.trim(), content: ovContent.trim(),
        });
        showToast?.("Đã lưu đính chính kiến thức — Gia sư AI sẽ ưu tiên dùng khi học sinh hỏi đúng chủ đề", "success");
      }
      resetOvForm();
      setReteachNote(null);
      await loadCorrections();
    } catch (e) {
      showToast?.(e?.message || "Không lưu được đính chính kiến thức", "error");
    } finally {
      setOvSaving(false);
    }
  };

  const startEditCorrection = (r) => {
    setEditingId(r.id);
    setOvSubject(r.subject || "");
    setOvLevel(r.level || "");
    setOvTopic(r.topic || "");
    setOvContent(r.content || "");
    setReteachNote(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCorrectionActive = async (r) => {
    try {
      await updateCorrection(r.id, { active: !r.active });
      setOverrideRecords((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: !r.active } : x)));
    } catch (e) {
      showToast?.(e?.message || "Không đổi được trạng thái đính chính", "error");
    }
  };

  const doDeleteCorrection = async () => {
    if (!ovConfirmDelete || ovDeleting) return;
    setOvDeleting(true);
    try {
      await deleteCorrection(ovConfirmDelete.id);
      showToast?.("Đã xoá đính chính kiến thức", "success");
      if (editingId === ovConfirmDelete.id) resetOvForm();
      setOvConfirmDelete(null);
      await loadCorrections();
    } catch (e) {
      showToast?.(e?.message || "Không xoá được đính chính kiến thức", "error");
    } finally {
      setOvDeleting(false);
    }
  };

  const levelLabelOf = (value) => {
    if (!value) return "Tất cả cấp học";
    return OVERRIDE_LEVEL_OPTIONS.find((o) => o.value === value)?.label || value;
  };

  // ── Tab 3: Kiểm thử Gia sư AI (ĐÃ nối backend thật) ──
  const [draft, setDraft] = useState("");
  /* Hội thoại kiểm thử: tin nhắn AI kèm `sources` THẬT từ backend (bài học
   * + đoạn trích + điểm khớp từ khoá) và cờ `refused` khi guardrail phạm
   * vi chặn ở tầng backend. */
  const [pgMessages, setPgMessages] = useState([]);
  const [pgSending, setPgSending] = useState(false);
  const [pgError, setPgError] = useState("");
  const pgIdRef = useRef(0);
  const nextPgId = () => { pgIdRef.current += 1; return pgIdRef.current; };

  /* Cấu hình NHÁP lấy từ state của Tab 1 (cùng cấp trang nên Tab 3 dùng
   * chung bản nháp, không cần lưu trữ): cấp học gửi nhãn hiển thị để
   * backend thay biến {cap_hoc}; "Mặc định toàn hệ thống" thì không gửi. */
  const buildPlaygroundConfig = useCallback(() => ({
    systemPrompt: prompt,
    temperature,
    strictScope: guardrails.scopeOnly,
    requireCitation: guardrails.requireCitation,
    refuseOffTopic: guardrails.refuseOffTopic,
    level: LEVEL_OPTIONS.find((o) => o.value === cfgLevel && o.value !== "default")?.label,
    subject: cfgSubject || undefined,
  }), [prompt, temperature, guardrails, cfgLevel, cfgSubject]);

  const submitQuestion = async (e) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || pgSending) return;
    const history = pgMessages.map((m) => ({ role: m.role, content: m.text }));
    setPgMessages((prev) => [...prev, { id: nextPgId(), role: "user", text }]);
    setDraft("");
    setPgError("");
    setPgSending(true);
    try {
      const res = await playgroundChat({ message: text, history, config: buildPlaygroundConfig() });
      setPgMessages((prev) => [...prev, {
        id: nextPgId(),
        role: "assistant",
        text: res.answer,
        sources: Array.isArray(res.sources) ? res.sources : [],
        refused: res.refused === true,
        refusalReason: res.refusalReason || null,
      }]);
    } catch (err) {
      /* Lỗi trung thực từ backend (AI tắt/chưa cấu hình/hết hạn mức…) —
       * hiển thị nguyên văn thông điệp server, không bịa câu trả lời. */
      setPgError(err?.message || "Không gửi được câu hỏi kiểm thử. Hãy thử lại.");
    } finally {
      setPgSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <ManagementHeader
        title="AI Studio"
        subtitle="Trung tâm cấu hình hành vi Gia sư AI (RAG) và quản lý tri thức ưu tiên"
      />

      {/* Banner trung thực trạng thái: cả 3 tab đã nối backend thật. */}
      <div className="note-card px-4 py-3 flex items-start gap-2.5">
        <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#8A7C63]" />
        <p className="text-sm text-ink/75">
          <strong className="text-ink">Cả 3 tab đã nối backend thật.</strong>{" "}
          Cấu hình ở Tab Cấu hình được lưu theo cấp × môn và áp vào chat thật của học sinh;
          bản ghi ở Tab Đính chính được Gia sư AI truy xuất theo <strong className="text-ink">từ khoá</strong>{" "}
          với ưu tiên cao nhất (hệ thống chưa có vector/embedding); Tab Kiểm thử chạy qua đúng
          pipeline của AI Bạn Học kèm cấu hình nháp ở Tab Cấu hình.
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-2xl bg-ink/5 w-fit max-w-full overflow-x-auto" role="tablist" aria-label="Nhóm chức năng AI Studio">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => switchTab(key)}
            className={`flex-none flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === key ? "bg-pink text-white shadow" : "text-ink/60 hover:bg-ink/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "config" && (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr] items-start">
          <div className="note-card p-4 sm:p-5 space-y-4">
            <h2 className="font-display font-bold text-ink">Phạm vi cấu hình</h2>
            <Select label="Cấp học" value={cfgLevel} onChange={setCfgLevel}
              options={LEVEL_OPTIONS} full
              hint="Chọn “Mặc định toàn hệ thống” để áp dụng cho mọi cấp chưa có cấu hình riêng." />
            <Select label="Môn học" value={cfgSubject} onChange={setCfgSubject}
              options={subjectOptions} full />
            <div>
              <label htmlFor="ai-studio-temperature"
                className="text-[11px] font-mono uppercase text-[#8A7C63] leading-tight block mb-1">
                Temperature (Độ sáng tạo): {temperature.toFixed(2)}
              </label>
              <input
                id="ai-studio-temperature"
                type="range" min={0} max={0.5} step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
              <div className="flex justify-between gap-2 text-[10px] text-[#B7A987] mt-0.5">
                <span>0.0 — Bám sát 100% tài liệu</span>
                <span className="text-right">0.5 — Linh hoạt, lấy thêm ví dụ</span>
              </div>
            </div>
          </div>

          <div className="note-card p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-display font-bold text-ink">System Prompt</h2>
              <p className="text-xs text-ink/55 mt-0.5">
                Quy định cách Gia sư AI giao tiếp với học sinh. Bấm chip để chèn biến vào vị trí con trỏ.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_VARIABLES.map((token) => (
                <button key={token} type="button" onClick={() => insertVariable(token)}
                  className="px-2.5 py-1 rounded-full border border-ink/15 bg-paper2 text-xs font-mono text-ink/70 hover:bg-ink/5 transition">
                  {token}
                </button>
              ))}
            </div>
            <Input ref={promptRef} type="textarea" rows={7} value={prompt} onChange={setPrompt}
              placeholder="VD: Chỉ gợi ý phương pháp giải, không đưa ra đáp án cuối cùng…" full />
            <div>
              <h3 className="font-display font-bold text-ink text-sm">Công tắc kiểm soát</h3>
              <ToggleRow
                title="Chỉ trả lời trong phạm vi bài học hiện tại"
                desc="AI chỉ dùng nội dung của bài học học sinh đang mở, không lan sang bài khác."
                checked={guardrails.scopeOnly}
                onChange={(v) => setGuardrails((g) => ({ ...g, scopeOnly: v }))}
              />
              <ToggleRow
                title="Bắt buộc trích dẫn số trang / mốc thời gian video"
                desc="Mỗi ý trả lời phải kèm nguồn: số trang tài liệu hoặc mốc thời gian trong video."
                checked={guardrails.requireCitation}
                onChange={(v) => setGuardrails((g) => ({ ...g, requireCitation: v }))}
              />
              <ToggleRow
                title="Từ chối trả lời các câu hỏi ngoài lề không có trong giáo trình"
                desc="Câu hỏi ngoài giáo trình sẽ bị từ chối nhẹ nhàng thay vì trả lời tự do."
                checked={guardrails.refuseOffTopic}
                onChange={(v) => setGuardrails((g) => ({ ...g, refuseOffTopic: v }))}
              />
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-ink/55">
                {cfgLoading
                  ? "Đang đọc cấu hình đã lưu…"
                  : cfgHasSaved
                    ? `Phạm vi này ĐÃ có cấu hình riêng${cfgSavedAt ? ` (lưu lúc ${new Date(cfgSavedAt).toLocaleString("vi-VN")})` : ""} — đang áp dụng cho chat thật.`
                    : "Phạm vi này CHƯA có cấu hình riêng — form đang hiển thị bộ mặc định. Bấm Lưu cấu hình để tạo và áp dụng cho chat thật."}
              </p>
              <PrimaryButton onClick={saveConfig} disabled={cfgSaving || cfgLoading}
                className="flex items-center gap-2 !px-4 !py-2.5 text-sm">
                <Save className="w-4 h-4" /> {cfgSaving ? "Đang lưu…" : "Lưu cấu hình"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {tab === "override" && (
        <div className="space-y-4">
          {reteachNote && (
            <div className="note-card px-4 py-3 flex items-start gap-2.5 border-gold/50">
              <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#8A7C63]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">Từ Lịch sử hỏi AI — câu trả lời AI đã đưa (chỉ để tham chiếu)</p>
                <p className="text-sm text-ink/70 mt-1 whitespace-pre-wrap break-words">{reteachNote.answer}</p>
                <p className="text-xs text-ink/55 mt-1">
                  Hãy viết nội dung kiến thức CHUẨN vào ô “Nội dung kiến thức chuẩn xác” bên dưới — đừng sao chép nguyên câu trả lời này.
                </p>
              </div>
              <button type="button" onClick={() => setReteachNote(null)} aria-label="Đóng ghi chú tham chiếu"
                className="shrink-0 text-ink/40 hover:text-ink transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="note-card p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-display font-bold text-ink">{editingId ? "Sửa bản ghi đính chính" : "Thêm bản ghi đính chính"}</h2>
              <p className="text-xs text-ink/55 mt-0.5">
                Vá nhanh kiến thức sai trong giáo trình khi chưa kịp sửa file Word/PowerPoint gốc.
                Bản ghi được lưu với độ ưu tiên cao nhất: khi học sinh hỏi, hệ thống truy xuất
                theo từ khoá và luôn ưu tiên các đính chính khớp trước tài liệu bài học —
                nếu mâu thuẫn với bài học thì Gia sư AI theo nội dung đính chính.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Môn học" value={ovSubject} onChange={setOvSubject}
                options={subjectOptions} full />
              <Select label="Cấp học" value={ovLevel} onChange={setOvLevel}
                options={OVERRIDE_LEVEL_OPTIONS} full />
            </div>
            <Input label="Câu hỏi / Chủ đề cần đính chính" value={ovTopic} onChange={setOvTopic}
              placeholder="VD: Năm diễn ra sự kiện …, công thức tính …" full />
            <Input label="Nội dung kiến thức chuẩn xác" type="textarea" rows={4}
              value={ovContent} onChange={setOvContent}
              placeholder="Nhập nội dung đúng mà Gia sư AI phải dùng khi trả lời chủ đề trên…" full />
            <div className="flex justify-end gap-2">
              {editingId && (
                <GhostButton onClick={resetOvForm} className="!px-4 !py-2.5 text-sm">
                  Huỷ sửa
                </GhostButton>
              )}
              <PrimaryButton onClick={submitCorrection} disabled={ovSaving}
                className="flex items-center gap-2 !px-4 !py-2.5 text-sm">
                <Save className="w-4 h-4" /> {ovSaving ? "Đang lưu…" : editingId ? "Cập nhật đính chính" : "Lưu đính chính"}
              </PrimaryButton>
            </div>
          </div>

          <div className="note-card p-4 sm:p-5">
            <h2 className="font-display font-bold text-ink mb-3">Bản ghi đính chính đã lưu</h2>
            {ovLoading && overrideRecords.length === 0 ? (
              <p className="text-sm text-ink/55 py-6 text-center">Đang đọc danh sách đính chính…</p>
            ) : overrideRecords.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/15 px-4 py-10 text-center">
                <Wrench className="w-8 h-8 mx-auto text-ink/30" />
                <p className="font-display font-semibold text-ink mt-2">Chưa có bản ghi đính chính nào</p>
                <p className="text-sm text-ink/55 mt-1 max-w-md mx-auto">
                  Các bản ghi đã lưu sẽ hiện ở đây kèm nút Sửa / Xoá. Khi học sinh hỏi đúng
                  chủ đề, Gia sư AI sẽ ưu tiên dùng nội dung đính chính thay cho tài liệu cũ.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-ink/5">
                {overrideRecords.map((r) => (
                  <li key={r.id} className={`py-3 flex items-start gap-3 ${r.active ? "" : "opacity-60"}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">
                        {r.topic}
                        {!r.active && (
                          <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-semibold text-ink/60">
                            Đang tắt — không dùng khi trả lời
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink/55">{r.subject || "Tất cả môn học"} · {levelLabelOf(r.level)}</p>
                      <p className="text-sm text-ink/75 mt-1 whitespace-pre-wrap break-words">{r.content}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <ToggleSwitch checked={r.active === true}
                        onChange={() => toggleCorrectionActive(r)} />
                      <div className="flex gap-1.5">
                        <GhostButton onClick={() => startEditCorrection(r)} className="!px-3 !py-1.5 text-xs flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" /> Sửa
                        </GhostButton>
                        <GhostButton onClick={() => setOvConfirmDelete(r)} className="!px-3 !py-1.5 text-xs flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5" /> Xoá
                        </GhostButton>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "playground" && (
        <div className="note-card p-4 sm:p-5 space-y-4">
          <div>
            <h2 className="font-display font-bold text-ink">Kiểm thử Gia sư AI</h2>
            <p className="text-xs text-ink/55 mt-0.5">
              Hỏi thử với cấu hình nháp ở Tab Cấu hình (System Prompt, Temperature, công tắc
              kiểm soát) — áp dụng ngay cho từng lượt thử, chưa cần lưu. Câu trả lời do model
              thật trả, dùng các đoạn bài học đã xuất bản truy xuất theo từ khoá.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper2/60 min-h-[260px] p-4 flex flex-col gap-3">
            {pgMessages.length === 0 && !pgSending ? (
              <div className="flex-1 grid place-items-center text-center py-8">
                <div>
                  <MessagesSquare className="w-9 h-9 mx-auto text-ink/30" />
                  <p className="font-display font-semibold text-ink mt-2">Chưa có tin nhắn nào</p>
                  <p className="text-sm text-ink/55 mt-1 max-w-md mx-auto">
                    Nhập câu hỏi bên dưới để kiểm thử. Bên dưới mỗi câu trả lời sẽ hiện
                    các đoạn bài học thật mà hệ thống đã truy xuất cho câu hỏi đó.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {pgMessages.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[92%]"}>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === "user" ? "bg-ink text-paper" : "bg-white border border-ink/10 text-ink"
                    }`}>
                      {m.role === "assistant" ? <AiMarkdown>{m.text}</AiMarkdown> : m.text}
                    </div>
                    {m.role === "assistant" && m.refused && (
                      <p className="mt-1.5 inline-block rounded-full bg-gold/25 px-2.5 py-1 text-[11px] font-semibold text-ink">
                        Guardrail đã chặn ở backend: công tắc “Chỉ trả lời trong phạm vi bài học”
                        đang bật và không truy xuất được đoạn bài học hay đính chính nào — model không được gọi.
                      </p>
                    )}
                    {m.role === "assistant" && !m.refused && Array.isArray(m.sources) && m.sources.length === 0 && (
                      <p className="mt-1.5 text-[11px] text-ink/55">
                        Không truy xuất được đoạn bài học hay đính chính nào cho câu hỏi này — câu trả lời
                        không dựa trên tài liệu bài học đã xuất bản.
                      </p>
                    )}
                    {m.role === "assistant" && Array.isArray(m.sources) && m.sources.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {m.sources.map((s, i) => (
                          <div key={i} className={`rounded-xl border px-3 py-2.5 ${
                            s.type === "correction" ? "border-gold/60 bg-gold/10" : "border-ink/10 bg-white/70"
                          }`}>
                            <p className="text-xs font-semibold text-ink">
                              {s.type === "correction" ? (
                                <>
                                  Đính chính kiến thức: “{s.title}”
                                  <span className="ml-2 rounded-full bg-gold/40 px-2 py-0.5 text-[11px] font-semibold text-ink">
                                    Ưu tiên cao nhất
                                  </span>
                                </>
                              ) : (
                                <>Nguồn: Bài “{s.title}”</>
                              )}
                              {(s.subject || s.grade) && (
                                <span className="font-normal text-ink/55">
                                  {" "}· {[s.subject, s.grade ? `lớp ${s.grade}` : null].filter(Boolean).join(" · ")}
                                </span>
                              )}
                              {typeof s.score === "number" && (
                                <span className="ml-2 rounded-full bg-teal/15 px-2 py-0.5 font-mono text-[11px] text-ink">
                                  Điểm khớp từ khoá: {s.score}
                                </span>
                              )}
                            </p>
                            {((s.matchedPhrases?.length || 0) > 0 || (s.matchedKeywords?.length || 0) > 0) && (
                              <p className="mt-1 text-[11px] text-ink/55">
                                Đã khớp: {[...(s.matchedPhrases || []), ...(s.matchedKeywords || [])].join(", ")}
                              </p>
                            )}
                            {Array.isArray(s.excerpts) && s.excerpts.map((ex, j) => (
                              <div key={j} className="mt-1.5 border-l-2 border-ink/15 pl-2.5">
                                <p className="text-xs text-ink/75 leading-relaxed">{ex.text}</p>
                                {typeof ex.score === "number" && (
                                  <p className="text-[11px] font-mono text-ink/45">Điểm đoạn: {ex.score}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {pgSending && (
                  <div className="self-start max-w-[85%]">
                    <div className="rounded-2xl px-3.5 py-2.5 text-sm bg-white border border-ink/10 text-ink/55">
                      Gia sư AI đang trả lời…
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {pgError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-800">{pgError}</p>
            </div>
          )}

          <form onSubmit={submitQuestion} className="flex gap-2 items-start">
            <Input value={draft} onChange={setDraft} full disabled={pgSending}
              placeholder="Nhập câu hỏi kiểm thử, VD: Tử số và mẫu số là gì?" />
            <PrimaryButton type="submit" disabled={pgSending} className="flex items-center gap-2 !px-4 !py-2.5 text-sm shrink-0">
              <Send className="w-4 h-4" /> {pgSending ? "Đang gửi…" : "Gửi"}
            </PrimaryButton>
          </form>

          <div className="rounded-2xl border border-dashed border-ink/15 px-4 py-3">
            <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Nguồn & điểm khớp — đọc sao cho đúng</p>
            <p className="text-sm text-ink/55 mt-1">
              Nguồn là các đoạn văn bản THẬT trong bài học đã xuất bản, được truy xuất bằng
              khớp từ khoá trên chính câu hỏi (cùng cơ chế AI Bạn Học đang dùng cho học sinh).
              Điểm khớp là điểm từ khoá: cụm 2 từ khớp = 2 điểm, từ đơn khớp = 1 điểm, đoạn
              phải đạt tối thiểu 2 điểm mới được dùng. Bản ghi Đính chính kiến thức ở Tab
              Đính chính khớp chủ đề cũng được truy xuất trong cùng lượt, hiển thị riêng với
              nhãn “Ưu tiên cao nhất” và được chèn trước tài liệu bài học trong prompt.
              Hệ thống hiện chưa có vector/embedding nên điểm này KHÔNG phải độ tương đồng ngữ nghĩa.
            </p>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!ovConfirmDelete}
        title="Xoá bản ghi đính chính?"
        message={ovConfirmDelete
          ? `Xoá đính chính “${ovConfirmDelete.topic}”? Gia sư AI sẽ không dùng nội dung này nữa và học sinh có thể lại nhận câu trả lời theo tài liệu cũ.`
          : ""}
        confirmLabel={ovDeleting ? "Đang xoá…" : "Xoá đính chính"}
        danger
        onConfirm={doDeleteCorrection}
        onClose={() => !ovDeleting && setOvConfirmDelete(null)}
      />
    </div>
  );
}
