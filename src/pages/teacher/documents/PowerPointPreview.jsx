import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, Plus, Trash2 } from "lucide-react";
import SandboxFrame from "./SandboxFrame.jsx";
import { buildSlidesScrollSrcDoc } from "../../../lib/documents/modelRender.js";
import { fitScale, useContainerWidth } from "./useContainerWidth.js";
import { SLIDE_TYPE_OPTIONS } from "../../../lib/documents/slideOps.js";

// PowerPointPreview — xem trước bài PowerPoint:
//   • Chế độ JSON: render từng slide theo `type` từ mô hình trung gian —
//     1 slide lớn (16:9 hoặc 4:3) + dải thumbnail + nút trước/sau/chọn
//     slide. Đợt 2 thêm: TỰ VỪA KHUNG (slide tự thu nhỏ theo bề rộng
//     khung, zoom +/- nhân thêm trên mức đó) và THAO TÁC SLIDE BẰNG NÚT
//     (thêm/nhân bản/xoá/lên/xuống) — các nút chỉ HIỆN yêu cầu qua
//     onSlideOp, phía editor mới là nơi sửa bản nháp JSON thật.
//   • Chế độ HTML: hiển thị như tài liệu cuộn trong iframe sandbox
//     (chia slide đầy đủ + thao tác slide chỉ áp dụng cho JSON — ghi rõ
//     trong giao diện).
// Vị trí slide hiện tại do editor quản (index/onIndexChange) vì thao
// tác slide cần biết đang đứng ở slide nào; không truyền thì component
// tự giữ state nội bộ như đợt 1.

const SLIDE_W = 920;

const DEFAULT_PPT_THEME = {
  accent: "#2563eb", accent2: "#f59e0b", soft: "#eff6ff", line: "#bfdbfe",
  ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
  heroBg: "#1d4ed8", heroText: "#ffffff",
  font: "Arial", displayFont: "Arial",
};

function SlideView({ slide, ratio, theme }) {
  const t = { ...DEFAULT_PPT_THEME, ...(theme || {}) };
  const font = `${t.font || "Arial"}, Arial, sans-serif`;
  const displayFont = `${t.displayFont || t.font || "Arial"}, Arial, sans-serif`;
  const style = {
    width: SLIDE_W,
    aspectRatio: ratio === "4:3" ? "4 / 3" : "16 / 9",
    background: t.bg,
    color: t.ink,
    fontFamily: font,
  };
  const shell = "shadow-[0_2px_14px_rgba(0,0,0,.20)] rounded-md overflow-hidden flex flex-col relative";
  if (!slide) {
    return (
      <div style={style} className={`${shell} items-center justify-center text-ink/40 font-body`}>
        Chưa có slide nào — thêm slide trong mã nguồn JSON.
      </div>
    );
  }
  const title = slide.title
    ? <h2 style={{ color: t.accent, fontFamily: displayFont }} className="text-[30px] leading-tight mb-4">{slide.title}</h2>
    : null;
  const bullets = (items, marker = t.accent2) => (
    <ul className="space-y-2 font-body text-[20px] leading-relaxed" style={{ color: t.ink }}>
      {(items || []).map((c, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-[9px] w-2 h-2 rounded-full shrink-0" style={{ background: marker }} />
          <span>{c}</span>
        </li>
      ))}
    </ul>
  );
  const table = (rows) => (
    <table className="w-full border-collapse font-body text-[18px]" style={{ color: t.ink }}>
      <tbody>
        {(rows || []).map((row, ri) => (
          <tr key={ri}>
            {row.map((c, ci) => ri === 0
              ? <th key={ci} className="px-3 py-2 text-left" style={{ border: `1px solid ${t.line}`, background: t.soft, color: t.accent }}>{c}</th>
              : <td key={ci} className="px-3 py-2" style={{ border: `1px solid ${t.line}` }}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
  const accentBar = <span className="absolute left-0 top-0 h-2 w-full" style={{ background: t.accent }} />;

  switch (slide.type) {
    case "title":
      return (
        <div style={{ ...style, background: t.heroBg, color: t.heroText }} className={`${shell} justify-center px-16`}>
          <span className="absolute -right-20 -top-24 w-72 h-72 rounded-full" style={{ background: t.accent, opacity: 0.35 }} />
          <span className="absolute -left-16 -bottom-20 w-56 h-56 rounded-full" style={{ background: t.accent2, opacity: 0.28 }} />
          <span className="absolute left-16 top-12 text-[13px] font-bold tracking-[0.16em] uppercase" style={{ color: t.heroText, opacity: 0.8 }}>
            EduPlay · Bài giảng
          </span>
          <h1 className="relative text-[44px] leading-tight font-bold" style={{ color: t.heroText, fontFamily: displayFont }}>{slide.title}</h1>
          {slide.subtitle ? <p className="relative text-[22px] mt-4" style={{ color: t.heroText, opacity: 0.82 }}>{slide.subtitle}</p> : null}
          <span className="absolute right-16 bottom-10 h-1.5 w-24 rounded-full" style={{ background: t.accent2 }} />
        </div>
      );
    case "image":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          {slide.src
            ? <img src={slide.src} alt={slide.alt || ""} className="max-h-[62%] max-w-full object-contain mx-auto rounded-lg" />
            : <div className="flex-1 grid place-items-center text-ink/40 font-body">Slide hình ảnh chưa có đường dẫn ảnh (src)</div>}
          {slide.caption ? <p className="font-body text-center mt-3" style={{ color: t.muted }}>{slide.caption}</p> : null}
        </div>
      );
    case "two-column":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="rounded-xl p-4" style={{ background: t.soft, borderTop: `4px solid ${t.accent}` }}>{bullets(slide.left, t.accent)}</div>
            <div className="rounded-xl p-4" style={{ background: t.soft, borderTop: `4px solid ${t.accent2}` }}>{bullets(slide.right, t.accent2)}</div>
          </div>
        </div>
      );
    case "table":
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          {table(slide.rows)}
        </div>
      );
    case "summary":
      return (
        <div style={{ ...style, background: t.soft }} className={`${shell} px-12 py-9`}>
          <span className="absolute left-0 top-0 h-full w-3" style={{ background: t.accent }} />
          {title}
          {bullets(slide.content, t.accent)}
        </div>
      );
    default: // content
      return (
        <div style={style} className={`${shell} px-12 py-9`}>
          {accentBar}
          {title}
          {bullets(slide.content)}
        </div>
      );
  }
}

const opBtn = "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-ink/15 bg-white hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-white";

export default function PowerPointPreview({
  model, bodyHtml, cssText = "", zoom = 1, ratio, onRatioChange,
  index: controlledIndex, onIndexChange, editable = false, onSlideOp,
}) {
  const slides = model?.slides || [];
  const theme = model?.theme;
  const [innerIndex, setInnerIndex] = useState(0);
  const [newSlideType, setNewSlideType] = useState("content");
  const stageRef = useRef(null);
  const stageWidth = useContainerWidth(stageRef);
  const index = controlledIndex ?? innerIndex;
  const setIndex = onIndexChange ?? setInnerIndex;
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, slides.length - 1));
  const slide = slides[safeIndex];

  // Chế độ HTML: không có model slide (bodyHtml được truyền) → tài liệu cuộn.
  if (!model) {
    const srcDoc = buildSlidesScrollSrcDoc({ bodyHtml: bodyHtml || "", cssText });
    return (
      <div className="h-full flex flex-col">
        <p className="px-4 py-2 text-xs font-body text-ink/60 bg-paper2 border-b border-ink/10">
          Chế độ HTML: xem trước dạng tài liệu cuộn. Xem theo từng slide và thao tác slide
          bằng nút (thêm/nhân bản/xoá/sắp xếp) áp dụng ở chế độ JSON.
        </p>
        <div className="flex-1 overflow-auto bg-[#ece7db] p-4">
          <SandboxFrame srcDoc={srcDoc} width={920} minHeight={560} zoom={zoom} />
        </div>
      </div>
    );
  }

  // Tự vừa khung: thu nhỏ slide 920px cho vừa bề rộng khung xem trước,
  // zoom thủ công của giáo viên nhân thêm trên mức tự vừa này.
  const fit = fitScale(stageWidth, SLIDE_W);
  const effZoom = zoom * fit;
  const stageH = SLIDE_W * (ratio === "4:3" ? 3 / 4 : 9 / 16);
  const thumbScale = 168 / SLIDE_W;

  return (
    <div className="h-full flex flex-col bg-[#ece7db]">
      <div ref={stageRef} className="flex-1 overflow-auto p-4">
        <div className="mx-auto" style={{ width: Math.round(SLIDE_W * effZoom), height: Math.round(stageH * effZoom) }}>
          <div style={{ transform: `scale(${effZoom})`, transformOrigin: "top left", width: SLIDE_W }}>
            <SlideView slide={slide} ratio={ratio} theme={theme} />
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 bg-paper2 px-3 py-2 flex flex-col gap-2">
        {editable && (
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Thao tác slide">
            <span className="font-body text-xs font-semibold text-ink/60 mr-0.5">Slide hiện tại:</span>
            <select value={newSlideType} onChange={(e) => setNewSlideType(e.target.value)}
              className="note-card px-2 py-1.5 text-xs border-ink/10 bg-white font-body" aria-label="Loại slide mới">
              {SLIDE_TYPE_OPTIONS.map((o) => <option key={o.type} value={o.type}>{o.label}</option>)}
            </select>
            <button type="button" className={opBtn} onClick={() => onSlideOp?.("add", newSlideType)}>
              <Plus className="w-3.5 h-3.5" /> Thêm slide
            </button>
            <button type="button" className={opBtn} disabled={!slides.length}
              onClick={() => onSlideOp?.("duplicate")} title="Nhân bản slide hiện tại">
              <Copy className="w-3.5 h-3.5" /> Nhân bản
            </button>
            <button type="button" className={opBtn} disabled={safeIndex <= 0}
              onClick={() => onSlideOp?.("move", -1)} title="Di chuyển slide lên trước">
              <ArrowUp className="w-3.5 h-3.5" /> Lên
            </button>
            <button type="button" className={opBtn} disabled={safeIndex >= slides.length - 1}
              onClick={() => onSlideOp?.("move", 1)} title="Di chuyển slide xuống sau">
              <ArrowDown className="w-3.5 h-3.5" /> Xuống
            </button>
            <button type="button" className={`${opBtn} text-red-700 border-red-200 hover:bg-red-50 disabled:hover:bg-white`}
              disabled={slides.length <= 1} onClick={() => onSlideOp?.("delete")}
              title={slides.length <= 1 ? "Không xoá được slide cuối cùng" : "Xoá slide hiện tại"}>
              <Trash2 className="w-3.5 h-3.5" /> Xoá slide
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Slide trước" disabled={safeIndex <= 0}
            onClick={() => setIndex(Math.max(0, safeIndex - 1))}
            className="p-1.5 rounded-full hover:bg-ink/5 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-body text-sm text-ink/70 whitespace-nowrap">
            {slides.length ? `Slide ${safeIndex + 1} / ${slides.length}` : "0 slide"}
          </span>
          <button type="button" aria-label="Slide sau" disabled={safeIndex >= slides.length - 1}
            onClick={() => setIndex(Math.min(slides.length - 1, safeIndex + 1))}
            className="p-1.5 rounded-full hover:bg-ink/5 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
          <div className="flex gap-2 overflow-x-auto py-1 flex-1">
            {slides.map((s, i) => (
              <button key={i} type="button" onClick={() => setIndex(i)} title={`Slide ${i + 1}: ${s.title || s.type}`}
                className={`relative shrink-0 overflow-hidden rounded ${i === safeIndex ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                style={{
                  width: 168, height: Math.round(168 * (ratio === "4:3" ? 3 / 4 : 9 / 16)),
                  boxShadow: i === safeIndex ? `0 0 0 2px ${theme?.accent || "#2563eb"}` : "0 0 0 2px transparent",
                }}>
                <div style={{ transform: `scale(${thumbScale})`, transformOrigin: "top left", width: SLIDE_W, pointerEvents: "none" }}>
                  <SlideView slide={s} ratio={ratio} theme={theme} />
                </div>
              </button>
            ))}
          </div>
          <select value={ratio} onChange={(e) => onRatioChange?.(e.target.value)}
            className="note-card px-2 py-1.5 text-sm border-ink/10 bg-white font-body" aria-label="Tỷ lệ slide">
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
          </select>
        </div>
      </div>
    </div>
  );
}
