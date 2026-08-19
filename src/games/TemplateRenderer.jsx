import { fontStack } from "./elementUtils.js"

// Render một element riêng lẻ theo design data.
// context: dữ liệu game runtime hoặc mock cho preview.
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

// Render nội dung bên trong element (không tính position/style của chính element)
// eslint-disable-next-line react-refresh/only-export-components
export function renderElementContent(el, context = {}) {
  const p = el.properties || {};
  const question = context.question;
  switch (el.type) {
    case "text":
      return p.text || "";
    case "image":
      return p.src ? <img src={p.src} alt={p.alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} /> : null;
    case "button":
      return p.text || "Button";
    case "shape":
      return null;
    case "question":
      return question ? question.content : (p.text || "Câu hỏi của bạn");
    case "answer": {
      const list = question?.options || context.options || fallbackAnswers();
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
            const stateBg = isCorrect ? "rgba(27,153,139,0.18)" : isWrong ? "rgba(228,87,46,0.18)" : isSelected ? "rgba(29,46,74,0.08)" : "#FFFFFF";
            const stateBorder = isCorrect ? "2px solid #1B998B" : isWrong ? "2px solid #E4572E" : isSelected ? "2px solid #1D2E4A" : "2px solid rgba(0,0,0,0.08)";
            const cursor = context.editing ? "default" : context.revealed ? "default" : "pointer";
            return (
              <div key={opt.id || i} className={`answer-chip ${isRuntime ? "runtime-answer" : ""}`} data-answer-id={opt.id} data-answer-index={i}
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
                }}>
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
          ) : rows.map((row, i) => (
            <div key={row.playerId || row.id || i} style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: p.fontSize || 14, color: p.color || "#1D2E4A",
              fontFamily: fontStack(p.font), fontWeight: p.fontWeight || 500,
              opacity: row.highlight || row.name === myName ? 1 : 0.9,
              background: row.highlight || row.name === myName ? "rgba(255,111,145,0.12)" : "transparent",
              borderRadius: 8, padding: "2px 6px",
            }}>
              <span style={{ minWidth: 22 }}>{["🥇", "🥈", "🥉"][i] || `${i + 1}.`}</span>
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name || row.playerName}{row.name === myName ? " (bạn)" : ""}</span>
              <span style={{ fontWeight: 700 }}>{row.score}</span>
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

function fallbackAnswers() {
  return ["Paris", "London", "Tokyo", "Seoul"].map((t, i) => ({ id: `a${i}`, content: t, label: String.fromCharCode(65 + i) }));
}

// Render toàn bộ template (canvas + elements)
export default function TemplateRenderer({ template, context = {}, onElementClick, editing = false }) {
  if (!template) return null;
  const sorted = [...template.elements].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <div style={{
      position: "relative",
      width: template.canvas.width,
      height: template.canvas.height,
      background: template.canvas.background || "#FFF6E7",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {sorted.map(el => {
        const content = renderElementContent(el, { ...context, editing });
        if (onElementClick && content !== null) {
          return (
            <div key={el.id} style={renderElementStyle(el, context)} onClick={(e) => { e.stopPropagation(); onElementClick(el); }} data-type={el.type} data-id={el.id}>
              {content}
            </div>
          );
        }
        return <div key={el.id} style={renderElementStyle(el, context)} data-type={el.type} data-id={el.id}>{content}</div>;
      })}
    </div>
  );
}