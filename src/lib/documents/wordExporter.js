// wordExporter.js — Xuất tài liệu Word (.docx) THẬT bằng thư viện `docx`
// (định dạng OOXML chuẩn, mở/chỉnh sửa được trong Microsoft Word).
//
// Nguồn xuất là MÔ HÌNH TRUNG GIAN (model.js) nên cả hai chế độ HTML và
// JSON đều xuất qua cùng một đường. Mức độ giữ định dạng (trung thực):
//   • Giữ: heading đúng cấp, đoạn văn, danh sách có/không thứ tự, bảng,
//     hình ảnh, đậm/nghiêng/gạch chân/gạch ngang trong runs, màu chữ
//     (cấp run, fallback màu cấp khối), màu tô sáng (ánh xạ sang màu
//     highlight chuẩn của Word khi gần khớp, không thì dùng shading
//     giữ đúng mã màu), font chữ cấp khối, căn lề, khổ A4.
//   • Không giữ (có cảnh báo từ htmlParser khi ở chế độ HTML): CSS bố cục
//     (position/float/flex/grid/animation...) — Word không có khái niệm
//     tương đương trực tiếp.
// TUYỆT ĐỐI không đổi đuôi file HTML/JSON thành .docx.
// Thư viện `docx` khá nặng nên được nạp ĐỘNG (dynamic import) ngay trong
// exportWordDocx — bundle chỉ tải khi giáo viên thật sự bấm "Xuất Word",
// trang soạn thảo không phải gánh thêm. Các helper nhận module qua
// tham số `D` (chính là module docx đã nạp).
// Phần dùng chung với pptxExporter (tên file, tải ảnh, tải xuống) nằm ở
// exportUtils.js — không copy-paste giữa hai exporter.
import { downloadBlob, exportFileName, fitSize, loadImage } from "./exportUtils.js";

const NAMED_COLORS = {
  black: "000000", white: "FFFFFF", red: "FF0000", green: "008000",
  blue: "0000FF", gray: "808080", grey: "808080", orange: "FFA500",
  purple: "800080", pink: "FFC0CB", brown: "A52A2A", yellow: "FFFF00",
};

/** Màu CSS (#rgb/#rrggbb/rgb()/tên cơ bản) → hex "RRGGBB" cho docx. */
export function cssColorToHex(color) {
  if (!color) return undefined;
  const c = String(color).trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(c)) return c.slice(1).toUpperCase();
  if (/^#[0-9a-f]{3}$/.test(c)) return c.slice(1).split("").map((x) => x + x).join("").toUpperCase();
  const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
  if (rgb) return [rgb[1], rgb[2], rgb[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("").toUpperCase();
  return NAMED_COLORS[c];
}

const alignOf = (D, a) => ({ left: D.AlignmentType.LEFT, center: D.AlignmentType.CENTER, right: D.AlignmentType.RIGHT, justify: D.AlignmentType.JUSTIFY }[a]);

// Bảng màu highlight CHUẨN của Word (w:highlight chỉ nhận các màu này,
// đều là màu bão hoà). Màu tô của giáo viên TRÙNG gần như tuyệt đối một
// màu chuẩn (khoảng cách RGB ≤ 40 — vd vàng #FFFF00 mặc định của thanh
// công cụ) thì dùng highlight thật; các màu pastel/lệch chuẩn dùng
// shading fill để giữ ĐÚNG mã màu đã chọn thay vì ép sang màu khác
// (ngưỡng lỏng sẽ biến màu bạc hà thành "trắng" vô hình).
const HIGHLIGHT_ENUM = [
  ["yellow", "FFFF00"], ["green", "00FF00"], ["cyan", "00FFFF"],
  ["magenta", "FF00FF"], ["blue", "0000FF"], ["red", "FF0000"],
  ["darkBlue", "000080"], ["darkCyan", "008080"], ["darkGray", "808080"],
  ["darkGreen", "008000"], ["darkMagenta", "800080"], ["darkRed", "800000"],
  ["darkYellow", "808000"], ["lightGray", "C0C0C0"], ["black", "000000"],
  ["white", "FFFFFF"],
];
const HIGHLIGHT_MAX_DIST = 40;

function nearestHighlightName(hex) {
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  let best = null;
  let bestDist = Infinity;
  for (const [name, h] of HIGHLIGHT_ENUM) {
    const o = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    const d = Math.hypot(rgb[0] - o[0], rgb[1] - o[1], rgb[2] - o[2]);
    if (d < bestDist) { bestDist = d; best = name; }
  }
  return bestDist <= HIGHLIGHT_MAX_DIST ? best : null;
}

/** Thuộc tính tô sáng cho TextRun: { highlight } hoặc { shading }. */
function highlightPropsOf(D, color) {
  const hex = cssColorToHex(color);
  if (!hex) return {};
  const name = nearestHighlightName(hex);
  if (name) return { highlight: name };
  return { shading: { type: D.ShadingType.CLEAR, color: "auto", fill: hex } };
}

function runsOf(D, block, fallbackFont = "Arial") {
  const runs = Array.isArray(block.runs) && block.runs.length
    ? block.runs
    : [{ text: block.text || "", bold: false, italic: false, underline: false }];
  const blockColor = cssColorToHex(block.color);
  const font = block.font || fallbackFont;
  return runs.map((r) => new D.TextRun({
    text: r.text,
    font,
    bold: !!r.bold,
    italics: !!r.italic,
    ...(r.underline ? { underline: { type: D.UnderlineType.SINGLE } } : {}),
    ...(r.strike ? { strike: true } : {}),
    ...((cssColorToHex(r.color) || blockColor) ? { color: cssColorToHex(r.color) || blockColor } : {}),
    ...highlightPropsOf(D, r.highlight),
  }));
}

function themeOf(model) {
  const t = model?.theme || {};
  const font = String(t.font || "Arial").replace(/["'<>]/g, "").slice(0, 60) || "Arial";
  const displayFont = String(t.displayFont || t.font || "Arial").replace(/["'<>]/g, "").slice(0, 60) || font;
  return { ...t, font, displayFont };
}

async function imageParagraph(D, block, warnings) {
  const src = String(block.src || "").trim();
  const fallback = () => new D.Paragraph({
    children: [new D.TextRun({ text: `[Hình ảnh${block.alt ? `: ${block.alt}` : ""} — ${src}]`, italics: true })],
  });
  if (!src) { warnings.push("Có khối hình ảnh thiếu đường dẫn — đã thay bằng ghi chú trong file Word."); return fallback(); }
  try {
    const img = await loadImage(src);
    const { width, height } = fitSize(img.width, img.height, 600, 800);
    return new D.Paragraph({
      children: [new D.ImageRun({ data: img.arrayBuffer, transformation: { width, height }, type: img.imageType })],
    });
  } catch {
    warnings.push(`Không tải được hình ảnh "${block.alt || src}" — đã thay bằng ghi chú trong file Word.`);
    return fallback();
  }
}

const NUMBERING_REF = "docstudio-numbering";

async function blocksToDocxChildren(D, model, warnings) {
  const children = [];
  const t = themeOf(model);
  const accent = cssColorToHex(t.accent);
  const headColor = cssColorToHex(t.accent);
  const headerFill = cssColorToHex(t.soft) || "EFEAE0";
  const first = (model.blocks || [])[0];
  if (model.title && !(first?.type === "heading" && first.text === model.title)) {
    children.push(new D.Paragraph({
      heading: D.HeadingLevel.TITLE,
      children: [new D.TextRun({ text: model.title, font: t.displayFont, ...(headColor ? { color: headColor } : {}) })],
      spacing: { after: 240 },
    }));
  }
  for (const block of model.blocks || []) {
    switch (block.type) {
      case "heading": {
        const lv = [1, 2, 3].includes(block.level) ? block.level : 1;
        children.push(new D.Paragraph({
          heading: [D.HeadingLevel.HEADING_1, D.HeadingLevel.HEADING_2, D.HeadingLevel.HEADING_3][lv - 1],
          alignment: alignOf(D, block.align),
          children: runsOf(D, block, t.displayFont),
          spacing: { before: 200, after: 120 },
        }));
        break;
      }
      case "paragraph":
        children.push(new D.Paragraph({
          alignment: alignOf(D, block.align),
          children: runsOf(D, block, t.font),
          spacing: { after: 120 },
        }));
        break;
      case "list":
        for (const item of block.items || []) {
          children.push(new D.Paragraph({
            children: [new D.TextRun({ text: item, font: t.font })],
            alignment: alignOf(D, block.align),
            ...(block.ordered
              ? { numbering: { reference: NUMBERING_REF, level: 0 } }
              : { bullet: { level: 0 } }),
            spacing: { after: 60 },
          }));
        }
        break;
      case "table": {
        const rows = (block.rows || []).map((row, ri) => new D.TableRow({
          children: row.map((cell) => new D.TableCell({
            ...(ri === 0 ? { shading: { fill: headerFill } } : {}),
            children: [new D.Paragraph({
              children: [new D.TextRun({
                text: cell, font: t.font, bold: ri === 0,
                ...(ri === 0 && accent ? { color: accent } : {}),
              })],
            })],
          })),
        }));
        if (rows.length) {
          children.push(new D.Table({ rows, width: { size: 100, type: D.WidthType.PERCENTAGE } }));
          children.push(new D.Paragraph({ children: [], spacing: { after: 120 } }));
        }
        break;
      }
      case "image":
        children.push(await imageParagraph(D, block, warnings));
        break;
      default:
        if (block.text) children.push(new D.Paragraph({ children: [new D.TextRun({ text: block.text, font: t.font })] }));
    }
  }
  return children;
}

/** Tên file an toàn từ tên tài liệu. */
export function docxFileName(name) {
  return exportFileName(name, "docx");
}

/**
 * Xuất model Word → tải file .docx. Trả { warnings, fileName }.
 * Ném lỗi nếu thư viện xuất thất bại — UI giữ nguyên nội dung đang soạn.
 */
export async function exportWordDocx(model, docName) {
  const D = await import("docx");
  const warnings = [];
  const theme = themeOf(model);
  const children = await blocksToDocxChildren(D, model, warnings);
  const headColor = cssColorToHex(theme.accent);
  const headRun = { font: theme.displayFont, ...(headColor ? { color: headColor } : {}) };
  const doc = new D.Document({
    styles: {
      default: {
        document: { run: { font: theme.font, size: 24 } }, // 12pt
        title: { run: { ...headRun, size: 34, bold: true } },
        heading1: { run: { ...headRun, size: 30, bold: true } },
        heading2: { run: { ...headRun, size: 26, bold: true } },
        heading3: { run: { ...headRun, size: 24, bold: true } },
      },
    },
    numbering: {
      config: [{
        reference: NUMBERING_REF,
        levels: [{ level: 0, format: "decimal", text: "%1.", alignment: D.AlignmentType.LEFT }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4 (twips)
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      children,
    }],
  });
  const blob = await D.Packer.toBlob(doc);
  const fileName = docxFileName(docName || model.title);
  downloadBlob(blob, fileName);
  return { warnings, fileName };
}
