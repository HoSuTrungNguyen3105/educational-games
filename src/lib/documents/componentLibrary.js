// componentLibrary.js — Thư viện "Thành phần" chọn nhanh của Teacher
// Document Studio (gộp ba mục rail cũ Bảng biểu / Danh sách / Trích dẫn
// thành một thư viện thống nhất, thêm nhóm Bổ sung).
//
// Mỗi mẫu có tối đa ba "builder" theo đúng ba đường chèn mà editor đã có
// từ trước (KHÔNG thêm đường chèn mới):
//   • html()  → chuỗi HTML chèn tại con trỏ ở chế độ Beautiful (HTML/CSS)
//               — dùng lại đúng markup của các handler chèn cũ.
//   • word()  → mảng khối JSON Word (chế độ Normal, tài liệu Word) — chỉ
//               dùng các loại khối mà model.js giữ lại được: heading /
//               paragraph (text + color + align) / list / table. Khung
//               màu (ghi chú, lưu ý…) ở chế độ này được biểu diễn bằng
//               đoạn văn có nhãn đậm đầu dòng + màu chữ, vì model Word
//               không có khái niệm nền/viền cho khối — bản DOCX giữ được
//               màu chữ, không vỡ bố cục.
//   • ppt()   → một slide JSON PowerPoint (chế độ Normal, tài liệu
//               PowerPoint) theo đúng ánh xạ của handler cũ: bảng →
//               slide "table", danh sách/trích dẫn → slide "content",
//               tiêu đề → slide "title". Mẫu nào không có ánh xạ hợp lệ
//               thì để ppt = null (không khả dụng ở ngữ cảnh đó).
//
// Nội dung mẫu viết sẵn cho giáo dục tiểu học (phiếu bài tập, giáo án),
// chèn xong giáo viên sửa lại như nội dung thường.
import {
  BookOpen, CalendarDays, ClipboardList, Gauge, Heading1,
  HelpCircle, Info, Lightbulb, List, ListChecks, ListOrdered, Minus,
  PenLine, Pilcrow, Quote, SquareCheckBig, Star, StickyNote, Table2,
  TableProperties, TriangleAlert, UserRound,
} from "lucide-react";

const escHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const DOTS = "…………………………………………";

/** HTML bảng — markup y hệt handler "Chèn bảng" cũ (hàng đầu là tiêu đề). */
export function tableHtmlFromRows(rows) {
  return [
    '<table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%">',
    ...rows.map((row, ri) => `  <tr>${row.map((cell) => (
      ri === 0 ? `<th>${escHtml(cell)}</th>` : `<td>${escHtml(cell)}</td>`
    )).join("")}</tr>`),
    "</table>",
  ].join("\n");
}

/** HTML danh sách — markup y hệt handler "Chèn danh sách" cũ. */
export function listHtmlFromItems(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>\n${items.map((item) => `  <li>${escHtml(item)}</li>`).join("\n")}\n</${tag}>`;
}

/** HTML danh sách không dấu đầu dòng mặc định (checkbox / gạch ngang tự mang ký hiệu). */
function plainListHtmlFromItems(items) {
  return `<ul style="list-style:none;padding-left:6px">\n${items.map((item) => `  <li>${escHtml(item)}</li>`).join("\n")}\n</ul>`;
}

/** HTML trích dẫn — markup y hệt handler "Chèn trích dẫn" cũ. */
export function quoteHtmlFromText(text) {
  return `<blockquote style="margin:16px 0;padding:8px 16px;border-left:4px solid #cbd5e1;color:#475569;font-style:italic">${escHtml(text).replace(/\n/g, "<br>")}</blockquote>`;
}

/** HTML khung màu (ghi chú / lưu ý / kiến thức / ví dụ). */
function frameHtmlFromParts(label, text, { bg, border, labelColor }) {
  return `<div style="background:${bg};border:1px solid ${border};border-radius:8px;padding:10px 14px;margin:12px 0"><strong style="color:${labelColor}">${escHtml(label)}:</strong> ${escHtml(text)}</div>`;
}

export const COMPONENT_GROUPS = [
  { id: "table", label: "Bảng biểu" },
  { id: "list", label: "Danh sách" },
  { id: "quote", label: "Trích dẫn" },
  { id: "extra", label: "Bổ sung" },
];

const tableComponent = ({ id, name, icon, keywords, title, rows, previewCols }) => ({
  id, group: "table", name, icon, keywords,
  preview: { kind: "table", cols: previewCols || rows[0].length, rows: Math.min(rows.length, 4) },
  html: () => tableHtmlFromRows(rows),
  word: () => [{ type: "table", rows }],
  ppt: () => ({ type: "table", title, rows }),
});

const listComponent = ({ id, name, icon, keywords, title, items, ordered = false, plain = false, marker }) => ({
  id, group: "list", name, icon, keywords,
  preview: { kind: "list", marker, lines: Math.min(items.length, 3) },
  html: () => (plain ? plainListHtmlFromItems(items) : listHtmlFromItems(items, ordered)),
  word: () => [{ type: "list", ordered, items }],
  ppt: () => ({ type: "content", title, content: items }),
});

const frameComponent = ({ id, name, icon, keywords, label, text, tone, bg, border, labelColor, color }) => ({
  id, group: "quote", name, icon, keywords,
  preview: { kind: "frame", tone, label },
  html: () => frameHtmlFromParts(label, text, { bg, border, labelColor }),
  word: () => [{ type: "paragraph", text: `${label}: ${text}`, color }],
  ppt: () => ({ type: "content", title: label, content: [text] }),
});

export const COMPONENTS = [
  // ── Bảng biểu ────────────────────────────────────────────────────────
  tableComponent({
    id: "table-basic", name: "Bảng cơ bản", icon: Table2,
    keywords: "bang co ban ke o cot hang",
    title: "Bảng cơ bản",
    rows: [
      ["STT", "Nội dung", "Kết quả"],
      ["1", "Đọc bài và trả lời câu hỏi", ""],
      ["2", "Làm bài tập trong sách giáo khoa", ""],
      ["3", "Chuẩn bị bài mới", ""],
    ],
  }),
  tableComponent({
    id: "table-titled", name: "Bảng có tiêu đề", icon: TableProperties,
    keywords: "bang co tieu de thead dam nen header",
    title: "Bảng theo dõi đọc sách",
    rows: [
      ["Họ và tên", "Số trang đã đọc", "Nhận xét"],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  }),
  tableComponent({
    id: "table-wide", name: "Bảng nhiều cột", icon: Table2,
    keywords: "bang nhieu cot rong 5 6 cot",
    title: "Bảng tổng hợp kết quả học tập",
    previewCols: 6,
    rows: [
      ["STT", "Họ và tên", "Toán", "Tiếng Việt", "Tiếng Anh", "Nhận xét"],
      ["1", "", "", "", "", ""],
      ["2", "", "", "", "", ""],
      ["3", "", "", "", "", ""],
    ],
  }),
  tableComponent({
    id: "table-rubric", name: "Bảng đánh giá", icon: Gauge,
    keywords: "bang danh gia tieu chi muc do nhan xet rubric",
    title: "Bảng đánh giá",
    rows: [
      ["Tiêu chí", "Mức độ", "Nhận xét"],
      ["Thái độ học tập", "Tốt / Khá / Cần cố gắng", ""],
      ["Mức độ hoàn thành nhiệm vụ", "Tốt / Khá / Cần cố gắng", ""],
      ["Tinh thần hợp tác với bạn", "Tốt / Khá / Cần cố gắng", ""],
    ],
  }),
  tableComponent({
    id: "table-scores", name: "Bảng điểm", icon: Star,
    keywords: "bang diem so diem hoc sinh xep loai",
    title: "Bảng điểm",
    rows: [
      ["STT", "Họ và tên", "Điểm", "Nhận xét"],
      ["1", "", "", ""],
      ["2", "", "", ""],
      ["3", "", "", ""],
    ],
  }),
  tableComponent({
    id: "table-timetable", name: "Bảng thời khóa biểu", icon: CalendarDays,
    keywords: "thoi khoa bieu tkb tiet thu 2 3 4 5 6 lich hoc",
    title: "Thời khóa biểu",
    previewCols: 6,
    rows: [
      ["Tiết", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      ["1", "Chào cờ", "Toán", "Tiếng Việt", "Toán", "Thể dục"],
      ["2", "Toán", "Tiếng Việt", "Toán", "Tiếng Anh", "Tiếng Việt"],
      ["3", "Tiếng Việt", "Mĩ thuật", "Khoa học", "Toán", "Âm nhạc"],
      ["4", "Đạo đức", "Tự nhiên và Xã hội", "Thể dục", "Tiếng Việt", "Sinh hoạt lớp"],
    ],
  }),
  tableComponent({
    id: "table-summary", name: "Bảng tổng hợp", icon: ClipboardList,
    keywords: "bang tong hop thong ke so luong ti le",
    title: "Bảng tổng hợp",
    rows: [
      ["Nội dung", "Số lượng", "Ghi chú"],
      ["Tổng số học sinh", "", ""],
      ["Hoàn thành tốt", "", ""],
      ["Cần hỗ trợ thêm", "", ""],
    ],
  }),

  // ── Danh sách ────────────────────────────────────────────────────────
  listComponent({
    id: "list-numbered", name: "Danh sách đánh số", icon: ListOrdered,
    keywords: "danh sach danh so thu tu 1 2 3 cac buoc huong dan",
    title: "Các bước thực hiện",
    ordered: true, marker: "1.",
    items: [
      "Đọc kĩ yêu cầu của bài tập.",
      "Làm bài theo từng bước đã học.",
      "Kiểm tra lại bài thật cẩn thận trước khi nộp.",
    ],
  }),
  listComponent({
    id: "list-bulleted", name: "Danh sách dấu chấm", icon: List,
    keywords: "danh sach dau cham bullet liet ke",
    title: "Nội quy lớp học",
    marker: "•",
    items: [
      "Chuẩn bị đầy đủ sách vở và đồ dùng học tập.",
      "Ngồi học ngay ngắn, chăm chú lắng nghe thầy cô giảng bài.",
      "Giơ tay khi muốn phát biểu ý kiến.",
    ],
  }),
  listComponent({
    id: "list-checkbox", name: "Danh sách checkbox", icon: SquareCheckBig,
    keywords: "danh sach checkbox o trong tich chon kiem tra",
    title: "Tự kiểm tra",
    plain: true, marker: "☐",
    items: [
      "☐ Em đã đọc lại bài học",
      "☐ Em đã làm xong bài tập",
      "☐ Em đã chuẩn bị bài mới",
    ],
  }),
  listComponent({
    id: "list-tasks", name: "Danh sách công việc", icon: ListChecks,
    keywords: "danh sach cong viec viec can lam buoi hoc to do",
    title: "Công việc trong buổi học",
    plain: true, marker: "☐",
    items: [
      "☐ Điểm danh và ổn định lớp",
      "☐ Kiểm tra bài cũ",
      "☐ Học bài mới",
      "☐ Luyện tập và củng cố",
      "☐ Nhận xét, dặn dò cuối buổi",
    ],
  }),
  listComponent({
    id: "list-questions", name: "Danh sách câu hỏi", icon: HelpCircle,
    keywords: "danh sach cau hoi bai tap tra loi dong cham",
    title: "Câu hỏi luyện tập",
    ordered: true, marker: "1.",
    items: [
      `Câu hỏi 1: Em hãy nêu ý chính của bài học hôm nay. Trả lời: ${DOTS}`,
      `Câu hỏi 2: Em hãy cho một ví dụ trong thực tế liên quan đến bài học. Trả lời: ${DOTS}`,
      `Câu hỏi 3: Em còn thắc mắc điều gì về bài học? Trả lời: ${DOTS}`,
    ],
  }),
  listComponent({
    id: "list-dash", name: "Danh sách gạch đầu dòng", icon: Minus,
    keywords: "danh sach gach dau dong ngang liet ke",
    title: "Việc cần nhớ",
    plain: true, marker: "–",
    items: [
      "– Chuẩn bị: sách giáo khoa và vở ghi chép.",
      "– Trong giờ học: chăm chú lắng nghe, tích cực phát biểu.",
      "– Sau giờ học: ôn lại bài và hoàn thành bài tập.",
    ],
  }),

  // ── Trích dẫn & khung ────────────────────────────────────────────────
  {
    id: "quote-basic", group: "quote", name: "Trích dẫn cơ bản", icon: Quote,
    keywords: "trich dan blockquote cau noi",
    preview: { kind: "quote" },
    html: () => quoteHtmlFromText("Học, học nữa, học mãi."),
    word: () => [{ type: "paragraph", text: "“Học, học nữa, học mãi.”" }],
    ppt: () => ({ type: "content", title: "Trích dẫn", content: ["“Học, học nữa, học mãi.”"] }),
  },
  frameComponent({
    id: "frame-note", name: "Khung ghi chú", icon: StickyNote,
    keywords: "khung ghi chu note nho",
    label: "Ghi chú",
    text: "Nhớ mang theo vở bài tập và đồ dùng học tập cho tiết học sau.",
    tone: "note", bg: "#fefce8", border: "#facc15", labelColor: "#854d0e", color: "#854d0e",
  }),
  frameComponent({
    id: "frame-warning", name: "Khung lưu ý", icon: TriangleAlert,
    keywords: "khung luu y canh bao chu y quan trong",
    label: "Lưu ý",
    text: "Khi làm thí nghiệm, các em cần tuân thủ hướng dẫn của giáo viên và không tự ý chạm vào dụng cụ.",
    tone: "warning", bg: "#fef2f2", border: "#f87171", labelColor: "#b91c1c", color: "#b91c1c",
  }),
  frameComponent({
    id: "frame-key", name: "Khung kiến thức quan trọng", icon: Lightbulb,
    keywords: "khung kien thuc quan trong can nho ghi nho",
    label: "Kiến thức cần nhớ",
    text: "Nước không có hình dạng nhất định, không màu, không mùi, không vị. Nước chảy từ nơi cao xuống nơi thấp và có thể hoà tan một số chất.",
    tone: "key", bg: "#eff6ff", border: "#60a5fa", labelColor: "#1d4ed8", color: "#1d4ed8",
  }),
  frameComponent({
    id: "frame-example", name: "Khung ví dụ minh họa", icon: BookOpen,
    keywords: "khung vi du minh hoa example",
    label: "Ví dụ minh họa",
    text: "Đổ nước vào chiếc chai hình tròn thì nước mang hình của chai; đổ sang chiếc cốc khác, nước lại thay đổi theo hình của cốc.",
    tone: "example", bg: "#ecfdf5", border: "#34d399", labelColor: "#047857", color: "#047857",
  }),

  // ── Thành phần bổ sung ───────────────────────────────────────────────
  {
    id: "extra-title", group: "extra", name: "Tiêu đề + tiêu đề phụ", icon: Heading1,
    keywords: "tieu de phu de muc lon heading",
    preview: { kind: "heading" },
    html: () => [
      '<h1 style="text-align:center">TIÊU ĐỀ BÀI HỌC</h1>',
      '<p style="text-align:center;color:#64748b">Môn học • Lớp • Năm học 2026 – 2027</p>',
    ].join("\n"),
    word: () => [
      { type: "heading", level: 1, text: "TIÊU ĐỀ BÀI HỌC", align: "center" },
      { type: "paragraph", text: "Môn học • Lớp • Năm học 2026 – 2027", align: "center", color: "#64748b" },
    ],
    ppt: () => ({ type: "title", title: "TIÊU ĐỀ BÀI GIẢNG", subtitle: "Môn học • Lớp • Năm học 2026 – 2027" }),
  },
  {
    id: "extra-paragraph", group: "extra", name: "Đoạn văn mẫu", icon: Pilcrow,
    keywords: "doan van mau paragraph van ban mo dau",
    preview: { kind: "paragraph" },
    html: () => "<p>Trong bài học hôm nay, chúng ta sẽ cùng tìm hiểu những kiến thức mới thật thú vị. Các em hãy chú ý lắng nghe, tích cực phát biểu và hợp tác vui vẻ với bạn trong nhóm nhé!</p>",
    word: () => [{ type: "paragraph", text: "Trong bài học hôm nay, chúng ta sẽ cùng tìm hiểu những kiến thức mới thật thú vị. Các em hãy chú ý lắng nghe, tích cực phát biểu và hợp tác vui vẻ với bạn trong nhóm nhé!" }],
    ppt: () => ({ type: "content", title: "Giới thiệu bài học", content: ["Trong bài học hôm nay, chúng ta sẽ cùng tìm hiểu những kiến thức mới thật thú vị. Các em hãy chú ý lắng nghe, tích cực phát biểu và hợp tác vui vẻ với bạn trong nhóm nhé!"] }),
  },
  {
    id: "extra-divider", group: "extra", name: "Đường phân cách", icon: Minus,
    keywords: "duong phan cach ke ngang hr chia phan",
    preview: { kind: "divider" },
    html: () => '<hr style="border:0;border-top:2px solid #cbd5e1;margin:20px 0">',
    word: () => [{ type: "paragraph", text: "• • • • •", align: "center", color: "#94a3b8" }],
    ppt: null,
  },
  {
    id: "extra-info", group: "extra", name: "Khung thông tin", icon: Info,
    keywords: "khung thong tin bai hoc mon lop chu de thoi gian",
    preview: { kind: "info", lines: 3 },
    html: () => [
      '<div style="border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;margin:12px 0">',
      "  <p><strong>Thông tin bài học</strong></p>",
      "  <p>Môn học: …………………… &nbsp; Lớp: …………</p>",
      "  <p>Chủ đề: …………………………………………</p>",
      "  <p>Thời gian: ………… phút</p>",
      "</div>",
    ].join("\n"),
    word: () => [
      { type: "heading", level: 3, text: "Thông tin bài học" },
      { type: "paragraph", text: "Môn học: ……………………    Lớp: ……" },
      { type: "paragraph", text: "Chủ đề: …………………………………………" },
      { type: "paragraph", text: "Thời gian: …… phút" },
    ],
    ppt: () => ({
      type: "content", title: "Thông tin bài học",
      content: ["Môn học: ……………………", "Lớp: ……", "Chủ đề: …………………………………………", "Thời gian: …… phút"],
    }),
  },
  {
    id: "extra-student", group: "extra", name: "Điền thông tin học sinh", icon: UserRound,
    keywords: "dien thong tin hoc sinh ho ten lop ngay thang phieu bai tap",
    preview: { kind: "info", lines: 3 },
    html: () => [
      "<p>Họ và tên: ……………………………………………… &nbsp; Lớp: …………</p>",
      "<p>Ngày …… tháng …… năm ………</p>",
    ].join("\n"),
    word: () => [
      { type: "paragraph", text: "Họ và tên: ………………………………………………    Lớp: ……" },
      { type: "paragraph", text: "Ngày …… tháng …… năm ……" },
    ],
    ppt: () => ({
      type: "content", title: "Thông tin học sinh",
      content: ["Họ và tên: ………………………………………………", "Lớp: ……", "Ngày …… tháng …… năm ……"],
    }),
  },
  {
    id: "extra-answer-lines", group: "extra", name: "Dòng kẻ trả lời", icon: PenLine,
    keywords: "dong ke tra loi dong cham viet cau tra loi",
    preview: { kind: "lines", lines: 4 },
    html: () => Array.from({ length: 4 }, () => `<p style="color:#9ca3af;margin:0 0 10px">${DOTS}${DOTS}</p>`).join("\n"),
    word: () => Array.from({ length: 4 }, () => ({ type: "paragraph", text: `${DOTS}${DOTS}`, color: "#9ca3af" })),
    ppt: () => ({
      type: "content", title: "Phần trả lời",
      content: [`${DOTS}${DOTS}`, `${DOTS}${DOTS}`, `${DOTS}${DOTS}`],
    }),
  },
];

/** Mẫu có dùng được ở ngữ cảnh soạn hiện tại không (HTML luôn được). */
export function componentAvailable(comp, mode, docType) {
  if (mode === "html" || docType === "word") return true;
  return typeof comp.ppt === "function";
}

export const CUSTOM_FORM_KINDS = [
  { id: "table", label: "Bảng tuỳ chỉnh" },
  { id: "list", label: "Danh sách tuỳ chỉnh" },
  { id: "quote", label: "Trích dẫn tuỳ chỉnh" },
];
