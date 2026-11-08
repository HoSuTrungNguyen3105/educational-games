// templateCatalog.js — Danh mục 20 mẫu tài liệu giảng dạy của Teacher
// Document Studio (10 Word + 10 PowerPoint).
//
// Mỗi mẫu là dữ liệu THẬT, không phải ảnh giả:
//   • json  — mô hình JSON đúng schema hiện có (kèm theme mở rộng)
//   • html  — mã HTML/CSS đầy đủ sinh từ cùng nội dung, giữ nhận diện riêng
//   • sourceFor(mode) — trả đúng mã nguồn theo chế độ soạn
//
// Mẫu Word mặc định mở ở HTML/CSS để giáo viên thấy ngay thiết kế; mẫu
// PowerPoint mặc định mở ở JSON để có thumbnail từng slide + thao tác slide.
// Cả hai vẫn chuyển đổi qua lại được bằng convert.js như tài liệu thường.

import modernClassroomImg from "../../assets/templates/modern-classroom.svg";
import scienceDiscoveryImg from "../../assets/templates/science-discovery.svg";
import minimalAcademicImg from "../../assets/templates/minimal-academic.svg";
import kidsLearningImg from "../../assets/templates/kids-learning.svg";
import historyGeographyImg from "../../assets/templates/history-geography.svg";
import mathVisualizationImg from "../../assets/templates/math-visualization.svg";
import languageLearningImg from "../../assets/templates/language-learning.svg";
import educationalInfographicImg from "../../assets/templates/educational-infographic.svg";
import professionalAcademicImg from "../../assets/templates/professional-academic.svg";
import storytellingEducationImg from "../../assets/templates/storytelling-education.svg";

import { presentationJsonToModel, wordJsonToModel } from "./model.js";
import {
  renderPresentationBodyHtml,
  renderWordBodyHtml,
  themeCssForPresentation,
  themeCssForWord,
} from "./modelRender.js";

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonText = (obj) => JSON.stringify(obj, null, 2);
const blank = "………………………………………………………………………………………………";

function buildWordHtml(t) {
  const model = wordJsonToModel(t.json);
  const css = `${themeCssForWord(t.theme)}\n${t.css || ""}`;
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>${esc(t.title)}</title>
<style>
${css}
</style>
</head>
<body>
<div class="doc-page tpl-${t.id}">
${t.header || ""}
${renderWordBodyHtml(model)}
${t.footer || ""}
</div>
</body>
</html>
`;
}

function buildPresentationHtml(t) {
  const model = presentationJsonToModel(t.json);
  const css = `body { background: #ece7db; }
.slide { width: 880px; max-width: calc(100% - 32px); margin: 20px auto; padding: 40px 48px; background: #fff; border-radius: 14px; }
${themeCssForPresentation(t.theme)}
${t.css || ""}`;
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>${esc(t.title)}</title>
<style>
${css}
</style>
</head>
<body>
${renderPresentationBodyHtml(model)}
</body>
</html>
`;
}

function wordTemplate(meta) {
  const json = {
    type: "document",
    title: meta.title,
    subject: meta.subject,
    grade: meta.grade,
    theme: meta.theme,
    blocks: meta.blocks,
  };
  const t = {
    ...meta,
    kind: "word",
    defaultMode: meta.defaultMode || "html",
    json,
    pageCount: meta.pageCount || 2,
    slideCount: 0,
  };
  t.html = buildWordHtml(t);
  t.sourceFor = (mode) => (mode === "json" ? jsonText(t.json) : t.html);
  return t;
}

function pptTemplate(meta) {
  const json = {
    type: "presentation",
    title: meta.title,
    subject: meta.subject,
    grade: meta.grade,
    theme: meta.theme,
    slides: meta.slides,
  };
  const t = {
    ...meta,
    kind: "powerpoint",
    defaultMode: meta.defaultMode || "json",
    json,
    pageCount: 0,
    slideCount: meta.slides.length,
  };
  t.html = buildPresentationHtml(t);
  t.sourceFor = (mode) => (mode === "json" ? jsonText(t.json) : t.html);
  return t;
}

// ── Bộ lọc dùng cho thư viện mẫu ────────────────────────────────────────
export const WORD_CATEGORY_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "lesson-plan", label: "Giáo án" },
  { id: "worksheet", label: "Phiếu bài tập" },
  { id: "exam", label: "Đề kiểm tra" },
  { id: "study-guide", label: "Tài liệu ôn tập" },
  { id: "report", label: "Báo cáo" },
  { id: "group", label: "Hoạt động nhóm" },
  { id: "project", label: "Dự án học tập" },
];

export const PPT_CATEGORY_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "math", label: "Toán học" },
  { id: "science", label: "Khoa học" },
  { id: "language", label: "Ngôn ngữ" },
  { id: "history", label: "Lịch sử và địa lý" },
  { id: "primary", label: "Giáo dục tiểu học" },
  { id: "academic", label: "Bài giảng học thuật" },
  { id: "infographic", label: "Infographic" },
  { id: "report", label: "Báo cáo chuyên đề" },
];

export const GRADE_FILTERS = [
  { id: "all", label: "Tất cả cấp học" },
  { id: "primary", label: "Tiểu học" },
  { id: "thcs", label: "THCS" },
  { id: "thpt", label: "THPT" },
  { id: "university", label: "Đại học" },
  { id: "unlimited", label: "Không giới hạn" },
];

const commonSchoolHeader = (school, right) => `<div class="tpl-head"><span>${esc(school)}</span><span>${esc(right)}</span></div>`;

// ═══════════════════════════════════════════════════════════════════════
// 10 MẪU WORD
// ═══════════════════════════════════════════════════════════════════════

export const WORD_TEMPLATES = [
  wordTemplate({
    id: "word-professional-lesson-plan",
    type: "word",
    name: "Giáo án chuẩn chuyên nghiệp",
    englishName: "Professional Lesson Plan",
    category: "lesson-plan",
    categoryLabel: "Giáo án",
    description: "Giáo án bài học đầy đủ mục tiêu, tiến trình, hoạt động dạy học và đánh giá — phong cách navy chuyên nghiệp.",
    subjects: "Toán · Khoa học · Ngữ văn",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 6,
    subject: "Toán",
    pageCount: 3,
    tags: ["giáo án", "bài dạy", "kế hoạch bài học", "THCS"],
    thumb: { layout: "classic", note: "Navy · 3 trang" },
    theme: {
      name: "Navy Academic", accent: "#1e3a8a", accent2: "#2563eb", soft: "#eff6ff",
      line: "#bfdbfe", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1e3a8a", heroText: "#ffffff", font: "Arial", displayFont: "Georgia",
      variant: "navy", pattern: "classic",
    },
    title: "GIÁO ÁN BÀI 12: PHÂN SỐ VÀ PHÉP CHIA",
    header: commonSchoolHeader("TRƯỜNG THCS NGUYỄN HUỆ", "Tổ Toán · Năm học 2026–2027"),
    footer: `<div class="tpl-foot"><span>Giáo án Toán 6 · Bài 12</span><span>Trang 1/3</span></div>`,
    css: `
.doc-page.tpl-word-professional-lesson-plan { padding: 50px 62px 58px; }
.tpl-word-professional-lesson-plan .tpl-head { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 10px; border-bottom: 2px solid #1e3a8a; color: #1e3a8a; font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.tpl-word-professional-lesson-plan h1 { margin: 22px 0 4px; color: #1e3a8a; font-family: Georgia, serif; font-size: 29px; line-height: 1.25; text-align: center; letter-spacing: .02em; }
.tpl-word-professional-lesson-plan h1 + p { text-align: center; color: #64748b; font-size: 14px; margin-top: 0; }
.tpl-word-professional-lesson-plan h2 { margin: 24px 0 10px; padding: 7px 13px; border: 0; border-radius: 4px; background: #1e3a8a; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; letter-spacing: .04em; text-transform: uppercase; }
.tpl-word-professional-lesson-plan h3 { color: #2563eb; font-size: 15px; }
.tpl-word-professional-lesson-plan table { margin: 10px 0 18px; border: 1px solid #bfdbfe; }
.tpl-word-professional-lesson-plan table th { background: #eff6ff; color: #1e3a8a; border-color: #bfdbfe; font-size: 13px; }
.tpl-word-professional-lesson-plan table td { border-color: #dbeafe; font-size: 13.5px; }
.tpl-word-professional-lesson-plan ul li { margin: 4px 0; }
.tpl-word-professional-lesson-plan .tpl-foot { display: flex; justify-content: space-between; margin-top: 34px; padding-top: 9px; border-top: 1px solid #bfdbfe; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "GIÁO ÁN BÀI 12: PHÂN SỐ VÀ PHÉP CHIA" },
      { type: "paragraph", text: "Tuần 12 · Tiết 36 · Thời lượng 45 phút · Ngày dạy 12/11/2026", align: "center" },
      {
        type: "table",
        rows: [
          ["Thông tin bài học", "Nội dung"],
          ["Giáo viên", "Nguyễn Thị Lan"],
          ["Lớp", "6A2 — Trường THCS Nguyễn Huệ"],
          ["Môn học", "Toán 6 — Chương III: Phân số"],
          ["Thiết bị", "Máy chiếu, phiếu học tập, bộ mô hình phân số"],
        ],
      },
      { type: "heading", level: 2, text: "I. Mục tiêu bài học" },
      {
        type: "list",
        ordered: false,
        items: [
          "Kiến thức: Hiểu được ý nghĩa của phân số a/b và mối liên hệ giữa phép chia hai số tự nhiên với phân số.",
          "Kỹ năng: Biểu diễn phép chia hai số tự nhiên dưới dạng phân số; đọc và viết phân số đúng.",
          "Thái độ: Chủ động tham gia hoạt động nhóm, biết vận dụng kiến thức vào tình huống thực tế.",
        ],
      },
      { type: "heading", level: 2, text: "II. Kiến thức trọng tâm" },
      { type: "paragraph", text: "Thương của phép chia số tự nhiên a cho số tự nhiên b (b khác 0) có thể viết thành phân số a/b. Ví dụ: 3 : 4 = 3/4; 7 : 5 = 7/5. Phân số a/b gồm tử số a và mẫu số b, với b là số phần bằng nhau được chia đều." },
      { type: "heading", level: 2, text: "III. Thiết bị và học liệu" },
      {
        type: "list",
        ordered: false,
        items: [
          "Máy chiếu, bài trình chiếu khởi động 3 phút.",
          "Bộ mô hình phân số bằng bìa màu cho 4 nhóm.",
          "Phiếu học tập số 1 và số 2 (in sẵn theo nhóm).",
        ],
      },
      { type: "heading", level: 2, text: "IV. Tiến trình tổ chức dạy học" },
      {
        type: "table",
        rows: [
          ["Thời gian", "Hoạt động của giáo viên", "Hoạt động của học sinh"],
          ["5 phút", "Khởi động: chiếu tình huống chia bánh, đặt câu hỏi dẫn dắt.", "Quan sát, trao đổi cặp đôi và trả lời."],
          ["10 phút", "Hình thành kiến thức: hướng dẫn viết thương thành phân số.", "Thực hiện ví dụ, ghi nhận công thức."],
          ["15 phút", "Luyện tập: giao phiếu học tập, theo dõi và hỗ trợ nhóm.", "Làm việc nhóm, trình bày kết quả."],
          ["10 phút", "Vận dụng: nêu bài toán thực tế về chia đều.", "Giải bài toán, nhận xét chéo."],
          ["5 phút", "Củng cố, dặn dò và giao nhiệm vụ tự học.", "Hệ thống kiến thức, ghi nhiệm vụ."],
        ],
      },
      { type: "heading", level: 2, text: "V. Đánh giá kết quả học tập" },
      {
        type: "list",
        ordered: false,
        items: [
          "Đánh giá thường xuyên qua quan sát hoạt động nhóm và câu trả lời cá nhân.",
          "Đánh giá sản phẩm qua phiếu học tập: viết đúng phân số từ phép chia.",
          "Học sinh tự đánh giá mức độ hoàn thành theo thang 3 mức: Tốt — Đạt — Cần cố gắng.",
        ],
      },
      { type: "heading", level: 2, text: "VI. Dặn dò và hướng dẫn tự học" },
      { type: "paragraph", text: "Học sinh hoàn thành bài tập 1, 2 trang 42 SGK; tìm 3 ví dụ thực tế có sử dụng phân số và ghi vào vở. Chuẩn bị bộ mô hình phân số cho tiết học tiếp theo." },
    ],
  }),

  wordTemplate({
    id: "word-student-worksheet",
    type: "word",
    name: "Phiếu bài tập học sinh",
    englishName: "Student Worksheet",
    category: "worksheet",
    categoryLabel: "Phiếu bài tập",
    description: "Phiếu học tập vui tươi cho tiểu học với khu vực thông tin học sinh, câu hỏi và khoảng trống làm bài.",
    subjects: "Toán · Tiếng Việt · Tự nhiên và Xã hội",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 1–5",
    grade: 2,
    subject: "Toán",
    pageCount: 2,
    tags: ["phiếu bài tập", "tiểu học", "toán lớp 2", "in cho học sinh"],
    thumb: { layout: "worksheet", note: "Pastel · 2 trang" },
    theme: {
      name: "Pastel Worksheet", accent: "#0d9488", accent2: "#f59e0b", soft: "#ecfdf5",
      line: "#99f6e4", ink: "#334155", muted: "#64748b", bg: "#fffdf8",
      heroBg: "#0d9488", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "pastel", pattern: "pastel",
    },
    title: "PHIẾU BÀI TẬP — PHÉP CỘNG CÓ NHỚ",
    header: `<div class="tpl-head"><span>Phiếu học tập số 5</span><span>Toán · Lớp 2</span></div>`,
    footer: `<div class="tpl-foot"><span>EduPlay Worksheet · Tuần 5</span><span>Họ tên: ................................................</span></div>`,
    css: `
.doc-page.tpl-word-student-worksheet { padding: 46px 58px 58px; background: #fffdf8; }
.tpl-word-student-worksheet .tpl-head { display: flex; justify-content: space-between; padding: 8px 14px; border-radius: 999px; background: #ccfbf1; color: #0f766e; font-size: 12px; font-weight: 700; letter-spacing: .03em; }
.tpl-word-student-worksheet h1 { margin: 24px 0 6px; padding: 15px 18px; border: 2px dashed #5eead4; border-radius: 18px; background: #f0fdfa; color: #0f766e; font-size: 27px; text-align: center; letter-spacing: .02em; }
.tpl-word-student-worksheet h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 14px; }
.tpl-word-student-worksheet h2 { margin: 22px 0 9px; padding: 5px 13px; border: 0; border-radius: 999px; background: #fef3c7; color: #92400e; font-size: 14px; letter-spacing: .03em; }
.tpl-word-student-worksheet table { border: 0; }
.tpl-word-student-worksheet table th { background: #ccfbf1; color: #0f766e; border-color: #5eead4; }
.tpl-word-student-worksheet table td { border-color: #99f6e4; background: #ffffff; }
.tpl-word-student-worksheet table tr:first-child th:first-child { border-radius: 10px 0 0 0; }
.tpl-word-student-worksheet ul li::marker { color: #f59e0b; }
.tpl-word-student-worksheet ol li::marker { color: #0d9488; font-weight: 700; }
.tpl-word-student-worksheet p { line-height: 1.7; }
.tpl-word-student-worksheet .tpl-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; padding-top: 10px; border-top: 2px dotted #99f6e4; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "PHIẾU BÀI TẬP — PHÉP CỘNG CÓ NHỚ" },
      { type: "paragraph", text: "Môn Toán · Lớp 2 · Tuần 5 · Thời gian làm bài: 25 phút", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên", blank, "Lớp", "2A…"],
          ["Trường", "Tiểu học Hòa Bình", "Ngày làm bài", "…/…/2026"],
        ],
      },
      { type: "heading", level: 2, text: "Hướng dẫn làm bài" },
      { type: "paragraph", text: "Em hãy đọc kỹ từng câu, đặt tính cẩn thận rồi viết đáp án vào chỗ trống. Với bài tự luận, em trình bày lời giải đầy đủ và khoanh tròn kết quả cuối cùng." },
      { type: "heading", level: 2, text: "Phần 1. Trắc nghiệm — Khoanh vào đáp án đúng" },
      {
        type: "list",
        ordered: true,
        items: [
          "35 + 27 = ?    A. 52    B. 62    C. 72",
          "48 + 16 = ?    A. 54    B. 64    C. 74",
          "29 + 38 = ?    A. 57    B. 67    C. 77",
        ],
      },
      { type: "heading", level: 2, text: "Phần 2. Điền kết quả vào ô trống" },
      {
        type: "table",
        rows: [
          ["Phép tính", "Kết quả", "Phép tính", "Kết quả"],
          ["24 + 15", "", "46 + 38", ""],
          ["57 + 26", "", "18 + 49", ""],
        ],
      },
      { type: "heading", level: 2, text: "Phần 3. Bài tập tự luận" },
      { type: "paragraph", text: "1. Lớp 2A có 28 bạn nam và 19 bạn nữ. Hỏi lớp 2A có tất cả bao nhiêu bạn?" },
      { type: "paragraph", text: "Bài giải" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Ghi chú của em" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "Nhận xét của giáo viên: ………………………………………………………………………………", color: "#0f766e" },
    ],
  }),

  wordTemplate({
    id: "word-professional-exam",
    type: "word",
    name: "Đề kiểm tra chuyên nghiệp",
    englishName: "Professional Exam Paper",
    category: "exam",
    categoryLabel: "Đề kiểm tra",
    description: "Đề kiểm tra giữa kỳ/cuối kỳ chuẩn in ấn với thông tin trường, ma trận điểm, trắc nghiệm và tự luận.",
    subjects: "Toán · Ngữ văn · Tiếng Anh",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 9,
    subject: "Toán",
    pageCount: 3,
    tags: ["đề kiểm tra", "giữa kỳ", "toán 9", "in ấn"],
    thumb: { layout: "exam", note: "Formal · 3 trang" },
    theme: {
      name: "Formal Exam", accent: "#1e3a8a", accent2: "#475569", soft: "#f1f5f9",
      line: "#94a3b8", ink: "#111827", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1e3a8a", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "exam", pattern: "exam",
    },
    title: "ĐỀ KIỂM TRA GIỮA HỌC KÌ I — TOÁN 9",
    header: `<div class="tpl-head"><span>SỞ GD&ĐT THÀNH PHỐ HỒ CHÍ MINH<br>TRƯỜNG THCS NGUYỄN HUỆ</span><span>Mã đề: 01<br>Năm học 2026–2027</span></div>`,
    footer: `<div class="tpl-foot"><span>Trang 1/3 — Đề kiểm tra Toán 9</span><span>Giáo viên ra đề: Nguyễn Thị Lan</span></div>`,
    css: `
.doc-page.tpl-word-professional-exam { padding: 44px 58px 52px; border: 2px solid #1e3a8a; }
.tpl-word-professional-exam .tpl-head { display: flex; justify-content: space-between; padding-bottom: 10px; border-bottom: 2px solid #1e3a8a; font-size: 11.5px; line-height: 1.45; text-transform: uppercase; }
.tpl-word-professional-exam .tpl-head span:first-child { font-weight: 700; }
.tpl-word-professional-exam h1 { margin: 20px 0 4px; padding-bottom: 8px; border-bottom: 3px double #1e3a8a; font-size: 24px; text-align: center; letter-spacing: .05em; }
.tpl-word-professional-exam h1 + p { margin-top: 4px; text-align: center; color: #475569; font-size: 13px; font-style: italic; }
.tpl-word-professional-exam h2 { margin: 20px 0 8px; padding: 0 0 4px; border-bottom: 1px solid #94a3b8; color: #1e3a8a; font-size: 14px; letter-spacing: .03em; text-transform: uppercase; }
.tpl-word-professional-exam table { border: 1px solid #1e3a8a; }
.tpl-word-professional-exam table th { background: #e2e8f0; color: #111827; border-color: #94a3b8; }
.tpl-word-professional-exam table td { border-color: #94a3b8; }
.tpl-word-professional-exam ol li { margin: 7px 0; line-height: 1.65; }
.tpl-word-professional-exam .tpl-foot { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 8px; border-top: 1px solid #94a3b8; color: #64748b; font-size: 10.5px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "ĐỀ KIỂM TRA GIỮA HỌC KÌ I — TOÁN 9" },
      { type: "paragraph", text: "Thời gian làm bài: 90 phút (không kể thời gian phát đề)", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên học sinh", blank, "Lớp", "9A…"],
          ["Số báo danh", "………………", "Phòng thi", "………………"],
          ["Điểm bằng số", "………………", "Điểm bằng chữ", "………………"],
        ],
      },
      { type: "heading", level: 2, text: "PHẦN I. TRẮC NGHIỆM (3,0 điểm)" },
      { type: "paragraph", text: "Khoanh tròn vào chữ cái đứng trước đáp án đúng nhất." },
      {
        type: "list",
        ordered: true,
        items: [
          "Căn bậc hai số học của 81 là: A. 9    B. −9    C. ±9    D. 81.",
          "Điều kiện xác định của biểu thức √(x − 3) là: A. x > 3    B. x ≥ 3    C. x < 3    D. x ≤ 3.",
          "Cho tam giác ABC vuông tại A, AB = 3 cm, AC = 4 cm. Độ dài BC bằng: A. 5 cm    B. 6 cm    C. 7 cm    D. 25 cm.",
          "Giá trị của biểu thức (√5 − √2)(√5 + √2) là: A. 3    B. 7    C. 10    D. 2.",
        ],
      },
      { type: "heading", level: 2, text: "PHẦN II. TỰ LUẬN (7,0 điểm)" },
      { type: "paragraph", text: "Bài 1 (2,0 điểm). Rút gọn các biểu thức sau:" },
      { type: "paragraph", text: "a) A = 3√12 − 2√27 + √48" },
      { type: "paragraph", text: "b) B = (1/(√x − 2) + 1/(√x + 2)) · (x − 4)/√x  (với x > 0, x ≠ 4)" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "Bài 2 (2,0 điểm). Giải phương trình và bất phương trình sau:" },
      { type: "paragraph", text: "a) √(2x + 1) = 3" },
      { type: "paragraph", text: "b) (x − 1)/2 + 1 ≥ (2x + 3)/3" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "Bài 3 (3,0 điểm). Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 6 cm, AC = 8 cm. Tính độ dài BC, AH và diện tích tam giác AHC." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "NHẬN XÉT CỦA GIÁO VIÊN" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "…………………………………………………………………………………………………………………………" },
    ],
  }),

  wordTemplate({
    id: "word-study-guide",
    type: "word",
    name: "Tài liệu ôn tập kiến thức",
    englishName: "Knowledge Study Guide",
    category: "study-guide",
    categoryLabel: "Tài liệu ôn tập",
    description: "Bản tổng ôn có sơ đồ kiến thức, công thức trọng tâm, ví dụ mẫu và bài tập tự luyện theo từng mức độ.",
    subjects: "Khoa học tự nhiên · Toán · Vật lý",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 8,
    subject: "Khoa học tự nhiên",
    pageCount: 4,
    tags: ["ôn tập", "tổng hợp", "công thức", "khoa học tự nhiên"],
    thumb: { layout: "study", note: "Tím · 4 trang" },
    theme: {
      name: "Study Violet", accent: "#6d28d9", accent2: "#0e7490", soft: "#f5f3ff",
      line: "#ddd6fe", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#5b21b6", heroText: "#ffffff", font: "Arial", displayFont: "Georgia",
      variant: "violet", pattern: "study",
    },
    title: "TỔNG ÔN CHƯƠNG 3: CHẤT VÀ SỰ BIẾN ĐỔI CHẤT",
    header: commonSchoolHeader("KHOA HỌC TỰ NHIÊN 8", "Tài liệu ôn tập · Học kì I"),
    footer: `<div class="tpl-foot"><span>Tổng ôn Chương 3 · KHTN 8</span><span>Lưu hành nội bộ</span></div>`,
    css: `
.doc-page.tpl-word-study-guide { padding: 48px 54px 56px 70px; border-left: 10px solid #6d28d9; }
.tpl-word-study-guide .tpl-head { display: flex; justify-content: space-between; padding-bottom: 9px; border-bottom: 2px solid #ddd6fe; color: #6d28d9; font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.tpl-word-study-guide h1 { margin: 24px 0 8px; color: #4c1d95; font-family: Georgia, serif; font-size: 28px; line-height: 1.3; }
.tpl-word-study-guide h1 + p { color: #64748b; font-size: 14px; }
.tpl-word-study-guide h2 { counter-increment: study; margin: 25px 0 10px; padding: 0 0 6px 44px; border-bottom: 2px solid #ddd6fe; color: #5b21b6; font-size: 17px; position: relative; }
.tpl-word-study-guide h2::before { content: counter(study); position: absolute; left: 0; top: -3px; width: 30px; height: 30px; border-radius: 50%; background: #6d28d9; color: #fff; font-family: Arial, sans-serif; font-size: 15px; line-height: 30px; text-align: center; }
.tpl-word-study-guide { counter-reset: study; }
.tpl-word-study-guide table { border: 1px solid #ddd6fe; }
.tpl-word-study-guide table th { background: #ede9fe; color: #5b21b6; border-color: #ddd6fe; }
.tpl-word-study-guide table td { border-color: #ede9fe; }
.tpl-word-study-guide ul li { margin: 4px 0; }
.tpl-word-study-guide blockquote, .tpl-word-study-guide p:nth-of-type(3) { color: #0e7490; }
.tpl-word-study-guide .tpl-foot { margin-top: 32px; padding-top: 9px; border-top: 2px solid #ddd6fe; color: #64748b; font-size: 11px; display: flex; justify-content: space-between; }
`,
    blocks: [
      { type: "heading", level: 1, text: "TỔNG ÔN CHƯƠNG 3: CHẤT VÀ SỰ BIẾN ĐỔI CHẤT" },
      { type: "paragraph", text: "Khoa học tự nhiên 8 · Thời gian ôn tập: 45 phút · Tài liệu dành cho học sinh", color: "#64748b" },
      { type: "heading", level: 2, text: "Bản đồ kiến thức chương" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chất: tính chất vật lí, tính chất hóa học và ứng dụng trong đời sống.",
          "Sự biến đổi chất: biến đổi vật lí và biến đổi hóa học.",
          "Phản ứng hóa học: dấu hiệu nhận biết, chất tham gia và sản phẩm.",
          "Định luật bảo toàn khối lượng và ý nghĩa trong tính toán.",
        ],
      },
      { type: "heading", level: 2, text: "Công thức và quy tắc cần nhớ" },
      {
        type: "table",
        rows: [
          ["Nội dung", "Công thức / quy tắc", "Ví dụ"],
          ["Định luật bảo toàn khối lượng", "m chất tham gia = m sản phẩm", "A + B → C: mA + mB = mC"],
          ["Tỉ lệ số mol", "Theo hệ số phương trình", "2H₂ + O₂ → 2H₂O"],
          ["Khối lượng mol", "M = m : n", "M(H₂O) = 18 g/mol"],
        ],
      },
      { type: "heading", level: 2, text: "Ví dụ mẫu có hướng dẫn" },
      { type: "paragraph", text: "Đốt cháy hoàn toàn 4,8 gam magnesium trong khí oxygen, thu được 8,0 gam magnesium oxide. Tính khối lượng oxygen đã phản ứng." },
      { type: "paragraph", text: "Hướng dẫn: Áp dụng định luật bảo toàn khối lượng: mMg + mO₂ = mMgO. Suy ra mO₂ = 8,0 − 4,8 = 3,2 gam." },
      { type: "heading", level: 2, text: "Lỗi thường gặp" },
      {
        type: "list",
        ordered: false,
        items: [
          "Nhầm lẫn giữa biến đổi vật lí (không tạo chất mới) và biến đổi hóa học (tạo chất mới).",
          "Không cân bằng phương trình trước khi lập tỉ lệ số mol.",
          "Bỏ quên đơn vị gam, mol hoặc lít khi kết luận.",
        ],
      },
      { type: "heading", level: 2, text: "Bài tập tự luyện" },
      {
        type: "list",
        ordered: true,
        items: [
          "Phân loại các hiện tượng: nước đá tan, giấy cháy, muối tan trong nước, sắt bị gỉ.",
          "Lập phương trình hóa học: Fe + O₂ → Fe₃O₄ và cho biết tỉ lệ số nguyên tử, phân tử.",
          "Tính khối lượng CO₂ tạo thành khi đốt 12 gam carbon, biết khối lượng oxygen phản ứng là 32 gam.",
          "Giải thích vì sao cần đậy nắp lọ đựng cồn sau khi sử dụng.",
        ],
      },
      { type: "heading", level: 2, text: "Đáp án và thang tự đánh giá" },
      {
        type: "table",
        rows: [
          ["Mức độ", "Số câu đúng", "Gợi ý ôn tiếp"],
          ["Tốt", "4/4", "Mở rộng với bài toán hiệu suất"],
          ["Đạt", "2–3/4", "Ôn lại định luật bảo toàn khối lượng"],
          ["Cần cố gắng", "0–1/4", "Xem lại bản đồ kiến thức và ví dụ mẫu"],
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-homework-assignment",
    type: "word",
    name: "Bài tập về nhà",
    englishName: "Homework Assignment",
    category: "worksheet",
    categoryLabel: "Phiếu bài tập",
    description: "Phiếu giao bài tập về nhà gọn gàng, có hạn nộp, nhiệm vụ theo ngày và phần tự đánh giá của học sinh.",
    subjects: "Tiếng Anh · Toán · Ngữ văn",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 6–9",
    grade: 6,
    subject: "Tiếng Anh",
    pageCount: 2,
    tags: ["bài tập về nhà", "tiếng anh 6", "tự học", "checklist"],
    thumb: { layout: "homework", note: "Xanh lá · 2 trang" },
    theme: {
      name: "Homework Mint", accent: "#15803d", accent2: "#ca8a04", soft: "#f0fdf4",
      line: "#bbf7d0", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#166534", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "green", pattern: "homework",
    },
    title: "BÀI TẬP VỀ NHÀ TUẦN 8 — TIẾNG ANH 6",
    header: `<div class="tpl-head"><span>Homework · Week 8</span><span>Unit 4: My Neighbourhood</span></div>`,
    footer: `<div class="tpl-foot"><span>Hạn nộp: Thứ Sáu, 14/11/2026</span><span>Chữ ký phụ huynh: ………………………</span></div>`,
    css: `
.doc-page.tpl-word-homework-assignment { padding: 48px 58px 56px; }
.tpl-word-homework-assignment .tpl-head { display: flex; justify-content: space-between; padding: 9px 14px; border-radius: 6px; background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; letter-spacing: .03em; }
.tpl-word-homework-assignment h1 { margin: 24px 0 6px; color: #166534; font-size: 28px; letter-spacing: .02em; }
.tpl-word-homework-assignment h1 + p { display: inline-block; margin: 0 0 15px; padding: 4px 10px; border-radius: 999px; background: #fef9c3; color: #854d0e; font-size: 13px; }
.tpl-word-homework-assignment h2 { margin: 22px 0 9px; padding: 0 0 5px; border-bottom: 2px solid #bbf7d0; color: #15803d; font-size: 15.5px; }
.tpl-word-homework-assignment h2::before { content: "✓"; margin-right: 8px; color: #ca8a04; }
.tpl-word-homework-assignment ul li { list-style: none; position: relative; padding-left: 25px; margin: 6px 0; }
.tpl-word-homework-assignment ul li::before { content: "☐"; position: absolute; left: 0; top: -1px; color: #15803d; font-size: 17px; }
.tpl-word-homework-assignment table { border: 1px solid #bbf7d0; }
.tpl-word-homework-assignment table th { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
.tpl-word-homework-assignment table td { border-color: #dcfce7; }
.tpl-word-homework-assignment .tpl-foot { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 10px; border-top: 2px dashed #bbf7d0; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "BÀI TẬP VỀ NHÀ TUẦN 8 — TIẾNG ANH 6" },
      { type: "paragraph", text: "Unit 4: My Neighbourhood · Hạn nộp: Thứ Sáu, 14/11/2026", color: "#854d0e" },
      {
        type: "table",
        rows: [
          ["Họ và tên", blank, "Lớp", "6A…"],
          ["Thời gian hoàn thành dự kiến", "60 phút", "Người kiểm tra", "……………………"],
        ],
      },
      { type: "heading", level: 2, text: "Nhiệm vụ 1 — Vocabulary (15 phút)" },
      { type: "paragraph", text: "Viết lại 8 từ vựng thuộc chủ đề neighbourhood và đặt 4 câu với các từ: crowded, peaceful, convenient, noisy." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Nhiệm vụ 2 — Grammar (20 phút)" },
      {
        type: "list",
        ordered: false,
        items: [
          "Hoàn thành bài tập 3 trang 45 sách bài tập: chia động từ ở thì hiện tại đơn.",
          "Viết 5 câu so sánh hơn để mô tả nơi em sống và nơi em từng đến.",
          "Gạch chân lỗi sai và sửa lại trong đoạn văn ngắn ở bài tập 5.",
        ],
      },
      { type: "heading", level: 2, text: "Nhiệm vụ 3 — Reading (15 phút)" },
      { type: "paragraph", text: "Đọc đoạn văn “A friendly neighbourhood” và trả lời 4 câu hỏi. Ghi đáp án ngắn gọn, đủ ý." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Nhiệm vụ 4 — Writing (10 phút)" },
      { type: "paragraph", text: "Viết đoạn văn 60–80 từ giới thiệu khu phố của em, sử dụng ít nhất 5 từ vựng đã học và 2 câu so sánh." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Tự đánh giá" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Hoàn thành", "Cần hỗ trợ"],
          ["Tôi đã làm đủ 4 nhiệm vụ", "☐", "☐"],
          ["Tôi kiểm tra lại lỗi chính tả", "☐", "☐"],
          ["Tôi chuẩn bị bài cho tiết học tới", "☐", "☐"],
        ],
      },
      { type: "paragraph", text: "Điều em muốn hỏi thầy cô: ……………………………………………………………………………", color: "#15803d" },
    ],
  }),

  wordTemplate({
    id: "word-group-activity",
    type: "word",
    name: "Giáo án hoạt động nhóm",
    englishName: "Group Activity Plan",
    category: "group",
    categoryLabel: "Hoạt động nhóm",
    description: "Kế hoạch hoạt động nhóm với phân vai, tiến độ, sản phẩm và tiêu chí đánh giá rõ ràng cho từng thành viên.",
    subjects: "Lịch sử và Địa lý · Ngữ văn · Giáo dục công dân",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 7,
    subject: "Lịch sử và Địa lý",
    pageCount: 3,
    tags: ["hoạt động nhóm", "làm việc nhóm", "phân vai", "rubric"],
    thumb: { layout: "group", note: "Cam · 3 trang" },
    theme: {
      name: "Group Coral", accent: "#c2410c", accent2: "#1d4ed8", soft: "#fff7ed",
      line: "#fed7aa", ink: "#1f2937", muted: "#64748b", bg: "#fffdf9",
      heroBg: "#9a3412", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "coral", pattern: "group",
    },
    title: "HOẠT ĐỘNG NHÓM: KHÁM PHÁ VĂN HÓA ĐỊA PHƯƠNG",
    header: commonSchoolHeader("TRƯỜNG THCS TRẦN PHÚ", "Lịch sử và Địa lý 7 · Tiết 24"),
    footer: `<div class="tpl-foot"><span>Hoạt động nhóm · 45 phút</span><span>Nhóm trưởng ký tên: ………………………</span></div>`,
    css: `
.doc-page.tpl-word-group-activity { padding: 48px 56px 54px; background: #fffdf9; }
.tpl-word-group-activity .tpl-head { display: flex; justify-content: space-between; padding: 9px 14px; border-left: 5px solid #c2410c; background: #ffedd5; color: #9a3412; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.tpl-word-group-activity h1 { margin: 24px 0 6px; color: #9a3412; font-size: 27px; line-height: 1.3; }
.tpl-word-group-activity h1 + p { color: #64748b; font-size: 14px; }
.tpl-word-group-activity h2 { margin: 22px 0 9px; padding: 6px 12px; border-left: 5px solid #c2410c; background: #fff7ed; color: #9a3412; font-size: 15px; }
.tpl-word-group-activity h3 { color: #1d4ed8; }
.tpl-word-group-activity table { border: 1px solid #fed7aa; }
.tpl-word-group-activity table th { background: #ffedd5; color: #9a3412; border-color: #fed7aa; }
.tpl-word-group-activity table td { border-color: #ffedd5; background: #ffffff; }
.tpl-word-group-activity ul li { margin: 4px 0; }
.tpl-word-group-activity .tpl-foot { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 9px; border-top: 2px solid #fed7aa; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "HOẠT ĐỘNG NHÓM: KHÁM PHÁ VĂN HÓA ĐỊA PHƯƠNG" },
      { type: "paragraph", text: "Lịch sử và Địa lý 7 · Tiết 24 · Thời lượng: 45 phút", color: "#64748b" },
      {
        type: "table",
        rows: [
          ["Nhóm", "Nhóm 3 — Lớp 7A2", "Nhóm trưởng", "……………………"],
          ["Thư ký", "……………………", "Thuyết trình viên", "……………………"],
          ["Thành viên", "………………………………………………………………………………………………", "", ""],
        ],
      },
      { type: "heading", level: 2, text: "Mục tiêu hoạt động" },
      {
        type: "list",
        ordered: false,
        items: [
          "Thu thập và trình bày được ít nhất 3 nét đặc sắc của văn hóa địa phương.",
          "Phối hợp hiệu quả theo vai trò, hoàn thành sản phẩm đúng thời hạn.",
          "Thể hiện thái độ tôn trọng và tự hào đối với di sản văn hóa quê hương.",
        ],
      },
      { type: "heading", level: 2, text: "Phân công vai trò" },
      {
        type: "table",
        rows: [
          ["Vai trò", "Nhiệm vụ chính", "Sản phẩm cần nộp"],
          ["Nhóm trưởng", "Điều hành, phân việc, theo dõi tiến độ", "Bảng phân công + nhật ký nhóm"],
          ["Thư ký", "Ghi chép, tổng hợp thông tin", "Biên bản thảo luận"],
          ["Thuyết trình viên", "Chuẩn bị nội dung nói, luyện tập", "Kịch bản thuyết trình 3 phút"],
          ["Thành viên", "Tìm tư liệu, thiết kế sản phẩm", "Ảnh, số liệu, poster"],
        ],
      },
      { type: "heading", level: 2, text: "Tiến độ thực hiện" },
      {
        type: "table",
        rows: [
          ["Thời gian", "Hoạt động", "Người phụ trách"],
          ["5 phút", "Nhận nhiệm vụ, thống nhất kế hoạch", "Cả nhóm"],
          ["15 phút", "Thu thập và chọn lọc thông tin", "Thành viên"],
          ["15 phút", "Thiết kế sản phẩm nhóm", "Thư ký + thành viên"],
          ["8 phút", "Luyện thuyết trình và phản biện", "Thuyết trình viên"],
          ["2 phút", "Nộp sản phẩm, tự đánh giá", "Nhóm trưởng"],
        ],
      },
      { type: "heading", level: 2, text: "Sản phẩm và yêu cầu" },
      { type: "paragraph", text: "Sản phẩm: poster A3 hoặc bài trình chiếu 5 slide giới thiệu một nét văn hóa địa phương (lễ hội, ẩm thực, trang phục, kiến trúc hoặc nghề truyền thống). Bài trình bày cần có ít nhất 3 hình ảnh/số liệu minh họa và 1 phần liên hệ trách nhiệm của học sinh." },
      { type: "heading", level: 2, text: "Tiêu chí đánh giá" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Mô tả", "Điểm"],
          ["Nội dung", "Chính xác, phong phú, có liên hệ thực tế", "4"],
          ["Hợp tác", "Phân vai rõ, mọi thành viên tham gia", "2"],
          ["Sáng tạo", "Trình bày hấp dẫn, có điểm nhấn", "2"],
          ["Thuyết trình", "Tự tin, rõ ràng, đúng thời gian", "2"],
        ],
      },
      { type: "heading", level: 2, text: "Nhật ký và tự đánh giá" },
      { type: "paragraph", text: "Điều nhóm làm tốt nhất: ………………………………………………………………………………" },
      { type: "paragraph", text: "Điều nhóm cần cải thiện: ……………………………………………………………………………" },
      { type: "paragraph", text: "Điểm tự đánh giá của nhóm: ……… / 10. Đề xuất hỗ trợ: ……………………………………" },
    ],
  }),

  wordTemplate({
    id: "word-practical-manual",
    type: "word",
    name: "Tài liệu hướng dẫn thực hành",
    englishName: "Practical Manual",
    category: "study-guide",
    categoryLabel: "Tài liệu ôn tập",
    description: "Hướng dẫn thực hành theo từng bước, có dụng cụ, quy tắc an toàn, bảng quan sát và câu hỏi phân tích.",
    subjects: "Khoa học tự nhiên · Sinh học · Hóa học",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 8,
    subject: "Khoa học tự nhiên",
    pageCount: 3,
    tags: ["thực hành", "thí nghiệm", "tế bào", "khoa học"],
    thumb: { layout: "manual", note: "Xanh dương · 3 trang" },
    theme: {
      name: "Lab Blue", accent: "#0369a1", accent2: "#0f766e", soft: "#f0f9ff",
      line: "#bae6fd", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#075985", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "lab", pattern: "manual",
    },
    title: "THỰC HÀNH: QUAN SÁT TẾ BÀO THỰC VẬT",
    header: commonSchoolHeader("PHÒNG THÍ NGHIỆM KHOA HỌC", "KHTN 8 · Bài thực hành số 4"),
    footer: `<div class="tpl-foot"><span>Bài thực hành số 4 · Nhóm: ……………</span><span>Ngày thực hiện: …/…/2026</span></div>`,
    css: `
.doc-page.tpl-word-practical-manual { padding: 46px 56px 54px; background: #ffffff; }
.tpl-word-practical-manual .tpl-head { display: flex; justify-content: space-between; padding-bottom: 9px; border-bottom: 3px solid #0369a1; color: #0369a1; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.tpl-word-practical-manual h1 { margin: 23px 0 5px; color: #075985; font-size: 27px; }
.tpl-word-practical-manual h1 + p { color: #64748b; font-size: 14px; }
.tpl-word-practical-manual h2 { margin: 22px 0 9px; padding: 6px 12px; border-radius: 4px; background: #e0f2fe; color: #075985; font-size: 15px; }
.tpl-word-practical-manual h2::before { content: "▸"; margin-right: 8px; color: #0f766e; }
.tpl-word-practical-manual ol { counter-reset: step; list-style: none; padding-left: 0; }
.tpl-word-practical-manual ol li { counter-increment: step; position: relative; margin: 9px 0; padding: 9px 12px 9px 48px; border: 1px solid #bae6fd; border-radius: 7px; background: #f8fcff; }
.tpl-word-practical-manual ol li::before { content: counter(step); position: absolute; left: 12px; top: 7px; width: 25px; height: 25px; border-radius: 50%; background: #0369a1; color: #fff; font-size: 13px; line-height: 25px; text-align: center; }
.tpl-word-practical-manual table { border: 1px solid #bae6fd; }
.tpl-word-practical-manual table th { background: #e0f2fe; color: #075985; border-color: #bae6fd; }
.tpl-word-practical-manual table td { border-color: #bae6fd; }
.tpl-word-practical-manual .tpl-foot { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 9px; border-top: 2px solid #bae6fd; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "THỰC HÀNH: QUAN SÁT TẾ BÀO THỰC VẬT" },
      { type: "paragraph", text: "Khoa học tự nhiên 8 · Thời gian: 45 phút · Hình thức: làm việc nhóm 4 học sinh", color: "#64748b" },
      { type: "heading", level: 2, text: "Mục tiêu thực hành" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chuẩn bị được tiêu bản tạm thời tế bào vảy hành.",
          "Quan sát và mô tả được hình dạng, thành phần cơ bản của tế bào thực vật.",
          "Thực hiện đúng quy tắc an toàn và giữ vệ sinh phòng thí nghiệm.",
        ],
      },
      { type: "heading", level: 2, text: "Dụng cụ và hóa chất" },
      {
        type: "table",
        rows: [
          ["Dụng cụ", "Số lượng", "Hóa chất / vật liệu", "Số lượng"],
          ["Kính hiển vi quang học", "1 chiếc / nhóm", "Nước cất", "1 lọ nhỏ"],
          ["Lam kính, lamen", "2 bộ", "Dung dịch xanh methylene", "1 lọ nhỏ"],
          ["Dao lam, panh", "1 bộ", "Củ hành tím", "1 củ"],
          ["Giấy thấm, ống nhỏ giọt", "2 tờ, 1 chiếc", "Khăn lau", "2 chiếc"],
        ],
      },
      { type: "heading", level: 2, text: "Quy tắc an toàn" },
      {
        type: "list",
        ordered: false,
        items: [
          "Không dùng tay trực tiếp cầm dao lam; đặt lưỡi dao xuống bàn theo hướng an toàn.",
          "Không nếm hoặc ngửi trực tiếp hóa chất; rửa tay sau khi hoàn thành.",
          "Điều chỉnh kính hiển vi từ từ, không dùng vật cứng chạm vào thấu kính.",
        ],
      },
      { type: "heading", level: 2, text: "Các bước tiến hành" },
      {
        type: "list",
        ordered: true,
        items: [
          "Nhỏ một giọt nước cất lên giữa lam kính.",
          "Dùng dao lam lấy một lớp mỏng vảy hành tím, đặt lên giọt nước.",
          "Đậy lamen nhẹ nhàng từ một phía để tránh bọt khí.",
          "Nhỏ một giọt xanh methylene vào mép lamen, dùng giấy thấm hút phần thừa.",
          "Đặt tiêu bản lên bàn kính, điều chỉnh ánh sáng và quan sát ở vật kính 10×, sau đó 40×.",
          "Vẽ lại hình dạng tế bào quan sát được vào bảng kết quả.",
        ],
      },
      { type: "heading", level: 2, text: "Bảng quan sát và kết quả" },
      {
        type: "table",
        rows: [
          ["Tiêu chí quan sát", "Mô tả của nhóm", "Hình vẽ minh họa"],
          ["Hình dạng tế bào", "", ""],
          ["Thành tế bào", "", ""],
          ["Nhân tế bào", "", ""],
          ["Tế bào chất", "", ""],
        ],
      },
      { type: "heading", level: 2, text: "Câu hỏi phân tích" },
      {
        type: "list",
        ordered: true,
        items: [
          "Vì sao cần dùng lớp vảy hành thật mỏng?",
          "Màu xanh methylene giúp quan sát rõ thành phần nào của tế bào?",
          "So sánh hình dạng tế bào vảy hành với tế bào biểu bì lá cây (nếu đã quan sát).",
        ],
      },
      { type: "heading", level: 2, text: "Kết luận" },
      { type: "paragraph", text: "Tế bào thực vật có thành tế bào, màng sinh chất, tế bào chất và nhân. Tiêu bản tạm thời giúp quan sát cấu trúc tế bào ở mức đơn giản, phục vụ học tập và nghiên cứu ban đầu." },
    ],
  }),

  wordTemplate({
    id: "word-student-report",
    type: "word",
    name: "Báo cáo kết quả học tập",
    englishName: "Student Learning Report",
    category: "report",
    categoryLabel: "Báo cáo",
    description: "Báo cáo học tập cá nhân theo học kỳ với bảng điểm, nhận xét năng lực, điểm mạnh và kế hoạch cải thiện.",
    subjects: "Tổng hợp · Chủ nhiệm · Tư vấn học tập",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 8,
    subject: "Tổng hợp",
    pageCount: 3,
    tags: ["báo cáo", "học tập", "nhận xét", "học kỳ"],
    thumb: { layout: "report", note: "Navy · 3 trang" },
    theme: {
      name: "Report Teal", accent: "#0f766e", accent2: "#1e3a8a", soft: "#f0fdfa",
      line: "#99f6e4", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#134e4a", heroText: "#ffffff", font: "Arial", displayFont: "Georgia",
      variant: "teal", pattern: "report",
    },
    title: "BÁO CÁO KẾT QUẢ HỌC TẬP HỌC KÌ I — LỚP 8A1",
    header: commonSchoolHeader("TRƯỜNG THCS LÊ QUÝ ĐÔN", "Báo cáo học tập · Năm học 2026–2027"),
    footer: `<div class="tpl-foot"><span>Báo cáo học kì I · Lớp 8A1</span><span>Giáo viên chủ nhiệm: Nguyễn Thị Lan</span></div>`,
    css: `
.doc-page.tpl-word-student-report { padding: 0 0 56px; }
.tpl-word-student-report .tpl-head { display: flex; justify-content: space-between; padding: 16px 56px; background: #134e4a; color: #ccfbf1; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.tpl-word-student-report h1 { margin: 30px 56px 6px; color: #134e4a; font-family: Georgia, serif; font-size: 27px; line-height: 1.3; }
.tpl-word-student-report h1 + p { margin: 0 56px 18px; color: #64748b; font-size: 14px; }
.tpl-word-student-report h2 { margin: 24px 56px 10px; padding: 0 0 6px; border-bottom: 2px solid #99f6e4; color: #0f766e; font-size: 16px; }
.tpl-word-student-report table { width: calc(100% - 112px); margin: 10px 56px 18px; border: 1px solid #99f6e4; }
.tpl-word-student-report table th { background: #ccfbf1; color: #134e4a; border-color: #99f6e4; }
.tpl-word-student-report table td { border-color: #ccfbf1; }
.tpl-word-student-report table tr:nth-child(even) td { background: #f0fdfa; }
.tpl-word-student-report p { margin-left: 56px; margin-right: 56px; }
.tpl-word-student-report ul, .tpl-word-student-report ol { margin-left: 56px; margin-right: 56px; }
.tpl-word-student-report .tpl-foot { display: flex; justify-content: space-between; margin: 34px 56px 0; padding-top: 9px; border-top: 1px solid #99f6e4; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "BÁO CÁO KẾT QUẢ HỌC TẬP HỌC KÌ I — LỚP 8A1" },
      { type: "paragraph", text: "Học sinh: Nguyễn Minh Anh · Lớp 8A1 · Giáo viên chủ nhiệm: Nguyễn Thị Lan", color: "#64748b" },
      {
        type: "table",
        rows: [
          ["Họ và tên", "Nguyễn Minh Anh", "Lớp", "8A1"],
          ["Ngày sinh", "14/03/2012", "Học kì", "Học kì I — 2026–2027"],
          ["Thời gian đánh giá", "05/09/2026 – 20/12/2026", "Xếp loại chung", "Tốt"],
        ],
      },
      { type: "heading", level: 2, text: "1. Tổng quan kết quả học tập" },
      { type: "paragraph", text: "Học sinh duy trì được tinh thần học tập tích cực, tham gia đầy đủ các hoạt động của lớp và hoàn thành tốt phần lớn nhiệm vụ học tập. Kết quả học kì I có tiến bộ rõ rệt ở môn Toán và Khoa học tự nhiên; kỹ năng trình bày và làm việc nhóm ngày càng tự tin." },
      {
        type: "table",
        rows: [
          ["Môn học", "Điểm trung bình", "Mức đánh giá", "Ghi chú"],
          ["Toán", "8,6", "Tốt", "Tiến bộ về giải bài toán thực tế"],
          ["Ngữ văn", "8,2", "Tốt", "Cần chú ý diễn đạt khi viết nghị luận"],
          ["Tiếng Anh", "7,9", "Đạt", "Tăng cường luyện nghe"],
          ["Khoa học tự nhiên", "8,8", "Tốt", "Thực hành tốt, chủ động thí nghiệm"],
          ["Lịch sử và Địa lý", "8,4", "Tốt", "Có kỹ năng khai thác bản đồ"],
          ["Tin học", "9,0", "Tốt", "Sản phẩm số sáng tạo"],
        ],
      },
      { type: "heading", level: 2, text: "2. Điểm mạnh nổi bật" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chủ động đặt câu hỏi và biết ghi chú có hệ thống trong giờ học.",
          "Phối hợp tốt với bạn khi làm việc nhóm, biết lắng nghe và chia sẻ nhiệm vụ.",
          "Có ý thức tự học, hoàn thành bài tập đúng hạn và biết tự kiểm tra lại kết quả.",
        ],
      },
      { type: "heading", level: 2, text: "3. Nội dung cần cải thiện" },
      {
        type: "list",
        ordered: false,
        items: [
          "Kỹ năng nghe hiểu tiếng Anh còn hạn chế khi tốc độ nói nhanh.",
          "Cần trình bày lập luận chặt chẽ hơn trong bài văn nghị luận.",
          "Cần phân bổ thời gian hợp lý hơn khi làm bài kiểm tra tổng hợp.",
        ],
      },
      { type: "heading", level: 2, text: "4. Kế hoạch hành động học kì II" },
      {
        type: "table",
        rows: [
          ["Mục tiêu", "Hoạt động cụ thể", "Thời gian", "Người hỗ trợ"],
          ["Nâng điểm tiếng Anh lên 8,5", "Luyện nghe 15 phút/ngày, làm 2 đề/tuần", "Hằng ngày", "Giáo viên bộ môn"],
          ["Cải thiện bài nghị luận", "Viết 1 bài/tuần và nhận xét cùng giáo viên", "Thứ Bảy", "Giáo viên Ngữ văn"],
          ["Quản lý thời gian tốt hơn", "Lập thời gian biểu và tự đánh giá mỗi tuần", "Chủ nhật", "Phụ huynh"],
        ],
      },
      { type: "heading", level: 2, text: "5. Nhận xét của giáo viên chủ nhiệm" },
      { type: "paragraph", text: "Nguyễn Minh Anh là học sinh có tinh thần cầu tiến, thái độ học tập nghiêm túc và có trách nhiệm với tập thể. Nếu tiếp tục phát huy tính tự giác và rèn luyện kỹ năng nghe tiếng Anh, học sinh sẽ đạt kết quả cao hơn trong học kì II." },
      { type: "paragraph", text: "Chữ ký giáo viên chủ nhiệm: ……………………………………………………………………………" },
    ],
  }),

  wordTemplate({
    id: "word-visual-learning",
    type: "word",
    name: "Tài liệu bài học có hình ảnh",
    englishName: "Visual Learning Handout",
    category: "study-guide",
    categoryLabel: "Tài liệu ôn tập",
    description: "Bài đọc trực quan có hình minh họa lớn, câu hỏi gợi mở và bảng so sánh giúp học sinh hiểu sâu nội dung.",
    subjects: "Khoa học · Sinh học · Tự nhiên và Xã hội",
    levels: ["Tiểu học", "THCS", "Không giới hạn"],
    levelKeys: ["primary", "thcs", "unlimited"],
    gradeRange: "Mọi cấp học",
    grade: 5,
    subject: "Khoa học",
    pageCount: 3,
    tags: ["hình ảnh", "bài đọc", "quang hợp", "trực quan"],
    thumb: { layout: "editorial", note: "Editorial · 3 trang" },
    theme: {
      name: "Editorial Green", accent: "#166534", accent2: "#b45309", soft: "#f0fdf4",
      line: "#bbf7d0", ink: "#292524", muted: "#78716c", bg: "#fffefb",
      heroBg: "#14532d", heroText: "#ffffff", font: "Arial", displayFont: "Georgia",
      variant: "editorial", pattern: "editorial",
    },
    title: "SỰ KÌ DIỆU CỦA LÁ CÂY",
    header: `<div class="tpl-head"><span>Bài đọc trực quan · Khoa học</span><span>Chủ đề: Thực vật quanh em</span></div>`,
    footer: `<div class="tpl-foot"><span>Bài đọc lớp 5 · Sự kì diệu của lá cây</span><span>“Mỗi chiếc lá là một nhà máy nhỏ”</span></div>`,
    css: `
.doc-page.tpl-word-visual-learning { padding: 48px 60px 58px; background: #fffefb; }
.tpl-word-visual-learning .tpl-head { display: flex; justify-content: space-between; padding-bottom: 9px; border-bottom: 1px solid #d6d3d1; color: #78716c; font-size: 11.5px; letter-spacing: .04em; text-transform: uppercase; }
.tpl-word-visual-learning h1 { margin: 25px 0 10px; color: #14532d; font-family: Georgia, serif; font-size: 34px; line-height: 1.2; }
.tpl-word-visual-learning h1 + p { color: #57534e; font-size: 16px; line-height: 1.7; }
.tpl-word-visual-learning h2 { margin: 26px 0 10px; color: #166534; font-family: Georgia, serif; font-size: 20px; }
.tpl-word-visual-learning h2::after { content: ""; display: block; width: 72px; height: 3px; margin-top: 6px; background: #bbf7d0; }
.tpl-word-visual-learning p { line-height: 1.8; font-size: 14px; }
.tpl-word-visual-learning p:first-of-type::first-letter { float: left; margin: 2px 8px 0 0; color: #166534; font-family: Georgia, serif; font-size: 52px; line-height: .9; font-weight: 700; }
.tpl-word-visual-learning img { display: block; width: 100%; margin: 14px 0 7px; border-radius: 12px; border: 1px solid #d6d3d1; }
.tpl-word-visual-learning img + p { text-align: center; color: #78716c; font-size: 12px; font-style: italic; }
.tpl-word-visual-learning table { border: 1px solid #d6d3d1; }
.tpl-word-visual-learning table th { background: #ecfccb; color: #365314; border-color: #d9f99d; }
.tpl-word-visual-learning table td { border-color: #e7e5e4; }
.tpl-word-visual-learning ul li { margin: 5px 0; }
.tpl-word-visual-learning .tpl-foot { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 9px; border-top: 1px solid #d6d3d1; color: #78716c; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "SỰ KÌ DIỆU CỦA LÁ CÂY" },
      { type: "paragraph", text: "Mỗi ngày, khi ánh nắng tràn qua khung cửa, những chiếc lá xanh lại lặng lẽ làm việc. Ít ai biết rằng trong chiếc lá nhỏ bé ấy đang diễn ra một quá trình kì diệu: quang hợp. Đó là cách cây tạo ra thức ăn, tạo ra oxygen và duy trì sự sống cho muôn loài." },
      { type: "image", src: scienceDiscoveryImg, alt: "Minh họa quá trình quang hợp của lá cây" },
      { type: "paragraph", text: "Hình 1. Lá cây hấp thụ ánh sáng, nước và khí carbonic để tạo ra chất hữu cơ và oxygen." },
      { type: "heading", level: 2, text: "Lá cây — nhà máy năng lượng của tự nhiên" },
      { type: "paragraph", text: "Trong lá có một loại bào quan màu xanh gọi là lục lạp. Lục lạp chứa diệp lục — sắc tố giúp lá hấp thụ ánh sáng mặt trời. Nhờ năng lượng ánh sáng, cây kết hợp nước từ rễ với khí carbonic từ không khí để tạo thành glucose. Glucose là nguồn dinh dưỡng nuôi cây, còn oxygen được thải ra môi trường." },
      {
        type: "list",
        ordered: false,
        items: [
          "Nguyên liệu: nước, khí carbonic và ánh sáng mặt trời.",
          "Sản phẩm: chất hữu cơ (glucose) và khí oxygen.",
          "Điều kiện: có diệp lục và ánh sáng phù hợp.",
        ],
      },
      { type: "heading", level: 2, text: "Hai giai đoạn của quang hợp" },
      {
        type: "table",
        rows: [
          ["Giai đoạn", "Nơi diễn ra", "Điều kiện", "Sản phẩm chính"],
          ["Pha sáng", "Màng lục lạp", "Cần ánh sáng", "Năng lượng và oxygen"],
          ["Pha tối", "Chất nền lục lạp", "Không cần ánh sáng trực tiếp", "Chất hữu cơ"],
        ],
      },
      { type: "heading", level: 2, text: "Vì sao lá thường có màu xanh?" },
      { type: "paragraph", text: "Lá có màu xanh vì diệp lục hấp thụ mạnh ánh sáng đỏ và xanh tím, đồng thời phản xạ phần lớn ánh sáng xanh lục. Khi mùa thu đến, nhiều loại lá giảm sản xuất diệp lục, các sắc tố khác như carotenoid trở nên nổi bật, khiến lá chuyển sang vàng, cam hoặc đỏ." },
      { type: "heading", level: 2, text: "Em có biết?" },
      {
        type: "list",
        ordered: false,
        items: [
          "Một cây trưởng thành có thể cung cấp đủ oxygen cho vài người mỗi ngày.",
          "Thực vật là nền tảng của hầu hết chuỗi thức ăn trên Trái Đất.",
          "Trồng thêm cây xanh giúp giảm khí carbonic và làm mát không gian sống.",
        ],
      },
      { type: "heading", level: 2, text: "Câu hỏi thảo luận" },
      {
        type: "list",
        ordered: true,
        items: [
          "Nếu không có ánh sáng, quá trình quang hợp sẽ bị ảnh hưởng như thế nào?",
          "Vì sao nói lá cây là “nhà máy năng lượng” của tự nhiên?",
          "Em có thể làm gì để bảo vệ cây xanh ở trường và nơi em sống?",
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-project-based-learning",
    type: "word",
    name: "Tài liệu dự án học tập",
    englishName: "Project-Based Learning Plan",
    category: "project",
    categoryLabel: "Dự án học tập",
    description: "Kế hoạch dự án học tập theo mô hình PBL: câu hỏi lớn, mốc thời gian, sản phẩm, rubric và phản tư cá nhân.",
    subjects: "Liên môn · Khoa học · Giáo dục công dân",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 9,
    subject: "Liên môn",
    pageCount: 4,
    tags: ["dự án", "PBL", "liên môn", "thành phố xanh"],
    thumb: { layout: "project", note: "Tím xanh · 4 trang" },
    theme: {
      name: "Project violet", accent: "#5b21b6", accent2: "#15803d", soft: "#f5f3ff",
      line: "#ddd6fe", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#4c1d95", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "project", pattern: "project",
    },
    title: "DỰ ÁN HỌC TẬP: THÀNH PHỐ XANH TƯƠNG LAI",
    header: `<div class="tpl-head"><span>DỰ ÁN LIÊN MÔN · LỚP 9</span><span>Thời gian: 4 tuần</span></div>`,
    footer: `<div class="tpl-foot"><span>Dự án “Thành phố xanh tương lai”</span><span>Nhóm: ………………………</span></div>`,
    css: `
.doc-page.tpl-word-project-based-learning { padding: 48px 56px 56px; }
.tpl-word-project-based-learning .tpl-head { display: flex; justify-content: space-between; padding: 9px 14px; border-radius: 8px; background: #ede9fe; color: #5b21b6; font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.tpl-word-project-based-learning h1 { margin: 24px 0 6px; color: #4c1d95; font-size: 28px; line-height: 1.3; }
.tpl-word-project-based-learning h1 + p { color: #64748b; font-size: 14px; }
.tpl-word-project-based-learning h2 { margin: 23px 0 9px; padding: 0 0 5px; border-bottom: 2px solid #ddd6fe; color: #5b21b6; font-size: 16px; }
.tpl-word-project-based-learning h2::before { content: "◆"; margin-right: 8px; color: #15803d; font-size: 12px; }
.tpl-word-project-based-learning table { border: 1px solid #ddd6fe; }
.tpl-word-project-based-learning table th { background: #ede9fe; color: #4c1d95; border-color: #ddd6fe; }
.tpl-word-project-based-learning table td { border-color: #ede9fe; }
.tpl-word-project-based-learning ol li { margin: 7px 0; }
.tpl-word-project-based-learning ul li { margin: 4px 0; }
.tpl-word-project-based-learning .tpl-foot { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 9px; border-top: 2px solid #ddd6fe; color: #64748b; font-size: 11px; }
`,
    blocks: [
      { type: "heading", level: 1, text: "DỰ ÁN HỌC TẬP: THÀNH PHỐ XANH TƯƠNG LAI" },
      { type: "paragraph", text: "Dự án liên môn Khoa học — Công nghệ — Giáo dục công dân · Lớp 9 · 4 tuần", color: "#64748b" },
      { type: "heading", level: 2, text: "Câu hỏi lớn" },
      { type: "paragraph", text: "Làm thế nào để thiết kế một không gian sống xanh, an toàn và thân thiện hơn cho cộng đồng của chúng ta?" },
      { type: "heading", level: 2, text: "Mục tiêu dự án" },
      {
        type: "list",
        ordered: false,
        items: [
          "Vận dụng kiến thức về môi trường, năng lượng và thiết kế để đề xuất giải pháp cụ thể.",
          "Rèn luyện kỹ năng nghiên cứu, hợp tác, thuyết trình và phản biện.",
          "Hình thành ý thức trách nhiệm với cộng đồng và môi trường sống.",
        ],
      },
      { type: "heading", level: 2, text: "Sản phẩm dự án" },
      {
        type: "list",
        ordered: false,
        items: [
          "Mô hình hoặc bản vẽ thiết kế “Thành phố xanh” kèm chú thích.",
          "Bài thuyết trình 5–7 phút trình bày ý tưởng và tính khả thi.",
          "Hồ sơ dự án: kế hoạch, nhật ký làm việc, minh chứng và phản tư cá nhân.",
        ],
      },
      { type: "heading", level: 2, text: "Tiến độ 4 tuần" },
      {
        type: "table",
        rows: [
          ["Tuần", "Hoạt động chính", "Sản phẩm tạm thời"],
          ["Tuần 1", "Khảo sát vấn đề, xác định câu hỏi nghiên cứu", "Phiếu khảo sát + kế hoạch nhóm"],
          ["Tuần 2", "Thu thập dữ liệu, nghiên cứu giải pháp", "Bản tổng hợp dữ liệu"],
          ["Tuần 3", "Thiết kế mô hình, thử nghiệm và chỉnh sửa", "Bản vẽ/mô hình nháp"],
          ["Tuần 4", "Hoàn thiện sản phẩm, thuyết trình, phản tư", "Sản phẩm cuối + hồ sơ dự án"],
        ],
      },
      { type: "heading", level: 2, text: "Phân công nhiệm vụ" },
      {
        type: "table",
        rows: [
          ["Thành viên", "Nhiệm vụ chính", "Mốc hoàn thành"],
          ["Nhóm trưởng", "Điều phối, kiểm tra tiến độ, tổng hợp hồ sơ", "Cuối tuần 4"],
          ["Thành viên 1–2", "Khảo sát, thu thập dữ liệu và phân tích", "Cuối tuần 2"],
          ["Thành viên 3", "Thiết kế mô hình/bản vẽ", "Cuối tuần 3"],
          ["Thành viên 4", "Chuẩn bị thuyết trình, hình ảnh", "Cuối tuần 4"],
        ],
      },
      { type: "heading", level: 2, text: "Tiêu chí đánh giá" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Trọng số", "Mô tả mức Tốt"],
          ["Nội dung và tính khả thi", "35%", "Giải pháp rõ ràng, có căn cứ, phù hợp thực tế"],
          ["Quy trình và hợp tác", "25%", "Đúng tiến độ, phân vai hiệu quả, có minh chứng"],
          ["Sản phẩm", "25%", "Trình bày đẹp, khoa học, sáng tạo"],
          ["Thuyết trình và phản biện", "15%", "Tự tin, trả lời thuyết phục"],
        ],
      },
      { type: "heading", level: 2, text: "Nguồn tài nguyên gợi ý" },
      {
        type: "list",
        ordered: false,
        items: [
          "Số liệu môi trường địa phương từ phòng tài nguyên hoặc website chính thống.",
          "Bài báo khoa học, video giáo dục và báo cáo của các tổ chức uy tín.",
          "Ý kiến phỏng vấn người dân, chuyên gia hoặc cán bộ địa phương.",
        ],
      },
      { type: "heading", level: 2, text: "Phản tư cá nhân" },
      { type: "paragraph", text: "Điều em học được nhiều nhất qua dự án: ……………………………………………………………" },
      { type: "paragraph", text: "Khó khăn lớn nhất và cách nhóm vượt qua: ……………………………………………………" },
      { type: "paragraph", text: "Nếu tiếp tục phát triển dự án, em sẽ thay đổi điều gì? ……………………………………" },
    ],
  }),
];

// ═══════════════════════════════════════════════════════════════════════
// 10 MẪU POWERPOINT
// ═══════════════════════════════════════════════════════════════════════

export const POWERPOINT_TEMPLATES = [
  pptTemplate({
    id: "ppt-modern-classroom",
    type: "powerpoint",
    name: "Bài giảng giáo dục hiện đại",
    englishName: "Modern Classroom",
    category: "primary",
    categoryLabel: "Giáo dục tiểu học",
    description: "Bộ slide xanh dương tươi sáng, nhịp điệu rõ ràng, phù hợp bài giảng tiểu học và THCS.",
    subjects: "Toán · Tiếng Việt · Khoa học",
    levels: ["Tiểu học", "THCS"],
    levelKeys: ["primary", "thcs"],
    gradeRange: "Lớp 2–7",
    grade: 3,
    subject: "Toán",
    tags: ["hiện đại", "xanh dương", "toán 3", "bài giảng"],
    thumb: { layout: "modern", note: "9 slide · 16:9" },
    theme: {
      name: "Modern Classroom", accent: "#2563eb", accent2: "#f59e0b", soft: "#eff6ff",
      line: "#bfdbfe", ink: "#1e293b", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1d4ed8", heroText: "#ffffff", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "modern", pattern: "modern",
    },
    title: "CHU VI HÌNH CHỮ NHẬT",
    css: `.slide:first-child h1 { font-size: 48px; } .slide h2 { letter-spacing: .01em; }`,
    slides: [
      { type: "title", title: "CHU VI HÌNH CHỮ NHẬT", subtitle: "Toán lớp 3 · Bài 47 · Cùng học qua hình ảnh và ví dụ thực tế" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nhận biết được hình chữ nhật và các yếu tố chiều dài, chiều rộng.",
          "Nắm được công thức tính chu vi hình chữ nhật.",
          "Vận dụng công thức để giải bài toán có tình huống thực tế.",
          "Rèn luyện kỹ năng quan sát, đo đạc và trình bày lời giải.",
        ],
      },
      {
        type: "content",
        title: "Khởi động: Quan sát quanh em",
        content: [
          "Khung ảnh treo tường có dạng hình gì?",
          "Viên gạch lát nền có mấy cạnh? Các cạnh có gì đặc biệt?",
          "Sân trường của em có dạng hình chữ nhật không?",
          "Muốn biết đường viền xung quanh một vật dài bao nhiêu, em làm thế nào?",
        ],
      },
      {
        type: "content",
        title: "Kiến thức trọng tâm",
        content: [
          "Hình chữ nhật có 4 cạnh: hai cạnh dài bằng nhau, hai cạnh ngắn bằng nhau.",
          "Chiều dài thường kí hiệu là a, chiều rộng kí hiệu là b.",
          "Chu vi hình chữ nhật bằng tổng độ dài bốn cạnh.",
          "Công thức: P = (a + b) × 2, cùng một đơn vị đo.",
        ],
      },
      {
        type: "two-column",
        title: "Ví dụ minh họa",
        left: [
          "Ví dụ 1: Hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm.",
          "Chu vi: P = (8 + 5) × 2 = 26 cm.",
          "Đáp số: 26 cm.",
        ],
        right: [
          "Ví dụ 2: Sân trường dài 12 m, rộng 7 m.",
          "Chu vi: P = (12 + 7) × 2 = 38 m.",
          "Đáp số: 38 m.",
        ],
      },
      { type: "image", title: "Hình ảnh thực tế", src: modernClassroomImg, caption: "Vận dụng chu vi vào đo đạc và trang trí không gian học tập." },
      {
        type: "table",
        title: "Luyện tập nhanh",
        rows: [
          ["Hình chữ nhật", "Chiều dài", "Chiều rộng", "Chu vi"],
          ["A", "6 cm", "3 cm", "?"],
          ["B", "10 m", "4 m", "?"],
          ["C", "15 cm", "8 cm", "?"],
        ],
      },
      {
        type: "content",
        title: "Lỗi thường gặp",
        content: [
          "Chỉ cộng chiều dài và chiều rộng mà quên nhân với 2.",
          "Đổi đơn vị chưa đúng trước khi tính.",
          "Nhầm công thức chu vi với công thức diện tích.",
          "Ghi đáp số thiếu đơn vị đo.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết bài học",
        content: [
          "Chu vi hình chữ nhật: P = (a + b) × 2.",
          "Luôn kiểm tra cùng đơn vị đo trước khi tính.",
          "Vận dụng vào đo đạc thực tế để thấy toán học gần gũi.",
          "Nhiệm vụ về nhà: hoàn thành bài 1, 2, 3 trang 42 SGK.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-science-discovery",
    type: "powerpoint",
    name: "Bài giảng khoa học và khám phá",
    englishName: "Science & Discovery",
    category: "science",
    categoryLabel: "Khoa học",
    description: "Thiết kế xanh ngọc, sơ đồ quy trình và thí nghiệm trực quan cho bài học khoa học tự nhiên.",
    subjects: "Khoa học tự nhiên · Sinh học · Hóa học",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 8,
    subject: "Khoa học tự nhiên",
    tags: ["khoa học", "quang hợp", "thí nghiệm", "sơ đồ"],
    thumb: { layout: "science", note: "9 slide · 16:9" },
    theme: {
      name: "Science Discovery", accent: "#0e7490", accent2: "#f59e0b", soft: "#ecfeff",
      line: "#a5f3fc", ink: "#0f172a", muted: "#64748b", bg: "#f8fafc",
      heroBg: "#083344", heroText: "#ecfeff", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "science", pattern: "science",
    },
    title: "QUANG HỢP Ở THỰC VẬT",
    css: `.slide h2 { border-left: 5px solid #0e7490; padding-left: 12px; }`,
    slides: [
      { type: "title", title: "QUANG HỢP Ở THỰC VẬT", subtitle: "Khoa học tự nhiên 8 · Chủ đề: Trao đổi chất và chuyển hóa năng lượng" },
      {
        type: "content",
        title: "Câu hỏi khám phá",
        content: [
          "Vì sao lá cây thường có màu xanh?",
          "Cây lấy thức ăn từ đâu để lớn lên?",
          "Điều gì sẽ xảy ra nếu Trái Đất không còn cây xanh?",
          "Làm thế nào để chứng minh quang hợp cần ánh sáng?",
        ],
      },
      {
        type: "content",
        title: "Quang hợp là gì?",
        content: [
          "Quang hợp là quá trình thực vật dùng năng lượng ánh sáng để tổng hợp chất hữu cơ.",
          "Diễn ra chủ yếu ở lá cây, trong lục lạp.",
          "Nguyên liệu: nước, khí carbonic và ánh sáng.",
          "Sản phẩm: glucose, oxygen và một phần nước.",
        ],
      },
      {
        type: "two-column",
        title: "Nguyên liệu và sản phẩm",
        left: [
          "Nguyên liệu đầu vào:",
          "• Nước từ rễ cây",
          "• Khí carbonic từ không khí",
          "• Năng lượng ánh sáng mặt trời",
          "• Diệp lục trong lục lạp",
        ],
        right: [
          "Sản phẩm đầu ra:",
          "• Chất hữu cơ (glucose)",
          "• Khí oxygen",
          "• Nước",
          "• Năng lượng hóa học tích lũy",
        ],
      },
      {
        type: "table",
        title: "Hai pha của quang hợp",
        rows: [
          ["Giai đoạn", "Nơi diễn ra", "Điều kiện", "Sản phẩm chính"],
          ["Pha sáng", "Màng lục lạp", "Cần ánh sáng", "Oxygen, năng lượng"],
          ["Pha tối", "Chất nền lục lạp", "Không cần ánh sáng trực tiếp", "Chất hữu cơ"],
        ],
      },
      { type: "image", title: "Sơ đồ quang hợp", src: scienceDiscoveryImg, caption: "Lá cây hấp thụ ánh sáng, nước và CO₂ để tạo ra chất hữu cơ và oxygen." },
      {
        type: "content",
        title: "Thí nghiệm nhỏ: Cần ánh sáng không?",
        content: [
          "Chuẩn bị hai chậu cây cùng loại, cùng kích thước.",
          "Chậu A đặt nơi có ánh sáng, chậu B đặt trong tối.",
          "Tưới nước đều và quan sát sau 5–7 ngày.",
          "So sánh màu lá, tốc độ sinh trưởng và giải thích kết quả.",
        ],
      },
      {
        type: "content",
        title: "Vì sao rừng quan trọng?",
        content: [
          "Rừng cung cấp oxygen và hấp thụ carbonic.",
          "Rừng điều hòa khí hậu, giảm xói mòn đất.",
          "Rừng là nơi sống của nhiều loài sinh vật.",
          "Bảo vệ rừng là bảo vệ sự sống của chính chúng ta.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết và vận dụng",
        content: [
          "Quang hợp tạo chất hữu cơ và oxygen cho sự sống.",
          "Ánh sáng, nước và CO₂ là nguyên liệu thiết yếu.",
          "Hãy quan sát cây xanh quanh em và ghi lại một hiện tượng thú vị.",
          "Nhiệm vụ: hoàn thành sơ đồ quang hợp vào vở học tập.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-minimal-academic",
    type: "powerpoint",
    name: "Bài giảng tối giản cao cấp",
    englishName: "Minimal Academic",
    category: "academic",
    categoryLabel: "Bài giảng học thuật",
    description: "Phong cách tối giản đen trắng, tập trung vào nội dung học thuật, phân tích và thảo luận.",
    subjects: "Ngữ văn · Lịch sử · Triết học",
    levels: ["THCS", "THPT", "Đại học"],
    levelKeys: ["thcs", "thpt", "university"],
    gradeRange: "Lớp 9–12 & Đại học",
    grade: 10,
    subject: "Ngữ văn",
    tags: ["tối giản", "ngữ văn", "học thuật", "truyện ngắn"],
    thumb: { layout: "minimal", note: "9 slide · 16:9" },
    theme: {
      name: "Minimal Academic", accent: "#1e293b", accent2: "#64748b", soft: "#f1f5f9",
      line: "#cbd5e1", ink: "#0f172a", muted: "#64748b", bg: "#ffffff",
      heroBg: "#0f172a", heroText: "#f8fafc", font: "Georgia", displayFont: "Georgia",
      variant: "minimal", pattern: "minimal",
    },
    title: "TRUYỆN NGẮN HIỆN ĐẠI VIỆT NAM",
    css: `.slide h2 { font-family: Georgia, serif; font-weight: 400; letter-spacing: .01em; } .slide { border: 1px solid #e2e8f0; }`,
    slides: [
      { type: "title", title: "TRUYỆN NGẮN HIỆN ĐẠI VIỆT NAM", subtitle: "Ngữ văn 10 · Bài 4 · Hành trình khám phá con người và thời đại" },
      {
        type: "content",
        title: "Mục tiêu học tập",
        content: [
          "Nhận diện đặc điểm của truyện ngắn hiện đại Việt Nam.",
          "Phân tích được nhân vật, tình huống và giọng điệu trần thuật.",
          "Hiểu mối quan hệ giữa văn học và bối cảnh lịch sử.",
          "Rèn luyện kỹ năng viết đoạn văn nghị luận văn học.",
        ],
      },
      {
        type: "content",
        title: "Bối cảnh văn học",
        content: [
          "Truyện ngắn hiện đại Việt Nam phát triển mạnh từ đầu thế kỉ XX.",
          "Chịu ảnh hưởng của văn học phương Tây và truyền thống dân tộc.",
          "Phản ánh những biến đổi của xã hội và con người Việt Nam.",
          "Đề tài phong phú: nông thôn, đô thị, chiến tranh, đổi mới.",
        ],
      },
      {
        type: "two-column",
        title: "Đặc điểm thể loại",
        left: [
          "Hình thức:",
          "• Ngắn gọn, ít nhân vật",
          "• Tình huống truyện giàu kịch tính",
          "• Kết cấu chặt chẽ",
        ],
        right: [
          "Nội dung:",
          "• Khám phá đời sống tâm hồn",
          "• Phản ánh hiện thực xã hội",
          "• Gửi gắm thông điệp nhân văn",
        ],
      },
      {
        type: "content",
        title: "Tác phẩm tiêu biểu",
        content: [
          "Nam Cao — Chí Phèo, Lão Hạc: nỗi đau và khát vọng làm người.",
          "Thạch Lam — Gió lạnh đầu mùa: vẻ đẹp của tình người.",
          "Nguyễn Minh Châu — Chiếc thuyền ngoài xa: sự thật và nghệ thuật.",
          "Kim Lân — Vợ nhặt: sức sống và khát vọng hạnh phúc.",
        ],
      },
      {
        type: "image",
        title: "Trang văn và ký ức",
        src: minimalAcademicImg,
        caption: "Mỗi truyện ngắn là một lát cắt của đời sống, mở ra những tầng nghĩa phía sau con chữ.",
      },
      {
        type: "table",
        title: "So sánh hai tác phẩm",
        rows: [
          ["Tiêu chí", "Chí Phèo", "Chiếc thuyền ngoài xa"],
          ["Bối cảnh", "Nông thôn trước Cách mạng", "Làng chài miền Trung sau 1975"],
          ["Nhân vật", "Chí Phèo, Thị Nở", "Người đàn bà, Phùng, Đẩu"],
          ["Xung đột", "Con người bị tha hóa", "Nghệ thuật và hiện thực"],
          ["Thông điệp", "Khát vọng làm người", "Nhìn thẳng vào sự thật"],
        ],
      },
      {
        type: "content",
        title: "Câu hỏi thảo luận",
        content: [
          "Vì sao nhân vật Chí Phèo vừa đáng trách vừa đáng thương?",
          "Tình huống truyện có vai trò gì trong việc bộc lộ tính cách nhân vật?",
          "Em hiểu thế nào về mối quan hệ giữa văn học và hiện thực?",
          "Chi tiết nào trong tác phẩm để lại ấn tượng sâu sắc nhất với em?",
        ],
      },
      {
        type: "summary",
        title: "Kết luận",
        content: [
          "Truyện ngắn hiện đại phản ánh con người và thời đại một cách sâu sắc.",
          "Đọc truyện ngắn là đọc những tầng nghĩa ẩn sau câu chữ.",
          "Hãy viết một đoạn văn 200 chữ phân tích một chi tiết em tâm đắc.",
          "Chuẩn bị cho tiết học sau: thuyết trình nhóm về một tác phẩm.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-kids-learning",
    type: "powerpoint",
    name: "Bài giảng sáng tạo cho học sinh tiểu học",
    englishName: "Kids Learning",
    category: "primary",
    categoryLabel: "Giáo dục tiểu học",
    description: "Thiết kế cam vàng vui nhộn, chữ lớn, hình khối mềm mại, phù hợp tiết học tiểu học.",
    subjects: "Tiếng Việt · Toán · Tự nhiên và Xã hội",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 1–5",
    grade: 2,
    subject: "Tiếng Việt",
    tags: ["tiểu học", "vui nhộn", "từ chỉ sự vật", "tiếng việt 2"],
    thumb: { layout: "kids", note: "9 slide · 16:9" },
    theme: {
      name: "Kids Learning", accent: "#f97316", accent2: "#facc15", soft: "#fff7ed",
      line: "#fed7aa", ink: "#4a2c12", muted: "#b45309", bg: "#fffbf5",
      heroBg: "#fb923c", heroText: "#fff7ed", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "kids", pattern: "kids",
    },
    title: "TỪ CHỈ SỰ VẬT",
    css: `.slide:first-child h1 { text-shadow: 2px 3px 0 rgba(255,255,255,.35); } .slide h2 { color: #7c2d12; }`,
    slides: [
      { type: "title", title: "TỪ CHỈ SỰ VẬT", subtitle: "Tiếng Việt lớp 2 · Cùng bé khám phá thế giới từ ngữ" },
      {
        type: "content",
        title: "Chào mừng các em!",
        content: [
          "Hôm nay chúng ta sẽ cùng nhau khám phá một kho báu từ ngữ.",
          "Các em đã sẵn sàng chưa?",
          "Hãy nhìn quanh lớp học và kể tên những đồ vật em thấy.",
          "Mỗi đồ vật, con vật, cây cối đều có tên gọi riêng.",
        ],
      },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nhận biết được từ chỉ sự vật.",
          "Tìm được từ chỉ sự vật trong câu và trong tranh.",
          "Đặt được câu ngắn có từ chỉ sự vật.",
          "Yêu thích tiếng Việt và biết quan sát thế giới xung quanh.",
        ],
      },
      {
        type: "two-column",
        title: "Cùng quan sát",
        left: [
          "Trong lớp học:",
          "• bảng",
          "• bàn",
          "• ghế",
          "• cửa sổ",
          "• quyển sách",
        ],
        right: [
          "Ngoài sân trường:",
          "• cây bàng",
          "• bông hoa",
          "• con mèo",
          "• chiếc xe đạp",
          "• quả bóng",
        ],
      },
      { type: "image", title: "Thẻ từ vui nhộn", src: kidsLearningImg, caption: "Bé hãy chỉ vào hình và đọc to tên gọi của sự vật." },
      {
        type: "table",
        title: "Trò chơi ghép từ",
        rows: [
          ["Từ chỉ sự vật", "Nơi em thường thấy", "Đặc điểm"],
          ["cái bàn", "lớp học", "làm bằng gỗ"],
          ["con mèo", "trong nhà", "kêu meo meo"],
          ["bông hoa", "sân vườn", "có màu đỏ"],
          ["quyển sách", "thư viện", "có nhiều chữ"],
        ],
      },
      {
        type: "content",
        title: "Luyện tập cùng bé",
        content: [
          "Tìm 3 từ chỉ sự vật có trong bài thơ em đã học.",
          "Đặt câu: “Trong lớp học có ……………”.",
          "Khoanh tròn từ chỉ sự vật: bàn, chạy, mèo, xanh, hoa.",
          "Vẽ một sự vật em yêu thích và viết tên dưới hình.",
        ],
      },
      {
        type: "summary",
        title: "Lời kết",
        content: [
          "Từ chỉ sự vật là những từ gọi tên đồ vật, con vật, cây cối, người.",
          "Thế giới quanh em có rất nhiều sự vật đáng yêu.",
          "Hãy tiếp tục quan sát và ghi lại những từ mới nhé!",
        ],
      },
      {
        type: "content",
        title: "Dặn dò",
        content: [
          "Hoàn thành phiếu bài tập “Từ chỉ sự vật”.",
          "Tìm thêm 5 từ chỉ sự vật trong gia đình.",
          "Chuẩn bị bài sau: Từ chỉ hoạt động.",
          "Chúc các em học vui và nhớ bài thật tốt!",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-history-geography",
    type: "powerpoint",
    name: "Bài giảng lịch sử và địa lý",
    englishName: "History & Geography",
    category: "history",
    categoryLabel: "Lịch sử và địa lý",
    description: "Tông giấy cổ, bản đồ và mốc thời gian giúp bài học lịch sử, địa lý trở nên sống động.",
    subjects: "Lịch sử · Địa lý · Giáo dục công dân",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 9,
    subject: "Lịch sử và Địa lý",
    tags: ["lịch sử", "địa lý", "điện biên phủ", "bản đồ"],
    thumb: { layout: "history", note: "9 slide · 16:9" },
    theme: {
      name: "History & Geography", accent: "#6b4f2a", accent2: "#4d7c0f", soft: "#f5efe2",
      line: "#d6c6a8", ink: "#2f2416", muted: "#7c6a4d", bg: "#fffdf7",
      heroBg: "#3f2d1a", heroText: "#fff7e6", font: "Georgia", displayFont: "Georgia",
      variant: "history", pattern: "history",
    },
    title: "CHIẾN DỊCH ĐIỆN BIÊN PHỦ",
    css: `.slide h2 { border-bottom: 2px solid #d6c6a8; padding-bottom: 6px; } .slide { background: #fffdf7; }`,
    slides: [
      { type: "title", title: "CHIẾN DỊCH ĐIỆN BIÊN PHỦ", subtitle: "Lịch sử 9 · 13/3 – 7/5/1954 · Một mốc son của dân tộc" },
      {
        type: "content",
        title: "Bối cảnh lịch sử",
        content: [
          "Sau thất bại ở chiến dịch biên giới, thực dân Pháp tăng cường chiếm đóng.",
          "Điện Biên Phủ được xây dựng thành tập đoàn cứ điểm mạnh nhất Đông Dương.",
          "Quân dân Việt Nam chuẩn bị cho một trận quyết chiến chiến lược.",
          "Nhiệm vụ: tiêu diệt tập đoàn cứ điểm, giải phóng vùng Tây Bắc.",
        ],
      },
      {
        type: "content",
        title: "Vị trí chiến lược",
        content: [
          "Điện Biên Phủ nằm ở phía Tây Bắc Việt Nam, gần biên giới Lào.",
          "Là thung lũng rộng, được bao quanh bởi đồi núi hiểm trở.",
          "Có vị trí quan trọng trong kế hoạch quân sự của cả hai bên.",
          "Địa hình phức tạp tạo thách thức lớn cho công tác vận tải và tác chiến.",
        ],
      },
      {
        type: "content",
        title: "Diễn biến chính",
        content: [
          "13/3/1954: mở màn chiến dịch, tiêu diệt cứ điểm Him Lam.",
          "15–17/3: tiêu diệt cứ điểm Độc Lập và đồi A1.",
          "Tháng 4/1954: xiết chặt vòng vây, đánh chiếm các cứ điểm phía đông.",
          "7/5/1954: tấn công vào sở chỉ huy, chiến dịch toàn thắng.",
        ],
      },
      {
        type: "table",
        title: "Các mốc quan trọng",
        rows: [
          ["Thời gian", "Sự kiện", "Ý nghĩa"],
          ["13/3/1954", "Đánh Him Lam", "Mở màn chiến dịch"],
          ["30/3/1954", "Đợt tấn công thứ hai", "Mở rộng vòng vây"],
          ["1/5/1954", "Đợt tấn công thứ ba", "Quyết định thắng lợi"],
          ["7/5/1954", "Chiến dịch kết thúc", "Điện Biên Phủ được giải phóng"],
        ],
      },
      { type: "image", title: "Tư liệu lịch sử", src: historyGeographyImg, caption: "Bản đồ chiến dịch và những điểm cao lịch sử ở Điện Biên Phủ." },
      {
        type: "content",
        title: "Nguyên nhân thắng lợi",
        content: [
          "Sự lãnh đạo đúng đắn, sáng tạo của Đảng và Chủ tịch Hồ Chí Minh.",
          "Tinh thần đoàn kết, anh dũng của quân và dân ta.",
          "Hậu phương vững chắc, sức mạnh của cả dân tộc.",
          "Sự giúp đỡ của bạn bè quốc tế và nhân dân tiến bộ.",
        ],
      },
      {
        type: "content",
        title: "Ý nghĩa lịch sử",
        content: [
          "Đập tan kế hoạch quân sự lớn nhất của thực dân Pháp.",
          "Góp phần kết thúc chiến tranh, lập lại hòa bình ở Đông Dương.",
          "Cổ vũ phong trào giải phóng dân tộc trên thế giới.",
          "Khẳng định bản lĩnh và trí tuệ của dân tộc Việt Nam.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết",
        content: [
          "Điện Biên Phủ là chiến thắng lịch sử, biểu tượng của ý chí và trí tuệ.",
          "Học lịch sử để hiểu quá khứ, trân trọng hiện tại và xây dựng tương lai.",
          "Em hãy kể lại chiến dịch trong 5 câu ngắn gọn.",
          "Chuẩn bị bài sau: Hiệp định Giơ-ne-vơ năm 1954.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-math-visualization",
    type: "powerpoint",
    name: "Bài giảng toán học trực quan",
    englishName: "Math Visualization",
    category: "math",
    categoryLabel: "Toán học",
    description: "Nền lưới, công thức và hình khối trực quan giúp học sinh hiểu bản chất thay vì học thuộc.",
    subjects: "Toán · Đại số · Hình học",
    levels: ["Tiểu học", "THCS", "THPT"],
    levelKeys: ["primary", "thcs", "thpt"],
    gradeRange: "Lớp 4–12",
    grade: 8,
    subject: "Toán",
    tags: ["toán học", "hằng đẳng thức", "trực quan", "công thức"],
    thumb: { layout: "math", note: "9 slide · 16:9" },
    theme: {
      name: "Math Visualization", accent: "#4f46e5", accent2: "#f59e0b", soft: "#eef2ff",
      line: "#c7d2fe", ink: "#1e1b4b", muted: "#6366f1", bg: "#ffffff",
      heroBg: "#4338ca", heroText: "#eef2ff", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "math", pattern: "math",
    },
    title: "HẰNG ĐẲNG THỨC ĐÁNG NHỚ",
    css: `.slide { background-image: linear-gradient(#eef2ff 1px, transparent 1px), linear-gradient(90deg, #eef2ff 1px, transparent 1px); background-size: 34px 34px; } .slide h2 { background: #eef2ff; display: inline-block; padding: 4px 12px; border-radius: 8px; }`,
    slides: [
      { type: "title", title: "HẰNG ĐẲNG THỨC ĐÁNG NHỚ", subtitle: "Toán 8 · Đại số · Hiểu bằng hình ảnh — nhớ bằng bản chất" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nhận biết ba hằng đẳng thức đáng nhớ cơ bản.",
          "Hiểu ý nghĩa hình học của hằng đẳng thức bình phương của một tổng.",
          "Vận dụng linh hoạt để khai triển và rút gọn biểu thức.",
          "Tránh các lỗi thường gặp khi biến đổi đại số.",
        ],
      },
      {
        type: "content",
        title: "Ba hằng đẳng thức cơ bản",
        content: [
          "(a + b)² = a² + 2ab + b²",
          "(a − b)² = a² − 2ab + b²",
          "a² − b² = (a − b)(a + b)",
          "Ghi nhớ: bình phương + gấp đôi tích + bình phương.",
        ],
      },
      {
        type: "two-column",
        title: "Giải thích trực quan",
        left: [
          "Hình vuông lớn có cạnh (a + b).",
          "Diện tích = (a + b)².",
          "Hình vuông được chia thành 4 phần.",
          "Tổng diện tích 4 phần = a² + ab + ab + b².",
        ],
        right: [
          "Vậy (a + b)² = a² + 2ab + b².",
          "Khi a = 3, b = 2:",
          "(3 + 2)² = 25.",
          "3² + 2·3·2 + 2² = 9 + 12 + 4 = 25.",
        ],
      },
      {
        type: "image",
        title: "Minh họa trực quan",
        src: mathVisualizationImg,
        caption: "Hình vuông cạnh (a + b) được chia thành bốn phần: a², ab, ab và b².",
      },
      {
        type: "content",
        title: "Ví dụ 1 — Khai triển",
        content: [
          "(x + 3)² = x² + 2·x·3 + 3² = x² + 6x + 9.",
          "(2a − 5)² = 4a² − 20a + 25.",
          "(x + y)(x − y) = x² − y².",
          "Kiểm tra lại bằng cách thay giá trị cụ thể.",
        ],
      },
      {
        type: "content",
        title: "Ví dụ 2 — Rút gọn",
        content: [
          "Rút gọn: (x + 2)² − (x − 2)².",
          "= (x² + 4x + 4) − (x² − 4x + 4).",
          "= 8x.",
          "Nhận xét: hiệu hai bình phương giúp tính nhanh hơn.",
        ],
      },
      {
        type: "table",
        title: "Luyện tập",
        rows: [
          ["Biểu thức", "Dạng hằng đẳng thức", "Kết quả"],
          ["(x + 4)²", "Bình phương của một tổng", "?"],
          ["(3a − 1)²", "Bình phương của một hiệu", "?"],
          ["y² − 9", "Hiệu hai bình phương", "?"],
          ["(m + n)(m − n)", "Hiệu hai bình phương", "?"],
        ],
      },
      {
        type: "content",
        title: "Lỗi thường gặp",
        content: [
          "(a + b)² không bằng a² + b².",
          "Quên nhân đôi tích khi khai triển bình phương.",
          "Nhầm dấu khi mở ngoặc biểu thức có dấu trừ.",
          "Không kiểm tra lại bằng cách thay số hoặc khai triển ngược.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết",
        content: [
          "Ba hằng đẳng thức giúp biến đổi biểu thức nhanh và chính xác.",
          "Hiểu bằng hình ảnh giúp ghi nhớ lâu hơn.",
          "Hoàn thành bài tập 1–4 trang 28 SGK.",
          "Chuẩn bị tiết sau: Luyện tập hằng đẳng thức.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-language-learning",
    type: "powerpoint",
    name: "Bài giảng ngôn ngữ",
    englishName: "Language Learning",
    category: "language",
    categoryLabel: "Ngôn ngữ",
    description: "Bong bóng hội thoại, bảng cấu trúc và ví dụ song ngữ giúp tiết ngoại ngữ sinh động.",
    subjects: "Tiếng Anh · Tiếng Việt · Ngoại ngữ",
    levels: ["THCS", "THPT"],
    levelKeys: ["thcs", "thpt"],
    gradeRange: "Lớp 6–12",
    grade: 8,
    subject: "Tiếng Anh",
    tags: ["tiếng anh", "ngữ pháp", "present perfect", "hội thoại"],
    thumb: { layout: "language", note: "9 slide · 16:9" },
    theme: {
      name: "Language Learning", accent: "#7c3aed", accent2: "#06b6d4", soft: "#f5f3ff",
      line: "#ddd6fe", ink: "#2e1065", muted: "#6d28d9", bg: "#ffffff",
      heroBg: "#6d28d9", heroText: "#faf5ff", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "language", pattern: "language",
    },
    title: "PRESENT PERFECT",
    css: `.slide h2 { color: #6d28d9; } .slide:first-child h1 { letter-spacing: .01em; }`,
    slides: [
      { type: "title", title: "PRESENT PERFECT", subtitle: "Tiếng Anh 8 · Unit 5 · Talking about experiences" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Hiểu cấu trúc và cách dùng thì hiện tại hoàn thành.",
          "Phân biệt hiện tại hoàn thành với quá khứ đơn.",
          "Sử dụng đúng các trạng từ: ever, never, already, yet, since, for.",
          "Tự tin nói về trải nghiệm của bản thân.",
        ],
      },
      {
        type: "content",
        title: "Cấu trúc",
        content: [
          "Khẳng định: S + have/has + V3/ed.",
          "Phủ định: S + have/has + not + V3/ed.",
          "Nghi vấn: Have/Has + S + V3/ed?",
          "Ví dụ: I have visited Hue twice.",
        ],
      },
      {
        type: "two-column",
        title: "Ví dụ hội thoại",
        left: [
          "A: Have you ever been to Hue?",
          "B: Yes, I have. It was amazing!",
          "A: When did you go there?",
          "B: I went there last summer.",
        ],
        right: [
          "A: Bạn đã từng đến Huế chưa?",
          "B: Rồi, mình đã đến. Chuyến đi tuyệt lắm!",
          "A: Bạn đi khi nào?",
          "B: Mình đi vào mùa hè năm ngoái.",
        ],
      },
      {
        type: "content",
        title: "Dấu hiệu nhận biết",
        content: [
          "ever / never: hỏi hoặc nói về trải nghiệm.",
          "already / yet: hành động đã hoặc chưa hoàn thành.",
          "since + mốc thời gian; for + khoảng thời gian.",
          "just / recently / so far: hành động vừa mới hoặc tính đến nay.",
        ],
      },
      {
        type: "table",
        title: "Phân biệt hai thì",
        rows: [
          ["Tiêu chí", "Present Perfect", "Past Simple"],
          ["Thời gian", "Không xác định, liên quan hiện tại", "Xác định trong quá khứ"],
          ["Dấu hiệu", "ever, never, since, for", "yesterday, last week, in 2020"],
          ["Ví dụ", "I have seen this film.", "I saw this film yesterday."],
          ["Nhấn mạnh", "Kết quả/trải nghiệm", "Thời điểm hành động"],
        ],
      },
      { type: "image", title: "Trải nghiệm và hội thoại", src: languageLearningImg, caption: "Dùng Present Perfect để kể về những trải nghiệm đáng nhớ." },
      {
        type: "content",
        title: "Luyện tập",
        content: [
          "Chia động từ: I (never/be) ______ to Da Nang.",
          "Viết câu hỏi với “ever”: you / try / Vietnamese food?",
          "Hoàn thành câu: She (live) ______ here since 2020.",
          "Nói 3 câu về trải nghiệm của em bằng thì hiện tại hoàn thành.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết",
        content: [
          "Present Perfect diễn tả trải nghiệm và hành động liên quan hiện tại.",
          "Cấu trúc: have/has + V3/ed.",
          "Phân biệt rõ với Past Simple qua dấu hiệu thời gian.",
          "Nhiệm vụ: viết đoạn 5 câu về nơi em đã từng đến.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-educational-infographic",
    type: "powerpoint",
    name: "Bài giảng dạng infographic",
    englishName: "Educational Infographic",
    category: "infographic",
    categoryLabel: "Infographic",
    description: "Bố cục infographic với số liệu, quy trình và khối màu, phù hợp tổng hợp kiến thức trực quan.",
    subjects: "Khoa học · Địa lý · Giáo dục môi trường",
    levels: ["THCS", "THPT", "Không giới hạn"],
    levelKeys: ["thcs", "thpt", "unlimited"],
    gradeRange: "Mọi cấp học",
    grade: 7,
    subject: "Khoa học",
    tags: ["infographic", "vòng tuần hoàn", "nước", "trực quan"],
    thumb: { layout: "infographic", note: "9 slide · 16:9" },
    theme: {
      name: "Educational Infographic", accent: "#0f766e", accent2: "#ea580c", soft: "#f0fdfa",
      line: "#99f6e4", ink: "#134e4a", muted: "#0f766e", bg: "#ffffff",
      heroBg: "#115e59", heroText: "#f0fdfa", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "infographic", pattern: "infographic",
    },
    title: "VÒNG TUẦN HOÀN CỦA NƯỚC",
    css: `.slide h2 { background: #ccfbf1; display: inline-block; padding: 4px 14px; border-radius: 999px; color: #115e59; }`,
    slides: [
      { type: "title", title: "VÒNG TUẦN HOÀN CỦA NƯỚC", subtitle: "Khoa học 7 · Nước không mất đi, nước chỉ chuyển từ thể này sang thể khác" },
      {
        type: "content",
        title: "Bức tranh tổng thể",
        content: [
          "Nước tồn tại ở ba thể: rắn, lỏng và khí.",
          "Nước di chuyển liên tục giữa đại dương, khí quyển và lục địa.",
          "Năng lượng mặt trời là động lực chính của vòng tuần hoàn.",
          "Vòng tuần hoàn giúp duy trì nguồn nước ngọt cho sự sống.",
        ],
      },
      {
        type: "content",
        title: "4 giai đoạn chính",
        content: [
          "Bốc hơi: nước từ biển, sông, hồ chuyển thành hơi nước.",
          "Ngưng tụ: hơi nước gặp lạnh tạo thành những hạt nước nhỏ trong mây.",
          "Mưa: các hạt nước kết hợp và rơi xuống mặt đất.",
          "Dòng chảy: nước chảy theo sông, suối hoặc thấm xuống đất trở về biển.",
        ],
      },
      { type: "image", title: "Infographic vòng tuần hoàn", src: educationalInfographicImg, caption: "Bốn giai đoạn chính của vòng tuần hoàn nước trong tự nhiên." },
      {
        type: "table",
        title: "Tóm tắt quy trình",
        rows: [
          ["Giai đoạn", "Tác nhân chính", "Kết quả"],
          ["Bốc hơi", "Năng lượng mặt trời", "Hơi nước đi vào khí quyển"],
          ["Ngưng tụ", "Nhiệt độ giảm", "Mây được hình thành"],
          ["Mưa", "Hơi nước bão hòa", "Nước trở về mặt đất"],
          ["Dòng chảy", "Trọng lực", "Nước về sông, biển"],
        ],
      },
      {
        type: "content",
        title: "Số liệu đáng chú ý",
        content: [
          "Khoảng 71% bề mặt Trái Đất được bao phủ bởi nước.",
          "Chỉ khoảng 2,5% lượng nước trên Trái Đất là nước ngọt.",
          "Phần lớn nước ngọt đang bị đóng băng ở hai cực.",
          "Tiết kiệm nước là trách nhiệm của mỗi người.",
        ],
      },
      {
        type: "content",
        title: "Vai trò với sự sống",
        content: [
          "Nước tham gia vào hầu hết phản ứng sinh hóa trong cơ thể.",
          "Nước điều hòa nhiệt độ Trái Đất.",
          "Nước là môi trường sống của nhiều loài sinh vật.",
          "Thiếu nước sạch ảnh hưởng trực tiếp đến sức khỏe cộng đồng.",
        ],
      },
      {
        type: "content",
        title: "Hành động nhỏ, ý nghĩa lớn",
        content: [
          "Tắt vòi nước khi không sử dụng.",
          "Sửa chữa đường ống rò rỉ kịp thời.",
          "Tái sử dụng nước cho cây trồng và vệ sinh.",
          "Tuyên truyền bảo vệ nguồn nước đến gia đình và bạn bè.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết",
        content: [
          "Nước tuần hoàn liên tục qua bốn giai đoạn chính.",
          "Nước là tài nguyên quý giá nhưng hữu hạn.",
          "Mỗi hành động tiết kiệm nước hôm nay là món quà cho tương lai.",
          "Nhiệm vụ: vẽ lại vòng tuần hoàn nước bằng sơ đồ tư duy.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-professional-academic",
    type: "powerpoint",
    name: "Bài giảng báo cáo và chuyên đề",
    englishName: "Professional Academic Report",
    category: "report",
    categoryLabel: "Báo cáo chuyên đề",
    description: "Phong cách báo cáo chuyên nghiệp với số liệu, biểu đồ, khuyến nghị và cấu trúc trình bày rõ ràng.",
    subjects: "Giáo dục · Công nghệ · Nghiên cứu",
    levels: ["THPT", "Đại học"],
    levelKeys: ["thpt", "university"],
    gradeRange: "Lớp 10–12 & Đại học",
    grade: 12,
    subject: "Nghiên cứu giáo dục",
    tags: ["báo cáo", "chuyên đề", "chuyển đổi số", "số liệu"],
    thumb: { layout: "corporate", note: "9 slide · 16:9" },
    theme: {
      name: "Professional Academic", accent: "#1e3a8a", accent2: "#0ea5e9", soft: "#eff6ff",
      line: "#bfdbfe", ink: "#0f172a", muted: "#64748b", bg: "#ffffff",
      heroBg: "#172554", heroText: "#eff6ff", font: "Be Vietnam Pro", displayFont: "Georgia",
      variant: "corporate", pattern: "corporate",
    },
    title: "CHUYỂN ĐỔI SỐ TRONG GIÁO DỤC",
    css: `.slide h2 { border-left: 6px solid #0ea5e9; padding-left: 14px; } .slide { border-top: 8px solid #1e3a8a; }`,
    slides: [
      { type: "title", title: "CHUYỂN ĐỔI SỐ TRONG GIÁO DỤC", subtitle: "Báo cáo chuyên đề · Khảo sát 120 trường học · Năm 2026" },
      {
        type: "content",
        title: "Mục lục báo cáo",
        content: [
          "1. Bối cảnh và mục tiêu nghiên cứu.",
          "2. Phương pháp khảo sát và mẫu nghiên cứu.",
          "3. Kết quả nổi bật về hạ tầng, giáo viên và học sinh.",
          "4. Thách thức và khuyến nghị chính sách.",
        ],
      },
      {
        type: "content",
        title: "Bối cảnh",
        content: [
          "Chuyển đổi số đang diễn ra mạnh mẽ trong giáo dục.",
          "Nhu cầu học tập linh hoạt và cá nhân hóa tăng cao.",
          "Hạ tầng công nghệ và kỹ năng số của giáo viên là yếu tố then chốt.",
          "Cần đánh giá thực trạng để đề xuất giải pháp phù hợp.",
        ],
      },
      {
        type: "content",
        title: "Phương pháp khảo sát",
        content: [
          "Đối tượng: 120 trường học tại 6 tỉnh thành.",
          "Thời gian: tháng 3–6/2026.",
          "Công cụ: bảng hỏi trực tuyến, phỏng vấn sâu và phân tích dữ liệu thứ cấp.",
          "Tiêu chí: hạ tầng, học liệu số, kỹ năng giáo viên, mức độ tương tác.",
        ],
      },
      {
        type: "table",
        title: "Kết quả nổi bật",
        rows: [
          ["Chỉ số", "Tỉ lệ", "Nhận xét"],
          ["Giáo viên dùng học liệu số", "86%", "Tăng mạnh so với 2023"],
          ["Lớp học có thiết bị kết nối", "72%", "Còn chênh lệch giữa khu vực"],
          ["Học sinh tham gia lớp trực tuyến", "64%", "Tăng sau giai đoạn thử nghiệm"],
          ["Giáo viên được tập huấn kỹ năng số", "58%", "Cần mở rộng quy mô"],
        ],
      },
      { type: "image", title: "Dữ liệu trực quan", src: professionalAcademicImg, caption: "Mức độ sẵn sàng chuyển đổi số của các trường trong mẫu khảo sát." },
      {
        type: "content",
        title: "Thách thức",
        content: [
          "Hạ tầng thiết bị chưa đồng đều giữa thành thị và nông thôn.",
          "Một bộ phận giáo viên còn thiếu kỹ năng thiết kế học liệu số.",
          "Chưa có quy chuẩn dữ liệu và bảo mật thông tin thống nhất.",
          "Kinh phí duy trì và nâng cấp hệ thống còn hạn chế.",
        ],
      },
      {
        type: "content",
        title: "Khuyến nghị",
        content: [
          "Đầu tư hạ tầng tối thiểu và ưu tiên các trường khó khăn.",
          "Xây dựng chương trình tập huấn kỹ năng số theo nhu cầu.",
          "Phát triển kho học liệu mở dùng chung giữa các trường.",
          "Thiết lập khung bảo mật và quản trị dữ liệu giáo dục.",
        ],
      },
      {
        type: "summary",
        title: "Kết luận",
        content: [
          "Chuyển đổi số là quá trình dài hạn, cần lộ trình và nguồn lực phù hợp.",
          "Con người và hạ tầng phải được phát triển song song.",
          "Dữ liệu khảo sát cho thấy tín hiệu tích cực nhưng còn khoảng cách.",
          "Bước tiếp theo: thử nghiệm mô hình tại 20 trường đại diện.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-storytelling-education",
    type: "powerpoint",
    name: "Bài giảng kể chuyện và khám phá",
    englishName: "Storytelling Education",
    category: "language",
    categoryLabel: "Ngôn ngữ",
    description: "Tông ấm áp như trang truyện, dẫn dắt học sinh qua câu chuyện, cảm xúc và bài học đạo đức.",
    subjects: "Đạo đức · Ngữ văn · Giáo dục công dân",
    levels: ["Tiểu học", "THCS"],
    levelKeys: ["primary", "thcs"],
    gradeRange: "Lớp 3–8",
    grade: 5,
    subject: "Đạo đức",
    tags: ["kể chuyện", "đạo đức", "trung thực", "câu chuyện"],
    thumb: { layout: "story", note: "10 slide · 16:9" },
    theme: {
      name: "Storytelling Education", accent: "#c2410c", accent2: "#eab308", soft: "#fffbeb",
      line: "#fde68a", ink: "#431407", muted: "#9a3412", bg: "#fffdf5",
      heroBg: "#7c2d12", heroText: "#fffbeb", font: "Be Vietnam Pro", displayFont: "Fredoka",
      variant: "story", pattern: "story",
    },
    title: "CHIẾC VÍ NHẶT ĐƯỢC",
    css: `.slide { background: #fffdf5; } .slide h2 { color: #9a3412; font-family: Georgia, serif; }`,
    slides: [
      { type: "title", title: "CHIẾC VÍ NHẶT ĐƯỢC", subtitle: "Đạo đức lớp 5 · Một câu chuyện nhỏ về trung thực và lòng tốt" },
      {
        type: "content",
        title: "Mở đầu",
        content: [
          "Một buổi chiều tan học, Nam và Lan cùng đi bộ qua công viên.",
          "Dưới gốc cây bàng, Nam nhìn thấy một chiếc ví màu nâu.",
          "Chiếc ví còn khá mới, bên trong có tiền và giấy tờ.",
          "Nam và Lan nhìn nhau, không biết nên làm gì.",
        ],
      },
      {
        type: "content",
        title: "Nhân vật",
        content: [
          "Nam: học sinh lớp 5, vui vẻ nhưng đôi khi bốc đồng.",
          "Lan: bạn cùng lớp, cẩn thận và biết nghĩ cho người khác.",
          "Bác Hùng: người đàn ông mất ví, đang rất lo lắng.",
          "Cô giáo Hoa: người luôn nhắc học sinh sống trung thực.",
        ],
      },
      {
        type: "content",
        title: "Tình huống",
        content: [
          "Nam nghĩ: “Hay là mình mang về, biết đâu có thể mua được món đồ mình thích?”.",
          "Lan nói: “Người mất ví chắc đang rất lo. Chúng ta nên tìm cách trả lại.”.",
          "Hai bạn nhìn thấy một tấm giấy tờ có tên và số điện thoại.",
          "Nam băn khoăn giữa việc giữ lại và trả lại.",
        ],
      },
      {
        type: "content",
        title: "Diễn biến",
        content: [
          "Lan đề nghị mang ví đến bác bảo vệ công viên nhờ giúp đỡ.",
          "Bác bảo vệ gọi điện theo số trên giấy tờ.",
          "Bác Hùng vội vàng đến, khuôn mặt đầy lo lắng.",
          "Khi nhận lại chiếc ví, bác cảm ơn hai bạn rất nhiều.",
        ],
      },
      { type: "image", title: "Khoảnh khắc đáng nhớ", src: storytellingEducationImg, caption: "Chiếc ví được trả lại dưới gốc cây bàng — nơi bài học về trung thực bắt đầu." },
      {
        type: "content",
        title: "Cảm xúc nhân vật",
        content: [
          "Nam cảm thấy hơi xấu hổ vì đã có suy nghĩ sai.",
          "Lan vui vì đã giúp được người khác.",
          "Bác Hùng nhẹ nhõm và biết ơn.",
          "Cả hai bạn hiểu rằng làm việc tốt mang lại niềm vui.",
        ],
      },
      {
        type: "content",
        title: "Bài học",
        content: [
          "Trung thực bắt đầu từ những việc nhỏ nhất.",
          "Biết nghĩ cho người khác là biểu hiện của lòng tốt.",
          "Khi làm điều đúng, em sẽ cảm thấy thanh thản và tự hào.",
          "Một hành động nhỏ có thể mang lại niềm vui lớn cho cộng đồng.",
        ],
      },
      {
        type: "content",
        title: "Câu hỏi thảo luận",
        content: [
          "Nếu em là Nam, em sẽ làm gì khi nhặt được chiếc ví?",
          "Vì sao việc trả lại tài sản cho người đánh mất là điều nên làm?",
          "Em đã từng làm việc tốt nào mà em cảm thấy tự hào?",
          "Làm thế nào để lan tỏa lòng trung thực trong lớp học?",
        ],
      },
      {
        type: "summary",
        title: "Lời kết",
        content: [
          "Câu chuyện nhắc chúng ta sống trung thực và biết quan tâm.",
          "Mỗi lựa chọn đúng đắn góp phần xây dựng cộng đồng tốt đẹp.",
          "Hãy bắt đầu từ những việc nhỏ mỗi ngày.",
          "Nhiệm vụ: viết đoạn văn kể lại một việc tốt em đã làm.",
        ],
      },
    ],
  }),
];

// ═══════════════════════════════════════════════════════════════════════
// API DANH MỤC DÙNG CHUNG
// ═══════════════════════════════════════════════════════════════════════

export const TEMPLATE_CATALOG = [...WORD_TEMPLATES, ...POWERPOINT_TEMPLATES];

export function templatesFor(docType) {
  return docType === "powerpoint" ? POWERPOINT_TEMPLATES : WORD_TEMPLATES;
}

export function getTemplate(id) {
  return TEMPLATE_CATALOG.find((t) => t.id === id) || null;
}

export function sourceForTemplate(templateOrId, mode) {
  const template = typeof templateOrId === "string" ? getTemplate(templateOrId) : templateOrId;
  if (!template) return null;
  return template.sourceFor(mode === "json" ? "json" : "html");
}

/** Tương thích API cũ: templateSourceFor("word", "html", id?). */
export function templateSourceFor(docType, mode, templateId) {
  const list = templatesFor(docType);
  const template = templateId ? getTemplate(templateId) : list[0];
  return sourceForTemplate(template || list[0], mode);
}

export function templateModel(templateOrId) {
  const template = typeof templateOrId === "string" ? getTemplate(templateOrId) : templateOrId;
  if (!template) return null;
  return template.kind === "word"
    ? wordJsonToModel(template.json)
    : presentationJsonToModel(template.json);
}


