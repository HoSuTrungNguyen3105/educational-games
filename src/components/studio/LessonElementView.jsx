import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flag, FlaskConical, Gamepad2, ImageOff, CircleHelp, MousePointerClick, PenLine, RotateCcw } from "lucide-react";
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

// ── Mô phỏng tương tác (type "simulation") ─────────────────────────────
// Thẻ mô phỏng có STEPPER bằng state nội bộ: học sinh bấm "Bước tiếp
// theo" để đi từng bước, hình minh hoạ (visual) thay đổi ĐƠN ĐIỆU theo
// tiến độ bước t = bước hiện tại / (số bước − 1): bước đầu t=0, bước
// cuối t=1 (visual chạm đúng giá trị đích ở bước cuối). Ba kind visual
// khớp validate phía server (lessonService.normalizeSimulationVisual):
// fraction (thanh chia phần), numberline (trục số), groups (nhóm chấm).

const SIM_ACCENT = "#0E7490";

function FractionVisual({ visual, t }) {
  const filled = Math.round(visual.numerator * t);
  return (
    <div className="w-full px-2">
      <div className="flex gap-1.5">
        {Array.from({ length: visual.denominator }, (_, i) => (
          <div key={i} className="flex-1 rounded-lg transition-all duration-500"
            style={{
              height: 62,
              border: `2px solid ${i < filled ? SIM_ACCENT : "#D8CDB4"}`,
              background: i < filled ? "linear-gradient(180deg,#22B8CF,#0E7490)" : "#FFFBF2",
            }} />
        ))}
      </div>
      <p className="mt-3 text-center" style={{ fontSize: 19, color: "#52606D" }}>
        <b style={{ fontSize: 30, color: "#1D2E4A" }}>{filled}/{visual.denominator}</b>
        <span className="ml-3 font-semibold">
          {filled === 0 ? "Chưa lấy phần nào" : filled === visual.denominator ? "Đã lấy cả đơn vị!" : `Đã lấy ${filled} phần bằng nhau`}
        </span>
      </p>
    </div>
  );
}

function GroupsVisual({ visual, t }) {
  const revealed = Math.round(visual.groups * t);
  return (
    <div className="w-full px-2">
      <div className="flex flex-wrap items-stretch justify-center gap-3">
        {Array.from({ length: visual.groups }, (_, g) => {
          const on = g < revealed;
          return (
            <div key={g} className="flex items-center gap-1.5 rounded-2xl px-3 py-2.5 transition-all duration-500"
              style={{
                border: `2px solid ${on ? SIM_ACCENT : "#E3D9C6"}`,
                background: on ? "#E6FFFA" : "#FFFBF2",
                opacity: on ? 1 : 0.45,
              }}>
              {Array.from({ length: visual.perGroup }, (_, i) => (
                <span key={i} className="rounded-full shrink-0"
                  style={{ width: 20, height: 20, background: on ? SIM_ACCENT : "#D8CDB4" }} />
              ))}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center font-semibold" style={{ fontSize: 19, color: "#52606D" }}>
        {revealed}/{visual.groups} nhóm · mỗi nhóm {visual.perGroup} · tất cả {visual.groups * visual.perGroup}
      </p>
    </div>
  );
}

function NumberlineVisual({ visual, t }) {
  const { from, to, highlight } = visual;
  const pos = from + (highlight - from) * t;
  const pct = (v) => ((v - from) / (to - from)) * 100;
  const range = to - from;
  const ticks = range <= 24 ? Array.from({ length: range + 1 }, (_, i) => from + i) : [from, to];
  return (
    <div className="w-full px-5">
      <div className="relative" style={{ height: 96 }}>
        <div className="absolute flex flex-col items-center" style={{ left: `${pct(highlight)}%`, transform: "translateX(-50%)", top: 0 }}>
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold text-white" style={{ background: "#D97706", fontSize: 13 }}>
            <Flag className="w-3 h-3" /> Đích {highlight}
          </span>
        </div>
        <div className="absolute rounded-full" style={{ left: 0, right: 0, top: 54, height: 6, background: "#D8CDB4" }} />
        {ticks.map((v) => (
          <span key={v} className="absolute" style={{ left: `${pct(v)}%`, transform: "translateX(-50%)", top: 48, width: 2, height: 18, background: "#B4A888" }} />
        ))}
        <span className="absolute font-semibold" style={{ left: `${pct(from)}%`, transform: "translateX(-50%)", top: 74, fontSize: 15, color: "#52606D" }}>{from}</span>
        <span className="absolute font-semibold" style={{ left: `${pct(to)}%`, transform: "translateX(-50%)", top: 74, fontSize: 15, color: "#52606D" }}>{to}</span>
        <div className="absolute rounded-full transition-all duration-500"
          style={{
            left: `${pct(pos)}%`, transform: "translateX(-50%)", top: 41, width: 30, height: 30,
            background: SIM_ACCENT, border: "3px solid #fff", boxShadow: "0 2px 8px rgba(14,116,144,0.45)", zIndex: 2,
          }} />
      </div>
      <p className="text-center font-semibold" style={{ fontSize: 19, color: "#52606D" }}>
        Điểm đánh dấu đang ở vị trí <b style={{ color: "#1D2E4A" }}>{Math.round(pos)}</b>
      </p>
    </div>
  );
}

function SimulationView({ el }) {
  const p = el.props || {};
  const steps = (Array.isArray(p.steps) ? p.steps : []).filter((s) => String(s || "").trim());
  const [step, setStep] = useState(0);
  const last = Math.max(0, steps.length - 1);
  const cur = Math.min(step, last);
  const t = steps.length > 1 ? cur / (steps.length - 1) : 1;
  const visual = p.visual && typeof p.visual === "object" ? p.visual : null;

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden"
      style={{ background: "#FFFFFF", border: "2px solid #E3D9C6", boxShadow: "0 4px 14px rgba(29,46,74,0.08)" }}>
      <div className="flex items-center gap-2.5 px-4 pt-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold text-white"
          style={{ background: "linear-gradient(90deg,#0E7490,#1B998B)" }}>
          <FlaskConical className="w-3.5 h-3.5" /> Mô phỏng
        </span>
        <span className="text-[13px] font-semibold text-[#8A7C63]">Bấm “Bước tiếp theo” và quan sát điều gì xảy ra</span>
      </div>
      <div className="px-4 pt-2 font-bold" style={{ fontSize: 26, color: "#1D2E4A", lineHeight: 1.2 }}>
        {p.title || "Mô phỏng"}
      </div>
      {p.intro ? (
        <div className="px-4 pt-1" style={{ fontSize: 19, color: "#52606D", lineHeight: 1.35 }}>{p.intro}</div>
      ) : null}

      <div className="flex-1 grid place-items-center px-4 py-3 min-h-0 overflow-hidden">
        {visual?.kind === "fraction" && <FractionVisual visual={visual} t={t} />}
        {visual?.kind === "groups" && <GroupsVisual visual={visual} t={t} />}
        {visual?.kind === "numberline" && <NumberlineVisual visual={visual} t={t} />}
        {!visual && (
          <p className="text-center" style={{ fontSize: 18, color: "#B4A888" }}>
            Làm theo từng bước ở dưới để khám phá nhé!
          </p>
        )}
      </div>

      {steps.length > 0 ? (
        <div className="px-4 pb-4">
          <div className="rounded-xl px-3.5 py-3" style={{ background: "#F0FAF8", border: "2px solid #BFE8DF" }}>
            <span className="font-bold" style={{ color: SIM_ACCENT, fontSize: 17 }}>Bước {cur + 1}/{steps.length}: </span>
            <span style={{ fontSize: 19, color: "#243B53" }}>{steps[cur]}</span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <button type="button" disabled={cur <= 0} onClick={() => setStep(cur - 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full font-semibold text-[14px] bg-[#EFE6D2] text-ink disabled:opacity-40">
              <ArrowLeft className="w-4 h-4" /> Bước trước
            </button>
            <div className="flex-1 flex items-center justify-center gap-1.5">
              {steps.map((_, i) => (
                <span key={i} className="rounded-full transition-all duration-300"
                  style={{ width: i === cur ? 22 : 10, height: 10, background: i <= cur ? SIM_ACCENT : "#E3D9C6" }} />
              ))}
            </div>
            <button type="button" onClick={() => setStep(0)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full font-semibold text-[14px] bg-[#EFE6D2] text-ink">
              <RotateCcw className="w-4 h-4" /> Làm lại
            </button>
            {cur < last ? (
              <button type="button" onClick={() => setStep(cur + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-white text-[14px]"
                style={{ background: SIM_ACCENT }}>
                Bước tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-white text-[14px]" style={{ background: "#1B998B" }}>
                <Check className="w-4 h-4" /> Đã xem hết các bước
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="px-4 pb-4 text-[15px] text-[#B4A888] italic">Mô phỏng chưa có bước nào.</p>
      )}
    </div>
  );
}

export default function LessonElementView({ el, game = null, showAnswer = false }) {
  const p = el.props || {};

  if (el.type === "title") {
    // Dải nhấn gradient mảnh dưới chân chữ — thuần trình bày, nằm gọn
    // trong khung phần tử (không đổi toạ độ/kích thước), thẳng hàng theo
    // căn lề của chữ để tiêu đề trông sinh động hơn ở mọi nơi render.
    const align = el.props?.align || "left";
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={{ ...baseTextStyle(el, 48, "#1D2E4A"), fontWeight: 800, lineHeight: 1.15 }}>
          {p.text || ""}
        </div>
        <span aria-hidden="true"
          style={{
            position: "absolute", bottom: 4, height: 6, width: 108, borderRadius: 999,
            background: "linear-gradient(90deg,#F2B33D,#E4572E,#8B5CF6)",
            ...(align === "center"
              ? { left: "50%", transform: "translateX(-50%)" }
              : align === "right" ? { right: 2 } : { left: 2 }),
          }} />
      </div>
    );
  }

  if (el.type === "simulation") {
    return <SimulationView el={el} />;
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

  if (el.type === "decor") {
    // Phần tử trang trí: emoji lớn vừa khung (xe buýt, thước, máy bay giấy,
    // ngôi sao, trái tim, mặt cười, bút chì…). Chỉ là hình ảnh, không chấm điểm.
    const glyph = (p.emoji || "⭐").trim() || "⭐";
    return (
      <div
        className="w-full h-full flex items-center justify-center select-none"
        style={{
          fontSize: Math.max(12, Math.min(el.w, el.h) * 0.86),
          lineHeight: 1,
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.16))",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        {glyph}
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
