import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlaskConical, Info, MessagesSquare, Pencil, Save, Send, SlidersHorizontal, Trash2, Wrench, X,
} from "lucide-react";
import {
  GhostButton, Input, ManagementHeader, PrimaryButton, Select, ToggleSwitch,
} from "../../components/ui";
import { setupService } from "../../services/setupService.js";

/* AiStudioPage — trang AI Studio MỚI ở /dashboard/ai-studio (nhóm AI),
 * xây theo REFACTOR_AI_STUDIO.md Bước 2: trung tâm cấu hình hành vi Gia sư
 * AI (RAG) + quản lý tri thức ưu tiên, gồm 3 tab:
 *   • config     — Cấu hình Gia sư AI (prompt & guardrails)
 *   • override   — Đính chính kiến thức (Knowledge Override)
 *   • playground — Kiểm thử RAG
 * Đợt này CHỈ dựng khung giao diện: chưa có backend RAG/embedding nên mọi
 * nút Lưu/Gửi đều báo rõ "sẽ nối backend ở bước tiếp theo" — không giả vờ
 * đã lưu, không sinh câu trả lời AI giả, không bịa chunk/score mẫu.
 * (Trang tạo bài học cũ đã tách sang /dashboard/ai-lesson-creator.)
 * Tab đồng bộ qua ?tab= trên hash như trang Avatar gộp. */

const TABS = [
  { key: "config", label: "Cấu hình Gia sư AI", icon: SlidersHorizontal },
  { key: "override", label: "Đính chính kiến thức", icon: Wrench },
  { key: "playground", label: "Kiểm thử RAG", icon: FlaskConical },
];
const TAB_KEYS = TABS.map((t) => t.key);
const BASE_HASH = "#/dashboard/ai-studio";

const PENDING_MSG = "Khung giao diện — chức năng sẽ được nối backend ở bước tiếp theo, dữ liệu chưa được lưu.";

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
  const [notice, setNotice] = useState("");

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

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(""), 8000);
    return () => clearTimeout(t);
  }, [notice]);

  /* Mọi hành động cần backend (Lưu cấu hình, Lưu đính chính, Gửi câu hỏi
   * kiểm thử) đều đi qua đây: báo rõ chưa nối backend, KHÔNG giả vờ đã lưu. */
  const notifyPending = useCallback(() => {
    setNotice(PENDING_MSG);
    showToast?.(PENDING_MSG);
  }, [showToast]);

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

  // ── Tab 1: Cấu hình Gia sư AI (state local thuần giao diện) ──
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

  // ── Tab 2: Đính chính kiến thức ──
  const [ovSubject, setOvSubject] = useState("");
  const [ovLevel, setOvLevel] = useState("");
  const [ovTopic, setOvTopic] = useState("");
  const [ovContent, setOvContent] = useState("");
  /* Chưa có backend nên danh sách luôn rỗng ở bước này — bước sau sẽ đổ
   * bản ghi thật (kèm nút Sửa/Xoá như khung render bên dưới) từ API. */
  const overrideRecords = [];

  // ── Tab 3: Kiểm thử RAG ──
  const [draft, setDraft] = useState("");
  /* Khung hội thoại: bước sau backend RAG sẽ trả tin nhắn kèm sources
   * [{ label, score }] để render dưới mỗi câu trả lời của AI. */
  const chatMessages = [];

  const submitQuestion = (e) => {
    e?.preventDefault();
    notifyPending();
  };

  return (
    <div className="space-y-4">
      <ManagementHeader
        title="AI Studio"
        subtitle="Trung tâm cấu hình hành vi Gia sư AI (RAG) và quản lý tri thức ưu tiên"
      />

      {/* Banner trung thực trạng thái: đợt này chỉ dựng khung giao diện. */}
      <div className="note-card px-4 py-3 flex items-start gap-2.5">
        <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#8A7C63]" />
        <p className="text-sm text-ink/75">
          <strong className="text-ink">Khung giao diện Bước 2.</strong>{" "}
          Trang này mới dựng khung để chốt bố cục — backend RAG (lưu cấu hình, tạo embedding
          cho bản ghi đính chính, truy xuất khi kiểm thử) sẽ được nối ở bước tiếp theo.
          Các nút Lưu / Gửi hiện chỉ hiển thị thông báo, chưa lưu hay gửi dữ liệu thật.
        </p>
      </div>

      {notice && (
        <div className="note-card px-4 py-3 flex items-start gap-2.5 border-gold/50">
          <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#8A7C63]" />
          <p className="text-sm text-ink/80 flex-1">{notice}</p>
          <button type="button" onClick={() => setNotice("")} aria-label="Đóng thông báo"
            className="shrink-0 text-ink/40 hover:text-ink transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            <div className="flex justify-end">
              <PrimaryButton onClick={notifyPending} className="flex items-center gap-2 !px-4 !py-2.5 text-sm">
                <Save className="w-4 h-4" /> Lưu cấu hình
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {tab === "override" && (
        <div className="space-y-4">
          <div className="note-card p-4 sm:p-5 space-y-4">
            <div>
              <h2 className="font-display font-bold text-ink">Thêm bản ghi đính chính</h2>
              <p className="text-xs text-ink/55 mt-0.5">
                Vá nhanh kiến thức sai trong giáo trình khi chưa kịp sửa file Word/PowerPoint gốc.
                Khi backend được nối, bản ghi sẽ được tạo embedding và lưu với độ ưu tiên cao
                (priority = high) để RAG luôn truy xuất trước tài liệu gốc.
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
            <div className="flex justify-end">
              <PrimaryButton onClick={notifyPending} className="flex items-center gap-2 !px-4 !py-2.5 text-sm">
                <Save className="w-4 h-4" /> Lưu đính chính
              </PrimaryButton>
            </div>
          </div>

          <div className="note-card p-4 sm:p-5">
            <h2 className="font-display font-bold text-ink mb-3">Bản ghi đang hoạt động</h2>
            {overrideRecords.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/15 px-4 py-10 text-center">
                <Wrench className="w-8 h-8 mx-auto text-ink/30" />
                <p className="font-display font-semibold text-ink mt-2">Chưa có bản ghi đính chính nào</p>
                <p className="text-sm text-ink/55 mt-1 max-w-md mx-auto">
                  Các bản ghi đã lưu sẽ hiện ở đây kèm nút Sửa / Xoá sau khi backend được nối ở bước tiếp theo.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-ink/5">
                {overrideRecords.map((r) => (
                  <li key={r.id} className="py-3 flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{r.topic}</p>
                      <p className="text-xs text-ink/55">{r.subject} · {r.level}</p>
                      <p className="text-sm text-ink/75 mt-1">{r.content}</p>
                    </div>
                    <GhostButton onClick={notifyPending} className="!px-3 !py-1.5 text-xs flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5" /> Sửa
                    </GhostButton>
                    <GhostButton onClick={notifyPending} className="!px-3 !py-1.5 text-xs flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Xoá
                    </GhostButton>
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
              Hỏi thử ngay sau khi chỉnh System Prompt hoặc thêm nội dung đính chính,
              để kiểm tra AI trả lời có đúng giáo trình không.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper2/60 min-h-[260px] p-4 flex flex-col gap-3">
            {chatMessages.length === 0 ? (
              <div className="flex-1 grid place-items-center text-center py-8">
                <div>
                  <MessagesSquare className="w-9 h-9 mx-auto text-ink/30" />
                  <p className="font-display font-semibold text-ink mt-2">Chưa có tin nhắn nào</p>
                  <p className="text-sm text-ink/55 mt-1 max-w-md mx-auto">
                    Nhập câu hỏi bên dưới để kiểm thử. Backend RAG chưa được nối
                    nên câu hỏi hiện chưa gửi đi được.
                  </p>
                </div>
              </div>
            ) : (
              chatMessages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}>
                  <div className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === "user" ? "bg-ink text-paper" : "bg-white border border-ink/10 text-ink"
                  }`}>
                    {m.text}
                  </div>
                  {m.role === "assistant" && Array.isArray(m.sources) && m.sources.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {m.sources.map((s, i) => (
                        <p key={i} className="text-[11px] text-ink/55 font-mono">
                          Nguồn: {s.label} · Score: {s.score}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={submitQuestion} className="flex gap-2 items-start">
            <Input value={draft} onChange={setDraft} full
              placeholder="Nhập câu hỏi kiểm thử, VD: Vì sao lá cây có màu xanh?" />
            <PrimaryButton type="submit" className="flex items-center gap-2 !px-4 !py-2.5 text-sm shrink-0">
              <Send className="w-4 h-4" /> Gửi
            </PrimaryButton>
          </form>

          <div className="rounded-2xl border border-dashed border-ink/15 px-4 py-3">
            <p className="text-[11px] font-mono uppercase text-[#8A7C63]">Nguồn trích dẫn & độ tương đồng (Score)</p>
            <p className="text-sm text-ink/55 mt-1">
              Sau khi backend RAG được nối, mỗi câu trả lời ở trên sẽ hiển thị ngay bên dưới:
              đoạn tài liệu (chunk) mà AI đã dùng và độ tương đồng (score) của chunk đó.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
