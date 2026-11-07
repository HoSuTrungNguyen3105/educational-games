import { Check, Gamepad2, ImageOff, CircleHelp, MousePointerClick, PenLine } from "lucide-react";
import { thumbnailForGame } from "../../lib/gameThumbnail.js";

// LessonElementView — render MỘT phần tử bài học theo đúng dữ liệu JSON
// (hệ toạ độ canvas 1280×720, kích thước là px logic — stage cha tự scale).
// Dùng chung cho: canvas soạn thảo (Studio), thumbnail trang, và
// LessonPlayer phía học sinh/xem trước — để ba nơi không lệch nhau.
//
// - `showAnswer`: CHỈ bật ở phía giáo viên (canvas soạn + panel) để thấy
//   đáp án đúng. Phía học sinh/player TUYỆT ĐỐI không truyền prop này —
//   đáp án đúng không được đánh dấu trước khi học sinh trả lời (§20).
// - `game`: object game online (từ /api/games) tương ứng props.gameId,
//   để hiện thumbnail + tên; thiếu game → khung "chưa chọn game".

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const baseTextStyle = (el, fallbackSize, fallbackColor) => ({
  fontSize: el.props?.fontSize || fallbackSize,
  color: el.props?.color || fallbackColor,
  textAlign: el.props?.align || "left",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflow: "hidden",
  lineHeight: 1.25,
  width: "100%",
  height: "100%",
});

export function QuestionBadge({ qtype }) {
  const isFill = qtype === "fill";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold text-white"
      style={{ background: isFill ? "#0e7490" : "#6d28d9" }}
    >
      {isFill ? <PenLine className="w-3.5 h-3.5" /> : <MousePointerClick className="w-3.5 h-3.5" />}
      {isFill ? "Điền từ" : "Trắc nghiệm"}
    </span>
  );
}

export default function LessonElementView({ el, game = null, showAnswer = false }) {
  const p = el.props || {};

  if (el.type === "title") {
    return (
      <div style={{ ...baseTextStyle(el, 48, "#1D2E4A"), fontWeight: 800, lineHeight: 1.15 }}>
        {p.text || ""}
      </div>
    );
  }

  if (el.type === "text") {
    return <div style={baseTextStyle(el, 24, "#243B53")}>{p.text || ""}</div>;
  }

  if (el.type === "note") {
    return (
      <div
        className="w-full h-full rounded-xl shadow-sm"
        style={{ background: "#FFF3C4", border: "2px solid #F2D06B", padding: "14px 16px" }}
      >
        <div style={{ ...baseTextStyle(el, 20, "#5B4A12"), height: "100%" }}>{p.text || ""}</div>
      </div>
    );
  }

  if (el.type === "image") {
    if (!p.imageUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 rounded-xl text-[#8A7C63]"
          style={{ border: "2px dashed #C9BBA0", background: "#FFFBF2" }}>
          <ImageOff className="w-10 h-10" />
          <span className="text-[15px] font-medium">Chưa chọn ảnh</span>
        </div>
      );
    }
    return (
      <img src={p.imageUrl} alt={p.alt || ""} draggable={false}
        className="w-full h-full rounded-lg" style={{ objectFit: "cover" }} />
    );
  }

  if (el.type === "question") {
    const options = p.qtype === "single" && Array.isArray(p.options) ? p.options : [];
    return (
      <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "2px solid #E3D9C6", boxShadow: "0 4px 14px rgba(29,46,74,0.08)" }}>
        <div className="flex items-center gap-2 px-4 pt-3">
          <QuestionBadge qtype={p.qtype} />
          {typeof p.points === "number" && p.points > 0 && (
            <span className="text-[13px] font-semibold text-[#8A7C63]">{p.points} điểm</span>
          )}
        </div>
        <div className="px-4 py-3 font-semibold" style={{ fontSize: 23, color: "#1D2E4A", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {p.prompt || <span className="text-[#B4A888] font-normal italic">Chưa có nội dung câu hỏi…</span>}
        </div>
        {p.qtype === "single" ? (
          <div className="px-4 pb-4 grid gap-2" style={{ gridTemplateColumns: options.length > 2 ? "1fr 1fr" : "1fr" }}>
            {options.map((opt, i) => {
              const isCorrect = showAnswer && p.correctAnswer && opt.id === p.correctAnswer;
              return (
                <div key={opt.id} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                  style={{
                    border: `2px solid ${isCorrect ? "#1B998B" : "#E7D9BE"}`,
                    background: isCorrect ? "#DBF1EE" : "#FFFBF2",
                    fontSize: 19, color: "#243B53",
                  }}>
                  <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center font-bold text-[15px]"
                    style={{ background: isCorrect ? "#1B998B" : "#EFE6D2", color: isCorrect ? "#fff" : "#8A7C63" }}>
                    {LETTERS[i] || i + 1}
                  </span>
                  <span className="min-w-0 flex-1" style={{ wordBreak: "break-word" }}>{opt.content}</span>
                  {isCorrect && <Check className="w-5 h-5 shrink-0" style={{ color: "#1B998B" }} />}
                </div>
              );
            })}
            {options.length === 0 && <p className="text-[15px] text-[#B4A888] italic">Chưa có đáp án nào</p>}
          </div>
        ) : (
          <div className="px-4 pb-4">
            <div className="rounded-xl px-3 py-3 text-[17px] text-[#B4A888]"
              style={{ border: "2px dashed #C9BBA0", background: "#FFFBF2" }}>
              Học sinh sẽ điền đáp án vào ô này…
            </div>
            {showAnswer && p.correctAnswer && (
              <p className="mt-2 text-[15px]" style={{ color: "#1B998B" }}>
                Đáp án đúng: <b>{p.correctAnswer}</b>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (el.type === "game") {
    if (!p.gameId) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 rounded-2xl text-[#8A7C63]"
          style={{ border: "2px dashed #C9BBA0", background: "#FFFBF2" }}>
          <Gamepad2 className="w-10 h-10" />
          <span className="text-[15px] font-medium">Chưa chọn game</span>
        </div>
      );
    }
    const thumb = game ? thumbnailForGame({ id: game._id, name: game.name, thumbnail: game.thumbnail }) : null;
    return (
      <div className="w-full h-full relative rounded-2xl overflow-hidden"
        style={{ background: "#1D2E4A", border: "2px solid #E3D9C6" }}>
        {thumb && <img src={thumb} alt="" draggable={false} className="absolute inset-0 w-full h-full" style={{ objectFit: "cover", opacity: 0.85 }} />}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 py-3"
          style={{ background: "linear-gradient(transparent, rgba(10,18,32,0.88))" }}>
          <Gamepad2 className="w-6 h-6 text-white shrink-0" />
          <div className="min-w-0">
            <p className="text-white font-bold truncate" style={{ fontSize: 21 }}>
              {game?.name || "Game"}
            </p>
            {game?.subject && <p className="text-white/70 truncate" style={{ fontSize: 14 }}>{game.subject}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-[#B4A888]">
      <CircleHelp className="w-8 h-8" />
    </div>
  );
}
