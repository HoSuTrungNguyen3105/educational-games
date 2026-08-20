import { fontStack } from "./elementUtils.js";
import { memo, useCallback, useMemo } from "react";
import { GameComponentRenderer } from "./templates/GameComponentRegistry.jsx";

// ---------------------------------------------------------------------------
// Dữ liệu tĩnh: tạo 1 lần duy nhất khi module load, không tạo lại mỗi render
// ---------------------------------------------------------------------------
const FALLBACK_ANSWERS = ["Paris", "London", "Tokyo", "Seoul"].map((t, i) => ({
  id: `a${i}`,
  content: t,
  label: String.fromCharCode(65 + i),
}));

// ---------------------------------------------------------------------------
// Style builder cho từng element — hàm thuần (pure), không đọc context runtime,
// nên có thể memo hoá theo riêng `el`.
// ---------------------------------------------------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export function renderElementStyle(el) {
  const p = el.properties || {};
  const common = {
    position: "absolute",
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    zIndex: el.zIndex,
  };

  switch (el.type) {
    case "text":
      return {
        ...common,
        color: p.color || "#1D2E4A",
        fontSize: p.fontSize || 24,
        fontWeight: p.fontWeight || 500,
        fontFamily: fontStack(p.font),
        textAlign: p.align || "left",
        background: p.background || "transparent",
        padding: p.padding || 0,
        lineHeight: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: p.align === "center" ? "center" : p.align === "right" ? "flex-end" : "flex-start",
        whiteSpace: "pre-wrap",
      };
    case "image":
      return {
        ...common,
        objectFit: "cover",
        borderRadius: p.radius || 0,
        opacity: (p.opacity ?? 100) / 100,
      };
    case "button":
      return {
        ...common,
        background: p.background || "#1B998B",
        color: p.color || "#FFFFFF",
        fontSize: p.fontSize || 20,
        fontWeight: p.fontWeight || 600,
        fontFamily: fontStack(p.font),
        textAlign: "center",
        borderRadius: p.radius || 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      };
    case "shape": {
      if (p.kind === "line") {
        return {
          ...common,
          background: "transparent",
          borderTop: `${p.strokeWidth || 2}px ${p.dash ? "dashed" : "solid"} ${p.stroke || "#1D2E4A"}`,
          width: el.width,
          height: 0,
          borderRadius: 0,
        };
      }
      return {
        ...common,
        background: p.fill || "#F4B942",
        border: p.strokeWidth ? `${p.strokeWidth}px solid ${p.stroke || "#1D2E4A"}` : "none",
        borderRadius: p.kind === "circle" ? "50%" : p.radius || 12,
        opacity: (p.opacity ?? 100) / 100,
      };
    }
    case "question":
      return {
        ...common,
        color: p.color || "#1D2E4A",
        fontSize: p.fontSize || 32,
        fontWeight: p.fontWeight || 700,
        fontFamily: fontStack(p.font),
        textAlign: p.align || "center",
        display: "flex",
        alignItems: "center",
        justifyContent: p.align === "center" ? "center" : p.align === "right" ? "flex-end" : "flex-start",
        whiteSpace: "pre-wrap",
        lineHeight: 1.25,
      };
    case "answer":
      return {
        ...common,
        display: "flex",
        flexDirection: "column",
        gap: p.gap || 10,
      };
    case "timer":
      return {
        ...common,
        color: p.color || "#E4572E",
        fontSize: p.fontSize || 36,
        fontWeight: p.fontWeight || 700,
        fontFamily: fontStack(p.font),
        textAlign: p.align || "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    case "leaderboard":
      return {
        ...common,
        background: p.background || "#FFFFFF",
        borderRadius: p.radius || 16,
        display: "flex",
        flexDirection: "column",
        gap: p.gap || 6,
        padding: 12,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      };
    default:
      return common;
  }
}

// ---------------------------------------------------------------------------
// Content builder — có đọc context runtime (câu hỏi, điểm số, thời gian...)
// ---------------------------------------------------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export function renderElementContent(el, context = {}) {
  const p = el.properties || {};
  const question = context.question;
  switch (el.type) {
    case "text":
      return p.text || "";
    case "image":
      return p.src ? (
        <img
          src={p.src}
          alt={p.alt || ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
        />
      ) : null;
    case "button":
      return p.text || "Button";
    case "shape":
      return null;
    case "question":
      return question ? question.content : (p.text || "Câu hỏi của bạn");
    case "answer": {
      const list = question?.options || context.options || FALLBACK_ANSWERS;
      const cols = p.columns || 2;
      const grid = {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: p.gap || 10,
        height: "100%",
      };
      const isRuntime = !context.editing;
      return (
        <div style={grid}>
          {list.map((opt, i) => {
            const label = opt.label !== undefined ? opt.label : String.fromCharCode(65 + i);
            const content = typeof opt === "string" ? opt : opt.content ?? opt.text;
            const isSelected = context.selected === opt.id;
            const isCorrect = isRuntime && context.revealed && opt.id === question?.correctAnswer;
            const isWrong = isRuntime && context.revealed && isSelected && !isCorrect;
            const stateBg = isCorrect
              ? "rgba(27,153,139,0.18)"
              : isWrong
                ? "rgba(228,87,46,0.18)"
                : isSelected
                  ? "rgba(29,46,74,0.08)"
                  : "#FFFFFF";
            const stateBorder = isCorrect
              ? "2px solid #1B998B"
              : isWrong
                ? "2px solid #E4572E"
                : isSelected
                  ? "2px solid #1D2E4A"
                  : "2px solid rgba(0,0,0,0.08)";
            const cursor = context.editing ? "default" : context.revealed ? "default" : "pointer";
            return (
              <div
                key={opt.id || i}
                className={`answer-chip ${isRuntime ? "runtime-answer" : ""}`}
                data-answer-id={opt.id}
                data-answer-index={i}
                style={{
                  background: isRuntime ? stateBg : (context.palette ? context.palette[i % context.palette.length] : "#FFFFFF"),
                  color: p.color || "#1D2E4A",
                  fontSize: p.fontSize || 20,
                  fontWeight: p.fontWeight || 500,
                  fontFamily: fontStack(p.font),
                  borderRadius: 12,
                  border: isRuntime ? stateBorder : "2px solid rgba(0,0,0,0.08)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor,
                }}
              >
                <span className="answer-letter" style={{ fontWeight: 700 }}>{label}.</span>
                <span style={{ flex: 1 }}>{content}</span>
                {isRuntime && isCorrect && <span style={{ color: "#1B998B" }}>✓</span>}
                {isRuntime && isWrong && <span style={{ color: "#E4572E" }}>✕</span>}
              </div>
            );
          })}
        </div>
      );
    }
    case "timer": {
      const seconds = context.timeLeft ?? 30;
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(Math.round(seconds) % 60).padStart(2, "0");
      return <>{mm}:{ss}</>;
    }
    case "leaderboard": {
      const rows = context.leaderboard || context.players || [];
      const myName = context.playerName;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: p.gap || 6, height: "100%", overflow: "hidden" }}>
          <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>🏅 Bảng xếp hạng</div>
          {rows.length === 0 ? (
            <div style={{ opacity: 0.5, fontSize: 14 }}>Chưa có người chơi</div>
          ) : (
            rows.map((row, i) => (
              <div
                key={row.playerId || row.id || i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: p.fontSize || 14,
                  color: p.color || "#1D2E4A",
                  fontFamily: fontStack(p.font),
                  fontWeight: p.fontWeight || 500,
                  opacity: row.highlight || row.name === myName ? 1 : 0.9,
                  background: row.highlight || row.name === myName ? "rgba(255,111,145,0.12)" : "transparent",
                  borderRadius: 8,
                  padding: "2px 6px",
                }}
              >
                <span style={{ minWidth: 22 }}>{["🥇", "🥈", "🥉"][i] || `${i + 1}.`}</span>
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.name || row.playerName}{row.name === myName ? " (bạn)" : ""}
                </span>
                <span style={{ fontWeight: 700 }}>{row.score}</span>
              </div>
            ))
          )}
        </div>
      );
    }
    case "game-component":
      return <GameComponentRenderer el={el} context={context} editing={context.editing} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Chỉ ra "lát cắt" context mà mỗi loại element thực sự phụ thuộc.
// Nhờ đó timer chạy mỗi giây KHÔNG kéo theo việc render lại toàn bộ canvas
// (text/image/button/shape là tĩnh, không phụ thuộc context runtime).
// ---------------------------------------------------------------------------
function relevantContextSlice(el, context) {
  switch (el.type) {
    case "question":
      return { question: context.question };
    case "answer":
      return {
        question: context.question,
        options: context.options,
        selected: context.selected,
        revealed: context.revealed,
        palette: context.palette,
      };
    case "timer":
      return { timeLeft: context.timeLeft };
    case "leaderboard":
      return {
        leaderboard: context.leaderboard,
        players: context.players,
        playerName: context.playerName,
      };
    case "game-component":
      return context;
    default:
      return null; // text / image / button / shape: không đọc context runtime
  }
}

function shallowEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
}

// ---------------------------------------------------------------------------
// Một element trên canvas — memo hoá để chỉ re-render khi:
//  - chính element đó thay đổi (di chuyển, đổi thuộc tính, v.v.), hoặc
//  - phần context mà loại element đó thực sự cần dùng thay đổi.
// Style được useMemo theo `el` nên không tính lại mỗi lần cha re-render.
// ---------------------------------------------------------------------------
const CanvasElement = memo(
  function CanvasElement({ el, context, editing, clickable }) {
    const style = useMemo(() => renderElementStyle(el), [el]);
    const content = renderElementContent(el, { ...context, editing });
    if (content === null && el.type !== "shape") return null;

    return (
      <div
        style={style}
        data-type={el.type}
        data-id={el.id}
        data-clickable={clickable || undefined}
      >
        {content}
      </div>
    );
  },
  (prev, next) => {
    if (prev.el !== next.el || prev.editing !== next.editing || prev.clickable !== next.clickable) {
      return false;
    }
    const prevSlice = relevantContextSlice(prev.el, prev.context);
    const nextSlice = relevantContextSlice(next.el, next.context);
    if (prevSlice === null) return true; // element tĩnh: bỏ qua mọi thay đổi context
    return shallowEqual(prevSlice, nextSlice);
  }
);

// ---------------------------------------------------------------------------
// Render toàn bộ template (canvas + elements)
// - sort chỉ tính lại khi mảng elements đổi (useMemo)
// - dùng 1 click handler duy nhất (event delegation) thay vì tạo N closure
//   mới cho N element mỗi lần render
// - shape giờ cũng click được, để giáo viên chọn/sửa hình khối trên canvas
//   (trước đây bị "câm" vì content của shape luôn là null)
// ---------------------------------------------------------------------------
export default function TemplateRenderer({ template, context = {}, onElementClick, editing = false }) {
  const sorted = useMemo(() => {
    if (!template) return [];
    return [...template.elements].sort((a, b) => a.zIndex - b.zIndex);
  }, [template]);

  const elementsById = useMemo(() => {
    const map = new Map();
    sorted.forEach((el) => map.set(String(el.id), el));
    return map;
  }, [sorted]);

  const handleClick = useCallback(
    (e) => {
      if (!onElementClick) return;
      const target = e.target.closest("[data-id]");
      if (!target) return;
      const el = elementsById.get(target.dataset.id);
      if (el) onElementClick(el);
    },
    [onElementClick, elementsById]
  );

  if (!template) return null;

  return (
    <div
      style={{
        position: "relative",
        width: template.canvas.width,
        height: template.canvas.height,
        background: template.canvas.background || "#FFF6E7",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onClick={onElementClick ? handleClick : undefined}
    >
      {sorted.map((el) => (
        <CanvasElement
          key={el.id}
          el={el}
          context={context}
          editing={editing}
          clickable={!!onElementClick}
        />
      ))}
    </div>
  );
}