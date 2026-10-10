// components/ai/AiExplainTrigger.jsx
//
// Nút "Giải thích với AI" + panel giải thích, gói lại để mọi nơi trong game chỉ cần
// một dòng JSX. Hiện dùng ở PlayGameScreen (game React) và HtmlGameLoader (game HTML).
//
// Cố ý KHÔNG tự quyết định học sinh trả lời đúng hay sai: frontend không có đáp án đúng
// (backend strip `correctAnswer` cho non-staff), nên nút hiện sau khi câu đã được trả lời
// và để backend chấm.
//
// `open` / `onOpenChange` là tuỳ chọn: game cần tạm dừng màn hình chờ khi panel đang mở
// thì truyền vào; bỏ trống thì component tự quản lý.

import { useState } from "react";
import { loadAuth } from "../../services/api.js";
import AiExplainSheet from "./AiExplainSheet.jsx";

export default function AiExplainTrigger({
  open,
  onOpenChange,
  gameId,
  questionId,
  answer,
  questionText,
  label = "🤖 Giải thích với AI",
  className = "",
}) {
  const [selfOpen, setSelfOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : selfOpen;

  function setOpen(next) {
    if (!isControlled) setSelfOpen(next);
    onOpenChange?.(next);
  }

  if (!questionId) return null;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`min-h-[44px] px-4 rounded-2xl border-2 border-ink/15 bg-white text-ink
                    font-display font-semibold text-sm hover:border-ink/35 hover:bg-ink/5
                    active:scale-[0.98] transition ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <AiExplainSheet
      open={isOpen}
      onClose={() => setOpen(false)}
      gameId={gameId}
      questionId={questionId}
      answer={answer}
      questionText={questionText}
      needsLogin={!loadAuth()?.token}
    />
  );
}