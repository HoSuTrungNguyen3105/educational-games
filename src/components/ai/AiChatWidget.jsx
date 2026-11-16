// components/ai/AiChatWidget.jsx
//
// Khung chat AI hỗ trợ học tập.
//
// Bám đúng convention mobile của ChatPanel sẵn có:
//   desktop (lg:)  → panel nổi góc phải, bo góc
//   mobile         → nút nổi + overlay toàn màn hình, tôn trọng safe-area
//   dùng h-[100dvh] để bàn phím iOS không che mất ô nhập
//   input dùng text-base trên mobile để iOS KHÔNG tự phóng to khi focus
//   mọi nút bấm ≥ 44px theo khuyến nghị touch target
//
// Nguyên tắc:
//  - Lịch sử do React quản lý và gửi kèm mỗi lượt. AI Service không lưu hội thoại.
//  - `conversationId` chỉ là nhãn nhóm hội thoại phía client, không phải khoá truy cập.
//  - Không bao giờ hiển thị OLLAMA_KEY hay chi tiết lỗi kỹ thuật.

import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../../services/api.js";
import { chat } from "../../services/aiApi.js";
import { markAiFailed, markAiReady, useAiAvailability } from "../../hooks/useAiAvailability.js";
import { formatTokenCount, useAiCreditStatus } from "../../hooks/useAiCreditStatus.js";
import { aiErrorHint, aiErrorText } from "./aiErrorText.js";
import { AiNotReadyNotice } from "./AiNotReadyNotice.jsx";
import AiMarkdown from "./AiMarkdown.jsx";
import { Input } from "../ui";
import { BookOpen, Bot, X } from "lucide-react";

const MAX_LOCAL_TURNS = 12;

// Gợi ý câu hỏi nhanh: mỗi ngày random 4 câu (seed theo ngày nên cùng một
// ngày thì bộ câu hỏi giống nhau, sang ngày mới tự đổi) từ kho câu hỏi đa
// chủ đề. Sau mỗi câu trả lời của AI còn hiện thêm các câu hỏi liên quan
// tới câu vừa hỏi (khớp từ khoá theo chủ đề, xem FOLLOWUP_KEYWORDS).
const DAILY_POOL = [
  { k: "math", q: "Cách tính nhẩm phép cộng nhanh là gì?" },
  { k: "math", q: "Giải thích phép nhân qua một ví dụ thực tế" },
  { k: "math", q: "Mẹo nhớ bảng cửu chương là gì?" },
  { k: "math", q: "Phân số là gì và dùng khi nào?" },
  { k: "vocab", q: "Cách học từ vựng tiếng Anh nhớ lâu?" },
  { k: "vocab", q: "Đặt 3 câu tiếng Anh với từ “friend” giúp mình" },
  { k: "vocab", q: "Phân biệt “this” và “that” như thế nào?" },
  { k: "practice", q: "Tạo 5 câu luyện tập về chủ đề mình đang học" },
  { k: "practice", q: "Cho mình một bài kiểm tra nhỏ 3 câu hỏi" },
  { k: "practice", q: "Làm bài tập nhanh mà vẫn đúng bằng cách nào?" },
  { k: "explain", q: "Giải thích bài học hôm nay một cách đơn giản nhất" },
  { k: "explain", q: "Vì sao phải học môn này?" },
  { k: "explain", q: "Tóm tắt kiến thức quan trọng của chủ đề này" },
  { k: "example", q: "Cho mình một ví dụ gần gũi với đời sống" },
  { k: "example", q: "Minh hoạ khái niệm này bằng một câu chuyện nhỏ" },
  { k: "science", q: "Vì sao bầu trời có màu xanh?" },
  { k: "science", q: "Mưa được hình thành như thế nào?" },
  { k: "science", q: "Tại sao chúng ta cần ngủ đủ giấc?" },
  { k: "history", q: "Kể một câu chuyện lịch sử thú vị về đất nước mình" },
  { k: "history", q: "Thủ đô của Việt Nam có gì đặc biệt?" },
  { k: "study", q: "Cách tập trung học bài hiệu quả là gì?" },
  { k: "study", q: "Học thuộc bài nhanh bằng cách nào?" },
  { k: "study", q: "Nên học vào lúc nào trong ngày là tốt nhất?" },
  { k: "fun", q: "Kể cho mình một câu đố vui về toán học" },
  { k: "fun", q: "Kể một câu chuyện cười liên quan đến học tập" },
];

// Câu hỏi gợi ý tiếp theo, chia theo chủ đề. Chọn nhóm theo từ khoá trong
// câu hỏi gần nhất của người dùng; không khớp nhóm nào thì dùng "general".
const FOLLOWUPS = {
  math: [
    "Giải thích cách làm dạng bài này từng bước",
    "Cho mình 3 bài toán tương tự để luyện",
    "Mẹo kiểm tra lại đáp án là gì?",
    "Cách trình bày bài giải cho rõ ràng?",
  ],
  vocab: [
    "Cách nhớ từ vừa học lâu hơn?",
    "Đặt 3 câu ví dụ với từ này",
    "Từ này có từ đồng nghĩa nào không?",
    "Cách phát âm chuẩn từ này?",
  ],
  practice: [
    "Giải thích đáp án từng câu giúp mình",
    "Tạo thêm 5 câu khó hơn một chút",
    "Mẹo làm dạng bài này nhanh và đúng?",
    "Tóm tắt kiến thức cần nhớ trước khi làm bài",
  ],
  explain: [
    "Tóm tắt lại phần vừa giải thích cho mình",
    "Giải thích sâu hơn bước khó nhất",
    "Có cách hiểu nào đơn giản hơn không?",
    "Cho mình ví dụ minh hoạ phần này",
  ],
  example: [
    "Cho mình thêm một ví dụ khác",
    "Ví dụ nào dễ nhớ nhất cho bài này?",
    "Liên hệ kiến thức này với thực tế thế nào?",
  ],
  date: [
    "Ngày này sang năm là thứ mấy?",
    "Cách tính nhanh thứ trong tuần?",
    "Kể mình nghe sự kiện đặc biệt của ngày này trong lịch sử",
  ],
  essay: [
    "Gợi ý mở bài hay cho đề này",
    "Cách viết câu văn sinh động hơn?",
    "Kiểm tra giúp mình đoạn văn mình viết nhé",
    "Gợi ý từ ngữ hay để miêu tả?",
  ],
  science: [
    "Vì sao hiện tượng này xảy ra?",
    "Có thí nghiệm nhỏ nào mình thử tại nhà không?",
    "Kể thêm sự thật thú vị về chủ đề này",
    "Liên hệ chủ đề này với đời sống hằng ngày",
  ],
  history: [
    "Kể tiếp diễn biến của sự kiện này",
    "Nhân vật lịch sử này còn gì thú vị?",
    "Vì sao sự kiện này quan trọng?",
    "Chỉ mình vị trí này trên bản đồ nhé",
  ],
  study: [
    "Áp dụng cách này cho môn khác được không?",
    "Cách tạo thói quen học mỗi ngày?",
    "Làm sao bớt hồi hộp khi làm bài kiểm tra?",
    "Mẹo giữ tập trung khi học ở nhà?",
  ],
  fun: [
    "Kể thêm một câu đố vui khác",
    "Kể một câu chuyện vui về lớp học",
    "Tạo một câu đố có đáp án bất ngờ",
  ],
  general: [
    "Giải thích thêm phần mình vừa hỏi",
    "Cho mình ví dụ về chủ đề vừa rồi",
    "Tạo 3 câu luyện tập về chủ đề này",
    "Tóm tắt lại cho mình dễ nhớ",
  ],
};

// Thứ tự ưu tiên khi khớp chủ đề: nhóm đặc trưng trước (date, vocab, essay,
// science, history, practice, math, example, study, fun), nhóm "explain"
// (từ khoá chung chung như "là gì", "tại sao") đứng cuối để khỏi nuốt mất
// các nhóm kia. Không khớp gì → "general".
const FOLLOWUP_KEYWORDS = [
  { k: "date", words: ["thứ mấy", "ngày nào", "mấy giờ", "âm lịch", "dương lịch"] },
  { k: "vocab", words: ["từ vựng", "tiếng anh", "english", "từ mới", "phát âm", "ngữ pháp", "dịch", "phân biệt"] },
  { k: "essay", words: ["viết văn", "bài văn", "đoạn văn", "tập làm văn", "miêu tả", "kể chuyện", "cảm thụ", "mở bài"] },
  { k: "science", words: ["khoa học", "tự nhiên", "thí nghiệm", "động vật", "thực vật", "cơ thể", "vũ trụ", "trái đất", "thời tiết", "năng lượng", "mưa", "bầu trời", "ngủ"] },
  { k: "history", words: ["lịch sử", "địa lý", "địa lí", "thủ đô", "đất nước", "vua", "triều", "bản đồ"] },
  { k: "practice", words: ["luyện tập", "bài tập", "kiểm tra", "ôn tập", "ôn thi", "câu luyện"] },
  { k: "math", words: ["toán", "phép tính", "phép cộng", "phép trừ", "phép nhân", "phép chia", "phân số", "hình học", "tính nhẩm", "cửu chương", "chu vi", "diện tích"] },
  { k: "example", words: ["ví dụ", "minh hoạ", "minh họa"] },
  { k: "study", words: ["thuộc bài", "ghi nhớ", "tập trung", "phương pháp học", "học bài", "thói quen"] },
  { k: "fun", words: ["câu đố", "chuyện cười", "đùa"] },
  { k: "explain", words: ["giải thích", "tại sao", "vì sao", "là gì", "khái niệm", "hiểu", "từng bước", "tóm tắt"] },
];

function matchFollowupCategory(text) {
  const t = String(text || "").toLowerCase();
  for (const { k, words } of FOLLOWUP_KEYWORDS) {
    if (words.some((w) => t.includes(w))) return k;
  }
  return "general";
}

/** Hash chuỗi → số, dùng làm seed. */
function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

/** PRNG tất định (mulberry32) — cùng seed cho cùng chuỗi số. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 4 câu hỏi nhanh của HÔM NAY: random theo ngày, ưu tiên mỗi câu một
 *  chủ đề để bộ gợi ý không bị lặp chủ đề trong cùng một ngày. */
function pickDailySuggestions(count = 4) {
  const d = new Date();
  const rnd = mulberry32(hashSeed(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`));
  const pool = [...DAILY_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const used = new Set();
  const picks = [];
  for (const item of pool) {
    if (picks.length >= count) break;
    if (used.has(item.k)) continue;
    used.add(item.k);
    picks.push(item.q);
  }
  for (const item of pool) {
    if (picks.length >= count) break;
    if (!picks.includes(item.q)) picks.push(item.q);
  }
  return picks;
}

export default function AiChatWidget({ subject, topic, title = "Trợ lý AI" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  // Lượt gửi gần nhất bị lỗi (kèm đúng history đã dùng) để nút "Thử lại" gửi
  // lại NGUYÊN lượt đó — không thêm tin user trùng vào lịch sử.
  const [lastFailed, setLastFailed] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Trạng thái AI dùng chung cho mọi tính năng. Hook này KHÔNG gọi API: ô nhập luôn
  // dùng được, và chỉ khi bấm gửi mới có một request thật.
  const ai = useAiAvailability();

  // Credit AI còn lại hôm nay (ước tính phía server). Hook KHÔNG tự gọi
  // API: chỉ nạp khi MỞ khung chat và sau mỗi lượt gửi (số vừa thay đổi);
  // nạp lỗi → status null → dòng hiển thị ẩn lặng lẽ, không báo lỗi.
  const credit = useAiCreditStatus();
  const refreshCredit = credit.refresh;
  useEffect(() => {
    if (open) refreshCredit();
  }, [open, refreshCredit ]);

  // Bộ câu hỏi nhanh của HÔM NAY — tính một lần lúc mount (random theo ngày,
  // ổn định suốt phiên; sang ngày mới remount sẽ có bộ khác).
  const [suggestions] = useState(pickDailySuggestions);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    // Trì hoãn một nhịp để layout fullscreen ổn định rồi mới focus.
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open]);

  // Khoá cuộn nền khi overlay đang mở trên mobile.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /** Một lượt gọi AI thật. Dùng chung cho gửi mới (send) và thử lại (retry). */
  async function runRequest(content, history) {
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await chat({
        message: content,
        subject,
        topic,
        conversationId,
        history,
        signal: ctrl.signal,
      });
      setConversationId(res.conversationId || null);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: res.answer,
        // Nguồn bài học Backend đã truy xuất (§5.5) — hiển thị dưới câu trả lời.
        sources: Array.isArray(res.sources) && res.sources.length > 0 ? res.sources : undefined,
      }]);
      setLastFailed(null);
      markAiReady();
    } catch (e) {
      markAiFailed(e);
      // Người dùng bấm Huỷ thì im lặng, không báo lỗi.
      if (e?.kind !== "timeout" || !ctrl.signal.aborted) {
        setError(aiErrorText(e));
        setHint(aiErrorHint(e));
        setLastFailed({ content, history });
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
      // Lượt vừa rồi (kể cả khi lỗi ở lượt trả lời cuối) có thể đã tốn
      // credit ở lượt chọn công cụ → nạp lại số còn lại cho đúng.
      refreshCredit();
    }
  }

  async function send(text) {
    const content = String(text ?? input).trim();
    // KHÔNG chặn theo trạng thái AI: request chỉ đi khi người dùng bấm gửi.
    // Nếu Backend báo chưa bật, catch bên dưới ghi lại để cả bốn tính năng cùng hiện
    // thông báo "đang được cấu hình" mà không cần gọi thêm endpoint nào.
    if (!content || busy) return;

    setError(null);
    setHint(null);
    setLastFailed(null);
    setInput("");

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-MAX_LOCAL_TURNS)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content }]);
    await runRequest(content, history);
  }

  /** Gửi lại đúng lượt vừa lỗi — lịch sử KHÔNG thêm tin user trùng. */
  async function retry() {
    if (!lastFailed || busy) return;
    setError(null);
    setHint(null);
    await runRequest(lastFailed.content, lastFailed.history);
  }

  function cancel() {
    abortRef.current?.abort();
    setBusy(false);
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setHint(null);
    setLastFailed(null);
    setBusy(false);
    setConversationId(null);
  }

  // Câu hỏi liên quan hiện sau mỗi câu trả lời của AI: chọn nhóm theo từ
  // khoá trong câu hỏi GẦN NHẤT của người dùng, bỏ câu trùng với câu vừa hỏi.
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const lastMsg = messages[messages.length - 1];
  const followUps =
    lastMsg?.role === "assistant" && lastUserMsg && !busy && !error
      ? (FOLLOWUPS[matchFollowupCategory(lastUserMsg.content)] || []).filter(
          (q) => q !== lastUserMsg.content
        )
      : [];

  return (
    <>
      {/* Nút nổi: mobile đứng cao hơn để không bị chồng lên dock, desktop xuống góc phải */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="Trợ lý AI hỗ trợ học tập"
          aria-label="Mở trợ lý AI hỗ trợ học tập"
          className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-12 h-12 rounded-full
                     bg-ink text-paper shadow-xl flex items-center justify-center text-xl
                     hover:bg-ink2 active:scale-95 transition"
        >
          <Bot className="w-5 h-5" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex flex-col bg-paper2 anim-fade
                     lg:inset-auto lg:bottom-24 lg:right-6 lg:w-96 lg:h-[34rem]
                     lg:rounded-3xl lg:border-2 lg:border-ink/15 lg:shadow-2xl lg:anim-pop"
        >
          {/* Header: cao tối thiểu 44px cho touch target */}
          <div
            className="flex items-center justify-between gap-2 px-4 py-3 bg-ink text-paper shrink-0
                       pt-[max(env(safe-area-inset-top),12px)] lg:pt-3"
          >
            <div className="min-w-0">
              <p className="font-display text-sm font-bold truncate">{title}</p>
              <p className="text-[10px] font-mono text-paper/60 truncate">
                {API_BASE.replace(/^https?:\/\//, "")}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="min-h-[44px] px-3 text-[11px] font-semibold text-paper/70 hover:text-paper transition"
                >
                  Xoá
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng trợ lý AI"
                className="w-11 h-11 rounded-full text-paper/80 hover:bg-white/10 hover:text-paper transition text-lg leading-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Credit AI còn lại hôm nay (ước tính từ bộ đếm phía server).
              Chỉ render khi đã nạp được số liệu; lỗi/không hỗ trợ → ẩn. */}
          {credit.status && (
            <div className="px-4 py-1.5 bg-[var(--card)] border-b border-ink/10 shrink-0 flex items-center justify-between gap-2">
              <p className="text-[11px] text-muted truncate">
                Hôm nay còn khoảng{" "}
                <span className="font-semibold text-ink">{formatTokenCount(credit.status.remainingTokensToday)}</span>{" "}
                token AI
                {typeof credit.status.remainingRequestsToday === "number" && (
                  <> · khoảng {formatTokenCount(credit.status.remainingRequestsToday)} lượt hỏi</>
                )}
              </p>
              <p className="text-[10px] text-muted/60 shrink-0">ước tính</p>
            </div>
          )}

          {/* Danh sách tin: dùng dvh để bàn phím không đè lên ô nhập */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-3 space-y-2.5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center px-2 py-6 gap-3">
                <Bot className="w-10 h-10 text-ink/30 float-slow" />
                {!ai.showNotice && (
                  <>
                    <p className="font-display text-base sm:text-sm font-semibold text-ink">
                      Hỏi gì cũng được về bài học
                    </p>
                    <p className="text-xs text-[#8A7C63] leading-relaxed max-w-xs">
                      AI sẽ giải thích từng bước thay vì chỉ đưa đáp án.
                    </p>
                  </>
                )}
                {ai.showNotice && (
                  <AiNotReadyNotice
                    state={ai.state}
                    notice={ai.notice}
                    hint={ai.hint}
                    onRetry={ai.refresh}
                    className="text-left w-full"
                  />
                )}
                {!ai.showNotice && (
                  <div className="flex flex-col gap-1.5 w-full mt-1">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-left text-[12px] text-ink/70 border border-ink/10 hover:border-ink/30
                                   rounded-xl px-3 py-2.5 transition bg-[var(--card)] min-h-[44px]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-[15px] sm:text-sm font-body break-words ${
                    m.role === "user"
                      ? "bg-ink text-paper rounded-br-md whitespace-pre-wrap"
                      : "bg-[var(--card)] border border-ink/10 text-ink rounded-bl-md"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <>
                      {/* Tin AI render Markdown an toàn (AiMarkdown); tin của
                          học sinh giữ văn bản thuần như trước. */}
                      <AiMarkdown>{m.content}</AiMarkdown>
                      {m.sources && (
                        <div className="mt-1.5 border-t border-ink/10 pt-1.5 space-y-0.5">
                          {m.sources.map((s, j) => (
                            <p key={j} className="flex items-center gap-1 text-[11px] text-[#8A7C63]">
                              <BookOpen className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                Nguồn bài học: “{s.title}”
                                {s.subject ? ` · ${s.subject}` : ""}
                                {s.grade ? ` · Lớp ${s.grade}` : ""}
                              </span>
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {/* Câu hỏi liên quan tới câu vừa hỏi — hiện sau mỗi câu trả lời
                của AI, ẩn khi đang chờ/đang lỗi để không chồng nội dung. */}
            {followUps.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-0.5">
                <p className="text-[11px] text-muted pl-1">Câu hỏi liên quan</p>
                {followUps.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-left text-[12px] text-ink/70 border border-ink/10 hover:border-ink/30
                               rounded-xl px-3 py-2.5 transition bg-[var(--card)] min-h-[44px]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-[var(--card)] border border-ink/10 text-ink text-sm flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2">
                <p className="text-xs text-ticket leading-relaxed">{error}</p>
                {hint && <p className="text-[11px] text-muted leading-relaxed mt-1">{hint}</p>}
                {lastFailed && !busy && (
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-1.5 min-h-[36px] px-3 rounded-lg bg-ticket text-white text-[11px] font-semibold transition active:scale-95"
                  >
                    Thử lại
                  </button>
                )}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Ô nhập: safe-area bottom + chống iOS zoom (text-base trên mobile) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2 p-2 bg-[var(--card)] border-t border-ink/10 shrink-0
                       pb-[max(env(safe-area-inset-bottom),8px)]"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={setInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              type="textarea"
              rows={1}
              maxLength={2000}
              enterKeyHint="send"
              placeholder="Hỏi về bài học…"
              className="flex-1 resize-none bg-paper rounded-xl px-3 py-2 text-base sm:text-sm font-body
                         text-ink placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10
                         max-h-28 min-h-[44px]"
              variant="default"
            />
            {busy ? (
              <button
                type="button"
                onClick={cancel}
                className="w-11 h-11 shrink-0 rounded-full bg-ticket text-white flex items-center
                           justify-center text-sm font-bold transition"
                aria-label="Huỷ"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-11 h-11 shrink-0 rounded-full bg-ink text-paper flex items-center justify-center
                           text-sm font-bold hover:bg-ink2 transition disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Gửi"
              >
                ↑
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}