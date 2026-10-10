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
import { aiErrorHint, aiErrorText } from "./aiErrorText.js";

const MAX_LOCAL_TURNS = 12;

const SUGGESTIONS = [
  "Giải thích cách quy đồng hai phân số bằng ví dụ",
  "Cách nhớ phân số nhỏ hơn 1",
  "Bài này nên làm theo những bước nào?",
];

export default function AiChatWidget({ subject, topic, title = "Trợ lý AI" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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

  async function send(text) {
    const content = String(text ?? input).trim();
    if (!content || busy) return;

    setError(null);
    setHint(null);
    setInput("");
    setBusy(true);

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-MAX_LOCAL_TURNS)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content }]);

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
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch (e) {
      // Người dùng bấm Huỷ thì im lặng, không báo lỗi.
      if (e?.kind !== "timeout" || !ctrl.signal.aborted) {
        setError(aiErrorText(e));
        setHint(aiErrorHint(e));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
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
          🤖
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
                ✕
              </button>
            </div>
          </div>

          {/* Danh sách tin: dùng dvh để bàn phím không đè lên ô nhập */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-3 space-y-2.5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center px-2 py-6 gap-3">
                <span className="text-4xl float-slow">🤖</span>
                <p className="font-display text-base sm:text-sm font-semibold text-ink">
                  Hỏi gì cũng được về bài học
                </p>
                <p className="text-xs text-[#8A7C63] leading-relaxed max-w-xs">
                  AI sẽ giải thích từng bước thay vì chỉ đưa đáp án.
                </p>
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
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-[15px] sm:text-sm font-body
                              whitespace-pre-wrap break-words ${
                                m.role === "user"
                                  ? "bg-ink text-paper rounded-br-md"
                                  : "bg-white border border-ink/10 text-ink rounded-bl-md"
                              }`}
                >
                  {m.content}
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
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              maxLength={2000}
              enterKeyHint="send"
              placeholder="Hỏi về bài học…"
              className="flex-1 resize-none bg-paper rounded-xl px-3 py-2 text-base sm:text-sm font-body
                         text-ink placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10
                         max-h-28 min-h-[44px]"
            />
            {busy ? (
              <button
                type="button"
                onClick={cancel}
                className="w-11 h-11 shrink-0 rounded-full bg-ticket text-white flex items-center
                           justify-center text-sm font-bold transition"
                aria-label="Huỷ"
              >
                ✕
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