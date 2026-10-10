// components/ai/AiChatWidget.jsx
//
// Khung chat AI hỗ trợ học tập, kiểu nút nổi góc phải như ChatPanel sẵn có.
//
// Nguyên tắc:
//  - Lịch sử do React quản lý và gửi kèm mỗi lượt. AI Service không lưu hội thoại.
//  - `conversationId` chỉ là nhãn nhóm hội thoại phía client, không phải khoá truy cập.
//  - Không bao giờ hiển thị OLLAMA_KEY hay chi tiết lỗi kỹ thuật — chỉ dùng message
//    thân thiện mà AI Service đã chuẩn hoá.

import { useEffect, useRef, useState } from "react";
import { AI_BASE, chat } from "../../services/aiApi.js";

/** Thông báo tiếng Việt theo loại lỗi của AI Service. */
export function aiErrorText(e) {
  switch (e?.kind) {
    case "offline":
    case "timeout":
    case "badRequest":
    case "auth":
    case "forbidden":
    case "rateLimit":
    case "server":
    case "badResponse":
      return e.message;
    default:
      return e?.message || "Không kết nối được trợ lý AI.";
  }
}

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
  const [conversationId, setConversationId] = useState(null);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text) {
    const content = String(text ?? input).trim();
    if (!content || busy) return;

    setError(null);
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
      // Huỷ thủ công thì im lặng, không báo lỗi.
      if (e?.kind !== "timeout" || !ctrl.signal.aborted) {
        setError(aiErrorText(e));
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
    setBusy(false);
    setConversationId(null);
  }

  return (
    <>
      {/* Nút nổi — desktop */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Trợ lý AI hỗ trợ học tập"
        aria-label="Trợ lý AI hỗ trợ học tập"
        className="hidden sm:flex fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-ink text-paper shadow-xl hover:bg-ink2 active:scale-95 transition items-center justify-center text-lg"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Nút nổi — mobile */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Trợ lý AI hỗ trợ học tập"
        className="sm:hidden fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-ink text-paper shadow-xl active:scale-95 transition flex items-center justify-center text-lg"
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 sm:w-96 sm:h-[34rem] bg-paper2 border-2 border-ink/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden anim-pop">
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-ink text-paper shrink-0">
            <div className="min-w-0">
              <p className="font-display text-sm font-bold truncate">{title}</p>
              <p className="text-[10px] font-mono text-paper/60 truncate">
                {AI_BASE.replace(/^https?:\/\//, "")}
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="shrink-0 text-[11px] font-semibold text-paper/70 hover:text-paper transition"
              >
                Xoá
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center px-2 py-6 gap-3">
                <span className="text-4xl float-slow">🤖</span>
                <p className="text-sm font-semibold text-ink">Hỏi gì cũng được về bài học</p>
                <p className="text-xs text-[#8A7C63] leading-relaxed">
                  AI sẽ giải thích từng bước thay vì chỉ đưa đáp án.
                </p>
                <div className="flex flex-col gap-1.5 w-full mt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left text-[11px] text-ink/70 border border-ink/10 hover:border-ink/30 rounded-xl px-3 py-2 transition bg-white"
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
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm font-body whitespace-pre-wrap break-words ${
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
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-white border border-ink/10 text-ink text-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse mr-1" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse mr-1" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2">
                <p className="text-[11px] text-ticket leading-relaxed">{error}</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2 p-2 bg-white border-t border-ink/10 shrink-0"
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
              placeholder="Hỏi về bài học…"
              className="flex-1 resize-none bg-paper rounded-xl px-3 py-2 text-sm font-body text-ink placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10 max-h-28 min-h-[36px]"
            />
            {busy ? (
              <button
                type="button"
                onClick={cancel}
                className="w-9 h-9 shrink-0 rounded-full bg-ticket text-white flex items-center justify-center text-sm font-bold transition"
                aria-label="Huỷ"
              >
                ✕
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 shrink-0 rounded-full bg-ink text-paper flex items-center justify-center text-sm font-bold hover:bg-ink2 transition disabled:opacity-30 disabled:cursor-not-allowed"
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