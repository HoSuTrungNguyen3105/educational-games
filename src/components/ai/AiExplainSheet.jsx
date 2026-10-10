// components/ai/AiExplainSheet.jsx
//
// Giai đoạn 1 của "AI Bạn Học": bảng giải thích một câu hỏi học sinh vừa trả lời.
//
// Nguyên tắc:
//  - Frontend KHÔNG biết đáp án đúng và cũng không tự kết luận học sinh sai hay đúng.
//    `isCorrect` do backend Node chấm và trả về cùng lời giải thích.
//  - Mặc định AI chỉ đưa GỢI Ý TỪNG BƯỚC. Chỉ khi học sinh bấm nút mới yêu cầu lời giải
//    đầy đủ (`reveal`) — đúng tinh thần "gợi ý trước, đáp án sau".
//  - AI hỏng KHÔNG được làm hỏng luồng chơi game: panel chỉ hiện thông báo + nút Thử lại.
//  - Câu trả lời hiển thị dạng văn bản thuần (whitespace-pre-wrap). Không dùng
//    dangerouslySetInnerHTML, không Markdown, không thực thi bất cứ nội dung nào của AI.
//  - Bám convention mobile của AiChatWidget: overlay fullscreen ở mobile, panel bo góc ở
//    desktop, mọi nút ≥ 44px, input text-base để iOS không tự phóng to.

import { useCallback, useEffect, useRef, useState } from "react";
import { explain } from "../../services/aiApi.js";
import { aiErrorHint, aiErrorText } from "./aiErrorText.js";

/** Số lượt hỏi bổ sung tối đa trong một phiên mở panel. */
const MAX_FOLLOW_UPS = 4;

export default function AiExplainSheet({
  open,
  onClose,
  gameId,
  questionId,
  answer,
  questionText,
  needsLogin = false,
}) {
  const [turns, setTurns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [followUp, setFollowUp] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const abortRef = useRef(null);
  const busyRef = useRef(false);
  const bottomRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, busy, open]);

  // Escape để thoát — bàn phím không bị kẹt trong overlay.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  // Khoá cuộn nền khi overlay đang mở.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const ask = useCallback(
    async ({ reveal = false, followUp: extra = null } = {}) => {
      if (!questionId || busyRef.current) return;

      busyRef.current = true;
      setBusy(true);
      setError(null);
      setHint(null);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await explain({
          questionId,
          gameId,
          answer,
          reveal,
          followUp: extra,
          signal: ctrl.signal,
        });
        setTurns((prev) => [
          ...prev,
          ...(extra ? [{ role: "user", content: extra }] : []),
          { role: "assistant", content: res.answer, revealed: res.revealed },
        ]);
        if (reveal) setRevealed(true);
        if (typeof res.isCorrect === "boolean") setIsCorrect(res.isCorrect);
      } catch (e) {
        // Người dùng đóng panel giữa chừng thì im lặng, không báo lỗi.
        if (ctrl.signal.aborted && e?.kind === "timeout") return;
        setError(aiErrorText(e));
        setHint(aiErrorHint(e));
      } finally {
        busyRef.current = false;
        setBusy(false);
        abortRef.current = null;
      }
    },
    [answer, gameId, questionId]
  );

  // Tự hỏi ngay khi mở panel — học sinh chỉ cần một chạm. Trễ một nhịp để trạng
  // thái "AI đang nghĩ…" kịp vẽ trước khi request đi.
  useEffect(() => {
    if (!open || !questionId || needsLogin) return undefined;
    const t = setTimeout(() => ask(), 0);
    return () => clearTimeout(t);
  }, [open, questionId, needsLogin, ask]);

  if (!open) return null;

  function submitFollowUp() {
    const text = followUp.trim();
    if (!text || busy || turns.length >= MAX_FOLLOW_UPS * 2) return;
    setFollowUp("");
    ask({ followUp: text });
  }

  const canReveal = Boolean(questionId) && !revealed && !busy && !needsLogin;
  const followUpsLeft = MAX_FOLLOW_UPS - turns.filter((t) => t.role === "user").length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI Bạn Học giải thích câu hỏi"
      className="fixed inset-0 z-[60] flex flex-col bg-paper2 anim-fade
                 lg:inset-auto lg:bottom-24 lg:right-6 lg:w-[26rem] lg:h-[34rem]
                 lg:rounded-3xl lg:border-2 lg:border-ink/15 lg:shadow-2xl lg:anim-pop"
    >
      <div
        className="flex items-center justify-between gap-2 px-4 py-3 bg-ink text-paper shrink-0
                   pt-[max(env(safe-area-inset-top),12px)] lg:pt-3"
      >
        <div className="min-w-0">
          <p className="font-display text-sm font-bold truncate">🤖 AI Bạn Học</p>
          <p className="text-[10px] text-paper/60 truncate">
            {isCorrect === true ? "Bạn đã trả lời đúng" : isCorrect === false ? "Mình cùng xem lại nhé" : "Đang chuẩn bị…"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!busy) {
              abortRef.current?.abort();
              onClose?.();
            }
          }}
          disabled={busy}
          aria-label="Đóng"
          className="w-11 h-11 rounded-full text-paper/80 hover:bg-white/10 hover:text-paper
                     transition text-lg leading-none disabled:opacity-40"
        >
          ✕
        </button>
      </div>

      {questionText && (
        <div className="px-4 py-2.5 bg-white/70 border-b border-ink/10 shrink-0">
          <p className="text-[10px] font-mono uppercase text-[#8A7C63]">Câu hỏi</p>
          <p className="text-[13px] text-ink leading-snug break-words line-clamp-3">{questionText}</p>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3 space-y-2.5">
        {needsLogin && (
          <div className="rounded-xl bg-gold/10 border border-gold/30 px-3 py-2.5">
            <p className="text-xs text-[#8a6a10] leading-relaxed">
              Bạn cần đăng nhập để nhờ AI giải thích câu này. Game vẫn chơi bình thường nhé!
            </p>
          </div>
        )}

        {!needsLogin && turns.length === 0 && !error && (
          <div className="flex items-center gap-2 text-ink/60">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
            <span className="text-xs ml-1">AI đang nghĩ…</span>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] px-3 py-2 rounded-2xl text-[15px] sm:text-sm font-body
                          whitespace-pre-wrap break-words ${
                            t.role === "user"
                              ? "bg-ink text-paper rounded-br-md"
                              : "bg-white border border-ink/10 text-ink rounded-bl-md"
                          }`}
            >
              {t.content}
            </div>
          </div>
        ))}

        {busy && turns.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl rounded-bl-md bg-white border border-ink/10 text-ink/60">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink/40 animate-pulse" />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-ticket/10 border border-ticket/20 px-3 py-2.5">
            <p className="text-xs text-ticket leading-relaxed">{error}</p>
            {hint && <p className="text-[11px] text-[#8A7C63] leading-relaxed mt-1">{hint}</p>
            }
            <button
              type="button"
              onClick={() => ask()}
              className="mt-2 min-h-[36px] px-3 rounded-xl bg-ticket text-white text-xs font-semibold
                         hover:bg-ticket/90 transition"
            >
              Thử lại
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        className="shrink-0 bg-white border-t border-ink/10 px-3 py-2 space-y-2
                   pb-[max(env(safe-area-inset-bottom),8px)]"
      >
        {canReveal && (
          <button
            type="button"
            onClick={() => ask({ reveal: true })}
            className="w-full min-h-[44px] rounded-2xl bg-teal text-white font-display font-semibold
                       text-sm hover:brightness-95 active:scale-[0.98] transition"
          >
            💡 Xem lời giải đầy đủ
          </button>
        )}

        {!needsLogin && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitFollowUp();
            }}
            className="flex items-center gap-2"
          >
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              maxLength={500}
              disabled={busy || followUpsLeft <= 0}
              enterKeyHint="send"
              placeholder={
                followUpsLeft > 0 ? "Hỏi thêm về bài này…" : "Bạn đã hỏi đủ cho câu này rồi"
              }
              className="flex-1 bg-paper rounded-xl px-3 py-2 text-base sm:text-sm font-body text-ink
                         placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10
                         min-h-[44px] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !followUp.trim() || followUpsLeft <= 0}
              className="w-11 h-11 shrink-0 rounded-full bg-ink text-paper flex items-center justify-center
                         text-sm font-bold hover:bg-ink2 transition disabled:opacity-30
                         disabled:cursor-not-allowed"
              aria-label="Gửi câu hỏi"
            >
              ↑
            </button>
          </form>
        )}

        <p className="text-[10px] text-[#B7A987] leading-relaxed">
          AI chỉ giải thích, không cộng điểm. Điểm và phần thưởng do hệ thống tự tính.
        </p>
      </div>
    </div>
  );
}