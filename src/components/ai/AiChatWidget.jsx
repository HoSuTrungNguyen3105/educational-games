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
import { aiErrorHint, aiErrorText } from "./aiErrorText.js";
import { AiNotReadyNotice } from "./AiNotReadyNotice.jsx";
import AiMarkdown from "./AiMarkdown.jsx";
import { Input } from "../ui";
import { BookOpen, Bot, X } from "lucide-react";

const MAX_LOCAL_TURNS = 12;

// Gợi ý câu hỏi nhanh (§8 của đặc tả nâng cấp AI Bạn Học): bao quát giải
// thích từng bước, xin ví dụ, tạo câu luyện tập và hỏi ngày giờ Việt Nam.
const SUGGESTIONS = [
  "Giải thích bài này từng bước cho mình",
  "Cho mình một ví dụ dễ hiểu",
  "Tạo 5 câu luyện tập cho mình",
  "Hôm nay là thứ mấy?",
];

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
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-left text-[12px] text-ink/70 border border-ink/10 hover:border-ink/30
                                   rounded-xl px-3 py-2.5 transition bg-white min-h-[44px]"
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
                      : "bg-white border border-ink/10 text-ink rounded-bl-md"
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

            {busy && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-white border border-ink/10 text-ink text-sm flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2">
                <p className="text-xs text-ticket leading-relaxed">{error}</p>
                {hint && <p className="text-[11px] text-[#8A7C63] leading-relaxed mt-1">{hint}</p>}
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
            className="flex items-end gap-2 p-2 bg-white border-t border-ink/10 shrink-0
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