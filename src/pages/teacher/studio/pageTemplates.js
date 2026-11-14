// pages/teacher/studio/pageTemplates.js
//
// MẪU TRANG dựng sẵn cho AI Studio + danh sách emoji trang trí.
//
// Mẫu "Bảng xanh — Sách mới phát hành" tái hiện đúng bố cục ảnh mẫu:
//   nền bảng xanh khung gỗ, chữ SÁCH trắng, MỚI PHÁT HÀNH vàng, cùng các
//   hình phấn (xe buýt, thước, máy bay giấy, ngôi sao, trái tim, mặt cười,
//   bút chì). Toạ độ theo canvas 1280×720; áp mẫu là MỘT bước undo.

/** Emoji dùng cho tab "Trang trí" — bấm là thêm một phần tử `decor`. */
export const DECOR_EMOJIS = [
  { emoji: "🚌", label: "Xe buýt" },
  { emoji: "📏", label: "Thước kẻ" },
  { emoji: "✈️", label: "Máy bay giấy" },
  { emoji: "⭐", label: "Ngôi sao" },
  { emoji: "❤️", label: "Trái tim" },
  { emoji: "🙂", label: "Mặt cười" },
  { emoji: "✏️", label: "Bút chì" },
  { emoji: "📚", label: "Sách" },
  { emoji: "📖", label: "Vở mở" },
  { emoji: "🎈", label: "Bóng bay" },
  { emoji: "🌈", label: "Cầu vồng" },
  { emoji: "🍎", label: "Quả táo" },
  { emoji: "🌱", label: "Mầm cây" },
  { emoji: "🌟", label: "Sao lấp lánh" },
  { emoji: "🏆", label: "Cúp" },
  { emoji: "🎯", label: "Mục tiêu" },
  { emoji: "🧠", label: "Bộ não" },
  { emoji: "⚡", label: "Tia sét" },
  { emoji: "🖍️", label: "Sáp màu" },
  { emoji: "📌", label: "Đinh ghim" },
];

const decor = (emoji, x, y, w, h) => ({
  type: "decor", x, y, w, h, props: { emoji },
});

/**
 * Mẫu trang. `build()` trả { background, title, elements } — hook
 * `applyPageTemplate` sẽ thay toàn bộ nội dung trang hiện tại.
 */
export const PAGE_TEMPLATES = [
  {
    id: "chalkboard-book",
    name: "SÁCH MỚI PHÁT HÀNH",
    desc: "Bảng xanh khung gỗ + hình phấn",
    background: "chalkboard",
    build: () => ({
      background: "chalkboard",
      title: "SÁCH MỚI PHÁT HÀNH",
      elements: [
        {
          type: "title", x: 240, y: 200, w: 800, h: 170,
          props: { text: "SÁCH", fontSize: 120, align: "center", color: "#FFFFFF" },
        },
        {
          type: "text", x: 240, y: 392, w: 800, h: 110,
          props: { text: "MỚI PHÁT HÀNH", fontSize: 72, align: "center", color: "#FFD84D" },
        },
        decor("🙂", 190, 84, 120, 120),
        decor("✈️", 770, 70, 140, 130),
        decor("⭐", 1030, 140, 120, 120),
        decor("❤️", 1040, 470, 120, 120),
        decor("🚌", 110, 520, 210, 170),
        decor("📏", 385, 528, 170, 130),
        decor("✏️", 620, 515, 175, 150),
      ],
    }),
  },
  {
    id: "title-basic",
    name: "Trang tiêu đề",
    desc: "Nền trắng, tiêu đề + dòng phụ",
    background: "white",
    build: () => ({
      background: "white",
      title: "Trang tiêu đề",
      elements: [
        {
          type: "title", x: 140, y: 200, w: 1000, h: 140,
          props: { text: "TÊN BÀI HỌC", fontSize: 72, align: "center", color: "#1D2E4A" },
        },
        {
          type: "text", x: 240, y: 360, w: 800, h: 80,
          props: { text: "Môn học · Lớp …", fontSize: 32, align: "center", color: "#31517E" },
        },
      ],
    }),
  },
  {
    id: "grid-exercise",
    name: "Vở ô ly — bài tập",
    desc: "Nền lưới xanh + khung ghi chú",
    background: "grid",
    build: () => ({
      background: "grid",
      title: "Bài tập",
      elements: [
        {
          type: "title", x: 120, y: 60, w: 1040, h: 100,
          props: { text: "BÀI TẬP", fontSize: 56, align: "left", color: "#1D4E89" },
        },
        {
          type: "note", x: 120, y: 200, w: 1040, h: 420,
          props: { text: "Ghi đề bài hoặc hướng dẫn làm bài ở đây…", fontSize: 26 },
        },
        decor("✏️", 1090, 100, 90, 90),
      ],
    }),
  },
];
