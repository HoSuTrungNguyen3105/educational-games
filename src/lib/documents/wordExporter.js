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
import { cmToTwips, pageDimensions, pageMarginsCm } from "./pageConfig.js";
import { normalizedColPercents } from "./modelRender.js";

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

// Căn đều hai bên trong docx v9 là AlignmentType.BOTH ("both") —
// AlignmentType.JUSTIFY không tồn tại (undefined) nên trước đây mọi
// khối đặt căn đều đều xuất DOCX mà mất căn lề.
const alignOf = (D, a) => ({ left: D.AlignmentType.LEFT, center: D.AlignmentType.CENTER, right: D.AlignmentType.RIGHT, justify: D.AlignmentType.BOTH }[a]);

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

// fallback = { sizeHp, colorHex }: cỡ/màu MẶC ĐỊNH cho thân văn bản
// (từ cấu hình trang khi áp dụng được) — chỉ dùng khi run/khối không
// tự đặt cỡ/màu riêng. Không truyền fallback thì hành vi như cũ.
function runsOf(D, block, fallbackFont = "Arial", fallback = {}) {
  const runs = Array.isArray(block.runs) && block.runs.length
    ? block.runs
    : [{ text: block.text || "", bold: false, italic: false, underline: false }];
  const blockColor = cssColorToHex(block.color);
  const font = block.font || fallbackFont;
  // fontSize cấp khối (đơn vị pt → docx dùng half-point: nhân 2)
  const blockSizeHp = block.fontSize ? Math.round(Number(block.fontSize) * 2) : fallback.sizeHp;
  return runs.map((r) => {
    const color = cssColorToHex(r.color) || blockColor || fallback.colorHex;
    return new D.TextRun({
      text: r.text,
      font,
      bold: !!r.bold,
      italics: !!r.italic,
      ...(r.underline ? { underline: { type: D.UnderlineType.SINGLE } } : {}),
      ...(r.strike ? { strike: true } : {}),
      ...(color ? { color } : {}),
      ...highlightPropsOf(D, r.highlight),
      ...(blockSizeHp ? { size: blockSizeHp } : {}),
    });
  });
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

// Ngữ cảnh cấu hình trang khi xuất: `pageApplies` = có cấu hình trang
// VÀ tài liệu không có theme (mẫu có theme giữ chữ riêng, cấu hình
// trang chỉ quyết định khổ giấy/lề — xem pageConfig.js). Mọi giá trị
// mặc định dưới đây đều rơi về ĐÚNG hành vi cũ khi tài liệu không có
// `page` và khối không có lineHeight/spacingAfter riêng.
function pageCtxOf(model) {
  const page = model?.page || null;
  const hasTheme = Boolean(model?.theme && Object.keys(model.theme).length);
  const dims = pageDimensions(page, "twips");
  const margins = pageMarginsCm(page);
  return {
    page,
    hasTheme,
    pageApplies: Boolean(page) && !hasTheme,
    dims,
    marginTwips: {
      top: page ? cmToTwips(margins.top) : 1440,
      right: page ? cmToTwips(margins.right) : 1440,
      bottom: page ? cmToTwips(margins.bottom) : 1440,
      left: page ? cmToTwips(margins.left) : 1440,
    },
  };
}

async function blocksToDocxChildren(D, model, warnings) {
  const children = [];
  const t = themeOf(model);
  const ctx = pageCtxOf(model);
  const accent = cssColorToHex(t.accent);
  const headColor = cssColorToHex(t.accent);
  const headerFill = cssColorToHex(t.soft) || "EFEAE0";
  // Giãn dòng (hệ số → đơn vị 1/240 dòng của DOCX) + khoảng sau đoạn
  // (pt → twips: 1pt = 20 twips; mặc định cũ 120 twips = 6pt).
  const lineOf = (block) => {
    const lh = block.lineHeight ?? (ctx.pageApplies ? ctx.page?.lineHeight : undefined);
    return lh ? Math.round(Number(lh) * 240) : undefined;
  };
  const afterOf = (block, fallbackTwips) => {
    if (block.spacingAfter !== undefined && block.spacingAfter !== null) return Math.round(Number(block.spacingAfter) * 20);
    if (ctx.pageApplies && ctx.page?.spacingAfter !== undefined) return Math.round(Number(ctx.page.spacingAfter) * 20);
    return fallbackTwips;
  };
  const bodyAlignOf = (block) => alignOf(D, block.align)
    ?? (ctx.pageApplies ? alignOf(D, ctx.page?.align) : undefined);
  // Font/cỡ/màu mặc định cho THÂN văn bản (đoạn, mục danh sách, ô
  // bảng, chữ ký): thư viện docx luôn đóng font lên từng run nên cấu
  // hình trang phải đi qua fallback này mới tới được file DOCX (styles
  // mặc định của Document bị run tường minh ghi đè). Không có page →
  // font theme như cũ, không cỡ/màu mặc định.
  const bodyFallback = ctx.pageApplies
    ? {
      font: ctx.page.font || t.font,
      sizeHp: ctx.page.fontSize ? Math.round(Number(ctx.page.fontSize) * 2) : undefined,
      colorHex: cssColorToHex(ctx.page.color),
    }
    : { font: t.font, sizeHp: undefined, colorHex: undefined };
  const bodyRunProps = (extra = {}) => ({
    font: bodyFallback.font,
    ...(bodyFallback.sizeHp ? { size: bodyFallback.sizeHp } : {}),
    ...(bodyFallback.colorHex ? { color: bodyFallback.colorHex } : {}),
    ...extra,
  });
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
          spacing: { before: 200, after: 120, ...(lineOf(block) ? { line: lineOf(block) } : {}) },
        }));
        break;
      }
      case "paragraph":
        children.push(new D.Paragraph({
          alignment: bodyAlignOf(block),
          children: runsOf(D, block, bodyFallback.font, bodyFallback),
          spacing: { after: afterOf(block, 120), ...(lineOf(block) ? { line: lineOf(block) } : {}) },
        }));
        break;
      case "list":
        for (const item of block.items || []) {
          children.push(new D.Paragraph({
            children: [new D.TextRun({ text: item, ...bodyRunProps() })],
            alignment: bodyAlignOf(block),
            ...(block.ordered
              ? { numbering: { reference: NUMBERING_REF, level: 0 } }
              : { bullet: { level: 0 } }),
            spacing: { after: afterOf(block, 60), ...(lineOf(block) ? { line: lineOf(block) } : {}) },
          }));
        }
        break;
      case "table": {
        const rows = (block.rows || []).map((row, ri) => new D.TableRow({
          // Hàng đầu là hàng tiêu đề: Word tự lặp lại khi bảng sang trang.
          ...(ri === 0 ? { tableHeader: true } : {}),
          children: row.map((cell) => new D.TableCell({
            ...(ri === 0 ? { shading: { fill: headerFill } } : {}),
            children: [new D.Paragraph({
              children: [new D.TextRun({
                text: cell, ...bodyRunProps({ bold: ri === 0 }),
                ...(ri === 0 && accent ? { color: accent } : {}),
              })],
            })],
          })),
        }));
        if (rows.length) {
          const colCount = Math.max(0, ...(block.rows || []).map((r) => r.length));
          const percents = normalizedColPercents(block.colWidths, colCount);
          const hasWidths = Array.isArray(block.colWidths) && percents.length === colCount && colCount > 0;
          if (hasWidths) {
            // Bề rộng cột theo % của vùng nội dung (khổ giấy trừ lề).
            const contentTwips = ctx.dims.width - ctx.marginTwips.left - ctx.marginTwips.right;
            children.push(new D.Table({
              rows,
              width: { size: contentTwips, type: D.WidthType.DXA },
              columnWidths: percents.map((p) => Math.round((p / 100) * contentTwips)),
            }));
          } else {
            children.push(new D.Table({ rows, width: { size: 100, type: D.WidthType.PERCENTAGE } }));
          }
          children.push(new D.Paragraph({ children: [], spacing: { after: 120 } }));
        }
        break;
      }
      case "image":
        children.push(await imageParagraph(D, block, warnings));
        break;
      case "pageBreak":
        children.push(new D.Paragraph({ children: [new D.PageBreak()] }));
        break;
      case "signature": {
        const sigFont = ctx.pageApplies && ctx.page?.font ? ctx.page.font : t.font;
        if (block.role) {
          children.push(new D.Paragraph({
            alignment: D.AlignmentType.RIGHT,
            children: [new D.TextRun({ text: block.role, font: sigFont, ...(bodyFallback.sizeHp ? { size: bodyFallback.sizeHp } : {}) })],
            spacing: { after: 0 },
          }));
        }
        children.push(new D.Paragraph({
          alignment: D.AlignmentType.RIGHT,
          children: [new D.TextRun({ text: "(Ký và ghi rõ họ tên)", font: sigFont, italics: true, ...(bodyFallback.sizeHp ? { size: bodyFallback.sizeHp } : {}) })],
          spacing: { after: 0 },
        }));
        // Khoảng trống để ký tay.
        children.push(new D.Paragraph({ children: [], spacing: { after: 0 } }));
        children.push(new D.Paragraph({ children: [], spacing: { after: 0 } }));
        children.push(new D.Paragraph({ children: [], spacing: { after: 0 } }));
        if (block.name) {
          children.push(new D.Paragraph({
            alignment: D.AlignmentType.RIGHT,
            children: [new D.TextRun({ text: block.name, font: sigFont, bold: true, ...(bodyFallback.sizeHp ? { size: bodyFallback.sizeHp } : {}) })],
          }));
        }
        break;
      }
      default:
        if (block.text) children.push(new D.Paragraph({ children: [new D.TextRun({ text: block.text, ...bodyRunProps() })] }));
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
  const ctx = pageCtxOf(model);
  const children = await blocksToDocxChildren(D, model, warnings);
  const headColor = cssColorToHex(theme.accent);
  const headRun = { font: theme.displayFont, ...(headColor ? { color: headColor } : {}) };
  // Font/cỡ/màu mặc định của văn bản: cấu hình trang chỉ áp khi tài
  // liệu không có theme; không có cấu hình trang → Arial 12pt như cũ.
  const defaultRun = ctx.pageApplies
    ? {
      font: ctx.page.font || theme.font,
      size: ctx.page.fontSize ? Math.round(Number(ctx.page.fontSize) * 2) : 24,
      ...(cssColorToHex(ctx.page.color) ? { color: cssColorToHex(ctx.page.color) } : {}),
    }
    : { font: theme.font, size: 24 }; // 12pt
  const doc = new D.Document({
    styles: {
      default: {
        document: { run: defaultRun },
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
          size: { width: ctx.dims.width, height: ctx.dims.height },
          margin: ctx.marginTwips,
        },
      },
      // Số trang ở chân trang bằng field PAGE thật của Word (tự tăng
      // theo từng trang khi mở/in) — chỉ khi cấu hình trang bật.
      ...(ctx.page?.pageNumber ? {
        footers: {
          default: new D.Footer({
            children: [new D.Paragraph({
              alignment: D.AlignmentType.CENTER,
              children: [new D.TextRun({ children: [D.PageNumber.CURRENT] })],
            })],
          }),
        },
      } : {}),
      children,
    }],
  });
  const blob = await D.Packer.toBlob(doc);
  const fileName = docxFileName(docName || model.title);
  downloadBlob(blob, fileName);
  return { warnings, fileName };
}
