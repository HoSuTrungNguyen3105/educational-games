import { memo } from "react";

const MessageItem = memo(function MessageItem({ message, isOwn, showSender }) {
  const isFailed = message.status === "failed";
  const isSending = message.status === "sending";

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} group`}>
      {showSender && (
        <span className={`text-[10px] font-mono mb-0.5 px-1 ${isOwn ? "text-teal" : "text-[#8A7C63]"}`}>
          {message.playerName || "Ẩn danh"}
        </span>
      )}
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body break-words ${
          isOwn
            ? "bg-ink text-paper rounded-br-md"
            : "bg-white border border-ink/10 text-ink rounded-bl-md"
        } ${isFailed ? "border-ticket/50 opacity-70" : ""} ${isSending ? "opacity-60" : ""}`}
      >
        {message.content}
      </div>
      {isFailed && (
        <button
          onClick={() => message._retry?.(message)}
          className="text-[10px] text-ticket font-semibold mt-0.5 hover:underline"
        >
          Gửi lại ↻
        </button>
      )}
    </div>
  );
});

export default MessageItem;
