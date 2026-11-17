// templateCatalog.js — Danh mục 30 mẫu tài liệu giảng dạy của Teacher
// Document Studio (15 Word + 15 PowerPoint).
//
// Mỗi mẫu là dữ liệu THẬT, không phải ảnh giả:
//   • json  — mô hình JSON đúng schema hiện có (kèm theme mở rộng)
//   • html  — mã HTML/CSS đầy đủ sinh từ cùng nội dung, giữ nhận diện riêng
//   • sourceFor(mode) — trả đúng mã nguồn theo chế độ soạn
//
// Nội dung mẫu viết theo đúng thể thức tài liệu giáo viên Việt Nam: giáo án
// theo cấu trúc chương trình GDPT 2018, đề kiểm tra có ma trận và đáp án,
// phiếu bài tập có bài toán thật kèm đáp án đã kiểm tra lại phép tính.
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
import englishFamilyImg from "../../assets/templates/english-family.svg";
import vietnameseReadingImg from "../../assets/templates/vietnamese-reading.svg";
import meetingMinutesImg from "../../assets/templates/meeting-minutes.svg";
import computerLabImg from "../../assets/templates/computer-lab.svg";
import writingPracticeImg from "../../assets/templates/writing-practice.svg";
import scienceExperimentImg from "../../assets/templates/science-experiment.svg";
import localPotteryImg from "../../assets/templates/local-pottery.svg";
import musicRhythmImg from "../../assets/templates/music-rhythm.svg";
import trafficSafetyImg from "../../assets/templates/traffic-safety.svg";
import homeroomBoardImg from "../../assets/templates/homeroom-board.svg";

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
  const css = `body { background: #e5e7eb; }
.slide { width: 920px; max-width: calc(100% - 32px); margin: 24px auto; padding: 44px 52px; background: #fff; border: 1px solid #d1d5db; border-radius: 0; box-shadow: 0 1px 4px rgba(0,0,0,.12); }
@media print { body { background: #fff; } .slide { box-shadow: none; margin: 0 auto 16px; max-width: 100%; border: 0; } }
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
// 15 MẪU WORD
// ═══════════════════════════════════════════════════════════════════════

export const WORD_TEMPLATES = [
  wordTemplate({
    id: "word-professional-lesson-plan",
    type: "word",
    name: "Kế hoạch bài dạy Toán 6 (GDPT 2018)",
    englishName: "Grade 6 Math Lesson Plan",
    category: "lesson-plan",
    categoryLabel: "Giáo án",
    description: "Kế hoạch bài dạy theo cấu trúc GDPT 2018: yêu cầu cần đạt, đồ dùng, tiến trình 4 hoạt động và đánh giá.",
    subjects: "Toán",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 6",
    grade: 6,
    subject: "Toán",
    pageCount: 3,
    tags: ["giáo án", "kế hoạch bài dạy", "toán 6", "phân số", "GDPT 2018"],
    thumb: { layout: "classic", note: "Times · 3 trang" },
    theme: {
      name: "Formal Navy", accent: "#1e3a5f", accent2: "#475569", soft: "#f1f5f9",
      line: "#cbd5e1", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1e3a5f", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "exam", pattern: "classic",
    },
    title: "KẾ HOẠCH BÀI DẠY — PHÂN SỐ VÀ PHÉP CHIA SỐ TỰ NHIÊN",
    header: `<div class="tpl-head"><span>PHÒNG GD&amp;ĐT QUẬN 3<br>TRƯỜNG THCS NGUYỄN HUỆ</span><span>Tổ Toán<br>Năm học 2026–2027</span></div>`,
    footer: `<div class="tpl-foot"><span>Kế hoạch bài dạy Toán 6 · Bài 12</span><span>Giáo viên: Nguyễn Thị Lan</span></div>`,
    css: `
.doc-page.tpl-word-professional-lesson-plan { padding: 54px 62px 58px; font-size: 14px; line-height: 1.6; }
.tpl-word-professional-lesson-plan .tpl-head { border-bottom: 1.5px solid #1f2937; font-size: 11px; text-transform: none; letter-spacing: 0; }
.tpl-word-professional-lesson-plan h1 { margin: 22px 0 4px; color: #1f2937; font-size: 20px; }
.tpl-word-professional-lesson-plan h1 + p { margin: 0 0 2px; text-align: center; font-weight: 700; font-size: 14.5px; }
.tpl-word-professional-lesson-plan h2 { color: #1e3a5f; border-bottom: 0; text-transform: none; letter-spacing: 0; font-size: 15px; }
.tpl-word-professional-lesson-plan table th { background: #f1f5f9; color: #1f2937; }
.tpl-word-professional-lesson-plan .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "KẾ HOẠCH BÀI DẠY" },
      { type: "paragraph", text: "Môn: Toán — Lớp 6 · Bài 12: Phân số và phép chia số tự nhiên", align: "center" },
      { type: "paragraph", text: "Tiết 36 · Tuần 12 · Thời lượng: 45 phút · Ngày dạy: Thứ Năm, 12/11/2026", align: "center" },
      {
        type: "table",
        rows: [
          ["Hạng mục", "Nội dung"],
          ["Giáo viên dạy", "Nguyễn Thị Lan"],
          ["Lớp", "6A2 — sĩ số 38 học sinh"],
          ["Sách giáo khoa", "Toán 6 — Kết nối tri thức với cuộc sống, tập một"],
          ["Thiết bị, học liệu", "Máy chiếu, 3 chiếc bánh mô hình bằng bìa, phiếu học tập in theo nhóm"],
        ],
      },
      { type: "heading", level: 2, text: "I. Yêu cầu cần đạt" },
      {
        type: "list",
        ordered: false,
        items: [
          "Năng lực toán học: Nhận biết được phân số a/b là kết quả của phép chia số tự nhiên a cho số tự nhiên b (b ≠ 0); viết được thương của phép chia hai số tự nhiên dưới dạng phân số và ngược lại.",
          "Năng lực giải quyết vấn đề: Vận dụng được phân số để giải quyết tình huống chia đều trong thực tế (chia bánh, chia nước, chia quãng đường).",
          "Phẩm chất: Chăm chỉ trong học tập; trung thực, trách nhiệm khi làm việc nhóm và báo cáo kết quả.",
        ],
      },
      { type: "heading", level: 2, text: "II. Đồ dùng dạy học" },
      {
        type: "list",
        ordered: false,
        items: [
          "Giáo viên: máy chiếu, bài trình chiếu tình huống khởi động, 3 mô hình bánh tròn bằng bìa đã chia sẵn các phần bằng nhau, phiếu học tập cho 8 nhóm.",
          "Học sinh: SGK Toán 6 tập một, vở ghi, bút màu, kéo và giấy A4 để gấp, cắt mô hình phân số.",
        ],
      },
      { type: "heading", level: 2, text: "III. Tiến trình dạy học" },
      {
        type: "table",
        rows: [
          ["Hoạt động (thời gian)", "Hoạt động của giáo viên", "Hoạt động của học sinh", "Đáp án / ghi chú"],
          ["1. Khởi động (5 phút)", "Chiếu tình huống: Có 3 cái bánh, chia đều cho 4 bạn. Mỗi bạn được bao nhiêu phần bánh? Yêu cầu học sinh thảo luận cặp đôi.", "Thảo luận cặp đôi, dùng mô hình bìa để chia và nêu cách làm.", "Mỗi bạn được 3/4 cái bánh."],
          ["2. Hình thành kiến thức (15 phút)", "Hướng dẫn: vì 3 không chia hết cho 4 nên ta viết thương dưới dạng phân số. Nêu kết luận: a : b = a/b (b ≠ 0). Cho ví dụ 5 : 8 và 7 : 3.", "Ghi kết luận vào vở, nêu tử số và mẫu số trong từng ví dụ, đọc phân số thành tiếng.", "5 : 8 = 5/8; 7 : 3 = 7/3."],
          ["3. Luyện tập (15 phút)", "Giao phiếu học tập: Bài 1 viết thương thành phân số (4 : 9; 6 : 5; 11 : 11). Bài 2: rót đều 5 lít nước vào 8 chai, mỗi chai có bao nhiêu lít nước?", "Làm việc nhóm 4, trình bày kết quả lên bảng, nhận xét chéo.", "Bài 1: 4/9; 6/5; 1. Bài 2: 5/8 lít."],
          ["4. Vận dụng (7 phút)", "Nêu bài toán: Chia đều 2 quả cam cho 5 bạn, mỗi bạn được mấy phần quả cam? Mời 2 học sinh trình bày cách giải thích khác nhau.", "Giải bài toán cá nhân, so sánh hai cách trình bày.", "Mỗi bạn được 2/5 quả cam."],
        ],
      },
      { type: "paragraph", text: "Hướng dẫn về nhà (3 phút): Hoàn thành bài tập trong phiếu bài tập kèm theo; chuẩn bị bài mới “Tính chất cơ bản của phân số” bằng cách gấp giấy thành 2, 4, 8 phần bằng nhau." },
      { type: "heading", level: 2, text: "IV. Đánh giá" },
      {
        type: "list",
        ordered: false,
        items: [
          "Đánh giá qua quan sát: thái độ tham gia thảo luận, khả năng dùng mô hình để giải thích kết quả chia.",
          "Đánh giá qua sản phẩm: phiếu học tập của nhóm (đúng đáp án, trình bày rõ ràng).",
          "Câu hỏi cuối tiết: Viết thương 9 : 14 dưới dạng phân số và cho biết tử số, mẫu số (đáp án: 9/14; tử số 9, mẫu số 14).",
        ],
      },
      { type: "heading", level: 2, text: "V. Điều chỉnh sau khi dạy" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
    ],
  }),

  wordTemplate({
    id: "word-student-worksheet",
    type: "word",
    name: "Phiếu bài tập Toán lớp 2 — Phép cộng có nhớ",
    englishName: "Grade 2 Math Worksheet",
    category: "worksheet",
    categoryLabel: "Phiếu bài tập",
    description: "Phiếu bài tập tuần 5 môn Toán lớp 2: trắc nghiệm, đặt tính, điền số, bài toán có lời văn và đáp án cho giáo viên.",
    subjects: "Toán",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 2",
    grade: 2,
    subject: "Toán",
    pageCount: 2,
    tags: ["phiếu bài tập", "toán lớp 2", "phép cộng có nhớ", "in cho học sinh"],
    thumb: { layout: "worksheet", note: "Teal · 2 trang" },
    theme: {
      name: "Worksheet Teal", accent: "#0f766e", accent2: "#b45309", soft: "#f0fdfa",
      line: "#99f6e4", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#0f766e", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "pastel", pattern: "pastel",
    },
    title: "PHIẾU BÀI TẬP TOÁN TUẦN 5 — PHÉP CỘNG CÓ NHỚ",
    header: `<div class="tpl-head"><span>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>Phiếu bài tập tuần 5 · Toán 2</span></div>`,
    footer: `<div class="tpl-foot"><span>Phiếu bài tập Toán 2 · Tuần 5</span><span>Điểm: …… · Nhận xét: ……………………</span></div>`,
    css: `
.doc-page.tpl-word-student-worksheet { padding: 54px 60px 58px; }
.tpl-word-student-worksheet .tpl-head { border-bottom: 2px solid #0f766e; color: #0f766e; font-size: 11px; }
.tpl-word-student-worksheet h1 { margin: 20px 0 4px; color: #0f766e; font-size: 21px; }
.tpl-word-student-worksheet h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-student-worksheet h2 { color: #0f766e; border-bottom-color: #99f6e4; text-transform: none; letter-spacing: 0; }
.tpl-word-student-worksheet table th { background: #f0fdfa; color: #0f766e; border-color: #99f6e4; }
.tpl-word-student-worksheet table td { border-color: #cbd5e1; }
.tpl-word-student-worksheet .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "PHIẾU BÀI TẬP TOÁN — TUẦN 5" },
      { type: "paragraph", text: "Phép cộng trong phạm vi 100 (có nhớ) · Thời gian làm bài: 30 phút", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên", blank, "Lớp", "2A…"],
          ["Trường", "Tiểu học Hòa Bình", "Ngày làm bài", "…/…/2026"],
        ],
      },
      { type: "paragraph", text: "Cách làm bài: Em đọc kĩ từng bài, đặt tính vào giấy nháp rồi ghi kết quả vào phiếu. Làm xong, em tự kiểm tra lại một lượt trước khi nộp." },
      { type: "heading", level: 2, text: "Bài 1. Khoanh vào chữ cái trước kết quả đúng" },
      {
        type: "list",
        ordered: true,
        items: [
          "38 + 25 = ?      A. 53      B. 63      C. 73",
          "47 + 36 = ?      A. 83      B. 73      C. 93",
          "59 + 17 = ?      A. 66      B. 76      C. 86",
          "Số nào cộng với 28 thì được 65?      A. 33      B. 37      C. 43",
        ],
      },
      { type: "heading", level: 2, text: "Bài 2. Đặt tính rồi tính" },
      {
        type: "table",
        rows: [
          ["64 + 28 = ……", "35 + 47 = ……"],
          ["71 + 19 = ……", "26 + 58 = ……"],
        ],
      },
      { type: "heading", level: 2, text: "Bài 3. Điền số thích hợp vào chỗ trống" },
      {
        type: "list",
        ordered: true,
        items: [
          "45 + …… = 70",
          "…… + 34 = 91",
          "62 + 18 = ……",
        ],
      },
      { type: "heading", level: 2, text: "Bài 4. Giải bài toán" },
      { type: "paragraph", text: "Lớp 2A có 28 bạn nam và 19 bạn nữ. Hỏi lớp 2A có tất cả bao nhiêu học sinh?" },
      { type: "paragraph", text: "Bài giải" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Bài 5. Bài toán nâng cao" },
      { type: "paragraph", text: "Tổ Một trồng được 37 cây. Tổ Hai trồng được nhiều hơn tổ Một 15 cây. Hỏi tổ Hai trồng được bao nhiêu cây?" },
      { type: "paragraph", text: "Bài giải" },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Đáp án tham khảo (dành cho giáo viên)" },
      {
        type: "list",
        ordered: false,
        items: [
          "Bài 1: 1 – B (63); 2 – A (83); 3 – B (76); 4 – B (37).",
          "Bài 2: 64 + 28 = 92; 35 + 47 = 82; 71 + 19 = 90; 26 + 58 = 84.",
          "Bài 3: 25; 57; 80.",
          "Bài 4: 28 + 19 = 47 (học sinh).",
          "Bài 5: 37 + 15 = 52 (cây).",
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-professional-exam",
    type: "word",
    name: "Đề kiểm tra giữa học kì I — Toán 9 (có ma trận, đáp án)",
    englishName: "Grade 9 Math Midterm Exam",
    category: "exam",
    categoryLabel: "Đề kiểm tra",
    description: "Đề kiểm tra giữa học kì I môn Toán 9 đúng thể thức in ấn: ma trận đề, 6 câu trắc nghiệm, 3 bài tự luận và hướng dẫn chấm.",
    subjects: "Toán",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 9",
    grade: 9,
    subject: "Toán",
    pageCount: 3,
    tags: ["đề kiểm tra", "giữa học kì", "toán 9", "ma trận đề", "đáp án"],
    thumb: { layout: "exam", note: "Formal · 3 trang" },
    theme: {
      name: "Formal Exam", accent: "#1e3a5f", accent2: "#475569", soft: "#f1f5f9",
      line: "#94a3b8", ink: "#111827", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1e3a5f", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "exam", pattern: "exam",
    },
    title: "ĐỀ KIỂM TRA GIỮA HỌC KÌ I — MÔN TOÁN 9",
    header: `<div class="tpl-head"><span>SỞ GD&amp;ĐT THÀNH PHỐ HỒ CHÍ MINH<br>TRƯỜNG THCS NGUYỄN HUỆ</span><span>ĐỀ KIỂM TRA GIỮA HỌC KÌ I<br>Năm học 2026–2027</span></div>`,
    footer: `<div class="tpl-foot"><span>Mã đề 01 · Môn Toán 9</span><span>Trang 1/3</span></div>`,
    css: `
.doc-page.tpl-word-professional-exam { padding: 52px 58px 56px; font-size: 14px; line-height: 1.6; }
.tpl-word-professional-exam .tpl-head { border-bottom: 1.5px solid #111827; font-size: 11px; text-transform: none; letter-spacing: 0; }
.tpl-word-professional-exam h1 { margin: 20px 0 4px; padding-bottom: 8px; border-bottom: 3px double #111827; color: #111827; font-size: 20px; }
.tpl-word-professional-exam h1 + p { margin: 4px 0 16px; text-align: center; color: #475569; font-size: 13px; font-style: italic; }
.tpl-word-professional-exam h2 { color: #111827; border-bottom-color: #94a3b8; text-transform: none; letter-spacing: 0; }
.tpl-word-professional-exam table th { background: #f1f5f9; color: #111827; border-color: #94a3b8; }
.tpl-word-professional-exam table td { border-color: #94a3b8; }
.tpl-word-professional-exam .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "ĐỀ KIỂM TRA GIỮA HỌC KÌ I — MÔN TOÁN 9" },
      { type: "paragraph", text: "Thời gian làm bài: 90 phút (không kể thời gian phát đề) · Mã đề: 01", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên học sinh", blank, "Lớp", "9A…"],
          ["Số báo danh", "………………", "Phòng thi", "………………"],
          ["Điểm bằng số", "………………", "Điểm bằng chữ", "………………"],
        ],
      },
      { type: "heading", level: 2, text: "Ma trận đề kiểm tra" },
      {
        type: "table",
        rows: [
          ["Chủ đề", "Trắc nghiệm", "Tự luận", "Tổng điểm"],
          ["Căn thức bậc hai", "4 câu (2,0 điểm)", "Bài 1 (2,0 điểm)", "4,0 điểm"],
          ["Hệ thức lượng trong tam giác vuông", "2 câu (1,0 điểm)", "Bài 3 (3,0 điểm)", "4,0 điểm"],
          ["Phương trình và bất phương trình bậc nhất một ẩn", "—", "Bài 2 (2,0 điểm)", "2,0 điểm"],
          ["Tổng", "6 câu (3,0 điểm)", "3 bài (7,0 điểm)", "10,0 điểm"],
        ],
      },
      { type: "heading", level: 2, text: "PHẦN I. TRẮC NGHIỆM (3,0 điểm)" },
      { type: "paragraph", text: "Mỗi câu đúng được 0,5 điểm. Khoanh tròn vào chữ cái đứng trước đáp án đúng nhất." },
      {
        type: "list",
        ordered: true,
        items: [
          "Căn bậc hai số học của 81 là: A. −9    B. 9    C. 81    D. ±9.",
          "Điều kiện xác định của biểu thức √(x − 3) là: A. x > 3    B. x < 3    C. x ≥ 3    D. x ≤ 3.",
          "Cho tam giác ABC vuông tại A, AB = 3 cm, AC = 4 cm. Độ dài cạnh BC bằng: A. 5 cm    B. 6 cm    C. 7 cm    D. 25 cm.",
          "Giá trị của biểu thức (√5 − √2)(√5 + √2) là: A. 7    B. 10    C. 2    D. 3.",
          "Rút gọn biểu thức √50 ta được: A. 5√2    B. 2√5    C. 25√2    D. 10.",
          "Cho tam giác ABC vuông tại A, AB = 3 cm, AC = 4 cm, BC = 5 cm. Giá trị của sin B bằng: A. 3/5    B. 4/5    C. 3/4    D. 5/4.",
        ],
      },
      { type: "heading", level: 2, text: "PHẦN II. TỰ LUẬN (7,0 điểm)" },
      { type: "paragraph", text: "Bài 1 (2,0 điểm). Rút gọn các biểu thức sau:" },
      { type: "paragraph", text: "a) A = 3√12 − 2√27 + √48" },
      { type: "paragraph", text: "b) B = (1/(√x − 2) + 1/(√x + 2)) · (x − 4)/√x   (với x > 0, x ≠ 4)" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "Bài 2 (2,0 điểm). Giải phương trình và bất phương trình sau:" },
      { type: "paragraph", text: "a) √(2x + 1) = 3" },
      { type: "paragraph", text: "b) (x − 1)/2 + 1 ≥ (2x + 3)/3" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "Bài 3 (3,0 điểm). Cho tam giác ABC vuông tại A, đường cao AH. Biết AB = 6 cm, AC = 8 cm. Tính độ dài BC, AH và diện tích tam giác AHC." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "HƯỚNG DẪN CHẤM (dành cho giáo viên)" },
      {
        type: "list",
        ordered: false,
        items: [
          "Phần I: 1 – B; 2 – C; 3 – A; 4 – D; 5 – A; 6 – B (mỗi câu 0,5 điểm).",
          "Bài 1: a) A = 6√3 − 6√3 + 4√3 = 4√3 (1,0 điểm). b) Quy đồng và rút gọn được B = 2 (1,0 điểm).",
          "Bài 2: a) 2x + 1 = 9, suy ra x = 4 (1,0 điểm). b) Nhân hai vế với 6, thu gọn được x ≤ −3 (1,0 điểm).",
          "Bài 3: BC = √(6² + 8²) = 10 cm (1,0 điểm); AH = (AB · AC) : BC = 48 : 10 = 4,8 cm (1,0 điểm); HC = AC² : BC = 6,4 cm, diện tích tam giác AHC = (4,8 · 6,4) : 2 = 15,36 cm² (1,0 điểm).",
        ],
      },
    ],
  }),
  wordTemplate({
    id: "word-study-guide",
    type: "word",
    name: "Tài liệu ôn tập KHTN 8 — Chất và sự biến đổi chất",
    englishName: "Grade 8 Science Study Guide",
    category: "study-guide",
    categoryLabel: "Tài liệu ôn tập",
    description: "Bản ôn tập giữa kì phần Hóa học: kiến thức cần nắm, bảng tóm tắt, ví dụ có lời giải, bài tập tự luyện kèm đáp án.",
    subjects: "Khoa học tự nhiên",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Khoa học tự nhiên",
    pageCount: 3,
    tags: ["ôn tập", "khoa học tự nhiên 8", "hóa học", "bảo toàn khối lượng"],
    thumb: { layout: "study", note: "Cyan đậm · 3 trang" },
    theme: {
      name: "Study Cyan", accent: "#155e75", accent2: "#0f766e", soft: "#ecfeff",
      line: "#a5f3fc", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#164e63", heroText: "#ffffff", font: "Arial", displayFont: "Georgia",
      variant: "study", pattern: "study",
    },
    title: "TÀI LIỆU ÔN TẬP GIỮA HỌC KÌ I — KHOA HỌC TỰ NHIÊN 8",
    header: commonSchoolHeader("TRƯỜNG THCS LÊ QUÝ ĐÔN", "Tổ Khoa học tự nhiên"),
    footer: `<div class="tpl-foot"><span>Ôn tập giữa học kì I · KHTN 8</span><span>Học sinh tự ôn tại nhà</span></div>`,
    css: `
.doc-page.tpl-word-study-guide { padding: 54px 62px 58px; }
.tpl-word-study-guide .tpl-head { border-bottom: 2px solid #155e75; color: #155e75; font-size: 11px; }
.tpl-word-study-guide h1 { margin: 22px 0 6px; color: #164e63; font-size: 21px; }
.tpl-word-study-guide h1 + p { margin-bottom: 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-study-guide h2 { color: #155e75; border-bottom-color: #a5f3fc; text-transform: none; letter-spacing: 0; }
.tpl-word-study-guide table th { background: #ecfeff; color: #164e63; border-color: #a5f3fc; }
.tpl-word-study-guide table td { border-color: #cffafe; }
.tpl-word-study-guide .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "TÀI LIỆU ÔN TẬP GIỮA HỌC KÌ I — KHOA HỌC TỰ NHIÊN 8" },
      { type: "paragraph", text: "Phần Hóa học · Chương: Chất và sự biến đổi của chất · Thời gian tự ôn: 45 phút", align: "center" },
      { type: "heading", level: 2, text: "1. Kiến thức cần nắm" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chất có tính chất vật lí (trạng thái, màu sắc, nhiệt độ nóng chảy, tính tan...) và tính chất hóa học (khả năng biến đổi thành chất khác).",
          "Biến đổi vật lí: chất vẫn giữ nguyên, chỉ thay đổi trạng thái hoặc hình dạng. Biến đổi hóa học: có chất mới tạo thành.",
          "Dấu hiệu nhận biết phản ứng hóa học: đổi màu, tỏa nhiệt hoặc phát sáng, xuất hiện chất khí, tạo chất kết tủa.",
          "Định luật bảo toàn khối lượng: tổng khối lượng các chất tham gia bằng tổng khối lượng các chất sản phẩm.",
        ],
      },
      { type: "heading", level: 2, text: "2. Bảng tóm tắt" },
      {
        type: "table",
        rows: [
          ["Nội dung", "Công thức / quy tắc", "Ví dụ"],
          ["Định luật bảo toàn khối lượng", "m chất tham gia = m sản phẩm", "A + B → C thì mA + mB = mC"],
          ["Khối lượng mol", "M = m : n (g/mol)", "M(H₂O) = 2 · 1 + 16 = 18 g/mol"],
          ["Cân bằng phương trình", "Tổng số nguyên tử mỗi nguyên tố ở hai vế bằng nhau", "3Fe + 2O₂ → Fe₃O₄"],
        ],
      },
      { type: "heading", level: 2, text: "3. Ví dụ có lời giải" },
      { type: "paragraph", text: "Ví dụ: Đốt cháy hoàn toàn 4,8 gam magnesium trong khí oxygen, thu được 8,0 gam magnesium oxide. Tính khối lượng oxygen đã tham gia phản ứng." },
      { type: "paragraph", text: "Lời giải: Theo định luật bảo toàn khối lượng: mMg + mO₂ = mMgO. Suy ra mO₂ = 8,0 − 4,8 = 3,2 (gam)." },
      { type: "heading", level: 2, text: "4. Bài tập tự luyện" },
      {
        type: "list",
        ordered: true,
        items: [
          "Phân loại các hiện tượng sau thành biến đổi vật lí hoặc biến đổi hóa học: nước đá tan chảy; giấy cháy thành tro; muối ăn tan trong nước; đinh sắt để lâu bị gỉ.",
          "Lập phương trình hóa học của phản ứng giữa sắt và oxygen tạo thành Fe₃O₄. Cho biết tỉ lệ số nguyên tử Fe : số phân tử O₂ : số phân tử Fe₃O₄.",
          "Đốt cháy hoàn toàn 12 gam carbon trong khí oxygen, thu được khí carbon dioxide. Biết khối lượng oxygen đã phản ứng là 32 gam, tính khối lượng carbon dioxide tạo thành.",
          "Giải thích vì sao sau khi dùng cồn để lau bàn, cần đậy nắp lọ cồn ngay.",
        ],
      },
      { type: "heading", level: 2, text: "5. Đáp án bài tập tự luyện" },
      {
        type: "list",
        ordered: true,
        items: [
          "Biến đổi vật lí: nước đá tan chảy, muối ăn tan trong nước. Biến đổi hóa học: giấy cháy thành tro, đinh sắt bị gỉ.",
          "3Fe + 2O₂ → Fe₃O₄. Tỉ lệ số nguyên tử Fe : số phân tử O₂ : số phân tử Fe₃O₄ = 3 : 2 : 1.",
          "Theo định luật bảo toàn khối lượng: mCO₂ = 12 + 32 = 44 (gam).",
          "Cồn bay hơi rất nhanh và dễ cháy. Đậy nắp giúp cồn không bị bay hơi mất và tránh nguy cơ cháy khi gặp nguồn nhiệt.",
        ],
      },
      { type: "heading", level: 2, text: "6. Tự chấm sau khi ôn" },
      {
        type: "table",
        rows: [
          ["Số bài làm đúng", "Mức tự đánh giá", "Việc cần làm tiếp"],
          ["4/4", "Tốt", "Làm thêm bài toán bảo toàn khối lượng nâng cao"],
          ["2–3/4", "Đạt", "Đọc lại mục 1 và xem kĩ ví dụ ở mục 3"],
          ["0–1/4", "Cần cố gắng", "Học lại từ bài Biến đổi vật lí, biến đổi hóa học trong SGK"],
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-homework-assignment",
    type: "word",
    name: "Bài tập về nhà Tiếng Anh 6 — Unit 4",
    englishName: "Grade 6 English Homework",
    category: "worksheet",
    categoryLabel: "Phiếu bài tập",
    description: "Phiếu giao bài tập về nhà tuần 8 môn Tiếng Anh 6 với nhiệm vụ theo thời gian, bài tập tự soạn và đáp án đối chiếu.",
    subjects: "Tiếng Anh",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 6",
    grade: 6,
    subject: "Tiếng Anh",
    pageCount: 2,
    tags: ["bài tập về nhà", "tiếng anh 6", "unit 4", "so sánh hơn"],
    thumb: { layout: "homework", note: "Xanh lá · 2 trang" },
    theme: {
      name: "Homework Green", accent: "#166534", accent2: "#a16207", soft: "#f0fdf4",
      line: "#bbf7d0", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#166534", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "homework", pattern: "homework",
    },
    title: "BÀI TẬP VỀ NHÀ TUẦN 8 — TIẾNG ANH 6",
    header: `<div class="tpl-head"><span>TRƯỜNG THCS TRẦN PHÚ</span><span>Bài tập về nhà · Tiếng Anh 6</span></div>`,
    footer: `<div class="tpl-foot"><span>Hạn nộp: Thứ Sáu, 13/11/2026</span><span>Chữ ký phụ huynh: ………………………</span></div>`,
    css: `
.doc-page.tpl-word-homework-assignment { padding: 54px 60px 58px; }
.tpl-word-homework-assignment .tpl-head { border-bottom: 2px solid #166534; color: #166534; font-size: 11px; }
.tpl-word-homework-assignment h1 { margin: 20px 0 4px; color: #166534; font-size: 21px; }
.tpl-word-homework-assignment h1 + p { margin: 0 0 16px; text-align: center; color: #854d0e; font-size: 12.5px; }
.tpl-word-homework-assignment h2 { color: #166534; border-bottom-color: #bbf7d0; text-transform: none; letter-spacing: 0; }
.tpl-word-homework-assignment ul li { list-style: none; position: relative; padding-left: 20px; margin: 5px 0; }
.tpl-word-homework-assignment ul li::before { content: "□"; position: absolute; left: 0; top: 0; color: #166534; font-size: 13px; }
.tpl-word-homework-assignment table th { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
.tpl-word-homework-assignment table td { border-color: #cbd5e1; }
.tpl-word-homework-assignment .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "BÀI TẬP VỀ NHÀ TUẦN 8 — TIẾNG ANH 6" },
      { type: "paragraph", text: "Unit 4: My Neighbourhood · Tổng thời gian làm bài: khoảng 60 phút", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên", blank, "Lớp", "6A…"],
          ["Ngày giao bài", "Thứ Hai, 09/11/2026", "Hạn nộp", "Thứ Sáu, 13/11/2026"],
        ],
      },
      { type: "heading", level: 2, text: "Nhiệm vụ 1 — Từ vựng (15 phút)" },
      { type: "paragraph", text: "Nối từ ở cột A với nghĩa ở cột B, sau đó viết mỗi từ vào một câu của riêng em." },
      {
        type: "table",
        rows: [
          ["A. Từ vựng", "B. Nghĩa"],
          ["1. crowded", "a. yên tĩnh, thanh bình"],
          ["2. peaceful", "b. thuận tiện"],
          ["3. convenient", "c. đông đúc"],
          ["4. noisy", "d. ồn ào"],
          ["5. narrow", "e. chật hẹp"],
        ],
      },
      { type: "heading", level: 2, text: "Nhiệm vụ 2 — Ngữ pháp: So sánh hơn (20 phút)" },
      { type: "paragraph", text: "Điền dạng đúng của tính từ trong ngoặc vào chỗ trống." },
      {
        type: "list",
        ordered: true,
        items: [
          "This park is ………………… (peaceful) than the market.",
          "A motorbike is ………………… (fast) than a bicycle.",
          "My house is ………………… (near) to school than yours.",
          "The city is ………………… (crowded) in the morning than at night.",
          "This road is ………………… (wide) than that one.",
        ],
      },
      { type: "heading", level: 2, text: "Nhiệm vụ 3 — Đọc hiểu (15 phút)" },
      { type: "paragraph", text: "Đọc bài “My neighbourhood” trong sách giáo khoa (Unit 4, phần Reading) và trả lời 4 câu hỏi cuối bài vào vở. Câu trả lời viết ngắn gọn nhưng đủ ý, có dẫn chứng từ bài đọc." },
      { type: "heading", level: 2, text: "Nhiệm vụ 4 — Viết (10 phút)" },
      { type: "paragraph", text: "Viết đoạn văn 60–80 từ giới thiệu khu phố nơi em ở. Đoạn văn cần có ít nhất 5 từ vựng của Unit 4 và 2 câu dùng so sánh hơn." },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Tự đánh giá sau khi làm bài" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Đã làm", "Chưa làm"],
          ["Em làm đủ 4 nhiệm vụ", "☐", "☐"],
          ["Em đã soát lại lỗi chính tả và ngữ pháp", "☐", "☐"],
          ["Em ghi ra câu hỏi muốn hỏi thầy cô", "☐", "☐"],
        ],
      },
      { type: "heading", level: 2, text: "Đáp án đối chiếu (phụ huynh và giáo viên kiểm tra)" },
      {
        type: "list",
        ordered: false,
        items: [
          "Nhiệm vụ 1: 1 – c; 2 – a; 3 – b; 4 – d; 5 – e.",
          "Nhiệm vụ 2: 1. more peaceful; 2. faster; 3. nearer; 4. more crowded; 5. wider.",
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-group-activity",
    type: "word",
    name: "Phiếu làm việc nhóm — Lễ hội truyền thống địa phương",
    englishName: "Group Work Sheet — Local Festival",
    category: "group",
    categoryLabel: "Hoạt động nhóm",
    description: "Phiếu làm việc nhóm cho nội dung giáo dục địa phương lớp 7: nhiệm vụ, bảng thu thập thông tin, phân công và rubric đánh giá.",
    subjects: "Lịch sử và Địa lý · Giáo dục địa phương",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 7",
    grade: 7,
    subject: "Lịch sử và Địa lý",
    pageCount: 3,
    tags: ["hoạt động nhóm", "giáo dục địa phương", "lễ hội", "phiếu làm việc nhóm"],
    thumb: { layout: "group", note: "Nâu đất · 3 trang" },
    theme: {
      name: "Group Brick", accent: "#9a3412", accent2: "#3f6212", soft: "#fff7ed",
      line: "#fed7aa", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#7c2d12", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "group", pattern: "group",
    },
    title: "PHIẾU LÀM VIỆC NHÓM: TÌM HIỂU MỘT LỄ HỘI TRUYỀN THỐNG Ở ĐỊA PHƯƠNG",
    header: commonSchoolHeader("TRƯỜNG THCS TRẦN PHÚ", "Giáo dục địa phương 7 · Chủ đề: Lễ hội truyền thống"),
    footer: `<div class="tpl-foot"><span>Phiếu làm việc nhóm · Thời gian thực hiện: 2 tiết</span><span>Nhóm trưởng ký tên: ………………………</span></div>`,
    css: `
.doc-page.tpl-word-group-activity { padding: 54px 60px 58px; }
.tpl-word-group-activity .tpl-head { border-bottom: 2px solid #9a3412; color: #7c2d12; font-size: 11px; }
.tpl-word-group-activity h1 { margin: 20px 0 4px; color: #7c2d12; font-size: 20px; }
.tpl-word-group-activity h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-group-activity h2 { color: #9a3412; border-bottom-color: #fed7aa; text-transform: none; letter-spacing: 0; }
.tpl-word-group-activity table th { background: #fff7ed; color: #7c2d12; border-color: #e7e5e4; }
.tpl-word-group-activity table td { border-color: #e7e5e4; }
.tpl-word-group-activity .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "PHIẾU LÀM VIỆC NHÓM: TÌM HIỂU MỘT LỄ HỘI TRUYỀN THỐNG Ở ĐỊA PHƯƠNG" },
      { type: "paragraph", text: "Nội dung giáo dục địa phương · Lớp 7 · Thời gian thực hiện: 2 tiết (90 phút)", align: "center" },
      {
        type: "table",
        rows: [
          ["Nhóm", "Nhóm …… — Lớp 7A…", "Số thành viên", "…… bạn"],
          ["Nhóm trưởng", "……………………", "Thư ký", "……………………"],
          ["Lễ hội nhóm chọn tìm hiểu", "………………………………………………………………………………………………", "", ""],
        ],
      },
      { type: "heading", level: 2, text: "1. Nhiệm vụ của nhóm" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chọn một lễ hội truyền thống ở địa phương em (huyện, tỉnh hoặc vùng em đang sống).",
          "Thu thập thông tin từ ít nhất 2 nguồn: sách/báo/website chính thống và phỏng vấn người thân hoặc người dân địa phương.",
          "Hoàn thành bảng thu thập thông tin ở mục 2 và trình bày kết quả trong 3 phút trước lớp.",
        ],
      },
      { type: "heading", level: 2, text: "2. Bảng thu thập thông tin" },
      {
        type: "table",
        rows: [
          ["Nội dung cần tìm hiểu", "Thông tin nhóm thu thập được"],
          ["Tên lễ hội", ""],
          ["Thời gian tổ chức (ngày tháng âm lịch/dương lịch)", ""],
          ["Địa điểm tổ chức", ""],
          ["Nguồn gốc / sự tích liên quan", ""],
          ["Các hoạt động chính (phần lễ và phần hội)", ""],
          ["Ý nghĩa của lễ hội đối với cộng đồng", ""],
          ["Nguồn thông tin đã sử dụng", ""],
        ],
      },
      { type: "paragraph", text: "Ví dụ mẫu một dòng đã điền: Tên lễ hội — Lễ hội chùa Hương; Thời gian tổ chức — Khai hội ngày mùng 6 tháng Giêng âm lịch, kéo dài đến hết tháng 3 âm lịch; Địa điểm — Quần thể di tích Hương Sơn, xã Hương Sơn, thành phố Hà Nội." },
      { type: "heading", level: 2, text: "3. Câu hỏi gợi ý khi phỏng vấn" },
      {
        type: "list",
        ordered: true,
        items: [
          "Lễ hội được tổ chức từ khi nào? Gắn với nhân vật hoặc sự kiện lịch sử nào?",
          "Gia đình ông/bà thường tham gia hoạt động nào trong lễ hội?",
          "Lễ hội ngày nay có gì khác so với trước đây?",
          "Theo ông/bà, người trẻ cần làm gì để giữ gìn lễ hội?",
        ],
      },
      { type: "heading", level: 2, text: "4. Phân công trong nhóm" },
      {
        type: "table",
        rows: [
          ["Việc", "Người thực hiện", "Hạn hoàn thành"],
          ["Tìm tư liệu trên sách, báo, website", "……………………", "Tiết 1"],
          ["Phỏng vấn và ghi chép", "……………………", "Tiết 1"],
          ["Hoàn thành bảng thu thập, vẽ sơ đồ/phần trình bày", "……………………", "Đầu tiết 2"],
          ["Trình bày trước lớp", "……………………", "Tiết 2"],
        ],
      },
      { type: "heading", level: 2, text: "5. Tiêu chí đánh giá sản phẩm nhóm" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Yêu cầu đạt", "Điểm"],
          ["Nội dung", "Đủ 7 nội dung ở mục 2, thông tin chính xác, có nguồn rõ ràng", "4 điểm"],
          ["Nguồn thông tin", "Có ít nhất 2 nguồn, trong đó có 1 nguồn phỏng vấn thực tế", "2 điểm"],
          ["Trình bày", "Rõ ràng, đúng 3 phút, trả lời được câu hỏi của lớp", "2 điểm"],
          ["Hợp tác", "Mọi thành viên đều có việc cụ thể và hoàn thành đúng hạn", "2 điểm"],
          ["Tổng", "", "10 điểm"],
        ],
      },
      { type: "heading", level: 2, text: "6. Tự đánh giá của nhóm" },
      { type: "paragraph", text: "Việc nhóm làm tốt nhất: ………………………………………………………………………………" },
      { type: "paragraph", text: "Việc nhóm còn lúng túng: ………………………………………………………………………………" },
      { type: "paragraph", text: "Điểm nhóm tự chấm: ……… / 10" },
    ],
  }),
  wordTemplate({
    id: "word-practical-manual",
    type: "word",
    name: "Phiếu thực hành KHTN 8 — Quan sát tế bào thực vật",
    englishName: "Grade 8 Science Lab Sheet",
    category: "study-guide",
    categoryLabel: "Tài liệu ôn tập",
    description: "Phiếu thực hành quan sát tế bào vảy hành bằng kính hiển vi: dụng cụ, quy tắc an toàn, các bước làm tiêu bản và bảng báo cáo.",
    subjects: "Khoa học tự nhiên",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Khoa học tự nhiên",
    pageCount: 3,
    tags: ["thực hành", "thí nghiệm", "tế bào", "kính hiển vi"],
    thumb: { layout: "manual", note: "Xanh phòng lab · 3 trang" },
    theme: {
      name: "Lab Blue", accent: "#0369a1", accent2: "#0f766e", soft: "#f0f9ff",
      line: "#bae6fd", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#075985", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "manual", pattern: "manual",
    },
    title: "PHIẾU THỰC HÀNH: QUAN SÁT TẾ BÀO THỰC VẬT BẰNG KÍNH HIỂN VI",
    header: commonSchoolHeader("TRƯỜNG THCS LÊ QUÝ ĐÔN", "Phòng bộ môn Khoa học tự nhiên"),
    footer: `<div class="tpl-foot"><span>Phiếu thực hành KHTN 8 · Bài thực hành số 4</span><span>Nhóm: …………… · Lớp: ……………</span></div>`,
    css: `
.doc-page.tpl-word-practical-manual { padding: 54px 60px 58px; }
.tpl-word-practical-manual .tpl-head { border-bottom: 2px solid #0369a1; color: #075985; font-size: 11px; }
.tpl-word-practical-manual h1 { margin: 20px 0 4px; color: #075985; font-size: 20px; }
.tpl-word-practical-manual h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-practical-manual h2 { color: #0369a1; border-bottom-color: #bae6fd; text-transform: none; letter-spacing: 0; }
.tpl-word-practical-manual table th { background: #f0f9ff; color: #075985; border-color: #bae6fd; }
.tpl-word-practical-manual table td { border-color: #bae6fd; }
.tpl-word-practical-manual .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "PHIẾU THỰC HÀNH: QUAN SÁT TẾ BÀO THỰC VẬT BẰNG KÍNH HIỂN VI" },
      { type: "paragraph", text: "Khoa học tự nhiên 8 · Thời gian: 45 phút · Hình thức: nhóm 4 học sinh", align: "center" },
      {
        type: "table",
        rows: [
          ["Nhóm", "……………………", "Lớp", "8A…"],
          ["Thành viên", "………………………………………………………………………………………………", "Ngày thực hành", "…/…/2026"],
        ],
      },
      { type: "heading", level: 2, text: "1. Mục tiêu" },
      {
        type: "list",
        ordered: false,
        items: [
          "Làm được tiêu bản tạm thời của tế bào vảy hành.",
          "Quan sát, vẽ và mô tả được hình dạng tế bào thực vật cùng một số thành phần: thành tế bào, nhân, tế bào chất.",
          "Tuân thủ quy tắc an toàn và vệ sinh khi làm việc trong phòng thí nghiệm.",
        ],
      },
      { type: "heading", level: 2, text: "2. Dụng cụ và vật liệu" },
      {
        type: "table",
        rows: [
          ["Dụng cụ", "Số lượng", "Vật liệu, hóa chất", "Số lượng"],
          ["Kính hiển vi quang học", "1 chiếc / nhóm", "Củ hành tím", "1 củ"],
          ["Lam kính, lamen", "2 bộ", "Nước cất", "1 lọ nhỏ"],
          ["Dao lam, panh, kim mũi mác", "1 bộ", "Dung dịch xanh methylene", "1 lọ nhỏ"],
          ["Ống nhỏ giọt, giấy thấm", "1 chiếc, 2 tờ", "Khăn lau mềm", "2 chiếc"],
        ],
      },
      { type: "heading", level: 2, text: "3. Quy tắc an toàn" },
      {
        type: "list",
        ordered: false,
        items: [
          "Cầm dao lam bằng cách bọc một cạnh trong giấy; không đùa nghịch với dụng cụ sắc nhọn.",
          "Không ngửi trực tiếp hoặc để hóa chất dính vào mắt; rửa tay ngay nếu bị dính xanh methylene.",
          "Khi quan sát, điều chỉnh ốc của kính hiển vi nhẹ nhàng, bắt đầu từ vật kính có độ phóng đại nhỏ nhất.",
          "Kết thúc buổi thực hành: rửa, lau khô dụng cụ và bàn giao lại cho giáo viên.",
        ],
      },
      { type: "heading", level: 2, text: "4. Các bước tiến hành" },
      {
        type: "list",
        ordered: true,
        items: [
          "Nhỏ một giọt nước cất vào giữa lam kính.",
          "Tách một vảy hành tím, lột lấy lớp biểu bì mỏng ở mặt trong của vảy, cắt một mẩu khoảng 0,5 cm × 0,5 cm.",
          "Đặt mẩu biểu bì lên giọt nước, dùng kim mũi mác trải phẳng, tránh để mẫu bị gấp.",
          "Đậy lamen: đặt một cạnh lamen chạm giọt nước rồi hạ xuống từ từ để không tạo bọt khí.",
          "Nhỏ một giọt xanh methylene vào một mép lamen, đặt giấy thấm ở mép đối diện để thuốc nhuộm thấm qua mẫu; chờ khoảng 1 phút.",
          "Đặt tiêu bản lên bàn kính, quan sát ở vật kính 10× rồi chuyển sang 40×. Vẽ hình quan sát được vào mục 5.",
        ],
      },
      { type: "heading", level: 2, text: "5. Kết quả quan sát" },
      {
        type: "table",
        rows: [
          ["Nội dung quan sát", "Mô tả của nhóm"],
          ["Hình dạng và cách sắp xếp của tế bào", ""],
          ["Thành tế bào (độ dày, màu sau khi nhuộm)", ""],
          ["Nhân tế bào (vị trí, hình dạng)", ""],
          ["Hình vẽ tế bào quan sát được (vẽ vào ô bên)", ""],
        ],
      },
      { type: "heading", level: 2, text: "6. Câu hỏi thảo luận" },
      {
        type: "list",
        ordered: true,
        items: [
          "Vì sao phải dùng lớp biểu bì thật mỏng của vảy hành?",
          "Xanh methylene giúp quan sát rõ thành phần nào của tế bào nhất? Vì sao?",
          "Tế bào vảy hành có lục lạp không? Giải thích dựa trên vị trí của vảy hành trong cây.",
        ],
      },
      { type: "heading", level: 2, text: "Gợi ý trả lời (dành cho giáo viên)" },
      {
        type: "list",
        ordered: true,
        items: [
          "Mẫu mỏng gồm ít lớp tế bào nên ánh sáng truyền qua được và các tế bào không chồng lấp lên nhau, dễ quan sát.",
          "Nhân tế bào, vì nhân bắt màu xanh methylene đậm hơn tế bào chất.",
          "Không. Vảy hành nằm dưới mặt đất, không tiếp xúc với ánh sáng nên tế bào không có lục lạp và không quang hợp.",
        ],
      },
      { type: "heading", level: 2, text: "Nhận xét của giáo viên" },
      { type: "paragraph", text: blank },
    ],
  }),

  wordTemplate({
    id: "word-student-report",
    type: "word",
    name: "Phiếu báo kết quả học tập và rèn luyện học kì I",
    englishName: "Semester Learning Report",
    category: "report",
    categoryLabel: "Báo cáo",
    description: "Phiếu báo kết quả học tập và rèn luyện theo Thông tư 22/2021: bảng điểm, nhận xét của giáo viên chủ nhiệm và ý kiến phụ huynh.",
    subjects: "Tổng hợp · Công tác chủ nhiệm",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Tổng hợp",
    pageCount: 2,
    tags: ["báo cáo", "phiếu liên lạc", "học kì I", "chủ nhiệm"],
    thumb: { layout: "report", note: "Navy · 2 trang" },
    theme: {
      name: "Report Slate", accent: "#1e3a5f", accent2: "#0f766e", soft: "#f1f5f9",
      line: "#cbd5e1", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1e3a5f", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "report", pattern: "report",
    },
    title: "PHIẾU BÁO KẾT QUẢ HỌC TẬP VÀ RÈN LUYỆN — HỌC KÌ I",
    header: `<div class="tpl-head"><span>PHÒNG GD&amp;ĐT QUẬN 3<br>TRƯỜNG THCS LÊ QUÝ ĐÔN</span><span>Năm học 2026–2027<br>Học kì I</span></div>`,
    footer: `<div class="tpl-foot"><span>Phiếu báo kết quả học kì I · Lớp 8A1</span><span>Giáo viên chủ nhiệm: Nguyễn Thị Lan</span></div>`,
    css: `
.doc-page.tpl-word-student-report { padding: 54px 62px 58px; font-size: 14px; line-height: 1.6; }
.tpl-word-student-report .tpl-head { border-bottom: 1.5px solid #1f2937; font-size: 11px; text-transform: none; letter-spacing: 0; }
.tpl-word-student-report h1 { margin: 22px 0 4px; color: #1f2937; font-size: 19px; }
.tpl-word-student-report h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-student-report h2 { color: #1e3a5f; border-bottom: 0; text-transform: none; letter-spacing: 0; font-size: 15px; }
.tpl-word-student-report table th { background: #f1f5f9; color: #1f2937; border-color: #cbd5e1; }
.tpl-word-student-report table td { border-color: #cbd5e1; }
.tpl-word-student-report .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "PHIẾU BÁO KẾT QUẢ HỌC TẬP VÀ RÈN LUYỆN — HỌC KÌ I" },
      { type: "paragraph", text: "(Ban hành kèm theo Thông tư số 22/2021/TT-BGDĐT của Bộ Giáo dục và Đào tạo)", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên học sinh", "Nguyễn Minh Anh", "Lớp", "8A1"],
          ["Ngày sinh", "14/03/2012", "Giáo viên chủ nhiệm", "Nguyễn Thị Lan"],
          ["Thời gian đánh giá", "05/09/2026 – 09/01/2027", "Sĩ số lớp", "38 học sinh"],
        ],
      },
      { type: "heading", level: 2, text: "1. Kết quả học tập" },
      {
        type: "table",
        rows: [
          ["Môn học", "Điểm trung bình", "Mức đánh giá", "Nhận xét ngắn"],
          ["Toán", "8,6", "Tốt", "Tư duy tốt, còn sai sót ở bài toán thực tế"],
          ["Ngữ văn", "8,2", "Tốt", "Đọc hiểu tốt; bài nghị luận cần lập luận chặt hơn"],
          ["Tiếng Anh", "7,9", "Khá", "Ngữ pháp vững, kỹ năng nghe còn hạn chế"],
          ["Khoa học tự nhiên", "8,8", "Tốt", "Thực hành cẩn thận, chủ động đặt câu hỏi"],
          ["Lịch sử và Địa lý", "8,4", "Tốt", "Biết khai thác bản đồ và tư liệu"],
          ["Tin học", "9,0", "Tốt", "Hoàn thành tốt các sản phẩm thực hành"],
          ["Kết quả học tập chung", "", "Tốt", ""],
        ],
      },
      { type: "heading", level: 2, text: "2. Kết quả rèn luyện" },
      { type: "paragraph", text: "Mức đánh giá: Tốt. Học sinh chấp hành tốt nội quy nhà trường, đi học chuyên cần (nghỉ 01 buổi có phép), kính trọng thầy cô, hòa đồng với bạn bè và tích cực tham gia hoạt động của lớp." },
      { type: "heading", level: 2, text: "3. Nhận xét của giáo viên chủ nhiệm" },
      { type: "paragraph", text: "Minh Anh có ý thức tự học tốt, ghi chép bài đầy đủ và luôn hoàn thành bài tập đúng hạn. Em mạnh ở các môn tự nhiên, đặc biệt là phần thực hành Khoa học tự nhiên. Trong học kì II, em cần dành thêm thời gian luyện nghe tiếng Anh (khoảng 15 phút mỗi ngày) và rèn cách triển khai luận điểm khi viết văn nghị luận. Giáo viên chủ nhiệm đề nghị gia đình phối hợp nhắc nhở em giữ thời gian biểu tự học buổi tối như đã thống nhất đầu năm." },
      { type: "heading", level: 2, text: "4. Ý kiến của phụ huynh" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      {
        type: "table",
        rows: [
          ["Giáo viên chủ nhiệm", "Phụ huynh học sinh"],
          ["(Ký, ghi rõ họ tên)", "(Ký, ghi rõ họ tên)"],
          ["Nguyễn Thị Lan", ""],
        ],
      },
      { type: "paragraph", text: "TP. Hồ Chí Minh, ngày 12 tháng 01 năm 2027", align: "right" },
    ],
  }),

  wordTemplate({
    id: "word-visual-learning",
    type: "word",
    name: "Bài đọc Khoa học lớp 5 — Lá cây tự làm thức ăn",
    englishName: "Grade 5 Science Reading",
    category: "study-guide",
    categoryLabel: "Tài liệu ôn tập",
    description: "Bài đọc thêm môn Khoa học lớp 5 về quang hợp, kèm câu hỏi tìm hiểu bài, bảng quan sát lá cây thật và đáp án cho giáo viên.",
    subjects: "Khoa học",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 5",
    grade: 5,
    subject: "Khoa học",
    pageCount: 3,
    tags: ["bài đọc", "khoa học 5", "quang hợp", "lá cây"],
    thumb: { layout: "editorial", note: "Editorial · 3 trang" },
    theme: {
      name: "Editorial Green", accent: "#166534", accent2: "#92400e", soft: "#f0fdf4",
      line: "#bbf7d0", ink: "#292524", muted: "#78716c", bg: "#ffffff",
      heroBg: "#14532d", heroText: "#ffffff", font: "Georgia", displayFont: "Georgia",
      variant: "editorial", pattern: "editorial",
    },
    title: "LÁ CÂY — NƠI CÂY TỰ LÀM RA THỨC ĂN",
    header: `<div class="tpl-head"><span>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>Bài đọc thêm · Khoa học 5</span></div>`,
    footer: `<div class="tpl-foot"><span>Bài đọc Khoa học 5 · Chủ đề: Thực vật</span><span>Lớp: 5A…</span></div>`,
    css: `
.doc-page.tpl-word-visual-learning { padding: 54px 62px 58px; }
.tpl-word-visual-learning .tpl-head { border-bottom: 1px solid #d6d3d1; color: #57534e; font-size: 11px; }
.tpl-word-visual-learning h1 { margin: 22px 0 8px; color: #14532d; font-size: 27px; line-height: 1.25; text-align: left; }
.tpl-word-visual-learning h1 + p { color: #44403c; font-size: 14.5px; line-height: 1.75; }
.tpl-word-visual-learning h2 { color: #166534; font-size: 17px; text-transform: none; letter-spacing: 0; border-bottom: 0; padding-bottom: 0; }
.tpl-word-visual-learning p { line-height: 1.75; }
.tpl-word-visual-learning img { display: block; width: 100%; margin: 12px 0 6px; border: 1px solid #d6d3d1; }
.tpl-word-visual-learning img + p { text-align: center; color: #78716c; font-size: 11.5px; font-style: italic; }
.tpl-word-visual-learning table th { background: #f0fdf4; color: #14532d; border-color: #d6d3d1; }
.tpl-word-visual-learning table td { border-color: #d6d3d1; }
.tpl-word-visual-learning .tpl-foot { color: #78716c; }
`,
    blocks: [
      { type: "heading", level: 1, text: "LÁ CÂY — NƠI CÂY TỰ LÀM RA THỨC ĂN" },
      { type: "paragraph", text: "Ở sân trường em có một cây bàng già. Mùa hè, tán lá bàng xanh um, che mát cả một khoảng sân. Mùa đông, lá bàng chuyển sang màu đỏ rồi rụng dần, chỉ còn trơ lại những cành khẳng khiu. Ít ai để ý rằng chính những chiếc lá tưởng chừng bình thường ấy lại là nơi cây tự làm ra thức ăn để sống và lớn lên." },
      { type: "paragraph", text: "Trong lá cây có chứa chất diệp lục — chất làm cho lá có màu xanh. Nhờ diệp lục, lá hấp thụ được năng lượng từ ánh sáng mặt trời. Cùng lúc đó, rễ cây hút nước từ đất và đưa lên lá qua thân cây, còn lá lấy khí các-bô-níc từ không khí qua những lỗ rất nhỏ trên bề mặt lá. Từ nước và khí các-bô-níc, nhờ năng lượng ánh sáng, cây tạo ra chất bột đường để nuôi cây, đồng thời nhả ra khí ô-xi. Quá trình đó gọi là quang hợp." },
      { type: "paragraph", text: "Chất bột đường giúp cây lớn lên, ra hoa, kết quả. Phần chất dinh dưỡng dư thừa được cây dự trữ ở củ, quả hoặc hạt — đó là lí do khoai lang, quả chuối hay hạt gạo lại có vị ngọt và chứa nhiều chất bột. Khí ô-xi cây nhả ra làm cho không khí trong lành hơn. Có thể nói, hầu hết thức ăn của con người và các loài vật đều bắt đầu từ quá trình quang hợp của cây xanh." },
      { type: "image", src: scienceDiscoveryImg, alt: "Sơ đồ quá trình quang hợp ở lá cây" },
      { type: "paragraph", text: "Hình 1. Lá cây dùng ánh sáng mặt trời, nước và khí các-bô-níc để tạo ra chất bột đường và khí ô-xi." },
      { type: "heading", level: 2, text: "Tìm hiểu bài" },
      {
        type: "list",
        ordered: true,
        items: [
          "Chất gì làm cho lá cây có màu xanh và giúp lá hấp thụ ánh sáng?",
          "Cây lấy nước và khí các-bô-níc từ đâu để quang hợp?",
          "Quang hợp tạo ra những sản phẩm nào? Mỗi sản phẩm có vai trò gì?",
          "Vì sao nói thức ăn của con người bắt đầu từ quá trình quang hợp?",
        ],
      },
      { type: "heading", level: 2, text: "Quan sát thật: Lá cây quanh em" },
      { type: "paragraph", text: "Em hãy chọn 3 cây có trong sân trường hoặc gần nhà, quan sát lá của từng cây và ghi vào bảng sau." },
      {
        type: "table",
        rows: [
          ["Tên cây", "Hình dạng lá", "Màu sắc lá", "Gân lá (song song / hình mạng)"],
          ["", "", "", ""],
          ["", "", "", ""],
          ["", "", "", ""],
        ],
      },
      { type: "heading", level: 2, text: "Thử làm nhà khoa học: Ép lá làm tiêu bản" },
      {
        type: "list",
        ordered: true,
        items: [
          "Nhặt một chiếc lá vừa rụng còn tươi, lau khô nhẹ nhàng.",
          "Đặt lá giữa hai tờ giấy trắng, ép phẳng trong một cuốn sách dày.",
          "Đè thêm sách nặng lên trên và để yên từ 3 đến 5 ngày.",
          "Mở ra, dán chiếc lá đã khô vào vở và ghi tên cây, nơi nhặt, ngày nhặt.",
        ],
      },
      { type: "heading", level: 2, text: "Đáp án phần Tìm hiểu bài (dành cho giáo viên)" },
      {
        type: "list",
        ordered: true,
        items: [
          "Chất diệp lục.",
          "Nước do rễ hút từ đất; khí các-bô-níc lá lấy từ không khí qua các lỗ nhỏ trên lá.",
          "Chất bột đường (nuôi cây, dự trữ ở củ, quả, hạt) và khí ô-xi (nhả ra môi trường).",
          "Vì động vật ăn cỏ lấy dinh dưỡng từ thực vật, động vật ăn thịt lại ăn động vật ăn cỏ; lương thực của con người cũng chủ yếu từ cây trồng và vật nuôi.",
        ],
      },
    ],
  }),
  wordTemplate({
    id: "word-project-based-learning",
    type: "word",
    name: "Dự án STEM: Máy lọc nước mini từ vật liệu tái chế",
    englishName: "STEM Project — Mini Water Filter",
    category: "project",
    categoryLabel: "Dự án học tập",
    description: "Kế hoạch dự án STEM môn Khoa học tự nhiên 8: vấn đề thực tế, dự toán vật liệu, nguyên lí lọc nước, tiến độ 2 tuần và rubric đánh giá.",
    subjects: "Khoa học tự nhiên · Công nghệ",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Khoa học tự nhiên",
    pageCount: 3,
    tags: ["dự án", "STEM", "lọc nước", "tái chế"],
    thumb: { layout: "project", note: "Slate · 3 trang" },
    theme: {
      name: "Project Slate", accent: "#334155", accent2: "#0e7490", soft: "#f1f5f9",
      line: "#cbd5e1", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1e293b", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "project", pattern: "project",
    },
    title: "DỰ ÁN HỌC TẬP: CHẾ TẠO MÁY LỌC NƯỚC MINI TỪ VẬT LIỆU TÁI CHẾ",
    header: commonSchoolHeader("TRƯỜNG THCS LÊ QUÝ ĐÔN", "Dự án STEM · Khoa học tự nhiên 8"),
    footer: `<div class="tpl-foot"><span>Dự án lọc nước mini · Thời gian: 2 tuần</span><span>Nhóm: ………………………</span></div>`,
    css: `
.doc-page.tpl-word-project-based-learning { padding: 54px 60px 58px; }
.tpl-word-project-based-learning .tpl-head { border-bottom: 2px solid #334155; color: #334155; font-size: 11px; }
.tpl-word-project-based-learning h1 { margin: 20px 0 4px; color: #1e293b; font-size: 20px; }
.tpl-word-project-based-learning h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-project-based-learning h2 { color: #334155; border-bottom-color: #cbd5e1; text-transform: none; letter-spacing: 0; }
.tpl-word-project-based-learning table th { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; }
.tpl-word-project-based-learning table td { border-color: #cbd5e1; }
.tpl-word-project-based-learning .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "DỰ ÁN HỌC TẬP: CHẾ TẠO MÁY LỌC NƯỚC MINI TỪ VẬT LIỆU TÁI CHẾ" },
      { type: "paragraph", text: "Dự án STEM · Môn Khoa học tự nhiên 8 · Thời gian thực hiện: 2 tuần (4 tiết trên lớp và tự làm ở nhà)", align: "center" },
      { type: "heading", level: 2, text: "1. Vấn đề thực tế" },
      { type: "paragraph", text: "Sau những trận mưa lớn, nước ở một số giếng và bể chứa bị đục, lẫn cát và cặn bẩn, chưa thể dùng ngay cho sinh hoạt. Nhiệm vụ của mỗi nhóm là thiết kế và chế tạo một mô hình lọc nước mini từ vật liệu tái chế và vật liệu rẻ tiền, sao cho nước đục sau khi qua lọc trở nên trong hơn rõ rệt." },
      { type: "paragraph", text: "Lưu ý an toàn: Nước sau khi lọc bằng mô hình này chỉ dùng để quan sát, tưới cây hoặc rửa đồ vật. Tuyệt đối không uống, vì mô hình chưa khử được vi khuẩn và chất hòa tan.", color: "#b91c1c" },
      { type: "heading", level: 2, text: "2. Mục tiêu dự án" },
      {
        type: "list",
        ordered: false,
        items: [
          "Giải thích được nguyên lí lọc cơ học qua các lớp vật liệu có kích thước hạt giảm dần.",
          "Chế tạo được mô hình hoạt động được với chi phí không quá 60.000 đồng mỗi nhóm.",
          "Đo và so sánh được độ đục của nước trước và sau khi lọc bằng quan sát có căn cứ.",
        ],
      },
      { type: "heading", level: 2, text: "3. Vật liệu và dự toán chi phí" },
      {
        type: "table",
        rows: [
          ["Vật liệu", "Số lượng", "Đơn giá dự kiến", "Thành tiền"],
          ["Chai nhựa 1,5 lít đã qua sử dụng (rửa sạch)", "2 chai", "0 đồng (tái chế)", "0 đồng"],
          ["Cát mịn đã rửa", "1 kg", "15.000 đồng", "15.000 đồng"],
          ["Sỏi nhỏ", "1 kg", "10.000 đồng", "10.000 đồng"],
          ["Than hoạt tính", "500 g", "25.000 đồng", "25.000 đồng"],
          ["Bông gòn", "1 gói", "8.000 đồng", "8.000 đồng"],
          ["Tổng chi phí dự kiến", "", "", "58.000 đồng"],
        ],
      },
      { type: "heading", level: 2, text: "4. Nguyên lí lọc của mô hình" },
      {
        type: "list",
        ordered: true,
        items: [
          "Lớp sỏi (trên cùng): giữ lại cặn bẩn kích thước lớn như lá vụn, cát thô.",
          "Lớp cát mịn: giữ lại cặn nhỏ hơn mà lớp sỏi không giữ được.",
          "Lớp than hoạt tính: hấp phụ một phần màu và mùi của nước.",
          "Lớp bông gòn (dưới cùng): lọc tinh, giữ lại cặn mịn còn sót trước khi nước chảy ra.",
        ],
      },
      { type: "heading", level: 2, text: "5. Tiến độ thực hiện" },
      {
        type: "table",
        rows: [
          ["Thời gian", "Việc cần làm", "Sản phẩm"],
          ["Tiết 1 (tuần 1)", "Tìm hiểu nguyên lí, vẽ bản thiết kế, chốt dự toán", "Bản thiết kế có ghi rõ thứ tự các lớp vật liệu"],
          ["Tuần 1 (ở nhà)", "Chuẩn bị vật liệu, cắt chai, rửa cát và sỏi", "Vật liệu đầy đủ theo dự toán"],
          ["Tiết 2–3 (tuần 2)", "Lắp ráp mô hình, thử lọc lần 1, ghi kết quả", "Mô hình hoàn chỉnh + phiếu theo dõi lần 1"],
          ["Tiết 4 (tuần 2)", "Điều chỉnh mô hình, thử lọc lần 2, báo cáo trước lớp", "Báo cáo nhóm 5 phút"],
        ],
      },
      { type: "heading", level: 2, text: "6. Phiếu theo dõi thử nghiệm" },
      {
        type: "table",
        rows: [
          ["Lần thử", "Màu và độ đục của nước trước lọc", "Sau lọc", "Nhận xét"],
          ["Lần 1", "", "", ""],
          ["Lần 2", "", "", ""],
        ],
      },
      { type: "heading", level: 2, text: "7. Tiêu chí đánh giá" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Trọng số", "Mô tả mức tốt"],
          ["Hiệu quả lọc", "30%", "Nước sau lọc trong rõ rệt so với trước lọc ở cả 2 lần thử"],
          ["Chi phí và vật liệu", "20%", "Không vượt dự toán, tận dụng vật liệu tái chế"],
          ["Báo cáo, thuyết trình", "25%", "Giải thích đúng nguyên lí, số liệu quan sát trung thực"],
          ["Hợp tác trong nhóm", "25%", "Phân công rõ, mọi thành viên đều tham gia chế tạo và báo cáo"],
        ],
      },
      { type: "heading", level: 2, text: "8. Câu hỏi cuối dự án" },
      { type: "paragraph", text: "Nếu đổi thứ tự hai lớp cát và than hoạt tính, hiệu quả lọc thay đổi như thế nào? Nhóm em căn cứ vào đâu để khẳng định điều đó?" },
      { type: "paragraph", text: "Trả lời: ………………………………………………………………………………………………………………………………………………" },
    ],
  }),

  wordTemplate({
    id: "word-english-family-worksheet",
    type: "word",
    name: "Phiếu bài tập Tiếng Anh lớp 4 — My Family",
    englishName: "Grade 4 English Worksheet — My Family",
    category: "worksheet",
    categoryLabel: "Phiếu bài tập",
    description: "Phiếu bài tập Unit 3 môn Tiếng Anh lớp 4: nối từ vựng, hoàn thành câu, đọc hiểu đoạn văn ngắn và đáp án cho giáo viên.",
    subjects: "Tiếng Anh",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 4",
    grade: 4,
    subject: "Tiếng Anh",
    pageCount: 2,
    tags: ["phiếu bài tập", "tiếng anh 4", "gia đình", "my family"],
    thumb: { layout: "worksheet", note: "Sky · 2 trang" },
    theme: {
      name: "English Sky", accent: "#0369a1", accent2: "#b45309", soft: "#f0f9ff",
      line: "#bae6fd", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#075985", heroText: "#ffffff", font: "Arial", displayFont: "Arial",
      variant: "pastel", pattern: "pastel",
    },
    title: "ENGLISH WORKSHEET — UNIT 3: MY FAMILY",
    header: `<div class="tpl-head"><span>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>English Worksheet · Grade 4</span></div>`,
    footer: `<div class="tpl-foot"><span>Phiếu bài tập Tiếng Anh 4 · Unit 3</span><span>Score: …… / 20</span></div>`,
    css: `
.doc-page.tpl-word-english-family-worksheet { padding: 54px 60px 58px; }
.tpl-word-english-family-worksheet .tpl-head { border-bottom: 2px solid #0369a1; color: #075985; font-size: 11px; }
.tpl-word-english-family-worksheet h1 { margin: 20px 0 4px; color: #075985; font-size: 21px; }
.tpl-word-english-family-worksheet h1 + p { margin: 0 0 16px; text-align: center; color: #64748b; font-size: 12.5px; }
.tpl-word-english-family-worksheet h2 { color: #0369a1; border-bottom-color: #bae6fd; text-transform: none; letter-spacing: 0; }
.tpl-word-english-family-worksheet table th { background: #f0f9ff; color: #075985; border-color: #bae6fd; }
.tpl-word-english-family-worksheet table td { border-color: #cbd5e1; }
.tpl-word-english-family-worksheet img { display: block; width: 100%; margin: 12px 0 6px; border: 1px solid #e2e8f0; }
.tpl-word-english-family-worksheet img + p { text-align: center; color: #78716c; font-size: 11.5px; font-style: italic; }
.tpl-word-english-family-worksheet .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "ENGLISH WORKSHEET — UNIT 3: MY FAMILY" },
      { type: "paragraph", text: "Name: ………………………………… · Class: 4A… · Time: 30 minutes", align: "center" },
      { type: "heading", level: 2, text: "Part 1. Match the words with their meanings (6 points)" },
      {
        type: "table",
        rows: [
          ["A. English", "B. Vietnamese"],
          ["1. father", "a. anh trai / em trai"],
          ["2. mother", "b. ông"],
          ["3. brother", "c. bố"],
          ["4. sister", "d. mẹ"],
          ["5. grandfather", "e. chị gái / em gái"],
          ["6. grandmother", "f. bà"],
        ],
      },
      { type: "heading", level: 2, text: "Part 2. Look at the picture and complete the sentences (5 points)" },
      { type: "image", src: englishFamilyImg, alt: "Minh and his family" },
      { type: "paragraph", text: "Minh's family: his father, his mother, his grandmother and Minh." },
      { type: "paragraph", text: "Word bank: father · mother · grandmother · brother · family" },
      {
        type: "list",
        ordered: true,
        items: [
          "There are four people in Minh's ………………… .",
          "The man in the blue shirt is Minh's ………………… .",
          "The woman in the red dress is Minh's ………………… .",
          "The old woman with grey hair is Minh's ………………… .",
          "Minh has no sisters and no ………………… .",
        ],
      },
      { type: "heading", level: 2, text: "Part 3. Read and answer the questions (5 points)" },
      { type: "paragraph", text: "Hello! My name is Linh. I am nine years old. There are four people in my family: my father, my mother, my brother and me. My father is a teacher. My mother is a nurse. My brother is a student. He is twelve years old. I love my family very much." },
      {
        type: "list",
        ordered: true,
        items: [
          "How old is Linh?",
          "How many people are there in her family?",
          "What does her father do?",
          "Is her mother a doctor?",
        ],
      },
      { type: "heading", level: 2, text: "Part 4. Write about your family (4 points)" },
      { type: "paragraph", text: "Write 3 sentences about your family. You can start with: “There are … people in my family.”" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "Answer key (for teachers)" },
      {
        type: "list",
        ordered: false,
        items: [
          "Part 1: 1 – c; 2 – d; 3 – a; 4 – e; 5 – b; 6 – f.",
          "Part 2: 1. family; 2. father; 3. mother; 4. grandmother; 5. brother.",
          "Part 3: 1. She is nine years old. 2. There are four people. 3. He is a teacher. 4. No, she isn't. She is a nurse.",
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-vietnamese-midterm-exam",
    type: "word",
    name: "Đề kiểm tra giữa học kì I — Tiếng Việt 5 (có ma trận, đáp án)",
    englishName: "Grade 5 Vietnamese Midterm Exam",
    category: "exam",
    categoryLabel: "Đề kiểm tra",
    description: "Đề kiểm tra giữa học kì I môn Tiếng Việt lớp 5: bài đọc hiểu viết riêng cho đề, phần luyện từ và câu, tập làm văn, kèm ma trận và biểu điểm.",
    subjects: "Tiếng Việt",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 5",
    grade: 5,
    subject: "Tiếng Việt",
    pageCount: 3,
    tags: ["đề kiểm tra", "giữa học kì", "tiếng việt 5", "ma trận đề", "đáp án"],
    thumb: { layout: "exam", note: "Formal · 3 trang" },
    theme: {
      name: "Formal Exam Primary", accent: "#374151", accent2: "#92400e", soft: "#f9fafb",
      line: "#9ca3af", ink: "#111827", muted: "#6b7280", bg: "#ffffff",
      heroBg: "#374151", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "exam", pattern: "exam",
    },
    title: "ĐỀ KIỂM TRA GIỮA HỌC KÌ I — MÔN TIẾNG VIỆT 5",
    header: `<div class="tpl-head"><span>PHÒNG GD&amp;ĐT QUẬN 1<br>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>ĐỀ KIỂM TRA GIỮA HỌC KÌ I<br>Năm học 2026–2027</span></div>`,
    footer: `<div class="tpl-foot"><span>Đề kiểm tra Tiếng Việt 5 · Giữa học kì I</span><span>Trang 1/3</span></div>`,
    css: `
.doc-page.tpl-word-vietnamese-midterm-exam { padding: 52px 58px 56px; font-size: 14px; line-height: 1.65; }
.tpl-word-vietnamese-midterm-exam .tpl-head { border-bottom: 1.5px solid #111827; font-size: 11px; text-transform: none; letter-spacing: 0; }
.tpl-word-vietnamese-midterm-exam h1 { margin: 20px 0 4px; padding-bottom: 8px; border-bottom: 3px double #111827; color: #111827; font-size: 19px; }
.tpl-word-vietnamese-midterm-exam h1 + p { margin: 4px 0 16px; text-align: center; color: #4b5563; font-size: 13px; font-style: italic; }
.tpl-word-vietnamese-midterm-exam h2 { color: #111827; border-bottom-color: #9ca3af; text-transform: none; letter-spacing: 0; }
.tpl-word-vietnamese-midterm-exam table th { background: #f9fafb; color: #111827; border-color: #9ca3af; }
.tpl-word-vietnamese-midterm-exam table td { border-color: #9ca3af; }
.tpl-word-vietnamese-midterm-exam img { display: block; width: 100%; margin: 12px 0 6px; border: 1px solid #d1d5db; }
.tpl-word-vietnamese-midterm-exam img + p { text-align: center; color: #6b7280; font-size: 11.5px; font-style: italic; }
.tpl-word-vietnamese-midterm-exam .tpl-foot { color: #6b7280; }
`,
    blocks: [
      { type: "heading", level: 1, text: "ĐỀ KIỂM TRA GIỮA HỌC KÌ I — MÔN TIẾNG VIỆT 5" },
      { type: "paragraph", text: "Thời gian làm bài: 60 phút (không kể thời gian phát đề)", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên học sinh", blank, "Lớp", "5A…"],
          ["Trường", "Tiểu học Hòa Bình", "Ngày kiểm tra", "…/…/2026"],
          ["Điểm", "………………", "Nhận xét của giáo viên", "………………"],
        ],
      },
      { type: "heading", level: 2, text: "Ma trận đề kiểm tra" },
      {
        type: "table",
        rows: [
          ["Mạch kiến thức", "Nhận biết", "Thông hiểu", "Vận dụng", "Tổng"],
          ["Đọc hiểu văn bản", "2 câu TN (1,0 điểm)", "1 câu TN (0,5 điểm) + 1 câu TL (1,0 điểm)", "1 câu TN (0,5 điểm) + 1 câu TL (1,0 điểm)", "4,0 điểm"],
          ["Luyện từ và câu", "—", "1 bài (1,0 điểm)", "1 bài (1,0 điểm)", "2,0 điểm"],
          ["Tập làm văn", "—", "—", "1 bài (4,0 điểm)", "4,0 điểm"],
          ["Tổng", "1,0 điểm", "2,5 điểm", "6,5 điểm", "10,0 điểm"],
        ],
      },
      { type: "heading", level: 2, text: "A. ĐỌC HIỂU VĂN BẢN (4,0 điểm)" },
      { type: "paragraph", text: "Đọc thầm đoạn văn sau:" },
      { type: "paragraph", text: "CÂY ĐA ĐẦU LÀNG" },
      { type: "paragraph", text: "Ở đầu làng em có một cây đa rất to. Không ai biết cây đã sống bao nhiêu năm, chỉ biết từ khi ông nội em còn nhỏ, cây đã đứng đó với thân xù xì và tán lá rộng như một chiếc ô khổng lồ che mát cả khoảng đất trống. Từ thân cây, những chùm rễ phụ buông xuống như bộ râu bạc của một ông cụ hiền lành. Mỗi khi có cơn gió nhẹ, lá đa lại xào xạc như đang thì thầm kể chuyện xưa." },
      { type: "paragraph", text: "Trưa hè, sau buổi làm đồng, các bác nông dân thường ra gốc đa nghỉ chân, uống bát nước chè xanh và trò chuyện rôm rả. Bọn trẻ chúng em thì thích ngồi dưới bóng mát của cây để chơi ô ăn quan, đọc truyện. Trên những cành cao, mấy chú chim sáo làm tổ, hót líu lo suốt buổi sáng. Cây đa không chỉ cho bóng mát mà còn là nơi gắn bó với bao kỉ niệm của người dân làng em." },
      { type: "image", src: vietnameseReadingImg, alt: "Cây đa ở đầu làng" },
      { type: "paragraph", text: "Cây đa đầu làng — nơi nghỉ chân quen thuộc của người dân quê em." },
      { type: "paragraph", text: "Dựa vào nội dung bài đọc, khoanh vào chữ cái trước ý trả lời đúng:" },
      {
        type: "list",
        ordered: true,
        items: [
          "Cây đa trong bài đứng ở vị trí nào? A. Bên bờ sông    B. Ở đầu làng    C. Giữa sân trường    D. Sau đình làng.",
          "Những chùm rễ phụ của cây đa được so sánh với hình ảnh nào? A. Một chiếc ô khổng lồ    B. Tấm lưới lớn    C. Bộ râu bạc của ông cụ    D. Những sợi dây thừng.",
          "Vì sao trưa hè, mọi người thích ra gốc đa? A. Vì ở đó có quán nước    B. Vì tán cây rộng, cho bóng mát    C. Vì ở đó yên tĩnh, không có ai    D. Vì ở đó gần cánh đồng nhất.",
          "Dòng nào dưới đây nói đúng nhất ý nghĩa của cây đa đối với người dân trong làng? A. Cây đa chỉ để lấy gỗ    B. Cây đa là nơi bán hàng buổi trưa    C. Cây đa cho bóng mát và gắn với nhiều kỉ niệm của dân làng    D. Cây đa là nơi chim sáo làm tổ.",
        ],
      },
      { type: "paragraph", text: "Trả lời câu hỏi:" },
      { type: "paragraph", text: "Câu 5 (1,0 điểm). Em thích nhất chi tiết nào trong bài đọc? Vì sao?" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: "Câu 6 (1,0 điểm). Viết một câu văn có hình ảnh so sánh nói về tán lá của cây đa." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "B. LUYỆN TỪ VÀ CÂU (2,0 điểm)" },
      { type: "paragraph", text: "Câu 1 (1,0 điểm). Tìm trong bài đọc một từ đồng nghĩa với mỗi từ sau: a) to lớn; b) nói chuyện vui vẻ, sôi nổi." },
      { type: "paragraph", text: "Câu 2 (1,0 điểm). Đặt một câu có từ “chân” được dùng với nghĩa chuyển (không phải bộ phận của cơ thể người)." },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "C. TẬP LÀM VĂN (4,0 điểm)" },
      { type: "paragraph", text: "Đề bài: Tả một cây bóng mát ở sân trường em hoặc nơi em ở." },
      { type: "paragraph", text: "Gợi ý: Mở bài — giới thiệu cây em tả (tên cây, cây ở đâu). Thân bài — tả bao quát (dáng cây, tán lá), tả từng bộ phận (thân, cành, lá, hoa hoặc quả), tả hoạt động của mọi người dưới bóng cây. Kết bài — nêu cảm nghĩ của em về cây và mong muốn của em đối với cây." },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "ĐÁP ÁN VÀ BIỂU ĐIỂM (dành cho giáo viên)" },
      {
        type: "list",
        ordered: false,
        items: [
          "Phần A — trắc nghiệm (mỗi câu 0,5 điểm): 1 – B; 2 – C; 3 – B; 4 – C.",
          "Câu 5 (1,0 điểm): Học sinh nêu được chi tiết yêu thích (0,5 điểm) và giải thích hợp lí, có liên hệ với nội dung bài (0,5 điểm).",
          "Câu 6 (1,0 điểm): Câu văn có hình ảnh so sánh đúng, hợp lí (0,75 điểm), đúng chính tả và ngữ pháp (0,25 điểm). Ví dụ: “Tán lá đa xòe rộng như một chiếc ô xanh che mát cả khoảng sân.”",
          "Phần B — Câu 1: a) khổng lồ; b) rôm rả (mỗi từ 0,5 điểm). Câu 2: Câu có từ “chân” dùng với nghĩa chuyển, ví dụ “Chân bàn bị gãy một chiếc.” (1,0 điểm).",
          "Phần C (4,0 điểm): Bố cục đủ 3 phần (1,0 điểm); tả được bao quát và các bộ phận chính của cây, có thứ tự hợp lí (1,5 điểm); có hình ảnh so sánh hoặc nhân hóa, câu văn có cảm xúc (1,0 điểm); chữ viết, chính tả, trình bày (0,5 điểm).",
        ],
      },
    ],
  }),
  wordTemplate({
    id: "word-team-meeting-minutes",
    type: "word",
    name: "Biên bản họp tổ chuyên môn",
    englishName: "Department Meeting Minutes",
    category: "report",
    categoryLabel: "Báo cáo",
    description: "Biên bản họp tổ chuyên môn đúng thể thức văn bản hành chính: thành phần, nội dung thảo luận, kết luận và bảng phân công có hạn hoàn thành.",
    subjects: "Công tác tổ chuyên môn",
    levels: ["Tiểu học", "Không giới hạn"],
    levelKeys: ["primary", "unlimited"],
    gradeRange: "Giáo viên",
    grade: 5,
    subject: "Tổng hợp",
    pageCount: 2,
    tags: ["biên bản", "họp tổ chuyên môn", "hành chính", "phân công"],
    thumb: { layout: "report", note: "Hành chính · 2 trang" },
    theme: {
      name: "Administrative", accent: "#374151", accent2: "#6b7280", soft: "#f9fafb",
      line: "#d1d5db", ink: "#111827", muted: "#6b7280", bg: "#ffffff",
      heroBg: "#374151", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "exam", pattern: "report",
    },
    title: "BIÊN BẢN HỌP TỔ CHUYÊN MÔN KHỐI 4, 5",
    header: `<div class="tpl-head"><span><img src="${meetingMinutesImg}" alt="Biểu trưng nhà trường" style="height:34px;width:auto;vertical-align:middle;margin-right:8px">PHÒNG GD&amp;ĐT QUẬN 1<br>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập – Tự do – Hạnh phúc</span></div>`,
    footer: `<div class="tpl-foot"><span>Biên bản họp tổ chuyên môn khối 4, 5</span><span>Lưu: Hồ sơ tổ chuyên môn</span></div>`,
    css: `
.doc-page.tpl-word-team-meeting-minutes { padding: 52px 58px 56px; font-size: 14px; line-height: 1.65; }
.tpl-word-team-meeting-minutes .tpl-head { border-bottom: 1.5px solid #111827; font-size: 11px; text-transform: none; letter-spacing: 0; align-items: flex-start; }
.tpl-word-team-meeting-minutes .tpl-head span:last-child { text-align: center; }
.tpl-word-team-meeting-minutes h1 { margin: 20px 0 4px; color: #111827; font-size: 19px; }
.tpl-word-team-meeting-minutes h1 + p { margin: 0 0 16px; text-align: center; color: #4b5563; font-size: 13px; }
.tpl-word-team-meeting-minutes h2 { color: #111827; border-bottom: 0; text-transform: none; letter-spacing: 0; font-size: 15px; }
.tpl-word-team-meeting-minutes table th { background: #f9fafb; color: #111827; border-color: #9ca3af; }
.tpl-word-team-meeting-minutes table td { border-color: #9ca3af; }
.tpl-word-team-meeting-minutes .tpl-foot { color: #6b7280; }
`,
    blocks: [
      { type: "heading", level: 1, text: "BIÊN BẢN HỌP TỔ CHUYÊN MÔN KHỐI 4, 5" },
      { type: "paragraph", text: "Cuộc họp định kỳ tháng 11 năm 2026", align: "center" },
      { type: "heading", level: 2, text: "I. Thời gian, địa điểm" },
      { type: "paragraph", text: "Cuộc họp bắt đầu lúc 14 giờ 00 phút, kết thúc lúc 16 giờ 00 phút, Thứ Tư, ngày 04 tháng 11 năm 2026, tại phòng họp tầng 2, Trường Tiểu học Hòa Bình." },
      { type: "heading", level: 2, text: "II. Thành phần tham dự" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chủ trì: Thầy Trần Văn Hùng — Tổ trưởng tổ chuyên môn khối 4, 5.",
          "Thư ký: Cô Phạm Thu Hà — Giáo viên lớp 5A.",
          "Thành viên: 08 giáo viên khối 4 và khối 5 (có mặt 07, vắng 01 — cô Lê Thị Mai, có phép do ốm).",
        ],
      },
      { type: "heading", level: 2, text: "III. Nội dung cuộc họp" },
      { type: "paragraph", text: "1. Đánh giá công tác dạy học tháng 10/2026" },
      { type: "paragraph", text: "Tổ đã dự giờ 12 tiết (khối 4: 5 tiết, khối 5: 7 tiết), trong đó 9 tiết xếp loại tốt, 3 tiết xếp loại khá. Các tiết dạy đều chuẩn bị đầy đủ đồ dùng, tổ chức hoạt động nhóm tốt; một số tiết còn chưa phân bổ hợp lí thời gian cho phần luyện tập. Việc kiểm tra, chữa bài cho học sinh được thực hiện thường xuyên; tỉ lệ học sinh hoàn thành bài tập về nhà đạt khoảng 95%." },
      { type: "paragraph", text: "2. Thống nhất cấu trúc đề kiểm tra giữa học kì I" },
      { type: "paragraph", text: "Tổ thống nhất: đề kiểm tra các môn Toán và Tiếng Việt xây dựng theo ma trận 3 mức độ (nhận biết 40%, thông hiểu 40%, vận dụng 20%); thời gian làm bài 40 phút đối với môn Toán và 60 phút đối với môn Tiếng Việt (gồm đọc hiểu và viết). Mỗi khối cử một giáo viên ra đề, một giáo viên phản biện; đề và đáp án nộp về tổ trưởng trước ngày 10/11/2026 để duyệt." },
      { type: "paragraph", text: "3. Kế hoạch công tác tháng 11/2026" },
      {
        type: "list",
        ordered: false,
        items: [
          "Tổ chức kiểm tra giữa học kì I trong tuần 12 (từ ngày 16/11 đến 20/11/2026).",
          "Sinh hoạt chuyên đề “Dạy học phân hóa trong môn Toán lớp 5” vào chiều Thứ Tư, ngày 18/11/2026, do cô Phạm Thu Hà trình bày.",
          "Các lớp tiếp tục bồi dưỡng học sinh chưa hoàn thành môn Toán và Tiếng Việt vào các buổi chiều thứ Ba, thứ Năm.",
        ],
      },
      { type: "heading", level: 2, text: "IV. Kết luận và phân công" },
      {
        type: "table",
        rows: [
          ["Công việc", "Người thực hiện", "Hạn hoàn thành"],
          ["Ra đề và đáp án kiểm tra giữa kì I môn Toán khối 5", "Cô Nguyễn Thị Lan", "10/11/2026"],
          ["Ra đề và đáp án kiểm tra giữa kì I môn Tiếng Việt khối 5", "Thầy Trần Văn Hùng", "10/11/2026"],
          ["Chuẩn bị bài trình bày chuyên đề dạy học phân hóa", "Cô Phạm Thu Hà", "16/11/2026"],
          ["Lên lịch bồi dưỡng học sinh chưa hoàn thành của hai khối", "Giáo viên chủ nhiệm các lớp", "09/11/2026"],
        ],
      },
      { type: "paragraph", text: "Cuộc họp kết thúc lúc 16 giờ 00 phút cùng ngày. Biên bản được đọc lại, các thành viên dự họp nhất trí với nội dung trên." },
      {
        type: "table",
        rows: [
          ["THƯ KÝ", "CHỦ TRÌ — TỔ TRƯỞNG"],
          ["(Ký, ghi rõ họ tên)", "(Ký, ghi rõ họ tên)"],
          ["Phạm Thu Hà", "Trần Văn Hùng"],
        ],
      },
    ],
  }),

  wordTemplate({
    id: "word-informatics-lesson-plan",
    type: "word",
    name: "Kế hoạch bài dạy Tin học lớp 5 — Tìm kiếm thông tin trên Internet",
    englishName: "Grade 5 Informatics Lesson Plan",
    category: "lesson-plan",
    categoryLabel: "Giáo án",
    description: "Kế hoạch bài dạy Tin học 5 theo GDPT 2018: năng lực số, thực hành tìm kiếm trên máy tính và nội dung an toàn khi dùng Internet.",
    subjects: "Tin học",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 5",
    grade: 5,
    subject: "Tin học",
    pageCount: 3,
    tags: ["giáo án", "tin học 5", "internet", "an toàn thông tin", "GDPT 2018"],
    thumb: { layout: "classic", note: "Slate · 3 trang" },
    theme: {
      name: "Informatics Slate", accent: "#334155", accent2: "#0e7490", soft: "#f1f5f9",
      line: "#cbd5e1", ink: "#1f2937", muted: "#64748b", bg: "#ffffff",
      heroBg: "#334155", heroText: "#ffffff", font: "Times New Roman", displayFont: "Times New Roman",
      variant: "navy", pattern: "classic",
    },
    title: "KẾ HOẠCH BÀI DẠY — TÌM KIẾM THÔNG TIN TRÊN INTERNET",
    header: `<div class="tpl-head"><span>PHÒNG GD&amp;ĐT QUẬN 1<br>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>Tổ chuyên môn khối 4, 5<br>Năm học 2026–2027</span></div>`,
    footer: `<div class="tpl-foot"><span>Kế hoạch bài dạy Tin học 5 · Bài 8</span><span>Giáo viên: Đặng Quốc Bảo</span></div>`,
    css: `
.doc-page.tpl-word-informatics-lesson-plan { padding: 54px 62px 58px; font-size: 14px; line-height: 1.6; }
.tpl-word-informatics-lesson-plan .tpl-head { border-bottom: 1.5px solid #1f2937; font-size: 11px; text-transform: none; letter-spacing: 0; }
.tpl-word-informatics-lesson-plan h1 { margin: 22px 0 4px; color: #1f2937; font-size: 20px; }
.tpl-word-informatics-lesson-plan h1 + p { margin: 0 0 2px; text-align: center; font-weight: 700; font-size: 14.5px; }
.tpl-word-informatics-lesson-plan h2 { color: #334155; border-bottom: 0; text-transform: none; letter-spacing: 0; font-size: 15px; }
.tpl-word-informatics-lesson-plan table th { background: #f1f5f9; color: #1f2937; }
.tpl-word-informatics-lesson-plan img { display: block; width: 100%; margin: 12px 0 6px; border: 1px solid #cbd5e1; }
.tpl-word-informatics-lesson-plan img + p { text-align: center; color: #64748b; font-size: 11.5px; font-style: italic; }
.tpl-word-informatics-lesson-plan .tpl-foot { color: #64748b; }
`,
    blocks: [
      { type: "heading", level: 1, text: "KẾ HOẠCH BÀI DẠY" },
      { type: "paragraph", text: "Môn: Tin học — Lớp 5 · Bài 8: Tìm kiếm thông tin trên Internet", align: "center" },
      { type: "paragraph", text: "Tiết 15 · Tuần 15 · Thời lượng: 35 phút · Địa điểm: Phòng máy tính", align: "center" },
      {
        type: "table",
        rows: [
          ["Hạng mục", "Nội dung"],
          ["Giáo viên dạy", "Đặng Quốc Bảo"],
          ["Lớp", "5A — sĩ số 36 học sinh, thực hành theo cặp 2 em / máy"],
          ["Thiết bị", "Phòng máy 20 máy tính có kết nối Internet, máy chiếu, phiếu thực hành"],
        ],
      },
      { type: "image", src: computerLabImg, alt: "Giao diện trang tìm kiếm trên máy tính của trường" },
      { type: "paragraph", text: "Hình minh họa: giao diện trang tìm kiếm mà học sinh sẽ sử dụng trong bài học." },
      { type: "heading", level: 2, text: "I. Yêu cầu cần đạt" },
      {
        type: "list",
        ordered: false,
        items: [
          "Năng lực số: Biết cách nhập từ khóa để tìm kiếm thông tin trên Internet phục vụ học tập; chọn được kết quả tìm kiếm phù hợp và ghi lại nguồn thông tin.",
          "Năng lực tự chủ và tự học: Tự thực hiện được nhiệm vụ tìm kiếm theo phiếu thực hành, biết nhờ hỗ trợ khi gặp trang web lạ.",
          "Phẩm chất: Có ý thức sử dụng Internet an toàn — không bấm vào quảng cáo lạ, không chia sẻ họ tên, địa chỉ, số điện thoại của bản thân và gia đình lên mạng.",
        ],
      },
      { type: "heading", level: 2, text: "II. Đồ dùng dạy học" },
      {
        type: "list",
        ordered: false,
        items: [
          "Giáo viên: máy chiếu trình chiếu thao tác mẫu, danh sách trang web học tập tin cậy (thư viện bài giảng của trường, báo Thiếu niên Tiền phong điện tử, trang của Bảo tàng Lịch sử Quốc gia).",
          "Học sinh: phiếu thực hành, bút ghi kết quả tìm kiếm.",
        ],
      },
      { type: "heading", level: 2, text: "III. Tiến trình dạy học" },
      {
        type: "table",
        rows: [
          ["Hoạt động (thời gian)", "Nội dung chính", "Sản phẩm / đánh giá"],
          ["1. Khởi động (5 phút)", "Giáo viên hỏi: “Muốn biết ngày mai trời mưa hay nắng, em sẽ làm thế nào?” Học sinh nêu các cách, giáo viên dẫn vào bài: dùng Internet để tìm kiếm thông tin.", "Học sinh nêu được ít nhất 2 cách tìm thông tin."],
          ["2. Hình thành kiến thức (12 phút)", "Giáo viên thao tác mẫu: mở trình duyệt, nhập từ khóa ngắn gọn và rõ nghĩa (ví dụ: “thời tiết Hà Nội ngày mai”), đọc trang kết quả, chọn kết quả từ trang tin cậy và ghi lại nguồn.", "Học sinh nhắc lại được 3 bước tìm kiếm: nhập từ khóa — chọn kết quả — ghi nguồn."],
          ["3. Thực hành (13 phút)", "Học sinh làm việc theo cặp, hoàn thành 2 nhiệm vụ trong phiếu: (1) Tìm hiểu “cách trồng và chăm sóc cây đậu” để chuẩn bị cho bài Khoa học; (2) Tìm một thông tin về Lăng Chủ tịch Hồ Chí Minh.", "Phiếu thực hành ghi đủ: từ khóa đã dùng, tên trang web nguồn, thông tin tìm được."],
          ["4. Vận dụng, an toàn (5 phút)", "Giáo viên nêu 3 tình huống an toàn (trang web hiện quảng cáo trúng thưởng; người lạ nhắn tin hỏi địa chỉ nhà; trang web bắt nhập số điện thoại) và yêu cầu học sinh chọn cách xử lí đúng.", "Học sinh trả lời đúng cả 3 tình huống: đóng trang/báo người lớn, không trả lời, không nhập thông tin."],
        ],
      },
      { type: "heading", level: 2, text: "IV. Đánh giá" },
      {
        type: "list",
        ordered: false,
        items: [
          "Đánh giá qua phiếu thực hành: hoàn thành 2 nhiệm vụ, ghi đúng nguồn thông tin.",
          "Đánh giá qua câu hỏi tình huống an toàn cuối tiết.",
          "Nhận xét, biểu dương các cặp biết chọn từ khóa ngắn gọn và biết đối chiếu thông tin ở 2 trang web khác nhau.",
        ],
      },
      { type: "heading", level: 2, text: "V. Hướng dẫn về nhà" },
      { type: "paragraph", text: "Cùng người thân ở nhà, em hãy tìm kiếm một thông tin phục vụ học tập (ví dụ: giờ mở cửa của thư viện tỉnh) và ghi lại từ khóa cùng tên trang web vào vở. Không tự ý dùng Internet khi không có người lớn ở bên." },
    ],
  }),

  wordTemplate({
    id: "word-vietnamese-writing-practice",
    type: "word",
    name: "Phiếu luyện viết đoạn văn — Tiếng Việt lớp 3",
    englishName: "Grade 3 Vietnamese Writing Practice",
    category: "worksheet",
    categoryLabel: "Phiếu bài tập",
    description: "Phiếu luyện viết đoạn văn kể về một việc tốt em đã làm: dàn ý gợi ý, từ ngữ gợi ý, đoạn văn mẫu viết hoàn chỉnh và phần tự viết.",
    subjects: "Tiếng Việt",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 3",
    grade: 3,
    subject: "Tiếng Việt",
    pageCount: 2,
    tags: ["phiếu bài tập", "tiếng việt 3", "luyện viết", "đoạn văn"],
    thumb: { layout: "study", note: "Ấm · 2 trang" },
    theme: {
      name: "Writing Warm", accent: "#92400e", accent2: "#b45309", soft: "#fffbeb",
      line: "#fde68a", ink: "#292524", muted: "#78716c", bg: "#ffffff",
      heroBg: "#92400e", heroText: "#ffffff", font: "Arial", displayFont: "Georgia",
      variant: "pastel", pattern: "study",
    },
    title: "PHIẾU LUYỆN VIẾT ĐOẠN VĂN — KỂ VỀ MỘT VIỆC TỐT EM ĐÃ LÀM",
    header: `<div class="tpl-head"><span>TRƯỜNG TIỂU HỌC HÒA BÌNH</span><span>Phiếu luyện viết · Tiếng Việt 3</span></div>`,
    footer: `<div class="tpl-foot"><span>Phiếu luyện viết Tiếng Việt 3</span><span>Nhận xét của giáo viên: …………………………</span></div>`,
    css: `
.doc-page.tpl-word-vietnamese-writing-practice { padding: 54px 60px 58px; }
.tpl-word-vietnamese-writing-practice .tpl-head { border-bottom: 2px solid #92400e; color: #92400e; font-size: 11px; }
.tpl-word-vietnamese-writing-practice h1 { margin: 20px 0 4px; color: #92400e; font-size: 20px; }
.tpl-word-vietnamese-writing-practice h1 + p { margin: 0 0 16px; text-align: center; color: #78716c; font-size: 12.5px; }
.tpl-word-vietnamese-writing-practice h2 { color: #92400e; border-bottom-color: #fde68a; text-transform: none; letter-spacing: 0; }
.tpl-word-vietnamese-writing-practice table th { background: #fffbeb; color: #92400e; border-color: #fde68a; }
.tpl-word-vietnamese-writing-practice table td { border-color: #e7e5e4; }
.tpl-word-vietnamese-writing-practice img { display: block; width: 100%; margin: 12px 0 6px; border: 1px solid #e7e5e4; }
.tpl-word-vietnamese-writing-practice img + p { text-align: center; color: #78716c; font-size: 11.5px; font-style: italic; }
.tpl-word-vietnamese-writing-practice .tpl-foot { color: #78716c; }
`,
    blocks: [
      { type: "heading", level: 1, text: "PHIẾU LUYỆN VIẾT ĐOẠN VĂN" },
      { type: "paragraph", text: "Đề bài: Kể về một việc tốt em đã làm · Tiếng Việt lớp 3 · Thời gian: 30 phút", align: "center" },
      {
        type: "table",
        rows: [
          ["Họ và tên", blank, "Lớp", "3A…"],
        ],
      },
      { type: "heading", level: 2, text: "1. Gợi ý dàn ý" },
      {
        type: "table",
        rows: [
          ["Phần của đoạn văn", "Câu hỏi gợi ý"],
          ["Câu mở đoạn", "Việc tốt đó là việc gì? Xảy ra khi nào, ở đâu?"],
          ["Các câu phát triển đoạn", "Em đã làm những gì? Có ai cùng tham gia hoặc chứng kiến không? Người được em giúp đỡ nói gì, làm gì?"],
          ["Câu kết đoạn", "Em cảm thấy thế nào sau khi làm việc tốt đó?"],
        ],
      },
      { type: "heading", level: 2, text: "2. Từ ngữ gợi ý" },
      {
        type: "list",
        ordered: false,
        items: [
          "Từ chỉ thứ tự: đầu tiên, sau đó, tiếp theo, cuối cùng.",
          "Từ chỉ cảm xúc: vui, tự hào, ấm lòng, hồi hộp.",
          "Câu nói thường gặp: “Em cảm ơn anh/chị ạ!”, “Việc nhỏ thôi mà!”.",
        ],
      },
      { type: "heading", level: 2, text: "3. Đoạn văn mẫu" },
      { type: "paragraph", text: "Sáng thứ Hai tuần trước, khi em vừa đến cổng trường thì trời bỗng đổ mưa. Em nhìn thấy một bạn học sinh lớp 1 đứng nép dưới mái hiên, ôm chặt chiếc cặp trước ngực vì không có ô. Em liền chạy lại, giơ chiếc ô của mình lên và nói: “Em đi cùng ô với chị nhé!”. Hai chị em cùng đi vào lớp, vai em bị ướt một chút nhưng em thấy rất vui. Trước khi vào lớp, bạn ấy quay lại nói: “Em cảm ơn chị ạ!”. Nghe câu nói ấy, em cảm thấy ấm lòng và tự nhủ sẽ giúp đỡ mọi người nhiều hơn." },
      { type: "image", src: writingPracticeImg, alt: "Minh họa phiếu luyện viết đoạn văn" },
      { type: "paragraph", text: "Minh họa: Một chiếc khăn quàng đỏ được trao lại cho bạn nhỏ — những việc tốt quanh em đều có thể trở thành đoạn văn hay." },
      { type: "heading", level: 2, text: "4. Phần em tự viết" },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "paragraph", text: blank },
      { type: "heading", level: 2, text: "5. Tự đánh giá đoạn văn của em" },
      {
        type: "table",
        rows: [
          ["Tiêu chí", "Đã đạt", "Chưa đạt"],
          ["Đoạn văn có đủ câu mở đoạn, các câu phát triển và câu kết đoạn", "☐", "☐"],
          ["Em kể rõ việc tốt theo thứ tự thời gian", "☐", "☐"],
          ["Em viết hoa đầu câu và có dấu chấm cuối câu", "☐", "☐"],
          ["Chữ viết sạch, rõ ràng", "☐", "☐"],
        ],
      },
    ],
  }),
];

// ═══════════════════════════════════════════════════════════════════════
// 15 MẪU POWERPOINT
// ═══════════════════════════════════════════════════════════════════════

export const POWERPOINT_TEMPLATES = [
  pptTemplate({
    id: "ppt-modern-classroom",
    type: "powerpoint",
    name: "Bài giảng Toán lớp 3 — Chu vi hình chữ nhật",
    englishName: "Grade 3 Math — Perimeter of a Rectangle",
    category: "primary",
    categoryLabel: "Giáo dục tiểu học",
    description: "Bộ slide Toán lớp 3 về chu vi hình chữ nhật: ví dụ có lời giải, bảng luyện tập kèm đáp án và các lỗi thường gặp.",
    subjects: "Toán",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 3",
    grade: 3,
    subject: "Toán",
    tags: ["toán 3", "chu vi", "hình chữ nhật", "bài giảng"],
    thumb: { layout: "modern", note: "9 slide · 16:9" },
    theme: {
      name: "Modern Classroom", accent: "#2563eb", accent2: "#d97706", soft: "#eff6ff",
      line: "#bfdbfe", ink: "#1e293b", muted: "#64748b", bg: "#ffffff",
      heroBg: "#1d4ed8", heroText: "#ffffff", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "modern", pattern: "modern",
    },
    title: "CHU VI HÌNH CHỮ NHẬT",
    css: `.slide h2 { letter-spacing: 0; }`,
    slides: [
      { type: "title", title: "CHU VI HÌNH CHỮ NHẬT", subtitle: "Trường Tiểu học Hòa Bình · Lớp 3A · Môn Toán" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Học xong bài này, em sẽ:",
          "Nhận biết được chiều dài, chiều rộng của hình chữ nhật.",
          "Biết quy tắc tính chu vi hình chữ nhật.",
          "Tính được chu vi của các vật có dạng hình chữ nhật trong thực tế.",
        ],
      },
      {
        type: "content",
        title: "Khởi động: Quan sát quanh em",
        content: [
          "Mặt bàn học của em có dạng hình gì?",
          "Khung ảnh treo trên tường lớp mình có mấy cạnh? Các cạnh đối diện có bằng nhau không?",
          "Nếu muốn mua một sợi dây viền quanh khung ảnh, em cần biết điều gì?",
        ],
      },
      {
        type: "content",
        title: "Kiến thức mới",
        content: [
          "Hình chữ nhật có 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau.",
          "Cạnh dài gọi là chiều dài, cạnh ngắn gọi là chiều rộng.",
          "Chu vi hình chữ nhật bằng chiều dài cộng chiều rộng, được bao nhiêu nhân với 2.",
          "Quy tắc: Muốn tính chu vi hình chữ nhật, ta lấy chiều dài cộng với chiều rộng (cùng đơn vị đo) rồi nhân với 2.",
        ],
      },
      {
        type: "two-column",
        title: "Ví dụ",
        left: [
          "Ví dụ 1: Hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm.",
          "Chu vi là: (8 + 5) × 2 = 26 (cm).",
          "Đáp số: 26 cm.",
        ],
        right: [
          "Ví dụ 2: Sân trường hình chữ nhật có chiều dài 60 m, chiều rộng 40 m.",
          "Chu vi sân trường là: (60 + 40) × 2 = 200 (m).",
          "Đáp số: 200 m.",
        ],
      },
      { type: "image", title: "Vận dụng vào thực tế", src: modernClassroomImg, caption: "Đo chiều dài và chiều rộng của mặt bàn để tính chu vi viền bàn." },
      {
        type: "table",
        title: "Luyện tập",
        rows: [
          ["Hình chữ nhật", "Chiều dài", "Chiều rộng", "Chu vi"],
          ["A", "6 cm", "3 cm", "?"],
          ["B", "10 m", "4 m", "?"],
          ["C", "15 cm", "8 cm", "?"],
        ],
      },
      {
        type: "content",
        title: "Đáp án và lỗi thường gặp",
        content: [
          "Đáp án: A = (6 + 3) × 2 = 18 cm; B = (10 + 4) × 2 = 28 m; C = (15 + 8) × 2 = 46 cm.",
          "Lỗi 1: Chỉ cộng chiều dài với chiều rộng mà quên nhân với 2.",
          "Lỗi 2: Hai số đo khác đơn vị (cm và m) nhưng chưa đổi về cùng một đơn vị.",
          "Lỗi 3: Ghi đáp số thiếu đơn vị đo.",
        ],
      },
      {
        type: "summary",
        title: "Ghi nhớ và việc về nhà",
        content: [
          "Chu vi hình chữ nhật = (chiều dài + chiều rộng) × 2, hai số đo phải cùng đơn vị.",
          "Việc về nhà: Đo chiều dài, chiều rộng mặt bàn học ở nhà và tính chu vi, ghi vào vở.",
          "Chuẩn bị bài sau: Chu vi hình vuông — mang theo một vật có dạng hình vuông.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-science-discovery",
    type: "powerpoint",
    name: "Bài giảng KHTN 8 — Quang hợp ở thực vật",
    englishName: "Grade 8 Science — Photosynthesis",
    category: "science",
    categoryLabel: "Khoa học",
    description: "Bài giảng quang hợp môn Khoa học tự nhiên 8: phương trình chữ, thí nghiệm chứng minh và bài tập trắc nghiệm có đáp án.",
    subjects: "Khoa học tự nhiên",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Khoa học tự nhiên",
    tags: ["khoa học tự nhiên 8", "quang hợp", "thí nghiệm", "lá cây"],
    thumb: { layout: "science", note: "10 slide · 16:9" },
    theme: {
      name: "Science Discovery", accent: "#0e7490", accent2: "#b45309", soft: "#ecfeff",
      line: "#a5f3fc", ink: "#0f172a", muted: "#64748b", bg: "#f8fafc",
      heroBg: "#164e63", heroText: "#ecfeff", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "science", pattern: "science",
    },
    title: "QUANG HỢP Ở THỰC VẬT",
    css: `.slide h2 { border-left: 0; padding-left: 0; }`,
    slides: [
      { type: "title", title: "QUANG HỢP Ở THỰC VẬT", subtitle: "Trường THCS Lê Quý Đôn · Lớp 8A2 · Môn Khoa học tự nhiên" },
      {
        type: "content",
        title: "Câu hỏi mở đầu",
        content: [
          "Một cây ngô sau 3 tháng nặng thêm vài ki-lô-gam. Phần khối lượng tăng thêm đó chủ yếu đến từ đâu: đất, nước hay không khí?",
          "Vì sao ban ngày đứng dưới tán cây ta thấy dễ chịu hơn đứng giữa sân nắng?",
          "Nếu che kín một chậu cây không cho ánh sáng chiếu vào trong nhiều ngày, cây sẽ thay đổi thế nào?",
        ],
      },
      {
        type: "content",
        title: "Quang hợp là gì?",
        content: [
          "Quang hợp là quá trình cây xanh sử dụng năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ (chất bột đường) từ nước và khí carbon dioxide, đồng thời giải phóng khí oxygen.",
          "Quá trình này diễn ra chủ yếu ở lá, trong các lục lạp chứa chất diệp lục.",
          "Phương trình chữ: Nước + Khí carbon dioxide —(ánh sáng, diệp lục)→ Chất hữu cơ + Khí oxygen.",
        ],
      },
      {
        type: "two-column",
        title: "Nguyên liệu và sản phẩm",
        left: [
          "Nguyên liệu cây lấy vào:",
          "• Nước — rễ hút từ đất, vận chuyển lên lá",
          "• Khí carbon dioxide — từ không khí, qua lỗ khí trên lá",
          "• Ánh sáng mặt trời — nguồn năng lượng",
        ],
        right: [
          "Sản phẩm tạo thành:",
          "• Chất hữu cơ (bột đường) — nuôi cây, dự trữ ở hạt, củ, quả",
          "• Khí oxygen — thải ra môi trường qua lỗ khí",
        ],
      },
      {
        type: "table",
        title: "Các yếu tố ảnh hưởng đến quang hợp",
        rows: [
          ["Yếu tố", "Ảnh hưởng", "Ví dụ thực tế"],
          ["Ánh sáng", "Thiếu sáng quang hợp yếu; đủ sáng quang hợp mạnh", "Cây trong nhà cần đặt gần cửa sổ"],
          ["Nước", "Thiếu nước cây héo, quang hợp giảm", "Tưới nước đều cho cây vào mùa khô"],
          ["Khí carbon dioxide", "Nồng độ phù hợp giúp quang hợp tốt hơn", "Nhà kính trồng rau thường bổ sung CO₂"],
          ["Nhiệt độ", "Quá nóng hoặc quá lạnh đều làm quang hợp giảm", "Cây sinh trưởng tốt nhất ở khoảng 25–35°C"],
        ],
      },
      { type: "image", title: "Sơ đồ quang hợp", src: scienceDiscoveryImg, caption: "Lá cây hấp thụ ánh sáng, nước và khí carbon dioxide để tạo chất hữu cơ và oxygen." },
      {
        type: "content",
        title: "Thí nghiệm: Quang hợp cần ánh sáng",
        content: [
          "Chuẩn bị hai chậu cây khoai lang cùng kích thước, cùng lượng đất và nước.",
          "Chậu A để ngoài ban công có nắng; chậu B đặt trong hộp carton kín, chỉ mở ra khi tưới nước.",
          "Sau 7 ngày, so sánh màu lá và chiều cao của hai chậu cây.",
          "Kết quả dự kiến: cây ở chậu B lá vàng, thân vươn dài và yếu — vì không quang hợp được.",
        ],
      },
      {
        type: "content",
        title: "Ý nghĩa của quang hợp",
        content: [
          "Tạo ra chất hữu cơ — nguồn thức ăn khởi đầu cho hầu hết sinh vật trên Trái Đất.",
          "Cung cấp khí oxygen cho sự hô hấp của con người và động vật.",
          "Hấp thụ khí carbon dioxide, góp phần giảm hiệu ứng nhà kính.",
          "Là cơ sở của sản xuất nông nghiệp: muốn cây trồng cho năng suất cao phải bảo đảm đủ sáng, đủ nước.",
        ],
      },
      {
        type: "content",
        title: "Bài tập trắc nghiệm",
        content: [
          "Câu 1. Quang hợp diễn ra chủ yếu ở bộ phận nào của cây? A. Rễ  B. Thân  C. Lá  D. Hoa.",
          "Câu 2. Sản phẩm của quang hợp gồm: A. Nước và CO₂  B. Chất hữu cơ và oxygen  C. Muối khoáng và nước  D. Oxygen và muối khoáng.",
          "Câu 3. Yếu tố nào sau đây KHÔNG phải nguyên liệu của quang hợp? A. Nước  B. Khí oxygen  C. Khí carbon dioxide  D. Ánh sáng.",
          "Đáp án: 1 – C; 2 – B; 3 – B.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết bài học",
        content: [
          "Quang hợp: nước + CO₂ —(ánh sáng, diệp lục)→ chất hữu cơ + oxygen.",
          "Lá là cơ quan quang hợp chính; diệp lục nằm trong lục lạp.",
          "Việc về nhà: Quan sát một cây quanh nhà trong 3 ngày, ghi lại vị trí đặt cây và dự đoán cây có quang hợp tốt không, kèm lí do.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-minimal-academic",
    type: "powerpoint",
    name: "Bài giảng Ngữ văn 10 — Truyện ngắn hiện đại Việt Nam",
    englishName: "Grade 10 Literature — Modern Short Stories",
    category: "academic",
    categoryLabel: "Bài giảng học thuật",
    description: "Bài giảng Ngữ văn 10 về truyện ngắn hiện đại: tác phẩm tiêu biểu của Nam Cao, Thạch Lam, Kim Lân, Nguyễn Minh Châu và bảng so sánh tác phẩm.",
    subjects: "Ngữ văn",
    levels: ["THPT"],
    levelKeys: ["thpt"],
    gradeRange: "Lớp 10",
    grade: 10,
    subject: "Ngữ văn",
    tags: ["ngữ văn 10", "truyện ngắn", "nam cao", "phân tích tác phẩm"],
    thumb: { layout: "minimal", note: "9 slide · 16:9" },
    theme: {
      name: "Minimal Academic", accent: "#1e293b", accent2: "#64748b", soft: "#f1f5f9",
      line: "#cbd5e1", ink: "#0f172a", muted: "#64748b", bg: "#ffffff",
      heroBg: "#0f172a", heroText: "#f8fafc", font: "Georgia", displayFont: "Georgia",
      variant: "minimal", pattern: "minimal",
    },
    title: "TRUYỆN NGẮN HIỆN ĐẠI VIỆT NAM",
    css: `.slide h2 { font-family: Georgia, serif; font-weight: 400; letter-spacing: 0; }`,
    slides: [
      { type: "title", title: "TRUYỆN NGẮN HIỆN ĐẠI VIỆT NAM", subtitle: "Trường THPT Chu Văn An · Lớp 10A2 · Môn Ngữ văn" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nhận diện được đặc điểm của truyện ngắn hiện đại Việt Nam: dung lượng ngắn, ít nhân vật, tập trung vào một tình huống truyện.",
          "Phân tích được nhân vật qua hành động, lời nói và diễn biến tâm lí trong một chi tiết cụ thể.",
          "Viết được đoạn văn nghị luận văn học khoảng 200 chữ về một chi tiết trong tác phẩm.",
        ],
      },
      {
        type: "content",
        title: "Bối cảnh ra đời",
        content: [
          "Truyện ngắn hiện đại Việt Nam hình thành và phát triển mạnh từ những năm 1930, cùng với quá trình hiện đại hóa văn học.",
          "Giai đoạn 1930–1945: hai khuynh hướng lãng mạn (Thạch Lam, Thanh Tịnh) và hiện thực (Nam Cao, Kim Lân, Nguyên Hồng).",
          "Sau 1945, truyện ngắn tiếp tục phát triển với các đề tài kháng chiến, xây dựng và đổi mới (Nguyễn Minh Châu, Lê Lựu).",
        ],
      },
      {
        type: "two-column",
        title: "Đặc điểm thể loại",
        left: [
          "Về hình thức:",
          "• Dung lượng ngắn, đọc trong một lần",
          "• Ít nhân vật, ít sự kiện",
          "• Tập trung vào một tình huống có tính bước ngoặt",
          "• Chi tiết được chọn lọc, giàu sức gợi",
        ],
        right: [
          "Về nội dung:",
          "• Lát cắt của đời sống, không kể trọn đời người",
          "• Khám phá tâm lí và số phận con người",
          "• Kết thúc thường để lại dư âm, mở ra suy ngẫm",
        ],
      },
      {
        type: "content",
        title: "Tác phẩm tiêu biểu trong chương trình",
        content: [
          "Nam Cao — “Chí Phèo” (1941): bi kịch của người nông dân bị tha hóa và khát vọng được làm người lương thiện.",
          "Thạch Lam — “Gió lạnh đầu mùa” (1937): tình thương giữa những đứa trẻ nghèo trong ngày gió lạnh.",
          "Kim Lân — “Vợ nhặt” (in trong tập “Con chó xấu xí”, 1962): nạn đói năm 1945 và sức sống, khát vọng hạnh phúc của người lao động.",
          "Nguyễn Minh Châu — “Chiếc thuyền ngoài xa” (1983): mâu thuẫn giữa vẻ đẹp nghệ thuật và hiện thực đời sống.",
        ],
      },
      {
        type: "image",
        title: "Đọc văn bản",
        src: minimalAcademicImg,
        caption: "Đọc kĩ toàn văn tác phẩm và ghi chép chi tiết quan trọng là bước đầu tiên trước khi phân tích.",
      },
      {
        type: "table",
        title: "So sánh hai tác phẩm",
        rows: [
          ["Tiêu chí", "Chí Phèo (Nam Cao)", "Chiếc thuyền ngoài xa (Nguyễn Minh Châu)"],
          ["Bối cảnh", "Làng Vũ Đại, nông thôn Bắc Bộ trước 1945", "Một làng chài ven biển miền Trung sau chiến tranh"],
          ["Nhân vật chính", "Chí Phèo, Thị Nở", "Người đàn bà hàng chài, nghệ sĩ Phùng"],
          ["Tình huống truyện", "Chí Phèo say rượu đến nhà Bá Kiến đòi lương thiện", "Phùng chứng kiến cảnh người chồng đánh vợ sau bức ảnh đẹp"],
          ["Vấn đề đặt ra", "Con người bị cự tuyệt quyền làm người", "Khoảng cách giữa nghệ thuật và đời thực"],
        ],
      },
      {
        type: "content",
        title: "Câu hỏi thảo luận",
        content: [
          "Chi tiết bát cháo hành của Thị Nở có tác dụng gì trong việc thể hiện sự “thức tỉnh” của Chí Phèo?",
          "Vì sao người đàn bà hàng chài nhất quyết không bỏ người chồng vũ phu? Câu trả lời của chị giúp Phùng hiểu ra điều gì?",
          "Theo em, tình huống truyện khác gì một sự kiện thông thường trong đời sống?",
        ],
      },
      {
        type: "summary",
        title: "Kết luận và nhiệm vụ",
        content: [
          "Truyện ngắn hiện đại chọn một tình huống nhỏ để đặt ra vấn đề lớn về con người.",
          "Nhiệm vụ: Viết đoạn văn khoảng 200 chữ phân tích chi tiết bát cháo hành trong truyện “Chí Phèo”.",
          "Chuẩn bị tiết sau: Đọc trước truyện “Gió lạnh đầu mùa” và ghi lại 3 chi tiết miêu tả tâm lí nhân vật Sơn.",
        ],
      },
    ],
  }),
  pptTemplate({
    id: "ppt-kids-learning",
    type: "powerpoint",
    name: "Bài giảng Tiếng Việt lớp 2 — Từ chỉ sự vật",
    englishName: "Grade 2 Vietnamese — Nouns",
    category: "primary",
    categoryLabel: "Giáo dục tiểu học",
    description: "Bài giảng Tiếng Việt lớp 2 về từ chỉ sự vật: quan sát lớp học và sân trường, trò chơi phân loại từ, luyện tập có đáp án.",
    subjects: "Tiếng Việt",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 2",
    grade: 2,
    subject: "Tiếng Việt",
    tags: ["tiếng việt 2", "từ chỉ sự vật", "luyện từ và câu"],
    thumb: { layout: "kids", note: "9 slide · 16:9" },
    theme: {
      name: "Kids Learning", accent: "#ea580c", accent2: "#ca8a04", soft: "#fff7ed",
      line: "#fed7aa", ink: "#431407", muted: "#9a3412", bg: "#fffbf5",
      heroBg: "#c2410c", heroText: "#fff7ed", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "kids", pattern: "kids",
    },
    title: "TỪ CHỈ SỰ VẬT",
    css: `.slide h2 { color: #9a3412; }`,
    slides: [
      { type: "title", title: "TỪ CHỈ SỰ VẬT", subtitle: "Trường Tiểu học Hòa Bình · Lớp 2B · Môn Tiếng Việt" },
      {
        type: "content",
        title: "Khởi động: Kể tên những gì em nhìn thấy",
        content: [
          "Nhìn quanh lớp học, em hãy kể tên 3 đồ vật mà em thấy.",
          "Nhìn ra sân trường, em hãy kể tên 1 con vật và 1 loài cây.",
          "Những tên gọi em vừa kể đều là từ chỉ sự vật đấy!",
        ],
      },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nhận biết được từ chỉ sự vật là từ gọi tên người, con vật, đồ vật, cây cối.",
          "Tìm được từ chỉ sự vật trong câu cho trước.",
          "Đặt được một câu có từ chỉ sự vật.",
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
          "• quyển vở",
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
      { type: "image", title: "Thẻ từ", src: kidsLearningImg, caption: "Em hãy chỉ vào từng hình và đọc to tên gọi của sự vật." },
      {
        type: "table",
        title: "Phân loại từ chỉ sự vật",
        rows: [
          ["Nhóm sự vật", "Ví dụ"],
          ["Chỉ người", "cô giáo, bạn Lan, bác bảo vệ"],
          ["Chỉ con vật", "con mèo, con chim, con cá"],
          ["Chỉ đồ vật", "cái bàn, quyển sách, chiếc cặp"],
          ["Chỉ cây cối", "cây bàng, bông hoa, cây chuối"],
        ],
      },
      {
        type: "content",
        title: "Luyện tập",
        content: [
          "Bài 1. Gạch chân các từ chỉ sự vật trong câu: “Trên bàn có một quyển sách và một chiếc bút.”",
          "Bài 2. Khoanh vào từ chỉ sự vật trong nhóm từ sau: bàn, chạy, mèo, xanh, hoa.",
          "Bài 3. Đặt câu với từ “quả bóng” theo mẫu: “Trong lớp học có ……………”.",
        ],
      },
      {
        type: "content",
        title: "Đáp án",
        content: [
          "Bài 1: Các từ chỉ sự vật là: bàn, quyển sách, chiếc bút.",
          "Bài 2: Các từ chỉ sự vật là: bàn, mèo, hoa. (Từ “chạy” chỉ hoạt động, từ “xanh” chỉ màu sắc — không phải từ chỉ sự vật.)",
          "Bài 3 (câu mẫu): “Trong lớp học có một quả bóng.” — Em hãy tự đặt câu của mình nhé!",
        ],
      },
      {
        type: "summary",
        title: "Ghi nhớ và dặn dò",
        content: [
          "Từ chỉ sự vật là từ gọi tên người, con vật, đồ vật, cây cối xung quanh em.",
          "Dặn dò: Tìm thêm 5 từ chỉ sự vật có trong nhà em và ghi vào vở.",
          "Bài sau: Từ chỉ hoạt động — em hãy quan sát xem các bạn trong lớp đang làm những việc gì.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-history-geography",
    type: "powerpoint",
    name: "Bài giảng Lịch sử 9 — Chiến dịch Điện Biên Phủ",
    englishName: "Grade 9 History — Dien Bien Phu Campaign",
    category: "history",
    categoryLabel: "Lịch sử và địa lý",
    description: "Bài giảng Lịch sử 9 về chiến dịch Điện Biên Phủ 1954: kế hoạch Nava, diễn biến ba đợt tiến công đúng mốc lịch sử và ý nghĩa thắng lợi.",
    subjects: "Lịch sử",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 9",
    grade: 9,
    subject: "Lịch sử và Địa lý",
    tags: ["lịch sử 9", "điện biên phủ", "1954", "kháng chiến chống pháp"],
    thumb: { layout: "history", note: "9 slide · 16:9" },
    theme: {
      name: "History & Geography", accent: "#6b4f2a", accent2: "#4d7c0f", soft: "#f5efe2",
      line: "#d6c6a8", ink: "#2f2416", muted: "#7c6a4d", bg: "#fffdf7",
      heroBg: "#3f2d1a", heroText: "#fff7e6", font: "Georgia", displayFont: "Georgia",
      variant: "history", pattern: "history",
    },
    title: "CHIẾN DỊCH ĐIỆN BIÊN PHỦ (1954)",
    css: `.slide h2 { border-bottom: 1.5px solid var(--p-line); padding-bottom: 6px; }`,
    slides: [
      { type: "title", title: "CHIẾN DỊCH ĐIỆN BIÊN PHỦ (1954)", subtitle: "Trường THCS Nguyễn Huệ · Lớp 9A1 · Môn Lịch sử" },
      {
        type: "content",
        title: "Bối cảnh: Kế hoạch Nava",
        content: [
          "Năm 1953, thực dân Pháp thực hiện kế hoạch Nava, tập trung quân xây dựng Điện Biên Phủ thành tập đoàn cứ điểm mạnh nhất Đông Dương.",
          "Tập đoàn cứ điểm gồm 49 cứ điểm, có sân bay Mường Thanh, do tướng Đờ Cát-xtơ-ri chỉ huy, được Pháp coi là “pháo đài không thể công phá”.",
          "Đảng và Chủ tịch Hồ Chí Minh quyết định mở chiến dịch Điện Biên Phủ, chọn phương châm “đánh chắc, tiến chắc”.",
        ],
      },
      {
        type: "content",
        title: "Chuẩn bị cho chiến dịch",
        content: [
          "Hàng vạn dân công hỏa tuyến vận chuyển lương thực, đạn dược bằng xe đạp thồ, thuyền và đường rừng lên Tây Bắc.",
          "Bộ đội kéo pháo qua đèo dốc vào trận địa — nhiều khẩu pháo được kéo bằng sức người qua những đoạn đường xe không đi được.",
          "Đến đầu tháng 3/1954, mọi công tác chuẩn bị hoàn thành, quân ta hoàn toàn giữ thế chủ động.",
        ],
      },
      {
        type: "content",
        title: "Diễn biến: Ba đợt tiến công",
        content: [
          "Đợt 1 (13–17/3/1954): Tiêu diệt cứ điểm Him Lam (13/3), cứ điểm Độc Lập (đêm 15/3); ngày 17/3, quân địch ở Bản Kéo đầu hàng.",
          "Đợt 2 (30/3 – cuối tháng 4/1954): Tiến công các điểm cao phía đông như A1, C1, D1, E1; chiến sự giằng co quyết liệt, đặc biệt ở đồi A1.",
          "Đợt 3 (1–7/5/1954): Đêm 6/5, quân ta nổ bộc phá và chiếm đồi A1; chiều 7/5, tổng công kích vào trung tâm Mường Thanh, bắt sống tướng Đờ Cát-xtơ-ri cùng toàn bộ Bộ chỉ huy địch.",
        ],
      },
      {
        type: "table",
        title: "Các mốc thời gian quan trọng",
        rows: [
          ["Thời gian", "Sự kiện"],
          ["13/3/1954", "Nổ súng mở màn chiến dịch, tiêu diệt cứ điểm Him Lam"],
          ["15/3/1954", "Tiêu diệt cứ điểm Độc Lập"],
          ["30/3/1954", "Bắt đầu đợt tiến công thứ hai vào các điểm cao phía đông"],
          ["Đêm 6/5/1954", "Chiếm đồi A1 sau trận đánh bằng bộc phá"],
          ["7/5/1954", "Cờ “Quyết chiến, quyết thắng” tung bay trên nóc hầm Đờ Cát — chiến dịch toàn thắng sau 56 ngày đêm"],
        ],
      },
      { type: "image", title: "Tư liệu lịch sử", src: historyGeographyImg, caption: "Sơ đồ tập đoàn cứ điểm Điện Biên Phủ và các điểm cao A1, D1, E1 quanh thung lũng Mường Thanh." },
      {
        type: "content",
        title: "Nguyên nhân thắng lợi",
        content: [
          "Sự lãnh đạo đúng đắn của Đảng và Chủ tịch Hồ Chí Minh, đứng đầu chiến dịch là Đại tướng Võ Nguyên Giáp.",
          "Tinh thần chiến đấu anh dũng của bộ đội và sự chi viện to lớn của hậu phương: hàng vạn dân công, thanh niên xung phong bảo đảm hậu cần.",
          "Sự ủng hộ, giúp đỡ của các nước xã hội chủ nghĩa và nhân dân tiến bộ thế giới.",
        ],
      },
      {
        type: "content",
        title: "Ý nghĩa lịch sử",
        content: [
          "Đập tan kế hoạch Nava, giáng đòn quyết định vào ý chí xâm lược của thực dân Pháp.",
          "Buộc Pháp phải ký Hiệp định Giơ-ne-vơ (7/1954), công nhận độc lập, chủ quyền và toàn vẹn lãnh thổ của Việt Nam, Lào, Campuchia; miền Bắc nước ta được hoàn toàn giải phóng.",
          "Cổ vũ mạnh mẽ phong trào giải phóng dân tộc ở châu Á, châu Phi và Mỹ Latinh.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết và nhiệm vụ",
        content: [
          "Chiến dịch Điện Biên Phủ diễn ra 56 ngày đêm (13/3 – 7/5/1954) với ba đợt tiến công, kết thúc bằng thắng lợi hoàn toàn.",
          "Câu hỏi về nhà: Vì sao việc bảo đảm hậu cần được coi là một trong những yếu tố quyết định thắng lợi của chiến dịch?",
          "Chuẩn bị bài sau: Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-math-visualization",
    type: "powerpoint",
    name: "Bài giảng Toán 8 — Hằng đẳng thức đáng nhớ",
    englishName: "Grade 8 Math — Notable Identities",
    category: "math",
    categoryLabel: "Toán học",
    description: "Bài giảng Toán 8 về ba hằng đẳng thức đáng nhớ: minh họa hình học bằng diện tích hình vuông, ví dụ khai triển, rút gọn và đáp án luyện tập.",
    subjects: "Toán",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Toán",
    tags: ["toán 8", "hằng đẳng thức", "đại số", "khai triển"],
    thumb: { layout: "math", note: "10 slide · 16:9" },
    theme: {
      name: "Math Visualization", accent: "#4338ca", accent2: "#b45309", soft: "#eef2ff",
      line: "#c7d2fe", ink: "#1e1b4b", muted: "#6366f1", bg: "#ffffff",
      heroBg: "#312e81", heroText: "#eef2ff", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "math", pattern: "math",
    },
    title: "HẰNG ĐẲNG THỨC ĐÁNG NHỚ",
    css: `.slide h2 { border-bottom: 1.5px solid var(--p-line); padding-bottom: 6px; }`,
    slides: [
      { type: "title", title: "HẰNG ĐẲNG THỨC ĐÁNG NHỚ", subtitle: "Trường THCS Lê Quý Đôn · Lớp 8A2 · Môn Toán (Đại số)" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Ghi nhớ và phát biểu được ba hằng đẳng thức: bình phương của một tổng, bình phương của một hiệu, hiệu hai bình phương.",
          "Giải thích được hằng đẳng thức (a + b)² bằng diện tích hình vuông.",
          "Khai triển và rút gọn được các biểu thức đơn giản bằng hằng đẳng thức.",
        ],
      },
      {
        type: "content",
        title: "Ba hằng đẳng thức cơ bản",
        content: [
          "1. (a + b)² = a² + 2ab + b²",
          "2. (a − b)² = a² − 2ab + b²",
          "3. a² − b² = (a − b)(a + b)",
          "Cách nhớ: “Bình phương của một tổng bằng bình phương số thứ nhất, cộng hai lần tích hai số, cộng bình phương số thứ hai.”",
        ],
      },
      {
        type: "two-column",
        title: "Vì sao (a + b)² = a² + 2ab + b²?",
        left: [
          "Xét hình vuông có cạnh (a + b), diện tích là (a + b)².",
          "Chia hình vuông thành 4 phần: một hình vuông cạnh a (diện tích a²), một hình vuông cạnh b (diện tích b²) và hai hình chữ nhật giống nhau (mỗi hình có diện tích ab).",
        ],
        right: [
          "Tổng diện tích 4 phần: a² + ab + ab + b² = a² + 2ab + b².",
          "Vậy (a + b)² = a² + 2ab + b².",
          "Kiểm tra với a = 3, b = 2: (3 + 2)² = 25 và 3² + 2·3·2 + 2² = 9 + 12 + 4 = 25. Đúng!",
        ],
      },
      {
        type: "image",
        title: "Minh họa bằng diện tích",
        src: mathVisualizationImg,
        caption: "Hình vuông cạnh (a + b) được chia thành bốn phần có diện tích a², ab, ab và b².",
      },
      {
        type: "content",
        title: "Ví dụ 1 — Khai triển",
        content: [
          "a) (x + 3)² = x² + 2·x·3 + 3² = x² + 6x + 9.",
          "b) (2a − 5)² = (2a)² − 2·2a·5 + 5² = 4a² − 20a + 25.",
          "c) (x + y)(x − y) = x² − y².",
          "Lưu ý câu b: phải bình phương cả 2a, không chỉ bình phương a.",
        ],
      },
      {
        type: "content",
        title: "Ví dụ 2 — Rút gọn biểu thức",
        content: [
          "Rút gọn: (x + 2)² − (x − 2)².",
          "Khai triển: (x² + 4x + 4) − (x² − 4x + 4).",
          "Đổi dấu các hạng tử trong ngoặc thứ hai rồi thu gọn: = x² + 4x + 4 − x² + 4x − 4 = 8x.",
          "Kết quả: 8x.",
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
        title: "Đáp án luyện tập và lỗi thường gặp",
        content: [
          "Đáp án: (x + 4)² = x² + 8x + 16; (3a − 1)² = 9a² − 6a + 1; y² − 9 = (y − 3)(y + 3); (m + n)(m − n) = m² − n².",
          "Lỗi thường gặp 1: Viết (a + b)² = a² + b² (quên hạng tử 2ab).",
          "Lỗi thường gặp 2: Khi đổi dấu lúc phá ngoặc có dấu trừ phía trước.",
          "Cách tự kiểm tra: Thay a, b bằng hai số cụ thể và so sánh hai vế.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết và việc về nhà",
        content: [
          "Ba hằng đẳng thức giúp khai triển và rút gọn biểu thức nhanh, chính xác.",
          "Việc về nhà: Khai triển (x + 5)²; (2x − 3)²; rút gọn (a + 1)² − (a − 1)². (Đáp án để đối chiếu tiết sau: x² + 10x + 25; 4x² − 12x + 9; 4a.)",
          "Chuẩn bị tiết sau: Luyện tập — mang theo máy tính cầm tay để kiểm tra kết quả.",
        ],
      },
    ],
  }),
  pptTemplate({
    id: "ppt-language-learning",
    type: "powerpoint",
    name: "Bài giảng Tiếng Anh 8 — Present Perfect",
    englishName: "Grade 8 English — Present Perfect",
    category: "language",
    categoryLabel: "Ngôn ngữ",
    description: "Bài giảng ngữ pháp thì hiện tại hoàn thành: cấu trúc, dấu hiệu nhận biết, hội thoại song ngữ, bảng phân biệt với quá khứ đơn và bài tập có đáp án.",
    subjects: "Tiếng Anh",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Lớp 8",
    grade: 8,
    subject: "Tiếng Anh",
    tags: ["tiếng anh 8", "ngữ pháp", "present perfect", "hội thoại"],
    thumb: { layout: "language", note: "9 slide · 16:9" },
    theme: {
      name: "Language Learning", accent: "#6d28d9", accent2: "#0e7490", soft: "#f5f3ff",
      line: "#ddd6fe", ink: "#2e1065", muted: "#6d28d9", bg: "#ffffff",
      heroBg: "#5b21b6", heroText: "#faf5ff", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "language", pattern: "language",
    },
    title: "PRESENT PERFECT (THÌ HIỆN TẠI HOÀN THÀNH)",
    css: `.slide h2 { color: #5b21b6; }`,
    slides: [
      { type: "title", title: "PRESENT PERFECT", subtitle: "Trường THCS Trần Phú · Lớp 8A3 · Môn Tiếng Anh — Grammar" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nêu được cấu trúc khẳng định, phủ định và nghi vấn của thì hiện tại hoàn thành.",
          "Dùng thì hiện tại hoàn thành để nói về trải nghiệm và hành động có kết quả liên quan đến hiện tại.",
          "Phân biệt được hiện tại hoàn thành với quá khứ đơn qua dấu hiệu thời gian.",
        ],
      },
      {
        type: "content",
        title: "Cấu trúc",
        content: [
          "Khẳng định: S + have/has + V3 (past participle). Ví dụ: I have visited Hue twice. / She has finished her homework.",
          "Phủ định: S + have/has + not + V3. Ví dụ: We haven't seen this film.",
          "Nghi vấn: Have/Has + S + V3? — Trả lời ngắn: Yes, I have. / No, I haven't.",
          "Chủ ngữ số ít (he, she, it) dùng has; I, you, we, they dùng have.",
        ],
      },
      {
        type: "two-column",
        title: "Ví dụ hội thoại",
        left: [
          "A: Have you ever been to Hue?",
          "B: Yes, I have. I went there last summer.",
          "A: What did you visit?",
          "B: I visited the Imperial City and Thien Mu Pagoda.",
        ],
        right: [
          "A: Bạn đã từng đến Huế chưa?",
          "B: Rồi. Mình đến đó vào mùa hè năm ngoái.",
          "A: Bạn đã tham quan những đâu?",
          "B: Mình tham quan Đại Nội và chùa Thiên Mụ.",
        ],
      },
      {
        type: "content",
        title: "Dấu hiệu nhận biết",
        content: [
          "ever / never — khi nói về trải nghiệm: Have you ever tried bun cha?",
          "already / yet — hành động đã hoàn thành hoặc chưa hoàn thành: I have already done my homework. / Have you finished yet?",
          "since + mốc thời gian: since 2020, since last Monday. — for + khoảng thời gian: for three years.",
          "just / recently — hành động vừa mới xảy ra: She has just left.",
        ],
      },
      {
        type: "table",
        title: "Phân biệt hai thì",
        rows: [
          ["Tiêu chí", "Present Perfect", "Past Simple"],
          ["Thời gian", "Không nêu thời điểm cụ thể; kết quả liên quan hiện tại", "Có thời điểm xác định trong quá khứ"],
          ["Dấu hiệu", "ever, never, already, yet, since, for", "yesterday, last night, in 2020, two days ago"],
          ["Ví dụ", "I have seen this film. (Tôi đã xem bộ phim này.)", "I saw this film yesterday. (Tôi xem bộ phim này hôm qua.)"],
        ],
      },
      { type: "image", title: "Nói về trải nghiệm", src: languageLearningImg, caption: "Dùng Present Perfect với “Have you ever…?” để hỏi về trải nghiệm của bạn bè." },
      {
        type: "content",
        title: "Luyện tập",
        content: [
          "Bài 1. Chia động từ trong ngoặc: I (never / be) …………… to Da Nang.",
          "Bài 2. Đặt câu hỏi với “ever” theo mẫu: you / try / Vietnamese food → Have you ever tried Vietnamese food?",
          "Bài 3. Hoàn thành câu: She (live) …………… here since 2020.",
          "Bài 4. Nói 3 câu về một trải nghiệm của em bằng thì hiện tại hoàn thành.",
        ],
      },
      {
        type: "summary",
        title: "Đáp án và tổng kết",
        content: [
          "Đáp án: Bài 1 — have never been; Bài 3 — has lived.",
          "Ghi nhớ: Present Perfect = have/has + V3; không dùng kèm trạng từ chỉ thời điểm đã qua như yesterday.",
          "Việc về nhà: Viết đoạn văn 5 câu về một nơi em đã từng đến, dùng ít nhất 3 câu ở thì hiện tại hoàn thành.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-educational-infographic",
    type: "powerpoint",
    name: "Bài giảng Khoa học 5 — Vòng tuần hoàn của nước",
    englishName: "Grade 5 Science — The Water Cycle",
    category: "infographic",
    categoryLabel: "Infographic",
    description: "Bài giảng Khoa học lớp 5 về vòng tuần hoàn của nước với 4 giai đoạn, số liệu thật về nước trên Trái Đất và câu hỏi kiểm tra có đáp án.",
    subjects: "Khoa học",
    levels: ["Tiểu học", "Không giới hạn"],
    levelKeys: ["primary", "unlimited"],
    gradeRange: "Lớp 5",
    grade: 5,
    subject: "Khoa học",
    tags: ["khoa học 5", "vòng tuần hoàn nước", "bay hơi", "ngưng tụ"],
    thumb: { layout: "infographic", note: "9 slide · 16:9" },
    theme: {
      name: "Educational Infographic", accent: "#0f766e", accent2: "#c2410c", soft: "#f0fdfa",
      line: "#99f6e4", ink: "#134e4a", muted: "#0f766e", bg: "#ffffff",
      heroBg: "#115e59", heroText: "#f0fdfa", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "infographic", pattern: "infographic",
    },
    title: "VÒNG TUẦN HOÀN CỦA NƯỚC",
    css: `.slide h2 { border-bottom: 1.5px solid var(--p-line); padding-bottom: 6px; }`,
    slides: [
      { type: "title", title: "VÒNG TUẦN HOÀN CỦA NƯỚC", subtitle: "Trường Tiểu học Hòa Bình · Lớp 5A · Môn Khoa học" },
      {
        type: "content",
        title: "Quan sát mở đầu",
        content: [
          "Sau cơn mưa, sân trường đọng nhiều vũng nước. Đến trưa nắng, các vũng nước biến mất. Nước đã đi đâu?",
          "Sáng sớm, trên lá cây có những giọt nước nhỏ. Những giọt nước đó từ đâu mà có?",
          "Bài học hôm nay sẽ giúp em trả lời hai câu hỏi này.",
        ],
      },
      {
        type: "content",
        title: "Bốn giai đoạn của vòng tuần hoàn",
        content: [
          "1. Bay hơi: Dưới tác dụng của nhiệt từ Mặt Trời, nước ở biển, sông, hồ chuyển thành hơi nước bay lên cao.",
          "2. Ngưng tụ: Hơi nước lên cao gặp lạnh, ngưng tụ thành những hạt nước rất nhỏ, tạo thành mây.",
          "3. Mưa: Các hạt nước trong mây lớn dần và rơi xuống thành mưa (hoặc tuyết ở nơi rất lạnh).",
          "4. Chảy và thấm: Nước mưa chảy thành suối, sông rồi ra biển; một phần thấm xuống đất thành nước ngầm. Vòng tuần hoàn lại tiếp tục.",
        ],
      },
      { type: "image", title: "Sơ đồ vòng tuần hoàn", src: educationalInfographicImg, caption: "Nước di chuyển liên tục giữa mặt đất, sông biển và bầu khí quyển." },
      {
        type: "table",
        title: "Tóm tắt các giai đoạn",
        rows: [
          ["Giai đoạn", "Điều gì xảy ra", "Yếu tố tác động"],
          ["Bay hơi", "Nước lỏng chuyển thành hơi nước", "Nhiệt từ Mặt Trời"],
          ["Ngưng tụ", "Hơi nước chuyển thành hạt nước nhỏ tạo mây", "Không khí lạnh ở trên cao"],
          ["Mưa", "Hạt nước lớn dần và rơi xuống", "Trọng lực"],
          ["Chảy và thấm", "Nước về sông, biển và xuống nước ngầm", "Địa hình và trọng lực"],
        ],
      },
      {
        type: "content",
        title: "Nước trên Trái Đất — những con số cần biết",
        content: [
          "Khoảng 71% bề mặt Trái Đất được bao phủ bởi nước.",
          "Trong tổng lượng nước, khoảng 97,5% là nước mặn ở biển và đại dương; chỉ khoảng 2,5% là nước ngọt.",
          "Gần 70% lượng nước ngọt nằm ở dạng băng tuyết tại hai vùng cực và trên các sông băng.",
          "Vì vậy, nước ngọt dùng cho sinh hoạt là rất ít và cần được sử dụng tiết kiệm.",
        ],
      },
      {
        type: "content",
        title: "Thí nghiệm nhỏ: Làm “mưa” trong cốc",
        content: [
          "Đổ nước nóng vào một chiếc cốc thủy tinh (giáo viên thực hiện bước này).",
          "Úp một chiếc đĩa lạnh lên miệng cốc và chờ khoảng 2 phút.",
          "Quan sát: mặt dưới của đĩa xuất hiện nhiều giọt nước nhỏ — đó là hơi nước ngưng tụ, giống như cách mây tạo mưa.",
          "Kết luận: Hơi nước gặp lạnh sẽ ngưng tụ thành nước lỏng.",
        ],
      },
      {
        type: "content",
        title: "Câu hỏi kiểm tra",
        content: [
          "Câu 1. Nước trong vũng nước ở sân trường “biến mất” vào buổi trưa nắng là do hiện tượng gì? A. Ngưng tụ  B. Bay hơi  C. Đông đặc.",
          "Câu 2. Những giọt nước trên lá cây vào sáng sớm hình thành do: A. Hơi nước trong không khí ngưng tụ  B. Nước từ trong lá chảy ra  C. Sương là nước mưa còn sót lại.",
          "Câu 3. Giai đoạn nào đưa nước trở về mặt đất? A. Bay hơi  B. Ngưng tụ  C. Mưa.",
          "Đáp án: 1 – B; 2 – A; 3 – C.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết và việc về nhà",
        content: [
          "Nước tuần hoàn qua 4 giai đoạn: bay hơi — ngưng tụ — mưa — chảy và thấm.",
          "Việc về nhà: Vẽ sơ đồ vòng tuần hoàn của nước vào vở và ghi chú tên từng giai đoạn.",
          "Nhắc nhở thực tế: Khóa vòi nước sau khi dùng và báo ngay cho người lớn khi thấy ống nước bị rò rỉ.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-professional-academic",
    type: "powerpoint",
    name: "Báo cáo sơ kết học kì — Ứng dụng CNTT trong dạy học",
    englishName: "Semester Report — ICT in Teaching",
    category: "report",
    categoryLabel: "Báo cáo chuyên đề",
    description: "Mẫu bài trình bày báo cáo sơ kết học kì I của nhà trường: số liệu tiết dạy có ứng dụng CNTT, kết quả, tồn tại và kế hoạch học kì II.",
    subjects: "Quản lí giáo dục",
    levels: ["THCS"],
    levelKeys: ["thcs"],
    gradeRange: "Giáo viên",
    grade: 8,
    subject: "Nghiên cứu giáo dục",
    tags: ["báo cáo", "sơ kết học kì", "công nghệ thông tin", "nhà trường"],
    thumb: { layout: "corporate", note: "9 slide · 16:9" },
    theme: {
      name: "Professional Academic", accent: "#1e3a8a", accent2: "#0369a1", soft: "#eff6ff",
      line: "#bfdbfe", ink: "#0f172a", muted: "#64748b", bg: "#ffffff",
      heroBg: "#172554", heroText: "#eff6ff", font: "Be Vietnam Pro", displayFont: "Georgia",
      variant: "corporate", pattern: "corporate",
    },
    title: "BÁO CÁO SƠ KẾT HỌC KÌ I — ỨNG DỤNG CÔNG NGHỆ THÔNG TIN TRONG DẠY HỌC",
    css: `.slide h2 { border-bottom: 1.5px solid var(--p-line); padding-bottom: 6px; }`,
    slides: [
      { type: "title", title: "BÁO CÁO SƠ KẾT HỌC KÌ I", subtitle: "Trường THCS Lê Quý Đôn · Hội nghị sơ kết học kì I, năm học 2026–2027 · Tháng 01/2027" },
      {
        type: "content",
        title: "Nội dung báo cáo",
        content: [
          "1. Số liệu chung về ứng dụng công nghệ thông tin (CNTT) trong dạy học học kì I.",
          "2. Kết quả đạt được theo từng tổ chuyên môn.",
          "3. Tồn tại, hạn chế và nguyên nhân.",
          "4. Nhiệm vụ và giải pháp trong học kì II.",
        ],
      },
      {
        type: "table",
        title: "Số liệu chung học kì I",
        rows: [
          ["Chỉ số", "Kết quả", "Ghi chú"],
          ["Tổng số tiết dạy toàn trường", "4.860 tiết", "Theo sổ đầu bài điện tử"],
          ["Tiết dạy có ứng dụng CNTT", "3.214 tiết (66%)", "Tăng 9 điểm % so với học kì I năm trước"],
          ["Giáo viên có bài giảng điện tử đạt yêu cầu", "58 / 64 giáo viên (91%)", "Còn 6 giáo viên cần bồi dưỡng thêm"],
          ["Phòng học có máy chiếu hoặc ti vi", "24 / 24 phòng", "2 phòng tín hiệu mạng yếu"],
        ],
      },
      {
        type: "content",
        title: "Kết quả đạt được",
        content: [
          "100% tổ chuyên môn đã xây dựng kho bài giảng dùng chung, tổng cộng 412 bài giảng và 96 đề kiểm tra được số hóa.",
          "Các tiết dự giờ cấp trường cho thấy học sinh hứng thú hơn ở những tiết có thí nghiệm mô phỏng và câu hỏi tương tác.",
          "Việc chấm bài và nhập điểm trên hệ thống giúp giảm thời gian tổng hợp kết quả cuối kì từ 5 ngày xuống còn 2 ngày.",
        ],
      },
      { type: "image", title: "Hội nghị sơ kết", src: professionalAcademicImg, caption: "Hội nghị sơ kết học kì I của nhà trường, tháng 01/2027." },
      {
        type: "content",
        title: "Tồn tại, hạn chế",
        content: [
          "6 giáo viên lớn tuổi chưa tự thiết kế được bài giảng có tương tác, chủ yếu mới trình chiếu văn bản.",
          "Đường truyền Internet ở dãy phòng học tầng 3 không ổn định vào giờ cao điểm (tiết 2–3 buổi sáng).",
          "Kho học liệu còn thiếu bài giảng cho hai môn Âm nhạc và Mỹ thuật; một số bài chưa được gắn đúng chuẩn đầu ra.",
        ],
      },
      {
        type: "content",
        title: "Nguyên nhân",
        content: [
          "Đợt tập huấn đầu năm mới dừng ở mức sử dụng phần mềm trình chiếu, chưa có nội dung thiết kế hoạt động tương tác.",
          "Hạ tầng mạng được đầu tư từ năm 2022, chưa đáp ứng số lượng thiết bị truy cập đồng thời hiện nay.",
          "Chưa có giáo viên đầu mối phụ trách học liệu số cho các môn năng khiếu.",
        ],
      },
      {
        type: "content",
        title: "Kế hoạch học kì II",
        content: [
          "Tháng 02/2027: Tập huấn chuyên đề “Thiết kế câu hỏi tương tác trong bài giảng” cho toàn thể giáo viên; phân công 6 giáo viên trẻ hỗ trợ kèm cặp đồng nghiệp.",
          "Tháng 03/2027: Nâng cấp đường truyền và bổ sung 3 điểm phát wifi cho dãy phòng học tầng 3.",
          "Mỗi giáo viên đăng ký ít nhất 4 tiết ứng dụng CNTT có hoạt động tương tác trong học kì II; tổ chuyên môn dự giờ, góp ý ít nhất 1 tiết / giáo viên.",
          "Tháng 05/2027: Tổng kết, biểu dương 5 bài giảng điện tử tiêu biểu cấp trường.",
        ],
      },
      {
        type: "summary",
        title: "Kết luận",
        content: [
          "Ứng dụng CNTT trong dạy học học kì I đạt kết quả tích cực: 66% số tiết có ứng dụng, 91% giáo viên có bài giảng điện tử đạt yêu cầu.",
          "Hạn chế chính nằm ở kỹ năng thiết kế tương tác và hạ tầng mạng — cả hai đều đã có kế hoạch khắc phục trong học kì II.",
          "Đề nghị các tổ chuyên môn triển khai kế hoạch ngay từ tuần đầu của học kì II và báo cáo tiến độ vào kỳ họp tháng 03/2027.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-storytelling-education",
    type: "powerpoint",
    name: "Bài giảng Đạo đức lớp 5 — Nhặt được của rơi",
    englishName: "Grade 5 Ethics — Found Property",
    category: "language",
    categoryLabel: "Ngôn ngữ",
    description: "Bài giảng Đạo đức lớp 5 qua câu chuyện “Chiếc ví nhặt được”: diễn biến, cảm xúc nhân vật, bài học trung thực và liên hệ bản thân.",
    subjects: "Đạo đức",
    levels: ["Tiểu học", "THCS"],
    levelKeys: ["primary", "thcs"],
    gradeRange: "Lớp 5",
    grade: 5,
    subject: "Đạo đức",
    tags: ["đạo đức 5", "trung thực", "kể chuyện", "của rơi"],
    thumb: { layout: "story", note: "10 slide · 16:9" },
    theme: {
      name: "Storytelling Education", accent: "#9a3412", accent2: "#a16207", soft: "#fffbeb",
      line: "#fde68a", ink: "#431407", muted: "#9a3412", bg: "#fffdf5",
      heroBg: "#7c2d12", heroText: "#fffbeb", font: "Be Vietnam Pro", displayFont: "Georgia",
      variant: "story", pattern: "story",
    },
    title: "CHIẾC VÍ NHẶT ĐƯỢC",
    css: `.slide h2 { color: #9a3412; font-family: Georgia, serif; }`,
    slides: [
      { type: "title", title: "CHIẾC VÍ NHẶT ĐƯỢC", subtitle: "Trường Tiểu học Hòa Bình · Lớp 5A · Môn Đạo đức — Bài: Trung thực trong cuộc sống" },
      {
        type: "content",
        title: "Mở đầu câu chuyện",
        content: [
          "Chiều tan học, Nam và Lan cùng đi bộ về nhà qua công viên.",
          "Dưới gốc cây bàng gần cổng công viên, Nam nhìn thấy một chiếc ví da màu nâu nằm trên lối đi.",
          "Trong ví có một ít tiền, giấy tờ tùy thân và một tấm ảnh gia đình.",
          "Xung quanh lúc đó không có ai. Hai bạn nhìn nhau, chưa biết phải làm thế nào.",
        ],
      },
      {
        type: "content",
        title: "Các nhân vật",
        content: [
          "Nam — học sinh lớp 5, nhanh nhẹn; lúc đầu có ý nghĩ giữ chiếc ví lại.",
          "Lan — bạn cùng lớp của Nam, cẩn thận, đề nghị tìm cách trả lại cho người đánh mất.",
          "Bác Hùng — người đánh rơi ví, đang quay lại công viên tìm trong lo lắng.",
          "Bác bảo vệ công viên — người giúp hai bạn liên lạc với bác Hùng.",
        ],
      },
      {
        type: "content",
        title: "Tình huống cần lựa chọn",
        content: [
          "Nam nói nhỏ: “Hay là mình giữ lại? Đằng nào cũng không ai nhìn thấy.”",
          "Lan lắc đầu: “Người mất ví chắc đang lo lắm. Trong ví có giấy tờ, mình tìm cách trả lại đi.”",
          "Nam im lặng một lúc. Em nghĩ đến bài học cô giáo vừa dạy về tính trung thực.",
        ],
      },
      {
        type: "content",
        title: "Diễn biến tiếp theo",
        content: [
          "Hai bạn mang chiếc ví đến phòng bảo vệ ở cổng công viên và trình bày sự việc.",
          "Bác bảo vệ xem giấy tờ trong ví, tìm được số điện thoại và gọi cho bác Hùng.",
          "Khoảng mười lăm phút sau, bác Hùng quay lại. Nhận lại chiếc ví nguyên vẹn, bác xúc động cảm ơn hai bạn.",
          "Bác ngỏ ý tặng hai bạn một ít tiền cảm ơn, nhưng cả hai đều từ chối.",
        ],
      },
      { type: "image", title: "Khoảnh khắc trong câu chuyện", src: storytellingEducationImg, caption: "Hai bạn mang chiếc ví đến nhờ bác bảo vệ công viên giúp tìm người đánh mất." },
      {
        type: "content",
        title: "Cảm xúc của các nhân vật",
        content: [
          "Nam: Lúc đầu phân vân, sau khi trả lại ví thì thấy nhẹ nhõm và vui.",
          "Lan: Bình tĩnh, chắc chắn với lựa chọn của mình ngay từ đầu.",
          "Bác Hùng: Từ lo lắng chuyển sang nhẹ nhõm và biết ơn.",
          "Câu hỏi: Nếu Nam giữ chiếc ví lại, cảm xúc của em sau đó sẽ như thế nào?",
        ],
      },
      {
        type: "content",
        title: "Bài học rút ra",
        content: [
          "Nhặt được của rơi, cần tìm cách trả lại cho người đánh mất hoặc nhờ người lớn, cơ quan có trách nhiệm giúp đỡ.",
          "Không lấy tài sản của người khác làm của mình, dù không có ai nhìn thấy.",
          "Trung thực được thể hiện qua những việc nhỏ hằng ngày, không chỉ trong bài kiểm tra.",
        ],
      },
      {
        type: "content",
        title: "Liên hệ bản thân",
        content: [
          "Tình huống 1: Em nhặt được một chiếc bút máy đẹp trong sân trường và biết đó là của bạn lớp bên cạnh. Em sẽ làm gì?",
          "Tình huống 2: Người bán hàng trả nhầm cho em thừa 10.000 đồng. Em sẽ làm gì?",
          "Tình huống 3: Bạn thân rủ em giấu việc bạn làm vỡ kính của lớp. Em sẽ nói gì với bạn?",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết và nhiệm vụ",
        content: [
          "Khi nhặt được của rơi: giữ nguyên hiện trạng, tìm người trả lại hoặc giao cho người lớn, bảo vệ, công an nơi gần nhất.",
          "Nhiệm vụ về nhà: Kể lại câu chuyện “Chiếc ví nhặt được” cho người thân nghe và ghi lại một việc trung thực em đã làm trong tuần này.",
          "Tiết sau: Thực hành xử lí tình huống — đóng vai theo nhóm.",
        ],
      },
    ],
  }),
  pptTemplate({
    id: "ppt-water-states-experiment",
    type: "powerpoint",
    name: "Thí nghiệm Khoa học lớp 4 — Sự chuyển thể của nước",
    englishName: "Grade 4 Science — States of Water Experiment",
    category: "science",
    categoryLabel: "Khoa học",
    description: "Bài học Khoa học lớp 4 với hai thí nghiệm quan sát thật: nước đá tan và hơi nước ngưng tụ, kèm bảng ghi kết quả và đáp án câu hỏi.",
    subjects: "Khoa học",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 4",
    grade: 4,
    subject: "Khoa học",
    tags: ["khoa học 4", "thí nghiệm", "nước", "chuyển thể"],
    thumb: { layout: "science", note: "9 slide · 16:9" },
    theme: {
      name: "Water Lab", accent: "#0e7490", accent2: "#0369a1", soft: "#ecfeff",
      line: "#a5f3fc", ink: "#164e63", muted: "#64748b", bg: "#f8fafc",
      heroBg: "#155e75", heroText: "#ecfeff", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "science", pattern: "science",
    },
    title: "SỰ CHUYỂN THỂ CỦA NƯỚC",
    css: `.slide h2 { border-left: 0; padding-left: 0; }`,
    slides: [
      { type: "title", title: "SỰ CHUYỂN THỂ CỦA NƯỚC", subtitle: "Trường Tiểu học Hòa Bình · Lớp 4A · Môn Khoa học" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Nêu được nước tồn tại ở ba thể: rắn, lỏng và khí.",
          "Quan sát và mô tả được hai hiện tượng: nước đá tan thành nước và hơi nước ngưng tụ thành giọt nước.",
          "Giải thích được vì sao thành ngoài cốc nước đá có những giọt nước nhỏ.",
        ],
      },
      {
        type: "content",
        title: "Khởi động: Giọt nước trên cốc đá",
        content: [
          "Em hãy quan sát cốc nước đá trên bàn giáo viên: thành ngoài của cốc có gì lạ?",
          "Có bạn cho rằng nước trong cốc thấm qua thành cốc ra ngoài. Em có đồng ý không?",
          "Hôm nay chúng ta sẽ làm thí nghiệm để kiểm tra dự đoán này.",
        ],
      },
      {
        type: "content",
        title: "Kiến thức mới: Ba thể của nước",
        content: [
          "Thể rắn: nước đá, băng, tuyết — có hình dạng xác định.",
          "Thể lỏng: nước trong sông, hồ, nước uống — không có hình dạng xác định, chảy được.",
          "Thể khí: hơi nước — không màu, không nhìn thấy được, có trong không khí xung quanh ta.",
          "Nước đá → nước lỏng gọi là nóng chảy (tan); nước lỏng → hơi nước gọi là bay hơi; hơi nước → nước lỏng gọi là ngưng tụ; nước lỏng → nước đá gọi là đông đặc.",
        ],
      },
      {
        type: "content",
        title: "Thí nghiệm 1: Nước đá tan",
        content: [
          "Bước 1: Cho 3 viên nước đá vào cốc thủy tinh khô, lau sạch thành ngoài của cốc.",
          "Bước 2: Để cốc yên trên bàn, quan sát trong 15 phút.",
          "Bước 3: Ghi lại: nước đá thay đổi thế nào? Thành ngoài cốc có gì xuất hiện?",
          "Lưu ý: Không dùng tay cầm lâu vào cốc để tránh ảnh hưởng kết quả quan sát.",
        ],
      },
      {
        type: "table",
        title: "Bảng ghi kết quả thí nghiệm 1",
        rows: [
          ["Thời điểm", "Nước đá trong cốc", "Thành ngoài của cốc"],
          ["Ngay khi bắt đầu", "3 viên đá còn nguyên, thành cốc khô", "Khô, không có giọt nước"],
          ["Sau 5 phút", "Đá nhỏ lại, xuất hiện nước ở đáy cốc", "Mờ hơi nước, bắt đầu có giọt nhỏ"],
          ["Sau 15 phút", "Đá tan gần hết thành nước", "Nhiều giọt nước chảy thành vệt"],
        ],
      },
      {
        type: "content",
        title: "Thí nghiệm 2: Hơi nước ngưng tụ (giáo viên làm mẫu)",
        content: [
          "Giáo viên rót nước nóng vào cốc, úp một chiếc đĩa lạnh lên miệng cốc.",
          "Sau khoảng 2 phút, nhấc đĩa lên: mặt dưới đĩa có nhiều giọt nước nhỏ.",
          "Giải thích: Hơi nước bốc lên từ cốc gặp mặt đĩa lạnh đã ngưng tụ thành nước lỏng.",
          "An toàn: Học sinh chỉ quan sát, không tự đun hoặc cầm nước nóng.",
        ],
      },
      { type: "image", title: "Dụng cụ thí nghiệm", src: scienceExperimentImg, caption: "Cốc nước đá, ấm nước nóng và đĩa lạnh — ba vật dụng cho hai thí nghiệm của bài học." },
      {
        type: "summary",
        title: "Kết luận và đáp án câu hỏi khởi động",
        content: [
          "Đáp án: Giọt nước ở thành ngoài cốc đá KHÔNG phải nước thấm qua cốc. Đó là hơi nước trong không khí gặp thành cốc lạnh rồi ngưng tụ thành giọt.",
          "Nước chuyển thể khi nhiệt độ thay đổi: tan chảy, bay hơi, ngưng tụ, đông đặc.",
          "Việc về nhà: Quan sát nắp nồi cơm khi đang nấu và giải thích vì sao nắp nồi có nhiều giọt nước.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-bat-trang-pottery",
    type: "powerpoint",
    name: "Bài giảng Lịch sử và Địa lí 4 — Làng gốm Bát Tràng",
    englishName: "Grade 4 History & Geography — Bat Trang Pottery Village",
    category: "history",
    categoryLabel: "Lịch sử và địa lý",
    description: "Bài học về làng nghề gốm Bát Tràng (vùng Đồng bằng Bắc Bộ): vị trí, lịch sử làng nghề, quy trình làm gốm và các loại men truyền thống.",
    subjects: "Lịch sử và Địa lý",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 4",
    grade: 4,
    subject: "Lịch sử và Địa lý",
    tags: ["lịch sử và địa lí 4", "làng nghề", "bát tràng", "đồng bằng bắc bộ"],
    thumb: { layout: "history", note: "9 slide · 16:9" },
    theme: {
      name: "Pottery Earth", accent: "#8a5a2b", accent2: "#365f91", soft: "#faf6ef",
      line: "#ddd3bd", ink: "#3d2c14", muted: "#7c6a4d", bg: "#fffdf7",
      heroBg: "#5c4020", heroText: "#fff7e6", font: "Georgia", displayFont: "Georgia",
      variant: "history", pattern: "history",
    },
    title: "LÀNG GỐM BÁT TRÀNG",
    css: `.slide h2 { border-bottom: 1.5px solid var(--p-line); padding-bottom: 6px; }`,
    slides: [
      { type: "title", title: "LÀNG GỐM BÁT TRÀNG", subtitle: "Trường Tiểu học Hòa Bình · Lớp 4A · Môn Lịch sử và Địa lí — Vùng Đồng bằng Bắc Bộ" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Xác định được vị trí của làng Bát Tràng trên bản đồ hành chính Hà Nội.",
          "Kể được các bước chính trong quy trình làm gốm truyền thống.",
          "Nêu được một số sản phẩm và loại men nổi tiếng của gốm Bát Tràng.",
        ],
      },
      {
        type: "content",
        title: "Vị trí của làng Bát Tràng",
        content: [
          "Bát Tràng là một làng thuộc xã Bát Tràng, huyện Gia Lâm, thành phố Hà Nội.",
          "Làng nằm bên bờ tả ngạn sông Hồng — con sông mang phù sa và nguồn đất sét trắng quý cho nghề gốm.",
          "Từ trung tâm Hà Nội, qua cầu Chương Dương hoặc cầu Thanh Trì khoảng hơn 10 km là tới làng.",
        ],
      },
      {
        type: "content",
        title: "Lịch sử làng nghề",
        content: [
          "Nghề gốm ở Bát Tràng đã có từ khoảng thế kỉ 14–15, cách đây hơn 500 năm.",
          "Theo truyền thuyết và gia phả các dòng họ trong làng, những người thợ gốm từ vùng Bồ Bát (Ninh Bình ngày nay) theo vua Lý dời đô về Thăng Long và lập nghiệp tại đây.",
          "Trải qua nhiều thế kỉ, các thế hệ thợ gốm Bát Tràng vẫn giữ nghề và truyền lại bí quyết cho con cháu.",
        ],
      },
      {
        type: "table",
        title: "Quy trình làm gốm",
        rows: [
          ["Bước", "Việc làm"],
          ["1. Chọn và luyện đất", "Chọn đất sét trắng, phơi, đập nhỏ, ngâm nước và nhào kĩ cho dẻo, mịn"],
          ["2. Tạo hình", "Nặn sản phẩm trên bàn xoay, hoặc đổ khuôn, vuốt tay"],
          ["3. Phơi và sửa", "Phơi sản phẩm cho se khô, cắt gọt, làm nhẵn bề mặt"],
          ["4. Vẽ và tráng men", "Vẽ hoa văn bằng men lam, sau đó tráng lớp men phủ"],
          ["5. Nung", "Xếp vào lò, nung ở nhiệt độ khoảng 1.200°C trong nhiều giờ"],
        ],
      },
      {
        type: "content",
        title: "Sản phẩm và các loại men nổi tiếng",
        content: [
          "Sản phẩm quen thuộc: bát, đĩa, ấm chén, lọ hoa, chậu cảnh và đồ thờ cúng.",
          "Men lam: hoa văn màu xanh chàm vẽ dưới lớp men trong — loại men lâu đời và đặc trưng nhất của Bát Tràng.",
          "Men rạn: bề mặt có những vết rạn nhỏ như mạng nhện, tạo thành nét đẹp riêng.",
          "Ngày nay, gốm Bát Tràng còn có nhiều sản phẩm trang trí, quà lưu niệm phục vụ du khách.",
        ],
      },
      { type: "image", title: "Sản phẩm gốm Bát Tràng", src: localPotteryImg, caption: "Bình gốm vẽ men lam và bàn xoay — hai hình ảnh quen thuộc của làng nghề Bát Tràng." },
      {
        type: "content",
        title: "Làng nghề hôm nay",
        content: [
          "Du khách đến Bát Tràng có thể tham quan chợ gốm, xem nghệ nhân nặn gốm và tự tay trải nghiệm làm một sản phẩm nhỏ.",
          "Nhiều gia đình trong làng vẫn sống bằng nghề gốm; lớp trẻ học thêm cách bán hàng qua mạng để đưa sản phẩm đi xa hơn.",
          "Giữ nghề truyền thống cũng là giữ một phần văn hóa của Thăng Long — Hà Nội.",
        ],
      },
      {
        type: "summary",
        title: "Câu hỏi cuối bài và ghi nhớ",
        content: [
          "Câu 1: Vì sao làng gốm hình thành bên bờ sông Hồng? (Gợi ý đáp án: gần nguồn đất sét, thuận tiện vận chuyển bằng đường sông.)",
          "Câu 2: Kể lại quy trình làm gốm theo đúng thứ tự 5 bước.",
          "Ghi nhớ: Bát Tràng (Gia Lâm, Hà Nội) là làng gốm nổi tiếng hơn 500 năm tuổi, đặc trưng bởi men lam và men rạn.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-music-rhythm-beat",
    type: "powerpoint",
    name: "Bài giảng Âm nhạc lớp 3 — Nhịp 2/4 và nhạc cụ gõ",
    englishName: "Grade 3 Music — 2/4 Beat and Percussion",
    category: "primary",
    categoryLabel: "Giáo dục tiểu học",
    description: "Bài học Âm nhạc lớp 3 về nhịp 2/4: phách mạnh — phách nhẹ, giới thiệu nhạc cụ gõ và bài tập vỗ tay, gõ nhịp theo mẫu.",
    subjects: "Âm nhạc",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 3",
    grade: 3,
    subject: "Âm nhạc",
    tags: ["âm nhạc 3", "nhịp 2/4", "nhạc cụ gõ", "phách"],
    thumb: { layout: "kids", note: "9 slide · 16:9" },
    theme: {
      name: "Music Berry", accent: "#8c2f4a", accent2: "#b45309", soft: "#fdf4f6",
      line: "#f3c6d3", ink: "#4a1f2c", muted: "#a35d74", bg: "#fffbfc",
      heroBg: "#7f1d3a", heroText: "#fff5f7", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "kids", pattern: "kids",
    },
    title: "NHỊP 2/4 VÀ NHẠC CỤ GÕ",
    css: `.slide h2 { color: #8c2f4a; }`,
    slides: [
      { type: "title", title: "NHỊP 2/4 VÀ NHẠC CỤ GÕ", subtitle: "Trường Tiểu học Hòa Bình · Lớp 3B · Môn Âm nhạc" },
      {
        type: "content",
        title: "Mục tiêu bài học",
        content: [
          "Biết nhịp 2/4 có hai phách trong mỗi ô nhịp: phách thứ nhất mạnh, phách thứ hai nhẹ.",
          "Nhận biết được một số nhạc cụ gõ: trống con, thanh phách, sênh tiền, mõ.",
          "Vỗ tay và gõ đúng theo mẫu nhịp 2/4 khi nghe nhạc.",
        ],
      },
      {
        type: "content",
        title: "Nhịp 2/4 là gì?",
        content: [
          "Trong một bài hát viết ở nhịp 2/4, cứ hai phách lại lặp lại một lần: MẠNH — nhẹ, MẠNH — nhẹ.",
          "Hãy tưởng tượng bước chân khi đi đều: chân trái bước xuống (mạnh), chân phải bước tiếp (nhẹ).",
          "Số 2 ở trên cho biết mỗi ô nhịp có 2 phách; số 4 ở dưới cho biết mỗi phách bằng một nốt đen.",
          "Rất nhiều bài hát thiếu nhi quen thuộc được viết ở nhịp 2/4.",
        ],
      },
      {
        type: "two-column",
        title: "Thực hành vỗ tay",
        left: [
          "Mẫu nhịp 1 (đếm to):",
          "1 — 2 | 1 — 2 | 1 — 2 |",
          "Phách 1: vỗ tay thật to.",
          "Phách 2: vỗ nhẹ vào đùi.",
        ],
        right: [
          "Mẫu nhịp 2 (nhanh dần):",
          "MẠNH — nhẹ | MẠNH — nhẹ |",
          "Lượt 1: cả lớp làm chậm cùng cô.",
          "Lượt 2: từng tổ làm, các tổ còn lại lắng nghe và nhận xét.",
        ],
      },
      {
        type: "content",
        title: "Giới thiệu nhạc cụ gõ",
        content: [
          "Trống con: mặt trống căng bằng da, gõ bằng dùi, tiếng vang và rõ phách.",
          "Thanh phách: hai thanh tre hoặc gỗ gõ vào nhau, tiếng giòn, thường dùng để giữ nhịp.",
          "Sênh tiền: ba thanh gỗ gắn đồng xu, vừa gõ vừa lắc, hay dùng trong ca Huế và chầu văn.",
          "Mõ: làm bằng gỗ rỗng, gõ bằng dùi nhỏ, tiếng “cốc cốc” khô và ngắn.",
        ],
      },
      { type: "image", title: "Nhạc cụ gõ trong giờ học", src: musicRhythmImg, caption: "Trống con và các nhạc cụ gõ giúp cả lớp giữ nhịp đều khi hát." },
      {
        type: "content",
        title: "Trò chơi: Nghe và gõ lại",
        content: [
          "Cô gõ một mẫu nhịp 2 ô bằng thanh phách, cả lớp lắng nghe mà không gõ theo.",
          "Nghe xong, cả lớp gõ lại đúng mẫu đó bằng vỗ tay.",
          "Ai gõ sai phách mạnh — nhẹ thì cả tổ cùng làm lại chậm hơn.",
          "Đổi vai: một bạn lên làm “người gõ mẫu” cho cả lớp.",
        ],
      },
      {
        type: "content",
        title: "Kiểm tra nhanh",
        content: [
          "Câu 1: Mỗi ô nhịp 2/4 có mấy phách? — Đáp án: 2 phách.",
          "Câu 2: Trong nhịp 2/4, phách nào mạnh, phách nào nhẹ? — Đáp án: Phách 1 mạnh, phách 2 nhẹ.",
          "Câu 3: Thanh phách, trống con và mõ thuộc nhóm nhạc cụ nào? — Đáp án: Nhạc cụ gõ.",
        ],
      },
      {
        type: "summary",
        title: "Tổng kết và dặn dò",
        content: [
          "Nhịp 2/4: MẠNH — nhẹ, lặp lại đều đặn trong suốt bài hát.",
          "Dặn dò: Khi nghe một bài hát ở nhà, em hãy thử vỗ tay theo nhịp và đoán xem bài hát đó có phải nhịp 2/4 không.",
          "Bài sau: Học hát một bài hát nhịp 2/4 kết hợp gõ thanh phách.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-traffic-safety-helmet",
    type: "powerpoint",
    name: "Hoạt động trải nghiệm lớp 2 — Đội mũ bảo hiểm đúng cách",
    englishName: "Grade 2 Experiential Activity — Helmet Safety",
    category: "primary",
    categoryLabel: "Giáo dục tiểu học",
    description: "Bài học Hoạt động trải nghiệm lớp 2 về an toàn giao thông: nhận biết đèn tín hiệu, 4 bước đội mũ bảo hiểm đúng cách và trò chơi đúng — sai.",
    subjects: "Hoạt động trải nghiệm",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 2",
    grade: 2,
    subject: "Hoạt động trải nghiệm",
    tags: ["hoạt động trải nghiệm", "an toàn giao thông", "mũ bảo hiểm", "lớp 2"],
    thumb: { layout: "infographic", note: "9 slide · 16:9" },
    theme: {
      name: "Traffic Safety", accent: "#b91c1c", accent2: "#b45309", soft: "#fef9ec",
      line: "#fde0b2", ink: "#451a03", muted: "#92400e", bg: "#fffdf5",
      heroBg: "#7f1d1d", heroText: "#fff7ed", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "kids", pattern: "kids",
    },
    title: "ĐỘI MŨ BẢO HIỂM ĐÚNG CÁCH",
    css: `.slide h2 { color: #991b1b; }`,
    slides: [
      { type: "title", title: "ĐỘI MŨ BẢO HIỂM ĐÚNG CÁCH", subtitle: "Trường Tiểu học Hòa Bình · Lớp 2B · Môn Hoạt động trải nghiệm" },
      {
        type: "content",
        title: "Tình huống mở đầu",
        content: [
          "Sáng nay, bố chở Minh đi học bằng xe máy. Ra đến cổng, Minh mới nhớ mình quên đội mũ bảo hiểm.",
          "Bố dừng xe lại và nói: “Dù vội đến đâu, con cũng phải đội mũ bảo hiểm và cài quai cẩn thận rồi mới đi.”",
          "Theo em, vì sao bố của Minh nói như vậy?",
        ],
      },
      {
        type: "content",
        title: "Vì sao phải đội mũ bảo hiểm?",
        content: [
          "Khi đi xe máy, nếu không may bị ngã, đầu là phần dễ bị thương nhất. Mũ bảo hiểm giúp bảo vệ đầu của em.",
          "Theo quy định, người ngồi trên xe máy — kể cả trẻ em từ 6 tuổi trở lên — đều phải đội mũ bảo hiểm và cài quai đúng cách.",
          "Đội mũ nhưng không cài quai thì khi va chạm, mũ sẽ văng ra và không còn tác dụng bảo vệ.",
        ],
      },
      {
        type: "table",
        title: "Nhận biết đèn tín hiệu giao thông",
        rows: [
          ["Màu đèn", "Ý nghĩa", "Em cần làm gì"],
          ["Đỏ", "Dừng lại", "Đứng chờ sau vạch dừng"],
          ["Vàng", "Đi chậm lại, chuẩn bị dừng", "Không cố vượt qua ngã tư"],
          ["Xanh", "Được đi", "Quan sát hai bên rồi mới đi tiếp"],
        ],
      },
      {
        type: "content",
        title: "4 bước đội mũ bảo hiểm đúng cách",
        content: [
          "Bước 1: Đội mũ ngay ngắn lên đầu, vành mũ nằm ngang, cách lông mày khoảng hai ngón tay.",
          "Bước 2: Kéo hai dây quai xuống sát hai bên tai.",
          "Bước 3: Cài khóa quai dưới cằm cho chắc chắn.",
          "Bước 4: Kiểm tra: luồn vừa hai ngón tay giữa quai và cằm là vừa; lắc đầu nhẹ, mũ không xộc xệch.",
        ],
      },
      { type: "image", title: "Đội mũ đúng cách", src: trafficSafetyImg, caption: "Đèn tín hiệu giao thông và cách đội mũ bảo hiểm có cài quai đúng quy định." },
      {
        type: "content",
        title: "Trò chơi: Đúng hay sai?",
        content: [
          "Tình huống 1: Bạn Hoa đội mũ bảo hiểm nhưng để quai lỏng, không cài khóa. — SAI.",
          "Tình huống 2: Bạn Tuấn ngồi sau xe máy, hai tay ôm chặt vào người bố. — ĐÚNG.",
          "Tình huống 3: Bạn Mai ngồi trong ô tô và thò đầu ra ngoài cửa sổ để ngắm cảnh. — SAI.",
          "Tình huống 4: Khi qua đường ở nơi có vạch kẻ, bạn Hùng chờ đèn xanh dành cho người đi bộ rồi mới qua. — ĐÚNG.",
        ],
      },
      {
        type: "content",
        title: "Thực hành theo cặp",
        content: [
          "Hai bạn một cặp: một bạn đội mũ và cài quai, bạn còn lại kiểm tra theo 4 bước vừa học.",
          "Đổi vai cho nhau sau khi bạn thứ nhất làm xong.",
          "Cô giáo quan sát và nhận xét 3 cặp làm đúng và nhanh nhất.",
        ],
      },
      {
        type: "summary",
        title: "Cam kết của lớp mình",
        content: [
          "Em luôn đội mũ bảo hiểm và cài quai đúng cách khi ngồi trên xe máy.",
          "Em nhắc người thân trong gia đình cùng đội mũ bảo hiểm.",
          "Em chỉ qua đường khi có đèn tín hiệu cho phép và có người lớn đi cùng.",
        ],
      },
    ],
  }),

  pptTemplate({
    id: "ppt-homeroom-weekly-review",
    type: "powerpoint",
    name: "Sinh hoạt lớp — Tổng kết tuần cho giáo viên chủ nhiệm",
    englishName: "Homeroom Weekly Review",
    category: "report",
    categoryLabel: "Báo cáo chuyên đề",
    description: "Mẫu slide sinh hoạt lớp cuối tuần của giáo viên chủ nhiệm lớp 5: số liệu nề nếp, bảng thi đua giữa các tổ, tuyên dương, tồn tại và kế hoạch tuần tới.",
    subjects: "Công tác chủ nhiệm",
    levels: ["Tiểu học"],
    levelKeys: ["primary"],
    gradeRange: "Lớp 5",
    grade: 5,
    subject: "Sinh hoạt lớp",
    tags: ["sinh hoạt lớp", "chủ nhiệm", "thi đua", "tổng kết tuần"],
    thumb: { layout: "corporate", note: "9 slide · 16:9" },
    theme: {
      name: "Homeroom Green", accent: "#166534", accent2: "#b45309", soft: "#f2f7f2",
      line: "#c4d8c4", ink: "#1c2b1c", muted: "#5b7a5b", bg: "#ffffff",
      heroBg: "#14532d", heroText: "#f0fdf4", font: "Be Vietnam Pro", displayFont: "Be Vietnam Pro",
      variant: "corporate", pattern: "corporate",
    },
    title: "SINH HOẠT LỚP TUẦN 12",
    css: `.slide h2 { border-bottom: 1.5px solid var(--p-line); padding-bottom: 6px; }`,
    slides: [
      { type: "title", title: "SINH HOẠT LỚP TUẦN 12", subtitle: "Trường Tiểu học Hòa Bình · Lớp 5A · Giáo viên chủ nhiệm: Cô Phạm Thu Hà" },
      {
        type: "content",
        title: "Nề nếp trong tuần",
        content: [
          "Sĩ số: 38/38 bạn đi học đầy đủ cả tuần; không có bạn nghỉ học.",
          "Đi học đúng giờ: 37/38 bạn. Một bạn đến muộn sáng thứ Ba do trời mưa to (đã nhắc nhở riêng).",
          "Đồng phục và khăn quàng: đầy đủ. Trực nhật lớp sạch sẽ ở 4/5 buổi sáng.",
          "Giờ truy bài đầu giờ: các tổ duy trì tốt việc kiểm tra bài cũ cho nhau.",
        ],
      },
      {
        type: "table",
        title: "Kết quả thi đua giữa các tổ",
        rows: [
          ["Tổ", "Điểm học tập", "Điểm nề nếp", "Tổng điểm"],
          ["Tổ 1", "46", "47", "93"],
          ["Tổ 2", "48", "44", "92"],
          ["Tổ 3", "45", "48", "93"],
          ["Tổ 4", "49", "47", "96"],
        ],
      },
      {
        type: "content",
        title: "Tuyên dương trong tuần",
        content: [
          "Tổ 4 đạt điểm thi đua cao nhất tuần (96 điểm) — nhất là điểm học tập.",
          "Bạn Trần Gia Bảo (Tổ 2): đạt điểm 10 kiểm tra Toán và giúp bạn cùng tổ hiểu bài.",
          "Bạn Nguyễn Thảo My (Tổ 3): nhặt được hộp bút rơi ở sân trường, đã mang nộp cho cô giáo để trả lại bạn mất đồ.",
          "Đội sao đỏ của lớp hoàn thành tốt nhiệm vụ trực tuần, không để xảy ra vi phạm nào ở khu vực cầu thang.",
        ],
      },
      {
        type: "content",
        title: "Những việc cần khắc phục",
        content: [
          "Giờ ra chơi vẫn còn một số bạn chạy nhảy, đùa nghịch ở khu vực cầu thang tầng 2 — nguy hiểm và đã bị sao đỏ nhắc nhở 2 lần.",
          "2 bạn quên vở bài tập Toán trong buổi học thứ Năm.",
          "Cuối buổi học thứ Sáu, một số bàn học còn giấy vụn chưa dọn vào thùng rác.",
        ],
      },
      {
        type: "content",
        title: "Kế hoạch tuần 13",
        content: [
          "Thứ Tư, ngày 18/11/2026: Kiểm tra giữa học kì I môn Toán — các bạn mang đủ thước, compa và ôn lại bảng cửu chương, các phép tính với số thập phân.",
          "Cả tuần: Phát động phong trào “Đôi bạn cùng tiến” — mỗi bạn học khá kèm một bạn cần hỗ trợ trong tổ.",
          "Thứ Sáu: Tổng vệ sinh lớp học cuối tuần; các tổ kiểm tra lại góc thư viện của lớp.",
          "Nhắc nhở: Trời chuyển lạnh, các bạn mặc đủ ấm và mang theo áo mưa khi đi học.",
        ],
      },
      {
        type: "table",
        title: "Phân công trực nhật tuần 13",
        rows: [
          ["Ngày", "Tổ trực nhật", "Việc chính"],
          ["Thứ Hai — Thứ Ba", "Tổ 1", "Quét lớp, lau bảng, tưới cây góc lớp"],
          ["Thứ Tư — Thứ Năm", "Tổ 2", "Quét lớp, sắp xếp góc thư viện"],
          ["Thứ Sáu", "Tổ 3 và Tổ 4", "Tổng vệ sinh, kê lại bàn ghế"],
        ],
      },
      { type: "image", title: "Bảng thi đua của lớp", src: homeroomBoardImg, caption: "Bảng thi đua tuần được cập nhật vào tiết sinh hoạt cuối tuần." },
      {
        type: "summary",
        title: "Lời nhắn của cô",
        content: [
          "Tuần 12 lớp mình giữ nề nếp tốt và có nhiều việc đáng khen. Cô mong tuần 13 các bạn chú ý an toàn khi ra chơi và chuẩn bị thật tốt cho bài kiểm tra giữa kì.",
          "Nhiệm vụ chung: Mỗi bạn tự kiểm tra cặp sách tối Chủ nhật — đủ sách vở và đồ dùng cho ngày thứ Hai.",
          "Chúc cả lớp cuối tuần vui vẻ bên gia đình.",
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
