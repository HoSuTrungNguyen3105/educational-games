// pptxExporter.js — Xuất bài PowerPoint (.pptx) THẬT bằng `pptxgenjs`
// (Đợt 2 Teacher Document Studio). Mỗi slide trong MÔ HÌNH TRUNG GIAN
// thành một slide PowerPoint thật: chữ là TEXT FRAME sửa được trong
// PowerPoint, bảng là bảng thật, ảnh nhúng thật — TUYỆT ĐỐI không xuất
// slide thành hình ảnh, không đổi đuôi file.
//
// Nguồn là model nên cả hai chế độ đều xuất qua cùng một đường: JSON →
// model trực tiếp; HTML → htmlParser chia theo <section>/class "slide"
// (cảnh báo phân loại tự động của parser được UI cộng vào báo cáo xuất).
//
// Mức độ giữ định dạng (trung thực): tông màu/font bám preview — tiêu đề
// xanh #2563eb, chữ chính #1f2937, nền slide tổng kết #fffbeb, font
// Arial (như bản HTML chuyển đổi + bản xuất Word đợt 1). Bố cục là bố
// cục hộp chữ cố định theo loại slide, KHÔNG bê nguyên CSS của giáo
// viên sang (PowerPoint không có khái niệm tương đương — CSS không hỗ
// trợ đã được htmlParser cảnh báo từ bước Áp dụng).
// Thư viện được nạp ĐỘNG trong exportPresentationPptx — chỉ tải khi
// giáo viên bấm "Xuất PowerPoint", giống cách đợt 1 nạp `docx`.
// Helper dùng chung (tên file/tải ảnh/tải xuống) ở exportUtils.js.
import { downloadBlob, exportFileName, loadImage } from "./exportUtils.js";

const FONT = "Arial";
const BLUE = "2563EB";
const INK = "1F2937";
const SUBTLE = "6B7280";
const SUMMARY_BG = "FFFBEB";
const TABLE_HEADER_FILL = "EFEAE0";
const TABLE_BORDER = "9CA3AF";

const MARGIN = 0.6; // inch
const titleBox = (W) => ({ x: MARGIN, y: 0.32, w: W - MARGIN * 2, h: 0.85 });
const bodyBox = (W, H) => ({ x: MARGIN, y: 1.3, w: W - MARGIN * 2, h: H - 1.75 });

function bulletsOf(items) {
  return (items || []).map((text, i, arr) => ({
    text: String(text ?? ""),
    options: { bullet: true, breakLine: i < arr.length - 1, fontSize: 20, color: INK, paraSpaceAfter: 8 },
  }));
}

function addTitle(slide, title, W) {
  if (!title) return;
  slide.addText(title, { ...titleBox(W), fontFace: FONT, fontSize: 30, bold: true, color: BLUE, valign: "middle" });
}

function addBullets(slide, items, box) {
  const runs = bulletsOf(items);
  if (!runs.length) return;
  slide.addText(runs, { ...box, fontFace: FONT, valign: "top", lineSpacingMultiple: 1.15 });
}

async function buildSlide(pptx, model, s, i, dims, warnings) {
  const { W, H } = dims;
  const slide = pptx.addSlide();
  const label = `Slide ${i + 1}${s.title ? ` "${s.title}"` : ""}`;
  switch (s.type) {
    case "title": {
      const meta = [model.subject, model.grade ? `Lớp ${model.grade}` : ""].filter(Boolean).join(" • ");
      slide.addText(s.title || model.title || "", {
        x: MARGIN, y: H / 2 - 1.5, w: W - MARGIN * 2, h: 1.6,
        fontFace: FONT, fontSize: 44, bold: true, color: BLUE, align: "center", valign: "middle",
      });
      const under = [s.subtitle, meta].filter(Boolean);
      under.forEach((line, li) => {
        slide.addText(line, {
          x: MARGIN, y: H / 2 + 0.25 + li * 0.55, w: W - MARGIN * 2, h: 0.5,
          fontFace: FONT, fontSize: li === 0 ? 22 : 16, color: li === 0 ? SUBTLE : INK, align: "center",
        });
      });
      break;
    }
    case "content":
    case "summary": {
      if (s.type === "summary") slide.background = { color: SUMMARY_BG };
      addTitle(slide, s.title, W);
      if ((s.content || []).length) addBullets(slide, s.content, bodyBox(W, H));
      else warnings.push(`${label}: chưa có nội dung gạch đầu dòng — slide xuất ra chỉ có tiêu đề.`);
      break;
    }
    case "two-column": {
      addTitle(slide, s.title, W);
      const gap = 0.5;
      const colW = (W - MARGIN * 2 - gap) / 2;
      const box = bodyBox(W, H);
      addBullets(slide, s.left, { ...box, w: colW });
      addBullets(slide, s.right, { ...box, x: MARGIN + colW + gap, w: colW });
      if (!(s.left || []).length && !(s.right || []).length) {
        warnings.push(`${label}: cả hai cột đều trống — slide xuất ra chỉ có tiêu đề.`);
      }
      break;
    }
    case "table": {
      addTitle(slide, s.title, W);
      const rows = (s.rows || []).filter((r) => Array.isArray(r) && r.length);
      if (!rows.length) { warnings.push(`${label}: bảng chưa có hàng nào — slide xuất ra chỉ có tiêu đề.`); break; }
      const cols = Math.max(...rows.map((r) => r.length));
      const colW = Array.from({ length: cols }, () => (W - MARGIN * 2) / cols);
      const tableData = rows.map((row, ri) => Array.from({ length: cols }, (_, ci) => ({
        text: String(row[ci] ?? ""),
        options: ri === 0 ? { bold: true, fill: { color: TABLE_HEADER_FILL } } : {},
      })));
      slide.addTable(tableData, {
        x: MARGIN, y: 1.3, w: W - MARGIN * 2, colW,
        fontFace: FONT, fontSize: 16, color: INK,
        border: { pt: 0.75, color: TABLE_BORDER },
        valign: "middle", rowH: 0.45,
      });
      break;
    }
    case "image": {
      addTitle(slide, s.title, W);
      const imgBox = { x: MARGIN, y: 1.25, w: W - MARGIN * 2, h: H - (s.caption ? 2.15 : 1.7) };
      const src = String(s.src || "").trim();
      const note = `[Hình ảnh${s.alt ? `: ${s.alt}` : ""}${src ? ` — ${src}` : " — chưa có đường dẫn"}]`;
      if (!src) {
        warnings.push(`${label}: slide hình ảnh chưa có đường dẫn (src) — đã thay bằng khung ghi chú trong file PowerPoint.`);
        slide.addText(note, { ...imgBox, fontFace: FONT, fontSize: 14, italic: true, color: SUBTLE, align: "center", valign: "middle", line: { color: TABLE_BORDER, width: 1, dashType: "dash" } });
      } else {
        try {
          const img = await loadImage(src);
          slide.addImage({ data: img.dataUrl, ...imgBox, sizing: { type: "contain", w: imgBox.w, h: imgBox.h } });
        } catch {
          warnings.push(`Không tải được hình ảnh ở ${label} — đã thay bằng khung ghi chú trong file PowerPoint.`);
          slide.addText(note, { ...imgBox, fontFace: FONT, fontSize: 14, italic: true, color: SUBTLE, align: "center", valign: "middle", line: { color: TABLE_BORDER, width: 1, dashType: "dash" } });
        }
      }
      if (s.caption) {
        slide.addText(s.caption, {
          x: MARGIN, y: H - 0.75, w: W - MARGIN * 2, h: 0.45,
          fontFace: FONT, fontSize: 14, color: SUBTLE, align: "center",
        });
      }
      break;
    }
    default: {
      warnings.push(`${label}: loại slide "${s.type}" chưa hỗ trợ xuất — đã xuất tạm dạng nội dung.`);
      addTitle(slide, s.title, W);
      addBullets(slide, s.content, bodyBox(W, H));
    }
  }
}

/**
 * Xuất model presentation → tải file .pptx. `ratio` ("16:9" | "4:3")
 * lấy theo tỷ lệ đang chọn trong preview. Trả { warnings, fileName }.
 * Ném lỗi nếu thư viện xuất thất bại — UI giữ nguyên nội dung đang soạn.
 */
export async function exportPresentationPptx(model, { docName, ratio = "16:9" } = {}) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const warnings = [];
  const pptx = new PptxGenJS();
  let dims;
  if (ratio === "4:3") {
    pptx.defineLayout({ name: "DOCSTUDIO_4X3", width: 10, height: 7.5 });
    pptx.layout = "DOCSTUDIO_4X3";
    dims = { W: 10, H: 7.5 };
  } else {
    pptx.layout = "LAYOUT_WIDE";
    dims = { W: 13.333, H: 7.5 };
  }
  pptx.title = model.title || docName || "Bài trình chiếu";
  pptx.author = "EduPlay — Teacher Document Studio";

  const slides = model.slides || [];
  if (!slides.length) {
    warnings.push("Bài chưa có slide nào — file xuất ra chỉ gồm một slide tiêu đề từ tên bài.");
    await buildSlide(pptx, model, { type: "title", title: model.title || docName || "Bài trình chiếu", subtitle: "" }, 0, dims, warnings);
  } else {
    for (let i = 0; i < slides.length; i++) {
      await buildSlide(pptx, model, slides[i], i, dims, warnings);
    }
  }

  const blob = await pptx.write({ outputType: "blob" });
  const fileName = exportFileName(docName || model.title, "pptx");
  downloadBlob(blob, fileName);
  return { warnings, fileName };
}
