// components/studio/pageBackgrounds.jsx
//
// NỀN TRANG của bài học AI Studio. Mỗi trang lưu `background` = ID preset
// (server kiểm tra allowlist `PAGE_BACKGROUNDS`), còn phần vẽ nằm ở đây để
// canvas soạn thảo, thumbnail và trình chơi của học sinh luôn giống nhau.
//
// Bộ preset đầu tiên bám mẫu "bảng xanh phấn" (SÁCH MỚI PHÁT HÀNH):
// bảng xanh có lưới phấn mờ + khung gỗ + viền phấn đứt nét.

/**
 * Preset nền — `preview` dùng cho ô chọn nhỏ ở sidebar, `style` dùng cho canvas.
 */
export const PAGE_BACKGROUNDS = [
  {
    id: "white",
    label: "Trắng",
    hint: "Nền trắng mặc định",
    preview: { background: "#FFFFFF" },
    style: { background: "#FFFFFF" },
  },
  {
    id: "chalkboard",
    label: "Bảng xanh",
    hint: "Bảng phấn + khung gỗ",
    preview: { background: "#2F6B52" },
    style: {
      background: "#2F6B52",
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)," +
        "linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)," +
        "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08), transparent 45%)," +
        "radial-gradient(circle at 85% 80%, rgba(0,0,0,0.18), transparent 55%)",
      backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%",
      boxShadow:
        "inset 0 0 0 16px #9C6B43," +
        "inset 0 0 0 18px rgba(60,32,12,0.55)," +
        "inset 0 0 48px rgba(0,0,0,0.28)",
    },
  },
  {
    id: "paper",
    label: "Giấy kem",
    hint: "Giấy ấm có dòng kẻ",
    preview: { background: "#FFFBF2" },
    style: {
      background: "#FFFBF2",
      backgroundImage:
        "repeating-linear-gradient(180deg, transparent 0 46px, rgba(198,170,120,0.35) 46px 47px)",
      backgroundSize: "100% 47px",
    },
  },
  {
    id: "grid",
    label: "Vở ô ly",
    hint: "Lưới xanh nhạt",
    preview: { background: "#F3F8FF" },
    style: {
      background: "#F7FBFF",
      backgroundImage:
        "linear-gradient(rgba(87,141,214,0.22) 1px, transparent 1px)," +
        "linear-gradient(90deg, rgba(87,141,214,0.22) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    },
  },
  {
    id: "sky",
    label: "Trời xanh",
    hint: "Gradient sáng",
    preview: { background: "linear-gradient(180deg,#D9ECFF,#F8FCFF)" },
    style: {
      background: "linear-gradient(180deg,#D9ECFF,#F8FCFF)",
    },
  },
  {
    id: "night",
    label: "Trời đêm",
    hint: "Xanh đậm + sao",
    preview: { background: "linear-gradient(180deg,#1B2A4A,#0E1A30)" },
    style: {
      background: "linear-gradient(180deg,#1B2A4A,#0E1A30)",
      backgroundImage:
        "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.9) 1.5px, transparent 2px)," +
        "radial-gradient(circle at 32% 62%, rgba(255,255,255,0.7) 1.5px, transparent 2px)," +
        "radial-gradient(circle at 68% 26%, rgba(255,255,255,0.8) 1.5px, transparent 2px)," +
        "radial-gradient(circle at 82% 72%, rgba(255,255,255,0.65) 1.5px, transparent 2px)," +
        "radial-gradient(circle at 52% 88%, rgba(255,255,255,0.55) 1.5px, transparent 2px)",
      backgroundSize: "100% 100%",
    },
  },
];

const BY_ID = new Map(PAGE_BACKGROUNDS.map((b) => [b.id, b]));

export function getPageBackground(id) {
  return BY_ID.get(id) || BY_ID.get("white");
}

/** Style nền để gắn thẳng vào stage 1280×720. */
export function pageBackgroundStyle(id) {
  return getPageBackground(id).style;
}

/** Style lớp phủ thêm của nền (viền phấn đứt nét cho bảng xanh). */
export function pageBackgroundOverlayStyle(id) {
  if (id !== "chalkboard") return null;
  return {
    position: "absolute",
    inset: 26,
    border: "3px dashed rgba(255,255,255,0.42)",
    borderRadius: 10,
    pointerEvents: "none",
    zIndex: 0,
  };
}
